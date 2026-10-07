import { createBrowserClient } from "@supabase/ssr";

/** Browser-side Supabase client, used by the admin login form and the live new-order alerts. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
