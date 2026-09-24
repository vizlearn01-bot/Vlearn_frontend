import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sun,
  Shield,
  Zap,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Sliders,
  Eye,
  Atom,
  ArrowRight,
  BookOpen,
  Award,
  AlertTriangle,
  RefreshCw,
  Flame,
  Check
} from 'lucide-react';

/**
 * GoldLeafElectroscopeUVExperimentSim
 * 
 * Hyperrealistic pseudo-3D simulation of the foundational KCSE Physics practical:
 * The Hertz & Hallwachs Gold-Leaf Electroscope & Zinc Plate Photoelectric Experiment.
 * 
 * Key Principles Taught:
 * 1. State 1 (Negative charge): UV radiation (f > f0) ejects conduction electrons;
 *    loss of negative charge causes the gold leaf to collapse rapidly.
 * 2. Glass filter: Ordinary glass absorbs UV radiation; leaf remains diverged.
 * 3. Visible red light (f < f0): Photons have E = hf < Phi. Zero emission even at 1000W!
 * 4. State 2 (Positive charge): Emitted electrons are immediately recaptured by strong
 *    positive attraction; leaf DOES NOT collapse.
 * 5. State 3 (Uncharged): UV ejects electrons, leaving electroscope positively charged;
 *    leaf diverges slightly.
 * 6. Zinc oxide layer: Dull ZnO layer must be scrubbed with emery paper to expose pure Zn.
 */

// Physics Constants
const PLANCK_H = 4.1357e-15; // eV * s
const SPEED_C = 2.998e8;     // m/s
const ZINC_WORK_FUNCTION = 4.31; // eV (pure polished zinc)
const ZINC_THRESHOLD_FREQ = (ZINC_WORK_FUNCTION / PLANCK_H); // ~1.042e15 Hz
const ZINC_THRESHOLD_WAVELENGTH = (SPEED_C / ZINC_THRESHOLD_FREQ) * 1e9; // ~287.7 nm

// Light Source Profiles
const LIGHT_PROFILES = {
  uv: {
    name: 'Ultraviolet Lamp (Mercury Vapor)',
    type: 'UV-C',
    wavelength: 254, // nm
    frequency: 1.18e15, // Hz
    photonEnergy: 4.88, // eV (hf > Phi)
    colorBeam: 'rgba(168, 85, 247, 0.45)',
    colorGlow: '#a855f7',
    colorCore: '#c084fc',
    beamClass: 'from-purple-500/40 via-cyan-400/20 to-transparent',
    aboveThreshold: true,
    description: 'High-frequency UV radiation (f = 1.18 × 10¹⁵ Hz > f₀). Photon energy (4.88 eV) exceeds Zinc work function (4.31 eV).'
  },
  red: {
    name: 'Visible Red Lamp (High Intensity)',
    type: 'Visible Red',
    wavelength: 650, // nm
    frequency: 4.61e14, // Hz
    photonEnergy: 1.91, // eV (hf < Phi)
    colorBeam: 'rgba(239, 68, 68, 0.4)',
    colorGlow: '#ef4444',
    colorCore: '#fca5a5',
    beamClass: 'from-red-500/40 via-orange-400/20 to-transparent',
    aboveThreshold: false,
    description: 'Low-frequency visible light (f = 4.61 × 10¹⁴ Hz < f₀). Photon energy (1.91 eV) is far below Zinc work function (4.31 eV).'
  },
  off: {
    name: 'Lamp Switched Off',
    type: 'Off',
    wavelength: 0,
    frequency: 0,
    photonEnergy: 0,
    colorBeam: 'transparent',
    colorGlow: '#334155',
    colorCore: '#475569',
    beamClass: 'transparent',
    aboveThreshold: false,
    description: 'Lamp is currently switched off. No radiation incident on the zinc plate.'
  }
};

// KCSE Exam Questions & Detailed Marking Scheme
const KCSE_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'A clean zinc plate is placed on a negatively charged gold-leaf electroscope. When UV light illuminates the plate, the leaf collapses. Why does this happen?',
    options: [
      'UV photons have energy E = hf > Φ, emitting excess electrons into the air and neutralizing the electroscope.',
      'UV radiation heats the zinc plate, causing thermal contraction of the brass stem.',
      'UV light ionizes the brass casing, which conducts positive charges into the gold leaf.',
      'The leaf collapses because UV radiation repels the gold leaf mechanically through radiation pressure.'
    ],
    correctIndex: 0,
    explanation: 'Incident UV photons possess quantum energy E = hf (4.88 eV) greater than the zinc work function Φ (4.31 eV). Photoelectrons are instantaneously emitted into the air, depleting the excess negative charge. As repulsion decreases, the gold leaf collapses under gravity.'
  },
  {
    id: 2,
    question: 'The same negatively charged electroscope is illuminated with a 1000 W high-intensity visible red lamp. What happens to the leaf, and why?',
    options: [
      'The leaf collapses immediately because 1000 W provides immense wave energy.',
      'The leaf remains diverged because red light frequency is below threshold (f < f₀, E < Φ); emission is impossible.',
      'The leaf collapses slowly after several minutes once thermal energy accumulates.',
      'The leaf diverges even further as red light deposits additional electrons.'
    ],
    correctIndex: 1,
    explanation: 'According to quantum theory, photoelectric emission is governed by photon frequency, not wave intensity. For red light (f = 4.61 × 10¹⁴ Hz), photon energy E = 1.91 eV is less than the work function Φ (4.31 eV). Increasing brightness merely provides more sub-threshold photons; zero electrons are emitted!'
  },
  {
    id: 3,
    question: 'A sheet of ordinary window glass is inserted between the UV lamp and the negatively charged zinc plate. What is observed?',
    options: [
      'The leaf collapses twice as fast due to optical focusing by the glass.',
      'The leaf remains diverged because ordinary glass absorbs ultraviolet radiation.',
      'The leaf collapses immediately because glass converts UV into higher-energy X-rays.',
      'The leaf discharges through electrostatic induction across the glass.'
    ],
    correctIndex: 1,
    explanation: 'Ordinary soda-lime silicate glass is completely opaque to ultraviolet radiation (it absorbs UV wavelengths below ~320 nm). The glass blocks UV photons from reaching the zinc, preventing photoemission so the leaf remains diverged.'
  },
  {
    id: 4,
    question: 'When the electroscope is POSITIVELY charged and irradiated with UV light, the gold leaf DOES NOT collapse. Why?',
    options: [
      'Positive charges do not experience electrostatic repulsion.',
      'Positive charges repel UV photons, reflecting them back into the lamp.',
      'Any photoelectrons knocked out are immediately attracted back by the net positive electric field of the plate.',
      'UV photons are absorbed by positive charges and converted into neutrons.'
    ],
    correctIndex: 2,
    explanation: 'A positively charged electroscope has a deficit of electrons and a strong positive electrostatic potential. While UV photons may momentarily dislodge an electron, the positive electrostatic attraction immediately pulls the electron back to the zinc surface, preventing net loss of charge.'
  },
  {
    id: 5,
    question: 'Why MUST the zinc plate be freshly scrubbed with emery paper before starting this KCSE physics practical?',
    options: [
      'To make the zinc plate smoother so UV light reflects into the leaf chamber.',
      'To remove the dull insulating zinc oxide (ZnO) layer that blocks photoelectron emission.',
      'To deposit positive static charge on the zinc through frictional rubbing.',
      'To warm up the zinc plate to reach the thermal emission threshold.'
    ],
    correctIndex: 1,
    explanation: 'Zinc readily oxidizes in atmospheric air, forming an insulating zinc oxide (ZnO) coating. This oxide layer creates a potential barrier that obstructs electron escape. Scrubbing with emery paper or a wire brush exposes fresh, pure zinc (Φ = 4.31 eV).'
  }
];

export default function GoldLeafElectroscopeUVExperimentSim({ config = {}, onTelemetry }) {
  // -------------------------------------------------------------
  // Simulation State
  // -------------------------------------------------------------
  // Net charge: range [-100, +100]. -100 = full negative, 0 = neutral, +100 = full positive
  const [charge, setCharge] = useState(-100); 
  const [lampType, setLampType] = useState('uv'); // 'uv' | 'red' | 'off'
  const [lampIntensity, setLampIntensity] = useState(500); // 100W to 1000W
  const [hasGlassFilter, setHasGlassFilter] = useState(false);
  const [isOxidized, setIsOxidized] = useState(false); // false = freshly polished, true = dull ZnO layer
  const [isGrounding, setIsGrounding] = useState(false); // finger touching cap
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState('bench'); // 'bench' | 'physics' | 'quiz'

  // Dynamic Leaf Physics State
  // Target angle: neutral = 0 deg, fully charged (+/-100) = ~52 deg
  const leafAngleRef = useRef(52); // degrees
  const leafVelRef = useRef(0);
  const [displayLeafAngle, setDisplayLeafAngle] = useState(52);

  // Canvas and Particle References
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]); // escaping photoelectrons & sparks
  const dustParticlesRef = useRef([]); // emery polishing dust
  const scrubAnimRef = useRef(0); // for emery scrub visual effect

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // -------------------------------------------------------------
  // Physical Calculations
  // -------------------------------------------------------------
  const currentLamp = LIGHT_PROFILES[lampType];
  const photonEnergy = currentLamp.photonEnergy;
  const isUV = lampType === 'uv';
  const isRed = lampType === 'red';

  // Can photoelectrons actually be emitted from the zinc surface?
  // Requires: Lamp on, UV radiation, no glass filter, and clean zinc
  const isUVReachingZinc = isUV && !hasGlassFilter;
  const isPhotoelectricActive = isUVReachingZinc && !isOxidized && photonEnergy > ZINC_WORK_FUNCTION;

  // Kinetic energy of emitted electrons: Kmax = hf - Phi
  const kMaxEV = isPhotoelectricActive ? Math.max(0, photonEnergy - ZINC_WORK_FUNCTION) : 0;

  // Real-time status assessment
  let statusBadge = {
    text: 'Electroscope Stable',
    subtext: 'No active discharge or excitation occurring.',
    color: 'border-slate-700 bg-slate-900/80 text-slate-300',
    icon: Shield
  };

  if (isGrounding) {
    statusBadge = {
      text: 'Earthing / Grounding Active!',
      subtext: 'Finger touching brass terminal conducts all excess charge to earth. Leaf collapses instantly.',
      color: 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300',
      icon: Zap
    };
  } else if (isOxidized && isUV && !hasGlassFilter) {
    statusBadge = {
      text: 'Blocked by Zinc Oxide (ZnO) Crust!',
      subtext: 'Dull oxide layer obstructs electron escape. Click "Scrub Zinc with Emery Paper" to polish.',
      color: 'border-amber-500/60 bg-amber-950/40 text-amber-300',
      icon: AlertTriangle
    };
  } else if (hasGlassFilter && isUV) {
    statusBadge = {
      text: 'UV Blocked by Glass Absorption Plate!',
      subtext: 'Ordinary glass absorbs UV radiation (λ < 320 nm). Zero photons reach zinc; leaf remains diverged.',
      color: 'border-sky-500/60 bg-sky-950/40 text-sky-300',
      icon: Shield
    };
  } else if (isRed) {
    statusBadge = {
      text: 'Below Threshold Frequency (f < f₀, E < Φ)',
      subtext: `Red light photons (1.91 eV) have insufficient quantum energy. Even at ${lampIntensity} W, zero electrons are emitted!`,
      color: 'border-rose-500/60 bg-rose-950/40 text-rose-300',
      icon: XCircle
    };
  } else if (isPhotoelectricActive) {
    if (charge < -1) {
      statusBadge = {
        text: 'PHOTOELECTRIC EMISSION: Gold Leaf Collapsing!',
        subtext: 'UV photons (4.88 eV > 4.31 eV) eject excess electrons into air. Negative charge depletes rapidly!',
        color: 'border-purple-500/80 bg-purple-950/50 text-purple-200 animate-pulse',
        icon: Sparkles
      };
    } else if (charge > 1) {
      statusBadge = {
        text: 'Positive Electrostatic Recapture: Leaf Diverged!',
        subtext: 'Ejected electrons are immediately pulled back by strong positive attraction. Charge is NOT lost!',
        color: 'border-blue-500/60 bg-blue-950/40 text-blue-300',
        icon: RefreshCw
      };
    } else {
      statusBadge = {
        text: 'Neutral Zinc Emitting: Leaf Diverging Slightly!',
        subtext: 'UV light knocks electrons from neutral atoms into air, leaving electroscope with a slight net positive charge!',
        color: 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300',
        icon: Atom
      };
    }
  }

  // -------------------------------------------------------------
  // Interactive Handlers
  // -------------------------------------------------------------
  const handleChargeNegative = () => {
    setCharge(-100);
    if (onTelemetry) onTelemetry('electroscope_charge', { mode: 'negative' });
  };

  const handleChargePositive = () => {
    setCharge(100);
    if (onTelemetry) onTelemetry('electroscope_charge', { mode: 'positive' });
  };

  const handleDischargeGround = () => {
    setIsGrounding(true);
    setCharge(0);
    setTimeout(() => {
      setIsGrounding(false);
    }, 600);
    if (onTelemetry) onTelemetry('electroscope_discharge', { method: 'ground' });
  };

  const handleScrubZinc = () => {
    scrubAnimRef.current = 1.0;
    setIsOxidized(false);
    // spawn bright polishing dust particles
    for (let i = 0; i < 25; i++) {
      dustParticlesRef.current.push({
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.5) * 40,
        vy: -Math.random() * 50 - 20,
        life: 0.8,
        maxLife: 0.8,
        color: Math.random() > 0.5 ? '#f59e0b' : '#94a3b8'
      });
    }
    if (onTelemetry) onTelemetry('zinc_polished', {});
  };

  const handleReset = () => {
    setCharge(-100);
    setLampType('uv');
    setLampIntensity(500);
    setHasGlassFilter(false);
    setIsOxidized(false);
    setIsGrounding(false);
    setIsPlaying(true);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    leafAngleRef.current = 52;
    leafVelRef.current = 0;
  };

  // -------------------------------------------------------------
  // Hyperrealistic Pseudo-3D Canvas Rendering
  // -------------------------------------------------------------
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // 1. Background (Dark Physics Laboratory Chamber with Vignette)
    const bgGrad = ctx.createRadialGradient(
      width * 0.5, height * 0.45, 60,
      width * 0.5, height * 0.5, width * 0.85
    );
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.65, '#090d16');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Laboratory Bench Surface (Perspective Wooden Tabletop)
    const benchY = height * 0.78;
    const benchGrad = ctx.createLinearGradient(0, benchY, 0, height);
    benchGrad.addColorStop(0, '#1e293b');
    benchGrad.addColorStop(0.1, '#0f172a');
    benchGrad.addColorStop(1, '#020617');
    ctx.fillStyle = benchGrad;
    ctx.fillRect(0, benchY, width, height - benchY);

    // Tabletop highlight rim
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, benchY);
    ctx.lineTo(width, benchY);
    ctx.stroke();

    // Bench perspective grid lines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
    ctx.lineWidth = 1;
    for (let x = -width * 0.3; x <= width * 1.3; x += 70) {
      ctx.beginPath();
      ctx.moveTo(x, benchY);
      ctx.lineTo(x + (x - width * 0.5) * 0.6, height);
      ctx.stroke();
    }

    // Shadow cast on bench by electroscope
    const electroscopeCenterX = width * 0.58;
    const electroscopeBaseY = benchY;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.beginPath();
    ctx.ellipse(electroscopeCenterX, electroscopeBaseY, 95, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ---------------------------------------------------------
    // 3. Gooseneck Lamp Assembly (Left Side)
    // ---------------------------------------------------------
    const lampBaseX = width * 0.16;
    const lampBaseY = benchY;
    const lampHeadX = width * 0.38;
    const lampHeadY = height * 0.28;

    // Lamp base plate
    ctx.save();
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(lampBaseX, lampBaseY - 6, 45, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Curved Chrome Gooseneck Stand
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lampBaseX, lampBaseY - 6);
    ctx.bezierCurveTo(
      lampBaseX - 30, lampBaseY - 140,
      lampHeadX - 90, lampHeadY + 40,
      lampHeadX, lampHeadY
    );
    ctx.stroke();

    // Gooseneck metallic ridges
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    // Lamp Shroud Angle pointing at the Zinc Plate
    const zincCenterX = electroscopeCenterX;
    const zincCenterY = height * 0.35;
    const lampAngle = Math.atan2(zincCenterY - lampHeadY, zincCenterX - lampHeadX);

    ctx.save();
    ctx.translate(lampHeadX, lampHeadY);
    ctx.rotate(lampAngle);

    // Lamp Bell Housing
    const shroudGrad = ctx.createLinearGradient(0, -25, 0, 25);
    shroudGrad.addColorStop(0, '#334155');
    shroudGrad.addColorStop(0.5, '#1e293b');
    shroudGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = shroudGrad;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-35, -12);
    ctx.lineTo(-5, -28);
    ctx.lineTo(25, -34);
    ctx.lineTo(25, 34);
    ctx.lineTo(-5, 28);
    ctx.lineTo(-35, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner Reflector Rim
    ctx.fillStyle = lampType !== 'off' ? currentLamp.colorGlow : '#475569';
    ctx.beginPath();
    ctx.ellipse(25, 0, 7, 34, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Bulb
    if (lampType !== 'off') {
      ctx.shadowColor = currentLamp.colorGlow;
      ctx.shadowBlur = 24;
      ctx.fillStyle = currentLamp.colorCore;
      ctx.beginPath();
      ctx.arc(16, 0, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ---------------------------------------------------------
    // 4. Incident Light Beam & Glass Filter Interaction
    // ---------------------------------------------------------
    const filterCenterX = width * 0.48;
    const filterCenterY = height * 0.31;
    const filterW = 18;
    const filterH = 95;

    if (lampType !== 'off') {
      const beamStart = { x: lampHeadX + Math.cos(lampAngle) * 25, y: lampHeadY + Math.sin(lampAngle) * 25 };
      const beamTarget = { x: zincCenterX - 25, y: zincCenterY - 4 };

      let beamEndPoint = beamTarget;
      let beamBlockedByFilter = false;

      if (hasGlassFilter) {
        if (isUV) {
          beamEndPoint = { x: filterCenterX, y: filterCenterY };
          beamBlockedByFilter = true;
        }
      }

      ctx.save();
      const coneGrad = ctx.createLinearGradient(beamStart.x, beamStart.y, beamEndPoint.x, beamEndPoint.y);
      coneGrad.addColorStop(0, currentLamp.colorBeam);
      coneGrad.addColorStop(0.7, currentLamp.colorBeam.replace('0.4', '0.25').replace('0.45', '0.3'));
      coneGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');

      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(beamStart.x - Math.sin(lampAngle) * 24, beamStart.y + Math.cos(lampAngle) * 24);
      ctx.lineTo(beamStart.x + Math.sin(lampAngle) * 24, beamStart.y - Math.cos(lampAngle) * 24);
      const spread = beamBlockedByFilter ? 32 : 46;
      ctx.lineTo(beamEndPoint.x + Math.sin(lampAngle) * spread, beamEndPoint.y - Math.cos(lampAngle) * spread);
      ctx.lineTo(beamEndPoint.x - Math.sin(lampAngle) * spread, beamEndPoint.y + Math.cos(lampAngle) * spread);
      ctx.closePath();
      ctx.fill();

      // Radiation wavefront pulses
      const pulsePhase = (performance.now() * 0.003) % 1;
      for (let w = 0; w < 4; w++) {
        const t = ((pulsePhase + w * 0.25) % 1);
        const wx = beamStart.x + (beamEndPoint.x - beamStart.x) * t;
        const wy = beamStart.y + (beamEndPoint.y - beamStart.y) * t;
        const wSpread = 16 + t * spread;

        ctx.strokeStyle = currentLamp.colorBeam;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(wx - Math.sin(lampAngle) * wSpread, wy + Math.cos(lampAngle) * wSpread);
        ctx.lineTo(wx + Math.sin(lampAngle) * wSpread, wy - Math.cos(lampAngle) * wSpread);
        ctx.stroke();
      }

      if (beamBlockedByFilter) {
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.beginPath();
        ctx.ellipse(filterCenterX, filterCenterY, 6, 36, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('UV ABSORBED', filterCenterX - 35, filterCenterY - 45);
      } else if (hasGlassFilter && isRed) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(filterCenterX - filterW / 2, filterCenterY - filterH / 2, filterW, filterH);
      }
      ctx.restore();
    }

    // ---------------------------------------------------------
    // 5. Glass Filter Plate Representation
    // ---------------------------------------------------------
    if (hasGlassFilter) {
      ctx.save();
      ctx.fillStyle = '#334155';
      ctx.fillRect(filterCenterX - 3, filterCenterY + filterH / 2, 6, benchY - (filterCenterY + filterH / 2));
      ctx.beginPath();
      ctx.ellipse(filterCenterX, benchY - 4, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      const glassGrad = ctx.createLinearGradient(filterCenterX - filterW / 2, 0, filterCenterX + filterW / 2, 0);
      glassGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      glassGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
      glassGrad.addColorStop(1, 'rgba(56, 189, 248, 0.35)');

      ctx.fillStyle = glassGrad;
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(filterCenterX - filterW / 2, filterCenterY - filterH / 2, filterW, filterH, 4);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(filterCenterX - filterW / 2 + 3, filterCenterY - filterH / 2 + 10);
      ctx.lineTo(filterCenterX + filterW / 2 - 3, filterCenterY + filterH / 2 - 20);
      ctx.stroke();

      ctx.fillStyle = '#7dd3fc';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('Glass Filter', filterCenterX - 22, filterCenterY + filterH / 2 + 15);
      ctx.restore();
    }

    // ---------------------------------------------------------
    // 6. Gold-Leaf Electroscope Apparatus
    // ---------------------------------------------------------
    const chamberCenterY = height * 0.58;
    const chamberRadius = 85;

    // A. Electroscope Outer Metal Casing (Polished Brass / Bronze)
    ctx.save();
    const baseGrad = ctx.createLinearGradient(electroscopeCenterX - 65, 0, electroscopeCenterX + 65, 0);
    baseGrad.addColorStop(0, '#78350f');
    baseGrad.addColorStop(0.3, '#d97706');
    baseGrad.addColorStop(0.7, '#f59e0b');
    baseGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = baseGrad;
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.roundRect(electroscopeCenterX - 65, chamberCenterY + chamberRadius - 5, 130, 25, 6);
    ctx.fill();
    ctx.stroke();

    // Grounding Screw / Earthing Terminal on casing
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(electroscopeCenterX + 68, chamberCenterY + chamberRadius + 8, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(electroscopeCenterX + 74, chamberCenterY + chamberRadius + 8);
    ctx.lineTo(electroscopeCenterX + 105, chamberCenterY + chamberRadius + 8);
    ctx.lineTo(electroscopeCenterX + 105, benchY);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '8px monospace';
    ctx.fillText('EARTH', electroscopeCenterX + 82, chamberCenterY + chamberRadius + 22);

    // Casing Outer Ring
    ctx.beginPath();
    ctx.arc(electroscopeCenterX, chamberCenterY, chamberRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#1c1917';
    ctx.fill();

    const brassRimGrad = ctx.createLinearGradient(
      electroscopeCenterX - chamberRadius, chamberCenterY - chamberRadius,
      electroscopeCenterX + chamberRadius, chamberCenterY + chamberRadius
    );
    brassRimGrad.addColorStop(0, '#ca8a04');
    brassRimGrad.addColorStop(0.3, '#fef08a');
    brassRimGrad.addColorStop(0.7, '#a16207');
    brassRimGrad.addColorStop(1, '#713f12');

    ctx.strokeStyle = brassRimGrad;
    ctx.lineWidth = 14;
    ctx.stroke();

    // Casing perimeter bolts
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const bx = electroscopeCenterX + Math.cos(a) * (chamberRadius + 1);
      const by = chamberCenterY + Math.sin(a) * (chamberRadius + 1);
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    // B. Insulator Collar (Amber / Ebonite Ring at top neck)
    const neckTopY = chamberCenterY - chamberRadius;
    const collarTopY = neckTopY - 26;

    ctx.save();
    ctx.fillStyle = '#b45309';
    ctx.fillRect(electroscopeCenterX - 18, neckTopY - 10, 36, 14);

    const amberGrad = ctx.createLinearGradient(electroscopeCenterX - 14, 0, electroscopeCenterX + 14, 0);
    amberGrad.addColorStop(0, '#7c2d12');
    amberGrad.addColorStop(0.5, '#ea580c');
    amberGrad.addColorStop(1, '#431407');
    ctx.fillStyle = amberGrad;
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(electroscopeCenterX - 14, collarTopY, 28, 22, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fed7aa';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('INSULATOR', electroscopeCenterX + 18, collarTopY + 14);
    ctx.restore();

    // C. Internal Central Brass Stem & Fixed Backing Plate
    ctx.save();
    const stemTopY = collarTopY - 8;
    const stemBottomY = chamberCenterY + 45;

    const stemGrad = ctx.createLinearGradient(electroscopeCenterX - 4, 0, electroscopeCenterX + 4, 0);
    stemGrad.addColorStop(0, '#ca8a04');
    stemGrad.addColorStop(0.5, '#fef08a');
    stemGrad.addColorStop(1, '#854d0e');
    ctx.fillStyle = stemGrad;
    ctx.fillRect(electroscopeCenterX - 4, stemTopY, 8, stemBottomY - stemTopY);

    const plateWidth = 8;
    const plateHeight = 52;
    const plateY = chamberCenterY - 12;

    ctx.fillStyle = stemGrad;
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 1;
    ctx.fillRect(electroscopeCenterX - 6, plateY, plateWidth, plateHeight);
    ctx.strokeRect(electroscopeCenterX - 6, plateY, plateWidth, plateHeight);

    // D. Moving Gold Leaf (Hinged at top of plate)
    const hingeX = electroscopeCenterX + 2;
    const hingeY = plateY + 4;
    const leafLength = 48;

    const rad = (displayLeafAngle * Math.PI) / 180;
    const leafEndX = hingeX + Math.sin(rad) * leafLength;
    const leafEndY = hingeY + Math.cos(rad) * leafLength;

    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = displayLeafAngle > 10 ? 8 : 2;

    const goldGrad = ctx.createLinearGradient(hingeX, hingeY, leafEndX, leafEndY);
    goldGrad.addColorStop(0, '#fef08a');
    goldGrad.addColorStop(0.3, '#facc15');
    goldGrad.addColorStop(0.7, '#eab308');
    goldGrad.addColorStop(1, '#ca8a04');

    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';

    const ctrlX = hingeX + Math.sin(rad * 0.7) * (leafLength * 0.55);
    const ctrlY = hingeY + Math.cos(rad * 0.7) * (leafLength * 0.55) + 3;

    ctx.beginPath();
    ctx.moveTo(hingeX, hingeY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, leafEndX, leafEndY);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(hingeX, hingeY, 3, 0, Math.PI * 2);
    ctx.fill();

    const absCharge = Math.abs(charge);
    if (absCharge > 8) {
      const chargeSign = charge < 0 ? '−' : '+';
      const badgeColor = charge < 0 ? '#60a5fa' : '#f87171';
      ctx.fillStyle = badgeColor;
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';

      ctx.fillText(chargeSign, electroscopeCenterX - 14, plateY + 22);
      ctx.fillText(chargeSign, electroscopeCenterX - 14, plateY + 40);

      const midLeafX = (hingeX + leafEndX) / 2 + 8;
      const midLeafY = (hingeY + leafEndY) / 2;
      ctx.fillText(chargeSign, midLeafX, midLeafY);
    }
    ctx.restore();

    // E. Glass Inspection Window Front
    ctx.save();
    const glassReflectGrad = ctx.createLinearGradient(
      electroscopeCenterX - chamberRadius * 0.8, chamberCenterY - chamberRadius * 0.8,
      electroscopeCenterX + chamberRadius * 0.8, chamberCenterY + chamberRadius * 0.8
    );
    glassReflectGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
    glassReflectGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.03)');
    glassReflectGrad.addColorStop(0.65, 'rgba(56, 189, 248, 0.05)');
    glassReflectGrad.addColorStop(1, 'rgba(255, 255, 255, 0.18)');

    ctx.fillStyle = glassReflectGrad;
    ctx.beginPath();
    ctx.arc(electroscopeCenterX, chamberCenterY, chamberRadius - 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(electroscopeCenterX, chamberCenterY, chamberRadius - 14, -Math.PI * 0.8, -Math.PI * 0.35);
    ctx.stroke();
    ctx.restore();

    // ---------------------------------------------------------
    // 7. Polished Zinc Plate on Brass Cap
    // ---------------------------------------------------------
    const capY = collarTopY - 14;
    const zincY = capY - 10;
    const zincRadiusX = 58;
    const zincRadiusY = 14;

    ctx.save();
    const capGrad = ctx.createLinearGradient(electroscopeCenterX - 28, 0, electroscopeCenterX + 28, 0);
    capGrad.addColorStop(0, '#a16207');
    capGrad.addColorStop(0.5, '#fef08a');
    capGrad.addColorStop(1, '#854d0e');
    ctx.fillStyle = capGrad;
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(electroscopeCenterX - 26, capY - 6, 52, 12, 3);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isOxidized ? '#475569' : '#64748b';
    ctx.beginPath();
    ctx.ellipse(electroscopeCenterX, zincY + 5, zincRadiusX, zincRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();

    const zincGrad = ctx.createRadialGradient(
      electroscopeCenterX - 15, zincY - 3, 5,
      electroscopeCenterX, zincY, zincRadiusX
    );
    if (isOxidized) {
      zincGrad.addColorStop(0, '#64748b');
      zincGrad.addColorStop(0.5, '#475569');
      zincGrad.addColorStop(0.8, '#57534e');
      zincGrad.addColorStop(1, '#334155');
    } else {
      zincGrad.addColorStop(0, '#f8fafc');
      zincGrad.addColorStop(0.3, '#cbd5e1');
      zincGrad.addColorStop(0.7, '#94a3b8');
      zincGrad.addColorStop(1, '#475569');
    }

    ctx.fillStyle = zincGrad;
    ctx.strokeStyle = isOxidized ? '#334155' : '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(electroscopeCenterX, zincY, zincRadiusX, zincRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (!isOxidized) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(electroscopeCenterX - 12, zincY - 2, zincRadiusX * 0.6, zincRadiusY * 0.5, -0.2, 0, Math.PI);
      ctx.stroke();
    } else {
      ctx.fillStyle = 'rgba(28, 25, 23, 0.6)';
      for (let s = -35; s <= 35; s += 14) {
        ctx.beginPath();
        ctx.arc(electroscopeCenterX + s, zincY + (s % 3) * 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = isOxidized ? '#f59e0b' : '#e2e8f0';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      isOxidized ? 'Zinc Plate (Oxidized ZnO)' : 'Polished Zinc Plate (Pure Zn)',
      electroscopeCenterX, zincY - 20
    );

    if (absCharge > 8) {
      const chargeSign = charge < 0 ? '−' : '+';
      const badgeColor = charge < 0 ? '#60a5fa' : '#f87171';
      ctx.fillStyle = badgeColor;
      ctx.font = 'bold 11px monospace';
      for (let cX = -35; cX <= 35; cX += 18) {
        ctx.fillText(chargeSign, electroscopeCenterX + cX, zincY + 3);
      }
    }
    ctx.restore();

    // ---------------------------------------------------------
    // 8. Escaping Photoelectron Sparks & Dust Animation
    // ---------------------------------------------------------
    ctx.save();
    for (const p of particlesRef.current) {
      const px = electroscopeCenterX + p.x;
      const py = zincY + p.y;
      const alpha = p.life / p.maxLife;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha * 0.85;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - p.vx * 0.08, py - p.vy * 0.08);
      ctx.stroke();

      if (p.type === 'escaping' && Math.random() < 0.3) {
        ctx.font = '8px sans-serif';
        ctx.fillText('e⁻', px + 4, py - 4);
      }
    }

    for (const d of dustParticlesRef.current) {
      const dx = electroscopeCenterX + d.x;
      const dy = zincY + d.y;
      const alpha = d.life / d.maxLife;
      ctx.fillStyle = d.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ---------------------------------------------------------
    // 9. Interactive Earthing Finger Representation
    // ---------------------------------------------------------
    if (isGrounding) {
      ctx.save();
      const fingerX = electroscopeCenterX + 35;
      const fingerY = zincY - 2;

      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.moveTo(fingerX - 10, fingerY);
        ctx.lineTo(fingerX - 10 + Math.cos(a) * 16, fingerY + Math.sin(a) * 12);
      }
      ctx.stroke();

      ctx.fillStyle = '#fed7aa';
      ctx.strokeStyle = '#fb923c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fingerX + 70, fingerY - 60);
      ctx.lineTo(fingerX, fingerY - 8);
      ctx.arc(fingerX - 8, fingerY, 8, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(fingerX + 70, fingerY + 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('GROUNDING DISCHARGE', fingerX - 25, fingerY - 25);
      ctx.restore();
    }

    // ---------------------------------------------------------
    // 10. Emery Paper Scrubbing Visual Effect
    // ---------------------------------------------------------
    if (scrubAnimRef.current > 0) {
      ctx.save();
      const sweepX = electroscopeCenterX + Math.sin(performance.now() * 0.02) * 45;
      const sweepY = zincY - 4;

      ctx.fillStyle = '#78716c';
      ctx.strokeStyle = '#d6d3d1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(sweepX - 22, sweepY - 14, 44, 20, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('EMERY PAPER', sweepX, sweepY);
      ctx.restore();
    }

    // ---------------------------------------------------------
    // 11. Divergence Angle HUD in Casing
    // ---------------------------------------------------------
    ctx.save();
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`Leaf θ: ${displayLeafAngle.toFixed(1)}°`, electroscopeCenterX, chamberCenterY + chamberRadius - 18);
    ctx.restore();

  }, [
    displayLeafAngle,
    charge,
    lampType,
    lampIntensity,
    hasGlassFilter,
    isOxidized,
    isGrounding,
    currentLamp,
    isUV,
    isRed
  ]);

  // -------------------------------------------------------------
  // Simulation Loop
  // -------------------------------------------------------------
  useEffect(() => {
    let lastTime = performance.now();

    const updateLoop = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (isPlaying) {
        if (isGrounding) {
          setCharge((c) => {
            const next = c * Math.exp(-dt * 15);
            return Math.abs(next) < 0.2 ? 0 : next;
          });
        } else if (isPhotoelectricActive) {
          const dischargeRate = (lampIntensity / 500) * 28;

          if (charge < -0.1) {
            setCharge((c) => Math.min(0, c + dischargeRate * dt));

            if (Math.random() < 0.65) {
              particlesRef.current.push({
                x: (Math.random() - 0.5) * 55,
                y: -10 + (Math.random() - 0.5) * 6,
                vx: (Math.random() - 0.5) * 35,
                vy: -Math.random() * 70 - 45,
                life: 1.0,
                maxLife: 1.0,
                size: 2.5 + Math.random() * 2,
                color: '#facc15',
                type: 'escaping'
              });
            }
          } else if (charge > 0.1) {
            if (Math.random() < 0.45) {
              particlesRef.current.push({
                x: (Math.random() - 0.5) * 50,
                y: -10,
                vx: (Math.random() - 0.5) * 20,
                vy: -Math.random() * 30 - 15,
                gravityY: 160,
                life: 0.5,
                maxLife: 0.5,
                size: 2,
                color: '#60a5fa',
                type: 'recaptured'
              });
            }
          } else {
            setCharge((c) => Math.min(18, c + dischargeRate * 0.2 * dt));
            if (Math.random() < 0.3) {
              particlesRef.current.push({
                x: (Math.random() - 0.5) * 50,
                y: -10,
                vx: (Math.random() - 0.5) * 30,
                vy: -Math.random() * 50 - 30,
                life: 0.8,
                maxLife: 0.8,
                size: 2,
                color: '#38bdf8',
                type: 'escaping'
              });
            }
          }
        }

        const absQ = Math.abs(charge);
        const targetAngle = (absQ / 100) * 52;
        const springK = 22;
        const damping = 5.2;

        const accel = (targetAngle - leafAngleRef.current) * springK - leafVelRef.current * damping;
        leafVelRef.current += accel * dt;
        leafAngleRef.current += leafVelRef.current * dt;

        const flutter = absQ > 5 ? (Math.sin(now * 0.015) * 0.4) : 0;
        const currentAngle = Math.max(0, Math.min(65, leafAngleRef.current + flutter));
        setDisplayLeafAngle(currentAngle);

        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.life -= dt;
          p.x += p.vx * dt;
          if (p.gravityY) {
            p.vy += p.gravityY * dt;
          }
          p.y += p.vy * dt;

          if (p.life <= 0 || p.y > 5) {
            particlesRef.current.splice(i, 1);
          }
        }

        if (scrubAnimRef.current > 0) {
          scrubAnimRef.current = Math.max(0, scrubAnimRef.current - dt * 2);
        }
        for (let i = dustParticlesRef.current.length - 1; i >= 0; i--) {
          const d = dustParticlesRef.current[i];
          d.life -= dt;
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          d.vy += 60 * dt;
          if (d.life <= 0) {
            dustParticlesRef.current.splice(i, 1);
          }
        }
      }

      renderCanvas();
      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isGrounding, isPhotoelectricActive, charge, lampIntensity, isOxidized, renderCanvas]);

  // -------------------------------------------------------------
  // Quiz Handlers
  // -------------------------------------------------------------
  const handleSelectQuizOption = (questionId, optionIndex) => {
    if (quizSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    KCSE_QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (onTelemetry) {
      onTelemetry('kcse_electroscope_quiz_submitted', {
        score,
        total: KCSE_QUIZ_QUESTIONS.length
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-3xl p-4 sm:p-6 md:p-8 space-y-6 font-sans border border-slate-800 shadow-2xl">
      {/* Simulation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" /> KCSE Physics Form 4
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Atom className="w-3.5 h-3.5" /> Topic 9: Photoelectric Effect
            </span>
            <span className="text-xs text-slate-500 font-mono">Hertz & Hallwachs Practical</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            Gold-Leaf Electroscope & Zinc Plate UV Experiment
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
            Investigate how high-frequency Ultraviolet radiation discharges a negatively charged electroscope via photoelectric emission, verify that visible red light fails at any intensity (E = hf &lt; &Phi;), test UV absorption through ordinary glass, and explore positive charge electrostatic recapture.
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg active:scale-95 ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Freeze Physics' : 'Live Physics'}
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700 active:scale-95"
            title="Reset apparatus to defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('bench')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
            activeTab === 'bench'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Eye className="w-4 h-4" /> Interactive Lab Bench
        </button>
        <button
          onClick={() => setActiveTab('physics')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
            activeTab === 'physics'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Wave vs Quantum Physics
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
            activeTab === 'quiz'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" /> KCSE Exam Challenge ({KCSE_QUIZ_QUESTIONS.length} Questions)
        </button>
      </div>

      {/* Main Tab: Interactive Lab Bench */}
      {activeTab === 'bench' && (
        <div className="space-y-6">
          {/* Live Plain-English Status Banner */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-start sm:items-center gap-3.5 ${statusBadge.color}`}>
            <statusBadge.icon className="w-6 h-6 shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1">
              <div className="font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-2">
                {statusBadge.text}
              </div>
              <p className="text-xs sm:text-sm mt-0.5 opacity-90 leading-relaxed">
                {statusBadge.subtext}
              </p>
            </div>
            {/* Quick Metrics */}
            <div className="hidden lg:flex items-center gap-4 text-right pl-4 border-l border-white/10 shrink-0 font-mono text-xs">
              <div>
                <div className="text-slate-400 text-[10px] uppercase">Net Charge</div>
                <div className="font-bold text-sm">
                  {charge === 0 ? '0 (Neutral)' : `${charge > 0 ? '+' : ''}${charge.toFixed(0)} arb. C`}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase">Divergence</div>
                <div className="font-bold text-sm text-amber-400">
                  {displayLeafAngle.toFixed(1)}°
                </div>
              </div>
            </div>
          </div>

          {/* Main Simulation Stage: Canvas & Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Pseudo-3D Laboratory Bench Canvas */}
            <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2.5">
                <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" /> Pseudo-3D Apparatus Stage
                </span>
                <span className="font-mono text-slate-400 text-[11px]">
                  Zinc &Phi; = 4.31 eV • UV hf = 4.88 eV • Red hf = 1.91 eV
                </span>
              </div>

              {/* Canvas Container */}
              <div className="w-full aspect-[16/10] min-h-[360px] sm:min-h-[420px] bg-slate-950 rounded-2xl border border-slate-800/80 relative overflow-hidden flex items-center justify-center shadow-inner">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full block select-none cursor-crosshair"
                />

                {/* Overlaid Micro-HUD on Top of Canvas */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Lamp:</span>
                    <span className="font-bold text-purple-300">{currentLamp.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Glass Filter:</span>
                    <span className={hasGlassFilter ? 'text-sky-400 font-bold' : 'text-slate-500'}>
                      {hasGlassFilter ? 'INSERTED (UV Absorbed)' : 'Removed'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Zinc State:</span>
                    <span className={isOxidized ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {isOxidized ? 'Oxidized (ZnO Dull)' : 'Polished (Pure Zn)'}
                    </span>
                  </div>
                </div>

                {/* Overlaid Micro-HUD on Bottom-Right */}
                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px] font-mono text-right">
                  <div className="text-slate-400">Gold Leaf Divergence</div>
                  <div className="text-base font-bold text-amber-300">
                    {displayLeafAngle.toFixed(1)}&deg;
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {charge < 0 ? 'Excess Electrons (Repelling)' : charge > 0 ? 'Deficit Electrons (Repelling)' : 'Vertical (Discharged)'}
                  </div>
                </div>
              </div>

              {/* Apparatus Quick Actions Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <button
                  onClick={handleScrubZinc}
                  className="px-3 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Flame className="w-3.5 h-3.5" /> Scrub Zinc with Emery
                </button>
                <button
                  onClick={() => setHasGlassFilter(!hasGlassFilter)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 border ${
                    hasGlassFilter
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" /> {hasGlassFilter ? 'Remove Glass Filter' : 'Insert Glass Filter'}
                </button>
                <button
                  onClick={() => setIsOxidized(!isOxidized)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 border ${
                    isOxidized
                      ? 'bg-amber-950/40 text-amber-300 border-amber-600/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Toggle oxide formation on zinc"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> {isOxidized ? 'Clean Zinc' : 'Oxidize Zinc'}
                </button>
                <button
                  onClick={handleDischargeGround}
                  className="px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5" /> Touch Cap (Ground)
                </button>
              </div>
            </div>

            {/* Right 4 Cols: Interactive Controls Drawer */}
            <div className="lg:col-span-4 space-y-4">
              {/* 1. Charging Controls Panel */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-3.5 shadow-lg">
                <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> 1. Electroscope Charging State
                </span>
                <p className="text-[11px] text-slate-400">
                  Select the initial electrostatic state of the zinc plate and gold leaf:
                </p>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={handleChargeNegative}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition text-left flex items-center justify-between border ${
                      charge < -10
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-black">−</span>
                      <div>
                        <div>Charge Negative (−)</div>
                        <div className="text-[10px] text-slate-400 font-normal">Excess electrons • Leaf diverged</div>
                      </div>
                    </div>
                    {charge < -10 && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </button>

                  <button
                    onClick={handleChargePositive}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition text-left flex items-center justify-between border ${
                      charge > 10
                        ? 'bg-rose-600/20 text-rose-300 border-rose-500/50 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center font-black">+</span>
                      <div>
                        <div>Charge Positive (+)</div>
                        <div className="text-[10px] text-slate-400 font-normal">Deficit of electrons • Leaf diverged</div>
                      </div>
                    </div>
                    {charge > 10 && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
                  </button>

                  <button
                    onClick={handleDischargeGround}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition text-left flex items-center justify-between border ${
                      Math.abs(charge) <= 10
                        ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black">0</span>
                      <div>
                        <div>Discharge with Finger (Ground)</div>
                        <div className="text-[10px] text-slate-400 font-normal">Neutral • Leaf hangs vertically</div>
                      </div>
                    </div>
                    {Math.abs(charge) <= 10 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>
              </div>

              {/* 2. Radiation Source Controls */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4 shadow-lg">
                <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sun className="w-4 h-4 text-purple-400" /> 2. Radiation Source Selection
                </span>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setLampType('uv')}
                    className={`p-2.5 rounded-xl font-bold transition flex flex-col items-center gap-1 border ${
                      lampType === 'uv'
                        ? 'bg-purple-600/20 text-purple-300 border-purple-500 shadow-lg shadow-purple-950/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>UV Lamp</span>
                    <span className="text-[9px] text-purple-400 font-mono">f &gt; f₀ (High)</span>
                  </button>

                  <button
                    onClick={() => setLampType('red')}
                    className={`p-2.5 rounded-xl font-bold transition flex flex-col items-center gap-1 border ${
                      lampType === 'red'
                        ? 'bg-red-600/20 text-red-300 border-red-500 shadow-lg shadow-red-950/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-red-400" />
                    <span>Red Lamp</span>
                    <span className="text-[9px] text-red-400 font-mono">f &lt; f₀ (Low)</span>
                  </button>

                  <button
                    onClick={() => setLampType('off')}
                    className={`p-2.5 rounded-xl font-bold transition flex flex-col items-center gap-1 border ${
                      lampType === 'off'
                        ? 'bg-slate-800 text-slate-200 border-slate-600'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                    <span>Lamp Off</span>
                    <span className="text-[9px] text-slate-500 font-mono">0 W</span>
                  </button>
                </div>

                {/* Lamp Intensity Slider */}
                {lampType !== 'off' && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs font-medium text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-purple-400" /> Lamp Intensity:
                      </span>
                      <span className="font-mono font-bold text-amber-400">{lampIntensity} W</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="50"
                      value={lampIntensity}
                      onChange={(e) => setLampIntensity(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <p className="text-[10px] text-slate-400">
                      {isRed
                        ? 'Notice: Raising red lamp intensity to 1000W increases photon count, but photon energy remains 1.91 eV < 4.31 eV. Zero emission!'
                        : 'Higher UV intensity delivers more high-energy photons per second, discharging the negative leaf faster!'}
                    </p>
                  </div>
                )}

                {/* Live Quantum Telemetry Table */}
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-[11px] font-mono space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Photon Energy (E = hf):</span>
                    <span className="font-bold text-white">{currentLamp.photonEnergy.toFixed(2)} eV</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Zinc Work Function (&Phi;):</span>
                    <span className="font-bold text-amber-400">{ZINC_WORK_FUNCTION} eV</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Max Kinetic Energy (Kmax):</span>
                    <span className={`font-bold ${kMaxEV > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {kMaxEV.toFixed(2)} eV
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                    <span>Threshold Condition:</span>
                    <span className={`font-bold ${photonEnergy >= ZINC_WORK_FUNCTION ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {photonEnergy >= ZINC_WORK_FUNCTION ? 'hf > Φ (Satisfied)' : 'hf < Φ (Insufficient)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. KCSE Practical Checklist */}
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-4 text-xs space-y-2.5">
                <span className="font-bold text-slate-300 uppercase tracking-wider block text-[11px]">
                  KCSE Observation Checklist:
                </span>
                <ul className="space-y-1.5 text-slate-400 text-[11px]">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Negatively charged + UV:</strong> Leaf collapses rapidly into vertical position.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Glass plate inserted:</strong> UV is absorbed by glass; leaf remains fully diverged.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Visible red lamp:</strong> Frequency is below threshold; leaf remains diverged.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Positively charged + UV:</strong> Leaf does not collapse; electrons are recaptured.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Wave vs Quantum Theory */}
      {activeTab === 'physics' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Atom className="w-5 h-5 text-purple-400" />
              Classical Wave Theory Failure vs. Einstein's Quantum Triumph
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Why the Gold-Leaf Electroscope experiment proved that light behaves as discrete packets of energy (photons) rather than continuous classical waves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Classical Wave Prediction */}
            <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-rose-900/40 space-y-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-block">
                Classical Wave Theory (Maxwell)
              </span>
              <h4 className="text-sm font-bold text-slate-200">What Classical Physics Predicted:</h4>
              <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <li>
                  &bull; <strong>Energy depends on intensity:</strong> A brighter light has larger electric field amplitude and carries more energy.
                </li>
                <li>
                  &bull; <strong>Visible light should work:</strong> An intense 1000 W visible red or incandescent beam should deliver enough energy to eject electrons and collapse the leaf.
                </li>
                <li>
                  &bull; <strong>Time delay required:</strong> At low light intensity, there should be a measurable time lag while an electron slowly absorbs continuous wave energy.
                </li>
              </ul>
              <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-900/50 text-rose-300 text-xs font-medium">
                DISPROVED BY EXPERIMENT: Even a 10,000 W intense red light produces ZERO electron emission, whereas faint UV radiation discharges the leaf instantaneously!
              </div>
            </div>

            {/* Quantum Explanation */}
            <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-emerald-900/40 space-y-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block">
                Einstein's Photon Theory (1905)
              </span>
              <h4 className="text-sm font-bold text-slate-200">The Quantum Reality:</h4>
              <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <li>
                  &bull; <strong>Photons are localized packets:</strong> Light exists as quantized packets called photons, each carrying energy <span className="text-emerald-400 font-mono">E = hf</span>.
                </li>
                <li>
                  &bull; <strong>One-to-one interaction:</strong> One photon collides with exactly one conduction electron. If <span className="text-emerald-400 font-mono">hf &lt; &Phi;</span>, the photon is harmlessly reflected or absorbed as heat; no emission occurs.
                </li>
                <li>
                  &bull; <strong>Instantaneous emission:</strong> If <span className="text-emerald-400 font-mono">hf &ge; &Phi;</span>, emission is immediate (within 10⁻⁹ s) with maximum kinetic energy <span className="text-emerald-400 font-mono">Kmax = hf - &Phi;</span>.
                </li>
              </ul>
              <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-900/50 text-emerald-300 text-xs font-medium">
                PROVED BY EXPERIMENT: UV photons (4.88 eV) individually possess enough quantum punch to liberate electrons from zinc (&Phi; = 4.31 eV), collapsing the leaf instantaneously.
              </div>
            </div>
          </div>

          {/* Mathematical Summary Card */}
          <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Essential KCSE Physics Mathematical Formulas:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-mono">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-xs">Photon Energy</div>
                <div className="text-purple-400 font-bold text-base mt-1">E = hf = hc / &lambda;</div>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-xs">Threshold Frequency</div>
                <div className="text-amber-400 font-bold text-base mt-1">f₀ = &Phi; / h</div>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-xs">Einstein Photoelectric Eq.</div>
                <div className="text-emerald-400 font-bold text-base mt-1">Kmax = hf - &Phi;</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: KCSE Exam Challenge */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                KCSE Form 4 Examination Practical Quiz
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Test your mastery of the Hertz & Hallwachs Gold-Leaf Electroscope practical.
              </p>
            </div>
            {quizSubmitted && (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-xl font-bold text-sm">
                  Score: {quizScore} / {KCSE_QUIZ_QUESTIONS.length} ({Math.round((quizScore / KCSE_QUIZ_QUESTIONS.length) * 100)}%)
                </div>
                <button
                  onClick={handleResetQuiz}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {KCSE_QUIZ_QUESTIONS.map((q, qIndex) => {
              const selectedOpt = selectedAnswers[q.id];

              return (
                <div key={q.id} className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-200 leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  <div className="space-y-2 pt-1 pl-8">
                    {q.options.map((opt, optIndex) => {
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';

                      if (quizSubmitted) {
                        if (optIndex === q.correctIndex) {
                          btnStyle = 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 font-bold';
                        } else if (selectedOpt === optIndex) {
                          btnStyle = 'bg-rose-950/60 border-rose-500/80 text-rose-200 line-through';
                        }
                      } else if (selectedOpt === optIndex) {
                        btnStyle = 'bg-purple-600/20 border-purple-500 text-purple-200 font-bold';
                      }

                      return (
                        <button
                          key={optIndex}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectQuizOption(q.id, optIndex)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIndex === q.correctIndex && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                          )}
                          {quizSubmitted && selectedOpt === optIndex && optIndex !== q.correctIndex && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation card displayed after submission */}
                  {quizSubmitted && (
                    <div className="ml-8 mt-3 p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                      <div className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" /> KCSE Marking Scheme Explanation:
                      </div>
                      <p className="leading-relaxed text-slate-400">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted && (
            <div className="flex justify-end pt-2">
              <button
                disabled={Object.keys(selectedAnswers).length < KCSE_QUIZ_QUESTIONS.length}
                onClick={handleSubmitQuiz}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition shadow-lg shadow-purple-950/50 flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Submit Answers & Grade Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
