import { ProBMICalculator } from "./ui/pro-bmi-calculator";

export default function StoryboardProBMI() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Professional BMI Calculator
      </h1>
      <ProBMICalculator />
    </div>
  );
}
