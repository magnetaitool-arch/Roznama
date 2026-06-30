import { api } from "./api";

// Public VAPID key (safe to ship). Override with VITE_VAPID_PUBLIC_KEY if rotated.
const VAPID_PUBLIC =
  (import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined) ||
  "BJ8DRueCT0GwHes_lejPDJCxO8rHYDSQ_16pRkThABcaz0_gf3j_kO6qILmwlR229HWZ0CiPWL7sYVmR3XHJ6KI";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function pushSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

/** Subscribe this device to Web Push and register it with the API (signed-in users). */
export async function subscribeToPush(): Promise<boolean> {
  if (!pushSupported()) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC) as BufferSource,
      });
    }
    await api.subscribePush(sub.toJSON());
    return true;
  } catch (e) {
    console.warn("[roznama] push subscribe failed", e);
    return false;
  }
}

export async function unsubscribeFromPush(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await api.unsubscribePush(sub.endpoint).catch(() => undefined);
      await sub.unsubscribe();
    }
  } catch (e) {
    console.warn("[roznama] push unsubscribe failed", e);
  }
}
