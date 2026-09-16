import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-white/[0.08] bg-white/[0.03]">
        <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4">
          <Link href="/admin" className="flex items-center gap-2.5 justify-self-start">
            <Image
              src="/snaxxpoint-logo.png"
              alt="Snaxx Point Restaurant"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="font-display text-lg font-black text-ember">Admin</span>
          </Link>

          <AdminNav />

          <form action={logout} className="justify-self-end">
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
