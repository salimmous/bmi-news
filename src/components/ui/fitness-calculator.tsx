import { useState, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Slider } from "./slider";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Progress } from "./progress";
import { Badge } from "./badge";
import {
  Dumbbell,
  Activity,
  Heart,
  Scale,
  Ruler,
  Flame,
  Trophy,
  ArrowRight,
  BarChart,
  Zap,
  Save,
  RefreshCw,
} from "lucide-react";

export function FitnessCalculator() {
  // Basic inputs
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(70);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");

  // Advanced inputs
  const [neckCircumference, setNeckCircumference] = useState<number | null>(
    null,
  );
  const [waistCircumference, setWaistCircumference] = useState<number | null>(
    null,
  );
  const [hipCircumference, setHipCircumference] = useState<number | null>(null);
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [sportType, setSportType] = useState<string>("general");
  const [fitnessGoal, setFitnessGoal] = useState<string>("maintain");

  // Results
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [bmiColor, setBmiColor] = useState<string>("");
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [bodyFatCategory, setBodyFatCategory] = useState<string>("");
  const [leanMass, setLeanMass] = useState<number | null>(null);
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [idealWeight, setIdealWeight] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [performanceScore, setPerformanceScore] = useState<number>(0);
  const [performanceMessage, setPerformanceMessage] = useState<string>("");

  // UI state
  const [activeTab, setActiveTab] = useState<string>("calculator");
  const [motivationalQuote, setMotivationalQuote] = useState<string>("");

  // Sport profiles
  const sportProfiles: Record<
    string,
    { name: string; idealBmiRange: [number, number]; icon: React.ReactNode }
  > = {
    general: {
      name: "General Fitness",
      idealBmiRange: [18.5, 24.9],
      icon: <Activity className="h-5 w-5" />,
    },
    running: {
      name: "Running",
      idealBmiRange: [18.5, 22.0],
      icon: <Activity className="h-5 w-5" />,
    },
    swimming: {
      name: "Swimming",
      idealBmiRange: [21.0, 24.0],
      icon: <Activity className="h-5 w-5" />,
    },
    cycling: {
      name: "Cycling",
      idealBmiRange: [20.0, 23.0],
      icon: <Activity className="h-5 w-5" />,
    },
    weightlifting: {
      name: "Weightlifting",
      idealBmiRange: [23.0, 27.5],
      icon: <Dumbbell className="h-5 w-5" />,
    },
    crossfit: {
      name: "CrossFit",
      idealBmiRange: [22.0, 26.0],
      icon: <Dumbbell className="h-5 w-5" />,
    },
  };

  // Motivational quotes
  const motivationalQuotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "The difference between try and triumph is just a little umph!",
    "The clock is ticking. Are you becoming the person you want to be?",
    "You don't have to be extreme, just consistent.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Your health is an investment, not an expense.",
    "Don't wish for it, work for it.",
    "Strength does not come from the body. It comes from the will.",
    "The only place where success comes before work is in the dictionary.",
  ];

  // Set a random motivational quote on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setMotivationalQuote(motivationalQuotes[randomIndex]);
  }, []);

  // Calculate metrics when inputs change
  useEffect(() => {
    calculateMetrics();
  }, [
    height,
    weight,
    age,
    gender,
    units,
    neckCircumference,
    waistCircumference,
    hipCircumference,
    activityLevel,
    sportType,
  ]);

  const calculateMetrics = () => {
    if (!height || !weight) return;

    let heightInMeters: number;
    let weightInKg: number;

    // Convert to metric if needed
    if (units === "metric") {
      heightInMeters = height / 100;
      weightInKg = weight;
    } else {
      heightInMeters = height * 0.0254; // inches to meters
      weightInKg = weight * 0.453592; // pounds to kg
    }

    // Calculate BMI
    const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
    setBmi(parseFloat(calculatedBMI.toFixed(1)));

    // Determine BMI category and color
    let category: string;
    let color: string;

    if (calculatedBMI < 18.5) {
      category = "Underweight";
      color = "text-blue-500";
    } else if (calculatedBMI < 25) {
      category = "Normal weight";
      color = "text-green-500";
    } else if (calculatedBMI < 30) {
      category = "Overweight";
      color = "text-yellow-500";
    } else if (calculatedBMI < 35) {
      category = "Obesity (Class 1)";
      color = "text-orange-500";
    } else if (calculatedBMI < 40) {
      category = "Obesity (Class 2)";
      color = "text-red-500";
    } else {
      category = "Obesity (Class 3)";
      color = "text-red-700";
    }

    setBmiCategory(category);
    setBmiColor(color);

    // Calculate Body Fat Percentage using Navy method
    let calculatedBodyFat: number | null = null;
    let fatCategory: string = "";
    let calculatedLeanMass: number | null = null;

    if (neckCircumference && waistCircumference) {
      if (
        gender === "male" &&
        neckCircumference > 0 &&
        waistCircumference > 0
      ) {
        // Navy method for males
        const logValue = Math.log10(waistCircumference - neckCircumference);
        calculatedBodyFat =
          86.01 * logValue - 70.041 * Math.log10(heightInMeters * 100) + 36.76;
      } else if (
        gender === "female" &&
        neckCircumference > 0 &&
        waistCircumference > 0 &&
        hipCircumference &&
        hipCircumference > 0
      ) {
        // Navy method for females
        const logValue = Math.log10(
          waistCircumference + hipCircumference - neckCircumference,
        );
        calculatedBodyFat =
          163.205 * logValue -
          97.684 * Math.log10(heightInMeters * 100) -
          104.912;
      }

      // Ensure reasonable range
      if (calculatedBodyFat !== null) {
        calculatedBodyFat = Math.max(5, Math.min(45, calculatedBodyFat));
        setBodyFat(parseFloat(calculatedBodyFat.toFixed(1)));

        // Calculate lean mass
        calculatedLeanMass = weightInKg * (1 - calculatedBodyFat / 100);
        setLeanMass(parseFloat(calculatedLeanMass.toFixed(1)));

        // Determine body fat category
        if (gender === "male") {
          if (calculatedBodyFat < 6) fatCategory = "Essential Fat";
          else if (calculatedBodyFat < 14) fatCategory = "Athletic";
          else if (calculatedBodyFat < 18) fatCategory = "Fitness";
          else if (calculatedBodyFat < 25) fatCategory = "Average";
          else fatCategory = "Obese";
        } else {
          if (calculatedBodyFat < 14) fatCategory = "Essential Fat";
          else if (calculatedBodyFat < 21) fatCategory = "Athletic";
          else if (calculatedBodyFat < 25) fatCategory = "Fitness";
          else if (calculatedBodyFat < 32) fatCategory = "Average";
          else fatCategory = "Obese";
        }

        setBodyFatCategory(fatCategory);
      }
    }

    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    let calculatedBMR: number;
    if (gender === "male") {
      calculatedBMR =
        10 * weightInKg + 6.25 * (heightInMeters * 100) - 5 * age + 5;
    } else {
      calculatedBMR =
        10 * weightInKg + 6.25 * (heightInMeters * 100) - 5 * age - 161;
    }
    setBmr(Math.round(calculatedBMR));

    // Calculate TDEE (Total Daily Energy Expenditure)
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const calculatedTDEE = calculatedBMR * activityMultipliers[activityLevel];
    setTdee(Math.round(calculatedTDEE));

    // Calculate Ideal Weight Range based on sport-specific BMI range
    const sportProfile = sportProfiles[sportType] || sportProfiles.general;
    const idealWeightMin =
      sportProfile.idealBmiRange[0] * (heightInMeters * heightInMeters);
    const idealWeightMax =
      sportProfile.idealBmiRange[1] * (heightInMeters * heightInMeters);
    setIdealWeight({
      min: parseFloat(idealWeightMin.toFixed(1)),
      max: parseFloat(idealWeightMax.toFixed(1)),
    });

    // Calculate Athletic Performance Score (simplified metric for demonstration)
    let score = 0;
    let message = "";

    // Check if BMI is in ideal range for the sport
    if (
      calculatedBMI >= sportProfile.idealBmiRange[0] &&
      calculatedBMI <= sportProfile.idealBmiRange[1]
    ) {
      score += 50;
    } else {
      const distanceFromIdeal = Math.min(
        Math.abs(calculatedBMI - sportProfile.idealBmiRange[0]),
        Math.abs(calculatedBMI - sportProfile.idealBmiRange[1]),
      );
      score += Math.max(0, 50 - distanceFromIdeal * 10);
    }

    // Add points for body composition if available
    if (calculatedBodyFat !== null) {
      if (gender === "male") {
        if (calculatedBodyFat < 10) score += 50;
        else if (calculatedBodyFat < 15) score += 40;
        else if (calculatedBodyFat < 20) score += 30;
        else if (calculatedBodyFat < 25) score += 20;
        else score += 10;
      } else {
        if (calculatedBodyFat < 18) score += 50;
        else if (calculatedBodyFat < 22) score += 40;
        else if (calculatedBodyFat < 26) score += 30;
        else if (calculatedBodyFat < 32) score += 20;
        else score += 10;
      }
    } else {
      // If body fat not available, estimate from BMI
      score += Math.max(
        0,
        30 -
          Math.abs(
            calculatedBMI -
              (sportProfile.idealBmiRange[0] + sportProfile.idealBmiRange[1]) /
                2,
          ) *
            5,
      );
    }

    // Set performance message based on score
    if (score >= 90) {
      message = "Excellent! Your metrics are optimal for your chosen sport.";
    } else if (score >= 70) {
      message = "Good! Your metrics are well-suited for your chosen sport.";
    } else if (score >= 50) {
      message = "Average. Some improvements could enhance your performance.";
    } else if (score >= 30) {
      message =
        "Below average. Consider adjusting your training and nutrition.";
    } else {
      message =
        "Needs improvement. Focus on reaching the ideal metrics for your sport.";
    }

    setPerformanceScore(score);
    setPerformanceMessage(message);
  };

  const handleHeightChange = (value: number[]) => {
    setHeight(value[0]);
  };

  const handleWeightChange = (value: number[]) => {
    setWeight(value[0]);
  };

  const resetForm = () => {
    setHeight(175);
    setWeight(70);
    setAge(30);
    setGender("male");
    setUnits("metric");
    setNeckCircumference(null);
    setWaistCircumference(null);
    setHipCircumference(null);
    setActivityLevel("moderate");
    setSportType("general");
    setFitnessGoal("maintain");

    // Reset results
    setBmi(null);
    setBmiCategory("");
    setBmiColor("");
    setBodyFat(null);
    setBodyFatCategory("");
    setLeanMass(null);
    setBmr(null);
    setTdee(null);
    setIdealWeight(null);
    setPerformanceScore(0);
    setPerformanceMessage("");

    // Set a new random motivational quote
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setMotivationalQuote(motivationalQuotes[randomIndex]);
  };

  const saveResults = () => {
    if (!bmi) return;

    // In a real app, this would save to the database
    alert("Results saved successfully!");

    // Example of data to be sent to the server
    const dataToSave = {
      date: new Date().toISOString(),
      height,
      weight,
      bmi,
      bodyFat,
      bmr,
      tdee,
      sportType,
      activityLevel,
    };

    console.log("Data to save:", dataToSave);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Athletic Performance Calculator
            </h1>
            <p className="mt-2 opacity-90">
              Optimize your metrics for peak performance
            </p>
          </div>
          <div className="hidden md:block">
            <Trophy className="h-16 w-16 text-yellow-300" />
          </div>
        </div>
        <div className="mt-4 p-4 bg-white/10 rounded-md">
          <p className="italic font-medium text-center">
            "{motivationalQuote}"
          </p>
        </div>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator" className="text-base">
            <Dumbbell className="mr-2 h-4 w-4" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="results" className="text-base">
            <BarChart className="mr-2 h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-base">
            <Zap className="mr-2 h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-4">
          <Card className="border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center text-xl">
                <Scale className="h-5 w-5 mr-2 text-blue-600" />
                Body Metrics
              </CardTitle>
              <CardDescription>
                Enter your measurements for accurate calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="units">Units</Label>
                    <div className="flex mt-1 space-x-2">
                      <Button
                        variant={units === "metric" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setUnits("metric")}
                      >
                        Metric (cm, kg)
                      </Button>
                      <Button
                        variant={units === "imperial" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setUnits("imperial")}
                      >
                        Imperial (in, lb)
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <div className="flex mt-1 space-x-2">
                      <Button
                        variant={gender === "male" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setGender("male")}
                      >
                        Male
                      </Button>
                      <Button
                        variant={gender === "female" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setGender("female")}
                      >
                        Female
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="height" className="flex items-center">
                        <Ruler className="h-4 w-4 mr-1 text-blue-600" />
                        Height ({units === "metric" ? "cm" : "in"})
                      </Label>
                      <span className="text-sm font-medium">
                        {height} {units === "metric" ? "cm" : "in"}
                      </span>
                    </div>
                    <Slider
                      id="height"
                      min={units === "metric" ? 100 : 39}
                      max={units === "metric" ? 220 : 87}
                      step={units === "metric" ? 1 : 0.5}
                      value={[height]}
                      onValueChange={handleHeightChange}
                      className="py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="weight" className="flex items-center">
                        <Scale className="h-4 w-4 mr-1 text-blue-600" />
                        Weight ({units === "metric" ? "kg" : "lb"})
                      </Label>
                      <span className="text-sm font-medium">
                        {weight} {units === "metric" ? "kg" : "lb"}
                      </span>
                    </div>
                    <Slider
                      id="weight"
                      min={units === "metric" ? 30 : 66}
                      max={units === "metric" ? 200 : 440}
                      step={units === "metric" ? 0.5 : 1}
                      value={[weight]}
                      onValueChange={handleWeightChange}
                      className="py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="flex items-center">
                      <span className="mr-1">🗓️</span> Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 30)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border-2 border-blue-100 rounded-md space-y-4 bg-blue-50/50">
                    <h3 className="font-medium flex items-center text-blue-800">
                      <Activity className="h-4 w-4 mr-2" />
                      Body Composition Measurements
                    </h3>
                    <p className="text-sm text-blue-700">
                      For accurate body fat percentage calculation, enter these
                      measurements:
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="neckCircumference">
                        Neck Circumference ({units === "metric" ? "cm" : "in"})
                      </Label>
                      <Input
                        id="neckCircumference"
                        type="number"
                        value={neckCircumference || ""}
                        onChange={(e) =>
                          setNeckCircumference(
                            parseFloat(e.target.value) || null,
                          )
                        }
                        placeholder={`e.g., ${units === "metric" ? "38" : "15"}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="waistCircumference">
                        Waist Circumference ({units === "metric" ? "cm" : "in"})
                      </Label>
                      <Input
                        id="waistCircumference"
                        type="number"
                        value={waistCircumference || ""}
                        onChange={(e) =>
                          setWaistCircumference(
                            parseFloat(e.target.value) || null,
                          )
                        }
                        placeholder={`e.g., ${units === "metric" ? "85" : "33"}`}
                      />
                    </div>

                    {gender === "female" && (
                      <div className="space-y-2">
                        <Label htmlFor="hipCircumference">
                          Hip Circumference ({units === "metric" ? "cm" : "in"})
                        </Label>
                        <Input
                          id="hipCircumference"
                          type="number"
                          value={hipCircumference || ""}
                          onChange={(e) =>
                            setHipCircumference(
                              parseFloat(e.target.value) || null,
                            )
                          }
                          placeholder={`e.g., ${units === "metric" ? "90" : "35"}`}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="activityLevel"
                      className="flex items-center"
                    >
                      <Flame className="h-4 w-4 mr-1 text-orange-500" />
                      Activity Level
                    </Label>
                    <Select
                      value={activityLevel}
                      onValueChange={setActivityLevel}
                    >
                      <SelectTrigger id="activityLevel">
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">
                          Sedentary (little or no exercise)
                        </SelectItem>
                        <SelectItem value="light">
                          Light (1-3 days/week)
                        </SelectItem>
                        <SelectItem value="moderate">
                          Moderate (3-5 days/week)
                        </SelectItem>
                        <SelectItem value="active">
                          Active (6-7 days/week)
                        </SelectItem>
                        <SelectItem value="very_active">
                          Very Active (2x/day)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sportType" className="flex items-center">
                      <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                      Sport/Activity Type
                    </Label>
                    <Select value={sportType} onValueChange={setSportType}>
                      <SelectTrigger id="sportType">
                        <SelectValue placeholder="Select sport or activity type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Fitness</SelectItem>
                        <SelectItem value="running">Running</SelectItem>
                        <SelectItem value="swimming">Swimming</SelectItem>
                        <SelectItem value="cycling">Cycling</SelectItem>
                        <SelectItem value="weightlifting">
                          Weightlifting
                        </SelectItem>
                        <SelectItem value="crossfit">CrossFit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fitnessGoal" className="flex items-center">
                      <Zap className="h-4 w-4 mr-1 text-purple-500" />
                      Fitness Goal
                    </Label>
                    <Select value={fitnessGoal} onValueChange={setFitnessGoal}>
                      <SelectTrigger id="fitnessGoal">
                        <SelectValue placeholder="Select your fitness goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose">Lose Weight</SelectItem>
                        <SelectItem value="maintain">
                          Maintain Weight
                        </SelectItem>
                        <SelectItem value="gain">Gain Muscle</SelectItem>
                        <SelectItem value="performance">
                          Improve Performance
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
              <Button onClick={calculateMetrics}>
                Calculate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-4">
          <Card className="border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center text-xl">
                <BarChart className="h-5 w-5 mr-2 text-blue-600" />
                Your Results
              </CardTitle>
              <CardDescription>
                Comprehensive analysis of your body metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {bmi ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <h3 className="text-lg font-medium mb-4 text-blue-800">
                        Body Mass Index (BMI)
                      </h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Your BMI:</span>
                        <span className={`text-2xl font-bold ${bmiColor}`}>
                          {bmi}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-700">Category:</span>
                        <Badge
                          className={`${bmiColor.replace("text", "bg")}/20 ${bmiColor}`}
                        >
                          {bmiCategory}
                        </Badge>
                      </div>

                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                          <div
                            style={{ width: "20%" }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                          ></div>
                          <div
                            style={{ width: "20%" }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          ></div>
                          <div
                            style={{ width: "20%" }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
                          ></div>
                          <div
                            style={{ width: "20%" }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"
                          ></div>
                          <div
                            style={{ width: "20%" }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                          ></div>
                        </div>
                        <div
                          className="absolute h-4 w-4 rounded-full bg-black -mt-3"
                          style={{
                            left: `${Math.min(Math.max((bmi - 10) * 3, 0), 100)}%`,
                          }}
                        ></div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>16</span>
                          <span>18.5</span>
                          <span>25</span>
                          <span>30</span>
                          <span>35</span>
                          <span>40</span>
                        </div>
                      </div>
                    </div>

                    {bodyFat !== null && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                        <h3 className="text-lg font-medium mb-4 text-green-800">
                          Body Fat Percentage
                        </h3>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">Your Body Fat:</span>
                          <span className="text-2xl font-bold text-green-600">
                            {bodyFat}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-700">Category:</span>
                          <Badge className="bg-green-100 text-green-800">
                            {bodyFatCategory}
                          </Badge>
                        </div>

                        {leanMass !== null && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">Lean Mass:</span>
                            <span className="font-medium">
                              {leanMass} {units === "metric" ? "kg" : "lb"}
                            </span>
                          </div>
                        )}

                        <div className="mt-2 text-sm text-green-700">
                          Body fat percentage is a better indicator of fitness
                          than BMI alone, especially for athletes.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
                      <h3 className="text-lg font-medium mb-4 text-orange-800">
                        Metabolic Information
                      </h3>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <Flame className="h-4 w-4 mr-2 text-orange-500" />
                          <span className="text-gray-700">
                            Basal Metabolic Rate:
                          </span>
                        </div>
                        <span className="text-xl font-bold text-orange-600">
                          {bmr} calories/day
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 mr-2 text-orange-500" />
                          <span className="text-gray-700">
                            Daily Energy Expenditure:
                          </span>
                        </div>
                        <span className="text-xl font-bold text-orange-600">
                          {tdee} calories/day
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-orange-700">
                        {fitnessGoal === "lose" && (
                          <>
                            For weight loss, aim for {Math.round(tdee! * 0.8)}{" "}
                            calories/day (20% deficit).
                          </>
                        )}
                        {fitnessGoal === "maintain" && (
                          <>
                            To maintain weight, consume approximately {tdee}{" "}
                            calories/day.
                          </>
                        )}
                        {fitnessGoal === "gain" && (
                          <>
                            For muscle gain, aim for {Math.round(tdee! * 1.1)}{" "}
                            calories/day (10% surplus).
                          </>
                        )}
                        {fitnessGoal === "performance" && (
                          <>
                            For optimal performance, focus on nutrient timing
                            and quality rather than just total calories.
                          </>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                      <h3 className="text-lg font-medium mb-4 text-purple-800">
                        Ideal Weight Range
                      </h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">
                          For {sportProfiles[sportType].name}:
                        </span>
                        <span className="text-xl font-bold text-purple-600">
                          {idealWeight?.min} - {idealWeight?.max}{" "}
                          {units === "metric" ? "kg" : "lb"}
                        </span>
                      </div>

                      <div className="mt-4 text-sm text-purple-700">
                        This range is based on the ideal BMI range for{" "}
                        {sportProfiles[sportType].name.toLowerCase()}(
                        {sportProfiles[sportType].idealBmiRange[0]} -{" "}
                        {sportProfiles[sportType].idealBmiRange[1]}).
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">
                            Current Weight:
                          </span>
                          <span className="text-xs font-medium">
                            {weight} {units === "metric" ? "kg" : "lb"}
                          </span>
                        </div>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                            <div
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                              style={{ width: "100%" }}
                            ></div>
                          </div>
                          <div
                            className="absolute h-4 w-4 rounded-full bg-black -mt-3"
                            style={{
                              left: `${Math.min(Math.max(((weight - idealWeight!.min) / (idealWeight!.max - idealWeight!.min)) * 100, 0), 100)}%`,
                            }}
                          ></div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{idealWeight?.min}</span>
                            <span>{idealWeight?.max}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 mx-auto text-blue-300 mb-4" />
                  <p className="text-gray-500">
                    Complete the calculator form to see your results
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      document
                        .querySelector('[data-value="calculator"]')
                        ?.click()
                    }
                  >
                    Go to Calculator
                  </Button>
                </div>
              )}
            </CardContent>
            {bmi && (
              <CardFooter className="flex justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                <Button
                  variant="outline"
                  onClick={() =>
                    document.querySelector('[data-value="calculator"]')?.click()
                  }
                >
                  Back to Calculator
                </Button>
                <Button onClick={saveResults}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Results
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center text-xl">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Athletic Performance Analysis
              </CardTitle>
              <CardDescription>
                How your metrics align with your chosen sport
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {bmi ? (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-amber-800">
                        Performance Score
                      </h3>
                      <Badge className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1">
                        {performanceScore}/100
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">
                          Needs Improvement
                        </span>
                        <span className="text-xs text-gray-600">Excellent</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-gradient-to-r from-yellow-400 to-green-500 rounded-full"
                          style={{ width: `${performanceScore}%` }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-amber-700 font-medium">
                      {performanceMessage}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <h3 className="text-lg font-medium mb-4 text-blue-800">
                        Sport-Specific Analysis
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Sport:</span>
                          <span className="font-medium">
                            {sportProfiles[sportType].name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            Ideal BMI Range:
                          </span>
                          <span className="font-medium">
                            {sportProfiles[sportType].idealBmiRange[0]} -{" "}
                            {sportProfiles[sportType].idealBmiRange[1]}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Your BMI:</span>
                          <span className={`font-medium ${bmiColor}`}>
                            {bmi}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">BMI Status:</span>
                          <Badge
                            variant="outline"
                            className={
                              bmi >=
                                sportProfiles[sportType].idealBmiRange[0] &&
                              bmi <= sportProfiles[sportType].idealBmiRange[1]
                                ? "bg-green-50 text-green-700"
                                : "bg-yellow-50 text-yellow-700"
                            }
                          >
                            {bmi >= sportProfiles[sportType].idealBmiRange[0] &&
                            bmi <= sportProfiles[sportType].idealBmiRange[1]
                              ? "Optimal"
                              : "Outside Optimal Range"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                      <h3 className="text-lg font-medium mb-4 text-green-800">
                        Recommendations
                      </h3>
                      <div className="space-y-4">
                        {bmi < sportProfiles[sportType].idealBmiRange[0] && (
                          <p className="text-sm text-gray-700">
                            Your BMI is below the ideal range for{" "}
                            {sportProfiles[sportType].name.toLowerCase()}.
                            Consider increasing caloric intake and focusing on
                            strength training to build muscle mass.
                          </p>
                        )}

                        {bmi > sportProfiles[sportType].idealBmiRange[1] && (
                          <p className="text-sm text-gray-700">
                            Your BMI is above the ideal range for{" "}
                            {sportProfiles[sportType].name.toLowerCase()}.
                            Consider a moderate caloric deficit while
                            maintaining adequate protein intake to preserve
                            muscle mass.
                          </p>
                        )}

                        {bmi >= sportProfiles[sportType].idealBmiRange[0] &&
                          bmi <= sportProfiles[sportType].idealBmiRange[1] && (
                            <p className="text-sm text-gray-700">
                              Your BMI is within the ideal range for{" "}
                              {sportProfiles[sportType].name.toLowerCase()}.
                              Focus on maintaining your current body composition
                              while improving sport-specific skills.
                            </p>
                          )}

                        {bodyFat !== null && (
                          <p className="text-sm text-gray-700 mt-2">
                            With a body fat percentage of {bodyFat}%, you are in
                            the {bodyFatCategory?.toLowerCase()} range.
                            {bodyFatCategory === "Athletic" ||
                            bodyFatCategory === "Fitness"
                              ? " This is excellent for athletic performance."
                              : " Consider body recomposition to optimize your performance."}
                          </p>
                        )}

                        <p className="text-sm text-gray-700 mt-2">
                          Your daily energy needs are approximately {tdee}{" "}
                          calories.
                          {fitnessGoal === "lose" &&
                            " Aim for a moderate deficit of 300-500 calories for sustainable fat loss."}
                          {fitnessGoal === "maintain" &&
                            " Focus on nutrient timing and quality to support your training."}
                          {fitnessGoal === "gain" &&
                            " Aim for a moderate surplus of 300-500 calories to support muscle growth."}
                          {fitnessGoal === "performance" &&
                            " Prioritize carbohydrate intake around training sessions for optimal performance."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-blue-100 rounded-lg bg-white">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                      Next Steps for Improvement
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                          <span className="text-blue-700 text-xs font-bold">
                            1
                          </span>
                        </div>
                        <p className="text-gray-700">
                          {bmi < sportProfiles[sportType].idealBmiRange[0]
                            ? "Increase caloric intake by 300-500 calories daily with focus on protein and complex carbohydrates."
                            : bmi > sportProfiles[sportType].idealBmiRange[1]
                              ? "Create a moderate caloric deficit of 300-500 calories daily while maintaining protein intake."
                              : "Maintain current caloric intake with focus on nutrient timing around training sessions."}
                        </p>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                          <span className="text-blue-700 text-xs font-bold">
                            2
                          </span>
                        </div>
                        <p className="text-gray-700">
                          {sportType === "running" &&
                            "Incorporate interval training and hill repeats to improve running economy."}
                          {sportType === "swimming" &&
                            "Focus on technique drills and include strength training for shoulders and back."}
                          {sportType === "cycling" &&
                            "Include both high-intensity intervals and longer endurance rides in your training."}
                          {sportType === "weightlifting" &&
                            "Prioritize compound movements and progressive overload in your training program."}
                          {sportType === "crossfit" &&
                            "Balance strength work with metabolic conditioning and skill development."}
                          {sportType === "general" &&
                            "Include a mix of strength training, cardiovascular exercise, and flexibility work."}
                        </p>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                          <span className="text-blue-700 text-xs font-bold">
                            3
                          </span>
                        </div>
                        <p className="text-gray-700">
                          Track your progress by reassessing your metrics every
                          4-6 weeks and adjusting your approach as needed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 mx-auto text-yellow-300 mb-4" />
                  <p className="text-gray-500">
                    Complete the calculator form to see your performance
                    analysis
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      document
                        .querySelector('[data-value="calculator"]')
                        ?.click()
                    }
                  >
                    Go to Calculator
                  </Button>
                </div>
              )}
            </CardContent>
            {bmi && (
              <CardFooter className="flex justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                <Button
                  variant="outline"
                  onClick={() =>
                    document.querySelector('[data-value="results"]')?.click()
                  }
                >
                  View Results
                </Button>
                <Button onClick={saveResults}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Analysis
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
