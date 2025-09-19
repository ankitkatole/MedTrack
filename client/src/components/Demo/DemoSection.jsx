import React, { useState } from 'react';
import { 
  Stethoscope, 
  Pill, 
  UserCheck, 
  BarChart3,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react';

const DemoSection = () => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const demos = [
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Patient Portal",
      description: "View prescriptions, track health metrics, and access medical history",
      features: ["Prescription History", "Health Analytics", "Doctor Communication", "Medication Tracking"]
    },
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Doctor Dashboard",
      description: "Create prescriptions, manage patients, and track practice analytics",
      features: ["Patient Search", "Prescription Creation", "Practice Analytics", "Patient Management"]
    },
    {
      icon: <Pill className="w-6 h-6" />,
      title: "Pharmacist Tools",
      description: "Dispense medicines, track inventory, and manage patient prescriptions",
      features: ["Prescription Dispensing", "Inventory Management", "Patient Search", "Dispense Analytics"]
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Health Analytics",
      description: "Comprehensive insights and visualizations for better health management",
      features: ["Trend Analysis", "Health Metrics", "Prescription Patterns", "Custom Reports"]
    }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const interval = setInterval(() => {
        setActiveDemo((prev) => (prev + 1) % demos.length);
      }, 3000);
      setTimeout(() => {
        clearInterval(interval);
        setIsPlaying(false);
      }, 12000);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            See MedTrack in Action
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore how our platform works for different user roles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo Content */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Interactive Demo
              </h3>
              <button
                onClick={handlePlayPause}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Play'} Demo</span>
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {demos[activeDemo].icon}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {demos[activeDemo].title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {demos[activeDemo].description}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {demos[activeDemo].features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo Navigation */}
            <div className="flex space-x-2">
              {demos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveDemo(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeDemo 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Demo Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  {demos[activeDemo].icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {demos[activeDemo].title}
                </h3>
                <p className="text-blue-100 mb-6">
                  {demos[activeDemo].description}
                </p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto">
                  <span>Try Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 -left-6 w-4 h-4 bg-pink-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
