import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Target, CheckCircle2, FlaskConical, Beaker, Zap, Activity } from 'lucide-react';

// Activity series rankings (higher is more reactive)
const METALS = {
  Mg: { name: 'Magnesium', symbol: 'Mg', rank: 5, color: '#D1D5DB' }, // gray-300
  Zn: { name: 'Zinc', symbol: 'Zn', rank: 4, color: '#9CA3AF' }, // gray-400
  Fe: { name: 'Iron', symbol: 'Fe', rank: 3, color: '#6B7280' }, // gray-500
  Cu: { name: 'Copper', symbol: 'Cu', rank: 2, color: '#D97706' }, // amber-600
  Ag: { name: 'Silver', symbol: 'Ag', rank: 1, color: '#F3F4F6' }, // gray-100
};

// Available solutions
const SOLUTIONS = {
  CuSO4: { name: 'Copper Sulfate', metalBase: 'Cu', ionColor: '#3B82F6', formula: 'CuSO₄(aq)' }, // blue-500
  FeSO4: { name: 'Iron Sulfate', metalBase: 'Fe', ionColor: '#A3E635', formula: 'FeSO₄(aq)' }, // lime-400 (pale green)
  AgNO3: { name: 'Silver Nitrate', metalBase: 'Ag', ionColor: '#F8FAFC', formula: 'AgNO₃(aq)' }, // colorless/pale
  ZnSO4: { name: 'Zinc Sulfate', metalBase: 'Zn', ionColor: '#F1F5F9', formula: 'ZnSO₄(aq)' }, // colorless
};

const REAL_WORLD_EXAMPLES = [
  "Sacrificial Anodes: Blocks of magnesium or zinc are attached to steel ships. They corrode first, protecting the iron.",
  "Galvanization: Iron nails are coated in zinc. Even if scratched, the more reactive zinc protects the iron from rusting.",
  "Metal Extraction: Carbon (non-metal but in the series) is used to extract iron from iron ore because it is more reactive.",
  "Corrosion Prevention: Less reactive metals like copper and silver are used for coins and pipes because they don't react easily with water."
];

export default function ActivitySeriesSim({ onTelemetry }) {
  const [selectedMetal, setSelectedMetal] = useState('Mg');
  const [selectedSolution, setSelectedSolution] = useState('CuSO4');
  
  const [animStatus, setAnimStatus] = useState('idle'); // 'idle' | 'running' | 'completed'
  const [progress, setProgress] = useState(0);
  
  const [discoveries, setDiscoveries] = useState({
    success: false,
    failed: false,
    prediction: false
  });
  
  const [exampleIndex, setExampleIndex] = useState(0);

  const metalData = METALS[selectedMetal];
  const solutionData = SOLUTIONS[selectedSolution];
  const solutionMetalData = METALS[solutionData.metalBase];
  
  const willReact = metalData.rank > solutionMetalData.rank;
  const isSame = metalData.symbol === solutionMetalData.symbol;
  
  const allCompleted = discoveries.success && discoveries.failed && discoveries.prediction;

  useEffect(() => {
    // Rotate real world examples
    const interval = setInterval(() => {
      setExampleIndex(prev => (prev + 1) % REAL_WORLD_EXAMPLES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (allCompleted) {
      if (typeof onTelemetry === 'function') {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'chem_activity_series_displacement',
          message: "Student mastered predicting displacement reactions using the activity series."
        });
      }
    }
  }, [allCompleted, onTelemetry]);

  useEffect(() => {
    if (animStatus !== 'running') return;

    const duration = 3000;
    const startTime = performance.now();
    let timeoutId;

    const animate = (time) => {
      const elapsed = time - startTime;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      if (p < 1) {
        timeoutId = requestAnimationFrame(animate);
      } else {
        setAnimStatus('completed');
        
        // Update discoveries
        setDiscoveries(prev => {
          const next = { ...prev };
          if (willReact && !isSame) next.success = true;
          if (!willReact && !isSame) next.failed = true;
          if (prev.success || prev.failed) next.prediction = true; // Simple logic for prediction marker
          return next;
        });
      }
    };
    
    timeoutId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(timeoutId);
  }, [animStatus, willReact, isSame]);

  const handleRun = () => {
    setProgress(0);
    setAnimStatus('running');
  };

  const handleReset = () => {
    setProgress(0);
    setAnimStatus('idle');
  };

  const handleMetalChange = (e) => {
    if (animStatus === 'running') return;
    setSelectedMetal(e.target.value);
    handleReset();
  };

  const handleSolutionChange = (e) => {
    if (animStatus === 'running') return;
    setSelectedSolution(e.target.value);
    handleReset();
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto p-6 bg-slate-50 rounded-3xl font-sans">
      
      {/* 1. MISSION BANNER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Mission</h2>
          <p className="text-slate-600 mt-1">
            Test different metals inside metal salt solutions. Can you predict when a displacement reaction will occur?
          </p>
        </div>
      </div>

      {/* 2. CONTROLS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Metal Strip</label>
            <select 
              value={selectedMetal} 
              onChange={handleMetalChange}
              disabled={animStatus === 'running'}
              className="bg-slate-100 border border-slate-300 text-slate-700 rounded-xl px-4 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(METALS).map(m => (
                <option key={m.symbol} value={m.symbol}>{m.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Solution</label>
            <select 
              value={selectedSolution} 
              onChange={handleSolutionChange}
              disabled={animStatus === 'running'}
              className="bg-slate-100 border border-slate-300 text-slate-700 rounded-xl px-4 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(SOLUTIONS).map(s => (
                <option key={s.metalBase} value={s.metalBase + 'SO4'}>{s.name}</option>
              ))}
              <option value="AgNO3">Silver Nitrate</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={animStatus === 'running'}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 shadow-sm"
          >
            <Play className="w-4 h-4" /> Run
          </button>
          <button
            onClick={handleReset}
            disabled={animStatus === 'running'}
            className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* TOP ROW: MAIN VISUALIZATION & ACTIVITY SERIES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 4. MAIN VISUALIZATION */}
          <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
            
            <div className="relative w-64 h-80 flex flex-col items-center justify-end">
              
              {/* The Beaker Drawing */}
              <svg viewBox="0 0 200 250" className="absolute bottom-0 w-full h-full drop-shadow-xl z-20 pointer-events-none">
                <path d="M 40,20 L 40,220 C 40,235 50,240 60,240 L 140,240 C 150,240 160,235 160,220 L 160,20" fill="none" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
                <path d="M 30,20 L 170,20" fill="none" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
                {/* Glass glare */}
                <path d="M 50,40 L 50,200" fill="none" stroke="#FFFFFF" strokeWidth="4" opacity="0.6" strokeLinecap="round" />
              </svg>
              
              {/* The Solution Liquid */}
              <div className="absolute bottom-2 w-[112px] h-[160px] rounded-b-2xl overflow-hidden z-10 transition-colors duration-1000" style={{
                backgroundColor: solutionData.ionColor,
                opacity: (animStatus === 'running' || animStatus === 'completed') && willReact && !isSame ? 1 - (progress * 0.7) : 0.8
              }}>
                {/* Animated Bubbles (only if running, minimal if no reaction, more if reaction) */}
                {animStatus === 'running' && (
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-40 animate-bounce"
                        style={{
                          left: `${Math.random() * 100}%`,
                          bottom: `${-10 - Math.random() * 20}%`,
                          animationDuration: `${1 + Math.random() * 2}s`,
                          animationDelay: `${Math.random() * 1}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* The Metal Strip */}
              <div className="absolute bottom-10 w-16 h-48 z-[15] rounded-sm transition-all duration-300" style={{
                backgroundColor: metalData.color,
                boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.2)'
              }}>
                {/* Plating overlay (when reaction occurs) */}
                <div className="absolute bottom-0 w-full transition-all duration-1000 ease-linear rounded-b-sm" style={{
                  height: (animStatus === 'running' || animStatus === 'completed') && willReact && !isSame ? `${progress * 100}%` : '0%',
                  backgroundColor: solutionMetalData.color,
                  opacity: 0.9,
                  boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.3)'
                }} />
                
                {/* Sparkle effect on completion */}
                {animStatus === 'completed' && willReact && !isSame && (
                  <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-yellow-400 animate-pulse drop-shadow-md z-30" />
                )}
              </div>
            </div>
            
            {/* Reaction Result Overlay Message */}
            <div className={`absolute top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl font-bold shadow-lg transition-all duration-500 z-30 flex items-center gap-2 whitespace-nowrap ${
              animStatus === 'completed' 
                ? (willReact && !isSame) 
                  ? 'opacity-100 translate-y-0 bg-emerald-500 text-white' 
                  : 'opacity-100 translate-y-0 bg-slate-700 text-white'
                : 'opacity-0 -translate-y-4'
            }`}>
              {(willReact && !isSame) ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> 
                  Reaction Occurred: {metalData.name} displaced {solutionMetalData.name}
                </>
              ) : (
                <>
                  <RotateCcw className="w-5 h-5" /> 
                  No Reaction: {metalData.name} cannot displace {solutionMetalData.name}
                </>
              )}
            </div>
          </div>

          {/* 3. ACTIVITY SERIES PANEL */}
          <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-6 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Activity className="w-5 h-5 text-purple-500" />
              Activity Series
            </h3>
            
            <div className="flex-1 flex flex-col justify-between py-2 relative">
              <div className="text-xs font-bold text-emerald-600 text-center mb-4 uppercase tracking-wider">Most Reactive</div>
              
              <div className="flex flex-col gap-3 relative z-10">
                {Object.values(METALS).sort((a,b) => b.rank - a.rank).map((m) => {
                  const isSelectedStrip = m.symbol === selectedMetal;
                  const isSelectedSolution = m.symbol === solutionMetalData.symbol;
                  
                  return (
                    <div 
                      key={m.symbol}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                        isSelectedStrip ? 'border-blue-500 bg-blue-50 scale-105 shadow-sm' : 
                        isSelectedSolution ? 'border-amber-500 bg-amber-50 scale-105 shadow-sm' : 
                        'border-transparent bg-slate-50 opacity-60'
                      }`}
                    >
                      <span className="font-bold text-slate-700">{m.name}</span>
                      <span className="text-xs font-mono font-bold text-slate-400">{m.symbol}</span>
                      {isSelectedStrip && <div className="absolute -left-2 w-2 h-2 rounded-full bg-blue-500"></div>}
                      {isSelectedSolution && <div className="absolute -right-2 w-2 h-2 rounded-full bg-amber-500"></div>}
                    </div>
                  );
                })}
              </div>
              
              <div className="text-xs font-bold text-slate-400 text-center mt-4 uppercase tracking-wider">Least Reactive</div>
              
              {/* Connecting Arrow */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -z-10 -translate-x-1/2"></div>
            </div>
          </div>
          
        </div>

        {/* BOTTOM ROW: OBSERVATION & REAL WORLD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 5. OBSERVATION PANEL */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-6 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Beaker className="w-5 h-5 text-blue-500" />
              Observation Panel
            </h3>
            
            <div className="space-y-5 flex-1">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase">Selected Metal</span>
                <span className="font-bold text-slate-800">{metalData.name} ({metalData.symbol})</span>
              </div>
              
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase">Solution</span>
                <span className="font-bold text-slate-800">{solutionData.name}</span>
              </div>
              
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-inner">
                <span className="text-xs font-bold text-blue-600 uppercase">Prediction</span>
                <span className="font-bold text-blue-800">
                  {isSame ? 'No Reaction' : willReact ? 'Reaction Expected' : 'No Reaction Expected'}
                </span>
              </div>
              
              <div className={`p-5 rounded-xl border transition-colors duration-500 ${animStatus === 'completed' ? (willReact && !isSame ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-100 border-slate-200') : 'bg-slate-50 border-slate-100 border-dashed opacity-50'}`}>
                <span className="text-xs font-bold uppercase block mb-2 tracking-wider" style={{ color: animStatus === 'completed' ? (willReact && !isSame ? '#059669' : '#475569') : '#94A3B8' }}>
                  Result & Explanation
                </span>
                {animStatus === 'completed' ? (
                  <p className={`text-sm font-medium leading-relaxed ${willReact && !isSame ? 'text-emerald-800' : 'text-slate-700'}`}>
                    {isSame ? (
                      "No reaction. A metal cannot displace itself."
                    ) : willReact ? (
                      `${metalData.name} is higher in the activity series than ${solutionMetalData.name}. It easily loses electrons to the ${solutionMetalData.name} ions, displacing them from solution.`
                    ) : (
                      `${metalData.name} is lower in the activity series than ${solutionMetalData.name}. It cannot give electrons to the more reactive ${solutionMetalData.name} ions.`
                    )}
                  </p>
                ) : (
                  <p className="text-sm font-medium text-slate-400">Run experiment to see results.</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Real World Connection */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden flex flex-col justify-center">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4" />
              Real World Connection
            </h3>
            <p className="text-sm text-blue-900 font-medium leading-relaxed transition-opacity duration-500" key={exampleIndex}>
              {REAL_WORLD_EXAMPLES[exampleIndex]}
            </p>
          </div>
          
        </div>

      </div>

      {/* 6. LEARNING CHECKPOINT */}
      <div className={`p-5 rounded-2xl border transition-all ${
        allCompleted 
          ? 'bg-emerald-50 border-emerald-200' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {allCompleted ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
            ) : (
              <Target className="w-8 h-8 text-slate-400 shrink-0" />
            )}
            <div>
              <h3 className={`font-bold uppercase tracking-wider text-sm mb-1 ${allCompleted ? 'text-emerald-800' : 'text-slate-700'}`}>
                {allCompleted ? '✅ Activity Series Mastered' : 'Learning Checkpoints'}
              </h3>
              <p className={`text-sm ${allCompleted ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                {allCompleted 
                  ? 'You can now predict displacement reactions using the activity series.'
                  : 'Complete these discoveries to master the topic:'}
              </p>
            </div>
          </div>
          
          {!allCompleted && (
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${discoveries.success ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                {discoveries.success ? '✓' : '○'} Successful Displacement
              </span>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${discoveries.failed ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                {discoveries.failed ? '✓' : '○'} Failed Displacement
              </span>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${discoveries.prediction ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                {discoveries.prediction ? '✓' : '○'} Make a Prediction
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
