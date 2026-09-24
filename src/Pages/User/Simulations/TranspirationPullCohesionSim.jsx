import React, { useState } from 'react';
import { Droplets, Wind, RotateCcw, Sparkles, CheckCircle2, Info, ArrowUp } from 'lucide-react';

export default function TranspirationPullCohesionSim({ config = {}, onTelemetry }) {
  // Primary Variable: Transpiration Evaporation Rate (Low, Moderate, High)
  const [transpirationDemand, setTranspirationDemand] = useState('moderate');
  const [zoomMode, setZoomMode] = useState('molecular'); // 'column' | 'molecular'

  const demands = {
    low: {
      label: 'Low Transpiration (Humid / Shaded)',
      evaporationRate: '12 ml/h',
      tensionValue: '-0.3 MPa (Mild Tension)',
      velocity: 'Slow upward drift',
      columnStability: 'Stable & Unstressed',
      description: 'High atmospheric humidity reduces the water vapor concentration gradient. Transpiration pull is gentle; water column is under low tension.',
      speedClass: 'duration-1000'
    },
    moderate: {
      label: 'Moderate Transpiration (Normal Daylight)',
      evaporationRate: '48 ml/h',
      tensionValue: '-1.2 MPa (Optimal Tension)',
      velocity: 'Steady continuous stream',
      columnStability: 'Stable Cohesive Stream',
      description: 'Balanced stomatal conductance and ambient warmth drive steady evaporation from mesophyll cell walls. Cohesive hydrogen bonds pull the water column upward effortlessly.',
      speedClass: 'duration-500'
    },
    high: {
      label: 'High Transpiration (Hot, Sunny & Windy)',
      evaporationRate: '115 ml/h',
      tensionValue: '-2.8 MPa (High Suction Tension)',
      velocity: 'Rapid upward surge',
      columnStability: 'Extreme Negative Pressure',
      description: 'Dry air and solar heat accelerate evaporation through open stomata. Steep suction tension pulls the water column rapidly. Lignified walls resist collapse and cohesive bonds prevent cavitation.',
      speedClass: 'duration-200'
    }
  };

  const currentData = demands[transpirationDemand];

  const handleSelectDemand = (level) => {
    setTranspirationDemand(level);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'transpiration_pull_cohesion',
      demand: level
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Cohesion-Tension Theory: Ascent of Water in Plants
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Plant Transport (Dixon & Joly Cohesion Model)
            </p>
          </div>
        </div>
        <button
          onClick={() => { setTranspirationDemand('moderate'); setZoomMode('molecular'); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Primary Variable Control: Environmental Transpiration Demand */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Variable: Atmospheric Transpiration Pull Demand
          </label>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setZoomMode('molecular')}
              className={`px-2.5 py-1 rounded-lg border transition ${
                zoomMode === 'molecular'
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Molecular H-Bond Zoom
            </button>
            <button
              onClick={() => setZoomMode('column')}
              className={`px-2.5 py-1 rounded-lg border transition ${
                zoomMode === 'column'
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Macro Tree Column
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {Object.entries(demands).map(([key, item]) => {
            const isSelected = key === transpirationDemand;
            return (
              <button
                key={key}
                onClick={() => handleSelectDemand(key)}
                className={`p-3 rounded-2xl border text-left transition ${
                  isSelected
                    ? 'bg-slate-800 border-sky-500 shadow-md ring-1 ring-sky-500 shadow-sky-950/40'
                    : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{item.label}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
                  <span>Rate: {item.evaporationRate}</span>
                  <span className="text-sky-300 font-semibold">{item.tensionValue.split(' ')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Simulation Viewport: Molecular Cohesion vs Continuous Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sky-300">
              Tension: {currentData.tensionValue} • {currentData.columnStability}
            </span>
          </div>

          {zoomMode === 'molecular' ? (
            /* MOLECULAR H-BONDING ZOOM VIEW */
            <svg viewBox="0 0 460 300" className="w-full max-w-[440px] h-auto select-none my-auto">
              <defs>
                <linearGradient id="wallLignin" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0369A1" />
                  <stop offset="100%" stopColor="#082F49" />
                </linearGradient>
              </defs>

              {/* Xylem Vessel Cellulose/Lignin Left & Right Walls */}
              <rect x="30" y="20" width="35" height="260" rx="4" fill="url(#wallLignin)" stroke="#0284C7" strokeWidth="2" />
              <text x="47" y="150" fill="#BAE6FD" fontSize="9" fontWeight="bold" textAnchor="middle" transform="rotate(-90 47 150)">
                Hydrophilic Xylem Wall
              </text>

              <rect x="395" y="20" width="35" height="260" rx="4" fill="url(#wallLignin)" stroke="#0284C7" strokeWidth="2" />
              <text x="412" y="150" fill="#BAE6FD" fontSize="9" fontWeight="bold" textAnchor="middle" transform="rotate(90 412 150)">
                Hydrophilic Xylem Wall
              </text>

              {/* Hollow Lumen containing continuous chain of H2O molecules */}
              <rect x="65" y="20" width="330" height="260" fill="#0C4A6E" fillOpacity="0.2" />

              {/* Upward Transpiration Pull Vector */}
              <g transform="translate(230, 25)" className="animate-pulse">
                <path d="M 0 15 L 0 -5 M -7 5 L 0 -5 L 7 5" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
                <text x="0" y="-10" fill="#38BDF8" fontSize="9.5" fontWeight="extrabold" textAnchor="middle">
                  TRANSPIRATION PULL ↑
                </text>
              </g>

              {/* Water Molecule Chain (Oxygen + 2 Hydrogens with Hydrogen Bonds) */}
              {[
                { y: 55, x: 230 },
                { y: 110, x: 230 },
                { y: 165, x: 230 },
                { y: 220, x: 230 }
              ].map((pos, idx) => (
                <g key={idx} transform={`translate(${pos.x}, ${pos.y})`}>
                  {/* Central Oxygen Atom (red/salmon) */}
                  <circle cx="0" cy="0" r="16" fill="#EF4444" stroke="#FECACA" strokeWidth="1.5" />
                  <text x="0" y="4" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Oδ⁻
                  </text>

                  {/* Left Hydrogen (light blue) */}
                  <circle cx="-16" cy="-10" r="9" fill="#38BDF8" stroke="#E0F2FE" strokeWidth="1" />
                  <text x="-16" y="-7" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Hδ⁺
                  </text>

                  {/* Right Hydrogen */}
                  <circle cx="16" cy="-10" r="9" fill="#38BDF8" stroke="#E0F2FE" strokeWidth="1" />
                  <text x="16" y="-7" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Hδ⁺
                  </text>

                  {/* Hydrogen Bond linking to molecule above (COHESION) */}
                  {idx > 0 && (
                    <g transform="translate(0, -32)">
                      <line x1="0" y1="0" x2="0" y2="16" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="3 2" />
                      <text x="12" y="10" fill="#FDE047" fontSize="8" fontWeight="bold">
                        H-Bond (Cohesion)
                      </text>
                    </g>
                  )}

                  {/* ADHESION Force lines attaching to xylem walls */}
                  <line x1="-22" y1="-5" x2="-140" y2="-5" stroke="#34D399" strokeWidth="1.5" strokeDasharray="4 2" />
                  <line x1="22" y1="-5" x2="140" y2="-5" stroke="#34D399" strokeWidth="1.5" strokeDasharray="4 2" />
                </g>
              ))}

              {/* Adhesion label on side */}
              <text x="100" y="195" fill="#34D399" fontSize="8.5" fontWeight="bold">
                ← Adhesion to Wall
              </text>
            </svg>
          ) : (
            /* MACRO TREE COLUMN VIEW */
            <svg viewBox="0 0 420 300" className="w-full max-w-[380px] h-auto select-none my-auto">
              {/* Ground & Roots */}
              <rect x="20" y="250" width="380" height="40" rx="3" fill="#44403C" />
              <text x="60" y="275" fill="#D6D3D1" fontSize="10" fontWeight="bold">
                Soil & Roots (Osmotic Intake)
              </text>

              {/* Trunk / Stem Xylem Column */}
              <rect x="180" y="70" width="60" height="180" fill="#0284C7" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="2" />
              {/* Continuous Water Rope in Stem */}
              <line x1="210" y1="250" x2="210" y2="70" stroke="#38BDF8" strokeWidth="8" strokeLinecap="round" />
              <text x="210" y="160" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle" transform="rotate(90 210 160)">
                Continuous Cohesive Water Column
              </text>

              {/* Canopy / Leaves at Top */}
              <ellipse cx="210" cy="50" rx="120" ry="35" fill="#15803D" stroke="#22C55E" strokeWidth="2" />
              <text x="210" y="45" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                Leaf Stomata
              </text>
              <text x="210" y="60" fill="#BBF7D0" fontSize="8.5" textAnchor="middle">
                Evaporative Transpiration Loss
              </text>

              {/* Water Vapor Diffusing out into air */}
              <g className="animate-pulse">
                <circle cx="160" cy="20" r="3" fill="#7DD3FC" opacity="0.8" />
                <circle cx="210" cy="15" r="3.5" fill="#7DD3FC" opacity="0.9" />
                <circle cx="260" cy="22" r="3" fill="#7DD3FC" opacity="0.8" />
              </g>
            </svg>
          )}

          {/* Real-time Telemetry Bottom Bar */}
          <div className="w-full p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              Ascent Mechanism: <strong className="text-sky-300">Cohesion + Adhesion + Transpiration Pull</strong>
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              Velocity: {currentData.velocity}
            </span>
          </div>
        </div>

        {/* Scientific Foundations Card */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> The 3 Key Pillars of the Theory
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <strong className="text-sky-300 block mb-0.5">1. Transpiration Pull (Suction):</strong>
                Evaporation of water from leaf mesophyll creates high negative hydrostatic pressure, pulling water from xylem vessels like a straw.
              </div>
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <strong className="text-amber-300 block mb-0.5">2. Cohesion (Water-Water Attraction):</strong>
                Hydrogen bonding between polar water molecules imparts massive tensile strength, preventing the column from breaking (cavitation).
              </div>
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <strong className="text-emerald-300 block mb-0.5">3. Adhesion (Water-Wall Attraction):</strong>
                Forces of attraction between water molecules and hydrophilic xylem wall cellulose prevent downward slippage under gravitational pull.
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Botanical Importance:
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enables massive trees (such as eucalyptus and giant redwoods reaching over 100 meters tall) to lift thousands of liters of water without requiring any mechanical pump or ATP consumption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
