import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Slider } from "./slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import {
  Calculator,
  Scale,
  Ruler,
  Activity,
  Utensils,
  Moon,
} from "lucide-react";

interface ProBMICalculatorProps {
  onCalculate?: (
    bmi: number,
    weight: number,
    height: number,
    userData: UserData,
  ) => void;
}

interface UserData {
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

export function ProBMICalculator({
  onCalculate = () => {},
}: ProBMICalculatorProps) {
  const [activeTab, setActiveTab] = useState("basic");
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
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
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
  const [tdee, setTdee] = useState<number | null>(null);
  const [idealWeight, setIdealWeight] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateBMI = () => {
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      const roundedBmi = parseFloat(bmiValue.toFixed(1));

      setBmi(roundedBmi);
      setCategory(getBMICategory(roundedBmi));

      // Calculate ideal weight range (BMI between 18.5 and 24.9)
      const minIdealWeight = 18.5 * (heightInMeters * heightInMeters);
      const maxIdealWeight = 24.9 * (heightInMeters * heightInMeters);
      setIdealWeight({
        min: parseFloat(minIdealWeight.toFixed(1)),
        max: parseFloat(maxIdealWeight.toFixed(1)),
      });

      // Estimate body fat percentage using BMI (very rough estimate)
      // Using the formula: Body Fat % = (1.20 × BMI) + (0.23 × Age) − (10.8 × gender) − 5.4
      // where gender is 1 for males and 0 for females
      const genderMultiplier = userData.gender === "Male" ? 1 : 0;
      const estimatedBodyFat =
        1.2 * roundedBmi + 0.23 * userData.age - 10.8 * genderMultiplier - 5.4;
      setBodyFat(parseFloat(Math.max(estimatedBodyFat, 3).toFixed(1))); // Minimum 3% body fat

      // Calculate TDEE (Total Daily Energy Expenditure)
      // First calculate BMR using Mifflin-St Jeor Equation
      let bmr = 0;
      if (userData.gender === "Male") {
        bmr = 10 * weight + 6.25 * height - 5 * userData.age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * userData.age - 161;
      }

      // Apply activity multiplier
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

      const calculatedTdee = Math.round(bmr * activityMultiplier);
      setTdee(calculatedTdee);

      onCalculate(roundedBmi, weight, height, userData);
    }
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

  const getCategoryColor = (category: string): string => {
    if (category.includes("Thinness")) return "text-blue-500";
    if (category === "Normal Weight") return "text-green-500";
    if (category === "Overweight") return "text-orange-500";
    return "text-red-500";
  };

  const handleInputChange = (field: keyof UserData, value: any) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getCalorieRecommendation = () => {
    if (!tdee) return null;

    let adjustment = 0;
    switch (userData.fitnessGoal) {
      case "Weight Loss":
        adjustment = -500;
        break;
      case "Muscle Gain":
        adjustment = 300;
        break;
      case "Maintenance":
        adjustment = 0;
        break;
    }

    return tdee + adjustment;
  };

  const getProteinRecommendation = () => {
    if (!weight) return null;

    let multiplier = 0;
    switch (userData.fitnessGoal) {
      case "Weight Loss":
        multiplier = 1.8;
        break;
      case "Muscle Gain":
        multiplier = 2.2;
        break;
      case "Maintenance":
        multiplier = 1.6;
        break;
    }

    return Math.round(weight * multiplier);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-md">
      <CardHeader>
        <div className="flex items-center">
          <Calculator className="h-5 w-5 mr-2 text-primary" />
          <CardTitle className="text-xl font-bold">
            Advanced BMI Calculator
          </CardTitle>
        </div>
        <CardDescription>
          Calculate your Body Mass Index and get personalized health insights
        </CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="results" disabled={bmi === null}>
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 p-4">
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
                <Label htmlFor="age" className="flex items-center">
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

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity" className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                  Activity Level
                </Label>
                <Select
                  value={userData.activityLevel}
                  onValueChange={(value) =>
                    handleInputChange("activityLevel", value)
                  }
                >
                  <SelectTrigger id="activity">
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
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setActiveTab("advanced")}>
              Next: Advanced
            </Button>
            <Button onClick={calculateBMI}>Calculate BMI</Button>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={userData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitnessGoal">Fitness Goal</Label>
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
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
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
                    <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gymSessions">Gym Sessions per Week</Label>
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
                <Label htmlFor="timeInGym">
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
            <Button variant="outline" onClick={() => setActiveTab("basic")}>
              Back: Basic
            </Button>
            <Button
              onClick={() => {
                calculateBMI();
                setActiveTab("results");
              }}
            >
              Calculate & View Results
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="results" className="p-4">
          {bmi !== null && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Your BMI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{bmi}</div>
                    <div
                      className={`text-sm font-medium ${getCategoryColor(category)}`}
                    >
                      {category}
                    </div>
                    <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${bmi < 18.5 ? "bg-blue-500" : bmi < 25 ? "bg-green-500" : bmi < 30 ? "bg-orange-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(100, (bmi / 40) * 100)}%` }}
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
                    <CardTitle className="text-lg">Ideal Weight</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {idealWeight && (
                      <>
                        <div className="text-3xl font-bold">
                          {idealWeight.min} - {idealWeight.max}
                        </div>
                        <div className="text-sm text-muted-foreground">kg</div>
                        <div className="mt-2 text-sm">
                          {weight < idealWeight.min ? (
                            <span className="text-blue-500">
                              You are {(idealWeight.min - weight).toFixed(1)} kg
                              below ideal weight range
                            </span>
                          ) : weight > idealWeight.max ? (
                            <span className="text-orange-500">
                              You are {(weight - idealWeight.max).toFixed(1)} kg
                              above ideal weight range
                            </span>
                          ) : (
                            <span className="text-green-500">
                              You are within the ideal weight range
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Body Composition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bodyFat !== null && (
                      <>
                        <div className="text-3xl font-bold">{bodyFat}%</div>
                        <div className="text-sm text-muted-foreground">
                          Estimated Body Fat
                        </div>
                        <div className="mt-2 text-sm">
                          {userData.gender === "Male" ? (
                            bodyFat < 10 ? (
                              <span className="text-blue-500">
                                Athletic range (low)
                              </span>
                            ) : bodyFat < 20 ? (
                              <span className="text-green-500">
                                Fitness range
                              </span>
                            ) : bodyFat < 25 ? (
                              <span className="text-yellow-500">
                                Average range
                              </span>
                            ) : (
                              <span className="text-orange-500">
                                Above average
                              </span>
                            )
                          ) : bodyFat < 18 ? (
                            <span className="text-blue-500">
                              Athletic range (low)
                            </span>
                          ) : bodyFat < 28 ? (
                            <span className="text-green-500">
                              Fitness range
                            </span>
                          ) : bodyFat < 32 ? (
                            <span className="text-yellow-500">
                              Average range
                            </span>
                          ) : (
                            <span className="text-orange-500">
                              Above average
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Nutrition Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tdee && (
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              Daily Calories:
                            </span>
                            <span className="text-sm font-bold">
                              {getCalorieRecommendation()} kcal
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-4">
                            Based on your TDEE of {tdee} kcal and your goal of{" "}
                            {userData.fitnessGoal.toLowerCase()}
                          </div>

                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              Protein Intake:
                            </span>
                            <span className="text-sm font-bold">
                              {getProteinRecommendation()} g
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-4">
                            {userData.fitnessGoal === "Muscle Gain"
                              ? "Higher protein for muscle building"
                              : userData.fitnessGoal === "Weight Loss"
                                ? "Higher protein to preserve muscle during weight loss"
                                : "Moderate protein for maintenance"}
                          </div>

                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              Recommended Diet:
                            </span>
                            <span className="text-sm font-bold">
                              {userData.dietPreference}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {userData.dietPreference === "Balanced"
                              ? "Focus on whole foods with balanced macronutrients"
                              : userData.dietPreference === "Vegetarian"
                                ? "Plant-based proteins with eggs and dairy"
                                : userData.dietPreference === "Vegan"
                                  ? "Plant-based proteins and B12 supplementation"
                                  : userData.dietPreference === "Keto"
                                    ? "High fat, moderate protein, very low carb"
                                    : userData.dietPreference === "Paleo"
                                      ? "Focus on whole foods, avoid processed foods and grains"
                                      : "Rich in fruits, vegetables, whole grains, olive oil, and fish"}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Fitness Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            Weekly Exercise:
                          </span>
                          <span className="text-sm font-bold">
                            {userData.gymSessionsPerWeek} sessions
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-4">
                          {userData.gymSessionsPerWeek < 3
                            ? "Consider increasing to at least 3 sessions per week"
                            : userData.gymSessionsPerWeek > 5
                              ? "Ensure adequate recovery between sessions"
                              : "Good frequency for consistent progress"}
                        </div>

                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            Session Duration:
                          </span>
                          <span className="text-sm font-bold">
                            {userData.timeInGym} hours
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-4">
                          {userData.timeInGym < 1
                            ? "Short, intense workouts can be effective"
                            : userData.timeInGym > 2
                              ? "Ensure workout intensity remains high throughout"
                              : "Optimal duration for productive training"}
                        </div>

                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Sleep:</span>
                          <span className="text-sm font-bold">
                            {userData.hoursOfSleep} hours
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {userData.hoursOfSleep < 7
                            ? "Consider increasing sleep for better recovery and results"
                            : userData.hoursOfSleep >= 7 &&
                                userData.hoursOfSleep <= 9
                              ? "Optimal sleep duration for recovery and health"
                              : "Good sleep duration, ensure quality is also high"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Health Action Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-md bg-muted/30 border border-muted">
                        <h3 className="font-medium mb-2">
                          Primary Focus Areas
                        </h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {bmi < 18.5 ? (
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
                                {getProteinRecommendation()} g daily)
                              </li>
                            </>
                          ) : bmi >= 25 ? (
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

                      <div>
                        <h3 className="font-medium mb-2">
                          Weekly Schedule Recommendation
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-xs">
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((day, index) => {
                            // Create a simple workout schedule based on user's gym sessions per week
                            const isWorkoutDay =
                              userData.gymSessionsPerWeek >= 7 ||
                              (userData.gymSessionsPerWeek >= 5 && index < 5) ||
                              (userData.gymSessionsPerWeek >= 3 &&
                                index % 2 === 0) ||
                              (userData.gymSessionsPerWeek >= 1 && index === 0);

                            return (
                              <div
                                key={day}
                                className={`p-2 rounded-md border ${isWorkoutDay ? "bg-primary/10 border-primary/20" : "bg-muted/30 border-muted"}`}
                              >
                                <div className="font-medium mb-1">{day}</div>
                                {isWorkoutDay ? (
                                  <div>
                                    {userData.fitnessGoal === "Weight Loss"
                                      ? "Cardio + Strength"
                                      : userData.fitnessGoal === "Muscle Gain"
                                        ? "Strength Training"
                                        : "Mixed Training"}
                                  </div>
                                ) : (
                                  <div>Rest or Light Activity</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setBmi(null);
            setCategory("");
            setActiveTab("basic");
          }}
        >
          Reset
        </Button>

        {activeTab !== "results" && (
          <Button
            onClick={() => {
              calculateBMI();
              if (bmi !== null) setActiveTab("results");
            }}
          >
            Calculate BMI
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
