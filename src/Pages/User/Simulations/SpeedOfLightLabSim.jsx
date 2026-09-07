import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sliders,
  Sparkles,
  Activity,
  Info,
  Compass,
  Eye,
  Layers,
  ChevronRight,
  Award,
  Globe,
  Sun,
  BookOpen,
  Gauge,
} from 'lucide-react';

// ============================================================================
// CONSTANTS & HISTORICAL PARAMETERS
// ============================================================================
const C_VACUUM = 299792458; // m/s (~3.0 x 10^8 m/s)
const AU_METERS = 1.495978707e11; // 1 AU in metres
const AU_KM = 149597870.7; // 1 AU in km
const JUPITER_ORBIT_AU = 5.2044; // Semi-major axis of Jupiter (AU)
const IO_PERIOD_HOURS = 42.459; // Io orbital period in hours (~1.769 days)

// Historical Presets for Fizeau's Toothed Wheel Experiment
const FIZEAU_PRESETS = [
  { label: 'At Rest (0 RPM)', rpm: 0, desc: 'Direct transmission through open tooth gap' },
  { label: 'First Eclipse (~724 RPM)', rpm: 724, desc: 'Light blocked by next tooth on return (c = 3.00×10⁸ m/s)' },
  { label: "Fizeau's 1849 Value (756 RPM)", rpm: 756, desc: "Historical result: c ≈ 3.13×10⁸ m/s (+4.5% error)" },
  { label: 'First Maxima (~1448 RPM)', rpm: 1448, desc: 'Light passes through subsequent gap (double speed)' },
  { label: 'Second Eclipse (~2172 RPM)', rpm: 2172, desc: 'Light blocked by second adjacent tooth' },
];

// Practice Problems (KCSE & Historical Physics)
const PRACTICE_PROBLEMS = [
  {
    id: 'fizeau_hist',
    title: "1. Fizeau's Original Toothed Wheel (1849)",
    prompt:
      "In Fizeau's 1849 experiment, the mirror was located in Suresnes at a distance D = 8.63 km (8,630 m) from the toothed wheel in Montmartre. The wheel had N = 720 teeth. Fizeau observed the first eclipse (extinction) of the light beam when the wheel rotated at 12.6 revolutions per second (rps). Calculate the speed of light c determined by Fizeau in ×10⁸ m/s.",
    unit: '× 10⁸ m/s',
    target: 3.13,
    tolerance: 0.08,
    hint: 'Use Fizeau’s first-eclipse equation: c = 4 · D · N · f. Make sure D is in metres and f is in rps (rev/s).',
    solutionSteps: [
      '1. Identify given values: D = 8,630 m, N = 720 teeth, f = 12.6 rps.',
      '2. Roundtrip distance for light: 2D = 2 × 8,630 m = 17,260 m.',
      '3. Angle between center of gap and center of next tooth: Δθ = π / N radians.',
      '4. Transit time: Δt = 2D / c.',
      '5. During Δt, wheel rotates through Δθ: ω · Δt = (2π f) · (2D / c) = π / N.',
      '6. Rearrange for c: c = 4 · D · N · f.',
      '7. Substitute values: c = 4 × 8,630 m × 720 × 12.6 s⁻¹ = 312,987,840 m/s ≈ 3.13 × 10⁸ m/s.',
    ],
  },
  {
    id: 'fizeau_lab_f',
    title: '2. Required Wheel Frequency for Lab Apparatus',
    prompt:
      'A university physics laboratory sets up a Fizeau toothed wheel apparatus with N = 500 teeth and a corner-cube retroreflector placed at distance D = 12.0 km (12,000 m). Assuming the true speed of light c = 3.00 × 10⁸ m/s, calculate the rotational frequency f in revolutions per second (rev/s) at which the first extinction occurs.',
    unit: 'rev/s',
    target: 12.5,
    tolerance: 0.4,
    hint: 'Rearrange c = 4 · D · N · f to solve for f: f = c / (4 · D · N).',
    solutionSteps: [
      '1. Formula: c = 4 · D · N · f  ⟹  f = c / (4 · D · N).',
      '2. Substitute given values: c = 3.00 × 10⁸ m/s, D = 12,000 m, N = 500 teeth.',
      '3. Denominator: 4 × 12,000 m × 500 = 24,000,000 m = 2.40 × 10⁷ m.',
      '4. Solve: f = (3.00 × 10⁸ m/s) / (2.40 × 10⁷ m) = 12.5 rev/s (or 750 RPM).',
    ],
  },
  {
    id: 'romer_delay',
    title: "3. Rømer's Astronomical Diameter Delay (1676)",
    prompt:
      "Ole Rømer tracked the eclipses of Jupiter's moon Io over 6 months as Earth traveled from opposition (closest to Jupiter) to conjunction (opposite side of the Sun). The extra distance light had to travel was Earth's orbital diameter, approximately 3.00 × 10⁸ km (3.00 × 10¹¹ m). If the observed cumulative delay in Io's eclipse was 16.6 minutes (996 seconds), calculate the speed of light c in ×10⁸ m/s.",
    unit: '× 10⁸ m/s',
    target: 3.01,
    tolerance: 0.1,
    hint: 'Light travel delay across diameter: Δt = (2 · R_Earth) / c  ⟹  c = (2 · R_Earth) / Δt. Convert 16.6 minutes to seconds.',
    solutionSteps: [
      '1. Diameter of Earth’s orbit: d = 2 · R_Earth = 3.00 × 10¹¹ m.',
      '2. Time delay in seconds: Δt = 16.6 min × 60 s/min = 996 s (historically estimated ~1000 s).',
      '3. Speed of light equation: c = d / Δt.',
      '4. Substitute: c = (3.00 × 10¹¹ m) / (996 s) ≈ 3.01 × 10⁸ m/s (approx 3.0 × 10⁸ m/s).',
    ],
  },
  {
    id: 'spectral_band',
    title: '4. Spectral Band Frequency from Speed of Light',
    prompt:
      'Using the experimental speed of light c = 3.00 × 10⁸ m/s, determine the frequency in Terahertz (THz, where 1 THz = 10¹² Hz) of an infrared thermal radiation beam with wavelength λ = 15.0 μm (1.50 × 10⁻⁵ m).',
    unit: 'THz',
    target: 20.0,
    tolerance: 0.6,
    hint: 'Use the fundamental wave equation: c = f · λ  ⟹  f = c / λ. Convert the resulting frequency in Hz to THz by dividing by 10¹².',
    solutionSteps: [
      '1. Fundamental wave equation: c = f · λ.',
      '2. Rearrange for frequency: f = c / λ.',
      '3. Convert wavelength: λ = 15.0 μm = 1.50 × 10⁻⁵ m.',
      '4. Substitute: f = (3.00 × 10⁸ m/s) / (1.50 × 10⁻⁵ m) = 2.00 × 10¹³ Hz.',
      '5. Convert to THz: (2.00 × 10¹³ Hz) / (10¹² Hz/THz) = 20.0 THz.',
    ],
  },
];

// Historical milestones
const HISTORICAL_TIMELINE = [
  { year: '1676', scientist: 'Ole Rømer', method: "Jupiter's Moon Io Eclipses", value: '~2.2 × 10⁸ m/s', significance: 'First quantitative proof that light speed is finite.' },
  { year: '1729', scientist: 'James Bradley', method: 'Stellar Aberration', value: '3.01 × 10⁸ m/s', significance: 'Confirmed finite speed of light via Earth orbital motion.' },
  { year: '1849', scientist: 'Hippolyte Fizeau', method: 'Rotating Toothed Wheel', value: '3.13 × 10⁸ m/s', significance: 'First purely terrestrial, lab-scale speed measurement.' },
  { year: '1862', scientist: 'Léon Foucault', method: 'Rotating Mirror', value: '2.98 × 10⁸ m/s', significance: 'Proved light moves slower in water than air, validating wave theory.' },
  { year: '1983', scientist: 'CGPM 17th Conf.', method: 'Laser Interferometry', value: '299,792,458 m/s (Exact)', significance: 'Speed of light defined as a fundamental constant, defining the metre.' },
];

export default function SpeedOfLightLabSim({ config = {}, onTelemetry }) {
  // Navigation
  const [activeTab, setActiveTab] = useState('fizeau'); // 'fizeau' | 'romer' | 'practice'

  // ==========================================================================
  // FIZEAU EXPERIMENT STATE
  // ==========================================================================
  const [fizeauRpm, setFizeauRpm] = useState(0); // 0 to 2500 RPM
  const [fizeauDistanceKm, setFizeauDistanceKm] = useState(8.633); // km (Fizeau's 8.633 km)
  const [fizeauTeeth, setFizeauTeeth] = useState(720); // Teeth count (720 historical)
  const [fizeauIsRunning, setFizeauIsRunning] = useState(true);
  const [fizeauLightOn, setFizeauLightOn] = useState(true);
  const [fizeauShowPulses, setFizeauShowPulses] = useState(true);

  // Ref for canvas animations
  const fizeauCanvasRef = useRef(null);
  const fizeauAnimFrameRef = useRef(null);
  const fizeauPulseProgressRef = useRef(0);
  const fizeauWheelAngleRef = useRef(0);

  // ==========================================================================
  // RØMER EXPERIMENT STATE
  // ==========================================================================
  const [romerMonth, setRomerMonth] = useState(0); // 0 to 12 (Jan to Dec, 0 = opposition / closest)
  const [romerIsPlaying, setRomerIsPlaying] = useState(true);
  const [romerSpeed, setRomerSpeed] = useState(1); // 1x, 5x, 15x
  const romerCanvasRef = useRef(null);
  const romerAnimFrameRef = useRef(null);
  const romerIoAngleRef = useRef(0);

  // ==========================================================================
  // PRACTICE PROBLEMS STATE
  // ==========================================================================
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [userInputs, setUserInputs] = useState({});
  const [problemStatus, setProblemStatus] = useState({});
  const [showHintMap, setShowHintMap] = useState({});
  const [showSolutionMap, setShowSolutionMap] = useState({});

  // ==========================================================================
  // FIZEAU PHYSICS CALCULATIONS
  // ==========================================================================
  const fizeauPhysics = useMemo(() => {
    const D = fizeauDistanceKm * 1000; // metres
    const N = fizeauTeeth;
    const f = fizeauRpm / 60; // rps (rev/s)
    const omega = 2 * Math.PI * f; // rad/s

    // Roundtrip transit time
    const tRoundtrip = (2 * D) / C_VACUUM; // seconds (~57.6 microseconds)
    const tRoundtripMicro = tRoundtrip * 1e6; // in microseconds

    // Angle rotated by wheel during light's roundtrip
    const deltaTheta = omega * tRoundtrip; // radians

    // Angle of one slot (gap to tooth center) = pi / N
    const slotAngle = Math.PI / N;

    // Ratio of rotation to one slot shift: k = deltaTheta / slotAngle = 4*D*N*f / c
    const k = (4 * D * N * f) / C_VACUUM;

    // Historical First Eclipse Frequency & RPM
    const f1Theoretical = C_VACUUM / (4 * D * N);
    const rpm1Theoretical = f1Theoretical * 60;

    // Transmission intensity model: I/I0 = 0.5 * (1 + cos(pi * k))
    // When k is odd (1, 3, 5...): cos(pi) = -1 => I = 0 (Total Eclipse!)
    // When k is even (0, 2, 4...): cos(0) = 1 => I = 1.0 (Full Brightness!)
    let intensity = fizeauLightOn ? 0.5 * (1 + Math.cos(Math.PI * k)) : 0;
    if (intensity < 0.001) intensity = 0;

    // Calculate experimental speed of light assuming user is at first eclipse:
    // c_calc = 4 * D * N * f
    const cCalculated = 4 * D * N * f;
    const cErrorPct = fizeauRpm > 10 ? ((cCalculated - C_VACUUM) / C_VACUUM) * 100 : null;

    // Status label
    let eclipseState = 'normal'; // 'eclipsed' | 'partial' | 'normal'
    if (intensity < 0.08) {
      eclipseState = 'eclipsed';
    } else if (intensity < 0.7) {
      eclipseState = 'partial';
    }

    return {
      D,
      N,
      f,
      omega,
      tRoundtrip,
      tRoundtripMicro,
      deltaTheta,
      slotAngle,
      k,
      f1Theoretical,
      rpm1Theoretical,
      intensity,
      cCalculated,
      cErrorPct,
      eclipseState,
    };
  }, [fizeauRpm, fizeauDistanceKm, fizeauTeeth, fizeauLightOn]);

  // ==========================================================================
  // RØMER PHYSICS CALCULATIONS
  // ==========================================================================
  const romerPhysics = useMemo(() => {
    // Earth orbital angle (0 to 2pi). At month 0, Earth is closest (opposition)
    const earthTheta = (romerMonth / 12) * 2 * Math.PI;

    // Jupiter orbital angle: Jupiter period ~11.86 years
    const jupiterTheta = (romerMonth / 12) * (2 * Math.PI / 11.862);

    // Positions in AU
    const xEarth = Math.cos(earthTheta);
    const yEarth = Math.sin(earthTheta);

    const xJup = JUPITER_ORBIT_AU * Math.cos(jupiterTheta);
    const yJup = JUPITER_ORBIT_AU * Math.sin(jupiterTheta);

    // Distance between Earth and Jupiter in AU
    const dx = xJup - xEarth;
    const dy = yJup - yEarth;
    const dAu = Math.sqrt(dx * dx + dy * dy);
    const dKm = dAu * AU_KM;

    // Minimum distance (approx opposition) & maximum (conjunction)
    const dMinAu = JUPITER_ORBIT_AU - 1.0;
    const dMaxAu = JUPITER_ORBIT_AU + 1.0;
    const dMinKm = dMinAu * AU_KM;
    const dMaxKm = dMaxAu * AU_KM;

    // Light travel times
    const tTravelSec = (dKm * 1000) / C_VACUUM; // seconds
    const tMinSec = (dMinKm * 1000) / C_VACUUM; // seconds
    const tDelaySec = Math.max(0, tTravelSec - tMinSec); // extra delay relative to closest
    const tDelayMin = tDelaySec / 60; // minutes

    // Maximum theoretical delay across Earth's orbit diameter (2 AU)
    const tMaxDelaySec = (2 * AU_METERS) / C_VACUUM; // ~997.99 s (~16.63 min)
    const tMaxDelayMin = tMaxDelaySec / 60;

    // Radial velocity: rate at which distance Earth-Jupiter is changing (km/s)
    const earthVOrbital = (2 * Math.PI * AU_KM) / (365.25 * 86400); // ~29.78 km/s
    const isReceding = Math.sin(earthTheta - jupiterTheta) > 0.05;
    const isApproaching = Math.sin(earthTheta - jupiterTheta) < -0.05;

    // Calculated speed of light from diameter delay
    const cDerived = (2 * AU_METERS) / (tMaxDelaySec || 1);

    return {
      earthTheta,
      jupiterTheta,
      xEarth,
      yEarth,
      xJup,
      yJup,
      dAu,
      dKm,
      dMinKm,
      dMaxKm,
      tTravelSec,
      tTravelMin: tTravelSec / 60,
      tDelaySec,
      tDelayMin,
      tMaxDelaySec,
      tMaxDelayMin,
      isReceding,
      isApproaching,
      cDerived,
      earthVOrbital,
    };
  }, [romerMonth]);

  // ==========================================================================
  // RESET HANDLER
  // ==========================================================================
  const handleReset = useCallback(() => {
    setFizeauRpm(0);
    setFizeauDistanceKm(8.633);
    setFizeauTeeth(720);
    setFizeauLightOn(true);
    setFizeauShowPulses(true);

    setRomerMonth(0);
    setRomerIsPlaying(true);
    setRomerSpeed(1);

    setUserInputs({});
    setProblemStatus({});
    setShowHintMap({});
    setShowSolutionMap({});

    onTelemetry?.({ event: 'RESET_EXPERIMENT', tab: activeTab });
  }, [activeTab, onTelemetry]);

  // ==========================================================================
  // FIZEAU CANVAS ANIMATION LOOP
  // ==========================================================================
  useEffect(() => {
    if (activeTab !== 'fizeau') return;
    const canvas = fizeauCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update rotation angle (stroboscopically visualised)
      if (fizeauIsRunning && fizeauRpm > 0) {
        const visualRps = Math.min(fizeauRpm / 60, 8);
        fizeauWheelAngleRef.current += visualRps * 2 * Math.PI * dt;
      }

      // Update pulse progress (0 to 1 across roundtrip)
      if (fizeauLightOn && fizeauShowPulses) {
        fizeauPulseProgressRef.current = (fizeauPulseProgressRef.current + dt * 1.4) % 1;
      }

      const w = canvas.width;
      const h = canvas.height;

      // Clear Canvas
      ctx.fillStyle = '#090d16'; // Deep slate night
      ctx.fillRect(0, 0, w, h);

      // 1. Draw subtle apparatus bench & distance landscape
      const benchY = h * 0.72;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, benchY);
      ctx.lineTo(w - 30, benchY);
      ctx.stroke();

      // Hilltops & distance gradient
      const grad = ctx.createLinearGradient(0, benchY - 80, 0, benchY);
      grad.addColorStop(0, 'rgba(30, 41, 59, 0)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0.8)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(w * 0.45, benchY);
      ctx.quadraticCurveTo(w * 0.65, benchY - 45, w * 0.85, benchY);
      ctx.lineTo(w, benchY);
      ctx.lineTo(0, benchY);
      ctx.closePath();
      ctx.fill();

      // Lab Pillar & Distant Mirror Pillar
      ctx.fillStyle = '#334155';
      ctx.fillRect(50, benchY - 60, 110, 60); // Lab bench
      ctx.fillRect(w - 85, benchY - 70, 45, 70); // Distant tower

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Montmartre Lab (Paris)', 105, benchY + 18);
      ctx.fillText(`Suresnes Mirror (${fizeauDistanceKm} km)`, w - 62, benchY + 18);

      // Coordinates
      const lampX = 65;
      const beamY = benchY - 90;
      const splitterX = 135;
      const wheelX = 180;
      const mirrorX = w - 65;
      const eyepieceY = benchY - 20;

      // 2. Draw Arc Light Lamp & Collimator
      ctx.save();
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(lampX - 25, beamY - 22, 35, 44, 4);
      ctx.fill();
      ctx.stroke();

      if (fizeauLightOn) {
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(lampX - 8, beamY, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.restore();

      // Collimator Lens
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(lampX + 22, beamY, 4, 18, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Draw Half-Silvered Beam Splitter (45 deg)
      ctx.save();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(splitterX - 12, beamY - 18);
      ctx.lineTo(splitterX + 12, beamY + 18);
      ctx.stroke();
      ctx.restore();

      // Telescope Tube going downwards to Eyepiece
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(splitterX - 8, beamY + 15, 16, eyepieceY - (beamY + 15));

      // 4. Draw Rotating Toothed Wheel
      ctx.save();
      const wheelR = 48;
      const wheelCenterY = beamY + wheelR;
      ctx.translate(wheelX, wheelCenterY);
      ctx.rotate(fizeauWheelAngleRef.current);

      // Wheel Body
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, wheelR - 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Spokes
      for (let s = 0; s < 4; s++) {
        const ang = (s * Math.PI) / 2;
        ctx.strokeStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * (wheelR - 12), Math.sin(ang) * (wheelR - 12));
        ctx.stroke();
      }

      // Teeth Rim (24 visible gear notches for visual clarity)
      const visibleTeeth = 24;
      ctx.fillStyle = '#cbd5e1';
      for (let t = 0; t < visibleTeeth; t++) {
        const tAng = (t * 2 * Math.PI) / visibleTeeth;
        ctx.save();
        ctx.rotate(tAng);
        ctx.fillRect(-3, -wheelR, 6, 12);
        ctx.restore();
      }
      // Wheel Axle
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 5. Distant Collimating Lens & Plane Mirror at Suresnes
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(mirrorX - 16, beamY, 4, 20, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Flat Mirror
      ctx.fillStyle = '#64748b';
      ctx.fillRect(mirrorX - 4, beamY - 24, 8, 48);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(mirrorX - 4, beamY - 24, 8, 48);
      ctx.restore();

      // 6. Draw Light Beams and Pulses
      if (fizeauLightOn) {
        // Outgoing Beam
        ctx.save();
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(lampX, beamY);
        ctx.lineTo(mirrorX, beamY);
        ctx.stroke();

        // Returning Beam: From Mirror back to Wheel
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.beginPath();
        ctx.moveTo(mirrorX, beamY);
        ctx.lineTo(wheelX, beamY);
        ctx.stroke();

        // After wheel: Transmitted portion of return beam
        const retAlpha = fizeauPhysics.intensity;
        if (retAlpha > 0.01) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${retAlpha * 0.9})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(wheelX, beamY);
          ctx.lineTo(splitterX, beamY);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(splitterX, beamY);
          ctx.lineTo(splitterX, eyepieceY);
          ctx.stroke();
        }

        // Animated propagating photon packets
        if (fizeauShowPulses) {
          const p = fizeauPulseProgressRef.current;
          const pOutX = wheelX + p * (mirrorX - wheelX);
          ctx.fillStyle = '#fef08a';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(pOutX, beamY, 3.5, 0, Math.PI * 2);
          ctx.fill();

          const pRetX = mirrorX - p * (mirrorX - wheelX);
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.beginPath();
          ctx.arc(pRetX, beamY, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.restore();
      }

      // 7. Tooth blocking animation badge at wheel aperture
      if (fizeauPhysics.eclipseState === 'eclipsed' && fizeauRpm > 0 && fizeauLightOn) {
        ctx.save();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(wheelX - 40, beamY - 32, 80, 18, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TOOTH BLOCKS', wheelX, beamY - 20);
        ctx.restore();
      }

      fizeauAnimFrameRef.current = requestAnimationFrame(render);
    };

    fizeauAnimFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (fizeauAnimFrameRef.current) {
        cancelAnimationFrame(fizeauAnimFrameRef.current);
      }
    };
  }, [activeTab, fizeauRpm, fizeauDistanceKm, fizeauLightOn, fizeauShowPulses, fizeauIsRunning, fizeauPhysics]);

  // ==========================================================================
  // RØMER ORBITAL CANVAS ANIMATION LOOP
  // ==========================================================================
  useEffect(() => {
    if (activeTab !== 'romer') return;
    const canvas = romerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (romerIsPlaying) {
        const monthSpeed = 0.5 * romerSpeed;
        setRomerMonth((prev) => (prev + dt * monthSpeed) % 12);
      }

      romerIoAngleRef.current += dt * (romerSpeed * 4.2);

      const w = canvas.width;
      const h = canvas.height;

      // Clear Canvas
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, w, h);

      // Starfield background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(45, 30, 1.5, 1.5);
      ctx.fillRect(120, 80, 1, 1);
      ctx.fillRect(w - 70, 50, 2, 2);
      ctx.fillRect(w - 140, h - 60, 1.5, 1.5);
      ctx.fillRect(90, h - 90, 1, 1);
      ctx.fillRect(w * 0.5, 35, 1.5, 1.5);

      const centerX = w * 0.38;
      const centerY = h * 0.52;

      const rEarthPx = 70;
      const rJupPx = rEarthPx * 2.5;

      // 1. Draw Sun at Center
      ctx.save();
      const sunGrad = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, 30);
      sunGrad.addColorStop(0, '#fef08a');
      sunGrad.addColorStop(0.3, '#f59e0b');
      sunGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fill();

      // Sun core
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SUN', centerX, centerY + 22);
      ctx.restore();

      // 2. Earth Orbit Track & Season Markers
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, rEarthPx, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#64748b';
      ctx.font = '9px sans-serif';
      ctx.fillText('Jan (Opposition)', centerX + rEarthPx + 4, centerY - 8);
      ctx.fillText('Jul (Conjunction)', centerX - rEarthPx - 4, centerY - 8);
      ctx.fillText('Apr (Receding)', centerX, centerY + rEarthPx + 14);
      ctx.fillText('Oct (Approaching)', centerX, centerY - rEarthPx - 6);
      ctx.restore();

      // 3. Jupiter Orbit Track
      ctx.save();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, rJupPx, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Positions on Canvas
      const eAng = romerPhysics.earthTheta;
      const jAng = romerPhysics.jupiterTheta;

      const eX = centerX + rEarthPx * Math.cos(eAng);
      const eY = centerY + rEarthPx * Math.sin(eAng);

      const jX = centerX + rJupPx * Math.cos(jAng);
      const jY = centerY + rJupPx * Math.sin(jAng);

      // 4. Jupiter's Shadow Cone (Umbra)
      ctx.save();
      const shadowAng = Math.atan2(jY - centerY, jX - centerX);
      const coneLength = 110;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(jX + Math.cos(shadowAng + Math.PI / 2) * 14, jY + Math.sin(shadowAng + Math.PI / 2) * 14);
      ctx.lineTo(jX + Math.cos(shadowAng) * coneLength + Math.cos(shadowAng + Math.PI / 2) * 22, jY + Math.sin(shadowAng) * coneLength + Math.sin(shadowAng + Math.PI / 2) * 22);
      ctx.lineTo(jX + Math.cos(shadowAng) * coneLength - Math.cos(shadowAng + Math.PI / 2) * 22, jY + Math.sin(shadowAng) * coneLength - Math.sin(shadowAng + Math.PI / 2) * 22);
      ctx.lineTo(jX - Math.cos(shadowAng + Math.PI / 2) * 14, jY - Math.sin(shadowAng + Math.PI / 2) * 14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.font = '8px sans-serif';
      ctx.fillText('Shadow (Umbra)', jX + Math.cos(shadowAng) * 55, jY + Math.sin(shadowAng) * 55);
      ctx.restore();

      // 5. Jupiter Body
      ctx.save();
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(jX, jY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Cloud stripe on Jupiter
      ctx.fillStyle = '#b45309';
      ctx.fillRect(jX - 13, jY - 3, 26, 6);
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('JUPITER', jX, jY - 18);
      ctx.restore();

      // 6. Moon Io Orbiting Jupiter
      const ioR = 26;
      const ioX = jX + ioR * Math.cos(romerIoAngleRef.current);
      const ioY = jY + ioR * Math.sin(romerIoAngleRef.current);

      const ioVecX = ioX - jX;
      const ioVecY = ioY - jY;
      const dotShadow = ioVecX * Math.cos(shadowAng) + ioVecY * Math.sin(shadowAng);
      const isIoEclipsed = dotShadow > 12 && Math.abs(ioVecX * Math.sin(shadowAng) - ioVecY * Math.cos(shadowAng)) < 12;

      // Draw Io Orbit Path
      ctx.save();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(jX, jY, ioR, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Moon Io
      ctx.fillStyle = isIoEclipsed ? '#475569' : '#fef08a';
      if (!isIoEclipsed) {
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 6;
      }
      ctx.beginPath();
      ctx.arc(ioX, ioY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = isIoEclipsed ? '#ef4444' : '#fef08a';
      ctx.font = '8px sans-serif';
      ctx.fillText(isIoEclipsed ? 'Io (Eclipsed)' : 'Io', ioX + 8, ioY - 4);
      ctx.restore();

      // 7. Earth Body & Velocity Vector
      ctx.save();
      const vTanX = -Math.sin(eAng) * 20;
      const vTanY = Math.cos(eAng) * 20;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(eX, eY);
      ctx.lineTo(eX + vTanX, eY + vTanY);
      ctx.stroke();

      // Earth Globe
      ctx.fillStyle = '#0284c7';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(eX, eY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Landmass detail
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(eX - 1.5, eY - 1.5, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('EARTH', eX, eY - 12);
      ctx.restore();

      // 8. Line of Sight & Traveling Light Wavefronts from Jupiter to Earth
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(jX, jY);
      ctx.lineTo(eX, eY);
      ctx.stroke();
      ctx.setLineDash([]);

      const pulseT = ((time / 1000) * (0.8 * romerSpeed)) % 1;
      const pX = jX + pulseT * (eX - jX);
      const pY = jY + pulseT * (eY - jY);
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pX, pY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // 9. Status Banner at Top Right
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(w - 210, 16, 195, 68, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Line-of-Sight Distance:', w - 200, 32);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`${romerPhysics.dAu.toFixed(2)} AU (${(romerPhysics.dKm / 1e6).toFixed(1)}M km)`, w - 200, 48);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText('Cumulative Timing Delay:', w - 200, 64);
      ctx.fillStyle = romerPhysics.tDelayMin > 10 ? '#f59e0b' : '#22c55e';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`+${romerPhysics.tDelayMin.toFixed(1)} min (+${romerPhysics.tDelaySec.toFixed(0)} s)`, w - 200, 78);
      ctx.restore();

      romerAnimFrameRef.current = requestAnimationFrame(render);
    };

    romerAnimFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (romerAnimFrameRef.current) {
        cancelAnimationFrame(romerAnimFrameRef.current);
      }
    };
  }, [activeTab, romerIsPlaying, romerSpeed, romerPhysics]);

  // ==========================================================================
  // PRACTICE PROBLEMS VALIDATION
  // ==========================================================================
  const handleCheckAnswer = (problemId) => {
    const p = PRACTICE_PROBLEMS.find((prob) => prob.id === problemId);
    if (!p) return;
    const inputVal = parseFloat(userInputs[problemId]);
    if (isNaN(inputVal)) {
      setProblemStatus((prev) => ({ ...prev, [problemId]: { status: 'error', msg: 'Please enter a valid number.' } }));
      return;
    }

    const diff = Math.abs(inputVal - p.target);
    const isCorrect = diff <= p.tolerance;

    setProblemStatus((prev) => ({
      ...prev,
      [problemId]: {
        status: isCorrect ? 'correct' : 'incorrect',
        msg: isCorrect
          ? `Correct! Target: ${p.target} ${p.unit}. Well done!`
          : `Not quite. Your answer: ${inputVal} ${p.unit}. Expected: ~${p.target} ${p.unit}. Click Hint for guidance.`,
      },
    }));

    onTelemetry?.({
      event: 'PRACTICE_SUBMITTED',
      problemId,
      userAnswer: inputVal,
      isCorrect,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-6 bg-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Physics Form 4 • Topic 4
            </span>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Fundamental Constants (c)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-amber-300 to-yellow-400">
            Speed of Light Historical Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Recreating the landmark experiments of Hippolyte Fizeau (1849) & Ole Rømer (1676) to measure <span className="text-amber-300 font-mono">c = 3.0×10⁸ m/s</span>.
          </p>
        </div>

        {/* TOP CONTROLS */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
            title="Reset simulation parameters to default"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* TAB NAVIGATION */}
      <nav className="flex items-center gap-2 mt-4 pb-2 border-b border-slate-800/80 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('fizeau');
            onTelemetry?.({ event: 'TAB_CHANGED', tab: 'fizeau' });
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer ${
            activeTab === 'fizeau'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Gauge className="w-4 h-4 text-amber-400" />
          <span>Fizeau Toothed Wheel (1849)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('romer');
            onTelemetry?.({ event: 'TAB_CHANGED', tab: 'romer' });
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer ${
            activeTab === 'romer'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Rømer Io Eclipse (1676)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('practice');
            onTelemetry?.({ event: 'TAB_CHANGED', tab: 'practice' });
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer ${
            activeTab === 'practice'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" />
          <span>KCSE Practice Challenges</span>
        </button>
      </nav>

      {/* ==================================================================== */}
      {/* TAB 1: FIZEAU TOOTHED WHEEL EXPERIMENT                               */}
      {/* ==================================================================== */}
      {activeTab === 'fizeau' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
          {/* LEFT: INTERACTIVE APPARATUS & EYEPIECE RETICLE (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* CANVAS CONTAINER */}
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-200">
                    Fizeau Terrestrial Apparatus (Paris • 8.63 km Path)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFizeauLightOn(!fizeauLightOn)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition cursor-pointer ${
                      fizeauLightOn
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Lamp: {fizeauLightOn ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={() => setFizeauIsRunning(!fizeauIsRunning)}
                    className="p-1 text-slate-400 hover:text-white rounded bg-slate-800 border border-slate-700 cursor-pointer"
                    title={fizeauIsRunning ? 'Pause rotation' : 'Resume rotation'}
                  >
                    {fizeauIsRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* MAIN APPARATUS CANVAS */}
              <canvas
                ref={fizeauCanvasRef}
                width={720}
                height={280}
                className="w-full h-[240px] sm:h-[280px] block"
              />

              {/* EYEPIECE RETICLE INSET OVERLAY */}
              <div className="absolute bottom-3 right-3 bg-slate-950/90 border border-slate-700 rounded-2xl p-2.5 shadow-2xl backdrop-blur-sm flex flex-col items-center">
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 mb-1">
                  TELESCOPE EYEPIECE
                </span>
                <div className="relative w-20 h-20 rounded-full border-2 border-slate-600 bg-black flex items-center justify-center overflow-hidden shadow-inner">
                  {/* Crosshairs */}
                  <div className="absolute w-full h-[1px] bg-slate-700/80" />
                  <div className="absolute h-full w-[1px] bg-slate-700/80" />
                  {/* Mil dots */}
                  <div className="absolute w-12 h-12 rounded-full border border-slate-800/60" />

                  {/* Light spot glowing with intensity */}
                  {fizeauLightOn && (
                    <div
                      className="rounded-full transition-all duration-75"
                      style={{
                        width: `${Math.max(4, fizeauPhysics.intensity * 24)}px`,
                        height: `${Math.max(4, fizeauPhysics.intensity * 24)}px`,
                        backgroundColor: fizeauPhysics.intensity > 0.1 ? '#fef08a' : 'transparent',
                        boxShadow:
                          fizeauPhysics.intensity > 0.05
                            ? `0 0 ${fizeauPhysics.intensity * 20}px ${fizeauPhysics.intensity * 10}px rgba(250, 204, 21, ${fizeauPhysics.intensity * 0.9})`
                            : 'none',
                        opacity: fizeauPhysics.intensity,
                      }}
                    />
                  )}
                </div>

                {/* Eyepiece status label */}
                <span
                  className={`text-[10px] font-bold mt-1.5 ${
                    fizeauPhysics.eclipseState === 'eclipsed'
                      ? 'text-red-400'
                      : fizeauPhysics.eclipseState === 'partial'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {fizeauPhysics.eclipseState === 'eclipsed'
                    ? '🌑 ECLIPSED'
                    : fizeauPhysics.eclipseState === 'partial'
                    ? '🌓 PARTIAL'
                    : '🌕 BRIGHT'}
                </span>
              </div>
            </div>

            {/* LIVE INTENSITY VS. RPM CURVE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-300">
                    Eyepiece Transmission Intensity vs. Wheel RPM
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Current: <strong className="text-amber-300">{(fizeauPhysics.intensity * 100).toFixed(1)}%</strong>
                </span>
              </div>

              {/* SVG GRAPH */}
              <div className="relative w-full h-28 bg-slate-950 rounded-xl border border-slate-800/80 p-2">
                <svg viewBox="0 0 500 90" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  <line x1="40" y1="10" x2="480" y2="10" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="45" x2="480" y2="45" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="80" x2="480" y2="80" stroke="#334155" strokeWidth="1.5" />
                  <line x1="40" y1="10" x2="40" y2="80" stroke="#334155" strokeWidth="1.5" />

                  {/* Y Axis Labels */}
                  <text x="35" y="14" fill="#64748b" fontSize="8" textAnchor="end">100%</text>
                  <text x="35" y="49" fill="#64748b" fontSize="8" textAnchor="end">50%</text>
                  <text x="35" y="83" fill="#64748b" fontSize="8" textAnchor="end">0%</text>

                  {/* Theoretical Curve from 0 to 2400 RPM */}
                  {(() => {
                    const maxRpmGraph = 2400;
                    const points = [];
                    for (let r = 0; r <= maxRpmGraph; r += 20) {
                      const fVal = r / 60;
                      const kVal = (4 * fizeauPhysics.D * fizeauPhysics.N * fVal) / C_VACUUM;
                      const IVal = 0.5 * (1 + Math.cos(Math.PI * kVal));
                      const x = 40 + (r / maxRpmGraph) * 440;
                      const y = 80 - IVal * 70;
                      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
                    }
                    return (
                      <polyline
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points.join(' ')}
                      />
                    );
                  })()}

                  {/* First Eclipse Marker (Theoretical) */}
                  {(() => {
                    const xEcl = 40 + (fizeauPhysics.rpm1Theoretical / 2400) * 440;
                    if (xEcl <= 480) {
                      return (
                        <g>
                          <line x1={xEcl} y1="10" x2={xEcl} y2="80" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
                          <text x={xEcl} y="88" fill="#ef4444" fontSize="7" textAnchor="middle">
                            1st Eclipse ({fizeauPhysics.rpm1Theoretical.toFixed(0)} RPM)
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })()}

                  {/* Current RPM Cursor Indicator */}
                  {(() => {
                    const curX = 40 + (Math.min(fizeauRpm, 2400) / 2400) * 440;
                    const curY = 80 - fizeauPhysics.intensity * 70;
                    return (
                      <g>
                        <circle cx={curX} cy={curY} r="4.5" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" />
                        <line x1={curX} y1="10" x2={curX} y2="80" stroke="#38bdf8" strokeWidth="1" />
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* CAUSAL MECHANISM EXPLANATION CARD */}
              <div className="mt-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-amber-400 font-semibold flex items-center gap-1 mb-1">
                  <Info className="w-3.5 h-3.5" />
                  Why did the beam disappear? (Causal Mechanism)
                </strong>
                Light takes a finite roundtrip time{' '}
                <span className="text-cyan-300 font-mono">Δt = 2D / c = {fizeauPhysics.tRoundtripMicro.toFixed(2)} μs</span> to
                travel to Suresnes and back. When the wheel rotates at{' '}
                <span className="text-amber-300 font-mono">f₁ = c / (4·D·N) ≈ {fizeauPhysics.rpm1Theoretical.toFixed(0)} RPM</span>,
                an opaque tooth rotates exactly into the position previously occupied by the gap during those{' '}
                <span className="text-cyan-300 font-mono">{fizeauPhysics.tRoundtripMicro.toFixed(1)} microseconds</span>,
                blocking the returning light completely!
              </div>
            </div>
          </div>

          {/* RIGHT: CONTROLS & LIVE EQUATIONS (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* ROTATIONAL SPEED CONTROL */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Wheel Rotational Speed
                </span>
                <span className="text-base font-extrabold text-white font-mono">
                  {fizeauRpm} <span className="text-xs font-normal text-slate-400">RPM</span>
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="2400"
                step="2"
                value={fizeauRpm}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFizeauRpm(val);
                  onTelemetry?.({ event: 'RPM_CHANGED', rpm: val });
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />

              {/* FINE TUNE BUTTONS */}
              <div className="flex items-center justify-between gap-1.5 mt-2.5">
                <button
                  onClick={() => setFizeauRpm((prev) => Math.max(0, prev - 10))}
                  className="flex-1 py-1 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 border border-slate-700 cursor-pointer"
                >
                  -10
                </button>
                <button
                  onClick={() => setFizeauRpm((prev) => Math.max(0, prev - 1))}
                  className="flex-1 py-1 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 border border-slate-700 cursor-pointer"
                >
                  -1
                </button>
                <button
                  onClick={() => setFizeauRpm((prev) => Math.min(2400, prev + 1))}
                  className="flex-1 py-1 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 border border-slate-700 cursor-pointer"
                >
                  +1
                </button>
                <button
                  onClick={() => setFizeauRpm((prev) => Math.min(2400, prev + 10))}
                  className="flex-1 py-1 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 border border-slate-700 cursor-pointer"
                >
                  +10
                </button>
              </div>

              {/* QUICK PRESET BUTTONS */}
              <div className="mt-3 flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Historical & Critical Presets:</span>
                {FIZEAU_PRESETS.map((pst) => (
                  <button
                    key={pst.label}
                    onClick={() => {
                      setFizeauRpm(pst.rpm);
                      onTelemetry?.({ event: 'PRESET_APPLIED', preset: pst.label, rpm: pst.rpm });
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition border flex items-center justify-between cursor-pointer ${
                      Math.abs(fizeauRpm - pst.rpm) < 2
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                        : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span>{pst.label}</span>
                    <span className="font-mono text-[10px] text-slate-400">{pst.rpm} RPM</span>
                  </button>
                ))}
              </div>
            </div>

            {/* APPARATUS PARAMETERS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-3">
                Apparatus Geometry
              </span>

              {/* Mirror Distance Slider */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Mirror Distance (D):</span>
                  <span className="font-mono font-bold text-cyan-300">{fizeauDistanceKm.toFixed(3)} km</span>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="15.0"
                  step="0.1"
                  value={fizeauDistanceKm}
                  onChange={(e) => setFizeauDistanceKm(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Number of Teeth Selector */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span>Number of Teeth (N):</span>
                  <span className="font-mono font-bold text-cyan-300">{fizeauTeeth} teeth</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[100, 360, 720, 1000].map((count) => (
                    <button
                      key={count}
                      onClick={() => setFizeauTeeth(count)}
                      className={`py-1 text-xs rounded-lg font-mono border transition cursor-pointer ${
                        fizeauTeeth === count
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* LIVE CALCULATION BREAKDOWN */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                Live Physics Derivation
              </span>

              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Roundtrip Transit Time:</div>
                  <div className="text-cyan-300 font-bold text-sm">
                    Δt = 2D / c = {fizeauPhysics.tRoundtripMicro.toFixed(2)} μs
                  </div>
                </div>

                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Rotational Frequency (f):</div>
                  <div className="text-amber-300 font-bold text-sm">
                    f = {fizeauPhysics.f.toFixed(2)} rev/s ({fizeauRpm} RPM)
                  </div>
                </div>

                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Speed of Light Equation:</div>
                  <div className="text-emerald-300 font-bold text-sm">
                    c = 4 · D · N · f₁
                  </div>
                  {fizeauRpm > 10 && (
                    <div className="text-[11px] text-slate-400 mt-1 border-t border-slate-800 pt-1">
                      Calculated from current RPM:{' '}
                      <span className="text-emerald-400 font-bold">
                        {(fizeauPhysics.cCalculated / 1e8).toFixed(3)} × 10⁸ m/s
                      </span>{' '}
                      ({fizeauPhysics.cErrorPct > 0 ? '+' : ''}
                      {fizeauPhysics.cErrorPct?.toFixed(1)}% error)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: RØMER'S IO ECLIPSE ASTRONOMICAL OBSERVATION                   */}
      {/* ==================================================================== */}
      {activeTab === 'romer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
          {/* LEFT: HELIOCENTRIC ORBIT & DELAY GRAPH (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* SOLAR SYSTEM CANVAS */}
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Heliocentric Astronomical View (Sun • Earth • Jupiter • Io)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRomerIsPlaying(!romerIsPlaying)}
                    className="p-1.5 text-slate-300 hover:text-white rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
                    title={romerIsPlaying ? 'Pause orbit' : 'Resume orbit'}
                  >
                    {romerIsPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
                    {[1, 5, 15].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setRomerSpeed(spd)}
                        className={`px-2 py-0.5 text-[10px] rounded font-semibold cursor-pointer ${
                          romerSpeed === spd ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {spd}×
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RØMER CANVAS */}
              <canvas
                ref={romerCanvasRef}
                width={720}
                height={340}
                className="w-full h-[280px] sm:h-[340px] block"
              />
            </div>

            {/* CUMULATIVE DELAY GRAPH */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-300">
                    Cumulative Io Eclipse Delay vs. Month of Year (Δt Curve)
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Current Delay:{' '}
                  <strong className="text-cyan-300 font-bold">
                    +{romerPhysics.tDelayMin.toFixed(1)} min (+{romerPhysics.tDelaySec.toFixed(0)} s)
                  </strong>
                </span>
              </div>

              {/* SVG GRAPH */}
              <div className="w-full h-28 bg-slate-950 rounded-xl border border-slate-800/80 p-2">
                <svg viewBox="0 0 500 90" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  <line x1="40" y1="10" x2="480" y2="10" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="45" x2="480" y2="45" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="80" x2="480" y2="80" stroke="#334155" strokeWidth="1.5" />
                  <line x1="40" y1="10" x2="40" y2="80" stroke="#334155" strokeWidth="1.5" />

                  {/* Y Axis Labels */}
                  <text x="35" y="14" fill="#64748b" fontSize="8" textAnchor="end">+16.6m</text>
                  <text x="35" y="49" fill="#64748b" fontSize="8" textAnchor="end">+8.3m</text>
                  <text x="35" y="83" fill="#64748b" fontSize="8" textAnchor="end">0.0m</text>

                  {/* Ideal Uniform Clock (Flat Line at 0 delay) */}
                  <line x1="40" y1="80" x2="480" y2="80" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
                  <text x="475" y="74" fill="#64748b" fontSize="7" textAnchor="end">
                    Uniform Period Clock (Ideal)
                  </text>

                  {/* Observed Delay Curve (Sinusoidal anomaly peaking at 6 months) */}
                  {(() => {
                    const points = [];
                    for (let m = 0; m <= 12; m += 0.2) {
                      const ang = (m / 12) * 2 * Math.PI;
                      const xE = Math.cos(ang);
                      const yE = Math.sin(ang);
                      const xJ = JUPITER_ORBIT_AU * Math.cos((m / 12) * (2 * Math.PI / 11.86));
                      const yJ = JUPITER_ORBIT_AU * Math.sin((m / 12) * (2 * Math.PI / 11.86));
                      const distAu = Math.sqrt((xJ - xE) ** 2 + (yJ - yE) ** 2);
                      const distKm = distAu * AU_KM;
                      const delaySec = Math.max(0, (distKm * 1000) / C_VACUUM - (romerPhysics.dMinKm * 1000) / C_VACUUM);
                      const delayMin = delaySec / 60;
                      const x = 40 + (m / 12) * 440;
                      const y = 80 - (delayMin / 17.5) * 70;
                      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
                    }
                    return (
                      <polyline
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points.join(' ')}
                      />
                    );
                  })()}

                  {/* Current Month Cursor */}
                  {(() => {
                    const curX = 40 + (romerMonth / 12) * 440;
                    const curY = 80 - (romerPhysics.tDelayMin / 17.5) * 70;
                    return (
                      <g>
                        <circle cx={curX} cy={curY} r="4.5" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
                        <line x1={curX} y1="10" x2={curX} y2="80" stroke="#f59e0b" strokeWidth="1" />
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* RØMER DISCOVERY EXPLANATION */}
              <div className="mt-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-cyan-400 font-semibold flex items-center gap-1 mb-1">
                  <Info className="w-3.5 h-3.5" />
                  Rømer's Revolutionary Discovery (1676)
                </strong>
                If light traveled instantaneously, Io's eclipses would recur at rigid{' '}
                <span className="text-amber-300 font-mono">42.46-hour</span> intervals regardless of the date. Rømer noticed
                that when Earth receded from Jupiter, eclipses were consistently delayed by ~15 seconds per orbit. Over 6 months,
                the cumulative delay reached{' '}
                <span className="text-cyan-300 font-mono">~16.6 minutes (1000 seconds)</span>—the exact time needed for light to
                traverse Earth’s orbital diameter (<span className="text-cyan-300 font-mono">2 AU ≈ 3.0×10⁸ km</span>)!
              </div>
            </div>
          </div>

          {/* RIGHT: RØMER CONTROLS & DERIVATION (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* MONTH / POSITION SCRUBBER */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Earth Orbital Position
                </span>
                <span className="text-sm font-extrabold text-white font-mono">
                  Month {romerMonth.toFixed(1)} / 12
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="12"
                step="0.05"
                value={romerMonth}
                onChange={(e) => {
                  setRomerMonth(Number(e.target.value));
                  onTelemetry?.({ event: 'ROMER_MONTH_SCRUBBED', month: Number(e.target.value) });
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />

              {/* SEASON PRESETS */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={() => setRomerMonth(0)}
                  className={`p-2 rounded-lg text-xs font-medium border text-left cursor-pointer ${
                    Math.abs(romerMonth - 0) < 0.3 || Math.abs(romerMonth - 12) < 0.3
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold">Jan: Opposition</div>
                  <div className="text-[10px] text-slate-500">Closest (4.2 AU) • Δt = 0m</div>
                </button>

                <button
                  onClick={() => setRomerMonth(3)}
                  className={`p-2 rounded-lg text-xs font-medium border text-left cursor-pointer ${
                    Math.abs(romerMonth - 3) < 0.3
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold">Apr: Max Receding</div>
                  <div className="text-[10px] text-slate-500">Delay increasing rapidly</div>
                </button>

                <button
                  onClick={() => setRomerMonth(6)}
                  className={`p-2 rounded-lg text-xs font-medium border text-left cursor-pointer ${
                    Math.abs(romerMonth - 6) < 0.3
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold">Jul: Conjunction</div>
                  <div className="text-[10px] text-slate-500">Furthest (6.2 AU) • Δt = 16.6m</div>
                </button>

                <button
                  onClick={() => setRomerMonth(9)}
                  className={`p-2 rounded-lg text-xs font-medium border text-left cursor-pointer ${
                    Math.abs(romerMonth - 9) < 0.3
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold">Oct: Approaching</div>
                  <div className="text-[10px] text-slate-500">Delay decreasing rapidly</div>
                </button>
              </div>
            </div>

            {/* LIVE READOUT & GEOMETRY SPECS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2.5">
                Orbital Telemetry Readouts
              </span>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Earth-Jupiter Distance:</span>
                  <span className="text-cyan-300 font-bold">
                    {romerPhysics.dAu.toFixed(2)} AU ({romerPhysics.dKm.toExponential(2)} km)
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Extra Distance light travels:</span>
                  <span className="text-amber-300 font-bold">
                    {((romerPhysics.dKm - romerPhysics.dMinKm) / 1e6).toFixed(1)} million km
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Total Transit Time from Io:</span>
                  <span className="text-slate-200 font-bold">
                    {romerPhysics.tTravelMin.toFixed(1)} min ({romerPhysics.tTravelSec.toFixed(0)} s)
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Earth Orbital Velocity:</span>
                  <span className="text-slate-200 font-bold">~29.8 km/s</span>
                </div>
              </div>
            </div>

            {/* SPEED OF LIGHT DERIVATION CARD */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                Rømer's Calculation for c
              </span>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-2 text-slate-300">
                <div>
                  <div className="text-[10px] text-slate-500">Earth Orbital Diameter (2 AU):</div>
                  <div className="text-cyan-300 font-bold text-sm">
                    d = 2 · R_Earth = 2.992 × 10¹¹ m
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500">Maximum Diameter Delay (Δt):</div>
                  <div className="text-amber-300 font-bold text-sm">
                    Δt = {romerPhysics.tMaxDelayMin.toFixed(1)} min ≈ {romerPhysics.tMaxDelaySec.toFixed(0)} s
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[10px] text-slate-500">Derived Speed of Light:</div>
                  <div className="text-emerald-400 font-extrabold text-base">
                    c = (2·R_Earth) / Δt = {(romerPhysics.cDerived / 1e8).toFixed(3)} × 10⁸ m/s
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: KCSE PRACTICE CHALLENGES & HISTORICAL TIMELINE                */}
      {/* ==================================================================== */}
      {activeTab === 'practice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
          {/* LEFT: PRACTICE CHALLENGES INTERACTIVE (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  KCSE Physics Speed of Light Challenges
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Problem {currentProblemIdx + 1} of {PRACTICE_PROBLEMS.length}
                </span>
              </div>

              {/* PROBLEM SELECTOR TABS */}
              <div className="flex gap-2 my-4 overflow-x-auto pb-1">
                {PRACTICE_PROBLEMS.map((prob, idx) => (
                  <button
                    key={prob.id}
                    onClick={() => setCurrentProblemIdx(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border cursor-pointer ${
                      currentProblemIdx === idx
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    Prob {idx + 1}
                    {problemStatus[prob.id]?.status === 'correct' && (
                      <span className="ml-1 text-emerald-400">✓</span>
                    )}
                  </button>
                ))}
              </div>

              {/* CURRENT PROBLEM DISPLAY */}
              {(() => {
                const prob = PRACTICE_PROBLEMS[currentProblemIdx];
                const feedback = problemStatus[prob.id];

                return (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-100">{prob.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                      {prob.prompt}
                    </p>

                    {/* INPUT & SUBMIT SECTION */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          step="any"
                          placeholder="Your answer"
                          value={userInputs[prob.id] || ''}
                          onChange={(e) => setUserInputs({ ...userInputs, [prob.id]: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono text-sm"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">
                          {prob.unit}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCheckAnswer(prob.id)}
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-purple-600/20 cursor-pointer"
                      >
                        Check Answer
                      </button>
                    </div>

                    {/* FEEDBACK BANNER */}
                    {feedback && (
                      <div
                        className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
                          feedback.status === 'correct'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {feedback.status === 'correct' ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        )}
                        <span>{feedback.msg}</span>
                      </div>
                    )}

                    {/* HINT & FULL SOLUTION ACCORDIONS */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => setShowHintMap({ ...showHintMap, [prob.id]: !showHintMap[prob.id] })}
                        className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 py-1 px-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        {showHintMap[prob.id] ? 'Hide Hint' : 'Show Hint'}
                      </button>

                      <button
                        onClick={() => setShowSolutionMap({ ...showSolutionMap, [prob.id]: !showSolutionMap[prob.id] })}
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 py-1 px-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {showSolutionMap[prob.id] ? 'Hide Step-by-Step Solution' : 'View Full Solution'}
                      </button>
                    </div>

                    {showHintMap[prob.id] && (
                      <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-300/90 leading-relaxed">
                        <strong>Hint:</strong> {prob.hint}
                      </div>
                    )}

                    {showSolutionMap[prob.id] && (
                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5 font-mono">
                        <strong className="text-cyan-400 font-bold block mb-1">
                          Complete Step-by-Step Derivation:
                        </strong>
                        {prob.solutionSteps.map((step, sIdx) => (
                          <div key={sIdx} className="text-slate-300 leading-relaxed">
                            {step}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* RIGHT: HISTORICAL TIMELINE (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-4">
                <Compass className="w-4 h-4" />
                Evolution of Light Speed Measurements
              </span>

              <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {HISTORICAL_TIMELINE.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-slate-900" />
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-extrabold text-amber-300 font-mono">{item.year}</span>
                      <span className="text-xs text-slate-400">{item.scientist}</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">{item.method}</div>
                    <div className="text-xs font-mono text-cyan-400 mt-0.5">c = {item.value}</div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">{item.significance}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
