-- Run this in your Supabase SQL Editor
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS rider_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS rider_phone TEXT;
ALTER TABLE public.push_subscriptions ADD COLUMN IF NOT EXISTS user_email TEXT;
