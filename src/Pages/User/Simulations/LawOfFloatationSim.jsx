import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Info,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Gauge,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Layers,
  ArrowRight,
  TrendingUp,
  Anchor,
  Waves,
  Ship,
  Box,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Flame,
  Scale,
  Compass,
} from 'lucide-react';

// Real-world water environments with measured physical densities (kg/m³)
const WATER_ENVIRONMENTS = [
  {
    id: 'tropical_fresh',
    name: 'Tropical Fresh Water (TF)',
    density: 997,
    salinity: '0 ppt',
    temp: '30°C',
    region: 'Amazon / Congo Basin',
    color: '#0284c7',
    waterGradient: ['rgba(14, 165, 233, 0.55)', 'rgba(3, 105, 161, 0.85)'],
    badge: 'TF Mark',
  },
  {
    id: 'fresh_water',
    name: 'Temperate Fresh Water (F)',
    density: 1000,
    salinity: '0 ppt',
    temp: '4°C',
    region: 'Great Lakes / River Rhine',
    color: '#06b6d4',
    waterGradient: ['rgba(6, 182, 212, 0.55)', 'rgba(14, 116, 144, 0.85)'],
    badge: 'F Mark',
  },
  {
    id: 'brackish',
    name: 'Brackish Estuary',
    density: 1012,
    salinity: '15 ppt',
    temp: '18°C',
    region: 'Baltic Sea / Chesapeake Bay',
    color: '#14b8a6',
    waterGradient: ['rgba(20, 184, 166, 0.55)', 'rgba(15, 118, 110, 0.85)'],
    badge: 'Estuary',
  },
  {
    id: 'tropical_sea',
    name: 'Tropical Sea Water (T)',
    density: 1020,
    salinity: '34 ppt',
    temp: '28°C',
    region: 'Red Sea / Caribbean / Indian Ocean',
    color: '#0ea5e9',
    waterGradient: ['rgba(14, 165, 233, 0.6)', 'rgba(2, 132, 199, 0.9)'],
    badge: 'T Mark',
  },
  {
    id: 'summer_sea',
    name: 'Summer Temperate Ocean (S)',
    density: 1025,
    salinity: '35 ppt',
    temp: '15°C',
    region: 'Standard Reference (North Atlantic)',
    color: '#3b82f6',
    waterGradient: ['rgba(59, 130, 246, 0.6)', 'rgba(29, 78, 216, 0.9)'],
    badge: 'S Mark (Base)',
  },
  {
    id: 'winter_sea',
    name: 'Winter Temperate Ocean (W)',
    density: 1030,
    salinity: '35.5 ppt',
    temp: '4°C',
    region: 'North Sea / Southern Ocean',
    color: '#6366f1',
    waterGradient: ['rgba(99, 102, 241, 0.6)', 'rgba(67, 56, 202, 0.9)'],
    badge: 'W Mark',
  },
  {
    id: 'winter_na',
    name: 'Winter North Atlantic (WNA)',
    density: 1033,
    salinity: '36.5 ppt',
    temp: '2°C',
    region: 'Extreme North Atlantic (>36°N)',
    color: '#8b5cf6',
    waterGradient: ['rgba(139, 92, 246, 0.65)', 'rgba(109, 40, 217, 0.92)'],
    badge: 'WNA Mark',
  },
  {
    id: 'dead_sea',
    name: 'Dead Sea / Hypersaline Lake',
    density: 1240,
    salinity: '340 ppt',
    temp: '25°C',
    region: 'Jordan Rift Valley (Hypersaline)',
    color: '#ec4899',
    waterGradient: ['rgba(236, 72, 153, 0.55)', 'rgba(190, 24, 93, 0.9)'],
    badge: 'Hypersaline',
  },
];

// Physical parameters of container ship "SS Archimedes"
const SHIP_SPECS = {
  name: 'SS Archimedes',
  type: 'Feeder Container Carrier (IMO 9845120)',
  moldedDepth: 14.0, // meters: height from bottom keel to main deck line
  waterplaneArea: 1800, // m²: effective horizontal waterplane area A_wp
  totalInternalVolume: 22000, // m³: total enclosed buoyant hull volume V_total
  lightshipMass: 6000, // tonnes: empty vessel mass without cargo
  maxCargoCapacity: 18000, // tonnes: max physical cargo hold limit
  summerDraftLimit: 8.80, // meters: Plimsoll line 'S' draft mark in 1025 kg/m³
  keelToHullCenter: 5.0, // meters: Center of mass of empty hull above keel
  cargoCenterHeight: 8.5, // meters: Average height of cargo center of mass
};

// Plimsoll line marks defined relative to standard Summer load limit
// In Summer Sea Water (rho = 1025 kg/m³), legal displacement = 16,236 tonnes -> draft = 8.80m
const LEGAL_SUMMER_DISPLACEMENT = SHIP_SPECS.summerDraftLimit * SHIP_SPECS.waterplaneArea * 1.025; // 16,236 tonnes

// Function to calculate exact Plimsoll line draft mark in meters on hull for each standard line
const getPlimsollLines = () => {
  return {
    TF: {
      name: 'Tropical Fresh Water',
      label: 'TF',
      draft: LEGAL_SUMMER_DISPLACEMENT / (0.997 * SHIP_SPECS.waterplaneArea), // ~9.047 m
      density: 997,
      color: '#38bdf8',
      desc: 'Deepest immersion permitted; warmest, lowest density water.',
    },
    F: {
      name: 'Fresh Water',
      label: 'F',
      draft: LEGAL_SUMMER_DISPLACEMENT / (1.000 * SHIP_SPECS.waterplaneArea), // ~9.020 m
      density: 1000,
      color: '#22d3ee',
      desc: 'Freshwater rivers, canals, and lakes in temperate climates.',
    },
    T: {
      name: 'Tropical Sea Water',
      label: 'T',
      draft: LEGAL_SUMMER_DISPLACEMENT / (1.020 * SHIP_SPECS.waterplaneArea), // ~8.843 m
      density: 1020,
      color: '#34d399',
      desc: 'Warm sea water with lower density due to thermal expansion.',
    },
    S: {
      name: 'Summer Temperate Ocean',
      label: 'S',
      draft: 8.80, // Baseline center of Plimsoll disk (1025 kg/m³)
      density: 1025,
      color: '#fbbf24',
      desc: 'Primary reference load line level with center of Plimsoll disk.',
    },
    W: {
      name: 'Winter Sea Water',
      label: 'W',
      draft: LEGAL_SUMMER_DISPLACEMENT / (1.030 * SHIP_SPECS.waterplaneArea), // ~8.757 m
      density: 1030,
      color: '#a78bfa',
      desc: 'Cold sea water; extra freeboard reserved for rough winter storms.',
    },
    WNA: {
      name: 'Winter North Atlantic',
      label: 'WNA',
      draft: 8.55, // Extra 2 inches / 50 mm below W for harsh North Atlantic gales
      density: 1033,
      color: '#f43f5e',
      desc: 'Strictest commercial limit for treacherous winter North Atlantic gales.',
    },
  };
};

const PLIMSOLL_MARKS = getPlimsollLines();

// 4 Pedagogical Physical Presets
const PRESETS = [
  {
    id: 'unladen_ocean',
    name: 'Unladen Container Ship in Ocean',
    tagline: 'High Freeboard • Maximum Reserve Buoyancy',
    cargoMass: 0,
    waterEnvId: 'summer_sea',
    desc: 'Empty cargo holds in open ocean (1,025 kg/m³). Low draft, high freeboard, exceptionally buoyant.',
  },
  {
    id: 'river_to_ocean',
    name: 'Freshwater River to Ocean Transition',
    tagline: 'Density Transition & Draft Uplift',
    cargoMass: 7200,
    waterEnvId: 'fresh_water',
    desc: 'Medium cargo payload in river freshwater (1,000 kg/m³). Switch to Ocean to observe ship rise as water density increases.',
  },
  {
    id: 'tropical_heavy',
    name: 'Tropical Harbor Heavy Loading',
    tagline: 'Near Tropical (T) Plimsoll Limit',
    cargoMass: 10200,
    waterEnvId: 'tropical_sea',
    desc: 'Heavily laden ship docked in warm tropical sea water (1,020 kg/m³), loaded precisely to the Tropical mark.',
  },
  {
    id: 'critical_overload',
    name: 'Critical Overload & Foundering',
    tagline: 'Submergence Hazard • Zero Reserve Freeboard',
    cargoMass: 16500,
    waterEnvId: 'tropical_fresh',
    desc: 'Severe overload test. The waterline rises above the safe Plimsoll line, illustrating catastrophic freeboard loss.',
  },
];

// 3 Guided Inquiry Challenges
const CHALLENGES = [
  {
    id: 'rhine_river_loading',
    title: 'Challenge 1: Safe Freshwater River Loading',
    difficulty: 'Introductory',
    hint: 'Select Temperate Fresh Water (1,000 kg/m³). Adjust cargo so the draft reaches within 0.12 m of the Freshwater (F) mark (9.02 m) without exceeding it.',
    preset: { cargoMass: 4000, waterEnvId: 'fresh_water' },
    check: (phys) =>
      phys.waterDensity === 1000 &&
      phys.draft >= 8.85 &&
      phys.draft <= 9.02 &&
      !phys.isOverloaded,
    congrats:
      'Mastered! You loaded SS Archimedes right up to the Fresh Water (F) Plimsoll line. Notice that the lower density of river water requires greater submerged volume to balance the weight.',
  },
  {
    id: 'ocean_to_tropical_fresh',
    title: 'Challenge 2: The Ocean-to-River Density Drop',
    difficulty: 'Intermediate',
    hint: 'When moving from Temperate Ocean (1,025 kg/m³) to Tropical Fresh Water (997 kg/m³), the ship sinks deeper! Tune cargo in Tropical Fresh Water so draft is below 9.05 m (TF line) and freeboard is safe.',
    preset: { cargoMass: 11000, waterEnvId: 'tropical_fresh' },
    check: (phys) =>
      phys.waterDensity === 997 &&
      phys.draft >= 8.60 &&
      phys.draft <= 9.05 &&
      !phys.isOverloaded,
    congrats:
      'Superb calculation! Because tropical freshwater is warm and salt-free (rho = 997 kg/m³), the ship displaces more volume (V = M / rho). You safely prevented freeboard violation!',
  },
  {
    id: 'dead_sea_buoyancy',
    title: 'Challenge 3: Hypersaline High-Density Paradox',
    difficulty: 'Advanced',
    hint: 'Navigate to Dead Sea / Hypersaline water (1,240 kg/m³) with heavy cargo (>= 9,000 t). Observe how the dense fluid keeps the draft below 7.0 m with over 50% reserve freeboard.',
    preset: { cargoMass: 9500, waterEnvId: 'dead_sea' },
    check: (phys) =>
      phys.waterDensity === 1240 &&
      phys.cargoMass >= 9000 &&
      phys.draft <= 7.0 &&
      phys.reserveBuoyancyPct >= 50,
    congrats:
      'Phenomenal discovery! Due to intense salinity (340 ppt), the buoyant upthrust per cubic meter (rho * g) is ~21% higher than regular seawater, resulting in dramatic draft reduction!',
  },
];

export default function LawOfFloatationSim({ onTelemetry }) {
  // State
  const [cargoMass, setCargoMass] = useState(7200); // tonnes
  const [selectedEnvId, setSelectedEnvId] = useState('summer_sea');
  const [customDensity, setCustomDensity] = useState(1025); // kg/m³
  const [useCustomDensity, setUseCustomDensity] = useState(false);
  const [showVectors, setShowVectors] = useState(true);
  const [showCenters, setShowCenters] = useState(true);
  const [showPlimsollZoom, setShowPlimsollZoom] = useState(true);
  const [isAnimatingWaves, setIsAnimatingWaves] = useState(true);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [craneActive, setCraneActive] = useState(false);

  // References
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const waveTimeRef = useRef(0);
  const sinkDepthOffsetRef = useRef(0);
  const craneTrolleyPosRef = useRef(140);
  const craneHookYRef = useRef(100);

  // Current water environment
  const currentEnv =
    WATER_ENVIRONMENTS.find((e) => e.id === selectedEnvId) || WATER_ENVIRONMENTS[4];
  const waterDensity = useCustomDensity ? customDensity : currentEnv.density;

  // Physical calculations
  const calculatePhysics = useCallback(() => {
    const g = 9.81; // m/s²
    const totalMassTonnes = SHIP_SPECS.lightshipMass + cargoMass;
    const totalMassKg = totalMassTonnes * 1000;
    const totalWeightN = totalMassKg * g; // Newtons
    const totalWeightMN = totalWeightN / 1e6; // MegaNewtons

    // Internal hull enclosed volume
    const V_total = SHIP_SPECS.totalInternalVolume; // m³
    const A_wp = SHIP_SPECS.waterplaneArea; // m²
    const D = SHIP_SPECS.moldedDepth; // 14.0 m

    // Average ship density: rho_avg = M_total / V_total
    const averageShipDensity = totalMassKg / V_total; // kg/m³

    // Maximum possible buoyant displacement when hull is 100% submerged
    const maxDisplacementMassTonnes = (waterDensity * V_total) / 1000;
    const maxBuoyancyN = waterDensity * V_total * g;
    const maxBuoyancyMN = maxBuoyancyN / 1e6;

    // Check catastrophic sinking condition: rho_avg > rho_fluid
    const isSinking = averageShipDensity > waterDensity;

    // Equilibrium draft d = V_sub / A_wp = M_total / (rho_fluid * A_wp)
    let draft = totalMassKg / (waterDensity * A_wp); // meters
    let submergedVolume = totalMassKg / waterDensity; // m³
    let upthrustN = totalWeightN; // At equilibrium, Upthrust = Weight

    if (isSinking) {
      draft = D + 1.8; // Submerged past deck level
      submergedVolume = V_total;
      upthrustN = maxBuoyancyN; // Limited by total hull volume
    }

    const upthrustMN = upthrustN / 1e6;
    const netForceN = isSinking ? totalWeightN - maxBuoyancyN : 0;
    const netForceMN = netForceN / 1e6;

    // Freeboard F = Molded Depth - Draft
    const freeboard = Math.max(0, D - draft);
    const submergedVolumeRatio = Math.min(1.0, submergedVolume / V_total);
    const reserveBuoyancyPct = Math.max(0, (1 - submergedVolumeRatio) * 100);

    // Plimsoll limit draft for the CURRENT water density:
    // Plimsoll line marks the maximum legal draft corresponding to legal summer displacement
    const legalDraftLimit = LEGAL_SUMMER_DISPLACEMENT / ((waterDensity / 1000) * A_wp);
    const plimsollSafetyMargin = legalDraftLimit - draft; // Positive = safe, Negative = overload
    const isOverloaded = plimsollSafetyMargin < -0.01;

    // Centers:
    // Center of Buoyancy (B): centroid of submerged draft d/2 above keel
    const yBuoyancy = isSinking ? D * 0.45 : draft / 2;

    // Center of Gravity (G): combined mass centroid
    const yGravity =
      (SHIP_SPECS.lightshipMass * SHIP_SPECS.keelToHullCenter +
        cargoMass * SHIP_SPECS.cargoCenterHeight) /
      totalMassTonnes;

    // Metacentric height indicator (longitudinal/transverse stability concept)
    const metacentricHeightGM = 2.4 - (yGravity - 6.0) * 0.4;

    // Containers count (assuming 20 tonnes per standard 20ft container)
    const containerCount = Math.round(cargoMass / 20);

    return {
      g,
      cargoMass,
      lightshipMass: SHIP_SPECS.lightshipMass,
      totalMassTonnes,
      totalMassKg,
      totalWeightMN,
      totalWeightN,
      waterDensity,
      averageShipDensity,
      maxDisplacementMassTonnes,
      maxBuoyancyMN,
      isSinking,
      draft,
      freeboard,
      submergedVolume,
      submergedVolumeRatio,
      reserveBuoyancyPct,
      legalDraftLimit,
      plimsollSafetyMargin,
      isOverloaded,
      upthrustMN,
      upthrustN,
      netForceMN,
      yBuoyancy,
      yGravity,
      metacentricHeightGM,
      containerCount,
      moldedDepth: D,
      waterplaneArea: A_wp,
    };
  }, [cargoMass, waterDensity]);

  const phys = calculatePhysics();

  // Telemetry notification helper
  const emitTelemetry = useCallback(
    (eventName, payload) => {
      if (typeof onTelemetry === 'function') {
        try {
          onTelemetry(eventName, {
            simulationKey: 'law_of_floatation_equilibrium',
            timestamp: Date.now(),
            ...payload,
          });
        } catch (e) {
          console.warn('Telemetry invocation error:', e);
        }
      }
    },
    [onTelemetry]
  );

  // Monitor challenges
  useEffect(() => {
    if (activeChallenge && !challengeCompleted) {
      if (activeChallenge.check(phys)) {
        setChallengeCompleted(true);
        emitTelemetry('SIMULATION_CHALLENGE_COMPLETED', {
          challengeId: activeChallenge.id,
          cargoMass: phys.cargoMass,
          waterDensity: phys.waterDensity,
          draft: phys.draft,
        });
      }
    }
  }, [phys, activeChallenge, challengeCompleted, emitTelemetry]);

  // Monitor overload hazard warning telemetry
  useEffect(() => {
    if (phys.isOverloaded) {
      emitTelemetry('SIMULATION_HAZARD_TRIGGERED', {
        hazardType: 'PLIMSOLL_FREEBOARD_OVERLOAD',
        cargoMass: phys.cargoMass,
        draft: phys.draft,
        waterDensity: phys.waterDensity,
        margin: phys.plimsollSafetyMargin,
      });
    }
  }, [phys.isOverloaded, phys.cargoMass, phys.draft, phys.waterDensity, phys.plimsollSafetyMargin, emitTelemetry]);

  // Apply preset
  const handleApplyPreset = (p) => {
    setCargoMass(p.cargoMass);
    setSelectedEnvId(p.waterEnvId);
    setUseCustomDensity(false);
    setActiveChallenge(null);
    setChallengeCompleted(false);
    sinkDepthOffsetRef.current = 0;

    emitTelemetry('SIMULATION_PRESET_SELECTED', {
      presetId: p.id,
      cargoMass: p.cargoMass,
      waterEnvId: p.waterEnvId,
    });
  };

  // Start Challenge
  const handleStartChallenge = (ch) => {
    setActiveChallenge(ch);
    setChallengeCompleted(false);
    setCargoMass(ch.preset.cargoMass);
    setSelectedEnvId(ch.preset.waterEnvId);
    setUseCustomDensity(false);
    sinkDepthOffsetRef.current = 0;

    emitTelemetry('SIMULATION_CHALLENGE_STARTED', { challengeId: ch.id });
  };

  // Reset
  const handleReset = () => {
    setCargoMass(7200);
    setSelectedEnvId('summer_sea');
    setCustomDensity(1025);
    setUseCustomDensity(false);
    setActiveChallenge(null);
    setChallengeCompleted(false);
    sinkDepthOffsetRef.current = 0;

    emitTelemetry('SIMULATION_RESET', {});
  };

  // Cargo quick adjustments
  const handleAddCargo = (delta) => {
    setCargoMass((prev) => {
      const next = Math.max(0, Math.min(SHIP_SPECS.maxCargoCapacity, prev + delta));
      setCraneActive(true);
      setTimeout(() => setCraneActive(false), 900);
      return next;
    });
  };

  const handleFillToPlimsoll = () => {
    // Calculate exact maximum legal cargo for current water density
    const maxLegalDisplacementTonnes = (phys.legalDraftLimit * SHIP_SPECS.waterplaneArea * (waterDensity / 1000));
    const targetCargo = Math.max(0, Math.round(maxLegalDisplacementTonnes - SHIP_SPECS.lightshipMass));
    setCargoMass(Math.min(SHIP_SPECS.maxCargoCapacity, targetCargo));
    setCraneActive(true);
    setTimeout(() => setCraneActive(false), 1200);
  };

  // HTML5 Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      if (isAnimatingWaves) {
        waveTimeRef.current += 0.04;
      }

      const W = canvas.width;
      const H = canvas.height;

      // Handle sinking descent animation
      if (phys.isSinking) {
        if (sinkDepthOffsetRef.current < 85) {
          sinkDepthOffsetRef.current += 0.6;
        }
      } else {
        if (sinkDepthOffsetRef.current > 0) {
          sinkDepthOffsetRef.current -= 1.2;
          if (sinkDepthOffsetRef.current < 0) sinkDepthOffsetRef.current = 0;
        }
      }

      ctx.clearRect(0, 0, W, H);

      // 1. SKY & BACKGROUND
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.62);
      skyGrad.addColorStop(0, '#030712');
      skyGrad.addColorStop(0.55, '#0f172a');
      skyGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Subtle celestial sun / warm glow in horizon
      const sunGrad = ctx.createRadialGradient(W * 0.82, 60, 4, W * 0.82, 60, 140);
      sunGrad.addColorStop(0, 'rgba(253, 224, 71, 0.45)');
      sunGrad.addColorStop(0.4, 'rgba(251, 146, 60, 0.18)');
      sunGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(W * 0.82, 60, 140, 0, Math.PI * 2);
      ctx.fill();

      // Sun disk
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(W * 0.82, 60, 14, 0, Math.PI * 2);
      ctx.fill();

      // Distant harbor headland / breakwater silhouettes
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.moveTo(0, H * 0.54);
      ctx.lineTo(80, H * 0.52);
      ctx.lineTo(190, H * 0.54);
      ctx.lineTo(260, H * 0.56);
      ctx.lineTo(340, H * 0.54);
      ctx.lineTo(W, H * 0.56);
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();

      // Lighthouse on distant spit
      ctx.fillStyle = '#334155';
      ctx.fillRect(W * 0.92, H * 0.46, 12, 38);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(W * 0.92, H * 0.48, 12, 8);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(W * 0.93, H * 0.46, 8, 6); // Lantern light

      // 2. CONTAINER PORT QUAY / DOCK CRANE (Left edge)
      const dockWidth = 110;
      const dockTopY = H * 0.52;

      // Concrete quay wall
      const dockGrad = ctx.createLinearGradient(0, dockTopY, dockWidth, dockTopY);
      dockGrad.addColorStop(0, '#1e293b');
      dockGrad.addColorStop(0.85, '#334155');
      dockGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = dockGrad;
      ctx.fillRect(0, dockTopY, dockWidth, H - dockTopY);

      // Quay safety curb & bollards
      ctx.fillStyle = '#f59e0b';
      for (let bx = 0; bx < dockWidth - 8; bx += 16) {
        ctx.fillRect(bx, dockTopY - 4, 10, 4);
      }
      ctx.fillStyle = '#0f172a';
      for (let bx = 10; bx < dockWidth - 8; bx += 16) {
        ctx.fillRect(bx, dockTopY - 4, 6, 4);
      }

      // Mooring bollard
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.roundRect(dockWidth - 20, dockTopY - 14, 12, 10, 3);
      ctx.fill();

      // Gantry Crane Structure
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      // Crane leg left
      ctx.beginPath();
      ctx.moveTo(15, dockTopY - 4);
      ctx.lineTo(35, 70);
      ctx.lineTo(dockWidth - 10, 70);
      ctx.lineTo(dockWidth - 25, dockTopY - 4);
      ctx.stroke();

      // Crane horizontal gantry boom extending over water
      const boomY = 65;
      const boomLength = 320;
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(25, boomY - 6, boomLength, 12);
      ctx.strokeStyle = '#fb923c';
      ctx.lineWidth = 1.5;
      // Cross braces on boom
      for (let gx = 35; gx < boomLength + 20; gx += 28) {
        ctx.beginPath();
        ctx.moveTo(gx, boomY - 6);
        ctx.lineTo(gx + 14, boomY + 6);
        ctx.lineTo(gx + 28, boomY - 6);
        ctx.stroke();
      }

      // Operator cab on crane
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(45, boomY + 8, 24, 20);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(49, boomY + 12, 16, 12);

      // Crane trolley & hoist
      if (craneActive) {
        craneTrolleyPosRef.current = 140 + Math.sin(waveTimeRef.current * 4) * 55;
        craneHookYRef.current = 130 + Math.sin(waveTimeRef.current * 3) * 30;
      } else {
        craneTrolleyPosRef.current = 150;
        craneHookYRef.current = 120;
      }

      const trolleyX = craneTrolleyPosRef.current;
      const hookY = craneHookYRef.current;

      // Trolley box
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(trolleyX - 12, boomY + 6, 24, 10);

      // Hoist cables
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(trolleyX - 6, boomY + 16);
      ctx.lineTo(trolleyX - 6, hookY);
      ctx.moveTo(trolleyX + 6, boomY + 16);
      ctx.lineTo(trolleyX + 6, hookY);
      ctx.stroke();

      // Spreader beam & suspended container (if loading)
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(trolleyX - 16, hookY, 32, 6);
      if (craneActive) {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(trolleyX - 22, hookY + 6, 44, 20);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(trolleyX - 22, hookY + 6, 44, 20);
      }

      // 3. SEABED (Sandy floor at bottom)
      const seabedY = H - 28;
      const sandGrad = ctx.createLinearGradient(0, seabedY, 0, H);
      sandGrad.addColorStop(0, '#78716c');
      sandGrad.addColorStop(0.5, '#57534e');
      sandGrad.addColorStop(1, '#292524');
      ctx.fillStyle = sandGrad;
      ctx.fillRect(dockWidth, seabedY, W - dockWidth, H - seabedY);

      // Seabed ripple rocks
      ctx.fillStyle = '#44403c';
      for (let rx = dockWidth + 30; rx < W; rx += 75) {
        ctx.beginPath();
        ctx.ellipse(rx, seabedY + 8, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. WATER SURFACE LINE & CALCULATION OF SHIP POSITION
      // Equilibrium waterline baseline in canvas pixels:
      const waterBaseY = H * 0.58; // Visual surface reference
      const scalePixelsPerMeter = 14.5; // 1 meter of draft = 14.5 pixels on canvas

      // Ship hull dimensions on canvas:
      const shipLengthPx = 540;
      const shipDeckHeightM = SHIP_SPECS.moldedDepth; // 14m
      const shipHullHeightPx = shipDeckHeightM * scalePixelsPerMeter; // ~203 px
      const shipOriginX = 200;

      // Sinking pitch and depth adjustment:
      const sinkDescent = sinkDepthOffsetRef.current;
      const pitchAngle = phys.isSinking ? Math.min(0.12, sinkDescent * 0.0018) : 0;

      // Vertical position of ship:
      // In equilibrium, the water surface touches the hull at height 'draft' from the keel.
      // So keelY = waterBaseY + draft * scalePixelsPerMeter
      // DeckY = keelY - shipHullHeightPx = waterBaseY + (draft - 14) * scalePixelsPerMeter
      const currentDraftMeters = Math.min(17, phys.draft);
      const shipKeelY = waterBaseY + currentDraftMeters * scalePixelsPerMeter + sinkDescent;
      const shipDeckY = shipKeelY - shipHullHeightPx;

      // 5. DRAW SHIP HULL & SUPERSTRUCTURE
      ctx.save();
      // Apply pitch rotation centered around amidships if sinking
      const amidshipsX = shipOriginX + shipLengthPx * 0.52;
      ctx.translate(amidshipsX, shipKeelY - shipHullHeightPx * 0.5);
      ctx.rotate(pitchAngle);
      ctx.translate(-amidshipsX, -(shipKeelY - shipHullHeightPx * 0.5));

      // Ship profile coordinates:
      const sternX = shipOriginX;
      const bowStemX = shipOriginX + shipLengthPx;
      const bowBulbX = bowStemX + 24;

      // Lower Hull (Antifouling Red bottom)
      const antiFoulingY = shipDeckY + (shipDeckHeightM - 8.8) * scalePixelsPerMeter; // near summer line
      const hullGrad = ctx.createLinearGradient(0, shipDeckY, 0, shipKeelY);
      hullGrad.addColorStop(0, '#0f172a');
      hullGrad.addColorStop(0.35, '#1e293b');
      hullGrad.addColorStop(0.55, '#991b1b');
      hullGrad.addColorStop(1, '#7f1d1d');

      // Full Hull Contour Path
      ctx.beginPath();
      // Transom stern (Aft left)
      ctx.moveTo(sternX, shipDeckY);
      ctx.lineTo(sternX - 8, shipKeelY - 24);
      // Keel bottom line to bow
      ctx.quadraticCurveTo(sternX + 30, shipKeelY, sternX + 80, shipKeelY);
      ctx.lineTo(bowStemX - 60, shipKeelY);
      // Bulbous bow protruding forward
      ctx.quadraticCurveTo(bowStemX - 10, shipKeelY, bowBulbX, shipKeelY - 14);
      ctx.quadraticCurveTo(bowStemX + 10, shipKeelY - 32, bowStemX - 10, shipKeelY - 45);
      // Raked bow flare upward to forecastle deck
      ctx.lineTo(bowStemX, shipDeckY);
      // Main deck line back to stern
      ctx.lineTo(sternX, shipDeckY);
      ctx.closePath();

      ctx.fillStyle = hullGrad;
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Boot-topping white waterline stripe along the hull
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sternX - 4, antiFoulingY);
      ctx.lineTo(bowStemX - 4, antiFoulingY);
      ctx.stroke();

      // Deck bulwark rail
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sternX, shipDeckY - 4);
      ctx.lineTo(bowStemX, shipDeckY - 4);
      ctx.stroke();

      // Aft Superstructure (Navigation Bridge & Accommodation Block)
      const deckhouseX = sternX + 35;
      const deckhouseW = 85;
      const deckhouseH = 65;
      const bridgeDeckY = shipDeckY - deckhouseH;

      // Main tower
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(deckhouseX, bridgeDeckY, deckhouseW, deckhouseH);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(deckhouseX, bridgeDeckY, deckhouseW, deckhouseH);

      // Deck tiers / balconies
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(deckhouseX - 6, bridgeDeckY + 22, deckhouseW + 12, 4);
      ctx.fillRect(deckhouseX - 6, bridgeDeckY + 42, deckhouseW + 12, 4);

      // Bridge navigation windows (Bridge Wing)
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(deckhouseX + 10, bridgeDeckY + 6, deckhouseW - 20, 10);
      ctx.fillStyle = '#38bdf8';
      for (let wx = deckhouseX + 14; wx < deckhouseX + deckhouseW - 16; wx += 10) {
        ctx.fillRect(wx, bridgeDeckY + 8, 6, 6);
      }

      // Exhaust Funnel (Smokestack) behind bridge
      const funnelX = deckhouseX - 18;
      const funnelY = bridgeDeckY + 10;
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(funnelX, bridgeDeckY + 45);
      ctx.lineTo(funnelX + 6, funnelY);
      ctx.lineTo(funnelX + 22, funnelY);
      ctx.lineTo(funnelX + 18, bridgeDeckY + 45);
      ctx.closePath();
      ctx.fill();
      // Funnel black top
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(funnelX + 5, funnelY, 17, 7);

      // Radar Mast & Rotating Scanner
      const mastX = deckhouseX + deckhouseW * 0.5;
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mastX, bridgeDeckY);
      ctx.lineTo(mastX, bridgeDeckY - 26);
      ctx.stroke();

      // Spinning radar bar
      const radarSpan = Math.cos(waveTimeRef.current * 3.5) * 12;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(mastX - radarSpan, bridgeDeckY - 26);
      ctx.lineTo(mastX + radarSpan, bridgeDeckY - 26);
      ctx.stroke();

      // Forecastle mast & mooring gear on bow
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bowStemX - 25, shipDeckY);
      ctx.lineTo(bowStemX - 25, shipDeckY - 22);
      ctx.stroke();

      // Ship Name & IMO
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText(SHIP_SPECS.name, sternX + 22, shipDeckY + 18);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText('PORT OF VALPARAÍSO', sternX + 22, shipDeckY + 29);

      // 6. CARGO CONTAINER BAYS (Rendered on deck)
      const containerBayStartX = deckhouseX + deckhouseW + 18;
      const containerBayEndX = bowStemX - 35;
      const bayWidth = containerBayEndX - containerBayStartX; // ~340 px
      const containerColors = ['#0284c7', '#059669', '#d97706', '#dc2626', '#4f46e5', '#ca8a04', '#0d9488'];

      const totalContainers = phys.containerCount;
      const numCols = 8;
      const maxTiers = 6;
      const colWidth = (bayWidth / numCols) - 4;
      const tierHeight = 11;

      // Draw loaded containers row by row, tier by tier
      let containersDrawn = 0;
      for (let tier = 0; tier < maxTiers; tier++) {
        for (let col = 0; col < numCols; col++) {
          if (containersDrawn >= totalContainers) break;

          const cx = containerBayStartX + col * (colWidth + 4);
          const cy = shipDeckY - (tier + 1) * tierHeight - 1;
          const color = containerColors[(col + tier * 3) % containerColors.length];

          // Container box
          ctx.fillStyle = color;
          ctx.fillRect(cx, cy, colWidth, tierHeight - 1);
          ctx.strokeStyle = 'rgba(0,0,0,0.35)';
          ctx.lineWidth = 1;
          ctx.strokeRect(cx, cy, colWidth, tierHeight - 1);

          // Container door / ribs
          ctx.strokeStyle = 'rgba(255,255,255,0.25)';
          ctx.beginPath();
          ctx.moveTo(cx + colWidth * 0.33, cy);
          ctx.lineTo(cx + colWidth * 0.33, cy + tierHeight - 1);
          ctx.moveTo(cx + colWidth * 0.66, cy);
          ctx.lineTo(cx + colWidth * 0.66, cy + tierHeight - 1);
          ctx.stroke();

          containersDrawn++;
        }
      }

      // Container cell guides / lashing bridges
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1;
      for (let col = 0; col <= numCols; col++) {
        const lx = containerBayStartX + col * (colWidth + 4) - 2;
        ctx.beginPath();
        ctx.moveTo(lx, shipDeckY);
        ctx.lineTo(lx, shipDeckY - maxTiers * tierHeight * 0.7);
        ctx.stroke();
      }

      // 7. DRAFT METRIC MARKS (Painted on bow & stern)
      ctx.fillStyle = '#f8fafc';
      ctx.font = '8px monospace';
      for (let dm = 2; dm <= 14; dm += 2) {
        const markY = shipKeelY - dm * scalePixelsPerMeter;
        // Stern draft marks
        ctx.fillRect(sternX + 12, markY - 1, 6, 1.5);
        ctx.fillText(`${dm}m`, sternX + 2, markY + 2);
        // Bow draft marks
        ctx.fillRect(bowStemX - 16, markY - 1, 6, 1.5);
        ctx.fillText(`${dm}m`, bowStemX - 35, markY + 2);
      }

      // 8. PLIMSOLL LOAD LINE MARK (Painted Amidships)
      // Located at amidshipsX along the hull
      const plimsollX = amidshipsX + 25;
      // Center of Plimsoll disk is aligned with Summer (S) line (8.80m above keel)
      const diskCenterDraft = SHIP_SPECS.summerDraftLimit; // 8.80 m
      const diskCenterY = shipKeelY - diskCenterDraft * scalePixelsPerMeter;
      const diskRadius = 14; // pixels

      // Highlight if overloaded
      if (phys.isOverloaded) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.beginPath();
        ctx.arc(plimsollX, diskCenterY, diskRadius + 14, 0, Math.PI * 2);
        ctx.fill();
      }

      // Plimsoll Circle & Crossbar
      ctx.strokeStyle = phys.isOverloaded ? '#ef4444' : '#f8fafc';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(plimsollX, diskCenterY, diskRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Horizontal line through circle center
      ctx.beginPath();
      ctx.moveTo(plimsollX - diskRadius - 8, diskCenterY);
      ctx.lineTo(plimsollX + diskRadius + 8, diskCenterY);
      ctx.stroke();

      // Register letters "V" and "L" (VizLearn / Lloyd's Register)
      ctx.fillStyle = phys.isOverloaded ? '#ef4444' : '#f8fafc';
      ctx.font = 'bold 9px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText('V', plimsollX - diskRadius - 16, diskCenterY + 3);
      ctx.fillText('L', plimsollX + diskRadius + 10, diskCenterY + 3);

      // Plimsoll Grid Lines (Forward of the circle)
      const gridBarX = plimsollX + diskRadius + 32;
      const gridLineLen = 18;

      // Vertical spine bar
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gridBarX, shipKeelY - 9.4 * scalePixelsPerMeter);
      ctx.lineTo(gridBarX, shipKeelY - 8.3 * scalePixelsPerMeter);
      ctx.stroke();

      // Connector from circle to vertical bar
      ctx.beginPath();
      ctx.moveTo(plimsollX + diskRadius, diskCenterY);
      ctx.lineTo(gridBarX, diskCenterY);
      ctx.stroke();

      // Render individual Plimsoll marks: TF, F, T, S, W, WNA
      Object.entries(PLIMSOLL_MARKS).forEach(([key, pMark]) => {
        const lineY = shipKeelY - pMark.draft * scalePixelsPerMeter;
        const isForward = key === 'TF' || key === 'F' || key === 'T';
        const startX = isForward ? gridBarX : gridBarX - gridLineLen;
        const endX = isForward ? gridBarX + gridLineLen : gridBarX;

        // Is this the mark for the currently selected water?
        const isCurrentActive =
          (!useCustomDensity && currentEnv.badge.includes(key)) ||
          Math.abs(phys.legalDraftLimit - pMark.draft) < 0.08;

        ctx.strokeStyle = isCurrentActive ? '#38bdf8' : pMark.color;
        ctx.lineWidth = isCurrentActive ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.moveTo(startX, lineY);
        ctx.lineTo(endX, lineY);
        ctx.stroke();

        // Label
        ctx.fillStyle = isCurrentActive ? '#38bdf8' : '#e2e8f0';
        ctx.font = isCurrentActive ? 'bold 8px monospace' : '7px monospace';
        const labelX = isForward ? endX + 3 : startX - 22;
        ctx.fillText(key, labelX, lineY + 2.5);
      });

      // 9. CENTERS OF GRAVITY (G) AND BUOYANCY (B)
      if (showCenters) {
        // Keel baseline Y
        const bY = shipKeelY - phys.yBuoyancy * scalePixelsPerMeter;
        const gY = shipKeelY - phys.yGravity * scalePixelsPerMeter;
        const centerX = amidshipsX - 45;

        // Center of Buoyancy B (Cyan)
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(centerX, bY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`B (${phys.yBuoyancy.toFixed(1)}m)`, centerX + 10, bY + 3);

        // Center of Gravity G (Gold/Amber)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(centerX, gY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`G (${phys.yGravity.toFixed(1)}m)`, centerX + 10, gY + 3);

        // Vertical dashed connecting line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(centerX, bY);
        ctx.lineTo(centerX, gY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 10. FORCE VECTORS OVERLAY (Weight W and Upthrust U)
      if (showVectors) {
        const vectorX = amidshipsX - 110;
        const bY = shipKeelY - phys.yBuoyancy * scalePixelsPerMeter;
        const gY = shipKeelY - phys.yGravity * scalePixelsPerMeter;

        // Arrow scaling: 1 MN = 0.52 px
        const arrowScale = 0.52;
        const wLen = Math.min(130, phys.totalWeightMN * arrowScale);
        const uLen = Math.min(130, phys.upthrustMN * arrowScale);

        // Draw Upthrust Vector U (Points UP from B)
        ctx.strokeStyle = '#10b981';
        ctx.fillStyle = '#10b981';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(vectorX, bY);
        ctx.lineTo(vectorX, bY - uLen);
        ctx.stroke();

        // Arrowhead UP
        ctx.beginPath();
        ctx.moveTo(vectorX - 6, bY - uLen + 10);
        ctx.lineTo(vectorX, bY - uLen);
        ctx.lineTo(vectorX + 6, bY - uLen + 10);
        ctx.closePath();
        ctx.fill();

        // Label U
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#34d399';
        ctx.fillText(`U = ${phys.upthrustMN.toFixed(1)} MN`, vectorX + 8, bY - uLen + 8);

        // Draw Weight Vector W (Points DOWN from G)
        ctx.strokeStyle = '#f59e0b';
        ctx.fillStyle = '#f59e0b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(vectorX, gY);
        ctx.lineTo(vectorX, gY + wLen);
        ctx.stroke();

        // Arrowhead DOWN
        ctx.beginPath();
        ctx.moveTo(vectorX - 6, gY + wLen - 10);
        ctx.lineTo(vectorX, gY + wLen);
        ctx.lineTo(vectorX + 6, gY + wLen - 10);
        ctx.closePath();
        ctx.fill();

        // Label W
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`W = ${phys.totalWeightMN.toFixed(1)} MN`, vectorX + 8, gY + wLen - 4);
      }

      ctx.restore(); // End of ship rotation / translation frame

      // 11. OCEAN WATER SURFACE & WAVE ANIMATION
      // Multi-frequency sinusoidal wave
      const waterGrad = ctx.createLinearGradient(0, waterBaseY, 0, H);
      const [cTop, cBottom] = currentEnv.waterGradient;
      waterGrad.addColorStop(0, cTop);
      waterGrad.addColorStop(0.35, cBottom);
      waterGrad.addColorStop(1, 'rgba(3, 7, 18, 0.96)');

      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      ctx.moveTo(dockWidth, H);
      ctx.lineTo(dockWidth, waterBaseY);

      // Wave path across water body
      for (let x = dockWidth; x <= W; x += 6) {
        const wave1 = Math.sin(x * 0.024 + waveTimeRef.current * 1.8) * 3.5;
        const wave2 = Math.cos(x * 0.048 - waveTimeRef.current * 1.1) * 2.0;
        const wy = waterBaseY + wave1 + wave2;
        ctx.lineTo(x, wy);
      }

      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();

      // Water surface highlights / foam lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let x = dockWidth; x <= W; x += 6) {
        const wave1 = Math.sin(x * 0.024 + waveTimeRef.current * 1.8) * 3.5;
        const wave2 = Math.cos(x * 0.048 - waveTimeRef.current * 1.1) * 2.0;
        const wy = waterBaseY + wave1 + wave2;
        if (x === dockWidth) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();

      // Water caustics / light shafts underwater
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(W * 0.45, waterBaseY + 10);
      ctx.lineTo(W * 0.65, H);
      ctx.moveTo(W * 0.68, waterBaseY + 10);
      ctx.lineTo(W * 0.88, H);
      ctx.stroke();

      // Bubbles if sinking or heavy cargo
      if (phys.isSinking || phys.isOverloaded) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let b = 0; b < 12; b++) {
          const bx = shipOriginX + 60 + ((b * 47 + Math.sin(waveTimeRef.current + b) * 20) % 460);
          const by = waterBaseY + 15 + ((b * 31 - waveTimeRef.current * 40) % (H - waterBaseY - 30));
          ctx.beginPath();
          ctx.arc(bx, by, 2 + (b % 3), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 12. WATERLINE EXTENSION LINE TO PLIMSOLL MARK (Precision visual guide)
      ctx.strokeStyle = phys.isOverloaded ? 'rgba(239, 68, 68, 0.8)' : 'rgba(56, 189, 248, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(shipOriginX + 160, waterBaseY);
      ctx.lineTo(shipOriginX + shipLengthPx + 40, waterBaseY);
      ctx.stroke();
      ctx.setLineDash([]);

      // 13. PLIMSOLL LOUPE / ZOOM HUD (Top-right of canvas)
      if (showPlimsollZoom) {
        const zoomW = 190;
        const zoomH = 145;
        const zoomX = W - zoomW - 14;
        const zoomY = 14;

        // Inset card container
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.beginPath();
        ctx.roundRect(zoomX, zoomY, zoomW, zoomH, 10);
        ctx.fill();
        ctx.strokeStyle = phys.isOverloaded ? '#ef4444' : '#334155';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inset header
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 9px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('PLIMSOLL MARK HUD (10× ZOOM)', zoomX + 10, zoomY + 16);

        // Water level line in zoom
        const zoomCenterY = zoomY + 75;
        // Delta between current draft and baseline summer line
        const zoomDraftScale = 24; // px per meter in zoom
        const draftOffsetFromSummer = (phys.draft - SHIP_SPECS.summerDraftLimit) * zoomDraftScale;
        const zoomWaterY = zoomCenterY - draftOffsetFromSummer;

        // Zoomed water meniscus
        ctx.fillStyle = currentEnv.waterGradient[0];
        ctx.fillRect(zoomX + 6, Math.max(zoomY + 22, zoomWaterY), zoomW - 12, Math.max(0, zoomY + zoomH - 6 - Math.max(zoomY + 22, zoomWaterY)));

        // Plimsoll disk enlarged
        const zDiskX = zoomX + 45;
        const zRadius = 22;
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(zDiskX, zoomCenterY, zRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(zDiskX - zRadius - 6, zoomCenterY);
        ctx.lineTo(zDiskX + zRadius + 6, zoomCenterY);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px ui-sans-serif';
        ctx.fillText('V', zDiskX - zRadius - 14, zoomCenterY + 4);
        ctx.fillText('L', zDiskX + zRadius + 4, zoomCenterY + 4);

        // Plimsoll grid marks enlarged
        const zGridX = zDiskX + zRadius + 30;
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(zGridX, zoomCenterY - 36);
        ctx.lineTo(zGridX, zoomCenterY + 36);
        ctx.stroke();

        // Lines for TF, F, T, S, W, WNA
        Object.entries(PLIMSOLL_MARKS).forEach(([key, pMark]) => {
          const dy = zoomCenterY - (pMark.draft - SHIP_SPECS.summerDraftLimit) * zoomDraftScale;
          const isFwd = key === 'TF' || key === 'F' || key === 'T';
          const zx1 = isFwd ? zGridX : zGridX - 16;
          const zx2 = isFwd ? zGridX + 16 : zGridX;

          const isCurrentTarget =
            (!useCustomDensity && currentEnv.badge.includes(key)) ||
            Math.abs(phys.legalDraftLimit - pMark.draft) < 0.08;

          ctx.strokeStyle = isCurrentTarget ? '#38bdf8' : pMark.color;
          ctx.lineWidth = isCurrentTarget ? 3 : 1.5;
          ctx.beginPath();
          ctx.moveTo(zx1, dy);
          ctx.lineTo(zx2, dy);
          ctx.stroke();

          ctx.fillStyle = isCurrentTarget ? '#38bdf8' : '#cbd5e1';
          ctx.font = isCurrentTarget ? 'bold 9px monospace' : '7.5px monospace';
          ctx.fillText(key, isFwd ? zx2 + 3 : zx1 - 18, dy + 3);
        });

        // Current Waterline line in zoom
        ctx.strokeStyle = phys.isOverloaded ? '#ef4444' : '#38bdf8';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 2]);
        ctx.beginPath();
        ctx.moveTo(zoomX + 10, zoomWaterY);
        ctx.lineTo(zoomX + zoomW - 10, zoomWaterY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Status pill in zoom
        ctx.fillStyle = phys.isOverloaded ? '#ef4444' : '#10b981';
        ctx.font = 'bold 8.5px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText(
          phys.isOverloaded ? 'LIMIT EXCEEDED' : 'FREEBOARD SAFE',
          zoomX + 10,
          zoomY + zoomH - 10
        );
        ctx.fillStyle = '#94a3b8';
        ctx.font = '8px monospace';
        ctx.fillText(`d=${phys.draft.toFixed(2)}m`, zoomX + zoomW - 65, zoomY + zoomH - 10);
      }

      // 14. EMERGENCY SINKING / OVERLOAD BANNER ON CANVAS
      if (phys.isSinking) {
        ctx.fillStyle = 'rgba(153, 27, 27, 0.88)';
        ctx.beginPath();
        ctx.roundRect(W * 0.28, H * 0.18, W * 0.44, 75, 12);
        ctx.fill();
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#fee2e2';
        ctx.font = 'bold 15px ui-sans-serif, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CRITICAL FOUNDERING HAZARD', W * 0.5, H * 0.18 + 28);
        ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
        ctx.fillStyle = '#fecaca';
        ctx.fillText('Average density > Water density! Upthrust < Weight.', W * 0.5, H * 0.18 + 46);
        ctx.font = '10px monospace';
        ctx.fillStyle = '#fca5a5';
        ctx.fillText(`ρ_ship (${phys.averageShipDensity.toFixed(0)} kg/m³) > ρ_water (${phys.waterDensity} kg/m³)`, W * 0.5, H * 0.18 + 62);
        ctx.textAlign = 'left';
      }

      if (isRunning) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    phys,
    showVectors,
    showCenters,
    showPlimsollZoom,
    isAnimatingWaves,
    waterDensity,
    currentEnv,
    useCustomDensity,
    craneActive,
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-sans text-slate-100">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
              <Anchor className="w-3 h-3" /> Physics Form 4 • Fluid Mechanics
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
              <Waves className="w-3 h-3" /> Law of Floatation
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Plimsoll Load Line
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Law of Floatation & Plimsoll Line Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Explore Archimedes' principle and floating equilibrium: <code className="text-sky-300 font-mono">U = ρ_fluid · V_sub · g = W_total</code>. Observe how water salinity and cargo load adjust ship draft against historical Plimsoll load marks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end flex-wrap">
          <button
            onClick={() => setShowTheoryModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all shadow-sm cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>Theory & Plimsoll History</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all shadow-sm cursor-pointer"
            title="Reset simulation parameters"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {PRESETS.map((p) => {
          const isSelected =
            !activeChallenge && cargoMass === p.cargoMass && selectedEnvId === p.waterEnvId && !useCustomDensity;
          return (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-sky-950/60 border-sky-500 shadow-md shadow-sky-950/50 ring-1 ring-sky-500/40'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{p.name}</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />}
              </div>
              <p className="text-[11px] text-sky-400/90 font-mono mt-0.5">{p.tagline}</p>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{p.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Guided Challenges Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">
              Guided Inquiry Challenges
            </h3>
          </div>
          {activeChallenge && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                Active:{' '}
                <strong className="text-sky-400">{activeChallenge.title.split(':')[0]}</strong>
              </span>
              <button
                onClick={() => {
                  setActiveChallenge(null);
                  setChallengeCompleted(false);
                }}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
              >
                Exit Challenge
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {CHALLENGES.map((ch) => {
            const isActive = activeChallenge?.id === ch.id;
            return (
              <div
                key={ch.id}
                className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? challengeCompleted
                      ? 'bg-emerald-950/60 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                      : 'bg-sky-950/60 border-sky-500 shadow-md ring-1 ring-sky-500/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">{ch.title}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        ch.difficulty === 'Introductory'
                          ? 'bg-sky-900/40 text-sky-400 border-sky-700'
                          : ch.difficulty === 'Intermediate'
                          ? 'bg-amber-900/40 text-amber-400 border-amber-700'
                          : 'bg-rose-900/40 text-rose-400 border-rose-700'
                      }`}
                    >
                      {ch.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{ch.hint}</p>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                  {isActive && challengeCompleted ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed!
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">
                      {isActive ? 'In progress...' : 'Ready to start'}
                    </span>
                  )}
                  <button
                    onClick={() => handleStartChallenge(ch)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {isActive ? 'Restart' : 'Launch'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {challengeCompleted && activeChallenge && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/70 text-emerald-200 text-xs flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold text-emerald-300">Challenge Accomplished!</strong>{' '}
              {activeChallenge.congrats}
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Canvas Stage (Col 8) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col justify-between">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={900}
              height={460}
              className="w-full h-auto block rounded-xl bg-slate-950 select-none border border-slate-800/80"
            />

            {/* Quick Status Pill Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-md flex items-center gap-1.5 ${
                  phys.isSinking
                    ? 'bg-rose-950/90 border-rose-500/80 text-rose-300 animate-pulse'
                    : phys.isOverloaded
                    ? 'bg-amber-950/90 border-amber-500/80 text-amber-300'
                    : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                }`}
              >
                {phys.isSinking ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                ) : phys.isOverloaded ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="uppercase tracking-wider">
                  {phys.isSinking
                    ? 'SINKING FOUNDERED'
                    : phys.isOverloaded
                    ? 'OVERLOAD HAZARD: Freeboard compromised!'
                    : 'SAFE BUOYANCY EQUILIBRIUM (U = W)'}
                </span>
              </span>

              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-slate-900/80 border border-slate-700 text-slate-300 backdrop-blur-md">
                ρ_water = {phys.waterDensity} kg/m³
              </span>
            </div>

            {/* Quick Controls Bar Below Canvas */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-amber-400 rounded-full" /> Weight W = mg
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-400 rounded-full" /> Upthrust U = ρVg
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Center of Buoyancy B
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Center of Gravity G
                </span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={showVectors}
                    onChange={(e) => setShowVectors(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Forces</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={showCenters}
                    onChange={(e) => setShowCenters(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
                  />
                  <span>G & B Centroids</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={showPlimsollZoom}
                    onChange={(e) => setShowPlimsollZoom(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
                  />
                  <span>10× HUD</span>
                </label>
                <button
                  onClick={() => setIsAnimatingWaves((prev) => !prev)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title={isAnimatingWaves ? 'Pause Waves' : 'Play Waves'}
                >
                  {isAnimatingWaves ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Readouts / Gauges (Col 4) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Main Draft & Freeboard Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-sky-400" /> Equilibrium Hydrostatics
              </h3>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                  phys.isOverloaded
                    ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                    : 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                }`}
              >
                {phys.isOverloaded ? 'Hazard' : 'Equilibrium'}
              </span>
            </div>

            {/* Submerged Draft Meter */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-slate-400">Submerged Draft (d)</span>
                <span className="text-lg font-black font-mono text-sky-300">
                  {phys.draft.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-400">m</span>
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    phys.isOverloaded ? 'bg-rose-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${Math.min(100, (phys.draft / SHIP_SPECS.moldedDepth) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0.0 m (Keel)</span>
                <span>Plimsoll Limit: {phys.legalDraftLimit.toFixed(2)} m</span>
                <span>14.0 m (Deck)</span>
              </div>
            </div>

            {/* Reserve Freeboard & Reserve Buoyancy */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Reserve Freeboard (F)</span>
                <span className="text-base font-black font-mono text-emerald-400">
                  {phys.freeboard.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-400">m</span>
                </span>
                <span className="text-[10px] text-slate-500 block">Height above waterline</span>
              </div>
              <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Reserve Buoyancy</span>
                <span className="text-base font-black font-mono text-cyan-400">
                  {phys.reserveBuoyancyPct.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-500 block">Unsubmerged volume</span>
              </div>
            </div>

            {/* Plimsoll Safety Margin */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Plimsoll Safety Margin</span>
                <span
                  className={`text-sm font-black font-mono ${
                    phys.plimsollSafetyMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {phys.plimsollSafetyMargin >= 0 ? '+' : ''}
                  {phys.plimsollSafetyMargin.toFixed(2)} m
                </span>
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                  phys.plimsollSafetyMargin >= 0
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-300 animate-pulse'
                }`}
              >
                {phys.plimsollSafetyMargin >= 0 ? 'Compliant' : 'Freeboard Breach!'}
              </span>
            </div>

            {/* Mass & Weight Forces */}
            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">Total Displacement Mass:</span>
                <span className="text-slate-200 font-bold">{phys.totalMassTonnes.toLocaleString()} t</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">Total Downward Weight (W):</span>
                <span className="text-amber-400 font-bold">{phys.totalWeightMN.toFixed(2)} MN</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">Upward Buoyant Upthrust (U):</span>
                <span className="text-emerald-400 font-bold">{phys.upthrustMN.toFixed(2)} MN</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">Submerged Volume (V_sub):</span>
                <span className="text-sky-300">{Math.round(phys.submergedVolume).toLocaleString()} m³</span>
              </div>
              <div className="flex justify-between py-1 font-mono">
                <span className="text-slate-400">Average Hull Density:</span>
                <span
                  className={`font-bold ${
                    phys.averageShipDensity > phys.waterDensity ? 'text-rose-400' : 'text-slate-200'
                  }`}
                >
                  {phys.averageShipDensity.toFixed(1)} kg/m³
                </span>
              </div>
            </div>
          </div>

          {/* Sinking Alert / Recovery Action Button */}
          {phys.isSinking && (
            <div className="bg-rose-950/90 border border-rose-500 rounded-2xl p-3.5 text-center space-y-2 animate-fadeIn">
              <div className="text-xs font-bold text-rose-200 flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                VESSEL HAS LOST BUOYANCY!
              </div>
              <p className="text-[11px] text-rose-300 leading-tight">
                Total ship weight exceeds the maximum possible upthrust of water displaced by total hull volume.
              </p>
              <button
                onClick={() => setCargoMass(6000)}
                className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Emergency Jettison Cargo (Refloat)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Cargo Loading Crane Controls (Col 6) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Box className="w-4 h-4 text-amber-400" /> Cargo Loading & Payload
            </h3>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
              {phys.containerCount} Containers (TEU)
            </span>
          </div>

          {/* Cargo Mass Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <label className="text-xs text-slate-300 font-semibold">
                Cargo Mass (M_cargo):
              </label>
              <div className="text-right">
                <span className="text-lg font-black font-mono text-amber-400">
                  {cargoMass.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-400">tonnes</span>
                </span>
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={18000}
              step={200}
              value={cargoMass}
              onChange={(e) => {
                setCargoMass(Number(e.target.value));
                setCraneActive(true);
                setTimeout(() => setCraneActive(false), 800);
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 t (Lightship: 6,000 t)</span>
              <span>10,236 t (Summer limit in ocean)</span>
              <span>18,000 t (Max Hold)</span>
            </div>
          </div>

          {/* Fast Adjust Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              onClick={() => handleAddCargo(-1000)}
              disabled={cargoMass <= 0}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-300 transition-all border border-slate-700 cursor-pointer disabled:cursor-not-allowed"
            >
              -1,000 t (-50 TEU)
            </button>
            <button
              onClick={() => handleAddCargo(1000)}
              disabled={cargoMass >= 18000}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-300 transition-all border border-slate-700 cursor-pointer disabled:cursor-not-allowed"
            >
              +1,000 t (+50 TEU)
            </button>
            <button
              onClick={handleFillToPlimsoll}
              className="px-2.5 py-2 rounded-xl bg-sky-950/70 hover:bg-sky-900/80 text-xs font-semibold text-sky-300 border border-sky-600 transition-all cursor-pointer"
            >
              Fill to Plimsoll Limit
            </button>
            <button
              onClick={() => setCargoMass(0)}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all border border-slate-700 cursor-pointer"
            >
              Empty Hold (0 t)
            </button>
          </div>

          {/* Freeboard warning explanation */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              Every additional <strong>18 tonnes</strong> of cargo displaces ~17.5 m³ of seawater, deepening the draft by ~1 cm (<code className="text-sky-300 font-mono">Δd = ΔM / (ρ · A_wp)</code>).
            </div>
          </div>
        </div>

        {/* Water Salinity & Density Selector (Col 6) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Waves className="w-4 h-4 text-sky-400" /> Water Environment & Salinity
            </h3>
            <span className="text-xs font-mono font-bold text-sky-400">
              ρ = {waterDensity} kg/m³
            </span>
          </div>

          {/* Quick Water Environment Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {WATER_ENVIRONMENTS.slice(0, 4).map((env) => {
              const isSelected = !useCustomDensity && selectedEnvId === env.id;
              return (
                <button
                  key={env.id}
                  onClick={() => {
                    setSelectedEnvId(env.id);
                    setUseCustomDensity(false);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-950/70 border-sky-500 shadow-md ring-1 ring-sky-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>{env.badge}</span>
                    <span className="font-mono text-[10px] text-sky-400">{env.density}</span>
                  </div>
                  <p className="text-[10px] mt-0.5 line-clamp-1 font-semibold text-slate-200">
                    {env.name.split('(')[0]}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5">{env.salinity}</p>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {WATER_ENVIRONMENTS.slice(4).map((env) => {
              const isSelected = !useCustomDensity && selectedEnvId === env.id;
              return (
                <button
                  key={env.id}
                  onClick={() => {
                    setSelectedEnvId(env.id);
                    setUseCustomDensity(false);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-950/70 border-sky-500 shadow-md ring-1 ring-sky-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>{env.badge}</span>
                    <span className="font-mono text-[10px] text-sky-400">{env.density}</span>
                  </div>
                  <p className="text-[10px] mt-0.5 line-clamp-1 font-semibold text-slate-200">
                    {env.name.split('(')[0]}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5">{env.salinity}</p>
                </button>
              );
            })}
          </div>

          {/* Custom Density Range Toggle */}
          <div className="pt-1 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomDensity}
                  onChange={(e) => setUseCustomDensity(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
                />
                <span>Fine-tune density manually (Continuous slider)</span>
              </label>
              {useCustomDensity && (
                <span className="text-xs font-mono font-bold text-sky-400">
                  {customDensity} kg/m³
                </span>
              )}
            </div>

            {useCustomDensity && (
              <input
                type="range"
                min={980}
                max={1300}
                step={1}
                value={customDensity}
                onChange={(e) => setCustomDensity(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            )}
          </div>
        </div>
      </div>

      {/* Comprehensive Theory & Plimsoll History Modal */}
      {showTheoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-3xl w-full max-h-[88vh] overflow-y-auto shadow-2xl space-y-5 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <Anchor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Law of Floatation & The Plimsoll Line
                  </h3>
                  <p className="text-xs text-slate-400">
                    Physics derivation, historical context, and maritime stability mechanics
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTheoryModal(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            {/* Section 1: The Law of Floatation */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4" /> 1. The Fundamental Law of Floatation
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                A floating body is in static translational equilibrium under the action of two opposing vertical forces:
              </p>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono text-sm text-sky-300">
                Σ F_y = 0 ⟹ Upthrust (U) = Total Weight (W)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                By Archimedes' Principle, the upthrust equals the weight of the fluid displaced by the submerged part of the vessel:
              </p>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                <div>U = ρ_fluid · V_sub · g</div>
                <div>W = M_total · g = ρ_ship · V_total · g</div>
                <div className="text-emerald-400 font-bold">
                  Fraction Submerged: (V_sub / V_total) = (ρ_ship / ρ_fluid)
                </div>
              </div>
              <p className="text-xs text-slate-400">
                <strong>Critical Takeaway:</strong> If fluid density <code className="text-sky-300 font-mono">ρ_fluid</code> increases (e.g. going from freshwater into saltwater), less submerged volume <code className="text-sky-300 font-mono">V_sub</code> is needed to balance the ship's weight, so the ship <strong>rises</strong> and draft <strong>decreases</strong>.
              </p>
            </div>

            {/* Section 2: Samuel Plimsoll & The Coffin Ships */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Ship className="w-4 h-4" /> 2. Historical Context: Samuel Plimsoll MP (1876)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In 19th-century Britain, unscrupulous shipowners routinely overloaded decrepit, unseaworthy vessels heavily and heavily insured them. When these overloaded vessels encountered rough seas, they had virtually zero reserve freeboard, were quickly overwhelmed by waves, and foundered with massive loss of merchant sailors' lives. These doomed vessels were known as <em>"Coffin Ships"</em>.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Samuel Plimsoll MP</strong> (1824–1898), known as "The Sailors' Friend", fought a relentless parliamentary campaign that led to the landmark <strong>Merchant Shipping Act of 1876</strong>. This law mandated a load line mark (the <em>Plimsoll Mark</em>) painted on both sides of every merchant ship to prevent overloading.
              </p>
            </div>

            {/* Section 3: Plimsoll Load Line Markings */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> 3. Plimsoll Mark Markings Decoded
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="font-bold text-sky-400">TF (Tropical Fresh Water) — 997 kg/m³</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Warm freshwater has the lowest density; ship sinks deepest. Highest legal waterline line allowed on the hull.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="font-bold text-cyan-400">F (Fresh Water) — 1,000 kg/m³</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Standard inland temperate rivers and canals. Deeper than summer ocean line.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="font-bold text-emerald-400">T (Tropical Sea Water) — 1,020 kg/m³</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Warm sea water (Caribbean, Indian Ocean, Red Sea). Thermal expansion reduces seawater density.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="font-bold text-amber-400">S (Summer Temperate Sea Water) — 1,025 kg/m³</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Primary reference baseline level with the center of the Plimsoll circle.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="font-bold text-indigo-400">W (Winter Sea Water) — 1,030 kg/m³</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Cold water is denser, but winter storms require extra reserve freeboard (lower allowed waterline).
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="font-bold text-rose-400">WNA (Winter North Atlantic) — 1,033 kg/m³</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Strictest commercial load mark; mandates maximum reserve freeboard for extreme winter gale waves.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Centers of Gravity & Buoyancy */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> 4. Naval Stability: Centers of Gravity (G) and Buoyancy (B)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Center of Gravity (G):</strong> Point through which total ship weight acts downwards. As cargo is stacked higher on the deck, G rises upwards, potentially compromising transverse stability.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Center of Buoyancy (B):</strong> The centroid of the underwater displaced fluid volume, through which buoyant upthrust acts upwards.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                When the ship rolls in waves, B shifts sideways, creating a righting couple that rights the vessel, provided the <strong>Metacenter (M)</strong> remains above G (<code className="text-sky-300 font-mono">GM &gt; 0</code>).
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowTheoryModal(false)}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Got It, Return to Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
