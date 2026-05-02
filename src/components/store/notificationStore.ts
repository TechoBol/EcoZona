import { create } from "zustand";

interface NotificationState {
  hasTransferNotification: boolean;
  setTransferNotification: (value: boolean) => void;
  clearTransferNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  hasTransferNotification: false,
  setTransferNotification: (value) =>
    set({ hasTransferNotification: value }),
  clearTransferNotification: () =>
    set({ hasTransferNotification: false }),
}));