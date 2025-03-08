import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Bell, Calendar, Clock, Plus, Trash2, Edit, Save, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "reminder" | "announcement" | "achievement" | "system";
  schedule: {
    type: "immediate" | "scheduled" | "recurring";
    date?: string;
    time?: string;
    days?: string[];
    frequency?: "daily" | "weekly" | "monthly";
  };
  audience: {
    type: "all" | "specific" | "filtered";
    userIds?: string[];
    filters?: {
      bmiRange?: [number, number];
      inactiveFor?: number;
      registeredAfter?: string;
    };
  };
  channels: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  status: "draft" | "scheduled" | "sent" | "cancelled";
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
}

export default function NotificationManager() {
  const [activeTab, setActiveTab] = useState("scheduled");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAddingNotification, setIsAddingNotification] = useState(false);
  const [isEditingNotification, setIsEditingNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    emailEnabled: true,
    pushEnabled: true,
    inAppEnabled: true,
    reminderFrequency: "weekly",
    digestEnabled: true,
    digestDay: "monday",
  });

  // Load notifications from localStorage for demo purposes
  // In a real app, this would come from your backend API
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error("Error parsing saved notifications:", error);
      }
    } else {
      // Set some demo notifications
      const demoNotifications: Notification[] = [
        {
          id: "1",
          title: "Weekly BMI Check-in Reminder",
          message: "It's time for your weekly BMI check-in! Track your progress to stay on top of your health goals.",
          type: "reminder",
          schedule: {
            type: "recurring",
            days: ["monday"],
            time: "09:00",
            frequency: "weekly",
          },
          audience: {
            type: "all",
          },
          channels: {
            email: true,
            push: true,
            inApp: true,
          },
          status: "scheduled",
          createdAt: "2023-06-01T10:00:00Z",
          updatedAt: "2023-06-01T10:00:00Z",
        },
        {
          id: "2",
          title: "New Feature Announcement",
          message: "We've added a new feature to help you track your nutrition alongside your BMI. Check it out in your dashboard!",
          type: "announcement",
          schedule: {
            type: "scheduled",
            date: "2023-07-15",
            time: "12:00",
          },
          audience: {
            type: "all",
          },
          channels: {
            email: true,
            push: true,
            inApp: true,
          },
          status: "scheduled",
          createdAt: "2023-06-10T14:30:00Z",
          updatedAt: "2023-06-10T14:30:00Z",
        },
        {
          id: "3",
          title: "Inactivity Reminder",
          message: "We noticed you haven't logged your BMI in over 2 weeks. Keep tracking to maintain your progress!",
          type: "reminder",
          schedule: {
            type: "immediate",
          },
          audience: {
            type: "filtered",
            filters: {
              inactiveFor: 14,
            },
          },
          channels: {
            email: true,
            push: false,
            inApp: true,
          },
          status: "sent",
          createdAt: "2023-06-05T08:15:00Z",
          updatedAt: "2023-06-05T08:15:00Z",
          sentAt: "2023-06-05T08:20:00Z",
        },
      ];
      setNotifications(demoNotifications);
      localStorage.setItem("notifications", JSON.stringify(demoNotifications));
    }

    // Load global settings
    const savedSettings = localStorage.getItem("notificationSettings");
    if (savedSettings) {
      try {
        setGlobalSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error parsing saved notification settings:", error);
      }
    }
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would be an API call to save the settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem("notificationSettings", JSON.stringify(globalSettings));
      alert("Notification settings saved successfully");
    } catch (error) {
      console.error("Error saving notification settings:", error);
      alert("Failed to save notification settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNotification = () => {
    if (!currentNotification) return;

    const newNotification = {
      ...currentNotification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    setIsAddingNotification(false);
    setCurrentNotification(null);
  };

  const handleEditNotification = () => {
    if (!currentNotification) return;

    const updatedNotification = {
      ...currentNotification,
      updatedAt: new Date().toISOString(),
    };

    const updatedNotifications = notifications.map(notification =>
      notification.id === currentNotification.id ? updatedNotification : notification
    );

    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    setIsEditingNotification(false);
    setCurrentNotification(null);
  };

  const handleDeleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const initNewNotification = () => {
    setCurrentNotification({
      id: "",
      title: "",
      message: "",
      type: "reminder",
      schedule: {
        type: "immediate",
      },
      audience: {
        type: "all",
      },
      channels: {
        email: true,
        push: true,
        inApp: true,
      },
      status: "draft",
      createdAt: "",
      updatedAt: "",
    });
    setIsAddingNotification(true);
  };

  const initEditNotification = (notification: Notification) => {
    setCurrentNotification({ ...notification });
    setIsEditingNotification(true);
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "scheduled":
        return notifications.filter(n => n.status === "scheduled");
      case "sent":
        return notifications.filter(n => n.status === "sent");
      case "drafts":
        return notifications.filter(n => n.status === "draft");
      default:
        return notifications;
    }
  };

  const getScheduleText = (notification: Notification) => {
    const { schedule } = notification;
    
    if (schedule.type === "immediate") {
      return "Send immediately";
    } else if (schedule.type === "scheduled" && schedule.date) {
      return `${schedule.date} at ${schedule.time || "00:00"}`;
    } else if (schedule.type === "recurring") {
      const days = schedule.days?.join(", ") || "";
      const frequency = schedule.frequency || "";
      return `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} on ${days} at ${schedule.time || "00:00"}`;
    }
    
    return "Not scheduled";
  };

  const getAudienceText = (notification: Notification) => {
    const { audience } = notification;
    
    if (audience.type === "all") {
      return "All users";
    } else if (audience.type === "specific" && audience.userIds) {
      return `${audience.userIds.length} specific users`;
    } else if (audience.type === "filtered" && audience.filters) {
      const filters = [];
      
      if (audience.filters.bmiRange) {
        filters.push(`BMI ${audience.filters.bmiRange[0]}-${audience.filters.bmiRange[1]}`);
      }
      
      if (audience.filters.inactiveFor) {
        filters.push(`Inactive for ${audience.filters.inactiveFor} days`);
      }
      
      if (audience.filters.registeredAfter) {
        filters.push(`Registered after ${audience.filters.registeredAfter}`);
      }
      
      return filters.join(", ") || "Filtered users";
    }
    
    return "Unknown audience";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notification Management</h2>
        <Dialog open={isAddingNotification} onOpenChange={setIsAddingNotification}>
          <DialogTrigger asChild>
            <Button onClick={initNewNotification}>
              <Plus className="mr-2 h-4 w-4" />
              Create Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Notification</DialogTitle>
              <DialogDescription>
                Create a new notification to send to your users
              </DialogDescription>
            </DialogHeader>
            {currentNotification && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Notification Title</Label>
                  <Input
                    id="title"
                    value={currentNotification.title}
                    onChange={(e) => setCurrentNotification({
                      ...currentNotification,
                      title: e.target.value,
                    })}
                    placeholder="Enter notification title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Notification Message</Label>
                  <Textarea
                    id="message"
                    value={currentNotification.message}
                    onChange={(e) => setCurrentNotification({
                      ...currentNotification,
                      message: e.target.value,
                    })}
                    placeholder="Enter notification message"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Notification Type</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={currentNotification.type}
                    onChange={(e) => setCurrentNotification({
                      ...currentNotification,
                      type: e.target.value as any,
                    })}
                  >
                    <option value="reminder">Reminder</option>
                    <option value="announcement">Announcement</option>
                    <option value="achievement">Achievement</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduleType">Schedule</Label>
                  <select
                    id="scheduleType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={currentNotification.schedule.type}
                    onChange={(e) => setCurrentNotification({
                      ...currentNotification,
                      schedule: { ...currentNotification.schedule, type: e.target.value as any },
                    })}
                  >
                    <option value="immediate">Send Immediately</option>
                    <option value="scheduled">Schedule for Later</option>
                    <option value="recurring">Recurring</option>
                  </select>
                </div>

                {currentNotification.schedule.type === "scheduled" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduleDate">Date</Label>
                      <Input
                        id="scheduleDate"
                        type="date"
                        value={currentNotification.schedule.date || ""}
                        onChange={(e) => setCurrentNotification({
                          ...currentNotification,
                          schedule: { ...currentNotification.schedule, date: e.target.value },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduleTime">Time</Label>
                      <Input
                        id="scheduleTime"
                        type="time"
                        value={currentNotification.schedule.time || ""}
                        onChange={(e) => setCurrentNotification({
                          ...currentNotification,
                          schedule: { ...currentNotification.schedule, time: e.target.value },
                        })}
                      />
                    </div>
                  </div>
                )}

                {currentNotification.schedule.type === "recurring" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <select
                        id="frequency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={currentNotification.schedule.frequency || "weekly"}
                        onChange={(e) => setCurrentNotification({
                          ...currentNotification,
                          schedule: { ...currentNotification.schedule, frequency: e.target.value as any },
                        })}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    {currentNotification.schedule.frequency === "weekly" && (
                      <div className="space-y-2">
                        <Label>Days of Week</Label>
                        <div className="grid grid-cols-7 gap-2">
                          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                            <div key={day} className="flex flex-col items-center">
                              <input
                                type="checkbox"
                                id={`day-${day}`}
                                checked={currentNotification.schedule.days?.includes(day) || false}
                                onChange={(e) => {
                                  const days = currentNotification.schedule.days || [];
                                  if (e.target.checked) {
                                    setCurrentNotification({
                                      ...currentNotification,
                                      schedule: {
                                        ...currentNotification.schedule,
                                        days: [...days, day],
                                      },
                                    });
                                  } else {
                                    setCurrentNotification({
                                      ...currentNotification,
                                      schedule: {
                                        ...currentNotification.schedule,
                                        days: days.filter(d => d !== day),
                                      },
                                    });
                                  }
                                }}
                                className="h-4 w-4"
                              />
                              <Label htmlFor={`day-${day}`} className="text-xs mt-1">
                                {day.charAt(0).toUpperCase()}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="recurringTime">Time</Label>
                      <Input
                        id="recurringTime"
                        type="time"
                        value={currentNotification.schedule.time || ""}
                        onChange={(e) => setCurrentNotification({
                          ...currentNotification,
                          schedule: { ...currentNotification.schedule, time: e.target.value },
                        })}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="audienceType">Audience</Label>
                  <select
                    id="audienceType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible: