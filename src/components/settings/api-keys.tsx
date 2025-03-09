import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
import { Checkbox } from "../ui/checkbox";
import { toast } from "../ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { getApiKeys, createApiKey, deleteApiKey, ApiKey } from "../../lib/api";
import { RefreshCw, Plus, Trash2, Copy, Key, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface ApiKeysProps {
  userId: number;
}

export default function ApiKeysPanel({ userId }: ApiKeysProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(["read"]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  // Available permissions for API keys
  const availablePermissions = [
    { id: "read", label: "Read" },
    { id: "write", label: "Write" },
    { id: "delete", label: "Delete" },
  ];

  // Load API keys from the backend
  useEffect(() => {
    fetchApiKeys();
  }, [userId]);

  const fetchApiKeys = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getApiKeys(userId);
      if (response.success && response.data) {
        setApiKeys(response.data);
      } else {
        setError(response.message || "Failed to load API keys");
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await createApiKey(userId, newKeyName, selectedPermissions);
      if (response.success && response.data) {
        // Store the newly created key to display to the user
        setNewlyCreatedKey(response.data.api_key);
        // Add the new key to the list
        setApiKeys([response.data, ...apiKeys]);
        // Reset form
        setNewKeyName("");
        setSelectedPermissions(["read"]);
        // Keep dialog open to show the key
      } else {
        throw new Error(response.message || "Failed to create API key");
      }
    } catch (error) {
      console.error("Error creating API key:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create API key",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteApiKey = async (keyId: number) => {
    try {
      const response = await deleteApiKey(keyId);
      if (response.success) {
        // Remove the deleted key from the list
        setApiKeys(apiKeys.filter((key) => key.id !== keyId));
        toast({
          title: "Success",
          description: "API key deleted successfully",
          variant: "default",
        });
      } else {
        throw new Error(response.message || "Failed to delete API key");
      }
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied",
          description: "API key copied to clipboard",
          variant: "default",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Error",
          description: "Failed to copy API key",
          variant: "destructive",
        });
      }
    );
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewlyCreatedKey(null);
    // Refresh the list after creating a new key
    fetchApiKeys();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading API keys...</span>
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
        <h2 className="text-2xl font-bold">API Keys</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{newlyCreatedKey ? "API Key Created" : "Create New API Key"}</DialogTitle>
              <DialogDescription>
                {newlyCreatedKey
                  ? "Please copy your API key now. You won't be able to see it again."
                  : "Create a new API key to access the BMI Tracker API."}
              </DialogDescription>
            </DialogHeader>

            {newlyCreatedKey ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="flex justify-between items-center">
                    <code className="text-sm font-mono break-all">{newlyCreatedKey}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(newlyCreatedKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    This API key will only be displayed once and cannot be retrieved later.
                    Make sure to copy it now and store it securely.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="My API Key"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="space-y-2">
                    {availablePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPermissions([...selectedPermissions, permission.id]);
                            } else {
                              setSelectedPermissions(
                                selectedPermissions.filter((p) => p !== permission.id)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={`permission-${permission.id}`}>{permission.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              {newlyCreatedKey ? (
                <Button onClick={closeDialog}>Done</Button>
              ) : (
                <Button onClick={handleCreateApiKey} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>Create</>  
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Manage your API keys for external application development.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-6">
              <Key className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">
                You don't have any API keys yet. Create one to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>{key.permissions}</TableCell>
                    <TableCell>
                      {format(new Date(key.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {key.last_used_at
                        ? format(new Date(key.last_used_at), "MMM d, yyyy")
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          key.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {key.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this API key? This action cannot be
                              undone and any applications using this key will no longer be able to
                              access the API.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteApiKey(key.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            API keys are used to authenticate requests to the BMI Tracker API.
          </p>
          <Button variant="outline" size="sm" onClick={fetchApiKeys}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}