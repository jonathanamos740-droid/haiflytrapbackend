-- Run this in the Supabase SQL Editor to create the push_subscriptions table

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- Optional: reference to auth.users if needed
    user_type TEXT, -- e.g., 'admin', 'handler', 'customer'
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access so users can subscribe from the frontend
CREATE POLICY "Enable insert for anonymous users" ON public.push_subscriptions
    FOR INSERT WITH CHECK (true);

-- Allow service role to read
CREATE POLICY "Enable select for service role" ON public.push_subscriptions
    FOR SELECT USING (true);

-- Allow deleting subscriptions
CREATE POLICY "Enable delete for anonymous users" ON public.push_subscriptions
    FOR DELETE USING (true);

-- Optional: Index on user_type for faster targeting of broadcasts
CREATE INDEX IF NOT EXISTS push_subscriptions_user_type_idx ON public.push_subscriptions (user_type);
