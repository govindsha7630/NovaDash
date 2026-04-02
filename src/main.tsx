import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip"; // ✅ ADD THIS
import "./styles/index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* <TooltipProvider> */}
        {/* <App /> */}
        {/* // wrap your app */}
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
        <Toaster position="top-right" richColors />
      {/* </TooltipProvider> */}
    </BrowserRouter>
  </StrictMode>,
);
