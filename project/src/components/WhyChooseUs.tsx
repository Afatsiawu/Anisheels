import { motion } from 'framer-motion';
import {
  Gem,
  Heart,
  Scissors,
  Plane,
  Award,
} from 'lucide-react';
import { whyChooseUs, img } from '../data/store';

const iconMap = {
  gem: Gem,
  heart: Heart,
  scissors: Scissors,
  plane: Plane,
  badge: Award,
};

export default function WhyChooseUs() {
  return (
    <section id="about" className="relative overflow-hidden bg-fog py-20 sm:py-28">
      {/* Decorative side image */}
      <div className="pointer-events-none absolute -right-32 top-1/2 hidden -translate-y-1/2 opacity-[0.06] lg:block">
        <img
          src={img.editorial1}
          alt=""
          aria-hidden="true"
          className="h-[600px] w-[600px] object-cover"
        />
      </div>

      <div className="container-luxe relative">
        <div className="mb-14 flex flex-col items-center text-center">
          <motion.p
            className="eyebrow mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The ANISHEELS Difference
          </motion.p>
          <motion.h2
            className="font-heading text-4xl font-bold text-ink sm:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            Why <span className="italic text-gradient-gold">Choose Us</span>
          </motion.h2>
          <div className="gold-divider mt-6 w-40" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((item, i) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const featured = i === 0;
            return (
              <motion.div
                key={item.title}
                className={`group relative overflow-hidden rounded-4xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                  featured
                    ? 'bg-mint-dark text-white shadow-luxe lg:row-span-2 lg:flex lg:flex-col lg:justify-between'
                    : 'bg-white text-ink shadow-soft hover:shadow-luxe'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              >
                {featured && (
                  <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
                )}
                <div className="relative flex flex-col gap-5">
                  <div
                    className={`grid h-16 w-16 place-items-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                      featured
                        ? 'bg-gold text-mint-dark'
                        : 'bg-mint-light text-mint-dark group-hover:bg-gold group-hover:text-white'
                    }`}
                  >
                    <Icon size={26} strokeWidth={1.6} />
                  </div>
                  <div>
                    <div
                      className={`mb-2 font-heading text-3xl font-bold ${
                        featured ? 'text-gold' : 'text-mint-dark'
                      }`}
                    >
                      {item.stat}
                    </div>
                    <h3
                      className={`font-heading text-xl font-semibold ${
                        featured ? 'text-white' : 'text-ink'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`mt-3 font-body text-sm leading-relaxed ${
                        featured ? 'text-white/75' : 'text-ink/60'
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
