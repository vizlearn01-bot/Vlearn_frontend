import React, { useState } from 'react';
import { Droplets, RotateCcw, ArrowRight, ShieldAlert, CheckCircle2, Info, Sparkles } from 'lucide-react';

export default function RootWaterAbsorptionOsmosisSim({ config = {}, onTelemetry }) {
  // Primary Variable: Soil Water Potential / Condition
  const [soilConditionId, setSoilConditionId] = useState('moist');

  const soilConditions = [
    {
      id: 'moist',
      name: 'Moist, Well-Watered Soil',
      soilPotential: '-0.1 MPa (High Ψ)',
      cellPotential: '-0.8 MPa (Low Ψ)',
      gradientText: 'Soil Ψ > Root Cell Sap Ψ',
      flowDirection: 'Rapid Inward Osmosis',
      turgorStatus: 'Turgid & Firm',
      description: 'Soil solution contains dilute dissolved mineral ions. The root hair cell sap has a much higher concentration of sugars and salts (lower water potential). Water moves rapidly into the root hair across the semi-permeable membrane down the water potential gradient.',
      waterArrow: 'inward_rapid',
      statusColor: 'text-emerald-400',
      statusBg: 'bg-emerald-500/20'
    },
    {
      id: 'moderate',
      name: 'Moderate Moisture Soil',
      soilPotential: '-0.5 MPa (Medium Ψ)',
      cellPotential: '-0.8 MPa (Low Ψ)',
      gradientText: 'Soil Ψ > Root Cell Sap Ψ',
      flowDirection: 'Steady Inward Osmosis',
      turgorStatus: 'Normal Turgor',
      description: 'Mild water potential gradient drives steady net influx of water into root hair cytoplasm and central vacuole, sustaining continuous transpiration stream up to xylem.',
      waterArrow: 'inward_steady',
      statusColor: 'text-cyan-400',
      statusBg: 'bg-cyan-500/20'
    },
    {
      id: 'saline_drought',
      name: 'Dry Drought / Saline Soil',
      soilPotential: '-2.5 MPa (Very Low Ψ)',
      cellPotential: '-0.8 MPa (Higher Ψ than soil)',
      gradientText: 'Soil Ψ < Root Cell Sap Ψ',
      flowDirection: 'Exosmosis (Water Leaves Cell)',
      turgorStatus: 'Flaccid & Plasmolysed',
      description: 'Excess mineral fertilizer or severe drought lowers soil water potential below that of the root sap. Water moves OUT of root hairs into the soil by exosmosis. Root hair protoplast shrinks away from cell wall, causing catastrophic wilting (fertilizer burn).',
      waterArrow: 'outward_exosmosis',
      statusColor: 'text-rose-400',
      statusBg: 'bg-rose-500/20'
    }
  ];

  const currentCondition = soilConditions.find((c) => c.id === soilConditionId) || soilConditions[0];

  const handleSelectCondition = (id) => {
    setSoilConditionId(id);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'root_water_absorption_osmosis',
      condition: id
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
              Root Water Absorption & Osmosis in Root Hairs
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Plant Transport (Soil-to-Root Osmotic Gradient)
            </p>
          </div>
        </div>
        <button
          onClick={() => setSoilConditionId('moist')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset Soil
        </button>
      </div>

      {/* Primary Variable Control: Soil Condition Buttons */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Variable: Soil Moisture & Solute Potential (Ψ)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {soilConditions.map((cond) => {
            const isSelected = cond.id === soilConditionId;
            return (
              <button
                key={cond.id}
                onClick={() => handleSelectCondition(cond.id)}
                className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-800 border-sky-500 shadow-lg shadow-sky-950/40 ring-1 ring-sky-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white">{cond.name}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-1">
                  Soil Ψ: {cond.soilPotential}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Simulation Viewport: Root Hair Cellular Anatomy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border ${currentCondition.statusBg} ${currentCondition.statusColor} border-current/30`}>
              {currentCondition.flowDirection} • {currentCondition.turgorStatus}
            </span>
          </div>

          {/* SVG Diagram */}
          <svg viewBox="0 0 520 320" className="w-full max-w-[500px] h-auto select-none">
            <defs>
              <linearGradient id="cellWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="100%" stopColor="#16A34A" />
              </linearGradient>
              <linearGradient id="vacuoleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
            </defs>

            {/* SOIL REGION (Left half: x = 0 to 220) */}
            <rect x="0" y="0" width="220" height="320" fill="#292524" opacity="0.6" />
            <text x="30" y="35" fill="#A8A29E" fontSize="11" fontWeight="bold">
              Soil Environment
            </text>
            <text x="30" y="52" fill="#78716C" fontSize="9">
              Soil Water Ψ = {currentCondition.soilPotential}
            </text>

            {/* Soil particles (brown grains) */}
            <circle cx="50" cy="90" r="22" fill="#57534E" stroke="#44403C" strokeWidth="2" />
            <circle cx="80" cy="145" r="18" fill="#57534E" stroke="#44403C" strokeWidth="2" />
            <circle cx="45" cy="205" r="26" fill="#57534E" stroke="#44403C" strokeWidth="2" />
            <circle cx="75" cy="265" r="20" fill="#57534E" stroke="#44403C" strokeWidth="2" />

            {/* Water film around soil grains */}
            <circle cx="50" cy="90" r="26" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 2" opacity="0.7" />
            <circle cx="80" cy="145" r="22" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 2" opacity="0.7" />
            <circle cx="45" cy="205" r="30" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 2" opacity="0.7" />

            {/* ROOT EPIDERMIS & ROOT HAIR EXTENSION */}
            {/* Base of epidermal cell at right (x = 340 to 520), Root hair protruding left to x = 110 */}
            <g transform="translate(110, 80)">
              {/* Outer Cell Wall */}
              <path
                d="M 0 60 
                   C 0 40, 20 30, 60 35 
                   L 230 35 
                   L 230 15 
                   L 390 15 
                   L 390 165 
                   L 230 165 
                   L 230 145 
                   L 60 145 
                   C 20 150, 0 140, 0 120 
                   C -5 90, -5 90, 0 60 Z"
                fill="#064E3B"
                fillOpacity="0.4"
                stroke="url(#cellWallGrad)"
                strokeWidth="3"
              />

              {/* Cell Membrane & Cytoplasm */}
              {soilConditionId === 'saline_drought' ? (
                // Plasmolysed cell: protoplast retracted from cell wall
                <path
                  d="M 20 70 
                     C 20 60, 40 55, 70 55 
                     L 220 55 
                     L 220 30 
                     L 375 30 
                     L 375 150 
                     L 220 150 
                     L 220 125 
                     L 70 125 
                     C 40 125, 20 120, 20 110 Z"
                  fill="#831843"
                  fillOpacity="0.5"
                  stroke="#F43F5E"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              ) : (
                // Turgid cell: membrane pushed tight against cell wall
                <path
                  d="M 5 62 
                     C 5 45, 25 38, 62 40 
                     L 228 40 
                     L 228 20 
                     L 385 20 
                     L 385 160 
                     L 228 160 
                     L 228 140 
                     L 62 140 
                     C 25 142, 5 135, 5 118 Z"
                  fill="#065F46"
                  fillOpacity="0.6"
                  stroke="#34D399"
                  strokeWidth="1.5"
                />
              )}

              {/* Large Central Cell Sap Vacuole */}
              {soilConditionId === 'saline_drought' ? (
                // Shrunken vacuole
                <rect x="120" y="70" width="180" height="40" rx="15" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
              ) : (
                // Fully turgid distended vacuole
                <path
                  d="M 30 80 C 30 65, 50 60, 90 60 L 330 60 C 350 60, 360 70, 360 90 C 360 110, 350 120, 330 120 L 90 120 C 50 120, 30 115, 30 100 Z"
                  fill="url(#vacuoleGrad)"
                  fillOpacity="0.45"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
              )}

              {/* Cell Nucleus */}
              <circle cx="270" cy="135" r="14" fill="#7C3AED" stroke="#A78BFA" strokeWidth="2" />
              <text x="270" y="139" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                Nucleus
              </text>

              {/* Labels inside Root Hair */}
              <text x="180" y="94" fill="#E0F2FE" fontSize="11" fontWeight="bold" textAnchor="middle">
                Central Vacuole (Cell Sap)
              </text>
              <text x="180" y="108" fill="#7DD3FC" fontSize="9" textAnchor="middle">
                Vacuolar Ψ = {currentCondition.cellPotential}
              </text>

              {/* Root Hair Extension Pointer */}
              <text x="35" y="45" fill="#34D399" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                Root Hair (High Surface Area)
              </text>
            </g>

            {/* WATER MOVEMENT VECTORS */}
            {soilConditionId !== 'saline_drought' ? (
              // Inward Osmosis arrows (from soil at x=90 into root hair at x=140)
              <g className="animate-pulse">
                <path d="M 60 140 L 105 140" stroke="#38BDF8" strokeWidth="3" markerEnd="url(#arrowBlue)" />
                <path d="M 60 170 L 105 170" stroke="#38BDF8" strokeWidth="3" />
                <path d="M 60 200 L 105 200" stroke="#38BDF8" strokeWidth="3" />
                <text x="75" y="125" fill="#38BDF8" fontSize="9.5" fontWeight="bold">
                  H₂O Osmosis Inward →
                </text>
              </g>
            ) : (
              // Outward Exosmosis arrows (leaving cell into soil)
              <g className="animate-pulse">
                <path d="M 115 140 L 70 140" stroke="#F43F5E" strokeWidth="3" />
                <path d="M 115 170 L 70 170" stroke="#F43F5E" strokeWidth="3" />
                <path d="M 115 200 L 70 200" stroke="#F43F5E" strokeWidth="3" />
                <text x="45" y="125" fill="#F43F5E" fontSize="9.5" fontWeight="bold">
                  ← Exosmosis Outward
                </text>
              </g>
            )}

            {/* Lateral Pathway to Xylem (Right side cortex & xylem) */}
            <line x1="480" y1="20" x2="480" y2="300" stroke="#0284C7" strokeWidth="3" />
            <text x="500" y="160" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(90 500 160)">
              Towards Root Xylem Vessels →
            </text>
          </svg>

          {/* Water Potential Equation Bar */}
          <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400">Water Potential Gradient:</span>
            <span className="font-mono font-bold text-sky-300">
              {currentCondition.gradientText}
            </span>
            <span className="font-bold text-slate-300">
              Net Flow: <strong className={currentCondition.statusColor}>{currentCondition.flowDirection}</strong>
            </span>
          </div>
        </div>

        {/* Biological Adaptation & Mechanisms */}
        <div className="lg:col-span-4 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Root Hair Adaptations
            </h3>

            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong className="text-white">1. Elongated Projection:</strong> Increases the surface area to volume ratio for rapid water and ion absorption.
              </p>
              <p>
                <strong className="text-white">2. Concentrated Cell Sap:</strong> Active transport of mineral ions maintains a lower water potential than the surrounding soil, driving spontaneous osmosis.
              </p>
              <p>
                <strong className="text-white">3. Thin Cell Wall & Membrane:</strong> Minimizes the diffusion distance for water molecules into the symplast.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Lateral Pathways to Xylem:
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <p>
                <strong className="text-slate-200">Apoplast Pathway:</strong> Water moves along porous cellulose cell walls and intercellular spaces until blocked by the suberized <span className="text-amber-300 font-semibold">Casparian strip</span> of the endodermis.
              </p>
              <p>
                <strong className="text-slate-200">Symplast Pathway:</strong> Water moves through living cytoplasm and plasmodesmata connections between adjacent cortex cells.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
