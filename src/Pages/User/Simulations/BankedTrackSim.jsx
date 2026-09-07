import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Info,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Gauge,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const PRESETS = [
  {
    id: 'highway',
    name: 'Standard Highway Curve',
    tagline: 'Gentle Civil Engineering Bank',
    r: 120,
    theta: 12,
    mu: 0.60,
    m: 1200,
    v: 16.0,
    desc: 'Typical highway interchange designed for comfortable travel with minimal tire scrubbing.',
  },
  {
    id: 'velodrome',
    name: 'Speedway / Velodrome',
    tagline: 'Extreme High-Bank Oval',
    r: 80,
    theta: 32,
    mu: 0.75,
    m: 800,
    v: 22.0,
    desc: 'Steep banking allows racecars and track cyclists to generate massive centripetal force.',
  },
  {
    id: 'icy',
    name: 'Icy Mountain Bend',
    tagline: 'Zero-Friction Black Ice Hazard',
    r: 60,
    theta: 8,
    mu: 0.08,
    m: 1400,
    v: 9.0,
    desc: 'Treacherous low-friction surface where the banking angle is the only barrier against skidding.',
  },
  {
    id: 'flat',
    name: 'Flat Curved Road (0° Bank)',
    tagline: 'Pure Friction Cornering',
    r: 50,
    theta: 0,
    mu: 0.55,
    m: 1100,
    v: 14.0,
    desc: 'Unbanked corner: 100% of centripetal force must be supplied by tire static friction.',
  },
];

const CHALLENGES = [
  {
    id: 'hands_off',
    title: 'Challenge 1: Find the "Hands-Off" Speed',
    difficulty: 'Introductory',
    hint: 'Tune vehicle speed v until required friction f_req drops to ~0 N (ideal design speed v_0).',
    preset: { r: 100, theta: 18, mu: 0.5, m: 1200, v: 10.0 },
    check: (phys) => Math.abs(phys.v - phys.v0) < 0.5 || Math.abs(phys.fReq) < 30,
    congrats: 'Mastered! At this exact design speed, the normal reaction component N·sin(θ) alone satisfies centripetal acceleration. Tires experience zero lateral scrubbing!',
  },
  {
    id: 'ice_safety',
    title: 'Challenge 2: Black Ice Survival',
    difficulty: 'Intermediate',
    hint: 'On ice (μ = 0.05), you cannot exceed v_max without skidding off into the embankment.',
    preset: { r: 70, theta: 10, mu: 0.05, m: 1500, v: 15.0 },
    check: (phys) => phys.v <= phys.vMax && phys.v >= phys.vMin && phys.status === 'safe',
    congrats: 'Safe driving! You stayed within the narrow safe window where the banking angle prevents slipping.',
  },
  {
    id: 'velodrome_g',
    title: 'Challenge 3: High G-Force Velodrome',
    difficulty: 'Advanced',
    hint: 'Drive at high speed (>= 25 m/s) on a 35° banked turn with high grip.',
    preset: { r: 60, theta: 35, mu: 0.85, m: 750, v: 26.0 },
    check: (phys) => phys.theta >= 30 && phys.v >= 24 && phys.status !== 'skid_out',
    congrats: 'Phenomenal! Notice the massive normal reaction force N holding the vehicle against centrifugal tendency.',
  },
];

export default function BankedTrackSim({ onTelemetry }) {
  // State
  const [theta, setTheta] = useState(14); // degrees
  const [radius, setRadius] = useState(100); // meters
  const [speed, setSpeed] = useState(16.0); // m/s
  const [mu, setMu] = useState(0.55); // friction coefficient
  const [mass, setMass] = useState(1200); // kg
  const [showVectors, setShowVectors] = useState(true);
  const [showComponents, setShowComponents] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [isRunning, setIsRunning] = useState(true);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const skidOffsetRef = useRef(0);
  const skidDirRef = useRef(0); // 1 = up slope, -1 = down slope

  // Physical calculations
  const calculatePhysics = useCallback(() => {
    const g = 9.81;
    const rad = (theta * Math.PI) / 180;
    const tanT = Math.tan(rad);
    const sinT = Math.sin(rad);
    const cosT = Math.cos(rad);

    // Ideal design speed (no friction required)
    const v0 = Math.sqrt(radius * g * Math.max(0.0001, tanT));

    // Maximum safe speed before skidding up/outward
    let vMax = Infinity;
    const denomMax = 1 - mu * tanT;
    if (denomMax > 0.001) {
      vMax = Math.sqrt(radius * g * ((tanT + mu) / denomMax));
    } else {
      vMax = 999; // effectively no sliding outward limit if angle exceeds friction cone
    }

    // Minimum safe speed before sliding down (only applies if tan(theta) > mu)
    let vMin = 0;
    if (tanT > mu) {
      const denomMin = 1 + mu * tanT;
      vMin = Math.sqrt(radius * g * ((tanT - mu) / denomMin));
    }

    // Forces calculation
    const W = mass * g; // Weight
    const v = speed;
    const centripetalAccel = (v * v) / radius;
    const Fc = mass * centripetalAccel;

    // Normal force: N = m*(g*cos(theta) + (v^2/r)*sin(theta))
    const N = mass * (g * cosT + centripetalAccel * sinT);

    // Required lateral friction (acting down-slope when v > v0, up-slope when v < v0)
    // f_req = m * ((v^2/r)*cos(theta) - g*sin(theta))
    const fReq = mass * (centripetalAccel * cosT - g * sinT);

    // Maximum available static friction
    const fMax = mu * N;

    // Status
    let status = 'optimum';
    if (v > vMax + 0.1) {
      status = 'skid_out'; // Sliding outward up slope
    } else if (v < vMin - 0.1 && vMin > 0.1) {
      status = 'slip_in'; // Sliding down slope
    } else if (Math.abs(fReq) < 0.05 * fMax || Math.abs(v - v0) < 0.3) {
      status = 'optimum'; // Hands-off zero wear
    } else if (Math.abs(fReq) > 0.85 * fMax) {
      status = 'critical'; // Near skid threshold
    } else {
      status = 'safe'; // Assisted by friction
    }

    const gForce = N / (mass * g);

    return {
      g,
      rad,
      tanT,
      sinT,
      cosT,
      v0,
      vMax,
      vMin,
      W,
      Fc,
      N,
      fReq,
      fMax,
      status,
      gForce,
      v,
      centripetalAccel,
    };
  }, [theta, radius, speed, mu, mass]);

  const phys = calculatePhysics();

  // Check challenge completion
  useEffect(() => {
    if (activeChallenge && !challengeCompleted) {
      if (activeChallenge.check(phys)) {
        setChallengeCompleted(true);
        if (typeof onTelemetry === 'function') {
          onTelemetry('SIMULATION_CHALLENGE_COMPLETED', {
            simulation: 'banked_track_dynamics',
            challenge: activeChallenge.id,
            speed: phys.v,
            theta,
          });
        }
      }
    }
  }, [phys, activeChallenge, challengeCompleted, onTelemetry, theta]);

  // Apply Preset
  const handleApplyPreset = (p) => {
    setRadius(p.r);
    setTheta(p.theta);
    setMu(p.mu);
    setMass(p.m);
    setSpeed(p.v);
    setActiveChallenge(null);
    setChallengeCompleted(false);
    skidOffsetRef.current = 0;
    if (typeof onTelemetry === 'function') {
      onTelemetry('SIMULATION_PRESET_SELECTED', {
        simulation: 'banked_track_dynamics',
        preset: p.id,
      });
    }
  };

  // Start challenge
  const handleStartChallenge = (ch) => {
    setActiveChallenge(ch);
    setChallengeCompleted(false);
    setRadius(ch.preset.r);
    setTheta(ch.preset.theta);
    setMu(ch.preset.mu);
    setMass(ch.preset.m);
    setSpeed(ch.preset.v);
    skidOffsetRef.current = 0;
  };

  // Reset simulation
  const handleReset = () => {
    setTheta(14);
    setRadius(100);
    setSpeed(16.0);
    setMu(0.55);
    setMass(1200);
    setActiveChallenge(null);
    setChallengeCompleted(false);
    skidOffsetRef.current = 0;
  };

  // Draw simulation scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let running = true;

    const render = () => {
      if (!running) return;

      const W = canvas.width;
      const H = canvas.height;

      // Handle skid animation offset
      if (phys.status === 'skid_out') {
        skidDirRef.current = 1;
        skidOffsetRef.current = Math.min(130, skidOffsetRef.current + 1.8);
      } else if (phys.status === 'slip_in') {
        skidDirRef.current = -1;
        skidOffsetRef.current = Math.max(-100, skidOffsetRef.current - 1.5);
      } else {
        // Return smoothly to center
        skidOffsetRef.current *= 0.92;
        if (Math.abs(skidOffsetRef.current) < 0.5) skidOffsetRef.current = 0;
      }

      ctx.clearRect(0, 0, W, H);

      // Deep sky gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#090d16');
      bg.addColorStop(1, '#0f172a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Distant horizon lines / mountains
      ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, H * 0.65);
      ctx.lineTo(W * 0.25, H * 0.55);
      ctx.lineTo(W * 0.55, H * 0.68);
      ctx.lineTo(W * 0.8, H * 0.58);
      ctx.lineTo(W, H * 0.66);
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();

      // Horizontal ground reference
      const groundY = H - 60;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(40, groundY);
      ctx.lineTo(W - 40, groundY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Banked Road Parameters
      const roadOriginX = 140;
      const roadOriginY = groundY;
      const roadLength = 520;
      const roadAngleRad = phys.rad;

      const roadEndX = roadOriginX + roadLength * Math.cos(roadAngleRad);
      const roadEndY = roadOriginY - roadLength * Math.sin(roadAngleRad);

      // Embankment concrete wedge support
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(roadOriginX, roadOriginY);
      ctx.lineTo(roadEndX, roadEndY);
      ctx.lineTo(roadEndX, groundY);
      ctx.closePath();
      ctx.fill();

      // Road Surface
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(roadOriginX, roadOriginY);
      ctx.lineTo(roadEndX, roadEndY);
      ctx.stroke();

      // Asphalt top line
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(roadOriginX, roadOriginY);
      ctx.lineTo(roadEndX, roadEndY);
      ctx.stroke();

      // Center dash lane
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(roadOriginX + 15 * Math.cos(roadAngleRad), roadOriginY - 15 * Math.sin(roadAngleRad));
      ctx.lineTo(roadEndX - 15 * Math.cos(roadAngleRad), roadEndY + 15 * Math.sin(roadAngleRad));
      ctx.stroke();
      ctx.setLineDash([]);

      // Angle arc indicator at base
      if (theta > 1) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(roadOriginX, roadOriginY, 70, 0, -roadAngleRad, true);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px ui-monospace, monospace';
        ctx.fillText(`θ = ${theta}°`, roadOriginX + 80, roadOriginY - 18);
      }

      // Outer barrier
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(roadEndX - 6, roadEndY - 30, 12, 30);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(roadEndX - 6, roadEndY - 20, 12, 10);

      // Car Position along incline
      const baseDist = 260 + skidOffsetRef.current;
      const carContactX = roadOriginX + baseDist * Math.cos(roadAngleRad);
      const carContactY = roadOriginY - baseDist * Math.sin(roadAngleRad);

      // Car local frame: along slope (cos, -sin), normal to slope (sin, cos)
      const nx = Math.sin(roadAngleRad);
      const ny = Math.cos(roadAngleRad);

      const carHeight = 26;
      const comX = carContactX - nx * carHeight;
      const comY = carContactY - ny * carHeight;

      // Draw Car (Rear view looking along trajectory into the page)
      ctx.save();
      ctx.translate(carContactX, carContactY);
      ctx.rotate(-roadAngleRad);

      // Tire skid marks if skidding
      if (Math.abs(skidOffsetRef.current) > 10) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.fillRect(-35, -4, 70, 6);
      }

      // Wheels
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      // Left wheel
      ctx.fillRect(-36, -14, 12, 14);
      ctx.strokeRect(-36, -14, 12, 14);
      // Right wheel
      ctx.fillRect(24, -14, 12, 14);
      ctx.strokeRect(24, -14, 12, 14);

      // Car Body
      const carGrad = ctx.createLinearGradient(0, -50, 0, -10);
      if (phys.status === 'skid_out' || phys.status === 'slip_in') {
        carGrad.addColorStop(0, '#dc2626');
        carGrad.addColorStop(1, '#991b1b');
      } else if (phys.status === 'optimum') {
        carGrad.addColorStop(0, '#06b6d4');
        carGrad.addColorStop(1, '#0e7490');
      } else {
        carGrad.addColorStop(0, '#3b82f6');
        carGrad.addColorStop(1, '#1d4ed8');
      }
      ctx.fillStyle = carGrad;
      ctx.beginPath();
      ctx.roundRect(-34, -42, 68, 30, [8, 8, 4, 4]);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rear Windshield
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(-24, -38, 48, 14, [4, 4, 2, 2]);
      ctx.fill();

      // Tail lights
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-30, -22, 10, 6);
      ctx.fillRect(20, -22, 10, 6);

      // License plate / tag
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-12, -22, 24, 8);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 6px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(phys.v * 3.6)} km/h`, 0, -16);

      // Center of Mass Dot
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, -carHeight, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // Skid Alert Floating Badge
      if (phys.status === 'skid_out') {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.95)';
        ctx.beginPath();
        ctx.roundRect(comX - 90, comY - 95, 180, 44, 8);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠ SKIDDING OUTWARD!', comX, comY - 76);
        ctx.font = '10px sans-serif';
        ctx.fillText(`v > v_max (${phys.vMax.toFixed(1)} m/s)`, comX, comY - 60);
      } else if (phys.status === 'slip_in') {
        ctx.fillStyle = 'rgba(249, 115, 22, 0.95)';
        ctx.beginPath();
        ctx.roundRect(comX - 90, comY - 95, 180, 44, 8);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠ SLIPPING INWARD!', comX, comY - 76);
        ctx.font = '10px sans-serif';
        ctx.fillText(`v < v_min (${phys.vMin.toFixed(1)} m/s)`, comX, comY - 60);
      }

      // Draw Force Vectors
      if (showVectors) {
        const arrow = (x1, y1, x2, y2, color, label, lw = 3) => {
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len < 6) return;

          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = lw;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Arrowhead
          const headAngle = Math.atan2(dy, dx);
          const ah = 9;
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(x2 - ah * Math.cos(headAngle - 0.4), y2 - ah * Math.sin(headAngle - 0.4));
          ctx.lineTo(x2 - ah * Math.cos(headAngle + 0.4), y2 - ah * Math.sin(headAngle + 0.4));
          ctx.closePath();
          ctx.fill();

          // Label
          if (label) {
            ctx.font = 'bold 11px ui-monospace, monospace';
            const offsetDist = 14;
            const lx = x2 + offsetDist * Math.cos(headAngle);
            const ly = y2 + offsetDist * Math.sin(headAngle);
            ctx.fillText(label, lx, ly);
          }
        };

        // Scale factors for visual vector length
        const scaleW = 0.0055;
        const scaleN = 0.0055;
        const scaleF = 0.0075;
        const scaleFc = 0.0055;

        // 1. Gravity W = mg (straight down, Amber)
        const wLen = phys.W * scaleW;
        arrow(comX, comY, comX, comY + wLen, '#fbbf24', `W = ${(phys.W / 1000).toFixed(1)} kN`);

        // 2. Normal Reaction N (perpendicular to road, Cyan)
        const nLen = phys.N * scaleN;
        const nEndX = comX - nx * nLen;
        const nEndY = comY - ny * nLen;
        arrow(comX, comY, nEndX, nEndY, '#38bdf8', `N = ${(phys.N / 1000).toFixed(1)} kN`);

        // 3. Lateral Friction f (along road slope, Magenta/Orange)
        if (Math.abs(phys.fReq) > 10) {
          const fMag = Math.abs(phys.fReq);
          const fLen = fMag * scaleF;
          const fDir = phys.fReq > 0 ? 1 : -1;
          const fEndX = comX - fDir * Math.cos(roadAngleRad) * fLen;
          const fEndY = comY + fDir * Math.sin(roadAngleRad) * fLen;
          const fColor = phys.status === 'skid_out' ? '#ef4444' : '#f43f5e';
          arrow(comX, comY, fEndX, fEndY, fColor, `f_s = ${(fMag / 1000).toFixed(1)} kN`);
        }

        // 4. Net Centripetal Inward Force Fc (horizontal pointing inward/left, Emerald)
        const fcLen = Math.min(180, phys.Fc * scaleFc);
        arrow(comX, comY, comX - fcLen, comY, '#10b981', `F_c = ${(phys.Fc / 1000).toFixed(1)} kN`, 3.5);

        // Optional Component Breakdown (N*sin theta and N*cos theta)
        if (showComponents) {
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
          ctx.lineWidth = 1.5;
          // Horizontal N*sin theta
          const nH = phys.N * Math.sin(roadAngleRad) * scaleN;
          ctx.beginPath();
          ctx.moveTo(comX, comY);
          ctx.lineTo(comX - nH, comY);
          ctx.stroke();
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('N·sin(θ)', comX - nH - 45, comY - 6);

          // Vertical N*cos theta
          const nV = phys.N * Math.cos(roadAngleRad) * scaleN;
          ctx.beginPath();
          ctx.moveTo(comX, comY);
          ctx.lineTo(comX, comY - nV);
          ctx.stroke();
          ctx.fillText('N·cos(θ)', comX + 8, comY - nV + 14);
          ctx.setLineDash([]);
        }
      }

      // Turn Axis Indicator (Curve Center)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(40, 40);
      ctx.lineTo(40, H - 40);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Center of Turn Axis', 70, 50);

      // Radius line indicator
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.beginPath();
      ctx.moveTo(40, comY);
      ctx.lineTo(comX, comY);
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`r = ${radius} m`, (40 + comX) / 2, comY - 8);

      if (isRunning) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [phys, showVectors, showComponents, theta, radius, isRunning]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-sans text-slate-100">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30">
              Physics Form 4 • Topic 2
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Civil Engineering Application
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Banked Track & Vehicle Cornering Mechanics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Examine how banking angles resolve normal reaction components N·sin(θ) = mv²/r to enable high-speed turns without relying on tyre friction.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            onClick={() => setShowTheoryModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>Formulas & Derivations</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
            title="Reset simulation parameters"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {PRESETS.map((p) => {
          const isSelected = !activeChallenge && theta === p.theta && radius === p.r;
          return (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className={`p-3 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-sky-950/60 border-sky-500 shadow-md shadow-sky-950/50 ring-1 ring-sky-500/40'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{p.name}</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />}
              </div>
              <p className="text-[11px] text-sky-400/90 font-mono mt-0.5">{p.tagline}</p>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{p.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Canvas Area (Col 8) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col justify-between">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={440}
              className="w-full h-auto block rounded-xl bg-slate-950 select-none border border-slate-800/80"
            />

            {/* Quick Status Pill */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-md flex items-center gap-1.5 ${
                  phys.status === 'optimum'
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                    : phys.status === 'safe'
                    ? 'bg-sky-950/80 border-sky-500/60 text-sky-300'
                    : phys.status === 'critical'
                    ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                    : 'bg-rose-950/90 border-rose-500/80 text-rose-300 animate-pulse'
                }`}
              >
                {phys.status === 'optimum' && <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                {phys.status === 'safe' && <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />}
                {phys.status === 'critical' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                {(phys.status === 'skid_out' || phys.status === 'slip_in') && (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span className="uppercase tracking-wider">
                  {phys.status === 'optimum'
                    ? 'Hands-Off Design Speed (0 N Friction)'
                    : phys.status === 'safe'
                    ? 'Safe (Friction Assisted)'
                    : phys.status === 'critical'
                    ? 'Critical Grip Limit (>85% Friction)'
                    : phys.status === 'skid_out'
                    ? 'Skidding Outward!'
                    : 'Slipping Down Inward!'}
                </span>
              </span>
            </div>

            {/* Vector Legend & Toggles */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-amber-400 rounded-full" /> Weight W = mg
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-sky-400 rounded-full" /> Normal N
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-rose-400 rounded-full" /> Lateral Friction f_s
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-400 rounded-full" /> Inward Centripetal F_c
                </span>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={showVectors}
                    onChange={(e) => setShowVectors(e.target.checked)}
                    className="accent-sky-500 rounded"
                  />
                  <span>Show Vectors</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={showComponents}
                    onChange={(e) => setShowComponents(e.target.checked)}
                    className="accent-sky-500 rounded"
                  />
                  <span>Decompose N</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Live Gauges & Controls (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Key Metric Gauges */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Telemetry & Calculations</span>
              <Gauge className="w-4 h-4 text-sky-400" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Vehicle Speed v</span>
                <span className="text-xl font-mono font-black text-white">{speed.toFixed(1)} m/s</span>
                <span className="text-[10px] text-sky-400 font-mono block">{(speed * 3.6).toFixed(0)} km/h</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Ideal Design v₀</span>
                <span className="text-xl font-mono font-black text-emerald-300">{phys.v0.toFixed(1)} m/s</span>
                <span className="text-[10px] text-emerald-400 font-mono block">{(phys.v0 * 3.6).toFixed(0)} km/h</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Max Safe v_max</span>
                <span className="text-base font-mono font-bold text-rose-400">
                  {phys.vMax > 150 ? '∞ (No Slip)' : `${phys.vMax.toFixed(1)} m/s`}
                </span>
                <span className="text-[9px] text-slate-500 block">
                  {phys.vMax > 150 ? 'Extreme Bank' : `${(phys.vMax * 3.6).toFixed(0)} km/h`}
                </span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Normal Force N</span>
                <span className="text-base font-mono font-bold text-sky-300">{(phys.N / 1000).toFixed(2)} kN</span>
                <span className="text-[9px] text-slate-500 block">{phys.gForce.toFixed(2)} Gs</span>
              </div>
            </div>

            {/* Friction Demand Bar */}
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Friction Demand Ratio</span>
                <span
                  className={`font-mono font-bold ${
                    Math.abs(phys.fReq) / phys.fMax > 1
                      ? 'text-rose-400'
                      : Math.abs(phys.fReq) / phys.fMax > 0.8
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {((Math.abs(phys.fReq) / phys.fMax) * 100).toFixed(0)}% used
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-700">
                <div
                  className={`h-full transition-all duration-200 rounded-full ${
                    Math.abs(phys.fReq) / phys.fMax > 1
                      ? 'bg-rose-500'
                      : Math.abs(phys.fReq) / phys.fMax > 0.8
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (Math.abs(phys.fReq) / phys.fMax) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 N (v = v₀)</span>
                <span>Max grip = {(phys.fMax / 1000).toFixed(1)} kN</span>
              </div>
            </div>
          </div>

          {/* Interactive Parameter Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Control Sliders</span>
              <Sliders className="w-4 h-4 text-sky-400" />
            </div>

            {/* Banking Angle */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Banking Angle θ</span>
                <span className="font-mono font-bold text-sky-400">{theta}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={45}
                step={1}
                value={theta}
                onChange={(e) => setTheta(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* Speed */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Vehicle Speed v</span>
                <span className="font-mono font-bold text-white">
                  {speed.toFixed(1)} m/s ({(speed * 3.6).toFixed(0)} km/h)
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={0.5}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* Curve Radius */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Curve Radius r</span>
                <span className="font-mono font-bold text-emerald-400">{radius} m</span>
              </div>
              <input
                type="range"
                min={20}
                max={250}
                step={5}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Friction Coeff */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Friction Coeff μ</span>
                <span className="font-mono font-bold text-rose-400">
                  {mu.toFixed(2)} {mu < 0.15 ? '(Ice)' : mu < 0.4 ? '(Wet)' : '(Dry)'}
                </span>
              </div>
              <input
                type="range"
                min={0.02}
                max={1.0}
                step={0.02}
                value={mu}
                onChange={(e) => setMu(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Guided Inquiry / Challenge Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Guided Inquiry Challenges</h3>
          </div>
          {activeChallenge && (
            <button
              onClick={() => setActiveChallenge(null)}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Exit Challenge
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CHALLENGES.map((ch) => {
            const isActive = activeChallenge?.id === ch.id;
            return (
              <div
                key={ch.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/40'
                    : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      {ch.difficulty}
                    </span>
                    {isActive && challengeCompleted && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Solved!
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">{ch.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{ch.hint}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between">
                  <button
                    onClick={() => handleStartChallenge(ch)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                      isActive
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    <span>{isActive ? 'Active Task' : 'Start Task'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {activeChallenge && challengeCompleted && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-100 flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <strong className="font-bold block text-emerald-300">Challenge Completed!</strong>
              <span>{activeChallenge.congrats}</span>
            </div>
          </div>
        )}
      </div>

      {/* Physics Formulas & Derivation Modal */}
      {showTheoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl text-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-bold text-white">Banked Curve Physics & Derivations</h3>
              </div>
              <button
                onClick={() => setShowTheoryModal(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
                <h4 className="font-bold text-sky-300 text-sm mb-1">1. Ideal Banking (Zero Lateral Friction)</h4>
                <p className="text-slate-300">
                  On a frictionless banked turn inclined at angle θ, the normal reaction force N is tilted:
                </p>
                <ul className="list-disc list-inside mt-1 space-y-1 font-mono text-slate-400">
                  <li>Vertical equilibrium: N·cos(θ) = mg</li>
                  <li>Horizontal inward centripetal acceleration: N·sin(θ) = mv² / r</li>
                </ul>
                <p className="mt-2 text-slate-300">
                  Dividing the two equations eliminates both mass m and normal force N:
                </p>
                <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-center text-emerald-400 font-bold text-sm my-1">
                  tan(θ) = v₀² / (rg) ⟹ v₀ = √(rg·tan θ)
                </div>
                <p className="text-[11px] text-slate-400">
                  This design speed v₀ requires <strong>zero friction</strong> from tires.
                </p>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
                <h4 className="font-bold text-rose-300 text-sm mb-1">2. Maximum Safe Speed With Friction (v_max)</h4>
                <p className="text-slate-300">
                  When driving faster than v₀, the vehicle tends to skid outward up the slope. Static friction f_s acts down the slope to assist:
                </p>
                <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-center text-rose-400 font-bold text-sm my-1">
                  v_max = √( rg · (tan θ + μ) / (1 - μ·tan θ) )
                </div>
                <p className="text-[11px] text-slate-400">
                  For an unbanked flat road (θ = 0°), this formula simplifies to the familiar v_max = √(μ·r·g).
                </p>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
                <h4 className="font-bold text-amber-300 text-sm mb-1">3. Conical Pendulum Analogy</h4>
                <p className="text-slate-300">
                  Notice the exact mathematical equivalence with a conical pendulum:
                </p>
                <ul className="list-disc list-inside mt-1 space-y-1 font-mono text-slate-400">
                  <li>String Tension: T·cos(θ) = mg, T·sin(θ) = mv² / r</li>
                  <li>Result: tan(θ) = v² / (rg) = r·ω² / g</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowTheoryModal(false)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
