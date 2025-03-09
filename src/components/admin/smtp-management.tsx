import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { Mail, Server, Send, Save, RefreshCw, ListFilter } from "lucide-react";
import { EmailTemplates } from "./email-templates";
import EmailLogs from "./email-logs";

interface SMTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  encryption: "none" | "ssl" | "tls";
  authMethod: "plain" | "login" | "cram-md5";
}

export default function SMTPManagement() {
  const [activeTab, setActiveTab] = useState("settings");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [testMessage, setTestMessage] = useState("");
  const [smtpConfig, setSmtpConfig] = useState<SMTPConfig>({
    host: "",
    port: 587,
    username: "",
    password: "",
    fromEmail: "",
    fromName: "BMI Tracker",
    encryption: "tls",
    authMethod: "plain",
  });

  // Load SMTP config from localStorage for demo purposes
  // In a real app, this would come from your backend API
  useEffect(() => {
    const savedConfig = localStorage.getItem("smtpConfig");
    if (savedConfig) {
      try {
        setSmtpConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error("Error parsing saved SMTP config:", error);
      }
    }
  }, []);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would be an API call to save the config
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("smtpConfig", JSON.stringify(smtpConfig));
      alert("SMTP configuration saved successfully");
    } catch (error) {
      console.error("Error saving SMTP config:", error);
      alert("Failed to save SMTP configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!testEmail) {
      alert("Please enter a test email address");
      return;
    }

    setIsTesting(true);
    setTestStatus("idle");
    setTestMessage("");

    try {
      // In a real app, this would be an API call to test the SMTP connection
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success for demo purposes
      setTestStatus("success");
      setTestMessage("Test email sent successfully! Check your inbox.");
    } catch (error) {
      console.error("Error testing SMTP connection:", error);
      setTestStatus("error");
      setTestMessage(
        "Failed to send test email. Please check your SMTP configuration.",
      );
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings" className="flex items-center">
            <Server className="mr-2 h-4 w-4" />
            SMTP Settings
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center">
            <ListFilter className="mr-2 h-4 w-4" />
            Email Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 mr-2 text-primary" />
                SMTP Server Configuration
              </CardTitle>
              <CardDescription>
                Configure your SMTP server settings for sending emails to users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">SMTP Host</Label>
                  <Input
                    id="host"
                    value={smtpConfig.host}
                    onChange={(e) =>
                      setSmtpConfig({ ...smtpConfig, host: e.target.value })
                    }
                    placeholder="smtp.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">SMTP Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={smtpConfig.port}
                    onChange={(e) =>
                      setSmtpConfig({
                        ...smtpConfig,
                        port: parseInt(e.target.value) || 587,
                      })
                    }
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">SMTP Username</Label>
                  <Input
                    id="username"
                    value={smtpConfig.username}
                    onChange={(e) =>
                      setSmtpConfig({ ...smtpConfig, username: e.target.value })
                    }
                    placeholder="username@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">SMTP Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={smtpConfig.password}
                    onChange={(e) =>
                      setSmtpConfig({ ...smtpConfig, password: e.target.value })
                    }
                    placeholder="Enter your SMTP password"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    value={smtpConfig.fromEmail}
                    onChange={(e) =>
                      setSmtpConfig({
                        ...smtpConfig,
                        fromEmail: e.target.value,
                      })
                    }
                    placeholder="noreply@bmitracker.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={smtpConfig.fromName}
                    onChange={(e) =>
                      setSmtpConfig({ ...smtpConfig, fromName: e.target.value })
                    }
                    placeholder="BMI Tracker"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="encryption">Encryption</Label>
                  <select
                    id="encryption"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={smtpConfig.encryption}
                    onChange={(e) =>
                      setSmtpConfig({
                        ...smtpConfig,
                        encryption: e.target.value as any,
                      })
                    }
                  >
                    <option value="none">None</option>
                    <option value="ssl">SSL</option>
                    <option value="tls">TLS</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authMethod">Authentication Method</Label>
                  <select
                    id="authMethod"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={smtpConfig.authMethod}
                    onChange={(e) =>
                      setSmtpConfig({
                        ...smtpConfig,
                        authMethod: e.target.value as any,
                      })
                    }
                  >
                    <option value="plain">Plain</option>
                    <option value="login">Login</option>
                    <option value="cram-md5">CRAM-MD5</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-end pt-4">
                <div className="space-y-2 flex-1 max-w-md">
                  <Label htmlFor="testEmail">Test Email Address</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="testEmail"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="Enter email for testing"
                    />
                    <Button onClick={handleTestConnection} disabled={isTesting}>
                      {isTesting ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Test
                        </>
                      )}
                    </Button>
                  </div>
                  {testStatus === "success" && (
                    <Alert className="mt-2 bg-green-50 border-green-200 text-green-800">
                      <AlertDescription>{testMessage}</AlertDescription>
                    </Alert>
                  )}
                  {testStatus === "error" && (
                    <Alert
                      className="mt-2 bg-red-50 border-red-200 text-red-800"
                      variant="destructive"
                    >
                      <AlertDescription>{testMessage}</AlertDescription>
                    </Alert>
                  )}
                </div>

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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4 mt-4">
          <EmailTemplates />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4 mt-4">
          <EmailLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
