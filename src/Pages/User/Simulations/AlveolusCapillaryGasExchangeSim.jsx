import React, { useState } from 'react';
import { Wind, RotateCcw, Sparkles, CheckCircle2, Info, ArrowRight, Play, Pause } from 'lucide-react';

export default function AlveolusCapillaryGasExchangeSim({ config = {}, onTelemetry }) {
  // Primary Variable: Blood Perfusion Flow State (Active Flow vs Inspection Pause)
  const [isFlowing, setIsFlowing] = useState(true);
  const [focusGas, setFocusGas] = useState('both'); // 'both' | 'oxygen' | 'co2'

  const handleToggleFlow = () => {
    setIsFlowing(!isFlowing);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'alveolus_capillary_gas_exchange',
      flowToggled: !isFlowing
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
            <Wind className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Microscopic Gas Exchange at the Alveolus-Capillary Interface
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Animal Gaseous Exchange (Diffusion Across Respiratory Membrane)
            </p>
          </div>
        </div>
        <button
          onClick={() => { setIsFlowing(true); setFocusGas('both'); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Primary Variable Control: Blood Perfusion & Gas Focus */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Capillary Perfusion:
          </span>
          <button
            onClick={handleToggleFlow}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition shadow-md ${
              isFlowing
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {isFlowing ? (
              <>
                <Pause className="w-4 h-4" /> Pause Capillary Stream
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Resume Capillary Stream
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 hidden sm:inline mr-1">Gas Tracking:</span>
          {['both', 'oxygen', 'co2'].map((g) => (
            <button
              key={g}
              onClick={() => setFocusGas(g)}
              className={`px-3 py-1.5 rounded-lg border transition ${
                focusGas === g
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {g === 'both' ? 'Both Gases (O₂ & CO₂)' : g === 'oxygen' ? 'Oxygen (O₂) Only' : 'Carbon Dioxide (CO₂) Only'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Viewport: Alveolus & Capillary Microscopic Cut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-cyan-300">
              Diffusion Barrier &lt; 0.5 µm (Squamous Epithelium + Endothelium)
            </span>
          </div>

          {/* SVG Diagram: Alveolus Cavity & Capillary Loop */}
          <svg viewBox="0 0 500 320" className="w-full max-w-[480px] h-auto select-none my-auto">
            <defs>
              <linearGradient id="alveolusAirGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0E7490" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#083344" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* ALVEOLUS SAC CAVITY (Left & Center: x = 20 to 300) */}
            <g transform="translate(30, 30)">
              {/* Alveolar Cavity Boundary */}
              <path
                d="M 20 20 C 120 0, 240 20, 280 120 C 300 180, 250 250, 150 250 C 40 250, 0 180, 10 100 Z"
                fill="url(#alveolusAirGrad)"
                stroke="#06B6D4"
                strokeWidth="2.5"
              />

              {/* Single-Cell Thick Squamous Epithelial Lining */}
              <path
                d="M 20 20 C 120 0, 240 20, 280 120 C 300 180, 250 250, 150 250"
                stroke="#67E8F9"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                opacity="0.8"
              />
              <text x="140" y="70" fill="#E0F2FE" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                ALVEOLAR AIR SAC
              </text>
              <text x="140" y="88" fill="#67E8F9" fontSize="9" textAnchor="middle">
                Inhaled Air: High PO₂ (104 mmHg) • Low PCO₂ (40 mmHg)
              </text>

              {/* Thin Moisture Film on Inner Lining */}
              <text x="140" y="115" fill="#38BDF8" fontSize="8.5" opacity="0.8" textAnchor="middle">
                (Moist Surfactant Film for O₂ Dissolution)
              </text>
            </g>

            {/* PULMONARY BLOOD CAPILLARY (Sweeps around the right side of the alveolus) */}
            <g transform="translate(30, 30)">
              {/* Outer capillary wall */}
              <path
                d="M 120 -10 C 260 -10, 340 30, 350 140 C 360 240, 260 280, 140 280"
                stroke="#E2E8F0"
                strokeWidth="38"
                fill="none"
                strokeLinecap="round"
                opacity="0.15"
              />

              {/* Capillary Endothelial Single-Cell Walls */}
              <path
                d="M 120 -10 C 260 -10, 340 30, 350 140 C 360 240, 260 280, 140 280"
                stroke="#475569"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="6 3"
              />

              {/* ERYTHROCYTES (RBCs) TRAVELING ALONG CAPILLARY */}
              {/* RBC 1: Incoming (Deoxygenated Blue: x=140, y=0) */}
              <g transform="translate(150, 5)" className={isFlowing ? 'animate-pulse' : ''}>
                <ellipse cx="0" cy="0" rx="14" ry="10" fill="#1E40AF" stroke="#60A5FA" strokeWidth="2" />
                <text x="0" y="3" fill="#FFFFFF" fontSize="7.5" fontWeight="bold" textAnchor="middle">Deox RBC</text>
              </g>

              {/* RBC 2: Mid-exchange (Transitioning: x=330, y=120) */}
              <g transform="translate(325, 120)" className={isFlowing ? 'animate-pulse' : ''}>
                <ellipse cx="0" cy="0" rx="14" ry="10" fill="#9333EA" stroke="#C084FC" strokeWidth="2" />
                <text x="0" y="3" fill="#FFFFFF" fontSize="7.5" fontWeight="bold" textAnchor="middle">Binding O₂</text>
              </g>

              {/* RBC 3: Outgoing (Oxygenated Bright Red: x=170, y=270) */}
              <g transform="translate(170, 265)" className={isFlowing ? 'animate-pulse' : ''}>
                <ellipse cx="0" cy="0" rx="14" ry="10" fill="#DC2626" stroke="#F87171" strokeWidth="2" />
                <text x="0" y="3" fill="#FFFFFF" fontSize="7.5" fontWeight="bold" textAnchor="middle">Oxy RBC</text>
              </g>

              {/* Capillary Inflow & Outflow Labels */}
              <text x="80" y="10" fill="#60A5FA" fontSize="8.5" fontWeight="bold">
                From Pulm Artery (Blue) →
              </text>
              <text x="80" y="275" fill="#EF4444" fontSize="8.5" fontWeight="bold">
                → To Pulm Vein (Red)
              </text>
            </g>

            {/* GAS DIFFUSION ARROWS ACROSS INTERFACE */}
            {/* OXYGEN DIFFUSION: Alveolus -> Blood */}
            {(focusGas === 'both' || focusGas === 'oxygen') && (
              <g className="animate-pulse">
                <path d="M 230 110 L 290 95" stroke="#38BDF8" strokeWidth="3" markerEnd="url(#arrowBlue)" />
                <path d="M 240 140 L 300 135" stroke="#38BDF8" strokeWidth="3" markerEnd="url(#arrowBlue)" />
                <rect x="235" y="75" width="60" height="18" rx="4" fill="#0369A1" />
                <text x="265" y="87" fill="#E0F2FE" fontSize="8" fontWeight="bold" textAnchor="middle">
                  O₂ Dffusion →
                </text>
              </g>
            )}

            {/* CARBON DIOXIDE DIFFUSION: Blood -> Alveolus */}
            {(focusGas === 'both' || focusGas === 'co2') && (
              <g className="animate-pulse">
                <path d="M 310 160 L 250 175" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrowAmber)" />
                <rect x="250" y="190" width="65" height="18" rx="4" fill="#78350F" />
                <text x="282" y="202" fill="#FDE68A" fontSize="8" fontWeight="bold" textAnchor="middle">
                  ← CO₂ Diffusion
                </text>
              </g>
            )}
          </svg>

          {/* Partial Pressure Gradient Strip */}
          <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-0.5">Oxygen Gradient (ΔP = 64 mmHg):</span>
              <span className="text-slate-300 text-[11px]">Alveolus (104 mmHg) → Capillary (40 mmHg)</span>
            </div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-amber-400 font-bold block mb-0.5">Carbon Dioxide Gradient (ΔP = 5 mmHg):</span>
              <span className="text-slate-300 text-[11px]">Capillary (45 mmHg) → Alveolus (40 mmHg)</span>
            </div>
          </div>
        </div>

        {/* Fick's Law & Structural Adaptations Card */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Alveolar Adaptations for Rapid Diffusion
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <strong className="text-cyan-300 block mb-0.5">1. Minimal Diffusion Distance (&lt; 0.5 µm):</strong>
                Both alveolar wall and capillary endothelium consist of a single layer of flattened squamous epithelial cells.
              </div>
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <strong className="text-cyan-300 block mb-0.5">2. Moist Epithelial Lining:</strong>
                Gases must dissolve in fluid before diffusing across living phospholipid bilayer membranes.
              </div>
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <strong className="text-cyan-300 block mb-0.5">3. Continuous Steep Gradient:</strong>
                Constant capillary blood flow continuously removes oxygenated blood and brings fresh deoxygenated blood.
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Pulmonary Surfactant:
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Specialized type II alveolar cells secrete surfactant (a phospholipid lipoprotein) that lowers the surface tension of water, preventing microscopic alveoli from collapsing during exhalation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
