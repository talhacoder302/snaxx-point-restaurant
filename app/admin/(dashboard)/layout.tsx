import Link from "next/link";
import { logout } from "@/app/admin/actions";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-white/[0.08] bg-white/[0.03]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/admin" className="font-display text-lg font-black text-white">
            Snaxx Point <span className="text-ember">Admin</span>
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] font-semibold text-white/80 transition-colors hover:border-ember/40 hover:text-white"
            >
              Log Out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}
