import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, Play, RotateCcw, Sparkles, CheckCircle2, Sliders, Info } from 'lucide-react';

const PRESETS = [
  { id: 'beyond2f', title: 'Beyond 2F', sub: '📷 Camera Lens', u: 44 },
  { id: 'at2f', title: 'At 2F', sub: '⚖️ Same Size (1:1)', u: 30 },
  { id: 'between', title: 'F to 2F', sub: '📽️ Projector', u: 22 },
  { id: 'atf', title: 'At F', sub: '☀️ Rays Parallel', u: 15.01 },
  { id: 'insidef', title: 'Inside F', sub: '🔍 Magnifier', u: 9 },
];

const F = 15; // Focal length in cm
const OBJ_H = 5; // Object height in cm

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ConvexLensSim({ onTelemetry }) {
  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const calculateOptics = useCallback((u) => {
    const v = (F * u) / (u - F);
    const m = -v / u;
    const h = OBJ_H * m;
    return { v, m, h };
  }, []);

  const drawScene = useCallback((prog) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cy = H / 2;
    const scale = 7.8;
    const lensX = 260;

    ctx.clearRect(0, 0, W, H);

    // Principal Optical Axis
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
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

    // Focal Points F and 2F
    ctx.fillStyle = '#f59e0b';
    [lensX - F * scale, lensX + F * scale, lensX - 2 * F * scale, lensX + 2 * F * scale].forEach((x) => {
      ctx.beginPath();
      ctx.arc(x, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('F', lensX - F * scale, cy + 18);
    ctx.fillText('F\'', lensX + F * scale, cy + 18);
    ctx.fillText('2F', lensX - 2 * F * scale, cy + 18);
    ctx.fillText('2F\'', lensX + 2 * F * scale, cy + 18);

    // Convex Lens Symbol
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lensX, cy - 110);
    ctx.lineTo(lensX, cy + 110);
    ctx.stroke();
    // Converging lens double arrows
    ctx.beginPath();
    ctx.moveTo(lensX - 7, cy - 103);
    ctx.lineTo(lensX, cy - 112);
    ctx.lineTo(lensX + 7, cy - 103);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lensX - 7, cy + 103);
    ctx.lineTo(lensX, cy + 112);
    ctx.lineTo(lensX + 7, cy + 103);
    ctx.stroke();

    // Animation progress timings
    const pObj = Math.min(1, prog / 0.15);
    const pRay1 = Math.max(0, Math.min(1, (prog - 0.12) / 0.2));
    const pRay2 = Math.max(0, Math.min(1, (prog - 0.3) / 0.2));
    const pRay3 = Math.max(0, Math.min(1, (prog - 0.48) / 0.2));
    const pImg = Math.max(0, Math.min(1, (prog - 0.68) / 0.25));

    // Draw Object Arrow
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

    // Helper to draw partial paths
    const drawPartial = (pts, fraction, strokeCol) => {
      if (fraction <= 0) return;
      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      let totalDist = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        totalDist += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
      }
      let target = fraction * totalDist;
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

    // Ray 1: Parallel to axis, refracts through F'
    const dirSlope1 = (cy - objTopY) / (F * scale);
    const ray1pts = [
      { x: objX, y: objTopY },
      { x: lensX, y: objTopY },
      { x: lensX + 600, y: objTopY + dirSlope1 * 600 },
    ];
    drawPartial(ray1pts, pRay1, '#f87171');

    // Ray 2: Through optical centre (undeviated)
    const slope2 = (cy - objTopY) / (lensX - objX);
    const ray2pts = [
      { x: objX, y: objTopY },
      { x: lensX + 600, y: objTopY + slope2 * (lensX + 600 - objX) },
    ];
    drawPartial(ray2pts, pRay2, '#22d3ee');

    // Ray 3: Through front F, emerges parallel
    if (activePreset.id !== 'atf' && u > F + 0.5) {
      const ray3pts = [
        { x: objX, y: objTopY },
        { x: lensX, y: cy + (cy - objTopY) * (F / (u - F)) },
        { x: lensX + 600, y: cy + (cy - objTopY) * (F / (u - F)) },
      ];
      drawPartial(ray3pts, pRay3, '#34d399');
    }

    // Image Arrow
    if (pImg > 0 && Math.abs(v) < 400) {
      const imgX = lensX + v * scale;
      const imgTopY = cy - h * scale;
      const curTop = cy - (cy - imgTopY) * easeOutCubic(pImg);
      const isReal = v > 0;

      ctx.strokeStyle = isReal ? '#fbbf24' : '#34d399';
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = 2.5;

      if (!isReal) ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(imgX, cy);
      ctx.lineTo(imgX, curTop);
      ctx.stroke();
      ctx.setLineDash([]);

      const arrowDir = curTop < cy ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(imgX, curTop);
      ctx.lineTo(imgX - 5, curTop + 8 * arrowDir);
      ctx.lineTo(imgX + 5, curTop + 8 * arrowDir);
      ctx.closePath();
      ctx.fill();

      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isReal ? 'Real Image' : 'Virtual Image', imgX, cy + (isReal ? 24 : -Math.abs(h * scale) - 14));
    }
  }, [activePreset, calculateOptics]);

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowResults(false);
    startTimeRef.current = null;

    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const dur = 2200;
      const raw = Math.min(1, elapsed / dur);
      setProgress(raw);
      drawScene(raw);

      if (raw < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
        setShowResults(true);
        if (typeof onTelemetry === 'function') {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            simulation: 'convex_lens_image_formation',
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
    setProgress(0);
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
  const isReal = v > 0;

  const getConclusion = () => {
    switch (activePreset.id) {
      case 'beyond2f':
        return 'With the object beyond 2F, the lens forms a real, inverted, and diminished image between F\' and 2F\' — exactly how a camera focuses distant scenes onto a sensor.';
      case 'at2f':
        return 'At exactly 2F, the image forms at 2F\' on the opposite side — same size (magnification m = -1.00), real, and inverted.';
      case 'between':
        return 'Between F and 2F, the image is real, inverted, and magnified beyond 2F\' — the core optical principle of a projector.';
      case 'atf':
        return 'With the object placed at the principal focus F, refracted rays emerge parallel to infinity. No real focused image forms on a screen.';
      case 'insidef':
        return 'With the object inside F, refracted rays diverge; tracing them backward creates a virtual, upright, and magnified image — exactly how a magnifying glass works.';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-sans text-slate-900">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              Form 4 Physics · Thin Lenses
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
            Convex Lens: Principal Ray Diagrams & Image Formation
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-mono bg-purple-950/80 border border-purple-500/30 text-purple-200 px-3 py-1 rounded-full">
            f = 15.0 cm (fixed)
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
            showResults
              ? isReal
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {showResults ? (isReal ? '✓ Real & Inverted' : '✓ Virtual & Upright') : 'Ready'}
          </span>
        </div>
      </div>

      {/* Stage: Interactive Ray Diagram Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-md relative overflow-hidden">
        <canvas
          ref={canvasRef}
          width={880}
          height={320}
          className="w-full h-auto block rounded-xl bg-slate-900/90 select-none"
        />
        {/* Ray legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 mt-2.5 pt-2 border-t border-slate-800">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-red-400 rounded-full" /> Ray 1: Parallel &rarr; through F'
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400 rounded-full" /> Ray 2: Through Optical Centre
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-400 rounded-full" /> Ray 3: Through F &rarr; Parallel
          </span>
        </div>
      </div>

      {/* Bottom Grid: Scenarios & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Presets & Controls (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-600" />
              1. Choose Object Position Scenario
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESETS.map((p) => {
                const isActive = activePreset.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePreset(p)}
                    disabled={isRunning}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-50 border-purple-500 text-purple-950 font-bold shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{p.title}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{p.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? 'Tracing Rays...' : 'Trace Principal Rays'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Live Optical Measurements (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            2. Quantitative Optical Results
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Image Distance (v)</span>
              <span className="font-bold text-slate-800 text-sm">
                {showResults ? (Math.abs(v) > 500 ? '∞ (Infinity)' : `${v.toFixed(1)} cm`) : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Magnification (m)</span>
              <span className="font-bold text-purple-700 text-sm">
                {showResults ? (Math.abs(m) > 100 ? '—' : m.toFixed(2)) : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Image Height</span>
              <span className="font-bold text-slate-800 text-sm">
                {showResults ? (Math.abs(h) > 500 ? '—' : `${Math.abs(h).toFixed(1)} cm`) : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Nature</span>
              <span className="font-bold text-cyan-700 text-xs font-sans">
                {showResults ? (isReal ? 'Real, Inverted' : 'Virtual, Upright') : '—'}
              </span>
            </div>
          </div>

          {/* Educational Conclusion */}
          <div className="p-2.5 bg-purple-50/80 border border-purple-200/70 rounded-xl text-[11px] text-purple-950 leading-relaxed font-medium">
            <Info className="w-3.5 h-3.5 text-purple-600 inline mr-1 -mt-0.5" />
            {getConclusion()}
          </div>
        </div>
      </div>
    </div>
  );
}
