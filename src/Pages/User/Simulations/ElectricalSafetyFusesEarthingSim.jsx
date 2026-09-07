import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sliders,
  Award,
  ChevronRight,
  Volume2,
  VolumeX,
  Power,
  Info,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  Activity,
  HelpCircle,
  Sparkles,
  Layers,
  HeartCrack,
  RefreshCw
} from 'lucide-react';

/**
 * Web Audio Synthesizer for Mains Electricity, Fuse Blow, MCB Trip, and Shock Warning
 */
class SafetyAudioSynth {
  constructor() {
    this.ctx = null;
    this.humOsc = null;
    this.humGain = null;
    this.isPlayingHum = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  startHum() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlayingHum) return;
    try {
      this.humOsc = this.ctx.createOscillator();
      this.humGain = this.ctx.createGain();
      this.humOsc.type = 'sine';
      this.humOsc.frequency.setValueAtTime(50, this.ctx.currentTime); // 50 Hz AC mains hum
      this.humGain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      this.humOsc.connect(this.humGain);
      this.humGain.connect(this.ctx.destination);
      this.humOsc.start();
      this.isPlayingHum = true;
    } catch {
      // Browser autoplay policy guard
    }
  }

  stopHum() {
    if (!this.isPlayingHum) return;
    try {
      if (this.humOsc) {
        this.humOsc.stop();
        this.humOsc.disconnect();
      }
      if (this.humGain) {
        this.humGain.disconnect();
      }
    } catch {
      // Ignore audio stop error
    }
    this.isPlayingHum = false;
  }

  playFuseBlow() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    try {
      // Crackle white-noise burst
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.22);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {
      // Ignore sound error
    }
  }

  playMcbTrip() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    try {
      // Sharp mechanical toggle snap / thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.32, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // Ignore sound error
    }
  }

  playShockZap() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Ignore sound error
    }
  }

  stopAll() {
    this.stopHum();
  }
}

export default function ElectricalSafetyFusesEarthingSim({ config = {}, onTelemetry }) {
  // ==========================================
  // ACTIVE NAVIGATION TABS
  // ==========================================
  // 'bench': Earthing & Fault Protection Lab (Primary interactive canvas)
  // 'sizing': Appliance Sizing & Fuse Rating Rule (I = P / V)
  // 'live_vs_neutral': Why Fuse & Switch Must Be in LIVE Wire (KCSE Misconception)
  // 'comparison': Fuse vs MCB vs RCD Technology Deep Dive
  // 'kcse': KCSE Past Paper Exam Mastery & Quiz
  const [activeTab, setActiveTab] = useState('bench');

  // Audio mute toggle
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const audioSynthRef = useRef(null);

  useEffect(() => {
    audioSynthRef.current = new SafetyAudioSynth();
    return () => {
      if (audioSynthRef.current) {
        audioSynthRef.current.stopAll();
      }
    };
  }, []);

  // Animation frame clock for current particle movement
  const [animClock, setAnimClock] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    let lastTime = performance.now();
    const tick = (now) => {
      const dt = (now - lastTime) / 1000;
      setAnimClock((prev) => prev + dt);
      lastTime = now;
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // ==========================================
  // TAB 1: EARTHING & FAULT LAB STATE
  // ==========================================
  const [isMainsPowerOn, setIsMainsPowerOn] = useState(true);
  const [applianceType, setApplianceType] = useState('kettle'); // 'kettle' | 'iron' | 'cooker' | 'microwave'
  const [isFaultActive, setIsFaultActive] = useState(false); // Frayed live touches metal chassis
  const [isEarthConnected, setIsEarthConnected] = useState(true); // Earth wire intact vs cut
  const [protectionDevice, setProtectionDevice] = useState('fuse_13'); // 'fuse_3' | 'fuse_5' | 'fuse_13' | 'fuse_30' | 'mcb_13' | 'rcd_30ma'
  const [isDeviceTripped, setIsDeviceTripped] = useState(false); // Blown fuse or tripped MCB/RCD
  const [isHumanTouching, setIsHumanTouching] = useState(false); // User touches metal casing
  const [bodyResistance, setBodyResistance] = useState(1000); // Ohms (dry: 1000-2000, wet: 500)
  const [earthWireResistance, setEarthWireResistance] = useState(0.5); // Ohms (standard: 0.5 ohm)

  // Appliance specs
  const APPLIANCES = {
    kettle: { name: 'Electric Kettle', power: 2400, icon: '☕', description: 'Heating element (2.4 kW) in metal body' },
    iron: { name: 'Electric Flat Iron', power: 1200, icon: '👔', description: 'Heating soleplate (1.2 kW) in metal chassis' },
    cooker: { name: 'Electric Cooker', power: 3600, icon: '🍳', description: 'High-power cooker ring (3.6 kW)' },
    microwave: { name: 'Microwave Oven', power: 1200, icon: '📻', description: 'Magnetron & high-voltage transformer in metal frame' }
  };

  const mainsVoltage = 240; // 240 V AC standard in Kenya / UK

  // Derive normal operating current: I = P / V
  const currentAppliance = APPLIANCES[applianceType];
  const normalOperatingCurrent = currentAppliance.power / mainsVoltage; // e.g. 2400 / 240 = 10 A

  // Determine device rating threshold
  const deviceThreshold = useMemo(() => {
    switch (protectionDevice) {
      case 'fuse_3': return 3.0;
      case 'fuse_5': return 5.0;
      case 'fuse_13': return 13.0;
      case 'fuse_30': return 30.0;
      case 'mcb_13': return 13.0;
      case 'rcd_30ma': return 0.03; // 30 mA leakage trigger
      default: return 13.0;
    }
  }, [protectionDevice]);

  // Electrical calculations for Tab 1
  const labCalculations = useMemo(() => {
    if (!isMainsPowerOn || isDeviceTripped) {
      return {
        iLive: 0,
        iNeutral: 0,
        iEarth: 0,
        iHuman: 0,
        casingVoltage: 0,
        elementPower: 0,
        humanDangerLevel: 'safe',
        statusText: isDeviceTripped ? 'CIRCUIT TRIPPED / FUSE MELTED' : 'MAINS IS SWITCHED OFF',
        actionAdvice: isDeviceTripped ? 'Fault detected! Replace fuse or reset circuit breaker to restore.' : 'Turn on mains supply to energize.'
      };
    }

    // NORMAL OPERATION (No fault)
    if (!isFaultActive) {
      // Check if fuse is undersized for normal appliance current!
      if (protectionDevice.startsWith('fuse_') && normalOperatingCurrent > deviceThreshold) {
        return {
          iLive: normalOperatingCurrent,
          iNeutral: normalOperatingCurrent,
          iEarth: 0,
          iHuman: 0,
          casingVoltage: 0,
          elementPower: currentAppliance.power,
          humanDangerLevel: 'safe',
          statusText: 'NUISANCE FUSE MELT HAZARD',
          actionAdvice: `Appliance draws ${normalOperatingCurrent.toFixed(1)} A, exceeding ${deviceThreshold} A fuse capacity!`,
          willNuisanceBlow: true
        };
      }

      return {
        iLive: normalOperatingCurrent,
        iNeutral: normalOperatingCurrent,
        iEarth: 0,
        iHuman: 0,
        casingVoltage: 0,
        elementPower: currentAppliance.power,
        humanDangerLevel: 'safe',
        statusText: 'NORMAL & SAFE OPERATION',
        actionAdvice: `Normal current of ${normalOperatingCurrent.toFixed(1)} A circulating safely through heating element. Metal casing is at 0 V.`,
        willNuisanceBlow: false
      };
    }

    // FAULT ACTIVE: Live wire touches metal casing
    // Case A: Earth wire connected
    if (isEarthConnected) {
      // Earth wire provides low-resistance bypass path to ground (0.5 ohm)
      const faultSurgeCurrent = mainsVoltage / earthWireResistance; // 240 / 0.5 = 480 A
      const casingVoltageBeforeTrip = faultSurgeCurrent * earthWireResistance * 0.05; // tiny drop across ground loop (~12 V)
      const humanLeakageCurrent = isHumanTouching ? (casingVoltageBeforeTrip / bodyResistance) * 1000 : 0; // in mA (< 12 mA)

      return {
        iLive: faultSurgeCurrent,
        iNeutral: 0,
        iEarth: faultSurgeCurrent,
        iHuman: humanLeakageCurrent,
        casingVoltage: casingVoltageBeforeTrip,
        elementPower: 0,
        humanDangerLevel: 'protected',
        statusText: 'MASSIVE EARTH SURGE CURRENT DETECTED!',
        actionAdvice: `Surge current of ${faultSurgeCurrent.toFixed(0)} A rushes to earth! Low resistance (0.5 Ω) forces fuse to blow instantly (< 0.02 s), saving user!`,
        willTripSurge: true
      };
    }

    // Case B: Earth wire DISCONNECTED / CUT
    // Live wire touches casing, but no earth wire exists!
    if (!isHumanTouching) {
      // Casing is energized at 240 V, but no complete circuit to earth yet
      return {
        iLive: 0.0,
        iNeutral: 0.0,
        iEarth: 0.0,
        iHuman: 0.0,
        casingVoltage: 240.0,
        elementPower: 0,
        humanDangerLevel: 'extreme_hazard',
        statusText: 'CASING ENERGIZED TO 240 V (NO EARTH WIRE)!',
        actionAdvice: 'Metal casing is floating at fatal mains potential (240 V)! Any human contact will cause lethal electrocution!',
        willTripSurge: false
      };
    } else {
      // Human touches casing! Complete circuit through human body to ground!
      const humanCurrentA = mainsVoltage / bodyResistance; // 240 / 1000 = 0.24 A
      const humanCurrentMA = humanCurrentA * 1000; // 240 mA
      const casingVoltage = 240.0;

      // Will RCD detect this leakage? (RCD detects 30 mA leakage to ground)
      const isRcdTripped = protectionDevice === 'rcd_30ma' && humanCurrentMA >= 30;

      let dangerLevel = 'fatal';
      if (humanCurrentMA < 1) dangerLevel = 'imperceptible';
      else if (humanCurrentMA < 10) dangerLevel = 'tingle';
      else if (humanCurrentMA < 30) dangerLevel = 'muscle_spasm';
      else dangerLevel = 'fatal_fibrillation';

      return {
        iLive: humanCurrentA,
        iNeutral: 0.0,
        iEarth: 0.0,
        iHuman: humanCurrentMA,
        casingVoltage: casingVoltage,
        elementPower: 0,
        humanDangerLevel: dangerLevel,
        statusText: isRcdTripped ? 'RCD TRIPPED BY EARTH LEAKAGE!' : 'CRITICAL FATAL ELECTROCUTION IN PROGRESS!',
        actionAdvice: isRcdTripped
          ? 'RCD sensed 240 mA difference between Live and Neutral and cut power within 25 ms!'
          : `Current of ${humanCurrentMA.toFixed(0)} mA is flowing through the student heart to ground! The 13 A fuse DOES NOT blow because 0.24 A << 13 A!`,
        willRcdTrip: isRcdTripped,
        willTripSurge: false
      };
    }
  }, [
    isMainsPowerOn,
    isDeviceTripped,
    isFaultActive,
    isEarthConnected,
    isHumanTouching,
    normalOperatingCurrent,
    deviceThreshold,
    protectionDevice,
    earthWireResistance,
    bodyResistance,
    currentAppliance.power
  ]);

  // Handle automatic blowing/tripping with sound and telemetry
  useEffect(() => {
    if (!isMainsPowerOn || isDeviceTripped) return;

    // Surge trip with Earth Wire
    if (labCalculations.willTripSurge) {
      const timer = setTimeout(() => {
        setIsDeviceTripped(true);
        if (!isAudioMuted && audioSynthRef.current) {
          if (protectionDevice.startsWith('mcb')) {
            audioSynthRef.current.playMcbTrip();
          } else {
            audioSynthRef.current.playFuseBlow();
          }
        }
        if (onTelemetry) {
          onTelemetry('protective_device_tripped', {
            device: protectionDevice,
            reason: 'earth_fault_surge',
            faultCurrent: labCalculations.iLive
          });
        }
      }, 350);
      return () => clearTimeout(timer);
    }

    // Nuisance blow when fuse < normal current
    if (labCalculations.willNuisanceBlow) {
      const timer = setTimeout(() => {
        setIsDeviceTripped(true);
        if (!isAudioMuted && audioSynthRef.current) {
          audioSynthRef.current.playFuseBlow();
        }
        if (onTelemetry) {
          onTelemetry('protective_device_nuisance_trip', {
            device: protectionDevice,
            normalCurrent: normalOperatingCurrent
          });
        }
      }, 400);
      return () => clearTimeout(timer);
    }

    // RCD trip on human touch leakage
    if (labCalculations.willRcdTrip) {
      const timer = setTimeout(() => {
        setIsDeviceTripped(true);
        if (!isAudioMuted && audioSynthRef.current) {
          audioSynthRef.current.playMcbTrip();
        }
      }, 150);
      return () => clearTimeout(timer);
    }

    // Human shock audio feedback
    if (labCalculations.humanDangerLevel === 'fatal_fibrillation' && isHumanTouching && !isEarthConnected) {
      if (!isAudioMuted && audioSynthRef.current) {
        audioSynthRef.current.playShockZap();
      }
    }
  }, [
    labCalculations.willTripSurge,
    labCalculations.willNuisanceBlow,
    labCalculations.willRcdTrip,
    labCalculations.humanDangerLevel,
    isMainsPowerOn,
    isDeviceTripped,
    isAudioMuted,
    isHumanTouching,
    isEarthConnected,
    protectionDevice,
    normalOperatingCurrent,
    labCalculations.iLive,
    onTelemetry
  ]);

  // Mains hum sound management
  useEffect(() => {
    if (!isAudioMuted && isMainsPowerOn && !isDeviceTripped && audioSynthRef.current) {
      audioSynthRef.current.startHum();
    } else if (audioSynthRef.current) {
      audioSynthRef.current.stopHum();
    }
  }, [isMainsPowerOn, isDeviceTripped, isAudioMuted]);

  // Reset Tab 1
  const handleResetLab = () => {
    setIsMainsPowerOn(true);
    setIsFaultActive(false);
    setIsEarthConnected(true);
    setProtectionDevice('fuse_13');
    setIsDeviceTripped(false);
    setIsHumanTouching(false);
    setBodyResistance(1000);
    setEarthWireResistance(0.5);
    setApplianceType('kettle');
    if (onTelemetry) {
      onTelemetry('reset_simulation', { tab: activeTab });
    }
  };

  // ==========================================
  // TAB 2: FUSE SIZING & APPLIANCE BENCH STATE
  // ==========================================
  const [sizingPowerW, setSizingPowerW] = useState(2400); // 100 W to 7200 W
  const [sizingFuseRating, setSizingFuseRating] = useState(13); // 3, 5, 13, 30
  const [sizingTestMode, setSizingTestMode] = useState('normal'); // 'normal' | 'overload_150' | 'short_circuit'
  const [sizingTripped, setSizingTripped] = useState(false);
  const [sizingCableTemp, setSizingCableTemp] = useState(25); // Celsius

  const sizingNormalCurrent = sizingPowerW / 240;
  const sizingActualCurrent = useMemo(() => {
    if (sizingTestMode === 'normal') return sizingNormalCurrent;
    if (sizingTestMode === 'overload_150') return sizingNormalCurrent * 1.5;
    if (sizingTestMode === 'short_circuit') return 480; // 480 A short circuit
    return sizingNormalCurrent;
  }, [sizingTestMode, sizingNormalCurrent]);

  // Sizing evaluation
  const sizingEvaluation = useMemo(() => {
    const isUndersized = sizingFuseRating < sizingNormalCurrent;
    const isOversized = sizingFuseRating > sizingNormalCurrent * 2.2;

    let verdict = 'proper';
    let message = 'Appropriate fuse rating. Appliance operates safely and fuse will blow quickly during short circuit.';
    if (isUndersized) {
      verdict = 'undersized';
      message = `Undersized! Normal working current (${sizingNormalCurrent.toFixed(1)} A) exceeds ${sizingFuseRating} A fuse rating. Nuisance tripping will occur on startup!`;
    } else if (isOversized) {
      verdict = 'oversized';
      message = `DANGEROUSLY OVERSIZED! A ${sizingFuseRating} A fuse will not protect the appliance cord (${sizingNormalCurrent.toFixed(1)} A rated) during an overload. The cable will overheat, melt, and ignite!`;
    }

    return { verdict, message, isUndersized, isOversized };
  }, [sizingFuseRating, sizingNormalCurrent]);

  // Sizing action test
  useEffect(() => {
    if (sizingTripped) return;
    if (sizingActualCurrent > sizingFuseRating) {
      const overFactor = sizingActualCurrent / sizingFuseRating;
      const delay = Math.max(80, Math.min(1200, 1500 / Math.pow(overFactor, 2)));
      const timer = setTimeout(() => {
        setSizingTripped(true);
        if (!isAudioMuted && audioSynthRef.current) {
          audioSynthRef.current.playFuseBlow();
        }
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [sizingActualCurrent, sizingFuseRating, sizingTripped, isAudioMuted]);

  // Cable temp effect on overload without trip
  useEffect(() => {
    if (sizingTestMode === 'overload_150' && !sizingTripped && sizingActualCurrent <= sizingFuseRating) {
      const interval = setInterval(() => {
        setSizingCableTemp((t) => Math.min(185, t + 4));
      }, 200);
      return () => clearInterval(interval);
    } else {
      setSizingCableTemp(25);
    }
  }, [sizingTestMode, sizingTripped, sizingActualCurrent, sizingFuseRating]);

  // ==========================================
  // TAB 3: LIVE VS NEUTRAL FUSE POSITION STATE
  // ==========================================
  const [fusePosition, setFusePosition] = useState('live'); // 'live' (correct) | 'neutral' (fatal hazard)
  const [isSwitchedOff, setIsSwitchedOff] = useState(false);
  const [hasPositionFault, setHasPositionFault] = useState(false);
  const [probeLocation, setProbeLocation] = useState('casing');

  const probeVoltage = useMemo(() => {
    if (fusePosition === 'live') {
      if (isSwitchedOff || hasPositionFault) {
        if (probeLocation === 'supply') return 240;
        return 0;
      }
      if (probeLocation === 'casing') return 0;
      return 240;
    } else {
      if (probeLocation === 'supply') return 240;
      if (probeLocation === 'casing') {
        return hasPositionFault ? 240 : 0;
      }
      return 240;
    }
  }, [fusePosition, isSwitchedOff, hasPositionFault, probeLocation]);

  // ==========================================
  // TAB 5: KCSE EXAM PRACTICE QUESTIONS
  // ==========================================
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const KCSE_PROBLEMS = [
    {
      id: 'kcse_safety_1',
      year: 'KCSE Physics Paper 2',
      title: 'Appliance Operating Current & Fuse Rating Selection',
      scenario:
        'An electric iron with a metal casing is rated 1200 W, 240 V. Calculate the normal operating current of the iron (in Amperes).',
      targetValue: 5.0,
      unit: 'A',
      tolerance: 0.1,
      hint: 'Recall the electrical power formula relating power, voltage, and current: P = V × I, therefore I = P / V.',
      solutionSteps: [
        'Identify given variables: Power P = 1200 W, Voltage V = 240 V.',
        'Apply the formula: I = P / V',
        'Substitute values: I = 1200 W / 240 V = 5.0 A.',
        'Fuse selection rule: A fuse rating must be slightly higher than normal working current.',
        'Conclusion: A standard 13 A cartridge fuse (or 5 A if non-inductive) is suitable for this appliance.'
      ]
    },
    {
      id: 'kcse_safety_2',
      year: 'KCSE Physics Paper 2',
      title: 'Earth Fault Surge Current Calculation',
      scenario:
        'An electric cooker is connected to a 240 V mains supply. The earth wire connected to its metal casing has an electrical resistance of 0.4 Ω. A frayed live wire accidentally touches the metal casing. Calculate the initial surge fault current (in Amperes) flowing to earth before the fuse blows.',
      targetValue: 600.0,
      unit: 'A',
      tolerance: 5.0,
      hint: 'Apply Ohm’s Law: I_fault = V / R_earth. Neglect internal source impedance.',
      solutionSteps: [
        'Identify given variables: Mains potential V = 240 V, Earth path resistance R_earth = 0.4 Ω.',
        'Apply Ohm’s law: I_fault = V / R',
        'Substitute values: I_fault = 240 V / 0.4 Ω = 600.0 A.',
        'Physical Mechanism: This massive 600 A surge current produces intense Joulean heating (P = I²R) in the 13 A fuse wire.',
        'The fuse wire melts in less than 0.02 seconds, cutting off the high voltage supply and protecting the user from electrocution.'
      ]
    },
    {
      id: 'kcse_safety_3',
      year: 'KCSE Physics Paper 2',
      title: 'Shock Current Without Earth Wire',
      scenario:
        'A person with a dry body resistance of 1500 Ω touches the ungrounded metal casing of a faulty electric cooker that is energized to 240 V. Calculate the electric shock current flowing through the person body in milliamperes (mA).',
      targetValue: 160.0,
      unit: 'mA',
      tolerance: 2.0,
      hint: 'Calculate I in Amperes using I = V / R, then multiply by 1000 to convert to mA.',
      solutionSteps: [
        'Identify given variables: Voltage V = 240 V, Body resistance R_body = 1500 Ω.',
        'Apply Ohm’s law: I = V / R_body = 240 V / 1500 Ω = 0.16 A.',
        'Convert to milliamperes: 0.16 A × 1000 = 160.0 mA.',
        'Physiological consequence: Currents above 50 mA cause ventricular fibrillation and respiratory paralysis.',
        'Why fuse does not blow: 0.16 A is far below the 13 A rating of the fuse. The fuse remains intact while the person suffers fatal electrocution!'
      ]
    },
    {
      id: 'kcse_safety_4',
      year: 'KCSE Physics Paper 2',
      title: 'Immersion Heater Fuse Selection',
      scenario:
        'A domestic immersion water heater is rated 3.0 kW, 240 V. Calculate the minimum standard fuse rating (in Amperes) required from the standard domestic ratings: 3 A, 5 A, 13 A, or 30 A.',
      targetValue: 13.0,
      unit: 'A',
      tolerance: 0.2,
      hint: 'First find normal current I = 3000 / 240. Choose the next available standard rating greater than this current.',
      solutionSteps: [
        'Convert power to Watts: 3.0 kW = 3000 W.',
        'Calculate operating current: I = P / V = 3000 W / 240 V = 12.5 A.',
        'Evaluate available ratings: 3 A (Blows instantly), 5 A (Blows instantly), 13 A (Safe: 13 A > 12.5 A), 30 A (Dangerously oversized).',
        'Conclusion: The 13 A fuse is the correct choice because 13 A is just above the 12.5 A normal load.'
      ]
    }
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
          answer: val
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

  // Color helper for danger badge
  const getDangerBadge = (level) => {
    switch (level) {
      case 'safe':
        return { text: 'SAFE (0 V)', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', icon: ShieldCheck };
      case 'protected':
        return { text: 'EARTH TRIPPED SAFE', bg: 'bg-teal-500/20 text-teal-300 border-teal-500/40', icon: ShieldCheck };
      case 'tingle':
        return { text: 'MILD SHOCK (Tingle)', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: AlertTriangle };
      case 'muscle_spasm':
        return { text: 'CANNOT LET GO (>10 mA)', bg: 'bg-orange-500/20 text-orange-400 border-orange-500/40', icon: AlertTriangle };
      case 'fatal_fibrillation':
      case 'fatal':
      case 'extreme_hazard':
        return { text: 'FATAL SHOCK HAZARD (240 V)', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse', icon: HeartCrack };
      default:
        return { text: 'STANDBY', bg: 'bg-slate-700/40 text-slate-300 border-slate-600', icon: ShieldCheck };
    }
  };

  const dangerInfo = getDangerBadge(labCalculations.humanDangerLevel);
  const DangerIcon = dangerInfo.icon;

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-5 lg:p-6 bg-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-slate-800/80 font-sans">
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 shadow-inner">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  Form 4 Physics • Mains Electricity
                </span>
                <span className="text-xs font-medium text-slate-400">Lesson 252</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-50 tracking-tight mt-0.5">
                Electrical Safety: Fuses, Circuit Breakers & Earthing
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Investigate how the Earth Wire + Fuse / MCB combination safeguards against fatal electrocution, explore fuse sizing rules (I = P/V), and discover why switches must sit in the Live wire.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2.5 self-end md:self-center">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-2.5 rounded-xl border transition-all ${
              isAudioMuted
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm'
            }`}
            title={isAudioMuted ? 'Unmute synthesized audio' : 'Mute audio'}
          >
            {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button
            onClick={handleResetLab}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* NAVIGATION TABS                            */}
      {/* ========================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-4 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800/80">
        <button
          onClick={() => setActiveTab('bench')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'bench'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Earthing Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('sizing')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'sizing'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Fuse Sizing (P/V)</span>
        </button>

        <button
          onClick={() => setActiveTab('live_vs_neutral')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'live_vs_neutral'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Live vs Neutral</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'comparison'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Fuse vs MCB vs RCD</span>
        </button>

        <button
          onClick={() => setActiveTab('kcse')}
          className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'kcse'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>KCSE Exam Prep</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EARTHING & FAULT PROTECTION LAB                                   */}
      {/* ========================================================================= */}
      {activeTab === 'bench' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Visualizer Stage (8 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Top Status Bar & Danger Alert */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3">
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider ${dangerInfo.bg}`}>
                  <DangerIcon className="w-4 h-4" />
                  {dangerInfo.text}
                </span>
                <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                  Casing Voltage: <strong className={labCalculations.casingVoltage > 50 ? 'text-rose-400 font-mono' : 'text-emerald-400 font-mono'}>{labCalculations.casingVoltage.toFixed(0)} V</strong>
                </span>
              </div>

              {/* Reset Tripped Device Button if blown/tripped */}
              {isDeviceTripped && (
                <button
                  onClick={() => setIsDeviceTripped(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all animate-bounce shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{protectionDevice.startsWith('mcb') ? 'Reset MCB Lever' : 'Fit New Replacement Fuse'}</span>
                </button>
              )}
            </div>

            {/* Interactive SVG Circuit Board */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-slate-950 rounded-3xl border border-slate-800/90 overflow-hidden shadow-2xl flex items-center justify-center p-2">
              <svg viewBox="0 0 920 540" className="w-full h-full select-none">
                <defs>
                  {/* Grid background pattern */}
                  <pattern id="labGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.75" />
                  </pattern>

                  {/* Hazard pulse gradient */}
                  <radialGradient id="hazardPulse" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </radialGradient>

                  {/* Appliance metallic body gradient */}
                  <linearGradient id="metalCasing" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="50%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>

                  {/* Heating element glow */}
                  <radialGradient id="elementGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </radialGradient>

                  {/* Fuse wire spark filter */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid */}
                <rect width="920" height="540" fill="url(#labGrid)" />

                {/* ======================================================== */}
                {/* 1. MAINS CONSUMER UNIT (SUPPLY AT LEFT)                 */}
                {/* ======================================================== */}
                <g id="consumerUnit" transform="translate(40, 60)">
                  {/* Consumer box */}
                  <rect x="0" y="0" width="160" height="420" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
                  <rect x="10" y="10" width="140" height="40" rx="8" fill="#1e293b" />
                  <text x="80" y="35" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">
                    240 V AC MAINS
                  </text>
                  <text x="80" y="68" textAnchor="middle" fill="#94a3b8" fontSize="10">
                    50 Hz Domestic Supply
                  </text>

                  {/* Mains Switch Toggle */}
                  <g
                    transform="translate(25, 90)"
                    className="cursor-pointer"
                    onClick={() => setIsMainsPowerOn(!isMainsPowerOn)}
                  >
                    <rect x="0" y="0" width="110" height="45" rx="8" fill={isMainsPowerOn ? '#065f46' : '#881337'} stroke={isMainsPowerOn ? '#10b981' : '#f43f5e'} strokeWidth="1.5" />
                    <Power x="16" y="12" className="w-5 h-5" color={isMainsPowerOn ? '#34d399' : '#fb7185'} />
                    <text x="70" y="28" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                      {isMainsPowerOn ? 'POWER ON' : 'POWER OFF'}
                    </text>
                  </g>

                  {/* Protective Device Slot: Fuse or MCB */}
                  <g transform="translate(15, 160)">
                    <rect x="0" y="0" width="130" height="120" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                    <text x="65" y="22" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                      {protectionDevice.startsWith('mcb') ? 'MCB SWITCH' : protectionDevice.startsWith('rcd') ? 'RCD BREAKER' : 'CARTRIDGE FUSE'}
                    </text>

                    {/* Cartridge fuse visual */}
                    {!protectionDevice.startsWith('mcb') && !protectionDevice.startsWith('rcd') && (
                      <g transform="translate(20, 35)">
                        <rect x="0" y="12" width="90" height="30" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
                        {/* Metal caps */}
                        <rect x="0" y="12" width="18" height="30" rx="3" fill="#cbd5e1" />
                        <rect x="72" y="12" width="18" height="30" rx="3" fill="#cbd5e1" />
                        {/* Fuse Wire inside */}
                        {!isDeviceTripped ? (
                          <line
                            x1="18"
                            y1="27"
                            x2="72"
                            y2="27"
                            stroke={labCalculations.iLive > deviceThreshold ? '#ef4444' : '#64748b'}
                            strokeWidth={protectionDevice === 'fuse_30' ? '3.5' : protectionDevice === 'fuse_13' ? '2.5' : '1.5'}
                            filter={labCalculations.iLive > deviceThreshold ? 'url(#glow)' : ''}
                          />
                        ) : (
                          // Blown melted wire
                          <g>
                            <line x1="18" y1="27" x2="38" y2="23" stroke="#ef4444" strokeWidth="2" />
                            <line x1="52" y1="31" x2="72" y2="27" stroke="#ef4444" strokeWidth="2" />
                            <circle cx="45" cy="27" r="5" fill="#f59e0b" filter="url(#glow)" />
                            <text x="45" y="58" textAnchor="middle" fill="#f43f5e" fontSize="10" fontWeight="bold">
                              MELTED!
                            </text>
                          </g>
                        )}
                        <text x="45" y="60" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="bold">
                          {!isDeviceTripped && `${deviceThreshold} A`}
                        </text>
                      </g>
                    )}

                    {/* MCB Lever visual */}
                    {protectionDevice.startsWith('mcb') && (
                      <g transform="translate(25, 35)">
                        <rect x="0" y="0" width="80" height="55" rx="6" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
                        {!isDeviceTripped ? (
                          <g>
                            <rect x="30" y="8" width="20" height="22" rx="3" fill="#10b981" />
                            <text x="40" y="23" textAnchor="middle" fill="#022c22" fontSize="9" fontWeight="black">UP</text>
                            <text x="40" y="46" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">CLOSED</text>
                          </g>
                        ) : (
                          <g>
                            <rect x="30" y="24" width="20" height="22" rx="3" fill="#f43f5e" />
                            <text x="40" y="39" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="black">TRIP</text>
                            <text x="40" y="16" textAnchor="middle" fill="#f43f5e" fontSize="9" fontWeight="bold">OPEN</text>
                          </g>
                        )}
                      </g>
                    )}

                    {/* RCD visual */}
                    {protectionDevice.startsWith('rcd') && (
                      <g transform="translate(20, 35)">
                        <rect x="0" y="0" width="90" height="55" rx="6" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
                        <text x="45" y="20" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">30 mA SENSE</text>
                        <rect x="32" y="28" width="26" height="18" rx="3" fill={isDeviceTripped ? '#f43f5e' : '#10b981'} />
                        <text x="45" y="41" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                          {isDeviceTripped ? 'TRIP' : 'OK'}
                        </text>
                      </g>
                    )}

                    {/* Status text */}
                    <text x="65" y="110" textAnchor="middle" fill={isDeviceTripped ? '#f87171' : '#4ade80'} fontSize="10" fontWeight="bold">
                      {isDeviceTripped ? 'CIRCUIT BROKEN' : 'SUPPLY INTACT'}
                    </text>
                  </g>

                  {/* Terminal posts */}
                  {/* Live (Brown) */}
                  <circle cx="140" cy="305" r="7" fill="#934a1b" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="120" y="310" textAnchor="end" fill="#d97706" fontSize="11" fontWeight="bold">L (240V)</text>

                  {/* Neutral (Blue) */}
                  <circle cx="140" cy="345" r="7" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="120" y="350" textAnchor="end" fill="#60a5fa" fontSize="11" fontWeight="bold">N (0V)</text>

                  {/* Earth (Green/Yellow) */}
                  <circle cx="140" cy="385" r="7" fill="#15803d" stroke="#facc15" strokeWidth="2" />
                  <text x="120" y="390" textAnchor="end" fill="#4ade80" fontSize="11" fontWeight="bold">E (0V)</text>

                  {/* Substation Earth rod at bottom of consumer unit */}
                  <g transform="translate(30, 395)">
                    <line x1="30" y1="0" x2="30" y2="16" stroke="#4ade80" strokeWidth="2.5" />
                    <line x1="16" y1="16" x2="44" y2="16" stroke="#4ade80" strokeWidth="2.5" />
                    <line x1="21" y1="20" x2="39" y2="20" stroke="#4ade80" strokeWidth="2" />
                    <line x1="26" y1="24" x2="34" y2="24" stroke="#4ade80" strokeWidth="1.5" />
                  </g>
                </g>

                {/* ======================================================== */}
                {/* 2. CONDUCTOR WIRES CONNECTING SUPPLY TO APPLIANCE         */}
                {/* ======================================================== */}
                {/* LIVE WIRE (Brown) */}
                <path
                  d="M 180 365 L 260 365 L 260 210 L 460 210"
                  fill="none"
                  stroke="#934a1b"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Current Badge on Live Wire */}
                <g transform="translate(300, 185)">
                  <rect x="0" y="0" width="90" height="24" rx="6" fill="#451a03" stroke="#b45309" strokeWidth="1" />
                  <text x="45" y="16" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="bold">
                    I_L: {labCalculations.iLive.toFixed(1)} A
                  </text>
                </g>

                {/* Animated Particles along Live Wire */}
                {labCalculations.iLive > 0 && (
                  <circle
                    cx={260}
                    cy={210 + (Math.sin(animClock * 8) * 40)}
                    r="4.5"
                    fill="#fef08a"
                    filter="url(#glow)"
                  />
                )}

                {/* NEUTRAL WIRE (Blue) */}
                <path
                  d="M 180 405 L 300 405 L 300 270 L 460 270"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Current Badge on Neutral Wire */}
                <g transform="translate(320, 280)">
                  <rect x="0" y="0" width="90" height="24" rx="6" fill="#172554" stroke="#1d4ed8" strokeWidth="1" />
                  <text x="45" y="16" textAnchor="middle" fill="#bfdbfe" fontSize="11" fontWeight="bold">
                    I_N: {labCalculations.iNeutral.toFixed(1)} A
                  </text>
                </g>

                {/* EARTH WIRE (Green/Yellow striped) */}
                {isEarthConnected ? (
                  <g>
                    <path
                      d="M 180 445 L 340 445 L 340 330 L 460 330"
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    {/* Yellow stripes */}
                    <path
                      d="M 180 445 L 340 445 L 340 330 L 460 330"
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="6"
                      strokeDasharray="14 14"
                      strokeLinecap="round"
                    />
                    {/* Current Badge on Earth Wire */}
                    <g transform="translate(320, 415)">
                      <rect x="0" y="0" width="95" height="24" rx="6" fill="#052e16" stroke="#16a34a" strokeWidth="1" />
                      <text x="47" y="16" textAnchor="middle" fill="#bbf7d0" fontSize="11" fontWeight="bold">
                        I_E: {labCalculations.iEarth.toFixed(1)} A
                      </text>
                    </g>
                  </g>
                ) : (
                  // BROKEN EARTH WIRE
                  <g>
                    <path d="M 180 445 L 260 445" fill="none" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
                    <path d="M 180 445 L 260 445" fill="none" stroke="#facc15" strokeWidth="6" strokeDasharray="14 14" strokeLinecap="round" />
                    {/* Cut gap */}
                    <line x1="258" y1="438" x2="265" y2="452" stroke="#f43f5e" strokeWidth="3" />
                    <line x1="275" y1="438" x2="282" y2="452" stroke="#f43f5e" strokeWidth="3" />
                    <text x="290" y="468" textAnchor="middle" fill="#f43f5e" fontSize="11" fontWeight="black">
                      CUT / BROKEN EARTH!
                    </text>
                    <path d="M 320 445 L 340 445 L 340 330 L 460 330" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                  </g>
                )}

                {/* ======================================================== */}
                {/* 3. APPLIANCE WITH METALLIC CASING (CENTER RIGHT)          */}
                {/* ======================================================== */}
                <g id="appliance" transform="translate(460, 80)">
                  {/* Hazardous casing voltage pulse if live touched without earth */}
                  {labCalculations.casingVoltage > 50 && (
                    <rect
                      x="-15"
                      y="-15"
                      width="270"
                      height="370"
                      rx="24"
                      fill="url(#hazardPulse)"
                      className="animate-pulse"
                    />
                  )}

                  {/* Metal Chassis */}
                  <rect
                    x="0"
                    y="0"
                    width="240"
                    height="340"
                    rx="18"
                    fill="url(#metalCasing)"
                    stroke={labCalculations.casingVoltage > 50 ? '#ef4444' : isEarthConnected ? '#10b981' : '#64748b'}
                    strokeWidth={labCalculations.casingVoltage > 50 ? '4' : '2.5'}
                  />

                  {/* Appliance Title Header */}
                  <rect x="15" y="15" width="210" height="35" rx="8" fill="#0f172a" />
                  <text x="120" y="38" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">
                    {currentAppliance.icon} {currentAppliance.name}
                  </text>

                  {/* Internal Heating Element Coil */}
                  <g transform="translate(45, 80)">
                    <rect x="0" y="0" width="150" height="150" rx="12" fill="#090d16" stroke="#334155" strokeWidth="1.5" />
                    <text x="75" y="24" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                      HEATING ELEMENT ({currentAppliance.power} W)
                    </text>

                    {/* Resistance Coil loops */}
                    <path
                      d="M 25 50 C 45 40, 45 80, 75 50 C 105 40, 105 80, 125 50 M 25 90 C 45 80, 45 120, 75 90 C 105 80, 105 120, 125 90"
                      fill="none"
                      stroke={labCalculations.elementPower > 0 ? '#f97316' : '#475569'}
                      strokeWidth={labCalculations.elementPower > 0 ? '4' : '3'}
                      filter={labCalculations.elementPower > 0 ? 'url(#glow)' : ''}
                    />

                    {labCalculations.elementPower > 0 && (
                      <text x="75" y="135" textAnchor="middle" fill="#fdba74" fontSize="11" fontWeight="black">
                        GLOWING RED HOT ({labCalculations.iLive.toFixed(1)} A)
                      </text>
                    )}
                  </g>

                  {/* Live Terminal connected to Element */}
                  <circle cx="0" cy="130" r="7" fill="#934a1b" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="0" y1="130" x2="45" y2="130" stroke="#934a1b" strokeWidth="4" />

                  {/* Neutral Terminal connected to Element return */}
                  <circle cx="0" cy="190" r="7" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="0" y1="190" x2="45" y2="190" stroke="#2563eb" strokeWidth="4" />

                  {/* Earth Terminal securely bolted to Metal Chassis */}
                  <circle cx="0" cy="250" r="7" fill="#15803d" stroke="#facc15" strokeWidth="2" />
                  <rect x="0" y="242" width="18" height="16" rx="3" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
                  <text x="25" y="254" fill="#86efac" fontSize="9" fontWeight="bold">
                    EARTH CHASSIS STUD
                  </text>

                  {/* FAULT SWITCH: Live wire touches metal casing */}
                  <g
                    transform="translate(45, 245)"
                    className="cursor-pointer"
                    onClick={() => setIsFaultActive(!isFaultActive)}
                  >
                    <rect
                      x="0"
                      y="0"
                      width="150"
                      height="38"
                      rx="8"
                      fill={isFaultActive ? '#7f1d1d' : '#1e293b'}
                      stroke={isFaultActive ? '#ef4444' : '#64748b'}
                      strokeWidth="1.5"
                    />
                    <text x="75" y="16" textAnchor="middle" fill={isFaultActive ? '#fca5a5' : '#cbd5e1'} fontSize="10" fontWeight="bold">
                      {isFaultActive ? 'INSULATION FAULT ACTIVE' : 'NO INSULATION FAULT'}
                    </text>
                    <text x="75" y="30" textAnchor="middle" fill={isFaultActive ? '#f87171' : '#94a3b8'} fontSize="9">
                      {isFaultActive ? 'Live touches metal casing!' : 'Click to simulate loose wire'}
                    </text>
                  </g>

                  {/* Spark contact arc if fault is active */}
                  {isFaultActive && (
                    <g transform="translate(40, 130)">
                      <path
                        d="M 0 0 L 20 60 L -15 80 L 15 115"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3.5"
                        filter="url(#glow)"
                      />
                      <circle cx="15" cy="115" r="7" fill="#ef4444" filter="url(#glow)" />
                      <text x="35" y="120" fill="#fca5a5" fontSize="10" fontWeight="bold">
                        FAULT CONTACT!
                      </text>
                    </g>
                  )}

                  {/* Voltmeter probe readout on casing */}
                  <g transform="translate(30, 292)">
                    <rect
                      x="0"
                      y="0"
                      width="180"
                      height="36"
                      rx="8"
                      fill="#020617"
                      stroke={labCalculations.casingVoltage > 50 ? '#ef4444' : '#10b981'}
                      strokeWidth="1.5"
                    />
                    <text x="90" y="15" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">
                      CASING-TO-GROUND POTENTIAL
                    </text>
                    <text
                      x="90"
                      y="30"
                      textAnchor="middle"
                      fill={labCalculations.casingVoltage > 50 ? '#f43f5e' : '#34d399'}
                      fontSize="13"
                      fontWeight="black"
                    >
                      {labCalculations.casingVoltage.toFixed(0)} V {labCalculations.casingVoltage > 50 ? '(LETHAL!)' : '(SAFE 0V)'}
                    </text>
                  </g>
                </g>

                {/* ======================================================== */}
                {/* 4. HUMAN / STUDENT TOUCHING APPLIANCE                     */}
                {/* ======================================================== */}
                <g id="humanCharacter" transform="translate(740, 110)">
                  {/* Toggle button to touch appliance */}
                  <g
                    transform="translate(-20, -10)"
                    className="cursor-pointer"
                    onClick={() => setIsHumanTouching(!isHumanTouching)}
                  >
                    <rect
                      x="0"
                      y="0"
                      width="160"
                      height="34"
                      rx="8"
                      fill={isHumanTouching ? '#450a0a' : '#1e293b'}
                      stroke={isHumanTouching ? '#f43f5e' : '#64748b'}
                      strokeWidth="1.5"
                    />
                    <text x="80" y="15" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                      {isHumanTouching ? 'STUDENT TOUCHING CASING' : 'STUDENT STANDING NEAR'}
                    </text>
                    <text x="80" y="27" textAnchor="middle" fill={isHumanTouching ? '#f87171' : '#94a3b8'} fontSize="9">
                      {isHumanTouching ? 'Click to let go' : 'Click to touch metal casing'}
                    </text>
                  </g>

                  {/* Character Body */}
                  <g transform="translate(45, 45)">
                    {/* Head */}
                    <circle
                      cx="25"
                      cy="20"
                      r="16"
                      fill={labCalculations.humanDangerLevel.startsWith('fatal') ? '#fca5a5' : '#fed7aa'}
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                    />
                    {/* Eyes */}
                    {labCalculations.humanDangerLevel.startsWith('fatal') ? (
                      // Shocked X eyes
                      <g stroke="#991b1b" strokeWidth="2">
                        <line x1="18" y1="16" x2="24" y2="22" />
                        <line x1="24" y1="16" x2="18" y2="22" />
                        <line x1="26" y1="16" x2="32" y2="22" />
                        <line x1="32" y1="16" x2="26" y2="22" />
                      </g>
                    ) : (
                      // Calm eyes
                      <g fill="#0f172a">
                        <circle cx="20" cy="18" r="2" />
                        <circle cx="30" cy="18" r="2" />
                      </g>
                    )}

                    {/* Torso */}
                    <rect
                      x="10"
                      y="40"
                      width="30"
                      height="75"
                      rx="6"
                      fill={labCalculations.humanDangerLevel.startsWith('fatal') ? '#ef4444' : '#3b82f6'}
                      className={labCalculations.humanDangerLevel.startsWith('fatal') ? 'animate-pulse' : ''}
                    />

                    {/* Heart ECG icon on chest */}
                    <path
                      d="M 18 65 L 22 65 L 24 58 L 27 72 L 30 65 L 34 65"
                      fill="none"
                      stroke={labCalculations.humanDangerLevel.startsWith('fatal') ? '#ffffff' : '#93c5fd'}
                      strokeWidth="2"
                    />

                    {/* Legs down to ground */}
                    <line x1="18" y1="115" x2="18" y2="210" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                    <line x1="32" y1="115" x2="32" y2="210" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                    {/* Shoes */}
                    <rect x="8" y="210" width="18" height="10" rx="3" fill="#0f172a" />
                    <rect x="26" y="210" width="18" height="10" rx="3" fill="#0f172a" />

                    {/* Arms */}
                    {isHumanTouching ? (
                      <g>
                        <path
                          d="M 10 50 L -45 65 L -85 70"
                          fill="none"
                          stroke={labCalculations.humanDangerLevel.startsWith('fatal') ? '#ef4444' : '#fed7aa'}
                          strokeWidth="7"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="-85"
                          cy="70"
                          r="5.5"
                          fill={labCalculations.humanDangerLevel.startsWith('fatal') ? '#f59e0b' : '#34d399'}
                          filter={labCalculations.humanDangerLevel.startsWith('fatal') ? 'url(#glow)' : ''}
                        />
                      </g>
                    ) : (
                      <line x1="10" y1="50" x2="0" y2="105" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
                    )}
                    <line x1="40" y1="50" x2="48" y2="105" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />

                    {/* Electric shock lightning bolt visual across body */}
                    {labCalculations.humanDangerLevel.startsWith('fatal') && isHumanTouching && (
                      <g filter="url(#glow)">
                        <path
                          d="M -70 70 L -40 75 L -10 55 L 25 75 L 20 120 L 15 180 L 15 215"
                          fill="none"
                          stroke="#fef08a"
                          strokeWidth="3.5"
                        />
                      </g>
                    )}

                    {/* Earth contact ground plane beneath feet */}
                    <g transform="translate(10, 222)">
                      <line x1="-15" y1="0" x2="45" y2="0" stroke="#64748b" strokeWidth="2" />
                      <line x1="-5" y1="4" x2="35" y2="4" stroke="#64748b" strokeWidth="1.5" />
                      <line x1="5" y1="8" x2="25" y2="8" stroke="#64748b" strokeWidth="1" />
                      <text x="15" y="20" textAnchor="middle" fill="#64748b" fontSize="8">EARTH (0V)</text>
                    </g>
                  </g>

                  {/* Body Current Reading Badge */}
                  <g transform="translate(-10, 290)">
                    <rect
                      x="0"
                      y="0"
                      width="145"
                      height="38"
                      rx="8"
                      fill="#020617"
                      stroke={labCalculations.iHuman > 10 ? '#ef4444' : '#334155'}
                      strokeWidth="1.5"
                    />
                    <text x="72" y="15" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">
                      SHOCK CURRENT (I_body)
                    </text>
                    <text
                      x="72"
                      y="31"
                      textAnchor="middle"
                      fill={labCalculations.iHuman > 10 ? '#f43f5e' : '#34d399'}
                      fontSize="13"
                      fontWeight="black"
                    >
                      {labCalculations.iHuman.toFixed(1)} mA
                    </text>
                  </g>
                </g>
              </svg>
            </div>

            {/* Explanatory "Why Did That Happen?" Pedagogical Callout */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Info className="w-4 h-4" />
                <span>Physical Causal Mechanism: Why Did That Happen?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {labCalculations.actionAdvice}
              </p>

              {/* Stepwise explanation based on current mode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="font-bold text-amber-400 block mb-1">1. Resistance Contrast</span>
                  <span className="text-slate-400">
                    Earth wire resistance is only <strong className="text-emerald-400">0.5 Ω</strong>, whereas the human body is <strong className="text-amber-300">1000 Ω</strong>. Current strictly follows the path of least resistance!
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="font-bold text-amber-400 block mb-1">2. Surge Current (I = V/R)</span>
                  <span className="text-slate-400">
                    With Earth wire connected: I = 240 V / 0.5 Ω = <strong className="text-rose-400">480 A</strong>. This massive surge melts the fuse in &lt; 0.02 s (Q = I² R t).
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="font-bold text-amber-400 block mb-1">3. The Fatal 13 A Paradox</span>
                  <span className="text-slate-400">
                    Without Earth wire: I = 240 V / 1000 Ω = <strong className="text-rose-400">0.24 A = 240 mA</strong>. Because 0.24 A &lt;&lt; 13 A, the fuse never blows, electrocuting the human!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Controls & Sensor Panel (4 cols on desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Control Group 1: Appliance & Circuit Setup */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Appliance & Protective Device</span>
              </h3>

              {/* Select Appliance */}
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">
                  Select Domestic Appliance:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(APPLIANCES).map(([key, app]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setApplianceType(key);
                        setIsDeviceTripped(false);
                      }}
                      className={`p-2 rounded-xl text-xs font-bold text-left transition-all flex items-center gap-2 border ${
                        applianceType === key
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-base">{app.icon}</span>
                      <div className="overflow-hidden">
                        <div className="truncate">{app.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{app.power} W</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Protective Device */}
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">
                  Protective Device:
                </label>
                <select
                  value={protectionDevice}
                  onChange={(e) => {
                    setProtectionDevice(e.target.value);
                    setIsDeviceTripped(false);
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="fuse_3">3 A Cartridge Fuse (Lamps / Shavers)</option>
                  <option value="fuse_5">5 A Cartridge Fuse (Small appliances)</option>
                  <option value="fuse_13">13 A Cartridge Fuse (Standard BS 1363)</option>
                  <option value="fuse_30">30 A High-Capacity Fuse (Cooker Ring)</option>
                  <option value="mcb_13">13 A Miniature Circuit Breaker (MCB)</option>
                  <option value="rcd_30ma">30 mA Residual Current Device (RCD)</option>
                </select>
              </div>

              {/* Earth Wire Toggle Switch */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Earth Wire Connection:</span>
                  <span className="text-[11px] text-slate-400">
                    {isEarthConnected ? '0.5 Ω bond to metal casing' : 'BROKEN / CUT EARTH WIRE'}
                  </span>
                </div>
                <button
                  onClick={() => setIsEarthConnected(!isEarthConnected)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                    isEarthConnected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {isEarthConnected ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                  <span>{isEarthConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
                </button>
              </div>

              {/* Fault Injection Switch */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Live Insulation Fault:</span>
                  <span className="text-[11px] text-slate-400">
                    {isFaultActive ? 'Live touches metal chassis' : 'Insulation fully intact'}
                  </span>
                </div>
                <button
                  onClick={() => setIsFaultActive(!isFaultActive)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                    isFaultActive
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>{isFaultActive ? 'FAULT ACTIVE' : 'NO FAULT'}</span>
                </button>
              </div>

              {/* Human Touch Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Student Contact:</span>
                  <span className="text-[11px] text-slate-400">
                    {isHumanTouching ? 'Touching bare metal chassis' : 'Standing safely nearby'}
                  </span>
                </div>
                <button
                  onClick={() => setIsHumanTouching(!isHumanTouching)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                    isHumanTouching
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <span>{isHumanTouching ? 'TOUCHING' : 'NOT TOUCHING'}</span>
                </button>
              </div>
            </div>

            {/* Physiological Current Scale (Human Safety Limits) */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2.5">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                <span>Human Shock Physiological Scale</span>
                <Activity className="w-4 h-4 text-rose-400" />
              </h3>

              {/* Level bars */}
              <div className="space-y-1.5 text-[11px]">
                <div className={`p-1.5 rounded-lg flex items-center justify-between border ${labCalculations.iHuman < 1 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold' : 'bg-slate-950/60 border-slate-800/60 text-slate-400'}`}>
                  <span>&lt; 1 mA: Imperceptible / Safe</span>
                  <span>Safe</span>
                </div>
                <div className={`p-1.5 rounded-lg flex items-center justify-between border ${labCalculations.iHuman >= 1 && labCalculations.iHuman < 10 ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold' : 'bg-slate-950/60 border-slate-800/60 text-slate-400'}`}>
                  <span>1 - 5 mA: Mild Tingle</span>
                  <span>Threshold</span>
                </div>
                <div className={`p-1.5 rounded-lg flex items-center justify-between border ${labCalculations.iHuman >= 10 && labCalculations.iHuman < 50 ? 'bg-orange-500/20 border-orange-500/40 text-orange-300 font-bold' : 'bg-slate-950/60 border-slate-800/60 text-slate-400'}`}>
                  <span>10 - 20 mA: Muscular Contraction</span>
                  <span>Cannot Let Go!</span>
                </div>
                <div className={`p-1.5 rounded-lg flex items-center justify-between border ${labCalculations.iHuman >= 50 ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-bold animate-pulse' : 'bg-slate-950/60 border-slate-800/60 text-slate-400'}`}>
                  <span>&gt; 50 mA: Ventricular Fibrillation</span>
                  <span>FATAL LETHAL!</span>
                </div>
              </div>

              {/* Interactive Body Resistance Slider */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Skin Condition (Body Resistance):</span>
                  <span className="font-bold text-slate-200">{bodyResistance} Ω</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={bodyResistance}
                  onChange={(e) => setBodyResistance(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Wet Skin (500 Ω)</span>
                  <span>Dry Skin (2000 Ω)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FUSE SIZING & APPLIANCE BENCH (P/V)                                */}
      {/* ========================================================================= */}
      {activeTab === 'sizing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Sizing Interactive Workbench (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-amber-400" />
                    <span>Fuse Sizing Rule: I_rated = P / V</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Test appliance power loads against standard British / Kenyan fuse ratings (3 A, 5 A, 13 A, 30 A).
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSizingTripped(false);
                    setSizingCableTemp(25);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reset Fuse</span>
                </button>
              </div>

              {/* Power Slider */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold">Appliance Rated Power (P):</span>
                  <span className="text-base font-black text-amber-400 font-mono">{sizingPowerW} W ({(sizingPowerW / 1000).toFixed(2)} kW)</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="7200"
                  step="100"
                  value={sizingPowerW}
                  onChange={(e) => {
                    setSizingPowerW(Number(e.target.value));
                    setSizingTripped(false);
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>60 W (Table Lamp)</span>
                  <span>1.2 kW (Iron)</span>
                  <span>2.4 kW (Kettle)</span>
                  <span>3.0 kW (Heater)</span>
                  <span>7.2 kW (Cooker)</span>
                </div>
              </div>

              {/* Fuse Rating Selector */}
              <div>
                <label className="text-xs text-slate-300 font-bold mb-2 block">
                  Select Cartridge Fuse Rating:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 13, 30].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {
                        setSizingFuseRating(rating);
                        setSizingTripped(false);
                      }}
                      className={`py-3 px-2 rounded-2xl text-center border font-black transition-all ${
                        sizingFuseRating === rating
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-[1.02]'
                          : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-lg">{rating} A</div>
                      <div className="text-[10px] font-normal opacity-80">
                        {rating === 3 ? 'Up to 720 W' : rating === 5 ? 'Up to 1.2 kW' : rating === 13 ? 'Up to 3.1 kW' : 'Dedicated Cooker'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Operating Test Mode */}
              <div>
                <label className="text-xs text-slate-300 font-bold mb-1.5 block">
                  Operating Scenario to Simulate:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setSizingTestMode('normal');
                      setSizingTripped(false);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                      sizingTestMode === 'normal'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Normal Run (100% Load)
                  </button>
                  <button
                    onClick={() => {
                      setSizingTestMode('overload_150');
                      setSizingTripped(false);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                      sizingTestMode === 'overload_150'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    150% Overload
                  </button>
                  <button
                    onClick={() => {
                      setSizingTestMode('short_circuit');
                      setSizingTripped(false);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                      sizingTestMode === 'short_circuit'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Dead Short (480 A)
                  </button>
                </div>
              </div>

              {/* Live Status Card */}
              <div className={`p-4 rounded-2xl border flex flex-col gap-2 ${
                sizingTripped
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : sizingEvaluation.verdict === 'undersized'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    {sizingTripped ? <Flame className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>{sizingTripped ? 'FUSE MELTED / CIRCUIT SEVERED' : 'FUSE ELEMENT INTACT'}</span>
                  </span>
                  <span className="text-xs font-mono font-bold">
                    Actual Current: {sizingActualCurrent.toFixed(1)} A
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {sizingEvaluation.message}
                </p>
                {sizingTestMode === 'overload_150' && sizingEvaluation.isOversized && (
                  <div className="mt-1 p-2 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                      <span>Cable Temperature Surge:</span>
                    </span>
                    <span className="font-bold font-mono text-rose-200">{sizingCableTemp} °C (Insulation Smoking!)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sizing Theory & Characteristic Curve (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Calculation Breakdown Card */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                <span>Step-by-Step KCSE Sizing Calculation</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 block mb-0.5">Step 1: Compute Normal Current (I = P/V)</span>
                  <div className="font-mono text-amber-300 font-bold">
                    I = {sizingPowerW} W / 240 V = {sizingNormalCurrent.toFixed(2)} A
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 block mb-0.5">Step 2: Compare Against Standard Ratings</span>
                  <div className="text-slate-300">
                    Standard domestic ratings are <strong className="text-amber-300">3 A, 5 A, 13 A, 30 A</strong>.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 block mb-0.5">Step 3: Apply the Golden Rule</span>
                  <div className="text-slate-300 leading-relaxed">
                    The chosen fuse must be <em>slightly higher</em> than {sizingNormalCurrent.toFixed(1)} A.
                    <br />
                    {sizingNormalCurrent <= 3 && (
                      <span className="text-emerald-400 font-bold">→ Ideal: 3 A fuse (for lamps, radios).</span>
                    )}
                    {sizingNormalCurrent > 3 && sizingNormalCurrent <= 5 && (
                      <span className="text-emerald-400 font-bold">→ Ideal: 5 A fuse (for irons, small heaters).</span>
                    )}
                    {sizingNormalCurrent > 5 && sizingNormalCurrent <= 13 && (
                      <span className="text-emerald-400 font-bold">→ Ideal: 13 A fuse (for kettles, toasters).</span>
                    )}
                    {sizingNormalCurrent > 13 && (
                      <span className="text-emerald-400 font-bold">→ Ideal: 30 A fuse on a dedicated cooker circuit!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Fuse Characteristic Log Curve SVG */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-slate-300">
                  Inverse-Time Melting Curve (t ∝ 1 / I²)
                </span>
                <div className="w-full aspect-[16/9] relative">
                  <svg viewBox="0 0 320 180" className="w-full h-full">
                    {/* Axes */}
                    <line x1="40" y1="20" x2="40" y2="150" stroke="#475569" strokeWidth="1.5" />
                    <line x1="40" y1="150" x2="300" y2="150" stroke="#475569" strokeWidth="1.5" />
                    <text x="30" y="25" textAnchor="end" fill="#94a3b8" fontSize="9">t (s)</text>
                    <text x="300" y="165" textAnchor="end" fill="#94a3b8" fontSize="9">Current I (A)</text>

                    {/* Curve */}
                    <path
                      d="M 50 30 Q 70 120 180 142 T 290 148"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />

                    {/* Point for current operating state */}
                    <circle
                      cx={Math.min(285, Math.max(55, 40 + (sizingActualCurrent / 35) * 240))}
                      cy={Math.min(145, Math.max(35, 150 - (100 / (sizingActualCurrent + 1))))}
                      r="5"
                      fill="#ef4444"
                      className="animate-pulse"
                    />
                    <text
                      x={Math.min(270, Math.max(65, 50 + (sizingActualCurrent / 35) * 240))}
                      y={Math.min(140, Math.max(45, 140 - (100 / (sizingActualCurrent + 1))))}
                      fill="#fca5a5"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {sizingActualCurrent.toFixed(1)} A
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: WHY FUSE MUST BE IN LIVE WIRE (MISCONCEPTION BUSTER)               */}
      {/* ========================================================================= */}
      {activeTab === 'live_vs_neutral' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Visual comparison (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <span>KCSE Misconception: Fuse & Switch Placement</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Why must switches and fuses ALWAYS be placed in the Live wire and NEVER in the Neutral wire?
                  </p>
                </div>
              </div>

              {/* Selector: Place Fuse in Live vs Neutral */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFusePosition('live')}
                  className={`p-3 rounded-2xl border font-bold text-xs flex flex-col gap-1 transition-all ${
                    fusePosition === 'live'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Fuse in LIVE Wire (Standard)</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-300">
                    Severing Live wire disconnects entire appliance from 240 V potential.
                  </span>
                </button>

                <button
                  onClick={() => setFusePosition('neutral')}
                  className={`p-3 rounded-2xl border font-bold text-xs flex flex-col gap-1 transition-all ${
                    fusePosition === 'neutral'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Fuse in NEUTRAL Wire (FATAL!)</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-300">
                    Fuse blows, current stops, but appliance remains at 240 V!
                  </span>
                </button>
              </div>

              {/* Interactive Virtual Voltmeter Test Bench */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    Virtual Multimeter Probe Test:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsSwitchedOff(!isSwitchedOff)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                        isSwitchedOff
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      Switch: {isSwitchedOff ? 'OPEN (OFF)' : 'CLOSED (ON)'}
                    </button>
                    <button
                      onClick={() => setHasPositionFault(!hasPositionFault)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                        hasPositionFault
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      Fuse: {hasPositionFault ? 'BLOWN' : 'INTACT'}
                    </button>
                  </div>
                </div>

                {/* Probe points selector */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'supply', label: '1. Live Terminal' },
                    { id: 'fuse_out', label: '2. After Fuse' },
                    { id: 'element', label: '3. Heating Element' },
                    { id: 'casing', label: '4. Metal Casing' }
                  ].map((probe) => (
                    <button
                      key={probe.id}
                      onClick={() => setProbeLocation(probe.id)}
                      className={`p-2 rounded-xl border text-center font-bold transition-all ${
                        probeLocation === probe.id
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {probe.label}
                    </button>
                  ))}
                </div>

                {/* Voltmeter Display */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">
                      Voltmeter Reading at {probeLocation.toUpperCase()}:
                    </span>
                    <span className={`text-2xl font-black font-mono ${
                      probeVoltage > 50 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                    }`}>
                      {probeVoltage} V AC
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`px-3 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider ${
                      probeVoltage > 50 ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {probeVoltage > 50 ? 'LETHAL TO TOUCH!' : 'SAFE TO TOUCH (0 V)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>The Neutral Wire Trap Explained</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-emerald-400 mb-1">When Fuse is in LIVE Wire:</h4>
                  <p>
                    When the switch is turned off or the fuse blows, the connection to the 240 V high voltage source is cut right at the entry point. The heating element and internal conductors drop to <strong>0 V</strong>. A technician or student can safely open the appliance without danger of electrocution.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-rose-400 mb-1">When Fuse is in NEUTRAL Wire (The Danger):</h4>
                  <p>
                    The circuit is broken on the return path. <strong>No current flows, so the heating element stops glowing and seems &quot;dead&quot;</strong>. However, the appliance remains directly connected to the <strong>240 V Live wire</strong>!
                  </p>
                  <p className="mt-1.5 text-rose-300 font-semibold">
                    If anyone touches the element or casing with damp feet, their body completes a new path to ground, resulting in fatal electrocution!
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                  <strong className="block mb-1 font-bold">Standard KCSE Exam Answer:</strong>
                  &quot;Switches and fuses must always be connected in the live wire so that when the switch is open or the fuse melts, the appliance is completely isolated from the high voltage mains supply.&quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FUSE VS MCB VS RCD TECHNOLOGY COMPARISON                          */}
      {/* ========================================================================= */}
      {activeTab === 'comparison' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: Cartridge Fuse */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                  Thermal Sacrificial
                </span>
                <span className="text-xs text-slate-400 font-mono">BS 1362</span>
              </div>
              <h3 className="text-base font-bold text-slate-100">Cartridge Fuse Wire</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contains a thin tinned copper or lead-tin alloy wire embedded in quartz silica sand within a ceramic tube.
              </p>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Operating Mechanism:</span>
                  <span className="font-bold text-amber-300">Joule Heating (I² R t)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Response Speed:</span>
                  <span className="font-bold text-slate-200">Moderate (~0.02 - 0.1 s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reusability:</span>
                  <span className="font-bold text-rose-400">One-time (Must replace)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cost:</span>
                  <span className="font-bold text-emerald-400">Very Cheap (~KES 50)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200 block mb-1">Limitations:</strong>
              Can be incorrectly replaced with an oversized wire (e.g. copper wire nails!), destroying safety.
            </div>
          </div>

          {/* Card 2: Miniature Circuit Breaker (MCB) */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-500/30">
                  Electromagnetic + Thermal
                </span>
                <span className="text-xs text-slate-400 font-mono">BS EN 60898</span>
              </div>
              <h3 className="text-base font-bold text-slate-100">Miniature Circuit Breaker (MCB)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dual trip system: a bimetallic strip for slow sustained overcurrents, and an electromagnetic solenoid for instantaneous short-circuit protection.
              </p>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Operating Mechanism:</span>
                  <span className="font-bold text-blue-300">Solenoid + Bimetal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Response Speed:</span>
                  <span className="font-bold text-emerald-400">Fast (&lt; 10 - 25 ms)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reusability:</span>
                  <span className="font-bold text-emerald-400">Resettable Toggle Switch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tamper-Proof:</span>
                  <span className="font-bold text-emerald-400">High (Fixed factory rating)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200 block mb-1">Key KCSE Advantage:</strong>
              Instantly resettable after a fault without needing replacement tools; cannot be bypassed easily.
            </div>
          </div>

          {/* Card 3: Residual Current Device (RCD) */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-300 font-bold text-xs border border-teal-500/30">
                  Current Imbalance Sense
                </span>
                <span className="text-xs text-slate-400 font-mono">Life-Saving</span>
              </div>
              <h3 className="text-base font-bold text-slate-100">Residual Current Device (RCD)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compares Live current with Neutral return current using a toroidal core transformer. Trips if difference exceeds 30 mA.
              </p>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Operating Mechanism:</span>
                  <span className="font-bold text-teal-300">Kirchhoff Leakage (I_L ≠ I_N)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sensitivity:</span>
                  <span className="font-bold text-rose-400">30 mA (Protects Human Body)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Trip Speed:</span>
                  <span className="font-bold text-emerald-400">Ultra-Fast (&lt; 25 ms)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Broken Earth Protection:</span>
                  <span className="font-bold text-emerald-400">Yes! (Senses body leakage)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200 block mb-1">Life-Saving Feature:</strong>
              Protects a person from electrocution even when the appliance has no earth wire!
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: KCSE EXAM MASTERY & QUIZ                                          */}
      {/* ========================================================================= */}
      {activeTab === 'kcse' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Question Box (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {currentProblem.year}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Problem {currentProblemIdx + 1} of {KCSE_PROBLEMS.length}
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-100">
                {currentProblem.title}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                {currentProblem.scenario}
              </p>

              {/* Input Form */}
              <form onSubmit={handleCheckAnswer} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    step="any"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={`Enter value in ${currentProblem.unit}`}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-mono">
                    {currentProblem.unit}
                  </span>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Check Answer</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              {/* Feedback Alert */}
              {answerStatus === 'correct' && (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-xs sm:text-sm animate-fade-in">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Correct! Outstanding physics calculation!</span>
                  </div>
                  <button
                    onClick={handleNextProblem}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition-all"
                  >
                    Next Question →
                  </button>
                </div>
              )}

              {answerStatus === 'incorrect' && (
                <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-semibold">
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span>Incorrect value. Check your arithmetic and units, then try again.</span>
                  </div>
                  <button
                    onClick={() => setShowSolution(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-rose-200 font-bold text-xs hover:bg-slate-700"
                  >
                    View Solution
                  </button>
                </div>
              )}

              {/* Hint Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 font-bold">KCSE Examiner Hint: </strong>
                  {currentProblem.hint}
                </div>
              </div>
            </div>
          </div>

          {/* Solution & Mark Scheme (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>KNEC KCSE Marking Scheme</span>
                </h3>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  {showSolution ? 'Hide Steps' : 'Reveal Steps'}
                </button>
              </div>

              {showSolution ? (
                <div className="space-y-2.5 text-xs">
                  {currentProblem.solutionSteps.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-slate-300">
                      <span className="font-bold text-amber-400 block mb-0.5">Step {idx + 1}:</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-950/50 border border-slate-800/60 text-center text-slate-400 text-xs">
                  Attempt the calculation first, then check or reveal the official KCSE marking scheme step-by-step breakdown!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
