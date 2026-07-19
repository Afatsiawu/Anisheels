import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { categories } from '../data/store';

export default function Categories() {
  return (
    <section id="collections" className="bg-cream py-20 sm:py-28">
      <div className="container-luxe">
        <div className="mb-12 flex flex-col items-center text-center">
          <motion.p
            className="eyebrow mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Curated Edits
          </motion.p>
          <motion.h2
            className="font-heading text-4xl font-bold text-ink sm:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            Shop By <span className="italic text-gradient-gold">Collection</span>
          </motion.h2>
          <div className="gold-divider mt-6 w-40" />
          <p className="mt-5 max-w-xl font-body text-sm text-ink/60">
            From boardroom refinement to bridal radiance — discover a collection
            for every moment worth dressing for.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
            >
              <Link
                to="/shop"
                className="group relative block aspect-[4/5] overflow-hidden rounded-4xl shadow-soft ring-1 ring-mint-dark/5 transition-all duration-500 hover:shadow-luxe"
              >
                <img
                  src={c.image}
                  alt={`${c.name} — ${c.blurb}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mint-dark/85 via-mint-dark/20 to-transparent" />

                {/* Gold border on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-4xl ring-2 ring-gold/0 transition-all duration-500 group-hover:ring-gold/70" />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-btn text-[10px] uppercase tracking-[0.22em] text-gold">
                        {c.count} styles
                      </p>
                      <h3 className="mt-1 font-heading text-2xl font-semibold text-white">
                        {c.name}
                      </h3>
                      <p className="mt-1 font-body text-xs text-white/70">
                        {c.blurb}
                      </p>
                    </div>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/90 text-mint-dark shadow-luxe-sm transition-all duration-300 group-hover:bg-gold group-hover:text-white">
                      <ArrowUpRight size={18} strokeWidth={1.8} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
