import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Compass,
  Activity,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  Layers,
  Shield,
  Eye,
  Info,
  Sparkles,
  Sliders,
  ChevronRight,
  Gauge,
  Flame,
  RefreshCw,
} from 'lucide-react';

// ============================================================================
// KCSE Practice & Mastery Questions
// ============================================================================
const KCSE_PROBLEMS = [
  {
    id: 'kcse_lenz_1',
    title: 'Question 1: North Pole Approach & Lenz\'s Law Polarity',
    scenario:
      'A bar magnet is moved with its North (N) pole facing towards the right-hand end of a stationary solenoid coil connected to a center-zero galvanometer.',
    question:
      'State the magnetic polarity induced at the facing end of the solenoid, the direction of the induced mechanical force on the magnet, and explain this in terms of energy conservation.',
    options: [
      {
        id: 'A',
        text: 'Facing end becomes South pole; attractive force pulls magnet in; electrical energy is created from nothing without work.',
      },
      {
        id: 'B',
        text: 'Facing end becomes North pole; repulsive force opposes approach; mechanical work done by hand against repulsion converts into electrical energy.',
      },
      {
        id: 'C',
        text: 'Facing end has no polarity; zero force is exerted; current only flows when the magnet is stationary inside the coil.',
      },
      {
        id: 'D',
        text: 'Facing end becomes North pole; attractive force accelerates magnet; current flows without any resistance or flux change.',
      },
    ],
    correct: 'B',
    hint: 'Lenz\'s law states the induced current opposes the change producing it. Approaching N-pole means the coil must repel the magnet to oppose its motion.',
    explanation:
      'By Lenz\'s Law, the induced current creates a magnetic field that opposes the increase in flux. Hence, the facing end becomes a North (N) pole to repel the approaching North pole. The experimenter must do mechanical work against this repulsive force, which converts into induced electrical energy, strictly obeying the Principle of Conservation of Energy.',
  },
  {
    id: 'kcse_lenz_2',
    title: 'Question 2: Eddy Current Damping in Copper Pipe vs Plastic Pipe',
    scenario:
      'A strong cylindrical neodymium magnet is dropped vertically through a 1.0 m non-magnetic copper tube, and an identical magnet is dropped through a 1.0 m plastic PVC tube of identical dimensions.',
    question:
      'Why does the magnet take several seconds to exit the copper tube while falling through the plastic tube in under half a second?',
    options: [
      {
        id: 'A',
        text: 'Copper is ferromagnetic and permanently sticks to the magnet, preventing free motion by magnetic attraction.',
      },
      {
        id: 'B',
        text: 'Falling magnet creates changing flux in copper, inducing circulating eddy currents whose magnetic fields exert upward repulsive and attractive forces opposing gravity (Lenz\'s law), causing terminal velocity.',
      },
      {
        id: 'C',
        text: 'Plastic creates electrostatic friction that repels the magnet downward faster than acceleration due to gravity g.',
      },
      {
        id: 'D',
        text: 'Air resistance inside the copper tube is dramatically higher because copper is much denser than PVC plastic.',
      },
    ],
    correct: 'B',
    hint: 'Copper is non-magnetic but an excellent electrical conductor. What currents circulate in the tube wall when magnetic flux moves past?',
    explanation:
      'Copper has high electrical conductivity. The falling magnet\'s moving flux cuts the tube wall, inducing circular eddy currents. Below the magnet, eddy currents create an opposing repulsive pole; above the magnet, eddy currents create an attracting pole. Both exert upward magnetic braking forces opposing gravity. In plastic (an insulator), conductivity is zero, so no eddy currents form and the magnet free-falls at a = g.',
  },
  {
    id: 'kcse_lenz_3',
    title: 'Question 3: Effect of Longitudinal Slots on Eddy Damping',
    scenario:
      'A copper tube has a continuous longitudinal slit cut along its entire length from top to bottom. The neodymium magnet is dropped through this slotted tube.',
    question:
      'Predict how the fall time compares with the solid copper tube and explain the underlying physics.',
    options: [
      {
        id: 'A',
        text: 'The magnet falls much faster because the slit breaks the continuous circumferential conduction loops, greatly increasing resistance and reducing eddy currents.',
      },
      {
        id: 'B',
        text: 'The magnet falls slower because air rushes through the slit, creating high aerodynamic drag.',
      },
      {
        id: 'C',
        text: 'The fall time is exactly identical because the mass of copper remains virtually unchanged.',
      },
      {
        id: 'D',
        text: 'The magnet stops completely mid-tube because the slit concentrates magnetic field lines at the edges.',
      },
    ],
    correct: 'A',
    hint: 'Think about the path eddy currents follow around the circumference of the cylinder. Can current cross an air gap slit?',
    explanation:
      'Eddy currents circulate around the circumference of the tube perpendicular to the falling magnet\'s axis. The longitudinal slit interrupts these continuous circular paths, forcing eddy currents into small, restricted, high-resistance local loops. This drastically diminishes the induced current magnitude and the upward braking force, so the magnet falls much faster (similar principle used in laminating transformer cores).',
  },
  {
    id: 'kcse_lenz_4',
    title: 'Question 4: Faraday\'s Law & Induced E.M.F. Calculation',
    scenario:
      'A solenoid of N = 600 turns has an initial magnetic flux linkage of 2.0 × 10⁻⁴ Wb. A bar magnet is rapidly pulled out in 0.05 seconds, reducing the flux linkage to 0.5 × 10⁻⁴ Wb.',
    question:
      'Calculate the magnitude of the average electromotive force (E.M.F.) induced in the solenoid during this withdrawal.',
    options: [
      { id: 'A', text: '0.90 V' },
      { id: 'B', text: '1.80 V' },
      { id: 'C', text: '2.40 V' },
      { id: 'D', text: '0.15 V' },
    ],
    correct: 'B',
    hint: 'Use Faraday\'s law: |ε| = N × |ΔΦ / Δt|. Calculate ΔΦ = |0.5×10⁻⁴ - 2.0×10⁻⁴| = 1.5×10⁻⁴ Wb.',
    explanation:
      'Change in flux ΔΦ = |Φ_final - Φ_initial| = |0.5 × 10⁻⁴ - 2.0 × 10⁻⁴| = 1.5 × 10⁻⁴ Wb.\nTime interval Δt = 0.05 s.\nBy Faraday\'s Law:\n|ε| = N × (ΔΦ / Δt) = 600 × (1.5 × 10⁻⁴ Wb / 0.05 s) = 600 × (3.0 × 10⁻³ V) = 1.80 V.',
  },
];

// Materials for Pipe Drop Mode
const PIPE_MATERIALS = {
  copper_solid: {
    id: 'copper_solid',
    name: 'Solid Copper',
    conductivity: '5.96 × 10⁷ S/m (100%)',
    damping: 1.25,
    color: '#f97316',
    border: '#ea580c',
    desc: 'High conductivity continuous tube. Strongest eddy currents and slowest terminal descent.',
    isSlotted: false,
  },
  copper_slotted: {
    id: 'copper_slotted',
    name: 'Slotted Copper (Slit)',
    conductivity: 'Interrupted (~15% effective)',
    damping: 0.18,
    color: '#f59e0b',
    border: '#d97706',
    desc: 'Longitudinal slit breaks circumferential loops, drastically diminishing eddy currents.',
    isSlotted: true,
  },
  aluminum_solid: {
    id: 'aluminum_solid',
    name: 'Solid Aluminum',
    conductivity: '3.77 × 10⁷ S/m (63%)',
    damping: 0.78,
    color: '#94a3b8',
    border: '#64748b',
    desc: 'Good conductor with 63% copper conductivity. Noticeable damping but faster than copper.',
    isSlotted: false,
  },
  brass_solid: {
    id: 'brass_solid',
    name: 'Solid Brass',
    conductivity: '1.60 × 10⁷ S/m (27%)',
    damping: 0.35,
    color: '#eab308',
    border: '#ca8a04',
    desc: 'Moderate alloy conductivity. Mild eddy braking.',
    isSlotted: false,
  },
};

export default function LenzsLawEddyCurrentsSim({ config = {}, onTelemetry }) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('coil_induction'); // 'coil_induction' | 'pipe_drop' | 'kcse_mastery'

  // --------------------------------------------------------------------------
  // MODE 1: BAR MAGNET & SOLENOID COIL STATE
  // --------------------------------------------------------------------------
  const [facingPole, setFacingPole] = useState('N'); // 'N' | 'S' facing the coil
  const [coilTurns, setCoilTurns] = useState(500); // 200, 500, 1000 turns
  const [hasIronCore, setHasIronCore] = useState(false); // soft iron core boosts flux
  const [magnetPosMm, setMagnetPosMm] = useState(160); // 40mm (close) to 260mm (far)
  const [magnetVelocity, setMagnetVelocity] = useState(0); // mm/s (negative = approaching coil, positive = withdrawing)
  const [autoOscillate, setAutoOscillate] = useState(false);
  const [motionSpeedSetting, setMotionSpeedSetting] = useState('normal'); // 'slow' (40mm/s), 'normal' (90mm/s), 'fast' (160mm/s)
  const [predictChoice, setPredictChoice] = useState(null); // 'repel' | 'attract' | 'zero'
  const [predictFeedback, setPredictFeedback] = useState(null);

  // Manual Drag Tracking for Magnet
  const isDraggingMagnetRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(160);
  const lastDragTimeRef = useRef(0);
  const lastDragPosRef = useRef(160);

  // Galvanometer Needle Damped Physics
  const [galvNeedleAngle, setGalvNeedleAngle] = useState(0); // -45 deg to +45 deg

  // --------------------------------------------------------------------------
  // MODE 2: PIPE DROP EDDY CURRENTS DAMPING STATE
  // --------------------------------------------------------------------------
  const [pipeMaterialA, setPipeMaterialA] = useState('copper_solid');
  const [magnetStrength, setMagnetStrength] = useState('neodymium'); // 'neodymium' (strong) | 'ferrite' (medium)
  const [dropState, setDropState] = useState('ready'); // 'ready' | 'falling' | 'completed' | 'paused'
  const [slowMoFactor, setSlowMoFactor] = useState(1.0); // 1.0, 0.5, 0.25

  // Live Drop Coordinates (Tube length = 1.0 m)
  const [posA, setPosA] = useState(0); // 0 to 1.0 m
  const [posB, setPosB] = useState(0); // 0 to 1.0 m (plastic pipe)
  const [velA, setVelA] = useState(0); // m/s
  const [velB, setVelB] = useState(0); // m/s
  const [timeA, setTimeA] = useState(0); // s
  const [timeB, setTimeB] = useState(0); // s
  const [finalTimeA, setFinalTimeA] = useState(null);
  const [finalTimeB, setFinalTimeB] = useState(null);
  const [finalVelA, setFinalVelA] = useState(null);
  const [finalVelB, setFinalVelB] = useState(null);

  // Refs for smooth animation loops
  const animTimeRef = useRef(0);
  const dropSimRef = useRef({
    posA: 0,
    posB: 0,
    velA: 0,
    velB: 0,
    timeA: 0,
    timeB: 0,
    doneA: false,
    doneB: false,
  });

  // --------------------------------------------------------------------------
  // MODE 3: KCSE MASTERY STATE
  // --------------------------------------------------------------------------
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [scoreHistory, setScoreHistory] = useState({});

  // --------------------------------------------------------------------------
  // PHYSICAL DERIVATIONS: MODE 1 (COIL & MAGNET)
  // --------------------------------------------------------------------------
  const R_COIL = 0.03; // m (coil radius 3 cm)
  const MU_0 = 4 * Math.PI * 1e-7;
  const mu_r = hasIronCore ? 6.5 : 1.0;
  const dipoleMoment = facingPole === 'N' ? 1.8 : -1.8; // A*m^2

  // Distance in meters from coil center
  const distM = Math.max(0.02, magnetPosMm / 1000);
  const velMPerS = magnetVelocity / 1000; // m/s

  // Magnetic flux through one loop: Phi = B * A = [mu_0 * mu_r * m / (2*pi*(x^2+R^2)^1.5)] * (pi*R^2)
  const denom = Math.pow(distM * distM + R_COIL * R_COIL, 1.5);
  const fluxOneLoop = (MU_0 * mu_r * dipoleMoment * R_COIL * R_COIL) / (2 * denom); // Wb
  const totalFluxLinkage = fluxOneLoop * coilTurns; // Wb-turns

  // Spatial derivative dPhi/dx:
  const denom5 = Math.pow(distM * distM + R_COIL * R_COIL, 2.5);
  const dPhi_dx = (-3 * MU_0 * mu_r * dipoleMoment * R_COIL * R_COIL * distM) / (2 * denom5);

  // Faraday's Law with Lenz's Law: EMF = -N * (dPhi/dt) = -N * (dPhi/dx) * v
  const rawEmfV = -coilTurns * dPhi_dx * velMPerS; // Volts
  const emfMilliVolts = rawEmfV * 1000; // mV

  // Induced Current in coil (assuming coil resistance ~ 20 ohms)
  const coilResistance = 22; // ohms
  const inducedCurrentMicroAmps = (rawEmfV / coilResistance) * 1e6; // microamps

  // Induced Pole at Facing End of Solenoid:
  // If North approaches (dist decreasing, vel < 0): dPhi/dt > 0 -> EMF < 0 -> Coil opposes increase -> Facing end is NORTH
  // If North withdraws (dist increasing, vel > 0): dPhi/dt < 0 -> EMF > 0 -> Coil opposes decrease -> Facing end is SOUTH
  // If South approaches: Facing end is SOUTH
  // If South withdraws: Facing end is NORTH
  let inducedPole = 'None';
  let forceNature = 'Zero Force (Stationary)';
  let forceDirection = 'none'; // 'repel' | 'attract' | 'none'
  let opposingForceText = 'Zero mechanical resistance';

  if (Math.abs(magnetVelocity) > 2) {
    const isApproaching = magnetVelocity < 0;
    if (facingPole === 'N') {
      if (isApproaching) {
        inducedPole = 'N';
        forceNature = 'Repulsive Force (Opposition to Approach)';
        forceDirection = 'repel';
        opposingForceText = 'Coil pushes back against hand (work done against repulsion)';
      } else {
        inducedPole = 'S';
        forceNature = 'Attractive Force (Opposition to Withdrawal)';
        forceDirection = 'attract';
        opposingForceText = 'Coil pulls back on hand (work done against attraction)';
      }
    } else {
      // South facing
      if (isApproaching) {
        inducedPole = 'S';
        forceNature = 'Repulsive Force (Opposition to Approach)';
        forceDirection = 'repel';
        opposingForceText = 'Coil pushes back against hand (work done against repulsion)';
      } else {
        inducedPole = 'N';
        forceNature = 'Attractive Force (Opposition to Withdrawal)';
        forceDirection = 'attract';
        opposingForceText = 'Coil pulls back on hand (work done against attraction)';
      }
    }
  }

  // Smooth needle deflection towards target angle
  useEffect(() => {
    const targetAngle = Math.max(-42, Math.min(42, inducedCurrentMicroAmps * 0.45));
    const step = (targetAngle - galvNeedleAngle) * 0.25;
    if (Math.abs(step) > 0.05) {
      const timer = setTimeout(() => {
        setGalvNeedleAngle((prev) => prev + step);
      }, 16);
      return () => clearTimeout(timer);
    }
  }, [inducedCurrentMicroAmps, galvNeedleAngle]);

  // Handle Motion Speed Setting helper
  const getVelocityForAction = useCallback(
    (direction) => {
      const speedMap = { slow: 45, normal: 95, fast: 175 };
      const speed = speedMap[motionSpeedSetting] || 95;
      return direction === 'approach' ? -speed : speed;
    },
    [motionSpeedSetting]
  );

  // Continuous loop for Auto-Oscillate & Velocity Decay
  useEffect(() => {
    let animId;
    let lastT = performance.now();

    const loop = (now) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      if (activeTab === 'coil_induction') {
        if (autoOscillate) {
          animTimeRef.current += dt;
          // Sine wave oscillation between 50mm and 230mm
          const freq = motionSpeedSetting === 'fast' ? 1.4 : motionSpeedSetting === 'slow' ? 0.6 : 0.9;
          const center = 140;
          const amp = 85;
          const newPos = center + Math.sin(animTimeRef.current * freq * 2 * Math.PI) * amp;
          const newVel = Math.cos(animTimeRef.current * freq * 2 * Math.PI) * amp * (freq * 2 * Math.PI);
          setMagnetPosMm(newPos);
          setMagnetVelocity(newVel);
        } else if (!isDraggingMagnetRef.current) {
          // If a pulse motion was initiated, gently move and stop at boundary
          if (Math.abs(magnetVelocity) > 0.1) {
            setMagnetPosMm((prev) => {
              let next = prev + magnetVelocity * dt;
              if (next <= 45) {
                next = 45;
                setMagnetVelocity(0);
              } else if (next >= 255) {
                next = 255;
                setMagnetVelocity(0);
              }
              return next;
            });
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [activeTab, autoOscillate, magnetVelocity, motionSpeedSetting]);

  // Trigger brief approach / withdraw pulse
  const handlePulseMotion = (action) => {
    setAutoOscillate(false);
    if (action === 'stop') {
      setMagnetVelocity(0);
      return;
    }
    const vel = getVelocityForAction(action);
    setMagnetVelocity(vel);
    if (onTelemetry) {
      onTelemetry('magnet_motion_action', { action, velocity: vel, pole: facingPole });
    }
  };

  // Prediction check in Mode 1
  const handleCheckPrediction = (choice) => {
    setPredictChoice(choice);
    // User is asked: "When North approaches the coil, what force is felt by the hand?"
    const isCorrect = choice === 'repel';
    setPredictFeedback(isCorrect ? 'correct' : 'incorrect');
    if (onTelemetry) {
      onTelemetry('lenz_prediction_made', { choice, isCorrect });
    }
  };

  // --------------------------------------------------------------------------
  // PHYSICAL DERIVATIONS: MODE 2 (PIPE DROP & EDDY DAMPING)
  // --------------------------------------------------------------------------
  const TUBE_LENGTH_M = 1.0;
  const GRAVITY = 9.81;
  const MAGNET_MASS_KG = 0.028; // 28 grams neodymium magnet

  // Damping coefficient based on material & magnet strength
  const curMat = PIPE_MATERIALS[pipeMaterialA] || PIPE_MATERIALS.copper_solid;
  const strengthMult = magnetStrength === 'neodymium' ? 1.0 : 0.28;
  const dampingA = curMat.damping * strengthMult;

  // Terminal velocity for pipe A
  const terminalVelA = GRAVITY / (dampingA / MAGNET_MASS_KG);

  // Pipe Drop Physics Simulation Loop
  useEffect(() => {
    if (activeTab !== 'pipe_drop' || dropState !== 'falling') return;

    let animId;
    let lastT = performance.now();

    const loop = (now) => {
      const realDt = Math.min(0.04, (now - lastT) / 1000);
      lastT = now;
      const simDt = realDt * slowMoFactor;

      const s = dropSimRef.current;

      // Update Pipe A (Conductor)
      if (!s.doneA) {
        s.timeA += simDt;
        // Acceleration: dv/dt = g - (damping/m) * v
        const accelA = Math.max(0, GRAVITY - (dampingA / MAGNET_MASS_KG) * s.velA);
        s.velA += accelA * simDt;
        s.posA += s.velA * simDt;

        if (s.posA >= TUBE_LENGTH_M) {
          s.posA = TUBE_LENGTH_M;
          s.doneA = true;
          setFinalTimeA(s.timeA);
          setFinalVelA(s.velA);
        }
      }

      // Update Pipe B (Plastic / Insulator: pure free fall a = g)
      if (!s.doneB) {
        s.timeB += simDt;
        s.velB += GRAVITY * simDt;
        s.posB += s.velB * simDt;

        if (s.posB >= TUBE_LENGTH_M) {
          s.posB = TUBE_LENGTH_M;
          s.doneB = true;
          setFinalTimeB(s.timeB);
          setFinalVelB(s.velB);
        }
      }

      // Sync React state
      setPosA(s.posA);
      setVelA(s.velA);
      setTimeA(s.timeA);
      setPosB(s.posB);
      setVelB(s.velB);
      setTimeB(s.timeB);

      if (s.doneA && s.doneB) {
        setDropState('completed');
        if (onTelemetry) {
          onTelemetry('pipe_drop_completed', {
            material: pipeMaterialA,
            magnetStrength,
            timeA: s.timeA,
            timeB: s.timeB,
            velA: s.velA,
            velB: s.velB,
          });
        }
        return;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [activeTab, dropState, slowMoFactor, dampingA, pipeMaterialA, magnetStrength, onTelemetry]);

  const handleStartDrop = () => {
    if (dropState === 'ready' || dropState === 'completed') {
      dropSimRef.current = {
        posA: 0,
        posB: 0,
        velA: 0,
        velB: 0,
        timeA: 0,
        timeB: 0,
        doneA: false,
        doneB: false,
      };
      setPosA(0);
      setPosB(0);
      setVelA(0);
      setVelB(0);
      setTimeA(0);
      setTimeB(0);
      setFinalTimeA(null);
      setFinalTimeB(null);
      setFinalVelA(null);
      setFinalVelB(null);
      setDropState('falling');
      if (onTelemetry) {
        onTelemetry('pipe_drop_started', { material: pipeMaterialA, magnetStrength });
      }
    } else if (dropState === 'paused') {
      setDropState('falling');
    }
  };

  const handlePauseDrop = () => {
    if (dropState === 'falling') {
      setDropState('paused');
    }
  };

  const handleResetDrop = () => {
    dropSimRef.current = {
      posA: 0,
      posB: 0,
      velA: 0,
      velB: 0,
      timeA: 0,
      timeB: 0,
      doneA: false,
      doneB: false,
    };
    setPosA(0);
    setPosB(0);
    setVelA(0);
    setVelB(0);
    setTimeA(0);
    setTimeB(0);
    setFinalTimeA(null);
    setFinalTimeB(null);
    setFinalVelA(null);
    setFinalVelB(null);
    setDropState('ready');
  };

  // --------------------------------------------------------------------------
  // MASTER RESET HANDLER
  // --------------------------------------------------------------------------
  const handleMasterReset = () => {
    // Mode 1 resets
    setFacingPole('N');
    setCoilTurns(500);
    setHasIronCore(false);
    setMagnetPosMm(160);
    setMagnetVelocity(0);
    setAutoOscillate(false);
    setMotionSpeedSetting('normal');
    setPredictChoice(null);
    setPredictFeedback(null);
    setGalvNeedleAngle(0);

    // Mode 2 resets
    setPipeMaterialA('copper_solid');
    setMagnetStrength('neodymium');
    setSlowMoFactor(1.0);
    handleResetDrop();

    // Mode 3 resets
    setSelectedOption(null);
    setHasSubmitted(false);
    setShowHint(false);

    if (onTelemetry) {
      onTelemetry('sim_reset_defaults', { sim: 'lenzs_law_eddy_currents' });
    }
  };

  // --------------------------------------------------------------------------
  // KCSE QUIZ HANDLERS
  // --------------------------------------------------------------------------
  const currentProblem = KCSE_PROBLEMS[activeProblemIdx];
  const isAnswerCorrect = selectedOption === currentProblem.correct;

  const handleSubmitProblem = () => {
    if (!selectedOption) return;
    setHasSubmitted(true);
    const correct = selectedOption === currentProblem.correct;
    setScoreHistory((prev) => ({
      ...prev,
      [currentProblem.id]: correct,
    }));
    if (onTelemetry) {
      onTelemetry('kcse_problem_answered', {
        problemId: currentProblem.id,
        selectedOption,
        correct,
      });
    }
  };

  const handleNextProblem = () => {
    setActiveProblemIdx((prev) => (prev + 1) % KCSE_PROBLEMS.length);
    setSelectedOption(null);
    setHasSubmitted(false);
    setShowHint(false);
  };

  // --------------------------------------------------------------------------
  // DRAGGING MAGNET LOGIC (MODE 1 SVG INTERACTION)
  // --------------------------------------------------------------------------
  const handleMouseDownMagnet = (e) => {
    setAutoOscillate(false);
    isDraggingMagnetRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = magnetPosMm;
    lastDragTimeRef.current = performance.now();
    lastDragPosRef.current = magnetPosMm;
  };

  const handleMouseMoveMagnet = useCallback((e) => {
    if (!isDraggingMagnetRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    // 1px approx 0.6mm
    let newPos = dragStartPosRef.current + dx * 0.7;
    newPos = Math.max(45, Math.min(255, newPos));

    const now = performance.now();
    const dt = (now - lastDragTimeRef.current) / 1000;
    if (dt > 0.02) {
      const v = (newPos - lastDragPosRef.current) / dt;
      setMagnetVelocity(v);
      lastDragTimeRef.current = now;
      lastDragPosRef.current = newPos;
    }

    setMagnetPosMm(newPos);
  }, []);

  const handleMouseUpMagnet = useCallback(() => {
    if (isDraggingMagnetRef.current) {
      isDraggingMagnetRef.current = false;
      setTimeout(() => setMagnetVelocity(0), 100);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMoveMagnet);
    window.addEventListener('mouseup', handleMouseUpMagnet);
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveMagnet);
      window.removeEventListener('mouseup', handleMouseUpMagnet);
    };
  }, [handleMouseMoveMagnet, handleMouseUpMagnet]);

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-3xl p-3 sm:p-5 md:p-8 space-y-6 font-sans border border-slate-800 shadow-2xl">
      {/* ── HEADER & NAVIGATION ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-3.5 h-3.5 animate-pulse" /> Form 4 Physics • Topic 5
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Electromagnetic Induction & Lenz's Law
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            Lenz's Law & Eddy Currents Damping Explorer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            "The direction of the induced current always opposes the change in magnetic flux producing it."
            Explore solenoid coil repulsion/attraction forces and the dramatic terminal braking of magnets falling through conducting pipes!
          </p>
        </div>

        {/* Global Reset */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={handleMasterReset}
            className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700 flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Reset simulation parameters to default"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset Lab
          </button>
        </div>
      </div>

      {/* ── MODE SELECTION TABS ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('coil_induction')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'coil_induction'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/40 border border-cyan-400/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          Mode 1: Bar Magnet & Coil (Lenz's Law)
        </button>

        <button
          onClick={() => setActiveTab('pipe_drop')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'pipe_drop'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/40 border border-amber-400/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Mode 2: Pipe Drop Damping (Eddy Currents)
        </button>

        <button
          onClick={() => setActiveTab('kcse_mastery')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'kcse_mastery'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Mode 3: KCSE Mastery & Guided Inquiries
        </button>
      </div>

      {/* ==================================================================== */}
      {/* MODE 1: BAR MAGNET & COIL INDUCTION (LENZ'S LAW)                    */}
      {/* ==================================================================== */}
      {activeTab === 'coil_induction' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Visual & Control Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Interactive Coil Canvas & Visual Instrumentation */}
            <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Live Solenoid & Magnet Stage
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                  <span>Distance x: <b className="text-cyan-400">{magnetPosMm.toFixed(0)} mm</b></span>
                  <span>•</span>
                  <span>Velocity v: <b className={magnetVelocity < 0 ? 'text-emerald-400' : magnetVelocity > 0 ? 'text-amber-400' : 'text-slate-400'}>{magnetVelocity.toFixed(0)} mm/s</b></span>
                </div>
              </div>

              {/* Solenoid & Bar Magnet SVG Canvas */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-2 sm:p-4 overflow-hidden relative select-none">
                <svg viewBox="0 0 760 380" className="w-full h-auto drop-shadow-md">
                  <defs>
                    {/* Gradients */}
                    <linearGradient id="northPoleGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#b91c1c" />
                    </linearGradient>
                    <linearGradient id="southPoleGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#0369a1" />
                    </linearGradient>
                    <linearGradient id="ironCoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="50%" stopColor="#475569" />
                      <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                    <linearGradient id="copperWireGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="50%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Canvas Background Grid */}
                  <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.75" />
                  </pattern>
                  <rect width="760" height="380" fill="url(#gridPattern)" />

                  {/* Principal Axis Line */}
                  <line x1="30" y1="180" x2="730" y2="180" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 6" />
                  <text x="40" y="170" fill="#64748b" fontSize="10" fontFamily="monospace">Principal Magnetic Axis</text>

                  {/* Magnetic Field Lines around moving magnet */}
                  {/* Magnet position mapped: magnetPosMm in [40, 260] -> SVG X in [370, 610] */}
                  {(() => {
                    const magnetSvgX = 370 + ((magnetPosMm - 40) / 220) * 240;
                    const magnetW = 120;
                    const magnetH = 46;
                    const magnetY = 180 - magnetH / 2;

                    // Direction of field: out of North, into South
                    const leftIsNorth = facingPole === 'N';
                    const fieldColor = leftIsNorth ? '#ef4444' : '#0284c7';

                    return (
                      <g id="magnetFieldGroup">
                        {/* Dynamic Field Lines */}
                        <path
                          d={`M ${magnetSvgX + 20},${magnetY} C ${magnetSvgX - 40},${magnetY - 60} ${magnetSvgX - 100},${magnetY - 20} ${magnetSvgX - 70},180 C ${magnetSvgX - 100},${magnetY + magnetH + 20} ${magnetSvgX - 40},${magnetY + magnetH + 60} ${magnetSvgX + 20},${magnetY + magnetH}`}
                          fill="none"
                          stroke={fieldColor}
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                          opacity={0.45}
                        />
                        <path
                          d={`M ${magnetSvgX + 60},${magnetY} C ${magnetSvgX},${magnetY - 90} ${magnetSvgX - 150},${magnetY - 50} ${magnetSvgX - 120},180 C ${magnetSvgX - 150},${magnetY + magnetH + 50} ${magnetSvgX},${magnetY + magnetH + 90} ${magnetSvgX + 60},${magnetY + magnetH}`}
                          fill="none"
                          stroke={fieldColor}
                          strokeWidth="1.2"
                          strokeDasharray="5 4"
                          opacity={0.35}
                        />

                        {/* Moving Bar Magnet */}
                        <g
                          style={{ cursor: 'ew-resize' }}
                          onMouseDown={handleMouseDownMagnet}
                          id="barMagnet"
                        >
                          {/* Outer Magnet Body */}
                          <rect
                            x={magnetSvgX}
                            y={magnetY}
                            width={magnetW}
                            height={magnetH}
                            rx="6"
                            fill="#1e293b"
                            stroke="#475569"
                            strokeWidth="1.5"
                          />

                          {/* Left Half Pole */}
                          <rect
                            x={magnetSvgX}
                            y={magnetY}
                            width={magnetW / 2}
                            height={magnetH}
                            rx="6"
                            fill={leftIsNorth ? 'url(#northPoleGrad)' : 'url(#southPoleGrad)'}
                          />
                          {/* Right Half Pole */}
                          <rect
                            x={magnetSvgX + magnetW / 2}
                            y={magnetY}
                            width={magnetW / 2}
                            height={magnetH}
                            rx="6"
                            fill={leftIsNorth ? 'url(#southPoleGrad)' : 'url(#northPoleGrad)'}
                          />

                          {/* Divider line between poles */}
                          <line
                            x1={magnetSvgX + magnetW / 2}
                            y1={magnetY}
                            x2={magnetSvgX + magnetW / 2}
                            y2={magnetY + magnetH}
                            stroke="#0f172a"
                            strokeWidth="2"
                          />

                          {/* Pole Text Labels */}
                          <text
                            x={magnetSvgX + magnetW / 4}
                            y={186}
                            fill="#ffffff"
                            fontSize="18"
                            fontWeight="900"
                            textAnchor="middle"
                          >
                            {leftIsNorth ? 'N' : 'S'}
                          </text>
                          <text
                            x={magnetSvgX + (3 * magnetW) / 4}
                            y={186}
                            fill="#ffffff"
                            fontSize="18"
                            fontWeight="900"
                            textAnchor="middle"
                          >
                            {leftIsNorth ? 'S' : 'N'}
                          </text>

                          {/* Grip helper dots */}
                          <circle cx={magnetSvgX + magnetW / 2} cy={165} r="2" fill="#cbd5e1" opacity="0.7" />
                          <circle cx={magnetSvgX + magnetW / 2} cy={180} r="2" fill="#cbd5e1" opacity="0.7" />
                          <circle cx={magnetSvgX + magnetW / 2} cy={195} r="2" fill="#cbd5e1" opacity="0.7" />
                        </g>

                        {/* Hand Motion Velocity Vector Arrow */}
                        {Math.abs(magnetVelocity) > 2 && (
                          <g id="velocityVector">
                            <line
                              x1={magnetSvgX + magnetW / 2}
                              y1={115}
                              x2={magnetSvgX + magnetW / 2 + (magnetVelocity < 0 ? -60 : 60)}
                              y2={115}
                              stroke="#22c55e"
                              strokeWidth="3.5"
                            />
                            <polygon
                              points={
                                magnetVelocity < 0
                                  ? `${magnetSvgX + magnetW / 2 - 60},115 ${magnetSvgX + magnetW / 2 - 48},109 ${magnetSvgX + magnetW / 2 - 48},121`
                                  : `${magnetSvgX + magnetW / 2 + 60},115 ${magnetSvgX + magnetW / 2 + 48},109 ${magnetSvgX + magnetW / 2 + 48},121`
                              }
                              fill="#22c55e"
                            />
                            <text
                              x={magnetSvgX + magnetW / 2}
                              y={102}
                              fill="#22c55e"
                              fontSize="11"
                              fontWeight="800"
                              textAnchor="middle"
                            >
                              Velocity v ({magnetVelocity < 0 ? '← Approaching' : '→ Withdrawing'})
                            </text>
                          </g>
                        )}

                        {/* Opposing Magnetic Force Vector on Magnet (Lenz's Law Newton Pair) */}
                        {forceDirection !== 'none' && (
                          <g id="opposingForceVector">
                            <line
                              x1={magnetSvgX}
                              y1={245}
                              x2={forceDirection === 'repel' ? magnetSvgX + 65 : magnetSvgX - 65}
                              y2={245}
                              stroke="#f59e0b"
                              strokeWidth="3.5"
                            />
                            <polygon
                              points={
                                forceDirection === 'repel'
                                  ? `${magnetSvgX + 65},245 ${magnetSvgX + 53},239 ${magnetSvgX + 53},251`
                                  : `${magnetSvgX - 65},245 ${magnetSvgX - 53},239 ${magnetSvgX - 53},251`
                              }
                              fill="#f59e0b"
                            />
                            <text
                              x={magnetSvgX + (forceDirection === 'repel' ? 30 : -30)}
                              y={262}
                              fill="#f59e0b"
                              fontSize="11"
                              fontWeight="800"
                              textAnchor="middle"
                            >
                              {forceDirection === 'repel' ? 'F_repulsion (← Hand Pushes)' : 'F_attraction (→ Hand Pulls)'}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })()}

                  {/* Solenoid Coil Body (X = 90 to 270, Y = 130 to 230) */}
                  <g id="solenoidCoil">
                    {/* Soft Iron Core (if enabled) */}
                    {hasIronCore && (
                      <rect
                        x="95"
                        y="145"
                        width="170"
                        height="70"
                        rx="4"
                        fill="url(#ironCoreGrad)"
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Coil Former Tube (Transparent / Acrylic) */}
                    <rect
                      x="90"
                      y="135"
                      width="180"
                      height="90"
                      rx="8"
                      fill="#0f172a"
                      fillOpacity="0.75"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />

                    {/* Copper Wire Helical Loops */}
                    {[110, 130, 150, 170, 190, 210, 230, 250].map((loopX, i) => (
                      <g key={`loop_${i}`}>
                        {/* Front Loop Arch */}
                        <path
                          d={`M ${loopX},135 C ${loopX - 8},120 ${loopX + 16},120 ${loopX + 12},135 L ${loopX + 12},225 C ${loopX + 16},240 ${loopX - 8},240 ${loopX},225 Z`}
                          fill="none"
                          stroke="url(#copperWireGrad)"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                        {/* Induced current flow dynamic direction arrows */}
                        {inducedPole !== 'None' && i % 2 === 0 && (
                          <polygon
                            points={
                              inducedPole === 'N'
                                ? `${loopX + 6},170 ${loopX + 12},180 ${loopX},180` // Upward current (CCW looking into coil)
                                : `${loopX + 6},190 ${loopX + 12},180 ${loopX},180` // Downward current (CW)
                            }
                            fill="#38bdf8"
                          />
                        )}
                      </g>
                    ))}

                    {/* Induced Polarity Badge at Right Entrance of Coil */}
                    {inducedPole !== 'None' ? (
                      <g id="inducedPoleBadge" filter="url(#glow)">
                        <circle cx="280" cy="180" r="20" fill={inducedPole === 'N' ? '#ef4444' : '#0284c7'} />
                        <text
                          x="280"
                          y="187"
                          fill="#ffffff"
                          fontSize="20"
                          fontWeight="900"
                          textAnchor="middle"
                        >
                          {inducedPole}
                        </text>
                        <text
                          x="280"
                          y="112"
                          fill={inducedPole === 'N' ? '#f87171' : '#38bdf8'}
                          fontSize="11"
                          fontWeight="800"
                          textAnchor="middle"
                        >
                          Induced {inducedPole === 'N' ? 'NORTH' : 'SOUTH'} Pole
                        </text>
                        <line x1="280" y1="120" x2="280" y2="155" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
                      </g>
                    ) : (
                      <text x="280" y="185" fill="#64748b" fontSize="11" fontWeight="700" textAnchor="middle">
                        [ 0 ]
                      </text>
                    )}

                    {/* Solenoid Label */}
                    <text x="180" y="115" fill="#38bdf8" fontSize="13" fontWeight="800" textAnchor="middle">
                      Solenoid Coil ({coilTurns} Turns)
                    </text>
                    <text x="180" y="250" fill="#94a3b8" fontSize="10" textAnchor="middle">
                      {hasIronCore ? 'Soft Iron Core (μ_r ≈ 6.5)' : 'Air Core (μ_r = 1.0)'}
                    </text>
                  </g>

                  {/* Circuit Leads Connecting to Center-Zero Galvanometer */}
                  <path
                    d="M 110,225 L 110,310 L 150,310"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M 250,225 L 250,310 L 210,310"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                  />

                  {/* Center-Zero Galvanometer (Center at X = 180, Y = 320) */}
                  <g id="galvanometerGroup">
                    {/* Outer Instrument Ring */}
                    <circle cx="180" cy="320" r="42" fill="#0f172a" stroke="#22c55e" strokeWidth="2.5" />
                    {/* Dial Face Arc */}
                    <path
                      d="M 150,305 A 35 35 0 0 1 210,305"
                      fill="none"
                      stroke="#475569"
                      strokeWidth="2"
                    />
                    {/* Scale Markings */}
                    <line x1="180" y1="285" x2="180" y2="292" stroke="#22c55e" strokeWidth="2" /> {/* 0 */}
                    <line x1="160" y1="290" x2="164" y2="296" stroke="#94a3b8" strokeWidth="1.5" /> {/* - */}
                    <line x1="200" y1="290" x2="196" y2="296" stroke="#94a3b8" strokeWidth="1.5" /> {/* + */}
                    <text x="180" y="303" fill="#22c55e" fontSize="9" fontWeight="800" textAnchor="middle">0</text>
                    <text x="156" y="301" fill="#94a3b8" fontSize="8" textAnchor="middle">-G</text>
                    <text x="204" y="301" fill="#94a3b8" fontSize="8" textAnchor="middle">+G</text>

                    {/* Pivoting Needle */}
                    <g transform={`rotate(${galvNeedleAngle}, 180, 320)`}>
                      <line x1="180" y1="320" x2="180" y2="286" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="180" cy="320" r="4.5" fill="#f8fafc" />
                    </g>

                    <text x="180" y="342" fill="#22c55e" fontSize="11" fontWeight="900" textAnchor="middle">G</text>
                    <text x="180" y="355" fill="#64748b" fontSize="8" textAnchor="middle">Center-Zero Galvanometer</text>
                  </g>

                  {/* Right Hand Grip Rule Quick Graphic Indicator (Bottom Right) */}
                  <g transform="translate(540, 290)">
                    <rect x="0" y="0" width="200" height="75" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                    <text x="100" y="20" fill="#38bdf8" fontSize="10" fontWeight="800" textAnchor="middle">
                      RIGHT-HAND GRIP RULE
                    </text>
                    <text x="15" y="40" fill="#cbd5e1" fontSize="9">
                      • Thumb points to induced North [N]
                    </text>
                    <text x="15" y="55" fill="#cbd5e1" fontSize="9">
                      • Fingers curl with induced current
                    </text>
                    <text x="15" y="68" fill="#22c55e" fontSize="9" fontWeight="700">
                      Opposition to change = Lenz's Law!
                    </text>
                  </g>
                </svg>
              </div>

              {/* Real-time Dynamic Status Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                  inducedPole !== 'None'
                    ? forceDirection === 'repel'
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                      : 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                      inducedPole === 'N'
                        ? 'bg-red-500 text-white'
                        : inducedPole === 'S'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {inducedPole !== 'None' ? inducedPole : '—'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{forceNature}</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">{opposingForceText}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                    Induced E.M.F. (ε)
                  </span>
                  <span
                    className={`text-base sm:text-lg font-mono font-bold ${
                      Math.abs(emfMilliVolts) > 0.5 ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  >
                    {emfMilliVolts > 0 ? `+${emfMilliVolts.toFixed(1)}` : emfMilliVolts.toFixed(1)} mV
                  </span>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Interactive Controls & Live Physics Inspector */}
            <div className="lg:col-span-4 space-y-4">
              {/* Controls Card */}
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-cyan-400" /> Experiment Controls
                </h3>

                {/* Magnet Facing Pole Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Magnet Pole Facing Coil:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFacingPole('N')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        facingPole === 'N'
                          ? 'bg-red-600 text-white shadow-md shadow-red-950/50 border border-red-400'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-white" />
                      North (N) Pole
                    </button>
                    <button
                      onClick={() => setFacingPole('S')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        facingPole === 'S'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50 border border-blue-400'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-white" />
                      South (S) Pole
                    </button>
                  </div>
                </div>

                {/* Hand Action Buttons (Approach vs Withdraw vs Oscillate) */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Applied Motion Action:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => handlePulseMotion('approach')}
                      disabled={autoOscillate}
                      className="py-2.5 px-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border border-slate-700 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Approach (In)
                    </button>
                    <button
                      onClick={() => handlePulseMotion('stop')}
                      className="py-2.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border border-slate-700 active:scale-95 cursor-pointer"
                    >
                      <Pause className="w-4 h-4" />
                      Hold (v = 0)
                    </button>
                    <button
                      onClick={() => handlePulseMotion('withdraw')}
                      disabled={autoOscillate}
                      className="py-2.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border border-slate-700 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Withdraw (Out)
                    </button>
                  </div>

                  {/* Auto-Oscillate Toggle */}
                  <button
                    onClick={() => {
                      setAutoOscillate(!autoOscillate);
                      if (!autoOscillate) setMagnetVelocity(0);
                    }}
                    className={`w-full mt-2 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      autoOscillate
                        ? 'bg-cyan-600 text-white shadow-md border border-cyan-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${autoOscillate ? 'animate-spin' : ''}`} />
                    {autoOscillate ? 'Oscillating (Click to Stop)' : 'Continuous Back & Forth Motion'}
                  </button>
                </div>

                {/* Speed & Number of Turns */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">Motion Speed:</span>
                    <div className="flex items-center gap-1">
                      {['slow', 'normal', 'fast'].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setMotionSpeedSetting(spd)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition cursor-pointer ${
                            motionSpeedSetting === spd
                              ? 'bg-cyan-500 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {spd}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">Coil Turns (N):</span>
                    <div className="flex items-center gap-1">
                      {[200, 500, 1000].map((turns) => (
                        <button
                          key={turns}
                          onClick={() => setCoilTurns(turns)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            coilTurns === turns
                              ? 'bg-cyan-500 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {turns}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Iron Core Toggle */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-300 font-semibold">Soft Iron Core:</span>
                    <button
                      onClick={() => setHasIronCore(!hasIronCore)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        hasIronCore
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {hasIronCore ? 'Inserted (μ_r=6.5)' : 'Removed (Air)'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Predict -> Observe Loop Mini Challenge */}
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Quick Lenz Predict Challenge
                </div>
                <p className="text-xs text-slate-300">
                  Predict: When a <b>North pole approaches</b> the coil, what force does the hand feel?
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCheckPrediction('repel')}
                    className={`p-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      predictChoice === 'repel'
                        ? 'bg-emerald-900/50 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Repulsion (Resists Push)
                  </button>
                  <button
                    onClick={() => handleCheckPrediction('attract')}
                    className={`p-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      predictChoice === 'attract'
                        ? 'bg-rose-900/50 border-rose-500 text-rose-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Attraction (Pulls In)
                  </button>
                </div>

                {predictFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs leading-relaxed ${
                      predictFeedback === 'correct'
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {predictFeedback === 'correct' ? (
                      <span className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <b>Correct!</b> Lenz's Law mandates opposition. The coil creates a North pole to repel the approaching North pole, requiring positive mechanical work.
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-start gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>
                          <b>Not quite.</b> If it attracted, the magnet would accelerate on its own creating free energy! By conservation of energy, the coil must repel to oppose the approach.
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Deep Pedagogical Explanation & Energy Conservation Proof */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-3">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4" /> Why does Nature oppose the motion? (Conservation of Energy)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1">
                <span className="font-bold text-white block">1. The Trigger (Flux Change)</span>
                <p>
                  Moving the magnet changes the magnetic flux linkage Φ passing through the solenoid:
                </p>
                <div className="font-mono text-cyan-400 font-bold bg-slate-900 px-2 py-1 rounded text-[11px] text-center">
                  dΦ/dt = (dΦ/dx) · v
                </div>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1">
                <span className="font-bold text-white block">2. Faraday & Lenz's Law</span>
                <p>
                  An electromotive force is induced according to:
                </p>
                <div className="font-mono text-cyan-400 font-bold bg-slate-900 px-2 py-1 rounded text-[11px] text-center">
                  ε = -N · (ΔΦ / Δt)
                </div>
                <p className="text-[11px] text-slate-400">
                  The negative sign encapsulates Lenz's Law: induced current circulates to oppose the flux change.
                </p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1">
                <span className="font-bold text-white block">3. Mechanical Work = Electrical Energy</span>
                <p>
                  The experimenter's hand pushes against the repulsive force (or pulls against attraction). Mechanical work done (W = F · d) is exactly transformed into electrical energy (ε · I · t) and dissipated as Joule heat (I²R)!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 2: PIPE DROP DAMPING (EDDY CURRENTS)                           */}
      {/* ==================================================================== */}
      {activeTab === 'pipe_drop' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Visual Dual Pipe Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Dual Falling Pipe Visualizer */}
            <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Dual Magnet Drop Comparison Stage (1.0 Metre)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Slow-Mo:</span>
                  {[1.0, 0.5, 0.25].map((factor) => (
                    <button
                      key={factor}
                      onClick={() => setSlowMoFactor(factor)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                        slowMoFactor === factor
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {factor}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Dual Pipe SVG Cutaway Canvas */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-2 sm:p-4 overflow-hidden relative select-none">
                <svg viewBox="0 0 720 460" className="w-full h-auto">
                  <defs>
                    {/* Metallic Copper Pipe Gradient */}
                    <linearGradient id="pipeCopperGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#b45309" />
                      <stop offset="40%" stopColor="#f97316" />
                      <stop offset="60%" stopColor="#fb923c" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                    {/* Acrylic / Plastic Pipe Gradient */}
                    <linearGradient id="pipePlasticGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#1e293b" stopOpacity="0.4" />
                    </linearGradient>
                    {/* Eddy Current Pulsing Glow */}
                    <filter id="eddyGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Height Ruler on Left (Y = 60 to 400) -> 340px = 1.0 m */}
                  <g id="heightRuler" transform="translate(45, 60)">
                    <line x1="0" y1="0" x2="0" y2="340" stroke="#475569" strokeWidth="2" />
                    {[0, 0.25, 0.5, 0.75, 1.0].map((h, idx) => {
                      const yPx = h * 340;
                      return (
                        <g key={`ruler_${idx}`}>
                          <line x1="-8" y1={yPx} x2="8" y2={yPx} stroke="#64748b" strokeWidth="1.5" />
                          <text x="-14" y={yPx + 4} fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">
                            {h.toFixed(2)} m
                          </text>
                        </g>
                      );
                    })}
                  </g>

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* TUBE A: CONDUCTING METAL PIPE (X = 140 to 300)             */}
                  {/* ────────────────────────────────────────────────────────── */}
                  <g id="pipeA_group">
                    {/* Header Label */}
                    <text x="220" y="35" fill="#f97316" fontSize="14" fontWeight="800" textAnchor="middle">
                      Tube A: {curMat.name}
                    </text>
                    <text x="220" y="50" fill="#94a3b8" fontSize="10" textAnchor="middle">
                      Conductive Wall (Eddy Currents Active)
                    </text>

                    {/* Outer Pipe Envelope */}
                    <rect
                      x="170"
                      y="60"
                      width="100"
                      height="340"
                      rx="8"
                      fill="url(#pipeCopperGrad)"
                      fillOpacity="0.85"
                      stroke="#ea580c"
                      strokeWidth="2"
                    />

                    {/* Transparent Cutaway Center Slice to reveal inside magnet */}
                    <rect
                      x="185"
                      y="60"
                      width="70"
                      height="340"
                      fill="#0a0f1d"
                      fillOpacity="0.8"
                    />

                    {/* Slit simulation if slotted copper */}
                    {curMat.isSlotted && (
                      <g id="slottedSlitVisual">
                        <line x1="220" y1="60" x2="220" y2="400" stroke="#020617" strokeWidth="6" />
                        <line x1="220" y1="60" x2="220" y2="400" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 4" />
                        <text x="220" y="420" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">
                          [ Longitudinal Air Slit Interrupts Loops ]
                        </text>
                      </g>
                    )}

                    {/* Falling Magnet in Tube A */}
                    {(() => {
                      const magnetY = 60 + (posA / TUBE_LENGTH_M) * 340;
                      const isInside = posA > 0.02 && posA < 0.98;

                      return (
                        <g id="magnetA">
                          {/* Circulating Eddy Current Rings in Copper Wall */}
                          {isInside && dropState === 'falling' && (
                            <g id="eddyCurrentRings" filter="url(#eddyGlow)">
                              {/* Ring Below Approaching Magnet: CCW repulsion */}
                              <ellipse
                                cx="220"
                                cy={magnetY + 28}
                                rx="45"
                                ry="10"
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth={curMat.isSlotted ? '2' : '3.5'}
                                strokeDasharray={curMat.isSlotted ? '6 6' : 'none'}
                              />
                              <polygon
                                points={`265,${magnetY + 28} 257,${magnetY + 24} 257,${magnetY + 32}`}
                                fill="#38bdf8"
                              />
                              <text x="280" y={magnetY + 32} fill="#38bdf8" fontSize="9" fontWeight="700">
                                {curMat.isSlotted ? 'Broken Eddy' : '↑ Repulsive Eddy'}
                              </text>

                              {/* Ring Above Departing Magnet: CW attraction */}
                              <ellipse
                                cx="220"
                                cy={magnetY - 28}
                                rx="45"
                                ry="10"
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth={curMat.isSlotted ? '2' : '3.5'}
                                strokeDasharray={curMat.isSlotted ? '6 6' : 'none'}
                              />
                              <polygon
                                points={`175,${magnetY - 28} 183,${magnetY - 32} 183,${magnetY - 24}`}
                                fill="#f59e0b"
                              />
                              <text x="280" y={magnetY - 24} fill="#f59e0b" fontSize="9" fontWeight="700">
                                {curMat.isSlotted ? 'Broken Eddy' : '↑ Attractive Eddy'}
                              </text>
                            </g>
                          )}

                          {/* Magnet Body */}
                          <rect
                            x="195"
                            y={magnetY - 18}
                            width="50"
                            height="18"
                            rx="3"
                            fill="#0284c7"
                          />
                          <text x="220" y={magnetY - 5} fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle">
                            S
                          </text>

                          <rect
                            x="195"
                            y={magnetY}
                            width="50"
                            height="18"
                            rx="3"
                            fill="#ef4444"
                          />
                          <text x="220" y={magnetY + 13} fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle">
                            N
                          </text>

                          {/* Dynamic Force Arrows on Magnet A */}
                          {isInside && (
                            <g id="forceVectorsA">
                              {/* Downward Gravity Arrow */}
                              <line x1="220" y1={magnetY + 18} x2="220" y2={magnetY + 45} stroke="#38bdf8" strokeWidth="2.5" />
                              <polygon points={`220,${magnetY + 45} 216,${magnetY + 37} 224,${magnetY + 37}`} fill="#38bdf8" />

                              {/* Upward Magnetic Drag Arrow */}
                              <line x1="220" y1={magnetY - 18} x2="220" y2={magnetY - 18 - Math.min(35, velA * 30)} stroke="#ef4444" strokeWidth="3" />
                              <polygon
                                points={`220,${magnetY - 18 - Math.min(35, velA * 30)} 216,${magnetY - 10 - Math.min(35, velA * 30)} 224,${magnetY - 10 - Math.min(35, velA * 30)}`}
                                fill="#ef4444"
                              />
                            </g>
                          )}
                        </g>
                      );
                    })()}
                  </g>

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* TUBE B: INSULATING PLASTIC PIPE (X = 420 to 580)           */}
                  {/* ────────────────────────────────────────────────────────── */}
                  <g id="pipeB_group">
                    {/* Header Label */}
                    <text x="500" y="35" fill="#38bdf8" fontSize="14" fontWeight="800" textAnchor="middle">
                      Tube B: Plastic / PVC (Insulator)
                    </text>
                    <text x="500" y="50" fill="#94a3b8" fontSize="10" textAnchor="middle">
                      σ = 0 S/m (Zero Eddy Currents • Free Fall)
                    </text>

                    {/* Outer Transparent Acrylic Envelope */}
                    <rect
                      x="450"
                      y="60"
                      width="100"
                      height="340"
                      rx="8"
                      fill="url(#pipePlasticGrad)"
                      stroke="#0284c7"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />

                    {/* Falling Magnet in Tube B */}
                    {(() => {
                      const magnetY_B = 60 + (posB / TUBE_LENGTH_M) * 340;

                      return (
                        <g id="magnetB">
                          {/* Magnet Body */}
                          <rect
                            x="475"
                            y={magnetY_B - 18}
                            width="50"
                            height="18"
                            rx="3"
                            fill="#0284c7"
                          />
                          <text x="500" y={magnetY_B - 5} fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle">
                            S
                          </text>

                          <rect
                            x="475"
                            y={magnetY_B}
                            width="50"
                            height="18"
                            rx="3"
                            fill="#ef4444"
                          />
                          <text x="500" y={magnetY_B + 13} fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle">
                            N
                          </text>

                          {/* Free-Fall Downward Gravity Vector */}
                          <line x1="500" y1={magnetY_B + 18} x2="500" y2={magnetY_B + 55} stroke="#22c55e" strokeWidth="3" />
                          <polygon points={`500,${magnetY_B + 55} 496,${magnetY_B + 45} 504,${magnetY_B + 45}`} fill="#22c55e" />
                          <text x="515" y={magnetY_B + 45} fill="#22c55e" fontSize="9" fontWeight="700">
                            a = g (9.8 m/s²)
                          </text>
                        </g>
                      );
                    })()}
                  </g>

                  {/* Exit Photogate Sensor Line at Bottom (Y = 400) */}
                  <line x1="140" y1="400" x2="580" y2="400" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="360" y="394" fill="#ef4444" fontSize="10" fontWeight="700" textAnchor="middle">
                    Photogate Finish Line (1.00 m)
                  </text>
                </svg>
              </div>

              {/* Real-time Synchronized Digital Telemetry Dashboard */}
              <div className="grid grid-cols-2 gap-4">
                {/* Gauge Tube A */}
                <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Tube A ({curMat.name})</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      v_t: <b>{terminalVelA.toFixed(2)} m/s</b>
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Fall Time</span>
                      <span className="text-xl sm:text-2xl font-black font-mono text-white">
                        {finalTimeA !== null ? `${finalTimeA.toFixed(3)} s` : `${timeA.toFixed(3)} s`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Velocity</span>
                      <span className="text-lg font-bold font-mono text-amber-400">
                        {finalVelA !== null ? `${finalVelA.toFixed(2)} m/s` : `${velA.toFixed(2)} m/s`}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-75"
                      style={{ width: `${(posA / TUBE_LENGTH_M) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Gauge Tube B */}
                <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">Tube B (Plastic Insulator)</span>
                    <span className="text-[11px] font-mono text-slate-400">Free Fall (g)</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Fall Time</span>
                      <span className="text-xl sm:text-2xl font-black font-mono text-white">
                        {finalTimeB !== null ? `${finalTimeB.toFixed(3)} s` : `${timeB.toFixed(3)} s`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Velocity</span>
                      <span className="text-lg font-bold font-mono text-cyan-400">
                        {finalVelB !== null ? `${finalVelB.toFixed(2)} m/s` : `${velB.toFixed(2)} m/s`}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full transition-all duration-75"
                      style={{ width: `${(posB / TUBE_LENGTH_M) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Drop Control Station & Comparison Analysis */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-400" /> Drop Station Controls
                </h3>

                {/* Big Trigger Action Button */}
                <div className="grid grid-cols-2 gap-2">
                  {dropState === 'falling' ? (
                    <button
                      onClick={handlePauseDrop}
                      className="py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <Pause className="w-4 h-4" /> Pause
                    </button>
                  ) : (
                    <button
                      onClick={handleStartDrop}
                      className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      {dropState === 'ready' ? 'Release Magnets' : dropState === 'paused' ? 'Resume Drop' : 'Drop Again'}
                    </button>
                  )}

                  <button
                    onClick={handleResetDrop}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset To Top
                  </button>
                </div>

                {/* Tube A Material Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Select Tube A Material:
                  </label>
                  <div className="space-y-1.5">
                    {Object.values(PIPE_MATERIALS).map((mat) => (
                      <button
                        key={mat.id}
                        onClick={() => {
                          setPipeMaterialA(mat.id);
                          handleResetDrop();
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                          pipeMaterialA === mat.id
                            ? 'bg-amber-950/60 border-amber-500 text-white shadow-sm'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{mat.name}</span>
                          <span className="text-[10px] text-amber-400 font-mono">
                            {mat.isSlotted ? 'Broken Loops' : 'Solid Loop'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{mat.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Magnet Strength Selector */}
                <div className="pt-2 border-t border-slate-800">
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Magnet Strength:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setMagnetStrength('neodymium');
                        handleResetDrop();
                      }}
                      className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        magnetStrength === 'neodymium'
                          ? 'bg-cyan-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Neodymium (N52 Strong)
                    </button>
                    <button
                      onClick={() => {
                        setMagnetStrength('ferrite');
                        handleResetDrop();
                      }}
                      className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        magnetStrength === 'ferrite'
                          ? 'bg-cyan-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Ferrite (Standard)
                    </button>
                  </div>
                </div>
              </div>

              {/* Real World Applications Card */}
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Shield className="w-4 h-4" /> Real-World Engineering Uses
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                    <b className="text-white">Bullet Train & Rollercoaster Brakes:</b>
                    <p className="text-slate-400 mt-0.5">
                      Copper fins pass between strong electromagnets. Frictionless magnetic drag stops high-speed trains without brake pad wear!
                    </p>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                    <b className="text-white">Galvanometer Deadbeat Damping:</b>
                    <p className="text-slate-400 mt-0.5">
                      The coil is wound on an aluminum former. Eddy currents rapidly damp needle oscillations so it settles on the reading immediately.
                    </p>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                    <b className="text-white">Induction Cooktops:</b>
                    <p className="text-slate-400 mt-0.5">
                      High-frequency changing fields induce massive eddy currents directly inside the cooking pan, generating instant $I^2 R$ heat!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 3: KCSE MASTERY & GUIDED INQUIRIES                             */}
      {/* ==================================================================== */}
      {activeTab === 'kcse_mastery' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                KCSE Physics Revision & Form 4 Exam Prep
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                Electromagnetic Induction & Eddy Currents Mastery
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              {KCSE_PROBLEMS.map((prob, idx) => (
                <button
                  key={prob.id}
                  onClick={() => {
                    setActiveProblemIdx(idx);
                    setSelectedOption(null);
                    setHasSubmitted(false);
                    setShowHint(false);
                  }}
                  className={`w-8 h-8 rounded-xl font-bold text-xs transition cursor-pointer ${
                    activeProblemIdx === idx
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : scoreHistory[prob.id] === true
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : scoreHistory[prob.id] === false
                      ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active Problem Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
                {currentProblem.title}
              </span>
              <p className="text-xs sm:text-sm text-slate-400 italic bg-slate-950 p-3 rounded-xl border border-slate-800/80 mb-3">
                Scenario: {currentProblem.scenario}
              </p>
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                {currentProblem.question}
              </h4>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5">
              {currentProblem.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrect = opt.id === currentProblem.correct;
                let optStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-600';

                if (hasSubmitted) {
                  if (isCorrect) {
                    optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                  } else if (isSelected && !isCorrect) {
                    optStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                  } else {
                    optStyle = 'bg-slate-950/50 border-slate-800 text-slate-500';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-cyan-950/70 border-cyan-400 text-white shadow-sm';
                }

                return (
                  <button
                    key={opt.id}
                    disabled={hasSubmitted}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Bar (Hint, Submit, Next) */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                {showHint ? 'Hide KCSE Hint' : 'View KCSE Examiner Hint'}
              </button>

              <div className="flex items-center gap-2">
                {!hasSubmitted ? (
                  <button
                    onClick={handleSubmitProblem}
                    disabled={!selectedOption}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextProblem}
                    className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    Next Question <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-300 leading-relaxed animate-in fade-in duration-200">
                <b>Examiner Hint:</b> {currentProblem.hint}
              </div>
            )}

            {/* Solution & Explanation Box */}
            {hasSubmitted && (
              <div
                className={`p-4 rounded-xl border space-y-2 animate-in fade-in duration-200 ${
                  isAnswerCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isAnswerCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Correct! Full KCSE Credit Awarded.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>Not quite. Correct Option is {currentProblem.correct}.</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed pl-7">
                  {currentProblem.explanation}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
