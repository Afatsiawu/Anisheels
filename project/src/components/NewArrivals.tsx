import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useStoreProducts } from '../hooks/useStoreProducts';

export default function NewArrivals() {
  const { newArrivals, loading } = useStoreProducts();

  return (
    <section id="new" className="bg-cream py-20 sm:py-28">
      <div className="container-luxe">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <motion.p
              className="eyebrow mb-3"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Fresh Off The Atelier
            </motion.p>
            <motion.h2
              className="font-heading text-4xl font-bold text-ink sm:text-5xl"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
            >
              New <span className="italic text-gradient-gold">Arrivals</span>
            </motion.h2>
            <div className="gold-divider mt-6 w-40" />
          </div>
          <Link
            to="/shop?filter=new"
            className="group inline-flex items-center gap-2 font-btn text-xs font-semibold uppercase tracking-[0.18em] text-mint-dark transition-colors hover:text-gold"
          >
            View all
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] animate-pulse rounded-3xl bg-white/60"
                />
              ))
            : newArrivals.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}
