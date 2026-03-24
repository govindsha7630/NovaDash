import { useAuthStore } from "@/store/authStore"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
    children: React.ReactNode
    requireAuth?: boolean
}

function ProtectedRoute({
    children,
    requireAuth = true
}: ProtectedRouteProps) {

    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

    // Page needs login but user is not logged in
    if (requireAuth && !isLoggedIn) {
        return <Navigate to="/login" replace />
    }

    // Page is for guests only but user is already logged in
    if (!requireAuth && isLoggedIn) {
        return <Navigate to="/dashboard" replace />
    }

    // All good — show the page
    return <>{children}</>
}

export default ProtectedRoute