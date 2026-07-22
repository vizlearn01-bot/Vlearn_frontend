import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Target, CheckCircle2, TrendingDown, Thermometer } from 'lucide-react';

export default function HessLawSim({ onTelemetry }) {
  // Application State
  const [activeRoute, setActiveRoute] = useState(1); // 1 or 2
  const [animStatus, setAnimStatus] = useState('idle'); // 'idle' | 'running' | 'completed'
  
  // Track which routes have been completed by the user
  const [completedRoutes, setCompletedRoutes] = useState({ 1: false, 2: false });
  const allRoutesCompleted = completedRoutes[1] && completedRoutes[2];

  // Animation values
  const [currentEnergy, setCurrentEnergy] = useState(0);
  const [currentTemp, setCurrentTemp] = useState(20.0);
  const [stepMarkers, setStepMarkers] = useState([]);

  // Telemetry Emission
  useEffect(() => {
    if (allRoutesCompleted) {
      if (typeof onTelemetry === 'function') {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'chem_hess_law_pathways',
          message: "Student observed that both reaction pathways yield identical total enthalpy change."
        });
      }
    }
  }, [allRoutesCompleted, onTelemetry]);

  // Animation Loop Effect
  useEffect(() => {
    if (animStatus !== 'running') return;

    let timeoutIds = [];

    if (activeRoute === 1) {
      // Route 1: Single smooth transition
      const duration = 2000;
      const startTime = performance.now();
      
      const animate = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        setCurrentEnergy(progress * -100);
        setCurrentTemp(20.0 + progress * 24.0);
        
        if (progress < 1) {
          timeoutIds.push(requestAnimationFrame(animate));
        } else {
          setStepMarkers(['ΔH = -100 kJ/mol']);
          setAnimStatus('completed');
          setCompletedRoutes(prev => ({ ...prev, 1: true }));
        }
      };
      timeoutIds.push(requestAnimationFrame(animate));
    } else {
      // Route 2: Two-step transition
      const step1Duration = 1000;
      const pauseDuration = 800;
      const step2Duration = 1000;
      const startTime = performance.now();
      
      const animate = (time) => {
        const elapsed = time - startTime;
        
        if (elapsed <= step1Duration) {
          // Step 1: 0 to -43
          const progress = elapsed / step1Duration;
          setCurrentEnergy(progress * -43);
          setCurrentTemp(20.0 + progress * (24.0 * (43/100)));
          timeoutIds.push(requestAnimationFrame(animate));
        } else if (elapsed > step1Duration && elapsed <= step1Duration + pauseDuration) {
          // Pause
          if (stepMarkers.length === 0) setStepMarkers(['ΔH₁ = -43 kJ/mol']);
          timeoutIds.push(requestAnimationFrame(animate));
        } else if (elapsed > step1Duration + pauseDuration && elapsed <= step1Duration + pauseDuration + step2Duration) {
          // Step 2: -43 to -100
          const progress = (elapsed - step1Duration - pauseDuration) / step2Duration;
          setCurrentEnergy(-43 - progress * 57);
          setCurrentTemp(20.0 + (24.0 * (43/100)) + progress * (24.0 * (57/100)));
          
          if (stepMarkers.length === 1) setStepMarkers(['ΔH₁ = -43 kJ/mol', 'ΔH₂ = -57 kJ/mol']);
          timeoutIds.push(requestAnimationFrame(animate));
        } else {
          // Done
          setCurrentEnergy(-100);
          setCurrentTemp(44.0);
          setStepMarkers(['ΔH₁ = -43 kJ/mol', 'ΔH₂ = -57 kJ/mol', 'Total = -100 kJ/mol']);
          setAnimStatus('completed');
          setCompletedRoutes(prev => ({ ...prev, 2: true }));
        }
      };
      timeoutIds.push(requestAnimationFrame(animate));
    }

    return () => timeoutIds.forEach(cancelAnimationFrame);
  }, [animStatus, activeRoute]); // stepMarkers dependency omitted intentionally to avoid resetting animation

  const handleRun = () => {
    setCurrentEnergy(0);
    setCurrentTemp(20.0);
    setStepMarkers([]);
    setAnimStatus('running');
  };

  const handleReset = () => {
    setCurrentEnergy(0);
    setCurrentTemp(20.0);
    setStepMarkers([]);
    setAnimStatus('idle');
  };

  const handleRouteSelect = (route) => {
    if (animStatus === 'running') return;
    setActiveRoute(route);
    handleReset();
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4 bg-slate-50 rounded-3xl font-sans">
      
      {/* 1. MISSION CARD */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Mission</h2>
          <p className="text-slate-600 mt-1">
            Run both reaction pathways. Observe the energy changes. Do both pathways end with the same total energy change?
          </p>
        </div>
      </div>

      {/* 2. ROUTE SELECTION */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleRouteSelect(1)}
            disabled={animStatus === 'running'}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
              activeRoute === 1 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Route 1: Direct Reaction
          </button>
          <button
            onClick={() => handleRouteSelect(2)}
            disabled={animStatus === 'running'}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
              activeRoute === 2 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Route 2: Two-Step Reaction
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={animStatus === 'running'}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            <Play className="w-4 h-4" /> Run Simulation
          </button>
          <button
            onClick={handleReset}
            disabled={animStatus === 'running'}
            className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* 3. VISUALIZATION AREA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Panel: Energy Diagram */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center min-h-[300px] relative">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-slate-400" />
            Energy Diagram
          </h3>
          
          <div className="flex-1 w-full relative flex justify-center items-center">
            {/* SVG Scale */}
            <svg viewBox="0 0 200 240" className="w-full max-w-[200px] h-full overflow-visible">
              {/* Y-Axis */}
              <line x1="20" y1="20" x2="20" y2="220" stroke="#CBD5E1" strokeWidth="2" />
              <text x="10" y="30" fontSize="10" fill="#94A3B8" transform="rotate(-90 10,30)">Energy</text>
              
              {/* Reactants Base Line */}
              <line x1="15" y1="40" x2="180" y2="40" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
              <text x="180" y="35" fontSize="12" fill="#64748B" fontWeight="bold" textAnchor="end">Reactants</text>
              
              {/* Products Base Line */}
              <line x1="15" y1="190" x2="180" y2="190" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
              <text x="180" y="205" fontSize="12" fill="#64748B" fontWeight="bold" textAnchor="end">Products</text>
              
              {/* Intermediate Line (Only for Route 2) */}
              {activeRoute === 2 && (
                <g>
                  <line x1="15" y1="104.5" x2="180" y2="104.5" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                  <text x="180" y="99.5" fontSize="10" fill="#94A3B8" textAnchor="end">Intermediate</text>
                </g>
              )}

              {/* Animated Energy Bar */}
              <rect 
                x="60" 
                y="40" 
                width="40" 
                height={Math.abs(currentEnergy) * 1.5} 
                fill={activeRoute === 1 ? "#3B82F6" : "#9333EA"} 
                rx="4"
                opacity="0.8"
              />
              
              {/* Markers */}
              {stepMarkers.map((marker, idx) => (
                <text 
                  key={idx} 
                  x="110" 
                  y={idx === 0 && activeRoute === 2 ? 72 : idx === 1 ? 147 : 115} 
                  fontSize="12" 
                  fill={idx === 2 ? "#1E293B" : "#475569"} 
                  fontWeight="bold"
                >
                  {marker}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Right Panel: Thermometer */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-[300px]">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-red-400" />
            Temperature
          </h3>
          
          <div className="flex-1 flex flex-col justify-center items-center gap-6">
            {/* SVG Thermometer */}
            <svg viewBox="0 0 100 240" className="w-16 h-40 overflow-visible">
              {/* Glass Tube */}
              <rect x="40" y="10" width="20" height="180" rx="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
              <circle cx="50" cy="200" r="24" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
              {/* Hide internal stroke overlap */}
              <rect x="42" y="170" width="16" height="15" fill="#F1F5F9" />
              
              {/* Red Liquid Fill */}
              <circle cx="50" cy="200" r="18" fill="#EF4444" />
              <rect 
                x="44" 
                y={180 - ((currentTemp - 20) / 24) * 160} 
                width="12" 
                height={15 + ((currentTemp - 20) / 24) * 160} 
                fill="#EF4444" 
                rx="6"
              />
              
              {/* Scale Marks */}
              <line x1="30" y1="180" x2="36" y2="180" stroke="#94A3B8" strokeWidth="2" />
              <text x="12" y="184" fontSize="12" fill="#64748B">20</text>
              
              <line x1="30" y1="20" x2="36" y2="20" stroke="#94A3B8" strokeWidth="2" />
              <text x="12" y="24" fontSize="12" fill="#64748B">44</text>
            </svg>
            
            <div className="text-center space-y-2">
              <div className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Final Temperature</span>
                <span className="text-xl font-mono font-bold text-red-500">{currentTemp.toFixed(1)}°C</span>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                <span className="text-xs text-blue-600 uppercase font-bold block mb-1">Total Enthalpy Change</span>
                <span className="text-xl font-mono font-bold text-blue-700">{currentEnergy.toFixed(0)} kJ/mol</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. CONCLUSION CARD */}
      <div className={`p-5 rounded-2xl border transition-all ${
        allRoutesCompleted 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
          : 'bg-white border-slate-200 text-slate-600'
      }`}>
        {allRoutesCompleted ? (
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Observation Verified</h3>
              <p className="text-sm font-medium">
                Although the reactions followed different pathways, they released exactly the same total energy. This demonstrates Hess's Law: <strong>ΔH₁ = ΔH₂ + ΔH₃</strong>
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center font-medium text-sm">
            Run both pathways to compare them.
          </p>
        )}
      </div>

    </div>
  );
}
