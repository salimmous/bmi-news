import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Activity, Dumbbell, Heart, ChevronRight } from "lucide-react";

export default function HomeSports() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Optimize Your Performance with
                <span className="text-blue-600"> Sport-Specific BMI</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Advanced body composition analysis tailored to your sport,
                training level, and emotional state.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Try Calculator
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  View Athlete Profiles
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80"
                alt="Athletes training"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Optimized for Your Sport
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80"
                alt="Running"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Running</h3>
                <p className="text-gray-600 mb-4">Ideal BMI Range: 18.5-22.0</p>
                <p className="text-gray-600 mb-6">
                  Distance runners typically maintain lower BMI values for
                  optimal performance and efficiency.
                </p>
                <Button variant="outline" className="w-full">
                  Runner's Analysis
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80"
                alt="Weightlifting"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Weightlifting</h3>
                <p className="text-gray-600 mb-4">Ideal BMI Range: 23.0-27.5</p>
                <p className="text-gray-600 mb-6">
                  Weightlifters typically have higher BMI due to increased
                  muscle mass and strength requirements.
                </p>
                <Button variant="outline" className="w-full">
                  Strength Analysis
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80"
                alt="Swimming"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Swimming</h3>
                <p className="text-gray-600 mb-4">Ideal BMI Range: 21.0-24.0</p>
                <p className="text-gray-600 mb-6">
                  Swimmers often have higher muscle mass and slightly higher BMI
                  with low body fat percentage.
                </p>
                <Button variant="outline" className="w-full">
                  Swimmer's Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Advanced Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Sport-Specific Analysis
              </h3>
              <p className="text-gray-600 text-center">
                Tailored BMI insights for different sports and activities, from
                running to weightlifting.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Dumbbell className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Body Composition
              </h3>
              <p className="text-gray-600 text-center">
                Advanced metrics including body fat percentage, lean mass, and
                adjusted BMI calculations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Emotional Factors
              </h3>
              <p className="text-gray-600 text-center">
                Considers your emotional state for more holistic health
                recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Optimize Your Athletic Performance?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Get personalized insights based on your sport, body composition, and
            emotional state.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" variant="secondary">
              Try the Calculator
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-blue-700"
            >
              Create Athlete Profile
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
