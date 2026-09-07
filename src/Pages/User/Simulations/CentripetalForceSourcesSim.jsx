import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Sparkles, Sliders, Info, Scissors, ShieldAlert } from 'lucide-react';

const SCENARIOS = [
  {
    id: 'car',
    icon: '🚗',
    title: 'Car on Flat Road',
    sub: 'Centripetal Force = Friction',
    color: '#f97316',
    r: 20,
    v: 12,
    m: 1000,
    source: 'Friction between tyres and road surface',
    cutLabel: 'Simulate Icy Road (Zero Friction)',
    cutNotice: 'On black ice, friction drops to zero. Without an inward force, the car skids off tangentially into the ditch!',
  },
  {
    id: 'string',
    icon: '🪀',
    title: 'Stone on Whirled String',
    sub: 'Centripetal Force = Tension',
    color: '#06b6d4',
    r: 0.8,
    v: 4.0,
    m: 0.4,
    source: 'Tension pulling along the string toward pivot',
    cutLabel: 'Snap String (Cut Tension)',
    cutNotice: 'When the string snaps, tension drops to zero instantly. The stone flies straight along the tangent (Newton I).',
  },
  {
    id: 'moon',
    icon: '🌕',
    title: 'Satellite / Moon in Orbit',
    sub: 'Centripetal Force = Gravity',
    color: '#a855f7',
    r: 384400000,
    v: 1022,
    m: 7.35e22,
    source: 'Gravitational attraction toward Earth center',
    cutLabel: 'Switch Off Gravity',
    cutNotice: 'If gravity ceased, the celestial body would shoot off into deep space in a straight line at constant velocity.',
  },
];

export default function CentripetalForceSourcesSim({ onTelemetry }) {
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [isCut, setIsCut] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const cutTimeRef = useRef(null);
  const cutStateRef = useRef(null);

  const calculateForce = useCallback((s) => {
    const F = (s.m * s.v * s.v) / s.r;
    return F;
  }, []);

  const drawScene = useCallback(
    (angle, cutData) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const R = 110;

      ctx.clearRect(0, 0, W, H);

      // Deep space / dark road background
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, W / 2);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Starfield for Moon or subtle road grid for car
      if (activeScenario.id === 'moon') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 40; i++) {
          const sx = (Math.sin(i * 19) * 0.5 + 0.5) * W;
          const sy = (Math.cos(i * 31) * 0.5 + 0.5) * H;
          ctx.beginPath();
          ctx.arc(sx, sy, (i % 3) + 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Circular Orbit Track (dashed)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center Anchor (Hub / Hand / Earth)
      if (activeScenario.id === 'moon') {
        // Earth in center
        const earthGrad = ctx.createRadialGradient(cx - 8, cy - 8, 4, cx, cy, 26);
        earthGrad.addColorStop(0, '#38bdf8');
        earthGrad.addColorStop(0.6, '#0284c7');
        earthGrad.addColorStop(1, '#0369a1');
        ctx.fillStyle = earthGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Earth', cx, cy + 3);
      } else {
        // Center Pivot Post
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(activeScenario.id === 'car' ? 'Turn Origin' : 'Pivot (Hand)', cx, cy + 22);
      }

      // Calculate position of moving body
      let px, py, vxDir, vyDir;

      if (!cutData) {
        // Normal circular motion
        px = cx + R * Math.cos(angle);
        py = cy + R * Math.sin(angle);
        const heading = angle + Math.PI / 2;
        vxDir = Math.cos(heading);
        vyDir = Math.sin(heading);
      } else {
        // Tangential straight-line inertia escape (Newton 1)
        const dt = cutData.dt;
        const escapeSpeed = 160; // px/s
        px = cutData.origX + cutData.vx * escapeSpeed * dt;
        py = cutData.origY + cutData.vy * escapeSpeed * dt;
        vxDir = cutData.vx;
        vyDir = cutData.vy;

        // Draw tangential flight trajectory (red dashed line)
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cutData.origX, cutData.origY);
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 1. Inward Real Physical Force Vector (Centripetal role)
      if (!cutData) {
        if (activeScenario.id === 'string') {
          // Draw actual physical string taut to center
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
          ctx.stroke();
        }

        // Force Arrow toward center
        const fAngle = Math.atan2(cy - py, cx - px);
        const fLen = 50;
        const fx = px + fLen * Math.cos(fAngle);
        const fy = py + fLen * Math.sin(fAngle);

        ctx.strokeStyle = activeScenario.color;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(fx, fy);
        ctx.stroke();

        const ah = 8;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx - ah * Math.cos(fAngle - 0.4), fy - ah * Math.sin(fAngle - 0.4));
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx - ah * Math.cos(fAngle + 0.4), fy - ah * Math.sin(fAngle + 0.4));
        ctx.stroke();

        ctx.fillStyle = activeScenario.color;
        ctx.font = 'bold 11px ui-monospace, monospace';
        ctx.fillText(activeScenario.sub.split('=')[1].trim(), fx + 10, fy - 6);
      }

      // 2. Body Sprite
      if (activeScenario.id === 'moon') {
        // Moon orb
        const moonGrad = ctx.createRadialGradient(px - 3, py - 3, 2, px, py, 12);
        moonGrad.addColorStop(0, '#f8fafc');
        moonGrad.addColorStop(1, '#94a3b8');
        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('Moon', px + 16, py + 4);
      } else if (activeScenario.id === 'car') {
        // Car on road
        ctx.save();
        ctx.translate(px, py);
        const heading = Math.atan2(vyDir, vxDir);
        ctx.rotate(heading);
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.roundRect(-16, -9, 32, 18, 4);
        ctx.fill();
        ctx.strokeStyle = '#c2410c';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(2, -6, 8, 12);
        ctx.restore();
      } else {
        // Whirled bob / stone
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('Mass (m)', px + 14, py + 4);
      }

      // 3. Tangential Velocity Vector
      const velLen = 42;
      const vEndX = px + velLen * vxDir;
      const vEndY = py + velLen * vyDir;

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(vEndX, vEndY);
      ctx.stroke();

      const vAngle = Math.atan2(vyDir, vxDir);
      const ah2 = 7;
      ctx.beginPath();
      ctx.moveTo(vEndX, vEndY);
      ctx.lineTo(vEndX - ah2 * Math.cos(vAngle - 0.4), vEndY - ah2 * Math.sin(vAngle - 0.4));
      ctx.moveTo(vEndX, vEndY);
      ctx.lineTo(vEndX - ah2 * Math.cos(vAngle + 0.4), vEndY - ah2 * Math.sin(vAngle + 0.4));
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 10px ui-monospace, monospace';
      ctx.fillText('v (Inertia)', vEndX + 6, vEndY);
    },
    [activeScenario]
  );

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsCut(false);
    setShowResults(false);
    startTimeRef.current = null;
    cutTimeRef.current = null;
    cutStateRef.current = null;

    const revolutions = 2;
    const dur = 3400;

    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;

      if (!cutStateRef.current) {
        // Normal circular motion
        const elapsed = time - startTimeRef.current;
        const p = Math.min(1, elapsed / dur);
        const angle = -Math.PI / 2 + p * revolutions * 2 * Math.PI;

        drawScene(angle, null);

        if (p < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          setIsRunning(false);
          setShowResults(true);
          if (typeof onTelemetry === 'function') {
            onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
              simulation: 'centripetal_force_sources',
              scenario: activeScenario.id,
            });
          }
        }
      } else {
        // Tangential straight line escape under Newton's 1st Law
        const dt = (time - cutTimeRef.current) / 1000;
        drawScene(0, {
          origX: cutStateRef.current.origX,
          origY: cutStateRef.current.origY,
          vx: cutStateRef.current.vx,
          vy: cutStateRef.current.vy,
          dt,
        });

        if (dt < 2.0) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          setIsRunning(false);
          setShowResults(true);
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  const handleCutForce = () => {
    if (!isRunning || isCut) return;
    setIsCut(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = 110;

    const elapsed = performance.now() - startTimeRef.current;
    const p = Math.min(1, elapsed / 3400);
    const angle = -Math.PI / 2 + p * 2 * 2 * Math.PI;

    const origX = cx + R * Math.cos(angle);
    const origY = cy + R * Math.sin(angle);
    const heading = angle + Math.PI / 2;
    const vx = Math.cos(heading);
    const vy = Math.sin(heading);

    cutTimeRef.current = performance.now();
    cutStateRef.current = { origX, origY, vx, vy };
  };

  const handleReset = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsRunning(false);
    setIsCut(false);
    setShowResults(false);
    startTimeRef.current = null;
    cutTimeRef.current = null;
    cutStateRef.current = null;
    drawScene(-Math.PI / 2, null);
  };

  useEffect(() => {
    handleReset();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeScenario]);

  const forceValue = calculateForce(activeScenario);
  const isLarge = Math.abs(forceValue) >= 1e6;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-sans text-slate-900">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
              Form 4 Physics · Centripetal Force Providers
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
            What Provides the Centripetal Force? ($F = mv^2/r$)
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span
            className="text-xs font-mono px-3 py-1 rounded-full font-bold border"
            style={{
              color: activeScenario.color,
              borderColor: `${activeScenario.color}40`,
              backgroundColor: `${activeScenario.color}15`,
            }}
          >
            {activeScenario.title}
          </span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-md space-y-3">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={720}
            height={290}
            className="w-full h-auto block rounded-xl bg-slate-900/90 select-none"
          />

          {/* Inertial Escape Notification overlay */}
          {isCut && (
            <div className="absolute top-4 left-4 right-4 bg-rose-950/90 border border-rose-500/50 text-rose-100 p-3 rounded-xl backdrop-blur-md flex items-center gap-3 shadow-lg text-xs animate-in fade-in duration-300">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <strong className="font-bold uppercase tracking-wide text-rose-300 block">
                  Newton's 1st Law in Action: Inward Force Vanished!
                </strong>
                <span>{activeScenario.cutNotice}</span>
              </div>
            </div>
          )}

          {/* Vector Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 rounded-full" /> Tangential Velocity v (Inertia Direction)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: activeScenario.color }} /> Inward Centripetal Provider ({activeScenario.sub.split('=')[1].trim()})
            </span>
            {isCut && (
              <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                <span className="w-3 h-0.5 bg-rose-500 rounded-full" /> Tangential Escape Path
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls & Force Analysis Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Presets (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              1. Choose a Real Physical Situation
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SCENARIOS.map((s) => {
                const isActive = activeScenario.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveScenario(s)}
                    disabled={isRunning}
                    className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-xl mb-1">{s.icon}</div>
                    <div className="text-xs font-bold truncate">{s.title}</div>
                    <div className="text-[10px] text-slate-500 truncate">{s.sub.split('=')[1]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex gap-2">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isRunning ? 'Orbiting in Track...' : 'Simulate Circular Motion'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Interactive "Remove Force / Cut" Button */}
            <button
              onClick={handleCutForce}
              disabled={!isRunning || isCut}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <Scissors className="w-3.5 h-3.5" />
              {activeScenario.cutLabel}
            </button>
          </div>
        </div>

        {/* Dynamic Force Source & Calculations (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            2. Real Physical Force Identification
          </div>

          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
              Physical Force Supplying Centripetal Acceleration:
            </div>
            <div className="text-sm font-extrabold text-emerald-950 mt-0.5">
              {activeScenario.source}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Mass (m)</span>
              <span className="font-bold text-slate-800 text-xs sm:text-sm">
                {activeScenario.m >= 1e6 ? activeScenario.m.toExponential(2) : activeScenario.m} kg
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Speed (v)</span>
              <span className="font-bold text-emerald-600 text-xs sm:text-sm">{activeScenario.v} m/s</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Radius (r)</span>
              <span className="font-bold text-slate-800 text-xs sm:text-sm">
                {activeScenario.r >= 1e6 ? activeScenario.r.toExponential(2) : activeScenario.r} m
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Inward Force (F = mv²/r)</span>
              <span className="font-bold text-purple-700 text-xs sm:text-sm">
                {isLarge ? forceValue.toExponential(2) : forceValue.toLocaleString()} N
              </span>
            </div>
          </div>

          {/* Essential KCSE Examination Tip */}
          <div className="p-2.5 bg-amber-50/80 border border-amber-200/70 rounded-xl text-[11px] text-amber-950 leading-relaxed font-medium">
            <Info className="w-3.5 h-3.5 text-amber-600 inline mr-1 -mt-0.5" />
            <strong>Common Student Error in KCSE:</strong> Never label "centripetal force" as an extra force on a free-body diagram! Centripetal force is not a physical object or interaction—it is merely the name given to whichever net real force (Friction, Tension, Normal contact, or Gravity) pulls the body inward.
          </div>
        </div>
      </div>
    </div>
  );
}
