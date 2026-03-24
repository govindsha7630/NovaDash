import { Outlet } from "react-router-dom"

function AppShell() {
    return (
        <div className="flex h-screen bg-background">

            {/* Sidebar — we build this later */}
            <aside className="w-60 bg-sidebar border-r border-border">
                <p className="p-4 text-muted-foreground">Sidebar</p>
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Navbar — we build this later */}
                <header className="h-16 border-b border-border flex items-center px-6">
                    <p className="text-muted-foreground">Navbar</p>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    )
}

export default AppShell