import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, Sliders, Sparkles, Sun } from 'lucide-react';

export default function PhotonIntensityCurrentSim({ config = {}, onTelemetry }) {
  const [intensityPercent, setIntensityPercent] = useState(60); // 10% - 100%
  const [collectorVoltage, setCollectorVoltage] = useState(1.5); // -3.0V to +3.0V
  const [aboveThreshold, setAboveThreshold] = useState(true);
  const [userAns, setUserAns] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  // Constants
  const stoppingPotentialVs = 1.8; // Volts
  // Photocurrent calculation
  let photocurrentMA = 0;
  if (aboveThreshold) {
    if (collectorVoltage >= -stoppingPotentialVs) {
      const saturationFactor = Math.min(1.0, (collectorVoltage + stoppingPotentialVs) / 1.5);
      photocurrentMA = (intensityPercent / 100) * (5.0 * saturationFactor);
    }
  }

  const handleReset = () => {
    setIntensityPercent(60);
    setCollectorVoltage(1.5);
    setAboveThreshold(true);
    setQuizStatus(null);
    setUserAns('');
  };

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const val = parseFloat(userAns.trim());
    // If light intensity is doubled from 50 W/m^2 to 100 W/m^2 at constant frequency f > f0, saturation photocurrent doubles (factor of 2)
    if (Math.abs(val - 2.0) < 0.2 || Math.abs(val - 2) < 0.2) {
      setQuizStatus('correct');
      if (onTelemetry) onTelemetry('photon_intensity_quiz_correct', { problem: 'current_proportionality' });
    } else {
      setQuizStatus('incorrect');
    }
  };

  // SVG I-V curve
  const graphW = 320;
  const graphH = 150;
  const originX = 35;
  const originY = graphH + 10;

  // Voltage domain: -3V to +3V
  const getCurvePath = (intens) => {
    const points = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const v = -3.0 + (i / steps) * 6.0;
      const x = originX + (i / steps) * graphW;
      let cur = 0;
      if (v >= -stoppingPotentialVs) {
        const sat = Math.min(1.0, (v + stoppingPotentialVs) / 1.5);
        cur = (intens / 100) * (5.0 * sat);
      }
      const y = originY - (cur / 5.5) * graphH;
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return 'M ' + points.join(' L ');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              PHYSICS FORM 4 • TOPIC 9
            </span>
            <span className="text-xs text-slate-400 font-mono">Quantum Photon Flux Analysis</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Sun className="w-6 h-6 text-violet-400" />
            Photon Flux & Photocurrent vs Light Intensity Simulator
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Experiment
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* I-V Characteristic Curves (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-400" /> Photocurrent (I) vs Anode Voltage (V) Family Curves
            </span>
            <span className="font-mono text-violet-400 bg-violet-950/60 border border-violet-800/60 px-2 py-0.5 rounded-lg">
              I = {photocurrentMA.toFixed(2)} mA
            </span>
          </div>

          {/* SVG I-V Curves */}
          <div className="w-full h-[240px] bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
            <svg viewBox={`0 0 ${graphW + 40} ${graphH + 40}`} className="w-full h-full">
              {/* Axes */}
              <line x1="35" y1="10" x2="35" y2={graphH + 10} stroke="#475569" strokeWidth="1.5" />
              {/* Voltage zero axis (x = 35 + graphW/2) */}
              <line x1={35 + graphW / 2} y1="10" x2={35 + graphW / 2} y2={graphH + 10} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="35" y1={graphH + 10} x2={graphW + 35} y2={graphH + 10} stroke="#475569" strokeWidth="1.5" />
              <text x="30" y="20" fill="#94a3b8" fontSize="8" textAnchor="end">I (mA)</text>
              <text x={graphW + 35} y={graphH + 25} fill="#94a3b8" fontSize="8" textAnchor="end">V (Volts)</text>

              {/* Reference Curves for Different Intensities */}
              <path d={getCurvePath(30)} fill="none" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" />
              <path d={getCurvePath(70)} fill="none" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 3" />

              {/* Active Current Curve */}
              {aboveThreshold && (
                <path
                  d={getCurvePath(intensityPercent)}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  className="drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                />
              )}

              {/* Operating Operating Point Dot */}
              {aboveThreshold && (
                (() => {
                  const currentX = 35 + ((collectorVoltage + 3.0) / 6.0) * graphW;
                  const currentY = graphH + 10 - (photocurrentMA / 5.5) * graphH;
                  return <circle cx={currentX} cy={currentY} r="5" fill="#38bdf8" className="animate-pulse" />;
                })()
              )}

              {/* Stopping Potential Marker -Vs */}
              {(() => {
                const vsX = 35 + ((-stoppingPotentialVs + 3.0) / 6.0) * graphW;
                return (
                  <g>
                    <line x1={vsX} y1={graphH + 5} x2={vsX} y2={graphH + 15} stroke="#ef4444" strokeWidth="2" />
                    <text x={vsX} y={graphH + 25} fill="#ef4444" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                      -Vs (-1.8V)
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-300">
            <span>
              Stopping Potential: <strong className="text-rose-400 font-mono">-1.80 V (Invariant to Intensity!)</strong>
            </span>
            <span>
              Saturation Current: <strong className="text-violet-400 font-mono">{((intensityPercent / 100) * 5.0).toFixed(2)} mA</strong>
            </span>
          </div>
        </div>

        {/* Controls (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-violet-400" /> Flux & Potential Settings
            </div>

            {/* Threshold condition toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setAboveThreshold(true)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  aboveThreshold ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                f &gt; f₀ (UV Light)
              </button>
              <button
                onClick={() => setAboveThreshold(false)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  !aboveThreshold ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                f &lt; f₀ (Red Light)
              </button>
            </div>

            {/* Light Intensity Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Light Intensity (Photon Flux):</span>
                <span className="font-mono font-bold text-violet-400">{intensityPercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={intensityPercent}
                onChange={(e) => setIntensityPercent(Number(e.target.value))}
                className="w-full accent-violet-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Number of photons arriving per second. Doubles photocurrent but has zero effect on stopping potential!
              </p>
            </div>

            {/* Collector Anode Voltage Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Collector Potential (V):</span>
                <span className="font-mono font-bold text-cyan-400">{collectorVoltage >= 0 ? `+${collectorVoltage.toFixed(1)}` : collectorVoltage.toFixed(1)} V</span>
              </div>
              <input
                type="range"
                min="-3.0"
                max="3.0"
                step="0.1"
                value={collectorVoltage}
                onChange={(e) => setCollectorVoltage(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Classical vs Quantum Insight */}
            <div className="p-3 bg-violet-950/30 border border-violet-800/40 rounded-xl text-[11px] text-violet-300 leading-relaxed">
              <strong>Crucial Quantum Law:</strong> If <em>f &lt; f₀</em>, photocurrent is exactly ZERO regardless of whether intensity is 10% or 1000%! Light transfers energy as discrete individual quanta <em>E = hf</em>.
            </div>
          </div>
        </div>
      </div>

      {/* KCSE Exam Challenge */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            KCSE Exam Diagnostic: Current Proportionality
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          At a frequency above threshold (f &gt; f₀), light intensity incident on a photocathode is increased from <strong>50 W/m² to 100 W/m²</strong> (doubled). By what factor does the <strong>saturation photocurrent</strong> increase?
        </p>

        <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 2.0"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-violet-500 w-36"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Check Factor
          </button>
          {quizStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-violet-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Correct! Photocurrent is directly proportional to intensity (factor of 2).
            </span>
          )}
          {quizStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Incorrect. Photocurrent is directly proportional to photon flux ⟹ doubling intensity doubles current (factor of 2).
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
