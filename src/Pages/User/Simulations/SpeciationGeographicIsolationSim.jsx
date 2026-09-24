import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  CheckCircle2,
  XCircle,
  Info,
  ChevronRight,
  ChevronLeft,
  Award,
  Volume2,
  VolumeX,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  GitBranch,
  Activity,
  Feather,
  Dna,
  Layers,
  Compass
} from 'lucide-react';

// ============================================================================
// SOUND SYNTHESIZER (Web Audio API - Safe & Lightweight)
// ============================================================================
class SpeciationAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch {
      // Audio context disabled
    }
  }

  playNorthSong() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    try {
      // Deep resonant low-frequency booming whistle (~1800Hz down to 1400Hz)
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.35);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore audio restriction
    }
  }

  playSouthSong() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    try {
      // Rapid high-pitched modulated trill (~5800Hz - 6400Hz)
      const now = this.ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const start = now + i * 0.08;
        osc.frequency.setValueAtTime(5800 + (i % 2) * 600, start);
        gain.gain.setValueAtTime(0.06, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.07);
      }
    } catch {
      // Ignore audio restriction
    }
  }

  playMatingSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.07, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.28);
      });
    } catch {
      // Ignore
    }
  }

  playMatingFailure() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    try {
      const now = this.ctx.currentTime;
      const notes = [320, 240];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.06, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.2);
      });
    } catch {
      // Ignore
    }
  }

  playStepClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore
    }
  }
}

const audioEngine = new SpeciationAudioEngine();

// ============================================================================
// KCSE EXAM QUESTIONS ON SPECIATION & GEOGRAPHICAL ISOLATION
// ============================================================================
const KCSE_SPECIATION_QUESTIONS = [
  {
    id: 1,
    question: "Define the term 'Allopatric Speciation' as examined in KCSE Form 4 Biology.",
    options: [
      "Formation of new species in the same geographic territory without physical separation",
      "Evolution of reproductive isolation between populations that are geographically separated by a physical barrier",
      "Immediate genetic duplication causing polyploidy in flowering plants",
      "Sudden artificial selection directed by human plant breeders"
    ],
    correctIndex: 1,
    explanation: "Allopatric speciation occurs when a physical geographic barrier (such as a river, mountain range, or canyon) divides an ancestral population into isolated demes, severing gene flow (Nm = 0). Over generations, independent natural selection and mutations lead to reproductive isolation."
  },
  {
    id: 2,
    question: "Why does geographic isolation by itself NOT automatically constitute speciation?",
    options: [
      "Because animals can easily learn to fly across any mountain or ocean at will",
      "Because geographic barriers only last for one single generation",
      "Because speciation requires evolutionary divergence leading to irreversible reproductive isolation; if secondary contact allows free fertile interbreeding, they remain one species",
      "Because DNA molecules cannot mutate when an organism is physically separated"
    ],
    correctIndex: 2,
    explanation: "Geographic isolation is an extrinsic physical condition that merely initiates the process by halting gene flow. Speciation is biologically complete ONLY when reproductive isolating mechanisms (pre-zygotic or post-zygotic) have evolved, preventing fertile interbreeding upon secondary contact."
  },
  {
    id: 3,
    question: "Which of the following is classified as a PRE-ZYGOTIC reproductive isolating mechanism?",
    options: [
      "Hybrid inviability where hybrid embryos spontaneously abort during cleavage",
      "Hybrid sterility where adult hybrids like mules cannot undergo meiosis",
      "Behavioural isolation where different courtship calls and mating songs are not recognized",
      "Hybrid breakdown where the F2 generation exhibits severe developmental defects"
    ],
    correctIndex: 2,
    explanation: "Pre-zygotic isolating mechanisms prevent the formation of a hybrid zygote. Examples include behavioural isolation (mating rituals/songs), ecological isolation (different microhabitats), temporal isolation (different breeding seasons), and mechanical isolation (incompatible reproductive structures)."
  },
  {
    id: 4,
    question: "In East Africa's Great Rift Valley, how did tectonic faulting and lake formation accelerate cichlid fish speciation?",
    options: [
      "Fish swam into the atmosphere during tectonic earthquakes",
      "Volcanic heat eliminated all DNA variation among aquatic fauna",
      "Rifting subdivided water bodies into isolated basins and rocky shorelines, terminating gene flow and enabling divergent trophic adaptation",
      "Predatory birds forced all fish to convert to terrestrial respiration"
    ],
    correctIndex: 2,
    explanation: "Tectonic activity fragmented ancient water basins into isolated crater lakes and divided rocky shorelines in lakes such as Victoria and Malawi. Severed gene flow combined with intense local ecological selection (algae scraping vs insect feeding) fueled rapid adaptive radiation and allopatric speciation."
  },
  {
    id: 5,
    question: "When two long-separated populations come into secondary contact, what biological observation proves that speciation has definitively occurred?",
    options: [
      "Both populations share identical beak sizes and nesting habits",
      "They freely interbreed and produce healthy, fertile F1 and F2 offspring",
      "They fail to interbreed, or any hybrid offspring are inviable or sterile, maintaining separate gene pools",
      "Both populations merge into an indistinguishable hybrid swarm within two days"
    ],
    correctIndex: 2,
    explanation: "Under the Biological Species Concept (Ernst Mayr), a species is a group of interbreeding natural populations that are reproductively isolated from other such groups. Inability to produce viable, fertile offspring upon secondary contact confirms speciation is complete."
  }
];

// Stages definition
const EVOLUTION_STAGES = [
  {
    id: 1,
    name: '1. Continuous Population',
    subtitle: 'Ancestral Valley • Free Gene Flow',
    description: 'A single, continuous population of finches (Geospiza ancestralis) inhabits a uniform ancestral valley. Gene flow is continuous (Nm > 1), maintaining a shared gene pool with intermediate beak morphology (10.0 mm) and standard courtship songs.',
    geneFlowStatus: 'High Gene Flow (Nm ≈ 18.5)',
    barrierStatus: 'No Barrier (Open Range)',
    contactPossible: true
  },
  {
    id: 2,
    name: '2. Barrier Emergence',
    subtitle: 'River / Canyon Rift • Gene Flow Severed',
    description: 'Catastrophic geological tectonic rifting carves a deep canyon with an impassable rushing river. The ancestral population is physically cleaved into Population A (North) and Population B (South). Gene flow is completely severed (Nm = 0.0).',
    geneFlowStatus: 'Gene Flow Severed (Nm = 0.0)',
    barrierStatus: 'Impassable Rushing Canyon River',
    contactPossible: false
  },
  {
    id: 3,
    name: '3. Divergent Evolution',
    subtitle: 'Different Selection & Independent Mutations',
    description: 'Over thousands of generations in complete isolation, distinct environmental selection pressures and random mutations reshape each gene pool. North Finches adapt to hard nuts with massive crushing beaks, while South Finches adapt to nectar/insects with slender probing beaks.',
    geneFlowStatus: 'Gene Flow Severed (Nm = 0.0)',
    barrierStatus: 'Barrier Maintained (Generational Drift)',
    contactPossible: false
  },
  {
    id: 4,
    name: '4. Secondary Contact',
    subtitle: 'Barrier Removed • Interbreeding Test',
    description: 'Climatic changes cause the river to dry up, forming a land bridge. The two differentiated populations meet in sympatry. Will they interbreed, or have pre-zygotic and post-zygotic barriers made speciation permanent?',
    geneFlowStatus: 'Sympatric Meeting Zone',
    barrierStatus: 'Barrier Dissolved (Land Bridge Reconnected)',
    contactPossible: true
  }
];

export default function SpeciationGeographicIsolationSim({ config = {}, onTelemetry }) {
  // Active Navigation Tab: 'sim' | 'isolation' | 'case_studies' | 'kcse'
  const [activeTab, setActiveTab] = useState('sim');

  // Simulation Stages: 1, 2, 3, 4
  const [stage, setStage] = useState(1);

  // Generations: 100 to 10,000
  const [generations, setGenerations] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  // Environmental parameters (Stage 3 controls)
  const [northSelectionPressure, setNorthSelectionPressure] = useState('high_nuts'); // 'high_nuts' | 'moderate'
  const [southSelectionPressure, setSouthSelectionPressure] = useState('arid_probing'); // 'arid_probing' | 'moderate'
  const [selectedOrganismView, setSelectedOrganismView] = useState('both'); // 'north' | 'south' | 'both'

  // Mating Trial State (Stage 4)
  const [matingTrialState, setMatingTrialState] = useState('idle'); // 'idle' | 'testing' | 'result'
  const [matingTrialFeedback, setMatingTrialFeedback] = useState(null);

  // Telemetry Tracker
  const [telemetrySent, setTelemetrySent] = useState(false);

  // KCSE Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Audio mute sync
  useEffect(() => {
    audioEngine.muted = soundMuted;
  }, [soundMuted]);

  // Synchronize generations with stage progression for seamless intuition
  const handleStageChange = (newStage) => {
    audioEngine.playStepClick();
    setStage(newStage);
    setMatingTrialState('idle');
    setMatingTrialFeedback(null);

    if (newStage === 1) {
      setGenerations(100);
      setIsPlaying(false);
    } else if (newStage === 2) {
      if (generations < 250) setGenerations(350);
      setIsPlaying(false);
    } else if (newStage === 3) {
      if (generations < 1200) setGenerations(2500);
    } else if (newStage === 4) {
      if (generations < 3000) setGenerations(5000);
      setIsPlaying(false);
    }
  };

  // Auto-play generations timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setGenerations((prev) => {
          if (prev >= 10000) {
            setIsPlaying(false);
            return 10000;
          }
          const increment = prev < 1000 ? 50 : prev < 4000 ? 150 : 300;
          return Math.min(10000, prev + increment);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // ============================================================================
  // MATHEMATICAL & BIOLOGICAL POPULATION GENETICS MODEL
  // ============================================================================
  const genetics = useMemo(() => {
    // Stage 1: unified ancestral baseline
    if (stage === 1) {
      return {
        geneFlowNm: 18.5,
        geneticDistanceDst: 0.008,
        northBeakDepth: 10.0,
        southBeakDepth: 10.0,
        northPlumage: '#5b574a', // olive-brown
        southPlumage: '#5b574a',
        northSongFreq: 3400, // Hz
        southSongFreq: 3400,
        bmp4ExpressionNorth: 45, // %
        camExpressionSouth: 35, // %
        reproductiveIsolationPct: 0,
        speciationComplete: false,
        classificationNorth: 'Geospiza ancestralis',
        classificationSouth: 'Geospiza ancestralis'
      };
    }

    // Effective divergence time parameter
    const effectiveGen = stage === 2 ? Math.min(generations, 500) : generations;
    const progress = 1 - Math.exp(-effectiveGen / 3000);

    // Environmental coefficients
    const northMultiplier = northSelectionPressure === 'high_nuts' ? 1.0 : 0.65;
    const southMultiplier = southSelectionPressure === 'arid_probing' ? 1.0 : 0.65;

    // Morphological divergence
    // North: heavy crushing beak (up to 16.8mm)
    const northBeakDepth = +(10.0 + 6.8 * progress * northMultiplier).toFixed(2);
    // South: slender probing beak (down to 5.2mm)
    const southBeakDepth = +(10.0 - 4.8 * progress * southMultiplier).toFixed(2);

    // Plumage melanin and color interpolation
    // North darkens to dark slate charcoal (#222428)
    const northR = Math.round(91 - (91 - 34) * progress);
    const northG = Math.round(87 - (87 - 36) * progress);
    const northB = Math.round(74 - (74 - 40) * progress);
    const northPlumage = `rgb(${northR}, ${northG}, ${northB})`;

    // South brightens to arid pale golden buff (#d4af37)
    const southR = Math.round(91 + (212 - 91) * progress);
    const southG = Math.round(87 + (175 - 87) * progress);
    const southB = Math.round(74 + (55 - 74) * progress);
    const southPlumage = `rgb(${southR}, ${southG}, ${southB})`;

    // Acoustic song frequency shifts
    const northSongFreq = Math.round(3400 - 1600 * progress * northMultiplier); // Down to 1800 Hz
    const southSongFreq = Math.round(3400 + 2800 * progress * southMultiplier); // Up to 6200 Hz

    // Molecular genetic distance (Nei's Dst / Fst approximation)
    const geneticDistanceDst = +(0.95 * progress).toFixed(3);

    // Gene expression markers (BMP4 stimulates beak depth, Calmodulin stimulates beak length)
    const bmp4ExpressionNorth = Math.round(45 + 50 * progress);
    const camExpressionSouth = Math.round(35 + 60 * progress);

    // Reproductive Isolation Index (%): Non-linear threshold emergence
    // Requires sufficient divergence (~2500+ generations) to cross the species barrier
    const rawRI = Math.pow(progress, 1.35) * 100;
    const reproductiveIsolationPct = Math.min(100, Math.round(rawRI));

    // Gene flow status
    let geneFlowNm = 0.0;
    if (stage === 4) {
      if (reproductiveIsolationPct >= 85) {
        // Intrinsic reproductive isolation prevents gene flow even in physical contact!
        geneFlowNm = 0.0;
      } else {
        // Incomplete divergence allows secondary gene flow / hybridization
        geneFlowNm = +((1 - reproductiveIsolationPct / 100) * 14.0).toFixed(1);
      }
    }

    const speciationComplete = reproductiveIsolationPct >= 85;

    return {
      geneFlowNm,
      geneticDistanceDst,
      northBeakDepth,
      southBeakDepth,
      northPlumage,
      southPlumage,
      northSongFreq,
      southSongFreq,
      bmp4ExpressionNorth,
      camExpressionSouth,
      reproductiveIsolationPct,
      speciationComplete,
      classificationNorth: speciationComplete ? 'Geospiza robustirostris (Sp. A)' : 'Geospiza ancestralis (North Deme)',
      classificationSouth: speciationComplete ? 'Geospiza acutirostris (Sp. B)' : 'Geospiza ancestralis (South Deme)'
    };
  }, [stage, generations, northSelectionPressure, southSelectionPressure]);

  // Handle Mating Trial Execution (Stage 4)
  const runInterbreedingTest = () => {
    audioEngine.playStepClick();
    setMatingTrialState('testing');

    // Sequence trial animation
    setTimeout(() => {
      // Play North courtship song then South response
      audioEngine.playNorthSong();
    }, 400);

    setTimeout(() => {
      audioEngine.playSouthSong();
    }, 1200);

    setTimeout(() => {
      setMatingTrialState('result');
      const isIsolated = genetics.reproductiveIsolationPct >= 85;

      if (isIsolated) {
        audioEngine.playMatingFailure(); // Rejection of foreign courtship signals!
        const result = {
          success: false,
          speciationAchieved: true,
          hybridViability: 0,
          prezygoticBlock: 'Complete (Behavioural & Morphological Incompatibility)',
          postzygoticBlock: 'Severe (Karyotypic mismatch: hybrid embryos inviable)',
          headline: 'Mating Trial Result: Hybrid Viability = 0% · Species A and Species B are Reproductively Isolated!',
          analysis:
            'Courtship signals completely failed. The South female rejected the low-frequency acoustic booming of the North male. In forced laboratory fertilization trials, genetic divergence accumulated over ' +
            generations +
            ' generations resulted in post-zygotic cleavage arrest (0% hybrid viability). Two separate biological species have evolved!'
        };
        setMatingTrialFeedback(result);

        // Emit verified simulation telemetry checkpoint
        if (onTelemetry && !telemetrySent) {
          setTelemetrySent(true);
          try {
            onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
              simulation: 'speciation_geographic_isolation',
              stage: 4,
              generations,
              geneticDistance: genetics.geneticDistanceDst,
              reproductiveIsolationPct: genetics.reproductiveIsolationPct,
              speciationComplete: true
            });
          } catch {
            onTelemetry({
              simulation: 'speciation_geographic_isolation',
              stage: 4,
              generations,
              speciationComplete: true
            });
          }
        }
      } else {
        audioEngine.playMatingSuccess(); // Fertile hybridization due to insufficient divergence
        const result = {
          success: true,
          speciationAchieved: false,
          hybridViability: Math.round(100 - genetics.reproductiveIsolationPct),
          prezygoticBlock: 'Weak / Incomplete (Some songs recognized)',
          postzygoticBlock: 'Incomplete (Fertile hybrids produced)',
          headline: 'Scientific Safeguard Alert: Speciation Incomplete! Gene Flow Resumed.',
          analysis:
            'Divergence time (' +
            generations +
            ' generations) was insufficient to establish irreversible reproductive barriers. Upon secondary contact, finches readily interbreed, producing viable offspring. This proves that geographic isolation ALONE does not guarantee speciation without sufficient genetic divergence!'
        };
        setMatingTrialFeedback(result);
      }
    }, 2200);
  };

  // Submit Quiz & Telemetry
  const handleQuizSubmit = () => {
    let score = 0;
    KCSE_SPECIATION_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    audioEngine.playStepClick();

    if (onTelemetry) {
      try {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'speciation_geographic_isolation',
          topic: 'Evolution - Speciation Through Isolation',
          score,
          maxScore: KCSE_SPECIATION_QUESTIONS.length,
          passed: score >= 4
        });
      } catch {
        onTelemetry({
          simulation: 'speciation_geographic_isolation',
          score,
          passed: score >= 4
        });
      }
    }
  };

  // Reset simulation to unified ancestral state
  const handleReset = () => {
    audioEngine.playStepClick();
    setStage(1);
    setGenerations(100);
    setIsPlaying(false);
    setMatingTrialState('idle');
    setMatingTrialFeedback(null);
    setNorthSelectionPressure('high_nuts');
    setSouthSelectionPressure('arid_probing');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none pb-14">
      {/* Header Banner */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 sm:px-6 py-4 sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <GitBranch className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Speciation Through Isolation
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                KCSE Form 4 Biology • Topic 2
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Allopatric Speciation • Geographic Barriers • Divergent Natural Selection • Reproductive Isolation
            </p>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2">
          {/* Mute toggle */}
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Reset simulation */}
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors border border-slate-700 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Valley</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="w-full sm:w-auto flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => {
              audioEngine.playStepClick();
              setActiveTab('sim');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'sim'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Valley Simulation
          </button>

          <button
            onClick={() => {
              audioEngine.playStepClick();
              setActiveTab('isolation');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'isolation'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Reproductive Isolation
          </button>

          <button
            onClick={() => {
              audioEngine.playStepClick();
              setActiveTab('case_studies');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'case_studies'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            East African Case Studies
          </button>

          <button
            onClick={() => {
              audioEngine.playStepClick();
              setActiveTab('kcse');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'kcse'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            KCSE Exam Mastery
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 pt-5 flex-1 flex flex-col gap-6">

        {/* ========================================================================= */}
        {/* TAB 1: MAIN INTERACTIVE SPECIATION VALLEY SIMULATION                       */}
        {/* ========================================================================= */}
        {activeTab === 'sim' && (
          <div className="flex flex-col gap-5">
            {/* Stage Stepper Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-emerald-400" />
                  Allopatric Speciation Sequential Timeline
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                  Current: Stage {stage} of 4
                </span>
              </div>

              {/* 4 Steps Stepper */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {EVOLUTION_STAGES.map((s) => {
                  const isCurrent = stage === s.id;
                  const isPast = stage > s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleStageChange(s.id)}
                      className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden ${
                        isCurrent
                          ? 'bg-emerald-950/70 border-emerald-500 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/50'
                          : isPast
                          ? 'bg-slate-800/70 border-slate-700 hover:border-slate-600'
                          : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-200">{s.name}</span>
                        {isPast ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-700" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{s.subtitle}</p>
                    </button>
                  );
                })}
              </div>

              {/* Active Stage Context Box */}
              <div className="mt-3 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5 max-w-3xl">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-emerald-300">
                      {EVOLUTION_STAGES[stage - 1].name}:
                    </span>{' '}
                    <span className="text-slate-300">
                      {EVOLUTION_STAGES[stage - 1].description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    disabled={stage === 1}
                    onClick={() => handleStageChange(stage - 1)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={stage === 4}
                    onClick={() => handleStageChange(stage + 1)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:pointer-events-none text-white font-medium flex items-center gap-1"
                  >
                    <span>Next Stage</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Visual SVG Valley Landscape & Organisms */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col">
              {/* Landscape Header Overlay */}
              <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-slate-200">
                    East Valley Biogeographical Canvas
                  </span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  <span className="text-slate-400 hidden sm:inline">
                    {EVOLUTION_STAGES[stage - 1].barrierStatus}
                  </span>
                </div>

                {/* Live Gene Flow Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Gene Flow:</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded ${
                      genetics.geneFlowNm > 0
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {genetics.geneFlowNm > 0 ? `Nm = ${genetics.geneFlowNm}` : 'Nm = 0.0 (SEVERED)'}
                  </span>
                </div>
              </div>

              {/* Landscape Graphic (SVG) */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-b from-sky-950 via-slate-900 to-slate-950 overflow-hidden">
                <svg
                  viewBox="0 0 900 420"
                  className="w-full h-full select-none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    {/* Sky Gradient */}
                    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#082f49" />
                      <stop offset="70%" stopColor="#0c4a6e" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>

                    {/* North Forest Hills Gradient (Highland Nut Canopy) */}
                    <linearGradient id="northHills" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={stage >= 3 ? '#064e3b' : '#14532d'} />
                      <stop offset="100%" stopColor={stage >= 3 ? '#022c22' : '#0f3a22'} />
                    </linearGradient>

                    {/* South Arid Scrub Hills Gradient (Lowland Scrub) */}
                    <linearGradient id="southHills" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={stage >= 3 ? '#78350f' : '#14532d'} />
                      <stop offset="100%" stopColor={stage >= 3 ? '#451a03' : '#0f3a22'} />
                    </linearGradient>

                    {/* River Water Gradient */}
                    <linearGradient id="riverWater" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="50%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0369a1" />
                    </linearGradient>

                    {/* Dry Riverbed Gradient (Stage 4) */}
                    <linearGradient id="dryRiverbed" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#57534e" />
                      <stop offset="50%" stopColor="#a8a29e" />
                      <stop offset="100%" stopColor="#78716c" />
                    </linearGradient>

                    {/* Soft Mist Filter */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Sky background */}
                  <rect width="900" height="420" fill="url(#skyGrad)" />

                  {/* Sun / Clouds */}
                  <circle cx="820" cy="65" r="34" fill="#fbbf24" opacity="0.85" filter="url(#glow)" />
                  <ellipse cx="820" cy="65" rx="48" ry="48" fill="#fef08a" opacity="0.15" />

                  {/* Distant Mountains */}
                  <path
                    d="M-20 220 Q 150 90, 320 200 T 650 180 T 920 210 L 920 420 L -20 420 Z"
                    fill="#0f172a"
                    opacity="0.8"
                  />

                  {/* ======================================================== */}
                  {/* NORTH SECTOR (Left 0 -> 400): Lush Forest & Nut Trees    */}
                  {/* ======================================================== */}
                  <path
                    d="M-20 240 Q 120 180, 260 210 Q 360 220, 420 260 L 420 420 L -20 420 Z"
                    fill="url(#northHills)"
                  />

                  {/* North Sector Terrain Details (Trees / Nuts / Rocks) */}
                  <g opacity={stage >= 3 ? 0.95 : 0.6}>
                    {/* Hard Nut Trees */}
                    <rect x="60" y="190" width="10" height="40" fill="#3e2723" rx="2" />
                    <circle cx="65" cy="180" r="26" fill={stage >= 3 ? '#065f46' : '#15803d'} />
                    <circle cx="80" cy="170" r="22" fill={stage >= 3 ? '#047857' : '#16a34a'} />
                    <circle cx="50" cy="175" r="20" fill={stage >= 3 ? '#064e3b' : '#166534'} />

                    {/* Nut markers */}
                    {stage >= 3 && (
                      <g fill="#78350f">
                        <circle cx="58" cy="185" r="3.5" />
                        <circle cx="75" cy="178" r="4" />
                        <circle cx="86" cy="188" r="3.5" />
                      </g>
                    )}

                    {/* Tree 2 */}
                    <rect x="200" y="215" width="12" height="45" fill="#3e2723" rx="2" />
                    <circle cx="206" cy="200" r="30" fill={stage >= 3 ? '#064e3b' : '#166534'} />
                    <circle cx="225" cy="190" r="25" fill={stage >= 3 ? '#047857' : '#15803d'} />
                    <circle cx="188" cy="195" r="22" fill={stage >= 3 ? '#022c22' : '#14532d'} />

                    {/* Rainforest Mist in Stage 3 */}
                    {stage >= 3 && (
                      <path
                        d="M 20 230 Q 120 200, 240 225 Q 320 240, 400 230"
                        stroke="#e2e8f0"
                        strokeWidth="12"
                        opacity="0.15"
                        filter="url(#glow)"
                        fill="none"
                      />
                    )}
                  </g>

                  {/* North Sector Label */}
                  <g transform="translate(40, 40)">
                    <rect width="180" height="44" rx="8" fill="#0f172a" opacity="0.85" stroke="#059669" strokeWidth="1" />
                    <text x="12" y="18" fill="#34d399" fontSize="12" fontWeight="bold">
                      NORTHERN VALE (Zone A)
                    </text>
                    <text x="12" y="34" fill="#94a3b8" fontSize="10">
                      {stage >= 3 ? 'Dense Ironwood Canopy • Hard Seeds' : 'Ancestral Mixed Forest'}
                    </text>
                  </g>

                  {/* ======================================================== */}
                  {/* SOUTH SECTOR (Right 480 -> 900): Arid Scrubland & Cacti  */}
                  {/* ======================================================== */}
                  <path
                    d="M 480 260 Q 560 220, 680 210 Q 780 180, 920 240 L 920 420 L 480 420 Z"
                    fill="url(#southHills)"
                  />

                  {/* South Sector Terrain Details (Cacti / Acacia / Sand) */}
                  <g opacity={stage >= 3 ? 0.95 : 0.6}>
                    {stage >= 3 ? (
                      // Desert Cacti & Blossoms in Stage 3-4
                      <g>
                        {/* Giant Saguaro Cactus */}
                        <path
                          d="M 720 250 L 720 185 Q 720 180 725 180 Q 730 180 730 185 L 730 250 Z"
                          fill="#166534"
                        />
                        <path
                          d="M 710 215 L 710 200 Q 710 195 715 195 L 720 195"
                          stroke="#166534"
                          strokeWidth="6"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <path
                          d="M 740 225 L 740 205 Q 740 200 735 200 L 730 200"
                          stroke="#166534"
                          strokeWidth="6"
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Red Cactus Nectar Flowers */}
                        <circle cx="725" cy="179" r="4" fill="#ef4444" />
                        <circle cx="711" cy="195" r="3.5" fill="#ef4444" />
                        <circle cx="739" cy="200" r="3.5" fill="#ef4444" />

                        {/* Acacia tree */}
                        <rect x="810" y="225" width="8" height="30" fill="#451a03" />
                        <ellipse cx="814" cy="220" rx="35" ry="10" fill="#a16207" />
                        <ellipse cx="814" cy="214" rx="25" ry="8" fill="#ca8a04" />
                      </g>
                    ) : (
                      // Stage 1-2 standard green trees
                      <g>
                        <rect x="730" y="215" width="12" height="45" fill="#3e2723" rx="2" />
                        <circle cx="736" cy="200" r="28" fill="#166534" />
                        <circle cx="755" cy="190" r="24" fill="#15803d" />
                      </g>
                    )}
                  </g>

                  {/* South Sector Label */}
                  <g transform="translate(680, 40)">
                    <rect width="180" height="44" rx="8" fill="#0f172a" opacity="0.85" stroke="#d97706" strokeWidth="1" />
                    <text x="12" y="18" fill="#fbbf24" fontSize="12" fontWeight="bold">
                      SOUTHERN VALE (Zone B)
                    </text>
                    <text x="12" y="34" fill="#94a3b8" fontSize="10">
                      {stage >= 3 ? 'Arid Desert Scrub • Floral Nectar' : 'Ancestral Mixed Forest'}
                    </text>
                  </g>

                  {/* ======================================================== */}
                  {/* CENTRAL SECTOR (380 -> 520): Canyon / River / Landbridge  */}
                  {/* ======================================================== */}

                  {/* STAGE 1: Peaceful Unified Valley (No barrier) */}
                  {stage === 1 && (
                    <g>
                      {/* Gentle Meandering Stream that birds cross with ease */}
                      <path
                        d="M 430 240 Q 460 300, 440 360 Q 430 390, 450 420 L 465 420 Q 445 390, 455 360 Q 475 300, 445 240 Z"
                        fill="url(#riverWater)"
                        opacity="0.75"
                      />
                      {/* Stepping stones */}
                      <ellipse cx="445" cy="300" rx="9" ry="5" fill="#64748b" />
                      <ellipse cx="440" cy="350" rx="8" ry="4" fill="#94a3b8" />

                      {/* Continuous Interbreeding Flow Indicator */}
                      <g transform="translate(370, 160)">
                        <rect width="160" height="50" rx="10" fill="#0f172a" opacity="0.9" stroke="#10b981" strokeWidth="1.5" />
                        <text x="80" y="20" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
                          FREE GENE FLOW
                        </text>
                        <text x="80" y="38" fill="#a7f3d0" fontSize="10" textAnchor="middle">
                          Nm &gt; 1 · Interbreeding Active
                        </text>
                      </g>

                      {/* Animated Gene Flow Waves across river */}
                      <path
                        d="M 330 280 Q 450 250, 570 280"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeDasharray="6,4"
                        fill="none"
                        opacity="0.8"
                      />
                      <path
                        d="M 570 340 Q 450 370, 330 340"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeDasharray="6,4"
                        fill="none"
                        opacity="0.8"
                      />
                    </g>
                  )}

                  {/* STAGE 2 & 3: Impassable Torrential Canyon River (Barrier) */}
                  {(stage === 2 || stage === 3) && (
                    <g>
                      {/* Deep Rocky Canyon Chasm */}
                      <polygon points="410,240 490,240 520,420 380,420" fill="#1c1917" />
                      {/* Layered Stratum Rock walls */}
                      <line x1="412" y1="260" x2="385" y2="410" stroke="#44403c" strokeWidth="6" />
                      <line x1="488" y1="260" x2="515" y2="410" stroke="#44403c" strokeWidth="6" />

                      {/* Torrential Foaming River */}
                      <polygon points="420,250 480,250 510,420 390,420" fill="url(#riverWater)" />
                      {/* Foaming rapids lines */}
                      <path d="M 425 280 Q 450 288, 475 280" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.7" />
                      <path d="M 415 320 Q 450 330, 485 320" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.8" />
                      <path d="M 405 370 Q 450 385, 495 370" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.75" />

                      {/* Barred Barrier Signs & Warning */}
                      <g transform="translate(365, 140)">
                        <rect width="170" height="54" rx="10" fill="#450a0a" opacity="0.95" stroke="#ef4444" strokeWidth="2" />
                        <text x="85" y="20" fill="#fca5a5" fontSize="11" fontWeight="bold" textAnchor="middle">
                          GEOGRAPHIC BARRIER
                        </text>
                        <text x="85" y="36" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">
                          GENE FLOW SEVERED (Nm = 0)
                        </text>
                        <text x="85" y="48" fill="#fecaca" fontSize="9" textAnchor="middle">
                          Physical Isolation in Place
                        </text>
                      </g>

                      {/* Red cross barrier line across gorge */}
                      <line x1="400" y1="240" x2="400" y2="420" stroke="#ef4444" strokeWidth="3" strokeDasharray="6,4" opacity="0.6" />
                      <line x1="500" y1="240" x2="500" y2="420" stroke="#ef4444" strokeWidth="3" strokeDasharray="6,4" opacity="0.6" />
                    </g>
                  )}

                  {/* STAGE 4: Barrier Dissolved / Secondary Contact Land Bridge */}
                  {stage === 4 && (
                    <g>
                      {/* Dried riverbed canyon floor */}
                      <polygon points="410,240 490,240 520,420 380,420" fill="url(#dryRiverbed)" />
                      {/* River boulders & dried sediment */}
                      <ellipse cx="440" cy="290" rx="14" ry="7" fill="#44403c" />
                      <ellipse cx="470" cy="330" rx="16" ry="8" fill="#57534e" />
                      <ellipse cx="430" cy="380" rx="12" ry="6" fill="#292524" />

                      {/* Secondary Contact Zone Banner */}
                      <g transform="translate(360, 130)">
                        <rect width="180" height="52" rx="10" fill="#0f172a" opacity="0.95" stroke="#38bdf8" strokeWidth="2" />
                        <text x="90" y="20" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                          SECONDARY CONTACT ZONE
                        </text>
                        <text x="90" y="36" fill="#bae6fd" fontSize="10" textAnchor="middle">
                          River Dried • Land Bridge Formed
                        </text>
                        <text x="90" y="48" fill="#7dd3fc" fontSize="9" textAnchor="middle">
                          Testing Reproductive Isolation
                        </text>
                      </g>

                      {/* Meeting arrows toward center */}
                      <path d="M 330 310 L 400 310" stroke="#38bdf8" strokeWidth="3" />
                      <path d="M 570 310 L 500 310" stroke="#38bdf8" strokeWidth="3" />
                    </g>
                  )}

                  {/* ======================================================== */}
                  {/* POPULATION ORGANISMS (Birds on North, South, & Center)   */}
                  {/* ======================================================== */}

                  {/* NORTH POPULATION FINCHES */}
                  {/* Finch North 1 */}
                  <g transform="translate(180, 270)" className="transition-all duration-700">
                    {/* Finch Body */}
                    <ellipse cx="20" cy="20" rx="18" ry="13" fill={genetics.northPlumage} />
                    <circle cx="34" cy="12" r="10" fill={genetics.northPlumage} />
                    <circle cx="37" cy="10" r="2.5" fill="#ffffff" />
                    <circle cx="38" cy="10" r="1.2" fill="#000000" />
                    {/* North Beak (Scales with beakDepth) */}
                    <path
                      d={`M 43 11 L ${43 + 12} ${11 + 2} L 43 ${11 + genetics.northBeakDepth * 0.75} Z`}
                      fill="#1e293b"
                    />
                    {/* Tail Feathers */}
                    <polygon points="4,16 -10,12 -8,22 4,22" fill={genetics.northPlumage} opacity="0.9" />
                    {/* Legs */}
                    <line x1="18" y1="32" x2="18" y2="44" stroke="#1e293b" strokeWidth="2" />
                    <line x1="24" y1="32" x2="26" y2="44" stroke="#1e293b" strokeWidth="2" />
                  </g>

                  {/* Finch North 2 (Higher branch) */}
                  <g transform="translate(110, 210)" className="transition-all duration-700">
                    <ellipse cx="20" cy="20" rx="16" ry="11" fill={genetics.northPlumage} />
                    <circle cx="32" cy="13" r="9" fill={genetics.northPlumage} />
                    <circle cx="35" cy="11" r="2" fill="#ffffff" />
                    <circle cx="36" cy="11" r="1" fill="#000000" />
                    <path
                      d={`M 40 12 L ${40 + 10} ${12 + 2} L 40 ${12 + genetics.northBeakDepth * 0.7} Z`}
                      fill="#1e293b"
                    />
                    <polygon points="5,17 -8,14 -6,22 5,21" fill={genetics.northPlumage} opacity="0.9" />
                    <line x1="18" y1="30" x2="18" y2="40" stroke="#1e293b" strokeWidth="2" />
                  </g>

                  {/* SOUTH POPULATION FINCHES */}
                  {/* Finch South 1 */}
                  <g transform="translate(680, 270)" className="transition-all duration-700">
                    <ellipse cx="20" cy="20" rx="17" ry="12" fill={genetics.southPlumage} />
                    <circle cx="6" cy="12" r="9" fill={genetics.southPlumage} />
                    <circle cx="3" cy="10" r="2.2" fill="#ffffff" />
                    <circle cx="2" cy="10" r="1" fill="#000000" />
                    {/* South Beak (Slender, needle-like probe) */}
                    <path
                      d={`M -2 11 L ${-2 - (18 - genetics.southBeakDepth * 0.5)} 13 L -2 ${11 + genetics.southBeakDepth * 0.45} Z`}
                      fill="#78350f"
                    />
                    <polygon points="34,16 48,12 46,22 34,22" fill={genetics.southPlumage} opacity="0.9" />
                    <line x1="20" y1="31" x2="20" y2="43" stroke="#451a03" strokeWidth="2" />
                    <line x1="14" y1="31" x2="12" y2="43" stroke="#451a03" strokeWidth="2" />
                  </g>

                  {/* Finch South 2 (On cactus flower) */}
                  <g transform="translate(760, 220)" className="transition-all duration-700">
                    <ellipse cx="20" cy="20" rx="15" ry="10" fill={genetics.southPlumage} />
                    <circle cx="7" cy="13" r="8" fill={genetics.southPlumage} />
                    <circle cx="4" cy="11" r="2" fill="#ffffff" />
                    <circle cx="3" cy="11" r="1" fill="#000000" />
                    <path
                      d={`M -1 12 L ${-1 - (17 - genetics.southBeakDepth * 0.5)} 14 L -1 ${12 + genetics.southBeakDepth * 0.4} Z`}
                      fill="#78350f"
                    />
                    <polygon points="33,16 44,14 43,21 33,20" fill={genetics.southPlumage} opacity="0.9" />
                    <line x1="18" y1="29" x2="18" y2="39" stroke="#451a03" strokeWidth="2" />
                  </g>

                  {/* STAGE 4: INTERBREEDING TRIAL ANIMATION IN CENTRAL ARENA */}
                  {stage === 4 && (
                    <g transform="translate(450, 320)">
                      {/* Male North Finch facing right */}
                      <g transform="translate(-55, -20)">
                        <ellipse cx="20" cy="20" rx="17" ry="13" fill={genetics.northPlumage} />
                        <circle cx="33" cy="12" r="10" fill={genetics.northPlumage} />
                        <circle cx="36" cy="10" r="2" fill="#fff" />
                        <circle cx="37" cy="10" r="1" fill="#000" />
                        <path
                          d={`M 42 11 L 54 13 L 42 ${11 + genetics.northBeakDepth * 0.75} Z`}
                          fill="#1e293b"
                        />
                        {/* Courtship sound ripples emitted from male in testing */}
                        {matingTrialState === 'testing' && (
                          <g opacity="0.85">
                            <circle cx="56" cy="13" r="12" stroke="#34d399" strokeWidth="2" fill="none" className="animate-ping" />
                            <text x="68" y="8" fill="#34d399" fontSize="10" fontWeight="bold">
                              ♫ BOOM-CHIRP
                            </text>
                          </g>
                        )}
                      </g>

                      {/* Female South Finch facing left */}
                      <g transform="translate(25, -20)">
                        <ellipse cx="20" cy="20" rx="16" ry="11" fill={genetics.southPlumage} />
                        <circle cx="7" cy="13" r="9" fill={genetics.southPlumage} />
                        <circle cx="4" cy="11" r="2" fill="#fff" />
                        <circle cx="3" cy="11" r="1" fill="#000" />
                        <path
                          d={`M -1 12 L -16 13 L -1 ${12 + genetics.southBeakDepth * 0.45} Z`}
                          fill="#78350f"
                        />
                        {/* Response display */}
                        {matingTrialState === 'testing' && (
                          <g opacity="0.85">
                            <text x="-25" y="6" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="end">
                              TRILL? ♫
                            </text>
                          </g>
                        )}
                      </g>

                      {/* Result Marker Overlay */}
                      {matingTrialState === 'result' && matingTrialFeedback && (
                        <g transform="translate(0, -50)">
                          {matingTrialFeedback.speciationAchieved ? (
                            <g>
                              <circle cx="0" cy="0" r="22" fill="#dc2626" />
                              <path d="M -8 -8 L 8 8 M 8 -8 L -8 8" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                              <rect x="-85" y="28" width="170" height="24" rx="6" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
                              <text x="0" y="44" fill="#fecaca" fontSize="10" fontWeight="bold" textAnchor="middle">
                                REPRODUCTIVE ISOLATION (0%)
                              </text>
                            </g>
                          ) : (
                            <g>
                              <circle cx="0" cy="0" r="22" fill="#16a34a" />
                              <path d="M -9 0 L -3 6 L 9 -6" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                              <rect x="-85" y="28" width="170" height="24" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                              <text x="0" y="44" fill="#a7f3d0" fontSize="10" fontWeight="bold" textAnchor="middle">
                                HYBRIDIZATION (SPECIATION FAIL)
                              </text>
                            </g>
                          )}
                        </g>
                      )}
                    </g>
                  )}
                </svg>
              </div>

              {/* Landscape Footer Diagnostic Banner */}
              {matingTrialFeedback && (
                <div
                  className={`p-4 border-t flex items-start gap-3 transition-all ${
                    matingTrialFeedback.speciationAchieved
                      ? 'bg-rose-950/90 border-rose-800/80 text-rose-100'
                      : 'bg-amber-950/90 border-amber-800/80 text-amber-100'
                  }`}
                >
                  {matingTrialFeedback.speciationAchieved ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-sm tracking-wide">
                      {matingTrialFeedback.headline}
                    </p>
                    <p className="text-slate-200 leading-relaxed">
                      {matingTrialFeedback.analysis}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Controls & Evolutionary Instruments Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Column 1: Divergence Time & Generations Controls */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      Divergence Generations
                    </span>
                    <span className="text-sm font-mono font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {generations.toLocaleString()} Gen
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal mb-3">
                    Advance generations in geographic isolation to drive genetic divergence and accumulate mutations.
                  </p>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={generations}
                    onChange={(e) => {
                      setGenerations(Number(e.target.value));
                      setMatingTrialState('idle');
                      setMatingTrialFeedback(null);
                    }}
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>100 Gen</span>
                    <span>2,500 Gen (Threshold)</span>
                    <span>10,000 Gen</span>
                  </div>
                </div>

                {/* Quick Step Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      audioEngine.playStepClick();
                      setGenerations((g) => Math.min(10000, g + 1000));
                      setMatingTrialState('idle');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center justify-center gap-1"
                  >
                    <FastForward className="w-3.5 h-3.5 text-emerald-400" />
                    +1,000 Gen
                  </button>

                  <button
                    onClick={() => {
                      audioEngine.playStepClick();
                      setGenerations(5000);
                      setMatingTrialState('idle');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Set 5,000 Gen
                  </button>

                  <button
                    onClick={() => {
                      audioEngine.playStepClick();
                      setIsPlaying(!isPlaying);
                    }}
                    className={`col-span-2 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                      isPlaying
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause Divergence Clock' : 'Simulate Evolutionary Time'}
                  </button>
                </div>
              </div>

              {/* Column 2: Selection Pressures & Audio Audition */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    Ecological Selective Regimes
                  </span>

                  <div className="space-y-3">
                    {/* North Selection Regime */}
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-emerald-400">North Regime (High Forest):</span>
                        <button
                          onClick={() => audioEngine.playNorthSong()}
                          className="text-[10px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded"
                          title="Listen to North Mating Call"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{genetics.northSongFreq} Hz</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Dense foliage & hard nuts favors deep beaks ({genetics.northBeakDepth} mm) and low acoustic booming.
                      </p>
                    </div>

                    {/* South Selection Regime */}
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-amber-400">South Regime (Arid Scrub):</span>
                        <button
                          onClick={() => audioEngine.playSouthSong()}
                          className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded"
                          title="Listen to South Mating Call"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{genetics.southSongFreq} Hz</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Tubular flowers & insects favor slender probe beaks ({genetics.southBeakDepth} mm) and high trills.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stage 4 Interbreeding Action & Comparison Presets */}
                <div className="space-y-2">
                  {stage === 4 && (
                    <div className="grid grid-cols-2 gap-1.5 pb-1">
                      <button
                        onClick={() => {
                          audioEngine.playStepClick();
                          setGenerations(600);
                          setMatingTrialState('idle');
                          setMatingTrialFeedback(null);
                        }}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                          generations < 2500
                            ? 'bg-amber-950/80 border-amber-500 text-amber-300 ring-1 ring-amber-500/50'
                            : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                        title="Simulate early secondary contact before reproductive barriers form"
                      >
                        ⚡ Early Contact (600 Gen)
                      </button>
                      <button
                        onClick={() => {
                          audioEngine.playStepClick();
                          setGenerations(5000);
                          setMatingTrialState('idle');
                          setMatingTrialFeedback(null);
                        }}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                          generations >= 2500
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50'
                            : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                        title="Simulate prolonged isolation where irreversible reproductive barriers emerge"
                      >
                        🔒 Prolonged (5,000 Gen)
                      </button>
                    </div>
                  )}

                  <button
                    disabled={stage !== 4 || matingTrialState === 'testing'}
                    onClick={runInterbreedingTest}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                      stage === 4
                        ? 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-sky-900/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {stage === 4
                      ? matingTrialState === 'testing'
                        ? 'Conducting Mating Trial...'
                        : `Test Interbreeding (${generations.toLocaleString()} Gen)`
                      : 'Advance to Stage 4 to Test Mating'}
                  </button>
                </div>
              </div>

              {/* Column 3: Speciation Indices & Genetic Distance */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                    <Dna className="w-4 h-4 text-emerald-400" />
                    Population Genetics Metrics
                  </span>

                  <div className="space-y-2.5 text-xs">
                    {/* Genetic Distance */}
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Genetic Distance (Dst)</span>
                        <span className="font-mono font-bold text-white text-sm">
                          {genetics.geneticDistanceDst}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {genetics.geneticDistanceDst > 0.65 ? 'High Divergence' : 'Conspecific'}
                      </span>
                    </div>

                    {/* Reproductive Isolation Progress Bar */}
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-center mb-1 text-[11px]">
                        <span className="text-slate-400">Reproductive Isolation Index</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {genetics.reproductiveIsolationPct}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            genetics.reproductiveIsolationPct >= 85
                              ? 'bg-rose-500'
                              : genetics.reproductiveIsolationPct >= 50
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${genetics.reproductiveIsolationPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Taxonomy Status Badge */}
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Taxonomic Status
                      </span>
                      <span
                        className={`font-semibold text-xs ${
                          genetics.speciationComplete ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {genetics.speciationComplete
                          ? '2 Distinct Biological Species'
                          : 'Single Species (Diverging Demes)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* KCSE Scientific Note */}
                <div className="text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 leading-tight">
                  <span className="font-bold text-slate-300">KCSE Criterion:</span> Speciation is permanent only when intrinsic reproductive isolation prevents fertile hybridization upon secondary contact.
                </div>
              </div>
            </div>

            {/* Phenotypic & Anatomical Comparison Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Feather className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200">
                    Phenotypic & Morphological Divergence Monitor
                  </h3>
                </div>
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs">
                  <button
                    onClick={() => setSelectedOrganismView('both')}
                    className={`px-2.5 py-1 rounded ${
                      selectedOrganismView === 'both' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Compare Both
                  </button>
                  <button
                    onClick={() => setSelectedOrganismView('north')}
                    className={`px-2.5 py-1 rounded ${
                      selectedOrganismView === 'north' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    North Finch
                  </button>
                  <button
                    onClick={() => setSelectedOrganismView('south')}
                    className={`px-2.5 py-1 rounded ${
                      selectedOrganismView === 'south' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    South Finch
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organism A (North) */}
                {(selectedOrganismView === 'both' || selectedOrganismView === 'north') && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs uppercase font-bold text-emerald-400 block">
                          Population A (Highland Forest)
                        </span>
                        <span className="text-sm font-bold text-white italic">
                          {genetics.classificationNorth}
                        </span>
                      </div>
                      <span className="text-xs font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                        N1 ≈ 1,400 Finches
                      </span>
                    </div>

                    {/* Morph visual */}
                    <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      {/* Beak profile rendering */}
                      <svg width="60" height="60" viewBox="0 0 60 60" className="shrink-0 bg-slate-950 rounded-lg border border-slate-800">
                        <circle cx="25" cy="30" r="16" fill={genetics.northPlumage} />
                        <circle cx="30" cy="26" r="3" fill="#fff" />
                        <circle cx="31" cy="26" r="1.5" fill="#000" />
                        {/* Crushing Beak */}
                        <path
                          d={`M 38 27 L 54 30 L 38 ${27 + genetics.northBeakDepth} Z`}
                          fill="#1e293b"
                          stroke="#334155"
                          strokeWidth="1"
                        />
                      </svg>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Beak Depth:</span>
                          <span className="font-mono font-bold text-emerald-400">{genetics.northBeakDepth} mm</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Bite Force:</span>
                          <span className="font-mono text-slate-200">{(genetics.northBeakDepth * 4.2).toFixed(1)} N (Nut Cracker)</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">BMP4 Gene:</span>
                          <span className="font-mono text-emerald-300">{genetics.bmp4ExpressionNorth}% High Expression</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      Heavy, deep bill delivers high compressive force to break lignified ironwood nut husks. Melanin-dense plumage offers cryptic camouflage in dark, humid sub-canopies.
                    </div>
                  </div>
                )}

                {/* Organism B (South) */}
                {(selectedOrganismView === 'both' || selectedOrganismView === 'south') && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs uppercase font-bold text-amber-400 block">
                          Population B (Arid Scrubland)
                        </span>
                        <span className="text-sm font-bold text-white italic">
                          {genetics.classificationSouth}
                        </span>
                      </div>
                      <span className="text-xs font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                        N2 ≈ 1,250 Finches
                      </span>
                    </div>

                    {/* Morph visual */}
                    <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      {/* Beak profile rendering */}
                      <svg width="60" height="60" viewBox="0 0 60 60" className="shrink-0 bg-slate-950 rounded-lg border border-slate-800">
                        <circle cx="35" cy="30" r="16" fill={genetics.southPlumage} />
                        <circle cx="30" cy="26" r="3" fill="#fff" />
                        <circle cx="29" cy="26" r="1.5" fill="#000" />
                        {/* Slender Needle Beak */}
                        <path
                          d={`M 22 28 L ${22 - 20} 30 L 22 ${28 + genetics.southBeakDepth * 0.7} Z`}
                          fill="#78350f"
                          stroke="#a16207"
                          strokeWidth="1"
                        />
                      </svg>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Beak Depth:</span>
                          <span className="font-mono font-bold text-amber-400">{genetics.southBeakDepth} mm</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Probing Reach:</span>
                          <span className="font-mono text-slate-200">{(28 - genetics.southBeakDepth * 1.5).toFixed(1)} mm (Flower Probe)</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Calmodulin Gene:</span>
                          <span className="font-mono text-amber-300">{genetics.camExpressionSouth}% High Expression</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      Elongated, slender beak acts like forceps to probe deep tubular cactus flowers and extract concealed insect larvae. High reflectance golden plumage prevents thermal overheating.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REPRODUCTIVE ISOLATING MECHANISMS DEEP DIVE                         */}
        {/* ========================================================================= */}
        {activeTab === 'isolation' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Reproductive Isolating Mechanisms (KCSE Classification)
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                According to the Biological Species Concept (Ernst Mayr), speciation is finalized only when internal biological mechanisms arise that prevent interbreeding between two groups. These are divided into <strong className="text-emerald-400">Pre-zygotic</strong> (preventing fertilization) and <strong className="text-rose-400">Post-zygotic</strong> (preventing fertile offspring after fertilization).
              </p>

              {/* Pre-zygotic vs Post-zygotic Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Pre-zygotic Barriers */}
                <div className="bg-slate-950 border border-emerald-900/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <h3 className="text-sm font-bold text-emerald-300">
                      1. Pre-Zygotic Isolating Barriers (Before Mating/Zygote)
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="font-bold text-white block mb-1">A. Behavioural Isolation</span>
                      <p className="text-slate-300">
                        Different species develop distinct courtship rituals, mating songs, pheromones, or visual displays. Females fail to recognize the signals of foreign males (e.g. North finch low boom vs South finch rapid trill).
                      </p>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="font-bold text-white block mb-1">B. Ecological (Habitat) Isolation</span>
                      <p className="text-slate-300">
                        Two populations live in the same general region but occupy different microhabitats (e.g. canopy canopy dwellers vs ground scrubland foragers) and rarely encounter each other.
                      </p>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="font-bold text-white block mb-1">C. Temporal (Seasonal) Isolation</span>
                      <p className="text-slate-300">
                        Populations breed at different times of the day, different months, or different seasons (e.g. spring rainy season vs autumn dry season).
                      </p>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="font-bold text-white block mb-1">D. Mechanical Isolation</span>
                      <p className="text-slate-300">
                        Structural differences in genitalia, body size, or floral morphology prevent successful copulation or pollen transfer.
                      </p>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="font-bold text-white block mb-1">E. Gametic Incompatibility</span>
                      <p className="text-slate-300">
                        Sperm cannot survive in the reproductive tract of another female, or egg surface proteins do not bind foreign sperm.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Post-zygotic Barriers */}
                <div className="bg-slate-950 border border-rose-900/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <h3 className="text-sm font-bold text-rose-300">
                      2. Post-Zygotic Isolating Barriers (After Zygote Formation)
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="font-bold text-white block mb-1">A. Hybrid Inviability</span>
                      <p className="text-slate-300">
                        Incompatible embryonic developmental genes prevent normal cleavage. Hybrid embryos abort spontaneously or die shortly after birth (0% viability).
                      </p>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="font-bold text-white block mb-1">B. Hybrid Sterility</span>
                      <p className="text-slate-300">
                        Hybrids survive into vigorous healthy adults but are completely sterile due to chromosomal mismatches during meiosis.
                      </p>
                      <div className="mt-2 p-2 bg-slate-950 rounded border border-slate-800 text-[11px] text-amber-300">
                        <strong>Classic KCSE Example:</strong> Male Donkey (2n = 62) × Female Horse (2n = 64) produces a Mule (2n = 63). Because homologous chromosomes cannot pair during meiosis I, mules produce no viable gametes.
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="font-bold text-white block mb-1">C. Hybrid Breakdown</span>
                      <p className="text-slate-300">
                        First-generation (F1) hybrids are viable and fertile, but when they mate with one another or the parental species, the subsequent (F2) generation is stunted, deformed, or sterile.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: EAST AFRICAN & GLOBAL SPECIATION CASE STUDIES                      */}
        {/* ========================================================================= */}
        {activeTab === 'case_studies' && (
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                East African & Classic Evolutionary Case Studies
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                The East African geography—dominated by the Great Rift Valley, crater lakes, and volcanic mountain massifs—presents textbook natural laboratories for allopatric speciation and adaptive radiation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Case 1: Lake Victoria Cichlid Fishes */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 border border-sky-800 text-sky-300">
                      East African Rift System
                    </span>
                    <h3 className="text-sm font-bold text-white">Lake Victoria Cichlid Adaptive Radiation</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Over 500 endemic species of cichlid fish (*Haplochromis* spp.) evolved in Lake Victoria within the last 15,000 to 100,000 years. Water level fluctuations fragmented the lake into isolated muddy bays and rocky islands (allopatry). Populations diverged to exploit different food niches (algae scraping, snail crushing, insectivorous, scale-eating), establishing strict visual mate recognition through male nuptial coloration.
                  </p>
                </div>

                {/* Case 2: Galápagos Finches */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 border border-emerald-800 text-emerald-300">
                      Darwin's Natural Experiment
                    </span>
                    <h3 className="text-sm font-bold text-white">Galápagos Ground & Tree Finches</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A single ancestral seed-eating finch flock migrated from the South American mainland to the volcanic archipelago. Geographic isolation across islands with disparate vegetation prevented gene flow. Divergent selection on beak dimensions (*Geospiza magnirostris* for large seeds vs *Geospiza scandens* for cactus blossoms) coupled with unique song dialects completed allopatric speciation.
                  </p>
                </div>

                {/* Case 3: African Forest vs Savannah Elephants */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 border border-amber-800 text-amber-300">
                      Continental Allopatry
                    </span>
                    <h3 className="text-sm font-bold text-white">Savannah vs Forest Elephants</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Once classified as a single species (*Loxodonta africana*), genomic studies revealed that the Savannah elephant (*Loxodonta africana*) and Central/West African Forest elephant (*Loxodonta cyclotis*) diverged 2 to 3 million years ago. Physical isolation by dense rainforest vs open savannah ecosystems created distinct morphological and genetic boundaries.
                  </p>
                </div>

                {/* Case 4: Ring Species (Ensatina Salamanders) */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 border border-indigo-800 text-indigo-300">
                      Evolutionary Geography
                    </span>
                    <h3 className="text-sm font-bold text-white">Ring Species (*Ensatina eschscholtzii*)</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Populations migrated southward around California's Central Valley along two separate mountain chains. Adjacent neighbor populations can interbreed, but when the two terminal ends meet at the southern terminus (secondary contact), they are so genetically and behaviorally divergent that they behave as two distinct non-interbreeding species!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: KCSE EXAM MASTERY & TELEMETRY                                      */}
        {/* ========================================================================= */}
        {activeTab === 'kcse' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">
                    KCSE Form 4 Biology Speciation Examination
                  </h2>
                </div>
                {quizSubmitted && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      quizScore >= 4
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-amber-950 text-amber-300 border border-amber-700'
                    }`}
                  >
                    Score: {quizScore} / {KCSE_SPECIATION_QUESTIONS.length} ({Math.round((quizScore / KCSE_SPECIATION_QUESTIONS.length) * 100)}%)
                  </span>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {KCSE_SPECIATION_QUESTIONS.map((q, idx) => {
                  const isAnswered = quizAnswers[q.id] !== undefined;
                  const isCorrect = quizAnswers[q.id] === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs font-semibold text-slate-200 leading-relaxed">
                          {q.question}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 pt-1 pl-8">
                        {q.options.map((option, optIdx) => {
                          const isSelected = quizAnswers[q.id] === optIdx;
                          let btnStyle = 'bg-slate-900 hover:bg-slate-800/80 text-slate-300 border-slate-800';

                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              btnStyle = 'bg-emerald-950 text-emerald-200 border-emerald-600 font-semibold';
                            } else if (isSelected && !isCorrect) {
                              btnStyle = 'bg-rose-950 text-rose-200 border-rose-600';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-emerald-950/80 text-emerald-200 border-emerald-500 font-semibold';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => {
                                audioEngine.playStepClick();
                                setQuizAnswers({ ...quizAnswers, [q.id]: optIdx });
                              }}
                              className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center gap-2 ${btnStyle}`}
                            >
                              <span className="w-5 h-5 rounded border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="leading-snug">{option}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation if submitted */}
                      {quizSubmitted && (
                        <div
                          className={`mt-3 p-3 rounded-lg text-xs leading-relaxed border ${
                            isCorrect
                              ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300'
                              : 'bg-rose-950/50 border-rose-800/60 text-rose-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold mb-1">
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-400" />
                            )}
                            <span>{isCorrect ? 'Correct Answer' : 'Examiner Commentary'}:</span>
                          </div>
                          <p className="text-slate-200">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action submission */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  {Object.keys(quizAnswers).length} of {KCSE_SPECIATION_QUESTIONS.length} questions attempted
                </span>

                {!quizSubmitted ? (
                  <button
                    disabled={Object.keys(quizAnswers).length < KCSE_SPECIATION_QUESTIONS.length}
                    onClick={handleQuizSubmit}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs shadow-lg transition-all"
                  >
                    Submit & Verify Assessment
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Retake Examination
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
