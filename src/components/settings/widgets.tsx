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
  CardFooter,
} from "../ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Switch } from "../ui/switch";
import { toast } from "../ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { getWidgets, getUserWidgets, updateUserWidgets, Widget } from "../../lib/api";
import { RefreshCw, Plus, Trash2, Edit, LayoutDashboard, AlertTriangle, MoveVertical } from "lucide-react";
import { format } from "date-fns";

interface WidgetsProps {
  userId?: number;
  dashboardType: 'admin' | 'user';
}

export default function WidgetsPanel({ userId, dashboardType }: WidgetsProps) {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [userWidgets, setUserWidgets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentWidget, setCurrentWidget] = useState<Widget | null>(null);

  // Load widgets from the backend
  useEffect(() => {
    fetchWidgets();
  }, [dashboardType]);

  // Load user widget preferences if userId is provided
  useEffect(() => {
    if (userId) {
      fetchUserWidgets();
    }
  }, [userId]);

  const fetchWidgets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getWidgets(dashboardType);
      if (response.success && response.data) {
        setWidgets(response.data);
      } else {
        setError(response.message || "Failed to load widgets");
      }
    } catch (error) {
      console.error("Error fetching widgets:", error);
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserWidgets = async () => {
    if (!userId) return;
    
    try {
      const response = await getUserWidgets(userId);
      if (response.success && response.data) {
        setUserWidgets(response.data);
      } else {
        console.error("Failed to load user widget preferences:", response.message);
      }
    } catch (error) {
      console.error("Error fetching user widget preferences:", error);
    }
  };

  const handleToggleWidget = async (widgetId: number, isEnabled: boolean) => {
    if (!userId) return;

    try {
      // Find the widget in user preferences or create a new one
      let userWidget = userWidgets.find(uw => uw.widget_id === widgetId);
      
      if (userWidget) {
        // Update existing preference
        userWidget = { ...userWidget, is_enabled: isEnabled };
      } else {
        // Create new preference
        userWidget = {
          widget_id: widgetId,
          is_enabled: isEnabled,
          display_order: userWidgets.length,
          settings: null
        };
      }

      // Update local state first for immediate feedback
      const updatedUserWidgets = userWidgets.filter(uw => uw.widget_id !== widgetId);
      updatedUserWidgets.push(userWidget);
      setUserWidgets(updatedUserWidgets);

      // Send update to server
      const response = await updateUserWidgets(userId, updatedUserWidgets);
      
      if (response.success) {
        toast({
          title: "Success",
          description: `Widget ${isEnabled ? "enabled" : "disabled"} successfully`,
          variant: "default",
        });
      } else {
        throw new Error(response.message || "Failed to update widget preference");
      }
    } catch (error) {
      console.error("Error updating widget preference:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update widget preference",
        variant: "destructive",
      });
      // Revert local state on error
      fetchUserWidgets();
    }
  };

  const handleMoveWidget = async (widgetId: number, direction: 'up' | 'down') => {
    if (!userId) return;

    try {
      // Find the current widget and its index
      const widgetIndex = userWidgets.findIndex(uw => uw.widget_id === widgetId);
      if (widgetIndex === -1) return;

      // Calculate new index based on direction
      const newIndex = direction === 'up' 
        ? Math.max(0, widgetIndex - 1) 
        : Math.min(userWidgets.length - 1, widgetIndex + 1);
      
      // If no change in position, return early
      if (newIndex === widgetIndex) return;

      // Create a copy of the user widgets array
      const updatedUserWidgets = [...userWidgets];
      
      // Swap the widgets
      const temp = updatedUserWidgets[widgetIndex];
      updatedUserWidgets[widgetIndex] = updatedUserWidgets[newIndex];
      updatedUserWidgets[newIndex] = temp;

      // Update display order
      updatedUserWidgets.forEach((widget, index) => {
        widget.display_order = index;
      });

      // Update local state first for immediate feedback
      setUserWidgets(updatedUserWidgets);

      // Send update to server
      const response = await updateUserWidgets(userId, updatedUserWidgets);
      
      if (response.success) {
        toast({
          title: "Success",
          description: `Widget moved ${direction} successfully`,
          variant: "default",
        });
      } else {
        throw new Error(response.message || "Failed to update widget order");
      }
    } catch (error) {
      console.error("Error updating widget order:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update widget order",
        variant: "destructive",
      });
      // Revert local state on error
      fetchUserWidgets();
    }
  };

  const isWidgetEnabled = (widgetId: number) => {
    if (!userId || userWidgets.length === 0) return true;
    const userWidget = userWidgets.find(uw => uw.widget_id === widgetId);
    return userWidget ? userWidget.is_enabled : false;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading widgets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{dashboardType === 'admin' ? 'Admin' : 'User'} Dashboard Widgets</h2>
        <Button variant="outline" size="sm" onClick={fetchWidgets}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Widgets</CardTitle>
          <CardDescription>
            {userId 
              ? "Customize your dashboard by enabling or disabling widgets and changing their order."
              : "Manage widgets available for the dashboard."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {widgets.length === 0 ? (
            <div className="text-center py-6">
              <LayoutDashboard className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">
                No widgets available for this dashboard type.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  {userId && <TableHead>Status</TableHead>}
                  {userId && <TableHead>Order</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {widgets.map((widget) => (
                  <TableRow key={widget.id}>
                    <TableCell className="font-medium">{widget.name}</TableCell>
                    <TableCell>{widget.widget_type}</TableCell>
                    <TableCell>{widget.description || "No description available"}</TableCell>
                    {userId && (
                      <TableCell>
                        <Switch
                          checked={isWidgetEnabled(widget.id)}
                          onCheckedChange={(checked) => handleToggleWidget(widget.id, checked)}
                        />
                      </TableCell>
                    )}
                    {userId && (
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveWidget(widget.id, 'up')}
                            disabled={!isWidgetEnabled(widget.id)}
                          >
                            <MoveVertical className="h-4 w-4 rotate-180" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveWidget(widget.id, 'down')}
                            disabled={!isWidgetEnabled(widget.id)}
                          >
                            <MoveVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {userId 
              ? "Changes to widget settings are saved automatically."
              : "Widgets are displayed based on user preferences and dashboard type."}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}