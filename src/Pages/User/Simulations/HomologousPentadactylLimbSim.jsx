import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  Compass,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  ArrowRightLeft,
  GitFork
} from 'lucide-react';

// Specimen limb definitions with exact KCSE comparative morphological features
const SPECIMENS = {
  human: {
    id: 'human',
    name: 'Human Forelimb (Arm)',
    organism: 'Homo sapiens',
    adaptation: 'Grasping, tool manipulation & fine motor movement',
    habitat: 'Terrestrial / Arboreal ancestry',
    evolutionType: 'Divergent Evolution (Adaptive Radiation)',
    proportions: {
      humerusLen: 120,
      humerusThick: 20,
      radiusLen: 110,
      radiusThick: 15,
      ulnaLen: 115,
      ulnaThick: 14,
      carpalSize: 8,
      carpalSpread: 42,
      metacarpalLen: 42,
      metacarpalThick: 7,
      digitLens: [32, 44, 48, 42, 36],
      digitAngles: [-34, -14, 2, 18, 34],
    },
    description:
      'Possesses an opposable thumb and mobile radius capable of pronation and supination around the ulna. Highly adapted for precision grasping and cultural tool usage rather than locomotion.',
    kcseKeyNote:
      'Unspecialized classic pentadactyl limb preserved in ancestral proportions, facilitating broad mechanical dexterity.'
  },
  bird: {
    id: 'bird',
    name: 'Bird Wing',
    organism: 'Columba livia (Pigeon)',
    adaptation: 'Aerial flight (aerodynamic airfoil creation)',
    habitat: 'Aerial / Arboreal',
    evolutionType: 'Divergent Evolution (Adaptive Radiation)',
    proportions: {
      humerusLen: 95,
      humerusThick: 22,
      radiusLen: 105,
      radiusThick: 12,
      ulnaLen: 110,
      ulnaThick: 16,
      carpalSize: 9,
      carpalSpread: 26,
      metacarpalLen: 65,
      metacarpalThick: 16,
      digitLens: [18, 50, 16, 0, 0],
      digitAngles: [-28, 4, 22, 0, 0],
    },
    description:
      'Bones are pneumatized (hollow with air sacs) to reduce weight. Distal carpals and metacarpals fuse into a rigid carpometacarpus. Reduced to only 3 functional digits supporting primary flight feathers.',
    kcseKeyNote:
      'Bones fused and digits reduced from 5 to 3 to provide rigid anchoring surfaces for primary flight feathers without extra weight.'
  },
  bat: {
    id: 'bat',
    name: 'Bat Wing',
    organism: 'Pteropus sp. (Fruit Bat)',
    adaptation: 'True powered flapping flight (patagium support)',
    habitat: 'Aerial / Troglobiont',
    evolutionType: 'Divergent Evolution (Adaptive Radiation)',
    proportions: {
      humerusLen: 85,
      humerusThick: 14,
      radiusLen: 125,
      radiusThick: 13,
      ulnaLen: 30,
      ulnaThick: 6,
      carpalSize: 7,
      carpalSpread: 34,
      metacarpalLen: 85,
      metacarpalThick: 5,
      digitLens: [20, 95, 105, 95, 85],
      digitAngles: [-55, -25, -2, 22, 48],
    },
    description:
      'Digits II through V and their metacarpals are exceptionally elongated into slender struts that stretch and manipulate the elastic leathery wing membrane (patagium). Digit I (thumb) remains free as a hook for climbing.',
    kcseKeyNote:
      'Extreme elongation of 4 digits with membranous skin stretching between them. Contrasts with bird wings where feathers produce the flight surface.'
  },
  mole: {
    id: 'mole',
    name: 'Mole Forelimb',
    organism: 'Talpa europaea (European Mole)',
    adaptation: 'Subterranean burrowing and soil excavation',
    habitat: 'Fossorial (Underground tunnels)',
    evolutionType: 'Divergent Evolution (Adaptive Radiation)',
    proportions: {
      humerusLen: 55,
      humerusThick: 42,
      radiusLen: 48,
      radiusThick: 26,
      ulnaLen: 58,
      ulnaThick: 30,
      carpalSize: 11,
      carpalSpread: 56,
      metacarpalLen: 28,
      metacarpalThick: 15,
      digitLens: [30, 34, 35, 34, 30],
      digitAngles: [-32, -16, 0, 16, 32],
    },
    description:
      'Bones are drastically shortened, broadened, and flattened with massive flanges and ridges for anchoring hypertrophied pectoral muscles. Hands face outward like heavy spade-like shovels.',
    kcseKeyNote:
      'Short, stout, and flattened bones provide high mechanical leverage (torque) to displace dense subterranean soil.'
  },
  whale: {
    id: 'whale',
    name: 'Whale Flipper',
    organism: 'Megaptera novaeangliae (Humpback Whale)',
    adaptation: 'Hydrodynamic steering and aquatic stabilization',
    habitat: 'Marine / Pelagic',
    evolutionType: 'Divergent Evolution (Adaptive Radiation)',
    proportions: {
      humerusLen: 65,
      humerusThick: 38,
      radiusLen: 70,
      radiusThick: 32,
      ulnaLen: 68,
      ulnaThick: 28,
      carpalSize: 10,
      carpalSpread: 48,
      metacarpalLen: 35,
      metacarpalThick: 12,
      digitLens: [42, 68, 78, 55, 38],
      digitAngles: [-30, -12, 4, 18, 30],
    },
    description:
      'Enclosed completely in a fibrous paddle-like hydrofoil. Demonstrates hyperphalangy (multiplication of phalangeal count per digit). Joints between finger bones are rigidified to resist water pressure.',
    kcseKeyNote:
      'Shortened, flattened proximal bones combined with elongated, multi-jointed digits embedded in dense connective tissue to act as an unbending rudder.'
  }
};

// Color coding for homologous bone groups across vertebrates
const BONE_GROUPS = [
  {
    id: 'humerus',
    name: 'Humerus',
    subtitle: 'Single proximal long bone',
    color: '#38bdf8',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    description:
      'Articulates with the pectoral girdle at the glenoid cavity. In moles it is short and broad; in bats and humans it is long and slender.'
  },
  {
    id: 'radius_ulna',
    name: 'Radius & Ulna',
    subtitle: 'Paired middle forearm bones',
    color: '#4ade80',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description:
      'Radius on the thumb side, ulna on the little finger side with an olecranon process. In bats, the ulna is rudimentary; in birds, the ulna is stouter than the radius.'
  },
  {
    id: 'carpals',
    name: 'Carpals',
    subtitle: 'Wrist bones (cluster of small bones)',
    color: '#fbbf24',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description:
      'Form the flexible or rigid carpal cluster. Fused with metacarpals in birds to form the carpometacarpus.'
  },
  {
    id: 'metacarpals',
    name: 'Metacarpals',
    subtitle: 'Palm skeletal rays (5 ancestral rays)',
    color: '#f472b6',
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    description:
      'Five ancestral skeletal rays. Extremely elongated in bats to support the patagium; fused in birds; robust in moles.'
  },
  {
    id: 'phalanges',
    name: 'Phalanges',
    subtitle: 'Finger / Digit terminal segments',
    color: '#c084fc',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description:
      'Ancestral formula (2-3-3-3-3). Reduced to 3 digits in birds; multiplied in whales (hyperphalangy); hugely elongated in bats.'
  }
];

// KCSE Exam Quiz Database
const KCSE_QUESTIONS = [
  {
    id: 1,
    question:
      'The wing of a bat and the wing of an insect both serve the function of flight, yet their internal structural anatomy differs completely. What evolutionary relationship is demonstrated here?',
    options: [
      { id: 'A', text: 'Divergent evolution arising from homologous structures' },
      { id: 'B', text: 'Convergent evolution giving rise to analogous structures' },
      { id: 'C', text: 'Adaptive radiation originating from a common ancestor' },
      { id: 'D', text: 'Parallel evolution of vestigial structures' }
    ],
    correct: 'B',
    explanation:
      'Analogous structures arise through convergent evolution when unrelated organisms face similar selective environmental pressures and evolve organs with similar functions but differing embryological origins.'
  },
  {
    id: 2,
    question:
      'Explain how the pentadactyl limb of vertebrates provides evidence for organic evolution according to the KCSE syllabus:',
    options: [
      { id: 'A', text: 'Vertebrates deliberately modified their bone shapes depending on their daily needs' },
      { id: 'B', text: 'All vertebrates possess identical habits and nutritional modes' },
      { id: 'C', text: 'A common basic pentadactyl structural plan has undergone adaptive radiation to adapt to diverse ecological niches' },
      { id: 'D', text: 'Spontaneous generation of new bones occurred as vertebrates migrated onto land' }
    ],
    correct: 'C',
    explanation:
      'The presence of homologous pentadactyl limbs across birds, bats, whales, and humans shows descent from a common ancestral tetrapod, modified through divergent evolution (adaptive radiation).'
  },
  {
    id: 3,
    question:
      'In bird wings, what anatomical modification of the ancestral pentadactyl limb is observed?',
    options: [
      { id: 'A', text: 'Hyperphalangy resulting in 10 digits per wing' },
      { id: 'B', text: 'Fusion of distal carpals and metacarpals into a carpometacarpus and reduction to 3 digits' },
      { id: 'C', text: 'Total loss of the humerus and hypertrophy of the radius' },
      { id: 'D', text: 'Development of an opposable thumb for nesting' }
    ],
    correct: 'B',
    explanation:
      'To provide rigidity for flight without excess payload, birds evolved a fused carpometacarpus and reduced their digits to three (digits II, III, and IV).'
  }
];

export default function HomologousPentadactylLimbSim({ onTelemetry }) {
  const [selectedSpecimen, setSelectedSpecimen] = useState('human');
  const [activeBoneFilter, setActiveBoneFilter] = useState('all');
  const [viewMode, setViewMode] = useState('3d');
  const [isRotating, setIsRotating] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [tiltAngle, setTiltAngle] = useState(15);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dissectionExploded, setDissectionExploded] = useState(false);
  const [explodedOffset, setExplodedOffset] = useState(0);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [completedQuiz, setCompletedQuiz] = useState(false);

  const canvasRef = useRef(null);
  const specimen = SPECIMENS[selectedSpecimen];

  // Continuous 3D turntable auto-rotation
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.6) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [isRotating]);

  // Smooth exploded animation
  useEffect(() => {
    let animId;
    const target = dissectionExploded ? 38 : 0;
    const animateExplosion = () => {
      setExplodedOffset((prev) => {
        const diff = target - prev;
        if (Math.abs(diff) < 0.5) return target;
        return prev + diff * 0.15;
      });
      animId = requestAnimationFrame(animateExplosion);
    };
    animId = requestAnimationFrame(animateExplosion);
    return () => cancelAnimationFrame(animId);
  }, [dissectionExploded]);

  // Draw 3D pseudo-isometric or turntable bone projection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Dynamic background grid & laboratory ambiance
    ctx.save();
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Specimen base platform circular shadow
    const centerX = width / 2;
    const centerY = height * 0.52;
    const rad = (rotationAngle * Math.PI) / 180;
    const cosR = Math.cos(rad);
    const sinR = Math.sin(rad);
    const tiltRad = (tiltAngle * Math.PI) / 180;
    const cosT = Math.cos(tiltRad);

    const gradShadow = ctx.createRadialGradient(centerX, centerY + 140, 10, centerX, centerY + 140, 160);
    gradShadow.addColorStop(0, 'rgba(2, 6, 23, 0.7)');
    gradShadow.addColorStop(1, 'rgba(2, 6, 23, 0)');
    ctx.fillStyle = gradShadow;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 140, 150, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Helper: 3D point transformation to 2D screen coordinate
    const project = (x3, y3, z3) => {
      const rx = x3 * cosR - z3 * sinR;
      const rz = x3 * sinR + z3 * cosR;
      const ry = y3 * cosT - rz * Math.sin(tiltRad);
      const finalZ = y3 * Math.sin(tiltRad) + rz * cosT;
      const distance = 420;
      const scale = distance / (distance + finalZ);
      return {
        x: centerX + rx * scale,
        y: centerY + ry * scale,
        z: finalZ,
        scale
      };
    };

    // Render 3D bone segment with lighting and depth shading
    const drawBoneCylinder = (
      p1,
      p2,
      thickness,
      baseColor,
      boneType,
      label = null
    ) => {
      const isFiltered = activeBoneFilter !== 'all' && activeBoneFilter !== boneType;
      const alpha = isFiltered ? 0.2 : 0.95;

      const pt1 = project(p1.x, p1.y, p1.z);
      const pt2 = project(p2.x, p2.y, p2.z);

      const dx = pt2.x - pt1.x;
      const dy = pt2.y - pt1.y;
      const len = Math.hypot(dx, dy);
      if (len < 1) return;

      const nx = -dy / len;
      const ny = dx / len;
      const w1 = (thickness * pt1.scale) / 2;
      const w2 = (thickness * 0.85 * pt2.scale) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pt1.x + nx * w1, pt1.y + ny * w1);
      ctx.lineTo(pt2.x + nx * w2, pt2.y + ny * w2);
      ctx.lineTo(pt2.x - nx * w2, pt2.y - ny * w2);
      ctx.lineTo(pt1.x - nx * w1, pt1.y - ny * w1);
      ctx.closePath();

      const grad = ctx.createLinearGradient(
        pt1.x + nx * w1,
        pt1.y + ny * w1,
        pt1.x - nx * w1,
        pt1.y - ny * w1
      );
      grad.addColorStop(0, 'rgba(255, 255, 255, ' + alpha * 0.8 + ')');
      grad.addColorStop(0.35, baseColor);
      grad.addColorStop(0.75, baseColor);
      grad.addColorStop(1, 'rgba(15, 23, 42, ' + alpha + ')');

      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(pt1.x, pt1.y, w1 * 1.1, 0, Math.PI * 2);
      ctx.arc(pt2.x, pt2.y, w2 * 1.1, 0, Math.PI * 2);
      ctx.fillStyle = baseColor;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      if (label && activeBoneFilter === boneType) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 6;
        ctx.textAlign = 'center';
        ctx.fillText(label, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2 - 10);
        ctx.restore();
      }
    };

    const p = specimen.proportions;
    const exp = explodedOffset;

    // 1. HUMERUS
    const humTop = { x: 0, y: -160 - exp * 2.2, z: 0 };
    const humBot = { x: 0, y: -160 - exp * 2.2 + p.humerusLen, z: 0 };
    drawBoneCylinder(humTop, humBot, p.humerusThick, '#38bdf8', 'humerus', 'Humerus');

    // 2. RADIUS & ULNA (Paired Forearm)
    const elbowY = humBot.y + (dissectionExploded ? 14 : 0);
    const radiusTop = { x: -16, y: elbowY, z: -4 };
    const radiusBot = { x: -18, y: elbowY + p.radiusLen, z: -4 };
    drawBoneCylinder(radiusTop, radiusBot, p.radiusThick, '#4ade80', 'radius_ulna', 'Radius');

    if (specimen.id !== 'bat' || p.ulnaLen > 10) {
      const ulnaTop = { x: 16, y: elbowY, z: 4 };
      const ulnaBot = { x: 18, y: elbowY + p.ulnaLen, z: 4 };
      drawBoneCylinder(ulnaTop, ulnaBot, p.ulnaThick, '#22c55e', 'radius_ulna', 'Ulna');
    }

    // 3. CARPALS (Wrist cluster)
    const wristY = elbowY + Math.max(p.radiusLen, p.ulnaLen) + exp * 1.2;
    const carpalCenter = { x: 0, y: wristY, z: 0 };
    const carpalCount = specimen.id === 'bird' ? 3 : 7;

    for (let i = 0; i < carpalCount; i++) {
      const angle = (i / carpalCount) * Math.PI * 2;
      const cx = carpalCenter.x + Math.cos(angle) * (p.carpalSpread * 0.45);
      const cz = carpalCenter.z + Math.sin(angle) * 8;
      const cy = carpalCenter.y + ((i % 2) * 8 - 4);
      const isFiltered = activeBoneFilter !== 'all' && activeBoneFilter !== 'carpals';
      const alpha = isFiltered ? 0.2 : 0.95;

      const pt = project(cx, cy, cz);
      ctx.save();
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, p.carpalSize * pt.scale, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.globalAlpha = alpha;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = isFiltered ? 0 : 6;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    // 4. METACARPALS & 5. PHALANGES (Hand / Digits Rays)
    const palmBaseY = wristY + 12 + exp * 1.4;
    const digitCount = p.digitLens.length;

    p.digitLens.forEach((len, idx) => {
      if (len === 0) return;

      const angleRad = (p.digitAngles[idx] * Math.PI) / 180;
      const spreadX = (idx - (digitCount - 1) / 2) * (p.carpalSpread * 0.28);

      const metaStart = { x: spreadX * 0.7, y: palmBaseY, z: idx * 2 - 4 };
      const metaEnd = {
        x: spreadX + Math.sin(angleRad) * p.metacarpalLen,
        y: palmBaseY + Math.cos(angleRad) * p.metacarpalLen,
        z: metaStart.z
      };
      drawBoneCylinder(
        metaStart,
        metaEnd,
        p.metacarpalThick,
        '#f472b6',
        'metacarpals',
        idx === 0 ? 'Metacarpal' : null
      );

      const phalanxCount = specimen.id === 'whale' ? 5 : idx === 0 ? 2 : 3;
      let currStart = {
        x: metaEnd.x + (dissectionExploded ? Math.sin(angleRad) * 8 : 0),
        y: metaEnd.y + (dissectionExploded ? Math.cos(angleRad) * 8 : 0),
        z: metaEnd.z
      };
      const segmentLen = len / phalanxCount;

      for (let s = 0; s < phalanxCount; s++) {
        const segEnd = {
          x: currStart.x + Math.sin(angleRad) * segmentLen,
          y: currStart.y + Math.cos(angleRad) * segmentLen,
          z: currStart.z
        };
        drawBoneCylinder(
          currStart,
          segEnd,
          Math.max(4, p.metacarpalThick * (0.8 - s * 0.12)),
          '#c084fc',
          'phalanges',
          idx === 2 && s === 0 ? 'Phalanges' : null
        );
        currStart = { ...segEnd };
      }
    });

    // Special leathery patagium visualization overlay for Bat
    if (specimen.id === 'bat' && activeBoneFilter === 'all') {
      ctx.save();
      ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      const ptThumb = project(-40, palmBaseY + 20, 0);
      const ptD2 = project(-70, palmBaseY + 160, 0);
      const ptD3 = project(-10, palmBaseY + 185, 0);
      const ptD4 = project(55, palmBaseY + 170, 0);
      const ptD5 = project(110, palmBaseY + 155, 0);
      const ptBody = project(70, palmBaseY - 30, 0);

      ctx.moveTo(ptThumb.x, ptThumb.y);
      ctx.lineTo(ptD2.x, ptD2.y);
      ctx.lineTo(ptD3.x, ptD3.y);
      ctx.lineTo(ptD4.x, ptD4.y);
      ctx.lineTo(ptD5.x, ptD5.y);
      ctx.lineTo(ptBody.x, ptBody.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }, [selectedSpecimen, activeBoneFilter, rotationAngle, tiltAngle, explodedOffset, dissectionExploded]);

  // Mouse / Touch 3D interactive drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsRotating(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setRotationAngle((prev) => (prev + deltaX * 0.7) % 360);
    setTiltAngle((prev) => Math.max(-30, Math.min(60, prev + deltaY * 0.5)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Quiz submission
  const handleAnswerSelect = (optId) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    setIsAnswerSubmitted(true);
    const q = KCSE_QUESTIONS[currentQuizIndex];
    if (selectedAnswer === q.correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex + 1 < KCSE_QUESTIONS.length) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setCompletedQuiz(true);
      if (onTelemetry) {
        onTelemetry({
          event: 'simulation_quiz_completed',
          simulation: 'HomologousPentadactylLimbSim',
          score: quizScore + (selectedAnswer === KCSE_QUESTIONS[currentQuizIndex].correct ? 1 : 0),
          maxScore: KCSE_QUESTIONS.length,
          passed: quizScore >= 2
        });
      }
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setCompletedQuiz(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-5 text-slate-100 font-sans space-y-5">
      {/* Simulation Header */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
              <GitFork className="w-4 h-4" />
              KCSE Biology Form 4 • Topic 4: Evolution
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Homologous Pentadactyl Limb & Adaptive Radiation
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Examine the anatomical divergence of the ancestral vertebrate 5-digit forelimb plan.
              Compare bone modifications across specialized mammalian and avian niches.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              3D Specimen View
            </button>
            <button
              onClick={() => setViewMode('analogy_contrast')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'analogy_contrast'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Homology vs Analogy
            </button>
          </div>
        </div>
      </div>

      {viewMode === '3d' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main 3D Canvas Viewport (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between relative">
            {/* Viewport Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-300">
                  {specimen.name} (<span className="italic text-slate-400">{specimen.organism}</span>)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsRotating((prev) => !prev)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isRotating
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title={isRotating ? 'Pause Turntable' : 'Play Turntable'}
                >
                  {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setRotationAngle(0);
                    setTiltAngle(15);
                  }}
                  className="p-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all cursor-pointer"
                  title="Reset 3D Orientation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDissectionExploded((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    dissectionExploded
                      ? 'bg-purple-600 text-white border-purple-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  {dissectionExploded ? 'Collapse Joints' : 'Dissect / Explode'}
                </button>
              </div>
            </div>

            {/* 3D Canvas */}
            <div
              className="relative w-full h-[440px] sm:h-[480px] cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden rounded-2xl my-2"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas
                ref={canvasRef}
                width={620}
                height={500}
                className="w-full h-full object-contain select-none"
              />

              {/* Drag instruction overlay */}
              <div className="absolute bottom-3 left-3 pointer-events-none bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                Drag to orbit 360° | Azimuth: {Math.round(rotationAngle)}°
              </div>
            </div>

            {/* Interactive Bone Group Legend / Filter */}
            <div className="pt-3 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Color-Coded Homologous Regions (Select to isolate)</span>
                {activeBoneFilter !== 'all' && (
                  <button
                    onClick={() => setActiveBoneFilter('all')}
                    className="text-sky-400 hover:underline cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {BONE_GROUPS.map((bone) => {
                  const isSelected = activeBoneFilter === bone.id;
                  return (
                    <button
                      key={bone.id}
                      onClick={() =>
                        setActiveBoneFilter((prev) => (prev === bone.id ? 'all' : bone.id))
                      }
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? `${bone.badgeClass} ring-2 ring-sky-400/50`
                          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: bone.color }}
                        />
                        <span className="text-xs font-bold truncate text-slate-200">
                          {bone.name}
                        </span>
                      </div>
                      <span className="text-[10px] block opacity-75 truncate">{bone.subtitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Specimen Selection & Anatomical Analysis (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Vertebrate Specimen Carousel / Selector */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Select Vertebrate Specimen
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.values(SPECIMENS).map((spec) => {
                  const isActive = selectedSpecimen === spec.id;
                  return (
                    <button
                      key={spec.id}
                      onClick={() => setSelectedSpecimen(spec.id)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-sky-500/20 border-sky-500/60 text-white shadow-md'
                          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-between">
                        {spec.name}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-sky-400" />}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 truncate">
                        {spec.adaptation}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Morphological Adaptation Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  Adaptive Radiation Profile
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {specimen.evolutionType}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                    Primary Function
                  </span>
                  <span className="font-bold text-white text-xs mt-0.5 block">
                    {specimen.adaptation}
                  </span>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                    Ecological Niche
                  </span>
                  <span className="font-bold text-emerald-400 text-xs mt-0.5 block">
                    {specimen.habitat}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-2xl border border-slate-700/40">
                {specimen.description}
              </p>

              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 leading-relaxed">
                <Info className="w-4 h-4 text-amber-400 inline mr-1.5 -mt-0.5" />
                <strong>KCSE Key Insight: </strong>
                {specimen.kcseKeyNote}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Analogy vs Homology Contrast View */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-amber-400" />
              Homologous Structures vs. Analogous Structures
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              A foundational distinction in the KCSE Biology Form 4 national examination syllabus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Homologous Box */}
            <div className="bg-slate-800/60 border border-sky-500/40 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-sky-400">Homologous Structures</h3>
                <span className="px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-xs font-bold border border-sky-500/30">
                  Divergent Evolution
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Structures that share a <strong>common embryonic origin and basic structural plan</strong>{' '}
                derived from a common ancestor, but have evolved to carry out <strong>different functions</strong>{' '}
                due to adaptive radiation into diverse environments.
              </p>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700/60 space-y-2 text-xs">
                <div className="font-bold text-slate-200">Key Classical Example:</div>
                <div className="text-slate-400">
                  Pentadactyl limb in vertebrates:
                  <ul className="list-disc list-inside mt-1 space-y-1 text-slate-300">
                    <li>Human arm (tool making & manipulation)</li>
                    <li>Bird & Bat wings (flight)</li>
                    <li>Whale flipper (swimming)</li>
                    <li>Mole forelimb (digging)</li>
                  </ul>
                </div>
              </div>
              <div className="text-[11px] text-sky-300/80 bg-sky-950/40 p-3 rounded-xl border border-sky-800/40">
                ✓ Proven by comparative embryology, bone homology, and shared pentadactyl organization.
              </div>
            </div>

            {/* Analogous Box */}
            <div className="bg-slate-800/60 border border-amber-500/40 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-amber-400">Analogous Structures</h3>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30">
                  Convergent Evolution
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Structures that perform the <strong>same biological function</strong> (e.g. flight or
                swimming), but possess <strong>different embryonic origins and structural designs</strong>{' '}
                because the organisms are unrelated and converged under similar environmental selection pressures.
              </p>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700/60 space-y-2 text-xs">
                <div className="font-bold text-slate-200">Key Classical Example:</div>
                <div className="text-slate-400">
                  Insect Wing vs Bird Wing:
                  <ul className="list-disc list-inside mt-1 space-y-1 text-slate-300">
                    <li>
                      <strong>Bird Wing:</strong> Endoskeleton composed of living bone (humerus, radius,
                      carpometacarpus) covered by feathers.
                    </li>
                    <li>
                      <strong>Insect Wing:</strong> Outgrowth of the exoskeleton composed of chitinous
                      veins without bones or feathers.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="text-[11px] text-amber-300/80 bg-amber-950/40 p-3 rounded-xl border border-amber-800/40">
                ✓ Does NOT indicate common ancestry; illustrates convergence in flight aerodynamics.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive KCSE Examination Challenge */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">
              KCSE Evaluation Challenge: Comparative Anatomy
            </h2>
          </div>
          {!completedQuiz && (
            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Question {currentQuizIndex + 1} of {KCSE_QUESTIONS.length}
            </span>
          )}
        </div>

        {!completedQuiz ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              {KCSE_QUESTIONS[currentQuizIndex].question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {KCSE_QUESTIONS[currentQuizIndex].options.map((opt) => {
                const isSelected = selectedAnswer === opt.id;
                let optStyle = 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800';

                if (isAnswerSubmitted) {
                  if (opt.id === KCSE_QUESTIONS[currentQuizIndex].correct) {
                    optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected) {
                    optStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-sky-500/20 border-sky-500 text-sky-200 font-bold';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswerSelect(opt.id)}
                    disabled={isAnswerSubmitted}
                    className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start gap-2.5 ${optStyle} cursor-pointer disabled:cursor-default`}
                  >
                    <span className="font-bold shrink-0">{opt.id}.</span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {isAnswerSubmitted && (
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center gap-2">
                  {selectedAnswer === KCSE_QUESTIONS[currentQuizIndex].correct ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Correct KCSE Marking Scheme Answer!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                      <XCircle className="w-4 h-4" /> Incorrect
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {KCSE_QUESTIONS[currentQuizIndex].explanation}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-sky-600/30"
                >
                  Submit Marking Scheme Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {currentQuizIndex + 1 < KCSE_QUESTIONS.length ? 'Next Question' : 'Complete Challenge'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Comparative Anatomy Challenge Finished!</h3>
            <p className="text-xs text-slate-300">
              You scored <span className="font-bold text-emerald-400">{quizScore}</span> out of{' '}
              <span className="font-bold">{KCSE_QUESTIONS.length}</span> questions.
            </p>
            <button
              onClick={handleResetQuiz}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Retake Challenge
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
