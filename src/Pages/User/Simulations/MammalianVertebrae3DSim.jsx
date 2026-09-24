import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  RotateCcw,
  Eye,
  Info,
  Layers,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  Award,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sliders,
  Shield,
  BookOpen,
  Maximize2
} from 'lucide-react';

/**
 * Audio feedback synthesizer for anatomical inspection & quiz clicks
 */
class BoneAudioSynth {
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
  playClick() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
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
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.05, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.16);
      });
    } catch {
      // Audio context guard
    }
  }
}

const audioSynth = new BoneAudioSynth();

/**
 * 3D Comparative Vertebrae Data with Anatomical Pin Coordinates and KCSE Details
 */
const VERTEBRAE_DATA = {
  atlas: {
    id: 'atlas',
    name: 'Atlas (First Cervical Vertebra - C1)',
    shortName: 'Atlas (C1)',
    region: 'Cervical (Neck)',
    count: '1st cervical vertebra',
    weightBearing: 'Low (Carries Cranium)',
    primaryFunction: "Supports the skull; enables nodding movement ('YES') at the atlanto-occipital joint.",
    kcseKeyFeatures: [
      'Absence of centrum (body) - ring-shaped bone.',
      'Extremely wide neural canal divided into anterior (odontoid peg) and posterior (spinal cord) regions.',
      'Broad, wing-like transverse processes with vertebrarterial canals for vertebral blood vessels.',
      'Deep, cup-shaped superior articular facets for articulation with occipital condyles of cranium.',
      'Absence of neural spine (reduced to a tiny posterior tubercle).'
    ],
    dimensions: { length: 85, width: 95, depth: 35 },
    pins: [
      {
        id: 'superior_facets',
        label: 'Superior Articular Facets',
        subtext: 'Cup-shaped; articulates with occipital condyles',
        x: -28, y: -8, z: 12,
        desc: 'Deep concave facets that articulate directly with the occipital condyles of the skull base, creating a synovial condyloid joint allowing forward and backward nodding movements ("yes").'
      },
      {
        id: 'neural_canal',
        label: 'Large Neural Canal',
        subtext: 'Accommodates spinal cord & odontoid peg',
        x: 0, y: 0, z: 0,
        desc: 'Enormously wide aperture divided in life by the transverse ligament into two compartments: the anterior compartment houses the odontoid peg of the axis, and the posterior compartment protects the spinal cord.'
      },
      {
        id: 'vertebrarterial_canal',
        label: 'Vertebrarterial Canal',
        subtext: 'Foramen transversarium (passage for vertebral artery)',
        x: 42, y: 2, z: -4,
        desc: 'Located on the transverse process. Provides a protected conduit for the vertebral artery and vein ascending to the brain.'
      },
      {
        id: 'transverse_process',
        label: 'Broad Transverse Process',
        subtext: 'Wing-like leverage for neck rotation',
        x: -46, y: 0, z: -2,
        desc: 'Wide lateral projection providing substantial mechanical leverage for attachments of lateral neck muscles that rotate and tilt the head.'
      },
      {
        id: 'anterior_arch',
        label: 'Anterior Arch & Tubercle',
        subtext: 'Replaces true centrum',
        x: 0, y: 24, z: 4,
        desc: 'Smooth curved anterior bony rim with an internal articular facet that glides against the dens (odontoid process) of the axis.'
      },
      {
        id: 'posterior_tubercle',
        label: 'Posterior Tubercle',
        subtext: 'Rudimentary neural spine',
        x: 0, y: -26, z: 2,
        desc: 'A tiny nub representing an evolutionary remnant of the neural spine, preventing cranial impingement during extreme head extension.'
      }
    ]
  },
  axis: {
    id: 'axis',
    name: 'Axis (Second Cervical Vertebra - C2)',
    shortName: 'Axis (C2)',
    region: 'Cervical (Neck)',
    count: '2nd cervical vertebra',
    weightBearing: 'Moderate (Pivots skull & atlas)',
    primaryFunction: "Acts as a pivot allowing horizontal head rotation ('NO') at the atlanto-axial joint.",
    kcseKeyFeatures: [
      'Prominent vertical odontoid process (dens) projecting superiorly from centrum.',
      'Dense, strong centrum that has incorporated the embryonic atlas centrum.',
      'Broad, stout, bifid neural spine providing attachment for strong nuchal muscles.',
      'Vertebrarterial canals on transverse processes for vertebral blood vessels.',
      'Flat superior articular facets enabling atlas to rotate smoothly.'
    ],
    dimensions: { length: 70, width: 80, depth: 65 },
    pins: [
      {
        id: 'odontoid_process',
        label: 'Odontoid Process (Dens)',
        subtext: 'Pivot peg projecting superiorly',
        x: 0, y: 8, z: 32,
        desc: 'Tooth-like projection representing the detached centrum of the atlas that fused with the axis. Acts as the vertical pivot peg around which the atlas and skull rotate when indicating "no".'
      },
      {
        id: 'centrum',
        label: 'Centrum (Body)',
        subtext: 'Solid cylindrical weight-bearing base',
        x: 0, y: 14, z: -10,
        desc: 'Solid bony cylinder forming the base from which the odontoid process rises. Transmits upper cervical axial loads.'
      },
      {
        id: 'neural_spine',
        label: 'Broad Bifid Neural Spine',
        subtext: 'Deeply grooved for nuchal ligament & muscles',
        x: 0, y: -34, z: 12,
        desc: 'Massive, thick, often bifurcated (forked) neural spine giving secure attachment to deep neck muscles (rectus capitis posterior and semispinalis) controlling head stability.'
      },
      {
        id: 'vertebrarterial_canal',
        label: 'Vertebrarterial Canal',
        subtext: 'Carries vertebral blood vessels',
        x: 36, y: 4, z: -2,
        desc: 'Perforates each transverse process, transmitting the ascending vertebral artery towards the foramen magnum of the cranium.'
      },
      {
        id: 'superior_facets',
        label: 'Superior Articular Facet',
        subtext: 'Flat horizontal gliding surface',
        x: -24, y: 6, z: 16,
        desc: 'Large, flat circular facet tilted slightly laterally to allow smooth rotational sliding of the inferior facets of the atlas.'
      }
    ]
  },
  thoracic: {
    id: 'thoracic',
    name: 'Thoracic Vertebra (e.g. T6 - Mid-Thoracic)',
    shortName: 'Thoracic (T1-T12)',
    region: 'Thorax (Chest / Upper Back)',
    count: '12 in humans (12 pairs of ribs)',
    weightBearing: 'Substantial (Forms thoracic cage)',
    primaryFunction: 'Articulates with ribs to form protective thoracic rib cage and anchor respiratory muscles.',
    kcseKeyFeatures: [
      'Heart-shaped centrum with costal demifacets on lateral sides.',
      'Long, narrow neural spine pointing steeply downwards (caudally) and backwards.',
      'Tubercular facets on transverse processes for articulation with the tuberculum of ribs.',
      'Small, circular neural canal compared to cervical and lumbar vertebrae.',
      'Absence of vertebrarterial canals.'
    ],
    dimensions: { length: 80, width: 75, depth: 75 },
    pins: [
      {
        id: 'neural_spine',
        label: 'Long Downward Neural Spine',
        subtext: 'Points sharply caudally; overlaps below',
        x: 0, y: -38, z: -15,
        desc: 'Slender, elongated spine pointing steeply backwards and downwards, overlapping the vertebra below. Severely limits thoracic hyperextension, stabilizing the rib cage during thoracic breathing.'
      },
      {
        id: 'centrum',
        label: 'Heart-Shaped Centrum',
        subtext: 'Roughly equal transverse and anteroposterior diameter',
        x: 0, y: 22, z: -6,
        desc: 'Medium-sized heart-shaped body designed to bear upper body mass while providing smooth lateral articulation zones for the head of ribs.'
      },
      {
        id: 'costal_demifacets',
        label: 'Costal Demifacets (Capitular Facets)',
        subtext: 'Smooth articular notches on centrum for rib heads',
        x: -22, y: 20, z: 2,
        desc: 'Smooth articular depressions situated dorsolaterally on the centrum. In mid-thoracic vertebrae, superior and inferior demifacets receive the capitulum (head) of ribs.'
      },
      {
        id: 'transverse_costal_facet',
        label: 'Transverse Costal Facet',
        subtext: 'Articulates with rib tubercle',
        x: 35, y: -6, z: 12,
        desc: 'Located near the end of the club-shaped transverse process. Provides a firm synovial articulation with the tuberculum of the corresponding rib.'
      },
      {
        id: 'neural_canal',
        label: 'Circular Neural Canal',
        subtext: 'Relatively narrow circular conduit',
        x: 0, y: 0, z: 2,
        desc: 'Circular and smaller in diameter than cervical and lumbar canals, reflecting the thinner diameter of the mid-thoracic spinal cord.'
      }
    ]
  },
  lumbar: {
    id: 'lumbar',
    name: 'Lumbar Vertebra (e.g. L3 - Lower Back)',
    shortName: 'Lumbar (L1-L5)',
    region: 'Loin / Lower Back',
    count: '5 in humans',
    weightBearing: 'Maximum (Supports entire upper body & trunk)',
    primaryFunction: 'Bears heavy trunk weight; enables powerful trunk flexion, extension, and lateral bending.',
    kcseKeyFeatures: [
      'Massive, thick kidney-shaped (reniform) centrum.',
      'Broad, short, rectangular (hatchet-shaped) horizontal neural spine.',
      'Long, slender transverse processes extending laterally for lumbar muscle origin.',
      'Triangular neural canal for cauda equina nerve fibers.',
      'Metapophyses and anapophyses for interlocking articular stability under heavy shear loads.',
      'Absence of both costal facets and vertebrarterial canals.'
    ],
    dimensions: { length: 90, width: 100, depth: 70 },
    pins: [
      {
        id: 'centrum',
        label: 'Massive Kidney-Shaped Centrum',
        subtext: 'Thick, reniform body resisting compression',
        x: 0, y: 26, z: -10,
        desc: 'Massive, thick, bean/kidney-shaped centrum with wide horizontal cross-section. Distributes massive compressive forces exerted by the entire torso, head, and carried loads.'
      },
      {
        id: 'neural_spine',
        label: 'Broad Rectangular Neural Spine',
        subtext: 'Hatchet-shaped horizontal projection',
        x: 0, y: -36, z: 10,
        desc: 'Short, thick, horizontally oriented quadrangular spine. Provides extensive surface area for insertion of heavy spinal erector muscles (sacrospinalis).'
      },
      {
        id: 'transverse_process',
        label: 'Long Slender Transverse Process',
        subtext: 'Extra leverage for psoas and abdominal wall muscles',
        x: -48, y: 4, z: 2,
        desc: 'Slender, elongated lateral projection serving as a powerful lever arm for the quadratus lumborum and deep core postural muscles.'
      },
      {
        id: 'metapophysis',
        label: 'Metapophysis / Superior Zygapophysis',
        subtext: 'Inwardly facing articular facet with rounded tubercle',
        x: -24, y: -12, z: 24,
        desc: 'Curved superior articular process facing inwards (medially), capped with a distinct metapophysis tubercle. Interlocks tightly with inferior zygapophyses of the vertebra above to resist rotational dislocation.'
      },
      {
        id: 'neural_canal',
        label: 'Triangular Neural Canal',
        subtext: 'Spacious conduit for lower spinal cord / cauda equina',
        x: 0, y: 0, z: 0,
        desc: 'Distinctly triangular aperture, larger than the thoracic canal, accommodating the terminal spinal cord enlargement and descending cauda equina.'
      }
    ]
  }
};

/**
 * Standard View Presets
 */
const VIEW_PRESETS = [
  { id: 'superior', name: 'Superior (Top View)', rotX: 75, rotY: 0, desc: 'Best view for neural canal, centrum shape, zygapophyses, and transversaria' },
  { id: 'anterior', name: 'Anterior (Front View)', rotX: 5, rotY: 0, desc: 'Shows anterior face of centrum, odontoid peg elevation, and transverse width' },
  { id: 'lateral', name: 'Lateral (Side View)', rotX: 10, rotY: 90, desc: 'Shows neural spine angle, demifacets, and vertical depth profile' },
  { id: 'posterior', name: 'Posterior (Back View)', rotX: 10, rotY: 180, desc: 'Shows neural arch, lamina, neural spine root, and postzygapophyses' }
];

/**
 * KCSE Exam Challenges
 */
const KCSE_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Which vertebra lacks a centrum (body) and allows nodding movements ("YES") of the head?',
    options: ['Thoracic vertebra', 'Atlas (C1)', 'Axis (C2)', 'Lumbar vertebra'],
    correct: 1,
    explanation: 'The Atlas (C1) lacks a centrum, forming an open ring. Its deep superior articular facets articulate with the occipital condyles of the skull to permit nodding.'
  },
  {
    id: 2,
    question: 'The odontoid process (dens) is a diagnostic anatomical feature found exclusively on:',
    options: ['Sacral vertebra', 'Mid-thoracic vertebra', 'Axis (C2)', 'First cervical vertebra (Atlas)'],
    correct: 2,
    explanation: 'The odontoid process (dens) is the upward-projecting pivot peg of the Axis (C2), which fits into the anterior notch of the Atlas.'
  },
  {
    id: 3,
    question: 'Costal demifacets on the centrum and facets on transverse processes for rib articulation are diagnostic of:',
    options: ['Cervical vertebrae', 'Lumbar vertebrae', 'Thoracic vertebrae', 'Caudal vertebrae'],
    correct: 2,
    explanation: 'Thoracic vertebrae possess costal demifacets on their centrum for the rib capitulum and transverse costal facets for the rib tubercle.'
  },
  {
    id: 4,
    question: 'Why do lumbar vertebrae have the most massive, kidney-shaped centrums and broad horizontal neural spines?',
    options: [
      'To allow 360-degree rotation of the abdomen',
      'To bear the immense compressive weight of the upper body and anchor massive back muscles',
      'To facilitate high-speed flight maneuvers',
      'To protect the branchial breathing arches'
    ],
    correct: 1,
    explanation: 'As weight increases down the vertebral column, lumbar vertebrae bear maximum trunk load, necessitating thick reniform centrums and hatchet-shaped neural spines for muscular leverage.'
  },
  {
    id: 5,
    question: 'A student observes a vertebra with a vertebrarterial canal (foramen transversarium) in its transverse process. This specimen belongs to which region?',
    options: ['Thoracic region', 'Lumbar region', 'Cervical region', 'Sacral region'],
    correct: 2,
    explanation: 'Vertebrarterial canals are present ONLY in cervical vertebrae, serving as protected channels for the ascending vertebral blood vessels to the brain.'
  }
];

export default function MammalianVertebrae3DSim({ onTelemetry }) {
  // Active Selected Vertebra
  const [activeVertebraKey, setActiveVertebraKey] = useState('atlas');
  const currentVertebra = VERTEBRAE_DATA[activeVertebraKey];

  // 3D Model View Angles
  const [rotX, setRotX] = useState(65);
  const [rotY, setRotY] = useState(25);
  const [zoom, setZoom] = useState(1);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedPinId, setSelectedPinId] = useState(null);

  // Drag interaction
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, startRotX: 0, startRotY: 0 });

  // Quiz State
  const [activeTab, setActiveTab] = useState('3d_explorer'); // '3d_explorer' | 'comparison_matrix' | 'kcse_quiz'
  const [quizIndex, setQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Auto-rotation loop
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setRotY((prev) => (prev + 1.2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Selected Pin Object
  const activePin = useMemo(() => {
    return currentVertebra.pins.find((p) => p.id === selectedPinId) || null;
  }, [currentVertebra, selectedPinId]);

  // Select Pin Handler
  const handleSelectPin = useCallback((pinId) => {
    audioSynth.playClick();
    setSelectedPinId((prev) => (prev === pinId ? null : pinId));
  }, []);

  // Switch Vertebra Handler
  const handleSelectVertebra = (key) => {
    audioSynth.playClick();
    setActiveVertebraKey(key);
    setSelectedPinId(null);
  };

  // Preset Views
  const applyViewPreset = (preset) => {
    audioSynth.playClick();
    setRotX(preset.rotX);
    setRotY(preset.rotY);
  };

  // Mouse / Touch Dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startRotX: rotX,
      startRotY: rotY
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setRotY((dragStartRef.current.startRotY + deltaX * 0.7) % 360);
    setRotX(Math.max(-85, Math.min(85, dragStartRef.current.startRotX - deltaY * 0.7)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        startRotX: rotX,
        startRotY: rotY
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartRef.current.x;
    const deltaY = e.touches[0].clientY - dragStartRef.current.y;
    setRotY((dragStartRef.current.startRotY + deltaX * 0.7) % 360);
    setRotX(Math.max(-85, Math.min(85, dragStartRef.current.startRotX - deltaY * 0.7)));
  };

  // 3D projection helper for pins
  const projectPin = useCallback((pin, radX, radY, scaleFactor) => {
    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);

    // Rotate around Y axis
    const x1 = pin.x * cosY + pin.y * sinY;
    const y1 = -pin.x * sinY + pin.y * cosY;
    const z1 = pin.z;

    // Rotate around X axis
    const x2 = x1;
    const y2 = y1 * cosX - z1 * sinX;
    const z2 = y1 * sinX + z1 * cosX;

    // Screen perspective projection
    const distance = 220;
    const perspective = distance / (distance - z2 * 0.6);
    const screenX = 220 + x2 * perspective * scaleFactor;
    const screenY = 190 - y2 * perspective * scaleFactor;

    return { screenX, screenY, depth: z2, isFront: z2 >= -30 };
  }, []);

  const radX = (rotX * Math.PI) / 180;
  const radY = (rotY * Math.PI) / 180;

  // Quiz Handling
  const handleSelectQuizOption = (optionIndex) => {
    if (quizSubmitted) return;
    audioSynth.playClick();
    setUserAnswers((prev) => ({
      ...prev,
      [quizIndex]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    KCSE_QUIZ_QUESTIONS.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    audioSynth.playSuccess();
    if (onTelemetry) {
      onTelemetry({
        type: 'kcse_quiz_complete',
        simulation: 'mammalian_vertebrae_3d',
        score,
        total: KCSE_QUIZ_QUESTIONS.length,
        percentage: Math.round((score / KCSE_QUIZ_QUESTIONS.length) * 100)
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
      {/* Simulation Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-1">
            <span className="p-1 rounded bg-sky-950/80 border border-sky-800/60">
              <Layers className="w-4 h-4 text-sky-400" />
            </span>
            <span>KCSE Form 4 Biology · Topic 1: Support & Movement</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            Mammalian Vertebrae 3D Comparative Anatomy
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Interactive multi-angle skeletal reconstruction of cervical (Atlas, Axis), thoracic, and lumbar vertebrae.
            Examine adaptations for cranial articulation, rib support, weight bearing, and muscle anchorage.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl self-start lg:self-center">
          <button
            onClick={() => setActiveTab('3d_explorer')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === '3d_explorer'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>3D Bone Model</span>
          </button>
          <button
            onClick={() => setActiveTab('comparison_matrix')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'comparison_matrix'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Comparative Matrix</span>
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
            <span>KCSE Identification Quiz</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === '3d_explorer' && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 3D Stage & Rotation Canvas */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {/* Vertebra Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
              {Object.keys(VERTEBRAE_DATA).map((key) => {
                const item = VERTEBRAE_DATA[key];
                const isSelected = activeVertebraKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectVertebra(key)}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600/20 border border-sky-500 text-sky-200 shadow-md'
                        : 'bg-slate-950/60 border border-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs uppercase font-bold text-sky-400 mb-0.5">{item.region}</div>
                    <div className="text-xs sm:text-sm font-black text-white truncate">{item.shortName}</div>
                  </button>
                );
              })}
            </div>

            {/* 3D Canvas Box */}
            <div
              className="relative w-full h-[400px] sm:h-[460px] bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-3xl border border-slate-800/90 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing shadow-inner"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              {/* Background 3D Grid Reference */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* View Overlay Tag */}
              <div className="absolute top-4 left-4 flex flex-col gap-1 z-10 pointer-events-none">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 border border-slate-700 text-sky-300 shadow-sm">
                  {currentVertebra.name}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Pitch: {Math.round(rotX)}° | Yaw: {Math.round(rotY)}° | Zoom: {zoom.toFixed(1)}×
                </span>
              </div>

              {/* Controls floating top right */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  title={isAutoRotating ? 'Pause Rotation' : 'Auto-Rotate 360°'}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isAutoRotating
                      ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20'
                      : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setZoom((prev) => Math.min(1.4, prev + 0.1))}
                  title="Zoom In"
                  className="p-2 rounded-xl text-xs bg-slate-900/90 text-slate-300 border border-slate-700 hover:text-white cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom((prev) => Math.max(0.7, prev - 0.1))}
                  title="Zoom Out"
                  className="p-2 rounded-xl text-xs bg-slate-900/90 text-slate-300 border border-slate-700 hover:text-white cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setRotX(65);
                    setRotY(25);
                    setZoom(1);
                  }}
                  title="Reset View"
                  className="p-2 rounded-xl text-xs bg-slate-900/90 text-slate-300 border border-slate-700 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* 3D SVG Vertebra Model */}
              <div
                className="transition-transform duration-75 ease-out relative flex items-center justify-center"
                style={{
                  transform: `scale(${zoom})`,
                  width: '440px',
                  height: '380px'
                }}
              >
                <svg
                  viewBox="0 0 440 380"
                  className="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] overflow-visible"
                >
                  <defs>
                    {/* Bone Texture Gradients */}
                    <radialGradient id="boneLight" cx="40%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="45%" stopColor="#e2e8f0" />
                      <stop offset="80%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </radialGradient>
                    <radialGradient id="boneShadow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#64748b" />
                      <stop offset="70%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </radialGradient>
                    <linearGradient id="facetShine" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
                    </linearGradient>
                    <filter id="boneGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0ea5e9" floodOpacity="0.25" />
                    </filter>
                  </defs>

                  {/* Pseudo-3D Geometric Rendering for each vertebra based on rotation */}
                  <g
                    transform={`translate(220, 190) scale(${1 + Math.sin(radY) * 0.05})`}
                  >
                    {/* ATLAS (C1) - Ring shape, no centrum, large canal */}
                    {activeVertebraKey === 'atlas' && (
                      <g>
                        {/* Atlas Posterior Arch */}
                        <path
                          d={`M -75,${Math.sin(radX) * 20} C -65,${-50 * Math.cos(radX)} 65,${-50 * Math.cos(radX)} 75,${Math.sin(radX) * 20}`}
                          fill="none"
                          stroke="url(#boneShadow)"
                          strokeWidth="28"
                          strokeLinecap="round"
                        />
                        <path
                          d={`M -75,${Math.sin(radX) * 20} C -65,${-50 * Math.cos(radX)} 65,${-50 * Math.cos(radX)} 75,${Math.sin(radX) * 20}`}
                          fill="none"
                          stroke="url(#boneLight)"
                          strokeWidth="22"
                          strokeLinecap="round"
                        />

                        {/* Large Neural Canal Hole (Center) */}
                        <ellipse
                          cx="0"
                          cy={-Math.sin(radX) * 5}
                          rx="44"
                          ry={Math.max(12, 34 * Math.abs(Math.cos(radX)))}
                          fill="#020617"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                          strokeDasharray="4 3"
                          opacity="0.9"
                        />

                        {/* Transverse Processes (Lateral wings with vertebrarterial canals) */}
                        <g transform={`rotate(${rotY * 0.3})`}>
                          {/* Left Wing */}
                          <path
                            d="M -60,-15 C -95,-20 -115,-5 -100,15 C -85,25 -65,20 -55,10 Z"
                            fill="url(#boneLight)"
                            stroke="#64748b"
                            strokeWidth="2"
                          />
                          {/* Left Vertebrarterial Canal */}
                          <circle cx="-82" cy="3" r="6" fill="#020617" stroke="#38bdf8" strokeWidth="2" />

                          {/* Right Wing */}
                          <path
                            d="M 60,-15 C 95,-20 115,-5 100,15 C 85,25 65,20 55,10 Z"
                            fill="url(#boneLight)"
                            stroke="#64748b"
                            strokeWidth="2"
                          />
                          {/* Right Vertebrarterial Canal */}
                          <circle cx="82" cy="3" r="6" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
                        </g>

                        {/* Superior Articular Facets (Cup-shaped for occipital condyles) */}
                        <ellipse
                          cx="-45"
                          cy={-15 * Math.cos(radX) + Math.sin(radY) * 6}
                          rx="18"
                          ry={Math.max(8, 22 * Math.cos(radX))}
                          fill="url(#facetShine)"
                          stroke="#38bdf8"
                          strokeWidth="2"
                        />
                        <ellipse
                          cx="45"
                          cy={-15 * Math.cos(radX) - Math.sin(radY) * 6}
                          rx="18"
                          ry={Math.max(8, 22 * Math.cos(radX))}
                          fill="url(#facetShine)"
                          stroke="#38bdf8"
                          strokeWidth="2"
                        />

                        {/* Anterior Arch (Front Rim) */}
                        <path
                          d={`M -65,${-5 * Math.sin(radX)} C -50,${45 * Math.cos(radX)} 50,${45 * Math.cos(radX)} 65,${-5 * Math.sin(radX)}`}
                          fill="none"
                          stroke="url(#boneLight)"
                          strokeWidth="24"
                          strokeLinecap="round"
                        />
                        {/* Anterior Tubercle */}
                        <circle cx="0" cy={42 * Math.cos(radX)} r="6" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                        {/* Posterior Tubercle (Rudimentary Spine) */}
                        <circle cx="0" cy={-48 * Math.cos(radX)} r="4.5" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />
                      </g>
                    )}

                    {/* AXIS (C2) - Odontoid process (dens), solid centrum, bifid spine */}
                    {activeVertebraKey === 'axis' && (
                      <g>
                        {/* Bifid Neural Spine (Posterior) */}
                        <path
                          d={`M -20,${-30 * Math.cos(radX)} C -35,${-70 * Math.cos(radX)} -10,${-85 * Math.cos(radX)} 0,${-65 * Math.cos(radX)} C 10,${-85 * Math.cos(radX)} 35,${-70 * Math.cos(radX)} 20,${-30 * Math.cos(radX)}`}
                          fill="url(#boneShadow)"
                          stroke="#475569"
                          strokeWidth="2"
                        />

                        {/* Transverse Processes with Foramina */}
                        <path
                          d="M -45,-5 C -75,-10 -85,10 -65,20 C -50,25 -40,15 -35,5 Z"
                          fill="url(#boneLight)"
                          stroke="#64748b"
                          strokeWidth="1.5"
                        />
                        <circle cx="-60" cy="8" r="5.5" fill="#020617" stroke="#38bdf8" strokeWidth="2" />

                        <path
                          d="M 45,-5 C 75,-10 85,10 65,20 C 50,25 40,15 35,5 Z"
                          fill="url(#boneLight)"
                          stroke="#64748b"
                          strokeWidth="1.5"
                        />
                        <circle cx="60" cy="8" r="5.5" fill="#020617" stroke="#38bdf8" strokeWidth="2" />

                        {/* Centrum (Solid Base) */}
                        <rect
                          x="-42"
                          y={5 * Math.cos(radX)}
                          width="84"
                          height="44"
                          rx="14"
                          fill="url(#boneLight)"
                          stroke="#64748b"
                          strokeWidth="2.5"
                        />

                        {/* Superior Articular Facets (Flat, circular) */}
                        <circle cx="-32" cy={-5 * Math.cos(radX)} r="14" fill="url(#facetShine)" stroke="#38bdf8" strokeWidth="2" />
                        <circle cx="32" cy={-5 * Math.cos(radX)} r="14" fill="url(#facetShine)" stroke="#38bdf8" strokeWidth="2" />

                        {/* ODONTOID PROCESS (DENS) - Tooth-like vertical pivot peg */}
                        <g transform={`translate(${Math.sin(radY) * 8}, ${-Math.sin(radX) * 15})`}>
                          <path
                            d="M -16,10 L -14,-35 C -14,-50 14,-50 14,-35 L 16,10 Z"
                            fill="url(#boneLight)"
                            stroke="#0284c7"
                            strokeWidth="2.5"
                            filter="url(#boneGlow)"
                          />
                          <ellipse cx="0" cy="-35" rx="12" ry="6" fill="#e0f2fe" opacity="0.7" />
                          <line x1="0" y1="-45" x2="0" y2="5" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />
                        </g>
                      </g>
                    )}

                    {/* THORACIC VERTEBRA - Long caudally angled spine, heart centrum, demifacets */}
                    {activeVertebraKey === 'thoracic' && (
                      <g>
                        {/* Downward Angled Long Neural Spine */}
                        <path
                          d={`M -12,${-15 * Math.cos(radX)} L -8,${-95 * Math.cos(radX) - 20} C 0,${-110 * Math.cos(radX) - 25} 0,${-110 * Math.cos(radX) - 25} 8,${-95 * Math.cos(radX) - 20} L 12,${-15 * Math.cos(radX)} Z`}
                          fill="url(#boneShadow)"
                          stroke="#334155"
                          strokeWidth="2.5"
                        />

                        {/* Club-shaped Transverse Processes with Costal Facets */}
                        <path
                          d="M -25,-10 C -55,-25 -80,-15 -75,5 C -70,20 -45,15 -25,5 Z"
                          fill="url(#boneLight)"
                          stroke="#64748b"
                          strokeWidth="2"
                        />
                        {/* Left Transverse Costal Facet (for rib tubercle) */}
                        <ellipse cx="-68" cy="-5" rx="8" ry="6" fill="url(#facetShine)" stroke="#38bdf8" strokeWidth="1.5" />

                        <path
                          d="M 25,-10 C 55,-25 80,-15 75,5 C 70,20 45,15 25,5 Z"
                          fill="url(#boneLight)"
                          stroke="#64748b"
                          strokeWidth="2"
                        />
                        {/* Right Transverse Costal Facet */}
                        <ellipse cx="68" cy="-5" rx="8" ry="6" fill="url(#facetShine)" stroke="#38bdf8" strokeWidth="1.5" />

                        {/* Heart-Shaped Centrum */}
                        <path
                          d={`M -44,${25 * Math.cos(radX)} C -50,${-5 * Math.cos(radX)} -15,${-15 * Math.cos(radX)} 0,${-2 * Math.cos(radX)} C 15,${-15 * Math.cos(radX)} 50,${-5 * Math.cos(radX)} 44,${25 * Math.cos(radX)} C 35,${55 * Math.cos(radX)} -35,${55 * Math.cos(radX)} -44,${25 * Math.cos(radX)} Z`}
                          fill="url(#boneLight)"
                          stroke="#64748b"
                          strokeWidth="2.5"
                        />

                        {/* Costal Demifacets on Centrum (for rib capitulum) */}
                        <ellipse cx="-42" cy={20 * Math.cos(radX)} rx="6" ry="9" fill="url(#facetShine)" stroke="#0284c7" strokeWidth="1.5" />
                        <ellipse cx="42" cy={20 * Math.cos(radX)} rx="6" ry="9" fill="url(#facetShine)" stroke="#0284c7" strokeWidth="1.5" />

                        {/* Neural Canal (Circular) */}
                        <circle cx="0" cy={-2 * Math.cos(radX)} r="18" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
                      </g>
                    )}

                    {/* LUMBAR VERTEBRA - Massive kidney centrum, hatchet spine, metapophyses */}
                    {activeVertebraKey === 'lumbar' && (
                      <g>
                        {/* Broad Hatchet-Shaped Rectangular Neural Spine */}
                        <path
                          d={`M -14,${-15 * Math.cos(radX)} L -14,${-70 * Math.cos(radX)} L 14,${-70 * Math.cos(radX)} L 14,${-15 * Math.cos(radX)} Z`}
                          fill="url(#boneShadow)"
                          stroke="#475569"
                          strokeWidth="2.5"
                        />
                        {/* Spine Thick Posterior Margin */}
                        <line
                          x1="-14"
                          y1={-70 * Math.cos(radX)}
                          x2="14"
                          y2={-70 * Math.cos(radX)}
                          stroke="#f8fafc"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />

                        {/* Long, Slender Transverse Processes */}
                        <path
                          d="M -30,-5 C -75,-12 -110,-5 -95,5 C -75,12 -35,5 -30,2 Z"
                          fill="url(#boneLight)"
                          stroke="#64748b"
                          strokeWidth="2"
                        />
                        <path
                          d="M 30,-5 C 75,-12 110,-5 95,5 C 75,12 35,5 30,2 Z"
                          fill="url(#boneLight)"
                          stroke="#64748b"
                          strokeWidth="2"
                        />

                        {/* Massive Kidney-Shaped (Reniform) Centrum */}
                        <path
                          d={`M -58,${25 * Math.cos(radX)} C -65,${-10 * Math.cos(radX)} -10,${-18 * Math.cos(radX)} 0,${-5 * Math.cos(radX)} C 10,${-18 * Math.cos(radX)} 65,${-10 * Math.cos(radX)} 58,${25 * Math.cos(radX)} C 50,${65 * Math.cos(radX)} -50,${65 * Math.cos(radX)} -58,${25 * Math.cos(radX)} Z`}
                          fill="url(#boneLight)"
                          stroke="#475569"
                          strokeWidth="3"
                        />

                        {/* Metapophysis & Inwardly Curved Superior Zygapophyses */}
                        <g>
                          <path
                            d="M -28,-18 C -38,-24 -36,-38 -24,-34 C -18,-30 -22,-20 -28,-18 Z"
                            fill="#e2e8f0"
                            stroke="#0284c7"
                            strokeWidth="2"
                          />
                          <ellipse cx="-26" cy="-26" rx="5" ry="8" fill="url(#facetShine)" stroke="#38bdf8" strokeWidth="1.5" />
                          <circle cx="-32" cy="-32" r="3.5" fill="#f59e0b" />

                          <path
                            d="M 28,-18 C 38,-24 36,-38 24,-34 C 18,-30 22,-20 28,-18 Z"
                            fill="#e2e8f0"
                            stroke="#0284c7"
                            strokeWidth="2"
                          />
                          <ellipse cx="26" cy="-26" rx="5" ry="8" fill="url(#facetShine)" stroke="#38bdf8" strokeWidth="1.5" />
                          <circle cx="32" cy="-32" r="3.5" fill="#f59e0b" />
                        </g>

                        {/* Triangular Neural Canal */}
                        <polygon
                          points={`0,${-10 * Math.cos(radX)} -22,${10 * Math.cos(radX)} 22,${10 * Math.cos(radX)}`}
                          fill="#020617"
                          stroke="#38bdf8"
                          strokeWidth="2"
                        />
                      </g>
                    )}
                  </g>
                </svg>

                {/* Interactive Anatomical Pins & Callouts */}
                {showLabels &&
                  currentVertebra.pins.map((pin) => {
                    const { screenX, screenY, isFront } = projectPin(pin, radX, radY, 1.15);
                    const isSelected = selectedPinId === pin.id;

                    return (
                      <div
                        key={pin.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPin(pin.id);
                        }}
                        style={{
                          left: `${screenX}px`,
                          top: `${screenY}px`,
                          transform: 'translate(-50%, -50%)',
                          opacity: isFront ? 1 : 0.45,
                          zIndex: isSelected ? 40 : 20
                        }}
                        className="absolute group cursor-pointer transition-transform hover:scale-110"
                      >
                        {/* Glowing Target Ring */}
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-amber-500 ring-4 ring-amber-400/40 shadow-lg shadow-amber-500/50 scale-125'
                              : 'bg-sky-600/90 border border-sky-300 ring-2 ring-sky-500/30'
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </div>

                        {/* Tooltip on hover / selection */}
                        <div
                          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-7 w-44 p-2 rounded-xl bg-slate-900/95 border border-slate-700 text-center shadow-xl backdrop-blur-md transition-all duration-200 ${
                            isSelected
                              ? 'scale-100 opacity-100 ring-1 ring-amber-400/80'
                              : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                          }`}
                        >
                          <div className="text-xs font-bold text-white leading-tight">{pin.label}</div>
                          <div className="text-[10px] text-sky-400 mt-0.5">{pin.subtext}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Instructions banner at bottom of 3D stage */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-400 pointer-events-none">
                <span className="hidden sm:inline">🖱️ Drag to rotate 3D model in any axis</span>
                <span className="text-amber-400 font-medium">Click pins to inspect anatomical callouts</span>
              </div>
            </div>

            {/* Quick View Angle Presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
                View Angles:
              </span>
              {VIEW_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyViewPreset(preset)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-sky-500/60 transition-all whitespace-nowrap cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`ml-auto px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                  showLabels
                    ? 'bg-sky-950 border-sky-700 text-sky-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                {showLabels ? 'Hide Anatomical Pins' : 'Show Anatomical Pins'}
              </button>
            </div>
          </div>

          {/* Right Column: Anatomical Callout Panel & KCSE Key Notes */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            {/* Selected Pin Deep Dive Card */}
            {activePin ? (
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/50 shadow-xl space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Selected Anatomical Feature
                  </span>
                  <button
                    onClick={() => setSelectedPinId(null)}
                    className="text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    Clear Selection
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  {activePin.label}
                </h3>
                <p className="text-xs text-amber-200/90 font-medium italic">{activePin.subtext}</p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                  {activePin.desc}
                </p>
              </div>
            ) : (
              <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                  <HelpCircle className="w-5 h-5 text-sky-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Anatomical Pin Inspector</h4>
                <p className="text-xs text-slate-400">
                  Click any numbered or glowing pin on the bone model to reveal its functional significance, articular
                  mechanisms, and KCSE exam grading points.
                </p>
              </div>
            )}

            {/* Vertebra Diagnostic Profile */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  Diagnostic Specifications
                </h4>
                <span className="text-[11px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-800/40">
                  {currentVertebra.count}
                </span>
              </div>

              {/* Functional Key Points */}
              <div className="p-3 rounded-2xl bg-sky-950/30 border border-sky-800/50 text-xs text-sky-200 leading-relaxed">
                <strong className="text-white block mb-1">Primary Biomechanical Role:</strong>
                {currentVertebra.primaryFunction}
              </div>

              {/* Diagnostic Checklist */}
              <div>
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  KCSE Key Identification Checklist:
                </h5>
                <ul className="space-y-2">
                  {currentVertebra.kcseKeyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Functional Biomechanics Quick Note */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Weight Bearing Rating:</span>
                <span className="font-bold text-amber-300">{currentVertebra.weightBearing}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparative Matrix Tab */}
      {activeTab === 'comparison_matrix' && (
        <div className="mt-6 space-y-6">
          <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-800/50 text-xs sm:text-sm text-sky-200">
            <strong>KCSE Comparative Anatomy Summary:</strong> The mammalian vertebral column exhibits progressive
            differentiation along the craniocaudal axis. Centrums enlarge from cervical to lumbar to sustain increasing
            axial compressive forces, while transverse and spinous processes adapt according to regional muscular and
            respiratory demands.
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Feature</th>
                  <th className="p-3.5 text-sky-400">Atlas (C1)</th>
                  <th className="p-3.5 text-sky-400">Axis (C2)</th>
                  <th className="p-3.5 text-sky-400">Thoracic (T1-T12)</th>
                  <th className="p-3.5 text-sky-400">Lumbar (L1-L5)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/80">
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-bold text-white">Centrum (Body)</td>
                  <td className="p-3.5 text-rose-300">ABSENT (Ring-like anterior arch)</td>
                  <td className="p-3.5 text-slate-300">Present, fused with odontoid peg</td>
                  <td className="p-3.5 text-slate-300">Medium, distinctly heart-shaped</td>
                  <td className="p-3.5 text-emerald-300 font-bold">Massive, kidney-shaped (reniform)</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-bold text-white">Neural Spine</td>
                  <td className="p-3.5 text-rose-300">ABSENT (Reduced to posterior tubercle)</td>
                  <td className="p-3.5 text-slate-300">Broad, stout, deeply bifid (forked)</td>
                  <td className="p-3.5 text-amber-300">Long, slender, pointed downwards</td>
                  <td className="p-3.5 text-slate-300">Broad, short, rectangular (hatchet-like)</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-bold text-white">Vertebrarterial Canals</td>
                  <td className="p-3.5 text-emerald-300 font-bold">PRESENT in transverse processes</td>
                  <td className="p-3.5 text-emerald-300 font-bold">PRESENT in transverse processes</td>
                  <td className="p-3.5 text-slate-500">ABSENT</td>
                  <td className="p-3.5 text-slate-500">ABSENT</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-bold text-white">Costal Articulations (Ribs)</td>
                  <td className="p-3.5 text-slate-500">None</td>
                  <td className="p-3.5 text-slate-500">None</td>
                  <td className="p-3.5 text-emerald-300 font-bold">
                    PRESENT: Demifacets on centrum & transverse costal facets
                  </td>
                  <td className="p-3.5 text-slate-500">None</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-bold text-white">Neural Canal Shape</td>
                  <td className="p-3.5 text-slate-300">Very large, divided by transverse ligament</td>
                  <td className="p-3.5 text-slate-300">Large, circular</td>
                  <td className="p-3.5 text-slate-300">Small, circular</td>
                  <td className="p-3.5 text-slate-300">Large, triangular</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-bold text-white">Specific Head / Trunk Movement</td>
                  <td className="p-3.5 text-sky-300 font-medium">Nodding &apos;YES&apos; (Atlanto-occipital joint)</td>
                  <td className="p-3.5 text-sky-300 font-medium">Pivoting &apos;NO&apos; (Atlanto-axial joint)</td>
                  <td className="p-3.5 text-slate-300">Restricted flexion; stabilizes ribcage</td>
                  <td className="p-3.5 text-slate-300">Powerful flexion, extension & lateral bending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KCSE Identification Quiz Tab */}
      {activeTab === 'kcse_quiz' && (
        <div className="mt-6 max-w-3xl mx-auto space-y-6">
          {!quizSubmitted ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Question {quizIndex + 1} of {KCSE_QUIZ_QUESTIONS.length}
                </span>
                <span className="text-xs text-slate-400">KCSE Form 4 Biology Exam Standard</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {KCSE_QUIZ_QUESTIONS[quizIndex].question}
                </h3>

                <div className="space-y-2.5">
                  {KCSE_QUIZ_QUESTIONS[quizIndex].options.map((option, optIdx) => {
                    const isChosen = userAnswers[quizIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectQuizOption(optIdx)}
                        className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all border cursor-pointer flex items-center justify-between ${
                          isChosen
                            ? 'bg-sky-600/30 border-sky-400 text-white shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <span>{option}</span>
                        {isChosen && <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />}
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

                {quizIndex < KCSE_QUIZ_QUESTIONS.length - 1 ? (
                  <button
                    disabled={userAnswers[quizIndex] === undefined}
                    onClick={() => setQuizIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
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
                  <span className="font-bold text-white">{KCSE_QUIZ_QUESTIONS.length}</span> (
                  {Math.round((quizScore / KCSE_QUIZ_QUESTIONS.length) * 100)}%)
                </p>
              </div>

              {/* Explanations list */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Answer Review:</h4>
                {KCSE_QUIZ_QUESTIONS.map((q, idx) => {
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
                  className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Identification Quiz</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
