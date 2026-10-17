"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  productName: string;
  productSlug: string;
  productPrice: number; // 0 if price unknown
  productImageUrl: string | null;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, qty = 1) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + qty }
                : i,
            ),
          }));
        } else {
          set((s) => ({
            items: [...s.items, { ...item, quantity: qty }],
          }));
        }
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set((s) => ({
            items: s.items.filter((i) => i.productId !== productId),
          }));
          return;
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        }));
      },
      removeItem: (productId) => {
        set((s) => ({
          items: s.items.filter((i) => i.productId !== productId),
        }));
      },
      clear: () => set({ items: [] }),
      getTotalItems: () =>
        get().items.reduce((total, i) => total + i.quantity, 0),
      getTotalAmount: () =>
        get().items.reduce(
          (total, i) => total + i.productPrice * i.quantity,
          0,
        ),
    }),
    {
      name: "dapurayam-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
