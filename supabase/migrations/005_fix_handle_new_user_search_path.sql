-- ============================================================
-- Fix: handle_new_user() fallaba en cada registro nuevo
-- ============================================================
-- La función es SECURITY DEFINER pero no fijaba su propio search_path.
-- Supabase Auth ejecuta el trigger con el rol supabase_auth_admin, cuyo
-- search_path es solo "auth" (no incluye "public"), así que las tablas
-- businesses/whatsapp_templates no se resolvían y el INSERT en
-- auth.users fallaba con "Database error saving new user".

ALTER FUNCTION public.handle_new_user() SET search_path = public;
