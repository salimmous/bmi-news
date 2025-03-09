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
import { getWebhooks, createWebhook, updateWebhook, deleteWebhook, Webhook } from "../../lib/api";
import { RefreshCw, Plus, Trash2, Edit, Link2, AlertTriangle, Check, X } from "lucide-react";
import { format } from "date-fns";

export default function WebhooksPanel() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentWebhook, setCurrentWebhook] = useState<Webhook | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    event_type: "user.created",
    secret_key: "",
    is_active: true,
  });

  // Available event types
  const eventTypes = [
    { id: "user.created", label: "User Created" },
    { id: "user.updated", label: "User Updated" },
    { id: "bmi.recorded", label: "BMI Recorded" },
    { id: "goal.achieved", label: "Goal Achieved" },
  ];

  // Load webhooks from the backend
  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getWebhooks();
      if (response.success && response.data) {
        setWebhooks(response.data);
      } else {
        setError(response.message || "Failed to load webhooks");
      }
    } catch (error) {
      console.error("Error fetching webhooks:", error);
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      event_type: "user.created",
      secret_key: "",
      is_active: true,
    });
    setCurrentWebhook(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleOpenDialog = (webhook?: Webhook) => {
    if (webhook) {
      // Edit mode
      setIsEditing(true);
      setCurrentWebhook(webhook);
      setFormData({
        name: webhook.name,
        url: webhook.url,
        event_type: webhook.event_type,
        secret_key: webhook.secret_key || "",
        is_active: webhook.is_active,
      });
    } else {
      // Create mode
      resetForm();
      setIsCreating(true);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_active: checked,
    });
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the webhook",
        variant: "destructive",
      });
      return;
    }

    if (!formData.url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL for the webhook",
        variant: "destructive",
      });
      return;
    }

    if (!formData.event_type) {
      toast({
        title: "Error",
        description: "Please select an event type",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && currentWebhook) {
        // Update existing webhook
        setIsEditing(true);
        const response = await updateWebhook(currentWebhook.id, formData);
        if (response.success && response.data) {
          toast({
            title: "Success",
            description: "Webhook updated successfully",
            variant: "default",
          });
          // Update the webhook in the list
          setWebhooks(webhooks.map(w => w.id === currentWebhook.id ? response.data : w));
          handleCloseDialog();
        } else {
          throw new Error(response.message || "Failed to update webhook");
        }
      } else {
        // Create new webhook
        setIsCreating(true);
        const response = await createWebhook(formData);
        if (response.success && response.data) {
          toast({
            title: "Success",
            description: "Webhook created successfully",
            variant: "default",
          });
          // Add the new webhook to the list
          setWebhooks([response.data, ...webhooks]);
          handleCloseDialog();
        } else {
          throw new Error(response.message || "Failed to create webhook");
        }
      }
    } catch (error) {
      console.error("Error saving webhook:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save webhook",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
      setIsEditing(false);
    }
  };

  const handleDeleteWebhook = async (webhookId: number) => {
    try {
      const response = await deleteWebhook(webhookId);
      if (response.success) {
        // Remove the deleted webhook from the list
        setWebhooks(webhooks.filter((webhook) => webhook.id !== webhookId));
        toast({
          title: "Success",
          description: "Webhook deleted successfully",
          variant: "default",
        });
      } else {
        throw new Error(response.message || "Failed to delete webhook");
      }
    } catch (error) {
      console.error("Error deleting webhook:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete webhook",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading webhooks...</span>
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
        <h2 className="text-2xl font-bold">Webhooks</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Create Webhook
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Webhooks</CardTitle>
          <CardDescription>
            Manage webhooks for system integration with external applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-6">
              <Link2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">
                You don't have any webhooks yet. Create one to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-medium">{webhook.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{webhook.url}</TableCell>
                    <TableCell>{webhook.event_type}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          webhook.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {webhook.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(webhook.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(webhook)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this webhook? This action cannot be
                                undone and any applications using this webhook will no longer
                                receive notifications.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteWebhook(webhook.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Webhooks allow external applications to receive real-time notifications when events occur.
          </p>
          <Button variant="outline" size="sm" onClick={fetchWebhooks}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Webhook" : "Create New Webhook"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your webhook configuration."
                : "Create a new webhook to receive notifications when events occur."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="My Webhook"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.com/webhook"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_type">Event Type</Label>
              <select
                id="event_type"
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {eventTypes.map((eventType) => (
                  <option key={eventType.id} value={eventType.id}>
                    {eventType.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Select the event that will trigger this webhook.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret_key">Secret Key (Optional)</Label>
              <Input
                id="secret_key"
                name="secret_key"
                value={formData.secret_key}
                onChange={handleInputChange}
                placeholder="Secret key for signature verification"
              />
              <p className="text-xs text-muted-foreground">
                A secret key will be used to sign webhook payloads so you can verify they came from us.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isCreating || isEditing}>
              {(isCreating || isEditing) ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditing ? "Update" : "Create"}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}