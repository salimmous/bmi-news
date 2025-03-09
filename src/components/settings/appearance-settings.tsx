import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Info, Save, Palette, Type } from "lucide-react";
import { useTheme } from "../ui/theme-provider";
import { useLanguage } from "../../lib/i18n";

interface AppearanceSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  enableDarkMode: boolean;
}

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<AppearanceSettings>({
    primaryColor: "#7c3aed", // Default purple
    secondaryColor: "#10b981", // Default green
    fontFamily: "Inter",
    enableDarkMode: theme === "dark",
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("appearanceSettings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (e) {
        console.error("Error parsing appearance settings:", e);
      }
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = (checked: boolean) => {
    setSettings({
      ...settings,
      enableDarkMode: checked,
    });
    setTheme(checked ? "dark" : "light");

    // Update DOM classes
    if (checked) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  };

  // Save settings
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem("appearanceSettings", JSON.stringify(settings));

      // Apply CSS variables for colors
      document.documentElement.style.setProperty(
        "--primary-color",
        settings.primaryColor,
      );
      document.documentElement.style.setProperty(
        "--secondary-color",
        settings.secondaryColor,
      );

      // Apply font family
      document.documentElement.style.setProperty(
        "--font-family",
        settings.fontFamily,
      );

      // Save to database via API
      const response = await fetch("/api/site-settings.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "appearance",
          settings: {
            primaryColor: settings.primaryColor,
            secondaryColor: settings.secondaryColor,
            fontFamily: settings.fontFamily,
            enableDarkMode: settings.enableDarkMode,
          },
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to save settings");
      }

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving appearance settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.appearance.title")}</CardTitle>
        <CardDescription>{t("settings.appearance.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Color */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Palette className="h-4 w-4 mr-2 text-primary" />
                <Label htmlFor="primaryColor">
                  {t("settings.appearance.primaryColor")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: settings.primaryColor }}
                ></div>
                <Input
                  id="primaryColor"
                  name="primaryColor"
                  type="text"
                  value={settings.primaryColor}
                  onChange={handleInputChange}
                  className="w-32"
                />
                <Input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, primaryColor: e.target.value })
                  }
                  className="w-12 h-10 p-1"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Palette className="h-4 w-4 mr-2 text-primary" />
                <Label htmlFor="secondaryColor">
                  {t("settings.appearance.secondaryColor")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: settings.secondaryColor }}
                ></div>
                <Input
                  id="secondaryColor"
                  name="secondaryColor"
                  type="text"
                  value={settings.secondaryColor}
                  onChange={handleInputChange}
                  className="w-32"
                />
                <Input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, secondaryColor: e.target.value })
                  }
                  className="w-12 h-10 p-1"
                />
              </div>
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Type className="h-4 w-4 mr-2 text-primary" />
              <Label htmlFor="fontFamily">
                {t("settings.appearance.fontFamily")}
              </Label>
            </div>
            <Select
              value={settings.fontFamily}
              onValueChange={(value) => handleSelectChange("fontFamily", value)}
            >
              <SelectTrigger id="fontFamily" className="w-full">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Open Sans">Open Sans</SelectItem>
                <SelectItem value="Montserrat">Montserrat</SelectItem>
                <SelectItem value="Poppins">Poppins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="darkMode">
                {t("settings.appearance.enableDarkMode")}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("header.darkMode")}
              </p>
            </div>
            <Switch
              id="darkMode"
              checked={settings.enableDarkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
        </div>

        <div className="flex items-center p-4 bg-muted/50 rounded-lg">
          <Info className="h-5 w-5 mr-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t("settings.appearance.note")}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveSettings} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? t("common.loading") : t("common.save")}
        </Button>
      </CardFooter>
    </Card>
  );
}
