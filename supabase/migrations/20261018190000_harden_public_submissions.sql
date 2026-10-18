-- Route all public/citizen submissions through the validated Edge Function.
-- The Edge Function uses the service role only after validation/authentication.
DROP POLICY IF EXISTS "Anyone can join as supporter" ON public.supporters;
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Public can submit grievances" ON public.grievances;
DROP POLICY IF EXISTS "public can submit appointment requests" ON public.appointment_requests;

REVOKE INSERT ON TABLE public.supporters FROM PUBLIC, anon, authenticated;
REVOKE INSERT ON TABLE public.contact_messages FROM PUBLIC, anon, authenticated;
REVOKE INSERT ON TABLE public.grievances FROM PUBLIC, anon, authenticated;
REVOKE INSERT ON TABLE public.appointment_requests FROM PUBLIC, anon, authenticated;

-- Cover foreign keys flagged by the Supabase performance advisor.
CREATE INDEX IF NOT EXISTS achievements_created_by_fk_idx ON public.achievements (created_by);
CREATE INDEX IF NOT EXISTS alert_log_sent_by_fk_idx ON public.alert_log (sent_by);
CREATE INDEX IF NOT EXISTS appointment_requests_handled_by_fk_idx ON public.appointment_requests (handled_by);
CREATE INDEX IF NOT EXISTS event_rsvps_checked_in_by_fk_idx ON public.event_rsvps (checked_in_by);
CREATE INDEX IF NOT EXISTS event_rsvps_user_id_fk_idx ON public.event_rsvps (user_id);
CREATE INDEX IF NOT EXISTS service_activities_created_by_fk_idx ON public.service_activities (created_by);
CREATE INDEX IF NOT EXISTS site_notifications_created_by_fk_idx ON public.site_notifications (created_by);
CREATE INDEX IF NOT EXISTS videos_created_by_fk_idx ON public.videos (created_by);
CREATE INDEX IF NOT EXISTS youth_initiatives_created_by_fk_idx ON public.youth_initiatives (created_by);
