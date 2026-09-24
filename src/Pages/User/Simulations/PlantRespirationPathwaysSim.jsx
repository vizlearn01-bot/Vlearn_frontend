import React, { useState } from 'react';
import { Wind, Zap, RotateCcw, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Info } from 'lucide-react';

export default function PlantRespirationPathwaysSim({ config = {}, onTelemetry }) {
  // Primary Variable: Pathway Selection ('aerobic' vs 'anaerobic')
  const [selectedPathway, setSelectedPathway] = useState('aerobic');

  const handleSelectPathway = (mode) => {
    setSelectedPathway(mode);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'plant_respiration_pathways',
      pathway: mode
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Plant Respiration Pathways: Aerobic vs Anaerobic (Fermentation)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Plant Gaseous Exchange & Respiration
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelectedPathway('aerobic')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Primary Variable Control: Pathway Toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleSelectPathway('aerobic')}
          className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border font-bold text-xs sm:text-sm transition shadow-md ${
            selectedPathway === 'aerobic'
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40 shadow-emerald-950/40'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wind className="w-4 h-4 text-emerald-400" />
          <span>1. Aerobic Respiration (+ Oxygen O₂)</span>
        </button>

        <button
          onClick={() => handleSelectPathway('anaerobic')}
          className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border font-bold text-xs sm:text-sm transition shadow-md ${
            selectedPathway === 'anaerobic'
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/40 shadow-rose-950/40'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>2. Anaerobic Fermentation (Waterlogged / No O₂)</span>
        </button>
      </div>

      {/* Main Interactive Stage: Biochemical Compartment Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Energy Yield Gauge Header */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border ${
              selectedPathway === 'aerobic'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-600/40'
                : 'bg-rose-950/90 text-rose-300 border-rose-600/40'
            }`}>
              ATP Yield: {selectedPathway === 'aerobic' ? '38 ATP (High Efficiency • 2880 kJ)' : '2 ATP (Low Efficiency • 150 kJ)'}
            </span>
          </div>

          {/* SVG Diagram */}
          <svg viewBox="0 0 500 320" className="w-full max-w-[480px] h-auto select-none">
            <defs>
              <linearGradient id="mitoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#9A3412" />
              </linearGradient>
            </defs>

            {/* Plant Cell Outer Cytoplasm Box */}
            <rect x="20" y="20" width="460" height="270" rx="20" fill="#042F2E" fillOpacity="0.4" stroke="#0D9488" strokeWidth="2.5" />
            <text x="45" y="45" fill="#5EEAD4" fontSize="11" fontWeight="bold">
              Plant Cell Cytoplasm (Cytosol)
            </text>

            {/* STAGE 1: GLYCOLYSIS (Common to Both Pathways in Cytoplasm) */}
            <g transform="translate(45, 80)">
              {/* Glucose Input */}
              <rect x="0" y="20" width="80" height="35" rx="8" fill="#3B82F6" stroke="#93C5FD" strokeWidth="2" />
              <text x="40" y="42" fill="#FFFFFF" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                Glucose (6C)
              </text>

              {/* Glycolysis Process Arrow */}
              <path d="M 85 37 L 150 37" stroke="#38BDF8" strokeWidth="3" markerEnd="url(#arrow)" />
              <text x="117" y="28" fill="#7DD3FC" fontSize="9" fontWeight="bold" textAnchor="middle">
                Glycolysis
              </text>
              <text x="117" y="55" fill="#FBBF24" fontSize="9" fontWeight="bold" textAnchor="middle">
                +2 ATP Net
              </text>

              {/* Pyruvate Product (3C) */}
              <rect x="155" y="20" width="80" height="35" rx="8" fill="#8B5CF6" stroke="#C4B5FD" strokeWidth="2" />
              <text x="195" y="42" fill="#FFFFFF" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                Pyruvate (3C)
              </text>
            </g>

            {selectedPathway === 'aerobic' ? (
              /* AEROBIC PATHWAY: Entering Mitochondrion */
              <g transform="translate(240, 70)">
                {/* Pyruvate entering Mitochondrion arrow */}
                <path d="M 10 47 L 50 47" stroke="#34D399" strokeWidth="3" strokeDasharray="4 2" />
                <text x="30" y="38" fill="#34D399" fontSize="8" fontWeight="bold" textAnchor="middle">
                  + O₂
                </text>

                {/* MITOCHONDRION ORGANELLE (Bean shape) */}
                <ellipse cx="140" cy="110" rx="95" ry="60" fill="url(#mitoGrad)" stroke="#FB923C" strokeWidth="3" />
                {/* Inner Cristae Folds */}
                <path
                  d="M 65 110 C 85 90, 85 130, 105 110 C 125 90, 125 130, 145 110 C 165 90, 165 130, 185 110 C 205 90, 205 130, 215 110"
                  fill="none"
                  stroke="#FED7AA"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <text x="140" y="80" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Mitochondrion
                </text>
                <text x="140" y="95" fill="#FDBA74" fontSize="9" textAnchor="middle">
                  Krebs Cycle & Electron Transport
                </text>

                {/* Aerobic End Products */}
                <g transform="translate(60, 130)">
                  <rect x="0" y="0" width="160" height="30" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                  <text x="80" y="19" fill="#38BDF8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    6 CO₂ + 6 H₂O + 36 ATP
                  </text>
                </g>

                {/* Total Aerobic ATP Explosion */}
                <g transform="translate(100, 175)">
                  <rect x="0" y="0" width="80" height="26" rx="6" fill="#F59E0B" stroke="#FEF08A" strokeWidth="2" className="animate-pulse" />
                  <text x="40" y="17" fill="#000000" fontSize="11" fontWeight="extrabold" textAnchor="middle">
                    Total: 38 ATP
                  </text>
                </g>
              </g>
            ) : (
              /* ANAEROBIC FERMENTATION: Stays in Cytoplasm */
              <g transform="translate(240, 70)">
                {/* Mitochondria bypassed arrow down in cytoplasm */}
                <path d="M 0 47 C 30 47, 40 120, 70 120" stroke="#F43F5E" strokeWidth="3" fill="none" strokeDasharray="4 2" />
                <text x="40" y="75" fill="#FDA4AF" fontSize="8.5" fontWeight="bold">
                  No Oxygen (O₂)
                </text>

                {/* Mitochondrion Inactive Ghost */}
                <ellipse cx="140" cy="50" rx="60" ry="30" fill="#334155" stroke="#475569" strokeWidth="1.5" opacity="0.3" />
                <text x="140" y="54" fill="#94A3B8" fontSize="8" textAnchor="middle">
                  Mitochondria Inactive
                </text>

                {/* Fermentation Reaction in Cytoplasm */}
                <g transform="translate(75, 100)">
                  <rect x="0" y="0" width="150" height="65" rx="10" fill="#881337" fillOpacity="0.6" stroke="#F43F5E" strokeWidth="2" />
                  <text x="75" y="20" fill="#FDA4AF" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    Alcoholic Fermentation
                  </text>
                  <text x="75" y="38" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                    2 Ethanol (C₂H₅OH)
                  </text>
                  <text x="75" y="54" fill="#CBD5E1" fontSize="9" textAnchor="middle">
                    + 2 CO₂ Gas (Only +2 ATP Total)
                  </text>
                </g>

                {/* Toxic warning label */}
                <g transform="translate(75, 175)">
                  <rect x="0" y="0" width="150" height="24" rx="6" fill="#450A0A" stroke="#EF4444" strokeWidth="1.5" />
                  <text x="75" y="16" fill="#FCA5A5" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    ⚠️ Ethanol is toxic to root tissues
                  </text>
                </g>
              </g>
            )}
          </svg>

          {/* Chemical Word Equation Bar */}
          <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center text-xs font-mono select-none">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              {selectedPathway === 'aerobic' ? 'Aerobic Chemical Equation' : 'Plant Anaerobic Fermentation Equation'}
            </span>
            {selectedPathway === 'aerobic' ? (
              <span className="text-emerald-300 font-bold sm:text-sm">
                C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + 38 ATP (~2880 kJ)
              </span>
            ) : (
              <span className="text-rose-300 font-bold sm:text-sm">
                C₆H₁₂O₆ → 2 C₂H₅OH (Ethanol) + 2 CO₂ + 2 ATP (~150 kJ)
              </span>
            )}
          </div>
        </div>

        {/* Biological Comparisons Card */}
        <div className="lg:col-span-4 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Energetics & Ecological Rationale
            </h3>

            {selectedPathway === 'aerobic' ? (
              <div className="space-y-2 text-xs text-slate-300">
                <p>
                  <strong className="text-white">Complete Combustion:</strong> Glucose is broken down completely into harmless inorganic compounds (carbon dioxide and water).
                </p>
                <p>
                  <strong className="text-emerald-300 font-semibold">Maximum Energy:</strong> Yields 38 ATP per glucose molecule, powering active transport of ions in roots and rapid cellular growth.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-300">
                <p>
                  <strong className="text-white">Incomplete Breakdown:</strong> Most energy remains locked inside the chemical bonds of the ethanol molecules.
                </p>
                <p>
                  <strong className="text-rose-300 font-semibold">Root Waterlogging:</strong> In flooded soils, air spaces fill with water; roots switch to fermentation. Prolonged ethanol accumulation kills root cells, causing root rot.
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Comparison Takeaway:
            </h4>
            <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>• Aerobic produces <strong className="text-emerald-300">19× more ATP</strong> per glucose than anaerobic!</div>
              <div>• Animal anaerobic produces <strong className="text-amber-300">lactic acid</strong>, whereas plant anaerobic produces <strong className="text-rose-300">ethanol + CO₂</strong>.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
