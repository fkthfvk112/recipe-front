"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA Service Worker] Registered successfully:", registration.scope);
        })
        .catch((error) => {
          console.error("[PWA Service Worker] Registration failed:", error);
        });
    }
  }, []);

  return null;
}
