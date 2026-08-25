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

  return (
    <>
      {/* Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'glass shadow-luxe-sm'
            : overHero
              ? 'bg-transparent'
              : 'bg-cream/80 backdrop-blur-sm'
        }`}
      >
        <nav className="container-luxe flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            to="/"
            className={`font-heading text-xl font-bold tracking-tight ${logoColor} sm:text-2xl`}
            aria-label="ANISHEELS Collection home"
          >
            ANISHEELS
            <span className="block text-[9px] font-medium uppercase tracking-[0.45em] text-gold">
              Collection
            </span>
          </Link>

          {/* Desktop menu */}
          <ul className={`hidden items-center gap-8 lg:flex ${textColor}`}>
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="group relative font-btn text-[12px] font-medium uppercase tracking-[0.16em] transition-colors hover:text-gold"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div className={`flex items-center gap-1 sm:gap-2 ${textColor}`}>
            {icons.slice(0, 2).map(({ Icon, label }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full transition-all hover:bg-white/20 hover:text-gold"
              >
                <Icon size={19} strokeWidth={1.7} />
              </button>
            ))}
            {/* Cart icon with badge */}
            <button
              type="button"
              aria-label={`Cart, ${count} items`}
              onClick={openCart}
              className="relative grid h-10 w-10 place-items-center rounded-full transition-all hover:bg-white/20 hover:text-gold"
            >
              <ShoppingBag size={19} strokeWidth={1.7} />
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
              className="grid h-10 w-10 place-items-center rounded-full transition-all hover:bg-white/20 hover:text-gold"
            >
              <User size={19} strokeWidth={1.7} />
            </button>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className={`ml-1 grid h-10 w-10 place-items-center rounded-full transition-all hover:bg-white/20 lg:hidden ${textColor}`}
            >
              <Menu size={22} strokeWidth={1.7} />
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
