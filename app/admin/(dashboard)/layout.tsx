import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";
import ThemeToggle from "@/components/admin/ThemeToggle";
import { getAdminTheme } from "@/lib/admin-theme";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getAdminTheme();

  return (
    <div className="min-h-screen bg-admin-bg">
      <header className="border-b border-admin-fg/[0.08] bg-admin-surface shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none">
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

          <div className="flex items-center gap-2 justify-self-end">
            <ThemeToggle initialTheme={theme} />
            <form action={logout}>
              <button
                type="submit"
                className="rounded-[10px] border border-admin-fg/10 bg-admin-field px-4 py-2 text-[13px] font-semibold text-admin-fg/80 transition-colors hover:border-ember/40 hover:text-admin-fg"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}
