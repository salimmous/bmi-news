import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
import { Info, Save, Bot, Zap, Key } from "lucide-react";
import { useLanguage } from "../../lib/i18n";
import {
  AIServicesConfig,
  getAIConfig,
  saveAIConfig,
} from "../../lib/api-integrations";

export default function APISettings() {
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [config, setConfig] = useState<AIServicesConfig>(getAIConfig());
  const [activeTab, setActiveTab] = useState<"openai" | "gemini" | "anthropic">(
    "openai",
  );

  // Handle input changes
  const handleInputChange = (
    service: "openai" | "gemini" | "anthropic",
    field: string,
    value: any,
  ) => {
    setConfig({
      ...config,
      [service]: {
        ...config[service],
        [field]: value,
      },
    });
  };

  // Handle default service change
  const handleDefaultServiceChange = (
    value: "openai" | "gemini" | "anthropic",
  ) => {
    setConfig({
      ...config,
      defaultService: value,
    });
  };

  // Test API connection
  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const service = activeTab;
      const serviceConfig = config[service];

      if (!serviceConfig.enabled) {
        setTestResult({
          success: false,
          message: `${service} is not enabled. Please enable it first.`,
        });
        return;
      }

      if (!serviceConfig.apiKey) {
        setTestResult({
          success: false,
          message: `API key for ${service} is required.`,
        });
        return;
      }

      // Make a simple test request
      let endpoint = "";
      let headers: Record<string, string> = {};
      let body: any = {};

      switch (service) {
        case "openai":
          endpoint = "https://api.openai.com/v1/chat/completions";
          headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${serviceConfig.apiKey}`,
          };
          body = {
            model: serviceConfig.model,
            messages: [{ role: "user", content: "Hello" }],
            max_tokens: 5,
          };
          break;

        case "gemini":
          endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${serviceConfig.model}:generateContent?key=${serviceConfig.apiKey}`;
          headers = {
            "Content-Type": "application/json",
          };
          body = {
            contents: [
              {
                parts: [
                  {
                    text: "Hello",
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 5,
            },
          };
          break;

        case "anthropic":
          endpoint = "https://api.anthropic.com/v1/messages";
          headers = {
            "Content-Type": "application/json",
            "x-api-key": serviceConfig.apiKey,
            "anthropic-version": "2023-06-01",
          };
          body = {
            model: serviceConfig.model,
            messages: [
              {
                role: "user",
                content: "Hello",
              },
            ],
            max_tokens: 5,
          };
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setTestResult({
          success: true,
          message: `Successfully connected to ${service}!`,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error?.message || `Failed to connect to ${service}.`,
        });
      }
    } catch (error) {
      console.error(`Error testing ${activeTab} connection:`, error);
      setTestResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Save settings
  const saveSettings = () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      saveAIConfig(config);

      // Save to database via API
      fetch("/api/site-settings.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "api",
          settings: {
            aiServices: config,
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.success) {
            throw new Error(data.message || "Failed to save settings");
          }
          alert("API settings saved successfully!");
        })
        .catch((error) => {
          console.error("Error saving API settings to database:", error);
          // Still consider it a success if saved to localStorage
          alert("API settings saved locally. Database update failed.");
        })
        .finally(() => {
          setIsSaving(false);
        });
    } catch (error) {
      console.error("Error saving API settings:", error);
      alert("Failed to save settings. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.api.title")}</CardTitle>
        <CardDescription>{t("settings.api.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="openai" className="flex items-center">
              <Bot className="mr-2 h-4 w-4" />
              {t("settings.api.openai")}
            </TabsTrigger>
            <TabsTrigger value="gemini" className="flex items-center">
              <Bot className="mr-2 h-4 w-4" />
              {t("settings.api.gemini")}
            </TabsTrigger>
            <TabsTrigger value="anthropic" className="flex items-center">
              <Bot className="mr-2 h-4 w-4" />
              {t("settings.api.claude")}
            </TabsTrigger>
          </TabsList>

          {/* OpenAI Settings */}
          <TabsContent value="openai" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="openai-enabled">
                {t("settings.api.enabled")}
              </Label>
              <Switch
                id="openai-enabled"
                checked={config.openai.enabled}
                onCheckedChange={(checked) =>
                  handleInputChange("openai", "enabled", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Key className="h-4 w-4 mr-2 text-primary" />
                <Label htmlFor="openai-api-key">
                  {t("settings.api.apiKey")}
                </Label>
              </div>
              <Input
                id="openai-api-key"
                type="password"
                value={config.openai.apiKey}
                onChange={(e) =>
                  handleInputChange("openai", "apiKey", e.target.value)
                }
                placeholder="sk-..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="openai-model">{t("settings.api.model")}</Label>
              <Select
                value={config.openai.model}
                onValueChange={(value) =>
                  handleInputChange("openai", "model", value)
                }
              >
                <SelectTrigger id="openai-model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="openai-temperature">
                  {t("settings.api.temperature")}: {config.openai.temperature}
                </Label>
              </div>
              <Slider
                id="openai-temperature"
                min={0}
                max={1}
                step={0.1}
                value={[config.openai.temperature]}
                onValueChange={(value) =>
                  handleInputChange("openai", "temperature", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="openai-max-tokens">
                {t("settings.api.maxTokens")}
              </Label>
              <Input
                id="openai-max-tokens"
                type="number"
                value={config.openai.maxTokens}
                onChange={(e) =>
                  handleInputChange(
                    "openai",
                    "maxTokens",
                    parseInt(e.target.value),
                  )
                }
                min={1}
                max={4000}
              />
            </div>
          </TabsContent>

          {/* Gemini Settings */}
          <TabsContent value="gemini" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="gemini-enabled">
                {t("settings.api.enabled")}
              </Label>
              <Switch
                id="gemini-enabled"
                checked={config.gemini.enabled}
                onCheckedChange={(checked) =>
                  handleInputChange("gemini", "enabled", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Key className="h-4 w-4 mr-2 text-primary" />
                <Label htmlFor="gemini-api-key">
                  {t("settings.api.apiKey")}
                </Label>
              </div>
              <Input
                id="gemini-api-key"
                type="password"
                value={config.gemini.apiKey}
                onChange={(e) =>
                  handleInputChange("gemini", "apiKey", e.target.value)
                }
                placeholder="AIza..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gemini-model">{t("settings.api.model")}</Label>
              <Select
                value={config.gemini.model}
                onValueChange={(value) =>
                  handleInputChange("gemini", "model", value)
                }
              >
                <SelectTrigger id="gemini-model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  <SelectItem value="gemini-pro-vision">
                    Gemini Pro Vision
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="gemini-temperature">
                  {t("settings.api.temperature")}: {config.gemini.temperature}
                </Label>
              </div>
              <Slider
                id="gemini-temperature"
                min={0}
                max={1}
                step={0.1}
                value={[config.gemini.temperature]}
                onValueChange={(value) =>
                  handleInputChange("gemini", "temperature", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gemini-max-tokens">
                {t("settings.api.maxTokens")}
              </Label>
              <Input
                id="gemini-max-tokens"
                type="number"
                value={config.gemini.maxTokens}
                onChange={(e) =>
                  handleInputChange(
                    "gemini",
                    "maxTokens",
                    parseInt(e.target.value),
                  )
                }
                min={1}
                max={4000}
              />
            </div>
          </TabsContent>

          {/* Claude Settings */}
          <TabsContent value="anthropic" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="anthropic-enabled">
                {t("settings.api.enabled")}
              </Label>
              <Switch
                id="anthropic-enabled"
                checked={config.anthropic.enabled}
                onCheckedChange={(checked) =>
                  handleInputChange("anthropic", "enabled", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Key className="h-4 w-4 mr-2 text-primary" />
                <Label htmlFor="anthropic-api-key">
                  {t("settings.api.apiKey")}
                </Label>
              </div>
              <Input
                id="anthropic-api-key"
                type="password"
                value={config.anthropic.apiKey}
                onChange={(e) =>
                  handleInputChange("anthropic", "apiKey", e.target.value)
                }
                placeholder="sk-ant-..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anthropic-model">{t("settings.api.model")}</Label>
              <Select
                value={config.anthropic.model}
                onValueChange={(value) =>
                  handleInputChange("anthropic", "model", value)
                }
              >
                <SelectTrigger id="anthropic-model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-sonnet">
                    Claude 3 Sonnet
                  </SelectItem>
                  <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="anthropic-temperature">
                  {t("settings.api.temperature")}:{" "}
                  {config.anthropic.temperature}
                </Label>
              </div>
              <Slider
                id="anthropic-temperature"
                min={0}
                max={1}
                step={0.1}
                value={[config.anthropic.temperature]}
                onValueChange={(value) =>
                  handleInputChange("anthropic", "temperature", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anthropic-max-tokens">
                {t("settings.api.maxTokens")}
              </Label>
              <Input
                id="anthropic-max-tokens"
                type="number"
                value={config.anthropic.maxTokens}
                onChange={(e) =>
                  handleInputChange(
                    "anthropic",
                    "maxTokens",
                    parseInt(e.target.value),
                  )
                }
                min={1}
                max={4000}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Default Service Selection */}
        <div className="space-y-2 pt-4 border-t">
          <Label htmlFor="default-service">
            {t("settings.api.defaultService")}
          </Label>
          <Select
            value={config.defaultService}
            onValueChange={(value) => handleDefaultServiceChange(value as any)}
          >
            <SelectTrigger id="default-service">
              <SelectValue placeholder="Select default service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">{t("settings.api.openai")}</SelectItem>
              <SelectItem value="gemini">{t("settings.api.gemini")}</SelectItem>
              <SelectItem value="anthropic">
                {t("settings.api.claude")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Test Connection Button */}
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={testConnection}
            disabled={isTesting}
          >
            <Zap className="mr-2 h-4 w-4" />
            {isTesting ? t("common.loading") : t("settings.api.testConnection")}
          </Button>

          {testResult && (
            <div
              className={`mt-2 p-2 rounded text-sm ${testResult.success ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"}`}
            >
              {testResult.message}
            </div>
          )}
        </div>

        <div className="flex items-center p-4 bg-muted/50 rounded-lg">
          <Info className="h-5 w-5 mr-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            API keys are stored securely and used only for generating
            recommendations and responses.
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
