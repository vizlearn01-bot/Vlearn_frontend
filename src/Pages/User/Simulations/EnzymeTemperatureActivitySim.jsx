import React, { useState } from 'react';
import { Thermometer, Zap, RotateCcw, AlertTriangle, CheckCircle2, TrendingUp, Info } from 'lucide-react';

export default function EnzymeTemperatureActivitySim({ config = {}, onTelemetry }) {
  // Primary Variable: Temperature in Celsius (0 - 70°C)
  const [temperature, setTemperature] = useState(37);

  // Biological calculation of enzyme activity (standard bell-shaped thermal denaturation curve)
  // Optimum is around 37°C (100% activity)
  // Below 37°C: Q10 approx 2 (activity drops towards 5% at 0°C)
  // Above 40°C: Denaturation causes steep plunge to 0% at ~60°C
  const calculateActivity = (t) => {
    if (t <= 37) {
      // Exponential rise due to kinetic collisions: (t / 37)^2 * 100
      return Math.max(2, Math.round(Math.pow(t / 37, 2.2) * 100));
    } else {
      // Steep thermal denaturation plunge
      const excess = t - 37;
      const factor = Math.max(0, 1 - Math.pow(excess / 23, 2.4));
      return Math.round(factor * 100);
    }
  };

  const activityPercent = calculateActivity(temperature);

  // Biological classification
  const getThermalStatus = (t) => {
    if (t < 15) {
      return {
        label: 'Low Kinetic Energy (Inactive)',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/20',
        border: 'border-cyan-500/30',
        description: 'Molecules move very slowly due to low kinetic thermal energy. Collisions between enzyme active sites and substrates are rare. Enzyme structure remains intact and undamaged.',
        denatured: false
      };
    } else if (t >= 15 && t < 33) {
      return {
        label: 'Accelerating Kinetic Collisions',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/20',
        border: 'border-emerald-500/30',
        description: 'Rising thermal energy increases molecular velocity and kinetic collisions. More substrate molecules collide with active sites per second, forming more enzyme-substrate complexes.',
        denatured: false
      };
    } else if (t >= 33 && t <= 40) {
      return {
        label: 'Optimum Temperature (Max Activity)',
        color: 'text-amber-400',
        bg: 'bg-amber-500/20',
        border: 'border-amber-500/30',
        description: 'Enzyme functions at maximum catalytic efficiency. The frequency of effective collisions with sufficient activation energy is maximized without destabilizing the tertiary protein structure.',
        denatured: false
      };
    } else if (t > 40 && t <= 52) {
      return {
        label: 'Thermal Denaturation Beginning',
        color: 'text-orange-400',
        bg: 'bg-orange-500/20',
        border: 'border-orange-500/30',
        description: 'Excessive thermal vibrations begin rupturing delicate intra-molecular hydrogen and ionic bonds maintaining the tertiary structure. Active sites begin warping, preventing substrate binding.',
        denatured: true
      };
    } else {
      return {
        label: 'Complete Irreversible Denaturation',
        color: 'text-rose-400',
        bg: 'bg-rose-500/20',
        border: 'border-rose-500/30',
        description: 'Tertiary globular architecture is completely destroyed. The active site is permanently distorted; substrates cannot bind. Catalytic activity drops to zero permanently.',
        denatured: true
      };
    }
  };

  const status = getThermalStatus(temperature);

  const handleTempChange = (val) => {
    const newTemp = parseInt(val, 10);
    setTemperature(newTemp);
    if (newTemp >= 35 && newTemp <= 40) {
      onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'enzyme_temperature_activity',
        optimumReached: true
      });
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Effect of Temperature on Enzyme Activity
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Chemicals of Life (Salivary Amylase / Human Enzyme Model)
            </p>
          </div>
        </div>
        <button
          onClick={() => setTemperature(37)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset to 37°C
        </button>
      </div>

      {/* Primary Variable Control: Temperature Slider & Presets */}
      <div className="flex flex-col gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Variable: Incubation Temperature
            </span>
            <span className="text-lg font-extrabold text-white px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700">
              {temperature}°C
            </span>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleTempChange(5)}
              className="text-xs px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 hover:bg-cyan-900/60 transition"
            >
              5°C (Ice/Cold)
            </button>
            <button
              onClick={() => handleTempChange(20)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition"
            >
              20°C (Room Temp)
            </button>
            <button
              onClick={() => handleTempChange(37)}
              className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition font-bold"
            >
              37°C (Optimum)
            </button>
            <button
              onClick={() => handleTempChange(60)}
              className="text-xs px-2.5 py-1 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800/50 hover:bg-rose-900/60 transition"
            >
              60°C (Denatured)
            </button>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="70"
          step="1"
          value={temperature}
          onChange={(e) => handleTempChange(e.target.value)}
          className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
        />

        <div className="flex justify-between text-[11px] text-slate-400 px-1 font-mono">
          <span>0°C (Freezing)</span>
          <span>20°C</span>
          <span className="text-amber-400 font-bold">37°C (Human Optimum)</span>
          <span>50°C</span>
          <span className="text-rose-400 font-bold">70°C (Denatured)</span>
        </div>
      </div>

      {/* Main Simulation Viewport: Graph + Molecular Structural View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Visual Graph & Active Site State */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-rose-400" /> Reaction Rate Curve
            </span>
            <span className="text-xs font-mono font-bold text-slate-300">
              Activity: <strong className="text-white text-sm">{activityPercent}%</strong>
            </span>
          </div>

          {/* SVG Bell-Curve Chart */}
          <svg viewBox="0 0 400 220" className="w-full h-auto select-none">
            {/* Grid & axes */}
            <line x1="45" y1="180" x2="380" y2="180" stroke="#475569" strokeWidth="1.5" />
            <line x1="45" y1="20" x2="45" y2="180" stroke="#475569" strokeWidth="1.5" />

            {/* Y-Axis Labels */}
            <text x="38" y="25" fill="#94A3B8" fontSize="9" textAnchor="end">100%</text>
            <text x="38" y="105" fill="#94A3B8" fontSize="9" textAnchor="end">50%</text>
            <text x="38" y="180" fill="#94A3B8" fontSize="9" textAnchor="end">0%</text>
            <text x="18" y="100" fill="#94A3B8" fontSize="9.5" textAnchor="middle" transform="rotate(-90 18 100)">
              Rate of Reaction
            </text>

            {/* X-Axis Labels */}
            <text x="45" y="195" fill="#94A3B8" fontSize="9" textAnchor="middle">0°C</text>
            <text x="140" y="195" fill="#94A3B8" fontSize="9" textAnchor="middle">20°C</text>
            <text x="225" y="195" fill="#F59E0B" fontSize="9.5" fontWeight="bold" textAnchor="middle">37°C</text>
            <text x="288" y="195" fill="#94A3B8" fontSize="9" textAnchor="middle">50°C</text>
            <text x="380" y="195" fill="#EF4444" fontSize="9" textAnchor="middle">70°C</text>
            <text x="220" y="212" fill="#94A3B8" fontSize="10" textAnchor="middle">
              Temperature (°C)
            </text>

            {/* Theoretical Bell-Shaped Curve */}
            {/* Points: 0C->2% (45, 177), 20C->25% (140, 140), 30C->60% (190, 85), 37C->100% (225, 25), 45C->60% (265, 85), 55C->15% (312, 155), 62C->0% (345, 180) */}
            <path
              d="M 45 177 
                 C 100 175, 160 160, 190 110
                 C 205 85, 218 25, 225 25
                 C 232 25, 248 50, 265 90
                 C 285 135, 310 175, 345 180
                 L 380 180"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Shaded optimum zone */}
            <rect x="210" y="20" width="30" height="160" fill="#F59E0B" fillOpacity="0.08" />
            <line x1="225" y1="20" x2="225" y2="180" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" />

            {/* Dynamic Current Point on Curve */}
            {(() => {
              // Map temperature (0 - 70) to SVG x coordinate: 45 to 380 (span = 335)
              const cx = 45 + (temperature / 70) * 335;
              // Map activity (0 - 100%) to SVG y coordinate: 180 to 25 (span = 155)
              const cy = 180 - (activityPercent / 100) * 155;
              return (
                <g>
                  {/* Vertical guide line */}
                  <line x1={cx} y1={cy} x2={cx} y2="180" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx={cx} cy={cy} r="6.5" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx={cx} cy={cy} r="12" fill="#F43F5E" fillOpacity="0.2" />
                </g>
              );
            })()}
          </svg>

          {/* Molecular Active Site Graphic */}
          <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Active Site Mini Canvas */}
              <svg width="80" height="60" viewBox="0 0 80 60" className="shrink-0">
                {status.denatured ? (
                  // Distorted, warped, collapsed active site
                  <path
                    d="M 5 50 C 15 15, 30 40, 45 20 C 55 5, 70 30, 75 50 Z"
                    fill="#EF4444"
                    fillOpacity="0.3"
                    stroke="#EF4444"
                    strokeWidth="2.5"
                  />
                ) : (
                  // Precise, clean complementary pocket
                  <path
                    d="M 5 50 C 5 20, 25 20, 30 35 A 12 12 0 0 0 50 35 C 55 20, 75 20, 75 50 Z"
                    fill="#10B981"
                    fillOpacity="0.3"
                    stroke="#10B981"
                    strokeWidth="2.5"
                  />
                )}
              </svg>
              <div>
                <span className="text-xs font-bold text-white block">
                  Active Site Conformation:
                </span>
                <span className={`text-xs font-semibold ${status.denatured ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {status.denatured ? 'Distorted (Denatured - No E-S Fit)' : 'Native 3D Shape (Complementary Fit)'}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Kinetic Speed</span>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {temperature < 20 ? 'Slow' : temperature < 45 ? 'Fast' : 'Violent (Destructive)'}
              </span>
            </div>
          </div>
        </div>

        {/* Biological Interpretation & Explanatory Card */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${status.bg} ${status.border}`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5 ${status.color}`}>
                {status.denatured ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                State at {temperature}°C
              </span>
              <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-900/60">
                {activityPercent}% Rate
              </span>
            </div>

            <h4 className={`text-sm font-bold ${status.color}`}>
              {status.label}
            </h4>

            <p className="text-xs text-slate-200 leading-relaxed">
              {status.description}
            </p>
          </div>

          {/* Key KCSE / Grade 10 Exam Concepts */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 flex flex-col gap-2 text-xs text-slate-300">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-400" /> Key Biological Principles:
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-slate-400">
              <li>
                <strong className="text-slate-200">Optimum Temperature:</strong> The temperature at which enzyme activity is maximum (~37°C for human enzymes like amylase).
              </li>
              <li>
                <strong className="text-slate-200">Reversibility of Inactivity:</strong> Below optimum, enzymes are inactivated due to low kinetic collisions, but they reactivate when warmed.
              </li>
              <li>
                <strong className="text-slate-200">Irreversibility of Denaturation:</strong> Above 50–60°C, thermal energy permanently disrupts hydrogen bonds; cooling the enzyme does NOT restore activity.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
