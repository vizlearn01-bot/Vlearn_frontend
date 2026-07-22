import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, CheckCircle2, XCircle, Info, Activity, ShieldAlert, CheckSquare, Factory, FlaskConical, TrendingUp, TrendingDown, ArrowRight, BookOpen } from 'lucide-react';

const SIMULATION_MODEL = {
  optimumTemperatureMin: 400,
  optimumTemperatureMax: 500,
  optimumPressureMin: 200,
  minTemperature: 200,
  maxTemperature: 800,
  minPressure: 50,
  maxPressure: 400,
};

export default function HaberProcessSim({ config, onTelemetry }) {
  const [temperature, setTemperature] = useState(450);
  const [pressure, setPressure] = useState(200);

  const [missions, setMissions] = useState({
    mission1: false, // High Yield, Very Slow
    mission2: false, // Fast, Lower Yield
    mission3: false, // Compromise
  });

  const [mastered, setMastered] = useState(false);

  // Derived state for physics
  const speedRatio = (temperature - SIMULATION_MODEL.minTemperature) / (SIMULATION_MODEL.maxTemperature - SIMULATION_MODEL.minTemperature);
  
  // Yield is favored by High Pressure and Low Temperature
  const yieldTempComponent = 1 - speedRatio;
  const yieldPressComponent = (pressure - SIMULATION_MODEL.minPressure) / (SIMULATION_MODEL.maxPressure - SIMULATION_MODEL.minPressure);
  
  // Combine factors, give a bit more weight to temperature for dramatic effect
  const yieldRatio = (yieldTempComponent * 0.6) + (yieldPressComponent * 0.4);

  // Qualitative Values
  const getQualitative = (ratio) => {
    if (ratio < 0.2) return 'Very Low';
    if (ratio < 0.4) return 'Low';
    if (ratio < 0.6) return 'Moderate';
    if (ratio < 0.8) return 'High';
    return 'Very High';
  };

  const getSpeedColor = (ratio) => {
    if (ratio < 0.3) return 'bg-blue-400';
    if (ratio < 0.7) return 'bg-amber-400';
    return 'bg-red-500';
  };

  const getYieldColor = (ratio) => {
    if (ratio < 0.3) return 'bg-red-400';
    if (ratio < 0.7) return 'bg-amber-400';
    return 'bg-emerald-500';
  };

  const isOptimum = 
    temperature >= SIMULATION_MODEL.optimumTemperatureMin && 
    temperature <= SIMULATION_MODEL.optimumTemperatureMax && 
    pressure >= SIMULATION_MODEL.optimumPressureMin;

  const getFactoryStatus = () => {
    if (isOptimum) return { text: 'Industrial Optimum', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' };
    if (speedRatio < 0.3) return { text: 'Too Slow', color: 'bg-red-100 text-red-800 border-red-300', dot: 'bg-red-500' };
    if (yieldRatio < 0.3) return { text: 'Poor Yield', color: 'bg-orange-100 text-orange-800 border-orange-300', dot: 'bg-orange-500' };
    return { text: 'Acceptable', color: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500' };
  };

  const factoryStatus = getFactoryStatus();

  // Evaluate Missions
  useEffect(() => {
    let updated = { ...missions };
    let changed = false;

    // Mission 1: High Yield, Slow Reaction
    if (yieldRatio >= 0.7 && speedRatio <= 0.3 && !updated.mission1) {
      updated.mission1 = true;
      changed = true;
    }
    
    // Mission 2: Fast Reaction, Lower Yield
    if (speedRatio >= 0.7 && yieldRatio <= 0.4 && !updated.mission2) {
      updated.mission2 = true;
      changed = true;
    }

    // Mission 3: Compromise
    if (isOptimum && !updated.mission3) {
      updated.mission3 = true;
      changed = true;
    }

    if (changed) {
      setMissions(updated);
    }
  }, [temperature, pressure, speedRatio, yieldRatio, isOptimum, missions]);

  // Evaluate Mastery
  useEffect(() => {
    if (missions.mission1 && missions.mission2 && missions.mission3 && !mastered) {
      setMastered(true);
      if (onTelemetry) {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          checkpoint: 'Haber Process Mastered',
          final_temperature: temperature,
          final_pressure: pressure
        });
      }
    }
  }, [missions, mastered, onTelemetry, temperature, pressure]);

  // Particles generator
  const particles = useMemo(() => {
    // Generate 30 particles
    return Array.from({ length: 30 }).map((_, i) => {
      return {
        id: i,
        baseX: Math.random() * 80 + 10,
        baseY: Math.random() * 80 + 10,
        delay: Math.random() * 2,
        isAmmonia: Math.random() < yieldRatio,
      };
    });
  }, [yieldRatio]);

  const handleReset = () => {
    setTemperature(450);
    setPressure(200);
  };

  return (
    <div className="bg-slate-50 rounded-3xl overflow-hidden shadow-sm border border-slate-200 p-6 font-sans">
      
      {/* Mission Banner */}
      <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-sm mb-6 flex items-start gap-4">
        <div className="bg-white/20 p-2 rounded-xl">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Mission</h2>
          <p className="text-blue-100 text-sm mt-1 max-w-3xl">
            Adjust the reactor conditions to complete the three missions and discover why industry chooses compromise conditions instead of maximizing a single variable.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls & Reactor */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <SlidersHorizontalIcon className="w-5 h-5 text-custom-orange" /> 
                Reactor Controls
              </h3>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="space-y-5">
              {/* Temperature Control */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-semibold text-slate-700">Temperature</label>
                  <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{temperature}°C</span>
                </div>
                <input
                  type="range"
                  min={SIMULATION_MODEL.minTemperature}
                  max={SIMULATION_MODEL.maxTemperature}
                  step={10}
                  value={temperature}
                  onChange={(e) => setTemperature(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-custom-orange"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
                  <span>{SIMULATION_MODEL.minTemperature}°C</span>
                  <span>{SIMULATION_MODEL.maxTemperature}°C</span>
                </div>
              </div>

              {/* Pressure Control */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-semibold text-slate-700">Pressure</label>
                  <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{pressure} atm</span>
                </div>
                <input
                  type="range"
                  min={SIMULATION_MODEL.minPressure}
                  max={SIMULATION_MODEL.maxPressure}
                  step={10}
                  value={pressure}
                  onChange={(e) => setPressure(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
                  <span>{SIMULATION_MODEL.minPressure} atm</span>
                  <span>{SIMULATION_MODEL.maxPressure} atm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tradeoff Visualization */}
          <div className="bg-slate-800 text-white p-5 rounded-2xl shadow-inner">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Live Trade-offs
            </h4>
            
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-xl p-3">
                <div className="text-sm font-semibold mb-2 text-orange-300">Temperature ↑</div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Reaction Speed</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><TrendingUp className="w-4 h-4"/></span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Ammonia Yield</span>
                  <span className="text-red-400 font-bold flex items-center gap-1"><TrendingDown className="w-4 h-4"/></span>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-3">
                <div className="text-sm font-semibold mb-2 text-blue-300">Pressure ↑</div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Reaction Speed</span>
                  <span className="text-slate-400 font-bold">—</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Ammonia Yield</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><TrendingUp className="w-4 h-4"/></span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Output & Visualization */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Speed Indicator */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Reaction Speed</h3>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-black text-slate-800">{getQualitative(speedRatio)}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ease-out ${getSpeedColor(speedRatio)}`} 
                  style={{ width: `${Math.max(5, speedRatio * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Yield Indicator */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Ammonia Yield</h3>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-black text-slate-800">{getQualitative(yieldRatio)}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ease-out ${getYieldColor(yieldRatio)}`} 
                  style={{ width: `${Math.max(5, yieldRatio * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Reactor & Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
            {/* Animation Area */}
            <div className="bg-slate-900 w-full md:w-1/2 p-6 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden">
              <h4 className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest z-10">Reactor Vessel</h4>
              
              {/* Dynamic volume based on pressure */}
              <div 
                className="relative border-2 border-slate-600 rounded-full transition-all duration-500 ease-in-out"
                style={{ 
                  width: `${100 - yieldPressComponent * 40}%`, 
                  height: `${100 - yieldPressComponent * 40}%`,
                  aspectRatio: '1/1',
                  maxWidth: '200px',
                  maxHeight: '200px'
                }}
              >
                {particles.map((p) => {
                  const animDuration = 0.5 + (1 - speedRatio) * 2.5; // Faster when temp high
                  return (
                    <div
                      key={p.id}
                      className={`absolute rounded-full shadow-lg ${p.isAmmonia ? 'bg-emerald-400 w-4 h-4' : 'bg-blue-300 w-2 h-2'}`}
                      style={{
                        left: `${p.baseX}%`,
                        top: `${p.baseY}%`,
                        animation: `float ${animDuration}s infinite alternate ease-in-out`,
                        animationDelay: `${p.delay}s`,
                      }}
                    />
                  )
                })}
              </div>

              {/* Define keyframes locally just for this animation */}
              <style>{`
                @keyframes float {
                  0% { transform: translate(0, 0); }
                  100% { transform: translate(${speedRatio * 20}px, ${speedRatio * -20}px); }
                }
              `}</style>
            </div>

            {/* Status Panel */}
            <div className="w-full md:w-1/2 p-6 bg-slate-50 flex flex-col justify-center">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Factory Status</h4>
              <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 font-bold text-lg ${factoryStatus.color}`}>
                <div className={`w-3 h-3 rounded-full ${factoryStatus.dot} animate-pulse`}></div>
                {factoryStatus.text}
              </div>

              {isOptimum && (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-900">
                  <h5 className="font-bold flex items-center gap-1.5 mb-1"><CheckCircle2 className="w-4 h-4" /> Industrial Recommendation</h5>
                  <p className="opacity-90 leading-tight">✔ Fast enough reaction<br/>✔ Good ammonia yield<br/>✔ Economically practical</p>
                </div>
              )}
            </div>
          </div>

          {/* Missions */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-custom-blue" />
              Exploration Missions
            </h3>
            
            <div className="space-y-2">
              <MissionRow 
                isComplete={missions.mission1} 
                title="Mission 1: Maximize Yield" 
                desc="Find settings with High Yield but Very Slow Reaction"
              />
              <MissionRow 
                isComplete={missions.mission2} 
                title="Mission 2: Maximize Speed" 
                desc="Find settings with Fast Reaction but Lower Yield"
              />
              <MissionRow 
                isComplete={missions.mission3} 
                title="Mission 3: The Haber Compromise" 
                desc="Find the best industrial compromise"
              />
            </div>

            {mastered && (
              <div className="mt-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-extrabold text-emerald-800 text-lg flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Haber Process Mastered
                </h4>
                <p className="text-emerald-900 text-sm leading-relaxed">
                  <strong>Key Discovery:</strong> Increasing temperature speeds up the reaction but reduces ammonia yield. Increasing pressure increases ammonia yield. Industrial plants choose compromise conditions (typically ~450°C and 200 atm) to balance production speed and efficiency.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function MissionRow({ isComplete, title, desc }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${isComplete ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
      {isComplete ? (
        <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
      ) : (
        <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex-shrink-0"></div>
      )}
      <div>
        <div className={`font-bold text-sm ${isComplete ? 'text-emerald-900' : 'text-slate-700'}`}>{title}</div>
        <div className={`text-xs ${isComplete ? 'text-emerald-700' : 'text-slate-500'}`}>{desc}</div>
      </div>
    </div>
  );
}

// Custom icon
function SlidersHorizontalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="21" x2="14" y1="4" y2="4" />
      <line x1="10" x2="3" y1="4" y2="4" />
      <line x1="21" x2="12" y1="12" y2="12" />
      <line x1="8" x2="3" y1="12" y2="12" />
      <line x1="21" x2="16" y1="20" y2="20" />
      <line x1="12" x2="3" y1="20" y2="20" />
      <line x1="14" x2="14" y1="2" y2="6" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="16" x2="16" y1="18" y2="22" />
    </svg>
  );
}
