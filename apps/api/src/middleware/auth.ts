import type { NextFunction, Request, Response } from "express";
import type { SupabaseClient } from "@supabase/supabase-js";
import { anonClient, userClient } from "../supabase.js";
import { env } from "../env.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId: string;
      db: SupabaseClient;
    }
  }
}

/**
 * Verifies the Bearer access token issued by Supabase Auth and attaches both the
 * user id and a request-scoped, RLS-bound DB client to the request.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!env.isConfigured()) {
    return res.status(500).json({ error: "Server not configured: missing SUPABASE_URL / SUPABASE_ANON_KEY" });
  }
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Missing Authorization header" });

  try {
    const { data, error } = await anonClient().auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: "Invalid or expired token" });
    req.userId = data.user.id;
    req.db = userClient(token);
    next();
  } catch {
    return res.status(401).json({ error: "Auth verification failed" });
  }
}
