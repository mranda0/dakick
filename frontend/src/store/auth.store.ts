import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "CUSTOMER"
}

interface AuthState {
  user: User | null
  accessToken: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => {
        localStorage.setItem("accessToken", accessToken)
        set({ user, accessToken })
      },
      clearAuth: () => {
        localStorage.removeItem("accessToken")
        set({ user: null, accessToken: null })
      },
      isAdmin: () => get().user?.role === "ADMIN",
    }),
    {
      name: "dakick-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
)