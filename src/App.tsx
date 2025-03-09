import { Suspense, useEffect } from "react";
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
import AdminSettings from "./components/admin/admin-settings";
import UserManagement from "./components/admin/user-management";
import ContentManagement from "./components/admin/content-management";
import ProtectedRoute from "./components/auth/protected-route";
import { AuthProvider } from "./components/auth/auth-context";
import { LanguageProvider } from "./lib/i18n";
import StoryboardFitnessCalculator from "./components/storyboard-fitness-calculator";
import StoryboardSportBMI from "./components/storyboard-sport-bmi";
import StoryboardProBMI from "./components/storyboard-pro-bmi";
import StoryboardUserProfile from "./components/storyboard-user-profile";
import StoryboardSettings from "./components/storyboard-settings";
import StoryboardTranslationManagement from "./components/storyboard-translation-management";
import HealthRecommendations from "./components/health-recommendations";
import AllRecommendations from "./components/all-recommendations";
import DebugTranslations from "./components/debug-translations";
import StoryboardRTLTest from "./components/storyboard-rtl-test";
import routes from "tempo-routes";
import { preloadTranslations } from "./lib/apply-translations";

function App() {
  // Preload translations when the app starts
  useEffect(() => {
    preloadTranslations();
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <DebugTranslations />
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
                <Route
                  path="/fitness-calculator"
                  element={<StoryboardFitnessCalculator />}
                />
                <Route
                  path="/sport-bmi-calculator"
                  element={<StoryboardSportBMI />}
                />
                <Route path="/bmi-calculator" element={<StoryboardProBMI />} />
                <Route
                  path="/user-profile"
                  element={<StoryboardUserProfile />}
                />
                <Route path="/settings" element={<StoryboardSettings />} />
                <Route
                  path="/translations"
                  element={<StoryboardTranslationManagement />}
                />
                <Route path="/rtl-test" element={<StoryboardRTLTest />} />
                <Route
                  path="/health-recommendations"
                  element={<HealthRecommendations />}
                />
                <Route
                  path="/all-recommendations"
                  element={<AllRecommendations />}
                />

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

                {/* Admin routes */}
                <Route path="/admin">
                  <Route
                    index
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="users"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <UserManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="content"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <ContentManagement />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />

                {/* Tempo routes */}
                {import.meta.env.VITE_TEMPO === "true" && (
                  <Route path="/tempobook/*" element={<div />} />
                )}
              </Route>
            </Routes>
          </>
        </Suspense>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
