import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/shop?filter=collections' },
  { label: 'New Arrivals', to: '/shop?filter=new' },
  { label: 'Best Sellers', to: '/shop?filter=best' },
  { label: 'About', to: '/#about' },
  { label: 'Contact', to: '/#contact' },
];

const icons = [
  { Icon: Search, label: 'Search' },
  { Icon: Heart, label: 'Wishlist' },
  { Icon: ShoppingBag, label: 'Cart' },
  { Icon: User, label: 'Account' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { count, open: openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const overHero = location.pathname === '/' && !scrolled;
  const textColor = overHero ? 'text-white' : 'text-ink';
  const logoColor = overHero ? 'text-white' : 'text-mint-dark';

  const isActiveLink = (to: string) => {
    if (to === '/') return location.pathname === '/';
    if (to.startsWith('/shop')) return location.pathname.startsWith('/shop');
    if (to.startsWith('/#')) return location.pathname === '/' && location.hash === to.slice(1);
    return false;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'border-b border-mint-dark/10 bg-[#fffdfa]/80 shadow-[0_12px_40px_rgba(35,73,59,0.12)] backdrop-blur-xl'
            : overHero
              ? 'bg-transparent'
              : 'border-b border-mint-dark/5 bg-[#fffdfa]/75 backdrop-blur-xl'
        }`}
      >
        <nav className="container-luxe flex items-center justify-between py-3 sm:py-4">
          <Link
            to="/"
            className={`group relative inline-flex items-center gap-3 ${logoColor}`}
            aria-label="ANISHEELS Collection home"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full border border-current/15 bg-white/10 text-[10px] font-btn font-semibold uppercase tracking-[0.24em] shadow-soft transition group-hover:scale-105 group-hover:border-gold/60 group-hover:text-gold">
              A
            </span>
            <span className="leading-none">
              <span className="font-heading text-xl font-bold tracking-[0.08em] sm:text-2xl">
                ANISHEELS
              </span>
              <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.46em] text-gold">
                Collection
              </span>
            </span>
          </Link>

          <div className={`hidden items-center rounded-full border px-3 py-2 shadow-[0_8px_24px_rgba(35,73,59,0.08)] lg:flex ${
            scrolled || !overHero
              ? 'border-mint-dark/10 bg-white/70'
              : 'border-white/15 bg-white/5 backdrop-blur-sm'
          }`}>
            <ul className={`flex items-center gap-1 ${textColor}`}>
              {navLinks.map((l) => {
                const active = isActiveLink(l.to);

                return (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className={`group relative rounded-full px-3.5 py-2.5 font-btn text-[11px] font-medium uppercase tracking-[0.16em] transition-all duration-300 ${
                        active
                          ? 'bg-mint-light text-mint-dark shadow-soft'
                          : 'text-current hover:bg-white/20 hover:text-gold'
                      }`}
                    >
                      {l.label}
                      <span
                        className={`absolute inset-x-2.5 -bottom-0.5 h-px rounded-full transition-all duration-300 ${
                          active ? 'bg-gold' : 'bg-gold/0 group-hover:bg-gold/80'
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={`flex items-center gap-1.5 sm:gap-2 ${textColor}`}>
            <div className={`hidden items-center gap-1 rounded-full border p-1 sm:flex ${
              scrolled || !overHero
                ? 'border-mint-dark/10 bg-white/70'
                : 'border-white/15 bg-white/5 backdrop-blur-sm'
            }`}>
              {icons.slice(0, 2).map(({ Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full transition-all hover:bg-mint-light hover:text-mint-dark"
                >
                  <Icon size={18} strokeWidth={1.8} />
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-label={`Cart, ${count} items`}
              onClick={openCart}
              className={`relative grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(201,162,39,0.2)] ${
                scrolled || !overHero
                  ? 'border-mint-dark/10 bg-white/80 text-ink hover:border-gold/50 hover:text-gold'
                  : 'border-white/15 bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-gold px-1 font-btn text-[10px] font-bold text-mint-dark"
                >
                  {count}
                </motion.span>
              )}
            </button>

            <button
              type="button"
              aria-label="Account"
              className={`grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(35,73,59,0.12)] ${
                scrolled || !overHero
                  ? 'border-mint-dark/10 bg-white/80 text-ink hover:border-mint-dark/20 hover:text-mint-dark'
                  : 'border-white/15 bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <User size={18} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className={`ml-1 grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 lg:hidden ${
                scrolled || !overHero
                  ? 'border-mint-dark/10 bg-white/80 text-ink hover:border-gold/50 hover:text-gold'
                  : 'border-white/15 bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Menu size={20} strokeWidth={1.8} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-50 flex h-full w-[82%] max-w-sm flex-col bg-cream shadow-luxe lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
            >
              <div className="flex items-center justify-between border-b border-mint/20 px-6 py-5">
                <span className="font-heading text-lg font-bold text-mint-dark">
                  Menu
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-mint-light text-mint-dark transition hover:bg-mint hover:text-white"
                >
                  <X size={20} strokeWidth={1.8} />
                </button>
              </div>

              <ul className="flex flex-col gap-1 px-4 py-4">
                {navLinks.map((l, i) => (
                  <motion.li
                    key={l.label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                  >
                    <Link
                      to={l.to}
                      className="flex items-center justify-between rounded-2xl px-4 py-3.5 font-btn text-sm font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-mint-light hover:text-mint-dark"
                    >
                      {l.label}
                      <span className="text-gold">→</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto border-t border-mint/20 px-6 py-6">
                <div className="flex items-center justify-between">
                  {icons.slice(0, 2).map(({ Icon, label }) => (
                    <button
                      key={label}
                      aria-label={label}
                      className="grid h-11 w-11 place-items-center rounded-full bg-white text-mint-dark shadow-soft transition hover:bg-mint-dark hover:text-white"
                    >
                      <Icon size={18} strokeWidth={1.7} />
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-label={`Cart, ${count} items`}
                    onClick={() => {
                      setOpen(false);
                      openCart();
                    }}
                    className="relative grid h-11 w-11 place-items-center rounded-full bg-white text-mint-dark shadow-soft transition hover:bg-mint-dark hover:text-white"
                  >
                    <ShoppingBag size={18} strokeWidth={1.7} />
                    {count > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-gold px-1 font-btn text-[10px] font-bold text-mint-dark">
                        {count}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label="Account"
                    className="grid h-11 w-11 place-items-center rounded-full bg-white text-mint-dark shadow-soft transition hover:bg-mint-dark hover:text-white"
                  >
                    <User size={18} strokeWidth={1.7} />
                  </button>
                </div>
                <p className="mt-5 font-btn text-[10px] uppercase tracking-[0.25em] text-ink/40">
                  ANISHEELS Collection · Accra
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
