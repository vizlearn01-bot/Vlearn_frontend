import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Zap,
  ShieldAlert,
  Award,
  BookOpen,
  Layers,
  Eye,
  Sliders,
  ArrowRight,
  Activity,
  Sparkles,
  RefreshCw,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Maximize2
} from 'lucide-react';

/**
 * Web Audio API Sound Synthesizer for muscle sliding filament biophysics
 */
class MolecularAudioSynth {
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

  playPowerStroke() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.12);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // Audio safety guard
    }
  }

  playAtpBinding() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.linearRampToValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Audio safety guard
    }
  }

  playCalciumSparkle() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const now = this.ctx.currentTime;
      [880, 1174.66, 1396.91].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.03);
        gain.gain.setValueAtTime(0.03, now + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.03);
        osc.stop(now + i * 0.03 + 0.09);
      });
    } catch {
      // Audio safety guard
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
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.04, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.16);
      });
    } catch {
      // Audio safety guard
    }
  }
}

const audioSynth = new MolecularAudioSynth();

// ============================================================================
// 5-STEP CROSS-BRIDGE CYCLE DATA DEFINITIONS
// ============================================================================
const CYCLE_STEPS = [
  {
    step: 1,
    id: 'relaxed',
    name: 'Resting Relaxed State',
    subTitle: 'Myosin cocked (ADP + Pi); Active sites blocked',
    caState: 'Low intracellular Ca²⁺; Sarcoplasmic Reticulum storage',
    myosinAngle: 90, // Cocked perpendicular
    isBound: false,
    tropomyosinPosition: 'covering', // Covering actin sites
    nucleotide: 'ADP + Pi',
    description:
      'In resting muscle, the myosin head has already hydrolyzed ATP into ADP and inorganic phosphate (Pi), remaining energized in a cocked 90° configuration. Tropomyosin protein ribbons physically block the binding sites on the actin thin filaments. With low sarcoplasmic Ca²⁺, cross-bridges cannot form.',
    keyTakeaway: 'High potential energy stored in myosin head; no physical actin-myosin contact.',
  },
  {
    step: 2,
    id: 'calcium_trigger',
    name: 'Calcium Influx & Unmasking',
    subTitle: 'Ca²⁺ binds to Troponin; Tropomyosin rolls away',
    caState: 'Action potential triggers SR Ca²⁺ release into sarcoplasm',
    myosinAngle: 90,
    isBound: false,
    tropomyosinPosition: 'shifted', // Rolled away
    nucleotide: 'ADP + Pi',
    description:
      'A nerve impulse (action potential) depolarizes the sarcolemma and travels down T-tubules, stimulating the sarcoplasmic reticulum to flood the sarcoplasm with Ca²⁺ ions. Calcium binds to Troponin C, inducing an allosteric conformational shift that pulls Tropomyosin off the active myosin-binding sites on actin.',
    keyTakeaway: 'Calcium is the molecular switch that uncovers actin binding sites.',
  },
  {
    step: 3,
    id: 'cross_bridge_formation',
    name: 'Cross-Bridge Attachment',
    subTitle: 'High-energy myosin head docks to exposed actin site',
    caState: 'Ca²⁺ remains bound to Troponin',
    myosinAngle: 90,
    isBound: true,
    tropomyosinPosition: 'shifted',
    nucleotide: 'ADP + Pi',
    description:
      'With active binding sites exposed, the energized cocked myosin head binds firmly to the adjacent actin monomer, establishing an actin-myosin cross-bridge. The head remains cocked at 90° with ADP and inorganic phosphate (Pi) still lodged in the catalytic ATPase cleft.',
    keyTakeaway: 'Direct physical cross-bridge connection formed between thick and thin filaments.',
  },
  {
    step: 4,
    id: 'power_stroke',
    name: 'The Power Stroke',
    subTitle: 'Myosin pivots 45° toward M-line; actin slides 10 nm',
    caState: 'Ca²⁺ bound; mechanical tension generated',
    myosinAngle: 45, // Pivots toward center
    isBound: true,
    tropomyosinPosition: 'shifted',
    nucleotide: 'Released (Empty cleft)',
    description:
      'Inorganic phosphate (Pi) is released, triggering the conformational power stroke! The myosin head flexes vigorously through a 45° angle toward the central M-line. This mechanical stroke pulls the thin actin filament approximately 10 nm inward. ADP is then released, leaving the cross-bridge locked in low-energy rigor state.',
    keyTakeaway: 'Tension generation! Filaments slide past one another; neither filament shortens!',
  },
  {
    step: 5,
    id: 'detachment_recovery',
    name: 'ATP Detachment & Recocking',
    subTitle: 'New ATP binds to detach head; ATPase recocks to 90°',
    caState: 'Ready for next stroke or Ca²⁺ reuptake into SR',
    myosinAngle: 90,
    isBound: false,
    tropomyosinPosition: 'shifted',
    nucleotide: 'ATP -> ADP + Pi',
    description:
      'A new ATP molecule binds to the myosin head, causing an immediate allosteric change that breaks the actin-myosin bond (cross-bridge detaches). The intrinsic myosin ATPase hydrolyzes ATP into ADP + Pi, and the released chemical energy recocks the head back to 90°, ready for the subsequent stroke cycle.',
    keyTakeaway: 'ATP is required for DETACHMENT, not contraction! (Lack of ATP causes Rigor Mortis).',
  },
];

// ============================================================================
// KCSE EXAM QUESTIONS FOR SLIDING FILAMENT MECHANISM
// ============================================================================
const KCSE_QUESTIONS = [
  {
    id: 'q1',
    title: 'KCSE Biology Paper 1: Band Behavior During Contraction',
    prompt:
      'During the contraction of a skeletal muscle sarcomere, what happens to the lengths of the A-band, I-band, and H-zone respectively?',
    options: [
      {
        id: 'A',
        text: 'A-band remains constant; I-band narrows; H-zone narrows and disappears.',
        correct: true,
      },
      {
        id: 'B',
        text: 'A-band shortens; I-band remains constant; H-zone widens.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Both A-band and I-band shorten equally; H-zone remains constant.',
        correct: false,
      },
      {
        id: 'D',
        text: 'All bands shorten uniformly because both actin and myosin filaments contract.',
        correct: false,
      },
    ],
    explanation:
      'The A-band corresponds to the entire length of the myosin thick filaments, which DO NOT change length during contraction. The I-band narrows because actin filaments slide deeper into the A-band. The central H-zone narrows and completely disappears at maximum contraction as thin filaments meet or overlap at the M-line.',
  },
  {
    id: 'q2',
    title: 'KCSE Biology Paper 2: Critical Filament Misconception',
    prompt:
      'Which of the following statements correctly describes what occurs to the protein filaments during sarcomere shortening?',
    options: [
      {
        id: 'A',
        text: 'Actin and myosin filaments do NOT shorten; they slide past one another, increasing their degree of overlap.',
        correct: true,
      },
      {
        id: 'B',
        text: 'Actin filaments coil and condense like springs while myosin filaments remain stationary.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Myosin heads dissolve the ends of actin filaments to pull Z-discs closer together.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Myosin thick filaments shorten by 35% through enzymatic folding of heavy chains.',
        correct: false,
      },
    ],
    explanation:
      'A fundamental KCSE concept: Neither actin thin filaments nor myosin thick filaments change in physical length during contraction! Instead, thin filaments are pulled along thick filaments toward the M-line by pivoting cross-bridges (the sliding filament model proposed by Huxley).',
  },
  {
    id: 'q3',
    title: 'KCSE Biology: Role of Calcium Ions (Ca²⁺)',
    prompt:
      'What specific biochemical event is initiated when calcium ions (Ca²⁺) are released from the sarcoplasmic reticulum into the sarcoplasm?',
    options: [
      {
        id: 'A',
        text: 'Ca²⁺ binds directly to the active site of myosin ATPase to synthesize new ATP.',
        correct: false,
      },
      {
        id: 'B',
        text: 'Ca²⁺ binds to Troponin, causing a conformational shift that pulls Tropomyosin away from actin active binding sites.',
        correct: true,
      },
      {
        id: 'C',
        text: 'Ca²⁺ dissolves the Z-disc boundary to allow unrestrained sliding of myofibrils.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Ca²⁺ neutralizes lactic acid to prevent muscle fatigue during aerobic respiration.',
        correct: false,
      },
    ],
    explanation:
      'Troponin acts as a calcium sensor. Binding of Ca²⁺ to Troponin C induces a shape change in the troponin-tropomyosin complex, rolling tropomyosin away from the active binding sites on actin G-subunits, permitting myosin cross-bridge attachment.',
  },
  {
    id: 'q4',
    title: 'KCSE Biology Paper 2: Pathology of Rigor Mortis',
    prompt:
      'Several hours after biological death, skeletal muscles enter a state of severe stiffness known as Rigor Mortis. What molecular mechanism accounts for this phenomenon?',
    options: [
      {
        id: 'A',
        text: 'Accumulation of excessive ATP forces all myosin heads into continuous rapid power strokes.',
        correct: false,
      },
      {
        id: 'B',
        text: 'Depletion of cellular ATP prevents myosin heads from detaching from actin, leaving cross-bridges permanently locked.',
        correct: true,
      },
      {
        id: 'C',
        text: 'Rapid calcification turns the synovial fluid and sarcolemma into rigid hydroxyapatite bone.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Motor neurons continuously fire random acetylcholine pulses until blood pressure falls.',
        correct: false,
      },
    ],
    explanation:
      'ATP is strictly required to BREAK the cross-bridge bond between myosin and actin (step 5). After death, cellular respiration stops and ATP is rapidly depleted. Without ATP binding to the myosin head, the cross-bridge cannot detach, locking muscles in rigid contraction (Rigor Mortis) until autolysis begins.',
  },
  {
    id: 'q5',
    title: 'KCSE Biology Paper 1: Cross-Bridge Energy Coupling',
    prompt:
      'During which specific phase of the cross-bridge cycle is mechanical work performed to pull the thin filament toward the center of the sarcomere?',
    options: [
      {
        id: 'A',
        text: 'During the Power Stroke, as inorganic phosphate (Pi) and ADP are released and the head pivots 45°.',
        correct: true,
      },
      {
        id: 'B',
        text: 'During ATP binding, which forces the myosin head to push actin outward toward the sarcolemma.',
        correct: false,
      },
      {
        id: 'C',
        text: 'During calcium reuptake by the active transport pumps in the sarcoplasmic reticulum.',
        correct: false,
      },
      {
        id: 'D',
        text: 'During the hydrolysis of ATP before attachment has occurred.',
        correct: false,
      },
    ],
    explanation:
      'The actual mechanical tension (power stroke) occurs when the cocked myosin head pivots 45° toward the M-line, dragging the actin filament with it. This pivoting action is triggered by the release of inorganic phosphate (Pi) from the ATPase catalytic site.',
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function SlidingFilamentMechanismSim({ config = {}, onTelemetry }) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'misconceptions' | 'cycle_guide' | 'quiz' | 'challenges'

  // View modes
  const [viewMode, setViewMode] = useState('both'); // 'both' | 'macro' | 'micro'

  // Contraction slider: 0% = relaxed (2.5 µm), 100% = fully contracted (1.8 µm)
  const [contractionPercent, setContractionPercent] = useState(0);

  // 5-Step Cross-bridge cycle state
  const [cycleStep, setCycleStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1); // 0.5x, 1x, 1.5x

  // Molecular factor toggles
  const [hasCalcium, setHasCalcium] = useState(true);
  const [hasATP, setHasATP] = useState(true);

  // Audio and display toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showBands, setShowBands] = useState(true);

  // Modals & alerts
  const [rigorModalOpen, setRigorModalOpen] = useState(false);

  // Challenge tracking
  const [challenges, setChallenges] = useState({
    fullCycleDone: false,
    rigorTested: false,
    calciumBlocked: false,
    constantABandVerified: false,
  });

  // Quiz state
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  // ============================================================================
  // DERIVED SARCOMERE BIOMETRICS & DIMENSIONS (KCSE EXACT SCALE)
  // ============================================================================
  const biometrics = useMemo(() => {
    const progress = contractionPercent / 100; // 0 to 1

    // Sarcomere Length: 2.50 µm down to 1.80 µm (Shortens by 0.70 µm)
    const sarcomereLengthUm = Number((2.5 - 0.7 * progress).toFixed(2));

    // A-band width: STRICTLY CONSTANT at 1.50 µm (entire length of myosin)
    const aBandWidthUm = 1.5;

    // Actin filament length: STRICTLY CONSTANT at 1.00 µm each
    const actinLengthUm = 1.0;

    // Myosin filament length: STRICTLY CONSTANT at 1.50 µm
    const myosinLengthUm = 1.5;

    // H-Zone width: 0.50 µm relaxed -> 0.00 µm contracted (central non-overlap region)
    const hZoneWidthUm = Number(Math.max(0, 0.5 - 0.5 * progress).toFixed(2));

    // I-Band width: 0.80 µm relaxed -> 0.10 µm contracted (region containing only actin)
    const iBandWidthUm = Number(Math.max(0.1, 0.8 - 0.7 * progress).toFixed(2));

    // Zone of overlap between actin and myosin (each side): 0.50 µm -> 0.75 µm
    const overlapPerSideUm = Number((0.5 + 0.25 * progress).toFixed(2));

    // Percentage change metrics
    const sarcomereShorteningPct = Math.round(((2.5 - sarcomereLengthUm) / 2.5) * 100);

    return {
      sarcomereLengthUm,
      aBandWidthUm,
      actinLengthUm,
      myosinLengthUm,
      hZoneWidthUm,
      iBandWidthUm,
      overlapPerSideUm,
      sarcomereShorteningPct,
    };
  }, [contractionPercent]);

  // Current step details
  const currentStepData = useMemo(() => {
    return CYCLE_STEPS.find((s) => s.step === cycleStep) || CYCLE_STEPS[0];
  }, [cycleStep]);

  // Determine actual molecular state considering Calcium and ATP overrides
  const molecularState = useMemo(() => {
    // If ATP is depleted, cross-bridge is locked if at step 3, 4, or 5
    const isRigorLocked = !hasATP && cycleStep >= 3;

    // If calcium is absent, actin binding sites are covered regardless of step
    const effectiveTropomyosin = hasCalcium ? currentStepData.tropomyosinPosition : 'covering';

    // Cross-bridge can only attach if active sites are uncovered AND Ca is present
    const canFormCrossBridge = hasCalcium && hasATP && (cycleStep === 3 || cycleStep === 4);

    return {
      isRigorLocked,
      effectiveTropomyosin,
      canFormCrossBridge,
    };
  }, [cycleStep, hasCalcium, hasATP, currentStepData]);

  // Auto-play interval for cross-bridge cycle
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.round(1800 / playSpeed);
    const timer = setInterval(() => {
      // Check for Rigor Mortis freeze
      if (!hasATP && cycleStep >= 3) {
        setIsPlaying(false);
        setRigorModalOpen(true);
        if (soundEnabled) audioSynth.playPowerStroke();
        return;
      }

      setCycleStep((prev) => {
        const next = prev >= 5 ? 1 : prev + 1;

        // Synchronize contraction slider with power stroke
        if (next === 4) {
          // Power stroke only triggers contraction advancement when Ca2+ is present and ATP is available
          if (hasCalcium && hasATP) {
            setContractionPercent((cp) => Math.min(100, cp + 25));
            if (soundEnabled) audioSynth.playPowerStroke();
          }
        } else if (next === 2) {
          if (soundEnabled && hasCalcium) audioSynth.playCalciumSparkle();
        } else if (next === 5) {
          if (soundEnabled && hasATP) audioSynth.playAtpBinding();
        }

        // Check full cycle challenge
        if (next === 5) {
          setChallenges((ch) => {
            if (!ch.fullCycleDone) {
              if (onTelemetry) {
                onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
                  simulation: 'muscle_sliding_filament_mechanism',
                  checkpoint: 'cross_bridge_cycle_completed',
                });
              }
              return { ...ch, fullCycleDone: true };
            }
            return ch;
          });
        }

        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playSpeed, hasATP, cycleStep, soundEnabled, onTelemetry]);

  // Telemetry for Rigor Mortis testing
  const handleToggleATP = () => {
    const nextVal = !hasATP;
    setHasATP(nextVal);
    if (!nextVal && cycleStep >= 3) {
      setRigorModalOpen(true);
      setChallenges((ch) => {
        if (!ch.rigorTested) {
          if (onTelemetry) {
            onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
              simulation: 'muscle_sliding_filament_mechanism',
              checkpoint: 'rigor_mortis_investigated',
            });
          }
          return { ...ch, rigorTested: true };
        }
        return ch;
      });
    }
  };

  // Telemetry for Calcium blocking
  const handleToggleCalcium = () => {
    const nextVal = !hasCalcium;
    setHasCalcium(nextVal);
    if (!nextVal) {
      setChallenges((ch) => {
        if (!ch.calciumBlocked) {
          if (onTelemetry) {
            onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
              simulation: 'muscle_sliding_filament_mechanism',
              checkpoint: 'calcium_deprivation_tested',
            });
          }
          return { ...ch, calciumBlocked: true };
        }
        return ch;
      });
    }
  };

  // Check constant A-band challenge
  const handleContractionSliderChange = (e) => {
    const val = Number(e.target.value);
    setContractionPercent(val);
    if (val >= 90) {
      setChallenges((ch) => {
        if (!ch.constantABandVerified) {
          if (onTelemetry) {
            onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
              simulation: 'muscle_sliding_filament_mechanism',
              checkpoint: 'constant_a_band_verified',
            });
          }
          return { ...ch, constantABandVerified: true };
        }
        return ch;
      });
    }
  };

  // Step advancement buttons
  const handleNextStep = () => {
    if (!hasATP && cycleStep >= 3) {
      setRigorModalOpen(true);
      return;
    }
    const next = cycleStep >= 5 ? 1 : cycleStep + 1;
    setCycleStep(next);
    if (next === 4) {
      if (hasCalcium && hasATP) {
        setContractionPercent((prev) => Math.min(100, prev + 25));
        if (soundEnabled) audioSynth.playPowerStroke();
      }
    } else if (next === 2 && soundEnabled && hasCalcium) {
      audioSynth.playCalciumSparkle();
    } else if (next === 5 && soundEnabled && hasATP) {
      audioSynth.playAtpBinding();
    }
    if (next === 5) {
      setChallenges((ch) => ({ ...ch, fullCycleDone: true }));
    }
  };

  const handlePrevStep = () => {
    if (!hasATP && cycleStep >= 3) {
      setRigorModalOpen(true);
      return;
    }
    setCycleStep((prev) => (prev <= 1 ? 5 : prev - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setContractionPercent(0);
    setCycleStep(1);
    setHasCalcium(true);
    setHasATP(true);
    setRigorModalOpen(false);
    if (soundEnabled) audioSynth.playAtpBinding();
  };

  // Quiz submission
  const handleSelectQuizAnswer = (qId, optId) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    KCSE_QUESTIONS.forEach((q) => {
      const selected = userAnswers[q.id];
      const correctOpt = q.options.find((o) => o.correct);
      if (selected === correctOpt.id) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (soundEnabled) audioSynth.playSuccess();
    if (onTelemetry) {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'muscle_sliding_filament_mechanism',
        checkpoint: 'kcse_quiz_completed',
        score,
        total: KCSE_QUESTIONS.length,
      });
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setActiveQuestionIdx(0);
  };

  // ============================================================================
  // SVG RENDERING MATH & COORDINATES (HIGH-PRECISION SARCOMERE)
  // ============================================================================
  // SVG ViewBox: 840 x 300
  // Sarcomere center M-line at X = 420
  // Myosin thick filaments: Constant width = 420 px (X: 210 to 630)
  // Actin thin filaments: Constant length = 280 px each
  const svgMetrics = useMemo(() => {
    const progress = contractionPercent / 100;

    // Half sarcomere span in SVG coordinates:
    // Relaxed (2.5 µm): halfSpan = 350 px (Left Z = 70, Right Z = 770, Span = 700 px)
    // Contracted (1.8 µm): halfSpan = 252 px (Left Z = 168, Right Z = 672, Span = 504 px)
    const halfSpan = 350 - 98 * progress;
    const zLeft = 420 - halfSpan;
    const zRight = 420 + halfSpan;

    // Myosin thick filament is fixed at center
    // Width = 420 px -> from X = 210 to X = 630 (1.5 µm constant!)
    const myosinLeft = 210;
    const myosinRight = 630;
    const myosinWidth = 420;

    // Actin thin filaments attached to Z-discs, extending inward
    // Length = 280 px (1.0 µm constant!)
    const actinLengthPx = 280;
    const actinLeftTip = zLeft + actinLengthPx;
    const actinRightTip = zRight - actinLengthPx;

    // H-Zone is gap between left actin tip and right actin tip
    const hZoneGap = Math.max(0, actinRightTip - actinLeftTip);

    // I-Bands (regions with only actin thin filaments, flanking the A-band)
    const iBandLeftWidth = Math.max(0, myosinLeft - zLeft);
    const iBandRightWidth = Math.max(0, zRight - myosinRight);

    // Myosin head angle: 90° resting cocked, 45° in power stroke (step 4)
    const headPivot = cycleStep === 4 ? 45 : 90;

    return {
      zLeft,
      zRight,
      myosinLeft,
      myosinRight,
      myosinWidth,
      actinLengthPx,
      actinLeftTip,
      actinRightTip,
      hZoneGap,
      iBandLeftWidth,
      iBandRightWidth,
      headPivot,
    };
  }, [contractionPercent, cycleStep]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 text-slate-100 font-sans space-y-6">
      {/* ==================================================================== */}
      {/* HEADER & TOP STATUS BAR */}
      {/* ==================================================================== */}
      <header className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Form 4 Biology • Topic 4: Support & Movement
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Simulation 12
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Activity className="w-7 h-7 text-sky-400" />
              Muscle Contraction: Sliding Filament Mechanism
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Interactive molecular sarcomere model proving that actin and myosin filaments do not shorten, but slide past one another.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-sky-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              Reset Sarcomere
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-800/80">
          {[
            { id: 'simulation', label: 'Interactive Sarcomere Lab', icon: Sliders },
            { id: 'misconceptions', label: 'KCSE Misconception Buster', icon: ShieldAlert },
            { id: 'cycle_guide', label: '5-Step Cross-Bridge Cycle', icon: BookOpen },
            { id: 'quiz', label: 'KCSE Exam Mastery Quiz', icon: Award },
            { id: 'challenges', label: 'Lab Challenges', icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 border border-sky-400/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ==================================================================== */}
      {/* REAL-TIME DIMENSIONAL CALLOUT BAR (CRITICAL KCSE METRICS) */}
      {/* ==================================================================== */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Sarcomere Length */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
          <div className="text-xs font-semibold uppercase text-purple-400 tracking-wider flex items-center justify-between">
            <span>Sarcomere (Z-Z)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">Shortens</span>
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {biometrics.sarcomereLengthUm} <span className="text-xs font-normal text-slate-400">µm</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            2.50 µm → 1.80 µm ({biometrics.sarcomereShorteningPct}% reduced)
          </div>
        </div>

        {/* A-Band Width (CONSTANT!) */}
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-3 relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 opacity-10">
            <Lock className="w-16 h-16 text-rose-400" />
          </div>
          <div className="text-xs font-semibold uppercase text-rose-400 tracking-wider flex items-center justify-between">
            <span>A-Band (Dark)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-200 font-bold border border-rose-500/40">
              CONSTANT!
            </span>
          </div>
          <div className="text-2xl font-black text-rose-300 mt-1">
            {biometrics.aBandWidthUm.toFixed(2)} <span className="text-xs font-normal text-slate-400">µm</span>
          </div>
          <div className="text-[11px] text-rose-400/90 font-medium mt-0.5">
            100% Constant (Length of Myosin)
          </div>
        </div>

        {/* I-Band Width */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
          <div className="text-xs font-semibold uppercase text-sky-400 tracking-wider flex items-center justify-between">
            <span>I-Band (Light)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300">Narrows</span>
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {biometrics.iBandWidthUm.toFixed(2)} <span className="text-xs font-normal text-slate-400">µm</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            0.80 µm → 0.10 µm (Narrows)
          </div>
        </div>

        {/* H-Zone Width */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
          <div className="text-xs font-semibold uppercase text-amber-400 tracking-wider flex items-center justify-between">
            <span>H-Zone (Center)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
              {biometrics.hZoneWidthUm === 0 ? 'Disappears' : 'Narrows'}
            </span>
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {biometrics.hZoneWidthUm.toFixed(2)} <span className="text-xs font-normal text-slate-400">µm</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            0.50 µm → 0.00 µm (Disappears)
          </div>
        </div>

        {/* Actin Thin Filament Length */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
          <div className="text-xs font-semibold uppercase text-sky-300 tracking-wider flex items-center justify-between">
            <span>Actin Filament</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">Fixed</span>
          </div>
          <div className="text-2xl font-black text-sky-200 mt-1">
            {biometrics.actinLengthUm.toFixed(2)} <span className="text-xs font-normal text-slate-400">µm</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            DOES NOT Shorten!
          </div>
        </div>

        {/* Myosin Thick Filament Length */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
          <div className="text-xs font-semibold uppercase text-rose-300 tracking-wider flex items-center justify-between">
            <span>Myosin Filament</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">Fixed</span>
          </div>
          <div className="text-2xl font-black text-rose-200 mt-1">
            {biometrics.myosinLengthUm.toFixed(2)} <span className="text-xs font-normal text-slate-400">µm</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            DOES NOT Shorten!
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* RIGOR MORTIS ALERT BANNER */}
      {/* ==================================================================== */}
      {!hasATP && (
        <div className="bg-amber-950/70 border-2 border-amber-500/80 rounded-2xl p-4 flex items-start gap-3.5 shadow-xl animate-pulse">
          <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-base font-bold text-amber-200 flex items-center gap-2">
              ⚠️ RIGOR MORTIS STATE ACTIVE: ATP Depleted!
            </h2>
            <p className="text-amber-300/90 text-sm mt-0.5 leading-relaxed">
              Without available ATP, the myosin head CANNOT detach from the actin active binding site (Step 5 blocked).
              The cross-bridge remains permanently locked in rigid state. In human biology, this occurs 2–6 hours post-mortem,
              locking skeletal muscles until lysosomal enzymes degrade the proteins.
            </p>
          </div>
        </div>
      )}

      {/* Calcium absent warning */}
      {!hasCalcium && (
        <div className="bg-blue-950/70 border border-blue-500/50 rounded-2xl p-3.5 flex items-center gap-3 text-sm text-blue-200">
          <Info className="w-5 h-5 text-blue-400 shrink-0" />
          <span>
            <strong>Calcium Depleted (Ca²⁺ Absent):</strong> Troponin returns to resting conformation. Tropomyosin physically covers all actin active binding sites. Cross-bridges cannot attach, causing muscle relaxation.
          </span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 1: INTERACTIVE SARCOMERE LAB */}
      {/* ==================================================================== */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          {/* Main Simulation Viewport Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
            {/* Viewport Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              {/* View Selector */}
              <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
                <button
                  onClick={() => setViewMode('both')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'both' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Split View (Macro + Micro)
                </button>
                <button
                  onClick={() => setViewMode('macro')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'macro' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sarcomere Ultrastructure (Macro)
                </button>
                <button
                  onClick={() => setViewMode('micro')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'micro' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cross-Bridge Zoom-In (Micro)
                </button>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBands}
                    onChange={(e) => setShowBands(e.target.checked)}
                    className="rounded border-slate-700 text-sky-500 focus:ring-0"
                  />
                  <span>Show Band Callouts</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="rounded border-slate-700 text-sky-500 focus:ring-0"
                  />
                  <span>Protein Labels</span>
                </label>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* VIEW A: SARCOMERE ULTRASTRUCTURE (MACRO LONGITUDINAL SECTION) */}
            {/* -------------------------------------------------------------- */}
            {(viewMode === 'both' || viewMode === 'macro') && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    Sarcomere Ultrastructure (Z-Disc to Z-Disc Longitudinal View)
                  </h2>
                  <span className="text-xs text-slate-400">
                    Contraction: <strong className="text-sky-400">{contractionPercent}%</strong> • Length: <strong className="text-purple-300">{biometrics.sarcomereLengthUm} µm</strong>
                  </span>
                </div>

                <div className="w-full bg-[#080d1a] rounded-2xl border border-slate-800 p-2 overflow-x-auto shadow-inner">
                  <svg
                    viewBox="0 0 840 280"
                    className="w-full h-auto select-none"
                    style={{ minWidth: '700px' }}
                  >
                    <defs>
                      {/* Gradient for Actin Thin Filaments */}
                      <linearGradient id="actinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0284c7" />
                        <stop offset="50%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#7dd3fc" />
                      </linearGradient>

                      {/* Gradient for Myosin Thick Filaments */}
                      <linearGradient id="myosinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#be123c" />
                        <stop offset="50%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#be123c" />
                      </linearGradient>

                      {/* Z-Disc Pattern */}
                      <linearGradient id="zDiscGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#9333ea" />
                        <stop offset="50%" stopColor="#c084fc" />
                        <stop offset="100%" stopColor="#7e22ce" />
                      </linearGradient>

                      {/* Glow filter */}
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Background Grid Lines */}
                    <g opacity="0.1">
                      {[40, 80, 120, 160, 200, 240].map((y) => (
                        <line key={y} x1="20" y1={y} x2="820" y2={y} stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
                      ))}
                    </g>

                    {/* Central M-Line Marker */}
                    <line
                      x1="420"
                      y1="35"
                      x2="420"
                      y2="225"
                      stroke="#ec4899"
                      strokeWidth="3"
                      strokeDasharray="5 3"
                    />
                    <text x="420" y="28" fill="#f472b6" fontSize="11" fontWeight="bold" textAnchor="middle">
                      M-Line
                    </text>

                    {/* ============================================================== */}
                    {/* BANDS & ZONES BRACKETS OVERLAY */}
                    {/* ============================================================== */}
                    {showBands && (
                      <g className="bands-layer">
                        {/* Sarcomere Length Bracket (Top) */}
                        <g transform="translate(0, 10)">
                          <line x1={svgMetrics.zLeft} y1="0" x2={svgMetrics.zRight} y2="0" stroke="#c084fc" strokeWidth="2" />
                          <line x1={svgMetrics.zLeft} y1="-5" x2={svgMetrics.zLeft} y2="5" stroke="#c084fc" strokeWidth="2" />
                          <line x1={svgMetrics.zRight} y1="-5" x2={svgMetrics.zRight} y2="5" stroke="#c084fc" strokeWidth="2" />
                          <rect
                            x="360"
                            y="-9"
                            width="120"
                            height="18"
                            rx="4"
                            fill="#1e1b4b"
                            stroke="#818cf8"
                            strokeWidth="1"
                          />
                          <text x="420" y="4" fill="#e0e7ff" fontSize="10" fontWeight="bold" textAnchor="middle">
                            Sarcomere: {biometrics.sarcomereLengthUm} µm
                          </text>
                        </g>

                        {/* A-Band Bracket (Constant width 1.5 µm = 420 px) */}
                        <g transform="translate(0, 242)">
                          <line x1="210" y1="0" x2="630" y2="0" stroke="#f43f5e" strokeWidth="2" />
                          <line x1="210" y1="-5" x2="210" y2="5" stroke="#f43f5e" strokeWidth="2" />
                          <line x1="630" y1="-5" x2="630" y2="5" stroke="#f43f5e" strokeWidth="2" />
                          <rect
                            x="340"
                            y="-9"
                            width="160"
                            height="18"
                            rx="4"
                            fill="#4c0519"
                            stroke="#f43f5e"
                            strokeWidth="1"
                          />
                          <text x="420" y="4" fill="#fecdd3" fontSize="10" fontWeight="bold" textAnchor="middle">
                            A-Band: 1.50 µm (CONSTANT)
                          </text>
                        </g>

                        {/* I-Band Bracket Left */}
                        <g transform="translate(0, 264)">
                          <line x1={svgMetrics.zLeft} y1="0" x2="210" y2="0" stroke="#38bdf8" strokeWidth="1.5" />
                          <line x1={svgMetrics.zLeft} y1="-4" x2={svgMetrics.zLeft} y2="4" stroke="#38bdf8" strokeWidth="1.5" />
                          <line x1="210" y1="-4" x2="210" y2="4" stroke="#38bdf8" strokeWidth="1.5" />
                          <text x={(svgMetrics.zLeft + 210) / 2} y="3" fill="#7dd3fc" fontSize="9" fontWeight="bold" textAnchor="middle">
                            I-Band ({biometrics.iBandWidthUm} µm)
                          </text>
                        </g>

                        {/* I-Band Bracket Right */}
                        <g transform="translate(0, 264)">
                          <line x1="630" y1="0" x2={svgMetrics.zRight} y2="0" stroke="#38bdf8" strokeWidth="1.5" />
                          <line x1="630" y1="-4" x2="630" y2="4" stroke="#38bdf8" strokeWidth="1.5" />
                          <line x1={svgMetrics.zRight} y1="-4" x2={svgMetrics.zRight} y2="4" stroke="#38bdf8" strokeWidth="1.5" />
                          <text x={(630 + svgMetrics.zRight) / 2} y="3" fill="#7dd3fc" fontSize="9" fontWeight="bold" textAnchor="middle">
                            I-Band ({biometrics.iBandWidthUm} µm)
                          </text>
                        </g>

                        {/* H-Zone Bracket (Center gap) */}
                        {svgMetrics.hZoneGap > 10 && (
                          <g transform="translate(0, 222)">
                            <line x1={svgMetrics.actinLeftTip} y1="0" x2={svgMetrics.actinRightTip} y2="0" stroke="#fbbf24" strokeWidth="1.5" />
                            <line x1={svgMetrics.actinLeftTip} y1="-3" x2={svgMetrics.actinLeftTip} y2="3" stroke="#fbbf24" strokeWidth="1.5" />
                            <line x1={svgMetrics.actinRightTip} y1="-3" x2={svgMetrics.actinRightTip} y2="3" stroke="#fbbf24" strokeWidth="1.5" />
                            <text x="420" y="-4" fill="#fde68a" fontSize="9" fontWeight="bold" textAnchor="middle">
                              H-Zone ({biometrics.hZoneWidthUm} µm)
                            </text>
                          </g>
                        )}
                      </g>
                    )}

                    {/* ============================================================== */}
                    {/* MYOSIN THICK FILAMENTS (RED BUNDLES AT CENTER) */}
                    {/* Positioned at Y = 85, Y = 135, Y = 185 */}
                    {/* ============================================================== */}
                    {[85, 135, 185].map((yPos, mIdx) => (
                      <g key={`myosin-bundle-${mIdx}`}>
                        {/* Main Thick Backbone (Width 420 px: 210 to 630) */}
                        <rect
                          x="210"
                          y={yPos - 6}
                          width="420"
                          height="12"
                          rx="5"
                          fill="url(#myosinGrad)"
                          stroke="#e11d48"
                          strokeWidth="1.5"
                        />

                        {/* Central bare zone (no heads near M-line) */}
                        <rect x="390" y={yPos - 6} width="60" height="12" fill="#be123c" opacity="0.6" />

                        {/* Left Myosin Heads (pointing toward left Z-disc; pull inward) */}
                        {[235, 265, 295, 325, 355].map((headX, hIdx) => {
                          const isPowerPivoting = cycleStep === 4;
                          const headAngle = isPowerPivoting ? 40 : 80;
                          const rad = (headAngle * Math.PI) / 180;
                          const armLen = 14;
                          // Upper head
                          const hxTop = headX + Math.cos(rad) * (isPowerPivoting ? 10 : 2);
                          const hyTop = yPos - 6 - Math.sin(rad) * armLen;
                          // Lower head
                          const hxBot = headX + Math.cos(rad) * (isPowerPivoting ? 10 : 2);
                          const hyBot = yPos + 6 + Math.sin(rad) * armLen;

                          return (
                            <g key={`left-heads-${mIdx}-${hIdx}`}>
                              {/* Upper Head */}
                              <line
                                x1={headX}
                                y1={yPos - 6}
                                x2={hxTop}
                                y2={hyTop}
                                stroke="#f43f5e"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                              <ellipse
                                cx={hxTop}
                                cy={hyTop}
                                rx="5.5"
                                ry="3.5"
                                fill={cycleStep >= 3 && hasCalcium && hasATP ? '#fb7185' : '#e11d48'}
                                stroke="#ffe4e6"
                                strokeWidth="1"
                                transform={`rotate(${isPowerPivoting ? -35 : -10}, ${hxTop}, ${hyTop})`}
                              />

                              {/* Lower Head */}
                              <line
                                x1={headX}
                                y1={yPos + 6}
                                x2={hxBot}
                                y2={hyBot}
                                stroke="#f43f5e"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                              <ellipse
                                cx={hxBot}
                                cy={hyBot}
                                rx="5.5"
                                ry="3.5"
                                fill={cycleStep >= 3 && hasCalcium && hasATP ? '#fb7185' : '#e11d48'}
                                stroke="#ffe4e6"
                                strokeWidth="1"
                                transform={`rotate(${isPowerPivoting ? 35 : 10}, ${hxBot}, ${hyBot})`}
                              />
                            </g>
                          );
                        })}

                        {/* Right Myosin Heads (pointing toward right Z-disc; pull inward) */}
                        {[485, 515, 545, 575, 605].map((headX, hIdx) => {
                          const isPowerPivoting = cycleStep === 4;
                          const headAngle = isPowerPivoting ? 40 : 80;
                          const rad = (headAngle * Math.PI) / 180;
                          const armLen = 14;
                          // Upper head (pivots toward center / leftward)
                          const hxTop = headX - Math.cos(rad) * (isPowerPivoting ? 10 : 2);
                          const hyTop = yPos - 6 - Math.sin(rad) * armLen;
                          // Lower head
                          const hxBot = headX - Math.cos(rad) * (isPowerPivoting ? 10 : 2);
                          const hyBot = yPos + 6 + Math.sin(rad) * armLen;

                          return (
                            <g key={`right-heads-${mIdx}-${hIdx}`}>
                              {/* Upper Head */}
                              <line
                                x1={headX}
                                y1={yPos - 6}
                                x2={hxTop}
                                y2={hyTop}
                                stroke="#f43f5e"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                              <ellipse
                                cx={hxTop}
                                cy={hyTop}
                                rx="5.5"
                                ry="3.5"
                                fill={cycleStep >= 3 && hasCalcium && hasATP ? '#fb7185' : '#e11d48'}
                                stroke="#ffe4e6"
                                strokeWidth="1"
                                transform={`rotate(${isPowerPivoting ? 35 : 10}, ${hxTop}, ${hyTop})`}
                              />

                              {/* Lower Head */}
                              <line
                                x1={headX}
                                y1={yPos + 6}
                                x2={hxBot}
                                y2={hyBot}
                                stroke="#f43f5e"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                              <ellipse
                                cx={hxBot}
                                cy={hyBot}
                                rx="5.5"
                                ry="3.5"
                                fill={cycleStep >= 3 && hasCalcium && hasATP ? '#fb7185' : '#e11d48'}
                                stroke="#ffe4e6"
                                strokeWidth="1"
                                transform={`rotate(${isPowerPivoting ? -35 : -10}, ${hxBot}, ${hyBot})`}
                              />
                            </g>
                          );
                        })}
                      </g>
                    ))}

                    {/* ============================================================== */}
                    {/* ACTIN THIN FILAMENTS (SKY BLUE DOUBLE HELICAL STRANDS) */}
                    {/* Interdigitated at Y = 60, Y = 110, Y = 160, Y = 210 */}
                    {/* ============================================================== */}
                    {[60, 110, 160, 210].map((yPos, aIdx) => (
                      <g key={`actin-filaments-${aIdx}`}>
                        {/* Left Actin (Attached to Left Z-Disc, length 280 px) */}
                        <g>
                          <rect
                            x={svgMetrics.zLeft}
                            y={yPos - 2.5}
                            width={svgMetrics.actinLengthPx}
                            height="5"
                            rx="2.5"
                            fill="url(#actinGrad)"
                            stroke="#0284c7"
                            strokeWidth="1"
                          />
                          {/* Troponin / Tropomyosin bead highlights */}
                          {Array.from({ length: 9 }).map((_, bIdx) => (
                            <circle
                              key={`left-bead-${bIdx}`}
                              cx={svgMetrics.zLeft + 25 + bIdx * 28}
                              cy={yPos}
                              r="2.5"
                              fill={hasCalcium ? '#10b981' : '#f59e0b'}
                            />
                          ))}
                        </g>

                        {/* Right Actin (Attached to Right Z-Disc, length 280 px) */}
                        <g>
                          <rect
                            x={svgMetrics.zRight - svgMetrics.actinLengthPx}
                            y={yPos - 2.5}
                            width={svgMetrics.actinLengthPx}
                            height="5"
                            rx="2.5"
                            fill="url(#actinGrad)"
                            stroke="#0284c7"
                            strokeWidth="1"
                          />
                          {/* Troponin / Tropomyosin bead highlights */}
                          {Array.from({ length: 9 }).map((_, bIdx) => (
                            <circle
                              key={`right-bead-${bIdx}`}
                              cx={svgMetrics.zRight - 25 - bIdx * 28}
                              cy={yPos}
                              r="2.5"
                              fill={hasCalcium ? '#10b981' : '#f59e0b'}
                            />
                          ))}
                        </g>
                      </g>
                    ))}

                    {/* ============================================================== */}
                    {/* Z-DISCS (ZIG-ZAG PROTEIN WALL BOUNDARIES) */}
                    {/* ============================================================== */}
                    {/* Left Z-Disc */}
                    <g transform={`translate(${svgMetrics.zLeft}, 0)`}>
                      <path
                        d="M 0 40 L -6 60 L 6 80 L -6 100 L 6 120 L -6 140 L 6 160 L -6 180 L 6 200 L -6 220 L 0 230"
                        stroke="url(#zDiscGrad)"
                        strokeWidth="5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fill="none"
                        filter="url(#glow)"
                      />
                      <text x="0" y="32" fill="#c084fc" fontSize="11" fontWeight="bold" textAnchor="middle">
                        Z-Line
                      </text>
                    </g>

                    {/* Right Z-Disc */}
                    <g transform={`translate(${svgMetrics.zRight}, 0)`}>
                      <path
                        d="M 0 40 L -6 60 L 6 80 L -6 100 L 6 120 L -6 140 L 6 160 L -6 180 L 6 200 L -6 220 L 0 230"
                        stroke="url(#zDiscGrad)"
                        strokeWidth="5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fill="none"
                        filter="url(#glow)"
                      />
                      <text x="0" y="32" fill="#c084fc" fontSize="11" fontWeight="bold" textAnchor="middle">
                        Z-Line
                      </text>
                    </g>

                    {/* Labels Callouts */}
                    {showLabels && (
                      <g className="labels-layer" opacity="0.85">
                        <text x={svgMetrics.zLeft + 40} y="52" fill="#38bdf8" fontSize="10" fontWeight="600">
                          Actin Thin Filament (#38BDF8)
                        </text>
                        <text x="215" y="80" fill="#f43f5e" fontSize="10" fontWeight="600">
                          Myosin Thick Filament (#F43F5E)
                        </text>
                      </g>
                    )}
                  </svg>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* VIEW B: MOLECULAR CROSS-BRIDGE ZOOM-IN (ATOMIC DETAIL) */}
            {/* -------------------------------------------------------------- */}
            {(viewMode === 'both' || viewMode === 'micro') && (
              <div className="bg-[#050914] rounded-2xl border border-slate-800 p-4 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                      Molecular Cross-Bridge Zoom-In: Single Myosin Head & Actin Interaction
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                      State: <strong className="text-emerald-400">{currentStepData.name}</strong>
                    </span>
                  </div>
                </div>

                {/* SVG Atomic Diagram */}
                <div className="w-full overflow-x-auto">
                  <svg
                    viewBox="0 0 800 240"
                    className="w-full h-auto select-none"
                    style={{ minWidth: '650px' }}
                  >
                    <defs>
                      <linearGradient id="gActinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7dd3fc" />
                        <stop offset="60%" stopColor="#0284c7" />
                        <stop offset="100%" stopColor="#0369a1" />
                      </linearGradient>
                      <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fb7185" />
                        <stop offset="60%" stopColor="#e11d48" />
                        <stop offset="100%" stopColor="#9f1239" />
                      </linearGradient>
                      <radialGradient id="caGrad" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="40%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#a16207" />
                      </radialGradient>
                    </defs>

                    {/* TOP SECTION: ACTIN FILAMENT (DOUBLE HELIX WITH G-ACTIN MONOMERS) */}
                    <g transform="translate(0, 40)">
                      {/* Actin Monomers Chain 1 */}
                      {Array.from({ length: 16 }).map((_, i) => {
                        const x = 50 + i * 44;
                        const isBindingSiteActive = i % 2 === 0;
                        const isExposed = molecularState.effectiveTropomyosin === 'shifted';
                        return (
                          <g key={`actin-monomer-${i}`}>
                            {/* G-Actin Globular Subunit */}
                            <circle
                              cx={x}
                              cy="30"
                              r="18"
                              fill="url(#gActinGrad)"
                              stroke="#38bdf8"
                              strokeWidth="1.5"
                            />
                            {/* Active Myosin Binding Pocket */}
                            {isBindingSiteActive && (
                              <circle
                                cx={x}
                                cy="38"
                                r="4"
                                fill={isExposed ? '#fde047' : '#94a3b8'}
                                stroke={isExposed ? '#ca8a04' : '#475569'}
                                strokeWidth="1"
                              />
                            )}
                          </g>
                        );
                      })}

                      {/* Tropomyosin Ribbon (Amber Cable Covering or Shifted Aside) */}
                      <path
                        d={
                          molecularState.effectiveTropomyosin === 'shifted'
                            ? 'M 40 18 Q 200 12, 400 18 T 760 18' // Shifted upward away from sites
                            : 'M 40 38 Q 200 36, 400 38 T 760 38' // Directly covering active sites
                        }
                        stroke="#f59e0b"
                        strokeWidth="6"
                        strokeLinecap="round"
                        fill="none"
                        filter="drop-shadow(0 2px 3px rgba(0,0,0,0.5))"
                        className="transition-all duration-500 ease-in-out"
                      />

                      {/* Troponin Regulatory Complexes with Ca2+ Binding Sites */}
                      {[160, 360, 560].map((tropX, idx) => (
                        <g key={`troponin-${idx}`} transform={`translate(${tropX}, ${molecularState.effectiveTropomyosin === 'shifted' ? 12 : 32})`}>
                          {/* Troponin T, I, C Subunits */}
                          <ellipse cx="-8" cy="0" rx="9" ry="7" fill="#10b981" stroke="#047857" strokeWidth="1" />
                          <ellipse cx="6" cy="-4" rx="8" ry="7" fill="#059669" stroke="#065f46" strokeWidth="1" />
                          <ellipse cx="2" cy="7" rx="7" ry="6" fill="#34d399" stroke="#059669" strokeWidth="1" />

                          {/* Calcium Ions Binding to Troponin C */}
                          {hasCalcium ? (
                            <g>
                              <circle cx="2" cy="7" r="4.5" fill="url(#caGrad)" stroke="#fef08a" strokeWidth="1" />
                              <text x="2" y="10" fill="#713f12" fontSize="5" fontWeight="bold" textAnchor="middle">
                                Ca²⁺
                              </text>
                            </g>
                          ) : (
                            <circle cx="2" cy="7" r="3" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                          )}
                        </g>
                      ))}

                      {/* Labels on Actin Filament */}
                      <text x="50" y="-5" fill="#7dd3fc" fontSize="11" fontWeight="bold">
                        Actin Thin Filament (F-Actin Double Helix)
                      </text>
                      <text x="500" y="-5" fill="#f59e0b" fontSize="10">
                        Tropomyosin Ribbon: {molecularState.effectiveTropomyosin === 'shifted' ? 'ROLLED OFF (Active Sites Exposed)' : 'BLOCKING BINDING SITES'}
                      </text>
                    </g>

                    {/* BOTTOM SECTION: MYOSIN THICK FILAMENT & PIVOTING HEAD */}
                    <g transform="translate(0, 130)">
                      {/* Myosin Filament Shaft at Bottom */}
                      <rect x="40" y="80" width="720" height="20" rx="4" fill="#9f1239" stroke="#be123c" strokeWidth="2" />
                      <text x="50" y="94" fill="#fecdd3" fontSize="10" fontWeight="bold">
                        Myosin Heavy Chain Tail (Thick Filament Backbone)
                      </text>

                      {/* Flexible Hinged Neck and Head (Center at X = 390) */}
                      {/* Power stroke shifts angle from 90° (cocked) to 45° (power stroke) */}
                      <g
                        transform={
                          !hasCalcium && (cycleStep === 3 || cycleStep === 4)
                            ? 'translate(390, 80) rotate(15)' // Blocked by tropomyosin! Cannot attach!
                            : cycleStep === 4
                            ? 'translate(360, 80) rotate(-35)'
                            : cycleStep === 3
                            ? 'translate(390, 80) rotate(0)'
                            : 'translate(390, 80) rotate(10)'
                        }
                        className="transition-transform duration-500 ease-out"
                      >
                        {/* Flexible Neck Hinge */}
                        <path
                          d="M 0 0 C 5 -20, 10 -40, 10 -55"
                          stroke="#e11d48"
                          strokeWidth="8"
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Essential Light Chains wrapped on neck */}
                        <ellipse cx="6" cy="-28" rx="6" ry="4" fill="#fb7185" />
                        <ellipse cx="9" cy="-42" rx="6" ry="4" fill="#f43f5e" />

                        {/* Globular Head (S1 Catalytic Fragment) */}
                        <g transform="translate(10, -65)">
                          <ellipse
                            cx="0"
                            cy="0"
                            rx="22"
                            ry="14"
                            fill="url(#headGrad)"
                            stroke={!hasATP && cycleStep >= 3 ? '#f59e0b' : '#ffe4e6'}
                            strokeWidth={!hasATP && cycleStep >= 3 ? 2.5 : 1.5}
                            transform="rotate(-25)"
                          />

                          {/* Actin Binding Tip */}
                          <circle cx="-12" cy="-8" r="4" fill={hasCalcium && (cycleStep === 3 || cycleStep === 4) ? '#fde047' : '#fb7185'} />

                          {/* ATPase Catalytic Cleft with Nucleotide */}
                          <rect
                            x="-4"
                            y="-7"
                            width="20"
                            height="14"
                            rx="3"
                            fill="#1e293b"
                            stroke={!hasATP ? '#f59e0b' : '#334155'}
                            strokeWidth={!hasATP ? 1.5 : 1}
                          />
                          <text x="6" y="3" fill={!hasATP ? '#f59e0b' : '#38bdf8'} fontSize="7" fontWeight="bold" textAnchor="middle">
                            {hasATP ? currentStepData.nucleotide : 'NO ATP'}
                          </text>
                        </g>
                      </g>

                      {/* Mechanical Force / Movement Vector Arrow during Power Stroke */}
                      {cycleStep === 4 && hasCalcium && hasATP && (
                        <g transform="translate(310, 15)">
                          <line x1={120} y1="0" x2="30" y2="0" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5 3" />
                          <polygon points="30,-5 20,0 30,5" fill="#f59e0b" />
                          <text x="75" y="-6" fill="#fde68a" fontSize="10" fontWeight="bold" textAnchor="middle">
                            10 nm Power Stroke (toward M-Line)
                          </text>
                        </g>
                      )}

                      {/* Connection Callout when Attached or Blocked */}
                      {cycleStep === 3 && (
                        <g transform="translate(370, 0)">
                          {hasCalcium ? (
                            <text x="0" y="0" fill="#a7f3d0" fontSize="10" fontWeight="bold" textAnchor="middle">
                              ⚡ Cross-Bridge Attached!
                            </text>
                          ) : (
                            <text x="0" y="0" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle">
                              🚫 Binding Blocked: Tropomyosin covers active sites (Ca²⁺ required)!
                            </text>
                          )}
                        </g>
                      )}

                      {cycleStep === 4 && !hasCalcium && (
                        <g transform="translate(370, 0)">
                          <text x="0" y="0" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle">
                            🚫 Power Stroke Inhibited: No cross-bridge formed without Ca²⁺!
                          </text>
                        </g>
                      )}
                    </g>
                  </svg>
                </div>

                {/* Step Sub-Information Card */}
                <div className="mt-3 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
                      Step {currentStepData.step} of 5: {currentStepData.name}
                    </span>
                    <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                      {currentStepData.description}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
                      Active Sites: <strong className={molecularState.effectiveTropomyosin === 'shifted' ? 'text-emerald-400' : 'text-amber-400'}>
                        {molecularState.effectiveTropomyosin === 'shifted' ? 'Exposed' : 'Blocked'}
                      </strong>
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
                      Cross-Bridge: <strong className={currentStepData.isBound && hasCalcium && hasATP ? 'text-emerald-400' : 'text-slate-400'}>
                        {currentStepData.isBound && hasCalcium && hasATP ? 'Attached' : 'Detached'}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* CONTROLS BAR: 1-3 MEANINGFUL HIGH-YIELD SCIENTIFIC CONTROLS */}
            {/* -------------------------------------------------------------- */}
            <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* CONTROL 1: 5-STEP CYCLE STEPPER & AUTO-PLAY (5 Cols) */}
              <div className="lg:col-span-5 bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-sky-400" />
                    Control 1: Cross-Bridge Cycle Stepper
                  </span>
                  <span className="text-xs font-mono text-sky-400 font-semibold">
                    Step {cycleStep} / 5
                  </span>
                </div>

                {/* Progress Indicators (Clickable Step Pills) */}
                <div className="grid grid-cols-5 gap-1.5">
                  {CYCLE_STEPS.map((s) => (
                    <button
                      key={s.step}
                      onClick={() => {
                        if (!hasATP && cycleStep >= 3) {
                          setRigorModalOpen(true);
                          return;
                        }
                        setCycleStep(s.step);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        cycleStep === s.step
                          ? 'bg-sky-400 shadow-sm shadow-sky-400'
                          : cycleStep > s.step
                          ? 'bg-sky-700/80'
                          : 'bg-slate-700'
                      }`}
                      title={s.name}
                    />
                  ))}
                </div>

                {/* Step Navigation Controls */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={handlePrevStep}
                    disabled={isPlaying}
                    className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 transition-colors"
                    title="Previous Step"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium text-sm transition-all shadow-md ${
                      isPlaying
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                        : 'bg-sky-500 hover:bg-sky-600 text-white'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'Pause Contraction Cycle' : 'Auto-Play Cycle'}</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    disabled={isPlaying}
                    className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 transition-colors"
                    title="Next Step"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Play Speed selector */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Cycle Speed:</span>
                  <div className="flex items-center gap-1">
                    {[0.5, 1, 1.5].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaySpeed(spd)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                          playSpeed === spd
                            ? 'bg-sky-500/30 text-sky-300 border border-sky-500/50'
                            : 'bg-slate-700/50 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CONTROL 2: SARCOMERE CONTRACTION SLIDER (4 Cols) */}
              <div className="lg:col-span-4 bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    Control 2: Sarcomere Length Slider
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-300">
                    {biometrics.sarcomereLengthUm} µm
                  </span>
                </div>

                {/* Slider Input */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={contractionPercent}
                    onChange={handleContractionSliderChange}
                    className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Relaxed (2.50 µm)</span>
                    <span className="text-purple-300 font-semibold">{contractionPercent}% Contracted</span>
                    <span>Max (1.80 µm)</span>
                  </div>
                </div>

                {/* Live Real-time Status Callout */}
                <div className="text-[11px] bg-slate-900/90 rounded-lg p-2 border border-slate-700/50 text-slate-300 flex items-center justify-between">
                  <span>A-Band (Thick): <strong className="text-rose-400">1.50 µm (FIXED)</strong></span>
                  <span>I-Band: <strong className="text-sky-300">{biometrics.iBandWidthUm} µm</strong></span>
                </div>
              </div>

              {/* CONTROL 3: MOLECULAR FACTOR TOGGLES (3 Cols) */}
              <div className="lg:col-span-3 bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Control 3: Molecular Factors
                </span>

                {/* Calcium Ions Toggle */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-xs font-medium text-slate-200">Calcium (Ca²⁺)</span>
                  </div>
                  <button
                    onClick={handleToggleCalcium}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      hasCalcium
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {hasCalcium ? 'Present' : 'Absent'}
                  </button>
                </div>

                {/* ATP Supply Toggle */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    {hasATP ? (
                      <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span className="text-xs font-medium text-slate-200">ATP Supply</span>
                  </div>
                  <button
                    onClick={handleToggleATP}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      hasATP
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                    }`}
                  >
                    {hasATP ? 'Available' : 'Depleted (Rigor)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: KCSE MISCONCEPTION BUSTER */}
      {/* ==================================================================== */}
      {activeTab === 'misconceptions' && (
        <div className="space-y-6">
          {/* Main Hero Card */}
          <div className="bg-gradient-to-br from-rose-950/50 via-slate-900 to-slate-900 border-2 border-rose-500/40 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-400 shrink-0">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/30">
                  Top KCSE Examiner Warning (Paper 1 & 2)
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  THE CRITICAL RULE: "Filaments Slide; They DO NOT Shorten!"
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Year after year, KCSE examiners penalize students who state that <em>"actin and myosin filaments contract or shrink"</em>.
                  Neither actin nor myosin changes in length by even a fraction of a nanometer.
                  Instead, the filaments <strong>slide past one another</strong>, increasing their interdigitation (overlap).
                </p>
              </div>
            </div>

            {/* Finger Interlocking Analogy Box */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 bg-sky-500/20 rounded-xl text-sky-400 shrink-0">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-sky-300">The Interlocking Fingers Analogy</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Hold your hands opposite each other and interlace your fingers together. As you push your hands together,
                  the total span from wrist to wrist shortens significantly. <strong>Did your fingers get shorter? No!</strong> They merely slid
                  into the spaces between one another. That is exactly how actin thin filaments and myosin thick filaments behave in muscle contraction.
                </p>
              </div>
            </div>
          </div>

          {/* Master Comparison Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-400" />
              Sarcomere Components: Relaxed vs Contracted Comparison Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold uppercase text-slate-400 bg-slate-800/40">
                    <th className="py-3 px-4">Sarcomere Region / Feature</th>
                    <th className="py-3 px-4">Relaxed Muscle</th>
                    <th className="py-3 px-4">Fully Contracted</th>
                    <th className="py-3 px-4 text-emerald-400">What Actually Happens?</th>
                    <th className="py-3 px-4">KCSE Exam Marking Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold text-purple-300">Sarcomere Total Length</td>
                    <td className="py-3 px-4 font-mono">2.50 µm</td>
                    <td className="py-3 px-4 font-mono text-purple-400">1.80 µm</td>
                    <td className="py-3 px-4 font-semibold text-purple-300">SHORTENS (~28%)</td>
                    <td className="py-3 px-4 text-slate-400">Distance between adjacent Z-discs decreases.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 bg-rose-950/10">
                    <td className="py-3 px-4 font-bold text-rose-400">A-Band (Dark Band)</td>
                    <td className="py-3 px-4 font-mono">1.50 µm</td>
                    <td className="py-3 px-4 font-mono text-rose-400">1.50 µm</td>
                    <td className="py-3 px-4 font-bold text-rose-400">STRICTLY CONSTANT!</td>
                    <td className="py-3 px-4 text-rose-300/90 font-medium">Equal to length of myosin thick filaments. Never changes!</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold text-sky-300">I-Band (Light Band)</td>
                    <td className="py-3 px-4 font-mono">0.80 µm</td>
                    <td className="py-3 px-4 font-mono text-sky-400">0.10 µm</td>
                    <td className="py-3 px-4 font-semibold text-sky-300">NARROWS</td>
                    <td className="py-3 px-4 text-slate-400">Actin filaments slide into the A-band, reducing actin-only zone.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold text-amber-300">H-Zone (Central Non-Overlap)</td>
                    <td className="py-3 px-4 font-mono">0.50 µm</td>
                    <td className="py-3 px-4 font-mono text-amber-400">0.00 µm</td>
                    <td className="py-3 px-4 font-semibold text-amber-300">NARROWS & DISAPPEARS</td>
                    <td className="py-3 px-4 text-slate-400">Thin filaments meet at M-line, eliminating myosin-only central gap.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold text-sky-400">Actin Thin Filaments</td>
                    <td className="py-3 px-4 font-mono">1.00 µm</td>
                    <td className="py-3 px-4 font-mono">1.00 µm</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">UNCHANGED (No Shortening)</td>
                    <td className="py-3 px-4 text-slate-400">Do NOT shorten; they are merely pulled inward.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold text-rose-400">Myosin Thick Filaments</td>
                    <td className="py-3 px-4 font-mono">1.50 µm</td>
                    <td className="py-3 px-4 font-mono">1.50 µm</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">UNCHANGED (No Shortening)</td>
                    <td className="py-3 px-4 text-slate-400">Do NOT shorten; heads pivot to pull actin.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold text-purple-400">Z-Lines / Z-Discs</td>
                    <td className="py-3 px-4">Far apart (2.5 µm)</td>
                    <td className="py-3 px-4">Closer together (1.8 µm)</td>
                    <td className="py-3 px-4 font-semibold text-purple-300">PULLED TOWARD M-LINE</td>
                    <td className="py-3 px-4 text-slate-400">Attached actin transmits mechanical force to Z-discs.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: 5-STEP CONTRACTION CYCLE DEEP DIVE */}
      {/* ==================================================================== */}
      {activeTab === 'cycle_guide' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/30">
                Molecular Physiology Syllabus Review
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                The 5 Steps of the Actomyosin Cross-Bridge Contraction Cycle
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                A step-by-step breakdown of biochemical energetics, calcium signaling, and mechanical cross-bridge action.
              </p>
            </div>

            {/* Cycle Steps Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CYCLE_STEPS.map((s) => (
                <div
                  key={s.step}
                  className={`p-5 rounded-2xl border transition-all ${
                    cycleStep === s.step
                      ? 'bg-sky-950/40 border-sky-500/60 shadow-lg shadow-sky-500/10'
                      : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-7 h-7 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-xs">
                      {s.step}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {s.nucleotide}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{s.name}</h4>
                  <p className="text-xs text-sky-400 font-medium mt-0.5">{s.subTitle}</p>
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">{s.description}</p>
                  <div className="mt-3 pt-3 border-t border-slate-700/60 text-[11px] text-emerald-300 font-medium">
                    ✓ {s.keyTakeaway}
                  </div>
                </div>
              ))}

              {/* Rigor Mortis Clinical Card */}
              <div className="p-5 rounded-2xl border border-amber-500/40 bg-amber-950/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                    !
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-amber-500/30">
                    Forensic Biology
                  </span>
                </div>
                <h4 className="text-base font-bold text-amber-200">Clinical Focus: Rigor Mortis</h4>
                <p className="text-xs text-amber-400 font-medium mt-0.5">Post-Mortem Muscle Rigidity</p>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Upon somatic death, ATP synthesis ceases due to lack of oxygen. While Ca²⁺ leaks from damaged sarcoplasmic reticulum,
                  the lack of new ATP prevents cross-bridge detachment (Step 5 blocked). All muscles remain rigidly locked until protein breakdown occurs 15–24 hours later.
                </p>
                <div className="mt-3 pt-3 border-t border-amber-500/40 text-[11px] text-amber-300 font-medium">
                  ✓ ATP is required for relaxation/detachment, not just contraction!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: KCSE EXAM MASTERY QUIZ */}
      {/* ==================================================================== */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  Form 4 KCSE Evaluation
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  Sliding Filament Mechanism Exam Mastery
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Test your understanding against authentic KCSE Biology Paper 1 and Paper 2 questions.
                </p>
              </div>

              {quizSubmitted && (
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-base">
                    Score: {quizScore} / {KCSE_QUESTIONS.length} ({Math.round((quizScore / KCSE_QUESTIONS.length) * 100)}%)
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Retry Quiz"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="mt-6 space-y-6">
              {KCSE_QUESTIONS.map((q, qIndex) => {
                const selectedOpt = userAnswers[q.id];
                const correctOpt = q.options.find((o) => o.correct);
                const isCorrect = selectedOpt === correctOpt.id;

                return (
                  <div
                    key={q.id}
                    className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-sky-400">
                        Question {qIndex + 1}: {q.title}
                      </span>
                      {quizSubmitted && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-medium text-slate-100 leading-relaxed">{q.prompt}</p>

                    {/* Options */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt) => {
                        let optStyle = 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-750 hover:border-slate-600';

                        if (quizSubmitted) {
                          if (opt.correct) {
                            optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                          } else if (selectedOpt === opt.id) {
                            optStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                          } else {
                            optStyle = 'bg-slate-900/40 border-slate-800 text-slate-500';
                          }
                        } else if (selectedOpt === opt.id) {
                          optStyle = 'bg-sky-500/20 border-sky-400 text-sky-200';
                        }

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectQuizAnswer(q.id, opt.id)}
                            disabled={quizSubmitted}
                            className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-start gap-3 ${optStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-700/80 font-bold flex items-center justify-center shrink-0 text-[10px]">
                              {opt.id}
                            </span>
                            <span className="mt-0.5 leading-relaxed">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after submit */}
                    {quizSubmitted && (
                      <div className="mt-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-sky-400">KCSE Chief Examiner Explanation:</span>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            {!quizSubmitted && (
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length < KCSE_QUESTIONS.length}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Submit Quiz Answers
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: GUIDED LAB CHALLENGES */}
      {/* ==================================================================== */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/30">
                Scientific Investigation Checklist
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Laboratory Investigation Tasks
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Complete these hands-on tasks in the interactive lab to verify the biophysical properties of muscle contraction.
              </p>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Challenge 1 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                challenges.fullCycleDone ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-slate-800/40 border-slate-700/60'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {challenges.fullCycleDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-500" />
                      )}
                      Task 1: Complete 5-Step Cross-Bridge Cycle
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Advance through steps 1 to 5 using the stepper or auto-play. Observe cocking, attachment, power stroke, and ATP detachment.
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-[11px] font-semibold text-slate-400">
                  Status: {challenges.fullCycleDone ? <span className="text-emerald-400">COMPLETED ✓</span> : <span className="text-amber-400">PENDING</span>}
                </div>
              </div>

              {/* Challenge 2 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                challenges.rigorTested ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-slate-800/40 border-slate-700/60'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {challenges.rigorTested ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-500" />
                      )}
                      Task 2: Induce Rigor Mortis (ATP Depletion)
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Toggle ATP Supply to "Depleted (Rigor)" when the cross-bridge is attached (Step 3 or 4). Observe how the head remains locked!
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-[11px] font-semibold text-slate-400">
                  Status: {challenges.rigorTested ? <span className="text-emerald-400">COMPLETED ✓</span> : <span className="text-amber-400">PENDING</span>}
                </div>
              </div>

              {/* Challenge 3 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                challenges.calciumBlocked ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-slate-800/40 border-slate-700/60'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {challenges.calciumBlocked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-500" />
                      )}
                      Task 3: Test Calcium Deprivation
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Toggle Calcium (Ca²⁺) to "Absent". Observe how Tropomyosin rolls back over the actin active sites, preventing cross-bridge binding.
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-[11px] font-semibold text-slate-400">
                  Status: {challenges.calciumBlocked ? <span className="text-emerald-400">COMPLETED ✓</span> : <span className="text-amber-400">PENDING</span>}
                </div>
              </div>

              {/* Challenge 4 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                challenges.constantABandVerified ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-slate-800/40 border-slate-700/60'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {challenges.constantABandVerified ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-500" />
                      )}
                      Task 4: Verify Invariable A-Band Width
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Drag the Sarcomere Slider from Relaxed (0%) to fully Contracted (90%+). Verify that the A-Band remains strictly constant at 1.50 µm!
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-[11px] font-semibold text-slate-400">
                  Status: {challenges.constantABandVerified ? <span className="text-emerald-400">COMPLETED ✓</span> : <span className="text-amber-400">PENDING</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* RIGOR MORTIS MODAL */}
      {/* ==================================================================== */}
      {rigorModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <ShieldAlert className="w-8 h-8" />
              <h3 className="text-xl font-bold text-amber-200">Biophysical Event: Rigor Mortis</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              You attempted to proceed without ATP while the myosin head was docked to actin.
              In living muscle tissue, <strong>ATP binding is the obligate requirement for cross-bridge detachment</strong> (Step 5).
            </p>
            <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-300 space-y-1">
              <p><strong>Forensic Significance:</strong></p>
              <p>When an organism dies, aerobic and anaerobic ATP generation stops. Sarcoplasmic Ca²⁺ rises, causing cross-bridge attachment, but heads cannot detach. The body becomes completely stiff (Rigor Mortis).</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setHasATP(true);
                  setRigorModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-colors"
              >
                Restore ATP Supply
              </button>
              <button
                onClick={() => setRigorModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
