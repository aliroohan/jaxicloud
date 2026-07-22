"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type InquiryCartItem = {
  id: string;
  name: string;
  slug: string;
  type: "product" | "bundle";
  quantity: number;
  href?: string;
};

type InquiryState = {
  items: InquiryCartItem[];
  addItem: (item: Omit<InquiryCartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string, type: "product" | "bundle") => void;
  updateQuantity: (id: string, type: "product" | "bundle", quantity: number) => void;
  clear: () => void;
  count: () => number;
};

export const useInquiryStore = create<InquiryState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === item.id && i.type === item.type,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.type === item.type
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: item.quantity || 1 },
            ],
          };
        });
      },
      removeItem: (id, type) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.type === type)),
        }));
      },
      updateQuantity: (id, type, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.type === type
              ? { ...i, quantity: Math.max(1, quantity) }
              : i,
          ),
        }));
      },
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "jaxicloud-inquiry" },
  ),
);
