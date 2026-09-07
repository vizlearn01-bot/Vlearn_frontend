import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  RotateCcw,
  Zap,
  Sliders,
  Sparkles,
  Layers,
  Flame,
  Award,
  ChevronRight,
  Volume2,
  VolumeX,
  Power,
  Info,
  CheckCircle2,
  XCircle,
  Radio
} from 'lucide-react';

/**
 * Sound Synthesizer for AC Transformer Hum (50 Hz / 100 Hz magnetostriction hum)
 */
class TransformerAudioSynth {
  constructor() {
    this.ctx = null;
    this.osc1 = null;
    this.osc2 = null;
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

  start(freq = 50, isSolidCore = false) {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;

    try {
      this.osc1 = this.ctx.createOscillator();
      this.osc2 = this.ctx.createOscillator();
      this.gainNode = this.ctx.createGain();

      // Fundamental and double frequency (magnetostriction hum occurs at 2*f = 100 Hz)
      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(freq, this.ctx.currentTime);

      this.osc2.type = 'sine';
      this.osc2.frequency.setValueAtTime(freq * 2, this.ctx.currentTime);

      // Solid core produces louder acoustic hum due to eddy heating and magnetic saturation
      const volume = isSolidCore ? 0.05 : 0.02;
      this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);

      this.osc1.connect(this.gainNode);
      this.osc2.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.osc1.start();
      this.osc2.start();
      this.isPlaying = true;
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  update(freq = 50, isSolidCore = false) {
    if (!this.isPlaying || !this.ctx || !this.gainNode) return;
    try {
      const volume = isSolidCore ? 0.05 : 0.02;
      this.gainNode.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.1);
      if (this.osc1) this.osc1.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
      if (this.osc2) this.osc2.frequency.setTargetAtTime(freq * 2, this.ctx.currentTime, 0.1);
    } catch {
      // Ignore audio update errors
    }
  }

  stop() {
    if (!this.isPlaying) return;
    try {
      if (this.osc1) {
        this.osc1.stop();
        this.osc1.disconnect();
      }
      if (this.osc2) {
        this.osc2.stop();
        this.osc2.disconnect();
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

export default function TransformerSim({ config = {}, onTelemetry }) {
  // ==========================================
  // ACTIVE NAVIGATION TAB
  // ==========================================
  // 'bench': Transformer Bench & Turns Ratio
  // 'eddy': Core Laminations & Eddy Currents
  // 'grid': High-Voltage National Grid Transmission
  // 'kcse': KCSE Exam Practice & Derivations
  const [activeTab, setActiveTab] = useState('bench');

  // ==========================================
  // TAB 1 & COMMON STATE: TRANSFORMER BENCH
  // ==========================================
  const [primaryTurns, setPrimaryTurns] = useState(200); // Np: 50 to 500
  const [secondaryTurns, setSecondaryTurns] = useState(400); // Ns: 50 to 1000
  const [primaryVoltage, setPrimaryVoltage] = useState(120); // Vp: 10 to 240 V
  const [loadResistance, setLoadResistance] = useState(24); // R_L: 5 to 100 ohms
  const [coreType, setCoreType] = useState('laminated'); // 'laminated' | 'solid'
  const [acFrequency, setAcFrequency] = useState(50); // 50 Hz standard (or 60 Hz)
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  // Audio Synth Instance
  const audioSynthRef = useRef(null);
  useEffect(() => {
    audioSynthRef.current = new TransformerAudioSynth();
    return () => {
      if (audioSynthRef.current) {
        audioSynthRef.current.stop();
      }
    };
  }, []);

  // Update audio when power or core changes
  useEffect(() => {
    if (!audioSynthRef.current) return;
    if (!isAudioMuted && isPowerOn) {
      audioSynthRef.current.start(acFrequency, coreType === 'solid');
      audioSynthRef.current.update(acFrequency, coreType === 'solid');
    } else {
      audioSynthRef.current.stop();
    }
  }, [isAudioMuted, isPowerOn, acFrequency, coreType]);

  // ==========================================
  // TAB 2 STATE: CORE LAMINATIONS & EDDY CURRENTS
  // ==========================================
  const [laminationThickness, setLaminationThickness] = useState(0.4); // mm: 0.2 mm to 10.0 mm

  // ==========================================
  // TAB 3 STATE: NATIONAL POWER GRID TRANSMISSION
  // ==========================================
  const [gridGeneratedPowerMW, setGridGeneratedPowerMW] = useState(60); // MW: 10 to 120 MW
  const [gridTransmissionVoltageKV, setGridTransmissionVoltageKV] = useState(132); // kV: 11, 33, 66, 132, 220, 400 kV
  const [gridLineResistanceOhms, setGridLineResistanceOhms] = useState(8); // ohms: 2 to 25 ohms

  // ==========================================
  // TAB 4 STATE: KCSE PRACTICE PROBLEMS
  // ==========================================
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState(null); // 'correct' | 'incorrect' | null
  const [showSolution, setShowSolution] = useState(false);

  // ==========================================
  // ANIMATION CLOCK FOR AC SINE FLUX
  // ==========================================
  const [animClock, setAnimClock] = useState(0);
  const animFrameRef = useRef(null);

  useEffect(() => {
    let lastTime = performance.now();
    const tick = (now) => {
      if (isPowerOn) {
        const dt = (now - lastTime) / 1000;
        setAnimClock((prev) => prev + dt * (acFrequency / 10));
      }
      lastTime = now;
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPowerOn, acFrequency]);

  // ==========================================
  // TRANSFORMER BENCH PHYSICS CALCULATIONS
  // ==========================================
  const benchCalculations = useMemo(() => {
    // Turns ratio a = Ns / Np
    const turnsRatio = secondaryTurns / primaryTurns;

    // Type classification
    let transformerType = '1:1 Isolation';
    let typeBadgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    if (secondaryTurns > primaryTurns) {
      transformerType = 'Step-Up Transformer';
      typeBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    } else if (secondaryTurns < primaryTurns) {
      transformerType = 'Step-Down Transformer';
      typeBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }

    // Efficiency: Laminated soft iron core (~98%) vs Solid unlaminated core (~72% due to heavy eddy currents)
    const efficiency = coreType === 'laminated' ? 0.98 : 0.72;

    if (!isPowerOn) {
      return {
        turnsRatio,
        transformerType,
        typeBadgeColor,
        efficiency,
        secondaryVoltage: 0,
        secondaryCurrent: 0,
        outputPower: 0,
        inputPower: 0,
        primaryCurrent: 0,
        powerLossTotal: 0,
        fluxPeakWb: 0,
        bulbBrightness: 0,
      };
    }

    // Secondary Voltage (ideal e.m.f. induced)
    const secondaryVoltage = primaryVoltage * turnsRatio;

    // Secondary Current through load resistor
    const secondaryCurrent = secondaryVoltage / loadResistance;

    // Power output at load
    const outputPower = secondaryVoltage * secondaryCurrent;

    // Power input (accounting for core & copper losses via efficiency)
    const inputPower = outputPower > 0 ? outputPower / efficiency : 0;

    // Primary current drawn from a.c. supply
    const primaryCurrent = inputPower > 0 ? inputPower / primaryVoltage : 0;

    // Total dissipated power loss (mostly eddy currents & hysteresis in solid core)
    const powerLossTotal = inputPower - outputPower;

    // Magnetic flux amplitude: Phi_max approx = V_p / (4.44 * f * N_p)
    const fluxPeakWb = (primaryVoltage / (4.44 * acFrequency * primaryTurns)) * 1000; // in milli-Webers (mWb)

    // Bulb glow brightness factor (0 to 1, clamps at 1; warning if V > 350V)
    const bulbBrightness = Math.min(1.2, secondaryVoltage / 240);

    return {
      turnsRatio,
      transformerType,
      typeBadgeColor,
      efficiency,
      secondaryVoltage,
      secondaryCurrent,
      outputPower,
      inputPower,
      primaryCurrent,
      powerLossTotal,
      fluxPeakWb,
      bulbBrightness,
    };
  }, [primaryTurns, secondaryTurns, primaryVoltage, loadResistance, coreType, acFrequency, isPowerOn]);

  // ==========================================
  // CORE EDDY CURRENT CALCULATIONS (TAB 2)
  // ==========================================
  const eddyCalculations = useMemo(() => {
    // Relative eddy current loss is proportional to thickness squared: P_eddy propto t^2
    // Benchmark: at t = 0.4 mm, relative loss is 1.0 (baseline 2 W)
    const relativeLossFactor = Math.pow(laminationThickness / 0.4, 2);
    const baseEddyLossW = 2.5; // Watts in good laminated core
    const currentEddyLossW = Math.min(380, baseEddyLossW * relativeLossFactor);

    // Core temperature rises with eddy dissipation
    // Ambient = 24 deg C. Solid thick core gets up to 125 deg C!
    const tempRise = Math.min(105, currentEddyLossW * 0.28);
    const coreTempDegC = 24 + tempRise;

    // Efficiency penalty as thickness increases
    const simulatedEff = Math.max(55, 99.2 - currentEddyLossW * 0.12);

    return {
      relativeLossFactor,
      currentEddyLossW,
      coreTempDegC,
      simulatedEff,
    };
  }, [laminationThickness]);

  // ==========================================
  // NATIONAL POWER GRID CALCULATIONS (TAB 3)
  // ==========================================
  const gridCalculations = useMemo(() => {
    const pGenWatts = gridGeneratedPowerMW * 1e6; // Watts
    const vTransVolts = gridTransmissionVoltageKV * 1e3; // Volts

    // Transmission line current: I = P / V
    const transmissionCurrentAmps = pGenWatts / vTransVolts;

    // Joule line loss: P_loss = I^2 * R
    const lineLossWatts = Math.pow(transmissionCurrentAmps, 2) * gridLineResistanceOhms;
    const lineLossMW = lineLossWatts / 1e6;

    // Transmission line voltage drop: delta V = I * R
    const lineVoltageDropVolts = transmissionCurrentAmps * gridLineResistanceOhms;

    // Power received at destination substation
    const powerDeliveredMW = Math.max(0, gridGeneratedPowerMW - lineLossMW);

    // Grid efficiency
    const gridEfficiency = Math.max(0, (powerDeliveredMW / gridGeneratedPowerMW) * 100);

    // Comparison benchmark: what if power was transmitted directly at generation voltage (11 kV)?
    const current11kV = pGenWatts / 11000;
    const loss11kVWatts = Math.pow(current11kV, 2) * gridLineResistanceOhms;
    const loss11kVMW = loss11kVWatts / 1e6;

    // Severe danger check: does line loss exceed total power or melt wire?
    const isCriticalOverload = lineLossMW >= gridGeneratedPowerMW * 0.5;

    return {
      transmissionCurrentAmps,
      lineLossWatts,
      lineLossMW,
      lineVoltageDropVolts,
      powerDeliveredMW,
      gridEfficiency,
      loss11kVMW,
      isCriticalOverload,
    };
  }, [gridGeneratedPowerMW, gridTransmissionVoltageKV, gridLineResistanceOhms]);

  // ==========================================
  // KCSE EXAM QUESTIONS DATABASE
  // ==========================================
  const KCSE_PROBLEMS = [
    {
      id: 'kcse_1',
      year: 'KCSE 2021 Paper 2',
      title: 'Turns Ratio & Output Voltage Calculation',
      scenario:
        'A mobile phone charger contains a step-down transformer connected to a 240 V a.c. mains supply. The primary coil has 800 turns and the secondary coil has 40 turns. Assuming 100% efficiency, calculate the secondary output voltage (in Volts).',
      targetValue: 12.0,
      unit: 'V',
      tolerance: 0.2,
      hint: 'Apply the ideal transformer turns ratio formula: Vs / Vp = Ns / Np.',
      solutionSteps: [
        'Identify given variables: Vp = 240 V, Np = 800 turns, Ns = 40 turns.',
        'Apply the transformer turns equation: Vs / Vp = Ns / Np',
        'Rearrange for Vs: Vs = Vp × (Ns / Np)',
        'Substitute values: Vs = 240 × (40 / 800) = 240 × (1 / 20) = 12.0 V.',
        'Final Output: Vs = 12 V (Safe step-down for consumer electronics).',
      ],
    },
    {
      id: 'kcse_2',
      year: 'KCSE 2019 Paper 2',
      title: 'Primary Current of an 80% Efficient Transformer',
      scenario:
        'A transformer with an efficiency of 80% is used to light a 12 V, 48 W lamp from a 240 V a.c. mains line. Calculate the current drawn from the 240 V mains by the primary coil (in Amperes).',
      targetValue: 0.25,
      unit: 'A',
      tolerance: 0.02,
      hint: 'Efficiency η = (Pout / Pin) × 100%. Pin = Vp × Ip. First find Pin, then solve for Ip.',
      solutionSteps: [
        'Identify given variables: Pout = 48 W, Vs = 12 V, Vp = 240 V, Efficiency η = 80% = 0.80.',
        'Apply efficiency definition: η = Pout / Pin',
        'Compute input power: Pin = Pout / η = 48 W / 0.80 = 60 W.',
        'Use input power formula: Pin = Vp × Ip',
        'Solve for primary current: Ip = Pin / Vp = 60 W / 240 V = 0.25 A.',
        'Final Output: Ip = 0.25 A.',
      ],
    },
    {
      id: 'kcse_3',
      year: 'KCSE 2022 Paper 2',
      title: 'National Grid High-Voltage Power Loss Reduction',
      scenario:
        'A power station generates 500 kW of power at 10 kV. The power is transmitted across cables of total resistance 4 ohms. Calculate the power lost as heat in the transmission lines (in kW).',
      targetValue: 10.0,
      unit: 'kW',
      tolerance: 0.5,
      hint: 'First find the transmission current I = P / V, then calculate Ploss = I² × R.',
      solutionSteps: [
        'Identify given variables: Pgen = 500 kW = 500,000 W, Vline = 10 kV = 10,000 V, Rline = 4 Ω.',
        'Calculate transmission current: I = P / V = 500,000 W / 10,000 V = 50 A.',
        'Calculate line power loss: Ploss = I² × R = (50 A)² × 4 Ω = 2500 × 4 = 10,000 W.',
        'Convert to kilowatts: 10,000 W / 1,000 = 10.0 kW.',
        'Final Output: Ploss = 10 kW (Only 2% of the generated power is lost).',
      ],
    },
    {
      id: 'kcse_4',
      year: 'KCSE 2017 Paper 2',
      title: 'Transformers and Direct Current (D.C.) Misconception',
      scenario:
        'A student connects a 12 V d.c. car accumulator battery across the primary coil of a 1:10 step-up transformer. What is the steady voltage reading displayed on a voltmeter across the secondary coil (in Volts)?',
      targetValue: 0.0,
      unit: 'V',
      tolerance: 0.01,
      hint: 'Recall Faraday’s law of electromagnetic induction: EMF = -N × (dΦ / dt). Does steady D.C. produce a changing magnetic flux?',
      solutionSteps: [
        'Identify given conditions: A steady direct current (D.C.) battery is connected to the primary winding.',
        'Faraday’s Law of Electromagnetic Induction states: Induced EMF = -N × (dΦ / dt).',
        'Direct current produces a constant, steady magnetic flux in the core (dΦ / dt = 0).',
        'Because the rate of change of magnetic flux through the secondary coil is zero, no e.m.f. is induced.',
        'Warning: A massive current will flow through the primary winding due to low D.C. coil resistance, burning out the transformer!',
        'Final Output: 0.0 V (Voltmeter reads zero under steady state).',
      ],
    },
  ];

  const currentProblem = KCSE_PROBLEMS[currentProblemIdx];

  const handleCheckAnswer = (e) => {
    e.preventDefault();
    const val = parseFloat(userAnswer.trim());
    if (isNaN(val)) return;

    if (Math.abs(val - currentProblem.targetValue) <= currentProblem.tolerance) {
      setAnswerStatus('correct');
      if (onTelemetry) {
        onTelemetry('kcse_problem_correct', {
          problemId: currentProblem.id,
          answer: val,
        });
      }
    } else {
      setAnswerStatus('incorrect');
    }
  };

  const handleNextProblem = () => {
    setCurrentProblemIdx((prev) => (prev + 1) % KCSE_PROBLEMS.length);
    setUserAnswer('');
    setAnswerStatus(null);
    setShowSolution(false);
  };

  // Reset entire simulation to standard laboratory initial conditions
  const handleReset = () => {
    setPrimaryTurns(200);
    setSecondaryTurns(400);
    setPrimaryVoltage(120);
    setLoadResistance(24);
    setCoreType('laminated');
    setAcFrequency(50);
    setIsPowerOn(true);
    setLaminationThickness(0.4);
    setGridGeneratedPowerMW(60);
    setGridTransmissionVoltageKV(132);
    setGridLineResistanceOhms(8);
    setUserAnswer('');
    setAnswerStatus(null);
    setShowSolution(false);
  };

  // Quick Preset Configurations
  const applyPreset = (presetKey) => {
    setIsPowerOn(true);
    if (presetKey === 'step_up') {
      setPrimaryTurns(100);
      setSecondaryTurns(400);
      setPrimaryVoltage(120);
      setLoadResistance(40);
      setCoreType('laminated');
    } else if (presetKey === 'step_down') {
      setPrimaryTurns(400);
      setSecondaryTurns(80);
      setPrimaryVoltage(240);
      setLoadResistance(12);
      setCoreType('laminated');
    } else if (presetKey === 'isolation') {
      setPrimaryTurns(250);
      setSecondaryTurns(250);
      setPrimaryVoltage(240);
      setLoadResistance(30);
      setCoreType('laminated');
    } else if (presetKey === 'eddy_test') {
      setPrimaryTurns(200);
      setSecondaryTurns(400);
      setPrimaryVoltage(180);
      setLoadResistance(15);
      setCoreType('solid');
    }
  };

  // ==========================================
  // SVG CANVAS RENDERING HELPERS
  // ==========================================
  // Sinusoidal wave phase for live alternating visual
  const wavePhase = animClock * 2 * Math.PI;
  const instantFlux = Math.sin(wavePhase); // -1 to +1

  // Turns coil wire positions
  const numVisualPriTurns = Math.round(Math.min(16, Math.max(5, (primaryTurns / 500) * 16)));
  const numVisualSecTurns = Math.round(Math.min(22, Math.max(5, (secondaryTurns / 1000) * 22)));

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-3xl p-3 sm:p-5 md:p-8 font-sans border border-slate-800 shadow-2xl space-y-6">
      {/* 1. HEADER & EXPERIMENTAL BARS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Zap className="w-3.5 h-3.5" /> Form 4 Physics • Topic 5: Electromagnetic Induction
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Module 5.3: Transformers & Grid Systems
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            Transformer & Mutual Induction Simulator
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-3xl">
            Explore alternating magnetic flux linkage Φ(t), turns ratio transformation Vs / Vp = Ns / Np = Ip / Is, core eddy current suppression via thin laminations, and national high-voltage grid transmission.
          </p>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center flex-wrap">
          {/* Power Switch */}
          <button
            onClick={() => setIsPowerOn(!isPowerOn)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isPowerOn
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 ring-2 ring-emerald-400/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
            }`}
            title="Toggle Primary A.C. Power"
          >
            <Power className={`w-4 h-4 ${isPowerOn ? 'text-emerald-200 animate-pulse' : 'text-slate-500'}`} />
            {isPowerOn ? 'A.C. Active' : 'Supply Off'}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-2 rounded-xl text-xs font-medium border transition-all ${
              !isAudioMuted
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isAudioMuted ? 'Unmute 50Hz Transformer Hum' : 'Mute Sound'}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset System */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all active:scale-95"
            title="Reset All Parameters to Default"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            Reset Lab
          </button>
        </div>
      </div>

      {/* 2. MODE NAVIGATION TABS */}
      <div className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-x-auto">
        <button
          onClick={() => setActiveTab('bench')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'bench'
              ? 'bg-custom-blue text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-4 h-4 text-cyan-300" />
          Transformer Bench & Turns Ratio
        </button>

        <button
          onClick={() => setActiveTab('eddy')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'eddy'
              ? 'bg-custom-blue text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-300" />
          Core Laminations & Eddy Heating
        </button>

        <button
          onClick={() => setActiveTab('grid')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'grid'
              ? 'bg-custom-blue text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-300" />
          National Grid Transmission (I²R)
        </button>

        <button
          onClick={() => setActiveTab('kcse')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'kcse'
              ? 'bg-custom-blue text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4 text-rose-300" />
          KCSE Practice Challenge
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: TRANSFORMER BENCH & TURNS RATIO */}
      {/* ==================================================================== */}
      {activeTab === 'bench' && (
        <div className="space-y-6">
          {/* Quick Presets Bar */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-medium">Standard Presets:</span>
            <button
              onClick={() => applyPreset('step_up')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold transition-all"
            >
              Step-Up (120V → 480V)
            </button>
            <button
              onClick={() => applyPreset('step_down')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-semibold transition-all"
            >
              Step-Down Phone Charger (240V → 48V)
            </button>
            <button
              onClick={() => applyPreset('isolation')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 font-semibold transition-all"
            >
              1:1 Isolation Safety (240V → 240V)
            </button>
            <button
              onClick={() => applyPreset('eddy_test')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-300 border border-rose-900/50 font-semibold transition-all"
            >
              Solid Core Eddy Heat Stress Test
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Controls Deck (4 cols) */}
            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Winding & Core Controls
                </h3>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${benchCalculations.typeBadgeColor}`}>
                  {benchCalculations.transformerType}
                </span>
              </div>

              {/* Slider 1: Primary Turns Np */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor="primary-turns-slider" className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                    Primary Turns (Np):
                  </label>
                  <span className="font-mono font-bold text-cyan-300 text-sm">{primaryTurns} turns</span>
                </div>
                <input
                  id="primary-turns-slider"
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={primaryTurns}
                  onChange={(e) => setPrimaryTurns(parseInt(e.target.value))}
                  aria-label="Primary coil turns"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>50 t</span>
                  <span>250 t</span>
                  <span>500 t</span>
                </div>
              </div>

              {/* Slider 2: Secondary Turns Ns */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor="secondary-turns-slider" className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    Secondary Turns (Ns):
                  </label>
                  <span className="font-mono font-bold text-amber-300 text-sm">{secondaryTurns} turns</span>
                </div>
                <input
                  id="secondary-turns-slider"
                  type="range"
                  min="50"
                  max="1000"
                  step="10"
                  value={secondaryTurns}
                  onChange={(e) => setSecondaryTurns(parseInt(e.target.value))}
                  aria-label="Secondary coil turns"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>50 t</span>
                  <span>500 t</span>
                  <span>1000 t</span>
                </div>
              </div>

              {/* Slider 3: Primary Input Voltage Vp */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor="primary-voltage-slider" className="text-slate-300 font-semibold">Primary Voltage (Vp A.C.):</label>
                  <span className="font-mono font-bold text-emerald-300 text-sm">{primaryVoltage} V</span>
                </div>
                <input
                  id="primary-voltage-slider"
                  type="range"
                  min="10"
                  max="240"
                  step="5"
                  value={primaryVoltage}
                  onChange={(e) => setPrimaryVoltage(parseInt(e.target.value))}
                  aria-label="Primary A.C. input voltage"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>10 V</span>
                  <span>120 V (US)</span>
                  <span>240 V (Kenya Grid)</span>
                </div>
              </div>

              {/* Slider 4: Secondary Load Resistance R_L */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor="load-resistance-slider" className="text-slate-300 font-semibold">Load Resistance (RL):</label>
                  <span className="font-mono font-bold text-slate-200 text-sm">{loadResistance} Ω</span>
                </div>
                <input
                  id="load-resistance-slider"
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={loadResistance}
                  onChange={(e) => setLoadResistance(parseInt(e.target.value))}
                  aria-label="Secondary load resistance"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>5 Ω (Heavy Load)</span>
                  <span>50 Ω</span>
                  <span>100 Ω (Light Load)</span>
                </div>
              </div>

              {/* Core Construction Toggle */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block">
                  Core Construction Architecture:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCoreType('laminated')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      coreType === 'laminated'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Laminated Core
                    <span className="block text-[10px] font-normal text-cyan-400/80">98% Efficient (Low Heat)</span>
                  </button>

                  <button
                    onClick={() => setCoreType('solid')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      coreType === 'solid'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200 shadow-md shadow-rose-950'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Solid Iron Core
                    <span className="block text-[10px] font-normal text-rose-400/80">72% Eff. (Eddy Heating)</span>
                  </button>
                </div>
              </div>

              {/* Supply Frequency Toggle */}
              <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-800">
                <span className="text-slate-400">A.C. Supply Frequency:</span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setAcFrequency(50)}
                    className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                      acFrequency === 50 ? 'bg-slate-800 text-cyan-300' : 'text-slate-400'
                    }`}
                  >
                    50 Hz (KPLC)
                  </button>
                  <button
                    onClick={() => setAcFrequency(60)}
                    className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                      acFrequency === 60 ? 'bg-slate-800 text-cyan-300' : 'text-slate-400'
                    }`}
                  >
                    60 Hz
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Interactive SVG Visualizer & Telemetry (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Primary Interactive SVG Stage */}
              <div className="relative w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex flex-col">
                {/* SVG Visual Stage */}
                <div className="w-full aspect-[16/10] min-h-[340px] max-h-[480px]">
                  <svg
                    viewBox="0 0 800 500"
                    className="w-full h-full select-none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background Grid Pattern */}
                    <defs>
                      <pattern id="labGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                      </pattern>

                      {/* Laminated Core Texture Pattern */}
                      <pattern id="laminationLines" width="6" height="6" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="6" stroke="#475569" strokeWidth="1.2" />
                        <line x1="3" y1="0" x2="3" y2="6" stroke="#1e293b" strokeWidth="0.8" />
                      </pattern>

                      {/* Solid Core Texture Gradient */}
                      <linearGradient id="solidIronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="50%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>

                      {/* Eddy Heat Glow */}
                      <radialGradient id="eddyHeatGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.75" />
                        <stop offset="60%" stopColor="#f97316" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    <rect width="800" height="500" fill="#0b1120" />
                    <rect width="800" height="500" fill="url(#labGrid)" opacity="0.6" />

                    {/* Stage Header Info Banner */}
                    <g transform="translate(400, 26)">
                      <rect x="-240" y="-14" width="480" height="28" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                      <text x="0" y="4" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily="monospace">
                        MUTUAL INDUCTION FLUX LINKAGE • Φ(t) = Φmax · sin(ωt)
                      </text>
                    </g>

                    {/* ============================================== */}
                    {/* CLOSED SOFT IRON TRANSFORMER CORE */}
                    {/* Outer Rect: (200, 80) to (600, 420), width=400, height=340 */}
                    {/* Inner Hole: (290, 160) to (510, 340), width=220, height=180 */}
                    {/* Limb Width = 90 px */}
                    {/* ============================================== */}
                    <g id="transformerCore">
                      {/* Base Core Structure Path (outer frame minus inner window) */}
                      <path
                        d="M 200,80 L 600,80 L 600,420 L 200,420 Z M 290,160 L 290,340 L 510,340 L 510,160 Z"
                        fill={coreType === 'laminated' ? '#1e293b' : 'url(#solidIronGrad)'}
                        stroke="#475569"
                        strokeWidth="3"
                        fillRule="evenodd"
                      />

                      {/* Laminated Sheets Texture if active */}
                      {coreType === 'laminated' && (
                        <path
                          d="M 200,80 L 600,80 L 600,420 L 200,420 Z M 290,160 L 290,340 L 510,340 L 510,160 Z"
                          fill="url(#laminationLines)"
                          opacity="0.85"
                          fillRule="evenodd"
                        />
                      )}

                      {/* Solid Core: Eddy Current Hotspots & Swirling Current Vortexes */}
                      {coreType === 'solid' && isPowerOn && (
                        <g>
                          {/* Heat Glow on Top & Bottom Limbs */}
                          <ellipse cx="400" cy="120" rx="90" ry="28" fill="url(#eddyHeatGlow)" />
                          <ellipse cx="400" cy="380" rx="90" ry="28" fill="url(#eddyHeatGlow)" />
                          <ellipse cx="245" cy="250" rx="35" ry="70" fill="url(#eddyHeatGlow)" />
                          <ellipse cx="555" cy="250" rx="35" ry="70" fill="url(#eddyHeatGlow)" />

                          {/* Swirling Eddy Rings in Solid Iron */}
                          <ellipse
                            cx="400"
                            cy="120"
                            rx="50"
                            ry="16"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="2.5"
                            strokeDasharray="6 4"
                            strokeDashoffset={animClock * 30}
                          />
                          <ellipse
                            cx="400"
                            cy="380"
                            rx="50"
                            ry="16"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="2.5"
                            strokeDasharray="6 4"
                            strokeDashoffset={-animClock * 30}
                          />
                          <text
                            x="400"
                            y="124"
                            textAnchor="middle"
                            fill="#fef08a"
                            fontSize="10"
                            fontWeight="800"
                            fontFamily="monospace"
                          >
                            EDDY CURRENTS (I²R LOSS)
                          </text>
                        </g>
                      )}

                      {/* Core Label */}
                      <text
                        x="400"
                        y="235"
                        textAnchor="middle"
                        fill="#cbd5e1"
                        fontSize="12"
                        fontWeight="700"
                      >
                        {coreType === 'laminated' ? 'LAMINATED SOFT IRON CORE' : 'SOLID UNLAMINATED CORE'}
                      </text>
                      <text
                        x="400"
                        y="252"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="10"
                      >
                        Low Reluctance Closed Magnetic Circuit
                      </text>

                      {/* Dynamic Magnetic Flux Lines (Central Loop around Core) */}
                      {isPowerOn && (
                        <g>
                          {/* Outer Flux Loop */}
                          <rect
                            x="235"
                            y="110"
                            width="330"
                            height="280"
                            rx="18"
                            fill="none"
                            stroke={instantFlux >= 0 ? '#38bdf8' : '#f59e0b'}
                            strokeWidth="3.5"
                            strokeDasharray="14 10"
                            strokeDashoffset={instantFlux >= 0 ? -animClock * 80 : animClock * 80}
                            opacity={Math.max(0.2, Math.abs(instantFlux))}
                          />

                          {/* Inner Flux Loop */}
                          <rect
                            x="255"
                            y="130"
                            width="290"
                            height="240"
                            rx="10"
                            fill="none"
                            stroke={instantFlux >= 0 ? '#38bdf8' : '#f59e0b'}
                            strokeWidth="2"
                            strokeDasharray="10 8"
                            strokeDashoffset={instantFlux >= 0 ? -animClock * 80 : animClock * 80}
                            opacity={Math.max(0.15, Math.abs(instantFlux) * 0.7)}
                          />

                          {/* Flux Direction Indicator Arrows */}
                          <g transform="translate(400, 110)">
                            <polygon
                              points={instantFlux >= 0 ? '10,-6 22,0 10,6' : '-10,-6 -22,0 -10,6'}
                              fill={instantFlux >= 0 ? '#38bdf8' : '#f59e0b'}
                            />
                            <text
                              x="0"
                              y="-10"
                              textAnchor="middle"
                              fill={instantFlux >= 0 ? '#38bdf8' : '#f59e0b'}
                              fontSize="11"
                              fontWeight="800"
                              fontFamily="monospace"
                            >
                              Flux Φ ({benchCalculations.fluxPeakWb.toFixed(2)} mWb)
                            </text>
                          </g>
                        </g>
                      )}
                    </g>

                    {/* ============================================== */}
                    {/* PRIMARY WINDINGS (LEFT LIMB: x = 200 to 290) */}
                    {/* ============================================== */}
                    <g id="primaryWindings">
                      {/* Connection wires from AC supply to left limb */}
                      <path d="M 80,180 L 200,180" stroke="#38bdf8" strokeWidth="3.5" fill="none" />
                      <path d="M 80,320 L 200,320" stroke="#38bdf8" strokeWidth="3.5" fill="none" />

                      {/* AC Supply Box on Far Left */}
                      <g transform="translate(80, 250)">
                        <circle cx="0" cy="0" r="32" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                        <path d="M -14,0 Q -7,-14 0,0 Q 7,14 14,0" fill="none" stroke="#38bdf8" strokeWidth="3" />
                        <text x="0" y="44" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="800">
                          A.C. MAINS
                        </text>
                        <text x="0" y="58" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                          {primaryVoltage} V • {acFrequency} Hz
                        </text>
                      </g>

                      {/* Primary Coil Winding Loops Over Limb */}
                      {Array.from({ length: numVisualPriTurns }).map((_, i) => {
                        const yPos = 180 + (i * (140 / (numVisualPriTurns - 1 || 1)));
                        return (
                          <g key={`pri-turn-${i}`}>
                            {/* Back half of loop */}
                            <ellipse
                              cx="245"
                              cy={yPos}
                              rx="54"
                              ry="6"
                              fill="none"
                              stroke="#0284c7"
                              strokeWidth="5"
                              opacity="0.6"
                            />
                            {/* Front half of loop */}
                            <ellipse
                              cx="245"
                              cy={yPos + 4}
                              rx="54"
                              ry="6"
                              fill="none"
                              stroke="#38bdf8"
                              strokeWidth="5"
                            />
                          </g>
                        );
                      })}

                      {/* Primary Labels & Badges */}
                      <g transform="translate(140, 140)">
                        <rect x="-55" y="-12" width="110" height="24" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                        <text x="0" y="4" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="800">
                          PRIMARY COIL
                        </text>
                        <text x="0" y="24" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
                          Np = {primaryTurns} turns
                        </text>
                        <text x="0" y="38" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                          Ip = {benchCalculations.primaryCurrent.toFixed(2)} A
                        </text>
                      </g>
                    </g>

                    {/* ============================================== */}
                    {/* SECONDARY WINDINGS (RIGHT LIMB: x = 510 to 600) */}
                    {/* ============================================== */}
                    <g id="secondaryWindings">
                      {/* Connection wires from right limb to load */}
                      <path d="M 600,180 L 710,180" stroke="#f59e0b" strokeWidth="3.5" fill="none" />
                      <path d="M 600,320 L 710,320" stroke="#f59e0b" strokeWidth="3.5" fill="none" />

                      {/* Secondary Coil Winding Loops Over Limb */}
                      {Array.from({ length: numVisualSecTurns }).map((_, i) => {
                        const yPos = 180 + (i * (140 / (numVisualSecTurns - 1 || 1)));
                        return (
                          <g key={`sec-turn-${i}`}>
                            {/* Back half of loop */}
                            <ellipse
                              cx="555"
                              cy={yPos}
                              rx="54"
                              ry="6"
                              fill="none"
                              stroke="#b45309"
                              strokeWidth="4"
                              opacity="0.6"
                            />
                            {/* Front half of loop */}
                            <ellipse
                              cx="555"
                              cy={yPos + 4}
                              rx="54"
                              ry="6"
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="4"
                            />
                          </g>
                        );
                      })}

                      {/* Secondary Load Station (Incandescent Test Lamp + Load Resistor) */}
                      <g transform="translate(710, 250)">
                        {/* Connecting wires to load */}
                        <line x1="0" y1="-70" x2="0" y2="-35" stroke="#f59e0b" strokeWidth="3" />
                        <line x1="0" y1="70" x2="0" y2="35" stroke="#f59e0b" strokeWidth="3" />

                        {/* Load Light Bulb Base */}
                        <rect x="-14" y="24" width="28" height="12" fill="#64748b" rx="2" />

                        {/* Bulb Glass Envelope */}
                        <circle
                          cx="0"
                          cy="0"
                          r="28"
                          fill={isPowerOn && benchCalculations.bulbBrightness > 0.05 ? '#fef08a' : '#1e293b'}
                          fillOpacity={Math.min(0.9, benchCalculations.bulbBrightness * 0.85 + 0.1)}
                          stroke="#f59e0b"
                          strokeWidth="2.5"
                        />

                        {/* Bulb Filament */}
                        <path
                          d="M -10,12 L -6,-8 L 0,-2 L 6,-8 L 10,12"
                          fill="none"
                          stroke={isPowerOn && benchCalculations.bulbBrightness > 0.05 ? '#ffffff' : '#94a3b8'}
                          strokeWidth="2.5"
                        />

                        {/* Glowing Halo when energized */}
                        {isPowerOn && benchCalculations.bulbBrightness > 0.1 && (
                          <circle
                            cx="0"
                            cy="0"
                            r={36 + benchCalculations.bulbBrightness * 20}
                            fill="#f59e0b"
                            fillOpacity={Math.min(0.35, benchCalculations.bulbBrightness * 0.3)}
                            pointerEvents="none"
                          />
                        )}

                        <text x="0" y="-42" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="800">
                          LOAD LAMP
                        </text>
                        <text x="0" y="52" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="700" fontFamily="monospace">
                          {benchCalculations.outputPower.toFixed(1)} W
                        </text>
                        <text x="0" y="66" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                          RL = {loadResistance} Ω
                        </text>
                      </g>

                      {/* Secondary Labels & Badges */}
                      <g transform="translate(660, 140)">
                        <rect x="-55" y="-12" width="110" height="24" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                        <text x="0" y="4" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="800">
                          SECONDARY COIL
                        </text>
                        <text x="0" y="24" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
                          Ns = {secondaryTurns} turns
                        </text>
                        <text x="0" y="38" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                          Is = {benchCalculations.secondaryCurrent.toFixed(2)} A
                        </text>
                      </g>
                    </g>

                    {/* Center Derivation Callout Banner */}
                    <g transform="translate(400, 460)">
                      <rect x="-220" y="-16" width="440" height="32" rx="8" fill="#0f172a" stroke="#334155" />
                      <text x="0" y="5" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">
                        Turns Ratio: Ns / Np = {secondaryTurns} / {primaryTurns} = {benchCalculations.turnsRatio.toFixed(2)} • Output: Vs = {benchCalculations.secondaryVoltage.toFixed(1)} V
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Live Oscilloscope Trace Strip (Dual Channel Vp & Vs) */}
                <div className="bg-slate-950/90 border-t border-slate-800 p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      Vp(t) Peak: {primaryVoltage.toFixed(1)} V
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      Vs(t) Peak: {benchCalculations.secondaryVoltage.toFixed(1)} V
                    </span>
                  </div>

                  {/* Oscilloscope Mini Preview */}
                  <div className="h-10 w-48 bg-slate-900 rounded border border-slate-800 relative overflow-hidden flex items-center">
                    <svg className="w-full h-full" viewBox="0 0 160 40">
                      {/* Center zero axis */}
                      <line x1="0" y1="20" x2="160" y2="20" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                      {/* Primary sine wave (Cyan) */}
                      {isPowerOn && (
                        <path
                          d={`M ${Array.from({ length: 80 })
                            .map((_, i) => {
                              const x = i * 2;
                              const y = 20 - Math.sin((x / 20) * Math.PI + wavePhase) * 12;
                              return `${x},${y}`;
                            })
                            .join(' L ')}`}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="1.8"
                        />
                      )}
                      {/* Secondary sine wave (Amber) */}
                      {isPowerOn && (
                        <path
                          d={`M ${Array.from({ length: 80 })
                            .map((_, i) => {
                              const x = i * 2;
                              const amp = Math.min(18, (benchCalculations.secondaryVoltage / 240) * 16);
                              const y = 20 + Math.sin((x / 20) * Math.PI + wavePhase) * amp;
                              return `${x},${y}`;
                            })
                            .join(' L ')}`}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="1.8"
                        />
                      )}
                    </svg>
                    <span className="absolute right-1 bottom-0.5 text-[9px] font-mono text-slate-500">
                      CRO TRACE
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-Time Telemetry Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                    Secondary Voltage (Vs)
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg sm:text-xl font-mono font-black text-amber-300">
                      {benchCalculations.secondaryVoltage.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">V</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Vs = Vp × (Ns / Np)
                  </span>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                    Secondary Current (Is)
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg sm:text-xl font-mono font-black text-amber-400">
                      {benchCalculations.secondaryCurrent.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">A</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Is = Vs / RL
                  </span>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                    Primary Current (Ip)
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg sm:text-xl font-mono font-black text-cyan-300">
                      {benchCalculations.primaryCurrent.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">A</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Ip = Pin / Vp
                  </span>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                    Core Efficiency (η)
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span
                      className={`text-lg sm:text-xl font-mono font-black ${
                        coreType === 'laminated' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {(benchCalculations.efficiency * 100).toFixed(0)}%
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ({coreType === 'laminated' ? 'Cool' : 'Hot'})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Loss: {benchCalculations.powerLossTotal.toFixed(1)} W
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: CORE LAMINATIONS & EDDY CURRENTS */}
      {/* ==================================================================== */}
      {activeTab === 'eddy' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  Eddy Current Suppression via Thin Laminations
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Alternating flux dΦ/dt induces internal loops of circulating currents (eddy currents) in the core metal. Explore how thin insulated sheets slash I²R heat dissipation.
                </p>
              </div>

              {/* Lamination Thickness Slider */}
              <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-300 font-semibold whitespace-nowrap">
                  Sheet Thickness (t):
                </span>
                <input
                  type="range"
                  min="0.2"
                  max="5.0"
                  step="0.1"
                  value={laminationThickness}
                  onChange={(e) => setLaminationThickness(parseFloat(e.target.value))}
                  className="w-32 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <span className="font-mono font-bold text-amber-300 text-xs whitespace-nowrap">
                  {laminationThickness.toFixed(1)} mm
                </span>
              </div>
            </div>

            {/* Visual Side-by-Side Comparison: Solid Core vs Laminated Core */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Box A: Solid Iron Core (Unlaminated) */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-rose-900/40 relative overflow-hidden space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    <Flame className="w-3.5 h-3.5" /> Solid Iron Core (Unlaminated)
                  </span>
                  <span className="text-xs font-mono text-rose-300 font-bold">
                    Severe Heat Loss
                  </span>
                </div>

                {/* SVG Cross Section of Solid Core */}
                <div className="w-full aspect-[4/3] bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 300 220" className="w-full h-full">
                    {/* Bulk iron block */}
                    <rect x="40" y="30" width="220" height="160" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />

                    {/* Alternating flux entering cross section (perpendicular) */}
                    <circle cx="150" cy="110" r="14" fill="#0284c7" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" />
                    <text x="150" y="114" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="800">
                      Φ
                    </text>

                    {/* Massive Eddy Current Loops across entire cross-section */}
                    <ellipse
                      cx="150"
                      cy="110"
                      rx="85"
                      ry="65"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3.5"
                      strokeDasharray="8 6"
                      strokeDashoffset={animClock * 40}
                    />
                    <ellipse
                      cx="150"
                      cy="110"
                      rx="55"
                      ry="40"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      strokeDashoffset={animClock * 30}
                    />

                    {/* Eddy current direction arrow */}
                    <polygon points="150,42 162,45 150,48" fill="#ef4444" />
                    <text x="150" y="24" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">
                      Large Eddy Current Loops (I_eddy Huge)
                    </text>
                    <text x="150" y="196" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="monospace">
                      Low Loop Resistance ⇒ High I²R Dissipation
                    </text>
                  </svg>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Eddy Current Resistance:</span>
                    <span className="font-mono text-rose-400 font-bold">Very Low (Short paths)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Power Dissipated as Heat:</span>
                    <span className="font-mono text-rose-400 font-bold">High (~25% to 35% Loss)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Solid iron provides wide, continuous conductive pathways. The alternating flux induces massive eddy currents that heat the core dangerously and waste electrical power.
                  </p>
                </div>
              </div>

              {/* Box B: Laminated Core (Thin insulated sheets) */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-cyan-900/40 relative overflow-hidden space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    <Layers className="w-3.5 h-3.5" /> Laminated Soft Iron Core
                  </span>
                  <span className="text-xs font-mono text-cyan-300 font-bold">
                    Minimal Heat Loss (&lt; 2%)
                  </span>
                </div>

                {/* SVG Cross Section of Laminated Core */}
                <div className="w-full aspect-[4/3] bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 300 220" className="w-full h-full">
                    {/* Background boundary */}
                    <rect x="40" y="30" width="220" height="160" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />

                    {/* 6 Insulated Laminations (Vertical Slices) */}
                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                      const xStart = 42 + idx * 36;
                      return (
                        <g key={`lam-slice-${idx}`}>
                          <rect
                            x={xStart}
                            y="32"
                            width="34"
                            height="156"
                            fill="#1e293b"
                            stroke="#38bdf8"
                            strokeWidth="1.5"
                          />
                          {/* Insulating varnish layer line */}
                          <line x1={xStart + 35} y1="32" x2={xStart + 35} y2="188" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />

                          {/* Tiny, restricted eddy current loop inside each lamina */}
                          <ellipse
                            cx={xStart + 17}
                            cy="110"
                            rx="12"
                            ry="45"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="1.5"
                            strokeDasharray="4 3"
                            strokeDashoffset={animClock * 20}
                          />
                        </g>
                      );
                    })}

                    <text x="150" y="24" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="700">
                      Insulated Varnish Layers Break the Loops
                    </text>
                    <text x="150" y="202" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                      High Loop Resistance ⇒ Tiny I_eddy (P ∝ t²)
                    </text>
                  </svg>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Eddy Current Resistance:</span>
                    <span className="font-mono text-cyan-300 font-bold">Extremely High (Blocked by varnish)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Power Dissipated as Heat:</span>
                    <span className="font-mono text-cyan-300 font-bold">Minimal (~1% to 2% Loss)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    By slicing the core into thin sheets insulated by lacquer/varnish, eddy currents are confined to tiny narrow strips where path resistance is high, reducing losses by t².
                  </p>
                </div>
              </div>
            </div>

            {/* Formula Callout Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 block mb-1">
                  Mathematical Derivation of Eddy Current Power Loss:
                </span>
                <p className="text-xs text-slate-300 font-mono">
                  P_eddy = (π² · B_max² · f² · t²) / (6 · ρ · D)
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Where t = sheet thickness, f = frequency, B_max = peak flux density, and ρ = core electrical resistivity.
                </p>
              </div>

              <div className="bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-800 text-center shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                  Relative Loss at t = {laminationThickness.toFixed(1)} mm
                </span>
                <span className="text-base font-mono font-bold text-amber-300">
                  {eddyCalculations.relativeLossFactor.toFixed(2)} × baseline
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: NATIONAL HIGH-VOLTAGE POWER GRID TRANSMISSION */}
      {/* ==================================================================== */}
      {activeTab === 'grid' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-1">
                <Radio className="w-3.5 h-3.5" /> High-Voltage Transmission Engineering
              </span>
              <h3 className="text-lg font-bold text-white">
                Why Power is Transmitted at Ultra-High Voltages (Ploss = I²R)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Power generated at Olkaria or Seven Forks (P = V × I) must travel hundreds of kilometers. Compare transmitting power at low voltage vs stepping it up to 132 kV or 400 kV.
              </p>
            </div>

            {/* Grid Interactive Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Control 1: Transmission Voltage Presets */}
              <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-300 block">
                  Transmission Line Voltage (V_grid):
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[11, 33, 66, 132, 220, 400].map((v) => (
                    <button
                      key={`grid-v-${v}`}
                      onClick={() => setGridTransmissionVoltageKV(v)}
                      className={`py-1 px-2 rounded-lg font-mono text-xs font-bold transition-all border ${
                        gridTransmissionVoltageKV === v
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-950'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {v} kV
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  {gridTransmissionVoltageKV === 11 ? '⚠️ Direct generator voltage (No step-up)' : 'Step-up transformer substation active'}
                </span>
              </div>

              {/* Control 2: Power Station Generation */}
              <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs">
                  <label htmlFor="grid-power-slider" className="text-slate-300 font-semibold">Generated Power (P_gen):</label>
                  <span className="font-mono font-bold text-cyan-300">{gridGeneratedPowerMW} MW</span>
                </div>
                <input
                  id="grid-power-slider"
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={gridGeneratedPowerMW}
                  onChange={(e) => setGridGeneratedPowerMW(parseInt(e.target.value))}
                  aria-label="Power station generated power"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-[10px] text-slate-500 block font-mono">
                  {gridGeneratedPowerMW * 1000} kW generated at 11 kV
                </span>
              </div>

              {/* Control 3: Transmission Line Resistance */}
              <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs">
                  <label htmlFor="line-resistance-slider" className="text-slate-300 font-semibold">Cable Resistance (R_line):</label>
                  <span className="font-mono font-bold text-amber-300">{gridLineResistanceOhms} Ω</span>
                </div>
                <input
                  id="line-resistance-slider"
                  type="range"
                  min="2"
                  max="25"
                  step="1"
                  value={gridLineResistanceOhms}
                  onChange={(e) => setGridLineResistanceOhms(parseInt(e.target.value))}
                  aria-label="Transmission line loop resistance"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <span className="text-[10px] text-slate-500 block font-mono">
                  Over ~100 km Aluminum Conductor Steel Reinforced
                </span>
              </div>
            </div>

            {/* Full End-to-End Grid Visual Architecture Canvas */}
            <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 p-3 sm:p-4 overflow-hidden">
              <svg viewBox="0 0 840 260" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
                {/* 1. POWER PLANT (Olkaria Geothermal / Hydro) */}
                <g transform="translate(70, 130)">
                  <rect x="-55" y="-70" width="110" height="140" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  <text x="0" y="-45" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="800">
                    POWER PLANT
                  </text>
                  <text x="0" y="-28" textAnchor="middle" fill="#94a3b8" fontSize="9">
                    Olkaria Geothermal
                  </text>
                  <circle cx="0" cy="5" r="22" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  <path d="M -10,5 Q -5,-7 0,5 Q 5,17 10,5" fill="none" stroke="#38bdf8" strokeWidth="2" />
                  <text x="0" y="44" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="800" fontFamily="monospace">
                    {gridGeneratedPowerMW} MW
                  </text>
                  <text x="0" y="58" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                    11 kV Gen
                  </text>
                </g>

                {/* Connection to Step-Up */}
                <line x1="125" y1="130" x2="185" y2="130" stroke="#38bdf8" strokeWidth="3" />

                {/* 2. STEP-UP SUBSTATION */}
                <g transform="translate(235, 130)">
                  <rect x="-50" y="-70" width="100" height="140" rx="10" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
                  <text x="0" y="-45" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="800">
                    STEP-UP
                  </text>
                  <text x="0" y="-28" textAnchor="middle" fill="#94a3b8" fontSize="9">
                    Substation
                  </text>
                  {/* Transformer Coils Symbol */}
                  <circle cx="-14" cy="5" r="16" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                  <circle cx="14" cy="5" r="16" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                  <text x="0" y="44" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="800" fontFamily="monospace">
                    {gridTransmissionVoltageKV} kV
                  </text>
                  <text x="0" y="58" textAnchor="middle" fill="#94a3b8" fontSize="9">
                    11 kV → {gridTransmissionVoltageKV} kV
                  </text>
                </g>

                {/* 3. TRANSMISSION LINES (PYLONS & OVERHEAD CONDUCTORS) */}
                <g id="transmissionLines">
                  {/* Conductor Cables */}
                  <path
                    d="M 285,100 Q 420,115 555,100"
                    fill="none"
                    stroke={gridCalculations.isCriticalOverload ? '#ef4444' : '#22c55e'}
                    strokeWidth={gridCalculations.isCriticalOverload ? '5' : '3'}
                  />
                  <path
                    d="M 285,160 Q 420,175 555,160"
                    fill="none"
                    stroke={gridCalculations.isCriticalOverload ? '#ef4444' : '#22c55e'}
                    strokeWidth={gridCalculations.isCriticalOverload ? '5' : '3'}
                  />

                  {/* Pylon Tower 1 */}
                  <g transform="translate(360, 130)">
                    <line x1="0" y1="50" x2="-20" y2="-50" stroke="#64748b" strokeWidth="2" />
                    <line x1="0" y1="50" x2="20" y2="-50" stroke="#64748b" strokeWidth="2" />
                    <line x1="-25" y1="-30" x2="25" y2="-30" stroke="#64748b" strokeWidth="2" />
                    <line x1="-15" y1="10" x2="15" y2="10" stroke="#64748b" strokeWidth="2" />
                  </g>

                  {/* Pylon Tower 2 */}
                  <g transform="translate(480, 130)">
                    <line x1="0" y1="50" x2="-20" y2="-50" stroke="#64748b" strokeWidth="2" />
                    <line x1="0" y1="50" x2="20" y2="-50" stroke="#64748b" strokeWidth="2" />
                    <line x1="-25" y1="-30" x2="25" y2="-30" stroke="#64748b" strokeWidth="2" />
                    <line x1="-15" y1="10" x2="15" y2="10" stroke="#64748b" strokeWidth="2" />
                  </g>

                  {/* Line Metrics Callout Tag */}
                  <g transform="translate(420, 130)">
                    <rect
                      x="-85"
                      y="-22"
                      width="170"
                      height="44"
                      rx="8"
                      fill="#0f172a"
                      stroke={gridCalculations.isCriticalOverload ? '#ef4444' : '#334155'}
                      strokeWidth="1.5"
                    />
                    <text x="0" y="-6" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="700">
                      Line Current: <tspan fill="#f59e0b">{gridCalculations.transmissionCurrentAmps.toFixed(1)} A</tspan>
                    </text>
                    <text
                      x="0"
                      y="12"
                      textAnchor="middle"
                      fill={gridCalculations.isCriticalOverload ? '#ef4444' : '#22c55e'}
                      fontSize="10"
                      fontWeight="800"
                    >
                      Ploss = {gridCalculations.lineLossMW.toFixed(2)} MW
                    </text>
                  </g>
                </g>

                {/* 4. STEP-DOWN SUBSTATION */}
                <g transform="translate(605, 130)">
                  <rect x="-50" y="-70" width="100" height="140" rx="10" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
                  <text x="0" y="-45" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="800">
                    STEP-DOWN
                  </text>
                  <text x="0" y="-28" textAnchor="middle" fill="#94a3b8" fontSize="9">
                    City Substation
                  </text>
                  <circle cx="-14" cy="5" r="16" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                  <circle cx="14" cy="5" r="16" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                  <text x="0" y="44" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="800" fontFamily="monospace">
                    240 V / 415 V
                  </text>
                  <text x="0" y="58" textAnchor="middle" fill="#94a3b8" fontSize="9">
                    {gridTransmissionVoltageKV} kV → 240 V
                  </text>
                </g>

                {/* Connection to City */}
                <line x1="655" y1="130" x2="715" y2="130" stroke="#38bdf8" strokeWidth="3" />

                {/* 5. CONSUMER CITY (Nairobi / Mombasa) */}
                <g transform="translate(770, 130)">
                  <rect x="-55" y="-70" width="110" height="140" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  <text x="0" y="-45" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="800">
                    NAIROBI CITY
                  </text>
                  <text x="0" y="-28" textAnchor="middle" fill="#94a3b8" fontSize="9">
                    Domestic & Industrial
                  </text>
                  {/* City silhouette buildings */}
                  <rect x="-35" y="-10" width="16" height="36" fill="#334155" />
                  <rect x="-15" y="-22" width="20" height="48" fill="#475569" />
                  <rect x="9" y="-6" width="18" height="32" fill="#334155" />
                  <text x="0" y="44" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="800" fontFamily="monospace">
                    {gridCalculations.powerDeliveredMW.toFixed(1)} MW
                  </text>
                  <text x="0" y="58" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                    η = {gridCalculations.gridEfficiency.toFixed(1)}%
                  </text>
                </g>
              </svg>
            </div>

            {/* Comparative Breakdown Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">
                  1. Current Reduction by Step-Up:
                </span>
                <p className="text-slate-300">
                  Because P = V × I, stepping voltage up to <strong className="text-emerald-300">{gridTransmissionVoltageKV} kV</strong> reduces line current down to <strong className="text-amber-300">{gridCalculations.transmissionCurrentAmps.toFixed(1)} A</strong>.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">
                  2. Quadratic Line Loss Slashing (I²R):
                </span>
                <p className="text-slate-300">
                  Heating loss scales as I². At {gridTransmissionVoltageKV} kV, power lost is only <strong className="text-emerald-300">{gridCalculations.lineLossMW.toFixed(2)} MW</strong> ({((gridCalculations.lineLossMW / gridGeneratedPowerMW) * 100).toFixed(1)}% of total).
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">
                  3. If Transmitted at 11 kV Direct:
                </span>
                <p className="text-slate-300">
                  Current would be <strong className="text-rose-400">{((gridGeneratedPowerMW * 1e6) / 11000).toFixed(0)} A</strong>, causing line loss of <strong className="text-rose-400">{gridCalculations.loss11kVMW.toFixed(1)} MW</strong> (Wires would melt instantaneously!).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: KCSE PRACTICE CHALLENGE & EXAM PROBLEMS */}
      {/* ==================================================================== */}
      {activeTab === 'kcse' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-5">
            {/* Header / Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  KCSE Exam Practice: Electromagnetic Induction & Transformers
                </h3>
              </div>

              {/* Problem Selectors */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {KCSE_PROBLEMS.map((prob, idx) => (
                  <button
                    key={prob.id}
                    onClick={() => {
                      setCurrentProblemIdx(idx);
                      setUserAnswer('');
                      setAnswerStatus(null);
                      setShowSolution(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                      currentProblemIdx === idx
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Q{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                  {currentProblem.year}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {currentProblem.title}
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed font-serif">
                {currentProblem.scenario}
              </p>

              {/* Input Form */}
              <form onSubmit={handleCheckAnswer} className="space-y-3 pt-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <label htmlFor="user-kcse-answer" className="text-xs text-slate-400 font-semibold">Your Calculated Answer:</label>
                  <div className="relative">
                    <input
                      id="user-kcse-answer"
                      type="number"
                      step="any"
                      placeholder="e.g. 12"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white font-mono px-3 py-1.5 rounded-xl text-sm w-36 outline-none"
                    />
                    <span className="absolute right-3 top-2 text-xs font-mono text-slate-400">
                      {currentProblem.unit}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-custom-blue hover:bg-blue-600 text-white shadow-md transition-all active:scale-95"
                  >
                    Check Answer
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSolution(!showSolution)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all"
                  >
                    {showSolution ? 'Hide Working' : 'Show Solution'}
                  </button>

                  <button
                    type="button"
                    onClick={handleNextProblem}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 transition-all ml-auto"
                  >
                    Next Question <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Status Feedback Banners */}
              {answerStatus === 'correct' && (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    Excellent! Correct answer ({currentProblem.targetValue} {currentProblem.unit}). You have accurately applied transformer induction laws.
                  </span>
                </div>
              )}

              {answerStatus === 'incorrect' && (
                <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold">
                  <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>
                    Incorrect calculation. Hint: {currentProblem.hint}
                  </span>
                </div>
              )}

              {/* Step-by-Step Worked Solution */}
              {showSolution && (
                <div className="mt-4 p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2.5">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Examiner Worked Solution & Working:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 font-mono">
                    {currentProblem.solutionSteps.map((step, sIdx) => (
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

      {/* 4. PEDAGOGICAL SUMMARY ACCORDION */}
      <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80 text-xs space-y-2">
        <div className="flex items-center gap-2 text-slate-300 font-bold">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Form 4 Physics Core Examination Takeaways:</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-400 text-[11px] list-disc list-inside">
          <li>
            <strong>Ideal Transformer Equation:</strong> Vs / Vp = Ns / Np = Ip / Is. In a step-up transformer (Vs &gt; Vp), current is stepped down (Is &lt; Ip).
          </li>
          <li>
            <strong>Core Laminations:</strong> Eddy currents are suppressed by thin, insulated soft-iron sheets because power loss is proportional to thickness squared (P_eddy ∝ t²).
          </li>
          <li>
            <strong>High-Voltage Transmission:</strong> Grid power loss is given by Ploss = I²R = (P²R) / V². Stepping up voltage by 10× slashes line loss by 100×.
          </li>
          <li>
            <strong>Failure on D.C.:</strong> Steady direct current produces a static magnetic field (dΦ/dt = 0). Hence, no secondary e.m.f. is induced, and the primary winding overheats.
          </li>
        </ul>
      </div>
    </div>
  );
}
