import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, Sparkles } from 'lucide-react';
import { img } from '../data/store';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail('');
    setTimeout(() => setDone(false), 3500);
  };

  return (
    <section id="contact" className="bg-cream pb-20 sm:pb-28">
      <div className="container-luxe">
        <motion.div
          className="relative overflow-hidden rounded-5xl bg-mint-dark shadow-luxe"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative */}
          <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-mint/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
          <img
            src={img.editorial2}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-full w-1/2 object-cover opacity-20 mix-blend-luminosity"
          />

          <div className="relative z-10 mx-auto max-w-2xl px-6 py-16 text-center sm:px-12 sm:py-20">
            <motion.p
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-btn text-[10px] uppercase tracking-[0.25em] text-gold"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Sparkles size={13} /> Members Get More
            </motion.p>
            <h2 className="font-heading text-4xl font-bold text-white sm:text-5xl">
              Join the <span className="italic text-gradient-gold">ANISHEELS</span>
              <br className="hidden sm:block" /> Community
            </h2>
            <p className="mx-auto mt-5 max-w-md font-body text-sm leading-relaxed text-white/75">
              Be first to access new drops, private sales, and styling notes.
              Enjoy 10% off your first order.
            </p>

            <form
              onSubmit={submit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
                  strokeWidth={1.7}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="w-full rounded-full border-0 bg-white py-4 pl-12 pr-4 font-body text-sm text-ink shadow-luxe-sm outline-none ring-2 ring-transparent transition focus:ring-gold"
                />
              </div>
              <button
                type="submit"
                className="btn-gold flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {done ? (
                  <>
                    <Check size={16} strokeWidth={2.2} /> Subscribed
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
            <p className="mt-4 font-body text-[11px] text-white/50">
              No spam, only elegance. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
