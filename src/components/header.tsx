import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    setIsLoggedIn(loggedIn);
    setUserRole(role);
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    setIsLoggedIn(false);
    setUserRole(null);
    setUserEmail(null);

    navigate("/");
  };

  const getInitials = (email: string) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-primary">
            BMI Tracker
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-medium">
                  Home
                </Link>
                <Link to="/about" className="text-lg font-medium">
                  About
                </Link>
                {isLoggedIn && (
                  <>
                    <Link to="/pro-dashboard" className="text-lg font-medium">
                      Dashboard
                    </Link>
                  </>
                )}
                {isLoggedIn && userRole === "admin" && (
                  <Link to="/admin" className="text-lg font-medium">
                    Admin Panel
                  </Link>
                )}
                {isLoggedIn ? (
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          {isLoggedIn && (
            <>
              <Link
                to="/pro-dashboard"
                className="text-sm font-medium hover:text-primary"
              >
                Dashboard
              </Link>
            </>
          )}
          {isLoggedIn && userRole === "admin" && (
            <Link
              to="/admin"
              className="text-sm font-medium hover:text-primary"
            >
              Admin Panel
            </Link>
          )}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {userEmail ? getInitials(userEmail) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/pro-dashboard" className="cursor-pointer w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {userRole === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer w-full">
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
