import { motion } from 'framer-motion';
import { Instagram, Heart } from 'lucide-react';
import { img } from '../data/store';

const gallery = [
  { src: img.ig1, alt: 'Luxury heels editorial shot' },
  { src: img.ig2, alt: 'Elegant stiletto on marble' },
  { src: img.ig3, alt: 'Gold sandal lifestyle' },
  { src: img.ig4, alt: 'Model in mint heels' },
  { src: img.ig5, alt: 'Studio fashion heels' },
  { src: img.ig6, alt: 'Designer heels close-up' },
];

export default function InstagramGallery() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="container-luxe">
        <div className="mb-12 flex flex-col items-center text-center">
          <motion.p
            className="eyebrow mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            @ANISHEELS.COLLECTION
          </motion.p>
          <motion.h2
            className="font-heading text-4xl font-bold text-ink sm:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            Follow The <span className="italic text-gradient-gold">Journey</span>
          </motion.h2>
          <div className="gold-divider mt-6 w-40" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {gallery.map((g, i) => (
            <motion.a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`View Instagram post ${i + 1}`}
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-soft"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
            >
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-mint-dark/0 opacity-0 transition-all duration-300 group-hover:bg-mint-dark/60 group-hover:opacity-100">
                <Instagram size={26} className="text-white" strokeWidth={1.6} />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#DDF5EC] to-[#8ECFB5] px-8 py-4 font-btn text-xs font-semibold uppercase tracking-[0.18em] text-mint-dark shadow-luxe-sm transition-all hover:scale-[1.03] hover:shadow-luxe"
          >
            <Instagram size={16} strokeWidth={1.8} /> Follow Us
            <Heart
              size={14}
              className="fill-gold text-gold transition-transform group-hover:scale-125"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
