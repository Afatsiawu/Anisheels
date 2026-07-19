import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Package,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { fetchAllOrders } from '../../lib/adminOrders';
import { fetchAllProductsAdmin } from '../../lib/products';
import type { OrderRow } from '../../lib/supabase';

const statusStyles: Record<string, string> = {
  pending: 'bg-fog text-ink/60',
  confirmed: 'bg-mint-light text-mint-dark',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-amber-50 text-amber-600',
  delivered: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-600',
};

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  delay,
}: {
  label: string;
  value: string;
  icon: typeof ShoppingBag;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-3xl bg-white p-6 shadow-soft"
    >
      <div className="flex items-center justify-between">
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${accent}`}>
          <Icon size={22} strokeWidth={1.6} />
        </div>
      </div>
      <p className="mt-4 font-heading text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 font-body text-sm text-ink/55">{label}</p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [o, p] = await Promise.all([fetchAllOrders(), fetchAllProductsAdmin()]);
        setOrders(o);
        setProductCount(p.length);
      } catch {
        // ignore — stats just show zeros
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + Number(o.total), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const recent = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={24} className="animate-spin text-mint-dark" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
        Welcome back
      </h1>
      <p className="mt-1 font-body text-sm text-ink/55">
        Here's what's happening in your boutique today.
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`GHS ${revenue.toLocaleString()}`}
          icon={DollarSign}
          accent="bg-mint-light text-mint-dark"
          delay={0}
        />
        <StatCard
          label="Total Orders"
          value={String(orders.length)}
          icon={ShoppingBag}
          accent="bg-gold/15 text-gold"
          delay={0.08}
        />
        <StatCard
          label="Products"
          value={String(productCount)}
          icon={Package}
          accent="bg-blue-50 text-blue-600"
          delay={0.16}
        />
        <StatCard
          label="Pending Orders"
          value={String(pendingCount)}
          icon={TrendingUp}
          accent="bg-amber-50 text-amber-600"
          delay={0.24}
        />
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          to="/admin/products/new"
          className="group flex items-center justify-between rounded-3xl bg-mint-dark p-5 text-white shadow-luxe transition hover:-translate-y-1"
        >
          <div>
            <p className="font-btn text-[10px] uppercase tracking-[0.18em] text-gold">
              Catalog
            </p>
            <p className="mt-1 font-heading text-lg font-semibold">Add Product</p>
          </div>
          <ArrowRight
            size={20}
            className="text-gold transition-transform group-hover:translate-x-1"
          />
        </Link>
        <Link
          to="/admin/products"
          className="group flex items-center justify-between rounded-3xl bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-luxe-sm"
        >
          <div>
            <p className="font-btn text-[10px] uppercase tracking-[0.18em] text-mint">
              Catalog
            </p>
            <p className="mt-1 font-heading text-lg font-semibold text-ink">
              Manage Products
            </p>
          </div>
          <ArrowRight
            size={20}
            className="text-mint-dark transition-transform group-hover:translate-x-1"
          />
        </Link>
        <Link
          to="/admin/orders"
          className="group flex items-center justify-between rounded-3xl bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-luxe-sm"
        >
          <div>
            <p className="font-btn text-[10px] uppercase tracking-[0.18em] text-mint">
              Sales
            </p>
            <p className="mt-1 font-heading text-lg font-semibold text-ink">
              View Orders
            </p>
          </div>
          <ArrowRight
            size={20}
            className="text-mint-dark transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Recent orders */}
      <div className="mt-8 rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-ink">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="font-btn text-[11px] uppercase tracking-[0.14em] text-mint-dark transition hover:text-gold"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="py-10 text-center font-body text-sm text-ink/50">
            No orders yet. They'll appear here once customers check out.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-mint/10">
            {recent.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-btn text-xs font-semibold text-mint-dark">
                    {o.order_number}
                  </p>
                  <p className="font-body text-sm text-ink/70">{o.full_name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-heading text-sm font-semibold text-ink">
                    GHS {Number(o.total).toLocaleString()}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 font-btn text-[9px] font-semibold uppercase tracking-[0.12em] ${
                      statusStyles[o.status] ?? statusStyles.pending
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
