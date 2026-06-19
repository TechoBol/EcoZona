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
  addToCartWithQuantity: (product: Product, quantity: number) => void;
  removeItem: (id: number) => void;
  increaseQty: (id: number) => boolean;
  decreaseQty: (id: number) => void;
  getTotal: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],

  addToCart: (product) =>
    set((state) => {
      const exists = state.cartItems.find((p) => p.id === product.id);

      const stock = product.inventories?.[0]?.quantity ?? product.stock ?? Infinity;

      if (exists) {
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

  increaseQty: (id) => {
    let blocked = false;

    set((state) => ({
      cartItems: state.cartItems.map((p) => {
        if (p.id !== id) return p;

        const stock = p.inventories?.[0]?.quantity ?? p.stock ?? Infinity;

        if ((p.quantity || 1) >= stock) {
          blocked = true;
          return p;
        }
        return { ...p, quantity: (p.quantity || 1) + 1 };
      }),
    }));

    return blocked;
  },

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

  addToCartWithQuantity: (product, quantity) =>
    set((state) => {
      const exists = state.cartItems.find((p) => p.id === product.id);

      if (exists) {
        const stock = product.inventories?.[0]?.quantity ?? product.stock ?? Infinity;
        const newQty = Math.min((exists.quantity || 1) + quantity, stock);
        return {
          cartItems: state.cartItems.map((p) =>
            p.id === product.id ? { ...p, quantity: newQty } : p
          ),
        };
      }

      return {
        cartItems: [
          ...state.cartItems,
          { ...product, quantity },
        ],
      };
    }),

  // LIMPIAR CARRITO
  clearCart: () => set({ cartItems: [] }),
}));