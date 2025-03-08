import { AdvancedBMICalculator } from "./ui/advanced-bmi-calculator";

export default function StoryboardAdvancedBMI() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Professional BMI Calculator
      </h1>
      <AdvancedBMICalculator />
    </div>
  );
}
