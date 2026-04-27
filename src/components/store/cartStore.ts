import { create } from "zustand";

interface Product {
  id: number;
  name: string;
  finalPrice: number;
  quantity?: number;
  code?: string;
  image?: string;
}

interface CartState {
  cartItems: Product[];

  addToCart: (product: Product) => void;
  removeItem: (id: number) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  getTotal: () => number;

  clearCart: () => void; //NUEVO
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],

addToCart: (product) =>
  set((state) => {
    const exists = state.cartItems.find((p) => p.id === product.id);

    const stock = product.inventories?.[0]?.quantity || 0;

    if (exists) {
      // 🔥 BLOQUEO: no permitir pasar el stock
      if ((exists.quantity || 1) >= stock) {
        return state;
      }

      return {
        cartItems: state.cartItems.map((p) =>
          p.id === product.id
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        ),
      };
    }
    return {
      cartItems: [...state.cartItems, { ...product, quantity: 1 }],
    };
  }),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((p) => p.id !== id),
    })),

increaseQty: (id) =>
  set((state) => ({
    cartItems: state.cartItems.map((p) => {
      if (p.id !== id) return p;

      const stock = p.inventories?.[0]?.quantity || 0;
      // 🔥 BLOQUEO
      if ((p.quantity || 1) >= stock) {
        return p;
      }
      return { ...p, quantity: (p.quantity || 1) + 1 };
    }),
  })),

  decreaseQty: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((p) =>
        p.id === id
          ? { ...p, quantity: Math.max(1, (p.quantity || 1) - 1) }
          : p
      ),
    })),

  getTotal: () => {
    return get().cartItems.reduce((acc, item) => {
      return acc + item.finalPrice * (item.quantity || 1);
    }, 0);
  },

  // LIMPIAR CARRITO
  clearCart: () => set({ cartItems: [] }),
}));