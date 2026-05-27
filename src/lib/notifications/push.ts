"use client";

/**
 * Helpers de Web Push y Notification API.
 *
 * Estado del flujo:
 * 1. requestNotificationPermission(): pide permiso al usuario.
 * 2. sendLocalNotification(): muestra una notificación local (no
 *    requiere backend, útil para confirmar al usuario que "sí, va a
 *    recibir alertas así").
 * 3. subscribeToPush(vapidPublicKey): suscribe al PushManager para que
 *    el backend pueda enviarle pushes reales. Hoy esto solo genera la
 *    PushSubscription; falta el endpoint `/push/subscriptions` en el
 *    backend (parte del contrato pendiente del Track C).
 *
 * El service worker (public/sw.js) ya maneja los eventos `push` y
 * `notificationclick` para mostrar/abrir las notificaciones.
 */

export type NotificationPermissionState =
  | "default"
  | "granted"
  | "denied"
  | "unsupported";

export function getNotificationPermission(): NotificationPermissionState {
  if (typeof window === "undefined") return "unsupported";
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (typeof window === "undefined") return "unsupported";
  if (!("Notification" in window)) return "unsupported";
  const perm = await Notification.requestPermission();
  return perm;
}

export interface LocalNotificationOptions {
  body?: string;
  tag?: string;
  url?: string;
}

export function sendLocalNotification(
  title: string,
  options: LocalNotificationOptions = {},
): boolean {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;
  const n = new Notification(title, {
    body: options.body,
    icon: "/icon.svg",
    tag: options.tag,
  });
  if (options.url) {
    n.onclick = () => {
      window.focus();
      window.location.href = options.url!;
    };
  }
  return true;
}

export async function subscribeToPush(
  vapidPublicKey: string,
): Promise<PushSubscription | null> {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;
  if (!("PushManager" in window)) return null;
  if (Notification.permission !== "granted") return null;
  if (!vapidPublicKey) return null;

  try {
    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    if (existing) return existing;
    return await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Push subscribe failed", e);
    return null;
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!("serviceWorker" in navigator)) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return false;
    return await sub.unsubscribe();
  } catch {
    return false;
  }
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}
