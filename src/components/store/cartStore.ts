import { create } from "zustand";

interface Product {
  id: number;
  name: string;
  price: number; //CAMBIO IMPORTANTE
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

      if (exists) {
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
      cartItems: state.cartItems.map((p) =>
        p.id === id
          ? { ...p, quantity: (p.quantity || 1) + 1 }
          : p
      ),
    })),

  decreaseQty: (id) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((p) =>
          p.id === id
            ? { ...p, quantity: (p.quantity || 1) - 1 }
            : p
        )
        .filter((p) => (p.quantity || 1) > 0),
    })),

  getTotal: () => {
    return get().cartItems.reduce((acc, item) => {
      return acc + item.price * (item.quantity || 1);
    }, 0);
  },

  // 🔥 LIMPIAR CARRITO
  clearCart: () => set({ cartItems: [] }),
}));