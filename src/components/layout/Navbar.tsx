import { Input } from "@/components/ui/input"
import { BellIcon, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import { ThemeToggle } from "@/components/ui/ThemeToggle"  // ✅ new import

function Navbar() {
    const user = useAuthStore((state) => state.user)

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <nav className="w-full h-16 flex items-center justify-between
                        px-6 border-b border-border bg-background
                        sticky top-0 z-50">

            {/* LEFT — Logo */}
            <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <span className="text-base font-bold text-foreground hidden sm:block">
                        NovaDash
                    </span>
                </Link>
            </div>

            {/* CENTER — Search */}
            <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2
                                   w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search anything..."
                    className="pl-9 pr-24 w-[280px] rounded-full bg-card border-border"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2
                                flex items-center gap-1 pointer-events-none">
                    <kbd className="px-1.5 py-0.5 text-[10px] font-medium
                                    text-muted-foreground bg-muted border border-border rounded">
                        Ctrl
                    </kbd>
                    <kbd className="px-1.5 py-0.5 text-[10px] font-medium
                                    text-muted-foreground bg-muted border border-border rounded">
                        K
                    </kbd>
                </div>
            </div>

            {/* RIGHT — Bell + Theme + Avatar */}
            <div className="flex items-center gap-4">

                {/* Notification Bell */}
                <button className="relative w-9 h-9 flex items-center
                                   justify-center rounded-full hover:bg-muted transition-colors">
                    <BellIcon size={18} className="text-muted-foreground" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2
                                     bg-violet-500 rounded-full" />
                </button>

                {/* ✅ New 3-option theme toggle */}
                <ThemeToggle />

                {/* Avatar + Username */}
                <div className="flex items-center gap-2 cursor-pointer
                                hover:opacity-80 transition-opacity">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src="" alt={user?.name} />
                        <AvatarFallback className="bg-violet-600 text-white text-xs font-bold">
                            {user?.name ? getInitials(user.name) : "??"}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground hidden sm:block">
                        {user?.name
                            ? `Hello, ${user.name.split(" ")[0]}`
                            : "Hello, User"
                        }
                    </span>
                </div>

            </div>
        </nav>
    )
}

export default Navbar