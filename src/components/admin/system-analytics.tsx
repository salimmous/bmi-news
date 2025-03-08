import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState, useEffect, useRef } from "react";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    borderWidth: number;
    tension?: number;
    fill?: boolean;
  }[];
}

export function SystemAnalytics() {
  const [timeRange, setTimeRange] = useState("30days");
  const [activeTab, setActiveTab] = useState("users");

  const userChartRef = useRef<HTMLCanvasElement>(null);
  const userChartInstance = useRef<any>(null);

  const bmiChartRef = useRef<HTMLCanvasElement>(null);
  const bmiChartInstance = useRef<any>(null);

  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const categoryChartInstance = useRef<any>(null);

  // Mock data for charts
  const getUserData = (): ChartData => {
    if (timeRange === "7days") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "New Users",
            data: [3, 5, 2, 4, 7, 6, 8],
            borderColor: "hsl(var(--primary))",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      };
    } else if (timeRange === "30days") {
      return {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: "New Users",
            data: Array.from(
              { length: 30 },
              () => Math.floor(Math.random() * 10) + 1,
            ),
            borderColor: "hsl(var(--primary))",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      };
    } else {
      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "New Users",
            data: [25, 32, 40, 38, 45, 50, 55, 60, 58, 65, 70, 75],
            borderColor: "hsl(var(--primary))",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      };
    }
  };

  const getBmiData = (): ChartData => {
    if (timeRange === "7days") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "BMI Records",
            data: [12, 15, 10, 18, 20, 15, 22],
            borderColor: "hsl(var(--primary))",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      };
    } else if (timeRange === "30days") {
      return {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: "BMI Records",
            data: Array.from(
              { length: 30 },
              () => Math.floor(Math.random() * 30) + 5,
            ),
            borderColor: "hsl(var(--primary))",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      };
    } else {
      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "BMI Records",
            data: [120, 150, 180, 200, 220, 250, 280, 300, 320, 350, 380, 400],
            borderColor: "hsl(var(--primary))",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      };
    }
  };

  const getCategoryData = (): ChartData => {
    return {
      labels: ["Underweight", "Normal", "Overweight", "Obese"],
      datasets: [
        {
          label: "Users by BMI Category",
          data: [15, 45, 30, 10],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(54, 162, 235, 1)",
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  useEffect(() => {
    const initCharts = async () => {
      const {
        Chart,
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        BarController,
        BarElement,
        PieController,
        ArcElement,
        Tooltip,
        Legend,
      } = await import("chart.js");

      Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        BarController,
        BarElement,
        PieController,
        ArcElement,
        Tooltip,
        Legend,
      );

      // Initialize user chart
      if (userChartRef.current) {
        if (userChartInstance.current) {
          userChartInstance.current.destroy();
        }

        const ctx = userChartRef.current.getContext("2d");
        if (ctx) {
          userChartInstance.current = new Chart(ctx, {
            type: "line",
            data: getUserData(),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Number of Users",
                  },
                },
              },
            },
          });
        }
      }

      // Initialize BMI records chart
      if (bmiChartRef.current) {
        if (bmiChartInstance.current) {
          bmiChartInstance.current.destroy();
        }

        const ctx = bmiChartRef.current.getContext("2d");
        if (ctx) {
          bmiChartInstance.current = new Chart(ctx, {
            type: "line",
            data: getBmiData(),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Number of Records",
                  },
                },
              },
            },
          });
        }
      }

      // Initialize BMI category chart
      if (categoryChartRef.current) {
        if (categoryChartInstance.current) {
          categoryChartInstance.current.destroy();
        }

        const ctx = categoryChartRef.current.getContext("2d");
        if (ctx) {
          categoryChartInstance.current = new Chart(ctx, {
            type: "pie",
            data: getCategoryData(),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "right",
                },
              },
            },
          });
        }
      }
    };

    initCharts();

    return () => {
      if (userChartInstance.current) {
        userChartInstance.current.destroy();
      }
      if (bmiChartInstance.current) {
        bmiChartInstance.current.destroy();
      }
      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy();
      }
    };
  }, [timeRange, activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">System Analytics</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="bmi">BMI Records</TabsTrigger>
          <TabsTrigger value="categories">BMI Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>User Growth</CardTitle>
              <CardDescription>
                {timeRange === "7days"
                  ? "New user registrations over the past week"
                  : timeRange === "30days"
                    ? "New user registrations over the past month"
                    : "New user registrations throughout the year"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <canvas ref={userChartRef} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bmi" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>BMI Records</CardTitle>
              <CardDescription>
                {timeRange === "7days"
                  ? "BMI measurements recorded over the past week"
                  : timeRange === "30days"
                    ? "BMI measurements recorded over the past month"
                    : "BMI measurements recorded throughout the year"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <canvas ref={bmiChartRef} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>BMI Categories Distribution</CardTitle>
              <CardDescription>
                Distribution of users across different BMI categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <canvas ref={categoryChartRef} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
