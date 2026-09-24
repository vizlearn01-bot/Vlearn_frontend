import React, { useState } from 'react';
import { Wind, RotateCcw, Sparkles, CheckCircle2, Info, ArrowDown, ArrowUp } from 'lucide-react';

export default function HumanRespiratorySystemSim({ config = {}, onTelemetry }) {
  // Primary Variable: Breathing Phase ('inhalation' vs 'exhalation')
  const [phase, setPhase] = useState('inhalation');

  const handleTogglePhase = (newPhase) => {
    setPhase(newPhase);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'human_respiratory_system',
      phase: newPhase
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Human Ventilation Mechanism: Inhalation & Exhalation
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Animal Gaseous Exchange (Thoracic Volume & Boyle's Law)
            </p>
          </div>
        </div>
        <button
          onClick={() => setPhase('inhalation')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Primary Variable Control: Inhalation / Exhalation Toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleTogglePhase('inhalation')}
          className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border font-bold text-xs sm:text-sm transition-all shadow-md ${
            phase === 'inhalation'
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/40 shadow-cyan-950/40'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowDown className="w-4 h-4 text-cyan-400" />
          <span>1. Inhalation (Inspiration — Breathe IN)</span>
        </button>

        <button
          onClick={() => handleTogglePhase('exhalation')}
          className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border font-bold text-xs sm:text-sm transition-all shadow-md ${
            phase === 'exhalation'
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/40 shadow-amber-950/40'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowUp className="w-4 h-4 text-amber-400" />
          <span>2. Exhalation (Expiration — Breathe OUT)</span>
        </button>
      </div>

      {/* Main Simulation Viewport: Thoracic Cavity & Lung Mechanics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
              phase === 'inhalation'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600/40'
                : 'bg-amber-950/80 text-amber-300 border-amber-600/40'
            }`}>
              {phase === 'inhalation'
                ? 'Thoracic Volume Expands • Alveolar Pressure Drops below Atm P (-2 mmHg)'
                : 'Thoracic Volume Decreases • Alveolar Pressure Rises above Atm P (+2 mmHg)'}
            </span>
          </div>

          {/* SVG Diagram: Human Thoracic Cage & Diaphragm */}
          <svg viewBox="0 0 460 320" className="w-full max-w-[420px] h-auto select-none my-auto">
            <defs>
              <linearGradient id="lungGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
            </defs>

            {/* TRACHEA (Windpipe with cartilage rings) */}
            <g transform="translate(210, 10)">
              <rect x="0" y="0" width="40" height="65" rx="4" fill="#334155" stroke="#64748B" strokeWidth="2" />
              {/* C-shaped cartilage rings */}
              {[12, 26, 40, 54].map((ry, i) => (
                <path key={i} d={`M 0 ${ry} C 15 ${ry + 4}, 25 ${ry + 4}, 40 ${ry}`} stroke="#94A3B8" strokeWidth="2" fill="none" />
              ))}
              <text x="20" y="-3" fill="#CBD5E1" fontSize="9" fontWeight="bold" textAnchor="middle">
                Trachea
              </text>

              {/* Air Flow Direction Arrows */}
              {phase === 'inhalation' ? (
                <g className="animate-pulse">
                  <path d="M 20 5 L 20 55" stroke="#38BDF8" strokeWidth="3" markerEnd="url(#arrow)" />
                  <text x="50" y="35" fill="#38BDF8" fontSize="8.5" fontWeight="bold">Air In ↓</text>
                </g>
              ) : (
                <g className="animate-pulse">
                  <path d="M 20 55 L 20 5" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrow)" />
                  <text x="50" y="35" fill="#F59E0B" fontSize="8.5" fontWeight="bold">Air Out ↑</text>
                </g>
              )}
            </g>

            {/* BRONCHI BIFURCATION */}
            <path d="M 210 75 L 160 110 M 250 75 L 300 110" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />

            {/* THORACIC RIBCAGE & LUNGS */}
            <g transform="translate(50, 60)">
              {/* Ribcage Outline */}
              <ellipse
                cx="180"
                cy="120"
                rx={phase === 'inhalation' ? 175 : 150}
                ry={phase === 'inhalation' ? 115 : 100}
                fill="#0F172A"
                stroke="#475569"
                strokeWidth="2.5"
                strokeDasharray="6 3"
                className="transition-all duration-500"
              />

              {/* Rib indicators moving up/out vs down/in */}
              <text x="180" y="25" fill="#94A3B8" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                {phase === 'inhalation' ? 'Ribs Move UP and OUT →' : '← Ribs Move DOWN and IN'}
              </text>

              {/* LEFT LUNG (Anatomical Right = Viewer Left) */}
              <ellipse
                cx="110"
                cy="120"
                rx={phase === 'inhalation' ? 62 : 48}
                ry={phase === 'inhalation' ? 75 : 62}
                fill="url(#lungGrad)"
                fillOpacity="0.85"
                stroke="#FB7185"
                strokeWidth="2"
                className="transition-all duration-500"
              />
              <text x="110" y="125" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                Right Lung
              </text>

              {/* RIGHT LUNG (Viewer Right) */}
              <ellipse
                cx="250"
                cy="120"
                rx={phase === 'inhalation' ? 62 : 48}
                ry={phase === 'inhalation' ? 75 : 62}
                fill="url(#lungGrad)"
                fillOpacity="0.85"
                stroke="#FB7185"
                strokeWidth="2"
                className="transition-all duration-500"
              />
              <text x="250" y="125" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                Left Lung
              </text>

              {/* DIAPHRAGM MUSCLE AT BASE */}
              {phase === 'inhalation' ? (
                // Inhalation: Diaphragm contracts and FLATTENS downward
                <g className="transition-all duration-500">
                  <path
                    d="M 30 215 C 100 225, 260 225, 330 215"
                    stroke="#38BDF8"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <text x="180" y="242" fill="#38BDF8" fontSize="10" fontWeight="extrabold" textAnchor="middle">
                    Diaphragm Contracts & Flattens Downward ↓
                  </text>
                </g>
              ) : (
                // Exhalation: Diaphragm relaxes and DOMES upward into chest
                <g className="transition-all duration-500">
                  <path
                    d="M 40 215 C 100 165, 260 165, 320 215"
                    stroke="#F59E0B"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <text x="180" y="195" fill="#F59E0B" fontSize="10" fontWeight="extrabold" textAnchor="middle">
                    Diaphragm Relaxes & Domes Upward ↑
                  </text>
                </g>
              )}
            </g>
          </svg>

          {/* Real-Time Mechanics Strip */}
          <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Thoracic Volume: <strong className={phase === 'inhalation' ? 'text-cyan-300' : 'text-amber-300'}>
                {phase === 'inhalation' ? 'INCREASES (+500 ml)' : 'DECREASES (-500 ml)'}
              </strong>
            </span>
            <span className="font-mono text-white font-bold">
              Pressure Gradient: {phase === 'inhalation' ? 'P(alveoli) < P(atm)' : 'P(alveoli) > P(atm)'}
            </span>
          </div>
        </div>

        {/* Anatomical Action Sequence Card */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Muscular Sequence: {phase.toUpperCase()}
            </h3>

            {phase === 'inhalation' ? (
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-cyan-300 block mb-0.5">1. Intercostal Muscles:</strong>
                  External intercostals contract, pulling the ribs upwards and outwards.
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-cyan-300 block mb-0.5">2. Diaphragm Muscle:</strong>
                  Contracts and moves downwards from dome to flat sheet.
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-cyan-300 block mb-0.5">3. Pressure Inrush:</strong>
                  Thoracic volume expands; intra-pulmonary pressure falls below atmospheric pressure, drawing in tidal air.
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-amber-300 block mb-0.5">1. Intercostal Muscles:</strong>
                  External intercostals relax, allowing ribs to fall downwards and inwards by gravity.
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-amber-300 block mb-0.5">2. Diaphragm Muscle:</strong>
                  Relaxes and curves upward into its resting convex dome shape.
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-amber-300 block mb-0.5">3. Elastic Recoil Outflow:</strong>
                  Thoracic volume shrinks; intra-pulmonary pressure rises above atmospheric pressure, forcing air out.
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Physics Foundation (Boyle's Law):
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              At constant body temperature, pressure and volume of a gas are inversely proportional: <span className="font-mono text-white">P ∝ 1/V</span>. Expanding lung volume automatically generates the vacuum suction that powers breathing!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
