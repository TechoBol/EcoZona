import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Store {
  fullName: string;
  role: string;
  level: number;  
  location: any;
  isLoggedIn: boolean;
  token: string;

  setFullName: (fullName: string) => void;
  setRole: (role: string) => void;
  setLevel: (level: number) => void;
  setLocation: (location: any) => void;
  changeLogInState: () => void;
  setToken: (token: string) => void;
}

export const useLoginStore = create<Store>()(
  persist(
    (set, get) => ({
      fullName: '',
      role: '',
      level: 0,
      location: '',
      isLoggedIn: false,
      token: '',
      setFullName: (fullName: string) => set({ fullName: fullName }),
      setRole: (role: string) => set({ role: role }),
      setLevel: (level) => set({ level: Number(level) }),
      setLocation: (location: string) => set({ location: location }),
      changeLogInState: () => set({ isLoggedIn: !get().isLoggedIn }),
      setToken: (token: string) => set({ token: token })
    }),
    {
      name: 'login-storage'
    }
  )
)