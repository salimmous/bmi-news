import { SportSpecificBMICalculator } from "./ui/sport-specific-bmi-calculator";

export default function StoryboardSportBMI() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Sport-Specific BMI Calculator</h1>
      <SportSpecificBMICalculator />
    </div>
  );
}
