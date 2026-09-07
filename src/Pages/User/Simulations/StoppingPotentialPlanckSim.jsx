import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, Sliders, Sparkles, Activity } from 'lucide-react';

const METALS = {
  caesium: { name: 'Caesium (Cs)', phi: 2.14, f0: 5.16e14 },
  potassium: { name: 'Potassium (K)', phi: 2.30, f0: 5.55e14 },
  sodium: { name: 'Sodium (Na)', phi: 2.46, f0: 5.93e14 },
  zinc: { name: 'Zinc (Zn)', phi: 4.31, f0: 10.4e14 },
  platinum: { name: 'Platinum (Pt)', phi: 6.35, f0: 15.3e14 },
};

export default function StoppingPotentialPlanckSim({ config = {}, onTelemetry }) {
  const [selectedMetal, setSelectedMetal] = useState('caesium');
  const [freq10e14, setFreq10e14] = useState(7.5); // frequency in 10^14 Hz (5 to 14)
  const [collectedPoints, setCollectedPoints] = useState([]);
  const [userAns, setUserAns] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  const metal = METALS[selectedMetal];
  const h = 6.63e-34;
  const e = 1.6e-19;
  const hOverE = h / e; // ~4.14e-15 V*s

  const frequency = freq10e14 * 1e14; // Hz
  // Kmax = hf - Phi (in eV)
  const photonEnergyEV = (h * frequency) / e;
  const kMaxEV = Math.max(0, photonEnergyEV - metal.phi);
  // Stopping potential Vs = Kmax / e in Volts
  const stoppingPotentialV = photonEnergyEV > metal.phi ? photonEnergyEV - metal.phi : 0;

  const handleCollectPoint = () => {
    if (photonEnergyEV <= metal.phi) return; // no emission below threshold
    if (!collectedPoints.find((p) => Math.abs(p.f - freq10e14) < 0.1 && p.metal === selectedMetal)) {
      setCollectedPoints([...collectedPoints, { f: freq10e14, vs: stoppingPotentialV, metal: selectedMetal }]);
    }
  };

  const handleReset = () => {
    setSelectedMetal('caesium');
    setFreq10e14(7.5);
    setCollectedPoints([]);
    setQuizStatus(null);
    setUserAns('');
  };

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const val = parseFloat(userAns.trim());
    // Work function Phi = h * f0. For f0 = 5.5 x 10^14 Hz, Phi in eV:
    // Phi = (6.63e-34 * 5.5e14) / 1.6e-19 = 2.28 eV
    if (Math.abs(val - 2.28) < 0.15 || Math.abs(val - 2.3) < 0.2) {
      setQuizStatus('correct');
      if (onTelemetry) onTelemetry('stopping_potential_quiz_correct', { problem: 'work_function' });
    } else {
      setQuizStatus('incorrect');
    }
  };

  // SVG Graph coords (Frequency on X from 4 to 15, Vs on Y from 0 to 4)
  const graphW = 340;
  const graphH = 160;

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              PHYSICS FORM 4 • TOPIC 9
            </span>
            <span className="text-xs text-slate-400 font-mono">Millikan’s Landmark Verification (1916)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-violet-400" />
            Stopping Potential & Planck's Constant (h/e) Determination
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Spectrometer
        </button>
      </div>

      {/* Metal Cathode Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-5">
        {Object.entries(METALS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => {
              setSelectedMetal(k);
              setCollectedPoints([]);
            }}
            className={`text-left p-2.5 rounded-2xl border transition-all ${
              selectedMetal === k
                ? 'bg-violet-950/40 border-violet-500/50 shadow-lg shadow-violet-950/50 text-white'
                : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-400'
            }`}
          >
            <div className="text-xs font-bold text-slate-200">{v.name}</div>
            <div className="text-[10px] text-slate-400">Φ = {v.phi} eV</div>
          </button>
        ))}
      </div>

      {/* Main Bench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Stopping Potential vs Frequency Graph (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-400" /> Linear Graph: Stopping Potential Vs vs Frequency f
            </span>
            <span className="font-mono text-violet-400 bg-violet-950/60 border border-violet-800/60 px-2 py-0.5 rounded-lg">
              Slope = h/e ≈ 4.14 × 10⁻¹⁵ V·s
            </span>
          </div>

          {/* SVG Graph */}
          <div className="w-full h-[240px] bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
            <svg viewBox={`0 0 ${graphW + 40} ${graphH + 40}`} className="w-full h-full">
              {/* Axes */}
              <line x1="35" y1="10" x2="35" y2={graphH + 10} stroke="#475569" strokeWidth="1.5" />
              <line x1="35" y1={graphH + 10} x2={graphW + 35} y2={graphH + 10} stroke="#475569" strokeWidth="1.5" />
              <text x="30" y="20" fill="#94a3b8" fontSize="8" textAnchor="end">Vs (Volts)</text>
              <text x={graphW + 35} y={graphH + 25} fill="#94a3b8" fontSize="8" textAnchor="end">f (×10¹⁴ Hz)</text>

              {/* Gridlines */}
              {[6, 8, 10, 12, 14].map((fVal) => {
                const x = 35 + ((fVal - 4) / 11) * graphW;
                return (
                  <g key={fVal}>
                    <line x1={x} y1="10" x2={x} y2={graphH + 10} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                    <text x={x} y={graphH + 22} fill="#64748b" fontSize="7" textAnchor="middle">{fVal}</text>
                  </g>
                );
              })}

              {/* Theoretical Millikan Straight Line: Vs = (h/e)*f - Phi/e */}
              {(() => {
                const f0Val = metal.f0 / 1e14;
                const x0 = 35 + ((f0Val - 4) / 11) * graphW;
                const fMax = 15;
                const xMax = 35 + ((fMax - 4) / 11) * graphW;
                const vsMax = (hOverE * (fMax * 1e14) - metal.phi * e / e);
                const yMax = graphH + 10 - (vsMax / 4.0) * graphH;
                return (
                  <g>
                    <line x1={x0} y1={graphH + 10} x2={xMax} y2={yMax} stroke="#8b5cf6" strokeWidth="2.5" />
                    {/* Threshold frequency f0 label */}
                    <circle cx={x0} cy={graphH + 10} r="4" fill="#a78bfa" />
                    <text x={x0} y={graphH + 4} fill="#a78bfa" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                      f₀
                    </text>
                  </g>
                );
              })()}

              {/* User Collected Data Points */}
              {collectedPoints
                .filter((p) => p.metal === selectedMetal)
                .map((p, i) => {
                  const px = 35 + ((p.f - 4) / 11) * graphW;
                  const py = graphH + 10 - (p.vs / 4.0) * graphH;
                  return <circle key={i} cx={px} cy={py} r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />;
                })}
            </svg>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-xs flex justify-between items-center text-slate-300">
            <span>
              Threshold Frequency f₀: <strong className="text-violet-400 font-mono">{(metal.f0 / 1e14).toFixed(2)} × 10¹⁴ Hz</strong>
            </span>
            <button
              onClick={handleCollectPoint}
              disabled={photonEnergyEV <= metal.phi}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                photonEnergyEV > metal.phi
                  ? 'bg-violet-600 hover:bg-violet-500 text-white'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Plot Point (f, Vs)
            </button>
          </div>
        </div>

        {/* Controls (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-violet-400" /> Monochromatic Light Source
            </div>

            {/* Frequency Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Incident Frequency (f):</span>
                <span className="font-mono font-bold text-violet-400">{freq10e14.toFixed(2)} × 10¹⁴ Hz</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="14.0"
                step="0.25"
                value={freq10e14}
                onChange={(e) => setFreq10e14(Number(e.target.value))}
                className="w-full accent-violet-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Energy Balances */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Photon Energy (E = hf):</span>
                <span className="text-slate-200 font-bold">{photonEnergyEV.toFixed(2)} eV</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Metal Work Function (Φ):</span>
                <span className="text-violet-300 font-bold">{metal.phi.toFixed(2)} eV</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Max Kinetic Energy (Kmax):</span>
                <span className={kMaxEV > 0 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {kMaxEV.toFixed(2)} eV
                </span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-1.5">
                <span>Stopping Potential (Vs):</span>
                <span className={stoppingPotentialV > 0 ? 'text-cyan-400 font-bold' : 'text-rose-400'}>
                  {stoppingPotentialV > 0 ? `${stoppingPotentialV.toFixed(2)} V` : '0 V (No Emission)'}
                </span>
              </div>
            </div>

            {/* Note */}
            <div className="p-3 bg-violet-950/30 border border-violet-800/40 rounded-xl text-[11px] text-violet-300 leading-relaxed">
              <strong>Einstein's Equation:</strong> <em>eVs = hf - Φ</em>. The slope of Vs vs f is strictly <em>h/e</em> for ALL metals, while the x-intercept reveals the threshold frequency <em>f₀</em>!
            </div>
          </div>
        </div>
      </div>

      {/* KCSE Exam Challenge */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            KCSE Photoelectric Calculation Challenge
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          The threshold frequency of a photoelectric metal is f₀ = 5.5 × 10¹⁴ Hz. Taking Planck's constant h = 6.63 × 10⁻³⁴ J·s and e = 1.6 × 10⁻¹⁹ C, calculate the <strong>work function (Φ)</strong> in electron-volts (eV).
        </p>

        <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 2.28"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-violet-500 w-36"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Check Work Function
          </button>
          {quizStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-violet-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Correct! Φ = hf₀ = (6.63×10⁻³⁴ × 5.5×10¹⁴) / (1.6×10⁻¹⁹) ≈ 2.28 eV.
            </span>
          )}
          {quizStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Incorrect. Use Φ = h·f₀ (in Joules), then divide by e to convert to eV.
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
