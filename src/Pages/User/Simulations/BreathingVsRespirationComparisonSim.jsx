import React, { useState } from 'react';
import { Wind, Zap, RotateCcw, Sparkles, CheckCircle2, Info, ArrowRight, Layers } from 'lucide-react';

export default function BreathingVsRespirationComparisonSim({ config = {}, onTelemetry }) {
  // Primary Variable: Process Comparison Mode ('matrix' | 'breathing' | 'respiration')
  const [viewMode, setViewMode] = useState('matrix');

  const handleSelectMode = (mode) => {
    setViewMode(mode);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'breathing_vs_cellular_respiration',
      mode
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Layers className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Breathing vs Cellular Respiration: Key Differences
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Animal Gaseous Exchange & Respiration (Physical vs Biochemical)
            </p>
          </div>
        </div>
        <button
          onClick={() => setViewMode('matrix')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Primary Variable Control: View Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          onClick={() => handleSelectMode('matrix')}
          className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold text-xs sm:text-sm transition ${
            viewMode === 'matrix'
              ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/40'
              : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Side-by-Side Comparison Matrix</span>
        </button>

        <button
          onClick={() => handleSelectMode('breathing')}
          className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold text-xs sm:text-sm transition ${
            viewMode === 'breathing'
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/40'
              : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wind className="w-4 h-4 text-cyan-400" />
          <span>2. Focus: Physical Breathing (Ventilation)</span>
        </button>

        <button
          onClick={() => handleSelectMode('respiration')}
          className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold text-xs sm:text-sm transition ${
            viewMode === 'respiration'
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/40'
              : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>3. Focus: Biochemical Cellular Respiration</span>
        </button>
      </div>

      {/* Main Simulation Viewport: Visual Macro-to-Micro Concept Model */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-indigo-300">
              {viewMode === 'matrix'
                ? 'Extracellular Physical Mechanics vs Intracellular Chemical Oxidation'
                : viewMode === 'breathing'
                ? 'Ventilation: Organ-Level Air Movement'
                : 'Respiration: Molecular Energy Synthesis'}
            </span>
          </div>

          {/* SVG Diagram: Macro Organism Breathing vs Micro Mitochondrion Respiration */}
          <svg viewBox="0 0 500 320" className="w-full max-w-[480px] h-auto select-none my-auto">
            {/* LEFT HALF: PHYSICAL BREATHING (Macro Level) */}
            <g
              transform="translate(20, 40)"
              className={`transition-opacity duration-300 ${
                viewMode === 'respiration' ? 'opacity-25' : 'opacity-100'
              }`}
            >
              {/* Macro Thorax Box */}
              <rect x="0" y="0" width="200" height="230" rx="16" fill="#083344" fillOpacity="0.4" stroke="#06B6D4" strokeWidth="2" />
              <text x="100" y="30" fill="#67E8F9" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                BREATHING (Ventilation)
              </text>
              <text x="100" y="46" fill="#A5F3FC" fontSize="8.5" textAnchor="middle">
                Physical / Extracellular / Organ Level
              </text>

              {/* Lungs Graphic */}
              <g transform="translate(45, 65)">
                <path d="M 55 0 L 55 25 M 35 25 L 75 25" stroke="#94A3B8" strokeWidth="3" />
                {/* Left lung */}
                <ellipse cx="30" cy="55" rx="26" ry="35" fill="#F43F5E" fillOpacity="0.6" stroke="#FB7185" strokeWidth="1.5" />
                {/* Right lung */}
                <ellipse cx="80" cy="55" rx="26" ry="35" fill="#F43F5E" fillOpacity="0.6" stroke="#FB7185" strokeWidth="1.5" />
              </g>

              {/* Gas Flow Indicators */}
              <g transform="translate(25, 175)">
                <rect x="0" y="0" width="150" height="40" rx="8" fill="#0F172A" stroke="#1E293B" />
                <text x="75" y="18" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Inhales O₂ • Exhales CO₂
                </text>
                <text x="75" y="32" fill="#F43F5E" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  Consumes Muscle Energy (No ATP Made)
                </text>
              </g>
            </g>

            {/* CONNECTING ARROW: O2 Transport via Bloodstream */}
            <g transform="translate(225, 120)">
              <path d="M 0 35 L 50 35" stroke="#EF4444" strokeWidth="4" strokeDasharray="4 2" />
              <text x="25" y="25" fill="#F87171" fontSize="8" fontWeight="bold" textAnchor="middle">Blood O₂</text>
            </g>

            {/* RIGHT HALF: CELLULAR RESPIRATION (Micro Level) */}
            <g
              transform="translate(280, 40)"
              className={`transition-opacity duration-300 ${
                viewMode === 'breathing' ? 'opacity-25' : 'opacity-100'
              }`}
            >
              {/* Microscopic Cell Box */}
              <rect x="0" y="0" width="200" height="230" rx="16" fill="#451A03" fillOpacity="0.4" stroke="#F59E0B" strokeWidth="2" />
              <text x="100" y="30" fill="#FDE68A" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                CELLULAR RESPIRATION
              </text>
              <text x="100" y="46" fill="#FEF3C7" fontSize="8.5" textAnchor="middle">
                Biochemical / Intracellular / Mitochondrion
              </text>

              {/* Mitochondrion Graphic */}
              <g transform="translate(45, 65)">
                <ellipse cx="55" cy="45" rx="50" ry="32" fill="#C2410C" stroke="#FB923C" strokeWidth="2.5" />
                <path
                  d="M 20 45 C 30 35, 30 55, 40 45 C 50 35, 50 55, 60 45 C 70 35, 70 55, 80 45 C 90 35, 90 55, 95 45"
                  fill="none"
                  stroke="#FED7AA"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <text x="55" y="48" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  Mitochondrion
                </text>
              </g>

              {/* ATP Generation Energy Sparks */}
              <g transform="translate(25, 175)">
                <rect x="0" y="0" width="150" height="40" rx="8" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" className="animate-pulse" />
                <text x="75" y="18" fill="#FEF08A" fontSize="9.5" fontWeight="extrabold" textAnchor="middle">
                  ⚡ YIELDS 38 ATP ENERGY ⚡
                </text>
                <text x="75" y="32" fill="#FDBA74" fontSize="8" textAnchor="middle">
                  Enzymatic Glucose Oxidation
                </text>
              </g>
            </g>
          </svg>

          {/* Quick Summary Strip */}
          <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-cyan-300 font-bold">
              Breathing = Moving air in and out of lungs
            </span>
            <span className="text-amber-300 font-bold">
              Respiration = Burning glucose to make ATP
            </span>
          </div>
        </div>

        {/* Structured Comparison Matrix Table */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> The 5 Core Contrasts
            </h3>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">1. Process Nature:</span>
                <span className="text-cyan-300">Breathing:</span> Physical/mechanical muscular pumping.<br />
                <span className="text-amber-300">Respiration:</span> Biochemical intracellular oxidation.
              </div>

              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">2. Site of Occurrence:</span>
                <span className="text-cyan-300">Breathing:</span> Extracellular (lungs, trachea, gills).<br />
                <span className="text-amber-300">Respiration:</span> Intracellular (cytoplasm & mitochondria).
              </div>

              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">3. Energy (ATP) Balance:</span>
                <span className="text-cyan-300">Breathing:</span> Consumes energy (muscle contraction).<br />
                <span className="text-amber-300">Respiration:</span> Releases energy (synthesizes 38 ATP).
              </div>

              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">4. Enzyme Involvement:</span>
                <span className="text-cyan-300">Breathing:</span> No enzymes required.<br />
                <span className="text-amber-300">Respiration:</span> Regulated by dozens of enzymes.
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Exam Golden Rule:
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Never confuse breathing with respiration on KCSE or CBC biology papers! Living organisms like plants, amoebae, and earthworms perform cellular respiration all the time without having lungs or "breathing."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
