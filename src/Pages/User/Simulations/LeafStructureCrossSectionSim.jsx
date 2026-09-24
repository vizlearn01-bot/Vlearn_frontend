import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sun,
  Moon,
  Droplets,
  Wind,
  Layers,
  Sparkles,
  RotateCcw,
  Info,
  CheckCircle2,
  XCircle,
  Award,
  Activity,
  Play,
  Pause,
  Eye,
  EyeOff,
  ChevronRight,
  Maximize2,
  HelpCircle,
  Zap,
  ArrowDown,
  ArrowUp,
  Sliders,
  ShieldCheck,
  Compass
} from 'lucide-react';

// ============================================================================
// TISSUE LAYERS DATA FOR DORSIVENTRAL LEAF (GRADE 10 BIOLOGY)
// ============================================================================
const TISSUE_LAYERS = [
  {
    id: 'cuticle',
    name: 'Waxy Cuticle',
    subtitle: 'Acellular Waterproof Protective Layer',
    badgeColor: 'from-lime-500 to-emerald-600',
    accentColor: '#84cc16',
    borderClass: 'border-lime-500/50',
    bgClass: 'bg-lime-950/30',
    textClass: 'text-lime-400',
    svgHighlightY: 40,
    svgHighlightH: 22,
    pinPos: { x: 130, y: 52 },
    adaptations: [
      'Acellular translucent layer composed of hydrophobic cutin wax.',
      'Impermeable to liquid water and water vapor.',
      'Significantly thicker on the upper adaxial surface facing direct solar radiation.'
    ],
    function:
      'Prevents excessive water loss by non-stomatal transpiration; protects delicate internal mesophyll cells from mechanical injury, pathogen infection, and solar desiccation.',
    kcseExamTip:
      'KCSE Focus: Xerophytes possess a markedly thick, shiny cuticle to reflect intense sunlight and drastically minimize water evaporation in arid habitats.'
  },
  {
    id: 'upper_epidermis',
    name: 'Upper Epidermis',
    subtitle: 'Single Transparent Protective Cell Layer',
    badgeColor: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
    borderClass: 'border-emerald-500/50',
    bgClass: 'bg-emerald-950/30',
    textClass: 'text-emerald-400',
    svgHighlightY: 58,
    svgHighlightH: 62,
    pinPos: { x: 270, y: 90 },
    adaptations: [
      'Single-celled layer of tightly interlocking tabular/brick-shaped cells.',
      'Completely devoid of chloroplasts with transparent cytosol.',
      'Possesses thin primary cellulose walls with no intercellular gaps.'
    ],
    function:
      'Allows unobstructed penetration of solar light rays directly to the underlying palisade mesophyll while mechanically shielding internal tissues.',
    kcseExamTip:
      'KCSE Question: "State the importance of epidermal cells lacking chloroplasts." Answer: It ensures maximum transmission of light energy directly to photosynthetic palisade cells without light attenuation.'
  },
  {
    id: 'palisade_mesophyll',
    name: 'Palisade Mesophyll',
    subtitle: 'Primary Photosynthetic Tissue Layer',
    badgeColor: 'from-green-500 to-emerald-700',
    accentColor: '#22c55e',
    borderClass: 'border-green-500/50',
    bgClass: 'bg-green-950/30',
    textClass: 'text-green-400',
    svgHighlightY: 118,
    svgHighlightH: 168,
    pinPos: { x: 490, y: 200 },
    adaptations: [
      'Columnar, elongated cylindrical cells arranged perpendicular (at right angles) to the leaf surface.',
      'Densely packed with over 70% of the leaf total chloroplast count, oriented along lateral walls.',
      'Tightly packed with narrow vertical interstitial air spaces for rapid dissolved gas exchange.'
    ],
    function:
      'Maximizes solar photon interception and carbohydrate synthesis (carbon fixation). Columnar vertical orientation acts as a light-guide channeling photons deep into the leaf.',
    kcseExamTip:
      'KCSE Explanation: Elongated vertical orientation allows maximum number of chloroplast-rich cells to receive perpendicular sunlight per unit surface area, maximizing the rate of photosynthesis.'
  },
  {
    id: 'spongy_mesophyll',
    name: 'Spongy Mesophyll',
    subtitle: 'Gas Diffusion & Secondary Photosynthetic Layer',
    badgeColor: 'from-teal-500 to-cyan-600',
    accentColor: '#14b8a6',
    borderClass: 'border-teal-500/50',
    bgClass: 'bg-teal-950/30',
    textClass: 'text-teal-400',
    svgHighlightY: 285,
    svgHighlightH: 195,
    pinPos: { x: 230, y: 380 },
    adaptations: [
      'Loosely arranged, irregular spherical and lobed cells with large intercellular air spaces.',
      'Possesses fewer chloroplasts per cell than palisade tissue.',
      'Outer cell surfaces are lined by a continuous moisture film for gas dissolution.'
    ],
    function:
      'Provides extensive internal surface area for rapid gas diffusion (CO₂ inward toward palisade cells, O₂ outward); facilitates water evaporation from moist cell walls during transpiration.',
    kcseExamTip:
      'KCSE Question: "How does spongy mesophyll facilitate gas exchange?" Answer: Large interconnected intercellular air spaces create extensive internal surface area for rapid gas diffusion across moist cell membranes.'
  },
  {
    id: 'vascular_bundle',
    name: 'Vascular Bundle (Vein)',
    subtitle: 'Xylem (Water/Minerals) & Phloem (Translocation)',
    badgeColor: 'from-sky-500 to-blue-600',
    accentColor: '#0ea5e9',
    borderClass: 'border-sky-500/50',
    bgClass: 'bg-sky-950/30',
    textClass: 'text-sky-400',
    svgHighlightY: 275,
    svgHighlightH: 165,
    pinPos: { x: 740, y: 350 },
    adaptations: [
      'Xylem on the upper (adaxial) side: hollow, lignified dead vessels with thickened walls providing tensile support.',
      'Phloem on the lower (abaxial) side: living sieve tube elements with perforated sieve plates and companion cells.',
      'Surrounded by a protective cylinder of parenchyma (bundle sheath) providing skeletal rigidity.'
    ],
    function:
      'Xylem continuously delivers water and inorganic mineral ions from roots under transpirational pull; Phloem translocates manufactured sucrose and amino acids to plant sinks.',
    kcseExamTip:
      'KCSE Identification: In a dorsiventral leaf transverse section, Xylem is always located towards the UPPER epidermis, while Phloem is situated towards the LOWER epidermis.'
  },
  {
    id: 'lower_epidermis_stomata',
    name: 'Lower Epidermis & Stomata',
    subtitle: 'Stomatal Pores & Paired Photosynthetic Guard Cells',
    badgeColor: 'from-amber-500 to-orange-600',
    accentColor: '#f59e0b',
    borderClass: 'border-amber-500/50',
    bgClass: 'bg-amber-950/30',
    textClass: 'text-amber-400',
    svgHighlightY: 480,
    svgHighlightH: 80,
    pinPos: { x: 420, y: 520 },
    adaptations: [
      'Perforated by microscopic stomatal pores, each bounded by two kidney-shaped guard cells.',
      'Guard cells uniquely possess chloroplasts and differentially thickened cellulose walls (thick inner wall, thin outer wall).',
      'Opens directly into spacious sub-stomatal air chambers.'
    ],
    function:
      'Regulates stomatal transpiration and facilitates bidirectional gaseous exchange (CO₂ influx, O₂ and water vapor efflux) controlled by osmotic guard cell turgor pressure.',
    kcseExamTip:
      'KCSE Focus: In dorsiventral leaves, stomata are far more numerous on the lower epidermis to shield them from direct solar radiation and wind, significantly reducing excessive transpirational water loss.'
  }
];

// ============================================================================
// KCSE CHECKPOINT QUESTIONS
// ============================================================================
const KCSE_QUESTIONS = [
  {
    id: 'q1',
    prompt:
      'Why is the upper cuticle of a terrestrial dicotyledonous leaf typically thicker than the lower cuticle?',
    options: [
      {
        id: 'A',
        text: 'The upper surface faces direct solar radiation, experiencing greater evaporative heat stress, so a thicker cuticle drastically reduces non-stomatal water loss.',
        correct: true
      },
      {
        id: 'B',
        text: 'The upper cuticle must generate ATP through direct photovoltaic photolysis.',
        correct: false
      },
      {
        id: 'C',
        text: 'The upper cuticle contains living sieve cells that pump sugar directly into rain droplets.',
        correct: false
      },
      {
        id: 'D',
        text: 'To completely block carbon dioxide from escaping through the upper epidermis.',
        correct: false
      }
    ],
    rationale:
      'Correct! The adaxial (upper) leaf surface is exposed directly to intense sunlight and wind, generating higher temperatures and steeper vapor pressure gradients. A thicker cutin layer minimizes cuticular transpiration.'
  },
  {
    id: 'q2',
    prompt:
      'How does the columnar vertical arrangement of palisade mesophyll cells enhance photosynthetic efficiency?',
    options: [
      {
        id: 'A',
        text: 'It locks the cell walls together so stomata can open inside the xylem vessels.',
        correct: false
      },
      {
        id: 'B',
        text: 'Vertical packing accommodates a maximal number of chloroplast-dense cells per unit surface area, while allowing light to penetrate deeply along parallel vertical cell walls.',
        correct: true
      },
      {
        id: 'C',
        text: 'It prevents carbon dioxide from reaching the spongy mesophyll.',
        correct: false
      },
      {
        id: 'D',
        text: 'It forces water molecules to freeze during transpirational pull.',
        correct: false
      }
    ],
    rationale:
      'Correct! Palisade cells are elongated at right angles to the leaf plane. This allows high cell packing density (maximizing chlorophyll per square millimeter) and enables sunlight to penetrate deeply along vertical walls.'
  },
  {
    id: 'q3',
    prompt:
      'In a microscopic cross-section of a dorsiventral leaf vein, which statement correctly describes the arrangement of vascular tissues?',
    options: [
      {
        id: 'A',
        text: 'Phloem lies on the upper side to receive light; Xylem lies on the lower side to store sucrose.',
        correct: false
      },
      {
        id: 'B',
        text: 'Xylem is located towards the upper (adaxial) epidermis, whereas Phloem is located towards the lower (abaxial) epidermis.',
        correct: true
      },
      {
        id: 'C',
        text: 'Xylem and phloem alternate in horizontal concentric rings like an onion bulb.',
        correct: false
      },
      {
        id: 'D',
        text: 'Neither xylem nor phloem enter the leaf blade; only collenchyma exists in leaf veins.',
        correct: false
      }
    ],
    rationale:
      'Correct! In leaves, the vascular bundle originates from the stem where xylem is interior and phloem is exterior. When the vascular bundle branches out into the petiole and leaf blade, xylem naturally faces upward (adaxial) and phloem faces downward (abaxial).'
  }
];

// ============================================================================
// MAIN COMPONENT: LeafStructureCrossSectionSim
// ============================================================================
export default function LeafStructureCrossSectionSim({ config = {}, onTelemetry }) {
  // State management
  const [selectedLayerId, setSelectedLayerId] = useState('palisade_mesophyll');
  const [inspectedLayers, setInspectedLayers] = useState(() => new Set(['palisade_mesophyll']));
  const [hasTriggeredTelemetry, setHasTriggeredTelemetry] = useState(false);

  // Environmental & Flux Controls
  const [isDayTime, setIsDayTime] = useState(true);
  const [isFluxActive, setIsFluxActive] = useState(true);
  const [fluxSpeed, setFluxSpeed] = useState('normal'); // 'normal' | 'slow'
  const [showLabels, setShowLabels] = useState(true);
  const [activeTab, setActiveTab] = useState('inspector'); // 'inspector' | 'quiz'

  // Quiz state
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Animation frame reference
  const animTimeRef = useRef(0);
  const [, setTick] = useState(0);

  // Active layer object
  const activeLayer = useMemo(() => {
    return TISSUE_LAYERS.find((l) => l.id === selectedLayerId) || TISSUE_LAYERS[2];
  }, [selectedLayerId]);

  // Inspection progress
  const progressPercent = Math.round((inspectedLayers.size / TISSUE_LAYERS.length) * 100);

  // Continuous animation loop for particles and light rays
  useEffect(() => {
    let animId;
    const updateLoop = () => {
      if (isFluxActive) {
        animTimeRef.current += fluxSpeed === 'slow' ? 0.015 : 0.035;
        setTick((prev) => (prev + 1) % 10000);
      }
      animId = requestAnimationFrame(updateLoop);
    };
    animId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animId);
  }, [isFluxActive, fluxSpeed]);

  // Telemetry checkpoint emission
  useEffect(() => {
    if (inspectedLayers.size === TISSUE_LAYERS.length && !hasTriggeredTelemetry) {
      if (onTelemetry) {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'leaf_structure_cross_section',
          inspectedCount: TISSUE_LAYERS.length,
          allLayersInspected: true,
          completedAt: new Date().toISOString()
        });
      }
      setHasTriggeredTelemetry(true);
    }
  }, [inspectedLayers, hasTriggeredTelemetry, onTelemetry]);

  // Select tissue layer helper
  const handleSelectLayer = (id) => {
    setSelectedLayerId(id);
    setInspectedLayers((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Full reset handler
  const handleReset = () => {
    setSelectedLayerId('palisade_mesophyll');
    setInspectedLayers(new Set(['palisade_mesophyll']));
    setIsDayTime(true);
    setIsFluxActive(true);
    setFluxSpeed('normal');
    setShowLabels(true);
    setUserAnswers({});
    setQuizSubmitted(false);
    setActiveTab('inspector');
    setHasTriggeredTelemetry(false);

    if (onTelemetry) {
      onTelemetry('SIMULATION_RESET', {
        simulation: 'leaf_structure_cross_section',
        timestamp: Date.now()
      });
    }
  };

  // Quiz submission & score calculation
  const handleQuizAnswer = (questionId, optionId) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const quizScore = useMemo(() => {
    if (!quizSubmitted) return null;
    let correct = 0;
    KCSE_QUESTIONS.forEach((q) => {
      const selected = userAnswers[q.id];
      const opt = q.options.find((o) => o.id === selected);
      if (opt && opt.correct) correct += 1;
    });
    return correct;
  }, [quizSubmitted, userAnswers]);

  // SVG Particle Calculations
  const t = animTimeRef.current;

  // CO2 particles drifting into stoma and spongy mesophyll
  const co2Particles = useMemo(() => {
    if (!isDayTime) return [];
    const particles = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const phase = (t * 0.4 + i / count) % 1;
      const stomaX = i % 2 === 0 ? 418 : 688;
      const spreadX = Math.sin(phase * Math.PI * 3 + i) * 60;
      const posX = stomaX + (phase > 0.4 ? spreadX : (Math.random() - 0.5) * 10);
      const posY = 590 - phase * 260; // 590 -> 330
      particles.push({ id: `co2-${i}`, x: posX, y: posY, alpha: Math.sin(phase * Math.PI) });
    }
    return particles;
  }, [t, isDayTime]);

  // H2O molecules flowing from xylem and evaporating
  const h2oParticles = useMemo(() => {
    if (!isDayTime) return [];
    const particles = [];
    const count = 9;
    for (let i = 0; i < count; i++) {
      const phase = (t * 0.5 + i / count) % 1;
      const startX = 745 + ((i % 3) - 1) * 14;
      const startY = 310 + (i % 2) * 12;
      const targetX = startX - phase * 180 + Math.cos(phase * 4 + i) * 25;
      const targetY = startY + phase * 210;
      particles.push({ id: `h2o-${i}`, x: targetX, y: targetY, alpha: Math.sin(phase * Math.PI) });
    }
    return particles;
  }, [t, isDayTime]);

  // O2 bubbles generated in palisade and diffusing out
  const o2Particles = useMemo(() => {
    if (!isDayTime) return [];
    const particles = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const phase = (t * 0.45 + i / count) % 1;
      const startX = 200 + i * 70;
      const startY = 210 + (i % 3) * 20;
      const targetX = startX + Math.sin(phase * 3 + i) * 40;
      const targetY = startY + phase * 320;
      particles.push({ id: `o2-${i}`, x: targetX, y: targetY, alpha: Math.sin(phase * Math.PI) });
    }
    return particles;
  }, [t, isDayTime]);

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-5 text-slate-100 font-sans select-none">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-4 mb-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Title & Topic Meta */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Compass className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Grade 10 Biology • Topic 2
                </span>
                <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                  Dorsiventral Leaf Anatomy
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Leaf Structure &amp; Function Cross-Section
              </h1>
            </div>
          </div>

          {/* Environmental Controls & Utilities */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Day / Night Toggle */}
            <button
              onClick={() => setIsDayTime((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                isDayTime
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-indigo-950/70 border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/60'
              }`}
              title="Toggle Day/Night to open/close stomata and activate photosynthesis"
            >
              {isDayTime ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Day (Photosynthesis ON)</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Night (Stomata Closed)</span>
                </>
              )}
            </button>

            {/* Particle Animation Flux Toggle */}
            <button
              onClick={() => setIsFluxActive((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isFluxActive
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Play/Pause molecular gas and water flux animations"
            >
              {isFluxActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isFluxActive ? 'Flux Active' : 'Flux Paused'}</span>
            </button>

            {/* Labels Visibility Toggle */}
            <button
              onClick={() => setShowLabels((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                showLabels
                  ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Toggle overlay anatomical pin tags"
            >
              {showLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showLabels ? 'Pins Visible' : 'Pins Hidden'}</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all"
              title="Reset simulation to default state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Inspection Progress Bar */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Tissue Exploration:</span>
            <span className="font-bold text-white">
              {inspectedLayers.size} of {TISSUE_LAYERS.length} layers inspected
            </span>
          </div>

          <div className="flex-1 max-w-xs h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {inspectedLayers.size === TISSUE_LAYERS.length ? (
            <span className="flex items-center gap-1 font-bold text-emerald-400 animate-pulse">
              <ShieldCheck className="w-4 h-4" />
              <span>Checkpoint Verified!</span>
            </span>
          ) : (
            <span className="text-slate-400 hidden sm:inline">
              Click all 6 layers or pins to unlock checkpoint
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Left/Center Diagram + Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* SVG Diagram Canvas (8 Cols on Desktop) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-2 sm:p-4 shadow-2xl overflow-hidden">
            {/* Top Atmospheric Ambient Glow */}
            <div
              className={`absolute top-0 left-0 right-0 h-20 pointer-events-none transition-all duration-700 ${
                isDayTime
                  ? 'bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent'
                  : 'bg-gradient-to-b from-indigo-950/40 to-transparent'
              }`}
            />

            {/* SVG Interactive Dorsiventral Leaf Canvas */}
            <svg
              viewBox="0 0 960 620"
              className="w-full h-auto drop-shadow-md select-none rounded-xl"
              style={{ background: isDayTime ? '#08131d' : '#040b12' }}
            >
              <defs>
                {/* Upper Cuticle Gradient */}
                <linearGradient id="cuticleTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a3e635" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#65a30d" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#4d7c0f" stopOpacity="0.9" />
                </linearGradient>

                {/* Lower Cuticle Gradient */}
                <linearGradient id="cuticleBottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4d7c0f" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#84cc16" stopOpacity="0.65" />
                </linearGradient>

                {/* Epidermis Cell Gradient */}
                <linearGradient id="epidermisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.1" />
                </linearGradient>

                {/* Palisade Cell Gradient */}
                <linearGradient id="palisadeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#15803d" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#166534" stopOpacity="0.6" />
                </linearGradient>

                {/* Spongy Cell Gradient */}
                <linearGradient id="spongyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0f766e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#115e59" stopOpacity="0.55" />
                </linearGradient>

                {/* Xylem Vessel Gradient */}
                <linearGradient id="xylemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
                </linearGradient>

                {/* Phloem Sieve Tube Gradient */}
                <linearGradient id="phloemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
                </linearGradient>

                {/* Bundle Sheath Gradient */}
                <linearGradient id="bundleSheathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.45" />
                </linearGradient>

                {/* Guard Cell Gradient */}
                <linearGradient id="guardCellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#84cc16" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#4d7c0f" stopOpacity="0.95" />
                </linearGradient>

                {/* Sunlight Beams */}
                <linearGradient id="sunBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.5" />
                  <stop offset="40%" stopColor="#fde047" stopOpacity="0.3" />
                  <stop offset="85%" stopColor="#ca8a04" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* ------------------------------------------------------------- */}
              {/* INCIDENT SUNLIGHT RAYS (ANIMATED DOWNWARD BEAMS) */}
              {/* ------------------------------------------------------------- */}
              {isDayTime && (
                <g className="transition-opacity duration-700 pointer-events-none">
                  {[80, 190, 310, 440, 570, 700, 830].map((beamX, i) => {
                    const sway = Math.sin(t * 0.8 + i) * 6;
                    return (
                      <polygon
                        key={`beam-${i}`}
                        points={`${beamX - 18 + sway},0 ${beamX + 18 + sway},0 ${beamX + 32 + sway},240 ${beamX - 32 + sway},240`}
                        fill="url(#sunBeamGrad)"
                        opacity={0.65 + 0.35 * Math.sin(t * 1.5 + i)}
                      />
                    );
                  })}
                </g>
              )}

              {/* ------------------------------------------------------------- */}
              {/* LAYER 1: UPPER WAXY CUTICLE (y: 44 to 58) */}
              {/* ------------------------------------------------------------- */}
              <g
                id="layer-cuticle"
                onClick={() => handleSelectLayer('cuticle')}
                className="cursor-pointer group"
              >
                {/* Active Highlight Outline */}
                {selectedLayerId === 'cuticle' && (
                  <rect
                    x="25"
                    y="38"
                    width="910"
                    height="26"
                    rx="8"
                    fill="#84cc16"
                    fillOpacity="0.18"
                    stroke="#84cc16"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                )}
                {/* Waxy Cuticle Bar */}
                <path
                  d="M 35 56 Q 480 53 925 56 L 925 44 Q 480 41 35 44 Z"
                  fill="url(#cuticleTopGrad)"
                  stroke="#a3e635"
                  strokeWidth="1.8"
                />
                {/* Specular sheen on cuticle */}
                <path
                  d="M 60 47 Q 480 44 900 47"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeOpacity="0.75"
                  strokeLinecap="round"
                />
              </g>

              {/* ------------------------------------------------------------- */}
              {/* LAYER 2: UPPER EPIDERMIS (y: 58 to 118) */}
              {/* ------------------------------------------------------------- */}
              <g
                id="layer-upper-epidermis"
                onClick={() => handleSelectLayer('upper_epidermis')}
                className="cursor-pointer group"
              >
                {/* Active Highlight */}
                {selectedLayerId === 'upper_epidermis' && (
                  <rect
                    x="25"
                    y="55"
                    width="910"
                    height="66"
                    rx="10"
                    fill="#10b981"
                    fillOpacity="0.15"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                )}
                {/* Upper Epidermal Cells (14 tabular transparent cells, NO chloroplasts) */}
                {Array.from({ length: 14 }).map((_, i) => {
                  const cellW = 62;
                  const cellX = 40 + i * (cellW + 1.5);
                  return (
                    <g key={`upper-epi-${i}`}>
                      <rect
                        x={cellX}
                        y="58"
                        width={cellW}
                        height="58"
                        rx="7"
                        fill="url(#epidermisGrad)"
                        stroke="#34d399"
                        strokeWidth="2"
                        className="group-hover:stroke-emerald-300 transition-colors"
                      />
                      {/* Prominent peripheral nucleus */}
                      <ellipse
                        cx={cellX + cellW * 0.5}
                        cy="87"
                        rx="8.5"
                        ry="6.5"
                        fill="#818cf8"
                        fillOpacity="0.75"
                        stroke="#6366f1"
                        strokeWidth="1.5"
                      />
                      {/* Dark nucleolus */}
                      <circle cx={cellX + cellW * 0.5 + 1.5} cy="86.5" r="2.2" fill="#312e81" />
                      {/* Transparent cytosol highlight */}
                      <line
                        x1={cellX + 8}
                        y1="64"
                        x2={cellX + cellW - 8}
                        y2="64"
                        stroke="#ffffff"
                        strokeOpacity="0.25"
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}
              </g>

              {/* ------------------------------------------------------------- */}
              {/* LAYER 3: PALISADE MESOPHYLL (y: 118 to 285) */}
              {/* ------------------------------------------------------------- */}
              <g
                id="layer-palisade-mesophyll"
                onClick={() => handleSelectLayer('palisade_mesophyll')}
                className="cursor-pointer group"
              >
                {/* Active Highlight */}
                {selectedLayerId === 'palisade_mesophyll' && (
                  <rect
                    x="25"
                    y="117"
                    width="910"
                    height="170"
                    rx="12"
                    fill="#22c55e"
                    fillOpacity="0.14"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                )}
                {/* Palisade Columnar Cells (~16 tightly packed elongated cells) */}
                {Array.from({ length: 16 }).map((_, i) => {
                  const pW = 52;
                  const pX = 42 + i * (pW + 2.5);
                  const pH = 158;
                  const pY = 120;
                  return (
                    <g key={`palisade-${i}`}>
                      {/* Columnar Cell Wall */}
                      <rect
                        x={pX}
                        y={pY}
                        width={pW}
                        height={pH}
                        rx="12"
                        fill="url(#palisadeGrad)"
                        stroke="#22c55e"
                        strokeWidth="2"
                        className="group-hover:stroke-green-300 transition-colors"
                      />

                      {/* Large Central Vacuole */}
                      <rect
                        x={pX + 8}
                        y={pY + 12}
                        width={pW - 16}
                        height={pH - 24}
                        rx="8"
                        fill="#064e3b"
                        fillOpacity="0.35"
                        stroke="#10b981"
                        strokeWidth="1"
                        strokeOpacity="0.4"
                      />

                      {/* Peripherally Packed Chloroplasts (13 chloroplasts aligned along lateral walls) */}
                      {[
                        { cx: pX + 5, cy: pY + 22 },
                        { cx: pX + 5, cy: pY + 50 },
                        { cx: pX + 5, cy: pY + 78 },
                        { cx: pX + 5, cy: pY + 106 },
                        { cx: pX + 5, cy: pY + 134 },
                        { cx: pX + pW - 5, cy: pY + 22 },
                        { cx: pX + pW - 5, cy: pY + 50 },
                        { cx: pX + pW - 5, cy: pY + 78 },
                        { cx: pX + pW - 5, cy: pY + 106 },
                        { cx: pX + pW - 5, cy: pY + 134 },
                        { cx: pX + pW * 0.35, cy: pY + 7 },
                        { cx: pX + pW * 0.65, cy: pY + 7 },
                        { cx: pX + pW * 0.5, cy: pY + pH - 7 }
                      ].map((chl, cIdx) => (
                        <ellipse
                          key={`pal-chl-${i}-${cIdx}`}
                          cx={chl.cx}
                          cy={chl.cy}
                          rx="4.8"
                          ry="7.2"
                          fill="#4ade80"
                          stroke="#15803d"
                          strokeWidth="1.2"
                          className={isDayTime ? 'animate-pulse' : ''}
                        />
                      ))}

                      {/* Nucleus */}
                      <circle
                        cx={pX + pW * 0.5}
                        cy={pY + pH * 0.65}
                        r="6"
                        fill="#818cf8"
                        stroke="#4f46e5"
                        strokeWidth="1.2"
                      />
                    </g>
                  );
                })}
              </g>

              {/* ------------------------------------------------------------- */}
              {/* LAYER 4: SPONGY MESOPHYLL & AIR SPACES (y: 285 to 480) */}
              {/* ------------------------------------------------------------- */}
              <g
                id="layer-spongy-mesophyll"
                onClick={() => handleSelectLayer('spongy_mesophyll')}
                className="cursor-pointer group"
              >
                {/* Active Highlight */}
                {selectedLayerId === 'spongy_mesophyll' && (
                  <rect
                    x="25"
                    y="285"
                    width="910"
                    height="195"
                    rx="12"
                    fill="#14b8a6"
                    fillOpacity="0.14"
                    stroke="#14b8a6"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                )}

                {/* Loosely arranged, irregular round / lobed spongy cells */}
                {[
                  // Column 1
                  { cx: 70, cy: 320, r: 24 },
                  { cx: 125, cy: 335, r: 26 },
                  { cx: 80, cy: 385, r: 25 },
                  { cx: 135, cy: 410, r: 28 },
                  { cx: 75, cy: 450, r: 22 },
                  // Column 2
                  { cx: 200, cy: 315, r: 28 },
                  { cx: 255, cy: 345, r: 25 },
                  { cx: 195, cy: 385, r: 27 },
                  { cx: 260, cy: 420, r: 26 },
                  { cx: 205, cy: 455, r: 23 },
                  // Column 3
                  { cx: 330, cy: 320, r: 27 },
                  { cx: 380, cy: 350, r: 24 },
                  { cx: 325, cy: 395, r: 26 },
                  { cx: 375, cy: 440, r: 25 },
                  // Column 4 (around sub-stomatal cavity)
                  { cx: 460, cy: 325, r: 25 },
                  { cx: 515, cy: 330, r: 28 },
                  { cx: 465, cy: 410, r: 26 },
                  { cx: 520, cy: 435, r: 25 },
                  // Column 5 (left of vascular bundle)
                  { cx: 600, cy: 320, r: 26 },
                  { cx: 615, cy: 390, r: 28 },
                  { cx: 595, cy: 450, r: 24 },
                  // Column 6 (right side of leaf)
                  { cx: 865, cy: 325, r: 25 },
                  { cx: 910, cy: 355, r: 23 },
                  { cx: 860, cy: 395, r: 27 },
                  { cx: 915, cy: 435, r: 24 },
                  { cx: 855, cy: 455, r: 22 }
                ].map((sc, sIdx) => (
                  <g key={`spongy-cell-${sIdx}`}>
                    {/* Spongy cell body */}
                    <circle
                      cx={sc.cx}
                      cy={sc.cy}
                      r={sc.r}
                      fill="url(#spongyGrad)"
                      stroke="#2dd4bf"
                      strokeWidth="1.8"
                      className="group-hover:stroke-teal-300 transition-colors"
                    />
                    {/* Moist film indicator on cell perimeter */}
                    <circle
                      cx={sc.cx}
                      cy={sc.cy}
                      r={sc.r - 2.5}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="0.8"
                      strokeOpacity="0.4"
                    />
                    {/* Few chloroplasts (4 per cell) */}
                    {[
                      { dx: -sc.r * 0.45, dy: -sc.r * 0.3 },
                      { dx: sc.r * 0.45, dy: -sc.r * 0.35 },
                      { dx: -sc.r * 0.35, dy: sc.r * 0.4 },
                      { dx: sc.r * 0.4, dy: sc.r * 0.35 }
                    ].map((cOffset, coIdx) => (
                      <ellipse
                        key={`sp-chl-${sIdx}-${coIdx}`}
                        cx={sc.cx + cOffset.dx}
                        cy={sc.cy + cOffset.dy}
                        rx="3.5"
                        ry="4.8"
                        fill="#4ade80"
                        stroke="#0d9488"
                        strokeWidth="0.9"
                      />
                    ))}
                    {/* Small Nucleus */}
                    <circle
                      cx={sc.cx}
                      cy={sc.cy}
                      r="4.5"
                      fill="#818cf8"
                      stroke="#4338ca"
                      strokeWidth="1"
                    />
                  </g>
                ))}

                {/* Visible Air Spaces Annotation Text */}
                <text
                  x="150"
                  y="360"
                  fill="#5eead4"
                  fillOpacity="0.45"
                  fontSize="10"
                  fontWeight="600"
                  letterSpacing="1"
                >
                  INTERCELLULAR AIR SPACE
                </text>
                <text
                  x="330"
                  y="430"
                  fill="#5eead4"
                  fillOpacity="0.45"
                  fontSize="10"
                  fontWeight="600"
                  letterSpacing="1"
                >
                  AIR CANAL
                </text>
              </g>

              {/* ------------------------------------------------------------- */}
              {/* LAYER 5: VASCULAR BUNDLE (VEIN) (x: 670 to 810, y: 275 to 445) */}
              {/* ------------------------------------------------------------- */}
              <g
                id="layer-vascular-bundle"
                onClick={() => handleSelectLayer('vascular_bundle')}
                className="cursor-pointer group"
              >
                {/* Active Highlight */}
                {selectedLayerId === 'vascular_bundle' && (
                  <ellipse
                    cx="740"
                    cy="360"
                    rx="88"
                    ry="88"
                    fill="#0ea5e9"
                    fillOpacity="0.16"
                    stroke="#0ea5e9"
                    strokeWidth="2.8"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                )}

                {/* Bundle Sheath Outer Parenchyma Ring */}
                <ellipse
                  cx="740"
                  cy="360"
                  rx="76"
                  ry="78"
                  fill="url(#bundleSheathGrad)"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                {/* Individual Bundle Sheath Border Cells */}
                {Array.from({ length: 16 }).map((_, bIdx) => {
                  const angle = (bIdx / 16) * Math.PI * 2;
                  const bx = 740 + Math.cos(angle) * 68;
                  const by = 360 + Math.sin(angle) * 70;
                  return (
                    <circle
                      key={`bs-${bIdx}`}
                      cx={bx}
                      cy={by}
                      r="12"
                      fill="#064e3b"
                      stroke="#34d399"
                      strokeWidth="1.5"
                    />
                  );
                })}

                {/* UPPER HALF: XYLEM VESSELS (Lignified, water transport) */}
                <g id="xylem-section">
                  {/* Internal Xylem Boundary */}
                  <path
                    d="M 678 355 C 678 310 802 310 802 355 Z"
                    fill="#0369a1"
                    fillOpacity="0.25"
                  />
                  {/* Large Xylem Lumens */}
                  {[
                    { cx: 720, cy: 325, r: 15, thick: 3.5 },
                    { cx: 755, cy: 320, r: 16, thick: 3.8 },
                    { cx: 738, cy: 348, r: 14, thick: 3.2 },
                    { cx: 700, cy: 345, r: 11, thick: 2.8 },
                    { cx: 775, cy: 345, r: 12, thick: 3.0 }
                  ].map((xv, xIdx) => (
                    <g key={`xylem-vessel-${xIdx}`}>
                      {/* Lignified Wall */}
                      <circle
                        cx={xv.cx}
                        cy={xv.cy}
                        r={xv.r}
                        fill="url(#xylemGrad)"
                        stroke="#7dd3fc"
                        strokeWidth={xv.thick}
                        className="group-hover:stroke-white transition-colors"
                      />
                      {/* Vessel Inner Lumen */}
                      <circle cx={xv.cx} cy={xv.cy} r={xv.r - 4} fill="#082f49" />
                      {/* Spiral / Ring Lignin lines */}
                      <ellipse
                        cx={xv.cx}
                        cy={xv.cy}
                        rx={xv.r - 5}
                        ry="3.5"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1"
                        strokeOpacity="0.6"
                      />
                    </g>
                  ))}
                  {/* Xylem Text Label */}
                  <text
                    x="737"
                    y="302"
                    textAnchor="middle"
                    fill="#7dd3fc"
                    fontSize="11"
                    fontWeight="800"
                    letterSpacing="0.8"
                  >
                    XYLEM (H₂O)
                  </text>
                </g>

                {/* LOWER HALF: PHLOEM (Sieve tubes & Companion cells) */}
                <g id="phloem-section">
                  {/* Internal Phloem Boundary */}
                  <path
                    d="M 678 365 C 678 415 802 415 802 365 Z"
                    fill="#92400e"
                    fillOpacity="0.25"
                  />
                  {/* Smaller Phloem Sieve Elements */}
                  {[
                    { cx: 715, cy: 382, r: 9 },
                    { cx: 736, cy: 378, r: 8.5 },
                    { cx: 758, cy: 382, r: 9 },
                    { cx: 724, cy: 402, r: 8 },
                    { cx: 746, cy: 405, r: 8.5 },
                    { cx: 768, cy: 400, r: 7.5 }
                  ].map((pe, pIdx) => (
                    <g key={`phloem-elem-${pIdx}`}>
                      <circle
                        cx={pe.cx}
                        cy={pe.cy}
                        r={pe.r}
                        fill="url(#phloemGrad)"
                        stroke="#fbbf24"
                        strokeWidth="1.8"
                      />
                      {/* Sieve Plate Pores */}
                      <circle cx={pe.cx - 2} cy={pe.cy} r="1.2" fill="#451a03" />
                      <circle cx={pe.cx + 2} cy={pe.cy} r="1.2" fill="#451a03" />
                    </g>
                  ))}
                  {/* Phloem Text Label */}
                  <text
                    x="737"
                    y="426"
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize="11"
                    fontWeight="800"
                    letterSpacing="0.8"
                  >
                    PHLOEM (Sucrose)
                  </text>
                </g>
              </g>

              {/* ------------------------------------------------------------- */}
              {/* LAYER 6: LOWER EPIDERMIS & STOMATAL COMPLEX (y: 480 to 542) */}
              {/* ------------------------------------------------------------- */}
              <g
                id="layer-lower-epidermis-stomata"
                onClick={() => handleSelectLayer('lower_epidermis_stomata')}
                className="cursor-pointer group"
              >
                {/* Active Highlight */}
                {selectedLayerId === 'lower_epidermis_stomata' && (
                  <rect
                    x="25"
                    y="478"
                    width="910"
                    height="75"
                    rx="10"
                    fill="#f59e0b"
                    fillOpacity="0.15"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                )}

                {/* Sub-Stomatal Air Chambers (large cavities above stomata) */}
                <ellipse
                  cx="418"
                  cy="478"
                  rx="48"
                  ry="24"
                  fill="#03161c"
                  stroke="#14b8a6"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <ellipse
                  cx="688"
                  cy="478"
                  rx="48"
                  ry="24"
                  fill="#03161c"
                  stroke="#14b8a6"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* Lower Epidermal Cells (interrupted by stomata at x: 418 and x: 688) */}
                {[
                  // Segment 1 (x: 40 to 370)
                  { x: 40, w: 58 },
                  { x: 100, w: 58 },
                  { x: 160, w: 58 },
                  { x: 220, w: 58 },
                  { x: 280, w: 58 },
                  { x: 340, w: 42 },
                  // Segment 2 (x: 456 to 640)
                  { x: 456, w: 46 },
                  { x: 504, w: 58 },
                  { x: 564, w: 58 },
                  { x: 624, w: 32 },
                  // Segment 3 (x: 726 to 925)
                  { x: 726, w: 48 },
                  { x: 776, w: 58 },
                  { x: 836, w: 58 },
                  { x: 896, w: 32 }
                ].map((le, lIdx) => (
                  <g key={`lower-epi-${lIdx}`}>
                    <rect
                      x={le.x}
                      y="488"
                      width={le.w}
                      height="50"
                      rx="6"
                      fill="url(#epidermisGrad)"
                      stroke="#34d399"
                      strokeWidth="1.8"
                    />
                    {/* Nucleus */}
                    <ellipse
                      cx={le.x + le.w * 0.5}
                      cy="513"
                      rx="7.5"
                      ry="5.5"
                      fill="#818cf8"
                      stroke="#4f46e5"
                      strokeWidth="1.2"
                    />
                  </g>
                ))}

                {/* STOMA 1 (x: 418) - Paired Guard Cells */}
                <g id="stoma-1" className="transition-transform duration-500">
                  {/* Left Guard Cell */}
                  <path
                    d={
                      isDayTime
                        ? 'M 404 492 C 388 506 388 522 404 536 C 414 522 414 506 404 492 Z'
                        : 'M 412 492 C 400 506 400 522 412 536 C 416 522 416 506 412 492 Z'
                    }
                    fill="url(#guardCellGrad)"
                    stroke="#a3e635"
                    strokeWidth={isDayTime ? '2.5' : '2'}
                  />
                  {/* Right Guard Cell */}
                  <path
                    d={
                      isDayTime
                        ? 'M 432 492 C 448 506 448 522 432 536 C 422 522 422 506 432 492 Z'
                        : 'M 424 492 C 436 506 436 522 424 536 C 420 522 420 506 424 492 Z'
                    }
                    fill="url(#guardCellGrad)"
                    stroke="#a3e635"
                    strokeWidth={isDayTime ? '2.5' : '2'}
                  />
                  {/* Thick Inner Walls facing pore */}
                  <path
                    d={
                      isDayTime
                        ? 'M 404 492 C 414 506 414 522 404 536'
                        : 'M 412 492 C 416 506 416 522 412 536'
                    }
                    fill="none"
                    stroke="#14532d"
                    strokeWidth="3.2"
                  />
                  <path
                    d={
                      isDayTime
                        ? 'M 432 492 C 422 506 422 522 432 536'
                        : 'M 424 492 C 420 506 420 522 424 536'
                    }
                    fill="none"
                    stroke="#14532d"
                    strokeWidth="3.2"
                  />
                  {/* Guard Cell Chloroplasts (Uniquely present in guard cells!) */}
                  <circle cx="397" cy="505" r="2.4" fill="#22c55e" />
                  <circle cx="396" cy="522" r="2.4" fill="#22c55e" />
                  <circle cx="439" cy="505" r="2.4" fill="#22c55e" />
                  <circle cx="440" cy="522" r="2.4" fill="#22c55e" />
                </g>

                {/* STOMA 2 (x: 688) - Paired Guard Cells */}
                <g id="stoma-2" className="transition-transform duration-500">
                  <path
                    d={
                      isDayTime
                        ? 'M 674 492 C 658 506 658 522 674 536 C 684 522 684 506 674 492 Z'
                        : 'M 682 492 C 670 506 670 522 682 536 C 686 522 686 506 682 492 Z'
                    }
                    fill="url(#guardCellGrad)"
                    stroke="#a3e635"
                    strokeWidth={isDayTime ? '2.5' : '2'}
                  />
                  <path
                    d={
                      isDayTime
                        ? 'M 702 492 C 718 506 718 522 702 536 C 692 522 692 506 702 492 Z'
                        : 'M 694 492 C 706 506 706 522 694 536 C 690 522 690 506 694 492 Z'
                    }
                    fill="url(#guardCellGrad)"
                    stroke="#a3e635"
                    strokeWidth={isDayTime ? '2.5' : '2'}
                  />
                  {/* Thick Inner Walls */}
                  <path
                    d={
                      isDayTime
                        ? 'M 674 492 C 684 506 684 522 674 536'
                        : 'M 682 492 C 686 506 686 522 682 536'
                    }
                    fill="none"
                    stroke="#14532d"
                    strokeWidth="3.2"
                  />
                  <path
                    d={
                      isDayTime
                        ? 'M 702 492 C 692 506 692 522 702 536'
                        : 'M 694 492 C 690 506 690 522 694 536'
                    }
                    fill="none"
                    stroke="#14532d"
                    strokeWidth="3.2"
                  />
                  {/* Guard Cell Chloroplasts */}
                  <circle cx="667" cy="505" r="2.4" fill="#22c55e" />
                  <circle cx="666" cy="522" r="2.4" fill="#22c55e" />
                  <circle cx="709" cy="505" r="2.4" fill="#22c55e" />
                  <circle cx="710" cy="522" r="2.4" fill="#22c55e" />
                </g>
              </g>

              {/* ------------------------------------------------------------- */}
              {/* LOWER CUTICLE (y: 538 to 546) */}
              {/* ------------------------------------------------------------- */}
              <g id="lower-cuticle" className="pointer-events-none">
                <path
                  d="M 35 538 L 385 538 L 385 545 L 35 545 Z"
                  fill="url(#cuticleBottomGrad)"
                  stroke="#84cc16"
                  strokeWidth="1.2"
                />
                <path
                  d="M 452 538 L 655 538 L 655 545 L 452 545 Z"
                  fill="url(#cuticleBottomGrad)"
                  stroke="#84cc16"
                  strokeWidth="1.2"
                />
                <path
                  d="M 722 538 L 925 538 L 925 545 L 722 545 Z"
                  fill="url(#cuticleBottomGrad)"
                  stroke="#84cc16"
                  strokeWidth="1.2"
                />
              </g>

              {/* ------------------------------------------------------------- */}
              {/* DYNAMIC MOLECULAR FLUX PARTICLES (CO2, H2O, O2) */}
              {/* ------------------------------------------------------------- */}
              {isFluxActive && isDayTime && (
                <g id="flux-particles" className="pointer-events-none">
                  {/* CO2 Particles Entering Stomata & Diffusing Up */}
                  {co2Particles.map((p) => (
                    <g key={p.id} transform={`translate(${p.x}, ${p.y})`} opacity={p.alpha}>
                      <circle r="7" fill="#083344" stroke="#06b6d4" strokeWidth="1.5" />
                      <text
                        x="0"
                        y="2.5"
                        textAnchor="middle"
                        fill="#67e8f9"
                        fontSize="7"
                        fontWeight="bold"
                      >
                        CO₂
                      </text>
                    </g>
                  ))}

                  {/* H2O Water Vapor & Droplets Transpiring */}
                  {h2oParticles.map((p) => (
                    <g key={p.id} transform={`translate(${p.x}, ${p.y})`} opacity={p.alpha}>
                      <circle r="6.5" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
                      <text
                        x="0"
                        y="2.5"
                        textAnchor="middle"
                        fill="#bae6fd"
                        fontSize="6.5"
                        fontWeight="bold"
                      >
                        H₂O
                      </text>
                    </g>
                  ))}

                  {/* O2 Oxygen Bubbles Diffusing Out */}
                  {o2Particles.map((p) => (
                    <g key={p.id} transform={`translate(${p.x}, ${p.y})`} opacity={p.alpha}>
                      <circle r="6.5" fill="#052e16" stroke="#4ade80" strokeWidth="1.5" />
                      <text
                        x="0"
                        y="2.5"
                        textAnchor="middle"
                        fill="#bbf7d0"
                        fontSize="7"
                        fontWeight="bold"
                      >
                        O₂
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* ------------------------------------------------------------- */}
              {/* INTERACTIVE PINS & LABELS OVERLAY */}
              {/* ------------------------------------------------------------- */}
              {showLabels && (
                <g id="interactive-pins">
                  {TISSUE_LAYERS.map((layer, idx) => {
                    const isSelected = selectedLayerId === layer.id;
                    const isInspected = inspectedLayers.has(layer.id);
                    return (
                      <g
                        key={`pin-${layer.id}`}
                        transform={`translate(${layer.pinPos.x}, ${layer.pinPos.y})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectLayer(layer.id);
                        }}
                        className="cursor-pointer group"
                      >
                        {/* Ripple Effect for selected pin */}
                        {isSelected && (
                          <circle
                            r="18"
                            fill="none"
                            stroke={layer.accentColor}
                            strokeWidth="2"
                            opacity="0.8"
                            className="animate-ping"
                          />
                        )}

                        {/* Pin Background Disc */}
                        <circle
                          r="13"
                          fill={isSelected ? layer.accentColor : '#0f172a'}
                          stroke={isSelected ? '#ffffff' : layer.accentColor}
                          strokeWidth="2.5"
                          className="transition-all duration-300 shadow-lg"
                        />

                        {/* Pin Number */}
                        <text
                          x="0"
                          y="4.5"
                          textAnchor="middle"
                          fill={isSelected ? '#0f172a' : '#ffffff'}
                          fontSize="11"
                          fontWeight="900"
                        >
                          {idx + 1}
                        </text>

                        {/* Floating Label Badge */}
                        <g transform="translate(18, -12)">
                          <rect
                            x="0"
                            y="0"
                            width={layer.name.length * 7.5 + 24}
                            height="24"
                            rx="12"
                            fill="#090d16"
                            fillOpacity="0.88"
                            stroke={isSelected ? layer.accentColor : '#334155'}
                            strokeWidth={isSelected ? '1.8' : '1'}
                            className="transition-colors"
                          />
                          {isInspected && (
                            <circle cx="12" cy="12" r="3.5" fill={layer.accentColor} />
                          )}
                          <text
                            x={isInspected ? 22 : 12}
                            y="15.5"
                            fill={isSelected ? '#ffffff' : '#cbd5e1'}
                            fontSize="10.5"
                            fontWeight={isSelected ? '800' : '600'}
                          >
                            {layer.name}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Bottom Surface Ambient Gas Direction Indicator */}
              {isDayTime && (
                <g transform="translate(418, 595)" opacity="0.8">
                  <path
                    d="M 0 0 L 0 -22 M -4 -16 L 0 -22 L 4 -16"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text
                    x="8"
                    y="-8"
                    fill="#06b6d4"
                    fontSize="9.5"
                    fontWeight="700"
                    textAnchor="start"
                  >
                    CO₂ Influx
                  </text>
                </g>
              )}
              {isDayTime && (
                <g transform="translate(688, 575)" opacity="0.8">
                  <path
                    d="M 0 -22 L 0 0 M -4 -6 L 0 0 L 4 -6"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text
                    x="8"
                    y="-8"
                    fill="#38bdf8"
                    fontSize="9.5"
                    fontWeight="700"
                    textAnchor="start"
                  >
                    H₂O Transpiration &amp; O₂ Outflow
                  </text>
                </g>
              )}
            </svg>

            {/* Quick Layer Selector Pills */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Layers:</span>
              </span>
              {TISSUE_LAYERS.map((layer, idx) => {
                const isSelected = selectedLayerId === layer.id;
                const isInspected = inspectedLayers.has(layer.id);
                return (
                  <button
                    key={`btn-${layer.id}`}
                    onClick={() => handleSelectLayer(layer.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? `${layer.bgClass} ${layer.borderClass} ${layer.textClass} border shadow-md`
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isInspected ? 'bg-emerald-400' : 'bg-slate-600'
                      }`}
                    />
                    <span>
                      {idx + 1}. {layer.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Biological Consequence Banner */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-3 text-xs flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-200">Current Biological Status: </span>
                <span className="text-slate-400">
                  {isDayTime
                    ? 'Stomata open (turgid guard cells) • Active CO₂ diffusion & photolysis • Transpiration stream flowing.'
                    : 'Stomata closed (flaccid guard cells) • Photosynthesis halted • Transpiration minimized to conserve water.'}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-slate-400">Speed:</span>
              <button
                onClick={() => setFluxSpeed((s) => (s === 'normal' ? 'slow' : 'normal'))}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-slate-300"
              >
                {fluxSpeed === 'normal' ? '1.0x' : '0.5x'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Inspector / KCSE Quiz (4 Cols on Desktop) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Navigation Tabs */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-1.5 flex items-center gap-1 shadow-md">
            <button
              onClick={() => setActiveTab('inspector')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'inspector'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Function Badge</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>KCSE Checkpoint</span>
            </button>
          </div>

          {/* TAB 1: FUNCTION BADGE INSPECTOR */}
          {activeTab === 'inspector' && (
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col gap-4 flex-1">
              {/* Layer Title Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${activeLayer.textClass}`}
                  >
                    Tissue Layer {TISSUE_LAYERS.findIndex((l) => l.id === activeLayer.id) + 1} of{' '}
                    {TISSUE_LAYERS.length}
                  </span>
                  <h2 className="text-base font-extrabold text-white mt-0.5">{activeLayer.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{activeLayer.subtitle}</p>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold bg-gradient-to-r ${activeLayer.badgeColor} text-slate-950 shadow-md shrink-0`}
                >
                  Inspected
                </div>
              </div>

              {/* Primary Biological Function */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Primary Function</span>
                </h3>
                <div
                  className={`p-3 rounded-xl border ${activeLayer.borderClass} ${activeLayer.bgClass} text-xs text-slate-200 leading-relaxed font-medium`}
                >
                  {activeLayer.function}
                </div>
              </div>

              {/* Key Structural Adaptations */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Structural Adaptations</span>
                </h3>
                <ul className="space-y-2">
                  {activeLayer.adaptations.map((adapt, aIdx) => (
                    <li
                      key={`adp-${aIdx}`}
                      className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span className="leading-snug">{adapt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* KCSE Exam Tip Box */}
              <div className="mt-auto pt-2">
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Grade 10 KCSE Key Insight</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-200/80">
                    {activeLayer.kcseExamTip}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KCSE CHECKPOINT QUIZ */}
          {activeTab === 'quiz' && (
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h2 className="text-sm font-bold text-white">KCSE Quick Check</h2>
                  <p className="text-xs text-slate-400">Test your mastery of leaf adaptations</p>
                </div>
                {quizSubmitted && quizScore !== null && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                    Score: {quizScore} / {KCSE_QUESTIONS.length}
                  </span>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {KCSE_QUESTIONS.map((q, qIndex) => {
                  const selectedOpt = userAnswers[q.id];
                  return (
                    <div
                      key={q.id}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-2"
                    >
                      <p className="text-xs font-bold text-slate-200">
                        {qIndex + 1}. {q.prompt}
                      </p>

                      <div className="space-y-1.5 mt-1">
                        {q.options.map((opt) => {
                          const isPicked = selectedOpt === opt.id;
                          let btnStyle =
                            'bg-slate-900 hover:bg-slate-800/80 border-slate-800 text-slate-300';
                          if (isPicked) {
                            btnStyle = 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold';
                          }
                          if (quizSubmitted) {
                            if (opt.correct) {
                              btnStyle =
                                'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                            } else if (isPicked && !opt.correct) {
                              btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                            }
                          }

                          return (
                            <button
                              key={opt.id}
                              onClick={() => !quizSubmitted && handleQuizAnswer(q.id, opt.id)}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-2 rounded-lg border text-[11px] leading-snug flex items-start gap-2 transition-all ${btnStyle}`}
                            >
                              <span className="font-mono font-bold shrink-0">{opt.id}.</span>
                              <span>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Rationale feedback */}
                      {quizSubmitted && (
                        <div className="mt-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                          <span className="font-bold text-emerald-400">Rationale: </span>
                          {q.rationale}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz Footer Action */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(userAnswers).length < KCSE_QUESTIONS.length}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md"
                  >
                    Submit Answers
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setUserAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-slate-700"
                  >
                    Retake Quiz
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
