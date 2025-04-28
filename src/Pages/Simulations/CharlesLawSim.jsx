import React, { useState, useEffect, useCallback } from 'react';
import { Thermometer, ArrowRight } from 'lucide-react';

const CharlesLawSim = () => {
  const [temperature, setTemperature] = useState(273);
  const [particles, setParticles] = useState([]);
  const [containerWidth, setContainerWidth] = useState(200);

  // Calculate volume based on temperature
  const calculateVolume = useCallback(() => {
    return (temperature / 273) * 200;
  }, [temperature]);

  // Initialize particles
  useEffect(() => {
    const initialParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * containerWidth,
      y: Math.random() * 200,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
    }));
    setParticles(initialParticles);
  }, [containerWidth]);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prevParticles) => {
        const speed = Math.sqrt(temperature / 273);

        return prevParticles.map((particle) => {
          let newX = particle.x + particle.dx * speed;
          let newY = particle.y + particle.dy * speed;
          let newDx = particle.dx;
          let newDy = particle.dy;

          if (newX <= 0 || newX >= containerWidth) {
            newDx = -newDx;
            newX = newX <= 0 ? 0 : containerWidth;
          }
          if (newY <= 0 || newY >= 200) {
            newDy = -newDy;
            newY = newY <= 0 ? 0 : 200;
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            dx: newDx,
            dy: newDy,
          };
        });
      });
    }, 16);

    return () => clearInterval(interval);
  }, [temperature, containerWidth]);

  // Update container width based on temperature
  useEffect(() => {
    setContainerWidth(calculateVolume());
  }, [temperature, calculateVolume]);

  return (
    <div className="min-fit bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Charles's Law Demonstration</h1>
        <p className="text-gray-600 text-center mb-8">
          V ∝ T (Volume is proportional to Temperature at constant pressure)
        </p>

        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="flex items-center">
            <Thermometer className="w-6 h-6 text-custom-orange mr-2" />
            <span className="text-lg font-semibold">{temperature}K</span>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400" />
          <div className="flex items-center">
            <span className="text-lg font-semibold">Volume: {containerWidth.toFixed(0)}px</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div
            className="border-2 border-custom-blue rounded-lg h-[200px] relative transition-all duration-300"
            style={{ width: `${containerWidth}px` }}
          >
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 bg-custom-blue rounded-full"
                style={{
                  left: `${particle.x}px`,
                  top: `${particle.y}px`,
                  transition: 'transform 0.1s linear',
                }}
              />
            ))}
          </div>

          <div className="w-full max-w-md">
            <input
              type="range"
              min="173"
              max="373"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>173K</span>
              <span>273K</span>
              <span>373K</span>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">How it works:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Adjust the temperature using the slider</li>
            <li>Watch how the volume (container width) changes proportionally</li>
            <li>Notice how particle speed increases with temperature</li>
            <li>The relationship follows V₁/T₁ = V₂/T₂</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CharlesLawSim;