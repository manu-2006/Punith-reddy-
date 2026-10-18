import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (o: unknown, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" } });

const PHONE = /^[6-9][0-9]{9}$/;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const BAD_NAME = /[0-9<>@#$%^*=+|~_{}]/;
const REF = /^[A-Z0-9]{7}$/;
const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const validName = (v: string) => v.length >= 2 && v.length <= 100 && !BAD_NAME.test(v);

async function verifyTurnstile(req: Request, token: unknown) {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) return { ok: false, status: 503, message: "The security check is not configured yet. Please contact the site administrator." };
  if (typeof token !== "string" || token.length < 1 || token.length > 2048)
    return { ok: false, status: 400, message: "Please complete the security check." };
  const body = new URLSearchParams({ secret, response: token });
  const ip = req.headers.get("cf-connecting-ip");
  if (ip) body.set("remoteip", ip);
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    if (!response.ok) return { ok: false, status: 502, message: "The security check is temporarily unavailable. Please try again." };
    const result = await response.json();
    if (!result.success) return { ok: false, status: 400, message: "The security check failed. Please try again." };
    return { ok: true, status: 200, message: "" };
  } catch {
    return { ok: false, status: 502, message: "The security check is temporarily unavailable. Please try again." };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);
  const length = Number(req.headers.get("content-length") || "0");
  if (length > 20000) return json({ error: "Request is too large." }, 413);

  try {
    const payload = await req.json();
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return json({ error: "Invalid request." }, 400);
    const { kind, data, token } = payload as { kind?: string; data?: Record<string, unknown>; token?: unknown };
    if (!data || typeof data !== "object" || Array.isArray(data)) return json({ error: "Invalid form data." }, 400);
    const url = Deno.env.get("SUPABASE_URL");
    const anon = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anon || !serviceKey) return json({ error: "The submission service is not configured." }, 503);
    const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

    if (kind === "supporter" || kind === "contact") {
      const captcha = await verifyTurnstile(req, token);
      if (!captcha.ok) return json({ error: captcha.message }, captcha.status);
      const name = s(data.name, 100);
      if (!validName(name)) return json({ error: "Please enter a valid name." }, 400);
      const phone = s(data.phone, 10);
      let result: any;
      let extra: Record<string, unknown> = {};
      if (kind === "supporter") {
        if (!PHONE.test(phone)) return json({ error: "Please enter a valid 10-digit mobile number." }, 400);
        const ref = s(data.ref, 7).toUpperCase();
        result = await db.from("supporters").insert({
          name, phone, area: s(data.area, 160) || null,
          referred_by: REF.test(ref) ? ref : null,
          show_on_leaderboard: data.leaderboard === true,
        }).select("ref_code,card_code").single();
        if (!result.error && result.data) extra = { ref_code: result.data.ref_code, card_code: result.data.card_code };
      } else {
        const email = s(data.email, 254), message = s(data.message, 5000);
        if (phone && !PHONE.test(phone)) return json({ error: "Please enter a valid 10-digit mobile number." }, 400);
        if (email && !EMAIL.test(email)) return json({ error: "Please enter a valid email address." }, 400);
        if (message.length < 5) return json({ error: "Please write a little more." }, 400);
        result = await db.from("contact_messages").insert({
          name, phone: phone || null, email: email || null,
          subject: s(data.subject, 160) || null, message,
        });
      }
      if (result.error) {
        if (result.error.code === "23505") return json({ error: "Already registered.", code: "23505" }, 409);
        if (result.error.code === "23514" || /Too many submissions|valid 10-digit/i.test(result.error.message))
          return json({ error: result.error.message }, 400);
        return json({ error: "Something went wrong. Please try again." }, 500);
      }
      return json({ ok: true, ...extra });
    }

    if (kind === "grievance" || kind === "appointment") {
      const authorization = req.headers.get("Authorization") || "";
      if (!/^Bearer\s+\S+/i.test(authorization)) return json({ error: "Please sign in again." }, 401);
      const authClient = createClient(url, anon, {
        global: { headers: { Authorization: authorization } },
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data: authData, error: authError } = await authClient.auth.getUser();
      const user = authData?.user;
      if (authError || !user) return json({ error: "Please sign in again." }, 401);
      const { data: profile, error: profileError } = await db.from("profiles")
        .select("full_name,phone,email,privacy_version,privacy_accepted_at")
        .eq("id", user.id).maybeSingle();
      if (profileError || !profile) return json({ error: "Could not verify your profile. Please try again." }, 500);
      if (profile.privacy_version !== "2026-10" || !profile.privacy_accepted_at)
        return json({ error: "Please accept the current privacy policy before submitting." }, 403);
      const email = s(user.email, 254);
      const name = s(profile.full_name || user.user_metadata?.full_name || email.split("@")[0] || "Citizen", 100);
      if (!validName(name)) return json({ error: "Please update your profile with a valid name first." }, 400);
      const rawPhone = s(profile.phone || user.user_metadata?.phone, 30);
      const phone = PHONE.test(rawPhone) ? rawPhone : null;

      if (kind === "grievance") {
        const category = s(data.category, 80), subject = s(data.subject, 160), message = s(data.message, 5000);
        if (subject.length < 3) return json({ error: "Please enter a subject of at least 3 characters." }, 400);
        if (message.length < 10) return json({ error: "Please describe the issue in at least 10 characters." }, 400);
        const result = await db.from("grievances").insert({
          name, phone, email: EMAIL.test(email) ? email : null,
          category: category || null, subject, message, user_id: user.id,
        });
        if (result.error) {
          if (result.error.code === "23514" || /Too many submissions/i.test(result.error.message))
            return json({ error: result.error.message }, 400);
          return json({ error: "Could not submit your issue. Please try again." }, 500);
        }
        return json({ ok: true });
      }

      const purpose = s(data.purpose, 160), message = s(data.message, 4000);
      const date = s(data.preferred_date, 10), time = s(data.preferred_time, 80);
      if (!phone) return json({ error: "Add a valid 10-digit mobile number in your profile first." }, 400);
      if (purpose.length < 3) return json({ error: "Please enter a purpose of at least 3 characters." }, 400);
      if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: "Please choose a valid preferred date." }, 400);
      const result = await db.from("appointment_requests").insert({
        name, phone, email: EMAIL.test(email) ? email : null,
        preferred_date: date || null, preferred_time: time || null,
        purpose, message: message || null, user_id: user.id,
      });
      if (result.error) {
        if (result.error.code === "23514" || /Too many submissions/i.test(result.error.message))
          return json({ error: result.error.message }, 400);
        return json({ error: "Could not submit your appointment request. Please try again." }, 500);
      }
      return json({ ok: true });
    }
    return json({ error: "Unknown request." }, 400);
  } catch {
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
