import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, Sliders, Sparkles, Activity } from 'lucide-react';

const ISOTOPES = [
  { id: 'H2', name: 'Deuterium (²H)', A: 2, Z: 1, EbPerA: 1.11, massU: 2.0141 },
  { id: 'He4', name: 'Helium-4 (⁴He)', A: 4, Z: 2, EbPerA: 7.07, massU: 4.0026 },
  { id: 'C12', name: 'Carbon-12 (¹²C)', A: 12, Z: 6, EbPerA: 7.68, massU: 12.0000 },
  { id: 'Fe56', name: 'Iron-56 (⁵⁶Fe)', A: 56, Z: 26, EbPerA: 8.79, massU: 55.9349, isPeak: true },
  { id: 'Kr92', name: 'Krypton-92 (⁹²Kr)', A: 92, Z: 36, EbPerA: 8.51, massU: 91.9261 },
  { id: 'Ba141', name: 'Barium-141 (¹⁴¹Ba)', A: 141, Z: 56, EbPerA: 8.33, massU: 140.9144 },
  { id: 'U235', name: 'Uranium-235 (²³⁵U)', A: 235, Z: 92, EbPerA: 7.59, massU: 235.0439 },
];

export default function BindingEnergyPerNucleonSim({ config = {}, onTelemetry }) {
  const [selectedIsoId, setSelectedIsoId] = useState('Fe56');
  const [userAns, setUserAns] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  const iso = ISOTOPES.find((i) => i.id === selectedIsoId) || ISOTOPES[3];

  // Mass defect: delta_m = Z*mp + (A-Z)*mn - massU
  const mp = 1.00728; // u
  const mn = 1.00866; // u
  const totalNucleonMass = iso.Z * mp + (iso.A - iso.Z) * mn;
  const deltaM = (totalNucleonMass - iso.massU).toFixed(4);
  const totalEbMeV = (deltaM * 931.5).toFixed(1);

  const handleReset = () => {
    setSelectedIsoId('Fe56');
    setQuizStatus(null);
    setUserAns('');
  };

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const val = parseFloat(userAns.trim());
    // For He-4: mass defect delta_m = 0.0304 u. Find Eb in MeV: 0.0304 * 931.5 = 28.3 MeV
    if (Math.abs(val - 28.3) < 0.6 || Math.abs(val - 28.2) < 0.6) {
      setQuizStatus('correct');
      if (onTelemetry) onTelemetry('binding_energy_quiz_correct', { problem: 'he4_energy' });
    } else {
      setQuizStatus('incorrect');
    }
  };

  const graphW = 340;
  const graphH = 160;

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              PHYSICS FORM 4 • TOPIC 10
            </span>
            <span className="text-xs text-slate-400 font-mono">Mass-Energy Equivalence & Nuclear Stability</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-rose-400" />
            Nuclear Binding Energy & Mass Defect Curve Explorer
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Curve
        </button>
      </div>

      {/* Isotope Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-5">
        {ISOTOPES.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedIsoId(item.id)}
            className={`text-center p-2 rounded-2xl border transition-all ${
              selectedIsoId === item.id
                ? 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/50 text-white font-bold'
                : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-400'
            }`}
          >
            <div className="text-xs text-slate-200">{item.name.split(' ')[0]}</div>
            <div className="text-[10px] text-rose-300">{item.EbPerA} MeV/A</div>
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Binding Energy Curve SVG (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-400" /> Binding Energy per Nucleon (Eb/A) vs Mass Number A
            </span>
            <span className="font-mono text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded-lg">
              Peak: ⁵⁶Fe (8.79 MeV/A)
            </span>
          </div>

          {/* SVG Graph */}
          <div className="w-full h-[240px] bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
            <svg viewBox={`0 0 ${graphW + 40} ${graphH + 40}`} className="w-full h-full">
              {/* Axes */}
              <line x1="35" y1="10" x2="35" y2={graphH + 10} stroke="#475569" strokeWidth="1.5" />
              <line x1="35" y1={graphH + 10} x2={graphW + 35} y2={graphH + 10} stroke="#475569" strokeWidth="1.5" />
              <text x="30" y="20" fill="#94a3b8" fontSize="8" textAnchor="end">Eb/A (MeV)</text>
              <text x={graphW + 35} y={graphH + 25} fill="#94a3b8" fontSize="8" textAnchor="end">Mass Number A</text>

              {/* Gridlines */}
              {[2, 4, 6, 8].map((eVal) => {
                const y = graphH + 10 - (eVal / 10.0) * graphH;
                return (
                  <g key={eVal}>
                    <line x1="35" y1={y} x2={graphW + 35} y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                    <text x="28" y={y + 3} fill="#64748b" fontSize="7" textAnchor="end">{eVal}</text>
                  </g>
                );
              })}

              {/* Binding Energy Curve Path */}
              {/* Characteristic curve: steep rise up to He-4 (7.07), rises to peak Fe-56 (8.8), then gentle decline to U-235 (7.6) */}
              <path
                d={`M 35,${graphH + 10} Q 40,${graphH + 10 - (7.07 / 10) * graphH} 80,${graphH + 10 - (8.6 / 10) * graphH} T 115,${graphH + 10 - (8.79 / 10) * graphH} Q 200,${graphH + 10 - (8.2 / 10) * graphH} 370,${graphH + 10 - (7.59 / 10) * graphH}`}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                className="drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
              />

              {/* Regions: Fusion & Fission Arrows */}
              <g transform="translate(45, 125)">
                <text x="0" y="0" fill="#38bdf8" fontSize="8" fontWeight="bold">← Nuclear Fusion</text>
              </g>
              <g transform="translate(230, 95)">
                <text x="0" y="0" fill="#f59e0b" fontSize="8" fontWeight="bold">Nuclear Fission →</text>
              </g>

              {/* Data points for key isotopes */}
              {ISOTOPES.map((it) => {
                const px = 35 + (it.A / 240) * graphW;
                const py = graphH + 10 - (it.EbPerA / 10.0) * graphH;
                const isCurrent = it.id === selectedIsoId;
                return (
                  <g key={it.id}>
                    <circle
                      cx={px}
                      cy={py}
                      r={isCurrent ? 6 : 4}
                      fill={isCurrent ? '#38bdf8' : it.isPeak ? '#facc15' : '#f43f5e'}
                      stroke="#ffffff"
                      strokeWidth={isCurrent ? 2 : 0.5}
                      className={isCurrent ? 'animate-pulse' : ''}
                    />
                    <text x={px} y={py - 8} fill={isCurrent ? '#38bdf8' : '#cbd5e1'} fontSize="7" fontWeight="bold" textAnchor="middle">
                      {it.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-300">
            <span>
              Mass Defect Δm: <strong className="text-rose-400 font-mono">{deltaM} u</strong>
            </span>
            <span>
              Total Binding Energy Eb: <strong className="text-cyan-400 font-mono">{totalEbMeV} MeV</strong>
            </span>
          </div>
        </div>

        {/* Details Card (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
              {iso.name} Nuclear Telemetry
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Atomic Number Z (Protons):</span>
                <span className="text-slate-200 font-bold">{iso.Z}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Neutron Number N (A - Z):</span>
                <span className="text-slate-200 font-bold">{iso.A - iso.Z}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Separated Nucleons Mass:</span>
                <span className="text-slate-200 font-bold">{totalNucleonMass.toFixed(4)} u</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Actual Isotopic Mass:</span>
                <span className="text-slate-200 font-bold">{iso.massU.toFixed(4)} u</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-1.5">
                <span>Eb per Nucleon:</span>
                <span className="text-rose-400 font-bold">{iso.EbPerA} MeV/nucleon</span>
              </div>
            </div>

            {/* Fission vs Fusion explanation */}
            <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl text-[11px] text-rose-300 leading-relaxed">
              <strong>Nuclear Stability Principle:</strong> Iron-56 sits at the very peak of the curve. Combining light nuclei (<em>Fusion</em>) or splitting heavy nuclei (<em>Fission</em>) both move products towards iron-56, releasing colossal nuclear energy (E = Δm · c^2)!
            </div>
          </div>
        </div>
      </div>

      {/* KCSE Exam Challenge */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            KCSE Binding Energy Calculation
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          The mass defect (Δm) of a Helium-4 nucleus is <strong>0.0304 u</strong>. Given 1 u ≡ 931.5 MeV, calculate the <strong>total binding energy</strong> in <strong>MeV</strong>.
        </p>

        <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 28.3"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-rose-500 w-36"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Check Energy
          </button>
          {quizStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-rose-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Correct! Eb = 0.0304 u × 931.5 MeV/u ≈ 28.3 MeV.
            </span>
          )}
          {quizStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Incorrect. Multiply mass defect in atomic mass units (u) by 931.5 MeV/u.
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
