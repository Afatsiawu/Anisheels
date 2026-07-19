import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Tag,
  X,
  ShieldCheck,
  Truck,
  RefreshCw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { validatePromo, type PromoCode } from '../lib/promo';

export default function Cart() {
  const { items, remove, setQty, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');

  const applyPromo = () => {
    const code = promoInput.trim();
    if (!code) return;
    const found = validatePromo(code);
    if (!found) {
      setPromoError("That code isn't valid.");
      setPromo(null);
      return;
    }
    setPromoError('');
    setPromo(found);
  };

  const removePromo = () => {
    setPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  const discount = promo
    ? promo.type === 'percent'
      ? (subtotal * promo.value) / 100
      : Math.min(promo.value, subtotal)
    : 0;
  const shipping = subtotal >= 300 || subtotal === 0 ? 0 : 30;
  const total = Math.max(0, subtotal - discount + shipping);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid h-24 w-24 place-items-center rounded-full bg-mint-light"
        >
          <ShoppingBag size={40} className="text-mint-dark" strokeWidth={1.4} />
        </motion.div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-ink">Your cart is empty</h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            Looks like you haven't added any heels yet. Let's find your next pair.
          </p>
        </div>
        <Link to="/shop" className="btn-primary">
          Browse the Collection <ArrowRight size={16} strokeWidth={2.2} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream pb-20 pt-10">
      {/* Header */}
      <section className="bg-mint-light py-12 sm:py-16">
        <div className="container-luxe text-center">
          <motion.p
            className="eyebrow mb-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Shopping Bag
          </motion.p>
          <motion.h1
            className="font-heading text-4xl font-bold text-mint-dark sm:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your Cart
          </motion.h1>
          <div className="gold-divider mx-auto mt-6 w-40" />
        </div>
      </section>

      <div className="container-luxe mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        {/* Line items */}
        <div className="flex flex-col gap-4">
          <div className="hidden items-center justify-between border-b border-mint/20 pb-3 sm:flex">
            <h2 className="font-btn text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/60">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </h2>
            <button
              type="button"
              onClick={clear}
              className="flex items-center gap-1.5 font-btn text-[11px] uppercase tracking-[0.15em] text-ink/50 transition hover:text-red-500"
            >
              <Trash2 size={13} /> Clear all
            </button>
          </div>

          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={`${item.id}-${item.size}`}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="flex gap-4 rounded-3xl bg-white p-4 shadow-soft sm:p-5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-28 w-24 shrink-0 rounded-2xl object-cover sm:h-32 sm:w-28"
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-btn text-[10px] uppercase tracking-[0.2em] text-mint">
                        {item.category}
                      </p>
                      <h3 className="mt-0.5 font-heading text-lg font-semibold text-ink">
                        {item.name}
                      </h3>
                      <p className="mt-1 font-body text-xs text-ink/50">
                        Size: {item.size}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => remove(item.id, item.size)}
                      className="grid h-9 w-9 place-items-center rounded-full text-ink/40 transition hover:bg-fog hover:text-red-500"
                    >
                      <X size={16} strokeWidth={1.8} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div className="flex items-center gap-2 rounded-full bg-mint-light p-1">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(item.id, item.size, item.quantity - 1)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-white text-mint-dark transition hover:bg-mint hover:text-white"
                      >
                        <Minus size={13} strokeWidth={2} />
                      </button>
                      <span className="min-w-[1.75rem] text-center font-btn text-sm font-semibold text-mint-dark">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty(item.id, item.size, item.quantity + 1)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-white text-mint-dark transition hover:bg-mint hover:text-white"
                      >
                        <Plus size={13} strokeWidth={2} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-lg font-semibold text-mint-dark">
                        GHS {(item.price * item.quantity).toLocaleString()}
                      </p>
                      {item.quantity > 1 && (
                        <p className="font-body text-[11px] text-ink/45">
                          GHS {item.price.toLocaleString()} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Link
            to="/shop"
            className="mt-2 inline-flex w-fit items-center gap-2 font-btn text-xs font-semibold uppercase tracking-[0.16em] text-mint-dark transition hover:text-gold"
          >
            <ArrowLeft size={15} /> Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-4xl bg-white p-6 shadow-luxe-sm sm:p-7">
            <h2 className="font-heading text-xl font-semibold text-ink">
              Order Summary
            </h2>

            {/* Promo */}
            <div className="mt-5">
              <label className="mb-2 block font-btn text-[11px] uppercase tracking-[0.18em] text-ink/60">
                Promo Code
              </label>
              {promo ? (
                <div className="flex items-center justify-between rounded-2xl bg-mint-light px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag size={15} className="text-gold" strokeWidth={1.8} />
                    <div>
                      <p className="font-btn text-xs font-semibold text-mint-dark">
                        {promo.code}
                      </p>
                      <p className="font-body text-[11px] text-mint-dark/70">
                        {promo.label}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove promo"
                    onClick={removePromo}
                    className="grid h-7 w-7 place-items-center rounded-full text-mint-dark/60 transition hover:bg-white hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                    placeholder="e.g. WELCOME10"
                    aria-label="Promo code"
                    className="flex-1 rounded-full border border-mint/30 bg-cream px-4 py-2.5 font-body text-sm text-ink outline-none transition focus:border-mint-dark"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="rounded-full bg-mint-dark px-5 py-2.5 font-btn text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-gold"
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoError && (
                <p className="mt-2 font-body text-xs text-red-500">{promoError}</p>
              )}
              <p className="mt-2 font-body text-[11px] text-ink/45">
                Try: WELCOME10 · FREESHIP · LUXE15
              </p>
            </div>

            <div className="my-5 h-px bg-mint/15" />

            {/* Totals */}
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="font-body text-sm text-ink/70">Subtotal</dt>
                <dd className="font-body text-sm font-semibold text-ink">
                  GHS {subtotal.toLocaleString()}
                </dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-gold">
                  <dt className="font-body text-sm">Discount</dt>
                  <dd className="font-body text-sm font-semibold">
                    − GHS {discount.toLocaleString()}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="font-body text-sm text-ink/70">Shipping</dt>
                <dd className="font-body text-sm font-semibold text-ink">
                  {shipping === 0 ? 'FREE' : `GHS ${shipping}`}
                </dd>
              </div>
              {subtotal < 300 && (
                <p className="font-body text-[11px] text-mint-dark/70">
                  Add GHS {(300 - subtotal).toLocaleString()} more for free shipping.
                </p>
              )}
            </dl>

            <div className="my-5 h-px bg-mint/15" />

            <div className="flex items-baseline justify-between">
              <span className="font-btn text-xs uppercase tracking-[0.18em] text-ink/70">
                Total
              </span>
              <span className="font-heading text-3xl font-bold text-mint-dark">
                GHS {total.toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="btn-gold mt-6 w-full"
            >
              Proceed to Checkout <ArrowRight size={16} strokeWidth={2.2} />
            </button>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              {[
                { Icon: ShieldCheck, label: 'Secure' },
                { Icon: Truck, label: 'Fast Ship' },
                { Icon: RefreshCw, label: '30-day' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <Icon size={18} className="text-mint-dark" strokeWidth={1.6} />
                  <span className="font-body text-[10px] text-ink/55">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
