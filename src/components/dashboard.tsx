import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { BMICalculator } from "./ui/bmi-calculator";
import { BMIChart } from "./ui/bmi-chart";
import { BMIRecommendations } from "./ui/bmi-recommendations";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BMIRecord {
  id: string;
  date: string;
  bmi: number;
  weight: number;
  height: number;
}

export default function Dashboard() {
  const [records, setRecords] = useState<BMIRecord[]>([]);
  const [currentBMI, setCurrentBMI] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
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
  }, [navigate]);

  // Save records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bmiRecords", JSON.stringify(records));
  }, [records]);

  const handleBMICalculation = (
    bmi: number,
    weight: number,
    height: number,
  ) => {
    setCurrentBMI(bmi);

    // Create a new record
    const newRecord: BMIRecord = {
      id: uuidv4(),
      date: new Date().toISOString(),
      bmi,
      weight,
      height,
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
              Track and manage your health metrics
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
              <CardTitle className="text-sm font-medium">Current BMI</CardTitle>
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
              <CardTitle className="text-sm font-medium">
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
                <Activity className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Measurements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">{records.length}</p>
                  <p className="text-xs text-muted-foreground">Total records</p>
                </div>
                <Calendar className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">
                    {latestCategory !== "No data" ? latestCategory : "--"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Based on latest BMI
                  </p>
                </div>
                <Target className="h-8 w-8 text-primary opacity-50" />
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
              <BMIRecommendations
                bmi={currentBMI || (records.length > 0 ? records[0].bmi : null)}
              />
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BMICalculator onCalculate={handleBMICalculation} />
              <BMIRecommendations bmi={currentBMI} />
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <BMIHistory records={records} onDelete={handleDeleteRecord} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
