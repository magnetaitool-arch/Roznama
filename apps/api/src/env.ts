import "dotenv/config";

function required(name: string, value: string | undefined): string {
  if (!value) {
    // Don't crash at import time in serverless cold-paths that only hit /health;
    // routes that need the value surface a clear 500 instead.
    console.warn(`[roznama-api] missing env var ${name}`);
    return "";
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 8787),
  supabaseUrl: required("SUPABASE_URL", process.env.SUPABASE_URL),
  supabaseAnonKey: required("SUPABASE_ANON_KEY", process.env.SUPABASE_ANON_KEY),
  // Optional: used only for admin tasks; per-request clients use the user token.
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  isConfigured(): boolean {
    return Boolean(this.supabaseUrl && this.supabaseAnonKey);
  },
};
