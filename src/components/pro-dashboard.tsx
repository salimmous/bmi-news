import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { AdvancedBMICalculator } from "./ui/advanced-bmi-calculator";
import { BMIChart } from "./ui/bmi-chart";
import { BMIHistory } from "./ui/bmi-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ArrowUp,
  ArrowDown,
  Activity,
  Target,
  Calendar,
  User,
  Dumbbell,
  Heart,
  Utensils,
  Moon,
  Scale,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BMIRecord {
  id: string;
  date: string;
  bmi: number;
  weight: number;
  height: number;
  userData?: any;
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

export default function ProDashboard() {
  const [records, setRecords] = useState<BMIRecord[]>([]);
  const [currentBMI, setCurrentBMI] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  // Load records from localStorage on component mount
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const savedRecords = localStorage.getItem("bmiRecords");
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }

    // Get user name
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    } else {
      const email = localStorage.getItem("userEmail") || "";
      setUserName(email.split("@")[0]);
    }

    // Get latest user data if available
    if (savedRecords) {
      const parsedRecords = JSON.parse(savedRecords) as BMIRecord[];
      if (parsedRecords.length > 0 && parsedRecords[0].userData) {
        setUserData(parsedRecords[0].userData);
      }
    }
  }, [navigate]);

  // Save records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bmiRecords", JSON.stringify(records));
  }, [records]);

  const handleBMICalculation = (
    bmi: number,
    weight: number,
    height: number,
    userData: UserData,
  ) => {
    setCurrentBMI(bmi);
    setUserData(userData);

    // Create a new record
    const newRecord: BMIRecord = {
      id: uuidv4(),
      date: new Date().toISOString(),
      bmi,
      weight,
      height,
      userData,
    };

    // Add the new record to the records array
    setRecords((prevRecords) => [newRecord, ...prevRecords]);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prevRecords) =>
      prevRecords.filter((record) => record.id !== id),
    );
  };

  // Calculate BMI trends
  const getBMITrend = () => {
    if (records.length < 2) return { trend: 0, percentage: 0 };

    const sortedRecords = [...records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const latestBMI = sortedRecords[0].bmi;
    const previousBMI = sortedRecords[1].bmi;

    const difference = latestBMI - previousBMI;
    const percentageChange = ((difference / previousBMI) * 100).toFixed(1);

    return {
      trend: difference,
      percentage: Math.abs(parseFloat(percentageChange)),
    };
  };

  // Get latest BMI category
  const getLatestBMICategory = () => {
    if (records.length === 0) return "No data";

    const sortedRecords = [...records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const latestBMI = sortedRecords[0].bmi;

    if (latestBMI < 18.5) return "Underweight";
    if (latestBMI >= 18.5 && latestBMI < 25) return "Normal weight";
    if (latestBMI >= 25 && latestBMI < 30) return "Overweight";
    return "Obese";
  };

  // Get latest weight
  const getLatestWeight = () => {
    if (records.length === 0) return "No data";

    const sortedRecords = [...records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return sortedRecords[0].weight;
  };

  const bmiTrend = getBMITrend();
  const latestCategory = getLatestBMICategory();
  const latestWeight = getLatestWeight();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {userName}</h1>
            <p className="text-muted-foreground">
              Your comprehensive health and fitness dashboard
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Target className="h-4 w-4 mr-2 text-primary" />
                Current BMI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">
                    {records.length > 0
                      ? records
                          .sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime(),
                          )[0]
                          .bmi.toFixed(1)
                      : "--"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {latestCategory}
                  </p>
                </div>
                <div
                  className={`flex items-center ${bmiTrend.trend < 0 ? "text-green-500" : bmiTrend.trend > 0 ? "text-red-500" : "text-gray-500"}`}
                >
                  {bmiTrend.trend < 0 ? (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  ) : bmiTrend.trend > 0 ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : null}
                  <span className="text-sm font-medium">
                    {bmiTrend.trend !== 0 ? `${bmiTrend.percentage}%` : "--"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Activity className="h-4 w-4 mr-2 text-primary" />
                Current Weight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">
                    {typeof latestWeight === "number"
                      ? `${latestWeight} kg`
                      : latestWeight}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last recorded weight
                  </p>
                </div>
                <Scale className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Dumbbell className="h-4 w-4 mr-2 text-primary" />
                Fitness Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">
                    {userData?.fitnessGoal || "Not set"}
                  </p>
                  <p className="text-xs text-muted-foreground">Current focus</p>
                </div>
                <Heart className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Utensils className="h-4 w-4 mr-2 text-primary" />
                Diet Preference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">
                    {userData?.dietPreference || "Not set"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Nutritional approach
                  </p>
                </div>
                <Moon className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-8"
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BMIChart records={records} />

              <Card className="w-full bg-white shadow-md">
                <CardHeader>
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    <CardTitle>Health Insights</CardTitle>
                  </div>
                  <CardDescription>
                    Personalized health and fitness recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userData ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-md bg-muted/30 border border-muted">
                        <h3 className="font-medium mb-2">Fitness Summary</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              Activity Level:
                            </p>
                            <p className="font-medium">
                              {userData.activityLevel}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Weekly Workouts:
                            </p>
                            <p className="font-medium">
                              {userData.gymSessionsPerWeek} sessions
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Sleep:</p>
                            <p className="font-medium">
                              {userData.hoursOfSleep} hours
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Diet:</p>
                            <p className="font-medium">
                              {userData.dietPreference}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Recommendations</h3>
                        <ul className="space-y-2">
                          {records.length > 0 && (
                            <li className="flex items-start bg-white p-2 rounded-md hover:bg-muted/20 transition-colors">
                              <div className="mr-3 mt-0.5 bg-primary/10 p-1 rounded-full">
                                <Target className="h-4 w-4 text-primary flex-shrink-0" />
                              </div>
                              <span className="text-sm">
                                {records[0].bmi < 18.5
                                  ? "Focus on increasing caloric intake with nutrient-dense foods"
                                  : records[0].bmi >= 25
                                    ? "Create a moderate calorie deficit through diet and exercise"
                                    : "Maintain your current healthy weight through balanced nutrition"}
                              </span>
                            </li>
                          )}

                          <li className="flex items-start bg-white p-2 rounded-md hover:bg-muted/20 transition-colors">
                            <div className="mr-3 mt-0.5 bg-primary/10 p-1 rounded-full">
                              <Dumbbell className="h-4 w-4 text-primary flex-shrink-0" />
                            </div>
                            <span className="text-sm">
                              {userData.gymSessionsPerWeek < 3
                                ? "Consider increasing your workout frequency to at least 3 times per week"
                                : userData.gymSessionsPerWeek > 5
                                  ? "Ensure you're allowing adequate recovery between intense workouts"
                                  : "Your current workout frequency is ideal for consistent progress"}
                            </span>
                          </li>

                          <li className="flex items-start bg-white p-2 rounded-md hover:bg-muted/20 transition-colors">
                            <div className="mr-3 mt-0.5 bg-primary/10 p-1 rounded-full">
                              <Moon className="h-4 w-4 text-primary flex-shrink-0" />
                            </div>
                            <span className="text-sm">
                              {userData.hoursOfSleep < 7
                                ? "Aim to increase your sleep to at least 7 hours for better recovery and results"
                                : "Your sleep duration is optimal for recovery and overall health"}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-6 text-muted-foreground">
                      <p>
                        Complete a BMI calculation with advanced details to see
                        personalized insights
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="mt-6">
            <AdvancedBMICalculator
              onCalculate={(bmi, weight, height, userData, metrics) => {
                handleBMICalculation(bmi, weight, height, userData);
              }}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <BMIHistory records={records} onDelete={handleDeleteRecord} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
