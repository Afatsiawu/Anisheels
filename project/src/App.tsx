import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { QuickViewProvider } from './context/QuickViewContext';
import { AdminProvider } from './context/AdminContext';
import Home from './pages/Home';

const Shop = lazy(() => import('./pages/Shop'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 size={28} className="animate-spin text-mint-dark" />
    </div>
  );
}

function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      <CartDrawer />
      {children}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AdminProvider>
        <CartProvider>
          <QuickViewProvider>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Storefront routes (with navbar + footer) */}
                <Route
                  path="/"
                  element={
                    <StoreShell>
                      <Home />
                    </StoreShell>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <StoreShell>
                      <Suspense fallback={<PageLoader />}>
                        <Shop />
                      </Suspense>
                    </StoreShell>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <StoreShell>
                      <Suspense fallback={<PageLoader />}>
                        <Cart />
                      </Suspense>
                    </StoreShell>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <StoreShell>
                      <Suspense fallback={<PageLoader />}>
                        <Checkout />
                      </Suspense>
                    </StoreShell>
                  }
                />
                <Route
                  path="/order/:orderNumber"
                  element={
                    <StoreShell>
                      <Suspense fallback={<PageLoader />}>
                        <OrderConfirmation />
                      </Suspense>
                    </StoreShell>
                  }
                />

                {/* Admin login (standalone, no shell) */}
                <Route
                  path="/admin/login"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminLogin />
                    </Suspense>
                  }
                />

                {/* Protected admin routes (AdminLayout + sidebar) */}
                <Route path="/admin" element={<ProtectedRoute />}>
                  <Route
                    index
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminDashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="products"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminProducts />
                      </Suspense>
                    }
                  />
                  <Route
                    path="products/new"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <ProductForm mode="create" />
                      </Suspense>
                    }
                  />
                  <Route
                    path="products/:id/edit"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <ProductForm mode="edit" />
                      </Suspense>
                    }
                  />
                  <Route
                    path="orders"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminOrders />
                      </Suspense>
                    }
                  />
                </Route>

                <Route path="*" element={<StoreShell><Home /></StoreShell>} />
              </Routes>
            </AnimatePresence>
          </QuickViewProvider>
        </CartProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}

export default App;
