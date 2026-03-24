import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentUser } from "@/appwrite/auth";
import { useAuthStore } from "@/store/authStore";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";

import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import TodosPage from "@/pages/todos/TodosPage";
import ArticlesPage from "@/pages/articles/ArticlesPage";

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUser(user);
      } else {
        clearUser();
      }
    });
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <ProtectedRoute requireAuth={false}>
            <SignupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <ProtectedRoute requireAuth={false}>
            <ForgotPassword />
          </ProtectedRoute>
        }
      />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute requireAuth={true}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/todos" element={<TodosPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
      </Route>

      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
