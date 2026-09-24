import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  Zap,
  Flame,
  Activity,
  ZoomIn,
  ZoomOut,
  Award,
  Info,
  ChevronRight,
  ShieldAlert,
  Radio
} from 'lucide-react';

// Stages for the reflex arc animation
const REFLEX_STAGES = [
  { id: 'idle', label: 'Resting State (-70 mV)', desc: 'Receptors waiting for noxious stimulus.' },
  { id: 'stimulus', label: '1. Noxious Stimulus Detected', desc: 'Thermal/mechanical sensory receptor generates generator potential exceeding threshold (-55 mV).' },
  { id: 'afferent', label: '2. Sensory Neurone Conduction', desc: 'Action potential propagates along afferent axon, passing dorsal root ganglion into dorsal horn of spinal cord.' },
  { id: 'synapse1', label: '3. Synapse I: Grey Matter Relay', desc: 'Presynaptic terminal depolarizes; neurotransmitter diffuses across cleft to relay (intermediate) neurone.' },
  { id: 'relay', label: '4. Interneurone Integration', desc: 'Bypasses cerebral cortex! Relay neurone processes signal directly in spinal grey matter for rapid emergency response.' },
  { id: 'synapse2', label: '5. Synapse II: Motor Output', desc: 'Relay neurone excites cell body of motor neurone in the ventral horn.' },
  { id: 'efferent', label: '6. Efferent Motor Neurone', desc: 'Rapid saltatory impulse travels via ventral root towards neuromuscular junction.' },
  { id: 'effector', label: '7. Biceps Muscle Withdrawal', desc: 'Motor end-plate triggers Ca²⁺ release: biceps contract, forearm flexes away from danger.' }
];

// Synaptic sequence steps
const SYNAPSE_STEPS = [
  {
    step: 1,
    title: 'Action Potential Influx',
    badge: 'Depolarization',
    detail: 'Wave of depolarization arrives at presynaptic terminal knob, altering membrane potential from -70 mV to +30 mV.'
  },
  {
    step: 2,
    title: 'Voltage-Gated Ca²⁺ Channels Open',
    badge: 'Ca²⁺ Influx',
    detail: 'Depolarization causes voltage-gated Calcium ion channels to open; Ca²⁺ rushes down steep gradient into the knob.'
  },
  {
    step: 3,
    title: 'Synaptic Vesicle Exocytosis',
    badge: 'Exocytosis',
    detail: 'Elevated cytosolic Ca²⁺ triggers synaptotagmin; synaptic vesicles fuse with presynaptic membrane and discharge Acetylcholine (ACh) into the 20 nm synaptic cleft.'
  },
  {
    step: 4,
    title: 'Diffusion & Receptor Binding',
    badge: 'EPSP Generation',
    detail: 'ACh diffuses across 20nm cleft and binds to ligand-gated receptors on postsynaptic membrane, opening Na⁺ channels to generate an Excitatory Postsynaptic Potential (EPSP).'
  },
  {
    step: 5,
    title: 'Enzymatic Hydrolysis by AChE',
    badge: 'AChE Cleavage',
    detail: 'Acetylcholinesterase (AChE) hydrolyses ACh into Acetate and Choline, preventing continuous sustained depolarization.'
  },
  {
    step: 6,
    title: 'Choline Reuptake & Recycling',
    badge: 'Reuptake',
    detail: 'Choline is actively transported back into the presynaptic bulb via choline transporters (ChT) and resynthesized into ACh by Choline Acetyltransferase (ChAT).'
  }
];

// KCSE Form 4 Exam Questions
const KCSE_QUESTIONS = [
  {
    id: 1,
    question: 'Why does a reflex arc allow a withdrawal response before the sensation of pain is consciously perceived in the brain?',
    options: [
      'Sensory impulses never travel to the brain under any circumstances.',
      'The impulse travels through the spinal cord relay neurone directly to the motor neurone, while ascending pathways to the brain are longer and slower.',
      'Motor neurones transmit faster than sensory neurones because they are unmyelinated.',
      'Acetylcholine only operates in the peripheral nerves and cannot excite brain tissue.'
    ],
    correct: 1,
    explanation: 'The spinal reflex is automatic and involuntary. The shorter 3-neurone pathway in the spinal grey matter triggers immediate muscle contraction before ascending collateral sensory tracts reach the sensory cortex of the cerebrum.'
  },
  {
    id: 2,
    question: 'What is the precise physiological role of Acetylcholinesterase (AChE) located within the synaptic cleft?',
    options: [
      'To synthesize acetylcholine from glucose and amino acids.',
      'To pump calcium ions out of the synaptic terminal.',
      'To break down acetylcholine into acetate and choline, terminating synaptic transmission and preventing tetanic muscle spasm.',
      'To depolarize the postsynaptic membrane by creating action potentials directly.'
    ],
    correct: 2,
    explanation: 'AChE hydrolyses ACh in sub-milliseconds into inactive acetate and choline. Without AChE, postsynaptic receptors would remain permanently open, causing continuous uncontrolled muscle contractions (as seen in organophosphate poisoning).'
  },
  {
    id: 3,
    question: 'In the mammalian spinal cord, what structures enter through the dorsal root and exit through the ventral root respectively?',
    options: [
      'Dorsal root: Motor neurones; Ventral root: Sensory neurones.',
      'Dorsal root: Relay neurones; Ventral root: Autonomic neurones.',
      'Dorsal root: Sensory (afferent) neurones with cell bodies in dorsal root ganglion; Ventral root: Motor (efferent) neurones.',
      'Dorsal root: Grey matter axons; Ventral root: White matter columns.'
    ],
    correct: 2,
    explanation: 'Sensory (afferent) neurones enter through the dorsal root and their cell bodies form the dorsal root ganglion. Motor (efferent) axons exit via the ventral root to innervate effectors.'
  },
  {
    id: 4,
    question: 'What triggers the synaptic vesicles containing neurotransmitter to fuse with the presynaptic terminal membrane?',
    options: [
      'Efflux of potassium (K⁺) ions into the synaptic cleft.',
      'Influx of extracellular calcium (Ca²⁺) ions through voltage-gated channels upon arrival of an action potential.',
      'Hydrolysis of ATP directly by acetylcholinesterase.',
      'Binding of sodium ions to postsynaptic receptor sites.'
    ],
    correct: 1,
    explanation: 'Depolarization of the terminal knob opens voltage-gated Ca²⁺ channels. The steep influx of Ca²⁺ activates SNARE complexes, causing exocytosis of neurotransmitter-filled vesicles.'
  }
];

export default function ReflexArcSynapticTransmissionSim({ config = {}, onTelemetry }) {
  // View mode: 'arc' or 'synapse'
  const [viewMode, setViewMode] = useState('arc');
  const [stimulusType, setStimulusType] = useState('flame'); // 'flame' | 'pin'
  const [isFiring, setIsFiring] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1 for reflex arc
  const [synapseStep, setSynapseStep] = useState(0); // 0 to 5 for synapse steps
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'theory' | 'quiz'

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [score, setScore] = useState(0);

  const reflexCanvasRef = useRef(null);
  const synapseCanvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Trigger Reflex Arc Action
  const handleTriggerReflex = useCallback(() => {
    if (isFiring) return;
    setIsFiring(true);
    setProgress(0);

    const startTime = performance.now();
    const duration = 2800; // 2.8 seconds total transit

    const animateReflex = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animateReflex);
      } else {
        setIsFiring(false);
        if (typeof onTelemetry === 'function') {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            type: 'REFLEX_ARC_COMPLETED',
            stimulus: stimulusType,
            speed: 'Rapid Spinal Reflex (~15-20 ms biological latency)'
          });
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animateReflex);
  }, [isFiring, stimulusType, onTelemetry]);

  // Reset simulation
  const handleReset = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsFiring(false);
    setProgress(0);
    setSynapseStep(0);
  };

  // Determine current active stage of reflex
  const getCurrentStageIndex = () => {
    if (progress === 0 && !isFiring) return 0;
    if (progress < 0.12) return 1; // stimulus
    if (progress < 0.38) return 2; // afferent
    if (progress < 0.48) return 3; // synapse 1
    if (progress < 0.62) return 4; // relay interneurone
    if (progress < 0.72) return 5; // synapse 2
    if (progress < 0.88) return 6; // efferent motor
    return 7; // effector muscle contract
  };

  const currentStage = REFLEX_STAGES[getCurrentStageIndex()];

  // Draw Reflex Arc Canvas
  useEffect(() => {
    if (viewMode !== 'arc') return;
    const canvas = reflexCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Dark sleek lab background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle grid
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
    ctx.lineWidth = 1;
    for (let x = 30; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 30; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 1. Draw Spinal Cord Section (Cross-Section White/Grey Matter)
    ctx.save();
    const scX = 640;
    const scY = 70;
    const scW = 230;
    const scH = 260;

    // Spinal cord boundary (White Matter)
    ctx.beginPath();
    ctx.ellipse(scX + scW / 2, scY + scH / 2, scW / 2, scH / 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#475569';
    ctx.stroke();

    // Central Canal
    ctx.beginPath();
    ctx.arc(scX + scW / 2, scY + scH / 2, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.stroke();

    // Spinal Grey Matter (Butterfly / H-shape)
    ctx.beginPath();
    ctx.moveTo(scX + 70, scY + 50); // Dorsal horn
    ctx.bezierCurveTo(scX + 85, scY + 100, scX + 85, scY + 140, scX + 65, scY + 195); // Ventral horn
    ctx.bezierCurveTo(scX + 95, scY + 180, scX + 105, scY + 145, scX + 115, scY + 140); // Commissure bottom
    ctx.bezierCurveTo(scX + 125, scY + 145, scX + 135, scY + 180, scX + 165, scY + 195); // Right ventral horn
    ctx.bezierCurveTo(scX + 145, scY + 140, scX + 145, scY + 100, scX + 160, scY + 50); // Right dorsal horn
    ctx.bezierCurveTo(scX + 135, scY + 80, scX + 125, scY + 115, scX + 115, scY + 120); // Commissure top
    ctx.bezierCurveTo(scX + 105, scY + 115, scX + 95, scY + 80, scX + 70, scY + 50);
    ctx.closePath();

    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    // Grey matter labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText('Grey Matter', scX + 85, scY + 128);
    ctx.fillText('White Matter', scX + 140, scY + 230);
    ctx.restore();

    // 2. Anatomical Roots (Dorsal Root & Ventral Root)
    ctx.beginPath();
    ctx.moveTo(430, 140);
    ctx.bezierCurveTo(490, 120, 560, 110, 710, 120);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Dorsal Root Ganglion Swelling
    ctx.beginPath();
    ctx.ellipse(470, 128, 22, 14, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ventral root tube
    ctx.beginPath();
    ctx.moveTo(710, 240);
    ctx.bezierCurveTo(600, 260, 500, 290, 360, 300);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 12;
    ctx.stroke();

    // 3. Cutaneous Receptor & Stimulus
    const armX = 130;
    const armY = 320;

    // Skin layer
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.roundRect(armX - 50, armY - 15, 100, 30, 8);
    ctx.fill();
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('Skin Pain Receptor', armX - 45, armY + 4);

    // Stimulus source
    if (stimulusType === 'flame') {
      ctx.beginPath();
      ctx.moveTo(armX, armY + 36);
      ctx.bezierCurveTo(armX - 16, armY + 22, armX - 12, armY - 5, armX, armY - 18);
      ctx.bezierCurveTo(armX + 12, armY - 5, armX + 16, armY + 22, armX, armY + 36);
      ctx.fillStyle = '#f97316';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(armX, armY + 32);
      ctx.bezierCurveTo(armX - 7, armY + 20, armX - 5, armY + 4, armX, armY - 6);
      ctx.bezierCurveTo(armX + 5, armY + 4, armX + 7, armY + 20, armX, armY + 32);
      ctx.fillStyle = '#fef08a';
      ctx.fill();

      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(armX - 8, armY + 36, 16, 26);
    } else {
      ctx.beginPath();
      ctx.moveTo(armX, armY - 2);
      ctx.lineTo(armX - 25, armY + 40);
      ctx.lineTo(armX - 20, armY + 42);
      ctx.lineTo(armX + 2, armY - 1);
      ctx.fillStyle = '#94a3b8';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(armX, armY - 2, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
    }

    // 4. Arm / Effector Muscle (Biceps)
    const muscleX = 220;
    const muscleY = 190;
    const isContracted = progress > 0.88;
    const muscleScale = isContracted ? 1.25 : 1.0;

    ctx.save();
    ctx.translate(muscleX, muscleY);

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.roundRect(-70, 10, 140, 16, 8);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, -10, 55 * muscleScale, 22 * (isContracted ? 1.4 : 1.0), 0, 0, Math.PI * 2);
    const mGrad = ctx.createLinearGradient(-50, -20, 50, 0);
    mGrad.addColorStop(0, isContracted ? '#dc2626' : '#b91c1c');
    mGrad.addColorStop(1, isContracted ? '#ef4444' : '#991b1b');
    ctx.fillStyle = mGrad;
    ctx.fill();
    ctx.strokeStyle = isContracted ? '#fef08a' : '#7f1d1d';
    ctx.lineWidth = isContracted ? 3 : 1.5;
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-65, -12, 18, 10);
    ctx.fillRect(47, -12, 18, 10);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(isContracted ? 'BICEPS CONTRACTED!' : 'Effector (Biceps)', -50, -38);
    ctx.restore();

    // 5. Neurone Pathways
    const sensoryP0 = { x: armX, y: armY - 15 };
    const sensoryP1 = { x: 300, y: 180 };
    const sensoryDRG = { x: 470, y: 128 };
    const sensorySyn1 = { x: 710, y: 120 };

    ctx.beginPath();
    ctx.moveTo(sensoryP0.x, sensoryP0.y);
    ctx.bezierCurveTo(sensoryP1.x, sensoryP1.y, 400, 140, sensoryDRG.x, sensoryDRG.y);
    ctx.bezierCurveTo(530, 120, 620, 110, sensorySyn1.x, sensorySyn1.y);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Sensory Cell Body in Ganglion
    ctx.beginPath();
    ctx.arc(sensoryDRG.x, sensoryDRG.y, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#0284c7';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Relay Neurone
    const relayP0 = sensorySyn1;
    const relayP1 = { x: 730, y: 180 };
    const relaySyn2 = { x: 710, y: 240 };

    ctx.beginPath();
    ctx.moveTo(relayP0.x, relayP0.y);
    ctx.bezierCurveTo(relayP1.x - 20, relayP1.y, relayP1.x + 10, relayP1.y + 20, relaySyn2.x, relaySyn2.y);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Relay cell body
    ctx.beginPath();
    ctx.arc(722, 175, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#9333ea';
    ctx.fill();
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Motor Neurone
    const motorP0 = relaySyn2;
    const motorP1 = { x: 550, y: 290 };
    const motorEffector = { x: muscleX, y: muscleY - 10 };

    ctx.beginPath();
    ctx.moveTo(motorP0.x, motorP0.y);
    ctx.bezierCurveTo(motorP1.x, motorP1.y, 350, 310, motorEffector.x, motorEffector.y);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Motor soma
    ctx.beginPath();
    ctx.arc(motorP0.x, motorP0.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#16a34a';
    ctx.fill();
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 6. Action Potential Pulse Particle Animation
    if (progress > 0 && progress < 1) {
      let pulseX = 0;
      let pulseY = 0;
      let glowColor = '#facc15';

      if (progress <= 0.4) {
        const t = progress / 0.4;
        if (t < 0.6) {
          const subT = t / 0.6;
          pulseX = (1 - subT) * sensoryP0.x + subT * sensoryDRG.x;
          pulseY = (1 - subT) * sensoryP0.y + subT * sensoryDRG.y;
        } else {
          const subT = (t - 0.6) / 0.4;
          pulseX = (1 - subT) * sensoryDRG.x + subT * sensorySyn1.x;
          pulseY = (1 - subT) * sensoryDRG.y + subT * sensorySyn1.y;
        }
        glowColor = '#38bdf8';
      } else if (progress <= 0.65) {
        const t = (progress - 0.4) / 0.25;
        pulseX = (1 - t) * relayP0.x + t * relaySyn2.x;
        pulseY = (1 - t) * relayP0.y + t * relaySyn2.y;
        glowColor = '#c084fc';
      } else {
        const t = (progress - 0.65) / 0.35;
        pulseX = (1 - t) * motorP0.x + t * motorEffector.x;
        pulseY = (1 - t) * motorP0.y + t * motorEffector.y;
        glowColor = '#4ade80';
      }

      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = glowColor;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      for (let i = 0; i < 4; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = 12 + Math.random() * 8;
        ctx.beginPath();
        ctx.moveTo(pulseX, pulseY);
        ctx.lineTo(pulseX + Math.cos(ang) * dist, pulseY + Math.sin(ang) * dist);
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 7. Labels
    const drawBadge = (x, y, text, color) => {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x - 5, y - 12, text.length * 6.5 + 10, 20, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '10px sans-serif';
      ctx.fillText(text, x, y + 2);
      ctx.restore();
    };

    drawBadge(420, 105, 'Dorsal Root Ganglion (DRG)', '#f59e0b');
    drawBadge(sensorySyn1.x - 30, sensorySyn1.y - 14, 'Synapse I (Dorsal Horn)', '#38bdf8');
    drawBadge(725, 205, 'Interneurone (Relay)', '#c084fc');
    drawBadge(motorP0.x - 20, motorP0.y + 26, 'Synapse II (Ventral Horn)', '#22c55e');
    drawBadge(460, 315, 'Ventral Root (Motor)', '#22c55e');

  }, [viewMode, progress, isFiring, stimulusType]);

  // Draw Synapse Canvas
  useEffect(() => {
    if (viewMode !== 'synapse') return;
    const canvas = synapseCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0a0f1d');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Presynaptic Terminal Knob
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(80, 0);
    ctx.lineTo(80, 70);
    ctx.bezierCurveTo(100, 180, 160, 220, width / 2, 220);
    ctx.bezierCurveTo(width - 160, 220, width - 100, 180, width - 80, 70);
    ctx.lineTo(width - 80, 0);
    ctx.closePath();

    const preGrad = ctx.createLinearGradient(0, 0, 0, 220);
    preGrad.addColorStop(0, '#1e293b');
    preGrad.addColorStop(1, synapseStep >= 1 ? '#334155' : '#1e293b');
    ctx.fillStyle = preGrad;
    ctx.fill();
    ctx.strokeStyle = synapseStep >= 1 ? '#38bdf8' : '#64748b';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Synaptic Cleft
    ctx.fillStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.fillRect(80, 222, width - 160, 52);

    // Postsynaptic Membrane
    ctx.beginPath();
    ctx.moveTo(80, 275);
    ctx.bezierCurveTo(180, 275, 300, 280, width / 2, 280);
    ctx.bezierCurveTo(width - 300, 280, width - 180, 275, width - 80, 275);
    ctx.lineTo(width - 80, height);
    ctx.lineTo(80, height);
    ctx.closePath();

    const postGrad = ctx.createLinearGradient(0, 275, 0, height);
    postGrad.addColorStop(0, synapseStep >= 4 ? '#3b0764' : '#1e1b4b');
    postGrad.addColorStop(1, '#090514');
    ctx.fillStyle = postGrad;
    ctx.fill();
    ctx.strokeStyle = synapseStep >= 4 ? '#c084fc' : '#4f46e5';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    // Ca²⁺ Channels
    const drawCaChannel = (x, y, isOpen) => {
      ctx.save();
      ctx.fillStyle = isOpen ? '#22c55e' : '#64748b';
      ctx.fillRect(x - 10, y - 18, 20, 36);
      ctx.fillStyle = '#0f172a';
      if (isOpen) {
        ctx.fillRect(x - 3, y - 18, 6, 36);
      }
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x - 10, y - 18, 20, 36);
      ctx.restore();
    };

    drawCaChannel(180, 210, synapseStep >= 2);
    drawCaChannel(width - 180, 210, synapseStep >= 2);

    // Ca²⁺ ions
    if (synapseStep >= 2) {
      ctx.save();
      const ions = [
        { x: 170, y: 170 }, { x: 190, y: 155 }, { x: 205, y: 185 },
        { x: width - 170, y: 170 }, { x: width - 195, y: 155 }, { x: width - 210, y: 185 }
      ];
      ions.forEach(ion => {
        ctx.beginPath();
        ctx.arc(ion.x, ion.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#4ade80';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.fillStyle = '#052e16';
        ctx.font = 'bold 7px sans-serif';
        ctx.fillText('Ca²⁺', ion.x - 6, ion.y + 3);
      });
      ctx.restore();
    }

    // Synaptic Vesicles with ACh
    const vesicles = [
      { x: 260, y: 80, fused: false },
      { x: 340, y: 110, fused: false },
      { x: 420, y: 70, fused: false },
      { x: 500, y: 105, fused: false },
      { x: 580, y: 85, fused: false },
      { x: 380, y: 160, fused: synapseStep >= 3 },
      { x: 460, y: 165, fused: synapseStep >= 3 },
      { x: 530, y: 155, fused: synapseStep >= 3 }
    ];

    vesicles.forEach(v => {
      ctx.save();
      if (!v.fused) {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.stroke();

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (Math.abs(i) + Math.abs(j) <= 1) {
              ctx.beginPath();
              ctx.arc(v.x + i * 6, v.y + j * 6, 2.5, 0, Math.PI * 2);
              ctx.fillStyle = '#fbbf24';
              ctx.fill();
            }
          }
        }
      } else {
        ctx.beginPath();
        ctx.arc(v.x, 215, 16, Math.PI, 0, true);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.restore();
    });

    // ACh molecules in Cleft
    if (synapseStep >= 3 && synapseStep < 5) {
      ctx.save();
      const achInCleft = [
        { x: 300, y: 245 }, { x: 340, y: 255 }, { x: 380, y: 235 },
        { x: 410, y: 250 }, { x: 440, y: 240 }, { x: 470, y: 260 },
        { x: 510, y: 245 }, { x: 540, y: 235 }, { x: 580, y: 255 }
      ];

      achInCleft.forEach(ach => {
        ctx.beginPath();
        ctx.arc(ach.x, ach.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.fill();
      });
      ctx.restore();
    }

    // Receptors
    const receptors = [
      { x: 260, y: 278 },
      { x: 340, y: 280 },
      { x: 420, y: 281 },
      { x: 500, y: 281 },
      { x: 580, y: 280 }
    ];

    receptors.forEach((rec) => {
      const isBound = synapseStep >= 4 && synapseStep < 5;
      ctx.save();
      ctx.fillStyle = isBound ? '#10b981' : '#6366f1';
      ctx.beginPath();
      ctx.roundRect(rec.x - 14, rec.y - 4, 28, 20, 4);
      ctx.fill();
      ctx.strokeStyle = '#e0e7ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(rec.x, rec.y - 3, 5, 0, Math.PI);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      if (isBound) {
        ctx.beginPath();
        ctx.arc(rec.x, rec.y - 3, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(rec.x, rec.y + 18);
        ctx.lineTo(rec.x, rec.y + 36);
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText('Na⁺ ↓', rec.x - 10, rec.y + 48);
      }
      ctx.restore();
    });

    // AChE
    const achePositions = [{ x: 310, y: 235 }, { x: 460, y: 232 }, { x: 610, y: 236 }];
    achePositions.forEach(pos => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ec4899';
      ctx.fill();
      ctx.strokeStyle = '#fbcfe8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('AChE', pos.x - 8, pos.y + 2.5);

      if (synapseStep >= 5) {
        ctx.beginPath();
        ctx.arc(pos.x - 12, pos.y - 8, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pos.x + 12, pos.y - 8, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ea580c';
        ctx.fill();
      }
      ctx.restore();
    });

    // Choline Reuptake
    if (synapseStep >= 5) {
      ctx.save();
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(width / 2 - 20, 210, 40, 16);
      ctx.strokeStyle = '#a5f3fc';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(width / 2 - 20, 210, 40, 16);

      ctx.fillStyle = '#ffffff';
      ctx.font = '8px sans-serif';
      ctx.fillText('ChT Reuptake', width / 2 - 26, 204);

      ctx.beginPath();
      ctx.arc(width / 2, 218, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#22c55e';
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('PRE-SYNAPTIC TERMINAL KNOB', 90, 30);
    ctx.fillText('SYNAPTIC CLEFT (20 nm)', 90, 240);
    ctx.fillText('POST-SYNAPTIC MEMBRANE (Dendrite / Muscle Sarcolemma)', 90, 310);

  }, [viewMode, synapseStep]);

  // Quiz submission handler
  const handleAnswerSelect = (qId, optionIdx) => {
    if (submittedQuiz) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    let newScore = 0;
    KCSE_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setSubmittedQuiz(true);

    if (typeof onTelemetry === 'function') {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        type: 'REFLEX_SYNAPSE_QUIZ_COMPLETED',
        score: newScore,
        maxScore: KCSE_QUESTIONS.length,
        percentage: Math.round((newScore / KCSE_QUESTIONS.length) * 100)
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuiz(false);
    setScore(0);
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-3xl p-4 md:p-6 border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Simulation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Spinal Reflex Arc & Synaptic Transmission
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  KCSE Biology Form 4
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Topic 3: Reception, Response and Coordination in Animals • 3-Neurone Reflex Arc & Biochemical Synapse
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl self-start md:self-auto">
          <button
            onClick={() => setViewMode('arc')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'arc'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Reflex Arc (Spinal)
          </button>
          <button
            onClick={() => setViewMode('synapse')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'synapse'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
            Chemical Synapse (20nm)
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Visualization Panel (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative w-full aspect-[16/10] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
            {viewMode === 'arc' ? (
              <canvas
                ref={reflexCanvasRef}
                width={800}
                height={500}
                className="w-full h-full object-contain"
              />
            ) : (
              <canvas
                ref={synapseCanvasRef}
                width={800}
                height={500}
                className="w-full h-full object-contain"
              />
            )}

            {/* In-Canvas Controls */}
            {viewMode === 'arc' && (
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stimulus:</span>
                <button
                  onClick={() => setStimulusType('flame')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    stimulusType === 'flame'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" /> Flame Heat
                </button>
                <button
                  onClick={() => setStimulusType('pin')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    stimulusType === 'pin'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" /> Pin Prick
                </button>
              </div>
            )}

            {/* Zoom to Synapse button */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'arc' ? 'synapse' : 'arc')}
                className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 rounded-xl backdrop-blur-md shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                {viewMode === 'arc' ? (
                  <>
                    <ZoomIn className="w-3.5 h-3.5 text-cyan-400" /> Zoom to Synapse
                  </>
                ) : (
                  <>
                    <ZoomOut className="w-3.5 h-3.5 text-amber-400" /> Whole Reflex Arc
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Action Bar & Step Guide */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            {viewMode === 'arc' ? (
              <>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={handleTriggerReflex}
                    disabled={isFiring}
                    className="flex-1 md:flex-initial px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {isFiring ? 'Conducting Reflex...' : 'Trigger Reflex Arc'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
                    title="Reset Simulation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 text-right md:pl-4">
                  <div className="text-xs font-bold text-slate-200">
                    {currentStage.label}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {currentStage.desc}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 md:pb-0">
                  {SYNAPSE_STEPS.map((step, idx) => (
                    <button
                      key={step.step}
                      onClick={() => setSynapseStep(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        synapseStep === idx
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {step.step}. {step.badge}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setSynapseStep((prev) => (prev + 1) % SYNAPSE_STEPS.length)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Information & KCSE Challenge Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'simulation'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mechanism
            </button>
            <button
              onClick={() => setActiveTab('theory')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'theory'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Anatomy Specs
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-slate-800 text-amber-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              KCSE Quiz
            </button>
          </div>

          {activeTab === 'simulation' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3.5 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                <ShieldAlert className="w-4 h-4" />
                Survival Value of Spinal Reflex
              </div>
              <p className="text-slate-300 leading-relaxed">
                A reflex action is an <strong>involuntary, rapid, and stereotypic response</strong> to an environmental stimulus.
                Because the intermediate (relay) neurone completes the circuit in the grey matter of the spinal cord, muscular withdrawal begins <em>before</em> pain reaches the cerebral cortex.
              </p>

              <div className="space-y-2 mt-1">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-sky-400 block">Sensory Neurone (Afferent)</span>
                    <span className="text-slate-400 text-[11px]">
                      Cell body in dorsal root ganglion; long dendron, short axon entering dorsal horn.
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-purple-400 block">Relay Neurone (Interneurone)</span>
                    <span className="text-slate-400 text-[11px]">
                      Confined entirely within the spinal grey matter. Synapses with sensory and motor neurones.
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-400 block">Motor Neurone (Efferent)</span>
                    <span className="text-slate-400 text-[11px]">
                      Cell body in ventral horn; axon travels out through ventral root to neuromuscular end plates.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theory' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 text-xs">
              <h3 className="text-slate-200 font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-400" />
                Synaptic Cleft Biochemistry
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Cleft Width</span>
                  <span className="text-cyan-300 font-mono font-bold text-sm">≈ 20 nm</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Diffusion Time</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">0.5 ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Primary Transmitter</span>
                  <span className="text-amber-300 font-bold text-xs">Acetylcholine (ACh)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Degrading Enzyme</span>
                  <span className="text-pink-400 font-bold text-xs">AChE Esterase</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 text-[11px] leading-relaxed">
                <strong>Why Synapses Ensure Unidirectional Flow:</strong> Synaptic vesicles storing neurotransmitters exist <em>only</em> in the presynaptic knob, and specific receptor proteins exist <em>only</em> on the postsynaptic membrane. Impulses can never conduct backward.
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> KCSE Exam Challenge
                </span>
                {submittedQuiz && (
                  <span className="font-bold text-emerald-400">
                    Score: {score} / {KCSE_QUESTIONS.length} ({Math.round((score / KCSE_QUESTIONS.length) * 100)}%)
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
                {KCSE_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col gap-2">
                    <p className="font-bold text-slate-200">
                      {idx + 1}. {q.question}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[q.id] === optIdx;
                        const isCorrect = q.correct === optIdx;
                        let btnStyle = 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700';

                        if (submittedQuiz) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-amber-500/20 border-amber-500 text-amber-300';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswerSelect(q.id, optIdx)}
                            className={`p-2 rounded-lg text-left text-[11px] border transition-all cursor-pointer ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {submittedQuiz && (
                      <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-700/40">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                {!submittedQuiz ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < KCSE_QUESTIONS.length}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-40"
                  >
                    Submit Answers
                  </button>
                ) : (
                  <button
                    onClick={handleResetQuiz}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Retake Challenge
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
