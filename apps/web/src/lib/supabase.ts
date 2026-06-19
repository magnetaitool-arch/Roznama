import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Whether Supabase auth + cloud sync are configured. When false the app runs in
 * a fully functional **offline mode** (localStorage only) so it's usable and
 * demoable without a backend — production simply sets the two env vars.
 */
export const cloudEnabled = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = cloudEnabled
  ? createClient(url!, anonKey!, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;
