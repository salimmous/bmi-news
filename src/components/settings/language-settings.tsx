import { useState } from "react";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Info, Save, Languages } from "lucide-react";
import { useLanguage, Language } from "../../lib/i18n";

export default function LanguageSettings() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [isSaving, setIsSaving] = useState(false);

  // Handle language change
  const handleLanguageChange = (value: Language) => {
    setSelectedLanguage(value);
  };

  // Save language settings
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Save to database via API
      const response = await fetch("/api/site-settings.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "language",
          settings: {
            defaultLanguage: selectedLanguage,
          },
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to save settings");
      }

      // Apply language change
      setLanguage(selectedLanguage);

      alert("Language settings saved successfully!");
    } catch (error) {
      console.error("Error saving language settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.language.title")}</CardTitle>
        <CardDescription>{t("settings.language.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <Languages className="h-4 w-4 mr-2 text-primary" />
            <Label>{t("settings.language.title")}</Label>
          </div>
          <RadioGroup
            value={selectedLanguage}
            onValueChange={(value) => handleLanguageChange(value as Language)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="en" />
              <Label htmlFor="en" className="cursor-pointer">
                {t("settings.language.english")} (English)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fr" id="fr" />
              <Label htmlFor="fr" className="cursor-pointer">
                {t("settings.language.french")} (Français)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ar" id="ar" />
              <Label htmlFor="ar" className="cursor-pointer">
                {t("settings.language.arabic")} (العربية)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center p-4 bg-muted/50 rounded-lg">
          <Info className="h-5 w-5 mr-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t("settings.language.note")}
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
