import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Sparkles, Sliders, Info, Compass, Gauge, AlertTriangle } from 'lucide-react';

const PRESETS = [
  {
    id: 'car',
    title: 'Car on Highway Bend',
    sub: 'r = 25.0 m, v = 15.0 m/s, m = 1200 kg',
    r: 25.0,
    v: 15.0,
    m: 1200,
    desc: 'Automobile cornering. Constant speedometer reading, yet tire friction must supply huge inward centripetal acceleration.',
  },
  {
    id: 'track',
    title: 'Sprinter on Track Bend',
    sub: 'r = 36.0 m, v = 8.5 m/s, m = 70 kg',
    r: 36.0,
    v: 8.5,
    m: 70,
    desc: 'Runner leaning inward on bend. Ground reaction tilt provides centripetal acceleration.',
  },
  {
    id: 'rotor',
    title: 'Fairground Rotor Ride',
    sub: 'r = 5.0 m, v = 7.0 m/s, m = 60 kg',
    r: 5.0,
    v: 7.0,
    m: 60,
    desc: 'Tight radius carousel. Small radius dramatically magnifies centripetal acceleration a = v²/r.',
  },
  {
    id: 'jet',
    title: 'Fighter Jet Pylon Turn',
    sub: 'r = 150.0 m, v = 60.0 m/s, m = 7500 kg',
    r: 150.0,
    v: 60.0,
    m: 7500,
    desc: 'High-speed aerodynamic bank turn experiencing heavy G-forces directed toward center of turn.',
  },
];

export default function CentripetalAccelerationSim({ onTelemetry }) {
  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [headingDeg, setHeadingDeg] = useState(0);

  const roadCanvasRef = useRef(null);
  const speedGaugeRef = useRef(null);
  const compassGaugeRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const calculatePhysics = useCallback((p) => {
    const a = (p.v * p.v) / p.r; // a = v^2 / r
    const F = p.m * a; // F = m * a
    const w = p.v / p.r; // omega = v / r
    const gForce = a / 9.81; // G-force equivalent
    return { a, F, w, gForce };
  }, []);

  const drawSpeedGauge = useCallback((v, maxV) => {
    const canvas = speedGaugeRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h - 14;
    const r = 50;

    ctx.clearRect(0, 0, w, h);

    // Track arc
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0);
    ctx.stroke();

    // Active speed arc
    const frac = Math.min(1, Math.max(0, v / maxV));
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, Math.PI + frac * Math.PI);
    ctx.stroke();

    // Needle
    const needleAngle = Math.PI + frac * Math.PI;
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (r - 10) * Math.cos(needleAngle), cy + (r - 10) * Math.sin(needleAngle));
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${v.toFixed(1)} m/s`, cx, cy - 14);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px sans-serif';
    ctx.fillText('SPEED (CONSTANT)', cx, cy + 10);
  }, []);

  const drawCompassGauge = useCallback((deg) => {
    const canvas = compassGaugeRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = 44;

    ctx.clearRect(0, 0, w, h);

    // Circular dial
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Cardinal directions
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', cx, cy - r + 8);
    ctx.fillText('S', cx, cy + r - 8);
    ctx.fillText('E', cx + r - 8, cy);
    ctx.fillText('W', cx - r + 8, cy);

    // Rotating pointer
    const a = ((deg - 90) * Math.PI) / 180;
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (r - 14) * Math.cos(a), cy + (r - 14) * Math.sin(a));
    ctx.stroke();

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px ui-monospace, monospace';
    ctx.fillText(`${deg.toFixed(0)}°`, cx, cy + r + 14);
  }, []);

  const drawRoadScene = useCallback(
    (angle) => {
      const canvas = roadCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const R = 105;

      ctx.clearRect(0, 0, W, H);

      // Asphalt track
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 48;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // Road lane markers (dashed white line)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Inner and outer curb lines
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, R - 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, R + 24, 0, Math.PI * 2);
      ctx.stroke();

      // Center Turn Pivot Indicator
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Center of Turn (O)', cx, cy + 18);

      // Radius line to object
      const px = cx + R * Math.cos(angle);
      const py = cy + R * Math.sin(angle);
      const heading = angle + Math.PI / 2;

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.setLineDash([]);

      // 1. Inward Centripetal Acceleration Vector (a_c towards center)
      const accLen = 48;
      const inwardAngle = angle + Math.PI;
      const ax = px + accLen * Math.cos(inwardAngle);
      const ay = py + accLen * Math.sin(inwardAngle);

      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(ax, ay);
      ctx.stroke();
      // Arrowhead
      const ah1 = 8;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax - ah1 * Math.cos(inwardAngle - 0.4), ay - ah1 * Math.sin(inwardAngle - 0.4));
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax - ah1 * Math.cos(inwardAngle + 0.4), ay - ah1 * Math.sin(inwardAngle + 0.4));
      ctx.stroke();

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.fillText('a_c (Inward)', ax - 18, ay - 6);

      // 2. Moving Object Sprite (Car on bend)
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(heading);

      // Car body
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(-16, -9, 32, 18, 5);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Windshield
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(2, -6, 8, 12);

      // Tires
      ctx.fillStyle = '#020617';
      ctx.fillRect(-13, -11, 8, 3);
      ctx.fillRect(-13, 8, 8, 3);
      ctx.fillRect(5, -11, 8, 3);
      ctx.fillRect(5, 8, 8, 3);

      ctx.restore();

      // 3. Tangential Velocity Vector (v forward)
      const velLen = 52;
      const vx = px + velLen * Math.cos(heading);
      const vy = py + velLen * Math.sin(heading);

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(vx, vy);
      ctx.stroke();
      // Arrowhead
      const ah2 = 8;
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(vx - ah2 * Math.cos(heading - 0.4), vy - ah2 * Math.sin(heading - 0.4));
      ctx.moveTo(vx, vy);
      ctx.lineTo(vx - ah2 * Math.cos(heading + 0.4), vy - ah2 * Math.sin(heading + 0.4));
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.fillText('v (Tangential)', vx + 8, vy);

      const deg = ((((heading * 180) / Math.PI) % 360) + 360) % 360;
      setHeadingDeg(deg);
      drawSpeedGauge(activePreset.v, 70);
      drawCompassGauge(deg);
    },
    [activePreset, drawSpeedGauge, drawCompassGauge]
  );

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowResults(false);
    startTimeRef.current = null;

    const revolutions = 2;
    const dur = 3200;

    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const p = Math.min(1, elapsed / dur);

      const angle = -Math.PI / 2 + p * revolutions * 2 * Math.PI;
      drawRoadScene(angle);

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
        setShowResults(true);
        if (typeof onTelemetry === 'function') {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            simulation: 'centripetal_acceleration',
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
    drawRoadScene(-Math.PI / 2);
  };

  useEffect(() => {
    handleReset();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activePreset]);

  const { a, F, w, gForce } = calculatePhysics(activePreset);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-sans text-slate-900">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
              Form 4 Physics · Centripetal Acceleration
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
            Centripetal Acceleration: Why Direction Change Means Acceleration ($a = v^2/r$)
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-mono bg-rose-950/80 border border-rose-500/30 text-rose-200 px-3 py-1 rounded-full">
            {activePreset.title}
          </span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-md space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Main Road Track Canvas (8 Cols) */}
          <div className="md:col-span-8 relative">
            <canvas
              ref={roadCanvasRef}
              width={580}
              height={290}
              className="w-full h-auto block rounded-xl bg-slate-900/90 select-none"
            />
            {/* Vector Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-400 rounded-full" /> Tangential Velocity v (Constant Speed)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-500 rounded-full" /> Centripetal Acceleration a_c (Points to Center)
              </span>
            </div>
          </div>

          {/* Dual Synchronized Gauges (4 Cols) */}
          <div className="md:col-span-4 grid grid-cols-2 gap-2 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            {/* Speedometer Gauge */}
            <div className="flex flex-col items-center justify-center text-center">
              <canvas ref={speedGaugeRef} width={130} height={110} className="w-28 h-24" />
              <span className="text-[10px] text-emerald-400 font-bold uppercase mt-1">Speed Fixed</span>
            </div>

            {/* Compass Heading Gauge */}
            <div className="flex flex-col items-center justify-center text-center">
              <canvas ref={compassGaugeRef} width={130} height={110} className="w-28 h-24" />
              <span className="text-[10px] text-rose-400 font-bold uppercase mt-1">Heading Rotates</span>
            </div>
          </div>
        </div>

        {/* Live Vector Telemetry Notice */}
        <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-center text-xs text-slate-300">
          <span className="text-emerald-400 font-bold">Speedometer needle never moves</span> (Speed = {activePreset.v.toFixed(1)} m/s), but the <span className="text-rose-400 font-bold">Compass needle continuously spins ({headingDeg.toFixed(0)}°)</span>. Because velocity includes direction, changing direction requires an inward acceleration <strong>a_c = {a.toFixed(2)} m/s²</strong>.
        </div>
      </div>

      {/* Controls & Calculations Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Presets (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-rose-600" />
              1. Choose a Circular Turning Scenario
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
                        ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold shadow-xs'
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
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? 'Rounding Curve...' : 'Simulate 2 Revolutions'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Dynamic Computed Acceleration & Force (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            2. Centripetal Kinematics & Force Readout
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Turn Radius (r)</span>
              <span className="font-bold text-slate-800 text-sm">{activePreset.r} m</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Linear Speed (v)</span>
              <span className="font-bold text-emerald-600 text-sm">{activePreset.v} m/s</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Acceleration (a = v²/r)</span>
              <span className="font-bold text-rose-600 text-sm">{a.toFixed(2)} m/s² ({gForce.toFixed(1)}g)</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Required Force (F = ma)</span>
              <span className="font-bold text-purple-700 text-sm">{Math.round(F).toLocaleString()} N</span>
            </div>
          </div>

          {/* Scientific Derivation Highlight */}
          <div className="p-2.5 bg-rose-50/80 border border-rose-200/70 rounded-xl text-[11px] text-rose-950 leading-relaxed font-medium">
            <Info className="w-3.5 h-3.5 text-rose-600 inline mr-1 -mt-0.5" />
            <strong>KCSE Core Law:</strong> Constant speed does <em>NOT</em> mean zero acceleration in circular paths! Acceleration is vector rate of change <strong>a = Δv / Δt</strong>. Here linear speed |v| is constant, but the velocity vector direction rotates continuously inward. The inward centripetal acceleration is <strong>a_c = v²/r = ω²r</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}
