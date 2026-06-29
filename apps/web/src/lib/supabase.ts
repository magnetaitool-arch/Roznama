import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Public Supabase config. The publishable (anon) key is safe to ship in the
 * client — every table is protected by Row Level Security — so we bake the
 * project defaults in to keep deploys zero-config. Override via env if needed.
 */
const DEFAULT_URL = "https://azzwvdyxuppovmviklbo.supabase.co";
const DEFAULT_ANON = "sb_publishable_zy9aipM-AROrmqCtAiqvxQ_T00aiUGt";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_URL;
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_ANON;

/**
 * Whether Supabase auth + cloud sync are configured. When false the app runs in
 * a fully functional **offline mode** (localStorage only).
 */
export const cloudEnabled = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = cloudEnabled
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Exchange the OAuth `?code=` / token hash for a session on load.
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    })
  : null;
