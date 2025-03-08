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
import { Alert, AlertDescription } from "../ui/alert";
import {
  Copy,
  Save,
  RefreshCw,
  Link2,
  Webhook,
  Code,
  Activity,
} from "lucide-react";

interface ApiConfig {
  googleFit: {
    clientId: string;
    clientSecret: string;
    enabled: boolean;
  };
  fitbit: {
    clientId: string;
    clientSecret: string;
    enabled: boolean;
  };
  appleHealth: {
    teamId: string;
    keyId: string;
    enabled: boolean;
  };
  webhooks: {
    userCreated: string;
    bmiRecorded: string;
    goalAchieved: string;
  };
  apiKeys: {
    key: string;
    secret: string;
  };
}

export default function ApiManagement() {
  const [activeTab, setActiveTab] = useState("fitness");
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    googleFit: {
      clientId: "",
      clientSecret: "",
      enabled: false,
    },
    fitbit: {
      clientId: "",
      clientSecret: "",
      enabled: false,
    },
    appleHealth: {
      teamId: "",
      keyId: "",
      enabled: false,
    },
    webhooks: {
      userCreated: "",
      bmiRecorded: "",
      goalAchieved: "",
    },
    apiKeys: {
      key: "bmi_pk_" + Math.random().toString(36).substring(2, 15),
      secret: "bmi_sk_" + Math.random().toString(36).substring(2, 15),
    },
  });

  // Load API config from localStorage for demo purposes
  // In a real app, this would come from your backend API
  useEffect(() => {
    const savedConfig = localStorage.getItem("apiConfig");
    if (savedConfig) {
      try {
        setApiConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error("Error parsing saved API config:", error);
      }
    }
  }, []);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would be an API call to save the config
      await new Promise((resolve) => setTimeout(resolve, 1500));
      localStorage.setItem("apiConfig", JSON.stringify(apiConfig));
      alert("API configuration saved successfully");
    } catch (error) {
      console.error("Error saving API config:", error);
      alert("Failed to save API configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateNewApiKey = async () => {
    setIsGeneratingKey(true);
    try {
      // In a real app, this would be an API call to generate new keys
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newApiKeys = {
        key: "bmi_pk_" + Math.random().toString(36).substring(2, 15),
        secret: "bmi_sk_" + Math.random().toString(36).substring(2, 15),
      };

      setApiConfig({
        ...apiConfig,
        apiKeys: newApiKeys,
      });

      localStorage.setItem(
        "apiConfig",
        JSON.stringify({
          ...apiConfig,
          apiKeys: newApiKeys,
        }),
      );

      alert("New API keys generated successfully");
    } catch (error) {
      console.error("Error generating new API keys:", error);
      alert("Failed to generate new API keys");
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">API & Integrations</h2>
        <Button onClick={handleSaveConfig} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fitness" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Fitness APIs
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center">
            <Webhook className="mr-2 h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="rest" className="flex items-center">
            <Code className="mr-2 h-4 w-4" />
            REST API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fitness" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Google Fit Integration</CardTitle>
              <CardDescription>
                Connect with Google Fit to import user fitness data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <input
                  id="googleFitEnabled"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={apiConfig.googleFit.enabled}
                  onChange={(e) =>
                    setApiConfig({
                      ...apiConfig,
                      googleFit: {
                        ...apiConfig.googleFit,
                        enabled: e.target.checked,
                      },
                    })
                  }
                />
                <Label htmlFor="googleFitEnabled">
                  Enable Google Fit Integration
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleFitClientId">Client ID</Label>
                <Input
                  id="googleFitClientId"
                  value={apiConfig.googleFit.clientId}
                  onChange={(e) =>
                    setApiConfig({
                      ...apiConfig,
                      googleFit: {
                        ...apiConfig.googleFit,
                        clientId: e.target.value,
                      },
                    })
                  }
                  placeholder="Your Google Fit Client ID"
                  disabled={!apiConfig.googleFit.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleFitClientSecret">Client Secret</Label>
                <Input
                  id="googleFitClientSecret"
                  type="password"
                  value={apiConfig.googleFit.clientSecret}
                  onChange={(e) =>
                    setApiConfig({
                      ...apiConfig,
                      googleFit: {
                        ...apiConfig.googleFit,
                        clientSecret: e.target.value,
                      },
                    })
                  }
                  placeholder="Your Google Fit Client Secret"
                  disabled={!apiConfig.googleFit.enabled}
                />
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  Redirect URI:{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    https://yourdomain.com/api/auth/google-fit/callback
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fitbit Integration</CardTitle>
              <CardDescription>
                Connect with Fitbit to import user fitness data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <input
                  id="fitbitEnabled"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={apiConfig.fitbit.enabled}
                  onChange={(e) =>
                    setApiConfig({
                      ...apiConfig,
                      fitbit: {
                        ...apiConfig.fitbit,
                        enabled: e.target.checked,
                      },
                    })
                  }
                />
                <Label htmlFor="fitbitEnabled">Enable Fitbit Integration</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitbitClientId">Client ID</Label>
                <Input
                  id="fitbitClientId"
                  value={apiConfig.fitbit.clientId}
                  onChange={(e) =>
                    setApiConfig({
                      ...apiConfig,
                      fitbit: { ...apiConfig.fitbit, clientId: e.target.value },
                    })
                  }
                  placeholder="Your Fitbit Client ID"
                  disabled={!apiConfig.fitbit.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitbitClientSecret">Client Secret</Label>
                <Input
                  id="fitbitClientSecret"
                  type="password"
                  value={apiConfig.fitbit.clientSecret}
                  onChange={(e) =>
                    setApiConfig({
                      ...apiConfig,
                      fitbit: {
                        ...apiConfig.fitbit,
                        clientSecret: e.target.value,
                      },
                    })
                  }
                  placeholder="Your Fitbit Client Secret"
                  disabled={!apiConfig.fitbit.enabled}
                />
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  Redirect URI:{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    https://yourdomain.com/api/auth/fitbit/callback
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Apple Health Integration</CardTitle>
              <CardDescription>
                Connect with Apple Health to import user fitness data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <input
                  id="appleHealthEnabled"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={apiConfig.appleHealth.enabled}
                  onChange={(e) =>
                    setApiConfig({
                      ...apiConfig,
                      appleHealth: {
                        ...apiConfig.appleHealth,
                        enabled: e.target.checked,
                      },
                    })
                  }
                />
                <Label htmlFor="appleHealthEnabled">
                  Enable Apple Health Integration
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appleHealthTeamId">Team ID</Label>
                <Input
                  id="appleHealthTeamId"
                  value={apiConfig.appleHealth.teamId}
                  onChange={(e) =>
                    setApiConfig({
                      ...apiConfig,
                      appleHealth: {
                        ...apiConfig.appleHealth,
                        teamId: e.target.value,
                      },
                    })
                  }
                  placeholder="Your Apple Developer Team ID"
                  disabled={!apiConfig.appleHealth.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appleHealthKeyId">Key ID</Label>
                <Input
                  id="appleHealthKeyId"
                  value={apiConfig.appleHealth.keyId}
                  onChange={(e) =>
                    setApiConfig({
                      ...apiConfig,
                      appleHealth: {
                        ...apiConfig.appleHealth,
                        keyId: e.target.value,
                      },
                    })
                  }
                  placeholder="Your Apple Developer Key ID"
                  disabled={!apiConfig.appleHealth.enabled}
                />
              </div>

              <Alert className="bg-muted/30 border-muted">
                <AlertDescription>
                  Apple Health integration requires additional setup in your iOS
                  app. Please refer to the documentation for more details.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Set up webhooks to receive notifications for events in your
                application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userCreatedWebhook">User Created Webhook</Label>
                <div className="flex space-x-2">
                  <Input
                    id="userCreatedWebhook"
                    value={apiConfig.webhooks.userCreated}
                    onChange={(e) =>
                      setApiConfig({
                        ...apiConfig,
                        webhooks: {
                          ...apiConfig.webhooks,
                          userCreated: e.target.value,
                        },
                      })
                    }
                    placeholder="https://your-server.com/webhooks/user-created"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(apiConfig.webhooks.userCreated)
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Triggered when a new user registers
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bmiRecordedWebhook">BMI Recorded Webhook</Label>
                <div className="flex space-x-2">
                  <Input
                    id="bmiRecordedWebhook"
                    value={apiConfig.webhooks.bmiRecorded}
                    onChange={(e) =>
                      setApiConfig({
                        ...apiConfig,
                        webhooks: {
                          ...apiConfig.webhooks,
                          bmiRecorded: e.target.value,
                        },
                      })
                    }
                    placeholder="https://your-server.com/webhooks/bmi-recorded"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(apiConfig.webhooks.bmiRecorded)
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Triggered when a user records a new BMI measurement
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalAchievedWebhook">
                  Goal Achieved Webhook
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="goalAchievedWebhook"
                    value={apiConfig.webhooks.goalAchieved}
                    onChange={(e) =>
                      setApiConfig({
                        ...apiConfig,
                        webhooks: {
                          ...apiConfig.webhooks,
                          goalAchieved: e.target.value,
                        },
                      })
                    }
                    placeholder="https://your-server.com/webhooks/goal-achieved"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(apiConfig.webhooks.goalAchieved)
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Triggered when a user achieves their BMI goal
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-md">
                <h4 className="font-medium mb-2">Webhook Payload Example</h4>
                <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
                  {JSON.stringify(
                    {
                      event: "bmi_recorded",
                      timestamp: new Date().toISOString(),
                      data: {
                        userId: "user_123",
                        bmi: 22.5,
                        weight: 70,
                        height: 175,
                        date: new Date().toISOString(),
                      },
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rest" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>REST API Keys</CardTitle>
              <CardDescription>
                Manage API keys for external applications to access your BMI
                Tracker data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="apiKey"
                      value={apiConfig.apiKeys.key}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(apiConfig.apiKeys.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiSecret">API Secret</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="apiSecret"
                      value={apiConfig.apiKeys.secret}
                      readOnly
                      className="font-mono"
                      type="password"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(apiConfig.apiKeys.secret)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleGenerateNewApiKey}
                  disabled={isGeneratingKey}
                  className="mt-2"
                >
                  {isGeneratingKey ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate New API Keys"
                  )}
                </Button>

                <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                  <AlertDescription>
                    <strong>Warning:</strong> Generating new API keys will
                    invalidate existing keys. Make sure to update any
                    applications using the current keys.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">API Documentation</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Base URL</p>
                    <div className="flex items-center space-x-2">
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        https://api.bmitracker.com/v1
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          copyToClipboard("https://api.bmitracker.com/v1")
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-muted px-4 py-2 text-sm font-medium">
                      Available Endpoints
                    </div>
                    <div className="divide-y">
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                              GET
                            </span>
                            <code className="text-sm">/users</code>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Docs
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          List all users
                        </p>
                      </div>
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                              GET
                            </span>
                            <code className="text-sm">/users/:id</code>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Docs
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Get a specific user
                        </p>
                      </div>
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                              GET
                            </span>
                            <code className="text-sm">/users/:id/bmi</code>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Docs
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Get BMI history for a user
                        </p>
                      </div>
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                              POST
                            </span>
                            <code className="text-sm">/users/:id/bmi</code>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Docs
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Record a new BMI measurement
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Button variant="outline" className="flex items-center">
                    <Link2 className="mr-2 h-4 w-4" />
                    View Full API Documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
