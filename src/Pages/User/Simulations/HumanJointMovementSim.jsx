import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Activity,
  RotateCcw,
  Play,
  Pause,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  Info,
  Sliders,
  ShieldAlert,
  Droplets,
  Gauge,
  Compass,
  Eye,
  Zap,
  Volume2,
  VolumeX,
  ArrowRight,
  Layers,
  HelpCircle,
  Flame,
  Sparkles,
  ChevronRight,
  Maximize2
} from 'lucide-react';

/**
 * Web Audio Synthesizer for Synovial Joint Biomechanics
 * Produces subtle cartilage glide, crepitus friction, ligament tension, and quiz chimes
 */
class JointAcousticSynth {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      this.ctx = new AudioCtx();
    }
  }
  playGlide() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.085);
    } catch {
      // Audio safety guard
    }
  }
  playCrepitus() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      // Harsh jagged click sound for bone-on-bone crepitus in osteoarthritis
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      noise.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {
      // Audio safety guard
    }
  }
  playChime() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.03, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.19);
      });
    } catch {
      // Audio safety guard
    }
  }
}

const jointAudio = new JointAcousticSynth();

/**
 * High-Yield KCSE Exam Questions on Synovial Joint Anatomy & Biomechanics
 */
const KCSE_JOINT_QUESTIONS = [
  {
    id: 1,
    category: 'Core Misconception Buster',
    question:
      'In human synovial joints, distinguish precisely between the structural connection and function of a LIGAMENT versus a TENDON:',
    options: [
      {
        id: 'A',
        text: 'Ligament connects bone to bone to stabilize the joint and prevent dislocation; Tendon connects muscle to bone to transmit contractile pulling force.',
        correct: true,
      },
      {
        id: 'B',
        text: 'Ligament connects muscle to bone to pull limbs; Tendon connects bone to bone to cushion articular shock.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Both ligaments and tendons connect bone to bone, but tendons contain abundant calcium phosphate salts.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Ligaments secrete lubricating synovial fluid, whereas tendons contain chondrocytes that form hyaline cartilage.',
        correct: false,
      },
    ],
    explanation:
      'KCSE Marking Scheme Key Rule: LIGAMENT = Bone-to-Bone connection (tough inelastic fibrous cords that hold articulating bones together and prevent dislocation). TENDON = Muscle-to-Bone connection (inelastic white fibrous cord transmitting mechanical force from muscle contraction to move the skeleton).',
  },
  {
    id: 2,
    category: 'Avascular Cartilage & Nutrition',
    question:
      'Why does damaged articular (hyaline) cartilage in adult synovial joints heal extremely slowly or fail to regenerate after injury?',
    options: [
      {
        id: 'A',
        text: 'Hyaline cartilage is completely avascular (lacks blood capillaries) and relies solely on slow diffusion of oxygen and nutrients from synovial fluid.',
        correct: true,
      },
      {
        id: 'B',
        text: 'Cartilage matrix is composed of dead keratinocytes that cannot undergo mitotic cell division.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Synovial fluid is highly acidic and instantly hydrolyzes any newly synthesized collagen fibrils.',
        correct: false,
      },
      {
        id: 'D',
        text: 'White fibrous ligaments release osteoclasts that continuously digest damaged chondrocytes.',
        correct: false,
      },
    ],
    explanation:
      'Articular cartilage is strictly avascular and aneural. Its living chondrocytes depend entirely on nutrient and oxygen diffusion through the viscous synovial fluid under hydrostatic pressure gradients. Without a direct capillary bed, cellular turnover and healing are minimal.',
  },
  {
    id: 3,
    category: 'Synovial Fluid & Lubrication',
    question:
      'What are the primary physiological roles of the synovial fluid secreted by the synovial membrane in a freely movable joint?',
    options: [
      {
        id: 'A',
        text: 'Minimizes friction (coefficient μ ≈ 0.003), absorbs mechanical shock, and nourishes the avascular articular cartilage.',
        correct: true,
      },
      {
        id: 'B',
        text: 'Conducts motor nerve impulses across the joint cavity to activate antagonist muscle fibers.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Cements articulating epiphyses together to prevent any angular movement between bones.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Deposits hydroxyapatite crystals to convert the joint cavity into solid compact bone.',
        correct: false,
      },
    ],
    explanation:
      'Synovial fluid is rich in hyaluronic acid and lubricin, producing an ultra-slippery fluid film with a remarkably low friction coefficient (μ ≈ 0.003, 3x smoother than ice-on-ice). It lubricates sliding cartilages, dampens impact forces, and delivers glucose/amino acids to chondrocytes.',
  },
  {
    id: 4,
    category: 'Degenerative Pathology: Osteoarthritis',
    question:
      'Which cascade of structural changes characterizes Osteoarthritis within a synovial joint?',
    options: [
      {
        id: 'A',
        text: 'Progressive erosion of articular cartilage, narrowing of joint space, bone-on-bone friction, and formation of osteophytes (bone spurs).',
        correct: true,
      },
      {
        id: 'B',
        text: 'Excessive synovial fluid secretion leading to hyper-elastic ligament elongation and spontaneous joint dislocation.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Bacterial infection causing immediate ossification of the biceps brachii tendon and muscle atrophy.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Permanent fusion of red marrow cavities between proximal and distal long bone shafts.',
        correct: false,
      },
    ],
    explanation:
      'In Osteoarthritis, wear-and-tear or mechanical trauma erodes the protective hyaline cartilage cap. As the cartilage wears down, exposed subchondral bone surfaces grind against each other, increasing the friction coefficient up to ~0.50. Compensatory bone remodeling leads to painful marginal bone spurs (osteophytes) and joint space narrowing.',
  },
  {
    id: 5,
    category: 'Joint Classification & Degrees of Freedom',
    question:
      'How does a synovial hinge joint (e.g. elbow/knee) differ mechanically from a ball-and-socket joint (e.g. shoulder/hip)?',
    options: [
      {
        id: 'A',
        text: 'A hinge joint permits motion in only ONE plane (flexion/extension, 1 degree of freedom), whereas a ball-and-socket allows motion in ALL THREE planes (rotation, circumduction, 3 degrees of freedom).',
        correct: true,
      },
      {
        id: 'B',
        text: 'A hinge joint allows 360° circumduction in all directions, whereas a ball-and-socket is restricted to linear gliding in one plane.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Hinge joints lack synovial cavities and ligaments, whereas ball-and-socket joints possess them.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Hinge joints connect flat bones of the cranium, while ball-and-socket joints articulate only ribs with the sternum.',
        correct: false,
      },
    ],
    explanation:
      'Hinge joints (ginglymi) have cylindrical surfaces fitting into matching troughs, confining motion to a single plane like a door hinge (flexion and extension). Ball-and-socket joints (spheroidal) feature a spherical head seated in a cup-like socket, granting multi-axial movement: flexion/extension, abduction/adduction, and 360° circumduction.',
  },
];

/**
 * Anatomical Structure Guides for Interactive Exploration
 */
const ANATOMY_GUIDE = {
  cartilage: {
    name: 'Articular (Hyaline) Cartilage',
    badge: 'Frictionless Shock Absorber',
    color: 'text-cyan-400',
    border: 'border-cyan-500/40',
    bg: 'bg-cyan-950/40',
    connection: 'Covers Epiphyses (Ends of Articulating Bones)',
    structure: 'Glassy, bluish-white avascular connective tissue embedded with type II collagen fibrils & chondroitin sulfate proteoglycans.',
    function: 'Distributes joint compressive loads evenly, absorbs high impact shocks, and provides an ultra-low friction bearing surface (μ ≈ 0.003).',
    kcseFact: 'Lacks blood vessels, lymphatics, and nerves (avascular). Nourishment is entirely dependent on synovial fluid diffusion under pressure.',
  },
  ligament: {
    name: 'Capsular & Collateral Ligaments',
    badge: 'Bone-to-Bone Stabilizer',
    color: 'text-amber-400',
    border: 'border-amber-500/40',
    bg: 'bg-amber-950/40',
    connection: 'BONE TO BONE (Encapsulates and Bridges Joint)',
    structure: 'Dense regular fibrous connective tissue composed of tightly packed, parallel bundles of tough collagen fibers.',
    function: 'Holds the articulating bones together, limits excessive or abnormal joint movement, and prevents dislocation during strenuous loads.',
    kcseFact: 'Ligaments connect BONE TO BONE. They are tough and inelastic to prevent dislocation; damage (sprain) results when forced beyond physiological limits.',
  },
  tendon: {
    name: 'Tendons of Antagonistic Muscles',
    badge: 'Muscle-to-Bone Force Transmitter',
    color: 'text-slate-200',
    border: 'border-slate-400/40',
    bg: 'bg-slate-800/40',
    connection: 'MUSCLE TO BONE (Anchors Muscle Belly to Skeletal Lever)',
    structure: 'Pearly-white, extremely strong inelastic fibrous cords of densely packed collagen bundles continuous with the muscle epimysium.',
    function: 'Transmits contractile pulling force generated by muscle fibers directly onto the bone to create angular rotational movement around the joint axis.',
    kcseFact: 'Tendons connect MUSCLE TO BONE. They are inelastic so that 100% of the mechanical contraction is transmitted to move the bone lever without energy loss.',
  },
  synovial_membrane: {
    name: 'Synovial Membrane',
    badge: 'Secreting & Filtering Lining',
    color: 'text-pink-400',
    border: 'border-pink-500/40',
    bg: 'bg-pink-950/40',
    connection: 'Inner Vascular Lining of the Fibrous Capsule',
    structure: 'Specialized cellular layer (type A macrophage-like and type B fibroblast-like synoviocytes) rich in blood capillaries.',
    function: 'Actively synthesizes and secretes viscous synovial fluid into the joint cavity; filters blood plasma and absorbs cellular debris.',
    kcseFact: 'Lines the joint capsule except where articular cartilage covers the bone. Highly vascularized to deliver nutrients for fluid production.',
  },
  synovial_fluid: {
    name: 'Synovial Fluid & Joint Cavity',
    badge: 'Hydraulic Lubricant & Nutrient Bath',
    color: 'text-sky-300',
    border: 'border-sky-500/40',
    bg: 'bg-sky-950/40',
    connection: 'Fills Hermetically Sealed Synovial Cavity',
    structure: 'Viscous, egg-white consistency dialysate of blood plasma fortified with hyaluronic acid, lubricin, and glucose.',
    function: 'Reduces friction between sliding cartilages to near zero (μ ≈ 0.003), acts as a shock-absorbing fluid buffer, and feeds chondrocytes.',
    kcseFact: 'Synovial fluid starvation or drying causes rapid cartilage abrasion, characteristic of advanced osteoarthritis.',
  },
  muscle: {
    name: 'Antagonistic Skeletal Muscles',
    badge: 'Contractile Motor Pairs',
    color: 'text-rose-400',
    border: 'border-rose-500/40',
    bg: 'bg-rose-950/40',
    connection: 'Arranged in Opposing Flexor & Extensor Pairs Across Joint',
    structure: 'Striated voluntary muscle fibers arranged in fascicles with actin and myosin myofilaments.',
    function: 'Can only PULL (contract); cannot actively push. One muscle (flexor) contracts to bend the joint while its antagonist (extensor) relaxes, and vice versa.',
    kcseFact: 'Muscles operate in antagonistic pairs because muscle tissue can only exert pulling force during active contraction.',
  },
  bone: {
    name: 'Articulating Long Bones (Epiphyses)',
    badge: 'Rigid Mechanical Levers',
    color: 'text-slate-300',
    border: 'border-slate-500/40',
    bg: 'bg-slate-900/60',
    connection: 'Articulating Epiphysis (e.g., Femur & Tibia or Humerus & Ulna)',
    structure: 'Compact cortical bone shell surrounding internal spongy (cancellous) trabeculae containing bone marrow.',
    function: 'Provides structural rigidity, acts as mechanical levers for locomotion, and bears compressive body weight.',
    kcseFact: 'Epiphyses are swollen long bone ends shaped into condyles or hemispherical heads to distribute joint pressures across a wider area.',
  },
};

export default function HumanJointMovementSim({ config = {}, onTelemetry }) {
  // Primary Simulation Controls
  const [jointType, setJointType] = useState('hinge'); // 'hinge' (Elbow/Knee) | 'ball_socket' (Shoulder/Hip)
  const [flexionAngle, setFlexionAngle] = useState(30); // 0° (Full Extension) to 140° (Full Flexion)
  const [isOsteoarthritis, setIsOsteoarthritis] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // View Options
  const [showMusclesAndTendons, setShowMusclesAndTendons] = useState(true);
  const [showLigaments, setShowLigaments] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showForces, setShowForces] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Inspector & Quiz Tabs
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'misconceptions' | 'quiz'
  const [selectedStructureKey, setSelectedStructureKey] = useState('cartilage');

  // Quiz State
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  // Animation Loop Ref
  const animFrameRef = useRef(null);
  const animDirectionRef = useRef(1);

  // Telemetry Emit Helper
  const emitTelemetryCheckpoint = useCallback(
    (checkpoint, meta = {}) => {
      if (onTelemetry) {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'synovial_joint_biomechanics_3d',
          checkpoint,
          jointType,
          flexionAngle: Math.round(flexionAngle),
          isOsteoarthritis,
          ...meta,
        });
      }
    },
    [onTelemetry, jointType, flexionAngle, isOsteoarthritis]
  );

  // Emit initial mount telemetry
  useEffect(() => {
    emitTelemetryCheckpoint('simulation_initialized');
  }, []);

  // Continuous Auto-play articulation motion loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const updateMotion = (now) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      setFlexionAngle((prev) => {
        const speed = 45; // degrees per second
        let next = prev + speed * delta * animDirectionRef.current;
        if (next >= 135) {
          next = 135;
          animDirectionRef.current = -1;
        } else if (next <= 5) {
          next = 5;
          animDirectionRef.current = 1;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(updateMotion);
    };

    animFrameRef.current = requestAnimationFrame(updateMotion);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Audio effect on flexion movement
  const lastSoundAngleRef = useRef(flexionAngle);
  useEffect(() => {
    if (!soundEnabled) return;
    if (Math.abs(flexionAngle - lastSoundAngleRef.current) > 12) {
      lastSoundAngleRef.current = flexionAngle;
      if (isOsteoarthritis) {
        jointAudio.playCrepitus();
      } else {
        jointAudio.playGlide();
      }
    }
  }, [flexionAngle, isOsteoarthritis, soundEnabled]);

  // Biomechanical & Physics Metrics
  const metrics = useMemo(() => {
    // Friction coefficient μ
    // Healthy synovial joint: μ ~ 0.003
    // Osteoarthritis bone-on-bone: μ ~ 0.485
    const mu = isOsteoarthritis
      ? (0.46 + (flexionAngle / 140) * 0.08).toFixed(3)
      : (0.003 + (flexionAngle / 140) * 0.001).toFixed(3);

    // Dynamic Joint Cavity Pressure (kPa)
    const basePressure = 110;
    const dynamicPressure = Math.round(
      (basePressure + Math.sin((flexionAngle * Math.PI) / 180) * 85) * (isOsteoarthritis ? 2.4 : 1.0)
    );

    // Flexor Muscle (Biceps / Hamstrings) Contraction Metrics
    const flexPercent = Math.round((flexionAngle / 140) * 100);
    const flexorTensionN = Math.round(45 + (flexionAngle / 140) * 310);
    const muscleBulgePx = 28 + (flexionAngle / 140) * 16; // Muscle belly thickness expands

    // Extensor Muscle (Triceps / Quadriceps) Lengthening
    const extensorTensionN = Math.max(15, Math.round(280 - (flexionAngle / 140) * 220));

    // Cartilage shock absorption capability
    const shockAbsorption = isOsteoarthritis ? Math.max(12, Math.round(22 - (flexionAngle / 140) * 8)) : 96;

    // Range of Motion (Degrees of freedom)
    const dof = jointType === 'hinge' ? '1 Plane (Flexion/Extension)' : '3 Planes (360° Circumduction)';

    return {
      mu,
      dynamicPressure,
      flexPercent,
      flexorTensionN,
      extensorTensionN,
      muscleBulgePx,
      shockAbsorption,
      dof,
    };
  }, [flexionAngle, isOsteoarthritis, jointType]);

  // Handlers
  const handleFlexionChange = (e) => {
    const val = parseFloat(e.target.value);
    setFlexionAngle(val);
    if (val === 0 || val === 140) {
      emitTelemetryCheckpoint('flexion_limit_reached', { angle: val });
    }
  };

  const handleToggleCondition = () => {
    const nextState = !isOsteoarthritis;
    setIsOsteoarthritis(nextState);
    if (soundEnabled && nextState) {
      jointAudio.playCrepitus();
    }
    emitTelemetryCheckpoint('osteoarthritis_toggled', { hasOsteoarthritis: nextState });
  };

  const handleSelectJointType = (type) => {
    setJointType(type);
    emitTelemetryCheckpoint('joint_type_selected', { jointType: type });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setFlexionAngle(0);
    setIsOsteoarthritis(false);
    setJointType('hinge');
    setSelectedStructureKey('cartilage');
    emitTelemetryCheckpoint('simulation_reset');
  };

  const handleQuizAnswer = (qId, optId) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optId }));
    setShowFeedback(true);
    if (soundEnabled) {
      jointAudio.playGlide();
    }
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    KCSE_JOINT_QUESTIONS.forEach((q) => {
      const correctOpt = q.options.find((o) => o.correct);
      if (userAnswers[q.id] === correctOpt.id) {
        score += 1;
      }
    });
    setQuizScore(score);
    if (soundEnabled && score >= 4) {
      jointAudio.playChime();
    }
    emitTelemetryCheckpoint('kcse_quiz_completed', { score, total: KCSE_JOINT_QUESTIONS.length });
  };

  // SVG Geometry Calculation Constants
  // Center of joint pivot
  const cx = 390;
  const cy = 250;
  const rad = (flexionAngle * Math.PI) / 180;

  // Distal rotating bone endpoint
  const distalLength = 175;
  // Rotate around (cx, cy) from pointing straight down (angle = 0 is vertically down: x = cx, y = cy + distalLength)
  // Flexion bends the distal bone up and leftward:
  // At angle = 0: vector is (0, distalLength)
  // At angle = theta: vector is (-distalLength * sin(rad), distalLength * cos(rad))
  const distalX = cx - distalLength * Math.sin(rad);
  const distalY = cy + distalLength * Math.cos(rad);

  // Tendon attachment point on rotating distal bone (e.g. Radial/Tibial tuberosity)
  const tuberosityDist = 48;
  const tuberosityX = cx - tuberosityDist * Math.sin(rad) - 18 * Math.cos(rad);
  const tuberosityY = cy + tuberosityDist * Math.cos(rad) - 18 * Math.sin(rad);

  // Flexor Muscle Origin on proximal bone shaft
  const flexorOriginX = cx - 45;
  const flexorOriginY = cy - 185;

  // Extensor Muscle Origin & Insertion
  const extensorOriginX = cx + 45;
  const extensorOriginY = cy - 185;
  const olecranonX = cx + 22 * Math.cos(rad) + 12 * Math.sin(rad);
  const olecranonY = cy + 22 * Math.sin(rad) - 12 * Math.cos(rad);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-5 md:p-6 font-sans antialiased selection:bg-cyan-500/30">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* ================================================================= */}
        {/* HEADER SECTION                                                    */}
        {/* ================================================================= */}
        <header className="rounded-3xl bg-slate-900/90 border border-slate-800/80 p-4 sm:p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-white/20 shrink-0">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-cyan-950/90 text-cyan-300 border border-cyan-800/60">
                    Form 4 Biology · Topic 4
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                    Support & Movement
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Biomechanics Lab
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                  Human Joint Movement & Synovial Biomechanics
                </h1>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
              <button
                onClick={() => setSoundEnabled((prev) => !prev)}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  soundEnabled
                    ? 'bg-slate-800 border-slate-700 text-cyan-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
                title={soundEnabled ? 'Mute Sound Effects' : 'Enable Joint Acoustics'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Core Misconception Alert Callout Banner */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                L
              </span>
              <div>
                <span className="font-bold text-amber-300 block">LIGAMENT = Bone to Bone</span>
                <span className="text-slate-300 text-[11px] leading-snug">
                  Tough, inelastic fibrous bands that hold joints together & prevent dislocation.
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-800/50 border border-slate-600/40 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-slate-700 text-slate-200 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                T
              </span>
              <div>
                <span className="font-bold text-slate-200 block">TENDON = Muscle to Bone</span>
                <span className="text-slate-300 text-[11px] leading-snug">
                  Dense white fibrous cords transmitting active muscle contractile pull to lever bones.
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                C
              </span>
              <div>
                <span className="font-bold text-cyan-300 block">CARTILAGE = Avascular Cushion</span>
                <span className="text-slate-300 text-[11px] leading-snug">
                  Glassy hyaline surface (μ ≈ 0.003) absorbing impact; nourished via synovial fluid diffusion.
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ================================================================= */}
        {/* NAVIGATION TABS                                                   */}
        {/* ================================================================= */}
        <div className="flex items-center gap-2 p-1 bg-slate-900/80 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'simulation'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Interactive Biomechanical Stage
          </button>
          <button
            onClick={() => setActiveTab('misconceptions')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'misconceptions'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Anatomy & Misconception Master
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> KCSE Examination Challenge
            {quizScore !== null && (
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-black">
                {quizScore}/5
              </span>
            )}
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: INTERACTIVE BIOMECHANICAL STAGE                            */}
        {/* ================================================================= */}
        {activeTab === 'simulation' && (
          <div className="space-y-5">
            {/* Primary Interactive Viewport */}
            <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-xl">
              {/* Floating Top HUD Bar */}
              <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto">
                  <div className="px-3 py-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-700/60 text-xs font-mono font-bold text-cyan-300 shadow-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    {jointType === 'hinge' ? 'Hinge Joint (1 Plane / Ginglymus)' : 'Ball-and-Socket Joint (3 Planes / Spheroidal)'}
                  </div>
                  {isOsteoarthritis ? (
                    <div className="px-3 py-1.5 rounded-2xl bg-rose-950/90 backdrop-blur-md border border-rose-600 text-xs font-bold text-rose-300 shadow-lg flex items-center gap-1.5 animate-pulse">
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      Osteoarthritis Active (Bone-on-Bone)
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-2xl bg-emerald-950/80 backdrop-blur-md border border-emerald-600/50 text-xs font-bold text-emerald-300 shadow-lg flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                      Healthy Hyaline Cartilage
                    </div>
                  )}
                </div>

                {/* Overlaid Viewport Toggles */}
                <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-2xl border border-slate-800 pointer-events-auto">
                  <button
                    onClick={() => setShowMusclesAndTendons((prev) => !prev)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      showMusclesAndTendons ? 'bg-rose-600/30 text-rose-200 border border-rose-500/40' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Toggle Antagonistic Muscles and Tendons"
                  >
                    Muscles & Tendons
                  </button>
                  <button
                    onClick={() => setShowLigaments((prev) => !prev)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      showLigaments ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Toggle Bone-to-Bone Ligaments"
                  >
                    Ligaments
                  </button>
                  <button
                    onClick={() => setShowLabels((prev) => !prev)}
                    className={`p-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                      showLabels ? 'bg-cyan-600/30 text-cyan-300' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Toggle Anatomy Callouts"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowForces((prev) => !prev)}
                    className={`p-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                      showForces ? 'bg-indigo-600/30 text-indigo-300' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Toggle Biomechanical Force Vectors"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsPlaying((prev) => !prev);
                      if (soundEnabled) jointAudio.playGlide();
                    }}
                    className={`p-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                      isPlaying ? 'bg-emerald-600/40 text-emerald-300 animate-pulse' : 'text-slate-400 hover:text-white'
                    }`}
                    title={isPlaying ? 'Pause Motion Loop' : 'Play Continuous Flexion Loop'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* High-Fidelity Organic SVG Joint Cutaway Illustration */}
              <div className="w-full flex items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-slate-950 via-[#0a1124] to-slate-950">
                <svg
                  viewBox="0 0 780 480"
                  className="w-full h-auto max-h-[490px] select-none overflow-visible"
                  style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))' }}
                >
                  <defs>
                    {/* Bone Linear Gradients */}
                    <linearGradient id="boneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="30%" stopColor="#e2e8f0" />
                      <stop offset="70%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>

                    <linearGradient id="distalBoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="40%" stopColor="#e2e8f0" />
                      <stop offset="85%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>

                    {/* Articular Hyaline Cartilage Gradient */}
                    <linearGradient id="healthyCartilageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7dd3fc" />
                      <stop offset="50%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>

                    {/* Degraded Osteoarthritic Cartilage Gradient */}
                    <linearGradient id="degradedCartilageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#b91c1c" />
                      <stop offset="100%" stopColor="#7f1d1d" />
                    </linearGradient>

                    {/* Golden Fibrous Ligament Pattern / Gradient */}
                    <linearGradient id="ligamentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="45%" stopColor="#f59e0b" />
                      <stop offset="80%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>

                    {/* Red Muscle Belly Gradient */}
                    <linearGradient id="muscleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f87171" />
                      <stop offset="35%" stopColor="#ef4444" />
                      <stop offset="70%" stopColor="#dc2626" />
                      <stop offset="100%" stopColor="#991b1b" />
                    </linearGradient>

                    {/* White Inelastic Tendon Gradient */}
                    <linearGradient id="tendonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#f1f5f9" />
                      <stop offset="85%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>

                    {/* Synovial Fluid Glowing Chamber Radial Gradient */}
                    <radialGradient id="fluidChamberGrad" cx="50%" cy="50%" r="60%">
                      <stop
                        offset="0%"
                        stopColor={isOsteoarthritis ? 'rgba(245, 158, 11, 0.45)' : 'rgba(56, 189, 248, 0.45)'}
                      />
                      <stop
                        offset="70%"
                        stopColor={isOsteoarthritis ? 'rgba(217, 119, 6, 0.25)' : 'rgba(14, 165, 233, 0.25)'}
                      />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>

                    {/* Drop Shadow Filter for Anatomy */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Grid background reference lines */}
                  <g opacity="0.12" stroke="#38bdf8" strokeWidth="0.8">
                    <line x1="0" y1={cy} x2="780" y2={cy} strokeDasharray="4 4" />
                    <line x1={cx} y1="0" x2={cx} y2="480" strokeDasharray="4 4" />
                    <circle cx={cx} cy={cy} r="60" fill="none" strokeDasharray="2 4" />
                    <circle cx={cx} cy={cy} r="130" fill="none" strokeDasharray="2 4" />
                  </g>

                  {/* ============================================================= */}
                  {/* HINGE JOINT RENDERING                                         */}
                  {/* ============================================================= */}
                  {jointType === 'hinge' ? (
                    <g id="hinge-joint-group">
                      {/* 1. Surrounding Antagonistic Muscles (Anterior Flexor & Posterior Extensor) */}
                      {showMusclesAndTendons && (
                        <g id="musculature">
                          {/* Flexor Muscle (Biceps / Brachialis) - Contracts (shortens & bulges) as flexionAngle increases */}
                          <g id="flexor-muscle">
                            {/* Flexor Belly */}
                            <path
                              d={`M ${flexorOriginX} ${flexorOriginY}
                                  C ${flexorOriginX - metrics.muscleBulgePx} ${cy - 120},
                                    ${flexorOriginX - metrics.muscleBulgePx} ${cy - 50},
                                    ${cx - 32} ${cy - 22}
                                  L ${cx - 16} ${cy - 22}
                                  C ${flexorOriginX - 10} ${cy - 50},
                                    ${flexorOriginX - 10} ${cy - 120},
                                    ${flexorOriginX + 16} ${flexorOriginY}
                                  Z`}
                              fill="url(#muscleGrad)"
                              stroke="#7f1d1d"
                              strokeWidth="1.8"
                              className="cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setSelectedStructureKey('muscle')}
                            />
                            {/* Muscle Fiber Striations */}
                            <path
                              d={`M ${flexorOriginX - 8} ${cy - 140} Q ${flexorOriginX - metrics.muscleBulgePx * 0.7} ${cy - 120} ${cx - 24} ${cy - 40}
                                  M ${flexorOriginX} ${cy - 120} Q ${flexorOriginX - metrics.muscleBulgePx * 0.5} ${cy - 90} ${cx - 20} ${cy - 30}`}
                              stroke="rgba(255,255,255,0.3)"
                              strokeWidth="1.2"
                              fill="none"
                            />

                            {/* Tendon of Flexor: Connects Muscle to Distal Bone (Tibia/Radius Tuberosity) */}
                            <path
                              d={`M ${cx - 24} ${cy - 22}
                                  Q ${cx - 28} ${cy + 10} ${tuberosityX} ${tuberosityY}`}
                              stroke="url(#tendonGrad)"
                              strokeWidth="7"
                              strokeLinecap="round"
                              fill="none"
                              className="cursor-pointer hover:stroke-cyan-300 transition-colors"
                              onClick={() => setSelectedStructureKey('tendon')}
                            />
                            {/* Tendon insertion badge */}
                            <circle cx={tuberosityX} cy={tuberosityY} r="4.5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
                          </g>

                          {/* Extensor Muscle (Triceps / Quadriceps) - Posterior side, elongates during flexion */}
                          <g id="extensor-muscle">
                            <path
                              d={`M ${extensorOriginX - 14} ${extensorOriginY}
                                  C ${extensorOriginX + 18} ${cy - 120},
                                    ${extensorOriginX + 22} ${cy - 50},
                                    ${cx + 28} ${cy - 18}
                                  L ${cx + 12} ${cy - 18}
                                  C ${extensorOriginX - 2} ${cy - 50},
                                    ${extensorOriginX - 4} ${cy - 120},
                                    ${extensorOriginX + 4} ${extensorOriginY}
                                  Z`}
                              fill="url(#muscleGrad)"
                              stroke="#7f1d1d"
                              strokeWidth="1.5"
                              opacity={Math.max(0.65, 1 - (flexionAngle / 140) * 0.35)}
                              className="cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setSelectedStructureKey('muscle')}
                            />

                            {/* Extensor Tendon inserting onto Olecranon process */}
                            <path
                              d={`M ${cx + 20} ${cy - 18}
                                  Q ${cx + 24} ${cy} ${olecranonX} ${olecranonY}`}
                              stroke="url(#tendonGrad)"
                              strokeWidth="6"
                              strokeLinecap="round"
                              fill="none"
                              className="cursor-pointer hover:stroke-cyan-300 transition-colors"
                              onClick={() => setSelectedStructureKey('tendon')}
                            />
                          </g>
                        </g>
                      )}

                      {/* 2. Proximal Bone (Femur / Humerus) - Fixed Top Bone */}
                      <g
                        id="proximal-femur"
                        className="cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => setSelectedStructureKey('bone')}
                      >
                        {/* Shaft */}
                        <path
                          d={`M ${cx - 24} ${cy - 210}
                              L ${cx + 24} ${cy - 210}
                              L ${cx + 30} ${cy - 65}
                              C ${cx + 56} ${cy - 48}, ${cx + 58} ${cy - 18}, ${cx + 18} ${cy - 8}
                              C ${cx + 5} ${cy - 14}, ${cx - 5} ${cy - 14}, ${cx - 18} ${cy - 8}
                              C ${cx - 58} ${cy - 18}, ${cx - 56} ${cy - 48}, ${cx - 30} ${cy - 65}
                              Z`}
                          fill="url(#boneGrad)"
                          stroke="#475569"
                          strokeWidth="2.5"
                        />

                        {/* Cancellous spongy bone cutaway internal texture */}
                        <g opacity="0.3" stroke="#64748b" strokeWidth="1">
                          <circle cx={cx - 20} cy={cy - 50} r="14" fill="none" strokeDasharray="3 3" />
                          <circle cx={cx + 20} cy={cy - 50} r="14" fill="none" strokeDasharray="3 3" />
                          <path d={`M ${cx - 15} ${cy - 140} L ${cx + 15} ${cy - 140} M ${cx - 18} ${cy - 100} L ${cx + 18} ${cy - 100}`} />
                        </g>

                        {/* Osteophytes (Bone Spurs) if Osteoarthritis */}
                        {isOsteoarthritis && (
                          <g id="femoral-osteophytes">
                            {/* Lateral spur */}
                            <polygon
                              points={`${cx - 54},${cy - 22} ${cx - 72},${cy - 15} ${cx - 52},${cy - 8}`}
                              fill="#f59e0b"
                              stroke="#b45309"
                              strokeWidth="1.5"
                            />
                            {/* Medial spur */}
                            <polygon
                              points={`${cx + 54},${cy - 22} ${cx + 72},${cy - 15} ${cx + 52},${cy - 8}`}
                              fill="#f59e0b"
                              stroke="#b45309"
                              strokeWidth="1.5"
                            />
                          </g>
                        )}
                      </g>

                      {/* 3. Proximal Articular (Hyaline) Cartilage Cap on Femoral Condyles */}
                      <g
                        id="proximal-cartilage"
                        className="cursor-pointer hover:brightness-125 transition-all"
                        onClick={() => setSelectedStructureKey('cartilage')}
                      >
                        <path
                          d={
                            isOsteoarthritis
                              ? // Thin, eroded, jagged cartilage cap with bone exposure in center
                                `M ${cx - 52} ${cy - 12}
                                 C ${cx - 34} ${cy - 2}, ${cx - 20} ${cy - 8}, ${cx - 8} ${cy - 6}
                                 L ${cx + 8} ${cy - 6}
                                 C ${cx + 20} ${cy - 8}, ${cx + 34} ${cy - 2}, ${cx + 52} ${cy - 12}
                                 L ${cx + 50} ${cy - 8}
                                 C ${cx + 30} ${cy + 1}, ${cx + 15} ${cy - 2}, ${cx} ${cy - 2}
                                 C ${cx - 15} ${cy - 2}, ${cx - 30} ${cy + 1}, ${cx - 50} ${cy - 8}
                                 Z`
                              : // Smooth, thick, glassy cushioning layer
                                `M ${cx - 54} ${cy - 12}
                                 C ${cx - 32} ${cy}, ${cx - 10} ${cy - 6}, ${cx} ${cy - 6}
                                 C ${cx + 10} ${cy - 6}, ${cx + 32} ${cy}, ${cx + 54} ${cy - 12}
                                 L ${cx + 50} ${cy - 3}
                                 C ${cx + 28} ${cy + 8}, ${cx + 8} ${cy + 3}, ${cx} ${cy + 3}
                                 C ${cx - 8} ${cy + 3}, ${cx - 28} ${cy + 8}, ${cx - 50} ${cy - 3}
                                 Z`
                          }
                          fill={isOsteoarthritis ? 'url(#degradedCartilageGrad)' : 'url(#healthyCartilageGrad)'}
                          stroke={isOsteoarthritis ? '#dc2626' : '#38bdf8'}
                          strokeWidth={isOsteoarthritis ? 1.5 : 2}
                          strokeDasharray={isOsteoarthritis ? '4 2' : 'none'}
                        />

                        {/* Friction wear sparks / abrasion lines under Osteoarthritis */}
                        {isOsteoarthritis && (
                          <g stroke="#f59e0b" strokeWidth="1.6">
                            <line x1={cx - 18} y1={cy - 4} x2={cx - 6} y2={cy + 1} />
                            <line x1={cx + 4} y1={cy} x2={cx + 16} y2={cy - 4} />
                            <circle cx={cx} cy={cy - 2} r="2" fill="#ef4444" />
                          </g>
                        )}
                      </g>

                      {/* 4. Synovial Cavity Chamber & Synovial Fluid */}
                      <g
                        id="synovial-cavity"
                        className="cursor-pointer"
                        onClick={() => setSelectedStructureKey('synovial_fluid')}
                      >
                        {/* Synovial fluid pool */}
                        <ellipse
                          cx={cx}
                          cy={cy + 4}
                          rx={isOsteoarthritis ? 46 : 58}
                          ry={isOsteoarthritis ? 10 : 16}
                          fill="url(#fluidChamberGrad)"
                        />

                        {/* Synovial micro-droplets / lubricating viscous particles */}
                        <g fill={isOsteoarthritis ? '#fbbf24' : '#bae6fd'} opacity={isOsteoarthritis ? 0.6 : 0.85}>
                          <circle cx={cx - 24} cy={cy + 3} r={isOsteoarthritis ? 1.5 : 2.2} />
                          <circle cx={cx + 22} cy={cy + 5} r={isOsteoarthritis ? 1.8 : 2.5} />
                          <circle cx={cx - 6} cy={cy + 7} r={isOsteoarthritis ? 1.2 : 2.0} />
                          <circle cx={cx + 8} cy={cy + 2} r={isOsteoarthritis ? 1.6 : 2.4} />
                        </g>
                      </g>

                      {/* 5. Synovial Membrane (Lines the Inner Capsule) */}
                      <g
                        id="synovial-membrane"
                        className="cursor-pointer hover:stroke-pink-300 transition-colors"
                        onClick={() => setSelectedStructureKey('synovial_membrane')}
                      >
                        <path
                          d={`M ${cx - 52} ${cy - 26}
                              C ${cx - 72} ${cy}, ${cx - 70} ${cy + 22}, ${cx - 44} ${cy + 32}
                              M ${cx + 52} ${cy - 26}
                              C ${cx + 72} ${cy}, ${cx + 70} ${cy + 22}, ${cx + 44} ${cy + 32}`}
                          stroke={isOsteoarthritis ? '#f43f5e' : '#ec4899'}
                          strokeWidth="2.8"
                          strokeDasharray="4 3"
                          fill="none"
                        />
                      </g>

                      {/* 6. Distal Articulating Bone (Tibia / Forearm) - Rotates around (cx, cy) */}
                      <g
                        id="distal-bone-rotating"
                        transform={`rotate(${-flexionAngle}, ${cx}, ${cy})`}
                        className="cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => setSelectedStructureKey('bone')}
                      >
                        {/* Tibial Articular Cartilage Cushion */}
                        <path
                          d={
                            isOsteoarthritis
                              ? `M ${cx - 48} ${cy + 10}
                                 C ${cx - 25} ${cy + 14}, ${cx} ${cy + 12}, ${cx + 25} ${cy + 14}
                                 L ${cx + 48} ${cy + 10}
                                 L ${cx + 45} ${cy + 15}
                                 C ${cx + 20} ${cy + 17}, ${cx - 20} ${cy + 17}, ${cx - 45} ${cy + 15}
                                 Z`
                              : `M ${cx - 52} ${cy + 8}
                                 C ${cx - 25} ${cy + 16}, ${cx} ${cy + 14}, ${cx + 25} ${cy + 16}
                                 L ${cx + 52} ${cy + 8}
                                 L ${cx + 48} ${cy + 18}
                                 C ${cx + 22} ${cy + 22}, ${cx - 22} ${cy + 22}, ${cx - 48} ${cy + 18}
                                 Z`
                          }
                          fill={isOsteoarthritis ? 'url(#degradedCartilageGrad)' : 'url(#healthyCartilageGrad)'}
                          stroke={isOsteoarthritis ? '#dc2626' : '#38bdf8'}
                          strokeWidth={isOsteoarthritis ? 1.5 : 2}
                          strokeDasharray={isOsteoarthritis ? '4 2' : 'none'}
                        />

                        {/* Tibial Plateau & Shaft */}
                        <path
                          d={`M ${cx - 50} ${cy + 18}
                              C ${cx - 62} ${cy + 42}, ${cx - 44} ${cy + 75}, ${cx - 24} ${cy + 100}
                              L ${cx - 20} ${cy + 220}
                              L ${cx + 20} ${cy + 220}
                              L ${cx + 24} ${cy + 100}
                              C ${cx + 44} ${cy + 75}, ${cx + 62} ${cy + 42}, ${cx + 50} ${cy + 18}
                              Z`}
                          fill="url(#distalBoneGrad)"
                          stroke="#475569"
                          strokeWidth="2.5"
                        />

                        {/* Tibial Tuberosity / Tendon Anchor Ridge */}
                        <ellipse cx={cx - 18} cy={cy + 48} rx="6" ry="10" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />

                        {/* Distal Osteophyte bone spurs if Osteoarthritis */}
                        {isOsteoarthritis && (
                          <g id="tibial-osteophytes">
                            <polygon
                              points={`${cx + 48},${cy + 25} ${cx + 64},${cy + 30} ${cx + 46},${cy + 38}`}
                              fill="#f59e0b"
                              stroke="#b45309"
                              strokeWidth="1.5"
                            />
                            <polygon
                              points={`${cx - 48},${cy + 25} ${cx - 64},${cy + 30} ${cx - 46},${cy + 38}`}
                              fill="#f59e0b"
                              stroke="#b45309"
                              strokeWidth="1.5"
                            />
                          </g>
                        )}
                      </g>

                      {/* 7. Ligaments (BONE TO BONE): Collateral & Capsular Ligaments */}
                      {showLigaments && (
                        <g
                          id="ligaments-group"
                          className="cursor-pointer hover:brightness-125 transition-all"
                          onClick={() => setSelectedStructureKey('ligament')}
                        >
                          {/* Lateral Collateral Ligament (LCL) - Connects Lateral Femur Epiphysis to Fibula/Tibia */}
                          <path
                            d={`M ${cx - 48} ${cy - 38}
                                C ${cx - 78} ${cy - 5},
                                  ${cx - 76} ${cy + 25},
                                  ${cx - 48 * Math.cos(rad) - 12 * Math.sin(rad)} ${cy + 48 * Math.sin(rad) + 26 * Math.cos(rad)}`}
                            stroke="url(#ligamentGrad)"
                            strokeWidth="9"
                            strokeLinecap="round"
                            fill="none"
                          />
                          {/* Ligament fibrous parallel striations */}
                          <path
                            d={`M ${cx - 48} ${cy - 38}
                                C ${cx - 78} ${cy - 5},
                                  ${cx - 76} ${cy + 25},
                                  ${cx - 48 * Math.cos(rad) - 12 * Math.sin(rad)} ${cy + 48 * Math.sin(rad) + 26 * Math.cos(rad)}`}
                            stroke="#78350f"
                            strokeWidth="1.2"
                            strokeDasharray="4 3"
                            fill="none"
                          />

                          {/* Medial Collateral Ligament (MCL) - Connects Medial Femur Epiphysis to Tibia */}
                          <path
                            d={`M ${cx + 48} ${cy - 38}
                                C ${cx + 78} ${cy - 5},
                                  ${cx + 76} ${cy + 25},
                                  ${cx + 48 * Math.cos(rad) + 12 * Math.sin(rad)} ${cy - 48 * Math.sin(rad) + 26 * Math.cos(rad)}`}
                            stroke="url(#ligamentGrad)"
                            strokeWidth="9"
                            strokeLinecap="round"
                            fill="none"
                          />
                          {/* Ligament fibrous parallel striations */}
                          <path
                            d={`M ${cx + 48} ${cy - 38}
                                C ${cx + 78} ${cy - 5},
                                  ${cx + 76} ${cy + 25},
                                  ${cx + 48 * Math.cos(rad) + 12 * Math.sin(rad)} ${cy - 48 * Math.sin(rad) + 26 * Math.cos(rad)}`}
                            stroke="#78350f"
                            strokeWidth="1.2"
                            strokeDasharray="4 3"
                            fill="none"
                          />

                          {/* Bone-to-Bone Attachment Anchors */}
                          <circle cx={cx - 48} cy={cy - 38} r="4" fill="#b45309" />
                          <circle cx={cx + 48} cy={cy - 38} r="4" fill="#b45309" />
                        </g>
                      )}
                    </g>
                  ) : (
                    /* ============================================================= */
                    /* BALL-AND-SOCKET JOINT RENDERING (HIP / SHOULDER)              */
                    /* ============================================================= */
                    <g id="ball-and-socket-joint-group">
                      {/* Socket Bone (Scapula / Pelvic Acetabulum) */}
                      <g
                        id="socket-pelvis"
                        className="cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => setSelectedStructureKey('bone')}
                      >
                        {/* Cup Socket Body */}
                        <path
                          d={`M ${cx - 120} ${cy - 100}
                              L ${cx - 30} ${cy - 100}
                              C ${cx + 40} ${cy - 70}, ${cx + 60} ${cy - 15}, ${cx + 50} ${cy + 45}
                              C ${cx + 38} ${cy + 85}, ${cx - 10} ${cy + 100}, ${cx - 65} ${cy + 90}
                              L ${cx - 120} ${cy + 80}
                              Z`}
                          fill="url(#boneGrad)"
                          stroke="#334155"
                          strokeWidth="3"
                        />

                        {/* Acetabular / Glenoid Articular Cartilage Cup Lining */}
                        <path
                          d={`M ${cx - 5} ${cy - 65}
                              A 68 68 0 0 1 ${cx + 42} ${cy + 45}`}
                          stroke={isOsteoarthritis ? 'url(#degradedCartilageGrad)' : 'url(#healthyCartilageGrad)'}
                          strokeWidth={isOsteoarthritis ? 4 : 9}
                          strokeLinecap="round"
                          fill="none"
                          strokeDasharray={isOsteoarthritis ? '5 3' : 'none'}
                          className="cursor-pointer hover:stroke-cyan-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStructureKey('cartilage');
                          }}
                        />

                        {/* Osteophytes on Socket Rim if Osteoarthritis */}
                        {isOsteoarthritis && (
                          <g>
                            <polygon points={`${cx - 8},${cy - 72} ${cx + 6},${cy - 82} ${cx + 2},${cy - 65}`} fill="#f59e0b" stroke="#b45309" />
                            <polygon points={`${cx + 44},${cy + 46} ${cx + 58},${cy + 54} ${cx + 38},${cy + 56}`} fill="#f59e0b" stroke="#b45309" />
                          </g>
                        )}
                      </g>

                      {/* Ball & Shaft (Head of Femur / Humerus) - Rotates around socket center */}
                      <g
                        id="ball-femur-rotating"
                        transform={`rotate(${-flexionAngle * 0.85}, ${cx - 5}, ${cy})`}
                        className="cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => setSelectedStructureKey('bone')}
                      >
                        {/* Hemispherical Head (Ball) */}
                        <circle cx={cx - 5} cy={cy} r="58" fill="url(#boneGrad)" stroke="#475569" strokeWidth="2.5" />

                        {/* Articular Cartilage Cap on Ball */}
                        <path
                          d={`M ${cx - 5 - 58 * Math.cos(Math.PI * 0.42)} ${cy - 58 * Math.sin(Math.PI * 0.42)}
                              A 58 58 0 0 1 ${cx - 5 + 58 * Math.cos(Math.PI * 0.38)} ${cy + 58 * Math.sin(Math.PI * 0.38)}`}
                          stroke={isOsteoarthritis ? 'url(#degradedCartilageGrad)' : 'url(#healthyCartilageGrad)'}
                          strokeWidth={isOsteoarthritis ? 3.5 : 8}
                          strokeLinecap="round"
                          fill="none"
                          strokeDasharray={isOsteoarthritis ? '4 2' : 'none'}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStructureKey('cartilage');
                          }}
                        />

                        {/* Anatomical Neck of Bone */}
                        <path
                          d={`M ${cx + 35} ${cy - 22}
                              L ${cx + 130} ${cy - 6}
                              L ${cx + 130} ${cy + 46}
                              L ${cx + 35} ${cy + 32}
                              Z`}
                          fill="url(#distalBoneGrad)"
                          stroke="#475569"
                          strokeWidth="2.5"
                        />

                        {/* Greater Trochanter & Limb Shaft */}
                        <path
                          d={`M ${cx + 130} ${cy - 28}
                              L ${cx + 168} ${cy - 18}
                              L ${cx + 155} ${cy + 170}
                              L ${cx + 115} ${cy + 170}
                              L ${cx + 125} ${cy + 46}
                              Z`}
                          fill="url(#distalBoneGrad)"
                          stroke="#334155"
                          strokeWidth="2.5"
                        />

                        {/* Tendon of Gluteal/Deltoid Muscles Inserting onto Trochanter */}
                        {/* Tendon of Gluteal/Deltoid Muscles Inserting onto Trochanter */}
                        {showMusclesAndTendons && (
                          <g>
                            <path
                              d={`M ${cx + 145} ${cy - 22} L ${cx + 200} ${cy - 60}`}
                              stroke="url(#tendonGrad)"
                              strokeWidth="7"
                              strokeLinecap="round"
                              className="cursor-pointer hover:stroke-cyan-300 transition-colors"
                              onClick={() => setSelectedStructureKey('tendon')}
                            />
                            <circle cx={cx + 145} cy={cy - 22} r="4" fill="#f8fafc" />
                          </g>
                        )}
                      </g>

                      {/* Synovial Fluid & Cavity Chamber in Ball & Socket */}
                      <g
                        id="ball-socket-synovial-fluid"
                        className="cursor-pointer"
                        onClick={() => setSelectedStructureKey('synovial_fluid')}
                      >
                        <path
                          d={`M ${cx - 5} ${cy - 65} A 64 64 0 0 1 ${cx + 42} ${cy + 45}`}
                          stroke="url(#fluidChamberGrad)"
                          strokeWidth={isOsteoarthritis ? 5 : 10}
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Synovial fluid lubricating droplets */}
                        <circle cx={cx + 12} cy={cy - 20} r={isOsteoarthritis ? 1.5 : 2.5} fill={isOsteoarthritis ? '#fbbf24' : '#bae6fd'} opacity={0.8} />
                        <circle cx={cx + 28} cy={cy + 10} r={isOsteoarthritis ? 1.5 : 2.5} fill={isOsteoarthritis ? '#fbbf24' : '#bae6fd'} opacity={0.8} />
                      </g>

                      {/* Synovial Membrane in Ball & Socket */}
                      <g
                        id="ball-socket-synovial-membrane"
                        className="cursor-pointer hover:stroke-pink-300 transition-colors"
                        onClick={() => setSelectedStructureKey('synovial_membrane')}
                      >
                        <path
                          d={`M ${cx - 8} ${cy - 68} C ${cx + 45} ${cy - 80}, ${cx + 85} ${cy - 38}, ${cx + 74} ${cy + 25} C ${cx + 65} ${cy + 68}, ${cx + 20} ${cy + 80}, ${cx - 2} ${cy + 74}`}
                          stroke={isOsteoarthritis ? '#f43f5e' : '#ec4899'}
                          strokeWidth="2.5"
                          strokeDasharray="4 3"
                          fill="none"
                        />
                      </g>

                      {/* Capsular Ligament Encapsulating the Spheroidal Joint */}
                      {showLigaments && (
                        <g
                          id="ball-socket-ligament"
                          className="cursor-pointer hover:brightness-125 transition-all"
                          onClick={() => setSelectedStructureKey('ligament')}
                        >
                          <path
                            d={`M ${cx - 15} ${cy - 72}
                                C ${cx + 50} ${cy - 85}, ${cx + 90} ${cy - 40}, ${cx + 80} ${cy + 30}
                                C ${cx + 70} ${cy + 75}, ${cx + 25} ${cy + 85}, ${cx - 5} ${cy + 78}`}
                            stroke="url(#ligamentGrad)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            fill="none"
                          />
                        </g>
                      )}
                    </g>
                  )}

                  {/* ============================================================= */}
                  {/* DYNAMIC BIOMECHANICAL FORCE VECTORS                           */}
                  {/* ============================================================= */}
                  {showForces && (
                    <g id="force-vectors" pointerEvents="none">
                      {/* Compressive Joint Contact Load Vector */}
                      <g id="load-vector">
                        {jointType === 'hinge' ? (
                          <>
                            <line x1={cx} y1={cy - 165} x2={cx} y2={cy - 75} stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow)" />
                            <polygon points={`${cx},${cy - 65} ${cx - 6},${cy - 78} ${cx + 6},${cy - 78}`} fill="#ef4444" />
                            <rect x={cx + 10} y={cy - 130} width="88" height="18" rx="5" fill="#0f172a" stroke="#ef4444" strokeWidth="1" />
                            <text x={cx + 14} y={cy - 117} fill="#fca5a5" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                              Load: {metrics.dynamicPressure} kPa
                            </text>
                          </>
                        ) : (
                          <>
                            <line x1={cx - 10} y1={cy - 155} x2={cx - 10} y2={cy - 75} stroke="#ef4444" strokeWidth="3" />
                            <polygon points={`${cx - 10},${cy - 65} ${cx - 16},${cy - 78} ${cx - 4},${cy - 78}`} fill="#ef4444" />
                            <rect x={cx - 120} y={cy - 130} width="88" height="18" rx="5" fill="#0f172a" stroke="#ef4444" strokeWidth="1" />
                            <text x={cx - 116} y={cy - 117} fill="#fca5a5" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                              Load: {metrics.dynamicPressure} kPa
                            </text>
                          </>
                        )}
                      </g>

                      {/* Frictional Resistance Force Vector along Articular Surface */}
                      <g id="friction-vector">
                        <line
                          x1={jointType === 'hinge' ? cx + 38 : cx + 24}
                          y1={jointType === 'hinge' ? cy : cy - 10}
                          x2={jointType === 'hinge' ? cx + 38 + (isOsteoarthritis ? 55 : 12) : cx + 24 + (isOsteoarthritis ? 50 : 12)}
                          y2={jointType === 'hinge' ? cy : cy - 10}
                          stroke={isOsteoarthritis ? '#f97316' : '#22c55e'}
                          strokeWidth="2.8"
                        />
                        <polygon
                          points={
                            jointType === 'hinge'
                              ? `${cx + 38 + (isOsteoarthritis ? 55 : 12) + 6},${cy}
                                 ${cx + 38 + (isOsteoarthritis ? 55 : 12) - 4},${cy - 4.5}
                                 ${cx + 38 + (isOsteoarthritis ? 55 : 12) - 4},${cy + 4.5}`
                              : `${cx + 24 + (isOsteoarthritis ? 50 : 12) + 6},${cy - 10}
                                 ${cx + 24 + (isOsteoarthritis ? 50 : 12) - 4},${cy - 14.5}
                                 ${cx + 24 + (isOsteoarthritis ? 50 : 12) - 4},${cy - 5.5}`
                          }
                          fill={isOsteoarthritis ? '#f97316' : '#22c55e'}
                        />
                        <rect
                          x={jointType === 'hinge' ? cx + 42 : cx + 28}
                          y={jointType === 'hinge' ? cy - 22 : cy - 32}
                          width="78"
                          height="18"
                          rx="5"
                          fill="#0f172a"
                          stroke={isOsteoarthritis ? '#f97316' : '#22c55e'}
                          strokeWidth="1"
                        />
                        <text
                          x={jointType === 'hinge' ? cx + 46 : cx + 32}
                          y={jointType === 'hinge' ? cy - 9 : cy - 19}
                          fill={isOsteoarthritis ? '#fdba74' : '#86efac'}
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          Friction: μ {metrics.mu}
                        </text>
                      </g>

                      {/* Muscle Tensile Pull Vector */}
                      {showMusclesAndTendons && (
                        <g id="muscle-pull-vector">
                          {jointType === 'hinge' ? (
                            <>
                              <line x1={tuberosityX} y1={tuberosityY} x2={tuberosityX - 25} y2={tuberosityY - 35} stroke="#38bdf8" strokeWidth="2.5" />
                              <polygon
                                points={`${tuberosityX - 28},${tuberosityY - 40} ${tuberosityX - 20},${tuberosityY - 30} ${tuberosityX - 30},${tuberosityY - 25}`}
                                fill="#38bdf8"
                              />
                              <text x={tuberosityX - 85} y={tuberosityY - 32} fill="#7dd3fc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                                Pull: {metrics.flexorTensionN} N
                              </text>
                            </>
                          ) : (
                            <>
                              <line x1={cx + 145} y1={cy - 22} x2={cx + 185} y2={cy - 50} stroke="#38bdf8" strokeWidth="2.5" />
                              <polygon
                                points={`${cx + 188},${cy - 52} ${cx + 178},${cy - 44} ${cx + 184},${cy - 38}`}
                                fill="#38bdf8"
                              />
                              <text x={cx + 190} y={cy - 55} fill="#7dd3fc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                                Pull: {metrics.flexorTensionN} N
                              </text>
                            </>
                          )}
                        </g>
                      )}
                    </g>
                  )}

                  {/* ============================================================= */}
                  {/* ANATOMICAL CALLOUT LABELS                                     */}
                  {/* ============================================================= */}
                  {showLabels && (() => {
                    const isHinge = jointType === 'hinge';

                    // Dynamic Targets according to joint geometry
                    const proxPos = isHinge
                      ? { x: cx, y: cy - 120, lx: cx - 180, ly: cy - 120, bx: cx - 280, by: cy - 132 }
                      : { x: cx - 70, y: cy - 20, lx: cx - 170, ly: cy - 20, bx: cx - 280, by: cy - 32 };

                    const cartPos = isHinge
                      ? { x: cx - 25, y: cy - 8, lx: cx - 210, ly: cy - 40, bx: cx - 330, by: cy - 53 }
                      : { x: cx + 18, y: cy - 18, lx: cx - 170, ly: cy + 40, bx: cx - 300, by: cy + 28 };

                    const fluidPos = isHinge
                      ? { x: cx + 15, y: cy + 4, lx: cx + 140, ly: cy - 40, bx: cx + 140, by: cy - 52 }
                      : { x: cx + 22, y: cy + 8, lx: cx + 140, ly: cy - 40, bx: cx + 140, by: cy - 52 };

                    const memPos = isHinge
                      ? { x: cx + 60, y: cy + 18, lx: cx + 140, ly: cy + 25, bx: cx + 140, by: cy + 12 }
                      : { x: cx + 74, y: cy + 15, lx: cx + 140, ly: cy + 20, bx: cx + 140, by: cy + 8 };

                    const ligPos = isHinge
                      ? { x: cx - 68, y: cy + 15, lx: cx - 210, ly: cy + 45, bx: cx - 335, by: cy + 32 }
                      : { x: cx + 78, y: cy + 25, lx: cx + 140, ly: cy + 70, bx: cx + 140, by: cy + 58 };

                    const tendonPos = isHinge
                      ? { x: tuberosityX, y: tuberosityY, lx: cx - 170, ly: cy + 125, bx: cx - 310, by: cy + 112 }
                      : { x: cx + 145, y: cy - 22, lx: cx + 210, ly: cy - 90, bx: cx + 210, by: cy - 102 };

                    const distalPos = isHinge
                      ? { x: distalX, y: distalY - 30, lx: cx + 140, ly: cy + 100, bx: cx + 140, by: cy + 88 }
                      : { x: cx + 138, y: cy + 110, lx: cx + 200, ly: cy + 120, bx: cx + 200, by: cy + 108 };

                    return (
                      <g id="anatomy-labels" className="select-none text-xs">
                        {/* Proximal Bone Label */}
                        <g className="cursor-pointer" onClick={() => setSelectedStructureKey('bone')}>
                          <line x1={proxPos.x} y1={proxPos.y} x2={proxPos.lx} y2={proxPos.ly} stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                          <rect x={proxPos.bx} y={proxPos.by} width="98" height="24" rx="7" fill="#0f172a" stroke="#64748b" />
                          <text x={proxPos.bx + 8} y={proxPos.by + 16} fill="#f1f5f9" fontSize="11" fontWeight="bold">
                            {isHinge ? 'Femur / Humerus' : 'Pelvis / Scapula'}
                          </text>
                          <circle cx={proxPos.x} cy={proxPos.y} r="3" fill="#64748b" />
                        </g>

                        {/* Articular Cartilage Label */}
                        <g className="cursor-pointer" onClick={() => setSelectedStructureKey('cartilage')}>
                          <line x1={cartPos.x} y1={cartPos.y} x2={cartPos.lx} y2={cartPos.ly} stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                          <rect
                            x={cartPos.bx}
                            y={cartPos.by}
                            width="122"
                            height="26"
                            rx="7"
                            fill="#0f172a"
                            stroke={isOsteoarthritis ? '#ef4444' : '#38bdf8'}
                            strokeWidth="1.2"
                          />
                          <text
                            x={cartPos.bx + 8}
                            y={cartPos.by + 17}
                            fill={isOsteoarthritis ? '#fca5a5' : '#7dd3fc'}
                            fontSize="11"
                            fontWeight="bold"
                          >
                            {isOsteoarthritis ? 'Cartilage (Eroded)' : 'Hyaline Cartilage'}
                          </text>
                          <circle cx={cartPos.x} cy={cartPos.y} r="3" fill={isOsteoarthritis ? '#ef4444' : '#38bdf8'} />
                        </g>

                        {/* Synovial Cavity & Fluid Label */}
                        <g className="cursor-pointer" onClick={() => setSelectedStructureKey('synovial_fluid')}>
                          <line x1={fluidPos.x} y1={fluidPos.y} x2={fluidPos.lx} y2={fluidPos.ly} stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                          <rect x={fluidPos.bx} y={fluidPos.by} width="128" height="25" rx="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
                          <text x={fluidPos.bx + 8} y={fluidPos.by + 17} fill="#7dd3fc" fontSize="11" fontWeight="bold">
                            Synovial Cavity & Fluid
                          </text>
                          <circle cx={fluidPos.x} cy={fluidPos.y} r="3" fill="#38bdf8" />
                        </g>

                        {/* Synovial Membrane Label */}
                        <g className="cursor-pointer" onClick={() => setSelectedStructureKey('synovial_membrane')}>
                          <line x1={memPos.x} y1={memPos.y} x2={memPos.lx} y2={memPos.ly} stroke="#ec4899" strokeWidth="1" strokeDasharray="2 2" />
                          <rect x={memPos.bx} y={memPos.by} width="128" height="25" rx="7" fill="#0f172a" stroke="#ec4899" strokeWidth="1.2" />
                          <text x={memPos.bx + 8} y={memPos.by + 17} fill="#f472b6" fontSize="11" fontWeight="bold">
                            Synovial Membrane
                          </text>
                          <circle cx={memPos.x} cy={memPos.y} r="3" fill="#ec4899" />
                        </g>

                        {/* Ligament (Bone to Bone) Label */}
                        {showLigaments && (
                          <g className="cursor-pointer" onClick={() => setSelectedStructureKey('ligament')}>
                            <line x1={ligPos.x} y1={ligPos.y} x2={ligPos.lx} y2={ligPos.ly} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                            <rect x={ligPos.bx} y={ligPos.by} width="125" height="26" rx="7" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
                            <text x={ligPos.bx + 8} y={ligPos.by + 17} fill="#fde68a" fontSize="11" fontWeight="bold">
                              Ligament (Bone-to-Bone)
                            </text>
                            <circle cx={ligPos.x} cy={ligPos.y} r="3" fill="#f59e0b" />
                          </g>
                        )}

                        {/* Tendon (Muscle to Bone) Label */}
                        {showMusclesAndTendons && (
                          <g className="cursor-pointer" onClick={() => setSelectedStructureKey('tendon')}>
                            <line x1={tendonPos.x} y1={tendonPos.y} x2={tendonPos.lx} y2={tendonPos.ly} stroke="#f8fafc" strokeWidth="1" strokeDasharray="2 2" />
                            <rect x={tendonPos.bx} y={tendonPos.by} width="138" height="26" rx="7" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.2" />
                            <text x={tendonPos.bx + 8} y={tendonPos.by + 17} fill="#ffffff" fontSize="11" fontWeight="bold">
                              Tendon (Muscle-to-Bone)
                            </text>
                            <circle cx={tendonPos.x} cy={tendonPos.y} r="3.5" fill="#ffffff" />
                          </g>
                        )}

                        {/* Distal Articulating Bone Label */}
                        <g className="cursor-pointer" onClick={() => setSelectedStructureKey('bone')}>
                          <line x1={distalPos.x} y1={distalPos.y} x2={distalPos.lx} y2={distalPos.ly} stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                          <rect x={distalPos.bx} y={distalPos.by} width="118" height="25" rx="7" fill="#0f172a" stroke="#64748b" />
                          <text x={distalPos.bx + 8} y={distalPos.by + 17} fill="#f1f5f9" fontSize="11" fontWeight="bold">
                            {isHinge ? 'Tibia / Ulna' : 'Femur / Humerus'}
                          </text>
                          <circle cx={distalPos.x} cy={distalPos.y} r="3" fill="#64748b" />
                        </g>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Bottom Real-Time Biomechanical Telemetry Strip */}
              <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Friction Coeff. (μ)
                  </span>
                  <span
                    className={`text-base sm:text-lg font-mono font-black ${
                      parseFloat(metrics.mu) > 0.1 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {metrics.mu}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {parseFloat(metrics.mu) > 0.1 ? 'Rough bone abrasion' : 'Smoother than wet ice'}
                  </span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Joint Pressure
                  </span>
                  <span className="text-base sm:text-lg font-mono font-black text-cyan-300">
                    {metrics.dynamicPressure} kPa
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {isOsteoarthritis ? 'Concentrated high stress' : 'Distributed hydrodynamic load'}
                  </span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Tendon Tensile Pull
                  </span>
                  <span className="text-base sm:text-lg font-mono font-black text-amber-300">
                    {metrics.flexorTensionN} N
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Muscle contraction force
                  </span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Shock Dampening
                  </span>
                  <span
                    className={`text-base sm:text-lg font-mono font-black ${
                      metrics.shockAbsorption < 50 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {metrics.shockAbsorption}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {isOsteoarthritis ? 'Cartilage cushioning lost' : 'Hydrated hyaline absorption'}
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================================= */}
            {/* THREE PRIMARY INTERACTIVE CONTROLS (1-3 REQUIREMENTS)         */}
            {/* ============================================================= */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" /> Biomechanical Control Station
                </h3>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-xl border border-cyan-800/50">
                  Angle: {Math.round(flexionAngle)}° · DOF: {metrics.dof}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Control 1: Joint Flexion Slider (0° - 140°) */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" /> 1. Joint Flexion
                    </span>
                    <span className="font-mono text-cyan-300 font-black">{Math.round(flexionAngle)}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="140"
                    step="1"
                    value={flexionAngle}
                    onChange={handleFlexionChange}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>0° Full Extension</span>
                    <span>140° Full Flexion</span>
                  </div>
                </div>

                {/* Control 2: Joint Type Switcher */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" /> 2. Joint Architecture
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleSelectJointType('hinge')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        jointType === 'hinge'
                          ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/50 border border-cyan-400'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Hinge Joint
                      <span className="block text-[9px] font-normal opacity-80">(Elbow / Knee)</span>
                    </button>
                    <button
                      onClick={() => handleSelectJointType('ball_socket')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        jointType === 'ball_socket'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50 border border-blue-400'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Ball-and-Socket
                      <span className="block text-[9px] font-normal opacity-80">(Shoulder / Hip)</span>
                    </button>
                  </div>
                </div>

                {/* Control 3: Joint Condition Toggle (Healthy vs Osteoarthritis) */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> 3. Pathological Condition
                  </div>
                  <button
                    onClick={handleToggleCondition}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                      isOsteoarthritis
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-md shadow-rose-950'
                        : 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isOsteoarthritis ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                      <span>{isOsteoarthritis ? 'Osteoarthritis (Wear & Spurs)' : 'Healthy Hyaline Cartilage'}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-black/40 rounded-lg">
                      Click to Toggle
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Interactive Structure Inspector Card */}
            {selectedStructureKey && ANATOMY_GUIDE[selectedStructureKey] && (
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-cyan-400" />
                    <h4 className="text-base font-bold text-white">
                      {ANATOMY_GUIDE[selectedStructureKey].name}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-cyan-300 border border-slate-700">
                      {ANATOMY_GUIDE[selectedStructureKey].badge}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {ANATOMY_GUIDE[selectedStructureKey].connection}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="font-bold text-slate-300 block mb-1">Histology & Matrix</span>
                    <p className="text-slate-400">{ANATOMY_GUIDE[selectedStructureKey].structure}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="font-bold text-slate-300 block mb-1">Biomechanical Function</span>
                    <p className="text-slate-400">{ANATOMY_GUIDE[selectedStructureKey].function}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="font-bold text-cyan-300 block mb-1">KCSE Syllabus Key Rule</span>
                    <p className="text-slate-300 text-[11px]">{ANATOMY_GUIDE[selectedStructureKey].kcseFact}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: ANATOMY & MISCONCEPTION MASTER                             */}
        {/* ================================================================= */}
        {activeTab === 'misconceptions' && (
          <div className="space-y-5">
            {/* Master Comparison Table Card */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">
                    Master Biological Distinction: Ligaments vs Tendons vs Cartilage
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-1 bg-amber-950/80 text-amber-300 border border-amber-800/60 rounded-xl font-bold">
                  KCSE Frequent Exam Trap
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                      <th className="p-3 rounded-tl-xl">Feature</th>
                      <th className="p-3 text-amber-300">Ligament</th>
                      <th className="p-3 text-slate-200">Tendon</th>
                      <th className="p-3 text-cyan-300 rounded-tr-xl">Articular (Hyaline) Cartilage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-bold text-slate-400">Anatomical Connection</td>
                      <td className="p-3 font-bold text-amber-400">BONE TO BONE</td>
                      <td className="p-3 font-bold text-white">MUSCLE TO BONE</td>
                      <td className="p-3 font-bold text-cyan-400">Covers ends (epiphyses) of articulating bones</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-bold text-slate-400">Tissue Composition</td>
                      <td className="p-3">Dense regular collagenous cords; tough and inelastic to prevent dislocation</td>
                      <td className="p-3">Inelastic white fibrous connective tissue with high tensile pulling strength</td>
                      <td className="p-3">Glassy hyaline matrix rich in chondrocytes & proteoglycans; completely avascular</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-bold text-slate-400">Mechanical Role</td>
                      <td className="p-3">Stabilizes joint, prevents unnatural torsion & dislocation</td>
                      <td className="p-3">Transmits contractile force of muscle to move bone lever</td>
                      <td className="p-3">Absorbs shock, minimizes friction (μ ≈ 0.003), protects subchondral bone</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-bold text-slate-400">Vascularity & Repair</td>
                      <td className="p-3">Limited vascularity; sprains heal slowly</td>
                      <td className="p-3">Moderate vascularity; ruptures heal with scar tissue</td>
                      <td className="p-3">Strictly avascular; relies entirely on synovial fluid; poor regeneration</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-bold text-slate-400">Pathology when Damaged</td>
                      <td className="p-3 text-rose-300">Sprain (tearing under abnormal strain)</td>
                      <td className="p-3 text-rose-300">Tendinitis / Rupture (overuse or sudden pull)</td>
                      <td className="p-3 text-rose-300">Osteoarthritis (cartilage wear, bone-on-bone spurs)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Joint Classifications: Hinge vs Ball-and-Socket */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Compass className="w-4 h-4" />
                  <span>Hinge Joint (Ginglymus)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>Anatomical Examples:</strong> Elbow joint (Humerus-Ulna) and Knee joint (Femur-Tibia).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>Degrees of Freedom:</strong> 1 Plane of motion (Monoaxial). Permits only <em>flexion</em> (bending) and <em>extension</em> (straightening).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>Stabilizers:</strong> Strong collateral ligaments on lateral and medial borders prevent lateral displacement.</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <Maximize2 className="w-4 h-4" />
                  <span>Ball-and-Socket Joint (Spheroidal)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span><strong>Anatomical Examples:</strong> Shoulder joint (Humerus-Scapula) and Hip joint (Femur-Pelvic Acetabulum).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span><strong>Degrees of Freedom:</strong> 3 Planes of motion (Multiaxial). Permits flexion/extension, abduction/adduction, internal/external rotation, and 360° circumduction.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span><strong>Structural Stability:</strong> Deep socket in hip gives high stability; shallow glenoid cavity in shoulder sacrifices stability for maximal mobility.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: KCSE EXAMINATION CHALLENGE                                 */}
        {/* ================================================================= */}
        {activeTab === 'quiz' && (
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Award className="w-4 h-4" />
                  <span>KCSE Form 4 Biology Verification Exam</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Test your mastery of synovial joint anatomy, biomechanics, and misconception traps.
                </p>
              </div>

              {/* Question Navigation Tabs */}
              <div className="flex items-center gap-1.5">
                {KCSE_JOINT_QUESTIONS.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuizIndex(idx);
                      setShowFeedback(!!userAnswers[q.id]);
                    }}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      currentQuizIndex === idx
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-300'
                        : userAnswers[q.id]
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Question Container */}
            {(() => {
              const q = KCSE_JOINT_QUESTIONS[currentQuizIndex];
              const selectedOptId = userAnswers[q.id];
              const correctOpt = q.options.find((o) => o.correct);
              const isAnswerCorrect = selectedOptId === correctOpt.id;

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400">
                      {q.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Question {currentQuizIndex + 1} of {KCSE_JOINT_QUESTIONS.length}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options List */}
                  <div className="space-y-2.5">
                    {q.options.map((opt) => {
                      const isChosen = selectedOptId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleQuizAnswer(q.id, opt.id)}
                          className={`w-full p-3.5 rounded-2xl text-left text-xs transition-all border cursor-pointer flex items-start gap-3 ${
                            isChosen
                              ? opt.correct
                                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-md'
                                : 'bg-rose-950/70 border-rose-500 text-rose-100 shadow-md'
                              : showFeedback && opt.correct
                              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                              : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                              isChosen
                                ? opt.correct
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-rose-500 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="leading-relaxed mt-0.5">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Explanation Card */}
                  {showFeedback && selectedOptId && (
                    <div
                      className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 animate-fadeIn ${
                        isAnswerCorrect
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                          : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {isAnswerCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Correct Biological Principle!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-400" />
                            <span>Incorrect. Review KCSE Marking Scheme:</span>
                          </>
                        )}
                      </div>
                      <p className="text-slate-300 text-xs">{q.explanation}</p>
                    </div>
                  )}

                  {/* Quiz Pagination / Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                      onClick={() => {
                        const nextIdx = Math.max(0, currentQuizIndex - 1);
                        setCurrentQuizIndex(nextIdx);
                        setShowFeedback(!!userAnswers[KCSE_JOINT_QUESTIONS[nextIdx].id]);
                      }}
                      disabled={currentQuizIndex === 0}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {quizScore !== null ? (
                      <span className="text-xs font-bold text-emerald-400">
                        Final Score: {quizScore} / {KCSE_JOINT_QUESTIONS.length} (
                        {Math.round((quizScore / KCSE_JOINT_QUESTIONS.length) * 100)}%)
                      </span>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
                      >
                        Submit All Answers
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const nextIdx = Math.min(KCSE_JOINT_QUESTIONS.length - 1, currentQuizIndex + 1);
                        setCurrentQuizIndex(nextIdx);
                        setShowFeedback(!!userAnswers[KCSE_JOINT_QUESTIONS[nextIdx].id]);
                      }}
                      disabled={currentQuizIndex === KCSE_JOINT_QUESTIONS.length - 1}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
