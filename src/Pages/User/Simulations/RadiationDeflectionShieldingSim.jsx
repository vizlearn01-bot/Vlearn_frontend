import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, Sliders, ShieldCheck, Activity } from 'lucide-react';

const SOURCES = [
  { id: 'alpha', name: 'Alpha Source (Am-241)', desc: 'Helium nuclei (+2e, 4u), highly ionizing, stopped by paper' },
  { id: 'beta', name: 'Beta Source (Sr-90)', desc: 'Fast electrons (-e, 1/1836u), moderately ionizing, stopped by 3mm Al' },
  { id: 'gamma', name: 'Gamma Source (Co-60)', desc: 'High-energy photons (neutral, 0u), highly penetrating, lead required' },
  { id: 'mixed', name: 'Radium Mixed Source', desc: 'Emits all three radiations simultaneously' },
];

export default function RadiationDeflectionShieldingSim({ config = {}, onTelemetry }) {
  const [sourceKey, setSourceKey] = useState('mixed');
  const [fieldMode, setFieldMode] = useState('magnetic'); // 'none' | 'electric' | 'magnetic'
  const [fieldStrength, setFieldStrength] = useState(1.0); // 0 to 2.0 (arbitrary field factor)
  const [absorber, setAbsorber] = useState('none'); // 'none' | 'paper' | 'aluminum' | 'lead'
  const [userAns, setUserAns] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  const handleReset = () => {
    setSourceKey('mixed');
    setFieldMode('magnetic');
    setFieldStrength(1.0);
    setAbsorber('none');
    setQuizStatus(null);
    setUserAns('');
  };

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const clean = userAns.trim().toLowerCase();
    // Question: Which radiation is undeflected by electric and magnetic fields?
    if (clean.includes('gamma') || clean.includes('γ')) {
      setQuizStatus('correct');
      if (onTelemetry) onTelemetry('rad_deflection_quiz_correct', { problem: 'gamma_charge' });
    } else {
      setQuizStatus('incorrect');
    }
  };

  // Trajectory offsets:
  // Alpha (+2): slight upward or downward deflection (massive m = 4u)
  // Beta (-1): sharp large opposite deflection (light m = 1/1836u)
  // Gamma (0): zero deflection always!
  const alphaDeflection = fieldMode === 'none' ? 0 : (fieldMode === 'magnetic' ? -25 : -25) * fieldStrength;
  const betaDeflection = fieldMode === 'none' ? 0 : (fieldMode === 'magnetic' ? 65 : 65) * fieldStrength;

  // Transmission flags through barriers
  const alphaTransmitted = absorber === 'none';
  const betaTransmitted = absorber === 'none' || absorber === 'paper';
  const gammaTransmitted = absorber !== 'lead' || fieldStrength < 10; // lead attenuates heavily

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              PHYSICS FORM 4 • TOPIC 10
            </span>
            <span className="text-xs text-slate-400 font-mono">Nuclear Radiation Diagnostics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-rose-400" />
            Radiation Deflection & Shielding Penetration (α, β, γ) Simulator
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Apparatus
        </button>
      </div>

      {/* Source Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {SOURCES.map((s) => (
          <button
            key={s.id}
            onClick={() => setSourceKey(s.id)}
            className={`text-left p-3 rounded-2xl border transition-all ${
              sourceKey === s.id
                ? 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/50 text-white'
                : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-400'
            }`}
          >
            <div className="text-xs font-bold text-slate-200">{s.name}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
          </button>
        ))}
      </div>

      {/* Main Bench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Deflection & Penetration Chamber (Col 8) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300">
              Lead Collimator, Deflection Field & Absorber Sheets
            </span>
            <span className="font-mono text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded-lg">
              Barrier: {absorber.toUpperCase()}
            </span>
          </div>

          {/* SVG Radiation Chamber */}
          <div className="w-full h-[270px] bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
            <svg viewBox="0 0 540 240" className="w-full h-full">
              {/* Lead Collimator Block */}
              <rect x="20" y="80" width="40" height="80" fill="#475569" stroke="#64748b" rx="3" />
              <rect x="25" y="115" width="40" height="10" fill="#090d16" />
              <circle cx="28" cy="120" r="5" fill="#f43f5e" />
              <text x="40" y="70" fill="#94a3b8" fontSize="8" textAnchor="middle">Lead Block</text>

              {/* Deflection Field Region (x = 100 to 240) */}
              {fieldMode !== 'none' && (
                <g>
                  <rect x="110" y="40" width="130" height="160" fill="rgba(30, 41, 59, 0.4)" stroke="#334155" strokeDasharray="3 3" rx="8" />
                  <text x="175" y="35" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
                    {fieldMode === 'magnetic' ? 'B Field (Into Page ⊗)' : 'Electric Field (Top + / Bottom -)'}
                  </text>
                </g>
              )}

              {/* Absorber Barrier (x = 280) */}
              {absorber !== 'none' && (
                <g transform="translate(280, 30)">
                  <rect
                    x="0"
                    y="0"
                    width={absorber === 'paper' ? 4 : absorber === 'aluminum' ? 12 : 28}
                    height="180"
                    fill={absorber === 'paper' ? '#f8fafc' : absorber === 'aluminum' ? '#94a3b8' : '#334155'}
                    stroke="#cbd5e1"
                    rx="2"
                  />
                  <text x="10" y="195" fill="#cbd5e1" fontSize="8" textAnchor="middle" fontWeight="bold">
                    {absorber.toUpperCase()}
                  </text>
                </g>
              )}

              {/* Detector / Screen (x = 480) */}
              <line x1="480" y1="30" x2="480" y2="210" stroke="#22c55e" strokeWidth="4" />
              <text x="480" y="25" fill="#22c55e" fontSize="8" fontWeight="bold" textAnchor="middle">Detector Screen</text>

              {/* Alpha Particle Trajectory (+2e, heavy) */}
              {(sourceKey === 'alpha' || sourceKey === 'mixed') && (
                <g>
                  {alphaTransmitted ? (
                    <path
                      d={`M 65,120 Q 170,${120 + alphaDeflection * 0.5} 280,${120 + alphaDeflection} L 480,${120 + alphaDeflection * 1.6}`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                    />
                  ) : (
                    <path
                      d={`M 65,120 Q 170,${120 + alphaDeflection * 0.5} 280,${120 + alphaDeflection}`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                    />
                  )}
                  <text x="140" y="100" fill="#f59e0b" fontSize="9" fontWeight="bold">α (+2e)</text>
                  {alphaTransmitted && (
                    <circle cx="480" cy={120 + alphaDeflection * 1.6} r="4" fill="#f59e0b" />
                  )}
                </g>
              )}

              {/* Beta Particle Trajectory (-e, light) */}
              {(sourceKey === 'beta' || sourceKey === 'mixed') && (
                <g>
                  {betaTransmitted ? (
                    <path
                      d={`M 65,120 Q 170,${120 + betaDeflection * 0.5} 280,${120 + betaDeflection} L 480,${120 + betaDeflection * 1.5}`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                    />
                  ) : (
                    <path
                      d={`M 65,120 Q 170,${120 + betaDeflection * 0.5} 280,${120 + betaDeflection}`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                    />
                  )}
                  <text x="140" y="175" fill="#38bdf8" fontSize="9" fontWeight="bold">β⁻ (-e)</text>
                  {betaTransmitted && (
                    <circle cx="480" cy={120 + betaDeflection * 1.5} r="4" fill="#38bdf8" />
                  )}
                </g>
              )}

              {/* Gamma Ray Trajectory (neutral photon, straight) */}
              {(sourceKey === 'gamma' || sourceKey === 'mixed') && (
                <g>
                  {gammaTransmitted ? (
                    <line x1="65" y1="120" x2="480" y2="120" stroke="#4ade80" strokeWidth="2.5" strokeDasharray="5 2" />
                  ) : (
                    <line x1="65" y1="120" x2="280" y2="120" stroke="#4ade80" strokeWidth="2.5" strokeDasharray="5 2" />
                  )}
                  <text x="340" y="115" fill="#4ade80" fontSize="9" fontWeight="bold">γ (0)</text>
                  {gammaTransmitted && (
                    <circle cx="480" cy="120" r="4" fill="#4ade80" />
                  )}
                </g>
              )}
            </svg>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-300">
            <span>
              Alpha Penetration: <strong className={alphaTransmitted ? 'text-emerald-400' : 'text-rose-400'}>
                {alphaTransmitted ? 'Transmitted' : 'BLOCKED by barrier'}
              </strong>
            </span>
            <span>
              Beta Penetration: <strong className={betaTransmitted ? 'text-emerald-400' : 'text-rose-400'}>
                {betaTransmitted ? 'Transmitted' : 'BLOCKED by barrier'}
              </strong>
            </span>
            <span>
              Gamma Penetration: <strong className={gammaTransmitted ? 'text-emerald-400' : 'text-rose-400'}>
                {gammaTransmitted ? 'Transmitted' : 'Attenuated'}
              </strong>
            </span>
          </div>
        </div>

        {/* Controls (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-rose-400" /> Apparatus Controls
            </div>

            {/* Deflection Field Type */}
            <div>
              <div className="text-xs text-slate-400 mb-1.5">Deflection Field Type:</div>
              <div className="grid grid-cols-3 gap-1">
                {['none', 'magnetic', 'electric'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFieldMode(f)}
                    className={`py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                      fieldMode === f ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Absorber Barrier */}
            <div>
              <div className="text-xs text-slate-400 mb-1.5">Insert Absorber Barrier:</div>
              <div className="grid grid-cols-2 gap-1.5">
                {['none', 'paper', 'aluminum', 'lead'].map((ab) => (
                  <button
                    key={ab}
                    onClick={() => setAbsorber(ab)}
                    className={`py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                      absorber === ab ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {ab}
                  </button>
                ))}
              </div>
            </div>

            {/* Scientific Summary */}
            <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl text-[11px] text-rose-300 leading-relaxed">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400 inline mr-1" />
              <strong>Deflection vs Mass:</strong> Alpha particles have twice the charge of beta, but are 7,300 times more massive! Hence, alpha particles deflect only slightly, while beta particles deflect sharply in the opposite direction.
            </div>
          </div>
        </div>
      </div>

      {/* KCSE Exam Challenge */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            KCSE Nuclear Physics Question
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          Name the nuclear emission that experiences <strong>zero deflection</strong> in both electric and magnetic fields and requires thick lead to attenuate.
        </p>

        <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="e.g. Gamma rays"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-rose-500 w-44"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Submit Answer
          </button>
          {quizStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Correct! Gamma rays carry zero electric charge (photons) and possess the highest penetrating power.
            </span>
          )}
          {quizStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Incorrect. Consider which emission consists of neutral electromagnetic photons.
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
