"use client";

import { useEffect, useState } from "react";
import { Button, Card, useToast } from "@/components/ui";
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendLocalNotification,
  subscribeToPush,
  unsubscribeFromPush,
  type NotificationPermissionState,
} from "@/lib/notifications/push";

const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

export function NotificationsCard() {
  const [perm, setPerm] = useState<NotificationPermissionState>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setPerm(getNotificationPermission());
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => reg.pushManager.getSubscription())
        .then((sub) => setSubscribed(!!sub))
        .catch(() => {
          // SW puede no estar registrado en dev; no es error
        });
    }
  }, []);

  const handleEnable = async () => {
    setBusy(true);
    try {
      const newPerm = await requestNotificationPermission();
      setPerm(newPerm);
      if (newPerm !== "granted") {
        toast.error("Permiso de notificaciones denegado");
        return;
      }
      if (VAPID_KEY) {
        const sub = await subscribeToPush(VAPID_KEY);
        if (sub) {
          setSubscribed(true);
          // TODO: POST sub a /push/subscriptions cuando exista el contrato backend.
          // Hoy el backend no recibe la subscription, así que solo notificaciones
          // locales funcionan end-to-end.
          toast.success("Notificaciones activadas");
        }
      } else {
        toast.success("Notificaciones locales habilitadas");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleTest = () => {
    const ok = sendLocalNotification("Quiniela Mundial 2026", {
      body: "Tu próximo partido cierra en 30 minutos",
      url: "/dashboard",
      tag: "test-deadline",
    });
    if (!ok) toast.error("No se pudo enviar la notificación");
  };

  const handleDisable = async () => {
    setBusy(true);
    try {
      await unsubscribeFromPush();
      setSubscribed(false);
      toast.success("Notificaciones desactivadas");
    } finally {
      setBusy(false);
    }
  };

  if (perm === "unsupported") {
    return null;
  }

  return (
    <Card>
      <h3 className="text-[1.05rem] font-bold text-fg mb-2">Notificaciones</h3>
      <p className="text-[0.85rem] text-fg-secondary mb-5">
        Recibí avisos cuando un partido esté por cerrar y no te pierdas la chance de predecir.
      </p>

      {perm === "default" && (
        <Button onClick={handleEnable} disabled={busy}>
          {busy ? "Pidiendo permiso..." : "Activar notificaciones"}
        </Button>
      )}

      {perm === "granted" && (
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleTest} disabled={busy}>
            Enviar prueba
          </Button>
          {subscribed && (
            <Button variant="ghost" onClick={handleDisable} disabled={busy}>
              Desactivar push
            </Button>
          )}
        </div>
      )}

      {perm === "denied" && (
        <p className="text-[0.85rem] text-orange">
          Bloqueaste las notificaciones. Para activarlas hay que habilitarlas desde la configuración
          del navegador para este sitio.
        </p>
      )}
    </Card>
  );
}
