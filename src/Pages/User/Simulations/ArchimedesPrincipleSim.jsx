import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
} from 'lucide-react';

// --- SOLID MATERIAL DATA ---
const MATERIALS = {
  wood: {
    id: 'wood',
    name: 'Pine Wood',
    density: 600, // kg/m³
    color: '#d97706',
    border: '#b45309',
    texture: 'grain',
    desc: 'Lightweight porous wood, less dense than water (floats naturally).',
  },
  aluminium: {
    id: 'aluminium',
    name: 'Aluminium',
    density: 2700, // kg/m³
    color: '#cbd5e1',
    border: '#94a3b8',
    texture: 'brushed',
    desc: 'Low-density metal ideal for classic displacement lab experiments.',
  },
  iron: {
    id: 'iron',
    name: 'Cast Iron',
    density: 7800, // kg/m³
    color: '#64748b',
    border: '#475569',
    texture: 'cast',
    desc: 'Dense structural ferromagnetic metal with strong downward weight.',
  },
  lead: {
    id: 'lead',
    name: 'Lead',
    density: 11340, // kg/m³
    color: '#475569',
    border: '#334155',
    texture: 'matte',
    desc: 'Extremely dense metal; small volume produces relatively modest upthrust.',
  },
  custom: {
    id: 'custom',
    name: 'Custom Material',
    density: 2000,
    color: '#a855f7',
    border: '#7e22ce',
    texture: 'crystal',
    desc: 'Adjustable density for inquiry experiments and unknown substance tests.',
  },
};

// --- LIQUID MEDIUM DATA ---
const LIQUIDS = {
  pure_water: {
    id: 'pure_water',
    name: 'Pure Water',
    density: 1000, // kg/m³
    color: 'rgba(56, 189, 248, 0.45)',
    surfaceColor: '#38bdf8',
    deepColor: 'rgba(14, 165, 233, 0.75)',
    desc: 'Standard laboratory reference fluid at 4°C (1.00 g/cm³).',
  },
  sea_water: {
    id: 'sea_water',
    name: 'Sea Water (Saline)',
    density: 1030, // kg/m³
    color: 'rgba(20, 184, 166, 0.45)',
    surfaceColor: '#14b8a6',
    deepColor: 'rgba(13, 148, 136, 0.80)',
    desc: 'Dissolved salts elevate density, boosting buoyant force.',
  },
  kerosene: {
    id: 'kerosene',
    name: 'Kerosene',
    density: 800, // kg/m³
    color: 'rgba(245, 158, 11, 0.40)',
    surfaceColor: '#f59e0b',
    deepColor: 'rgba(217, 119, 6, 0.70)',
    desc: 'Less dense than water; objects experience reduced upthrust.',
  },
  glycerin: {
    id: 'glycerin',
    name: 'Glycerin',
    density: 1260, // kg/m³
    color: 'rgba(16, 185, 129, 0.45)',
    surfaceColor: '#10b981',
    deepColor: 'rgba(5, 150, 105, 0.80)',
    desc: 'Viscous, high-density non-toxic trihydroxy alcohol.',
  },
  mercury: {
    id: 'mercury',
    name: 'Liquid Mercury',
    density: 13600, // kg/m³
    color: 'rgba(148, 163, 184, 0.85)',
    surfaceColor: '#cbd5e1',
    deepColor: 'rgba(100, 116, 139, 0.95)',
    desc: 'Dense metallic fluid in which iron, aluminium, and lead float.',
  },
};

// --- GRAVITY PRESETS ---
const GRAVITY_OPTIONS = [
  { id: 'earth', name: 'Earth (9.81 m/s²)', g: 9.81 },
  { id: 'moon', name: 'Moon (1.62 m/s²)', g: 1.62 },
  { id: 'mars', name: 'Mars (3.71 m/s²)', g: 3.71 },
  { id: 'jupiter', name: 'Jupiter (24.79 m/s²)', g: 24.79 },
];

// --- PRESETS ---
const PRESETS = [
  {
    id: 'classic_eureka',
    name: 'Classic Eureka Can in Water',
    tagline: 'Aluminium Block in Pure Water',
    material: 'aluminium',
    liquid: 'pure_water',
    volumeCm3: 250,
    immersionPct: 100,
    gId: 'earth',
    desc: 'The benchmark Eureka can experiment: submerged aluminium displaces its exact volume of water, yielding identical upthrust and displaced fluid weight.',
  },
  {
    id: 'dense_saline',
    name: 'Dense Saline Immersion',
    tagline: 'Cast Iron in Sea Water',
    material: 'iron',
    liquid: 'sea_water',
    volumeCm3: 200,
    immersionPct: 100,
    gId: 'earth',
    desc: 'Observe how increased fluid density (1030 kg/m³) provides greater buoyant lift than freshwater, reducing the apparent weight on the balance.',
  },
  {
    id: 'wood_float',
    name: 'Wood: Flotation Equilibrium',
    tagline: 'Law of Flotation (Zero Spring Tension)',
    material: 'wood',
    liquid: 'pure_water',
    volumeCm3: 300,
    immersionPct: 60,
    gId: 'earth',
    desc: 'Pine wood (600 kg/m³) naturally floats at 60% immersion in water. The spring goes completely slack (T = 0 N) as upthrust equals total weight.',
  },
  {
    id: 'heavy_lead',
    name: 'Heavy Lead Apparent Weight',
    tagline: 'High Density, Low Displaced Volume',
    material: 'lead',
    liquid: 'pure_water',
    volumeCm3: 150,
    immersionPct: 100,
    gId: 'earth',
    desc: 'Lead possesses immense weight per volume. While submerged, it displaces only 150 mL of water, creating a small percentage apparent weight loss.',
  },
];

// --- GUIDED CHALLENGES ---
const CHALLENGES = [
  {
    id: 'challenge_equality',
    title: '1. The Archimedean Equality',
    difficulty: 'Introductory',
    hint: 'Submerge the Aluminium block completely (100%) in Pure Water and compare the Upthrust (U) to the Displaced Water Weight (W_disp).',
    badge: 'Archimedes Verified',
    check: (p) =>
      p.materialKey === 'aluminium' &&
      p.liquidKey === 'pure_water' &&
      p.immersionPct >= 99 &&
      Math.abs(p.U - p.W_disp) < 0.02,
    congrats: 'Mastered! You proved that Upthrust U is precisely equal to the weight of the fluid overflowing into the measuring cylinder (U = W_disp).',
  },
  {
    id: 'challenge_flotation',
    title: '2. The Law of Flotation',
    difficulty: 'Intermediate',
    hint: 'Select Pine Wood in Pure Water. Adjust immersion until the spring balance tension drops to exactly 0.00 N (floating equilibrium without forcing down).',
    badge: 'Flotation Master',
    check: (p) =>
      p.materialKey === 'wood' &&
      p.liquidKey === 'pure_water' &&
      Math.abs(p.immersionPct - 60) <= 2 &&
      p.apparentWeight <= 0.05,
    congrats: 'Phenomenal! A floating object displaces its own weight of fluid. Since ρ_wood / ρ_water = 600 / 1000 = 60%, the spring becomes slack at 60% submersion!',
  },
  {
    id: 'challenge_halflife',
    title: '3. Density Detective: 50% Weight Loss',
    difficulty: 'Advanced',
    hint: 'Fully immerse a solid (100%) such that its apparent weight (T) is exactly 50% of its real weight in air (W_apparent / W_air = 0.50 ± 0.02). Think about the density ratio ρ_f / ρ_s.',
    badge: 'Crown Detective',
    check: (p) =>
      p.immersionPct >= 99 &&
      p.W_air > 0 &&
      Math.abs(p.apparentWeight / p.W_air - 0.5) <= 0.025,
    congrats: 'Eureka! When fluid density is exactly half of the solid density (ρ_fluid = 0.5 · ρ_solid), the buoyant upthrust offsets half the gravitational weight!',
  },
];

export default function ArchimedesPrincipleSim({ onTelemetry }) {
  // Primary simulation controls
  const [materialKey, setMaterialKey] = useState('aluminium');
  const [customSolidDensity, setCustomSolidDensity] = useState(2000);
  const [liquidKey, setLiquidKey] = useState('pure_water');
  const [customLiquidDensity, setCustomLiquidDensity] = useState(1100);
  const [solidVolumeCm3, setSolidVolumeCm3] = useState(250); // cm³ = mL
  const [immersionPct, setImmersionPct] = useState(100); // 0 to 100%
  const [gravityId, setGravityId] = useState('earth');

  // Visualization toggles
  const [showVectors, setShowVectors] = useState(true);
  const [showPressureDist, setShowPressureDist] = useState(false);
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeChallengeId, setActiveChallengeId] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState({});
  const [activePresetId, setActivePresetId] = useState('classic_eureka');

  // Canvas & animation refs
  const canvasRef = useRef(null);
  const flowDropsRef = useRef([]);
  const wavePhaseRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartImmersionRef = useRef(0);

  // Physical calculations
  const g = useMemo(() => {
    const item = GRAVITY_OPTIONS.find((opt) => opt.id === gravityId);
    return item ? item.g : 9.81;
  }, [gravityId]);

  const rhoSolid = useMemo(() => {
    if (materialKey === 'custom') return customSolidDensity;
    return MATERIALS[materialKey].density;
  }, [materialKey, customSolidDensity]);

  const rhoFluid = useMemo(() => {
    if (liquidKey === 'custom') return customLiquidDensity;
    return LIQUIDS[liquidKey].density;
  }, [liquidKey, customLiquidDensity]);

  // Mass, volume, weight calculations
  const phys = useMemo(() => {
    // Volume in m³
    const V_solid_m3 = solidVolumeCm3 * 1e-6;
    // Solid mass in kg
    const m_solid_kg = rhoSolid * V_solid_m3;
    const m_solid_g = m_solid_kg * 1000;
    // Weight in air (Real Weight)
    const W_air = m_solid_kg * g;

    // Submerged volume fraction
    const fracSub = Math.min(1, Math.max(0, immersionPct / 100));
    const V_sub_cm3 = solidVolumeCm3 * fracSub;
    const V_sub_m3 = V_sub_cm3 * 1e-6;

    // Displaced fluid
    const V_disp_cm3 = V_sub_cm3;
    const m_disp_kg = rhoFluid * V_sub_m3;
    const m_disp_g = m_disp_kg * 1000;
    const W_disp = m_disp_kg * g;

    // Upthrust (Archimedes' Principle)
    const U = rhoFluid * V_sub_m3 * g;

    // Natural float equilibrium immersion fraction
    const naturalFloatFrac = Math.min(1, rhoSolid / rhoFluid);
    const naturalFloatPct = naturalFloatFrac * 100;
    const naturallyFloats = rhoSolid < rhoFluid;

    // Spring Balance reading (Apparent Weight)
    let apparentWeight = 0;
    let pushForce = 0;

    if (W_air >= U) {
      apparentWeight = W_air - U;
      pushForce = 0;
    } else {
      apparentWeight = 0;
      pushForce = U - W_air; // Downward force required to keep submerged
    }

    return {
      materialKey,
      liquidKey,
      rhoSolid,
      rhoFluid,
      solidVolumeCm3,
      immersionPct,
      V_sub_cm3,
      V_disp_cm3,
      m_solid_kg,
      m_solid_g,
      m_disp_kg,
      m_disp_g,
      W_air,
      W_disp,
      U,
      apparentWeight,
      pushForce,
      naturallyFloats,
      naturalFloatPct,
      g,
    };
  }, [
    materialKey,
    liquidKey,
    rhoSolid,
    rhoFluid,
    solidVolumeCm3,
    immersionPct,
    g,
  ]);

  // Telemetry dispatch
  useEffect(() => {
    if (onTelemetry) {
      onTelemetry({
        type: 'archimedes_principle',
        material: materialKey,
        solidDensity: rhoSolid,
        fluid: liquidKey,
        fluidDensity: rhoFluid,
        volumeCm3: solidVolumeCm3,
        immersionPct: immersionPct,
        weightInAirN: Number(phys.W_air.toFixed(3)),
        upthrustN: Number(phys.U.toFixed(3)),
        apparentWeightN: Number(phys.apparentWeight.toFixed(3)),
        displacedVolumeCm3: Number(phys.V_disp_cm3.toFixed(1)),
        displacedMassG: Number(phys.m_disp_g.toFixed(1)),
        displacedWeightN: Number(phys.W_disp.toFixed(3)),
        archimedesEqualityDelta: Number(Math.abs(phys.U - phys.W_disp).toFixed(6)),
        gravity: g,
        timestamp: Date.now(),
      });
    }
  }, [phys, materialKey, liquidKey, rhoSolid, rhoFluid, solidVolumeCm3, immersionPct, g, onTelemetry]);

  // Challenge completion check
  useEffect(() => {
    CHALLENGES.forEach((ch) => {
      if (ch.check(phys)) {
        setCompletedChallenges((prev) => ({ ...prev, [ch.id]: true }));
      }
    });
  }, [phys]);

  // Apply Preset
  const handleApplyPreset = (preset) => {
    setActivePresetId(preset.id);
    setMaterialKey(preset.material);
    setLiquidKey(preset.liquid);
    setSolidVolumeCm3(preset.volumeCm3);
    setImmersionPct(preset.immersionPct);
    setGravityId(preset.gId);
  };

  // Reset simulation
  const handleReset = () => {
    const p = PRESETS[0];
    handleApplyPreset(p);
  };

  // Quick immersion jumps
  const handleQuickImmersion = (pct) => {
    setImmersionPct(pct);
  };

  // Handle Canvas Dragging
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientY = e.clientY - rect.top;
    const clientX = e.clientX - rect.left;

    // Check if click is around the block region (x: 220 to 360)
    if (clientX >= 220 && clientX <= 360) {
      isDraggingRef.current = true;
      dragStartYRef.current = clientY;
      dragStartImmersionRef.current = immersionPct;
    }
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientY = e.clientY - rect.top;

    // Moving down increases immersion
    const deltaY = clientY - dragStartYRef.current;
    // Map 120 pixels of drag travel to 100% immersion
    const deltaPct = (deltaY / 120) * 100;
    const nextPct = Math.min(100, Math.max(0, Math.round(dragStartImmersionRef.current + deltaPct)));
    setImmersionPct(nextPct);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // --- CANVAS RENDERING PIPELINE ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear background
      ctx.clearRect(0, 0, width, height);

      // 1. Dark Laboratory Backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(0.6, '#0f172a');
      bgGrad.addColorStop(1, '#0b1120');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle engineering grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 25;
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

      // 2. Laboratory Benchtop
      const benchY = 475;
      const benchGrad = ctx.createLinearGradient(0, benchY, 0, height);
      benchGrad.addColorStop(0, '#1e293b');
      benchGrad.addColorStop(0.15, '#0f172a');
      benchGrad.addColorStop(1, '#020617');
      ctx.fillStyle = benchGrad;
      ctx.fillRect(0, benchY, width, height - benchY);

      // Bench surface bevel line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, benchY);
      ctx.lineTo(width, benchY);
      ctx.stroke();

      // 3. Retort Stand (Left Side)
      const standX = 110;
      // Heavy Base
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(standX - 55, benchY - 14, 110, 14, 3);
      ctx.fill();
      ctx.stroke();

      // Vertical Rod
      const rodGrad = ctx.createLinearGradient(standX - 5, 0, standX + 5, 0);
      rodGrad.addColorStop(0, '#94a3b8');
      rodGrad.addColorStop(0.5, '#f1f5f9');
      rodGrad.addColorStop(1, '#64748b');
      ctx.fillStyle = rodGrad;
      ctx.fillRect(standX - 5, 45, 10, benchY - 59);

      // Bosshead & Horizontal Clamp Arm
      ctx.fillStyle = '#475569';
      ctx.fillRect(standX - 10, 60, 20, 20);
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(standX - 12, 70, 5, 0, Math.PI * 2);
      ctx.fill();

      // Horizontal Clamp Arm extending to balance
      const balanceCenterX = 285;
      ctx.fillStyle = rodGrad;
      ctx.fillRect(standX + 10, 66, balanceCenterX - standX - 10, 8);

      // Clamp jaws
      ctx.fillStyle = '#334155';
      ctx.fillRect(balanceCenterX - 10, 63, 20, 14);

      // 4. Spring Balance
      const balanceTopY = 77;
      const balanceBodyHeight = 110;
      const balanceWidth = 32;

      // Upper suspension loop
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(balanceCenterX, balanceTopY, 7, Math.PI, Math.PI * 2);
      ctx.stroke();

      // Transparent Acrylic Casing
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(
        balanceCenterX - balanceWidth / 2,
        balanceTopY,
        balanceWidth,
        balanceBodyHeight,
        5
      );
      ctx.fill();
      ctx.stroke();

      // Top & Bottom caps
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(balanceCenterX - balanceWidth / 2, balanceTopY, balanceWidth, 8);
      ctx.fillRect(balanceCenterX - balanceWidth / 2, balanceTopY + balanceBodyHeight - 8, balanceWidth, 8);

      // Newton Scale Markings
      ctx.fillStyle = '#94a3b8';
      ctx.font = '8px monospace';
      ctx.textAlign = 'right';
      for (let i = 0; i <= 8; i++) {
        const tickY = balanceTopY + 14 + i * 10;
        ctx.strokeStyle = i % 2 === 0 ? '#38bdf8' : '#64748b';
        ctx.lineWidth = i % 2 === 0 ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(balanceCenterX - 11, tickY);
        ctx.lineTo(balanceCenterX - (i % 2 === 0 ? 3 : 6), tickY);
        ctx.stroke();
      }

      // Spring Physics extension
      const maxExtForce = 15; // 15 N full scale
      const currentTension = phys.apparentWeight;
      const springExtensionPx = Math.min(
        50,
        Math.max(2, (currentTension / maxExtForce) * 50)
      );

      // Coiled Spring inside balance
      const springTopY = balanceTopY + 12;
      const springRestLen = 22;
      const springCurrentLen = springRestLen + springExtensionPx;
      const coils = 9;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(balanceCenterX, springTopY);
      for (let c = 0; c < coils; c++) {
        const segY = springTopY + ((c + 0.5) * springCurrentLen) / coils;
        const segX = balanceCenterX + (c % 2 === 0 ? 7 : -7);
        ctx.lineTo(segX, segY);
      }
      const springBottomY = springTopY + springCurrentLen;
      ctx.lineTo(balanceCenterX, springBottomY);
      ctx.stroke();

      // Red Indicator Pointer
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(balanceCenterX - 12, springBottomY);
      ctx.lineTo(balanceCenterX - 4, springBottomY - 3);
      ctx.lineTo(balanceCenterX - 4, springBottomY + 3);
      ctx.closePath();
      ctx.fill();

      // Lower rod and Hook
      const balanceHookY = balanceTopY + balanceBodyHeight + springExtensionPx * 0.4;
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(balanceCenterX, springBottomY);
      ctx.lineTo(balanceCenterX, balanceHookY);
      ctx.stroke();

      // Hook curve
      ctx.beginPath();
      ctx.arc(balanceCenterX - 4, balanceHookY + 6, 6, 0, Math.PI * 1.5, false);
      ctx.stroke();

      // Tension Readout Badge next to balance
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = currentTension === 0 ? '#f59e0b' : '#10b981';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(balanceCenterX + 22, balanceTopY + 30, 95, 42, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('SPRING BALANCE', balanceCenterX + 28, balanceTopY + 44);

      ctx.fillStyle = currentTension === 0 ? '#f59e0b' : '#10b981';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(
        `T = ${currentTension.toFixed(2)} N`,
        balanceCenterX + 28,
        balanceTopY + 62
      );

      // 5. Eureka Can (Displacement Can)
      const canX = 220;
      const canWidth = 130;
      const canHeight = 165;
      const canY = benchY - canHeight;
      const spoutStartX = canX + canWidth;
      const spoutStartY = canY + 32; // Spout positioned 32px below can top
      const spoutTipX = spoutStartX + 65;
      const spoutTipY = spoutStartY + 50;

      // Spout angled tube
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(spoutStartX, spoutStartY);
      ctx.lineTo(spoutTipX, spoutTipY);
      ctx.lineTo(spoutTipX - 2, spoutTipY + 8);
      ctx.lineTo(spoutStartX, spoutStartY + 12);
      ctx.closePath();
      ctx.fillStyle = 'rgba(14, 165, 233, 0.2)';
      ctx.fill();
      ctx.stroke();

      // Eureka Can Glass Body
      const canGrad = ctx.createLinearGradient(canX, canY, canX + canWidth, canY);
      canGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      canGrad.addColorStop(0.1, 'rgba(255, 255, 255, 0.03)');
      canGrad.addColorStop(0.9, 'rgba(255, 255, 255, 0.03)');
      canGrad.addColorStop(1, 'rgba(255, 255, 255, 0.18)');
      ctx.fillStyle = canGrad;
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(canX, canY, canWidth, canHeight, [0, 0, 4, 4]);
      ctx.fill();
      ctx.stroke();

      // Eureka Can Base Plate
      ctx.fillStyle = '#334155';
      ctx.fillRect(canX - 4, benchY - 6, canWidth + 8, 6);

      // Liquid inside Eureka Can
      const liquidLevelY = spoutStartY;
      const liquidHeight = benchY - liquidLevelY;
      const curLiquid = LIQUIDS[liquidKey] || LIQUIDS.pure_water;

      const liqGrad = ctx.createLinearGradient(canX, liquidLevelY, canX, benchY);
      liqGrad.addColorStop(0, curLiquid.color);
      liqGrad.addColorStop(1, curLiquid.deepColor);
      ctx.fillStyle = liqGrad;
      ctx.beginPath();
      ctx.roundRect(canX + 2, liquidLevelY, canWidth - 4, liquidHeight, [0, 0, 3, 3]);
      ctx.fill();

      // Fluid Meniscus & Surface wave
      if (isPlaying) {
        wavePhaseRef.current += 0.04;
      }
      ctx.strokeStyle = curLiquid.surfaceColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canX + 2, liquidLevelY);
      for (let lx = 0; lx <= canWidth - 4; lx += 4) {
        const wave = Math.sin(lx * 0.1 + wavePhaseRef.current) * 1.2;
        ctx.lineTo(canX + 2 + lx, liquidLevelY + wave);
      }
      ctx.stroke();

      // Spout Brim label
      ctx.fillStyle = '#38bdf8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('Spout Brim Level', canX - 6, liquidLevelY + 3);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(canX - 4, liquidLevelY);
      ctx.lineTo(canX + 2, liquidLevelY);
      ctx.stroke();
      ctx.setLineDash([]);

      // 6. Suspended Solid Block
      const blockWidth = 64;
      const blockHeight = 84;
      const dryBlockY = liquidLevelY - blockHeight - 15;
      const submergedBlockY = liquidLevelY - (1 - phys.immersionPct / 100) * blockHeight;
      const blockY = dryBlockY + (submergedBlockY - dryBlockY) * (phys.immersionPct > 0 ? 1 : 0);

      // Suspension wire
      const blockTopY = blockY;
      const hookTipY = balanceHookY + 12;

      ctx.lineWidth = 1.8;
      if (currentTension > 0.05) {
        ctx.strokeStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(balanceCenterX, hookTipY);
        ctx.lineTo(balanceCenterX, blockTopY);
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(balanceCenterX, hookTipY);
        const sag = 16;
        ctx.quadraticCurveTo(
          balanceCenterX + sag,
          (hookTipY + blockTopY) / 2,
          balanceCenterX,
          blockTopY
        );
        ctx.stroke();
      }

      // Eyelet screw ring on top of block
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(balanceCenterX, blockTopY - 4, 4, 0, Math.PI * 2);
      ctx.stroke();

      // Render Solid Block with Material Texture
      const matInfo = MATERIALS[materialKey] || MATERIALS.aluminium;
      const blockLeft = balanceCenterX - blockWidth / 2;

      ctx.save();
      ctx.fillStyle = matInfo.color;
      ctx.strokeStyle = matInfo.border;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(blockLeft, blockTopY, blockWidth, blockHeight, 3);
      ctx.fill();
      ctx.stroke();

      // Textures
      if (matInfo.texture === 'grain') {
        ctx.strokeStyle = 'rgba(120, 53, 15, 0.4)';
        ctx.lineWidth = 1.5;
        for (let gIdx = 0; gIdx < 5; gIdx++) {
          ctx.beginPath();
          ctx.moveTo(blockLeft + 4, blockTopY + 15 + gIdx * 14);
          ctx.bezierCurveTo(
            blockLeft + 25,
            blockTopY + 10 + gIdx * 14,
            blockLeft + 40,
            blockTopY + 20 + gIdx * 14,
            blockLeft + blockWidth - 4,
            blockTopY + 14 + gIdx * 14
          );
          ctx.stroke();
        }
      } else if (matInfo.texture === 'brushed') {
        const alumGrad = ctx.createLinearGradient(blockLeft, blockTopY, blockLeft + blockWidth, blockTopY);
        alumGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
        alumGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
        alumGrad.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
        ctx.fillStyle = alumGrad;
        ctx.fillRect(blockLeft + 1, blockTopY + 1, blockWidth - 2, blockHeight - 2);
      } else if (matInfo.texture === 'cast') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        for (let s = 0; s < 18; s++) {
          const sx = blockLeft + 6 + ((s * 17) % (blockWidth - 12));
          const sy = blockTopY + 6 + ((s * 23) % (blockHeight - 12));
          ctx.fillRect(sx, sy, 2, 2);
        }
      }

      // Submerged tint overlay
      const blockBottomY = blockTopY + blockHeight;
      if (blockBottomY > liquidLevelY) {
        const subTop = Math.max(blockTopY, liquidLevelY);
        const subH = blockBottomY - subTop;
        ctx.fillStyle = curLiquid.color;
        ctx.fillRect(blockLeft, subTop, blockWidth, subH);

        // Waterline on block
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(blockLeft, subTop);
        ctx.lineTo(blockLeft + blockWidth, subTop);
        ctx.stroke();
      }

      // Block metadata label inside
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(matInfo.name, balanceCenterX, blockTopY + 28);
      ctx.font = '8px monospace';
      ctx.fillText(`${phys.rhoSolid} kg/m³`, balanceCenterX, blockTopY + 40);
      ctx.fillText(`${solidVolumeCm3} cm³`, balanceCenterX, blockTopY + 52);
      ctx.fillText(`${phys.m_solid_g.toFixed(1)} g`, balanceCenterX, blockTopY + 64);

      ctx.restore();

      // 7. Measuring Cylinder (Displaced Collector)
      const cylX = 390;
      const cylWidth = 54;
      const cylHeight = 135;
      const cylY = benchY - cylHeight;
      const maxCylCapacity = 400; // 400 mL full scale

      // Digital Electronic Balance under Cylinder
      const scaleBaseY = benchY - 14;
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cylX - 16, scaleBaseY, cylWidth + 32, 14, 3);
      ctx.fill();
      ctx.stroke();

      // Digital Balance Display Screen
      ctx.fillStyle = '#020617';
      ctx.fillRect(cylX - 8, scaleBaseY + 2, cylWidth + 16, 10);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${phys.m_disp_g.toFixed(1)} g`, cylX + cylWidth / 2, scaleBaseY + 10);

      // Glass Measuring Cylinder Body
      const cylGrad = ctx.createLinearGradient(cylX, cylY, cylX + cylWidth, cylY);
      cylGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      cylGrad.addColorStop(0.1, 'rgba(255, 255, 255, 0.05)');
      cylGrad.addColorStop(0.9, 'rgba(255, 255, 255, 0.05)');
      cylGrad.addColorStop(1, 'rgba(255, 255, 255, 0.25)');
      ctx.fillStyle = cylGrad;
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cylX, cylY, cylWidth, cylHeight - 14, [4, 4, 0, 0]);
      ctx.fill();
      ctx.stroke();

      // Graduation ticks on Cylinder
      ctx.fillStyle = '#94a3b8';
      ctx.font = '7px monospace';
      ctx.textAlign = 'right';
      for (let ml = 50; ml <= 350; ml += 50) {
        const tickY = scaleBaseY - (ml / maxCylCapacity) * (cylHeight - 20);
        ctx.strokeStyle = ml % 100 === 0 ? '#38bdf8' : '#64748b';
        ctx.lineWidth = ml % 100 === 0 ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(cylX + cylWidth - 2, tickY);
        ctx.lineTo(cylX + cylWidth - (ml % 100 === 0 ? 10 : 6), tickY);
        ctx.stroke();
        if (ml % 100 === 0) {
          ctx.fillText(`${ml}`, cylX + cylWidth - 12, tickY + 3);
        }
      }

      // Collected Displaced Liquid in Cylinder
      const displacedFrac = Math.min(1, phys.V_disp_cm3 / maxCylCapacity);
      const collectedLiqH = displacedFrac * (cylHeight - 20);
      if (collectedLiqH > 1) {
        const collectedY = scaleBaseY - collectedLiqH;
        ctx.fillStyle = curLiquid.deepColor;
        ctx.beginPath();
        ctx.fillRect(cylX + 2, collectedY, cylWidth - 4, collectedLiqH);

        // Meniscus in cylinder
        ctx.strokeStyle = curLiquid.surfaceColor;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cylX + 2, collectedY);
        ctx.quadraticCurveTo(
          cylX + cylWidth / 2,
          collectedY + 2.5,
          cylX + cylWidth - 2,
          collectedY
        );
        ctx.stroke();
      }

      // Displaced Water Readout HUD Banner
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cylX - 10, cylY - 48, 125, 42, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('DISPLACED FLUID', cylX - 4, cylY - 34);

      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(
        `W_disp = ${phys.W_disp.toFixed(2)} N`,
        cylX - 4,
        cylY - 18
      );
      ctx.font = '9px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`Vol: ${phys.V_disp_cm3.toFixed(1)} mL`, cylX + 62, cylY - 34);

      // 8. Dynamic Spout Liquid Cascade / Trickle
      if (phys.immersionPct > 0) {
        ctx.strokeStyle = curLiquid.surfaceColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(spoutTipX - 2, spoutTipY + 4);
        const cylTargetX = cylX + cylWidth / 2;
        const cylTargetY = cylY + 8;
        ctx.quadraticCurveTo(
          spoutTipX + 8,
          spoutTipY + 25,
          cylTargetX,
          cylTargetY
        );
        ctx.stroke();

        // Animated Droplets
        if (isPlaying) {
          if (Math.random() < 0.4) {
            flowDropsRef.current.push({
              x: spoutTipX + (Math.random() * 4 - 2),
              y: spoutTipY + 4,
              vx: 0.8 + Math.random() * 0.4,
              vy: 2 + Math.random() * 1.5,
              life: 1.0,
            });
          }

          ctx.fillStyle = curLiquid.surfaceColor;
          flowDropsRef.current.forEach((drop) => {
            drop.x += drop.vx;
            drop.y += drop.vy;
            drop.vy += 0.25; // gravity
            drop.life -= 0.035;

            ctx.beginPath();
            ctx.arc(drop.x, drop.y, 2, 0, Math.PI * 2);
            ctx.fill();
          });

          flowDropsRef.current = flowDropsRef.current.filter(
            (d) => d.life > 0 && d.y < scaleBaseY
          );
        }
      }

      // 9. Free-Body Diagram Vectors Overlay (if enabled)
      if (showVectors) {
        const blockCenterY = blockTopY + blockHeight / 2;
        const vectorScale = 9; // pixels per Newton

        // Vector 1: Weight W (Downwards, Crimson)
        const wLen = Math.min(140, Math.max(15, phys.W_air * vectorScale));
        const wArrowTipY = blockCenterY + wLen;

        ctx.strokeStyle = '#ef4444';
        ctx.fillStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(balanceCenterX, blockCenterY);
        ctx.lineTo(balanceCenterX, wArrowTipY);
        ctx.stroke();

        // Arrow head down
        ctx.beginPath();
        ctx.moveTo(balanceCenterX, wArrowTipY);
        ctx.lineTo(balanceCenterX - 6, wArrowTipY - 10);
        ctx.lineTo(balanceCenterX + 6, wArrowTipY - 10);
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`W = ${phys.W_air.toFixed(2)} N`, balanceCenterX + 10, wArrowTipY);

        // Vector 2: Upthrust U (Upwards, Cyan)
        if (phys.U > 0.02) {
          const uLen = Math.min(130, Math.max(12, phys.U * vectorScale));
          const uArrowTipY = blockCenterY - uLen;

          ctx.strokeStyle = '#06b6d4';
          ctx.fillStyle = '#06b6d4';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(balanceCenterX - 14, blockCenterY);
          ctx.lineTo(balanceCenterX - 14, uArrowTipY);
          ctx.stroke();

          // Arrow head up
          ctx.beginPath();
          ctx.moveTo(balanceCenterX - 14, uArrowTipY);
          ctx.lineTo(balanceCenterX - 20, uArrowTipY + 10);
          ctx.lineTo(balanceCenterX - 8, uArrowTipY + 10);
          ctx.closePath();
          ctx.fill();

          ctx.textAlign = 'right';
          ctx.fillText(`U = ${phys.U.toFixed(2)} N`, balanceCenterX - 22, uArrowTipY + 6);
        }

        // Vector 3: Tension T (Upwards, Emerald)
        if (phys.apparentWeight > 0.05) {
          const tLen = Math.min(120, Math.max(12, phys.apparentWeight * vectorScale));
          const tArrowTipY = blockTopY - tLen;

          ctx.strokeStyle = '#10b981';
          ctx.fillStyle = '#10b981';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(balanceCenterX + 14, blockTopY);
          ctx.lineTo(balanceCenterX + 14, tArrowTipY);
          ctx.stroke();

          // Arrow head up
          ctx.beginPath();
          ctx.moveTo(balanceCenterX + 14, tArrowTipY);
          ctx.lineTo(balanceCenterX + 8, tArrowTipY + 8);
          ctx.lineTo(balanceCenterX + 20, tArrowTipY + 8);
          ctx.closePath();
          ctx.fill();

          ctx.textAlign = 'left';
          ctx.fillText(`T = ${phys.apparentWeight.toFixed(2)} N`, balanceCenterX + 22, tArrowTipY + 6);
        }

        // Vector 4: Push Force (if forced submerged floater)
        if (phys.pushForce > 0.05) {
          ctx.strokeStyle = '#f59e0b';
          ctx.fillStyle = '#f59e0b';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(balanceCenterX + 14, blockTopY - 20);
          ctx.lineTo(balanceCenterX + 14, blockTopY);
          ctx.stroke();

          // Arrow head down
          ctx.beginPath();
          ctx.moveTo(balanceCenterX + 14, blockTopY);
          ctx.lineTo(balanceCenterX + 8, blockTopY - 8);
          ctx.lineTo(balanceCenterX + 20, blockTopY - 8);
          ctx.closePath();
          ctx.fill();

          ctx.textAlign = 'left';
          ctx.fillText(`F_push = ${phys.pushForce.toFixed(2)} N`, balanceCenterX + 20, blockTopY - 8);
        }
      }

      // 10. Hydrostatic Pressure Overlay (if enabled)
      if (showPressureDist && phys.immersionPct > 0) {
        const blockBottomY = blockTopY + blockHeight;

        // Arrows on top surface (downward)
        if (phys.immersionPct >= 100) {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
          ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
          ctx.lineWidth = 1.5;
          for (let px = blockLeft + 10; px <= blockLeft + blockWidth - 10; px += 14) {
            ctx.beginPath();
            ctx.moveTo(px, blockTopY - 14);
            ctx.lineTo(px, blockTopY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(px, blockTopY);
            ctx.lineTo(px - 3, blockTopY - 5);
            ctx.lineTo(px + 3, blockTopY - 5);
            ctx.closePath();
            ctx.fill();
          }
          ctx.fillStyle = '#ef4444';
          ctx.font = '9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('P_top = ρgh₁', balanceCenterX, blockTopY - 18);
        }

        // Arrows on bottom surface (upward, larger due to depth!)
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.9)';
        ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
        ctx.lineWidth = 2;
        for (let px = blockLeft + 8; px <= blockLeft + blockWidth - 8; px += 12) {
          ctx.beginPath();
          ctx.moveTo(px, blockBottomY + 28);
          ctx.lineTo(px, blockBottomY);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(px, blockBottomY);
          ctx.lineTo(px - 3, blockBottomY + 6);
          ctx.lineTo(px + 3, blockBottomY + 6);
          ctx.closePath();
          ctx.fill();
        }

        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('P_bottom = ρgh₂  (P_bottom > P_top)', balanceCenterX, blockBottomY + 42);
      }

      // 11. Archimedes Equality Badge on Canvas
      const archimedesMatch = Math.abs(phys.U - phys.W_disp) < 0.001;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = archimedesMatch ? '#10b981' : '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(width - 240, 16, 224, 52, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText("ARCHIMEDES' PRINCIPLE STATUS", width - 228, 32);

      ctx.fillStyle = archimedesMatch ? '#10b981' : '#f59e0b';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(
        `Upthrust U ≡ W_disp (${phys.U.toFixed(2)} N)`,
        width - 228,
        50
      );
      ctx.fillText(
        archimedesMatch ? '✓ Exact Physical Match' : 'Calculating...',
        width - 228,
        62
      );

      // Drag instruction hint on canvas
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('↕ Drag block or use immersion slider below', balanceCenterX, 30);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    phys,
    materialKey,
    liquidKey,
    solidVolumeCm3,
    showVectors,
    showPressureDist,
    isPlaying,
  ]);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                <Gauge className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  Archimedes' Principle & Buoyancy Balance
                </h1>
                <p className="text-xs md:text-sm text-slate-400">
                  Interactive displacement can apparatus, free-body vector equilibrium, and fluid pressure physics
                </p>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isPlaying
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Resume'}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

            <button
              onClick={() => setShowTheoryModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 transition-all"
            >
              <Info className="w-4 h-4" />
              Theory & Derivations
            </button>
          </div>
        </div>
      </div>

      {/* METRIC READOUT TELEMETRY CARDS */}
      <div className="max-w-7xl mx-auto mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: W_air */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl shadow-lg flex flex-col justify-between">
          <div className="text-[10px] font-bold tracking-wider text-rose-400 uppercase flex items-center justify-between">
            <span>Real Weight (Air)</span>
            <span className="text-[9px] text-slate-500">W = mg</span>
          </div>
          <div className="text-xl font-bold font-mono text-rose-300 mt-1">
            {phys.W_air.toFixed(2)} <span className="text-xs font-normal text-slate-400">N</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Mass: {phys.m_solid_g.toFixed(1)} g
          </div>
        </div>

        {/* Card 2: Apparent Weight / Spring Tension */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl shadow-lg flex flex-col justify-between">
          <div className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase flex items-center justify-between">
            <span>Apparent Weight</span>
            <span className="text-[9px] text-slate-500">T = W - U</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
            {phys.apparentWeight.toFixed(2)} <span className="text-xs font-normal text-slate-400">N</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {phys.apparentWeight === 0 ? 'Slack String (Floating)' : 'Spring Balance Tension'}
          </div>
        </div>

        {/* Card 3: Upthrust U */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl shadow-lg flex flex-col justify-between">
          <div className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase flex items-center justify-between">
            <span>Upthrust (U)</span>
            <span className="text-[9px] text-slate-500">U = ρ_f V_s g</span>
          </div>
          <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
            {phys.U.toFixed(2)} <span className="text-xs font-normal text-slate-400">N</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Buoyant Lift Force
          </div>
        </div>

        {/* Card 4: Displaced Liquid Weight */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl shadow-lg flex flex-col justify-between">
          <div className="text-[10px] font-bold tracking-wider text-sky-400 uppercase flex items-center justify-between">
            <span>Displaced Fluid W</span>
            <span className="text-[9px] text-slate-500">W_disp</span>
          </div>
          <div className="text-xl font-bold font-mono text-sky-300 mt-1">
            {phys.W_disp.toFixed(2)} <span className="text-xs font-normal text-slate-400">N</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Mass: {phys.m_disp_g.toFixed(1)} g
          </div>
        </div>

        {/* Card 5: Displaced Volume */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl shadow-lg flex flex-col justify-between">
          <div className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase flex items-center justify-between">
            <span>Displaced Volume</span>
            <span className="text-[9px] text-slate-500">V_sub</span>
          </div>
          <div className="text-xl font-bold font-mono text-indigo-300 mt-1">
            {phys.V_disp_cm3.toFixed(1)} <span className="text-xs font-normal text-slate-400">mL</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {immersionPct}% Submerged
          </div>
        </div>

        {/* Card 6: Archimedes Principle Check */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl shadow-lg flex flex-col justify-between">
          <div className="text-[10px] font-bold tracking-wider text-amber-400 uppercase flex items-center justify-between">
            <span>Archimedes Check</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-bold font-mono text-emerald-300 mt-1">
            U ≡ W_disp
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Δ = {Math.abs(phys.U - phys.W_disp).toFixed(4)} N
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: INTERACTIVE CANVAS APPARATUS (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Canvas Box */}
          <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Top Toolbar Overlay */}
            <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
              <button
                onClick={() => setShowVectors((v) => !v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  showVectors
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Vectors (FBD)
              </button>

              <button
                onClick={() => setShowPressureDist((p) => !p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  showPressureDist
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Pressure (ΔP)
              </button>
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={720}
              height={490}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full h-auto cursor-ns-resize block"
            />
          </div>

          {/* Quick Immersion Slider Control Bar */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Immersion Depth: <span className="font-mono text-cyan-300">{immersionPct}%</span>
              </span>
              <div className="flex gap-1.5">
                {[0, 25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => handleQuickImmersion(pct)}
                    className={`px-2 py-0.5 text-[11px] rounded font-mono border transition-all ${
                      immersionPct === pct
                        ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
                {phys.naturallyFloats && (
                  <button
                    onClick={() => handleQuickImmersion(Math.round(phys.naturalFloatPct))}
                    className="px-2 py-0.5 text-[11px] rounded font-mono border bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
                    title="Jump to neutral floating equilibrium point"
                  >
                    Float Eq ({Math.round(phys.naturalFloatPct)}%)
                  </button>
                )}
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={immersionPct}
              onChange={(e) => setImmersionPct(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% (Dry in Air)</span>
              <span>25%</span>
              <span>50% (Half Immersed)</span>
              <span>75%</span>
              <span>100% (Fully Submerged)</span>
            </div>
          </div>

          {/* Presets Grid */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Physical Scenario Presets
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESETS.map((p) => {
                const isSelected = activePresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleApplyPreset(p)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/60 shadow-md shadow-indigo-950/40'
                        : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{p.name}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{p.tagline}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTROLS & GUIDED CHALLENGES (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Parameter Customization Panel */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Experiment Parameters
            </h2>

            {/* 1. Material Selection */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                Suspended Solid Material
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {Object.values(MATERIALS).map((mat) => {
                  const isCur = materialKey === mat.id;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => setMaterialKey(mat.id)}
                      className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                        isCur
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div>{mat.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {mat.id === 'custom' ? `${customSolidDensity} kg/m³` : `${mat.density} kg/m³`}
                      </div>
                    </button>
                  );
                })}
              </div>

              {materialKey === 'custom' && (
                <div className="mt-2.5 p-2.5 bg-slate-800/60 rounded-lg border border-slate-700">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Custom Solid Density</span>
                    <span className="font-mono text-cyan-300">{customSolidDensity} kg/m³</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="15000"
                    step="50"
                    value={customSolidDensity}
                    onChange={(e) => setCustomSolidDensity(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              )}
            </div>

            {/* 2. Solid Volume Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-400">Solid Volume (V_s)</span>
                <span className="font-mono font-bold text-cyan-300">
                  {solidVolumeCm3} cm³ <span className="text-[10px] text-slate-500">({solidVolumeCm3} mL)</span>
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={solidVolumeCm3}
                onChange={(e) => setSolidVolumeCm3(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>50 cm³ (Small)</span>
                <span>250 cm³</span>
                <span>500 cm³ (Large)</span>
              </div>
            </div>

            {/* 3. Liquid Medium Selection */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                Eureka Can Fluid Medium
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.values(LIQUIDS).map((liq) => {
                  const isCur = liquidKey === liq.id;
                  return (
                    <button
                      key={liq.id}
                      onClick={() => setLiquidKey(liq.id)}
                      className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                        isCur
                          ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div>{liq.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {liq.density} kg/m³
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Gravitational Environment */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                Gravitational Acceleration (g)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {GRAVITY_OPTIONS.map((opt) => {
                  const isCur = gravityId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setGravityId(opt.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isCur
                          ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 font-bold'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {opt.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Guided Inquiry Challenges Section */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Guided Inquiry Challenges
            </h2>

            <div className="flex flex-col gap-2.5">
              {CHALLENGES.map((ch) => {
                const isPassed = !!completedChallenges[ch.id];
                const isExpanded = activeChallengeId === ch.id;
                return (
                  <div
                    key={ch.id}
                    className={`rounded-xl border transition-all ${
                      isPassed
                        ? 'bg-emerald-950/20 border-emerald-700/50'
                        : isExpanded
                        ? 'bg-slate-800/80 border-cyan-500/50'
                        : 'bg-slate-800/40 border-slate-700/60'
                    }`}
                  >
                    <button
                      onClick={() => setActiveChallengeId(isExpanded ? null : ch.id)}
                      className="w-full p-3 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <ChevronRight
                            className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${
                              isExpanded ? 'rotate-90 text-cyan-400' : ''
                            }`}
                          />
                        )}
                        <div>
                          <div className="text-xs font-bold text-slate-200">{ch.title}</div>
                          <div className="text-[10px] text-slate-400">{ch.difficulty}</div>
                        </div>
                      </div>

                      {isPassed && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {ch.badge}
                        </span>
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-3 pb-3 text-xs border-t border-slate-700/50 pt-2 flex flex-col gap-2">
                        <div className="flex items-start gap-1.5 text-slate-300">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                          <span className="text-[11px] leading-relaxed">{ch.hint}</span>
                        </div>

                        {isPassed ? (
                          <div className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-600/40 text-emerald-200 text-[11px]">
                            {ch.congrats}
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500 italic">
                            Adjust the sliders and presets above to achieve the target criteria.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* THEORY & FORMULA MODAL */}
      {showTheoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    Physics Theory: Archimedes' Principle & Buoyancy
                  </h3>
                  <p className="text-xs text-slate-400">
                    Hydrostatic pressure differential derivation, laws of flotation, and apparent weight
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTheoryModal(false)}
                className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs text-slate-300 leading-relaxed">
              {/* 1. Statement */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                <h4 className="font-bold text-cyan-300 text-sm mb-1">
                  1. Formal Statement of Archimedes' Principle
                </h4>
                <p>
                  <em>
                    "When a body is wholly or partially immersed in a fluid, it experiences an upward
                    buoyant force (Upthrust) equal to the weight of the fluid displaced by the body."
                  </em>
                </p>
                <div className="mt-2 font-mono text-cyan-400 font-bold">
                  U = Weight of displaced fluid = m_disp · g = ρ_fluid · V_sub · g
                </div>
              </div>

              {/* 2. Mathematical Derivation */}
              <div>
                <h4 className="font-bold text-slate-200 text-sm mb-1.5">
                  2. Hydrostatic Pressure Differential Derivation
                </h4>
                <p className="mb-2">
                  Consider a submerged rectangular prism of cross-sectional area <code className="text-cyan-300">A</code> and
                  height <code className="text-cyan-300">h = h₂ - h₁</code> immersed in a liquid of density <code className="text-cyan-300">ρ_f</code>:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 font-mono text-[11px] text-slate-300">
                  <li>Downwards force on top face: F₁ = P₁ · A = (P₀ + ρ_f · g · h₁) · A</li>
                  <li>Upwards force on bottom face: F₂ = P₂ · A = (P₀ + ρ_f · g · h₂) · A</li>
                  <li>Net vertical buoyant force: U = F₂ - F₁ = ρ_f · g · (h₂ - h₁) · A</li>
                  <li>Since Volume V = A · (h₂ - h₁) = A · h:</li>
                  <li className="text-cyan-400 font-bold">U = ρ_f · V_sub · g</li>
                </ul>
                <p className="mt-2 text-slate-400">
                  Because liquid pressure increases linearly with depth (P = ρgh), the pressure on the bottom face
                  is always strictly greater than on the top face. This vertical pressure imbalance generates Upthrust!
                </p>
              </div>

              {/* 3. Apparent Weight on Spring Balance */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                <h4 className="font-bold text-emerald-300 text-sm mb-1">
                  3. Apparent Weight Formula
                </h4>
                <p>
                  When suspended on a spring balance, the spring tension <code className="text-emerald-400">T</code> balances
                  the downward gravity minus the upward buoyant lift:
                </p>
                <div className="my-1.5 font-mono text-emerald-300 font-bold">
                  T = W_apparent = W_real - U = (m_solid · g) - (ρ_fluid · V_sub · g)
                </div>
                <p className="text-slate-400">
                  Loss in weight = W_real - W_apparent = Upthrust = Weight of overflowing liquid!
                </p>
              </div>

              {/* 4. Principle of Flotation */}
              <div>
                <h4 className="font-bold text-slate-200 text-sm mb-1.5">
                  4. The Law of Flotation
                </h4>
                <p>
                  For an object floating freely in equilibrium without any external support (T = 0 N):
                </p>
                <div className="my-1.5 font-mono text-amber-300 font-bold">
                  W_solid = Upthrust  ⟹  ρ_solid · V_solid · g = ρ_fluid · V_sub · g
                </div>
                <div className="font-mono text-cyan-300 font-bold">
                  Fraction Submerged: (V_sub / V_solid) = (ρ_solid / ρ_fluid)
                </div>
                <p className="mt-1 text-slate-400">
                  - If <code className="text-amber-400">ρ_solid &lt; ρ_fluid</code>: Object floats with fraction (ρ_s / ρ_f) submerged (e.g. Ice in water: 92%).<br />
                  - If <code className="text-amber-400">ρ_solid = ρ_fluid</code>: Neutral buoyancy (submarines, fish swim bladders).<br />
                  - If <code className="text-amber-400">ρ_solid &gt; ρ_fluid</code>: Object sinks to the bottom.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-end">
              <button
                onClick={() => setShowTheoryModal(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-colors"
              >
                Close Theory Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
