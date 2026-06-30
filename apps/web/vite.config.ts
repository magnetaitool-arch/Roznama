import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // TEMPORARY: ship a self-destroying service worker that unregisters any
      // stuck SW and clears its caches on every client, fixing the blank-screen
      // issue. Re-enable real offline caching once everyone is unstuck.
      selfDestroying: true,
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["roznama-logo.png"],
      manifest: {
        name: "روزنامة",
        short_name: "روزنامة",
        description: "نظّم يومك، عاداتك، وفلوسك",
        lang: "ar",
        dir: "rtl",
        start_url: "/",
        display: "standalone",
        background_color: "#FAF6EE",
        theme_color: "#C1272D",
        icons: [
          { src: "/roznama-logo.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/roznama-logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/roznama-logo.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        clientsClaim: true,
        skipWaiting: true,
        // Push + notificationclick handlers (plain JS, no TS worker typing needed).
        importScripts: ["/push-sw.js"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === "https://fonts.googleapis.com",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-styles" },
          },
          {
            urlPattern: ({ url }) => url.origin === "https://fonts.gstatic.com",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-files",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@roznama/shared": fileURLToPath(new URL("../../packages/shared/src/index.ts", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Forward API calls to the Express server in local dev.
      "/api": { target: "http://localhost:8787", changeOrigin: true },
    },
  },
});
