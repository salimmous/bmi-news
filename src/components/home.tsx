import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Activity,
  Dumbbell,
  ChevronRight,
  BarChart,
  Trophy,
  Zap,
  Flame,
  LineChart,
  ArrowRight,
  Sparkles,
  Heart,
  Star,
  Gauge,
  Scale,
  Users,
  CheckCircle2,
} from "lucide-react";
import { BMICalculator } from "./ui/bmi-calculator";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-white">
      {/* Hero Section with animated gradient and particles */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 animate-gradient-x"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-20 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          {/* Animated particles */}
          <div className="particles-container">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`particle bg-purple-400 opacity-20 rounded-full absolute animate-float-${(i % 5) + 1}`}
                style={{
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 10 + 10}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 font-medium text-sm mb-6 shadow-sm">
                <Sparkles className="inline-block w-4 h-4 mr-1" /> Advanced
                Fitness Metrics
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-indigo-600 to-violet-700">
                Optimize Your Athletic Performance
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Get comprehensive body composition analysis tailored to your
                sport and training goals with our advanced calculators.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-500/20 transition-all duration-200 rounded-xl"
                >
                  <Link to="/fitness-calculator" className="flex items-center">
                    Try Athletic Calculator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 rounded-xl"
                >
                  <Link to="/health-recommendations">View Recommendations</Link>
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100 backdrop-blur-sm bg-white/90 transform hover:scale-[1.02] transition-all duration-300">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white mb-3 shadow-md">
                  <Scale className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-purple-800">
                  Quick BMI Check
                </h3>
                <p className="text-sm text-gray-500">
                  Get a basic assessment in seconds
                </p>
              </div>
              <BMICalculator />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-indigo-50/50"></div>
        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            <div className="p-6 text-center bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-purple-50 transform hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-4 mx-auto">
                <Activity className="h-6 w-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                10+
              </div>
              <p className="text-sm text-gray-500">Fitness Metrics</p>
            </div>
            <div className="p-6 text-center bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-50 transform hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4 mx-auto">
                <Dumbbell className="h-6 w-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                8+
              </div>
              <p className="text-sm text-gray-500">Sport Categories</p>
            </div>
            <div className="p-6 text-center bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-50 transform hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4 mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                99%
              </div>
              <p className="text-sm text-gray-500">Accuracy Rate</p>
            </div>
            <div className="p-6 text-center bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-cyan-50 transform hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 text-cyan-600 mb-4 mx-auto">
                <Gauge className="h-6 w-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-cyan-600 mb-2">
                24/7
              </div>
              <p className="text-sm text-gray-500">Available Online</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with 3D cards */}
      <section className="py-24 bg-gradient-to-b from-white to-purple-50 px-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-full filter blur-3xl"></div>
        <div className="absolute left-0 bottom-0 w-1/4 h-1/4 bg-gradient-to-tr from-indigo-200/30 to-purple-200/30 rounded-full filter blur-3xl"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-2 rounded-full text-purple-800 font-medium text-sm mb-4">
              <Star className="w-4 h-4 mr-2" /> Premium Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-indigo-600 to-violet-700">
              Advanced Fitness Metrics
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools provides detailed insights into
              your body composition and performance potential
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform -rotate-3">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  BMI Analysis
                </h3>
                <p className="text-gray-600">
                  Sport-specific BMI ranges with visual indicators and
                  personalized recommendations for optimal performance.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform -rotate-3">
                  <BarChart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Body Composition
                </h3>
                <p className="text-gray-600">
                  Advanced body fat calculation using the Navy method with lean
                  mass analysis and visual breakdowns.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform -rotate-3">
                  <Flame className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Metabolic Metrics
                </h3>
                <p className="text-gray-600">
                  Calculate BMR and TDEE with adjustments for activity level and
                  training goals for optimal nutrition planning.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-cyan-500 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform -rotate-3">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Performance Score
                </h3>
                <p className="text-gray-600">
                  Get a personalized athletic performance score with actionable
                  improvement steps and progress tracking.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Calculators Section with 3D cards */}
      <section className="py-24 bg-white px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/30 to-white"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full text-indigo-800 font-medium text-sm mb-4">
              <Zap className="w-4 h-4 mr-2" /> Interactive Tools
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-600 to-violet-700">
              Our Fitness Calculators
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the right calculator for your fitness journey and
              performance goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl group">
              <div className="h-56 bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-all duration-300 group-hover:scale-110"></div>
                <Activity className="h-24 w-24 text-white relative z-10 drop-shadow-lg group-hover:scale-110 transition-all duration-300" />
              </div>
              <CardContent className="p-8">
                <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-medium text-xs mb-4 shadow-sm">
                  Basic
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                  Standard BMI Calculator
                </h3>
                <p className="text-gray-600 mb-6">
                  Quick and simple BMI calculation with basic health insights
                  for general fitness assessment and weight management goals.
                </p>
                <Link to="/bmi-calculator" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 font-medium rounded-xl h-12"
                  >
                    Try Calculator
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl group">
              <div className="h-56 bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-all duration-300 group-hover:scale-110"></div>
                <Dumbbell className="h-24 w-24 text-white relative z-10 drop-shadow-lg group-hover:scale-110 transition-all duration-300" />
              </div>
              <CardContent className="p-8">
                <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium text-xs mb-4 shadow-sm">
                  Intermediate
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                  Sport-Specific BMI
                </h3>
                <p className="text-gray-600 mb-6">
                  Tailored BMI analysis for different sports with specialized
                  recommendations and sport-specific insights for athletes.
                </p>
                <Link to="/sport-bmi-calculator" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium rounded-xl h-12"
                  >
                    Try Calculator
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl group">
              <div className="h-56 bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800&q=80')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-all duration-300 group-hover:scale-110"></div>
                <LineChart className="h-24 w-24 text-white relative z-10 drop-shadow-lg group-hover:scale-110 transition-all duration-300" />
              </div>
              <CardContent className="p-8">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-xs mb-4 shadow-sm">
                  Advanced
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                  Athletic Performance Calculator
                </h3>
                <p className="text-gray-600 mb-6">
                  Comprehensive fitness metrics with performance analysis, body
                  composition, and personalized recommendations for elite
                  athletes.
                </p>
                <Link to="/fitness-calculator" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl h-12 shadow-md hover:shadow-lg">
                    Try Calculator
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section with floating cards */}
      <section className="py-24 bg-gradient-to-b from-purple-50 to-white px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-purple-200/20 to-indigo-200/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-indigo-200/20 to-purple-200/20 rounded-full filter blur-3xl"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-2 rounded-full text-purple-800 font-medium text-sm mb-4">
              <Users className="w-4 h-4 mr-2" /> Success Stories
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-indigo-600 to-violet-700">
              What Athletes Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from athletes who have optimized their performance with our
              advanced fitness tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-full -mt-8 -mr-8 z-0 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    JD
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg">John Doe</h4>
                    <p className="text-sm text-gray-500">Marathon Runner</p>
                  </div>
                </div>
                <div className="mb-4 text-purple-600">
                  <svg
                    width="100"
                    height="20"
                    viewBox="0 0 100 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 15L3.82 18.1459L4.90983 11.2361L0 6.85409L6.91 5.92705L10 0L13.09 5.92705L20 6.85409L15.0902 11.2361L16.18 18.1459L10 15Z"
                      fill="currentColor"
                    />
                    <path
                      d="M30 15L23.82 18.1459L24.9098 11.2361L20 6.85409L26.91 5.92705L30 0L33.09 5.92705L40 6.85409L35.0902 11.2361L36.18 18.1459L30 15Z"
                      fill="currentColor"
                    />
                    <path
                      d="M50 15L43.82 18.1459L44.9098 11.2361L40 6.85409L46.91 5.92705L50 0L53.09 5.92705L60 6.85409L55.0902 11.2361L56.18 18.1459L50 15Z"
                      fill="currentColor"
                    />
                    <path
                      d="M70 15L63.82 18.1459L64.9098 11.2361L60 6.85409L66.91 5.92705L70 0L73.09 5.92705L80 6.85409L75.0902 11.2361L76.18 18.1459L70 15Z"
                      fill="currentColor"
                    />
                    <path
                      d="M90 15L83.82 18.1459L84.9098 11.2361L80 6.85409L86.91 5.92705L90 0L93.09 5.92705L100 6.85409L95.0902 11.2361L96.18 18.1459L90 15Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  "The sport-specific BMI calculator helped me understand my
                  ideal weight range for marathon running. I've improved my
                  times significantly!"
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative mt-8 md:mt-0">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full -mt-8 -mr-8 z-0 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    AS
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg">Alex Smith</h4>
                    <p className="text-sm text-gray-500">CrossFit Athlete</p>
                  </div>
                </div>
                <div className="mb-4 text-indigo-600">
                  <svg
                    width="100"
                    height="20"
                    viewBox="0 0 100 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 15L3.82 18.1459L4.90983 11.2361L0 6.85409L6.91 5.92705L10 0L13.09 5.92705L20 6.85409L15.0902 11.2361L16.18 18.1459L10 15Z"
                      fill="currentColor"
                    />
                    <path
                      d="M30 15L23.82 18.1459L24.9098 11.2361L20 6.85409L26.91 5.92705L30 0L33.09 5.92705L40 6.85409L35.0902 11.2361L36.18 18.1459L30 15Z"
                      fill="currentColor"
                    />
                    <path
                      d="M50 15L43.82 18.1459L44.9098 11.2361L40 6.85409L46.91 5.92705L50 0L53.09 5.92705L60 6.85409L55.0902 11.2361L56.18 18.1459L50 15Z"
                      fill="currentColor"
                    />
                    <path
                      d="M70 15L63.82 18.1459L64.9098 11.2361L60 6.85409L66.91 5.92705L70 0L73.09 5.92705L80 6.85409L75.0902 11.2361L76.18 18.1459L70 15Z"
                      fill="currentColor"
                    />
                    <path
                      d="M90 15L83.82 18.1459L84.9098 11.2361L80 6.85409L86.91 5.92705L90 0L93.09 5.92705L100 6.85409L95.0902 11.2361L96.18 18.1459L90 15Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  "The body composition analysis gave me insights I couldn't get
                  anywhere else. Now I know exactly what to focus on in my
                  training."
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative mt-8 md:mt-16">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -mt-8 -mr-8 z-0 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    SJ
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500">Competitive Swimmer</p>
                  </div>
                </div>
                <div className="mb-4 text-blue-600">
                  <svg
                    width="100"
                    height="20"
                    viewBox="0 0 100 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 15L3.82 18.1459L4.90983 11.2361L0 6.85409L6.91 5.92705L10 0L13.09 5.92705L20 6.85409L15.0902 11.2361L16.18 18.1459L10 15Z"
                      fill="currentColor"
                    />
                    <path
                      d="M30 15L23.82 18.1459L24.9098 11.2361L20 6.85409L26.91 5.92705L30 0L33.09 5.92705L40 6.85409L35.0902 11.2361L36.18 18.1459L30 15Z"
                      fill="currentColor"
                    />
                    <path
                      d="M50 15L43.82 18.1459L44.9098 11.2361L40 6.85409L46.91 5.92705L50 0L53.09 5.92705L60 6.85409L55.0902 11.2361L56.18 18.1459L50 15Z"
                      fill="currentColor"
                    />
                    <path
                      d="M70 15L63.82 18.1459L64.9098 11.2361L60 6.85409L66.91 5.92705L70 0L73.09 5.92705L80 6.85409L75.0902 11.2361L76.18 18.1459L70 15Z"
                      fill="currentColor"
                    />
                    <path
                      d="M90 15L83.82 18.1459L84.9098 11.2361L80 6.85409L86.91 5.92705L90 0L93.09 5.92705L100 6.85409L95.0902 11.2361L96.18 18.1459L90 15Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  "The performance score feature helped me identify areas where
                  I could improve. My coach was impressed with the detailed
                  recommendations!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with wave background */}
      <section className="py-24 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill="rgba(255,255,255,0.1)"
            ></path>
          </svg>
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: "translateY(50px)" }}
          >
            <path
              d="M0,96L48,128C96,160,192,224,288,213.3C384,203,480,117,576,117.3C672,117,768,203,864,202.7C960,203,1056,117,1152,117.3C1248,117,1344,203,1392,245.3L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill="rgba(255,255,255,0.05)"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full text-white font-medium text-sm mb-8">
            <Sparkles className="w-4 h-4 mr-2" /> Start Your Fitness Journey
            Today
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
            Ready to Optimize Your{" "}
            <span className="text-purple-200">Athletic Performance</span>?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Get personalized insights based on your sport, body composition, and
            fitness goals with our advanced calculators and recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button
              asChild
              size="lg"
              className="bg-white text-purple-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6 h-auto rounded-xl"
            >
              <Link to="/fitness-calculator" className="flex items-center">
                Try Athletic Calculator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10 transition-all duration-300 text-lg px-8 py-6 h-auto rounded-xl"
            >
              <Link to="/health-recommendations">View Recommendations</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Add this to your CSS or create a style tag */}
      <style jsx>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        @keyframes blob {
          0% {
            transform: scale(1);
          }
          33% {
            transform: scale(1.1);
          }
          66% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Particle animations */
        .particle {
          border-radius: 50%;
        }
        @keyframes float-1 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(10px, -15px);
          }
          50% {
            transform: translate(20px, 0);
          }
          75% {
            transform: translate(10px, 15px);
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(-15px, 10px);
          }
          50% {
            transform: translate(0, 20px);
          }
          75% {
            transform: translate(15px, 10px);
          }
        }
        @keyframes float-3 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(15px, 15px);
          }
          50% {
            transform: translate(0, 30px);
          }
          75% {
            transform: translate(-15px, 15px);
          }
        }
        @keyframes float-4 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(-20px, -10px);
          }
          50% {
            transform: translate(-40px, 0);
          }
          75% {
            transform: translate(-20px, 10px);
          }
        }
        @keyframes float-5 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(20px, 20px);
          }
          50% {
            transform: translate(40px, 0);
          }
          75% {
            transform: translate(20px, -20px);
          }
        }
        .animate-float-1 {
          animation: float-1 infinite linear;
        }
        .animate-float-2 {
          animation: float-2 infinite linear;
        }
        .animate-float-3 {
          animation: float-3 infinite linear;
        }
        .animate-float-4 {
          animation: float-4 infinite linear;
        }
        .animate-float-5 {
          animation: float-5 infinite linear;
        }
      `}</style>
    </div>
  );
}

export default Home;
