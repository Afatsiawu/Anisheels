import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Package,
  Truck,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { supabase, type OrderRow, type OrderItemRow } from '../lib/supabase';

type LoadedOrder = {
  order: OrderRow;
  items: OrderItemRow[];
};

export default function OrderConfirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  // `passedEmail` is currently unused; keep location state extraction
  // for future behavior without failing lint.
  void (location.state as { email?: string } | null)?.email;


  const [data, setData] = useState<LoadedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      if (!orderNumber) {
        setError('No order number provided.');
        setLoading(false);
        return;
      }
      try {
        const { data: order, error: oErr } = await supabase
          .from('orders')
          .select('*')
          .eq('order_number', orderNumber)
          .maybeSingle();

        if (oErr) throw oErr;
        if (!order) {
          setError("We couldn't find this order.");
          setLoading(false);
          return;
        }

        const { data: items, error: iErr } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        if (iErr) throw iErr;
        if (active) {
          setData({ order: order as OrderRow, items: (items ?? []) as OrderItemRow[] });
          setLoading(false);
        }
      } catch (e) {
        if (active) {
          setError(e instanceof Error ? e.message : 'Failed to load order.');
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 size={32} className="animate-spin text-mint-dark" />
        <p className="font-body text-sm text-ink/60">Loading your order…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <AlertCircle size={40} className="text-gold" />
        <div>
          <h1 className="font-heading text-3xl font-bold text-ink">
            {error || 'Order not found'}
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            If you believe this is an error, contact care@anisheels.com.
          </p>
        </div>
        <Link to="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  const { order, items } = data;
  const estimated = new Date(order.created_at);
  estimated.setDate(estimated.getDate() + 4);

  return (
    <div className="bg-cream pb-20 pt-10">
      {/* Hero */}
      <section className="relative overflow-hidden bg-mint-gradient py-16 sm:py-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
        <div className="container-luxe relative text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 18, stiffness: 200 }}
            className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white text-mint-dark shadow-luxe"
          >
            <CheckCircle2 size={44} strokeWidth={1.6} />
          </motion.div>
          <motion.h1
            className="mt-6 font-heading text-4xl font-bold text-mint-dark sm:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Thank You{order.full_name ? `, ${order.full_name.split(' ')[0]}` : ''}!
          </motion.h1>
          <motion.p
            className="mx-auto mt-3 max-w-md font-body text-sm text-mint-dark/80"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            Your order is confirmed. A receipt is on its way to{' '}
            <span className="font-semibold">{order.email}</span>.
          </motion.p>
          <motion.div
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-5 py-2.5 font-btn text-xs font-semibold uppercase tracking-[0.18em] text-mint-dark backdrop-blur"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Order #{order.order_number}
          </motion.div>
        </div>
      </section>

      <div className="container-luxe mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        {/* Items + timeline */}
        <div className="flex flex-col gap-6">
          {/* Status timeline */}
          <section className="rounded-4xl bg-white p-6 shadow-luxe-sm sm:p-7">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Order Status
            </h2>
            <div className="mt-5 flex items-center gap-2 sm:gap-4">
              {[
                { Icon: CheckCircle2, label: 'Confirmed', active: true },
                { Icon: Package, label: 'Packed', active: false },
                { Icon: Truck, label: 'Shipped', active: false },
                { Icon: Mail, label: 'Delivered', active: false },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex flex-1 items-center gap-2 sm:gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`grid h-11 w-11 place-items-center rounded-full transition ${
                        step.active
                          ? 'bg-mint-dark text-white shadow-luxe-sm'
                          : 'bg-fog text-ink/40'
                      }`}
                    >
                      <step.Icon size={18} strokeWidth={1.7} />
                    </div>
                    <span className="font-btn text-[10px] uppercase tracking-[0.14em] text-ink/60">
                      {step.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="h-px flex-1 bg-mint/25">
                      <motion.div
                        className="h-full bg-mint-dark"
                        initial={{ width: i === 0 ? '40%' : '0%' }}
                        animate={{ width: i === 0 ? '40%' : '0%' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-2xl bg-mint-light px-4 py-3 font-body text-xs text-mint-dark">
              Estimated delivery:{' '}
              <span className="font-semibold">
                {estimated.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
            </p>
          </section>

          {/* Items */}
          <section className="rounded-4xl bg-white p-6 shadow-luxe-sm sm:p-7">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Items in Your Order
            </h2>
            <ul className="mt-5 flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <img
                    src={item.image ?? ''}
                    alt={item.name}
                    loading="lazy"
                    className="h-20 w-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <p className="font-heading text-base font-semibold text-ink">
                      {item.name}
                    </p>
                    <p className="font-body text-xs text-ink/50">
                      Size {item.size} · Qty {item.quantity}
                    </p>
                    <p className="mt-auto font-body text-sm font-semibold text-mint-dark">
                      GHS {(Number(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-4xl bg-white p-6 shadow-luxe-sm sm:p-7">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Order Details
            </h2>

            <div className="mt-5 space-y-2 font-body text-sm">
              <Row label="Order number" value={order.order_number} />
              <Row label="Date" value={new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} />
              <Row label="Email" value={order.email} />
              <Row label="Payment" value="Confirmed" valueClass="text-mint-dark font-semibold" />
            </div>

            <div className="my-5 h-px bg-mint/15" />

            <div className="rounded-2xl bg-mint-light/50 p-4">
              <p className="font-btn text-[10px] uppercase tracking-[0.18em] text-ink/60">
                Ship to
              </p>
              <p className="mt-2 font-body text-sm font-semibold text-ink">
                {order.full_name}
              </p>
              <p className="font-body text-sm text-ink/70">{order.address}</p>
              <p className="font-body text-sm text-ink/70">
                {order.city}
                {order.region ? `, ${order.region}` : ''}, {order.country}
              </p>
              <p className="mt-1 font-body text-sm text-ink/70">{order.phone}</p>
            </div>

            <div className="my-5 h-px bg-mint/15" />

            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="font-body text-sm text-ink/70">Subtotal</dt>
                <dd className="font-body text-sm font-semibold text-ink">
                  GHS {Number(order.subtotal).toLocaleString()}
                </dd>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-gold">
                  <dt className="font-body text-sm">Discount</dt>
                  <dd className="font-body text-sm font-semibold">
                    − GHS {Number(order.discount).toLocaleString()}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="font-body text-sm text-ink/70">Shipping</dt>
                <dd className="font-body text-sm font-semibold text-ink">
                  {Number(order.shipping) === 0 ? 'FREE' : `GHS ${Number(order.shipping)}`}
                </dd>
              </div>
            </dl>

            <div className="my-5 h-px bg-mint/15" />

            <div className="flex items-baseline justify-between">
              <span className="font-btn text-xs uppercase tracking-[0.18em] text-ink/70">
                Total Paid
              </span>
              <span className="font-heading text-3xl font-bold text-mint-dark">
                GHS {Number(order.total).toLocaleString()}
              </span>
            </div>

            <Link to="/shop" className="btn-primary mt-6 w-full">
              Continue Shopping <ArrowRight size={16} strokeWidth={2.2} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass = '',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-ink/55">{label}</span>
      <span className={`text-right text-ink break-words ${valueClass}`}>{value}</span>
    </div>
  );
}
