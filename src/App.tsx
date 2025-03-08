import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import Dashboard from "./components/dashboard";
import ProDashboard from "./components/pro-dashboard";
import About from "./components/about";
import Layout from "./components/layout";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import ForgotPassword from "./components/auth/forgot-password";
import ResetPassword from "./components/auth/reset-password";
import AdminDashboard from "./components/admin/admin-dashboard";
import ProtectedRoute from "./components/auth/protected-route";
import { AuthProvider } from "./components/auth/auth-context";
import routes from "tempo-routes";

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg">Loading...</p>
          </div>
        }
      >
        <>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={<Navigate to="/pro-dashboard" replace />}
              />

              <Route
                path="/pro-dashboard"
                element={
                  <ProtectedRoute>
                    <ProDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" element={<div />} />
            )}
          </Routes>
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
