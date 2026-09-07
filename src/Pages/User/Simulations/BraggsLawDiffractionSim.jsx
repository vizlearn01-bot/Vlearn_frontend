import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, Sliders, Sparkles, Activity } from 'lucide-react';

const CRYSTALS = {
  nacl: { name: 'Rock Salt (NaCl)', d: 0.282, desc: 'Lattice interplanar spacing d = 0.282 nm' },
  kcl: { name: 'Potassium Chloride (KCl)', d: 0.314, desc: 'Lattice interplanar spacing d = 0.314 nm' },
  diamond: { name: 'Diamond Lattice', d: 0.154, desc: 'Tightly packed carbon d = 0.154 nm' },
};

export default function BraggsLawDiffractionSim({ config = {}, onTelemetry }) {
  const [selectedCrystal, setSelectedCrystal] = useState('nacl');
  const [thetaDeg, setThetaDeg] = useState(15.0); // glancing angle in degrees (5 to 60)
  const [lambdaNM, setLambdaNM] = useState(0.146); // X-ray wavelength nm (0.05 to 0.25)
  const [userAns, setUserAns] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  const crystal = CRYSTALS[selectedCrystal];
  const d = crystal.d; // nm
  const thetaRad = (thetaDeg * Math.PI) / 180;

  // Path difference Delta = 2 * d * sin(theta)
  const pathDifferenceNM = 2 * d * Math.sin(thetaRad);

  // Exact diffraction order: n = (2 * d * sin(theta)) / lambda
  const orderReal = pathDifferenceNM / lambdaNM;
  const closestIntOrder = Math.round(orderReal);
  const phaseError = Math.abs(orderReal - closestIntOrder);

  // Intensity peak sharpness (constructive interference condition: phaseError ~ 0)
  const peakIntensity = Math.max(0.05, Math.exp(-Math.pow(phaseError / 0.04, 2)));

  const handleReset = () => {
    setSelectedCrystal('nacl');
    setThetaDeg(15.0);
    setLambdaNM(0.146);
    setQuizStatus(null);
    setUserAns('');
  };

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const val = parseFloat(userAns.trim());
    // Bragg problem: 1st order reflection (n=1) for NaCl (d=0.282 nm) occurs at theta = 15.0 deg. Find lambda in nm.
    // lambda = 2 * 0.282 * sin(15 deg) = 0.564 * 0.2588 = 0.146 nm
    if (Math.abs(val - 0.146) < 0.015 || Math.abs(val - 0.15) < 0.02) {
      setQuizStatus('correct');
      if (onTelemetry) onTelemetry('bragg_quiz_correct', { problem: 'wavelength_calc' });
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              PHYSICS FORM 4 • TOPIC 8
            </span>
            <span className="text-xs text-slate-400 font-mono">X-Ray Crystallography Lab</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-amber-400" />
            Bragg's Law & X-Ray Crystal Diffraction Spectrometer
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Goniometer
        </button>
      </div>

      {/* Crystal Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
        {Object.entries(CRYSTALS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setSelectedCrystal(k)}
            className={`text-left p-3 rounded-2xl border transition-all ${
              selectedCrystal === k
                ? 'bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-950/50 text-white'
                : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-400'
            }`}
          >
            <div className="text-xs font-bold text-slate-200">{v.name}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{v.desc}</div>
          </button>
        ))}
      </div>

      {/* Main Bench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Crystal Lattice & Incident Rays (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Crystal Lattice Plane Interference
            </span>
            <span className="font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-lg">
              θ = {thetaDeg.toFixed(1)}° | 2θ = {(thetaDeg * 2).toFixed(1)}°
            </span>
          </div>

          {/* SVG Lattice & Rays */}
          <div className="w-full h-[260px] bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
            <svg viewBox="0 0 500 240" className="w-full h-full">
              {/* Atomic Lattice Planes (Layer 1 and Layer 2) */}
              {/* Layer 1: y = 100 */}
              {[60, 120, 180, 240, 300, 360, 420].map((x, i) => (
                <circle key={`l1-${i}`} cx={x} cy="100" r="7" fill="#38bdf8" />
              ))}
              <line x1="40" y1="100" x2="440" y2="100" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 4" />
              <text x="450" y="103" fill="#38bdf8" fontSize="8">Plane 1</text>

              {/* Layer 2: y = 160 */}
              {[60, 120, 180, 240, 300, 360, 420].map((x, i) => (
                <circle key={`l2-${i}`} cx={x} cy="160" r="7" fill="#38bdf8" />
              ))}
              <line x1="40" y1="160" x2="440" y2="160" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 4" />
              <text x="450" y="163" fill="#38bdf8" fontSize="8">Plane 2</text>

              {/* Interplanar spacing d indicator */}
              <line x1="40" y1="100" x2="40" y2="160" stroke="#f59e0b" strokeWidth="2" />
              <text x="25" y="133" fill="#f59e0b" fontSize="9" fontWeight="bold">d</text>

              {/* Ray 1: Reflects from atom at (240, 100) */}
              {(() => {
                const len = 160;
                const cosT = Math.cos(thetaRad);
                const sinT = Math.sin(thetaRad);
                const inX1 = 240 - len * cosT;
                const inY1 = 100 - len * sinT;
                const outX1 = 240 + len * cosT;
                const outY1 = 100 - len * sinT;
                return (
                  <g>
                    <line x1={inX1} y1={inY1} x2="240" y2="100" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="240" y1="100" x2={outX1} y2={outY1} stroke="#f43f5e" strokeWidth="2.5" />
                  </g>
                );
              })()}

              {/* Ray 2: Penetrates to reflect from atom at (240, 160) */}
              {(() => {
                const len = 160;
                const cosT = Math.cos(thetaRad);
                const sinT = Math.sin(thetaRad);
                const inX2 = 240 - len * cosT;
                const inY2 = 160 - len * sinT;
                const outX2 = 240 + len * cosT;
                const outY2 = 160 - len * sinT;
                return (
                  <g>
                    <line x1={inX2} y1={inY2} x2="240" y2="160" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 2" />
                    <line x1="240" y1="160" x2={outX2} y2={outY2} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 2" />
                  </g>
                );
              })()}

              {/* Constructive Interference Ionization Chamber Peak */}
              <g transform="translate(410, 40)">
                <rect x="0" y="0" width="70" height="40" fill="#1e293b" stroke="#334155" rx="6" />
                <text x="35" y="15" fill="#94a3b8" fontSize="7" textAnchor="middle">Detector Signal</text>
                <text
                  x="35"
                  y="32"
                  fill={peakIntensity > 0.6 ? '#4ade80' : '#94a3b8'}
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {(peakIntensity * 100).toFixed(0)}%
                </text>
              </g>
            </svg>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-300">
            <span>
              Extra Path 2d·sin(θ): <strong className="text-amber-400 font-mono">{pathDifferenceNM.toFixed(3)} nm</strong>
            </span>
            <span>
              Diffraction State: <strong className={peakIntensity > 0.6 ? 'text-emerald-400' : 'text-slate-400'}>
                {peakIntensity > 0.6 ? `Bragg Peak Order n = ${closestIntOrder}!` : 'Destructive Phase Out'}
              </strong>
            </span>
          </div>
        </div>

        {/* Controls (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-amber-400" /> Goniometer Angle & Wavelength
            </div>

            {/* Glancing Angle theta */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Glancing Bragg Angle (θ):</span>
                <span className="font-mono font-bold text-amber-400">{thetaDeg.toFixed(1)}°</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="45.0"
                step="0.2"
                value={thetaDeg}
                onChange={(e) => setThetaDeg(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* X-Ray Wavelength */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">X-Ray Wavelength (λ):</span>
                <span className="font-mono font-bold text-cyan-400">{lambdaNM.toFixed(3)} nm</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.25"
                step="0.002"
                value={lambdaNM}
                onChange={(e) => setLambdaNM(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Bragg Law Formula Card */}
            <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-[11px] text-amber-300 leading-relaxed">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 inline mr-1" />
              <strong>Bragg's Diffraction Law:</strong> <em>nλ = 2d·sin(θ)</em>. Constructive interference occurs whenever the optical path difference between successive atomic planes equals an integral multiple of the X-ray wavelength!
            </div>
          </div>
        </div>
      </div>

      {/* KCSE Exam Challenge */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            KCSE Crystallography Calculation Challenge
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          First-order reflection (n=1) occurs from rock salt crystal (d = 0.282 nm) at a glancing angle of θ = 15.0°. Given sin 15° ≈ 0.2588, calculate the <strong>wavelength (λ)</strong> of the incident monochromatic X-rays in <strong>nanometres (nm)</strong>.
        </p>

        <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            step="0.001"
            placeholder="e.g. 0.146"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500 w-36"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Submit Wavelength
          </button>
          {quizStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Correct! λ = 2d·sin(θ) / n = 2(0.282)(0.2588) ≈ 0.146 nm.
            </span>
          )}
          {quizStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Incorrect. Use nλ = 2d·sin(θ) with n=1, d=0.282 nm, and θ=15°.
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
