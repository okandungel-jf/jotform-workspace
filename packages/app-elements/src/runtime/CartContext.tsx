import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface CartItem {
  name: string;
  price: string;
  image?: string;
  quantity: number;
}

export interface CartContextValue {
  items: CartItem[];
  count: number;
  add(item: Omit<CartItem, 'quantity'>): void;
  remove(name: string): void;
  setQuantity(name: string, quantity: number): void;
  increment(name: string): void;
  decrement(name: string): void;
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

  const add = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => (prev.some((p) => p.name === item.name) ? prev : [...prev, { ...item, quantity: 1 }]));
  }, []);

  const remove = useCallback((name: string) => {
    setItems((prev) => prev.filter((p) => p.name !== name));
  }, []);

  const setQuantity = useCallback((name: string, quantity: number) => {
    const clamped = Math.max(1, Math.floor(quantity));
    setItems((prev) => prev.map((p) => (p.name === name ? { ...p, quantity: clamped } : p)));
  }, []);

  const increment = useCallback((name: string) => {
    setItems((prev) => prev.map((p) => (p.name === name ? { ...p, quantity: p.quantity + 1 } : p)));
  }, []);

  const decrement = useCallback((name: string) => {
    setItems((prev) => prev.map((p) => (p.name === name ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p)));
  }, []);

  const has = useCallback((name: string) => items.some((p) => p.name === name), [items]);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({ items, count, add, remove, setQuantity, increment, decrement, has, clear }),
    [items, count, add, remove, setQuantity, increment, decrement, has, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
