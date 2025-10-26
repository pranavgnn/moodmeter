-- Migration to add email_verified column to profiles table
-- Run this in Supabase SQL Editor

-- Add email_verified column with default false
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE NOT NULL;

-- Update existing profiles to be verified (if they were created before this change)
-- Note: In production, you might want to handle this differently
UPDATE profiles SET email_verified = TRUE WHERE email_verified IS NULL;

-- Update the trigger function to include email_verified
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, email_verified)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.email,
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;