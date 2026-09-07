import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Sparkles, Sliders, Info, Compass, Gauge, Zap } from 'lucide-react';

const PRESETS = [
  {
    id: 'ferris',
    title: 'Ferris Wheel',
    sub: 'r = 10.0 m, T = 24.0 s',
    r: 10.0,
    T: 24.0,
    type: 'wheel',
    spokes: 8,
    desc: 'Huge radius, slow rotation. Tangential speed on the rim is noticeable despite low angular velocity.',
  },
  {
    id: 'bike',
    title: 'Bicycle Wheel',
    sub: 'r = 0.35 m, T = 1.2 s',
    r: 0.35,
    T: 1.2,
    type: 'bike',
    spokes: 16,
    desc: 'Standard road cycling cadence. The valve cap on the outer tyre sweeps a much larger linear distance than the hub axle.',
  },
  {
    id: 'fan',
    title: 'Ceiling Fan',
    sub: 'r = 0.60 m, T = 0.25 s',
    r: 0.60,
    T: 0.25,
    type: 'fan',
    spokes: 3,
    desc: 'High rotation rate (4 revolutions per second). Blade tips slice air at high linear speed v = ωr.',
  },
  {
    id: 'drill',
    title: 'Electric Drill Bit',
    sub: 'r = 0.05 m, T = 0.02 s',
    r: 0.05,
    T: 0.02,
    type: 'drill',
    spokes: 2,
    desc: 'Ultra-high frequency (50 rev/s = 3,000 RPM). Enormous angular velocity ω with tiny radius.',
  },
];

export default function AngularQuantitiesSim({ onTelemetry }) {
  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [showDualRadius, setShowDualRadius] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [liveStats, setLiveStats] = useState({ angle: 0, revs: 0, headingDeg: 0 });

  const canvasRef = useRef(null);
  const ringRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const calculateQuantities = useCallback((p) => {
    const T = p.T;
    const f = 1 / T;
    const w = (2 * Math.PI) / T; // omega in rad/s
    const v = w * p.r; // v = omega * r
    const vInner = w * (p.r * 0.5); // half radius
    return { T, f, w, v, vInner };
  }, []);

  const drawRing = useCallback((fracThisRev, revCount) => {
    const ring = ringRef.current;
    if (!ring) return;
    const ctx = ring.getContext('2d');
    const w = ring.width;
    const h = ring.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = 52;

    ctx.clearRect(0, 0, w, h);

    // Track background
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Progress arc
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + fracThisRev * Math.PI * 2);
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 18px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(revCount.toFixed(1), cx, cy - 6);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText('Revolutions', cx, cy + 12);
  }, []);

  const drawScene = useCallback(
    (angle) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const R = 110; // Canvas visual radius for outer rim

      ctx.clearRect(0, 0, W, H);

      // Radial background grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      if (showDualRadius) {
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Center crosshairs
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.beginPath();
      ctx.moveTo(cx - R - 20, cy);
      ctx.lineTo(cx + R + 20, cy);
      ctx.moveTo(cx, cy - R - 20);
      ctx.lineTo(cx, cy + R + 20);
      ctx.stroke();

      // Rotating Wheel / Blades / Spokes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = activePreset.type === 'bike' ? 6 : 4;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Spokes
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < activePreset.spokes; i++) {
        const spokeAngle = angle + (i * 2 * Math.PI) / activePreset.spokes;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + R * Math.cos(spokeAngle), cy + R * Math.sin(spokeAngle));
        ctx.stroke();
      }

      // Hub Center Axle
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Outer Point A on Rim
      const ax = cx + R * Math.cos(angle);
      const ay = cy + R * Math.sin(angle);

      // Outer Radius Vector (dashed line)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ax, ay);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tangential velocity vector at Point A (perpendicular to radius: angle + 90 deg)
      const tangentAngle = angle + Math.PI / 2;
      const vLen = 45;
      const vx = ax + vLen * Math.cos(tangentAngle);
      const vy = ay + vLen * Math.sin(tangentAngle);

      // Velocity Arrow for A
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(vx, vy);
      ctx.stroke();
      // Arrowhead
      const ah = 7;
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(vx - ah * Math.cos(tangentAngle - 0.4), vy - ah * Math.sin(tangentAngle - 0.4));
      ctx.moveTo(vx, vy);
      ctx.lineTo(vx - ah * Math.cos(tangentAngle + 0.4), vy - ah * Math.sin(tangentAngle + 0.4));
      ctx.stroke();

      // Point A Marker
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(ax, ay, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.fillText('Point A (Rim, r)', ax + 10, ay - 8);

      // Inner Point B (Midway r/2) if enabled
      if (showDualRadius) {
        const bx = cx + R * 0.5 * Math.cos(angle);
        const by = cy + R * 0.5 * Math.sin(angle);

        // Half-length tangential velocity vector for Point B
        const vLenB = vLen * 0.5;
        const vbx = bx + vLenB * Math.cos(tangentAngle);
        const vby = by + vLenB * Math.sin(tangentAngle);

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(vbx, vby);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(vbx, vby);
        ctx.lineTo(vbx - 5 * Math.cos(tangentAngle - 0.4), vby - 5 * Math.sin(tangentAngle - 0.4));
        ctx.moveTo(vbx, vby);
        ctx.lineTo(vbx - 5 * Math.cos(tangentAngle + 0.4), vby - 5 * Math.sin(tangentAngle + 0.4));
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(bx, by, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = 'bold 10px ui-monospace, monospace';
        ctx.fillText('Point B (r/2)', bx + 8, by + 14);
      }

      // Angle swept arc from initial 0 position
      const initialAngle = -Math.PI / 2;
      const sweptAngle = angle - initialAngle;
      if (sweptAngle > 0.05) {
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 35, initialAngle, angle);
        ctx.stroke();
      }
    },
    [activePreset, showDualRadius]
  );

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowResults(false);
    startTimeRef.current = null;

    const revolutions = 3;
    const dur = 3200;

    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const p = Math.min(1, elapsed / dur);

      const totalAngle = p * revolutions * 2 * Math.PI;
      const curAngle = -Math.PI / 2 + totalAngle;

      drawScene(curAngle);
      const fracThisRev = (totalAngle % (2 * Math.PI)) / (2 * Math.PI);
      const revCount = totalAngle / (2 * Math.PI);
      drawRing(fracThisRev, revCount);

      const heading = ((((curAngle + Math.PI / 2) * 180) / Math.PI) % 360 + 360) % 360;
      setLiveStats({
        angle: totalAngle,
        revs: revCount,
        headingDeg: Math.round(heading),
      });

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
        setShowResults(true);
        if (typeof onTelemetry === 'function') {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            simulation: 'circular_motion_angular_quantities',
            preset: activePreset.id,
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
    setLiveStats({ angle: 0, revs: 0, headingDeg: 0 });
    drawScene(-Math.PI / 2);
    drawRing(0, 0);
  };

  useEffect(() => {
    handleReset();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activePreset]);

  const { T, f, w, v, vInner } = calculateQuantities(activePreset);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-sans text-slate-900">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              Form 4 Physics · Uniform Circular Motion
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
            Circular Motion: Angular Quantities (Period, Frequency, ω, and v)
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-mono bg-cyan-950/80 border border-cyan-500/30 text-cyan-200 px-3 py-1 rounded-full">
            {activePreset.title}
          </span>
          <button
            onClick={() => setShowDualRadius(!showDualRadius)}
            className={`text-xs font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
              showDualRadius
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {showDualRadius ? 'Dual Radius (r vs r/2) ON' : 'Show Dual Radius'}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-md space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Main Rotation Canvas (9 Cols) */}
          <div className="md:col-span-9 relative">
            <canvas
              ref={canvasRef}
              width={640}
              height={280}
              className="w-full h-auto block rounded-xl bg-slate-900/90 select-none"
            />
            {/* Vector Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-400 rounded-full" /> Tangential Speed v at Rim Point A (v = ωr)
              </span>
              {showDualRadius && (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-amber-400 rounded-full" /> Tangential Speed at Inner Point B (v/2 = ωr/2)
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-cyan-400 rounded-full" /> Radius Vector r
              </span>
            </div>
          </div>

          {/* Revolution Progress Ring Gauge (3 Cols) */}
          <div className="md:col-span-3 flex flex-col items-center justify-center bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              Rotation Meter
            </div>
            <canvas ref={ringRef} width={130} height={130} className="w-28 h-28" />
            <div className="text-center text-[11px] font-mono text-cyan-300">
              Angle: {liveStats.angle.toFixed(2)} rad ({((liveStats.angle * 180) / Math.PI).toFixed(0)}°)
            </div>
          </div>
        </div>

        {/* Live Vector Telemetry Chips */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center font-mono">
          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Total Angle Swept (θ)</span>
            <span className="text-cyan-400 font-bold text-xs sm:text-sm">{liveStats.angle.toFixed(2)} rad</span>
          </div>
          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Full Revolutions</span>
            <span className="text-emerald-400 font-bold text-xs sm:text-sm">{liveStats.revs.toFixed(2)} revs</span>
          </div>
          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Instantaneous Heading</span>
            <span className="text-amber-400 font-bold text-xs sm:text-sm">{liveStats.headingDeg}°</span>
          </div>
        </div>
      </div>

      {/* Controls & Scientific Proof Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Presets (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-600" />
              1. Choose a Real-World Rotating Body
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
                    <div className="text-[11px] text-slate-500 font-mono">{p.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? 'Rotating Apparatus...' : 'Run 3 Revolutions'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Calculated Optical / Kinematic Outcomes (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            2. Angular & Tangential Kinematics
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Period T (1 revolution)</span>
              <span className="font-bold text-slate-800 text-sm">{T} s</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Frequency f = 1/T</span>
              <span className="font-bold text-cyan-700 text-sm">{f.toFixed(2)} Hz</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Angular Velocity (ω = 2π/T)</span>
              <span className="font-bold text-purple-700 text-sm">{w.toFixed(2)} rad/s</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Tangential Speed (v = ωr)</span>
              <span className="font-bold text-emerald-600 text-sm">{v.toFixed(2)} m/s</span>
            </div>
          </div>

          {/* Key KCSE Insight: Why v differs while omega is constant */}
          <div className="p-2.5 bg-cyan-50/80 border border-cyan-200/70 rounded-xl text-[11px] text-cyan-950 leading-relaxed font-medium">
            <Info className="w-3.5 h-3.5 text-cyan-600 inline mr-1 -mt-0.5" />
            <strong>Crucial Examination Concept:</strong> Every point on the rigid body completes one revolution in the exact same time (T = {T} s), so every point has identical angular velocity <strong>ω = {w.toFixed(2)} rad/s</strong>. However, outer Point A sweeps a larger circumference than inner Point B (v_A = {v.toFixed(2)} m/s vs v_B = {vInner.toFixed(2)} m/s). Linear speed is directly proportional to radius: <strong>v = ωr</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}
