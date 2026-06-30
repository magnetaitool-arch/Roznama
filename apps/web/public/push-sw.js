/* Push + notification handlers, imported into the Workbox service worker.
   Plain JS so it needs no TypeScript service-worker typings. */
/* eslint-disable no-undef */

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data && event.data.text ? event.data.text() : "" };
  }
  const title = data.title || "روزنامة";
  const options = {
    body: data.body || "فاكر مهامك؟",
    icon: "/roznama-logo.png",
    badge: "/roznama-logo.png",
    dir: "rtl",
    lang: "ar",
    tag: data.tag || "roznama-reminder",
    data: { url: data.url || "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
      return undefined;
    }),
  );
});
