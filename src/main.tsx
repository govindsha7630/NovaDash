import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import './styles/index.css'
import App from './App'

// Set dark mode as default
document.documentElement.classList.add('dark')

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
            <Toaster position="top-right" richColors />
        </BrowserRouter>
    </StrictMode>
)