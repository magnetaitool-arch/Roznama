// Vercel serverless entry — wraps the Express app so the whole API deploys as a
// single function under /api/*. Local dev uses apps/api/src/index.ts instead.
import { createApp } from "../apps/api/src/app.js";

export default createApp();
