import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  ShoppingBag,
  Minus,
  Plus,
  Check,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchProductById, type StoreProduct } from '../lib/products';

const sizes = ['35', '36', '37', '38', '39', '40', '41'];

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { add } = useCart();

  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [size, setSize] = useState('38');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    fetchProductById(Number(id))
      .then((p) => {
        if (cancelled) return;
        if (!p) {
          setNotFound(true);
        } else {
          setProduct(p);
          document.title = `${p.name} — Anisheels`;
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    add(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews,
        oldPrice: product.oldPrice,
        badge: product.badge,
        discount: product.discount,
        hoverImage: product.hoverImage,
      },
      size,
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-mint-dark" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-heading text-2xl font-semibold text-ink">
          Product not found
        </h1>
        <p className="font-body text-sm text-ink/60">
          This item may have been removed or is no longer available.
        </p>
        <Link to="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 font-btn text-[11px] uppercase tracking-[0.16em] text-ink/55 transition hover:text-mint-dark"
      >
        <ArrowLeft size={14} /> Back to Shop
      </Link>

      <motion.div
        className="mt-6 grid grid-cols-1 gap-8 overflow-hidden rounded-4xl bg-cream shadow-luxe sm:grid-cols-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
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
            <h1 className="mt-1 font-heading text-2xl font-semibold text-ink sm:text-3xl">
              {product.name}
            </h1>
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

          {product.description && (
            <p className="font-body text-sm leading-relaxed text-ink/65">
              {product.description}
            </p>
          )}

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
  );
}