import { useEffect } from "react"
import { useThemeStore } from "@/store/themeStore"

type Props = { children: React.ReactNode }

export const MainThemeWrapper = ({ children }: Props) => {
    const theme = useThemeStore((state) => state.theme)

    useEffect(() => {
        const root = document.documentElement

        if (theme === "dark") {
            root.classList.add("dark")
            return
        }

        if (theme === "light") {
            root.classList.remove("dark")
            return
        }

        // System — read OS preference
        if (theme === "system") {
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches

            if (systemDark) {
                root.classList.add("dark")
            } else {
                root.classList.remove("dark")
            }

            // ✅ Also listen for OS theme changes while app is open
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

            const handleChange = (e: MediaQueryListEvent) => {
                if (e.matches) {
                    root.classList.add("dark")
                } else {
                    root.classList.remove("dark")
                }
            }

            mediaQuery.addEventListener("change", handleChange)
            return () => mediaQuery.removeEventListener("change", handleChange)
        }
    }, [theme])

    return <>{children}</>
}