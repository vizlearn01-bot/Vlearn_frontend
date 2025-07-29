import React, { useState, useEffect } from 'react';
import { Thermometer, Clock, Zap } from 'lucide-react';

const ReactionRateSim = () => {
  // Reaction parameters
  const [temperature, setTemperature] = useState(20); // °C
  const [reactionStarted, setReactionStarted] = useState(false);
  const [reactionComplete, setReactionComplete] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [cloudiness, setCloudiness] = useState(0); // 0-100%

  // Calculate reaction time based on temperature (Arrhenius equation approximation)
  const calculateReactionTime = (temp) => {
    // Simplified model where reaction time halves every 10°C increase
    const baseTime = 60; // seconds at 20°C
    const q10 = 2; // Temperature coefficient
    return baseTime / Math.pow(q10, (temp - 20) / 10);
  };

  // Start the reaction
  const startReaction = () => {
    if (reactionStarted) return;
    
    setReactionStarted(true);
    setReactionComplete(false);
    setCloudiness(0);
    setTimeElapsed(0);
  };

  // Reset the reaction
  const resetReaction = () => {
    setReactionStarted(false);
    setReactionComplete(false);
    setCloudiness(0);
    setTimeElapsed(0);
  };

  // Simulate reaction progress
  useEffect(() => {
    if (!reactionStarted || reactionComplete) return;

    const targetTime = calculateReactionTime(temperature);
    const interval = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 0.1;
        
        // Update cloudiness (0-100%)
        const progress = Math.min(newTime / targetTime, 1);
        setCloudiness(progress * 100);

        if (newTime >= targetTime) {
          setReactionComplete(true);
          clearInterval(interval);
        }

        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [reactionStarted, reactionComplete, temperature]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Temperature and Reaction Rate
      </h2>
      <p className="text-center mb-6 text-gray-600">
        Na₂S₂O₃(aq) + 2HCl(aq) → 2NaCl(aq) + S(s) + SO₂(g) + H₂O(l)
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Controls panel */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Thermometer className="w-5 h-5" /> Temperature Controls
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature: {temperature}°C
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full"
                  disabled={reactionStarted}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10°C</span>
                  <span>60°C</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-600">
                  <Zap className="inline mr-1 w-4 h-4" />
                  <strong>Predicted reaction time:</strong> {calculateReactionTime(temperature).toFixed(1)} seconds
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Experiment Controls</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={startReaction}
                disabled={reactionStarted}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  reactionStarted
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Start Reaction
              </button>

              <button
                onClick={resetReaction}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Observations</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <strong>Time elapsed:</strong> {timeElapsed.toFixed(1)}s
              </p>
              <p>
                <strong>Solution appearance:</strong> {getCloudinessDescription(cloudiness)}
              </p>
              {reactionComplete && (
                <div className="bg-green-50 text-green-800 p-3 rounded-lg mt-2">
                  Reaction complete! The sulfur precipitate has fully formed.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-48 h-64 mb-6">
            {/* Flask */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-48">
              <div 
                className={`absolute bottom-0 w-full h-full bg-yellow-100 transition-opacity duration-300 rounded-b-full ${reactionStarted ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  opacity: cloudiness/100 * 0.9,
                  backgroundColor: `rgba(255, 255, 0, ${cloudiness/200})`
                }}
              />
              <div className="absolute bottom-0 w-full h-full border-2 border-gray-300 rounded-b-full" />
            </div>
          </div>

          <div className="w-full bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Scientific Explanation</h4>
            <p className="text-sm text-gray-700">
              As temperature increases ({temperature}°C), the reaction rate increases because:<br />
              1. Particles move faster → more frequent collisions<br />
              2. More particles have enough energy to react (activation energy)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to describe cloudiness
const getCloudinessDescription = (cloudiness) => {
  if (cloudiness === 0) return "Clear solution";
  if (cloudiness < 30) return "Slightly cloudy";
  if (cloudiness < 70) return "Cloudy";
  if (cloudiness < 90) return "Very cloudy";
  return "Completely opaque (sulfur precipitate)";
};

export default ReactionRateSim;