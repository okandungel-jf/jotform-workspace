import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface FavoriteItem {
  name: string;
  price: string;
  image?: string;
}

export interface FavoritesContextValue {
  items: FavoriteItem[];
  count: number;
  toggle(item: FavoriteItem): void;
  has(name: string): boolean;
  clear(): void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function useFavorites() {
  return useContext(FavoritesContext);
}

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  const toggle = useCallback((item: FavoriteItem) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.name === item.name);
      return exists ? prev.filter((p) => p.name !== item.name) : [...prev, item];
    });
  }, []);

  const has = useCallback((name: string) => items.some((p) => p.name === name), [items]);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<FavoritesContextValue>(
    () => ({ items, count: items.length, toggle, has, clear }),
    [items, toggle, has, clear],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
