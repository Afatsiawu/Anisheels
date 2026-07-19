import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from '../data/store';
import QuickView from '../components/QuickView';

type QuickViewContextValue = {
  open: (product: Product) => void;
  close: () => void;
};

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);

  const value: QuickViewContextValue = {
    open: (p) => setProduct(p),
    close: () => setProduct(null),
  };

  return (
    <QuickViewContext.Provider value={value}>
      {children}
      <QuickView product={product} onClose={() => setProduct(null)} />
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error('useQuickView must be used within QuickViewProvider');
  return ctx;
}
