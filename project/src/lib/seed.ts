import { supabase } from './supabase';
import { products as seedProducts, bestSellers, newArrivals } from '../data/store';
import type { Product } from '../data/store';
import type { ProductInput } from './products';

// Idempotent: seed the products table from the static catalog only if it's
// empty. Called from the storefront on first load. Safe to re-run.
export async function seedProductsIfEmpty(): Promise<void> {
  try {
    const { count, error } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true });

    if (error) throw error;
    if (count && count > 0) return; // already seeded

    // Merge all static products into seed rows. Dedupe by name.
    const seen = new Set<string>();
    const rows: ProductInput[] = [];

    const all: Product[] = [...seedProducts, ...bestSellers, ...newArrivals];
    for (const p of all) {
      if (seen.has(p.name)) continue;
      seen.add(p.name);
      rows.push({
        name: p.name,
        category: p.category,
        price: p.price,
        old_price: p.oldPrice ?? null,
        rating: p.rating,
        reviews: p.reviews,
        badge: p.badge ?? null,
        discount: p.discount ?? null,
        image: p.image,
        hover_image: p.hoverImage,
        description: null,
        is_active: true,
      });
    }

    const { error: insertError } = await supabase.from('products').insert(rows);
    if (insertError) throw insertError;
  } catch (e) {
    // Seeding is best-effort — never block the storefront on it.
    console.warn('Product seeding skipped:', e);
  }
}
