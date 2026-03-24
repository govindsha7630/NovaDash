import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"

// Step 1 — Define what the store contains
interface AuthStore {
    // DATA
    user: User | null
    isLoggedIn: boolean

    // ACTIONS
    setUser: (user: User) => void
    clearUser: () => void
}

// Step 2 — Create the store
export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            // Starting values
            user: null,
            isLoggedIn: false,

            // Actions
            setUser: (user) => set({
                user: user,
                isLoggedIn: true
            }),

            clearUser: () => set({
                user: null,
                isLoggedIn: false
            }),
        }),
        {
            name: "novadash-auth", // localStorage key
        }
    )
)