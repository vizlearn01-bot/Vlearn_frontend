import React, { useState } from 'react';
import { Sun, Moon, Sunrise, RotateCcw, ArrowDown, ArrowUp, ArrowRight, CheckCircle2, Info, Sparkles } from 'lucide-react';

export default function LeafGasExchangeDayNightSim({ config = {}, onTelemetry }) {
  // Primary Variable: Time of Day Condition
  const [timeCondition, setTimeCondition] = useState('bright_day'); // 'bright_day' | 'compensation_point' | 'dark_night'

  const conditions = {
    bright_day: {
      name: 'Bright Daylight (Midday)',
      icon: Sun,
      iconColor: 'text-amber-400',
      pRate: '100% (High)',
      rRate: '20% (Constant)',
      comparison: 'Photosynthesis >> Respiration (P > R)',
      netCo2: 'Net Influx (Absorbing CO₂ from air)',
      netO2: 'Net Efflux (Releasing excess O₂ into air)',
      co2Arrow: 'down', // entering leaf
      o2Arrow: 'up',   // leaving leaf
      description: 'Photosynthesis operates at peak velocity, consuming all respiratory CO₂ plus drawing massive additional CO₂ from the atmosphere through open stomata. Excess O₂ produced by photolysis is released as a vital planetary by-product.',
      statusBg: 'bg-amber-500/20',
      statusBorder: 'border-amber-500/40'
    },
    compensation_point: {
      name: 'Compensation Point (Dawn / Dusk)',
      icon: Sunrise,
      iconColor: 'text-orange-400',
      pRate: '20% (Low)',
      rRate: '20% (Constant)',
      comparison: 'Photosynthesis = Respiration (P = R)',
      netCo2: 'Zero Net Exchange (Internal Recycling)',
      netO2: 'Zero Net Exchange (Internal Recycling)',
      co2Arrow: 'none',
      o2Arrow: 'none',
      description: 'At dim illumination, the rate of glucose synthesis via photosynthesis exactly balances the rate of glucose breakdown via cellular respiration. All CO₂ produced by mitochondria is immediately consumed by chloroplasts. No net gas enters or leaves the leaf.',
      statusBg: 'bg-orange-500/20',
      statusBorder: 'border-orange-500/40'
    },
    dark_night: {
      name: 'Darkness / Night (Midnight)',
      icon: Moon,
      iconColor: 'text-cyan-300',
      pRate: '0% (Ceased)',
      rRate: '20% (Constant)',
      comparison: 'Respiration Only (P = 0, R > 0)',
      netCo2: 'Net Efflux (Releasing CO₂ into air)',
      netO2: 'Net Influx (Absorbing O₂ from air)',
      co2Arrow: 'up',   // leaving leaf
      o2Arrow: 'down', // entering leaf
      description: 'In total darkness, the light-dependent reactions of photosynthesis cannot run. Cellular respiration continues uninterrupted in mitochondria to generate ATP for cellular maintenance. The leaf behaves like an animal tissue, consuming O₂ and releasing CO₂.',
      statusBg: 'bg-indigo-500/20',
      statusBorder: 'border-indigo-500/40'
    }
  };

  const current = conditions[timeCondition];

  const handleSelectCondition = (cond) => {
    setTimeCondition(cond);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'leaf_gas_exchange_day_night',
      condition: cond
    });
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
              24-Hour Leaf Gas Exchange & Compensation Point
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Plant Gaseous Exchange & Respiration
            </p>
          </div>
        </div>
        <button
          onClick={() => setTimeCondition('bright_day')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Primary Variable Control: Diurnal Condition Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Variable: Diurnal Illumination State
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {Object.entries(conditions).map(([key, item]) => {
            const isSelected = key === timeCondition;
            const IconComp = item.icon;
            return (
              <button
                key={key}
                onClick={() => handleSelectCondition(key)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500 shadow-emerald-950/40'
                    : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className={`p-2 rounded-xl bg-slate-900 border border-slate-700 ${item.iconColor}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{item.name}</span>
                  <span className="text-[11px] font-mono text-slate-400">{item.comparison}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Simulation Viewport: Stomatal Gas Flux Dynamics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${current.statusBg} ${current.statusBorder} text-white`}>
              {current.name} • {current.comparison}
            </span>
          </div>

          {/* SVG Diagram: Leaf Cross Section with Chloroplast & Mitochondrion */}
          <svg viewBox="0 0 500 320" className="w-full max-w-[480px] h-auto select-none">
            {/* Atmosphere Header Zone */}
            <rect x="20" y="10" width="460" height="60" rx="8" fill="#1E293B" opacity="0.6" />
            <text x="40" y="32" fill="#94A3B8" fontSize="10" fontWeight="bold">
              Surrounding Atmosphere (Air)
            </text>

            {/* Upper Epidermis Cuticle Line */}
            <line x1="20" y1="70" x2="480" y2="70" stroke="#10B981" strokeWidth="3" />

            {/* Palisade & Spongy Mesophyll Cell Compartment */}
            <rect x="40" y="90" width="420" height="200" rx="16" fill="#064E3B" fillOpacity="0.4" stroke="#047857" strokeWidth="2" />
            <text x="60" y="115" fill="#6EE7B7" fontSize="11" fontWeight="bold">
              Photosynthetic Mesophyll Cell
            </text>

            {/* ORGANELLE 1: CHLOROPLAST (Green Disc) */}
            <g transform="translate(80, 140)">
              <ellipse cx="60" cy="50" rx="55" ry="38" fill="#047857" stroke="#34D399" strokeWidth="2.5" />
              <text x="60" y="45" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                Chloroplast
              </text>
              <text x="60" y="60" fill="#A7F3D0" fontSize="8.5" textAnchor="middle">
                (Photosynthesis: {current.pRate})
              </text>
            </g>

            {/* ORGANELLE 2: MITOCHONDRION (Orange/Red Bean) */}
            <g transform="translate(280, 140)">
              <ellipse cx="60" cy="50" rx="55" ry="38" fill="#9A3412" stroke="#FB923C" strokeWidth="2.5" />
              <text x="60" y="45" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                Mitochondrion
              </text>
              <text x="60" y="60" fill="#FED7AA" fontSize="8.5" textAnchor="middle">
                (Respiration: {current.rRate})
              </text>
            </g>

            {/* INTERNAL GAS CYCLING BETWEEN CHLOROPLAST AND MITOCHONDRION */}
            {/* O2 from Chloroplast to Mitochondrion */}
            <path d="M 195 160 L 225 160" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="3 2" />
            <text x="210" y="152" fill="#38BDF8" fontSize="8" fontWeight="bold" textAnchor="middle">O₂</text>

            {/* CO2 from Mitochondrion to Chloroplast */}
            <path d="M 225 185 L 195 185" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="3 2" />
            <text x="210" y="198" fill="#F59E0B" fontSize="8" fontWeight="bold" textAnchor="middle">CO₂</text>

            {/* NET GAS EXCHANGE WITH ATMOSPHERE (STOMATAL ARROWS) */}
            {timeCondition === 'bright_day' && (
              <g className="animate-pulse">
                {/* CO2 Influx (Air into Chloroplast) */}
                <g transform="translate(110, 30)">
                  <path d="M 25 0 L 25 50" stroke="#F59E0B" strokeWidth="3.5" />
                  <polygon points="20,40 25,55 30,40" fill="#F59E0B" />
                  <rect x="0" y="10" width="50" height="20" rx="4" fill="#78350F" />
                  <text x="25" y="24" fill="#FDE68A" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    CO₂ IN ↓
                  </text>
                </g>
                {/* O2 Efflux (Chloroplast into Air) */}
                <g transform="translate(170, 30)">
                  <path d="M 25 55 L 25 5" stroke="#38BDF8" strokeWidth="3.5" />
                  <polygon points="20,15 25,0 30,15" fill="#38BDF8" />
                  <rect x="0" y="25" width="50" height="20" rx="4" fill="#0369A1" />
                  <text x="25" y="39" fill="#E0F2FE" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    O₂ OUT ↑
                  </text>
                </g>
              </g>
            )}

            {timeCondition === 'compensation_point' && (
              <g transform="translate(180, 35)">
                <rect x="0" y="0" width="140" height="30" rx="6" fill="#475569" opacity="0.8" />
                <text x="70" y="19" fill="#FDE047" fontSize="10" fontWeight="extrabold" textAnchor="middle">
                  0 NET GAS FLUX
                </text>
              </g>
            )}

            {timeCondition === 'dark_night' && (
              <g className="animate-pulse">
                {/* O2 Influx (Air into Mitochondrion) */}
                <g transform="translate(300, 30)">
                  <path d="M 25 0 L 25 50" stroke="#38BDF8" strokeWidth="3.5" />
                  <polygon points="20,40 25,55 30,40" fill="#38BDF8" />
                  <rect x="0" y="10" width="50" height="20" rx="4" fill="#0369A1" />
                  <text x="25" y="24" fill="#E0F2FE" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    O₂ IN ↓
                  </text>
                </g>
                {/* CO2 Efflux (Mitochondrion into Air) */}
                <g transform="translate(360, 30)">
                  <path d="M 25 55 L 25 5" stroke="#F59E0B" strokeWidth="3.5" />
                  <polygon points="20,15 25,0 30,15" fill="#F59E0B" />
                  <rect x="0" y="25" width="50" height="20" rx="4" fill="#78350F" />
                  <text x="25" y="39" fill="#FDE68A" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    CO₂ OUT ↑
                  </text>
                </g>
              </g>
            )}
          </svg>

          {/* Real-time Net Balance Strip */}
          <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-400">Carbon Dioxide:</span>
              <span className="font-bold text-amber-300">{current.netCo2}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-400">Oxygen Gas:</span>
              <span className="font-bold text-sky-300">{current.netO2}</span>
            </div>
          </div>
        </div>

        {/* Biological Deep Dive Card */}
        <div className="lg:col-span-4 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Diurnal Biology
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {current.description}
            </p>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Exam Rationale:
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <p>
                <strong className="text-slate-200">The Compensation Point:</strong> Defined as the light intensity at which the rate of photosynthesis exactly equals the rate of cellular respiration. At this point, the plant neither gains nor loses dry mass.
              </p>
              <p>
                <strong className="text-slate-200">Sleeping with Plants:</strong> At night, plants consume oxygen and release carbon dioxide, which is why dense indoor plants in unventilated bedrooms compete for oxygen!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
