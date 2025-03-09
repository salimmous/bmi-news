import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { UserManagement } from "./user-management";
import { HealthRecommendations } from "./health-recommendations";
import { SystemAnalytics } from "./system-analytics";
import { useNavigate } from "react-router-dom";
import { Users, FileBarChart, Activity, Bell, Settings } from "lucide-react";
import { Button } from "../ui/button";
import SiteSettingsPanel from "../settings/site-settings";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is an admin
    const userRole = localStorage.getItem("userRole");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (userRole !== "admin") {
      navigate("/dashboard");
      return;
    }

    // Get admin name
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setAdminName(storedName);
    } else {
      const email = localStorage.getItem("userEmail") || "";
      setAdminName(email.split("@")[0]);
    }

    setIsAdmin(true);
  }, [navigate]);

  if (!isAdmin) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {adminName}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                Total Users
              </CardTitle>
              <CardDescription>Active user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <p className="text-3xl font-bold">128</p>
                <p className="text-sm text-green-500 font-medium">
                  +12% <span className="text-muted-foreground">this month</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileBarChart className="h-4 w-4 mr-2 text-green-500" />
                BMI Records
              </CardTitle>
              <CardDescription>Total measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <p className="text-3xl font-bold">1,542</p>
                <p className="text-sm text-green-500 font-medium">
                  +8% <span className="text-muted-foreground">this month</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Activity className="h-4 w-4 mr-2 text-purple-500" />
                Active Today
              </CardTitle>
              <CardDescription>Users active in last 24h</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <p className="text-3xl font-bold">37</p>
                <p className="text-sm text-red-500 font-medium">
                  -5%{" "}
                  <span className="text-muted-foreground">vs yesterday</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-amber-500" />
                New Users
              </CardTitle>
              <CardDescription>Registrations this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <p className="text-3xl font-bold">15</p>
                <p className="text-sm text-green-500 font-medium">
                  +25%{" "}
                  <span className="text-muted-foreground">vs last week</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-[600px] grid-cols-4 mb-8">
            <TabsTrigger value="analytics" className="flex items-center">
              <FileBarChart className="h-4 w-4 mr-2 hidden md:block" />
              System Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2 hidden md:block" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center">
              <Activity className="h-4 w-4 mr-2 hidden md:block" />
              Health Recommendations
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2 hidden md:block" />
              Site Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-4">
            <SystemAnalytics />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <HealthRecommendations />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SiteSettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
