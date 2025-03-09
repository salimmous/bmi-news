import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Database, RefreshCw, Save, Play } from "lucide-react";

interface DatabaseConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  prefix: string;
}

export default function DatabaseSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [testMessage, setTestMessage] = useState("");
  const [config, setConfig] = useState<DatabaseConfig>({
    host: "localhost",
    port: "3306",
    username: "",
    password: "",
    database: "bmi_tracker",
    prefix: "bmi_",
  });

  // Load config from localStorage for demo purposes
  useEffect(() => {
    const savedConfig = localStorage.getItem("databaseConfig");
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error("Error parsing saved database config:", error);
      }
    }
  }, []);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would be an API call to save the config
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("databaseConfig", JSON.stringify(config));
      alert("Database configuration saved successfully");
    } catch (error) {
      console.error("Error saving database config:", error);
      alert("Failed to save database configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestStatus("idle");
    setTestMessage("");

    try {
      // In a real app, this would be an API call to test the database connection
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success for demo purposes
      setTestStatus("success");
      setTestMessage(
        "Database connection successful! All tables are properly configured.",
      );
    } catch (error) {
      console.error("Error testing database connection:", error);
      setTestStatus("error");
      setTestMessage(
        "Failed to connect to the database. Please check your configuration.",
      );
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="host">Database Host</Label>
          <Input
            id="host"
            value={config.host}
            onChange={(e) => setConfig({ ...config, host: e.target.value })}
            placeholder="localhost"
          />
          <p className="text-xs text-muted-foreground">
            Usually localhost for cPanel hosting
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="port">Database Port</Label>
          <Input
            id="port"
            value={config.port}
            onChange={(e) => setConfig({ ...config, port: e.target.value })}
            placeholder="3306"
          />
          <p className="text-xs text-muted-foreground">
            Default MySQL port is 3306
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Database Username</Label>
          <Input
            id="username"
            value={config.username}
            onChange={(e) => setConfig({ ...config, username: e.target.value })}
            placeholder="Enter your cPanel database username"
          />
          <p className="text-xs text-muted-foreground">
            Usually your cPanel username followed by an underscore
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Database Password</Label>
          <Input
            id="password"
            type="password"
            value={config.password}
            onChange={(e) => setConfig({ ...config, password: e.target.value })}
            placeholder="Enter your database password"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="database">Database Name</Label>
          <Input
            id="database"
            value={config.database}
            onChange={(e) => setConfig({ ...config, database: e.target.value })}
            placeholder="Enter your database name"
          />
          <p className="text-xs text-muted-foreground">
            Usually your cPanel username followed by an underscore and a name
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="prefix">Table Prefix</Label>
          <Input
            id="prefix"
            value={config.prefix}
            onChange={(e) => setConfig({ ...config, prefix: e.target.value })}
            placeholder="bmi_"
          />
          <p className="text-xs text-muted-foreground">
            Used to avoid table name conflicts
          </p>
        </div>
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

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleTestConnection}
          disabled={isTesting}
        >
          {isTesting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Test Connection
            </>
          )}
        </Button>
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

      <div className="mt-8 p-4 border rounded-md bg-muted/20">
        <h3 className="font-medium mb-2">cPanel Database Setup Guide</h3>
        <ol className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
          <li>
            <strong>Create a Database</strong>: Log in to cPanel and navigate to
            MySQL Databases.
          </li>
          <li>
            <strong>Create a User</strong>: Create a new database user with a
            strong password.
          </li>
          <li>
            <strong>Add User to Database</strong>: Grant the user ALL PRIVILEGES
            on the database.
          </li>
          <li>
            <strong>Import Schema</strong>: Use phpMyAdmin to import the
            database schema.
          </li>
          <li>
            <strong>Configure Connection</strong>: Enter the details above and
            test the connection.
          </li>
        </ol>
      </div>
    </div>
  );
}
