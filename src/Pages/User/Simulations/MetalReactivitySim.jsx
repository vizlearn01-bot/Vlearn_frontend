import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, RotateCcw, HelpCircle, ArrowRight, XCircle, Beaker, Zap, BookOpen, Search } from 'lucide-react';

const REACTIVITY = {
  magnesium: { id: 'magnesium', name: 'Magnesium', rank: 5, symbol: 'Mg', ion: 'Mg²⁺', colour: '#d1fae5', solutionColour: '#6ee7b7' },
  zinc:      { id: 'zinc',      name: 'Zinc',      rank: 4, symbol: 'Zn', ion: 'Zn²⁺', colour: '#e0f2fe', solutionColour: '#7dd3fc' },
  iron:      { id: 'iron',      name: 'Iron',      rank: 3, symbol: 'Fe', ion: 'Fe²⁺', colour: '#fef3c7', solutionColour: '#fbbf24' },
  copper:    { id: 'copper',    name: 'Copper',    rank: 2, symbol: 'Cu', ion: 'Cu²⁺', colour: '#ffedd5', solutionColour: '#4ade80' },
  silver:    { id: 'silver',    name: 'Silver',    rank: 1, symbol: 'Ag', ion: 'Ag⁺',  colour: '#f1f5f9', solutionColour: '#94a3b8' },
};

const SOLUTIONS = {
  magnesium_sulfate: { id: 'magnesium_sulfate', metal: 'magnesium', label: 'Magnesium Sulfate (MgSO₄)' },
  zinc_sulfate:      { id: 'zinc_sulfate',      metal: 'zinc',      label: 'Zinc Sulfate (ZnSO₄)' },
  iron_sulfate:      { id: 'iron_sulfate',      metal: 'iron',      label: 'Iron Sulfate (FeSO₄)' },
  copper_sulfate:    { id: 'copper_sulfate',    metal: 'copper',    label: 'Copper Sulfate (CuSO₄)' },
  silver_nitrate:    { id: 'silver_nitrate',    metal: 'silver',    label: 'Silver Nitrate (AgNO₃)' },
};

const REAL_WORLD = {
  magnesium: { use: 'Fireworks & Flares',    fact: 'Magnesium burns brilliantly, making it ideal for emergency flares.' },
  zinc:      { use: 'Galvanization',          fact: 'Zinc coats iron and steel to prevent rust — used in car bodies and fencing.' },
  iron:      { use: 'Rust Prevention',        fact: 'Understanding iron\'s reactivity is key to preventing corrosion in construction.' },
  copper:    { use: 'Electrical Wiring',      fact: 'Copper\'s moderate reactivity and excellent conductivity make it the metal of choice for wiring.' },
  silver:    { use: 'Jewellery & Photography',fact: 'Silver\'s low reactivity means it resists tarnishing, making it ideal for decorative use.' },
};

const PHASES = {
  IDLE: 'idle',
  PREDICTING: 'predicting',
  ANIMATING: 'animating',
  RESULT: 'result'
};

const PREDICTIONS = {
  REACTION: 'reaction',
  NO_REACTION: 'no_reaction'
};

export default function MetalReactivitySim({ config = {}, onTelemetry }) {
  const [selectedStripId, setSelectedStripId] = useState('');
  const [selectedSolutionId, setSelectedSolutionId] = useState('');
  const [phase, setPhase] = useState(PHASES.IDLE);
  const [userPrediction, setUserPrediction] = useState(null);

  // Checkpoints
  const [exploredStrips, setExploredStrips] = useState([]);
  const [checkpoints, setCheckpoints] = useState({
    observed_reaction: false,
    observed_no_reaction: false,
    tested_three_metals: false,
    predicted_correctly: false
  });

  const allMastered = checkpoints.observed_reaction && 
                      checkpoints.observed_no_reaction && 
                      checkpoints.tested_three_metals && 
                      checkpoints.predicted_correctly;

  useEffect(() => {
    if (allMastered && phase === PHASES.RESULT) {
      if (typeof onTelemetry === 'function') {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'chem_metal_reactivity_series',
          message: "Learner demonstrated understanding of the Metal Reactivity Series."
        });
      }
    }
  }, [allMastered, phase, onTelemetry]);

  // Derived state
  const strip = selectedStripId ? REACTIVITY[selectedStripId] : null;
  const solution = selectedSolutionId ? SOLUTIONS[selectedSolutionId] : null;
  const solutionMetal = solution ? REACTIVITY[solution.metal] : null;
  
  const reactionOccurs = strip && solutionMetal ? strip.rank > solutionMetal.rank : false;
  const predictionCorrect = userPrediction === (reactionOccurs ? PREDICTIONS.REACTION : PREDICTIONS.NO_REACTION);

  useEffect(() => {
    if (strip && solution) {
      setPhase(PHASES.PREDICTING);
      setUserPrediction(null);
    } else {
      setPhase(PHASES.IDLE);
      setUserPrediction(null);
    }
  }, [selectedStripId, selectedSolutionId]);

  const handlePrediction = (prediction) => {
    setUserPrediction(prediction);
    setPhase(PHASES.ANIMATING);
    
    // Checkpoints update
    setExploredStrips(prev => {
        const next = [...new Set([...prev, selectedStripId])];
        if (next.length >= 3) {
            setCheckpoints(c => ({...c, tested_three_metals: true}));
        }
        return next;
    });

    setTimeout(() => {
      setPhase(PHASES.RESULT);
      setCheckpoints(prev => ({
        ...prev,
        observed_reaction: prev.observed_reaction || reactionOccurs,
        observed_no_reaction: prev.observed_no_reaction || !reactionOccurs,
        predicted_correctly: prev.predicted_correctly || (prediction === (reactionOccurs ? PREDICTIONS.REACTION : PREDICTIONS.NO_REACTION))
      }));
    }, 4500); // Animation duration
  };

  const handleReset = () => {
    setSelectedStripId('');
    setSelectedSolutionId('');
    setPhase(PHASES.IDLE);
    setUserPrediction(null);
  };

  const buildEquation = (strip, solutionMetal, reacts) => {
    if (!reacts) return { text: 'No displacement reaction occurs.', reacts: false };
    return {
      text: `${strip.symbol}(s) + ${solutionMetal.ion}(aq) → ${strip.ion}(aq) + ${solutionMetal.symbol}(s)`,
      reacts: true
    };
  };

  const getReason = () => {
      if (!strip || !solutionMetal) return "";
      if (reactionOccurs) {
          return `${strip.name} is above ${solutionMetal.name} in the Reactivity Series. It loses electrons more easily. ${solutionMetal.name} ions therefore gain those electrons and become solid ${solutionMetal.name}.`;
      } else {
          return `${strip.name} is below (or equal to) ${solutionMetal.name} in the Reactivity Series. It cannot lose electrons to ${solutionMetal.ion}. No electron transfer occurs.`;
      }
  };

  const isAnimating = phase === PHASES.ANIMATING;
  const isResult = phase === PHASES.RESULT;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto p-4 bg-slate-50 rounded-3xl font-sans" role="region" aria-label="Metal Reactivity & Displacement Reactions">
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
            Choose a metal strip and place it into a metal salt solution. Can you predict whether a displacement reaction will occur?
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
            <div className="w-full flex justify-between items-start mb-8 z-10 gap-4">
              <div className="flex flex-col flex-1">
                <label htmlFor="strip-select" className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Metal Strip</label>
                <select
                  id="strip-select"
                  value={selectedStripId}
                  onChange={(e) => setSelectedStripId(e.target.value)}
                  className="bg-white border-2 border-slate-200 text-slate-800 font-bold text-sm md:text-base px-3 py-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none cursor-pointer w-full"
                  disabled={isAnimating || isResult}
                >
                  <option value="" disabled>-- Select Strip --</option>
                  {Object.values(REACTIVITY).map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.symbol})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col flex-1">
                <label htmlFor="solution-select" className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Metal Salt Solution</label>
                <select
                  id="solution-select"
                  value={selectedSolutionId}
                  onChange={(e) => setSelectedSolutionId(e.target.value)}
                  className="bg-white border-2 border-slate-200 text-slate-800 font-bold text-sm md:text-base px-3 py-2 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none cursor-pointer w-full"
                  disabled={isAnimating || isResult}
                >
                  <option value="" disabled>-- Select Solution --</option>
                  {Object.values(SOLUTIONS).map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SVG Apparatus */}
            <div className="w-full relative h-[300px] flex justify-center items-end pb-4">
              
              {/* Add global styles for animation */}
              <style>{`
                  @keyframes strip-dissolve {
                      0% { transform: scaleX(1); }
                      100% { transform: scaleX(0.7); }
                  }
                  @keyframes solution-fade {
                      0% { opacity: 0.6; }
                      100% { opacity: 0.2; }
                  }
                  @keyframes deposit-grow {
                      0% { opacity: 0; transform: scaleX(1); }
                      10% { opacity: 1; transform: scaleX(1.1); }
                      100% { opacity: 1; transform: scaleX(1.5); }
                  }
              `}</style>
              
              <svg className="w-full h-full max-w-[400px]" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
                {/* Beaker Back */}
                <path d="M 100 50 L 100 250 A 20 20 0 0 0 120 270 L 280 270 A 20 20 0 0 0 300 250 L 300 50" fill="none" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Solution Fill */}
                {solutionMetal && (
                   <path 
                     d="M 104 120 L 104 250 A 16 16 0 0 0 120 266 L 280 266 A 16 16 0 0 0 296 250 L 296 120 Z" 
                     fill={solutionMetal.solutionColour} 
                     style={{ 
                         opacity: (isAnimating || isResult) && reactionOccurs ? 0.2 : 0.6,
                         transition: 'opacity 4s ease-in-out'
                     }}
                   />
                )}

                {/* Metal Strip */}
                {strip && (
                   <g className="origin-bottom" style={{ transformOrigin: '200px 260px', animation: (isAnimating || isResult) && reactionOccurs ? 'strip-dissolve 4s forwards' : 'none' }}>
                     <rect x="180" y="30" width="40" height="230" fill={strip.colour} stroke="#94A3B8" strokeWidth="2" rx="4" />
                     <text x="200" y="80" textAnchor="middle" fill="#475569" fontSize="16" fontWeight="bold">{strip.symbol}</text>
                   </g>
                )}

                {/* Deposited Metal Layer (only if reaction occurs) */}
                {strip && solutionMetal && reactionOccurs && (isAnimating || isResult) && (
                    <g className="origin-bottom" style={{ transformOrigin: '200px 260px', animation: 'deposit-grow 4s forwards' }}>
                        <rect x="178" y="140" width="44" height="120" fill={solutionMetal.colour} opacity="0" rx="4" />
                    </g>
                )}

                {/* Animations */}
                {isAnimating && strip && solutionMetal && (
                    <g>
                        {reactionOccurs ? (
                            <>
                                {/* Electrons leaving strip */}
                                <circle r="4" fill="#FDE047">
                                    <animateMotion path="M 175 160 Q 140 180 150 220" dur="1s" repeatCount="3" />
                                </circle>
                                <circle r="4" fill="#FDE047">
                                    <animateMotion path="M 225 180 Q 260 200 250 240" dur="1.2s" begin="0.3s" repeatCount="3" />
                                </circle>
                                {/* Metal ions leaving strip (dissolving) */}
                                <circle r="5" fill={strip.colour} stroke="#64748B" strokeWidth="1">
                                     <animateMotion path="M 180 200 Q 150 210 130 250" dur="1.5s" repeatCount="2" />
                                     <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="2" />
                                </circle>
                                {/* Solution ions depositing */}
                                <circle r="5" fill={solutionMetal.colour} stroke="#64748B" strokeWidth="1">
                                     <animateMotion path="M 120 180 Q 150 190 180 220" dur="1.3s" repeatCount="3" />
                                     <animate attributeName="opacity" values="0;1" dur="1.3s" repeatCount="3" />
                                </circle>
                            </>
                        ) : (
                            <>
                                {/* No Reaction: Just some slow bubbles */}
                                <circle r="3" fill="#FFFFFF" opacity="0.6">
                                    <animateMotion path="M 150 250 L 150 120" dur="3s" repeatCount="indefinite" />
                                </circle>
                                <circle r="4" fill="#FFFFFF" opacity="0.6">
                                    <animateMotion path="M 250 230 L 250 120" dur="4s" repeatCount="indefinite" />
                                </circle>
                            </>
                        )}
                    </g>
                )}
                
                {/* Beaker Front Lip (for depth) */}
                <path d="M 100 50 C 100 60, 300 60, 300 50" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                <path d="M 100 50 C 100 40, 300 40, 300 50" fill="none" stroke="#E2E8F0" strokeWidth="4" />
              </svg>

              {/* Deposit Label */}
              {isResult && reactionOccurs && solutionMetal && (
                  <div className="absolute top-[60%] left-[55%] bg-white px-2 py-1 rounded shadow-sm border border-slate-200 text-xs font-bold text-slate-700 animate-in fade-in zoom-in">
                      {solutionMetal.name} deposited
                  </div>
              )}
              
              {/* Legend */}
              <div className="absolute bottom-0 right-0 bg-white/90 p-2 rounded-lg border border-slate-200 shadow-sm text-[10px] font-medium text-slate-600">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full border border-slate-400" style={{backgroundColor: strip?.colour || '#ccc'}}></div> Metal atoms</div>
                  <div className="flex items-center gap-1 mt-1"><div className="w-3 h-3 rounded-full border border-slate-400" style={{backgroundColor: solutionMetal?.solutionColour || '#ccc'}}></div> Metal ions</div>
                  <div className="flex items-center gap-1 mt-1"><div className="w-3 h-3 rounded-full bg-yellow-300"></div> Electron flow</div>
              </div>
            </div>

            {/* Result Badge */}
            {isResult && (
               <div className={`mt-4 px-6 py-2 rounded-full font-black text-lg shadow-sm border flex items-center gap-2 animate-in slide-in-from-bottom-4 ${reactionOccurs ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                   {reactionOccurs ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                   {reactionOccurs ? 'Reaction Occurred' : 'No Reaction'}
               </div>
            )}
            
          </div>

          {/* Action Area */}
          <div className="min-h-[160px]">
            {phase === PHASES.IDLE && (
              <div className="bg-slate-100 border border-dashed border-slate-300 p-8 rounded-2xl text-center flex flex-col items-center justify-center text-slate-500 h-full">
                <HelpCircle className="w-8 h-8 mb-2 text-slate-400" />
                <p className="font-bold">Select Materials</p>
                <p className="text-sm">Choose a metal strip and a solution to begin the experiment.</p>
              </div>
            )}

            {phase === PHASES.PREDICTING && strip && solution && (
              <div className="bg-violet-50 border border-violet-200 p-6 rounded-2xl shadow-sm text-center animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-lg font-black text-violet-900 mb-2">🔮 What do you predict?</h3>
                <p className="text-violet-700 font-medium mb-6">Will {strip.name} displace {solutionMetal.name} from solution?</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => handlePrediction(PREDICTIONS.REACTION)}
                    className="flex-1 bg-white border-2 border-violet-300 hover:border-violet-500 hover:bg-violet-100 text-violet-800 px-4 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    Reaction Expected
                  </button>
                  <button 
                    onClick={() => handlePrediction(PREDICTIONS.NO_REACTION)}
                    className="flex-1 bg-white border-2 border-violet-300 hover:border-violet-500 hover:bg-violet-100 text-violet-800 px-4 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    No Reaction Expected
                  </button>
                </div>
              </div>
            )}

            {isAnimating && (
                <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm animate-in fade-in zoom-in-95 flex flex-col items-center justify-center h-full">
                    <div className="animate-pulse text-slate-500 font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                        <Beaker className="w-5 h-5 animate-bounce" /> Experiment in progress...
                    </div>
                </div>
            )}

            {isResult && strip && solutionMetal && (
              <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95">
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                      <Search className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-black text-slate-800">Observation Panel</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-slate-100 pb-1">
                                <span className="text-sm text-slate-500 font-bold">Metal Strip</span>
                                <span className="text-sm text-slate-800 font-bold">{strip.name} ({strip.symbol})</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-1">
                                <span className="text-sm text-slate-500 font-bold">Dissolved Ion</span>
                                <span className="text-sm text-slate-800 font-bold">{solutionMetal.ion}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-1">
                                <span className="text-sm text-slate-500 font-bold">Your Prediction</span>
                                <span className="text-sm text-slate-800 font-bold">{userPrediction === PREDICTIONS.REACTION ? 'Reaction Expected' : 'No Reaction Expected'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-1">
                                <span className="text-sm text-slate-500 font-bold">Actual Result</span>
                                <span className={`text-sm font-bold ${reactionOccurs ? 'text-emerald-600' : 'text-slate-600'}`}>{reactionOccurs ? 'Reaction Occurred' : 'No Reaction'}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-sm text-slate-500 font-bold">Prediction Correct?</span>
                                <span className={`text-sm font-bold flex items-center gap-1 ${predictionCorrect ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {predictionCorrect ? <><CheckCircle2 className="w-4 h-4"/> Correct</> : <><XCircle className="w-4 h-4"/> Incorrect</>}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Reason</h4>
                                <p className="text-sm font-medium text-slate-700 leading-tight">{getReason()}</p>
                            </div>
                            <div className="bg-slate-800 p-3 rounded-xl border border-slate-900 shadow-inner overflow-x-auto">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Ionic Equation</h4>
                                <code className="text-sm font-mono text-emerald-400 whitespace-nowrap">{buildEquation(strip, solutionMetal, reactionOccurs).text}</code>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Exam Tip */}
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                      <BookOpen className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                          <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-1">Exam Tip</h4>
                          <p className="text-sm text-amber-900 font-medium">
                              {reactionOccurs 
                                  ? "A metal higher in the activity series displaces the ions of any metal below it from solution. The more reactive metal is oxidised (loses electrons); the less reactive metal ion is reduced (gains electrons)."
                                  : "A less reactive metal cannot displace a more reactive metal from solution. No electron transfer occurs — the strip remains unchanged."
                              }
                          </p>
                      </div>
                  </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Permanent Activity Series Sidebar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex-1">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Activity Series
            </h3>
            
            <div className="relative">
              {/* Vertical axis line */}
              <div className="absolute left-3 top-2 bottom-2 w-1 bg-gradient-to-b from-blue-400 via-slate-300 to-orange-400 rounded-full"></div>
              
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest pl-8 mb-2">Most Reactive</div>
              
              <ul className="space-y-2 relative z-10 pl-8 pb-2">
                {Object.values(REACTIVITY).sort((a,b) => b.rank - a.rank).map((m) => {
                  const isStrip = selectedStripId === m.id;
                  const isSolution = solutionMetal?.id === m.id;
                  
                  let styleClass = 'bg-white border-slate-100 text-slate-700';
                  if (isStrip && isSolution) styleClass = 'bg-gradient-to-r from-blue-50 to-orange-50 border-slate-400 text-slate-800 scale-105 shadow-md';
                  else if (isStrip) styleClass = 'bg-blue-50 border-blue-400 text-blue-800 scale-105 shadow-sm';
                  else if (isSolution) styleClass = 'bg-orange-50 border-orange-400 text-orange-800 scale-105 shadow-sm';

                  return (
                    <li key={m.id} className={`flex justify-between items-center px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all origin-left ${styleClass}`}>
                      <span>{m.name}</span>
                      <span className="font-mono text-xs">{m.symbol}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest pl-8 mt-2">Least Reactive</div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <div className="w-3 h-3 rounded bg-blue-100 border-2 border-blue-400"></div> Metal Strip
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <div className="w-3 h-3 rounded bg-orange-100 border-2 border-orange-400"></div> Dissolved Metal
                </div>
            </div>
          </div>

          {/* Real-World Connection Sidebar */}
          {(isResult || isAnimating || phase === PHASES.PREDICTING) && strip && (
              <div className="bg-slate-800 p-5 rounded-2xl shadow-sm text-slate-200 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Real-World Connection</h3>
                  <p className="font-bold text-white mb-1">{REAL_WORLD[strip.id].use}</p>
                  <p className="text-sm text-slate-300 leading-tight">{REAL_WORLD[strip.id].fact}</p>
              </div>
          )}

        </div>

      </div>

      {/* LEARNING CHECKPOINT NOTIFICATION */}
      {allMastered && (
        <div className="p-5 rounded-2xl border transition-all bg-emerald-50 border-emerald-200 text-emerald-900 animate-in slide-in-from-bottom-4 fade-in" role="alert">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Metal Reactivity Mastered</h3>
              <p className="text-sm font-medium">
                <strong>Key Discovery:</strong> A more reactive metal displaces a less reactive metal from solution.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
