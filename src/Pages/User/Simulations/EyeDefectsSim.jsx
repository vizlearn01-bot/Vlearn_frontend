import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Sparkles, CheckCircle2, XCircle, Sliders, Info, Eye } from 'lucide-react';

const CONDITIONS = [
  {
    id: 'normal',
    title: 'Normal Vision',
    sub: 'Emmetropia',
    offset: 0,
    lens: 'None required',
    power: '0.0 D',
    cause: 'Cornea and crystalline lens focus parallel light rays precisely on the fovea of the retina.',
    focus: 'Exactly on the retina',
  },
  {
    id: 'myopia',
    title: 'Myopia',
    sub: 'Short-sightedness',
    offset: -34,
    lens: 'Concave (Diverging)',
    power: '≈ −2.5 D',
    cause: 'Eyeball is too long from front to back, or lens is too powerful; light converges in front of the retina.',
    focus: 'In front of the retina',
  },
  {
    id: 'hyperopia',
    title: 'Hypermetropia',
    sub: 'Long-sightedness',
    offset: 36,
    lens: 'Convex (Converging)',
    power: '≈ +2.5 D',
    cause: 'Eyeball is too short, or lens is too weak; light attempts to converge behind the retina.',
    focus: 'Behind the retina',
  },
  {
    id: 'presbyopia',
    title: 'Presbyopia',
    sub: 'Loss of Accommodation',
    offset: 30,
    lens: 'Convex (Reading Add)',
    power: '≈ +2.0 D',
    cause: 'Ciliary muscles and lens lose elasticity with age, struggling to increase curvature for near objects.',
    focus: 'Behind retina (near objects)',
  },
];

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function EyeDefectsSim({ onTelemetry }) {
  const [activeCondition, setActiveCondition] = useState(CONDITIONS[1]); // default Myopia
  const [isRunning, setIsRunning] = useState(false);
  const [lensProgress, setLensProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const canvasBeforeRef = useRef(null);
  const canvasAfterRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const drawEyeCanvas = useCallback((canvas, focusOffset, withLens, progress) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cy = H / 2;
    const eyeX = 90;
    const retinaX = 330;

    ctx.clearRect(0, 0, W, H);

    // Optical Axis
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(W, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Eyeball Sclera & Cornea
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(eyeX, cy, 32, 44, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Iris & Pupil
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(eyeX + 8, cy, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(eyeX + 8, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    // Retina Surface (Screen)
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(retinaX, cy - 42);
    ctx.lineTo(retinaX, cy + 42);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Cornea', eyeX, H - 8);
    ctx.fillText('Retina', retinaX, H - 8);

    // Corrective Spectacle Lens
    if (withLens && progress > 0) {
      const lensX = 40;
      const isConverging = focusOffset >= 0; // hyperopia/presbyopia needs converging

      ctx.save();
      ctx.globalAlpha = progress;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;

      if (isConverging) {
        // Convex spectacle lens
        ctx.beginPath();
        ctx.arc(lensX - 4, cy, 34, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(lensX + 4, cy, 34, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      } else {
        // Concave spectacle lens
        ctx.beginPath();
        ctx.arc(lensX + 8, cy, 30, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(lensX - 8, cy, 30, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }

      ctx.fillStyle = '#10b981';
      ctx.font = '10px sans-serif';
      ctx.fillText(isConverging ? '+ Convex' : '− Concave', lensX, cy + 56);
      ctx.restore();
    }

    // Light Rays Refraction
    const effectiveOffset = withLens ? focusOffset * (1 - progress) : focusOffset;
    const focusX = retinaX + effectiveOffset;
    const isSharp = Math.abs(effectiveOffset) < 4;

    ctx.strokeStyle = isSharp ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 1.8;

    // Top ray
    ctx.beginPath();
    ctx.moveTo(6, cy - 38);
    ctx.lineTo(eyeX + 16, cy - 16);
    ctx.lineTo(focusX, cy - 2);
    ctx.lineTo(retinaX + 35, cy - (isSharp ? 2 : 20));
    ctx.stroke();

    // Bottom ray
    ctx.beginPath();
    ctx.moveTo(6, cy + 38);
    ctx.lineTo(eyeX + 16, cy + 16);
    ctx.lineTo(focusX, cy + 2);
    ctx.lineTo(retinaX + 35, cy + (isSharp ? 2 : 20));
    ctx.stroke();

    // Focal Point Marker
    if (!isSharp) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.beginPath();
      ctx.arc(focusX, cy, 8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(focusX, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const drawBoth = useCallback(
    (prog) => {
      drawEyeCanvas(canvasBeforeRef.current, activeCondition.offset, false, 0);
      drawEyeCanvas(canvasAfterRef.current, activeCondition.offset, true, prog);
    },
    [activeCondition, drawEyeCanvas]
  );

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowResults(false);
    startTimeRef.current = null;

    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const dur = 1900;
      const p = Math.min(1, elapsed / dur);

      const prog = activeCondition.offset === 0 ? 0 : easeOutCubic(Math.max(0, (p - 0.2) / 0.8));
      setLensProgress(prog);
      drawBoth(activeCondition.offset === 0 ? 1 : prog);

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
        setShowResults(true);
        if (typeof onTelemetry === 'function') {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            simulation: 'eye_defects_simulator',
            condition: activeCondition.id,
          });
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  const handleReset = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsRunning(false);
    setLensProgress(0);
    setShowResults(false);
    drawBoth(0);
  };

  useEffect(() => {
    handleReset();
    drawBoth(0);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeCondition]);

  const isSharpBefore = activeCondition.offset === 0;
  const isSharpAfter = showResults || activeCondition.offset === 0;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-sans text-slate-900">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-300">
              Form 4 Physics · Thin Lenses
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
            Eye Defects: Ray Diagnosis & Spectacle Lens Correction
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-500/20 text-pink-200 border border-pink-500/30">
            {activeCondition.title} ({activeCondition.sub})
          </span>
        </div>
      </div>

      {/* Dual Canvas Stage: Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Without Correction */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-md space-y-2">
          <div className="flex items-center justify-between px-2 text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider">
              1. Without Spectacle Correction
            </span>
            <span className={`font-bold flex items-center gap-1 ${
              isSharpBefore ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {isSharpBefore ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {isSharpBefore ? 'Sharp Image' : 'Blurred on Retina'}
            </span>
          </div>
          <canvas
            ref={canvasBeforeRef}
            width={420}
            height={200}
            className="w-full h-auto block rounded-xl bg-slate-900/90 select-none"
          />
        </div>

        {/* With Corrective Lens */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-md space-y-2">
          <div className="flex items-center justify-between px-2 text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider">
              2. With Corrective Prescription Lens
            </span>
            <span className={`font-bold flex items-center gap-1 ${
              isSharpAfter ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {isSharpAfter ? <CheckCircle2 className="w-3.5 h-3.5" /> : 'Ready to Test'}
              {isSharpAfter ? 'Focus Restored on Retina' : ''}
            </span>
          </div>
          <canvas
            ref={canvasAfterRef}
            width={420}
            height={200}
            className="w-full h-auto block rounded-xl bg-slate-900/90 select-none"
          />
        </div>
      </div>

      {/* Controls & Diagnosis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Conditions Selector (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-pink-600" />
              Select Vision Condition
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CONDITIONS.map((c) => {
                const isActive = activeCondition.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCondition(c)}
                    disabled={isRunning}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-pink-50 border-pink-500 text-pink-950 font-bold shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{c.title}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{c.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? 'Applying Lens Correction...' : 'Apply Corrective Lens'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Diagnosis & Optical Prescription (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            Optometric Clinical Diagnosis
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Corrective Lens</span>
              <span className="font-bold text-emerald-700 text-xs">{activeCondition.lens}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Prescription Power</span>
              <span className="font-mono font-bold text-slate-800 text-sm">{activeCondition.power}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl col-span-2">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Uncorrected Focal Position</span>
              <span className="font-bold text-amber-700 text-xs">{activeCondition.focus}</span>
            </div>
          </div>

          {/* Biological Cause & Correction Mechanism */}
          <div className="p-3 bg-pink-50/80 border border-pink-200/70 rounded-xl text-xs text-pink-950 leading-relaxed font-medium">
            <Info className="w-3.5 h-3.5 text-pink-600 inline mr-1 -mt-0.5" />
            {activeCondition.cause}{' '}
            {activeCondition.offset !== 0 && (
              <span>
                By placing a <strong>{activeCondition.lens}</strong> lens in front of the cornea, the focal point is brought precisely back onto the retina, restoring clear 20/20 visual acuity.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
