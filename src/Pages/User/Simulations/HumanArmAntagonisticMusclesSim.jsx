import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Sparkles,
  Layers,
  Info,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  Eye,
  Activity,
  ArrowRight,
  TrendingUp,
  Zap
} from 'lucide-react';

/**
 * Sound Synthesizer for biomechanical muscle contraction & joint movement
 */
class MuscleBiomechanicsSynth {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }
  playTension() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.095);
    } catch {
      // Audio context guard
    }
  }
  playJointSnap() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.055);
    } catch {
      // Audio context guard
    }
  }
  playSuccess() {
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
        gain.gain.setValueAtTime(0.04, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.15);
      });
    } catch {
      // Audio context guard
    }
  }
}

const audioSynth = new MuscleBiomechanicsSynth();

/**
 * KCSE Biomechanics Lever & Antagonistic Quiz Questions
 */
const KCSE_ARM_QUIZ = [
  {
    id: 1,
    question: 'When the forearm is flexed (bent upwards towards the shoulder), what happens to the biceps and triceps muscles?',
    options: [
      'Biceps contracts (shortens & thickens) while triceps relaxes (lengthens)',
      'Triceps contracts (shortens & thickens) while biceps relaxes (lengthens)',
      'Both biceps and triceps contract simultaneously with equal tension',
      'Both biceps and triceps relax completely due to gravity'
    ],
    correct: 0,
    explanation: 'Skeletal muscles work in antagonistic pairs because they can only pull by contracting, not push. In flexion, the biceps brachii acts as the agonist (flexor) by contracting, while the triceps brachii acts as the antagonist (extensor) by relaxing.'
  },
  {
    id: 2,
    question: 'Identify the correct anatomical origins and insertions of the biceps brachii muscle in mammals:',
    options: [
      'Origin on radius; insertion on scapula',
      'Origin on scapula (two heads); insertion on radial tuberosity of the radius',
      'Origin on humerus; insertion on olecranon process of the ulna',
      'Origin on clavicle; insertion on carpals'
    ],
    correct: 1,
    explanation: 'The biceps brachii arises by two tendons from the scapula (fixed origin) and inserts onto the radial tuberosity of the radius (movable insertion).'
  },
  {
    id: 3,
    question: 'The elbow joint functions as a third-class lever during forearm flexion. Where is the effort applied relative to the fulcrum and load?',
    options: [
      'Fulcrum is between the effort and the load (1st class)',
      'Load is between the fulcrum and the effort (2nd class)',
      'Effort (biceps tendon) is applied between the fulcrum (elbow hinge) and the load (hand/forearm mass) (3rd class)',
      'Effort and load are at the exact same location with zero lever advantage'
    ],
    correct: 2,
    explanation: 'In a third-class lever, the effort force (biceps tendon insertion on radial tuberosity) lies between the fulcrum (elbow joint) and the resistance load (weight of forearm/hand). This prioritizes rapid, large displacement of the hand over force multiplication.'
  },
  {
    id: 4,
    question: 'What is the specific mechanical role of the olecranon process of the ulna during forearm extension?',
    options: [
      'It acts as the movable insertion site for the triceps tendon behind the elbow fulcrum',
      'It secretes synovial fluid to lubricate the radius',
      'It serves as the origin for the deltoid shoulder muscle',
      'It prevents the forearm from pronating and supinating'
    ],
    correct: 0,
    explanation: 'The triceps brachii inserts via a strong tendon onto the olecranon process of the ulna. When the triceps contracts, it pulls the olecranon lever backwards behind the hinge axis, straightening (extending) the forearm.'
  },
  {
    id: 5,
    question: 'A load of 50 N is held in the hand at a distance of 35 cm from the elbow joint. If the biceps inserts 3.5 cm from the elbow joint, calculate the minimum muscular effort force required to hold the arm stationary in equilibrium:',
    options: ['5 N', '50 N', '500 N', '175 N'],
    correct: 2,
    explanation: 'Using the principle of moments about the elbow fulcrum: Effort × Effort Arm = Load × Load Arm. Effort × 3.5 cm = 50 N × 35 cm => Effort = (50 × 35) / 3.5 = 500 N. The biceps must exert 10 times the load force because of the short effort arm!'
  }
];

export default function HumanArmAntagonisticMusclesSim({ onTelemetry }) {
  // Forearm Flexion Angle (0 = fully extended 180°, 100 = fully flexed ~40°)
  // We represent joint angle from 0 (straight arm ~175°) to 110 (deeply flexed ~65°)
  const [flexionAngle, setFlexionAngle] = useState(35); // Degrees from full extension
  const [loadWeight, setLoadWeight] = useState(25); // Newtons held in hand
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetAction, setTargetAction] = useState(null); // 'flex' | 'extend'
  const [showTensionVectors, setShowTensionVectors] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [activeHighlight, setActiveHighlight] = useState(null); // 'biceps' | 'triceps' | 'humerus' | 'radius_ulna' | 'synovial_joint'

  // Tab State: 'interactive_arm' | 'lever_physics' | 'kcse_quiz'
  const [activeTab, setActiveTab] = useState('interactive_arm');
  const [quizIndex, setQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Animation Loop for Smooth Flex / Extend
  useEffect(() => {
    if (!isAnimating || !targetAction) return;

    const interval = setInterval(() => {
      setFlexionAngle((prev) => {
        if (targetAction === 'flex') {
          if (prev >= 105) {
            setIsAnimating(false);
            setTargetAction(null);
            audioSynth.playJointSnap();
            return 105;
          }
          return prev + 2.5;
        } else if (targetAction === 'extend') {
          if (prev <= 10) {
            setIsAnimating(false);
            setTargetAction(null);
            audioSynth.playJointSnap();
            return 10;
          }
          return prev - 2.5;
        }
        return prev;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [isAnimating, targetAction]);

  // Automated 1-Click Action Handlers
  const handleTriggerFlexion = () => {
    audioSynth.playTension();
    setTargetAction('flex');
    setIsAnimating(true);
  };

  const handleTriggerExtension = () => {
    audioSynth.playTension();
    setTargetAction('extend');
    setIsAnimating(true);
  };

  const handleResetArm = () => {
    audioSynth.playJointSnap();
    setIsAnimating(false);
    setTargetAction(null);
    setFlexionAngle(35);
    setLoadWeight(25);
  };

  // Biomechanical Calculations
  // Fraction flexed: 0 = extended, 1 = maximum flexion
  const flexFraction = (flexionAngle - 10) / 95; // 0 to 1

  // Biceps state
  const bicepsTension = useMemo(() => {
    // Muscle shortens by ~30% during full contraction
    const lengthPercent = 100 - flexFraction * 28;
    // Muscle belly thickens (cross-sectional bulge)
    const thickness = 22 + flexFraction * 20;
    // Moment arm: biceps tendon to elbow ~3.5 cm
    // Load arm: ~35 cm. Effort = Load * (35 / 3.5) = Load * 10 (base biomechanical ratio)
    const effortForce = Math.round(loadWeight * 10 * (0.8 + flexFraction * 0.4));
    return {
      lengthPercent: Math.round(lengthPercent),
      thickness,
      effortForce,
      state: flexFraction > 0.5 ? 'Contracted (Agonist - Pulling)' : 'Moderately Contracted'
    };
  }, [flexFraction, loadWeight]);

  // Triceps state
  const tricepsTension = useMemo(() => {
    // Triceps is stretched when arm is flexed
    const lengthPercent = 80 + flexFraction * 35;
    const thickness = Math.max(16, 32 - flexFraction * 14);
    const passiveTension = Math.round(15 + (1 - flexFraction) * (loadWeight * 1.5));
    return {
      lengthPercent: Math.round(lengthPercent),
      thickness,
      passiveTension,
      state: flexFraction > 0.5 ? 'Relaxed / Stretched (Antagonist)' : 'Contracting (Extensor Agonist)'
    };
  }, [flexFraction, loadWeight]);

  // Elbow Joint Coordinates & Geometry
  // Humerus is fixed vertically from (160, 50) [Scapula/Shoulder] down to (160, 210) [Elbow Hinge]
  // Forearm pivots around (160, 210). Angle = 90 - flexionAngle (degrees from horizontal)
  const elbowX = 160;
  const elbowY = 220;
  const humerusLength = 160;
  const shoulderX = 160;
  const shoulderY = 60;

  const forearmLength = 165;
  // Forearm angle in radians
  const armRad = ((90 - flexionAngle) * Math.PI) / 180;
  const handX = elbowX + forearmLength * Math.cos(armRad);
  const handY = elbowY - forearmLength * Math.sin(armRad);

  // Radial Tuberosity (Biceps insertion on radius: 32px ~ 3.5cm from elbow)
  const bicepInsertDist = 36;
  const bicepInsertX = elbowX + bicepInsertDist * Math.cos(armRad);
  const bicepInsertY = elbowY - bicepInsertDist * Math.sin(armRad);

  // Olecranon Process (Triceps insertion on ulna: behind and slightly below elbow hinge)
  const olecranonDist = 24;
  const olecranonX = elbowX - olecranonDist * Math.cos(armRad);
  const olecranonY = elbowY + olecranonDist * Math.sin(armRad);

  // Biceps Origin (Scapula anterior edge above glenoid cavity)
  const bicepOriginX = shoulderX - 12;
  const bicepOriginY = shoulderY + 15;

  // Triceps Origin (Scapula infraglenoid tubercle + posterior humerus shaft)
  const tricepOriginX = shoulderX + 18;
  const tricepOriginY = shoulderY + 25;

  // Biceps Muscle Belly Center Point (bulges outward anteriorly)
  const bicepMidX = (bicepOriginX + bicepInsertX) / 2 - (10 + flexFraction * 22);
  const bicepMidY = (bicepOriginY + bicepInsertY) / 2 - 5;

  // Triceps Muscle Belly Center Point (posterior humerus)
  const tricepMidX = (tricepOriginX + olecranonX) / 2 + (12 + (1 - flexFraction) * 10);
  const tricepMidY = (tricepOriginY + olecranonY) / 2;

  // Quiz submission
  const handleSelectQuizOption = (optIdx) => {
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
    if (onTelemetry) {
      onTelemetry({
        type: 'kcse_quiz_complete',
        simulation: 'human_arm_antagonistic_muscles',
        score,
        total: KCSE_ARM_QUIZ.length,
        percentage: Math.round((score / KCSE_ARM_QUIZ.length) * 100)
      });
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizIndex(0);
    setQuizScore(0);
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-slate-800 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-1">
            <span className="p-1 rounded bg-rose-950/80 border border-rose-800/60">
              <Activity className="w-4 h-4 text-rose-400" />
            </span>
            <span>KCSE Form 4 Biology · Topic 1: Support & Locomotion</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            Human Arm Biomechanical Lever & Antagonistic Muscles
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Simulate antagonistic muscle pair coordination (Biceps brachii vs Triceps brachii) across the elbow synovial
            hinge joint. Inspect muscle belly contraction, tendon tension lines, origin/insertion mechanics, and
            third-class lever moments.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl self-start lg:self-center">
          <button
            onClick={() => setActiveTab('interactive_arm')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'interactive_arm'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Biomechanical Arm</span>
          </button>
          <button
            onClick={() => setActiveTab('lever_physics')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'lever_physics'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Lever Calculations</span>
          </button>
          <button
            onClick={() => setActiveTab('kcse_quiz')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'kcse_quiz'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>KCSE Mechanics Quiz</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Arm Stage */}
      {activeTab === 'interactive_arm' && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Visual Stage (Canvas/SVG) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {/* Quick 1-Click Automated Runs Bar */}
            <div className="flex items-center gap-2.5 flex-wrap bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                Automated Actions:
              </span>
              <button
                onClick={handleTriggerFlexion}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>1-Click: Flex Forearm (Bend)</span>
              </button>
              <button
                onClick={handleTriggerExtension}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>1-Click: Extend Forearm (Straighten)</span>
              </button>
              <button
                onClick={handleResetArm}
                className="p-2 rounded-xl text-xs bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer ml-auto"
                title="Reset Arm Position"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Arm Canvas Container */}
            <div className="relative w-full h-[420px] sm:h-[480px] bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-3xl border border-slate-800/90 overflow-hidden flex items-center justify-center shadow-inner">
              {/* Reference Grid */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-1 z-10 pointer-events-none">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 border border-slate-700 text-rose-300 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Forearm Angle: {Math.round(flexionAngle)}° ({flexFraction > 0.5 ? 'FLEXION' : 'EXTENSION'})
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Effort Moment: {Math.round(bicepsTension.effortForce * 0.035)} N·m | Load Moment:{' '}
                  {Math.round(loadWeight * 0.35)} N·m
                </span>
              </div>

              {/* Toggle Vectors & Labels */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={() => setShowTensionVectors(!showTensionVectors)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    showTensionVectors
                      ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                      : 'bg-slate-900/80 border-slate-800 text-slate-500'
                  }`}
                >
                  {showTensionVectors ? 'Hide Force Vectors' : 'Show Force Vectors'}
                </button>
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    showLabels
                      ? 'bg-sky-950/80 border-sky-600 text-sky-300'
                      : 'bg-slate-900/80 border-slate-800 text-slate-500'
                  }`}
                >
                  {showLabels ? 'Hide Labels' : 'Show Labels'}
                </button>
              </div>

              {/* SVG Biomechanical Arm Model */}
              <svg viewBox="0 0 460 420" className="w-full h-full drop-shadow-2xl overflow-visible">
                <defs>
                  {/* Bone Gradients */}
                  <linearGradient id="boneHumerus" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="35%" stopColor="#f1f5f9" />
                    <stop offset="70%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                  <linearGradient id="boneRadiusUlna" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="60%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                  {/* Muscle Active Contraction Gradient */}
                  <radialGradient id="muscleContracting" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="50%" stopColor="#e11d48" />
                    <stop offset="85%" stopColor="#9f1239" />
                    <stop offset="100%" stopColor="#4c0519" />
                  </radialGradient>
                  {/* Muscle Relaxed Gradient */}
                  <radialGradient id="muscleRelaxed" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#fda4af" />
                    <stop offset="60%" stopColor="#e2e8f0" />
                    <stop offset="85%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                  </radialGradient>
                  {/* Tendon Gradient (Tough White Fibrous) */}
                  <linearGradient id="tendonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                  {/* Cartilage / Synovial Joint Glow */}
                  <filter id="jointGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.6" />
                  </filter>
                </defs>

                {/* 1. SCAPULA & SHOULDER GIRDLE (Fixed Base Anchor) */}
                <g opacity={activeHighlight && activeHighlight !== 'humerus' ? 0.4 : 1}>
                  <path
                    d="M 90,30 C 130,25 180,35 195,55 C 185,75 160,85 140,80 C 120,75 100,60 90,30 Z"
                    fill="url(#boneHumerus)"
                    stroke="#475569"
                    strokeWidth="2.5"
                  />
                  {/* Glenoid Cavity Socket */}
                  <ellipse cx="160" cy="62" rx="14" ry="10" fill="#38bdf8" opacity="0.4" />
                </g>

                {/* 2. TRICEPS BRACHII (Posterior Extensor Muscle) */}
                <g
                  onClick={() => setActiveHighlight('triceps')}
                  className="cursor-pointer transition-opacity"
                  opacity={activeHighlight && activeHighlight !== 'triceps' ? 0.35 : 1}
                >
                  {/* Origin Tendon from Scapula & Upper Humerus */}
                  <path
                    d={`M ${tricepOriginX},${tricepOriginY} Q ${tricepMidX + 15},${tricepMidY - 30} ${tricepMidX},${tricepMidY}`}
                    fill="none"
                    stroke="url(#tendonGrad)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  {/* Triceps Muscle Belly */}
                  <path
                    d={`M ${tricepOriginX - 2},${tricepOriginY + 10} Q ${tricepMidX + tricepsTension.thickness},${tricepMidY} ${olecranonX + 4},${olecranonY - 15} Q ${tricepMidX - 6},${tricepMidY} ${tricepOriginX - 2},${tricepOriginY + 10} Z`}
                    fill={flexFraction < 0.35 ? 'url(#muscleContracting)' : 'url(#muscleRelaxed)'}
                    stroke="#881337"
                    strokeWidth="1.5"
                  />
                  {/* Triceps Muscle Striations */}
                  <path
                    d={`M ${tricepMidX + 5},${tricepMidY - 20} L ${tricepMidX + 12},${tricepMidY + 20}`}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.4"
                  />
                  {/* Insertion Tendon onto Olecranon Process */}
                  <path
                    d={`M ${tricepMidX},${tricepMidY + 20} L ${olecranonX},${olecranonY}`}
                    fill="none"
                    stroke="url(#tendonGrad)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </g>

                {/* 3. HUMERUS BONE (Upper Arm Shaft) */}
                <g
                  onClick={() => setActiveHighlight('humerus')}
                  className="cursor-pointer"
                  opacity={activeHighlight && activeHighlight !== 'humerus' ? 0.4 : 1}
                >
                  {/* Proximal Head (Ball) */}
                  <ellipse cx="160" cy="65" rx="16" ry="14" fill="url(#boneHumerus)" stroke="#64748b" strokeWidth="2" />
                  {/* Humerus Shaft */}
                  <rect
                    x="150"
                    y="72"
                    width="20"
                    height="136"
                    rx="8"
                    fill="url(#boneHumerus)"
                    stroke="#64748b"
                    strokeWidth="2.5"
                  />
                  {/* Distal Capitulum & Trochlea (Elbow Condyles) */}
                  <ellipse cx="160" cy="214" rx="18" ry="14" fill="url(#boneHumerus)" stroke="#475569" strokeWidth="2" />
                </g>

                {/* 4. BICEPS BRACHII (Anterior Flexor Muscle) */}
                <g
                  onClick={() => setActiveHighlight('biceps')}
                  className="cursor-pointer transition-opacity"
                  opacity={activeHighlight && activeHighlight !== 'biceps' ? 0.35 : 1}
                >
                  {/* Origin Tendons from Scapula */}
                  <path
                    d={`M ${bicepOriginX},${bicepOriginY} Q ${bicepMidX - 10},${bicepMidY - 30} ${bicepMidX},${bicepMidY}`}
                    fill="none"
                    stroke="url(#tendonGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Bulging Biceps Muscle Belly */}
                  <path
                    d={`M ${bicepOriginX + 2},${bicepOriginY + 12} Q ${bicepMidX - bicepsTension.thickness},${bicepMidY} ${bicepInsertX - 4},${bicepInsertY - 12} Q ${bicepMidX + 8},${bicepMidY} ${bicepOriginX + 2},${bicepOriginY + 12} Z`}
                    fill={flexFraction > 0.4 ? 'url(#muscleContracting)' : 'url(#muscleRelaxed)'}
                    stroke="#be123c"
                    strokeWidth="2"
                    filter="url(#jointGlow)"
                  />
                  {/* Muscle Contraction Striations */}
                  <path
                    d={`M ${bicepMidX - 8},${bicepMidY - 20} L ${bicepMidX - 14},${bicepMidY + 20}`}
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    opacity="0.6"
                  />
                  {/* Insertion Tendon onto Radial Tuberosity */}
                  <path
                    d={`M ${bicepMidX},${bicepMidY + 20} L ${bicepInsertX},${bicepInsertY}`}
                    fill="none"
                    stroke="url(#tendonGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </g>

                {/* 5. ELBOW SYNOVIAL HINGE JOINT (Capsule & Synovial Fluid) */}
                <g
                  onClick={() => setActiveHighlight('synovial_joint')}
                  className="cursor-pointer"
                  filter="url(#jointGlow)"
                >
                  <circle cx={elbowX} cy={elbowY} r="14" fill="#0284c7" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="2.5" />
                  {/* Articular Cartilage Cap */}
                  <path
                    d={`M ${elbowX - 12},${elbowY} A 12 12 0 0 0 ${elbowX + 12},${elbowY}`}
                    fill="none"
                    stroke="#bae6fd"
                    strokeWidth="3"
                  />
                  {/* Fulcrum Delta Symbol (Physics) */}
                  <polygon
                    points={`${elbowX},${elbowY - 8} ${elbowX - 7},${elbowY + 6} ${elbowX + 7},${elbowY + 6}`}
                    fill="#38bdf8"
                  />
                </g>

                {/* 6. RADIUS & ULNA (Pivoting Forearm Bones) */}
                <g
                  onClick={() => setActiveHighlight('radius_ulna')}
                  className="cursor-pointer"
                  opacity={activeHighlight && activeHighlight !== 'radius_ulna' ? 0.4 : 1}
                >
                  {/* Olecranon Process of Ulna (Beak-like protrusion behind joint) */}
                  <path
                    d={`M ${elbowX},${elbowY} L ${olecranonX},${olecranonY} L ${olecranonX + 12 * Math.sin(armRad)},${olecranonY + 12 * Math.cos(armRad)} Z`}
                    fill="url(#boneRadiusUlna)"
                    stroke="#64748b"
                    strokeWidth="2"
                  />

                  {/* Ulna Shaft */}
                  <line
                    x1={olecranonX}
                    y1={olecranonY}
                    x2={handX - 8 * Math.sin(armRad)}
                    y2={handY - 8 * Math.cos(armRad)}
                    stroke="url(#boneRadiusUlna)"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />

                  {/* Radius Shaft (Anterior bone with radial tuberosity for biceps insertion) */}
                  <line
                    x1={elbowX + 10 * Math.sin(armRad)}
                    y1={elbowY + 10 * Math.cos(armRad)}
                    x2={handX + 6 * Math.sin(armRad)}
                    y2={handY + 6 * Math.cos(armRad)}
                    stroke="url(#boneRadiusUlna)"
                    strokeWidth="11"
                    strokeLinecap="round"
                  />

                  {/* Radial Tuberosity Bump */}
                  <circle cx={bicepInsertX} cy={bicepInsertY} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />

                  {/* Hand and Held Load */}
                  <circle cx={handX} cy={handY} r="14" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                  {/* Held Weight Mass */}
                  <rect
                    x={handX - 14}
                    y={handY + 6}
                    width="28"
                    height="24"
                    rx="5"
                    fill="#f59e0b"
                    stroke="#d97706"
                    strokeWidth="2"
                  />
                  <text
                    x={handX}
                    y={handY + 22}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {loadWeight}N
                  </text>
                </g>

                {/* 7. FORCE VECTORS & MOMENT LEVER ARMS */}
                {showTensionVectors && (
                  <g>
                    {/* Biceps Effort Pull Vector (Arrow towards scapula) */}
                    <line
                      x1={bicepInsertX}
                      y1={bicepInsertY}
                      x2={bicepInsertX - (bicepInsertX - bicepOriginX) * 0.4}
                      y2={bicepInsertY - (bicepInsertY - bicepOriginY) * 0.4}
                      stroke="#f43f5e"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <polygon
                      points={`${bicepInsertX - (bicepInsertX - bicepOriginX) * 0.4},${bicepInsertY - (bicepInsertY - bicepOriginY) * 0.4} ${bicepInsertX - (bicepInsertX - bicepOriginX) * 0.35 - 4},${bicepInsertY - (bicepInsertY - bicepOriginY) * 0.35 + 4} ${bicepInsertX - (bicepInsertX - bicepOriginX) * 0.35 + 4},${bicepInsertY - (bicepInsertY - bicepOriginY) * 0.35 - 4}`}
                      fill="#f43f5e"
                    />

                    {/* Load Vector (Downward gravity on hand) */}
                    <line
                      x1={handX}
                      y1={handY + 28}
                      x2={handX}
                      y2={handY + 70}
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeDasharray="4 2"
                    />
                    <polygon
                      points={`${handX},${handY + 74} ${handX - 5},${handY + 62} ${handX + 5},${handY + 62}`}
                      fill="#f59e0b"
                    />
                    <text
                      x={handX + 8}
                      y={handY + 55}
                      fill="#fbbf24"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      Load W = {loadWeight}N
                    </text>
                  </g>
                )}

                {/* 8. ANATOMICAL LABELS & CALLOUTS */}
                {showLabels && (
                  <g fontSize="11" fontWeight="bold" fill="#f8fafc">
                    {/* Biceps Label */}
                    <text x={bicepMidX - 45} y={bicepMidY - 10} fill="#f43f5e">
                      Biceps Brachii
                    </text>
                    <text x={bicepMidX - 45} y={bicepMidY + 5} fontSize="9" fill="#fda4af">
                      (Flexor · Agonist)
                    </text>

                    {/* Triceps Label */}
                    <text x={tricepMidX + 22} y={tricepMidY - 5} fill="#38bdf8">
                      Triceps Brachii
                    </text>
                    <text x={tricepMidX + 22} y={tricepMidY + 10} fontSize="9" fill="#93c5fd">
                      (Extensor · Antagonist)
                    </text>

                    {/* Joint Label */}
                    <text x={elbowX - 85} y={elbowY + 28} fill="#38bdf8">
                      Fulcrum (Elbow Hinge)
                    </text>

                    {/* Insertion Label */}
                    <text x={bicepInsertX + 10} y={bicepInsertY - 14} fontSize="9" fill="#fcd34d">
                      Insertion: Radial Tuberosity
                    </text>

                    {/* Olecranon Label */}
                    <text x={olecranonX - 10} y={olecranonY + 24} fontSize="9" fill="#94a3b8">
                      Olecranon Process (Ulna)
                    </text>
                  </g>
                )}
              </svg>

              {/* Bottom Stage Hint */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-400 pointer-events-none">
                <span>⚡ Drag the slider below to smoothly bend or straighten the arm</span>
                <span className="text-rose-400 font-medium">Click muscles or bones to inspect details</span>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-rose-400" />
                  Forearm Joint Flexion Angle: {Math.round(flexionAngle)}°
                </span>
                <span className="text-xs font-mono text-rose-300">
                  {flexFraction > 0.5 ? 'Strong Flexion' : 'Forearm Extended'}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="105"
                step="1"
                value={flexionAngle}
                onChange={(e) => {
                  audioSynth.playJointSnap();
                  setFlexionAngle(Number(e.target.value));
                }}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Load Held in Hand: {loadWeight} N (~{(loadWeight / 9.8).toFixed(1)} kg)
                </span>
                <span className="text-xs font-mono text-amber-300">
                  Biceps Effort Force: ~{bicepsTension.effortForce} N
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={loadWeight}
                onChange={(e) => {
                  audioSynth.playTension();
                  setLoadWeight(Number(e.target.value));
                }}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Right Column: Dynamic Antagonistic Coordination Panel */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            {/* Real-Time Antagonistic State Meter */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                Antagonistic Muscle State Monitor
              </h4>

              {/* Biceps Brachii Status */}
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300">BICEPS BRACHII (FLEXOR)</span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      flexFraction > 0.4
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {flexFraction > 0.4 ? 'ACTIVE AGONIST' : 'RELAXED'}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-red-600 h-full transition-all duration-150"
                    style={{ width: `${Math.min(100, (bicepsTension.thickness / 42) * 100)}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 text-[11px] text-slate-300 pt-1">
                  <div>Length: {bicepsTension.lengthPercent}% resting</div>
                  <div className="text-right font-mono text-rose-300">Effort: {bicepsTension.effortForce} N</div>
                </div>
              </div>

              {/* Triceps Brachii Status */}
              <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-300">TRICEPS BRACHII (EXTENSOR)</span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      flexFraction <= 0.4
                        ? 'bg-sky-500 text-white animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {flexFraction <= 0.4 ? 'ACTIVE AGONIST' : 'RELAXED ANTAGONIST'}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-blue-600 h-full transition-all duration-150"
                    style={{ width: `${Math.min(100, (tricepsTension.thickness / 32) * 100)}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 text-[11px] text-slate-300 pt-1">
                  <div>Length: {tricepsTension.lengthPercent}% resting</div>
                  <div className="text-right font-mono text-sky-300">Tension: {tricepsTension.passiveTension} N</div>
                </div>
              </div>
            </div>

            {/* Anatomical Origin & Insertion Reference */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                KCSE Essential Anatomical Attachments
              </h4>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 leading-relaxed">
                  <strong className="text-rose-400 block font-bold">Biceps Brachii:</strong>
                  <span>
                    • <strong className="text-white">Origin:</strong> Scapula (coracoid process & supraglenoid tubercle - fixed bone).
                    <br />• <strong className="text-white">Insertion:</strong> Radial tuberosity of radius (movable bone).
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 leading-relaxed">
                  <strong className="text-sky-400 block font-bold">Triceps Brachii:</strong>
                  <span>
                    • <strong className="text-white">Origin:</strong> Scapula & posterior surface of humerus shaft.
                    <br />• <strong className="text-white">Insertion:</strong> Olecranon process of ulna (movable lever arm).
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200/90 leading-relaxed">
                  <strong className="text-amber-400 block font-bold">Synovial Hinge Joint:</strong>
                  Movement strictly restricted to a single plane (flexion & extension) by the interlocking trochlea of humerus
                  and trochlear notch of ulna.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Biomechanical Lever Mechanics */}
      {activeTab === 'lever_physics' && (
        <div className="mt-6 space-y-6">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Third-Class Lever Mechanics of the Human Forearm
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In human limb biomechanics, skeletal muscles rarely act with mechanical advantage (MA &gt; 1). Instead, the
              forearm operates as a <strong className="text-amber-400">Class 3 Lever</strong>, where the effort force
              applied by the biceps tendon insertion lies between the elbow fulcrum and the load held in the hand.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase">Effort Arm (d_effort)</span>
                <div className="text-xl font-black text-rose-400 font-mono">3.5 cm (0.035 m)</div>
                <p className="text-[11px] text-slate-400">Distance from elbow hinge axis to radial tuberosity.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase">Load Arm (d_load)</span>
                <div className="text-xl font-black text-sky-400 font-mono">35.0 cm (0.35 m)</div>
                <p className="text-[11px] text-slate-400">Distance from elbow hinge axis to center of the palm.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase">Velocity / Distance Ratio</span>
                <div className="text-xl font-black text-emerald-400 font-mono">10 : 1 Advantage</div>
                <p className="text-[11px] text-slate-400">
                  A tiny 1 cm biceps contraction produces a 10 cm rapid sweep of the hand!
                </p>
              </div>
            </div>

            {/* Principle of Moments Math Breakdown */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 space-y-2 text-xs sm:text-sm">
              <strong className="text-amber-300 block font-bold">Rotational Equilibrium (Sum of Moments = 0):</strong>
              <div className="font-mono text-xs sm:text-sm bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <div>Effort × Effort Arm = Load × Load Arm</div>
                <div className="text-slate-400">
                  Effort × 0.035 m = {loadWeight} N × 0.35 m
                </div>
                <div className="text-emerald-400 font-bold">
                  Effort = ({loadWeight} × 0.35) / 0.035 = {loadWeight * 10} N
                </div>
              </div>
              <p className="text-xs text-slate-300 pt-1">
                <strong>Why this evolutionary adaptation?</strong> Although the biceps must generate massive internal
                tension (10 times the load weight), this gives mammals incredible speed, agility, and range of movement
                necessary for catching prey, climbing trees, and tool use.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: KCSE Mechanics Quiz */}
      {activeTab === 'kcse_quiz' && (
        <div className="mt-6 max-w-3xl mx-auto space-y-6">
          {!quizSubmitted ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Question {quizIndex + 1} of {KCSE_ARM_QUIZ.length}
                </span>
                <span className="text-xs text-slate-400">KCSE Form 4 Biology Exam Level</span>
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
                        onClick={() => handleSelectQuizOption(optIdx)}
                        className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all border cursor-pointer flex items-center justify-between ${
                          isChosen
                            ? 'bg-rose-600/30 border-rose-400 text-white shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <span>{option}</span>
                        {isChosen && <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />}
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
                    Submit Quiz & Grade
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
                <h3 className="text-2xl font-black text-white">Quiz Completed!</h3>
                <p className="text-sm text-slate-300">
                  You scored <span className="font-bold text-emerald-400">{quizScore}</span> out of{' '}
                  <span className="font-bold text-white">{KCSE_ARM_QUIZ.length}</span> (
                  {Math.round((quizScore / KCSE_ARM_QUIZ.length) * 100)}%)
                </p>
              </div>

              {/* Explanations review */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Answer Review:</h4>
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
