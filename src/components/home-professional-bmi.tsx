import { useState } from "react";
import { Button } from "./ui/button";
import { ProfessionalBMICalculator } from "./ui/professional-bmi-calculator";
import {
  Dumbbell,
  Activity,
  Heart,
  BarChart,
  ChevronRight,
} from "lucide-react";

export default function HomeProfessionalBMI() {
  const [activeSection, setActiveSection] = useState<string>("hero");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">
              Pro BMI Tracker
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection("hero")}
              className={`text-sm font-medium ${activeSection === "hero" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className={`text-sm font-medium ${activeSection === "features" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("sports")}
              className={`text-sm font-medium ${activeSection === "sports" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
            >
              Sports
            </button>
            <button
              onClick={() => scrollToSection("calculator")}
              className={`text-sm font-medium ${activeSection === "calculator" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
            >
              Calculator
            </button>
          </nav>
          <div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Professional BMI Analysis for
                <span className="text-blue-600">
                  {" "}
                  Athletes & Sports Enthusiasts
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get personalized body composition insights tailored to your
                sport, activity level, and emotional state.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => scrollToSection("calculator")}
                >
                  Try Calculator
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
                alt="Athletes training"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Advanced Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Sport-Specific Analysis
              </h3>
              <p className="text-gray-600">
                Tailored BMI insights for different sports and activities, from
                running to weightlifting.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Dumbbell className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Body Composition</h3>
              <p className="text-gray-600">
                Advanced metrics including body fat percentage, lean mass, and
                adjusted BMI calculations.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Emotional Factors</h3>
              <p className="text-gray-600">
                Considers your emotional state for more holistic health
                recommendations.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Metrics</h3>
              <p className="text-gray-600">
                Comprehensive data including BMR, daily calorie needs, and ideal
                weight ranges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section id="sports" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Optimized for Your Sport
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Different sports have different ideal body composition requirements.
            Our calculator provides sport-specific insights.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80"
                alt="Running"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Running</h3>
                <p className="text-gray-600 mb-4">Ideal BMI Range: 18.5-22.0</p>
                <p className="text-gray-600">
                  Distance runners typically maintain lower BMI values for
                  optimal performance and efficiency.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80"
                alt="Weightlifting"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Weightlifting</h3>
                <p className="text-gray-600 mb-4">Ideal BMI Range: 23.0-27.5</p>
                <p className="text-gray-600">
                  Weightlifters typically have higher BMI due to increased
                  muscle mass and strength requirements.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80"
                alt="Swimming"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Swimming</h3>
                <p className="text-gray-600 mb-4">Ideal BMI Range: 21.0-24.0</p>
                <p className="text-gray-600">
                  Swimmers often have higher muscle mass and slightly higher BMI
                  with low body fat percentage.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => scrollToSection("calculator")}
            >
              Try Sport-Specific Calculator
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Professional BMI Calculator
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Get a comprehensive analysis of your body composition with our
            advanced calculator.
          </p>

          <ProfessionalBMICalculator />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">Pro BMI Tracker</span>
              </div>
              <p className="text-gray-400">
                Advanced body composition analysis for athletes and sports
                enthusiasts.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sport-Specific Analysis</li>
                <li>Body Composition</li>
                <li>Emotional Factors</li>
                <li>Detailed Metrics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Sports</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Running</li>
                <li>Swimming</li>
                <li>Cycling</li>
                <li>Weightlifting</li>
                <li>And more...</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: contact@probmitracker.com</li>
                <li>Phone: (123) 456-7890</li>
                <li>Address: 123 Fitness St, Health City</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2023 Pro BMI Tracker. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
