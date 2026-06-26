import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 8787),
  // Public Supabase config (publishable/anon key is RLS-protected) — baked in as
  // defaults so the deploy needs no env config; override via env vars if desired.
  supabaseUrl: process.env.SUPABASE_URL || "https://azzwvdyxuppovmviklbo.supabase.co",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "sb_publishable_zy9aipM-AROrmqCtAiqvxQ_T00aiUGt",
  // Optional: used only for admin tasks; per-request clients use the user token.
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  isConfigured(): boolean {
    return Boolean(this.supabaseUrl && this.supabaseAnonKey);
  },
};
