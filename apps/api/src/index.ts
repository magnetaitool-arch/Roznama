import { createApp } from "./app.js";
import { env } from "./env.js";

const app = createApp();
app.listen(env.port, () => {
  console.log(`[roznama-api] listening on http://localhost:${env.port}`);
  if (!env.isConfigured()) {
    console.warn("[roznama-api] SUPABASE_URL / SUPABASE_ANON_KEY not set — API calls will 500 until configured.");
  }
});
