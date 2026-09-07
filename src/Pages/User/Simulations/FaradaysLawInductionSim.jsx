import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  Activity,
  Sliders,
  ChevronRight,
  BookOpen,
  Info,
  Layers,
  ArrowRight,
  ArrowLeft,
  ArrowLeftRight,
  RefreshCw,
  Gauge,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  MoveHorizontal,
} from 'lucide-react';

// KCSE Exam Standard Problems
const KCSE_PROBLEMS = [
  {
    id: 'kcse_em_1',
    title: 'KCSE Physics Paper 2: Solenoid Flux Linkage & Induced E.M.F.',
    question:
      'A solenoid having 500 turns and a cross-sectional area of 4.0 × 10⁻³ m² is situated perpendicular to a uniform magnetic field. If the magnetic flux density B drops uniformly from 0.40 T to 0.10 T in a time interval of 0.05 s, calculate the magnitude of the electromotive force (e.m.f.) induced in the solenoid in Volts.',
    unit: 'V',
    target: 12.0,
    tolerance: 0.3,
    hint: 'Use Faraday\'s Law: ε = -N · (ΔΦ / Δt) = -N · A · (ΔB / Δt). Calculate ΔB = 0.40 - 0.10 = 0.30 T, then multiply by N and A, and divide by Δt = 0.05 s.',
    solutionSteps: [
      'Identify given values: N = 500 turns, A = 4.0 × 10⁻³ m², B₁ = 0.40 T, B₂ = 0.10 T, Δt = 0.05 s',
      'Calculate change in magnetic flux density: ΔB = 0.40 T - 0.10 T = 0.30 T',
      'Calculate change in magnetic flux: ΔΦ = A × ΔB = (4.0 × 10⁻³ m²) × (0.30 T) = 1.20 × 10⁻³ Wb',
      'Apply Faraday\'s Law: |ε| = N × (ΔΦ / Δt)',
      'Substitute values: |ε| = 500 × (1.20 × 10⁻³ Wb) / (0.05 s) = 12.0 V',
      'Conclusion: The magnitude of the induced e.m.f. is 12.0 V.',
    ],
  },
  {
    id: 'kcse_em_2',
    title: 'KCSE Physics Paper 2: Rate of Magnetic Flux Cutting',
    question:
      'A bar magnet is plunged into a 200-turn coil, causing the magnetic flux linking each turn of the coil to increase uniformly from 0.02 mWb to 0.14 mWb in 0.08 seconds. Determine the induced electromotive force in Volts (magnitude).',
    unit: 'V',
    target: 0.30,
    tolerance: 0.015,
    hint: 'Convert milliwebers to webers: 1 mWb = 10⁻³ Wb. ΔΦ = (0.14 - 0.02) × 10⁻³ Wb = 0.12 × 10⁻³ Wb. Then |ε| = N · (ΔΦ / Δt).',
    solutionSteps: [
      'Convert units to SI: Φ₁ = 0.02 × 10⁻³ Wb, Φ₂ = 0.14 × 10⁻³ Wb',
      'Calculate flux change: ΔΦ = (0.14 - 0.02) × 10⁻³ Wb = 0.12 × 10⁻³ Wb (or 1.2 × 10⁻⁴ Wb)',
      'Time taken: Δt = 0.08 s',
      'Apply Faraday\'s Law: |ε| = N × (ΔΦ / Δt)',
      'Calculate: |ε| = 200 × (1.2 × 10⁻⁴ Wb) / 0.08 s = 0.024 / 0.08 = 0.30 V',
    ],
  },
  {
    id: 'kcse_em_3',
    title: 'KCSE Physics Paper 2: Conductor Cutting Flux in Field',
    question:
      'A straight copper conductor of active length 0.25 m is pushed horizontally at a steady speed of 4.0 m/s perpendicular to a uniform magnetic field of flux density B = 0.80 T. Calculate the e.m.f. generated across the ends of the conductor in Volts.',
    unit: 'V',
    target: 0.80,
    tolerance: 0.02,
    hint: 'Use the cutting conductor formula: ε = B · L · v · sin(θ). For motion perpendicular to the field, sin(90°) = 1.',
    solutionSteps: [
      'Identify given values: B = 0.80 T, L = 0.25 m, v = 4.0 m/s, θ = 90°',
      'State formula: ε = B · L · v · sin(90°) = B · L · v',
      'Substitute values: ε = 0.80 T × 0.25 m × 4.0 m/s',
      'Compute result: ε = 0.80 V',
    ],
  },
];

// Interactive Predictor Cases for Lenz's Law
const PREDICTOR_CASES = [
  {
    id: 'case_1',
    scenario: 'Plunging North Pole into the Left Face of Coil',
    magnetAction: 'Moving Right into coil with North Pole leading',
    expectedDeflection: 'left', // Negative / Left deflection
    inducedFacePole: 'North',
    oppositionType: 'Repulsion (Opposes approaching North pole)',
    reasoning:
      'As the North pole enters, magnetic flux pointing into the coil increases. According to Lenz\'s Law, the coil induces an opposing North pole at its left face to repel the incoming magnet. By the right-hand grip rule, this induces a counter-clockwise current that deflects the galvanometer needle to the LEFT.',
  },
  {
    id: 'case_2',
    scenario: 'Withdrawing North Pole from the Coil',
    magnetAction: 'Moving Left out of coil with North Pole trailing',
    expectedDeflection: 'right', // Positive / Right deflection
    inducedFacePole: 'South',
    oppositionType: 'Attraction (Opposes receding North pole)',
    reasoning:
      'When the North pole is pulled away, magnetic flux decreases. By Lenz\'s Law, the coil tries to maintain the flux by inducing a South pole at its left face to attract the departing magnet. Current flows clockwise, deflecting the galvanometer needle to the RIGHT.',
  },
  {
    id: 'case_3',
    scenario: 'Plunging South Pole into the Left Face of Coil',
    magnetAction: 'Moving Right into coil with South Pole leading',
    expectedDeflection: 'right', // Positive / Right deflection
    inducedFacePole: 'South',
    oppositionType: 'Repulsion (Opposes approaching South pole)',
    reasoning:
      'As the South pole enters, incoming South flux increases. The coil induces a South pole on its left face to repel the approaching South pole. Current direction is opposite to that of the entering North pole, deflecting the galvanometer to the RIGHT.',
  },
  {
    id: 'case_4',
    scenario: 'Holding Magnet Completely Stationary Inside Coil',
    magnetAction: 'Magnet is at rest (v = 0 m/s)',
    expectedDeflection: 'zero', // Zero deflection
    inducedFacePole: 'None',
    oppositionType: 'No Opposition (No flux change)',
    reasoning:
      'Even though magnetic flux is at its maximum while inside the coil, the rate of change of flux is strictly zero (ΔΦ/Δt = 0). Faraday\'s Law states e.m.f. is proportional to the RATE of change of flux, NOT the magnitude of flux itself. The needle remains precisely at ZERO.',
  },
];

export default function FaradaysLawInductionSim({ config = {}, onTelemetry }) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('lab'); // 'lab' | 'lenz' | 'practice'

  // Primary Physics Variables
  const [coilTurns, setCoilTurns] = useState(200); // 100 | 200 | 500 turns
  const [magneticFieldB, setMagneticFieldB] = useState(0.20); // 0.05 to 0.50 T
  const [polarity, setPolarity] = useState('N_RIGHT'); // 'N_RIGHT' (N pole enters first) | 'S_RIGHT' (S pole enters first)
  const [targetSpeed, setTargetSpeed] = useState(0.8); // 0.1 to 2.0 m/s
  const [autoMotionMode, setAutoMotionMode] = useState('idle'); // 'idle' | 'plunge' | 'withdraw' | 'oscillate'

  // Visual toggles
  const [showFluxLines, setShowFluxLines] = useState(true);
  const [showCurrentFlow, setShowCurrentFlow] = useState(true);
  const [showLenzLabels, setShowLenzLabels] = useState(true);
  const [showOscilloscope, setShowOscilloscope] = useState(true);

  // Predictor Interactive State
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [predictedDeflection, setPredictedDeflection] = useState(null); // 'left' | 'zero' | 'right'
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);

  // KCSE Practice Quiz State
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [practiceStatus, setPracticeStatus] = useState(null); // null | 'correct' | 'incorrect'
  const [showSolution, setShowSolution] = useState(false);

  // Simulation Canvas & Dynamic Animation State Refs
  const canvasRef = useRef(null);
  const oscCanvasRef = useRef(null);

  // Physical coordinates
  // Solenoid is centered horizontally at x = 0 (in physical space, scaled to canvas)
  // Magnet position x_m: in meters from coil center (-0.25 m to +0.25 m)
  const magnetPosRef = useRef(-0.16); // starts at -16 cm (to the left of coil)
  const magnetVelRef = useRef(0.0); // m/s
  const isDraggingRef = useRef(false);
  const dragStartClientXRef = useRef(0);
  const dragStartPosRef = useRef(-0.16);

  // Galvanometer needle physics (spring-damper model for realistic inertia)
  const needleAngleRef = useRef(0); // in radians
  const needleAngleVelRef = useRef(0);

  // Real-time signals for display
  const [liveTelemetry, setLiveTelemetry] = useState({
    fluxMilliWb: 0,
    dFluxDtMilliWb: 0,
    inducedEmfMilliV: 0,
    inducedCurrentMicroA: 0,
    velocity: 0,
    needleDeflectionDegrees: 0,
    opposingPole: 'None',
  });

  // Rolling Oscilloscope Data Buffer
  const oscBufferRef = useRef({
    history: [], // { time, flux, emf }
    maxPoints: 300,
    lastSampleTime: 0,
  });

  const animFrameIdRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  // Dimensions & Constants
  const COIL_RADIUS = 0.035; // 3.5 cm = 0.035 m
  const COIL_AREA = Math.PI * COIL_RADIUS * COIL_RADIUS; // ~3.85e-3 m²
  const MAGNET_HALF_LENGTH = 0.045; // 4.5 cm
  const GALVO_RESISTANCE = 50.0; // Ohms (internal galvanometer resistance)
  const MAX_EMF_SCALE = 200.0; // mV for ±50° needle deflection

  // Send telemetry
  const logTelemetry = useCallback(
    (action, payload = {}) => {
      if (typeof onTelemetry === 'function') {
        onTelemetry(action, {
          timestamp: Date.now(),
          simKey: 'faradays_law_magnetic_flux',
          ...payload,
        });
      }
    },
    [onTelemetry]
  );

  // Physical calculation of Magnetic Flux Linking Coil
  // Uses two-pole dipole model subtending solid angle through circular loop
  const computePhysics = useCallback(
    (xMagnet, vMagnet, turns, B0, pol) => {
      const poleN_x = pol === 'N_RIGHT' ? xMagnet + MAGNET_HALF_LENGTH : xMagnet - MAGNET_HALF_LENGTH;
      const poleS_x = pol === 'N_RIGHT' ? xMagnet - MAGNET_HALF_LENGTH : xMagnet + MAGNET_HALF_LENGTH;

      // Axial field flux component through loop at x = 0:
      // Solid angle factor: (0 - x_pole) / sqrt((0 - x_pole)^2 + R^2)
      const termN = -poleN_x / Math.sqrt(poleN_x * poleN_x + COIL_RADIUS * COIL_RADIUS);
      const termS = -poleS_x / Math.sqrt(poleS_x * poleS_x + COIL_RADIUS * COIL_RADIUS);

      // Single-turn flux:
      // North pole emits positive outward flux; South pole receives inward flux
      const phiSingleTurn = 0.5 * B0 * COIL_AREA * (termN - termS); // Webers

      // Analytical spatial gradient dPhi/dx:
      // d/dx [-x / sqrt(x^2 + R^2)] = -R^2 / (x^2 + R^2)^(3/2)
      const dTermN_dx = -(COIL_RADIUS * COIL_RADIUS) / Math.pow(poleN_x * poleN_x + COIL_RADIUS * COIL_RADIUS, 1.5);
      const dTermS_dx = -(COIL_RADIUS * COIL_RADIUS) / Math.pow(poleS_x * poleS_x + COIL_RADIUS * COIL_RADIUS, 1.5);

      const dPhiSingle_dx = 0.5 * B0 * COIL_AREA * (dTermN_dx - dTermS_dx);

      // Total rate of change of flux: dPhi/dt = (dPhi/dx) * v
      const dPhiDt = dPhiSingle_dx * vMagnet; // Wb/s

      // Faraday's Law: ε = -N * (dPhi/dt)
      const emfVolts = -turns * dPhiDt; // Volts
      const emfMilliVolts = emfVolts * 1000.0; // mV
      const currentMicroAmperes = (emfVolts / GALVO_RESISTANCE) * 1e6; // μA

      // Lenz's Law Opposition status:
      let opposingPole = 'None';
      if (Math.abs(vMagnet) > 0.02) {
        if (pol === 'N_RIGHT') {
          if (vMagnet > 0) {
            // Approaching coil from left
            opposingPole = xMagnet < 0 ? 'N (Repulsion)' : 'S (Attraction)';
          } else {
            // Withdrawing leftwards
            opposingPole = xMagnet < 0 ? 'S (Attraction)' : 'N (Repulsion)';
          }
        } else {
          // South leading
          if (vMagnet > 0) {
            opposingPole = xMagnet < 0 ? 'S (Repulsion)' : 'N (Attraction)';
          } else {
            opposingPole = xMagnet < 0 ? 'N (Attraction)' : 'S (Repulsion)';
          }
        }
      }

      return {
        fluxWb: phiSingleTurn,
        fluxMilliWb: phiSingleTurn * 1000.0,
        dPhiDtWbPerSec: dPhiDt,
        dFluxDtMilliWb: dPhiDt * 1000.0,
        emfVolts,
        emfMilliVolts,
        currentMicroAmperes,
        opposingPole,
      };
    },
    [COIL_AREA, COIL_RADIUS, MAGNET_HALF_LENGTH, GALVO_RESISTANCE]
  );

  // Full Reset to default lab state
  const handleReset = () => {
    magnetPosRef.current = -0.16;
    magnetVelRef.current = 0.0;
    needleAngleRef.current = 0.0;
    needleAngleVelRef.current = 0.0;
    setAutoMotionMode('idle');
    setCoilTurns(200);
    setMagneticFieldB(0.20);
    setPolarity('N_RIGHT');
    setTargetSpeed(0.8);
    setShowFluxLines(true);
    setShowCurrentFlow(true);
    setShowLenzLabels(true);
    setShowOscilloscope(true);
    setPredictionSubmitted(false);
    setPredictedDeflection(null);
    setPracticeStatus(null);
    setUserAnswer('');
    setShowSolution(false);
    oscBufferRef.current.history = [];
    logTelemetry('reset_simulation');
  };

  // Switch motion mode
  const handleTriggerMotion = (mode) => {
    setAutoMotionMode((prev) => (prev === mode ? 'idle' : mode));
    logTelemetry('change_motion_mode', { mode });
  };

  // Polarity toggle
  const handleTogglePolarity = () => {
    const nextPol = polarity === 'N_RIGHT' ? 'S_RIGHT' : 'N_RIGHT';
    setPolarity(nextPol);
    logTelemetry('toggle_polarity', { polarity: nextPol });
  };

  // Main Animation & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = (time) => {
      if (!isRunning) return;

      const dt = Math.min((time - lastTimeRef.current) / 1000.0, 0.05);
      lastTimeRef.current = time;

      // 1. Update Magnet Position if in Auto Motion Mode
      if (!isDraggingRef.current) {
        if (autoMotionMode === 'plunge') {
          // Move from current position to right (into/through coil)
          if (magnetPosRef.current < 0.16) {
            magnetVelRef.current = targetSpeed;
            magnetPosRef.current += targetSpeed * dt;
          } else {
            magnetPosRef.current = 0.16;
            magnetVelRef.current = 0.0;
            setAutoMotionMode('idle');
          }
        } else if (autoMotionMode === 'withdraw') {
          // Pull magnet back to left
          if (magnetPosRef.current > -0.16) {
            magnetVelRef.current = -targetSpeed;
            magnetPosRef.current -= targetSpeed * dt;
          } else {
            magnetPosRef.current = -0.16;
            magnetVelRef.current = 0.0;
            setAutoMotionMode('idle');
          }
        } else if (autoMotionMode === 'oscillate') {
          // Sinusoidal reciprocating oscillation
          const omega = (targetSpeed / 0.14) * 1.5; // rad/s
          const oscAmplitude = 0.15; // m
          const currentT = time / 1000.0;
          const targetX = oscAmplitude * Math.sin(omega * currentT);
          const computedV = oscAmplitude * omega * Math.cos(omega * currentT);
          magnetPosRef.current = targetX;
          magnetVelRef.current = computedV;
        } else {
          // Idle / stopped
          magnetVelRef.current = 0.0;
        }
      }

      // Constrain position to physical track bounds (-0.22m to +0.22m)
      magnetPosRef.current = Math.max(-0.22, Math.min(0.22, magnetPosRef.current));

      // 2. Compute Instantaneous Physics
      const physics = computePhysics(
        magnetPosRef.current,
        magnetVelRef.current,
        coilTurns,
        magneticFieldB,
        polarity
      );

      // 3. Update Galvanometer Needle Spring-Damper Physics
      // Target angle: full scale 50 degrees = ~0.872 rad for MAX_EMF_SCALE mV
      const maxAngleRad = (50.0 * Math.PI) / 180.0;
      const targetAngle = Math.max(
        -maxAngleRad * 1.15,
        Math.min(maxAngleRad * 1.15, (physics.emfMilliVolts / MAX_EMF_SCALE) * maxAngleRad)
      );

      // Critically damped torsional spring: omega_n = 28 rad/s, zeta = 0.95
      const omegaN = 28.0;
      const zeta = 0.95;
      const springAcc = -omegaN * omegaN * (needleAngleRef.current - targetAngle);
      const dampingAcc = -2.0 * zeta * omegaN * needleAngleVelRef.current;
      needleAngleVelRef.current += (springAcc + dampingAcc) * dt;
      needleAngleRef.current += needleAngleVelRef.current * dt;

      // Clamp needle mechanical stops
      const mechanicalStop = (58.0 * Math.PI) / 180.0;
      if (Math.abs(needleAngleRef.current) > mechanicalStop) {
        needleAngleRef.current = Math.sign(needleAngleRef.current) * mechanicalStop;
        needleAngleVelRef.current = 0;
      }

      // 4. Record to Oscilloscope Buffer
      if (time - oscBufferRef.current.lastSampleTime > 30) {
        oscBufferRef.current.lastSampleTime = time;
        oscBufferRef.current.history.push({
          flux: physics.fluxMilliWb,
          emf: physics.emfMilliVolts,
          time,
        });
        if (oscBufferRef.current.history.length > oscBufferRef.current.maxPoints) {
          oscBufferRef.current.history.shift();
        }
      }

      // 5. Update Telemetry State
      setLiveTelemetry({
        fluxMilliWb: physics.fluxMilliWb,
        dFluxDtMilliWb: physics.dFluxDtMilliWb,
        inducedEmfMilliV: physics.emfMilliVolts,
        inducedCurrentMicroA: physics.currentMicroAmperes,
        velocity: magnetVelRef.current,
        needleDeflectionDegrees: (needleAngleRef.current * 180.0) / Math.PI,
        opposingPole: physics.opposingPole,
      });

      // 6. Draw Visual Simulation Scene
      drawScene(
        ctx,
        canvas.width,
        canvas.height,
        magnetPosRef.current,
        magnetVelRef.current,
        polarity,
        coilTurns,
        magneticFieldB,
        physics,
        needleAngleRef.current,
        time / 1000.0
      );

      // 7. Draw Oscilloscope if enabled
      if (showOscilloscope && oscCanvasRef.current) {
        drawOscilloscope(oscCanvasRef.current, oscBufferRef.current.history);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [
    autoMotionMode,
    targetSpeed,
    coilTurns,
    magneticFieldB,
    polarity,
    computePhysics,
    showFluxLines,
    showCurrentFlow,
    showLenzLabels,
    showOscilloscope,
  ]);

  // Handle Resize of High-DPI Canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = rect.width * dpr;
        canvasRef.current.height = rect.height * dpr;
      }
      if (oscCanvasRef.current) {
        const rect = oscCanvasRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        oscCanvasRef.current.width = rect.width * dpr;
        oscCanvasRef.current.height = rect.height * dpr;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse & Touch Drag Handlers for Bar Magnet
  const getCanvasCoords = (clientX, clientY) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  const handlePointerDown = (clientX, clientY) => {
    const { x, y, width, height } = getCanvasCoords(clientX, clientY);
    // Magnet is drawn centered at (canvasCenter.x + magnetPos * scale, canvasCenter.y)
    // Solenoid is at centerX = width * 0.40, centerY = height * 0.45
    const centerX = width * 0.40;
    const centerY = height * 0.45;
    const pxPerMeter = width * 1.5;
    const magnetScreenX = centerX + magnetPosRef.current * pxPerMeter;
    const magnetHalfW = (MAGNET_HALF_LENGTH * pxPerMeter);

    // Hit test magnet bounds (box width ~140px, height ~70px)
    if (
      Math.abs(x - magnetScreenX) <= magnetHalfW + 35 &&
      Math.abs(y - centerY) <= 55
    ) {
      isDraggingRef.current = true;
      dragStartClientXRef.current = clientX;
      dragStartPosRef.current = magnetPosRef.current;
      setAutoMotionMode('idle');
      logTelemetry('magnet_drag_start', { pos: magnetPosRef.current });
    }
  };

  const handlePointerMove = (clientX) => {
    if (!isDraggingRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const pxPerMeter = rect.width * 1.5;
    const deltaPx = clientX - dragStartClientXRef.current;
    const newPos = dragStartPosRef.current + deltaPx / pxPerMeter;

    // Numerical derivative for velocity
    const now = performance.now();
    const dt = Math.max((now - lastTimeRef.current) / 1000.0, 0.016);
    const instantaneousV = (newPos - magnetPosRef.current) / dt;

    magnetVelRef.current = Math.max(-3.0, Math.min(3.0, instantaneousV * 0.4 + magnetVelRef.current * 0.6));
    magnetPosRef.current = Math.max(-0.22, Math.min(0.22, newPos));
  };

  const handlePointerUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      magnetVelRef.current = 0.0;
      logTelemetry('magnet_drag_end', { finalPos: magnetPosRef.current });
    }
  };

  // -------------------------------------------------------------
  // CANVAS RENDERING ENGINE
  // -------------------------------------------------------------
  const drawScene = (
    ctx,
    width,
    height,
    magnetX,
    magnetV,
    pol,
    turns,
    B0,
    physics,
    needleAngle,
    animSec
  ) => {
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Scale to match DPR
    const dpr = window.devicePixelRatio || 1;
    const w = width / dpr;
    const h = height / dpr;
    ctx.scale(dpr, dpr);

    // 1. Sleek Laboratory Bench Background with Subtle Isometric Grid
    const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
    bgGradient.addColorStop(0, '#090d16');
    bgGradient.addColorStop(0.6, '#0f172a');
    bgGradient.addColorStop(1, '#090d16');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, w, h);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Coordinates layout:
    // Solenoid / Stage is centered at (stageCenterX, stageCenterY)
    // Center-Zero Galvanometer is centered at (galvoCenterX, galvoCenterY)
    const isMobile = w < 640;
    const stageCenterX = isMobile ? w * 0.50 : w * 0.42;
    const stageCenterY = isMobile ? h * 0.32 : h * 0.44;
    const pxPerMeter = isMobile ? w * 1.3 : w * 1.45;

    const galvoCenterX = isMobile ? w * 0.50 : w * 0.84;
    const galvoCenterY = isMobile ? h * 0.78 : h * 0.48;
    const galvoRadius = isMobile ? 65 : 85;

    // Guide Axis Track
    const trackY = stageCenterY;
    const trackStartX = stageCenterX - 0.22 * pxPerMeter;
    const trackEndX = stageCenterX + 0.22 * pxPerMeter;

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(trackStartX, trackY);
    ctx.lineTo(trackEndX, trackY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Solenoid Back Arc Loops (behind magnet)
    const coilW = isMobile ? 110 : 140;
    const coilH = isMobile ? 76 : 94;
    const coilLeft = stageCenterX - coilW / 2;
    const coilRight = stageCenterX + coilW / 2;

    // Number of visual copper loops
    const visualLoops = turns === 500 ? 18 : turns === 200 ? 10 : 6;
    const loopSpacing = coilW / visualLoops;

    // Solenoid Core Acrylic Cylinder Tube
    const tubeGradient = ctx.createLinearGradient(0, stageCenterY - coilH / 2, 0, stageCenterY + coilH / 2);
    tubeGradient.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
    tubeGradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.4)');
    tubeGradient.addColorStop(1, 'rgba(56, 189, 248, 0.08)');
    ctx.fillStyle = tubeGradient;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(coilLeft, stageCenterY - coilH / 2, coilW, coilH, 8);
    ctx.fill();
    ctx.stroke();

    // Back halves of copper loops (drawn before magnet so magnet enters through them!)
    ctx.strokeStyle = '#b45309'; // dark copper for back loops
    ctx.lineWidth = 4;
    for (let i = 0; i < visualLoops; i++) {
      const lx = coilLeft + i * loopSpacing + loopSpacing / 2;
      ctx.beginPath();
      ctx.ellipse(lx, stageCenterY, loopSpacing * 0.45, coilH / 2, 0, Math.PI / 2, (3 * Math.PI) / 2);
      ctx.stroke();
    }

    // 3. Animated Magnetic Flux Lines (Dipole field around magnet)
    const magnetScreenX = stageCenterX + magnetX * pxPerMeter;
    const magnetW = MAGNET_HALF_LENGTH * 2 * pxPerMeter;
    const magnetH = isMobile ? 44 : 52;
    const northOnRight = pol === 'N_RIGHT';

    if (showFluxLines) {
      drawMagneticFluxLines(
        ctx,
        magnetScreenX,
        stageCenterY,
        magnetW,
        magnetH,
        northOnRight,
        B0,
        animSec
      );
    }

    // 4. Bar Magnet Rendering
    drawBarMagnet(
      ctx,
      magnetScreenX,
      stageCenterY,
      magnetW,
      magnetH,
      northOnRight,
      magnetV,
      isDraggingRef.current
    );

    // 5. Front Halves of Solenoid Loops (overlapping the magnet!)
    ctx.lineWidth = 4.5;
    for (let i = 0; i < visualLoops; i++) {
      const lx = coilLeft + i * loopSpacing + loopSpacing / 2;
      // Front loop gradient: lustrous bright copper
      const copperGrad = ctx.createLinearGradient(0, stageCenterY - coilH / 2, 0, stageCenterY + coilH / 2);
      copperGrad.addColorStop(0, '#fde68a');
      copperGrad.addColorStop(0.3, '#f59e0b');
      copperGrad.addColorStop(0.7, '#d97706');
      copperGrad.addColorStop(1, '#92400e');

      ctx.strokeStyle = copperGrad;
      ctx.beginPath();
      ctx.ellipse(lx, stageCenterY, loopSpacing * 0.45, coilH / 2, 0, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    }

    // 6. Solenoid Label & Induced Pole Badge (Lenz's Law)
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Solenoid (${turns} Turns)`, stageCenterX, stageCenterY - coilH / 2 - 14);

    if (showLenzLabels && physics.opposingPole !== 'None') {
      const isNorthInduced = physics.opposingPole.startsWith('N');
      const badgeColor = isNorthInduced ? '#ef4444' : '#38bdf8';
      const badgeBg = isNorthInduced ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)';

      // Left face badge
      ctx.save();
      ctx.fillStyle = badgeBg;
      ctx.strokeStyle = badgeColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(coilLeft - 50, stageCenterY - 14, 42, 28, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = badgeColor;
      ctx.font = '800 13px system-ui, sans-serif';
      ctx.fillText(isNorthInduced ? 'N' : 'S', coilLeft - 29, stageCenterY + 5);

      // Force indicator text above
      ctx.font = '600 10px system-ui, sans-serif';
      ctx.fillText(isNorthInduced ? 'Induced N (Repels)' : 'Induced S (Attracts)', coilLeft - 29, stageCenterY - 20);
      ctx.restore();
    }

    // 7. Copper Leads Connecting Solenoid to Galvanometer
    drawConnectingLeads(
      ctx,
      coilLeft + 15,
      stageCenterY + coilH / 2,
      coilRight - 15,
      stageCenterY + coilH / 2,
      galvoCenterX,
      galvoCenterY,
      galvoRadius,
      physics.inducedEmfMilliV,
      showCurrentFlow,
      animSec
    );

    // 8. Center-Zero Galvanometer Instrument
    drawGalvanometer(
      ctx,
      galvoCenterX,
      galvoCenterY,
      galvoRadius,
      needleAngle,
      physics.inducedEmfMilliV,
      physics.inducedCurrentMicroA
    );

    ctx.restore();
  };

  // Helper: Draw Curved Dipole Magnetic Flux Lines
  const drawMagneticFluxLines = (ctx, mx, my, mw, mh, northOnRight, B0, animSec) => {
    ctx.save();
    const halfW = mw / 2;
    const nPoleX = northOnRight ? mx + halfW - 8 : mx - halfW + 8;
    const sPoleX = northOnRight ? mx - halfW + 8 : mx + halfW - 8;

    // Density scales with field strength B0
    const numLinePairs = Math.max(3, Math.round(B0 * 12));
    const lineSpacing = 16;

    ctx.lineWidth = 1.4;
    ctx.setLineDash([6, 6]);
    ctx.lineDashOffset = -animSec * 25; // Animated flow along lines!

    for (let i = 1; i <= numLinePairs; i++) {
      const curyH = 22 + i * lineSpacing;
      const alpha = Math.max(0.15, 0.6 - (i * 0.08));

      // Top loop
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(nPoleX, my);
      ctx.bezierCurveTo(
        nPoleX + (northOnRight ? 45 + i * 20 : -45 - i * 20),
        my - curyH * 1.5,
        sPoleX + (northOnRight ? -45 - i * 20 : 45 + i * 20),
        my - curyH * 1.5,
        sPoleX,
        my
      );
      ctx.stroke();

      // Bottom loop
      ctx.beginPath();
      ctx.moveTo(nPoleX, my);
      ctx.bezierCurveTo(
        nPoleX + (northOnRight ? 45 + i * 20 : -45 - i * 20),
        my + curyH * 1.5,
        sPoleX + (northOnRight ? -45 - i * 20 : 45 + i * 20),
        my + curyH * 1.5,
        sPoleX,
        my
      );
      ctx.stroke();
    }

    ctx.setLineDash([]);
    ctx.restore();
  };

  // Helper: Draw Physical Bar Magnet with Grab Handle & Vector Arrow
  const drawBarMagnet = (ctx, mx, my, mw, mh, northOnRight, velocity, isDragging) => {
    ctx.save();
    const halfW = mw / 2;
    const halfH = mh / 2;

    // Drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 6;

    // Clip rounded rect for magnet body
    ctx.beginPath();
    ctx.roundRect(mx - halfW, my - halfH, mw, mh, 7);
    ctx.clip();

    // North Half
    const nGrad = ctx.createLinearGradient(0, my - halfH, 0, my + halfH);
    nGrad.addColorStop(0, '#f87171');
    nGrad.addColorStop(0.5, '#dc2626');
    nGrad.addColorStop(1, '#991b1b');

    // South Half
    const sGrad = ctx.createLinearGradient(0, my - halfH, 0, my + halfH);
    sGrad.addColorStop(0, '#60a5fa');
    sGrad.addColorStop(0.5, '#2563eb');
    sGrad.addColorStop(1, '#1e40af');

    if (northOnRight) {
      // South on Left, North on Right
      ctx.fillStyle = sGrad;
      ctx.fillRect(mx - halfW, my - halfH, halfW, mh);
      ctx.fillStyle = nGrad;
      ctx.fillRect(mx, my - halfH, halfW, mh);
    } else {
      // North on Left, South on Right
      ctx.fillStyle = nGrad;
      ctx.fillRect(mx - halfW, my - halfH, halfW, mh);
      ctx.fillStyle = sGrad;
      ctx.fillRect(mx, my - halfH, halfW, mh);
    }

    // Metallic center divider line
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(mx - 1.5, my - halfH, 3, mh);

    // Subtle metallic specular shine across top
    const shineGrad = ctx.createLinearGradient(0, my - halfH, 0, my);
    shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = shineGrad;
    ctx.fillRect(mx - halfW, my - halfH, mw, halfH);

    ctx.restore(); // restore clipping

    // Outer border & Glow when dragged
    ctx.save();
    ctx.strokeStyle = isDragging ? '#38bdf8' : '#64748b';
    ctx.lineWidth = isDragging ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.roundRect(mx - halfW, my - halfH, mw, mh, 7);
    ctx.stroke();

    // Pole Text Labels ('N' and 'S')
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const leftPoleX = mx - halfW / 2;
    const rightPoleX = mx + halfW / 2;

    ctx.fillText(northOnRight ? 'S' : 'N', leftPoleX, my);
    ctx.fillText(northOnRight ? 'N' : 'S', rightPoleX, my);

    // "DRAG ME" Handle Indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '700 9px system-ui, sans-serif';
    ctx.fillText('◄ DRAG ►', mx, my + halfH - 8);

    // Velocity Vector Arrow above magnet
    if (Math.abs(velocity) > 0.05) {
      const arrowY = my - halfH - 18;
      const arrowLength = Math.max(25, Math.min(80, Math.abs(velocity) * 45));
      const arrowDir = Math.sign(velocity);
      const arrowEndX = mx + arrowDir * arrowLength;

      ctx.strokeStyle = '#22c55e';
      ctx.fillStyle = '#22c55e';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(mx, arrowY);
      ctx.lineTo(arrowEndX, arrowY);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(arrowEndX, arrowY);
      ctx.lineTo(arrowEndX - arrowDir * 8, arrowY - 5);
      ctx.lineTo(arrowEndX - arrowDir * 8, arrowY + 5);
      ctx.closePath();
      ctx.fill();

      // Velocity label
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`v = ${velocity.toFixed(2)} m/s`, mx, arrowY - 9);
    }

    ctx.restore();
  };

  // Helper: Connecting Copper Leads and Animated Current Particles
  const drawConnectingLeads = (
    ctx,
    lead1X,
    lead1Y,
    lead2X,
    lead2Y,
    gx,
    gy,
    gr,
    emfMilliV,
    showFlow,
    animSec
  ) => {
    ctx.save();
    // Leads route down and around toward galvanometer binding posts
    const postLeftX = gx - 16;
    const postRightX = gx + 16;
    const postY = gy + gr + 12;

    // Draw copper wires
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;

    // Wire 1: Solenoid left to Galvo left terminal
    ctx.beginPath();
    ctx.moveTo(lead1X, lead1Y);
    ctx.bezierCurveTo(lead1X, lead1Y + 50, postLeftX - 30, postY + 30, postLeftX, postY);
    ctx.stroke();

    // Wire 2: Solenoid right to Galvo right terminal
    ctx.beginPath();
    ctx.moveTo(lead2X, lead2Y);
    ctx.bezierCurveTo(lead2X, lead2Y + 60, postRightX + 30, postY + 30, postRightX, postY);
    ctx.stroke();

    // Binding Posts (Red + and Black -)
    ctx.fillStyle = '#ef4444'; // Red (+) post
    ctx.beginPath();
    ctx.arc(postLeftX, postY, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a'; // Black (-) post
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(postRightX, postY, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Animated Flowing Current Particles when EMF is active
    if (showFlow && Math.abs(emfMilliV) > 1.0) {
      const numParticles = 6;
      const speed = Math.sign(emfMilliV) * (Math.abs(emfMilliV) / 50.0) * 1.5;

      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 8;

      for (let i = 0; i < numParticles; i++) {
        const offset = ((animSec * speed * 0.4 + i / numParticles) % 1 + 1) % 1;
        // Sample position along wire 1
        const t = offset;
        const px = (1 - t) * (1 - t) * lead1X + 2 * (1 - t) * t * (lead1X) + t * t * postLeftX;
        const py = (1 - t) * (1 - t) * lead1Y + 2 * (1 - t) * t * (lead1Y + 50) + t * t * postY;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  };

  // Helper: Authentic Center-Zero Galvanometer
  const drawGalvanometer = (ctx, gx, gy, gr, needleAngle, emfMilliV, currentMicroA) => {
    ctx.save();

    // Meter Housing (Chassis)
    const chassisGradient = ctx.createRadialGradient(gx, gy, gr * 0.3, gx, gy, gr * 1.15);
    chassisGradient.addColorStop(0, '#1e293b');
    chassisGradient.addColorStop(0.85, '#0f172a');
    chassisGradient.addColorStop(1, '#020617');

    ctx.fillStyle = chassisGradient;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner Metallic Bezel Ring
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(gx, gy, gr - 4, 0, Math.PI * 2);
    ctx.stroke();

    // Dial Face Plate
    const dialGradient = ctx.createRadialGradient(gx, gy - 15, 10, gx, gy, gr - 10);
    dialGradient.addColorStop(0, '#1e293b');
    dialGradient.addColorStop(1, '#090d16');
    ctx.fillStyle = dialGradient;
    ctx.beginPath();
    ctx.arc(gx, gy, gr - 8, 0, Math.PI * 2);
    ctx.fill();

    // Pivot center is located near bottom center of the dial
    const pivotX = gx;
    const pivotY = gy + gr * 0.50;
    const scaleRadius = gr * 1.05;

    // Anti-Parallax Mirror Strip (Arc)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, scaleRadius - 14, -Math.PI / 2 - 0.9, -Math.PI / 2 + 0.9);
    ctx.stroke();

    // Dial Scale Ticks and Numbers (-50 to +50)
    // -50 at angle -0.87 rad, 0 at -PI/2 (straight up), +50 at +0.87 rad
    const maxScaleDeg = 50;
    const maxRadSpan = (50 * Math.PI) / 180; // ±50 degrees

    for (let val = -maxScaleDeg; val <= maxScaleDeg; val += 10) {
      const angle = -Math.PI / 2 + (val / maxScaleDeg) * maxRadSpan;
      const isMajor = val % 20 === 0 || val === 0;
      const tickInnerR = scaleRadius - (isMajor ? 12 : 7);
      const tickOuterR = scaleRadius;

      const x1 = pivotX + tickInnerR * Math.cos(angle);
      const y1 = pivotY + tickInnerR * Math.sin(angle);
      const x2 = pivotX + tickOuterR * Math.cos(angle);
      const y2 = pivotY + tickOuterR * Math.sin(angle);

      ctx.strokeStyle = val === 0 ? '#38bdf8' : '#94a3b8';
      ctx.lineWidth = isMajor ? (val === 0 ? 2.5 : 1.8) : 1.0;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Number Labels
      if (isMajor) {
        const textR = scaleRadius - 20;
        const tx = pivotX + textR * Math.cos(angle);
        const ty = pivotY + textR * Math.sin(angle);

        ctx.fillStyle = val === 0 ? '#38bdf8' : '#cbd5e1';
        ctx.font = val === 0 ? '800 11px system-ui' : '600 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.abs(val).toString(), tx, ty);
      }
    }

    // Center "G" Badge & Units Label
    ctx.fillStyle = '#38bdf8';
    ctx.font = '800 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('G', gx, gy - gr * 0.15);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 8px system-ui, sans-serif';
    ctx.fillText('CENTER-ZERO', gx, gy - gr * 0.03);
    ctx.fillText('±50 mV', gx, gy + gr * 0.08);

    // Deflecting Needle / Pointer
    // needleAngle is 0 when straight up (-PI/2)
    const needleDrawAngle = -Math.PI / 2 + needleAngle;
    const needleLen = scaleRadius - 4;

    ctx.save();
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = Math.abs(needleAngle) > 0.02 ? 8 : 2;

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(
      pivotX + needleLen * Math.cos(needleDrawAngle),
      pivotY + needleLen * Math.sin(needleDrawAngle)
    );
    ctx.stroke();
    ctx.restore();

    // Needle Central Pivot Cap
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Small jewel in center of pivot cap
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Digital readout badge beneath galvanometer
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(gx - 45, gy + gr + 4, 90, 22, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = Math.abs(emfMilliV) > 0.5 ? '#f59e0b' : '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${emfMilliV >= 0 ? '+' : ''}${emfMilliV.toFixed(1)} mV`, gx, gy + gr + 19);

    ctx.restore();
  };

  // Helper: Live Rolling Waveform Strip
  const drawOscilloscope = (canvas, history) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    // Screen background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    // Oscilloscope reticle grid
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Zero line
    const zeroY = h / 2;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(w, zeroY);
    ctx.stroke();

    if (history.length < 2) {
      ctx.restore();
      return;
    }

    // Plot 1: Magnetic Flux Linkage Φ(t) (Cyan Line)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    history.forEach((pt, idx) => {
      const x = (idx / (history.length - 1)) * w;
      // Scale: 1 mWb = 35 px
      const y = zeroY - pt.flux * 45;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Plot 2: Induced E.M.F. ε(t) = -N dΦ/dt (Amber Line)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    history.forEach((pt, idx) => {
      const x = (idx / (history.length - 1)) * w;
      // Scale: 100 mV = 35 px
      const y = zeroY - (pt.emf / MAX_EMF_SCALE) * (h * 0.42);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Legend in top-left
    ctx.font = 'bold 9px system-ui';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('— Flux Φ(t)', 8, 14);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('— Induced E.M.F. ε(t)', 70, 14);

    ctx.restore();
  };

  // Predictor Submission Handler
  const handleCheckPrediction = () => {
    setPredictionSubmitted(true);
    const activeCase = PREDICTOR_CASES[selectedCaseIdx];
    const isCorrect = predictedDeflection === activeCase.expectedDeflection;
    logTelemetry('predictor_evaluated', {
      caseId: activeCase.id,
      predicted: predictedDeflection,
      isCorrect,
    });
  };

  // Quick Action for Selected Predictor Case
  const handleApplyPredictorCase = (idx) => {
    setSelectedCaseIdx(idx);
    setPredictionSubmitted(false);
    setPredictedDeflection(null);

    const c = PREDICTOR_CASES[idx];
    if (c.id === 'case_1') {
      // Plunge N
      setPolarity('N_RIGHT');
      magnetPosRef.current = -0.18;
      handleTriggerMotion('plunge');
    } else if (c.id === 'case_2') {
      // Withdraw N
      setPolarity('N_RIGHT');
      magnetPosRef.current = 0.02;
      handleTriggerMotion('withdraw');
    } else if (c.id === 'case_3') {
      // Plunge S
      setPolarity('S_RIGHT');
      magnetPosRef.current = -0.18;
      handleTriggerMotion('plunge');
    } else if (c.id === 'case_4') {
      // Stationary inside coil
      magnetPosRef.current = 0.0;
      setAutoMotionMode('idle');
    }
  };

  // KCSE Quiz Submission
  const handleQuizSubmit = (e) => {
    e.preventDefault();
    const prob = KCSE_PROBLEMS[activeProblemIdx];
    const userVal = parseFloat(userAnswer.trim());
    if (isNaN(userVal)) return;

    const isCorrect = Math.abs(userVal - prob.target) <= prob.tolerance;
    setPracticeStatus(isCorrect ? 'correct' : 'incorrect');
    logTelemetry('kcse_problem_attempted', {
      problemId: prob.id,
      userAnswer: userVal,
      isCorrect,
    });
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-3xl p-3 sm:p-5 md:p-7 space-y-6 font-sans border border-slate-800 shadow-2xl">
      {/* 1. Header with Topic Badge, Title, and Top Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-3.5 h-3.5" /> Form 4 Physics • Topic 5: Electromagnetic Induction
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Faraday's & Lenz's Laws
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-400 bg-clip-text text-transparent">
            Faraday's Law & Magnetic Flux Induction Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            Investigate electromagnetic induction in real time: plunge a bar magnet into a multi-turn solenoid, observe instantaneous magnetic flux linkage, verify Lenz's opposing induced magnetic pole, and trace center-zero galvanometer deflection.
          </p>
        </div>

        {/* Global Reset Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-1.5 shadow-sm"
            title="Reset to default experiment parameters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            Reset Lab
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs (Laboratory | Lenz's Law Analysis | KCSE Problems) */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('lab')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'lab'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" /> Interactive Induction Lab
        </button>
        <button
          onClick={() => setActiveTab('lenz')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'lenz'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <CompassIcon className="w-4 h-4" /> Lenz's Law & Predictor
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'practice'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" /> KCSE Exam Practice
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INTERACTIVE INDUCTION LAB                                         */}
      {/* ========================================================================= */}
      {activeTab === 'lab' && (
        <div className="space-y-5">
          {/* Main Visualizer Stage */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-inner">
            {/* Top Overlay Motion Action Bar */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 px-1 hidden sm:inline">
                Magnet Motion:
              </span>
              <button
                onClick={() => handleTriggerMotion('plunge')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  autoMotionMode === 'plunge'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700'
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" /> Plunge In
              </button>
              <button
                onClick={() => handleTriggerMotion('withdraw')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  autoMotionMode === 'withdraw'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Withdraw
              </button>
              <button
                onClick={() => handleTriggerMotion('oscillate')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  autoMotionMode === 'oscillate'
                    ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" /> Auto Oscillate
              </button>
            </div>

            {/* Quick Polarity Flip Pill in Top Right */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={handleTogglePolarity}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-all flex items-center gap-1.5"
                title="Reverse North / South magnet orientation"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                Flip Magnet Polarity ({polarity === 'N_RIGHT' ? 'N Leading' : 'S Leading'})
              </button>
            </div>

            {/* Main Interactive HTML5 Canvas */}
            <canvas
              ref={canvasRef}
              onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
              onMouseMove={(e) => handlePointerMove(e.clientX)}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={(e) => {
                if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchMove={(e) => {
                if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
              }}
              onTouchEnd={handlePointerUp}
              className="w-full h-[360px] sm:h-[420px] md:h-[450px] cursor-grab active:cursor-grabbing block select-none"
            />

            {/* Drag instruction notice at bottom left */}
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800">
              <MoveHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Click & drag bar magnet horizontally into and out of the coil</span>
            </div>

            {/* Live Lenz Status Badge at bottom right */}
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 text-xs bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">Lenz Opposition:</span>
              <span
                className={`font-mono font-bold ${
                  liveTelemetry.opposingPole.startsWith('N')
                    ? 'text-red-400'
                    : liveTelemetry.opposingPole.startsWith('S')
                    ? 'text-sky-400'
                    : 'text-slate-500'
                }`}
              >
                {liveTelemetry.opposingPole}
              </span>
            </div>
          </div>

          {/* Real-time Scientific Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Magnet Speed |v|
              </span>
              <span className="text-lg font-mono font-extrabold text-cyan-400">
                {Math.abs(liveTelemetry.velocity).toFixed(2)}{' '}
                <span className="text-xs font-normal text-slate-400">m/s</span>
              </span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Core Flux Φ
              </span>
              <span className="text-lg font-mono font-extrabold text-sky-400">
                {liveTelemetry.fluxMilliWb.toFixed(2)}{' '}
                <span className="text-xs font-normal text-slate-400">mWb</span>
              </span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Rate ΔΦ/Δt
              </span>
              <span className="text-lg font-mono font-extrabold text-purple-400">
                {liveTelemetry.dFluxDtMilliWb.toFixed(2)}{' '}
                <span className="text-xs font-normal text-slate-400">mWb/s</span>
              </span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Solenoid Turns N
              </span>
              <span className="text-lg font-mono font-extrabold text-slate-200">
                {coilTurns}{' '}
                <span className="text-xs font-normal text-slate-400">turns</span>
              </span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800/80 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                Induced E.M.F. ε
              </span>
              <span className="text-lg font-mono font-extrabold text-amber-400">
                {liveTelemetry.inducedEmfMilliV >= 0 ? '+' : ''}
                {liveTelemetry.inducedEmfMilliV.toFixed(1)}{' '}
                <span className="text-xs font-normal text-slate-400">mV</span>
              </span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800/80 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-green-400 tracking-wider block">
                Deflection Angle
              </span>
              <span className="text-lg font-mono font-extrabold text-green-400">
                {liveTelemetry.needleDeflectionDegrees >= 0 ? '+' : ''}
                {liveTelemetry.needleDeflectionDegrees.toFixed(1)}°
              </span>
            </div>
          </div>

          {/* Interactive Controls & Parameter Adjustment Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            {/* Control Column 1: Coil Turns Selector (100, 200, 500) */}
            <div className="lg:col-span-4 space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Coil Turns (N):</span>
                <span className="text-cyan-400 font-mono font-bold">{coilTurns} Turns</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[100, 200, 500].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setCoilTurns(t);
                      logTelemetry('change_turns', { turns: t });
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      coilTurns === t
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {t} Turns
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Faraday's Law: Induced E.M.F. is directly proportional to number of turns (ε ∝ N).
              </p>
            </div>

            {/* Control Column 2: Magnetic Field Strength Slider (0.05 to 0.50 T) */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Magnet Strength (B₀):</span>
                <span className="text-amber-400 font-mono font-bold">
                  {magneticFieldB.toFixed(2)} Tesla (T)
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={magneticFieldB}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setMagneticFieldB(val);
                  logTelemetry('change_field_strength', { B: val });
                }}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.05 T (Weak)</span>
                <span>0.25 T</span>
                <span>0.50 T (Strong Neodymium)</span>
              </div>
            </div>

            {/* Control Column 3: Automated Plunge Speed Slider */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Plunge Speed (v):</span>
                <span className="text-purple-400 font-mono font-bold">
                  {targetSpeed.toFixed(1)} m/s
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={targetSpeed}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTargetSpeed(val);
                  logTelemetry('change_target_speed', { speed: val });
                }}
                className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.2 m/s (Gentle)</span>
                <span>1.0 m/s</span>
                <span>2.0 m/s (Rapid Plunge)</span>
              </div>
            </div>
          </div>

          {/* Visual Display Toggles & Dual Waveform Oscilloscope */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Lab Visual Overlays:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowFluxLines(!showFluxLines)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    showFluxLines
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 font-semibold'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  Flux Lines
                </button>
                <button
                  onClick={() => setShowCurrentFlow(!showCurrentFlow)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    showCurrentFlow
                      ? 'bg-slate-800 text-amber-300 border-amber-500/40 font-semibold'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  Current Flow Particles
                </button>
                <button
                  onClick={() => setShowLenzLabels(!showLenzLabels)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    showLenzLabels
                      ? 'bg-slate-800 text-red-300 border-red-500/40 font-semibold'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  Lenz Face Poles
                </button>
                <button
                  onClick={() => setShowOscilloscope(!showOscilloscope)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    showOscilloscope
                      ? 'bg-slate-800 text-sky-300 border-sky-500/40 font-semibold'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  Waveform Oscilloscope
                </button>
              </div>
            </div>

            {/* Rolling Oscilloscope Waveform Strip */}
            {showOscilloscope && (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span className="font-semibold text-slate-200">Dual-Channel Induction Oscilloscope</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Notice: E.M.F. (Amber) crosses ZERO when Flux (Cyan) reaches its peak inside the coil!
                  </span>
                </div>
                <canvas
                  ref={oscCanvasRef}
                  className="w-full h-24 sm:h-28 rounded-xl block border border-slate-800/80"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LENZ'S LAW ANALYSIS & INTERACTIVE PREDICTOR                       */}
      {/* ========================================================================= */}
      {activeTab === 'lenz' && (
        <div className="space-y-6">
          {/* Predictor Interactive Sandbox */}
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Predict → Test → Explain: Lenz's Law Challenge
                </h3>
                <p className="text-xs text-slate-400">
                  Select an induction scenario below, predict the direction of galvanometer deflection, and run the test in the live engine!
                </p>
              </div>
            </div>

            {/* Scenario Selection Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PREDICTOR_CASES.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => handleApplyPredictorCase(idx)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedCaseIdx === idx
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[11px] font-mono text-slate-500 block">Scenario {idx + 1}</span>
                  <span className="text-xs font-bold leading-tight block mt-0.5">{c.scenario}</span>
                </button>
              ))}
            </div>

            {/* Active Scenario Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                  Target Condition:
                </span>
                <p className="text-sm font-semibold text-slate-200">
                  {PREDICTOR_CASES[selectedCaseIdx].magnetAction}
                </p>
              </div>

              {/* Prediction Selector Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">
                  What will the galvanometer needle do?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setPredictedDeflection('left');
                      setPredictionSubmitted(false);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      predictedDeflection === 'left'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" /> Deflect LEFT (-)
                  </button>

                  <button
                    onClick={() => {
                      setPredictedDeflection('zero');
                      setPredictionSubmitted(false);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      predictedDeflection === 'zero'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <Gauge className="w-4 h-4" /> Stay at ZERO (0)
                  </button>

                  <button
                    onClick={() => {
                      setPredictedDeflection('right');
                      setPredictionSubmitted(false);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      predictedDeflection === 'right'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4" /> Deflect RIGHT (+)
                  </button>
                </div>
              </div>

              {/* Submit / Check Prediction Button */}
              {predictedDeflection && !predictionSubmitted && (
                <button
                  onClick={handleCheckPrediction}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center gap-1.5"
                >
                  Verify Prediction with Lenz's Law
                </button>
              )}

              {/* Prediction Evaluation Feedback */}
              {predictionSubmitted && (
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    predictedDeflection === PREDICTOR_CASES[selectedCaseIdx].expectedDeflection
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {predictedDeflection === PREDICTOR_CASES[selectedCaseIdx].expectedDeflection ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Excellent Prediction! Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Incorrect Prediction. Let's examine why:</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs leading-relaxed space-y-1 text-slate-200">
                    <p>
                      <strong>Induced Solenoid Face:</strong> {PREDICTOR_CASES[selectedCaseIdx].inducedFacePole} Pole
                    </p>
                    <p>
                      <strong>Mechanical Interaction:</strong> {PREDICTOR_CASES[selectedCaseIdx].oppositionType}
                    </p>
                    <p className="text-slate-300 pt-1 border-t border-slate-800/80">
                      {PREDICTOR_CASES[selectedCaseIdx].reasoning}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Canonical Summary Table of the 5 Induction Conditions */}
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              KCSE Summary: The Laws of Electromagnetic Induction
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Magnet Motion</th>
                    <th className="py-2.5 px-3">Leading Pole</th>
                    <th className="py-2.5 px-3">Magnetic Flux Change (ΔΦ)</th>
                    <th className="py-2.5 px-3">Induced Near Face</th>
                    <th className="py-2.5 px-3">Galvanometer Needle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">Pushing In (Right)</td>
                    <td className="py-2.5 px-3 text-red-400 font-bold">North (N)</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-400">Increasing (ΔΦ &gt; 0)</td>
                    <td className="py-2.5 px-3 text-red-400 font-bold">North (Repels)</td>
                    <td className="py-2.5 px-3 text-amber-400 font-bold">Deflects LEFT (-)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">Withdrawing (Left)</td>
                    <td className="py-2.5 px-3 text-red-400 font-bold">North (N)</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-400">Decreasing (ΔΦ &lt; 0)</td>
                    <td className="py-2.5 px-3 text-sky-400 font-bold">South (Attracts)</td>
                    <td className="py-2.5 px-3 text-green-400 font-bold">Deflects RIGHT (+)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">Pushing In (Right)</td>
                    <td className="py-2.5 px-3 text-sky-400 font-bold">South (S)</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-400">Increasing (ΔΦ &gt; 0)</td>
                    <td className="py-2.5 px-3 text-sky-400 font-bold">South (Repels)</td>
                    <td className="py-2.5 px-3 text-green-400 font-bold">Deflects RIGHT (+)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">Withdrawing (Left)</td>
                    <td className="py-2.5 px-3 text-sky-400 font-bold">South (S)</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-400">Decreasing (ΔΦ &lt; 0)</td>
                    <td className="py-2.5 px-3 text-red-400 font-bold">North (Attracts)</td>
                    <td className="py-2.5 px-3 text-amber-400 font-bold">Deflects LEFT (-)</td>
                  </tr>
                  <tr className="bg-slate-950/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">Stationary Inside Coil</td>
                    <td className="py-2.5 px-3 text-slate-400">Either N or S</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">Constant (ΔΦ = 0)</td>
                    <td className="py-2.5 px-3 text-slate-500">None</td>
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">Strictly ZERO (0)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Lenz's Law & Energy Conservation Deep Dive */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-3">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Why Lenz's Law Must Be an Opposition (Energy Conservation):
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                If the induced current produced an <em>attracting</em> pole as a North pole approached, the magnet would accelerate faster into the coil without external work, generating electrical energy from nothing! This would violate the <strong>Law of Conservation of Energy</strong>. Therefore, mechanical work must always be done against the opposing induced magnetic force to produce electric current.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KCSE PRACTICE PROBLEMS & MARKING SCHEME                            */}
      {/* ========================================================================= */}
      {activeTab === 'practice' && (
        <div className="space-y-5">
          {/* Problem Selector Tabs */}
          <div className="flex items-center gap-2">
            {KCSE_PROBLEMS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setActiveProblemIdx(idx);
                  setUserAnswer('');
                  setPracticeStatus(null);
                  setShowSolution(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeProblemIdx === idx
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                Question {idx + 1}
              </button>
            ))}
          </div>

          {/* Active Question Card */}
          <div className="bg-slate-900/80 rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                {KCSE_PROBLEMS[activeProblemIdx].title}
              </span>
              <p className="text-sm text-slate-200 leading-relaxed mt-2 font-medium">
                {KCSE_PROBLEMS[activeProblemIdx].question}
              </p>
            </div>

            {/* Answer Input Form */}
            <form onSubmit={handleQuizSubmit} className="space-y-3">
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="number"
                  step="any"
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    setPracticeStatus(null);
                  }}
                  placeholder="Enter numerical answer..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                  {KCSE_PROBLEMS[activeProblemIdx].unit}
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm"
                >
                  Submit
                </button>
              </div>

              {/* Hint Box */}
              <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Hint:</strong> {KCSE_PROBLEMS[activeProblemIdx].hint}
                </span>
              </div>
            </form>

            {/* Immediate Result Feedback */}
            {practiceStatus && (
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  practiceStatus === 'correct'
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/50 border-rose-500 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                  {practiceStatus === 'correct' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Correct Answer! Full KNEC marks awarded.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Incorrect. Check formulas, unit conversions, and try again!</span>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="text-xs font-bold underline hover:opacity-80 transition-opacity"
                >
                  {showSolution ? 'Hide Solution Steps' : 'Show Marking Scheme'}
                </button>
              </div>
            )}

            {/* Step-by-Step Marking Scheme */}
            {showSolution && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Official KNEC Marking Scheme & Derivation:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 font-mono">
                  {KCSE_PROBLEMS[activeProblemIdx].solutionSteps.map((step, sIdx) => (
                    <li key={sIdx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Fallback compass icon for tab
function CompassIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
