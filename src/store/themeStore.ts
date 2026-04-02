import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "dark" | "light"

interface ThemeStore {
    theme: Theme
    toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            theme: "dark",
            toggleTheme: () =>
                set((state) => {
                    const next = state.theme === "dark" ? "light" : "dark"
                    document.documentElement.classList.toggle("dark", next === "dark")
                    return { theme: next }
                }),
        }),
        { name: "novadash-theme" }
    )
)