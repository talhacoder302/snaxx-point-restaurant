"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

type LiveRefreshProps = {
  /** When the server last rendered the page, already formatted for display. */
  updatedAtLabel: string;
  /** Pending orders — shown in the browser tab title so new orders stand out. */
  newOrderCount: number;
};

const REFRESH_INTERVAL_MS = 30_000;

/** Re-fetches the orders page every 30s (and when the tab regains focus) so new orders appear on their own. */
export default function LiveRefresh({ updatedAtLabel, newOrderCount }: LiveRefreshProps) {
  const router = useRouter();
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

  useEffect(() => {
    const previousTitle = document.title;
    if (newOrderCount > 0) {
      document.title = `(${newOrderCount}) New ${newOrderCount === 1 ? "order" : "orders"} · Snaxx Point Admin`;
    }
    return () => {
      document.title = previousTitle;
    };
  }, [newOrderCount]);

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      title="Refresh now"
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] font-semibold text-white/60 transition-colors hover:border-white/20 hover:text-white"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {refreshing ? "Refreshing…" : `Live · updated ${updatedAtLabel}`}
    </button>
  );
}
