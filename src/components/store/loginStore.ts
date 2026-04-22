import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Store {
  fullName: string
  role: string
  regional: string
  isLoggedIn: boolean
  setFullName: (fullName: string) => void
  setRole: (role: string) => void
  setRegional: (regional: string) => void
  changeLogInState: () => void
  token: string
  setToken: (token: string) => void
}

export const useLoginStore = create<Store>()(
  persist(
    (set, get) => ({
      fullName: '',
      role: '',
      regional: '',
      isLoggedIn: false,
      token: '',
      setFullName: (fullName: string) => set({ fullName: fullName }),
      setRole: (role: string) => set({ role: role }),
      setRegional: (regional: string) => set({ regional: regional }),
      changeLogInState: () => set({ isLoggedIn: !get().isLoggedIn }),
      setToken: (token: string) => set({ token: token })
    }),
    {
      name: 'login-storage'
    }
  )
)