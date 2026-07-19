import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Search,
  Package,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  fetchAllProductsAdmin,
  deleteProduct,
  type ProductRow,
} from '../../lib/products';

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await fetchAllProductsAdmin();
      setProducts(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setConfirmId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete product.');
      setConfirmId(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 font-body text-sm text-ink/55">
            {products.length} {products.length === 1 ? 'product' : 'products'} in
            your catalog
          </p>
        </div>
        <Link to="/admin/products/new" className="btn-primary">
          <Plus size={16} strokeWidth={2} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mt-6 max-w-md">
        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
          strokeWidth={1.7}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or category…"
          className="w-full rounded-full border border-mint/30 bg-white py-3 pl-11 pr-4 font-body text-sm text-ink outline-none transition focus:border-mint-dark"
        />
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-2xl bg-red-50 px-4 py-3 font-body text-xs text-red-600">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 size={24} className="animate-spin text-mint-dark" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-4xl bg-white py-16 text-center shadow-soft">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-mint-light">
            <Package size={28} className="text-mint-dark" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-heading text-xl text-ink">
              {search ? 'No products match your search.' : 'No products yet.'}
            </p>
            <p className="mt-1 font-body text-sm text-ink/55">
              {search
                ? 'Try a different keyword.'
                : 'Add your first product to the catalog.'}
            </p>
          </div>
          {!search && (
            <Link to="/admin/products/new" className="btn-primary">
              <Plus size={16} strokeWidth={2} /> Add Product
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-soft">
          {/* Desktop table */}
          <table className="hidden w-full sm:table">
            <thead>
              <tr className="border-b border-mint/15 text-left">
                <th className="px-5 py-4 font-btn text-[10px] uppercase tracking-[0.16em] text-ink/55">
                  Product
                </th>
                <th className="px-5 py-4 font-btn text-[10px] uppercase tracking-[0.16em] text-ink/55">
                  Category
                </th>
                <th className="px-5 py-4 font-btn text-[10px] uppercase tracking-[0.16em] text-ink/55">
                  Price
                </th>
                <th className="px-5 py-4 font-btn text-[10px] uppercase tracking-[0.16em] text-ink/55">
                  Status
                </th>
                <th className="px-5 py-4 text-right font-btn text-[10px] uppercase tracking-[0.16em] text-ink/55">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="border-b border-mint/10 transition hover:bg-mint-light/30"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-14 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-heading text-sm font-semibold text-ink">
                          {p.name}
                        </p>
                        {p.badge && (
                          <span className="font-btn text-[9px] uppercase tracking-[0.15em] text-gold">
                            {p.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-body text-sm text-ink/70">
                    {p.category}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-heading text-sm font-semibold text-mint-dark">
                      GHS {Number(p.price).toLocaleString()}
                    </span>
                    {p.old_price && (
                      <span className="ml-2 font-body text-xs text-ink/40 line-through">
                        {Number(p.old_price).toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {p.is_active ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-light px-3 py-1 font-btn text-[10px] font-semibold uppercase tracking-[0.12em] text-mint-dark">
                        <Eye size={11} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-fog px-3 py-1 font-btn text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/50">
                        <EyeOff size={11} /> Hidden
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="grid h-9 w-9 place-items-center rounded-full bg-mint-light text-mint-dark transition hover:bg-mint hover:text-white"
                        aria-label={`Edit ${p.name}`}
                      >
                        <Pencil size={15} strokeWidth={1.8} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setConfirmId(p.id)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100"
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 size={15} strokeWidth={1.8} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="sm:hidden">
            {filtered.map((p) => (
              <li
                key={p.id}
                className="flex gap-3 border-b border-mint/10 p-4 last:border-0"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-16 w-14 rounded-lg object-cover"
                />
                <div className="flex flex-1 flex-col">
                  <p className="font-heading text-sm font-semibold text-ink">
                    {p.name}
                  </p>
                  <p className="font-body text-xs text-ink/55">{p.category}</p>
                  <p className="mt-1 font-heading text-sm font-semibold text-mint-dark">
                    GHS {Number(p.price).toLocaleString()}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-mint-light px-3 py-1.5 font-btn text-[10px] font-semibold uppercase tracking-[0.12em] text-mint-dark"
                    >
                      <Pencil size={12} /> Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmId(p.id)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 font-btn text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-3xl bg-cream p-6 shadow-luxe"
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50">
              <Trash2 size={24} className="text-red-500" strokeWidth={1.6} />
            </div>
            <h3 className="mt-4 text-center font-heading text-xl font-semibold text-ink">
              Delete product?
            </h3>
            <p className="mt-2 text-center font-body text-sm text-ink/60">
              This will permanently remove the product from your catalog.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmId)}
                className="flex-1 rounded-full bg-red-500 px-7 py-3.5 font-btn text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
