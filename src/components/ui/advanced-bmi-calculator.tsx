import { useState } from "react";
import { Button } from "./button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { ProfessionalBMICalculator } from "./professional-bmi-calculator";
import { SportSpecificBMICalculator } from "./sport-specific-bmi-calculator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Activity, Brain, BarChart } from "lucide-react";

export function AdvancedBMICalculator() {
  const [calculatorType, setCalculatorType] = useState<
    "sport" | "professional"
  >("sport");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choose Your BMI Calculator</CardTitle>
          <CardDescription>
            Select the calculator that best fits your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={calculatorType === "sport" ? "default" : "outline"}
              className="h-auto py-4 flex flex-col items-center justify-center"
              onClick={() => setCalculatorType("sport")}
            >
              <Activity className="h-8 w-8 mb-2" />
              <div>
                <div className="font-medium">Sport-Specific BMI</div>
                <div className="text-xs mt-1 opacity-80">
                  For recreational and amateur athletes
                </div>
              </div>
            </Button>

            <Button
              variant={
                calculatorType === "professional" ? "default" : "outline"
              }
              className="h-auto py-4 flex flex-col items-center justify-center"
              onClick={() => setCalculatorType("professional")}
            >
              <BarChart className="h-8 w-8 mb-2" />
              <div>
                <div className="font-medium">Professional Assessment</div>
                <div className="text-xs mt-1 opacity-80">
                  For competitive and professional athletes
                </div>
              </div>
            </Button>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {calculatorType === "sport" ? (
              <p>
                The Sport-Specific BMI calculator provides tailored BMI ranges
                for different sports with consideration for emotional state and
                activity level.
              </p>
            ) : (
              <p>
                The Professional Assessment provides comprehensive athletic
                analysis with advanced metrics including body composition,
                recovery, and emotional factors.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {calculatorType === "sport" ? (
        <SportSpecificBMICalculator />
      ) : (
        <ProfessionalBMICalculator />
      )}

      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle className="text-sm">About Our BMI Calculators</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Unlike standard BMI calculators, our tools are designed specifically
            for athletes and active individuals. We consider sport-specific
            factors, emotional state, and recovery metrics to provide a more
            accurate assessment of body composition and performance potential.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
