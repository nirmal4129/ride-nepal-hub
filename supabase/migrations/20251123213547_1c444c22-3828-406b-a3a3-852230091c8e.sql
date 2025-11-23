-- Fix mutable search_path in database functions
-- This prevents potential security issues by ensuring functions use a fixed search path

-- Update update_updated_at_column function with search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update generate_username function with search_path
CREATE OR REPLACE FUNCTION public.generate_username()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_username TEXT;
  username_exists BOOLEAN;
BEGIN
  LOOP
    new_username := 'user_' || substr(md5(random()::text), 1, 8);
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE username = new_username) INTO username_exists;
    EXIT WHEN NOT username_exists;
  END LOOP;
  RETURN new_username;
END;
$$;