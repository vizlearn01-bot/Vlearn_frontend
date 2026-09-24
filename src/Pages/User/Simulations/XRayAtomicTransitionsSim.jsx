import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  Sliders,
  Sparkles,
  Activity,
  Layers,
  Compass,
  Eye,
  BookOpen,
  Info,
  ChevronRight,
  Atom,
  Flame,
  Target,
  ShieldAlert,
  FastForward,
  Award,
  ArrowDownRight,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

// Physical Constants
const HC_KEV_NM = 1.239841984; // hc in keV * nm (approx 1.24 keV*nm or 1240 eV*nm)
const SPEED_OF_LIGHT = 3.0e8; // m/s

// Target Materials with exact Bohr shell binding energies (positive magnitudes)
const TARGET_MATERIALS = {
  tungsten: {
    id: 'tungsten',
    name: 'Tungsten (W)',
    symbol: 'W',
    Z: 74,
    color: '#38bdf8', // Cyan
    accentColor: 'rgb(56, 189, 248)',
    EK: 69.5, // keV (n=1)
    EL: 12.1, // keV (n=2)
    EM: 2.8,  // keV (n=3)
    kAlphaDeltaE: 57.4, // 69.5 - 12.1 keV
    kAlphaLambda: 0.0216, // nm (21.6 pm)
    kBetaDeltaE: 66.7, // 69.5 - 2.8 keV
    kBetaLambda: 0.0186, // nm (18.6 pm)
    thresholdKV: 69.5, // Minimum Va needed to excite K-series
    density: '19.3 g/cm³',
    meltingPoint: '3422 °C',
  },
  molybdenum: {
    id: 'molybdenum',
    name: 'Molybdenum (Mo)',
    symbol: 'Mo',
    Z: 42,
    color: '#c084fc', // Purple/Violet
    accentColor: 'rgb(192, 132, 252)',
    EK: 20.0, // keV
    EL: 2.5,  // keV
    EM: 0.5,  // keV
    kAlphaDeltaE: 17.5, // 20.0 - 2.5 keV
    kAlphaLambda: 0.0709, // nm (70.9 pm)
    kBetaDeltaE: 19.5, // 20.0 - 0.5 keV
    kBetaLambda: 0.0636, // nm (63.6 pm)
    thresholdKV: 20.0, // Minimum Va needed
    density: '10.28 g/cm³',
    meltingPoint: '2623 °C',
  },
};

// KCSE Exam Mastery Problems
const KCSE_PROBLEMS = [
  {
    id: 'kcse_duane_hunt',
    title: 'KCSE Problem 1: Duane-Hunt Minimum Cutoff Wavelength',
    question:
      'An X-ray tube operates at an accelerating potential Va = 60 kV. Taking hc/e ≈ 1.24 × 10⁻⁶ V·m (1240 V·nm = 1.24 keV·nm), calculate the minimum cutoff wavelength (λ_min) of the emitted continuous Bremsstrahlung X-rays in picometres (pm).',
    unit: 'pm',
    target: 20.7,
    tolerance: 0.8,
    hint: 'Use the Duane-Hunt law: hc / λ_min = e·Va ⟹ λ_min = hc / (e·Va). In convenient units: λ_min (nm) = 1.24 / Va(kV). Convert nm to pm by multiplying by 1000.',
    solutionSteps: [
      'State Duane-Hunt relationship: e·Va = h·ν_max = hc / λ_min',
      'Rearrange for λ_min: λ_min = hc / (e·Va)',
      'Substitute values: λ_min = 1.24 keV·nm / 60 keV = 0.02067 nm',
      'Convert to picometres: 0.02067 nm × 1000 pm/nm ≈ 20.7 pm',
      'Notice: λ_min depends strictly on the accelerating voltage Va and is independent of the target material!',
    ],
  },
  {
    id: 'kcse_k_alpha',
    title: 'KCSE Problem 2: Characteristic K_alpha Photon Energy',
    question:
      'In a tungsten target atom, the binding energy of an electron in the K-shell is 69.5 keV, while in the L-shell it is 12.1 keV. Calculate the energy of the emitted K_alpha characteristic X-ray photon in keV when an L-shell electron drops into a vacant K-shell.',
    unit: 'keV',
    target: 57.4,
    tolerance: 0.3,
    hint: 'Apply Bohr frequency condition: Energy of photon ΔE = E_K - E_L.',
    solutionSteps: [
      'Recall characteristic emission condition: ΔE = E_initial - E_final',
      'Binding energies: E_K = 69.5 keV (n=1), E_L = 12.1 keV (n=2)',
      'Calculate energy difference: ΔE = 69.5 keV - 12.1 keV = 57.4 keV',
      'This monochromatic energy transition yields a sharp spike on the X-ray spectrum at λ ≈ 0.0216 nm.',
    ],
  },
  {
    id: 'kcse_k_beta_lambda',
    title: 'KCSE Problem 3: Characteristic K_beta Wavelength in Molybdenum',
    question:
      'In a molybdenum target (Z=42), an electron jumps from the M-shell (binding energy 0.5 keV) to fill a K-shell vacancy (binding energy 20.0 keV). Determine the wavelength of the emitted K_beta photon in picometres (pm). (Use hc = 1.24 keV·nm).',
    unit: 'pm',
    target: 63.6,
    tolerance: 1.5,
    hint: 'First find photon energy ΔE = E_K - E_M = 20.0 - 0.5 = 19.5 keV. Then calculate λ = 1240 / 19.5 pm.',
    solutionSteps: [
      'Determine transition energy: ΔE = E_K - E_M = 20.0 keV - 0.5 keV = 19.5 keV',
      'Relate energy to wavelength: λ = hc / ΔE',
      'Calculate: λ = 1.24 keV·nm / 19.5 keV = 0.06359 nm',
      'Convert to picometres: 0.06359 × 1000 ≈ 63.6 pm',
      'Notice: Since ΔE for K_beta is higher than K_alpha, the K_beta wavelength is shorter (harder X-ray)!',
    ],
  },
  {
    id: 'kcse_threshold_v',
    title: 'KCSE Problem 4: Threshold Excitation Potential',
    question:
      'What is the minimum accelerating potential (in kV) required across a Coolidge X-ray tube with a tungsten target (E_K = 69.5 keV) for characteristic K-series lines to appear in the emission spectrum?',
    unit: 'kV',
    target: 69.5,
    tolerance: 0.5,
    hint: 'Bombarding electrons must possess kinetic energy at least equal to the K-shell binding energy to dislodge a K-shell electron: e·V_th ≥ E_K.',
    solutionSteps: [
      'State ionization condition: Electron Kinetic Energy KE ≥ Binding Energy E_K',
      'Substitute: e·Va ≥ 69.5 keV',
      'Therefore, minimum threshold potential V_th = 69.5 kV',
      'Important KCSE concept: If Va < 69.5 kV, only continuous Bremsstrahlung is produced; no K-lines will appear!',
    ],
  },
];

export default function XRayAtomicTransitionsSim({ config = {}, onTelemetry }) {
  // State
  const [selectedTarget, setSelectedTarget] = useState('tungsten');
  const [acceleratingKV, setAcceleratingKV] = useState(80); // 25 - 120 kV
  const [filamentCurrentMA, setFilamentCurrentMA] = useState(25); // 5 - 50 mA
  const [playbackSpeed, setPlaybackSpeed] = useState(0.4); // 0.1x to 1.0x
  const [isPlaying, setIsPlaying] = useState(true);
  const [continuousBeam, setContinuousBeam] = useState(false);
  const [activeTab, setActiveTab] = useState('sim'); // 'sim', 'energy_levels', 'kcse_quiz', 'theory'

  // 3D Camera Orientation State
  const [yaw, setYaw] = useState(0.4); // azimuth angle
  const [pitch, setPitch] = useState(0.35); // elevation angle
  const [zoom, setZoom] = useState(1.0);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Quiz State
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [quizInput, setQuizInput] = useState('');
  const [quizResult, setQuizResult] = useState(null); // 'correct', 'incorrect'
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Status & Telemetry Banner
  const [statusMessage, setStatusMessage] = useState(
    'Target atom stabilized. Fire projectile electron to dislodge K-shell electron or trigger Bremsstrahlung braking radiation.'
  );
  const [statusCategory, setStatusCategory] = useState('ready'); // 'ready', 'collision', 'transition', 'photon', 'brems'

  // Canvas Refs & Simulation Dynamics Engine
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const animTimeRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Current Target Info
  const target = TARGET_MATERIALS[selectedTarget];

  // Duane-Hunt Cutoff Wavelength: lambda_min = hc / (e * Va)
  const lambdaMinNM = HC_KEV_NM / acceleratingKV;
  const lambdaMinPM = (lambdaMinNM * 1000).toFixed(1);

  // Check if accelerating voltage is above the K-series threshold
  const canExciteKLines = acceleratingKV >= target.thresholdKV;

  // Active Simulation Events & Particle States
  const activeEventRef = useRef(null);
  const continuousTimerRef = useRef(0);

  // Particles: bound electrons, projectile electron, ejected electron, radiated photon wavepacket
  const simStateRef = useRef({
    orbitAngleK: 0,
    orbitAngleL: 0,
    orbitAngleM: 0,
    projectile: null,
    ejectedElectron: null,
    fallingElectron: null,
    photons: [],
    particles: [], // spark effects
    vacancyAura: null,
    spectrumFlash: null, // { type: 'k_alpha' | 'k_beta' | 'brems', intensity: 1.0 }
  });

  // Shell Geometry radii in 3D world coordinates
  const SHELL_RADII = {
    K: 70,
    L: 135,
    M: 200,
  };

  // 3D Projection Engine
  const project3D = useCallback((x, y, z, cx, cy, currentYaw, currentPitch, currentZoom) => {
    const cosY = Math.cos(currentYaw);
    const sinY = Math.sin(currentYaw);
    const cosP = Math.cos(currentPitch);
    const sinP = Math.sin(currentPitch);

    // Rotate around Y-axis (Yaw)
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    const y1 = y;

    // Rotate around X-axis (Pitch)
    const y2 = y1 * cosP - z1 * sinP;
    const z2 = y1 * sinP + z1 * cosP;
    const x2 = x1;

    // Perspective Projection
    const fov = 650;
    const pScale = (fov / (fov + z2)) * currentZoom;
    const screenX = cx + x2 * pScale;
    const screenY = cy - y2 * pScale;

    return {
      x: screenX,
      y: screenY,
      z: z2,
      scale: pScale,
    };
  }, []);

  // Trigger Event Handlers
  const triggerKShellKnockout = (transitionType = 'k_alpha') => {
    if (!canExciteKLines) {
      setStatusMessage(
        `Voltage Insufficient! Accelerating potential Va = ${acceleratingKV} kV is below ${target.name} threshold (${target.thresholdKV} kV). Projectile electron lacks energy to ionize K-shell!`
      );
      setStatusCategory('brems');
      activeEventRef.current = {
        type: 'subthreshold_scatter',
        progress: 0,
        duration: 2.2,
        transitionType,
      };
      return;
    }

    activeEventRef.current = {
      type: 'knockout',
      progress: 0,
      duration: 3.2,
      transitionType, // 'k_alpha' or 'k_beta'
    };

    setStatusMessage(
      `Accelerating bombarding cathode electron (Kinetic Energy = ${acceleratingKV} keV) towards inner K-shell...`
    );
    setStatusCategory('collision');

    if (onTelemetry) {
      onTelemetry('xray_event_triggered', {
        type: transitionType,
        target: target.name,
        acceleratingKV,
      });
    }
  };

  const triggerBremsstrahlung = (mode = 'glancing') => {
    activeEventRef.current = {
      type: 'bremsstrahlung',
      progress: 0,
      duration: 2.5,
      mode, // 'glancing' or 'headon'
    };

    if (mode === 'headon') {
      setStatusMessage(
        `Duane-Hunt Maximum Deceleration! Electron arrested in single collision with positive nucleus (+${target.Z}e). 100% of kinetic energy (${acceleratingKV} keV) converted to λ_min = ${lambdaMinPM} pm photon!`
      );
    } else {
      setStatusMessage(
        `Coulomb Braking: Projectile electron deflected near heavy nucleus (+${target.Z}e). Electrostatic deceleration radiates continuous Bremsstrahlung X-ray.`
      );
    }
    setStatusCategory('brems');

    if (onTelemetry) {
      onTelemetry('xray_event_triggered', {
        type: 'bremsstrahlung',
        mode,
        target: target.name,
        acceleratingKV,
      });
    }
  };

  const resetAtomState = () => {
    activeEventRef.current = null;
    simStateRef.current.projectile = null;
    simStateRef.current.ejectedElectron = null;
    simStateRef.current.fallingElectron = null;
    simStateRef.current.vacancyAura = null;
    simStateRef.current.photons = [];
    simStateRef.current.particles = [];
    simStateRef.current.spectrumFlash = null;
    setStatusMessage('Atom stabilized in ground state. Ready for projectile bombardment.');
    setStatusCategory('ready');
  };

  // Preset Views
  const setCameraPreset = (view) => {
    if (view === 'perspective') {
      setYaw(0.4);
      setPitch(0.35);
      setZoom(1.0);
    } else if (view === 'top') {
      setYaw(0);
      setPitch(Math.PI / 2 - 0.05);
      setZoom(0.95);
    } else if (view === 'side') {
      setYaw(Math.PI / 2);
      setPitch(0.05);
      setZoom(1.05);
    }
  };

  // Mouse / Touch Camera Orbit Controls
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setYaw((prev) => prev + dx * 0.008);
    setPitch((prev) => Math.max(-1.4, Math.min(1.4, prev - dy * 0.008)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.65, Math.min(1.55, prev - e.deltaY * 0.001)));
  };

  // Touch Support for Mobile / Tablet
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMousePosRef.current.x;
    const dy = e.touches[0].clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setYaw((prev) => prev + dx * 0.01);
    setPitch((prev) => Math.max(-1.4, Math.min(1.4, prev - dy * 0.01)));
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Physics Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = (now) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (isPlaying) {
        animTimeRef.current += dt * playbackSpeed;

        // Continuous Beam Auto-Fire Logic
        if (continuousBeam) {
          continuousTimerRef.current += dt * playbackSpeed;
          if (continuousTimerRef.current > 3.4 && !activeEventRef.current) {
            continuousTimerRef.current = 0;
            const rand = Math.random();
            if (canExciteKLines && rand < 0.45) {
              triggerKShellKnockout('k_alpha');
            } else if (canExciteKLines && rand < 0.7) {
              triggerKShellKnockout('k_beta');
            } else {
              triggerBremsstrahlung(rand < 0.85 ? 'glancing' : 'headon');
            }
          }
        }

        // Advance Bound Electrons Orbital Angles
        simStateRef.current.orbitAngleK += dt * playbackSpeed * 2.8;
        simStateRef.current.orbitAngleL += dt * playbackSpeed * 1.6;
        simStateRef.current.orbitAngleM += dt * playbackSpeed * 0.9;

        // Advance Active Simulation Event Progress
        if (activeEventRef.current) {
          const ev = activeEventRef.current;
          ev.progress += (dt * playbackSpeed) / ev.duration;

          // Event State Machine
          if (ev.type === 'knockout') {
            const t = ev.progress;

            // Target K-shell electron position at collision
            const targetKX = Math.cos(1.2) * SHELL_RADII.K;
            const targetKY = Math.sin(1.2) * SHELL_RADII.K * 0.4;
            const targetKZ = Math.sin(1.2) * SHELL_RADII.K * 0.9;

            if (t < 0.3) {
              // Phase 1: Projectile accelerating inwards from cathode (-340, 20, 0)
              const pRatio = t / 0.3;
              const startX = -320;
              const curX = startX + (targetKX - startX) * pRatio;
              const curY = 20 + (targetKY - 20) * pRatio;
              const curZ = targetKZ * pRatio;
              simStateRef.current.projectile = { x: curX, y: curY, z: curZ, active: true };
            } else if (t >= 0.3 && t < 0.35) {
              // Phase 2: Impact & Ionization Collision
              if (!simStateRef.current.vacancyAura) {
                simStateRef.current.vacancyAura = {
                  x: targetKX,
                  y: targetKY,
                  z: targetKZ,
                  active: true,
                };
                setStatusMessage(
                  `Ionization Collision! Inner K-shell electron dislodged. Cathode electron scattered. Unstable K-shell vacancy created!`
                );
                setStatusCategory('collision');

                // Generate impact shockwave sparkles
                for (let i = 0; i < 20; i++) {
                  const angle = (Math.PI * 2 * i) / 20;
                  simStateRef.current.particles.push({
                    x: targetKX,
                    y: targetKY,
                    z: targetKZ,
                    vx: Math.cos(angle) * (60 + Math.random() * 60),
                    vy: Math.sin(angle) * (60 + Math.random() * 60),
                    vz: (Math.random() - 0.5) * 60,
                    life: 1.0,
                    color: '#38bdf8',
                  });
                }
              }

              // Scatter projectile electron downwards-right
              const pScat = (t - 0.3) / 0.7;
              simStateRef.current.projectile = {
                x: targetKX + pScat * 240,
                y: targetKY - pScat * 180,
                z: targetKZ + pScat * 40,
                active: true,
              };

              // Eject K-shell electron upwards-right (photoelectron / ionized electron)
              simStateRef.current.ejectedElectron = {
                x: targetKX + pScat * 260,
                y: targetKY + pScat * 200,
                z: targetKZ - pScat * 60,
                active: true,
              };
            } else if (t >= 0.35 && t < 0.68) {
              // Phase 3: Downward Quantum Transition (L -> K or M -> K)
              const fromRadius = ev.transitionType === 'k_alpha' ? SHELL_RADII.L : SHELL_RADII.M;
              const transProgress = (t - 0.35) / (0.68 - 0.35);

              // Spiral transition from upper shell to K vacancy
              const startAngle = 2.5;
              const endAngle = 1.2;
              const curAngle = startAngle + (endAngle - startAngle) * transProgress;
              const curR = fromRadius + (SHELL_RADII.K - fromRadius) * transProgress;

              simStateRef.current.fallingElectron = {
                x: Math.cos(curAngle) * curR,
                y: Math.sin(curAngle) * curR * 0.4,
                z: Math.sin(curAngle) * curR * 0.9,
                shell: ev.transitionType === 'k_alpha' ? 'L' : 'M',
                active: true,
              };

              const labelTrans = ev.transitionType === 'k_alpha' ? 'L-shell (n=2)' : 'M-shell (n=3)';
              setStatusMessage(
                `Quantum Cascade: Outer ${labelTrans} electron cascading downward to fill inner K-shell vacancy...`
              );
              setStatusCategory('transition');

              // Keep projectile & ejected flying away
              const pScat = (t - 0.3) / 0.7;
              simStateRef.current.projectile = {
                x: targetKX + pScat * 240,
                y: targetKY - pScat * 180,
                z: targetKZ + pScat * 40,
                active: true,
              };
              simStateRef.current.ejectedElectron = {
                x: targetKX + pScat * 260,
                y: targetKY + pScat * 200,
                z: targetKZ - pScat * 60,
                active: true,
              };
            } else if (t >= 0.68 && t < 1.0) {
              // Phase 4: High-Energy Characteristic Photon Emission!
              if (simStateRef.current.fallingElectron) {
                simStateRef.current.fallingElectron = null;
                simStateRef.current.vacancyAura = null;

                const isAlpha = ev.transitionType === 'k_alpha';
                const deltaE = isAlpha ? target.kAlphaDeltaE : target.kBetaDeltaE;
                const lambda = isAlpha ? target.kAlphaLambda : target.kBetaLambda;
                const photonColor = isAlpha ? target.color : '#ec4899';

                // Launch Characteristic Photon Wave Packet
                simStateRef.current.photons.push({
                  x: targetKX,
                  y: targetKY,
                  z: targetKZ,
                  dirX: 0.707,
                  dirY: 0.707,
                  dirZ: 0.1,
                  energyKeV: deltaE,
                  lambdaNM: lambda,
                  type: isAlpha ? 'Kα' : 'Kβ',
                  color: photonColor,
                  progress: 0,
                  speed: 380,
                });

                // Spectrum Flash trigger
                simStateRef.current.spectrumFlash = {
                  type: isAlpha ? 'k_alpha' : 'k_beta',
                  intensity: 1.0,
                };

                setStatusMessage(
                  `Characteristic ${isAlpha ? 'Kα' : 'Kβ'} Photon Emitted! Energy ΔE = ${deltaE} keV | Wavelength λ = ${lambda} nm (${(
                    lambda * 1000
                  ).toFixed(1)} pm). Monochromatic line spectrum spike illuminated!`
                );
                setStatusCategory('photon');
              }

              // Advance photons
              simStateRef.current.photons.forEach((p) => {
                p.progress += (dt * playbackSpeed) / (1.0 - 0.68);
                p.x += p.dirX * p.speed * dt * playbackSpeed;
                p.y += p.dirY * p.speed * dt * playbackSpeed;
                p.z += p.dirZ * p.speed * dt * playbackSpeed;
              });
            } else {
              // Finished event
              activeEventRef.current = null;
              simStateRef.current.projectile = null;
              simStateRef.current.ejectedElectron = null;
              simStateRef.current.fallingElectron = null;
              simStateRef.current.vacancyAura = null;
            }
          } else if (ev.type === 'subthreshold_scatter') {
            // Rutherford elastic scattering without ionization
            const t = ev.progress;
            if (t < 0.5) {
              const pRatio = t / 0.5;
              const curX = -320 + pRatio * 250;
              const curY = 30 * (1 - pRatio * 0.4);
              simStateRef.current.projectile = { x: curX, y: curY, z: 0, active: true };
            } else if (t >= 0.5 && t < 1.0) {
              const pRatio = (t - 0.5) / 0.5;
              const curX = -70 + pRatio * 220;
              const curY = 18 - pRatio * 160;
              simStateRef.current.projectile = { x: curX, y: curY, z: 0, active: true };
            } else {
              activeEventRef.current = null;
              simStateRef.current.projectile = null;
            }
          } else if (ev.type === 'bremsstrahlung') {
            // Bremsstrahlung electrostatic deceleration by nucleus
            const t = ev.progress;
            const isHeadOn = ev.mode === 'headon';

            if (t < 0.4) {
              const pRatio = t / 0.4;
              const curX = -320 + pRatio * (isHeadOn ? 310 : 270);
              const curY = isHeadOn ? 0 : 40 * (1 - pRatio * 0.8);
              simStateRef.current.projectile = { x: curX, y: curY, z: 0, active: true };
            } else if (t >= 0.4 && t < 0.45) {
              // Bremsstrahlung emission instant
              if (!simStateRef.current.photons.length || simStateRef.current.photons[0].type !== 'Brems') {
                const energy = isHeadOn ? acceleratingKV : acceleratingKV * 0.65;
                const lambda = HC_KEV_NM / energy;

                simStateRef.current.photons.push({
                  x: isHeadOn ? -10 : -45,
                  y: isHeadOn ? 0 : 10,
                  z: 0,
                  dirX: isHeadOn ? 0.3 : 0.8,
                  dirY: isHeadOn ? 0.95 : 0.6,
                  dirZ: 0.1,
                  energyKeV: energy.toFixed(1),
                  lambdaNM: lambda.toFixed(4),
                  type: 'Brems',
                  color: isHeadOn ? '#f59e0b' : '#10b981',
                  progress: 0,
                  speed: 360,
                });

                simStateRef.current.spectrumFlash = {
                  type: isHeadOn ? 'brems_max' : 'brems_glance',
                  lambda,
                  intensity: 1.0,
                };
              }

              if (isHeadOn) {
                // Stopped dead!
                simStateRef.current.projectile = { x: -10, y: 0, z: 0, active: true };
              } else {
                simStateRef.current.projectile = { x: -45, y: 8, z: 0, active: true };
              }
            } else if (t >= 0.45 && t < 1.0) {
              if (!isHeadOn) {
                const pRatio = (t - 0.45) / 0.55;
                // Hyperbolic deflection away from nucleus
                const curX = -45 + pRatio * 240;
                const curY = 8 - pRatio * 180;
                simStateRef.current.projectile = { x: curX, y: curY, z: 0, active: true };
              } else {
                // Absorbed/drifting slowly into anode target
                simStateRef.current.projectile = { x: -10, y: 0, z: 0, active: true };
              }

              simStateRef.current.photons.forEach((p) => {
                p.x += p.dirX * p.speed * dt * playbackSpeed;
                p.y += p.dirY * p.speed * dt * playbackSpeed;
                p.z += p.dirZ * p.speed * dt * playbackSpeed;
              });
            } else {
              activeEventRef.current = null;
              simStateRef.current.projectile = null;
              simStateRef.current.photons = [];
            }
          }
        }

        // Fade Spectrum Flash
        if (simStateRef.current.spectrumFlash) {
          simStateRef.current.spectrumFlash.intensity -= dt * 0.8;
          if (simStateRef.current.spectrumFlash.intensity <= 0) {
            simStateRef.current.spectrumFlash = null;
          }
        }

        // Update Sparkle Particles
        for (let i = simStateRef.current.particles.length - 1; i >= 0; i--) {
          const p = simStateRef.current.particles[i];
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
          p.life -= dt * 1.5;
          if (p.life <= 0) {
            simStateRef.current.particles.splice(i, 1);
          }
        }
      }

      // Render 3D Scene
      drawCanvasScene(ctx, canvas);
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    isPlaying,
    playbackSpeed,
    continuousBeam,
    selectedTarget,
    acceleratingKV,
    filamentCurrentMA,
    canExciteKLines,
    yaw,
    pitch,
    zoom,
    project3D,
  ]);

  // Main 3D Canvas Rendering Routine
  const drawCanvasScene = (ctx, canvas) => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // Deep Space Quantum Background Gradient
    const bgGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, width * 0.8);
    bgGrad.addColorStop(0, '#0a0f1d');
    bgGrad.addColorStop(0.6, '#030712');
    bgGrad.addColorStop(1, '#02040a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Coordinate Grid in Background
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;
    const gridStep = 40;
    for (let gx = 0; gx < width; gx += gridStep) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }
    for (let gy = 0; gy < height; gy += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    // Cathode Direction Indicator (Left)
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, cy - 65, 48, 130);
    ctx.fillRect(16, cy - 65, 48, 130);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CATHODE', 40, cy - 25);
    ctx.fillText('FILAMENT', 40, cy - 10);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.fillText(`-${acceleratingKV} kV`, 40, cy + 15);
    ctx.fillText(`e⁻ Beam`, 40, cy + 30);
    ctx.restore();

    // Render 3D Orbital Rings (K, L, M Shells)
    const drawOrbitalRing = (radius, inclinationRad, label, energyKeV, colorHex) => {
      const segments = 72;
      const points = [];

      for (let i = 0; i <= segments; i++) {
        const theta = (Math.PI * 2 * i) / segments;
        const x = Math.cos(theta) * radius;
        // Incline the orbital plane for distinct 3D perspective
        const y = Math.sin(theta) * radius * Math.sin(inclinationRad);
        const z = Math.sin(theta) * radius * Math.cos(inclinationRad);

        const proj = project3D(x, y, z, cx, cy, yaw, pitch, zoom);
        points.push(proj);
      }

      ctx.save();
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        if (i === 0) ctx.moveTo(points[i].x, points[i].y);
        else ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Label on the ring (at rightmost point theta = 0)
      const labelProj = points[0];
      ctx.fillStyle = colorHex;
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${label} (-${energyKeV} keV)`, labelProj.x + 8, labelProj.y);
      ctx.restore();
    };

    // Draw concentric 3D elliptical shells with orbital inclinations
    drawOrbitalRing(SHELL_RADII.M, 0.45, 'M-Shell (n=3)', target.EM, 'rgba(168, 85, 247, 0.35)');
    drawOrbitalRing(SHELL_RADII.L, -0.35, 'L-Shell (n=2)', target.EL, 'rgba(56, 189, 248, 0.45)');
    drawOrbitalRing(SHELL_RADII.K, 0.2, 'K-Shell (n=1)', target.EK, 'rgba(245, 158, 11, 0.55)');

    // Render Heavy Positive Nucleus (+Ze)
    const nucleusProj = project3D(0, 0, 0, cx, cy, yaw, pitch, zoom);
    const nucRadius = 18 * nucleusProj.scale;

    // Nucleus Volumetric Glow
    const nucGlow = ctx.createRadialGradient(
      nucleusProj.x,
      nucleusProj.y,
      nucRadius * 0.2,
      nucleusProj.x,
      nucleusProj.y,
      nucRadius * 2.8
    );
    nucGlow.addColorStop(0, 'rgba(239, 68, 68, 0.85)');
    nucGlow.addColorStop(0.4, 'rgba(249, 115, 22, 0.45)');
    nucGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = nucGlow;
    ctx.beginPath();
    ctx.arc(nucleusProj.x, nucleusProj.y, nucRadius * 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Nucleus Proton/Neutron Cluster Spheres
    ctx.save();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(nucleusProj.x, nucleusProj.y, nucRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Nucleus text label
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(10, Math.round(11 * nucleusProj.scale))}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`+${target.Z}e`, nucleusProj.x, nucleusProj.y);
    ctx.font = `8px monospace`;
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`${target.symbol} Nucleus`, nucleusProj.x, nucleusProj.y + nucRadius + 12);
    ctx.restore();

    // Render Bound Orbiting Electrons
    const drawBoundElectron = (radius, inclinationRad, baseAngle, count, shellKey) => {
      for (let i = 0; i < count; i++) {
        // Skip target K-electron if ejected or during collision
        if (shellKey === 'K' && i === 0 && simStateRef.current.vacancyAura) {
          continue;
        }
        // Skip falling electron from L or M shell
        if (
          simStateRef.current.fallingElectron &&
          simStateRef.current.fallingElectron.shell === shellKey &&
          i === 2
        ) {
          continue;
        }

        const theta = baseAngle + (Math.PI * 2 * i) / count;
        const x = Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius * Math.sin(inclinationRad);
        const z = Math.sin(theta) * radius * Math.cos(inclinationRad);

        const proj = project3D(x, y, z, cx, cy, yaw, pitch, zoom);
        const eRadius = Math.max(3.5, 4.5 * proj.scale);

        // Electron Aura Glow
        const eGlow = ctx.createRadialGradient(proj.x, proj.y, 1, proj.x, proj.y, eRadius * 2.4);
        eGlow.addColorStop(0, '#38bdf8');
        eGlow.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)');
        eGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = eGlow;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, eRadius * 2.4, 0, Math.PI * 2);
        ctx.fill();

        // Electron Body
        ctx.fillStyle = '#67e8f9';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, eRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    // Draw electrons on shells: K (2 electrons), L (8 electrons), M (10 electrons)
    drawBoundElectron(SHELL_RADII.K, 0.2, simStateRef.current.orbitAngleK, 2, 'K');
    drawBoundElectron(SHELL_RADII.L, -0.35, simStateRef.current.orbitAngleL, 8, 'L');
    drawBoundElectron(SHELL_RADII.M, 0.45, simStateRef.current.orbitAngleM, 10, 'M');

    // Render Vacancy Aura if active
    if (simStateRef.current.vacancyAura) {
      const v = simStateRef.current.vacancyAura;
      const vProj = project3D(v.x, v.y, v.z, cx, cy, yaw, pitch, zoom);
      const pulse = 1 + 0.25 * Math.sin(animTimeRef.current * 12);

      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2 * pulse;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(vProj.x, vProj.y, 9 * vProj.scale * pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fill();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('VACANCY [K]', vProj.x, vProj.y - 14);
      ctx.restore();
    }

    // Render Falling Electron (Cascade Transition L -> K or M -> K)
    if (simStateRef.current.fallingElectron) {
      const fe = simStateRef.current.fallingElectron;
      const feProj = project3D(fe.x, fe.y, fe.z, cx, cy, yaw, pitch, zoom);

      ctx.save();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(feProj.x, feProj.y, 6 * feProj.scale, 0, Math.PI * 2);
      ctx.fillStyle = '#c084fc';
      ctx.fill();
      ctx.stroke();

      // Energy Drop Arrow Indicator
      ctx.fillStyle = '#e879f9';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`ΔE Quantum Drop (${fe.shell} → K)`, feProj.x + 12, feProj.y);
      ctx.restore();
    }

    // Render Projectile Electron
    if (simStateRef.current.projectile) {
      const pe = simStateRef.current.projectile;
      const peProj = project3D(pe.x, pe.y, pe.z, cx, cy, yaw, pitch, zoom);

      // Trail
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(peProj.x - 25, peProj.y);
      ctx.lineTo(peProj.x, peProj.y);
      ctx.stroke();

      // Glowing Sphere
      const peGlow = ctx.createRadialGradient(peProj.x, peProj.y, 1, peProj.x, peProj.y, 12);
      peGlow.addColorStop(0, '#38bdf8');
      peGlow.addColorStop(0.6, 'rgba(56, 189, 248, 0.4)');
      peGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = peGlow;
      ctx.beginPath();
      ctx.arc(peProj.x, peProj.y, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(peProj.x, peProj.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`e⁻ (${acceleratingKV} keV)`, peProj.x - 20, peProj.y - 12);
      ctx.restore();
    }

    // Render Ejected Ionized Electron
    if (simStateRef.current.ejectedElectron) {
      const ee = simStateRef.current.ejectedElectron;
      const eeProj = project3D(ee.x, ee.y, ee.z, cx, cy, yaw, pitch, zoom);

      ctx.save();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(eeProj.x, eeProj.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.stroke();

      ctx.font = '9px monospace';
      ctx.fillText('Ejected K e⁻ (Ionized)', eeProj.x + 8, eeProj.y);
      ctx.restore();
    }

    // Render Radiated X-Ray Photon Wave Packets
    simStateRef.current.photons.forEach((photon) => {
      const pProj = project3D(photon.x, photon.y, photon.z, cx, cy, yaw, pitch, zoom);

      ctx.save();
      const waveLength = 40;
      const amplitude = 12 * Math.sin(animTimeRef.current * 18);

      ctx.strokeStyle = photon.color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = photon.color;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      for (let w = -waveLength; w <= waveLength; w += 2) {
        const env = Math.exp(-Math.pow(w / 18, 2)); // Gaussian envelope
        const wx = pProj.x + w * photon.dirX - env * amplitude * photon.dirY;
        const wy = pProj.y + w * photon.dirY + env * amplitude * photon.dirX;
        if (w === -waveLength) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.stroke();

      // Circular radiating wavefronts
      ctx.strokeStyle = `${photon.color}55`;
      ctx.lineWidth = 1.5;
      for (let r = 8; r <= 28; r += 10) {
        ctx.beginPath();
        ctx.arc(pProj.x, pProj.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Photon Information Badge
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        `X-Ray Photon: ${photon.type} (E = ${photon.energyKeV} keV, λ = ${photon.lambdaNM} nm)`,
        pProj.x + 20,
        pProj.y - 10
      );
      ctx.restore();
    });

    // Render Collision Sparkle Particles
    simStateRef.current.particles.forEach((p) => {
      const proj = project3D(p.x, p.y, p.z, cx, cy, yaw, pitch, zoom);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 2.5 * proj.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    // 3D Compass & Orientation Indicator (Bottom-Left)
    ctx.save();
    const compassX = 50;
    const compassY = height - 50;
    const axisLen = 26;

    // X-Axis (Red)
    const px = project3D(axisLen, 0, 0, compassX, compassY, yaw, pitch, 1.0);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(compassX, compassY);
    ctx.lineTo(px.x, px.y);
    ctx.stroke();

    // Y-Axis (Green)
    const py = project3D(0, axisLen, 0, compassX, compassY, yaw, pitch, 1.0);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(compassX, compassY);
    ctx.lineTo(py.x, py.y);
    ctx.stroke();

    // Z-Axis (Blue)
    const pz = project3D(0, 0, axisLen, compassX, compassY, yaw, pitch, 1.0);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(compassX, compassY);
    ctx.lineTo(pz.x, pz.y);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('3D Camera Orbit', compassX, compassY + 32);
    ctx.restore();

    ctx.restore();
  };

  // Generate SVG Spectrum Data Points
  const spectrumGraphData = useMemo(() => {
    const graphW = 380;
    const graphH = 170;
    const originX = 40;
    const originY = graphH + 15;
    const maxLambda = 0.14; // nm domain: 0 to 0.14 nm (0 to 140 pm)

    const points = [];
    const minX = originX + (lambdaMinNM / maxLambda) * graphW;

    // Kramers continuous Bremsstrahlung distribution
    // I(lambda) ~ Z * (lambda / lambda_min - 1) / lambda^3
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const curLambda = lambdaMinNM + (i / steps) * (maxLambda - lambdaMinNM);
      const curX = originX + (curLambda / maxLambda) * graphW;

      if (curX > originX + graphW) break;

      const diff = curLambda - lambdaMinNM;
      const heightFrac = Math.exp(-diff / 0.032) * Math.pow(diff / 0.032, 1.2) * 2.8;
      const amp = (filamentCurrentMA / 25) * (target.Z / 74) * Math.pow(acceleratingKV / 80, 1.5);
      const curY = Math.max(15, originY - heightFrac * 95 * amp);

      points.push({ x: curX, y: curY, lambda: curLambda });
    }

    const linePath =
      points.length > 0
        ? `M ${minX.toFixed(1)},${originY} L ` +
          points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ') +
          ` L ${points[points.length - 1].x.toFixed(1)},${originY}`
        : '';

    // Characteristic Peaks X Positions
    const kAlphaX = originX + (target.kAlphaLambda / maxLambda) * graphW;
    const kBetaX = originX + (target.kBetaLambda / maxLambda) * graphW;

    return {
      graphW,
      graphH,
      originX,
      originY,
      maxLambda,
      minX,
      linePath,
      points,
      kAlphaX,
      kBetaX,
      kAlphaVisible: canExciteKLines && target.kAlphaLambda >= lambdaMinNM,
      kBetaVisible: canExciteKLines && target.kBetaLambda >= lambdaMinNM,
    };
  }, [lambdaMinNM, target, acceleratingKV, filamentCurrentMA, canExciteKLines]);

  // Handle Quiz Submission
  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const curProb = KCSE_PROBLEMS[selectedProblemIndex];
    const userVal = parseFloat(quizInput.trim());

    if (isNaN(userVal)) return;

    if (Math.abs(userVal - curProb.target) <= curProb.tolerance) {
      setQuizResult('correct');
      if (onTelemetry) {
        onTelemetry('xray_kcse_quiz_passed', {
          problemId: curProb.id,
          userVal,
          target: curProb.target,
        });
      }
    } else {
      setQuizResult('incorrect');
    }
  };

  const nextQuizProblem = () => {
    setSelectedProblemIndex((prev) => (prev + 1) % KCSE_PROBLEMS.length);
    setQuizInput('');
    setQuizResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-3xl p-4 sm:p-6 md:p-8 space-y-8 font-sans border border-slate-800 shadow-2xl">
      {/* Simulation Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
              <Atom className="w-3.5 h-3.5" /> KCSE Physics Form 4 • Topic 8: X-Rays
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Zap className="w-3.5 h-3.5" /> Quantum Transitions & Duane-Hunt Law
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            X-Ray Atomic Quantum Transitions & Spectral Synthesis
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            Investigate the dual mechanisms of X-ray generation: inner K-shell electron knockout causing sharp
            characteristic line spikes (K&alpha; & K&beta;), versus nuclear Coulomb deflection braking radiation
            (Bremsstrahlung) with the Duane-Hunt minimum cutoff wavelength (&lambda;<sub>min</sub> = hc / eV<sub>a</sub>).
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2 self-start lg:self-center">
          <button
            onClick={() => setContinuousBeam((prev) => !prev)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
              continuousBeam
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Toggle continuous cathode electron beam bombardment"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            {continuousBeam ? 'Beam Stream: Active' : 'Continuous Beam: Off'}
          </button>

          <button
            onClick={resetAtomState}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
            title="Reset atom to ground state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-Time Live Status Banner */}
      <div
        className={`flex items-start sm:items-center gap-3 p-4 rounded-2xl border text-xs sm:text-sm transition-all duration-300 ${
          statusCategory === 'photon'
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
            : statusCategory === 'transition'
            ? 'bg-purple-500/10 border-purple-500/40 text-purple-200'
            : statusCategory === 'collision'
            ? 'bg-sky-500/10 border-sky-500/40 text-sky-200'
            : statusCategory === 'brems'
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
            : 'bg-slate-900/80 border-slate-800 text-slate-300'
        }`}
      >
        <Sparkles
          className={`w-5 h-5 shrink-0 ${
            statusCategory === 'photon'
              ? 'text-amber-400 animate-spin'
              : statusCategory === 'transition'
              ? 'text-purple-400 animate-pulse'
              : 'text-sky-400'
          }`}
        />
        <div className="flex-1 font-mono leading-snug">
          <span className="font-bold uppercase tracking-wide mr-2 text-white">Status Telemetry:</span>
          {statusMessage}
        </div>
        {activeEventRef.current && (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 border border-slate-700 text-slate-200 shrink-0">
            Phase: {Math.round(activeEventRef.current.progress * 100)}%
          </span>
        )}
      </div>

      {/* Main Interactive Stage: 3D Quantum Viewport + Synchronized Live Spectrum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Atomic Bohr Orbital Visualizer (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
              <h3 className="text-sm font-bold tracking-wide uppercase text-slate-200">
                3D Target Atom Bohr Shell Dynamics ({target.name})
              </h3>
            </div>

            {/* Camera View Presets */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-mono text-[11px] mr-1">Camera:</span>
              <button
                onClick={() => setCameraPreset('perspective')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-mono text-[11px] border border-slate-700 transition"
              >
                3D Orbit
              </button>
              <button
                onClick={() => setCameraPreset('top')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-mono text-[11px] border border-slate-700 transition"
              >
                Top-Down
              </button>
              <button
                onClick={() => setCameraPreset('side')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-mono text-[11px] border border-slate-700 transition"
              >
                Side-On
              </button>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none border border-slate-800/80 bg-slate-950">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full h-full block"
            />

            {/* Canvas HUD Overlays */}
            <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1.5 text-[11px] font-mono">
              <div className="bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 shadow-md">
                Nucleus: <span className="text-red-400 font-bold">+{target.Z}e</span> ({target.symbol})
              </div>
              <div className="bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 shadow-md">
                Binding Energy: K: -{target.EK} keV | L: -{target.EL} keV | M: -{target.EM} keV
              </div>
              {!canExciteKLines && (
                <div className="bg-amber-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-600/50 text-amber-300 font-bold flex items-center gap-1.5 shadow-md">
                  <ShieldAlert className="w-3.5 h-3.5" /> Va &lt; {target.thresholdKV} kV (K-Series Inactive)
                </div>
              )}
            </div>

            <div className="absolute bottom-3 right-3 pointer-events-none text-[11px] font-mono bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-slate-800 text-slate-400">
              Drag to Rotate 3D • Scroll to Zoom ({zoom.toFixed(2)}x)
            </div>
          </div>

          {/* Quick Quantum Trigger Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              onClick={() => triggerKShellKnockout('k_alpha')}
              disabled={!!activeEventRef.current}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/40 text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
            >
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                <span>Fire K&alpha; (L &rarr; K)</span>
              </div>
              <span className="text-[10px] text-sky-400/80 font-mono mt-0.5">&Delta;E = {target.kAlphaDeltaE} keV</span>
            </button>

            <button
              onClick={() => triggerKShellKnockout('k_beta')}
              disabled={!!activeEventRef.current}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
            >
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>Fire K&beta; (M &rarr; K)</span>
              </div>
              <span className="text-[10px] text-purple-400/80 font-mono mt-0.5">&Delta;E = {target.kBetaDeltaE} keV</span>
            </button>

            <button
              onClick={() => triggerBremsstrahlung('glancing')}
              disabled={!!activeEventRef.current}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
            >
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Bremsstrahlung</span>
              </div>
              <span className="text-[10px] text-emerald-400/80 font-mono mt-0.5">Coulomb Braking</span>
            </button>

            <button
              onClick={() => triggerBremsstrahlung('headon')}
              disabled={!!activeEventRef.current}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
            >
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Duane-Hunt Max</span>
              </div>
              <span className="text-[10px] text-amber-400/80 font-mono mt-0.5">&lambda;<sub>min</sub> = {lambdaMinPM} pm</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live X-Ray Spectrum Graph & Energy Levels (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold tracking-wide uppercase text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Continuous vs Characteristic Spectra
            </h3>
            <span className="text-xs font-mono text-slate-400">&lambda;<sub>min</sub> = {lambdaMinPM} pm</span>
          </div>

          {/* SVG Scientific Spectrum Graph */}
          <div className="relative bg-slate-950 rounded-2xl p-2 sm:p-3 border border-slate-800/80 flex flex-col items-center">
            <svg
              viewBox="0 0 440 210"
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                {/* Bremsstrahlung Continuum Gradient */}
                <linearGradient id="bremsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.03" />
                </linearGradient>

                {/* Glow Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="40" y2="185" stroke="#334155" strokeWidth="1.5" />
              <line x1="40" y1="185" x2="420" y2="185" stroke="#334155" strokeWidth="1.5" />

              {/* Y-Axis Label */}
              <text
                x="-100"
                y="15"
                transform="rotate(-90)"
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                Relative Intensity I
              </text>

              {/* X-Axis Label */}
              <text x="230" y="202" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                Wavelength &lambda; (nm)
              </text>

              {/* X-Axis Ticks */}
              {[0.02, 0.04, 0.06, 0.08, 0.1, 0.12].map((tick) => {
                const tickX = 40 + (tick / 0.14) * 380;
                return (
                  <g key={tick}>
                    <line x1={tickX} y1="185" x2={tickX} y2="190" stroke="#475569" strokeWidth="1" />
                    <text x={tickX} y="199" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Bremsstrahlung Continuum Fill & Line */}
              {spectrumGraphData.linePath && (
                <>
                  <path
                    d={`${spectrumGraphData.linePath} Z`}
                    fill="url(#bremsGradient)"
                  />
                  <path
                    d={spectrumGraphData.linePath}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />
                </>
              )}

              {/* Duane-Hunt Minimum Cutoff Line */}
              <g>
                <line
                  x1={spectrumGraphData.minX}
                  y1="25"
                  x2={spectrumGraphData.minX}
                  y2="185"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <circle cx={spectrumGraphData.minX} cy="185" r="4" fill="#f59e0b" />
                <text
                  x={spectrumGraphData.minX}
                  y="20"
                  fill="#f59e0b"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  &lambda;_min ({lambdaMinPM} pm)
                </text>
              </g>

              {/* Characteristic K_alpha Spike */}
              {spectrumGraphData.kAlphaVisible && (
                <g className="transition-all">
                  {/* Glowing Vertical Spike */}
                  <line
                    x1={spectrumGraphData.kAlphaX}
                    y1="25"
                    x2={spectrumGraphData.kAlphaX}
                    y2="185"
                    stroke={target.color}
                    strokeWidth={
                      simStateRef.current.spectrumFlash && simStateRef.current.spectrumFlash.type === 'k_alpha'
                        ? '4'
                        : '2.5'
                    }
                    filter={
                      simStateRef.current.spectrumFlash && simStateRef.current.spectrumFlash.type === 'k_alpha'
                        ? 'url(#glow)'
                        : undefined
                    }
                  />
                  {/* Arrowhead / Marker */}
                  <polygon
                    points={`${spectrumGraphData.kAlphaX - 4},32 ${spectrumGraphData.kAlphaX + 4},32 ${
                      spectrumGraphData.kAlphaX
                    },24`}
                    fill={target.color}
                  />
                  <text
                    x={spectrumGraphData.kAlphaX}
                    y="18"
                    fill={target.color}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    K&alpha;
                  </text>
                </g>
              )}

              {/* Characteristic K_beta Spike */}
              {spectrumGraphData.kBetaVisible && (
                <g className="transition-all">
                  <line
                    x1={spectrumGraphData.kBetaX}
                    y1="50"
                    x2={spectrumGraphData.kBetaX}
                    y2="185"
                    stroke="#ec4899"
                    strokeWidth={
                      simStateRef.current.spectrumFlash && simStateRef.current.spectrumFlash.type === 'k_beta'
                        ? '4'
                        : '2'
                    }
                    filter={
                      simStateRef.current.spectrumFlash && simStateRef.current.spectrumFlash.type === 'k_beta'
                        ? 'url(#glow)'
                        : undefined
                    }
                  />
                  <polygon
                    points={`${spectrumGraphData.kBetaX - 3},56 ${spectrumGraphData.kBetaX + 3},56 ${
                      spectrumGraphData.kBetaX
                    },49`}
                    fill="#ec4899"
                  />
                  <text
                    x={spectrumGraphData.kBetaX}
                    y="44"
                    fill="#ec4899"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    K&beta;
                  </text>
                </g>
              )}

              {/* Flash Glow when Bremsstrahlung occurs */}
              {simStateRef.current.spectrumFlash &&
                simStateRef.current.spectrumFlash.type.startsWith('brems') && (
                  <circle
                    cx={spectrumGraphData.minX + 30}
                    cy="90"
                    r="16"
                    fill="rgba(16, 185, 129, 0.4)"
                    filter="url(#glow)"
                  />
                )}
            </svg>

            {/* Spectrum Explanatory Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 w-full pt-2 text-[11px] font-mono border-t border-slate-800/80 text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Duane-Hunt Limit (&lambda;<sub>min</sub> = hc / eV<sub>a</sub>)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span>K&alpha; Spike (L &rarr; K)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                <span>K&beta; Spike (M &rarr; K)</span>
              </div>
            </div>
          </div>

          {/* Bohr Quantum Energy Level Diagram */}
          <div className="bg-slate-950 rounded-2xl p-3 sm:p-4 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                Bohr Shell Energy Levels ({target.name})
              </span>
              <span className="text-[11px] font-mono text-slate-400">Ionization Level = 0 keV</span>
            </div>

            <div className="relative h-32 w-full bg-slate-900/60 rounded-xl p-2 border border-slate-800 flex flex-col justify-between font-mono text-xs">
              {/* Continuum Level n = inf */}
              <div className="flex items-center justify-between border-b border-dashed border-slate-600 pb-1 text-slate-400 text-[11px]">
                <span>E = 0 keV (Free Ionized State)</span>
                <span className="text-[10px] text-slate-500">n = &infin;</span>
              </div>

              {/* M Shell */}
              <div className="flex items-center justify-between border-b border-purple-500/40 pb-0.5 text-purple-300 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>M-Shell (n=3)</span>
                </div>
                <span>-{target.EM} keV</span>
              </div>

              {/* L Shell */}
              <div className="flex items-center justify-between border-b border-sky-500/50 pb-0.5 text-sky-300 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>L-Shell (n=2)</span>
                </div>
                <span>-{target.EL} keV</span>
              </div>

              {/* K Shell */}
              <div className="flex items-center justify-between border-b-2 border-amber-500/80 pb-0.5 text-amber-300 text-[11px] font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>K-Shell (n=1) [Innermost]</span>
                </div>
                <span>-{target.EK} keV</span>
              </div>

              {/* Superimposed Transition Indicator Pill */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-300 font-sans">
                <span>
                  K&alpha;: &Delta;E = {target.kAlphaDeltaE} keV (&lambda; = {target.kAlphaLambda} nm)
                </span>
                <span>
                  K&beta;: &Delta;E = {target.kBetaDeltaE} keV (&lambda; = {target.kBetaLambda} nm)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Physics Control Deck & Parameter Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-900/70 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        {/* Target Anode Material Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Atom className="w-3.5 h-3.5 text-sky-400" /> Target Anode Material
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setSelectedTarget('tungsten');
                resetAtomState();
              }}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition border text-left ${
                selectedTarget === 'tungsten'
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-md shadow-sky-500/10'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <div className="font-bold">Tungsten (W)</div>
              <div className="text-[10px] text-slate-400 font-mono">Z = 74 • E_K = 69.5 keV</div>
            </button>

            <button
              onClick={() => {
                setSelectedTarget('molybdenum');
                resetAtomState();
              }}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition border text-left ${
                selectedTarget === 'molybdenum'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-md shadow-purple-500/10'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <div className="font-bold">Molybdenum (Mo)</div>
              <div className="text-[10px] text-slate-400 font-mono">Z = 42 • E_K = 20.0 keV</div>
            </button>
          </div>
          <div className="text-[11px] text-slate-400 leading-tight">
            Tungsten is standard in diagnostic tubes; Molybdenum is used in mammography for soft tissue contrast.
          </div>
        </div>

        {/* Accelerating Potential Va Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Accelerating Voltage (V<sub>a</sub>)
            </label>
            <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              {acceleratingKV} kV
            </span>
          </div>
          <input
            type="range"
            min="25"
            max="120"
            step="1"
            value={acceleratingKV}
            onChange={(e) => setAcceleratingKV(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>25 kV (Soft X-Rays)</span>
            <span>Threshold: {target.thresholdKV} kV</span>
            <span>120 kV (Hard)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Controls beam hardness (penetrating power) and determines cutoff &lambda;<sub>min</sub> = {lambdaMinPM} pm.
          </p>
        </div>

        {/* Filament Current I_f Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-sky-400" /> Filament Current (I<sub>f</sub>)
            </label>
            <span className="font-mono text-xs font-bold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
              {filamentCurrentMA} mA
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="1"
            value={filamentCurrentMA}
            onChange={(e) => setFilamentCurrentMA(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>5 mA</span>
            <span>Current controls intensity</span>
            <span>50 mA</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Controls cathode thermionic emission rate (number of electrons/sec), affecting total X-ray beam intensity.
          </p>
        </div>

        {/* Slow-Motion Time Dilation & Playback */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FastForward className="w-3.5 h-3.5 text-purple-400" /> Slow-Motion Dilation
            </label>
            <span className="font-mono text-xs font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
              {playbackSpeed.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              {isPlaying ? 'Pause' : 'Resume'}
            </button>
            <span className="text-[10px] text-slate-400 font-mono">0.1x for step-by-step observation</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Educational Deep-Dive & KCSE Examination Mastery */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('sim')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${
            activeTab === 'sim'
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-sky-400" />
          Quantum Mechanism Guide
        </button>

        <button
          onClick={() => setActiveTab('kcse_quiz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${
            activeTab === 'kcse_quiz'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          KCSE Exam Mastery Challenge ({KCSE_PROBLEMS.length} Problems)
        </button>
      </div>

      {/* Tab 1: Quantum Mechanism Guide */}
      {activeTab === 'sim' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
          {/* Mechanism 1: Characteristic Radiation */}
          <div className="space-y-3 bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-sky-500/20">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <span className="p-1 rounded-md bg-sky-500/20">1</span>
              Mechanism 1: Characteristic X-Ray Line Emission
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When an incident high-speed cathode electron has kinetic energy greater than the inner shell binding energy
              (e·V<sub>a</sub> &ge; E<sub>K</sub>), it knocks an inner K-shell electron completely out of the atom
              (ionization).
            </p>
            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-sky-300 font-bold">Cascade Quantum Rules:</div>
              <div className="text-slate-300">
                &bull; <span className="text-sky-400">K&alpha; Transition:</span> L-shell (n=2) electron drops into K-shell:
                <br />
                <span className="text-slate-400 ml-3">
                  &Delta;E = E<sub>K</sub> - E<sub>L</sub> = {target.EK} - {target.EL} = {target.kAlphaDeltaE} keV
                </span>
                <br />
                <span className="text-slate-400 ml-3">
                  &lambda; = hc / &Delta;E = {target.kAlphaLambda} nm ({target.kAlphaLambda * 1000} pm)
                </span>
              </div>
              <div className="text-slate-300">
                &bull; <span className="text-pink-400">K&beta; Transition:</span> M-shell (n=3) electron drops into K-shell:
                <br />
                <span className="text-slate-400 ml-3">
                  &Delta;E = E<sub>K</sub> - E<sub>M</sub> = {target.EK} - {target.EM} = {target.kBetaDeltaE} keV
                </span>
                <br />
                <span className="text-slate-400 ml-3">
                  &lambda; = hc / &Delta;E = {target.kBetaLambda} nm ({target.kBetaLambda * 1000} pm)
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Key KCSE Principle: Because atomic energy levels are quantized and characteristic of the target element,
              these lines serve as an unmistakable elemental fingerprint (Moseley's Law).
            </p>
          </div>

          {/* Mechanism 2: Continuous Bremsstrahlung Radiation */}
          <div className="space-y-3 bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <span className="p-1 rounded-md bg-emerald-500/20">2</span>
              Mechanism 2: Continuous Bremsstrahlung (Braking Radiation)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When a fast projectile electron passes near the heavy, highly positive nucleus (+Ze), it experiences
              colossal electrostatic attraction and undergoes strong deceleration (braking). Classical & quantum
              electrodynamics dictate that decelerating charges radiate electromagnetic energy.
            </p>
            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-emerald-300 font-bold">Duane-Hunt Law of Minimum Wavelength:</div>
              <div className="text-slate-300 leading-relaxed">
                If the electron is brought to a complete stop in a single head-on collision, all its kinetic energy
                e·V<sub>a</sub> is converted into a single maximum-energy photon:
                <br />
                <span className="text-amber-400 font-bold ml-3">
                  hc / &lambda;<sub>min</sub> = e &middot; V<sub>a</sub> &rArr; &lambda;<sub>min</sub> = hc / (e &middot;
                  V<sub>a</sub>)
                </span>
              </div>
              <div className="text-slate-400">
                At current V<sub>a</sub> = {acceleratingKV} kV:
                <br />
                <span className="text-slate-300 ml-3">
                  &lambda;<sub>min</sub> = 1.24 / {acceleratingKV} = {lambdaMinNM.toFixed(4)} nm ({lambdaMinPM} pm)
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Crucial Exam Fact: &lambda;<sub>min</sub> depends exclusively on the accelerating potential V<sub>a</sub>. Changing
              the target material alters the overall intensity, but has zero effect on the cutoff wavelength!
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: KCSE Exam Mastery Challenge */}
      {activeTab === 'kcse_quiz' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                KCSE Question {selectedProblemIndex + 1} of {KCSE_PROBLEMS.length}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {KCSE_PROBLEMS[selectedProblemIndex].title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={nextQuizProblem}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed">
            {KCSE_PROBLEMS[selectedProblemIndex].question}
          </div>

          {/* Answer Input & Submission Form */}
          <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <input
                type="number"
                step="any"
                value={quizInput}
                onChange={(e) => {
                  setQuizInput(e.target.value);
                  setQuizResult(null);
                }}
                placeholder={`Enter value in ${KCSE_PROBLEMS[selectedProblemIndex].unit}...`}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-mono text-slate-400">
                {KCSE_PROBLEMS[selectedProblemIndex].unit}
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              Check Answer
            </button>

            <button
              type="button"
              onClick={() => setShowHint((h) => !h)}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              {showHint ? 'Hide Hint' : 'Hint'}
            </button>

            <button
              type="button"
              onClick={() => setShowSolution((s) => !s)}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              {showSolution ? 'Hide Working' : 'View Working'}
            </button>
          </form>

          {/* Feedback Banner */}
          {quizResult === 'correct' && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-mono">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>Correct! Your calculation aligns precisely with the KCSE physics marking scheme.</span>
            </div>
          )}

          {quizResult === 'incorrect' && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs sm:text-sm font-mono">
              <XCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>Incorrect value. Check your arithmetic or click &quot;Hint&quot; to review the formula.</span>
            </div>
          )}

          {/* Hint Card */}
          {showHint && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
              <span className="font-bold">Exam Hint: </span>
              {KCSE_PROBLEMS[selectedProblemIndex].hint}
            </div>
          )}

          {/* Full Step-by-Step KCSE Marking Scheme Solution */}
          {showSolution && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4" /> KCSE Step-by-Step Marking Scheme:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 leading-relaxed">
                {KCSE_PROBLEMS[selectedProblemIndex].solutionSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Footer Curriculum Attribution */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-800 pt-4 font-mono">
        <div>Kenya Certificate of Secondary Education (KCSE) • Physics Syllabus Form 4 (Topic 8: X-Rays)</div>
        <div className="flex items-center gap-2">
          <span>Tungsten Z=74</span>
          <span>&bull;</span>
          <span>Molybdenum Z=42</span>
          <span>&bull;</span>
          <span>Coolidge Tube Electrodynamics</span>
        </div>
      </div>
    </div>
  );
}
