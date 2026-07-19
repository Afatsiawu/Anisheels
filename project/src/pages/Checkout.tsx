import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Lock,
  Check,
  Loader2,
  Truck,
  CreditCard,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { validatePromo, type PromoCode } from '../lib/promo';
import { placeOrder, type ShippingInfo } from '../lib/orders';

const countries = ['Ghana', 'Nigeria', 'United Kingdom', 'United States', 'United Arab Emirates', 'Kenya', 'South Africa', 'Other'];

const initialForm: ShippingInfo = {
  email: '',
  fullName: '',
  phone: '',
  address: '',
  city: '',
  region: '',
  country: 'Ghana',
  notes: '',
};

type FormErrors = Partial<Record<keyof ShippingInfo, string>>;

function validate(form: ShippingInfo): FormErrors {
  const errors: FormErrors = {};
  if (!form.email) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email';
  if (!form.fullName) errors.fullName = 'Full name is required';
  if (!form.phone) errors.phone = 'Phone number is required';
  if (!form.address) errors.address = 'Address is required';
  if (!form.city) errors.city = 'City is required';
  if (!form.country) errors.country = 'Country is required';
  return errors;
}

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState<ShippingInfo>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile' | 'cod'>('card');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const discount = promo
    ? promo.type === 'percent'
      ? (subtotal * promo.value) / 100
      : Math.min(promo.value, subtotal)
    : 0;
  const shippingCost = subtotal >= 300 ? 0 : 30;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const applyPromo = () => {
    const found = validatePromo(promoInput);
    if (!found) {
      setPromoError("That code isn't valid.");
      setPromo(null);
      return;
    }
    setPromoError('');
    setPromo(found);
  };

  const update = (field: keyof ShippingInfo, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const foundErrors = validate(form);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) {
      const firstField = document.getElementById(
        Object.keys(foundErrors)[0]
      );
      firstField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      const result = await placeOrder({
        shipping: form,
        items,
        subtotal,
        shippingCost,
        discount,
        total,
        promo,
      });
      clear();
      navigate(`/order/${result.orderNumber}`, {
        state: { email: form.email, total },
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Something went wrong placing your order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="font-heading text-3xl font-bold text-ink">
          Your cart is empty
        </h1>
        <p className="font-body text-sm text-ink/55">
          Add a few pairs before heading to checkout.
        </p>
        <Link to="/shop" className="btn-primary">
          Browse the Collection
        </Link>
      </div>
    );
  }

  const inputClass = (field: keyof ShippingInfo) =>
    `w-full rounded-2xl border bg-cream px-4 py-3 font-body text-sm text-ink outline-none transition focus:border-mint-dark ${
      errors[field] ? 'border-red-400' : 'border-mint/30'
    }`;

  return (
    <div className="bg-cream pb-20 pt-10">
      <section className="bg-mint-light py-12 sm:py-16">
        <div className="container-luxe text-center">
          <motion.p
            className="eyebrow mb-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Almost Yours
          </motion.p>
          <motion.h1
            className="font-heading text-4xl font-bold text-mint-dark sm:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Checkout
          </motion.h1>
          <div className="gold-divider mx-auto mt-6 w-40" />
        </div>
      </section>

      <div className="container-luxe mt-10">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 font-btn text-xs font-semibold uppercase tracking-[0.16em] text-mint-dark transition hover:text-gold"
        >
          <ArrowLeft size={15} /> Back to Cart
        </Link>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]"
        >
          {/* Left: form */}
          <div className="flex flex-col gap-6">
            {/* Contact */}
            <section className="rounded-4xl bg-white p-6 shadow-luxe-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-mint-dark font-btn text-xs font-bold text-white">
                  1
                </span>
                <h2 className="font-heading text-lg font-semibold text-ink">
                  Contact Details
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className={inputClass('email')}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 font-body text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    className={inputClass('fullName')}
                    placeholder="Ama Serwaa"
                  />
                  {errors.fullName && (
                    <p className="mt-1 font-body text-xs text-red-500">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className={inputClass('phone')}
                    placeholder="+233 20 000 0000"
                  />
                  {errors.phone && (
                    <p className="mt-1 font-body text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section className="rounded-4xl bg-white p-6 shadow-luxe-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-mint-dark font-btn text-xs font-bold text-white">
                  2
                </span>
                <h2 className="font-heading text-lg font-semibold text-ink">
                  Shipping Address
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                    Street Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    className={inputClass('address')}
                    placeholder="12 Oxford Street, Osu"
                  />
                  {errors.address && (
                    <p className="mt-1 font-body text-xs text-red-500">{errors.address}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    className={inputClass('city')}
                    placeholder="Accra"
                  />
                  {errors.city && (
                    <p className="mt-1 font-body text-xs text-red-500">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                    Region / State
                  </label>
                  <input
                    id="region"
                    type="text"
                    autoComplete="address-level1"
                    value={form.region}
                    onChange={(e) => update('region', e.target.value)}
                    className={inputClass('region')}
                    placeholder="Greater Accra"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                    Country
                  </label>
                  <div className="relative">
                    <select
                      id="country"
                      value={form.country}
                      onChange={(e) => update('country', e.target.value)}
                      className={`${inputClass('country')} appearance-none pr-10`}
                    >
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/40"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                    Delivery Notes <span className="text-ink/35">(optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => update('notes', e.target.value)}
                    className={`${inputClass('notes')} resize-none`}
                    placeholder="Gate code, landmark, preferred delivery time…"
                  />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-4xl bg-white p-6 shadow-luxe-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-mint-dark font-btn text-xs font-bold text-white">
                  3
                </span>
                <h2 className="font-heading text-lg font-semibold text-ink">
                  Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { id: 'card', label: 'Card', desc: 'Visa · Mastercard', Icon: CreditCard },
                  { id: 'mobile', label: 'Mobile Money', desc: 'MTN · Vodafone', Icon: Phone2Icon },
                  { id: 'cod', label: 'Pay on Delivery', desc: 'Cash at door', Icon: Truck },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as typeof paymentMethod)}
                    className={`flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all ${
                      paymentMethod === m.id
                        ? 'border-mint-dark bg-mint-light shadow-luxe-sm'
                        : 'border-mint/25 bg-cream hover:border-mint'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <m.Icon size={20} className="text-mint-dark" strokeWidth={1.7} />
                      {paymentMethod === m.id && (
                        <Check size={16} className="text-gold" strokeWidth={2.2} />
                      )}
                    </div>
                    <div>
                      <p className="font-btn text-xs font-semibold uppercase tracking-[0.12em] text-ink">
                        {m.label}
                      </p>
                      <p className="font-body text-[11px] text-ink/55">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                      Card Number
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      className={inputClass('notes')}
                      disabled
                    />
                    <p className="mt-1.5 flex items-center gap-1.5 font-body text-[11px] text-ink/45">
                      <Lock size={11} /> Demo checkout — no real card needed.
                    </p>
                  </div>
                </div>
              )}
              {paymentMethod === 'mobile' && (
                <div className="mt-5">
                  <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                    Mobile Money Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Same as phone"
                    className={inputClass('notes')}
                    disabled
                  />
                  <p className="mt-1.5 font-body text-[11px] text-ink/45">
                    You'll receive a payment prompt on confirmation.
                  </p>
                </div>
              )}
              {paymentMethod === 'cod' && (
                <p className="mt-5 rounded-2xl bg-mint-light px-4 py-3 font-body text-xs text-mint-dark">
                  Pay with cash or card when your order arrives. ID may be
                  required for orders above GHS 1,000.
                </p>
              )}
            </section>
          </div>

          {/* Right: summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-4xl bg-white p-6 shadow-luxe-sm sm:p-7">
              <h2 className="font-heading text-xl font-semibold text-ink">
                Order Summary
              </h2>

              {/* Items */}
              <ul className="mt-5 flex flex-col gap-4">
                {items.map((item) => (
                  <li
                    key={`${item.id}-${item.size}`}
                    className="flex gap-3"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-16 w-14 rounded-xl object-cover"
                      />
                      <span className="absolute -right-2 -top-2 grid h-5 min-w-[20px] place-items-center rounded-full bg-mint-dark px-1 font-btn text-[10px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="font-heading text-sm font-semibold text-ink">
                        {item.name}
                      </p>
                      <p className="font-body text-[11px] text-ink/50">
                        Size {item.size}
                      </p>
                      <p className="mt-auto font-body text-xs font-semibold text-mint-dark">
                        GHS {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Promo */}
              <div className="mt-5 border-t border-mint/15 pt-5">
                {promo ? (
                  <div className="flex items-center justify-between rounded-2xl bg-mint-light px-4 py-2.5">
                    <span className="font-btn text-xs font-semibold text-mint-dark">
                      {promo.code} applied
                    </span>
                    <span className="font-body text-xs text-gold">
                      − GHS {discount.toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyPromo())}
                      placeholder="Promo code"
                      className="flex-1 rounded-full border border-mint/30 bg-cream px-4 py-2 font-body text-sm text-ink outline-none transition focus:border-mint-dark"
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="rounded-full bg-mint-dark px-4 py-2 font-btn text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-gold"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="mt-1.5 font-body text-xs text-red-500">{promoError}</p>
                )}
              </div>

              <div className="my-5 h-px bg-mint/15" />

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
                    {shippingCost === 0 ? 'FREE' : `GHS ${shippingCost}`}
                  </dd>
                </div>
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

              {submitError && (
                <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 font-body text-xs text-red-600">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold mt-6 w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Placing Order…
                  </>
                ) : (
                  <>
                    Place Order · GHS {total.toLocaleString()}
                    <ArrowRight size={16} strokeWidth={2.2} />
                  </>
                )}
              </button>

              <p className="mt-4 flex items-center justify-center gap-1.5 font-body text-[11px] text-ink/50">
                <ShieldCheck size={13} className="text-mint-dark" /> Secure,
                encrypted checkout
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

// Tiny inline icon for "Mobile Money" to avoid extra deps
function Phone2Icon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}
