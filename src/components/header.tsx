import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  Menu,
  User,
  ExternalLink,
  Settings,
  Activity,
  Trash2,
  Globe,
  ChevronDown,
} from "lucide-react";
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
import { useLanguage } from "../lib/i18n";

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
  const { t, language, setLanguage } = useLanguage();
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

  // Language switcher function
  const handleLanguageChange = (lang: "en" | "fr" | "ar") => {
    console.log(`Changing language to: ${lang}`);
    // Set language in context - this will trigger the reload
    setLanguage(lang);
  };

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

          if ("navigationItems" in settings) {
            try {
              const parsedItems = JSON.parse(
                settings.navigationItems as string,
              );
              setNavSettings((prevSettings) => ({
                ...prevSettings,
                items: parsedItems,
                showLogo:
                  "showLogo" in settings
                    ? settings.showLogo === "1"
                    : prevSettings.showLogo,
                logoAlignment:
                  "logoAlignment" in settings
                    ? (settings.logoAlignment as string)
                    : prevSettings.logoAlignment,
                mobileMenuType:
                  "mobileMenuType" in settings
                    ? (settings.mobileMenuType as string)
                    : prevSettings.mobileMenuType,
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
            <Link
              to="/"
              className="text-xl font-bold text-primary flex items-center"
            >
              <Activity className="mr-2 h-5 w-5" />
              {t("header.home", { defaultValue: "BMI Tracker" })}
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
            <SheetContent side="right" className="bg-white text-black">
              <nav className="flex flex-col gap-4 mt-8">
                {/* Language switcher for mobile */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {t("header.language", { defaultValue: "Language" })}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant={language === "en" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleLanguageChange("en")}
                    >
                      EN
                    </Button>
                    <Button
                      variant={language === "fr" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleLanguageChange("fr")}
                    >
                      FR
                    </Button>
                    <Button
                      variant={language === "ar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleLanguageChange("ar")}
                    >
                      AR
                    </Button>
                  </div>
                </div>
                <div className="border-t my-2"></div>
                {navSettings.items
                  .filter((item) => item.isVisible)
                  .filter((item) => !item.requiresAuth || isLoggedIn)
                  .filter(
                    (item) =>
                      item.roles.length === 0 ||
                      (userRole && item.roles.includes(userRole)),
                  )
                  .map((item) =>
                    item.isExternal ? (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-medium flex items-center"
                      >
                        {t(`header.${item.id}`, { defaultValue: item.label })}
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    ) : (
                      <Link
                        key={item.id}
                        to={item.url}
                        className="text-lg font-medium"
                      >
                        {t(`header.${item.id}`, { defaultValue: item.label })}
                      </Link>
                    ),
                  )}
                {isLoggedIn ? (
                  <>
                    <Link to="/user-profile" className="text-lg font-medium">
                      {t("header.profile", { defaultValue: "Profile" })}
                    </Link>
                    <Button variant="outline" onClick={handleLogout}>
                      {t("header.logout", { defaultValue: "Logout" })}
                    </Button>
                  </>
                ) : (
                  <Button asChild>
                    <Link to="/login">
                      {t("header.login", { defaultValue: "Login" })}
                    </Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                {language.toUpperCase()}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleLanguageChange("en")}
                className="cursor-pointer"
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange("fr")}
                className="cursor-pointer"
              >
                Français
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange("ar")}
                className="cursor-pointer"
              >
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {navSettings.items
            .filter((item) => item.isVisible)
            .filter((item) => !item.requiresAuth || isLoggedIn)
            .filter(
              (item) =>
                item.roles.length === 0 ||
                (userRole && item.roles.includes(userRole)),
            )
            .map((item) =>
              item.isExternal ? (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:text-primary flex items-center"
                >
                  {t(`header.${item.id}`, { defaultValue: item.label })}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.url}
                  className="text-sm font-medium hover:text-primary"
                >
                  {t(`header.${item.id}`, { defaultValue: item.label })}
                </Link>
              ),
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
                  <Link to="/user-profile" className="cursor-pointer w-full">
                    {t("header.profile", { defaultValue: "Profile" })}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pro-dashboard" className="cursor-pointer w-full">
                    {t("header.dashboard", { defaultValue: "Dashboard" })}
                  </Link>
                </DropdownMenuItem>
                {userRole === "admin" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer w-full">
                        {t("header.admin", { defaultValue: "Admin Panel" })}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin/settings"
                        className="cursor-pointer w-full"
                      >
                        {t("header.settings", {
                          defaultValue: "Website Settings",
                        })}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/users" className="cursor-pointer w-full">
                        {t("header.userManagement", {
                          defaultValue: "User Management",
                        })}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin/content"
                        className="cursor-pointer w-full"
                      >
                        {t("header.contentManagement", {
                          defaultValue: "Content Management",
                        })}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  {t("header.logout", { defaultValue: "Logout" })}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/login">
                {t("header.login", { defaultValue: "Login" })}
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
