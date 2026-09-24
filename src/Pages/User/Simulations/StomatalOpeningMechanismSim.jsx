import React, { useState } from 'react';
import { Sun, Moon, RotateCcw, Sparkles, CheckCircle2, Info, ArrowRight, Eye } from 'lucide-react';

export default function StomatalOpeningMechanismSim({ config = {}, onTelemetry }) {
  // Primary Variable: Environmental Lighting (Day / Night)
  const [isDaylight, setIsDaylight] = useState(true);

  const handleToggleLight = () => {
    const nextState = !isDaylight;
    setIsDaylight(nextState);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'stomatal_opening_mechanism',
      daylightToggled: nextState
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Eye className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Mechanism of Stomatal Opening and Closing
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Plant Gaseous Exchange (Guard Cell Turgor & Wall Biomechanics)
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsDaylight(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Primary Variable Control: Day/Night Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Primary Variable: Diurnal Light Cycle
          </span>
          <button
            onClick={handleToggleLight}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md ${
              isDaylight
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/40 ring-2 ring-amber-400/50'
                : 'bg-indigo-700 hover:bg-indigo-600 text-white shadow-indigo-950/40 ring-2 ring-indigo-400/50'
            }`}
          >
            {isDaylight ? (
              <>
                <Sun className="w-4 h-4 fill-amber-300 text-slate-950" /> Daylight (Stoma Opens)
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-cyan-200" /> Darkness / Night (Stoma Closes)
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Pore State:</span>
          <span className={`font-mono font-bold px-2.5 py-1 rounded-lg ${
            isDaylight ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
          }`}>
            {isDaylight ? 'OPEN (Transpiration & Gas Exchange Active)' : 'CLOSED (Water Conserved)'}
          </span>
        </div>
      </div>

      {/* Main Interactive Stage: Guard Cell Pair Microscopic Surface View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
              isDaylight
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40'
                : 'bg-slate-900/90 text-slate-300 border-slate-700'
            }`}>
              Guard Cells: {isDaylight ? 'Turgid & Swollen (Curved Outward)' : 'Flaccid & Deflated (Straight)'}
            </span>
          </div>

          {/* SVG Diagram: Kidney-shaped Guard Cell Pair */}
          <svg viewBox="0 0 500 320" className="w-full max-w-[480px] h-auto select-none">
            <defs>
              <linearGradient id="guardCellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>

            {/* Surrounding Subsidiary / Epidermal Cells Background */}
            <rect x="20" y="20" width="460" height="280" rx="16" fill="#064E3B" fillOpacity="0.15" stroke="#047857" strokeWidth="1.5" />
            <text x="50" y="50" fill="#6EE7B7" fontSize="10" fontWeight="bold">
              Epidermal / Subsidiary Cells
            </text>

            {/* GUARD CELL PAIR */}
            <g transform="translate(140, 40)">
              {isDaylight ? (
                /* OPEN STOMA (TURGID GUARD CELLS CURVED APART) */
                <g className="transition-all duration-500">
                  {/* Left Guard Cell (bowed outward to the left) */}
                  <path
                    d="M 60 20 
                       C -20 50, -30 180, 60 220 
                       C 40 180, 45 60, 60 20 Z"
                    fill="url(#guardCellGrad)"
                    stroke="#34D399"
                    strokeWidth="2.5"
                  />
                  {/* Thick inelastic inner wall of left cell */}
                  <path
                    d="M 60 20 C 40 60, 40 180, 60 220"
                    fill="none"
                    stroke="#FDE047"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />

                  {/* Right Guard Cell (bowed outward to the right) */}
                  <path
                    d="M 160 20 
                       C 240 50, 250 180, 160 220 
                       C 180 180, 175 60, 160 20 Z"
                    fill="url(#guardCellGrad)"
                    stroke="#34D399"
                    strokeWidth="2.5"
                  />
                  {/* Thick inelastic inner wall of right cell */}
                  <path
                    d="M 160 20 C 180 60, 180 180, 160 220"
                    fill="none"
                    stroke="#FDE047"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />

                  {/* Open Stomatal Pore Aperture */}
                  <ellipse cx="110" cy="120" rx="42" ry="70" fill="#022C22" stroke="#10B981" strokeWidth="1.5" />
                  <text x="110" y="125" fill="#38BDF8" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                    OPEN PORE
                  </text>
                  <text x="110" y="140" fill="#93C5FD" fontSize="8.5" textAnchor="middle">
                    (CO₂ In / O₂ & H₂O Out)
                  </text>

                  {/* Water Osmosis Influx Arrows */}
                  <g className="animate-pulse">
                    <path d="M -20 120 L 10 120" stroke="#38BDF8" strokeWidth="2.5" />
                    <path d="M 240 120 L 210 120" stroke="#38BDF8" strokeWidth="2.5" />
                    <text x="-20" y="105" fill="#38BDF8" fontSize="9" fontWeight="bold">H₂O Osmosis In →</text>
                  </g>

                  {/* Potassium Ions (K+) Accumulation */}
                  <circle cx="20" cy="80" r="6" fill="#A855F7" />
                  <text x="20" y="83" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" textAnchor="middle">K⁺</text>
                  <circle cx="200" cy="80" r="6" fill="#A855F7" />
                  <text x="200" y="83" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" textAnchor="middle">K⁺</text>
                </g>
              ) : (
                /* CLOSED STOMA (FLACCID GUARD CELLS STRAIGHT & TOUCHING) */
                <g className="transition-all duration-500">
                  {/* Left Guard Cell (relaxed straight) */}
                  <path
                    d="M 105 20 
                       C 50 50, 45 180, 105 220 
                       C 105 180, 105 60, 105 20 Z"
                    fill="url(#guardCellGrad)"
                    stroke="#34D399"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <line x1="105" y1="20" x2="105" y2="220" stroke="#FDE047" strokeWidth="6" strokeLinecap="round" />

                  {/* Right Guard Cell (relaxed straight) */}
                  <path
                    d="M 115 20 
                       C 170 50, 175 180, 115 220 
                       C 115 180, 115 60, 115 20 Z"
                    fill="url(#guardCellGrad)"
                    stroke="#34D399"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <line x1="115" y1="20" x2="115" y2="220" stroke="#FDE047" strokeWidth="6" strokeLinecap="round" />

                  {/* Slit Closed Pore */}
                  <line x1="110" y1="35" x2="110" y2="205" stroke="#0F172A" strokeWidth="3" />
                  <text x="110" y="125" fill="#F43F5E" fontSize="11" fontWeight="extrabold" textAnchor="middle">
                    CLOSED PORE
                  </text>

                  {/* Water Exosmosis arrows (leaving guard cells) */}
                  <g className="animate-pulse">
                    <path d="M 50 120 L 10 120" stroke="#F43F5E" strokeWidth="2.5" />
                    <path d="M 170 120 L 210 120" stroke="#F43F5E" strokeWidth="2.5" />
                    <text x="5" y="105" fill="#F43F5E" fontSize="9" fontWeight="bold">← H₂O Outflow</text>
                  </g>
                </g>
              )}

              {/* Chloroplasts inside Guard Cells (Guard cells are the only epidermal cells with chloroplasts!) */}
              <circle cx="25" cy="140" r="5" fill="#15803D" stroke="#4ADE80" strokeWidth="1" />
              <circle cx="35" cy="165" r="5" fill="#15803D" stroke="#4ADE80" strokeWidth="1" />
              <circle cx="190" cy="140" r="5" fill="#15803D" stroke="#4ADE80" strokeWidth="1" />
              <circle cx="180" cy="165" r="5" fill="#15803D" stroke="#4ADE80" strokeWidth="1" />

              {/* Nucleus */}
              <circle cx="20" cy="50" r="8" fill="#4338CA" stroke="#818CF8" strokeWidth="1.5" />
              <circle cx="200" cy="50" r="8" fill="#4338CA" stroke="#818CF8" strokeWidth="1.5" />
            </g>

            {/* Anatomical Key Labels */}
            <line x1="100" y1="260" x2="185" y2="210" stroke="#FDE047" strokeWidth="2" strokeDasharray="3 2" />
            <text x="80" y="275" fill="#FDE047" fontSize="10" fontWeight="bold" textAnchor="middle">
              Thick Inelastic Inner Wall
            </text>

            <line x1="400" y1="260" x2="330" y2="210" stroke="#34D399" strokeWidth="2" strokeDasharray="3 2" />
            <text x="410" y="275" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="middle">
              Thin Elastic Outer Wall
            </text>
          </svg>

          {/* Telemetry / Summary Strip */}
          <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              Biomechanical Principle: <strong className="text-white">Differential Wall Elasticity</strong>
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              {isDaylight ? 'Turgor Stretch: Inner walls pulled apart' : 'Turgor Loss: Inner walls snap shut'}
            </span>
          </div>
        </div>

        {/* Step-by-Step Biological Mechanism Card */}
        <div className="lg:col-span-4 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> The Potassium Ion (K⁺) Mechanism
            </h3>

            {isDaylight ? (
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-amber-300 block">1. Daylight Influx:</strong>
                  Proton pumps actively pump K⁺ ions into guard cells, lowering their water potential (Ψ).
                </div>
                <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-sky-300 block">2. Endosmosis:</strong>
                  Water moves from subsidiary cells into guard cells by osmosis down the Ψ gradient.
                </div>
                <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-emerald-300 block">3. Asymmetric Bulging:</strong>
                  High turgor stretches the thin outer wall outward, which drags the thick inner wall along, opening the pore.
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-indigo-300 block">1. Night Efflux:</strong>
                  In darkness, K⁺ ions diffuse out of guard cells; water potential (Ψ) rises.
                </div>
                <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-rose-300 block">2. Exosmosis:</strong>
                  Water moves out of guard cells into adjacent epidermal cells by osmosis.
                </div>
                <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className="text-slate-300 block">3. Pore Closure:</strong>
                  Guard cells become flaccid; thick inner walls spring back to touch each other, sealing the aperture.
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Did You Know?
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Guard cells are unique because they are the <em>only</em> cells in the leaf epidermis containing chloroplasts, enabling them to produce ATP required for active ion transport!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
