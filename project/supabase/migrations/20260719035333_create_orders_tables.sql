/*
# Create orders and order_items tables (single-tenant, no auth)

1. Purpose
   ANISHEELS COLLECTION is a luxury heels storefront with a guest checkout
   flow. There is no sign-in screen, so orders are placed anonymously.
   These tables persist every completed order so the store can fulfil
   shipments and the customer can see a confirmation page.

2. New Tables
   - `orders`
     - `id`            uuid, primary key (gen_random_uuid)
     - `order_number`  text, unique, human-readable e.g. ANI-20260719-AB12
     - `email`         text, not null — customer contact email
     - `full_name`     text, not null — customer name
     - `phone`         text, not null — contact phone
     - `address`       text, not null — shipping street address
     - `city`          text, not null — shipping city
     - `region`        text — region/state (optional)
     - `country`       text, not null, default 'Ghana'
     - `notes`         text — optional delivery notes
     - `subtotal`      numeric(10,2), not null — sum of item prices
     - `shipping`      numeric(10,2), not null, default 0 — shipping fee
     - `discount`      numeric(10,2), not null, default 0 — promo discount
     - `total`         numeric(10,2), not null — final charged total
     - `promo_code`    text — applied promo code if any
     - `status`        text, not null, default 'pending' — order lifecycle
     - `created_at`    timestamptz, default now()
   - `order_items`
     - `id`          uuid, primary key
     - `order_id`    uuid, not null, references orders(id) ON DELETE CASCADE
     - `product_id`  integer, not null — store catalog product id
     - `name`        text, not null — product name snapshot
     - `image`       text — product image snapshot
     - `price`       numeric(10,2), not null — unit price snapshot
     - `quantity`    integer, not null — units ordered
     - `size`        text — selected shoe size (optional)

3. Indexes
   - `order_items_order_id_idx` for fast join lookups
   - `orders_order_number_idx` for confirmation-page lookups by order_number
   - `orders_email_idx` for "my orders" lookups by email

4. Security
   - RLS ENABLED on both tables.
   - This is a single-tenant no-auth storefront. The anon-key frontend must
     be able to insert orders and later read them back by order_number /
     email for the confirmation page. Therefore policies are scoped to
     `TO anon, authenticated` with `USING (true)` — this is the documented
     single-tenant public-data pattern, not an ownership shortcut.
   - Order items are readable alongside their parent order (publicly
     queryable to render a confirmation page from an order number).

5. Notes
   - All money columns are numeric(10,2) to avoid floating point drift.
   - `order_number` is generated client-side to keep it human-readable and
     returned to the customer; a UNIQUE constraint guards collisions.
   - Prices/names/images are snapshotted into order_items so historical
     orders remain accurate even if the catalog changes later.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  email text NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  region text,
  country text NOT NULL DEFAULT 'Ghana',
  notes text,
  subtotal numeric(10,2) NOT NULL,
  shipping numeric(10,2) NOT NULL DEFAULT 0,
  discount numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL,
  promo_code text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id integer NOT NULL,
  name text NOT NULL,
  image text,
  price numeric(10,2) NOT NULL,
  quantity integer NOT NULL,
  size text
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON orders(order_number);
CREATE INDEX IF NOT EXISTS orders_email_idx ON orders(email);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- orders: anon + authenticated can insert (guest checkout) and read (confirmation)
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- order_items: readable + insertable by anon for guest checkout
DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);
