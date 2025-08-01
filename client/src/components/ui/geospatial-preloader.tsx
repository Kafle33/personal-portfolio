import { useState, useEffect } from "react";

interface GeospatialPreloaderProps {
  onComplete: () => void;
}

export function GeospatialPreloader({ onComplete }: GeospatialPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Initializing GIS systems...",
    "Connecting to satellites...",
    "Deploying drone network...",
    "Processing AI algorithms...",
    "Loading satellite imagery...",
    "Calibrating GPS coordinates...",
    "Rendering map layers...",
    "Analyzing geospatial data...",
    "Finalizing spatial analysis..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 800);

    return () => clearInterval(stepInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[hsl(76,44%,15%)] via-[hsl(219,79%,36%)] to-[hsl(156,81%,29%)] dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="text-center text-white">
        {/* Enhanced Animated Globe with Geospatial Elements */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto relative">
            {/* Globe outline */}
            <div className="w-24 h-24 border-4 border-white/30 rounded-full animate-spin" style={{ animationDuration: '3s' }}>
              {/* Latitude lines */}
              <div className="absolute inset-2 border-2 border-white/20 rounded-full">
                <div className="absolute inset-2 border-2 border-white/20 rounded-full">
                  <div className="absolute inset-2 border-2 border-white/20 rounded-full"></div>
                </div>
              </div>
              {/* Longitude lines */}
              <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/20 transform -translate-x-0.5"></div>
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/20 transform -translate-y-0.5"></div>
            </div>
            
            {/* Orbiting satellites with icons */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 animate-pulse text-yellow-300">
                <i className="fas fa-satellite text-sm"></i>
              </div>
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
              <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 animate-pulse text-blue-300">
                <i className="fas fa-broadcast-tower text-sm"></i>
              </div>
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '5s' }}>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 animate-pulse text-green-300">
                <i className="fas fa-helicopter text-xs"></i>
              </div>
            </div>
          </div>
          
          {/* Enhanced Radar sweep with AI elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border border-white/10 rounded-full animate-ping"></div>
            <div className="absolute w-40 h-40 border border-white/5 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute w-28 h-28 border border-purple-300/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          {/* Floating AI and drone elements */}
          <div className="absolute -top-6 -left-6 text-purple-300/60 animate-bounce" style={{ animationDelay: '0.2s' }}>
            <i className="fas fa-brain text-xs"></i>
          </div>
          <div className="absolute -top-6 -right-6 text-cyan-300/60 animate-bounce" style={{ animationDelay: '0.8s' }}>
            <i className="fas fa-microchip text-xs"></i>
          </div>
          <div className="absolute -bottom-6 -left-6 text-orange-300/60 animate-bounce" style={{ animationDelay: '1.2s' }}>
            <i className="fas fa-location-dot text-xs"></i>
          </div>
          <div className="absolute -bottom-6 -right-6 text-red-300/60 animate-bounce" style={{ animationDelay: '1.6s' }}>
            <i className="fas fa-plane text-xs"></i>
          </div>
        </div>

        {/* Loading text */}
        <h2 className="text-2xl font-bold mb-4">
          <span className="bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
            Roshan Kafle
          </span>
        </h2>
        <p className="text-lg mb-2 text-white/90">Geospatial Engineer Portfolio</p>
        
        {/* Current step */}
        <div className="mb-6 h-6">
          <p className="text-sm text-white/80 animate-pulse">{steps[currentStep]}</p>
        </div>

        {/* Progress bar */}
        <div className="w-80 max-w-full mx-auto">
          <div className="bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-300 via-blue-300 to-green-300 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-white/70">{Math.round(Math.min(progress, 100))}% Complete</p>
        </div>

        {/* Coordinate display */}
        <div className="mt-6 font-mono text-xs text-white/60">
          <div className="flex justify-center space-x-6">
            <span>LAT: 28.2096°N</span>
            <span>LON: 83.9856°E</span>
            <span>ALT: 822m</span>
          </div>
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, white 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
    </div>
  );
}