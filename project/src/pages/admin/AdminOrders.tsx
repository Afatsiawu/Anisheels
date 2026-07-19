import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  AlertCircle,
  Search,
  ShoppingBag,
  X,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import {
  fetchAllOrders,
  fetchOrderItems,
  updateOrderStatus,
  type OrderWithItems,
} from '../../lib/adminOrders';
import type { OrderRow } from '../../lib/supabase';

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusStyles: Record<string, string> = {
  pending: 'bg-fog text-ink/60',
  confirmed: 'bg-mint-light text-mint-dark',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-amber-50 text-amber-600',
  delivered: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-600',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<OrderWithItems | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await fetchAllOrders();
      setOrders(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openOrder = async (order: OrderRow) => {
    setSelected({ ...order, items: [] });
    setDrawerLoading(true);
    try {
      const items = await fetchOrderItems(order.id);
      setSelected({ ...order, items });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load order items.');
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingStatus(true);
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      setSelected((prev) =>
        prev && prev.id === orderId ? { ...prev, status } : prev
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.full_name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
            Orders
          </h1>
          <p className="mt-1 font-body text-sm text-ink/55">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} ·{' '}
            <span className="font-semibold text-mint-dark">
              GHS {totalRevenue.toLocaleString()}
            </span>{' '}
            revenue
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
            strokeWidth={1.7}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, name, or email…"
            className="w-full rounded-full border border-mint/30 bg-white py-3 pl-11 pr-4 font-body text-sm text-ink outline-none transition focus:border-mint-dark"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['all', ...statusOptions].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-btn text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
                statusFilter === s
                  ? 'bg-mint-dark text-white shadow-luxe-sm'
                  : 'bg-white text-ink/60 hover:bg-mint-light'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
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
            <ShoppingBag size={28} className="text-mint-dark" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-heading text-xl text-ink">
              {search || statusFilter !== 'all'
                ? 'No orders match your filters.'
                : 'No orders yet.'}
            </p>
            <p className="mt-1 font-body text-sm text-ink/55">
              {search || statusFilter !== 'all'
                ? 'Try clearing the filters.'
                : 'Orders from the storefront will appear here.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-soft">
          <table className="hidden w-full sm:table">
            <thead>
              <tr className="border-b border-mint/15 text-left">
                <th className="px-5 py-4 font-btn text-[10px] uppercase tracking-[0.16em] text-ink/55">
                  Order
                </th>
                <th className="px-5 py-4 font-btn text-[10px] uppercase tracking-[0.16em] text-ink/55">
                  Customer
                </th>
                <th className="px-5 py-4 font-btn text-[10px] uppercase tracking-[0.16em] text-ink/55">
                  Date
                </th>
                <th className="px-5 py-4 font-btn text-[10px] uppercase tracking-[0.16em] text-ink/55">
                  Total
                </th>
                <th className="px-5 py-4 font-btn text-[10px] uppercase tracking-[0.16em] text-ink/55">
                  Status
                </th>
                <th className="px-5 py-4 text-right font-btn text-[10px] uppercase tracking-[0.16em] text-ink/55">
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  onClick={() => openOrder(o)}
                  className="cursor-pointer border-b border-mint/10 transition hover:bg-mint-light/30"
                >
                  <td className="px-5 py-4">
                    <p className="font-btn text-xs font-semibold text-mint-dark">
                      {o.order_number}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-body text-sm font-semibold text-ink">
                      {o.full_name}
                    </p>
                    <p className="font-body text-xs text-ink/50">{o.email}</p>
                  </td>
                  <td className="px-5 py-4 font-body text-xs text-ink/60">
                    {formatDate(o.created_at)}
                  </td>
                  <td className="px-5 py-4 font-heading text-sm font-semibold text-mint-dark">
                    GHS {Number(o.total).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 font-btn text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        statusStyles[o.status] ?? statusStyles.pending
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ChevronRight
                      size={16}
                      className="ml-auto text-ink/40"
                      strokeWidth={1.8}
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="sm:hidden">
            {filtered.map((o) => (
              <li
                key={o.id}
                onClick={() => openOrder(o)}
                className="flex cursor-pointer items-center justify-between gap-3 border-b border-mint/10 p-4 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-btn text-xs font-semibold text-mint-dark">
                    {o.order_number}
                  </p>
                  <p className="mt-0.5 truncate font-body text-sm font-semibold text-ink">
                    {o.full_name}
                  </p>
                  <p className="font-body text-xs text-ink/50">
                    {formatDate(o.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-sm font-semibold text-mint-dark">
                    GHS {Number(o.total).toLocaleString()}
                  </p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 font-btn text-[9px] font-semibold uppercase tracking-[0.12em] ${
                      statusStyles[o.status] ?? statusStyles.pending
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-cream shadow-luxe"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
              role="dialog"
              aria-label="Order details"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-mint/20 bg-white px-6 py-5">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-ink">
                    {selected.order_number}
                  </h2>
                  <p className="font-body text-xs text-ink/55">
                    {formatDate(selected.created_at)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setSelected(null)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-mint-light text-mint-dark transition hover:bg-mint hover:text-white"
                >
                  <X size={20} strokeWidth={1.8} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* Status */}
                <div className="mb-5">
                  <label className="mb-2 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={updatingStatus}
                        onClick={() => handleStatusChange(selected.id, s)}
                        className={`rounded-full px-3.5 py-2 font-btn text-[10px] font-semibold uppercase tracking-[0.12em] transition-all disabled:opacity-60 ${
                          selected.status === s
                            ? 'bg-mint-dark text-white shadow-luxe-sm'
                            : 'bg-white text-ink/60 hover:bg-mint-light'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer */}
                <div className="rounded-2xl bg-white p-4 shadow-soft">
                  <p className="font-btn text-[10px] uppercase tracking-[0.18em] text-ink/55">
                    Customer
                  </p>
                  <p className="mt-2 font-heading text-base font-semibold text-ink">
                    {selected.full_name}
                  </p>
                  <div className="mt-3 space-y-2 font-body text-sm text-ink/70">
                    <p className="flex items-center gap-2">
                      <Mail size={14} className="text-mint" strokeWidth={1.7} />
                      {selected.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={14} className="text-mint" strokeWidth={1.7} />
                      {selected.phone}
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin size={14} className="mt-0.5 text-mint" strokeWidth={1.7} />
                      <span>
                        {selected.address}
                        <br />
                        {selected.city}
                        {selected.region ? `, ${selected.region}` : ''},{' '}
                        {selected.country}
                      </span>
                    </p>
                  </div>
                  {selected.notes && (
                    <div className="mt-3 rounded-xl bg-mint-light/50 p-3">
                      <p className="font-btn text-[10px] uppercase tracking-[0.16em] text-ink/55">
                        Delivery notes
                      </p>
                      <p className="mt-1 font-body text-xs text-mint-dark">
                        {selected.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="mt-5">
                  <p className="mb-3 font-btn text-[10px] uppercase tracking-[0.18em] text-ink/55">
                    Items
                  </p>
                  {drawerLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 size={20} className="animate-spin text-mint-dark" />
                    </div>
                  ) : selected.items.length === 0 ? (
                    <p className="font-body text-sm text-ink/50">
                      No items found.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {selected.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex gap-3 rounded-2xl bg-white p-3 shadow-soft"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              className="h-16 w-14 shrink-0 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex flex-1 flex-col">
                            <p className="font-heading text-sm font-semibold text-ink">
                              {item.name}
                            </p>
                            <p className="font-body text-xs text-ink/50">
                              Size {item.size} · Qty {item.quantity}
                            </p>
                            <p className="mt-auto font-body text-sm font-semibold text-mint-dark">
                              GHS{' '}
                              {(Number(item.price) * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Totals */}
                <div className="mt-5 rounded-2xl bg-white p-4 shadow-soft">
                  <dl className="space-y-2 font-body text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ink/60">Subtotal</dt>
                      <dd className="font-semibold text-ink">
                        GHS {Number(selected.subtotal).toLocaleString()}
                      </dd>
                    </div>
                    {Number(selected.discount) > 0 && (
                      <div className="flex justify-between text-gold">
                        <dt>Discount</dt>
                        <dd className="font-semibold">
                          − GHS {Number(selected.discount).toLocaleString()}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-ink/60">Shipping</dt>
                      <dd className="font-semibold text-ink">
                        {Number(selected.shipping) === 0
                          ? 'FREE'
                          : `GHS ${Number(selected.shipping)}`}
                      </dd>
                    </div>
                    {selected.promo_code && (
                      <div className="flex justify-between">
                        <dt className="text-ink/60">Promo</dt>
                        <dd className="font-semibold text-ink">
                          {selected.promo_code}
                        </dd>
                      </div>
                    )}
                    <div className="mt-2 flex justify-between border-t border-mint/15 pt-3">
                      <dt className="font-btn text-xs uppercase tracking-[0.16em] text-ink/70">
                        Total
                      </dt>
                      <dd className="font-heading text-xl font-bold text-mint-dark">
                        GHS {Number(selected.total).toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
