import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  Box,
  CheckCircle2,
  CircleDot,
  Clock,
  ExternalLink,
  Flame,
  FlaskConical,
  HelpCircle,
  Info,
  Layers,
  Maximize2,
  Microscope,
  Minus,
  MoveDown,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingDown,
  TrendingUp,
  XCircle,
  Zap,
} from 'lucide-react';

// ============================================================================
// GRADE 10 KCSE / CBC QUIZ QUESTIONS ON CELL SIZE & SURFACE AREA
// ============================================================================
const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    title: 'Question 1: Geometric Scaling & SA:V Ratio',
    prompt:
      'As a cell increases in diameter while retaining the same geometric shape, what happens to its surface area-to-volume (SA:V) ratio?',
    options: [
      {
        id: 'A',
        text: 'The SA:V ratio decreases because volume increases as the cube of the radius (r³), while surface area increases only as the square (r²).',
        correct: true,
      },
      {
        id: 'B',
        text: 'The SA:V ratio increases because larger cells have more membrane surface to absorb nutrients.',
        correct: false,
      },
      {
        id: 'C',
        text: 'The SA:V ratio remains perfectly constant because surface area and volume grow at equal linear rates.',
        correct: false,
      },
      {
        id: 'D',
        text: 'The SA:V ratio fluctuates randomly depending on the rate of mitochondrial respiration.',
        correct: false,
      },
    ],
    explanation:
      'Surface area increases with the square of linear dimensions (Area ∝ r²), whereas volume increases with the cube (Volume ∝ r³). Consequently, the ratio Area/Volume ∝ 1/r decreases steadily as the cell gets larger.',
  },
  {
    id: 'q2',
    title: 'Question 2: Physical Limits to Diffusion',
    prompt:
      'Why is passive diffusion alone unable to sustain the metabolic requirements of a large hypothetical single-celled organism the size of a tennis ball?',
    options: [
      {
        id: 'A',
        text: 'Diffusion is a fast active transport process that consumes all cellular ATP in giant cells.',
        correct: false,
      },
      {
        id: 'B',
        text: 'Diffusion is an unguided random thermal process; the time required for molecules to diffuse increases with the square of distance, leaving the deep center starved of O₂ and nutrients.',
        correct: true,
      },
      {
        id: 'C',
        text: 'Large cell membranes become completely impermeable to all gases including oxygen and carbon dioxide.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Tennis ball-sized cells produce excessive cell wall cellulose that repels water molecules.',
        correct: false,
      },
    ],
    explanation:
      'According to Fick’s laws, the average time required for a molecule to diffuse over distance x is proportional to x² (t ≈ x²/2D). Over microscopic distances (5–10 µm), diffusion takes fractions of a second, but over centimeters, diffusion would take days or months—causing the cell interior to suffocate and die.',
  },
  {
    id: 'q3',
    title: 'Question 3: Trigger for Mitosis (Cell Division)',
    prompt:
      'How does the decline in the surface area-to-volume ratio act as a physiological trigger for a growing eukaryotic cell to undergo mitosis?',
    options: [
      {
        id: 'A',
        text: 'When the cell grows too large, the membrane cannot transport enough nutrients and eliminate toxic metabolic waste rapidly enough for the large volume of cytoplasm, triggering division into two smaller cells with restored high SA:V.',
        correct: true,
      },
      {
        id: 'B',
        text: 'The cell divides to reduce its chromosome count by half before entering dormancy.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Excessive surface area exerts crushing mechanical tension on the centrosomes.',
        correct: false,
      },
      {
        id: 'D',
        text: 'The cell membrane dissolves completely once the diameter reaches 30 µm.',
        correct: false,
      },
    ],
    explanation:
      'Cell growth creates a critical transport bottleneck: metabolic demand (cytoplasmic volume) outstrips membrane exchange capacity (surface area). Dividing into two daughter cells halves the volume of each cell while restoring a high surface area-to-volume ratio for efficient nutrient and waste exchange.',
  },
  {
    id: 'q4',
    title: 'Question 4: Adaptations to Overcome SA:V Limitations',
    prompt:
      'Which structural modification allows specialized large eukaryotic cells (such as intestinal epithelial cells or motor neurons) to function efficiently despite their large size?',
    options: [
      {
        id: 'A',
        text: 'Folding the membrane into microvilli or elongating into thin, thread-like axons, which greatly maximizes surface area while maintaining a small diffusion distance to any point in the cytoplasm.',
        correct: true,
      },
      {
        id: 'B',
        text: 'Eliminating the cell membrane and replacing it with an open mineral crystalline lattice.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Ceasing cellular respiration completely and functioning without oxygen or glucose.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Expanding into a perfect sphere to minimize frictional contact with extracellular fluid.',
        correct: false,
      },
    ],
    explanation:
      'Specialized cells alter their geometry away from a bulky sphere: intestinal cells fold their apical membrane into microscopic villi/microvilli (expanding surface area up to 600-fold), and neurons elongate into narrow cylindrical axons (radius < 2 µm), keeping internal cytoplasm close to the membrane.',
  },
];

// ============================================================================
// AGAR CUBE EXPERIMENT DATA TABLE (Standard Grade 10 Lab Practical)
// ============================================================================
const AGAR_CUBE_PRESETS = [
  {
    sideCm: 1,
    sideMm: 10,
    surfaceAreaCm2: 6,
    volumeCm3: 1,
    saToVRatio: '6.0 : 1',
    diffusionDepthMm: 3,
    penetratedVolPercent: 93.6,
    unpenetratedCoreVolPercent: 6.4,
    status: 'Nearly Complete Penetration',
    badgeClass: 'bg-emerald-950/70 border-emerald-500 text-emerald-300',
  },
  {
    sideCm: 2,
    sideMm: 20,
    surfaceAreaCm2: 24,
    volumeCm3: 8,
    saToVRatio: '3.0 : 1',
    diffusionDepthMm: 3,
    penetratedVolPercent: 65.7,
    unpenetratedCoreVolPercent: 34.3,
    status: 'Moderate Penetration (Pale Core)',
    badgeClass: 'bg-amber-950/70 border-amber-500 text-amber-300',
  },
  {
    sideCm: 3,
    sideMm: 30,
    surfaceAreaCm2: 54,
    volumeCm3: 27,
    saToVRatio: '2.0 : 1',
    diffusionDepthMm: 3,
    penetratedVolPercent: 48.8,
    unpenetratedCoreVolPercent: 51.2,
    status: 'Poor Penetration (Majority Starved)',
    badgeClass: 'bg-rose-950/70 border-rose-500 text-rose-300',
  },
];

export default function CellSizeSurfaceAreaSim({ config = {}, onTelemetry }) {
  // --------------------------------------------------------------------------
  // Core Interactive Simulation State
  // --------------------------------------------------------------------------
  // Cell diameter in micrometers (µm) - Primary variable control (10 µm to 50 µm)
  const [cellDiameter, setCellDiameter] = useState(10); // baseline: 10 µm
  const [shapeModel, setShapeModel] = useState('sphere'); // 'sphere' | 'cube'
  const [isSimPlaying, setIsSimPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [showParticleTrails, setShowParticleTrails] = useState(true);
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'adaptations' | 'agar_lab' | 'quiz'

  // Telemetry exploration checkpoints
  const [hasExploredSmall, setHasExploredSmall] = useState(false);
  const [hasExploredLarge, setHasExploredLarge] = useState(false);
  const checkpointEmittedRef = useRef(false);

  // Quiz state
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  // Canvas ref
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Fixed physical diffusion penetration depth in realistic biological conditions
  // At normal physiological diffusion rates over a standard metabolic cycle,
  // oxygen and glucose can rapidly penetrate roughly 7.5 µm inward from the membrane.
  const DIFFUSION_PENETRATION_DEPTH_UM = 7.5;

  // --------------------------------------------------------------------------
  // Mathematical Calculations: SA, Volume, Ratio, Starved Core
  // --------------------------------------------------------------------------
  const metrics = useMemo(() => {
    const d = cellDiameter;
    const r = d / 2;

    let surfaceArea = 0;
    let volume = 0;
    let saToVRatio = 0;
    let nourishedVolPercent = 100;
    let starvedVolPercent = 0;
    let unreachedRadius = 0;

    if (shapeModel === 'sphere') {
      // Sphere: SA = 4 * π * r² = π * d²
      surfaceArea = Math.PI * Math.pow(d, 2);
      // Volume = 4/3 * π * r³ = 1/6 * π * d³
      volume = (4 / 3) * Math.PI * Math.pow(r, 3);
      // SA:V = 3 / r = 6 / d
      saToVRatio = 3 / r;

      if (r <= DIFFUSION_PENETRATION_DEPTH_UM) {
        nourishedVolPercent = 100;
        starvedVolPercent = 0;
        unreachedRadius = 0;
      } else {
        unreachedRadius = r - DIFFUSION_PENETRATION_DEPTH_UM;
        const coreVol = (4 / 3) * Math.PI * Math.pow(unreachedRadius, 3);
        starvedVolPercent = Math.min(100, Math.max(0, (coreVol / volume) * 100));
        nourishedVolPercent = Math.max(0, 100 - starvedVolPercent);
      }
    } else {
      // Cube model: side s = d
      surfaceArea = 6 * Math.pow(d, 2);
      volume = Math.pow(d, 3);
      saToVRatio = 6 / d;

      const penetration = DIFFUSION_PENETRATION_DEPTH_UM;
      if (d <= 2 * penetration) {
        nourishedVolPercent = 100;
        starvedVolPercent = 0;
        unreachedRadius = 0;
      } else {
        const unreachedSide = d - 2 * penetration;
        const coreVol = Math.pow(unreachedSide, 3);
        starvedVolPercent = Math.min(100, Math.max(0, (coreVol / volume) * 100));
        nourishedVolPercent = Math.max(0, 100 - starvedVolPercent);
        unreachedRadius = unreachedSide / 2;
      }
    }

    // Qualitative Biological Classification
    let statusTitle = 'Rapid & Efficient Exchange';
    let statusDesc = '100% of internal organelles receive oxygen & glucose rapidly. Homeostasis maintained.';
    let statusColor = 'text-emerald-400';
    let badgeBg = 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300';
    let cellHealth = 'Optimal';

    if (d >= 40) {
      statusTitle = 'Slow & Inefficient Exchange';
      statusDesc = 'Critical transport bottleneck! The central core is diffusion starved. Mitosis required!';
      statusColor = 'text-rose-400';
      badgeBg = 'bg-rose-950/60 border-rose-500/50 text-rose-300';
      cellHealth = 'Critical Starvation';
    } else if (d >= 22) {
      statusTitle = 'Moderate / Borderline Exchange';
      statusDesc = 'Periphery receives nutrients, but deep central cytoplasm experiences metabolic delay.';
      statusColor = 'text-amber-400';
      badgeBg = 'bg-amber-950/60 border-amber-500/50 text-amber-300';
      cellHealth = 'Borderline';
    }

    return {
      diameter: d,
      radius: r,
      surfaceArea: Math.round(surfaceArea),
      volume: Math.round(volume),
      saToVRatio: saToVRatio.toFixed(3),
      normalizedRatioStr: (saToVRatio * 10).toFixed(1) + ' : 10',
      nourishedVolPercent: Math.round(nourishedVolPercent),
      starvedVolPercent: Math.round(starvedVolPercent),
      unreachedRadius: unreachedRadius.toFixed(1),
      statusTitle,
      statusDesc,
      statusColor,
      badgeBg,
      cellHealth,
    };
  }, [cellDiameter, shapeModel]);

  // --------------------------------------------------------------------------
  // Telemetry Emission Handler
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (cellDiameter <= 15) {
      setHasExploredSmall(true);
    }
    if (cellDiameter >= 45) {
      setHasExploredLarge(true);
    }
  }, [cellDiameter]);

  useEffect(() => {
    if (hasExploredSmall && hasExploredLarge && !checkpointEmittedRef.current) {
      checkpointEmittedRef.current = true;
      if (typeof onTelemetry === 'function') {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'cell_size_surface_area',
          checkpoint: 'cell_size_comparison_tested',
          smallCellTested: true,
          largeCellTested: true,
          currentDiameter: cellDiameter,
          saToVRatio: metrics.saToVRatio,
          starvedVolPercent: metrics.starvedVolPercent,
          timestamp: Date.now(),
        });
      }
    }
  }, [hasExploredSmall, hasExploredLarge, cellDiameter, metrics, onTelemetry]);

  // Reset function to 10 µm baseline
  const handleReset = useCallback(() => {
    setCellDiameter(10);
    setIsSimPlaying(true);
    setSimSpeed(1);
    if (typeof onTelemetry === 'function') {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'cell_size_surface_area',
        action: 'reset_to_baseline',
        cellDiameter: 10,
      });
    }
  }, [onTelemetry]);

  // Quick preset selector
  const handleSelectPreset = (size) => {
    setCellDiameter(size);
  };

  // --------------------------------------------------------------------------
  // Particle System Simulation on HTML5 Canvas
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Initialize particle pool (molecules of O2 and glucose diffusing)
    const particleCount = 140;
    const initialParticles = [];
    for (let i = 0; i < particleCount; i++) {
      initialParticles.push({
        id: i,
        // Angle around the cell membrane
        angle: Math.random() * Math.PI * 2,
        // Penetration depth normalized from 0 (at membrane) to 1 (at max diffusion depth)
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.005,
        size: 1.5 + Math.random() * 2.2,
        color: Math.random() > 0.4 ? '#38bdf8' : '#34d399', // cyan O2 or emerald glucose
        wobbleOffset: Math.random() * 10,
      });
    }
    particlesRef.current = initialParticles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationTime = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Dark bio-laboratory microscope backdrop
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, width / 2);
      bgGrad.addColorStop(0, '#0a101f');
      bgGrad.addColorStop(0.7, '#050811');
      bgGrad.addColorStop(1, '#020408');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle microscope reticle / grid circles
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      for (let rad = 50; rad < width / 2; rad += 45) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, rad, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Microscopic crosshairs
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.beginPath();
      ctx.moveTo(centerX, 15);
      ctx.lineTo(centerX, height - 15);
      ctx.moveTo(15, centerY);
      ctx.lineTo(width - 15, centerY);
      ctx.stroke();

      // Determine on-screen pixel radius based on cellDiameter
      // Scale: 10 µm -> 45px radius, 50 µm -> 175px radius
      const minUm = 10;
      const maxUm = 50;
      const minRadiusPx = 45;
      const maxRadiusPx = Math.min(width, height) * 0.42; // ~175px
      const radiusPx =
        minRadiusPx + ((cellDiameter - minUm) / (maxUm - minUm)) * (maxRadiusPx - minRadiusPx);

      // Physical diffusion penetration depth in pixels
      const penetrationPx = radiusPx * (DIFFUSION_PENETRATION_DEPTH_UM / (cellDiameter / 2));
      const effectivePenetrationPx = Math.min(radiusPx, penetrationPx);
      const starvedCoreRadiusPx = Math.max(0, radiusPx - effectivePenetrationPx);

      // Draw Extracellular Nutrient Flow Field (Floating particles outside the cell)
      const numExtracellular = 28;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      for (let e = 0; e < numExtracellular; e++) {
        const extAngle = (e / numExtracellular) * Math.PI * 2 + animationTime * 0.1;
        const extDist = radiusPx + 22 + (Math.sin(e + animationTime) * 12);
        const ex = centerX + Math.cos(extAngle) * extDist;
        const ey = centerY + Math.sin(extAngle) * extDist;
        ctx.beginPath();
        ctx.arc(ex, ey, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      if (shapeModel === 'sphere') {
        // --------------------------------------------------------------------
        // SPHERICAL CELL RENDERING
        // --------------------------------------------------------------------

        // 1. Overall Cell Cytoplasm Outer Body
        const cellGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          starvedCoreRadiusPx,
          centerX,
          centerY,
          radiusPx
        );

        if (starvedCoreRadiusPx > 0) {
          // Large or Medium cell with starved core
          cellGrad.addColorStop(0, 'rgba(239, 68, 68, 0.22)'); // Pale starved hypoxic red/grey core
          cellGrad.addColorStop(starvedCoreRadiusPx / radiusPx, 'rgba(245, 158, 11, 0.35)'); // Transition zone
          cellGrad.addColorStop(1, 'rgba(16, 185, 129, 0.45)'); // Healthy nourished outer cortex
        } else {
          // Small cell: 100% nourished vibrant emerald/cyan cytoplasm
          cellGrad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
          cellGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.50)');
          cellGrad.addColorStop(1, 'rgba(5, 150, 105, 0.40)');
        }

        ctx.fillStyle = cellGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radiusPx, 0, Math.PI * 2);
        ctx.fill();

        // 2. Starved Central Core Hazard Zone (if present)
        if (starvedCoreRadiusPx > 4) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, starvedCoreRadiusPx, 0, Math.PI * 2);
          ctx.clip();

          // Hypoxic Core background
          ctx.fillStyle = 'rgba(127, 29, 29, 0.40)';
          ctx.fillRect(centerX - radiusPx, centerY - radiusPx, radiusPx * 2, radiusPx * 2);

          // Diagonal warning hatch lines
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.18)';
          ctx.lineWidth = 1.5;
          for (let x = -radiusPx * 2; x < radiusPx * 2; x += 14) {
            ctx.beginPath();
            ctx.moveTo(centerX + x, centerY - radiusPx);
            ctx.lineTo(centerX + x + radiusPx * 2, centerY + radiusPx);
            ctx.stroke();
          }
          ctx.restore();

          // Pulsing Starved Boundary Ring
          const pulse = Math.sin(animationTime * 3) * 0.2 + 0.8;
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.7 * pulse})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.arc(centerX, centerY, starvedCoreRadiusPx, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // 3. Central Nucleus
        const nucleusRadius = Math.max(12, radiusPx * 0.22);
        const isNucleusStarved = starvedCoreRadiusPx >= nucleusRadius;

        const nucleusGrad = ctx.createRadialGradient(
          centerX - nucleusRadius * 0.2,
          centerY - nucleusRadius * 0.2,
          2,
          centerX,
          centerY,
          nucleusRadius
        );

        if (isNucleusStarved) {
          // Hypoxic / Starved Nucleus (Dark grey-purple / warning red)
          nucleusGrad.addColorStop(0, '#f87171');
          nucleusGrad.addColorStop(0.5, '#7f1d1d');
          nucleusGrad.addColorStop(1, '#450a0a');
        } else {
          // Healthy nourished Nucleus (Deep vibrant violet-blue)
          nucleusGrad.addColorStop(0, '#93c5fd');
          nucleusGrad.addColorStop(0.5, '#3b82f6');
          nucleusGrad.addColorStop(1, '#1e3a8a');
        }

        ctx.fillStyle = nucleusGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
        ctx.fill();

        // Nucleolus inside nucleus
        ctx.fillStyle = isNucleusStarved ? '#fca5a5' : '#bfdbfe';
        ctx.beginPath();
        ctx.arc(
          centerX - nucleusRadius * 0.25,
          centerY - nucleusRadius * 0.2,
          nucleusRadius * 0.3,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Nuclear membrane outline
        ctx.strokeStyle = isNucleusStarved ? '#ef4444' : '#60a5fa';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
        ctx.stroke();

        // 4. Inward Diffusing Nutrient Particles (O2 & Glucose)
        if (particlesRef.current && particlesRef.current.length > 0) {
          particlesRef.current.forEach((p) => {
            if (isSimPlaying) {
              p.progress += p.speed * simSpeed;
              if (p.progress >= 1) {
                p.progress = 0;
                p.angle = Math.random() * Math.PI * 2;
              }
            }

            // Calculate radial distance from center
            // At progress 0: at the membrane (radiusPx)
            // At progress 1: at the limit of diffusion penetration (radiusPx - effectivePenetrationPx)
            const currentDist = radiusPx - p.progress * effectivePenetrationPx;
            const wobble = Math.sin(animationTime * 4 + p.wobbleOffset) * 0.04;
            const currentAngle = p.angle + wobble;

            const px = centerX + Math.cos(currentAngle) * currentDist;
            const py = centerY + Math.sin(currentAngle) * currentDist;

            // Nutrient fade as it is metabolized inward
            const alpha = 0.95 - p.progress * 0.65;

            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fill();

            if (showParticleTrails && p.progress > 0.08) {
              const trailDist = currentDist + 5;
              const tx = centerX + Math.cos(currentAngle) * trailDist;
              const ty = centerY + Math.sin(currentAngle) * trailDist;
              ctx.strokeStyle = p.color;
              ctx.lineWidth = 1;
              ctx.globalAlpha = alpha * 0.35;
              ctx.beginPath();
              ctx.moveTo(tx, ty);
              ctx.lineTo(px, py);
              ctx.stroke();
            }
          });
          ctx.globalAlpha = 1.0;
        }

        // 5. Plasma Membrane (Outer Boundary Ring)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radiusPx, 0, Math.PI * 2);
        ctx.stroke();

        // Membrane Phospholipid Bilayer Glow
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radiusPx, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // --------------------------------------------------------------------
        // CUBOIDAL MODEL RENDERING (Standard KCSE Agar Cube Simulation)
        // --------------------------------------------------------------------
        const halfSide = radiusPx;
        const left = centerX - halfSide;
        const top = centerY - halfSide;
        const side = halfSide * 2;

        const innerHalfSide = Math.max(0, halfSide - effectivePenetrationPx);

        // Outer agar block / cell cytoplasm
        ctx.fillStyle = 'rgba(16, 185, 129, 0.40)';
        ctx.fillRect(left, top, side, side);

        // Starved Unreached Core
        if (innerHalfSide > 4) {
          const innerLeft = centerX - innerHalfSide;
          const innerTop = centerY - innerHalfSide;
          const innerSide = innerHalfSide * 2;

          ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
          ctx.fillRect(innerLeft, innerTop, innerSide, innerSide);

          // Diagonal hatch lines
          ctx.save();
          ctx.beginPath();
          ctx.rect(innerLeft, innerTop, innerSide, innerSide);
          ctx.clip();
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
          ctx.lineWidth = 1.5;
          for (let x = -side; x < side * 2; x += 14) {
            ctx.beginPath();
            ctx.moveTo(innerLeft + x, innerTop);
            ctx.lineTo(innerLeft + x + innerSide, innerTop + innerSide);
            ctx.stroke();
          }
          ctx.restore();

          // Boundary dashed ring
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(innerLeft, innerTop, innerSide, innerSide);
          ctx.setLineDash([]);
        }

        // Membrane / Outer wall
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.strokeRect(left, top, side, side);
      }

      // ----------------------------------------------------------------------
      // In-Canvas Biological Annotations & Measurement Callouts
      // ----------------------------------------------------------------------
      // Callout: Diffusion Penetration Depth bracket on right side
      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';

      // Scale bar line indicator
      const barY = height - 26;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(25, barY);
      ctx.lineTo(85, barY);
      ctx.moveTo(25, barY - 4);
      ctx.lineTo(25, barY + 4);
      ctx.moveTo(85, barY - 4);
      ctx.lineTo(85, barY + 4);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Scale: 10 µm', 25, barY - 8);

      // Warning Flag for Large Starved Cell
      if (starvedCoreRadiusPx > 18) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ DIFFUSION STARVED CORE', centerX, centerY + radiusPx * 0.58);
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('Hypoxic Central Necrosis Risk', centerX, centerY + radiusPx * 0.58 + 15);
      } else if (starvedCoreRadiusPx === 0) {
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✓ 100% NOURISHED INTERIOR', centerX, centerY + radiusPx + 22);
      }

      if (isSimPlaying) {
        animationTime += 0.018 * simSpeed;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    cellDiameter,
    shapeModel,
    isSimPlaying,
    simSpeed,
    showParticleTrails,
    DIFFUSION_PENETRATION_DEPTH_UM,
  ]);

  // --------------------------------------------------------------------------
  // Quiz Actions
  // --------------------------------------------------------------------------
  const handleSelectOption = (qId, optId) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optId }));
    setShowFeedback(true);
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      const selected = userAnswers[q.id];
      const correct = q.options.find((o) => o.correct)?.id;
      if (selected === correct) score += 1;
    });
    setQuizScore(score);

    if (typeof onTelemetry === 'function') {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'cell_size_surface_area',
        action: 'quiz_submitted',
        score,
        total: QUIZ_QUESTIONS.length,
      });
    }
  };

  // --------------------------------------------------------------------------
  // JSX Layout
  // --------------------------------------------------------------------------
  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col p-3 md:p-6 font-sans">
      {/* ==================================================================== */}
      {/* HEADER BAR                                                           */}
      {/* ==================================================================== */}
      <header className="w-full max-w-7xl mx-auto mb-4 bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white shrink-0">
            <Microscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                Grade 10 Biology • Topic 1
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                Cell Biology & Biodiversity
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white mt-0.5">
              Cell Size & Surface Area to Volume Ratio
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Observe how geometric scaling limits nutrient diffusion and explains why cells remain microscopic.
            </p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer hover:border-slate-500 shadow-sm active:scale-95"
            title="Reset to 10 µm small cell baseline"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Baseline (10 µm)</span>
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* TOP NAVIGATION TABS                                                  */}
      {/* ==================================================================== */}
      <nav className="w-full max-w-7xl mx-auto mb-4 flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'simulation', label: 'Interactive Diffusion Lab', icon: Microscope },
          { id: 'adaptations', label: 'Biological Adaptations & Mitosis', icon: Sparkles },
          { id: 'agar_lab', label: 'KCSE Agar Cube Practical', icon: FlaskConical },
          { id: 'quiz', label: 'Concept Mastery Quiz', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ==================================================================== */}
      {/* TAB CONTENT 1: MAIN INTERACTIVE SIMULATION                           */}
      {/* ==================================================================== */}
      {activeTab === 'simulation' && (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* LEFT 7 COLUMNS: CANVAS VIEWPORT & VISUAL OBSERVATION */}
          <div className="lg:col-span-7 flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
            {/* Viewport Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-200">
                  Microscopic Cross-Section View (Physical Diffusion Front)
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShapeModel(shapeModel === 'sphere' ? 'cube' : 'sphere')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-all"
                  title="Toggle between spherical cell and cuboidal model"
                >
                  {shapeModel === 'sphere' ? (
                    <>
                      <CircleDot className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Spherical Cell</span>
                    </>
                  ) : (
                    <>
                      <Box className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cuboidal Block</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsSimPlaying(!isSimPlaying)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                  title={isSimPlaying ? 'Pause diffusion animation' : 'Play diffusion animation'}
                >
                  {isSimPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="relative flex-1 min-h-[380px] md:min-h-[440px] rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={560}
                height={420}
                className="w-full h-full object-contain"
              />

              {/* In-Canvas Biological Badge Overlay */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 backdrop-blur-md ${metrics.badgeBg}`}>
                  {metrics.starvedVolPercent > 0 ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span>{metrics.statusTitle}</span>
                </div>
                <div className="px-2 py-0.5 rounded-md bg-slate-900/85 border border-slate-700/60 text-[10px] text-slate-300 font-mono">
                  Diffusive Penetration Depth: <span className="text-cyan-400 font-bold">{DIFFUSION_PENETRATION_DEPTH_UM} µm</span>
                </div>
              </div>

              {/* Legend Callout in Canvas bottom right */}
              <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-xl p-2 text-[10px] text-slate-300 space-y-1 shadow-lg pointer-events-none">
                <div className="font-semibold text-slate-400 pb-0.5 border-b border-slate-800">Key Markers</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Nourished Cytoplasm (O₂ & Glucose)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Starved / Hypoxic Core</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Cell Nucleus & Genome</span>
                </div>
              </div>
            </div>

            {/* Quick Presets & Playback Bar */}
            <div className="mt-3 flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Quick Presets:</span>
                <button
                  onClick={() => handleSelectPreset(10)}
                  className={`px-2.5 py-1 rounded-lg font-semibold border transition-all ${
                    cellDiameter === 10
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Small (10 µm)
                </button>
                <button
                  onClick={() => handleSelectPreset(25)}
                  className={`px-2.5 py-1 rounded-lg font-semibold border transition-all ${
                    cellDiameter === 25
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Medium (25 µm)
                </button>
                <button
                  onClick={() => handleSelectPreset(50)}
                  className={`px-2.5 py-1 rounded-lg font-semibold border transition-all ${
                    cellDiameter === 50
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Large (50 µm)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Trails:</span>
                <button
                  onClick={() => setShowParticleTrails(!showParticleTrails)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                    showParticleTrails
                      ? 'bg-cyan-950 border-cyan-600 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {showParticleTrails ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: CONTROLS, METRICS & BIOLOGICAL CONSEQUENCE */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* CARD 1: PRIMARY VARIABLE CONTROL (Cell Diameter Slider) */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Variable Control: Cell Diameter</h3>
                </div>
                <span className="font-mono text-base font-black text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-lg border border-cyan-800/80">
                  {cellDiameter} µm
                </span>
              </div>

              {/* Slider Component */}
              <div className="space-y-2 my-3">
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={cellDiameter}
                  onChange={(e) => setCellDiameter(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>10 µm (Small / RBC)</span>
                  <span>25 µm (Epithelial)</span>
                  <span>50 µm (Giant / Pre-Mitosis)</span>
                </div>
              </div>

              {/* Visual Step Guide Callout */}
              <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Drag the slider from <strong className="text-emerald-400">10 µm</strong> to <strong className="text-rose-400">50 µm</strong>. Observe how rapidly the inner red starved zone expands as the cell grows!
                </p>
              </div>
            </div>

            {/* CARD 2: ESSENTIAL METRIC READOUTS */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Geometric Scaling Readout
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {shapeModel === 'sphere' ? 'Sphere: 4πr² / (⁴⁄₃πr³)' : 'Cube: 6s² / s³'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Surface Area */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80">
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                    Surface Area (Membrane)
                  </div>
                  <div className="text-lg font-black font-mono text-cyan-400 mt-0.5">
                    {metrics.surfaceArea.toLocaleString()} <span className="text-xs font-normal text-slate-400">µm²</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {shapeModel === 'sphere' ? 'Formula: πd²' : 'Formula: 6s²'}
                  </div>
                </div>

                {/* Volume */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80">
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                    Volume (Cytoplasm)
                  </div>
                  <div className="text-lg font-black font-mono text-indigo-400 mt-0.5">
                    {metrics.volume.toLocaleString()} <span className="text-xs font-normal text-slate-400">µm³</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {shapeModel === 'sphere' ? 'Formula: ⅙πd³' : 'Formula: s³'}
                  </div>
                </div>
              </div>

              {/* Surface Area to Volume Ratio Master Stat */}
              <div className="mt-3 bg-slate-950 rounded-xl p-3.5 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-300">Surface Area-to-Volume Ratio (SA:V)</span>
                  <span className="font-mono text-sm font-black text-amber-400">
                    {metrics.saToVRatio} µm⁻¹
                  </span>
                </div>

                {/* Qualitative Badge Bar */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-300 ${
                      cellDiameter <= 18
                        ? 'bg-emerald-400'
                        : cellDiameter <= 32
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(10, (Number(metrics.saToVRatio) / 0.6) * 100))}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Relative Ratio:</span>
                  <span className="font-mono font-bold text-slate-200">{metrics.normalizedRatioStr}</span>
                </div>
              </div>

              {/* Cytoplasmic Nourishment Meter */}
              <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Nourished Cytoplasm Volume:</span>
                  <span className={`font-mono font-bold ${metrics.nourishedVolPercent === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {metrics.nourishedVolPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${metrics.nourishedVolPercent}%` }}
                    title="Nourished Volume"
                  />
                  <div
                    className="bg-rose-500 h-full transition-all duration-300"
                    style={{ width: `${metrics.starvedVolPercent}%` }}
                    title="Diffusion Starved Volume"
                  />
                </div>
                {metrics.starvedVolPercent > 0 && (
                  <div className="flex items-center justify-between text-[11px] text-rose-400 font-mono pt-0.5">
                    <span>Starved Core Volume:</span>
                    <span>{metrics.starvedVolPercent}% ({metrics.unreachedRadius} µm radius unreached)</span>
                  </div>
                )}
              </div>
            </div>

            {/* CARD 3: BIOLOGICAL CONSEQUENCE CALLOUT (Observe -> Interact -> Consequence) */}
            <div className={`rounded-2xl border p-4 shadow-xl transition-all ${
              cellDiameter >= 35
                ? 'bg-rose-950/40 border-rose-500/60 text-rose-100'
                : cellDiameter >= 20
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-100'
                : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                {cellDiameter >= 35 ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                ) : cellDiameter >= 20 ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <h4 className="font-bold text-sm tracking-tight">
                  Biological Consequence: {metrics.cellHealth}
                </h4>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {metrics.statusDesc}
              </p>

              {cellDiameter >= 35 ? (
                <div className="mt-3 pt-2.5 border-t border-rose-800/50 flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-300">Mandatory Cell Response:</span>
                  <span className="font-bold text-white bg-rose-900/80 px-2 py-0.5 rounded-md border border-rose-700">
                    Triggers Mitosis (Cell Division)
                  </span>
                </div>
              ) : (
                <div className="mt-3 pt-2.5 border-t border-emerald-800/50 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-300">Diffusion Efficiency:</span>
                  <span className="font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-700">
                    Adequate for Baseline Respiration
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB CONTENT 2: BIOLOGICAL ADAPTATIONS & MITOSIS                      */}
      {/* ==================================================================== */}
      {activeTab === 'adaptations' && (
        <div className="w-full max-w-7xl mx-auto space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              How Specialized Cells Overcome the Surface Area Constraint
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              Spherical geometry yields the minimum possible surface area for a given volume. When cells cannot remain small (under 20 µm), evolutionary natural selection favors dramatic structural adaptations that maximize surface area without increasing diffusion distance to the deep cytoplasm.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              {/* Adaptation 1: Mitosis */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold mb-3">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Mitosis & Cell Division</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Rather than growing infinitely, once a somatic cell reaches a critical volume threshold, DNA replication and mitosis split it into two identical daughter cells, instantly restoring a high SA:V ratio.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-400 font-medium">
                  Example: Cleaving zygotes & meristematic cells
                </div>
              </div>

              {/* Adaptation 2: Membrane Folding */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold mb-3">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Membrane Folding (Microvilli)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Extensive microscopic folds on the plasma membrane multiply surface area by 20 to 600 times without expanding cell diameter or total internal cytoplasmic depth.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-emerald-400 font-medium">
                  Example: Small intestine ileum & kidney tubule nephrons
                </div>
              </div>

              {/* Adaptation 3: Flattening */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400 font-bold mb-3">
                    3
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Flattening (Biconcave Discs)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    By indenting both sides and discarding the nucleus, red blood cells (erythrocytes) become extremely thin discs (2 µm thick), ensuring oxygen diffuses into hemoglobin in milliseconds.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-rose-400 font-medium">
                  Example: Mammalian Erythrocytes (RBCs)
                </div>
              </div>

              {/* Adaptation 4: Elongation */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 font-bold mb-3">
                    4
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Narrow Elongation (Axons)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Motor neurons can be over 1 meter long, yet remain microscopic in diameter (1–10 µm). Their cylindrical profile keeps every volume element close to the surrounding capillary bed.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-purple-400 font-medium">
                  Example: Sciatic nerve motor axons & plant root hair cells
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB CONTENT 3: KCSE AGAR CUBE EXPERIMENT (School Lab Model)          */}
      {/* ==================================================================== */}
      {activeTab === 'agar_lab' && (
        <div className="w-full max-w-7xl mx-auto space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-cyan-400" />
                  KCSE Biology Lab Practical: The Phenolphthalein Agar Cube Model
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  In secondary biology practicals, students cut agar cubes infused with phenolphthalein indicator and immerse them in 0.1M hydrochloric acid (or NaOH) for 10 minutes to measure penetration depth.
                </p>
              </div>
            </div>

            {/* Comparison Data Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase bg-slate-950/60">
                    <th className="p-3">Cube Side</th>
                    <th className="p-3">Surface Area (6s²)</th>
                    <th className="p-3">Volume (s³)</th>
                    <th className="p-3">SA:V Ratio</th>
                    <th className="p-3">Acid Penetration Depth</th>
                    <th className="p-3">% Penetrated (Nourished)</th>
                    <th className="p-3">% Unpenetrated Core (Starved)</th>
                    <th className="p-3">Practical Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {AGAR_CUBE_PRESETS.map((cube) => (
                    <tr key={cube.sideCm} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white">
                        {cube.sideCm} cm ({cube.sideMm} mm)
                      </td>
                      <td className="p-3 text-cyan-300">{cube.surfaceAreaCm2} cm²</td>
                      <td className="p-3 text-indigo-300">{cube.volumeCm3} cm³</td>
                      <td className="p-3 font-bold text-amber-400">{cube.saToVRatio}</td>
                      <td className="p-3 text-slate-300">{cube.diffusionDepthMm} mm inward</td>
                      <td className="p-3 text-emerald-400 font-bold">{cube.penetratedVolPercent}%</td>
                      <td className="p-3 text-rose-400 font-bold">{cube.unpenetratedCoreVolPercent}%</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] ${cube.badgeClass}`}>
                          {cube.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* KCSE Lab Practical Takeaway Box */}
            <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-800/70 text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-200">
                  KCSE Biology Key Takeaway for Paper 3 (Practicals):
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Notice that the <strong className="text-cyan-300">diffusion distance (3 mm)</strong> is identical for all three cubes because diffusion rate depends purely on temperature, molecular mass, and concentration gradient. However, because the 3 cm cube has a much smaller SA:V ratio (2:1 vs 6:1), over 51% of its interior remains completely unreached by the diffusing acid. This proves conclusively that large cells cannot survive by diffusion alone!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB CONTENT 4: CONCEPT MASTERY QUIZ                                  */}
      {/* ==================================================================== */}
      {activeTab === 'quiz' && (
        <div className="w-full max-w-4xl mx-auto space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
            {/* Quiz Navigation Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white">
                  Grade 10 Cell Biology Exam Questions ({activeQuestionIdx + 1} of {QUIZ_QUESTIONS.length})
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                {QUIZ_QUESTIONS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveQuestionIdx(idx);
                      setShowFeedback(userAnswers[QUIZ_QUESTIONS[idx].id] !== undefined);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all border ${
                      activeQuestionIdx === idx
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : userAnswers[QUIZ_QUESTIONS[idx].id]
                        ? 'bg-slate-800 text-emerald-400 border-emerald-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Question */}
            {(() => {
              const currentQ = QUIZ_QUESTIONS[activeQuestionIdx];
              const answeredOptId = userAnswers[currentQ.id];
              const isCorrect = currentQ.options.find((o) => o.id === answeredOptId)?.correct;

              return (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                      {currentQ.title}
                    </span>
                    <h3 className="text-sm md:text-base font-bold text-slate-100 mt-1 leading-snug">
                      {currentQ.prompt}
                    </h3>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5">
                    {currentQ.options.map((opt) => {
                      const isChosen = answeredOptId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(currentQ.id, opt.id)}
                          className={`w-full p-3 rounded-xl text-left text-xs md:text-sm transition-all border cursor-pointer flex items-start gap-3 ${
                            isChosen
                              ? opt.correct
                                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-md'
                                : 'bg-rose-950/70 border-rose-500 text-rose-100 shadow-md'
                              : showFeedback && opt.correct
                              ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200'
                              : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                              isChosen
                                ? opt.correct
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-rose-500 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="leading-relaxed">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {showFeedback && answeredOptId && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1.5 animate-fadeIn ${
                        isCorrect
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                          : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Correct! Outstanding biological reasoning.</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>Incorrect. Review the biological principle below:</span>
                          </>
                        )}
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{currentQ.explanation}</p>
                    </div>
                  )}

                  {/* Question Bottom Action */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      disabled={activeQuestionIdx === 0}
                      onClick={() => {
                        setActiveQuestionIdx((prev) => prev - 1);
                        setShowFeedback(userAnswers[QUIZ_QUESTIONS[activeQuestionIdx - 1].id] !== undefined);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-300 border border-slate-700 transition-all"
                    >
                      Previous
                    </button>

                    {activeQuestionIdx < QUIZ_QUESTIONS.length - 1 ? (
                      <button
                        onClick={() => {
                          setActiveQuestionIdx((prev) => prev + 1);
                          setShowFeedback(userAnswers[QUIZ_QUESTIONS[activeQuestionIdx + 1].id] !== undefined);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-all shadow-md flex items-center gap-1"
                      >
                        <span>Next Question</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={calculateScore}
                        className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
                      >
                        Submit Final Quiz
                      </button>
                    )}
                  </div>

                  {quizScore !== null && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/50 flex items-center justify-between">
                      <span className="text-xs text-slate-300">
                        Final Score: <strong className="text-emerald-400 font-mono text-sm">{quizScore} / {QUIZ_QUESTIONS.length}</strong> ({Math.round((quizScore / QUIZ_QUESTIONS.length) * 100)}%)
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-400">
                        {quizScore === QUIZ_QUESTIONS.length ? 'Mastery Achieved! 🏆' : 'Good effort! Review missed questions.'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
