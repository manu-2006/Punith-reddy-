# Production-readiness hardening

## Changes in this branch

- Admin access is revalidated against the Supabase profile on each boot; cached browser roles are no longer trusted.
- Admin password recovery uses the same 10-character letters-and-numbers rule as the shared validator.
- Ticket navigation proceeds even if the optional confirmation-email request fails.
- Dialogs trap keyboard focus and restore focus to the invoking control.
- The service worker only caches the three static assets it needs, does not cache route/query responses, cleans up older caches, and prefers fresh assets.
- Citizen grievances and appointment requests are routed through the authenticated `public-submit` Edge Function.
- The Edge Function validates request shape, size, fields, auth identity, and current privacy acceptance. Public supporter/contact submissions fail closed if Turnstile is not configured or verification fails.
- The migration removes direct client INSERT access to the four submission tables, fixes owner preservation for service-role inserts, and adds indexes for foreign keys flagged by Supabase.

## Required rollout order

1. Configure a Cloudflare Turnstile widget for the production domain.
2. Set the public site key in Admin -> Settings.
3. Set `TURNSTILE_SECRET_KEY` directly in Supabase Edge Function secrets. Never commit it to GitHub or send it in chat.
4. Deploy `supabase/functions/public-submit/index.ts` with JWT verification disabled at the gateway because the function explicitly validates citizen JWTs itself and also accepts public CAPTCHA-verified submissions.
5. Smoke-test supporter registration and duplicate detection, citizen grievance submission, citizen appointment submission, and contact submission.
6. Only then apply `supabase/migrations/20261018190000_harden_public_submissions.sql`. This migration intentionally removes direct INSERT access; applying it before the Edge Function is deployed will break submissions.
7. Enable Supabase Auth leaked-password protection in Authentication -> Attack Protection. This is an Auth dashboard setting and is not changed by SQL migrations.

## Validation completed

- JavaScript parse checks passed for `admin.js`, `index.js`, `lib.js`, `sw.js`, and `citizen.js`.
- Source-level review confirmed that the existing HTML and CSS files are not modified by this branch.
- Live browser/mobile regression tests and a Deno runtime test of the Edge Function remain to be run before production rollout.
- Supabase's advisor findings about public-callable `SECURITY DEFINER` functions need to be evaluated individually; ticket lookup, public supporter cards, public counts, and the public leaderboard are intentional public features. Administrative functions already check staff roles in their bodies. Do not revoke these functions wholesale without breaking intended features.
