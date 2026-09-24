import React, { useState } from 'react';
import { Lightbulb, RotateCcw, TrendingUp, Info, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

export default function LightIntensityPhotosynthesisSim({ config = {}, onTelemetry }) {
  // Primary Variable: Distance from Lamp to Waterweed in cm (10 to 80 cm)
  const [lampDistance, setLampDistance] = useState(30);

  // Light Intensity Calculation: Inverse Square Law I = 10000 / (d^2)
  // At 10 cm -> Intensity = 100 arbitrary units
  // At 80 cm -> Intensity = 1.56 arbitrary units
  const lightIntensity = Math.round((10000 / Math.pow(lampDistance, 2)) * 10) / 10;

  // Rate of Photosynthesis (Bubbles per minute):
  // Rises proportionally with intensity, then plateaus at maximum saturation around 45 bubbles/min
  // Formula: Rate = (MaxRate * Intensity) / (Km + Intensity)
  const maxRate = 50;
  const km = 15;
  const bubbleRate = Math.round((maxRate * lightIntensity) / (km + lightIntensity));

  // Determine Limiting Factor
  const isPlateau = lightIntensity > 35;

  const handleDistanceChange = (val) => {
    const d = parseInt(val, 10);
    setLampDistance(d);
    if (d <= 15) {
      onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'light_intensity_photosynthesis',
        saturationReached: true
      });
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
            <Lightbulb className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Rate of Photosynthesis: Light Intensity & Limiting Factors
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Plant Nutrition & Photosynthesis (Elodea Oxygen Bubble Model)
            </p>
          </div>
        </div>
        <button
          onClick={() => setLampDistance(30)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset Distance
        </button>
      </div>

      {/* Primary Variable Control: Lamp Distance Slider */}
      <div className="flex flex-col gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Variable: Lamp Distance (d)
            </span>
            <span className="text-lg font-extrabold text-white px-3 py-0.5 rounded-lg bg-slate-800 border border-slate-700">
              {lampDistance} cm
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-amber-300">
              Relative Light Intensity (1/d²): <strong className="text-white text-sm">{lightIntensity} a.u.</strong>
            </span>
            <span className="text-cyan-300">
              Oxygen Production: <strong className="text-white text-sm">{bubbleRate} bubbles/min</strong>
            </span>
          </div>
        </div>

        <input
          type="range"
          min="10"
          max="80"
          step="2"
          value={lampDistance}
          onChange={(e) => handleDistanceChange(e.target.value)}
          className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />

        <div className="flex justify-between text-[11px] text-slate-400 px-1 font-mono">
          <span className="text-amber-400 font-bold">10 cm (Maximum Intensity)</span>
          <span>30 cm</span>
          <span>50 cm</span>
          <span>80 cm (Minimum Intensity)</span>
        </div>
      </div>

      {/* Main Simulation Viewport: Apparatus & Response Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Visual Lab Apparatus */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Aquatic Elodea Apparatus
            </span>
            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${
              isPlateau
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
            }`}>
              {isPlateau ? 'Plateau: Carbon Dioxide or Temp Limiting' : 'Light is the Limiting Factor'}
            </span>
          </div>

          {/* SVG Apparatus */}
          <svg viewBox="0 0 450 260" className="w-full h-auto select-none my-auto">
            <defs>
              <linearGradient id="lampGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FDE047" stopOpacity={Math.min(0.9, lightIntensity / 60)} />
                <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Bench surface */}
            <rect x="10" y="220" width="430" height="15" rx="3" fill="#334155" />

            {/* RULER Scale */}
            <line x1="80" y1="230" x2="380" y2="230" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 4" />
            <text x="380" y="244" fill="#94A3B8" fontSize="8" textAnchor="middle">0 cm</text>
            <text x="80" y="244" fill="#94A3B8" fontSize="8" textAnchor="middle">80 cm</text>

            {/* MOVABLE BENCH LAMP */}
            {(() => {
              // Map lampDistance (10 to 80 cm) to X position on canvas: 300 down to 40
              const lampX = 350 - ((lampDistance - 10) / 70) * 280;
              return (
                <g transform={`translate(${lampX}, 70)`} className="transition-all duration-200">
                  {/* Light Cone projecting right towards beaker */}
                  <polygon
                    points={`30,40 380,0 380,180 30,80`}
                    fill="url(#lampGlowGrad)"
                  />
                  {/* Lamp Shade & Bulb */}
                  <path d="M 0 30 L 30 40 L 30 80 L 0 90 Z" fill="#475569" stroke="#64748B" strokeWidth="2" />
                  <circle cx="28" cy="60" r="10" fill="#FDE047" />
                  <rect x="-15" y="55" width="15" height="10" fill="#334155" />
                  <path d="M -15 65 L -15 150 L 5 150" stroke="#475569" strokeWidth="3" fill="none" />
                  <text x="15" y="105" fill="#FDE047" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Lamp ({lampDistance} cm)
                  </text>
                </g>
              );
            })()}

            {/* EXPERIMENTAL BEAKER (Positioned at right: x = 330) */}
            <g transform="translate(330, 40)">
              {/* Outer Beaker */}
              <rect x="0" y="20" width="100" height="160" rx="8" fill="#0284C7" fillOpacity="0.25" stroke="#94A3B8" strokeWidth="2.5" />
              <text x="50" y="15" fill="#38BDF8" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                0.2% NaHCO₃ Solution
              </text>

              {/* Inverted Glass Funnel */}
              <polygon points="15,170 85,170 55,90 45,90" fill="#E2E8F0" fillOpacity="0.15" stroke="#CBD5E1" strokeWidth="1.5" />

              {/* Inverted Test Tube over Funnel Stem */}
              <rect x="42" y="30" width="16" height="70" rx="4" fill="#E2E8F0" fillOpacity="0.3" stroke="#CBD5E1" strokeWidth="2" />
              {/* Gas collection pocket at top of tube */}
              <rect x="44" y="32" width="12" height="15" fill="#0F172A" opacity="0.6" />
              <text x="50" y="28" fill="#34D399" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                O₂ Gas
              </text>

              {/* Elodea Canadian Waterweed Stems inside Funnel */}
              <path d="M 50 170 C 45 140, 55 120, 50 95" stroke="#16A34A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M 40 160 C 48 145, 45 130, 48 100" stroke="#15803D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Leaves */}
              <ellipse cx="43" cy="140" rx="7" ry="2.5" fill="#22C55E" transform="rotate(-25 43 140)" />
              <ellipse cx="57" cy="130" rx="7" ry="2.5" fill="#22C55E" transform="rotate(25 57 130)" />
              <ellipse cx="44" cy="115" rx="7" ry="2.5" fill="#22C55E" transform="rotate(-25 44 115)" />

              {/* Animated Oxygen Bubbles rising from cut stem (x: 50, y: 95) up into test tube */}
              {bubbleRate > 0 && (
                <g>
                  <circle cx="50" cy="85" r="2.5" fill="#FFFFFF" opacity="0.9" className="animate-ping" />
                  <circle cx="51" cy="65" r="2.2" fill="#FFFFFF" opacity="0.8" />
                  <circle cx="49" cy="50" r="2" fill="#FFFFFF" opacity="0.8" />
                  {bubbleRate > 25 && (
                    <>
                      <circle cx="52" cy="75" r="2" fill="#FFFFFF" opacity="0.7" />
                      <circle cx="48" cy="42" r="1.8" fill="#FFFFFF" opacity="0.7" />
                    </>
                  )}
                </g>
              )}
            </g>
          </svg>

          {/* Real-Time Telemetry Bar */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300">
                Oxygen Effervescence: <strong className="text-emerald-400">{bubbleRate} bubbles / min</strong>
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              1/d² = {(1 / Math.pow(lampDistance, 2)).toFixed(5)}
            </span>
          </div>
        </div>

        {/* Dynamic Rate Curve & Biological Analysis */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          {/* Rate Curve Card */}
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Rate of Photosynthesis Graph
              </span>
            </div>

            {/* SVG Graph */}
            <svg viewBox="0 0 280 150" className="w-full h-auto select-none">
              <line x1="35" y1="125" x2="260" y2="125" stroke="#64748B" strokeWidth="1.5" />
              <line x1="35" y1="15" x2="35" y2="125" stroke="#64748B" strokeWidth="1.5" />

              {/* Labels */}
              <text x="30" y="20" fill="#94A3B8" fontSize="8" textAnchor="end">Max</text>
              <text x="30" y="125" fill="#94A3B8" fontSize="8" textAnchor="end">0</text>
              <text x="14" y="70" fill="#94A3B8" fontSize="8.5" textAnchor="middle" transform="rotate(-90 14 70)">
                Rate (Bubbles/min)
              </text>
              <text x="150" y="142" fill="#94A3B8" fontSize="8.5" textAnchor="middle">
                Light Intensity (1/d²) →
              </text>

              {/* Saturation Curve */}
              {/* Curve rises from (35, 125) to (120, 45) then plateaus to (260, 40) */}
              <path
                d="M 35 125 C 70 80, 110 45, 150 42 L 260 40"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Plateau dashed boundary */}
              <line x1="140" y1="15" x2="140" y2="125" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" />
              <text x="145" y="25" fill="#F59E0B" fontSize="7.5" fontWeight="bold">
                Saturation Plateau
              </text>

              {/* Current operating point */}
              {(() => {
                // Map lightIntensity (1.5 to 100) to SVG x: 35 to 260
                const curX = 35 + (Math.min(100, lightIntensity) / 100) * 215;
                // Map bubbleRate (0 to 50) to SVG y: 125 down to 40
                const curY = 125 - (bubbleRate / 50) * 85;
                return (
                  <g>
                    <line x1={curX} y1={curY} x2={curX} y2="125" stroke="#F43F5E" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx={curX} cy={curY} r="5" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="1.5" />
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Biological Interpretation */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-2.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Limiting Factors Explained:
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <p>
                <strong className="text-slate-200">1. Linear Phase (Low Light):</strong> Light intensity is in short supply and directly limits the rate. Increasing light boosts photolysis and ATP generation.
              </p>
              <p>
                <strong className="text-slate-200">2. Plateau Phase (High Light):</strong> Further increasing light has no effect on rate. Light is no longer limiting; the rate is now capped by <span className="text-amber-300 font-semibold">CO₂ concentration</span> or <span className="text-amber-300 font-semibold">temperature (enzyme speed)</span>.
              </p>
              <p>
                <strong className="text-slate-200">NaHCO₃ Role:</strong> Dissolved sodium hydrogen carbonate releases carbon dioxide to ensure CO₂ does not become prematurely limiting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
