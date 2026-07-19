import { useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Plus,
  Store,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const nav = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', Icon: Package, end: false },
  { to: '/admin/orders', label: 'Orders', Icon: ShoppingBag, end: false },
];

export default function AdminLayout({ children }: { children?: ReactNode }) {
  const { signOut, user } = useAdmin();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const SidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-6">
        <Link to="/admin" className="font-heading text-xl font-bold text-white">
          ANISHEELS
          <span className="block text-[9px] font-medium uppercase tracking-[0.4em] text-gold">
            Admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6">
        <p className="px-3 pb-3 font-btn text-[10px] uppercase tracking-[0.2em] text-white/40">
          Menu
        </p>
        <ul className="flex flex-col gap-1">
          {nav.map(({ to, label, Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3 py-3 font-btn text-[12px] font-semibold uppercase tracking-[0.14em] transition-all ${
                    isActive
                      ? 'bg-gold text-mint-dark shadow-gold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={17} strokeWidth={1.7} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-6 px-3">
          <Link
            to="/admin/products/new"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-mint px-3 py-3 font-btn text-[11px] font-semibold uppercase tracking-[0.14em] text-mint-dark transition hover:bg-mint-light"
          >
            <Plus size={15} strokeWidth={2} /> Add Product
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gold font-heading text-sm font-bold text-mint-dark">
            {(user?.email ?? 'A')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-body text-xs font-semibold text-white">
              {user?.email ?? 'admin'}
            </p>
            <p className="font-body text-[10px] text-white/50">Administrator</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 font-btn text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={16} strokeWidth={1.7} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-mint-dark lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 bg-mint-dark lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-mint/10 bg-cream/90 px-5 py-4 backdrop-blur sm:px-8">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-mint-dark shadow-soft lg:hidden"
          >
            <Menu size={20} strokeWidth={1.7} />
          </button>
          <h1 className="font-heading text-lg font-semibold text-ink sm:text-xl">
            Dashboard
          </h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-btn text-[11px] font-semibold uppercase tracking-[0.14em] text-mint-dark shadow-soft transition hover:bg-mint-light"
          >
            <Store size={14} strokeWidth={1.7} />
            <span className="hidden sm:inline">View Store</span>
          </Link>
        </header>

        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
