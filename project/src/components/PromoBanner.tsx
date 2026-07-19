import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Button from './Button';
import { img } from '../data/store';

export default function PromoBanner() {
  return (
    <section className="bg-cream py-16 sm:py-24">
      <div className="container-luxe">
        <motion.div
          className="relative overflow-hidden rounded-5xl bg-mint-gradient shadow-luxe"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            {/* Text */}
            <div className="relative z-10 p-10 sm:p-14 lg:p-20">
              <motion.p
                className="mb-4 flex items-center gap-2 font-btn text-xs uppercase tracking-[0.3em] text-mint-dark"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Sparkles size={14} className="text-gold" /> The Signature Edit
              </motion.p>
              <motion.h2
                className="font-heading text-4xl font-bold leading-tight text-mint-dark sm:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Made for the
                <span className="block italic">Modern Woman</span>
              </motion.h2>
              <p className="mt-6 max-w-md font-body text-base leading-relaxed text-mint-dark/80">
                Bold silhouettes. Quiet confidence. Each pair is engineered for
                the woman who refuses to choose between power and poise.
              </p>
              <div className="mt-9">
                <Button to="/shop?filter=collections" variant="primary" arrow>
                  Discover More
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-72 lg:h-[460px]">
              <img
                src={img.promo}
                alt="Luxury mint green heels editorial"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-mint/40 to-transparent lg:from-mint-light/30" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
