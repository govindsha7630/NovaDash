import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { CreateTaskModal } from "@/components/CreateTaskModal"  // ✅ ADD
import "./styles/index.css"
import App from "./App"

const queryClient = new QueryClient()
document.documentElement.classList.add("dark")

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <App />
                    <CreateTaskModal />   {/* ✅ Global — outside all layouts */}
                    <Toaster position="top-right" richColors />
                </TooltipProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
)