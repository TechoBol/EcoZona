import { create } from "zustand";

interface PublicInventoryState {
  publicToken: string | null;

  setPublicToken: (token: string) => void;

  clearPublicToken: () => void;
}

export const usePublicInventoryStore =
  create<PublicInventoryState>((set) => ({
    publicToken: null,

    setPublicToken: (token) =>
      set({
        publicToken: token,
      }),

    clearPublicToken: () =>
      set({
        publicToken: null,
      }),
  }));