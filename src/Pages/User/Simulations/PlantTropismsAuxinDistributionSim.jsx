import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sun,
  RotateCw,
  Compass,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  Info,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

// Classical physiological assay treatment conditions
const ASSAYS = [
  {
    id: 'intact',
    title: 'Intact Coleoptile Tip',
    desc: 'Normal shoot tip producing IAA (auxin); responds to unilateral light or gravity by asymmetrical cell elongation.',
    canProduceAuxin: true,
    curvatureShoot: 1.0,
    curvatureRoot: 1.0
  },
  {
    id: 'decapitated',
    title: 'Decapitated Tip',
    desc: 'Tip removed (source of auxin excised); no auxin synthesized, shoot stops elongating and exhibits NO curvature.',
    canProduceAuxin: false,
    curvatureShoot: 0.0,
    curvatureRoot: 0.0
  },
  {
    id: 'opaque_cap',
    title: 'Opaque Lightproof Cap',
    desc: 'Tip shielded from light; photoreceptors in tip cannot sense unilateral illumination. Auxin distributes uniformly; grows straight upwards.',
    canProduceAuxin: true,
    curvatureShoot: 0.0,
    curvatureRoot: 1.0 // Still detects gravity
  },
  {
    id: 'mica_shaded',
    title: 'Mica Sheet (Shaded Side)',
    desc: 'Impermeable mica inserted on shaded side; blocks basipetal transport of migrated auxin down shaded side. Curvature prevented.',
    canProduceAuxin: true,
    curvatureShoot: 0.0,
    curvatureRoot: 0.2
  },
  {
    id: 'mica_lit',
    title: 'Mica Sheet (Lit Side)',
    desc: 'Mica inserted on illuminated side; auxin migrates unimpeded across to shaded side and transports down. Normal curvature occurs.',
    canProduceAuxin: true,
    curvatureShoot: 1.0,
    curvatureRoot: 0.8
  },
  {
    id: 'gelatin_block',
    title: 'Gelatin Block Barrier',
    desc: 'Permeable agar/gelatin block inserted beneath severed tip; auxin diffuses through water-soluble matrix into elongation zone. Curvature restored.',
    canProduceAuxin: true,
    curvatureShoot: 0.9,
    curvatureRoot: 0.9
  }
];

// KCSE Exam Interpretation Questions
const KCSE_TROPISM_QUESTIONS = [
  {
    id: 1,
    question: 'Why does a horizontally placed seedling have a shoot that curves upwards (-ve geotropism) while its radicle curves downwards (+ve geotropism)?',
    options: [
      'Auxin is destroyed by gravity on the lower side of the shoot.',
      'High auxin concentration stimulates cell elongation in shoots, but inhibits cell elongation in roots.',
      'Roots require light to produce auxin whereas shoots do not.',
      'Water in the soil repels auxin away from the radicle.'
    ],
    correct: 1,
    explanation: 'Shoots and roots have different sensitivities to Indole-3-acetic acid (IAA). In the horizontal shoot, high auxin on the lower side accelerates elongation (bending upwards). In the root, that same high auxin concentration inhibits elongation on the lower side, causing upper cells to outgrow lower cells and bend downwards.'
  },
  {
    id: 2,
    question: 'What is the biological outcome when a germinating seedling is rotated continuously on a motorized clinostat in horizontal unilateral light?',
    options: [
      'The shoot bends rapidly towards the light source.',
      'The shoot bends downwards due to centrifugal force.',
      'The seedling continues to grow straight horizontally because unilateral stimuli (light and gravity) are distributed equally around the circumference.',
      'Auxin synthesis is completely arrested due to mechanical agitation.'
    ],
    correct: 2,
    explanation: 'Rotation on a clinostat exposes all sides of the shoot and radicle to gravity and light equally over time. Auxin remains uniformly distributed throughout, resulting in straight growth without tropic bending.'
  },
  {
    id: 3,
    question: 'Which historical experiment proved that the site of light perception in phototropism is the coleoptile apex rather than the zone of elongation?',
    options: [
      'Placing a transparent cap over the coleoptile apex.',
      'Covering the apex with an opaque foil cap while leaving the elongation zone exposed to unilateral light, resulting in straight growth.',
      'Boiling the root in ethanol before iodine testing.',
      'Decapitating the root and immediately inserting a mica sheet.'
    ],
    correct: 1,
    explanation: 'When Darwin and Boysen-Jensen covered the tip with an opaque cap, no phototropic curvature occurred despite unilateral light reaching the lower stem, proving the light stimulus is detected solely by the apex.'
  },
  {
    id: 4,
    question: 'How does Indole-3-acetic acid (IAA) stimulate cell elongation in the region behind the shoot tip according to the acid-growth hypothesis?',
    options: [
      'IAA activates proton pumps (H⁺-ATPases) acidifying the cell wall, activating expansins that loosen cellulose microfibrils allowing turgor-driven expansion.',
      'IAA directly crystallizes the cell wall to increase mechanical stiffness.',
      'IAA halts protein synthesis so cells become hollow and stretch.',
      'IAA causes plasmolysis of all cortical cells.'
    ],
    correct: 0,
    explanation: 'Auxin triggers proton extrusion into the cell wall apoplast. The resulting low pH activates expansin enzymes, loosening cellulose cross-links so internal vacuolar turgor pressure can physically expand the cell.'
  }
];

export default function PlantTropismsAuxinDistributionSim({ config = {}, onTelemetry }) {
  // Tropism experiment mode: 'phototropism' | 'geotropism'
  const [tropismMode, setTropismMode] = useState('phototropism');
  const [selectedAssay, setSelectedAssay] = useState(ASSAYS[0]); // 'intact'
  const [isClinostatOn, setIsClinostatOn] = useState(false);
  const [lightAngle, setLightAngle] = useState(45); // -60 (left) to 60 (right), 0 = overhead
  const [growthTimeHours, setGrowthTimeHours] = useState(0); // 0 to 48 hours
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('controls'); // 'controls' | 'cells' | 'quiz'

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [score, setScore] = useState(0);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const rotationAngleRef = useRef(0);

  // Run automated growth simulation over 48 hours
  const handleRunGrowth = useCallback(() => {
    if (isSimulating) return;
    setIsSimulating(true);

    const startTime = performance.now();
    const duration = 3000; // 3 seconds real time for 48 hours simulated

    const stepSimulation = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      setGrowthTimeHours(Math.round(p * 48));

      if (isClinostatOn) {
        rotationAngleRef.current += 0.15;
      }

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(stepSimulation);
      } else {
        setIsSimulating(false);
        if (typeof onTelemetry === 'function') {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            type: 'PLANT_TROPISM_SIMULATION_COMPLETED',
            tropism: tropismMode,
            assay: selectedAssay.id,
            clinostat: isClinostatOn,
            hours: 48
          });
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(stepSimulation);
  }, [isSimulating, isClinostatOn, tropismMode, selectedAssay, onTelemetry]);

  // Reset simulation
  const handleReset = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsSimulating(false);
    setGrowthTimeHours(0);
    rotationAngleRef.current = 0;
  };

  // Compute calculated bending angle
  // In phototropism: bends towards light unless clinostat is active or assay prevents it
  // In geotropism: shoot bends -ve (upward) and root +ve (downward) unless clinostat active
  const computeShootBend = () => {
    if (isClinostatOn) return 0;
    const timeFactor = growthTimeHours / 48;

    if (tropismMode === 'phototropism') {
      // Light angle dictates direction
      // If light is right (+angle), bends right.
      const assayFactor = selectedAssay.curvatureShoot;
      // Normal phototropic bend angle in degrees
      return (lightAngle / 60) * 42 * timeFactor * assayFactor;
    } else {
      // Geotropism: seedling starts horizontal (90 deg to vertical)
      // Shoot bends upwards by up to -65 degrees
      const assayFactor = selectedAssay.curvatureShoot;
      return -55 * timeFactor * assayFactor;
    }
  };

  const computeRootBend = () => {
    if (isClinostatOn) return 0;
    const timeFactor = growthTimeHours / 48;

    if (tropismMode === 'phototropism') {
      // Roots are weakly negatively phototropic or indifferent in soil
      return -(lightAngle / 60) * 12 * timeFactor * selectedAssay.curvatureRoot;
    } else {
      // Geotropism: radicle bends downwards (+ve geotropism)
      return 60 * timeFactor * selectedAssay.curvatureRoot;
    }
  };

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Deep slate background
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Background laboratory grid
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 25; x < width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 25; y < height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const shootBend = computeShootBend();
    const rootBend = computeRootBend();

    // 1. Environmental Sources (Sun / Unilateral Lamp or Gravity Vector)
    if (tropismMode === 'phototropism') {
      // Calculate lamp/sun position based on lightAngle (-60 to 60 deg)
      const lampRad = (lightAngle * Math.PI) / 180;
      const lampDist = 260;
      const lampX = width / 2 + Math.sin(lampRad) * lampDist;
      const lampY = 90 - Math.cos(lampRad) * 40;

      // Draw Lamp/Sun Rays
      ctx.save();
      ctx.beginPath();
      ctx.arc(lampX, lampY, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#fde047';
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 24;
      ctx.fill();

      // Light beam cone projecting towards seedling center
      const beamGrad = ctx.createRadialGradient(lampX, lampY, 25, width / 2, 280, 280);
      beamGrad.addColorStop(0, 'rgba(250, 204, 21, 0.25)');
      beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(lampX, lampY);
      ctx.lineTo(width / 2 - 120, 360);
      ctx.lineTo(width / 2 + 120, 360);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Lamp casing
      ctx.fillStyle = '#334155';
      ctx.fillRect(lampX - 12, lampY - 34, 24, 14);
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(lampX - 12, lampY - 34, 24, 14);
    } else {
      // Geotropism: Gravity Arrow Indicator
      ctx.save();
      ctx.translate(680, 100);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 70);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(-10, 56);
      ctx.lineTo(0, 75);
      ctx.lineTo(10, 56);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('GRAVITY (g)', -34, -8);
      ctx.fillText('Direction', -26, 96);
      ctx.restore();
    }

    // 2. Clinostat Motor Rig (if active)
    if (isClinostatOn) {
      ctx.save();
      ctx.translate(130, 280);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.stroke();

      // Motor spindle
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-8, 36, 16, 60);

      // Rotating gear marks
      ctx.rotate(rotationAngleRef.current);
      ctx.fillStyle = '#c084fc';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(-4, -32, 8, 14);
        ctx.rotate(Math.PI / 2);
      }
      ctx.restore();

      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('Clinostat Motor: ACTIVE', 75, 395);
      ctx.fillText('(Continuous Rotation)', 78, 410);
    }

    // 3. Plant Seedling / Coleoptile Geometry
    // Origin at pot / seed center: (x: 400, y: 280)
    const originX = width / 2;
    const originY = 280;

    // Soil Pot / Petri dish mount
    ctx.save();
    if (tropismMode === 'geotropism') {
      // Horizontal mounting clip
      ctx.fillStyle = '#475569';
      ctx.fillRect(originX - 45, originY - 24, 40, 48);
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(originX - 45, originY - 24, 40, 48);

      // Agar block support
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(originX - 15, originY - 18, 26, 36);
    } else {
      // Standard upright soil beaker
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(originX - 55, originY + 20);
      ctx.lineTo(originX + 55, originY + 20);
      ctx.lineTo(originX + 42, originY + 120);
      ctx.lineTo(originX - 42, originY + 120);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Moist Soil
      ctx.fillStyle = '#78350f';
      ctx.fillRect(originX - 48, originY + 26, 96, 20);
    }
    ctx.restore();

    // 4. Draw Shoot (Coleoptile) with Dynamic Curvature
    ctx.save();
    ctx.translate(originX, originY);

    if (tropismMode === 'geotropism') {
      // In geotropism, horizontal seedling starts oriented along the +X axis
      ctx.rotate(Math.PI / 2); // default horizontal relative to normal upright
    }

    // Shoot stem segments (segmented curve)
    const shootLength = 140 + (growthTimeHours / 48) * 25;
    const bendRad = (shootBend * Math.PI) / 180;

    // Bezier control points for stem
    const tipX = Math.sin(bendRad) * shootLength;
    const tipY = -Math.cos(bendRad) * shootLength;
    const cpX = Math.sin(bendRad * 0.4) * (shootLength * 0.55);
    const cpY = -Math.cos(bendRad * 0.4) * (shootLength * 0.55);

    // Stem Body (Thick green shoot)
    ctx.beginPath();
    ctx.moveTo(-9, 0);
    ctx.quadraticCurveTo(cpX - 8, cpY, tipX - 6, tipY);
    ctx.lineTo(tipX + 6, tipY);
    ctx.quadraticCurveTo(cpX + 8, cpY, 9, 0);
    ctx.closePath();

    const stemGrad = ctx.createLinearGradient(-10, 0, 10, 0);
    stemGrad.addColorStop(0, '#16a34a');
    stemGrad.addColorStop(1, '#4ade80');
    ctx.fillStyle = stemGrad;
    ctx.fill();
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 5. Draw Coleoptile Tip or Assay Modifications
    ctx.save();
    ctx.translate(tipX, tipY);
    ctx.rotate(bendRad);

    if (selectedAssay.id === 'decapitated') {
      // Decapitated flat cut surface
      ctx.fillStyle = '#bbf7d0';
      ctx.fillRect(-7, -4, 14, 4);
      ctx.strokeStyle = '#15803d';
      ctx.strokeRect(-7, -4, 14, 4);
    } else {
      // Intact Coleoptile Dome Tip
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.bezierCurveTo(-6, -24, 6, -24, 6, 0);
      ctx.closePath();

      if (selectedAssay.id === 'opaque_cap') {
        // Opaque black metal foil cap
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        // Normal green/golden apical dome
        ctx.fillStyle = '#86efac';
        ctx.fill();
        ctx.strokeStyle = '#16a34a';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Barrier Assays: Gelatin Block or Mica sheet inserted below tip
      if (selectedAssay.id === 'gelatin_block') {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.fillRect(-7, 2, 14, 6);
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1;
        ctx.strokeRect(-7, 2, 14, 6);
      } else if (selectedAssay.id === 'mica_shaded') {
        // Mica on shaded (left or right side depending on light)
        const isLeftShaded = lightAngle > 0;
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(isLeftShaded ? -9 : 2, 3, 7, 3);
      } else if (selectedAssay.id === 'mica_lit') {
        // Mica on lit side
        const isLeftLit = lightAngle <= 0;
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(isLeftLit ? -9 : 2, 3, 7, 3);
      }
    }
    ctx.restore(); // End tip translation

    // 6. Draw Auxin (IAA) Granules Distribution Along Stem
    if (selectedAssay.canProduceAuxin) {
      // In phototropism: Auxin migrates to shaded side
      // In geotropism: Auxin settles to bottom side
      const shadedSideFactor = tropismMode === 'phototropism'
        ? (lightAngle > 0 ? -1 : 1) // light from right -> left side shaded
        : 1; // bottom side

      const auxinCount = 28;
      for (let i = 0; i < auxinCount; i++) {
        const seg = 0.15 + (i / auxinCount) * 0.75;
        // Point along bezier
        const ax = (1 - seg) * (1 - seg) * 0 + 2 * (1 - seg) * seg * cpX + seg * seg * tipX;
        const ay = (1 - seg) * (1 - seg) * 0 + 2 * (1 - seg) * seg * cpY + seg * seg * tipY;

        // Shift auxin to shaded side unless clinostat balances it
        const sideOffset = isClinostatOn
          ? (Math.random() - 0.5) * 8
          : (shadedSideFactor * 3.5) + (Math.random() - 0.5) * 3;

        ctx.beginPath();
        ctx.arc(ax + sideOffset, ay, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 4;
        ctx.fill();
      }
    }

    // 7. Draw Radicle / Root in Geotropism Mode
    if (tropismMode === 'geotropism') {
      const rootLen = 110 + (growthTimeHours / 48) * 20;
      const rootRad = (rootBend * Math.PI) / 180;
      const rTipX = -Math.cos(rootRad) * rootLen;
      const rTipY = Math.sin(rootRad) * rootLen;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-rootLen * 0.4, rootLen * 0.1, rTipX, rTipY);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Root Cap
      ctx.beginPath();
      ctx.arc(rTipX, rTipY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#d97706';
      ctx.fill();

      // Label Radicle
      ctx.fillStyle = '#fef08a';
      ctx.font = '10px sans-serif';
      ctx.fillText('Radicle (+ve Geotropic)', rTipX - 70, rTipY + 16);
    }
    ctx.restore(); // End seedling transform

    // 8. On-Canvas Dynamic Callouts & Angle Readouts
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Simulated Growth: ${growthTimeHours}h / 48h`, 20, 30);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText(`Coleoptile Curvature Angle: ${Math.abs(Math.round(shootBend))}°`, 20, 48);

    if (isClinostatOn) {
      ctx.fillStyle = '#c084fc';
      ctx.fillText('Clinostat: Equal auxin distribution => Straight growth', 20, 66);
    } else if (selectedAssay.id === 'decapitated') {
      ctx.fillStyle = '#f87171';
      ctx.fillText('Decapitated tip: Auxin source removed => Zero curvature', 20, 66);
    } else if (selectedAssay.id === 'opaque_cap') {
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Opaque cap: Light photoreceptors blinded => Straight growth', 20, 66);
    }

  }, [tropismMode, selectedAssay, isClinostatOn, lightAngle, growthTimeHours]);

  // Quiz submission handler
  const handleAnswerSelect = (qId, optionIdx) => {
    if (submittedQuiz) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    let newScore = 0;
    KCSE_TROPISM_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setSubmittedQuiz(true);

    if (typeof onTelemetry === 'function') {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        type: 'PLANT_TROPISMS_QUIZ_COMPLETED',
        score: newScore,
        maxScore: KCSE_TROPISM_QUESTIONS.length,
        percentage: Math.round((newScore / KCSE_TROPISM_QUESTIONS.length) * 100)
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuiz(false);
    setScore(0);
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-3xl p-4 md:p-6 border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Simulation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Plant Tropisms & Auxin Distribution Laboratory
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  KCSE Biology Form 4
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Topic 3: Reception, Response & Coordination in Plants • IAA Lateral Migration, Gravitropism & Clinostat Controls
              </p>
            </div>
          </div>
        </div>

        {/* Experiment Mode Toggle: Phototropism vs Geotropism */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl self-start md:self-auto">
          <button
            onClick={() => {
              setTropismMode('phototropism');
              handleReset();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tropismMode === 'phototropism'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            Phototropism (Light)
          </button>
          <button
            onClick={() => {
              setTropismMode('geotropism');
              handleReset();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tropismMode === 'geotropism'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Geotropism (Gravity)
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Visualization Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative w-full aspect-[16/10] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="w-full h-full object-contain"
            />

            {/* In-Canvas Environmental Sliders */}
            {tropismMode === 'phototropism' && (
              <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl flex flex-col gap-1.5 shadow-lg w-52">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                  <span>Lamp Angle</span>
                  <span className="text-amber-400">{lightAngle}° ({lightAngle < 0 ? 'Left' : lightAngle > 0 ? 'Right' : 'Overhead'})</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  step="5"
                  value={lightAngle}
                  onChange={(e) => setLightAngle(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Clinostat Indicator Badge */}
            <div className="absolute bottom-3 left-3">
              <button
                onClick={() => setIsClinostatOn(!isClinostatOn)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer ${
                  isClinostatOn
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg'
                    : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${isClinostatOn ? 'animate-spin' : ''}`} />
                Clinostat: {isClinostatOn ? 'ON (Rotating)' : 'OFF (Stationary)'}
              </button>
            </div>
          </div>

          {/* Quick Action Bar & Growth Slider */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleRunGrowth}
                disabled={isSimulating}
                className="flex-1 md:flex-initial px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isSimulating ? 'Simulating Growth...' : '1-Click: Grow Seedling (48h)'}
              </button>
              <button
                onClick={handleReset}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
                title="Reset Growth"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Manual growth timeline scrubber */}
            <div className="flex-1 flex items-center gap-3 w-full md:w-auto pl-0 md:pl-4">
              <span className="text-xs text-slate-400 font-bold whitespace-nowrap flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> {growthTimeHours} Hours
              </span>
              <input
                type="range"
                min="0"
                max="48"
                value={growthTimeHours}
                onChange={(e) => setGrowthTimeHours(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Assay Selector & Exam Interpretation (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('controls')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'controls'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Classic Assays
            </button>
            <button
              onClick={() => setActiveTab('cells')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'cells'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Acid-Growth
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-slate-800 text-amber-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              KCSE Quiz
            </button>
          </div>

          {/* TAB 1: Classic Physiological Assay Selector */}
          {activeTab === 'controls' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Tip Manipulation Assays
              </span>
              <p className="text-slate-400 text-[11px]">
                Select classic botanical surgical treatments pioneered by Darwin, Boysen-Jensen, and Went:
              </p>

              <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
                {ASSAYS.map((assay) => {
                  const isSelected = selectedAssay.id === assay.id;
                  return (
                    <button
                      key={assay.id}
                      onClick={() => {
                        setSelectedAssay(assay);
                        handleReset();
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{assay.title}</span>
                        {isSelected && <span className="text-[10px] text-emerald-400 uppercase font-black">Active</span>}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {assay.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Cellular Acid-Growth Mechanism */}
          {activeTab === 'cells' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3.5 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Auxin & Acid-Growth Hypothesis
              </span>
              <p className="text-slate-300 leading-relaxed">
                Auxin (IAA) produces unequal elongation through a distinct molecular pathway:
              </p>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="font-bold text-amber-300 block">1. Lateral Translocation</span>
                  <span className="text-slate-400 text-[11px]">
                    Unilateral light activates PIN proteins that transport IAA laterally from the lit flank to the darker, shaded flank.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="font-bold text-emerald-300 block">2. H⁺ Proton Pumping</span>
                  <span className="text-slate-400 text-[11px]">
                    Higher IAA concentration triggers plasma membrane H⁺-ATPases, pumping protons into the cell wall apoplast (pH drops to ~4.5).
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="font-bold text-sky-300 block">3. Expansin Enzyme Activation</span>
                  <span className="text-slate-400 text-[11px]">
                    Acidic pH activates expansins that loosen hydrogen bonds between cellulose microfibrils. Turgor pressure causes shaded cells to elongate 2.5× faster.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-200 text-[11px]">
                <strong>Root vs. Shoot Sensitivity Paradox:</strong> Roots require 100× to 1000× lower concentrations of auxin than shoots. In horizontal roots, auxin accumulating on the lower side inhibits elongation!
              </div>
            </div>
          )}

          {/* TAB 3: Interactive KCSE Exam Interpretation */}
          {activeTab === 'quiz' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> KCSE Exam Challenge
                </span>
                {submittedQuiz && (
                  <span className="font-bold text-emerald-400">
                    Score: {score} / {KCSE_TROPISM_QUESTIONS.length} ({Math.round((score / KCSE_TROPISM_QUESTIONS.length) * 100)}%)
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
                {KCSE_TROPISM_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col gap-2">
                    <p className="font-bold text-slate-200">
                      {idx + 1}. {q.question}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[q.id] === optIdx;
                        const isCorrect = q.correct === optIdx;
                        let btnStyle = 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700';

                        if (submittedQuiz) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-amber-500/20 border-amber-500 text-amber-300';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswerSelect(q.id, optIdx)}
                            className={`p-2 rounded-lg text-left text-[11px] border transition-all cursor-pointer ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {submittedQuiz && (
                      <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-700/40">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                {!submittedQuiz ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < KCSE_TROPISM_QUESTIONS.length}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-40"
                  >
                    Submit Answers
                  </button>
                ) : (
                  <button
                    onClick={handleResetQuiz}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Retake Challenge
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
