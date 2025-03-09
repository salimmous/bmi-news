import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Search, RefreshCw, Download, Trash2, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  templateName: string;
  status: "sent" | "failed" | "pending";
  sentAt: string;
  error?: string;
}

export default function EmailLogs() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  // Load email logs from localStorage for demo purposes
  // In a real app, this would come from your backend API
  useEffect(() => {
    const loadLogs = () => {
      setIsLoading(true);
      try {
        const savedLogs = localStorage.getItem("emailLogs");
        if (savedLogs) {
          setLogs(JSON.parse(savedLogs));
        } else {
          // Generate demo data if no logs exist
          generateDemoLogs();
        }
      } catch (error) {
        console.error("Error loading email logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, []);

  const generateDemoLogs = () => {
    const demoLogs: EmailLog[] = [];
    const templates = ["Welcome Email", "Weekly Progress Report", "New Meal Plan Recommendation"];
    const subjects = [
      "Welcome to BMI Tracker!",
      "Your Weekly BMI Progress Report",
      "Your Personalized Meal Plan is Ready",
    ];
    const statuses: ("sent" | "failed" | "pending")[] = ["sent", "failed", "pending"];
    const recipients = [
      "john.doe@example.com",
      "jane.smith@example.com",
      "robert.johnson@example.com",
      "emily.wilson@example.com",
      "michael.brown@example.com",
    ];

    // Generate 50 random logs for demo purposes
    for (let i = 0; i < 50; i++) {
      const templateIndex = Math.floor(Math.random() * templates.length);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const recipient = recipients[Math.floor(Math.random() * recipients.length)];
      
      // Generate a random date within the last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      demoLogs.push({
        id: `log-${i + 1}`,
        recipient,
        subject: subjects[templateIndex],
        templateName: templates[templateIndex],
        status,
        sentAt: date.toISOString(),
        error: status === "failed" ? "SMTP connection error" : undefined,
      });
    }

    // Sort by date, newest first
    demoLogs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    
    setLogs(demoLogs);
    localStorage.setItem("emailLogs", JSON.stringify(demoLogs));
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      generateDemoLogs();
      setIsLoading(false);
    }, 1000);
  };

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to clear all email logs? This action cannot be undone.")) {
      setLogs([]);
      localStorage.removeItem("emailLogs");
    }
  };

  const handleExportLogs = () => {
    const csvContent = [
      ["ID", "Recipient", "Subject", "Template", "Status", "Sent At", "Error"].join(","),
      ...filteredLogs.map(log => [
        log.id,
        log.recipient,
        `"${log.subject.replace(/"/g, '""')}"`,
        log.templateName,
        log.status,
        new Date(log.sentAt).toLocaleString(),
        log.error ? `"${log.error.replace(/"/g, '""')}"` : ""
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `email-logs-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logs based on search term and filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.templateName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const logDate = new Date(log.sentAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (dateFilter === "today") {
        matchesDate = logDate.toDateString() === today.toDateString();
      } else if (dateFilter === "yesterday") {
        matchesDate = logDate.toDateString() === yesterday.toDateString();
      } else if (dateFilter === "last7days") {
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        matchesDate = logDate >= last7Days;
      } else if (dateFilter === "last30days") {
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        matchesDate = logDate >= last30Days;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (status: "sent" | "failed" | "pending") => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-500">Sent</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Logs</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" onClick={handleClearLogs} className="text-red-500 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Clear</span>
          </Button>
        </div>
      </div>

      <Card className="relative">
        <CardHeader>
          <CardTitle>Email Delivery Logs</CardTitle>
          <CardDescription>
            Track all emails sent to users through the system
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by recipient, subject or template..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="last7days">Last 7 Days</SelectItem>
                    <SelectItem value="last30days">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No email logs found. {logs.length > 0 ? "Try adjusting your filters." : ""}
            </div>
          ) : (
            <div className="border rounded-md">
              <Table className="w-full">
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
                  {currentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.recipient}</TableCell>
                      <TableCell>{log.subject}</TableCell>
                      <TableCell>{log.templateName}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>{formatDate(log.sentAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setSearchTerm(log.recipient)}
                            >
                              Filter by this recipient
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setStatusFilter(log.status)}
                            >
                              Filter by this status
                            </DropdownMenuItem>
                            {log.status === "failed" && log.error ? (
