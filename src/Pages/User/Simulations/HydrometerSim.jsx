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
  HelpCircle,
  Layers,
  ArrowRight,
  TrendingUp,
  Search,
  Eye,
  X,
  Droplet,
  Beaker,
  Award,
  ChevronRight,
  Scale
} from 'lucide-react';

// --- LIQUIDS DATABASE ---
const LIQUIDS = [
  {
    id: 'spirits',
    name: 'Methylated Spirits',
    density: 790, // kg/m^3
    rd: 0.790,
    color: 'rgba(168, 85, 247, 0.45)', // purple
    liquidBorder: 'rgba(192, 132, 252, 0.8)',
    viscosity: 0.85,
    tag: 'Volatile Alcohol',
    desc: 'Low density fuel/solvent. Hydrometer sinks deeply down the stem.'
  },
  {
    id: 'kerosene',
    name: 'Kerosene',
    density: 800,
    rd: 0.800,
    color: 'rgba(56, 189, 248, 0.35)', // pale light blue
    liquidBorder: 'rgba(125, 211, 252, 0.8)',
    viscosity: 1.1,
    tag: 'Hydrocarbon Fuel',
    desc: 'Less dense than water. Scale reading falls near the top of the stem.'
  },
  {
    id: 'pure_water',
    name: 'Pure Water (4°C)',
    density: 1000,
    rd: 1.000,
    color: 'rgba(6, 182, 212, 0.38)', // cyan
    liquidBorder: 'rgba(34, 211, 238, 0.8)',
    viscosity: 1.0,
    tag: 'Standard Reference',
    desc: 'International calibration benchmark (Relative Density = 1.000 exactly).'
  },
  {
    id: 'sea_water',
    name: 'Sea Water (3.5% Salinity)',
    density: 1025,
    rd: 1.025,
    color: 'rgba(13, 148, 136, 0.48)', // teal
    liquidBorder: 'rgba(45, 212, 191, 0.8)',
    viscosity: 1.05,
    tag: 'Saline Solution',
    desc: 'Dissolved mineral salts increase density, providing greater upthrust.'
  },
  {
    id: 'whole_milk',
    name: 'Whole Fresh Milk',
    density: 1030,
    rd: 1.030,
    color: 'rgba(250, 250, 249, 0.85)', // opaque milk white
    liquidBorder: 'rgba(245, 245, 244, 0.95)',
    viscosity: 1.4,
    tag: 'Dairy Standard',
    desc: 'Natural unadulterated milk. Lactometer standard reading 1.028 – 1.034.'
  },
  {
    id: 'adulterated_milk',
    name: 'Watered Milk (Adulterated)',
    density: 1016,
    rd: 1.016,
    color: 'rgba(241, 245, 249, 0.72)', // diluted translucent milk
    liquidBorder: 'rgba(226, 232, 240, 0.85)',
    viscosity: 1.1,
    tag: 'Diluted Milk',
    desc: 'Water added by vendor reduces density. Sinks below 1.028 threshold!'
  },
  {
    id: 'battery_acid',
    name: 'Car Battery Acid (Charged)',
    density: 1250,
    rd: 1.250,
    color: 'rgba(234, 179, 8, 0.38)', // sulfurous amber
    liquidBorder: 'rgba(250, 204, 21, 0.8)',
    viscosity: 1.3,
    tag: 'Electrolyte',
    desc: 'Sulfuric acid electrolyte in healthy charged lead-acid automotive battery.'
  },
  {
    id: 'conc_h2so4',
    name: 'Concentrated H₂SO₄ (98%)',
    density: 1840,
    rd: 1.840,
    color: 'rgba(148, 163, 184, 0.55)', // viscous platinum
    liquidBorder: 'rgba(203, 213, 225, 0.85)',
    viscosity: 2.2,
    tag: 'Dense Mineral Acid',
    desc: 'Very dense liquid. Hydrometer floats high; liquid meets bottom of stem.'
  },
  {
    id: 'unknown_x',
    name: 'Unknown Sample Liquid X',
    density: 920, // Olive / Vegetable oil
    rd: 0.920,
    color: 'rgba(16, 185, 129, 0.45)', // emerald mystery
    liquidBorder: 'rgba(52, 211, 153, 0.8)',
    viscosity: 1.6,
    tag: 'Mystery Liquid',
    desc: 'Unlabeled sample bottle. Determine relative density using the magnified loupe.'
  }
];

// --- 4 PRESETS ---
const PRESETS = [
  {
    id: 'pure_water_calib',
    title: 'Standard Water Calibration',
    subtitle: 'Reference Mark RD = 1.000',
    liquidId: 'pure_water',
    stemType: 'narrow',
    mass: 28.0,
    desc: 'Examine the fundamental calibration benchmark where Relative Density is defined as exactly 1.000.'
  },
  {
    id: 'lactometer_test',
    title: 'Lactometer Milk Purity Test',
    subtitle: 'Adulteration Detection',
    liquidId: 'whole_milk',
    stemType: 'narrow',
    mass: 28.0,
    desc: 'Compare pure unadulterated milk (1.030) against diluted milk (1.016) using an inverted lactometer scale.'
  },
  {
    id: 'battery_acid_check',
    title: 'Battery Acid State of Charge',
    subtitle: 'Automotive Hydrometer',
    liquidId: 'battery_acid',
    stemType: 'narrow',
    mass: 28.0,
    desc: 'Check state of charge in a car battery. Fully charged = 1.250–1.280; discharged = 1.120–1.150.'
  },
  {
    id: 'stem_sensitivity_demo',
    title: 'Stem Sensitivity Comparison',
    subtitle: 'Narrow vs Wide Stem',
    liquidId: 'sea_water',
    stemType: 'wide',
    mass: 28.0,
    desc: 'Observe how a narrower stem produces a much larger change in immersion depth per unit density change.'
  }
];

// --- 3 GUIDED CHALLENGES ---
const CHALLENGES = [
  {
    id: 'water_calibration',
    title: 'Challenge 1: Calibrate in Pure Water',
    level: 'Fundamental',
    target: 'Adjust ballast or select pure water to achieve exactly RD = 1.000 ± 0.003 at the meniscus.',
    hint: 'Select "Pure Water (4°C)" and set Hydrometer Mass to 28.0 g. Look at the red 1.000 calibration line.',
    verify: (phys, liquid) => liquid.id === 'pure_water' && Math.abs(phys.readingRD - 1.000) <= 0.004,
    reward: 'Calibration verified! Hydrometers are always zeroed against pure distilled water at 4°C (or 20°C standard).'
  },
  {
    id: 'milk_adulteration',
    title: 'Challenge 2: Detect Watered Milk',
    level: 'Intermediate',
    target: 'Test both milk samples and verify if the suspicious milk sample falls below standard threshold (RD < 1.026).',
    hint: 'Select "Watered Milk (Adulterated)" from the fluid list and inspect the immersion depth with the loupe.',
    verify: (phys, liquid) => liquid.id === 'adulterated_milk' && phys.readingRD < 1.026,
    reward: 'Fraud detected! Diluting milk with water decreases its specific gravity from 1.030 to 1.016, sinking the lactometer deeper.'
  },
  {
    id: 'mystery_x',
    title: 'Challenge 3: Identify Mystery Liquid X',
    level: 'Advanced',
    target: 'Inspect "Unknown Sample Liquid X", read the stem scale using the Zoomed Loupe, and verify its density is ~920 kg/m³.',
    hint: 'Switch liquid to "Unknown Sample Liquid X". Use the zoomed-in stem loupe to read the scale tick at the meniscus line.',
    verify: (phys, liquid) => liquid.id === 'unknown_x' && Math.abs(phys.readingRD - 0.920) <= 0.005,
    reward: 'Sample identified! The relative density of 0.920 corresponds to pure vegetable / olive oil (920 kg/m³).'
  }
];

export default function HydrometerSim({ config = {}, onTelemetry }) {
  // Apparatus Configuration State
  const [selectedLiquidId, setSelectedLiquidId] = useState('pure_water');
  const [customDensity, setCustomDensity] = useState(1000);
  const [isCustomLiquid, setIsCustomLiquid] = useState(false);
  const [stemType, setStemType] = useState('narrow'); // 'narrow' (0.65 cm^2) | 'wide' (1.30 cm^2)
  const [hydrometerMass, setHydrometerMass] = useState(28.0); // grams (ballast + glass)
  const [showVectors, setShowVectors] = useState(true);
  const [showLoupe, setShowLoupe] = useState(true);
  const [isBobbing, setIsBobbing] = useState(true);

  // Challenge & UI State
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Canvas Refs & Dynamics Simulation
  const canvasRef = useRef(null);
  const loupeCanvasRef = useRef(null);

  // Dynamic bobbing physics state (offset from equilibrium in cm, velocity in cm/s)
  const dynRef = useRef({
    yOffset: 2.5, // initial displacement cm when dropped
    vy: 0.0,
    time: 0
  });

  // Current liquid object
  const currentLiquid = isCustomLiquid
    ? {
        id: 'custom',
        name: 'Custom Liquid',
        density: customDensity,
        rd: customDensity / 1000,
        color: 'rgba(99, 102, 241, 0.4)',
        liquidBorder: 'rgba(129, 140, 248, 0.8)',
        viscosity: 1.0,
        tag: 'User Adjusted',
        desc: `Custom fluid calibrated to density ${customDensity} kg/m³.`
      }
    : LIQUIDS.find((l) => l.id === selectedLiquidId) || LIQUIDS[2];

  // Apparatus physical geometry constants
  // Total height = Bulb (10 cm) + Stem (25 cm) = 35 cm
  const V_BULB = 14.0; // cm^3
  const H_BULB = 10.0; // cm
  const L_STEM = 25.0; // cm
  const A_STEM = stemType === 'narrow' ? 0.65 : 1.30; // cm^2
  const G_ACCEL = 9.81; // m/s^2

  // Physics calculation
  const calculatePhysics = useCallback(() => {
    const rhoFluidGcm3 = currentLiquid.density / 1000; // g/cm^3
    const massG = hydrometerMass; // grams

    // Theoretical equilibrium submerged volume required: V_sub = M / rho
    const vSubRequired = massG / rhoFluidGcm3; // cm^3

    // Equilibrium immersion depth of stem: h_sub = (V_sub - V_bulb) / A_stem
    let stemImmersionCm = (vSubRequired - V_BULB) / A_STEM;
    let status = 'floating'; // 'floating' | 'sunk' | 'bulb_exposed'

    if (stemImmersionCm > L_STEM) {
      status = 'sunk'; // density too low or hydrometer too heavy -> sinks to bottom
    } else if (stemImmersionCm < 0) {
      status = 'bulb_exposed'; // density extremely high -> stem completely out, bulb partially floats
    }

    const clampedStemImmersion = Math.max(0, Math.min(L_STEM, stemImmersionCm));
    const totalSubmergedHeight = H_BULB + clampedStemImmersion; // cm from bottom tip

    // Upthrust at equilibrium: F_b = rho * V_sub * g
    // Total weight: W = M * g
    const massKg = massG / 1000;
    const weightN = massKg * G_ACCEL;
    const vSubActual = Math.min(V_BULB + A_STEM * L_STEM, Math.max(0, V_BULB + A_STEM * clampedStemImmersion));
    const upthrustN = (rhoFluidGcm3 * 1000) * (vSubActual * 1e-6) * G_ACCEL;
    const netForceN = upthrustN - weightN;

    // Stem sensitivity: |dh_sub / d(RD)| = (M / (A_stem * RD^2))
    // in cm per unit RD, or mm per 0.01 RD
    const rd = currentLiquid.rd;
    const sensitivityMmPerPoint01 = (massG / (A_STEM * rd * rd)) * 0.1; // mm per 0.01 RD

    return {
      rhoFluidGcm3,
      massG,
      massKg,
      weightN,
      upthrustN,
      netForceN,
      vSubRequired,
      vSubActual,
      stemImmersionCm,
      clampedStemImmersion,
      totalSubmergedHeight,
      status,
      sensitivityMmPerPoint01,
      readingRD: currentLiquid.rd,
      readingDensity: currentLiquid.density,
      stemArea: A_STEM,
      vBulb: V_BULB,
      lStem: L_STEM,
      hBulb: H_BULB
    };
  }, [currentLiquid, hydrometerMass, A_STEM]);

  const phys = calculatePhysics();

  // Trigger bobbing impulse when liquid, mass, or stem changes
  useEffect(() => {
    dynRef.current.yOffset = 1.8;
    dynRef.current.vy = -1.2;
    if (typeof onTelemetry === 'function') {
      onTelemetry('SIMULATION_STATE_CHANGED', {
        simulation: 'hydrometer_calibration_density',
        liquid: currentLiquid.name,
        density: currentLiquid.density,
        rd: currentLiquid.rd,
        stemType,
        hydrometerMass,
        immersionCm: phys.clampedStemImmersion.toFixed(2)
      });
    }
  }, [currentLiquid.id, currentLiquid.density, stemType, hydrometerMass]);

  // Challenge evaluation
  useEffect(() => {
    if (activeChallenge && !challengeCompleted) {
      if (activeChallenge.verify(phys, currentLiquid)) {
        setChallengeCompleted(true);
        setToastMessage(activeChallenge.reward);
        if (typeof onTelemetry === 'function') {
          onTelemetry('SIMULATION_CHALLENGE_COMPLETED', {
            simulation: 'hydrometer_calibration_density',
            challengeId: activeChallenge.id,
            liquid: currentLiquid.id,
            rd: phys.readingRD
          });
        }
      }
    }
  }, [activeChallenge, challengeCompleted, phys, currentLiquid, onTelemetry]);

  // Handle Preset application
  const applyPreset = (preset) => {
    const l = LIQUIDS.find((liq) => liq.id === preset.liquidId) || LIQUIDS[2];
    setSelectedLiquidId(l.id);
    setIsCustomLiquid(false);
    setStemType(preset.stemType);
    setHydrometerMass(preset.mass);
    setActiveChallenge(null);
    setChallengeCompleted(false);
    dynRef.current.yOffset = 2.0;
    dynRef.current.vy = 0;
    if (typeof onTelemetry === 'function') {
      onTelemetry('SIMULATION_PRESET_SELECTED', {
        simulation: 'hydrometer_calibration_density',
        presetId: preset.id
      });
    }
  };

  // Start guided challenge
  const startChallenge = (ch) => {
    setActiveChallenge(ch);
    setChallengeCompleted(false);
    setToastMessage(null);
  };

  // Nudge / perturbation function
  const handleNudge = () => {
    dynRef.current.yOffset = -2.2;
    dynRef.current.vy = 2.0;
  };

  // Reset apparatus
  const handleReset = () => {
    setSelectedLiquidId('pure_water');
    setIsCustomLiquid(false);
    setCustomDensity(1000);
    setStemType('narrow');
    setHydrometerMass(28.0);
    setActiveChallenge(null);
    setChallengeCompleted(false);
    setToastMessage(null);
    dynRef.current.yOffset = 2.0;
    dynRef.current.vy = 0;
  };

  // --- RENDERING PIPELINE (Full Apparatus Canvas) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;

    const render = () => {
      // 1. Update Bobbing Oscillation Physics
      if (isBobbing) {
        const k = 0.08 * (phys.rhoFluidGcm3) * (phys.stemArea / 0.65);
        const damping = 0.035 * currentLiquid.viscosity;
        const accel = -k * dynRef.current.yOffset - damping * dynRef.current.vy;

        dynRef.current.vy += accel;
        dynRef.current.yOffset += dynRef.current.vy;

        if (Math.abs(dynRef.current.yOffset) < 0.005 && Math.abs(dynRef.current.vy) < 0.005) {
          dynRef.current.yOffset = 0;
          dynRef.current.vy = 0;
        }
      } else {
        dynRef.current.yOffset = 0;
        dynRef.current.vy = 0;
      }

      dynRef.current.time += 0.03;

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // --- Background: Sleek Dark Lab Ambience ---
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#0a0e17');
      bgGrad.addColorStop(0.6, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Background laboratory grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // --- Bench / Base Stand ---
      const benchY = H - 38;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(40, benchY, W - 80, 12);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(30, benchY + 12, W - 60, 24);

      // Metallic top trim on bench
      const benchTrim = ctx.createLinearGradient(0, 0, W, 0);
      benchTrim.addColorStop(0, '#334155');
      benchTrim.addColorStop(0.5, '#64748b');
      benchTrim.addColorStop(1, '#334155');
      ctx.fillStyle = benchTrim;
      ctx.fillRect(40, benchY, W - 80, 2);

      // --- Tall Graduated Measuring Cylinder Geometry ---
      const cylX = W * 0.44;
      const cylW = 126;
      const cylH = H - 90;
      const cylTopY = benchY - cylH;
      const cylBottomY = benchY;
      const cylLeft = cylX - cylW / 2;
      const cylRight = cylX + cylW / 2;
      const wallThickness = 7;
      const innerLeft = cylLeft + wallThickness;
      const innerRight = cylRight - wallThickness;
      const innerWidth = innerRight - innerLeft;

      // Heavy Glass Base of Cylinder
      ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.beginPath();
      ctx.ellipse(cylX, cylBottomY - 2, cylW * 0.8, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Cylinder Liquid Fill Level
      const liquidSurfaceY = cylTopY + 85;
      const liquidBottomY = cylBottomY - 10;
      const liquidDepthPx = liquidBottomY - liquidSurfaceY;

      // 1. Draw Liquid Fill Inside Cylinder
      ctx.save();
      ctx.beginPath();
      ctx.rect(innerLeft, liquidSurfaceY, innerWidth, liquidDepthPx);
      ctx.clip();

      const liquidGradient = ctx.createLinearGradient(innerLeft, 0, innerRight, 0);
      liquidGradient.addColorStop(0, currentLiquid.color);
      liquidGradient.addColorStop(0.3, currentLiquid.color);
      liquidGradient.addColorStop(0.8, currentLiquid.color.replace(/[\d.]+$/, '0.25)'));
      liquidGradient.addColorStop(1, currentLiquid.color);
      ctx.fillStyle = liquidGradient;
      ctx.fillRect(innerLeft, liquidSurfaceY, innerWidth, liquidDepthPx);

      // Gentle rising bubbles
      for (let i = 0; i < 6; i++) {
        const bx = innerLeft + 15 + ((i * 37 + dynRef.current.time * 12) % (innerWidth - 30));
        const by = liquidBottomY - ((i * 65 + dynRef.current.time * 28) % liquidDepthPx);
        const br = 1.5 + (i % 3) * 0.8;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fill();
      }
      ctx.restore();

      // Liquid Meniscus Surface Curve
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cylX, liquidSurfaceY, innerWidth / 2, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = currentLiquid.liquidBorder;
      ctx.globalAlpha = 0.6;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // --- HYDROMETER RENDERING ---
      const pxPerCm = 11.5;
      const bulbHeightPx = H_BULB * pxPerCm;
      const stemLengthPx = L_STEM * pxPerCm;
      const stemRadiusPx = stemType === 'narrow' ? 6.5 : 11.5;
      const bulbRadiusPx = 28;

      const currentStemImmersionCm = phys.clampedStemImmersion + dynRef.current.yOffset;
      const stemBulbJunctionY = liquidSurfaceY + currentStemImmersionCm * pxPerCm;
      const bulbBottomY = stemBulbJunctionY + bulbHeightPx;
      const hydrometerX = cylX;

      const maxBulbBottomY = cylBottomY - 12;
      let actualStemBulbJunctionY = stemBulbJunctionY;
      if (bulbBottomY > maxBulbBottomY) {
        actualStemBulbJunctionY = maxBulbBottomY - bulbHeightPx;
      }

      ctx.save();

      // 1. Bulb Shape
      ctx.beginPath();
      ctx.moveTo(hydrometerX - stemRadiusPx, actualStemBulbJunctionY);
      ctx.bezierCurveTo(
        hydrometerX - bulbRadiusPx * 0.9, actualStemBulbJunctionY + bulbHeightPx * 0.2,
        hydrometerX - bulbRadiusPx, actualStemBulbJunctionY + bulbHeightPx * 0.4,
        hydrometerX - bulbRadiusPx, actualStemBulbJunctionY + bulbHeightPx * 0.65
      );
      ctx.arc(
        hydrometerX,
        actualStemBulbJunctionY + bulbHeightPx - bulbRadiusPx,
        bulbRadiusPx,
        Math.PI,
        0,
        true
      );
      ctx.bezierCurveTo(
        hydrometerX + bulbRadiusPx, actualStemBulbJunctionY + bulbHeightPx * 0.4,
        hydrometerX + bulbRadiusPx * 0.9, actualStemBulbJunctionY + bulbHeightPx * 0.2,
        hydrometerX + stemRadiusPx, actualStemBulbJunctionY
      );
      ctx.closePath();

      const bulbGlassGrad = ctx.createLinearGradient(hydrometerX - bulbRadiusPx, 0, hydrometerX + bulbRadiusPx, 0);
      bulbGlassGrad.addColorStop(0, 'rgba(226, 232, 240, 0.45)');
      bulbGlassGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.7)');
      bulbGlassGrad.addColorStop(0.6, 'rgba(203, 213, 225, 0.25)');
      bulbGlassGrad.addColorStop(0.9, 'rgba(148, 163, 184, 0.4)');
      bulbGlassGrad.addColorStop(1, 'rgba(100, 116, 139, 0.55)');
      ctx.fillStyle = bulbGlassGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(241, 245, 249, 0.75)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Lower Bulb Ballast
      const ballastDomeCenterY = actualStemBulbJunctionY + bulbHeightPx - bulbRadiusPx * 0.8;
      ctx.save();
      ctx.beginPath();
      ctx.arc(hydrometerX, actualStemBulbJunctionY + bulbHeightPx - bulbRadiusPx, bulbRadiusPx - 2, 0, Math.PI);
      ctx.clip();

      const ballastHeight = 14 + (hydrometerMass - 20) * 1.1;
      const ballastTopY = actualStemBulbJunctionY + bulbHeightPx - ballastHeight;

      const leadBed = ctx.createLinearGradient(0, ballastTopY, 0, actualStemBulbJunctionY + bulbHeightPx);
      leadBed.addColorStop(0, '#1e293b');
      leadBed.addColorStop(0.5, '#0f172a');
      leadBed.addColorStop(1, '#020617');
      ctx.fillStyle = leadBed;
      ctx.fillRect(hydrometerX - bulbRadiusPx, ballastTopY, bulbRadiusPx * 2, ballastHeight + 10);

      const pelletRows = 4;
      for (let row = 0; row < pelletRows; row++) {
        const count = 5 - row;
        const py = actualStemBulbJunctionY + bulbHeightPx - 5 - row * 5.5;
        for (let col = 0; col < count; col++) {
          const px = hydrometerX + (col - (count - 1) / 2) * 8.5;
          ctx.beginPath();
          ctx.arc(px, py, 3.4, 0, Math.PI * 2);
          const pelletGrad = ctx.createRadialGradient(px - 1, py - 1, 0.5, px, py, 3.5);
          pelletGrad.addColorStop(0, '#94a3b8');
          pelletGrad.addColorStop(0.5, '#475569');
          pelletGrad.addColorStop(1, '#1e293b');
          ctx.fillStyle = pelletGrad;
          ctx.fill();
        }
      }
      ctx.restore();

      // 2. Uniform Glass Stem
      const currentStemTopY = actualStemBulbJunctionY - stemLengthPx;
      ctx.beginPath();
      ctx.rect(hydrometerX - stemRadiusPx, currentStemTopY, stemRadiusPx * 2, stemLengthPx);
      const stemGlassGrad = ctx.createLinearGradient(hydrometerX - stemRadiusPx, 0, hydrometerX + stemRadiusPx, 0);
      stemGlassGrad.addColorStop(0, 'rgba(203, 213, 225, 0.5)');
      stemGlassGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
      stemGlassGrad.addColorStop(0.55, 'rgba(241, 245, 249, 0.35)');
      stemGlassGrad.addColorStop(0.85, 'rgba(148, 163, 184, 0.45)');
      stemGlassGrad.addColorStop(1, 'rgba(100, 116, 139, 0.6)');
      ctx.fillStyle = stemGlassGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.8)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(hydrometerX, currentStemTopY, stemRadiusPx, Math.PI, 0);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.9)';
      ctx.stroke();

      // Paper Scale Insert Inside Stem
      const paperWidth = stemRadiusPx * 1.6;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(hydrometerX - paperWidth / 2, currentStemTopY + 8, paperWidth, stemLengthPx - 16);

      const scaleMarkers = [
        { rd: 0.75, label: '0.75' },
        { rd: 0.80, label: '0.80' },
        { rd: 0.85, label: '0.85' },
        { rd: 0.90, label: '0.90' },
        { rd: 0.95, label: '0.95' },
        { rd: 1.00, label: '1.00' },
        { rd: 1.05, label: '1.05' },
        { rd: 1.10, label: '1.10' },
        { rd: 1.20, label: '1.20' },
        { rd: 1.30, label: '1.30' },
        { rd: 1.40, label: '1.40' },
        { rd: 1.60, label: '1.60' },
        { rd: 1.80, label: '1.80' }
      ];

      scaleMarkers.forEach((mark) => {
        const vReq = hydrometerMass / mark.rd;
        const hCm = (vReq - V_BULB) / A_STEM;
        if (hCm >= 0 && hCm <= L_STEM) {
          const markY = actualStemBulbJunctionY - hCm * pxPerCm;

          ctx.beginPath();
          const isWater = mark.rd === 1.00;
          ctx.strokeStyle = isWater ? '#ef4444' : '#0f172a';
          ctx.lineWidth = isWater ? 1.6 : 1.0;

          ctx.moveTo(hydrometerX - paperWidth / 2, markY);
          ctx.lineTo(hydrometerX + paperWidth / 2, markY);
          ctx.stroke();

          if (stemType === 'wide' || mark.rd === 1.00 || mark.rd === 0.80 || mark.rd === 1.20 || mark.rd === 1.60) {
            ctx.fillStyle = isWater ? '#dc2626' : '#334155';
            ctx.font = 'bold 8px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(mark.label, hydrometerX, markY - 1.5);
          }
        }
      });

      for (let testRd = 0.76; testRd <= 1.85; testRd += 0.02) {
        const vReq = hydrometerMass / testRd;
        const hCm = (vReq - V_BULB) / A_STEM;
        if (hCm >= 0 && hCm <= L_STEM) {
          const markY = actualStemBulbJunctionY - hCm * pxPerCm;
          ctx.beginPath();
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 0.6;
          ctx.moveTo(hydrometerX - paperWidth / 2, markY);
          ctx.lineTo(hydrometerX - paperWidth / 2 + 3, markY);
          ctx.moveTo(hydrometerX + paperWidth / 2 - 3, markY);
          ctx.lineTo(hydrometerX + paperWidth / 2, markY);
          ctx.stroke();
        }
      }

      ctx.restore();

      // 3. Meniscus Contact on Stem
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(hydrometerX - stemRadiusPx - 8, liquidSurfaceY);
      ctx.quadraticCurveTo(hydrometerX - stemRadiusPx, liquidSurfaceY - 3, hydrometerX - stemRadiusPx, liquidSurfaceY - 4);
      ctx.lineTo(hydrometerX + stemRadiusPx, liquidSurfaceY - 4);
      ctx.quadraticCurveTo(hydrometerX + stemRadiusPx, liquidSurfaceY - 3, hydrometerX + stemRadiusPx + 8, liquidSurfaceY);
      ctx.strokeStyle = currentLiquid.liquidBorder;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // --- Cylinder Glass Graduations ---
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fillRect(cylLeft, cylTopY, wallThickness, cylH);
      ctx.fillRect(cylRight - wallThickness, cylTopY, wallThickness, cylH);

      ctx.strokeStyle = 'rgba(226, 232, 240, 0.35)';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(cylLeft, cylTopY, cylW, cylH);

      const glassHighlight = ctx.createLinearGradient(cylLeft, 0, cylRight, 0);
      glassHighlight.addColorStop(0.05, 'rgba(255, 255, 255, 0.35)');
      glassHighlight.addColorStop(0.12, 'rgba(255, 255, 255, 0.05)');
      glassHighlight.addColorStop(0.85, 'rgba(255, 255, 255, 0.03)');
      glassHighlight.addColorStop(0.95, 'rgba(255, 255, 255, 0.25)');
      ctx.fillStyle = glassHighlight;
      ctx.fillRect(cylLeft, cylTopY, cylW, cylH);

      ctx.beginPath();
      ctx.ellipse(cylX, cylTopY, cylW / 2 + 4, 9, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.fillStyle = 'rgba(203, 213, 225, 0.6)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'right';
      for (let ml = 100; ml <= 500; ml += 100) {
        const mlY = cylBottomY - 15 - ((ml / 550) * (cylH - 90));
        ctx.beginPath();
        ctx.moveTo(cylLeft + wallThickness, mlY);
        ctx.lineTo(cylLeft + wallThickness + 10, mlY);
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.fillText(`${ml}`, cylLeft + wallThickness + 32, mlY + 3);
      }

      // --- Vector Free-Body Diagram Overlay ---
      if (showVectors) {
        const centerG = { x: hydrometerX - 42, y: ballastDomeCenterY - 4 };
        const centerB = {
          x: hydrometerX - 42,
          y: actualStemBulbJunctionY + (bulbHeightPx * 0.45)
        };

        const drawArrow = (fromX, fromY, toX, toY, color, label) => {
          const headlen = 8;
          const angle = Math.atan2(toY - fromY, toX - fromX);
          ctx.save();
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = 2.5;

          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(toX, toY);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(toX, toY);
          ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
          ctx.closePath();
          ctx.fill();

          ctx.font = 'bold 10px sans-serif';
          ctx.fillText(label, toX - 35, toY + (toY > fromY ? 14 : -6));
          ctx.restore();
        };

        const arrowBuoyancyLen = Math.min(85, Math.max(25, phys.upthrustN * 260));
        drawArrow(
          centerB.x,
          centerB.y,
          centerB.x,
          centerB.y - arrowBuoyancyLen,
          '#06b6d4',
          `F_B: ${(phys.upthrustN).toFixed(2)} N`
        );

        ctx.beginPath();
        ctx.arc(centerB.x, centerB.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        const arrowWeightLen = Math.min(85, Math.max(25, phys.weightN * 260));
        drawArrow(
          centerG.x,
          centerG.y,
          centerG.x,
          centerG.y + arrowWeightLen,
          '#f59e0b',
          `W: ${(phys.weightN).toFixed(2)} N`
        );

        ctx.beginPath();
        ctx.arc(centerG.x, centerG.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.save();
        ctx.font = '9px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('B (Centroid)', centerB.x - 55, centerB.y + 3);
        ctx.fillText('G (Ballast)', centerG.x - 55, centerG.y + 3);
        ctx.restore();
      }

      // --- On-Canvas Status / Immersion Callout Banner ---
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.7)';
      ctx.lineWidth = 1;
      const calloutX = 20;
      const calloutY = 20;
      ctx.beginPath();
      ctx.roundRect(calloutX, calloutY, 210, 84, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`LIQUID: ${currentLiquid.name.toUpperCase()}`, calloutX + 12, calloutY + 20);

      ctx.fillStyle = '#f1f5f9';
      ctx.font = '10px monospace';
      ctx.fillText(`Density (ρ): ${currentLiquid.density} kg/m³`, calloutX + 12, calloutY + 38);
      ctx.fillText(`Rel. Density: ${(currentLiquid.rd).toFixed(3)}`, calloutX + 12, calloutY + 54);

      let statusColor = '#10b981';
      let statusText = 'Equilibrium Float';
      if (phys.status === 'sunk') {
        statusColor = '#ef4444';
        statusText = 'Sunk to Bottom';
      } else if (phys.status === 'bulb_exposed') {
        statusColor = '#f59e0b';
        statusText = 'High Buoyancy';
      }
      ctx.fillStyle = statusColor;
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`Status: ${statusText}`, calloutX + 12, calloutY + 70);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    currentLiquid,
    phys,
    stemType,
    hydrometerMass,
    showVectors,
    isBobbing,
    V_BULB,
    H_BULB,
    L_STEM
  ]);

  // --- ZOOMED-IN STEM LOUPE CANVAS ---
  useEffect(() => {
    if (!showLoupe) return;
    const canvas = loupeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const bg = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W / 2);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(0.85, '#090d16');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const meniscusY = H / 2;
    const stemCenterX = W / 2;
    const stemLoupeWidth = stemType === 'narrow' ? 68 : 115;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, meniscusY, W, H - meniscusY);
    ctx.clip();
    const loupeLiquidGrad = ctx.createLinearGradient(0, meniscusY, 0, H);
    loupeLiquidGrad.addColorStop(0, currentLiquid.color);
    loupeLiquidGrad.addColorStop(1, currentLiquid.color.replace(/[\d.]+$/, '0.6)'));
    ctx.fillStyle = loupeLiquidGrad;
    ctx.fillRect(0, meniscusY, W, H - meniscusY);
    ctx.restore();

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(stemCenterX - stemLoupeWidth / 2, 0, stemLoupeWidth, H);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(stemCenterX - stemLoupeWidth / 2, 0, stemLoupeWidth, H);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, meniscusY);
    ctx.lineTo(stemCenterX - stemLoupeWidth / 2 - 20, meniscusY);
    ctx.quadraticCurveTo(
      stemCenterX - stemLoupeWidth / 2 + 1, meniscusY - 14,
      stemCenterX - stemLoupeWidth / 2, meniscusY - 18
    );
    ctx.lineTo(stemCenterX - stemLoupeWidth / 2, meniscusY);
    ctx.lineTo(stemCenterX + stemLoupeWidth / 2, meniscusY);
    ctx.quadraticCurveTo(
      stemCenterX + stemLoupeWidth / 2 - 1, meniscusY - 14,
      stemCenterX + stemLoupeWidth / 2 + 20, meniscusY
    );
    ctx.lineTo(W, meniscusY);
    ctx.strokeStyle = currentLiquid.liquidBorder;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();

    const loupePxPerCm = 95;
    const currentEquilibriumImmersionCm = phys.clampedStemImmersion;

    for (let rdVal = 0.70; rdVal <= 1.90; rdVal += 0.005) {
      const vReq = hydrometerMass / rdVal;
      const markHCm = (vReq - V_BULB) / A_STEM;
      const deltaHCm = markHCm - currentEquilibriumImmersionCm;
      const y = meniscusY + deltaHCm * loupePxPerCm;

      if (y >= 8 && y <= H - 8) {
        const isPoint05 = Math.abs((rdVal * 100) % 5) < 0.01;
        const isPoint01 = Math.abs((rdVal * 100) % 1) < 0.01;
        const isWater = Math.abs(rdVal - 1.000) < 0.002;

        ctx.beginPath();
        ctx.lineWidth = isWater ? 2.5 : isPoint05 ? 1.8 : isPoint01 ? 1.2 : 0.8;
        ctx.strokeStyle = isWater ? '#ef4444' : isPoint05 ? '#0f172a' : '#64748b';

        const tickW = isPoint05 ? stemLoupeWidth * 0.75 : isPoint01 ? stemLoupeWidth * 0.5 : stemLoupeWidth * 0.3;
        ctx.moveTo(stemCenterX - tickW / 2, y);
        ctx.lineTo(stemCenterX + tickW / 2, y);
        ctx.stroke();

        if (isPoint05 || (stemType === 'wide' && isPoint01)) {
          ctx.fillStyle = isWater ? '#dc2626' : '#1e293b';
          ctx.font = isWater ? 'bold 12px monospace' : '10px monospace';
          ctx.textAlign = 'right';
          ctx.fillText(rdVal.toFixed(2), stemCenterX - tickW / 2 - 4, y + 3.5);
        }
      }
    }

    ctx.save();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(10, meniscusY);
    ctx.lineTo(W - 10, meniscusY);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(6, meniscusY - 5);
    ctx.lineTo(14, meniscusY);
    ctx.lineTo(6, meniscusY + 5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(W - 6, meniscusY - 5);
    ctx.lineTo(W - 14, meniscusY);
    ctx.lineTo(W - 6, meniscusY + 5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`READING: ${(phys.readingRD).toFixed(3)} RD`, W / 2, 22);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '9px monospace';
    ctx.fillText('Read at flat bottom of meniscus', W / 2, H - 12);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(W / 2, H / 2, W / 2 - 3, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)';
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [showLoupe, currentLiquid, phys, stemType, hydrometerMass, V_BULB, A_STEM]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-sans text-slate-100 p-2 sm:p-4">
      {/* --- TOP HEADER BANNER --- */}
      <div className="bg-slate-900/90 border border-slate-800/80 backdrop-blur-md rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Form 4 Physics · Fluid Statics & Flotation
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            <Droplet className="w-6 h-6 text-cyan-400" />
            Hydrometer Calibration & Relative Density
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Archimedes' law of flotation, non-linear inverted scale graduations, and stem sensitivity analysis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowTheoryModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold text-cyan-300 flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            Theory & Derivations
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            Reset
          </button>
        </div>
      </div>

      {/* --- PRESETS TABS --- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PRESETS.map((preset) => {
          const isSelected = !isCustomLiquid && selectedLiquidId === preset.liquidId && stemType === preset.stemType;
          return (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/70 border-cyan-500/80 shadow-md shadow-cyan-950/40 text-cyan-100 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800/80 text-slate-300'
              }`}
            >
              <div>
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>{preset.title}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{preset.subtitle}</div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 line-clamp-1">{preset.desc}</div>
            </button>
          );
        })}
      </div>

      {/* --- ACTIVE CHALLENGE / TOAST BANNER --- */}
      {activeChallenge && (
        <div
          className={`p-3.5 rounded-xl border backdrop-blur-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            challengeCompleted
              ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
              : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {challengeCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Award className="w-5 h-5 text-indigo-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span>{activeChallenge.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-900/80 border border-indigo-600/40 text-indigo-300">
                  {activeChallenge.level}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{activeChallenge.target}</p>
              {!challengeCompleted && (
                <p className="text-[11px] text-indigo-300/80 mt-0.5 italic">
                  💡 Hint: {activeChallenge.hint}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {challengeCompleted && (
              <span className="text-xs font-bold bg-emerald-900/80 border border-emerald-500/50 text-emerald-300 px-2.5 py-1 rounded-full animate-pulse">
                ✓ Goal Achieved
              </span>
            )}
            <button
              onClick={() => setActiveChallenge(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN GRID: APPARATUS STAGE (LEFT) & CONTROLS + LOUPE (RIGHT) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Simulation Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Beaker className="w-4 h-4 text-cyan-400" />
                Physical Apparatus: Floating Hydrometer
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowVectors(!showVectors)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                  showVectors
                    ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
                title="Toggle Weight and Upthrust Force Vectors"
              >
                Forces (F_B / W)
              </button>
              <button
                onClick={handleNudge}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-300 cursor-pointer"
                title="Nudge hydrometer to observe harmonic bobbing oscillation"
              >
                Nudge Bob
              </button>
            </div>
          </div>

          {/* Interactive HTML5 Canvas */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[16/17] bg-slate-950/90 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={560}
              height={620}
              className="w-full h-full object-contain"
            />

            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800/80 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 backdrop-blur-sm">
              <span className="text-cyan-400 font-mono font-bold">Stem Area:</span>{' '}
              {stemType === 'narrow' ? '0.65 cm² (High Sens.)' : '1.30 cm² (Wide Range)'}
            </div>

            <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800/80 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 backdrop-blur-sm">
              <span className="text-amber-400 font-mono font-bold">Mass:</span> {hydrometerMass.toFixed(1)} g
            </div>
          </div>

          {/* Dynamic Force & Immersion Readout Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-center">
            <div className="bg-slate-950/60 border border-slate-800/70 p-2 rounded-xl">
              <div className="text-[10px] text-slate-400 font-medium">Relative Density</div>
              <div className="text-base font-bold font-mono text-cyan-300">
                {(phys.readingRD).toFixed(3)}
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/70 p-2 rounded-xl">
              <div className="text-[10px] text-slate-400 font-medium">Fluid Density (ρ)</div>
              <div className="text-base font-bold font-mono text-white">
                {currentLiquid.density} <span className="text-[10px] text-slate-400">kg/m³</span>
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/70 p-2 rounded-xl">
              <div className="text-[10px] text-slate-400 font-medium">Stem Immersion</div>
              <div className="text-base font-bold font-mono text-amber-300">
                {phys.clampedStemImmersion.toFixed(1)} <span className="text-[10px] text-slate-400">/ 25 cm</span>
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/70 p-2 rounded-xl">
              <div className="text-[10px] text-slate-400 font-medium">Sensitivity (dh/dρ)</div>
              <div className="text-base font-bold font-mono text-emerald-300">
                {phys.sensitivityMmPerPoint01.toFixed(1)} <span className="text-[10px] text-slate-400">mm / 0.01</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Controls, Liquid Selector & Zoomed Loupe (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Zoomed-in Stem Reader Loupe Box */}
          <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-cyan-400" />
                Zoomed Stem Reader (Loupe)
              </div>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/80 border border-cyan-800/50 px-2 py-0.5 rounded-full font-mono">
                5× Optical Magnification
              </span>
            </div>

            <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
              <canvas
                ref={loupeCanvasRef}
                width={360}
                height={225}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Target red dashed line indicates the bottom of the curved liquid meniscus.
            </p>
          </div>

          {/* Test Liquid Selection Panel */}
          <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-cyan-400" />
                Select Test Liquid
              </div>
              <button
                onClick={() => setIsCustomLiquid(!isCustomLiquid)}
                className={`text-[11px] px-2 py-0.5 rounded-md border font-semibold transition cursor-pointer ${
                  isCustomLiquid
                    ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300'
                    : 'bg-slate-850 border-slate-700 text-slate-400'
                }`}
              >
                {isCustomLiquid ? '✓ Custom Slider' : 'Custom Density'}
              </button>
            </div>

            {!isCustomLiquid ? (
              <div className="grid grid-cols-2 gap-1.5 max-h-[190px] overflow-y-auto pr-1">
                {LIQUIDS.map((liq) => {
                  const isSelected = selectedLiquidId === liq.id;
                  return (
                    <button
                      key={liq.id}
                      onClick={() => {
                        setSelectedLiquidId(liq.id);
                        setIsCustomLiquid(false);
                      }}
                      className={`p-2 rounded-xl text-left border text-xs transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-500/80 text-white font-semibold'
                          : 'bg-slate-950/50 hover:bg-slate-850 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="font-bold truncate">{liq.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                        <span>{liq.density} kg/m³</span>
                        <span className="font-mono text-cyan-300">{liq.rd.toFixed(3)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Custom Fluid Density (ρ):</span>
                  <span className="font-mono font-bold text-cyan-300">{customDensity} kg/m³</span>
                </div>
                <input
                  type="range"
                  min={650}
                  max={2000}
                  step={10}
                  value={customDensity}
                  onChange={(e) => setCustomDensity(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>650 (Hydrocarbons)</span>
                  <span>1000 (Water)</span>
                  <span>2000 (Heavy Acids)</span>
                </div>
              </div>
            )}
          </div>

          {/* Hydrometer Construction Tuning */}
          <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-4 shadow-lg space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Hydrometer Design & Stem Sensitivity
            </div>

            {/* Stem Sensitivity Switch */}
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1.5">
                Stem Cross-Sectional Diameter:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setStemType('narrow')}
                  className={`p-2 rounded-xl text-left border text-xs transition cursor-pointer ${
                    stemType === 'narrow'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 font-bold'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold">Narrow Stem (8 mm)</div>
                  <div className="text-[10px] text-cyan-400/80 font-normal">
                    Area = 0.65 cm² · High Sensitivity
                  </div>
                </button>
                <button
                  onClick={() => setStemType('wide')}
                  className={`p-2 rounded-xl text-left border text-xs transition cursor-pointer ${
                    stemType === 'wide'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 font-bold'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold">Wide Stem (13 mm)</div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    Area = 1.30 cm² · Wide Range
                  </div>
                </button>
              </div>
            </div>

            {/* Hydrometer Total Mass / Ballast */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Hydrometer Ballast & Total Mass:</span>
                <span className="font-mono font-bold text-amber-400">{hydrometerMass.toFixed(1)} g</span>
              </div>
              <input
                type="range"
                min={22.0}
                max={34.0}
                step={0.5}
                value={hydrometerMass}
                onChange={(e) => setHydrometerMass(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>22.0 g (Light Ballast)</span>
                <span>28.0 g (Std)</span>
                <span>34.0 g (Heavy Ballast)</span>
              </div>
            </div>
          </div>

          {/* Guided Inquiry Challenges List */}
          <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-4 shadow-lg space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Award className="w-4 h-4 text-cyan-400" />
              Guided Laboratory Challenges
            </div>
            <div className="space-y-1.5">
              {CHALLENGES.map((ch) => {
                const isActive = activeChallenge?.id === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => startChallenge(ch)}
                    className={`w-full p-2.5 rounded-xl text-left border text-xs transition cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-indigo-950/80 border-indigo-500 text-indigo-100 font-bold'
                        : 'bg-slate-950/50 hover:bg-slate-850 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{ch.title}</span>
                        <span className="text-[9px] px-1 py-0.2 bg-slate-800 rounded text-slate-400">
                          {ch.level}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{ch.target}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* --- THEORY & DERIVATION MODAL --- */}
      {showTheoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 text-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Beaker className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Hydrometer Physics, Scale Geometry & Sensitivity
                </h3>
              </div>
              <button
                onClick={() => setShowTheoryModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {/* Section 1 */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  1. The Law of Flotation & Archimedes' Principle
                </h4>
                <p>
                  A floating body displaces its own weight of the liquid in which it floats. For a hydrometer
                  of total mass <span className="font-mono text-amber-300 font-bold">M</span> in a liquid of density{' '}
                  <span className="font-mono text-cyan-300 font-bold">ρ</span>:
                </p>
                <div className="bg-slate-900/90 p-3 rounded-xl font-mono text-center text-cyan-200 border border-slate-800 text-xs sm:text-sm">
                  Upthrust = Weight of Displaced Liquid = Total Hydrometer Weight
                  <br />
                  <span className="text-amber-300">ρ · V_sub · g = M · g</span> &nbsp;⟹&nbsp;{' '}
                  <span className="text-emerald-300">V_sub = M / ρ</span>
                </div>
              </div>

              {/* Section 2 */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  2. Stem Immersion Equation & Anatomical Design
                </h4>
                <p>
                  A hydrometer consists of a weighted bulb of volume{' '}
                  <span className="font-mono text-amber-300">V_bulb</span> and a uniform stem of cross-sectional area{' '}
                  <span className="font-mono text-amber-300">A</span>. The submerged stem height{' '}
                  <span className="font-mono text-cyan-300 font-bold">h_sub</span> is given by:
                </p>
                <div className="bg-slate-900/90 p-3 rounded-xl font-mono text-center text-amber-300 border border-slate-800 text-xs sm:text-sm">
                  V_sub = V_bulb + (A · h_sub) = M / ρ
                  <br />
                  <span className="text-emerald-300 font-bold">h_sub = (M / ρ - V_bulb) / A</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  • <strong>Heavy Lead Ballast:</strong> Concentrated in the bottom spherical chamber to lower the
                  Center of Gravity (<span className="text-amber-400 font-bold">G</span>) far below the Center of
                  Buoyancy (<span className="text-cyan-400 font-bold">B</span>), creating stable righting torque so it
                  floats upright without toppling over.
                </p>
              </div>

              {/* Section 3 */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  3. Why the Scale is Inverted & Non-Linear
                </h4>
                <div className="space-y-1.5">
                  <p>
                    <strong>1. Inverted Scale (Numbers increase downwards):</strong>
                    <br />
                    In a denser liquid, less volume needs to be submerged to balance weight <span className="font-mono">M</span>.
                    The hydrometer floats higher, so the liquid surface meets the lower end of the stem. Hence,
                    smaller density values (0.70 – 0.80) are printed at the <em>top</em>, and larger values (1.20 – 1.80)
                    are at the <em>bottom</em>.
                  </p>
                  <p>
                    <strong>2. Non-Linear Spacing (Wider at top, crowded at bottom):</strong>
                    <br />
                    Differentiating the immersion equation with respect to density <span className="font-mono">ρ</span>:
                  </p>
                  <div className="bg-slate-900/90 p-2.5 rounded-xl font-mono text-center text-cyan-200 border border-slate-800">
                    dh_sub / dρ = -M / (A · ρ²)
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Because the rate of change is inversely proportional to <span className="font-mono">ρ²</span>, equal
                    increments in density produce larger changes in immersion at low densities than at high densities.
                    Therefore, the scale markings are spaced far apart at the top and closely packed at the bottom!
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  4. Practical Real-World Applications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <strong className="text-white">Lactometer (Dairy Testing):</strong>
                    <p className="text-slate-400 mt-1">
                      Pure milk has relative density 1.028 – 1.034 due to dissolved solids and proteins. Diluting with
                      water lowers the density below 1.026, sinking the lactometer stem.
                    </p>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <strong className="text-white">Automotive Battery Hydrometer:</strong>
                    <p className="text-slate-400 mt-1">
                      Lead-acid battery electrolyte state of charge: Fully charged = 1.265 – 1.280; 50% charged =
                      1.200 – 1.220; fully discharged = 1.120 – 1.150.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowTheoryModal(false)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close & Return to Experiment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
