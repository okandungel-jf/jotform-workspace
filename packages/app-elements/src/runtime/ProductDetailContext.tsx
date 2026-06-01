import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ProductItem } from '../components/ProductList/types';

export interface ProductDetailContextValue {
  /** The product whose detail page is open, or null when closed. */
  product: ProductItem | null;
  /** Open the detail page for a product. */
  open(product: ProductItem): void;
  /** Close the detail page. */
  close(): void;
}

const ProductDetailContext = createContext<ProductDetailContextValue | null>(null);

/**
 * Returns the product-detail controller, or null when no provider is present.
 * The ProductList only becomes click-to-open when a provider wraps it — so the
 * editing canvas (no provider) stays inert while the live preview opens details.
 */
export function useProductDetail() {
  return useContext(ProductDetailContext);
}

interface ProductDetailProviderProps {
  children: ReactNode;
  /** Notified when the detail page opens/closes — lets ancestors react (e.g. hide the bottom nav). */
  onOpenChange?: (open: boolean) => void;
}

export function ProductDetailProvider({ children, onOpenChange }: ProductDetailProviderProps) {
  const [product, setProduct] = useState<ProductItem | null>(null);

  const open = useCallback((next: ProductItem) => setProduct(next), []);
  const close = useCallback(() => setProduct(null), []);

  useEffect(() => {
    onOpenChange?.(product !== null);
  }, [product, onOpenChange]);

  const value = useMemo<ProductDetailContextValue>(
    () => ({ product, open, close }),
    [product, open, close],
  );

  return <ProductDetailContext.Provider value={value}>{children}</ProductDetailContext.Provider>;
}
