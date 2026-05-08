import { SupabaseClient } from '@supabase/supabase-js';
/**
 * Public client — uses anon key, respects RLS.
 * Use for user-facing auth operations (signUp, signIn).
 */
export declare const supabaseAnon: SupabaseClient;
/**
 * Admin client — uses service role key, bypasses RLS.
 * Use for all privileged DB operations (CRUD, admin queries).
 */
export declare const supabaseAdmin: SupabaseClient;
//# sourceMappingURL=supabase.d.ts.map