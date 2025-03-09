import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  LayoutDashboard,
  RefreshCw,
  MoveVertical,
  Settings,
} from "lucide-react";

interface Widget {
  id: number;
  name: string;
  description: string | null;
  widget_type: string;
  dashboard_type: "admin" | "user" | "both";
  is_active: boolean;
  display_order: number;
}

export default function WidgetSettings() {
  const [adminWidgets, setAdminWidgets] = useState<Widget[]>([]);
  const [userWidgets, setUserWidgets] = useState<Widget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"admin" | "user">("admin");
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [currentWidget, setCurrentWidget] = useState<Widget | null>(null);

  // Mock data for demonstration
  const mockWidgets: Widget[] = [
    {
      id: 1,
      name: "BMI Chart",
      description: "Displays user's BMI history chart",
      widget_type: "chart",
      dashboard_type: "user",
      is_active: true,
      display_order: 1,
    },
    {
      id: 2,
      name: "Weight Tracker",
      description: "Shows weight history and trends",
      widget_type: "chart",
      dashboard_type: "user",
      is_active: true,
      display_order: 2,
    },
    {
      id: 3,
      name: "Health Tips",
      description: "Displays personalized health recommendations",
      widget_type: "content",
      dashboard_type: "user",
      is_active: true,
      display_order: 3,
    },
    {
      id: 4,
      name: "Goal Progress",
      description: "Shows progress towards fitness goals",
      widget_type: "progress",
      dashboard_type: "user",
      is_active: true,
      display_order: 4,
    },
    {
      id: 5,
      name: "Quick Stats",
      description: "Shows key metrics at a glance",
      widget_type: "stats",
      dashboard_type: "admin",
      is_active: true,
      display_order: 1,
    },
    {
      id: 6,
      name: "Recent Users",
      description: "Displays recently registered users",
      widget_type: "table",
      dashboard_type: "admin",
      is_active: true,
      display_order: 2,
    },
    {
      id: 7,
      name: "System Health",
      description: "Shows system performance metrics",
      widget_type: "stats",
      dashboard_type: "admin",
      is_active: true,
      display_order: 3,
    },
    {
      id: 8,
      name: "Sport-Specific BMI",
      description: "Shows BMI data specific to user's sport",
      widget_type: "chart",
      dashboard_type: "user",
      is_active: true,
      display_order: 5,
    },
    {
      id: 9,
      name: "Emotional Health",
      description: "Tracks emotional state and provides insights",
      widget_type: "content",
      dashboard_type: "user",
      is_active: true,
      display_order: 6,
    },
    {
      id: 10,
      name: "Athlete Profiles",
      description: "Shows athlete profile statistics",
      widget_type: "table",
      dashboard_type: "admin",
      is_active: true,
      display_order: 4,
    },
  ];

  // Load widgets on component mount
  useEffect(() => {
    fetchWidgets();
  }, []);

  const fetchWidgets = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Split widgets by dashboard type
      const adminWidgets = mockWidgets
        .filter(
          (w) => w.dashboard_type === "admin" || w.dashboard_type === "both",
        )
        .sort((a, b) => a.display_order - b.display_order);

      const userWidgets = mockWidgets
        .filter(
          (w) => w.dashboard_type === "user" || w.dashboard_type === "both",
        )
        .sort((a, b) => a.display_order - b.display_order);

      setAdminWidgets(adminWidgets);
      setUserWidgets(userWidgets);
    } catch (error) {
      console.error("Error fetching widgets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWidget = (id: number, isActive: boolean) => {
    // Update admin widgets
    setAdminWidgets(
      adminWidgets.map((widget) =>
        widget.id === id ? { ...widget, is_active: isActive } : widget,
      ),
    );

    // Update user widgets
    setUserWidgets(
      userWidgets.map((widget) =>
        widget.id === id ? { ...widget, is_active: isActive } : widget,
      ),
    );
  };

  const handleMoveWidget = (
    id: number,
    direction: "up" | "down",
    dashboardType: "admin" | "user",
  ) => {
    if (dashboardType === "admin") {
      const widgetIndex = adminWidgets.findIndex((w) => w.id === id);
      if (widgetIndex === -1) return;

      const newIndex =
        direction === "up"
          ? Math.max(0, widgetIndex - 1)
          : Math.min(adminWidgets.length - 1, widgetIndex + 1);

      if (newIndex === widgetIndex) return;

      const updatedWidgets = [...adminWidgets];
      const temp = updatedWidgets[widgetIndex];
      updatedWidgets[widgetIndex] = updatedWidgets[newIndex];
      updatedWidgets[newIndex] = temp;

      // Update display order
      updatedWidgets.forEach((widget, index) => {
        widget.display_order = index + 1;
      });

      setAdminWidgets(updatedWidgets);
    } else {
      const widgetIndex = userWidgets.findIndex((w) => w.id === id);
      if (widgetIndex === -1) return;

      const newIndex =
        direction === "up"
          ? Math.max(0, widgetIndex - 1)
          : Math.min(userWidgets.length - 1, widgetIndex + 1);

      if (newIndex === widgetIndex) return;

      const updatedWidgets = [...userWidgets];
      const temp = updatedWidgets[widgetIndex];
      updatedWidgets[widgetIndex] = updatedWidgets[newIndex];
      updatedWidgets[newIndex] = temp;

      // Update display order
      updatedWidgets.forEach((widget, index) => {
        widget.display_order = index + 1;
      });

      setUserWidgets(updatedWidgets);
    }
  };

  const openWidgetConfig = (widget: Widget) => {
    setCurrentWidget(widget);
    setIsConfigDialogOpen(true);
  };

  const getWidgetTypeLabel = (type: string) => {
    switch (type) {
      case "chart":
        return "Chart";
      case "table":
        return "Table";
      case "stats":
        return "Statistics";
      case "content":
        return "Content";
      case "progress":
        return "Progress";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "admin" | "user")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
          <TabsTrigger value="user">User Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading widgets...</span>
            </div>
          ) : adminWidgets.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-muted/20">
              <LayoutDashboard className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">
                No widgets available for the admin dashboard.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminWidgets.map((widget) => (
                    <TableRow key={widget.id}>
                      <TableCell className="font-medium">
                        {widget.display_order}
                      </TableCell>
                      <TableCell>{widget.name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {getWidgetTypeLabel(widget.widget_type)}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {widget.description || "No description available"}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={widget.is_active}
                          onCheckedChange={(checked) =>
                            handleToggleWidget(widget.id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleMoveWidget(widget.id, "up", "admin")
                            }
                            disabled={widget.display_order === 1}
                          >
                            <MoveVertical className="h-4 w-4 rotate-180" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleMoveWidget(widget.id, "down", "admin")
                            }
                            disabled={
                              widget.display_order === adminWidgets.length
                            }
                          >
                            <MoveVertical className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openWidgetConfig(widget)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="user" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading widgets...</span>
            </div>
          ) : userWidgets.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-muted/20">
              <LayoutDashboard className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">
                No widgets available for the user dashboard.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userWidgets.map((widget) => (
                    <TableRow key={widget.id}>
                      <TableCell className="font-medium">
                        {widget.display_order}
                      </TableCell>
                      <TableCell>{widget.name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {getWidgetTypeLabel(widget.widget_type)}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {widget.description || "No description available"}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={widget.is_active}
                          onCheckedChange={(checked) =>
                            handleToggleWidget(widget.id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleMoveWidget(widget.id, "up", "user")
                            }
                            disabled={widget.display_order === 1}
                          >
                            <MoveVertical className="h-4 w-4 rotate-180" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleMoveWidget(widget.id, "down", "user")
                            }
                            disabled={
                              widget.display_order === userWidgets.length
                            }
                          >
                            <MoveVertical className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openWidgetConfig(widget)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Widget Configuration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Widget Configuration</DialogTitle>
            <DialogDescription>
              Configure display settings for {currentWidget?.name}
            </DialogDescription>
          </DialogHeader>
          {currentWidget && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="widget-name">Widget Name</Label>
                <Input
                  id="widget-name"
                  value={currentWidget.name}
                  onChange={(e) =>
                    setCurrentWidget({
                      ...currentWidget,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="widget-description">Description</Label>
                <Input
                  id="widget-description"
                  value={currentWidget.description || ""}
                  onChange={(e) =>
                    setCurrentWidget({
                      ...currentWidget,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="widget-active"
                  checked={currentWidget.is_active}
                  onCheckedChange={(checked) =>
                    setCurrentWidget({
                      ...currentWidget,
                      is_active: checked,
                    })
                  }
                />
                <Label htmlFor="widget-active">Enable Widget</Label>
              </div>

              {/* Widget-specific configuration options would go here */}
              <div className="p-4 border rounded-md bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  Additional configuration options for this widget type are not
                  available in the demo.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfigDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // In a real app, this would save the widget configuration
                setIsConfigDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="p-4 border rounded-md bg-muted/20">
        <h3 className="font-medium mb-2">Widget Information</h3>
        <p className="text-sm text-muted-foreground">
          Widgets are modular components that display information on dashboards.
          You can enable/disable widgets and change their display order.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          The Sport-Specific BMI and Emotional Health widgets provide
          specialized insights for athletes based on their sport type and
          emotional state.
        </p>
      </div>
    </div>
  );
}
