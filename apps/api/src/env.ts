import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 8787),
  // Public Supabase config (publishable/anon key is RLS-protected) — baked in as
  // defaults so the deploy needs no env config; override via env vars if desired.
  supabaseUrl: process.env.SUPABASE_URL || "https://azzwvdyxuppovmviklbo.supabase.co",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "sb_publishable_zy9aipM-AROrmqCtAiqvxQ_T00aiUGt",
  // Used by the reminders cron to read across users + bypass RLS. Must be set
  // on the server for push reminders to work (never exposed to the client).
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",

  // Web Push (VAPID). Public key is safe to ship; private key is server-only.
  vapidPublicKey:
    process.env.VAPID_PUBLIC_KEY ||
    "BJ8DRueCT0GwHes_lejPDJCxO8rHYDSQ_16pRkThABcaz0_gf3j_kO6qILmwlR229HWZ0CiPWL7sYVmR3XHJ6KI",
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY ?? "",
  vapidSubject: process.env.VAPID_SUBJECT || "mailto:magnetaitool@gmail.com",
  cronSecret: process.env.CRON_SECRET ?? "",

  isConfigured(): boolean {
    return Boolean(this.supabaseUrl && this.supabaseAnonKey);
  },
  pushEnabled(): boolean {
    return Boolean(this.vapidPublicKey && this.vapidPrivateKey);
  },
};
