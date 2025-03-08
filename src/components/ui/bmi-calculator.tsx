import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Slider } from "./slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Calculator, Scale, Ruler } from "lucide-react";

interface BMICalculatorProps {
  onCalculate?: (bmi: number, weight: number, height: number) => void;
}

export function BMICalculator({ onCalculate = () => {} }: BMICalculatorProps) {
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

  const calculateBMI = () => {
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      const roundedBmi = parseFloat(bmiValue.toFixed(1));

      setBmi(roundedBmi);
      setCategory(getBMICategory(roundedBmi));
      onCalculate(roundedBmi, weight, height);
    }
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 25) return "Normal weight";
    if (bmi >= 25 && bmi < 30) return "Overweight";
    return "Obese";
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Underweight":
        return "text-blue-500";
      case "Normal weight":
        return "text-green-500";
      case "Overweight":
        return "text-orange-500";
      case "Obese":
        return "text-red-500";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-md">
      <CardHeader>
        <div className="flex items-center">
          <Calculator className="h-5 w-5 mr-2 text-primary" />
          <CardTitle className="text-xl font-bold">BMI Calculator</CardTitle>
        </div>
        <CardDescription>
          Calculate your Body Mass Index to check if your weight is healthy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {bmi !== null && (
          <div className="mt-6 p-4 rounded-md bg-secondary border border-border">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Your BMI:</p>
              <p className="text-xl font-bold">{bmi}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm">Category:</p>
              <p
                className={`text-sm font-medium ${getCategoryColor(category)}`}
              >
                {category}
              </p>
            </div>
            <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${bmi < 18.5 ? "bg-blue-500" : bmi < 25 ? "bg-green-500" : bmi < 30 ? "bg-orange-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(100, (bmi / 40) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1 text-muted-foreground">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button onClick={calculateBMI} className="w-full">
          Calculate BMI
        </Button>
        {bmi !== null && (
          <p className="text-xs text-center text-muted-foreground">
            Your BMI has been calculated and saved to your history.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
