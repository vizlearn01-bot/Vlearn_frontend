import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Gauge,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sliders,
  Sparkles,
  Compass,
  HelpCircle,
  Trophy,
  Layers,
  Eye,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

// ==========================================
// PRESET CONFIGURATIONS
// ==========================================
const PRESETS = [
  {
    id: 'kcse_classic',
    name: 'KCSE Standard Threshold',
    subtitle: 'r = 10.0 m, v₀ = 22.2 m/s (v_crit boundary)',
    r: 10.0,
    v0: 22.2,
    m: 600,
    desc: 'Exact textbook boundary where launch speed is just above √(5gr). Cart skims the apex with near-zero normal force (N ≈ 0, weightless float).',
  },
  {
    id: 'stall_disaster',
    name: 'Critical Stall & Detach',
    subtitle: 'r = 14.0 m, v₀ = 20.0 m/s (Under-speed hazard)',
    r: 14.0,
    v0: 20.0,
    m: 800,
    desc: 'Launch speed is below √(5gr). Normal force drops to zero before the apex—cart detaches and plunges into dramatic ballistic free-fall!',
  },
  {
    id: 'megacoaster',
    name: 'Thrill Park Megacoaster',
    subtitle: 'r = 18.0 m, v₀ = 35.0 m/s (Safe high-speed inversion)',
    r: 18.0,
    v0: 35.0,
    m: 1200,
    desc: 'Modern steel roller coaster inversion maintaining robust track contact and exciting apex velocity with plenty of safety margin.',
  },
  {
    id: 'blackout_g',
    name: 'G-Force Blackout Beast',
    subtitle: 'r = 7.0 m, v₀ = 30.0 m/s (Extreme G > 8G)',
    r: 7.0,
    v0: 30.0,
    m: 650,
    desc: 'Tight radius and massive entry speed create brutal compressive G-forces (> 8.5G) at the bottom, triggering blackout warning.',
  },
  {
    id: 'fairground',
    name: 'Gentle Family Coaster',
    subtitle: 'r = 8.0 m, v₀ = 21.0 m/s (Moderate thrill)',
    r: 8.0,
    v0: 21.0,
    m: 500,
    desc: 'Moderate loop radius providing a fun, comfortable loop-the-loop experience without punishing human physiological limits.',
  },
];

// ==========================================
// KCSE EXAM CHALLENGES
// ==========================================
const KCSE_CHALLENGES = [
  {
    id: 'ch_apex_crit',
    title: 'Challenge 1: Apex Stall Speed',
    difficulty: 'KCSE Paper 1 Standard',
    question:
      'A coaster car completes a vertical circular loop of radius r = 10.0 m. Taking g = 9.8 m/s², what is the critical minimum speed at the highest point (apex) for the car to maintain track contact?',
    formulaHint: 'At apex: N + mg = m·v²/r. For critical minimum, set N = 0 ⇒ v_crit = √(g·r).',
    correctValue: Math.sqrt(9.8 * 10.0), // ~9.90 m/s
    unit: 'm/s',
    tolerance: 0.15,
    options: ['7.0 m/s', '9.9 m/s', '14.0 m/s', '22.1 m/s'],
    correctOptionIndex: 1,
    explanation:
      'At the highest point (Point C), both the track normal force N and gravitational weight mg act vertically downwards toward the loop center. At the critical detachment threshold, N = 0. Therefore, mg = m·v²/r, giving v_crit = √(g·r) = √(9.8 × 10.0) = 9.90 m/s.',
  },
  {
    id: 'ch_bottom_speed',
    title: 'Challenge 2: Ground Launch Threshold',
    difficulty: 'KCSE Conservation of Energy',
    question:
      'Using the principle of conservation of mechanical energy (assuming frictionless rails), calculate the minimum speed v₀ at the lowest point (Point A) to ensure the car rounds the apex without falling off (r = 10.0 m).',
    formulaHint: '½m·v₀² = ½m·v_top² + mg(2r). Substitute v_top = √(gr) ⇒ v₀ = √(5gr).',
    correctValue: Math.sqrt(5 * 9.8 * 10.0), // ~22.14 m/s
    unit: 'm/s',
    tolerance: 0.25,
    options: ['15.7 m/s', '19.8 m/s', '22.1 m/s', '31.3 m/s'],
    correctOptionIndex: 2,
    explanation:
      'By conservation of energy between the lowest point (h = 0) and highest point (h = 2r): ½m·v₀² = ½m·v_top² + mg(2r). At the critical apex threshold, v_top² = gr. Hence ½m·v₀² = ½m(gr) + 2mgr = 2.5mgr ⇒ v₀² = 5gr ⇒ v₀ = √(5gr) = √(5 × 9.8 × 10) = 22.14 m/s.',
  },
  {
    id: 'ch_bottom_strain',
    title: 'Challenge 3: Normal Force at Lowest Point',
    difficulty: 'KCSE Forces & G-Strain',
    question:
      'If a 500 kg coaster car enters the loop at the critical speed v₀ = √(5gr), what is the normal reaction force N exerted by the track on the car at the bottom (Point A)? Express N in terms of mg.',
    formulaHint: 'At bottom: N - mg = m·v₀²/r. Substitute v₀² = 5gr ⇒ N = mg + 5mg = 6mg.',
    correctValue: 6.0,
    unit: 'mg',
    tolerance: 0.1,
    options: ['1 mg', '4 mg', '5 mg', '6 mg'],
    correctOptionIndex: 3,
    explanation:
      'At the bottom, the net inward centripetal force is F_c = N - mg. Thus N = m·v₀²/r + mg. Since v₀² = 5gr, N = m(5gr)/r + mg = 5mg + mg = 6mg! Riders experience an apparent weight equal to 6 times their normal weight (6.0 Gs) even at minimum loop entry speed!',
  },
];

// ==========================================
// MAIN SIMULATION COMPONENT
// ==========================================
export default function VerticalCircleLoopSim({ onTelemetry }) {
  // Physical parameters
  const [radius, setRadius] = useState(12.0); // meters (6m to 24m)
  const [releaseSpeed, setReleaseSpeed] = useState(26.0); // m/s (10m/s to 42m/s)
  const [cartMass, setCartMass] = useState(800); // kg (300kg to 2000kg)
  const g = 9.8; // m/s² (standard KCSE)

  // Simulation playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [playSpeed, setPlaySpeed] = useState(1.0); // 0.25, 0.5, 1.0, 1.5, 2.0
  const [autoLoop, setAutoLoop] = useState(true);
  const [cameraView, setCameraView] = useState('iso'); // 'iso', 'side', 'front'

  // Visualization toggles
  const [showVectors, setShowVectors] = useState(true);
  const [showWeightVector, setShowWeightVector] = useState(true);
  const [showNormalVector, setShowNormalVector] = useState(true);
  const [showVelocityVector, setShowVelocityVector] = useState(true);
  const [showCentripetalVector, setShowCentripetalVector] = useState(true);
  const [showSupportPillars, setShowSupportPillars] = useState(true);
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry', 'theory', 'challenges'

  // Challenge mode state
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [userSelectedOption, setUserSelectedOption] = useState(null);
  const [challengeAnswerChecked, setChallengeAnswerChecked] = useState(false);
  const [challengeSuccess, setChallengeSuccess] = useState(false);

  // Canvas and animation references
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Runtime physical simulation state
  const simStateRef = useRef({
    // phase: 'approach', 'loop', 'exit', 'stalled_fall', 'ground_impact'
    phase: 'approach',
    approachX: -2.8 * 12.0, // track meters
    loopAngle: 0, // radians (0 = bottom, pi = apex, 2*pi = loop complete)
    exitX: 0,
    currentSpeed: 26.0,
    currentNormal: 0,
    currentG: 1.0,
    peakG: 1.0,
    minG: 1.0,
    // Detachment free-fall parameters
    fallPos: { x: 0, y: 0, z: 0 },
    fallVel: { x: 0, y: 0, z: 0 },
    fallAngle: 0,
    fallRotSpeed: 0,
    fallTime: 0,
    // Visual effects
    sparks: [],
    impactShockwave: 0,
    loopCompletedOnce: false,
    stallOccurred: false,
  });

  // Derived static thresholds
  const vCritTop = useMemo(() => Math.sqrt(g * radius), [g, radius]);
  const vCritBottom = useMemo(() => Math.sqrt(5 * g * radius), [g, radius]);
  const vHorizReach = useMemo(() => Math.sqrt(2 * g * radius), [g, radius]);

  // Overall system status
  const simulationStatus = useMemo(() => {
    if (releaseSpeed < vCritBottom) {
      return {
        badge: 'Critical Stall Hazard!',
        color: 'rose',
        isSafe: false,
        isBlackout: false,
        desc: `Launch speed (${releaseSpeed.toFixed(1)} m/s) is below critical threshold v₀,crit = ${vCritBottom.toFixed(1)} m/s. Normal force will vanish before apex!`,
      };
    }
    const maxBottomG = 1 + (releaseSpeed * releaseSpeed) / (g * radius);
    if (maxBottomG > 6.0) {
      return {
        badge: 'Extreme G-Force Blackout Risk!',
        color: 'amber',
        isSafe: true,
        isBlackout: true,
        desc: `Massive compressive load (${maxBottomG.toFixed(1)} Gs at lowest point) exceeds standard human tolerance (6.0 Gs)!`,
      };
    }
    return {
      badge: 'Safe Loop Completed!',
      color: 'emerald',
      isSafe: true,
      isBlackout: false,
      desc: `Sufficient kinetic energy! Continuous track contact maintained at apex (v_apex = ${Math.sqrt(Math.max(0, releaseSpeed * releaseSpeed - 4 * g * radius)).toFixed(1)} m/s ≥ ${vCritTop.toFixed(1)} m/s).`,
    };
  }, [releaseSpeed, vCritBottom, vCritTop, g, radius]);

  // Reset runtime simulation state
  const resetRun = useCallback(() => {
    const s = simStateRef.current;
    s.phase = 'approach';
    s.approachX = -2.5 * radius;
    s.loopAngle = 0;
    s.exitX = 0;
    s.currentSpeed = releaseSpeed;
    s.currentNormal = cartMass * ((releaseSpeed * releaseSpeed) / radius + g);
    s.currentG = 1 + (releaseSpeed * releaseSpeed) / (g * radius);
    s.peakG = s.currentG;
    s.minG = s.currentG;
    s.fallPos = { x: 0, y: 0, z: 0 };
    s.fallVel = { x: 0, y: 0, z: 0 };
    s.fallAngle = 0;
    s.fallRotSpeed = 0;
    s.fallTime = 0;
    s.sparks = [];
    s.impactShockwave = 0;
    s.stallOccurred = false;
    lastTimeRef.current = null;
  }, [radius, releaseSpeed, cartMass, g]);

  // When physical sliders change, smoothly re-arm
  useEffect(() => {
    resetRun();
  }, [radius, releaseSpeed, cartMass, resetRun]);

  // Camera projection math
  const getCameraAngles = useCallback(() => {
    if (cameraView === 'side') {
      return { yaw: 0, pitch: 0 };
    }
    if (cameraView === 'front') {
      return { yaw: Math.PI / 2, pitch: 0.15 };
    }
    // Isometric default
    return { yaw: 0.42, pitch: 0.22 };
  }, [cameraView]);

  // 3D Point to 2D Canvas Projection with perspective
  const project3D = useCallback(
    (x, y, z, cx, cy, scale, yaw, pitch) => {
      // Rotation around Y (yaw)
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const y1 = y;

      // Rotation around X (pitch)
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const y2 = y1 * cosP - z1 * sinP;
      const z2 = y1 * sinP + z1 * cosP;

      // Perspective scaling
      const cameraDist = 4.8;
      const factor = cameraDist / (cameraDist + z2 / 24.0);

      const sx = cx + x1 * scale * factor;
      const sy = cy - y2 * scale * factor;

      return { sx, sy, depth: z2, factor };
    },
    []
  );

  // Background Starfield generation (persistent)
  const starfield = useMemo(() => {
    const stars = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        xRatio: (i * 137.508) % 1,
        yRatio: ((i + 17) * 93.313) % 0.75,
        radius: 0.8 + ((i % 5) * 0.3),
        phase: (i * 0.73) % (Math.PI * 2),
      });
    }
    return stars;
  }, []);

  // Main Canvas Rendering & Physics Update Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;

    const render = (now) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const rawDt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;
      const dt = isPlaying ? rawDt * playSpeed : 0;

      const s = simStateRef.current;
      const R = radius;
      const m = cartMass;
      const v0 = releaseSpeed;

      // ----------------------------------------------------
      // 1. PHYSICS STATE MACHINE UPDATE
      // ----------------------------------------------------
      if (dt > 0) {
        if (s.phase === 'approach') {
          s.currentSpeed = v0;
          s.approachX += v0 * dt;
          s.currentNormal = m * ((v0 * v0) / R + g);
          s.currentG = 1 + (v0 * v0) / (g * R);
          s.peakG = Math.max(s.peakG, s.currentG);
          s.minG = Math.min(s.minG, s.currentG);

          if (s.approachX >= 0) {
            s.approachX = 0;
            s.phase = 'loop';
            s.loopAngle = 0;
          }
        } else if (s.phase === 'loop') {
          // Angle theta: 0 = bottom, pi = apex, 2*pi = bottom return
          const theta = s.loopAngle;
          const h = R * (1 - Math.cos(theta));
          const vSq = v0 * v0 - 2 * g * h;

          if (vSq <= 0) {
            // Reached maximum height before horizontal; stall out
            s.currentSpeed = 0;
            s.phase = 'stalled_fall';
            s.stallOccurred = true;
            // Initiate free fall
            const fallX = -R * Math.sin(theta);
            const fallY = R * (1 - Math.cos(theta));
            const fallZ = -0.32 * R + 0.64 * R * (theta / (Math.PI * 2));
            s.fallPos = { x: fallX, y: fallY, z: fallZ };
            s.fallVel = { x: 0, y: 0, z: 0 };
            s.fallAngle = theta;
            s.fallRotSpeed = 1.5;
            s.fallTime = 0;
          } else {
            const v = Math.sqrt(vSq);
            s.currentSpeed = v;

            // Inward normal force calculation:
            // Net inward force Fc = m*v^2/R. Gravity inward component = -mg*cos(theta).
            // N - mg*cos(theta) = m*v^2/R => N = m*v^2/R + mg*cos(theta).
            // Check: At bottom (theta=0), cos(0)=1 => N = mv^2/R + mg.
            // Check: At apex (theta=pi), cos(pi)=-1 => N = mv^2/R - mg.
            const N = (m * vSq) / R + m * g * Math.cos(theta);
            s.currentNormal = N;
            s.currentG = N / (m * g);
            s.peakG = Math.max(s.peakG, s.currentG);
            s.minG = Math.min(s.minG, s.currentG);

            // Emit sparks at bottom when G-force is intense (> 4.5G)
            if (s.currentG > 4.5 && Math.random() < 0.4) {
              s.sparks.push({
                x: -R * Math.sin(theta) + (Math.random() - 0.5) * 0.8,
                y: h + 0.1,
                z: -0.32 * R + 0.64 * R * (theta / (Math.PI * 2)),
                vx: (Math.random() - 0.5) * 6,
                vy: Math.random() * 5 + 2,
                vz: (Math.random() - 0.5) * 6,
                life: 1.0,
              });
            }

            // DETACHMENT CHECK: Did normal force drop to zero on the upper half?
            // (Only detaches if theta > pi/2 and N <= 0)
            if (theta > Math.PI * 0.5 && N <= 0.05) {
              // CART LOSES CONTACT & FALLS!
              s.phase = 'stalled_fall';
              s.stallOccurred = true;
              s.currentNormal = 0;
              s.currentG = 0;

              // Tangent vector direction: dX/dtheta = -R*cos(theta), dY/dtheta = R*sin(theta)
              const tangentX = -Math.cos(theta);
              const tangentY = Math.sin(theta);
              const fallX = -R * Math.sin(theta);
              const fallY = R * (1 - Math.cos(theta));
              const fallZ = -0.32 * R + 0.64 * R * (theta / (Math.PI * 2));

              s.fallPos = { x: fallX, y: fallY, z: fallZ };
              s.fallVel = {
                x: v * tangentX,
                y: v * tangentY,
                z: 0.1 * v,
              };
              s.fallAngle = theta;
              s.fallRotSpeed = 3.5;
              s.fallTime = 0;

              if (typeof onTelemetry === 'function') {
                onTelemetry('SIMULATION_STALL_OCCURRED', {
                  releaseSpeed: v0,
                  radius: R,
                  stallAngleDeg: ((theta * 180) / Math.PI).toFixed(1),
                });
              }
            } else {
              // Advance along loop: dtheta = (v / R) * dt
              const dTheta = (v / R) * dt;
              s.loopAngle += dTheta;

              if (s.loopAngle >= Math.PI * 2) {
                s.loopAngle = Math.PI * 2;
                s.phase = 'exit';
                s.exitX = 0;
                s.loopCompletedOnce = true;

                if (typeof onTelemetry === 'function') {
                  onTelemetry('SIMULATION_LOOP_COMPLETED', {
                    releaseSpeed: v0,
                    radius: R,
                    apexSpeed: Math.sqrt(Math.max(0, v0 * v0 - 4 * g * R)),
                  });
                }
              }
            }
          }
        } else if (s.phase === 'exit') {
          s.currentSpeed = v0;
          s.exitX += v0 * dt;
          s.currentNormal = m * ((v0 * v0) / R + g);
          s.currentG = 1 + (v0 * v0) / (g * R);

          if (s.exitX >= 2.5 * R) {
            if (autoLoop) {
              s.phase = 'approach';
              s.approachX = -2.5 * R;
              s.loopAngle = 0;
              s.exitX = 0;
            } else {
              s.currentSpeed = 0;
            }
          }
        } else if (s.phase === 'stalled_fall') {
          // Ballistic projectile motion under gravity: a = (0, -g, 0)
          s.fallTime += dt;
          s.fallPos.x += s.fallVel.x * dt;
          s.fallPos.y += s.fallVel.y * dt - 0.5 * g * dt * dt;
          s.fallVel.y -= g * dt;
          s.fallPos.z += s.fallVel.z * dt;
          s.fallAngle += s.fallRotSpeed * dt;

          s.currentSpeed = Math.sqrt(
            s.fallVel.x * s.fallVel.x +
              s.fallVel.y * s.fallVel.y +
              s.fallVel.z * s.fallVel.z
          );
          s.currentNormal = 0;
          s.currentG = 0; // In free fall, apparent weight is zero

          // Hit ground / safety crash net
          if (s.fallPos.y <= 0) {
            s.fallPos.y = 0;
            s.fallVel.y = -s.fallVel.y * 0.25; // bounce damp
            s.fallVel.x *= 0.6;
            s.fallRotSpeed *= 0.3;
            s.impactShockwave = 1.0;

            if (Math.abs(s.fallVel.y) < 1.0) {
              s.phase = 'ground_impact';
            }
          }
        } else if (s.phase === 'ground_impact') {
          s.currentSpeed = 0;
          s.currentNormal = m * g;
          s.currentG = 1.0;
        }

        // Update sparks
        for (let i = s.sparks.length - 1; i >= 0; i--) {
          const sp = s.sparks[i];
          sp.x += sp.vx * dt;
          sp.y += sp.vy * dt - 0.5 * g * dt * dt;
          sp.vy -= g * dt;
          sp.z += sp.vz * dt;
          sp.life -= dt * 2.2;
          if (sp.life <= 0 || sp.y <= 0) {
            s.sparks.splice(i, 1);
          }
        }

        if (s.impactShockwave > 0) {
          s.impactShockwave = Math.max(0, s.impactShockwave - dt * 1.5);
        }
      }

      // ----------------------------------------------------
      // 2. CANVAS DRAWING ROUTINES
      // ----------------------------------------------------
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Handle HiDPI scaling
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep Midnight Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#040711');
      skyGrad.addColorStop(0.5, '#0a1024');
      skyGrad.addColorStop(0.82, '#141d38');
      skyGrad.addColorStop(1, '#0b0f1d');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Twinkling Starfield
      starfield.forEach((star) => {
        const sx = star.xRatio * width;
        const sy = star.yRatio * height;
        const shimmer = 0.35 + 0.65 * Math.sin(now * 0.003 + star.phase);
        ctx.fillStyle = `rgba(226, 232, 240, ${shimmer})`;
        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Distant Theme Park Skyline: Ferris Wheel & Carnival Glow
      const groundY = height * 0.78;
      const ferrisCenterX = width * 0.84;
      const ferrisCenterY = groundY - 75;
      const ferrisRadius = 46;
      const ferrisAngle = now * 0.0004;

      // Ferris Wheel Structure
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(ferrisCenterX, ferrisCenterY, ferrisRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Ferris Wheel Spokes & Gondolas
      const numGondolas = 10;
      for (let i = 0; i < numGondolas; i++) {
        const ang = ferrisAngle + (i * Math.PI * 2) / numGondolas;
        const gx = ferrisCenterX + Math.cos(ang) * ferrisRadius;
        const gy = ferrisCenterY + Math.sin(ang) * ferrisRadius;
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
        ctx.beginPath();
        ctx.moveTo(ferrisCenterX, ferrisCenterY);
        ctx.lineTo(gx, gy);
        ctx.stroke();

        // Glowing Gondola Cabins
        const cabinColor = i % 2 === 0 ? '#06b6d4' : '#f43f5e';
        ctx.fillStyle = cabinColor;
        ctx.beginPath();
        ctx.arc(gx, gy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ferris Wheel Hub & Support Legs
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ferrisCenterX, ferrisCenterY);
      ctx.lineTo(ferrisCenterX - 22, groundY);
      ctx.moveTo(ferrisCenterX, ferrisCenterY);
      ctx.lineTo(ferrisCenterX + 22, groundY);
      ctx.stroke();

      // Distant Coaster Lift Hill Silhouette with Flashing Aviation Strobe
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.beginPath();
      ctx.moveTo(width * 0.05, groundY);
      ctx.lineTo(width * 0.16, groundY - 110);
      ctx.lineTo(width * 0.22, groundY - 80);
      ctx.lineTo(width * 0.26, groundY);
      ctx.closePath();
      ctx.fill();

      // Aviation Red Strobe on Lift Hill
      const strobeOn = Math.sin(now * 0.007) > 0.4;
      ctx.fillStyle = strobeOn ? 'rgba(239, 68, 68, 0.95)' : 'rgba(239, 68, 68, 0.2)';
      ctx.beginPath();
      ctx.arc(width * 0.16, groundY - 110, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Theme Park Paver Ground
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, height);
      groundGrad.addColorStop(0, '#0c1322');
      groundGrad.addColorStop(0.3, '#070b14');
      groundGrad.addColorStop(1, '#03050a');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, width, height - groundY);

      // Perspective Ground Grid Lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x + (x - width * 0.5) * 0.4, height);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, groundY + 18);
      ctx.lineTo(width, groundY + 18);
      ctx.moveTo(0, groundY + 45);
      ctx.lineTo(width, groundY + 45);
      ctx.stroke();

      // Ground Spotlights Aiming Up at the Loop
      const spotLeft = width * 0.38;
      const spotRight = width * 0.62;
      const spotGrad1 = ctx.createRadialGradient(spotLeft, groundY, 10, spotLeft - 30, groundY - 160, 160);
      spotGrad1.addColorStop(0, 'rgba(6, 182, 212, 0.16)');
      spotGrad1.addColorStop(1, 'transparent');
      ctx.fillStyle = spotGrad1;
      ctx.beginPath();
      ctx.moveTo(spotLeft - 10, groundY);
      ctx.lineTo(spotLeft - 70, groundY - 200);
      ctx.lineTo(spotLeft + 30, groundY - 200);
      ctx.lineTo(spotLeft + 10, groundY);
      ctx.closePath();
      ctx.fill();

      const spotGrad2 = ctx.createRadialGradient(spotRight, groundY, 10, spotRight + 30, groundY - 160, 160);
      spotGrad2.addColorStop(0, 'rgba(245, 158, 11, 0.14)');
      spotGrad2.addColorStop(1, 'transparent');
      ctx.fillStyle = spotGrad2;
      ctx.beginPath();
      ctx.moveTo(spotRight - 10, groundY);
      ctx.lineTo(spotRight - 30, groundY - 200);
      ctx.lineTo(spotRight + 70, groundY - 200);
      ctx.lineTo(spotRight + 10, groundY);
      ctx.closePath();
      ctx.fill();

      // ----------------------------------------------------
      // 3. 3D TRACK & STRUCTURE CALCULATIONS
      // ----------------------------------------------------
      const { yaw, pitch } = getCameraAngles();
      const cx = width * 0.5;
      const cy = groundY;
      // Auto-scale so a 24m loop fits comfortably on screen
      const scale = (height * 0.38) / (2.2 * R);
      const railGauge = 0.09 * R; // width between the twin steel rails

      // Coordinate converter for track curve:
      // u in [-1.5, 0] = approach
      // u in [0, 1] = vertical loop (phi = 2*pi*u)
      // u in [1, 2.5] = exit
      const getTrackPoint3D = (u) => {
        if (u < 0) {
          return {
            x: u * 1.7 * R,
            y: 0,
            z: -0.32 * R + 0.05 * R * u,
            tangent: { x: 1, y: 0, z: 0 },
            normal: { x: 0, y: 1, z: 0 },
            binormal: { x: 0, y: 0, z: 1 },
          };
        }
        if (u <= 1.0) {
          const phi = u * Math.PI * 2;
          const x = -R * Math.sin(phi);
          const y = R * (1 - Math.cos(phi));
          // Gentle Z corkscrew transition to avoid track collision
          const z = -0.32 * R + 0.64 * R * u;

          // Tangents
          const tx = -Math.cos(phi);
          const ty = Math.sin(phi);
          const tz = (0.64 * R) / (Math.PI * 2 * R);
          const tLen = Math.sqrt(tx * tx + ty * ty + tz * tz);
          const tangent = { x: tx / tLen, y: ty / tLen, z: tz / tLen };

          // Inward normal (towards circle center (0, R, z))
          const nx = Math.sin(phi);
          const ny = Math.cos(phi);
          const normal = { x: nx, y: ny, z: 0 };

          // Binormal = Tangent x Normal
          const bx = tangent.y * normal.z - tangent.z * normal.y;
          const by = tangent.z * normal.x - tangent.x * normal.z;
          const bz = tangent.x * normal.y - tangent.y * normal.x;
          const bLen = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
          const binormal = { x: bx / bLen, y: by / bLen, z: bz / bLen };

          return { x, y, z, tangent, normal, binormal };
        }
        // Exit run
        const uExit = u - 1.0;
        return {
          x: uExit * 1.7 * R,
          y: 0,
          z: 0.32 * R + 0.05 * R * uExit,
          tangent: { x: 1, y: 0, z: 0 },
          normal: { x: 0, y: 1, z: 0 },
          binormal: { x: 0, y: 0, z: 1 },
        };
      };

      // ----------------------------------------------------
      // 4. DRAW SUPPORT LATTICE TOWERS & PILLARS
      // ----------------------------------------------------
      if (showSupportPillars) {
        const pillarLocations = [
          { u: 0.5, label: 'Apex Truss' }, // Top apex
          { u: 0.25, label: 'Ascent Pillar' }, // Rising flank
          { u: 0.75, label: 'Descent Pillar' }, // Falling flank
        ];

        pillarLocations.forEach((loc) => {
          const pt = getTrackPoint3D(loc.u);
          const top2D = project3D(pt.x, pt.y - 0.06 * R, pt.z, cx, cy, scale, yaw, pitch);
          const baseLeft2D = project3D(pt.x - 0.35 * R, 0, pt.z - 0.15 * R, cx, cy, scale, yaw, pitch);
          const baseRight2D = project3D(pt.x + 0.35 * R, 0, pt.z + 0.15 * R, cx, cy, scale, yaw, pitch);

          // Steel lattice A-frame truss
          ctx.strokeStyle = 'rgba(71, 85, 105, 0.55)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(baseLeft2D.sx, baseLeft2D.sy);
          ctx.lineTo(top2D.sx, top2D.sy);
          ctx.lineTo(baseRight2D.sx, baseRight2D.sy);
          ctx.stroke();

          // Cross-bracing diagonals
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
          const numBands = 5;
          for (let b = 1; b <= numBands; b++) {
            const frac = b / (numBands + 1);
            const midY = (pt.y - 0.06 * R) * frac;
            const b1 = project3D(
              pt.x - 0.35 * R * (1 - frac),
              midY,
              pt.z - 0.15 * R * (1 - frac),
              cx,
              cy,
              scale,
              yaw,
              pitch
            );
            const b2 = project3D(
              pt.x + 0.35 * R * (1 - frac),
              midY,
              pt.z + 0.15 * R * (1 - frac),
              cx,
              cy,
              scale,
              yaw,
              pitch
            );
            ctx.beginPath();
            ctx.moveTo(b1.sx, b1.sy);
            ctx.lineTo(b2.sx, b2.sy);
            ctx.stroke();
          }

          // Concrete anchor footings at ground
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.ellipse(baseLeft2D.sx, baseLeft2D.sy, 8, 4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(baseRight2D.sx, baseRight2D.sy, 8, 4, 0, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ----------------------------------------------------
      // 5. DRAW TUBULAR STEEL ROLLERCOASTER TRACK
      // ----------------------------------------------------
      // We sample points along the track from u = -1.4 to u = 2.4
      const trackSamples = 130;
      const trackPoints = [];

      for (let i = 0; i <= trackSamples; i++) {
        const u = -1.4 + (i / trackSamples) * 3.8;
        const pt3D = getTrackPoint3D(u);

        // Calculate left rail, right rail, and spine pipe positions
        const leftX = pt3D.x - (railGauge / 2) * pt3D.binormal.x;
        const leftY = pt3D.y - (railGauge / 2) * pt3D.binormal.y;
        const leftZ = pt3D.z - (railGauge / 2) * pt3D.binormal.z;

        const rightX = pt3D.x + (railGauge / 2) * pt3D.binormal.x;
        const rightY = pt3D.y + (railGauge / 2) * pt3D.binormal.y;
        const rightZ = pt3D.z + (railGauge / 2) * pt3D.binormal.z;

        const spineX = pt3D.x - 0.08 * R * pt3D.normal.x;
        const spineY = pt3D.y - 0.08 * R * pt3D.normal.y;
        const spineZ = pt3D.z - 0.08 * R * pt3D.normal.z;

        const pCenter = project3D(pt3D.x, pt3D.y, pt3D.z, cx, cy, scale, yaw, pitch);
        const pLeft = project3D(leftX, leftY, leftZ, cx, cy, scale, yaw, pitch);
        const pRight = project3D(rightX, rightY, rightZ, cx, cy, scale, yaw, pitch);
        const pSpine = project3D(spineX, spineY, spineZ, cx, cy, scale, yaw, pitch);

        trackPoints.push({
          u,
          pt3D,
          pCenter,
          pLeft,
          pRight,
          pSpine,
          depth: pCenter.depth,
        });
      }

      // Cross-Ties (Railway ties & triangular struts connecting spine to rails)
      for (let i = 0; i < trackPoints.length; i += 2) {
        const tp = trackPoints[i];
        // Cross tie between left and right rails
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(tp.pLeft.sx, tp.pLeft.sy);
        ctx.lineTo(tp.pRight.sx, tp.pRight.sy);
        ctx.stroke();

        // Struts to backbone spine pipe
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tp.pLeft.sx, tp.pLeft.sy);
        ctx.lineTo(tp.pSpine.sx, tp.pSpine.sy);
        ctx.lineTo(tp.pRight.sx, tp.pRight.sy);
        ctx.stroke();
      }

      // Backbone Spine Tubular Pipe (Drawn beneath)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      trackPoints.forEach((tp, idx) => {
        if (idx === 0) ctx.moveTo(tp.pSpine.sx, tp.pSpine.sy);
        else ctx.lineTo(tp.pSpine.sx, tp.pSpine.sy);
      });
      ctx.stroke();

      // Spine specular sheen highlight
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      trackPoints.forEach((tp, idx) => {
        if (idx === 0) ctx.moveTo(tp.pSpine.sx, tp.pSpine.sy);
        else ctx.lineTo(tp.pSpine.sx, tp.pSpine.sy);
      });
      ctx.stroke();

      // Left Running Rail (Metallic Steel Cylinder)
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      trackPoints.forEach((tp, idx) => {
        if (idx === 0) ctx.moveTo(tp.pLeft.sx, tp.pLeft.sy);
        else ctx.lineTo(tp.pLeft.sx, tp.pLeft.sy);
      });
      ctx.stroke();

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      trackPoints.forEach((tp, idx) => {
        if (idx === 0) ctx.moveTo(tp.pLeft.sx, tp.pLeft.sy);
        else ctx.lineTo(tp.pLeft.sx, tp.pLeft.sy);
      });
      ctx.stroke();

      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      trackPoints.forEach((tp, idx) => {
        if (idx === 0) ctx.moveTo(tp.pLeft.sx, tp.pLeft.sy);
        else ctx.lineTo(tp.pLeft.sx, tp.pLeft.sy);
      });
      ctx.stroke();

      // Right Running Rail (Metallic Steel Cylinder)
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      trackPoints.forEach((tp, idx) => {
        if (idx === 0) ctx.moveTo(tp.pRight.sx, tp.pRight.sy);
        else ctx.lineTo(tp.pRight.sx, tp.pRight.sy);
      });
      ctx.stroke();

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      trackPoints.forEach((tp, idx) => {
        if (idx === 0) ctx.moveTo(tp.pRight.sx, tp.pRight.sy);
        else ctx.lineTo(tp.pRight.sx, tp.pRight.sy);
      });
      ctx.stroke();

      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      trackPoints.forEach((tp, idx) => {
        if (idx === 0) ctx.moveTo(tp.pRight.sx, tp.pRight.sy);
        else ctx.lineTo(tp.pRight.sx, tp.pRight.sy);
      });
      ctx.stroke();

      // Key Point Marker Badges along the Track: Point A, Point B, Point C
      const ptMarkers = [
        { u: 0.0, label: 'Point A (Bottom)', sub: 'Max Strain', color: '#10b981' },
        { u: 0.25, label: 'Point B (Midway)', sub: 'N = mv²/r', color: '#06b6d4' },
        { u: 0.5, label: 'Point C (Apex)', sub: 'Min Speed Zone', color: '#f43f5e' },
      ];

      ptMarkers.forEach((mkr) => {
        const pt = getTrackPoint3D(mkr.u);
        const p2D = project3D(pt.x, pt.y, pt.z, cx, cy, scale, yaw, pitch);

        // Marker beacon ring
        ctx.strokeStyle = mkr.color;
        ctx.lineWidth = 1.8;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(p2D.sx, p2D.sy, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label pill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = mkr.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(p2D.sx + 12, p2D.sy - 14, 85, 26, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(mkr.label, p2D.sx + 16, p2D.sy - 2);
        ctx.fillStyle = mkr.color;
        ctx.font = '9px monospace';
        ctx.fillText(mkr.sub, p2D.sx + 16, p2D.sy + 8);
      });

      // ----------------------------------------------------
      // 6. ROLLERCOASTER CART RENDERING & DYNAMICS
      // ----------------------------------------------------
      let cartPos3D = { x: 0, y: 0, z: 0 };
      let cartTangent = { x: 1, y: 0, z: 0 };
      let cartNormal = { x: 0, y: 1, z: 0 };
      let cartBinormal = { x: 0, y: 0, z: 1 };
      let isDetached = false;

      if (s.phase === 'approach') {
        const u = s.approachX / (1.7 * R);
        const pt = getTrackPoint3D(u);
        cartPos3D = { x: s.approachX, y: 0, z: -0.32 * R };
        cartTangent = pt.tangent;
        cartNormal = pt.normal;
        cartBinormal = pt.binormal;
      } else if (s.phase === 'loop') {
        const u = s.loopAngle / (Math.PI * 2);
        const pt = getTrackPoint3D(u);
        cartPos3D = { x: pt.x, y: pt.y, z: pt.z };
        cartTangent = pt.tangent;
        cartNormal = pt.normal;
        cartBinormal = pt.binormal;
      } else if (s.phase === 'exit') {
        const u = 1.0 + s.exitX / (1.7 * R);
        const pt = getTrackPoint3D(u);
        cartPos3D = { x: s.exitX, y: 0, z: 0.32 * R };
        cartTangent = pt.tangent;
        cartNormal = pt.normal;
        cartBinormal = pt.binormal;
      } else if (s.phase === 'stalled_fall' || s.phase === 'ground_impact') {
        isDetached = true;
        cartPos3D = { ...s.fallPos };
        // Tumble rotation
        const tumbleAng = s.fallAngle;
        cartTangent = {
          x: -Math.cos(tumbleAng),
          y: Math.sin(tumbleAng),
          z: 0.1,
        };
        cartNormal = {
          x: Math.sin(tumbleAng),
          y: Math.cos(tumbleAng),
          z: 0,
        };
        cartBinormal = { x: 0, y: 0, z: 1 };
      }

      // Project cart center to 2D
      const cart2D = project3D(cartPos3D.x, cartPos3D.y, cartPos3D.z, cx, cy, scale, yaw, pitch);

      // Draw Headlight Beams illuminating the track ahead
      if (!isDetached) {
        const beamDist = 1.8 * R;
        const front3D = {
          x: cartPos3D.x + cartTangent.x * beamDist,
          y: cartPos3D.y + cartTangent.y * beamDist,
          z: cartPos3D.z + cartTangent.z * beamDist,
        };
        const beamEnd = project3D(front3D.x, front3D.y, front3D.z, cx, cy, scale, yaw, pitch);

        const beamGrad = ctx.createLinearGradient(cart2D.sx, cart2D.sy, beamEnd.sx, beamEnd.sy);
        beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
        beamGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(cart2D.sx, cart2D.sy);
        ctx.lineTo(beamEnd.sx - 15, beamEnd.sy - 15);
        ctx.lineTo(beamEnd.sx + 15, beamEnd.sy + 15);
        ctx.closePath();
        ctx.fill();
      }

      // Ground Impact Shockwave Ring
      if (s.impactShockwave > 0) {
        ctx.strokeStyle = `rgba(239, 68, 68, ${s.impactShockwave})`;
        ctx.lineWidth = 4 * s.impactShockwave;
        ctx.beginPath();
        ctx.ellipse(cart2D.sx, groundY, 70 * (1.1 - s.impactShockwave), 25 * (1.1 - s.impactShockwave), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Sparks
      s.sparks.forEach((sp) => {
        const sp2D = project3D(sp.x, sp.y, sp.z, cx, cy, scale, yaw, pitch);
        ctx.fillStyle = `rgba(251, 191, 36, ${sp.life})`;
        ctx.beginPath();
        ctx.arc(sp2D.sx, sp2D.sy, 2.5 * sp.life, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw 3D Roller Coaster Cart Chassis
      const cartLength = 0.28 * R;
      const cartWidth = 0.14 * R;
      const cartHeight = 0.11 * R;

      // 8 Vertices of the 3D Cart Box in local coordinates
      const halfL = cartLength / 2;
      const halfW = cartWidth / 2;
      const localVertices = [
        // Bottom 4 vertices
        { dl: -halfL, dw: -halfW, dh: 0 },
        { dl: halfL, dw: -halfW, dh: 0 },
        { dl: halfL, dw: halfW, dh: 0 },
        { dl: -halfL, dw: halfW, dh: 0 },
        // Top 4 vertices
        { dl: -halfL * 0.85, dw: -halfW * 0.85, dh: cartHeight },
        { dl: halfL * 0.95, dw: -halfW * 0.85, dh: cartHeight * 0.75 }, // tapered sports-hood
        { dl: halfL * 0.95, dw: halfW * 0.85, dh: cartHeight * 0.75 },
        { dl: -halfL * 0.85, dw: halfW * 0.85, dh: cartHeight },
      ];

      const projVertices = localVertices.map((v) => {
        const worldX =
          cartPos3D.x +
          cartTangent.x * v.dl +
          cartBinormal.x * v.dw +
          cartNormal.x * v.dh;
        const worldY =
          cartPos3D.y +
          cartTangent.y * v.dl +
          cartBinormal.y * v.dw +
          cartNormal.y * v.dh;
        const worldZ =
          cartPos3D.z +
          cartTangent.z * v.dl +
          cartBinormal.z * v.dw +
          cartNormal.z * v.dh;
        return project3D(worldX, worldY, worldZ, cx, cy, scale, yaw, pitch);
      });

      // Cart Body Color Palette
      const bodyColor = isDetached ? '#e11d48' : '#0284c7';
      const highlightColor = isDetached ? '#fb7185' : '#38bdf8';
      const shadowColor = isDetached ? '#881337' : '#0369a1';

      // Draw Cart Faces
      // Side Face (0, 1, 5, 4)
      ctx.fillStyle = shadowColor;
      ctx.beginPath();
      ctx.moveTo(projVertices[0].sx, projVertices[0].sy);
      ctx.lineTo(projVertices[1].sx, projVertices[1].sy);
      ctx.lineTo(projVertices[5].sx, projVertices[5].sy);
      ctx.lineTo(projVertices[4].sx, projVertices[4].sy);
      ctx.closePath();
      ctx.fill();

      // Top Deck (4, 5, 6, 7)
      ctx.fillStyle = highlightColor;
      ctx.beginPath();
      ctx.moveTo(projVertices[4].sx, projVertices[4].sy);
      ctx.lineTo(projVertices[5].sx, projVertices[5].sy);
      ctx.lineTo(projVertices[6].sx, projVertices[6].sy);
      ctx.lineTo(projVertices[7].sx, projVertices[7].sy);
      ctx.closePath();
      ctx.fill();

      // Front Face / Nose (1, 2, 6, 5)
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.moveTo(projVertices[1].sx, projVertices[1].sy);
      ctx.lineTo(projVertices[2].sx, projVertices[2].sy);
      ctx.lineTo(projVertices[6].sx, projVertices[6].sy);
      ctx.lineTo(projVertices[5].sx, projVertices[5].sy);
      ctx.closePath();
      ctx.fill();

      // Glowing Dual Headlights on the Front Bumper
      const hlLeft = {
        sx: (projVertices[1].sx + projVertices[5].sx) * 0.5,
        sy: (projVertices[1].sy + projVertices[5].sy) * 0.5,
      };
      const hlRight = {
        sx: (projVertices[2].sx + projVertices[6].sx) * 0.5,
        sy: (projVertices[2].sy + projVertices[6].sy) * 0.5,
      };
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(hlLeft.sx, hlLeft.sy, 2.8, 0, Math.PI * 2);
      ctx.arc(hlRight.sx, hlRight.sy, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Draw Rider Silhouettes (Front Row & Back Row)
      const riderPositions = [
        { dl: -halfL * 0.35, dw: -halfW * 0.35 },
        { dl: -halfL * 0.35, dw: halfW * 0.35 },
        { dl: halfL * 0.25, dw: -halfW * 0.35 },
        { dl: halfL * 0.25, dw: halfW * 0.35 },
      ];

      riderPositions.forEach((rp, idx) => {
        const headH = cartHeight + 0.07 * R;
        const riderHeadWorld = {
          x:
            cartPos3D.x +
            cartTangent.x * rp.dl +
            cartBinormal.x * rp.dw +
            cartNormal.x * headH,
          y:
            cartPos3D.y +
            cartTangent.y * rp.dl +
            cartBinormal.y * rp.dw +
            cartNormal.y * headH,
          z:
            cartPos3D.z +
            cartTangent.z * rp.dl +
            cartBinormal.z * rp.dw +
            cartNormal.z * headH,
        };
        const rHead2D = project3D(
          riderHeadWorld.x,
          riderHeadWorld.y,
          riderHeadWorld.z,
          cx,
          cy,
          scale,
          yaw,
          pitch
        );

        // Rider head silhouette
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(rHead2D.sx, rHead2D.sy, 3.8, 0, Math.PI * 2);
        ctx.fill();

        // Excited raised arms if safe loop & fast!
        if (!isDetached && s.currentSpeed > 18) {
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(rHead2D.sx - 3, rHead2D.sy + 2);
          ctx.lineTo(rHead2D.sx - 6, rHead2D.sy - 8);
          ctx.moveTo(rHead2D.sx + 3, rHead2D.sy + 2);
          ctx.lineTo(rHead2D.sx + 6, rHead2D.sy - 8);
          ctx.stroke();
        } else if (isDetached) {
          // Flailing arms when falling!
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(rHead2D.sx - 3, rHead2D.sy + 2);
          ctx.lineTo(rHead2D.sx - 8, rHead2D.sy - 2);
          ctx.moveTo(rHead2D.sx + 3, rHead2D.sy + 2);
          ctx.lineTo(rHead2D.sx + 8, rHead2D.sy + 5);
          ctx.stroke();
        }
      });

      // Draw 4 Wheel Assemblies (Clamping around tubular rail)
      const wheelOffsets = [
        { dl: -halfL * 0.7, dw: -halfW * 0.95 },
        { dl: halfL * 0.7, dw: -halfW * 0.95 },
        { dl: -halfL * 0.7, dw: halfW * 0.95 },
        { dl: halfL * 0.7, dw: halfW * 0.95 },
      ];
      wheelOffsets.forEach((wo) => {
        const wWorld = {
          x: cartPos3D.x + cartTangent.x * wo.dl + cartBinormal.x * wo.dw,
          y: cartPos3D.y + cartTangent.y * wo.dl + cartBinormal.y * wo.dw,
          z: cartPos3D.z + cartTangent.z * wo.dl + cartBinormal.z * wo.dw,
        };
        const w2D = project3D(wWorld.x, wWorld.y, wWorld.z, cx, cy, scale, yaw, pitch);
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(w2D.sx, w2D.sy, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // ----------------------------------------------------
      // 7. REAL-TIME DYNAMIC FORCE VECTOR OVERLAYS
      // ----------------------------------------------------
      if (showVectors) {
        const drawArrow2D = (fromX, fromY, toX, toY, color, label, valueText) => {
          const dx = toX - fromX;
          const dy = toY - fromY;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len < 3) return;

          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = 2.4;
          ctx.lineCap = 'round';

          // Arrow shaft
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(toX, toY);
          ctx.stroke();

          // Arrow head
          const angle = Math.atan2(dy, dx);
          const headLen = 8;
          ctx.beginPath();
          ctx.moveTo(toX, toY);
          ctx.lineTo(
            toX - headLen * Math.cos(angle - Math.PI / 6),
            toY - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            toX - headLen * Math.cos(angle + Math.PI / 6),
            toY - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();

          // Text Badge Label
          ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          const badgeWidth = ctx.measureText(label + ' ' + valueText).width + 14;
          const badgeX = toX + 6;
          const badgeY = toY - 12;
          ctx.beginPath();
          ctx.roundRect(badgeX, badgeY, badgeWidth, 20, 3);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = color;
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText(label, badgeX + 4, badgeY + 13);
          ctx.fillStyle = '#f8fafc';
          ctx.font = '8.5px monospace';
          ctx.fillText(valueText, badgeX + ctx.measureText(label).width + 7, badgeY + 13);
        };

        // 1. Weight Vector mg (Red: ALWAYS points straight down towards earth center)
        if (showWeightVector) {
          const W = m * g;
          const weightArrowLenMeters = 0.5 * R;
          const wEnd3D = {
            x: cartPos3D.x,
            y: cartPos3D.y - weightArrowLenMeters,
            z: cartPos3D.z,
          };
          const wEnd2D = project3D(wEnd3D.x, wEnd3D.y, wEnd3D.z, cx, cy, scale, yaw, pitch);
          drawArrow2D(
            cart2D.sx,
            cart2D.sy,
            wEnd2D.sx,
            wEnd2D.sy,
            '#ef4444',
            'mg',
            `${(W / 1000).toFixed(1)} kN`
          );
        }

        // 2. Normal Reaction Track Force N (Cyan: points inward towards track center)
        if (showNormalVector && !isDetached) {
          const N = s.currentNormal;
          if (N > 50) {
            // Arrow length scaled with N
            const maxRefN = m * ((v0 * v0) / R + g);
            const nScale = Math.min(1.2, Math.max(0.2, N / maxRefN));
            const nArrowLen = 0.7 * R * nScale;
            const nEnd3D = {
              x: cartPos3D.x + cartNormal.x * nArrowLen,
              y: cartPos3D.y + cartNormal.y * nArrowLen,
              z: cartPos3D.z + cartNormal.z * nArrowLen,
            };
            const nEnd2D = project3D(nEnd3D.x, nEnd3D.y, nEnd3D.z, cx, cy, scale, yaw, pitch);
            drawArrow2D(
              cart2D.sx,
              cart2D.sy,
              nEnd2D.sx,
              nEnd2D.sy,
              '#06b6d4',
              'N',
              `${(N / 1000).toFixed(1)} kN`
            );
          } else {
            // N is near zero!
            ctx.fillStyle = '#f43f5e';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText('N ≈ 0 (Weightless Apex)', cart2D.sx + 15, cart2D.sy - 22);
          }
        }

        // 3. Tangential Velocity Vector v (Green: tangent to path)
        if (showVelocityVector) {
          const v = s.currentSpeed;
          const vArrowLen = 0.6 * R * Math.min(1.5, v / 30);
          const vEnd3D = {
            x: cartPos3D.x + cartTangent.x * vArrowLen,
            y: cartPos3D.y + cartTangent.y * vArrowLen,
            z: cartPos3D.z + cartTangent.z * vArrowLen,
          };
          const vEnd2D = project3D(vEnd3D.x, vEnd3D.y, vEnd3D.z, cx, cy, scale, yaw, pitch);
          drawArrow2D(
            cart2D.sx,
            cart2D.sy,
            vEnd2D.sx,
            vEnd2D.sy,
            '#10b981',
            'v',
            `${v.toFixed(1)} m/s`
          );
        }

        // 4. Centripetal Force Vector Fc = mv²/r (Yellow: points directly to center)
        if (showCentripetalVector && s.phase === 'loop') {
          const Fc = (m * s.currentSpeed * s.currentSpeed) / R;
          const fcLen = 0.55 * R * Math.min(1.2, s.currentSpeed / 30);
          const fcEnd3D = {
            x: cartPos3D.x + cartNormal.x * fcLen,
            y: cartPos3D.y + cartNormal.y * fcLen,
            z: cartPos3D.z + cartNormal.z * fcLen,
          };
          const fcEnd2D = project3D(fcEnd3D.x, fcEnd3D.y, fcEnd3D.z, cx, cy, scale, yaw, pitch);
          drawArrow2D(
            cart2D.sx,
            cart2D.sy,
            fcEnd2D.sx,
            fcEnd2D.sy,
            '#eab308',
            'Fc',
            `${(Fc / 1000).toFixed(1)} kN`
          );
        }
      }

      // ----------------------------------------------------
      // 8. HIGH-G REDOUT / BLACKOUT VIGNETTE
      // ----------------------------------------------------
      if (s.currentG > 5.5) {
        const blackoutIntensity = Math.min(0.65, (s.currentG - 5.5) * 0.22);
        const vigGrad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.5,
          width * 0.2,
          width * 0.5,
          height * 0.5,
          width * 0.7
        );
        vigGrad.addColorStop(0, 'transparent');
        vigGrad.addColorStop(1, `rgba(220, 38, 38, ${blackoutIntensity})`);
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    isPlaying,
    playSpeed,
    autoLoop,
    cameraView,
    radius,
    releaseSpeed,
    cartMass,
    showVectors,
    showWeightVector,
    showNormalVector,
    showVelocityVector,
    showCentripetalVector,
    showSupportPillars,
    starfield,
    getCameraAngles,
    project3D,
    onTelemetry,
  ]);

  // Handle Preset Selection
  const applyPreset = (preset) => {
    setRadius(preset.r);
    setReleaseSpeed(preset.v0);
    setCartMass(preset.m);
    resetRun();
    if (typeof onTelemetry === 'function') {
      onTelemetry('SIMULATION_PRESET_SELECTED', { preset: preset.id });
    }
  };

  // Set Speed to exact critical threshold
  const setExactThreshold = () => {
    setReleaseSpeed(parseFloat(vCritBottom.toFixed(1)));
    resetRun();
  };

  // Check Challenge Answer
  const handleCheckChallenge = (optIdx) => {
    setUserSelectedOption(optIdx);
    setChallengeAnswerChecked(true);
    const ch = KCSE_CHALLENGES[selectedChallengeIdx];
    const isCorrect = optIdx === ch.correctOptionIndex;
    setChallengeSuccess(isCorrect);

    if (isCorrect && typeof onTelemetry === 'function') {
      onTelemetry('SIMULATION_CHALLENGE_COMPLETED', {
        challengeId: ch.id,
      });
    }
  };

  const nextChallenge = () => {
    setSelectedChallengeIdx((prev) => (prev + 1) % KCSE_CHALLENGES.length);
    setUserSelectedOption(null);
    setChallengeAnswerChecked(false);
    setChallengeSuccess(false);
  };

  // Real-time calculation helpers for HUD
  const liveApexSpeed = Math.sqrt(Math.max(0, releaseSpeed * releaseSpeed - 4 * g * radius));
  const liveMaxBottomG = 1 + (releaseSpeed * releaseSpeed) / (g * radius);
  const liveBottomNormal = cartMass * ((releaseSpeed * releaseSpeed) / radius + g);

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden font-sans">
      {/* ============================================================ */}
      {/* 1. TOP STATUS & NAVIGATION BAR */}
      {/* ============================================================ */}
      <div className="bg-slate-900/95 border-b border-slate-800/80 px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              KCSE Form 4 Physics • Topic 2
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Vertical Circle Dynamics
            </span>

            {/* Dynamic Visual Badges based on Physics */}
            {simulationStatus.color === 'emerald' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {simulationStatus.badge}
              </span>
            )}
            {simulationStatus.color === 'rose' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                <AlertTriangle className="w-3.5 h-3.5" />
                {simulationStatus.badge}
              </span>
            )}
            {simulationStatus.color === 'amber' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <ShieldAlert className="w-3.5 h-3.5" />
                {simulationStatus.badge}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-1.5 flex items-center gap-2">
            Rollercoaster Vertical Circle Loop Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            Explore critical apex speed <code className="text-cyan-300 font-mono">v_crit = √(gr)</code>, normal reaction forces, energy conservation, and extreme G-force limits on an authentic 3D looping coaster.
          </p>
        </div>

        {/* View Switcher & Quick Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700">
            <button
              onClick={() => setCameraView('iso')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                cameraView === 'iso'
                  ? 'bg-cyan-500 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Isometric 3D
            </button>
            <button
              onClick={() => setCameraView('side')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                cameraView === 'side'
                  ? 'bg-cyan-500 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side Cutaway
            </button>
            <button
              onClick={() => setCameraView('front')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                cameraView === 'front'
                  ? 'bg-cyan-500 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Front Angle
            </button>
          </div>

          <button
            onClick={resetRun}
            title="Reset Cart Position"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN 3D SIMULATION CANVAS STAGE */}
      {/* ============================================================ */}
      <div className="relative w-full h-[420px] sm:h-[500px] md:h-[540px] bg-slate-950 overflow-hidden select-none">
        <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

        {/* Real-time Dynamic Cockpit G-Meter Dial Overlay */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 shadow-xl flex items-center gap-4">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Circular Gauge Arc */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#1e293b"
                strokeWidth="7"
                strokeDasharray="188"
                strokeDashoffset="37"
              />
              {/* Safe Zone (0G to 3.5G) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="7"
                strokeDasharray="188"
                strokeDashoffset="120"
                strokeOpacity="0.4"
              />
              {/* Caution Zone (3.5G to 5.5G) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#f59e0b"
                strokeWidth="7"
                strokeDasharray="188"
                strokeDashoffset="90"
                strokeOpacity="0.5"
              />
              {/* Danger Zone (> 5.5G) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="7"
                strokeDasharray="188"
                strokeDashoffset="60"
                strokeOpacity="0.6"
              />
            </svg>

            {/* Needle Gauge Display */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-75 ease-out"
              style={{
                transform: `rotate(${Math.min(140, Math.max(-140, (simStateRef.current.currentG - 3) * 35))}deg)`,
              }}
            >
              <div className="w-1.5 h-10 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)] -translate-y-3" />
            </div>

            <div className="absolute w-3 h-3 bg-slate-200 rounded-full border border-slate-800" />
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              G-Force Meter
            </div>
            <div className="text-2xl font-black font-mono tracking-tight text-white flex items-baseline gap-1">
              {simStateRef.current.currentG.toFixed(2)}
              <span className="text-xs text-slate-400 font-sans font-medium">G</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              Peak: <span className="text-amber-400 font-bold">{simStateRef.current.peakG.toFixed(1)}G</span> | Min:{' '}
              <span className="text-cyan-400 font-bold">{simStateRef.current.minG.toFixed(1)}G</span>
            </div>
            <div className="text-[10px] font-bold">
              {simStateRef.current.currentG < 0.2 ? (
                <span className="text-cyan-400">AIRTIME FLOAT</span>
              ) : simStateRef.current.currentG > 5.5 ? (
                <span className="text-rose-400">BLACKOUT DANGER</span>
              ) : simStateRef.current.currentG > 3.5 ? (
                <span className="text-amber-400">HEAVY STRAIN</span>
              ) : (
                <span className="text-emerald-400">OPTIMAL RANGE</span>
              )}
            </div>
          </div>
        </div>

        {/* Vector Toggle Floating Quick Bar */}
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700/80 shadow-xl flex items-center gap-3 text-xs">
          <span className="font-semibold text-slate-300 hidden sm:inline flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Vectors:
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer text-rose-400">
            <input
              type="checkbox"
              checked={showWeightVector}
              onChange={(e) => setShowWeightVector(e.target.checked)}
              className="accent-rose-500 rounded-sm"
            />
            <span className="text-[11px] font-mono font-bold">mg</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-cyan-400">
            <input
              type="checkbox"
              checked={showNormalVector}
              onChange={(e) => setShowNormalVector(e.target.checked)}
              className="accent-cyan-500 rounded-sm"
            />
            <span className="text-[11px] font-mono font-bold">N</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-emerald-400">
            <input
              type="checkbox"
              checked={showVelocityVector}
              onChange={(e) => setShowVelocityVector(e.target.checked)}
              className="accent-emerald-500 rounded-sm"
            />
            <span className="text-[11px] font-mono font-bold">v</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
            <input
              type="checkbox"
              checked={showCentripetalVector}
              onChange={(e) => setShowCentripetalVector(e.target.checked)}
              className="accent-amber-500 rounded-sm"
            />
            <span className="text-[11px] font-mono font-bold">Fc</span>
          </label>
        </div>

        {/* Real-time Telemetry Overlay Badge on Bottom Left */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-xl hidden sm:flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Speed v</span>
            <span className="text-emerald-400 font-bold text-sm">
              {simStateRef.current.currentSpeed.toFixed(1)} m/s
            </span>
          </div>
          <div className="w-px h-7 bg-slate-800" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Normal Force N</span>
            <span className="text-cyan-400 font-bold text-sm">
              {(simStateRef.current.currentNormal / 1000).toFixed(1)} kN
            </span>
          </div>
          <div className="w-px h-7 bg-slate-800" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Loop Height h</span>
            <span className="text-amber-400 font-bold text-sm">
              {(
                radius * (1 - Math.cos(simStateRef.current.loopAngle || 0))
              ).toFixed(1)}{' '}
              m
            </span>
          </div>
        </div>

        {/* Playback Controls Float Bar */}
        <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700/80 shadow-xl flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-md"
            title={isPlaying ? 'Pause Animation' : 'Play Animation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={resetRun}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            title="Rewind / Re-launch"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed selector */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs">
            {[0.25, 0.5, 1.0, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaySpeed(spd)}
                className={`px-2 py-0.5 rounded-lg font-mono text-[11px] transition-colors ${
                  playSpeed === spd
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd === 0.25 ? '¼x' : spd === 0.5 ? '½x' : `${spd}x`}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer ml-1 text-slate-300 text-xs select-none">
            <input
              type="checkbox"
              checked={autoLoop}
              onChange={(e) => setAutoLoop(e.target.checked)}
              className="accent-cyan-500 rounded-sm"
            />
            <span className="hidden md:inline text-[11px]">Auto-Loop</span>
          </label>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. INTERACTIVE SLIDERS & EXPERIMENT CONTROL DECK */}
      {/* ============================================================ */}
      <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 space-y-6">
        {/* Presets Row */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              KCSE Coaster Presets & Test Scenarios
            </span>
            <button
              onClick={setExactThreshold}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1"
            >
              Set Exact Critical Boundary v₀ = √(5gr) ({vCritBottom.toFixed(1)} m/s)
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`text-left p-2.5 sm:p-3 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                  radius === p.r && Math.abs(releaseSpeed - p.v0) < 0.2
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-md ring-1 ring-cyan-500/30'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-100">{p.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.subtitle}</div>
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                  {p.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Parameter Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Slider 1: Release Speed v0 */}
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                Launch Speed (v₀ at lowest point)
              </label>
              <span className="font-mono text-sm font-extrabold text-emerald-400">
                {releaseSpeed.toFixed(1)} m/s
              </span>
            </div>

            <input
              type="range"
              min="10.0"
              max="42.0"
              step="0.5"
              value={releaseSpeed}
              onChange={(e) => setReleaseSpeed(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>10.0 m/s</span>
              <span className="text-cyan-300">
                v₀,crit = {vCritBottom.toFixed(1)} m/s
              </span>
              <span>42.0 m/s</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setReleaseSpeed((prev) => Math.max(10, prev - 1))}
                className="flex-1 py-1 text-[11px] font-mono bg-slate-700/80 hover:bg-slate-600 rounded-lg text-slate-300"
              >
                -1 m/s
              </button>
              <button
                onClick={() => setReleaseSpeed((prev) => Math.min(42, prev + 1))}
                className="flex-1 py-1 text-[11px] font-mono bg-slate-700/80 hover:bg-slate-600 rounded-lg text-slate-300"
              >
                +1 m/s
              </button>
              <button
                onClick={() => setReleaseSpeed(parseFloat(vCritBottom.toFixed(1)))}
                className="px-2 py-1 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg hover:bg-emerald-500/30"
              >
                Snap v_crit
              </button>
            </div>
          </div>

          {/* Slider 2: Loop Radius r */}
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
                Loop Radius (r)
              </label>
              <span className="font-mono text-sm font-extrabold text-cyan-400">
                {radius.toFixed(1)} m
              </span>
            </div>

            <input
              type="range"
              min="6.0"
              max="24.0"
              step="0.5"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>6.0 m</span>
              <span>Apex Height 2r = {(2 * radius).toFixed(1)} m</span>
              <span>24.0 m</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {[8.0, 12.0, 16.0, 20.0].map((rVal) => (
                <button
                  key={rVal}
                  onClick={() => setRadius(rVal)}
                  className={`flex-1 py-1 text-[11px] font-mono rounded-lg transition-colors ${
                    radius === rVal
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-700/80 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  {rVal}m
                </button>
              ))}
            </div>
          </div>

          {/* Slider 3: Cart Mass m */}
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                Cart & Rider Mass (m)
              </label>
              <span className="font-mono text-sm font-extrabold text-amber-400">
                {cartMass} kg
              </span>
            </div>

            <input
              type="range"
              min="300"
              max="2000"
              step="50"
              value={cartMass}
              onChange={(e) => setCartMass(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>300 kg</span>
              <span>Weight mg = {((cartMass * g) / 1000).toFixed(1)} kN</span>
              <span>2000 kg</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {[500, 800, 1200, 1600].map((mVal) => (
                <button
                  key={mVal}
                  onClick={() => setCartMass(mVal)}
                  className={`flex-1 py-1 text-[11px] font-mono rounded-lg transition-colors ${
                    cartMass === mVal
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-700/80 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  {mVal}kg
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. TABBED LOWER SECTION: TELEMETRY, KCSE THEORY & EXAM CHALLENGES */}
      {/* ============================================================ */}
      <div className="bg-slate-950 border-t border-slate-800">
        {/* Tab Headers */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-4 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'telemetry'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Live Physical Telemetry & Equations
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'theory'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4" />
            KCSE Formula Derivations & Points A, B, C
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'challenges'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            KCSE Exam Challenges
          </button>
        </div>

        {/* Tab Content 1: Live Telemetry */}
        {activeTab === 'telemetry' && (
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Box 1: Point A (Bottom) */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold text-emerald-400 text-sm">
                <span>Point A (Bottom / Release)</span>
                <span className="font-mono">{liveMaxBottomG.toFixed(1)} G</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Centripetal force and gravity act along the same radial line. Track must support cart weight PLUS centripetal acceleration!
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 space-y-1">
                <div>N_bottom = m·v₀²/r + mg</div>
                <div className="text-cyan-400">
                  N_bottom = {cartMass}·({releaseSpeed.toFixed(1)}²)/{radius} + {cartMass}·9.8
                </div>
                <div className="text-emerald-400 font-bold">
                  = {(liveBottomNormal / 1000).toFixed(1)} kN ({liveMaxBottomG.toFixed(2)} mg)
                </div>
              </div>
            </div>

            {/* Box 2: Point B (Midway Horizontal) */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold text-cyan-400 text-sm">
                <span>Point B (Midway Horizontal)</span>
                <span className="font-mono">
                  {Math.sqrt(Math.max(0, releaseSpeed * releaseSpeed - 2 * g * radius)).toFixed(1)} m/s
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Gravity mg acts vertically downwards, causing purely tangential deceleration. Normal reaction N supplies 100% of centripetal force!
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 space-y-1">
                <div>N_mid = m·v_mid²/r</div>
                <div className="text-cyan-400">
                  v_mid² = v₀² - 2gr = {(releaseSpeed * releaseSpeed - 2 * g * radius).toFixed(1)}
                </div>
                <div className="text-emerald-400 font-bold">
                  N_mid = {(Math.max(0, (cartMass * (releaseSpeed * releaseSpeed - 2 * g * radius)) / radius) / 1000).toFixed(1)} kN
                </div>
              </div>
            </div>

            {/* Box 3: Point C (Top / Apex) */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold text-rose-400 text-sm">
                <span>Point C (Apex / Inversion)</span>
                <span className="font-mono">
                  {liveApexSpeed > 0 ? `${liveApexSpeed.toFixed(1)} m/s` : 'STALLED'}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Both track normal reaction N and gravity mg act downwards towards center. For continuous contact, N ≥ 0 ⇒ v ≥ √(gr).
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 space-y-1">
                <div>N_top = m·v_top²/r - mg</div>
                <div className="text-cyan-400">
                  v_crit = √(gr) = √({g} × {radius}) = {vCritTop.toFixed(2)} m/s
                </div>
                <div className={liveApexSpeed >= vCritTop ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {liveApexSpeed >= vCritTop
                    ? `Safe! v_top (${liveApexSpeed.toFixed(1)}) ≥ v_crit (${vCritTop.toFixed(1)})`
                    : `STALL! v_top (${liveApexSpeed.toFixed(1)}) < v_crit (${vCritTop.toFixed(1)})`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: KCSE Theory */}
        {activeTab === 'theory' && (
          <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                KCSE Physics Syllabus Notes: Motion in a Vertical Circle
              </h3>
              <p>
                Unlike uniform circular motion in a horizontal plane where speed is constant, a body moving in a
                <strong> vertical circle</strong> experiences gravitational acceleration along its path. Kinetic energy transforms
                into potential energy as it ascends, causing the speed to decrease, and vice versa.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2 px-3">Position</th>
                      <th className="py-2 px-3">Height h</th>
                      <th className="py-2 px-3">Speed Formula</th>
                      <th className="py-2 px-3">Radial Force Equation</th>
                      <th className="py-2 px-3">Track Reaction N</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-emerald-400 font-sans">Point A (Bottom)</td>
                      <td className="py-2.5 px-3">0</td>
                      <td className="py-2.5 px-3">v₀ (Max)</td>
                      <td className="py-2.5 px-3">N - mg = m·v₀²/r</td>
                      <td className="py-2.5 px-3 text-cyan-300">N = m·v₀²/r + mg (Max Strain)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-cyan-400 font-sans">Point B (Midway)</td>
                      <td className="py-2.5 px-3">r</td>
                      <td className="py-2.5 px-3">√(v₀² - 2gr)</td>
                      <td className="py-2.5 px-3">N = m·v²/r</td>
                      <td className="py-2.5 px-3 text-cyan-300">N = m·(v₀² - 2gr)/r</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-rose-400 font-sans">Point C (Apex/Top)</td>
                      <td className="py-2.5 px-3">2r</td>
                      <td className="py-2.5 px-3">√(v₀² - 4gr)</td>
                      <td className="py-2.5 px-3">N + mg = m·v²/r</td>
                      <td className="py-2.5 px-3 text-cyan-300">N = m·v²/r - mg (Min Strain)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400">Critical Apex Condition (v_crit):</div>
                  <p className="text-slate-400">
                    For the cart not to lose contact with the rails (or a string not to go slack), normal force N ≥ 0.
                    At the boundary N = 0:
                  </p>
                  <div className="font-mono font-bold text-white bg-slate-900 p-2 rounded-lg">
                    mg = m·v_crit²/r ⇒ v_crit = √(g·r)
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400">Conservation of Energy for Safe Loop:</div>
                  <p className="text-slate-400">
                    Equating total energy at Point A (h = 0) and Point C (h = 2r):
                  </p>
                  <div className="font-mono font-bold text-white bg-slate-900 p-2 rounded-lg">
                    ½m·v₀² = ½m·(gr) + mg(2r) ⇒ v₀,crit = √(5g·r)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: Interactive KCSE Exam Challenges */}
        {activeTab === 'challenges' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                    {KCSE_CHALLENGES[selectedChallengeIdx].difficulty}
                  </span>
                  <h3 className="text-base font-extrabold text-white">
                    {KCSE_CHALLENGES[selectedChallengeIdx].title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    Question {selectedChallengeIdx + 1} of {KCSE_CHALLENGES.length}
                  </span>
                  <button
                    onClick={nextChallenge}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 border border-slate-700 transition-colors"
                  >
                    Next Question →
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                {KCSE_CHALLENGES[selectedChallengeIdx].question}
              </p>

              {/* Formula Hint Box */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300">KCSE Exam Tip: </strong>
                  {KCSE_CHALLENGES[selectedChallengeIdx].formulaHint}
                </div>
              </div>

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {KCSE_CHALLENGES[selectedChallengeIdx].options.map((opt, idx) => {
                  let btnStyle = 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200';
                  if (challengeAnswerChecked) {
                    if (idx === KCSE_CHALLENGES[selectedChallengeIdx].correctOptionIndex) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold ring-1 ring-emerald-500/40';
                    } else if (userSelectedOption === idx) {
                      btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleCheckChallenge(idx)}
                      disabled={challengeAnswerChecked}
                      className={`p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>
                        <strong className="text-slate-400 font-sans mr-2">
                          {String.fromCharCode(65 + idx)}.
                        </strong>
                        {opt}
                      </span>
                      {challengeAnswerChecked && idx === KCSE_CHALLENGES[selectedChallengeIdx].correctOptionIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {challengeAnswerChecked && (
                <div
                  className={`p-4 rounded-xl text-xs space-y-2 transition-all ${
                    challengeSuccess
                      ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-200'
                      : 'bg-rose-950/40 border border-rose-800/60 text-rose-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 text-sm">
                    {challengeSuccess ? (
                      <>
                        <Trophy className="w-4 h-4 text-emerald-400" /> Correct! Outstanding Physics Reasoning!
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-400" /> Review the KCSE Marking Scheme:
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    {KCSE_CHALLENGES[selectedChallengeIdx].explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
