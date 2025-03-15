import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Download, ExternalLink, Thermometer, ArrowRight } from 'lucide-react';

const resources = [
  {
    id: 1,
    title: "Mathematics Formula Sheet",
    type: "PDF",
    size: "2.4 MB",
    category: "Mathematics",
    downloads: 1234,
  },
  {
    id: 2,
    title: "Physics Lab Manual",
    type: "PDF",
    size: "5.1 MB",
    category: "Physics",
    downloads: 987,
  },
  {
    id: 3,
    title: "Periodic Table Interactive",
    type: "Web Resource",
    category: "Chemistry",
    external: true,
  },
  {
    id: 4,
    title: "STEM Career Guide",
    type: "PDF",
    size: "1.8 MB",
    category: "Career",
    downloads: 2156,
  },
];

// Define Particle as a JavaScript object type
const Particle = {
  id: Number,
  x: Number,
  y: Number,
  dx: Number,
  dy: Number,
};

export default function Resources() {
  const [temperature, setTemperature] = useState(273); // Kelvin
  const [particles, setParticles] = useState([]);
  const [containerWidth, setContainerWidth] = useState(200);

  // Calculate volume based on temperature (Charles's Law: V ∝ T)
  const calculateVolume = useCallback(() => {
    return (temperature / 273) * 200; // Base width at 273K is 200px
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
        const speed = Math.sqrt(temperature / 273); // Particle speed increases with temperature

        return prevParticles.map((particle) => {
          let newX = particle.x + particle.dx * speed;
          let newY = particle.y + particle.dy * speed;
          let newDx = particle.dx;
          let newDy = particle.dy;

          // Bounce off walls
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
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [temperature, containerWidth]);

  // Update container width based on temperature
  useEffect(() => {
    setContainerWidth(calculateVolume());
  }, [temperature, calculateVolume]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
        <div className="flex space-x-4">
          <input
            type="search"
            placeholder="Search resources..."
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <select className="bg-white border border-gray-300 rounded-md px-4 py-2">
            <option>All Categories</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Career</option>
          </select>
        </div>
      </div>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center mb-6">Charles's Law Demonstration</h1>
          <p className="text-gray-600 text-center mb-8">
            V ∝ T (Volume is proportional to Temperature at constant pressure)
          </p>

          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center">
              <Thermometer className="w-6 h-6 text-red-500 mr-2" />
              <span className="text-lg font-semibold">{temperature}K</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
            <div className="flex items-center">
              <span className="text-lg font-semibold">Volume: {containerWidth.toFixed(0)}px</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div
              className="border-2 border-blue-500 rounded-lg h-[200px] relative transition-all duration-300"
              style={{ width: `${containerWidth}px` }}
            >
              {particles.map((particle) => (
                <div
                  key={particle.id}
                  className="absolute w-2 h-2 bg-blue-500 rounded-full"
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {resources.map((resource) => (
            <div key={resource.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{resource.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500">{resource.category}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{resource.type}</span>
                      {resource.size && (
                        <>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-gray-500">{resource.size}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {resource.downloads && (
                    <div className="text-sm text-gray-500">
                      {resource.downloads.toLocaleString()} downloads
                    </div>
                  )}
                  <button className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-orange-500">
                    {resource.external ? (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Resource
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}