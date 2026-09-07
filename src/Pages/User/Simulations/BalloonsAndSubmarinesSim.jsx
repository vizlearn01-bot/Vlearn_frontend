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
  Compass,
  Wind,
  Cloud,
  Radio,
  Droplets,
  Waves,
  Zap,
  ArrowDown,
  ArrowUp,
  RefreshCw,
  Eye,
  Activity,
  Maximize2
} from 'lucide-react';

// ==========================================
// PRESETS & CHALLENGES CONFIGURATION
// ==========================================

const PRESETS = [
  {
    id: 'sub_neutral',
    mode: 'sub',
    name: 'Submarine Neutral Hover Trim',
    tagline: 'Balanced Mass & Hydrostatic Equilibrium',
    desc: 'Main ballast tanks flooded to exactly match sea water displacement (Weight = Upthrust) for stationary hover at 150m.',
    config: {
      ballastPct: 84.2,
      depth: 150,
      throttle: 0,
      planeAngle: 0,
      floodOpen: false,
      blowActive: false,
      airReserve: 95
    }
  },
  {
    id: 'sub_emergency',
    mode: 'sub',
    name: 'Submarine Emergency Ballast Blow',
    tagline: 'Rapid Ascent from High-Risk Depth',
    desc: 'Descending rapidly past 340m near crush threshold. High-pressure 300-bar compressed air ejects water from ballast tanks.',
    config: {
      ballastPct: 96.0,
      depth: 340,
      throttle: 35,
      planeAngle: 18,
      floodOpen: false,
      blowActive: true,
      airReserve: 80
    }
  },
  {
    id: 'balloon_standard',
    mode: 'balloon',
    name: 'Stratospheric Sounding Balloon',
    tagline: 'Helium Upper-Air Meteorological Radiosonde',
    desc: 'Standard weather balloon launching with 4.5 m³ of Helium and 0.8 kg radiosonde package climbing to ~32,000m.',
    config: {
      gasType: 'helium',
      gasVolume0: 4.5,
      payloadMass: 0.8,
      burstDiameter: 8.2,
      altitude: 0,
      hasBurst: false
    }
  },
  {
    id: 'balloon_heavy',
    mode: 'balloon',
    name: 'Heavy Scientific Payload Ascent',
    tagline: 'Hydrogen Ultra-High Lift Cosmic Ray Detector',
    desc: 'High-lift Hydrogen balloon carrying a 3.2 kg sensor array with reinforced 10.5m burst envelope to reach extreme altitude.',
    config: {
      gasType: 'hydrogen',
      gasVolume0: 6.8,
      payloadMass: 3.2,
      burstDiameter: 10.5,
      altitude: 0,
      hasBurst: false
    }
  }
];

const CHALLENGES = [
  {
    id: 'sub_hover',
    mode: 'sub',
    title: 'Challenge 1: Trim for Neutral Depth Hover',
    difficulty: 'Introductory',
    badge: 'Hydrostatic Trim',
    hint: 'Regulate ballast water percentage to between 83.5% and 84.8% so net vertical force drops to near zero (|F_net| < 80 kN) and vertical drift stops.',
    check: (phys) => {
      return (
        phys.mode === 'sub' &&
        phys.depth >= 100 &&
        phys.depth <= 280 &&
        Math.abs(phys.netForce) < 80000 &&
        Math.abs(phys.vz) < 0.25
      );
    },
    congrats: 'Outstanding trim engineering! At this exact ballast level, submarine weight perfectly matches displaced sea water upthrust. The sub achieves neutral buoyancy!'
  },
  {
    id: 'sub_blow_escape',
    mode: 'sub',
    title: 'Challenge 2: Deep Dive Emergency Recovery',
    difficulty: 'Intermediate',
    badge: 'Hull Safety',
    hint: 'Sub is sinking fast! Activate High-Pressure Air Blow to blow out ballast tanks, set rise planes (+15° to +25°), and stop the dive before reaching the 500m crush danger line.',
    check: (phys) => {
      return (
        phys.mode === 'sub' &&
        phys.depth > 200 &&
        phys.depth < 480 &&
        phys.ballastPct < 50 &&
        phys.vz < -1.5
      );
    },
    congrats: 'Emergency recovery successful! High-pressure compressed air purged the ballast tanks through bottom Kingston ports, creating strong positive buoyancy!'
  },
  {
    id: 'balloon_strato',
    mode: 'balloon',
    title: 'Challenge 3: Stratospheric Sounding Record',
    difficulty: 'Advanced',
    badge: 'Aerostatic Record',
    hint: 'Configure lifting gas (Helium or Hydrogen) and initial volume to reach an altitude over 28,000 m without bursting too early, then track parachute recovery.',
    check: (phys) => {
      return phys.mode === 'balloon' && phys.altitude >= 28000;
    },
    congrats: 'Stratosphere conquered! The balloon expanded as ambient pressure fell by over 98%, demonstrating Boyle’s law and Archimedes’ aerostatic lift!'
  }
];

// Atmospheric constants
const P0 = 101325; // Pa at sea level
const T0 = 288.15; // K at sea level
const R_AIR = 287.058; // J/(kg*K)
const G = 9.81; // m/s^2

const GAS_DATA = {
  helium: {
    name: 'Helium (He)',
    density0: 0.1786, // kg/m3 at STP
    formula: 'He',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.4)',
    desc: 'Inert, safe non-flammable noble gas with high aerostatic lift.'
  },
  hydrogen: {
    name: 'Hydrogen (H₂)',
    density0: 0.0899, // kg/m3 at STP
    formula: 'H₂',
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.4)',
    desc: 'Lightest gas in universe; highest lift efficiency, requires careful safety.'
  },
  hot_air: {
    name: 'Hot Air (~85°C)',
    density0: 0.946, // kg/m3
    formula: 'Air (358K)',
    color: '#fb923c',
    glow: 'rgba(251, 146, 60, 0.4)',
    desc: 'Thermal buoyancy via density differential: ρ_hot < ρ_ambient.'
  }
};

export default function BalloonsAndSubmarinesSim({ onTelemetry }) {
  // Global View Mode: 'sub' (Submarine Hydrostatics) or 'balloon' (Weather Balloon Aerostatics)
  const [mode, setMode] = useState('sub');

  // Common UI State
  const [isRunning, setIsRunning] = useState(true);
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [showVectors, setShowVectors] = useState(true);
  const [showCutawayLabels, setShowCutawayLabels] = useState(true);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeSuccess, setChallengeSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // ==========================================
  // MODE 1: SUBMARINE SIMULATION STATE
  // ==========================================
  // Physical parameters:
  // Hull total outer volume = 6500 m^3
  // Ballast tank capacity = 1000 m^3 (Fwd: 500 m^3, Aft: 500 m^3)
  // Dry structural mass = 5,800,000 kg (5,800 metric tons)
  const [depth, setDepth] = useState(150); // meters (0 to 600m)
  const [ballastPct, setBallastPct] = useState(84.2); // 0% (empty) to 100% (full)
  const [throttle, setThrottle] = useState(20); // 0% to 100% forward propulsion
  const [planeAngle, setPlaneAngle] = useState(0); // -25 deg (dive) to +25 deg (rise)
  const [floodValvesOpen, setFloodValvesOpen] = useState(false); // Vent & Kingston flood
  const [airBlowActive, setAirBlowActive] = useState(false); // HP air purge
  const [airReserve, setAirReserve] = useState(95); // 0% to 100% (HP air tanks)
  const [subVz, setSubVz] = useState(0); // vertical speed (m/s)
  const [subVx, setSubVx] = useState(3.5); // forward speed (m/s)

  // ==========================================
  // MODE 2: WEATHER BALLOON SIMULATION STATE
  // ==========================================
  const [balloonGas, setBalloonGas] = useState('helium');
  const [gasVolume0, setGasVolume0] = useState(4.5); // m^3 initial at launch
  const [payloadMass, setPayloadMass] = useState(0.8); // kg
  const [burstDiameter, setBurstDiameter] = useState(8.2); // meters max rupture threshold
  const [balloonAlt, setBalloonAlt] = useState(0); // altitude in meters (0 to 38,000)
  const [balloonVy, setBalloonVy] = useState(0); // vertical speed (m/s)
  const [hasBurst, setHasBurst] = useState(false);
  const [parachuteDeployed, setParachuteDeployed] = useState(false);
  const [balloonDiameter, setBalloonDiameter] = useState(2.05);

  // Animation & Canvas refs
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const bubbleParticlesRef = useRef([]);
  const cloudParticlesRef = useRef([]);

  // Setup visual particles
  useEffect(() => {
    // Generate bubbles for submarine ocean
    const bubbles = [];
    for (let i = 0; i < 45; i++) {
      bubbles.push({
        x: Math.random() * 800,
        y: Math.random() * 450,
        r: Math.random() * 2.5 + 1,
        speed: Math.random() * 1.5 + 0.8,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    bubbleParticlesRef.current = bubbles;

    // Generate cloud wisps for atmosphere
    const clouds = [];
    for (let i = 0; i < 15; i++) {
      clouds.push({
        x: Math.random() * 800,
        alt: Math.random() * 12000 + 1000,
        w: Math.random() * 140 + 80,
        h: Math.random() * 30 + 15,
        speed: (Math.random() - 0.5) * 0.4
      });
    }
    cloudParticlesRef.current = clouds;
  }, []);

  // Atmospheric Model Calculations
  const getAtmosphereAtAltitude = useCallback((h) => {
    const alt = Math.max(0, h);
    let temp = T0;
    let press = P0;

    if (alt < 11000) {
      // Troposphere: linear temperature lapse
      temp = T0 - 0.0065 * alt;
      press = P0 * Math.pow(temp / T0, 5.2561);
    } else if (alt < 20000) {
      // Lower Stratosphere / Tropopause: isothermal
      temp = 216.65;
      const p11k = P0 * Math.pow(216.65 / T0, 5.2561);
      press = p11k * Math.exp((-G * (alt - 11000)) / (R_AIR * 216.65));
    } else {
      // Mid/Upper Stratosphere: temperature rises due to ozone absorption
      temp = 216.65 + 0.001 * (alt - 20000);
      const p11k = P0 * Math.pow(216.65 / T0, 5.2561);
      const p20k = p11k * Math.exp((-G * 9000) / (R_AIR * 216.65));
      press = p20k * Math.pow(temp / 216.65, -34.163);
    }

    const density = press / (R_AIR * Math.max(150, temp));
    return { temp, press, density };
  }, []);

  // Physical calculations for Submarine
  const computeSubmarinePhysics = useCallback(() => {
    const V_hull = 6500; // m^3 total displacement
    const V_ballast_max = 1000; // m^3 total ballast capacity
    const dryMass = 5800000; // kg

    // Water density gradient with depth: rho(z) = 1025 * (1 + 4.5e-6 * depth)
    const rhoWater = 1025 * (1 + 0.0000045 * depth);

    // Ballast water volume & mass
    const waterVol = (ballastPct / 100) * V_ballast_max;
    const waterMass = waterVol * rhoWater;
    const totalMass = dryMass + waterMass;

    // Displaced volume
    // When submerged (depth > 0), displaced volume is full hull volume
    // Near surface (depth <= 0), submerged volume is restricted by waterline
    let subVol = V_hull;
    if (depth <= 2) {
      const floatVol = totalMass / rhoWater;
      subVol = Math.min(V_hull, Math.max(V_hull * 0.6, floatVol));
    }

    // Upthrust (Buoyancy Force)
    const upthrust = rhoWater * subVol * G; // Newtons
    // Weight Force
    const weight = totalMass * G; // Newtons

    // Hydrodynamic Dive Plane Lift
    // Lift = 0.5 * rho * v_forward^2 * Area_planes * sin(planeAngle)
    const planeRad = (planeAngle * Math.PI) / 180;
    const planeLift = 0.5 * rhoWater * Math.pow(subVx, 2) * 22 * Math.sin(planeRad);

    // Vertical drag: 0.5 * rho * C_d * A_cross * vz^2
    const dragZ = 0.5 * rhoWater * 1.1 * 45 * subVz * Math.abs(subVz);

    // Net vertical force: Upthrust is upwards (+), Weight is downwards (-), Lift is directed by plane
    const netVerticalForce = upthrust - weight + planeLift - dragZ;

    // Hydrostatic Pressure at depth
    const hydrostaticPressMPa = (101325 + rhoWater * G * depth) / 1e6;
    // Hull strain percentage: 0 to 100% (Crush limit at 600m ~ 6.13 MPa)
    const hullStrainPct = Math.min(100, (hydrostaticPressMPa / 6.15) * 100);

    return {
      mode: 'sub',
      depth,
      ballastPct,
      waterVol,
      waterMass,
      totalMass,
      rhoWater,
      upthrust,
      weight,
      planeLift,
      netForce: netVerticalForce,
      vz: subVz,
      vx: subVx,
      hydrostaticPressMPa,
      hullStrainPct,
      airReserve
    };
  }, [depth, ballastPct, planeAngle, subVx, subVz, airReserve]);

  // Physical calculations for Balloon
  const computeBalloonPhysics = useCallback(() => {
    const { temp, press, density: ambientDensity } = getAtmosphereAtAltitude(balloonAlt);
    const gasSpec = GAS_DATA[balloonGas] || GAS_DATA.helium;

    // Envelope latex mass (kg)
    const latexMass = 1.35;
    // Initial gas mass (kg)
    const gasMass = gasVolume0 * gasSpec.density0;
    const totalMass = gasMass + latexMass + payloadMass;

    // Boyle's & Charles' Law expansion: V(h) = V0 * (P0 / P(h)) * (T(h) / T0)
    let currentVolume = gasVolume0 * (P0 / Math.max(10, press)) * (temp / T0);
    // Diameter from spherical volume: V = (4/3) * pi * r^3
    let currentDiameter = 2 * Math.pow((3 * currentVolume) / (4 * Math.PI), 1 / 3);

    // Check burst condition
    const isBurst = hasBurst || currentDiameter >= burstDiameter;

    // Forces
    let upthrust = 0;
    let netForce = 0;
    const weight = totalMass * G;

    if (!isBurst) {
      upthrust = ambientDensity * currentVolume * G;
      const crossArea = (Math.PI * Math.pow(currentDiameter, 2)) / 4;
      const drag = 0.5 * ambientDensity * 0.44 * crossArea * balloonVy * Math.abs(balloonVy);
      netForce = upthrust - weight - drag;
    } else {
      // Parachute descent
      // Descending mass: payload + parachute remnants
      const descentMass = payloadMass + 0.45;
      const chuteArea = 2.2; // m^2
      const dragChute = 0.5 * ambientDensity * 1.45 * chuteArea * Math.pow(balloonVy, 2);
      upthrust = 0; // envelope shredded
      netForce = -(descentMass * G) + dragChute;
    }

    return {
      mode: 'balloon',
      altitude: balloonAlt,
      vy: balloonVy,
      tempK: temp,
      tempC: temp - 273.15,
      pressureKPa: press / 1000,
      ambientDensity,
      volume: currentVolume,
      diameter: currentDiameter,
      isBurst,
      upthrust,
      weight,
      netForce,
      totalMass
    };
  }, [balloonAlt, balloonGas, gasVolume0, payloadMass, burstDiameter, balloonVy, hasBurst, getAtmosphereAtAltitude]);

  // Telemetry updates
  useEffect(() => {
    if (onTelemetry) {
      if (mode === 'sub') {
        onTelemetry(computeSubmarinePhysics());
      } else {
        onTelemetry(computeBalloonPhysics());
      }
    }
  }, [mode, depth, ballastPct, balloonAlt, subVz, balloonVy, computeSubmarinePhysics, computeBalloonPhysics, onTelemetry]);

  // Challenge evaluation loop
  useEffect(() => {
    if (!activeChallenge || challengeSuccess) return;
    const currentPhys = mode === 'sub' ? computeSubmarinePhysics() : computeBalloonPhysics();
    if (activeChallenge.check(currentPhys)) {
      setChallengeSuccess(true);
      setToastMessage(activeChallenge.congrats);
    }
  }, [activeChallenge, challengeSuccess, mode, depth, ballastPct, balloonAlt, subVz, balloonVy, computeSubmarinePhysics, computeBalloonPhysics]);

  // Main Simulation Physics Loop (RequestAnimationFrame)
  useEffect(() => {
    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = currentTime;

      if (isRunning) {
        if (mode === 'sub') {
          // 1. Valve flows & Air Blow
          if (floodValvesOpen) {
            // Seawater floods tanks, vents air out: +2.8% per second
            setBallastPct((prev) => Math.min(100, prev + 2.8 * dt));
          }
          if (airBlowActive && airReserve > 0) {
            // HP air blows water out of bottom Kingston ports: -5.5% per second
            setBallastPct((prev) => Math.max(0, prev - 5.5 * dt));
            setAirReserve((prev) => Math.max(0, prev - 3.2 * dt));
          }

          // 2. Submarine Velocity & Position Integrations
          const phys = computeSubmarinePhysics();
          // Added mass factor for water inertia ~ 1.2
          const effectiveMass = phys.totalMass * 1.25;
          const az = phys.netForce / effectiveMass;

          setSubVz((prevVz) => {
            let nextVz = prevVz + az * dt;
            // damping to avoid numerical oscillation
            nextVz *= 0.992;
            return nextVz;
          });

          // Forward propulsion speed
          const targetVx = (throttle / 100) * 16.0; // max ~16 m/s (~31 knots)
          setSubVx((prev) => prev + (targetVx - prev) * 0.8 * dt);

          // Update depth
          setDepth((prevDepth) => {
            let nextDepth = prevDepth + subVz * dt;
            if (nextDepth < 0) {
              nextDepth = 0;
              setSubVz((vz) => Math.max(0, vz * -0.2)); // gentle surface bounce
            }
            if (nextDepth > 580) {
              nextDepth = 580; // seabed contact
              setSubVz(0);
            }
            return nextDepth;
          });
        } else {
          // Mode 2: Weather Balloon
          const phys = computeBalloonPhysics();

          if (!hasBurst && phys.diameter >= burstDiameter) {
            setHasBurst(true);
            setParachuteDeployed(true);
            setToastMessage('Latex Envelope Ruptured at Burst Altitude! Parachute Deployed.');
          }

          if (!phys.isBurst) {
            // Ascending
            // Net lift acceleration
            const ay = phys.netForce / Math.max(0.5, phys.totalMass);
            setBalloonVy((prev) => {
              let next = prev + ay * dt;
              // Smooth terminal velocity convergence
              next = Math.max(-10, Math.min(12, next));
              return next;
            });
            setBalloonAlt((prev) => Math.max(0, prev + balloonVy * dt));
            setBalloonDiameter(phys.diameter);
          } else {
            // Descending via parachute
            const targetDescentSpeed = -Math.sqrt((2 * (payloadMass + 0.4) * G) / (1.45 * phys.ambientDensity * 2.2));
            setBalloonVy((prev) => prev + (targetDescentSpeed - prev) * 1.5 * dt);
            setBalloonAlt((prev) => {
              const next = prev + balloonVy * dt;
              if (next <= 0) {
                setBalloonVy(0);
                return 0;
              }
              return next;
            });
          }
        }
      }

      // Draw canvas
      drawSimulationCanvas();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    isRunning,
    mode,
    floodValvesOpen,
    airBlowActive,
    airReserve,
    throttle,
    subVz,
    balloonVy,
    hasBurst,
    burstDiameter,
    payloadMass,
    computeSubmarinePhysics,
    computeBalloonPhysics
  ]);

  // ==========================================
  // DYNAMIC HTML5 CANVAS RENDERING
  // ==========================================
  const drawSimulationCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    if (mode === 'sub') {
      // ----------------------------------------
      // RENDER SUBMARINE HYDROSTATIC ENVIRONMENT
      // ----------------------------------------
      const phys = computeSubmarinePhysics();

      // Background Ocean Depth Gradient
      // Surface is bright cyan-blue, deep ocean fades to midnight abyss
      const depthRatio = Math.min(1, depth / 550);
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, H);
      oceanGrad.addColorStop(0, `rgb(${Math.round(12 - depthRatio * 10)}, ${Math.round(55 - depthRatio * 45)}, ${Math.round(100 - depthRatio * 75)})`);
      oceanGrad.addColorStop(1, `rgb(${Math.round(4 - depthRatio * 3)}, ${Math.round(14 - depthRatio * 12)}, ${Math.round(32 - depthRatio * 25)})`);
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, W, H);

      // Sunlight Caustics rays near surface
      if (depth < 120) {
        const causticAlpha = Math.max(0, 1 - depth / 120) * 0.18;
        ctx.save();
        ctx.fillStyle = `rgba(180, 240, 255, ${causticAlpha})`;
        for (let i = 0; i < 7; i++) {
          ctx.beginPath();
          const xTop = (i * W) / 6 + Math.sin(Date.now() * 0.0015 + i) * 25;
          ctx.moveTo(xTop, 0);
          ctx.lineTo(xTop + 80, H);
          ctx.lineTo(xTop + 140, H);
          ctx.lineTo(xTop + 40, 0);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // Ocean Depth Grid & Horizon Lines
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let y = 50; y < H; y += 60) {
        ctx.beginPath();
        ctx.moveTo(60, y);
        ctx.lineTo(W - 20, y);
        ctx.stroke();
      }
      ctx.restore();

      // Depth Tape / Ruler on Left Margin
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(8, 8, 56, H - 16);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.strokeRect(8, 8, 56, H - 16);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      const rulerSteps = [0, 100, 200, 300, 400, 500, 600];
      rulerSteps.forEach((m) => {
        const yPos = 20 + (m / 600) * (H - 40);
        ctx.fillStyle = m >= 500 ? '#ef4444' : '#94a3b8';
        ctx.fillText(`${m}m`, 36, yPos + 3);
        ctx.beginPath();
        ctx.moveTo(52, yPos);
        ctx.lineTo(64, yPos);
        ctx.strokeStyle = m >= 500 ? '#ef4444' : 'rgba(255,255,255,0.3)';
        ctx.stroke();
      });

      // Active Depth Pointer Arrow on Depth Ruler
      const currentMarkerY = 20 + (depth / 600) * (H - 40);
      ctx.fillStyle = depth > 480 ? '#ef4444' : '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(68, currentMarkerY);
      ctx.lineTo(80, currentMarkerY - 6);
      ctx.lineTo(80, currentMarkerY + 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Floating Ambient Ocean Bubbles
      ctx.save();
      bubbleParticlesRef.current.forEach((b) => {
        b.y -= b.speed;
        if (b.y < 0) b.y = H + 10;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${b.opacity})`;
        ctx.fill();
      });
      ctx.restore();

      // Submarine Cutaway Rendering
      // Center position of submarine
      const subCenterX = W * 0.52;
      // Vertical placement responds slightly to depth with smooth centering
      const subCenterY = H * 0.48 + Math.sin(Date.now() * 0.001) * 3;
      const subL = 360;
      const subH = 75;

      ctx.save();
      ctx.translate(subCenterX, subCenterY);

      // Pitch tilt caused by dive planes & vertical speed
      const pitchRad = ((planeAngle * 0.35 + (subVz / 4) * 5) * Math.PI) / 180;
      ctx.rotate(pitchRad);

      // 1. Propeller Screws & Wake at Stern (left side)
      const sternX = -subL / 2;
      const screwSpinSpeed = Date.now() * 0.015 * (throttle / 20 + 0.1);
      ctx.save();
      ctx.translate(sternX - 12, 0);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-4, -6, 6, 12);
      ctx.fillStyle = '#94a3b8';
      // Spinning blades
      for (let b = 0; b < 4; b++) {
        const bladeAngle = screwSpinSpeed + (b * Math.PI) / 2;
        ctx.save();
        ctx.rotate(bladeAngle);
        ctx.beginPath();
        ctx.ellipse(0, 16, 5, 14, 0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#cbd5e1';
        ctx.fill();
        ctx.restore();
      }

      // Cavitation wake bubbles behind propeller
      if (throttle > 5) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (let k = 0; k < 6; k++) {
          const wakeX = -15 - (k * 18 + (Date.now() * 0.08) % 20);
          const wakeY = Math.sin(Date.now() * 0.01 + k) * 8;
          ctx.beginPath();
          ctx.arc(wakeX, wakeY, Math.random() * 3 + 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 2. Stern Rudders & Dive Planes
      ctx.save();
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      // Vertical rudder
      ctx.moveTo(sternX, -subH * 0.45);
      ctx.lineTo(sternX - 22, -subH * 0.65);
      ctx.lineTo(sternX - 16, -subH * 0.2);
      ctx.closePath();
      ctx.fill();
      // Horizontal stern plane tilting
      ctx.translate(sternX + 5, 0);
      ctx.rotate((-planeAngle * Math.PI) / 180);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-18, -4, 24, 8);
      ctx.restore();

      // 3. Outer Hull Double-Casing Outline (Streamlined teardrop hull)
      ctx.beginPath();
      ctx.moveTo(sternX, 0);
      // Top curve
      ctx.bezierCurveTo(sternX + 60, -subH * 0.52, subCenterX * 0.2, -subH * 0.52, subL / 2 - 40, -subH * 0.45);
      // Rounded bow nose
      ctx.bezierCurveTo(subL / 2, -subH * 0.35, subL / 2 + 15, subH * 0.35, subL / 2 - 40, subH * 0.45);
      // Bottom curve
      ctx.bezierCurveTo(subCenterX * 0.2, subH * 0.52, sternX + 60, subH * 0.52, sternX, 0);
      ctx.closePath();

      // Outer hull gradient & stroke
      const hullGrad = ctx.createLinearGradient(0, -subH * 0.5, 0, subH * 0.5);
      hullGrad.addColorStop(0, '#1e293b');
      hullGrad.addColorStop(0.5, '#0f172a');
      hullGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = hullGrad;
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // 4. Conning Tower / Sail & Periscope
      const sailX = 15;
      const sailW = 55;
      const sailH = 46;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sailX - sailW / 2, -subH * 0.48);
      ctx.lineTo(sailX - sailW * 0.35, -subH * 0.48 - sailH);
      ctx.lineTo(sailX + sailW * 0.35, -subH * 0.48 - sailH);
      ctx.lineTo(sailX + sailW / 2, -subH * 0.48);
      ctx.closePath();
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sail Dive Planes
      ctx.translate(sailX, -subH * 0.48 - sailH * 0.55);
      ctx.rotate((-planeAngle * Math.PI) / 180);
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(-16, -3, 32, 6);
      ctx.strokeStyle = '#bae6fd';
      ctx.strokeRect(-16, -3, 32, 6);
      ctx.restore();

      // Periscope & Snorkel Masts
      ctx.save();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sailX - 6, -subH * 0.48 - sailH);
      ctx.lineTo(sailX - 6, -subH * 0.48 - sailH - 22);
      ctx.moveTo(sailX + 8, -subH * 0.48 - sailH);
      ctx.lineTo(sailX + 8, -subH * 0.48 - sailH - 16);
      ctx.stroke();
      ctx.restore();

      // 5. INTERNAL CUTAWAY VIEW:
      // Inner Pressure Hull (Cylindrical titanium safe capsule)
      const pressHullW = 190;
      const pressHullH = subH * 0.65;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-pressHullW / 2 + 5, -pressHullH / 2, pressHullW, pressHullH, 18);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fill();
      ctx.strokeStyle = phys.hullStrainPct > 75 ? '#ef4444' : '#64748b';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner compartments inside pressure hull:
      // Control room, navigation console, reactor / battery bay
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(-15, -14, 30, 24);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-12, -10, 24, 10); // command bridge screen

      // High-Pressure Compressed Air Cylinders (Orange flasks inside pressure hull)
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.roundRect(-45, 6, 26, 12, 4);
      ctx.roundRect(-15, 6, 26, 12, 4);
      ctx.fill();
      ctx.strokeStyle = '#fdba74';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 6. MAIN BALLAST TANKS (MBT):
      // Forward MBT (Right) and Aft MBT (Left)
      const tankW = 68;
      const tankH = subH * 0.72;
      const aftTankX = -subL / 2 + 65;
      const fwdTankX = subL / 2 - 120;

      const renderBallastTank = (xPos, label) => {
        ctx.save();
        ctx.translate(xPos, 0);

        // Tank casing outline
        ctx.beginPath();
        ctx.roundRect(0, -tankH / 2, tankW, tankH, 8);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fill();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Water fill level inside tank
        const fillFraction = ballastPct / 100;
        const waterHeight = tankH * fillFraction;
        const waterTopY = tankH / 2 - waterHeight;

        // Draw water inside tank
        if (waterHeight > 2) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(1, waterTopY, tankW - 2, waterHeight - 1, [0, 0, 7, 7]);
          ctx.clip();

          const waterGrad = ctx.createLinearGradient(0, waterTopY, 0, tankH / 2);
          waterGrad.addColorStop(0, '#0284c7');
          waterGrad.addColorStop(1, '#0369a1');
          ctx.fillStyle = waterGrad;
          ctx.fillRect(0, waterTopY, tankW, waterHeight);

          // Moving surface ripple
          ctx.strokeStyle = '#7dd3fc';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, waterTopY + Math.sin(Date.now() * 0.005) * 2);
          ctx.lineTo(tankW, waterTopY - Math.sin(Date.now() * 0.005) * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Air pocket label / remaining volume
        if (fillFraction < 0.95) {
          ctx.fillStyle = '#93c5fd';
          ctx.font = '9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('AIR POCKET', tankW / 2, -tankH / 2 + 14);
        }

        // Top Vent Valve & Escaping Bubbles
        ctx.fillStyle = floodValvesOpen ? '#22c55e' : '#64748b';
        ctx.fillRect(tankW / 2 - 5, -tankH / 2 - 8, 10, 8);
        if (floodValvesOpen) {
          // Venting air stream rushing upwards
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          for (let v = 0; v < 4; v++) {
            const vY = -tankH / 2 - 12 - ((Date.now() * 0.06 + v * 8) % 30);
            const vX = tankW / 2 + Math.sin(vY * 0.2) * 3;
            ctx.beginPath();
            ctx.arc(vX, vY, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Bottom Kingston Flood Port & HP Blow Ejection
        ctx.fillStyle = airBlowActive ? '#f97316' : floodValvesOpen ? '#38bdf8' : '#64748b';
        ctx.fillRect(tankW / 2 - 6, tankH / 2, 12, 8);

        if (airBlowActive) {
          // High-pressure water plume blowing out through Kingston bottom ports!
          ctx.save();
          ctx.fillStyle = 'rgba(254, 215, 170, 0.75)';
          for (let p = 0; p < 6; p++) {
            const plumeY = tankH / 2 + 8 + ((Date.now() * 0.1 + p * 6) % 28);
            const spread = (plumeY - tankH / 2) * 0.5;
            ctx.beginPath();
            ctx.arc(tankW / 2 + (Math.random() - 0.5) * spread, plumeY, Math.random() * 3 + 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        } else if (floodValvesOpen && ballastPct < 99) {
          // Sea water flooding in from bottom
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(tankW / 2, tankH / 2 + 6);
          ctx.lineTo(tankW / 2, tankH / 2 - 10);
          ctx.stroke();
        }

        if (showCutawayLabels) {
          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(label, tankW / 2, 0);
          ctx.fillStyle = '#38bdf8';
          ctx.font = '10px monospace';
          ctx.fillText(`${ballastPct.toFixed(1)}%`, tankW / 2, 14);
        }

        ctx.restore();
      };

      renderBallastTank(aftTankX, 'AFT MBT');
      renderBallastTank(fwdTankX, 'FWD MBT');

      // 7. FORCE VECTORS OVERLAY (Free-Body Diagram)
      if (showVectors) {
        ctx.save();
        // Vectors drawn at center of buoyancy/gravity (x = 10, y = 0)
        const vOriginX = 10;
        const vOriginY = 0;

        // Upthrust Vector (Green, pointing up)
        // Scale: 1 MN = 6 pixels
        const uMag = (phys.upthrust / 1e6) * 5.8;
        ctx.strokeStyle = '#22c55e';
        ctx.fillStyle = '#22c55e';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(vOriginX, vOriginY);
        ctx.lineTo(vOriginX, vOriginY - uMag);
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(vOriginX - 6, vOriginY - uMag + 8);
        ctx.lineTo(vOriginX, vOriginY - uMag);
        ctx.lineTo(vOriginX + 6, vOriginY - uMag + 8);
        ctx.fill();

        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`U = ${(phys.upthrust / 1e6).toFixed(2)} MN`, vOriginX + 10, vOriginY - uMag + 12);

        // Weight Vector (Orange/Red, pointing down)
        const wMag = (phys.weight / 1e6) * 5.8;
        ctx.strokeStyle = '#f97316';
        ctx.fillStyle = '#f97316';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(vOriginX, vOriginY);
        ctx.lineTo(vOriginX, vOriginY + wMag);
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(vOriginX - 6, vOriginY + wMag - 8);
        ctx.lineTo(vOriginX, vOriginY + wMag);
        ctx.lineTo(vOriginX + 6, vOriginY + wMag - 8);
        ctx.fill();

        ctx.fillText(`W = ${(phys.weight / 1e6).toFixed(2)} MN`, vOriginX + 10, vOriginY + wMag - 4);

        // Net Force Vector (Cyan / Pink)
        const netF = (phys.upthrust - phys.weight) / 1e6;
        if (Math.abs(netF) > 0.05) {
          const netMag = netF * 5.8;
          ctx.strokeStyle = netF > 0 ? '#38bdf8' : '#ec4899';
          ctx.fillStyle = netF > 0 ? '#38bdf8' : '#ec4899';
          ctx.lineWidth = 4;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          ctx.moveTo(vOriginX - 25, vOriginY);
          ctx.lineTo(vOriginX - 25, vOriginY - netMag);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'right';
          ctx.fillText(`F_net: ${netF > 0 ? '+' : ''}${netF.toFixed(2)} MN`, vOriginX - 32, vOriginY - netMag / 2);
        }

        ctx.restore();
      }

      ctx.restore(); // restore sub translate & rotate
    } else {
      // ----------------------------------------
      // RENDER WEATHER BALLOON ATMOSPHERE
      // ----------------------------------------
      const phys = computeBalloonPhysics();
      const gasSpec = GAS_DATA[balloonGas] || GAS_DATA.helium;

      // Dynamic Atmospheric Column Background
      // Altitude transitions: Sea level (bright blue) -> Troposphere (deep azure) -> Stratosphere (space black)
      const altRatio = Math.min(1, balloonAlt / 35000);
      const skyGrad = ctx.createLinearGradient(0, H, 0, 0);

      if (altRatio < 0.3) {
        // Sea level to mid-troposphere (~10km)
        skyGrad.addColorStop(0, '#38bdf8');
        skyGrad.addColorStop(1, '#0284c7');
      } else if (altRatio < 0.7) {
        // Upper troposphere to tropopause (~20km)
        skyGrad.addColorStop(0, '#0369a1');
        skyGrad.addColorStop(0.6, '#0f172a');
        skyGrad.addColorStop(1, '#020617');
      } else {
        // Stratosphere to edge of space (25km - 35km+)
        skyGrad.addColorStop(0, '#0c192e');
        skyGrad.addColorStop(0.3, '#030712');
        skyGrad.addColorStop(1, '#000000');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Distant Stars in Stratosphere
      if (balloonAlt > 14000) {
        const starAlpha = Math.min(1, (balloonAlt - 14000) / 10000);
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha * 0.8})`;
        for (let s = 0; s < 45; s++) {
          const sx = (s * 47) % W;
          const sy = (s * 31) % (H * 0.65);
          ctx.fillRect(sx, sy, (s % 2) + 1, (s % 2) + 1);
        }
        ctx.restore();
      }

      // Earth Limb Curvature in High Stratosphere
      if (balloonAlt > 22000) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(W / 2, H + 280, W * 0.85, 340, 0, Math.PI, 2 * Math.PI);
        const limbGrad = ctx.createLinearGradient(0, H - 60, 0, H);
        limbGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
        limbGrad.addColorStop(0.3, 'rgba(14, 116, 144, 0.6)');
        limbGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = limbGrad;
        ctx.fill();
        ctx.restore();
      }

      // Floating Cloud Layers (Troposphere: 1,500m to 11,000m)
      if (balloonAlt < 16000) {
        ctx.save();
        cloudParticlesRef.current.forEach((c) => {
          c.x += c.speed;
          if (c.x > W + 100) c.x = -150;
          if (c.x < -150) c.x = W + 100;

          // Compute relative y screen position based on balloon altitude
          const relAlt = c.alt - balloonAlt;
          const screenY = H * 0.5 - (relAlt / 1500) * 80;

          if (screenY > -50 && screenY < H + 50) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.beginPath();
            ctx.ellipse(c.x, screenY, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(c.x - c.w * 0.25, screenY - 6, c.w * 0.35, c.h * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.restore();
      }

      // Altitude Gauge Strip on Left
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(8, 8, 64, H - 16);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.strokeRect(8, 8, 64, H - 16);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      const altSteps = [0, 5000, 11000, 20000, 30000, 38000];
      const altLabels = ['0km', '5km', '11km', '20km', '30km', '38km'];
      altSteps.forEach((m, idx) => {
        const yPos = H - 20 - (m / 38000) * (H - 40);
        ctx.fillStyle = m === 11000 ? '#facc15' : m >= 30000 ? '#38bdf8' : '#94a3b8';
        ctx.fillText(altLabels[idx], 36, yPos + 3);
        ctx.beginPath();
        ctx.moveTo(60, yPos);
        ctx.lineTo(72, yPos);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.stroke();
      });

      // Layer Boundaries Names
      ctx.fillStyle = '#facc15';
      ctx.font = '8px sans-serif';
      ctx.fillText('TROPOPAUSE', 40, H - 20 - (11000 / 38000) * (H - 40) - 8);

      // Marker for Current Altitude
      const balloonMarkerY = H - 20 - (balloonAlt / 38000) * (H - 40);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(74, balloonMarkerY);
      ctx.lineTo(86, balloonMarkerY - 6);
      ctx.lineTo(86, balloonMarkerY + 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Balloon / Radiosonde Placement
      const bCenterX = W * 0.52;
      const bCenterY = H * 0.45;

      ctx.save();
      ctx.translate(bCenterX, bCenterY);

      if (!phys.isBurst) {
        // ENVELOPE DRAWING:
        // Envelope diameter expands visually on screen
        // Baseline scale: 2m diameter = 45px radius, 10m diameter = 135px radius
        const visualRadius = Math.max(30, Math.min(150, phys.diameter * 15.5));

        // Balloon shimmering latex gradient
        const envGrad = ctx.createRadialGradient(
          -visualRadius * 0.25,
          -visualRadius * 0.3,
          visualRadius * 0.1,
          0,
          0,
          visualRadius
        );
        envGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        envGrad.addColorStop(0.4, gasSpec.glow);
        envGrad.addColorStop(0.85, 'rgba(241, 245, 249, 0.55)');
        envGrad.addColorStop(1, 'rgba(148, 163, 184, 0.85)');

        ctx.beginPath();
        // As balloon ascends, shape evolves from teardrop to perfect sphere
        const teardropFactor = Math.max(0, 1 - balloonAlt / 12000);
        ctx.moveTo(0, visualRadius * 1.05);
        ctx.bezierCurveTo(
          -visualRadius * (0.9 + teardropFactor * 0.2),
          visualRadius * 0.7,
          -visualRadius * 1.08,
          -visualRadius * 0.85,
          0,
          -visualRadius * 1.08
        );
        ctx.bezierCurveTo(
          visualRadius * 1.08,
          -visualRadius * 0.85,
          visualRadius * (0.9 + teardropFactor * 0.2),
          visualRadius * 0.7,
          0,
          visualRadius * 1.05
        );
        ctx.closePath();

        ctx.fillStyle = envGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Balloon Neck & Tie Rigging
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(-6, visualRadius * 1.05);
        ctx.lineTo(6, visualRadius * 1.05);
        ctx.lineTo(3, visualRadius * 1.05 + 10);
        ctx.lineTo(-3, visualRadius * 1.05 + 10);
        ctx.closePath();
        ctx.fill();

        // Suspension Cords down to parachute & radiosonde
        const neckY = visualRadius * 1.05 + 10;
        const chutePackY = neckY + 25;
        const payloadY = chutePackY + 45;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, neckY);
        ctx.lineTo(0, chutePackY);
        ctx.lineTo(0, payloadY);
        ctx.stroke();

        // Stowed Parachute Pack (Bright safety orange)
        ctx.fillStyle = '#f97316';
        ctx.fillRect(-7, chutePackY - 5, 14, 10);
        ctx.strokeStyle = '#fdba74';
        ctx.strokeRect(-7, chutePackY - 5, 14, 10);

        // Radiosonde Instrument Package (White styrofoam cube with antenna & flashing LED)
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-11, payloadY, 22, 20);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-11, payloadY, 22, 20);

        // Sensor Boom & Telemetry Antenna
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, payloadY + 20);
        ctx.lineTo(0, payloadY + 36);
        ctx.stroke();

        // Blinking Transmit Beacon LED
        const ledBlink = Math.floor(Date.now() / 350) % 2 === 0;
        ctx.fillStyle = ledBlink ? '#ef4444' : '#7f1d1d';
        ctx.beginPath();
        ctx.arc(6, payloadY + 6, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Diameter readout indicator
        if (showCutawayLabels) {
          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`Ø ${phys.diameter.toFixed(2)} m`, 0, -visualRadius * 1.15);
          ctx.font = '9px sans-serif';
          ctx.fillStyle = '#7dd3fc';
          ctx.fillText(gasSpec.name, 0, 0);
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText(`Vol: ${phys.volume.toFixed(1)} m³`, 0, 14);
        }
      } else {
        // BURST & PARACHUTE DESCENT VIEW:
        // 1. Shredded Latex Debris fluttering away
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let d = 0; d < 8; d++) {
          const dX = Math.sin(Date.now() * 0.005 + d) * (40 + d * 15);
          const dY = -70 - ((Date.now() * 0.05 + d * 20) % 80);
          ctx.beginPath();
          ctx.arc(dX, dY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // 2. Open Parachute Canopy
        const chuteW = 85;
        const chuteH = 45;
        const chuteY = -40;

        ctx.save();
        ctx.beginPath();
        ctx.arc(0, chuteY, chuteW / 2, Math.PI, 2 * Math.PI);
        ctx.lineTo(chuteW / 2, chuteY);
        // Scalloped bottom edge
        ctx.bezierCurveTo(chuteW * 0.25, chuteY + 8, -chuteW * 0.25, chuteY + 8, -chuteW / 2, chuteY);
        ctx.closePath();

        const chuteGrad = ctx.createLinearGradient(-chuteW / 2, 0, chuteW / 2, 0);
        chuteGrad.addColorStop(0, '#ea580c');
        chuteGrad.addColorStop(0.5, '#fb923c');
        chuteGrad.addColorStop(1, '#ea580c');
        ctx.fillStyle = chuteGrad;
        ctx.fill();
        ctx.strokeStyle = '#ffedd5';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Parachute Shroud Lines
        const pPackY = 40;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1;
        [-chuteW / 2, -chuteW * 0.25, 0, chuteW * 0.25, chuteW / 2].forEach((lx) => {
          ctx.beginPath();
          ctx.moveTo(lx, chuteY);
          ctx.lineTo(0, pPackY);
          ctx.stroke();
        });

        // Radiosonde box hanging
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-11, pPackY, 22, 20);
        ctx.strokeRect(-11, pPackY, 22, 20);

        // Antenna
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(0, pPackY + 20);
        ctx.lineTo(0, pPackY + 36);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(6, pPackY + 6, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PARACHUTE DESCENT', 0, -chuteH - 15);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText(`Descent Rate: ${balloonVy.toFixed(1)} m/s`, 0, pPackY + 50);
        ctx.restore();
      }

      // Force Vectors for Balloon
      if (showVectors && !phys.isBurst) {
        ctx.save();
        const vOriginX = 0;
        const vOriginY = 40;

        // Upthrust Vector (Green)
        // Scale: 10 N = 12 px
        const uLen = Math.min(130, (phys.upthrust / 10) * 12);
        ctx.strokeStyle = '#22c55e';
        ctx.fillStyle = '#22c55e';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(vOriginX, vOriginY);
        ctx.lineTo(vOriginX, vOriginY - uLen);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(vOriginX - 6, vOriginY - uLen + 8);
        ctx.lineTo(vOriginX, vOriginY - uLen);
        ctx.lineTo(vOriginX + 6, vOriginY - uLen + 8);
        ctx.fill();
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`U = ${phys.upthrust.toFixed(1)} N`, vOriginX + 12, vOriginY - uLen + 10);

        // Weight Vector (Orange)
        const wLen = (phys.weight / 10) * 12;
        ctx.strokeStyle = '#f97316';
        ctx.fillStyle = '#f97316';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(vOriginX, vOriginY);
        ctx.lineTo(vOriginX, vOriginY + wLen);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(vOriginX - 6, vOriginY + wLen - 8);
        ctx.lineTo(vOriginX, vOriginY + wLen);
        ctx.lineTo(vOriginX + 6, vOriginY + wLen - 8);
        ctx.fill();
        ctx.fillText(`W = ${phys.weight.toFixed(1)} N`, vOriginX + 12, vOriginY + wLen - 2);

        // Net Lift
        const netLift = phys.upthrust - phys.weight;
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`F_lift: ${netLift > 0 ? '+' : ''}${netLift.toFixed(1)} N`, vOriginX - 16, vOriginY);

        ctx.restore();
      }

      ctx.restore();
    }
  }, [
    mode,
    depth,
    ballastPct,
    throttle,
    planeAngle,
    floodValvesOpen,
    airBlowActive,
    balloonAlt,
    balloonVy,
    balloonGas,
    burstDiameter,
    showVectors,
    showCutawayLabels,
    computeSubmarinePhysics,
    computeBalloonPhysics
  ]);

  // Handle Preset Selection
  const applyPreset = (preset) => {
    setMode(preset.mode);
    setIsRunning(true);
    setActiveChallenge(null);
    setChallengeSuccess(false);

    if (preset.mode === 'sub') {
      setBallastPct(preset.config.ballastPct);
      setDepth(preset.config.depth);
      setThrottle(preset.config.throttle);
      setPlaneAngle(preset.config.planeAngle);
      setFloodValvesOpen(preset.config.floodOpen);
      setAirBlowActive(preset.config.blowActive);
      setAirReserve(preset.config.airReserve);
      setSubVz(0);
    } else {
      setBalloonGas(preset.config.gasType);
      setGasVolume0(preset.config.gasVolume0);
      setPayloadMass(preset.config.payloadMass);
      setBurstDiameter(preset.config.burstDiameter);
      setBalloonAlt(preset.config.altitude);
      setBalloonVy(preset.config.altitude > 0 ? 5.2 : 0);
      setHasBurst(preset.config.hasBurst);
      setParachuteDeployed(false);
    }

    setToastMessage(`Loaded Preset: ${preset.name}`);
  };

  // Reset current mode
  const handleReset = () => {
    if (mode === 'sub') {
      setDepth(0);
      setBallastPct(0); // Surface floatation
      setThrottle(0);
      setPlaneAngle(0);
      setFloodValvesOpen(false);
      setAirBlowActive(false);
      setAirReserve(100);
      setSubVz(0);
      setSubVx(0);
    } else {
      setBalloonAlt(0);
      setBalloonVy(0);
      setHasBurst(false);
      setParachuteDeployed(false);
    }
    setChallengeSuccess(false);
  };

  // Emergency Blow Button handler
  const triggerEmergencyBlow = () => {
    setFloodValvesOpen(false);
    setAirBlowActive(true);
    setPlaneAngle(20);
    setThrottle(40);
    setToastMessage('EMERGENCY HP AIR BLOW ENGAGED! Water being purged from ballast tanks!');
  };

  const subPhys = computeSubmarinePhysics();
  const balloonPhys = computeBalloonPhysics();

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 md:p-6 font-sans">
      {/* ================= HEADER & MODE SWITCHER ================= */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-lg shadow-cyan-900/30">
              <Anchor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Submarine & Weather Balloon Aerostatic Buoyancy
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                  Archimedes & Boyle
                </span>
              </h1>
              <p className="text-xs md:text-sm text-slate-400">
                Hydrostatic marine ballast tanks vs stratospheric ideal gas envelope expansion
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons & Primary Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Dual-Mode Pill Switcher */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center shadow-inner">
            <button
              onClick={() => {
                setMode('sub');
                setChallengeSuccess(false);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                mode === 'sub'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Droplets className="w-4 h-4" />
              Mode 1: Submarine Ballast
            </button>
            <button
              onClick={() => {
                setMode('balloon');
                setChallengeSuccess(false);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                mode === 'balloon'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wind className="w-4 h-4" />
              Mode 2: Weather Balloon
            </button>
          </div>

          {/* Theory Modal Button */}
          <button
            onClick={() => setShowTheoryModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs md:text-sm font-medium transition"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            Theory & Formulas
          </button>
        </div>
      </header>

      {/* ================= PRESET SELECTOR & CHALLENGE BAR ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-4">
        {/* Presets List */}
        <div className="lg:col-span-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                p.mode === mode
                  ? 'bg-slate-900/90 text-slate-200 border-slate-700 hover:border-cyan-500 hover:bg-slate-800'
                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
            >
              <span className={p.mode === 'sub' ? 'text-cyan-400 mr-1' : 'text-amber-400 mr-1'}>
                {p.mode === 'sub' ? '⚓' : '🎈'}
              </span>
              {p.name}
            </button>
          ))}
        </div>

        {/* Guided Challenges Selector */}
        <div className="lg:col-span-4 flex items-center justify-start lg:justify-end gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" /> Challenge:
          </span>
          <select
            value={activeChallenge ? activeChallenge.id : ''}
            onChange={(e) => {
              const ch = CHALLENGES.find((c) => c.id === e.target.value);
              setActiveChallenge(ch || null);
              setChallengeSuccess(false);
              if (ch) {
                setMode(ch.mode);
                setToastMessage(`Started ${ch.title}. ${ch.hint}`);
              }
            }}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="">Select an Inquiry Challenge...</option>
            {CHALLENGES.map((c) => (
              <option key={c.id} value={c.id}>
                [{c.badge}] {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Challenge Alert & Toast Banner */}
      {activeChallenge && (
        <div
          className={`mb-4 p-3.5 rounded-2xl border flex items-start justify-between gap-3 transition-all ${
            challengeSuccess
              ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
              : 'bg-indigo-950/40 border-indigo-800/60 text-indigo-200'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {challengeSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs md:text-sm">{activeChallenge.title}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-black/40 border border-current">
                  {activeChallenge.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{activeChallenge.hint}</p>
              {challengeSuccess && (
                <p className="text-xs font-semibold text-emerald-300 mt-1.5">
                  🎉 {activeChallenge.congrats}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setActiveChallenge(null);
              setChallengeSuccess(false);
            }}
            className="text-xs text-slate-400 hover:text-white px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Success Toast */}
      {toastMessage && !activeChallenge && (
        <div className="mb-4 px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-200 text-xs flex items-center justify-between">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-cyan-400 hover:text-white ml-3">
            ✕
          </button>
        </div>
      )}

      {/* ================= MAIN INTERACTIVE WORKSPACE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* LEFT COLUMN: SIMULATION CANVAS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative bg-slate-900/90 rounded-3xl border border-slate-800 p-2 overflow-hidden shadow-2xl backdrop-blur-md">
            {/* Canvas Header Controls */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
              <button
                onClick={() => setShowVectors(!showVectors)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition ${
                  showVectors
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                }`}
                title="Toggle Force Vectors"
              >
                Force Vectors
              </button>
              <button
                onClick={() => setShowCutawayLabels(!showCutawayLabels)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition ${
                  showCutawayLabels
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                }`}
                title="Toggle Annotations"
              >
                Labels
              </button>
              <div className="h-4 w-px bg-slate-800" />
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
                title={isRunning ? 'Pause' : 'Play'}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
                title="Reset State"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Banner Watermark */}
            <div className="absolute top-4 left-5 z-10 pointer-events-none">
              <span className="text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-cyan-400">
                {mode === 'sub' ? '🌊 Hydrostatic Sea Water Ballast View' : '🎈 Atmospheric Aerostatic Column View'}
              </span>
            </div>

            {/* HTML5 Canvas */}
            <canvas
              ref={canvasRef}
              width={800}
              height={460}
              className="w-full h-[380px] sm:h-[440px] md:h-[480px] rounded-2xl bg-black block"
            />

            {/* Canvas Bottom Status Bar */}
            <div className="p-2.5 mt-2 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300">
              {mode === 'sub' ? (
                <>
                  <div className="flex items-center gap-4">
                    <span>
                      Depth: <strong className="text-cyan-400 font-mono">{subPhys.depth.toFixed(1)} m</strong>
                    </span>
                    <span>
                      V-Rate: <strong className="text-white font-mono">{subPhys.vz.toFixed(2)} m/s</strong>
                    </span>
                    <span>
                      Hull Strain: <strong className={`font-mono ${subPhys.hullStrainPct > 75 ? 'text-red-400' : 'text-emerald-400'}`}>{subPhys.hullStrainPct.toFixed(1)}%</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-mono">
                      State: {subPhys.vz < -0.1 ? 'Surfacing (Rising)' : subPhys.vz > 0.1 ? 'Submerging (Diving)' : 'Neutral Trim Hover'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <span>
                      Altitude: <strong className="text-amber-400 font-mono">{balloonPhys.altitude.toFixed(0)} m</strong>
                    </span>
                    <span>
                      Ascent Rate: <strong className="text-white font-mono">{balloonPhys.vy.toFixed(1)} m/s</strong>
                    </span>
                    <span>
                      Diameter: <strong className="text-cyan-400 font-mono">{balloonPhys.diameter.toFixed(2)} m</strong>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono">
                      Status: {balloonPhys.isBurst ? 'Parachute Descent' : 'Ascending to Burst'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* TELEMETRY DIGITAL GAUGES ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mode === 'sub' ? (
              <>
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" /> Upthrust (Buoyancy)
                  </span>
                  <div className="mt-1 text-lg font-bold font-mono text-emerald-400">
                    {(subPhys.upthrust / 1e6).toFixed(2)} <span className="text-xs text-slate-400">MN</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">U = ρ_water · V_disp · g</span>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <Anchor className="w-3.5 h-3.5 text-orange-400" /> Total Sub Weight
                  </span>
                  <div className="mt-1 text-lg font-bold font-mono text-orange-400">
                    {(subPhys.weight / 1e6).toFixed(2)} <span className="text-xs text-slate-400">MN</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Mass: {(subPhys.totalMass / 1e3).toFixed(0)} tons</span>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Hydrodynamic Lift
                  </span>
                  <div className="mt-1 text-lg font-bold font-mono text-cyan-300">
                    {(subPhys.planeLift / 1e3).toFixed(1)} <span className="text-xs text-slate-400">kN</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Planes @ {planeAngle}°</span>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-pink-400" /> Net Vertical Force
                  </span>
                  <div className={`mt-1 text-lg font-bold font-mono ${Math.abs(subPhys.netForce) < 80000 ? 'text-emerald-400' : 'text-pink-400'}`}>
                    {(subPhys.netForce / 1e3).toFixed(1)} <span className="text-xs text-slate-400">kN</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{Math.abs(subPhys.netForce) < 80000 ? 'Neutral Trim' : subPhys.netForce > 0 ? 'Net Upward' : 'Net Downward'}</span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" /> Ambient Pressure
                  </span>
                  <div className="mt-1 text-lg font-bold font-mono text-amber-400">
                    {balloonPhys.pressureKPa.toFixed(2)} <span className="text-xs text-slate-400">kPa</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Sea: 101.3 kPa</span>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-cyan-400" /> Air Density ρ(h)
                  </span>
                  <div className="mt-1 text-lg font-bold font-mono text-cyan-400">
                    {balloonPhys.ambientDensity.toFixed(4)} <span className="text-xs text-slate-400">kg/m³</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Decays exponentially</span>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" /> Envelope Volume
                  </span>
                  <div className="mt-1 text-lg font-bold font-mono text-purple-400">
                    {balloonPhys.volume.toFixed(1)} <span className="text-xs text-slate-400">m³</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Boyle's Law Exp.</span>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Net Aerostatic Lift
                  </span>
                  <div className="mt-1 text-lg font-bold font-mono text-emerald-400">
                    {(balloonPhys.upthrust - balloonPhys.weight).toFixed(1)} <span className="text-xs text-slate-400">N</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">U - (W_gas + W_load)</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE CONTROLS (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 shadow-xl flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                {mode === 'sub' ? 'Ballast & Navigation Console' : 'Sounding Balloon Controls'}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Interactive
              </span>
            </div>

            {mode === 'sub' ? (
              // ================= SUBMARINE CONTROLS =================
              <div className="space-y-4">
                {/* Emergency HP Blow & Flood Valves Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (floodValvesOpen) {
                        setFloodValvesOpen(false);
                      } else {
                        setFloodValvesOpen(true);
                        setAirBlowActive(false);
                      }
                    }}
                    className={`p-3 rounded-xl font-semibold text-xs border flex flex-col items-center justify-center gap-1 transition ${
                      floodValvesOpen
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/30'
                        : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <Droplets className="w-5 h-5" />
                    <span>{floodValvesOpen ? 'Close Flood Valves' : 'Open Flood Vents'}</span>
                    <span className="text-[9px] text-slate-400">Tanks flood with sea water</span>
                  </button>

                  <button
                    onClick={() => {
                      if (airBlowActive) {
                        setAirBlowActive(false);
                      } else {
                        triggerEmergencyBlow();
                      }
                    }}
                    disabled={airReserve <= 0}
                    className={`p-3 rounded-xl font-semibold text-xs border flex flex-col items-center justify-center gap-1 transition ${
                      airBlowActive
                        ? 'bg-amber-950 border-amber-500 text-amber-300 ring-2 ring-amber-500/40 animate-pulse'
                        : airReserve <= 0
                        ? 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                        : 'bg-gradient-to-br from-amber-900/30 to-red-900/30 border-amber-700/60 text-amber-200 hover:border-amber-500'
                    }`}
                  >
                    <Zap className="w-5 h-5" />
                    <span>{airBlowActive ? 'Cease Air Blow' : 'Emergency HP Blow'}</span>
                    <span className="text-[9px] text-slate-400">Purges ballast tanks with air</span>
                  </button>
                </div>

                {/* HP Compressed Air Flasks Reserve Indicator */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> HP Air Bank Reserve:
                    </span>
                    <span className="font-mono text-amber-400 font-bold">{airReserve.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all"
                      style={{ width: `${airReserve}%` }}
                    />
                  </div>
                  {airReserve < 30 && (
                    <button
                      onClick={() => setAirReserve(100)}
                      className="mt-2 text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Recharge Air Banks (300 bar)
                    </button>
                  )}
                </div>

                {/* Ballast Water Percentage Slider */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Ballast Tank Fill (MBT):
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">{ballastPct.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={ballastPct}
                    onChange={(e) => setBallastPct(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>0% (Surfaced)</span>
                    <span className="text-emerald-400 font-bold">~84.2% (Neutral Trim)</span>
                    <span>100% (Submerged Heavy)</span>
                  </div>
                </div>

                {/* Propulsion Throttle */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-blue-400" /> Engine Throttle (Screws):
                    </span>
                    <span className="font-mono text-blue-400 font-bold">{throttle}% ({subPhys.vx.toFixed(1)} m/s)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={throttle}
                    onChange={(e) => setThrottle(parseInt(e.target.value))}
                    className="w-full accent-blue-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Dive Plane Angle */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span className="flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-indigo-400" /> Hydrodynamic Dive Planes:
                    </span>
                    <span className="font-mono text-indigo-300 font-bold">{planeAngle > 0 ? `+${planeAngle}° (Rise)` : `${planeAngle}° (Dive)`}</span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    step="1"
                    value={planeAngle}
                    onChange={(e) => setPlaneAngle(parseInt(e.target.value))}
                    className="w-full accent-indigo-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>-25° (Diving Down)</span>
                    <span>0° (Horizontal)</span>
                    <span>+25° (Surfacing Up)</span>
                  </div>
                </div>

                {/* Depth Quick Override */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Direct Depth Placement:</span>
                    <span className="font-mono text-slate-400">{depth.toFixed(0)} m</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="550"
                    step="5"
                    value={depth}
                    onChange={(e) => {
                      setDepth(parseFloat(e.target.value));
                      setSubVz(0);
                    }}
                    className="w-full accent-slate-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              // ================= WEATHER BALLOON CONTROLS =================
              <div className="space-y-4">
                {/* Lifting Gas Selector */}
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1.5">
                    Lifting Gas Selection:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(GAS_DATA).map(([key, item]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setBalloonGas(key);
                          setHasBurst(false);
                        }}
                        className={`p-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-0.5 transition ${
                          balloonGas === key
                            ? 'bg-slate-800 border-cyan-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="font-bold">{item.formula}</span>
                        <span className="text-[10px] text-slate-400">{item.density0} kg/m³</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Initial Gas Volume Slider */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Launch Gas Volume (V₀):</span>
                    <span className="font-mono text-cyan-400 font-bold">{gasVolume0.toFixed(1)} m³</span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="12.0"
                    step="0.2"
                    value={gasVolume0}
                    onChange={(e) => {
                      setGasVolume0(parseFloat(e.target.value));
                      setHasBurst(false);
                    }}
                    className="w-full accent-cyan-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">Launch Diameter: {(2 * Math.pow((3 * gasVolume0) / (4 * Math.PI), 1 / 3)).toFixed(2)} m</span>
                </div>

                {/* Payload Mass Slider */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Radiosonde Payload Mass:</span>
                    <span className="font-mono text-amber-400 font-bold">{payloadMass.toFixed(2)} kg</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="5.0"
                    step="0.1"
                    value={payloadMass}
                    onChange={(e) => setPayloadMass(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">Sensors + GPS telemetry transmitter</span>
                </div>

                {/* Burst Envelope Rupture Limit */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Latex Max Burst Diameter:</span>
                    <span className="font-mono text-purple-400 font-bold">{burstDiameter.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="6.0"
                    max="12.0"
                    step="0.5"
                    value={burstDiameter}
                    onChange={(e) => {
                      setBurstDiameter(parseFloat(e.target.value));
                      if (balloonPhys.diameter < parseFloat(e.target.value)) {
                        setHasBurst(false);
                      }
                    }}
                    className="w-full accent-purple-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Balloon Action Buttons */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      if (balloonPhys.isBurst) {
                        setBalloonAlt(0);
                        setBalloonVy(5.2);
                        setHasBurst(false);
                        setParachuteDeployed(false);
                      } else {
                        setBalloonVy(5.5);
                        setIsRunning(true);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Wind className="w-4 h-4" />
                    {balloonPhys.isBurst ? 'Prepare New Sounding Launch' : 'Launch / Accelerate Ascent'}
                  </button>

                  <button
                    onClick={() => {
                      setHasBurst(true);
                      setParachuteDeployed(true);
                    }}
                    disabled={hasBurst}
                    className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-40"
                  >
                    Trigger Manual Envelope Rupture
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* QUICK COMPARISON CARD */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4 text-xs text-slate-400">
            <h3 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" /> Buoyancy Contrast Key
            </h3>
            <p className="leading-relaxed">
              <strong className="text-cyan-300">Submarine:</strong> Liquid water is virtually incompressible. To submerge or surface, the submarine must physically change its <em>total mass</em> by flooding or purging ballast tanks.
            </p>
            <p className="mt-2 leading-relaxed">
              <strong className="text-amber-300">Weather Balloon:</strong> Air is highly compressible. The balloon keeps a constant gas mass, but as ambient atmospheric pressure drops exponentially, its <em>volume expands</em> until latex burst limit.
            </p>
          </div>
        </div>
      </div>

      {/* ================= THEORY & FORMULA MODAL ================= */}
      {showTheoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-6 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Theoretical Foundation: Hydrostatic & Aerostatic Buoyancy
                  </h2>
                  <p className="text-xs text-slate-400">
                    Archimedes' Principle, Boyle's Law & Barometric Lapse Mechanics
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTheoryModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-xs md:text-sm text-slate-300 leading-relaxed">
              {/* 1. Archimedes' Principle */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <h3 className="font-bold text-cyan-400 text-sm mb-1.5 flex items-center gap-1.5">
                  1. Archimedes' Upthrust Principle
                </h3>
                <p>
                  Any object completely or partially submerged in a fluid experiences an upward buoyant force equal to the weight of fluid displaced by the body:
                </p>
                <div className="my-2 p-3 bg-slate-900 rounded-xl font-mono text-emerald-400 text-center text-sm border border-slate-800">
                  F_B = ρ_fluid · V_displaced · g
                </div>
                <p className="text-xs text-slate-400">
                  Where <code className="text-slate-200">ρ_fluid</code> is fluid density (kg/m³), <code className="text-slate-200">V_displaced</code> is submerged volume (m³), and <code className="text-slate-200">g</code> is gravitational acceleration (9.81 m/s²).
                </p>
              </div>

              {/* 2. Submarine Ballast Mechanics */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <h3 className="font-bold text-cyan-400 text-sm mb-1.5 flex items-center gap-1.5">
                  2. Submarine Trim & Ballast System
                </h3>
                <p>
                  Because seawater is virtually incompressible, a submarine’s outer hull volume remains constant. Motion is governed by adjusting submarine mass:
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2 text-xs text-slate-300">
                  <li>
                    <strong className="text-white">Surfaced:</strong> Ballast tanks are filled with air. Total mass is low, so <span className="text-emerald-400">Upthrust &gt; Weight</span>. The submarine rides high on the surface.
                  </li>
                  <li>
                    <strong className="text-white">Submerging:</strong> Kingston flood ports at the bottom and vent valves at the top open. Seawater rushes in while trapped air exhausts out until <span className="text-cyan-400">Weight = Upthrust</span> (Neutral Trim Hover).
                  </li>
                  <li>
                    <strong className="text-white">Surfacing (Emergency Blow):</strong> 300-bar high-pressure compressed air is injected into the tops of the ballast tanks, expelling seawater out the bottom ports and restoring immediate positive buoyancy.
                  </li>
                </ul>
              </div>

              {/* 3. Weather Balloon Aerostatics & Boyle's Law */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <h3 className="font-bold text-amber-400 text-sm mb-1.5 flex items-center gap-1.5">
                  3. Atmospheric Density Lapse & Balloon Expansion
                </h3>
                <p>
                  The Earth's atmosphere decays exponentially with altitude governed by the barometric formula:
                </p>
                <div className="my-2 p-3 bg-slate-900 rounded-xl font-mono text-amber-300 text-center text-sm border border-slate-800">
                  P(h) = P_0 · exp(-M_0 · g · h / (R · T))
                </div>
                <p>
                  As ambient air pressure <code className="text-slate-200">P(h)</code> plummets from 101.3 kPa at sea level to below 1.5 kPa in the stratosphere, the elastic latex balloon envelope expands according to Boyle's and Charles' Ideal Gas Laws:
                </p>
                <div className="my-2 p-3 bg-slate-900 rounded-xl font-mono text-cyan-300 text-center text-sm border border-slate-800">
                  V(h) = V_0 · (P_0 / P(h)) · (T(h) / T_0)
                </div>
                <p className="text-xs text-slate-400">
                  Remarkably, because both ambient air density <code className="text-slate-200">ρ(h)</code> decreases and balloon volume <code className="text-slate-200">V(h)</code> increases by reciprocal factors, the net upthrust <code className="text-slate-200">F_B = ρ(h) · V(h) · g</code> remains virtually constant throughout the entire climb until the latex reaches its rupture limit!
                </p>
              </div>

              {/* 4. Comparative Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-800/80 text-slate-200">
                    <tr>
                      <th className="p-2.5">Attribute</th>
                      <th className="p-2.5 text-cyan-400">Submarine (Hydrostatic)</th>
                      <th className="p-2.5 text-amber-400">Weather Balloon (Aerostatic)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950">
                    <tr>
                      <td className="p-2.5 font-semibold text-white">Fluid Medium</td>
                      <td className="p-2.5">Seawater (Incompressible, ~1025 kg/m³)</td>
                      <td className="p-2.5">Atmosphere (Compressible, 1.225 to 0.01 kg/m³)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-white">Control Mechanism</td>
                      <td className="p-2.5">Varies mass via ballast water volume</td>
                      <td className="p-2.5">Varies volume via ambient pressure drop</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-white">Equilibrium Condition</td>
                      <td className="p-2.5">M_sub = ρ_water · V_hull (Trim)</td>
                      <td className="p-2.5">Ascent speed where Drag = Net Lift</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-white">Failure / Limit</td>
                      <td className="p-2.5">Hull crush depth under hydrostatic pressure</td>
                      <td className="p-2.5">Latex envelope rupture at burst altitude</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowTheoryModal(false)}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition"
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
