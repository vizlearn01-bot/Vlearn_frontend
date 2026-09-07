import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Activity,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sliders,
  Sparkles,
  Clock,
  Radio,
  Sun,
  Flame,
  Volume2,
  VolumeX,
  Layers,
  ChevronRight,
  ChevronDown,
  Dna,
  Atom,
  Gauge,
  ArrowRight,
  Eye
} from 'lucide-react';

// ==========================================
// 1. PHYSICAL CONSTANTS & RADIATION DATA
// ==========================================
export const RADIATION_TYPES = {
  radio: {
    key: 'radio',
    name: 'Radio Waves',
    subLabel: '100 MHz (VHF / FM)',
    category: 'Non-Ionizing',
    energyEV: 4.14e-7,
    energyLabel: '4.14 × 10⁻⁷ eV',
    frequency: '100 MHz (1.0 × 10⁸ Hz)',
    wavelength: '3.0 m',
    isIonizing: false,
    damageMechanism: 'Macroscopic charge oscillation',
    cellularEffect: 'thermal_none',
    hazardRating: 'negligible',
    doseRate1m: 0.0,
    color: '#3b82f6', // Blue
    waveColor: '#60a5fa',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    freqVisual: 1,
    mu: {
      air: 0.000001,
      paper: 0.01,
      tissue: 0.25,
      al: 1800.0,
      concrete: 0.15,
      lead: 3500.0,
    },
    damageDescription: 'Induces minute high-frequency currents in conductors and antennas. No molecular or bond damage.',
  },
  microwave: {
    key: 'microwave',
    name: 'Microwaves',
    subLabel: '2.45 GHz (ISM Band)',
    category: 'Non-Ionizing',
    energyEV: 1.01e-5,
    energyLabel: '1.01 × 10⁻⁵ eV',
    frequency: '2.45 GHz (2.45 × 10⁹ Hz)',
    wavelength: '12.2 cm',
    isIonizing: false,
    damageMechanism: 'Dielectric dipolar rotation',
    cellularEffect: 'thermal_vibration',
    hazardRating: 'thermal',
    doseRate1m: 0.0,
    color: '#f97316', // Orange
    waveColor: '#fb923c',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    freqVisual: 2,
    mu: {
      air: 0.00001,
      paper: 0.05,
      tissue: 1.80,
      al: 2500.0,
      concrete: 0.85,
      lead: 4000.0,
    },
    damageDescription: 'Rapidly oscillates polar water molecules (2.45 billion times/sec). Produces dielectric heating; zero DNA ionization.',
  },
  infrared: {
    key: 'infrared',
    name: 'Infrared (IR)',
    subLabel: '100 THz (3.0 µm)',
    category: 'Non-Ionizing',
    energyEV: 0.414,
    energyLabel: '0.414 eV',
    frequency: '100 THz (1.0 × 10¹⁴ Hz)',
    wavelength: '3.0 µm (3,000 nm)',
    isIonizing: false,
    damageMechanism: 'Molecular vibrational stretching',
    cellularEffect: 'thermal_vibration',
    hazardRating: 'thermal',
    doseRate1m: 0.0,
    color: '#ef4444', // Red
    waveColor: '#f87171',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    freqVisual: 3,
    mu: {
      air: 0.0001,
      paper: 6.5,
      tissue: 18.0,
      al: 9000.0,
      concrete: 8000.0,
      lead: 9000.0,
    },
    damageDescription: 'Excites vibrational and bending modes of organic covalent bonds (C-H, O-H). Perceived as radiant heat; causes thermal burns at high fluence.',
  },
  visible: {
    key: 'visible',
    name: 'Visible Light',
    subLabel: '500 nm (Green)',
    category: 'Non-Ionizing',
    energyEV: 2.48,
    energyLabel: '2.48 eV',
    frequency: '600 THz (6.0 × 10¹⁴ Hz)',
    wavelength: '500 nm',
    isIonizing: false,
    damageMechanism: 'Valence electron transition',
    cellularEffect: 'electron_transition',
    hazardRating: 'safe',
    doseRate1m: 0.0,
    color: '#22c55e', // Green
    waveColor: '#4ade80',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    freqVisual: 4,
    mu: {
      air: 0.00001,
      paper: 25.0,
      tissue: 6.0,
      al: 9000.0,
      concrete: 9000.0,
      lead: 9000.0,
    },
    damageDescription: 'Promotes valence electrons to higher atomic orbitals. Harmlessly re-emitted or triggers retinal rhodopsin photoreception.',
  },
  uv: {
    key: 'uv',
    name: 'UV-A / UV-C',
    subLabel: '300 nm / 250 nm (Threshold)',
    category: 'Photochemical / Threshold Hazard',
    energyEV: 4.96,
    energyLabel: '3.54 – 4.96 eV',
    frequency: '1.20 × 10¹⁵ Hz',
    wavelength: '250 nm (UV-C) / 300 nm',
    isIonizing: false,
    damageMechanism: 'Resonant pyrimidine excitation',
    cellularEffect: 'dna_thymine_dimer',
    hazardRating: 'photochemical_hazard',
    doseRate1m: 0.0,
    color: '#a855f7', // Purple
    waveColor: '#c084fc',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    freqVisual: 5,
    mu: {
      air: 0.002,
      paper: 150.0,
      tissue: 250.0,
      al: 9000.0,
      concrete: 9000.0,
      lead: 9000.0,
    },
    damageDescription: 'Absorbed directly by nucleic acids. Covalently fuses adjacent Thymine bases (T-T dimer), kinking DNA backbone and causing mutations (sunburn, melanoma).',
  },
  xray_50k: {
    key: 'xray_50k',
    name: 'Diagnostic X-Ray (50 keV)',
    subLabel: '50 keV Diagnostic Tube',
    category: 'Ionizing Radiation',
    energyEV: 50000,
    energyLabel: '50.0 keV (50,000 eV)',
    frequency: '1.21 × 10¹⁹ Hz',
    wavelength: '0.0248 nm (24.8 pm)',
    isIonizing: true,
    damageMechanism: 'Photoelectric & Compton ionization',
    cellularEffect: 'ionization_dna_break',
    hazardRating: 'ionizing_hazard',
    doseRate1m: 5.0, // mSv/h at 1m unshielded
    color: '#06b6d4', // Cyan
    waveColor: '#22d3ee',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    freqVisual: 6,
    mu: {
      air: 0.00025,
      paper: 0.18,
      tissue: 0.22, // HVL ~ 3.15 cm
      al: 0.95,     // HVL ~ 7.3 mm
      concrete: 0.52, // HVL ~ 1.33 cm
      lead: 23.1,   // HVL = 0.693 / 23.1 = 0.030 cm = 0.30 mm!
    },
    damageDescription: 'Photoelectrically ejects core K/L electrons. Produces free radical storms and double-strand DNA breaks (DSB).',
  },
  xray_100k: {
    key: 'xray_100k',
    name: 'Deep X-Ray (100 keV)',
    subLabel: '100 keV Challenge Standard',
    category: 'Ionizing Radiation',
    energyEV: 100000,
    energyLabel: '100.0 keV (100,000 eV)',
    frequency: '2.42 × 10¹⁹ Hz',
    wavelength: '0.0124 nm (12.4 pm)',
    isIonizing: true,
    damageMechanism: 'Compton & Photoelectric cascade',
    cellularEffect: 'ionization_dna_break',
    hazardRating: 'ionizing_hazard',
    doseRate1m: 8.5,
    color: '#38bdf8', // Sky
    waveColor: '#7dd3fc',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    freqVisual: 7,
    mu: {
      air: 0.00018,
      paper: 0.15,
      tissue: 0.17, // HVL ~ 4.08 cm
      al: 0.44,     // HVL ~ 1.57 cm
      concrete: 0.38, // HVL ~ 1.82 cm
      lead: 6.00,   // HVL = ln(2)/6 = 1.155 mm! Key problem standard
    },
    damageDescription: 'Deeply penetrating diagnostic/industrial beam. Ejects core atomic electrons, causing extensive chromosome fragmentation.',
  },
  gamma: {
    key: 'gamma',
    name: 'Gamma Rays (1 MeV)',
    subLabel: '1.0 MeV Nuclear Photon',
    category: 'Deeply Penetrating Ionizing',
    energyEV: 1000000,
    energyLabel: '1.0 MeV (1,000,000 eV)',
    frequency: '2.42 × 10²⁰ Hz',
    wavelength: '0.00124 nm (1.24 pm)',
    isIonizing: true,
    damageMechanism: 'Compton scattering & pair production',
    cellularEffect: 'ionization_dna_break',
    hazardRating: 'severe_hazard',
    doseRate1m: 13.5, // mSv/h at 1m unshielded
    color: '#f43f5e', // Rose
    waveColor: '#fb7185',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    freqVisual: 8,
    mu: {
      air: 0.00008,
      paper: 0.065,
      tissue: 0.070, // HVL ~ 9.9 cm
      al: 0.165,     // HVL ~ 4.20 cm
      concrete: 0.150, // HVL ~ 4.62 cm
      lead: 0.771,     // HVL ~ 0.899 cm = 9.0 mm
    },
    damageDescription: 'Mass-energy penetrating nuclear photon. Creates dense ionization clusters, lethal double-strand DNA cleavage, and acute radiation sickness.',
  },
};

// ==========================================
// 2. ABSORBER MATERIALS DATA
// ==========================================
export const ABSORBER_MATERIALS = {
  air: {
    key: 'air',
    name: 'Air (STP)',
    symbol: 'Air',
    density: '0.0012 g/cm³',
    zEff: 7.6,
    colorClass: 'border-sky-500/40 bg-sky-950/30 text-sky-300',
    slabColor: 'rgba(56, 189, 248, 0.08)',
    slabBorder: '#0284c7',
    description: 'Atmospheric gas layer. Near zero attenuation across standard lab thicknesses.',
  },
  paper: {
    key: 'paper',
    name: 'Paper / Plastic',
    symbol: 'Cellulose / Poly',
    density: '0.95 g/cm³',
    zEff: 6.2,
    colorClass: 'border-amber-500/40 bg-amber-950/30 text-amber-200',
    slabColor: 'rgba(217, 119, 6, 0.35)',
    slabBorder: '#d97706',
    description: 'Low-Z organic matter. Completely stops UV and soft particulate radiation; highly transparent to X and Gamma.',
  },
  tissue: {
    key: 'tissue',
    name: 'Human Soft Tissue',
    symbol: 'Muscle / Organ',
    density: '1.04 g/cm³',
    zEff: 7.5,
    colorClass: 'border-rose-500/40 bg-rose-950/30 text-rose-200',
    slabColor: 'rgba(225, 29, 72, 0.35)',
    slabBorder: '#e11d48',
    description: 'Equivalent to human flesh. Moderate attenuation for diagnostic X-rays; low attenuation for Gamma.',
  },
  al: {
    key: 'al',
    name: 'Aluminum (Al)',
    symbol: 'Al (Z=13)',
    density: '2.70 g/cm³',
    zEff: 13.0,
    colorClass: 'border-slate-400/40 bg-slate-900/50 text-slate-200',
    slabColor: 'rgba(148, 163, 184, 0.5)',
    slabBorder: '#94a3b8',
    description: 'Light structural metal. Standard X-ray tube filter to eliminate soft, non-diagnostic skin-dose photons.',
  },
  concrete: {
    key: 'concrete',
    name: 'Standard Concrete',
    symbol: 'Concrete',
    density: '2.35 g/cm³',
    zEff: 12.2,
    colorClass: 'border-zinc-500/40 bg-zinc-900/50 text-zinc-300',
    slabColor: 'rgba(113, 113, 122, 0.65)',
    slabBorder: '#71717a',
    description: 'Structural shielding for radiotherapy bunkers, nuclear reactors, and high-energy accelerator walls.',
  },
  lead: {
    key: 'lead',
    name: 'Dense Lead (Pb)',
    symbol: 'Pb (Z=82)',
    density: '11.34 g/cm³',
    zEff: 82.0,
    colorClass: 'border-indigo-500/50 bg-indigo-950/50 text-indigo-200',
    slabColor: 'rgba(99, 102, 241, 0.75)',
    slabBorder: '#6366f1',
    description: 'Dense heavy element (Z=82). Highest photoelectric cross-section; standard diagnostic apron and gamma shield.',
  },
};

// ==========================================
// 3. SHIELDING CALCULATION CHALLENGES
// ==========================================
export const CHALLENGES = [
  {
    id: 'lead_100k_5percent',
    title: 'Challenge 1: Attenuate 100 keV X-Rays Below 5%',
    prompt:
      'A radiological facility uses 100 keV X-rays. For Dense Lead at 100 keV, the linear attenuation coefficient is µ = 6.00 cm⁻¹ (HVL = 1.155 mm). Calculate the minimum lead thickness required (in mm) to attenuate the beam to under 5.0% (I/I₀ ≤ 0.05).',
    targetMm: 5.0,
    targetToleranceMm: 0.35,
    unit: 'mm',
    defaultRad: 'xray_100k',
    defaultMat: 'lead',
    hint: 'Use the Beer-Lambert law: I/I₀ = exp(-µ·x) ≤ 0.05. Take the natural logarithm: -µ·x ≤ ln(0.05) ≈ -2.9957. Then x ≥ 2.9957 / µ.',
    derivationSteps: [
      'Step 1: Set up Beer-Lambert inequality: I(x) / I₀ = exp(-µ·x) ≤ 0.05',
      'Step 2: Take natural logarithm: -µ·x ≤ ln(0.05) = -2.99573',
      'Step 3: Solve for thickness x (in cm): x ≥ 2.99573 / 6.00 cm⁻¹ = 0.49929 cm',
      'Step 4: Convert to millimeters: x ≥ 0.49929 cm × 10 mm/cm ≈ 4.99 mm ≈ 5.0 mm',
      'Alternative via HVLs: n = ln(20)/ln(2) = 2.9957/0.69315 ≈ 4.322 HVLs. x = 4.322 × 1.155 mm = 4.99 mm.',
      'Conclusion: A 5.0 mm lead shield reduces 100 keV beam intensity to 4.98%, safely below the 5% threshold!',
    ],
  },
  {
    id: 'hospital_apron_4hvl',
    title: 'Challenge 2: Clinical Radiology Lead Apron (4 HVLs)',
    prompt:
      'Diagnostic dental X-rays (50 keV) have a Lead Half-Value Layer HVL = 0.30 mm. How thick must a lead apron be (in mm) to block 93.75% of the beam (leaving exactly 6.25% or 1/16 transmitted)?',
    targetMm: 1.20,
    targetToleranceMm: 0.15,
    unit: 'mm',
    defaultRad: 'xray_50k',
    defaultMat: 'lead',
    hint: 'How many halvings give 1/16? (1/2)⁴ = 1/16, so n = 4 half-value layers. What is 4 × HVL?',
    derivationSteps: [
      'Step 1: Required transmission fraction: I / I₀ = 6.25% = 0.0625 = 1/16',
      'Step 2: Express in powers of 1/2: (1/2)ⁿ = 1/16 = (1/2)⁴ ⟹ n = 4 HVLs',
      'Step 3: Multiply by HVL: x = n × HVL = 4 × 0.30 mm = 1.20 mm',
      'Conclusion: A 1.2 mm lead protective apron provides 4 HVLs of attenuation, blocking 93.75% of 50 keV X-rays.',
    ],
  },
  {
    id: 'gamma_concrete_bunker',
    title: 'Challenge 3: Cobalt-60 Teletherapy Concrete Bunker',
    prompt:
      'For 1.0 MeV Gamma rays passing through standard concrete, HVL = 4.62 cm (µ = 0.150 cm⁻¹). What thickness of concrete wall (in cm) is required to reduce the gamma radiation intensity to 12.5% (1/8)?',
    targetMm: 13.86, // 13.86 cm
    targetToleranceMm: 0.8,
    unit: 'cm',
    defaultRad: 'gamma',
    defaultMat: 'concrete',
    hint: '12.5% is 1/8. Since 2³ = 8, exactly 3 Half-Value Layers are required: x = 3 × HVL.',
    derivationSteps: [
      'Step 1: Required transmission fraction: I / I₀ = 12.5% = 0.125 = 1/8',
      'Step 2: Determine number of HVLs: (1/2)ⁿ = 1/8 ⟹ n = 3 half-value layers',
      'Step 3: Calculate barrier thickness: x = 3 × 4.62 cm = 13.86 cm (≈ 13.9 cm)',
      'Conclusion: A 13.9 cm solid concrete bunker wall reduces intense 1.0 MeV gamma flux down to 12.5%.',
    ],
  },
];

// ==========================================
// 4. AUDIO SYNTHESIZER (GEIGER & PHOTODETECTOR)
// ==========================================
class SimulationAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.clickTimer = null;
    this.gainNode = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (!muted && this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playGeigerClick() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();

      // Sharp Geiger pulse sound: high initial crackle dropping rapidly
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400 + Math.random() * 600, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.005);

      clickGain.gain.setValueAtTime(0.25, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.006);

      osc.connect(clickGain);
      clickGain.connect(this.gainNode || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.007);
    } catch (_) {}
  }

  playPhotodetectorTone(freq) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const toneGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      toneGain.gain.setValueAtTime(0.04, now);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(toneGain);
      toneGain.connect(this.gainNode || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (_) {}
  }

  destroy() {
    if (this.clickTimer) clearInterval(this.clickTimer);
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (_) {}
      this.ctx = null;
    }
  }
}

// ==========================================
// 5. MAIN COMPONENT: RadiationShieldingSim
// ==========================================
export default function RadiationShieldingSim({ config = {}, onTelemetry }) {
  // Navigation Tabs: 'lab' (macro attenuation) | 'cellular' (micro mechanism) | 'alara' (radiation safety) | 'challenge' (interactive derivation)
  const [activeTab, setActiveTab] = useState(config.initialTab || 'lab');

  // Simulation Controls
  const [selectedRadiationKey, setSelectedRadiationKey] = useState(config.initialRadiation || 'xray_50k');
  const [selectedMaterialKey, setSelectedMaterialKey] = useState(config.initialMaterial || 'lead');
  
  // Thickness in centimeters: default 0.20 cm = 2.0 mm
  const [thicknessCm, setThicknessCm] = useState(0.20);
  const [sliderUnit, setSliderUnit] = useState('mm'); // 'mm' or 'cm' display preference
  
  // ALARA Sandbox controls
  const [distanceMeters, setDistanceMeters] = useState(1.5);
  const [exposureMinutes, setExposureMinutes] = useState(15);

  // Playback & Sound State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [sensorBeepFlash, setSensorBeepFlash] = useState(false);

  // Challenge Mode State
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [userAnswerStr, setUserAnswerStr] = useState('');
  const [challengeStatus, setChallengeStatus] = useState(null); // 'correct' | 'incorrect' | null
  const [showChallengeSteps, setShowChallengeSteps] = useState(false);

  // Inquiry / Predict Drawer
  const [showPredictDrawer, setShowPredictDrawer] = useState(false);
  const [predictChoice, setPredictChoice] = useState(null);
  const [predictResult, setPredictResult] = useState(null);

  // Audio Engine Ref
  const audioRef = useRef(null);
  const animTimeRef = useRef(0);
  const animFrameRef = useRef(null);
  const [, setTick] = useState(0);

  // Derived Radiation & Material objects
  const rad = RADIATION_TYPES[selectedRadiationKey] || RADIATION_TYPES.xray_50k;
  const mat = ABSORBER_MATERIALS[selectedMaterialKey] || ABSORBER_MATERIALS.lead;

  // Linear Attenuation Coefficient µ (in cm⁻¹)
  const mu = rad.mu[selectedMaterialKey] || 0.0001;

  // Half-Value Layer HVL = ln(2) / µ (in cm)
  const hvlCm = mu > 0.000001 ? Math.log(2) / mu : 999999;
  const hvlMm = hvlCm * 10;

  // Tenth-Value Layer TVL = ln(10) / µ (in cm)
  const tvlCm = mu > 0.000001 ? Math.log(10) / mu : 999999;
  const tvlMm = tvlCm * 10;

  // Beer-Lambert Exponential Attenuation Law:
  // I(x) / I₀ = exp(-µ * x) = (1/2)^(x / HVL)
  const transmissionRatio = Math.max(0, Math.min(1, Math.exp(-mu * thicknessCm)));
  const transmissionPercent = transmissionRatio * 100;
  const absorbedPercent = 100 - transmissionPercent;

  // Half-Value Layers passed: n = x / HVL
  const hvlCount = hvlCm < 99999 ? thicknessCm / hvlCm : 0;
  const attenuationFactor = transmissionRatio > 0 ? 1 / transmissionRatio : 999999;

  // ALARA Combined Dose Rate:
  // D_rate = D₀ * (d₀ / d)² * exp(-µ * x)
  const unshieldedDoseRate1m = rad.doseRate1m; // mSv/h at 1 meter
  const distanceReductionFactor = Math.pow(1.0 / Math.max(0.5, distanceMeters), 2);
  const attenuatedDoseRate_mSvH = unshieldedDoseRate1m * distanceReductionFactor * transmissionRatio;
  const attenuatedDoseRate_uSvH = attenuatedDoseRate_mSvH * 1000;

  // Cumulative Dose D = D_rate * time (hours)
  const exposureHours = exposureMinutes / 60;
  const cumulativeDose_mSv = attenuatedDoseRate_mSvH * exposureHours;
  const cumulativeDose_uSv = cumulativeDose_mSv * 1000;

  // Current Challenge Object
  const currentChallenge = CHALLENGES[currentChallengeIndex];

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new SimulationAudioEngine();
    return () => {
      if (audioRef.current) audioRef.current.destroy();
    };
  }, []);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.init();
    const newMuted = !isAudioMuted;
    setIsAudioMuted(newMuted);
    audioRef.current.setMuted(newMuted);
  }, [isAudioMuted]);

  // Geiger Counter / Detector Audio Loop
  useEffect(() => {
    if (!isPlaying) return;

    let intervalId = null;
    if (rad.isIonizing) {
      // Ionizing beam: Poisson/random clicks proportional to transmitted flux
      // At 100% transmission -> ~25-45 clicks/sec (every 25-40ms)
      // At 0% transmission -> background clicks ~ 1 click per 1.5 sec
      const clickDelayBase = Math.max(30, 1500 - transmissionRatio * 1460);
      const scheduleClick = () => {
        const jitter = (Math.random() - 0.5) * (clickDelayBase * 0.4);
        const delay = Math.max(15, clickDelayBase + jitter);
        intervalId = setTimeout(() => {
          if (audioRef.current && !isAudioMuted) {
            audioRef.current.playGeigerClick();
          }
          setSensorBeepFlash(true);
          setTimeout(() => setSensorBeepFlash(false), 25);
          scheduleClick();
        }, delay);
      };
      scheduleClick();
    } else {
      // Non-ionizing beam: photodetector pitch pulses
      const pulseDelay = Math.max(60, 800 - transmissionRatio * 720);
      const detectorPitch = 240 + transmissionRatio * 480;
      intervalId = setInterval(() => {
        if (transmissionPercent > 0.5) {
          if (audioRef.current && !isAudioMuted) {
            audioRef.current.playPhotodetectorTone(detectorPitch);
          }
          setSensorBeepFlash(true);
          setTimeout(() => setSensorBeepFlash(false), 30);
        }
      }, pulseDelay);
    }

    return () => {
      if (rad.isIonizing) clearTimeout(intervalId);
      else clearInterval(intervalId);
    };
  }, [isPlaying, isAudioMuted, rad.isIonizing, transmissionRatio, transmissionPercent]);

  // Animation Loop (requestAnimationFrame)
  useEffect(() => {
    let last = performance.now();
    const loop = (now) => {
      if (isPlaying) {
        const delta = (now - last) / 1000;
        animTimeRef.current += delta;
        setTick((t) => (t + 1) % 10000);
      }
      last = now;
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying]);

  // Telemetry callback when shielding parameters change
  useEffect(() => {
    if (onTelemetry) {
      onTelemetry('radiation_shielding_updated', {
        radiation: selectedRadiationKey,
        material: selectedMaterialKey,
        thicknessCm: Number(thicknessCm.toFixed(3)),
        transmissionPercent: Number(transmissionPercent.toFixed(2)),
        hvlCount: Number(hvlCount.toFixed(2)),
      });
    }
  }, [selectedRadiationKey, selectedMaterialKey, thicknessCm, transmissionPercent, hvlCount, onTelemetry]);

  // Restore Default Parameters
  const handleReset = () => {
    setSelectedRadiationKey('xray_50k');
    setSelectedMaterialKey('lead');
    setThicknessCm(0.20);
    setSliderUnit('mm');
    setDistanceMeters(1.5);
    setExposureMinutes(15);
    setUserAnswerStr('');
    setChallengeStatus(null);
    setShowChallengeSteps(false);
    setShowPredictDrawer(false);
    setPredictChoice(null);
    setPredictResult(null);
  };

  // Quick Presets
  const setThicknessHvl = (multiplier) => {
    if (hvlCm > 0 && hvlCm < 1000) {
      const newCm = Math.min(20, Math.max(0, hvlCm * multiplier));
      setThicknessCm(Number(newCm.toFixed(4)));
    }
  };

  // Challenge Verification
  const handleVerifyChallenge = (e) => {
    if (e) e.preventDefault();
    const val = parseFloat(userAnswerStr);
    if (isNaN(val)) return;

    const target = currentChallenge.targetMm;
    const tol = currentChallenge.targetToleranceMm;
    const isCorrect = Math.abs(val - target) <= tol;

    setChallengeStatus(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect && onTelemetry) {
      onTelemetry('shielding_challenge_solved', { challengeId: currentChallenge.id, answer: val });
    }
  };

  // Apply Challenge Target directly to Shielding Simulator
  const applyChallengeToSim = () => {
    setSelectedRadiationKey(currentChallenge.defaultRad);
    setSelectedMaterialKey(currentChallenge.defaultMat);
    if (currentChallenge.unit === 'mm') {
      setThicknessCm(currentChallenge.targetMm / 10);
      setSliderUnit('mm');
    } else {
      setThicknessCm(currentChallenge.targetMm);
      setSliderUnit('cm');
    }
    setActiveTab('lab');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none pb-12">
      {/* ========================================================
          TOP HEADER: Lab Title, Real-time Status, & Action Bar
          ======================================================== */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3.5 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400 shadow-inner">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                Physics Form 4 • Topic 4
              </span>
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                Lesson 246: Radiation Shielding & Hazards
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Radiation Attenuation, Penetration & Shielding Simulator
            </h1>
          </div>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Audio Geiger Mute / Unmute */}
          <button
            onClick={toggleAudio}
            title={isAudioMuted ? 'Unmute Geiger / Detector Audio' : 'Mute Audio'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              isAudioMuted
                ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-950'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-bounce" />}
            <span className="hidden md:inline">{isAudioMuted ? 'Muted' : 'Sound ON'}</span>
          </button>

          {/* Pause / Play */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {/* Reset All */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-xs font-bold transition-colors"
            title="Reset to default diagnostic X-ray with 2.0 mm Lead"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          NAVIGATION TABS
          ======================================================== */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('lab')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'lab'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40 border border-cyan-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>1. Attenuation & Shielding Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('cellular')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'cellular'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 border border-purple-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Dna className="w-4 h-4" />
            <span>2. Cellular & Molecular Damage View</span>
          </button>

          <button
            onClick={() => setActiveTab('alara')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'alara'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40 border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. ALARA Protection Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('challenge')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'challenge'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40 border border-rose-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>4. Shielding Calculation Challenges</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          MAIN VIEWPORT CONTAINER
          ======================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* ====================================================
            TAB 1: ATTENUATION & SHIELDING LAB
            ==================================================== */}
        {activeTab === 'lab' && (
          <div className="space-y-6">
            {/* Top Quick Formula & Inquiry Callout */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-cyan-400 text-sm tracking-wide">
                    BEER-LAMBERT ATTENUATION LAW:
                  </span>
                  <code className="bg-slate-950 px-2.5 py-0.5 rounded text-xs text-amber-300 font-mono border border-slate-800">
                    I(x) = I₀ · e^(-µ·x) = I₀ · (1/2)^(x / HVL)
                  </code>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Radiation intensity decreases exponentially as absorber thickness increases. Each Half-Value Layer
                  (HVL = ln 2 / µ) halves the transmitted photon flux.
                </p>
              </div>

              {/* Predict Trigger Button */}
              <button
                onClick={() => setShowPredictDrawer(!showPredictDrawer)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/90 text-xs font-bold transition-all self-stretch md:self-auto justify-center"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{showPredictDrawer ? 'Hide Hypothesis' : 'Predict & Test'}</span>
              </button>
            </div>

            {/* Predict Hypothesis Drawer */}
            {showPredictDrawer && (
              <div className="bg-indigo-950/40 border border-indigo-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Physics Prediction Challenge: Causal Mechanism
                  </h4>
                  <button
                    onClick={() => setShowPredictDrawer(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  "If you have 50 keV diagnostic X-rays and insert 1.2 mm of Lead (4 HVLs), what percentage of radiation will penetrate to reach the detector?"
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'a', text: '50% (Half stops, half continues)', correct: false },
                    { id: 'b', text: '6.25% (Halved 4 consecutive times: 1/16)', correct: true },
                    { id: 'c', text: '0% (Lead stops 100% of all radiation instantly)', correct: false },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setPredictChoice(option.id);
                        setPredictResult(option.correct ? 'correct' : 'incorrect');
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        predictChoice === option.id
                          ? option.correct
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950 border-rose-500 text-rose-200'
                          : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-indigo-400'
                      }`}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
                {predictResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      predictResult === 'correct'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                        : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                    }`}
                  >
                    {predictResult === 'correct' ? (
                      <p className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        Excellent prediction! Exponential attenuation means (1/2)⁴ = 1/16 = 6.25%. Attenuation is never linear!
                      </p>
                    ) : (
                      <p className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        Not quite! Attenuation is exponential: each HVL halves the remainder. After 4 HVLs: 100% → 50% → 25% → 12.5% → 6.25%.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Main Interactive Stage Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Visual Collimator & Shielding Canvas (7 Cols) */}
              <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                        Collimated Beam & Penetration Stage
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${sensorBeepFlash ? 'bg-emerald-400 ring-4 ring-emerald-400/30' : 'bg-slate-600'} transition-all`} />
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                        Sensor: {transmissionPercent < 0.1 ? 'BLOCKED' : `${transmissionPercent.toFixed(1)}% Flux`}
                      </span>
                    </div>
                  </div>

                  {/* SVG Physical Simulation Stage */}
                  <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 my-4 shadow-inner">
                    <svg
                      viewBox="0 0 760 360"
                      className="w-full h-full"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <defs>
                        {/* Radioactive source warning hatch */}
                        <radialGradient id="sourceGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor={rad.glowColor} />
                          <stop offset="100%" stopColor="transparent" />
                        </radialGradient>

                        {/* Slab Material Pattern */}
                        <pattern id="leadPattern" width="12" height="12" patternUnits="userSpaceOnUse">
                          <path d="M 0 12 L 12 0 M 6 12 L 12 6 M 0 6 L 6 0" stroke="#4f46e5" strokeWidth="0.75" opacity="0.4" />
                        </pattern>
                        <pattern id="concretePattern" width="10" height="10" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="1" fill="#a1a1aa" opacity="0.3" />
                          <circle cx="7" cy="7" r="1.5" fill="#a1a1aa" opacity="0.3" />
                        </pattern>
                      </defs>

                      {/* Optical bench reference grid */}
                      <line x1="40" y1="310" x2="720" y2="310" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                      <text x="40" y="328" fill="#64748b" fontSize="10" fontFamily="monospace">x = 0 cm (Emitter)</text>
                      <text x="360" y="328" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">Shield Barrier</text>
                      <text x="680" y="328" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">Detector (d = {distanceMeters.toFixed(1)} m)</text>

                      {/* Collimator / Radiation Source Box (Left) */}
                      <g transform="translate(30, 110)">
                        <rect x="0" y="0" width="70" height="140" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                        <rect x="60" y="45" width="20" height="50" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                        
                        {/* Trefoil radiation warning emblem */}
                        <circle cx="35" cy="70" r="16" fill="#facc15" />
                        <circle cx="35" cy="70" r="4.5" fill="#0f172a" />
                        <path d="M 35 70 L 25 45 A 25 25 0 0 1 45 45 Z" fill="#0f172a" />
                        <path d="M 35 70 L 53 82 A 25 25 0 0 1 42 98 Z" fill="#0f172a" />
                        <path d="M 35 70 L 17 82 A 25 25 0 0 0 28 98 Z" fill="#0f172a" />

                        {/* Source Label */}
                        <text x="35" y="124" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
                          EM SOURCE
                        </text>
                        <text x="35" y="24" fill={rad.color} fontSize="9" fontWeight="bold" textAnchor="middle">
                          {rad.category === 'Ionizing Radiation' ? 'IONIZING' : 'BEAM'}
                        </text>

                        {/* Emission Glow */}
                        <circle cx="75" cy="70" r="28" fill="url(#sourceGlow)" />
                      </g>

                      {/* Shielding Absorber Slab (Center) */}
                      {(() => {
                        const slabStartX = 320;
                        // Map thickness (0 to 20 cm) to visual width (0 to 180 px)
                        const visualWidth = Math.max(3, Math.min(180, (thicknessCm / 20) * 180));

                        return (
                          <g>
                            {/* Material Slab */}
                            {thicknessCm > 0.001 ? (
                              <>
                                <rect
                                  x={slabStartX}
                                  y="70"
                                  width={visualWidth}
                                  height="220"
                                  rx="4"
                                  fill={mat.slabColor}
                                  stroke={mat.slabBorder}
                                  strokeWidth="2"
                                />
                                {selectedMaterialKey === 'lead' && (
                                  <rect
                                    x={slabStartX}
                                    y="70"
                                    width={visualWidth}
                                    height="220"
                                    rx="4"
                                    fill="url(#leadPattern)"
                                  />
                                )}
                                {selectedMaterialKey === 'concrete' && (
                                  <rect
                                    x={slabStartX}
                                    y="70"
                                    width={visualWidth}
                                    height="220"
                                    rx="4"
                                    fill="url(#concretePattern)"
                                  />
                                )}

                                {/* Dimension Callout */}
                                <line
                                  x1={slabStartX}
                                  y1="55"
                                  x2={slabStartX + visualWidth}
                                  y2="55"
                                  stroke="#38bdf8"
                                  strokeWidth="1.5"
                                />
                                <text
                                  x={slabStartX + visualWidth / 2}
                                  y="48"
                                  fill="#38bdf8"
                                  fontSize="10"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                >
                                  {sliderUnit === 'mm'
                                    ? `${(thicknessCm * 10).toFixed(1)} mm`
                                    : `${thicknessCm.toFixed(2)} cm`}
                                </text>
                              </>
                            ) : (
                              /* Zero Shielding Indicator */
                              <rect
                                x={slabStartX}
                                y="70"
                                width="4"
                                height="220"
                                fill="transparent"
                                stroke="#475569"
                                strokeDasharray="3 3"
                              />
                            )}

                            {/* Material Name & Properties Tag */}
                            <text
                              x={slabStartX + visualWidth / 2}
                              y="302"
                              fill="#f8fafc"
                              fontSize="10"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {mat.name}
                            </text>
                          </g>
                        );
                      })()}

                      {/* Radiation Detector Stand & Geiger Probe (Right) */}
                      {(() => {
                        const slabStartX = 320;
                        const visualWidth = Math.max(3, Math.min(180, (thicknessCm / 20) * 180));
                        // Position detector along the track based on distanceMeters
                        const detectorX = Math.min(710, Math.max(slabStartX + visualWidth + 40, 520 + ((distanceMeters - 0.5) / 9.5) * 180));

                        return (
                          <g transform={`translate(${detectorX}, 80)`}>
                            {/* Stand */}
                            <rect x="18" y="40" width="16" height="180" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                            <polygon points="10,220 42,220 26,200" fill="#334155" />

                            {/* Geiger / Photodiode Sensor Head */}
                            <rect x="-10" y="75" width="28" height="36" rx="4" fill="#090d16" stroke="#38bdf8" strokeWidth="2" />
                            <circle
                              cx="4"
                              cy="93"
                              r="5"
                              fill={sensorBeepFlash ? '#38bdf8' : transmissionPercent > 50 ? '#f43f5e' : '#10b981'}
                              className={sensorBeepFlash ? 'animate-ping' : ''}
                            />

                            {/* Digital Meter Screen on Detector */}
                            <rect x="6" y="10" width="56" height="52" rx="4" fill="#020617" stroke="#475569" strokeWidth="1.5" />
                            <text x="34" y="24" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
                              TRANSMISSION
                            </text>
                            <text
                              x="34"
                              y="42"
                              fill={transmissionPercent > 20 ? '#f43f5e' : transmissionPercent > 5 ? '#f59e0b' : '#34d399'}
                              fontSize="12"
                              fontWeight="extrabold"
                              fontFamily="monospace"
                              textAnchor="middle"
                            >
                              {transmissionPercent < 0.1 ? '<0.1%' : `${transmissionPercent.toFixed(1)}%`}
                            </text>
                            <text x="34" y="55" fill="#64748b" fontSize="7" textAnchor="middle">
                              {rad.isIonizing ? 'DOSE DETECTED' : 'LIGHT FLUX'}
                            </text>
                          </g>
                        );
                      })()}

                      {/* Animated Photon Wave Ray Stream */}
                      {(() => {
                        const slabStartX = 320;
                        const visualWidth = Math.max(3, Math.min(180, (thicknessCm / 20) * 180));
                        const detectorX = Math.min(710, Math.max(slabStartX + visualWidth + 40, 520 + ((distanceMeters - 0.5) / 9.5) * 180));

                        // 8 ray channels representing incident flux I₀
                        const rays = [125, 145, 165, 180, 195, 210, 225, 245];
                        // Number of rays that penetrate through based on transmissionRatio
                        const transmittedRayCount = Math.round(transmissionRatio * rays.length);

                        return rays.map((y, idx) => {
                          const isTransmitted = idx < transmittedRayCount;
                          const speed = rad.freqVisual * 120;
                          const offset = ((animTimeRef.current * speed + idx * 45) % (detectorX - 100));
                          const curX = 100 + offset;

                          const isPastSlab = curX > slabStartX + visualWidth;
                          if (!isTransmitted && isPastSlab) return null;

                          return (
                            <g key={idx}>
                              {/* Incident Beam Ray Line */}
                              <line
                                x1="100"
                                y1={y}
                                x2={isTransmitted ? detectorX : slabStartX + visualWidth * 0.4}
                                y2={y}
                                stroke={rad.waveColor}
                                strokeWidth={isTransmitted ? '1.5' : '0.75'}
                                strokeDasharray={isTransmitted ? '4 2' : '1 3'}
                                opacity={isTransmitted ? 0.85 : 0.4}
                              />

                              {/* Moving Photon Pulse Packet */}
                              <circle
                                cx={curX}
                                cy={y + Math.sin(animTimeRef.current * 8 + idx) * (rad.freqVisual < 3 ? 3 : 1)}
                                r={rad.isIonizing ? 2.2 : 3}
                                fill={rad.color}
                                filter="drop-shadow(0 0 4px currentColor)"
                              />
                            </g>
                          );
                        });
                      })()}
                    </svg>
                  </div>
                </div>

                {/* Bottom Real-time Meter HUD */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Transmission (I/I₀)</span>
                    <span className={`text-base font-extrabold font-mono ${transmissionPercent > 25 ? 'text-rose-400' : transmissionPercent > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {transmissionPercent.toFixed(2)}%
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Absorbed Flux</span>
                    <span className="text-base font-extrabold font-mono text-cyan-400">
                      {absorbedPercent.toFixed(2)}%
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Half-Value Layers (n)</span>
                    <span className="text-base font-extrabold font-mono text-purple-400">
                      {hvlCount < 100 ? `${hvlCount.toFixed(2)} HVLs` : '>100'}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Attenuation Factor</span>
                    <span className="text-base font-extrabold font-mono text-amber-400">
                      {attenuationFactor > 10000 ? '>10,000×' : `${attenuationFactor.toFixed(1)}×`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Parameters & Controls (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Radiation Beam Selector */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      1. Incident EM Radiation Type
                    </label>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rad.isIonizing ? 'bg-rose-950/80 text-rose-300 border-rose-800/60' : 'bg-sky-950/80 text-sky-300 border-sky-800/60'}`}>
                      {rad.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(RADIATION_TYPES).map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setSelectedRadiationKey(item.key)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          selectedRadiationKey === item.key
                            ? 'bg-slate-800 border-cyan-400 shadow-md text-white ring-1 ring-cyan-400/50'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold block truncate">{item.name}</span>
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">{item.energyLabel}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selected Radiation Info Banner */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/90 text-xs space-y-1">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Frequency: <strong className="text-slate-200">{rad.frequency}</strong></span>
                      <span>Wavelength: <strong className="text-slate-200">{rad.wavelength}</strong></span>
                    </div>
                    <p className="text-[11px] text-slate-400 pt-1 leading-snug">
                      <strong className="text-slate-200">Interaction:</strong> {rad.damageMechanism}
                    </p>
                  </div>
                </div>

                {/* Absorber Material Selector */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      2. Shielding Absorber Material
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">
                      Density: {mat.density}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(ABSORBER_MATERIALS).map((material) => (
                      <button
                        key={material.key}
                        onClick={() => setSelectedMaterialKey(material.key)}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          selectedMaterialKey === material.key
                            ? 'bg-slate-800 border-indigo-400 text-white ring-1 ring-indigo-400/50 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-extrabold block truncate">{material.symbol}</span>
                        <span className="text-[9px] text-slate-400 block truncate">{material.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Attenuation Coefficients (µ and HVL) */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Linear Attenuation (µ)</span>
                      <strong className="font-mono text-cyan-300 text-xs">
                        {mu > 1000 ? '>1000 cm⁻¹' : `${mu.toFixed(4)} cm⁻¹`}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Half-Value Layer (HVL)</span>
                      <strong className="font-mono text-purple-300 text-xs">
                        {hvlMm < 1 ? `${hvlMm.toFixed(3)} mm` : hvlCm < 100 ? `${hvlCm.toFixed(2)} cm` : '>100 cm'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Shield Thickness Slider with mm/cm units */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      3. Shield Thickness (x)
                    </label>

                    {/* Unit Switcher: mm / cm */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                      <button
                        onClick={() => setSliderUnit('mm')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${sliderUnit === 'mm' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
                      >
                        mm
                      </button>
                      <button
                        onClick={() => setSliderUnit('cm')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${sliderUnit === 'cm' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
                      >
                        cm
                      </button>
                    </div>
                  </div>

                  {/* Primary Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-black text-white font-mono">
                        {sliderUnit === 'mm' ? `${(thicknessCm * 10).toFixed(1)} mm` : `${thicknessCm.toFixed(2)} cm`}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({(thicknessCm / (hvlCm || 1)).toFixed(2)} × HVL)
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.05"
                      value={thicknessCm}
                      onChange={(e) => setThicknessCm(parseFloat(e.target.value))}
                      className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />

                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>0 mm (Unshielded)</span>
                      <span>10 cm</span>
                      <span>20 cm (Max)</span>
                    </div>
                  </div>

                  {/* Quick HVL Presets */}
                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Theoretical HVL Presets:</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        onClick={() => setThicknessCm(0)}
                        className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] font-semibold text-slate-300"
                      >
                        0 (None)
                      </button>
                      <button
                        onClick={() => setThicknessHvl(1)}
                        className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] font-semibold text-purple-300"
                      >
                        1 HVL (50%)
                      </button>
                      <button
                        onClick={() => setThicknessHvl(2)}
                        className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] font-semibold text-purple-300"
                      >
                        2 HVL (25%)
                      </button>
                      <button
                        onClick={() => setThicknessHvl(4)}
                        className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] font-semibold text-purple-300"
                      >
                        4 HVL (6.25%)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Live Exponential Attenuation Curve */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Live Exponential Attenuation Profile: I(x) vs Absorber Thickness (x)
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Current Point: x = {thicknessCm.toFixed(2)} cm, I = {transmissionPercent.toFixed(1)}%
                </span>
              </div>

              {/* Attenuation Graph SVG */}
              <div className="w-full h-44 bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden">
                <svg viewBox="0 0 800 160" className="w-full h-full" preserveAspectRatio="none">
                  {/* Graph Grid Lines */}
                  {[0, 25, 50, 75, 100].map((pct) => {
                    const y = 140 - (pct / 100) * 120;
                    return (
                      <g key={pct}>
                        <line x1="60" y1={y} x2="780" y2={y} stroke="#1e293b" strokeWidth="1" />
                        <text x="50" y={y + 3} fill="#64748b" fontSize="9" textAnchor="end">
                          {pct}%
                        </text>
                      </g>
                    );
                  })}

                  {/* 50% HVL Reference line */}
                  <line x1="60" y1="80" x2="780" y2="80" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <text x="775" y="75" fill="#c084fc" fontSize="9" textAnchor="end">
                    1 HVL Threshold (50%)
                  </text>

                  {/* Exponential Curve Path */}
                  {(() => {
                    let d = 'M 60 20 ';
                    const steps = 80;
                    for (let i = 0; i <= steps; i++) {
                      const curCm = (i / steps) * 20; // 0 to 20 cm
                      const ratio = Math.exp(-mu * curCm);
                      const xPx = 60 + (i / steps) * 720;
                      const yPx = 140 - ratio * 120;
                      d += `L ${xPx.toFixed(1)} ${yPx.toFixed(1)} `;
                    }
                    return (
                      <path
                        d={d}
                        fill="none"
                        stroke={rad.waveColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    );
                  })()}

                  {/* Current Thickness Marker Dot & Guideline */}
                  {(() => {
                    const markerX = 60 + (thicknessCm / 20) * 720;
                    const markerY = 140 - transmissionRatio * 120;

                    return (
                      <g>
                        <line x1={markerX} y1="20" x2={markerX} y2="140" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                        <circle cx={markerX} cy={markerY} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                        <text x={Math.min(740, markerX + 8)} y={Math.max(30, markerY - 8)} fill="#38bdf8" fontSize="10" fontWeight="bold">
                          ({thicknessCm.toFixed(2)} cm, {transmissionPercent.toFixed(1)}%)
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 2: CELLULAR & MOLECULAR DAMAGE VIEW
            ==================================================== */}
        {activeTab === 'cellular' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Dna className="w-5 h-5 text-purple-400" />
                    Cellular & Molecular Damage Mechanics: Photons vs Matter
                  </h3>
                  <p className="text-xs text-slate-400">
                    Observe how electromagnetic photon energy dictates microscopic biophysical consequences: Thermal agitation vs Valence excitation vs DNA Dimerization vs Atomic Ionization.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                    Selected: <strong className="text-cyan-400">{rad.name}</strong> ({rad.energyLabel})
                  </span>
                </div>
              </div>

              {/* Dynamic Mechanistic Interactive Stage */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Visual Canvas of Molecular Interaction (8 Cols) */}
                <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800/90 p-5 flex flex-col justify-between shadow-inner min-h-[380px]">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                    <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                      <Atom className="w-4 h-4 text-cyan-400" />
                      Microscopic Interaction Visualization
                    </span>
                    <span className="text-xs font-bold text-purple-300 font-mono">
                      E = h·f = {rad.energyLabel}
                    </span>
                  </div>

                  {/* Interactive Dynamic SVG for Cellular Effects */}
                  <div className="relative w-full aspect-[16/9] flex items-center justify-center my-3 overflow-hidden">
                    <svg viewBox="0 0 640 320" className="w-full h-full">
                      {/* 1. THERMAL VIBRATION (Microwave / Infrared) */}
                      {rad.cellularEffect === 'thermal_vibration' && (
                        <g>
                          <text x="320" y="35" fill="#fb923c" fontSize="13" fontWeight="bold" textAnchor="middle">
                            DIELECTRIC HEATING & DIPOLE MOLECULAR VIBRATION
                          </text>
                          <text x="320" y="55" fill="#94a3b8" fontSize="11" textAnchor="middle">
                            Photon energy (&lt;0.5 eV) induces rapid molecular rotation; bonds remain intact.
                          </text>

                          {/* 3 Oscillating Water Molecules (H2O) */}
                          {[160, 320, 480].map((cx, i) => {
                            const vibAngle = Math.sin(animTimeRef.current * 14 + i * 2) * 25;
                            return (
                              <g key={i} transform={`translate(${cx}, 170) rotate(${vibAngle})`}>
                                {/* Oxygen Central Atom */}
                                <circle cx="0" cy="0" r="24" fill="#ef4444" stroke="#f87171" strokeWidth="2" />
                                <text x="0" y="5" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
                                  O δ⁻
                                </text>

                                {/* Hydrogen Atom 1 */}
                                <line x1="0" y1="0" x2="-35" y2="35" stroke="#cbd5e1" strokeWidth="4" />
                                <circle cx="-35" cy="35" r="14" fill="#38bdf8" stroke="#93c5fd" strokeWidth="2" />
                                <text x="-35" y="40" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                                  H δ⁺
                                </text>

                                {/* Hydrogen Atom 2 */}
                                <line x1="0" y1="0" x2="35" y2="35" stroke="#cbd5e1" strokeWidth="4" />
                                <circle cx="35" cy="35" r="14" fill="#38bdf8" stroke="#93c5fd" strokeWidth="2" />
                                <text x="35" y="40" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                                  H δ⁺
                                </text>

                                {/* Vibrational Agitation Waves */}
                                <circle cx="0" cy="0" r="45" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                              </g>
                            );
                          })}

                          {/* Temperature Indicator Bar */}
                          <g transform="translate(180, 270)">
                            <rect x="0" y="0" width="280" height="18" rx="9" fill="#1e293b" stroke="#334155" />
                            <rect x="2" y="2" width="220" height="14" rx="7" fill="url(#tempGrad)" />
                            <defs>
                              <linearGradient id="tempGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#38bdf8" />
                                <stop offset="60%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#ef4444" />
                              </linearGradient>
                            </defs>
                            <text x="140" y="13" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                              Internal Kinetic Energy (Heat) Increasing — ZERO Ionization
                            </text>
                          </g>
                        </g>
                      )}

                      {/* 2. VALENCE ELECTRON TRANSITION (Visible Light) */}
                      {rad.cellularEffect === 'electron_transition' && (
                        <g>
                          <text x="320" y="35" fill="#4ade80" fontSize="13" fontWeight="bold" textAnchor="middle">
                            VALENCE ELECTRON ORBITAL TRANSITION (PHOTOEXCITATION)
                          </text>
                          <text x="320" y="55" fill="#94a3b8" fontSize="11" textAnchor="middle">
                            Green photon (2.48 eV) excites outer electron (n=2 → n=3); harmless de-excitation.
                          </text>

                          {/* Bohr Atom Model */}
                          <g transform="translate(320, 175)">
                            {/* Nucleus */}
                            <circle cx="0" cy="0" r="18" fill="#e11d48" stroke="#fb7185" strokeWidth="2" />
                            <text x="0" y="5" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                              +6e
                            </text>

                            {/* Orbit n=1 */}
                            <circle cx="0" cy="0" r="45" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                            {/* Orbit n=2 */}
                            <circle cx="0" cy="0" r="80" fill="none" stroke="#64748b" strokeWidth="1.5" />
                            {/* Orbit n=3 */}
                            <circle cx="0" cy="0" r="115" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 2" />

                            {/* Orbiting / Transitioning Electron */}
                            {(() => {
                              const transCycle = (animTimeRef.current * 2) % 2;
                              const isExcited = transCycle > 1;
                              const radius = isExcited ? 115 : 80;
                              const eAngle = animTimeRef.current * 3;
                              const ex = Math.cos(eAngle) * radius;
                              const ey = Math.sin(eAngle) * radius;

                              return (
                                <g>
                                  <circle cx={ex} cy={ey} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                                  <text x={ex} y={ey - 10} fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                                    e⁻
                                  </text>
                                </g>
                              );
                            })()}

                            {/* Incident Photon Arrow */}
                            <path d="M -160 -40 Q -100 -20 -80 0" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                            <polygon points="-80,0 -88,-6 -88,6" fill="#22c55e" />
                            <text x="-140" y="-50" fill="#4ade80" fontSize="10" fontWeight="bold">
                              h·f = 2.48 eV
                            </text>
                          </g>

                          <text x="320" y="295" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
                            Retinal photoreceptor isomerization; cell survives with zero genetic trauma.
                          </text>
                        </g>
                      )}

                      {/* 3. DNA THYMINE DIMER MUTATION (UV-A / UV-C) */}
                      {rad.cellularEffect === 'dna_thymine_dimer' && (
                        <g>
                          <text x="320" y="35" fill="#c084fc" fontSize="13" fontWeight="bold" textAnchor="middle">
                            PHOTOCHEMICAL LESION: THYMINE-THYMINE (T-T) DIMERIZATION
                          </text>
                          <text x="320" y="55" fill="#cbd5e1" fontSize="11" textAnchor="middle">
                            UV-C photon (4.96 eV) covalently welds adjacent Thymine bases, creating DNA helix kink.
                          </text>

                          {/* DNA Double Strand Segment */}
                          <g transform="translate(140, 110)">
                            {/* Sugar-Phosphate Backbones */}
                            <path d="M 0 30 Q 80 10 160 50 T 360 40" fill="none" stroke="#38bdf8" strokeWidth="4" />
                            <path d="M 0 110 Q 80 130 160 90 T 360 100" fill="none" stroke="#38bdf8" strokeWidth="4" />

                            {/* Base Pairs */}
                            <line x1="40" y1="26" x2="40" y2="114" stroke="#64748b" strokeWidth="3" />
                            <text x="40" y="20" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">A-T</text>

                            <line x1="100" y1="20" x2="100" y2="120" stroke="#64748b" strokeWidth="3" />
                            <text x="100" y="14" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">G-C</text>

                            {/* Mutated Adjacent Thymine Bases with Covalent Crosslink */}
                            <g transform="translate(180, 0)">
                              {/* Left Thymine */}
                              <rect x="0" y="36" width="28" height="24" rx="4" fill="#a855f7" stroke="#e9d5ff" strokeWidth="2" />
                              <text x="14" y="52" fill="#ffffff" fontSize="11" fontWeight="extrabold" textAnchor="middle">T</text>

                              {/* Right Thymine */}
                              <rect x="36" y="36" width="28" height="24" rx="4" fill="#a855f7" stroke="#e9d5ff" strokeWidth="2" />
                              <text x="50" y="52" fill="#ffffff" fontSize="11" fontWeight="extrabold" textAnchor="middle">T</text>

                              {/* Abnormal Cyclobutane Dimer Bridge */}
                              <rect x="24" y="44" width="16" height="8" rx="2" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" className="animate-pulse" />
                              <text x="32" y="40" fill="#f87171" fontSize="9" fontWeight="bold" textAnchor="middle">DIMER</text>
                            </g>

                            <line x1="280" y1="42" x2="280" y2="98" stroke="#64748b" strokeWidth="3" />
                            <text x="280" y="35" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">C-G</text>
                          </g>

                          {/* Warning callout */}
                          <g transform="translate(160, 245)">
                            <rect x="0" y="0" width="320" height="42" rx="8" fill="#4a044e" stroke="#c084fc" strokeWidth="1.5" />
                            <text x="160" y="18" fill="#f5d0fe" fontSize="10" fontWeight="bold" textAnchor="middle">
                              Helix Distortion Blocks DNA Polymerase Replication!
                            </text>
                            <text x="160" y="32" fill="#f0abfc" fontSize="9" textAnchor="middle">
                              Triggers apoptosis (sunburn) or error-prone repair (skin melanoma mutation).
                            </text>
                          </g>
                        </g>
                      )}

                      {/* 4. ATOM IONIZATION & DOUBLE-STRAND DNA BREAKAGE (X-Ray / Gamma) */}
                      {rad.cellularEffect === 'ionization_dna_break' && (
                        <g>
                          <text x="320" y="32" fill="#f43f5e" fontSize="13" fontWeight="bold" textAnchor="middle">
                            DIRECT IONIZATION & LETHAL DOUBLE-STRAND BREAK (DSB)
                          </text>
                          <text x="320" y="50" fill="#fca5a5" fontSize="11" textAnchor="middle">
                            Photon (&gt;50,000 eV) knocks out inner K-electron, generating free radicals that cleave both DNA strands.
                          </text>

                          {/* Severed DNA Strand Graphics */}
                          <g transform="translate(120, 80)">
                            {/* Left Intact DNA segment */}
                            <g transform="translate(0, 20)">
                              <path d="M 20 20 Q 70 0 120 30" fill="none" stroke="#38bdf8" strokeWidth="4" />
                              <path d="M 20 70 Q 70 90 120 60" fill="none" stroke="#38bdf8" strokeWidth="4" />
                              <line x1="40" y1="18" x2="40" y2="72" stroke="#64748b" strokeWidth="2.5" />
                              <line x1="80" y1="15" x2="80" y2="75" stroke="#64748b" strokeWidth="2.5" />
                            </g>

                            {/* Violent Ionization Collision Point */}
                            <g transform="translate(190, 50)">
                              <circle cx="0" cy="0" r="28" fill="#f43f5e" opacity="0.25" className="animate-ping" />
                              <polygon points="-12,-12 12,12 0,-18 18,0 -18,18" fill="#facc15" />
                              
                              {/* Ejected Photoelectron Track */}
                              <line x1="0" y1="0" x2="60" y2="-45" stroke="#facc15" strokeWidth="2" strokeDasharray="3 2" />
                              <circle cx="60" cy="-45" r="4" fill="#38bdf8" />
                              <text x="75" y="-45" fill="#facc15" fontSize="10" fontWeight="bold">e⁻ (Ionized)</text>

                              {/* Hydroxyl Free Radical •OH */}
                              <circle cx="-35" cy="40" r="12" fill="#ef4444" />
                              <text x="-35" y="44" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">•OH</text>
                            </g>

                            {/* Right Severed / Broken DNA fragment */}
                            <g transform="translate(230, 20) rotate(12)">
                              <path d="M 30 18 Q 80 0 130 30" fill="none" stroke="#f43f5e" strokeWidth="4" strokeDasharray="5 3" />
                              <path d="M 30 68 Q 80 90 130 60" fill="none" stroke="#f43f5e" strokeWidth="4" strokeDasharray="5 3" />
                              <line x1="60" y1="15" x2="60" y2="75" stroke="#64748b" strokeWidth="2.5" />
                              <line x1="100" y1="18" x2="100" y2="72" stroke="#64748b" strokeWidth="2.5" />
                            </g>
                          </g>

                          {/* Severed Break Warning Label */}
                          <g transform="translate(130, 235)">
                            <rect x="0" y="0" width="380" height="50" rx="8" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
                            <text x="190" y="20" fill="#fecaca" fontSize="11" fontWeight="extrabold" textAnchor="middle">
                              DOUBLE-STRAND BREAK (DSB): SEVERED CHROMOSOME
                            </text>
                            <text x="190" y="38" fill="#fca5a5" fontSize="9" textAnchor="middle">
                              Direct radiation cleavage leads to chromosome shearing, mitotic cell death, or carcinogenesis.
                            </text>
                          </g>
                        </g>
                      )}

                      {/* 5. DEFAULT / NEGLIGIBLE (Radio) */}
                      {rad.cellularEffect === 'thermal_none' && (
                        <g>
                          <text x="320" y="80" fill="#60a5fa" fontSize="14" fontWeight="bold" textAnchor="middle">
                            RADIO WAVE REGIME (LONG WAVELENGTH)
                          </text>
                          <text x="320" y="110" fill="#94a3b8" fontSize="12" textAnchor="middle">
                            Photon energy is 4.14 × 10⁻⁷ eV — millions of times below the 10 eV ionization barrier.
                          </text>
                          <circle cx="320" cy="180" r="50" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                          <text x="320" y="185" fill="#93c5fd" fontSize="12" fontWeight="bold" textAnchor="middle">
                            SAFE
                          </text>
                          <text x="320" y="260" fill="#cbd5e1" fontSize="11" textAnchor="middle">
                            Zero molecular bond agitation, zero photoexcitation, zero DNA hazard.
                          </text>
                        </g>
                      )}
                    </svg>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-slate-200 block mb-1">Mechanism Summary:</span>
                    <p className="text-slate-400 leading-relaxed">{rad.damageDescription}</p>
                  </div>
                </div>

                {/* Right Comparison Matrix (4 Cols) */}
                <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-lg">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-400" />
                    Ionizing vs Non-Ionizing Threshold
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex justify-between font-bold text-emerald-400">
                        <span>Non-Ionizing Radiation</span>
                        <span>E &lt; 10 eV</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Radio, Microwave, IR, Visible. Insufficient quantum energy to liberate bound atomic electrons. Causes thermal agitation or transient excitation.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-1">
                      <div className="flex justify-between font-bold text-purple-300">
                        <span>Threshold (UV Band)</span>
                        <span>3.1 – 10 eV</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        Ultraviolet radiation carries resonant energy matching DNA heterocyclic purines and pyrimidines. Forms covalent thymine dimers without full atom ionization.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 space-y-1">
                      <div className="flex justify-between font-bold text-rose-300">
                        <span>Ionizing Radiation</span>
                        <span>E &gt; 10 eV – MeV</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        X-Rays & Gamma Rays. Rips electrons clean from atomic shells. Triggers free radical cascades and irreversible double-strand DNA cleavage.
                      </p>
                    </div>
                  </div>

                  {/* Switch Radiation Quick Pill Selection */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 block">Switch Cellular View:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.values(RADIATION_TYPES).map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setSelectedRadiationKey(item.key)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                            selectedRadiationKey === item.key
                              ? 'bg-cyan-600 border-cyan-400 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 3: ALARA RADIATION PROTECTION SANDBOX
            ==================================================== */}
        {activeTab === 'alara' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                  Radiological Protection Standard
                </span>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  The ALARA Principle: "As Low As Reasonably Achievable"
                </h3>
                <p className="text-xs text-slate-400">
                  Total biological radiation dose D depends on the Trinity of Protection: minimizing Exposure Time, maximizing Distance (Inverse Square Law), and implementing Heavy Shielding.
                </p>
              </div>

              {/* 3 ALARA Control Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Exposure Time Slider */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-amber-300 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> 1. Exposure Time (t)
                    </span>
                    <span className="font-mono text-white font-bold">{exposureMinutes} min</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={exposureMinutes}
                    onChange={(e) => setExposureMinutes(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-900 rounded appearance-none cursor-pointer accent-amber-400"
                  />
                  <p className="text-[10px] text-slate-400">
                    Directly linear: Halving exposure time halves the cumulative absorbed dose.
                  </p>
                </div>

                {/* 2. Distance Slider (Inverse Square Law) */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-cyan-300 flex items-center gap-1">
                      <ArrowRight className="w-4 h-4" /> 2. Distance (d): 1/d² Law
                    </span>
                    <span className="font-mono text-white font-bold">{distanceMeters.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10.0"
                    step="0.5"
                    value={distanceMeters}
                    onChange={(e) => setDistanceMeters(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-900 rounded appearance-none cursor-pointer accent-cyan-400"
                  />
                  <p className="text-[10px] text-slate-400">
                    Inverse-Square falloff: Doubling distance drops radiation intensity by 4×!
                  </p>
                </div>

                {/* 3. Shield Thickness Slider */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-indigo-300 flex items-center gap-1">
                      <Shield className="w-4 h-4" /> 3. Barrier: {mat.name}
                    </span>
                    <span className="font-mono text-white font-bold">{(thicknessCm * 10).toFixed(1)} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5.0"
                    step="0.05"
                    value={thicknessCm}
                    onChange={(e) => setThicknessCm(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-900 rounded appearance-none cursor-pointer accent-indigo-400"
                  />
                  <p className="text-[10px] text-slate-400">
                    Exponential: Absorbs {absorbedPercent.toFixed(1)}% of beam energy via {hvlCount.toFixed(1)} HVLs.
                  </p>
                </div>
              </div>

              {/* Cumulative Biological Dose Readout HUD */}
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-5 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border-r border-slate-800/80 pr-4">
                  <span className="text-xs text-slate-400 block mb-1">Dose Rate at Position:</span>
                  <span className="text-2xl font-black font-mono text-cyan-400">
                    {rad.isIonizing ? `${attenuatedDoseRate_uSvH.toFixed(2)} µSv/h` : '0.00 µSv/h'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Unshielded 1m: {rad.doseRate1m.toFixed(1)} mSv/h
                  </span>
                </div>

                <div className="border-r border-slate-800/80 pr-4">
                  <span className="text-xs text-slate-400 block mb-1">Cumulative Dose in {exposureMinutes} min:</span>
                  <span className={`text-2xl font-black font-mono ${cumulativeDose_mSv > 1.0 ? 'text-rose-400' : cumulativeDose_mSv > 0.1 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {rad.isIonizing ? `${cumulativeDose_uSv.toFixed(1)} µSv` : '0.0 µSv'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    ({(cumulativeDose_mSv).toFixed(4)} mSv total)
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">ICRP Safety Classification:</span>
                  {rad.isIonizing ? (
                    cumulativeDose_mSv < 0.1 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SAFE (Within Daily Background)
                      </span>
                    ) : cumulativeDose_mSv < 1.0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-amber-950 border border-amber-500 text-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5" /> CAUTION (Elevated Clinical Exposure)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-rose-950 border border-rose-500 text-rose-300">
                        <ShieldAlert className="w-3.5 h-3.5" /> DANGER (Exceeds Public Annual Limit)
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-sky-950 border border-sky-500 text-sky-300">
                      <Sun className="w-3.5 h-3.5" /> NON-IONIZING (Zero Biological Dose)
                    </span>
                  )}
                  <p className="text-[10px] text-slate-400 mt-2">
                    Public annual dose limit: 1.0 mSv/yr. Occupational worker limit: 20 mSv/yr.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 4: SHIELDING CALCULATION CHALLENGES
            ==================================================== */}
        {activeTab === 'challenge' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              {/* Challenge Header & Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                    Interactive Shielding Derivation
                  </span>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Beer-Lambert Shielding Calculation Challenge
                  </h3>
                </div>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {CHALLENGES.map((ch, idx) => (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setCurrentChallengeIndex(idx);
                        setUserAnswerStr('');
                        setChallengeStatus(null);
                        setShowChallengeSteps(false);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        currentChallengeIndex === idx
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Problem {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Problem Card */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold text-cyan-400 flex items-center gap-2">
                    {currentChallenge.title}
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {currentChallenge.prompt}
                  </p>
                </div>

                {/* Input Form */}
                <form onSubmit={handleVerifyChallenge} className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-700">
                    <label className="text-xs font-bold text-slate-400">Your Answer:</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 5.0"
                      value={userAnswerStr}
                      onChange={(e) => setUserAnswerStr(e.target.value)}
                      className="w-28 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-mono text-white font-bold focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-xs font-bold text-slate-300">{currentChallenge.unit}</span>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-md shadow-cyan-950 transition-all"
                  >
                    Check Answer
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowChallengeSteps(!showChallengeSteps)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                  >
                    {showChallengeSteps ? 'Hide Solution Steps' : 'Show Derivation'}
                  </button>

                  <button
                    type="button"
                    onClick={applyChallengeToSim}
                    className="px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-500/50 hover:bg-indigo-900 text-indigo-300 text-xs font-bold transition-all ml-auto"
                  >
                    Apply to Simulator & Test
                  </button>
                </form>

                {/* Verification Feedback Banner */}
                {challengeStatus && (
                  <div
                    className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-200 ${
                      challengeStatus === 'correct'
                        ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                        : 'bg-rose-950/70 border-rose-500/60 text-rose-200'
                    }`}
                  >
                    {challengeStatus === 'correct' ? (
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold text-sm text-emerald-300">
                            Correct! Outstanding calculation!
                          </p>
                          <p className="text-emerald-400 text-xs mt-0.5">
                            A thickness of ~{currentChallenge.targetMm} {currentChallenge.unit} attenuates the radiation down to the target safety limit. Click "Apply to Simulator" to watch the live beam respond!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold text-sm text-rose-300">
                            Not quite. Review the hint below:
                          </p>
                          <p className="text-rose-400 text-xs mt-0.5">{currentChallenge.hint}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step-by-Step Derivation Accordion */}
                {showChallengeSteps && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2 animate-in fade-in duration-200">
                    <h5 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wide">
                      Full Mathematical Derivation:
                    </h5>
                    <div className="space-y-1 text-xs text-slate-300 font-mono">
                      {currentChallenge.derivationSteps.map((step, i) => (
                        <div key={i} className="p-1.5 rounded bg-slate-950/80 border border-slate-800/80">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          FOOTER: Pedagogical Notes & Lesson Reference
          ======================================================== */}
      <footer className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span>VizLearn Secondary Physics Series • </span>
          <strong className="text-slate-300">Form 4 Topic 4 (Electromagnetic Spectrum)</strong>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>Beer-Lambert Law</span>
          <span>•</span>
          <span>Half-Value Layer (HVL)</span>
          <span>•</span>
          <span>ALARA Protection Trinity</span>
        </div>
      </footer>
    </div>
  );
}
