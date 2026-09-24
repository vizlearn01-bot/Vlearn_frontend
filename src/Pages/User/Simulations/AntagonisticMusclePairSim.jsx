import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  Sliders,
  Zap,
  Volume2,
  VolumeX,
  BookOpen,
  Activity,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  Info,
  ChevronRight,
  HelpCircle,
  Eye,
  EyeOff,
  ShieldAlert,
  Sparkles,
  Scale
} from 'lucide-react';

/**
 * Web Audio Synthesizer for biomechanical muscle tension & joint movement
 */
class ArmBiomechanicsAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  setMuted(muted) {
    this.muted = muted;
  }

  playMuscleTension(freq = 130) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(freq * 1.8, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.095);
    } catch {
      // Audio safety guard
    }
  }

  playJointSnap() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.045);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.055);
    } catch {
      // Audio safety guard
    }
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const now = this.ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.035, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.15);
      });
    } catch {
      // Audio safety guard
    }
  }
}

const audioSynth = new ArmBiomechanicsAudio();

/**
 * Form 4 Biology KCSE Antagonistic Muscles & Lever Mechanics Quiz
 */
const KCSE_ARM_QUIZ = [
  {
    id: 1,
    question: 'Why are skeletal muscles at synovial joints always arranged in antagonistic pairs?',
    options: [
      'Muscles can only actively contract and pull; they cannot actively push, requiring an opposing muscle to restore resting joint position',
      'Both muscles contract simultaneously to produce double the torque across the joint axis',
      'One muscle is purely sensory for proprioception, while the other generates all mechanical force',
      'Because synovial fluid can only flow in one direction inside the joint capsule'
    ],
    correct: 0,
    explanation:
      'Crucial scientific principle: Skeletal muscle fibers work by the sliding filament mechanism (myosin cross-bridges pulling actin filaments toward sarcomere M-lines). They have NO mechanism to push outward. Therefore, to extend a flexed joint, an opposing (antagonistic) extensor muscle must contract and pull from the other side.'
  },
  {
    id: 2,
    question: 'Identify the exact anatomical origin and insertion of the Biceps Brachii muscle in mammals:',
    options: [
      'Origin on the humerus shaft; insertion on the olecranon process of the ulna',
      'Origin on the scapula (coracoid process & supraglenoid tubercle); insertion on the radial tuberosity of the radius',
      'Origin on the clavicle; insertion on the carpals of the wrist',
      'Origin on the radius; insertion on the scapular spine'
    ],
    correct: 1,
    explanation:
      'The biceps brachii has its fixed origin anchored on the scapula (shoulder girdle) and inserts via a strong tendon onto the radial tuberosity of the radius. When it contracts, it pulls the radius upwards towards the shoulder, causing flexion.'
  },
  {
    id: 3,
    question: 'What is the specific mechanical role of the Olecranon Process of the ulna during forearm extension?',
    options: [
      'It acts as the lever arm projection behind the elbow hinge where the triceps tendon inserts to pull the arm straight',
      'It secretes synovial fluid into the articular capsule to reduce friction',
      'It acts as the origin for the biceps tendon',
      'It prevents the radius from rotating during pronation'
    ],
    correct: 0,
    explanation:
      'The olecranon process forms the bony beak of the ulna behind the elbow fulcrum. The triceps brachii inserts onto this process. When the triceps contracts, it pulls the olecranon process backwards and upwards, swinging the forearm downwards into full extension (180°).'
  },
  {
    id: 4,
    question: 'The human elbow joint functions as a Third-Class Lever during forearm flexion. What is the primary evolutionary advantage of this arrangement?',
    options: [
      'It provides large force multiplication so muscle effort is much smaller than the load',
      'It amplifies speed and range of motion at the hand, despite requiring much higher muscle effort force (F_effort > F_load)',
      'It eliminates the need for antagonistic muscle coordination',
      'It prevents cartilage wear by balancing effort and load at identical moment arm distances'
    ],
    correct: 1,
    explanation:
      'In a 3rd-class lever, the effort (biceps tendon ~4 cm) lies between the fulcrum (elbow) and the load (hand ~35 cm). Because the effort arm is short, the muscle must exert ~9x the load force. However, a small 1 cm shortening of the biceps produces a massive, rapid ~9 cm excursion of the hand, granting humans extraordinary speed, throwing capability, and tool dexterity!'
  },
  {
    id: 5,
    question: 'Using the principle of moments, calculate the biceps effort force needed to hold a 5 kg load (49 N) in the hand (load arm = 0.35 m), assuming forearm weight = 15 N at center of gravity (0.15 m), with effort arm = 0.04 m:',
    options: [
      '64 N',
      '228 N',
      '485 N',
      '19.4 N'
    ],
    correct: 2,
    explanation:
      'Taking moments about the elbow fulcrum: F_biceps × d_effort = (W_forearm × d_cg) + (W_load × d_load). F_biceps × 0.04 m = (15 N × 0.15 m) + (49 N × 0.35 m) = 2.25 N·m + 17.15 N·m = 19.40 N·m. Therefore, F_biceps = 19.40 / 0.04 = 485 N! The biceps must exert nearly 10 times the load weight.'
  }
];

/**
 * Anatomical Inspector Data
 */
const ANATOMICAL_PARTS = {
  biceps: {
    title: 'Biceps Brachii (Flexor Muscle)',
    role: 'Primary Agonist during Flexion · Antagonist during Extension',
    origin: 'Scapula (Supraglenoid tubercle & Coracoid process - fixed anchorage)',
    insertion: 'Radial tuberosity of the radius bone (movable bone)',
    action: 'Contracts -> shortens and bulges -> pulls radius upward -> flexes forearm at elbow synovial hinge.',
    notes: 'Innervated by musculocutaneous nerve. Operates as the effort force in a 3rd-class biomechanical lever.'
  },
  triceps: {
    title: 'Triceps Brachii (Extensor Muscle)',
    role: 'Primary Agonist during Extension · Antagonist during Flexion',
    origin: 'Scapula (Infraglenoid tubercle) & Posterior shaft of Humerus',
    insertion: 'Olecranon process of the ulna bone (behind elbow hinge pivot)',
    action: 'Contracts -> shortens and bulges -> pulls olecranon process -> extends forearm straight back to 180°.',
    notes: 'Three heads (long, lateral, medial). Stretches passively when forearm flexes; never actively pushes.'
  },
  scapula: {
    title: 'Scapula (Shoulder Blade)',
    role: 'Fixed Skeletal Anchorage (Origin Anchor)',
    origin: 'Part of pectoral girdle; articulates with humerus at glenohumeral joint.',
    insertion: 'N/A',
    action: 'Provides rigid, stable origin anchorage so muscle contraction pulls forearm bones instead of moving the shoulder.',
    notes: 'Coracoid process and glenoid cavity provide strong fibrous tendon anchors.'
  },
  humerus: {
    title: 'Humerus (Upper Arm Bone)',
    role: 'Long Bone Lever Shaft',
    origin: 'Upper limb skeleton; links shoulder girdle to elbow hinge.',
    insertion: 'N/A',
    action: 'Distal condyles (trochlea and capitulum) articulate with ulna and radius to form synovial hinge joint.',
    notes: 'Posterior surface anchors medial and lateral heads of the triceps brachii.'
  },
  radius_ulna: {
    title: 'Radius & Ulna (Forearm Bones)',
    role: 'Movable Bone Levers of the Forearm',
    origin: 'Articulate with humerus at elbow; carpals at wrist.',
    insertion: 'Radius has Radial Tuberosity (Biceps); Ulna has Olecranon Process (Triceps).',
    action: 'Ulna hinges tightly in trochlear notch for stable planar flexion/extension. Radius rotates for pronation/supination.',
    notes: 'Radius lies lateral (thumb side); ulna lies medial with olecranon posterior beak.'
  },
  joint: {
    title: 'Elbow Synovial Hinge Joint (Fulcrum)',
    role: 'Planar Synovial Pivot Axis',
    origin: 'Interlocking trochlea of humerus with trochlear notch of ulna.',
    insertion: 'N/A',
    action: 'Restricts motion strictly to single sagittal plane (flexion & extension). Contains synovial fluid and articular cartilage.',
    notes: 'Functions as the fulcrum (pivot axis) in forearm biomechanical lever mechanics.'
  }
};

export default function AntagonisticMusclePairSim({ config = {}, onTelemetry }) {
  // Forearm Angle: 30° (Maximum Flexion) to 180° (Full Extension)
  // Default resting position: 90°
  const [angle, setAngle] = useState(90);

  // Hand Load Preset: 0 kg (No Load), 2 kg (Light), 5 kg (Heavy)
  const [loadKg, setLoadKg] = useState(2);

  // Animation State
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetAction, setTargetAction] = useState(null); // 'flex' | 'extend'

  // View Toggles
  const [showVectors, setShowVectors] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [soundMuted, setSoundMuted] = useState(false);
  const [activeInspect, setActiveInspect] = useState(null);
  const [severTriceps, setSeverTriceps] = useState(false); // Lab experiment mode

  // Tab State
  const [activeTab, setActiveTab] = useState('arm_sim'); // 'arm_sim' | 'lever_physics' | 'pull_only_lab' | 'kcse_quiz'
  const [quizIndex, setQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Sync sound mute
  useEffect(() => {
    audioSynth.setMuted(soundMuted);
  }, [soundMuted]);

  // Smooth Animation Loop for 1-Click Flexion and Extension
  useEffect(() => {
    if (!isAnimating || !targetAction) return;

    const interval = setInterval(() => {
      setAngle((prev) => {
        if (targetAction === 'flex') {
          if (prev <= 35) {
            setIsAnimating(false);
            setTargetAction(null);
            audioSynth.playJointSnap();
            onTelemetry?.('SIMULATION_CHECKPOINT_VERIFIED', {
              simulation: 'human_arm_antagonistic_muscles_3d',
              checkpoint: 'forearm_flexion_complete',
              angle: 35,
              bicepsState: 'CONTRACTED_BULGING',
              tricepsState: 'RELAXED_STRETCHED'
            });
            return 35;
          }
          return Math.max(35, prev - 3.5);
        } else if (targetAction === 'extend') {
          if (severTriceps) {
            // Lab mode: without triceps, arm cannot actively extend!
            setIsAnimating(false);
            setTargetAction(null);
            return prev;
          }
          if (prev >= 175) {
            setIsAnimating(false);
            setTargetAction(null);
            audioSynth.playJointSnap();
            onTelemetry?.('SIMULATION_CHECKPOINT_VERIFIED', {
              simulation: 'human_arm_antagonistic_muscles_3d',
              checkpoint: 'forearm_extension_complete',
              angle: 175,
              bicepsState: 'RELAXED_STRETCHED',
              tricepsState: 'CONTRACTED_BULGING'
            });
            return 175;
          }
          return Math.min(175, prev + 3.5);
        }
        return prev;
      });
    }, 24);

    return () => clearInterval(interval);
  }, [isAnimating, targetAction, severTriceps, onTelemetry]);

  // Handlers for Meaningful Controls
  const handleTriggerFlex = () => {
    audioSynth.playMuscleTension(120);
    setTargetAction('flex');
    setIsAnimating(true);
  };

  const handleTriggerExtend = () => {
    if (severTriceps) {
      audioSynth.playJointSnap();
      return;
    }
    audioSynth.playMuscleTension(95);
    setTargetAction('extend');
    setIsAnimating(true);
  };

  const handleResetResting = () => {
    audioSynth.playJointSnap();
    setIsAnimating(false);
    setTargetAction(null);
    setAngle(90);
    setLoadKg(2);
    setSeverTriceps(false);
    onTelemetry?.('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'human_arm_antagonistic_muscles_3d',
      checkpoint: 'arm_reset_resting_position',
      angle: 90
    });
  };

  const handleLoadChange = (val) => {
    audioSynth.playJointSnap();
    setLoadKg(val);
    onTelemetry?.('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'human_arm_antagonistic_muscles_3d',
      checkpoint: 'load_moment_calculated',
      loadKg: val
    });
  };

  // Biomechanical & Lever Math Parameters
  const d_effort = 0.04; // 4.0 cm (0.04 m) from elbow to radial tuberosity
  const d_load = 0.35; // 35.0 cm (0.35 m) from elbow to center of palm
  const d_cg = 0.15; // 15.0 cm (0.15 m) from elbow to forearm center of gravity
  const w_arm = 15.0; // Forearm mass ~1.5 kg -> 15.0 N
  const w_load = loadKg * 9.8; // Load weight in Newtons

  // Moment calculations (in horizontal/reference equilibrium):
  // F_biceps * d_effort = (W_forearm * d_cg) + (W_load * d_load)
  const armMoment = w_arm * d_cg; // 2.25 N·m
  const loadMoment = w_load * d_load; // loadKg * 9.8 * 0.35
  const totalLoadMoment = armMoment + loadMoment;
  const bicepsEffortForce = Math.round(totalLoadMoment / d_effort);
  const velocityRatio = Math.round(d_load / d_effort * 10) / 10; // 8.8
  const mechanicalAdvantage = Math.round(((w_load + w_arm) / (bicepsEffortForce || 1)) * 100) / 100;

  // Fraction Flexed: 0 at 180° (full extension), 1.0 at 30° (max flexion)
  const flexRatio = (180 - angle) / 150; // 0 to 1.0

  // CRITICAL SCIENTIFIC PRINCIPLE:
  // Muscles can ONLY pull (contract), never push.
  // NEVER show both muscles contracting simultaneously in normal movement!
  // Flexion (angle <= 95°): Biceps CONTRACTED & BULGING; Triceps RELAXED & STRETCHED.
  // Extension (angle > 95°): Triceps CONTRACTED & BULGING; Biceps RELAXED & STRETCHED.
  const isFlexionPhase = angle <= 95;

  // Biceps State:
  const bicepsContractFactor = isFlexionPhase ? Math.min(1, Math.max(0, (95 - angle) / 65 + 0.25)) : 0;
  const bicepsThickness = 14 + bicepsContractFactor * 26; // 14px (thin relaxed) to 40px (bulging contracted)
  const bicepsLengthPercent = Math.round(100 - flexRatio * 32); // shortens to ~68%

  // Triceps State:
  const tricepsContractFactor = (!isFlexionPhase && !severTriceps) ? Math.min(1, Math.max(0, (angle - 95) / 85 + 0.2)) : 0;
  const tricepsThickness = 14 + tricepsContractFactor * 24; // 14px (thin relaxed) to 38px (bulging contracted)
  const tricepsLengthPercent = Math.round(72 + flexRatio * 38); // stretched to ~110% when flexed

  // -------------------------------------------------------------
  // SVG Geometry & Coordinate Mapping
  // Coordinate Frame: ViewBox 0 0 620 480
  // Shoulder (Glenoid Cavity): (200, 85)
  // Elbow Joint (Fulcrum): (200, 270)
  // Upper Arm (Humerus): Vertical length = 185 px
  // Forearm: Length = 175 px, rotating around (200, 270)
  // Right (+X) is Anterior (front); Left (-X) is Posterior (back)
  // -------------------------------------------------------------
  const elbowX = 200;
  const elbowY = 270;
  const shoulderX = 200;
  const shoulderY = 85;
  const forearmLength = 175;

  // Forearm Unit Vector: angle in degrees from humerus vertical downward (180° = straight down)
  const angleRad = (angle * Math.PI) / 180;
  const dirX = Math.sin(angleRad);
  const dirY = -Math.cos(angleRad);

  // Perpendicular normal vector (pointing anteriorly/rightward):
  const normX = Math.cos(angleRad);
  const normY = Math.sin(angleRad);

  // Hand Position
  const handX = elbowX + forearmLength * dirX;
  const handY = elbowY + forearmLength * dirY;

  // Center of Gravity (15 cm ~ 43% along forearm)
  const cgX = elbowX + forearmLength * 0.43 * dirX;
  const cgY = elbowY + forearmLength * 0.43 * dirY;

  // Radial Tuberosity (Biceps Insertion on radius ~4 cm from elbow):
  const bicepInsertDist = 42;
  const bicepInsertX = elbowX + bicepInsertDist * dirX + 6 * normX;
  const bicepInsertY = elbowY + bicepInsertDist * dirY + 6 * normY;

  // Olecranon Process of Ulna (Triceps Insertion behind elbow hinge):
  const olecranonDist = 26;
  const olecranonX = elbowX - olecranonDist * dirX - 8 * normX;
  const olecranonY = elbowY - olecranonDist * dirY - 8 * normY;

  // Biceps Origin (Scapula Supraglenoid Tubercle & Coracoid):
  const bicepOriginX = shoulderX + 18;
  const bicepOriginY = shoulderY - 10;

  // Triceps Origin (Scapula Infraglenoid Tubercle + Posterior Humerus Shaft):
  const tricepOriginX = shoulderX - 22;
  const tricepOriginY = shoulderY + 22;

  // Biceps Muscle Belly Midpoint & Bulge:
  const bicepMidX = (bicepOriginX + bicepInsertX) / 2 + (bicepsThickness * 0.7);
  const bicepMidY = (bicepOriginY + bicepInsertY) / 2 - 2;

  // Triceps Muscle Belly Midpoint & Bulge:
  const tricepMidX = (tricepOriginX + olecranonX) / 2 - (tricepsThickness * 0.65);
  const tricepMidY = (tricepOriginY + olecranonY) / 2;

  // Quiz Handling
  const handleSelectQuiz = (optIdx) => {
    if (quizSubmitted) return;
    audioSynth.playJointSnap();
    setUserAnswers((prev) => ({ ...prev, [quizIndex]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    KCSE_ARM_QUIZ.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    audioSynth.playSuccess();
    onTelemetry?.('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'human_arm_antagonistic_muscles_3d',
      checkpoint: 'kcse_quiz_completed',
      score,
      total: KCSE_ARM_QUIZ.length,
      percentage: Math.round((score / KCSE_ARM_QUIZ.length) * 100)
    });
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizIndex(0);
    setQuizScore(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-950 text-slate-100 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-slate-800 font-sans select-none">
      {/* Simulation Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-1">
            <span className="p-1 rounded bg-rose-950/80 border border-rose-800/60">
              <Activity className="w-4 h-4 text-rose-400" />
            </span>
            <span>KCSE Form 4 Biology · Topic 4: Support & Movement</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            Antagonistic Muscle Pair & Forearm Biomechanics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Explore how muscles can <strong className="text-rose-400">only pull</strong> (never push), requiring antagonistic
            pairs (Biceps flexor &amp; Triceps extensor) across a synovial hinge joint functioning as a Class 3 lever.
          </p>
        </div>

        {/* Global Controls: Sound & Tab Nav */}
        <div className="flex items-center gap-2 self-start lg:self-center flex-wrap">
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              soundMuted
                ? 'bg-slate-900 border-slate-800 text-slate-500'
                : 'bg-rose-950/70 border-rose-700 text-rose-300 shadow-sm'
            }`}
            title={soundMuted ? 'Unmute Synthesizer' : 'Mute Synthesizer'}
            aria-label="Toggle Sound"
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('arm_sim')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'arm_sim'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Biomechanical Arm</span>
            </button>
            <button
              onClick={() => setActiveTab('lever_physics')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'lever_physics'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>3rd-Class Lever</span>
            </button>
            <button
              onClick={() => setActiveTab('pull_only_lab')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pull_only_lab'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>"Pull-Only" Lab</span>
            </button>
            <button
              onClick={() => setActiveTab('kcse_quiz')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'kcse_quiz'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>KCSE Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: MAIN BIOMECHANICAL ARM SIMULATION */}
      {activeTab === 'arm_sim' && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Visual Arm Stage (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {/* 1-Click Meaningful Execution Bar */}
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                Action Controls:
              </span>
              <button
                onClick={handleTriggerFlex}
                disabled={isAnimating && targetAction === 'flex'}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 active:scale-95 text-white shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Flex Forearm (Biceps Contracts)</span>
              </button>
              <button
                onClick={handleTriggerExtend}
                disabled={(isAnimating && targetAction === 'extend') || severTriceps}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-500 active:scale-95 text-white shadow-md shadow-sky-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Extend Forearm (Triceps Contracts)</span>
              </button>
              <button
                onClick={handleResetResting}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                title="Reset arm to 90° neutral resting position"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset 90°</span>
              </button>
            </div>

            {/* SVG Anatomical Canvas */}
            <div className="relative w-full h-[430px] sm:h-[490px] bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-3xl border border-slate-800/90 overflow-hidden flex items-center justify-center shadow-inner">
              {/* Subtle Grid Backdrop */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* Status Header Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-1 z-10 pointer-events-none">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 border border-slate-700 text-rose-300 shadow-sm flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isFlexionPhase ? 'bg-rose-500 animate-pulse' : 'bg-sky-500'}`} />
                  Joint Angle: {Math.round(angle)}° ({isFlexionPhase ? 'FLEXION PHASE' : 'EXTENSION PHASE'})
                </span>
                <span className="text-[11px] text-slate-400 font-mono bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                  Effort Moment: {(bicepsEffortForce * d_effort).toFixed(2)} N·m | Total Load Moment: {totalLoadMoment.toFixed(2)} N·m
                </span>
              </div>

              {/* Overlay Control Toggles */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                <button
                  onClick={() => setShowVectors(!showVectors)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    showVectors
                      ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                      : 'bg-slate-900/80 border-slate-800 text-slate-500'
                  }`}
                  title="Toggle Tension & Weight Force Vectors"
                >
                  {showVectors ? 'Vectors On' : 'Vectors Off'}
                </button>
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    showLabels
                      ? 'bg-sky-950/80 border-sky-600 text-sky-300'
                      : 'bg-slate-900/80 border-slate-800 text-slate-500'
                  }`}
                  title="Toggle Anatomical Labels"
                >
                  {showLabels ? 'Labels On' : 'Labels Off'}
                </button>
              </div>

              {/* Organic Biomechanical SVG Arm */}
              <svg viewBox="0 0 620 480" className="w-full h-full drop-shadow-2xl overflow-visible">
                <defs>
                  {/* Bone Gradients */}
                  <linearGradient id="boneHumerusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="35%" stopColor="#f8fafc" />
                    <stop offset="70%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>

                  <linearGradient id="boneRadiusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="50%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>

                  {/* Muscle Active Contraction Gradient (Crimson Rich Red) */}
                  <radialGradient id="muscleContractingGrad" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="45%" stopColor="#e11d48" />
                    <stop offset="85%" stopColor="#9f1239" />
                    <stop offset="100%" stopColor="#4c0519" />
                  </radialGradient>

                  {/* Muscle Relaxed/Stretched Gradient (Soft Muted Slate/Pink) */}
                  <radialGradient id="muscleRelaxedGrad" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#fbcfe8" />
                    <stop offset="45%" stopColor="#e2e8f0" />
                    <stop offset="80%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                  </radialGradient>

                  {/* White Collagen Fibrous Tendon Gradient */}
                  <linearGradient id="tendonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>

                  {/* Joint Glow Filter */}
                  <filter id="jointCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#38bdf8" floodOpacity="0.7" />
                  </filter>

                  {/* Contraction Tension Pulse Glow */}
                  <filter id="tensionPulseGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f43f5e" floodOpacity="0.6" />
                  </filter>
                </defs>

                {/* Range Angle Arc Protractor */}
                <g opacity="0.35">
                  <circle cx={elbowX} cy={elbowY} r="75" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1={elbowX} y1={elbowY} x2={elbowX} y2={elbowY + 85} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
                  <line x1={elbowX} y1={elbowY} x2={elbowX + 85 * dirX} y2={elbowY + 85 * dirY} stroke="#f43f5e" strokeWidth="1.5" />
                  <text x={elbowX + 42 * dirX + 10} y={elbowY + 42 * dirY} fill="#f43f5e" fontSize="10" fontWeight="bold">
                    {Math.round(angle)}°
                  </text>
                </g>

                {/* 1. SCAPULA (Fixed Anchor Origin) */}
                <g
                  onClick={() => setActiveInspect('scapula')}
                  className="cursor-pointer transition-opacity"
                  opacity={activeInspect && activeInspect !== 'scapula' ? 0.35 : 1}
                >
                  <path
                    d="M 120,40 C 160,35 220,50 235,75 C 220,105 180,115 150,105 C 130,95 110,70 120,40 Z"
                    fill="url(#boneHumerusGrad)"
                    stroke="#475569"
                    strokeWidth="2.5"
                  />
                  {/* Coracoid process & Supraglenoid tubercle (Biceps Origin) */}
                  <circle cx={bicepOriginX} cy={bicepOriginY} r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                  {/* Glenoid Cavity Socket */}
                  <ellipse cx={shoulderX} cy={shoulderY} rx="16" ry="12" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1.5" />
                </g>

                {/* 2. TRICEPS BRACHII (Posterior Extensor Muscle) */}
                <g
                  onClick={() => setActiveInspect('triceps')}
                  className="cursor-pointer transition-opacity"
                  opacity={activeInspect && activeInspect !== 'triceps' ? 0.35 : 1}
                >
                  {!severTriceps ? (
                    <>
                      {/* Triceps Origin Tendon */}
                      <path
                        d={`M ${tricepOriginX},${tricepOriginY} Q ${tricepMidX - 12},${tricepMidY - 35} ${tricepMidX},${tricepMidY - 15}`}
                        fill="none"
                        stroke="url(#tendonGrad)"
                        strokeWidth="7"
                        strokeLinecap="round"
                      />
                      {/* Triceps Muscle Belly */}
                      <path
                        d={`M ${tricepOriginX + 2},${tricepOriginY + 12} Q ${tricepMidX - tricepsThickness},${tricepMidY} ${olecranonX - 2},${olecranonY - 14} Q ${tricepMidX + 8},${tricepMidY} ${tricepOriginX + 2},${tricepOriginY + 12} Z`}
                        fill={tricepsContractFactor > 0.3 ? 'url(#muscleContractingGrad)' : 'url(#muscleRelaxedGrad)'}
                        stroke={tricepsContractFactor > 0.3 ? '#e11d48' : '#64748b'}
                        strokeWidth="2"
                        filter={tricepsContractFactor > 0.3 ? 'url(#tensionPulseGlow)' : undefined}
                      />
                      {/* Triceps Striation Lines (Contracting Fibers) */}
                      {tricepsContractFactor > 0.2 && (
                        <g stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.65">
                          <line x1={tricepMidX - 6} y1={tricepMidY - 16} x2={tricepMidX - 12} y2={tricepMidY + 16} />
                          <line x1={tricepMidX + 2} y1={tricepMidY - 20} x2={tricepMidX - 4} y2={tricepMidY + 20} />
                        </g>
                      )}
                      {/* Triceps Insertion Tendon wrapping onto Olecranon Process */}
                      <path
                        d={`M ${tricepMidX},${tricepMidY + 15} L ${olecranonX},${olecranonY}`}
                        fill="none"
                        stroke="url(#tendonGrad)"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    </>
                  ) : (
                    /* Severed Triceps in Lab Mode */
                    <g opacity="0.6">
                      <line x1={tricepOriginX} y1={tricepOriginY} x2={tricepOriginX - 15} y2={tricepOriginY + 40} stroke="#ef4444" strokeWidth="4" strokeDasharray="4 4" />
                      <line x1={olecranonX} y1={olecranonY} x2={olecranonX - 10} y2={olecranonY - 40} stroke="#ef4444" strokeWidth="4" strokeDasharray="4 4" />
                      <text x={tricepMidX - 35} y={tricepMidY} fill="#ef4444" fontSize="12" fontWeight="bold">
                        SEVERED / INACTIVE
                      </text>
                    </g>
                  )}
                </g>

                {/* 3. HUMERUS (Upper Arm Bone) */}
                <g
                  onClick={() => setActiveInspect('humerus')}
                  className="cursor-pointer transition-opacity"
                  opacity={activeInspect && activeInspect !== 'humerus' ? 0.35 : 1}
                >
                  {/* Proximal Head (Ball) */}
                  <ellipse cx={shoulderX} cy={shoulderY + 5} rx="18" ry="15" fill="url(#boneHumerusGrad)" stroke="#64748b" strokeWidth="2" />
                  {/* Humerus Cylindrical Shaft */}
                  <rect
                    x={shoulderX - 11}
                    y={shoulderY + 14}
                    width="22"
                    height="160"
                    rx="9"
                    fill="url(#boneHumerusGrad)"
                    stroke="#64748b"
                    strokeWidth="2.5"
                  />
                  {/* Distal Condyles (Trochlea & Capitulum) */}
                  <ellipse cx={elbowX} cy={elbowY - 4} rx="20" ry="15" fill="url(#boneHumerusGrad)" stroke="#475569" strokeWidth="2.5" />
                </g>

                {/* 4. BICEPS BRACHII (Anterior Flexor Muscle) */}
                <g
                  onClick={() => setActiveInspect('biceps')}
                  className="cursor-pointer transition-opacity"
                  opacity={activeInspect && activeInspect !== 'biceps' ? 0.35 : 1}
                >
                  {/* Biceps Origin Tendons */}
                  <path
                    d={`M ${bicepOriginX},${bicepOriginY} Q ${bicepMidX + 10},${bicepMidY - 35} ${bicepMidX},${bicepMidY - 20}`}
                    fill="none"
                    stroke="url(#tendonGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Dynamic Bulging Biceps Muscle Belly */}
                  <path
                    d={`M ${bicepOriginX - 2},${bicepOriginY + 12} Q ${bicepMidX + bicepsThickness},${bicepMidY} ${bicepInsertX + 2},${bicepInsertY - 14} Q ${bicepMidX - 8},${bicepMidY} ${bicepOriginX - 2},${bicepOriginY + 12} Z`}
                    fill={isFlexionPhase ? 'url(#muscleContractingGrad)' : 'url(#muscleRelaxedGrad)'}
                    stroke={isFlexionPhase ? '#e11d48' : '#64748b'}
                    strokeWidth="2"
                    filter={isFlexionPhase ? 'url(#tensionPulseGlow)' : undefined}
                  />
                  {/* Contracting Fiber Striations */}
                  {isFlexionPhase && (
                    <g stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.65">
                      <line x1={bicepMidX + 8} y1={bicepMidY - 18} x2={bicepMidX + 14} y2={bicepMidY + 18} />
                      <line x1={bicepMidX} y1={bicepMidY - 22} x2={bicepMidX + 6} y2={bicepMidY + 22} />
                    </g>
                  )}
                  {/* Biceps Insertion Tendon inserting onto Radial Tuberosity */}
                  <path
                    d={`M ${bicepMidX},${bicepMidY + 20} L ${bicepInsertX},${bicepInsertY}`}
                    fill="none"
                    stroke="url(#tendonGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </g>

                {/* 5. ELBOW SYNOVIAL HINGE JOINT (Fulcrum Axis) */}
                <g
                  onClick={() => setActiveInspect('joint')}
                  className="cursor-pointer"
                  filter="url(#jointCyanGlow)"
                >
                  <circle cx={elbowX} cy={elbowY} r="15" fill="#0284c7" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="2.5" />
                  {/* Synovial Cartilage Cap */}
                  <path
                    d={`M ${elbowX - 13},${elbowY} A 13 13 0 0 0 ${elbowX + 13},${elbowY}`}
                    fill="none"
                    stroke="#bae6fd"
                    strokeWidth="3.5"
                  />
                  {/* Fulcrum Triangle Marker (Physics Lever Symbol) */}
                  <polygon
                    points={`${elbowX},${elbowY - 7} ${elbowX - 6},${elbowY + 6} ${elbowX + 6},${elbowY + 6}`}
                    fill="#38bdf8"
                  />
                </g>

                {/* 6. RADIUS & ULNA (Pivoting Forearm Bones) */}
                <g
                  onClick={() => setActiveInspect('radius_ulna')}
                  className="cursor-pointer transition-opacity"
                  opacity={activeInspect && activeInspect !== 'radius_ulna' ? 0.35 : 1}
                >
                  {/* Olecranon Process of Ulna (Hooks behind elbow joint) */}
                  <path
                    d={`M ${elbowX},${elbowY} L ${olecranonX},${olecranonY} L ${olecranonX + 14 * normX},${olecranonY + 14 * normY} Z`}
                    fill="url(#boneRadiusGrad)"
                    stroke="#64748b"
                    strokeWidth="2"
                  />

                  {/* Ulna Shaft (Medial/Posterior Forearm Bone) */}
                  <line
                    x1={olecranonX}
                    y1={olecranonY}
                    x2={handX - 8 * normX}
                    y2={handY - 8 * normY}
                    stroke="url(#boneRadiusGrad)"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />

                  {/* Radius Shaft (Lateral/Anterior Forearm Bone) */}
                  <line
                    x1={elbowX + 12 * normX}
                    y1={elbowY + 12 * normY}
                    x2={handX + 8 * normX}
                    y2={handY + 8 * normY}
                    stroke="url(#boneRadiusGrad)"
                    strokeWidth="11"
                    strokeLinecap="round"
                  />

                  {/* Radial Tuberosity (Biceps Insertion Bump) */}
                  <circle cx={bicepInsertX} cy={bicepInsertY} r="5.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />

                  {/* Forearm Center of Gravity Marker */}
                  <circle cx={cgX} cy={cgY} r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

                  {/* Hand & Palm Grip */}
                  <circle cx={handX} cy={handY} r="15" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />

                  {/* Held Dumbbell / Load */}
                  {loadKg > 0 ? (
                    <g>
                      {/* Dumbbell Bar Handle */}
                      <rect
                        x={handX - 16}
                        y={handY - 4}
                        width="32"
                        height="8"
                        rx="2"
                        fill="#64748b"
                        stroke="#334155"
                        strokeWidth="1"
                      />
                      {/* Left and Right Weight Plates */}
                      <rect
                        x={handX - 22}
                        y={handY - (loadKg === 5 ? 18 : 12)}
                        width="8"
                        height={loadKg === 5 ? 36 : 24}
                        rx="3"
                        fill="#f59e0b"
                        stroke="#b45309"
                        strokeWidth="1.5"
                      />
                      <rect
                        x={handX + 14}
                        y={handY - (loadKg === 5 ? 18 : 12)}
                        width="8"
                        height={loadKg === 5 ? 36 : 24}
                        rx="3"
                        fill="#f59e0b"
                        stroke="#b45309"
                        strokeWidth="1.5"
                      />
                      <text
                        x={handX}
                        y={handY + 28}
                        textAnchor="middle"
                        fill="#fbbf24"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {loadKg} kg ({Math.round(w_load)} N)
                      </text>
                    </g>
                  ) : (
                    <text
                      x={handX}
                      y={handY + 26}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="10"
                      fontStyle="italic"
                    >
                      No Load (0 kg)
                    </text>
                  )}
                </g>

                {/* 7. FORCE VECTORS & MOMENT CALIPERS OVERLAY */}
                {showVectors && (
                  <g>
                    {/* Biceps Effort Pull Vector (Arrow pointing along tendon toward scapula) */}
                    <line
                      x1={bicepInsertX}
                      y1={bicepInsertY}
                      x2={bicepInsertX + (bicepOriginX - bicepInsertX) * 0.45}
                      y2={bicepInsertY + (bicepOriginY - bicepInsertY) * 0.45}
                      stroke="#f43f5e"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <polygon
                      points={`
                        ${bicepInsertX + (bicepOriginX - bicepInsertX) * 0.45},${bicepInsertY + (bicepOriginY - bicepInsertY) * 0.45}
                        ${bicepInsertX + (bicepOriginX - bicepInsertX) * 0.4 - 5},${bicepInsertY + (bicepOriginY - bicepInsertY) * 0.4 + 4}
                        ${bicepInsertX + (bicepOriginX - bicepInsertX) * 0.4 + 5},${bicepInsertY + (bicepOriginY - bicepInsertY) * 0.4 - 4}
                      `}
                      fill="#f43f5e"
                    />
                    <text
                      x={bicepInsertX + 15}
                      y={bicepInsertY - 12}
                      fill="#f43f5e"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      F_effort = {bicepsEffortForce} N
                    </text>

                    {/* Forearm Mass Vector at Center of Gravity */}
                    <line
                      x1={cgX}
                      y1={cgY}
                      x2={cgX}
                      y2={cgY + 36}
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                    <polygon points={`${cgX},${cgY + 40} ${cgX - 4},${cgY + 32} ${cgX + 4},${cgY + 32}`} fill="#fbbf24" />
                    <text x={cgX + 6} y={cgY + 25} fill="#fbbf24" fontSize="9" fontWeight="bold">
                      W_arm = 15 N
                    </text>

                    {/* Hand Load Downward Gravity Vector */}
                    {loadKg > 0 && (
                      <g>
                        <line
                          x1={handX}
                          y1={handY + 32}
                          x2={handX}
                          y2={handY + 70}
                          stroke="#f59e0b"
                          strokeWidth="3"
                          strokeDasharray="4 2"
                        />
                        <polygon points={`${handX},${handY + 74} ${handX - 5},${handY + 62} ${handX + 5},${handY + 62}`} fill="#f59e0b" />
                        <text x={handX + 8} y={handY + 58} fill="#f59e0b" fontSize="10" fontWeight="bold">
                          Load W = {Math.round(w_load)} N
                        </text>
                      </g>
                    )}

                    {/* Triceps Extensor Pull Vector (Active during extension) */}
                    {!isFlexionPhase && !severTriceps && (
                      <g>
                        <line
                          x1={olecranonX}
                          y1={olecranonY}
                          x2={olecranonX + (tricepOriginX - olecranonX) * 0.35}
                          y2={olecranonY + (tricepOriginY - olecranonY) * 0.35}
                          stroke="#38bdf8"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <text x={olecranonX - 85} y={olecranonY - 10} fill="#38bdf8" fontSize="10" fontWeight="bold">
                          F_triceps (Pulling)
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* 8. ANATOMICAL LABELS & LEVER ARMS */}
                {showLabels && (
                  <g fontSize="11" fontWeight="bold">
                    {/* Scapula Origin Label */}
                    <g className="cursor-pointer" onClick={() => setActiveInspect('scapula')}>
                      <line x1={shoulderX - 10} y1={shoulderY - 15} x2={shoulderX - 65} y2={shoulderY - 30} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                      <text x={shoulderX - 70} y={shoulderY - 34} fill="#e2e8f0" fontSize="10">
                        Scapula (Origin Anchor)
                      </text>
                    </g>

                    {/* Biceps Label (with collision offset when forearm is flexed up) */}
                    <g className="cursor-pointer" onClick={() => setActiveInspect('biceps')}>
                      <text x={bicepMidX + 15} y={angle < 55 ? bicepMidY - 24 : bicepMidY - 8} fill="#f43f5e">
                        Biceps Brachii
                      </text>
                      <text x={bicepMidX + 15} y={angle < 55 ? bicepMidY - 10 : bicepMidY + 6} fontSize="9" fill="#fda4af">
                        {isFlexionPhase ? '(Agonist · Pulling Up)' : '(Antagonist · Relaxed)'}
                      </text>
                    </g>

                    {/* Triceps Label */}
                    <g className="cursor-pointer" onClick={() => setActiveInspect('triceps')}>
                      <text x={tricepMidX - 95} y={tricepMidY - 5} fill="#38bdf8">
                        Triceps Brachii
                      </text>
                      <text x={tricepMidX - 95} y={tricepMidY + 10} fontSize="9" fill="#bae6fd">
                        {!isFlexionPhase ? '(Agonist · Pulling Olecranon)' : '(Antagonist · Stretched)'}
                      </text>
                    </g>

                    {/* Humerus Shaft Label */}
                    <g className="cursor-pointer" onClick={() => setActiveInspect('humerus')}>
                      <text x={shoulderX - 10} y={shoulderY + 95} textAnchor="middle" fill="#cbd5e1" fontSize="9">
                        Humerus Shaft
                      </text>
                    </g>

                    {/* Elbow Joint (Fulcrum) */}
                    <g className="cursor-pointer" onClick={() => setActiveInspect('joint')}>
                      <text x={elbowX - 100} y={elbowY + 22} fill="#38bdf8">
                        Fulcrum (Elbow Hinge)
                      </text>
                    </g>

                    {/* Insertion Point Label */}
                    <text x={bicepInsertX + 12} y={bicepInsertY + 14} fontSize="9" fill="#fcd34d">
                      Insertion: Radial Tuberosity (4 cm)
                    </text>

                    {/* Olecranon Process Label */}
                    <text x={olecranonX - 25} y={olecranonY + 24} fontSize="9" fill="#94a3b8">
                      Olecranon Process (Ulna)
                    </text>

                    {/* Forearm Bones Lever Label */}
                    <g className="cursor-pointer" onClick={() => setActiveInspect('radius_ulna')}>
                      <text
                        x={elbowX + forearmLength * 0.65 * dirX + 16 * normX}
                        y={elbowY + forearmLength * 0.65 * dirY + 16 * normY}
                        fontSize="9"
                        fill="#94a3b8"
                      >
                        Radius &amp; Ulna (Lever)
                      </text>
                    </g>
                  </g>
                )}
              </svg>

              {/* Bottom Instructions */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 pointer-events-none">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-rose-400" />
                  Drag the slider below to smoothly sweep joint angle (30° - 180°)
                </span>
                <span className="text-rose-400 font-medium hidden sm:inline">
                  Click any muscle or bone to inspect attachments
                </span>
              </div>
            </div>

            {/* Interactive Sliders & Presets */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              {/* Control 2: Continuous Forearm Angle Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-rose-400" />
                    Forearm Joint Flexion Angle: {Math.round(angle)}°
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className={angle <= 60 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      30° (Max Flexion)
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className={angle >= 85 && angle <= 95 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                      90° (Resting)
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className={angle >= 170 ? 'text-sky-400 font-bold' : 'text-slate-400'}>
                      180° (Full Extension)
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  step="1"
                  value={angle}
                  onChange={(e) => {
                    audioSynth.playJointSnap();
                    setAngle(Number(e.target.value));
                    setIsAnimating(false);
                    setTargetAction(null);
                  }}
                  className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Control 3: Hand Load Presets (0 kg, 2 kg, 5 kg) */}
              <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span className="text-xs sm:text-sm font-bold text-white">
                    Hand Load / Dumbbell Weight:
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { label: 'No Load (0 kg)', weight: 0 },
                    { label: 'Light (2 kg)', weight: 2 },
                    { label: 'Heavy (5 kg)', weight: 5 }
                  ].map((preset) => (
                    <button
                      key={preset.weight}
                      onClick={() => handleLoadChange(preset.weight)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        loadKg === preset.weight
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Comparative Antagonistic Monitoring & Inspector (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            {/* Real-time Antagonistic Muscle State Monitor */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  Antagonistic State Monitor
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  MUTUAL EXCLUSION
                </span>
              </div>

              {/* Biceps Brachii Status Card */}
              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isFlexionPhase ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`} />
                    BICEPS BRACHII (FLEXOR)
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isFlexionPhase
                        ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/50'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isFlexionPhase ? 'AGONIST · CONTRACTING' : 'ANTAGONIST · RELAXED'}
                  </span>
                </div>

                {/* Bulge Thickness Gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Muscle Belly Bulge:</span>
                    <span className="font-mono text-rose-300 font-bold">{Math.round(bicepsThickness)} mm</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-red-600 h-full transition-all duration-150"
                      style={{ width: `${Math.min(100, (bicepsThickness / 42) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 text-[11px] text-slate-300 pt-1 border-t border-rose-950/80">
                  <div>Length: {bicepsLengthPercent}% resting</div>
                  <div className="text-right font-mono text-rose-300 font-bold">
                    Effort: {bicepsEffortForce} N
                  </div>
                </div>
              </div>

              {/* Triceps Brachii Status Card */}
              <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-800/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${(!isFlexionPhase && !severTriceps) ? 'bg-sky-400 animate-ping' : 'bg-slate-600'}`} />
                    TRICEPS BRACHII (EXTENSOR)
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      severTriceps
                        ? 'bg-rose-900 text-rose-300'
                        : !isFlexionPhase
                        ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/50'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {severTriceps
                      ? 'SEVERED / PARALYZED'
                      : !isFlexionPhase
                      ? 'AGONIST · CONTRACTING'
                      : 'ANTAGONIST · STRETCHED'}
                  </span>
                </div>

                {/* Bulge Thickness Gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Muscle Belly Bulge:</span>
                    <span className="font-mono text-sky-300 font-bold">{Math.round(tricepsThickness)} mm</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-blue-600 h-full transition-all duration-150"
                      style={{ width: `${Math.min(100, (tricepsThickness / 38) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 text-[11px] text-slate-300 pt-1 border-t border-sky-950/80">
                  <div>Length: {tricepsLengthPercent}% resting</div>
                  <div className="text-right font-mono text-sky-300 font-bold">
                    Tension: {!isFlexionPhase && !severTriceps ? `${Math.round(40 + flexRatio * 30)} N` : '0 N'}
                  </div>
                </div>
              </div>

              {/* Scientific Golden Rule Callout */}
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-200/90 leading-relaxed">
                <strong className="text-amber-400 block mb-0.5">Biological Core Principle:</strong>
                Skeletal muscles <strong>pull only</strong>. They never push! To return the forearm from flexion to extension,
                the triceps MUST pull from behind the elbow pivot axis. Both muscles never contract together in normal voluntary movement.
              </div>
            </div>

            {/* Click-to-Inspect Anatomical Card */}
            <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                  Attachment Inspector
                </h4>
                {activeInspect && (
                  <button
                    onClick={() => setActiveInspect(null)}
                    className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear Focus
                  </button>
                )}
              </div>

              {activeInspect ? (
                <div className="space-y-2 text-xs bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                  <div className="font-bold text-white text-sm">
                    {ANATOMICAL_PARTS[activeInspect].title}
                  </div>
                  <div className="text-[11px] text-rose-300 font-medium">
                    {ANATOMICAL_PARTS[activeInspect].role}
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    <strong className="text-white">Origin: </strong>
                    {ANATOMICAL_PARTS[activeInspect].origin}
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    <strong className="text-white">Insertion: </strong>
                    {ANATOMICAL_PARTS[activeInspect].insertion}
                  </div>
                  <div className="text-slate-400 text-[11px] italic bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    {ANATOMICAL_PARTS[activeInspect].action}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-500 space-y-1">
                  <p>Click Biceps, Triceps, Humerus, Ulna or Elbow Joint in the diagram to inspect anatomical origins &amp; insertions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THIRD-CLASS LEVER MECHANICS */}
      {activeTab === 'lever_physics' && (
        <div className="mt-6 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Biomechanics &amp; Physics of the Forearm
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-amber-400" />
                The Human Forearm as a Third-Class Lever (F - E - L)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                In a <strong className="text-amber-400">Class 3 Lever</strong>, the muscular Effort force (biceps tendon at
                radial tuberosity) is applied <em>between</em> the Fulcrum (elbow hinge) and the Load (hand &amp; held mass).
              </p>
            </div>

            {/* Lever Schematic Diagram Card */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Free-Body Diagram &amp; Moment Arms
              </div>

              <svg viewBox="0 0 540 120" className="w-full h-28 drop-shadow-md">
                {/* Horizontal Lever Beam representing Forearm */}
                <line x1="40" y1="60" x2="500" y2="60" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />

                {/* Fulcrum (Elbow Joint at 40px) */}
                <polygon points="40,60 28,84 52,84" fill="#38bdf8" />
                <text x="40" y="100" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
                  Fulcrum (Elbow)
                </text>

                {/* Effort Vector (Biceps Tendon at 90px = 4 cm) */}
                <line x1="95" y1="60" x2="95" y2="18" stroke="#f43f5e" strokeWidth="3" />
                <polygon points="95,12 90,22 100,22" fill="#f43f5e" />
                <text x="95" y="10" textAnchor="middle" fill="#f43f5e" fontSize="10" fontWeight="bold">
                  Effort (F_biceps)
                </text>
                <text x="95" y="75" textAnchor="middle" fill="#f43f5e" fontSize="9">
                  d_e = 4 cm
                </text>

                {/* Forearm Mass at Center of Gravity (240px = 15 cm) */}
                <circle cx="240" cy="60" r="4" fill="#fbbf24" />
                <line x1="240" y1="60" x2="240" y2="92" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 2" />
                <polygon points="240,96 236,88 244,88" fill="#fbbf24" />
                <text x="240" y="110" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">
                  W_arm = 15 N (15 cm)
                </text>

                {/* Load at Hand (480px = 35 cm) */}
                <line x1="480" y1="60" x2="480" y2="95" stroke="#f59e0b" strokeWidth="3" />
                <polygon points="480,100 475,90 485,90" fill="#f59e0b" />
                <text x="480" y="114" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">
                  Load = {Math.round(w_load)} N (35 cm)
                </text>
              </svg>
            </div>

            {/* Live Principle of Moments Calculation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Effort Arm (d_effort)</span>
                <div className="text-xl font-black text-rose-400 font-mono">0.04 m (4.0 cm)</div>
                <p className="text-[11px] text-slate-400">Distance from elbow fulcrum to radial tuberosity.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Load Arm (d_load)</span>
                <div className="text-xl font-black text-amber-400 font-mono">0.35 m (35.0 cm)</div>
                <p className="text-[11px] text-slate-400">Distance from elbow fulcrum to center of palm.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Velocity Ratio</span>
                <div className="text-xl font-black text-emerald-400 font-mono">{velocityRatio} : 1 Advantage</div>
                <p className="text-[11px] text-slate-400">Hand moves {velocityRatio}× faster than the contracting tendon!</p>
              </div>
            </div>

            {/* Full Equation Breakdown */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-3 text-xs sm:text-sm">
              <div className="font-bold text-rose-300">
                Rotational Equilibrium Formula (Sum of Moments = 0 about Elbow):
              </div>
              <div className="font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 text-xs sm:text-sm">
                <div className="text-slate-300">F_biceps × d_effort = (W_forearm × d_cg) + (W_load × d_load)</div>
                <div className="text-slate-400">
                  F_biceps × 0.04 m = (15 N × 0.15 m) + ({Math.round(w_load)} N × 0.35 m)
                </div>
                <div className="text-slate-400">
                  F_biceps × 0.04 m = {armMoment.toFixed(2)} N·m + {loadMoment.toFixed(2)} N·m = {totalLoadMoment.toFixed(2)} N·m
                </div>
                <div className="text-rose-400 font-bold text-base pt-1">
                  F_biceps = {totalLoadMoment.toFixed(2)} / 0.04 = {bicepsEffortForce} N!
                </div>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">
                <strong>Why did nature design this?</strong> Even though the biceps must generate massive internal tension
                ({bicepsEffortForce} N to hold just a {loadKg} kg weight), this third-class lever allows a tiny 2 cm muscle contraction
                to rapidly whip the hand through nearly 18 cm. This speed amplification was crucial for primate tree swinging,
                tool manipulation, and defense.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: "PULL-ONLY" LAB & SLIDING FILAMENT THEORY */}
      {activeTab === 'pull_only_lab' && (
        <div className="mt-6 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Microscopic Sliding Filament Mechanism
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-amber-400" />
                Why Muscles Can Only Pull (Never Push)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                At the molecular level within sarcomeres, myosin head cross-bridges attach to actin filaments and pull them
                towards the center of the sarcomere (power stroke). When ATP binds, the heads release and reset. There is no
                active mechanism to push actin filaments back apart!
              </p>
            </div>

            {/* Sarcomere Molecular Diagram */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Molecular Sarcomere Architecture
              </span>
              <svg viewBox="0 0 540 140" className="w-full h-32 drop-shadow-sm">
                {/* Z-Discs */}
                <line x1="60" y1="20" x2="60" y2="120" stroke="#38bdf8" strokeWidth="4" />
                <line x1="480" y1="20" x2="480" y2="120" stroke="#38bdf8" strokeWidth="4" />
                <text x="60" y="15" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">Z-Disc</text>
                <text x="480" y="15" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">Z-Disc</text>

                {/* Thin Actin Filaments */}
                <line x1="60" y1="45" x2="220" y2="45" stroke="#f43f5e" strokeWidth="3" />
                <line x1="60" y1="95" x2="220" y2="95" stroke="#f43f5e" strokeWidth="3" />
                <line x1="480" y1="45" x2="320" y2="45" stroke="#f43f5e" strokeWidth="3" />
                <line x1="480" y1="95" x2="320" y2="95" stroke="#f43f5e" strokeWidth="3" />

                {/* Thick Myosin Filaments */}
                <rect x="200" y="60" width="140" height="20" rx="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                <text x="270" y="74" textAnchor="middle" fill="#000000" fontSize="10" fontWeight="bold">
                  Thick Myosin Filament
                </text>

                {/* Myosin Heads pulling inward */}
                <polygon points="210,60 215,50 220,60" fill="#f59e0b" />
                <polygon points="320,60 325,50 330,60" fill="#f59e0b" />
                <polygon points="210,80 215,90 220,80" fill="#f59e0b" />
                <polygon points="320,80 325,90 330,80" fill="#f59e0b" />

                {/* Inward Pull Arrows */}
                <line x1="120" y1="35" x2="160" y2="35" stroke="#ffffff" strokeWidth="1.5" />
                <polygon points="165,35 155,31 155,39" fill="#ffffff" />
                <line x1="420" y1="35" x2="380" y2="35" stroke="#ffffff" strokeWidth="1.5" />
                <polygon points="375,35 385,31 385,39" fill="#ffffff" />
                <text x="270" y="115" textAnchor="middle" fill="#f43f5e" fontSize="10" fontWeight="bold">
                  Inward Pulling Force ONLY (Z-lines move closer)
                </text>
              </svg>
            </div>

            {/* Thought Experiment: Severed Antagonistic Partner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    Clinical Thought Experiment: "Paralyzed or Severed Triceps"
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Toggle this experimental mode to see what happens to arm movement when the antagonistic extensor cannot pull.
                  </p>
                </div>
                <button
                  onClick={() => setSeverTriceps(!severTriceps)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    severTriceps
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {severTriceps ? 'Triceps Severed (Active)' : 'Sever Triceps (Test)'}
                </button>
              </div>

              {severTriceps ? (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-200 space-y-1">
                  <strong>Pathology Observed:</strong> The biceps can still contract to bend the forearm upwards into flexion.
                  However, when the student clicks "Extend Forearm", the arm <span className="underline font-bold">cannot move back</span>!
                  Because the biceps cannot push, and the triceps is non-functional, the arm remains permanently locked in flexion unless pulled down by gravity or an external examiner.
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-200">
                  Normal physiology: Biceps flexes the arm, then relaxes while Triceps contracts to pull the olecranon process and extend the arm back to 180°.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KCSE MECHANICS & ANTAGONISTIC EXAM QUIZ */}
      {activeTab === 'kcse_quiz' && (
        <div className="mt-6 max-w-3xl mx-auto space-y-6">
          {!quizSubmitted ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Question {quizIndex + 1} of {KCSE_ARM_QUIZ.length}
                </span>
                <span className="text-xs text-slate-400">KCSE Biology Form 4 Exam Level</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {KCSE_ARM_QUIZ[quizIndex].question}
                </h3>

                <div className="space-y-2.5">
                  {KCSE_ARM_QUIZ[quizIndex].options.map((option, optIdx) => {
                    const isChosen = userAnswers[quizIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectQuiz(optIdx)}
                        className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all border cursor-pointer flex items-center justify-between ${
                          isChosen
                            ? 'bg-rose-600/30 border-rose-400 text-white shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <span>{option}</span>
                        {isChosen && <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  disabled={quizIndex === 0}
                  onClick={() => setQuizIndex((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                {quizIndex < KCSE_ARM_QUIZ.length - 1 ? (
                  <button
                    disabled={userAnswers[quizIndex] === undefined}
                    onClick={() => setQuizIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    disabled={userAnswers[quizIndex] === undefined}
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    Submit Quiz &amp; Grade
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white">Biomechanics Quiz Completed!</h3>
                <p className="text-sm text-slate-300">
                  You scored <span className="font-bold text-emerald-400">{quizScore}</span> out of{' '}
                  <span className="font-bold text-white">{KCSE_ARM_QUIZ.length}</span> (
                  {Math.round((quizScore / KCSE_ARM_QUIZ.length) * 100)}%)
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Answer Breakdown &amp; Explanations:</h4>
                {KCSE_ARM_QUIZ.map((q, idx) => {
                  const userChoice = userAnswers[idx];
                  const isCorrect = userChoice === q.correct;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
                        isCorrect
                          ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                          : 'bg-rose-950/20 border-rose-800/60 text-rose-200'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span>
                          Q{idx + 1}: {q.question}
                        </span>
                      </div>
                      <div className="pl-6 text-slate-300 text-xs">
                        <strong className="text-slate-200">Correct Answer: </strong>
                        {q.options[q.correct]}
                      </div>
                      <div className="pl-6 text-slate-400 text-xs leading-relaxed italic bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={handleResetQuiz}
                  className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Mechanics Quiz</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
