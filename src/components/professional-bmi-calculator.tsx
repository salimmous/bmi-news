import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
import {
  Calculator,
  Scale,
  Ruler,
  Activity,
  Utensils,
  Moon,
  User,
  Phone,
  Mail,
  Calendar,
  Heart,
  Clock,
  Dumbbell,
  ChevronRight,
  ChevronLeft,
  BarChart4,
  FileText,
  Clipboard,
  Download,
  Target,
  Save,
} from "lucide-react";
import { Progress } from "./ui/progress";

interface ProfessionalBMICalculatorProps {
  onCalculate?: (
    bmi: number,
    weight: number,
    height: number,
    userData: UserData,
    metrics: HealthMetrics,
  ) => void;
  standalone?: boolean;
}

interface UserData {
  id?: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  fitnessGoal: string;
  caloriesPerDay: number;
  dietPreference: string;
  activityLevel: string;
  gymSessionsPerWeek: number;
  timeInGym: number;
  hoursOfSleep: number;
}

interface HealthMetrics {
  id?: number;
  userId?: number;
  date?: string;
  bmi: number;
  weight: number;
  height: number;
  bodyFatPercentage: number;
  bmr: number;
  tdee: number;
  idealWeight: {
    min: number;
    max: number;
  };
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  waterIntake: number;
  vo2Max?: number;
}

export function ProfessionalBMICalculator({
  onCalculate = () => {},
  standalone = false,
}: ProfessionalBMICalculatorProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [formProgress, setFormProgress] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Initialize with user's previous data if available
  const initializeFromLocalStorage = () => {
    try {
      const savedRecords = localStorage.getItem("bmiRecords");
      if (savedRecords) {
        const records = JSON.parse(savedRecords);
        if (records.length > 0) {
          const latestRecord = records[0];
          return {
            weight: latestRecord.weight,
            height: latestRecord.height,
          };
        }
      }
      return { weight: 70, height: 170 };
    } catch (error) {
      console.error("Error loading previous data:", error);
      return { weight: 70, height: 170 };
    }
  };

  const initialData = initializeFromLocalStorage();
  const [weight, setWeight] = useState<number>(initialData.weight);
  const [height, setHeight] = useState<number>(initialData.height);
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    age: 30,
    gender: "Male",
    fitnessGoal: "Weight Loss",
    caloriesPerDay: 2000,
    dietPreference: "Balanced",
    activityLevel: "Moderate",
    gymSessionsPerWeek: 3,
    timeInGym: 1,
    hoursOfSleep: 7,
  });

  useEffect(() => {
    // Update progress based on active tab
    switch (activeTab) {
      case "personal":
        setFormProgress(25);
        break;
      case "physical":
        setFormProgress(50);
        break;
      case "lifestyle":
        setFormProgress(75);
        break;
      case "results":
        setFormProgress(100);
        break;
      default:
        setFormProgress(25);
    }
  }, [activeTab]);

  const handleInputChange = (field: keyof UserData, value: any) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateMetrics = async () => {
    setIsLoading(true);

    try {
      // Calculate BMI
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      const roundedBmi = parseFloat(bmiValue.toFixed(1));

      // Calculate ideal weight range (BMI between 18.5 and 24.9)
      const minIdealWeight = 18.5 * (heightInMeters * heightInMeters);
      const maxIdealWeight = 24.9 * (heightInMeters * heightInMeters);

      // Estimate body fat percentage using BMI and age
      const genderMultiplier = userData.gender === "Male" ? 1 : 0;
      const estimatedBodyFat =
        1.2 * roundedBmi + 0.23 * userData.age - 10.8 * genderMultiplier - 5.4;
      const bodyFatPercentage = parseFloat(
        Math.max(estimatedBodyFat, 3).toFixed(1),
      );

      // Calculate BMR using Mifflin-St Jeor Equation
      let bmr = 0;
      if (userData.gender === "Male") {
        bmr = 10 * weight + 6.25 * height - 5 * userData.age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * userData.age - 161;
      }

      // Apply activity multiplier for TDEE
      let activityMultiplier = 1.2; // Sedentary
      switch (userData.activityLevel) {
        case "Sedentary":
          activityMultiplier = 1.2;
          break;
        case "Lightly Active":
          activityMultiplier = 1.375;
          break;
        case "Moderate":
          activityMultiplier = 1.55;
          break;
        case "Very Active":
          activityMultiplier = 1.725;
          break;
        case "Extra Active":
          activityMultiplier = 1.9;
          break;
      }

      const tdee = Math.round(bmr * activityMultiplier);

      // Calculate macros based on fitness goal
      let proteinPerKg = 1.6; // default
      let fatPercentage = 0.3; // default

      switch (userData.fitnessGoal) {
        case "Weight Loss":
          proteinPerKg = 1.8;
          fatPercentage = 0.25;
          break;
        case "Muscle Gain":
          proteinPerKg = 2.2;
          fatPercentage = 0.3;
          break;
        case "Maintenance":
          proteinPerKg = 1.6;
          fatPercentage = 0.3;
          break;
      }

      // Adjust TDEE based on goal
      let adjustedTdee = tdee;
      if (userData.fitnessGoal === "Weight Loss") {
        adjustedTdee = tdee - 500;
      } else if (userData.fitnessGoal === "Muscle Gain") {
        adjustedTdee = tdee + 300;
      }

      // Calculate macros
      const proteinGrams = Math.round(weight * proteinPerKg);
      const proteinCalories = proteinGrams * 4;

      const fatGrams = Math.round((adjustedTdee * fatPercentage) / 9);
      const fatCalories = fatGrams * 9;

      const remainingCalories = adjustedTdee - proteinCalories - fatCalories;
      const carbGrams = Math.round(remainingCalories / 4);

      // Calculate water intake (ml)
      const waterIntake = Math.round(weight * 33);

      // Simulate API call for advanced metrics
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const calculatedMetrics: HealthMetrics = {
        bmi: roundedBmi,
        weight: weight,
        height: height,
        bodyFatPercentage,
        bmr: Math.round(bmr),
        tdee: adjustedTdee,
        idealWeight: {
          min: parseFloat(minIdealWeight.toFixed(1)),
          max: parseFloat(maxIdealWeight.toFixed(1)),
        },
        macros: {
          protein: proteinGrams,
          carbs: carbGrams,
          fat: fatGrams,
        },
        waterIntake,
        vo2Max: calculateEstimatedVO2Max(),
        date: new Date().toISOString().split("T")[0],
      };

      setMetrics(calculatedMetrics);
      setIsCalculated(true);
      setActiveTab("results");

      // Call the onCalculate callback
      onCalculate(roundedBmi, weight, height, userData, calculatedMetrics);
    } catch (error) {
      console.error("Error calculating metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEstimatedVO2Max = () => {
    // Very rough estimation based on activity level and age
    // This is not scientifically accurate without actual testing
    let baseVO2Max = 0;

    if (userData.gender === "Male") {
      baseVO2Max = 45;
    } else {
      baseVO2Max = 35;
    }

    // Adjust for age (VO2 Max decreases with age)
    const ageAdjustment = Math.max(0, (30 - userData.age) * 0.3);

    // Adjust for activity level
    let activityAdjustment = 0;
    switch (userData.activityLevel) {
      case "Sedentary":
        activityAdjustment = -5;
        break;
      case "Lightly Active":
        activityAdjustment = 0;
        break;
      case "Moderate":
        activityAdjustment = 5;
        break;
      case "Very Active":
        activityAdjustment = 10;
        break;
      case "Extra Active":
        activityAdjustment = 15;
        break;
    }

    // Adjust for gym sessions
    const gymAdjustment = Math.min(10, userData.gymSessionsPerWeek * 1.5);

    return Math.round(
      baseVO2Max + ageAdjustment + activityAdjustment + gymAdjustment,
    );
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 16) return "Severe Thinness";
    if (bmi >= 16 && bmi < 17) return "Moderate Thinness";
    if (bmi >= 17 && bmi < 18.5) return "Mild Thinness";
    if (bmi >= 18.5 && bmi < 25) return "Normal Weight";
    if (bmi >= 25 && bmi < 30) return "Overweight";
    if (bmi >= 30 && bmi < 35) return "Obese Class I";
    if (bmi >= 35 && bmi < 40) return "Obese Class II";
    return "Obese Class III";
  };

  const getCategoryColor = (bmi: number): string => {
    if (bmi < 18.5) return "text-blue-500";
    if (bmi >= 18.5 && bmi < 25) return "text-green-500";
    if (bmi >= 25 && bmi < 30) return "text-orange-500";
    return "text-red-500";
  };

  const getProgressColor = (bmi: number): string => {
    if (bmi < 18.5) return "bg-blue-500";
    if (bmi >= 18.5 && bmi < 25) return "bg-green-500";
    if (bmi >= 25 && bmi < 30) return "bg-orange-500";
    return "bg-red-500";
  };

  const generatePDF = () => {
    // In a real implementation, this would generate a PDF report
    alert("PDF report generation would be implemented here");
  };

  const shareResults = () => {
    // In a real implementation, this would share results via email or other means
    alert("Sharing functionality would be implemented here");
  };

  const saveToDatabase = async () => {
    if (!metrics || !userData.email) {
      setSaveError(
        "Please complete all required fields and calculate your BMI first",
      );
      return;
    }

    setIsSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      // Prepare data for saving
      const dataToSave = {
        userData: {
          ...userData,
        },
        metrics: {
          ...metrics,
          idealWeight: JSON.stringify(metrics.idealWeight),
          macros: JSON.stringify(metrics.macros),
        },
      };

      // In a real implementation, this would be an API call to your backend
      // For now, we'll simulate a successful save
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Data that would be saved to database:", dataToSave);
      setSaveSuccess(true);

      // In a real implementation, you would make an API call like this:
      /*
      const response = await fetch('/api/save-bmi-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      const result = await response.json();
      console.log("Save result:", result);
      setSaveSuccess(true);
      */
    } catch (error) {
      console.error("Error saving data:", error);
      setSaveError("Failed to save your data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getMealPlan = () => {
    if (!metrics) return null;

    const { tdee, macros } = metrics;
    const { dietPreference } = userData;

    // Basic meal plan based on diet preference and macros
    let breakfast, lunch, dinner, snacks;

    switch (dietPreference) {
      case "Keto":
        breakfast = "3 eggs with avocado and spinach";
        lunch = "Grilled chicken salad with olive oil dressing";
        dinner = "Salmon with asparagus and butter";
        snacks = "Nuts, cheese, and olives";
        break;
      case "Vegan":
        breakfast = "Tofu scramble with vegetables and nutritional yeast";
        lunch = "Quinoa bowl with chickpeas, vegetables, and tahini dressing";
        dinner = "Lentil pasta with vegetable sauce and nutritional yeast";
        snacks = "Hummus with vegetables, fruit, and nuts";
        break;
      case "Vegetarian":
        breakfast = "Greek yogurt with berries and nuts";
        lunch = "Vegetable and bean soup with whole grain bread";
        dinner = "Tofu stir-fry with brown rice";
        snacks = "Cottage cheese, fruit, and nuts";
        break;
      case "Low Carb":
        breakfast = "Protein smoothie with berries and almond butter";
        lunch = "Turkey lettuce wraps with vegetables";
        dinner = "Grilled steak with roasted vegetables";
        snacks = "Hard-boiled eggs, jerky, and nuts";
        break;
      case "High Protein":
        breakfast = "Protein oatmeal with whey protein and fruit";
        lunch = "Chicken breast with sweet potato and vegetables";
        dinner = "Lean ground beef with quinoa and vegetables";
        snacks = "Protein shake, Greek yogurt, and turkey jerky";
        break;
      default: // Balanced
        breakfast = "Oatmeal with fruit, nuts, and Greek yogurt";
        lunch = "Grilled chicken with brown rice and vegetables";
        dinner = "Baked fish with sweet potato and salad";
        snacks = "Fruit, yogurt, and whole grain crackers with hummus";
    }

    return {
      breakfast,
      lunch,
      dinner,
      snacks,
      dailyCalories: tdee,
      macros,
    };
  };

  const getWorkoutPlan = () => {
    if (!metrics) return null;

    const { fitnessGoal, gymSessionsPerWeek } = userData;
    const { bmi } = metrics;

    // Basic workout plan based on fitness goal, BMI, and gym sessions
    let workoutPlan;

    if (gymSessionsPerWeek <= 2) {
      // Beginner plan for those who can only work out 1-2 times per week
      workoutPlan = {
        frequency: `${gymSessionsPerWeek} days per week`,
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
              "Bench press or floor press: 3 sets of 10 reps",
              "Lat pulldowns or pull-ups: 3 sets of 10 reps",
              "Shoulder press: 3 sets of 10 reps",
              "Russian twists: 3 sets of 20 reps",
            ],
          },
        ],
        cardio:
          bmi >= 25
            ? "20-30 minutes of moderate intensity cardio after each strength session"
            : "15-20 minutes of cardio for general health",
      };
    } else if (gymSessionsPerWeek <= 4) {
      // Intermediate plan for 3-4 sessions per week
      workoutPlan = {
        frequency: `${gymSessionsPerWeek} days per week`,
        sessions: [
          {
            day: "Day 1",
            focus: "Upper Body",
            exercises: [
              "Bench press: 4 sets of 8-12 reps",
              "Rows: 4 sets of 8-12 reps",
              "Shoulder press: 3 sets of 8-12 reps",
              "Bicep curls: 3 sets of 12 reps",
              "Tricep extensions: 3 sets of 12 reps",
            ],
          },
          {
            day: "Day 2",
            focus: "Lower Body",
            exercises: [
              "Squats: 4 sets of 8-12 reps",
              "Deadlifts: 4 sets of 8-12 reps",
              "Lunges: 3 sets of 10 reps per leg",
              "Leg curls: 3 sets of 12 reps",
              "Calf raises: 3 sets of 15 reps",
            ],
          },
          {
            day: "Day 3",
            focus: "Upper Body",
            exercises: [
              "Incline press: 4 sets of 8-12 reps",
              "Pull-ups or lat pulldowns: 4 sets of 8-12 reps",
              "Lateral raises: 3 sets of 12 reps",
              "Face pulls: 3 sets of 15 reps",
              "Skull crushers: 3 sets of 12 reps",
            ],
          },
          {
            day: "Day 4",
            focus: "Lower Body",
            exercises: [
              "Front squats: 4 sets of 8-12 reps",
              "Romanian deadlifts: 4 sets of 8-12 reps",
              "Leg press: 3 sets of 12 reps",
              "Leg extensions: 3 sets of 15 reps",
              "Planks: 3 sets of 45 seconds",
            ],
          },
        ],
        cardio:
          fitnessGoal === "Weight Loss"
            ? "30 minutes of HIIT 2-3 times per week"
            : fitnessGoal === "Muscle Gain"
              ? "15 minutes of moderate intensity cardio after strength training"
              : "20-30 minutes of mixed cardio 2-3 times per week",
      };
    } else {
      // Advanced plan for 5+ sessions per week
      workoutPlan = {
        frequency: `${gymSessionsPerWeek} days per week`,
        sessions: [
          {
            day: "Day 1",
            focus: "Chest & Triceps",
            exercises: [
              "Bench press: 4 sets of 8-10 reps",
              "Incline dumbbell press: 4 sets of 8-10 reps",
              "Chest flyes: 3 sets of 10-12 reps",
              "Tricep pushdowns: 3 sets of 10-12 reps",
              "Overhead tricep extensions: 3 sets of 10-12 reps",
            ],
          },
          {
            day: "Day 2",
            focus: "Back & Biceps",
            exercises: [
              "Deadlifts: 4 sets of 6-8 reps",
              "Pull-ups or lat pulldowns: 4 sets of 8-10 reps",
              "Rows: 4 sets of 8-10 reps",
              "Bicep curls: 3 sets of 10-12 reps",
              "Hammer curls: 3 sets of 10-12 reps",
            ],
          },
          {
            day: "Day 3",
            focus: "Legs",
            exercises: [
              "Squats: 4 sets of 8-10 reps",
              "Leg press: 4 sets of 10-12 reps",
              "Romanian deadlifts: 3 sets of 8-10 reps",
              "Leg extensions: 3 sets of 12-15 reps",
              "Leg curls: 3 sets of 12-15 reps",
            ],
          },
          {
            day: "Day 4",
            focus: "Shoulders & Abs",
            exercises: [
              "Overhead press: 4 sets of 8-10 reps",
              "Lateral raises: 4 sets of 10-12 reps",
              "Face pulls: 3 sets of 12-15 reps",
              "Hanging leg raises: 3 sets of 12-15 reps",
              "Russian twists: 3 sets of 20 reps",
            ],
          },
          {
            day: "Day 5",
            focus: "Full Body or Lagging Body Parts",
            exercises: [
              "Choose 5 exercises for body parts that need extra work",
              "Perform 3-4 sets of 8-12 reps for each exercise",
              "Focus on proper form and controlled movements",
            ],
          },
        ],
        cardio:
          fitnessGoal === "Weight Loss"
            ? "30-45 minutes of HIIT 3-4 times per week or 20 minutes after each strength session"
            : fitnessGoal === "Muscle Gain"
              ? "10-15 minutes of moderate intensity cardio after strength training for recovery"
              : "20-30 minutes of mixed cardio 3-4 times per week",
      };
    }

    return workoutPlan;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-md">
      <CardHeader>
        <div className="flex items-center">
          <Calculator className="h-5 w-5 mr-2 text-primary" />
          <CardTitle className="text-xl font-bold">
            Professional BMI Calculator
          </CardTitle>
        </div>
        <CardDescription>
          Complete health assessment with personalized recommendations
        </CardDescription>
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Personal Details</span>
            <span>Physical Metrics</span>
            <span>Lifestyle</span>
            <span>Results</span>
          </div>
          <Progress value={formProgress} className="h-2" />
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="personal" className="p-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={userData.age}
                    onChange={(e) =>
                      handleInputChange("age", parseInt(e.target.value) || 0)
                    }
                    placeholder="Enter your age"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                Gender
              </Label>
              <Select
                value={userData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => setActiveTab("physical")}>
                Next: Physical Metrics
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="physical" className="p-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Physical Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weight" className="flex items-center">
                      <Scale className="h-4 w-4 mr-2 text-muted-foreground" />
                      Weight (kg)
                    </Label>
                    <span className="text-sm font-medium">{weight} kg</span>
                  </div>
                  <Slider
                    id="weight"
                    min={30}
                    max={200}
                    step={0.5}
                    value={[weight]}
                    onValueChange={(value) => setWeight(value[0])}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>30 kg</span>
                    <span>200 kg</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="height" className="flex items-center">
                      <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                      Height (cm)
                    </Label>
                    <span className="text-sm font-medium">{height} cm</span>
                  </div>
                  <Slider
                    id="height"
                    min={100}
                    max={220}
                    step={0.5}
                    value={[height]}
                    onValueChange={(value) => setHeight(value[0])}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>100 cm</span>
                    <span>220 cm</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fitnessGoal" className="flex items-center">
                    <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                    Fitness Goal
                  </Label>
                  <Select
                    value={userData.fitnessGoal}
                    onValueChange={(value) =>
                      handleInputChange("fitnessGoal", value)
                    }
                  >
                    <SelectTrigger id="fitnessGoal">
                      <SelectValue placeholder="Select fitness goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                      <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Improved Fitness">
                        Improved Fitness
                      </SelectItem>
                      <SelectItem value="Athletic Performance">
                        Athletic Performance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caloriesPerDay" className="flex items-center">
                    <Utensils className="h-4 w-4 mr-2 text-muted-foreground" />
                    Current Daily Calorie Intake (approx.)
                  </Label>
                  <Input
                    id="caloriesPerDay"
                    type="number"
                    value={userData.caloriesPerDay}
                    onChange={(e) =>
                      handleInputChange(
                        "caloriesPerDay",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    placeholder="Enter your daily calorie intake"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setActiveTab("personal")}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setActiveTab("lifestyle")}>
                Next: Lifestyle
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lifestyle" className="p-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Lifestyle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="activityLevel" className="flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                    Activity Level
                  </Label>
                  <Select
                    value={userData.activityLevel}
                    onValueChange={(value) =>
                      handleInputChange("activityLevel", value)
                    }
                  >
                    <SelectTrigger id="activityLevel">
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedentary">
                        Sedentary (little or no exercise)
                      </SelectItem>
                      <SelectItem value="Lightly Active">
                        Lightly Active (light exercise 1-3 days/week)
                      </SelectItem>
                      <SelectItem value="Moderate">
                        Moderate (moderate exercise 3-5 days/week)
                      </SelectItem>
                      <SelectItem value="Very Active">
                        Very Active (hard exercise 6-7 days/week)
                      </SelectItem>
                      <SelectItem value="Extra Active">
                        Extra Active (very hard exercise & physical job)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietPreference" className="flex items-center">
                    <Utensils className="h-4 w-4 mr-2 text-muted-foreground" />
                    Diet Preference
                  </Label>
                  <Select
                    value={userData.dietPreference}
                    onValueChange={(value) =>
                      handleInputChange("dietPreference", value)
                    }
                  >
                    <SelectTrigger id="dietPreference">
                      <SelectValue placeholder="Select diet preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Balanced">Balanced</SelectItem>
                      <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="Vegan">Vegan</SelectItem>
                      <SelectItem value="Keto">Keto</SelectItem>
                      <SelectItem value="Paleo">Paleo</SelectItem>
                      <SelectItem value="Mediterranean">
                        Mediterranean
                      </SelectItem>
                      <SelectItem value="Low Carb">Low Carb</SelectItem>
                      <SelectItem value="High Protein">High Protein</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gymSessions" className="flex items-center">
                    <Dumbbell className="h-4 w-4 mr-2 text-muted-foreground" />
                    Gym Sessions per Week
                  </Label>
                  <Input
                    id="gymSessions"
                    type="number"
                    value={userData.gymSessionsPerWeek}
                    onChange={(e) =>
                      handleInputChange(
                        "gymSessionsPerWeek",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    placeholder="Enter number of gym sessions"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeInGym" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    Time in Gym (hours per session)
                  </Label>
                  <Input
                    id="timeInGym"
                    type="number"
                    value={userData.timeInGym}
                    onChange={(e) =>
                      handleInputChange(
                        "timeInGym",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    placeholder="Enter hours spent in gym"
                    step="0.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sleep" className="flex items-center">
                    <Moon className="h-4 w-4 mr-2 text-muted-foreground" />
                    Hours of Sleep
                  </Label>
                  <Input
                    id="sleep"
                    type="number"
                    value={userData.hoursOfSleep}
                    onChange={(e) =>
                      handleInputChange(
                        "hoursOfSleep",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    placeholder="Enter hours of sleep"
                    step="0.5"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setActiveTab("physical")}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={calculateMetrics} disabled={isLoading}>
                {isLoading ? "Calculating..." : "Calculate Results"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results" className="p-6">
          {metrics ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Health Assessment</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={generatePDF}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareResults}>
                    <Download className="mr-2 h-4 w-4" />
                    Share Results
                  </Button>
                  {standalone && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={saveToDatabase}
                      disabled={isSaving}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? "Saving..." : "Save Results"}
                    </Button>
                  )}
                </div>
              </div>

              {saveSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
                  Your results have been saved successfully!
                </div>
              )}

              {saveError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                  {saveError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BarChart4 className="h-4 w-4 mr-2 text-primary" />
                      BMI Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{metrics.bmi}</div>
                    <div
                      className={`text-sm font-medium ${getCategoryColor(metrics.bmi)}`}
                    >
                      {getBMICategory(metrics.bmi)}
                    </div>
                    <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(metrics.bmi)}`}
                        style={{
                          width: `${Math.min(100, (metrics.bmi / 40) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                      <span>16</span>
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                      <span>40</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Scale className="h-4 w-4 mr-2 text-primary" />
                      Body Composition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Body Fat:</span>
                          <span className="text-sm font-bold">
                            {metrics.bodyFatPercentage}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {userData.gender === "Male"
                            ? metrics.bodyFatPercentage < 10
                              ? "Athletic range (low)"
                              : metrics.bodyFatPercentage < 20
                                ? "Fitness range"
                                : metrics.bodyFatPercentage < 25
                                  ? "Average range"
                                  : "Above average"
                            : metrics.bodyFatPercentage < 18
                              ? "Athletic range (low)"
                              : metrics.bodyFatPercentage < 28
                                ? "Fitness range"
                                : metrics.bodyFatPercentage < 32
                                  ? "Average range"
                                  : "Above average"}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Ideal Weight:</span>
                          <span className="text-sm font-bold">
                            {metrics.idealWeight.min} -{" "}
                            {metrics.idealWeight.max} kg
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {weight < metrics.idealWeight.min
                            ? `${(metrics.idealWeight.min - weight).toFixed(1)} kg below ideal range`
                            : weight > metrics.idealWeight.max
                              ? `${(weight - metrics.idealWeight.max).toFixed(1)} kg above ideal range`
                              : "Within ideal weight range"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-primary" />
                      Energy Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">BMR:</span>
                          <span className="text-sm font-bold">
                            {metrics.bmr} kcal
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          Base Metabolic Rate
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">TDEE:</span>
                          <span className="text-sm font-bold">
                            {metrics.tdee} kcal
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Daily calorie needs for{" "}
                          {userData.fitnessGoal.toLowerCase()}
                        </div>
                      </div>

                      {metrics.vo2Max && (
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Est. VO2 Max:</span>
                            <span className="text-sm font-bold">
                              {metrics.vo2Max} ml/kg/min
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Estimated aerobic capacity
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Utensils className="h-4 w-4 mr-2 text-primary" />
                      Nutrition Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            Daily Calories:
                          </span>
                          <span className="text-sm font-bold">
                            {metrics.tdee} kcal
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-4">
                          Adjusted for your goal of{" "}
                          {userData.fitnessGoal.toLowerCase()}
                        </div>

                        <h4 className="text-sm font-semibold mb-2">
                          Macronutrient Breakdown:
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Protein:</span>
                              <span className="text-sm font-medium">
                                {metrics.macros.protein}g (
                                {(metrics.macros.protein * 4).toLocaleString()}{" "}
                                kcal)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{
                                  width: `${((metrics.macros.protein * 4) / metrics.tdee) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Carbs:</span>
                              <span className="text-sm font-medium">
                                {metrics.macros.carbs}g (
                                {(metrics.macros.carbs * 4).toLocaleString()}{" "}
                                kcal)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-green-500 h-1.5 rounded-full"
                                style={{
                                  width: `${((metrics.macros.carbs * 4) / metrics.tdee) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Fat:</span>
                              <span className="text-sm font-medium">
                                {metrics.macros.fat}g (
                                {(metrics.macros.fat * 9).toLocaleString()}{" "}
                                kcal)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-yellow-500 h-1.5 rounded-full"
                                style={{
                                  width: `${((metrics.macros.fat * 9) / metrics.tdee) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            Water Intake:
                          </span>
                          <span className="text-sm font-bold">
                            {metrics.waterIntake} ml
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Recommended daily water consumption
                        </div>
                      </div>

                      {getMealPlan() && (
                        <div className="pt-4 border-t border-gray-100 mt-4">
                          <h4 className="text-sm font-semibold mb-2">
                            Sample Meal Plan:
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Breakfast:</span>{" "}
                              {getMealPlan()?.breakfast}
                            </div>
                            <div>
                              <span className="font-medium">Lunch:</span>{" "}
                              {getMealPlan()?.lunch}
                            </div>
                            <div>
                              <span className="font-medium">Dinner:</span>{" "}
                              {getMealPlan()?.dinner}
                            </div>
                            <div>
                              <span className="font-medium">Snacks:</span>{" "}
                              {getMealPlan()?.snacks}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clipboard className="h-4 w-4 mr-2 text-primary" />
                      Action Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-md bg-muted/30 border border-muted">
                        <h3 className="font-medium mb-2">
                          Primary Focus Areas
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {metrics.bmi < 18.5 ? (
                            <>
                              <li>
                                Gradually increase caloric intake with
                                nutrient-dense foods
                              </li>
                              <li>
                                Focus on strength training to build muscle mass
                              </li>
                              <li>
                                Ensure adequate protein intake (
                                {metrics.macros.protein}g daily)
                              </li>
                            </>
                          ) : metrics.bmi >= 25 ? (
                            <>
                              <li>
                                Create a moderate calorie deficit of 500 kcal
                                per day
                              </li>
                              <li>
                                Increase daily activity and structured exercise
                              </li>
                              <li>
                                Focus on high protein intake to preserve muscle
                                mass
                              </li>
                            </>
                          ) : (
                            <>
                              <li>Maintain current healthy habits</li>
                              <li>
                                Focus on performance and fitness goals rather
                                than weight
                              </li>
                              <li>
                                Consider body composition improvements if
                                desired
                              </li>
                            </>
                          )}
                          {userData.hoursOfSleep < 7 && (
                            <li>
                              Improve sleep duration and quality for better
                              recovery
                            </li>
                          )}
                        </ul>
                      </div>

                      {getWorkoutPlan() && (
                        <div className="pt-2">
                          <h3 className="font-medium mb-2">Workout Plan</h3>
                          <div className="text-sm space-y-2">
                            <p>
                              <span className="font-medium">Frequency:</span>{" "}
                              {getWorkoutPlan()?.frequency}
                            </p>
                            <div className="space-y-3 mt-3">
                              {getWorkoutPlan()
                                ?.sessions.slice(0, 3)
                                .map((session, index) => (
                                  <div
                                    key={index}
                                    className="p-2 bg-muted/20 rounded-md"
                                  >
                                    <p className="font-medium">
                                      {session.day}: {session.focus}
                                    </p>
                                    <ul className="list-disc pl-5 mt-1 text-xs space-y-0.5">
                                      {session.exercises
                                        .slice(0, 3)
                                        .map((exercise, i) => (
                                          <li key={i}>{exercise}</li>
                                        ))}
                                      {session.exercises.length > 3 && (
                                        <li className="text-muted-foreground">
                                          + {session.exercises.length - 3} more
                                          exercises
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                ))}
                              {getWorkoutPlan()?.sessions.length > 3 && (
                                <p className="text-xs text-muted-foreground">
                                  + {getWorkoutPlan()?.sessions.length - 3} more
                                  workout days in the full plan
                                </p>
                              )}
                            </div>
                            <p className="mt-2 text-xs">
                              <span className="font-medium">Cardio:</span>{" "}
                              {getWorkoutPlan()?.cardio}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Complete all the previous steps to see your personalized
                  health assessment
                </p>
                <Button onClick={() => setActiveTab("personal")}>
                  Start Assessment
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setMetrics(null);
            setIsCalculated(false);
            setActiveTab("personal");
          }}
        >
          Reset
        </Button>

        {!isCalculated && activeTab !== "results" && (
          <Button
            onClick={() => {
              if (activeTab === "lifestyle") {
                calculateMetrics();
              } else if (activeTab === "personal") {
                setActiveTab("physical");
              } else if (activeTab === "physical") {
                setActiveTab("lifestyle");
              }
            }}
          >
            {activeTab === "lifestyle" ? "Calculate Results" : "Next"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
