import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import { getCurrentUser } from "@/appwrite/auth"
import { useAuthStore } from "@/store/authStore"

import AppShell from "@/components/layout/AppShell"
import ProtectedRoute from "@/components/layout/ProtectedRoute"

import LoginPage from "@/pages/auth/LoginPage"
import SignupPage from "@/pages/auth/SignupPage"
import ForgotPassword from "@/pages/auth/ForgotPassword"

import DashboardPage from "@/pages/dashboard/DashboardPage"
import Pricing from "./pages/pricing/Pricing"

import TodosPage from "@/pages/todos/TodosPage"
import TodoDetailPage from "./pages/todos/TodoDetailPage"

import ArticleListPage from "@/pages/articles/ArticlesPage"
import ArticleFormPage from "./pages/articles/ArticleFormPage"
import ArticleDetailPage from "./pages/articles/ArticleDetailPage"
import Setting from "./pages/settings/Setting"
import Profile from "./pages/profile/Profile"
import Analytics from "./pages/analytics/Analytics"



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

                
                <Route path="/todos/:slugwithid" element={<TodoDetailPage />} />
                <Route path="/articles" element={<ArticleListPage />} />
                <Route path="/articles/create" element={<ArticleFormPage />} />
                <Route path="/articles/edit/:slugwithid" element={<ArticleFormPage />} />
                <Route path="/articles/:slugwithid" element={<ArticleDetailPage />} />
                <Route path="/analytics" element={<Analytics/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/settings" element={<Setting/>} />
                <Route path="/pricing" element={<Pricing />} />
            </Route>

            {/* Default redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}

export default App