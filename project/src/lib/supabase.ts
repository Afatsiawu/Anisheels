import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Supabase env vars missing — check .env');
}

// Session persistence is enabled so the admin dashboard stays signed in
// across reloads. The storefront guest checkout does not use auth, so this
// has no effect on the public experience.
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'anisheels-admin-auth',
  },
});

// Row shapes for the storefront
export type OrderRow = {
  id: string;
  order_number: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  region: string | null;
  country: string;
  notes: string | null;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promo_code: string | null;
  status: string;
  created_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: number;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  size: string | null;
};

export type ProductRow = {
  id: number;
  name: string;
  category: string;
  price: number;
  old_price: number | null;
  rating: number;
  reviews: number;
  badge: string | null;
  discount: number | null;
  image: string;
  hover_image: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
};
