import React, { useState, useEffect } from 'react';
import { Battery, Gauge, Clock, RefreshCw } from 'lucide-react';

const ElectrolysisSim = () => {
  // Simulation parameters
  const [voltage, setVoltage] = useState(4); // V
  const [time, setTime] = useState(0); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [anodeMass, setAnodeMass] = useState(10.00); // g
  const [cathodeMass, setCathodeMass] = useState(10.00); // g
  const [bubbles, setBubbles] = useState(0);
  const [reactions, setReactions] = useState({
    anode: false,
    cathode: false,
    oxygen: false
  });

  // Constants
  const molarMassCu = 63.55; // g/mol
  const faradayConstant = 96500; // C/mol
  const current = voltage / 2; // Simplified: I = V/R (assuming R=2Ω)

  // Calculate mass change based on Faraday's laws
  const calculateMassChange = (time) => {
    const charge = current * time; // Q = I × t
    const molesOfElectrons = charge / faradayConstant;
    const massChange = molesOfElectrons * molarMassCu;
    return massChange;
  };

  // Start/stop the electrolysis
  const toggleElectrolysis = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
      setTime(0);
    }
  };

  // Reset the simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setTime(0);
    setAnodeMass(10.00);
    setCathodeMass(10.00);
    setBubbles(0);
    setReactions({
      anode: false,
      cathode: false,
      oxygen: false
    });
  };

  // Run the electrolysis process
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 0.1;
          const massChange = calculateMassChange(newTime);

          // Update masses
          setAnodeMass(10.00 - massChange);
          setCathodeMass(10.00 + massChange);

          // Generate bubbles after some time
          if (newTime > 5 && Math.random() < 0.1) {
            setBubbles(prev => Math.min(prev + 1, 20));
          }

          // Show reactions after certain thresholds
          setReactions({
            anode: massChange > 0.01,
            cathode: massChange > 0.01,
            oxygen: newTime > 5
          });

          return newTime;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRunning, voltage]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Electrolysis of Copper(II) Sulfate Solution
      </h2>
      <p className="text-center mb-6 text-gray-600">
        CuSO₄(aq) electrolysis using copper electrodes
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Controls panel */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Battery className="w-5 h-5" /> Power Supply
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voltage: {voltage} V
                </label>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="0.5"
                  value={voltage}
                  onChange={(e) => setVoltage(Number(e.target.value))}
                  className="w-full"
                  disabled={isRunning}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>2V</span>
                  <span>12V</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-600">
                  <Gauge className="inline mr-1 w-4 h-4" />
                  <strong>Current:</strong> {current.toFixed(2)} A
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Experiment Controls</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={toggleElectrolysis}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isRunning
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isRunning ? 'Stop' : 'Start'} Electrolysis
              </button>

              <button
                onClick={resetSimulation}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                <RefreshCw className="inline mr-1 w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Measurements</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <strong>Time elapsed:</strong> {time.toFixed(1)}s
              </p>
              <p>
                <strong>Anode mass:</strong> {anodeMass.toFixed(2)}g
              </p>
              <p>
                <strong>Cathode mass:</strong> {cathodeMass.toFixed(2)}g
              </p>
              <p>
                <strong>Mass difference:</strong> {(cathodeMass - anodeMass).toFixed(2)}g
              </p>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full h-64 mb-6">
            {/* Electrolysis cell */}
            <div className="absolute inset-0 flex justify-center">
              {/* Solution */}
              <div className="w-3/4 h-full bg-blue-50 border-2 border-blue-200 rounded-lg relative overflow-hidden">
                {/* Bubbles */}
                {Array.from({ length: bubbles }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-white rounded-full opacity-70"
                    style={{
                      width: `${Math.random() * 6 + 4}px`,
                      height: `${Math.random() * 6 + 4}px`,
                      left: `${Math.random() * 30 + 35}%`,
                      bottom: `${Math.random() * 20}%`,
                      animation: `floatUp ${Math.random() * 3 + 2}s linear infinite`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}

                {/* Electrodes */}
                <div className="absolute left-1/4 top-0 h-full w-2 bg-amber-800 transform -translate-x-1/2">
                  {reactions.anode && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse">
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                    </div>
                  )}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold">
                    Anode (+)
                  </div>
                </div>
                <div className="absolute right-1/4 top-0 h-full w-2 bg-amber-800 transform translate-x-1/2">
                  {reactions.cathode && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-amber-600 animate-pulse" />
                  )}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold">
                    Cathode (-)
                  </div>
                </div>

                {/* Reactions */}
                {reactions.anode && (
                  <div className="absolute left-1/4 bottom-4 transform -translate-x-1/2 text-xs bg-white px-1 rounded">
                    Cu → Cu²⁺ + 2e⁻
                  </div>
                )}
                {reactions.cathode && (
                  <div className="absolute right-1/4 bottom-4 transform translate-x-1/2 text-xs bg-white px-1 rounded">
                    Cu²⁺ + 2e⁻ → Cu
                  </div>
                )}
                {reactions.oxygen && (
                  <div className="absolute left-1/4 top-4 transform -translate-x-1/2 text-xs bg-white px-1 rounded">
                    2H₂O → O₂ + 4H⁺ + 4e⁻
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Scientific Explanation</h4>
            <p className="text-sm text-gray-700">
              At the <strong>anode</strong>: Copper atoms lose electrons (oxidation)<br />
              At the <strong>cathode</strong>: Copper ions gain electrons (reduction)<br />
              Higher voltage increases current, accelerating both reactions.
            </p>
          </div>
        </div>
      </div>

      {/* Bubble animation CSS */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ElectrolysisSim;