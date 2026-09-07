import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Zap,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Power,
  Sliders,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Award,
  HelpCircle,
  Volume2,
  VolumeX,
  Eye,
  Flame,
  AlertCircle,
  Wrench,
  RefreshCw,
  Layers,
  ArrowRight,
  Activity
} from 'lucide-react';

/**
 * Web Audio Synthesizer for Domestic Mains Lab
 * Generates realistic switch clicks, 50 Hz mains hum, fuse rupture pops, and breaker trips.
 */
class DomesticAudioSynth {
  constructor() {
    this.ctx = null;
    this.humOsc = null;
    this.humGain = null;
    this.isHumming = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  playClick() {
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Ignore audio restrictions
    }
  }

  playFuseBlow() {
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    try {
      // Noise burst for fuse pop
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.12);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {
      // Ignore
    }
  }

  playShockBuzz() {
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  }

  startHum(intensity = 0.02) {
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended' || this.isHumming) return;
    try {
      this.humOsc = this.ctx.createOscillator();
      this.humGain = this.ctx.createGain();
      this.humOsc.type = 'sine';
      this.humOsc.frequency.setValueAtTime(50, this.ctx.currentTime);
      this.humGain.gain.setValueAtTime(intensity, this.ctx.currentTime);
      this.humOsc.connect(this.humGain);
      this.humGain.connect(this.ctx.destination);
      this.humOsc.start();
      this.isHumming = true;
    } catch {
      // Ignore
    }
  }

  stopHum() {
    if (!this.isHumming || !this.humOsc) return;
    try {
      this.humOsc.stop();
      this.humOsc.disconnect();
      if (this.humGain) this.humGain.disconnect();
    } catch {
      // Ignore
    }
    this.isHumming = false;
  }
}

export default function DomesticWiringRingMainSim({ config = {}, onTelemetry }) {
  // ==========================================
  // TOP-LEVEL NAVIGATION
  // ==========================================
  // 'ring_main' | 'three_pin_plug' | 'safety_lab' | 'kcse_practice'
  const [activeTab, setActiveTab] = useState('ring_main');
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  const audioRef = useRef(null);
  useEffect(() => {
    audioRef.current = new DomesticAudioSynth();
    return () => {
      if (audioRef.current) audioRef.current.stopHum();
    };
  }, []);

  const triggerSound = useCallback((type) => {
    if (isAudioMuted || !audioRef.current) return;
    if (type === 'click') audioRef.current.playClick();
    else if (type === 'fuse') audioRef.current.playFuseBlow();
    else if (type === 'shock') audioRef.current.playShockBuzz();
  }, [isAudioMuted]);

  // ==========================================
  // TAB 1 STATE: RING MAIN CIRCUIT EXPLORER
  // ==========================================
  const [isMainsSupplyOn, setIsMainsSupplyOn] = useState(true);
  const [isMcbTripped, setIsMcbTripped] = useState(false);
  const [isRingBroken, setIsRingBroken] = useState(false); // Severed loop test

  // 4 Domestic Sockets along the ring
  const [sockets, setSockets] = useState([
    {
      id: 1,
      room: 'Kitchen',
      appliance: 'Electric Kettle',
      powerW: 2400,
      isOn: true,
      availableAppliances: [
        { name: 'Electric Kettle', powerW: 2400 },
        { name: 'Toaster', powerW: 1200 },
        { name: 'Blender', powerW: 400 },
        { name: 'Unplugged', powerW: 0 }
      ]
    },
    {
      id: 2,
      room: 'Living Room',
      appliance: 'Space Heater',
      powerW: 2000,
      isOn: true,
      availableAppliances: [
        { name: 'Space Heater', powerW: 2000 },
        { name: 'Smart TV & Soundbar', powerW: 250 },
        { name: 'Floor Lamp', powerW: 60 },
        { name: 'Unplugged', powerW: 0 }
      ]
    },
    {
      id: 3,
      room: 'Utility Room',
      appliance: 'Washing Machine',
      powerW: 1800,
      isOn: false,
      availableAppliances: [
        { name: 'Washing Machine', powerW: 1800 },
        { name: 'Electric Iron', powerW: 1200 },
        { name: 'Vacuum Cleaner', powerW: 1000 },
        { name: 'Unplugged', powerW: 0 }
      ]
    },
    {
      id: 4,
      room: 'Master Bedroom',
      appliance: 'Air Conditioner',
      powerW: 1500,
      isOn: false,
      availableAppliances: [
        { name: 'Air Conditioner', powerW: 1500 },
        { name: 'Hair Dryer', powerW: 1600 },
        { name: 'Phone Charger', powerW: 30 },
        { name: 'Unplugged', powerW: 0 }
      ]
    }
  ]);

  // Animation frame counter for electron movement
  const [animClock, setAnimClock] = useState(0);
  useEffect(() => {
    let animId;
    let lastTime = performance.now();
    const loop = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setAnimClock((c) => (c + dt * 4) % 100);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Ring Main Physics Calculations
  const ringCalculations = useMemo(() => {
    const mainsVoltage = 240; // Volts RMS (Kenya / UK standard)
    const mcbLimitA = 32; // Standard 32A MCB rating for 2.5 mm² ring final circuit

    // Current per socket
    const socketLoads = sockets.map((s) => {
      const activePower = (isMainsSupplyOn && !isMcbTripped && s.isOn) ? s.powerW : 0;
      const currentA = activePower / mainsVoltage;
      return { ...s, activePower, currentA };
    });

    const totalActivePowerW = socketLoads.reduce((acc, s) => acc + s.activePower, 0);
    const totalCurrentA = socketLoads.reduce((acc, s) => acc + s.currentA, 0);

    // Branch current calculation:
    // In an intact ring, current divides between clockwise (Leg 1) and counter-clockwise (Leg 2) paths.
    // Distance weights from Consumer Unit (normalized perimeter 0 to 1):
    // Socket 1: 0.20, Socket 2: 0.40, Socket 3: 0.65, Socket 4: 0.85
    let branch1CurrentA = 0; // Clockwise
    let branch2CurrentA = 0; // Counter-clockwise

    if (!isRingBroken) {
      // Normal dual path
      socketLoads.forEach((s) => {
        let pos = 0.25;
        if (s.id === 1) pos = 0.20;
        else if (s.id === 2) pos = 0.40;
        else if (s.id === 3) pos = 0.65;
        else if (s.id === 4) pos = 0.85;

        // Current divides inversely proportional to conductor path length (R proportional to L)
        const iCw = s.currentA * (1 - pos);
        const iCcw = s.currentA * pos;
        branch1CurrentA += iCw;
        branch2CurrentA += iCcw;
      });
    } else {
      // Severed ring (Broken at pos ~0.50 between sockets 2 and 3)
      // Socket 1 & 2 feed ONLY from Leg 1 (CW). Socket 3 & 4 feed ONLY from Leg 2 (CCW).
      branch1CurrentA = socketLoads[0].currentA + socketLoads[1].currentA;
      branch2CurrentA = socketLoads[2].currentA + socketLoads[3].currentA;
    }

    // Overload check
    const isOverloaded = totalCurrentA > mcbLimitA;
    const maxLegCurrentA = Math.max(branch1CurrentA, branch2CurrentA);
    // 2.5 mm² PVC cable is rated ~20A per conductor run
    const isLegOverheated = maxLegCurrentA > 20.0;

    return {
      mainsVoltage,
      mcbLimitA,
      socketLoads,
      totalActivePowerW,
      totalCurrentA,
      branch1CurrentA,
      branch2CurrentA,
      isOverloaded,
      isLegOverheated,
      maxLegCurrentA
    };
  }, [sockets, isMainsSupplyOn, isMcbTripped, isRingBroken]);

  // Trip MCB if overloaded
  useEffect(() => {
    if (ringCalculations.isOverloaded && !isMcbTripped && isMainsSupplyOn) {
      setIsMcbTripped(true);
      triggerSound('fuse');
      onTelemetry?.({
        event: 'mcb_tripped',
        totalCurrent: ringCalculations.totalCurrentA,
        rating: 32
      });
    }
  }, [ringCalculations.isOverloaded, isMcbTripped, isMainsSupplyOn, triggerSound, onTelemetry]);

  // Hum sound management
  useEffect(() => {
    if (!audioRef.current || isAudioMuted) return;
    if (isMainsSupplyOn && !isMcbTripped && ringCalculations.totalCurrentA > 0.5) {
      const intensity = Math.min(0.04, 0.005 + (ringCalculations.totalCurrentA / 32) * 0.035);
      audioRef.current.startHum(intensity);
    } else {
      audioRef.current.stopHum();
    }
  }, [isMainsSupplyOn, isMcbTripped, ringCalculations.totalCurrentA, isAudioMuted]);

  // Socket toggle handlers
  const handleToggleSocketPower = (id) => {
    triggerSound('click');
    setSockets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isOn: !s.isOn } : s))
    );
  };

  const handleSelectAppliance = (id, applianceObj) => {
    triggerSound('click');
    setSockets((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              appliance: applianceObj.name,
              powerW: applianceObj.powerW,
              isOn: applianceObj.powerW > 0 ? s.isOn : false
            }
          : s
      )
    );
  };

  // ==========================================
  // TAB 2 STATE: THREE-PIN PLUG ANATOMY & WIRING
  // ==========================================
  const [selectedPlugComponent, setSelectedPlugComponent] = useState('fuse'); // 'earth' | 'live' | 'neutral' | 'fuse' | 'grip' | 'slack'
  const [wiringPreset, setWiringPreset] = useState('correct'); // 'correct' | 'reversed_live_neutral' | 'no_earth' | 'grip_on_cores' | 'wrong_fuse'
  const [fuseRatingA, setFuseRatingA] = useState(13); // 3 | 5 | 13
  const [testAppliancePowerW, setTestAppliancePowerW] = useState(2400); // Kettle 2400W -> 10A

  const plugDiagnostics = useMemo(() => {
    const applianceCurrentA = testAppliancePowerW / 240;
    let isSafe = true;
    const errors = [];
    const warnings = [];

    // Check Wiring Preset
    if (wiringPreset === 'reversed_live_neutral') {
      isSafe = false;
      errors.push({
        title: 'Reversed Live and Neutral Wires!',
        desc: 'Brown (Live) connected to Neutral pin, Blue (Neutral) connected to Live pin. This puts the appliance switch and cartridge fuse in the Neutral line, leaving the internal element at lethal 240V even when switched off!'
      });
    }

    if (wiringPreset === 'no_earth') {
      isSafe = false;
      errors.push({
        title: 'Earth Wire Disconnected / Missing!',
        desc: 'Appliance metal chassis has no earth protection path. If an insulation breakdown occurs, the casing will remain energized at 240V, causing fatal electrocution on touch!'
      });
    }

    if (wiringPreset === 'grip_on_cores') {
      isSafe = false;
      warnings.push({
        title: 'Cord Grip Clamped on Bare Inner Cores!',
        desc: 'The outer protective sheath was stripped too far back. The clamp presses on individual colored cores, causing insulation abrasion, risk of short-circuits, and terminal screw pull-out.'
      });
    }

    // Check Fuse Rating
    if (fuseRatingA < applianceCurrentA) {
      errors.push({
        title: `Fuse Rating (${fuseRatingA} A) Too Low for Appliance (${applianceCurrentA.toFixed(1)} A)!`,
        desc: `Appliance draws ${applianceCurrentA.toFixed(1)} A. The ${fuseRatingA} A fuse wire will immediately overheat and blow under normal operating conditions.`
      });
    } else if (testAppliancePowerW <= 300 && fuseRatingA === 13) {
      warnings.push({
        title: 'Fuse Rating Oversized (13 A for low-power load)!',
        desc: `A 13 A fuse for a low-power appliance (${testAppliancePowerW} W, ${(testAppliancePowerW / 240).toFixed(2)} A) does not protect thin appliance flex cord. A 3 A fuse should be used.`
      });
    }

    return {
      applianceCurrentA,
      isSafe: errors.length === 0 && warnings.length === 0,
      hasErrors: errors.length > 0,
      errors,
      warnings
    };
  }, [wiringPreset, fuseRatingA, testAppliancePowerW]);

  // ==========================================
  // TAB 3 STATE: SWITCH IN LIVE & EARTHING SAFETY
  // ==========================================
  const [switchPosition, setSwitchPosition] = useState('live'); // 'live' (correct) | 'neutral' (fatal hazard)
  const [isApplianceSwitchedOn, setIsApplianceSwitchedOn] = useState(false);
  const [isEarthConnected, setIsEarthConnected] = useState(true);
  const [isCaseFaultActive, setIsCaseFaultActive] = useState(false); // Live wire touching metal case
  const [isSafetyFuseBlown, setIsSafetyFuseBlown] = useState(false);
  const [probeLocation, setProbeLocation] = useState('element'); // 'supply_live' | 'post_switch' | 'element' | 'case' | 'neutral'
  const [isHumanTouching, setIsHumanTouching] = useState(false);

  // Safety Lab Physics Engine
  const safetyPhysics = useMemo(() => {
    const mainsVoltage = 240;
    const bodyResistanceOhms = 1000; // Wet/firm hand-to-feet contact (~1000 ohms)
    const earthResistanceOhms = 0.5; // Low resistance earth path (~0.5 ohms)

    // Calculate node voltages relative to Earth (0V)
    let vSupplyLive = 240;
    let vAfterSwitch = 0;
    let vElement = 0;
    let vCase = 0;
    let vNeutral = 0;
    let circuitCurrentA = 0;
    let faultCurrentA = 0;

    if (isSafetyFuseBlown) {
      // Fuse blown isolates everything after fuse in Live line
      return {
        vSupplyLive: 240,
        vAfterSwitch: 0,
        vElement: 0,
        vCase: 0,
        vNeutral: 0,
        circuitCurrentA: 0,
        faultCurrentA: 0,
        shockCurrentMA: 0,
        isLethal: false,
        elementGlow: false
      };
    }

    if (switchPosition === 'live') {
      // Standard Safe Design: Switch is in LIVE wire
      if (isApplianceSwitchedOn) {
        vAfterSwitch = 240;
        vElement = 120; // Potential across element drops from 240 to 0
        circuitCurrentA = 240 / 24; // 10A (24 ohm heating element)
      } else {
        vAfterSwitch = 0;
        vElement = 0;
        circuitCurrentA = 0;
      }
    } else {
      // Dangerous Flaw: Switch is in NEUTRAL wire
      // When switch is OFF, the entire element sits at full 240V!
      if (isApplianceSwitchedOn) {
        vAfterSwitch = 0;
        vElement = 120;
        circuitCurrentA = 10;
      } else {
        vAfterSwitch = 240; // Entire line up to open neutral switch is live!
        vElement = 240; // Element is at 240V potential!
        circuitCurrentA = 0;
      }
    }

    // Evaluate Metal Casing Potential
    if (isCaseFaultActive) {
      // Live wire touches casing
      if (switchPosition === 'live' && !isApplianceSwitchedOn) {
        // Switch is OFF in live wire: no voltage reaches casing!
        vCase = 0;
      } else {
        if (isEarthConnected) {
          // Surge current flows to earth!
          faultCurrentA = 240 / earthResistanceOhms; // 480 Amperes!
          vCase = faultCurrentA * earthResistanceOhms * 0.05; // ~12V momentary safe touch
        } else {
          // No earth wire to discharge fault!
          vCase = 240; // Entire chassis is charged to 240V!
          faultCurrentA = 0;
        }
      }
    } else {
      vCase = 0;
    }

    // Determine Potential at selected Probe Location
    let probeVoltage = 0;
    if (probeLocation === 'supply_live') probeVoltage = vSupplyLive;
    else if (probeLocation === 'post_switch') probeVoltage = vAfterSwitch;
    else if (probeLocation === 'element') probeVoltage = vElement;
    else if (probeLocation === 'case') probeVoltage = vCase;
    else if (probeLocation === 'neutral') probeVoltage = vNeutral;

    // Determine shock current if human touches probe location
    const shockCurrentMA = isHumanTouching ? (probeVoltage / bodyResistanceOhms) * 1000 : 0;
    const isLethal = shockCurrentMA >= 50; // 50 mA ventricular fibrillation threshold

    return {
      vSupplyLive,
      vAfterSwitch,
      vElement,
      vCase,
      vNeutral,
      probeVoltage,
      circuitCurrentA,
      faultCurrentA,
      shockCurrentMA,
      isLethal,
      elementGlow: isApplianceSwitchedOn && !isSafetyFuseBlown
    };
  }, [switchPosition, isApplianceSwitchedOn, isEarthConnected, isCaseFaultActive, isSafetyFuseBlown, probeLocation, isHumanTouching]);

  // Instant Fuse Blow Action when fault occurs WITH Earth connected
  useEffect(() => {
    if (isCaseFaultActive && isEarthConnected && !isSafetyFuseBlown) {
      // High fault current trips 13A fuse instantly
      const timer = setTimeout(() => {
        setIsSafetyFuseBlown(true);
        triggerSound('fuse');
        onTelemetry?.({
          event: 'fuse_blown_by_earthing',
          faultCurrent: safetyPhysics.faultCurrentA
        });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isCaseFaultActive, isEarthConnected, isSafetyFuseBlown, safetyPhysics.faultCurrentA, triggerSound, onTelemetry]);

  // Play shock sound on touch
  useEffect(() => {
    if (isHumanTouching && safetyPhysics.shockCurrentMA > 10) {
      triggerSound('shock');
    }
  }, [isHumanTouching, safetyPhysics.shockCurrentMA, triggerSound]);

  // ==========================================
  // TAB 4 STATE: KCSE EXAM PRACTICE
  // ==========================================
  const [kcseIndex, setKcseIndex] = useState(0);
  const [userKcseAnswer, setUserKcseAnswer] = useState('');
  const [kcseFeedback, setKcseFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [showMarkingScheme, setShowMarkingScheme] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);

  const kcseQuestions = useMemo(() => [
    {
      id: 1,
      title: 'Cartridge Fuse Selection for Electric Cooker',
      question:
        'An electric cooker is rated 3.6 kW, 240 V. Given the standard domestic cartridge fuse ratings of 5 A, 13 A, 15 A, and 20 A, determine the normal operating current and select the most suitable fuse rating.',
      correctAnswer: '15',
      acceptedAnswers: ['15', '15A', '15 A'],
      solutionSteps: [
        { step: 'Formula', math: 'I = P / V', note: '[M1] Knwn power formula' },
        { step: 'Substitution', math: 'I = 3600 W / 240 V = 15.0 A', note: '[C1] Operating current' },
        { step: 'Selection', math: 'Next standard rating = 20 A or 15 A?', note: 'At exactly 15.0 A, normal running current would blow a 15 A fuse on warm-up surge. Hence 20 A (or 15 A slow-blow).' },
        { step: 'Final Answer', math: 'Operating Current = 15.0 A; Standard Fuse = 15 A (or 20 A rating)', note: '[A1] Correct specification' }
      ],
      didacticExplanation:
        'The fuse rating must always be slightly higher than the normal operating current so it does not blow during ordinary heating, but low enough to blow immediately during a fault or overload.'
    },
    {
      id: 2,
      title: 'Ring Main Circuit Branch Current Splitting',
      question:
        'A ring main circuit wired with 2.5 mm² copper cable delivers power to an immersion heater drawing 16.0 A, located at the midpoint of the ring. Calculate the current flowing through each half (leg) of the ring circuit from the consumer unit.',
      correctAnswer: '8',
      acceptedAnswers: ['8', '8A', '8 A', '8.0', '8.0A'],
      solutionSteps: [
        { step: 'Principle', math: 'Ring circuit divides current into two parallel paths: I_total = I_1 + I_2', note: '[M1] Parallel loop law' },
        { step: 'Symmetry', math: 'Since appliance is at midpoint, R_1 = R_2, so I_1 = I_2 = I_total / 2', note: '[C1] Current division' },
        { step: 'Calculation', math: 'I_leg = 16.0 A / 2 = 8.0 A', note: '[A1] 8.0 A per conductor leg' }
      ],
      didacticExplanation:
        'Because current divides into two paths, a 2.5 mm² cable rated at 20 A can comfortably support a total ring load of up to 32 A without overheating!'
    },
    {
      id: 3,
      title: 'Switch in Live Conductor Principle',
      question:
        'State what happens to the electric potential of an electric kettle heating element when its controlling switch is placed in the neutral wire and turned OFF. Enter the potential in Volts relative to Earth.',
      correctAnswer: '240',
      acceptedAnswers: ['240', '240V', '240 V', '+240'],
      solutionSteps: [
        { step: 'Principle', math: 'Switch in Neutral leaves Live line permanently connected to appliance.', note: '[M1] Circuit analysis' },
        { step: 'Open Circuit Potential', math: 'No current flows (open loop), so zero voltage drop across element: V_element = V_live = 240 V', note: '[C1] Equipotential' },
        { step: 'Safety Hazard', math: 'Element sits at 240 V. Anyone touching the element provides a path to Earth, suffering fatal shock!', note: '[A1] 240 V' }
      ],
      didacticExplanation:
        'Switches and fuses MUST ALWAYS be placed in the LIVE conductor so that opening the switch isolates the appliance completely from the high-voltage supply.'
    },
    {
      id: 4,
      title: 'Electricity Cost Calculation (kWh Billing)',
      question:
        'A domestic household uses a 2000 W electric kettle for 30 minutes daily and four 100 W light bulbs for 5 hours daily. Calculate the total energy consumed in kWh in a 30-day month.',
      correctAnswer: '90',
      acceptedAnswers: ['90', '90kWh', '90 kWh', '90.0'],
      solutionSteps: [
        { step: 'Kettle Energy/day', math: 'E_kettle = 2 kW × 0.5 h = 1.0 kWh', note: '[M1] P × t' },
        { step: 'Lighting Energy/day', math: 'E_lights = (4 × 0.1 kW) × 5 h = 2.0 kWh', note: '[M1] Summation' },
        { step: 'Daily Total', math: 'E_daily = 1.0 + 2.0 = 3.0 kWh / day', note: '[C1] Daily consumption' },
        { step: '30-Day Monthly Total', math: 'E_month = 3.0 kWh/day × 30 days = 90.0 kWh', note: '[A1] 90 kWh' }
      ],
      didacticExplanation:
        'Energy in kilowatt-hours (kWh) is the product of power in kilowatts and time in hours: E = P (kW) × t (h). Kenya Power bills domestic consumers per kWh unit.'
    }
  ], []);

  const handleCheckKcseAnswer = () => {
    const q = kcseQuestions[kcseIndex];
    const cleaned = userKcseAnswer.trim().toLowerCase().replace(/\s+/g, '');
    const isMatched = q.acceptedAnswers.some(
      (ans) => ans.toLowerCase().replace(/s+/g, '') === cleaned
    );

    if (isMatched) {
      setKcseFeedback('correct');
      triggerSound('click');
      setSolvedCount((c) => Math.max(c, kcseIndex + 1));
      onTelemetry?.({
        event: 'kcse_problem_correct',
        questionId: q.id,
        answer: userKcseAnswer
      });
    } else {
      setKcseFeedback('incorrect');
      triggerSound('shock');
      onTelemetry?.({
        event: 'kcse_problem_incorrect',
        questionId: q.id,
        answer: userKcseAnswer
      });
    }
  };

  // ==========================================
  // RESET ALL LAB PARAMETERS
  // ==========================================
  const handleReset = () => {
    triggerSound('click');
    setIsMainsSupplyOn(true);
    setIsMcbTripped(false);
    setIsRingBroken(false);
    setSockets([
      {
        id: 1,
        room: 'Kitchen',
        appliance: 'Electric Kettle',
        powerW: 2400,
        isOn: true,
        availableAppliances: [
          { name: 'Electric Kettle', powerW: 2400 },
          { name: 'Toaster', powerW: 1200 },
          { name: 'Blender', powerW: 400 },
          { name: 'Unplugged', powerW: 0 }
        ]
      },
      {
        id: 2,
        room: 'Living Room',
        appliance: 'Space Heater',
        powerW: 2000,
        isOn: true,
        availableAppliances: [
          { name: 'Space Heater', powerW: 2000 },
          { name: 'Smart TV & Soundbar', powerW: 250 },
          { name: 'Floor Lamp', powerW: 60 },
          { name: 'Unplugged', powerW: 0 }
        ]
      },
      {
        id: 3,
        room: 'Utility Room',
        appliance: 'Washing Machine',
        powerW: 1800,
        isOn: false,
        availableAppliances: [
          { name: 'Washing Machine', powerW: 1800 },
          { name: 'Electric Iron', powerW: 1200 },
          { name: 'Vacuum Cleaner', powerW: 1000 },
          { name: 'Unplugged', powerW: 0 }
        ]
      },
      {
        id: 4,
        room: 'Master Bedroom',
        appliance: 'Air Conditioner',
        powerW: 1500,
        isOn: false,
        availableAppliances: [
          { name: 'Air Conditioner', powerW: 1500 },
          { name: 'Hair Dryer', powerW: 1600 },
          { name: 'Phone Charger', powerW: 30 },
          { name: 'Unplugged', powerW: 0 }
        ]
      }
    ]);
    setSelectedPlugComponent('fuse');
    setWiringPreset('correct');
    setFuseRatingA(13);
    setTestAppliancePowerW(2400);
    setSwitchPosition('live');
    setIsApplianceSwitchedOn(false);
    setIsEarthConnected(true);
    setIsCaseFaultActive(false);
    setIsSafetyFuseBlown(false);
    setProbeLocation('element');
    setIsHumanTouching(false);
    setUserKcseAnswer('');
    setKcseFeedback(null);
    setShowMarkingScheme(false);

    onTelemetry?.({ event: 'reset_simulation' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6 space-y-4 md:space-y-6 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800/80 shadow-2xl font-sans">
      {/* 1. HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 md:p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 rounded-2xl border border-slate-800 shadow-inner">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              FORM 4 PHYSICS • TOPIC 6: MAINS ELECTRICITY
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              240 V AC DOMESTIC WIRING
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-amber-400 fill-amber-400/20" />
            Domestic Ring Main Circuit & Three-Pin Plug Wiring
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Investigate closed-loop ring main current splitting, explore BS 1363 three-pin plug internal anatomy with cartridge fuses, and verify why switches must be placed in the live wire to prevent fatal electric shock.
          </p>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center flex-wrap">
          {/* Mains Master Breaker Switch */}
          <button
            onClick={() => {
              triggerSound('click');
              setIsMainsSupplyOn(!isMainsSupplyOn);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              isMainsSupplyOn && !isMcbTripped
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 ring-2 ring-emerald-400/30'
                : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
            }`}
            title="Toggle Mains 240V AC Supply"
          >
            <Power className={`w-4 h-4 ${isMainsSupplyOn && !isMcbTripped ? 'text-emerald-200 animate-pulse' : 'text-rose-400'}`} />
            {isMainsSupplyOn && !isMcbTripped ? 'Mains: 240 V ON' : 'Mains: ISOLATED'}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-2 rounded-xl text-xs font-medium border transition-all ${
              !isAudioMuted
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isAudioMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
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
      <div className="flex items-center gap-1 sm:gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-x-auto">
        <button
          onClick={() => {
            triggerSound('click');
            setActiveTab('ring_main');
          }}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'ring_main'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 ring-1 ring-blue-400/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-4 h-4 text-cyan-300" />
          Ring Main Circuit & Dual Paths
        </button>

        <button
          onClick={() => {
            triggerSound('click');
            setActiveTab('three_pin_plug');
          }}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'three_pin_plug'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 ring-1 ring-blue-400/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-300" />
          Three-Pin Plug Anatomy & Wiring
        </button>

        <button
          onClick={() => {
            triggerSound('click');
            setActiveTab('safety_lab');
          }}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'safety_lab'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 ring-1 ring-blue-400/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Switch in Live & Earthing Safety Lab
        </button>

        <button
          onClick={() => {
            triggerSound('click');
            setActiveTab('kcse_practice');
          }}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'kcse_practice'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 ring-1 ring-blue-400/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          KCSE Exam Practice ({solvedCount}/4)
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: RING MAIN CIRCUIT EXPLORER */}
      {/* ========================================================================= */}
      {activeTab === 'ring_main' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Main Visualizer SVG (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl p-4 md:p-5 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
            {/* Top Status Badges */}
            <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Mains Supply: 240 V AC (50 Hz)
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  isRingBroken
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {isRingBroken ? 'Ring Loop: BROKEN (Radial Fault)' : 'Ring Loop: CLOSED (Dual Path)'}
                </span>
              </div>

              {isMcbTripped && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-black animate-bounce shadow-lg">
                  <AlertTriangle className="w-4 h-4" />
                  32A MCB BREAKER TRIPPED!
                </div>
              )}
            </div>

            {/* Interactive Ring Schematic Canvas/SVG */}
            <div className="w-full bg-slate-950 rounded-xl border border-slate-800 p-2 relative shadow-inner overflow-hidden">
              <svg viewBox="0 0 760 480" className="w-full h-auto select-none">
                <defs>
                  {/* Cable Glow Filters */}
                  <filter id="liveGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="liveCableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>

                {/* House Floorplan Gridlines */}
                <rect x="20" y="20" width="720" height="440" rx="16" fill="#0b1120" stroke="#1e293b" strokeWidth="2" strokeDasharray="6 4" />
                <text x="40" y="45" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="1">DOMESTIC RING FINAL CIRCUIT (BS 7671 / KEBS)</text>

                {/* Consumer Unit (Distribution Box at Bottom Center) */}
                <g transform="translate(300, 360)">
                  <rect x="0" y="0" width="160" height="85" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  <rect x="8" y="8" width="144" height="22" rx="4" fill="#0f172a" />
                  <text x="80" y="23" fill="#38bdf8" fontSize="10" fontWeight="800" textAnchor="middle">CONSUMER UNIT</text>
                  
                  {/* 32A MCB Breaker Visual */}
                  <rect
                    x="20"
                    y="36"
                    width="44"
                    height="38"
                    rx="4"
                    fill={isMcbTripped ? '#e11d48' : '#059669'}
                    className="cursor-pointer transition-all hover:brightness-110"
                    onClick={() => {
                      if (isMcbTripped) {
                        setIsMcbTripped(false);
                        triggerSound('click');
                      }
                    }}
                  />
                  <text x="42" y="52" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">32A</text>
                  <text x="42" y="66" fill="#ffffff" fontSize="8" fontWeight="700" textAnchor="middle">
                    {isMcbTripped ? 'TRIP' : 'MCB'}
                  </text>

                  {/* Master Switch */}
                  <rect
                    x="80"
                    y="36"
                    width="60"
                    height="38"
                    rx="4"
                    fill={isMainsSupplyOn ? '#0284c7' : '#475569'}
                    className="cursor-pointer hover:brightness-110"
                    onClick={() => {
                      setIsMainsSupplyOn(!isMainsSupplyOn);
                      triggerSound('click');
                    }}
                  />
                  <text x="110" y="52" fill="#ffffff" fontSize="8" fontWeight="800" textAnchor="middle">MAIN SW</text>
                  <text x="110" y="66" fill="#e0f2fe" fontSize="8" fontWeight="700" textAnchor="middle">
                    {isMainsSupplyOn ? '240V ON' : 'OFF'}
                  </text>
                </g>

                {/* THE RING LOOP CONDUCTORS */}
                {/* 1. Live Wire (Brown) Loop: CU(340,360) -> S1(120,300) -> S2(120,120) -> S3(640,120) -> S4(640,300) -> CU(420,360) */}
                {/* Leg 1 (Clockwise Path from CU to Sockets): */}
                <path
                  d="M 340 360 L 120 360 L 120 300 L 120 120 L 360 120"
                  fill="none"
                  stroke={isMainsSupplyOn && !isMcbTripped ? '#d97706' : '#64748b'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Leg 2 (Counter-Clockwise Path from CU to Sockets): */}
                {!isRingBroken ? (
                  <path
                    d="M 420 360 L 640 360 L 640 300 L 640 120 L 380 120"
                    fill="none"
                    stroke={isMainsSupplyOn && !isMcbTripped ? '#d97706' : '#64748b'}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                ) : (
                  // Broken at top middle
                  <g>
                    <path
                      d="M 420 360 L 640 360 L 640 300 L 640 120 L 410 120"
                      fill="none"
                      stroke={isMainsSupplyOn && !isMcbTripped ? '#d97706' : '#64748b'}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    {/* Severed Gap at X=380, Y=120 */}
                    <circle cx="370" cy="120" r="5" fill="#ef4444" />
                    <circle cx="400" cy="120" r="5" fill="#ef4444" />
                    <line x1="365" y1="110" x2="405" y2="130" stroke="#ef4444" strokeWidth="3" />
                    <text x="385" y="105" fill="#ef4444" fontSize="10" fontWeight="900" textAnchor="middle">BREAK!</text>
                  </g>
                )}

                {/* Top Bridge between S2 and S3 if intact */}
                {!isRingBroken && (
                  <line
                    x1="360"
                    y1="120"
                    x2="380"
                    y2="120"
                    stroke={isMainsSupplyOn && !isMcbTripped ? '#d97706' : '#64748b'}
                    strokeWidth="4"
                  />
                )}

                {/* 2. Neutral Wire (Blue) - Nested concentric path */}
                <path
                  d="M 330 360 L 105 360 L 105 105 L 655 105 L 655 360 L 430 360"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeOpacity="0.85"
                />

                {/* 3. Earth Wire (Green/Yellow striped) - Outer protective line */}
                <path
                  d="M 320 360 L 90 360 L 90 90 L 670 90 L 670 360 L 440 360"
                  fill="none"
                  stroke="#84cc16"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  strokeOpacity="0.9"
                />

                {/* Dynamic Current Flow Arrows / Particles */}
                {isMainsSupplyOn && !isMcbTripped && ringCalculations.totalCurrentA > 0 && (
                  <g>
                    {/* Clockwise Current Particles (Leg 1) */}
                    <circle
                      cx={340 - (animClock * 2.2) % 220}
                      cy="360"
                      r="4"
                      fill="#fef08a"
                      filter="url(#liveGlow)"
                    />
                    <circle
                      cx="120"
                      cy={360 - (animClock * 2.4) % 240}
                      r="4"
                      fill="#fef08a"
                      filter="url(#liveGlow)"
                    />

                    {/* Counter-Clockwise Current Particles (Leg 2) */}
                    {!isRingBroken && (
                      <>
                        <circle
                          cx={420 + (animClock * 2.2) % 220}
                          cy="360"
                          r="4"
                          fill="#fef08a"
                          filter="url(#liveGlow)"
                        />
                        <circle
                          cx="640"
                          cy={360 - (animClock * 2.4) % 240}
                          r="4"
                          fill="#fef08a"
                          filter="url(#liveGlow)"
                        />
                      </>
                    )}
                  </g>
                )}

                {/* 4 SOCKET NODES */}
                {/* SOCKET 1: Kitchen (Left Bottom: 120, 270) */}
                <g transform="translate(60, 220)">
                  <rect x="0" y="0" width="120" height="95" rx="8" fill="#111827" stroke={sockets[0].isOn ? '#38bdf8' : '#334155'} strokeWidth="1.5" />
                  <text x="60" y="18" fill="#94a3b8" fontSize="9" fontWeight="700" textAnchor="middle">SOCKET 1: KITCHEN</text>
                  <circle cx="45" cy="40" r="3" fill="#38bdf8" />
                  <circle cx="75" cy="40" r="3" fill="#d97706" />
                  <rect x="57" y="27" width="6" height="8" rx="1" fill="#84cc16" />
                  <text x="60" y="62" fill="#ffffff" fontSize="10" fontWeight="800" textAnchor="middle">{sockets[0].appliance}</text>
                  <text x="60" y="76" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">
                    {sockets[0].isOn && isMainsSupplyOn && !isMcbTripped ? `${sockets[0].powerW} W • ${(sockets[0].powerW / 240).toFixed(1)} A` : 'OFF / 0 W'}
                  </text>
                  <circle cx="15" cy="15" r="4" fill={sockets[0].isOn ? '#10b981' : '#64748b'} />
                </g>

                {/* SOCKET 2: Living Room (Left Top: 120, 90) */}
                <g transform="translate(180, 50)">
                  <rect x="0" y="0" width="130" height="95" rx="8" fill="#111827" stroke={sockets[1].isOn ? '#38bdf8' : '#334155'} strokeWidth="1.5" />
                  <text x="65" y="18" fill="#94a3b8" fontSize="9" fontWeight="700" textAnchor="middle">SOCKET 2: LIVING ROOM</text>
                  <circle cx="50" cy="40" r="3" fill="#38bdf8" />
                  <circle cx="80" cy="40" r="3" fill="#d97706" />
                  <rect x="62" y="27" width="6" height="8" rx="1" fill="#84cc16" />
                  <text x="65" y="62" fill="#ffffff" fontSize="10" fontWeight="800" textAnchor="middle">{sockets[1].appliance}</text>
                  <text x="65" y="76" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">
                    {sockets[1].isOn && isMainsSupplyOn && !isMcbTripped ? `${sockets[1].powerW} W • ${(sockets[1].powerW / 240).toFixed(1)} A` : 'OFF / 0 W'}
                  </text>
                  <circle cx="15" cy="15" r="4" fill={sockets[1].isOn ? '#10b981' : '#64748b'} />
                </g>

                {/* SOCKET 3: Utility Room (Right Top: 460, 50) */}
                <g transform="translate(450, 50)">
                  <rect x="0" y="0" width="130" height="95" rx="8" fill="#111827" stroke={sockets[2].isOn ? '#38bdf8' : '#334155'} strokeWidth="1.5" />
                  <text x="65" y="18" fill="#94a3b8" fontSize="9" fontWeight="700" textAnchor="middle">SOCKET 3: UTILITY</text>
                  <circle cx="50" cy="40" r="3" fill="#38bdf8" />
                  <circle cx="80" cy="40" r="3" fill="#d97706" />
                  <rect x="62" y="27" width="6" height="8" rx="1" fill="#84cc16" />
                  <text x="65" y="62" fill="#ffffff" fontSize="10" fontWeight="800" textAnchor="middle">{sockets[2].appliance}</text>
                  <text x="65" y="76" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">
                    {sockets[2].isOn && isMainsSupplyOn && !isMcbTripped ? `${sockets[2].powerW} W • ${(sockets[2].powerW / 240).toFixed(1)} A` : 'OFF / 0 W'}
                  </text>
                  <circle cx="15" cy="15" r="4" fill={sockets[2].isOn ? '#10b981' : '#64748b'} />
                </g>

                {/* SOCKET 4: Bedroom (Right Bottom: 580, 220) */}
                <g transform="translate(580, 220)">
                  <rect x="0" y="0" width="120" height="95" rx="8" fill="#111827" stroke={sockets[3].isOn ? '#38bdf8' : '#334155'} strokeWidth="1.5" />
                  <text x="60" y="18" fill="#94a3b8" fontSize="9" fontWeight="700" textAnchor="middle">SOCKET 4: BEDROOM</text>
                  <circle cx="45" cy="40" r="3" fill="#38bdf8" />
                  <circle cx="75" cy="40" r="3" fill="#d97706" />
                  <rect x="57" y="27" width="6" height="8" rx="1" fill="#84cc16" />
                  <text x="60" y="62" fill="#ffffff" fontSize="10" fontWeight="800" textAnchor="middle">{sockets[3].appliance}</text>
                  <text x="60" y="76" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">
                    {sockets[3].isOn && isMainsSupplyOn && !isMcbTripped ? `${sockets[3].powerW} W • ${(sockets[3].powerW / 240).toFixed(1)} A` : 'OFF / 0 W'}
                  </text>
                  <circle cx="15" cy="15" r="4" fill={sockets[3].isOn ? '#10b981' : '#64748b'} />
                </g>

                {/* Branch Current Indicators along the ring */}
                {/* Leg 1 (Clockwise) Ammeter */}
                <g transform="translate(200, 345)">
                  <rect x="0" y="0" width="80" height="28" rx="6" fill="#0f172a" stroke="#d97706" strokeWidth="1.5" />
                  <text x="40" y="12" fill="#fbbf24" fontSize="8" fontWeight="700" textAnchor="middle">LEG 1 (CW)</text>
                  <text x="40" y="24" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                    {ringCalculations.branch1CurrentA.toFixed(2)} A
                  </text>
                </g>

                {/* Leg 2 (Counter-Clockwise) Ammeter */}
                <g transform="translate(480, 345)">
                  <rect x="0" y="0" width="80" height="28" rx="6" fill="#0f172a" stroke="#d97706" strokeWidth="1.5" />
                  <text x="40" y="12" fill="#fbbf24" fontSize="8" fontWeight="700" textAnchor="middle">LEG 2 (CCW)</text>
                  <text x="40" y="24" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                    {ringCalculations.branch2CurrentA.toFixed(2)} A
                  </text>
                </g>

                {/* Wiring Legend Overlay */}
                <g transform="translate(30, 410)">
                  <line x1="0" y1="5" x2="20" y2="5" stroke="#d97706" strokeWidth="3" />
                  <text x="25" y="9" fill="#d97706" fontSize="9" fontWeight="700">Live (Brown, 240V)</text>

                  <line x1="130" y1="5" x2="150" y2="5" stroke="#0284c7" strokeWidth="2.5" />
                  <text x="155" y="9" fill="#38bdf8" fontSize="9" fontWeight="700">Neutral (Blue, 0V)</text>

                  <line x1="255" y1="5" x2="275" y2="5" stroke="#84cc16" strokeWidth="2" strokeDasharray="4 2" />
                  <text x="280" y="9" fill="#84cc16" fontSize="9" fontWeight="700">Earth (Green/Yellow)</text>
                </g>
              </svg>
            </div>

            {/* Verification Formula Footer */}
            <div className="mt-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-slate-400 font-mono">
                Parallel Splitting Law: <strong className="text-amber-400">I_total = I_1 + I_2</strong>
              </span>
              <span className="font-mono text-cyan-300">
                {ringCalculations.branch1CurrentA.toFixed(2)} A + {ringCalculations.branch2CurrentA.toFixed(2)} A = <strong className="text-white">{ringCalculations.totalCurrentA.toFixed(2)} A</strong>
              </span>
            </div>
          </div>

          {/* Right Control & Telemetry Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live Master Readings Card */}
            <div className="bg-slate-900/90 rounded-2xl p-4 md:p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Consumer Unit Telemetry
                </h3>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  ringCalculations.isOverloaded
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {ringCalculations.totalCurrentA.toFixed(1)} A / 32 A MCB
                </span>
              </div>

              {/* Progress Bar of Total Current vs 32A MCB */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Current Load on 32A MCB</span>
                  <span className="font-semibold text-slate-200">{((ringCalculations.totalCurrentA / 32) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      ringCalculations.totalCurrentA > 32
                        ? 'bg-rose-500 animate-pulse'
                        : ringCalculations.totalCurrentA > 24
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (ringCalculations.totalCurrentA / 32) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Meter Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 font-medium">Total Power Drawn</span>
                  <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
                    {(ringCalculations.totalActivePowerW / 1000).toFixed(2)} kW
                  </div>
                  <span className="text-[10px] text-slate-500">P = V × I</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 font-medium">Conductor Cross-Section</span>
                  <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
                    2.5 mm²
                  </div>
                  <span className="text-[10px] text-slate-500">Rated at ~20A per leg</span>
                </div>
              </div>

              {/* Ring Continuity Toggle Button */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Ring Integrity Experiment:</span>
                  <button
                    onClick={() => {
                      triggerSound('click');
                      setIsRingBroken(!isRingBroken);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isRingBroken
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isRingBroken ? 'Restore Ring Loop' : 'Simulate Severed Loop'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isRingBroken
                    ? '⚠️ Ring is severed! The circuit has degenerated into an overloaded radial circuit. All current flows through one leg, risking cable overheating and fire.'
                    : '✅ Ring is closed. Current divides in two directions, allowing thinner, cheaper 2.5 mm² cable to carry up to 32 A safely.'}
                </p>
              </div>

              {/* MCB Reset if Tripped */}
              {isMcbTripped && (
                <button
                  onClick={() => {
                    setIsMcbTripped(false);
                    triggerSound('click');
                  }}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Tripped 32A MCB Breaker
                </button>
              )}
            </div>

            {/* Individual Sockets Control Card */}
            <div className="bg-slate-900/90 rounded-2xl p-4 md:p-5 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                Socket Load Controls
              </h3>

              <div className="space-y-2.5">
                {sockets.map((s) => (
                  <div
                    key={s.id}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                      s.isOn
                        ? 'bg-slate-950/80 border-slate-700'
                        : 'bg-slate-950/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">{s.room}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {s.isOn ? `${s.powerW} W (${(s.powerW / 240).toFixed(1)} A)` : 'Turned Off'}
                        </span>
                      </div>
                      {/* Appliance Selector Dropdown */}
                      <select
                        value={s.appliance}
                        onChange={(e) => {
                          const chosen = s.availableAppliances.find((a) => a.name === e.target.value);
                          if (chosen) handleSelectAppliance(s.id, chosen);
                        }}
                        className="text-[11px] bg-slate-900 text-slate-300 border border-slate-700 rounded px-2 py-0.5 outline-none"
                      >
                        {s.availableAppliances.map((a) => (
                          <option key={a.name} value={a.name}>
                            {a.name} ({a.powerW} W)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Socket Switch Toggle */}
                    <button
                      onClick={() => handleToggleSocketPower(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        s.isOn
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {s.isOn ? 'ON' : 'OFF'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* KCSE Key Concept: Ring vs Radial */}
            <div className="p-4 bg-blue-950/30 rounded-2xl border border-blue-800/40 text-xs space-y-1.5 text-blue-200">
              <div className="flex items-center gap-1.5 font-bold text-blue-300">
                <Info className="w-4 h-4 text-cyan-400" />
                Why Use a Ring Main Circuit? (KCSE Syllabus)
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
                <li>
                  <strong className="text-white">Dual Current Paths:</strong> Each socket is fed from both sides of the ring, allowing thinner <code className="text-amber-300">2.5 mm²</code> cable instead of expensive <code className="text-amber-300">4.0–6.0 mm²</code> radial cable.
                </li>
                <li>
                  <strong className="text-white">Parallel Wiring:</strong> Every socket receives full <code className="text-cyan-300">240 V</code> and operates completely independently.
                </li>
                <li>
                  <strong className="text-white">Cost & Copper Economy:</strong> Greatly saves copper weight and installation costs across the entire building.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: THREE-PIN PLUG ANATOMY & WIRING */}
      {/* ========================================================================= */}
      {activeTab === 'three_pin_plug' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Detailed Vector Graphic of BS 1363 Plug (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl p-4 md:p-5 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                BS 1363 Standard 13-Amp Three-Pin Plug Interior
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-cyan-300 font-mono">
                Click any part to inspect
              </span>
            </div>

            {/* High-Fidelity Interactive Cutaway SVG */}
            <div className="w-full bg-slate-950 rounded-xl border border-slate-800 p-2 shadow-inner">
              <svg viewBox="0 0 600 520" className="w-full h-auto select-none">
                {/* Plug Outer Bakelite / Plastic Body Shell */}
                <path
                  d="M 160 80 Q 300 40 440 80 L 490 380 Q 300 480 110 380 Z"
                  fill="#18181b"
                  stroke="#3f3f46"
                  strokeWidth="4"
                />
                <text x="300" y="75" fill="#71717a" fontSize="11" fontWeight="800" textAnchor="middle" letterSpacing="1">
                  BS 1363 THREE-PIN PLUG
                </text>

                {/* 1. TOP PIN: EARTH PIN (E) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedPlugComponent('earth')}
                >
                  {/* Brass Earth Terminal & Pin (Longest Pin) */}
                  <rect
                    x="270"
                    y="75"
                    width="60"
                    height="55"
                    rx="4"
                    fill={selectedPlugComponent === 'earth' ? '#fbbf24' : '#d97706'}
                    stroke="#f59e0b"
                    strokeWidth={selectedPlugComponent === 'earth' ? '3' : '1.5'}
                  />
                  {/* Pin extension poking through casing */}
                  <rect x="285" y="40" width="30" height="35" rx="3" fill="#b45309" stroke="#fbbf24" strokeWidth="1" />
                  <circle cx="300" cy="102" r="6" fill="#78350f" stroke="#fde68a" strokeWidth="1.5" />
                  <text x="300" y="94" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">E</text>
                  <text x="300" y="122" fill="#ffffff" fontSize="7" fontWeight="800" textAnchor="middle">EARTH</text>
                </g>

                {/* 2. BOTTOM-LEFT PIN: NEUTRAL PIN (N) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedPlugComponent('neutral')}
                >
                  <rect
                    x="150"
                    y="250"
                    width="55"
                    height="50"
                    rx="4"
                    fill={selectedPlugComponent === 'neutral' ? '#60a5fa' : '#2563eb'}
                    stroke="#93c5fd"
                    strokeWidth={selectedPlugComponent === 'neutral' ? '3' : '1.5'}
                  />
                  <rect x="135" y="295" width="26" height="40" rx="3" fill="#1e40af" stroke="#60a5fa" strokeWidth="1" />
                  <circle cx="178" cy="275" r="5" fill="#1e3a8a" stroke="#dbeafe" strokeWidth="1.5" />
                  <text x="178" y="268" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">N</text>
                  <text x="178" y="292" fill="#ffffff" fontSize="7" fontWeight="800" textAnchor="middle">NEUTRAL</text>
                </g>

                {/* 3. BOTTOM-RIGHT PIN: LIVE PIN (L) & CARTRIDGE FUSE */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedPlugComponent('live')}
                >
                  <rect
                    x="395"
                    y="290"
                    width="55"
                    height="45"
                    rx="4"
                    fill={selectedPlugComponent === 'live' ? '#fb923c' : '#c2410c'}
                    stroke="#fdba74"
                    strokeWidth={selectedPlugComponent === 'live' ? '3' : '1.5'}
                  />
                  <rect x="440" y="295" width="26" height="40" rx="3" fill="#9a3412" stroke="#fb923c" strokeWidth="1" />
                  <circle cx="422" cy="312" r="5" fill="#7c2d12" stroke="#ffedd5" strokeWidth="1.5" />
                  <text x="422" y="305" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">L</text>
                  <text x="422" y="326" fill="#ffffff" fontSize="7" fontWeight="800" textAnchor="middle">LIVE</text>
                </g>

                {/* CARTRIDGE FUSE (Between terminal screw and Live pin) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedPlugComponent('fuse')}
                >
                  <rect
                    x="398"
                    y="200"
                    width="48"
                    height="80"
                    rx="6"
                    fill={selectedPlugComponent === 'fuse' ? '#f8fafc' : '#e2e8f0'}
                    stroke="#f59e0b"
                    strokeWidth={selectedPlugComponent === 'fuse' ? '3' : '1.5'}
                  />
                  {/* Metal End-Caps */}
                  <rect x="398" y="200" width="48" height="15" rx="2" fill="#94a3b8" />
                  <rect x="398" y="265" width="48" height="15" rx="2" fill="#94a3b8" />
                  <text x="422" y="238" fill="#0f172a" fontSize="10" fontWeight="900" textAnchor="middle">
                    {fuseRatingA} A
                  </text>
                  <text x="422" y="252" fill="#475569" fontSize="8" fontWeight="700" textAnchor="middle">
                    FUSE
                  </text>
                </g>

                {/* CABLE ENTRY & CORD GRIP AT BOTTOM */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedPlugComponent('grip')}
                >
                  {/* Cable Grip Clamp bar */}
                  <rect
                    x="240"
                    y="390"
                    width="120"
                    height="24"
                    rx="4"
                    fill={selectedPlugComponent === 'grip' ? '#e11d48' : '#334155'}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                  {/* Clamp Screws */}
                  <circle cx="255" cy="402" r="4" fill="#fbbf24" stroke="#78350f" />
                  <circle cx="345" cy="402" r="4" fill="#fbbf24" stroke="#78350f" />
                  <text x="300" y="406" fill="#f8fafc" fontSize="9" fontWeight="800" textAnchor="middle">
                    CABLE GRIP
                  </text>
                </g>

                {/* MAIN CABLE ENTERING */}
                {/* Outer Sheath */}
                {wiringPreset !== 'grip_on_cores' ? (
                  // Correct sheath clamped securely under grip
                  <path
                    d="M 270 380 L 270 480 L 330 480 L 330 380 Z"
                    fill="#09090b"
                    stroke="#52525b"
                    strokeWidth="2"
                  />
                ) : (
                  // Faulty stripped too far back
                  <path
                    d="M 270 425 L 270 480 L 330 480 L 330 425 Z"
                    fill="#09090b"
                    stroke="#52525b"
                    strokeWidth="2"
                  />
                )}

                {/* INTERNAL WIRES ROUTING */}
                {/* 1. Earth Conductor (Green & Yellow stripes with generous slack loop) */}
                <g onClick={() => setSelectedPlugComponent('slack')} className="cursor-pointer">
                  {wiringPreset !== 'no_earth' && (
                    <path
                      d="M 300 385 C 310 320, 240 240, 250 180 C 255 145, 280 140, 300 115"
                      fill="none"
                      stroke="#84cc16"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                  )}
                  {wiringPreset !== 'no_earth' && (
                    <path
                      d="M 300 385 C 310 320, 240 240, 250 180 C 255 145, 280 140, 300 115"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="9"
                      strokeDasharray="14 12"
                      strokeLinecap="round"
                    />
                  )}
                </g>

                {/* 2. Neutral Wire (Blue) */}
                <path
                  d={
                    wiringPreset === 'reversed_live_neutral'
                      ? 'M 310 385 C 330 330, 360 270, 420 200' // Goes to LIVE pin incorrectly
                      : 'M 290 385 C 270 330, 230 310, 180 275' // Goes to NEUTRAL correctly
                  }
                  fill="none"
                  stroke={wiringPreset === 'reversed_live_neutral' ? '#d97706' : '#0284c7'}
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* 3. Live Wire (Brown) */}
                <path
                  d={
                    wiringPreset === 'reversed_live_neutral'
                      ? 'M 290 385 C 270 330, 230 310, 180 275' // Goes to NEUTRAL incorrectly
                      : 'M 310 385 C 330 330, 360 270, 420 200' // Goes to FUSE & LIVE correctly
                  }
                  fill="none"
                  stroke={wiringPreset === 'reversed_live_neutral' ? '#0284c7' : '#d97706'}
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Component Highlight Callout Marker */}
                {selectedPlugComponent === 'earth' && (
                  <circle cx="300" cy="102" r="18" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 3" className="animate-spin" />
                )}
                {selectedPlugComponent === 'fuse' && (
                  <rect x="394" y="195" width="56" height="90" rx="8" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 3" />
                )}
              </svg>
            </div>

            {/* Quick Wire Color Mnemonic Bar */}
            <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-around flex-wrap gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <span className="w-3 h-3 rounded-full bg-amber-600 inline-block" />
                b<strong className="underline decoration-amber-400">R</strong>ow<strong className="underline decoration-amber-400">n</strong> = <strong className="text-white">R</strong>ight (Live)
              </span>
              <span className="flex items-center gap-1.5 text-blue-300 font-bold">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                b<strong className="underline decoration-blue-400">L</strong>ue = <strong className="text-white">L</strong>eft (Neutral)
              </span>
              <span className="flex items-center gap-1.5 text-lime-300 font-bold">
                <span className="w-3 h-3 rounded-full bg-lime-500 inline-block" />
                Green/Yellow = Top (Earth)
              </span>
            </div>
          </div>

          {/* Component Details & Interactive Wiring Sandbox (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Component Inspector Card */}
            <div className="bg-slate-900/90 rounded-2xl p-4 md:p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  Plug Component Inspector
                </h3>
                <span className="text-[10px] text-slate-400 font-mono uppercase">
                  {selectedPlugComponent}
                </span>
              </div>

              {/* Inspector Content Switching */}
              {selectedPlugComponent === 'earth' && (
                <div className="p-3 bg-slate-950 rounded-xl border border-lime-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-lime-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    Top Earth Pin (E) & Green/Yellow Conductor
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white">Why is the Earth pin the longest?</strong>
                  </p>
                  <ol className="list-decimal list-inside text-[11px] text-slate-300 space-y-1 leading-relaxed">
                    <li>
                      <strong className="text-lime-300">Safety First:</strong> It connects the metal chassis to Earth <em className="text-white">before</em> the live and neutral pins make electrical contact.
                    </li>
                    <li>
                      <strong className="text-lime-300">Socket Shutter Release:</strong> In BS 1363 sockets, the longer earth pin pushes open the internal spring-loaded safety shutters covering the Live and Neutral holes!
                    </li>
                  </ol>
                </div>
              )}

              {selectedPlugComponent === 'fuse' && (
                <div className="p-3 bg-slate-950 rounded-xl border border-amber-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Flame className="w-4 h-4" />
                    Cartridge Fuse (Placed in LIVE Line)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A ceramic tube enclosing a thin tinned copper wire. It protects the appliance cord from overheating.
                  </p>
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div>• Standard ratings: <strong className="text-white">3 A, 5 A, 13 A</strong>.</div>
                    <div>• Placed <strong className="text-amber-300">strictly in the Live pin</strong> so blowing the fuse cuts off 240V supply to the entire appliance!</div>
                  </div>
                </div>
              )}

              {selectedPlugComponent === 'live' && (
                <div className="p-3 bg-slate-950 rounded-xl border border-orange-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                    <Zap className="w-4 h-4" />
                    Live Pin (Bottom-Right, Brown Wire)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Carries high alternating voltage (+240 V rms relative to Earth). It connects directly to the cartridge fuse terminal.
                  </p>
                </div>
              )}

              {selectedPlugComponent === 'neutral' && (
                <div className="p-3 bg-slate-950 rounded-xl border border-blue-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    Neutral Pin (Bottom-Left, Blue Wire)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Completes the electrical circuit back to the substation. Held at approximately 0 V potential under normal operation.
                  </p>
                </div>
              )}

              {selectedPlugComponent === 'grip' && (
                <div className="p-3 bg-slate-950 rounded-xl border border-rose-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4" />
                    Cable Grip (Cord Clamp)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Two screws hold a clamping bar over the <strong className="text-white">outer insulating jacket</strong>.
                  </p>
                  <p className="text-[11px] text-rose-300 leading-relaxed">
                    CRITICAL SAFETY RULE: The grip must clamp the outer sheath, NEVER bare inner cores. This ensures any tug on the cord cannot pull wires out of the terminal screws.
                  </p>
                </div>
              )}

              {selectedPlugComponent === 'slack' && (
                <div className="p-3 bg-slate-950 rounded-xl border border-lime-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-lime-400 font-bold text-xs">
                    <Shield className="w-4 h-4" />
                    Deliberate Earth Wire Slack Loop
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The green/yellow earth wire is intentionally cut longer than live and neutral wires.
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    If the cord is yanked forcefully, Live and Neutral will snap first, while Earth stays connected till the very end, preventing electric shock!
                  </p>
                </div>
              )}
            </div>

            {/* Interactive Wiring Diagnostic Sandbox */}
            <div className="bg-slate-900/90 rounded-2xl p-4 md:p-5 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Wiring Quality & Safety Diagnostics
              </h3>

              {/* Preset Selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Test Wiring Scenarios:</label>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <button
                    onClick={() => {
                      triggerSound('click');
                      setWiringPreset('correct');
                      setFuseRatingA(13);
                    }}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      wiringPreset === 'correct'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <div className="font-bold">1. BS 1363 Standard (Correctly Wired)</div>
                    <div className="text-[10px] text-slate-500">Brown to Live/Fuse, Blue to Neutral, Earth connected, Outer sheath clamped.</div>
                  </button>

                  <button
                    onClick={() => {
                      triggerSound('click');
                      setWiringPreset('reversed_live_neutral');
                    }}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      wiringPreset === 'reversed_live_neutral'
                        ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <div className="font-bold">2. Reversed Live & Neutral (Severe Hazard)</div>
                    <div className="text-[10px] text-slate-500">Brown to Neutral, Blue to Live. Switches & fuses end up in Neutral line!</div>
                  </button>

                  <button
                    onClick={() => {
                      triggerSound('click');
                      setWiringPreset('no_earth');
                    }}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      wiringPreset === 'no_earth'
                        ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <div className="font-bold">3. Earth Wire Disconnected / Missing</div>
                    <div className="text-[10px] text-slate-500">Appliance metal casing left ungrounded.</div>
                  </button>

                  <button
                    onClick={() => {
                      triggerSound('click');
                      setWiringPreset('grip_on_cores');
                    }}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      wiringPreset === 'grip_on_cores'
                        ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <div className="font-bold">4. Cord Grip Clamped on Inner Cores</div>
                    <div className="text-[10px] text-slate-500">Outer sheath stripped too short. Clamp abrades individual wires.</div>
                  </button>
                </div>
              </div>

              {/* Fuse Selection Slider */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Cartridge Fuse Rating:</span>
                  <span className="font-mono font-bold text-amber-400">{fuseRatingA} A</span>
                </div>
                <div className="flex gap-2">
                  {[3, 5, 13].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {
                        triggerSound('click');
                        setFuseRatingA(rating);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        fuseRatingA === rating
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      {rating} A Fuse
                    </button>
                  ))}
                </div>
              </div>

              {/* Diagnostic Verdict Alert */}
              <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                plugDiagnostics.isSafe
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center gap-1.5 font-bold">
                  {plugDiagnostics.isSafe ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      WIRING VERIFIED: 100% BS 1363 COMPLIANT
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      SAFETY HAZARD DETECTED!
                    </>
                  )}
                </div>

                {plugDiagnostics.errors.map((err, idx) => (
                  <div key={idx} className="text-[11px] text-rose-200">
                    <strong>{err.title}</strong>: {err.desc}
                  </div>
                ))}

                {plugDiagnostics.warnings.map((warn, idx) => (
                  <div key={idx} className="text-[11px] text-amber-200">
                    <strong>{warn.title}</strong>: {warn.desc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SWITCH IN LIVE & EARTHING SAFETY LAB */}
      {/* ========================================================================= */}
      {activeTab === 'safety_lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Main Appliance Circuit Schematic (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl p-4 md:p-5 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Appliance Electrical Isolation & Fault Circuit
              </span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  switchPosition === 'live'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  Switch in: {switchPosition.toUpperCase()}
                </span>
                {isSafetyFuseBlown && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white animate-pulse">
                    FUSE BLOWN!
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Schematic Diagram SVG */}
            <div className="w-full bg-slate-950 rounded-xl border border-slate-800 p-2 shadow-inner">
              <svg viewBox="0 0 680 400" className="w-full h-auto select-none">
                {/* 1. AC Supply Terminals (Left Side) */}
                <g transform="translate(30, 80)">
                  <circle cx="20" cy="40" r="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  <path d="M 13 40 Q 17 33 20 40 Q 23 47 27 40" fill="none" stroke="#38bdf8" strokeWidth="2" />
                  <text x="20" y="70" fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">240V AC</text>
                  <text x="20" y="82" fill="#64748b" fontSize="8" textAnchor="middle">50 Hz</text>
                </g>

                {/* Terminals */}
                <circle cx="80" cy="100" r="6" fill="#d97706" />
                <text x="75" y="90" fill="#f59e0b" fontSize="10" fontWeight="900" textAnchor="end">LIVE (240V)</text>

                <circle cx="80" cy="220" r="6" fill="#0284c7" />
                <text x="75" y="235" fill="#38bdf8" fontSize="10" fontWeight="900" textAnchor="end">NEUTRAL (0V)</text>

                <circle cx="80" cy="320" r="6" fill="#84cc16" />
                <text x="75" y="335" fill="#84cc16" fontSize="10" fontWeight="900" textAnchor="end">EARTH (0V)</text>

                {/* 2. Top Conductor (Live Path) */}
                {/* Before Switch */}
                <line
                  x1="80"
                  y1="100"
                  x2="170"
                  y2="100"
                  stroke={!isSafetyFuseBlown ? '#d97706' : '#64748b'}
                  strokeWidth="4"
                />

                {/* Fuse Representation */}
                <rect
                  x="170"
                  y="92"
                  width="40"
                  height="16"
                  rx="3"
                  fill={isSafetyFuseBlown ? '#334155' : '#e2e8f0'}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                {!isSafetyFuseBlown ? (
                  <line x1="174" y1="100" x2="206" y2="100" stroke="#b45309" strokeWidth="2" />
                ) : (
                  // Melted wire
                  <g>
                    <line x1="174" y1="100" x2="186" y2="100" stroke="#ef4444" strokeWidth="2" />
                    <line x1="194" y1="100" x2="206" y2="100" stroke="#ef4444" strokeWidth="2" />
                    <circle cx="190" cy="100" r="2" fill="#ef4444" />
                  </g>
                )}
                <text x="190" y="85" fill="#94a3b8" fontSize="8" fontWeight="700" textAnchor="middle">13A FUSE</text>

                {/* Line from Fuse to Switch/Appliance */}
                <line
                  x1="210"
                  y1="100"
                  x2="260"
                  y2="100"
                  stroke={!isSafetyFuseBlown ? '#d97706' : '#64748b'}
                  strokeWidth="4"
                />

                {/* SWITCH IN LIVE POSITION */}
                {switchPosition === 'live' ? (
                  <g transform="translate(260, 100)">
                    <circle cx="0" cy="0" r="4" fill="#ffffff" />
                    <circle cx="45" cy="0" r="4" fill="#ffffff" />
                    {isApplianceSwitchedOn ? (
                      <line x1="0" y1="0" x2="45" y2="0" stroke="#10b981" strokeWidth="3.5" />
                    ) : (
                      <line x1="0" y1="0" x2="38" y2="-22" stroke="#ef4444" strokeWidth="3.5" />
                    )}
                    <text x="22" y="-14" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">
                      {isApplianceSwitchedOn ? 'SW ON' : 'SW OFF'}
                    </text>
                  </g>
                ) : (
                  // Direct wire if switch is placed in Neutral
                  <line x1="260" y1="100" x2="305" y2="100" stroke="#d97706" strokeWidth="4" />
                )}

                {/* Line entering Kettle Element */}
                <line
                  x1="305"
                  y1="100"
                  x2="380"
                  y2="100"
                  stroke={
                    safetyPhysics.vAfterSwitch > 0
                      ? '#ef4444' // Lethal energized red
                      : '#64748b' // Dead safe
                  }
                  strokeWidth="4"
                />

                {/* 3. APPLIANCE ENCLOSURE (ELECTRIC KETTLE) */}
                <g transform="translate(380, 50)">
                  {/* Metal Chassis */}
                  <rect
                    x="0"
                    y="0"
                    width="190"
                    height="210"
                    rx="14"
                    fill="#111827"
                    stroke={
                      safetyPhysics.vCase > 50
                        ? '#ef4444'
                        : isCaseFaultActive
                        ? '#f59e0b'
                        : '#38bdf8'
                    }
                    strokeWidth={safetyPhysics.vCase > 50 ? '3.5' : '2'}
                    strokeDasharray={safetyPhysics.vCase > 50 ? '8 4' : 'none'}
                    className={safetyPhysics.vCase > 50 ? 'animate-pulse' : ''}
                  />
                  <text x="95" y="24" fill="#ffffff" fontSize="10" fontWeight="800" textAnchor="middle">
                    METAL CASING ({safetyPhysics.vCase.toFixed(0)} V)
                  </text>

                  {/* Heating Element Resistor Coil Inside */}
                  <path
                    d="M 20 50 L 50 50 L 60 70 L 80 30 L 100 70 L 120 30 L 130 50 L 160 50 L 160 120 L 130 120 L 120 140 L 100 100 L 80 140 L 60 100 L 50 120 L 20 120"
                    fill="none"
                    stroke={
                      safetyPhysics.elementGlow
                        ? '#f59e0b' // Glowing orange heating
                        : safetyPhysics.vElement > 0
                        ? '#ef4444' // Lethal voltage!
                        : '#64748b'
                    }
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <text x="95" y="165" fill="#94a3b8" fontSize="9" fontWeight="700" textAnchor="middle">
                    HEATING ELEMENT (24 Ω)
                  </text>
                  <text x="95" y="180" fill={safetyPhysics.elementGlow ? '#fbbf24' : '#64748b'} fontSize="8" fontWeight="800" textAnchor="middle">
                    {safetyPhysics.elementGlow ? '2400 W • HEATING ACTIVE' : 'ELEMENT COLD'}
                  </text>

                  {/* Fault Contact Point Toggle (Internal Live Wire touching Casing) */}
                  {isCaseFaultActive && (
                    <g transform="translate(20, 50)">
                      <line x1="0" y1="0" x2="-20" y2="-30" stroke="#ef4444" strokeWidth="3" />
                      <circle cx="-20" cy="-30" r="5" fill="#ef4444" />
                      <text x="-22" y="-36" fill="#ef4444" fontSize="8" fontWeight="900" textAnchor="end">INSULATION FAULT!</text>
                    </g>
                  )}
                </g>

                {/* 4. Bottom Conductor (Neutral Return) */}
                <line
                  x1="380"
                  y1="220"
                  x2="305"
                  y2="220"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                />

                {/* SWITCH IN NEUTRAL POSITION (If selected) */}
                {switchPosition === 'neutral' ? (
                  <g transform="translate(260, 220)">
                    <circle cx="0" cy="0" r="4" fill="#ffffff" />
                    <circle cx="45" cy="0" r="4" fill="#ffffff" />
                    {isApplianceSwitchedOn ? (
                      <line x1="0" y1="0" x2="45" y2="0" stroke="#10b981" strokeWidth="3.5" />
                    ) : (
                      <line x1="0" y1="0" x2="38" y2="-22" stroke="#ef4444" strokeWidth="3.5" />
                    )}
                    <text x="22" y="-14" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">
                      {isApplianceSwitchedOn ? 'SW ON' : 'SW OFF'}
                    </text>
                  </g>
                ) : (
                  <line x1="260" y1="220" x2="305" y2="220" stroke="#0284c7" strokeWidth="3.5" />
                )}

                <line x1="80" y1="220" x2="260" y2="220" stroke="#0284c7" strokeWidth="3.5" />

                {/* 5. Earth Wire Connection to Casing */}
                {isEarthConnected ? (
                  <path
                    d="M 80 320 L 475 320 L 475 260"
                    fill="none"
                    stroke="#84cc16"
                    strokeWidth="3"
                    strokeDasharray="6 3"
                  />
                ) : (
                  // Broken Earth
                  <g>
                    <path
                      d="M 80 320 L 250 320"
                      fill="none"
                      stroke="#84cc16"
                      strokeWidth="3"
                      strokeDasharray="6 3"
                    />
                    <circle cx="250" cy="320" r="4" fill="#ef4444" />
                    <text x="280" y="323" fill="#ef4444" fontSize="9" fontWeight="800">EARTH DISCONNECTED</text>
                  </g>
                )}

                {/* 6. Human Body Touch Simulation Probe */}
                <g
                  transform="translate(600, 130)"
                  className="cursor-pointer group"
                  onClick={() => setIsHumanTouching(!isHumanTouching)}
                >
                  <circle
                    cx="0"
                    cy="0"
                    r="20"
                    fill={isHumanTouching ? (safetyPhysics.isLethal ? '#ef4444' : '#10b981') : '#334155'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Person icon silhouette */}
                  <circle cx="0" cy="-6" r="5" fill="#ffffff" />
                  <path d="M -8 12 C -8 4, 8 4, 8 12 Z" fill="#ffffff" />
                  <text x="0" y="34" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">
                    {isHumanTouching ? 'TOUCHING' : 'CLICK TO TOUCH'}
                  </text>
                </g>

                {/* Touch connection wire to selected probe location */}
                {isHumanTouching && (
                  <line
                    x1="600"
                    y1="130"
                    x2={probeLocation === 'case' ? 570 : 480}
                    y2={probeLocation === 'case' ? 140 : 100}
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                )}
              </svg>
            </div>

            {/* Readout Bar */}
            <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Probe Potential</span>
                <div className={`font-mono font-black text-base ${safetyPhysics.probeVoltage > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {safetyPhysics.probeVoltage.toFixed(0)} V
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Human Shock Current</span>
                <div className={`font-mono font-black text-base ${safetyPhysics.shockCurrentMA > 10 ? 'text-rose-500 animate-pulse' : 'text-slate-200'}`}>
                  {safetyPhysics.shockCurrentMA.toFixed(1)} mA
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Safety Assessment</span>
                <div className={`font-bold text-xs mt-1 ${safetyPhysics.isLethal ? 'text-rose-500' : 'text-emerald-400'}`}>
                  {safetyPhysics.isLethal ? '⚡ LETHAL SHOCK!' : 'SAFE (0V Dead)'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Control & Diagnostics Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Switch & Earthing Control Card */}
            <div className="bg-slate-900/90 rounded-2xl p-4 md:p-5 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-400" />
                Laboratory Controls
              </h3>

              {/* Switch Location Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Switch Location in Circuit:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      triggerSound('click');
                      setSwitchPosition('live');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      switchPosition === 'live'
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    Switch in LIVE (Safe)
                  </button>

                  <button
                    onClick={() => {
                      triggerSound('click');
                      setSwitchPosition('neutral');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      switchPosition === 'neutral'
                        ? 'bg-rose-600/30 border-rose-500 text-rose-300 shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    Switch in NEUTRAL (Fatal)
                  </button>
                </div>
              </div>

              {/* Appliance Switch Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Appliance Switch State:</span>
                <button
                  onClick={() => {
                    triggerSound('click');
                    setIsApplianceSwitchedOn(!isApplianceSwitchedOn);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isApplianceSwitchedOn
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                  }`}
                >
                  {isApplianceSwitchedOn ? 'Kettle ON' : 'Kettle OFF'}
                </button>
              </div>

              {/* Fault Condition Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Fault Conditions:</span>

                {/* Case Fault Toggle */}
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-xs">
                    <div className="font-bold text-slate-200">Insulation Breakdown</div>
                    <div className="text-[10px] text-slate-400">Live touches metal casing</div>
                  </div>
                  <button
                    onClick={() => {
                      triggerSound('click');
                      setIsCaseFaultActive(!isCaseFaultActive);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isCaseFaultActive
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {isCaseFaultActive ? 'Fault ACTIVE' : 'Normal'}
                  </button>
                </div>

                {/* Earth Wire Toggle */}
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-xs">
                    <div className="font-bold text-slate-200">Earth Conductor</div>
                    <div className="text-[10px] text-slate-400">Chassis grounding</div>
                  </div>
                  <button
                    onClick={() => {
                      triggerSound('click');
                      setIsEarthConnected(!isEarthConnected);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isEarthConnected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {isEarthConnected ? 'Earth CONNECTED' : 'Earth BROKEN'}
                  </button>
                </div>
              </div>

              {/* Replace Blown Fuse Button if Blown */}
              {isSafetyFuseBlown && (
                <button
                  onClick={() => {
                    triggerSound('click');
                    setIsSafetyFuseBlown(false);
                    setIsCaseFaultActive(false);
                  }}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Replace Blown 13A Fuse & Clear Fault
                </button>
              )}
            </div>

            {/* Core Syllabus Lesson Card */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Why Switch in Live Wire is Mandatory (KCSE Key Law)
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                When a switch is connected in the <strong className="text-white">neutral wire</strong>, opening the switch stops the current so the appliance appears off. However, the entire internal heating element remains connected directly to the <strong className="text-rose-400">240 V live terminal</strong>!
              </p>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                If a person cleans or touches the element, current completes a path through their body directly to Earth (<strong className="text-rose-400">240 mA shock</strong>), causing ventricular fibrillation and instant death.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: KCSE EXAM PRACTICE */}
      {/* ========================================================================= */}
      {activeTab === 'kcse_practice' && (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="bg-slate-900/90 rounded-2xl p-4 md:p-6 border border-slate-800 space-y-4">
            {/* Question Header & Navigation */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  QUESTION {kcseIndex + 1} OF {kcseQuestions.length}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {kcseQuestions[kcseIndex].title}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    triggerSound('click');
                    setKcseIndex((idx) => Math.max(0, idx - 1));
                    setUserKcseAnswer('');
                    setKcseFeedback(null);
                    setShowMarkingScheme(false);
                  }}
                  disabled={kcseIndex === 0}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    triggerSound('click');
                    setKcseIndex((idx) => Math.min(kcseQuestions.length - 1, idx + 1));
                    setUserKcseAnswer('');
                    setKcseFeedback(null);
                    setShowMarkingScheme(false);
                  }}
                  disabled={kcseIndex === kcseQuestions.length - 1}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Question Body */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 leading-relaxed font-serif">
              {kcseQuestions[kcseIndex].question}
            </div>

            {/* User Input & Submission */}
            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="text"
                value={userKcseAnswer}
                onChange={(e) => setUserKcseAnswer(e.target.value)}
                placeholder="Enter numerical answer..."
                className="flex-1 min-w-[200px] px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-700 focus:border-cyan-400 outline-none text-sm font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCheckKcseAnswer();
                }}
              />
              <button
                onClick={handleCheckKcseAnswer}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
              >
                Check Answer
              </button>
              <button
                onClick={() => setShowMarkingScheme(!showMarkingScheme)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
              >
                {showMarkingScheme ? 'Hide Marking Scheme' : 'View KNEC Scheme'}
              </button>
            </div>

            {/* Instant Feedback Banner */}
            {kcseFeedback === 'correct' && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>EXCELLENT! Correct numerical answer and units verified against KNEC syllabus.</span>
              </div>
            )}

            {kcseFeedback === 'incorrect' && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl flex items-center gap-2 text-rose-300 text-xs font-bold">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>INCORRECT. Check your formula substitution or units. Click &quot;View KNEC Scheme&quot; for full derivation.</span>
              </div>
            )}

            {/* Detailed KNEC Step-by-Step Marking Scheme */}
            {showMarkingScheme && (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Official KNEC Examination Marking Scheme
                </div>

                <div className="space-y-2 text-xs">
                  {kcseQuestions[kcseIndex].solutionSteps.map((s, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="font-bold text-cyan-300 mr-2">{s.step}:</span>
                        <code className="text-amber-200 font-mono text-xs">{s.math}</code>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-bold">
                        {s.note}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-blue-950/30 rounded-lg border border-blue-900/40 text-[11px] text-slate-300">
                  <strong className="text-blue-300">Examiner Note:</strong> {kcseQuestions[kcseIndex].didacticExplanation}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. SIMULATION FOOTER METADATA */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400">
        <div>
          VizLearn Domestic Electrical Engineering Lab • Meets KSCE Physics Form 4 Topic 6 Syllabus Requirements.
        </div>
        <div className="flex items-center gap-3">
          <span>BS 1363 Plug Compliance</span>
          <span>•</span>
          <span>BS 7671 Ring Final Rules</span>
        </div>
      </div>
    </div>
  );
}
