import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Eye,
  Glasses,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  RotateCcw,
  Play,
  Pause,
  Award,
  BookOpen,
  ArrowRight,
  Zap,
  Layers,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Target,
  Crosshair,
  ShieldCheck
} from 'lucide-react';

// Anatomical Hotspots on Sagittal Cross-Section of the Human Eye
const ANATOMY_PINS = [
  {
    id: 'cornea',
    name: 'Cornea',
    x: 275,
    y: 240,
    role: 'Major Refractive Dome (~70% of total eye optical power)',
    description:
      'Transparent anterior portion of the fibrous coat. Avascular, bathed by aqueous humour and tear film. Possesses a fixed curvature that strongly refracts incident light rays inward towards the pupil aperture.',
    kcseTip:
      'Common KCSE question: Cornea accounts for most of light refraction, while the crystalline lens is responsible for variable fine focusing (accommodation).'
  },
  {
    id: 'aqueous_humour',
    name: 'Aqueous Humour',
    x: 305,
    y: 220,
    role: 'Anterior Chamber Clear Fluid',
    description:
      'Watery solution rich in glucose and amino acids that nourishes the avascular cornea and crystalline lens while maintaining anterior intraocular pressure.',
    kcseTip:
      'Maintains spherical curvature of the anterior eyeball segment and permits unhindered light transmission.'
  },
  {
    id: 'pupil_iris',
    name: 'Iris & Pupil',
    x: 328,
    y: 195,
    role: 'Aperture Diaphragm',
    description:
      'Pigmented disc containing circular sphincter muscles (parasympathetic constriction) and radial dilator muscles (sympathetic dilation) that govern the size of the pupil to regulate light flux.',
    kcseTip:
      'Pupil constricts in bright light (pupillary light reflex) to prevent retinal bleaching and improve depth of focus.'
  },
  {
    id: 'crystalline_lens',
    name: 'Crystalline Lens',
    x: 355,
    y: 240,
    role: 'Flexible Biconvex Refractive Element',
    description:
      'Transparent, highly elastic protein structure composed of crystallin proteins. Undergoes real-time curvature changes (accommodation) to focus diverging or parallel rays precisely onto the fovea centralis.',
    kcseTip:
      'Loss of elasticity with aging leads to Presbyopia. Clouding of the lens protein is Cataract.'
  },
  {
    id: 'ciliary_body',
    name: 'Ciliary Body & Muscle',
    x: 355,
    y: 145,
    role: 'Accommodation Motor',
    description:
      'Ring of smooth muscle fibers. When it CONTRACTS, the sphincter ring constricts inward, SLACKENING the suspensory ligaments. When it RELAXES, the ring diameter expands, pulling ligaments TAUT.',
    kcseTip:
      'CRITICAL EXAM TRAP: Ciliary muscles CONTRACT for NEAR vision (making ligaments slacken), NOT relax!'
  },
  {
    id: 'suspensory_ligaments',
    name: 'Suspensory Ligaments (Zonules of Zinn)',
    x: 355,
    y: 172,
    role: 'Radial Tension Fibers',
    description:
      'Inelastic collagenous fibers bridging the ciliary processes to the lens capsule. When taut, they pull the elastic lens flat and thin. When slackened, the lens naturally bulges due to inherent elasticity.',
    kcseTip:
      'Remember: Ligaments are passive tension cables; they cannot contract on their own!'
  },
  {
    id: 'vitreous_humour',
    name: 'Vitreous Humour',
    x: 480,
    y: 240,
    role: 'Posterior Gelatinous Body',
    description:
      'Viscous, transparent hydrogel (99% water + collagen + hyaluronic acid) maintaining the spherical shape of the posterior eyeball and pressing the sensory retina firmly against the choroid.',
    kcseTip:
      'Non-regenerating gel; loss of vitreous can cause retinal detachment.'
  },
  {
    id: 'retina',
    name: 'Retina',
    x: 690,
    y: 180,
    role: 'Photoreceptive Neural Coat',
    description:
      'Innermost layer containing rods (rhodopsin; high sensitivity in scotopic/dim light, peripheral vision) and cones (iodopsin; photopic bright light, color vision, high spatial resolution).',
    kcseTip:
      'Inverted real image is formed on photoreceptors and transduced into electrical action potentials.'
  },
  {
    id: 'fovea_centralis',
    name: 'Fovea Centralis (Yellow Spot)',
    x: 715,
    y: 240,
    role: 'Peak Visual Acuity Zone',
    description:
      'Small retinal pit directly on the visual axis packed exclusively with densely packed cone cells wired in 1:1 ratio to bipolar and ganglion cells, providing maximum visual sharpness.',
    kcseTip:
      'When you directly fixate on text while reading, the optical image falls squarely on the fovea centralis.'
  },
  {
    id: 'blind_spot',
    name: 'Blind Spot (Optic Disc)',
    x: 695,
    y: 295,
    role: 'Anerceptive Exit Point',
    description:
      'The anatomical convergence site where unmyelinated axons of retinal ganglion cells coalesce to form the optic nerve. Completely devoid of rods and cones; insensitive to incident rays.',
    kcseTip:
      'Any ray converging onto the optic disc creates no sensory impulse because no photoreceptor cells exist here.'
  },
  {
    id: 'optic_nerve',
    name: 'Optic Nerve (Cranial II)',
    x: 765,
    y: 320,
    role: 'Afferent Neural Highway',
    description:
      'Thick myelinated sensory tract carrying visual nerve impulses from retinal ganglion cells through the optic chiasma and optic radiation to the visual cortex of the occipital lobe.',
    kcseTip:
      'The brain re-inverts the upside-down image so we perceive objects in their correct upright orientation.'
  },
  {
    id: 'sclera_choroid',
    name: 'Sclera & Choroid',
    x: 580,
    y: 105,
    role: 'Protective & Vascular Layers',
    description:
      'Sclera: Tough fibrous white protective outer layer providing structural rigidity. Choroid: Middle vascular coat heavily pigmented with melanin to absorb stray light and prevent internal light reflection (glare).',
    kcseTip:
      'Melanin in the choroid serves the same optical purpose as black paint inside an optical camera body.'
  }
];

// High-Yield KCSE Form 4 Practice Questions
const KCSE_QUIZ = [
  {
    id: 1,
    question:
      'When a student looks up from reading a textbook at 25 cm to inspect a bird perched on a tall tree 20 metres away, which set of physiological changes occurs in the eye?',
    options: [
      'Ciliary muscles contract, suspensory ligaments tighten, crystalline lens thickens',
      'Ciliary muscles relax, suspensory ligaments tighten, crystalline lens becomes thinner',
      'Ciliary muscles contract, suspensory ligaments slacken, crystalline lens flattens',
      'Ciliary muscles relax, suspensory ligaments slacken, crystalline lens bulges'
    ],
    correct: 1,
    rationale:
      'For distant vision (>6 m), ciliary muscles relax, allowing the ciliary ring diameter to widen. This pulls the suspensory ligaments taut, stretching the crystalline lens into a thinner, flatter shape with longer focal length.'
  },
  {
    id: 2,
    question:
      'A person suffering from Myopia (short-sightedness) struggles to view distant objects clearly. What is the anatomical defect and the correct optical remedy?',
    options: [
      'Eyeball is too short; corrected using a convex (converging) spectacle lens',
      'Eyeball is too long or lens too convex; corrected using a concave (diverging) spectacle lens',
      'Loss of crystalline lens elasticity; corrected using cylindrical lenses',
      'Cornea has uneven curvature; corrected using bifocal lenses'
    ],
    correct: 1,
    rationale:
      'In Myopia, light rays from a distant object converge in front of the retina because the eyeball is abnormally elongated or the lens has excessive converging power. A concave (diverging) lens spreads the rays slightly before they enter the eye, pushing the focal plane back onto the retina.'
  },
  {
    id: 3,
    question:
      'Why is the Suspensory Ligament described as being SLACKENED when viewing a near object at 25 cm, even though the ciliary muscles are actively contracting?',
    options: [
      'Because the ciliary muscle is an annular sphincter: contracting constricts the ring inward toward the lens equator, releasing outward radial pull',
      'Because the ligaments dissolve temporarily during near accommodation',
      'Because high blood pressure pushes the lens forward away from the ligaments',
      'Because the pupil closes completely, blocking mechanical tension'
    ],
    correct: 0,
    rationale:
      'The ciliary muscle forms an annular sphincter ring encircling the lens. When this sphincter contracts, its internal diameter decreases, moving closer to the lens. This releases tension on the suspensory zonules, allowing the naturally elastic lens to recoil and bulge into a thicker shape.'
  },
  {
    id: 4,
    question:
      'An elderly person finds it difficult to read small print without holding the page at arm length, but can see distant objects normally. What is this condition and its physiological cause?',
    options: [
      'Myopia caused by elongation of the anterior chamber',
      'Presbyopia caused by loss of crystalline lens elasticity and sclerosis',
      'Astigmatism caused by an irregular corneal meridian',
      'Cataract caused by opacification of the vitreous humor'
    ],
    correct: 1,
    rationale:
      'Presbyopia is an age-related condition where the crystalline lens gradually loses its natural elasticity. Even though the ciliary muscles contract and ligaments slacken, the rigid lens fails to bulge, making near accommodation insufficient. It is corrected with convex reading glasses (+D).'
  }
];

export default function HumanEyeAccommodationSim({ config = {}, onTelemetry }) {
  // Active Tab: 'simulation' | 'ray_tracing' | 'anatomy' | 'quiz'
  const [activeTab, setActiveTab] = useState('simulation');

  // Control 1: Object Distance in metres (0.25m to 10.0m)
  const [objectDistance, setObjectDistance] = useState(6.0);

  // Control 2: Eye Condition: 'normal' (Emmetropia) | 'myopia' | 'hypermetropia' | 'presbyopia'
  const [eyeCondition, setEyeCondition] = useState('normal');

  // Control 3: Corrective Spectacle Lens: 'none' | 'concave' | 'convex'
  const [correctiveLens, setCorrectiveLens] = useState('none');

  // Auto-accommodation demo animation state
  const [isAutoAnimating, setIsAutoAnimating] = useState(false);

  // Selected anatomical hotspot
  const [activePinId, setActivePinId] = useState(null);

  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Optical rail visual container ref
  const svgContainerRef = useRef(null);

  // Auto-accommodation animation loop
  useEffect(() => {
    let animFrame;
    let direction = -1; // -1 = moving near, +1 = moving far
    if (isAutoAnimating) {
      const loop = () => {
        setObjectDistance((prev) => {
          let next = prev + direction * 0.05;
          if (next <= 0.3) {
            next = 0.25;
            direction = 1;
          } else if (next >= 8.5) {
            next = 9.0;
            direction = -1;
          }
          return parseFloat(next.toFixed(2));
        });
        animFrame = requestAnimationFrame(loop);
      };
      animFrame = requestAnimationFrame(loop);
    }
    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [isAutoAnimating]);

  // When eye condition changes, reset spectacle lens to allow user experimentation
  const handleConditionChange = (condition) => {
    setEyeCondition(condition);
    setCorrectiveLens('none');
    if (onTelemetry) {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'human_eye_accommodation_defects_3d',
        action: 'condition_changed',
        condition
      });
    }
  };

  // Reset function to restore normal eye at distant vision
  const handleReset = useCallback(() => {
    setObjectDistance(6.0);
    setEyeCondition('normal');
    setCorrectiveLens('none');
    setIsAutoAnimating(false);
    setActivePinId(null);
    if (onTelemetry) {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'human_eye_accommodation_defects_3d',
        action: 'reset_to_default'
      });
    }
  }, [onTelemetry]);

  // Biomechanical & Optical calculations
  // Near vision (0.25m) -> factor 1 (maximal accommodation)
  // Distant vision (6m+) -> factor 0 (fully relaxed accommodation)
  const accommodationFactor = useMemo(() => {
    const clamped = Math.max(0.25, Math.min(6.0, objectDistance));
    // Logarithmic-like scaling for human near-point response
    const factor = (6.0 - clamped) / (6.0 - 0.25);
    return Math.max(0, Math.min(1, factor));
  }, [objectDistance]);

  // Biomechanical Status
  const ciliaryMuscleContractedPct = useMemo(() => {
    return Math.round(accommodationFactor * 100);
  }, [accommodationFactor]);

  const suspensoryLigamentTensionPct = useMemo(() => {
    return Math.round((1 - accommodationFactor) * 100);
  }, [accommodationFactor]);

  // Lens physical deformation
  // Flat/thin: ~7px half-thickness (14px total)
  // Bulging/thick: ~21px half-thickness (42px total)
  const lensHalfThickness = useMemo(() => {
    if (eyeCondition === 'presbyopia') {
      // Sclerotic lens cannot bulge significantly
      return 7 + accommodationFactor * 3.5;
    }
    return 7 + accommodationFactor * 14;
  }, [accommodationFactor, eyeCondition]);

  // Eyeball dimensions based on condition
  // Normal: center = 520, Rx = 195 -> Retina at X = 715
  // Myopia: Eyeball elongated +35px -> Retina at X = 750
  // Hypermetropia: Eyeball shortened -35px -> Retina at X = 680
  const eyeballConfig = useMemo(() => {
    let retinaX = 715;
    let elongationLabel = 'Normal Anteroposterior Axis (24 mm)';
    let rx = 195;

    if (eyeCondition === 'myopia') {
      retinaX = 750;
      rx = 230;
      elongationLabel = 'Elongated Eyeball (>24 mm) / Excessive Refraction';
    } else if (eyeCondition === 'hypermetropia') {
      retinaX = 680;
      rx = 160;
      elongationLabel = 'Shortened Eyeball (<24 mm) / Insufficient Refraction';
    } else if (eyeCondition === 'presbyopia') {
      retinaX = 715;
      rx = 195;
      elongationLabel = 'Normal Axial Length, Loss of Lens Elasticity';
    }

    return { retinaX, rx, elongationLabel };
  }, [eyeCondition]);

  // Focal point calculation in SVG coordinates
  // Normal eye accommodates perfectly: focal point lands at X = 715 across all distances!
  // Myopia with distant object: focal point converges at X ≈ 705 (in front of retina at 750).
  // Hypermetropia with near object: focal point converges at X ≈ 745 (behind retina at 680).
  // Presbyopia with near object: focal point converges at X ≈ 745 (behind retina at 715).
  const opticalFocus = useMemo(() => {
    let focusX = 715;

    if (eyeCondition === 'normal') {
      // Perfectly focused on normal retina
      focusX = 715;
      // If user applies unnecessary glasses to normal eye:
      if (correctiveLens === 'concave') {
        focusX = 745; // pushed behind retina
      } else if (correctiveLens === 'convex') {
        focusX = 685; // pulled in front of retina
      }
    } else if (eyeCondition === 'myopia') {
      // Focuses in front of retina (750) for distant objects
      const naturalFocus = 705 - (1 - accommodationFactor) * 10;
      if (correctiveLens === 'concave') {
        focusX = 750; // Corrected! Precisely onto myopic retina
      } else if (correctiveLens === 'convex') {
        focusX = naturalFocus - 35; // Far worse
      } else {
        focusX = naturalFocus; // Uncorrected: in front
      }
    } else if (eyeCondition === 'hypermetropia') {
      // Focuses behind retina (680) especially for near objects
      const naturalFocus = 725 + accommodationFactor * 25;
      if (correctiveLens === 'convex') {
        focusX = 680; // Corrected! Precisely onto hypermetropic retina
      } else if (correctiveLens === 'concave') {
        focusX = naturalFocus + 35; // Far worse
      } else {
        focusX = naturalFocus; // Uncorrected: behind
      }
    } else if (eyeCondition === 'presbyopia') {
      // Distant is okay, near is blurred because lens won't bulge
      const naturalFocus = 715 + accommodationFactor * 35;
      if (correctiveLens === 'convex') {
        focusX = 715; // Reading glasses correct near focus!
      } else if (correctiveLens === 'concave') {
        focusX = naturalFocus + 25;
      } else {
        focusX = naturalFocus;
      }
    }

    const delta = Math.abs(focusX - eyeballConfig.retinaX);
    const isSharp = delta <= 5;
    // Calculate CSS blur amount for digital retina view
    const blurPx = isSharp ? 0 : Math.min(14, delta * 0.28);

    return { focusX, delta, isSharp, blurPx };
  }, [eyeCondition, correctiveLens, accommodationFactor, eyeballConfig]);

  // Object position along optical bench (SVG X coordinate)
  // Distance: 0.25m -> X = 195, 2m -> X = 115, 6m -> X = 55, 10m -> X = 40
  const objectSvgX = useMemo(() => {
    const minD = 0.25;
    const maxD = 10.0;
    const logNorm =
      (Math.log10(objectDistance) - Math.log10(minD)) /
      (Math.log10(maxD) - Math.log10(minD));
    return Math.round(195 - logNorm * 145);
  }, [objectDistance]);

  // Checkpoint verification telemetry for successful defect corrections
  useEffect(() => {
    if (opticalFocus.isSharp && correctiveLens !== 'none' && onTelemetry) {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'human_eye_accommodation_defects_3d',
        checkpoint: 'defect_corrected_successfully',
        eyeCondition,
        correctiveLens,
        objectDistance
      });
    }
  }, [opticalFocus.isSharp, correctiveLens, eyeCondition, objectDistance, onTelemetry]);

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl space-y-6 font-sans">
      {/* Simulation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                  Human Eye: Accommodation & Optical Focusing
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Form 4 Biology
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Topic 3: Reception, Response & Coordination • KCSE Visual Ray Tracing & Biomechanics
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAutoAnimating(!isAutoAnimating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isAutoAnimating
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isAutoAnimating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isAutoAnimating ? 'Pause Auto-Cycle' : 'Auto Accommodation Demo'}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* High-Yield Misconception Alert Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-500/30 flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="text-xs leading-relaxed">
          <span className="font-bold text-amber-300 mr-1.5">
            CRITICAL KCSE EXAM CONCEPT:
          </span>
          <span className="text-slate-200 font-medium">
            For <strong className="text-emerald-300">NEAR vision (25 cm)</strong>, ciliary muscles{' '}
            <strong className="text-emerald-300 underline decoration-emerald-500/50">CONTRACT</strong>{' '}
            (moving inward like a sphincter), which{' '}
            <strong className="text-amber-300 underline decoration-amber-500/50">SLACKENS</strong> the
            suspensory ligaments, freeing the elastic lens to naturally{' '}
            <strong className="text-cyan-300">BULGE and THICKEN</strong>. They do NOT relax!
          </span>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-1 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('simulation')}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all ${
            activeTab === 'simulation'
              ? 'bg-cyan-500/15 text-cyan-300 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Zap className="w-4 h-4" />
          Accommodation & Ray Optics
        </button>

        <button
          onClick={() => setActiveTab('anatomy')}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all ${
            activeTab === 'anatomy'
              ? 'bg-cyan-500/15 text-cyan-300 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          Interactive Sagittal Anatomy ({ANATOMY_PINS.length} Hotspots)
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all ${
            activeTab === 'quiz'
              ? 'bg-cyan-500/15 text-cyan-300 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Award className="w-4 h-4" />
          KCSE Practice Quiz ({KCSE_QUIZ.length} Questions)
        </button>
      </div>

      {/* TAB 1: ACCOMMODATION & RAY TRACING SIMULATION */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          {/* Main Visual SVG Optical Bench & Sagittal Eyeball */}
          <div className="relative bg-slate-900/90 rounded-2xl border border-slate-800 p-2 sm:p-4 shadow-inner overflow-hidden">
            {/* Top HUD overlay */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2 px-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Object State:</span>
                <span className="font-bold text-cyan-300">
                  {objectDistance <= 0.35
                    ? 'Near Point (25 cm) - Diverging Light'
                    : objectDistance >= 6.0
                    ? 'Distant (> 6 m) - Parallel Light'
                    : `Intermediate (${objectDistance.toFixed(1)} m)`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Focal Result:</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-full border text-[11px] ${
                    opticalFocus.isSharp
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {opticalFocus.isSharp
                    ? '✓ Sharp Focus on Fovea Centralis'
                    : opticalFocus.focusX < eyeballConfig.retinaX
                    ? '⚠️ Focused In Front of Retina (Myopic Blur)'
                    : '⚠️ Focused Behind Retina (Hypermetropic Blur)'}
                </span>
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div
              ref={svgContainerRef}
              className="w-full h-auto aspect-[940/460] min-h-[320px] max-h-[480px] select-none"
            >
              <svg
                viewBox="0 0 940 460"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 0 20px rgba(14, 165, 233, 0.05))' }}
              >
                <defs>
                  {/* Subtle Grid Pattern */}
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(51, 65, 85, 0.25)"
                      strokeWidth="1"
                    />
                  </pattern>

                  {/* Optical Ray Glow */}
                  <filter id="rayGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Eyeball Vitreous Gradient */}
                  <radialGradient id="vitreousGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="70%" stopColor="#090d16" />
                    <stop offset="100%" stopColor="#020617" />
                  </radialGradient>

                  {/* Crystalline Lens Glass Gradient */}
                  <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(56, 189, 248, 0.45)" />
                    <stop offset="50%" stopColor="rgba(224, 242, 254, 0.75)" />
                    <stop offset="100%" stopColor="rgba(56, 189, 248, 0.45)" />
                  </linearGradient>

                  {/* Cornea Gradient */}
                  <linearGradient id="corneaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(56, 189, 248, 0.6)" />
                    <stop offset="100%" stopColor="rgba(186, 230, 253, 0.2)" />
                  </linearGradient>

                  {/* Retinal Yellow Glow */}
                  <linearGradient id="retinaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>

                  {/* Motion Vector Arrow Markers */}
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="#fb7185" />
                  </marker>
                  <marker
                    id="arrow-relaxed"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="#94a3b8" />
                  </marker>
                </defs>

                {/* Grid Background */}
                <rect width="940" height="460" fill="url(#grid)" />

                {/* Principal Optical Axis (Dashed Centerline) */}
                <line
                  x1="20"
                  y1="240"
                  x2="880"
                  y2="240"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0.65"
                />
                <text x="30" y="232" fill="#64748b" fontSize="10" fontWeight="600">
                  OPTICAL PRINCIPAL AXIS
                </text>

                {/* Optical Rail Baseline at Left */}
                <line x1="30" y1="360" x2="230" y2="360" stroke="#334155" strokeWidth="3" />
                <circle cx="55" cy="360" r="4" fill="#38bdf8" />
                <text x="45" y="378" fill="#94a3b8" fontSize="10">
                  Distant (6m+)
                </text>
                <circle cx="115" cy="360" r="4" fill="#38bdf8" />
                <text x="110" y="378" fill="#94a3b8" fontSize="10">
                  2m
                </text>
                <circle cx="195" cy="360" r="4" fill="#38bdf8" />
                <text x="180" y="378" fill="#94a3b8" fontSize="10">
                  Near (25cm)
                </text>

                {/* ============================================================== */}
                {/* 1. OBJECT DISPLAY (Upright glowing test arrow & label) */}
                {/* ============================================================== */}
                <g id="optical-object" className="cursor-pointer transition-all duration-150">
                  {/* Glowing Arrow Base to Tip */}
                  <line
                    x1={objectSvgX}
                    y1="240"
                    x2={objectSvgX}
                    y2="180"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    filter="url(#rayGlow)"
                  />
                  {/* Arrowhead */}
                  <polygon
                    points={`${objectSvgX - 6},192 ${objectSvgX + 6},192 ${objectSvgX},174`}
                    fill="#10b981"
                    filter="url(#rayGlow)"
                  />
                  {/* Marker at bottom */}
                  <circle cx={objectSvgX} cy="240" r="5" fill="#10b981" />
                  {/* Distance Label Above Object */}
                  <rect
                    x={objectSvgX - 42}
                    y="145"
                    width="84"
                    height="24"
                    rx="6"
                    fill="#0f172a"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    opacity="0.95"
                  />
                  <text
                    x={objectSvgX}
                    y="161"
                    fill="#34d399"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {objectDistance < 1
                      ? `${(objectDistance * 100).toFixed(0)} cm`
                      : `${objectDistance.toFixed(1)} m`}
                  </text>
                </g>

                {/* ============================================================== */}
                {/* 2. CORRECTIVE SPECTACLE LENS (At X = 245 in front of cornea)   */}
                {/* ============================================================== */}
                {correctiveLens !== 'none' && (
                  <g id="spectacle-lens">
                    {correctiveLens === 'concave' ? (
                      // Biconcave Diverging Lens
                      <g>
                        <path
                          d="M 238,170 Q 248,240 238,310 L 252,310 Q 242,240 252,170 Z"
                          fill="rgba(244, 63, 94, 0.25)"
                          stroke="#f43f5e"
                          strokeWidth="2"
                        />
                        <text
                          x="245"
                          y="158"
                          fill="#f43f5e"
                          fontSize="10"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          Concave (-D)
                        </text>
                      </g>
                    ) : (
                      // Biconvex Converging Lens
                      <g>
                        <path
                          d="M 245,170 Q 236,240 245,310 Q 254,240 245,170 Z"
                          fill="rgba(16, 185, 129, 0.25)"
                          stroke="#10b981"
                          strokeWidth="2"
                        />
                        <text
                          x="245"
                          y="158"
                          fill="#10b981"
                          fontSize="10"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          Convex (+D)
                        </text>
                      </g>
                    )}
                    {/* Spectacle frame rim */}
                    <line x1="245" y1="162" x2="245" y2="170" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="245" y1="310" x2="245" y2="318" stroke="#94a3b8" strokeWidth="2" />
                  </g>
                )}

                {/* ============================================================== */}
                {/* 3. SAGITTAL EYEBALL ANATOMY (Sclera, Choroid, Retina, Humours)  */}
                {/* ============================================================== */}
                {/* Center of Eyeball: (520, 240) */}
                <g id="eyeball-shell">
                  {/* Eyeball Vitreous Interior Fill */}
                  <ellipse
                    cx="520"
                    cy="240"
                    rx={eyeballConfig.rx}
                    ry="155"
                    fill="url(#vitreousGrad)"
                  />

                  {/* Sclera: Tough outer fibrous white protective coat */}
                  <ellipse
                    cx="520"
                    cy="240"
                    rx={eyeballConfig.rx}
                    ry="155"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="7"
                    strokeDasharray="1400"
                    strokeDashoffset="180"
                  />

                  {/* Choroid: Dark melanin-pigmented vascular layer */}
                  <ellipse
                    cx="520"
                    cy="240"
                    rx={eyeballConfig.rx - 5}
                    ry="150"
                    fill="none"
                    stroke="#581c87"
                    strokeWidth="4"
                    opacity="0.9"
                  />

                  {/* Sensory Retina (Posterior Sensory Arc) */}
                  <path
                    d={`M ${520 - eyeballConfig.rx * 0.4},115 A ${eyeballConfig.rx - 10} 144 0 0 1 ${
                      eyeballConfig.retinaX
                    },240 A ${eyeballConfig.rx - 10} 144 0 0 1 ${520 - eyeballConfig.rx * 0.4},365`}
                    fill="none"
                    stroke="url(#retinaGrad)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    filter="url(#rayGlow)"
                  />

                  {/* Fovea Centralis (Yellow Spot) Target Reticle */}
                  <circle
                    cx={eyeballConfig.retinaX}
                    cy="240"
                    r="6"
                    fill="#fbbf24"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    filter="url(#rayGlow)"
                  />
                  <text
                    x={eyeballConfig.retinaX + 12}
                    y="244"
                    fill="#fbbf24"
                    fontSize="11"
                    fontWeight="700"
                  >
                    Fovea (Yellow Spot)
                  </text>

                  {/* Blind Spot (Optic Disc) Gap & Optic Nerve */}
                  {/* Nerve exits slightly inferior to fovea */}
                  <g id="blind-spot-optic-nerve">
                    {/* Optic Disc Gap Marker */}
                    <circle cx={eyeballConfig.retinaX - 16} cy="295" r="5" fill="#334155" stroke="#ef4444" strokeWidth="1.5" />
                    {/* Optic Nerve Bundle Extrusion */}
                    <path
                      d={`M ${eyeballConfig.retinaX - 20},290 Q ${eyeballConfig.retinaX + 40},300 ${
                        eyeballConfig.retinaX + 85
                      },320 L ${eyeballConfig.retinaX + 80},340 Q ${eyeballConfig.retinaX + 35},315 ${
                        eyeballConfig.retinaX - 25
                      },300 Z`}
                      fill="#e2e8f0"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      opacity="0.85"
                    />
                    <text
                      x={eyeballConfig.retinaX + 40}
                      y="355"
                      fill="#cbd5e1"
                      fontSize="10"
                      fontWeight="600"
                    >
                      Optic Nerve
                    </text>
                  </g>

                  {/* Cornea: Transparent Anterior Bulge */}
                  <path
                    d="M 335,160 C 275,185 275,295 335,320"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="6"
                    strokeLinecap="round"
                    filter="url(#rayGlow)"
                  />
                  <text x="260" y="160" fill="#38bdf8" fontSize="10" fontWeight="600">
                    Cornea (~70% Power)
                  </text>
                </g>

                {/* ============================================================== */}
                {/* 4. CILIARY BODY, IRIS, & SUSPENSORY LIGAMENTS (Deformation)    */}
                {/* ============================================================== */}
                <g id="ciliary-lens-system">
                  {/* Ciliary Muscle Body - Top & Bottom */}
                  {/* When contracted (near), ciliary body constricts INWARD towards lens center */}
                  {/* Top moves from y=135 down to y=155; Bottom moves from y=345 up to y=325 */}
                  {(() => {
                    const topCiliaryY = 135 + accommodationFactor * 16;
                    const bottomCiliaryY = 345 - accommodationFactor * 16;
                    const lensTopY = 180;
                    const lensBottomY = 300;

                    return (
                      <>
                        {/* Top Ciliary Muscle Block */}
                        <path
                          d={`M 335,120 L 375,120 L 375,${topCiliaryY} L 340,${topCiliaryY + 8} Z`}
                          fill={accommodationFactor > 0.5 ? '#f43f5e' : '#64748b'}
                          stroke="#e2e8f0"
                          strokeWidth="1.5"
                          className="transition-all duration-300"
                        />
                        {/* Ciliary Muscle Contraction Label & Arrow */}
                        <g>
                          <text
                            x="355"
                            y="110"
                            fill={accommodationFactor > 0.5 ? '#f87171' : '#94a3b8'}
                            fontSize="10"
                            fontWeight="700"
                            textAnchor="middle"
                          >
                            {accommodationFactor > 0.5
                              ? 'Ciliary Muscle CONTRACTED'
                              : 'Ciliary Muscle RELAXED'}
                          </text>
                          {/* Motion vector arrow */}
                          <line
                            x1="355"
                            y1={accommodationFactor > 0.5 ? 122 : 138}
                            x2="355"
                            y2={accommodationFactor > 0.5 ? 134 : 124}
                            stroke={accommodationFactor > 0.5 ? '#fb7185' : '#94a3b8'}
                            strokeWidth="2.5"
                            markerEnd={accommodationFactor > 0.5 ? 'url(#arrow)' : 'url(#arrow-relaxed)'}
                          />
                        </g>

                        {/* Bottom Ciliary Muscle Block */}
                        <path
                          d={`M 335,360 L 375,360 L 375,${bottomCiliaryY} L 340,${bottomCiliaryY - 8} Z`}
                          fill={accommodationFactor > 0.5 ? '#f43f5e' : '#64748b'}
                          stroke="#e2e8f0"
                          strokeWidth="1.5"
                          className="transition-all duration-300"
                        />

                        {/* Iris Diaphragms (Aperture defining the pupil) */}
                        {/* Upper Iris Leaf */}
                        <path
                          d="M 335,155 L 348,205 L 343,205 L 335,160 Z"
                          fill="#0284c7"
                          stroke="#38bdf8"
                          strokeWidth="1"
                        />
                        {/* Lower Iris Leaf */}
                        <path
                          d="M 335,325 L 348,275 L 343,275 L 335,320 Z"
                          fill="#0284c7"
                          stroke="#38bdf8"
                          strokeWidth="1"
                        />
                        <text x="312" y="244" fill="#38bdf8" fontSize="10" fontWeight="600" textAnchor="end">
                          Pupil
                        </text>

                        {/* Suspensory Ligaments (Zonules of Zinn) */}
                        {/* If distant (relaxed ciliary): TAUT and straight lines */}
                        {/* If near (contracted ciliary): SLACK and wavy lines */}
                        {accommodationFactor < 0.5 ? (
                          // TAUT LIGAMENTS (Distant Vision)
                          <g stroke="#38bdf8" strokeWidth="2" opacity="0.9">
                            {/* Top taut zonules */}
                            <line x1="352" y1={topCiliaryY} x2="352" y2={lensTopY} />
                            <line x1="358" y1={topCiliaryY} x2="358" y2={lensTopY} />
                            <line x1="364" y1={topCiliaryY} x2="364" y2={lensTopY} />
                            {/* Bottom taut zonules */}
                            <line x1="352" y1={lensBottomY} x2="352" y2={bottomCiliaryY} />
                            <line x1="358" y1={lensBottomY} x2="358" y2={bottomCiliaryY} />
                            <line x1="364" y1={lensBottomY} x2="364" y2={bottomCiliaryY} />
                            <text
                              x="395"
                              y={topCiliaryY + 22}
                              fill="#38bdf8"
                              fontSize="10"
                              fontWeight="700"
                            >
                              TAUT Zonules (Tight Pull)
                            </text>
                          </g>
                        ) : (
                          // SLACKENED / WAVY LIGAMENTS (Near Vision)
                          <g
                            stroke="#f59e0b"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray="4 2"
                            opacity="0.95"
                          >
                            {/* Top wavy zonules */}
                            <path
                              d={`M 352,${topCiliaryY} Q 346,${(topCiliaryY + lensTopY) / 2} 352,${lensTopY}`}
                            />
                            <path
                              d={`M 358,${topCiliaryY} Q 364,${(topCiliaryY + lensTopY) / 2} 358,${lensTopY}`}
                            />
                            <path
                              d={`M 364,${topCiliaryY} Q 370,${(topCiliaryY + lensTopY) / 2} 364,${lensTopY}`}
                            />
                            {/* Bottom wavy zonules */}
                            <path
                              d={`M 352,${lensBottomY} Q 346,${(bottomCiliaryY + lensBottomY) / 2} 352,${bottomCiliaryY}`}
                            />
                            <path
                              d={`M 358,${lensBottomY} Q 364,${(bottomCiliaryY + lensBottomY) / 2} 358,${bottomCiliaryY}`}
                            />
                            <path
                              d={`M 364,${lensBottomY} Q 370,${(bottomCiliaryY + lensBottomY) / 2} 364,${bottomCiliaryY}`}
                            />
                            <text
                              x="395"
                              y={topCiliaryY + 18}
                              fill="#f59e0b"
                              fontSize="10"
                              fontWeight="700"
                            >
                              SLACK Zonules (Tension Released)
                            </text>
                          </g>
                        )}

                        {/* Crystalline Lens (Dynamic Curvature & Thickness) */}
                        <g id="crystalline-lens">
                          {/* Elastic biconvex shape */}
                          <path
                            d={`M 355,${lensTopY} Q ${355 - lensHalfThickness},240 355,${lensBottomY} Q ${
                              355 + lensHalfThickness
                            },240 355,${lensTopY} Z`}
                            fill="url(#lensGrad)"
                            stroke="#bae6fd"
                            strokeWidth="2.5"
                            className="transition-all duration-300"
                            filter="url(#rayGlow)"
                          />
                          {/* Lens equator axis */}
                          <line
                            x1="355"
                            y1={lensTopY}
                            x2="355"
                            y2={lensBottomY}
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                          />
                          {/* Lens Shape Label */}
                          <text
                            x="355"
                            y="385"
                            fill="#bae6fd"
                            fontSize="11"
                            fontWeight="700"
                            textAnchor="middle"
                          >
                            {eyeCondition === 'presbyopia'
                              ? 'Rigid Lens (Cannot Bulge)'
                              : accommodationFactor > 0.5
                              ? 'Bulging Thick Lens (High Converging Power)'
                              : 'Thin Stretched Lens (Low Converging Power)'}
                          </text>
                        </g>
                      </>
                    );
                  })()}
                </g>

                {/* ============================================================== */}
                {/* 5. DYNAMIC RAY TRACING (Object -> Spectacle -> Cornea -> Retina)*/}
                {/* ============================================================== */}
                <g id="optical-rays" filter="url(#rayGlow)">
                  {(() => {
                    const objTip = { x: objectSvgX, y: 180 };
                    const specX = 245;
                    const corneaX = 300;
                    const lensX = 355;
                    const focusX = opticalFocus.focusX;

                    // Compute ray entry points through pupil
                    const ray1_pupilY = 212; // Top pupil ray
                    const ray2_pupilY = 240; // Chief central ray
                    const ray3_pupilY = 268; // Bottom pupil ray

                    // Refraction through spectacle lens if present
                    let specRay1_Y = ray1_pupilY;
                    let specRay3_Y = ray3_pupilY;

                    if (correctiveLens === 'concave') {
                      // Diverges prior to eye
                      specRay1_Y -= 6;
                      specRay3_Y += 6;
                    } else if (correctiveLens === 'convex') {
                      // Converges prior to eye
                      specRay1_Y += 6;
                      specRay3_Y -= 6;
                    }

                    // Height of inverted image formed at retinal position
                    const focusDistance = focusX - lensX;
                    const retinaDistance = eyeballConfig.retinaX - lensX;
                    const magnification = -(retinaDistance / focusDistance);
                    const invertedTipY = 240 + 38 * magnification;

                    return (
                      <>
                        {/* Ray 1: From Object Tip to Upper Pupil */}
                        <path
                          d={`M ${objTip.x},${objTip.y} ${
                            correctiveLens !== 'none' ? `L ${specX},${specRay1_Y}` : ''
                          } L ${corneaX},${ray1_pupilY} L ${lensX},${ray1_pupilY} L ${focusX},${
                            focusX === eyeballConfig.retinaX ? invertedTipY : 240 + (focusX < eyeballConfig.retinaX ? -15 : 15)
                          } ${
                            focusX < eyeballConfig.retinaX
                              ? `L ${eyeballConfig.retinaX},${invertedTipY - 18}`
                              : ''
                          }`}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          strokeOpacity="0.85"
                        />

                        {/* Ray 2: Chief Ray through Optical Center of Lens */}
                        <path
                          d={`M ${objTip.x},${objTip.y} ${
                            correctiveLens !== 'none' ? `L ${specX},240` : ''
                          } L ${lensX},240 L ${focusX},${
                            focusX === eyeballConfig.retinaX ? invertedTipY : 240
                          } ${
                            focusX < eyeballConfig.retinaX
                              ? `L ${eyeballConfig.retinaX},${invertedTipY}`
                              : ''
                          }`}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeOpacity="0.85"
                        />

                        {/* Ray 3: From Object Tip to Lower Pupil */}
                        <path
                          d={`M ${objTip.x},${objTip.y} ${
                            correctiveLens !== 'none' ? `L ${specX},${specRay3_Y}` : ''
                          } L ${corneaX},${ray3_pupilY} L ${lensX},${ray3_pupilY} L ${focusX},${
                            focusX === eyeballConfig.retinaX ? invertedTipY : 240 + (focusX < eyeballConfig.retinaX ? 15 : -15)
                          } ${
                            focusX < eyeballConfig.retinaX
                              ? `L ${eyeballConfig.retinaX},${invertedTipY + 18}`
                              : ''
                          }`}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2"
                          strokeOpacity="0.85"
                        />

                        {/* Inverted Real Image on Retina */}
                        <g id="retinal-image">
                          {opticalFocus.isSharp ? (
                            // Sharp inverted arrow on retina
                            <g>
                              <line
                                x1={eyeballConfig.retinaX}
                                y1="240"
                                x2={eyeballConfig.retinaX}
                                y2={invertedTipY}
                                stroke="#ef4444"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                              />
                              <polygon
                                points={`${eyeballConfig.retinaX - 5},${invertedTipY - 8} ${
                                  eyeballConfig.retinaX + 5
                                },${invertedTipY - 8} ${eyeballConfig.retinaX},${invertedTipY}`}
                                fill="#ef4444"
                              />
                              <text
                                x={eyeballConfig.retinaX - 10}
                                y={invertedTipY + 16}
                                fill="#f87171"
                                fontSize="10"
                                fontWeight="700"
                                textAnchor="end"
                              >
                                Real Inverted Image (Sharp)
                              </text>
                            </g>
                          ) : (
                            // Blurred defocus circle on retina
                            <g>
                              <ellipse
                                cx={eyeballConfig.retinaX}
                                cy="240"
                                rx="4"
                                ry={Math.min(28, opticalFocus.delta * 0.7)}
                                fill="rgba(248, 113, 113, 0.45)"
                                stroke="#ef4444"
                                strokeWidth="2"
                                strokeDasharray="3 2"
                              />
                              <text
                                x={eyeballConfig.retinaX - 10}
                                y="244"
                                fill="#f87171"
                                fontSize="10"
                                fontWeight="700"
                                textAnchor="end"
                              >
                                Blur Circle (Defocused)
                              </text>
                            </g>
                          )}
                        </g>

                        {/* Focal Point Indicator marker */}
                        <g>
                          <circle cx={focusX} cy="240" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                          <line x1={focusX} y1="225" x2={focusX} y2="255" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                          <text
                            x={focusX}
                            y="220"
                            fill="#38bdf8"
                            fontSize="10"
                            fontWeight="700"
                            textAnchor="middle"
                          >
                            Focal Plane ({focusX === eyeballConfig.retinaX ? 'On Retina' : focusX < eyeballConfig.retinaX ? 'In Front' : 'Behind'})
                          </text>
                        </g>
                      </>
                    );
                  })()}
                </g>
              </svg>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SIMULATION CONTROLS & "WHAT THE STUDENT SEES" VIEWPORT         */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel (2 Columns) */}
            <div className="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-5">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Experimental Accommodation & Defect Controls
              </h2>

              {/* CONTROL 1: Object Distance Slider & Quick Presets */}
              <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <span>1. Object Distance:</span>
                    <span className="text-cyan-400 font-bold">
                      {objectDistance < 1
                        ? `${(objectDistance * 100).toFixed(0)} cm (Near Point)`
                        : `${objectDistance.toFixed(1)} metres`}
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-400">Range: 0.25 m to 10.0 m</span>
                </div>

                <input
                  type="range"
                  min="0.25"
                  max="10.0"
                  step="0.05"
                  value={objectDistance}
                  onChange={(e) => {
                    setIsAutoAnimating(false);
                    setObjectDistance(parseFloat(e.target.value));
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />

                {/* 1-Click Quick Distance Presets */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <button
                    onClick={() => {
                      setIsAutoAnimating(false);
                      setObjectDistance(0.25);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      objectDistance <= 0.3
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    🔍 Near Vision (25 cm)
                  </button>

                  <button
                    onClick={() => {
                      setIsAutoAnimating(false);
                      setObjectDistance(2.0);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      Math.abs(objectDistance - 2.0) < 0.2
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    Intermediate (2 m)
                  </button>

                  <button
                    onClick={() => {
                      setIsAutoAnimating(false);
                      setObjectDistance(6.0);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      objectDistance >= 5.8
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    🔭 Distant Vision (6 m / Infinity)
                  </button>
                </div>
              </div>

              {/* CONTROL 2: Eye Condition Selector */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <label className="text-xs font-semibold text-slate-300">
                  2. Eye Anatomical Condition (Refractive State):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'normal', label: 'Normal (Emmetropia)', desc: 'Standard 24mm axis' },
                    { id: 'myopia', label: 'Myopia (Short Sight)', desc: 'Elongated eyeball' },
                    { id: 'hypermetropia', label: 'Hypermetropia', desc: 'Shortened eyeball' },
                    { id: 'presbyopia', label: 'Presbyopia', desc: 'Inflexible aging lens' }
                  ].map((cond) => (
                    <button
                      key={cond.id}
                      onClick={() => handleConditionChange(cond.id)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        eyeCondition === cond.id
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 shadow-md ring-1 ring-indigo-400'
                          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs">{cond.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{cond.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CONTROL 3: Corrective Spectacle Lens Toggle */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Glasses className="w-3.5 h-3.5 text-cyan-400" />
                    3. Corrective Spectacle Lens (Trial Frame):
                  </label>
                  {eyeCondition !== 'normal' && (
                    <span className="text-[11px] text-amber-300 font-medium">
                      Select appropriate lens to focus rays on retina
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setCorrectiveLens('none')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      correctiveLens === 'none'
                        ? 'bg-slate-700 text-white border-slate-500 shadow-sm'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    No Glasses (Naked Eye)
                  </button>

                  <button
                    onClick={() => setCorrectiveLens('concave')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      correctiveLens === 'concave'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-sm ring-1 ring-rose-400'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <span>Concave Lens (-D)</span>
                  </button>

                  <button
                    onClick={() => setCorrectiveLens('convex')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      correctiveLens === 'convex'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm ring-1 ring-emerald-400'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <span>Convex Lens (+D)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* "What the Student Sees" Digital Retina Viewport */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Crosshair className="w-4 h-4 text-emerald-400" />
                    Digital Retina View
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      opticalFocus.isSharp
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {opticalFocus.isSharp ? '20/20 CRISP FOCUS' : 'DEFOCUSED BLUR'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time visual acuity perceived by the visual cortex as optical rays hit the fovea centralis:
                </p>
              </div>

              {/* Simulated Visual Field Circle */}
              <div className="relative mx-auto w-48 h-48 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center overflow-hidden shadow-2xl">
                {/* Visual Target (Tree & High-contrast Text) with real-time CSS Blur */}
                <div
                  className="flex flex-col items-center justify-center text-center p-3 transition-all duration-200 select-none"
                  style={{ filter: `blur(${opticalFocus.blurPx}px)` }}
                >
                  <div className="text-4xl mb-1">🌲</div>
                  <div className="font-extrabold text-slate-100 text-sm tracking-wider">
                    KCSE BIOLOGY
                  </div>
                  <div className="font-mono text-emerald-400 text-xs tracking-widest mt-0.5">
                    E D F C Z P
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1">
                    d = {objectDistance < 1 ? `${(objectDistance * 100).toFixed(0)}cm` : `${objectDistance.toFixed(1)}m`}
                  </div>
                </div>

                {/* Subtitle Badge */}
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <span className="px-2 py-0.5 bg-slate-900/90 border border-slate-700 rounded-full text-[9px] font-semibold text-slate-300">
                    Retina Perception
                  </span>
                </div>
              </div>

              {/* Diagnosis Summary Card */}
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  opticalFocus.isSharp
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  {opticalFocus.isSharp ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  {opticalFocus.isSharp
                    ? 'Optimal Image Sharpness'
                    : eyeCondition === 'myopia'
                    ? 'Myopia (Short-Sightedness)'
                    : eyeCondition === 'hypermetropia'
                    ? 'Hypermetropia (Long-Sightedness)'
                    : 'Presbyopic Blur'}
                </div>
                <p className="text-[11px] text-slate-300">
                  {opticalFocus.isSharp
                    ? correctiveLens !== 'none'
                      ? `Corrected! ${correctiveLens.toUpperCase()} lens has restored the focal plane onto the retina.`
                      : 'Light rays converge sharply onto the fovea centralis. Full visual acuity resolved.'
                    : eyeCondition === 'myopia'
                    ? 'Rays converge in front of the retina. Solution: Fit a Concave (diverging) spectacle lens.'
                    : eyeCondition === 'hypermetropia'
                    ? 'Rays converge behind the retina. Solution: Fit a Convex (converging) spectacle lens.'
                    : 'Crystalline lens cannot thicken for reading. Solution: Convex reading glasses.'}
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* BIOMECHANICAL STATUS METRICS TABLE                             */}
          {/* ============================================================== */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Real-Time Biomechanical Status & Antagonistic Mechanism
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: Ciliary Muscle Ring */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="text-xs text-slate-400 font-medium">Ciliary Muscle State</div>
                <div
                  className={`text-base font-bold ${
                    ciliaryMuscleContractedPct > 50 ? 'text-rose-400' : 'text-slate-200'
                  }`}
                >
                  {ciliaryMuscleContractedPct > 50 ? 'CONTRACTED (Sphincter)' : 'RELAXED'}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full transition-all duration-300"
                    style={{ width: `${ciliaryMuscleContractedPct}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  {ciliaryMuscleContractedPct > 50
                    ? 'Ring diameter shrinks inward toward lens'
                    : 'Ring diameter expands outward, pulling zonules'}
                </p>
              </div>

              {/* Metric 2: Suspensory Ligaments (Zonules) */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="text-xs text-slate-400 font-medium">Suspensory Zonules</div>
                <div
                  className={`text-base font-bold ${
                    suspensoryLigamentTensionPct > 50 ? 'text-cyan-400' : 'text-amber-400'
                  }`}
                >
                  {suspensoryLigamentTensionPct > 50 ? 'TAUT & TIGHT' : 'SLACKENED (Loose)'}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${suspensoryLigamentTensionPct}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  {suspensoryLigamentTensionPct > 50
                    ? 'High radial tension stretches lens thin'
                    : 'Tension released; allows lens to recoil'}
                </p>
              </div>

              {/* Metric 3: Crystalline Lens Thickness */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="text-xs text-slate-400 font-medium">Crystalline Lens Shape</div>
                <div className="text-base font-bold text-sky-300">
                  {(3.6 + (lensHalfThickness - 7) * 0.15).toFixed(2)} mm{' '}
                  <span className="text-xs font-normal text-slate-400">
                    ({lensHalfThickness > 12 ? 'Thick Bulge' : 'Thin / Flat'})
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {lensHalfThickness > 12
                    ? 'High Refractive Power (~70 D)'
                    : 'Low Refractive Power (~58 D)'}
                </div>
                <p className="text-[10px] text-slate-400">
                  Bulges naturally when zonular pull is slackened.
                </p>
              </div>

              {/* Metric 4: Incident Ray Geometry */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="text-xs text-slate-400 font-medium">Incident Light Rays</div>
                <div className="text-base font-bold text-emerald-400">
                  {objectDistance <= 0.35
                    ? 'Diverging Strongly'
                    : objectDistance >= 6.0
                    ? 'Parallel Rays'
                    : 'Slightly Diverging'}
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {objectDistance <= 0.35 ? 'Requires +12D Accommodation' : 'Resting Eye Focus'}
                </div>
                <p className="text-[10px] text-slate-400">
                  Diverging rays need stronger lens bending power.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE SAGITTAL ANATOMY EXPLORER */}
      {activeTab === 'anatomy' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  Sagittal Section of the Human Eyeball
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Click any hotspot pin below to reveal structural features, physiological roles, and KCSE exam tips.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                12 Essential KCSE Structures
              </span>
            </div>

            {/* Anatomy Pin Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {ANATOMY_PINS.map((pin) => {
                const isSelected = activePinId === pin.id;
                return (
                  <button
                    key={pin.id}
                    onClick={() => setActivePinId(pin.id)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md ring-1 ring-cyan-400'
                        : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>{pin.name}</span>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{pin.role}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Anatomy Pin Detail Card */}
            {activePinId ? (
              (() => {
                const pin = ANATOMY_PINS.find((p) => p.id === activePinId);
                if (!pin) return null;
                return (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/20 border border-cyan-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs">
                          HOTSPOT
                        </span>
                        <h3 className="text-lg font-bold text-slate-100">{pin.name}</h3>
                      </div>
                      <span className="text-xs font-medium text-cyan-400">{pin.role}</span>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">{pin.description}</p>

                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-200">
                        <strong className="font-semibold text-amber-300">KCSE Exam Insight: </strong>
                        {pin.kcseTip}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-center text-slate-400 text-xs">
                👆 Select any anatomical hotspot above to inspect detailed histology, optical physiology, and KCSE examination hints.
              </div>
            )}
          </div>

          {/* Side-by-Side Accommodation Mechanism Table */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              KCSE Accommodation Comparative Summary Table
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3 font-semibold">Parameter</th>
                    <th className="py-2.5 px-3 font-semibold text-cyan-400">
                      Distant Vision (&gt; 6 metres / Infinity)
                    </th>
                    <th className="py-2.5 px-3 font-semibold text-emerald-400">
                      Near Vision (25 cm / Near Point)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-slate-400">Incident Light Rays</td>
                    <td className="py-2.5 px-3">Parallel light rays enter eye</td>
                    <td className="py-2.5 px-3">Diverging light rays enter eye</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-slate-400">Ciliary Muscle Action</td>
                    <td className="py-2.5 px-3 text-cyan-300 font-semibold">
                      RELAXES (Ciliary ring diameter expands)
                    </td>
                    <td className="py-2.5 px-3 text-emerald-300 font-semibold">
                      CONTRACTS (Ciliary sphincter constricts inward)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-slate-400">Suspensory Ligaments</td>
                    <td className="py-2.5 px-3 text-cyan-300 font-semibold">
                      Pulled TAUT / Tightened
                    </td>
                    <td className="py-2.5 px-3 text-emerald-300 font-semibold">
                      SLACKENED / Tension released
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-slate-400">Crystalline Lens Form</td>
                    <td className="py-2.5 px-3">Stretched thin and flatter</td>
                    <td className="py-2.5 px-3">Bulges, thickens and becomes more convex</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-slate-400">Focal Length & Power</td>
                    <td className="py-2.5 px-3">Longer focal length, lower converging power (~58 D)</td>
                    <td className="py-2.5 px-3">Shorter focal length, high converging power (~70 D)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-slate-400">Focal Landing Site</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                      Precisely onto Fovea Centralis
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                      Precisely onto Fovea Centralis
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KCSE PRACTICE QUIZ */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                KCSE Biology Form 4 Practice Quiz
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Test your mastery of human eye accommodation, optics, and refractive defects.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400">Score: </span>
              <span className="text-sm font-bold text-amber-400">
                {quizScore} / {KCSE_QUIZ.length}
              </span>
            </div>
          </div>

          {/* Current Question Display */}
          {(() => {
            const q = KCSE_QUIZ[quizStep];
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                    Question {quizStep + 1} of {KCSE_QUIZ.length}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                  {q.question}
                </p>

                {/* Option Buttons */}
                <div className="space-y-2.5 pt-2">
                  {q.options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === q.correct;
                    let btnStyle =
                      'bg-slate-950/70 hover:bg-slate-800 border-slate-800 text-slate-300';

                    if (quizAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                      } else {
                        btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={quizAnswered}
                        onClick={() => {
                          setSelectedAnswer(idx);
                          setQuizAnswered(true);
                          if (idx === q.correct) {
                            setQuizScore((prev) => prev + 1);
                          }
                          if (onTelemetry) {
                            onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
                              simulation: 'human_eye_accommodation_defects_3d',
                              action: 'quiz_answered',
                              questionId: q.id,
                              isCorrect: idx === q.correct
                            });
                          }
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {quizAnswered && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        )}
                        {quizAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Rationale Banner */}
                {quizAnswered && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-4">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                      <HelpCircle className="w-4 h-4" />
                      KCSE Examiner Rationale:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{q.rationale}</p>
                    <div className="pt-2 flex justify-end">
                      {quizStep < KCSE_QUIZ.length - 1 ? (
                        <button
                          onClick={() => {
                            setQuizStep((prev) => prev + 1);
                            setSelectedAnswer(null);
                            setQuizAnswered(false);
                          }}
                          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                        >
                          Next Question
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setQuizStep(0);
                            setSelectedAnswer(null);
                            setQuizAnswered(false);
                            setQuizScore(0);
                          }}
                          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
                        >
                          Restart Quiz
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Footer Curriculum Tagging */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
        <div>
          Kenya Certificate of Secondary Education (KCSE) • Form 4 Biology Syllabus (Topic 3)
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive Ray-Tracing & Biomechanics Standard</span>
        </div>
      </div>
    </div>
  );
}
