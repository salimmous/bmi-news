import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, User, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { getSettings } from "../lib/api";

interface NavItem {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  isVisible: boolean;
  requiresAuth: boolean;
  roles: string[];
}

interface NavigationSettings {
  items: NavItem[];
  showLogo: boolean;
  logoAlignment: string;
  mobileMenuType: string;
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [navSettings, setNavSettings] = useState<NavigationSettings>({
    items: [
      {
        id: "home",
        label: "Home",
        url: "/",
        isExternal: false,
        isVisible: true,
        requiresAuth: false,
        roles: [],
      },
      {
        id: "about",
        label: "About",
        url: "/about",
        isExternal: false,
        isVisible: true,
        requiresAuth: false,
        roles: [],
      },
      {
        id: "dashboard",
        label: "Dashboard",
        url: "/pro-dashboard",
        isExternal: false,
        isVisible: true,
        requiresAuth: true,
        roles: [],
      },
      {
        id: "admin",
        label: "Admin Panel",
        url: "/admin",
        isExternal: false,
        isVisible: true,
        requiresAuth: true,
        roles: ["admin"],
      },
    ],
    showLogo: true,
    logoAlignment: "left",
    mobileMenuType: "slide",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    setIsLoggedIn(loggedIn);
    setUserRole(role);
    setUserEmail(email);
    
    // Load navigation settings
    const fetchNavSettings = async () => {
      try {
        const response = await getSettings("navigation");
        if (response.success && response.data) {
          const settings = response.data;
          
          if ('navigationItems' in settings) {
            try {
              const parsedItems = JSON.parse(settings.navigationItems as string);
              setNavSettings(prevSettings => ({
                ...prevSettings,
                items: parsedItems,
                showLogo: 'showLogo' in settings ? settings.showLogo === "1" : prevSettings.showLogo,
                logoAlignment: 'logoAlignment' in settings ? settings.logoAlignment as string : prevSettings.logoAlignment,
                mobileMenuType: 'mobileMenuType' in settings ? settings.mobileMenuType as string : prevSettings.mobileMenuType,
              }));
            } catch (e) {
              console.error("Error parsing navigation items:", e);
              // Keep default settings if parsing fails
            }
          }
        } else {
          console.warn("Using default navigation settings");
          // Keep default settings
        }
      } catch (error) {
        console.error("Error fetching navigation settings:", error);
        // Keep default settings
      }
    };

    fetchNavSettings();
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
          {navSettings.showLogo && (
            <Link to="/" className="text-xl font-bold text-primary">
              BMI Tracker
            </Link>
          )}  
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
                {navSettings.items
                  .filter(item => item.isVisible)
                  .filter(item => !item.requiresAuth || isLoggedIn)
                  .filter(item => item.roles.length === 0 || (userRole && item.roles.includes(userRole)))
                  .map(item => (
                    item.isExternal ? (
                      <a 
                        key={item.id} 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-lg font-medium flex items-center"
                      >
                        {item.label}
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    ) : (
                      <Link 
                        key={item.id} 
                        to={item.url} 
                        className="text-lg font-medium"
                      >
                        {item.label}
                      </Link>
                    )
                  ))
                }
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
          {navSettings.items
            .filter(item => item.isVisible)
            .filter(item => !item.requiresAuth || isLoggedIn)
            .filter(item => item.roles.length === 0 || (userRole && item.roles.includes(userRole)))
            .map(item => (
              item.isExternal ? (
                <a 
                  key={item.id} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:text-primary flex items-center"
                >
                  {item.label}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              ) : (
                <Link 
                  key={item.id} 
                  to={item.url} 
                  className="text-sm font-medium hover:text-primary"
                >
                  {item.label}
                </Link>
              )
            ))
          }
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
