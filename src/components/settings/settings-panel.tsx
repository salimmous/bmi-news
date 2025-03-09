import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Settings,
  Database,
  Webhook,
  Code,
  Mail,
  LayoutDashboard,
} from "lucide-react";
import SiteSettings from "./site-settings";
import DatabaseSettings from "./database-settings";
import WebhooksSettings from "./webhooks-settings";
import APISettings from "./api-settings";
import APIIntegrations from "./api-integrations";
import WidgetSettings from "./widget-settings";

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            <span>Database</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center">
            <Webhook className="mr-2 h-4 w-4" />
            <span>Webhooks</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center">
            <Code className="mr-2 h-4 w-4" />
            <span>API</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="widgets" className="flex items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Widgets</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic information about your BMI Tracker application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SiteSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Configuration</CardTitle>
              <CardDescription>
                Configure your database connection settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DatabaseSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>
                Configure webhook endpoints for real-time notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WebhooksSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <APISettings />
          <APIIntegrations />
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email server settings and templates
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <iframe
                src="/admin/smtp-management"
                className="w-full min-h-[800px] border-0"
                title="Email Settings"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="widgets">
          <Card>
            <CardHeader>
              <CardTitle>Widget Settings</CardTitle>
              <CardDescription>
                Configure widgets for admin and user dashboards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WidgetSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
