import { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '../data/store';
import { useCart } from '../context/CartContext';
import { useQuickView } from '../context/QuickViewContext';

const badgeStyles: Record<string, string> = {
  'Best Seller': 'bg-mint-dark text-white',
  Trending: 'bg-gold text-mint-dark',
  Limited: 'bg-ink text-white',
  New: 'bg-mint text-mint-dark',
};

type Props = {
  product: Product;
  index?: number;
};

export default function ProductCard({ product, index = 0 }: Props) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const { open } = useQuickView();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    add(product, '38', 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.article
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
    >
      {/* Image area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-fog">
        <img
          src={product.image}
          alt={`${product.name} — ${product.category}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-0"
        />
        <img
          src={product.hoverImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-100"
        />

        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {product.badge && (
            <span
              className={`rounded-full px-3 py-1 font-btn text-[10px] font-semibold uppercase tracking-[0.15em] shadow-soft ${
                badgeStyles[product.badge]
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.discount && (
            <span className="rounded-full bg-white/90 px-3 py-1 font-btn text-[10px] font-bold text-mint-dark shadow-soft backdrop-blur">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => setWished((w) => !w)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/85 text-mint-dark shadow-soft backdrop-blur transition-all hover:scale-110 hover:bg-white"
        >
          <Heart
            size={18}
            strokeWidth={1.8}
            className={wished ? 'fill-gold text-gold' : ''}
          />
        </button>

        {/* Quick view */}
        <div className="absolute inset-x-4 bottom-4 translate-y-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => open(product)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white/90 py-3 font-btn text-[11px] font-semibold uppercase tracking-[0.18em] text-mint-dark shadow-luxe-sm backdrop-blur transition hover:bg-white"
          >
            <Eye size={15} strokeWidth={1.8} /> Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-btn text-[10px] uppercase tracking-[0.22em] text-mint">
          {product.category}
        </p>
        <h3 className="font-heading text-lg font-semibold leading-snug text-ink">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5" aria-label={`Rated ${product.rating} of 5`}>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                strokeWidth={1.5}
                className={
                  i < product.rating
                    ? 'fill-gold text-gold'
                    : 'fill-fog text-fog'
                }
              />
            ))}
          </div>
          <span className="font-body text-[11px] text-ink/50">
            ({product.reviews})
          </span>
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-heading text-xl font-semibold text-mint-dark">
            GHS {product.price}
          </span>
          {product.oldPrice && (
            <span className="font-body text-sm text-ink/40 line-through">
              GHS {product.oldPrice}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-mint-light py-3 font-btn text-[11px] font-semibold uppercase tracking-[0.18em] text-mint-dark transition-all hover:bg-mint-dark hover:text-white"
        >
          {added ? (
            <>
              <Check size={15} strokeWidth={2} /> Added
            </>
          ) : (
            <>
              <ShoppingBag size={15} strokeWidth={1.8} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}
