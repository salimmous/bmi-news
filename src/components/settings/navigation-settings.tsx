import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  AlertCircle,
  Save,
  RefreshCw,
  AlertTriangle,
  Plus,
  Trash2,
  GripVertical,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { getSettings, updateSettings } from "../../lib/api";
import { toast } from "../ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Switch } from "../ui/switch";

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

export default function NavigationSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<NavigationSettings>({
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

  // Load settings from localStorage or use default values
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Try to load settings from localStorage
        const savedSettings = localStorage.getItem("navigationSettings");
        if (savedSettings) {
          try {
            const parsedSettings = JSON.parse(savedSettings);
            setSettings(parsedSettings);
            console.log("Loaded navigation settings from localStorage");
          } catch (e) {
            console.error("Error parsing saved navigation settings:", e);
            // Keep default settings if parsing fails
          }
        } else {
          console.log("No saved navigation settings found, using defaults");
          // Using default settings (already set in state)
        }
      } catch (error) {
        console.error("Error loading navigation settings:", error);
        // Keep default settings and show a less alarming error
        toast({
          title: "Using default navigation settings",
          description: "Could not load saved settings. Using default navigation settings instead.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Save settings to localStorage
      localStorage.setItem("navigationSettings", JSON.stringify(settings));
      
      // Simulate a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Success",
        description: "Navigation settings saved successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving navigation settings:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save navigation settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addNavItem = () => {
    const newItem: NavItem = {
      id: `item-${Date.now()}`,
      label: "New Item",
      url: "/",
      isExternal: false,
      isVisible: true,
      requiresAuth: false,
      roles: [],
    };

    setSettings({
      ...settings,
      items: [...settings.items, newItem],
    });
  };

  const removeNavItem = (id: string) => {
    setSettings({
      ...settings,
      items: settings?.items?.filter(item => item.id !== id) || [],
    });
  };

  const updateNavItem = (id: string, field: keyof NavItem, value: any) => {
    setSettings({
      ...settings,
      items: settings.items.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      }),
    });
  };

  const moveNavItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= settings.items.length) return;

    const newItems = [...settings.items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);

    setSettings({
      ...settings,
      items: newItems,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading navigation settings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Navigation Settings</h2>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Navigation Settings</CardTitle>
          <CardDescription>
            Configure how the navigation menu appears on your site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="showLogo"
              checked={settings.showLogo}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, showLogo: checked })
              }
            />
            <Label htmlFor="showLogo">Show Logo in Navigation</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoAlignment">Logo Alignment</Label>
            <select
              id="logoAlignment"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={settings.logoAlignment}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  logoAlignment: e.target.value,
                })
              }
              disabled={!settings.showLogo}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileMenuType">Mobile Menu Type</Label>
            <select
              id="mobileMenuType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={settings.mobileMenuType}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  mobileMenuType: e.target.value,
                })
              }
            >
              <option value="slide">Slide-in Panel</option>
              <option value="dropdown">Dropdown Menu</option>
              <option value="fullscreen">Fullscreen Overlay</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigation Menu Items</CardTitle>
          <CardDescription>
            Add, remove, and configure navigation menu items
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {settings.items.map((item, index) => (
              <div
                key={item.id}
                className="p-4 border rounded-md bg-background relative"
              >
                <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-50 hover:opacity-100">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="ml-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <Label htmlFor={`item-${item.id}-label`}>Label</Label>
                      <Input
                        id={`item-${item.id}-label`}
                        value={item.label}
                        onChange={(e) =>
                          updateNavItem(item.id, "label", e.target.value)
                        }
                        placeholder="Menu Item Label"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeNavItem(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor={`item-${item.id}-url`} className="flex items-center">
                        <LinkIcon className="h-3.5 w-3.5 mr-1" />
                        URL Path
                      </Label>
                      <Input
                        id={`item-${item.id}-url`}
                        value={item.url}
                        onChange={(e) =>
                          updateNavItem(item.id, "url", e.target.value)
                        }
                        placeholder="/page-path"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`item-${item.id}-visible`}
                          checked={item.isVisible}
                          onCheckedChange={(checked) =>
                            updateNavItem(item.id, "isVisible", checked)
                          }
                        />
                        <Label htmlFor={`item-${item.id}-visible`}>Visible</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`item-${item.id}-external`}
                          checked={item.isExternal}
                          onCheckedChange={(checked) =>
                            updateNavItem(item.id, "isExternal", checked)
                          }
                        />
                        <Label htmlFor={`item-${item.id}-external`} className="flex items-center">
                          External Link
                          <ExternalLink className="h-3.5 w-3.5 ml-1" />
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`item-${item.id}-auth`}
                        checked={item.requiresAuth}
                        onCheckedChange={(checked) =>
                          updateNavItem(item.id, "requiresAuth", checked)
                        }
                      />
                      <Label htmlFor={`item-${item.id}-auth`}>Requires Authentication</Label>
                    </div>

                    {item.requiresAuth && (
                      <div className="space-y-2">
                        <Label htmlFor={`item-${item.id}-roles`}>Required Roles (comma-separated)</Label>
                        <Input
                          id={`item-${item.id}-roles`}
                          value={item.roles.join(", ")}
                          onChange={(e) => {
                            const rolesArray = e.target.value
                              .split(",")
                              .map((role) => role.trim())
                              .filter((role) => role !== "");
                            updateNavItem(item.id, "roles", rolesArray);
                          }}
                          placeholder="admin, editor"
                        />
                        <p className="text-xs text-muted-foreground">
                          Leave empty for all authenticated users
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    {index > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveNavItem(index, index - 1)}
                      >
                        Move Up
                      </Button>
                    )}
                    {index < settings.items.length - 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveNavItem(index, index + 1)}
                        className={index > 0 ? "ml-auto" : ""}
                      >
                        Move Down
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={addNavItem}
            className="w-full mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>

          <div className="p-4 bg-muted/30 rounded-md">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Changes to navigation will be applied after saving and refreshing the page.
                Items can be reordered by using the Move Up/Down buttons.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}