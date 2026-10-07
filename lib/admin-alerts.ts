import { useSyncExternalStore } from "react";

/**
 * Browser-only helpers for new-order alerts on the admin dashboard:
 * a synthesized chime (no audio file to host) and the per-device
 * sound / desktop-notification preferences.
 */

// ---------- Chime ----------

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    audioContext ??= new AudioContext();
    if (audioContext.state === "suspended") void audioContext.resume();
    return audioContext;
  } catch {
    return null;
  }
}

/**
 * Browsers only allow sound after the user has interacted with the page.
 * Call this from any click/keypress so later chimes are allowed to play.
 */
export function unlockChime() {
  getAudioContext();
}

/** A bright two-note "ding-dong", played twice so it's heard over a busy kitchen. */
export function playChime() {
  const context = getAudioContext();
  if (!context) return;

  const start = context.currentTime;
  const notes: [frequency: number, offset: number][] = [
    [880, 0],
    [1318.5, 0.16],
    [880, 0.75],
    [1318.5, 0.91],
  ];

  for (const [frequency, offset] of notes) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const at = start + offset;

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.3, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.5);

    oscillator.connect(gain).connect(context.destination);
    oscillator.start(at);
    oscillator.stop(at + 0.55);
  }
}

// ---------- Preferences ----------

export type AlertPrefs = {
  /** Play the chime for each new order. On by default — a missed order costs more than a sound. */
  sound: boolean;
  /** Show a system notification when the admin tab is in the background. Off until the admin opts in. */
  desktop: boolean;
};

const STORAGE_KEY = "snaxx-admin-alerts";
const DEFAULT_PREFS: AlertPrefs = { sound: true, desktop: false };

let prefs: AlertPrefs = DEFAULT_PREFS;
let loaded = false;
const listeners = new Set<() => void>();

function read(): AlertPrefs {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    if (typeof parsed !== "object" || parsed === null) return DEFAULT_PREFS;
    const stored = parsed as Partial<AlertPrefs>;
    return {
      sound: typeof stored.sound === "boolean" ? stored.sound : DEFAULT_PREFS.sound,
      desktop: typeof stored.desktop === "boolean" ? stored.desktop : DEFAULT_PREFS.desktop,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function getSnapshot(): AlertPrefs {
  if (!loaded) {
    loaded = true;
    prefs = read();
  }
  return prefs;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setAlertPrefs(next: Partial<AlertPrefs>) {
  prefs = { ...getSnapshot(), ...next };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Storage unavailable — the choice lasts for this page view.
  }
  listeners.forEach((listener) => listener());
}

export function useAlertPrefs(): AlertPrefs {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_PREFS);
}

/** Current prefs outside React (e.g. inside a realtime callback). */
export function getAlertPrefs(): AlertPrefs {
  return getSnapshot();
}
