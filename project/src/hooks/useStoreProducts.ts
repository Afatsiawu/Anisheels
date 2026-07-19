import { useEffect, useState } from 'react';
import {
  fetchStoreProducts,
  type StoreProduct,
} from '../lib/products';
import { seedProductsIfEmpty } from '../lib/seed';
import {
  products as staticProducts,
  bestSellers as staticBest,
  newArrivals as staticNew,
  type Product,
} from '../data/store';

// Loads products from Supabase (seeding the table from the static catalog on
// first run). Falls back to the static catalog if the DB is unreachable so
// the storefront always renders.
export function useStoreProducts() {
  const [all, setAll] = useState<StoreProduct[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await seedProductsIfEmpty();
        const rows = await fetchStoreProducts();
        if (active) setAll(rows);
      } catch {
        // Fall back to static data merged & deduped by name
        if (active) setAll(null);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Build the three curated lists from DB data, falling back to static
  const merged: Product[] = [
    ...staticProducts,
    ...staticBest,
    ...staticNew,
  ];
  const staticFallback: StoreProduct[] = merged
    .filter((p, i, arr) => arr.findIndex((x) => x.name === p.name) === i)
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      oldPrice: p.oldPrice,
      rating: p.rating,
      reviews: p.reviews,
      badge: p.badge,
      discount: p.discount,
      image: p.image,
      hoverImage: p.hoverImage,
    }));

  const db = all ?? staticFallback;

  const featured = (all ?? staticFallback).slice(0, 8);
  const bestSellers = (
    all
      ? all.filter((p) => p.badge === 'Best Seller')
      : staticFallback.filter((p) => p.badge === 'Best Seller')
  ).slice(0, 5);
  const newArrivals = (
    all
      ? all.filter((p) => p.badge === 'New')
      : staticFallback.filter((p) => p.badge === 'New')
  ).slice(0, 4);

  return { all: db, featured, bestSellers, newArrivals, loading: all === null };
}
