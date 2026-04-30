import { create } from "zustand";

interface InventoryState {
  products: any[];
  setProducts: (products: any[] | ((prev: any[]) => any[])) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  products: [],
  setProducts: (products) =>
    set((state) => ({
      products:
        typeof products === "function"
          ? products(state.products)
          : products,
    })),
}));