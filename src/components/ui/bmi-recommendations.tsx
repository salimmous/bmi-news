import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Check, Info, HeartPulse, AlertCircle } from "lucide-react";

interface BMIRecommendationsProps {
  bmi: number | null;
}

export function BMIRecommendations({ bmi }: BMIRecommendationsProps) {
  if (bmi === null) {
    return (
      <Card className="w-full bg-white shadow-md">
        <CardHeader>
          <div className="flex items-center">
            <HeartPulse className="h-5 w-5 mr-2 text-primary" />
            <CardTitle>Health Recommendations</CardTitle>
          </div>
          <CardDescription>
            Calculate your BMI to see personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6 text-muted-foreground bg-muted/30 rounded-md border border-dashed border-muted">
            <Info className="mr-2 h-5 w-5" />
            <span>Please calculate your BMI first</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  let recommendations: string[] = [];
  let category = "";
  let categoryColor = "";
  let categoryIcon = null;

  if (bmi < 18.5) {
    category = "Underweight";
    categoryColor = "text-blue-500";
    categoryIcon = <AlertCircle className="h-5 w-5 text-blue-500" />;
    recommendations = [
      "Increase your caloric intake with nutrient-dense foods",
      "Include protein-rich foods in every meal",
      "Add healthy fats like avocados, nuts, and olive oil to your diet",
      "Consider strength training to build muscle mass",
      "Consult with a healthcare provider about a healthy weight gain plan",
    ];
  } else if (bmi >= 18.5 && bmi < 25) {
    category = "Normal weight";
    categoryColor = "text-green-500";
    categoryIcon = <HeartPulse className="h-5 w-5 text-green-500" />;
    recommendations = [
      "Maintain a balanced diet with plenty of fruits and vegetables",
      "Stay physically active with at least 150 minutes of moderate exercise weekly",
      "Get regular health check-ups to monitor your overall health",
      "Ensure adequate sleep (7-9 hours) for optimal health",
      "Practice stress management techniques like meditation or yoga",
    ];
  } else if (bmi >= 25 && bmi < 30) {
    category = "Overweight";
    categoryColor = "text-orange-500";
    categoryIcon = <AlertCircle className="h-5 w-5 text-orange-500" />;
    recommendations = [
      "Focus on portion control and mindful eating",
      "Increase physical activity to at least 150-300 minutes per week",
      "Reduce intake of processed foods, sugary drinks, and high-calorie snacks",
      "Consider keeping a food journal to track eating habits",
      "Set realistic weight loss goals (0.5-1 kg per week)",
    ];
  } else {
    category = "Obese";
    categoryColor = "text-red-500";
    categoryIcon = <AlertCircle className="h-5 w-5 text-red-500" />;
    recommendations = [
      "Consult with a healthcare provider about a safe weight loss plan",
      "Consider working with a registered dietitian for personalized nutrition advice",
      "Start with low-impact exercises like walking or swimming",
      "Focus on gradual, sustainable lifestyle changes rather than quick fixes",
      "Monitor other health markers like blood pressure and blood sugar",
    ];
  }

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <div className="flex items-center">
          <HeartPulse className="h-5 w-5 mr-2 text-primary" />
          <CardTitle>Health Recommendations</CardTitle>
        </div>
        <CardDescription className="flex items-center">
          Based on your BMI of <span className="font-semibold mx-1">{bmi}</span>
          <span className={`flex items-center ml-1 ${categoryColor}`}>
            {categoryIcon}
            <span className="ml-1">({category})</span>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-md bg-muted/30 border border-muted mb-4">
          <p className="text-sm text-muted-foreground">
            These recommendations are general guidelines. Always consult with
            healthcare professionals for personalized advice.
          </p>
        </div>
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <li
              key={index}
              className="flex items-start bg-white p-2 rounded-md hover:bg-muted/20 transition-colors"
            >
              <div className="mr-3 mt-0.5 bg-primary/10 p-1 rounded-full">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
              </div>
              <span className="text-sm">{recommendation}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
