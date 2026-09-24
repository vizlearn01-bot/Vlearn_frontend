import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sprout,
  Droplets,
  Sun,
  Wind,
  Layers,
  Activity,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sliders,
  Eye,
  Info,
  Clock,
  Sparkles,
  Maximize2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

// ============================================================================
// KCSE EXAM QUESTIONS FOR PLANT SUPPORT & TURGOR
// ============================================================================
const KCSE_QUESTIONS = [
  {
    id: 'q1',
    title: 'KCSE Biology Paper 1: Support in Herbaceous Plants',
    prompt:
      'Explain how parenchyma cells provide mechanical support to non-woody (herbaceous) stems.',
    options: [
      {
        id: 'A',
        text: 'Water uptake by osmosis creates high vacuolar turgor pressure pressing against rigid, slightly elastic cellulose cell walls, making cells turgid and packed closely together.',
        correct: true,
      },
      {
        id: 'B',
        text: 'Parenchyma cells deposit heavy concentric rings of impermeable suberin, locking the stem rigid.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Parenchyma cells lose all cytoplasm upon maturation to form hollow, continuous capillary pipes.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Secondary growth produces thick bark around herbaceous stems, replacing osmotic turgor.',
        correct: false,
      },
    ],
    explanation:
      'In herbaceous plants that lack woody secondary tissues, mechanical rigidity is entirely dependent on turgor pressure. When soil water is plentiful, water enters vacuoles by osmosis, building internal hydrostatic pressure (turgor pressure) against the cell wall. Firm, closely packed turgid cells keep the stem upright.',
  },
  {
    id: 'q2',
    title: 'KCSE Biology Paper 2: Sclerenchyma vs Collenchyma',
    prompt:
      'How does the structural modification of sclerenchyma tissue differ from that of collenchyma tissue in providing mechanical support in dicotyledonous plants?',
    options: [
      {
        id: 'A',
        text: 'Sclerenchyma cells possess dead, uniformly lignified secondary cell walls providing non-living rigid strength, while collenchyma consists of living cells with localized angular cellulose and pectin thickenings.',
        correct: true,
      },
      {
        id: 'B',
        text: 'Collenchyma cells are completely dead at maturity with hollow lumens, while sclerenchyma cells remain actively dividing.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Sclerenchyma occurs only in leaves to store water, whereas collenchyma forms xylem tracheids.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Both tissues lack cell walls and rely exclusively on intracellular hydrostatic pressure for stiffness.',
        correct: false,
      },
    ],
    explanation:
      'Collenchyma tissue consists of living, elongated cells with irregular, localized thickenings of cellulose and pectin (especially at corners/angles), providing flexible support to growing stems and petioles. Sclerenchyma consists of dead cells with uniformly thickened, heavily lignified secondary walls (fibers and sclereids) providing rigid mechanical strength to mature organs.',
  },
  {
    id: 'q3',
    title: 'KCSE Biology: Midday Wilting Phenomenon',
    prompt:
      'On a hot, sunny, and windy afternoon, a herbaceous plant wilts even when the soil is moderately moist. What is the physiological cause of this temporary midday wilting?',
    options: [
      {
        id: 'A',
        text: 'The rate of water loss through transpiration exceeds the rate of water absorption by roots, causing leaf cells to lose turgor and become flaccid.',
        correct: true,
      },
      {
        id: 'B',
        text: 'High solar radiation directly denatures all lignin in the sclerenchyma fibers of the vascular bundle.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Roots actively excrete water into the soil via reverse active transport to prevent overheating.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Phloem translocation completely halts, blocking ATP synthesis across the stem parenchyma.',
        correct: false,
      },
    ],
    explanation:
      'Midday wilting is temporary: excessive solar heat and wind cause transpiration from open stomata to exceed water uptake by roots (Transpiration > Absorption). As vacuolar water decreases, turgor pressure drops to zero (cells become flaccid). Stomata close, reducing transpiration, and the plant recovers by evening when absorption catches up.',
  },
  {
    id: 'q4',
    title: 'KCSE Biology Paper 2: Mechanical Role of Xylem Vessels',
    prompt:
      'Besides transport of water and mineral salts, how do xylem vessels contribute to mechanical support in a dicotyledonous stem?',
    options: [
      {
        id: 'A',
        text: 'Their cell walls are reinforced with annular, spiral, or pitted lignin deposits, which prevent the hollow tubes from collapsing inward under tension.',
        correct: true,
      },
      {
        id: 'B',
        text: 'Xylem cells generate high hydrostatic turgor pressure by pumping sucrose into the lumen.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Xylem fibers continuously flex in wind currents to dissipate mechanical stress through stomata.',
        correct: false,
      },
      {
        id: 'D',
        text: 'End walls remain intact with thick cellulose filters that hold the stem erect.',
        correct: false,
      },
    ],
    explanation:
      'Xylem vessels are continuous dead hollow cylinders whose primary walls are heavily reinforced by deposits of lignin in spiral, annular, reticulate, or pitted patterns. Lignin provides immense compressive and tensile strength, resisting negative pressure (tension) generated by the transpiration pull and bearing the physical weight of branches.',
  },
];

export default function PlantSupportTurgorWiltingSim({ config = {}, onTelemetry }) {
  // Environmental & physiological control parameters
  const [soilMoisture, setSoilMoisture] = useState(70); // 0% (drought) to 100% (saturated)
  const [transpirationRate, setTranspirationRate] = useState(45); // 0% (humid/night) to 100% (hot dry wind)
  const [isMiddayRush, setIsMiddayRush] = useState(false); // Quick toggle for hot noon conditions

  // Microscope viewing mode: 'stem_cross_section' | 'cellular_turgor' | 'whole_plant'
  const [viewMode, setViewMode] = useState('whole_plant');

  // Selected tissue type for microscopic inspection
  const [inspectTissue, setInspectTissue] = useState('parenchyma'); // 'parenchyma' | 'collenchyma' | 'sclerenchyma' | 'xylem'

  // Quiz state
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const canvasRef = useRef(null);

  // Derived plant water relations and mechanical metrics
  const waterRelations = useMemo(() => {
    // Effective transpirational demand
    const effectiveTranspiration = isMiddayRush ? Math.max(88, transpirationRate) : transpirationRate;
    const effectiveMoisture = isMiddayRush ? Math.min(soilMoisture, 30) : soilMoisture;

    // Absorption rate is bounded by soil moisture and root hydraulic conductance
    const absorptionRate = effectiveMoisture * 0.85;

    // Net water balance across plant (Absorption - Transpiration)
    const netWaterBalance = absorptionRate - effectiveTranspiration;

    // Relative Water Content (RWC %)
    const rwc = Math.min(100, Math.max(25, 55 + netWaterBalance * 0.55));

    // Vacuolar Turgor Pressure (Ψp in bars/megapascals)
    // Positive when RWC > 60%, falls to 0 at incipient plasmolysis (RWC ~ 55%)
    let turgorMPa = 0;
    if (rwc > 58) {
      turgorMPa = ((rwc - 58) / 42) * 1.25; // up to 1.25 MPa
    }

    // Stem angle / droop degrees (0 = fully erect, 55 = severe wilted collapse)
    let wiltAngle = 0;
    if (turgorMPa < 0.4) {
      wiltAngle = Math.min(52, (0.4 - turgorMPa) * 120);
    }

    // Cell condition status
    let status = 'Turgid & Erect (Maximum Support)';
    let statusColor = 'text-emerald-400';
    let bgBadge = 'bg-emerald-950/60 border-emerald-500/50';

    if (turgorMPa <= 0.05 && rwc < 45) {
      status = 'Severe Plasmolysis & Wilting';
      statusColor = 'text-rose-400';
      bgBadge = 'bg-rose-950/60 border-rose-500/50';
    } else if (turgorMPa <= 0.25) {
      status = 'Incipient Plasmolysis (Flaccid)';
      statusColor = 'text-amber-400';
      bgBadge = 'bg-amber-950/60 border-amber-500/50';
    }

    return {
      rwc: Math.round(rwc),
      absorptionRate: Math.round(absorptionRate),
      effectiveTranspiration: Math.round(effectiveTranspiration),
      turgorMPa: turgorMPa.toFixed(2),
      wiltAngle: Math.round(wiltAngle),
      status,
      statusColor,
      bgBadge,
    };
  }, [soilMoisture, transpirationRate, isMiddayRush]);

  // Midday Wilting trigger effect
  const toggleMiddayWilting = () => {
    if (!isMiddayRush) {
      setIsMiddayRush(true);
      setTranspirationRate(92);
      setSoilMoisture(25);
    } else {
      setIsMiddayRush(false);
      setTranspirationRate(40);
      setSoilMoisture(75);
    }
  };

  // Canvas visualizer rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Dark bio-laboratory backdrop
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#060a12');
    bgGrad.addColorStop(0.5, '#0b1424');
    bgGrad.addColorStop(1, '#050912');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle measurement grid
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (viewMode === 'whole_plant') {
      // ======================================================================
      // 1. WHOLE HERBACEOUS PLANT VIEW (TURGOR VS WILTING)
      // ======================================================================
      const potX = width * 0.5;
      const potY = height * 0.84;
      const droop = (waterRelations.wiltAngle * Math.PI) / 180;

      // Soil Pot
      ctx.fillStyle = '#472a1e';
      ctx.beginPath();
      ctx.moveTo(potX - 85, potY);
      ctx.lineTo(potX + 85, potY);
      ctx.lineTo(potX + 62, potY + 65);
      ctx.lineTo(potX - 62, potY + 65);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#271710';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Moist Soil top
      ctx.fillStyle = isMiddayRush || soilMoisture < 30 ? '#573d2f' : '#2b1b14';
      ctx.beginPath();
      ctx.ellipse(potX, potY, 85, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Water droplets in soil if soilMoisture > 40
      if (soilMoisture > 40) {
        ctx.fillStyle = '#38bdf8';
        const numSoilDrops = Math.round((soilMoisture / 100) * 8);
        for (let i = 0; i < numSoilDrops; i++) {
          ctx.beginPath();
          ctx.arc(potX - 60 + i * 16, potY + 28, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Main Stem with Curvature based on Wilt Angle
      ctx.save();
      ctx.translate(potX, potY);

      // Draw Main Stem
      ctx.strokeStyle = waterRelations.wiltAngle > 25 ? '#84cc16' : '#22c55e';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);

      // Bezier curve drooping with droop factor
      const controlX = droop * 120;
      const stemEndX = droop * 210;
      const stemEndY = -240 + droop * 85;

      ctx.quadraticCurveTo(controlX, -140, stemEndX, stemEndY);
      ctx.stroke();

      // Leaf Branch 1 (Left Lower)
      ctx.save();
      ctx.translate(controlX * 0.35, -90);
      ctx.rotate(-0.6 + droop * 0.9);
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-85, -15 + droop * 40);
      ctx.stroke();

      // Leaf Blade
      ctx.fillStyle = waterRelations.wiltAngle > 25 ? '#65a30d' : '#22c55e';
      ctx.beginPath();
      ctx.ellipse(-50, -10 + droop * 25, 45, 18 - droop * 8, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Leaf Branch 2 (Right Mid)
      ctx.save();
      ctx.translate(controlX * 0.65, -165);
      ctx.rotate(0.6 + droop * 0.8);
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(85, -15 + droop * 40);
      ctx.stroke();

      ctx.fillStyle = waterRelations.wiltAngle > 25 ? '#65a30d' : '#22c55e';
      ctx.beginPath();
      ctx.ellipse(50, -10 + droop * 25, 45, 18 - droop * 8, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Terminal Shoot & Apical Bud
      ctx.save();
      ctx.translate(stemEndX, stemEndY);
      ctx.rotate(droop * 1.2);
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.ellipse(0, -12, 14, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();

      // Transpiration Vapour Rays ascending from leaves
      const vaporCount = Math.round((waterRelations.effectiveTranspiration / 100) * 8);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 2;
      for (let v = 0; v < vaporCount; v++) {
        const vx = potX - 80 + v * 24;
        const vy = potY - 180;
        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(vx + (v % 2 === 0 ? 8 : -8), vy - 45);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Callouts
      ctx.font = 'bold 11px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Herbaceous Stem (Supported by Turgid Parenchyma)', potX - 160, potY - 265);
      ctx.fillText(`Transpiration Pull: ${waterRelations.effectiveTranspiration}%`, potX + 60, potY - 210);
      ctx.fillText(`Root Water Absorption: ${waterRelations.absorptionRate}%`, potX + 95, potY + 45);
    } else if (viewMode === 'cellular_turgor') {
      // ======================================================================
      // 2. MICROSCOPIC PARENCHYMA CELL VIEW (TURGID VS PLASMOLYSED)
      // ======================================================================
      const cellCenterX = width * 0.5;
      const cellCenterY = height * 0.5;
      const cellW = 340;
      const cellH = 250;

      // 1. Rigid Outer Cellulose Cell Wall (Fixed shape)
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 7;
      ctx.fillStyle = '#0f291e';
      ctx.beginPath();
      ctx.roundRect(cellCenterX - cellW / 2, cellCenterY - cellH / 2, cellW, cellH, 36);
      ctx.fill();
      ctx.stroke();

      // Middle lamella & adjacent cell boundaries
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.25)';
      ctx.lineWidth = 3;
      ctx.strokeRect(cellCenterX - cellW / 2 - 20, cellCenterY - cellH / 2 - 20, cellW + 40, cellH + 40);

      // 2. Protoplast / Plasma Membrane & Large Central Vacuole
      // When turgid: vacuole swells and pushes cytoplasm tightly against wall
      // When plasmolysed: protoplast shrinks away from the cell wall
      const shrinkFactor = Math.max(0.45, Math.min(1.0, waterRelations.rwc / 88));
      const protoW = (cellW - 20) * shrinkFactor;
      const protoH = (cellH - 20) * shrinkFactor;

      // Plasmolytic space (between cell wall and shrunken membrane)
      if (shrinkFactor < 0.9) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
        ctx.beginPath();
        ctx.roundRect(cellCenterX - cellW / 2 + 10, cellCenterY - cellH / 2 + 10, cellW - 20, cellH - 20, 28);
        ctx.fill();

        ctx.font = '11px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#f87171';
        ctx.fillText('Plasmolytic Space (Hypertonic Solution / Air)', cellCenterX - 130, cellCenterY - cellH / 2 + 25);
      }

      // Plasma Membrane (Protoplast Boundary)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.5;
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.roundRect(cellCenterX - protoW / 2, cellCenterY - protoH / 2, protoW, protoH, 24 * shrinkFactor);
      ctx.fill();
      ctx.stroke();

      // Cytoplasm granules
      ctx.fillStyle = '#10b981';
      for (let g = 0; g < 16; g++) {
        const gx = cellCenterX - protoW / 2 + 20 + ((g * 47) % (protoW - 40));
        const gy = cellCenterY - protoH / 2 + 15 + ((g * 31) % (protoH - 30));
        ctx.beginPath();
        ctx.arc(gx, gy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vacuolar Tonoplast & Cell Sap
      const vacW = protoW * 0.72;
      const vacH = protoH * 0.68;
      const sapGrad = ctx.createRadialGradient(cellCenterX, cellCenterY, 20, cellCenterX, cellCenterY, vacW / 1.5);
      sapGrad.addColorStop(0, '#bae6fd');
      sapGrad.addColorStop(0.7, '#38bdf8');
      sapGrad.addColorStop(1, '#0284c7');

      ctx.fillStyle = sapGrad;
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cellCenterX, cellCenterY, vacW / 2, vacH / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Nucleus in cytoplasm
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cellCenterX - protoW / 2 + 35, cellCenterY - protoH / 2 + 35, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 9px Inter';
      ctx.fillStyle = '#000';
      ctx.fillText('N', cellCenterX - protoW / 2 + 31, cellCenterY - protoH / 2 + 38);

      // Pressure Vectors (Hydrostatic Turgor Pressure outward on wall)
      if (parseFloat(waterRelations.turgorMPa) > 0.1) {
        ctx.strokeStyle = '#facc15';
        ctx.fillStyle = '#facc15';
        ctx.lineWidth = 2.5;

        // Up vector
        ctx.beginPath();
        ctx.moveTo(cellCenterX, cellCenterY - vacH / 2);
        ctx.lineTo(cellCenterX, cellCenterY - protoH / 2 - 4);
        ctx.stroke();

        // Down vector
        ctx.beginPath();
        ctx.moveTo(cellCenterX, cellCenterY + vacH / 2);
        ctx.lineTo(cellCenterX, cellCenterY + protoH / 2 + 4);
        ctx.stroke();

        // Left vector
        ctx.beginPath();
        ctx.moveTo(cellCenterX - vacW / 2, cellCenterY);
        ctx.lineTo(cellCenterX - protoW / 2 - 4, cellCenterY);
        ctx.stroke();

        // Right vector
        ctx.beginPath();
        ctx.moveTo(cellCenterX + vacW / 2, cellCenterY);
        ctx.lineTo(cellCenterX + protoW / 2 + 4, cellCenterY);
        ctx.stroke();

        ctx.font = 'bold 11px ui-monospace, monospace';
        ctx.fillText(`Ψp = +${waterRelations.turgorMPa} MPa (Turgor Pressure)`, cellCenterX - 110, cellCenterY + 4);
      } else {
        ctx.font = 'bold 12px ui-monospace, monospace';
        ctx.fillStyle = '#f87171';
        ctx.fillText('Ψp = 0.00 MPa (Zero Turgor Pressure / Flaccid)', cellCenterX - 135, cellCenterY + 4);
      }

      // Descriptive labels
      ctx.font = '10.5px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#4ade80';
      ctx.fillText('Cellulose Cell Wall (Inelastic Outer Boundary)', cellCenterX - cellW / 2, cellCenterY - cellH / 2 - 10);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Plasma Membrane (Selectively Permeable)', cellCenterX - cellW / 2, cellCenterY + cellH / 2 + 22);
    } else {
      // ======================================================================
      // 3. STEM CROSS-SECTION ANATOMY (COLLENCHYMA, SCLERENCHYMA, XYLEM)
      // ======================================================================
      const stemX = width * 0.5;
      const stemY = height * 0.5;
      const rOuter = 190;
      const rPith = 60;

      // Epidermis outer ring
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 4;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(stemX, stemY, rOuter, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Collenchyma layer just under epidermis (Cortex)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(stemX, stemY, rOuter - 10, 0, Math.PI * 2);
      ctx.stroke();

      // Cortex Parenchyma
      ctx.fillStyle = 'rgba(34, 197, 94, 0.08)';
      ctx.beginPath();
      ctx.arc(stemX, stemY, rOuter - 20, 0, Math.PI * 2);
      ctx.fill();

      // Central Pith (Storage Parenchyma)
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(stemX, stemY, rPith, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Vascular Bundles arranged in a ring (Dicotyledonous stem)
      const numBundles = 8;
      for (let i = 0; i < numBundles; i++) {
        const theta = (i * 2 * Math.PI) / numBundles;
        const bDist = 115;
        const bx = stemX + Math.cos(theta) * bDist;
        const by = stemY + Math.sin(theta) * bDist;

        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(theta + Math.PI / 2);

        // Sclerenchyma bundle cap (lignified fibers towards outside)
        ctx.fillStyle = '#b45309'; // Reddish-amber lignified sclerenchyma
        ctx.beginPath();
        ctx.arc(0, -22, 14, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Phloem sieve tubes & companion cells
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.ellipse(0, -8, 12, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Vascular Cambium line
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(12, 0);
        ctx.stroke();

        // Xylem Vessels (Lignified, large lumens towards pith)
        ctx.fillStyle = '#dc2626';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(-5, 12, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(5, 12, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 21, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      // Tissue Highlighting Guide
      ctx.font = '11px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#10b981';
      ctx.fillText('• Collenchyma: Sub-epidermal angular thickenings (Flexibility)', 25, 35);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('• Sclerenchyma: Lignified pericyclic fibers (Dead rigid strength)', 25, 55);
      ctx.fillStyle = '#ef4444';
      ctx.fillText('• Xylem Vessels: Lignified conduit pipes (Resists tension)', 25, 75);
      ctx.fillStyle = '#4ade80';
      ctx.fillText('• Parenchyma: Pith & cortex cells (Turgor pressure support)', 25, 95);
    }
  }, [viewMode, soilMoisture, transpirationRate, isMiddayRush, waterRelations]);

  const handleSelectOption = (questionId, optionId) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setShowFeedback(true);
  };

  const calculateScore = () => {
    let score = 0;
    KCSE_QUESTIONS.forEach((q) => {
      const correctOpt = q.options.find((opt) => opt.correct);
      if (userAnswers[q.id] === correctOpt.id) {
        score += 1;
      }
    });
    setQuizScore(score);

    if (onTelemetry) {
      onTelemetry({
        type: 'quiz_completed',
        simKey: 'plant_support_turgor_wilting_lab',
        score,
        total: KCSE_QUESTIONS.length,
        percentage: Math.round((score / KCSE_QUESTIONS.length) * 100),
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  KCSE Biology · Form 4
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                  Topic 1: Support in Plants
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
                Plant Mechanical Support: Turgor Pressure & Wilting Lab
              </h1>
            </div>
          </div>

          {/* Quick Simulation Action Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setSoilMoisture(85);
                setTranspirationRate(30);
                setIsMiddayRush(false);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer transition-all"
            >
              Morning (High Turgor)
            </button>
            <button
              onClick={toggleMiddayWilting}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isMiddayRush
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-900/40 animate-pulse'
                  : 'bg-slate-900 border-amber-600/60 text-amber-300 hover:bg-slate-800'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              {isMiddayRush ? 'Midday Wilting Active' : 'Simulate Midday Wilting'}
            </button>
            <button
              onClick={() => {
                setSoilMoisture(10);
                setTranspirationRate(80);
                setIsMiddayRush(false);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-950/70 border border-rose-800 text-rose-300 hover:bg-rose-900 cursor-pointer transition-all"
            >
              Severe Drought
            </button>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / CENTER VIEWPORT - 8 COLS */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Main Visualization Canvas Container */}
          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
            {/* View Mode Switcher Header */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setViewMode('whole_plant')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'whole_plant'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Whole Plant
              </button>
              <button
                onClick={() => setViewMode('cellular_turgor')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'cellular_turgor'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cellular Turgor (Parenchyma)
              </button>
              <button
                onClick={() => setViewMode('stem_cross_section')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'stem_cross_section'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Stem Cross-Section
              </button>
            </div>

            {/* Status Indicator Badge */}
            <div className="absolute top-3 right-3 z-10">
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold border backdrop-blur-md flex items-center gap-1.5 ${waterRelations.bgBadge} ${waterRelations.statusColor}`}
              >
                <Activity className="w-3.5 h-3.5" />
                {waterRelations.status}
              </span>
            </div>

            {/* Main Canvas Element */}
            <canvas ref={canvasRef} width={760} height={460} className="w-full h-[460px] block" />

            {/* Bottom Realtime Physiology Strip */}
            <div className="absolute bottom-3 inset-x-3 z-10 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                  Soil Moisture
                </span>
                <span className="text-sm font-mono font-bold text-blue-300">{soilMoisture}%</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                  Transpiration
                </span>
                <span className="text-sm font-mono font-bold text-amber-300">
                  {waterRelations.effectiveTranspiration}%
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                  Turgor Pressure (Ψp)
                </span>
                <span
                  className={`text-sm font-mono font-bold ${
                    parseFloat(waterRelations.turgorMPa) > 0.3 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  +{waterRelations.turgorMPa} MPa
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                  Stem Droop
                </span>
                <span
                  className={`text-sm font-mono font-bold ${
                    waterRelations.wiltAngle > 15 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {waterRelations.wiltAngle}°
                </span>
              </div>
            </div>
          </div>

          {/* PHYSIOLOGICAL SLIDERS & CONTROLS */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" /> Environmental Water Relations Controls
              </h3>
              <button
                onClick={() => {
                  setSoilMoisture(70);
                  setTranspirationRate(45);
                  setIsMiddayRush(false);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset Controls
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Soil Moisture Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Soil Moisture (Water Availability)</span>
                  <span className="font-mono text-blue-300 font-bold">{soilMoisture}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={soilMoisture}
                  onChange={(e) => {
                    setSoilMoisture(parseInt(e.target.value));
                    setIsMiddayRush(false);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0% (Permanent Wilting Point)</span>
                  <span>100% (Field Capacity)</span>
                </div>
              </div>

              {/* Transpiration Rate Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Transpiration Rate (Solar/Wind Intensity)</span>
                  <span className="font-mono text-amber-300 font-bold">{transpirationRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={transpirationRate}
                  onChange={(e) => {
                    setTranspirationRate(parseInt(e.target.value));
                    setIsMiddayRush(false);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0% (Humid Night)</span>
                  <span>100% (Hot Dry Winds)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (TISSUE COMPARISON & KCSE CHALLENGE) - 4 COLS */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* TISSUE MECHANICAL ROLE COMPARISON */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Plant Supporting Tissues
            </h3>

            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setInspectTissue('parenchyma')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  inspectTissue === 'parenchyma' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Parenchyma
              </button>
              <button
                onClick={() => setInspectTissue('collenchyma')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  inspectTissue === 'collenchyma' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Collenchyma
              </button>
              <button
                onClick={() => setInspectTissue('sclerenchyma')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  inspectTissue === 'sclerenchyma' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sclerenchyma
              </button>
              <button
                onClick={() => setInspectTissue('xylem')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  inspectTissue === 'xylem' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Xylem Vessels
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs leading-relaxed text-slate-300">
              {inspectTissue === 'parenchyma' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Parenchyma (Turgor Support)
                  </div>
                  <p>
                    Thin-walled living cells found in cortex and pith. When vacuole water content is high, hydrostatic
                    turgor pressure presses cytoplasm outward against the cellulose wall, keeping herbaceous stems rigid.
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">KCSE Focus:</strong> Loses mechanical firmness rapidly when
                    transpiration exceeds water absorption (wilting).
                  </p>
                </div>
              )}
              {inspectTissue === 'collenchyma' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-teal-300">
                    <span className="w-2 h-2 rounded-full bg-teal-400" /> Collenchyma (Flexible Support)
                  </div>
                  <p>
                    Living elongated cells located just beneath the epidermis. Characterized by localized angular thickenings
                    of cellulose and pectin at cell corners.
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">KCSE Focus:</strong> Provides flexible mechanical support to growing
                    petioles, leaves, and young stems without hindering elongation.
                  </p>
                </div>
              )}
              {inspectTissue === 'sclerenchyma' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Sclerenchyma (Rigid Fibers)
                  </div>
                  <p>
                    Dead cells at maturity with uniformly thickened, heavily lignified secondary walls. Forms long slender
                    fibers (e.g., in vascular bundle caps) and stone cells (sclereids).
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">KCSE Focus:</strong> Provides non-living mechanical strength and
                    rigidity to mature woody stems; independent of turgor.
                  </p>
                </div>
              )}
              {inspectTissue === 'xylem' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-rose-300">
                    <span className="w-2 h-2 rounded-full bg-rose-400" /> Xylem Vessels & Tracheids
                  </div>
                  <p>
                    Hollow, continuous dead tubes reinforced with annular, spiral, or pitted lignin thickenings.
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">KCSE Focus:</strong> Dual function: conducts water and mineral salts,
                    while lignin prevents vessel collapse under extreme transpiration tension and bears plant weight.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* KCSE EXAM CHALLENGE */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> KCSE Examination Practice
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Q {activeQuestionIdx + 1} of {KCSE_QUESTIONS.length}
                </span>
              </div>

              {/* Question selector tabs */}
              <div className="flex items-center gap-1.5">
                {KCSE_QUESTIONS.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQuestionIdx(idx);
                      setShowFeedback(!!userAnswers[q.id]);
                    }}
                    className={`flex-1 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeQuestionIdx === idx
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : userAnswers[q.id]
                        ? 'bg-slate-800 text-emerald-300'
                        : 'bg-slate-950 text-slate-500 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Active Question Prompt */}
              {(() => {
                const currentQ = KCSE_QUESTIONS[activeQuestionIdx];
                const answeredOptId = userAnswers[currentQ.id];
                const correctOpt = currentQ.options.find((opt) => opt.correct);
                const isCorrect = answeredOptId === correctOpt.id;

                return (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300">{currentQ.title}</h4>
                    <p className="text-xs leading-relaxed text-slate-200">{currentQ.prompt}</p>

                    {/* Options list */}
                    <div className="space-y-2">
                      {currentQ.options.map((opt) => {
                        const isChosen = answeredOptId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectOption(currentQ.id, opt.id)}
                            className={`w-full p-2.5 rounded-2xl text-left text-xs transition-all border cursor-pointer flex items-start gap-2.5 ${
                              isChosen
                                ? opt.correct
                                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-md'
                                  : 'bg-rose-950/60 border-rose-500 text-rose-100 shadow-md'
                                : showFeedback && opt.correct
                                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                                : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono font-bold text-[11px] shrink-0 ${
                                isChosen
                                  ? opt.correct
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-rose-500 text-white'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span className="leading-snug">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback Explanation */}
                    {showFeedback && answeredOptId && (
                      <div
                        className={`p-3 rounded-2xl border text-xs leading-relaxed space-y-1 animate-fadeIn ${
                          isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                            : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Correct! Excellent biological reasoning.</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-400" />
                              <span>Incorrect. Review the KCSE marking scheme below:</span>
                            </>
                          )}
                        </div>
                        <p className="text-slate-300 text-[11px] font-sans">{currentQ.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Quiz Summary Action */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              {quizScore !== null ? (
                <span className="text-xs font-semibold text-emerald-400">
                  Score: {quizScore} / {KCSE_QUESTIONS.length} ({Math.round((quizScore / KCSE_QUESTIONS.length) * 100)}%)
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Answer all questions to finalize score</span>
              )}
              <button
                onClick={calculateScore}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer transition-all shadow-md"
              >
                Submit Answers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
