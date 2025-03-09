import { BMICalculator } from "./ui/bmi-calculator";
import { ProfessionalBMICalculator } from "./ui/professional-bmi-calculator";

export default function StoryboardCompareCalculators() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">
        BMI Calculator Comparison
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Standard Calculator
          </h2>
          <BMICalculator />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Professional Calculator
          </h2>
          <ProfessionalBMICalculator />
        </div>
      </div>
    </div>
  );
}
