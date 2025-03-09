import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
import { SportSpecificBMICalculator } from "./ui/sport-specific-bmi-calculator";
import {
  Dumbbell,
  Activity,
  Heart,
  Medal,
  Calendar,
  User,
  Save,
  RefreshCw,
  Edit,
  Plus,
} from "lucide-react";

interface AthleteProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  sport: string;
  level: string;
  age: number;
  height: number;
  weight: number;
  bodyFat?: number;
  goals: string;
  achievements: string[];
  trainingSchedule: string;
  dietaryPreferences: string;
  medicalNotes: string;
  emotionalState: string;
  joinDate: string;
  bmiHistory: {
    date: string;
    bmi: number;
    weight: number;
    bodyFat?: number;
    emotionalState: string;
  }[];
}

export default function AthleteProfileComplete() {
  const [profile, setProfile] = useState<AthleteProfile>({
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    sport: "running",
    level: "professional",
    age: 28,
    height: 175,
    weight: 68,
    bodyFat: 12,
    goals: "Improve marathon time to under 2:45",
    achievements: [
      "Boston Marathon 2022 - 2:52:15",
      "New York City Marathon 2021 - 2:58:30",
      "Chicago Half Marathon 2022 - 1:18:45",
    ],
    trainingSchedule:
      "5 days/week, including 2 long runs, 2 interval sessions, and 1 recovery run",
    dietaryPreferences:
      "High carb, moderate protein, low fat. Vegetarian diet with supplements.",
    medicalNotes:
      "Previous ankle sprain (2021), fully recovered. No current injuries.",
    emotionalState: "motivated",
    joinDate: "2021-03-15",
    bmiHistory: [
      {
        date: "2023-01-15",
        bmi: 22.8,
        weight: 70,
        bodyFat: 13,
        emotionalState: "neutral",
      },
      {
        date: "2023-02-15",
        bmi: 22.5,
        weight: 69,
        bodyFat: 12.5,
        emotionalState: "motivated",
      },
      {
        date: "2023-03-15",
        bmi: 22.2,
        weight: 68,
        bodyFat: 12,
        emotionalState: "motivated",
      },
      {
        date: "2023-04-15",
        bmi: 22.0,
        weight: 67.5,
        bodyFat: 11.8,
        emotionalState: "fatigued",
      },
      {
        date: "2023-05-15",
        bmi: 21.8,
        weight: 67,
        bodyFat: 11.5,
        emotionalState: "motivated",
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [newAchievement, setNewAchievement] = useState("");

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would be an API call to save the profile
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsEditing(false);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setProfile({
        ...profile,
        achievements: [...profile.achievements, newAchievement.trim()],
      });
      setNewAchievement("");
    }
  };

  const sportOptions = [
    { value: "running", label: "Running" },
    { value: "swimming", label: "Swimming" },
    { value: "cycling", label: "Cycling" },
    { value: "weightlifting", label: "Weightlifting" },
    { value: "basketball", label: "Basketball" },
    { value: "football", label: "Football" },
    { value: "soccer", label: "Soccer" },
    { value: "tennis", label: "Tennis" },
    { value: "gymnastics", label: "Gymnastics" },
    { value: "crossfit", label: "CrossFit" },
  ];

  const levelOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "professional", label: "Professional" },
  ];

  const emotionalStateOptions = [
    { value: "motivated", label: "Motivated" },
    { value: "stressed", label: "Stressed" },
    { value: "anxious", label: "Anxious" },
    { value: "depressed", label: "Depressed" },
    { value: "fatigued", label: "Fatigued" },
    { value: "confident", label: "Confident" },
    { value: "neutral", label: "Neutral" },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Athlete Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.email}</p>

                <div className="w-full mt-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Dumbbell className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">Sport</span>
                    </div>
                    <span className="text-sm capitalize">{profile.sport}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Medal className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">Level</span>
                    </div>
                    <span className="text-sm capitalize">{profile.level}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">Age</span>
                    </div>
                    <span className="text-sm">{profile.age} years</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">Current BMI</span>
                    </div>
                    <span className="text-sm">
                      {(
                        profile.weight / Math.pow(profile.height / 100, 2)
                      ).toFixed(1)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">
                        Emotional State
                      </span>
                    </div>
                    <span className="text-sm capitalize">
                      {profile.emotionalState}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">Member Since</span>
                    </div>
                    <span className="text-sm">
                      {new Date(profile.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {profile.achievements.slice(0, 3).map((achievement, index) => (
                  <li key={index} className="text-sm">
                    <div className="flex items-start">
                      <Medal className="h-4 w-4 mr-2 mt-0.5 text-yellow-500" />
                      <span>{achievement}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setActiveTab("achievements")}
              >
                View All Achievements
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="overview">
                <User className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="bmi">
                <Activity className="h-4 w-4 mr-2" />
                BMI Analysis
              </TabsTrigger>
              <TabsTrigger value="training">
                <Dumbbell className="h-4 w-4 mr-2" />
                Training
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Medal className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Athlete Information</CardTitle>
                  <CardDescription>
                    Basic information and physical metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) =>
                              setProfile({ ...profile, name: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              setProfile({ ...profile, email: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            value={profile.age}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                age: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="sport">Primary Sport</Label>
                          <Select
                            value={profile.sport}
                            onValueChange={(value) =>
                              setProfile({ ...profile, sport: value })
                            }
                          >
                            <SelectTrigger id="sport">
                              <SelectValue placeholder="Select sport" />
                            </SelectTrigger>
                            <SelectContent>
                              {sportOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="level">Experience Level</Label>
                          <Select
                            value={profile.level}
                            onValueChange={(value) =>
                              setProfile({ ...profile, level: value })
                            }
                          >
                            <SelectTrigger id="level">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              {levelOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emotionalState">
                            Current Emotional State
                          </Label>
                          <Select
                            value={profile.emotionalState}
                            onValueChange={(value) =>
                              setProfile({ ...profile, emotionalState: value })
                            }
                          >
                            <SelectTrigger id="emotionalState">
                              <SelectValue placeholder="Select emotional state" />
                            </SelectTrigger>
                            <SelectContent>
                              {emotionalStateOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Full Name
                          </h3>
                          <p>{profile.name}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Email
                          </h3>
                          <p>{profile.email}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Age
                          </h3>
                          <p>{profile.age} years</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Primary Sport
                          </h3>
                          <p className="capitalize">{profile.sport}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Experience Level
                          </h3>
                          <p className="capitalize">{profile.level}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Current Emotional State
                          </h3>
                          <p className="capitalize">{profile.emotionalState}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Physical Metrics</CardTitle>
                  <CardDescription>
                    Current body measurements and composition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={profile.height}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              height: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          value={profile.weight}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              weight: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bodyFat">Body Fat %</Label>
                        <Input
                          id="bodyFat"
                          type="number"
                          step="0.1"
                          value={profile.bodyFat || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              bodyFat: e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Height
                        </h3>
                        <p>{profile.height} cm</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Weight
                        </h3>
                        <p>{profile.weight} kg</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Body Fat
                        </h3>
                        <p>
                          {profile.bodyFat
                            ? `${profile.bodyFat}%`
                            : "Not specified"}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          BMI
                        </h3>
                        <p>
                          {(
                            profile.weight / Math.pow(profile.height / 100, 2)
                          ).toFixed(1)}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Lean Body Mass (estimated)
                        </h3>
                        <p>
                          {profile.bodyFat
                            ? `${(profile.weight * (1 - profile.bodyFat / 100)).toFixed(1)} kg`
                            : "Not available"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Goals & Preferences</CardTitle>
                  <CardDescription>
                    Training goals and dietary information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="goals">Athletic Goals</Label>
                        <Textarea
                          id="goals"
                          value={profile.goals}
                          onChange={(e) =>
                            setProfile({ ...profile, goals: e.target.value })
                          }
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dietaryPreferences">
                          Dietary Preferences
                        </Label>
                        <Textarea
                          id="dietaryPreferences"
                          value={profile.dietaryPreferences}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              dietaryPreferences: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="medicalNotes">Medical Notes</Label>
                        <Textarea
                          id="medicalNotes"
                          value={profile.medicalNotes}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              medicalNotes: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Athletic Goals
                        </h3>
                        <p>{profile.goals}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Dietary Preferences
                        </h3>
                        <p>{profile.dietaryPreferences}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Medical Notes
                        </h3>
                        <p>{profile.medicalNotes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bmi" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>BMI Analysis</CardTitle>
                  <CardDescription>
                    Sport-specific BMI calculator and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SportSpecificBMICalculator />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>BMI History</CardTitle>
                  <CardDescription>
                    Track your BMI changes over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-3 text-left font-medium">Date</th>
                          <th className="p-3 text-left font-medium">BMI</th>
                          <th className="p-3 text-left font-medium">
                            Weight (kg)
                          </th>
                          <th className="p-3 text-left font-medium">
                            Body Fat %
                          </th>
                          <th className="p-3 text-left font-medium">
                            Emotional State
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.bmiHistory.map((entry, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3">
                              {new Date(entry.date).toLocaleDateString()}
                            </td>
                            <td className="p-3">{entry.bmi}</td>
                            <td className="p-3">{entry.weight}</td>
                            <td className="p-3">{entry.bodyFat || "N/A"}</td>
                            <td className="p-3 capitalize">
                              {entry.emotionalState}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="training" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Training Schedule</CardTitle>
                  <CardDescription>
                    Your current training program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="trainingSchedule">
                          Training Schedule
                        </Label>
                        <Textarea
                          id="trainingSchedule"
                          value={profile.trainingSchedule}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              trainingSchedule: e.target.value,
                            })
                          }
                          rows={5}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p>{profile.trainingSchedule}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sport-Specific Recommendations</CardTitle>
                  <CardDescription>
                    Training recommendations based on your sport and metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.sport === "running" && (
                      <>
                        <div className="p-4 bg-muted/30 rounded-md">
                          <h3 className="font-medium mb-2">
                            Endurance Training
                          </h3>
                          <p>
                            For marathon improvement, focus on increasing your
                            weekly mileage gradually. Include one long run per
                            week (20-22 miles) and two quality workouts (tempo
                            runs and intervals).
                          </p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-md">
                          <h3 className="font-medium mb-2">
                            Recovery Protocol
                          </h3>
                          <p>
                            Ensure proper recovery between hard sessions.
                            Consider cross-training (swimming, cycling) on
                            recovery days to maintain fitness while reducing
                            impact stress.
                          </p>
                        </div>
                      </>
                    )}

                    {profile.sport === "swimming" && (
                      <>
                        <div className="p-4 bg-muted/30 rounded-md">
                          <h3 className="font-medium mb-2">Technique Focus</h3>
                          <p>
                            Dedicate at least 30% of your training time to
                            technique drills. Consider video analysis sessions
                            monthly to identify and correct form issues.
                          </p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-md">
                          <h3 className="font-medium mb-2">
                            Strength Training
                          </h3>
                          <p>
                            Incorporate 2-3 strength sessions weekly focusing on
                            core, shoulders, and lats to improve power and
                            prevent injuries.
                          </p>
                        </div>
                      </>
                    )}

                    {profile.sport === "weightlifting" && (
                      <>
                        <div className="p-4 bg-muted/30 rounded-md">
                          <h3 className="font-medium mb-2">Periodization</h3>
                          <p>
                            Follow a structured periodization plan with distinct
                            hypertrophy, strength, and peaking phases to
                            maximize performance and prevent plateaus.
                          </p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-md">
                          <h3 className="font-medium mb-2">Nutrition Timing</h3>
                          <p>
                            Optimize protein intake (1.6-2.2g/kg bodyweight)
                            with strategic timing around workouts. Consider carb
                            cycling based on training intensity.
                          </p>
                        </div>
                      </>
                    )}

                    {profile.sport !== "running" &&
                      profile.sport !== "swimming" &&
                      profile.sport !== "weightlifting" && (
                        <div className="p-4 bg-muted/30 rounded-md">
                          <h3 className="font-medium mb-2">
                            General Recommendations
                          </h3>
                          <p>
                            Based on your profile as a {profile.level}{" "}
                            {profile.sport} athlete, focus on sport-specific
                            skills training combined with appropriate
                            conditioning work. Consider working with a
                            specialized coach to develop a more detailed
                            training plan.
                          </p>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Achievements & Milestones</CardTitle>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveTab("achievements")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Achievement
                      </Button>
                    )}
                  </div>
                  <CardDescription>
                    Track your athletic accomplishments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          value={newAchievement}
                          onChange={(e) => setNewAchievement(e.target.value)}
                          placeholder="Enter new achievement"
                        />
                        <Button onClick={handleAddAchievement}>Add</Button>
                      </div>

                      <ul className="space-y-2 mt-4">
                        {profile.achievements.map((achievement, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center p-2 border rounded-md"
                          >
                            <div className="flex items-start">
                              <Medal className="h-4 w-4 mr-2 mt-0.5 text-yellow-500" />
                              <span>{achievement}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setProfile({
                                  ...profile,
                                  achievements: profile.achievements.filter(
                                    (_, i) => i !== index,
                                  ),
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {profile.achievements.map((achievement, index) => (
                        <li
                          key={index}
                          className="flex items-start p-3 border rounded-md"
                        >
                          <Medal className="h-5 w-5 mr-3 mt-0.5 text-yellow-500" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
