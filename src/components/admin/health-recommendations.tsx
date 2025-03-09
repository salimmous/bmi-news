import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
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
  Utensils,
  Dumbbell,
  Mail,
  Settings,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Clipboard,
} from "lucide-react";

interface MealPlan {
  id: string;
  name: string;
  description: string;
  dietType: string;
  calorieRange: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  fitnessLevel: string;
  goal: string;
  sessionsPerWeek: number;
  sessions: {
    day: string;
    focus: string;
    exercises: string[];
  }[];
  cardio: string;
}

interface ApiConfig {
  nutritionApiKey: string;
  nutritionApiEndpoint: string;
  fitnessApiKey: string;
  fitnessApiEndpoint: string;
}

interface SmtpConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

interface Recommendation {
  id: string;
  category: string;
  bmiRange: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export function HealthRecommendations() {
  const [activeTab, setActiveTab] = useState("meal-plans");
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    nutritionApiKey: "",
    nutritionApiEndpoint: "https://api.nutrition.example.com/v1",
    fitnessApiKey: "",
    fitnessApiEndpoint: "https://api.fitness.example.com/v1",
  });
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>({
    host: "smtp.example.com",
    port: 587,
    username: "",
    password: "",
    fromEmail: "health@bmitracker.com",
    fromName: "BMI Tracker Health Team",
  });
  const [isAddingMealPlan, setIsAddingMealPlan] = useState(false);
  const [isAddingWorkoutPlan, setIsAddingWorkoutPlan] = useState(false);
  const [isEditingMealPlan, setIsEditingMealPlan] = useState(false);
  const [isEditingWorkoutPlan, setIsEditingWorkoutPlan] = useState(false);
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [currentWorkoutPlan, setCurrentWorkoutPlan] =
    useState<WorkoutPlan | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [testEmailStatus, setTestEmailStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [isAddingRecommendation, setIsAddingRecommendation] = useState(false);
  const [isEditingRecommendation, setIsEditingRecommendation] = useState(false);
  const [editingRecommendation, setEditingRecommendation] =
    useState<Recommendation | null>(null);
  const [newRecommendation, setNewRecommendation] = useState<
    Omit<Recommendation, "id">
  >({
    category: "normal",
    bmiRange: "18.5 - 24.9",
    title: "",
    description: "",
    priority: "medium",
  });

  // Load mock data
  useEffect(() => {
    // Mock meal plans
    const mockMealPlans: MealPlan[] = [
      {
        id: "1",
        name: "Weight Loss Balanced Plan",
        description: "A balanced meal plan for healthy weight loss",
        dietType: "Balanced",
        calorieRange: "1500-1800",
        meals: {
          breakfast: "Oatmeal with berries and Greek yogurt",
          lunch: "Grilled chicken salad with olive oil dressing",
          dinner: "Baked salmon with roasted vegetables",
          snacks: "Apple with almond butter, Greek yogurt",
        },
        macros: {
          protein: 30,
          carbs: 40,
          fat: 30,
        },
      },
      {
        id: "2",
        name: "High Protein Muscle Gain",
        description: "High protein plan for muscle building",
        dietType: "High Protein",
        calorieRange: "2500-3000",
        meals: {
          breakfast: "Protein pancakes with banana and honey",
          lunch: "Chicken breast with brown rice and vegetables",
          dinner: "Lean steak with sweet potato and broccoli",
          snacks: "Protein shake, nuts, cottage cheese",
        },
        macros: {
          protein: 40,
          carbs: 40,
          fat: 20,
        },
      },
      {
        id: "3",
        name: "Keto Weight Loss",
        description: "Low carb, high fat ketogenic diet",
        dietType: "Keto",
        calorieRange: "1600-2000",
        meals: {
          breakfast: "Eggs with avocado and bacon",
          lunch: "Tuna salad with olive oil and leafy greens",
          dinner: "Beef stir-fry with low-carb vegetables",
          snacks: "Cheese, nuts, and olives",
        },
        macros: {
          protein: 25,
          carbs: 5,
          fat: 70,
        },
      },
    ];

    // Mock workout plans
    const mockWorkoutPlans: WorkoutPlan[] = [
      {
        id: "1",
        name: "Beginner Full Body",
        description: "Full body workout for beginners",
        fitnessLevel: "Beginner",
        goal: "General Fitness",
        sessionsPerWeek: 3,
        sessions: [
          {
            day: "Day 1",
            focus: "Full Body",
            exercises: [
              "Squats: 3 sets of 10 reps",
              "Push-ups: 3 sets of 10 reps",
              "Dumbbell rows: 3 sets of 10 reps per arm",
              "Lunges: 3 sets of 10 reps per leg",
              "Plank: 3 sets of 30 seconds",
            ],
          },
          {
            day: "Day 2",
            focus: "Full Body",
            exercises: [
              "Deadlifts: 3 sets of 10 reps",
              "Bench press: 3 sets of 10 reps",
              "Lat pulldowns: 3 sets of 10 reps",
              "Shoulder press: 3 sets of 10 reps",
              "Russian twists: 3 sets of 20 reps",
            ],
          },
          {
            day: "Day 3",
            focus: "Full Body",
            exercises: [
              "Leg press: 3 sets of 12 reps",
              "Incline push-ups: 3 sets of 10 reps",
              "Cable rows: 3 sets of 12 reps",
              "Lateral raises: 3 sets of 12 reps",
              "Bicycle crunches: 3 sets of 20 reps",
            ],
          },
        ],
        cardio:
          "20 minutes of moderate intensity cardio after each strength session",
      },
      {
        id: "2",
        name: "Intermediate Split",
        description: "Upper/lower split for intermediate lifters",
        fitnessLevel: "Intermediate",
        goal: "Muscle Gain",
        sessionsPerWeek: 4,
        sessions: [
          {
            day: "Day 1",
            focus: "Upper Body",
            exercises: [
              "Bench press: 4 sets of 8-10 reps",
              "Rows: 4 sets of 8-10 reps",
              "Shoulder press: 3 sets of 8-10 reps",
              "Bicep curls: 3 sets of 10-12 reps",
              "Tricep extensions: 3 sets of 10-12 reps",
            ],
          },
          {
            day: "Day 2",
            focus: "Lower Body",
            exercises: [
              "Squats: 4 sets of 8-10 reps",
              "Romanian deadlifts: 4 sets of 8-10 reps",
              "Leg press: 3 sets of 10-12 reps",
              "Leg curls: 3 sets of 10-12 reps",
              "Calf raises: 3 sets of 15-20 reps",
            ],
          },
          {
            day: "Day 3",
            focus: "Upper Body",
            exercises: [
              "Incline press: 4 sets of 8-10 reps",
              "Pull-ups: 4 sets of 8-10 reps",
              "Lateral raises: 3 sets of 10-12 reps",
              "Hammer curls: 3 sets of 10-12 reps",
              "Skull crushers: 3 sets of 10-12 reps",
            ],
          },
          {
            day: "Day 4",
            focus: "Lower Body",
            exercises: [
              "Front squats: 4 sets of 8-10 reps",
              "Deadlifts: 4 sets of 6-8 reps",
              "Walking lunges: 3 sets of 10 steps each leg",
              "Leg extensions: 3 sets of 12-15 reps",
              "Seated calf raises: 3 sets of 15-20 reps",
            ],
          },
        ],
        cardio: "20-30 minutes of HIIT 2 times per week",
      },
      {
        id: "3",
        name: "Advanced PPL",
        description: "Push/Pull/Legs split for advanced lifters",
        fitnessLevel: "Advanced",
        goal: "Strength and Hypertrophy",
        sessionsPerWeek: 6,
        sessions: [
          {
            day: "Day 1",
            focus: "Push",
            exercises: [
              "Bench press: 5 sets of 5 reps",
              "Overhead press: 4 sets of 6-8 reps",
              "Incline dumbbell press: 3 sets of 8-10 reps",
              "Lateral raises: 3 sets of 10-12 reps",
              "Tricep pushdowns: 3 sets of 10-12 reps",
            ],
          },
          {
            day: "Day 2",
            focus: "Pull",
            exercises: [
              "Deadlifts: 5 sets of 5 reps",
              "Pull-ups: 4 sets of 8-10 reps",
              "Barbell rows: 4 sets of 8-10 reps",
              "Face pulls: 3 sets of 12-15 reps",
              "Bicep curls: 3 sets of 10-12 reps",
            ],
          },
          {
            day: "Day 3",
            focus: "Legs",
            exercises: [
              "Squats: 5 sets of 5 reps",
              "Romanian deadlifts: 4 sets of 8-10 reps",
              "Leg press: 3 sets of 10-12 reps",
              "Leg curls: 3 sets of 10-12 reps",
              "Calf raises: 4 sets of 15-20 reps",
            ],
          },
          {
            day: "Day 4",
            focus: "Push",
            exercises: [
              "Incline bench press: 5 sets of 5 reps",
              "Dumbbell shoulder press: 4 sets of 6-8 reps",
              "Cable flyes: 3 sets of 10-12 reps",
              "Upright rows: 3 sets of 10-12 reps",
              "Overhead tricep extensions: 3 sets of 10-12 reps",
            ],
          },
          {
            day: "Day 5",
            focus: "Pull",
            exercises: [
              "Weighted pull-ups: 4 sets of 6-8 reps",
              "T-bar rows: 4 sets of 8-10 reps",
              "Lat pulldowns: 3 sets of 10-12 reps",
              "Rear delt flyes: 3 sets of 12-15 reps",
              "Hammer curls: 3 sets of 10-12 reps",
            ],
          },
          {
            day: "Day 6",
            focus: "Legs",
            exercises: [
              "Front squats: 5 sets of 5 reps",
              "Hack squats: 4 sets of 8-10 reps",
              "Walking lunges: 3 sets of 10 steps each leg",
              "Leg extensions: 3 sets of 12-15 reps",
              "Standing calf raises: 4 sets of 15-20 reps",
            ],
          },
        ],
        cardio: "15-20 minutes of HIIT 2-3 times per week",
      },
    ];

    // Mock recommendations
    const mockRecommendations: Recommendation[] = [
      {
        id: "1",
        category: "underweight",
        bmiRange: "< 18.5",
        title: "Increase Caloric Intake",
        description:
          "Focus on nutrient-dense foods to gain weight in a healthy way. Include protein-rich foods, healthy fats, and complex carbohydrates in your diet.",
        priority: "high",
      },
      {
        id: "2",
        category: "underweight",
        bmiRange: "< 18.5",
        title: "Strength Training",
        description:
          "Incorporate resistance training to build muscle mass. Aim for 2-3 sessions per week focusing on major muscle groups.",
        priority: "medium",
      },
      {
        id: "3",
        category: "normal",
        bmiRange: "18.5 - 24.9",
        title: "Maintain Balanced Diet",
        description:
          "Continue with a balanced diet rich in fruits, vegetables, lean proteins, and whole grains to maintain your healthy weight.",
        priority: "medium",
      },
      {
        id: "4",
        category: "normal",
        bmiRange: "18.5 - 24.9",
        title: "Regular Physical Activity",
        description:
          "Maintain at least 150 minutes of moderate-intensity exercise per week to support overall health and weight maintenance.",
        priority: "medium",
      },
      {
        id: "5",
        category: "overweight",
        bmiRange: "25 - 29.9",
        title: "Caloric Deficit",
        description:
          "Create a moderate caloric deficit through diet and exercise. Aim for 500-750 fewer calories per day to lose 0.5-1 kg per week.",
        priority: "high",
      },
      {
        id: "6",
        category: "overweight",
        bmiRange: "25 - 29.9",
        title: "Increase Physical Activity",
        description:
          "Aim for 150-300 minutes of moderate-intensity exercise per week, combining cardio and strength training for optimal results.",
        priority: "high",
      },
      {
        id: "7",
        category: "obese",
        bmiRange: ">= 30",
        title: "Medical Consultation",
        description:
          "Consult with healthcare providers for a comprehensive weight management plan. They can provide personalized advice and monitor health markers.",
        priority: "high",
      },
      {
        id: "8",
        category: "obese",
        bmiRange: ">= 30",
        title: "Gradual Lifestyle Changes",
        description:
          "Focus on sustainable lifestyle changes rather than quick fixes. Start with small, achievable goals to build momentum.",
        priority: "high",
      },
    ];

    setMealPlans(mockMealPlans);
    setWorkoutPlans(mockWorkoutPlans);
    setRecommendations(mockRecommendations);
  }, []);

  const handleSyncWithApi = async () => {
    setIsSyncing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, you would make API calls to fetch data
      // For example:
      /*
      const nutritionResponse = await fetch(`${apiConfig.nutritionApiEndpoint}/meal-plans`, {
        headers: {
          'Authorization': `Bearer ${apiConfig.nutritionApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!nutritionResponse.ok) {
        throw new Error('Failed to fetch nutrition data');
      }
      
      const nutritionData = await nutritionResponse.json();
      setMealPlans(nutritionData);
      
      const fitnessResponse = await fetch(`${apiConfig.fitnessApiEndpoint}/workout-plans`, {
        headers: {
          'Authorization': `Bearer ${apiConfig.fitnessApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!fitnessResponse.ok) {
        throw new Error('Failed to fetch fitness data');
      }
      
      const fitnessData = await fitnessResponse.json();
      setWorkoutPlans(fitnessData);
      */

      // For now, just show a success message
      alert("Successfully synchronized with external APIs");
    } catch (error) {
      console.error("Error syncing with API:", error);
      alert("Failed to sync with external APIs");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveApiConfig = () => {
    setIsSavingConfig(true);
    // Simulate saving
    setTimeout(() => {
      setIsSavingConfig(false);
      alert("API configuration saved successfully");
    }, 1000);
  };

  const handleSaveSmtpConfig = () => {
    setIsSavingConfig(true);
    // Simulate saving
    setTimeout(() => {
      setIsSavingConfig(false);
      alert("SMTP configuration saved successfully");
    }, 1000);
  };

  const handleTestSmtp = () => {
    if (!testEmailAddress) {
      alert("Please enter a test email address");
      return;
    }

    setIsTestingSmtp(true);
    setTestEmailStatus("idle");

    // Simulate sending test email
    setTimeout(() => {
      setIsTestingSmtp(false);
      setTestEmailStatus("success");
      // In a real implementation, you would make an API call to send a test email
    }, 2000);
  };

  const handleAddMealPlan = () => {
    if (!currentMealPlan) return;

    const newMealPlan = {
      ...currentMealPlan,
      id: Date.now().toString(),
    };

    setMealPlans([...mealPlans, newMealPlan]);
    setIsAddingMealPlan(false);
    setCurrentMealPlan(null);
  };

  const handleEditMealPlan = () => {
    if (!currentMealPlan) return;

    const updatedMealPlans = mealPlans.map((plan) =>
      plan.id === currentMealPlan.id ? currentMealPlan : plan,
    );

    setMealPlans(updatedMealPlans);
    setIsEditingMealPlan(false);
    setCurrentMealPlan(null);
  };

  const handleDeleteMealPlan = (id: string) => {
    setMealPlans(mealPlans.filter((plan) => plan.id !== id));
  };

  const handleAddWorkoutPlan = () => {
    if (!currentWorkoutPlan) return;

    const newWorkoutPlan = {
      ...currentWorkoutPlan,
      id: Date.now().toString(),
    };

    setWorkoutPlans([...workoutPlans, newWorkoutPlan]);
    setIsAddingWorkoutPlan(false);
    setCurrentWorkoutPlan(null);
  };

  const handleEditWorkoutPlan = () => {
    if (!currentWorkoutPlan) return;

    const updatedWorkoutPlans = workoutPlans.map((plan) =>
      plan.id === currentWorkoutPlan.id ? currentWorkoutPlan : plan,
    );

    setWorkoutPlans(updatedWorkoutPlans);
    setIsEditingWorkoutPlan(false);
    setCurrentWorkoutPlan(null);
  };

  const handleDeleteWorkoutPlan = (id: string) => {
    setWorkoutPlans(workoutPlans.filter((plan) => plan.id !== id));
  };

  const handleAddRecommendation = () => {
    const recommendation: Recommendation = {
      id: Math.random().toString(36).substring(2, 9),
      ...newRecommendation,
    };

    setRecommendations([...recommendations, recommendation]);
    setNewRecommendation({
      category: "normal",
      bmiRange: "18.5 - 24.9",
      title: "",
      description: "",
      priority: "medium",
    });
    setIsAddingRecommendation(false);
  };

  const handleEditRecommendation = () => {
    if (!editingRecommendation) return;

    setRecommendations(
      recommendations.map((rec) =>
        rec.id === editingRecommendation.id ? editingRecommendation : rec,
      ),
    );

    setIsEditingRecommendation(false);
    setEditingRecommendation(null);
  };

  const handleDeleteRecommendation = (id: string) => {
    setRecommendations(recommendations.filter((rec) => rec.id !== id));
  };

  const getCategoryBmiRange = (category: string): string => {
    switch (category) {
      case "underweight":
        return "< 18.5";
      case "normal":
        return "18.5 - 24.9";
      case "overweight":
        return "25 - 29.9";
      case "obese":
        return ">= 30";
      default:
        return "";
    }
  };

  const handleCategoryChange = (category: string, target: "new" | "edit") => {
    const bmiRange = getCategoryBmiRange(category);

    if (target === "new") {
      setNewRecommendation({ ...newRecommendation, category, bmiRange });
    } else if (editingRecommendation) {
      setEditingRecommendation({
        ...editingRecommendation,
        category,
        bmiRange,
      });
    }
  };

  const initNewMealPlan = () => {
    setCurrentMealPlan({
      id: "",
      name: "",
      description: "",
      dietType: "Balanced",
      calorieRange: "",
      meals: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snacks: "",
      },
      macros: {
        protein: 30,
        carbs: 40,
        fat: 30,
      },
    });
    setIsAddingMealPlan(true);
  };

  const initEditMealPlan = (plan: MealPlan) => {
    setCurrentMealPlan({ ...plan });
    setIsEditingMealPlan(true);
  };

  const initNewWorkoutPlan = () => {
    setCurrentWorkoutPlan({
      id: "",
      name: "",
      description: "",
      fitnessLevel: "Beginner",
      goal: "",
      sessionsPerWeek: 3,
      sessions: [
        {
          day: "Day 1",
          focus: "Full Body",
          exercises: [
            "Exercise 1: 3 sets of 10 reps",
            "Exercise 2: 3 sets of 10 reps",
          ],
        },
      ],
      cardio: "",
    });
    setIsAddingWorkoutPlan(true);
  };

  const initEditWorkoutPlan = (plan: WorkoutPlan) => {
    setCurrentWorkoutPlan({ ...plan });
    setIsEditingWorkoutPlan(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Health Recommendations</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleSyncWithApi}
            disabled={isSyncing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Syncing..." : "Sync with APIs"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations" className="flex items-center">
            <Clipboard className="mr-2 h-4 w-4" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="meal-plans" className="flex items-center">
            <Utensils className="mr-2 h-4 w-4" />
            Meal Plans
          </TabsTrigger>
          <TabsTrigger value="workout-plans" className="flex items-center">
            <Dumbbell className="mr-2 h-4 w-4" />
            Workout Plans
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Manage Health Recommendations
            </h3>
            <Dialog
              open={isAddingRecommendation}
              onOpenChange={setIsAddingRecommendation}
            >
              <DialogTrigger asChild>
                <Button onClick={() => setIsAddingRecommendation(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Recommendation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Recommendation</DialogTitle>
                  <DialogDescription>
                    Create a new health recommendation for users.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">BMI Category</Label>
                    <Select
                      value={newRecommendation.category}
                      onValueChange={(value) =>
                        handleCategoryChange(value, "new")
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="underweight">Underweight</SelectItem>
                        <SelectItem value="normal">Normal Weight</SelectItem>
                        <SelectItem value="overweight">Overweight</SelectItem>
                        <SelectItem value="obese">Obese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Recommendation Title</Label>
                    <Input
                      id="title"
                      value={newRecommendation.title}
                      onChange={(e) =>
                        setNewRecommendation({
                          ...newRecommendation,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={newRecommendation.description}
                      onChange={(e) =>
                        setNewRecommendation({
                          ...newRecommendation,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newRecommendation.priority}
                      onValueChange={(value: "high" | "medium" | "low") =>
                        setNewRecommendation({
                          ...newRecommendation,
                          priority: value,
                        })
                      }
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingRecommendation(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddRecommendation}>
                    Add Recommendation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Recommendation Dialog */}
            <Dialog
              open={isEditingRecommendation}
              onOpenChange={setIsEditingRecommendation}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Recommendation</DialogTitle>
                  <DialogDescription>
                    Update health recommendation details.
                  </DialogDescription>
                </DialogHeader>
                {editingRecommendation && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">BMI Category</Label>
                      <Select
                        value={editingRecommendation.category}
                        onValueChange={(value) =>
                          handleCategoryChange(value, "edit")
                        }
                      >
                        <SelectTrigger id="edit-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="underweight">
                            Underweight
                          </SelectItem>
                          <SelectItem value="normal">Normal Weight</SelectItem>
                          <SelectItem value="overweight">Overweight</SelectItem>
                          <SelectItem value="obese">Obese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Recommendation Title</Label>
                      <Input
                        id="edit-title"
                        value={editingRecommendation.title}
                        onChange={(e) =>
                          setEditingRecommendation({
                            ...editingRecommendation,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        rows={4}
                        value={editingRecommendation.description}
                        onChange={(e) =>
                          setEditingRecommendation({
                            ...editingRecommendation,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-priority">Priority</Label>
                      <Select
                        value={editingRecommendation.priority}
                        onValueChange={(value: "high" | "medium" | "low") =>
                          setEditingRecommendation({
                            ...editingRecommendation,
                            priority: value,
                          })
                        }
                      >
                        <SelectTrigger id="edit-priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingRecommendation(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleEditRecommendation}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>BMI Range</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No recommendations found
                    </TableCell>
                  </TableRow>
                ) : (
                  recommendations.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell className="capitalize">
                        {rec.category}
                      </TableCell>
                      <TableCell>{rec.bmiRange}</TableCell>
                      <TableCell className="font-medium">{rec.title}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {rec.description}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rec.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : rec.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {rec.priority}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingRecommendation(rec);
                            setIsEditingRecommendation(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRecommendation(rec.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Meal Plans Tab */}
        <TabsContent value="meal-plans" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Manage Meal Plans</h3>
            <Dialog open={isAddingMealPlan} onOpenChange={setIsAddingMealPlan}>
              <DialogTrigger asChild>
                <Button onClick={initNewMealPlan}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Meal Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Meal Plan</DialogTitle>
                  <DialogDescription>
                    Create a new meal plan for users based on their dietary
                    preferences.
                  </DialogDescription>
                </DialogHeader>
                {currentMealPlan && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Plan Name</Label>
                        <Input
                          id="name"
                          value={currentMealPlan.name}
                          onChange={(e) =>
                            setCurrentMealPlan({
                              ...currentMealPlan,
                              name: e.target.value,
                            })
                          }
                          placeholder="e.g., Weight Loss Plan"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dietType">Diet Type</Label>
                        <Select
                          value={currentMealPlan.dietType}
                          onValueChange={(value) =>
                            setCurrentMealPlan({
                              ...currentMealPlan,
                              dietType: value,
                            })
                          }
                        >
                          <SelectTrigger id="dietType">
                            <SelectValue placeholder="Select diet type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Balanced">Balanced</SelectItem>
                            <SelectItem value="High Protein">
                              High Protein
                            </SelectItem>
                            <SelectItem value="Keto">Keto</SelectItem>
                            <SelectItem value="Vegan">Vegan</SelectItem>
                            <SelectItem value="Vegetarian">
                              Vegetarian
                            </SelectItem>
                            <SelectItem value="Mediterranean">
                              Mediterranean
                            </SelectItem>
                            <SelectItem value="Low Carb">Low Carb</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={currentMealPlan.description}
                        onChange={(e) =>
                          setCurrentMealPlan({
                            ...currentMealPlan,
                            description: e.target.value,
                          })
                        }
                        placeholder="Brief description of the meal plan"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="calorieRange">Calorie Range</Label>
                      <Input
                        id="calorieRange"
                        value={currentMealPlan.calorieRange}
                        onChange={(e) =>
                          setCurrentMealPlan({
                            ...currentMealPlan,
                            calorieRange: e.target.value,
                          })
                        }
                        placeholder="e.g., 1500-1800"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="protein">Protein (%)</Label>
                        <Input
                          id="protein"
                          type="number"
                          value={currentMealPlan.macros.protein}
                          onChange={(e) =>
                            setCurrentMealPlan({
                              ...currentMealPlan,
                              macros: {
                                ...currentMealPlan.macros,
                                protein: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="carbs">Carbs (%)</Label>
                        <Input
                          id="carbs"
                          type="number"
                          value={currentMealPlan.macros.carbs}
                          onChange={(e) =>
                            setCurrentMealPlan({
                              ...currentMealPlan,
                              macros: {
                                ...currentMealPlan.macros,
                                carbs: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fat">Fat (%)</Label>
                        <Input
                          id="fat"
                          type="number"
                          value={currentMealPlan.macros.fat}
                          onChange={(e) =>
                            setCurrentMealPlan({
                              ...currentMealPlan,
                              macros: {
                                ...currentMealPlan.macros,
                                fat: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="breakfast">Breakfast</Label>
                      <Textarea
                        id="breakfast"
                        value={currentMealPlan.meals.breakfast}
                        onChange={(e) =>
                          setCurrentMealPlan({
                            ...currentMealPlan,
                            meals: {
                              ...currentMealPlan.meals,
                              breakfast: e.target.value,
                            },
                          })
                        }
                        placeholder="Breakfast meal description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lunch">Lunch</Label>
                      <Textarea
                        id="lunch"
                        value={currentMealPlan.meals.lunch}
                        onChange={(e) =>
                          setCurrentMealPlan({
                            ...currentMealPlan,
                            meals: {
                              ...currentMealPlan.meals,
                              lunch: e.target.value,
                            },
                          })
                        }
                        placeholder="Lunch meal description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dinner">Dinner</Label>
                      <Textarea
                        id="dinner"
                        value={currentMealPlan.meals.dinner}
                        onChange={(e) =>
                          setCurrentMealPlan({
                            ...currentMealPlan,
                            meals: {
                              ...currentMealPlan.meals,
                              dinner: e.target.value,
                            },
                          })
                        }
                        placeholder="Dinner meal description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="snacks">Snacks</Label>
                      <Textarea
                        id="snacks"
                        value={currentMealPlan.meals.snacks}
                        onChange={(e) =>
                          setCurrentMealPlan({
                            ...currentMealPlan,
                            meals: {
                              ...currentMealPlan.meals,
                              snacks: e.target.value,
                            },
                          })
                        }
                        placeholder="Snacks description"
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingMealPlan(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddMealPlan}>Add Meal Plan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Meal Plan Dialog */}
            <Dialog
              open={isEditingMealPlan}
              onOpenChange={setIsEditingMealPlan}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Meal Plan</DialogTitle>
                  <DialogDescription>
                    Update the meal plan details.
                  </DialogDescription>
                </DialogHeader>
                {currentMealPlan && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Plan Name</Label>
                        <Input
                          id="edit-name"
                          value={currentMealPlan.name}
                          onChange={(e) =>
                            setCurrentMealPlan({
                              ...currentMealPlan,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-dietType">Diet Type</Label>
                        <Select
                          value={currentMealPlan.dietType}
                          onValueChange={(value) =>
                            setCurrentMealPlan({
                              ...currentMealPlan,
                              dietType: value,
                            })
                          }
                        >
                          <SelectTrigger id="edit-dietType">
                            <SelectValue placeholder="Select diet type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Balanced">Balanced</SelectItem>
                            <SelectItem value="High Protein">
                              High Protein
                            </SelectItem>
                            <SelectItem value="Keto">Keto</SelectItem>
                            <SelectItem value="Vegan">Vegan</SelectItem>
                            <SelectItem value="Vegetarian">
                              Vegetarian
                            </SelectItem>
                            <SelectItem value="Mediterranean">
                              Mediterranean
                            </SelectItem>
                            <SelectItem value="Low Carb">Low Carb</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Same fields as Add dialog */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={currentMealPlan.description}
                        onChange={(e) =>
                          setCurrentMealPlan({
                            ...currentMealPlan,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-calorieRange">Calorie Range</Label>
                      <Input
                        id="edit-calorieRange"
                        value={currentMealPlan.calorieRange}
                        onChange={(e) =>
                          setCurrentMealPlan({
                            ...currentMealPlan,
                            calorieRange: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-protein">Protein (%)</Label>
                        <Input
                          id="edit-protein"
                          type="number"
                          value={currentMealPlan.macros.protein}
                          onChange={(e) =>
                            setCurrentMealPlan({
                              ...currentMealPlan,
                              macros: {
                                ...currentMealPlan.macros,
                                protein: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-carbs">Carbs (%)</Label>
                        <Input
                          id="edit-carbs"
                          type="number"
                          value={currentMealPlan.macros.carbs}
                          onChange={(e) =>
                            setCurrentMealPlan({
                              ...currentMealPlan,
                              macros: {
                                ...currentMealPlan.macros,
                                carbs: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-fat">Fat (%)</Label>
                        <Input
                          id="edit-fat"
                          type="number"
                          value={currentMealPlan.macros.fat}
                          onChange={(e) =>
                            setCurrentMealPlan({
                              ...currentMealPlan,
                              macros: {
                                ...currentMealPlan.macros,
                                fat: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-breakfast">Breakfast</Label>
                      <Textarea
                        id="edit-breakfast"
                        value={currentMealPlan.meals.breakfast}
                        onChange={(e) =>
                          setCurrentMealPlan({
                            ...currentMealPlan,
                            meals: {
                              ...currentMealPlan.meals,
                              breakfast: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-lunch">Lunch</Label>
                      <Textarea
                        id="edit-lunch"
                        value={currentMealPlan.meals.lunch}
                        onChange={(e) =>
                          setCurrentMealPlan({
                            ...currentMealPlan,
                            meals: {
                              ...currentMealPlan.meals,
                              lunch: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-dinner">Dinner</Label>
                      <Textarea
                        id="edit-dinner"
                        value={currentMealPlan.meals.dinner}
                        onChange={(e) =>
                          setCurrentMealPlan({
                            ...currentMealPlan,
                            meals: {
                              ...currentMealPlan.meals,
                              dinner: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-snacks">Snacks</Label>
                      <Textarea
                        id="edit-snacks"
                        value={currentMealPlan.meals.snacks}
                        onChange={(e) =>
                          setCurrentMealPlan({
                            ...currentMealPlan,
                            meals: {
                              ...currentMealPlan.meals,
                              snacks: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingMealPlan(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleEditMealPlan}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Diet Type</TableHead>
                  <TableHead>Calorie Range</TableHead>
                  <TableHead>Macros (P/C/F)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mealPlans.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No meal plans found. Add your first meal plan.
                    </TableCell>
                  </TableRow>
                ) : (
                  mealPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.dietType}</TableCell>
                      <TableCell>{plan.calorieRange}</TableCell>
                      <TableCell>
                        {plan.macros.protein}% / {plan.macros.carbs}% /{" "}
                        {plan.macros.fat}%
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => initEditMealPlan(plan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMealPlan(plan.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Workout Plans Tab */}
        <TabsContent value="workout-plans" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Manage Workout Plans</h3>
            <Dialog
              open={isAddingWorkoutPlan}
              onOpenChange={setIsAddingWorkoutPlan}
            >
              <DialogTrigger asChild>
                <Button onClick={initNewWorkoutPlan}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Workout Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Workout Plan</DialogTitle>
                  <DialogDescription>
                    Create a new workout plan for users based on their fitness
                    level and goals.
                  </DialogDescription>
                </DialogHeader>
                {currentWorkoutPlan && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="workout-name">Plan Name</Label>
                        <Input
                          id="workout-name"
                          value={currentWorkoutPlan.name}
                          onChange={(e) =>
                            setCurrentWorkoutPlan({
                              ...currentWorkoutPlan,
                              name: e.target.value,
                            })
                          }
                          placeholder="e.g., Beginner Full Body"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fitnessLevel">Fitness Level</Label>
                        <Select
                          value={currentWorkoutPlan.fitnessLevel}
                          onValueChange={(value) =>
                            setCurrentWorkoutPlan({
                              ...currentWorkoutPlan,
                              fitnessLevel: value,
                            })
                          }
                        >
                          <SelectTrigger id="fitnessLevel">
                            <SelectValue placeholder="Select fitness level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="workout-description">Description</Label>
                      <Textarea
                        id="workout-description"
                        value={currentWorkoutPlan.description}
                        onChange={(e) =>
                          setCurrentWorkoutPlan({
                            ...currentWorkoutPlan,
                            description: e.target.value,
                          })
                        }
                        placeholder="Brief description of the workout plan"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="goal">Fitness Goal</Label>
                        <Input
                          id="goal"
                          value={currentWorkoutPlan.goal}
                          onChange={(e) =>
                            setCurrentWorkoutPlan({
                              ...currentWorkoutPlan,
                              goal: e.target.value,
                            })
                          }
                          placeholder="e.g., Weight Loss, Muscle Gain"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sessionsPerWeek">
                          Sessions Per Week
                        </Label>
                        <Input
                          id="sessionsPerWeek"
                          type="number"
                          value={currentWorkoutPlan.sessionsPerWeek}
                          onChange={(e) =>
                            setCurrentWorkoutPlan({
                              ...currentWorkoutPlan,
                              sessionsPerWeek: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardio">Cardio Recommendation</Label>
                      <Textarea
                        id="cardio"
                        value={currentWorkoutPlan.cardio}
                        onChange={(e) =>
                          setCurrentWorkoutPlan({
                            ...currentWorkoutPlan,
                            cardio: e.target.value,
                          })
                        }
                        placeholder="Cardio recommendations"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Workout Sessions</Label>
                      {currentWorkoutPlan.sessions.map(
                        (session, sessionIndex) => (
                          <div
                            key={sessionIndex}
                            className="border p-4 rounded-md space-y-4 mt-2"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`day-${sessionIndex}`}>
                                  Day
                                </Label>
                                <Input
                                  id={`day-${sessionIndex}`}
                                  value={session.day}
                                  onChange={(e) => {
                                    const updatedSessions = [
                                      ...currentWorkoutPlan.sessions,
                                    ];
                                    updatedSessions[sessionIndex] = {
                                      ...updatedSessions[sessionIndex],
                                      day: e.target.value,
                                    };
                                    setCurrentWorkoutPlan({
                                      ...currentWorkoutPlan,
                                      sessions: updatedSessions,
                                    });
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`focus-${sessionIndex}`}>
                                  Focus
                                </Label>
                                <Input
                                  id={`focus-${sessionIndex}`}
                                  value={session.focus}
                                  onChange={(e) => {
                                    const updatedSessions = [
                                      ...currentWorkoutPlan.sessions,
                                    ];
                                    updatedSessions[sessionIndex] = {
                                      ...updatedSessions[sessionIndex],
                                      focus: e.target.value,
                                    };
                                    setCurrentWorkoutPlan({
                                      ...currentWorkoutPlan,
                                      sessions: updatedSessions,
                                    });
                                  }}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Exercises</Label>
                              {session.exercises.map(
                                (exercise, exerciseIndex) => (
                                  <div
                                    key={exerciseIndex}
                                    className="flex items-center space-x-2"
                                  >
                                    <Input
                                      value={exercise}
                                      onChange={(e) => {
                                        const updatedSessions = [
                                          ...currentWorkoutPlan.sessions,
                                        ];
                                        const updatedExercises = [
                                          ...updatedSessions[sessionIndex]
                                            .exercises,
                                        ];
                                        updatedExercises[exerciseIndex] =
                                          e.target.value;
                                        updatedSessions[sessionIndex] = {
                                          ...updatedSessions[sessionIndex],
                                          exercises: updatedExercises,
                                        };
                                        setCurrentWorkoutPlan({
                                          ...currentWorkoutPlan,
                                          sessions: updatedSessions,
                                        });
                                      }}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      type="button"
                                      onClick={() => {
                                        const updatedSessions = [
                                          ...currentWorkoutPlan.sessions,
                                        ];
                                        const updatedExercises = [
                                          ...updatedSessions[sessionIndex]
                                            .exercises,
                                        ];
                                        updatedExercises.splice(
                                          exerciseIndex,
                                          1,
                                        );
                                        updatedSessions[sessionIndex] = {
                                          ...updatedSessions[sessionIndex],
                                          exercises: updatedExercises,
                                        };
                                        setCurrentWorkoutPlan({
                                          ...currentWorkoutPlan,
                                          sessions: updatedSessions,
                                        });
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                ),
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => {
                                  const updatedSessions = [
                                    ...currentWorkoutPlan.sessions,
                                  ];
                                  updatedSessions[sessionIndex] = {
                                    ...updatedSessions[sessionIndex],
                                    exercises: [
                                      ...updatedSessions[sessionIndex]
                                        .exercises,
                                      "New exercise: 3 sets of 10 reps",
                                    ],
                                  };
                                  setCurrentWorkoutPlan({
                                    ...currentWorkoutPlan,
                                    sessions: updatedSessions,
                                  });
                                }}
                              >
                                Add Exercise
                              </Button>
                            </div>

                            {currentWorkoutPlan.sessions.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  const updatedSessions = [
                                    ...currentWorkoutPlan.sessions,
                                  ];
                                  updatedSessions.splice(sessionIndex, 1);
                                  setCurrentWorkoutPlan({
                                    ...currentWorkoutPlan,
                                    sessions: updatedSessions,
                                  });
                                }}
                              >
                                Remove Session
                              </Button>
                            )}
                          </div>
                        ),
                      )}
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setCurrentWorkoutPlan({
                            ...currentWorkoutPlan,
                            sessions: [
                              ...currentWorkoutPlan.sessions,
                              {
                                day: `Day ${currentWorkoutPlan.sessions.length + 1}`,
                                focus: "Full Body",
                                exercises: ["Exercise 1: 3 sets of 10 reps"],
                              },
                            ],
                          });
                        }}
                      >
                        Add Workout Session
                      </Button>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingWorkoutPlan(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddWorkoutPlan}>
                    Add Workout Plan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Workout Plan Dialog */}
            <Dialog
              open={isEditingWorkoutPlan}
              onOpenChange={setIsEditingWorkoutPlan}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Workout Plan</DialogTitle>
                  <DialogDescription>
                    Update the workout plan details.
                  </DialogDescription>
                </DialogHeader>
                {currentWorkoutPlan && (
                  <div className="grid gap-4 py-4">
                    {/* Same fields as Add dialog */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-workout-name">Plan Name</Label>
                        <Input
                          id="edit-workout-name"
                          value={currentWorkoutPlan.name}
                          onChange={(e) =>
                            setCurrentWorkoutPlan({
                              ...currentWorkoutPlan,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-fitnessLevel">Fitness Level</Label>
                        <Select
                          value={currentWorkoutPlan.fitnessLevel}
                          onValueChange={(value) =>
                            setCurrentWorkoutPlan({
                              ...currentWorkoutPlan,
                              fitnessLevel: value,
                            })
                          }
                        >
                          <SelectTrigger id="edit-fitnessLevel">
                            <SelectValue placeholder="Select fitness level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-workout-description">
                        Description
                      </Label>
                      <Textarea
                        id="edit-workout-description"
                        value={currentWorkoutPlan.description}
                        onChange={(e) =>
                          setCurrentWorkoutPlan({
                            ...currentWorkoutPlan,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-goal">Fitness Goal</Label>
                        <Input
                          id="edit-goal"
                          value={currentWorkoutPlan.goal}
                          onChange={(e) =>
                            setCurrentWorkoutPlan({
                              ...currentWorkoutPlan,
                              goal: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-sessionsPerWeek">
                          Sessions Per Week
                        </Label>
                        <Input
                          id="edit-sessionsPerWeek"
                          type="number"
                          value={currentWorkoutPlan.sessionsPerWeek}
                          onChange={(e) =>
                            setCurrentWorkoutPlan({
                              ...currentWorkoutPlan,
                              sessionsPerWeek: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-cardio">Cardio Recommendation</Label>
                      <Textarea
                        id="edit-cardio"
                        value={currentWorkoutPlan.cardio}
                        onChange={(e) =>
                          setCurrentWorkoutPlan({
                            ...currentWorkoutPlan,
                            cardio: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Workout Sessions</Label>
                      {currentWorkoutPlan.sessions.map(
                        (session, sessionIndex) => (
                          <div
                            key={sessionIndex}
                            className="border p-4 rounded-md space-y-4 mt-2"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`edit-day-${sessionIndex}`}>
                                  Day
                                </Label>
                                <Input
                                  id={`edit-day-${sessionIndex}`}
                                  value={session.day}
                                  onChange={(e) => {
                                    const updatedSessions = [
                                      ...currentWorkoutPlan.sessions,
                                    ];
                                    updatedSessions[sessionIndex] = {
                                      ...updatedSessions[sessionIndex],
                                      day: e.target.value,
                                    };
                                    setCurrentWorkoutPlan({
                                      ...currentWorkoutPlan,
                                      sessions: updatedSessions,
                                    });
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edit-focus-${sessionIndex}`}>
                                  Focus
                                </Label>
                                <Input
                                  id={`edit-focus-${sessionIndex}`}
                                  value={session.focus}
                                  onChange={(e) => {
                                    const updatedSessions = [
                                      ...currentWorkoutPlan.sessions,
                                    ];
                                    updatedSessions[sessionIndex] = {
                                      ...updatedSessions[sessionIndex],
                                      focus: e.target.value,
                                    };
                                    setCurrentWorkoutPlan({
                                      ...currentWorkoutPlan,
                                      sessions: updatedSessions,
                                    });
                                  }}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Exercises</Label>
                              {session.exercises.map(
                                (exercise, exerciseIndex) => (
                                  <div
                                    key={exerciseIndex}
                                    className="flex items-center space-x-2"
                                  >
                                    <Input
                                      value={exercise}
                                      onChange={(e) => {
                                        const updatedSessions = [
                                          ...currentWorkoutPlan.sessions,
                                        ];
                                        const updatedExercises = [
                                          ...updatedSessions[sessionIndex]
                                            .exercises,
                                        ];
                                        updatedExercises[exerciseIndex] =
                                          e.target.value;
                                        updatedSessions[sessionIndex] = {
                                          ...updatedSessions[sessionIndex],
                                          exercises: updatedExercises,
                                        };
                                        setCurrentWorkoutPlan({
                                          ...currentWorkoutPlan,
                                          sessions: updatedSessions,
                                        });
                                      }}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      type="button"
                                      onClick={() => {
                                        const updatedSessions = [
                                          ...currentWorkoutPlan.sessions,
                                        ];
                                        const updatedExercises = [
                                          ...updatedSessions[sessionIndex]
                                            .exercises,
                                        ];
                                        updatedExercises.splice(
                                          exerciseIndex,
                                          1,
                                        );
                                        updatedSessions[sessionIndex] = {
                                          ...updatedSessions[sessionIndex],
                                          exercises: updatedExercises,
                                        };
                                        setCurrentWorkoutPlan({
                                          ...currentWorkoutPlan,
                                          sessions: updatedSessions,
                                        });
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                ),
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => {
                                  const updatedSessions = [
                                    ...currentWorkoutPlan.sessions,
                                  ];
                                  updatedSessions[sessionIndex] = {
                                    ...updatedSessions[sessionIndex],
                                    exercises: [
                                      ...updatedSessions[sessionIndex]
                                        .exercises,
                                      "New exercise: 3 sets of 10 reps",
                                    ],
                                  };
                                  setCurrentWorkoutPlan({
                                    ...currentWorkoutPlan,
                                    sessions: updatedSessions,
                                  });
                                }}
                              >
                                Add Exercise
                              </Button>
                            </div>

                            {currentWorkoutPlan.sessions.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  const updatedSessions = [
                                    ...currentWorkoutPlan.sessions,
                                  ];
                                  updatedSessions.splice(sessionIndex, 1);
                                  setCurrentWorkoutPlan({
                                    ...currentWorkoutPlan,
                                    sessions: updatedSessions,
                                  });
                                }}
                              >
                                Remove Session
                              </Button>
                            )}
                          </div>
                        ),
                      )}
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setCurrentWorkoutPlan({
                            ...currentWorkoutPlan,
                            sessions: [
                              ...currentWorkoutPlan.sessions,
                              {
                                day: `Day ${currentWorkoutPlan.sessions.length + 1}`,
                                focus: "Full Body",
                                exercises: ["Exercise 1: 3 sets of 10 reps"],
                              },
                            ],
                          });
                        }}
                      >
                        Add Workout Session
                      </Button>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingWorkoutPlan(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleEditWorkoutPlan}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Fitness Level</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Sessions/Week</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workoutPlans.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No workout plans found. Add your first workout plan.
                    </TableCell>
                  </TableRow>
                ) : (
                  workoutPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.fitnessLevel}</TableCell>
                      <TableCell>{plan.goal}</TableCell>
                      <TableCell>{plan.sessionsPerWeek}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => initEditWorkoutPlan(plan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteWorkoutPlan(plan.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                API Integrations
              </CardTitle>
              <CardDescription>
                Connect to external nutrition and fitness APIs for enhanced
                recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Nutrition API</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nutritionApiKey">API Key</Label>
                    <Input
                      id="nutritionApiKey"
                      type="password"
                      value={apiConfig.nutritionApiKey}
                      onChange={(e) =>
                        setApiConfig({
                          ...apiConfig,
                          nutritionApiKey: e.target.value,
                        })
                      }
                      placeholder="Enter your nutrition API key"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nutritionApiEndpoint">API Endpoint</Label>
                    <Input
                      id="nutritionApiEndpoint"
                      value={apiConfig.nutritionApiEndpoint}
                      onChange={(e) =>
                        setApiConfig({
                          ...apiConfig,
                          nutritionApiEndpoint: e.target.value,
                        })
                      }
                      placeholder="https://api.nutrition.example.com/v1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Fitness API</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fitnessApiKey">API Key</Label>
                    <Input
                      id="fitnessApiKey"
                      type="password"
                      value={apiConfig.fitnessApiKey}
                      onChange={(e) =>
                        setApiConfig({
                          ...apiConfig,
                          fitnessApiKey: e.target.value,
                        })
                      }
                      placeholder="Enter your fitness API key"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fitnessApiEndpoint">API Endpoint</Label>
                    <Input
                      id="fitnessApiEndpoint"
                      value={apiConfig.fitnessApiEndpoint}
                      onChange={(e) =>
                        setApiConfig({
                          ...apiConfig,
                          fitnessApiEndpoint: e.target.value,
                        })
                      }
                      placeholder="https://api.fitness.example.com/v1"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveApiConfig} disabled={isSavingConfig}>
                {isSavingConfig ? "Saving..." : "Save API Configuration"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                SMTP Configuration
              </CardTitle>
              <CardDescription>
                Configure email settings for sending health recommendations to
                users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={smtpConfig.host}
                    onChange={(e) =>
                      setSmtpConfig({ ...smtpConfig, host: e.target.value })
                    }
                    placeholder="smtp.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={smtpConfig.port}
                    onChange={(e) =>
                      setSmtpConfig({
                        ...smtpConfig,
                        port: parseInt(e.target.value) || 587,
                      })
                    }
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={smtpConfig.username}
                    onChange={(e) =>
                      setSmtpConfig({ ...smtpConfig, username: e.target.value })
                    }
                    placeholder="username@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={smtpConfig.password}
                    onChange={(e) =>
                      setSmtpConfig({ ...smtpConfig, password: e.target.value })
                    }
                    placeholder="Enter your SMTP password"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    value={smtpConfig.fromEmail}
                    onChange={(e) =>
                      setSmtpConfig({
                        ...smtpConfig,
                        fromEmail: e.target.value,
                      })
                    }
                    placeholder="health@bmitracker.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={smtpConfig.fromName}
                    onChange={(e) =>
                      setSmtpConfig({ ...smtpConfig, fromName: e.target.value })
                    }
                    placeholder="BMI Tracker Health Team"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleSaveSmtpConfig}
                  disabled={isSavingConfig}
                >
                  {isSavingConfig ? "Saving..." : "Save SMTP Configuration"}
                </Button>

                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-semibold mb-2">
                    Test Email Configuration
                  </h4>
                  <div className="flex items-end space-x-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="testEmail">Test Email Address</Label>
                      <Input
                        id="testEmail"
                        value={testEmailAddress}
                        onChange={(e) => setTestEmailAddress(e.target.value)}
                        placeholder="Enter email address for testing"
                      />
                    </div>
                    <Button onClick={handleTestSmtp} disabled={isTestingSmtp}>
                      {isTestingSmtp ? "Sending..." : "Send Test Email"}
                    </Button>
                  </div>
                  {testEmailStatus === "success" && (
                    <p className="text-sm text-green-600 mt-2">
                      Test email sent successfully!
                    </p>
                  )}
                  {testEmailStatus === "error" && (
                    <p className="text-sm text-red-600 mt-2">
                      Failed to send test email. Please check your SMTP
                      configuration.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
