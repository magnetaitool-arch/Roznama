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

/**
 * Service-role client (bypasses RLS). Used only by the reminders cron, which is
 * not a logged-in user and must read across all users' subscriptions/tasks.
 */
export function serviceClient(): SupabaseClient {
  if (!env.supabaseServiceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");
  return createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
