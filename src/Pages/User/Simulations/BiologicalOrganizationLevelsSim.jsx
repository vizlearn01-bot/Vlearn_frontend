import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
  CheckCircle2,
  HelpCircle,
  Activity,
  Layers,
  Heart,
  User,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Award,
  BookOpen,
  ArrowRight,
  Flame,
  Zap,
  RefreshCw,
  Sliders,
  Check,
  X
} from 'lucide-react';

/**
 * Web Audio Synthesizer for Heartbeats, Level Transitions, and Quiz Feedback
 */
class BioLevelsAudio {
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

  playHeartbeat(isHighBpm = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      const now = this.ctx.currentTime;
      // First sound: "LUB" (AV valves close, lower frequency, ~60Hz to ~40Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(65, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // Second sound: "DUB" (Semilunar valves close, slightly higher, ~90Hz to ~50Hz)
      const delay = isHighBpm ? 0.15 : 0.22;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(95, now + delay);
      osc2.frequency.exponentialRampToValueAtTime(45, now + delay + 0.1);
      gain2.gain.setValueAtTime(0.09, now + delay);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + delay);
      osc2.stop(now + delay + 0.13);
    } catch {
      // Audio safety guard
    }
  }

  playLevelTransition(direction = 1) {
    if (this.muted) return;
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

      const startFreq = direction > 0 ? 220 : 580;
      const endFreq = direction > 0 ? 580 : 220;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.18);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio safety guard
    }
  }

  playActionPotential() {
    if (this.muted) return;
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
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(740, now + 0.08);
      osc.frequency.linearRampToValueAtTime(260, now + 0.2);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
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
      const freqs = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.05, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.28);
      });
    } catch {
      // Audio safety guard
    }
  }
}

// Global audio synth instance
const bioAudio = new BioLevelsAudio();

/**
 * 5 Canonical Levels of Biological Organization
 */
const LEVELS_DATA = [
  {
    id: 1,
    name: 'Specialised Cell',
    shortName: 'Cell',
    example: 'Cardiac Myocyte (Cardiomyocyte)',
    scale: '10⁻⁵ m (~100 µm)',
    magnification: '1,000×',
    color: '#ec4899', // Pink / Rose
    bgColor: 'from-pink-500/10 to-rose-500/10',
    borderColor: 'border-pink-500/40',
    icon: Zap,
    emergentProperty:
      'Autonomous rhythmic contraction emerges from the ATP-driven sliding of actin and myosin filaments within sarcomeres.',
    description:
      'The single cardiac muscle cell is the fundamental unit of contraction. It features branching ends, abundant mitochondria to resist fatigue, and a central nucleus.',
    structuralFeatures: [
      { name: 'Sarcomeres & Striations', desc: 'Repeating contractile units of actin and myosin protein filaments.' },
      { name: 'Abundant Mitochondria', desc: 'Dense organelles generating continuous ATP via aerobic respiration.' },
      { name: 'Single Oval Nucleus', desc: 'Houses genetic code controlling protein turnover and ion channel expression.' },
      { name: 'Branching Morphology', desc: 'Bifurcating shape allowing mechanical connections with adjacent cells.' }
    ],
    whySubordinateCannot:
      'Isolated organelles or protein filaments cannot self-sustain or contract rhythmically on their own without the intact cell membrane, cytosol, and ion gradients.'
  },
  {
    id: 2,
    name: 'Tissue',
    shortName: 'Tissue',
    example: 'Cardiac Muscle Tissue (Myocardium)',
    scale: '10⁻³ m (~1–2 mm)',
    magnification: '150×',
    color: '#8b5cf6', // Violet / Purple
    bgColor: 'from-purple-500/10 to-violet-500/10',
    borderColor: 'border-purple-500/40',
    icon: Layers,
    emergentProperty:
      'Synchronous coordinated wave contractions (functional syncytium) emerge through rapid electrical coupling across intercalated gap junctions.',
    description:
      'Individual cardiomyocytes interlock end-to-end via specialized intercalated discs. Action potentials spread instantaneously between cells, producing synchronized beating.',
    structuralFeatures: [
      { name: 'Intercalated Discs', desc: 'Specialized zigzag junctional complexes anchoring adjacent cardiomyocytes.' },
      { name: 'Gap Junctions (Connexons)', desc: 'Low-resistance ionic pores permitting direct action potential propagation.' },
      { name: 'Desmosomes', desc: 'Mechanical rivets preventing cells from pulling apart during vigorous contractions.' },
      { name: 'Capillary Capillary Infiltration', desc: 'Dense blood capillary network supplying continuous oxygen and glucose.' }
    ],
    whySubordinateCannot:
      'A solitary cell can only twitch by itself; only when interconnected into tissue can an unbroken wave of electrical excitation sweep smoothly across a collective sheet.'
  },
  {
    id: 3,
    name: 'Organ',
    shortName: 'Organ',
    example: 'The Human Heart',
    scale: '10⁻¹ m (~12 cm)',
    magnification: '1× (Macroscopic)',
    color: '#ef4444', // Red
    bgColor: 'from-red-500/10 to-rose-500/10',
    borderColor: 'border-red-500/40',
    icon: Heart,
    emergentProperty:
      'Unidirectional, high-pressure fluid pumping emerges from the geometric arrangement of hollow chambers, muscular walls, and one-way valves.',
    description:
      'The heart combines cardiac muscle, fibrous connective tissue valves, nervous conduction pacemakers, and endothelial linings into a dual-circuit hydraulic pump.',
    structuralFeatures: [
      { name: 'Four Hollow Chambers', desc: 'Right & Left Atria (receiving) and Right & Left Ventricles (pumping).' },
      { name: 'One-Way Heart Valves', desc: 'Atrioventricular (Tricuspid, Bicuspid) and Semilunar (Aortic, Pulmonary) valves prevent backflow.' },
      { name: 'Thick Muscular Myocardium', desc: 'Left ventricle wall is 3× thicker than right to generate systemic arterial pressures.' },
      { name: 'Pacemaker Conduction System', desc: 'Sinoatrial (SA) node coordinates the sequential atrial-then-ventricular systole.' }
    ],
    whySubordinateCannot:
      'A flat muscle sheet or mass of tissue cannot create directional fluid flow; enclosed hollow chambers and directional valves are required to generate hydraulic pressure gradients.'
  },
  {
    id: 4,
    name: 'Organ System',
    shortName: 'Organ System',
    example: 'Circulatory / Cardiovascular System',
    scale: '10⁰ m (~1.6 m loop)',
    magnification: '0.5× (Body-Wide)',
    color: '#06b6d4', // Cyan
    bgColor: 'from-cyan-500/10 to-blue-500/10',
    borderColor: 'border-cyan-500/40',
    icon: Activity,
    emergentProperty:
      'Whole-body closed transport and tissue gas exchange emerge from the continuous integration of heart, pulmonary circuit, and systemic capillary networks.',
    description:
      'The heart cannot transport materials without blood vessels, and vessels cannot flow without the heart. Together with blood, they form a closed circulatory circuit sustaining every tissue.',
    structuralFeatures: [
      { name: 'Dual Circulatory Circuits', desc: 'Pulmonary circuit (lungs for gas exchange) and Systemic circuit (body tissues).' },
      { name: 'Arterial Distribution Tree', desc: 'High-pressure elastic and muscular conduits distributing oxygenated blood.' },
      { name: 'Microscopic Capillary Beds', desc: 'Single-cell thin exchange surfaces delivering O₂, glucose, hormones to cells.' },
      { name: 'Venous Reservoir & Return', desc: 'Low-pressure capacitance vessels with venous valves returning blood to heart.' }
    ],
    whySubordinateCannot:
      'An isolated organ like the heart cannot distribute substances throughout a multicellular body without an extensive vascular branching tree reaching every millimeter of tissue.'
  },
  {
    id: 5,
    name: 'Organism',
    shortName: 'Organism',
    example: 'The Human Being (Homo sapiens)',
    scale: '10⁰ m (~1.8 m total)',
    magnification: '0.2× (Full Living Unit)',
    color: '#10b981', // Emerald
    bgColor: 'from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-emerald-500/40',
    icon: User,
    emergentProperty:
      'Self-sustaining life, complex behavior, and systemic homeostasis emerge from the mutual coordination and negative-feedback regulation of all 11 organ systems.',
    description:
      'The living human organism integrates the circulatory, respiratory, nervous, digestive, endocrine, and musculoskeletal systems to maintain internal stability and thrive in dynamic environments.',
    structuralFeatures: [
      { name: 'Systemic Homeostasis', desc: 'Negative feedback loops balancing body temperature, pH, blood glucose, and osmolarity.' },
      { name: 'Inter-System Cross Talk', desc: 'Nervous and endocrine systems rapidly adjust heart and breathing rates to meet metabolic demand.' },
      { name: 'Metabolic Energy Autonomy', desc: 'Digestive nutrient intake combined with respiratory gas uptake fuels all cellular work.' },
      { name: 'Autonomous Environmental Interaction', desc: 'Locomotion, sensation, adaptation, learning, and biological reproduction.' }
    ],
    whySubordinateCannot:
      'No single organ system can survive in isolation; failure of any vital system (circulatory, respiratory, nervous) causes organismal death, proving their interdependent unity.'
  }
];

/**
 * Quiz Questions Testing Hierarchical Biology & Emergent Properties
 */
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Which of the following correctly orders the biological levels from simplest to most complex?',
    options: [
      'Organelle → Organ → Tissue → Organism → Organ System',
      'Specialised Cell → Tissue → Organ → Organ System → Organism',
      'Tissue → Specialised Cell → Organ → Organ System → Organism',
      'Specialised Cell → Organ → Tissue → Organism → Organ System'
    ],
    correctIndex: 1,
    explanation:
      'Cells of similar structure and function group together to form Tissues. Multiple tissues combine to form an Organ. Cooperating organs form an Organ System, and all organ systems unite to build an independent Organism.'
  },
  {
    id: 2,
    question: 'What is the primary emergent property that distinguishes Cardiac Muscle Tissue from an isolated single cardiomyocyte?',
    options: [
      'The presence of cellular DNA and mitochondria inside each cell',
      'Synchronized, collective contraction waves via electrical gap junctions',
      'The ability to synthesize hemoglobin and transport oxygen',
      'The formation of directional heart valves to prevent regurgitation'
    ],
    correctIndex: 1,
    explanation:
      'While a single cell can twitch independently, it cannot produce a coordinated contraction wave alone. Intercalated discs and gap junctions couple adjacent cardiomyocytes into a functional syncytium, enabling synchronous wave-like contraction.'
  },
  {
    id: 3,
    question: 'Why is a heart classified as an "Organ" rather than merely a mass of "Tissue"?',
    options: [
      'Because it is composed of multiple distinct tissue types (muscle, connective, nervous, epithelial) organized into functional pumping chambers',
      'Because it is located inside the thoracic cavity of vertebrate animals',
      'Because it is larger than 1 centimeter in diameter',
      'Because it only contains identical muscle cells without any blood vessels'
    ],
    correctIndex: 0,
    explanation:
      'By definition, an organ consists of two or more different tissue types cooperating together. The heart combines myocardium (muscle), endocardium/pericardium (epithelial/connective), heart valves (fibrous connective), and pacemaker conduction pathways (nervous/modified muscle) into a 4-chambered hydraulic organ.'
  },
  {
    id: 4,
    question: 'During intense physical exercise, how does biological organization demonstrate systemic homeostasis?',
    options: [
      'The heart stops beating to conserve glucose for skeletal muscles',
      'The organism levels remain completely isolated from cellular respiration demands',
      'Sensory receptors and brain signal the cardiovascular and respiratory systems to accelerate blood and oxygen delivery down to individual muscle cells',
      'Only the skin reacts by losing water without any involvement from the circulatory system'
    ],
    correctIndex: 2,
    explanation:
      'Homeostasis at the Organism level coordinates multiple organ systems: the nervous system detects CO₂ rise, prompting the circulatory system (heart & vessels) and respiratory system (lungs) to rapidly increase output, satisfying the ATP and oxygen demands of billions of working cells.'
  }
];

export default function BiologicalOrganizationLevelsSim({ config = {}, onTelemetry }) {
  // Primary State: Level (1 to 5)
  const [currentLevel, setCurrentLevel] = useState(1);
  const [zoomSliderValue, setZoomSliderValue] = useState(1);

  // Auto-play walkthrough state
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayProgress, setAutoPlayProgress] = useState(0); // 0 to 100%
  const autoPlayTimerRef = useRef(null);
  const autoPlayProgressTimerRef = useRef(null);

  // Sound state
  const [isMuted, setIsMuted] = useState(false);

  // Level 1 Interactive controls: Cell features
  const [activeCellOrganelle, setActiveCellOrganelle] = useState(null);
  const [cellContracting, setCellContracting] = useState(false);

  // Level 2 Interactive controls: Tissue syncytium
  const [tissueConductionSpeed, setTissueConductionSpeed] = useState(1); // 1 = normal, 0.5 = slow
  const [showGapJunctionZoom, setShowGapJunctionZoom] = useState(false);
  const [tissuePulseTrigger, setTissuePulseTrigger] = useState(0);

  // Level 3 Interactive controls: Organ Heart
  const [heartBpm, setHeartBpm] = useState(72);
  const [heartPhase, setHeartPhase] = useState('systole'); // 'systole' | 'diastole'
  const [activeHeartChamber, setActiveHeartChamber] = useState(null);
  const [showHeartValves, setShowHeartValves] = useState(true);

  // Level 4 Interactive controls: Organ System
  const [circuitHighlight, setCircuitHighlight] = useState('all'); // 'all' | 'pulmonary' | 'systemic'
  const [activeCapillaryBed, setActiveCapillaryBed] = useState(null);

  // Level 5 Interactive controls: Organism
  const [exerciseState, setExerciseState] = useState('rest'); // 'rest' | 'moderate' | 'vigorous'
  const [activeSystemLayer, setActiveSystemLayer] = useState('all'); // 'all' | 'circulatory' | 'respiratory' | 'nervous'

  // Educational Tabs: 'visual' | 'anatomy' | 'matrix' | 'quiz'
  const [activeTab, setActiveTab] = useState('visual');

  // Interactive Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Telemetry checkpoint tracking
  const [completedLevels, setCompletedLevels] = useState(new Set([1]));
  const telemetrySentRef = useRef(false);

  // Keep audio muted state in sync
  useEffect(() => {
    bioAudio.setMuted(isMuted);
  }, [isMuted]);

  // Keep zoom slider in sync with currentLevel when level changes
  const changeLevel = useCallback(
    (newLevel, shouldPlaySound = true) => {
      const clamped = Math.max(1, Math.min(5, newLevel));
      if (clamped !== currentLevel) {
        if (shouldPlaySound) {
          bioAudio.playLevelTransition(clamped > currentLevel ? 1 : -1);
        }
        setCurrentLevel(clamped);
        setZoomSliderValue(clamped);

        setCompletedLevels((prev) => {
          const next = new Set(prev);
          next.add(clamped);
          return next;
        });

        // Trigger telemetry if reached Level 5
        if (clamped === 5 && !telemetrySentRef.current) {
          telemetrySentRef.current = true;
          bioAudio.playSuccess();
          if (onTelemetry) {
            onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
              simulation: 'biological_organization_levels',
              level: 5
            });
          }
        }
      }
    },
    [currentLevel, onTelemetry]
  );

  // Auto-Play Walkthrough timer
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      if (autoPlayProgressTimerRef.current) clearInterval(autoPlayProgressTimerRef.current);
      setAutoPlayProgress(0);
      return;
    }

    const durationMs = 6000; // 6 seconds per level
    const intervalStepMs = 100;
    let elapsed = 0;

    autoPlayProgressTimerRef.current = setInterval(() => {
      elapsed += intervalStepMs;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setAutoPlayProgress(pct);

      if (elapsed >= durationMs) {
        elapsed = 0;
        setAutoPlayProgress(0);
        setCurrentLevel((prev) => {
          const next = prev >= 5 ? 1 : prev + 1;
          setZoomSliderValue(next);
          bioAudio.playLevelTransition(next > prev ? 1 : -1);
          setCompletedLevels((cp) => {
            const updated = new Set(cp);
            updated.add(next);
            return updated;
          });
          if (next === 5 && !telemetrySentRef.current) {
            telemetrySentRef.current = true;
            bioAudio.playSuccess();
            if (onTelemetry) {
              onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
                simulation: 'biological_organization_levels',
                level: 5
              });
            }
          }
          return next;
        });
      }
    }, intervalStepMs);

    return () => {
      if (autoPlayProgressTimerRef.current) clearInterval(autoPlayProgressTimerRef.current);
    };
  }, [isAutoPlaying, onTelemetry]);

  // Cardiac heartbeat cyclic animation & audio effect
  useEffect(() => {
    const periodMs = (60 / heartBpm) * 1000;
    const interval = setInterval(() => {
      setHeartPhase('systole');
      setCellContracting(true);
      if (currentLevel >= 3) {
        bioAudio.playHeartbeat(heartBpm > 100);
      }
      setTimeout(() => {
        setHeartPhase('diastole');
        setCellContracting(false);
      }, periodMs * 0.38);
    }, periodMs);

    return () => clearInterval(interval);
  }, [heartBpm, currentLevel]);

  // Reset function
  const handleReset = () => {
    setIsAutoPlaying(false);
    setAutoPlayProgress(0);
    changeLevel(1);
    setHeartBpm(72);
    setExerciseState('rest');
    setCircuitHighlight('all');
    setActiveCellOrganelle(null);
    setActiveHeartChamber(null);
    setActiveCapillaryBed(null);
    setActiveSystemLayer('all');
    setActiveTab('visual');
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        e.preventDefault();
        changeLevel(currentLevel + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        e.preventDefault();
        changeLevel(currentLevel - 1);
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        // Toggle autoplay
        e.preventDefault();
        setIsAutoPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLevel, changeLevel]);

  // Handle Zoom Slider Drag
  const handleZoomSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setZoomSliderValue(val);
    const discreteLevel = Math.round(val);
    if (discreteLevel !== currentLevel) {
      changeLevel(discreteLevel);
    }
  };

  // Current Level Data Object
  const curData = useMemo(() => LEVELS_DATA[currentLevel - 1], [currentLevel]);

  // Trigger cell twitch action potential
  const triggerCellActionPotential = () => {
    bioAudio.playActionPotential();
    setCellContracting(true);
    setTimeout(() => {
      setCellContracting(false);
    }, 450);
  };

  // Trigger tissue electrical impulse wave
  const triggerTissueWave = () => {
    bioAudio.playActionPotential();
    setTissuePulseTrigger((prev) => prev + 1);
  };

  // Adjust BPM according to exercise state on Level 5
  useEffect(() => {
    if (exerciseState === 'rest') {
      setHeartBpm(72);
    } else if (exerciseState === 'moderate') {
      setHeartBpm(115);
    } else if (exerciseState === 'vigorous') {
      setHeartBpm(160);
    }
  }, [exerciseState]);

  // Calculate Quiz Score
  const quizScore = useMemo(() => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  }, [quizAnswers]);

  return (
    <div className="flex flex-col min-h-[750px] w-full max-w-7xl mx-auto p-3 sm:p-5 lg:p-6 bg-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 font-sans select-none">
      {/* 1. TOP HEADER & TELEMETRY STATUS BAR */}
      <header className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-500 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Layers className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Grade 10 Biology · Topic 1
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                Cell Biology & Biodiversity
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              Levels of Biological Organization
            </h1>
          </div>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Audio Mute Toggle */}
          <button
            onClick={() => setIsMuted((prev) => !prev)}
            className={`p-2.5 rounded-xl border transition-all ${
              isMuted
                ? 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
            }`}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Auto-Play Walkthrough Button */}
          <button
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              isAutoPlaying
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/20 animate-pulse'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
            }`}
            title="Auto-Play Walkthrough across all 5 levels"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isAutoPlaying ? 'Pause Tour' : 'Auto-Tour'}</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-all"
            title="Reset Simulation to Level 1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Telemetry Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              completedLevels.size === 5
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Award
              className={`w-4 h-4 ${completedLevels.size === 5 ? 'text-emerald-400 animate-bounce' : 'text-slate-500'}`}
            />
            <span>{completedLevels.size} / 5 Levels Explored</span>
          </div>
        </div>
      </header>

      {/* Auto-play visual progress bar */}
      {isAutoPlaying && (
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-100 ease-linear"
            style={{ width: `${autoPlayProgress}%` }}
          />
        </div>
      )}

      {/* 2. PRIMARY INTERACTIVE STEPPER & ZOOM CONTROLLER */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Stepper Buttons 1 -> 5 */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 w-full md:w-auto justify-between sm:justify-start">
            {LEVELS_DATA.map((lvl) => {
              const isActive = currentLevel === lvl.id;
              const isDone = completedLevels.has(lvl.id);

              return (
                <button
                  key={lvl.id}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    changeLevel(lvl.id);
                  }}
                  className={`group relative flex items-center gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                    isActive
                      ? `bg-gradient-to-r ${lvl.bgColor} ${lvl.borderColor} text-white shadow-lg shadow-black/40 scale-[1.02]`
                      : isDone
                      ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                  }`}
                  aria-label={`Jump to Level ${lvl.id}: ${lvl.name}`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${
                      isActive
                        ? 'bg-white text-slate-950'
                        : isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {lvl.id}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-[10px] uppercase font-bold text-slate-400 leading-none">Level {lvl.id}</div>
                    <div className="font-extrabold text-xs">{lvl.shortName}</div>
                  </div>
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-white shadow-sm shadow-white"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Stepper Prev / Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsAutoPlaying(false);
                changeLevel(currentLevel - 1);
              }}
              disabled={currentLevel <= 1}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 text-xs font-bold flex items-center gap-1 transition-all border border-slate-700"
              title="Previous Level (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <button
              onClick={() => {
                setIsAutoPlaying(false);
                changeLevel(currentLevel + 1);
              }}
              disabled={currentLevel >= 5}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold flex items-center gap-1 transition-all shadow-md shadow-rose-600/30"
              title="Next Level (Right Arrow)"
            >
              <span className="hidden sm:inline">Next Level</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Continuous Zoom Slider Scrub Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scale Continuum:</span>
            <span className="font-mono text-cyan-300 font-bold">{curData.scale}</span>
            <span className="text-slate-600">|</span>
            <span>Magnification:</span>
            <span className="font-mono text-purple-300 font-bold">{curData.magnification}</span>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-md w-full">
            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Micro (Cell)</span>
            <input
              type="range"
              min="1"
              max="5"
              step="0.01"
              value={zoomSliderValue}
              onChange={handleZoomSliderChange}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              aria-label="Biological Scale Zoom Slider"
            />
            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Macro (Organism)</span>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC EMERGENT PROPERTY BANNER (PROMINENT CALLOUT) */}
      <section className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-slate-800/90 shadow-xl relative overflow-hidden">
        <div
          className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: curData.color }}
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-start gap-3">
            <div
              className="p-2.5 rounded-xl border flex-shrink-0 mt-0.5 shadow-md"
              style={{
                backgroundColor: `${curData.color}15`,
                borderColor: `${curData.color}40`,
                color: curData.color
              }}
            >
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md bg-white/10 text-white">
                  Emergent Property at Level {currentLevel}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {curData.name}: {curData.example}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-white mt-1 leading-snug">
                "{curData.emergentProperty}"
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 self-end sm:self-center">
            <span className="text-[11px] font-medium text-slate-400 italic bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              "The whole is greater than the sum of its parts"
            </span>
          </div>
        </div>
      </section>

      {/* 4. MAIN INTERACTIVE CONTENT AREA (TABS + VISUAL STAGE + INSPECTOR) */}
      <div className="mt-4 flex flex-col gap-4 flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'visual'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Interactive Model</span>
            </button>

            <button
              onClick={() => setActiveTab('anatomy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'anatomy'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Structural Anatomy</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'matrix'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Hierarchy Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Concept Check</span>
            </button>
          </div>

          <div className="text-xs font-semibold text-slate-500 hidden sm:block">
            Use <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">←</kbd>{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">→</kbd> to step levels
          </div>
        </div>

        {/* TAB 1: INTERACTIVE VISUAL SIMULATION MODEL */}
        {activeTab === 'visual' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            {/* SVG Visual Canvas (Left / Main) */}
            <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden shadow-2xl min-h-[460px]">
              {/* Level Indicator Badge Overlay */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-lg"
                  style={{ backgroundColor: curData.color }}
                >
                  Level {currentLevel}: {curData.name}
                </span>
                <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-950/80 text-slate-300 border border-slate-800">
                  {curData.example}
                </span>
              </div>

              {/* Specific SVG Diagram Rendering for each of the 5 Levels */}
              <div className="w-full flex-1 flex items-center justify-center my-2 select-none relative">
                {/* ---------------- LEVEL 1: SPECIALISED CELL (CARDIOMYOCYTE) ---------------- */}
                {currentLevel === 1 && (
                  <div className="w-full max-w-xl h-full flex flex-col items-center justify-center">
                    <svg
                      viewBox="0 0 700 420"
                      className="w-full h-auto max-h-[380px] drop-shadow-2xl transition-transform duration-300"
                      style={{
                        transform: cellContracting ? 'scaleX(0.94) scaleY(1.04)' : 'scaleX(1) scaleY(1)'
                      }}
                    >
                      <defs>
                        <linearGradient id="cellBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#881337" stopOpacity="0.85" />
                          <stop offset="50%" stopColor="#be123c" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#4c0519" stopOpacity="0.95" />
                        </linearGradient>
                        <linearGradient id="nucleusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="60%" stopColor="#4338ca" />
                          <stop offset="100%" stopColor="#312e81" />
                        </linearGradient>
                        <radialGradient id="mitochondriaGrad" cx="40%" cy="40%" r="60%">
                          <stop offset="0%" stopColor="#fbbf24" />
                          <stop offset="70%" stopColor="#d97706" />
                          <stop offset="100%" stopColor="#78350f" />
                        </radialGradient>
                        <filter id="cellGlow" x="-10%" y="-10%" width="120%" height="120%">
                          <feGaussianBlur stdDeviation="4" result="glow" />
                          <feComposite in="SourceGraphic" in2="glow" operator="over" />
                        </filter>
                      </defs>

                      {/* Cytoplasmic Branched Cell Body Outline */}
                      <path
                        d="M 120 120 
                           C 220 90, 420 95, 540 110 
                           C 600 120, 640 160, 620 200 
                           C 635 240, 595 280, 530 290 
                           C 450 305, 230 300, 140 285 
                           C 90 270, 70 230, 95 190 
                           C 75 160, 90 130, 120 120 Z"
                        fill="url(#cellBgGradient)"
                        stroke={cellContracting ? '#fda4af' : '#f43f5e'}
                        strokeWidth="4"
                        filter="url(#cellGlow)"
                      />

                      {/* Sarcolemma Membrane Border Details */}
                      <path
                        d="M 125 125 C 220 95, 420 100, 535 115 C 590 125, 630 160, 615 198 C 630 238, 590 275, 525 285 C 445 300, 235 295, 145 280 C 95 265, 78 230, 100 192 C 82 162, 95 132, 125 125 Z"
                        fill="none"
                        stroke="#fb7185"
                        strokeWidth="1.5"
                        strokeDasharray="4,4"
                        opacity="0.6"
                      />

                      {/* Repeating Myofibril Striations (Sarcomere Bands) */}
                      {[170, 210, 250, 290, 330, 370, 410, 450, 490].map((xPos, idx) => (
                        <g key={idx} opacity="0.85">
                          {/* Dark A-band (Thick Myosin) */}
                          <rect
                            x={xPos - 12}
                            y={118}
                            width="24"
                            height="160"
                            fill="#9f1239"
                            opacity="0.65"
                            rx="4"
                          />
                          {/* Light I-band background */}
                          <line
                            x1={xPos}
                            y1={118}
                            x2={xPos}
                            y2={278}
                            stroke={idx % 2 === 0 ? '#fb7185' : '#f43f5e'}
                            strokeWidth="2.5"
                          />
                          {/* Distinct Z-disc lines dividing sarcomeres */}
                          <line
                            x1={xPos + 18}
                            y1={120}
                            x2={xPos + 18}
                            y2={275}
                            stroke="#38bdf8"
                            strokeWidth="2"
                            strokeDasharray="3,3"
                          />
                        </g>
                      ))}

                      {/* Intercalated Disc Zigzag ends (Junction sites with neighbor cells) */}
                      <path
                        d="M 100 160 L 115 175 L 95 195 L 110 215 L 90 235 L 105 255"
                        stroke="#06b6d4"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        className="cursor-pointer"
                        onClick={() => setActiveCellOrganelle('intercalated')}
                      />
                      <path
                        d="M 605 160 L 620 180 L 598 200 L 615 225 L 595 245"
                        stroke="#06b6d4"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        className="cursor-pointer"
                        onClick={() => setActiveCellOrganelle('intercalated')}
                      />

                      {/* Centrally Located Oval Nucleus */}
                      <g
                        className="cursor-pointer transition-transform hover:scale-105"
                        onClick={() => setActiveCellOrganelle('nucleus')}
                      >
                        <ellipse
                          cx="350"
                          cy="195"
                          rx="48"
                          ry="34"
                          fill="url(#nucleusGrad)"
                          stroke="#a5b4fc"
                          strokeWidth="2.5"
                        />
                        {/* Nucleolus & Chromatin granules */}
                        <circle cx="340" cy="190" r="11" fill="#1e1b4b" opacity="0.8" />
                        <circle cx="365" cy="202" r="4" fill="#c7d2fe" opacity="0.7" />
                        <circle cx="330" cy="208" r="3" fill="#c7d2fe" opacity="0.7" />
                        <text
                          x="350"
                          y="198"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                          pointerEvents="none"
                        >
                          Nucleus
                        </text>
                      </g>

                      {/* Dense Mitochondria (Continuous Aerobic ATP Supply) */}
                      {[
                        { cx: 200, cy: 150, rot: 15 },
                        { cx: 230, cy: 245, rot: -25 },
                        { cx: 270, cy: 145, rot: 40 },
                        { cx: 430, cy: 150, rot: -30 },
                        { cx: 470, cy: 240, rot: 20 },
                        { cx: 505, cy: 160, rot: -15 },
                        { cx: 420, cy: 250, rot: 10 }
                      ].map((m, i) => (
                        <g
                          key={i}
                          transform={`translate(${m.cx}, ${m.cy}) rotate(${m.rot})`}
                          className="cursor-pointer hover:opacity-100 opacity-90 transition-opacity"
                          onClick={() => setActiveCellOrganelle('mitochondria')}
                        >
                          <rect
                            x="-16"
                            y="-9"
                            width="32"
                            height="18"
                            rx="9"
                            fill="url(#mitochondriaGrad)"
                            stroke="#fde68a"
                            strokeWidth="1.5"
                          />
                          {/* Cristae Folds */}
                          <path
                            d="M -10 -4 L -6 4 L -2 -4 L 2 4 L 6 -4 L 10 4"
                            fill="none"
                            stroke="#78350f"
                            strokeWidth="1.2"
                          />
                        </g>
                      ))}

                      {/* Interactive Cellular Hotspot Badges */}
                      <g
                        transform="translate(180, 75)"
                        className="cursor-pointer"
                        onClick={() => setActiveCellOrganelle('striations')}
                      >
                        <rect x="-5" y="-12" width="130" height="22" rx="11" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" />
                        <text x="60" y="3" fill="#fda4af" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Sarcomere Striations
                        </text>
                        <line x1="60" y1="10" x2="60" y2="40" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2,2" />
                      </g>

                      <g
                        transform="translate(480, 75)"
                        className="cursor-pointer"
                        onClick={() => setActiveCellOrganelle('mitochondria')}
                      >
                        <rect x="-5" y="-12" width="115" height="22" rx="11" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                        <text x="52" y="3" fill="#fcd34d" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Mitochondria (ATP)
                        </text>
                        <line x1="52" y1="10" x2="52" y2="45" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2,2" />
                      </g>

                      <g
                        transform="translate(50, 320)"
                        className="cursor-pointer"
                        onClick={() => setActiveCellOrganelle('intercalated')}
                      >
                        <rect x="-5" y="-12" width="145" height="22" rx="11" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
                        <text x="67" y="3" fill="#67e8f9" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Intercalated Disc Border
                        </text>
                        <line x1="67" y1="-12" x2="90" y2="-65" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2,2" />
                      </g>

                      <g
                        transform="translate(430, 330)"
                        className="cursor-pointer"
                        onClick={() => setActiveCellOrganelle('sarcolemma')}
                      >
                        <rect x="-5" y="-12" width="135" height="22" rx="11" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" />
                        <text x="62" y="3" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Sarcolemma Membrane
                        </text>
                        <line x1="62" y1="-12" x2="40" y2="-35" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="2,2" />
                      </g>
                    </svg>

                    {/* Cell Actions Toolbar */}
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        onClick={triggerCellActionPotential}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
                      >
                        <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                        <span>Stimulate Action Potential (Twitch)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ---------------- LEVEL 2: TISSUE (CARDIAC MUSCLE TISSUE) ---------------- */}
                {currentLevel === 2 && (
                  <div className="w-full max-w-xl h-full flex flex-col items-center justify-center">
                    <svg viewBox="0 0 700 420" className="w-full h-auto max-h-[380px] drop-shadow-2xl">
                      <defs>
                        <linearGradient id="tissueFiber1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#7e22ce" />
                          <stop offset="100%" stopColor="#9333ea" />
                        </linearGradient>
                        <linearGradient id="tissueFiber2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6b21a8" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                        {/* Action Potential Wave Gradient */}
                        <linearGradient id="apWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
                          <stop offset="50%" stopColor="#fef08a" stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Syncytium: 5 Branching & Interconnected Muscle Fibers */}
                      {/* Fiber Row 1 */}
                      <path
                        d="M 60 110 Q 180 95, 300 110 T 540 100 L 640 105 L 640 155 L 530 150 Q 420 165, 300 150 T 60 155 Z"
                        fill="url(#tissueFiber1)"
                        stroke="#c084fc"
                        strokeWidth="2"
                      />
                      {/* Fiber Row 2 (Branching upward and downward) */}
                      <path
                        d="M 60 170 Q 160 170, 240 185 Q 320 200, 420 175 L 640 170 L 640 220 L 430 225 Q 320 240, 220 225 T 60 215 Z"
                        fill="url(#tissueFiber2)"
                        stroke="#c084fc"
                        strokeWidth="2"
                      />
                      {/* Diagonal Branch connecting Row 1 & Row 2 */}
                      <path
                        d="M 230 148 L 290 148 L 330 185 L 270 185 Z"
                        fill="#7e22ce"
                        stroke="#c084fc"
                        strokeWidth="1.5"
                      />

                      {/* Fiber Row 3 */}
                      <path
                        d="M 60 235 Q 170 245, 290 230 T 520 240 L 640 235 L 640 285 L 510 290 Q 380 275, 270 290 T 60 280 Z"
                        fill="url(#tissueFiber1)"
                        stroke="#c084fc"
                        strokeWidth="2"
                      />
                      {/* Diagonal Branch connecting Row 2 & Row 3 */}
                      <path
                        d="M 410 220 L 460 220 L 490 245 L 440 245 Z"
                        fill="#7e22ce"
                        stroke="#c084fc"
                        strokeWidth="1.5"
                      />

                      {/* Fiber Row 4 */}
                      <path
                        d="M 60 300 Q 200 295, 330 305 T 640 300 L 640 350 L 330 355 Q 190 345, 60 350 Z"
                        fill="url(#tissueFiber2)"
                        stroke="#c084fc"
                        strokeWidth="2"
                      />

                      {/* Striations across tissue fibers */}
                      {[100, 140, 180, 220, 260, 300, 340, 380, 420, 460, 500, 540, 580].map((xPos, idx) => (
                        <g key={idx} opacity="0.4">
                          <line x1={xPos} y1="105" x2={xPos} y2="152" stroke="#e9d5ff" strokeWidth="1.5" />
                          <line x1={xPos} y1="172" x2={xPos} y2="222" stroke="#e9d5ff" strokeWidth="1.5" />
                          <line x1={xPos} y1="237" x2={xPos} y2="287" stroke="#e9d5ff" strokeWidth="1.5" />
                          <line x1={xPos} y1="302" x2={xPos} y2="352" stroke="#e9d5ff" strokeWidth="1.5" />
                        </g>
                      ))}

                      {/* Multiple Nuclei across individual cells in the tissue */}
                      {[
                        { x: 170, y: 132 },
                        { x: 440, y: 128 },
                        { x: 150, y: 195 },
                        { x: 520, y: 195 },
                        { x: 190, y: 260 },
                        { x: 380, y: 260 },
                        { x: 230, y: 328 },
                        { x: 490, y: 325 }
                      ].map((nuc, idx) => (
                        <g key={idx}>
                          <ellipse cx={nuc.x} cy={nuc.y} rx="18" ry="10" fill="#312e81" stroke="#a5b4fc" strokeWidth="1.5" />
                          <circle cx={nuc.x - 3} cy={nuc.y - 1} r="4" fill="#818cf8" />
                        </g>
                      ))}

                      {/* Intercalated Discs (Zigzag Partition Lines with Glowing Gap Junctions) */}
                      {[
                        { x: 240, y1: 105, y2: 152 },
                        { x: 480, y1: 103, y2: 152 },
                        { x: 350, y1: 175, y2: 222 },
                        { x: 570, y1: 172, y2: 220 },
                        { x: 230, y1: 235, y2: 285 },
                        { x: 450, y1: 235, y2: 288 },
                        { x: 370, y1: 302, y2: 352 }
                      ].map((disc, idx) => (
                        <g
                          key={idx}
                          className="cursor-pointer"
                          onClick={() => setShowGapJunctionZoom(true)}
                        >
                          <line
                            x1={disc.x}
                            y1={disc.y1}
                            x2={disc.y2}
                            stroke="#06b6d4"
                            strokeWidth="4"
                            strokeDasharray="4,2"
                          />
                          <circle cx={disc.x} cy={(disc.y1 + disc.y2) / 2} r="5" fill="#38bdf8" className="animate-ping" />
                          <circle cx={disc.x} cy={(disc.y1 + disc.y2) / 2} r="3" fill="#ffffff" />
                        </g>
                      ))}

                      {/* Dynamic Action Potential Wave Simulation Passing through Syncytium */}
                      <g className="pointer-events-none">
                        <rect
                          key={tissuePulseTrigger}
                          x="40"
                          y="90"
                          width="120"
                          height="280"
                          fill="url(#apWaveGrad)"
                          rx="20"
                          className="animate-[pulse_1.5s_ease-in-out_infinite]"
                          opacity="0.75"
                        />
                      </g>

                      {/* Label Callouts */}
                      <g transform="translate(240, 55)">
                        <rect x="-5" y="-12" width="180" height="22" rx="11" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
                        <text x="85" y="3" fill="#e9d5ff" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Branching Myocardial Syncytium
                        </text>
                      </g>

                      <g
                        transform="translate(490, 55)"
                        className="cursor-pointer"
                        onClick={() => setShowGapJunctionZoom(true)}
                      >
                        <rect x="-5" y="-12" width="170" height="22" rx="11" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                        <text x="80" y="3" fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Intercalated Discs (Click)
                        </text>
                        <line x1="80" y1="10" x2="0" y2="60" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2,2" />
                      </g>
                    </svg>

                    {/* Tissue Controls */}
                    <div className="flex items-center gap-3 mt-1 flex-wrap justify-center">
                      <button
                        onClick={triggerTissueWave}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all"
                      >
                        <Zap className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Propagate Electrical Wave</span>
                      </button>

                      <button
                        onClick={() => setShowGapJunctionZoom((prev) => !prev)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
                      >
                        <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{showGapJunctionZoom ? 'Hide Gap Junctions' : 'Zoom Gap Junctions'}</span>
                      </button>
                    </div>

                    {/* Gap Junction Micro-Callout Modal/Drawer */}
                    {showGapJunctionZoom && (
                      <div className="mt-3 p-3.5 rounded-xl bg-slate-950/95 border border-cyan-500/50 shadow-2xl max-w-lg w-full flex items-center gap-4 animate-in fade-in zoom-in-95">
                        <div className="w-16 h-16 rounded-xl bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center flex-shrink-0">
                          <div className="grid grid-cols-2 gap-1 p-1">
                            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                          </div>
                        </div>
                        <div className="text-left text-xs">
                          <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
                            <span>Intercalated Disc Ultrastructure</span>
                            <span className="text-[10px] bg-cyan-500/20 px-1.5 py-0.5 rounded text-cyan-200">
                              Connexons
                            </span>
                          </h4>
                          <p className="text-slate-300 mt-0.5">
                            Low-resistance <strong className="text-white">gap junctions</strong> let Na⁺ and Ca²⁺ ions
                            pour directly from one cell's cytosol into the next without neurotransmitter delays.
                            Mechanical <strong className="text-white">desmosomes</strong> rivet cell membranes together.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowGapJunctionZoom(false)}
                          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ---------------- LEVEL 3: ORGAN (THE HEART) ---------------- */}
                {currentLevel === 3 && (
                  <div className="w-full max-w-xl h-full flex flex-col items-center justify-center">
                    <svg viewBox="0 0 700 440" className="w-full h-auto max-h-[380px] drop-shadow-2xl">
                      <defs>
                        <radialGradient id="leftVentricleGrad" cx="50%" cy="50%" r="60%">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="80%" stopColor="#991b1b" />
                          <stop offset="100%" stopColor="#450a0a" />
                        </radialGradient>
                        <radialGradient id="rightVentricleGrad" cx="50%" cy="50%" r="60%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="80%" stopColor="#0284c7" />
                          <stop offset="100%" stopColor="#082f49" />
                        </radialGradient>
                        <linearGradient id="aortaGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="#dc2626" />
                          <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                      </defs>

                      {/* Main Heart Muscle Silhouette (Pulsates on Systole / Diastole) */}
                      <g
                        transform="translate(350, 230)"
                        style={{
                          transform:
                            heartPhase === 'systole'
                              ? 'translate(350px, 230px) scale(0.96)'
                              : 'translate(350px, 230px) scale(1.02)',
                          transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                      >
                        {/* Great Vessels: Superior Vena Cava & Aorta Arch */}
                        {/* Superior Vena Cava (Blue, Deoxygenated) */}
                        <path
                          d="M -110 -150 L -75 -150 L -75 -70 L -110 -70 Z"
                          fill="#0284c7"
                          stroke="#38bdf8"
                          strokeWidth="2"
                        />
                        {/* Pulmonary Trunk & Artery (Blue, branching left & right) */}
                        <path
                          d="M -35 -130 L 15 -130 L 0 -50 L -40 -50 Z"
                          fill="#0369a1"
                          stroke="#38bdf8"
                          strokeWidth="2"
                        />
                        {/* Aorta Arch (Red, Oxygenated, with 3 Branching Arteries) */}
                        <path
                          d="M -40 -70 C -40 -160, 80 -160, 80 -70 L 60 -50 C 60 -130, -20 -130, -20 -50 Z"
                          fill="url(#aortaGrad)"
                          stroke="#fca5a5"
                          strokeWidth="2.5"
                        />
                        {/* 3 Aortic Arch Branches (Brachiocephalic, Carotid, Subclavian) */}
                        <rect x="-10" y="-170" width="12" height="30" rx="3" fill="#ef4444" stroke="#fca5a5" />
                        <rect x="15" y="-175" width="12" height="35" rx="3" fill="#ef4444" stroke="#fca5a5" />
                        <rect x="40" y="-170" width="12" height="30" rx="3" fill="#ef4444" stroke="#fca5a5" />

                        {/* Outer Myocardium Muscular Wall */}
                        <path
                          d="M 0 -70 
                             C -140 -80, -180 50, -120 120 
                             C -70 170, -20 185, 0 200 
                             C 20 185, 90 170, 140 120 
                             C 190 50, 150 -80, 0 -70 Z"
                          fill="#7f1d1d"
                          stroke="#ef4444"
                          strokeWidth="5"
                        />

                        {/* Right Atrium (RA) - Blue */}
                        <path
                          d="M -130 -40 C -150 10, -110 40, -60 40 L -60 -40 Z"
                          fill="url(#rightVentricleGrad)"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          className="cursor-pointer hover:brightness-125"
                          onClick={() => setActiveHeartChamber('RA')}
                        />
                        <text x="-95" y="5" fill="#e0f2fe" fontSize="12" fontWeight="bold" textAnchor="middle">
                          RA
                        </text>

                        {/* Right Ventricle (RV) - Blue */}
                        <path
                          d="M -115 55 C -105 130, -40 155, -10 170 L -10 55 Z"
                          fill="url(#rightVentricleGrad)"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                          className="cursor-pointer hover:brightness-125"
                          onClick={() => setActiveHeartChamber('RV')}
                        />
                        <text x="-55" y="110" fill="#e0f2fe" fontSize="14" fontWeight="bold" textAnchor="middle">
                          RV
                        </text>

                        {/* Thick Muscular Interventricular Septum */}
                        <path d="M -10 40 L 12 40 L 12 185 L -10 185 Z" fill="#991b1b" stroke="#f87171" strokeWidth="2" />

                        {/* Left Atrium (LA) - Red */}
                        <path
                          d="M 60 -40 L 60 40 C 110 40, 150 10, 130 -40 Z"
                          fill="url(#leftVentricleGrad)"
                          stroke="#f87171"
                          strokeWidth="2"
                          className="cursor-pointer hover:brightness-125"
                          onClick={() => setActiveHeartChamber('LA')}
                        />
                        <text x="95" y="5" fill="#fee2e2" fontSize="12" fontWeight="bold" textAnchor="middle">
                          LA
                        </text>

                        {/* Left Ventricle (LV) - Red, Thickest Muscle Myocardium */}
                        <path
                          d="M 12 55 L 12 170 C 45 155, 120 130, 125 55 Z"
                          fill="url(#leftVentricleGrad)"
                          stroke="#f87171"
                          strokeWidth="3.5"
                          className="cursor-pointer hover:brightness-125"
                          onClick={() => setActiveHeartChamber('LV')}
                        />
                        <text x="65" y="110" fill="#fee2e2" fontSize="14" fontWeight="bold" textAnchor="middle">
                          LV
                        </text>

                        {/* One-Way Heart Valves (Tricuspid & Bicuspid/Mitral) */}
                        {showHeartValves && (
                          <g>
                            {/* Tricuspid Valve flaps (Right AV) */}
                            <line
                              x1="-85"
                              y1="45"
                              x2="-65"
                              y2={heartPhase === 'systole' ? '45' : '58'}
                              stroke="#fef08a"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />
                            {/* Bicuspid / Mitral Valve flaps (Left AV) */}
                            <line
                              x1="65"
                              y1="45"
                              x2="85"
                              y2={heartPhase === 'systole' ? '45' : '58'}
                              stroke="#fef08a"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />
                          </g>
                        )}

                        {/* Blood Flow Direction Arrows */}
                        <g opacity="0.8">
                          {/* Deoxygenated Flow into Pulmonary */}
                          <path
                            d="M -55 80 Q -55 20, -20 -80"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="2"
                            strokeDasharray="4,3"
                          />
                          {/* Oxygenated Flow into Aorta */}
                          <path
                            d="M 65 80 Q 55 10, 20 -90"
                            fill="none"
                            stroke="#fca5a5"
                            strokeWidth="2.5"
                            strokeDasharray="4,3"
                          />
                        </g>
                      </g>

                      {/* External Label Pins */}
                      <g transform="translate(80, 80)">
                        <rect x="-5" y="-12" width="155" height="22" rx="11" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                        <text x="72" y="3" fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Right Heart (Pulmonary)
                        </text>
                      </g>

                      <g transform="translate(480, 80)">
                        <rect x="-5" y="-12" width="155" height="22" rx="11" fill="#1e293b" stroke="#f87171" strokeWidth="1.5" />
                        <text x="72" y="3" fill="#fecaca" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Left Heart (Systemic)
                        </text>
                      </g>

                      <g transform="translate(250, 410)">
                        <rect x="-5" y="-12" width="200" height="24" rx="12" fill="#0f172a" stroke="#e2e8f0" strokeWidth="1.5" />
                        <text x="95" y="4" fill="#f8fafc" fontSize="11" fontWeight="extrabold" textAnchor="middle">
                          Current Phase: {heartPhase.toUpperCase()} ({heartBpm} BPM)
                        </text>
                      </g>
                    </svg>

                    {/* Heart Interactive Controls */}
                    <div className="flex items-center gap-4 mt-1 flex-wrap justify-center">
                      <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                        <span className="text-xs font-bold text-slate-300">Heart Rate:</span>
                        <input
                          type="range"
                          min="45"
                          max="160"
                          value={heartBpm}
                          onChange={(e) => setHeartBpm(parseInt(e.target.value))}
                          className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                        <span className="font-mono text-xs font-bold text-rose-400 w-12">{heartBpm} BPM</span>
                      </div>

                      <button
                        onClick={() => setShowHeartValves((prev) => !prev)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          showHeartValves
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        Valves: {showHeartValves ? 'Visible' : 'Hidden'}
                      </button>
                    </div>

                    {/* Active Chamber Inspector Callout */}
                    {activeHeartChamber && (
                      <div className="mt-2.5 p-3 rounded-xl bg-slate-900 border border-slate-700 text-left text-xs max-w-md w-full flex items-center justify-between">
                        <div>
                          <strong className="text-rose-400">
                            {activeHeartChamber === 'RA' && 'Right Atrium (RA)'}
                            {activeHeartChamber === 'RV' && 'Right Ventricle (RV)'}
                            {activeHeartChamber === 'LA' && 'Left Atrium (LA)'}
                            {activeHeartChamber === 'LV' && 'Left Ventricle (LV)'}
                          </strong>
                          <p className="text-slate-300 mt-0.5">
                            {activeHeartChamber === 'RA' && 'Receives deoxygenated blood returning from systemic body veins via Vena Cava.'}
                            {activeHeartChamber === 'RV' && 'Pumps deoxygenated blood under moderate pressure to lungs via Pulmonary Artery.'}
                            {activeHeartChamber === 'LA' && 'Receives freshly oxygenated blood returning from the lungs via Pulmonary Veins.'}
                            {activeHeartChamber === 'LV' && 'Thickest muscular chamber; generates 120 mmHg systolic pressure to drive blood throughout the entire body.'}
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveHeartChamber(null)}
                          className="p-1 text-slate-500 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ---------------- LEVEL 4: ORGAN SYSTEM (CIRCULATORY SYSTEM) ---------------- */}
                {currentLevel === 4 && (
                  <div className="w-full max-w-xl h-full flex flex-col items-center justify-center">
                    <svg viewBox="0 0 700 450" className="w-full h-auto max-h-[380px] drop-shadow-2xl">
                      {/* Body Silhouette Outline (Human Figure) */}
                      <path
                        d="M 350 40 
                           C 330 40, 320 60, 320 80 
                           C 320 100, 335 115, 340 125 
                           C 310 135, 270 150, 245 200 
                           L 220 290 L 245 300 L 270 230 
                           L 285 240 L 275 420 L 315 420 
                           L 340 290 L 360 290 L 385 420 L 425 420 
                           L 415 240 L 430 230 L 455 300 L 480 290 
                           L 455 200 C 430 150, 390 135, 360 125 
                           C 365 115, 380 100, 380 80 
                           C 380 60, 370 40, 350 40 Z"
                        fill="#0f172a"
                        stroke="#334155"
                        strokeWidth="2.5"
                        opacity="0.85"
                      />

                      {/* Central Heart Pump in Thorax */}
                      <circle cx="350" cy="180" r="18" fill="#ef4444" className="animate-ping" opacity="0.4" />
                      <circle cx="350" cy="180" r="15" fill="#b91c1c" stroke="#fca5a5" strokeWidth="2" />
                      <text x="350" y="184" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                        Heart
                      </text>

                      {/* PULMONARY CIRCUIT (Lungs) */}
                      {(circuitHighlight === 'all' || circuitHighlight === 'pulmonary') && (
                        <g>
                          {/* Right Lung Capillary Bed */}
                          <ellipse
                            cx="295"
                            cy="175"
                            rx="25"
                            ry="35"
                            fill="#0284c7"
                            fillOpacity="0.25"
                            stroke="#38bdf8"
                            strokeWidth="1.5"
                            strokeDasharray="3,3"
                            className="cursor-pointer hover:fill-opacity-50"
                            onClick={() => setActiveCapillaryBed('lungs')}
                          />
                          {/* Left Lung Capillary Bed */}
                          <ellipse
                            cx="405"
                            cy="175"
                            rx="25"
                            ry="35"
                            fill="#0284c7"
                            fillOpacity="0.25"
                            stroke="#38bdf8"
                            strokeWidth="1.5"
                            strokeDasharray="3,3"
                            className="cursor-pointer hover:fill-opacity-50"
                            onClick={() => setActiveCapillaryBed('lungs')}
                          />
                          {/* Pulmonary Arteries (Blue, to lungs) */}
                          <path d="M 340 175 L 305 175" stroke="#38bdf8" strokeWidth="3" fill="none" />
                          <path d="M 360 175 L 395 175" stroke="#38bdf8" strokeWidth="3" fill="none" />
                          {/* Pulmonary Veins (Red, from lungs to heart) */}
                          <path d="M 305 185 L 340 185" stroke="#ef4444" strokeWidth="3" fill="none" />
                          <path d="M 395 185 L 360 185" stroke="#ef4444" strokeWidth="3" fill="none" />
                        </g>
                      )}

                      {/* SYSTEMIC CIRCUIT (Head, Viscera, Kidneys, Limbs) */}
                      {(circuitHighlight === 'all' || circuitHighlight === 'systemic') && (
                        <g>
                          {/* Head / Brain Capillary Loop */}
                          <path d="M 353 165 L 353 75" stroke="#ef4444" strokeWidth="3.5" fill="none" />
                          <ellipse
                            cx="350"
                            cy="75"
                            rx="20"
                            ry="16"
                            fill="#ec4899"
                            fillOpacity="0.25"
                            stroke="#f43f5e"
                            strokeWidth="1.5"
                            className="cursor-pointer hover:fill-opacity-50"
                            onClick={() => setActiveCapillaryBed('brain')}
                          />
                          <path d="M 347 75 L 347 165" stroke="#0284c7" strokeWidth="3.5" fill="none" />

                          {/* Upper Limbs Arteries/Veins */}
                          <path d="M 353 170 Q 300 175, 240 270" stroke="#ef4444" strokeWidth="2.5" fill="none" />
                          <path d="M 245 272 Q 305 180, 347 175" stroke="#0284c7" strokeWidth="2.5" fill="none" />

                          <path d="M 353 170 Q 400 175, 460 270" stroke="#ef4444" strokeWidth="2.5" fill="none" />
                          <path d="M 455 272 Q 395 180, 347 175" stroke="#0284c7" strokeWidth="2.5" fill="none" />

                          {/* Abdominal Aorta & Inferior Vena Cava Trunk */}
                          <path d="M 353 195 L 353 285" stroke="#ef4444" strokeWidth="4" fill="none" />
                          <path d="M 347 285 L 347 195" stroke="#0284c7" strokeWidth="4" fill="none" />

                          {/* Visceral / Liver / Kidney Capillary Beds */}
                          <ellipse
                            cx="375"
                            cy="235"
                            rx="18"
                            ry="12"
                            fill="#f59e0b"
                            fillOpacity="0.25"
                            stroke="#fbbf24"
                            strokeWidth="1.5"
                            className="cursor-pointer"
                            onClick={() => setActiveCapillaryBed('digestive')}
                          />
                          <ellipse
                            cx="325"
                            cy="245"
                            rx="15"
                            ry="10"
                            fill="#10b981"
                            fillOpacity="0.25"
                            stroke="#34d399"
                            strokeWidth="1.5"
                            className="cursor-pointer"
                            onClick={() => setActiveCapillaryBed('kidneys')}
                          />

                          {/* Lower Limbs (Iliac / Femoral Vessels) */}
                          <path d="M 353 285 Q 330 330, 305 410" stroke="#ef4444" strokeWidth="3" fill="none" />
                          <path d="M 300 410 Q 325 330, 347 285" stroke="#0284c7" strokeWidth="3" fill="none" />

                          <path d="M 353 285 Q 370 330, 395 410" stroke="#ef4444" strokeWidth="3" fill="none" />
                          <path d="M 400 410 Q 375 330, 347 285" stroke="#0284c7" strokeWidth="3" fill="none" />
                        </g>
                      )}

                      {/* Moving Blood Particles (Erythrocytes) */}
                      <circle cx="353" cy="120" r="3" fill="#fca5a5" className="animate-ping" />
                      <circle cx="347" cy="120" r="3" fill="#7dd3fc" className="animate-ping" />
                      <circle cx="353" cy="240" r="3" fill="#fca5a5" className="animate-ping" />
                      <circle cx="347" cy="240" r="3" fill="#7dd3fc" className="animate-ping" />

                      {/* Legend */}
                      <g transform="translate(60, 360)">
                        <rect x="0" y="0" width="165" height="70" rx="12" fill="#0f172a" stroke="#334155" />
                        <line x1="15" y1="20" x2="45" y2="20" stroke="#ef4444" strokeWidth="3" />
                        <text x="55" y="23" fill="#fecaca" fontSize="10" fontWeight="bold">
                          Arteries (O₂-rich)
                        </text>
                        <line x1="15" y1="42" x2="45" y2="42" stroke="#0284c7" strokeWidth="3" />
                        <text x="55" y="45" fill="#bae6fd" fontSize="10" fontWeight="bold">
                          Veins (Deoxygenated)
                        </text>
                      </g>
                    </svg>

                    {/* Circuit Filter Controls */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => setCircuitHighlight('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          circuitHighlight === 'all'
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        All Circuits
                      </button>
                      <button
                        onClick={() => setCircuitHighlight('pulmonary')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          circuitHighlight === 'pulmonary'
                            ? 'bg-sky-500 text-slate-950 border-sky-400 font-extrabold'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        Pulmonary (Lungs)
                      </button>
                      <button
                        onClick={() => setCircuitHighlight('systemic')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          circuitHighlight === 'systemic'
                            ? 'bg-rose-500 text-white border-rose-400 font-extrabold'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        Systemic (Body Loop)
                      </button>
                    </div>

                    {/* Capillary Bed Inspection Box */}
                    {activeCapillaryBed && (
                      <div className="mt-2.5 p-3 rounded-xl bg-slate-900 border border-slate-700 text-left text-xs max-w-md w-full flex items-center justify-between">
                        <div>
                          <strong className="text-cyan-400">
                            {activeCapillaryBed === 'lungs' && 'Pulmonary Capillaries (Alveoli)'}
                            {activeCapillaryBed === 'brain' && 'Cerebral Capillary Network (Brain)'}
                            {activeCapillaryBed === 'digestive' && 'Mesenteric & Hepatic Portal Capillaries'}
                            {activeCapillaryBed === 'kidneys' && 'Renal Glomerular Capillaries (Kidneys)'}
                          </strong>
                          <p className="text-slate-300 mt-0.5">
                            {activeCapillaryBed === 'lungs' && 'Blood discharges CO₂ waste into exhaled air and binds fresh O₂ onto red blood cell hemoglobin.'}
                            {activeCapillaryBed === 'brain' && 'Continuous high-priority delivery of glucose and oxygen; consumes ~20% of resting cardiac output.'}
                            {activeCapillaryBed === 'digestive' && 'Picks up absorbed amino acids, sugars, and vitamins from intestines and transports them to the liver.'}
                            {activeCapillaryBed === 'kidneys' && 'Filters blood plasma under high hydrostatic pressure to excrete urea, excess salts, and water.'}
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveCapillaryBed(null)}
                          className="p-1 text-slate-500 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ---------------- LEVEL 5: ORGANISM (WHOLE HUMAN BEING) ---------------- */}
                {currentLevel === 5 && (
                  <div className="w-full max-w-xl h-full flex flex-col items-center justify-center">
                    <svg viewBox="0 0 700 450" className="w-full h-auto max-h-[380px] drop-shadow-2xl">
                      {/* Integrated Human Figure with Anatomical System Overlays */}
                      <g transform="translate(350, 220)">
                        {/* 1. Skin & Body Outline (Whole Living Organism) */}
                        <path
                          d="M 0 -170 
                             C -20 -170, -32 -150, -32 -130 
                             C -32 -110, -18 -95, -12 -85 
                             C -40 -75, -75 -60, -100 -10 
                             L -125 80 L -100 90 L -75 20 
                             L -60 30 L -70 210 L -30 210 
                             L -10 80 L 10 80 L 30 210 L 70 210 
                             L 60 30 L 75 20 L 100 90 L 125 80 
                             L 100 -10 C 75 -60, 40 -75, 12 -85 
                             C 18 -95, 32 -110, 32 -130 
                             C 32 -150, 20 -170, 0 -170 Z"
                          fill="#1e293b"
                          stroke="#10b981"
                          strokeWidth="3"
                          className="drop-shadow-lg"
                        />

                        {/* 2. Nervous System Overlay (Brain + Spinal Axis) */}
                        {(activeSystemLayer === 'all' || activeSystemLayer === 'nervous') && (
                          <g>
                            <circle cx="0" cy="-140" r="16" fill="#fbbf24" fillOpacity="0.4" stroke="#f59e0b" strokeWidth="2" />
                            <line x1="0" y1="-124" x2="0" y2="40" stroke="#fbbf24" strokeWidth="3" strokeDasharray="3,2" />
                            <line x1="0" y1="-70" x2="-60" y2="0" stroke="#fbbf24" strokeWidth="1.5" />
                            <line x1="0" y1="-70" x2="60" y2="0" stroke="#fbbf24" strokeWidth="1.5" />
                            <line x1="0" y1="30" x2="-35" y2="150" stroke="#fbbf24" strokeWidth="1.5" />
                            <line x1="0" y1="30" x2="35" y2="150" stroke="#fbbf24" strokeWidth="1.5" />
                          </g>
                        )}

                        {/* 3. Respiratory System Overlay (Lungs & Trachea) */}
                        {(activeSystemLayer === 'all' || activeSystemLayer === 'respiratory') && (
                          <g>
                            <line x1="0" y1="-110" x2="0" y2="-65" stroke="#38bdf8" strokeWidth="3.5" />
                            <ellipse cx="-25" cy="-45" rx="18" ry="26" fill="#38bdf8" fillOpacity="0.35" stroke="#0284c7" strokeWidth="1.5" />
                            <ellipse cx="25" cy="-45" rx="18" ry="26" fill="#38bdf8" fillOpacity="0.35" stroke="#0284c7" strokeWidth="1.5" />
                          </g>
                        )}

                        {/* 4. Cardiovascular System Overlay (Beating Heart & Main Arteries) */}
                        {(activeSystemLayer === 'all' || activeSystemLayer === 'circulatory') && (
                          <g>
                            <circle
                              cx="4"
                              cy="-42"
                              r={exerciseState === 'vigorous' ? '16' : exerciseState === 'moderate' ? '14' : '12'}
                              fill="#ef4444"
                              stroke="#fca5a5"
                              strokeWidth="2"
                              className="animate-pulse"
                            />
                            <path d="M 4 -30 L 4 35 L -30 180" stroke="#ef4444" strokeWidth="2" fill="none" />
                            <path d="M 4 -30 L 4 35 L 30 180" stroke="#ef4444" strokeWidth="2" fill="none" />
                          </g>
                        )}

                        {/* Homeostatic Feedback Loops Glowing Particles */}
                        <circle cx="0" cy="-40" r="45" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4,4" className="animate-spin" style={{ animationDuration: '8s' }} />
                      </g>

                      {/* Organism Vitals Monitor Overlay */}
                      <g transform="translate(480, 50)">
                        <rect x="0" y="0" width="180" height="150" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                        <text x="14" y="24" fill="#10b981" fontSize="11" fontWeight="extrabold">
                          HOMEOSTATIC VITALS
                        </text>

                        <text x="14" y="50" fill="#94a3b8" fontSize="10">Heart Rate:</text>
                        <text x="165" y="50" fill="#f87171" fontSize="11" fontWeight="bold" textAnchor="end">
                          {heartBpm} BPM
                        </text>

                        <text x="14" y="75" fill="#94a3b8" fontSize="10">Respiration Rate:</text>
                        <text x="165" y="75" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="end">
                          {exerciseState === 'vigorous' ? '38' : exerciseState === 'moderate' ? '22' : '14'} /min
                        </text>

                        <text x="14" y="100" fill="#94a3b8" fontSize="10">Cellular ATP Demand:</text>
                        <text x="165" y="100" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="end">
                          {exerciseState === 'vigorous' ? '5.8×' : exerciseState === 'moderate' ? '2.4×' : '1.0×'}
                        </text>

                        <text x="14" y="125" fill="#94a3b8" fontSize="10">Blood O₂ Saturation:</text>
                        <text x="165" y="125" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="end">
                          98%
                        </text>
                      </g>

                      {/* Hierarchy Completion Badge */}
                      <g transform="translate(60, 50)">
                        <rect x="0" y="0" width="160" height="85" rx="14" fill="#064e3b" stroke="#059669" strokeWidth="1.5" />
                        <text x="14" y="24" fill="#6ee7b7" fontSize="11" fontWeight="extrabold">
                          ORGANISM LEVEL
                        </text>
                        <text x="14" y="44" fill="#ecfdf5" fontSize="10">
                          11 Systems Unified
                        </text>
                        <text x="14" y="65" fill="#a7f3d0" fontSize="9">
                          Maintains Homeostasis
                        </text>
                      </g>
                    </svg>

                    {/* Organism Dynamic State Simulator Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 mt-1 justify-center w-full">
                      <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <span className="text-xs font-bold text-slate-400 px-2">Physiological State:</span>
                        {(['rest', 'moderate', 'vigorous']).map((st) => (
                          <button
                            key={st}
                            onClick={() => setExerciseState(st)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                              exerciseState === st
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <span className="text-xs font-bold text-slate-400 px-2">Layer:</span>
                        {(['all', 'circulatory', 'respiratory', 'nervous']).map((layer) => (
                          <button
                            key={layer}
                            onClick={() => setActiveSystemLayer(layer)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                              activeSystemLayer === layer
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {layer}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Canvas Context Bar */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{curData.description}</span>
                </div>
                <span className="font-mono text-slate-400 font-semibold text-right">
                  Magnification: {curData.magnification}
                </span>
              </div>
            </div>

            {/* Right Educational Deep Dive & Inspector Panel */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Emergent Property Deep Dive Card */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400">
                      Why Subordinate Levels Cannot
                    </span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 font-bold">
                      Grade 10 Focus
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white mt-1.5">
                    Hierarchy Principle
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {curData.whySubordinateCannot}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Key Structural Hallmarks:</h4>
                  <ul className="mt-2 space-y-2">
                    {curData.structuralFeatures.map((feat, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-200">{feat.name}:</strong>{' '}
                          <span className="text-slate-400">{feat.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Organelle / Component Inspector Output */}
              {currentLevel === 1 && activeCellOrganelle && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-pink-500/40 shadow-xl animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-pink-400">
                      Organelle Focus: {activeCellOrganelle.toUpperCase()}
                    </h4>
                    <button onClick={() => setActiveCellOrganelle(null)} className="text-slate-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {activeCellOrganelle === 'nucleus' &&
                      'Houses chromosomal DNA encoding structural sarcomeric proteins (actin, myosin) and cardiac ion channels. Governs cellular adaptation to physical conditioning.'}
                    {activeCellOrganelle === 'mitochondria' &&
                      'Fills ~40% of the cardiomyocyte volume. Continuously synthesizes massive quantities of ATP via aerobic oxidative phosphorylation to prevent muscle fatigue.'}
                    {activeCellOrganelle === 'striations' &&
                      'Alternating light (I) and dark (A) bands of actin and myosin. When stimulated by Ca²⁺, cross-bridges cycle to pull Z-lines inward, shortening the cell.'}
                    {activeCellOrganelle === 'intercalated' &&
                      'Specialized cell borders containing mechanical desmosomes (anchoring rivets) and electrical gap junctions (connexon channels).' }
                    {activeCellOrganelle === 'sarcolemma' &&
                      'Excitable plasma membrane maintaining resting membrane potentials (~ -90 mV) and propagating rapid depolarizations via voltage-gated Na⁺ and Ca²⁺ channels.'}
                  </p>
                </div>
              )}

              {/* Whole Hierarchy Mini Stepper Preview */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                  5-Level Hierarchy Roadmap
                </h4>
                <div className="space-y-1.5">
                  {LEVELS_DATA.map((lvl) => {
                    const isSelected = currentLevel === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => changeLevel(lvl.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-sm'
                            : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black"
                            style={{
                              backgroundColor: `${lvl.color}25`,
                              color: lvl.color
                            }}
                          >
                            {lvl.id}
                          </span>
                          <span>{lvl.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{lvl.scale}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STRUCTURAL ANATOMY */}
        {activeTab === 'anatomy' && (
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-black text-white">
                Detailed Anatomy: {curData.name} ({curData.example})
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Explore the cellular and architectural components that collaborate to produce the emergent functions observed at Level {currentLevel}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {curData.structuralFeatures.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-sm"
                    style={{ backgroundColor: `${curData.color}20`, color: curData.color }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  The Principle of Emergence in Biological Systems
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Emergence occurs because novel interactions arise between components when assembled in specific geometrical arrangements.
                  Just as individual letters have no meaning until assembled into words and sentences, individual biomolecules and organelles
                  lack life until integrated into a cell, and individual cells cannot pump blood until integrated into a 4-chambered heart.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HIERARCHY COMPARISON MATRIX */}
        {activeTab === 'matrix' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-x-auto">
            <h2 className="text-lg font-black text-white mb-2">
              Comprehensive Hierarchy Matrix (Level 1 → Level 5)
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Direct comparison of scale, constituent units, and emergent properties across all five levels of biological organization.
            </p>

            <table className="w-full text-left text-xs border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-3">Level #</th>
                  <th className="py-3 px-3">Biological Rank</th>
                  <th className="py-3 px-3">Example Unit</th>
                  <th className="py-3 px-3">Approx. Scale</th>
                  <th className="py-3 px-3">Emergent Property</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {LEVELS_DATA.map((lvl) => (
                  <tr
                    key={lvl.id}
                    onClick={() => {
                      changeLevel(lvl.id);
                      setActiveTab('visual');
                    }}
                    className={`cursor-pointer transition-colors ${
                      currentLevel === lvl.id ? 'bg-slate-800/80 font-semibold' : 'hover:bg-slate-900'
                    }`}
                  >
                    <td className="py-3 px-3 font-bold" style={{ color: lvl.color }}>
                      Level {lvl.id}
                    </td>
                    <td className="py-3 px-3 text-white font-bold">{lvl.name}</td>
                    <td className="py-3 px-3 text-slate-300">{lvl.example}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{lvl.scale}</td>
                    <td className="py-3 px-3 text-slate-200">{lvl.emergentProperty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: INTERACTIVE CONCEPT CHECK / QUIZ */}
        {activeTab === 'quiz' && (
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-black text-white">
                  Knowledge Check: Levels of Biological Organization
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Test your mastery of biological hierarchies and emergent properties for Grade 10 Biology.
                </p>
              </div>

              {quizSubmitted && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Score: {quizScore} / {QUIZ_QUESTIONS.length} Correct</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {QUIZ_QUESTIONS.map((q, qIndex) => {
                const selectedOpt = quizAnswers[q.id];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = selectedOpt === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {qIndex + 1}
                      </span>
                      <p className="text-sm font-bold text-white leading-snug">{q.question}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pl-8">
                      {q.options.map((opt, optIndex) => {
                        let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800';

                        if (quizSubmitted) {
                          if (optIndex === q.correctIndex) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                          } else if (selectedOpt === optIndex) {
                            btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                          } else {
                            btnStyle = 'bg-slate-950/40 border-slate-850 text-slate-500';
                          }
                        } else if (selectedOpt === optIndex) {
                          btnStyle = 'bg-rose-600/30 border-rose-500 text-white font-bold';
                        }

                        return (
                          <button
                            key={optIndex}
                            disabled={quizSubmitted}
                            onClick={() => {
                              setQuizAnswers((prev) => ({ ...prev, [q.id]: optIndex }));
                            }}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIndex === q.correctIndex && (
                              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            )}
                            {quizSubmitted && selectedOpt === optIndex && optIndex !== q.correctIndex && (
                              <X className="w-4 h-4 text-rose-400 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="mt-2 pl-8 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                        <strong className="text-slate-200">Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-2">
              {!quizSubmitted ? (
                <button
                  onClick={() => {
                    setQuizSubmitted(true);
                    if (quizScore === QUIZ_QUESTIONS.length) {
                      bioAudio.playSuccess();
                    }
                  }}
                  disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all"
                >
                  Submit Answers
                </button>
              ) : (
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Retry Quiz</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5. FOOTER SUMMARY BAR */}
      <footer className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>VLearn Simulation Engine · Grade 10 Biology Standard Compliant</span>
        </div>
        <div>
          <span>Cardiac Continuum: Myocyte → Myocardium → Heart → Circulatory System → Human</span>
        </div>
      </footer>
    </div>
  );
}
