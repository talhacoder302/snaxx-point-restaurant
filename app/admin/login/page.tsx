"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg px-5">
      <div className="w-full max-w-sm rounded-[22px] border border-admin-fg/[0.08] bg-admin-surface p-8 backdrop-blur-md">
        <h1 className="font-display text-2xl font-black text-admin-fg">
          Admin Login
        </h1>
        <p className="mt-2 text-[13px] text-admin-fg/60">
          Sign in to manage Snaxx Point offers.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-[13px] font-semibold text-admin-fg/80">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1.5 w-full rounded-[10px] border border-admin-fg/10 bg-admin-field px-3.5 py-2.5 text-sm text-admin-fg outline-none focus:border-ember/50"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[13px] font-semibold text-admin-fg/80">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-[10px] border border-admin-fg/10 bg-admin-field px-3.5 py-2.5 text-sm text-admin-fg outline-none focus:border-ember/50"
            />
          </div>

          {state?.error && (
            <p className="text-[13px] text-flame dark:text-[#ff8a9d]">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full rounded-[10px] bg-gradient-to-br from-ember-light to-ember-dark py-2.5 text-sm font-bold text-white transition-opacity disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
