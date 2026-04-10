// src/components/layout/AppShell.tsx
import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar"
import Navbar from "@/components/layout/Navbar"

function AppShell() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* Navbar */}
                <header className="h-16 border-b border-border
                                   bg-background sticky top-0 z-50">
                    <Navbar />
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-6 bg-background">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AppShell