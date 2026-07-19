import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, close, remove, setQty, subtotal, count } = useCart();

  const freeShipThreshold = 300;
  const remaining = Math.max(0, freeShipThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeShipThreshold) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-cream shadow-luxe"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.45 }}
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-mint/20 px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-mint-dark" strokeWidth={1.7} />
                <h2 className="font-heading text-lg font-semibold text-mint-dark">
                  Your Cart
                </h2>
                <span className="rounded-full bg-mint-light px-2.5 py-0.5 font-btn text-[10px] font-semibold text-mint-dark">
                  {count}
                </span>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={close}
                className="grid h-10 w-10 place-items-center rounded-full bg-mint-light text-mint-dark transition hover:bg-mint hover:text-white"
              >
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && (
              <div className="border-b border-mint/15 bg-mint-light/40 px-6 py-4">
                <p className="font-body text-xs text-mint-dark">
                  {remaining > 0 ? (
                    <>
                      Add <span className="font-semibold">GHS {remaining.toFixed(0)}</span> more for{' '}
                      <span className="font-semibold">FREE delivery</span>
                    </>
                  ) : (
                    <>You've unlocked <span className="font-semibold">FREE delivery</span> 🎉</>
                  )}
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white">
                  <motion.div
                    className="h-full rounded-full bg-gold-gradient"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-mint-light">
                    <ShoppingBag size={32} className="text-mint-dark" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-heading text-xl text-ink">Your cart is empty</p>
                    <p className="mt-1 font-body text-sm text-ink/55">
                      Discover heels worth falling for.
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    onClick={close}
                    className="btn-primary mt-2"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => (
                    <motion.li
                      key={`${item.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="flex gap-4 rounded-2xl bg-white p-3 shadow-soft"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-24 w-20 shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-btn text-[9px] uppercase tracking-[0.18em] text-mint">
                              {item.category}
                            </p>
                            <h3 className="font-heading text-sm font-semibold leading-snug text-ink">
                              {item.name}
                            </h3>
                            <p className="mt-0.5 font-body text-[11px] text-ink/50">
                              Size: {item.size}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label="Remove item"
                            onClick={() => remove(item.id, item.size)}
                            className="grid h-8 w-8 place-items-center rounded-full text-ink/40 transition hover:bg-fog hover:text-red-500"
                          >
                            <Trash2 size={15} strokeWidth={1.7} />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full bg-mint-light p-1">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => setQty(item.id, item.size, item.quantity - 1)}
                              className="grid h-7 w-7 place-items-center rounded-full bg-white text-mint-dark transition hover:bg-mint hover:text-white"
                            >
                              <Minus size={13} strokeWidth={2} />
                            </button>
                            <span className="min-w-[1.5rem] text-center font-btn text-sm font-semibold text-mint-dark">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => setQty(item.id, item.size, item.quantity + 1)}
                              className="grid h-7 w-7 place-items-center rounded-full bg-white text-mint-dark transition hover:bg-mint hover:text-white"
                            >
                              <Plus size={13} strokeWidth={2} />
                            </button>
                          </div>
                          <span className="font-heading text-base font-semibold text-mint-dark">
                            GHS {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-mint/20 bg-white px-6 py-5">
                <div className="flex items-center justify-between">
                  <span className="font-btn text-xs uppercase tracking-[0.18em] text-ink/60">
                    Subtotal
                  </span>
                  <span className="font-heading text-2xl font-semibold text-mint-dark">
                    GHS {subtotal.toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 font-body text-[11px] text-ink/45">
                  Shipping & taxes calculated at checkout.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    to="/checkout"
                    onClick={close}
                    className="btn-gold w-full"
                  >
                    Checkout <ArrowRight size={16} strokeWidth={2.2} />
                  </Link>
                  <Link
                    to="/cart"
                    onClick={close}
                    className="btn-outline w-full"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
