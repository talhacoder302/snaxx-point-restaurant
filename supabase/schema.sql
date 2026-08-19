-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  emoji text not null default '🍽️',
  original_price text not null,
  discounted_price text not null,
  discount_badge text not null,
  featured boolean not null default false,
  cta_label text not null default 'Order Now',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Row Level Security: public (anon) can only read; writes require an
-- authenticated session, which only your admin login will have.
alter table public.offers enable row level security;

create policy "Public can read offers"
  on public.offers for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can insert offers"
  on public.offers for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update offers"
  on public.offers for update
  to authenticated
  using (true);

create policy "Authenticated users can delete offers"
  on public.offers for delete
  to authenticated
  using (true);

-- Seed with the 9 offers currently hardcoded in lib/offers.ts,
-- so the public site looks identical right after migrating.
insert into public.offers
  (title, description, emoji, original_price, discounted_price, discount_badge, featured, cta_label, sort_order)
values
  ('Chicken Dabo', '250 grams of juicy, flavour-packed chicken — a hearty bite at an unbeatable price.', '🍗', 'PKR 500', 'PKR 499', 'Save PKR 1', true, 'Order Now', 0),
  ('Pizza Deal 1 & 2', 'Deal 1: PKR 699 · Deal 2: PKR 1,399 — cheesy, loaded pizzas for every craving.', '🍕', 'PKR 700', 'PKR 699', 'Save PKR 1', false, 'Order Now', 1),
  ('Makhni Chicken Karahi', 'Half: PKR 1,499 · Full: PKR 2,949 — rich, creamy makhni karahi made to share.', '🍛', 'PKR 1,500', 'PKR 1,499', 'Save PKR 1', false, 'Order Now', 2),
  ('Banana Shake', 'Thick, creamy and refreshing — the perfect sweet treat to cool you down.', '🥤', 'PKR 300', 'PKR 299', 'Save PKR 1', false, 'Order Now', 3),
  ('Zinger Wrap', 'Crispy zinger, fresh veggies and our signature sauce — wrapped up and ready to go.', '🌯', 'PKR 480', 'PKR 479', 'Save PKR 1', false, 'Order Now', 4),
  ('Malai Boti Pizza', 'Tender malai boti on a cheesy, loaded pizza — a flavour combination you''ll love.', '🍕', 'PKR 1,750', 'PKR 1,749', 'Save PKR 1', false, 'Order Now', 5),
  ('Chicken Corn Soup', 'Half: PKR 379 · Full: PKR 1,299 — warm, comforting and full of flavour.', '🍲', 'PKR 1,300', 'PKR 1,299', 'Save PKR 1', false, 'Order Now', 6),
  ('Chicken Black Pepper', 'Bold black pepper flavours with tender chicken — a classic done right.', '🍗', 'PKR 1,100', 'PKR 1,099', 'Save PKR 1', false, 'Order Now', 7),
  ('Hot & Sour Soup', 'Half: PKR 419 · Full: PKR 1,399 — tangy, spicy and absolutely satisfying.', '🍜', 'PKR 1,400', 'PKR 1,399', 'Save PKR 1', false, 'Order Now', 8);
