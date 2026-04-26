import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import { getCurrentUser } from "@/appwrite/auth"
import { useAuthStore } from "@/store/authStore"

import ProtectedRoute from "@/components/layout/ProtectedRoute"
import AppShell from "@/components/layout/AppShell"

import LoginPage from "@/pages/auth/LoginPage"
import SignupPage from "@/pages/auth/SignupPage"
import ForgotPassword from "@/pages/auth/ForgotPassword"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import TodosPage from "@/pages/todos/TodosPage"
import ArticlesPage from "@/pages/articles/ArticlesPage"
import Pricing from "./pages/pricing/Pricing"
import CreateArticlePage from "./pages/articles/CreateArticlePage"
import TodoDetailPage from "./pages/todos/TodoDetailPage"

function App() {
    const setUser = useAuthStore((state) => state.setUser)
    const clearUser = useAuthStore((state) => state.clearUser)

    useEffect(() => {
        getCurrentUser().then((user) => {
            if (user) setUser(user)
            else clearUser()
        })
    }, [])

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={
                <ProtectedRoute requireAuth={false}><LoginPage /></ProtectedRoute>
            } />
            <Route path="/signup" element={
                <ProtectedRoute requireAuth={false}><SignupPage /></ProtectedRoute>
            } />
            <Route path="/forgot-password" element={
                <ProtectedRoute requireAuth={false}><ForgotPassword /></ProtectedRoute>
            } />

            {/* Protected routes */}
            <Route element={
                <ProtectedRoute requireAuth={true}><AppShell /></ProtectedRoute>
            }>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/todos" element={<TodosPage />} />

                {/* ✅ Static route BEFORE dynamic — or it never matches */}
                {/* ✅ No more /todos/completed or /todos/pending routes */}
                {/* ✅ These are now ?status=completed and ?status=active */}

                <Route path="/todos/:id" element={<TodoDetailPage />} />
                <Route path="/articles" element={<ArticlesPage />} />
                <Route path="/articles/create" element={<CreateArticlePage />} />
                <Route path="/analytics" element={<div>Analytics</div>} />
                <Route path="/profile" element={<div>Profile</div>} />
                <Route path="/settings" element={<div>Settings</div>} />
                <Route path="/pricing" element={<Pricing />} />
            </Route>

            {/* Default redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}

export default App