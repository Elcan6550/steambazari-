'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: string; // product id
  title: string;
  gameTitle: string;
  price: number;
  discountPrice?: number | null;
  coverImage: string;
  platform: string;
  accountType: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity?: number) => boolean;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sb_cart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('sb_cart', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart', e);
      }
    }
  }, [items, isLoaded]);

  const addItem = (product: any, quantity = 1): boolean => {
    const existingIndex = items.findIndex((i) => i.id === product.id);
    const availableStock = product.stock ?? 10;

    if (availableStock <= 0) {
      alert('Təəssüf ki, bu məhsul üçün anbarda hesab qalmayıb.');
      return false;
    }

    if (existingIndex > -1) {
      const currentQty = items[existingIndex].quantity;
      if (currentQty + quantity > availableStock) {
        alert(`Anbarda yalnız ${availableStock} ədəd mövcuddur.`);
        return false;
      }

      const updated = [...items];
      updated[existingIndex].quantity += quantity;
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          id: product.id,
          title: product.title,
          gameTitle: product.gameTitle,
          price: product.price,
          discountPrice: product.discountPrice,
          coverImage: product.coverImage || '/games/gta5.jpg',
          platform: product.platform,
          accountType: product.accountType,
          quantity: Math.min(quantity, availableStock),
          stock: availableStock,
        },
      ]);
    }
    return true;
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems(
      items.map((i) => {
        if (i.id === id) {
          return { ...i, quantity: Math.min(qty, i.stock || 99) };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
