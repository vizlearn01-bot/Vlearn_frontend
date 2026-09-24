import React, { useState } from 'react';
import { Sun, Moon, Sparkles, RotateCcw, Droplets, Wind, ArrowRight, CheckCircle2, Info } from 'lucide-react';

export default function PhotosynthesisInputsOutputsSim({ config = {}, onTelemetry }) {
  // Primary Variable: Sunlight State (ON / OFF)
  const [isLightOn, setIsLightOn] = useState(true);
  const [selectedSubsystem, setSelectedSubsystem] = useState('all'); // 'all', 'light_stage', 'dark_stage'

  const handleToggleLight = () => {
    const nextState = !isLightOn;
    setIsLightOn(nextState);
    if (nextState) {
      onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'photosynthesis_inputs_outputs',
        lightToggled: true
      });
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Sun className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Photosynthesis: Inputs, Outputs & Chloroplast Reactions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Plant Nutrition and Photosynthesis
            </p>
          </div>
        </div>
        <button
          onClick={() => { setIsLightOn(true); setSelectedSubsystem('all'); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Primary Variable Control: Sunlight Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Primary Variable: Light Energy
          </span>
          <button
            onClick={handleToggleLight}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md ${
              isLightOn
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/40 ring-2 ring-amber-400/50'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            {isLightOn ? (
              <>
                <Sun className="w-4 h-4 text-slate-950 fill-amber-300" /> Sunlight Active (Daytime)
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-cyan-300" /> Darkness / Night (Light OFF)
              </>
            )}
          </button>
        </div>

        {/* View Focus Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 hidden sm:inline mr-1">Focus Stage:</span>
          {['all', 'light_stage', 'dark_stage'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSubsystem(s)}
              className={`px-2.5 py-1 rounded-lg border transition ${
                selectedSubsystem === s
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {s === 'all' ? 'Entire Chloroplast' : s === 'light_stage' ? '1. Thylakoid (Light)' : '2. Stroma (Dark)'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage: Chloroplast Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Ambient Lighting Overlay */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
              isLightOn ? 'bg-amber-500/[0.04]' : 'bg-indigo-950/30'
            }`}
          />

          <svg viewBox="0 0 520 340" className="w-full max-w-[500px] h-auto select-none z-10">
            <defs>
              <radialGradient id="chloroplastGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#065F46" />
                <stop offset="70%" stopColor="#064E3B" />
                <stop offset="100%" stopColor="#022C22" />
              </radialGradient>
              <linearGradient id="thylakoidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="sunbeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Sunlight Rays (When Light is ON) */}
            {isLightOn && (
              <g className="animate-pulse">
                <polygon points="10,0 80,0 180,140 120,140" fill="url(#sunbeamGrad)" />
                <polygon points="100,0 170,0 240,140 190,140" fill="url(#sunbeamGrad)" opacity="0.6" />
                <text x="70" y="30" fill="#FDE047" fontSize="11" fontWeight="extrabold">
                  Photon Energy (hν)
                </text>
              </g>
            )}

            {/* Outer Chloroplast Double Membrane (Oval Disc) */}
            <ellipse
              cx="260"
              cy="180"
              rx="210"
              ry="125"
              fill="url(#chloroplastGrad)"
              stroke="#34D399"
              strokeWidth="3.5"
              filter="drop-shadow(0px 8px 24px rgba(6, 78, 59, 0.6))"
            />
            {/* Inner Membrane */}
            <ellipse
              cx="260"
              cy="180"
              rx="203"
              ry="119"
              fill="none"
              stroke="#10B981"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.6"
            />

            {/* STROMA (Fluid matrix label) */}
            <text x="375" y="115" fill="#A7F3D0" fontSize="11" fontWeight="bold" opacity="0.9">
              Stroma (Fluid Matrix)
            </text>
            <text x="375" y="130" fill="#6EE7B7" fontSize="9" opacity="0.7">
              • Dark Stage (Calvin Cycle)
            </text>

            {/* THYLAKOID DISCS / GRANA (Stack of discs) */}
            {/* Granum 1 */}
            <g
              transform="translate(130, 110)"
              className={`transition-opacity duration-300 ${
                selectedSubsystem === 'dark_stage' ? 'opacity-30' : 'opacity-100'
              }`}
            >
              {[0, 14, 28, 42, 56].map((offsetY, i) => (
                <ellipse
                  key={i}
                  cx="40"
                  cy={offsetY + 20}
                  rx="36"
                  ry="9"
                  fill="url(#thylakoidGrad)"
                  stroke="#34D399"
                  strokeWidth="1.5"
                />
              ))}
              {/* Granum Label */}
              <text x="40" y="100" fill="#E2E8F0" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                Granum (Thylakoids)
              </text>
              <text x="40" y="113" fill="#6EE7B7" fontSize="9" textAnchor="middle">
                Chlorophyll / Light Stage
              </text>
            </g>

            {/* Intergranal Lamella Connecting Tube */}
            <path
              d="M 205 150 C 235 150, 245 165, 270 165"
              stroke="#10B981"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Granum 2 */}
            <g
              transform="translate(260, 125)"
              className={`transition-opacity duration-300 ${
                selectedSubsystem === 'dark_stage' ? 'opacity-30' : 'opacity-100'
              }`}
            >
              {[0, 14, 28, 42].map((offsetY, i) => (
                <ellipse
                  key={i}
                  cx="35"
                  cy={offsetY + 20}
                  rx="32"
                  ry="8"
                  fill="url(#thylakoidGrad)"
                  stroke="#34D399"
                  strokeWidth="1.5"
                />
              ))}
            </g>

            {/* INPUT 1: Water (H2O) entering from xylem */}
            <g transform="translate(45, 170)">
              <circle cx="15" cy="15" r="14" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
              <text x="15" y="19" fill="#FFFFFF" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                H₂O
              </text>
              <path d="M 32 15 L 95 15" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="3 3" />
              <text x="35" y="32" fill="#38BDF8" fontSize="9" fontWeight="semibold">
                Water (Xylem)
              </text>
            </g>

            {/* OUTPUT 1: Oxygen (O2) released from photolysis */}
            {isLightOn ? (
              <g transform="translate(130, 250)">
                <path d="M 40 -15 L 40 25" stroke="#34D399" strokeWidth="2.5" strokeDasharray="3 3" />
                <circle cx="40" cy="40" r="14" fill="#059669" stroke="#6EE7B7" strokeWidth="2" />
                <text x="40" y="44" fill="#FFFFFF" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  O₂
                </text>
                <text x="40" y="65" fill="#34D399" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Oxygen Gas (By-product)
                </text>
              </g>
            ) : (
              <g transform="translate(130, 250)" opacity="0.3">
                <circle cx="40" cy="40" r="14" fill="#475569" stroke="#64748B" strokeWidth="1.5" />
                <text x="40" y="44" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  O₂
                </text>
                <text x="40" y="65" fill="#64748B" fontSize="8.5" textAnchor="middle">
                  (Photolysis Halted)
                </text>
              </g>
            )}

            {/* INPUT 2: Carbon Dioxide (CO2) entering Stroma from stomata */}
            <g transform="translate(380, 50)">
              <circle cx="20" cy="20" r="15" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
              <text x="20" y="24" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                CO₂
              </text>
              <path d="M 20 40 L 20 85" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="3 3" />
              <text x="42" y="70" fill="#CBD5E1" fontSize="9" fontWeight="semibold">
                Carbon Dioxide
              </text>
            </g>

            {/* OUTPUT 2: Glucose (C6H12O6) synthesized in Stroma */}
            {isLightOn ? (
              <g transform="translate(370, 240)">
                <path d="M 30 -25 L 30 15" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="3 3" />
                <rect x="10" y="20" width="42" height="24" rx="6" fill="#D97706" stroke="#FDE68A" strokeWidth="2" />
                <text x="31" y="36" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  Glucose
                </text>
                <text x="31" y="56" fill="#FBBF24" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Sugar (C₆H₁₂O₆)
                </text>
              </g>
            ) : (
              <g transform="translate(370, 240)" opacity="0.3">
                <rect x="10" y="20" width="42" height="24" rx="6" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                <text x="31" y="36" fill="#94A3B8" fontSize="9" textAnchor="middle">
                  Glucose
                </text>
                <text x="31" y="56" fill="#64748B" fontSize="8.5" textAnchor="middle">
                  (Synthesis Halted)
                </text>
              </g>
            )}
          </svg>

          {/* Real-Time Chemical Word Equation Box */}
          <div className="w-full mt-3 p-3 bg-slate-900/95 rounded-xl border border-slate-800 text-center select-none">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Overall Chemical Equation
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm font-mono font-bold">
              <span className="text-cyan-300">6 CO₂</span>
              <span className="text-slate-500">+</span>
              <span className="text-sky-400">6 H₂O</span>
              <div className="flex flex-col items-center px-2 text-[10px] text-amber-300 font-sans">
                <span>{isLightOn ? 'Light (hν) ☀️' : 'No Light ✕'}</span>
                <span className="border-t border-slate-600 w-14 my-0.5"></span>
                <span className="text-emerald-400">Chlorophyll</span>
              </div>
              <span className={isLightOn ? 'text-amber-400 font-extrabold' : 'text-slate-600'}>
                C₆H₁₂O₆ (Glucose)
              </span>
              <span className="text-slate-500">+</span>
              <span className={isLightOn ? 'text-emerald-400 font-extrabold' : 'text-slate-600'}>
                6 O₂ ↑
              </span>
            </div>
          </div>
        </div>

        {/* Conceptual Explanations */}
        <div className="lg:col-span-4 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Two Stages of Photosynthesis
            </h3>

            {/* Stage 1 Card */}
            <div className={`p-3 rounded-xl border text-xs transition ${
              selectedSubsystem === 'dark_stage' ? 'opacity-40' : 'bg-slate-900/90 border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white">1. Light Stage (Photolysis)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Granum / Thylakoid
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Chlorophyll absorbs light energy to split water molecules (<strong className="text-sky-300">2H₂O → 4H⁺ + 4e⁻ + O₂</strong>). Oxygen gas is released as a by-product; ATP and NADPH are passed to the stroma.
              </p>
            </div>

            {/* Stage 2 Card */}
            <div className={`p-3 rounded-xl border text-xs transition ${
              selectedSubsystem === 'light_stage' ? 'opacity-40' : 'bg-slate-900/90 border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white">2. Dark Stage (Carbon Fixation)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Stroma Matrix
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Does not directly require light. CO₂ combines with hydrogen (from NADPH) using ATP energy (Calvin cycle) to synthesize simple hexose sugars (<strong className="text-amber-300">Glucose</strong>).
              </p>
            </div>
          </div>

          {/* Quick Biology Facts */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Key Insights:
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-slate-400">
              <li>
                <strong className="text-slate-200">Fate of Glucose:</strong> Converted to starch for compact, insoluble storage; sucrose for phloem transport; cellulose for cell walls.
              </li>
              <li>
                <strong className="text-slate-200">Source of Oxygen:</strong> Water (<span className="text-sky-300">H₂O</span>) is the exclusive source of released oxygen gas, proven using oxygen isotope ¹⁸O experiments.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
