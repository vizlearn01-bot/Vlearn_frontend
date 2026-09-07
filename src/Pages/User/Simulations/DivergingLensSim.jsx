import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Sparkles, CheckCircle2, ShieldCheck, Sliders, Info } from 'lucide-react';

const PRESETS = [
  { id: 'near', title: 'Object Near', sub: 'u = 8.0 cm', u: 8 },
  { id: 'mid', title: 'Object Middle', sub: 'u = 20.0 cm', u: 20 },
  { id: 'far', title: 'Object Far', sub: 'u = 35.0 cm', u: 35 },
];

const F = 15; // Focal length magnitude in cm (f = -15 cm)
const OBJ_H = 5; // Object height in cm

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function DivergingLensSim({ onTelemetry }) {
  const [activePreset, setActivePreset] = useState(PRESETS[1]); // Mid (u = 20 cm)
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const calculateOptics = useCallback((u) => {
    const f = -F;
    const v = (f * u) / (u - f);
    const m = -v / u;
    const h = OBJ_H * m;
    return { v, m, h };
  }, []);

  const drawScene = useCallback(
    (progress) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.width;
      const H = canvas.height;
      const cy = H / 2;
      const scale = 6.8;
      const lensX = 300;

      ctx.clearRect(0, 0, W, H);

      // Principal Optical Axis
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      const u = activePreset.u;
      const { v, m, h } = calculateOptics(u);
      const objX = lensX - u * scale;
      const objTopY = cy - OBJ_H * scale;
      const imgX = lensX + v * scale;
      const imgTopY = cy - h * scale;

      // Focal Points F and F'
      ctx.fillStyle = '#f59e0b';
      [lensX - F * scale, lensX + F * scale].forEach((x) => {
        ctx.beginPath();
        ctx.arc(x, cy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('F', lensX - F * scale, cy + 18);
      ctx.fillText('F\'', lensX + F * scale, cy + 18);

      // Concave Diverging Lens Profile
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(lensX - 14, cy - 55, 55, -0.55, 0.55);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(lensX + 14, cy + 55, 55, Math.PI - 0.55, Math.PI + 0.55);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lensX, cy - 100);
      ctx.lineTo(lensX, cy + 100);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const pObj = Math.min(1, progress / 0.15);
      const pRay1 = Math.max(0, Math.min(1, (progress - 0.12) / 0.2));
      const pRay2 = Math.max(0, Math.min(1, (progress - 0.3) / 0.2));
      const pImg = Math.max(0, Math.min(1, (progress - 0.55) / 0.25));

      // Draw Object
      if (pObj > 0) {
        const curTop = cy - (cy - objTopY) * easeOutCubic(pObj);
        ctx.strokeStyle = '#38bdf8';
        ctx.fillStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(objX, cy);
        ctx.lineTo(objX, curTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(objX, curTop);
        ctx.lineTo(objX - 5, curTop + 8);
        ctx.lineTo(objX + 5, curTop + 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Object', objX, cy + 20);
      }

      // Helper for animated path
      const drawPartial = (pts, fraction, strokeCol) => {
        if (fraction <= 0) return;
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        let total = 0;
        for (let i = 0; i < pts.length - 1; i++) {
          total += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
        }
        let target = fraction * total;
        let acc = 0;
        for (let i = 0; i < pts.length - 1; i++) {
          const seg = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
          if (target >= acc + seg) {
            ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
          } else {
            const t = (target - acc) / seg;
            ctx.lineTo(pts[i].x + (pts[i + 1].x - pts[i].x) * t, pts[i].y + (pts[i + 1].y - pts[i].y) * t);
            break;
          }
          acc += seg;
        }
        ctx.stroke();
      };

      // Ray 1: Parallel to axis, diverges away from virtual focus F
      const ray1DivergeSlope = (cy - objTopY) / (F * scale);
      const ray1pts = [
        { x: objX, y: objTopY },
        { x: lensX, y: objTopY },
        { x: lensX + 600, y: objTopY - ray1DivergeSlope * 600 },
      ];
      drawPartial(ray1pts, pRay1, '#f87171');

      // Virtual back-extension of Ray 1 through F
      if (pRay1 > 0.5) {
        ctx.strokeStyle = 'rgba(248, 113, 113, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(lensX, objTopY);
        ctx.lineTo(lensX - F * scale, cy);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Ray 2: Undeviated through optical centre
      const slope2 = (cy - objTopY) / (lensX - objX);
      const ray2pts = [
        { x: objX, y: objTopY },
        { x: lensX + 600, y: objTopY + slope2 * (lensX + 600 - objX) },
      ];
      drawPartial(ray2pts, pRay2, '#22d3ee');

      // Virtual Image (Dashed, Upright, Diminished)
      if (pImg > 0) {
        const curTop = cy - (cy - imgTopY) * easeOutCubic(pImg);
        ctx.strokeStyle = '#10b981';
        ctx.fillStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(imgX, cy);
        ctx.lineTo(imgX, curTop);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.moveTo(imgX, curTop);
        ctx.lineTo(imgX - 5, curTop + 8);
        ctx.lineTo(imgX + 5, curTop + 8);
        ctx.closePath();
        ctx.fill();

        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Virtual Image', imgX, curTop - 10);
      }
    },
    [activePreset, calculateOptics]
  );

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowResults(false);
    startTimeRef.current = null;

    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const dur = 2000;
      const p = Math.min(1, elapsed / dur);

      drawScene(p);

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
        setShowResults(true);
        if (typeof onTelemetry === 'function') {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            simulation: 'diverging_lens_simulator',
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
    setShowResults(false);
    drawScene(0);
  };

  useEffect(() => {
    handleReset();
    drawScene(0);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activePreset]);

  const { v, m, h } = calculateOptics(activePreset.u);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-sans text-slate-900">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
              Form 4 Physics · Thin Lenses
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
            Diverging (Concave) Lens: The Virtual Invariant Law
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-mono bg-rose-950/80 border border-rose-500/30 text-rose-200 px-3 py-1 rounded-full">
            f = −15.0 cm (fixed)
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Always Virtual & Diminished
          </span>
        </div>
      </div>

      {/* Ray Diagram Stage */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between px-1 text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-slate-300">
            Concave Lens Ray Construction Diagram
          </span>
          <span className="font-mono text-emerald-400">v = {v.toFixed(2)} cm (Virtual)</span>
        </div>

        <canvas
          ref={canvasRef}
          width={880}
          height={300}
          className="w-full h-auto block rounded-xl bg-slate-900/90 select-none"
        />

        {/* Ray Key */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-red-400 rounded-full" /> Ray 1: Parallel &rarr; Diverges along virtual F line
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400 rounded-full" /> Ray 2: Undeviated through Optical Centre
          </span>
        </div>
      </div>

      {/* Invariant Principle Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-center text-xs text-emerald-900 font-semibold flex items-center justify-center gap-2 shadow-2xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Fundamental Optical Invariant: For any real object placed in front of a diverging lens (u &gt; 0), the image is <strong>always virtual, upright, and diminished</strong> located between F and the lens.
        </span>
      </div>

      {/* Bottom Grid: Object Positions & Quantitative Readouts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Presets (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-rose-600" />
              1. Move Object Distance
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((p) => {
                const isActive = activePreset.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePreset(p)}
                    disabled={isRunning}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{p.title}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{p.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? 'Tracing Diverging Rays...' : 'Run Diverging Ray Simulation'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Live Values (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            2. Virtual Image Characteristics
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Image Distance (v)</span>
              <span className="font-bold text-slate-800 text-sm">
                {showResults ? `${v.toFixed(2)} cm` : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Magnification (m)</span>
              <span className="font-bold text-emerald-700 text-sm">
                {showResults ? m.toFixed(3) : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Image Height</span>
              <span className="font-bold text-slate-800 text-sm">
                {showResults ? `${h.toFixed(2)} cm` : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Image Nature</span>
              <span className="font-bold text-emerald-600 text-xs font-sans">
                {showResults ? 'Virtual & Upright' : '—'}
              </span>
            </div>
          </div>

          {/* Real-World Optics Practical Application */}
          <div className="p-2.5 bg-rose-50/80 border border-rose-200/70 rounded-xl text-[11px] text-rose-950 leading-relaxed font-medium">
            <Info className="w-3.5 h-3.5 text-rose-600 inline mr-1 -mt-0.5" />
            Because a diverging lens always maintains a diminished, upright virtual image, it is the optical component of choice for <strong>door security peepholes</strong> (providing a wide field of view) and <strong>spectacles for myopia</strong> (diverging rays before they reach the eye lens).
          </div>
        </div>
      </div>
    </div>
  );
}
