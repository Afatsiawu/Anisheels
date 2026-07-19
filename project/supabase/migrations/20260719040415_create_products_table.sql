/*
# Create products table + admin product catalog

1. Purpose
   ANISHEELS COLLECTION needs a products table so the admin can add, edit,
   and remove products from a dashboard, and the public storefront can
   display the live catalog. This replaces the hardcoded store.ts seed
   array as the source of truth for the storefront grid.

2. New Tables
   - `products`
     - `id`           integer, primary key (auto-increment)
     - `name`         text, not null — product display name
     - `category`     text, not null — e.g. "Classic Heels"
     - `price`        numeric(10,2), not null — current price (GHS)
     - `old_price`    numeric(10,2) — original price for discount display
     - `rating`       numeric(2,1), default 5 — 0.0–5.0
     - `reviews`      integer, default 0
     - `badge`        text — "Best Seller" | "Trending" | "Limited" | "New" | null
     - `discount`     integer — percent off, optional
     - `image`        text, not null — primary image URL
     - `hover_image`  text — secondary image URL for hover swap
     - `description`  text — long-form product copy
     - `is_active`    boolean, default true — soft-publish toggle
     - `created_at`   timestamptz, default now()

3. Indexes
   - `products_category_idx` for category filtering on the storefront
   - `products_badge_idx` for New/Best-Seller filter views
   - `products_active_idx` partial index for active products only

4. Security
   - RLS ENABLED.
   - Public read: the storefront is a no-auth app and must display the
     catalog, so SELECT is `TO anon, authenticated USING (true)` — the
     documented single-tenant public-read pattern.
   - Write (INSERT/UPDATE/DELETE): admin-only, scoped `TO authenticated`.
     The admin signs in via Supabase email/password auth; only
     authenticated sessions can mutate the catalog.
   - This is intentionally NOT owner-scoped by user_id — any authenticated
     admin can manage all products. The admin user is created separately
     and is the only account that can sign in.

5. Notes
   - Prices use numeric(10,2) to avoid float drift.
   - `is_active` lets the admin unpublish a product without deleting it.
   - Static seed data from src/data/store.ts is inserted by the frontend
     on first load (via an idempotent seed routine), NOT in this migration,
     so the storefront keeps working even before seeding runs.
*/

CREATE TABLE IF NOT EXISTS products (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  price numeric(10,2) NOT NULL,
  old_price numeric(10,2),
  rating numeric(2,1) NOT NULL DEFAULT 5,
  reviews integer NOT NULL DEFAULT 0,
  badge text,
  discount integer,
  image text NOT NULL,
  hover_image text,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_badge_idx ON products(badge);
CREATE INDEX IF NOT EXISTS products_active_idx ON products(is_active) WHERE is_active = true;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read: storefront (anon) can view all products
DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- Admin write: only authenticated sessions can add/edit/remove products
DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products FOR DELETE
  TO authenticated USING (true);
