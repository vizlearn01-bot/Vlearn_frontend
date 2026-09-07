import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, Activity, Sliders, Zap, Sparkles } from 'lucide-react';

export default function ThomsonSpecificChargeSim({ config = {}, onTelemetry }) {
  const [fieldMode, setFieldMode] = useState('crossed'); // 'electric' | 'magnetic' | 'crossed'
  const [anodeVoltage, setAnodeVoltage] = useState(2500); // 1000V - 5000V (Va)
  const [deflectionPlateV, setDeflectionPlateV] = useState(120); // 0 - 400V (Vd)
  const [magneticBmT, setMagneticBmT] = useState(1.8); // 0 - 5 mT (B)
  const [userAns, setUserAns] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  // Accepted physical constants
  const eAccepted = 1.602e-19; // C
  const mAccepted = 9.109e-31; // kg
  const emAccepted = eAccepted / mAccepted; // ~1.7588e11 C/kg

  // Dimensions of tube
  const plateLength = 0.05; // 5 cm
  const plateSeparation = 0.02; // 2 cm (d)
  const screenDistance = 0.15; // 15 cm from plates to screen

  // Electric field E = Vd / d (V/m)
  const E = deflectionPlateV / plateSeparation;
  // Magnetic field B in Tesla
  const B = magneticBmT * 1e-3;

  // Actual electron velocity from anode acceleration: v = sqrt(2 * (e/m) * Va)
  const actualVelocity = Math.sqrt(2 * emAccepted * anodeVoltage); // m/s

  // Electric force Fe = e * E
  // Magnetic force Fm = e * v * B (upward opposing electric force)
  // In crossed fields, condition for zero deflection is v = E / B
  const crossedVelocity = B > 0.0001 ? E / B : 0;
  // Experimental e/m calculated when undeflected: e/m = E^2 / (2 * Va * B^2)
  const experimentalEM = B > 0.0001 ? (E * E) / (2 * anodeVoltage * B * B) : 0;
  const emErrorPercent = Math.abs((experimentalEM - emAccepted) / emAccepted) * 100;

  // Deflection calculations on screen (in mm)
  let screenDeflectionMm = 0;
  if (fieldMode === 'electric') {
    // y = (e * E * L / (m * v^2)) * (D + L/2) = (E * L / (2 * Va)) * (D + L/2)
    screenDeflectionMm = ((E * plateLength) / (2 * anodeVoltage)) * (screenDistance + plateLength / 2) * 1000;
  } else if (fieldMode === 'magnetic') {
    // Circular arc radius r = mv / eB; deflection approx = (e * B * L / (m * v)) * (D + L/2)
    const defM = ((eAccepted * B * plateLength) / (mAccepted * actualVelocity)) * (screenDistance + plateLength / 2);
    screenDeflectionMm = -defM * 1000; // opposite direction
  } else {
    // Crossed fields: net force = e * (E - v * B)
    const netForcePerCharge = E - actualVelocity * B;
    screenDeflectionMm = ((netForcePerCharge * plateLength) / (2 * anodeVoltage)) * (screenDistance + plateLength / 2) * 1000;
  }

  // Clamped deflection for SVG rendering (-50 to +50 px)
  const clampedDeflectionPx = Math.max(-60, Math.min(60, screenDeflectionMm * 1.5));

  const handleReset = () => {
    setFieldMode('crossed');
    setAnodeVoltage(2500);
    setDeflectionPlateV(120);
    setMagneticBmT(1.8);
    setQuizStatus(null);
    setUserAns('');
  };

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const val = parseFloat(userAns.trim());
    // Practice: Va = 2000 V, E = 40,000 V/m, B = 1.5 mT (0.0015 T).
    // v = E / B = 40000 / 0.0015 = 2.667 × 10^7 m/s
    // e/m = v^2 / (2 * Va) = (2.667e7)^2 / 4000 = 1.78 × 10^11 C/kg (in units of 10^11, answer is ~1.78)
    if (Math.abs(val - 1.78) < 0.2 || Math.abs(val - 1.76) < 0.2) {
      setQuizStatus('correct');
      if (onTelemetry) onTelemetry('thomson_quiz_correct', { problem: 'em_ratio' });
    } else {
      setQuizStatus('incorrect');
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
            <span className="text-xs text-slate-400 font-mono">Nobel Landmark Experiment (1897)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            J.J. Thomson Specific Charge (e/m) & Velocity Selector
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Experiment
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
        {[
          { id: 'electric', title: 'Electric Field Only (E)', desc: 'Deflection towards positive upper plate' },
          { id: 'magnetic', title: 'Magnetic Field Only (B)', desc: 'Downward deflection via Lorentz force' },
          { id: 'crossed', title: 'Crossed Fields (E ⟂ B)', desc: 'Velocity selector balance: eE = evB ⟹ v = E/B' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setFieldMode(m.id)}
            className={`text-left p-3 rounded-2xl border transition-all ${
              fieldMode === m.id
                ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/50 text-white'
                : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-400'
            }`}
          >
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Zap className={`w-3.5 h-3.5 ${fieldMode === m.id ? 'text-emerald-400' : 'text-slate-500'}`} />
              {m.title}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Main Bench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Evacuated Tube SVG Canvas (Col 8) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300">
              Crossed Fields Vacuum Chamber & Phosphor Screen
            </span>
            <span className="font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-lg">
              v = {(actualVelocity / 1e6).toFixed(2)} × 10⁶ m/s
            </span>
          </div>

          {/* Tube Schematic */}
          <div className="w-full h-[260px] bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-2">
            <svg viewBox="0 0 600 220" className="w-full h-full">
              {/* Glass Tube Outline */}
              <path
                d="M 20,80 L 120,80 L 220,60 L 440,40 L 540,20 L 540,200 L 440,180 L 220,160 L 120,140 L 20,140 Z"
                fill="#050811"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Electron Gun: Cathode & Anode */}
              <rect x="30" y="95" width="8" height="30" fill="#38bdf8" rx="2" />
              <text x="34" y="88" fill="#38bdf8" fontSize="8" textAnchor="middle">Cathode</text>
              <rect x="75" y="90" width="8" height="40" fill="#f59e0b" rx="2" />
              <line x1="75" y1="110" x2="83" y2="110" stroke="#050811" strokeWidth="6" />
              <text x="79" y="82" fill="#f59e0b" fontSize="8" textAnchor="middle">Anode (+Va)</text>

              {/* Deflection Plates (Electric Field) */}
              <rect x="180" y="75" width="80" height="8" fill="#f43f5e" rx="1" />
              <text x="220" y="70" fill="#f43f5e" fontSize="8" fontWeight="bold" textAnchor="middle">+ Plate (+Vd/2)</text>
              <rect x="180" y="137" width="80" height="8" fill="#38bdf8" rx="1" />
              <text x="220" y="155" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">- Plate (-Vd/2)</text>

              {/* Magnetic Field Vector Symbols (Into page = crosses) */}
              {(fieldMode === 'magnetic' || fieldMode === 'crossed') && (
                <g opacity="0.6">
                  {[195, 220, 245].map((x, i) => (
                    <g key={i}>
                      <circle cx={x} cy="100" r="6" fill="none" stroke="#60a5fa" strokeWidth="1" />
                      <line x1={x - 4} y1="96" x2={x + 4} y2="104" stroke="#60a5fa" strokeWidth="1.2" />
                      <line x1={x + 4} y1="96" x2={x - 4} y2="104" stroke="#60a5fa" strokeWidth="1.2" />
                      <circle cx={x} cy="120" r="6" fill="none" stroke="#60a5fa" strokeWidth="1" />
                      <line x1={x - 4} y1="116" x2={x + 4} y2="124" stroke="#60a5fa" strokeWidth="1.2" />
                      <line x1={x + 4} y1="116" x2={x - 4} y2="124" stroke="#60a5fa" strokeWidth="1.2" />
                    </g>
                  ))}
                  <text x="220" y="112" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">B (Into Page)</text>
                </g>
              )}

              {/* Undeflected Axis Line */}
              <line x1="83" y1="110" x2="540" y2="110" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

              {/* Electron Beam Path */}
              <path
                d={`M 83,110 L 180,110 Q 220,${110 - clampedDeflectionPx * 0.4} 260,${110 - clampedDeflectionPx * 0.6} L 540,${110 - clampedDeflectionPx}`}
                fill="none"
                stroke="#4ade80"
                strokeWidth="3"
                className="drop-shadow-[0_0_8px_rgba(74,222,128,0.85)]"
              />

              {/* Phosphor Screen Line & Spot */}
              <line x1="540" y1="20" x2="540" y2="200" stroke="#22c55e" strokeWidth="5" />
              <circle cx="540" cy={110 - clampedDeflectionPx} r="5" fill="#86efac" className="animate-pulse" />
            </svg>
          </div>

          {/* Telemetry Bar */}
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs flex flex-wrap justify-between items-center text-slate-300">
            <span>
              Net Spot Deflection: <strong className={`font-mono ${Math.abs(screenDeflectionMm) < 1.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {screenDeflectionMm.toFixed(1)} mm ({screenDeflectionMm > 0 ? 'Upward' : screenDeflectionMm < 0 ? 'Downward' : 'Zero'})
              </strong>
            </span>
            {fieldMode === 'crossed' && (
              <span>
                Calculated e/m: <strong className="text-cyan-400 font-mono">{(experimentalEM / 1e11).toFixed(3)} × 10¹¹ C/kg</strong> (Error: {emErrorPercent.toFixed(1)}%)
              </span>
            )}
          </div>
        </div>

        {/* Controls & Calculations (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> Voltage & Magnet Dials
            </div>

            {/* Anode Voltage */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Anode Potential (Va):</span>
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

            {/* Plate Voltage */}
            {(fieldMode === 'electric' || fieldMode === 'crossed') && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Plate Voltage (Vd):</span>
                  <span className="font-mono font-bold text-rose-400">{deflectionPlateV} V (E = {E.toFixed(0)} V/m)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="400"
                  step="5"
                  value={deflectionPlateV}
                  onChange={(e) => setDeflectionPlateV(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Magnetic Field */}
            {(fieldMode === 'magnetic' || fieldMode === 'crossed') && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Coil Field (B):</span>
                  <span className="font-mono font-bold text-cyan-400">{magneticBmT.toFixed(2)} mT</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5.0"
                  step="0.05"
                  value={magneticBmT}
                  onChange={(e) => setMagneticBmT(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Educational Conclusion */}
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-[11px] text-emerald-300 leading-relaxed">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
              <strong>Velocity Selector Condition:</strong> Tune B or Vd until the green beam passes straight through (0 mm deflection). Then <em>v = E/B</em>, which allows directly calculating <em>e/m = E² / (2·Va·B²)</em>!
            </div>
          </div>
        </div>
      </div>

      {/* Exam Practice Question */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            KCSE Exam Challenge: Specific Charge Calculation
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          In a Thomson apparatus, electrons are accelerated by an anode voltage of <strong>2,000 V</strong>. They enter crossed electric field E = 4.0 × 10^4 V/m and magnetic field B = 1.5 mT. Find the measured specific charge e/m in units of <strong>10^{11} C/kg</strong>.
        </p>

        <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 1.78"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500 w-36"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Check e/m Value
          </button>
          {quizStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Correct! v = E/B = 2.67 × 10⁷ m/s ⟹ e/m = v² / (2Va) ≈ 1.78 × 10¹¹ C/kg.
            </span>
          )}
          {quizStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Incorrect. Use v = E / B, then substitute into e/m = v² / (2Va).
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
