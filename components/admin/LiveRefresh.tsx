"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useOrderAlerts } from "./OrderAlertsProvider";

type LiveRefreshProps = {
  /** When the server last rendered the page, already formatted for display. */
  updatedAtLabel: string;
};

const REFRESH_INTERVAL_MS = 30_000;

/**
 * Shows whether live updates are connected, and backs them up: re-fetches the
 * Orders page every 30s (and when the tab regains focus), which also keeps
 * "5 min ago" labels fresh.
 */
export default function LiveRefresh({ updatedAtLabel }: LiveRefreshProps) {
  const router = useRouter();
  const { connection } = useOrderAlerts();
  const [refreshing, startTransition] = useTransition();

  useEffect(() => {
    const refresh = () => startTransition(() => router.refresh());

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, REFRESH_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router]);

  const isLive = connection === "live";
  const label = refreshing
    ? "Refreshing…"
    : isLive
      ? `Live · updated ${updatedAtLabel}`
      : connection === "connecting"
        ? "Connecting…"
        : `Auto-refresh · updated ${updatedAtLabel}`;

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      title={
        isLive
          ? "New orders appear instantly. Click to refresh now."
          : "Live updates unavailable — refreshing every 30 seconds. Click to refresh now."
      }
      className="inline-flex items-center gap-2 rounded-full border border-admin-fg/10 bg-admin-field px-3 py-1.5 text-[12px] font-semibold text-admin-fg/60 transition-colors hover:border-admin-fg/20 hover:text-admin-fg"
    >
      <span className="relative flex h-2 w-2">
        {isLive && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${isLive ? "bg-emerald-500" : "bg-amber-500"}`}
        />
      </span>
      {label}
    </button>
  );
}
