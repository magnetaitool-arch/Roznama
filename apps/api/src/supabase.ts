import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env.js";

/**
 * A Supabase client bound to the *caller's* access token. Because every query
 * runs with the user's JWT, Postgres Row Level Security enforces ownership —
 * the API never has to filter by user_id manually for reads/writes.
 */
export function userClient(accessToken: string): SupabaseClient {
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Anon client used only to verify tokens (`auth.getUser`). */
export function anonClient(): SupabaseClient {
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
