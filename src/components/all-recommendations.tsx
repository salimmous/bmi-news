import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Apple,
  Dumbbell,
  Heart,
  Brain,
  ArrowLeft,
  Bookmark,
  Share2,
  Filter,
  Search,
} from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useLanguage } from "../lib/i18n";
import {
  getHealthRecommendations,
  saveUserRecommendations,
  getUserRecommendations,
} from "../lib/api";

interface Recommendation {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  details: Record<string, string>;
  icon: string;
}

export default function AllRecommendations() {
  const [searchParams] = useSearchParams();
  const { t, language, setLanguage } = useLanguage();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [savedRecommendations, setSavedRecommendations] = useState<string[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("");

  // Get category from URL params
  const categoryParam = searchParams.get("category") || "nutrition";
  const langParam = searchParams.get("lang");

  // Set language based on URL param if provided
  useEffect(() => {
    if (
      langParam &&
      (langParam === "en" || langParam === "fr" || langParam === "ar")
    ) {
      setLanguage(langParam);
    }
  }, [langParam, setLanguage]);

  // Load recommendations
  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        // In a real app, this would call the API
        // const response = await getHealthRecommendations(categoryParam, language);
        // if (response.success) {
        //   setRecommendations(response.recommendations);
        // }

        // Mock data for demonstration
        const mockRecommendations: Recommendation[] =
          generateMockRecommendations(categoryParam);
        setRecommendations(mockRecommendations);

        // Load saved recommendations
        const userId = localStorage.getItem("userId") || "user123";
        // In a real app, this would call the API
        // const savedRecsResponse = await getUserRecommendations(userId);
        // if (savedRecsResponse.success) {
        //   setSavedRecommendations(savedRecsResponse.recommendationIds);
        // }

        // Mock saved recommendations
        const mockSaved = localStorage.getItem("savedRecommendations");
        if (mockSaved) {
          setSavedRecommendations(JSON.parse(mockSaved));
        }
      } catch (error) {
        console.error(`Error loading ${categoryParam} recommendations:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [categoryParam, language]);

  // Filter recommendations based on search term and subcategory filter
  const filteredRecommendations = recommendations.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubcategory = subcategoryFilter
      ? rec.subcategory === subcategoryFilter
      : true;

    return matchesSearch && matchesSubcategory;
  });

  // Get unique subcategories for filtering
  const subcategories = [
    ...new Set(recommendations.map((rec) => rec.subcategory)),
  ];

  // Toggle save recommendation
  const toggleSaveRecommendation = (id: string) => {
    let newSaved;
    if (savedRecommendations.includes(id)) {
      newSaved = savedRecommendations.filter((item) => item !== id);
    } else {
      newSaved = [...savedRecommendations, id];
    }
    setSavedRecommendations(newSaved);

    // Save to localStorage
    localStorage.setItem("savedRecommendations", JSON.stringify(newSaved));

    // In a real app, this would call the API
    // const userId = localStorage.getItem("userId") || "user123";
    // saveUserRecommendations(userId, newSaved);
  };

  // Get icon component based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "nutrition":
        return <Apple className="h-5 w-5 text-green-500" />;
      case "training":
        return <Dumbbell className="h-5 w-5 text-blue-500" />;
      case "recovery":
        return <Heart className="h-5 w-5 text-purple-500" />;
      case "mental":
        return <Brain className="h-5 w-5 text-amber-500" />;
      default:
        return <Apple className="h-5 w-5 text-green-500" />;
    }
  };

  // Get color classes based on category
  const getCategoryColorClasses = (category: string) => {
    switch (category) {
      case "nutrition":
        return {
          header:
            "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
          badge:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
          hover: "hover:border-green-200 dark:hover:border-green-900",
        };
      case "training":
        return {
          header:
            "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
          badge:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
          hover: "hover:border-blue-200 dark:hover:border-blue-900",
        };
      case "recovery":
        return {
          header:
            "bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
          badge:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
          hover: "hover:border-purple-200 dark:hover:border-purple-900",
        };
      case "mental":
        return {
          header:
            "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
          badge:
            "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
          hover: "hover:border-amber-200 dark:hover:border-amber-900",
        };
      default:
        return {
          header:
            "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
          badge:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
          hover: "hover:border-green-200 dark:hover:border-green-900",
        };
    }
  };

  // Get category title
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "nutrition":
        return t("recommendations.tabs.nutrition", {
          defaultValue: "Nutrition",
        });
      case "training":
        return t("recommendations.tabs.training", { defaultValue: "Training" });
      case "recovery":
        return t("recommendations.tabs.recovery", { defaultValue: "Recovery" });
      case "mental":
        return t("recommendations.tabs.mental", { defaultValue: "Mental" });
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link to="/health-recommendations" className="mr-2">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.back", { defaultValue: "Back" })}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            {getCategoryTitle(categoryParam)}{" "}
            {t("recommendations.title", { defaultValue: "Recommendations" })}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          {t("recommendations.allRecommendations.description", {
            defaultValue:
              "Browse all recommendations tailored to your profile and preferences.",
          })}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("common.search", { defaultValue: "Search..." })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div>
          <Select
            value={subcategoryFilter}
            onValueChange={setSubcategoryFilter}
          >
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue
                placeholder={t("common.filter", { defaultValue: "Filter" })}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                {t("common.all", { defaultValue: "All Subcategories" })}
              </SelectItem>
              {subcategories.map((subcat) => (
                <SelectItem key={subcat} value={subcat}>
                  {subcat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p>{t("common.loading", { defaultValue: "Loading..." })}</p>
        </div>
      ) : filteredRecommendations.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">
            {t("recommendations.noResults", {
              defaultValue: "No recommendations found matching your criteria.",
            })}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((recommendation) => {
            const colorClasses = getCategoryColorClasses(categoryParam);
            return (
              <Card
                key={recommendation.id}
                className={`overflow-hidden border-2 transition-all duration-300 ${colorClasses.hover}`}
              >
                <CardHeader className={colorClasses.header}>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge
                        variant="outline"
                        className={`${colorClasses.badge} mb-2`}
                      >
                        {recommendation.subcategory}
                      </Badge>
                      <CardTitle className="text-xl">
                        {recommendation.title}
                      </CardTitle>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                      {getCategoryIcon(categoryParam)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="mb-4">{recommendation.description}</p>
                  <div className="space-y-3">
                    {Object.entries(recommendation.details).map(
                      ([key, value]) => (
                        <div key={key}>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {key}
                          </h4>
                          <p className="font-medium">{value}</p>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSaveRecommendation(recommendation.id)}
                  >
                    {savedRecommendations.includes(recommendation.id) ? (
                      <>
                        <Bookmark className="mr-2 h-4 w-4 fill-current" />
                        {t("common.saved", { defaultValue: "Saved" })}
                      </>
                    ) : (
                      <>
                        <Bookmark className="mr-2 h-4 w-4" />
                        {t("common.save", { defaultValue: "Save" })}
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    {t("common.share", { defaultValue: "Share" })}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper function to generate mock recommendations
function generateMockRecommendations(category: string): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (category === "nutrition") {
    recommendations.push(
      {
        id: "nutrition-1",
        title: "Protein Optimization",
        category: "nutrition",
        subcategory: "Macronutrients",
        description:
          "Based on your body composition and training goals, we recommend increasing your protein intake to support muscle recovery and growth.",
        details: {
          "Daily Target": "1.8g per kg of body weight (126g total)",
          Timing: "20-30g every 3-4 hours, including post-workout",
          "Quality Sources":
            "Lean meats, eggs, dairy, legumes, and plant proteins",
        },
        icon: "utensils",
      },
      {
        id: "nutrition-2",
        title: "Pre-Workout Nutrition",
        category: "nutrition",
        subcategory: "Meal Timing",
        description:
          "Optimize your performance by consuming the right nutrients before training sessions.",
        details: {
          Timing: "1-2 hours before workout",
          Composition: "30-40g carbs, 15-20g protein, low fat",
          "Example Meals":
            "Greek yogurt with berries and honey, or oatmeal with protein powder",
        },
        icon: "clock",
      },
      {
        id: "nutrition-3",
        title: "Optimal Hydration Strategy",
        category: "nutrition",
        subcategory: "Hydration",
        description:
          "Proper hydration is crucial for performance and recovery. Your current metrics indicate you may need to increase fluid intake.",
        details: {
          "Daily Target": "3.5-4 liters total (including from food)",
          "During Exercise": "500-750ml per hour of activity",
          Electrolytes: "Add electrolytes for sessions over 60 minutes",
        },
        icon: "droplets",
      },
      {
        id: "nutrition-4",
        title: "Carbohydrate Periodization",
        category: "nutrition",
        subcategory: "Macronutrients",
        description:
          "Strategically varying your carbohydrate intake based on training intensity and volume can optimize performance and body composition.",
        details: {
          "High-Intensity Days": "6-8g carbs per kg bodyweight",
          "Moderate Days": "4-5g carbs per kg bodyweight",
          "Recovery Days": "2-3g carbs per kg bodyweight",
          Timing: "Concentrate intake around training sessions",
        },
        icon: "utensils",
      },
      {
        id: "nutrition-5",
        title: "Anti-Inflammatory Diet Strategy",
        category: "nutrition",
        subcategory: "Recovery",
        description:
          "Incorporating anti-inflammatory foods can help reduce exercise-induced inflammation and support faster recovery.",
        details: {
          "Key Foods":
            "Fatty fish, berries, leafy greens, nuts, olive oil, turmeric",
          "Foods to Limit":
            "Processed foods, refined sugars, excessive alcohol",
          Implementation:
            "Include at least 2-3 anti-inflammatory foods in each meal",
        },
        icon: "heart",
      },
      {
        id: "nutrition-6",
        title: "Nutrient Timing for Glycogen Replenishment",
        category: "nutrition",
        subcategory: "Recovery",
        description:
          "Optimizing post-workout nutrition can significantly improve glycogen replenishment and enhance recovery between training sessions.",
        details: {
          "Immediate Post-Workout":
            "0.8g carbs per kg bodyweight within 30 minutes",
          "Extended Recovery":
            "1.2g carbs per kg bodyweight over the next 2 hours",
          "Protein Addition":
            "Add 20-25g protein to enhance glycogen synthesis",
        },
        icon: "clock",
      },
      {
        id: "nutrition-7",
        title: "Micronutrient Optimization",
        category: "nutrition",
        subcategory: "Vitamins & Minerals",
        description:
          "Based on your activity level and diet analysis, focusing on these key micronutrients will support optimal performance and recovery.",
        details: {
          "Priority Nutrients": "Iron, Vitamin D, Magnesium, Zinc, B-vitamins",
          "Food Sources":
            "Dark leafy greens, nuts, seeds, whole grains, lean meats",
          Supplementation:
            "Consider vitamin D (2000 IU) and magnesium (300mg) daily",
        },
        icon: "apple",
      },
      {
        id: "nutrition-8",
        title: "Competition Day Nutrition Plan",
        category: "nutrition",
        subcategory: "Performance",
        description:
          "A strategic nutrition approach for competition days to maximize energy availability and mental focus.",
        details: {
          "Pre-Event Meal":
            "3-4 hours before: 2g carbs/kg, 20g protein, low fat and fiber",
          "Final Fueling": "30-60 minutes before: 30g easily digestible carbs",
          "During Event": "30-60g carbs per hour for events >60 minutes",
          Recovery: "Start refueling within 30 minutes of completion",
        },
        icon: "zap",
      },
    );
  } else if (category === "training") {
    // Add training recommendations here
    recommendations.push(
      {
        id: "training-1",
        title: "Progressive Overload Plan",
        category: "training",
        subcategory: "Strength Training",
        description:
          "Based on your current metrics and goals, we recommend implementing a structured progressive overload plan.",
        details: {
          Frequency: "3-4 strength sessions per week",
          Progression:
            "Increase weight by 2.5-5% when you can complete all sets",
          "Focus Areas": "Compound movements: squats, deadlifts, presses",
        },
        icon: "dumbbell",
      },
      // Add more training recommendations
    );
  } else if (category === "recovery") {
    // Add recovery recommendations here
    recommendations.push(
      {
        id: "recovery-1",
        title: "Sleep Optimization Protocol",
        category: "recovery",
        subcategory: "Sleep",
        description:
          "Quality sleep is essential for recovery and performance. Based on your training volume, we recommend the following protocol.",
        details: {
          Duration: "7.5-8.5 hours per night",
          Environment: "Dark room, 65-68°F (18-20°C), minimal noise",
          "Pre-Sleep Routine":
            "No screens 60 min before bed, relaxation techniques",
        },
        icon: "bed",
      },
      // Add more recovery recommendations
    );
  } else if (category === "mental") {
    // Add mental recommendations here
    recommendations.push(
      {
        id: "mental-1",
        title: "Performance Visualization",
        category: "mental",
        subcategory: "Focus",
        description:
          "Mental rehearsal and visualization can significantly improve performance outcomes and technical execution.",
        details: {
          Frequency: "5-10 minutes daily, plus before key training sessions",
          "Focus Areas":
            "Technical execution, overcoming challenges, achieving goals",
          Method: "Multi-sensory visualization with emotional engagement",
        },
        icon: "brain",
      },
      // Add more mental recommendations
    );
  }

  return recommendations;
}
