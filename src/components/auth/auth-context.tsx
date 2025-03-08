import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  email: string;
  name?: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      const email = localStorage.getItem("userEmail") || "";
      const role =
        (localStorage.getItem("userRole") as "user" | "admin") || "user";
      const name = localStorage.getItem("userName") || undefined;

      setUser({ email, role, name });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock login logic - in a real app, this would call your auth API
      if (email === "admin@example.com" && password === "admin123") {
        const userData = { email, role: "admin" as const };
        setUser(userData);
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
      } else if (email === "user@example.com" && password === "user123") {
        const userData = { email, role: "user" as const };
        setUser(userData);
        localStorage.setItem("userRole", "user");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
      } else {
        throw new Error("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock registration success
      const userData = { email, name, role: "user" as const };
      setUser(userData);
      localStorage.setItem("userRole", "user");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
