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
import { Dumbbell, Activity, Heart, Brain, Info, Save } from "lucide-react";

interface SportBMIRanges {
  [key: string]: {
    underweight: number;
    normal: [number, number];
    overweight: [number, number];
    obese: number;
    description: string;
  };
}

export function SportSpecificBMICalculator() {
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(70);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<string>("male");
  const [sport, setSport] = useState<string>("general");
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [emotionalState, setEmotionalState] = useState<string>("neutral");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [idealWeight, setIdealWeight] = useState<[number, number] | null>(null);
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("calculator");

  // Sport-specific BMI ranges
  const sportBMIRanges: SportBMIRanges = {
    general: {
      underweight: 18.5,
      normal: [18.5, 24.9],
      overweight: [25, 29.9],
      obese: 30,
      description: "Standard BMI ranges for general health assessment.",
    },
    running: {
      underweight: 18.5,
      normal: [18.5, 22.0],
      overweight: [22.1, 24.9],
      obese: 25,
      description:
        "Distance runners typically maintain lower BMI values for optimal performance and efficiency.",
    },
    swimming: {
      underweight: 19,
      normal: [19, 24],
      overweight: [24.1, 26],
      obese: 26.1,
      description:
        "Swimmers often have higher muscle mass and slightly higher BMI with low body fat percentage.",
    },
    cycling: {
      underweight: 18.5,
      normal: [18.5, 23],
      overweight: [23.1, 25],
      obese: 25.1,
      description:
        "Cyclists benefit from a lean physique with good power-to-weight ratio.",
    },
    weightlifting: {
      underweight: 20,
      normal: [20, 27.5],
      overweight: [27.6, 30],
      obese: 30.1,
      description:
        "Weightlifters typically have higher BMI due to increased muscle mass and strength requirements.",
    },
    basketball: {
      underweight: 19,
      normal: [19, 25],
      overweight: [25.1, 27],
      obese: 27.1,
      description:
        "Basketball players benefit from a balance of strength, speed, and agility.",
    },
    football: {
      underweight: 20,
      normal: [20, 28],
      overweight: [28.1, 32],
      obese: 32.1,
      description:
        "Football players often have higher BMI due to muscle mass, varying by position.",
    },
    soccer: {
      underweight: 19,
      normal: [19, 24],
      overweight: [24.1, 26],
      obese: 26.1,
      description:
        "Soccer players typically maintain a lean physique for endurance and speed.",
    },
    tennis: {
      underweight: 19,
      normal: [19, 24],
      overweight: [24.1, 26],
      obese: 26.1,
      description:
        "Tennis players benefit from a lean, agile physique with good endurance.",
    },
    gymnastics: {
      underweight: 17,
      normal: [17, 22],
      overweight: [22.1, 24],
      obese: 24.1,
      description:
        "Gymnasts typically maintain very low BMI for optimal strength-to-weight ratio and performance.",
    },
    crossfit: {
      underweight: 20,
      normal: [20, 26],
      overweight: [26.1, 28],
      obese: 28.1,
      description:
        "CrossFit athletes develop a balance of muscle mass, strength, and cardiovascular fitness.",
    },
  };

  // Calculate BMI and related metrics when inputs change
  useEffect(() => {
    if (height > 0 && weight > 0) {
      // Calculate BMI
      const heightInMeters = height / 100;
      const calculatedBMI = weight / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBMI.toFixed(1)));

      // Determine BMI category based on sport
      const ranges = sportBMIRanges[sport] || sportBMIRanges.general;
      if (calculatedBMI < ranges.underweight) {
        setBmiCategory("underweight");
      } else if (
        calculatedBMI >= ranges.normal[0] &&
        calculatedBMI <= ranges.normal[1]
      ) {
        setBmiCategory("normal");
      } else if (
        calculatedBMI > ranges.overweight[0] &&
        calculatedBMI < ranges.overweight[1]
      ) {
        setBmiCategory("overweight");
      } else {
        setBmiCategory("obese");
      }

      // Calculate ideal weight range based on sport-specific BMI range
      const minIdealWeight =
        ranges.normal[0] * (heightInMeters * heightInMeters);
      const maxIdealWeight =
        ranges.normal[1] * (heightInMeters * heightInMeters);
      setIdealWeight([
        parseFloat(minIdealWeight.toFixed(1)),
        parseFloat(maxIdealWeight.toFixed(1)),
      ]);

      // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
      let calculatedBMR;
      if (gender === "male") {
        calculatedBMR = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        calculatedBMR = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      setBmr(Math.round(calculatedBMR));

      // Calculate TDEE (Total Daily Energy Expenditure)
      const activityMultipliers: { [key: string]: number } = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
      };
      const calculatedTDEE = calculatedBMR * activityMultipliers[activityLevel];
      setTdee(Math.round(calculatedTDEE));

      // Generate recommendations based on BMI category, sport, and emotional state
      generateRecommendations(calculatedBMI, sport, emotionalState);
    }
  }, [height, weight, age, gender, sport, activityLevel, emotionalState]);

  const generateRecommendations = (
    bmi: number,
    sport: string,
    emotionalState: string,
  ) => {
    const recommendations: string[] = [];
    const ranges = sportBMIRanges[sport] || sportBMIRanges.general;

    // BMI-based recommendations
    if (bmi < ranges.underweight) {
      recommendations.push(
        "Consider increasing caloric intake with nutrient-dense foods to reach an optimal weight for your sport.",
      );
      recommendations.push(
        "Focus on strength training to build muscle mass while gradually increasing weight.",
      );
    } else if (bmi >= ranges.normal[0] && bmi <= ranges.normal[1]) {
      recommendations.push(
        "Your BMI is in the optimal range for your sport. Focus on maintaining your current body composition.",
      );
      recommendations.push(
        "Emphasize performance-specific training and recovery to optimize athletic potential.",
      );
    } else if (bmi > ranges.overweight[0] && bmi < ranges.overweight[1]) {
      recommendations.push(
        "Consider a moderate caloric deficit while maintaining adequate protein intake to preserve muscle mass.",
      );
      recommendations.push(
        "Incorporate more sport-specific conditioning to improve performance metrics.",
      );
    } else {
      recommendations.push(
        "Work with a sports nutritionist to develop a structured plan for reaching your optimal competitive weight.",
      );
      recommendations.push(
        "Focus on gradual, sustainable weight management while maintaining strength and performance.",
      );
    }

    // Sport-specific recommendations
    switch (sport) {
      case "running":
        recommendations.push(
          "Runners should focus on power-to-weight ratio and adequate carbohydrate intake for endurance performance.",
        );
        break;
      case "swimming":
        recommendations.push(
          "Swimmers benefit from a balance of strength and streamlined body composition for optimal performance in water.",
        );
        break;
      case "cycling":
        recommendations.push(
          "Cyclists should focus on leg strength development while maintaining an optimal power-to-weight ratio.",
        );
        break;
      case "weightlifting":
        recommendations.push(
          "Prioritize protein intake and recovery nutrition to support muscle development and strength gains.",
        );
        break;
      case "basketball":
        recommendations.push(
          "Basketball players need a combination of strength, speed, and endurance - focus on all-around conditioning.",
        );
        break;
      case "football":
        recommendations.push(
          "Football players should tailor nutrition and training to position-specific requirements.",
        );
        break;
      case "soccer":
        recommendations.push(
          "Soccer players need excellent cardiovascular fitness and agility - focus on interval training and core strength.",
        );
        break;
      case "tennis":
        recommendations.push(
          "Tennis requires explosive power and endurance - incorporate plyometrics and interval training.",
        );
        break;
      case "gymnastics":
        recommendations.push(
          "Gymnasts need exceptional strength-to-weight ratio - focus on bodyweight exercises and flexibility.",
        );
        break;
      case "crossfit":
        recommendations.push(
          "CrossFit athletes need balanced nutrition to support varied training demands and recovery.",
        );
        break;
    }

    // Emotional state recommendations
    switch (emotionalState) {
      case "stressed":
        recommendations.push(
          "During periods of stress, focus on recovery, sleep quality, and stress-reducing activities like yoga or meditation.",
        );
        break;
      case "anxious":
        recommendations.push(
          "Anxiety can affect performance - incorporate mindfulness techniques and ensure adequate magnesium and B-vitamin intake.",
        );
        break;
      case "depressed":
        recommendations.push(
          "Regular exercise can help improve mood - focus on consistency rather than intensity during low emotional periods.",
        );
        break;
      case "fatigued":
        recommendations.push(
          "Prioritize recovery, sleep, and possibly reduce training volume temporarily. Consider iron levels and overall nutrition.",
        );
        break;
      case "motivated":
        recommendations.push(
          "Channel motivation into structured progression in your training while maintaining proper recovery protocols.",
        );
        break;
      case "confident":
        recommendations.push(
          "Use this positive emotional state to work on challenging aspects of your training that require mental strength.",
        );
        break;
    }

    setRecommendations(recommendations);
  };

  const getBmiCategoryColor = (category: string): string => {
    switch (category) {
      case "underweight":
        return "text-blue-500";
      case "normal":
        return "text-green-500";
      case "overweight":
        return "text-yellow-500";
      case "obese":
        return "text-red-500";
      default:
        return "";
    }
  };

  const getBmiCategoryBadge = (category: string) => {
    switch (category) {
      case "underweight":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Underweight
          </Badge>
        );
      case "normal":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Optimal
          </Badge>
        );
      case "overweight":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Overweight
          </Badge>
        );
      case "obese":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Obese
          </Badge>
        );
      default:
        return null;
    }
  };

  const getEmotionalStateIcon = (state: string) => {
    switch (state) {
      case "stressed":
      case "anxious":
      case "depressed":
        return <Brain className="h-5 w-5 text-purple-500" />;
      case "fatigued":
        return <Activity className="h-5 w-5 text-orange-500" />;
      case "motivated":
      case "confident":
        return <Heart className="h-5 w-5 text-red-500" />;
      default:
        return <Heart className="h-5 w-5 text-gray-500" />;
    }
  };

  const calculateBodyFat = () => {
    if (!bodyFat) {
      // Estimate body fat using BMI (very rough estimation)
      // This is just a simple approximation for demonstration
      let estimatedBodyFat;
      if (gender === "male") {
        estimatedBodyFat = 1.2 * (bmi || 0) + 0.23 * age - 16.2;
      } else {
        estimatedBodyFat = 1.2 * (bmi || 0) + 0.23 * age - 5.4;
      }

      // Ensure reasonable range
      estimatedBodyFat = Math.max(5, Math.min(45, estimatedBodyFat));
      setBodyFat(parseFloat(estimatedBodyFat.toFixed(1)));
    }
  };

  const handleSaveResults = () => {
    // In a real app, this would save to a database
    alert("Results saved to your profile!");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center">
            <Dumbbell className="mr-2 h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Sport-Specific BMI Calculator
              </CardTitle>
              <CardDescription>
                Calculate your BMI with adjustments for your specific sport and
                activity level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      min="100"
                      max="250"
                      value={height}
                      onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min="30"
                      max="200"
                      step="0.1"
                      value={weight}
                      onChange={(e) =>
                        setWeight(parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      min="15"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sport">Sport/Activity Type</Label>
                    <Select value={sport} onValueChange={setSport}>
                      <SelectTrigger id="sport">
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
                        <SelectItem value="basketball">Basketball</SelectItem>
                        <SelectItem value="football">Football</SelectItem>
                        <SelectItem value="soccer">Soccer</SelectItem>
                        <SelectItem value="tennis">Tennis</SelectItem>
                        <SelectItem value="gymnastics">Gymnastics</SelectItem>
                        <SelectItem value="crossfit">CrossFit</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {sportBMIRanges[sport]?.description ||
                        "Select a sport to see specific information."}
                    </p>
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
                          Very Active (2x training/day)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emotionalState">
                      Current Emotional State
                    </Label>
                    <Select
                      value={emotionalState}
                      onValueChange={setEmotionalState}
                    >
                      <SelectTrigger id="emotionalState">
                        <SelectValue placeholder="Select emotional state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="stressed">Stressed</SelectItem>
                        <SelectItem value="anxious">Anxious</SelectItem>
                        <SelectItem value="depressed">Depressed</SelectItem>
                        <SelectItem value="fatigued">Fatigued</SelectItem>
                        <SelectItem value="motivated">Motivated</SelectItem>
                        <SelectItem value="confident">Confident</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="bodyFat">Body Fat % (Optional)</Label>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={calculateBodyFat}
                        className="h-6 p-0"
                      >
                        Estimate
                      </Button>
                    </div>
                    <Input
                      id="bodyFat"
                      type="number"
                      min="5"
                      max="45"
                      step="0.1"
                      value={bodyFat || ""}
                      onChange={(e) =>
                        setBodyFat(
                          e.target.value ? parseFloat(e.target.value) : null,
                        )
                      }
                      placeholder="Enter if known"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("results")}>
                View Results
              </Button>
              <Button onClick={() => setActiveTab("recommendations")}>
                Get Recommendations
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="h-5 w-5 mr-2 text-primary" />
                Your Results
              </CardTitle>
              <CardDescription>
                Detailed analysis of your body composition metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {bmi ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          BMI Analysis
                        </h3>
                        <div className="flex justify-between items-center mb-2">
                          <span>Your BMI:</span>
                          <span className="text-xl font-bold">{bmi}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Category:</span>
                          <span
                            className={`font-medium ${getBmiCategoryColor(bmiCategory)}`}
                          >
                            {getBmiCategoryBadge(bmiCategory)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Ideal Weight Range:</span>
                          <span className="font-medium">
                            {idealWeight
                              ? `${idealWeight[0]} - ${idealWeight[1]} kg`
                              : "--"}
                          </span>
                        </div>
                        {bodyFat && (
                          <div className="flex justify-between items-center mb-2">
                            <span>Body Fat Percentage:</span>
                            <span className="font-medium">{bodyFat}%</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Sport-Specific Context
                        </h3>
                        <div className="p-4 bg-muted/30 rounded-md">
                          <h4 className="font-medium mb-1 capitalize">
                            {sport}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {sportBMIRanges[sport]?.description ||
                              "General fitness assessment"}
                          </p>
                          <div className="text-sm">
                            <div className="flex justify-between mb-1">
                              <span>Optimal BMI Range:</span>
                              <span>
                                {sportBMIRanges[sport]?.normal[0]} -{" "}
                                {sportBMIRanges[sport]?.normal[1]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Metabolic Information
                        </h3>
                        <div className="flex justify-between items-center mb-2">
                          <span>Basal Metabolic Rate (BMR):</span>
                          <span className="font-medium">
                            {bmr} calories/day
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Total Daily Energy Expenditure:</span>
                          <span className="font-medium">
                            {tdee} calories/day
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          BMR is the number of calories your body needs at
                          complete rest. TDEE includes your activity level.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Emotional Context
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          {getEmotionalStateIcon(emotionalState)}
                          <span className="capitalize">{emotionalState}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Your emotional state can impact training, recovery,
                          and nutritional needs. Recommendations are adjusted
                          accordingly.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveResults}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Results
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Complete the calculator form to see your results
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-primary" />
                Personalized Recommendations
              </CardTitle>
              <CardDescription>
                Tailored advice based on your BMI, sport, and emotional state
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {recommendations.map((recommendation, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-md">
                        <p>{recommendation}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border rounded-md bg-blue-50 text-blue-800">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">
                          These recommendations are personalized based on your
                          BMI ({bmi}), selected sport ({sport}), and emotional
                          state ({emotionalState}). For the most accurate
                          guidance, consult with a sports nutritionist or
                          healthcare professional.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Complete the calculator form to get personalized
                    recommendations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
