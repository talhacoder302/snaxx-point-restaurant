"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getAlertPrefs, playChime, unlockChime } from "@/lib/admin-alerts";
import { orderReference, type OrderType } from "@/lib/order-status";
import { createClient } from "@/lib/supabase/client";
import OrderToasts, { type OrderToast } from "./OrderToasts";

export type LiveConnection = "connecting" | "live" | "offline";

type OrderAlertsContextValue = {
  /** Orders still waiting for confirmation (status "pending"). */
  newCount: number;
  connection: LiveConnection;
};

const OrderAlertsContext = createContext<OrderAlertsContextValue | null>(null);

export function useOrderAlerts(): OrderAlertsContextValue {
  const context = useContext(OrderAlertsContext);
  if (!context) {
    throw new Error("useOrderAlerts must be used inside <OrderAlertsProvider>.");
  }
  return context;
}

type OrderRowPayload = {
  id: string;
  customer_name: string;
  order_type: string;
  total_items: number;
  subtotal: number | string | null;
  status: string;
  created_at: string;
};

/** Fallback re-count in case a realtime event is missed (e.g. the connection dropped). */
const RECOUNT_INTERVAL_MS = 60_000;
const MAX_TOASTS = 20;
const TITLE_PREFIX = /^\(\d+\)\s/;

/**
 * Listens for new and updated orders through Supabase Realtime on every admin
 * page, and alerts staff without a page refresh: a count badge (read by
 * AdminNav), a toast per new order, a chime, the browser tab title, and —
 * when enabled — a desktop notification.
 */
export default function OrderAlertsProvider({
  initialNewCount,
  children,
}: {
  initialNewCount: number;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [newCount, setNewCount] = useState(initialNewCount);
  const [connection, setConnection] = useState<LiveConnection>("connecting");
  const [toasts, setToasts] = useState<OrderToast[]>([]);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const refreshTimerRef = useRef<number | null>(null);

  // A server re-render (navigation, router.refresh) brings a fresh count — adopt it.
  const [lastInitialCount, setLastInitialCount] = useState(initialNewCount);
  if (initialNewCount !== lastInitialCount) {
    setLastInitialCount(initialNewCount);
    setNewCount(initialNewCount);
  }

  const recount = useCallback(async () => {
    const supabase = (supabaseRef.current ??= createClient());
    const { count, error } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    if (!error && count !== null) setNewCount(count);
  }, []);

  const onOrderChange = useEffectEvent((eventType: string, row: OrderRowPayload | null) => {
    void recount();

    // Keep the Orders page itself in sync — batched, in case several events arrive together.
    if (pathname.startsWith("/admin/orders")) {
      if (refreshTimerRef.current !== null) window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = window.setTimeout(() => router.refresh(), 400);
    }

    if (eventType !== "INSERT" || !row || row.status !== "pending") return;

    const toast: OrderToast = {
      id: row.id,
      reference: orderReference(row.id),
      customerName: row.customer_name,
      orderType: (row.order_type === "pickup" ? "pickup" : "delivery") as OrderType,
      totalItems: row.total_items,
      subtotal: row.subtotal === null ? null : Number(row.subtotal),
      createdAt: row.created_at,
    };
    setToasts((current) => [toast, ...current.filter((t) => t.id !== toast.id)].slice(0, MAX_TOASTS));

    const prefs = getAlertPrefs();
    if (prefs.sound) playChime();

    if (
      prefs.desktop &&
      document.visibilityState !== "visible" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      const notification = new Notification(`New order #${toast.reference}`, {
        body: `${toast.customerName} · ${toast.orderType === "pickup" ? "Pickup" : "Delivery"} · ${toast.totalItems} ${toast.totalItems === 1 ? "item" : "items"}`,
        icon: "/snaxxpoint-logo.png",
        tag: toast.id,
      });
      notification.onclick = () => {
        window.focus();
        router.push(`/admin/orders?order=${toast.id}`);
        notification.close();
      };
    }
  });

  // Realtime subscription — one channel for the lifetime of the admin session.
  useEffect(() => {
    const supabase = (supabaseRef.current ??= createClient());
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    (async () => {
      // Realtime applies Row Level Security, so it needs the admin's session token.
      await supabase.realtime.setAuth();
      if (cancelled) return;

      channel = supabase
        // A unique name per mount: the browser client is shared, and reusing a
        // name returns the previous (possibly still subscribed) channel.
        .channel(`admin-orders-${crypto.randomUUID()}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
          const row = payload.eventType === "DELETE" ? null : (payload.new as OrderRowPayload);
          onOrderChange(payload.eventType, row);
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setConnection("live");
            void recount(); // catch anything that arrived while connecting
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            setConnection("offline");
          }
        });
    })().catch((error: unknown) => {
      // Live alerts are a bonus — the 60s re-count and the Orders page's own refresh still work.
      console.error("Live order alerts unavailable:", error);
      setConnection("offline");
    });

    const interval = window.setInterval(() => void recount(), RECOUNT_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      if (refreshTimerRef.current !== null) window.clearTimeout(refreshTimerRef.current);
      if (channel) void supabase.removeChannel(channel);
    };
  }, [recount]);

  // Browsers block sound until the user interacts — unlock the chime on the first click or key.
  useEffect(() => {
    const unlock = () => unlockChime();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // "(3) Orders · Admin | …" in the browser tab, on every admin page.
  useEffect(() => {
    const base = document.title.replace(TITLE_PREFIX, "");
    document.title = newCount > 0 ? `(${newCount}) ${base}` : base;
  }, [newCount, pathname]);

  const dismissToast = useCallback(
    (id: string) => setToasts((current) => current.filter((toast) => toast.id !== id)),
    []
  );
  const dismissAll = useCallback(() => setToasts([]), []);

  const value = useMemo(() => ({ newCount, connection }), [newCount, connection]);

  return (
    <OrderAlertsContext.Provider value={value}>
      {children}
      <OrderToasts toasts={toasts} onDismiss={dismissToast} onDismissAll={dismissAll} />
    </OrderAlertsContext.Provider>
  );
}
