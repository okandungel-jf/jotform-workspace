import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface CartItem {
  name: string;
  price: string;
  image?: string;
}

export interface CartContextValue {
  items: CartItem[];
  count: number;
  add(item: CartItem): void;
  remove(name: string): void;
  has(name: string): boolean;
  clear(): void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  return useContext(CartContext);
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => (prev.some((p) => p.name === item.name) ? prev : [...prev, item]));
  }, []);

  const remove = useCallback((name: string) => {
    setItems((prev) => prev.filter((p) => p.name !== name));
  }, []);

  const has = useCallback((name: string) => items.some((p) => p.name === name), [items]);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({ items, count: items.length, add, remove, has, clear }),
    [items, add, remove, has, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
