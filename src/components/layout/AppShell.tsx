// src/components/layout/AppShell.tsx
import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar"
import Navbar from "@/components/layout/Navbar"

function AppShell() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col overflow-hidden h-screen">

                {/* Navbar — fixed height, never scrolls */}
                <header className="h-16 flex-shrink-0 border-b border-border
                                   bg-background z-50">
                    <Navbar />
                </header>

                {/* Page content — fills remaining height, NO overflow here */}
                {/* Each page controls its own scroll internally */}
                <main className="p-4 flex-1 min-h-0 overflow-hidden">
                    <Outlet />
                </main>

            </SidebarInset>
        </SidebarProvider>
    )
}

export default AppShell