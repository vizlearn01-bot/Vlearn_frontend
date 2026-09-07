import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, HelpCircle, Eye, Sliders, Sparkles, Zap, Activity, Compass, ShieldAlert } from 'lucide-react';

const MODES = [
  { id: 'maltese', name: 'Maltese Cross', sub: 'Straight-Line Propagation & Sharp Shadow' },
  { id: 'paddle', name: 'Paddle Wheel', sub: 'Mechanical Momentum & Particle Nature' },
  { id: 'deflection', name: 'Magnetic Deflection', sub: "Lorentz Force & Fleming's Left-Hand Rule" },
];

export default function MagneticDeflectionCathodeRaysSim({ config = {}, onTelemetry }) {
  const [activeMode, setActiveMode] = useState('maltese');
  const [anodeVoltage, setAnodeVoltage] = useState(2500); // 1000V - 5000V
  const [magneticField, setMagneticField] = useState(20); // mT (0 to 50 mT)
  const [fieldPolarity, setFieldPolarity] = useState('north_up'); // 'north_up' | 'south_up'
  const [crossUpright, setCrossUpright] = useState(true);
  const [paddlePos, setPaddlePos] = useState(0.5); // position along glass rail (0 to 1)
  const [isPlaying, setIsPlaying] = useState(true);
  const [paddleWheelSpeed, setPaddleWheelSpeed] = useState(0);

  // Practice Quiz
  const [practiceAns, setPracticeAns] = useState('');
  const [practiceStatus, setPracticeStatus] = useState(null);

  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  // Physics constants
  const e = 1.6e-19; // C
  const m = 9.11e-31; // kg
  const v = Math.sqrt((2 * e * anodeVoltage) / m); // electron speed
  const B = (magneticField * 1e-3); // Tesla

  // Radius of curvature in magnetic field: r = mv / (eB)
  const radiusMeters = B > 0.001 ? (m * v) / (e * B) : 9999;
  // Normalized deflection offset (-1 to +1) on screen
  const directionMultiplier = fieldPolarity === 'north_up' ? -1 : 1;
  const deflectionFactor = Math.min(1, Math.max(-1, (directionMultiplier * (B * 1000) * 1.5) / Math.sqrt(anodeVoltage / 1000)));

  useEffect(() => {
    const loop = (now) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPlaying && activeMode === 'paddle') {
        // Paddle wheel moves forward towards anode due to momentum transfer
        // Speed scales with electron flux (current) and momentum p = mv
        const momentumRate = (v / 1e7) * 0.15;
        setPaddleWheelSpeed(momentumRate * 360); // deg/s
        setPaddlePos((prev) => {
          const next = prev + momentumRate * dt * 0.1;
          return next > 0.95 ? 0.05 : next;
        });
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, activeMode, v]);

  const handleReset = () => {
    setAnodeVoltage(2500);
    setMagneticField(20);
    setFieldPolarity('north_up');
    setCrossUpright(true);
    setPaddlePos(0.5);
    setIsPlaying(true);
    setPracticeStatus(null);
    setPracticeAns('');
  };

  const checkPractice = (e) => {
    e.preventDefault();
    const val = parseFloat(practiceAns.trim());
    // Problem: Va = 3000 V, B = 10 mT (0.01 T).
    // v = sqrt(2 * 1.6e-19 * 3000 / 9.11e-31) = sqrt(1.053e15) = 3.24e7 m/s
    // r = (9.11e-31 * 3.24e7) / (1.6e-19 * 0.01) = 2.95e-23 / 1.6e-21 = 0.0185 m = 1.85 cm
    if (Math.abs(val - 1.85) < 0.25 || Math.abs(val - 1.8) < 0.25) {
      setPracticeStatus('correct');
      if (onTelemetry) onTelemetry('practice_correct', { sim: 'magnetic_deflection_cathode_rays' });
    } else {
      setPracticeStatus('incorrect');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              PHYSICS FORM 4 • TOPIC 7
            </span>
            <span className="text-xs text-slate-400 font-mono">Crookes Discharge Lab</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Zap className="w-6 h-6 text-emerald-400" />
            Magnetic Deflection of Cathode Rays & Classical Tube Experiments
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Lab
        </button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
        {MODES.map((m) => {
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              className={`text-left p-3 rounded-2xl border transition-all ${
                isActive
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/50 text-white'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Activity className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                {m.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{m.sub}</div>
            </button>
          );
        })}
      </div>

      {/* Main Tube Canvas & Experiment Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Visualizer Tube Canvas (Col 8) */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-emerald-400" /> Discharge Tube Vacuum Chamber (10⁻³ mmHg)
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-lg">
              v = {(v / 1e6).toFixed(2)} × 10⁶ m/s
            </div>
          </div>

          {/* SVG Discharge Tube */}
          <div className="relative w-full h-[280px] bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-center overflow-hidden p-2">
            <svg viewBox="0 0 600 240" className="w-full h-full">
              <defs>
                <radialGradient id="phosphorGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#22c55e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#15803d" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.1" />
                  <stop offset="30%" stopColor="#4ade80" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#86efac" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* Glass Tube Outer Outline */}
              <path
                d="M 40,80 L 140,80 Q 240,80 320,60 L 520,30 L 520,210 L 320,180 Q 240,160 140,160 L 40,160 Z"
                fill="#090d16"
                stroke="#334155"
                strokeWidth="2.5"
              />

              {/* Cathode Plate (Negative) */}
              <rect x="50" y="90" width="10" height="60" fill="#38bdf8" rx="2" />
              <text x="55" y="82" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">Cathode (-)</text>

              {/* Anode Plate (Positive with central aperture) */}
              <rect x="130" y="85" width="8" height="30" fill="#f59e0b" rx="1" />
              <rect x="130" y="125" width="8" height="30" fill="#f59e0b" rx="1" />
              <text x="134" y="78" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">Anode (+)</text>

              {/* Mode 1: Maltese Cross Experiment */}
              {activeMode === 'maltese' && (
                <g>
                  {/* Cathode rays spreading toward screen */}
                  <polygon points="138,120 520,40 520,200" fill="url(#beamGrad)" opacity="0.65" />
                  
                  {/* Metal Cross Obstacle */}
                  {crossUpright ? (
                    <g transform="translate(330, 85)">
                      <rect x="12" y="0" width="12" height="70" fill="#94a3b8" rx="2" />
                      <rect x="0" y="20" width="36" height="12" fill="#94a3b8" rx="2" />
                      <circle cx="18" cy="26" r="4" fill="#cbd5e1" />
                    </g>
                  ) : (
                    <g transform="translate(330, 150) rotate(70)">
                      <rect x="12" y="0" width="12" height="70" fill="#64748b" rx="2" />
                      <rect x="0" y="20" width="36" height="12" fill="#64748b" rx="2" />
                    </g>
                  )}

                  {/* Fluorescent Screen at end of bulb */}
                  <line x1="520" y1="32" x2="520" y2="208" stroke="#22c55e" strokeWidth="6" />

                  {/* Sharp Cross Shadow on Screen if upright */}
                  {crossUpright ? (
                    <g transform="translate(512, 60)">
                      {/* Dark shadow where rays blocked */}
                      <rect x="0" y="20" width="12" height="80" fill="#030712" opacity="0.95" />
                      <rect x="-12" y="45" width="28" height="28" fill="#030712" opacity="0.95" />
                      <text x="-40" y="115" fill="#f8fafc" fontSize="9" fontWeight="bold">Sharp Shadow</text>
                    </g>
                  ) : (
                    <circle cx="520" cy="120" r="40" fill="url(#phosphorGlow)" />
                  )}
                </g>
              )}

              {/* Mode 2: Paddle Wheel Experiment */}
              {activeMode === 'paddle' && (
                <g>
                  {/* Horizontal Glass Rails */}
                  <line x1="160" y1="105" x2="500" y2="105" stroke="#475569" strokeWidth="2" strokeDasharray="4 3" />
                  <line x1="160" y1="135" x2="500" y2="135" stroke="#475569" strokeWidth="2" strokeDasharray="4 3" />

                  {/* Electron stream hitting upper vanes */}
                  <line x1="138" y1="105" x2="500" y2="105" stroke="#4ade80" strokeWidth="3" strokeDasharray="5 3" opacity="0.9" />

                  {/* Rolling Mica Paddle Wheel */}
                  {(() => {
                    const cx = 180 + paddlePos * 300;
                    const cy = 120;
                    return (
                      <g transform={`translate(${cx}, ${cy})`}>
                        <circle cx="0" cy="0" r="22" fill="none" stroke="#cbd5e1" strokeWidth="2" />
                        {/* Vanes rotating */}
                        <g transform={`rotate(${(paddlePos * 720) % 360})`}>
                          <line x1="-20" y1="0" x2="20" y2="0" stroke="#f59e0b" strokeWidth="3" />
                          <line x1="0" y1="-20" x2="0" y2="20" stroke="#f59e0b" strokeWidth="3" />
                          <circle cx="0" cy="0" r="4" fill="#e2e8f0" />
                        </g>
                        {/* Direction of rolling arrow */}
                        <path d="M -15,-30 L 15,-30 L 10,-35 M 15,-30 L 10,-25" stroke="#38bdf8" strokeWidth="2" fill="none" />
                        <text x="0" y="-35" fill="#38bdf8" fontSize="8" textAnchor="middle" fontWeight="bold">Rolling Force F = Δp/Δt</text>
                      </g>
                    );
                  })()}
                </g>
              )}

              {/* Mode 3: Magnetic Deflection with Helmholtz / External Magnets */}
              {activeMode === 'deflection' && (
                <g>
                  {/* External Magnetic Pole representation */}
                  <g transform="translate(300, 20)">
                    <rect x="-40" y="0" width="80" height="20" fill={fieldPolarity === 'north_up' ? '#ef4444' : '#3b82f6'} rx="4" />
                    <text x="0" y="14" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {fieldPolarity === 'north_up' ? 'NORTH POLE (N)' : 'SOUTH POLE (S)'}
                    </text>
                  </g>
                  <g transform="translate(300, 200)">
                    <rect x="-40" y="0" width="80" height="20" fill={fieldPolarity === 'north_up' ? '#3b82f6' : '#ef4444'} rx="4" />
                    <text x="0" y="14" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {fieldPolarity === 'north_up' ? 'SOUTH POLE (S)' : 'NORTH POLE (N)'}
                    </text>
                  </g>

                  {/* Magnetic field line arrows */}
                  {[-20, 0, 20].map((dx, i) => (
                    <line
                      key={i}
                      x1={300 + dx}
                      y1={fieldPolarity === 'north_up' ? 45 : 195}
                      x2={300 + dx}
                      y2={fieldPolarity === 'north_up' ? 195 : 45}
                      stroke="#64748b"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                  ))}

                  {/* Straight beam from cathode to aperture */}
                  <line x1="60" y1="120" x2="138" y2="120" stroke="#4ade80" strokeWidth="3" />

                  {/* Curved beam trajectory through magnetic field */}
                  {(() => {
                    const screenY = 120 + deflectionFactor * 70;
                    const ctrlY = 120 + deflectionFactor * 30;
                    return (
                      <g>
                        <path
                          d={`M 138,120 Q 280,${ctrlY} 520,${screenY}`}
                          fill="none"
                          stroke="#4ade80"
                          strokeWidth="3.5"
                          className="drop-shadow-[0_0_8px_rgba(74,222,128,0.9)]"
                        />
                        {/* Phosphor Spot on Screen */}
                        <circle cx="520" cy={screenY} r="6" fill="#4ade80" className="animate-ping" />
                        <circle cx="520" cy={screenY} r="5" fill="#86efac" />
                      </g>
                    );
                  })()}

                  {/* Phosphor Screen Line */}
                  <line x1="520" y1="32" x2="520" y2="208" stroke="#22c55e" strokeWidth="5" />
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Mode Specific Action Bar */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            {activeMode === 'maltese' && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCrossUpright(!crossUpright)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> {crossUpright ? 'Tilt Cross Down (Flat)' : 'Erect Cross (Upright)'}
                </button>
                <span className="text-slate-400">
                  {crossUpright ? 'Observation: Sharp shadow proves rays travel in straight lines.' : 'Observation: Screen glows with uniform green fluorescence.'}
                </span>
              </div>
            )}

            {activeMode === 'paddle' && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />} {isPlaying ? 'Pause Stream' : 'Resume Stream'}
                </button>
                <span className="text-slate-400">
                  Momentum p = mv transfers kinetic energy, pushing the wheel toward the anode.
                </span>
              </div>
            )}

            {activeMode === 'deflection' && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFieldPolarity(fieldPolarity === 'north_up' ? 'south_up' : 'north_up')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-cyan-400" /> Invert Magnetic Poles (Flip N/S)
                </button>
                <span className="text-emerald-400 font-medium font-mono text-[11px]">
                  Radius r = {(radiusMeters * 100).toFixed(1)} cm | Deflection: {deflectionFactor > 0 ? 'Downward' : 'Upward'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Controls & Scientific Parameters (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> Parameter Controls
            </div>

            {/* Anode Voltage */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Accelerating Voltage (Va):</span>
                <span className="font-mono font-bold text-emerald-400">{anodeVoltage} V</span>
              </div>
              <input
                type="range"
                min="1000"
                max="5000"
                step="100"
                value={anodeVoltage}
                onChange={(e) => setAnodeVoltage(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Magnetic Field (Only visible or active during deflection mode) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Magnetic Field (B):</span>
                <span className="font-mono font-bold text-cyan-400">{magneticField} mT</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="2"
                value={magneticField}
                onChange={(e) => setMagneticField(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Educational Readout Box */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2 text-xs font-mono">
              <div className="text-slate-400 flex justify-between">
                <span>Speed v:</span>
                <span className="text-slate-200 font-bold">{(v / 1e6).toFixed(2)} × 10⁶ m/s</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>Lorentz Force F:</span>
                <span className="text-cyan-300 font-bold">{(e * v * B * 1e14).toFixed(2)} × 10⁻¹⁴ N</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>Radius r = mv/eB:</span>
                <span className="text-emerald-300 font-bold">{B > 0 ? (radiusMeters * 100).toFixed(1) + ' cm' : '∞'}</span>
              </div>
            </div>

            {/* Principle Summary */}
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-[11px] text-emerald-300 leading-relaxed">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
              <strong>Fleming's Left-Hand Rule Notice:</strong> Cathode rays consist of negatively charged electrons. Therefore, conventional electric current is in the <em>opposite direction</em> to electron travel!
            </div>
          </div>
        </div>
      </div>

      {/* KCSE Diagnostic Quiz Section */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            KCSE Exam Diagnostic: Cathode Ray Deflection
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          An electron accelerated through an anode potential of <strong>3,000 V</strong> enters a uniform perpendicular magnetic field of <strong>0.01 T (10 mT)</strong>.
          Given e = 1.6 	imes 10^{-19}	ext{ C} and m_e = 9.11 	imes 10^{-31}	ext{ kg}, calculate the <strong>radius of the circular path</strong> in centimetres (cm).
        </p>

        <form onSubmit={checkPractice} className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 1.85"
            value={practiceAns}
            onChange={(e) => setPracticeAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500 w-36"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Check Answer
          </button>
          {practiceStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Correct! r ≈ 1.85 cm.
            </span>
          )}
          {practiceStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Incorrect. Hint: v = √(2eVa/m) ≈ 3.24 × 10⁷ m/s; r = mv / eB ≈ 0.0185 m = 1.85 cm.
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
