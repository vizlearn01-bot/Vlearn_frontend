import React, { useState, useMemo, useEffect } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  Target,
  Sparkles,
  Beaker
} from 'lucide-react';

export default function AcidBaseDissociationSim({ config = {}, onTelemetry }) {
  // Dynamic parameters from config
  const weakKa = config.weak_acid_ka || 0.000018;
  const minConc = config.min_concentration || 0.001;
  const maxConc = config.max_concentration || 1.0;
  const stepConc = config.step || 0.005;

  // Single Shared Concentration Slider Input (default 0.10 M)
  const [concentration, setConcentration] = useState(config.initial_concentration || 0.1);

  // Mission Achievement Tracking
  const [missionAchieved, setMissionAchieved] = useState(false);

  // Math Engine Calculations for both acids simultaneously
  const { h3oStrong, phStrong, condStrong, h3oWeak, phWeak, condWeak } = useMemo(() => {
    const C = Math.max(0.0001, concentration);

    // 1. Strong Acid: [H3O+] = C
    const h3oS = C;
    const phS = -Math.log10(h3oS);
    const condS = Math.min(1.0, h3oS / 0.1);

    // 2. Weak Acid: Solve quadratic [H3O+]^2 + Ka[H3O+] - Ka*C = 0
    const b = weakKa;
    const c = -weakKa * C;
    const h3oW = (-b + Math.sqrt(b * b - 4 * c)) / 2;
    const phW = -Math.log10(h3oW);
    const condW = Math.min(1.0, h3oW / 0.1);

    return {
      h3oStrong: h3oS,
      phStrong: phS,
      condStrong: condS,
      h3oWeak: h3oW,
      phWeak: phW,
      condWeak: condW
    };
  }, [concentration, weakKa]);

  // Check mission condition (slider set near 0.10 M)
  useEffect(() => {
    const isAtTarget = Math.abs(concentration - 0.1) < 0.025;
    if (isAtTarget && !missionAchieved) {
      setMissionAchieved(true);
      if (typeof onTelemetry === 'function') {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'chem_acid_base_dissociation',
          concentration,
          phStrong: Number(phStrong.toFixed(1)),
          phWeak: Number(phWeak.toFixed(1))
        });
      }
    }
  }, [concentration, missionAchieved, onTelemetry, phStrong, phWeak]);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-2 sm:p-4 bg-white rounded-3xl">
      {/* 1. SIMPLE MISSION CHALLENGE BANNER */}
      {!missionAchieved && (
        <div className="p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-orange-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-custom-orange text-white">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/70">
                  Mission Challenge
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">
                Move the slider to 0.10 M and compare the light bulb brightness between the two acids.
              </p>
            </div>
          </div>

          <button
            onClick={() => setConcentration(0.1)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap bg-custom-orange text-white hover:bg-orange-600 shadow-sm"
          >
            Set to 0.10 M
          </button>
        </div>
      )}

      {/* 2. UNIFIED SINGLE CONCENTRATION SLIDER */}
      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 shadow-inner space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Beaker className="w-4 h-4 text-custom-orange" />
            Acid Molar Concentration (C)
          </label>
          <span className="font-mono text-base font-extrabold text-custom-blue bg-white px-3.5 py-1 rounded-xl border border-blue-200 shadow-sm">
            {concentration.toFixed(2)} M
          </span>
        </div>

        <input
          type="range"
          min={minConc}
          max={maxConc}
          step={stepConc}
          value={concentration}
          onChange={(e) => setConcentration(parseFloat(e.target.value))}
          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-custom-orange"
        />

        <div className="flex justify-between text-[11px] font-medium text-slate-500">
          <span>0.001 M (Dilute)</span>
          <span className="font-bold text-slate-700">0.10 M (Standard)</span>
          <span>0.50 M</span>
          <span>1.00 M (Concentrated)</span>
        </div>
      </div>

      {/* 3. SIDE-BY-SIDE BEAKER COMPARISON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: STRONG ACID (HCl) */}
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 text-white flex flex-col items-center justify-between shadow-xl min-h-[420px] relative overflow-hidden">
          {/* Beaker Header */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-red-400">Strong Acid (HCl)</h3>
              <p className="text-[11px] text-slate-400">100% Fully Ionized</p>
            </div>
            {/* Digital pH Badge */}
            <div className="bg-red-950/80 border border-red-500/50 px-3 py-1.5 rounded-xl text-center shadow-lg">
              <span className="text-[9px] font-mono text-red-300 uppercase block leading-none mb-0.5">pH Meter</span>
              <span className="text-2xl font-mono font-extrabold text-red-400 tracking-wider">
                {phStrong.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Submerged Light Bulb Display */}
          <div className="my-4 flex flex-col items-center justify-center relative">
            <div className="relative flex flex-col items-center justify-center">
              {/* Radial Rays SVG */}
              <svg
                className="absolute -inset-8 w-40 h-40 pointer-events-none transition-all duration-300"
                viewBox="0 0 100 100"
                style={{ opacity: Math.max(0.15, condStrong) }}
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x1 = 50 + 22 * Math.cos(angle);
                  const y1 = 50 + 22 * Math.sin(angle);
                  const x2 = 50 + (32 + condStrong * 14) * Math.cos(angle);
                  const y2 = 50 + (32 + condStrong * 14) * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#FACC15"
                      strokeWidth={2 + condStrong * 2}
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>

              {/* Lightbulb Icon */}
              <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: `rgba(250, 204, 21, ${Math.max(0.1, condStrong * 0.95)})`,
                  boxShadow: `0 0 ${condStrong * 50}px ${condStrong * 22}px rgba(250, 204, 21, ${condStrong})`
                }}
              >
                <Lightbulb
                  className="w-10 h-10 transition-colors duration-300"
                  style={{
                    color: condStrong > 0.3 ? '#FFFFFF' : '#FACC15',
                    filter: `drop-shadow(0 0 8px rgba(250,204,21,${condStrong}))`
                  }}
                />
              </div>
            </div>
            <span className="mt-2 text-xs font-mono font-bold text-amber-300">
              Bulb Brightness: {(condStrong * 100).toFixed(0)}%
            </span>
          </div>

          {/* SVG Particle Chamber (Strong Acid) */}
          <div className="w-full space-y-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase text-center">
              Particle View (Free Ion Separation)
            </span>
            <svg className="w-full h-36 bg-slate-800/90 rounded-2xl border border-slate-700" viewBox="0 0 240 120">
              <rect x="5" y="20" width="230" height="95" fill="rgba(239, 68, 68, 0.12)" rx="6" />
              <line x1="5" y1="20" x2="235" y2="20" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />

              {/* Render 10 Red H+ and 10 Blue Cl- ions */}
              {Array.from({ length: 8 }).map((_, i) => {
                const cxH = 25 + (i % 4) * 52;
                const cyH = 35 + Math.floor(i / 4) * 40;
                const cxA = cxH + 22;
                const cyA = cyH + 12;
                return (
                  <g key={i}>
                    {/* Free H+ Ion (Red) */}
                    <circle cx={cxH} cy={cyH} r="8" fill="#EF4444" />
                    <text x={cxH} y={cyH + 3} textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
                      H⁺
                    </text>
                    {/* Free Cl- Ion (Blue) */}
                    <circle cx={cxA} cy={cyA} r="8" fill="#3B82F6" />
                    <text x={cxA} y={cyA + 3} textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
                      Cl⁻
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* CARD 2: WEAK ACID (CH₃COOH) */}
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 text-white flex flex-col items-center justify-between shadow-xl min-h-[420px] relative overflow-hidden">
          {/* Beaker Header */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-purple-400">Weak Acid (CH₃COOH)</h3>
              <p className="text-[11px] text-slate-400">Partial Equilibrium Ionization</p>
            </div>
            {/* Digital pH Badge */}
            <div className="bg-purple-950/80 border border-purple-500/50 px-3 py-1.5 rounded-xl text-center shadow-lg">
              <span className="text-[9px] font-mono text-purple-300 uppercase block leading-none mb-0.5">pH Meter</span>
              <span className="text-2xl font-mono font-extrabold text-purple-300 tracking-wider">
                {phWeak.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Submerged Light Bulb Display */}
          <div className="my-4 flex flex-col items-center justify-center relative">
            <div className="relative flex flex-col items-center justify-center">
              {/* Radial Rays SVG (Dim) */}
              <svg
                className="absolute -inset-8 w-40 h-40 pointer-events-none transition-all duration-300"
                viewBox="0 0 100 100"
                style={{ opacity: Math.max(0.1, condWeak) }}
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x1 = 50 + 22 * Math.cos(angle);
                  const y1 = 50 + 22 * Math.sin(angle);
                  const x2 = 50 + (26 + condWeak * 8) * Math.cos(angle);
                  const y2 = 50 + (26 + condWeak * 8) * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#FACC15"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>

              {/* Lightbulb Icon */}
              <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: `rgba(250, 204, 21, ${Math.max(0.05, condWeak * 0.95)})`,
                  boxShadow: `0 0 ${condWeak * 30}px ${condWeak * 10}px rgba(250, 204, 21, ${condWeak})`
                }}
              >
                <Lightbulb
                  className="w-10 h-10 transition-colors duration-300 text-amber-500/80"
                  style={{
                    filter: `drop-shadow(0 0 4px rgba(250,204,21,${condWeak}))`
                  }}
                />
              </div>
            </div>
            <span className="mt-2 text-xs font-mono font-bold text-amber-400/80">
              Bulb Brightness: {(condWeak * 100).toFixed(0)}% (Dim)
            </span>
          </div>

          {/* SVG Particle Chamber (Weak Acid) */}
          <div className="w-full space-y-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase text-center">
              Particle View (Mostly Bound HA Pairs)
            </span>
            <svg className="w-full h-36 bg-slate-800/90 rounded-2xl border border-slate-700" viewBox="0 0 240 120">
              <rect x="5" y="20" width="230" height="95" fill="rgba(168, 85, 247, 0.12)" rx="6" />
              <line x1="5" y1="20" x2="235" y2="20" stroke="#A855F7" strokeWidth="2" strokeDasharray="3 3" />

              {/* Render 7 Bound Purple HA pairs and 1 separated pair */}
              {Array.from({ length: 6 }).map((_, i) => {
                const cx = 30 + (i % 3) * 70;
                const cy = 40 + Math.floor(i / 3) * 40;
                return (
                  <g key={i} className="animate-pulse">
                    <rect x={cx - 15} y={cy - 9} width="30" height="18" rx="9" fill="#7E22CE" />
                    <circle cx={cx - 6} cy={cy} r="6" fill="#EF4444" />
                    <circle cx={cx + 6} cy={cy} r="6" fill="#3B82F6" />
                    <text x={cx} y={cy + 3} textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold">
                      HA
                    </text>
                  </g>
                );
              })}

              {/* 1 Separated Ion Pair */}
              <g>
                <circle cx="210" cy="40" r="8" fill="#EF4444" />
                <text x="210" y="43" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
                  H⁺
                </text>
                <circle cx="210" cy="85" r="8" fill="#3B82F6" />
                <text x="210" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold">
                  A⁻
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* 4. VISUAL PARTICLE LEGEND */}
      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-around gap-4 text-xs text-slate-700 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-red-500 inline-block shadow-sm" />
          <span>🔴 Free H⁺ Ions (Drives pH)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 inline-block shadow-sm" />
          <span>🔵 Free Anions (Cl⁻ / A⁻)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-3 rounded-full bg-purple-700 inline-block shadow-sm" />
          <span>🟣 Intact HA Molecules (Un-dissociated Weak Acid)</span>
        </div>
      </div>
    </div>
  );
}
