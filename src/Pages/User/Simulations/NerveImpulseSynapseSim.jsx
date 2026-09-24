import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Zap,
  Activity,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  Radio,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  XCircle,
  Award,
  Info,
  ChevronRight,
  ChevronLeft,
  Sliders,
  FlaskConical,
  AlertTriangle,
  Sparkles,
  Layers,
  ArrowRight,
  Microscope,
  Eye
} from 'lucide-react';

// 7 Phased Steps of Synaptic Transmission according to Form 4 KCSE Syllabus
const SYNAPTIC_STEPS = [
  {
    step: 1,
    title: 'Action Potential Arrives at Presynaptic Bulb',
    badge: 'Depolarization (+30 mV)',
    color: '#38bdf8',
    summary: 'The wave of electrical depolarization travels down the axon and reaches the terminal synaptic knob.',
    mechanism: 'Membrane potential flips from resting -70 mV to +30 mV as Na⁺ voltage gates open along the terminal membrane.'
  },
  {
    step: 2,
    title: 'Voltage-Gated Ca²⁺ Channels Open',
    badge: 'Ca²⁺ Influx',
    color: '#facc15',
    summary: 'Depolarization of the presynaptic membrane triggers voltage-dependent Calcium channels to open.',
    mechanism: 'Calcium ions (Ca²⁺) rush down their steep concentration gradient from extracellular fluid into the synaptic knob cytoplasm.'
  },
  {
    step: 3,
    title: 'Synaptic Vesicles Migrate & Undergo Exocytosis',
    badge: 'Vesicle Fusion',
    color: '#fb7185',
    summary: 'Elevated cytosolic Ca²⁺ causes synaptic vesicles containing Acetylcholine (ACh) to fuse with presynaptic membrane.',
    mechanism: 'Vesicle lipid membranes merge with the presynaptic bulb membrane, discharging thousands of Acetylcholine molecules into the cleft via exocytosis.'
  },
  {
    step: 4,
    title: 'ACh Diffuses Across the 20 nm Synaptic Cleft',
    badge: 'Brownian Diffusion',
    color: '#4ade80',
    summary: 'Acetylcholine molecules diffuse across the narrow fluid-filled 20 nm physical gap.',
    mechanism: 'Diffusion takes approximately 0.5 milliseconds (synaptic delay). CRITICAL: Electricity cannot jump this gap; transmission is purely chemical!'
  },
  {
    step: 5,
    title: 'ACh Binds to Postsynaptic Receptor Sites',
    badge: 'Ligand Binding',
    color: '#c084fc',
    summary: 'ACh binds reversibly to complementary active sites on ligand-gated receptors of the postsynaptic membrane.',
    mechanism: 'Each receptor requires two ACh molecules to open its ion pore. The presynaptic knob lacks these receptors, ensuring unidirectionality.'
  },
  {
    step: 6,
    title: 'Chemically-Gated Na⁺ Channels Open (EPSP Generation)',
    badge: 'Na⁺ Influx & Impulse',
    color: '#22d3ee',
    summary: 'Opening of receptor-operated ion channels allows rapid influx of Na⁺ into the postsynaptic neurone.',
    mechanism: 'Inward Na⁺ current generates an Excitatory Postsynaptic Potential (EPSP). When threshold (-55 mV) is exceeded, a new electrical action potential is propagated!'
  },
  {
    step: 7,
    title: 'AChE Hydrolysis & Choline Reuptake Recycling',
    badge: 'Enzymatic Clearance',
    color: '#f97316',
    summary: 'Acetylcholinesterase (AChE) hydrolyzes ACh into acetate and choline within 1 millisecond.',
    mechanism: 'Stops continuous depolarization and muscle tetany. Choline is actively pumped back via ChT transporters into the presynaptic bulb to resynthesize ACh using ATP.'
  }
];

// Pharmacological / Toxicology Assay Treatments
const DRUG_ASSAYS = {
  normal: {
    id: 'normal',
    name: 'Normal Physiology (Control)',
    badge: 'Homeostatic Balance',
    color: 'emerald',
    description: 'ACh is discharged, excites receptors momentarily, and is rapidly broken down by Acetylcholinesterase (AChE) within 1 ms. Normal rhythmic neurotransmission occurs.',
    clinicalEffect: 'Discrete, controlled postsynaptic impulses. Normal muscle contraction and relaxation cycles.',
    acheActive: true,
    receptorsFree: true,
    postsynapticResponse: 'normal'
  },
  organophosphate: {
    id: 'organophosphate',
    name: 'Organophosphate Insecticide / Nerve Agent',
    badge: 'AChE Inhibitor Hazard',
    color: 'rose',
    description: 'Irreversibly inhibits the enzyme Acetylcholinesterase (AChE). Acetylcholine is not destroyed and continuously accumulates in the 20 nm cleft!',
    clinicalEffect: 'Permanent, unceasing opening of Na⁺ channels. Constant depolarization leads to violent muscle spasms, tetany, convulsions, and asphyxiation.',
    acheActive: false,
    receptorsFree: true,
    postsynapticResponse: 'tetany'
  },
  curare: {
    id: 'curare',
    name: 'Curare / α-Bungarotoxin (Receptor Blocker)',
    badge: 'Competitive Antagonist',
    color: 'amber',
    description: 'Binds competitively to acetylcholine receptors on postsynaptic membrane without opening the Na⁺ channels. Prevents ACh from binding.',
    clinicalEffect: 'Postsynaptic membrane cannot depolarize. No action potential generated. Causes flaccid paralysis (used historically on blowdarts and in surgical anesthesia).',
    acheActive: true,
    receptorsFree: false,
    postsynapticResponse: 'blocked'
  }
};

// Form 4 KCSE High-Yield Questions
const KCSE_EXAM_QUESTIONS = [
  {
    id: 1,
    question: 'Why can a nerve impulse travel in only ONE direction across a chemical synapse (unidirectional transmission)?',
    options: [
      'The synaptic cleft is insulated by a thick myelin sheath preventing reverse flow.',
      'Synaptic vesicles storing acetylcholine are only in the presynaptic knob, and specific ACh receptors are only on the postsynaptic membrane.',
      'Potassium ions (K⁺) can only move in one direction through voltage channels.',
      'The electrical spark creates magnetic fields that repel backward travel.'
    ],
    correct: 1,
    explanation: 'Unidirectionality is guaranteed anatomically: neurotransmitter vesicles exist exclusively in presynaptic terminal bulbs, and complementary ligand-gated receptors are localized strictly on the postsynaptic membrane. In addition, the refractory period of the axon prevents retrograde propagation.'
  },
  {
    id: 2,
    question: 'What is the primary role of Calcium ions (Ca²⁺) during synaptic transmission?',
    options: [
      'To carry the electrical current directly across the 20 nm fluid-filled gap.',
      'To enter the presynaptic knob upon depolarization and stimulate synaptic vesicles to migrate and fuse with the presynaptic membrane (exocytosis).',
      'To enzymatically hydrolyze acetylcholine into acetate and choline.',
      'To depolarize the postsynaptic membrane by rushing through chemically-gated channels.'
    ],
    correct: 1,
    explanation: 'Depolarization opens voltage-gated Ca²⁺ channels. Inflowing Ca²⁺ binds to synaptotagmin and snare proteins, triggering synaptic vesicles to fuse with the presynaptic plasma membrane and discharge Acetylcholine into the cleft.'
  },
  {
    id: 3,
    question: 'Why is nerve impulse conduction along a myelinated axon significantly faster than along an unmyelinated axon of the same diameter?',
    options: [
      'The myelin sheath attracts cosmic electrical charges that accelerate conduction.',
      'Myelin allows action potentials to jump from one Node of Ranvier to the next (saltatory conduction), avoiding continuous point-by-point membrane depolarization.',
      'Myelinated axons have a higher concentration of mitochondria throughout their entire length.',
      'Schwann cells secrete acetylcholine along the full length of the axon.'
    ],
    correct: 1,
    explanation: 'The lipid-rich myelin sheath acts as an electrical insulator. Voltage-gated Na⁺ and K⁺ channels are concentrated almost exclusively at the Nodes of Ranvier. The impulse jumps saltatorily from node to node, speeding conduction up to 100–120 m/s compared to 1–2 m/s in unmyelinated fibres.'
  },
  {
    id: 4,
    question: 'A farmer inadvertently inhales organophosphate insecticide while spraying crops and develops violent muscle twitches and convulsions. What is the physiological cause?',
    options: [
      'Organophosphates destroy all myelin sheaths along motor nerves.',
      'Organophosphates competitively block postsynaptic acetylcholine receptors, preventing muscle stimulation.',
      'Organophosphates inhibit Acetylcholinesterase (AChE), causing acetylcholine to accumulate in synapses and repeatedly stimulate postsynaptic receptors.',
      'Organophosphates prevent Calcium influx into presynaptic bulbs.'
    ],
    correct: 2,
    explanation: 'Organophosphates irreversibly inhibit Acetylcholinesterase (AChE). Without AChE, acetylcholine molecules linger in the synaptic cleft, repeatedly activating ligand-gated Na⁺ channels. This causes sustained depolarization, spastic paralysis, muscle convulsions, and potential respiratory failure.'
  },
  {
    id: 5,
    question: 'Which of the following statements correctly corrects the common misconception about synaptic transmission?',
    options: [
      'The electrical impulse sparks across the 20 nm cleft like an electrostatic arc.',
      'Electricity stops at the presynaptic membrane; transmission across the 20 nm cleft is purely chemical via diffusion of neurotransmitters.',
      'Electrons tunnel quantum-mechanically through the synaptic fluid.',
      'Synapses operate without any physical gap between neurones.'
    ],
    correct: 1,
    explanation: 'The 20 nm synaptic cleft is a physical, fluid-filled extracellular gap. The electrical action potential cannot cross this non-conducting space. Instead, the signal is transduced from an electrical impulse into chemical diffusion (ACh), and then transduced back into a new electrical impulse on the postsynaptic neurone.'
  }
];

// Hotspot structural definitions for Neurone & Synapse anatomy explorer
const ANATOMY_ITEMS = [
  {
    id: 'dendrites',
    title: 'Dendrites',
    category: 'Neurone Architecture',
    desc: 'Fine, highly branched cytoplasmic extensions that receive chemical/electrical signals from sensory receptors or upstream neurones and conduct generator potentials towards the soma.'
  },
  {
    id: 'soma',
    title: 'Cell Body (Soma & Nucleus)',
    category: 'Neurone Architecture',
    desc: 'Contains the spherical nucleus, abundant mitochondria, and rough endoplasmic reticulum (Nissl granules) for high-rate protein/neurotransmitter synthesis.'
  },
  {
    id: 'hillock',
    title: 'Axon Hillock (Trigger Zone)',
    category: 'Neurone Architecture',
    desc: 'The conical funnel connecting the cell body to the axon. Possesses the highest density of voltage-gated Na⁺ channels; sums EPSPs to determine if threshold (-55 mV) is reached to trigger an all-or-none action potential.'
  },
  {
    id: 'myelin',
    title: 'Myelin Sheath & Schwann Cells',
    category: 'Neurone Architecture',
    desc: 'Concentric lipid-rich membranes formed by Schwann cells wrapping around the axon. Acts as an electrical insulator, preventing ion leakage and dramatically increasing conduction velocity.'
  },
  {
    id: 'nodes',
    title: 'Nodes of Ranvier',
    category: 'Neurone Architecture',
    desc: 'Uninsulated gaps (approx 1 μm) between adjacent Schwann cells where axolemma is exposed. Packed with voltage-gated Na⁺ and K⁺ channels allowing saltatory conduction (jumping impulse).'
  },
  {
    id: 'knob',
    title: 'Presynaptic Terminal Bulb (Knob)',
    category: 'Synaptic Microstructure',
    desc: 'Swollen bulbous tip of axon terminal branch. Contains thousands of synaptic vesicles filled with Acetylcholine, numerous mitochondria for ATP generation, and voltage-gated Ca²⁺ channels.'
  },
  {
    id: 'cleft',
    title: 'Synaptic Cleft (20 nm Physical Gap)',
    category: 'Synaptic Microstructure',
    desc: 'A narrow, fluid-filled physical gap (~20 nanometres wide) separating the presynaptic and postsynaptic membranes. Prevents direct electrical flow, necessitating chemical neurotransmitter diffusion.'
  },
  {
    id: 'receptors',
    title: 'Postsynaptic ACh Receptors & Na⁺ Channels',
    category: 'Synaptic Microstructure',
    desc: 'Transmembrane protein complexes with complementary binding pockets for Acetylcholine. Ligand binding opens the integral ion channel, permitting rapid inward Na⁺ flux.'
  },
  {
    id: 'ache',
    title: 'Acetylcholinesterase (AChE) Enzyme',
    category: 'Synaptic Microstructure',
    desc: 'Rapidly acting enzyme bound to postsynaptic membranes and cleft matrix. Splits acetylcholine into acetate and choline within milliseconds, terminating excitation and preventing muscle tetany.'
  }
];

export default function NerveImpulseSynapseSim({ config = {}, onTelemetry }) {
  // Primary view mode: 'neurone' (Macroscopic / Saltatory) or 'synapse' (20nm Molecular View)
  const [viewMode, setViewMode] = useState('neurone');

  // Transmission step: 1 through 7
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5x, 1x, 2x

  // Impulse firing state on whole neurone
  const [isAxonFiring, setIsAxonFiring] = useState(false);
  const [axonPulseProgress, setAxonPulseProgress] = useState(0); // 0 to 1
  const [conductionMode, setConductionMode] = useState('myelinated'); // 'myelinated' (saltatory) vs 'unmyelinated' (continuous)

  // Pharmacology drug condition
  const [selectedDrug, setSelectedDrug] = useState('normal');

  // Selected anatomy info card
  const [selectedAnatomy, setSelectedAnatomy] = useState(ANATOMY_ITEMS[0]);

  // Tab: 'simulation' | 'axon_theory' | 'synapse_theory' | 'pharmacology' | 'quiz'
  const [activeTab, setActiveTab] = useState('simulation');

  // KCSE Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // References for Canvas and Animation
  const neuroneCanvasRef = useRef(null);
  const synapseCanvasRef = useRef(null);
  const oscilloscopeCanvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  // Oscilloscope voltage history buffer
  const [voltagePoints, setVoltagePoints] = useState([
    { time: 0, mv: -70 },
    { time: 1, mv: -70 }
  ]);

  // Telemetry helper
  const emitTelemetry = useCallback(
    (action, details = {}) => {
      if (typeof onTelemetry === 'function') {
        try {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            simulation: 'nerve_impulse_synaptic_transmission',
            action,
            viewMode,
            currentStep,
            selectedDrug,
            conductionMode,
            ...details
          });
        } catch (e) {
          console.warn('Telemetry delivery failed', e);
        }
      }
    },
    [onTelemetry, viewMode, currentStep, selectedDrug, conductionMode]
  );

  // Calculate membrane potential based on current step and drug condition
  const getMembranePotential = useCallback(() => {
    if (selectedDrug === 'curare') {
      if (currentStep >= 5) return -70; // Blocked, cannot depolarize
    }
    if (selectedDrug === 'organophosphate') {
      if (currentStep >= 6) return +25; // Continuous depolarization / tetany!
    }

    switch (currentStep) {
      case 1:
        return +30; // Presynaptic depolarization
      case 2:
        return +20; // Ca2+ channels open
      case 3:
        return +10; // Exocytosis underway
      case 4:
        return -70; // Cleft transit (postsynaptic resting)
      case 5:
        return -55; // Reaching threshold on postsynaptic membrane
      case 6:
        return +30; // Postsynaptic full action potential / EPSP
      case 7:
        return -70; // Restored resting potential after AChE cleavage
      default:
        return -70;
    }
  }, [currentStep, selectedDrug]);

  // Update oscilloscope voltage history buffer when step or drug changes
  useEffect(() => {
    const currentMv = getMembranePotential();
    setVoltagePoints((prev) => {
      const nextTime = prev.length > 0 ? prev[prev.length - 1].time + 1 : 0;
      const updated = [...prev, { time: nextTime, mv: currentMv }];
      if (updated.length > 40) {
        return updated.slice(updated.length - 40);
      }
      return updated;
    });
  }, [currentStep, selectedDrug, getMembranePotential]);

  // Step advancement in Auto Play mode
  useEffect(() => {
    if (!isPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    const intervalTime = 2200 / playbackSpeed;
    autoPlayTimerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 7) {
          emitTelemetry('SYNAPSE_CYCLE_COMPLETED', { drug: selectedDrug });
          return 1;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, playbackSpeed, selectedDrug, emitTelemetry]);

  // Trigger Action Potential along Whole Axon
  const handleTriggerAxonImpulse = useCallback(() => {
    if (isAxonFiring) return;
    setIsAxonFiring(true);
    setAxonPulseProgress(0);

    const speedMultiplier = conductionMode === 'myelinated' ? 1.0 : 0.28; // Saltatory is ~4x faster in simulation
    const totalDuration = 1800 / speedMultiplier;
    const start = performance.now();

    const animateAxon = (now) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / totalDuration, 1);
      setAxonPulseProgress(p);

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animateAxon);
      } else {
        setIsAxonFiring(false);
        emitTelemetry('AXON_IMPULSE_COMPLETED', {
          mode: conductionMode,
          speedEst: conductionMode === 'myelinated' ? '100-120 m/s (Saltatory)' : '1-2 m/s (Continuous)'
        });
      }
    };

    animFrameRef.current = requestAnimationFrame(animateAxon);
  }, [isAxonFiring, conductionMode, emitTelemetry]);

  // Reset Simulation
  const handleResetSimulation = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    setIsPlaying(false);
    setIsAxonFiring(false);
    setAxonPulseProgress(0);
    setCurrentStep(1);
    setSelectedDrug('normal');
    setVoltagePoints([
      { time: 0, mv: -70 },
      { time: 1, mv: -70 }
    ]);
    emitTelemetry('SIMULATION_RESET');
  };

  // Draw Oscilloscope Canvas
  useEffect(() => {
    const canvas = oscilloscopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Cathode ray phosphor screen background
    const screenGrad = ctx.createLinearGradient(0, 0, 0, h);
    screenGrad.addColorStop(0, '#051b14');
    screenGrad.addColorStop(1, '#020d09');
    ctx.fillStyle = screenGrad;
    ctx.fillRect(0, 0, w, h);

    // Grid lines (green phosphor style)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 25) {
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

    // Reference Voltage Baselines:
    const mapMvToY = (mv) => {
      const clamped = Math.max(-90, Math.min(50, mv));
      const range = 50 - (-90); // 140 mV total
      const norm = (50 - clamped) / range; // 0 at +50, 1 at -90
      return 15 + norm * (h - 30);
    };

    const drawRefLine = (mv, label, color) => {
      const y = mapMvToY(mv);
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(35, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(label, 32, y + 3);
      ctx.restore();
    };

    drawRefLine(30, '+30 mV', '#38bdf8');
    drawRefLine(0, '0 mV', '#64748b');
    drawRefLine(-55, '-55 mV (Threshold)', '#eab308');
    drawRefLine(-70, '-70 mV (Resting)', '#10b981');

    // Draw Voltage Curve History
    if (voltagePoints.length > 1) {
      ctx.save();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const stepX = (w - 45) / Math.max(voltagePoints.length - 1, 1);
      voltagePoints.forEach((pt, idx) => {
        const x = 40 + idx * stepX;
        const y = mapMvToY(pt.mv);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Glowing leading oscilloscope dot
      const lastPt = voltagePoints[voltagePoints.length - 1];
      const lastX = 40 + (voltagePoints.length - 1) * stepX;
      const lastY = mapMvToY(lastPt.mv);

      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }
  }, [voltagePoints]);

  // DRAW CANVAS 1: Whole Neurone & Saltatory Conduction View
  useEffect(() => {
    if (viewMode !== 'neurone') return;
    const canvas = neuroneCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Deep anatomical dark canvas background
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#090d16');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Microscopic coordinate grid
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Coordinates for Neurone
    const somaX = 140;
    const somaY = 200;
    const somaRadius = 46;
    const axonStartX = somaX + 42;
    const axonEndX = width - 110;
    const axonY = somaY;

    // 1. Dendrites
    const dendriteBranches = [
      { startAng: 2.7, len1: 65, ang1: 2.8, len2: 45, ang2: 2.5, len3: 35, ang3: 3.1 },
      { startAng: 3.4, len1: 75, ang1: 3.3, len2: 50, ang2: 3.0, len3: 40, ang3: 3.7 },
      { startAng: 4.1, len1: 65, ang1: 4.2, len2: 40, ang2: 4.6, len3: 30, ang3: 3.9 },
      { startAng: 1.8, len1: 70, ang1: 1.7, len2: 45, ang2: 1.4, len3: 35, ang3: 2.1 },
      { startAng: 4.9, len1: 65, ang1: 5.1, len2: 45, ang2: 5.4, len3: 30, ang3: 4.7 }
    ];

    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineCap = 'round';

    dendriteBranches.forEach((b) => {
      const x0 = somaX + Math.cos(b.startAng) * somaRadius;
      const y0 = somaY + Math.sin(b.startAng) * somaRadius;
      const x1 = x0 + Math.cos(b.ang1) * b.len1;
      const y1 = y0 + Math.sin(b.ang1) * b.len1;
      const x2a = x1 + Math.cos(b.ang2) * b.len2;
      const y2a = y1 + Math.sin(b.ang2) * b.len2;
      const x2b = x1 + Math.cos(b.ang3) * b.len3;
      const y2b = y1 + Math.sin(b.ang3) * b.len3;

      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2a, y2a);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2b, y2b);
      ctx.stroke();

      [x2a, x2b].forEach((leafX, leafIdx) => {
        const leafY = leafIdx === 0 ? y2a : y2b;
        ctx.beginPath();
        ctx.arc(leafX, leafY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#7dd3fc';
        ctx.fill();
      });
    });
    ctx.restore();

    // 2. Soma (Cell Body)
    ctx.save();
    ctx.beginPath();
    ctx.arc(somaX, somaY, somaRadius, 0, Math.PI * 2);
    const somaGrad = ctx.createRadialGradient(somaX - 10, somaY - 10, 8, somaX, somaY, somaRadius);
    somaGrad.addColorStop(0, '#0284c7');
    somaGrad.addColorStop(0.7, '#0369a1');
    somaGrad.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = somaGrad;
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Nucleus
    ctx.beginPath();
    ctx.arc(somaX - 6, somaY - 4, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(somaX - 8, somaY - 5, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();

    // Nissl Granules
    ctx.fillStyle = 'rgba(125, 211, 252, 0.4)';
    const nisslDots = [
      { dx: -24, dy: -18 },
      { dx: -18, dy: 22 },
      { dx: 14, dy: -24 },
      { dx: 18, dy: 16 },
      { dx: 26, dy: -8 },
      { dx: -30, dy: 6 }
    ];
    nisslDots.forEach((d) => {
      ctx.beginPath();
      ctx.arc(somaX + d.dx, somaY + d.dy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // 3. Axon Hillock (Trigger Zone)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(somaX + 38, somaY - 16);
    ctx.quadraticCurveTo(somaX + 58, somaY - 8, axonStartX + 20, axonY - 7);
    ctx.lineTo(axonStartX + 20, axonY + 7);
    ctx.quadraticCurveTo(somaX + 58, somaY + 8, somaX + 38, somaY + 16);
    ctx.closePath();
    ctx.fillStyle = '#0284c7';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // 4. Axon Trunk Core
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(axonStartX + 18, axonY);
    ctx.lineTo(axonEndX, axonY);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 14;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(axonStartX + 18, axonY);
    ctx.lineTo(axonEndX, axonY);
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // 5. Myelin Sheaths and Nodes of Ranvier
    const numSheaths = 4;
    const sheathSpacing = (axonEndX - (axonStartX + 30)) / numSheaths;
    const nodeLocations = [];

    for (let i = 0; i < numSheaths; i++) {
      const sx = axonStartX + 30 + i * sheathSpacing;
      const sw = sheathSpacing - 22;
      const sy = axonY - 18;
      const sh = 36;

      nodeLocations.push(sx + sw + 11);

      if (conductionMode === 'myelinated') {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(sx, sy, sw, sh, 10);
        const mGrad = ctx.createLinearGradient(sx, sy, sx, sy + sh);
        mGrad.addColorStop(0, '#fef08a');
        mGrad.addColorStop(0.3, '#f59e0b');
        mGrad.addColorStop(0.7, '#d97706');
        mGrad.addColorStop(1, '#78350f');
        ctx.fillStyle = mGrad;
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Schwann cell nucleus
        ctx.beginPath();
        ctx.ellipse(sx + sw / 2, sy + 3, 14, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#b45309';
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.setLineDash([2, 4]);
        ctx.strokeRect(sx, sy + 6, sw, sh - 12);
        ctx.restore();
      }
    }

    // 6. Node charges (+ outside, - inside at rest)
    nodeLocations.forEach((nx, nodeIdx) => {
      const nodeProgress = (nodeIdx + 1) / (nodeLocations.length + 1);
      const isDepolarized = isAxonFiring && Math.abs(axonPulseProgress - nodeProgress) < 0.12;

      ctx.save();
      ctx.fillStyle = isDepolarized ? '#f43f5e' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(nx, axonY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      if (isDepolarized) {
        ctx.fillStyle = '#f87171';
        ctx.fillText('-', nx, axonY - 26);
        ctx.fillText('-', nx, axonY + 34);
        ctx.fillStyle = '#4ade80';
        ctx.fillText('+', nx, axonY - 8);
        ctx.fillText('+', nx, axonY + 14);
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('+', nx, axonY - 26);
        ctx.fillText('+', nx, axonY + 34);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('-', nx, axonY - 8);
        ctx.fillText('-', nx, axonY + 14);
      }
      ctx.restore();
    });

    // 7. Axon Terminals & Synaptic Knobs
    const termBranches = [
      { endX: width - 35, endY: axonY - 65, ctrlX: axonEndX + 35, ctrlY: axonY - 35 },
      { endX: width - 25, endY: axonY - 20, ctrlX: axonEndX + 45, ctrlY: axonY - 10 },
      { endX: width - 25, endY: axonY + 25, ctrlX: axonEndX + 45, ctrlY: axonY + 12 },
      { endX: width - 35, endY: axonY + 70, ctrlX: axonEndX + 35, ctrlY: axonY + 40 }
    ];

    ctx.save();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    termBranches.forEach((tb) => {
      ctx.beginPath();
      ctx.moveTo(axonEndX, axonY);
      ctx.quadraticCurveTo(tb.ctrlX, tb.ctrlY, tb.endX, tb.endY);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(tb.endX, tb.endY, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(tb.endX - 2, tb.endY - 2, 2.5, 0, Math.PI * 2);
      ctx.arc(tb.endX + 2, tb.endY + 2, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#4ade80';
      ctx.fill();
    });
    ctx.restore();

    // 8. Animated Action Potential Pulse Wave
    if (isAxonFiring) {
      ctx.save();
      let waveX = axonStartX + axonPulseProgress * (axonEndX - axonStartX);
      let waveY = axonY;

      if (conductionMode === 'myelinated') {
        const totalNodes = nodeLocations.length;
        const segment = axonPulseProgress * (totalNodes + 1);
        const currentIndex = Math.floor(segment);
        const subFrac = segment - currentIndex;

        const prevX = currentIndex === 0 ? axonStartX + 20 : nodeLocations[currentIndex - 1];
        const nextX = currentIndex >= totalNodes ? axonEndX : nodeLocations[currentIndex];

        waveX = (1 - subFrac) * prevX + subFrac * nextX;
        const arcHeight = Math.sin(subFrac * Math.PI) * 32;
        waveY = axonY - arcHeight;

        ctx.beginPath();
        ctx.moveTo(prevX, axonY);
        ctx.quadraticCurveTo((prevX + nextX) / 2, axonY - 42, nextX, axonY);
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(waveX, waveY, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();

      for (let s = 0; s < 6; s++) {
        const ang = (s * Math.PI) / 3 + axonPulseProgress * 10;
        const len = 14 + Math.random() * 8;
        ctx.beginPath();
        ctx.moveTo(waveX, waveY);
        ctx.lineTo(waveX + Math.cos(ang) * len, waveY + Math.sin(ang) * len);
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 9. Unidirectional Impulse Arrow Indicator
    ctx.save();
    const arrY = height - 34;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(somaX, arrY);
    ctx.lineTo(axonEndX + 20, arrY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(axonEndX + 20, arrY);
    ctx.lineTo(axonEndX + 8, arrY - 6);
    ctx.lineTo(axonEndX + 8, arrY + 6);
    ctx.closePath();
    ctx.fillStyle = '#38bdf8';
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('STRICTLY UNIDIRECTIONAL: Dendrite ➔ Soma ➔ Axon ➔ Synapse', somaX + 8, arrY - 8);
    ctx.restore();

    // 10. Anatomical Label Badges
    const drawBadge = (x, y, text, color) => {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.4;
      const tw = text.length * 6.6 + 14;
      ctx.beginPath();
      ctx.roundRect(x - tw / 2, y - 10, tw, 20, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 9.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(text, x, y + 3.5);
      ctx.restore();
    };

    drawBadge(somaX, somaY - somaRadius - 16, 'Cell Body (Soma & Nucleus)', '#38bdf8');
    drawBadge(axonStartX + 20, axonY + 45, 'Axon Hillock (Trigger Zone)', '#0284c7');
    if (conductionMode === 'myelinated') {
      drawBadge(axonStartX + 80, axonY - 36, 'Myelin Sheath (Schwann Cell)', '#f59e0b');
      drawBadge(nodeLocations[1], axonY + 52, 'Node of Ranvier (Saltatory Conduction)', '#22d3ee');
    }
    drawBadge(width - 55, axonY - 85, 'Synaptic Knobs / Bulbs', '#4ade80');
  }, [viewMode, isAxonFiring, axonPulseProgress, conductionMode]);

  // DRAW CANVAS 2: High-Magnification Synaptic Cleft (20 nm Molecular View)
  useEffect(() => {
    if (viewMode !== 'synapse') return;
    const canvas = synapseCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#070b14');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const knobWidth = width - 140;
    const knobX = 70;
    const knobBottomY = 195;
    const cleftHeight = 52;
    const postMembraneY = knobBottomY + cleftHeight;

    // 1. Presynaptic Terminal Knob Cytoplasm
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(knobX + 40, 0);
    ctx.lineTo(knobX + 40, 45);
    ctx.bezierCurveTo(knobX + 30, 140, knobX + 80, knobBottomY, knobX + knobWidth / 2, knobBottomY);
    ctx.bezierCurveTo(knobX + knobWidth - 80, knobBottomY, knobX + knobWidth - 30, 140, knobX + knobWidth - 40, 45);
    ctx.lineTo(knobX + knobWidth - 40, 0);
    ctx.closePath();

    const knobGrad = ctx.createLinearGradient(0, 0, 0, knobBottomY);
    knobGrad.addColorStop(0, '#0f172a');
    knobGrad.addColorStop(0.7, currentStep >= 1 ? '#1e293b' : '#0f172a');
    knobGrad.addColorStop(1, currentStep >= 1 ? '#334155' : '#1e293b');
    ctx.fillStyle = knobGrad;
    ctx.fill();

    ctx.strokeStyle = currentStep >= 1 ? '#38bdf8' : '#64748b';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.restore();

    // 2. Mitochondria inside Knob
    const drawMitochondrion = (mx, my, angle) => {
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 13, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#831843';
      ctx.fill();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.strokeStyle = '#fda4af';
      ctx.lineWidth = 1.4;
      for (let i = -14; i <= 14; i += 7) {
        ctx.beginPath();
        ctx.moveTo(i, -7);
        ctx.lineTo(i + 2, 7);
        ctx.stroke();
      }

      ctx.fillStyle = '#fecdd3';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('ATP', -7, 3);
      ctx.restore();
    };

    drawMitochondrion(knobX + 130, 80, -0.35);
    drawMitochondrion(knobX + knobWidth - 130, 85, 0.4);

    // 3. Synaptic Cleft (20 nm physical space)
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.fillRect(knobX, knobBottomY, knobWidth, cleftHeight);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(knobX + 25, knobBottomY);
    ctx.lineTo(knobX + 25, postMembraneY);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('20 nm Physical Cleft', knobX + 32, knobBottomY + 30);
    ctx.restore();

    // 4. Postsynaptic Membrane
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(knobX + 20, postMembraneY);
    ctx.bezierCurveTo(
      knobX + 120,
      postMembraneY + 5,
      knobX + knobWidth - 120,
      postMembraneY + 5,
      knobX + knobWidth - 20,
      postMembraneY
    );
    ctx.lineTo(knobX + knobWidth - 20, height);
    ctx.lineTo(knobX + 20, height);
    ctx.closePath();

    const postGrad = ctx.createLinearGradient(0, postMembraneY, 0, height);
    if (selectedDrug === 'curare') {
      postGrad.addColorStop(0, '#1e1b4b');
      postGrad.addColorStop(1, '#0c0a1a');
    } else if (selectedDrug === 'organophosphate') {
      postGrad.addColorStop(0, '#881337');
      postGrad.addColorStop(1, '#4c0519');
    } else {
      postGrad.addColorStop(0, currentStep >= 6 ? '#2e1065' : '#1e1b4b');
      postGrad.addColorStop(1, '#090514');
    }

    ctx.fillStyle = postGrad;
    ctx.fill();

    ctx.strokeStyle = currentStep >= 6 && selectedDrug !== 'curare' ? '#a855f7' : '#475569';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.restore();

    // 5. Ca²⁺ Channels
    const drawCaChannel = (cx, cy, isOpen) => {
      ctx.save();
      ctx.fillStyle = isOpen ? '#22c55e' : '#64748b';
      ctx.beginPath();
      ctx.roundRect(cx - 12, cy - 20, 24, 40, 5);
      ctx.fill();
      ctx.strokeStyle = isOpen ? '#86efac' : '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (isOpen) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 3, cy - 20, 6, 40);

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 14);
        ctx.lineTo(cx, cy + 14);
        ctx.stroke();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Ca²⁺', cx, cy - 24);
      ctx.restore();
    };

    const isCaOpen = currentStep >= 2;
    const caChannelL = { x: knobX + 85, y: knobBottomY - 26 };
    const caChannelR = { x: knobX + knobWidth - 85, y: knobBottomY - 26 };
    drawCaChannel(caChannelL.x, caChannelL.y, isCaOpen);
    drawCaChannel(caChannelR.x, caChannelR.y, isCaOpen);

    // 6. Extracellular Ca²⁺ Ions
    if (currentStep >= 2) {
      ctx.save();
      const caIons = [
        { x: caChannelL.x + 18, y: caChannelL.y - 12 },
        { x: caChannelL.x + 35, y: caChannelL.y + 10 },
        { x: caChannelL.x + 55, y: caChannelL.y + 25 },
        { x: caChannelR.x - 18, y: caChannelR.y - 12 },
        { x: caChannelR.x - 35, y: caChannelR.y + 10 },
        { x: caChannelR.x - 55, y: caChannelR.y + 25 }
      ];

      caIons.forEach((ion) => {
        ctx.beginPath();
        ctx.arc(ion.x, ion.y, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.fillStyle = '#713f12';
        ctx.font = 'bold 7px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Ca²', ion.x, ion.y + 2.5);
      });
      ctx.restore();
    }

    // 7. Synaptic Vesicles with Acetylcholine
    const vesicles = [
      { x: knobX + 220, y: 75, fused: false },
      { x: knobX + 310, y: 95, fused: false },
      { x: knobX + 400, y: 70, fused: false },
      { x: knobX + 480, y: 90, fused: false },
      { x: knobX + 260, y: 155, fused: currentStep >= 3 },
      { x: knobX + 350, y: 165, fused: currentStep >= 3 },
      { x: knobX + 440, y: 150, fused: currentStep >= 3 }
    ];

    vesicles.forEach((v) => {
      ctx.save();
      if (!v.fused) {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        const dotOffsets = [
          [-7, -7],
          [0, -8],
          [7, -7],
          [-9, 0],
          [0, 0],
          [9, 0],
          [-7, 7],
          [0, 8],
          [7, 7]
        ];
        dotOffsets.forEach(([dx, dy]) => {
          ctx.beginPath();
          ctx.arc(v.x + dx, v.y + dy, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = '#4ade80';
          ctx.fill();
        });
      } else {
        ctx.beginPath();
        ctx.arc(v.x, knobBottomY, 18, Math.PI * 0.95, 0.05, true);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.fillStyle = 'rgba(74, 222, 128, 0.4)';
        ctx.beginPath();
        ctx.arc(v.x, knobBottomY + 8, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // 8. Acetylcholine (ACh) in the Synaptic Cleft
    if (currentStep >= 3 && (currentStep < 7 || selectedDrug === 'organophosphate')) {
      ctx.save();
      const achDensity = selectedDrug === 'organophosphate' ? 28 : 14;
      const achSpread = [];

      for (let i = 0; i < achDensity; i++) {
        const seedX = knobX + 160 + ((i * 37) % (knobWidth - 320));
        const seedY = knobBottomY + 10 + ((i * 19) % (cleftHeight - 16));
        achSpread.push({ x: seedX, y: seedY });
      }

      achSpread.forEach((ach) => {
        ctx.beginPath();
        ctx.arc(ach.x, ach.y, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      ctx.restore();
    }

    // 9. Postsynaptic Na⁺ Receptors
    const receptors = [
      { x: knobX + 180, y: postMembraneY },
      { x: knobX + 260, y: postMembraneY + 2 },
      { x: knobX + 340, y: postMembraneY + 3 },
      { x: knobX + 420, y: postMembraneY + 3 },
      { x: knobX + 500, y: postMembraneY + 2 },
      { x: knobX + 580, y: postMembraneY }
    ];

    receptors.forEach((rec) => {
      ctx.save();
      const isBound =
        (currentStep >= 5 && currentStep <= 6 && selectedDrug !== 'curare') ||
        (selectedDrug === 'organophosphate' && currentStep >= 5);
      const isBlockedByCurare = selectedDrug === 'curare';

      ctx.fillStyle = isBlockedByCurare ? '#b45309' : isBound ? '#9333ea' : '#475569';
      ctx.beginPath();
      ctx.roundRect(rec.x - 14, rec.y - 4, 28, 32, 6);
      ctx.fill();
      ctx.strokeStyle = isBound ? '#d8b4fe' : '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(rec.x - 6, rec.y - 2, 4, 0, Math.PI);
      ctx.arc(rec.x + 6, rec.y - 2, 4, 0, Math.PI);
      ctx.fill();

      if (isBlockedByCurare) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(rec.x - 6, rec.y - 6, 5, 0, Math.PI * 2);
        ctx.arc(rec.x + 6, rec.y - 6, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#451a03';
        ctx.font = 'bold 6.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CUR', rec.x, rec.y - 12);
      } else if (isBound) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(rec.x - 6, rec.y - 4, 4.5, 0, Math.PI * 2);
        ctx.arc(rec.x + 6, rec.y - 4, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0284c7';
        ctx.fillRect(rec.x - 3, rec.y + 4, 6, 24);

        for (let na = 0; na < 3; na++) {
          const naY = rec.y + 12 + na * 16;
          ctx.beginPath();
          ctx.arc(rec.x, naY, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#0284c7';
          ctx.shadowBlur = 10;
          ctx.fill();

          ctx.fillStyle = '#082f49';
          ctx.font = 'bold 6px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Na⁺', rec.x, naY + 2);
        }
      }
      ctx.restore();
    });

    // 10. Acetylcholinesterase (AChE) Enzymes
    const achePositions = [
      { x: knobX + 220, y: postMembraneY - 14 },
      { x: knobX + 380, y: postMembraneY - 12 },
      { x: knobX + 540, y: postMembraneY - 14 }
    ];

    achePositions.forEach((ache) => {
      ctx.save();
      const isOrganophosphateInhibited = selectedDrug === 'organophosphate';

      ctx.beginPath();
      ctx.arc(ache.x, ache.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = isOrganophosphateInhibited ? '#ef4444' : '#f97316';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(ache.x, ache.y);
      ctx.arc(ache.x, ache.y, 10, -0.3, 0.3, true);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      if (isOrganophosphateInhibited) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ache.x - 6, ache.y - 6);
        ctx.lineTo(ache.x + 6, ache.y + 6);
        ctx.moveTo(ache.x + 6, ache.y - 6);
        ctx.lineTo(ache.x - 6, ache.y + 6);
        ctx.stroke();

        ctx.fillStyle = '#fee2e2';
        ctx.font = 'bold 7px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('BLOCKED', ache.x, ache.y - 13);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('AChE', ache.x, ache.y + 17);
      }
      ctx.restore();
    });

    // 11. Choline Transporter (ChT) for Reuptake
    const drawCholineTransporter = (tx, ty) => {
      ctx.save();
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.roundRect(tx - 12, ty - 8, 24, 20, 4);
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tx, ty + 8);
      ctx.lineTo(tx, ty - 4);
      ctx.stroke();

      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ChT', tx, ty - 12);

      if (currentStep === 7 && selectedDrug === 'normal') {
        ctx.beginPath();
        ctx.arc(tx, ty - 16, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
      }
      ctx.restore();
    };

    drawCholineTransporter(knobX + 150, knobBottomY - 4);
    drawCholineTransporter(knobX + knobWidth - 150, knobBottomY - 4);

    // 12. Misconception Warning Banner
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(width / 2 - 220, 14, 440, 26, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ NO SPARKS JUMP THE CLEFT! Transmission is 100% Chemical via ACh', width / 2, 31);
    ctx.restore();

    // 13. Direction of Transmission Arrow
    ctx.save();
    const sideX = width - 40;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sideX, 60);
    ctx.lineTo(sideX, postMembraneY + 80);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(sideX, postMembraneY + 80);
    ctx.lineTo(sideX - 7, postMembraneY + 68);
    ctx.lineTo(sideX + 7, postMembraneY + 68);
    ctx.closePath();
    ctx.fillStyle = '#38bdf8';
    ctx.fill();

    ctx.save();
    ctx.translate(sideX - 12, 180);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 9.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UNIDIRECTIONAL TRANSMISSION', 0, 0);
    ctx.restore();
    ctx.restore();
  }, [viewMode, currentStep, selectedDrug]);

  // Handle Quiz selection
  const handleSelectQuizAnswer = (qId, optionIdx) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  // Submit KCSE Quiz
  const handleSubmitQuiz = () => {
    let score = 0;
    KCSE_EXAM_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    emitTelemetry('KCSE_QUIZ_COMPLETED', {
      score,
      total: KCSE_EXAM_QUESTIONS.length,
      percentage: Math.round((score / KCSE_EXAM_QUESTIONS.length) * 100)
    });
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const activeStepData = SYNAPTIC_STEPS[currentStep - 1];
  const activeDrugData = DRUG_ASSAYS[selectedDrug];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 text-slate-100 font-sans p-2 sm:p-4 selection:bg-sky-500 selection:text-white">
      {/* HEADER & CONTROLS BANNER */}
      <header className="bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Form 4 Biology • Topic 3
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              KCSE Verified Core Lab
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Nerve Impulse Conduction & Synapse Simulation
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Saltatory action potentials along myelinated axons and 20 nm chemical neurotransmitter transmission across the synaptic cleft.
          </p>
        </div>

        {/* Global Reset & State Summary */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleResetSimulation}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700/80 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Reset resting potential (-70 mV) and recharge vesicles"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Lab</span>
          </button>
        </div>
      </header>

      {/* CRUCIAL MISCONCEPTION BUSTER CALLOUT */}
      <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl p-3 flex items-start gap-3 shadow-md">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-extrabold text-amber-300 uppercase tracking-wide mr-1.5">
            Crucial KCSE Examiner Warning:
          </span>
          <span className="text-slate-300">
            <strong>Electrical impulses CANNOT spark or jump across the synaptic cleft!</strong> The 20 nm physical gap is an extracellular fluid space that conducts no sparks. The electrical signal is converted into <strong>chemical diffusion of Acetylcholine</strong>, which then regenerates an electrical impulse on the postsynaptic membrane.
          </span>
        </div>
      </div>

      {/* TOP NAVIGATION TABS */}
      <nav className="flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('simulation')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'simulation'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Microscope className="w-4 h-4" />
          <span>Interactive Simulation & Assay</span>
        </button>

        <button
          onClick={() => setActiveTab('axon_theory')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'axon_theory'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Axon & Saltatory Conduction</span>
        </button>

        <button
          onClick={() => setActiveTab('synapse_theory')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'synapse_theory'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Synaptic Sequence & Unidirectionality</span>
        </button>

        <button
          onClick={() => setActiveTab('pharmacology')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'pharmacology'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Pharmacology & Neurotoxins</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'quiz'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-black'
              : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>KCSE Exam Challenge ({KCSE_EXAM_QUESTIONS.length})</span>
        </button>
      </nav>

      {/* TAB 1: MAIN INTERACTIVE SIMULATION & CONTROLS */}
      {activeTab === 'simulation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT 8-COLUMN: VIEW SWITCHER + PRIMARY CANVAS + OSCILLOSCOPE */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            {/* VIEW SELECTOR & MODE TOGGLES */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-sm">
              <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setViewMode('neurone');
                    emitTelemetry('VIEW_MODE_CHANGED', { mode: 'neurone' });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'neurone'
                      ? 'bg-sky-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Whole Neurone (Saltatory Axon)</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode('synapse');
                    emitTelemetry('VIEW_MODE_CHANGED', { mode: 'synapse' });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'synapse'
                      ? 'bg-sky-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Synaptic Cleft (20 nm Molecular View)</span>
                </button>
              </div>

              {/* Conduction speed / mode toggle in Neurone view */}
              {viewMode === 'neurone' && (
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-slate-400">Axon Type:</span>
                  <button
                    onClick={() => setConductionMode('myelinated')}
                    className={`px-2 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                      conductionMode === 'myelinated'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    Myelinated (~120 m/s)
                  </button>
                  <button
                    onClick={() => setConductionMode('unmyelinated')}
                    className={`px-2 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                      conductionMode === 'unmyelinated'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    Unmyelinated (~2 m/s)
                  </button>
                </div>
              )}
            </div>

            {/* CANVAS CONTAINER */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center">
              {viewMode === 'neurone' ? (
                <div className="w-full relative">
                  <canvas
                    ref={neuroneCanvasRef}
                    width={800}
                    height={410}
                    className="w-full h-auto block"
                  />
                  {/* Overlay button to trigger action potential */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <button
                      onClick={handleTriggerAxonImpulse}
                      disabled={isAxonFiring}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4 fill-slate-950" />
                      <span>{isAxonFiring ? 'Propagating Wave...' : '⚡ Trigger Action Potential'}</span>
                    </button>
                    {isAxonFiring && (
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-amber-300 border border-amber-500/30 text-[10px] font-bold animate-pulse">
                        {conductionMode === 'myelinated'
                          ? 'Saltatory Jump: Nodes of Ranvier'
                          : 'Continuous Point-by-Point Conduction'}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full relative">
                  <canvas
                    ref={synapseCanvasRef}
                    width={800}
                    height={430}
                    className="w-full h-auto block"
                  />

                  {/* Step Info Badge Overlay */}
                  <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs flex items-center gap-2.5 shadow-lg backdrop-blur-md">
                    <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {currentStep}
                    </span>
                    <div>
                      <div className="font-bold text-white text-[11px]">{activeStepData.title}</div>
                      <div className="text-[10px] text-sky-400">{activeStepData.badge}</div>
                    </div>
                  </div>

                  {/* Drug indicator overlay if toxicant selected */}
                  {selectedDrug !== 'normal' && (
                    <div className="absolute top-3 right-3 bg-rose-950/90 border border-rose-500/50 rounded-xl px-3 py-1.5 text-xs text-rose-300 flex items-center gap-2 shadow-lg backdrop-blur-md">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span className="font-bold text-[11px]">{activeDrugData.badge}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Visual status strip */}
              <div className="w-full bg-slate-900/90 border-t border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span>
                    Current Voltage:{' '}
                    <strong className="text-emerald-400">{getMembranePotential()} mV</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Synaptic Cleft:{' '}
                    <strong className="text-sky-300">20 nm physical fluid space</strong>
                  </span>
                </div>
                <div className="text-slate-400">
                  Transmitter: <strong className="text-emerald-400">Acetylcholine (ACh)</strong>
                </div>
              </div>
            </div>

            {/* REAL-TIME MEMBRANE POTENTIAL OSCILLOSCOPE DISPLAY */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                    Membrane Potential Oscilloscope (Cathode Ray Trace)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                  {getMembranePotential()} mV | Threshold: -55 mV
                </span>
              </div>
              <div className="w-full bg-black rounded-xl overflow-hidden border border-emerald-950/80 shadow-inner">
                <canvas
                  ref={oscilloscopeCanvasRef}
                  width={750}
                  height={110}
                  className="w-full h-[100px] block"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2 text-[10px] text-slate-400 text-center">
                <div className="p-1 rounded bg-slate-800/40">Resting: -70 mV</div>
                <div className="p-1 rounded bg-amber-500/10 text-amber-300">Threshold: -55 mV</div>
                <div className="p-1 rounded bg-sky-500/10 text-sky-300">Depolarization: +30 mV</div>
                <div className="p-1 rounded bg-purple-500/10 text-purple-300">Refractory: -80 mV</div>
              </div>
            </div>
          </div>

          {/* RIGHT 4-COLUMN: STEP-BY-STEP TRANSMISSION & PHARMACOLOGY LAB */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {/* SYNAPSE TRANSMISSION STEP-BY-STEP CONTROLLER */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" /> 7-Step Synaptic Sequence
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  Step {currentStep} of 7
                </span>
              </div>

              {/* Play / Pause / Step Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex-1 py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    isPlaying
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-sky-600 hover:bg-sky-500 text-white'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Pause Sequence</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Auto Play Synapse</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStep((prev) => Math.max(1, prev - 1));
                  }}
                  disabled={currentStep <= 1}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-all cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStep((prev) => Math.min(7, prev + 1));
                  }}
                  disabled={currentStep >= 7}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-all cursor-pointer"
                  title="Next Step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Step indicator pills */}
              <div className="grid grid-cols-7 gap-1">
                {SYNAPTIC_STEPS.map((s) => (
                  <button
                    key={s.step}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStep(s.step);
                    }}
                    className={`py-1.5 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentStep === s.step
                        ? 'bg-sky-500 text-white font-black shadow-md'
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {s.step}
                  </button>
                ))}
              </div>

              {/* Active Step Detailed Card */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-sky-300">
                    {activeStepData.step}. {activeStepData.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {activeStepData.summary}
                </p>
                <div className="text-[10px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                  <strong className="text-amber-400 block mb-0.5">Biochemical Detail:</strong>
                  {activeStepData.mechanism}
                </div>
              </div>
            </div>

            {/* PHARMACOLOGY / DRUG INTERFERENCE LAB */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4" /> Pharmacology Assay Lab
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  3 Conditions
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {Object.values(DRUG_ASSAYS).map((drug) => {
                  const isSelected = selectedDrug === drug.id;
                  return (
                    <button
                      key={drug.id}
                      onClick={() => {
                        setSelectedDrug(drug.id);
                        emitTelemetry('DRUG_ASSAY_SELECTED', {
                          drug: drug.id,
                          acheActive: drug.acheActive,
                          receptorsFree: drug.receptorsFree
                        });
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-1 ${
                        isSelected
                          ? drug.id === 'normal'
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200'
                            : drug.id === 'organophosphate'
                            ? 'bg-rose-500/20 border-rose-500 text-rose-200 shadow-md shadow-rose-950'
                            : 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md shadow-amber-950'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{drug.name}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-current shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-300 leading-snug">
                        {drug.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Drug Outcome Box */}
              <div
                className={`p-3 rounded-xl border text-[11px] flex flex-col gap-1.5 ${
                  selectedDrug === 'normal'
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : selectedDrug === 'organophosphate'
                    ? 'bg-rose-950/50 border-rose-500/40 text-rose-200'
                    : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Clinical Physiological Consequence:</span>
                </div>
                <p className="text-[10px] leading-relaxed">{activeDrugData.clinicalEffect}</p>
                <div className="text-[10px] opacity-80 pt-1 border-t border-current/20">
                  {activeDrugData.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AXON ARCHITECTURE & SALTATORY CONDUCTION THEORY */}
      {activeTab === 'axon_theory' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-5 text-xs text-slate-300 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Macroscopic Neurone Structure & Saltatory Conduction
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                How myelinated axons achieve rapid conduction velocity up to 120 metres per second.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              Form 4 Topic 3 Syllabus
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col gap-2">
              <h3 className="font-bold text-sky-300 text-sm flex items-center gap-1.5">
                1. Resting Potential (-70 mV)
              </h3>
              <p className="text-[11px] leading-relaxed text-slate-300">
                At rest, the interior of the axon axoplasm is negatively charged (-70 mV) relative to the extracellular interstitial fluid. This polarized state is actively maintained by:
              </p>
              <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-400">
                <li>
                  <strong className="text-slate-200">Sodium-Potassium Pump (Na⁺/K⁺-ATPase):</strong> Pumps 3 Na⁺ out for every 2 K⁺ pumped in, utilizing ATP energy.
                </li>
                <li>
                  <strong className="text-slate-200">Differential Membrane Permeability:</strong> Axolemma is significantly more permeable to K⁺ (leak channels) than to Na⁺, allowing positive K⁺ to diffuse out down concentration gradient.
                </li>
                <li>
                  <strong className="text-slate-200">Non-diffusible Anions:</strong> Large, negatively charged intracellular proteins and phosphate ions trapped inside cytoplasm.
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col gap-2">
              <h3 className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
                2. Saltatory Conduction at Nodes of Ranvier
              </h3>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Myelin sheaths formed by Schwann cells contain high lipid content (sphingomyelin) which acts as an excellent electrical insulator:
              </p>
              <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-400">
                <li>
                  <strong>Nodes of Ranvier:</strong> Unmyelinated gaps along the axon where the axolemma is exposed to extracellular fluid, densely packed with voltage-gated Na⁺ channels.
                </li>
                <li>
                  <strong>Saltatory Jumping:</strong> Local circuits of current flow from one active node directly to the adjacent inactive node. The impulse jumps between nodes rather than depolarizing every adjacent micrometer!
                </li>
                <li>
                  <strong>Velocity Advantage:</strong> Reaches 100–120 m/s compared to 1–2 m/s in unmyelinated fibres, conserving cellular ATP energy since pumps only operate at the nodes.
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-bold text-amber-400 block mb-1">Depolarization (+30 mV)</span>
              <span className="text-[11px] text-slate-400">
                A stimulus exceeding threshold (-55 mV) opens voltage-gated Na⁺ channels. Rapid Na⁺ influx causes membrane potential to swing from -70 mV to +30 mV.
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-bold text-purple-400 block mb-1">Repolarization</span>
              <span className="text-[11px] text-slate-400">
                Voltage Na⁺ channels inactivate; voltage-gated K⁺ channels swing open, allowing K⁺ efflux, restoring internal negative potential.
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-bold text-rose-400 block mb-1">Refractory Period</span>
              <span className="text-[11px] text-slate-400">
                Temporary hyperpolarization (-80 mV) during which the axon cannot fire another impulse. Enforces discrete impulses and unidirectionality!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYNAPTIC TRANSMISSION & UNIDIRECTIONALITY THEORY */}
      {activeTab === 'synapse_theory' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-5 text-xs text-slate-300 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-400" />
                Chemical Synaptic Transmission & Anatomical Unidirectionality
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Detailed mechanism across the 20 nm physical fluid cleft and why transmission is strictly one-way.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold">
              Form 4 High-Yield
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col gap-2.5">
              <h3 className="font-bold text-sky-300 text-sm flex items-center gap-1.5">
                Why Can Impulses Travel ONLY in One Direction?
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                KCSE examiners frequently ask students to explain why synaptic transmission is strictly unidirectional. The 3 biological reasons are:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-[11px] text-slate-400">
                <li>
                  <strong className="text-slate-200">Vesicle Localization:</strong> Synaptic vesicles storing neurotransmitters (Acetylcholine) are located <em>exclusively</em> in the presynaptic terminal knob.
                </li>
                <li>
                  <strong className="text-slate-200">Receptor Localization:</strong> Complementary ligand-gated receptor proteins and Chemically-operated Na⁺ channels are situated <em>exclusively</em> on the postsynaptic membrane.
                </li>
                <li>
                  <strong className="text-slate-200">Axon Refractory Period:</strong> Voltage-gated Na⁺ channels behind the travelling action potential are temporarily inactivated, preventing retrograde conduction along the axon.
                </li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col gap-2.5">
              <h3 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                The Vital Role of Acetylcholinesterase (AChE)
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Once Acetylcholine binds to the postsynaptic receptors, it must be cleared instantaneously (within 0.5–1 millisecond) to allow the postsynaptic membrane to repolarize:
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-[10px] text-emerald-400 text-center">
                Acetylcholine + H₂O ➔ Choline + Ethanoate (Acetate) [Catalyzed by AChE]
              </div>
              <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-400">
                <li>
                  <strong>Prevention of Tetany:</strong> If ACh is not hydrolyzed, receptor channels remain open permanently, causing continuous muscle contraction and convulsions.
                </li>
                <li>
                  <strong>Choline Recycling:</strong> Choline is actively taken back up into the presynaptic bulb via ChT transporters and recombined with Acetyl-CoA using ATP from mitochondria.
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Anatomy Explorer Cards */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-200 text-xs">
              Interactive Microstructure Inspector (Click to Learn):
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {ANATOMY_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedAnatomy(item)}
                  className={`p-2 rounded-xl text-left border text-[11px] transition-all cursor-pointer ${
                    selectedAnatomy.id === item.id
                      ? 'bg-sky-500/20 border-sky-500 text-sky-200 font-bold shadow'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>

            {selectedAnatomy && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 mt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sky-300 text-xs">{selectedAnatomy.title}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {selectedAnatomy.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedAnatomy.desc}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PHARMACOLOGY & NEUROTOXICOLOGY */}
      {activeTab === 'pharmacology' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-5 text-xs text-slate-300 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-rose-400" />
                Pharmacology & Neurotoxins Affecting Synapses
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Agricultural insecticides, war nerve gases, and medicinal neuromuscular blockers.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
              Applied Biology
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-rose-500/30 flex flex-col gap-2">
              <span className="font-black text-rose-400 text-sm">
                Organophosphates (e.g. Malathion, Sarin)
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[10px] font-bold w-fit">
                Irreversible AChE Inhibitor
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Phosphorylates the active serine residue of Acetylcholinesterase. ACh cannot be cleaved and accumulates in huge amounts in synaptic clefts throughout somatic and parasympathetic systems.
              </p>
              <div className="text-[10px] text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-500/20 mt-auto">
                <strong>Symptoms:</strong> Pinpoint pupils (miosis), excessive salivation, severe convulsions, bronchospasm, and death by asphyxiation. Antidote: Atropine + Pralidoxime.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-amber-500/30 flex flex-col gap-2">
              <span className="font-black text-amber-400 text-sm">
                Curare (d-Tubocurarine) & α-Bungarotoxin
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold w-fit">
                Nicotinic Receptor Antagonist
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Derived from South American climbing vine Chondrodendron tomentosum. Competitively binds to acetylcholine receptor sites on motor end-plates without opening Na⁺ channels.
              </p>
              <div className="text-[10px] text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-500/20 mt-auto">
                <strong>Symptoms:</strong> Flaccid muscle paralysis. The patient remains fully conscious but unable to move or breathe. Used in controlled surgery for muscle relaxation.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-sky-500/30 flex flex-col gap-2">
              <span className="font-black text-sky-400 text-sm">
                Botulinum Toxin (Botox) & Novocaine
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 text-[10px] font-bold w-fit">
                Exocytosis & Channel Blockers
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <strong>Botox:</strong> Cleaves SNARE proteins in presynaptic knob, permanently blocking vesicle fusion and ACh release.
                <br className="my-1" />
                <strong>Local Anaesthetics (Novocaine/Lidocaine):</strong> Block voltage-gated Na⁺ channels on sensory axon membranes, preventing action potential propagation.
              </p>
              <div className="text-[10px] text-sky-300 bg-sky-950/40 p-2 rounded border border-sky-500/20 mt-auto">
                <strong>Application:</strong> Pain-free dental procedures, cosmetic wrinkle reduction, and muscle spasticity relief.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: KCSE EXAM CHALLENGE */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 text-xs text-slate-200 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Form 4 KCSE Examination Challenge
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Past KCSE questions on impulse conduction, saltatory jumping, synaptic transmission, and toxicology.
              </p>
            </div>
            {quizSubmitted && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Score: {quizScore} / {KCSE_EXAM_QUESTIONS.length} (
                {Math.round((quizScore / KCSE_EXAM_QUESTIONS.length) * 100)}%)
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4 max-h-[460px] overflow-y-auto pr-1">
            {KCSE_EXAM_QUESTIONS.map((q, idx) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col gap-2.5"
              >
                <p className="font-bold text-slate-100 text-xs">
                  {idx + 1}. {q.question}
                </p>

                <div className="flex flex-col gap-1.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    const isCorrect = q.correct === optIdx;
                    let style = 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-700';

                    if (quizSubmitted) {
                      if (isCorrect) {
                        style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                      } else if (isSelected && !isCorrect) {
                        style = 'bg-rose-500/20 border-rose-500 text-rose-300 line-through';
                      }
                    } else if (isSelected) {
                      style = 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectQuizAnswer(q.id, optIdx)}
                        className={`p-2.5 rounded-lg text-left text-[11px] border transition-all cursor-pointer ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="text-[10px] text-slate-300 italic pt-2 border-t border-slate-700/50 bg-slate-900/60 p-2 rounded-lg">
                    <strong className="text-amber-400 not-italic">KCSE Examiner Rationale: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quiz Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < KCSE_EXAM_QUESTIONS.length}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer disabled:opacity-40"
              >
                Submit Answers ({Object.keys(selectedAnswers).length}/{KCSE_EXAM_QUESTIONS.length})
              </button>
            ) : (
              <button
                onClick={handleRetakeQuiz}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer"
              >
                Retake Examination Challenge
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
