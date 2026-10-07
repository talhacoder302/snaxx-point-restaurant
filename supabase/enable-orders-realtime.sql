-- Live new-order alerts on the admin dashboard.
-- Run this once in the Supabase SQL Editor, after create-orders-table.sql.
--
-- Adds the orders table to Supabase Realtime so signed-in admins get new and
-- updated orders pushed to their browser instantly. Realtime respects Row
-- Level Security, so only admins (who can SELECT orders) receive them.

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end;
$$;
