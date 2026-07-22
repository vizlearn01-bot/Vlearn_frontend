import React, { useState, useEffect, useRef } from 'react';
import { Target, CheckCircle2, RotateCcw, HelpCircle, ArrowRight, ArrowLeft, Zap, ShieldAlert, Award } from 'lucide-react';

const ELECTRODE_DATA = {
  silver: { id: 'silver', name: "Silver", symbol: "Ag", e0: 0.80, ion: "Ag⁺" },
  copper: { id: 'copper', name: "Copper", symbol: "Cu", e0: 0.34, ion: "Cu²⁺" },
  lead: { id: 'lead', name: "Lead", symbol: "Pb", e0: -0.13, ion: "Pb²⁺" },
  iron: { id: 'iron', name: "Iron", symbol: "Fe", e0: -0.44, ion: "Fe²⁺" },
  zinc: { id: 'zinc', name: "Zinc", symbol: "Zn", e0: -0.76, ion: "Zn²⁺" },
  magnesium: { id: 'magnesium', name: "Magnesium", symbol: "Mg", e0: -2.37, ion: "Mg²⁺" },
};

const SHE = { id: 'hydrogen', name: "Hydrogen", symbol: "H₂", e0: 0.00, ion: "H⁺" };

const PHASES = {
  IDLE: 'idle',
  PREDICTING: 'predicting',
  ANIMATING: 'animating',
  RESULT: 'result'
};

const DIRECTIONS = {
  H2_TO_METAL: 'H2_TO_METAL',
  METAL_TO_H2: 'METAL_TO_H2'
};

export default function ElectrodePotentialSim({ config = {}, onTelemetry }) {
  const [selectedMetal, setSelectedMetal] = useState(null); // id
  const [phase, setPhase] = useState(PHASES.IDLE);
  
  // Learning Checkpoints
  const [exploredMetals, setExploredMetals] = useState([]);
  const [checkpoints, setCheckpoints] = useState({
    positive: false,
    negative: false,
    flow_h2_to_metal: false,
    flow_metal_to_h2: false,
    predicted_correctly: false
  });
  
  const allMastered = checkpoints.positive && 
                      checkpoints.negative && 
                      checkpoints.flow_h2_to_metal && 
                      checkpoints.flow_metal_to_h2 && 
                      checkpoints.predicted_correctly;

  // Emitting telemetry when mastered
  useEffect(() => {
    if (allMastered && phase === PHASES.RESULT) {
      if (typeof onTelemetry === 'function') {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'chem_electrode_potential_explorer',
          message: "Learner demonstrated understanding of E° signs and electron flow direction."
        });
      }
    }
  }, [allMastered, phase, onTelemetry]);

  // Handlers
  const handleMetalSelect = (e) => {
    const metalId = e.target.value;
    if (!metalId) return;
    
    // Stop any existing result, return to predicting state
    setSelectedMetal(metalId);
    setPhase(PHASES.PREDICTING);
  };

  const handlePrediction = (predictedDirection) => {
    const metal = ELECTRODE_DATA[selectedMetal];
    const actualDirection = metal.e0 > 0 ? DIRECTIONS.H2_TO_METAL : DIRECTIONS.METAL_TO_H2;
    const isCorrect = predictedDirection === actualDirection;

    // Update explored metals set
    if (!exploredMetals.includes(selectedMetal)) {
      setExploredMetals(prev => [...prev, selectedMetal].sort((a, b) => ELECTRODE_DATA[b].e0 - ELECTRODE_DATA[a].e0));
    }

    setPhase(PHASES.ANIMATING);

    // After animation delay, show result and update checkpoints
    setTimeout(() => {
      setPhase(PHASES.RESULT);
      setCheckpoints(prev => ({
        ...prev,
        positive: prev.positive || metal.e0 > 0,
        negative: prev.negative || metal.e0 < 0,
        flow_h2_to_metal: prev.flow_h2_to_metal || metal.e0 > 0,
        flow_metal_to_h2: prev.flow_metal_to_h2 || metal.e0 < 0,
        predicted_correctly: prev.predicted_correctly || isCorrect
      }));
    }, 1500);
  };

  const handleReset = () => {
    setSelectedMetal(null);
    setPhase(PHASES.IDLE);
    setExploredMetals([]);
    setCheckpoints({
      positive: false,
      negative: false,
      flow_h2_to_metal: false,
      flow_metal_to_h2: false,
      predicted_correctly: false
    });
  };

  // Rendering Helpers
  const currentMetalData = selectedMetal ? ELECTRODE_DATA[selectedMetal] : null;
  const isResult = phase === PHASES.RESULT;
  const isAnimating = phase === PHASES.ANIMATING;
  const displayE0 = (isResult || isAnimating) && currentMetalData ? currentMetalData.e0 : 0.00;
  
  // Calculate Needle Rotation (-3V to +3V mapped to -90deg to +90deg roughly)
  // Max scale is around 3.0V. So rotation = (E0 / 3.0) * 90
  const needleRotation = (displayE0 / 3.0) * 90;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto p-4 bg-slate-50 rounded-3xl font-sans" role="region" aria-label="Standard Electrode Potential Explorer">
      
      {/* MISSION BANNER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600" aria-hidden="true">
          <Target className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            Mission
            {allMastered && <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-extrabold">Mastered</span>}
          </h2>
          <p className="text-slate-600 mt-1 font-medium">
            Compare different metals against the Standard Hydrogen Electrode. Observe how voltage and electron flow change. Can you predict which metals lose electrons more easily?
          </p>
        </div>
        <button
          onClick={handleReset}
          aria-label="Reset Experiment"
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold transition-all shadow-sm whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Stage & Interactive Cards */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Visualization Stage */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col items-center">
            
            {/* Controls Bar inside stage */}
            <div className="w-full flex justify-between items-end mb-8 z-10">
              <div className="bg-sky-50 border border-sky-200 px-4 py-2 rounded-xl text-center">
                <span className="block text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Reference Electrode</span>
                <span className="block text-lg font-black text-slate-800">Standard Hydrogen</span>
                <span className="block text-sm font-bold text-slate-500">0.00 V</span>
              </div>

              <div className="flex flex-col items-end">
                <label htmlFor="metal-select" className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Select Metal to Compare</label>
                <select
                  id="metal-select"
                  value={selectedMetal || ""}
                  onChange={handleMetalSelect}
                  className="bg-white border-2 border-slate-200 text-slate-800 font-bold text-lg px-4 py-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none cursor-pointer"
                >
                  <option value="" disabled>-- Select a Metal --</option>
                  {Object.values(ELECTRODE_DATA).map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.symbol})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SVG Apparatus */}
            <div className="w-full relative h-[250px] flex justify-center items-end pb-4">
              
              {/* Background Connective Wire */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 250" preserveAspectRatio="xMidYMid meet">
                {/* Wire path from left beaker to right beaker through voltmeter */}
                <path d="M 150 150 L 150 50 L 300 50 L 450 50 L 450 150" fill="none" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Electron Flow Animations (Blue) */}
                {(isResult || isAnimating) && currentMetalData && (
                  <g>
                    {/* H2 -> Metal (Electrons move Right) */}
                    {currentMetalData.e0 > 0 && (
                      <circle cx="0" cy="0" r="5" fill="#3B82F6">
                        <animateMotion path="M 150 150 L 150 50 L 450 50 L 450 150" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {currentMetalData.e0 > 0 && (
                      <circle cx="0" cy="0" r="5" fill="#3B82F6">
                        <animateMotion path="M 150 150 L 150 50 L 450 50 L 450 150" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {currentMetalData.e0 > 0 && (
                      <circle cx="0" cy="0" r="5" fill="#3B82F6">
                        <animateMotion path="M 150 150 L 150 50 L 450 50 L 450 150" dur="1.5s" begin="1.0s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Metal -> H2 (Electrons move Left) */}
                    {currentMetalData.e0 < 0 && (
                      <circle cx="0" cy="0" r="5" fill="#3B82F6">
                        <animateMotion path="M 450 150 L 450 50 L 150 50 L 150 150" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {currentMetalData.e0 < 0 && (
                      <circle cx="0" cy="0" r="5" fill="#3B82F6">
                        <animateMotion path="M 450 150 L 450 50 L 150 50 L 150 150" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {currentMetalData.e0 < 0 && (
                      <circle cx="0" cy="0" r="5" fill="#3B82F6">
                        <animateMotion path="M 450 150 L 450 50 L 150 50 L 150 150" dur="1.5s" begin="1.0s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                )}

                {/* Left Beaker (SHE) */}
                <rect x="90" y="120" width="120" height="110" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="4" rx="10" />
                <rect x="140" y="90" width="20" height="120" fill="#94A3B8" /> {/* Platinum Electrode */}
                <text x="150" y="180" textAnchor="middle" fill="#0284C7" fontSize="16" fontWeight="bold">H⁺ / H₂</text>

                {/* Right Beaker (Selected Metal) */}
                {selectedMetal ? (
                  <g className="animate-in fade-in zoom-in duration-500">
                    <rect x="390" y="120" width="120" height="110" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="4" rx="10" />
                    <rect x="430" y="90" width="40" height="120" fill={currentMetalData.e0 > 0 ? "#FDBA74" : "#CBD5E1"} /> {/* Metal Electrode */}
                    <text x="450" y="180" textAnchor="middle" fill="#475569" fontSize="18" fontWeight="bold">{currentMetalData.symbol} / {currentMetalData.ion}</text>
                  </g>
                ) : (
                  <g>
                    <rect x="390" y="120" width="120" height="110" fill="transparent" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="8 8" rx="10" />
                    <text x="450" y="180" textAnchor="middle" fill="#94A3B8" fontSize="14" fontWeight="bold">Empty</text>
                  </g>
                )}
              </svg>

              {/* Voltmeter Component (Center) */}
              <div className="absolute top-[20px] left-1/2 -translate-x-1/2 bg-white border-4 border-slate-700 rounded-2xl w-40 h-28 shadow-xl flex flex-col items-center justify-end pb-3 z-20">
                <span className="absolute top-2 text-[10px] font-black text-slate-400 tracking-widest uppercase">Voltmeter</span>
                
                {/* Needle and Dial */}
                <div className="w-full h-12 relative overflow-hidden mb-1">
                  <div className="absolute bottom-0 left-1/2 w-28 h-28 border-t-2 border-l-2 border-r-2 border-slate-200 rounded-t-full -translate-x-1/2"></div>
                  {/* Needle */}
                  <div 
                    className="absolute bottom-0 left-1/2 w-1 h-14 bg-red-500 origin-bottom rounded-t-full transition-transform duration-1000 ease-out"
                    style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
                  ></div>
                  <div className="absolute bottom-[-4px] left-1/2 w-3 h-3 bg-slate-800 rounded-full -translate-x-1/2"></div>
                </div>

                {/* Digital Display */}
                <div className="bg-slate-800 px-3 py-1 rounded border-2 border-slate-900 shadow-inner min-w-[80px] text-center">
                  <span className="text-emerald-400 font-mono font-bold text-lg tracking-wider">
                    {displayE0 > 0 ? '+' : ''}{(displayE0).toFixed(2)} V
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Action / Explanation Area */}
          <div className="min-h-[160px]">
            {phase === PHASES.IDLE && (
              <div className="bg-slate-100 border border-dashed border-slate-300 p-8 rounded-2xl text-center flex flex-col items-center justify-center text-slate-500 h-full">
                <HelpCircle className="w-8 h-8 mb-2 text-slate-400" />
                <p className="font-bold">Awaiting Metal Selection</p>
                <p className="text-sm">Choose a metal from the dropdown to compare it to the Hydrogen Reference Electrode.</p>
              </div>
            )}

            {phase === PHASES.PREDICTING && currentMetalData && (
              <div className="bg-violet-50 border border-violet-200 p-6 rounded-2xl shadow-sm text-center animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-lg font-black text-violet-900 mb-2">Prediction Required</h3>
                <p className="text-violet-700 font-medium mb-6">Which way do you think electrons will flow between Hydrogen and {currentMetalData.name}?</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => handlePrediction(DIRECTIONS.H2_TO_METAL)}
                    className="flex-1 bg-white border-2 border-violet-300 hover:border-violet-500 hover:bg-violet-100 text-violet-800 px-4 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    Hydrogen <ArrowRight className="w-5 h-5 text-blue-500" /> {currentMetalData.name}
                  </button>
                  <button 
                    onClick={() => handlePrediction(DIRECTIONS.METAL_TO_H2)}
                    className="flex-1 bg-white border-2 border-violet-300 hover:border-violet-500 hover:bg-violet-100 text-violet-800 px-4 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    {currentMetalData.name} <ArrowRight className="w-5 h-5 text-blue-500" /> Hydrogen
                  </button>
                </div>
              </div>
            )}

            {(isAnimating || isResult) && currentMetalData && (
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-black text-slate-800">
                    {currentMetalData.name} vs Hydrogen
                  </h3>
                </div>

                {isAnimating ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-pulse text-slate-400 font-bold tracking-widest uppercase text-sm">Evaluating Potential Difference...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-700">
                          {currentMetalData.e0 > 0 ? "Positive standard potential (+)" : "Negative standard potential (-)"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-700">
                          {currentMetalData.e0 > 0 ? "Gains electrons more readily than Hydrogen" : "Loses electrons more readily than Hydrogen"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-700">
                          Electrons flow toward <strong>{currentMetalData.e0 > 0 ? currentMetalData.name : "Hydrogen"}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Conclusion</h4>
                      <p className="text-sm font-medium text-slate-800 mb-1">
                        <span className={currentMetalData.e0 > 0 ? "text-green-600 font-bold" : "text-orange-600 font-bold"}>
                          {currentMetalData.name} is {currentMetalData.e0 > 0 ? "reduced" : "oxidized"}.
                        </span>
                      </p>
                      <p className="text-sm font-medium text-slate-800">
                        <span className={currentMetalData.e0 > 0 ? "text-orange-600 font-bold" : "text-green-600 font-bold"}>
                          Hydrogen is {currentMetalData.e0 > 0 ? "oxidized" : "reduced"}.
                        </span>
                      </p>
                      <div className="mt-3 text-xs font-bold bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-600 shadow-sm inline-block">
                        Prediction: {currentMetalData.name} acts as the stronger <strong>{currentMetalData.e0 > 0 ? "oxidizing" : "reducing"}</strong> agent.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar & Rules */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Metal Ranking Sidebar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex-1">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Electrochemical Series
            </h3>
            
            <div className="relative">
              {/* Vertical axis line */}
              <div className="absolute left-3 top-2 bottom-2 w-1 bg-gradient-to-b from-green-400 via-slate-300 to-orange-400 rounded-full"></div>
              
              <div className="text-[10px] font-black text-green-600 uppercase tracking-widest pl-8 mb-2">Most Positive (Reduction)</div>
              
              <ul className="space-y-2 relative z-10 pl-8 pb-2">
                {/* Dynamically insert explored metals and Hydrogen */}
                {/* We combine Explored Metals + Hydrogen, sort by E0 descending */}
                {[...exploredMetals, 'hydrogen']
                  .sort((a, b) => (a === 'hydrogen' ? 0.00 : ELECTRODE_DATA[a].e0) < (b === 'hydrogen' ? 0.00 : ELECTRODE_DATA[b].e0) ? 1 : -1)
                  .map((id) => {
                    const isHydrogen = id === 'hydrogen';
                    const data = isHydrogen ? SHE : ELECTRODE_DATA[id];
                    const isSelected = selectedMetal === id;
                    
                    return (
                      <li key={id} className={`flex justify-between items-center px-3 py-2 rounded-xl text-sm font-bold border transition-all ${
                        isSelected ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-sm scale-105 origin-left' : 
                        isHydrogen ? 'bg-slate-100 border-slate-200 text-slate-600' :
                        'bg-white border-slate-100 text-slate-700'
                      }`}>
                        <span>{data.name}</span>
                        <span className="font-mono text-xs">{data.e0 > 0 ? '+' : ''}{data.e0.toFixed(2)} V</span>
                      </li>
                    );
                })}
              </ul>

              <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest pl-8 mt-2">Most Negative (Oxidation)</div>
            </div>
          </div>

          {/* Persistent Quick Rule Card */}
          <div className="bg-slate-800 text-slate-300 p-5 rounded-2xl border border-slate-700 shadow-sm text-sm">
            <h3 className="font-black text-white uppercase tracking-wider mb-3">Remember</h3>
            <div className="space-y-4">
              <div>
                <p className="text-green-400 font-bold mb-1">More Positive E° (+)</p>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li>Greater tendency to gain electrons</li>
                  <li>Stronger oxidizing agent</li>
                </ul>
              </div>
              <div>
                <p className="text-orange-400 font-bold mb-1">More Negative E° (-)</p>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li>Greater tendency to lose electrons</li>
                  <li>Stronger reducing agent</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* LEARNING CHECKPOINT NOTIFICATION */}
      {allMastered && (
        <div className="p-5 rounded-2xl border transition-all bg-emerald-50 border-emerald-200 text-emerald-900 animate-in slide-in-from-bottom-4 fade-in" role="alert">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Electrode Potentials Mastered</h3>
              <p className="text-sm font-medium">
                <strong>Key Discovery:</strong> Standard electrode potentials predict the direction of electron flow. Electrons always flow from the half-cell with the lower reduction potential toward the half-cell with the higher reduction potential.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
