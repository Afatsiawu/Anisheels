import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Star, Globe, Award } from 'lucide-react';
import Button from './Button';
import { img } from '../data/store';

const stats = [
  { value: '10,000+', label: 'Happy Customers', icon: Star },
  { value: '4.9★', label: 'Customer Rating', icon: Award },
  { value: 'Premium', label: 'Quality assured', icon: Sparkles },
  { value: 'Worldwide', label: 'Shipping', icon: Globe },
];

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const counted = useRef(false);
  const [startCount, setStartCount] = useState(false);
  const customers = useCountUp(10000, startCount);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!counted.current) {
        counted.current = true;
        setStartCount(true);
      }
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={ref}
      className="relative -mt-[64px] flex min-h-[100svh] items-center overflow-hidden bg-mint-dark pt-[64px]"
    >
      {/* Background image with parallax */}
      <motion.div
        style={{ y: yImg }}
        className="absolute inset-0 z-0"
      >
        <img
          src={img.heroMain}
          alt="Model wearing elegant mint green heels on white marble"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mint-dark/85 via-mint-dark/45 to-mint-dark/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-mint-dark/70 via-transparent to-mint-dark/30" />
      </motion.div>

      {/* Floating decorative circles */}
      <motion.div
        className="pointer-events-none absolute left-[8%] top-[22%] z-10 h-24 w-24 rounded-full border border-gold/40"
        animate={{ y: [0, -22, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute right-[18%] top-[28%] z-10 h-40 w-40 rounded-full bg-mint/20 blur-2xl"
        animate={{ y: [0, 26, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute right-[10%] bottom-[16%] z-10 h-16 w-16 rounded-full border border-white/30"
        animate={{ y: [0, -18, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <motion.div
        style={{ y: yText, opacity }}
        className="container-luxe relative z-20 grid grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2"
      >
        {/* Left text */}
        <div className="max-w-xl text-white">
          <motion.p
            className="eyebrow mb-5 flex items-center gap-2 text-gold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={14} /> Step Into Elegance
          </motion.p>

          <motion.h1
            className="font-heading text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Elevate Every
            <span className="block italic text-gradient-gold">Step You Take</span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-md font-body text-base leading-relaxed text-white/85 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Discover premium handcrafted heels designed for confidence, beauty,
            and timeless sophistication.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Button to="/shop" variant="gold" arrow>
              Shop Now
            </Button>
            <Button to="/shop?filter=collections" variant="outline">
              Explore Collection
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.dl
            className="mt-12 grid max-w-lg grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            {stats.map((s, i) => (
              <div key={s.label} className="flex flex-col gap-1">
                <s.icon size={16} className="text-gold" strokeWidth={1.6} />
                <dt className="font-heading text-2xl font-semibold text-white">
                  {i === 0 ? `${customers.toLocaleString()}+` : s.value}
                </dt>
                <dd className="font-body text-[11px] uppercase tracking-[0.14em] text-white/60">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Right floating image card */}
        <motion.div
          className="relative hidden lg:block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <div className="relative mx-auto w-[80%]">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gold/20 blur-2xl" />
            <div className="glass-dark relative overflow-hidden rounded-[2rem] p-3 shadow-luxe">
              <img
                src={img.heroSecondary}
                alt="Editorial shot of luxury heels"
                loading="eager"
                className="h-[520px] w-full rounded-[1.5rem] object-cover"
              />
            </div>
            <motion.div
              className="absolute -bottom-6 -left-8 glass rounded-2xl px-5 py-4 shadow-luxe"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="font-btn text-[10px] uppercase tracking-[0.2em] text-mint">
                New Drop
              </p>
              <p className="font-heading text-lg font-semibold text-mint-dark">
                Aurora Collection
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex h-11 w-7 items-start justify-center rounded-full border border-white/40 p-1.5">
          <span className="h-2 w-1 rounded-full bg-white/80" />
        </div>
      </motion.div>
    </section>
  );
}
