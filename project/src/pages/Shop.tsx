import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { categories } from '../data/store';
import { useStoreProducts } from '../hooks/useStoreProducts';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'low', label: 'Price: Low to High' },
  { value: 'high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const filter = params.get('filter') || 'all';
  const [sort, setSort] = useState('featured');
  const [category, setCategory] = useState('All');
  const [sortOpen, setSortOpen] = useState(false);
  const { all: allProducts, loading } = useStoreProducts();

  const categoryNames = ['All', ...categories.map((c) => c.name)];

  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (filter === 'new') list = list.filter((p) => p.badge === 'New');
    else if (filter === 'best') list = list.filter((p) => p.badge === 'Best Seller');
    else if (filter === 'collections') list = list.filter((p) => p.badge === 'Limited' || p.badge === 'Trending');

    if (category !== 'All') list = list.filter((p) => p.category === category);

    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    else if (sort === 'high') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [allProducts, filter, category, sort]);

  const setFilter = (f: string) => {
    const next = new URLSearchParams(params);
    if (f === 'all') next.delete('filter');
    else next.set('filter', f);
    setParams(next);
  };

  const heading = (() => {
    if (filter === 'new') return 'New Arrivals';
    if (filter === 'best') return 'Best Sellers';
    if (filter === 'collections') return 'Signature Collections';
    return 'The Collection';
  })();

  return (
    <div className="bg-cream pt-10">
      {/* Header */}
      <section className="bg-mint-light py-16 sm:py-20">
        <div className="container-luxe text-center">
          <motion.p
            className="eyebrow mb-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Curated Luxury
          </motion.p>
          <motion.h1
            className="font-heading text-5xl font-bold text-mint-dark sm:text-6xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {heading}
          </motion.h1>
          <div className="gold-divider mx-auto mt-6 w-40" />
          <p className="mx-auto mt-5 max-w-xl font-body text-sm text-mint-dark/70">
            Explore our full range of handcrafted heels — refined silhouettes,
            premium materials, designed for the modern woman.
          </p>
        </div>
      </section>

      {/* Toolbar */}
      <div className="sticky top-[64px] z-20 glass border-b border-mint/10">
        <div className="container-luxe flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="hidden items-center gap-2 font-btn text-[11px] uppercase tracking-[0.18em] text-ink/60 sm:flex">
              <SlidersHorizontal size={14} /> Filter:
            </span>
            {['all', 'new', 'best', 'collections'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap rounded-full px-4 py-2 font-btn text-[11px] font-semibold uppercase tracking-[0.14em] transition-all ${
                  filter === f
                    ? 'bg-mint-dark text-white shadow-luxe-sm'
                    : 'bg-white/70 text-ink/70 hover:bg-white'
                }`}
              >
                {f === 'all' ? 'All' : f === 'new' ? 'New' : f === 'best' ? 'Best' : 'Collections'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden font-body text-xs text-ink/60 sm:inline">
              {loading ? '…' : `${filtered.length} styles`}
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-btn text-[11px] font-semibold uppercase tracking-[0.14em] text-ink shadow-soft"
              >
                Sort: {sortOptions.find((s) => s.value === sort)?.label}
                <ChevronDown size={14} />
              </button>
              {sortOpen && (
                <ul className="absolute right-0 top-12 z-30 w-52 overflow-hidden rounded-2xl bg-white py-2 shadow-luxe">
                  {sortOptions.map((s) => (
                    <li key={s.value}>
                      <button
                        type="button"
                        onClick={() => {
                          setSort(s.value);
                          setSortOpen(false);
                        }}
                        className={`block w-full px-4 py-2.5 text-left font-body text-sm transition-colors hover:bg-mint-light ${
                          sort === s.value ? 'font-semibold text-mint-dark' : 'text-ink/70'
                        }`}
                      >
                        {s.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Category chips */}
        <div className="container-luxe flex gap-2 overflow-x-auto no-scrollbar pb-4">
          {categoryNames.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 font-body text-xs transition-all ${
                category === c
                  ? 'bg-gold text-mint-dark'
                  : 'bg-white/60 text-ink/60 hover:bg-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="py-12 sm:py-16">
        <div className="container-luxe">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] animate-pulse rounded-3xl bg-white/60"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <p className="font-heading text-2xl text-ink">
                No styles match this filter.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilter('all');
                  setCategory('All');
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p, i) => (
                <ProductCard key={`${p.id}-${i}`} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
