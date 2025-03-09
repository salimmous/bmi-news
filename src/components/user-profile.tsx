import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
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
} from "./ui/alert-dialog";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  User,
  Settings,
  History,
  Bell,
  Shield,
  LogOut,
  Mail,
  Lock,
  Save,
  Upload,
  Trash2,
  Activity,
  LineChart,
  Calendar,
  Award,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "./ui/theme-provider";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  memberSince: string;
  lastLogin: string;
  bio: string;
  profession: string;
  location: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    darkMode: boolean;
  };
  stats: {
    calculationsPerformed: number;
    reportsGenerated: number;
    lastActivity: string;
    streak: number;
  };
}

interface HistoryItem {
  id: string;
  type: string;
  date: string;
  details: any;
  saved: boolean;
}

export default function UserProfile() {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile>({
    id: "user123",
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    role: "professional",
    memberSince: "2022-06-15",
    lastLogin: "2023-08-10",
    bio: "Professional fitness coach specializing in endurance training and nutrition for athletes.",
    profession: "Fitness Coach",
    location: "San Francisco, CA",
    preferences: {
      notifications: true,
      newsletter: true,
      darkMode: theme === "dark",
    },
    stats: {
      calculationsPerformed: 145,
      reportsGenerated: 32,
      lastActivity: "2023-08-09",
      streak: 7,
    },
  });

  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "hist1",
      type: "bmi_calculation",
      date: "2023-08-09T14:30:00",
      details: {
        height: 175,
        weight: 70,
        bmi: 22.9,
        category: "Normal weight",
      },
      saved: true,
    },
    {
      id: "hist2",
      type: "sport_bmi_calculation",
      date: "2023-08-07T10:15:00",
      details: {
        height: 175,
        weight: 70,
        sport: "running",
        bmi: 22.9,
        sportSpecificCategory: "Optimal",
      },
      saved: true,
    },
    {
      id: "hist3",
      type: "professional_calculation",
      date: "2023-08-05T16:45:00",
      details: {
        height: 175,
        weight: 70,
        bodyFat: 15.2,
        bmi: 22.9,
        bmr: 1680,
        tdee: 2520,
        sport: "running",
        performanceScore: 85,
      },
      saved: true,
    },
    {
      id: "hist4",
      type: "bmi_calculation",
      date: "2023-08-02T09:20:00",
      details: {
        height: 175,
        weight: 71,
        bmi: 23.2,
        category: "Normal weight",
      },
      saved: false,
    },
    {
      id: "hist5",
      type: "professional_calculation",
      date: "2023-07-28T11:30:00",
      details: {
        height: 175,
        weight: 71,
        bodyFat: 15.5,
        bmi: 23.2,
        bmr: 1685,
        tdee: 2530,
        sport: "running",
        performanceScore: 83,
      },
      saved: true,
    },
  ]);

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    ...profile,
  });

  // Apply theme based on user preferences when component mounts
  useEffect(() => {
    // Set theme based on profile preference
    if (profile.preferences.darkMode) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [profile.preferences.darkMode, setTheme]);

  // Load user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get user ID from localStorage or session
        const userId = localStorage.getItem("userId") || "user123";

        const response = await fetch(
          `/api/get-user-profile.php?userId=${userId}`,
        );
        const data = await response.json();

        if (data.success && data.profile) {
          setProfile(data.profile);
          setEditedProfile(data.profile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchUserHistory = async () => {
      try {
        // Get user ID from localStorage or session
        const userId = localStorage.getItem("userId") || "user123";

        const response = await fetch(
          `/api/get-user-history.php?userId=${userId}`,
        );
        const data = await response.json();

        if (data.success && data.history) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error("Error fetching user history:", error);
      }
    };

    fetchUserProfile();
    fetchUserHistory();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Make API call to update profile
      const response = await fetch("/api/update-profile.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.id,
          name: editedProfile.name,
          email: editedProfile.email,
          profession: editedProfile.profession,
          location: editedProfile.location,
          bio: editedProfile.bio,
          avatar: editedProfile.avatar,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setProfile(editedProfile);
        setIsEditing(false);
        // Show success message
        alert("Profile updated successfully!");
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    // Reset error
    setPasswordError("");

    // Validate passwords
    if (!currentPassword) {
      setPasswordError("Please enter your current password");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      // Make API call to change password
      const response = await fetch("/api/change-password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.id,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordDialog(false);

        // Show success message
        alert("Password changed successfully!");
      } else {
        setPasswordError(
          data.message || "Failed to change password. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError("Failed to change password. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Make API call to delete account
      const response = await fetch("/api/delete-account.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear local storage
        localStorage.removeItem("userRole");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");

        // Show success message and redirect
        alert("Account deleted successfully. You will be logged out.");
        window.location.href = "/";
      } else {
        throw new Error(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      // Make API call to delete history item
      const response = await fetch("/api/delete-history-item.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.id,
          historyItemId: id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setHistory(history.filter((item) => item.id !== id));
      } else {
        throw new Error(data.message || "Failed to delete history item");
      }
    } catch (error) {
      console.error("Error deleting history item:", error);
      alert("Failed to delete history item. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getHistoryItemTitle = (item: HistoryItem) => {
    switch (item.type) {
      case "bmi_calculation":
        return "BMI Calculation";
      case "sport_bmi_calculation":
        return `Sport-Specific BMI (${item.details.sport})`;
      case "professional_calculation":
        return `Professional Assessment (${item.details.sport})`;
      default:
        return "Calculation";
    }
  };

  const getHistoryItemIcon = (item: HistoryItem) => {
    switch (item.type) {
      case "bmi_calculation":
        return <Activity className="h-5 w-5 text-purple-500" />;
      case "sport_bmi_calculation":
        return <Award className="h-5 w-5 text-indigo-500" />;
      case "professional_calculation":
        return <LineChart className="h-5 w-5 text-blue-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-4 py-4">
                <Avatar className="h-24 w-24 border-2 border-purple-100">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-2xl bg-purple-100 text-purple-700">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-medium text-lg">{profile.name}</h3>
                  <p className="text-sm text-gray-500">{profile.profession}</p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  Professional User
                </Badge>
              </div>

              <div className="mt-6 space-y-1">
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant={activeTab === "history" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("history")}
                >
                  <History className="mr-2 h-4 w-4" />
                  History
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant={activeTab === "security" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("security")}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(profile.memberSince).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Login</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(profile.lastLogin).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Current Streak</p>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      {profile.stats.streak} days
                    </span>
                    <div className="flex">
                      {[...Array(Math.min(7, profile.stats.streak))].map(
                        (_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-purple-500 mr-1"
                          ></div>
                        ),
                      )}
                      {[...Array(Math.max(0, 7 - profile.stats.streak))].map(
                        (_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-gray-200 mr-1"
                          ></div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">
                    {activeTab === "profile" && "User Profile"}
                    {activeTab === "history" && "Calculation History"}
                    {activeTab === "settings" && "Account Settings"}
                    {activeTab === "security" && "Security Settings"}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === "profile" &&
                      "Manage your personal information and preferences"}
                    {activeTab === "history" &&
                      "View and manage your calculation history"}
                    {activeTab === "settings" &&
                      "Update your account settings and preferences"}
                    {activeTab === "security" &&
                      "Manage your account security settings"}
                  </CardDescription>
                </div>
                {activeTab === "profile" && (
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() =>
                      isEditing ? setIsEditing(false) : setIsEditing(true)
                    }
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={editedProfile.name}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editedProfile.email}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profession">Profession</Label>
                          <Input
                            id="profession"
                            value={editedProfile.profession}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                profession: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={editedProfile.location}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                location: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          rows={4}
                          value={editedProfile.bio}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              bio: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Profile Picture</Label>
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage
                              src={editedProfile.avatar}
                              alt={editedProfile.name}
                            />
                            <AvatarFallback>
                              {editedProfile.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload New Picture
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Full Name
                          </h3>
                          <p className="mt-1">{profile.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Email Address
                          </h3>
                          <p className="mt-1">{profile.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Profession
                          </h3>
                          <p className="mt-1">{profile.profession}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Location
                          </h3>
                          <p className="mt-1">{profile.location}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Bio
                        </h3>
                        <p className="mt-1">{profile.bio}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                {isEditing && (
                  <CardFooter className="flex justify-end space-x-4 border-t px-6 py-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                )}
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-purple-800">
                          Calculations
                        </h3>
                        <Activity className="h-4 w-4 text-purple-600" />
                      </div>
                      <p className="text-3xl font-bold text-purple-700">
                        {profile.stats.calculationsPerformed}
                      </p>
                      <p className="text-sm text-purple-600 mt-1">
                        Total calculations performed
                      </p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-indigo-800">
                          Reports
                        </h3>
                        <LineChart className="h-4 w-4 text-indigo-600" />
                      </div>
                      <p className="text-3xl font-bold text-indigo-700">
                        {profile.stats.reportsGenerated}
                      </p>
                      <p className="text-sm text-indigo-600 mt-1">
                        Total reports generated
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-blue-800">
                          Streak
                        </h3>
                        <Award className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold text-blue-700">
                        {profile.stats.streak}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">Day streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Calculations</CardTitle>
                  <CardDescription>
                    View and manage your calculation history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        No History Found
                      </h3>
                      <p className="text-gray-500">
                        You haven't performed any calculations yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between">
                            <div className="flex items-start">
                              <div className="mr-4 mt-1">
                                {getHistoryItemIcon(item)}
                              </div>
                              <div>
                                <h3 className="font-medium">
                                  {getHistoryItemTitle(item)}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {formatDate(item.date)}
                                </p>

                                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
                                  {item.details.bmi && (
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        BMI
                                      </p>
                                      <p className="text-sm font-medium">
                                        {item.details.bmi}
                                      </p>
                                    </div>
                                  )}
                                  {item.details.category && (
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Category
                                      </p>
                                      <p className="text-sm font-medium">
                                        {item.details.category}
                                      </p>
                                    </div>
                                  )}
                                  {item.details.sportSpecificCategory && (
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Sport Category
                                      </p>
                                      <p className="text-sm font-medium">
                                        {item.details.sportSpecificCategory}
                                      </p>
                                    </div>
                                  )}
                                  {item.details.sport && (
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Sport
                                      </p>
                                      <p className="text-sm font-medium capitalize">
                                        {item.details.sport}
                                      </p>
                                    </div>
                                  )}
                                  {item.details.bodyFat && (
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Body Fat
                                      </p>
                                      <p className="text-sm font-medium">
                                        {item.details.bodyFat}%
                                      </p>
                                    </div>
                                  )}
                                  {item.details.bmr && (
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        BMR
                                      </p>
                                      <p className="text-sm font-medium">
                                        {item.details.bmr} kcal
                                      </p>
                                    </div>
                                  )}
                                  {item.details.tdee && (
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        TDEE
                                      </p>
                                      <p className="text-sm font-medium">
                                        {item.details.tdee} kcal
                                      </p>
                                    </div>
                                  )}
                                  {item.details.performanceScore && (
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Performance
                                      </p>
                                      <p className="text-sm font-medium">
                                        {item.details.performanceScore}/100
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeleteHistoryItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <div className="text-center">
                      <LineChart className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">
                        Progress charts will appear here as you use the
                        calculators
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">
                          Receive email notifications about your account
                        </p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="email-notifications"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={profile.preferences.notifications}
                          onChange={async (e) => {
                            const newValue = e.target.checked;
                            // Update local state
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                notifications: newValue,
                              },
                            });

                            // Save preference to database
                            try {
                              const response = await fetch(
                                "/api/update-preferences.php",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    userId: profile.id,
                                    preferences: {
                                      ...profile.preferences,
                                      notifications: newValue,
                                    },
                                  }),
                                },
                              );

                              const data = await response.json();
                              if (!data.success) {
                                console.error(
                                  "Failed to save notification preference",
                                );
                              }
                            } catch (error) {
                              console.error(
                                "Error saving notification preference:",
                                error,
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Newsletter</h3>
                        <p className="text-sm text-gray-500">
                          Receive our newsletter with fitness tips and updates
                        </p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="newsletter"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={profile.preferences.newsletter}
                          onChange={async (e) => {
                            const newValue = e.target.checked;
                            // Update local state
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                newsletter: newValue,
                              },
                            });

                            // Save preference to database
                            try {
                              const response = await fetch(
                                "/api/update-preferences.php",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    userId: profile.id,
                                    preferences: {
                                      ...profile.preferences,
                                      newsletter: newValue,
                                    },
                                  }),
                                },
                              );

                              const data = await response.json();
                              if (!data.success) {
                                console.error(
                                  "Failed to save newsletter preference",
                                );
                              }
                            } catch (error) {
                              console.error(
                                "Error saving newsletter preference:",
                                error,
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Dark Mode</h3>
                        <p className="text-sm text-gray-500">
                          Use dark theme for the application
                        </p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="dark-mode"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={profile.preferences.darkMode}
                          onChange={async (e) => {
                            const newDarkMode = e.target.checked;
                            // Update local state
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                darkMode: newDarkMode,
                              },
                            });

                            // Apply theme using theme provider
                            setTheme(newDarkMode ? "dark" : "light");

                            // Ensure DOM classes are updated
                            if (newDarkMode) {
                              document.documentElement.classList.add("dark");
                              document.documentElement.classList.remove(
                                "light",
                              );
                            } else {
                              document.documentElement.classList.remove("dark");
                              document.documentElement.classList.add("light");
                            }

                            // Save preference to database
                            try {
                              const response = await fetch(
                                "/api/update-preferences.php",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    userId: profile.id,
                                    preferences: {
                                      ...profile.preferences,
                                      darkMode: newDarkMode,
                                    },
                                  }),
                                },
                              );

                              const data = await response.json();
                              if (!data.success) {
                                console.error(
                                  "Failed to save dark mode preference",
                                );
                              }
                            } catch (error) {
                              console.error(
                                "Error saving dark mode preference:",
                                error,
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Export</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">
                    Export all your data including profile information and
                    calculation history.
                  </p>
                  <Button variant="outline">Export Data</Button>
                </CardContent>
              </Card>

              {/* Webhooks Integration */}
              {profile.role === "admin" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Webhooks Configuration</CardTitle>
                    <CardDescription>
                      Configure webhooks to integrate with external services
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="webhook-url">Webhook URL</Label>
                          <Input
                            id="webhook-url"
                            placeholder="https://example.com/webhook"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="webhook-event">Event Type</Label>
                          <Select>
                            <SelectTrigger id="webhook-event">
                              <SelectValue placeholder="Select event" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user_registration">
                                User Registration
                              </SelectItem>
                              <SelectItem value="bmi_calculation">
                                BMI Calculation
                              </SelectItem>
                              <SelectItem value="profile_update">
                                Profile Update
                              </SelectItem>
                              <SelectItem value="report_generation">
                                Report Generation
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button>Add Webhook</Button>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">
                          Active Webhooks
                        </h3>
                        <div className="border rounded-md divide-y">
                          <div className="p-3 flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                https://example.com/webhook1
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Event: User Registration
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="p-3 flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                https://example.com/webhook2
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Event: BMI Calculation
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Health Recommendations Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Health & Performance Recommendations</CardTitle>
                  <CardDescription>
                    Customize the types of recommendations you receive
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          Nutrition Recommendations
                        </h3>
                        <p className="text-sm text-gray-500">
                          Diet plans, macronutrient targets, and meal timing
                          strategies
                        </p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="nutrition-recs"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          defaultChecked={true}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          Training Recommendations
                        </h3>
                        <p className="text-sm text-gray-500">
                          Workout plans, exercise selection, and training
                          periodization
                        </p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="training-recs"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          defaultChecked={true}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          Recovery Recommendations
                        </h3>
                        <p className="text-sm text-gray-500">
                          Sleep optimization, stress management, and recovery
                          techniques
                        </p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="recovery-recs"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          defaultChecked={true}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          Mental & Emotional Recommendations
                        </h3>
                        <p className="text-sm text-gray-500">
                          Mental performance strategies and emotional wellness
                          techniques
                        </p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="mental-recs"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          defaultChecked={true}
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Label htmlFor="recommendation-frequency">
                        Recommendation Frequency
                      </Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger
                          id="recommendation-frequency"
                          className="mt-1"
                        >
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4">
                      <Label htmlFor="recommendation-detail">
                        Detail Level
                      </Label>
                      <Select defaultValue="detailed">
                        <SelectTrigger
                          id="recommendation-detail"
                          className="mt-1"
                        >
                          <SelectValue placeholder="Select detail level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                          <SelectItem value="comprehensive">
                            Comprehensive
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">
                    Update your password to maintain account security.
                  </p>
                  <Dialog
                    open={showPasswordDialog}
                    onOpenChange={setShowPasswordDialog}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Enter your current password and a new password to
                          update your credentials.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">
                            Current Password
                          </Label>
                          <Input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        {passwordError && (
                          <div className="text-sm text-red-500 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {passwordError}
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowPasswordDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handlePasswordChange}>
                          Update Password
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Current Email
                      </h3>
                      <p className="mt-1 flex items-center">
                        {profile.email}
                        <Badge
                          variant="outline"
                          className="ml-2 bg-green-50 text-green-700 border-green-200"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </p>
                    </div>
                    <Button variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Change Email Address
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delete Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <AlertDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove all of your data from
                          our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
