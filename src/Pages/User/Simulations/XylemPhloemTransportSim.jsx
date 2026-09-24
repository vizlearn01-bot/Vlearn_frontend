import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown, RotateCcw, CheckCircle2, Info, Sparkles, Layers } from 'lucide-react';

export default function XylemPhloemTransportSim({ config = {}, onTelemetry }) {
  // Primary Variable: Selected Vascular Tissue
  const [selectedTissue, setSelectedTissue] = useState('xylem'); // 'xylem' | 'phloem'

  const handleSelectTissue = (tissue) => {
    setSelectedTissue(tissue);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'xylem_phloem_transport',
      tissue
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Vascular Transport: Xylem Vessels vs Phloem Sieve Tubes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Plant Transport (Structure & Functional Adaptations)
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelectedTissue('xylem')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Primary Variable Control: Tissue Toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleSelectTissue('xylem')}
          className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border font-bold text-sm transition-all shadow-md ${
            selectedTissue === 'xylem'
              ? 'bg-sky-500/20 border-sky-500 text-sky-300 ring-2 ring-sky-500/40 shadow-sky-950/40'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowUp className="w-4 h-4 text-sky-400" />
          <span>1. Xylem Vessels (Water & Mineral Salts)</span>
        </button>

        <button
          onClick={() => handleSelectTissue('phloem')}
          className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border font-bold text-sm transition-all shadow-md ${
            selectedTissue === 'phloem'
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/40 shadow-amber-950/40'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowUpDown className="w-4 h-4 text-amber-400" />
          <span>2. Phloem Sieve Tubes (Translocation of Sucrose)</span>
        </button>
      </div>

      {/* Main Interactive Stage: Tissue Microscopic Anatomy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10">
            {selectedTissue === 'xylem' ? (
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-sky-950/80 text-sky-300 border border-sky-700/50">
                Dead Lignified Hollow Tubes • Strictly Unidirectional (Upward)
              </span>
            ) : (
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-700/50">
                Living Cells with Sieve Plates • Bidirectional Translocation
              </span>
            )}
          </div>

          {/* SVG Diagram */}
          <svg viewBox="0 0 460 330" className="w-full max-w-[440px] h-auto select-none">
            <defs>
              <linearGradient id="ligninGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0369A1" />
              </linearGradient>
              <linearGradient id="phloemCellGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>

            {/* XYLEM VESSEL VIEW */}
            {selectedTissue === 'xylem' && (
              <g transform="translate(130, 20)">
                {/* Thick Lignified Left Wall */}
                <rect x="0" y="20" width="22" height="270" rx="3" fill="url(#ligninGrad)" stroke="#38BDF8" strokeWidth="2" />
                {/* Spiral Lignin Reinforcement rings */}
                {[50, 90, 130, 170, 210, 250].map((y, i) => (
                  <ellipse key={i} cx="100" cy={y} rx="88" ry="12" fill="none" stroke="#38BDF8" strokeWidth="3" strokeDasharray="6 3" opacity="0.8" />
                ))}

                {/* Right Lignified Wall */}
                <rect x="178" y="20" width="22" height="270" rx="3" fill="url(#ligninGrad)" stroke="#38BDF8" strokeWidth="2" />

                {/* Open Hollow Lumen (No cytoplasm, no end walls) */}
                <rect x="22" y="20" width="156" height="270" fill="#0369A1" fillOpacity="0.15" />

                {/* Upward Water Stream Streamlines */}
                <g className="animate-pulse">
                  {[45, 80, 120, 155].map((x, i) => (
                    <line key={i} x1={x} y1="270" x2={x} y2="40" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="8 6" />
                  ))}
                  {/* Water molecules (blue discs) moving up */}
                  <circle cx="80" cy="180" r="5" fill="#7DD3FC" />
                  <circle cx="120" cy="110" r="5" fill="#7DD3FC" />
                  <circle cx="60" cy="70" r="5" fill="#7DD3FC" />
                  <circle cx="140" cy="220" r="5" fill="#7DD3FC" />
                </g>

                {/* Upward Direction Indicator */}
                <g transform="translate(70, 20)">
                  <path d="M 30 15 L 30 -5 M 20 5 L 30 -5 L 40 5" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="30" y="-12" fill="#38BDF8" fontSize="10" fontWeight="extrabold" textAnchor="middle">
                    TO LEAVES (Transpiration Pull)
                  </text>
                </g>

                <text x="100" y="150" fill="#BAE6FD" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Hollow Lumen (Dead Vessel)
                </text>
                <text x="100" y="166" fill="#7DD3FC" fontSize="9" textAnchor="middle">
                  No Living Protoplasm
                </text>

                {/* Base label */}
                <text x="100" y="305" fill="#38BDF8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  FROM ROOTS (Osmotic Uptake)
                </text>
              </g>
            )}

            {/* PHLOEM SIEVE TUBE & COMPANION CELL VIEW */}
            {selectedTissue === 'phloem' && (
              <g transform="translate(60, 20)">
                {/* 1. COMPANION CELL (Left Column: x = 0 to 70) */}
                <g transform="translate(0, 30)">
                  <rect x="0" y="0" width="70" height="250" rx="6" fill="#78350F" fillOpacity="0.4" stroke="#F59E0B" strokeWidth="2" />
                  {/* Companion Cell Nucleus */}
                  <ellipse cx="35" cy="125" rx="18" ry="24" fill="#9333EA" stroke="#C084FC" strokeWidth="2" />
                  <text x="35" y="128" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    Nucleus
                  </text>
                  {/* Abundant Mitochondria (generating ATP for active loading) */}
                  <ellipse cx="35" cy="50" rx="10" ry="6" fill="#DC2626" stroke="#FCA5A5" strokeWidth="1.5" />
                  <text x="35" y="53" fill="#FFFFFF" fontSize="6.5" textAnchor="middle">ATP</text>
                  <ellipse cx="35" cy="200" rx="10" ry="6" fill="#DC2626" stroke="#FCA5A5" strokeWidth="1.5" />
                  <text x="35" y="203" fill="#FFFFFF" fontSize="6.5" textAnchor="middle">ATP</text>

                  <text x="35" y="-10" fill="#FBBF24" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    Companion Cell
                  </text>
                  <text x="35" y="265" fill="#FDE68A" fontSize="8" textAnchor="middle">
                    (Mitochondria & ATP)
                  </text>
                </g>

                {/* Plasmodesmata Channels connecting companion cell to sieve tube */}
                <line x1="70" y1="80" x2="85" y2="80" stroke="#F59E0B" strokeWidth="4" strokeDasharray="2 2" />
                <line x1="70" y1="150" x2="85" y2="150" stroke="#F59E0B" strokeWidth="4" strokeDasharray="2 2" />
                <line x1="70" y1="220" x2="85" y2="220" stroke="#F59E0B" strokeWidth="4" strokeDasharray="2 2" />

                {/* 2. SIEVE TUBE ELEMENT (Middle Column: x = 85 to 265) */}
                <g transform="translate(85, 30)">
                  {/* Sieve tube wall */}
                  <rect x="0" y="0" width="180" height="250" rx="6" fill="url(#phloemCellGrad)" fillOpacity="0.25" stroke="#F59E0B" strokeWidth="2" />

                  {/* Sieve Plate 1 (Top perforated cross-wall) */}
                  <g transform="translate(10, 40)">
                    <rect x="0" y="0" width="160" height="10" rx="3" fill="#F59E0B" />
                    {/* Sieve pores (perforations) */}
                    {[20, 50, 80, 110, 140].map((px, i) => (
                      <circle key={i} cx={px} cy="5" r="3.5" fill="#1E293B" />
                    ))}
                    <text x="80" y="-6" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Perforated Sieve Plate
                    </text>
                  </g>

                  {/* Sieve Plate 2 (Bottom perforated cross-wall) */}
                  <g transform="translate(10, 200)">
                    <rect x="0" y="0" width="160" height="10" rx="3" fill="#F59E0B" />
                    {[20, 50, 80, 110, 140].map((px, i) => (
                      <circle key={i} cx={px} cy="5" r="3.5" fill="#1E293B" />
                    ))}
                    <text x="80" y="22" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Sieve Plate Pores
                    </text>
                  </g>

                  {/* Bidirectional Organic Nutrient Flow (Sucrose + Amino Acids) */}
                  <g className="animate-pulse">
                    {/* Downward stream */}
                    <line x1="50" y1="60" x2="50" y2="180" stroke="#FBBF24" strokeWidth="2.5" strokeDasharray="6 4" />
                    <circle cx="50" cy="110" r="5" fill="#F59E0B" />
                    {/* Upward stream */}
                    <line x1="130" y1="180" x2="130" y2="60" stroke="#FBBF24" strokeWidth="2.5" strokeDasharray="6 4" />
                    <circle cx="130" cy="130" r="5" fill="#F59E0B" />
                  </g>

                  <text x="90" y="115" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Sieve Tube Lumen
                  </text>
                  <text x="90" y="130" fill="#FDE68A" fontSize="9" textAnchor="middle">
                    (Peripheral Cytoplasmic Strands)
                  </text>

                  <text x="90" y="-10" fill="#FBBF24" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    Sieve Tube Element
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Comparative Scientific Analysis Table & Features */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Structural Contrast: {selectedTissue.toUpperCase()}
            </h3>

            {selectedTissue === 'xylem' ? (
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-sky-300 block mb-0.5">Cellular State:</strong>
                  Dead cells at functional maturity; no nucleus, cytoplasm, or end walls, creating a low-resistance pipe.
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-sky-300 block mb-0.5">Lignified Cell Walls:</strong>
                  Lignin prevents inward collapse of vessels under enormous tension (negative hydrostatic pressure) generated by transpiration pull.
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-sky-300 block mb-0.5">Transported Substances:</strong>
                  Water and dissolved inorganic mineral salts (nitrates, phosphates, potassium).
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-amber-300 block mb-0.5">Cellular State:</strong>
                  Living cells with thin cellulose walls, peripheral cytoplasm, and perforated end-walls (sieve plates).
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-amber-300 block mb-0.5">Companion Cell Partnership:</strong>
                  Sieve tubes lack nuclei; adjacent companion cells carry out metabolic tasks and provide ATP for active phloem loading.
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-amber-300 block mb-0.5">Transported Substances:</strong>
                  Sucrose, amino acids, and plant hormones from source to sink.
                </div>
              </div>
            )}
          </div>

          {/* Quick Summary Comparison */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Summary Matrix:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-sky-300 block">Xylem:</span>
                • Unidirectional (Up)<br />
                • Dead hollow cells<br />
                • Thick lignified walls<br />
                • Passive transpiration pull
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-amber-300 block">Phloem:</span>
                • Bidirectional (Up & Down)<br />
                • Living sieve cells<br />
                • Thin cellulose walls<br />
                • Active mass flow (ATP)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
