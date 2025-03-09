import { useState, useEffect } from "react";
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
import { ProfessionalBMICalculator } from "./ui/professional-bmi-calculator";
import { Dumbbell, Activity, Heart, Medal, Calendar, User, Save, RefreshCw } from "lucide-react";

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
}

export default function AthleteProfile() {
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
      "Chicago Half Marathon 2022 - 1:18:45"
    ],
    trainingSchedule: "5 days/week, including 2 long runs, 2 interval sessions, and 1 recovery run",
    dietaryPreferences: "High carb, moderate protein, low fat. Vegetarian diet with supplements.",
    medicalNotes: "Previous ankle sprain (2021), fully recovered. No current injuries.",
    emotionalState: "motivated",
    joinDate: "2021-03-15"
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would be an API call to save the profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsEditing(false);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    } finally {
      setIsSaving(false);
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
    { value: "stressed", label: "