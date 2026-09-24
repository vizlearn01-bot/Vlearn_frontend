import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Zap,
  Flame,
  Activity,
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Info,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldAlert,
  Layers,
  ArrowRight,
  Sliders
} from 'lucide-react';

/**
 * 5 Canonical Pathway Stations for deep anatomical inspection
 */
const PATHWAY_STATIONS = [
  {
    id: 'station_1',
    num: 1,
    title: 'Cutaneous Nociceptors',
    sub: 'Skin Pain & Thermal Receptors',
    badge: 'Receptor',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    dotColor: '#f43f5e',
    coords: { x: 420, y: 508 },
    summary: 'Free dendritic nerve endings located in dermal papillae sensitive to noxious thermal (>43°C) and mechanical injury.',
    details: [
      'Nociceptors convert noxious heat or mechanical pressure into electrical generator potentials.',
      'When threshold (-55 mV) is reached, voltage-gated Na⁺ channels open, firing all-or-nothing action potentials.',
      'Unlike light touch receptors (Meissner corpuscles), nociceptors exhibit little to no adaptation to preserve tissue protection.'
    ],
    kcseTip: 'In KCSE exams, always define a receptor as a specialized cell or sensory nerve ending that detects an environmental stimulus and transducers it into an electrical nerve impulse.'
  },
  {
    id: 'station_2',
    num: 2,
    title: 'Sensory Neurone & DRG',
    sub: 'Afferent Pathway · Dorsal Root Ganglion',
    badge: 'Afferent',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    dotColor: '#06b6d4',
    coords: { x: 635, y: 210 },
    summary: 'Pseudo-unipolar neurone whose cell body resides in the Dorsal Root Ganglion outside the spinal cord.',
    details: [
      'Has a long peripheral dendron conducting impulses from skin to ganglion and a short central axon entering dorsal horn.',
      'Cell bodies congregate in the Dorsal Root Ganglion (DRG), forming a visible swelling on the dorsal root.',
      'Axons are myelinated by Schwann cells, enabling rapid saltatory conduction (50–70 m/s) via Nodes of Ranvier.'
    ],
    kcseTip: 'Dorsal Root = Sensory. If a dorsal root is severed, sensation in that limb is permanently lost, but motor muscle function remains intact (Bell-Magendie Law).'
  },
  {
    id: 'station_3',
    num: 3,
    title: 'Spinal Cord Grey Matter & Relay Neurone',
    sub: 'Central Integration · Interneurone & Collateral Branch',
    badge: 'Spinal Center',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    dotColor: '#10b981',
    coords: { x: 765, y: 265 },
    summary: 'Multipolar interneurone located entirely within the butterfly-shaped grey matter of the spinal cord.',
    details: [
      'Connects sensory neurone terminal boutons in the dorsal horn to motor neurone dendrites in the ventral horn.',
      'Coordinates the rapid automatic reflex arc wholly within spinal cord grey matter, bypassing conscious brain intervention.',
      'Simultaneously emits an ascending collateral axon up the spinothalamic tract to the sensory cortex of the brain (arrival is delayed!).'
    ],
    kcseTip: 'Grey matter contains unmyelinated cell bodies, dendrites, and synapses. White matter consists of myelinated axon columns (tracts). The reflex occurs before you feel pain because the spinal circuit is much shorter.'
  },
  {
    id: 'station_4',
    num: 4,
    title: 'Motor Neurone & Ventral Root',
    sub: 'Efferent Pathway · Ventral Horn Soma',
    badge: 'Efferent',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    dotColor: '#f59e0b',
    coords: { x: 670, y: 395 },
    summary: 'Multipolar neurone with large cell body located in the ventral horn, exiting through the ventral root.',
    details: [
      'Soma receives excitatory postsynaptic potentials (EPSPs) across synapse from the relay neurone.',
      'Axon exits spinal cord via ventral root, joins mixed spinal nerve trunk, and propagates towards target muscle.',
      'Surrounded by thick myelin sheath for rapid non-decremental conduction to effector.'
    ],
    kcseTip: 'Ventral Root = Motor. If the ventral root is severed, the limb suffers flaccid paralysis (cannot move), yet retains normal tactile/pain sensation.'
  },
  {
    id: 'station_5',
    num: 5,
    title: 'Neuromuscular Junction & Biceps',
    sub: 'Effector Organ · Muscle Contraction & Withdrawal',
    badge: 'Effector',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    dotColor: '#a855f7',
    coords: { x: 195, y: 305 },
    summary: 'Motor end-plate releases Acetylcholine (ACh), triggering Ca²⁺ release in myofibrils to flex arm.',
    details: [
      'Action potential causes exocytosis of acetylcholine into the neuromuscular synaptic cleft.',
      'ACh binds to nicotinic receptors, depolarizing the sarcolemma (end-plate potential) and releasing sarcoplasmic Ca²⁺.',
      'Actin and myosin cross-bridges slide, contracting the biceps brachii to rapidly flex forearm away from noxious flame/pin.'
    ],
    kcseTip: 'Effector is the muscle or gland that responds to motor nerve impulses. In this somatic spinal reflex, the biceps brachii flexor muscle is the effector.'
  }
];

/**
 * 5 Sequential Stages of the Reflex Arc
 */
const REFLEX_STEPS = [
  {
    id: 'step_1',
    step: 1,
    title: 'Noxious Stimulus & Receptor Potential',
    stationId: 'station_1',
    timeMs: 2.5,
    station: 'Skin Cutaneous Nociceptors',
    desc: 'Thermal flame (>43°C) activates TRPV1 cation channels on free nerve endings. Local generator potential exceeds -55 mV threshold.',
    speedNote: 'Generator potential reaches threshold in ~2.5 ms'
  },
  {
    id: 'step_2',
    step: 2,
    title: 'Afferent Conduction & Dorsal Root Ganglion',
    stationId: 'station_2',
    timeMs: 14.0,
    station: 'Dorsal Root Ganglion (DRG)',
    desc: 'Saltatory action potential propagates at 60 m/s along myelinated A-delta axon, passing through unipolar soma in DRG into dorsal horn.',
    speedNote: 'Transit along peripheral arm nerve to DRG: ~11.5 ms'
  },
  {
    id: 'step_3',
    step: 3,
    title: 'Spinal Cord Integration & Ascending Branch',
    stationId: 'station_3',
    timeMs: 18.5,
    station: 'Grey Matter Relay Neurone',
    desc: 'Synapse 1 releases ACh/glutamate in dorsal horn. Relay neurone excites motor neurone while sending collateral signal up to the brain.',
    speedNote: 'Spinal synaptic delay: ~1.0 ms across 2 central synapses'
  },
  {
    id: 'step_4',
    step: 4,
    title: 'Efferent Motor Conduction via Ventral Root',
    stationId: 'station_4',
    timeMs: 31.0,
    station: 'Ventral Root & Motor Axon',
    desc: 'Multipolar motor neurone fires action potential down ventral root into mixed nerve trunk towards the arm.',
    speedNote: 'Motor axon propagation down upper arm: ~12.5 ms'
  },
  {
    id: 'step_5',
    step: 5,
    title: 'Neuromuscular Activation & Arm Withdrawal',
    stationId: 'station_5',
    timeMs: 36.5,
    station: 'Biceps Brachii Effector',
    desc: 'Motor end-plate releases ACh. Sarcoplasmic Ca²⁺ surge causes rapid biceps contraction, flexing forearm away from flame.',
    speedNote: 'Total Reflex Arc Response Time: ~36.5 ms (Automatic & Involuntary!)'
  }
];

/**
 * Chemical Synapse Steps for Deep-Dive Tab
 */
const SYNAPSE_STEPS = [
  {
    step: 1,
    title: 'Action Potential Influx',
    badge: 'Depolarization (+30 mV)',
    desc: 'Wave of depolarization arrives at presynaptic terminal knob, opening voltage-gated ion channels.',
    highlight: 'terminal_knob'
  },
  {
    step: 2,
    title: 'Voltage-Gated Ca²⁺ Influx',
    badge: 'Ca²⁺ Entry',
    desc: 'Extracellular Ca²⁺ rushes down its steep concentration gradient into the presynaptic bulb.',
    highlight: 'ca_channels'
  },
  {
    step: 3,
    title: 'Synaptic Vesicle Exocytosis',
    badge: 'ACh Release',
    desc: 'Ca²⁺ ions trigger synaptic vesicles to fuse with presynaptic membrane, releasing Acetylcholine into the 20 nm cleft.',
    highlight: 'vesicles'
  },
  {
    step: 4,
    title: 'Diffusion & Receptor Binding (EPSP)',
    badge: 'Na⁺ Influx',
    desc: 'ACh diffuses across 20 nm cleft and binds to ligand-gated Na⁺ receptor channels, generating an Excitatory Postsynaptic Potential.',
    highlight: 'receptors'
  },
  {
    step: 5,
    title: 'Enzymatic Breakdown by AChE',
    badge: 'AChE Cleavage',
    desc: 'Acetylcholinesterase (AChE) rapidly hydrolyses ACh into acetate and choline, terminating excitation to prevent continuous spasm.',
    highlight: 'ache_enzyme'
  },
  {
    step: 6,
    title: 'Choline Reuptake & Resynthesis',
    badge: 'Recycling',
    desc: 'Choline is actively pumped back into presynaptic bulb and recombined with Acetyl-CoA by Choline Acetyltransferase (ChAT).',
    highlight: 'reuptake'
  }
];

/**
 * KCSE Form 4 Exam Mastery Questions
 */
const KCSE_EXAM_QUESTIONS = [
  {
    id: 1,
    question: 'Why does a person withdraw their hand from a burning candle before they consciously feel the sensation of pain?',
    options: [
      'Pain receptors in the hand are slower to respond than temperature receptors.',
      'The reflex arc is coordinated entirely in the spinal cord; impulses reach the biceps before ascending tracts reach the cerebral cortex.',
      'Motor neurones conduct impulses at twice the speed of sensory neurones.',
      'Sensory impulses never travel to the brain during protective reflex actions.'
    ],
    correct: 1,
    explanation: 'The spinal reflex circuit consists of only 3 neurones and 2 synapses in the spinal cord (~35 ms total). The ascending collateral tract to the brain is longer and involves multiple cortical synapses (~180 ms), so hand withdrawal occurs well before conscious perception.'
  },
  {
    id: 2,
    question: 'A patient suffered spinal trauma that completely severed the dorsal root of the right brachial plexus. What physiological deficit will be observed in their right arm?',
    options: [
      'Loss of motor movement (flaccid paralysis), but sensation remains intact.',
      'Loss of tactile and pain sensation, while voluntary motor movement remains intact.',
      'Complete loss of both sensation and voluntary movement.',
      'Continuous uncontrolled muscle spasms (tetany).'
    ],
    correct: 1,
    explanation: 'According to the Bell-Magendie Law, the dorsal root carries strictly afferent (sensory) neurones. Severing the dorsal root abolishes sensory input from that limb while leaving motor axons in the ventral root intact.'
  },
  {
    id: 3,
    question: 'Where are the cell bodies (somas) of sensory neurones located in the spinal reflex arc?',
    options: [
      'In the ventral horn of the spinal cord grey matter.',
      'In the dorsal root ganglion, located outside the spinal cord.',
      'In the cerebral cortex somatosensory area.',
      'Embedded directly inside the dermis of the skin.'
    ],
    correct: 1,
    explanation: 'Sensory (afferent) neurones are pseudo-unipolar. Their cell bodies are clustered outside the spinal cord in the Dorsal Root Ganglion (DRG). In contrast, motor neurone somas are located inside the ventral horn of grey matter.'
  },
  {
    id: 4,
    question: 'What is the immediate consequence of treating the neuromuscular junction with an organophosphate substance that inhibits Acetylcholinesterase (AChE)?',
    options: [
      'No muscle contraction occurs because acetylcholine cannot be released.',
      'Continuous, sustained muscle contraction and tetanic spasm because acetylcholine is not hydrolysed.',
      'Sensory receptors in the skin fail to generate an action potential.',
      'Action potentials travel backwards along the motor axon.'
    ],
    correct: 1,
    explanation: 'AChE hydrolyses ACh in the synaptic cleft within 1 millisecond. If inhibited by organophosphates, ACh continuously stimulates postsynaptic receptors, causing continuous Na⁺ influx and uncontrollable tetanic muscle spasms.'
  },
  {
    id: 5,
    question: 'Which of the following describes the correct sequence of structures traversed by an impulse in a spinal reflex arc?',
    options: [
      'Receptor → Motor neurone → Spinal cord → Sensory neurone → Effector',
      'Effector → Motor neurone → Spinal cord → Sensory neurone → Receptor',
      'Receptor → Sensory neurone → Relay neurone → Motor neurone → Effector',
      'Receptor → Relay neurone → Sensory neurone → Motor neurone → Effector'
    ],
    correct: 2,
    explanation: 'The classic 5-component reflex arc sequence is: Receptor (skin nociceptor) → Sensory neurone (dorsal root) → Relay neurone (spinal grey matter) → Motor neurone (ventral root) → Effector (biceps muscle).'
  }
];

export default function HumanReflexArcSim({ config = {}, onTelemetry }) {
  // Navigation & tabs
  const [activeTab, setActiveTab] = useState('reflex_arc'); // 'reflex_arc' | 'synapse_micro' | 'kcse_quiz'
  
  // Interactive Controls
  const [stimulusType, setStimulusType] = useState('flame'); // 'flame' | 'pin'
  const [playbackMode, setPlaybackMode] = useState('realtime'); // 'realtime' | 'slowmo'
  const [activeStationId, setActiveStationId] = useState('station_1');
  const [showAnatomyLabels, setShowAnatomyLabels] = useState(true);

  // Animation & Transit State
  const [isFiring, setIsFiring] = useState(false);
  const [progress, setProgress] = useState(0); // 0.0 to 1.0 continuous transit
  const [slowMoStep, setSlowMoStep] = useState(0); // 0 to 4
  const [isPaused, setIsPaused] = useState(false);
  const [brainPerception, setBrainPerception] = useState('idle'); // 'idle' | 'ascending' | 'perceived'
  const [simulatedTimeMs, setSimulatedTimeMs] = useState(0);
  const [flameFlicker, setFlameFlicker] = useState(0);

  // Synapse sub-tab step
  const [synapseStepIndex, setSynapseStepIndex] = useState(0);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Refs for animation frame & timer
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(0);

  // Candle flame flicker ambient loop
  useEffect(() => {
    const interval = setInterval(() => {
      setFlameFlicker(Math.random() * 4 - 2);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Determine current active station object
  const activeStation = useMemo(() => {
    return PATHWAY_STATIONS.find((st) => st.id === activeStationId) || PATHWAY_STATIONS[0];
  }, [activeStationId]);

  // Current step metadata based on progress or slow-mo step
  const currentStepInfo = useMemo(() => {
    if (playbackMode === 'slowmo') {
      return REFLEX_STEPS[slowMoStep];
    }
    if (progress <= 0.05 && !isFiring) {
      return { step: 0, title: 'Resting State (-70 mV)', desc: 'Arm resting near stimulus. Resting potential maintained by Na⁺/K⁺ ATPase pumps.' };
    }
    if (progress < 0.25) return REFLEX_STEPS[0];
    if (progress < 0.50) return REFLEX_STEPS[1];
    if (progress < 0.65) return REFLEX_STEPS[2];
    if (progress < 0.85) return REFLEX_STEPS[3];
    return REFLEX_STEPS[4];
  }, [playbackMode, slowMoStep, progress, isFiring]);

  // Trigger Reflex Arc Action (Real-Time or Slow-Mo Play)
  const triggerReflex = useCallback(() => {
    if (isFiring && !isPaused) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    setIsFiring(true);
    setIsPaused(false);
    setBrainPerception('idle');

    if (progress >= 1 || progress === 0) {
      setProgress(0);
      setSimulatedTimeMs(0);
      startTimeRef.current = performance.now();
    } else {
      // Resume from pause
      startTimeRef.current = performance.now() - (progress * (playbackMode === 'realtime' ? 1200 : 7000));
    }

    const duration = playbackMode === 'realtime' ? 1200 : 7000; // 1.2s visual duration in real-time, 7s in slow-mo

    const loop = (now) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      // Map progress to biological latency ms (0 to 36.5 ms)
      const currentMs = (p * 36.5).toFixed(1);
      setSimulatedTimeMs(currentMs);

      // Brain collateral pulse triggers at spinal cord passage (p > 0.55)
      if (p > 0.55 && p < 0.85) {
        setBrainPerception('ascending');
      } else if (p >= 0.85) {
        setBrainPerception('perceived');
      }

      // Update current inspection pin station automatically to follow the impulse
      if (p < 0.25) setActiveStationId('station_1');
      else if (p < 0.50) setActiveStationId('station_2');
      else if (p < 0.65) setActiveStationId('station_3');
      else if (p < 0.85) setActiveStationId('station_4');
      else setActiveStationId('station_5');

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        setIsFiring(false);
        setProgress(1);
        setSimulatedTimeMs(36.5);
        setBrainPerception('perceived');

        // Emit Telemetry
        if (typeof onTelemetry === 'function') {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            simulation: 'reflex_arc_synaptic_transmission_sim',
            checkpoint: 'REFLEX_TRIGGER_COMPLETED',
            stimulus: stimulusType,
            mode: playbackMode,
            responseLatencyMs: 36.5,
            automaticSpinalCoordination: true
          });
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
  }, [isFiring, isPaused, progress, playbackMode, stimulusType, onTelemetry]);

  // Pause animation
  const pauseReflex = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsPaused(true);
  };

  // Reset to resting baseline
  const resetReflex = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsFiring(false);
    setIsPaused(false);
    setProgress(0);
    setSlowMoStep(0);
    setSimulatedTimeMs(0);
    setBrainPerception('idle');
    setActiveStationId('station_1');
  }, []);

  // Step next in slow-motion mode
  const handleStepNext = () => {
    if (slowMoStep < REFLEX_STEPS.length - 1) {
      const nextStep = slowMoStep + 1;
      setSlowMoStep(nextStep);
      const stepP = (nextStep + 1) / REFLEX_STEPS.length;
      setProgress(stepP);
      setSimulatedTimeMs(REFLEX_STEPS[nextStep].timeMs);
      setActiveStationId(REFLEX_STEPS[nextStep].stationId);

      if (nextStep >= 2) setBrainPerception('ascending');
      if (nextStep === 4) setBrainPerception('perceived');

      if (typeof onTelemetry === 'function' && nextStep === 4) {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'reflex_arc_synaptic_transmission_sim',
          checkpoint: 'SLOW_MOTION_TRACE_COMPLETED',
          step: nextStep
        });
      }
    }
  };

  // Step back in slow-motion mode
  const handleStepPrev = () => {
    if (slowMoStep > 0) {
      const prevStep = slowMoStep - 1;
      setSlowMoStep(prevStep);
      const stepP = (prevStep + 0.5) / REFLEX_STEPS.length;
      setProgress(stepP);
      setSimulatedTimeMs(REFLEX_STEPS[prevStep].timeMs);
      setActiveStationId(REFLEX_STEPS[prevStep].stationId);
      if (prevStep < 2) setBrainPerception('idle');
      else if (prevStep < 4) setBrainPerception('ascending');
    }
  };

  // Switch playback mode cleanly
  const handleModeSwitch = (mode) => {
    resetReflex();
    setPlaybackMode(mode);
  };

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Compute mechanical arm flexion angle:
  // Arm remains resting at 0° until impulse reaches motor end-plate (progress >= 0.80),
  // then snaps back smoothly between -28° and -32° withdrawal!
  const armFlexAngle = useMemo(() => {
    if (progress < 0.80) return 0;
    const withdrawProgress = Math.min((progress - 0.80) / 0.15, 1);
    // Smooth ease-out withdrawal
    const ease = 1 - Math.pow(1 - withdrawProgress, 3);
    return -30 * ease;
  }, [progress]);

  // Dynamic station coordinates to track arm withdrawal movement
  const dynamicStationCoords = useMemo(() => {
    const rad = (armFlexAngle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    // Forearm rotation pivot is at (210, 390)
    const st1X = 210 + (420 - 210) * cos - (508 - 390) * sin;
    const st1Y = 390 + (420 - 210) * sin + (508 - 390) * cos;
    return {
      station_1: { x: st1X, y: st1Y },
      station_2: { x: 635, y: 210 },
      station_3: { x: 765, y: 265 },
      station_4: { x: 670, y: 395 },
      station_5: { x: 195, y: 305 }
    };
  }, [armFlexAngle]);

  // Compute impulse spark coordinates along the anatomical nerve path
  const impulsePoint = useMemo(() => {
    if (progress <= 0) return null;

    // Segment 1: Fingertip Receptors to Dorsal Root Ganglion (0.0 to 0.45)
    if (progress <= 0.45) {
      const t = progress / 0.45;
      const p0 = { x: 420, y: 508 };
      const p1 = { x: 340, y: 440 };
      const p2 = { x: 480, y: 280 };
      const p3 = { x: 635, y: 210 };
      const cx = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
      const cy = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;
      return { x: cx, y: cy, label: 'Sensory Saltatory Impulse', color: '#06b6d4' };
    }

    // Segment 2: DRG into Dorsal Horn Synapse 1 (0.45 to 0.58)
    if (progress <= 0.58) {
      const t = (progress - 0.45) / 0.13;
      const p0 = { x: 635, y: 210 };
      const p1 = { x: 690, y: 215 };
      const p2 = { x: 745, y: 225 };
      const cx = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
      const cy = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
      return { x: cx, y: cy, label: 'Dorsal Horn Synapse I', color: '#38bdf8' };
    }

    // Segment 3: Relay Interneurone in Grey Matter (0.58 to 0.68)
    if (progress <= 0.68) {
      const t = (progress - 0.58) / 0.10;
      const p0 = { x: 745, y: 225 };
      const p1 = { x: 770, y: 295 };
      const p2 = { x: 755, y: 370 };
      const cx = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
      const cy = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
      return { x: cx, y: cy, label: 'Interneurone Relay Transmission', color: '#10b981' };
    }

    // Segment 4: Ventral Horn Motor soma out through Ventral Root to Biceps (0.68 to 0.88)
    if (progress <= 0.88) {
      const t = (progress - 0.68) / 0.20;
      const p0 = { x: 755, y: 370 };
      const p1 = { x: 670, y: 395 };
      const p2 = { x: 420, y: 350 };
      const p3 = { x: 195, y: 305 };
      const cx = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
      const cy = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;
      return { x: cx, y: cy, label: 'Motor Efferent Wave', color: '#f59e0b' };
    }

    // Segment 5: Neuromuscular Endplate & Biceps Twitch (0.88 to 1.0)
    return { x: 195, y: 305, label: 'Biceps Contraction & Flexion', color: '#ef4444' };
  }, [progress]);

  // Collateral impulse traveling up spinothalamic tract to brain
  const brainPulsePoint = useMemo(() => {
    if (progress < 0.52) return null;
    const t = Math.min((progress - 0.52) / 0.40, 1);
    const p0 = { x: 745, y: 225 };
    const p1 = { x: 810, y: 150 };
    const p2 = { x: 880, y: 65 };
    const cx = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    const cy = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
    return { x: cx, y: cy };
  }, [progress]);

  // Quiz submission & score calculator
  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    KCSE_EXAM_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correct) correctCount++;
    });

    if (typeof onTelemetry === 'function') {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'reflex_arc_synaptic_transmission_sim',
        checkpoint: 'QUIZ_SUBMITTED',
        score: correctCount,
        total: KCSE_EXAM_QUESTIONS.length
      });
    }
  };

  const handleSelectStation = (stId) => {
    setActiveStationId(stId);
    if (typeof onTelemetry === 'function') {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'reflex_arc_synaptic_transmission_sim',
        checkpoint: 'STATION_INSPECTED',
        station: stId
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-6 text-slate-100 font-sans space-y-4">
      {/* Top Header Card */}
      <header className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Form 4 Biology · Topic 3
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Spinal Reflex Arc
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>Human Reflex Arc</span>
              <span className="text-sm font-normal text-slate-400 border-l border-slate-700 pl-2.5 hidden sm:inline">
                Spinal Sensorimotor Trajectory
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Experience the lightning-fast automatic pathway from nociceptor stimulus to biceps withdrawal coordinated wholly in spinal grey matter before conscious brain perception.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 self-start md:self-auto shadow-inner">
            <button
              onClick={() => setActiveTab('reflex_arc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'reflex_arc'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Reflex Arc
            </button>
            <button
              onClick={() => setActiveTab('synapse_micro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'synapse_micro'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Synaptic Cleft
            </button>
            <button
              onClick={() => setActiveTab('kcse_quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'kcse_quiz'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> KCSE Quiz
            </button>
          </div>
        </div>
      </header>

      {/* Main Reflex Arc Interactive Studio */}
      {activeTab === 'reflex_arc' && (
        <div className="space-y-4">
          {/* Main Control Toolbar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
            {/* Control 1: Stimulus Selection */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Stimulus:
              </span>
              <div className="flex rounded-lg overflow-hidden border border-slate-700 bg-slate-950 p-0.5 text-xs font-medium">
                <button
                  onClick={() => {
                    setStimulusType('flame');
                    resetReflex();
                  }}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                    stimulusType === 'flame'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-300" /> Hot Candle Flame
                </button>
                <button
                  onClick={() => {
                    setStimulusType('pin');
                    resetReflex();
                  }}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                    stimulusType === 'pin'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-300" /> Sharp Pin Prick
                </button>
              </div>
            </div>

            {/* Control 2: Playback Speed Mode */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mode:</span>
              <div className="flex rounded-lg overflow-hidden border border-slate-700 bg-slate-950 p-0.5 text-xs font-medium">
                <button
                  onClick={() => handleModeSwitch('realtime')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    playbackMode === 'realtime'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ⚡ Real-Time (~35 ms)
                </button>
                <button
                  onClick={() => handleModeSwitch('slowmo')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    playbackMode === 'slowmo'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🔍 Slow-Motion Signal Trace
                </button>
              </div>
            </div>

            {/* Action Trigger & Reset */}
            <div className="flex items-center gap-2 ml-auto">
              {playbackMode === 'realtime' ? (
                <button
                  onClick={triggerReflex}
                  disabled={isFiring}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center gap-2 ${
                    isFiring
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : stimulusType === 'flame'
                      ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 hover:from-amber-500 hover:to-rose-600 text-white shadow-rose-600/30 active:scale-95'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-blue-600/30 active:scale-95'
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-200 animate-pulse" />
                  {isFiring ? 'Impulse Traversing Arc...' : `Touch ${stimulusType === 'flame' ? 'Hot Flame' : 'Sharp Pin'}`}
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleStepPrev}
                    disabled={slowMoStep <= 0}
                    className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Step Back"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={isFiring ? pauseReflex : triggerReflex}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1 shadow-md shadow-cyan-600/30"
                  >
                    {isFiring ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isFiring ? 'Pause' : 'Play Trace'}
                  </button>
                  <button
                    onClick={handleStepNext}
                    disabled={slowMoStep >= REFLEX_STEPS.length - 1}
                    className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Step Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                onClick={resetReflex}
                className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                title="Reset to resting state"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Diagnostic Callout Banner */}
          <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-amber-950/40 border border-cyan-800/40 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-semibold text-cyan-300">
                Response Time: <span className="text-white font-mono text-sm">{simulatedTimeMs} ms</span>
              </span>
              <span className="text-slate-400 hidden sm:inline">·</span>
              <span className="text-slate-300 hidden sm:inline">
                Involuntary: <span className="text-emerald-300 font-medium">Coordinated at spinal cord level before signal reaches cerebral cortex!</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                Withdrawal Latency: <strong className="text-white">~35 ms</strong>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
                Brain Awareness: <strong className="text-amber-300">~180 ms (Delayed!)</strong>
              </span>
            </div>
          </div>

          {/* Visual Interactive SVG Canvas */}
          <div className="relative bg-gradient-to-b from-slate-950 via-[#0b1120] to-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
            {/* Top Overlay HUD Bar */}
            <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs shadow-lg">
                <span className="text-slate-400">Current Phase:</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  {currentStepInfo.title}
                </span>
              </div>

              <div className="pointer-events-auto flex items-center gap-2">
                <button
                  onClick={() => setShowAnatomyLabels(!showAnatomyLabels)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium backdrop-blur-md transition-colors ${
                    showAnatomyLabels
                      ? 'bg-slate-800/90 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-900/80 border-slate-700 text-slate-400'
                  }`}
                >
                  {showAnatomyLabels ? 'Labels ON' : 'Labels OFF'}
                </button>

                {/* Brain Consciousness Indicator */}
                <div
                  className={`px-3 py-1 rounded-lg border text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-all ${
                    brainPerception === 'perceived'
                      ? 'bg-amber-950/80 border-amber-500/60 text-amber-200 shadow-lg shadow-amber-500/20'
                      : brainPerception === 'ascending'
                      ? 'bg-purple-950/80 border-purple-500/50 text-purple-200 animate-pulse'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-base">🧠</span>
                  <span>
                    {brainPerception === 'perceived'
                      ? 'Brain Felt Pain: "OUCH!" (After withdrawal)'
                      : brainPerception === 'ascending'
                      ? 'Impulse ascending to cortex...'
                      : 'Cerebral Cortex (Waiting)'}
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Diagram Canvas */}
            <svg
              viewBox="0 0 1000 620"
              className="w-full h-auto select-none"
              style={{ minHeight: '380px' }}
            >
              <defs>
                {/* Glow Filter for Electrical Impulse */}
                <filter id="goldenGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur1" />
                  <feGaussianBlur stdDeviation="8" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Gradients */}
                <linearGradient id="spinalWhiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                <linearGradient id="spinalGreyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="50%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>

                <linearGradient id="armSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5d0b5" />
                  <stop offset="70%" stopColor="#e2ab88" />
                  <stop offset="100%" stopColor="#c88b63" />
                </linearGradient>

                <linearGradient id="bicepsRelaxedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#b91c1c" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>

                <linearGradient id="bicepsContractedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#c2410c" />
                </linearGradient>

                <radialGradient id="flameRadial" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="25%" stopColor="#fef08a" />
                  <stop offset="60%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Sub-grid biological background aesthetic */}
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.15)" strokeWidth="0.8" />
              </pattern>
              <rect width="1000" height="620" fill="url(#gridPattern)" />

              {/* Section Boundaries / Ambient Regions */}
              <g opacity="0.4">
                <text x="140" y="55" fill="#64748b" fontSize="12" fontWeight="700" letterSpacing="1.5">
                  EFFECTOR & RECEPTOR (ARM)
                </text>
                <text x="490" y="55" fill="#64748b" fontSize="12" fontWeight="700" letterSpacing="1.5">
                  MIXED SPINAL NERVE TRUNK
                </text>
                <text x="760" y="55" fill="#64748b" fontSize="12" fontWeight="700" letterSpacing="1.5">
                  SPINAL CORD TRANSVERSE SECTION
                </text>
              </g>

              {/* ============================================================ */}
              {/* 1. RIGHT SIDE: SPINAL CORD TRANSVERSE CROSS-SECTION         */}
              {/* ============================================================ */}
              <g id="spinal-cord-group">
                {/* Meninges Outer Ring (Pia / Arachnoid / Dura) */}
                <ellipse cx="805" cy="305" rx="160" ry="175" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
                
                {/* White Matter Outline with Anterior Median Fissure (Left side) & Posterior Median Sulcus (Right side) */}
                <path
                  d="
                    M 805, 135
                    C 890, 135  960, 205  960, 305
                    C 960, 400  885, 475  805, 475
                    C 745, 475  680, 420  660, 360
                    L 720, 335
                    L 720, 275
                    L 660, 250
                    C 680, 190  745, 135  805, 135
                    Z
                  "
                  fill="url(#spinalWhiteGrad)"
                  stroke="#64748b"
                  strokeWidth="3.5"
                  className="drop-shadow-xl"
                />

                {/* Anterior Median Fissure Deep Groove (Anterior / Ventral side facing left towards roots) */}
                <path
                  d="M 660, 305 L 755, 305"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Posterior Median Septum (Posterior / Dorsal side) */}
                <line x1="805" y1="135" x2="805" y2="230" stroke="#1e293b" strokeWidth="2.5" strokeDasharray="3 2" />

                {/* Butterfly-Shaped Grey Matter */}
                <path
                  d="
                    M 740, 220
                    C 760, 210  780, 230  785, 270
                    C 795, 290  815, 290  825, 270
                    C 830, 230  850, 210  870, 220
                    C 885, 235  870, 280  850, 300
                    C 870, 320  890, 370  875, 390
                    C 855, 400  835, 360  825, 335
                    C 815, 320  795, 320  785, 335
                    C 775, 360  755, 400  735, 390
                    C 720, 370  740, 320  760, 300
                    C 740, 280  725, 235  740, 220
                    Z
                  "
                  fill="url(#spinalGreyGrad)"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  opacity="0.95"
                />

                {/* Central Canal with Cerebrospinal Fluid (CSF) */}
                <circle cx="805" cy="305" r="9" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="805" cy="305" r="4" fill="#e0f2fe" className="animate-pulse" />

                {/* White Matter Columns (Tracts) annotations */}
                {showAnatomyLabels && (
                  <g className="text-[10px] fill-slate-300 font-medium select-none pointer-events-none">
                    <text x="835" y="165" fill="#94a3b8">Dorsal Funiculus (White Matter)</text>
                    <text x="885" y="320" fill="#94a3b8">Lateral Column</text>
                    {/* Dorsal Horn Sensory Synapse pointer */}
                    <line x1="745" y1="220" x2="745" y2="185" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                    <text x="745" y="180" textAnchor="middle" fill="#38bdf8" fontWeight="bold">Dorsal Horn (Sensory)</text>
                    {/* Ventral Horn Motor Somata pointer */}
                    <line x1="755" y1="375" x2="755" y2="430" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                    <text x="755" y="442" textAnchor="middle" fill="#fbbf24" fontWeight="bold">Ventral Horn (Motor Somata)</text>
                    {/* Central Canal */}
                    <line x1="815" y1="305" x2="840" y2="305" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                    <text x="845" y="309" fill="#7dd3fc">Central Canal (CSF)</text>
                  </g>
                )}

                {/* Relay Interneurone (In Grey Matter) */}
                <circle cx="745" cy="225" r="5" fill="#10b981" stroke="#34d399" strokeWidth="1.5" />
                <path
                  d="M 745, 225 C 760, 240  770, 255  765, 275 C 760, 310  770, 345  755, 370"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Interneurone Cell Body */}
                <circle cx="765" cy="275" r="7" fill="#059669" stroke="#34d399" strokeWidth="2" />
                <circle cx="765" cy="275" r="2.5" fill="#a7f3d0" />

                {/* Collateral Branch to Brain heading up spinothalamic tract */}
                <path
                  d="M 745, 225 C 765, 190  800, 140  870, 70"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                />

                {/* Motor Neurone Multipolar Soma in Ventral Horn */}
                <circle cx="755" cy="370" r="9" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
                <circle cx="755" cy="370" r="3.5" fill="#fef3c7" />
                {/* Star-like dendrites on motor neurone */}
                <path
                  d="
                    M 755, 361 L 755, 355
                    M 748, 365 L 741, 360
                    M 762, 365 L 769, 360
                    M 764, 373 L 772, 375
                  "
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>

              {/* ============================================================ */}
              {/* 2. TOP RIGHT: BRAIN / CORTEX INDICATOR                      */}
              {/* ============================================================ */}
              <g id="brain-tract-group" transform="translate(850, 20)">
                {/* Brain Silhouette */}
                <rect x="0" y="0" width="130" height="75" rx="12" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" opacity="0.9" />
                <text x="65" y="24" fill="#c7d2fe" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Cerebral Cortex
                </text>
                <text x="65" y="40" fill="#a5b4fc" fontSize="9" textAnchor="middle">
                  Somatosensory Area
                </text>

                {/* Slower Brain Signal Status */}
                <g transform="translate(10, 48)">
                  <rect
                    x="0"
                    y="0"
                    width="110"
                    height="20"
                    rx="6"
                    fill={brainPerception === 'perceived' ? '#7f1d1d' : '#312e81'}
                  />
                  <text
                    x="55"
                    y="14"
                    fill={brainPerception === 'perceived' ? '#fecaca' : '#93c5fd'}
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {brainPerception === 'perceived' ? 'Pain Felt: ~180 ms' : 'Ascending Delay'}
                  </text>
                </g>

                {/* Ascending pulse spark */}
                {brainPulsePoint && (
                  <circle
                    cx={brainPulsePoint.x - 850}
                    cy={brainPulsePoint.y - 20}
                    r="5"
                    fill="#c084fc"
                    filter="url(#goldenGlow)"
                  />
                )}
              </g>

              {/* ============================================================ */}
              {/* 3. CENTER: DORSAL & VENTRAL ROOTS + MIXED SPINAL NERVE       */}
              {/* ============================================================ */}
              <g id="roots-nerve-group">
                {/* Dorsal Root Nerve Sheath (Sensory) */}
                <path
                  d="M 740, 220 C 690, 215  660, 210  635, 210 C 600, 210  560, 250  520, 275"
                  fill="none"
                  stroke="#083344"
                  strokeWidth="14"
                  strokeLinecap="round"
                />

                {/* Dorsal Root Ganglion (DRG) Swelling */}
                <ellipse
                  cx="635"
                  cy="210"
                  rx="30"
                  ry="20"
                  fill="#0e7490"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:stroke-cyan-300 transition-colors"
                  onClick={() => handleSelectStation('station_2')}
                />
                {/* Pseudo-unipolar sensory cell body inside DRG */}
                <circle cx="635" cy="210" r="10" fill="#0284c7" stroke="#e0f2fe" strokeWidth="2" />
                <circle cx="635" cy="210" r="4" fill="#f0f9ff" />
                {/* Stem process of pseudo-unipolar neurone */}
                <path d="M 635, 210 L 635, 225 M 620, 225 L 650, 225" stroke="#38bdf8" strokeWidth="2.5" />

                {/* Ventral Root Nerve Sheath (Motor) */}
                <path
                  d="M 745, 375 C 700, 395  660, 400  610, 390 C 560, 380  535, 340  520, 305"
                  fill="none"
                  stroke="#451a03"
                  strokeWidth="14"
                  strokeLinecap="round"
                />

                {/* Mixed Spinal Nerve Trunk Common Sheath */}
                <path
                  d="M 520, 275 C 470, 310  420, 330  360, 370"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="18"
                  strokeLinecap="round"
                />

                {/* SENSORY AXON TRACE (Cyan Path) */}
                <path
                  id="sensoryPath"
                  d="
                    M 420, 508
                    C 370, 460  330, 420  320, 390
                    C 305, 350  380, 310  480, 275
                    C 530, 255  580, 215  635, 210
                    L 740, 220
                  "
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="6 3"
                />

                {/* MOTOR AXON TRACE (Amber/Orange Path) */}
                <path
                  id="motorPath"
                  d="
                    M 755, 370
                    C 715, 390  650, 395  600, 385
                    C 545, 375  500, 330  440, 315
                    C 370, 295  280, 290  195, 305
                  "
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="6 3"
                />

                {/* Myelin Schwann Cell Segments along sensory & motor fibers */}
                <g stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" opacity="0.6">
                  <line x1="470" y1="275" x2="490" y2="267" stroke="#38bdf8" />
                  <line x1="530" y1="250" x2="550" y2="240" stroke="#38bdf8" />
                  <line x1="680" y1="215" x2="705" y2="218" stroke="#38bdf8" />
                  <line x1="660" y1="395" x2="685" y2="393" stroke="#fbbf24" />
                  <line x1="580" y1="380" x2="605" y2="384" stroke="#fbbf24" />
                  <line x1="390" y1="305" x2="415" y2="308" stroke="#fbbf24" />
                </g>
              </g>

              {/* ============================================================ */}
              {/* 4. LEFT SIDE: ARM, SHOULDER, BICEPS & FLEXING FOREARM        */}
              {/* ============================================================ */}
              <g id="arm-anatomy-group">
                {/* Upper Arm & Shoulder (Fixed Position) */}
                <path
                  d="
                    M 110, 180
                    C 140, 180  190, 200  210, 240
                    C 225, 270  235, 320  225, 370
                    L 210, 390
                    L 140, 390
                    C 125, 330  115, 270  100, 230
                    Z
                  "
                  fill="url(#armSkinGrad)"
                  stroke="#9a3412"
                  strokeWidth="2.5"
                  opacity="0.85"
                />

                {/* Humerus Bone in Upper Arm */}
                <path
                  d="M 145, 230 C 155, 290  160, 340  155, 380"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                  strokeLinecap="round"
                  opacity="0.75"
                />

                {/* Biceps Brachii Muscle (Anterior Upper Arm) */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelectStation('station_5')}
                >
                  <path
                    d={
                      armFlexAngle < -10
                        ? 'M 160, 250 C 215, 290  215, 330  165, 365 C 145, 340  145, 280  160, 250 Z'
                        : 'M 165, 250 C 195, 290  195, 330  165, 365 C 150, 330  150, 280  165, 250 Z'
                    }
                    fill={armFlexAngle < -10 ? 'url(#bicepsContractedGrad)' : 'url(#bicepsRelaxedGrad)'}
                    stroke="#dc2626"
                    strokeWidth="2"
                    className="transition-all duration-200"
                  />
                  {/* Tendons anchoring to scapula and radius */}
                  <line x1="160" y1="250" x2="150" y2="230" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                  <line x1="165" y1="365" x2="190" y2="395" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />

                  {/* Motor End-Plate (Neuromuscular Junction) Boutons on Biceps */}
                  <circle cx="195" cy="305" r="6" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                  <line x1="205" y1="305" x2="195" y2="305" stroke="#fbbf24" strokeWidth="3" />
                </g>

                {/* Elbow Joint Pivot Marker */}
                <circle cx="210" cy="390" r="7" fill="#64748b" stroke="#334155" strokeWidth="2" />

                {/* FOREARM & HAND (ROTATES AROUND ELBOW: 210, 390) */}
                <g
                  id="forearm-hand-group"
                  transform={`rotate(${armFlexAngle}, 210, 390)`}
                  className="transition-transform duration-100 ease-out"
                >
                  {/* Forearm Flesh */}
                  <path
                    d="
                      M 210, 390
                      C 250, 410  310, 440  370, 470
                      C 390, 480  400, 490  415, 500
                      C 430, 508  435, 510  425, 515
                      C 405, 520  370, 510  320, 470
                      C 270, 440  230, 415  210, 390
                      Z
                    "
                    fill="url(#armSkinGrad)"
                    stroke="#9a3412"
                    strokeWidth="2"
                  />

                  {/* Radius & Ulna Bones */}
                  <line x1="215" y1="395" x2="365" y2="475" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" opacity="0.6" />

                  {/* Hand & Fingers touching stimulus */}
                  <path
                    d="
                      M 415, 500
                      C 425, 504  430, 507  432, 510
                      C 430, 515  420, 517  410, 514
                      Z
                    "
                    fill="#f5d0b5"
                    stroke="#c2410c"
                    strokeWidth="1.5"
                  />

                  {/* Cutaneous Nociceptors (Free Nerve Endings branching in fingertip) */}
                  <g
                    id="nociceptor-tree"
                    className="cursor-pointer"
                    onClick={() => handleSelectStation('station_1')}
                  >
                    <path
                      d="
                        M 420, 508 L 426, 502
                        M 426, 502 L 431, 499
                        M 426, 502 L 430, 506
                        M 420, 508 L 424, 512
                      "
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="431" cy="499" r="2.5" fill="#fb7185" />
                    <circle cx="430" cy="506" r="2.5" fill="#fb7185" />
                  </g>
                </g>
              </g>

              {/* ============================================================ */}
              {/* 5. STIMULUS STAND: CANDLE FLAME OR PIN PRICK                 */}
              {/* ============================================================ */}
              <g id="stimulus-stand" transform="translate(425, 500)">
                {stimulusType === 'flame' ? (
                  /* Candle and Flickering Flame */
                  <g>
                    {/* Candle Wax Stand */}
                    <rect x="-12" y="30" width="24" height="65" rx="3" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                    <rect x="-16" y="88" width="32" height="12" rx="4" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
                    {/* Wick */}
                    <line x1="0" y1="30" x2="0" y2="18" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Outer Heat Aura */}
                    <circle
                      cx="0"
                      cy="12"
                      r={24 + flameFlicker * 2}
                      fill="url(#flameRadial)"
                      opacity="0.75"
                    />

                    {/* Dynamic Flickering Flame Shape */}
                    <path
                      d={`
                        M 0, 18
                        C -10, 12  -12, -2   0, -22
                        C 12, -2   10, 12   0, 18
                        Z
                      `}
                      fill="#f97316"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      transform={`scale(${1 + flameFlicker * 0.05}) translate(${flameFlicker * 0.5}, 0)`}
                    />

                    {/* Inner Intense Flame Core */}
                    <path
                      d="
                        M 0, 16
                        C -5, 12  -5, 2  0, -8
                        C 5, 2    5, 12  0, 16
                        Z
                      "
                      fill="#fef08a"
                    />

                    {/* Heat Wave Warning Ripples */}
                    <circle cx="0" cy="0" r="32" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="animate-ping" />
                  </g>
                ) : (
                  /* Sharp Pin Prick Stand */
                  <g>
                    {/* Wooden Block Base */}
                    <rect x="-16" y="50" width="32" height="45" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="2" />
                    {/* Sharp Steel Needle */}
                    <polygon points="0,5 -3,50 3,50" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                    {/* Gleaming Sharp Tip */}
                    <circle cx="0" cy="5" r="2.5" fill="#f8fafc" />
                    <line x1="-6" y1="5" x2="6" y2="5" stroke="#38bdf8" strokeWidth="1" opacity="0.8" />
                  </g>
                )}
              </g>

              {/* ============================================================ */}
              {/* 6. TRAVELLING ELECTRICAL IMPULSE (ACTION POTENTIAL WAVE)     */}
              {/* ============================================================ */}
              {impulsePoint && (
                <g id="travelling-impulse">
                  {/* Outer Pulsing Aura */}
                  <circle
                    cx={impulsePoint.x}
                    cy={impulsePoint.y}
                    r="14"
                    fill={impulsePoint.color}
                    opacity="0.35"
                    className="animate-ping"
                  />
                  {/* Mid Glow Ring */}
                  <circle
                    cx={impulsePoint.x}
                    cy={impulsePoint.y}
                    r="8"
                    fill={impulsePoint.color}
                    filter="url(#goldenGlow)"
                  />
                  {/* Core Action Potential Spark */}
                  <circle
                    cx={impulsePoint.x}
                    cy={impulsePoint.y}
                    r="4.5"
                    fill="#ffffff"
                  />
                  {/* Trailing Comet Spark */}
                  <circle
                    cx={impulsePoint.x - 6}
                    cy={impulsePoint.y + 4}
                    r="2.5"
                    fill="#fbbf24"
                    opacity="0.7"
                  />
                </g>
              )}

              {/* ============================================================ */}
              {/* 7. PATHWAY INSPECTION PINS (1 TO 5)                          */}
              {/* ============================================================ */}
              {PATHWAY_STATIONS.map((station) => {
                const isSelected = activeStationId === station.id;
                const coords = dynamicStationCoords[station.id] || station.coords;
                return (
                  <g
                    key={station.id}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => handleSelectStation(station.id)}
                  >
                    {/* Pin Outer Ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? 16 : 12}
                      fill={station.dotColor}
                      fillOpacity={isSelected ? 0.35 : 0.2}
                      stroke={station.dotColor}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className={isSelected ? 'animate-pulse' : ''}
                    />
                    {/* Pin Solid Center */}
                    <circle cx="0" cy="0" r={isSelected ? 8 : 6} fill={station.dotColor} />
                    <text
                      x="0"
                      y="3.5"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {station.num}
                    </text>
                  </g>
                );
              })}

              {/* Anatomy Labels (Toggleable) with Clean Leader Lines & Badges */}
              {showAnatomyLabels && (
                <g className="text-[11px] font-semibold select-none pointer-events-none drop-shadow">
                  {/* 1. Cutaneous Nociceptors (Dynamic tracking, clears candle) */}
                  <g>
                    <line
                      x1={dynamicStationCoords.station_1.x - 12}
                      y1={dynamicStationCoords.station_1.y}
                      x2={dynamicStationCoords.station_1.x - 45}
                      y2={dynamicStationCoords.station_1.y + 25}
                      stroke="#f43f5e"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                      opacity="0.8"
                    />
                    <rect
                      x={dynamicStationCoords.station_1.x - 185}
                      y={dynamicStationCoords.station_1.y + 14}
                      width="136"
                      height="22"
                      rx="6"
                      fill="rgba(15, 23, 42, 0.9)"
                      stroke="#f43f5e"
                      strokeWidth="1"
                    />
                    <text
                      x={dynamicStationCoords.station_1.x - 117}
                      y={dynamicStationCoords.station_1.y + 29}
                      fill="#fda4af"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      1. Cutaneous Nociceptors
                    </text>
                  </g>

                  {/* 2. Dorsal Root Ganglion */}
                  <g>
                    <line x1="635" y1="195" x2="635" y2="168" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.8" />
                    <rect x="535" y="146" width="200" height="22" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="#06b6d4" strokeWidth="1" />
                    <text x="635" y="161" fill="#67e8f9" textAnchor="middle" fontSize="10" fontWeight="bold">
                      2. Dorsal Root Ganglion (Sensory)
                    </text>
                  </g>

                  {/* 3. Interneurone in Grey Matter */}
                  <g>
                    <line x1="765" y1="250" x2="765" y2="115" stroke="#10b981" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.8" />
                    <rect x="680" y="93" width="170" height="22" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="#10b981" strokeWidth="1" />
                    <text x="765" y="108" fill="#6ee7b7" textAnchor="middle" fontSize="10" fontWeight="bold">
                      3. Interneurone (Grey Matter)
                    </text>
                  </g>

                  {/* 4. Ventral Root (Motor Axon) */}
                  <g>
                    <line x1="670" y1="410" x2="670" y2="445" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.8" />
                    <rect x="585" y="445" width="170" height="22" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="#f59e0b" strokeWidth="1" />
                    <text x="670" y="460" fill="#fde68a" textAnchor="middle" fontSize="10" fontWeight="bold">
                      4. Ventral Root (Motor Axon)
                    </text>
                  </g>

                  {/* 5. Biceps Effector Muscle */}
                  <g>
                    <line x1="180" y1="305" x2="150" y2="305" stroke="#a855f7" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.8" />
                    <rect x="10" y="294" width="138" height="22" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="#a855f7" strokeWidth="1" />
                    <text x="79" y="309" fill="#d8b4fe" textAnchor="middle" fontSize="10" fontWeight="bold">
                      5. Biceps Effector Muscle
                    </text>
                  </g>
                </g>
              )}
            </svg>

            {/* Bottom Playback Stage Indicator Bar */}
            <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Reflex Progression:
                </span>
                <div className="flex-1 sm:w-64 bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-rose-500 via-cyan-400 to-amber-400 h-full rounded-full transition-all duration-150"
                    style={{ width: `${(progress * 100).toFixed(0)}%` }}
                  />
                </div>
                <span className="font-mono text-cyan-300 text-xs min-w-[42px]">
                  {(progress * 100).toFixed(0)}%
                </span>
              </div>

              {/* Step Badges for 5 stages */}
              <div className="flex items-center gap-1">
                {REFLEX_STEPS.map((st, idx) => {
                  const isActive = (playbackMode === 'slowmo' && slowMoStep === idx) || (playbackMode === 'realtime' && currentStepInfo.step === st.step);
                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        setPlaybackMode('slowmo');
                        setSlowMoStep(idx);
                        setProgress((idx + 0.8) / REFLEX_STEPS.length);
                        setSimulatedTimeMs(st.timeMs);
                        setActiveStationId(st.stationId);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                        isActive
                          ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/40 scale-105'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      Step {st.step}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Deep Anatomical Station Inspector Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${activeStation.badgeColor}`}>
                    Station {activeStation.num}: {activeStation.badge}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {activeStation.title}
                  </h3>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    ({activeStation.sub})
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeStation.summary}
                </p>

                {/* Bullets */}
                <ul className="space-y-1.5 pt-1">
                  {activeStation.details.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* KCSE Exam Tip Callout Box */}
              <div className="md:w-72 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 rounded-xl p-3.5 shadow-inner">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> KCSE Examination Note
                </div>
                <p className="text-[11px] text-amber-100/90 leading-relaxed">
                  {activeStation.kcseTip}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Synaptic Cleft Deep-Dive */}
      {activeTab === 'synapse_micro' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Spinal Grey Matter Synapse
              </span>
              <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
                <span>Chemical Synaptic Transmission (20 nm Cleft)</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Investigate the molecular cascade of Acetylcholine (ACh) exocytosis, postsynaptic Na⁺ influx, and Acetylcholinesterase (AChE) cleavage.
              </p>
            </div>

            {/* Step Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSynapseStepIndex((prev) => Math.max(prev - 1, 0))}
                disabled={synapseStepIndex === 0}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-semibold hover:bg-slate-700 disabled:opacity-30"
              >
                Previous Step
              </button>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {synapseStepIndex + 1} / {SYNAPSE_STEPS.length}
              </span>
              <button
                onClick={() => setSynapseStepIndex((prev) => Math.min(prev + 1, SYNAPSE_STEPS.length - 1))}
                disabled={synapseStepIndex === SYNAPSE_STEPS.length - 1}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-500 disabled:opacity-30"
              >
                Next Step
              </button>
            </div>
          </div>

          {/* Synapse Interactive Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Visual Canvas (2 Cols) */}
            <div className="lg:col-span-2 bg-slate-950 rounded-xl border border-slate-800 p-3 shadow-inner relative overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 600 400" className="w-full h-auto select-none max-w-lg">
                <defs>
                  <linearGradient id="knobGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </linearGradient>
                  <linearGradient id="postGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>

                {/* Presynaptic Terminal Knob */}
                <path
                  d="
                    M 150, 0
                    L 150, 60
                    C 150, 160  60, 200  80, 250
                    C 100, 280  500, 280  520, 250
                    C 540, 200  450, 160  450, 60
                    L 450, 0
                    Z
                  "
                  fill="url(#knobGrad)"
                  stroke="#2dd4bf"
                  strokeWidth="3"
                />
                <text x="300" y="50" fill="#99f6e4" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Presynaptic Terminal Bulb
                </text>

                {/* Voltage-Gated Ca²⁺ Channels */}
                <g transform="translate(100, 230)">
                  <rect x="-8" y="-15" width="16" height="30" rx="3" fill={synapseStepIndex >= 1 ? '#eab308' : '#475569'} stroke="#fef08a" strokeWidth="1.5" />
                  <text x="-15" y="-20" fill="#fef08a" fontSize="9" fontWeight="bold">Ca²⁺ Channel</text>
                  {synapseStepIndex >= 1 && (
                    <g className="animate-bounce">
                      <circle cx="0" cy="25" r="4" fill="#fde047" />
                      <text x="0" y="28" fill="#713f12" fontSize="6" fontWeight="bold" textAnchor="middle">Ca²⁺</text>
                    </g>
                  )}
                </g>

                <g transform="translate(500, 230)">
                  <rect x="-8" y="-15" width="16" height="30" rx="3" fill={synapseStepIndex >= 1 ? '#eab308' : '#475569'} stroke="#fef08a" strokeWidth="1.5" />
                  {synapseStepIndex >= 1 && (
                    <g className="animate-bounce">
                      <circle cx="0" cy="25" r="4" fill="#fde047" />
                      <text x="0" y="28" fill="#713f12" fontSize="6" fontWeight="bold" textAnchor="middle">Ca²⁺</text>
                    </g>
                  )}
                </g>

                {/* Synaptic Vesicles with Acetylcholine (ACh) */}
                <g id="synaptic-vesicles">
                  <circle cx="200" cy="150" r="16" fill="#0d9488" stroke="#5eead4" strokeWidth="2" />
                  <circle cx="200" cy="150" r="4" fill="#fef08a" />
                  
                  <circle cx="280" cy="130" r="16" fill="#0d9488" stroke="#5eead4" strokeWidth="2" />
                  <circle cx="280" cy="130" r="4" fill="#fef08a" />

                  <circle cx="380" cy="150" r="16" fill="#0d9488" stroke="#5eead4" strokeWidth="2" />
                  <circle cx="380" cy="150" r="4" fill="#fef08a" />

                  {/* Vesicle docking and exocytosis */}
                  {synapseStepIndex >= 2 && (
                    <g>
                      <circle cx="300" cy="245" r="15" fill="#14b8a6" stroke="#fef08a" strokeWidth="2" />
                      <circle cx="295" cy="245" r="3" fill="#ffffff" />
                      <circle cx="305" cy="245" r="3" fill="#ffffff" />
                    </g>
                  )}
                </g>

                {/* Synaptic Cleft (20 nm space) */}
                <rect x="50" y="278" width="500" height="32" fill="#020617" opacity="0.7" />
                <text x="50" y="298" fill="#64748b" fontSize="10" fontWeight="bold">Synaptic Cleft (20 nm)</text>

                {/* Acetylcholine (ACh) molecules in cleft */}
                {synapseStepIndex >= 2 && (
                  <g fill="#f59e0b" stroke="#fef3c7" strokeWidth="0.8">
                    <circle cx="240" cy="292" r="3.5" />
                    <circle cx="280" cy="295" r="3.5" />
                    <circle cx="320" cy="290" r="3.5" />
                    <circle cx="360" cy="294" r="3.5" />
                  </g>
                )}

                {/* Acetylcholinesterase (AChE) Enzymes */}
                <g transform="translate(420, 290)">
                  <polygon points="0,-6 6,6 -6,6" fill="#ec4899" stroke="#fbcfe8" strokeWidth="1" />
                  <text x="12" y="3" fill="#f472b6" fontSize="8" fontWeight="bold">AChE Enzyme</text>
                </g>

                {/* Postsynaptic Membrane */}
                <path
                  d="
                    M 60, 310
                    C 80, 305  520, 305  540, 310
                    L 540, 395
                    L 60, 395
                    Z
                  "
                  fill="url(#postGrad)"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
                <text x="300" y="365" fill="#93c5fd" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Postsynaptic Membrane (Relay / Motor Neurone)
                </text>

                {/* Ligand-Gated Na⁺ Receptor Channels on Postsynaptic Membrane */}
                <g transform="translate(240, 310)">
                  <rect x="-10" y="-5" width="20" height="15" rx="2" fill={synapseStepIndex >= 3 ? '#22c55e' : '#334155'} stroke="#86efac" strokeWidth="1.5" />
                  {synapseStepIndex >= 3 && (
                    <text x="0" y="22" fill="#4ade80" fontSize="8" fontWeight="bold" textAnchor="middle">Na⁺ Influx</text>
                  )}
                </g>

                <g transform="translate(360, 310)">
                  <rect x="-10" y="-5" width="20" height="15" rx="2" fill={synapseStepIndex >= 3 ? '#22c55e' : '#334155'} stroke="#86efac" strokeWidth="1.5" />
                  {synapseStepIndex >= 3 && (
                    <text x="0" y="22" fill="#4ade80" fontSize="8" fontWeight="bold" textAnchor="middle">Na⁺ Influx</text>
                  )}
                </g>
              </svg>
            </div>

            {/* Stepper Explanations (1 Col) */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Synaptic Sequence
              </h3>
              <div className="space-y-2">
                {SYNAPSE_STEPS.map((st, idx) => {
                  const isCur = idx === synapseStepIndex;
                  return (
                    <div
                      key={st.step}
                      onClick={() => setSynapseStepIndex(idx)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isCur
                          ? 'bg-cyan-950/70 border-cyan-500/80 shadow-md shadow-cyan-900/30'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">
                          {st.step}. {st.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
                          {st.badge}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        {st.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Pesticide / Clinical Alert */}
              <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3 text-xs text-rose-200">
                <div className="flex items-center gap-1.5 font-bold text-rose-300 mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Organophosphate Toxicology (KCSE Application)
                </div>
                <p className="text-[11px] leading-relaxed text-rose-200/90">
                  Organophosphate insecticides inhibit Acetylcholinesterase (AChE). ACh accumulates unchecked in the cleft, causing continuous postsynaptic depolarization and violent tetanic muscle convulsions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: KCSE Exam Practice & Quiz */}
      {activeTab === 'kcse_quiz' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                KCSE Revision Mastery
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Form 4 Biology Topic 3: Reflex Arc Self-Assessment
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Test your mastery of the Bell-Magendie law, dorsal root ganglion, synaptic delays, and protective withdrawal mechanisms.
              </p>
            </div>

            {quizSubmitted && (
              <div className="bg-slate-950 border border-slate-700 px-4 py-2 rounded-xl text-center self-start sm:self-auto">
                <div className="text-xs text-slate-400 uppercase font-semibold">Your Score</div>
                <div className="text-xl font-black text-cyan-400">
                  {KCSE_EXAM_QUESTIONS.filter((q) => userAnswers[q.id] === q.correct).length} / {KCSE_EXAM_QUESTIONS.length}
                </div>
              </div>
            )}
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {KCSE_EXAM_QUESTIONS.map((q, qIndex) => {
              const answered = userAnswers[q.id] !== undefined;
              const isCorrect = userAnswers[q.id] === q.correct;
              return (
                <div
                  key={q.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 shadow-inner"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pt-1 pl-8">
                    {q.options.map((optionText, optIndex) => {
                      const isSelected = userAnswers[q.id] === optIndex;
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700';

                      if (quizSubmitted) {
                        if (optIndex === q.correct) {
                          btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold';
                        } else if (isSelected && optIndex !== q.correct) {
                          btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-semibold';
                      }

                      return (
                        <button
                          key={optIndex}
                          disabled={quizSubmitted}
                          onClick={() => setUserAnswers((prev) => ({ ...prev, [q.id]: optIndex }))}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{optionText}</span>
                          {quizSubmitted && optIndex === q.correct && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                          )}
                          {quizSubmitted && isSelected && optIndex !== q.correct && (
                            <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Callout */}
                  {quizSubmitted && (
                    <div className={`p-3 rounded-lg text-xs leading-relaxed mt-2 border ${
                      isCorrect ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200' : 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                    }`}>
                      <strong>Rationale:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit / Reset Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {quizSubmitted ? (
              <button
                onClick={() => {
                  setUserAnswers({});
                  setQuizSubmitted(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
              </button>
            ) : (
              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(userAnswers).length < KCSE_EXAM_QUESTIONS.length}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white shadow-lg shadow-cyan-600/30 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Submit Answers
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
