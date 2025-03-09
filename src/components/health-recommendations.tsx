import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Apple,
  Dumbbell,
  Heart,
  Brain,
  Utensils,
  Bed,
  Clock,
  Droplets,
  Smile,
  Zap,
  ArrowRight,
  BookOpen,
  Download,
  Share2,
  Bookmark,
  Activity,
  BarChart,
  LineChart,
  Award,
  Info,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "./ui/theme-provider";
import { useLanguage } from "../lib/i18n";
import {
  saveUserRecommendations,
  getUserRecommendations,
  getHealthRecommendations,
} from "../lib/api";

export default function HealthRecommendations() {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("nutrition");
  const [savedRecommendations, setSavedRecommendations] = useState<string[]>(
    [],
  );
  const [userProfile, setUserProfile] = useState({
    height: 175,
    weight: 70,
    bmi: 22.9,
    bodyFat: 15.2,
    sport: "running",
    activityLevel: "moderate",
    emotionalState: "neutral",
    age: 30,
    gender: "male",
  });
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any>({});
  const [userId, setUserId] = useState<string>(
    localStorage.getItem("userId") || "user123",
  );

  // Load recommendations from API based on language and category
  const loadRecommendations = async (category: string) => {
    try {
      setLoading(true);
      const response = await getHealthRecommendations(category, language);
      if (response.success && response.recommendations) {
        setRecommendations((prev) => ({
          ...prev,
          [category]: response.recommendations,
        }));
      }
    } catch (error) {
      console.error(`Error loading ${category} recommendations:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Load user data and saved recommendations
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);

      try {
        // Load saved recommendations from API
        const savedRecsResponse = await getUserRecommendations(userId);
        if (savedRecsResponse.success && savedRecsResponse.recommendationIds) {
          setSavedRecommendations(savedRecsResponse.recommendationIds);
        } else {
          // Fallback to localStorage if API fails
          const saved = localStorage.getItem("savedRecommendations");
          if (saved) {
            setSavedRecommendations(JSON.parse(saved));
          }
        }

        // Load initial recommendations for the active tab
        await loadRecommendations(activeTab);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId, language]);

  // Load recommendations when tab changes
  useEffect(() => {
    if (!recommendations[activeTab]) {
      loadRecommendations(activeTab);
    }
  }, [activeTab]);

  const toggleSaveRecommendation = async (id: string) => {
    let newSaved;
    if (savedRecommendations.includes(id)) {
      newSaved = savedRecommendations.filter((item) => item !== id);
    } else {
      newSaved = [...savedRecommendations, id];
    }
    setSavedRecommendations(newSaved);

    // Save to localStorage as backup
    localStorage.setItem("savedRecommendations", JSON.stringify(newSaved));

    // Save to API
    try {
      await saveUserRecommendations(userId, newSaved);
    } catch (error) {
      console.error("Error saving recommendations to API:", error);
    }
  };

  const getRecommendationStatus = (id: string) => {
    if (savedRecommendations.includes(id)) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return null;
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Hero Section */}
      <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-800 rounded-xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t("recommendations.title", {
                defaultValue: "Health & Performance Recommendations",
              })}
            </h1>
            <p className="text-lg opacity-90 max-w-2xl">
              {t("recommendations.subtitle", {
                defaultValue:
                  "Personalized recommendations based on your body composition, sport preferences, and fitness goals",
              })}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 text-sm">
                <Activity className="mr-1 h-4 w-4" />
                BMI: {userProfile.bmi}
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 text-sm">
                <Dumbbell className="mr-1 h-4 w-4" />
                Sport:{" "}
                {userProfile.sport.charAt(0).toUpperCase() +
                  userProfile.sport.slice(1)}
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 text-sm">
                <Heart className="mr-1 h-4 w-4" />
                Body Fat: {userProfile.bodyFat}%
              </Badge>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-1">
                {t("recommendations.professionalAssessment", {
                  defaultValue: "Professional Assessment",
                })}
              </h3>
              <p className="text-sm opacity-80 mb-3">
                {t("recommendations.basedOnMetrics", {
                  defaultValue: "Based on your metrics",
                })}
              </p>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-white/20">
                      {t("recommendations.performancePotential", {
                        defaultValue: "Performance Potential",
                      })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-white/20">
                      85%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white/20">
                  <div
                    style={{ width: "85%" }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-400 to-blue-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs
        defaultValue="nutrition"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-3xl">
            <TabsTrigger value="nutrition" className="flex items-center">
              <Apple className="mr-2 h-4 w-4" />
              {t("recommendations.tabs.nutrition", {
                defaultValue: "Nutrition",
              })}
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center">
              <Dumbbell className="mr-2 h-4 w-4" />
              {t("recommendations.tabs.training", { defaultValue: "Training" })}
            </TabsTrigger>
            <TabsTrigger value="recovery" className="flex items-center">
              <Heart className="mr-2 h-4 w-4" />
              {t("recommendations.tabs.recovery", { defaultValue: "Recovery" })}
            </TabsTrigger>
            <TabsTrigger value="mental" className="flex items-center">
              <Brain className="mr-2 h-4 w-4" />
              {t("recommendations.tabs.mental", { defaultValue: "Mental" })}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden border-2 hover:border-green-200 dark:hover:border-green-900 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 relative">
                {getRecommendationStatus("nutrition-1") && (
                  <div className="absolute top-2 right-2">
                    {getRecommendationStatus("nutrition-1")}
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 mb-2"
                    >
                      Macronutrients
                    </Badge>
                    <CardTitle className="text-xl">
                      Protein Optimization
                    </CardTitle>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    <Utensils className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Based on your body composition and training goals, we
                  recommend increasing your protein intake to support muscle
                  recovery and growth.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Daily Target
                    </h4>
                    <p className="font-medium">
                      1.8g per kg of body weight (126g total)
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Timing
                    </h4>
                    <p className="font-medium">
                      20-30g every 3-4 hours, including post-workout
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Quality Sources
                    </h4>
                    <p className="font-medium">
                      Lean meats, eggs, dairy, legumes, and plant proteins
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSaveRecommendation("nutrition-1")}
                >
                  {savedRecommendations.includes("nutrition-1") ? (
                    <>
                      <Bookmark className="mr-2 h-4 w-4 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border-2 hover:border-green-200 dark:hover:border-green-900 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 relative">
                {getRecommendationStatus("nutrition-2") && (
                  <div className="absolute top-2 right-2">
                    {getRecommendationStatus("nutrition-2")}
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 mb-2"
                    >
                      Meal Timing
                    </Badge>
                    <CardTitle className="text-xl">
                      Pre-Workout Nutrition
                    </CardTitle>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Optimize your performance by consuming the right nutrients
                  before training sessions.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Timing
                    </h4>
                    <p className="font-medium">1-2 hours before workout</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Composition
                    </h4>
                    <p className="font-medium">
                      30-40g carbs, 15-20g protein, low fat
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Example Meals
                    </h4>
                    <p className="font-medium">
                      Greek yogurt with berries and honey, or oatmeal with
                      protein powder
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSaveRecommendation("nutrition-2")}
                >
                  {savedRecommendations.includes("nutrition-2") ? (
                    <>
                      <Bookmark className="mr-2 h-4 w-4 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border-2 hover:border-green-200 dark:hover:border-green-900 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 relative">
                {getRecommendationStatus("nutrition-3") && (
                  <div className="absolute top-2 right-2">
                    {getRecommendationStatus("nutrition-3")}
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 mb-2"
                    >
                      Hydration
                    </Badge>
                    <CardTitle className="text-xl">
                      Optimal Hydration Strategy
                    </CardTitle>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    <Droplets className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Proper hydration is crucial for performance and recovery. Your
                  current metrics indicate you may need to increase fluid
                  intake.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Daily Target
                    </h4>
                    <p className="font-medium">
                      3.5-4 liters total (including from food)
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      During Exercise
                    </h4>
                    <p className="font-medium">
                      500-750ml per hour of activity
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Electrolytes
                    </h4>
                    <p className="font-medium">
                      Add electrolytes for sessions over 60 minutes
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSaveRecommendation("nutrition-3")}
                >
                  {savedRecommendations.includes("nutrition-3") ? (
                    <>
                      <Bookmark className="mr-2 h-4 w-4 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={() =>
                navigate(
                  `/all-recommendations?category=nutrition&lang=${language}`,
                )
              }
            >
              {t("recommendations.viewAll.nutrition", {
                defaultValue: "View All Nutrition Recommendations",
              })}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden border-2 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 relative">
                {getRecommendationStatus("training-1") && (
                  <div className="absolute top-2 right-2">
                    {getRecommendationStatus("training-1")}
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 mb-2"
                    >
                      Strength Training
                    </Badge>
                    <CardTitle className="text-xl">
                      Progressive Overload Plan
                    </CardTitle>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    <Dumbbell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Based on your current metrics and goals, we recommend
                  implementing a structured progressive overload plan.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Frequency
                    </h4>
                    <p className="font-medium">
                      3-4 strength sessions per week
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Progression
                    </h4>
                    <p className="font-medium">
                      Increase weight by 2.5-5% when you can complete all sets
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Focus Areas
                    </h4>
                    <p className="font-medium">
                      Compound movements: squats, deadlifts, presses
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSaveRecommendation("training-1")}
                >
                  {savedRecommendations.includes("training-1") ? (
                    <>
                      <Bookmark className="mr-2 h-4 w-4 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border-2 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 relative">
                {getRecommendationStatus("training-2") && (
                  <div className="absolute top-2 right-2">
                    {getRecommendationStatus("training-2")}
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 mb-2"
                    >
                      Cardio Training
                    </Badge>
                    <CardTitle className="text-xl">
                      Zone 2 Training Protocol
                    </CardTitle>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Incorporate more Zone 2 cardio training to improve aerobic
                  capacity and fat utilization.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Heart Rate Target
                    </h4>
                    <p className="font-medium">
                      60-70% of max heart rate (120-140 bpm)
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Duration
                    </h4>
                    <p className="font-medium">30-60 minutes per session</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Frequency
                    </h4>
                    <p className="font-medium">2-3 sessions per week</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSaveRecommendation("training-2")}
                >
                  {savedRecommendations.includes("training-2") ? (
                    <>
                      <Bookmark className="mr-2 h-4 w-4 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border-2 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 relative">
                {getRecommendationStatus("training-3") && (
                  <div className="absolute top-2 right-2">
                    {getRecommendationStatus("training-3")}
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 mb-2"
                    >
                      Mobility
                    </Badge>
                    <CardTitle className="text-xl">
                      Sport-Specific Mobility Routine
                    </CardTitle>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Your sport requires specific mobility patterns. This routine
                  will help improve performance and reduce injury risk.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Focus Areas
                    </h4>
                    <p className="font-medium">
                      Hip mobility, thoracic spine, and ankle dorsiflexion
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Timing
                    </h4>
                    <p className="font-medium">
                      10-15 minutes daily, plus pre-workout
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Progression
                    </h4>
                    <p className="font-medium">
                      Increase range of motion gradually over 4-6 weeks
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSaveRecommendation("training-3")}
                >
                  {savedRecommendations.includes("training-3") ? (
                    <>
                      <Bookmark className="mr-2 h-4 w-4 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={() =>
                navigate(
                  `/all-recommendations?category=training&lang=${language}`,
                )
              }
            >
              {t("recommendations.viewAll.training", {
                defaultValue: "View All Training Recommendations",
              })}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* Recovery Tab */}
        <TabsContent value="recovery" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden border-2 hover:border-purple-200 dark:hover:border-purple-900 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 relative">
                {getRecommendationStatus("recovery-1") && (
                  <div className="absolute top-2 right-2">
                    {getRecommendationStatus("recovery-1")}
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 mb-2"
                    >
                      Sleep
                    </Badge>
                    <CardTitle className="text-xl">
                      Sleep Optimization Protocol
                    </CardTitle>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    <Bed className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Quality sleep is essential for recovery and performance. Based
                  on your training volume, we recommend the following protocol.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Duration
                    </h4>
                    <p className="font-medium">7.5-8.5 hours per night</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Environment
                    </h4>
                    <p className="font-medium">
                      Dark room, 65-68°F (18-20°C), minimal noise
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Pre-Sleep Routine
                    </h4>
                    <p className="font-medium">
                      No screens 60 min before bed, relaxation techniques
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSaveRecommendation("recovery-1")}
                >
                  {savedRecommendations.includes("recovery-1") ? (
                    <>
                      <Bookmark className="mr-2 h-4 w-4 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border-2 hover:border-purple-200 dark:hover:border-purple-900 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 relative">
                {getRecommendationStatus("recovery-2") && (
                  <div className="absolute top-2 right-2">
                    {getRecommendationStatus("recovery-2")}
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 mb-2"
                    >
                      Active Recovery
                    </Badge>
                    <CardTitle className="text-xl">
                      Strategic Recovery Sessions
                    </CardTitle>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Implement structured active recovery sessions to enhance
                  recovery between training days.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Frequency
                    </h4>
                    <p className="font-medium">
                      1-2 dedicated sessions per week
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Activities
                    </h4>
                    <p className="font-medium">
                      Light cycling, swimming, yoga, or walking
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Intensity
                    </h4>
                    <p className="font-medium">
                      Keep heart rate below 120 bpm (very light effort)
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSaveRecommendation("recovery-2")}
                >
                  {savedRecommendations.includes("recovery-2") ? (
                    <>
                      <Bookmark className="mr-2 h-4 w-4 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border-2 hover:border-purple-200 dark:hover:border-purple-900 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 relative">
                {getRecommendationStatus("recovery-3") && (
                  <div className="absolute top-2 right-2">
                    {getRecommendationStatus("recovery-3")}
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 mb-2"
                    >
                      Stress Management
                    </Badge>
                    <CardTitle className="text-xl">
                      Stress Reduction Techniques
                    </CardTitle>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    <Smile className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  High stress levels can impair recovery and performance. These
                  techniques will help manage your stress response.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Daily Practice
                    </h4>
                    <p className="font-medium">
                      10-15 minutes of mindfulness or breathing exercises
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Techniques
                    </h4>
                    <p className="font-medium">
                      Box breathing, progressive muscle relaxation, meditation
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Timing
                    </h4>
                    <p className="font-medium">
                      Morning and/or evening, plus as needed during high stress
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSaveRecommendation("recovery-3")}
                >
                  {savedRecommendations.includes("recovery-3") ? (
                    <>
                      <Bookmark className="mr-2 h-4 w-4 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={() =>
                navigate(
                  `/all-recommendations?category=recovery&lang=${language}`,
                )
              }
            >
              {t("recommendations.viewAll.recovery", {
                defaultValue: "View All Recovery Recommendations",
              })}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* Mental Tab */}
        <TabsContent value="mental" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden border-2 hover:border-amber-200 dark:hover:border-amber-900 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 relative">
                {getRecommendationStatus("mental-1") && (
                  <div className="absolute top-2 right-2">
                    {getRecommendationStatus("mental-1")}
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 mb-2"
                    >
                      Focus
                    </Badge>
                    <CardTitle className="text-xl">
                      Performance Visualization
                    </CardTitle>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    <Brain className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Mental rehearsal and visualization can significantly improve
                  performance outcomes and technical execution.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Frequency
                    </h4>
                    <p className="font-medium">
                      5-10 minutes daily, plus before key training sessions
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Focus Areas
                    </h4>
                    <p className="font-medium">
                      Technical execution, overcoming challenges, achieving
                      goals
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Method
                    </h4>
                    <p className="font-medium">
                      Multi-sensory visualization with emotional engagement
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSaveRecommendation("mental-1")}
                >
                  {savedRecommendations.includes("mental-1") ? (
                    <>
                      <Bookmark className="mr-2 h-4 w-4 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border-2 hover:border-amber-200 dark:hover:border-amber-900 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 relative">
                {getRecommendationStatus("mental-2") && (
                  <div className="absolute top-2 right-2">
                    {getRecommendationStatus("mental-2")}
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 mb-2"
                    >
                      Mindset
                    </Badge>
                    <CardTitle className="text-xl">
                      Growth Mindset Development
                    </CardTitle>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Cultivating a growth mindset can help you overcome plateaus
                  and setbacks in your fitness journey.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Daily Practice
                    </h4>
                    <p className="font-medium">
                      Reframe challenges as opportunities for growth
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Journaling
                    </h4>
                    <p className="font-medium">
                      Track progress, lessons learned, and areas for improvement
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Language Patterns
                    </h4>
                    <p className="font-medium">
                      Replace "I can't" with "I can't yet" and focus on process
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSaveRecommendation("mental-2")}
                >
                  {savedRecommendations.includes("mental-2") ? (
                    <>
                      <Bookmark className="mr-2 h-4 w-4 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border-2 hover:border-amber-200 dark:hover:border-amber-900 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 relative">
                {getRecommendationStatus("mental-3") && (
                  <div className="absolute top-2 right-2">
                    {getRecommendationStatus("mental-3")}
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 mb-2"
                    >
                      Performance
                    </Badge>
                    <CardTitle className="text-xl">
                      Pre-Competition Routine
                    </CardTitle>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  A consistent pre-competition routine can help optimize your
                  mental state and performance readiness.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Timeline
                    </h4>
                    <p className="font-medium">
                      Develop a 30-60 minute pre-event sequence
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Components
                    </h4>
                    <p className="font-medium">
                      Physical warm-up, mental centering, focus cues
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Practice
                    </h4>
                    <p className="font-medium">
                      Rehearse routine during training to build familiarity
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSaveRecommendation("mental-3")}
                >
                  {savedRecommendations.includes("mental-3") ? (
                    <>
                      <Bookmark className="mr-2 h-4 w-4 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={() =>
                navigate(
                  `/all-recommendations?category=mental&lang=${language}`,
                )
              }
            >
              {t("recommendations.viewAll.mental", {
                defaultValue: "View All Mental Recommendations",
              })}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Professional Assessment Section */}
      <div className="mt-12 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {t("recommendations.assessment.title", {
              defaultValue: "Professional Assessment",
            })}
          </h2>
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
          >
            <BarChart className="mr-2 h-4 w-4" />
            {t("recommendations.assessment.badge", {
              defaultValue: "Personalized Analysis",
            })}
          </Badge>
        </div>

        <Card className="border-2 border-blue-200 dark:border-blue-900">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-lg">
                    {t("recommendations.assessment.bodyComposition", {
                      defaultValue: "Body Composition",
                    })}
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      BMI
                    </span>
                    <span className="font-medium">{userProfile.bmi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Body Fat
                    </span>
                    <span className="font-medium">{userProfile.bodyFat}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Lean Mass
                    </span>
                    <span className="font-medium">
                      {Math.round(
                        userProfile.weight * (1 - userProfile.bodyFat / 100),
                      )}{" "}
                      kg
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your body composition is optimal for {userProfile.sport}.
                    Maintaining current lean mass while optimizing body fat
                    percentage will enhance performance.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Dumbbell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-lg">
                    {t("recommendations.assessment.performanceMetrics", {
                      defaultValue: "Performance Metrics",
                    })}
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Strength Potential
                      </span>
                      <span className="text-sm font-medium">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Endurance Potential
                      </span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Recovery Capacity
                      </span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-lg">
                    {t("recommendations.assessment.optimizationStrategy", {
                      defaultValue: "Optimization Strategy",
                    })}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Focus on Zone 2 cardio training to improve aerobic
                      efficiency
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Maintain current protein intake of 1.8g/kg to support
                      recovery
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Implement sleep optimization protocol to enhance recovery
                      capacity
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Add sport-specific mobility routine to improve performance
                      and reduce injury risk
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center space-x-2 mb-4">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-lg">
                  {t("recommendations.assessment.insight", {
                    defaultValue: "Professional Insight",
                  })}
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Based on your current metrics and {userProfile.sport} focus,
                you're in an excellent position to optimize performance. Your
                body composition is well-suited for your sport, with room for
                minor refinements in recovery capacity. The recommendations
                provided are specifically tailored to address these areas while
                maintaining your strengths. Implementing these strategies
                consistently over the next 8-12 weeks should yield measurable
                improvements in performance metrics.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Recommendations */}
      {savedRecommendations.length > 0 && (
        <div className="mt-12 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {t("recommendations.saved.title", {
                defaultValue: "Saved Recommendations",
              })}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Export saved recommendations as JSON file
                const dataStr = JSON.stringify(savedRecommendations, null, 2);
                const dataUri =
                  "data:application/json;charset=utf-8," +
                  encodeURIComponent(dataStr);
                const exportFileDefaultName = "saved-recommendations.json";
                const linkElement = document.createElement("a");
                linkElement.setAttribute("href", dataUri);
                linkElement.setAttribute("download", exportFileDefaultName);
                linkElement.click();
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              {t("recommendations.saved.exportAll", {
                defaultValue: "Export All",
              })}
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {savedRecommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedRecommendations.map((id) => {
                      let title = "";
                      let category = "";
                      let icon = <Activity className="h-5 w-5" />;

                      if (id.startsWith("nutrition")) {
                        category = "Nutrition";
                        icon = <Apple className="h-5 w-5 text-green-500" />;
                        if (id === "nutrition-1")
                          title = "Protein Optimization";
                        if (id === "nutrition-2")
                          title = "Pre-Workout Nutrition";
                        if (id === "nutrition-3")
                          title = "Optimal Hydration Strategy";
                      } else if (id.startsWith("training")) {
                        category = "Training";
                        icon = <Dumbbell className="h-5 w-5 text-blue-500" />;
                        if (id === "training-1")
                          title = "Progressive Overload Plan";
                        if (id === "training-2")
                          title = "Zone 2 Training Protocol";
                        if (id === "training-3")
                          title = "Sport-Specific Mobility Routine";
                      } else if (id.startsWith("recovery")) {
                        category = "Recovery";
                        icon = <Heart className="h-5 w-5 text-purple-500" />;
                        if (id === "recovery-1")
                          title = "Sleep Optimization Protocol";
                        if (id === "recovery-2")
                          title = "Strategic Recovery Sessions";
                        if (id === "recovery-3")
                          title = "Stress Reduction Techniques";
                      } else if (id.startsWith("mental")) {
                        category = "Mental";
                        icon = <Brain className="h-5 w-5 text-amber-500" />;
                        if (id === "mental-1")
                          title = "Performance Visualization";
                        if (id === "mental-2")
                          title = "Growth Mindset Development";
                        if (id === "mental-3")
                          title = "Pre-Competition Routine";
                      }

                      return (
                        <div
                          key={id}
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="mr-3">{icon}</div>
                          <div>
                            <p className="font-medium">{title}</p>
                            <p className="text-sm text-gray-500">{category}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto"
                            onClick={() => toggleSaveRecommendation(id)}
                          >
                            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    {t("recommendations.saved.empty", {
                      defaultValue:
                        'You haven\'t saved any recommendations yet. Click the "Save" button on recommendations you want to reference later.',
                    })}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 mb-8">
        <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full inline-block">
                  <AlertCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("recommendations.help.title", {
                    defaultValue: "How to Use These Recommendations",
                  })}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t("recommendations.help.description", {
                    defaultValue:
                      "These personalized recommendations are based on your current metrics and sport focus. Save your favorites, implement them consistently, and track your progress over time for best results.",
                  })}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      (window.location.href = `/tutorial?lang=${language}`)
                    }
                  >
                    {t("recommendations.help.viewTutorial", {
                      defaultValue: "View Tutorial",
                    })}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      (window.location.href = `/contact-coach?lang=${language}`)
                    }
                  >
                    {t("recommendations.help.contactCoach", {
                      defaultValue: "Contact a Coach",
                    })}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
