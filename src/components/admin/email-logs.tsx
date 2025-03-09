import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
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
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Mail, Search, RefreshCw, Eye, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface EmailLog {
  id: number;
  recipient: string;
  subject: string;
  template_name: string;
  status: "sent" | "failed" | "pending";
  sent_at: string;
  error?: string;
}

export default function EmailLogs() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingLog, setViewingLog] = useState<EmailLog | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: string;
    to: string;
  }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 days ago
    to: new Date().toISOString().split("T")[0], // today
  });

  // Mock data for demonstration
  const mockLogs: EmailLog[] = [
    {
      id: 1,
      recipient: "john.doe@example.com",
      subject: "Welcome to BMI Tracker!",
      template_name: "Welcome Email",
      status: "sent",
      sent_at: "2023-10-15T14:30:00Z",
    },
    {
      id: 2,
      recipient: "jane.smith@example.com",
      subject: "Your Weekly BMI Progress Report",
      template_name: "Weekly Progress Report",
      status: "sent",
      sent_at: "2023-10-14T10:15:00Z",
    },
    {
      id: 3,
      recipient: "mike.johnson@example.com",
      subject: "Your Personalized Meal Plan is Ready",
      template_name: "New Meal Plan Recommendation",
      status: "failed",
      sent_at: "2023-10-13T09:45:00Z",
      error: "SMTP connection timeout",
    },
    {
      id: 4,
      recipient: "sarah.williams@example.com",
      subject: "Your Sport-Specific BMI Analysis",
      template_name: "Sport-Specific BMI Analysis",
      status: "sent",
      sent_at: "2023-10-12T16:20:00Z",
    },
    {
      id: 5,
      recipient: "robert.brown@example.com",
      subject: "Congratulations! You've Reached Your Goal",
      template_name: "Goal Achievement Notification",
      status: "pending",
      sent_at: "2023-10-11T11:30:00Z",
    },
    {
      id: 6,
      recipient: "emily.davis@example.com",
      subject: "We Miss You! Continue Your Health Journey",
      template_name: "Inactivity Reminder",
      status: "sent",
      sent_at: "2023-10-10T08:45:00Z",
    },
    {
      id: 7,
      recipient: "david.miller@example.com",
      subject: "Your Monthly Health & Fitness Summary",
      template_name: "Monthly Health Summary",
      status: "failed",
      sent_at: "2023-10-09T14:10:00Z",
      error: "Invalid recipient email address",
    },
    {
      id: 8,
      recipient: "jennifer.wilson@example.com",
      subject: "Exciting New Features for BMI Tracker",
      template_name: "New Feature Announcement",
      status: "sent",
      sent_at: "2023-10-08T09:30:00Z",
    },
  ];

  // Load logs on component mount
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLogs(mockLogs);
    } catch (error) {
      console.error("Error fetching email logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would filter from the server
    // For demo, we'll just filter the mock data
    console.log("Searching for:", searchTerm);
  };

  const handleViewLog = (log: EmailLog) => {
    setViewingLog(log);
    setIsViewDialogOpen(true);
  };

  const handleDeleteLog = (id: number) => {
    // In a real app, this would be an API call
    setLogs(logs.filter((log) => log.id !== id));
  };

  const handleExportLogs = () => {
    // In a real app, this would generate a CSV file
    alert("Logs would be exported as CSV");
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.template_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: "sent" | "failed" | "pending") => {
    switch (status) {
      case "sent":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Sent
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Failed
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-primary" />
            Email Logs
          </CardTitle>
          <CardDescription>
            View and manage email sending history and delivery status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="space-y-1">
                <Label htmlFor="from-date">From</Label>
                <Input
                  id="from-date"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="to-date">To</Label>
                <Input
                  id="to-date"
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search emails..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
              <Button variant="outline" onClick={fetchLogs}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleExportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading logs...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No email logs found for the selected criteria.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {log.recipient}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {log.subject}
                      </TableCell>
                      <TableCell>{log.template_name}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>
                        {format(new Date(log.sent_at), "MMM d, yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLog(log.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Log Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about the email
            </DialogDescription>
          </DialogHeader>

          {viewingLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Recipient</Label>
                  <p className="font-medium">{viewingLog.recipient}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p>{getStatusBadge(viewingLog.status)}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Subject</Label>
                <p className="font-medium">{viewingLog.subject}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Template</Label>
                <p>{viewingLog.template_name}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Sent At</Label>
                <p>{format(new Date(viewingLog.sent_at), "PPpp")}</p>
              </div>

              {viewingLog.error && (
                <div>
                  <Label className="text-muted-foreground">Error</Label>
                  <p className="text-red-600">{viewingLog.error}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <Label className="text-muted-foreground">Email Preview</Label>
                <div className="mt-2 p-4 border rounded-md bg-muted/20">
                  <p className="italic text-muted-foreground">
                    Email content preview would be displayed here in a real
                    application.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
