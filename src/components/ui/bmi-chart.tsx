import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { LineChart, BarChartBig, Calendar, TrendingUp } from "lucide-react";

interface BMIRecord {
  date: string;
  bmi: number;
  weight?: number;
}

interface BMIChartProps {
  records: BMIRecord[];
}

export function BMIChart({ records = [] }: BMIChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [timeRange, setTimeRange] = useState<"all" | "month" | "year">("all");

  useEffect(() => {
    const initChart = async () => {
      if (!chartRef.current || records.length === 0) return;

      // Dynamically import Chart.js to avoid SSR issues
      const {
        Chart,
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        TimeScale,
        Tooltip,
        Legend,
        BarController,
        BarElement,
        CategoryScale,
        Filler,
      } = await import("chart.js");
      await import("chartjs-adapter-date-fns");

      Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        TimeScale,
        Tooltip,
        Legend,
        BarController,
        BarElement,
        CategoryScale,
        Filler,
      );

      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return;

      // Filter records based on time range
      let filteredRecords = [...records];
      const now = new Date();

      if (timeRange === "month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        filteredRecords = records.filter(
          (record) => new Date(record.date) >= oneMonthAgo,
        );
      } else if (timeRange === "year") {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        filteredRecords = records.filter(
          (record) => new Date(record.date) >= oneYearAgo,
        );
      }

      // Sort records by date
      const sortedRecords = [...filteredRecords].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      // Format dates for display
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      };

      // Prepare data for chart
      const labels = sortedRecords.map((record) =>
        chartType === "line" ? record.date : formatDate(record.date),
      );

      const bmiData = sortedRecords.map((record) => record.bmi);
      const weightData = sortedRecords
        .map((record) => record.weight || 0)
        .filter((w) => w > 0);

      // Create chart
      chartInstance.current = new Chart(ctx, {
        type: chartType,
        data: {
          labels: labels,
          datasets: [
            {
              label: "BMI",
              data: bmiData,
              borderColor: "hsl(var(--primary))",
              backgroundColor:
                chartType === "line"
                  ? "rgba(59, 130, 246, 0.1)"
                  : "rgba(59, 130, 246, 0.7)",
              borderWidth: 2,
              tension: 0.3,
              fill: chartType === "line",
              yAxisID: "y",
            },
            ...(weightData.length > 0
              ? [
                  {
                    label: "Weight (kg)",
                    data: weightData,
                    borderColor: "rgba(234, 88, 12, 1)",
                    backgroundColor:
                      chartType === "line"
                        ? "rgba(234, 88, 12, 0.1)"
                        : "rgba(234, 88, 12, 0.7)",
                    borderWidth: 2,
                    tension: 0.3,
                    fill: chartType === "line",
                    yAxisID: "y1",
                    hidden: true,
                  },
                ]
              : []),
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: chartType === "line" ? "time" : "category",
              ...(chartType === "line"
                ? {
                    time: {
                      unit: "day",
                      displayFormats: {
                        day: "MMM d",
                      },
                    },
                  }
                : {}),
              title: {
                display: true,
                text: "Date",
                color: "#64748b",
              },
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: "BMI",
                color: "#64748b",
              },
              min: Math.max(
                10,
                Math.min(...sortedRecords.map((r) => r.bmi)) - 2,
              ),
              max: Math.min(
                40,
                Math.max(...sortedRecords.map((r) => r.bmi)) + 2,
              ),
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
              ticks: {
                color: "#64748b",
              },
            },
            ...(weightData.length > 0
              ? {
                  y1: {
                    beginAtZero: false,
                    position: "right",
                    title: {
                      display: true,
                      text: "Weight (kg)",
                      color: "#64748b",
                    },
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: "#64748b",
                    },
                  },
                }
              : {}),
          },
          plugins: {
            legend: {
              display: weightData.length > 0,
              position: "top",
              labels: {
                usePointStyle: true,
                boxWidth: 6,
                color: "#64748b",
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || "";
                  const value = context.parsed.y;
                  return `${label}: ${value}`;
                },
              },
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              titleColor: "white",
              bodyColor: "white",
              borderColor: "rgba(0, 0, 0, 0.1)",
              borderWidth: 1,
              padding: 10,
              displayColors: true,
            },
          },
        },
      });
    };

    initChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [records, chartType, timeRange]);

  // Calculate BMI trend
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

  const bmiTrend = getBMITrend();

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            <CardTitle>BMI Progress</CardTitle>
          </div>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <Select
              value={timeRange}
              onValueChange={(value: "all" | "month" | "year") =>
                setTimeRange(value)
              }
            >
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex bg-muted rounded-md p-0.5">
              <Button
                variant={chartType === "line" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setChartType("line")}
              >
                <LineChart className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === "bar" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setChartType("bar")}
              >
                <BarChartBig className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <CardDescription className="flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
          <span>Track your BMI changes over time</span>
          {records.length > 1 && (
            <span
              className={`ml-2 text-xs font-medium ${bmiTrend.trend < 0 ? "text-green-500" : bmiTrend.trend > 0 ? "text-red-500" : "text-gray-500"}`}
            >
              {bmiTrend.trend < 0 ? "↓" : bmiTrend.trend > 0 ? "↑" : ""}{" "}
              {bmiTrend.percentage}%{" "}
              {bmiTrend.trend < 0
                ? "decrease"
                : bmiTrend.trend > 0
                  ? "increase"
                  : ""}{" "}
              since last measurement
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {records.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground bg-muted/30 rounded-md border border-dashed border-muted">
              <TrendingUp className="h-12 w-12 mr-3 text-muted-foreground opacity-50" />
              <div>
                <p className="font-medium">No BMI records available</p>
                <p className="text-sm">Start by calculating your BMI</p>
              </div>
            </div>
          ) : (
            <canvas ref={chartRef} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
