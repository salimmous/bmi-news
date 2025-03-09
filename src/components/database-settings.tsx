import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-primary" />
            Database Connection
          </CardTitle>
          <CardDescription>
            Configure your MySQL database connection for cPanel hosting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                onChange={(e) =>
                  setConfig({ ...config, username: e.target.value })
                }
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
                onChange={(e) =>
                  setConfig({ ...config, password: e.target.value })
                }
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
                onChange={(e) =>
                  setConfig({ ...config, database: e.target.value })
                }
                placeholder="Enter your database name"
              />
              <p className="text-xs text-muted-foreground">
                Usually your cPanel username followed by an underscore and a
                name
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prefix">Table Prefix</Label>
              <Input
                id="prefix"
                value={config.prefix}
                onChange={(e) =>
                  setConfig({ ...config, prefix: e.target.value })
                }
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
        </CardContent>
        <CardFooter className="flex justify-between">
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
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>cPanel Database Setup Guide</CardTitle>
          <CardDescription>
            Follow these steps to set up your database in cPanel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Step 1: Create a Database</h3>
            <p className="text-sm text-muted-foreground">
              Log in to your cPanel account and navigate to the "MySQL
              Databases" section. Create a new database with a name like
              "bmi_tracker".
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Step 2: Create a Database User</h3>
            <p className="text-sm text-muted-foreground">
              In the same section, create a new database user with a strong
              password. Make sure to save these credentials as you'll need them
              for the configuration above.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Step 3: Add User to Database</h3>
            <p className="text-sm text-muted-foreground">
              Add the user you created to the database and grant them "ALL
              PRIVILEGES".
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Step 4: Import Database Schema</h3>
            <p className="text-sm text-muted-foreground">
              Use phpMyAdmin to import the database schema. You can access
              phpMyAdmin from your cPanel dashboard. Upload and import the SQL
              file containing the database structure.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Step 5: Configure Connection</h3>
            <p className="text-sm text-muted-foreground">
              Enter the database details in the form above and test the
              connection to ensure everything is working properly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
