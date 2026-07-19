import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useStoreProducts } from '../hooks/useStoreProducts';

export default function FeaturedProducts() {
  const { featured, loading } = useStoreProducts();

  return (
    <section className="bg-fog py-20 sm:py-28">
      <div className="container-luxe">
        <div className="mb-12 flex flex-col items-center text-center">
          <motion.p
            className="eyebrow mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Handpicked For You
          </motion.p>
          <motion.h2
            className="font-heading text-4xl font-bold text-ink sm:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            Featured <span className="italic text-gradient-gold">Products</span>
          </motion.h2>
          <div className="gold-divider mt-6 w-40" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] animate-pulse rounded-3xl bg-white/60"
                />
              ))
            : featured.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 rounded-full border border-mint-dark/30 px-8 py-4 font-btn text-xs font-semibold uppercase tracking-[0.18em] text-mint-dark transition-all hover:bg-mint-dark hover:text-white"
          >
            View All Products
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
