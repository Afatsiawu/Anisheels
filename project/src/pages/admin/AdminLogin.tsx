import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { img } from '../../data/store';

type LocationState = { from?: { pathname: string } };

export default function AdminLogin() {
  const { signIn, session } = useAdmin();
  const location = useLocation();
  const from = (location.state as LocationState)?.from ?? '/admin';

  const [email, setEmail] = useState('admin@anisheels.com');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (session) return <Navigate to={from} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message.includes('Invalid login')
            ? 'Invalid email or password.'
            : err.message
          : 'Sign-in failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={img.heroMain}
          alt="ANISHEELS editorial"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mint-dark/90 via-mint-dark/40 to-mint-dark/60" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="font-heading text-2xl font-bold text-white">
            ANISHEELS
            <span className="block text-[9px] font-medium uppercase tracking-[0.45em] text-gold">
              Collection
            </span>
          </Link>
          <div>
            <p className="font-btn text-xs uppercase tracking-[0.3em] text-gold">
              Admin Console
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-white">
              Manage your boutique
            </h1>
            <p className="mt-3 max-w-sm font-body text-sm text-white/75">
              Add products, track orders, and keep your storefront in perfect
              step.
            </p>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-cream px-6 py-12 sm:px-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-btn text-[11px] uppercase tracking-[0.16em] text-ink/50 transition hover:text-mint-dark"
          >
            <ArrowLeft size={14} /> Back to store
          </Link>

          <div className="mt-8">
            <h2 className="font-heading text-3xl font-bold text-ink">
              Welcome back
            </h2>
            <p className="mt-2 font-body text-sm text-ink/55">
              Sign in to the ANISHEELS admin dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
                  strokeWidth={1.7}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-mint/30 bg-white py-3.5 pl-11 pr-4 font-body text-sm text-ink outline-none transition focus:border-mint-dark"
                  placeholder="admin@anisheels.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
                  strokeWidth={1.7}
                />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-mint/30 bg-white py-3.5 pl-11 pr-11 font-body text-sm text-ink outline-none transition focus:border-mint-dark"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink/40 transition hover:bg-fog hover:text-ink"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 font-body text-xs text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} strokeWidth={2.2} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-mint-light/60 px-4 py-3">
            <p className="font-btn text-[10px] uppercase tracking-[0.16em] text-mint-dark">
              Demo credentials
            </p>
            <p className="mt-1 font-body text-xs text-mint-dark/80">
              admin@anisheels.com · anisheels2026
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
