import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Store {
  fullName: string
  role: string
  location: string
  isLoggedIn: boolean
  setFullName: (fullName: string) => void
  setRole: (role: string) => void
  setLocation: (regional: string) => void
  changeLogInState: () => void
  token: string
  setToken: (token: string) => void
}

export const useLoginStore = create<Store>()(
  persist(
    (set, get) => ({
      fullName: '',
      role: '',
      location: '',
      isLoggedIn: false,
      token: '',
      setFullName: (fullName: string) => set({ fullName: fullName }),
      setRole: (role: string) => set({ role: role }),
      setLocation: (location: string) => set({ location: location }),
      changeLogInState: () => set({ isLoggedIn: !get().isLoggedIn }),
      setToken: (token: string) => set({ token: token })
    }),
    {
      name: 'login-storage'
    }
  )
)