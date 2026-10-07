import { getAdminTheme } from "@/lib/admin-theme";

/** Applies the admin's light/dark choice to every admin page, including login. */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const theme = await getAdminTheme();

  return (
    <div data-admin-theme={theme} className="flex min-h-screen flex-col bg-admin-bg text-admin-fg">
      {children}
    </div>
  );
}
