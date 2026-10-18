# Email sender (Resend) and CAPTCHA (Cloudflare Turnstile) setup

Do the steps in this order. Each step is safe on its own.

## A. Email sender with Resend
1. Create a Resend account and an API key (resend.com -> API Keys).
2. Optional but recommended: add and verify your own domain in Resend (Domains). Until you do, Resend only lets you send test emails from `onboarding@resend.dev` to the email address you signed up with.
3. In Supabase -> Edge Functions -> Secrets, add:
   - `RESEND_API_KEY` = your Resend API key
   - `RESEND_FROM` = `Punith Reddy <hello@yourdomain.in>` (use `Punith Reddy <onboarding@resend.dev>` until your domain is verified)
   - `SITE_URL` = your website address, for example `https://punith-reddy.vercel.app`
4. In Supabase -> Authentication -> SMTP Settings, switch on "Enable custom SMTP" and enter:
   - Host: `smtp.resend.com`   Port: `465`
   - Username: `resend`   Password: your Resend API key
   - Sender email: the same address as `RESEND_FROM`   Sender name: `Punith Reddy`
5. In Supabase -> Authentication -> Email Templates, paste the HTML files from the `supabase-email-templates` folder:
   - Confirm signup -> `confirm-signup.html` (subject: `Confirm your email`)
   - Reset password -> `reset-password.html` (subject: `Reset your password`)
   - Invite user -> `invite-user.html`
6. Open the admin panel -> Settings -> "Send me a test email".

Emails the website now sends by itself: ticket confirmation after booking, and an update email when staff change the status or reply to a citizen's issue or meeting request.

## B. CAPTCHA with Cloudflare Turnstile
1. In Cloudflare -> Turnstile, add a widget for your website domain (for example `punith-reddy.vercel.app`) and copy the Site key and the Secret key.
2. Admin panel -> Settings -> paste the Site key into "Cloudflare Turnstile site key" and save. The security check now appears on the join form, contact form, citizen sign-in and sign-up, admin sign-in and password reset.
3. Add the Secret key in Supabase -> Edge Functions -> Secrets as `TURNSTILE_SECRET_KEY`. Public supporter/contact submissions fail closed until this secret is configured and a valid token is verified by the server.
4. Optional, protects sign-ups and logins directly: Supabase -> Authentication -> Attack Protection -> enable CAPTCHA, choose Turnstile and enter the Secret key.
5. The production hardening migration removes direct client INSERT access for supporter/contact/grievance/appointment submissions. Submit these through the `public-submit` Edge Function only. Apply the migration only after the updated Edge Function has been deployed and smoke-tested.
