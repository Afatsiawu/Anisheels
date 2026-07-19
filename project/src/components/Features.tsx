import { motion } from 'framer-motion';
import {
  Crown,
  Truck,
  RefreshCw,
  ShieldCheck,
  Headset,
} from 'lucide-react';
import { features } from '../data/store';

const iconMap = {
  crown: Crown,
  truck: Truck,
  refresh: RefreshCw,
  shield: ShieldCheck,
  headset: Headset,
};

export default function Features() {
  return (
    <section className="relative z-10 -mt-10 bg-cream pb-4">
      <div className="container-luxe">
        <div className="grid grid-cols-2 gap-3 rounded-4xl bg-white p-4 shadow-luxe sm:gap-4 sm:p-6 md:grid-cols-3 lg:grid-cols-5">
          {features.map((f, i) => {
            const Icon = iconMap[f.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={f.title}
                className="group flex flex-col items-center gap-3 rounded-3xl p-5 text-center transition-all duration-300 hover:bg-mint-light"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="grid h-14 w-14 place-items-center rounded-full bg-mint-light text-mint-dark transition-all duration-300 group-hover:scale-110 group-hover:bg-gold group-hover:text-white">
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-1 font-body text-xs leading-relaxed text-ink/55">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
