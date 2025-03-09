import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Info, Save, Bot, Zap, Key, Check, AlertCircle } from "lucide-react";
import { useLanguage } from "../../lib/i18n";
import { saveSettings, getSettings, testAPIConnection } from "../../lib/api";

interface AIServiceConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
}

interface AIServicesConfig {
  openai: AIServiceConfig;
  gemini: AIServiceConfig;
  claude: AIServiceConfig;
  defaultService: "openai" | "gemini" | "claude";
}

export default function APIIntegrations() {
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [config, setConfig] = useState<AIServicesConfig>({
    openai: {
      apiKey: "",
      model: "gpt-4-turbo",
      temperature: 0.7,
      maxTokens: 1000,
      enabled: true,
    },
    gemini: {
      apiKey: "",
      model: "gemini-pro",
      temperature: 0.7,
      maxTokens: 1000,
      enabled: false,
    },
    claude: {
      apiKey: "",
      model: "claude-3-opus",
      temperature: 0.7,
      maxTokens: 1000,
      enabled: false,
    },
    defaultService: "openai",
  });
  const [activeTab, setActiveTab] = useState<"openai" | "gemini" | "claude">(
    "openai",
  );

  // Load saved configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Try to load from API
        const response = await getSettings("ai_services");
        if (response.success && response.data) {
          setConfig(response.data);
        } else {
          // Try to load from localStorage
          const savedConfig = localStorage.getItem("aiServicesConfig");
          if (savedConfig) {
            setConfig(JSON.parse(savedConfig));
          }
        }
      } catch (error) {
        console.error("Error loading AI services config:", error);
      }
    };

    loadConfig();
  }, []);

  // Handle input changes
  const handleInputChange = (
    service: "openai" | "gemini" | "claude",
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
    value: "openai" | "gemini" | "claude",
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

      const result = await testAPIConnection(service, serviceConfig.apiKey);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Save settings
  const saveConfig = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage as backup
      localStorage.setItem("aiServicesConfig", JSON.stringify(config));

      // Save to database via API
      const response = await saveSettings("ai_services", config);
      if (!response.success) {
        throw new Error(response.message || "Failed to save settings");
      }

      alert("API settings saved successfully!");
    } catch (error) {
      console.error("Error saving API settings:", error);
      alert("API settings saved locally. Database update may have failed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("settings.api.title", { defaultValue: "API Integrations" })}
        </CardTitle>
        <CardDescription>
          {t("settings.api.subtitle", {
            defaultValue: "Configure external API connections",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="openai" className="flex items-center">
              <Bot className="mr-2 h-4 w-4" />
              {t("settings.api.openai", { defaultValue: "OpenAI (ChatGPT)" })}
            </TabsTrigger>
            <TabsTrigger value="gemini" className="flex items-center">
              <Bot className="mr-2 h-4 w-4" />
              {t("settings.api.gemini", { defaultValue: "Google Gemini" })}
            </TabsTrigger>
            <TabsTrigger value="claude" className="flex items-center">
              <Bot className="mr-2 h-4 w-4" />
              {t("settings.api.claude", { defaultValue: "Anthropic Claude" })}
            </TabsTrigger>
          </TabsList>

          {/* OpenAI Settings */}
          <TabsContent value="openai" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="openai-enabled">
                {t("settings.api.enabled", { defaultValue: "Enabled" })}
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
                  {t("settings.api.apiKey", { defaultValue: "API Key" })}
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
              <Label htmlFor="openai-model">
                {t("settings.api.model", { defaultValue: "Model" })}
              </Label>
              <select
                id="openai-model"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={config.openai.model}
                onChange={(e) =>
                  handleInputChange("openai", "model", e.target.value)
                }
              >
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="openai-temperature">
                {t("settings.api.temperature", { defaultValue: "Temperature" })}
                : {config.openai.temperature}
              </Label>
              <input
                id="openai-temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.openai.temperature}
                onChange={(e) =>
                  handleInputChange(
                    "openai",
                    "temperature",
                    parseFloat(e.target.value),
                  )
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="openai-max-tokens">
                {t("settings.api.maxTokens", { defaultValue: "Max Tokens" })}
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
                min="1"
                max="4000"
              />
            </div>
          </TabsContent>

          {/* Gemini Settings */}
          <TabsContent value="gemini" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="gemini-enabled">
                {t("settings.api.enabled", { defaultValue: "Enabled" })}
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
                  {t("settings.api.apiKey", { defaultValue: "API Key" })}
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
              <Label htmlFor="gemini-model">
                {t("settings.api.model", { defaultValue: "Model" })}
              </Label>
              <select
                id="gemini-model"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={config.gemini.model}
                onChange={(e) =>
                  handleInputChange("gemini", "model", e.target.value)
                }
              >
                <option value="gemini-pro">Gemini Pro</option>
                <option value="gemini-pro-vision">Gemini Pro Vision</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gemini-temperature">
                {t("settings.api.temperature", { defaultValue: "Temperature" })}
                : {config.gemini.temperature}
              </Label>
              <input
                id="gemini-temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.gemini.temperature}
                onChange={(e) =>
                  handleInputChange(
                    "gemini",
                    "temperature",
                    parseFloat(e.target.value),
                  )
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gemini-max-tokens">
                {t("settings.api.maxTokens", { defaultValue: "Max Tokens" })}
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
                min="1"
                max="4000"
              />
            </div>
          </TabsContent>

          {/* Claude Settings */}
          <TabsContent value="claude" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="claude-enabled">
                {t("settings.api.enabled", { defaultValue: "Enabled" })}
              </Label>
              <Switch
                id="claude-enabled"
                checked={config.claude.enabled}
                onCheckedChange={(checked) =>
                  handleInputChange("claude", "enabled", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Key className="h-4 w-4 mr-2 text-primary" />
                <Label htmlFor="claude-api-key">
                  {t("settings.api.apiKey", { defaultValue: "API Key" })}
                </Label>
              </div>
              <Input
                id="claude-api-key"
                type="password"
                value={config.claude.apiKey}
                onChange={(e) =>
                  handleInputChange("claude", "apiKey", e.target.value)
                }
                placeholder="sk-ant-..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="claude-model">
                {t("settings.api.model", { defaultValue: "Model" })}
              </Label>
              <select
                id="claude-model"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={config.claude.model}
                onChange={(e) =>
                  handleInputChange("claude", "model", e.target.value)
                }
              >
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="claude-3-haiku">Claude 3 Haiku</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="claude-temperature">
                {t("settings.api.temperature", { defaultValue: "Temperature" })}
                : {config.claude.temperature}
              </Label>
              <input
                id="claude-temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.claude.temperature}
                onChange={(e) =>
                  handleInputChange(
                    "claude",
                    "temperature",
                    parseFloat(e.target.value),
                  )
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="claude-max-tokens">
                {t("settings.api.maxTokens", { defaultValue: "Max Tokens" })}
              </Label>
              <Input
                id="claude-max-tokens"
                type="number"
                value={config.claude.maxTokens}
                onChange={(e) =>
                  handleInputChange(
                    "claude",
                    "maxTokens",
                    parseInt(e.target.value),
                  )
                }
                min="1"
                max="4000"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Default Service Selection */}
        <div className="space-y-2 pt-4 border-t">
          <Label htmlFor="default-service">
            {t("settings.api.defaultService", {
              defaultValue: "Default AI Service",
            })}
          </Label>
          <select
            id="default-service"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={config.defaultService}
            onChange={(e) => handleDefaultServiceChange(e.target.value as any)}
          >
            <option value="openai">
              {t("settings.api.openai", { defaultValue: "OpenAI (ChatGPT)" })}
            </option>
            <option value="gemini">
              {t("settings.api.gemini", { defaultValue: "Google Gemini" })}
            </option>
            <option value="claude">
              {t("settings.api.claude", { defaultValue: "Anthropic Claude" })}
            </option>
          </select>
        </div>

        {/* Test Connection Button */}
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={testConnection}
            disabled={isTesting}
          >
            <Zap className="mr-2 h-4 w-4" />
            {isTesting
              ? t("common.loading", { defaultValue: "Loading..." })
              : t("settings.api.testConnection", {
                  defaultValue: "Test Connection",
                })}
          </Button>

          {testResult && (
            <div
              className={`mt-2 p-4 rounded text-sm flex items-start ${testResult.success ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"}`}
            >
              {testResult.success ? (
                <Check className="h-5 w-5 mr-2 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        <div className="flex items-center p-4 bg-muted/50 rounded-lg">
          <Info className="h-5 w-5 mr-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t("settings.api.note", {
              defaultValue:
                "API keys are stored securely and used only for generating recommendations and responses.",
            })}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveConfig} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving
            ? t("common.loading", { defaultValue: "Loading..." })
            : t("common.save", { defaultValue: "Save" })}
        </Button>
      </CardFooter>
    </Card>
  );
}
