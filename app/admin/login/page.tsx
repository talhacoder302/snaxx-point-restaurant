"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm rounded-[22px] border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-md">
        <h1 className="font-display text-2xl font-black text-white">
          Admin Login
        </h1>
        <p className="mt-2 text-[13px] text-smoke">
          Sign in to manage Snaxx Point offers.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-[13px] font-semibold text-white/80">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1.5 w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none focus:border-ember/50"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[13px] font-semibold text-white/80">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none focus:border-ember/50"
            />
          </div>

          {state?.error && (
            <p className="text-[13px] text-flame">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full rounded-[10px] bg-gradient-to-br from-ember-light to-ember-dark py-2.5 text-sm font-bold text-ink transition-opacity disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
