import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Star, ShoppingBag, Minus, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Product } from '../data/store';

const sizes = ['35', '36', '37', '38', '39', '40', '41'];

type Props = {
  product: Product | null;
  onClose: () => void;
};

export default function QuickView({ product, onClose }: Props) {
  const { add } = useCart();
  const [size, setSize] = useState('38');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!product) return;
    add(product, size, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-4xl bg-cream shadow-luxe sm:grid-cols-2"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label={`${product.name} quick view`}
            >
              <button
                type="button"
                aria-label="Close quick view"
                onClick={onClose}
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/85 text-mint-dark shadow-soft backdrop-blur transition hover:bg-white"
              >
                <X size={20} strokeWidth={1.8} />
              </button>

              <div className="relative aspect-square sm:aspect-auto">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-4 p-7 sm:p-8">
                <div>
                  <p className="font-btn text-[10px] uppercase tracking-[0.22em] text-mint">
                    {product.category}
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-semibold text-ink">
                    {product.name}
                  </h2>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < product.rating
                              ? 'fill-gold text-gold'
                              : 'fill-fog text-fog'
                          }
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <span className="font-body text-xs text-ink/50">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-semibold text-mint-dark">
                    GHS {product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="font-body text-base text-ink/40 line-through">
                      GHS {product.oldPrice}
                    </span>
                  )}
                </div>

                <p className="font-body text-sm leading-relaxed text-ink/65">
                  Handcrafted from premium materials with a memory-foam insole
                  for all-day comfort. A timeless silhouette designed to move
                  with you from desk to dinner.
                </p>

                <div>
                  <p className="mb-2 font-btn text-[11px] uppercase tracking-[0.18em] text-ink/70">
                    Select Size (EU)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`h-11 w-11 rounded-xl font-btn text-sm font-semibold transition-all ${
                          size === s
                            ? 'bg-mint-dark text-white shadow-luxe-sm'
                            : 'bg-white text-ink/70 shadow-soft hover:bg-mint-light'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-btn text-[11px] uppercase tracking-[0.18em] text-ink/70">
                    Quantity
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white p-1.5 shadow-soft">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="grid h-8 w-8 place-items-center rounded-full bg-mint-light text-mint-dark transition hover:bg-mint hover:text-white"
                    >
                      <Minus size={14} strokeWidth={2} />
                    </button>
                    <span className="min-w-[2rem] text-center font-btn text-sm font-semibold text-mint-dark">
                      {qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty((q) => q + 1)}
                      className="grid h-8 w-8 place-items-center rounded-full bg-mint-light text-mint-dark transition hover:bg-mint hover:text-white"
                    >
                      <Plus size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="btn-primary mt-2 w-full"
                >
                  {added ? (
                    <>
                      <Check size={16} strokeWidth={2.2} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} strokeWidth={1.8} /> Add to Cart · GHS{' '}
                      {(product.price * qty).toLocaleString()}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
