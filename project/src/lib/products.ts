import { supabase } from './supabase';

// Product row as stored in the `products` table
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

// Shape the storefront ProductCard expects
export type StoreProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: 'Best Seller' | 'Trending' | 'Limited' | 'New';
  discount?: number;
  image: string;
  hoverImage: string;
  description?: string;
};

function toStore(p: ProductRow): StoreProduct {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: Number(p.price),
    oldPrice: p.old_price ? Number(p.old_price) : undefined,
    rating: Number(p.rating),
    reviews: p.reviews,
    badge: (p.badge as StoreProduct['badge']) ?? undefined,
    discount: p.discount ?? undefined,
    image: p.image,
    hoverImage: p.hover_image ?? p.image,
    description: p.description ?? undefined,
  };
}

// Add this function to your existing lib/products.ts (anywhere after toStore is defined)

export async function fetchProductById(id: number): Promise<StoreProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return toStore(data as ProductRow);
}

// Fetch all active products for the storefront
export async function fetchStoreProducts(): Promise<StoreProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as ProductRow[]).map(toStore);
}

// Admin: fetch ALL products (incl. inactive)
export async function fetchAllProductsAdmin(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ProductRow[];
}

export type ProductInput = {
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
};

export async function createProduct(input: ProductInput): Promise<ProductRow> {
  const { data, error } = await supabase
    .from('products')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as ProductRow;
}

export async function updateProduct(
  id: number,
  input: Partial<ProductInput>
): Promise<ProductRow> {
  const { data, error } = await supabase
    .from('products')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as ProductRow;
}

export async function deleteProduct(id: number): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
