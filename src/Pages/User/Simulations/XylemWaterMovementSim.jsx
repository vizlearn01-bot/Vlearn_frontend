import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Droplets,
  ArrowUp,
  CheckCircle2,
  XCircle,
  Info,
  Layers,
  Eye,
  HelpCircle,
  Activity,
  Sparkles,
  Sliders,
  Sun,
  Wind,
  Thermometer,
  BookOpen,
  Microscope,
  ArrowRight,
  Zap,
  ShieldCheck,
  Maximize2,
  Compass,
} from 'lucide-react';

// ============================================================================
// GRADE 10 CBC / KCSE CURRICULUM QUESTIONS (XYLEM WATER MOVEMENT)
// ============================================================================
const ASSESSMENT_QUESTIONS = [
  {
    id: 'q1',
    title: 'Question 1: Structural Adaptations of Xylem Vessels',
    prompt:
      'Why are mature xylem vessel elements dead at functional maturity, lacking cytoplasm, nuclei, and transverse end walls?',
    options: [
      {
        id: 'A',
        text: 'To form an uninterrupted, hollow continuous capillary pipe of low internal resistance for the mass flow of water under negative tension.',
        correct: true,
      },
      {
        id: 'B',
        text: 'To allow active transport protein pumps in the cell membrane to force water upward against gravitational pull.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Because high soil salt concentrations poison the living protoplasts as soon as the plant germinates.',
        correct: false,
      },
      {
        id: 'D',
        text: 'To enable vessel elements to undergo rapid mitotic cell division as the stem elongates.',
        correct: false,
      },
    ],
    explanation:
      'Mature xylem vessel elements undergo programmed autolysis, losing their living protoplasts and transverse end walls. This leaves empty, continuous cylindrical lumens from root to leaf, eliminating internal resistance to the upward mass flow of xylem sap.',
  },
  {
    id: 'q2',
    title: 'Question 2: Driving Force for Upward Water Movement',
    prompt:
      'Water transport through xylem is strictly unidirectional (upward from roots to leaves). In tall plants, what is the primary driving mechanism pulling water upward against gravity?',
    options: [
      {
        id: 'A',
        text: 'Transpiration pull: evaporation of water from leaf mesophyll surfaces generates negative hydrostatic tension that pulls an unbroken cohesive water column.',
        correct: true,
      },
      {
        id: 'B',
        text: 'A mechanical root pump that rhythmically contracts to pump sap upward into the branches.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Simple capillary rise alone, which easily lifts water over 100 meters without any evaporation.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Bidirectional hydrostatic pressure created by active loading of sucrose in source leaves.',
        correct: false,
      },
    ],
    explanation:
      'Upward water movement is not powered by a pump. It is driven by Transpiration Pull (Cohesion-Tension theory). Evaporation from mesophyll cell walls into stomatal cavities creates negative hydrostatic pressure (tension / negative water potential). This tension pulls the continuous water column upward from roots to leaves.',
  },
  {
    id: 'q3',
    title: 'Question 3: Cohesion vs Adhesion in the Ascent of Sap',
    prompt:
      'According to the Cohesion-Tension theory, how do cohesion and adhesion differ in their contributions to water ascent?',
    options: [
      {
        id: 'A',
        text: 'Cohesion is hydrogen bonding between polar water molecules maintaining an unbroken column; adhesion is attraction between water molecules and hydrophilic xylem wall polymers supporting the column against gravity.',
        correct: true,
      },
      {
        id: 'B',
        text: 'Cohesion attracts water to cellulose in the vessel wall, while adhesion connects water molecules to one another.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Cohesion generates positive root pressure at night, while adhesion produces negative transpiration pull during daytime.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Cohesion drives water movement across the Casparian strip, while adhesion operates exclusively inside stomata.',
        correct: false,
      },
    ],
    explanation:
      'Cohesion is the intermolecular hydrogen bonding between water molecules (δ+ H and δ- O), giving water exceptionally high tensile strength to withstand negative pressures without breaking (preventing cavitation). Adhesion is the attractive force between polar water molecules and the hydrophilic cellulose/lignin walls of xylem vessels, resisting gravity.',
  },
  {
    id: 'q4',
    title: 'Question 4: Function of the Casparian Strip in Root Endodermis',
    prompt:
      'Water traveling apoplastically (through cell walls) in the root cortex is halted at the endodermis. What is the structural basis and physiological purpose of this barrier?',
    options: [
      {
        id: 'A',
        text: 'The Casparian strip (impregnated with waterproof suberin) blocks apoplastic flow, forcing water and dissolved mineral ions through the selectively permeable cell membranes of endodermal cells.',
        correct: true,
      },
      {
        id: 'B',
        text: 'A thick ring of lignin that excretes excess water back into the soil to prevent root flooding.',
        correct: false,
      },
      {
        id: 'C',
        text: 'A waxy cuticle layer that accelerates rapid water flow directly into phloem sieve tubes.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Stomatal guard cells inside the root that close when soil moisture drops below 20%.',
        correct: false,
      },
    ],
    explanation:
      'The Casparian strip is a band of suberin in the radial and transverse walls of root endodermal cells. Suberin is impermeable to water. It seals the apoplast, forcing all water and dissolved ions into the living symplast (cytoplasm), enabling selective membrane transport and preventing backward leakage of ions.',
  },
  {
    id: 'q5',
    title: 'Question 5: Role of Lignin Thickening in Vessel Walls',
    prompt:
      'Xylem vessel secondary walls are reinforced with annular, spiral, or pitted lignin deposits. What would happen during peak midday transpiration if vessel walls lacked lignin?',
    options: [
      {
        id: 'A',
        text: 'The vessel walls would collapse inward (implode) due to the immense negative hydrostatic tension generated by transpiration pull.',
        correct: true,
      },
      {
        id: 'B',
        text: 'The vessels would burst outward due to excessive positive internal turgor pressure.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Water molecules would instantly dissociate into hydrogen and oxygen gases.',
        correct: false,
      },
      {
        id: 'D',
        text: 'The vessels would fill with living cytoplasm and turn into collenchyma fibers.',
        correct: false,
      },
    ],
    explanation:
      'Transpiration pull subjects xylem vessels to high negative pressure (tension, often exceeding -1.5 MPa or -15 atmospheres). Lignin provides immense rigid compressive strength, preventing the thin-walled cylinders from collapsing inward (imploding) like a crushed straw under strong suction.',
  },
];

// ============================================================================
// ANATOMICAL STRUCTURE DETAILS FOR INSPECTOR MODAL
// ============================================================================
const ANATOMY_DETAILS = {
  root_hair: {
    name: 'Root Hair Cell (Epidermis)',
    living: 'Living cell with thin cellulose wall & large vacuole',
    role: 'Large surface area for absorbing soil water by osmosis and mineral ions by active transport.',
    adaptation: 'Slender extension of epidermal cell penetrating soil pores; no cuticle to allow rapid water entry.',
  },
  cortex_parenchyma: {
    name: 'Root Cortex Parenchyma',
    living: 'Living, loosely packed unspecialized cells',
    role: 'Allows water movement via apoplast (cell walls) and symplast (plasmodesmata) pathways toward the stele.',
    adaptation: 'Thin permeable walls with abundant intercellular air spaces minimizing resistance to flow.',
  },
  endodermis_casparian: {
    name: 'Endodermis & Casparian Strip',
    living: 'Living cells with suberized radial bands',
    role: 'Blocks the apoplast pathway, forcing all water and dissolved minerals through selective cell membranes.',
    adaptation: 'Casparian strip made of hydrophobic suberin acts as a biological checkpoint preventing uncontrolled leakage.',
  },
  root_xylem: {
    name: 'Root Xylem Vessels (Stele)',
    living: 'Non-living hollow conduit tubes',
    role: 'Collects filtered water and minerals from pericycle and conducts them upward into the stem xylem.',
    adaptation: 'Dicot root has central star-shaped xylem core with thick lignified walls resisting collapse.',
  },
  stem_xylem_vessel: {
    name: 'Stem Xylem Vessel Element',
    living: 'Non-living (dead at functional maturity)',
    role: 'Provides continuous low-resistance vertical pipes for unidirectional upward transport of xylem sap.',
    adaptation: 'Complete loss of end walls and protoplasts; heavy annular/spiral/pitted lignin wall thickenings.',
  },
  phloem_bundle: {
    name: 'Phloem Tissue (Vascular Bundle)',
    living: 'Living sieve tubes & companion cells',
    role: 'Translocates manufactured organic nutrients (sucrose, amino acids) bidirectionally (source to sink).',
    adaptation: 'Distinct from xylem; positioned on the outer side of the vascular bundle, separated by cambium.',
  },
  vascular_cambium: {
    name: 'Vascular Cambium',
    living: 'Actively dividing secondary meristem',
    role: 'Undergoes secondary growth, producing secondary xylem toward the inside and secondary phloem outward.',
    adaptation: 'Single layer of thin-walled meristematic cells between xylem and phloem.',
  },
  leaf_vein_xylem: {
    name: 'Leaf Vein Xylem',
    living: 'Non-living hollow capillaries',
    role: 'Delivers water and dissolved mineral ions directly to photosynthesizing spongy and palisade mesophyll cells.',
    adaptation: 'Branches into a fine, dense network throughout the leaf lamina so no cell is far from water.',
  },
  stomata_guard_cells: {
    name: 'Stomata & Guard Cells',
    living: 'Living specialized epidermal cells with chloroplasts',
    role: 'Regulate transpiration rate and gas exchange (CO2 in, H2O vapor out) by turgor-driven opening and closing.',
    adaptation: 'Thicker inner cellulose wall causes bean-shaped bending when turgid, creating the stomatal pore.',
  },
};

// ============================================================================
// 6-STAGE PATHWAY STEP DEFINITIONS
// ============================================================================
const PATHWAY_STAGES = [
  {
    stage: 1,
    title: '1. Soil Absorption by Root Hairs',
    subtitle: 'Osmosis & Active Transport',
    description:
      'Soil water has a higher water potential (Ψ ≈ -0.05 MPa) than root hair sap (Ψ ≈ -0.3 MPa). Water enters root hairs by osmosis through the semi-permeable membrane. Mineral ions (K⁺, NO₃⁻, Mg²⁺) are actively pumped in using ATP against concentration gradients.',
    focusArea: 'root_hair',
  },
  {
    stage: 2,
    title: '2. Cortex Transit & Casparian Checkpoint',
    subtitle: 'Apoplast vs Symplast Pathways',
    description:
      'Water moves through the cortex via the Apoplast pathway (cell walls & intercellular spaces) and Symplast pathway (cytoplasm via plasmodesmata). At the endodermis, the suberized Casparian strip completely blocks the apoplast, forcing all water into the living symplast for selective filtration.',
    focusArea: 'endodermis_casparian',
  },
  {
    stage: 3,
    title: '3. Stele Entry & Root Xylem Loading',
    subtitle: 'Stele Entry & Root Pressure',
    description:
      'Water passes from the endodermis into the pericycle and enters the dead, hollow lumen of root xylem vessels. Active mineral secretion into the xylem stele lowers its solute potential, creating positive Root Pressure (+0.1 to +0.2 MPa), which helps push water up herbaceous stems.',
    focusArea: 'root_xylem',
  },
  {
    stage: 4,
    title: '4. Stem Xylem Ascent (Cohesion-Tension)',
    subtitle: 'Continuous Unbroken Column',
    description:
      'Water ascends strictly UNIDIRECTIONALLY through continuous hollow xylem vessels. The driving force is Transpiration Pull (tension). Cohesion (hydrogen bonds between H₂O molecules) prevents column rupture, while Adhesion to lignified walls resists gravity. Lignin rings prevent vessels from imploding under negative pressure.',
    focusArea: 'stem_xylem_vessel',
  },
  {
    stage: 5,
    title: '5. Leaf Veins & Mesophyll Hydration',
    subtitle: 'Capillary Distribution to Cells',
    description:
      'Stem xylem branches through petioles into fine leaf veins. Water moves out of vein xylem by osmosis into spongy and palisade mesophyll cells, maintaining high cellular turgor and providing water for photolysis in photosynthesis.',
    focusArea: 'leaf_vein_xylem',
  },
  {
    stage: 6,
    title: '6. Stomatal Transpiration Pull',
    subtitle: 'Evaporation into Atmosphere',
    description:
      'Water evaporates from moist surfaces of mesophyll cells into sub-stomatal air spaces. Water vapor diffuses out through open stomata into drier atmosphere (Ψ_air ≈ -95 MPa). This continuous loss creates negative tension that pulls the entire water column from roots.',
    focusArea: 'stomata_guard_cells',
  },
];

export default function XylemWaterMovementSim({ config = {}, onTelemetry }) {
  // Primary Flow Controller: Start/Pause & Speed Toggle
  const [isPlaying, setIsPlaying] = useState(true);
  const [flowSpeed, setFlowSpeed] = useState('normal'); // 'normal' | 'fast'

  // Interactive View Modes:
  // 'whole_plant' | 'root_cross_section' | 'stem_cross_section' | 'xylem_longitudinal'
  const [viewMode, setViewMode] = useState('whole_plant');

  // Lignin Wall Pattern for Longitudinal View: 'annular' | 'spiral' | 'pitted'
  const [ligninPattern, setLigninPattern] = useState('spiral');

  // Interactive Root Pathway Toggle: 'both' | 'apoplast' | 'symplast'
  const [rootPathwayFilter, setRootPathwayFilter] = useState('both');

  // Environmental Control Factors
  const [sunlight, setSunlight] = useState(70); // 0 - 100%
  const [temperature, setTemperature] = useState(25); // 15 - 40°C
  const [humidity, setHumidity] = useState(45); // 20 - 90%
  const [windSpeed, setWindSpeed] = useState(15); // 0 - 30 km/h
  const [soilMoisture, setSoilMoisture] = useState(80); // 10 - 100%

  // Pathway Explorer Active Step (0 - 5)
  const [activePathwayStep, setActivePathwayStep] = useState(0);

  // Selected Anatomy Inspector item
  const [selectedAnatomyKey, setSelectedAnatomyKey] = useState('stem_xylem_vessel');

  // Assessment Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [userQuizAnswers, setUserQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Active Tab for Right-Hand Panel: 'controls' | 'pathway' | 'inspector' | 'quiz'
  const [activeTab, setActiveTab] = useState('controls');

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Telemetry checkpoint helper
  const triggerTelemetry = (checkpoint, payload = {}) => {
    if (typeof onTelemetry === 'function') {
      try {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'xylem_water_movement',
          checkpoint,
          viewMode,
          flowSpeed,
          isPlaying,
          ...payload,
        });
      } catch (err) {
        console.warn('Telemetry delivery failed:', err);
      }
    }
  };

  // Derived Physiological Metrics based on Environmental Drivers
  const metrics = useMemo(() => {
    // Transpiration Demand: Driven by light, temp, wind, inversely by humidity
    const lightFactor = sunlight / 100;
    const tempFactor = (temperature - 10) / 30; // 0 to 1
    const windFactor = 0.5 + windSpeed / 30;
    const vpdFactor = Math.max(0.1, (100 - humidity) / 100); // Vapor Pressure Deficit

    // Transpiration Rate (relative % 0 to 100)
    let transRate = Math.round(
      Math.min(100, Math.max(5, (lightFactor * 0.4 + tempFactor * 0.35 + 0.25) * windFactor * vpdFactor * 90))
    );
    if (soilMoisture < 20) {
      // Stomata close under severe drought stress to prevent desiccation
      transRate = Math.round(transRate * (soilMoisture / 25));
    }

    // Upward Sap Ascent Velocity (cm/h in angiosperm diffuse porous / ring porous xylem)
    // Speed toggle multiplier: normal = 1x, fast = 2.5x
    const speedMult = flowSpeed === 'fast' ? 2.5 : 1.0;
    const velocity = isPlaying
      ? Math.round((transRate * 0.95 + 12) * speedMult * (soilMoisture > 15 ? 1 : 0.2))
      : 0;

    // Transpiration Pull Tension at Leaf (negative hydrostatic pressure in MPa)
    // Range: -0.2 MPa (dormant/humid) to -2.2 MPa (hot sunny midday)
    const tensionMPa = isPlaying ? -Math.min(2.4, Math.max(0.2, 0.25 + (transRate / 100) * 1.85)) : -0.15;

    // Water Potential Gradient across the Soil-Plant-Atmosphere Continuum (SPAC)
    const psiSoil = (-0.05 - (100 - soilMoisture) * 0.015).toFixed(2);
    const psiRoot = (-0.2 - (100 - soilMoisture) * 0.012).toFixed(2);
    const psiStem = (-0.45 - (transRate / 100) * 0.6).toFixed(2);
    const psiLeaf = tensionMPa.toFixed(2);
    const psiAir = (-95 - (100 - humidity) * 0.8).toFixed(1);

    // Column Integrity: Cavitation (embolism) risk occurs when tension is extreme and soil is dry
    let columnStatus = 'Stable & Continuous (Unbroken Cohesion)';
    let columnColor = 'text-emerald-400';
    let columnBadgeBg = 'bg-emerald-950/70 border-emerald-600/50';

    if (soilMoisture < 25 && transRate > 65) {
      columnStatus = 'High Cavitation Risk (Embolism / Bubble formation)';
      columnColor = 'text-rose-400';
      columnBadgeBg = 'bg-rose-950/70 border-rose-600/50';
    } else if (transRate > 80) {
      columnStatus = 'High Tension Stress (Lignin Walls Resisting Implosion)';
      columnColor = 'text-amber-400';
      columnBadgeBg = 'bg-amber-950/70 border-amber-600/50';
    }

    return {
      transRate,
      velocity,
      tensionMPa: tensionMPa.toFixed(2),
      psiSoil,
      psiRoot,
      psiStem,
      psiLeaf,
      psiAir,
      columnStatus,
      columnColor,
      columnBadgeBg,
    };
  }, [sunlight, temperature, humidity, windSpeed, soilMoisture, flowSpeed, isPlaying]);

  // Handle Play/Pause
  const handleTogglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    triggerTelemetry(next ? 'WATER_FLOW_STARTED' : 'WATER_FLOW_PAUSED', {
      isPlaying: next,
      flowSpeed,
    });
  };

  // Handle Speed Change
  const handleToggleSpeed = (speed) => {
    setFlowSpeed(speed);
    triggerTelemetry('FLOW_SPEED_CHANGED', { flowSpeed: speed });
  };

  // Handle View Mode Change
  const handleSelectViewMode = (mode) => {
    setViewMode(mode);
    triggerTelemetry('VIEW_MODE_CHANGED', { viewMode: mode });
  };

  // Handle Reset to Resting State
  const handleReset = () => {
    setIsPlaying(false);
    setFlowSpeed('normal');
    setViewMode('whole_plant');
    setLigninPattern('spiral');
    setRootPathwayFilter('both');
    setSunlight(70);
    setTemperature(25);
    setHumidity(45);
    setWindSpeed(15);
    setSoilMoisture(80);
    setActivePathwayStep(0);
    setSelectedAnatomyKey('stem_xylem_vessel');
    setUserQuizAnswers({});
    setQuizScore(null);
    setShowExplanation(false);
    triggerTelemetry('SIMULATION_RESET', { status: 'resting_state' });
  };

  // Handle Quiz selection
  const handleSelectQuizAnswer = (questionId, optionId) => {
    setUserQuizAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setShowExplanation(true);
  };

  const handleCalculateQuizScore = () => {
    let score = 0;
    ASSESSMENT_QUESTIONS.forEach((q) => {
      const correctOpt = q.options.find((opt) => opt.correct);
      if (userQuizAnswers[q.id] === correctOpt.id) {
        score += 1;
      }
    });
    setQuizScore(score);
    triggerTelemetry('QUIZ_COMPLETED', {
      score,
      total: ASSESSMENT_QUESTIONS.length,
      percentage: Math.round((score / ASSESSMENT_QUESTIONS.length) * 100),
    });
  };

  // Initialize Animated Particles
  useEffect(() => {
    const particles = [];
    // 65 Water molecules + 18 Mineral Ions
    for (let i = 0; i < 75; i++) {
      particles.push({
        id: i,
        type: i % 4 === 0 ? 'mineral' : 'water',
        ionName: i % 4 === 0 ? (i % 8 === 0 ? 'K⁺' : i % 12 === 0 ? 'NO₃⁻' : 'Mg²⁺') : 'H₂O',
        x: 180 + Math.random() * 80,
        y: 80 + Math.random() * 380,
        speedOffset: 0.8 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        size: i % 4 === 0 ? 5.5 : 4.2,
      });
    }
    particlesRef.current = particles;
  }, []);

  // Canvas Animation & Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let tick = 0;

    const render = () => {
      tick += 1;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Deep scientific backdrop gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040914');
      bgGrad.addColorStop(0.5, '#071224');
      bgGrad.addColorStop(1, '#060d1a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Fine grid background
      ctx.strokeStyle = 'rgba(30, 58, 95, 0.2)';
      ctx.lineWidth = 1;
      const gridSize = 40;
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

      // Render Active View
      if (viewMode === 'whole_plant') {
        drawWholePlantView(ctx, width, height, tick);
      } else if (viewMode === 'root_cross_section') {
        drawRootCrossSectionView(ctx, width, height, tick);
      } else if (viewMode === 'stem_cross_section') {
        drawStemCrossSectionView(ctx, width, height, tick);
      } else if (viewMode === 'xylem_longitudinal') {
        drawXylemLongitudinalView(ctx, width, height, tick);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [
    viewMode,
    isPlaying,
    flowSpeed,
    ligninPattern,
    rootPathwayFilter,
    sunlight,
    temperature,
    humidity,
    windSpeed,
    soilMoisture,
    metrics,
    selectedAnatomyKey,
  ]);

  // ==========================================================================
  // VIEW 1: WHOLE PLANT TRANSPIRATION STREAM
  // ==========================================================================
  const drawWholePlantView = (ctx, width, height, tick) => {
    const soilY = height * 0.68;
    const stemX = width * 0.42;
    const stemW = 48;
    const baseSpeed = (flowSpeed === 'fast' ? 2.8 : 1.2) * (metrics.transRate / 50);

    // 1. Soil Layer & underground gradient
    const soilGrad = ctx.createLinearGradient(0, soilY, 0, height);
    soilGrad.addColorStop(0, '#2b1b11');
    soilGrad.addColorStop(0.3, '#1f130b');
    soilGrad.addColorStop(1, '#140c06');
    ctx.fillStyle = soilGrad;
    ctx.fillRect(0, soilY, width, height - soilY);

    // Soil boundary line
    ctx.strokeStyle = '#4a2e1b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, soilY);
    ctx.lineTo(width, soilY);
    ctx.stroke();

    // Soil moisture water droplets in pore spaces
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    for (let i = 0; i < 35; i++) {
      const dropX = (i * 37 + (tick * 0.2) % 30) % width;
      const dropY = soilY + 15 + ((i * 23) % (height - soilY - 25));
      ctx.beginPath();
      ctx.arc(dropX, dropY, (soilMoisture / 100) * 3 + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Soil label
    ctx.fillStyle = '#a87954';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('SOIL HORIZON (Water & Mineral Ions)', 20, soilY + 25);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#7dd3fc';
    ctx.fillText(`Soil Ψ = ${metrics.psiSoil} MPa`, 20, soilY + 42);

    // 2. Sunlight visualization (if daytime)
    if (sunlight > 0) {
      const sunX = width * 0.88;
      const sunY = 55;
      const sunRadius = 24;

      const sunGlow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 70);
      sunGlow.addColorStop(0, `rgba(251, 191, 36, ${0.4 + (sunlight / 100) * 0.5})`);
      sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // Sun rays
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
      ctx.lineWidth = 2;
      for (let a = 0; a < 8; a++) {
        const ang = (a * Math.PI) / 4 + tick * 0.01;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(ang) * (sunRadius + 4), sunY + Math.sin(ang) * (sunRadius + 4));
        ctx.lineTo(sunX + Math.cos(ang) * (sunRadius + 14), sunY + Math.sin(ang) * (sunRadius + 14));
        ctx.stroke();
      }

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText(`Solar Radiation: ${sunlight}%`, sunX - 60, sunY + 48);
    }

    // 3. Root System (Branching into soil)
    ctx.strokeStyle = '#854d0e';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(stemX + stemW / 2, soilY);
    ctx.quadraticCurveTo(stemX + stemW / 2, soilY + 60, stemX + stemW / 2, soilY + 110);
    ctx.stroke();

    // Main lateral roots
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(stemX + stemW / 2, soilY + 30);
    ctx.quadraticCurveTo(stemX - 60, soilY + 60, stemX - 110, soilY + 100);
    ctx.moveTo(stemX + stemW / 2, soilY + 40);
    ctx.quadraticCurveTo(stemX + 100, soilY + 70, stemX + 150, soilY + 95);
    ctx.moveTo(stemX + stemW / 2, soilY + 75);
    ctx.quadraticCurveTo(stemX - 40, soilY + 110, stemX - 80, soilY + 135);
    ctx.moveTo(stemX + stemW / 2, soilY + 80);
    ctx.quadraticCurveTo(stemX + 60, soilY + 120, stemX + 110, soilY + 140);
    ctx.stroke();

    // Root hairs (fine white/cyan filaments)
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.7)';
    ctx.lineWidth = 1.5;
    for (let r = 0; r < 24; r++) {
      const rx = stemX - 110 + r * 10;
      const ry = soilY + 70 + (r % 6) * 10;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + (r % 2 === 0 ? 12 : -12), ry + 8);
      ctx.stroke();
    }

    // 4. Stem Trunk
    const stemTopY = 160;
    // Bark / Outer Stem
    ctx.fillStyle = '#3f2e1e';
    ctx.fillRect(stemX, stemTopY, stemW, soilY - stemTopY);

    // Inner Xylem Conduit Window (Cutaway)
    const xylemX = stemX + 12;
    const xylemW = 24;
    ctx.fillStyle = '#0f2942';
    ctx.fillRect(xylemX, stemTopY - 20, xylemW, soilY - stemTopY + 130);

    // Lignified Wall borders of xylem vessel
    ctx.strokeStyle = '#c2410c'; // Lignin coloration
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(xylemX, stemTopY - 20);
    ctx.lineTo(xylemX, soilY + 110);
    ctx.moveTo(xylemX + xylemW, stemTopY - 20);
    ctx.lineTo(xylemX + xylemW, soilY + 110);
    ctx.stroke();

    // Lignin Spiral Rings along stem cutaway
    ctx.strokeStyle = 'rgba(234, 88, 12, 0.6)';
    ctx.lineWidth = 2;
    for (let y = stemTopY - 15; y < soilY + 100; y += 18) {
      ctx.beginPath();
      ctx.ellipse(xylemX + xylemW / 2, y, xylemW / 2 - 2, 4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Unidirectional Upward Arrow indicator
    ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
    for (let arrY = stemTopY + 20; arrY < soilY - 20; arrY += 45) {
      const pulseY = arrY - ((tick * 1.5) % 45);
      ctx.beginPath();
      ctx.moveTo(stemX + stemW / 2, pulseY - 8);
      ctx.lineTo(stemX + stemW / 2 - 6, pulseY + 4);
      ctx.lineTo(stemX + stemW / 2 + 6, pulseY + 4);
      ctx.closePath();
      ctx.fill();
    }

    // 5. Leaf Canopy & Veins
    // Left Branch & Leaf
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(stemX + stemW / 2, stemTopY + 50);
    ctx.quadraticCurveTo(stemX - 80, stemTopY + 30, stemX - 160, stemTopY - 20);
    ctx.stroke();

    // Left Leaf Blade
    drawLeafBlade(ctx, stemX - 160, stemTopY - 20, -0.6, 110, 55, '#16a34a');

    // Right Branch & Leaf
    ctx.beginPath();
    ctx.moveTo(stemX + stemW / 2, stemTopY + 20);
    ctx.quadraticCurveTo(stemX + 80, stemTopY - 10, stemX + 170, stemTopY - 50);
    ctx.stroke();
    drawLeafBlade(ctx, stemX + 170, stemTopY - 50, 0.4, 120, 60, '#15803d');

    // Top Central Leaves
    drawLeafBlade(ctx, stemX + stemW / 2 - 40, stemTopY - 70, -0.2, 95, 48, '#22c55e');
    drawLeafBlade(ctx, stemX + stemW / 2 + 40, stemTopY - 80, 0.25, 105, 52, '#16a34a');

    // 6. Upward Flowing Stream of Animated Particles (H2O and Minerals)
    if (particlesRef.current.length > 0) {
      particlesRef.current.forEach((p) => {
        if (isPlaying) {
          p.y -= baseSpeed * p.speedOffset;
          if (p.y < stemTopY - 80) {
            p.y = soilY + 90 + Math.random() * 40;
            p.x = stemX - 80 + Math.random() * 160;
          }
        }

        // Calculate horizontal alignment based on vertical zone
        let targetX = stemX + stemW / 2;
        if (p.y > soilY) {
          // In root zone: spread out towards root hairs
          targetX = stemX + stemW / 2 + Math.sin(p.y * 0.05 + p.phase) * 60;
        } else if (p.y < stemTopY + 30) {
          // In leaf zone: branch out to leaves
          const leafBranch = p.id % 2 === 0 ? -1 : 1;
          const branchProg = (stemTopY + 30 - p.y) / 100;
          targetX = stemX + stemW / 2 + leafBranch * branchProg * 120;
        } else {
          // Inside stem xylem lumen
          targetX = xylemX + 5 + (p.id % (xylemW - 10));
        }

        p.x = p.x + (targetX - p.x) * 0.15;

        // Render Particle
        if (p.type === 'water') {
          // H2O Molecule: Glowing Cyan
          const glow = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, p.size * 2);
          glow.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
          glow.addColorStop(0.5, 'rgba(14, 165, 233, 0.6)');
          glow.addColorStop(1, 'rgba(14, 165, 233, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Mineral Ion (K+, NO3-, Mg2+): Glowing Gold / Amber
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Ion label
          ctx.font = 'bold 8px sans-serif';
          ctx.fillStyle = '#451a03';
          ctx.fillText(p.ionName, p.x - 5, p.y + 3);
        }
      });
    }

    // 7. Transpiration Vapor Cloud (Puffs leaving leaf stomata into air)
    if (isPlaying && metrics.transRate > 10) {
      const puffCount = Math.ceil(metrics.transRate / 20);
      for (let f = 0; f < puffCount; f++) {
        const puffX = stemX - 160 + ((tick * 1.5 + f * 45) % 360);
        const puffY = stemTopY - 60 - ((tick * 0.8 + f * 20) % 55);
        const puffAlpha = Math.max(0, 0.5 - (stemTopY - 60 - puffY) / 60);

        ctx.fillStyle = `rgba(186, 230, 253, ${puffAlpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(puffX, puffY, 8 + (f % 4) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 8. Scientific Annotation Callouts on Canvas
    drawAnnotationTag(
      ctx,
      xylemX + xylemW + 10,
      soilY - 80,
      'XYLEM CONDUIT',
      'Unidirectional upward flow; Dead hollow tubes reinforced with lignin'
    );
    drawAnnotationTag(
      ctx,
      stemX + 160,
      stemTopY - 70,
      'STOMATAL TRANSPIRATION',
      `Evaporation creates tension (Pull: ${metrics.tensionMPa} MPa)`
    );
    drawAnnotationTag(
      ctx,
      stemX - 170,
      soilY + 60,
      'ROOT HAIR INFLOW',
      'Osmosis (H₂O) & Active Ion Uptake'
    );

    // 9. Water Potential Gradient HUD Bar
    drawSPACGradientHUD(ctx, 20, 20, metrics);
  };

  // Helper: Draw leaf blade shape with vein
  const drawLeafBlade = (ctx, x, y, angle, length, width, color) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(length * 0.3, -width, length * 0.7, -width * 0.7, length, 0);
    ctx.bezierCurveTo(length * 0.7, width * 0.7, length * 0.3, width, 0, 0);
    ctx.fill();

    // Primary Vein (Xylem branch)
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length * 0.92, 0);
    ctx.stroke();

    // Lateral secondary veins
    ctx.lineWidth = 1;
    for (let v = 15; v < length * 0.8; v += 16) {
      ctx.beginPath();
      ctx.moveTo(v, 0);
      ctx.lineTo(v + 12, -width * 0.4);
      ctx.moveTo(v, 0);
      ctx.lineTo(v + 12, width * 0.4);
      ctx.stroke();
    }

    ctx.restore();
  };

  // Helper: Draw annotation tag
  const drawAnnotationTag = (ctx, x, y, title, subtitle) => {
    ctx.save();
    ctx.font = 'bold 10px sans-serif';
    const textW = Math.max(ctx.measureText(title).width, ctx.measureText(subtitle).width);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y - 14, textW + 16, 32, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.fillText(title, x + 8, y);
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(subtitle, x + 8, y + 12);
    ctx.restore();
  };

  // Helper: Draw SPAC Water Potential HUD
  const drawSPACGradientHUD = (ctx, x, y, m) => {
    ctx.save();
    const hudW = 340;
    const hudH = 68;

    ctx.fillStyle = 'rgba(11, 19, 38, 0.85)';
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, hudW, hudH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#93c5fd';
    ctx.fillText('WATER POTENTIAL GRADIENT (Ψ Pathway: High → Low)', x + 10, y + 18);

    ctx.font = '10px monospace';
    ctx.fillStyle = '#e2e8f0';
    const steps = [
      { name: 'Soil', psi: m.psiSoil, color: '#38bdf8' },
      { name: 'Root', psi: m.psiRoot, color: '#60a5fa' },
      { name: 'Stem', psi: m.psiStem, color: '#818cf8' },
      { name: 'Leaf', psi: m.psiLeaf, color: '#a78bfa' },
      { name: 'Atm.', psi: m.psiAir, color: '#f472b6' },
    ];

    let cx = x + 10;
    steps.forEach((s, idx) => {
      ctx.fillStyle = s.color;
      ctx.fillText(`${s.name}: ${s.psi}`, cx, y + 38);
      if (idx < steps.length - 1) {
        ctx.fillStyle = '#64748b';
        ctx.fillText(' > ', cx + 55, y + 38);
      }
      cx += 65;
    });

    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('• Water flows spontaneously down the water potential gradient without active pumps.', x + 10, y + 56);
    ctx.restore();
  };

  // ==========================================================================
  // VIEW 2: ROOT CROSS-SECTION (APOPLAST VS SYMPLAST & CASPARIAN STRIP)
  // ==========================================================================
  const drawRootCrossSectionView = (ctx, width, height, tick) => {
    const centerY = height * 0.5;
    const cellW = 75;
    const startX = 60;

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('DICOT ROOT CROSS-SECTION: WATER INFLOW PATHWAYS', 30, 35);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(
      'Comparing Apoplast (cell wall) vs Symplast (cytoplasm) & Casparian Strip barrier at Endodermis',
      30,
      52
    );

    // Pathway legend
    ctx.fillStyle = '#f87171';
    ctx.fillRect(width - 320, 25, 14, 14);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px sans-serif';
    ctx.fillText('Apoplast Pathway (Cell walls; stopped at Casparian)', width - 300, 37);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(width - 320, 45, 14, 14);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Symplast Pathway (Cytoplasm & Plasmodesmata)', width - 300, 57);

    // Anatomical Cell Layers (Soil -> Root Hair -> Epidermis -> Cortex 1 -> Cortex 2 -> Endodermis -> Pericycle -> Xylem)
    const layers = [
      { name: 'Soil', sub: 'Pore Water', color: '#1c130d', x: startX },
      { name: 'Root Hair', sub: 'Epidermis', color: '#142b1e', x: startX + 70 },
      { name: 'Cortex', sub: 'Outer Cells', color: '#102e26', x: startX + 160 },
      { name: 'Cortex', sub: 'Inner Cells', color: '#102e26', x: startX + 250 },
      { name: 'Endodermis', sub: 'Casparian Strip', color: '#3b1d11', x: startX + 340, hasCasparian: true },
      { name: 'Pericycle', sub: 'Meristematic', color: '#1c2836', x: startX + 430 },
      { name: 'Root Xylem', sub: 'Stele Lumen', color: '#0f2942', x: startX + 520, isXylem: true },
    ];

    layers.forEach((layer) => {
      // Cell body
      ctx.fillStyle = layer.color;
      ctx.strokeStyle = layer.isXylem ? '#ea580c' : '#22c55e';
      ctx.lineWidth = layer.isXylem ? 3.5 : 2;
      ctx.beginPath();
      ctx.roundRect(layer.x, centerY - 100, cellW, 200, 10);
      ctx.fill();
      ctx.stroke();

      // Cell Label
      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(layer.name, layer.x + 8, centerY - 110);
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(layer.sub, layer.x + 8, centerY + 118);

      // Casparian Strip Highlight (Suberin band on Endodermis)
      if (layer.hasCasparian) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(layer.x + cellW / 2 - 6, centerY - 100, 12, 45);
        ctx.fillRect(layer.x + cellW / 2 - 6, centerY + 55, 12, 45);

        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(layer.x + cellW / 2 - 6, centerY - 100, 12, 45);
        ctx.strokeRect(layer.x + cellW / 2 - 6, centerY + 55, 12, 45);

        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = '#f87171';
        ctx.fillText('SUBERIN', layer.x + 12, centerY - 65);
        ctx.fillText('SEAL', layer.x + 18, centerY - 52);
      }

      // Xylem Lumen Star Center
      if (layer.isXylem) {
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(layer.x + cellW / 2, centerY, 32, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = '#fb923c';
        ctx.fillText('Hollow', layer.x + 18, centerY - 6);
        ctx.fillText('Lumen', layer.x + 18, centerY + 8);
      }
    });

    // Root Hair Projection to the left
    ctx.fillStyle = '#142b1e';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(startX + 10, centerY - 25, 60, 50, 12);
    ctx.fill();
    ctx.stroke();
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = '#86efac';
    ctx.fillText('Root Hair', startX + 15, centerY + 4);

    // Draw Pathways Animated Particles & Streams
    const streamSpeed = isPlaying ? (flowSpeed === 'fast' ? 2.6 : 1.2) : 0;
    const progress = ((tick * streamSpeed) % 400) / 400;

    // 1. Apoplastic Pathway (along cell walls, BLOCKED at Endodermis)
    if (rootPathwayFilter === 'both' || rootPathwayFilter === 'apoplast') {
      const apoplastEndX = startX + 340 + cellW / 2 - 6; // Stopped right at Casparian strip
      const curApoplastX = startX + 40 + progress * (apoplastEndX - startX - 40);

      // Wall line
      ctx.strokeStyle = 'rgba(248, 113, 113, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(startX + 40, centerY - 90);
      ctx.lineTo(apoplastEndX, centerY - 90);
      ctx.stroke();

      // Animated particle on wall
      if (isPlaying) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(curApoplastX, centerY - 90, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Blocked marker at Casparian
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(apoplastEndX, centerY - 98);
      ctx.lineTo(apoplastEndX, centerY - 82);
      ctx.moveTo(apoplastEndX - 6, centerY - 90);
      ctx.lineTo(apoplastEndX + 6, centerY - 90);
      ctx.stroke();

      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('BLOCKED BY CASPARIAN STRIP', apoplastEndX - 150, centerY - 72);
    }

    // 2. Symplastic Pathway (Through cytoplasm, crosses plasma membrane, ENTERS XYLEM)
    if (rootPathwayFilter === 'both' || rootPathwayFilter === 'symplast') {
      const symplastEndX = startX + 520 + cellW / 2;
      const curSymplastX = startX + 40 + progress * (symplastEndX - startX - 40);

      // Cytoplasmic channel
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(startX + 40, centerY);
      ctx.lineTo(symplastEndX, centerY);
      ctx.stroke();

      // Animated particle through symplast
      if (isPlaying) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(curSymplastX, centerY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Ion along symplast
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(curSymplastX - 25, centerY, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Enter Xylem upward turn
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(symplastEndX, centerY);
      ctx.lineTo(symplastEndX, centerY - 50);
      ctx.stroke();

      // Arrow head pointing upward
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(symplastEndX, centerY - 58);
      ctx.lineTo(symplastEndX - 5, centerY - 48);
      ctx.lineTo(symplastEndX + 5, centerY - 48);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#7dd3fc';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('Transferred into Xylem Stele', symplastEndX - 60, centerY - 62);
    }

    // Explanatory note box at bottom
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(30, height - 70, width - 60, 52, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('CRITICAL KCSE / CBC BIOLOGICAL INSIGHT:', 45, height - 52);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(
      'The Casparian strip prevents uncontrolled passive apoplastic leakage, forcing all incoming water and mineral ions through selective endodermal cell membranes (Symplast) to regulate plant nutrient composition.',
      45,
      height - 35
    );
  };

  // ==========================================================================
  // VIEW 3: STEM CROSS-SECTION (DICOT VASCULAR BUNDLE RING)
  // ==========================================================================
  const drawStemCrossSectionView = (ctx, width, height, tick) => {
    const centerX = width * 0.5;
    const centerY = height * 0.52;
    const outerR = 175;
    const cortexR = 150;
    const bundleR = 110;
    const pithR = 60;

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('DICOT STEM CROSS-SECTION: VASCULAR BUNDLE ARRANGEMENT', 30, 35);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(
      'Notice the characteristic concentric ring of vascular bundles with inner Xylem and outer Phloem',
      30,
      52
    );

    // 1. Epidermis & Cuticle Outer Ring
    ctx.fillStyle = '#14291e';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 2. Cortex Layer
    ctx.fillStyle = '#10261f';
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, cortexR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. Central Pith
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pithR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('PITH', centerX - 14, centerY + 4);

    // 4. Ring of Dicot Vascular Bundles (8 wedge-shaped bundles)
    const bundleCount = 8;
    for (let b = 0; b < bundleCount; b++) {
      const angle = (b * Math.PI * 2) / bundleCount;
      const bx = centerX + Math.cos(angle) * bundleR;
      const by = centerY + Math.sin(angle) * bundleR;

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(angle + Math.PI / 2);

      // Wedge background
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Outer Sclerenchyma Cap
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(0, -18, 10, Math.PI, Math.PI * 2);
      ctx.fill();

      // Phloem (Outer portion of bundle)
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(0, -8, 8, 0, Math.PI * 2);
      ctx.fill();

      // Vascular Cambium Line
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.lineTo(14, 0);
      ctx.stroke();

      // Xylem Vessels (Inner portion towards center, with large open lumens)
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(-6, 12, 6, 0, Math.PI * 2);
      ctx.arc(6, 12, 6, 0, Math.PI * 2);
      ctx.arc(0, 18, 5, 0, Math.PI * 2);
      ctx.fill();

      // Hollow Lumen Centers
      ctx.fillStyle = isPlaying ? '#38bdf8' : '#040d1a';
      ctx.beginPath();
      ctx.arc(-6, 12, 4, 0, Math.PI * 2);
      ctx.arc(6, 12, 4, 0, Math.PI * 2);
      ctx.arc(0, 18, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Callout Leader Lines & Labels
    // Label for Xylem
    drawCalloutLeader(
      ctx,
      centerX + 35,
      centerY + 55,
      centerX + 160,
      centerY + 100,
      'XYLEM (Inner Bundle)',
      'Large hollow dead vessels conducting water upward'
    );
    // Label for Cambium
    drawCalloutLeader(
      ctx,
      centerX + 75,
      centerY + 25,
      centerX + 180,
      centerY + 40,
      'VASCULAR CAMBIUM',
      'Secondary meristem dividing actively'
    );
    // Label for Phloem
    drawCalloutLeader(
      ctx,
      centerX + 90,
      centerY - 10,
      centerX + 180,
      centerY - 25,
      'PHLOEM (Outer Bundle)',
      'Living sieve tubes translocating sucrose'
    );
    // Label for Epidermis & Cortex
    drawCalloutLeader(
      ctx,
      centerX - 130,
      centerY - 80,
      centerX - 240,
      centerY - 110,
      'EPIDERMIS & CORTEX',
      'Protective outer layer & mechanical packing'
    );
  };

  // Helper: Draw leader line and label
  const drawCalloutLeader = (ctx, startX, startY, endX, endY, title, desc) => {
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(startX, startY, 3, 0, Math.PI * 2);
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineTo(endX + (endX > startX ? 40 : -40), endY);
    ctx.stroke();

    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(title, endX > startX ? endX + 8 : endX - 160, endY - 4);
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(desc, endX > startX ? endX + 8 : endX - 160, endY + 8);
    ctx.restore();
  };

  // ==========================================================================
  // VIEW 4: XYLEM VESSEL LONGITUDINAL VIEW (LIGNIN RINGS, COHESION & ADHESION)
  // ==========================================================================
  const drawXylemLongitudinalView = (ctx, width, height, tick) => {
    const vesselX = width * 0.35;
    const vesselW = 140;
    const vesselTop = 50;
    const vesselBottom = height - 60;

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('XYLEM VESSEL LONGITUDINAL SECTION: LIGNIN & MOLECULAR FORCES', 30, 35);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(
      `Selected Lignin Pattern: ${ligninPattern.toUpperCase()} | Non-living continuous pipe under Transpiration Pull`,
      30,
      52
    );

    // Vessel Outer Lumen Background (Dark interior of dead hollow cell)
    ctx.fillStyle = '#061321';
    ctx.fillRect(vesselX, vesselTop, vesselW, vesselBottom - vesselTop);

    // Lignified Thickened Lateral Walls
    const wallThick = 18;
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(vesselX - wallThick, vesselTop, wallThick, vesselBottom - vesselTop);
    ctx.fillRect(vesselX + vesselW, vesselTop, wallThick, vesselBottom - vesselTop);

    // Primary cellulose wall border
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(vesselX, vesselTop);
    ctx.lineTo(vesselX, vesselBottom);
    ctx.moveTo(vesselX + vesselW, vesselTop);
    ctx.lineTo(vesselX + vesselW, vesselBottom);
    ctx.stroke();

    // 1. Draw Lignin Wall Patterns (Annular, Spiral, or Pitted)
    if (ligninPattern === 'annular') {
      // Circular annular rings spaced along the vessel
      ctx.strokeStyle = '#fdba74';
      ctx.lineWidth = 6;
      for (let y = vesselTop + 30; y < vesselBottom; y += 45) {
        ctx.beginPath();
        ctx.ellipse(vesselX + vesselW / 2, y, vesselW / 2 - 4, 12, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ea580c';
        ctx.fillRect(vesselX - wallThick + 2, y - 5, wallThick - 4, 10);
        ctx.fillRect(vesselX + vesselW + 2, y - 5, wallThick - 4, 10);
      }
    } else if (ligninPattern === 'spiral') {
      // Continuous helical spiral coil of lignin
      ctx.strokeStyle = '#fdba74';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let y = vesselTop + 15; y < vesselBottom; y += 32) {
        ctx.moveTo(vesselX + 4, y);
        ctx.bezierCurveTo(vesselX + vesselW * 0.4, y + 14, vesselX + vesselW * 0.6, y + 14, vesselX + vesselW - 4, y + 26);
      }
      ctx.stroke();

      // Back half of spiral (fainter)
      ctx.strokeStyle = 'rgba(253, 186, 116, 0.3)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let y = vesselTop + 15; y < vesselBottom; y += 32) {
        ctx.moveTo(vesselX + vesselW - 4, y + 26);
        ctx.bezierCurveTo(vesselX + vesselW * 0.6, y + 36, vesselX + vesselW * 0.4, y + 36, vesselX + 4, y + 32);
      }
      ctx.stroke();
    } else if (ligninPattern === 'pitted') {
      // Dense secondary wall with Bordered Pits for lateral water exchange
      ctx.fillStyle = 'rgba(234, 88, 12, 0.45)';
      ctx.fillRect(vesselX, vesselTop, vesselW, vesselBottom - vesselTop);

      for (let y = vesselTop + 25; y < vesselBottom - 20; y += 38) {
        for (let col = 0; col < 3; col++) {
          const pitX = vesselX + 25 + col * 45;
          ctx.strokeStyle = '#fdba74';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pitX, y, 9, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#061321';
          ctx.beginPath();
          ctx.arc(pitX, y, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 2. Perforated / Dissolved End Plate (Remnant showing continuous hollow lumen)
    const plateY = vesselTop + (vesselBottom - vesselTop) * 0.5;
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.moveTo(vesselX, plateY);
    ctx.lineTo(vesselX + vesselW, plateY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('DISSOLVED END WALL (Perforation Plate)', vesselX + 15, plateY - 6);

    // 3. Animated Continuous Water Column (Cohesion & Adhesion)
    const moleculeCount = 10;
    const streamYOffset = isPlaying ? ((tick * (flowSpeed === 'fast' ? 2.5 : 1.2)) % 36) : 0;

    for (let m = 0; m < moleculeCount; m++) {
      const my = vesselBottom - 30 - m * 36 + streamYOffset;
      if (my < vesselTop + 10 || my > vesselBottom - 10) continue;

      const mx = vesselX + vesselW / 2;

      // Hydrogen Bonding Line between consecutive molecules (COHESION)
      if (m < moleculeCount - 1) {
        const nextY = my - 36;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(mx, nextY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Adhesion attractive forces to hydrophilic lignified wall
      if (m % 2 === 0) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(vesselX, my);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(vesselX + vesselW, my);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Water Molecule Body (Oxygen center + 2 Hydrogen ears)
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(mx, my, 8, 0, Math.PI * 2);
      ctx.fill();

      // Hydrogen atoms
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.arc(mx - 6, my - 5, 4, 0, Math.PI * 2);
      ctx.arc(mx + 6, my - 5, 4, 0, Math.PI * 2);
      ctx.fill();

      // Molecule label
      ctx.font = 'bold 8px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('H₂O', mx - 7, my + 3);
    }

    // 4. Tensile Pull Vector (Arrow pulling upward from leaf)
    if (isPlaying) {
      const arrowX = vesselX + vesselW / 2;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(arrowX, vesselTop + 35);
      ctx.lineTo(arrowX, vesselTop - 15);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(arrowX, vesselTop - 25);
      ctx.lineTo(arrowX - 8, vesselTop - 10);
      ctx.lineTo(arrowX + 8, vesselTop - 10);
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#7dd3fc';
      ctx.fillText(`TRANSPIRATION PULL TENSION (${metrics.tensionMPa} MPa)`, arrowX - 110, vesselTop - 32);
    }

    // Right-hand Explanation Card on Cohesion-Tension
    const cardX = width * 0.62;
    const cardY = 85;
    const cardW = width * 0.35;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, 260, 10);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('PHYSICO-CHEMICAL FORCES IN ASCENT', cardX + 15, cardY + 25);

    // Cohesion
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(cardX + 22, cardY + 55, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('1. Cohesion (Hydrogen Bonding)', cardX + 35, cardY + 58);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('H-bonds between δ- Oxygen and δ+ Hydrogen give', cardX + 35, cardY + 74);
    ctx.fillText('water extreme tensile strength (>30 MPa), preventing', cardX + 35, cardY + 88);
    ctx.fillText('the column from snapping under transpiration tension.', cardX + 35, cardY + 102);

    // Adhesion
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cardX + 22, cardY + 130, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('2. Adhesion (Capillary Support)', cardX + 35, cardY + 133);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Polar attraction between water and hydrophilic cellulose', cardX + 35, cardY + 149);
    ctx.fillText('/ lignin in vessel walls supports column weight against', cardX + 35, cardY + 163);
    ctx.fillText('gravity and maintains the meniscus.', cardX + 35, cardY + 177);

    // Lignin reinforcement
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.arc(cardX + 22, cardY + 205, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('3. Lignin Reinforcement (Anti-Implosion)', cardX + 35, cardY + 208);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Annular/spiral lignin rings prevent vessel walls from', cardX + 35, cardY + 224);
    ctx.fillText('collapsing inward under intense negative pressure.', cardX + 35, cardY + 238);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-4 md:p-6 font-sans">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
              <Droplets className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  Grade 10 Biology (CBC) · Form 2 / Form 3 KCSE
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                  Topic 2: Anatomy & Physiology of Plants
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/50">
                  Sim 5: Xylem Water Movement
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
                Xylem Water Movement: Transpiration Pull & Conduit Anatomy
              </h1>
            </div>
          </div>

          {/* Quick Scenario Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setSunlight(90);
                setTemperature(32);
                setHumidity(30);
                setWindSpeed(22);
                setSoilMoisture(85);
                setIsPlaying(true);
                setFlowSpeed('fast');
                triggerTelemetry('PRESET_ACTIVATED', { preset: 'sunny_midday' });
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Sunny Midday (High Pull)
            </button>
            <button
              onClick={() => {
                setSunlight(10);
                setTemperature(18);
                setHumidity(85);
                setWindSpeed(3);
                setSoilMoisture(90);
                setIsPlaying(true);
                setFlowSpeed('normal');
                triggerTelemetry('PRESET_ACTIVATED', { preset: 'humid_night' });
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/20 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Droplets className="w-3.5 h-3.5 text-indigo-400" />
              Humid Night (Root Pressure)
            </button>
            <button
              onClick={() => {
                setSunlight(85);
                setTemperature(35);
                setHumidity(20);
                setWindSpeed(25);
                setSoilMoisture(15);
                setIsPlaying(true);
                triggerTelemetry('PRESET_ACTIVATED', { preset: 'drought_stress' });
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/40 text-rose-300 hover:bg-rose-500/20 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              Drought Stress (Cavitation Risk)
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer transition-all flex items-center gap-1.5"
              title="Restore initial resting state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* MAIN DUAL COLUMN LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: VISUALIZER CANVAS + VIEW SELECTOR (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
            {/* Top Toolbar: View Mode Tabs & Primary Flow Controller */}
            <div className="p-3 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              {/* Interactive View Switcher Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => handleSelectViewMode('whole_plant')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'whole_plant'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Whole Plant Conduit
                </button>
                <button
                  onClick={() => handleSelectViewMode('root_cross_section')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'root_cross_section'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Microscope className="w-3.5 h-3.5" />
                  Root Cross-Section
                </button>
                <button
                  onClick={() => handleSelectViewMode('stem_cross_section')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'stem_cross_section'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Stem Cross-Section
                </button>
                <button
                  onClick={() => handleSelectViewMode('xylem_longitudinal')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'xylem_longitudinal'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Xylem Longitudinal (Lignin)
                </button>
              </div>

              {/* PRIMARY FLOW CONTROLLER (Start/Pause & Speed Toggle) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePlay}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                    isPlaying
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25 animate-pulse'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      Pause Flow
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Start Water Flow
                    </>
                  )}
                </button>

                {/* Speed Toggle (Normal vs Fast) */}
                <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-700">
                  <button
                    onClick={() => handleToggleSpeed('normal')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      flowSpeed === 'normal'
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Normal (1x)
                  </button>
                  <button
                    onClick={() => handleToggleSpeed('fast')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      flowSpeed === 'fast'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Fast (2.5x)
                  </button>
                </div>
              </div>
            </div>

            {/* Contextual Sub-bar based on active view */}
            {viewMode === 'xylem_longitudinal' && (
              <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Lignin Thickening Pattern:
                </span>
                <div className="flex items-center gap-1">
                  {['annular', 'spiral', 'pitted'].map((pat) => (
                    <button
                      key={pat}
                      onClick={() => {
                        setLigninPattern(pat);
                        triggerTelemetry('LIGNIN_PATTERN_CHANGED', { pattern: pat });
                      }}
                      className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all cursor-pointer ${
                        ligninPattern === pat
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {pat} Rings
                    </button>
                  ))}
                </div>
              </div>
            )}

            {viewMode === 'root_cross_section' && (
              <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Microscope className="w-3.5 h-3.5 text-emerald-400" />
                  Filter Route:
                </span>
                <div className="flex items-center gap-1">
                  {[
                    { id: 'both', label: 'Both Pathways' },
                    { id: 'apoplast', label: 'Apoplast Only (Blocked)' },
                    { id: 'symplast', label: 'Symplast Only (Enters Xylem)' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setRootPathwayFilter(p.id);
                        triggerTelemetry('ROOT_PATHWAY_FILTER_CHANGED', { pathway: p.id });
                      }}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        rootPathwayFilter === p.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* HTML5 Interactive Rendering Canvas */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[420px] max-h-[580px] bg-slate-950">
              <canvas
                ref={canvasRef}
                width={840}
                height={520}
                className="w-full h-full object-contain block cursor-crosshair"
              />

              {/* Live Flow Status Overlay */}
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isPlaying ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'
                  }`}
                />
                <span className="font-semibold text-slate-200">
                  Status: {isPlaying ? 'Ascending Stream Active' : 'Resting / Flow Paused'}
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-cyan-300 font-mono">
                  {metrics.velocity} cm/h
                </span>
              </div>
            </div>
          </div>

          {/* REAL-TIME SCIENTIFIC METRICS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                Transpiration Pull
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-bold text-cyan-300 font-mono">
                  {metrics.tensionMPa}
                </span>
                <span className="text-xs text-slate-400">MPa</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                Negative tension pull
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                Sap Ascent Speed
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-bold text-emerald-300 font-mono">
                  {metrics.velocity}
                </span>
                <span className="text-xs text-slate-400">cm/h</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                Unidirectional mass flow
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Transpiration Rate
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-bold text-amber-300 font-mono">
                  {metrics.transRate}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                Stomatal vapor loss
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Water Column
              </span>
              <div className="mt-1">
                <span className={`text-xs font-semibold ${metrics.columnColor}`}>
                  {metrics.columnStatus.split(' ')[0]}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                Cohesion tensile stability
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTROLS, PATHWAY STEPPER, INSPECTOR & QUIZ (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Navigation Pill Tabs for Right-hand Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 flex items-center gap-1">
            {[
              { id: 'controls', label: 'Drivers', icon: Sliders },
              { id: 'pathway', label: 'Pathway', icon: ArrowRight },
              { id: 'inspector', label: 'Anatomy', icon: BookOpen },
              { id: 'quiz', label: 'Quiz', icon: CheckCircle2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    triggerTelemetry('PANEL_TAB_CHANGED', { tab: tab.id });
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: ENVIRONMENTAL DRIVERS & TRANSPIRATION FACTORS */}
          {activeTab === 'controls' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex flex-col gap-4 shadow-xl">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Environmental Drivers of Ascent
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust variables to test how Transpiration Pull regulates xylem flow speed.
                </p>
              </div>

              {/* Sunlight Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    Sunlight / Light Intensity:
                  </span>
                  <span className="font-mono text-amber-300 font-bold">{sunlight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sunlight}
                  onChange={(e) => setSunlight(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <p className="text-[10px] text-slate-400">
                  Opens stomata and drives photosynthesis; increases transpiration pull.
                </p>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                    Ambient Temperature:
                  </span>
                  <span className="font-mono text-rose-300 font-bold">{temperature}°C</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="40"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <p className="text-[10px] text-slate-400">
                  Elevates kinetic energy and accelerates water evaporation from mesophyll cells.
                </p>
              </div>

              {/* Humidity Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    Relative Humidity:
                  </span>
                  <span className="font-mono text-blue-300 font-bold">{humidity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full accent-blue-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <p className="text-[10px] text-slate-400">
                  High air humidity reduces the diffusion gradient, slowing down transpiration.
                </p>
              </div>

              {/* Wind Speed Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-teal-400" />
                    Wind Velocity:
                  </span>
                  <span className="font-mono text-teal-300 font-bold">{windSpeed} km/h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <p className="text-[10px] text-slate-400">
                  Blows away humid boundary layer over leaves, steepening the vapor gradient.
                </p>
              </div>

              {/* Soil Moisture Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    Soil Moisture Content:
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">{soilMoisture}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <p className="text-[10px] text-slate-400">
                  Adequate soil water maintains high root water potential and uninterrupted inflow.
                </p>
              </div>

              {/* Lignin & Cavitation Warning Callout */}
              <div className={`p-3 rounded-2xl border text-xs ${metrics.columnBadgeBg}`}>
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  Xylem Column State:
                </div>
                <p className="text-[11px] leading-relaxed text-slate-200">
                  {metrics.columnStatus}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: 6-STAGE PATHWAY STEPPER */}
          {activeTab === 'pathway' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex flex-col gap-4 shadow-xl">
              <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    6-Stage Water Route
                  </h3>
                  <p className="text-xs text-slate-400">
                    From soil absorption to stomatal vapor release
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-1 rounded-lg border border-cyan-800">
                  Stage {activePathwayStep + 1} / 6
                </span>
              </div>

              {/* Stage Selector Buttons */}
              <div className="grid grid-cols-6 gap-1">
                {PATHWAY_STAGES.map((s, idx) => (
                  <button
                    key={s.stage}
                    onClick={() => {
                      setActivePathwayStep(idx);
                      setSelectedAnatomyKey(s.focusArea);
                      triggerTelemetry('PATHWAY_STAGE_SELECTED', { stage: s.stage });
                    }}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activePathwayStep === idx
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.stage}
                  </button>
                ))}
              </div>

              {/* Active Step Details */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <h4 className="text-sm font-bold text-cyan-300">
                    {PATHWAY_STAGES[activePathwayStep].title}
                  </h4>
                </div>
                <div className="text-xs font-semibold text-emerald-400">
                  {PATHWAY_STAGES[activePathwayStep].subtitle}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {PATHWAY_STAGES[activePathwayStep].description}
                </p>
              </div>

              {/* Prev / Next Controls */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  disabled={activePathwayStep === 0}
                  onClick={() => setActivePathwayStep((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  Previous Stage
                </button>
                <button
                  disabled={activePathwayStep === PATHWAY_STAGES.length - 1}
                  onClick={() =>
                    setActivePathwayStep((prev) => Math.min(PATHWAY_STAGES.length - 1, prev + 1))
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  Next Stage
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MICROSCOPIC ANATOMY INSPECTOR */}
          {activeTab === 'inspector' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex flex-col gap-4 shadow-xl">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  Anatomical Structure Inspector
                </h3>
                <p className="text-xs text-slate-400">
                  Select any plant tissue to explore its cellular modifications for water transport.
                </p>
              </div>

              {/* Structure Selection Chips */}
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(ANATOMY_DETAILS).map((key) => {
                  const item = ANATOMY_DETAILS[key];
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedAnatomyKey(key);
                        triggerTelemetry('ANATOMY_INSPECTED', { key });
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                        selectedAnatomyKey === key
                          ? 'bg-cyan-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {item.name.split('(')[0]}
                    </button>
                  );
                })}
              </div>

              {/* Selected Structure Card */}
              {selectedAnatomyKey && ANATOMY_DETAILS[selectedAnatomyKey] && (
                <div className="bg-slate-950/80 border border-cyan-800/50 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-cyan-300">
                      {ANATOMY_DETAILS[selectedAnatomyKey].name}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 font-mono text-slate-300">
                      {ANATOMY_DETAILS[selectedAnatomyKey].living.includes('Non-living')
                        ? 'Dead Cell'
                        : 'Living Cell'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Cellular Nature:
                    </span>
                    <p className="text-xs text-slate-200 mt-0.5">
                      {ANATOMY_DETAILS[selectedAnatomyKey].living}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                      Physiological Role in Water Movement:
                    </span>
                    <p className="text-xs text-slate-200 mt-0.5">
                      {ANATOMY_DETAILS[selectedAnatomyKey].role}
                    </p>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Structural Adaptation:
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {ANATOMY_DETAILS[selectedAnatomyKey].adaptation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GRADE 10 CBC / KCSE SELF-CHECK QUIZ */}
          {activeTab === 'quiz' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex flex-col gap-4 shadow-xl">
              <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Concept Assessment
                  </h3>
                  <p className="text-xs text-slate-400">
                    Grade 10 Plant Physiology Checkpoint
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {currentQuizIdx + 1} / {ASSESSMENT_QUESTIONS.length}
                </span>
              </div>

              {/* Active Question Prompt */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-cyan-400">
                  {ASSESSMENT_QUESTIONS[currentQuizIdx].title}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {ASSESSMENT_QUESTIONS[currentQuizIdx].prompt}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {ASSESSMENT_QUESTIONS[currentQuizIdx].options.map((opt) => {
                  const qId = ASSESSMENT_QUESTIONS[currentQuizIdx].id;
                  const selected = userQuizAnswers[qId] === opt.id;
                  const isCorrect = opt.correct;
                  const answered = !!userQuizAnswers[qId];

                  let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700';
                  if (answered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (selected && !isCorrect) {
                      btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectQuizAnswer(qId, opt.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-start gap-2 ${btnStyle}`}
                    >
                      <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900/60 text-slate-300">
                        {opt.id}
                      </span>
                      <span className="leading-snug">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Rationale / Explanation Card */}
              {userQuizAnswers[ASSESSMENT_QUESTIONS[currentQuizIdx].id] && (
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                    <Info className="w-3.5 h-3.5" />
                    Pedagogical Explanation:
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {ASSESSMENT_QUESTIONS[currentQuizIdx].explanation}
                  </p>
                </div>
              )}

              {/* Quiz Navigation & Submit */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <button
                  disabled={currentQuizIdx === 0}
                  onClick={() => setCurrentQuizIdx((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 cursor-pointer transition-all"
                >
                  Prev
                </button>
                {currentQuizIdx < ASSESSMENT_QUESTIONS.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuizIdx((prev) => prev + 1)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleCalculateQuizScore}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-md transition-all"
                  >
                    Finish & View Score
                  </button>
                )}
              </div>

              {/* Quiz Score Modal / Banner */}
              {quizScore !== null && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-600/60 text-center space-y-1">
                  <div className="text-xs font-bold text-emerald-300">
                    Assessment Completed!
                  </div>
                  <div className="text-xl font-extrabold text-white">
                    Score: {quizScore} / {ASSESSMENT_QUESTIONS.length} (
                    {Math.round((quizScore / ASSESSMENT_QUESTIONS.length) * 100)}%)
                  </div>
                  <p className="text-[10px] text-emerald-200">
                    Checkpoint verified. Review explanations above to master xylem water transport concepts.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
