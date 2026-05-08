import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables. Check .env file.');
}

/**
 * Public client — uses anon key, respects RLS.
 * Use for user-facing auth operations (signUp, signIn).
 */
export const supabaseAnon: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin client — uses service role key, bypasses RLS.
 * Use for all privileged DB operations (CRUD, admin queries).
 */
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
