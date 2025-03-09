import { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "./alert";
import { Dumbbell, Heart, Activity, Info, BarChart } from "lucide-react";

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  bodyFat?: number;
  leanMass?: number;
  adjustedBMI?: number;
  recommendation?: string;
}

interface SportProfile {
  name: string;
  idealBmiRange: string;
  description: string;
  icon: React.ReactNode;
}

export function ProfessionalBMICalculator() {
  // Basic inputs
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(70);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");

  // Advanced inputs
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [neckCircumference, setNeckCircumference] = useState<number | null>(
    null,
  );
  const [waistCircumference, setWaistCircumference] = useState<number | null>(
    null,
  );
  const [hipCircumference, setHipCircumference] = useState<number | null>(null);
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [sportType, setSportType] = useState<string>("general");
  const [emotionalState, setEmotionalState] = useState<string>("none");

  // Results
  const [result, setResult] = useState<BMIResult | null>(null);
  const [showAdvancedResults, setShowAdvancedResults] = useState(false);

  // Sport profiles
  const sportProfiles: Record<string, SportProfile> = {
    running: {
      name: "Running",
      idealBmiRange: "18.5-22.0",
      description:
        "Distance runners typically maintain lower BMI values for optimal performance.",
      icon: <Activity className="h-5 w-5" />,
    },
    swimming: {
      name: "Swimming",
      idealBmiRange: "21.0-24.0",
      description:
        "Swimmers often have higher muscle mass and slightly higher BMI with low body fat.",
      icon: <Activity className="h-5 w-5" />,
    },
    cycling: {
      name: "Cycling",
      idealBmiRange: "20.0-23.0",
      description:
        "Cyclists benefit from a good power-to-weight ratio with moderate BMI values.",
      icon: <Activity className="h-5 w-5" />,
    },
    weightlifting: {
      name: "Weightlifting",
      idealBmiRange: "23.0-27.5",
      description:
        "Weightlifters typically have higher BMI due to increased muscle mass.",
      icon: <Dumbbell className="h-5 w-5" />,
    },
    basketball: {
      name: "Basketball",
      idealBmiRange: "22.0-25.0",
      description:
        "Basketball players benefit from a balance of strength and agility.",
      icon: <Activity className="h-5 w-5" />,
    },
    football: {
      name: "Football",
      idealBmiRange: "23.0-28.0",
      description:
        "Football players often have higher BMI values, varying by position.",
      icon: <Activity className="h-5 w-5" />,
    },
    soccer: {
      name: "Soccer",
      idealBmiRange: "21.0-24.0",
      description:
        "Soccer players typically maintain moderate BMI values for endurance and speed.",
      icon: <Activity className="h-5 w-5" />,
    },
    tennis: {
      name: "Tennis",
      idealBmiRange: "21.0-24.0",
      description:
        "Tennis players benefit from a balance of strength and agility with moderate BMI.",
      icon: <Activity className="h-5 w-5" />,
    },
    gymnastics: {
      name: "Gymnastics",
      idealBmiRange: "19.0-22.0",
      description:
        "Gymnasts typically maintain lower BMI values for optimal strength-to-weight ratio.",
      icon: <Activity className="h-5 w-5" />,
    },
    crossfit: {
      name: "CrossFit",
      idealBmiRange: "22.0-26.0",
      description:
        "CrossFit athletes often have higher muscle mass and moderate BMI values.",
      icon: <Dumbbell className="h-5 w-5" />,
    },
  };

  // Calculate BMI when inputs change
  useEffect(() => {
    calculateBMI();
  }, [
    height,
    weight,
    age,
    gender,
    units,
    bodyFat,
    activityLevel,
    sportType,
    emotionalState,
  ]);

  const calculateBMI = () => {
    if (!height || !weight) return;

    let bmiValue: number;
    let heightInMeters: number;
    let weightInKg: number;

    if (units === "metric") {
      heightInMeters = height / 100;
      weightInKg = weight;
    } else {
      // Convert imperial to metric
      heightInMeters = height * 0.0254; // inches to meters
      weightInKg = weight * 0.453592; // pounds to kg
    }

    // Standard BMI calculation
    bmiValue = weightInKg / (heightInMeters * heightInMeters);

    // Determine BMI category
    let category: string;
    let color: string;

    if (bmiValue < 18.5) {
      category = "Underweight";
      color = "text-blue-500";
    } else if (bmiValue < 25) {
      category = "Normal weight";
      color = "text-green-500";
    } else if (bmiValue < 30) {
      category = "Overweight";
      color = "text-yellow-500";
    } else if (bmiValue < 35) {
      category = "Obesity (Class 1)";
      color = "text-orange-500";
    } else if (bmiValue < 40) {
      category = "Obesity (Class 2)";
      color = "text-red-500";
    } else {
      category = "Obesity (Class 3)";
      color = "text-red-700";
    }

    // Advanced calculations
    let bodyFatPercentage = bodyFat;
    let leanMass = null;
    let adjustedBMI = null;
    let recommendation = "";

    // Estimate body fat if not provided but we have circumference measurements
    if (bodyFatPercentage === null && neckCircumference && waistCircumference) {
      if (
        gender === "male" &&
        neckCircumference > 0 &&
        waistCircumference > 0
      ) {
        // Navy method for males
        const logValue = Math.log10(waistCircumference - neckCircumference);
        bodyFatPercentage =
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
        bodyFatPercentage =
          163.205 * logValue -
          97.684 * Math.log10(heightInMeters * 100) -
          104.912;
      }
    }

    // Calculate lean mass if we have body fat percentage
    if (bodyFatPercentage !== null) {
      leanMass = weightInKg * (1 - bodyFatPercentage / 100);

      // Adjusted BMI considering body composition
      adjustedBMI =
        (leanMass / (heightInMeters * heightInMeters)) *
        (1 + (bodyFatPercentage / 100) * 0.4);
    }

    // Sport-specific recommendations
    if (sportType && sportProfiles[sportType]) {
      const profile = sportProfiles[sportType];
      const [minBmi, maxBmi] = profile.idealBmiRange.split("-").map(Number);

      if (bmiValue < minBmi) {
        recommendation = `Your BMI is below the ideal range for ${profile.name} (${profile.idealBmiRange}). ${profile.description} Consider a nutrition plan to build more muscle mass.`;
      } else if (bmiValue > maxBmi) {
        recommendation = `Your BMI is above the ideal range for ${profile.name} (${profile.idealBmiRange}). ${profile.description} Consider adjusting your body composition for optimal performance.`;
      } else {
        recommendation = `Your BMI is within the ideal range for ${profile.name} (${profile.idealBmiRange}). ${profile.description} Focus on maintaining your current body composition while improving sport-specific skills.`;
      }
    }

    // Emotional state adjustments
    if (emotionalState) {
      switch (emotionalState) {
        case "stressed":
          recommendation +=
            " Consider incorporating stress-reduction techniques like meditation or yoga into your routine, as chronic stress can affect weight management.";
          break;
        case "depressed":
          recommendation +=
            " Regular physical activity can help improve mood. Consider speaking with a healthcare professional about how exercise can be part of your overall mental health plan.";
          break;
        case "anxious":
          recommendation +=
            " Low to moderate intensity exercise can help reduce anxiety. Focus on activities you enjoy and that make you feel good.";
          break;
        case "motivated":
          recommendation +=
            " Your positive mindset is a great asset! Channel this motivation into consistent habits for long-term success.";
          break;
        case "fatigued":
          recommendation +=
            " Consider evaluating your sleep quality and recovery practices. Proper rest is essential for both physical and mental performance.";
          break;
      }
    }

    setResult({
      bmi: parseFloat(bmiValue.toFixed(1)),
      category,
      color,
      bodyFat:
        bodyFatPercentage !== null
          ? parseFloat(bodyFatPercentage.toFixed(1))
          : undefined,
      leanMass: leanMass !== null ? parseFloat(leanMass.toFixed(1)) : undefined,
      adjustedBMI:
        adjustedBMI !== null ? parseFloat(adjustedBMI.toFixed(1)) : undefined,
      recommendation,
    });
  };

  const handleHeightChange = (value: number[]) => {
    setHeight(value[0]);
  };

  const handleWeightChange = (value: number[]) => {
    setWeight(value[0]);
  };

  const handleBodyFatChange = (value: number[]) => {
    setBodyFat(value[0]);
  };

  const resetForm = () => {
    setHeight(175);
    setWeight(70);
    setAge(30);
    setGender("male");
    setUnits("metric");
    setBodyFat(null);
    setNeckCircumference(null);
    setWaistCircumference(null);
    setHipCircumference(null);
    setActivityLevel("moderate");
    setSportType("");
    setEmotionalState("");
    setResult(null);
  };

  const saveResults = () => {
    if (!result) return;

    // In a real app, this would save to the database
    alert("Results saved successfully!");

    // Example of data to be sent to the server
    const dataToSave = {
      height,
      weight,
      bmi: result.bmi,
      bodyFat: result.bodyFat,
      activityLevel,
      sportType,
      emotionalState,
      date: new Date().toISOString(),
    };

    console.log("Data to save:", dataToSave);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic" className="text-base">
            Basic Calculator
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-base">
            Advanced Analysis
          </TabsTrigger>
        </TabsList>

        {/* Basic Calculator Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Professional BMI Calculator
              </CardTitle>
              <CardDescription>
                Calculate your Body Mass Index (BMI) to assess your weight
                relative to height
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                      <Label htmlFor="height">
                        Height ({units === "metric" ? "cm" : "in"})
                      </Label>
                      <span className="text-sm text-muted-foreground">
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
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="weight">
                        Weight ({units === "metric" ? "kg" : "lb"})
                      </Label>
                      <span className="text-sm text-muted-foreground">
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
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
                  {result && (
                    <div className="space-y-4">
                      <div className="text-center p-6 bg-muted rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Your BMI</h3>
                        <p className={`text-4xl font-bold ${result.color}`}>
                          {result.bmi}
                        </p>
                        <p
                          className={`text-lg font-medium mt-2 ${result.color}`}
                        >
                          {result.category}
                        </p>
                      </div>

                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                              Underweight
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                              Obese
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
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
                            left: `${Math.min(Math.max((result.bmi - 10) * 3, 0), 100)}%`,
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

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          BMI is a screening tool, not a diagnostic tool.
                          Consult with a healthcare provider for a complete
                          health assessment.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
              <Button onClick={calculateBMI}>Calculate BMI</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Advanced Analysis Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Advanced Body Composition Analysis
              </CardTitle>
              <CardDescription>
                Get a more comprehensive assessment with additional measurements
                and factors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="bodyFat">Body Fat Percentage (%)</Label>
                      {bodyFat !== null && (
                        <span className="text-sm text-muted-foreground">
                          {bodyFat}%
                        </span>
                      )}
                    </div>
                    {bodyFat !== null ? (
                      <Slider
                        id="bodyFat"
                        min={5}
                        max={50}
                        step={0.1}
                        value={[bodyFat]}
                        onValueChange={handleBodyFatChange}
                      />
                    ) : (
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Enter body fat %"
                          onChange={(e) =>
                            setBodyFat(parseFloat(e.target.value) || null)
                          }
                        />
                        <Button
                          variant="outline"
                          onClick={() => setBodyFat(null)}
                          className="whitespace-nowrap"
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border rounded-md space-y-4">
                    <h3 className="font-medium">
                      Navy Method Body Fat Estimation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      If you don't know your body fat percentage, enter these
                      measurements to estimate it:
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
                    <Label htmlFor="activityLevel">Activity Level</Label>
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
                    <Label htmlFor="sportType">Sport/Activity Type</Label>
                    <Select value={sportType} onValueChange={setSportType}>
                      <SelectTrigger id="sportType">
                        <SelectValue placeholder="Select sport or activity type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">
                          None/General Fitness
                        </SelectItem>
                        <SelectItem value="running">Running</SelectItem>
                        <SelectItem value="swimming">Swimming</SelectItem>
                        <SelectItem value="cycling">Cycling</SelectItem>
                        <SelectItem value="weightlifting">
                          Weightlifting
                        </SelectItem>
                        <SelectItem value="basketball">Basketball</SelectItem>
                        <SelectItem value="football">Football</SelectItem>
                        <SelectItem value="soccer">Soccer</SelectItem>
                        <SelectItem value="tennis">Tennis</SelectItem>
                        <SelectItem value="gymnastics">Gymnastics</SelectItem>
                        <SelectItem value="crossfit">CrossFit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emotionalState">Emotional State</Label>
                    <Select
                      value={emotionalState}
                      onValueChange={setEmotionalState}
                    >
                      <SelectTrigger id="emotionalState">
                        <SelectValue placeholder="Select current emotional state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not specified</SelectItem>
                        <SelectItem value="stressed">Stressed</SelectItem>
                        <SelectItem value="depressed">Depressed</SelectItem>
                        <SelectItem value="anxious">Anxious</SelectItem>
                        <SelectItem value="motivated">Motivated</SelectItem>
                        <SelectItem value="fatigued">Fatigued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {result && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <h3 className="text-sm font-medium mb-1">
                            Standard BMI
                          </h3>
                          <p className={`text-2xl font-bold ${result.color}`}>
                            {result.bmi}
                          </p>
                          <p className="text-xs mt-1">{result.category}</p>
                        </div>

                        {result.adjustedBMI && (
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <h3 className="text-sm font-medium mb-1">
                              Adjusted BMI
                            </h3>
                            <p className="text-2xl font-bold">
                              {result.adjustedBMI}
                            </p>
                            <p className="text-xs mt-1">
                              Accounts for body composition
                            </p>
                          </div>
                        )}
                      </div>

                      {(result.bodyFat !== undefined ||
                        result.leanMass !== undefined) && (
                        <div className="grid grid-cols-2 gap-4">
                          {result.bodyFat !== undefined && (
                            <div className="text-center p-4 bg-muted rounded-lg">
                              <h3 className="text-sm font-medium mb-1">
                                Body Fat
                              </h3>
                              <p className="text-2xl font-bold">
                                {result.bodyFat}%
                              </p>
                              <p className="text-xs mt-1">
                                {gender === "male"
                                  ? result.bodyFat < 10
                                    ? "Athletic"
                                    : result.bodyFat < 20
                                      ? "Fitness"
                                      : result.bodyFat < 25
                                        ? "Average"
                                        : "Above Average"
                                  : result.bodyFat < 18
                                    ? "Athletic"
                                    : result.bodyFat < 25
                                      ? "Fitness"
                                      : result.bodyFat < 32
                                        ? "Average"
                                        : "Above Average"}
                              </p>
                            </div>
                          )}

                          {result.leanMass !== undefined && (
                            <div className="text-center p-4 bg-muted rounded-lg">
                              <h3 className="text-sm font-medium mb-1">
                                Lean Mass
                              </h3>
                              <p className="text-2xl font-bold">
                                {result.leanMass}{" "}
                                {units === "metric" ? "kg" : "lb"}
                              </p>
                              <p className="text-xs mt-1">
                                Muscle, bone, and organs
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {sportType && sportProfiles[sportType] && (
                        <div className="p-4 border rounded-md bg-blue-50">
                          <div className="flex items-center mb-2">
                            {sportProfiles[sportType].icon}
                            <h3 className="font-medium ml-2">
                              {sportProfiles[sportType].name} Profile
                            </h3>
                          </div>
                          <p className="text-sm">
                            Ideal BMI Range:{" "}
                            {sportProfiles[sportType].idealBmiRange}
                          </p>
                          <p className="text-sm mt-1">
                            {sportProfiles[sportType].description}
                          </p>
                        </div>
                      )}

                      {result.recommendation && (
                        <div className="p-4 border rounded-md">
                          <h3 className="font-medium mb-2">
                            Personalized Recommendation
                          </h3>
                          <p className="text-sm">{result.recommendation}</p>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setShowAdvancedResults(!showAdvancedResults)
                          }
                        >
                          {showAdvancedResults
                            ? "Hide Details"
                            : "Show More Details"}
                        </Button>
                        <Button onClick={saveResults}>Save Results</Button>
                      </div>

                      {showAdvancedResults && (
                        <div className="space-y-4">
                          <h3 className="font-medium">Advanced Metrics</h3>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 border rounded-md">
                              <h4 className="text-sm font-medium">
                                Basal Metabolic Rate (BMR)
                              </h4>
                              <p className="text-xl font-bold mt-1">
                                {Math.round(
                                  gender === "male"
                                    ? 88.362 +
                                        13.397 * weight +
                                        4.799 * height -
                                        5.677 * age
                                    : 447.593 +
                                        9.247 * weight +
                                        3.098 * height -
                                        4.33 * age,
                                )}{" "}
                                kcal/day
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Calories burned at complete rest
                              </p>
                            </div>

                            <div className="p-3 border rounded-md">
                              <h4 className="text-sm font-medium">
                                Daily Calorie Needs
                              </h4>
                              <p className="text-xl font-bold mt-1">
                                {Math.round(
                                  (gender === "male"
                                    ? 88.362 +
                                      13.397 * weight +
                                      4.799 * height -
                                      5.677 * age
                                    : 447.593 +
                                      9.247 * weight +
                                      3.098 * height -
                                      4.33 * age) *
                                    (activityLevel === "sedentary"
                                      ? 1.2
                                      : activityLevel === "light"
                                        ? 1.375
                                        : activityLevel === "moderate"
                                          ? 1.55
                                          : activityLevel === "active"
                                            ? 1.725
                                            : 1.9),
                                )}{" "}
                                kcal/day
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Based on your activity level
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 border rounded-md">
                              <h4 className="text-sm font-medium">
                                Ideal Weight Range
                              </h4>
                              <p className="text-xl font-bold mt-1">
                                {Math.round(
                                  18.5 * (height / 100) * (height / 100) * 10,
                                ) / 10}{" "}
                                -{" "}
                                {Math.round(
                                  24.9 * (height / 100) * (height / 100) * 10,
                                ) / 10}{" "}
                                {units === "metric" ? "kg" : "lb"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Based on healthy BMI range (18.5-24.9)
                              </p>
                            </div>

                            <div className="p-3 border rounded-md">
                              <h4 className="text-sm font-medium">
                                Body Surface Area
                              </h4>
                              <p className="text-xl font-bold mt-1">
                                {Math.round(
                                  Math.sqrt((height * weight) / 3600) * 100,
                                ) / 100}{" "}
                                m²
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Used for medical dosing calculations
                              </p>
                            </div>
                          </div>

                          {result.bodyFat !== undefined && (
                            <div className="p-3 border rounded-md">
                              <h4 className="text-sm font-medium">
                                Body Composition Analysis
                              </h4>
                              <div className="mt-2">
                                <div className="flex justify-between text-sm">
                                  <span>Fat Mass:</span>
                                  <span>
                                    {Math.round(
                                      ((weight * result.bodyFat) / 100) * 10,
                                    ) / 10}{" "}
                                    {units === "metric" ? "kg" : "lb"}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Lean Mass:</span>
                                  <span>
                                    {Math.round(
                                      weight * (1 - result.bodyFat / 100) * 10,
                                    ) / 10}{" "}
                                    {units === "metric" ? "kg" : "lb"}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Fat-Free Mass Index:</span>
                                  <span>
                                    {Math.round(
                                      ((weight * (1 - result.bodyFat / 100)) /
                                        ((height / 100) * (height / 100))) *
                                        10,
                                    ) / 10}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
              <Button onClick={calculateBMI}>Calculate</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
