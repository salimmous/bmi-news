import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "user" | "admin";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(isLoggedIn);

    // Check if user has required role
    if (requiredRole) {
      const userRole = localStorage.getItem("userRole");
      setHasRequiredRole(userRole === requiredRole);
    } else {
      setHasRequiredRole(true);
    }

    setIsLoading(false);
  }, [requiredRole]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRequiredRole) {
    // Redirect to dashboard if authenticated but doesn't have required role
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
