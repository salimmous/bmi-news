import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  AlertCircle,
  Save,
  Upload,
  RefreshCw,
  Globe,
  Palette,
  Layout,
} from "lucide-react";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  footerText: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    darkMode: boolean;
  };
  layout: {
    showHero: boolean;
    showTestimonials: boolean;
    showFeatures: boolean;
    showBlog: boolean;
  };
}

export default function SiteSettingsPanel() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "BMI Tracker",
    siteDescription: "Track your Body Mass Index and improve your health",
    contactEmail: "contact@bmitracker.com",
    footerText: "© 2023 BMI Tracker. All rights reserved.",
    socialLinks: {
      facebook: "https://facebook.com/bmitracker",
      twitter: "https://twitter.com/bmitracker",
      instagram: "https://instagram.com/bmitracker",
      linkedin: "https://linkedin.com/company/bmitracker",
    },
    appearance: {
      primaryColor: "#3b82f6",
      secondaryColor: "#10b981",
      fontFamily: "Inter",
      darkMode: false,
    },
    layout: {
      showHero: true,
      showTestimonials: true,
      showFeatures: true,
      showBlog: false,
    },
  });

  // Load settings from localStorage for demo purposes
  // In a real app, this would come from your backend API
  useEffect(() => {
    const savedSettings = localStorage.getItem("siteSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error parsing saved site settings:", error);
      }
    }
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would be an API call to save the settings
      await new Promise((resolve) => setTimeout(resolve, 1500));
      localStorage.setItem("siteSettings", JSON.stringify(settings));
      alert("Site settings saved successfully");
    } catch (error) {
      console.error("Error saving site settings:", error);
      alert("Failed to save site settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the file to your server or cloud storage
    // For demo purposes, we'll just show an alert
    if (e.target.files && e.target.files[0]) {
      alert(
        `File "${e.target.files[0].name}" would be uploaded in a real implementation`,
      );
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the file to your server or cloud storage
    // For demo purposes, we'll just show an alert
    if (e.target.files && e.target.files[0]) {
      alert(
        `File "${e.target.files[0].name}" would be uploaded in a real implementation`,
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Site Settings</h2>
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Palette className="mr-2 h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center">
            <Layout className="mr-2 h-4 w-4" />
            Layout
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic information about your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                  placeholder="BMI Tracker"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      siteDescription: e.target.value,
                    })
                  }
                  placeholder="Track your Body Mass Index and improve your health"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, contactEmail: e.target.value })
                  }
                  placeholder="contact@bmitracker.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Input
                  id="footerText"
                  value={settings.footerText}
                  onChange={(e) =>
                    setSettings({ ...settings, footerText: e.target.value })
                  }
                  placeholder="© 2023 BMI Tracker. All rights reserved."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Site Logo</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById("logo")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 200x50 pixels
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        document.getElementById("favicon")?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Favicon
                    </Button>
                    <Input
                      id="favicon"
                      type="file"
                      accept="image/x-icon,image/png"
                      className="hidden"
                      onChange={handleFaviconUpload}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 32x32 pixels
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Social Media Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="text-xs">
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      value={settings.socialLinks.facebook}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialLinks: {
                            ...settings.socialLinks,
                            facebook: e.target.value,
                          },
                        })
                      }
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-xs">
                      Twitter
                    </Label>
                    <Input
                      id="twitter"
                      value={settings.socialLinks.twitter}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialLinks: {
                            ...settings.socialLinks,
                            twitter: e.target.value,
                          },
                        })
                      }
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-xs">
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={settings.socialLinks.instagram}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialLinks: {
                            ...settings.socialLinks,
                            instagram: e.target.value,
                          },
                        })
                      }
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-xs">
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={settings.socialLinks.linkedin}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialLinks: {
                            ...settings.socialLinks,
                            linkedin: e.target.value,
                          },
                        })
                      }
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.appearance.primaryColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          appearance: {
                            ...settings.appearance,
                            primaryColor: e.target.value,
                          },
                        })
                      }
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={settings.appearance.primaryColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          appearance: {
                            ...settings.appearance,
                            primaryColor: e.target.value,
                          },
                        })
                      }
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.appearance.secondaryColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          appearance: {
                            ...settings.appearance,
                            secondaryColor: e.target.value,
                          },
                        })
                      }
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={settings.appearance.secondaryColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          appearance: {
                            ...settings.appearance,
                            secondaryColor: e.target.value,
                          },
                        })
                      }
                      placeholder="#10b981"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <select
                  id="fontFamily"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={settings.appearance.fontFamily}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        fontFamily: e.target.value,
                      },
                    })
                  }
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="darkMode"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={settings.appearance.darkMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        darkMode: e.target.checked,
                      },
                    })
                  }
                />
                <Label htmlFor="darkMode">Enable Dark Mode by Default</Label>
              </div>

              <div className="p-4 bg-muted/30 rounded-md">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Changes to appearance settings will be applied after saving
                    and refreshing the page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>
                Configure which sections appear on your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="showHero"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={settings.layout.showHero}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        layout: {
                          ...settings.layout,
                          showHero: e.target.checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="showHero">Show Hero Section</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="showFeatures"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={settings.layout.showFeatures}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        layout: {
                          ...settings.layout,
                          showFeatures: e.target.checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="showFeatures">Show Features Section</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="showTestimonials"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={settings.layout.showTestimonials}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        layout: {
                          ...settings.layout,
                          showTestimonials: e.target.checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="showTestimonials">
                    Show Testimonials Section
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="showBlog"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={settings.layout.showBlog}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        layout: {
                          ...settings.layout,
                          showBlog: e.target.checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="showBlog">Show Blog Section</Label>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-md">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Layout changes will be applied to the homepage and may
                    affect the user experience. Make sure to test your changes
                    after saving.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
