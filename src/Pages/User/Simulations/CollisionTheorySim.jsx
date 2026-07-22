import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Target, CheckCircle2, SlidersHorizontal, Settings2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { evaluateCollision, OUTCOMES, ORIENTATIONS } from './CollisionEngine';

const STATES = {
  IDLE: 'idle',
  ANIMATING: 'animating',
  RESULT: 'result'
};

export default function CollisionTheorySim({ config = {}, onTelemetry }) {
  // Graceful handling of missing config
  const threshold = config?.activation_energy || 50;
  const context = config?.context_spec || {};

  // Application FSM State
  const [fsmState, setFsmState] = useState(STATES.IDLE);
  const [outcome, setOutcome] = useState(null);

  // User Inputs
  const [speed, setSpeed] = useState(20);
  const [orientation, setOrientation] = useState(ORIENTATIONS.GLANCING);

  // Learning Checkpoint Flags
  const [checkpoints, setCheckpoints] = useState({
    experienced_low_energy: false,
    experienced_wrong_orientation: false,
    experienced_success: false
  });
  
  const allMastered = checkpoints.experienced_low_energy && 
                      checkpoints.experienced_wrong_orientation && 
                      checkpoints.experienced_success;

  // Animation values
  const [progress, setProgress] = useState(0); // 0 to 1
  const animationRef = useRef(null);

  // Telemetry Emission
  useEffect(() => {
    if (allMastered && fsmState === STATES.RESULT) {
      if (typeof onTelemetry === 'function') {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'chem_collision_theory_kinetics',
          message: "Learner demonstrated that both activation energy and molecular orientation are necessary for successful reactions."
        });
      }
    }
  }, [allMastered, fsmState, onTelemetry]);

  // Run the Collision Engine
  const handleRun = () => {
    if (fsmState === STATES.ANIMATING) return;

    // Evaluate outcome synchronously so animation knows what to do
    const result = evaluateCollision(speed, orientation, threshold);
    setOutcome(result);
    setFsmState(STATES.ANIMATING);
    setProgress(0);

    // Animation Timing
    const duration = 1200 - (speed * 5); // Faster speed = shorter duration (700ms to 1150ms)
    const startTime = performance.now();

    const animate = (time) => {
      const p = Math.min((time - startTime) / duration, 1);
      setProgress(p);

      if (p < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation Callback: Complete the run
        setFsmState(STATES.RESULT);
        
        // Update flags based on deterministic result
        setCheckpoints(prev => ({
          ...prev,
          experienced_low_energy: prev.experienced_low_energy || result === OUTCOMES.LOW_ENERGY,
          experienced_wrong_orientation: prev.experienced_wrong_orientation || result === OUTCOMES.WRONG_ORIENTATION,
          experienced_success: prev.experienced_success || result === OUTCOMES.SUCCESS
        }));
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleReset = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    // Clear animation and result state
    setFsmState(STATES.IDLE);
    setOutcome(null);
    setProgress(0);
    
    // The prompt says "Reset restores the initial state" and "Reset clears: checkpoints (if appropriate)"
    // We will clear inputs and checkpoints so the user can rerun the full pedagogical loop.
    setSpeed(20);
    setOrientation(ORIENTATIONS.GLANCING);
    setCheckpoints({
      experienced_low_energy: false,
      experienced_wrong_orientation: false,
      experienced_success: false
    });
  };

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // ARIA Support Helpers
  const isAnimating = fsmState === STATES.ANIMATING;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 bg-slate-50 rounded-3xl font-sans" role="region" aria-label="Collision Theory Simulation">
      
      {/* 1. MISSION BANNER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0 text-violet-600" aria-hidden="true">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            Mission
            {allMastered && <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-extrabold">Mastered</span>}
          </h2>
          <p className="text-slate-600 mt-1 font-medium">
            Adjust the collision conditions and discover what is required for a successful chemical reaction.
          </p>
        </div>
      </div>

      {/* 2. EXPERIMENT CONTROLS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between">
        
        {/* Control 1: Launch Speed */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="speed-slider" className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              Launch Speed (Kinetic Energy)
            </label>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg border border-slate-200" aria-live="polite">
              {speed}
            </span>
          </div>
          <input
            id="speed-slider"
            type="range"
            min="10"
            max="100"
            step="10"
            value={speed}
            disabled={isAnimating}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-valuemin="10"
            aria-valuemax="100"
            aria-valuenow={speed}
          />
        </div>

        {/* Control 2: Collision Orientation */}
        <div className="flex-1 w-full flex flex-col items-start md:items-center">
          <span className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2" id="orientation-label">
            <Settings2 className="w-4 h-4 text-slate-400" />
            Collision Orientation
          </span>
          <div className="flex bg-slate-100 p-1 rounded-xl w-full max-w-[280px]" role="radiogroup" aria-labelledby="orientation-label">
            <button
              role="radio"
              aria-checked={orientation === ORIENTATIONS.HEAD_ON}
              disabled={isAnimating}
              onClick={() => setOrientation(ORIENTATIONS.HEAD_ON)}
              className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg transition-all disabled:opacity-50 ${
                orientation === ORIENTATIONS.HEAD_ON ? 'bg-white shadow-sm text-violet-700' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Head-On
            </button>
            <button
              role="radio"
              aria-checked={orientation === ORIENTATIONS.GLANCING}
              disabled={isAnimating}
              onClick={() => setOrientation(ORIENTATIONS.GLANCING)}
              className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg transition-all disabled:opacity-50 ${
                orientation === ORIENTATIONS.GLANCING ? 'bg-white shadow-sm text-violet-700' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Glancing
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleRun}
            disabled={isAnimating}
            aria-label="Run Collision"
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex-1 md:flex-none shadow-sm"
          >
            <Play className="w-4 h-4" /> Run
          </button>
          <button
            onClick={handleReset}
            disabled={isAnimating}
            aria-label="Reset Experiment"
            className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex-1 md:flex-none shadow-sm"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* 3. SIMULATION STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Panel: Collision Chamber */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center min-h-[350px] relative overflow-hidden">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest w-full text-center absolute top-6">
            Collision Chamber
          </h3>
          
          <div className="flex-1 w-full relative flex justify-center items-center">
            {/* Simple SVG Collision Engine */}
            <svg viewBox="0 0 400 200" className="w-full max-w-[400px] h-full overflow-visible" aria-hidden="true">
              
              {/* Background Reference Lines */}
              <line x1="0" y1="100" x2="400" y2="100" stroke="#F1F5F9" strokeWidth="2" strokeDasharray="8 8" />
              
              <g>
                {/* 
                  Particle A (Left)
                  - Idle: x=50
                  - Animating (Progress 0 -> 0.5): moves to center (x=170)
                  - Animating/Result (Progress 0.5 -> 1.0): 
                      - Low Energy: Bounces back (x=100)
                      - Glancing: Glances off to bottom-left (x=100, y=150)
                      - Success: Continues to right joined with B (x=280)
                */}
                <g transform={`translate(${
                  fsmState === STATES.IDLE ? 50 :
                  progress <= 0.5 ? 50 + (progress * 2 * 120) :
                  outcome === OUTCOMES.LOW_ENERGY ? 170 - ((progress - 0.5) * 2 * 70) :
                  outcome === OUTCOMES.WRONG_ORIENTATION ? 170 - ((progress - 0.5) * 2 * 70) :
                  170 + ((progress - 0.5) * 2 * 110)
                }, ${
                  fsmState === STATES.IDLE ? 100 :
                  progress <= 0.5 ? 100 :
                  outcome === OUTCOMES.WRONG_ORIENTATION ? 100 + ((progress - 0.5) * 2 * 50) :
                  100
                })`}>
                  <circle r="18" fill="#F43F5E" />
                  <text x="0" y="5" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">A</text>
                  
                  {/* Motion trails for high speed */}
                  {isAnimating && progress <= 0.5 && speed > 50 && (
                    <path d="M-25,0 L-45,0 M-22,-10 L-35,-10 M-22,10 L-35,10" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                  )}
                </g>

                {/* 
                  Molecule BC (Right)
                  - Idle: x=350
                  - Animating (Progress 0 -> 0.5): moves to center (x=230)
                  - Animating/Result (Progress 0.5 -> 1.0):
                      - Low Energy: Bounces back (x=300)
                      - Glancing: Glances off to top-right (x=300, y=50)
                      - Success: B separates with A to right (x=316), C separates further right (x=360)
                  - Note: For glancing, BC is rotated slightly to show incorrect alignment.
                */}
                <g transform={`translate(${
                  fsmState === STATES.IDLE ? 350 :
                  progress <= 0.5 ? 350 - (progress * 2 * 120) :
                  outcome === OUTCOMES.LOW_ENERGY ? 230 + ((progress - 0.5) * 2 * 70) :
                  outcome === OUTCOMES.WRONG_ORIENTATION ? 230 + ((progress - 0.5) * 2 * 70) :
                  230 /* Not moving as a single unit anymore in success */
                }, ${
                  fsmState === STATES.IDLE ? 100 :
                  progress <= 0.5 ? 100 :
                  outcome === OUTCOMES.WRONG_ORIENTATION ? 100 - ((progress - 0.5) * 2 * 50) :
                  100
                }) rotate(${
                  orientation === ORIENTATIONS.GLANCING ? 45 : 0 // Tilt if glancing
                })`}>
                  
                  {/* Draw BC bond if not success, or if success but before collision */}
                  {(outcome !== OUTCOMES.SUCCESS || progress <= 0.5) && (
                    <line x1="-18" y1="0" x2="18" y2="0" stroke="#64748B" strokeWidth="6" />
                  )}

                  {/* Atom B (Left part of BC) */}
                  <g transform={`translate(${
                    outcome === OUTCOMES.SUCCESS && progress > 0.5 ? -18 + ((progress - 0.5) * 2 * 104) : -18
                  }, 0)`}>
                    <circle r="18" fill="#3B82F6" />
                    <text x="0" y="5" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">B</text>
                  </g>

                  {/* Atom C (Right part of BC) */}
                  <g transform={`translate(${
                    outcome === OUTCOMES.SUCCESS && progress > 0.5 ? 18 + ((progress - 0.5) * 2 * 112) : 18
                  }, 0)`}>
                    <circle r="16" fill="#8B5CF6" />
                    <text x="0" y="5" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">C</text>
                  </g>

                  {/* Motion trails for high speed */}
                  {isAnimating && progress <= 0.5 && speed > 50 && (
                    <path d="M45,0 L65,0 M42,-10 L55,-10 M42,10 L55,10" stroke="#64748B" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                  )}
                </g>

                {/* Successful Reaction Flash */}
                {outcome === OUTCOMES.SUCCESS && progress > 0.45 && progress < 0.6 && (
                  <circle cx="200" cy="100" r={30 + Math.sin((progress-0.45)*20)*20} fill="#FDE047" opacity="0.8" style={{ mixBlendMode: 'multiply' }} />
                )}
              </g>

            </svg>
          </div>

          {/* Dynamic Result Overlay */}
          <div className="absolute bottom-6 w-full px-8 text-center" aria-live="assertive">
            {fsmState === STATES.RESULT && outcome === OUTCOMES.LOW_ENERGY && (
              <span className="inline-block bg-slate-800 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2">
                Collision occurred. Not enough energy to break existing bonds.
              </span>
            )}
            {fsmState === STATES.RESULT && outcome === OUTCOMES.WRONG_ORIENTATION && (
              <span className="inline-block bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2">
                Energy was sufficient. Molecules were not aligned correctly.
              </span>
            )}
            {fsmState === STATES.RESULT && outcome === OUTCOMES.SUCCESS && (
              <span className="inline-block bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2">
                Successful reaction! New bonds formed.
              </span>
            )}
          </div>
        </div>

        {/* Right Panel: Observation Panel */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex flex-col justify-between text-white min-h-[350px]" aria-live="polite">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-700 pb-2">
              Observation Log
            </h3>
            
            <div className="space-y-4">
              {/* Kinetic Energy Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Kinetic Energy</span>
                {fsmState === STATES.RESULT ? (
                  speed >= threshold ? (
                    <span className="text-emerald-400 font-bold text-sm flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded"><ShieldCheck className="w-4 h-4"/> Sufficient</span>
                  ) : (
                    <span className="text-red-400 font-bold text-sm flex items-center gap-1 bg-red-400/10 px-2 py-1 rounded"><ShieldAlert className="w-4 h-4"/> Insufficient</span>
                  )
                ) : (
                  <span className="text-slate-500 font-mono text-sm">—</span>
                )}
              </div>

              {/* Orientation Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Molecular Alignment</span>
                {fsmState === STATES.RESULT ? (
                  orientation === ORIENTATIONS.HEAD_ON ? (
                    <span className="text-emerald-400 font-bold text-sm flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded"><ShieldCheck className="w-4 h-4"/> Correct</span>
                  ) : (
                    <span className="text-orange-400 font-bold text-sm flex items-center gap-1 bg-orange-400/10 px-2 py-1 rounded"><ShieldAlert className="w-4 h-4"/> Incorrect</span>
                  )
                ) : (
                  <span className="text-slate-500 font-mono text-sm">—</span>
                )}
              </div>

              {/* Final Reaction Outcome */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700 mt-2">
                <span className="text-sm font-medium text-slate-300">Reaction Outcome</span>
                {fsmState === STATES.RESULT ? (
                  outcome === OUTCOMES.SUCCESS ? (
                    <span className="text-white font-black text-sm uppercase tracking-wider bg-emerald-600 px-3 py-1 rounded-lg">Success</span>
                  ) : (
                    <span className="text-white font-black text-sm uppercase tracking-wider bg-slate-600 px-3 py-1 rounded-lg">No Reaction</span>
                  )
                ) : (
                  <span className="text-slate-500 font-mono text-sm">—</span>
                )}
              </div>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="mt-8 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 min-h-[80px] flex flex-col justify-center">
            {fsmState === STATES.RESULT ? (
              outcome === OUTCOMES.LOW_ENERGY ? (
                <p className="text-sm text-slate-300">The particles collided, but they did not have enough energy to break existing bonds.</p>
              ) : outcome === OUTCOMES.WRONG_ORIENTATION ? (
                <p className="text-sm text-slate-300">The collision had enough energy, but the molecules were not aligned correctly to form a new bond.</p>
              ) : (
                <p className="text-sm text-emerald-300 font-medium">Both activation energy and correct orientation were achieved, resulting in a successful reaction.</p>
              )
            ) : (
              <p className="text-sm text-slate-500 text-center italic">Waiting for collision...</p>
            )}
          </div>
        </div>

      </div>

      {/* 4. LEARNING CHECKPOINT */}
      {allMastered && (
        <div className="p-5 rounded-2xl border transition-all bg-emerald-50 border-emerald-200 text-emerald-900 animate-in slide-in-from-bottom-4 fade-in" role="alert">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Collision Theory Mastered</h3>
              <p className="text-sm font-medium">
                You have demonstrated that <strong>both</strong> sufficient activation energy and correct molecular orientation are necessary for a chemical reaction to occur. Neither condition alone is enough!
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
