import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Sparkles, Sliders, Info } from 'lucide-react';

const LENSES = [
  { id: 'weakdiv', icon: '👓', title: 'Weak Diverging', sub: '−1.0 D', f: -100, use: 'Mild myopia (short-sightedness)' },
  { id: 'strongdiv', icon: '👓', title: 'Strong Diverging', sub: '−5.0 D', f: -20, use: 'Severe myopia correction' },
  { id: 'weakconv', icon: '👓', title: 'Weak Converging', sub: '+1.0 D', f: 100, use: 'Mild hyperopia (long-sightedness)' },
  { id: 'reading', icon: '📖', title: 'Reading Glass', sub: '+4.0 D', f: 25, use: 'Near-vision accommodation aid' },
  { id: 'magnifier', icon: '🔍', title: 'Magnifier', sub: '+10.0 D', f: 10, use: 'Handheld inspection lens' },
  { id: 'microscope', icon: '🔬', title: 'Microscope Objective', sub: '+40.0 D', f: 2.5, use: 'High numerical aperture magnification' },
];

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function LensPowerSim({ onTelemetry }) {
  const [activeLens, setActiveLens] = useState(LENSES[3]); // Reading glass (+4.0D)
  const [isRunning, setIsRunning] = useState(false);
  const [markerLeft, setMarkerLeft] = useState(50);
  const [showResults, setShowResults] = useState(false);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const fMeters = activeLens.f / 100;
  const powerDiopters = 1 / fMeters;
  const isConverging = activeLens.f > 0;

  const drawStage = useCallback(
    (progress) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.width;
      const H = canvas.height;
      const cy = H / 2;
      const lensX = W / 2;

      ctx.clearRect(0, 0, W, H);

      // Principal axis
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      const strength = Math.min(1, 100 / Math.abs(activeLens.f));
      const bow = 18 + 55 * strength;

      // Lens physical profile
      ctx.strokeStyle = isConverging ? '#10b981' : '#f43f5e';
      ctx.lineWidth = 3.5;

      if (isConverging) {
        ctx.beginPath();
        ctx.arc(lensX - 6, cy, bow, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(lensX + 6, cy, bow, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(lensX + bow * 0.6, cy, bow, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(lensX - bow * 0.6, cy, bow, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(lensX, cy - 90);
      ctx.lineTo(lensX, cy + 90);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Incoming parallel rays and refracted bending
      const nRays = 5;
      for (let i = 0; i < nRays; i++) {
        const startY = cy - 70 + i * 35;
        const midX = lensX;
        const endX = W - 10;
        const endY = isConverging
          ? startY + (cy - startY) * strength * 2 * easeOutCubic(progress)
          : startY + (startY - cy) * strength * 2 * easeOutCubic(progress);

        ctx.strokeStyle = `rgba(245, 158, 11, ${0.35 + 0.6 * progress})`;
        ctx.lineWidth = 1.8;

        ctx.beginPath();
        ctx.moveTo(10, startY);
        ctx.lineTo(midX, startY);
        const dx = endX - midX;
        const py = startY + (endY - startY) * easeOutCubic(progress);
        ctx.lineTo(midX + dx * easeOutCubic(progress), py);
        ctx.stroke();
      }

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isConverging ? 'Converging (Convex)' : 'Diverging (Concave)', lensX, 18);
    },
    [activeLens, isConverging]
  );

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowResults(false);
    startTimeRef.current = null;

    const targetPos = 50 + (powerDiopters / 10) * 50; // -10D to +10D mapped to 0..100%

    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const dur = 1600;
      const p = Math.min(1, elapsed / dur);

      drawStage(p);
      const curMarker = 50 + (targetPos - 50) * easeOutCubic(p);
      setMarkerLeft(Math.max(2, Math.min(98, curMarker)));

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
        setShowResults(true);
        if (typeof onTelemetry === 'function') {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            simulation: 'lens_power_diopters',
            lens: activeLens.id,
            f: activeLens.f,
            power: powerDiopters,
          });
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  const handleReset = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsRunning(false);
    setMarkerLeft(50);
    setShowResults(false);
    drawStage(0);
  };

  useEffect(() => {
    handleReset();
    drawStage(0);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeLens]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-sans text-slate-900">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
              Form 4 Physics · Thin Lenses
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
            Lens Power in Diopters: P = 1 / f (in metres)
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-mono bg-amber-950/80 border border-amber-500/30 text-amber-200 px-3 py-1 rounded-full">
            P = {powerDiopters > 0 ? `+${powerDiopters.toFixed(1)}` : powerDiopters.toFixed(1)} D
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
            isConverging
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}>
            {isConverging ? 'Converging Lens' : 'Diverging Lens'}
          </span>
        </div>
      </div>

      {/* Optical Bending Stage + Continuous Diopter Spectrum Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between px-1 text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-slate-300">
            Light Bending Strength & Refraction Geometry
          </span>
          <span className="font-mono text-amber-400">f = {activeLens.f} cm</span>
        </div>

        <canvas
          ref={canvasRef}
          width={880}
          height={200}
          className="w-full h-auto block rounded-xl bg-slate-900/90 select-none"
        />

        {/* Continuous Spectrum Bar */}
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
            <span className="text-rose-400 font-bold">−10.0 D (Strong Concave)</span>
            <span className="text-slate-400">0.0 D (Flat Glass)</span>
            <span className="text-emerald-400 font-bold">+10.0 D (Strong Convex)</span>
          </div>

          <div className="relative h-4 rounded-full bg-gradient-to-r from-rose-600 via-slate-600 to-emerald-600 overflow-visible shadow-inner">
            <div
              className="absolute top-[-7px] w-3 h-7 bg-white rounded-full border-2 border-slate-950 shadow-md transition-all duration-100 ease-out"
              style={{ left: `${markerLeft}%`, transform: 'translateX(-50%)' }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Grid: Controls & Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Preset Lenses (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              1. Choose a Standard Optical Lens
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LENSES.map((l) => {
                const isActive = activeLens.id === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setActiveLens(l)}
                    disabled={isRunning}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span>{l.icon}</span>
                      <span>{l.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{l.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? 'Simulating Refraction...' : 'Run Power Simulation'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Readout Results (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            2. Lens Power Equation Output
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Focal Length (f)</span>
              <span className="font-bold text-slate-800 text-sm">
                {activeLens.f} cm ({fMeters.toFixed(3)} m)
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Power (P = 1/f)</span>
              <span className="font-bold text-amber-700 text-sm">
                {powerDiopters > 0 ? `+${powerDiopters.toFixed(2)}` : powerDiopters.toFixed(2)} D
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl col-span-2">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Typical Clinical / Practical Use</span>
              <span className="font-bold text-slate-700 text-xs font-sans">{activeLens.use}</span>
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-2.5 bg-amber-50/80 border border-amber-200/70 rounded-xl text-[11px] text-amber-950 leading-relaxed font-medium">
            <Info className="w-3.5 h-3.5 text-amber-600 inline mr-1 -mt-0.5" />
            Opticians prescribe power in <strong>Dioptres (D)</strong> rather than focal length because when thin lenses are placed in combination, their powers sum directly: <strong>P = P₁ + P₂</strong>. A shorter focal length produces stronger bending and higher optical power.
          </div>
        </div>
      </div>
    </div>
  );
}
