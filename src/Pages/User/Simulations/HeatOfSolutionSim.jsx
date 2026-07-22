import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Target, CheckCircle2, Flame, Snowflake, ArrowUp, ArrowDown } from 'lucide-react';

export default function HeatOfSolutionSim({ onTelemetry }) {
  // Application State
  const [activePack, setActivePack] = useState('hot'); // 'hot' or 'cold'
  const [animStatus, setAnimStatus] = useState('idle'); // 'idle' | 'running' | 'completed'
  
  // Track which packs have been completed by the user
  const [completedPacks, setCompletedPacks] = useState({ hot: false, cold: false });
  const allPacksCompleted = completedPacks.hot && completedPacks.cold;

  // Animation values
  const [currentTemp, setCurrentTemp] = useState(20.0);
  const [progress, setProgress] = useState(0); // 0 to 1

  // Telemetry Emission
  useEffect(() => {
    if (allPacksCompleted) {
      if (typeof onTelemetry === 'function') {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'chem_heat_of_solution_pack',
          message: "Student observed both exothermic and endothermic dissolution processes."
        });
      }
    }
  }, [allPacksCompleted, onTelemetry]);

  // Animation Loop Effect
  useEffect(() => {
    if (animStatus !== 'running') return;

    const duration = 3000;
    const startTime = performance.now();
    let timeoutId;

    const animate = (time) => {
      const p = Math.min((time - startTime) / duration, 1);
      setProgress(p);

      if (activePack === 'hot') {
        setCurrentTemp(20.0 + p * 16.0); // 20 to 36
      } else {
        setCurrentTemp(20.0 - p * 12.0); // 20 to 8
      }

      if (p < 1) {
        timeoutId = requestAnimationFrame(animate);
      } else {
        setAnimStatus('completed');
        setCompletedPacks(prev => ({ ...prev, [activePack]: true }));
      }
    };
    
    timeoutId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(timeoutId);
  }, [animStatus, activePack]);

  const handleRun = () => {
    setCurrentTemp(20.0);
    setProgress(0);
    setAnimStatus('running');
  };

  const handleReset = () => {
    setCurrentTemp(20.0);
    setProgress(0);
    setAnimStatus('idle');
  };

  const handlePackSelect = (pack) => {
    if (animStatus === 'running') return;
    setActivePack(pack);
    handleReset();
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4 bg-slate-50 rounded-3xl font-sans">
      
      {/* 1. MISSION CARD */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Mission</h2>
          <p className="text-slate-600 mt-1">
            Dissolve two different salts. Observe what happens to the temperature. Can you determine which reaction absorbs heat and which releases heat?
          </p>
        </div>
      </div>

      {/* 2. SOLUTION SELECTION */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => handlePackSelect('hot')}
            disabled={animStatus === 'running'}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
              activePack === 'hot' 
                ? 'bg-orange-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" /> Hot Pack (Exothermic)
          </button>
          <button
            onClick={() => handlePackSelect('cold')}
            disabled={animStatus === 'running'}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
              activePack === 'cold' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Snowflake className="w-4 h-4" /> Cold Pack (Endothermic)
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={animStatus === 'running'}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            <Play className="w-4 h-4" /> Dissolve Salt
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
        
        {/* Left Panel: Animated Beaker */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center min-h-[300px] relative">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">
            Dissolution Process
          </h3>
          
          <div className="flex-1 w-full relative flex justify-center items-center">
            {/* Beaker SVG */}
            <svg viewBox="0 0 200 200" className="w-full max-w-[200px] h-full overflow-visible">
              
              {/* Energy Arrows (Cold Pack: In, Hot Pack: Out) */}
              {progress > 0.2 && activePack === 'hot' && (
                <g opacity={Math.sin(progress * Math.PI)}>
                  <path d="M40 70 Q20 50 10 30" stroke="#F97316" strokeWidth="3" fill="none" markerEnd="url(#arrowHot)" />
                  <path d="M160 70 Q180 50 190 30" stroke="#F97316" strokeWidth="3" fill="none" markerEnd="url(#arrowHot)" />
                  <path d="M20 120 Q0 120 -20 120" stroke="#F97316" strokeWidth="3" fill="none" markerEnd="url(#arrowHot)" />
                  <path d="M180 120 Q200 120 220 120" stroke="#F97316" strokeWidth="3" fill="none" markerEnd="url(#arrowHot)" />
                </g>
              )}
              {progress > 0.2 && activePack === 'cold' && (
                <g opacity={Math.sin(progress * Math.PI)}>
                  <path d="M10 30 Q20 50 40 70" stroke="#3B82F6" strokeWidth="3" fill="none" markerEnd="url(#arrowCold)" />
                  <path d="M190 30 Q180 50 160 70" stroke="#3B82F6" strokeWidth="3" fill="none" markerEnd="url(#arrowCold)" />
                  <path d="M-20 120 Q0 120 20 120" stroke="#3B82F6" strokeWidth="3" fill="none" markerEnd="url(#arrowCold)" />
                  <path d="M220 120 Q200 120 180 120" stroke="#3B82F6" strokeWidth="3" fill="none" markerEnd="url(#arrowCold)" />
                </g>
              )}

              {/* Arrow Markers */}
              <defs>
                <marker id="arrowHot" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse">
                  <path d="M 0 0 L 6 3 L 0 6 z" fill="#F97316" />
                </marker>
                <marker id="arrowCold" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse">
                  <path d="M 0 0 L 6 3 L 0 6 z" fill="#3B82F6" />
                </marker>
              </defs>

              {/* Water */}
              <rect x="50" y="60" width="100" height="110" rx="4" fill="rgba(14, 165, 233, 0.1)" />
              <line x1="50" y1="60" x2="150" y2="60" stroke="#0EA5E9" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
              
              {/* Beaker Outline */}
              <path d="M48 20 L48 172 A 8 8 0 0 0 56 180 L144 180 A 8 8 0 0 0 152 172 L152 20" fill="none" stroke="#64748B" strokeWidth="4" />
              <line x1="40" y1="20" x2="160" y2="20" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />

              {/* Crystals / Ions */}
              <g>
                {/* Center Crystal Pile (fades out as progress increases) */}
                <g opacity={Math.max(1 - progress * 2, 0)}>
                  <rect x="90" y="160" width="20" height="16" fill="#94A3B8" rx="2" />
                  <rect x="85" y="168" width="12" height="10" fill="#CBD5E1" rx="2" />
                  <rect x="105" y="165" width="14" height="12" fill="#64748B" rx="2" />
                  <rect x="95" y="152" width="10" height="10" fill="#CBD5E1" rx="2" />
                </g>

                {/* Separated Ions (appear and spread out) */}
                {progress > 0.1 && Array.from({length: 6}).map((_, i) => {
                  const ionType = i % 2 === 0 ? 'cation' : 'anion';
                  const endX = 65 + (i * 15);
                  const endY = 80 + ((i % 3) * 25);
                  
                  // Interpolate position from center bottom to final spread
                  const currX = 100 + (endX - 100) * Math.min((progress - 0.1) * 1.5, 1);
                  const currY = 165 + (endY - 165) * Math.min((progress - 0.1) * 1.5, 1);
                  
                  return (
                    <g key={i} transform={`translate(${currX}, ${currY})`} opacity={Math.min((progress - 0.1) * 2, 1)}>
                      <circle 
                        r="6" 
                        fill={ionType === 'cation' ? '#A855F7' : '#22C55E'} 
                      />
                      <text x="0" y="2" fontSize="5" fill="white" textAnchor="middle" fontWeight="bold">
                        {ionType === 'cation' ? '+' : '-'}
                      </text>
                      
                      {/* Hydration Shell (Water Molecules surrounding ion) */}
                      {progress > 0.5 && Array.from({length: 4}).map((_, j) => {
                        const angle = (j * 90) * (Math.PI / 180);
                        const r = 12; // Distance of water molecule from ion
                        const wx = r * Math.cos(angle);
                        const wy = r * Math.sin(angle);
                        // Rotate V-shape so oxygen (point of V) points to cation, and hydrogen points to anion
                        const rot = (j * 90) + (ionType === 'cation' ? 180 : 0);
                        
                        return (
                          <g key={j} transform={`translate(${wx}, ${wy}) rotate(${rot})`} opacity={Math.min((progress - 0.5) * 2, 1)}>
                            <path d="M-3,-3 L0,0 L3,-3" stroke="#0284C7" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>

        {/* Right Panel: Thermometer & Results */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-[300px]">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">
            Temperature & Energy
          </h3>
          
          <div className="flex-1 flex flex-col justify-center items-center gap-4 w-full">
            
            <div className="flex items-center justify-center gap-6 w-full">
              {/* SVG Thermometer */}
              <svg viewBox="0 0 60 180" className="w-12 h-36 overflow-visible">
                {/* Glass Tube */}
                <rect x="20" y="10" width="20" height="140" rx="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
                <circle cx="30" cy="150" r="20" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
                <rect x="22" y="130" width="16" height="15" fill="#F1F5F9" />
                
                {/* Liquid Fill (Red if > 20, Blue if < 20) */}
                <circle cx="30" cy="150" r="14" fill={currentTemp > 20 ? "#EF4444" : currentTemp < 20 ? "#3B82F6" : "#94A3B8"} />
                <rect 
                  x="24" 
                  y={130 - ((currentTemp - 0) / 40) * 110} 
                  width="12" 
                  height={15 + ((currentTemp - 0) / 40) * 110} 
                  fill={currentTemp > 20 ? "#EF4444" : currentTemp < 20 ? "#3B82F6" : "#94A3B8"} 
                  rx="6"
                />
              </svg>

              <div className="flex flex-col gap-3">
                <div className="bg-slate-100 px-4 py-3 rounded-xl border border-slate-200 w-40 text-center">
                  <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Temperature</span>
                  <span className={`text-2xl font-mono font-bold ${currentTemp > 20 ? 'text-red-500' : currentTemp < 20 ? 'text-blue-500' : 'text-slate-700'}`}>
                    {currentTemp.toFixed(1)}°C
                  </span>
                </div>
              </div>
            </div>

            {/* Result Interpretation (Appears at end of animation) */}
            <div className="h-20 w-full flex items-center justify-center">
              {progress > 0.8 && (
                <div className={`p-3 rounded-xl border w-full text-center animate-fade-in ${activePack === 'hot' ? 'bg-orange-50 border-orange-200 text-orange-900' : 'bg-blue-50 border-blue-200 text-blue-900'}`}>
                  <p className="font-bold text-sm mb-1">
                    {activePack === 'hot' ? (
                      <span className="flex items-center justify-center gap-1"><ArrowUp className="w-4 h-4"/> Temperature Increased</span>
                    ) : (
                      <span className="flex items-center justify-center gap-1"><ArrowDown className="w-4 h-4"/> Temperature Decreased</span>
                    )}
                  </p>
                  <p className="text-xs font-semibold mb-1">
                    {activePack === 'hot' ? 'Heat Released (Exothermic)' : 'Heat Absorbed (Endothermic)'}
                  </p>
                  <p className="text-xs opacity-90 font-mono bg-white/50 py-0.5 rounded">
                    {activePack === 'hot' ? 'Hydration Energy > Lattice Energy' : 'Lattice Energy > Hydration Energy'}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* 4. OBSERVATION CARD */}
      <div className={`p-5 rounded-2xl border transition-all ${
        allPacksCompleted 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
          : 'bg-white border-slate-200 text-slate-600'
      }`}>
        {allPacksCompleted ? (
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h3 className="font-bold uppercase tracking-wider text-sm mb-2">Observation Verified</h3>
              <p className="text-sm font-medium mb-2">
                Both salts dissolved successfully. The difference is where the energy flowed.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div className="bg-white/60 p-3 rounded-lg border border-emerald-100">
                  <span className="text-orange-600 font-bold block text-xs uppercase mb-1">🔥 Hot Pack</span>
                  <span className="text-sm text-slate-700">More energy was <strong>released</strong> during hydration than was absorbed to separate the lattice.</span>
                </div>
                <div className="bg-white/60 p-3 rounded-lg border border-emerald-100">
                  <span className="text-blue-600 font-bold block text-xs uppercase mb-1">❄ Cold Pack</span>
                  <span className="text-sm text-slate-700">More energy was <strong>absorbed</strong> to separate the lattice than was released during hydration.</span>
                </div>
              </div>
              <p className="text-sm text-emerald-800 mt-3 font-semibold">
                This explains why some dissolving processes warm the surroundings while others cool them.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center font-medium text-sm">
            Run both dissolutions to compare them.
          </p>
        )}
      </div>

    </div>
  );
}
