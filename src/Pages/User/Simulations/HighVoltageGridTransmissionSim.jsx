import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  RotateCcw,
  Zap,
  Sliders,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  Volume2,
  VolumeX,
  Info,
  CheckCircle2,
  XCircle,
  Radio,
  AlertTriangle,
  Lightbulb,
  Activity,
  ArrowRight,
  BarChart3,
  TrendingDown,
  Layers,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

/**
 * Audio Synthesizer for 50 Hz Grid AC Hum & Overload Alarm
 */
class GridAudioSynth {
  constructor() {
    this.ctx = null;
    this.osc50 = null;
    this.osc100 = null;
    this.gainNode = null;
    this.isPlaying = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  start(isOverloaded = false) {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;

    try {
      this.osc50 = this.ctx.createOscillator();
      this.osc100 = this.ctx.createOscillator();
      this.gainNode = this.ctx.createGain();

      // Fundamental 50 Hz and double frequency 100 Hz magnetostriction hum
      this.osc50.type = 'sine';
      this.osc50.frequency.setValueAtTime(50, this.ctx.currentTime);

      this.osc100.type = 'sine';
      this.osc100.frequency.setValueAtTime(100, this.ctx.currentTime);

      const volume = isOverloaded ? 0.04 : 0.015;
      this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);

      this.osc50.connect(this.gainNode);
      this.osc100.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.osc50.start();
      this.osc100.start();
      this.isPlaying = true;
    } catch {
      // Audio might require user interaction first
    }
  }

  update(isOverloaded = false) {
    if (!this.isPlaying || !this.ctx || !this.gainNode) return;
    try {
      const volume = isOverloaded ? 0.05 : 0.015;
      this.gainNode.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.1);
    } catch {
      // Ignore audio update errors
    }
  }

  stop() {
    if (!this.isPlaying) return;
    try {
      if (this.osc50) {
        this.osc50.stop();
        this.osc50.disconnect();
      }
      if (this.osc100) {
        this.osc100.stop();
        this.osc100.disconnect();
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
      }
    } catch {
      // Ignore cleanup error
    }
    this.isPlaying = false;
  }
}

// Preset conductor types
const CONDUCTOR_TYPES = [
  { id: 'acsr_heavy', name: 'ACSR Lynx (Heavy)', resPerKm: 0.08, desc: 'Twin bundled steel-reinforced aluminium for 220–400 kV lines' },
  { id: 'acsr_standard', name: 'ACSR Zebra (Standard)', resPerKm: 0.15, desc: 'Standard 132 kV national grid transmission cable' },
  { id: 'acsr_light', name: 'ACSR Mink (Light)', resPerKm: 0.30, desc: 'Lightweight aluminium line for 33–66 kV sub-transmission' },
  { id: 'copper_heavy', name: 'Hard-Drawn Copper (Thick)', resPerKm: 0.05, desc: 'Low resistance but extremely heavy & expensive' },
];

// KCSE Exam Standard Problems
const KCSE_PROBLEMS = [
  {
    id: 'kcse_grid_1',
    year: 'KCSE Physics Paper 2',
    title: 'Question 1: Grid Current and Joule Line Loss',
    question:
      'A geothermal power station at Olkaria generates 36 MW of electrical power at 11 kV. The voltage is stepped up to 132 kV by a transformer before transmission along grid cables having a total loop resistance of 12 Ω. Calculate the current (in Amperes) flowing through the transmission cables.',
    unit: 'A',
    target: 272.7,
    tolerance: 3.0,
    hint: 'Recall that power transmitted is P = V × I, where V is the transmission voltage (132 kV = 132,000 V) and P is 36 MW (36,000,000 W). Thus I = P / V.',
    solutionSteps: [
      'Identify given parameters: Generated Power P = 36 MW = 36 × 10⁶ W; Transmission Voltage V = 132 kV = 132 × 10³ V; Line Resistance R = 12 Ω.',
      'State formula for line current: P = V × I ⟹ I = P / V',
      'Substitute values: I = (36 × 10⁶ W) / (132 × 10³ V)',
      'Calculate current: I = 272.73 A (approx. 273 A)',
      'Bonus derivation: Power loss in lines is P_loss = I²R = (272.73)² × 12 = 892.6 kW (only 2.48% of total power generated!).',
    ],
  },
  {
    id: 'kcse_grid_2',
    year: 'KCSE Physics Paper 2',
    title: 'Question 2: Transmission Efficiency Percentage',
    question:
      'A hydroelectric plant delivers 60 MW of power through transmission cables with a total resistance of 8.0 Ω at a line voltage of 220 kV. Calculate the percentage efficiency (η) of power transmission to the receiving substation (to 1 decimal place).',
    unit: '%',
    target: 99.0,
    tolerance: 0.2,
    hint: 'First find current I = P / V. Then calculate Joule loss P_loss = I²R in MW. Then efficiency η = [(P - P_loss) / P] × 100%.',
    solutionSteps: [
      'Given: P_gen = 60 × 10⁶ W, V_trans = 220 × 10³ V, R = 8.0 Ω.',
      'Calculate transmission current: I = P / V = (60 × 10⁶) / (220 × 10³) = 272.73 A.',
      'Calculate power dissipated as heat: P_loss = I² × R = (272.73 A)² × 8.0 Ω = 595,041 W ≈ 0.595 MW.',
      'Delivered power at substation: P_delivered = P_gen - P_loss = 60.0 - 0.595 = 59.405 MW.',
      'Calculate percentage efficiency: η = (P_delivered / P_gen) × 100% = (59.405 / 60) × 100% = 99.01% ≈ 99.0%.',
    ],
  },
  {
    id: 'kcse_grid_3',
    year: 'KCSE Physics Paper 2',
    title: 'Question 3: Catastrophic Loss at Low Voltage vs High Voltage',
    question:
      'Suppose the same 60 MW from Question 2 were transmitted directly at generator voltage of 11 kV without stepping up, along the same 8.0 Ω cables. Calculate the theoretical power that would be lost as heat (in MW) in the cables.',
    unit: 'MW',
    target: 238.0,
    tolerance: 3.0,
    hint: 'Find current at 11 kV: I = 60 MW / 11 kV = 5,454.5 A. Then compute P_loss = I²R in MW.',
    solutionSteps: [
      'Calculate low-voltage current: I = (60 × 10⁶ W) / (11 × 10³ V) = 5,454.55 A.',
      'Apply Joule heating law: P_loss = I² × R = (5,454.55 A)² × 8.0 Ω',
      'Compute loss: P_loss = 238,016,528 W ≈ 238.0 MW.',
      'Key deduction: The required power loss (238 MW) is almost 400% of the total 60 MW generated! In reality, all 60 MW would turn into incinerating heat, the cables would melt instantaneously, and zero power would reach the city.',
      'This proves conclusively why ultra-high transmission voltages are indispensable for grid supply.',
    ],
  },
];

// Predictor interactive challenges
const PREDICTOR_CHALLENGES = [
  {
    id: 'pred_1',
    title: 'Challenge 1: Doubling the Transmission Voltage',
    question:
      'If engineers upgrade a transmission line from 66 kV to 132 kV (doubling the transmission voltage) while transmitting the same power P over cables with constant resistance R, by what factor is the power lost as heat (I²R) multiplied?',
    options: [
      { id: 'a', label: 'Multiplied by 2 (Doubles)', correct: false },
      { id: 'b', label: 'Divided by 2 (Halves)', correct: false },
      { id: 'c', label: 'Divided by 4 (Reduced to 1/4)', correct: true },
      { id: 'd', label: 'Divided by 16 (Reduced to 1/16)', correct: false },
    ],
    explanation:
      'Since P = V × I, doubling V cuts the current in half: I₂ = I₁ / 2. Because Joule heating loss is P_loss = I²R, halving the current reduces the loss to (1/2)² = 1/4 of its former value! Mathematically: P_loss = P²R / V², so doubling V divides power loss by 4.',
  },
  {
    id: 'pred_2',
    title: 'Challenge 2: Transmission Line Distance and Loss',
    question:
      'If the transmission distance between a hydro dam and a city is extended from 50 km to 150 km (3 times longer) using identical cables at the same voltage and power, what happens to the total power loss?',
    options: [
      { id: 'a', label: 'Increases by 3 times (3×)', correct: true },
      { id: 'b', label: 'Increases by 9 times (9×)', correct: false },
      { id: 'c', label: 'Remains unchanged', correct: false },
      { id: 'd', label: 'Decreases by 3 times (1/3)', correct: false },
    ],
    explanation:
      'Cable resistance is directly proportional to length (R = ρL/A). Tripling length L triples the resistance R. Since transmission voltage and power are unchanged, current I remains constant. Therefore, P_loss = I²R triples (increases by 3 times).',
  },
  {
    id: 'pred_3',
    title: 'Challenge 3: Why ACSR Aluminium Conductors Instead of Copper?',
    question:
      'Copper has lower electrical resistivity than aluminium. Why are overhead National Grid transmission cables made of Aluminium-Conductor Steel-Reinforced (ACSR) instead of pure copper?',
    options: [
      { id: 'a', label: 'Copper does not conduct alternating current (AC)', correct: false },
      { id: 'b', label: 'Aluminium is much lighter and cheaper; steel provides tensile strength to prevent sagging and snapping over long pylon spans', correct: true },
      { id: 'c', label: 'Copper attracts lightning strikes more than aluminium', correct: false },
      { id: 'd', label: 'Aluminium does not produce magnetic fields', correct: false },
    ],
    explanation:
      'Copper is over 3 times denser than aluminium and far more expensive. Heavy copper wires would cause immense mechanical sag, requiring twice as many pylons to bear the weight. ACSR uses high-tensile steel core strands surrounded by light, highly conductive aluminium strands, giving the optimal balance of conductivity, lightweight economy, and mechanical strength.',
  },
];

export default function HighVoltageGridTransmissionSim({ config = {}, onTelemetry }) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('sim'); // 'sim' | 'comparison' | 'predictor' | 'kcse'

  // Primary Interactive Simulation Variables
  const [transmissionVoltageKV, setTransmissionVoltageKV] = useState(132); // kV: 0.24, 11, 33, 66, 132, 220, 400
  const [generatedPowerMW, setGeneratedPowerMW] = useState(50); // MW: 10 to 100
  const [distanceKm, setDistanceKm] = useState(100); // km: 10 to 200
  const [selectedConductorId, setSelectedConductorId] = useState('acsr_standard');
  const [customResPerKm, setCustomResPerKm] = useState(0.15);

  // Audio and Animation Toggles
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isPowerActive, setIsPowerActive] = useState(true);
  const [particleSpeedMultiplier, setParticleSpeedMultiplier] = useState(1);

  // KCSE State
  const [currentKcseIdx, setCurrentKcseIdx] = useState(0);
  const [kcseUserAnswer, setKcseUserAnswer] = useState('');
  const [kcseAnswerStatus, setKcseAnswerStatus] = useState(null); // 'correct' | 'incorrect' | null
  const [kcseShowSolution, setKcseShowSolution] = useState(false);

  // Predictor State
  const [currentPredIdx, setCurrentPredIdx] = useState(0);
  const [predSelectedOption, setPredSelectedOption] = useState(null);
  const [predSubmitted, setPredSubmitted] = useState(false);

  // Audio ref
  const audioRef = useRef(null);
  useEffect(() => {
    audioRef.current = new GridAudioSynth();
    return () => {
      if (audioRef.current) audioRef.current.stop();
    };
  }, []);

  // Animation Clock for current electron flow particles and turbine rotation
  const [animTime, setAnimTime] = useState(0);
  const animFrameRef = useRef(null);

  useEffect(() => {
    let lastT = performance.now();
    const tick = (now) => {
      if (isPowerActive) {
        const dt = (now - lastT) / 1000;
        setAnimTime((prev) => prev + dt);
      }
      lastT = now;
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPowerActive]);

  // Reset Simulation Defaults
  const handleReset = useCallback(() => {
    setTransmissionVoltageKV(132);
    setGeneratedPowerMW(50);
    setDistanceKm(100);
    setSelectedConductorId('acsr_standard');
    setCustomResPerKm(0.15);
    setIsPowerActive(true);
    setKcseUserAnswer('');
    setKcseAnswerStatus(null);
    setKcseShowSolution(false);
    setPredSelectedOption(null);
    setPredSubmitted(false);
    if (onTelemetry) {
      onTelemetry({ event: 'reset_simulation', timestamp: Date.now() });
    }
  }, [onTelemetry]);

  // Selected conductor resistance per km
  const currentResPerKm = useMemo(() => {
    if (selectedConductorId === 'custom') return customResPerKm;
    const cond = CONDUCTOR_TYPES.find((c) => c.id === selectedConductorId);
    return cond ? cond.resPerKm : 0.15;
  }, [selectedConductorId, customResPerKm]);

  // Total Loop Resistance of Transmission Line
  const totalLineResistance = useMemo(() => {
    // Both go and return conductors or loop impedance
    return Math.round(currentResPerKm * distanceKm * 100) / 100;
  }, [currentResPerKm, distanceKm]);

  // Physics Core Calculations
  const physics = useMemo(() => {
    if (!isPowerActive) {
      return {
        powerWatts: 0,
        voltageVolts: 0,
        currentAmps: 0,
        lineLossWatts: 0,
        lineLossMW: 0,
        lineLossPercent: 0,
        voltageDropVolts: 0,
        voltageDropPercent: 0,
        deliveredPowerMW: 0,
        efficiencyPercent: 0,
        cableTemperatureDegC: 25,
        thermalStatus: 'OFF',
        isSevereLoss: false,
        isCatastrophic: false,
        wireGlowColor: '#334155',
        glowIntensity: 0,
        cityGridStatus: 'BLACKOUT',
      };
    }

    const pWatts = generatedPowerMW * 1e6; // Watts
    const vVolts = transmissionVoltageKV * 1e3; // Volts

    // Transmission line current: I = P / V
    const iAmps = pWatts / vVolts;

    // Joule line loss: P_loss = I² * R
    const lossWatts = Math.pow(iAmps, 2) * totalLineResistance;
    const lossMW = lossWatts / 1e6;

    // Voltage drop across line: ΔV = I * R
    const vDropVolts = iAmps * totalLineResistance;
    const vDropPercent = Math.min(100, (vDropVolts / vVolts) * 100);

    // Delivered power at receiving substation
    const deliveredMW = Math.max(0, generatedPowerMW - lossMW);

    // Percentage of generated power lost & efficiency
    const lossPercent = (lossMW / generatedPowerMW) * 100;
    const effPercent = Math.max(0, Math.min(100, (deliveredMW / generatedPowerMW) * 100));

    // Severe & Catastrophic Overload Checks
    // Normal grid lines run with losses < 4%. Loss > 20% is severe.
    // Loss > 100% or current > 3,000 A causes wire meltdown.
    const isSevereLoss = lossPercent > 15;
    const isCatastrophic = lossPercent > 80 || iAmps > 2500;

    // Conductor heating calculation: T_ambient + dissipation
    // Specific heat / convective equilibrium approx
    const tempRise = Math.min(850, (lossWatts / (distanceKm * 1000)) * 0.45);
    const cableTempDegC = Math.round(25 + tempRise);

    // Thermal visual glow
    let thermalStatus = 'OPTIMAL';
    let wireGlowColor = '#10b981'; // Cool Emerald Green
    let glowIntensity = 0.2;

    if (cableTempDegC > 400 || isCatastrophic) {
      thermalStatus = 'MELTDOWN / INCANDESCENT';
      wireGlowColor = '#ffffff'; // White-hot incandescent
      glowIntensity = 1.0;
    } else if (cableTempDegC > 180 || isSevereLoss) {
      thermalStatus = 'CRITICAL OVERHEATING';
      wireGlowColor = '#ef4444'; // Red-hot
      glowIntensity = 0.85;
    } else if (cableTempDegC > 75) {
      thermalStatus = 'ELEVATED WARMTH';
      wireGlowColor = '#f59e0b'; // Amber-orange
      glowIntensity = 0.55;
    }

    // City Consumer Receiving Status
    let cityGridStatus = 'EXCELLENT';
    if (effPercent < 1 || isCatastrophic) {
      cityGridStatus = 'BLACKOUT';
    } else if (effPercent < 75) {
      cityGridStatus = 'SEVERE BROWNOUT';
    } else if (effPercent < 92) {
      cityGridStatus = 'MILD BROWNOUT';
    }

    return {
      powerWatts: pWatts,
      voltageVolts: vVolts,
      currentAmps: iAmps,
      lineLossWatts: lossWatts,
      lineLossMW: lossMW,
      lineLossPercent: lossPercent,
      voltageDropVolts: vDropVolts,
      voltageDropPercent: vDropPercent,
      deliveredPowerMW: deliveredMW,
      efficiencyPercent: effPercent,
      cableTemperatureDegC: cableTempDegC,
      thermalStatus,
      isSevereLoss,
      isCatastrophic,
      wireGlowColor,
      glowIntensity,
      cityGridStatus,
    };
  }, [isPowerActive, generatedPowerMW, transmissionVoltageKV, totalLineResistance, distanceKm]);

  // Update Audio Synth on changes
  useEffect(() => {
    if (!audioRef.current) return;
    if (!isAudioMuted && isPowerActive) {
      audioRef.current.start(physics.isSevereLoss || physics.isCatastrophic);
      audioRef.current.update(physics.isSevereLoss || physics.isCatastrophic);
    } else {
      audioRef.current.stop();
    }
  }, [isAudioMuted, isPowerActive, physics.isSevereLoss, physics.isCatastrophic]);

  // Transmission Voltage Comparison Data for Tab 2
  const voltageComparisonData = useMemo(() => {
    const voltages = [
      { kv: 0.24, label: '240 V (Domestic Direct)', note: 'Direct household supply without step-up' },
      { kv: 11, label: '11 kV (Generator Direct)', note: 'Direct alternator terminal voltage' },
      { kv: 33, label: '33 kV (Sub-Transmission)', note: 'Intermediate distribution feeder' },
      { kv: 66, label: '66 kV (High Voltage)', note: 'Regional industrial distribution' },
      { kv: 132, label: '132 kV (Standard Grid)', note: 'Kenyan standard national grid trunk line' },
      { kv: 220, label: '220 kV (Heavy Grid)', note: 'Main inter-city bulk transmission' },
      { kv: 400, label: '400 kV (Supergrid)', note: 'Ultra-high voltage bulk energy supergrid' },
    ];

    const pW = generatedPowerMW * 1e6;
    const r = totalLineResistance;

    return voltages.map((item) => {
      const v = item.kv * 1e3;
      const i = pW / v;
      const lossW = Math.pow(i, 2) * r;
      const lossMW = lossW / 1e6;
      const lossPct = (lossMW / generatedPowerMW) * 100;
      const delMW = Math.max(0, generatedPowerMW - lossMW);
      const effPct = Math.max(0, Math.min(100, (delMW / generatedPowerMW) * 100));
      const vDrop = i * r;
      const vDropPct = (vDrop / v) * 100;
      const isMelt = lossPct > 100 || i > 2500;

      return {
        ...item,
        currentAmps: i,
        lossMW,
        lossPct,
        deliveredMW: delMW,
        efficiencyPct: effPct,
        voltageDropVolts: vDrop,
        voltageDropPct: vDropPct,
        isMelt,
      };
    });
  }, [generatedPowerMW, totalLineResistance]);

  // Handle KCSE Answer Submit
  const handleKcseSubmit = () => {
    const prob = KCSE_PROBLEMS[currentKcseIdx];
    const val = parseFloat(kcseUserAnswer.trim());
    if (isNaN(val)) return;

    const diff = Math.abs(val - prob.target);
    const isCorrect = diff <= prob.tolerance;
    setKcseAnswerStatus(isCorrect ? 'correct' : 'incorrect');

    if (onTelemetry) {
      onTelemetry({
        event: 'kcse_problem_evaluated',
        problemId: prob.id,
        userAnswer: val,
        target: prob.target,
        isCorrect,
      });
    }
  };

  // Handle Predictor Submit
  const handlePredSubmit = () => {
    if (!predSelectedOption) return;
    setPredSubmitted(true);
    if (onTelemetry) {
      onTelemetry({
        event: 'predictor_challenge_evaluated',
        challengeId: PREDICTOR_CHALLENGES[currentPredIdx].id,
        selectedOption: predSelectedOption,
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-slate-950 text-slate-100 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 space-y-6 select-none">
      {/* ==================================================================== */}
      {/* 1. HEADER SECTION */}
      {/* ==================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Zap className="w-3.5 h-3.5 animate-pulse" /> Form 4 Physics • Topic 6: Mains Electricity
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Radio className="w-3.5 h-3.5" /> Lesson 250: National Grid & Substation Distribution
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            National Grid High-Voltage Transmission Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            Explore why electrical energy is stepped up to hundreds of kilovolts for long-distance transport. Witness the quadratic Joule heating law <strong className="text-amber-300 font-mono">P_loss = I²R = P²R / V²</strong>, line voltage drop, and substation distribution.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-center">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              !isAudioMuted
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-950'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isAudioMuted ? 'Unmute 50 Hz Grid Hum' : 'Mute Grid Audio'}
            aria-label="Toggle Sound"
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{!isAudioMuted ? '50 Hz Audio On' : 'Muted'}</span>
          </button>

          <button
            onClick={() => setIsPowerActive(!isPowerActive)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isPowerActive
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-950'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
            }`}
            aria-label="Toggle Grid Power"
          >
            <Activity className="w-4 h-4" />
            <span>{isPowerActive ? 'Grid Energized' : 'Grid Tripped'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-all text-xs font-semibold flex items-center gap-1.5"
            title="Reset Simulation Parameters"
            aria-label="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. TABBED NAVIGATION */}
      {/* ==================================================================== */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('sim')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'sim'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Interactive Grid Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'comparison'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Voltage Comparison & Proof (1/V²)</span>
        </button>

        <button
          onClick={() => setActiveTab('predictor')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'predictor'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20 font-black'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Predictor Challenges</span>
        </button>

        <button
          onClick={() => setActiveTab('kcse')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'kcse'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 font-black'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>KCSE Exam Problems</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 3. TAB 1: INTERACTIVE GRID SIMULATION LAB */}
      {/* ==================================================================== */}
      {activeTab === 'sim' && (
        <div className="space-y-6">
          {/* Top Real-Time Status Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Line Voltage</span>
              <div className="text-lg font-black font-mono text-cyan-400">
                {transmissionVoltageKV >= 1 ? `${transmissionVoltageKV} kV` : `${(transmissionVoltageKV * 1000).toFixed(0)} V`}
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">
                {transmissionVoltageKV === 11
                  ? 'No step-up (Direct)'
                  : transmissionVoltageKV === 0.24
                  ? '⚠️ Catastrophic 240V'
                  : 'Stepped-up line'}
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Cable Current (I = P/V)</span>
              <div
                className={`text-lg font-black font-mono ${
                  physics.currentAmps > 1000
                    ? 'text-rose-400'
                    : physics.currentAmps > 400
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {physics.currentAmps > 10000
                  ? `${(physics.currentAmps / 1000).toFixed(1)} kA`
                  : `${physics.currentAmps.toFixed(1)} A`}
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">
                {physics.currentAmps > 1500 ? '⚠️ Exceeds ampacity' : 'Safe current load'}
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Joule Heat Loss (I²R)</span>
              <div
                className={`text-lg font-black font-mono ${
                  physics.lineLossMW > 10 ? 'text-rose-400' : physics.lineLossMW > 2 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {physics.lineLossMW >= 1000
                  ? `${(physics.lineLossMW / 1000).toFixed(1)} GW`
                  : physics.lineLossMW >= 1
                  ? `${physics.lineLossMW.toFixed(2)} MW`
                  : `${(physics.lineLossWatts / 1000).toFixed(1)} kW`}
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">
                {physics.lineLossPercent.toFixed(1)}% of generated
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Line Voltage Drop (IR)</span>
              <div className="text-lg font-black font-mono text-purple-400">
                {physics.voltageDropVolts >= 1000000
                  ? `${(physics.voltageDropVolts / 1e6).toFixed(1)} MV`
                  : physics.voltageDropVolts >= 1000
                  ? `${(physics.voltageDropVolts / 1000).toFixed(1)} kV`
                  : `${physics.voltageDropVolts.toFixed(0)} V`}
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">
                ΔV/V = {physics.voltageDropPercent.toFixed(1)}%
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Delivered to City</span>
              <div className="text-lg font-black font-mono text-emerald-400">
                {physics.deliveredPowerMW.toFixed(2)} MW
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">
                Efficiency η = {physics.efficiencyPercent.toFixed(1)}%
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Conductor Temp</span>
              <div
                className={`text-lg font-black font-mono ${
                  physics.cableTemperatureDegC > 200
                    ? 'text-rose-400'
                    : physics.cableTemperatureDegC > 80
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {physics.cableTemperatureDegC} °C
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">
                {physics.thermalStatus}
              </span>
            </div>
          </div>

          {/* Warning Banner if Severe/Catastrophic */}
          {physics.isSevereLoss && (
            <div
              className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm animate-pulse ${
                physics.isCatastrophic
                  ? 'bg-rose-950/70 border-rose-600 text-rose-200'
                  : 'bg-amber-950/70 border-amber-600 text-amber-200'
              }`}
            >
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
              <div>
                <strong className="font-bold">
                  {physics.isCatastrophic
                    ? '🚨 DANGEROUS CABLE OVERLOAD & THERMAL COLLAPSE!'
                    : '⚠️ EXCESSIVE TRANSMISSION JOULE LOSS DETECTED!'}
                </strong>
                <p className="text-xs opacity-90 mt-0.5">
                  {physics.isCatastrophic
                    ? `At ${transmissionVoltageKV} kV, cable current is colossal (${physics.currentAmps.toFixed(0)} A). Joule heat dissipation (${physics.lineLossMW.toFixed(1)} MW) would vaporize overhead conductors, and power delivered to consumers drops to zero!`
                    : `Line resistance is dissipating ${physics.lineLossPercent.toFixed(1)}% of total generated energy. Step up voltage to 132 kV or 400 kV to suppress I²R loss.`}
                </p>
              </div>
            </div>
          )}

          {/* Interactive Visual Canvas (SVG Schematic of Full National Grid) */}
          <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 p-2 sm:p-4 overflow-hidden relative shadow-inner">
            <svg
              viewBox="0 0 920 380"
              className="w-full h-auto select-none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="National Grid Power Transmission Schematic"
            >
              <defs>
                {/* Glow Filter for High-Voltage Cables */}
                <filter id="wireGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Substation Transformer Coil Pattern */}
                <linearGradient id="plantGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0369a1" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                <linearGradient id="cityGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1e1b4b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#020617" />
                  <stop offset="100%" stopColor="#090d16" />
                </linearGradient>
              </defs>

              {/* Background Landscape & Sky */}
              <rect x="0" y="0" width="920" height="380" rx="14" fill="url(#skyGrad)" />

              {/* Ground Mountainous Horizon / Terrain Line */}
              <path
                d="M 0,310 Q 150,290 300,305 T 600,295 T 920,310 L 920,380 L 0,380 Z"
                fill="#0f172a"
                stroke="#1e293b"
                strokeWidth="1"
              />

              {/* Distant Pylon Silhouettes in background */}
              <path
                d="M 390,290 L 395,255 L 400,290 M 392,265 L 398,265 M 390,278 L 400,278"
                stroke="#1e293b"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M 480,288 L 485,252 L 490,288 M 482,262 L 488,262 M 480,275 L 490,275"
                stroke="#1e293b"
                strokeWidth="1"
                fill="none"
              />

              {/* ========================================================== */}
              {/* COMPONENT 1: POWER STATION (e.g. Olkaria Geothermal / Hydro) */}
              {/* ========================================================== */}
              <g transform="translate(20, 110)">
                {/* Station Building Shell */}
                <rect x="0" y="0" width="130" height="195" rx="12" fill="url(#plantGrad)" stroke="#38bdf8" strokeWidth="2" />
                <rect x="10" y="10" width="110" height="28" rx="6" fill="#0c4a6e" />
                <text x="65" y="24" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="900" letterSpacing="1">
                  POWER STATION
                </text>
                <text x="65" y="34" textAnchor="middle" fill="#bae6fd" fontSize="8">
                  Olkaria Geothermal
                </text>

                {/* Rotating Generator Turbine Graphic */}
                <g transform="translate(65, 82)">
                  <circle cx="0" cy="0" r="30" fill="#082f49" stroke="#0284c7" strokeWidth="2" />
                  {/* Turbine Blades Rotating */}
                  <g transform={`rotate(${isPowerActive ? (animTime * 180) % 360 : 0})`}>
                    <line x1="-24" y1="0" x2="24" y2="0" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                    <line x1="0" y1="-24" x2="0" y2="24" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                    <line x1="-17" y1="-17" x2="17" y2="17" stroke="#38bdf8" strokeWidth="2" />
                    <line x1="-17" y1="17" x2="17" y2="-17" stroke="#38bdf8" strokeWidth="2" />
                  </g>
                  <circle cx="0" cy="0" r="7" fill="#f8fafc" />
                </g>

                {/* Cooling Tower Plume / Steam */}
                <path
                  d="M 20,-10 C 20,-25 35,-35 45,-45 C 40,-30 45,-20 35,-10 Z"
                  fill="#94a3b8"
                  opacity={isPowerActive ? '0.4' : '0.1'}
                />

                {/* Generator Output Parameters Badge */}
                <rect x="8" y="125" width="114" height="60" rx="8" fill="#082f49" stroke="#0369a1" strokeWidth="1" />
                <text x="65" y="142" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="800">
                  Gen: {generatedPowerMW} MW
                </text>
                <text x="65" y="157" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="700" fontFamily="monospace">
                  V_gen = 11 kV
                </text>
                <text x="65" y="172" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  I_gen = {((generatedPowerMW * 1000) / 11).toFixed(0)} A
                </text>
              </g>

              {/* Heavy Busbars from Generator to Step-Up Substation */}
              <line x1="150" y1="185" x2="185" y2="185" stroke="#38bdf8" strokeWidth="4" />
              <line x1="150" y1="205" x2="185" y2="205" stroke="#38bdf8" strokeWidth="4" />

              {/* ========================================================== */}
              {/* COMPONENT 2: STEP-UP TRANSFORMER SUBSTATION */}
              {/* ========================================================== */}
              <g transform="translate(185, 125)">
                <rect x="0" y="0" width="105" height="175" rx="12" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
                <rect x="8" y="8" width="89" height="24" rx="6" fill="#14532d" />
                <text x="52" y="20" textAnchor="middle" fill="#4ade80" fontSize="9" fontWeight="900" letterSpacing="0.5">
                  STEP-UP
                </text>
                <text x="52" y="28" textAnchor="middle" fill="#bbf7d0" fontSize="7">
                  SUBSTATION
                </text>

                {/* Dual Mutual Induction Coils Symbol */}
                <g transform="translate(52, 70)">
                  {/* Soft Iron Core Laminations Symbol */}
                  <line x1="-4" y1="-28" x2="-4" y2="28" stroke="#475569" strokeWidth="2.5" />
                  <line x1="4" y1="-28" x2="4" y2="28" stroke="#475569" strokeWidth="2.5" />

                  {/* Primary 11kV Coil (Left, fewer turns) */}
                  <circle cx="-18" cy="-14" r="10" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                  <circle cx="-18" cy="14" r="10" fill="none" stroke="#38bdf8" strokeWidth="2.5" />

                  {/* Secondary High-Voltage Coil (Right, multi-turns) */}
                  <circle cx="18" cy="-18" r="8" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                  <circle cx="18" cy="-6" r="8" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                  <circle cx="18" cy="6" r="8" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="8" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                </g>

                {/* Step-Up Voltage Conversion Label */}
                <rect x="8" y="115" width="89" height="50" rx="6" fill="#052e16" stroke="#166534" />
                <text x="52" y="132" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="900" fontFamily="monospace">
                  {transmissionVoltageKV >= 1 ? `${transmissionVoltageKV} kV` : `${transmissionVoltageKV * 1000} V`}
                </text>
                <text x="52" y="146" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                  11 kV → {transmissionVoltageKV} kV
                </text>
                <text x="52" y="158" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="700">
                  k = {(transmissionVoltageKV / 11).toFixed(1)}× Step-up
                </text>
              </g>

              {/* ========================================================== */}
              {/* COMPONENT 3: TRANSMISSION PYLON TOWERS & OVERHEAD WIRES */}
              {/* ========================================================== */}
              {/* Tower 1 (Left Pylon) */}
              <g transform="translate(365, 230)">
                {/* Steel Lattice Structure */}
                <line x1="0" y1="80" x2="-26" y2="-75" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="0" y1="80" x2="26" y2="-75" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="-38" y1="-50" x2="38" y2="-50" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="-30" y1="-15" x2="30" y2="-15" stroke="#94a3b8" strokeWidth="2" />
                <line x1="-18" y1="25" x2="18" y2="25" stroke="#94a3b8" strokeWidth="2" />
                {/* Cross bracings */}
                <line x1="-20" y1="-45" x2="20" y2="-15" stroke="#64748b" strokeWidth="1" />
                <line x1="20" y1="-45" x2="-20" y2="-15" stroke="#64748b" strokeWidth="1" />
                {/* Insulator Discs */}
                <line x1="-36" y1="-50" x2="-36" y2="-38" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="2 1" />
                <line x1="36" y1="-50" x2="36" y2="-38" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="2 1" />
              </g>

              {/* Tower 2 (Right Pylon) */}
              <g transform="translate(545, 230)">
                <line x1="0" y1="80" x2="-26" y2="-75" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="0" y1="80" x2="26" y2="-75" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="-38" y1="-50" x2="38" y2="-50" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="-30" y1="-15" x2="30" y2="-15" stroke="#94a3b8" strokeWidth="2" />
                <line x1="-18" y1="25" x2="18" y2="25" stroke="#94a3b8" strokeWidth="2" />
                <line x1="-20" y1="-45" x2="20" y2="-15" stroke="#64748b" strokeWidth="1" />
                <line x1="20" y1="-45" x2="-20" y2="-15" stroke="#64748b" strokeWidth="1" />
                <line x1="-36" y1="-50" x2="-36" y2="-38" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="2 1" />
                <line x1="36" y1="-50" x2="36" y2="-38" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="2 1" />
              </g>

              {/* Overhead High-Voltage Catenary Conductors */}
              {/* Top Conductor Cable */}
              <path
                d={`M 290,140 Q 365,${155 + (physics.cableTemperatureDegC > 150 ? 12 : 0)} 400,165 Q 455,${
                  185 + (physics.cableTemperatureDegC > 150 ? 18 : 0)
                } 510,165 Q 545,${155 + (physics.cableTemperatureDegC > 150 ? 12 : 0)} 625,140`}
                fill="none"
                stroke={physics.wireGlowColor}
                strokeWidth={physics.isCatastrophic ? '6' : physics.isSevereLoss ? '4.5' : '3'}
                filter="url(#wireGlow)"
              />

              {/* Bottom Conductor Cable */}
              <path
                d={`M 290,160 Q 365,${175 + (physics.cableTemperatureDegC > 150 ? 12 : 0)} 400,192 Q 455,${
                  210 + (physics.cableTemperatureDegC > 150 ? 18 : 0)
                } 510,192 Q 545,${175 + (physics.cableTemperatureDegC > 150 ? 12 : 0)} 625,160`}
                fill="none"
                stroke={physics.wireGlowColor}
                strokeWidth={physics.isCatastrophic ? '6' : physics.isSevereLoss ? '4.5' : '3'}
                filter="url(#wireGlow)"
              />

              {/* Animated Electron / Current Particles traveling across the cable */}
              {isPowerActive && (
                <g>
                  {[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((offset, idx) => {
                    const progress = (animTime * 0.4 * particleSpeedMultiplier + offset) % 1;
                    const px = 290 + progress * (625 - 290);
                    const sag = Math.sin(progress * Math.PI) * (26 + (physics.cableTemperatureDegC > 150 ? 14 : 0));
                    const py = 148 + sag;
                    return (
                      <circle
                        key={`particle-${idx}`}
                        cx={px}
                        cy={py}
                        r={physics.isSevereLoss ? 4 : 2.5}
                        fill="#ffffff"
                        opacity={physics.isCatastrophic ? 0.95 : 0.75}
                      />
                    );
                  })}
                </g>
              )}

              {/* Thermal Smoke & Incandescence Sparks if wire is critically overheated */}
              {physics.isCatastrophic && (
                <g>
                  <circle cx="455" cy="180" r="16" fill="#f97316" opacity="0.4" />
                  <circle cx="455" cy="175" r="9" fill="#ef4444" opacity="0.6" />
                  <text x="455" y="150" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="900">
                    🔥 CABLE MELTDOWN!
                  </text>
                </g>
              )}

              {/* Interactive Telemetry Box over Transmission Span */}
              <g transform="translate(455, 68)">
                <rect
                  x="-125"
                  y="-28"
                  width="250"
                  height="58"
                  rx="10"
                  fill="#090d16"
                  stroke={physics.isCatastrophic ? '#ef4444' : physics.isSevereLoss ? '#f59e0b' : '#334155'}
                  strokeWidth="2"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
                />
                <text x="0" y="-10" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="700">
                  Length: <tspan fill="#38bdf8">{distanceKm} km</tspan> | Conductor R:{' '}
                  <tspan fill="#f59e0b">{totalLineResistance} Ω</tspan>
                </text>
                <text x="0" y="7" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="800">
                  Line Current I:{' '}
                  <tspan fill={physics.currentAmps > 1000 ? '#ef4444' : '#4ade80'}>
                    {physics.currentAmps.toFixed(1)} A
                  </tspan>
                </text>
                <text
                  x="0"
                  y="22"
                  textAnchor="middle"
                  fill={physics.lineLossMW > 5 ? '#ef4444' : '#22c55e'}
                  fontSize="11"
                  fontWeight="900"
                >
                  Joule Loss (I²R): {physics.lineLossMW.toFixed(2)} MW ({physics.lineLossPercent.toFixed(1)}%)
                </text>
              </g>

              {/* ========================================================== */}
              {/* COMPONENT 4: STEP-DOWN SUBSTATION (Receiving End) */}
              {/* ========================================================== */}
              <g transform="translate(625, 125)">
                <rect x="0" y="0" width="105" height="175" rx="12" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
                <rect x="8" y="8" width="89" height="24" rx="6" fill="#14532d" />
                <text x="52" y="20" textAnchor="middle" fill="#4ade80" fontSize="9" fontWeight="900" letterSpacing="0.5">
                  STEP-DOWN
                </text>
                <text x="52" y="28" textAnchor="middle" fill="#bbf7d0" fontSize="7">
                  SUBSTATION
                </text>

                {/* Step-Down Coils Symbol */}
                <g transform="translate(52, 70)">
                  <line x1="-4" y1="-28" x2="-4" y2="28" stroke="#475569" strokeWidth="2.5" />
                  <line x1="4" y1="-28" x2="4" y2="28" stroke="#475569" strokeWidth="2.5" />

                  {/* Primary High-Voltage (many turns) */}
                  <circle cx="-18" cy="-18" r="8" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                  <circle cx="-18" cy="-6" r="8" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                  <circle cx="-18" cy="6" r="8" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                  <circle cx="-18" cy="18" r="8" fill="none" stroke="#22c55e" strokeWidth="2.5" />

                  {/* Secondary Low-Voltage (fewer turns) */}
                  <circle cx="18" cy="-12" r="10" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                  <circle cx="18" cy="12" r="10" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                </g>

                {/* Stepped Down Distribution Voltage Label */}
                <rect x="8" y="115" width="89" height="50" rx="6" fill="#052e16" stroke="#166534" />
                <text x="52" y="132" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="900" fontFamily="monospace">
                  33 kV / 240 V
                </text>
                <text x="52" y="146" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                  City Distribution
                </text>
                <text x="52" y="158" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="700">
                  Feeders Active
                </text>
              </g>

              {/* Feeders to City */}
              <line x1="730" y1="185" x2="765" y2="185" stroke="#38bdf8" strokeWidth="3" />
              <line x1="730" y1="205" x2="765" y2="205" stroke="#38bdf8" strokeWidth="3" />

              {/* ========================================================== */}
              {/* COMPONENT 5: CITY CONSUMER LOAD (Nairobi / Mombasa Grid) */}
              {/* ========================================================== */}
              <g transform="translate(765, 110)">
                <rect x="0" y="0" width="135" height="195" rx="12" fill="url(#cityGrad)" stroke="#38bdf8" strokeWidth="2" />
                <rect x="8" y="10" width="119" height="28" rx="6" fill="#1e1b4b" />
                <text x="67" y="24" textAnchor="middle" fill="#818cf8" fontSize="10" fontWeight="900" letterSpacing="1">
                  NAIROBI CITY
                </text>
                <text x="67" y="34" textAnchor="middle" fill="#c7d2fe" fontSize="8">
                  Consumer Grid Load
                </text>

                {/* City Skylines & Windows (Lit or Extinguished based on Delivered Power) */}
                <g transform="translate(15, 52)">
                  {/* Building 1 */}
                  <rect x="0" y="15" width="26" height="50" fill="#1e293b" />
                  <rect
                    x="4"
                    y="22"
                    width="6"
                    height="8"
                    fill={physics.cityGridStatus === 'BLACKOUT' ? '#334155' : '#facc15'}
                  />
                  <rect
                    x="14"
                    y="22"
                    width="6"
                    height="8"
                    fill={physics.cityGridStatus === 'BLACKOUT' ? '#334155' : '#facc15'}
                  />
                  <rect
                    x="4"
                    y="36"
                    width="6"
                    height="8"
                    fill={physics.cityGridStatus === 'BLACKOUT' ? '#334155' : '#facc15'}
                  />
                  <rect
                    x="14"
                    y="36"
                    width="6"
                    height="8"
                    fill={physics.cityGridStatus === 'BLACKOUT' ? '#334155' : '#facc15'}
                  />

                  {/* Skyscraper Center */}
                  <rect x="32" y="0" width="38" height="65" fill="#334155" />
                  <polygon points="51,-12 36,0 66,0" fill="#475569" />
                  {/* Window Grid */}
                  {[6, 18, 30, 42, 54].map((wy, widx) => (
                    <g key={`win-${widx}`}>
                      <rect
                        x="37"
                        y={wy}
                        width="6"
                        height="6"
                        fill={physics.cityGridStatus === 'BLACKOUT' ? '#1e293b' : '#38bdf8'}
                      />
                      <rect
                        x="48"
                        y={wy}
                        width="6"
                        height="6"
                        fill={physics.cityGridStatus === 'BLACKOUT' ? '#1e293b' : '#38bdf8'}
                      />
                      <rect
                        x="59"
                        y={wy}
                        width="6"
                        height="6"
                        fill={physics.cityGridStatus === 'BLACKOUT' ? '#1e293b' : '#38bdf8'}
                      />
                    </g>
                  ))}

                  {/* Building 3 */}
                  <rect x="76" y="20" width="28" height="45" fill="#1e293b" />
                  <rect
                    x="81"
                    y="28"
                    width="7"
                    height="7"
                    fill={physics.cityGridStatus === 'BLACKOUT' ? '#334155' : '#facc15'}
                  />
                  <rect
                    x="92"
                    y="28"
                    width="7"
                    height="7"
                    fill={physics.cityGridStatus === 'BLACKOUT' ? '#334155' : '#facc15'}
                  />
                </g>

                {/* City Telemetry Received Box */}
                <rect x="8" y="125" width="119" height="60" rx="8" fill="#1e1b4b" stroke="#3730a3" strokeWidth="1" />
                <text x="67" y="142" textAnchor="middle" fill="#818cf8" fontSize="10" fontWeight="800">
                  Delivered: {physics.deliveredPowerMW.toFixed(2)} MW
                </text>
                <text
                  x="67"
                  y="157"
                  textAnchor="middle"
                  fill={
                    physics.cityGridStatus === 'BLACKOUT'
                      ? '#ef4444'
                      : physics.cityGridStatus.includes('BROWNOUT')
                      ? '#f59e0b'
                      : '#4ade80'
                  }
                  fontSize="10"
                  fontWeight="900"
                  fontFamily="monospace"
                >
                  η = {physics.efficiencyPercent.toFixed(1)}% ({physics.cityGridStatus})
                </text>
                <text x="67" y="172" textAnchor="middle" fill="#c7d2fe" fontSize="8">
                  240V Domestic Supply
                </text>
              </g>
            </svg>
          </div>

          {/* ==================================================================== */}
          {/* 4. INTERACTIVE CONTROL PANELS */}
          {/* ==================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Control 1: Transmission Voltage Presets */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" /> Transmission Voltage (V)
                </label>
                <span className="text-xs font-mono font-black text-cyan-400">
                  {transmissionVoltageKV >= 1 ? `${transmissionVoltageKV} kV` : `${transmissionVoltageKV * 1000} V`}
                </span>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-3 gap-1.5">
                {[0.24, 11, 33, 66, 132, 220, 400].map((v) => (
                  <button
                    key={`v-${v}`}
                    onClick={() => {
                      setTransmissionVoltageKV(v);
                      if (onTelemetry) {
                        onTelemetry({ event: 'change_transmission_voltage', voltageKV: v });
                      }
                    }}
                    className={`py-1.5 px-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                      transmissionVoltageKV === v
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {v >= 1 ? `${v} kV` : '240 V'}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {transmissionVoltageKV === 0.24 && '🔥 Transmitting at domestic 240V melts wires instantly.'}
                {transmissionVoltageKV === 11 && '⚠️ 11 kV: Direct alternator output without step-up transformer.'}
                {transmissionVoltageKV === 132 && '⚡ 132 kV: Kenya standard national grid primary transmission.'}
                {transmissionVoltageKV === 400 && '🚀 400 kV: Supergrid bulk transmission (minimal loss).' }
                {![0.24, 11, 132, 400].includes(transmissionVoltageKV) && 'High-voltage regional transmission corridor.'}
              </p>
            </div>

            {/* Control 2: Power Station Generator Output */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="power-slider" className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-400" /> Power Output (P_gen)
                </label>
                <span className="text-xs font-mono font-black text-amber-400">{generatedPowerMW} MW</span>
              </div>
              <input
                id="power-slider"
                type="range"
                min="10"
                max="100"
                step="5"
                value={generatedPowerMW}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setGeneratedPowerMW(val);
                  if (onTelemetry) onTelemetry({ event: 'change_generated_power', powerMW: val });
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                aria-label="Power Station Generated Output"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10 MW</span>
                <span>50 MW (Nominal)</span>
                <span>100 MW</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Total continuous electrical energy generated by station turbines at 11 kV.
              </p>
            </div>

            {/* Control 3: Transmission Distance */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="distance-slider" className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4 text-purple-400" /> Grid Distance (L)
                </label>
                <span className="text-xs font-mono font-black text-purple-400">{distanceKm} km</span>
              </div>
              <input
                id="distance-slider"
                type="range"
                min="10"
                max="200"
                step="10"
                value={distanceKm}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setDistanceKm(val);
                  if (onTelemetry) onTelemetry({ event: 'change_distance', distanceKm: val });
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                aria-label="Transmission Grid Distance"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10 km</span>
                <span>100 km (Olkaria-Nrb)</span>
                <span>200 km</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight font-mono">
                R_line = r × L = {currentResPerKm} Ω/km × {distanceKm} km = <strong>{totalLineResistance} Ω</strong>
              </p>
            </div>

            {/* Control 4: Conductor Profile Selection */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label htmlFor="conductor-select" className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" /> Conductor Specification
              </label>
              <select
                id="conductor-select"
                value={selectedConductorId}
                onChange={(e) => setSelectedConductorId(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
              >
                {CONDUCTOR_TYPES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.resPerKm} Ω/km)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 leading-tight">
                {CONDUCTOR_TYPES.find((c) => c.id === selectedConductorId)?.desc}
              </p>
            </div>
          </div>

          {/* Educational Formula & Causal Explanation Callout Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Info className="w-4 h-4" />
              <span>The Causal Physics Mechanism: Why High Voltage is Essential</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <strong className="text-cyan-300 block">1. Current Inversely Proportional to Voltage:</strong>
                <p>
                  Since transmitted power is <span className="font-mono text-cyan-200">P = V × I</span>, current in the cables is:
                </p>
                <div className="bg-slate-900 p-1.5 rounded font-mono text-center font-bold text-cyan-400 my-1">
                  I = P / V
                </div>
                <p className="text-slate-400 text-[11px]">
                  Stepping up voltage by a factor of 10 reduces current by a factor of 10.
                </p>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <strong className="text-amber-300 block">2. Quadratic Heat Loss Slashing (I²R):</strong>
                <p>
                  Joule heat dissipation in conductors is <span className="font-mono text-amber-200">P_loss = I²R</span>:
                </p>
                <div className="bg-slate-900 p-1.5 rounded font-mono text-center font-bold text-amber-400 my-1">
                  P_loss = (P / V)² × R = P²R / V²
                </div>
                <p className="text-slate-400 text-[11px]">
                  Power loss is inversely proportional to the <em>square of voltage</em> (1/V²). Doubling V quarters power loss!
                </p>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <strong className="text-emerald-300 block">3. Lighter Cables & Cost Savings:</strong>
                <p>
                  Because current is tiny (e.g. ~200 A at 132 kV vs ~4,500 A at 11 kV), much thinner aluminium conductors can be used.
                </p>
                <p className="text-slate-400 text-[11px] mt-1">
                  Saves thousands of tonnes of metal, drastically reduces pylon mechanical loading, and maintains &gt;98% grid efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. TAB 2: VOLTAGE COMPARISON MATRIX & PROOF */}
      {/* ==================================================================== */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-1">
                <BarChart3 className="w-3.5 h-3.5" /> Quantitative Engineering Comparison
              </span>
              <h3 className="text-lg font-bold text-white">
                Side-by-Side Comparison: Transmitting {generatedPowerMW} MW across {distanceKm} km (Line R = {totalLineResistance} Ω)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Observe how voltage choice dramatically dictates transmission current, cable heating, and power received by consumers.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950 font-mono">
                    <th className="p-3">Voltage Level</th>
                    <th className="p-3">Role / Context</th>
                    <th className="p-3 text-right">Line Current (I)</th>
                    <th className="p-3 text-right">Line Loss (P_loss)</th>
                    <th className="p-3 text-right">Loss %</th>
                    <th className="p-3 text-right">Delivered (P_del)</th>
                    <th className="p-3 text-right">Efficiency (η)</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {voltageComparisonData.map((row) => (
                    <tr
                      key={row.kv}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        row.kv === transmissionVoltageKV ? 'bg-cyan-950/30 border-l-4 border-cyan-400 font-semibold' : ''
                      }`}
                    >
                      <td className="p-3 font-bold text-white flex items-center gap-1.5">
                        {row.label}
                        {row.kv === transmissionVoltageKV && (
                          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">Active</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-400 text-[11px] font-sans">{row.note}</td>
                      <td className="p-3 text-right text-amber-300">
                        {row.currentAmps > 10000
                          ? `${(row.currentAmps / 1000).toFixed(0)} kA`
                          : `${row.currentAmps.toFixed(1)} A`}
                      </td>
                      <td
                        className={`p-3 text-right ${
                          row.lossMW > generatedPowerMW ? 'text-rose-400 font-bold' : row.lossMW > 5 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {row.lossMW > 1000 ? `${(row.lossMW / 1000).toFixed(1)} GW` : `${row.lossMW.toFixed(2)} MW`}
                      </td>
                      <td className="p-3 text-right">{row.lossPct.toFixed(1)}%</td>
                      <td className="p-3 text-right text-cyan-300">{row.deliveredMW.toFixed(2)} MW</td>
                      <td
                        className={`p-3 text-right font-bold ${
                          row.efficiencyPct > 95 ? 'text-emerald-400' : row.efficiencyPct > 70 ? 'text-amber-400' : 'text-rose-400'
                        }`}
                      >
                        {row.efficiencyPct.toFixed(1)}%
                      </td>
                      <td className="p-3 text-center">
                        {row.isMelt ? (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                            💥 Wires Melt
                          </span>
                        ) : row.efficiencyPct > 98 ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                            ✓ Supergrid
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                            ✓ Standard
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mathematical Derivation Proof & Misconception Buster */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Step-by-Step Derivation */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Rigorous Derivation: P_loss = P²R / V²</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>
                  <strong>Conservation of Electric Power:</strong> The total electrical power transmitted from the generating station is:
                  <div className="bg-slate-950 p-2 rounded my-1 font-mono text-cyan-300 text-center">
                    P = V × I
                  </div>
                </li>
                <li>
                  <strong>Solving for Line Current:</strong> Rearranging gives the current flowing through every meter of the transmission cable:
                  <div className="bg-slate-950 p-2 rounded my-1 font-mono text-cyan-300 text-center">
                    I = P / V
                  </div>
                </li>
                <li>
                  <strong>Joule's Law of Heat Dissipation:</strong> The rate at which heat is lost in transmission cables of resistance R is:
                  <div className="bg-slate-950 p-2 rounded my-1 font-mono text-cyan-300 text-center">
                    P_loss = I² × R
                  </div>
                </li>
                <li>
                  <strong>Substitute I = P/V into Joule's Law:</strong>
                  <div className="bg-slate-950 p-2 rounded my-1 font-mono text-amber-400 font-bold text-center">
                    P_loss = (P / V)² × R = P²R / V²
                  </div>
                </li>
                <li className="text-emerald-300 font-semibold">
                  <strong>Conclusion:</strong> For fixed power P and resistance R, heat loss is strictly inversely proportional to V²:
                  <div className="bg-slate-950 p-2 rounded my-1 font-mono text-emerald-400 font-bold text-center">
                    P_loss ∝ 1 / V²
                  </div>
                </li>
              </ol>
            </div>

            {/* Box 2: Common KCSE Misconception Addressed */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-rose-950/80 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>The Classic Exam Trap: "Doesn't P = V²/R Mean High Voltage Loses More Power?"</span>
              </div>
              <div className="space-y-2 text-slate-300 leading-relaxed">
                <p>
                  <strong>The Trap:</strong> Many students mistakenly argue: <span className="font-mono text-rose-300">"Since P = V²/R, increasing voltage should increase power loss!"</span>
                </p>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <strong className="text-amber-300 block font-bold">Why that is FATALLY WRONG:</strong>
                  <p className="text-slate-300">
                    The <span className="font-mono font-bold text-cyan-300">V</span> in the formula <span className="font-mono text-cyan-300">P = V²/R</span> represents the <em>potential difference (voltage drop ΔV) across the ends of the wire</em>, NOT the transmission voltage to ground!
                  </p>
                  <p className="text-slate-300">
                    The voltage drop across the wire is <span className="font-mono text-amber-300">ΔV = I × R</span>. When transmission voltage <span className="font-mono text-cyan-300">V_trans</span> is high, current <span className="font-mono text-cyan-300">I</span> is very small, so <span className="font-mono text-amber-300">ΔV</span> across the wire is tiny!
                  </p>
                  <p className="text-emerald-300 font-semibold mt-1">
                    Using <span className="font-mono">P = (ΔV)² / R</span> yields the exact same minuscule loss as <span className="font-mono">P = I²R</span>.
                  </p>
                </div>
                <p className="text-[11px] text-slate-400">
                  KNEC Examiner Tip: When calculating line power loss in KCSE Physics Paper 2, ALWAYS use <strong className="text-white">P_loss = I²R</strong> to prevent confusing transmission voltage with line voltage drop.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. TAB 3: PREDICTOR CHALLENGES */}
      {/* ==================================================================== */}
      {activeTab === 'predictor' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 mb-1">
                  <HelpCircle className="w-3.5 h-3.5" /> Predict → Manipulate → Observe → Explain Loop
                </span>
                <h3 className="text-lg font-bold text-white">Transmission Engineering Predictor Challenges</h3>
              </div>
              {/* Challenge Selector */}
              <div className="flex items-center gap-1.5">
                {PREDICTOR_CHALLENGES.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setCurrentPredIdx(idx);
                      setPredSelectedOption(null);
                      setPredSubmitted(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                      currentPredIdx === idx
                        ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Challenge {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Challenge Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-base font-bold text-purple-300">
                {PREDICTOR_CHALLENGES[currentPredIdx].title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {PREDICTOR_CHALLENGES[currentPredIdx].question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {PREDICTOR_CHALLENGES[currentPredIdx].options.map((opt) => {
                  const isSelected = predSelectedOption === opt.id;
                  let optStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-purple-500/50';

                  if (predSubmitted) {
                    if (opt.correct) {
                      optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !opt.correct) {
                      optStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-purple-500/20 border-purple-500 text-purple-200 font-bold';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => !predSubmitted && setPredSelectedOption(opt.id)}
                      disabled={predSubmitted}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt.label}</span>
                      {predSubmitted && opt.correct && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {predSubmitted && isSelected && !opt.correct && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {!predSubmitted ? (
                  <button
                    onClick={handlePredSubmit}
                    disabled={!predSelectedOption}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all disabled:opacity-40"
                  >
                    Submit Prediction
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (currentPredIdx < PREDICTOR_CHALLENGES.length - 1) {
                        setCurrentPredIdx(currentPredIdx + 1);
                        setPredSelectedOption(null);
                        setPredSubmitted(false);
                      } else {
                        setCurrentPredIdx(0);
                        setPredSelectedOption(null);
                        setPredSubmitted(false);
                      }
                    }}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Next Challenge</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Explanation Card upon submission */}
              {predSubmitted && (
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs text-purple-200 space-y-1.5 mt-4">
                  <div className="font-bold flex items-center gap-1.5 text-purple-300">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Pedagogical Explanation:
                  </div>
                  <p className="leading-relaxed">{PREDICTOR_CHALLENGES[currentPredIdx].explanation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 7. TAB 4: KCSE EXAM PRACTICE PROBLEMS */}
      {/* ==================================================================== */}
      {activeTab === 'kcse' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-1">
                  <Award className="w-3.5 h-3.5" /> KNEC Physics Paper 2 Preparation
                </span>
                <h3 className="text-lg font-bold text-white">Authentic KCSE Exam Calculation Practice</h3>
              </div>

              {/* Problem Buttons */}
              <div className="flex items-center gap-1.5">
                {KCSE_PROBLEMS.map((prob, idx) => (
                  <button
                    key={prob.id}
                    onClick={() => {
                      setCurrentKcseIdx(idx);
                      setKcseUserAnswer('');
                      setKcseAnswerStatus(null);
                      setKcseShowSolution(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                      currentKcseIdx === idx
                        ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Question {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Question Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                  {KCSE_PROBLEMS[currentKcseIdx].year}
                </span>
                <span className="text-xs text-slate-400 font-semibold">Marks: [3 Marks]</span>
              </div>

              <h4 className="text-base font-bold text-slate-100">{KCSE_PROBLEMS[currentKcseIdx].title}</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {KCSE_PROBLEMS[currentKcseIdx].question}
              </p>

              {/* Input Area */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="number"
                    step="any"
                    placeholder={`Enter value in ${KCSE_PROBLEMS[currentKcseIdx].unit}`}
                    value={kcseUserAnswer}
                    onChange={(e) => {
                      setKcseUserAnswer(e.target.value);
                      setKcseAnswerStatus(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleKcseSubmit();
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-mono font-bold">
                    {KCSE_PROBLEMS[currentKcseIdx].unit}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleKcseSubmit}
                    disabled={!kcseUserAnswer}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all disabled:opacity-40"
                  >
                    Check Answer
                  </button>
                  <button
                    onClick={() => setKcseShowSolution(!kcseShowSolution)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-all"
                  >
                    {kcseShowSolution ? 'Hide Solution' : 'Show Marking Scheme'}
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              {kcseAnswerStatus && (
                <div
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                    kcseAnswerStatus === 'correct'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500 text-rose-300'
                  }`}
                >
                  {kcseAnswerStatus === 'correct' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        Correct! Full marks awarded: [3/3]. Target = {KCSE_PROBLEMS[currentKcseIdx].target}{' '}
                        {KCSE_PROBLEMS[currentKcseIdx].unit}.
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>
                        Incorrect calculation. Check your powers of 10 or units. Hint: {KCSE_PROBLEMS[currentKcseIdx].hint}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Step-by-Step Marking Scheme */}
              {kcseShowSolution && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2.5 mt-3">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> KNEC Official Marking Scheme Breakdown:
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 font-mono">
                    {KCSE_PROBLEMS[currentKcseIdx].solutionSteps.map((step, sIdx) => (
                      <li key={`step-${sIdx}`} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
