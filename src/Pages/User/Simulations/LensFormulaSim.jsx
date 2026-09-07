import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Sparkles, CheckCircle2, TrendingUp, Sliders, Calculator, Info } from 'lucide-react';

const PRESETS = [
  { id: 'camera', title: 'Camera Setup', sub: 'u = 40.0 cm', u: 40 },
  { id: 'projector', title: 'Projector Setup', sub: 'u = 22.0 cm', u: 22 },
  { id: 'twof', title: 'At 2F Setup', sub: 'u = 30.0 cm', u: 30 },
  { id: 'magnifier', title: 'Magnifier Setup', sub: 'u = 9.0 cm', u: 9 },
];

const F = 15; // Focal length in cm
const OBJ_H = 5; // Object height in cm

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function LensFormulaSim({ onTelemetry }) {
  const [activePreset, setActivePreset] = useState(PRESETS[2]);
  const [isRunning, setIsRunning] = useState(false);
  const [stepLevel, setStepLevel] = useState(0); // 0, 1, 2, 3
  const [showResults, setShowResults] = useState(false);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const calculateOptics = useCallback((u) => {
    const v = (F * u) / (u - F);
    const m = -v / u;
    const h = OBJ_H * m;
    const invU = 1 / u;
    const invV = 1 / F - invU;
    return { v, m, h, invU, invV };
  }, []);

  const drawGraph = useCallback((prog) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const pad = 42;
    const gw = W - 2 * pad;
    const gh = H - 2 * pad;
    const maxInv = 0.14;

    const toPx = (iu, iv) => ({
      x: pad + (iu / maxInv) * gw,
      y: H - pad - (iv / maxInv) * gh,
    });

    ctx.clearRect(0, 0, W, H);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 7; i++) {
      const val = (maxInv * i) / 7;
      const pt = toPx(val, 0);
      ctx.beginPath();
      ctx.moveTo(pt.x, H - pad);
      ctx.lineTo(pt.x, pad);
      ctx.stroke();

      const ptY = toPx(0, val);
      ctx.beginPath();
      ctx.moveTo(pad, ptY.y);
      ctx.lineTo(W - pad, ptY.y);
      ctx.stroke();
    }

    // Graph Axes
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad, H - pad);
    ctx.lineTo(W - pad, H - pad);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pad, H - pad);
    ctx.lineTo(pad, pad);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('1/u (cm⁻¹)', W / 2, H - 12);

    ctx.save();
    ctx.translate(14, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('1/v (cm⁻¹)', 0, 0);
    ctx.restore();

    // Theoretical Straight Line: 1/v = 1/f - 1/u
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= 100; i++) {
      const iu = (maxInv * i) / 100;
      const iv = 1 / F - iu;
      if (iv < 0) continue;
      const pt = toPx(iu, iv);
      if (!started) {
        ctx.moveTo(pt.x, pt.y);
        started = true;
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Animated point
    if (prog > 0) {
      const u = activePreset.u;
      const iu = 1 / u;
      const iv = 1 / F - iu;
      const targetPt = toPx(Math.min(iu, maxInv), Math.max(0, iv));

      const curX = pad + (targetPt.x - pad) * easeOutCubic(prog);
      const curY = H - pad + (targetPt.y - (H - pad)) * easeOutCubic(prog);

      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(curX, curY, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Coordinates text
      if (prog > 0.8) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = '10px ui-monospace, monospace';
        ctx.fillText(`(${iu.toFixed(3)}, ${iv.toFixed(3)})`, curX + 35, curY - 8);
      }
    }
  }, [activePreset]);

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setStepLevel(0);
    setShowResults(false);
    startTimeRef.current = null;

    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const dur = 1800;
      const p = Math.min(1, elapsed / dur);

      drawGraph(p);

      if (p > 0.2) setStepLevel(1);
      if (p > 0.5) setStepLevel(2);
      if (p > 0.8) setStepLevel(3);

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
        setShowResults(true);
        if (typeof onTelemetry === 'function') {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            simulation: 'lens_formula_calculator',
            preset: activePreset.id,
            u: activePreset.u,
          });
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  const handleReset = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsRunning(false);
    setStepLevel(0);
    setShowResults(false);
    drawGraph(0);
  };

  useEffect(() => {
    handleReset();
    drawGraph(0);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activePreset]);

  const { v, m, h, invU, invV } = calculateOptics(activePreset.u);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-sans text-slate-900">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              Form 4 Physics · Thin Lenses
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
            Verification of the Lens Formula: 1/f = 1/u + 1/v
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-mono bg-cyan-950/80 border border-cyan-500/30 text-cyan-200 px-3 py-1 rounded-full">
            f = 15.0 cm (convex)
          </span>
          <span className="text-xs font-mono bg-amber-950/80 border border-amber-500/30 text-amber-200 px-3 py-1 rounded-full">
            1/f = 0.0667 cm⁻¹
          </span>
        </div>
      </div>

      {/* Main Grid: Left Setup & Algebra, Right Live Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Column: Presets & Algebraic Substitution (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-600" />
              1. Choose Object Setup
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => {
                const isActive = activePreset.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePreset(p)}
                    disabled={isRunning}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-950 font-bold shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{p.title}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{p.sub}</div>
                  </button>
                );
              })}
            </div>

            {/* Step-by-Step Algebraic Substitution */}
            <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400 font-mono text-xs space-y-1.5 shadow-inner">
              <div className="text-amber-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between">
                <span>1/f = 1/u + 1/v</span>
                <span className="text-[10px] text-slate-400 font-normal">Thin Lens Law</span>
              </div>
              <div className={`transition-opacity duration-300 ${stepLevel >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                1/{F} = 1/{activePreset.u} + 1/v
              </div>
              <div className={`transition-opacity duration-300 ${stepLevel >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                1/v = 1/{F} − 1/{activePreset.u} = {(1 / F - 1 / activePreset.u).toFixed(4)} cm⁻¹
              </div>
              <div className={`text-white font-bold transition-opacity duration-300 ${stepLevel >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                v = <strong className="text-emerald-400">{v.toFixed(2)} cm</strong>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? 'Calculating & Plotting...' : 'Run & Verify Formula'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Right Column: Live Linear Graph (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              Live Linear Graph: 1/v against 1/u
            </span>
            <span className="text-[11px] text-amber-400">Slope = −1.00 | Intercept = 1/f</span>
          </div>

          <canvas
            ref={canvasRef}
            width={480}
            height={260}
            className="w-full h-auto block rounded-xl bg-slate-900/90 select-none"
          />

          <div className="text-[11px] text-slate-400 text-center">
            Plotting reciprocal pairs (1/u, 1/v) yields a straight line with both vertical and horizontal intercepts equal to 1/f.
          </div>
        </div>
      </div>

      {/* Quantitative Optical Outcomes */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Experimental Verification Results
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Image Distance (v)</span>
            <span className="font-bold text-slate-800 text-sm">{showResults ? `${v.toFixed(2)} cm` : '—'}</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Magnification (m = -v/u)</span>
            <span className="font-bold text-cyan-700 text-sm">{showResults ? m.toFixed(2) : '—'}</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Image Height (h)</span>
            <span className="font-bold text-slate-800 text-sm">{showResults ? `${Math.abs(h).toFixed(2)} cm` : '—'}</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">1/f Intercept Check</span>
            <span className="font-bold text-amber-700 text-sm">{showResults ? `${(1 / F).toFixed(4)} cm⁻¹` : '—'}</span>
          </div>
        </div>

        {showResults && (
          <div className="p-3 bg-cyan-50/80 border border-cyan-200/70 rounded-xl text-xs text-cyan-950 leading-relaxed font-medium animate-fadeIn">
            <Info className="w-3.5 h-3.5 text-cyan-600 inline mr-1 -mt-0.5" />
            The measured point lands precisely on the theoretical line, verifying that <strong>1/f = 1/u + 1/v</strong> holds true for all conjugate foci. In standard KCSE laboratory experiments, taking several (u, v) readings and plotting a 1/v vs 1/u graph gives a direct method to determine focal length with high precision from the axes intercepts.
          </div>
        )}
      </div>
    </div>
  );
}
