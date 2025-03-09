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
  Globe,
  Users,
  FileText,
} from "lucide-react";
import SiteSettings from "../settings/site-settings";
import DatabaseSettings from "../settings/database-settings";
import WebhooksSettings from "../settings/webhooks-settings";
import APISettings from "../settings/api-settings";
import APIIntegrations from "../settings/api-integrations";
import WidgetSettings from "../settings/widget-settings";
import ContentSettings from "../settings/content-settings";
import LanguageSettings from "../settings/language-settings";
import TranslationManagement from "./translation-management";
import { useLanguage } from "../../lib/i18n";

export default function AdminSettings() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            <span>Database</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center">
            <Code className="mr-2 h-4 w-4" />
            <span>API</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            <span>Language</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value="translations" className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            <span>Translations</span>
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

        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>Language Settings</CardTitle>
              <CardDescription>
                Configure language options and translations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Edit website content and pages</CardDescription>
            </CardHeader>
            <CardContent>
              <ContentSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="translations">
          <Card>
            <CardHeader>
              <CardTitle>Translation Management</CardTitle>
              <CardDescription>
                Manage translations and language files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TranslationManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
