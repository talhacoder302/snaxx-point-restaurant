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

/**
 * Backup check for new orders, so alerts still arrive within seconds if
 * Realtime isn't delivering — e.g. supabase/enable-orders-realtime.sql hasn't
 * been run (the channel still reports "subscribed" then), or the connection
 * dropped. It's a tiny query, so it runs at the same pace whatever the state.
 */
const POLL_INTERVAL_MS = 10_000;
const ALERT_COLUMNS = "id, customer_name, order_type, total_items, subtotal, status, created_at";
const MAX_TOASTS = 20;
const TITLE_PREFIX = /^\(\d+\)\s/;

/**
 * Listens for new and updated orders on every admin page — instantly through
 * Supabase Realtime, with a 10-second backup check — and alerts staff without
 * a page refresh: the bell's count badge, a toast per new order, a chime, the
 * browser tab title, and (when enabled) a desktop notification.
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
  /** Orders already announced — Realtime and the backup check can both report the same one. */
  const announcedRef = useRef(new Set<string>());
  /** Newest order time seen so far; the backup check only asks for orders after it. */
  const lastSeenAtRef = useRef<string | null>(null);

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

  const syncOrdersPage = useEffectEvent(() => {
    // Keep the Orders page itself in sync — batched, in case several changes arrive together.
    if (pathname.startsWith("/admin/orders")) {
      if (refreshTimerRef.current !== null) window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = window.setTimeout(() => router.refresh(), 400);
    }
  });

  /** Toast + chime + desktop notification for a new order — once per order. */
  const announce = useEffectEvent((row: OrderRowPayload) => {
    // Compare as dates — timestamps arrive as "…Z" or "…+00:00" with varying precision.
    if (lastSeenAtRef.current === null || Date.parse(row.created_at) > Date.parse(lastSeenAtRef.current)) {
      lastSeenAtRef.current = row.created_at;
    }
    if (row.status !== "pending" || announcedRef.current.has(row.id)) return;
    announcedRef.current.add(row.id);

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

  const onOrderChange = useEffectEvent((eventType: string, row: OrderRowPayload | null) => {
    void recount();
    syncOrdersPage();
    if (eventType === "INSERT" && row) announce(row);
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
      // The 10-second backup check below still delivers alerts.
      console.error("Live order alerts unavailable:", error);
      setConnection("offline");
    });

    // Backup check: remember the newest existing order, then look for anything newer.
    let pollTimer: number | null = null;
    const poll = async () => {
      try {
        if (lastSeenAtRef.current === null) {
          const { data } = await supabase
            .from("orders")
            .select("created_at")
            .order("created_at", { ascending: false })
            .limit(1);
          const newest = (data as { created_at: string }[] | null)?.[0]?.created_at;
          // Existing orders are never announced; with none yet, start from now.
          lastSeenAtRef.current ??= newest ?? new Date().toISOString();
        } else {
          const { data, error } = await supabase
            .from("orders")
            .select(ALERT_COLUMNS)
            .gt("created_at", lastSeenAtRef.current)
            .order("created_at", { ascending: true })
            .limit(20);
          const rows = error ? [] : ((data ?? []) as OrderRowPayload[]);
          rows.forEach((row) => announce(row));
          if (rows.length > 0) syncOrdersPage();
          await recount();
        }
      } finally {
        if (!cancelled) pollTimer = window.setTimeout(() => void poll(), POLL_INTERVAL_MS);
      }
    };
    void poll();

    return () => {
      cancelled = true;
      if (pollTimer !== null) window.clearTimeout(pollTimer);
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
