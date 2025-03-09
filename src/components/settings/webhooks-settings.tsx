import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
import { Webhook, Plus, Trash2, Edit, RefreshCw, Copy } from "lucide-react";
import { toast } from "../ui/use-toast";

interface WebhookData {
  id: number;
  name: string;
  url: string;
  event_type: string;
  secret_key: string;
  is_active: boolean;
  created_at: string;
  last_triggered: string | null;
}

export default function WebhooksSettings() {
  const [webhooks, setWebhooks] = useState<WebhookData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentWebhook, setCurrentWebhook] = useState<WebhookData | null>(
    null,
  );

  // Mock data for demonstration
  const mockWebhooks: WebhookData[] = [
    {
      id: 1,
      name: "New User Registration",
      url: "https://example.com/webhooks/new-user",
      event_type: "user.created",
      secret_key: "whsec_abcdef123456",
      is_active: true,
      created_at: "2023-09-15T10:30:00Z",
      last_triggered: "2023-10-05T14:22:15Z",
    },
    {
      id: 2,
      name: "BMI Record Created",
      url: "https://example.com/webhooks/bmi-record",
      event_type: "bmi.created",
      secret_key: "whsec_xyz789012345",
      is_active: true,
      created_at: "2023-09-20T11:45:00Z",
      last_triggered: "2023-10-10T09:17:30Z",
    },
    {
      id: 3,
      name: "Goal Achieved",
      url: "https://example.com/webhooks/goal-achieved",
      event_type: "goal.achieved",
      secret_key: "whsec_goal123456789",
      is_active: false,
      created_at: "2023-09-25T15:20:00Z",
      last_triggered: null,
    },
  ];

  // Load webhooks on component mount
  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setWebhooks(mockWebhooks);
    } catch (error) {
      console.error("Error fetching webhooks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWebhook = () => {
    if (!currentWebhook) return;

    const newWebhook = {
      ...currentWebhook,
      id: Date.now(),
      created_at: new Date().toISOString(),
      last_triggered: null,
    };

    setWebhooks([...webhooks, newWebhook]);
    setIsAddDialogOpen(false);
    setCurrentWebhook(null);
    toast({
      title: "Success",
      description: "Webhook added successfully",
    });
  };

  const handleEditWebhook = () => {
    if (!currentWebhook) return;

    const updatedWebhooks = webhooks.map((webhook) =>
      webhook.id === currentWebhook.id ? currentWebhook : webhook,
    );

    setWebhooks(updatedWebhooks);
    setIsEditDialogOpen(false);
    setCurrentWebhook(null);
    toast({
      title: "Success",
      description: "Webhook updated successfully",
    });
  };

  const handleDeleteWebhook = (id: number) => {
    setWebhooks(webhooks.filter((webhook) => webhook.id !== id));
    toast({
      title: "Success",
      description: "Webhook deleted successfully",
    });
  };

  const handleToggleWebhook = (id: number, isActive: boolean) => {
    const updatedWebhooks = webhooks.map((webhook) =>
      webhook.id === id ? { ...webhook, is_active: isActive } : webhook,
    );

    setWebhooks(updatedWebhooks);
    toast({
      title: "Success",
      description: `Webhook ${isActive ? "enabled" : "disabled"} successfully`,
    });
  };

  const initNewWebhook = () => {
    setCurrentWebhook({
      id: 0,
      name: "",
      url: "",
      event_type: "user.created",
      secret_key: generateSecretKey(),
      is_active: true,
      created_at: "",
      last_triggered: null,
    });
    setIsAddDialogOpen(true);
  };

  const initEditWebhook = (webhook: WebhookData) => {
    setCurrentWebhook({ ...webhook });
    setIsEditDialogOpen(true);
  };

  const generateSecretKey = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "whsec_";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Secret key copied to clipboard",
    });
  };

  const eventTypeOptions = [
    { value: "user.created", label: "User Created" },
    { value: "user.updated", label: "User Updated" },
    { value: "bmi.created", label: "BMI Record Created" },
    { value: "bmi.updated", label: "BMI Record Updated" },
    { value: "goal.created", label: "Goal Created" },
    { value: "goal.achieved", label: "Goal Achieved" },
    { value: "recommendation.created", label: "Recommendation Created" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Webhooks</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={initNewWebhook}>
              <Plus className="mr-2 h-4 w-4" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Webhook</DialogTitle>
              <DialogDescription>
                Create a new webhook to receive real-time notifications for
                events
              </DialogDescription>
            </DialogHeader>
            {currentWebhook && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Webhook Name</Label>
                  <Input
                    id="name"
                    value={currentWebhook.name}
                    onChange={(e) =>
                      setCurrentWebhook({
                        ...currentWebhook,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g., New User Registration"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Webhook URL</Label>
                  <Input
                    id="url"
                    value={currentWebhook.url}
                    onChange={(e) =>
                      setCurrentWebhook({
                        ...currentWebhook,
                        url: e.target.value,
                      })
                    }
                    placeholder="https://example.com/webhooks/endpoint"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_type">Event Type</Label>
                  <Select
                    value={currentWebhook.event_type}
                    onValueChange={(value) =>
                      setCurrentWebhook({
                        ...currentWebhook,
                        event_type: value,
                      })
                    }
                  >
                    <SelectTrigger id="event_type">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secret_key">Secret Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secret_key"
                      value={currentWebhook.secret_key}
                      readOnly
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentWebhook({
                          ...currentWebhook,
                          secret_key: generateSecretKey(),
                        })
                      }
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This secret key will be used to verify webhook requests
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={currentWebhook.is_active}
                    onCheckedChange={(checked) =>
                      setCurrentWebhook({
                        ...currentWebhook,
                        is_active: checked,
                      })
                    }
                  />
                  <Label htmlFor="is_active">Enable Webhook</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddWebhook}>Add Webhook</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading webhooks...</span>
        </div>
      ) : webhooks.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <Webhook className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">
            No webhooks configured yet. Add your first webhook to receive
            real-time notifications.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Triggered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium">{webhook.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {webhook.url}
                  </TableCell>
                  <TableCell>
                    {eventTypeOptions.find(
                      (option) => option.value === webhook.event_type,
                    )?.label || webhook.event_type}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={webhook.is_active}
                      onCheckedChange={(checked) =>
                        handleToggleWebhook(webhook.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {webhook.last_triggered
                      ? new Date(webhook.last_triggered).toLocaleString()
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => initEditWebhook(webhook)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this webhook? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteWebhook(webhook.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Webhook Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Webhook</DialogTitle>
            <DialogDescription>Update webhook configuration</DialogDescription>
          </DialogHeader>
          {currentWebhook && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Webhook Name</Label>
                <Input
                  id="edit-name"
                  value={currentWebhook.name}
                  onChange={(e) =>
                    setCurrentWebhook({
                      ...currentWebhook,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-url">Webhook URL</Label>
                <Input
                  id="edit-url"
                  value={currentWebhook.url}
                  onChange={(e) =>
                    setCurrentWebhook({
                      ...currentWebhook,
                      url: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-event_type">Event Type</Label>
                <Select
                  value={currentWebhook.event_type}
                  onValueChange={(value) =>
                    setCurrentWebhook({
                      ...currentWebhook,
                      event_type: value,
                    })
                  }
                >
                  <SelectTrigger id="edit-event_type">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-secret_key">Secret Key</Label>
                <div className="flex space-x-2">
                  <Input
                    id="edit-secret_key"
                    value={currentWebhook.secret_key}
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(currentWebhook.secret_key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentWebhook({
                        ...currentWebhook,
                        secret_key: generateSecretKey(),
                      })
                    }
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Regenerating the secret key will invalidate the previous one
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is_active"
                  checked={currentWebhook.is_active}
                  onCheckedChange={(checked) =>
                    setCurrentWebhook({
                      ...currentWebhook,
                      is_active: checked,
                    })
                  }
                />
                <Label htmlFor="edit-is_active">Enable Webhook</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditWebhook}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-6 p-4 border rounded-md bg-muted/20">
        <h3 className="font-medium mb-2">Webhook Implementation Guide</h3>
        <p className="text-sm text-muted-foreground mb-4">
          To verify webhook requests, your server should validate the signature
          in the
          <code className="px-1 py-0.5 bg-muted rounded">
            X-BMI-Signature
          </code>{" "}
          header.
        </p>
        <div className="bg-muted rounded-md p-3 text-xs font-mono overflow-x-auto">
          <pre>{`// Example verification in Node.js
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signature)
  );
}`}</pre>
        </div>
      </div>
    </div>
  );
}
