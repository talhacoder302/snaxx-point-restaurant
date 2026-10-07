"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { playChime, setAlertPrefs, useAlertPrefs } from "@/lib/admin-alerts";
import BellIcon from "../icons/BellIcon";
import { useOrderAlerts } from "./OrderAlertsProvider";

function Switch({
  checked,
  onChange,
  labelledBy,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelledBy: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-ember" : "bg-admin-fg/20"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

/**
 * Header bell: shows how many new orders are waiting, links to them, and turns
 * the new-order chime and desktop notifications on or off for this device.
 */
export default function AlertSettingsMenu() {
  const id = useId();
  const prefs = useAlertPrefs();
  const { newCount } = useOrderAlerts();
  const [open, setOpen] = useState(false);
  const [desktopBlocked, setDesktopBlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const setSound = (sound: boolean) => {
    setAlertPrefs({ sound });
    if (sound) playChime(); // let them hear it, and confirm their speakers work
  };

  const setDesktop = async (desktop: boolean) => {
    setDesktopBlocked(false);
    if (!desktop) {
      setAlertPrefs({ desktop: false });
      return;
    }
    if (!("Notification" in window)) {
      setDesktopBlocked(true);
      return;
    }
    const permission =
      Notification.permission === "default"
        ? await Notification.requestPermission()
        : Notification.permission;
    if (permission === "granted") {
      setAlertPrefs({ desktop: true });
    } else {
      setDesktopBlocked(true);
    }
  };

  const allOff = !prefs.sound && !prefs.desktop;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={
          newCount > 0
            ? `${newCount} new ${newCount === 1 ? "order" : "orders"} — alerts`
            : "New order alerts"
        }
        title={newCount > 0 ? `${newCount} new ${newCount === 1 ? "order" : "orders"}` : "Alerts"}
        className="relative grid h-9 w-9 place-items-center rounded-[10px] border border-admin-fg/10 bg-admin-field text-admin-fg/70 transition-colors hover:border-ember/40 hover:text-admin-fg"
      >
        <BellIcon className="h-[18px] w-[18px]" />
        {allOff && (
          <span
            aria-hidden="true"
            className="absolute h-[2px] w-[22px] rotate-45 rounded-full bg-admin-fg/70"
          />
        )}
        {newCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[11px] font-bold leading-none tabular-nums text-white shadow-[0_4px_10px_rgba(228,0,43,0.35)] ring-2 ring-admin-surface"
          >
            {/* Keyed by the count so the ping replays whenever a new order arrives. */}
            <span
              key={newCount}
              className="absolute inset-0 animate-ping rounded-full bg-ember/50 [animation-iteration-count:3]"
            />
            <span className="relative">{newCount > 99 ? "99+" : newCount}</span>
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[60] w-72 rounded-[14px] border border-admin-fg/10 bg-admin-surface p-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)] dark:bg-[#232323]">
          {newCount > 0 ? (
            <Link
              href="/admin/orders?status=pending"
              onClick={() => setOpen(false)}
              className="mb-4 flex items-center justify-between gap-3 rounded-[12px] border border-ember/30 bg-ember/[0.07] px-3.5 py-3 transition-colors hover:bg-ember/[0.12] dark:bg-ember/[0.12]"
            >
              <span>
                <span className="block text-[13.5px] font-bold text-admin-fg">
                  {newCount} new {newCount === 1 ? "order" : "orders"}
                </span>
                <span className="block text-[12px] text-admin-fg/60">Waiting for confirmation</span>
              </span>
              <span className="shrink-0 text-[12.5px] font-bold text-ember-dark dark:text-[#ff8a9d]">
                View →
              </span>
            </Link>
          ) : (
            <p className="mb-4 rounded-[12px] bg-admin-fg/[0.04] px-3.5 py-3 text-[12.5px] text-admin-fg/60">
              No new orders right now.
            </p>
          )}

          <p className="text-[11.5px] font-bold uppercase tracking-[1.2px] text-admin-fg/60">
            Alert settings
          </p>

          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <p id={`${id}-sound`} className="text-[13.5px] font-semibold text-admin-fg">
                Sound
              </p>
              <p className="text-[12px] text-admin-fg/60">Chime when an order comes in</p>
            </div>
            <Switch checked={prefs.sound} onChange={setSound} labelledBy={`${id}-sound`} />
          </div>

          <div className="mt-3.5 flex items-start justify-between gap-3 border-t border-admin-fg/[0.08] pt-3.5">
            <div>
              <p id={`${id}-desktop`} className="text-[13.5px] font-semibold text-admin-fg">
                Desktop notifications
              </p>
              <p className="text-[12px] text-admin-fg/60">Even when this tab is in the background</p>
            </div>
            <Switch
              checked={prefs.desktop}
              onChange={(checked) => void setDesktop(checked)}
              labelledBy={`${id}-desktop`}
            />
          </div>

          {desktopBlocked && (
            <p className="mt-3 rounded-[10px] bg-amber-50 px-3 py-2 text-[12px] leading-[1.5] text-amber-900 dark:bg-amber-400/[0.08] dark:text-amber-200">
              Notifications are blocked for this site. Allow them from the lock icon in your
              browser&rsquo;s address bar, then try again.
            </p>
          )}

          <p className="mt-3.5 text-[11.5px] leading-[1.5] text-admin-fg/60">
            Saved on this device only. Keep an admin tab open to receive alerts.
          </p>
        </div>
      )}
    </div>
  );
}
