import { Monitor, Moon, Sun } from "lucide-react"
import { useThemeStore } from "@/store/themeStore"

type Theme = "light" | "system" | "dark"

// Order matters — this is left to right: Light | System | Dark
const OPTIONS: { value: Theme; icon: React.ReactNode; label: string }[] = [
    {
        value: "light",
        label: "Light",
        icon: <Sun size={14} />,
    },
    {
        value: "system",
        label: "System",
        icon: <Monitor size={14} />,
    },
    {
        value: "dark",
        label: "Dark",
        icon: <Moon size={14} />,
    },
]

export function ThemeToggle() {
    const { theme, setTheme } = useThemeStore()

    // Which index is currently active — used to position the slider
    const activeIndex = OPTIONS.findIndex((o) => o.value === theme)

    return (
        <div
            className="relative flex items-center bg-muted
                       border border-border rounded-full p-1 gap-0.5"
            role="radiogroup"
            aria-label="Theme selector"
        >
            {/* ── Sliding pill background ───────────────────────────────
                Translates based on activeIndex
                Each option is 32px wide (w-8)
                Gap between options is 2px (gap-0.5)
                So each step = 32px + 2px = 34px
            ──────────────────────────────────────────────────────────── */}
            <div
                className="absolute top-1 left-1 h-7 w-8 rounded-full
                           transition-all duration-300 ease-in-out"
                style={{
                    transform: `translateX(${activeIndex * 34}px)`,
                    background:
                        theme === "dark"
                            ? "#7C5CFC"        // violet for dark
                            : theme === "light"
                            ? "#F59E0B"        // amber for light
                            : "#1E2740",       // muted for system
                }}
            />

            {/* ── Option buttons ──────────────────────────────────────── */}
            {OPTIONS.map((option) => {
                const isActive = theme === option.value

                return (
                    <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        aria-label={option.label}
                        title={option.label}
                        role="radio"
                        aria-checked={isActive}
                        className={`
                            relative z-10 w-8 h-7 flex items-center justify-center
                            rounded-full transition-colors duration-200 cursor-pointer
                            ${isActive
                                ? "text-white"
                                : "text-muted-foreground hover:text-foreground"
                            }
                        `}
                    >
                        {option.icon}
                    </button>
                )
            })}
        </div>
    )
}