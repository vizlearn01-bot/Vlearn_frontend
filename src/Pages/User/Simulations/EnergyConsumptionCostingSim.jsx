import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Zap,
  RotateCcw,
  Power,
  Volume2,
  VolumeX,
  Clock,
  Sliders,
  DollarSign,
  Receipt,
  Tv,
  Flame,
  Lightbulb,
  Disc,
  Gauge,
  CheckCircle2,
  XCircle,
  Info,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Calculator,
  ShieldAlert,
  Eye,
  Plus,
  Trash2,
  Play,
  Pause,
  FastForward,
  Sun,
  AlertTriangle,
  Layers,
  BatteryCharging
} from 'lucide-react';

/**
 * Sound Synthesizer for Electricity Meter (Mechanical Disc Tick & Digital Pulses)
 */
class MeterAudioSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  // Mechanical tick when induction disc passes marker or odometer clicks
  playTick() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch {
      // Audio context policy guard
    }
  }

  // Optical pulse chirp for digital smart meter
  playChirp() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.025);
    } catch {
      // Audio context policy guard
    }
  }

  // Low balance alarm beep
  playAlarm() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {
      // Audio context policy guard
    }
  }
}

// Initial Preset Household Appliances
const DEFAULT_APPLIANCES = [
  {
    id: 'cooker',
    name: 'Electric Cooker / Oven',
    ratedWatts: 3000,
    dailyHours: 1.5,
    active: false,
    dutyCycle: 1.0,
    category: 'cooking',
    icon: 'Flame',
    typicalUse: 'Stove burner and oven for boiling and roasting'
  },
  {
    id: 'geyser',
    name: 'Electric Water Heater (Geyser)',
    ratedWatts: 2000,
    dailyHours: 2.0,
    active: true,
    dutyCycle: 1.0,
    category: 'heating',
    icon: 'Flame',
    typicalUse: 'Immersion heating element for bathroom showers'
  },
  {
    id: 'kettle',
    name: 'Electric Jug Kettle',
    ratedWatts: 2200,
    dailyHours: 0.5,
    active: false,
    dutyCycle: 1.0,
    category: 'cooking',
    icon: 'Zap',
    typicalUse: 'Rapid water boiling (typically KCSE exam appliance)'
  },
  {
    id: 'iron',
    name: 'Electric Iron Box',
    ratedWatts: 1200,
    dailyHours: 0.75,
    active: false,
    dutyCycle: 0.8,
    category: 'heating',
    icon: 'Sliders',
    typicalUse: 'Dry/steam clothes pressing with bimetallic thermostat'
  },
  {
    id: 'microwave',
    name: 'Microwave Oven',
    ratedWatts: 800,
    dailyHours: 0.5,
    active: false,
    dutyCycle: 1.0,
    category: 'cooking',
    icon: 'Zap',
    typicalUse: 'Food warming and defrosting via 2.45 GHz waves'
  },
  {
    id: 'fridge',
    name: 'Refrigerator (Auto-Cycle)',
    ratedWatts: 250,
    dailyHours: 24.0,
    active: true,
    dutyCycle: 0.4, // Compressor runs ~40% of the day = 9.6 effective hours
    category: 'cooling',
    icon: 'BatteryCharging',
    typicalUse: 'Compressor cycles on/off via thermostat (40% duty cycle)'
  },
  {
    id: 'tv',
    name: 'Television & Decoder',
    ratedWatts: 100,
    dailyHours: 5.0,
    active: true,
    dutyCycle: 1.0,
    category: 'entertainment',
    icon: 'Tv',
    typicalUse: '55" LED TV & Digital TV decoder set-top box'
  },
  {
    id: 'led_bulbs',
    name: 'LED Lighting (5 bulbs × 15W)',
    ratedWatts: 75,
    dailyHours: 6.0,
    active: true,
    dutyCycle: 1.0,
    category: 'lighting',
    icon: 'Lightbulb',
    typicalUse: 'Living room, kitchen, bedroom, security perimeter'
  }
];

// KCSE Exam Practice Calculation Bank with Step-by-Step Marking Schemes
const KCSE_PRACTICE_PROBLEMS = [
  {
    id: 'kcse_2019_p2',
    year: 'KCSE 2019 Paper 2 (Mains Energy)',
    title: 'Commercial Energy Unit Conversion: kWh to Joules',
    scenario:
      'A domestic electricity meter recorded a total energy consumption of 4.5 kWh during a weekend. Calculate the equivalent quantity of electrical energy consumed in Joules, expressing your answer in scientific notation (e.g. 1.62e7 or 16200000 J).',
    targetValue: 16200000,
    tolerance: 100000,
    unit: 'Joules (J)',
    hint: 'Recall the definition: 1 kWh = 1000 Watts × 3600 seconds = 3.6 × 10⁶ Joules. Multiply 4.5 by 3.6 × 10⁶.',
    markingScheme: [
      {
        mark: 'C1',
        description: 'Formula for commercial unit definition: E (J) = E (kWh) × 1000 W/kW × 3600 s/h = E × 3.6 × 10⁶ J'
      },
      {
        mark: 'M1',
        description: 'Direct substitution: E = 4.5 kWh × (3.6 × 10⁶ J/kWh)'
      },
      {
        mark: 'A1',
        description: 'Correct evaluation with units: E = 16,200,000 J = 1.62 × 10⁷ Joules (or 16.2 MJ)'
      }
    ],
    examinerNote:
      'Many students lose the A1 mark by multiplying by 60 instead of 3600 s for the hour conversion, or writing units as Watts instead of Joules.'
  },
  {
    id: 'kcse_2021_p2',
    year: 'KCSE 2021 Paper 2 (Utility Costing)',
    title: 'Multi-Appliance Monthly Electricity Costing',
    scenario:
      'A household uses a 2.5 kW electric cooker for 2 hours daily, a 1.2 kW iron box for 1 hour daily, and four 60 W incandescent light bulbs for 5 hours daily. If the electricity utility charges a flat tariff of KES 18.00 per kWh plus a fixed monthly standing charge of KES 150.00, calculate the total electricity bill for a 30-day month (in KES).',
    targetValue: 4146.0,
    tolerance: 20.0,
    unit: 'KES',
    hint: 'Calculate daily energy for each appliance: Cooker = 2.5 × 2 = 5 kWh; Iron = 1.2 × 1 = 1.2 kWh; Bulbs = 4 × (60/1000) × 5 = 1.2 kWh. Sum daily energy, multiply by 30 days, then calculate cost = (kWh × 18) + 150.',
    markingScheme: [
      {
        mark: 'M1',
        description:
          'Daily Energy Cooker = 2.5 kW × 2 h = 5.0 kWh; Iron = 1.2 kW × 1 h = 1.2 kWh; Bulbs = 4 × 0.060 kW × 5 h = 1.2 kWh'
      },
      {
        mark: 'M1',
        description:
          'Total Daily Energy = 5.0 + 1.2 + 1.2 = 7.4 kWh/day. Monthly Energy (30 days) = 7.4 × 30 = 222.0 kWh'
      },
      {
        mark: 'M1',
        description:
          'Base Consumption Cost = 222 kWh × KES 18.00 = KES 3,996.00'
      },
      {
        mark: 'A1',
        description:
          'Total Monthly Bill = KES 3,996.00 + KES 150.00 standing charge = KES 4,146.00'
      }
    ],
    examinerNote:
      'Always check whether the power of bulbs is given in Watts or Kilowatts. Dividing Watts by 1000 is critical before multiplying by hours!'
  },
  {
    id: 'kcse_2016_p2',
    year: 'KCSE 2016 Paper 2 (Rating Plate & Fuses)',
    title: 'Operating Current & Appropriate Fuse Rating Selection',
    scenario:
      'An electric immersion heater is labeled "240 V, 2880 W". Calculate the normal operating current (in Amperes) drawn from the mains supply, and state the minimum standard fuse rating needed from the options: 5 A, 10 A, 13 A, 15 A, 30 A (enter the operating current in Amperes, e.g. 12.0).',
    targetValue: 12.0,
    tolerance: 0.1,
    unit: 'Amperes (A)',
    hint: 'Use the formula P = V × I. Therefore, I = P / V. Substitute 2880 W and 240 V. For fuse selection, the fuse must exceed operating current slightly (next standard rating above 12 A is 13 A).',
    markingScheme: [
      {
        mark: 'C1',
        description: 'Formula: P = V × I  =>  I = P / V'
      },
      {
        mark: 'M1',
        description: 'Substitution: I = 2880 W / 240 V'
      },
      {
        mark: 'A1',
        description: 'Operating current: I = 12.0 A'
      },
      {
        mark: 'B1',
        description:
          'Fuse selection deduction: The fuse rating must be slightly higher than normal operating current so it does not melt during normal use. Recommended fuse = 13 A.'
      }
    ],
    examinerNote:
      'Never recommend a 10 A fuse for a 12 A appliance (it would blow immediately upon power up), and never recommend an excessively high fuse like 30 A (it fails to protect the cable from fire hazards).'
  },
  {
    id: 'kcse_2018_p2',
    year: 'KCSE 2018 Paper 2 (Voltage Fluctuation)',
    title: 'Non-Linear Power Drop During Mains Brownout',
    scenario:
      'An electric heating element rated 240 V, 2000 W has a constant electrical resistance R. During an evening power brownout, the supply voltage drops by 15% to 204 V. Calculate the new actual power dissipated by the heating element (in Watts).',
    targetValue: 1445.0,
    tolerance: 5.0,
    unit: 'Watts (W)',
    hint: 'First find resistance R = V² / P = (240)² / 2000 = 28.8 Ω. Then new power P₂ = (V₂)² / R = (204)² / 28.8, OR use scaling: P₂ = P₁ × (V₂/V₁)² = 2000 × (0.85)².',
    markingScheme: [
      {
        mark: 'C1',
        description: 'Resistance of element: R = V₁² / P₁ = 240² / 2000 = 57600 / 2000 = 28.8 Ω'
      },
      {
        mark: 'M1',
        description: 'New power dissipation at 204 V: P₂ = V₂² / R = (204)² / 28.8 = 41616 / 28.8'
      },
      {
        mark: 'A1',
        description: 'P₂ = 1445.0 W (A massive 27.75% power drop from a 15% voltage reduction!)'
      }
    ],
    examinerNote:
      'A common student blunder is assuming power drops linearly with voltage (e.g. 2000 × 0.85 = 1700 W). Because P = V² / R, power drops with the SQUARE of voltage!'
  },
  {
    id: 'kcse_2015_p2',
    year: 'KCSE 2015 Paper 2 (Thermal Energy & Heating Time)',
    title: 'Electric Kettle Efficiency & Boiling Duration',
    scenario:
      'An electric kettle rated 2200 W operates at 85% thermal efficiency (15% heat lost to surroundings). It is used to heat 1.5 kg of water from 20°C to boiling point at 100°C (Specific heat capacity of water c = 4200 J/kg·K). Calculate the time taken in seconds (round to nearest whole second).',
    targetValue: 270.0,
    tolerance: 3.0,
    unit: 'seconds (s)',
    hint: 'Thermal heat required Q = m × c × Δθ = 1.5 × 4200 × (100 - 20) = 504,000 J. Useful electric power = P × efficiency = 2200 × 0.85 = 1870 W. Time t = Q / P_useful.',
    markingScheme: [
      {
        mark: 'M1',
        description:
          'Heat absorbed by water: Q = m · c · Δθ = 1.5 kg × 4200 J/kg·K × (100 - 20) K = 504,000 Joules'
      },
      {
        mark: 'M1',
        description:
          'Useful power available: P_useful = P × η = 2200 W × 0.85 = 1870 Watts (J/s)'
      },
      {
        mark: 'A1',
        description:
          'Heating time: t = Q / P_useful = 504,000 / 1870 ≈ 269.5 seconds ≈ 270 seconds (~4.5 minutes)'
      }
    ],
    examinerNote:
      'Students frequently forget to account for the 85% efficiency factor, dividing 504,000 by 2200 directly to get 229s, which loses both M1 and A1 marks.'
  }
];

export default function EnergyConsumptionCostingSim({ config = {}, onTelemetry }) {
  // ==========================================
  // TOP-LEVEL NAVIGATION TABS
  // ==========================================
  // 'appliances': Virtual House Appliance Controller
  // 'meter': Ferraris Induction Disc & Digital Smart Meter
  // 'billing': Kenya Power Utility Bill & Tariff Breakdown
  // 'kcse': KCSE Exam Practice Calculation Lab
  const [activeTab, setActiveTab] = useState('appliances');

  // Global Lab Switches
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const audioSynthRef = useRef(null);

  useEffect(() => {
    audioSynthRef.current = new MeterAudioSynth();
  }, []);

  // ==========================================
  // 1. MODULE 1 STATE: APPLIANCE CONTROLLER
  // ==========================================
  const [appliances, setAppliances] = useState(DEFAULT_APPLIANCES);
  const [gridVoltage, setGridVoltage] = useState(240); // Nominal 240V AC (Kenya Standard)
  const [customName, setCustomName] = useState('');
  const [customWatts, setCustomWatts] = useState(500);
  const [customHours, setCustomHours] = useState(2.0);

  // ==========================================
  // 2. MODULE 2 STATE: ELECTRICITY METER BENCH
  // ==========================================
  const [meterType, setMeterType] = useState('induction'); // 'induction' | 'smart'
  const [meterConstantK, setMeterConstantK] = useState(600); // 600 revs/kWh standard
  const [simSpeed, setSimSpeed] = useState(60); // 1x, 60x, 3600x
  const [accumulatedKwh, setAccumulatedKwh] = useState(1428.5); // Initial odometer reading
  const [discAngle, setDiscAngle] = useState(0); // in radians [0, 2*PI]
  const [smartTokenUnits, setSmartTokenUnits] = useState(45.0); // Prepaid kWh balance
  const [tokenInputCode, setTokenInputCode] = useState('');
  const [tokenFeedbackMsg, setTokenFeedbackMsg] = useState('');
  const [isSimRunning, setIsSimRunning] = useState(true);
  const [pulseLedActive, setPulseLedActive] = useState(false);
  const pulseTimerRef = useRef(0);

  // ==========================================
  // 3. MODULE 3 STATE: KPLC UTILITY BILLING
  // ==========================================
  const [tariffMode, setTariffMode] = useState('tiered'); // 'tiered' (KPLC EPRA) | 'flat' (KCSE text)
  const [flatRatePerKwh, setFlatRatePerKwh] = useState(20.0); // KES/kWh
  const [fuelCostCharge, setFuelCostCharge] = useState(4.6); // FCC KES/kWh
  const [forexAdjustment, setForexAdjustment] = useState(1.25); // Forex KES/kWh
  const [standingCharge, setStandingCharge] = useState(0.0); // Fixed charge
  const [vatRate] = useState(0.16); // 16% VAT
  const [epraLevy] = useState(0.08); // EPRA KES/kWh
  const [warmaLevy] = useState(0.02); // WARMA KES/kWh
  const [inflationAdj] = useState(0.38); // Inflation KES/kWh
  const [repLevyRate] = useState(0.05); // 5% REP on base energy
  const [solarWaterHeaterAdopted, setSolarWaterHeaterAdopted] = useState(false);

  // ==========================================
  // 4. MODULE 4 STATE: KCSE PRACTICE PROBLEMS
  // ==========================================
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState(null); // 'correct' | 'incorrect' | null
  const [showSolution, setShowSolution] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState({});

  // ==========================================
  // PHYSICS CALCULATIONS ENGINE
  // ==========================================
  // Voltage scaling factor (non-linear P = V² / R)
  // For resistive loads: P_actual = P_rated * (V_grid / 240)^2
  const voltageRatio = gridVoltage / 240.0;
  const voltageSquareFactor = Math.pow(voltageRatio, 2);

  // Calculate Instantaneous Total Power (Watts & kW)
  const activeAppliances = useMemo(() => {
    return appliances.map((app) => {
      // If solar water heater is adopted, geyser is effectively 0 W
      const isGeyserReplaced = solarWaterHeaterAdopted && app.id === 'geyser';
      const actualRated = isGeyserReplaced ? 0 : app.ratedWatts;
      // Actual instantaneous watts dissipated at current grid voltage
      const actualInstantWatts = app.active && isPowerOn ? actualRated * voltageSquareFactor : 0;
      // Daily effective hours accounting for duty cycle
      const effectiveDailyHours = isGeyserReplaced ? 0 : app.dailyHours * (app.dutyCycle || 1.0);
      // Daily energy in kWh
      const dailyKwh = (actualRated * effectiveDailyHours) / 1000.0;
      // Normal operating current at 240V: I = P / V
      const normalCurrent = actualRated / 240.0;
      // Actual operating current at grid voltage: I = P_actual / V_grid = (V_grid / R)
      const actualCurrent = actualInstantWatts > 0 && gridVoltage > 0 ? actualInstantWatts / gridVoltage : 0;
      // Resistance: R = V_rated^2 / P_rated
      const resistance = actualRated > 0 ? Math.pow(240, 2) / actualRated : Infinity;

      return {
        ...app,
        actualInstantWatts,
        dailyKwh,
        effectiveDailyHours,
        normalCurrent,
        actualCurrent,
        resistance
      };
    });
  }, [appliances, gridVoltage, isPowerOn, voltageSquareFactor, solarWaterHeaterAdopted]);

  // Aggregate Instantaneous Totals
  const totalInstantWatts = useMemo(() => {
    return activeAppliances.reduce((sum, a) => sum + a.actualInstantWatts, 0);
  }, [activeAppliances]);

  const totalInstantKw = totalInstantWatts / 1000.0;

  // Aggregate Mains Current
  const totalMainsCurrent = useMemo(() => {
    if (!isPowerOn || gridVoltage <= 0) return 0;
    return totalInstantWatts / gridVoltage;
  }, [isPowerOn, gridVoltage, totalInstantWatts]);

  // Recommended Consumer Unit Main Fuse / Breaker Rating
  const recommendedFuseRating = useMemo(() => {
    if (totalMainsCurrent <= 4) return '5 A (Lighting / Minor Circuit)';
    if (totalMainsCurrent <= 12) return '13 A (Standard 3-Pin Socket)';
    if (totalMainsCurrent <= 18) return '20 A (Dedicated Water Heater / Radials)';
    if (totalMainsCurrent <= 28) return '30 A / 32 A (Ring Main / Small Cooker)';
    if (totalMainsCurrent <= 42) return '45 A (High Power Cooker Unit)';
    return '60 A / 100 A (Main Consumer Cutout Fuse)';
  }, [totalMainsCurrent]);

  // Aggregate Daily and Monthly Energy Consumption
  const totalDailyKwh = useMemo(() => {
    return activeAppliances.reduce((sum, a) => sum + a.dailyKwh, 0);
  }, [activeAppliances]);

  const totalMonthlyKwh = totalDailyKwh * 30.0;
  const totalMonthlyMegaJoules = totalMonthlyKwh * 3.6;

  // Disc RPM Calculation:
  // 1 kWh = K revolutions => 1 kW running for 1 hour = K revolutions
  // RPM = (Power in kW * K) / 60
  const discRpm = useMemo(() => {
    if (!isPowerOn || totalInstantKw <= 0) return 0;
    return (totalInstantKw * meterConstantK) / 60.0;
  }, [isPowerOn, totalInstantKw, meterConstantK]);

  // Optical pulse frequency (smart meter: 1000 imp/kWh)
  const smartImpPulseHz = useMemo(() => {
    if (!isPowerOn || totalInstantKw <= 0) return 0;
    // 1000 pulses per kWh => pulses per second = (1000 * kW) / 3600
    return (1000.0 * totalInstantKw) / 3600.0;
  }, [isPowerOn, totalInstantKw]);

  // ==========================================
  // KPLC BILLING ENGINE CALCULATIONS
  // ==========================================
  const billingBreakdown = useMemo(() => {
    const kwh = totalMonthlyKwh;
    let baseEnergyCost = 0;
    const tierDetails = [];

    if (tariffMode === 'flat') {
      baseEnergyCost = kwh * flatRatePerKwh;
      tierDetails.push({
        label: `Flat Tariff (${flatRatePerKwh.toFixed(2)} KES/kWh)`,
        units: kwh,
        rate: flatRatePerKwh,
        amount: baseEnergyCost
      });
    } else {
      // Kenya Power EPRA Approved Domestic Tariff Tiers:
      // Tier 1: Lifeline (0 - 30 kWh) @ KES 12.50 / kWh
      // Tier 2: Ordinary Domestic 1 (31 - 100 kWh) @ KES 16.50 / kWh
      // Tier 3: Ordinary Domestic 2 (> 100 kWh) @ KES 20.97 / kWh
      if (kwh <= 30) {
        const cost1 = kwh * 12.5;
        baseEnergyCost += cost1;
        tierDetails.push({
          label: 'Lifeline Tier 1 (0-30 kWh)',
          units: kwh,
          rate: 12.5,
          amount: cost1
        });
      } else if (kwh <= 100) {
        const cost1 = 30 * 12.5;
        const units2 = kwh - 30;
        const cost2 = units2 * 16.5;
        baseEnergyCost = cost1 + cost2;
        tierDetails.push({
          label: 'Lifeline Tier 1 (1st 30 kWh)',
          units: 30,
          rate: 12.5,
          amount: cost1
        });
        tierDetails.push({
          label: 'Ordinary Tier 1 (31-100 kWh)',
          units: units2,
          rate: 16.5,
          amount: cost2
        });
      } else {
        const cost1 = 30 * 12.5;
        const cost2 = 70 * 16.5;
        const units3 = kwh - 100;
        const cost3 = units3 * 20.97;
        baseEnergyCost = cost1 + cost2 + cost3;
        tierDetails.push({
          label: 'Lifeline Tier 1 (1st 30 kWh)',
          units: 30,
          rate: 12.5,
          amount: cost1
        });
        tierDetails.push({
          label: 'Ordinary Tier 1 (Next 70 kWh)',
          units: 70,
          rate: 16.5,
          amount: cost2
        });
        tierDetails.push({
          label: 'Ordinary Tier 2 (>100 kWh)',
          units: units3,
          rate: 20.97,
          amount: cost3
        });
      }
    }

    // Levies & Adjustments
    const fuelCostTotal = kwh * fuelCostCharge;
    const forexTotal = kwh * forexAdjustment;
    const epraTotal = kwh * epraLevy;
    const warmaTotal = kwh * warmaLevy;
    const inflationTotal = kwh * inflationAdj;
    const repTotal = baseEnergyCost * repLevyRate; // 5% REP levy on base energy

    // Taxable Subtotal before VAT
    const taxableSubtotal =
      baseEnergyCost +
      fuelCostTotal +
      forexTotal +
      epraTotal +
      warmaTotal +
      inflationTotal +
      repTotal +
      standingCharge;

    const vatTotal = taxableSubtotal * vatRate;
    const grandTotal = taxableSubtotal + vatTotal;
    const effectiveCostPerKwh = kwh > 0 ? grandTotal / kwh : 0;

    return {
      kwh,
      baseEnergyCost,
      tierDetails,
      fuelCostTotal,
      forexTotal,
      epraTotal,
      warmaTotal,
      inflationTotal,
      repTotal,
      standingCharge,
      taxableSubtotal,
      vatTotal,
      grandTotal,
      effectiveCostPerKwh
    };
  }, [
    totalMonthlyKwh,
    tariffMode,
    flatRatePerKwh,
    fuelCostCharge,
    forexAdjustment,
    standingCharge,
    vatRate,
    epraLevy,
    warmaLevy,
    inflationAdj,
    repLevyRate
  ]);

  // ==========================================
  // ANIMATION LOOP FOR METERS & ACCUMULATION
  // ==========================================
  const lastTimeRef = useRef(performance.now());
  const tickAccumulatorRef = useRef(0);

  useEffect(() => {
    let animId;

    const updatePhysics = (now) => {
      const deltaSec = Math.min((now - lastTimeRef.current) / 1000.0, 0.1);
      lastTimeRef.current = now;

      if (isSimRunning && isPowerOn && totalInstantKw > 0) {
        // Rotational advancement: dTheta = omega * dt * simSpeed
        // omega = (2 * PI * discRpm) / 60 = (2 * PI * totalInstantKw * K) / 3600
        const omega = (2 * Math.PI * totalInstantKw * meterConstantK) / 3600.0;
        const dTheta = omega * deltaSec * simSpeed;

        setDiscAngle((prev) => {
          const next = (prev + dTheta) % (2 * Math.PI);
          // Check if crossed the top marker (0 or 2PI)
          if (prev > 5.8 && next < 1.0) {
            if (!isAudioMuted && audioSynthRef.current) {
              audioSynthRef.current.playTick();
            }
          }
          return next;
        });

        // Energy accumulation: dKwh = (kW * dt_seconds * simSpeed) / 3600
        const dKwh = (totalInstantKw * deltaSec * simSpeed) / 3600.0;

        setAccumulatedKwh((prev) => prev + dKwh);

        // Smart meter token depletion
        setSmartTokenUnits((prev) => {
          const rem = Math.max(0, prev - dKwh);
          if (rem <= 10.0 && prev > 10.0 && !isAudioMuted && audioSynthRef.current) {
            audioSynthRef.current.playAlarm();
          }
          return rem;
        });

        // Smart meter optical pulse blinking
        tickAccumulatorRef.current += deltaSec * simSpeed;
        const pulseIntervalSec = smartImpPulseHz > 0 ? 1.0 / (smartImpPulseHz * simSpeed) : Infinity;
        if (tickAccumulatorRef.current >= Math.max(0.1, pulseIntervalSec)) {
          tickAccumulatorRef.current = 0;
          setPulseLedActive(true);
          if (!isAudioMuted && meterType === 'smart' && audioSynthRef.current) {
            audioSynthRef.current.playChirp();
          }
          pulseTimerRef.current = setTimeout(() => {
            setPulseLedActive(false);
          }, 60);
        }
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => {
      cancelAnimationFrame(animId);
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, [
    isSimRunning,
    isPowerOn,
    totalInstantKw,
    meterConstantK,
    simSpeed,
    isAudioMuted,
    meterType,
    smartImpPulseHz
  ]);

  // Fast-Forward helpers
  const handleFastForwardDay = () => {
    const addedKwh = totalDailyKwh;
    setAccumulatedKwh((prev) => prev + addedKwh);
    setSmartTokenUnits((prev) => Math.max(0, prev - addedKwh));
    if (!isAudioMuted && audioSynthRef.current) {
      audioSynthRef.current.playTick();
    }
  };

  const handleFastForwardMonth = () => {
    const addedKwh = totalMonthlyKwh;
    setAccumulatedKwh((prev) => prev + addedKwh);
    setSmartTokenUnits((prev) => Math.max(0, prev - addedKwh));
    if (!isAudioMuted && audioSynthRef.current) {
      audioSynthRef.current.playTick();
    }
  };

  // Appliance control handlers
  const toggleAppliance = (id) => {
    setAppliances((prev) =>
      prev.map((app) => (app.id === id ? { ...app, active: !app.active } : app))
    );
  };

  const handleHoursChange = (id, newHours) => {
    setAppliances((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, dailyHours: Math.max(0.1, Math.min(24.0, parseFloat(newHours))) } : app
      )
    );
  };

  const handleAddCustomAppliance = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const newApp = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      ratedWatts: Math.max(10, Math.min(10000, parseFloat(customWatts) || 100)),
      dailyHours: Math.max(0.1, Math.min(24.0, parseFloat(customHours) || 1.0)),
      active: true,
      dutyCycle: 1.0,
      category: 'custom',
      icon: 'Zap',
      typicalUse: 'Custom user defined load'
    };
    setAppliances((prev) => [...prev, newApp]);
    setCustomName('');
  };

  const handleRemoveAppliance = (id) => {
    setAppliances((prev) => prev.filter((a) => a.id !== id));
  };

  // Quick Preset Profiles
  const applyPresetProfile = (type) => {
    if (type === 'eco') {
      setAppliances((prev) =>
        prev.map((app) => {
          if (app.id === 'fridge') return { ...app, active: true, dailyHours: 24.0 };
          if (app.id === 'tv') return { ...app, active: true, dailyHours: 3.0 };
          if (app.id === 'led_bulbs') return { ...app, active: true, dailyHours: 4.0 };
          return { ...app, active: false };
        })
      );
    } else if (type === 'average') {
      setAppliances(DEFAULT_APPLIANCES);
    } else if (type === 'heavy') {
      setAppliances((prev) =>
        prev.map((app) => ({
          ...app,
          active: true,
          dailyHours: app.id === 'geyser' ? 4.0 : app.id === 'cooker' ? 3.0 : app.dailyHours
        }))
      );
    } else if (type === 'off') {
      setAppliances((prev) => prev.map((app) => ({ ...app, active: false })));
    }
  };

  // Smart Meter Prepaid Token Entry
  const handleRechargeToken = (kWhAmount) => {
    setSmartTokenUnits((prev) => prev + kWhAmount);
    setTokenFeedbackMsg(`SUCCESS: Token loaded! +${kWhAmount.toFixed(1)} kWh added to balance.`);
    if (!isAudioMuted && audioSynthRef.current) {
      audioSynthRef.current.playChirp();
    }
    setTimeout(() => setTokenFeedbackMsg(''), 4000);
  };

  const handleTokenKeypadPress = (digit) => {
    if (tokenInputCode.length < 20) {
      setTokenInputCode((prev) => prev + digit);
    }
  };

  const handleTokenBackspace = () => {
    setTokenInputCode((prev) => prev.slice(0, -1));
  };

  const handleTokenSubmit = () => {
    if (tokenInputCode.length === 20) {
      // Simulate token redemption (e.g. 50 kWh token)
      handleRechargeToken(50.0);
      setTokenInputCode('');
    } else {
      setTokenFeedbackMsg('ERROR: 20-digit STS Kenya Power token required!');
      setTimeout(() => setTokenFeedbackMsg(''), 3000);
    }
  };

  // Reset entire simulation to initial laboratory defaults
  const handleResetLab = () => {
    setAppliances(DEFAULT_APPLIANCES);
    setGridVoltage(240);
    setMeterType('induction');
    setMeterConstantK(600);
    setSimSpeed(60);
    setAccumulatedKwh(1428.5);
    setDiscAngle(0);
    setSmartTokenUnits(45.0);
    setIsPowerOn(true);
    setTariffMode('tiered');
    setFlatRatePerKwh(20.0);
    setFuelCostCharge(4.6);
    setForexAdjustment(1.25);
    setSolarWaterHeaterAdopted(false);
    setUserAnswer('');
    setAnswerStatus(null);
    setShowSolution(false);
    setTokenFeedbackMsg('');
    if (onTelemetry) {
      onTelemetry('sim_reset', { sim: 'energy_consumption_costing_meter' });
    }
  };

  // KCSE Question Handlers
  const currentProblem = KCSE_PRACTICE_PROBLEMS[currentProblemIdx];

  const handleCheckKcseAnswer = (e) => {
    e.preventDefault();
    const val = parseFloat(userAnswer.trim().replace(/,/g, ''));
    if (isNaN(val)) return;

    const diff = Math.abs(val - currentProblem.targetValue);
    if (diff <= currentProblem.tolerance) {
      setAnswerStatus('correct');
      setSolvedProblems((prev) => ({ ...prev, [currentProblem.id]: true }));
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
    setCurrentProblemIdx((prev) => (prev + 1) % KCSE_PRACTICE_PROBLEMS.length);
    setUserAnswer('');
    setAnswerStatus(null);
    setShowSolution(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-5 md:p-6 space-y-6 text-slate-100 font-sans antialiased">
      {/* 1. TOP HEADER & TELEMETRY TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Zap className="w-3.5 h-3.5" /> Form 4 Physics • Topic 6: Mains Electricity
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Lesson 251: Power, Energy & Utility Billing
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Electrical Energy Metering & Utility Costing Simulator
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-3xl">
            Explore commercial kilowatt-hours (1 kWh = 3.6 × 10⁶ J), rotating induction disc meter mechanics (ω ∝ P), digital smart meter tokens, and Kenya Power multi-tier utility bill breakdowns.
          </p>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center flex-wrap">
          {/* Mains Power Switch */}
          <button
            onClick={() => setIsPowerOn(!isPowerOn)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isPowerOn
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 ring-2 ring-emerald-400/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
            }`}
            title="Toggle Mains 240V Supply"
          >
            <Power className={`w-4 h-4 ${isPowerOn ? 'text-emerald-200 animate-pulse' : 'text-slate-500'}`} />
            {isPowerOn ? 'Mains 240V Live' : 'Mains Cutoff'}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-2 rounded-xl text-xs font-medium border transition-all ${
              !isAudioMuted
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isAudioMuted ? 'Unmute Mechanical & Smart Meter Sounds' : 'Mute Sounds'}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset System */}
          <button
            onClick={handleResetLab}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all active:scale-95"
            title="Reset All Parameters to Default"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            Reset Lab
          </button>
        </div>
      </div>

      {/* 2. REAL-TIME TELEMETRY METRIC RIBBON */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Instantaneous Power */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Power (P)</span>
          <div className="text-lg sm:text-xl font-black text-cyan-400 mt-0.5">
            {totalInstantWatts >= 1000 ? `${(totalInstantWatts / 1000).toFixed(2)} kW` : `${Math.round(totalInstantWatts)} W`}
          </div>
          <span className="text-[10px] text-slate-500 block">P = V × I</span>
        </div>

        {/* Mains Current */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mains Current (I)</span>
          <div className="text-lg sm:text-xl font-black text-amber-400 mt-0.5">
            {totalMainsCurrent.toFixed(2)} A
          </div>
          <span className="text-[10px] text-slate-500 block">I = P / V</span>
        </div>

        {/* Grid Voltage */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mains Voltage (V)</span>
          <div className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">
            {gridVoltage} V AC
          </div>
          <span className="text-[10px] text-slate-500 block">50 Hz Standard</span>
        </div>

        {/* Daily Energy */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daily Energy</span>
          <div className="text-lg sm:text-xl font-black text-purple-400 mt-0.5">
            {totalDailyKwh.toFixed(2)} kWh
          </div>
          <span className="text-[10px] text-slate-500 block">{(totalDailyKwh * 3.6).toFixed(1)} MJ / day</span>
        </div>

        {/* 30-Day Monthly Energy */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Units</span>
          <div className="text-lg sm:text-xl font-black text-blue-400 mt-0.5">
            {totalMonthlyKwh.toFixed(1)} kWh
          </div>
          <span className="text-[10px] text-slate-500 block">30 Billing Days</span>
        </div>

        {/* Estimated Monthly Bill */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Bill</span>
          <div className="text-lg sm:text-xl font-black text-rose-400 mt-0.5">
            KES {Math.round(billingBreakdown.grandTotal).toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 block">Incl. levies & 16% VAT</span>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-x-auto">
        <button
          onClick={() => setActiveTab('appliances')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'appliances'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-4 h-4 text-cyan-300" />
          Virtual Household Appliance Controller
        </button>

        <button
          onClick={() => setActiveTab('meter')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'meter'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Disc className="w-4 h-4 text-amber-300" />
          Induction Disc & Digital Smart Meter
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'billing'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Receipt className="w-4 h-4 text-emerald-300" />
          KPLC Utility Bill & Tariff Breakdown
        </button>

        <button
          onClick={() => setActiveTab('kcse')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'kcse'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Calculator className="w-4 h-4 text-purple-300" />
          KCSE Practice Lab ({Object.keys(solvedProblems).length}/{KCSE_PRACTICE_PROBLEMS.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: VIRTUAL HOUSEHOLD APPLIANCE CONTROLLER */}
      {/* ========================================================================= */}
      {activeTab === 'appliances' && (
        <div className="space-y-6">
          {/* Quick Preset Profiles & Voltage Regulator */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  Household Load Profiles & Grid Voltage Tuning
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a standardized Kenyan household profile or manually toggle and tune appliance usage schedules.
                </p>
              </div>

              {/* Profile Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => applyPresetProfile('eco')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800 hover:bg-emerald-900/80 transition-all"
                >
                  Eco Household (~2.5 kWh/d)
                </button>
                <button
                  onClick={() => applyPresetProfile('average')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-950/60 text-blue-300 border border-blue-800 hover:bg-blue-900/80 transition-all"
                >
                  Average Family (~14 kWh/d)
                </button>
                <button
                  onClick={() => applyPresetProfile('heavy')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/60 text-rose-300 border border-rose-800 hover:bg-rose-900/80 transition-all"
                >
                  Heavy Peak Load (~25+ kWh/d)
                </button>
                <button
                  onClick={() => applyPresetProfile('off')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all"
                >
                  All Standby (0 W)
                </button>
              </div>
            </div>

            {/* Grid Voltage Slider & Brownout Physics Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Mains Grid Supply Voltage ($V_{grid}$):
                  </span>
                  <span className={`font-mono font-bold text-sm ${gridVoltage < 220 ? 'text-amber-400' : gridVoltage > 245 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {gridVoltage} V AC {gridVoltage === 240 ? '(Standard Nominal)' : gridVoltage < 220 ? '(Brownout Dip)' : '(Voltage Surge)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="180"
                  max="260"
                  step="2"
                  value={gridVoltage}
                  onChange={(e) => setGridVoltage(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>180 V (Severe Under-voltage)</span>
                  <span>220 V</span>
                  <span className="text-emerald-400 font-bold">240 V (Nominal)</span>
                  <span>260 V (High Surge)</span>
                </div>
              </div>

              {/* Brownout Physics Formula Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                <span className="font-bold text-amber-400 block text-[11px]">Voltage Fluctuation Physics:</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Heating element resistance $R$ is constant. Power dissipated scales as:
                </p>
                <div className="font-mono text-cyan-300 text-[11px] font-bold">
                  $P_{actual} = \frac{V^2}{R} = P_{rated} × \left(\frac{{V}}{240}\right)^2$
                </div>
                <p className="text-slate-400 text-[10px]">
                  Current Scaling Factor: <span className="font-bold text-white">{(voltageSquareFactor * 100).toFixed(1)}%</span> of nominal power.
                </p>
              </div>
            </div>
          </div>

          {/* Appliance Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {activeAppliances.map((app) => {
              const isGeyserSolarReplaced = solarWaterHeaterAdopted && app.id === 'geyser';
              return (
                <div
                  key={app.id}
                  className={`border rounded-3xl p-4 transition-all relative overflow-hidden flex flex-col justify-between ${
                    app.active && isPowerOn && !isGeyserSolarReplaced
                      ? 'bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-950/20 ring-1 ring-cyan-500/20'
                      : 'bg-slate-900/50 border-slate-800/80 opacity-80'
                  }`}
                >
                  {/* Top Bar: Icon, Name & Toggle Switch */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            app.active && isPowerOn && !isGeyserSolarReplaced
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white leading-tight">{app.name}</h4>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {app.ratedWatts} W @ 240V
                          </span>
                        </div>
                      </div>

                      {/* Active ON/OFF Toggle */}
                      <button
                        onClick={() => toggleAppliance(app.id)}
                        disabled={isGeyserSolarReplaced}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          isGeyserSolarReplaced
                            ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800'
                            : app.active && isPowerOn
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {isGeyserSolarReplaced ? 'Solar' : app.active ? 'ON' : 'OFF'}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                      {isGeyserSolarReplaced ? 'Replaced by Rooftop Solar Thermal Water Heater (0 kWh grid usage)' : app.typicalUse}
                    </p>
                  </div>

                  {/* Middle Metrics & Calculations */}
                  <div className="my-4 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Operating Current ($I = P/V$):</span>
                      <span className="font-mono font-bold text-amber-300">
                        {app.actualCurrent > 0 ? `${app.actualCurrent.toFixed(2)} A` : '0.00 A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Instantaneous Power:</span>
                      <span className="font-mono font-bold text-cyan-300">
                        {Math.round(app.actualInstantWatts)} W
                      </span>
                    </div>

                    {/* Daily Hours Slider */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Daily Use:</span>
                        <span className="font-mono font-bold text-white">{app.dailyHours} hrs/day</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="24.0"
                        step="0.1"
                        value={app.dailyHours}
                        onChange={(e) => handleHoursChange(app.id, e.target.value)}
                        disabled={isGeyserSolarReplaced}
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Bottom Summary Pill */}
                  <div className="bg-slate-950/80 rounded-xl p-2.5 flex items-center justify-between text-xs border border-slate-800/60">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Daily Energy</span>
                      <span className="font-mono font-bold text-purple-300">{app.dailyKwh.toFixed(2)} kWh</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Est. Monthly</span>
                      <span className="font-mono font-bold text-rose-300">
                        KES {Math.round(app.dailyKwh * 30 * billingBreakdown.effectiveCostPerKwh).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Delete button for custom appliances */}
                  {app.category === 'custom' && (
                    <button
                      onClick={() => handleRemoveAppliance(app.id)}
                      className="mt-2 w-full py-1 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg flex items-center justify-center gap-1 transition-all"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Appliance
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Custom Appliance Form & Electrical Safety Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Custom Appliance Form */}
            <form
              onSubmit={handleAddCustomAppliance}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4"
            >
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Add Custom Household Appliance
              </h4>

              <div className="space-y-1 text-xs">
                <label className="text-slate-400">Appliance Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Deep Freezer, Washing Machine"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400">Rating (Watts):</label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={customWatts}
                    onChange={(e) => setCustomWatts(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Hours/Day:</label>
                  <input
                    type="number"
                    min="0.1"
                    max="24"
                    step="0.1"
                    value={customHours}
                    onChange={(e) => setCustomHours(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-900/30"
              >
                <Plus className="w-4 h-4" /> Add to Circuit
              </button>
            </form>

            {/* Consumer Unit & Electrical Safety Panel */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Consumer Unit Cutout & Electrical Protection Analysis
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Instant Total Current</span>
                  <div className="text-xl font-black text-amber-400 font-mono">
                    {totalMainsCurrent.toFixed(2)} A
                  </div>
                  <span className="text-[10px] text-slate-500">I = Σ P_active / V_grid</span>
                </div>

                <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Recommended Main Fuse</span>
                  <div className="text-sm font-black text-cyan-300">
                    {recommendedFuseRating}
                  </div>
                  <span className="text-[10px] text-slate-500">Must exceed normal operating current</span>
                </div>

                <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Cable Loading Status</span>
                  <div className={`text-sm font-black ${totalMainsCurrent > 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {totalMainsCurrent > 40 ? 'High Load (Check 6.0mm² cable)' : 'Safe Household Range (<30A)'}
                  </div>
                  <span className="text-[10px] text-slate-500">Joule heating $P_{cable} = I^2 R$</span>
                </div>
              </div>

              {/* Energy Saving Solar Hot Water Opportunity */}
              <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Sun className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-amber-200 block">Energy Efficiency Upgrade: Solar Water Heating</span>
                    <span className="text-slate-400 text-[11px]">
                      Water heating consumes up to 40% of residential bills. Switch geyser to solar thermal power!
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSolarWaterHeaterAdopted(!solarWaterHeaterAdopted)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    solarWaterHeaterAdopted
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {solarWaterHeaterAdopted ? 'Active (Geyser Off)' : 'Simulate Solar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ROTATING INDUCTION DISC & DIGITAL SMART METER */}
      {/* ========================================================================= */}
      {activeTab === 'meter' && (
        <div className="space-y-6">
          {/* Meter Selector & Time Scrubbing Toolbar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meter Architecture:</span>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setMeterType('induction')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    meterType === 'induction'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Disc className="w-3.5 h-3.5" />
                  Ferraris Induction Disc Meter
                </button>
                <button
                  onClick={() => setMeterType('smart')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    meterType === 'smart'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Gauge className="w-3.5 h-3.5" />
                  Digital Smart CIU Meter
                </button>
              </div>
            </div>

            {/* Simulation Speed & Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsSimRunning(!isSimRunning)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
                  isSimRunning ? 'bg-slate-800 text-cyan-300 hover:bg-slate-700' : 'bg-emerald-600 text-white'
                }`}
              >
                {isSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isSimRunning ? 'Pause Time' : 'Run Time'}
              </button>

              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {[1, 60, 3600].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimSpeed(spd)}
                    className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                      simSpeed === spd ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd === 1 ? '1x (Real-time)' : spd === 60 ? '60x (1s = 1m)' : '3600x (1s = 1h)'}
                  </button>
                ))}
              </div>

              {/* Fast Forward 24h & 30d */}
              <button
                onClick={handleFastForwardDay}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-950/60 text-purple-300 border border-purple-800 hover:bg-purple-900/80 transition-all"
                title="Advance meter by 1 full day (+daily kWh)"
              >
                <FastForward className="w-3.5 h-3.5" /> +24h Day
              </button>
              <button
                onClick={handleFastForwardMonth}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-950/60 text-blue-300 border border-blue-800 hover:bg-blue-900/80 transition-all"
                title="Advance meter by 30-day billing period (+monthly kWh)"
              >
                <FastForward className="w-3.5 h-3.5" /> +30 Days
              </button>
            </div>
          </div>

          {/* DUAL METERS DISPLAY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: The Active Visual Meter (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between">
              {meterType === 'induction' ? (
                /* ------------------------------------------------------------- */
                /* 2A. ELECTROMECHANICAL FERRARIS INDUCTION METER */
                /* ------------------------------------------------------------- */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="font-bold text-base text-amber-300 flex items-center gap-2">
                        <Disc className="w-5 h-5 text-amber-400" />
                        Ferraris Electromechanical Induction kWh Meter
                      </h4>
                      <p className="text-xs text-slate-400">
                        Rotating aluminum disc between shunt voltage coil and series current coil.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      K = {meterConstantK} rev/kWh
                    </span>
                  </div>

                  {/* Mechanical Odometer Register */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center space-y-2 shadow-inner">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                      Mechanical Cyclometer Register (Kilowatt-Hours)
                    </span>

                    {/* Rolling Odometer Digit Wheels */}
                    <div className="flex items-center gap-1.5 p-2 bg-slate-900 rounded-xl border-2 border-slate-800 shadow-2xl">
                      {/* 5 Black Integer Wheels + 1 Red Decimal Wheel */}
                      {(() => {
                        const str = accumulatedKwh.toFixed(1).padStart(7, '0');
                        const [integers, decimal] = str.split('.');
                        return (
                          <>
                            {integers.split('').map((char, i) => (
                              <div
                                key={`int_${i}`}
                                className="w-8 h-12 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center text-white font-mono font-black text-xl shadow-inner relative overflow-hidden"
                              >
                                <span className="z-10">{char}</span>
                                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
                                <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                              </div>
                            ))}
                            {/* Decimal Point */}
                            <div className="text-slate-500 font-black text-xl px-0.5">•</div>
                            {/* Tenths Red Wheel */}
                            <div className="w-8 h-12 bg-rose-950 rounded-lg border border-rose-800 flex items-center justify-center text-rose-300 font-mono font-black text-xl shadow-inner relative overflow-hidden">
                              <span className="z-10">{decimal}</span>
                              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
                              <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                            </div>
                            <span className="text-xs font-bold text-amber-400 ml-2 font-mono">kWh</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* SVG Visualization of the Rotating Aluminum Disc */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                    <svg viewBox="0 0 460 260" className="w-full h-56 max-w-lg">
                      <defs>
                        {/* Brushed Aluminum Radial Gradient */}
                        <radialGradient id="aluDiscGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#e2e8f0" />
                          <stop offset="40%" stopColor="#cbd5e1" />
                          <stop offset="70%" stopColor="#94a3b8" />
                          <stop offset="95%" stopColor="#64748b" />
                          <stop offset="100%" stopColor="#334155" />
                        </radialGradient>

                        {/* Metallic Rim Gradient */}
                        <linearGradient id="discRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#475569" />
                          <stop offset="50%" stopColor="#cbd5e1" />
                          <stop offset="100%" stopColor="#334155" />
                        </linearGradient>

                        {/* Electromagnet Copper Wire Pattern */}
                        <pattern id="copperCoil" width="8" height="8" patternUnits="userSpaceOnUse">
                          <line x1="0" y1="0" x2="8" y2="8" stroke="#f59e0b" strokeWidth="2" />
                        </pattern>
                      </defs>

                      {/* 1. Upper Voltage Shunt Electromagnet Core & Coil */}
                      <path d="M 190 20 L 270 20 L 270 70 L 250 70 L 250 40 L 210 40 L 210 70 L 190 70 Z" fill="#334155" stroke="#64748b" strokeWidth="2" />
                      <rect x="210" y="30" width="40" height="25" fill="url(#copperCoil)" rx="3" stroke="#d97706" strokeWidth="1" />
                      <text x="230" y="47" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">SHUNT COIL (V)</text>
                      {/* Magnetic flux lines Φ_V downward */}
                      <line x1="230" y1="70" x2="230" y2="105" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />

                      {/* 2. Lower Series Current Electromagnet Core & Coils */}
                      <path d="M 180 180 L 280 180 L 280 230 L 260 230 L 260 200 L 200 200 L 200 230 L 180 230 Z" fill="#334155" stroke="#64748b" strokeWidth="2" />
                      <rect x="185" y="195" width="25" height="20" fill="url(#copperCoil)" rx="2" stroke="#d97706" strokeWidth="1" />
                      <rect x="250" y="195" width="25" height="20" fill="url(#copperCoil)" rx="2" stroke="#d97706" strokeWidth="1" />
                      <text x="230" y="225" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">SERIES COILS (I)</text>
                      {/* Magnetic flux lines Φ_I upward */}
                      <line x1="197" y1="180" x2="197" y2="135" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                      <line x1="263" y1="180" x2="263" y2="135" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />

                      {/* 3. Permanent Brake Magnet (Eddy Current Drag) on Left */}
                      <path d="M 50 90 L 90 90 L 90 150 L 50 150 Z" fill="#991b1b" stroke="#dc2626" strokeWidth="2" rx="4" />
                      <text x="70" y="115" fill="#fecaca" fontSize="9" fontWeight="bold" textAnchor="middle">BRAKE</text>
                      <text x="70" y="130" fill="#ffffff" fontSize="8" textAnchor="middle">MAGNET</text>

                      {/* 4. The Rotating Aluminum Disc (Perspective Ellipse) */}
                      {/* Centered at (230, 120), rx = 150, ry = 28 */}
                      <g transform="translate(230, 120)">
                        {/* Shadow underneath */}
                        <ellipse cx="0" cy="8" rx="150" ry="24" fill="rgba(0,0,0,0.6)" />

                        {/* Disc Outer Rim Thickness (3D Edge) */}
                        <path
                          d="M -150 0 C -150 15, 150 15, 150 0 L 150 6 C 150 21, -150 21, -150 6 Z"
                          fill="url(#discRimGrad)"
                          stroke="#1e293b"
                          strokeWidth="1"
                        />

                        {/* Top Face of the Aluminum Disc */}
                        <ellipse cx="0" cy="0" rx="150" ry="24" fill="url(#aluDiscGrad)" stroke="#475569" strokeWidth="2" />

                        {/* Central Spindle & Jewel Bearing */}
                        <ellipse cx="0" cy="0" rx="14" ry="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                        <line x1="0" y1="-35" x2="0" y2="35" stroke="#cbd5e1" strokeWidth="3" />

                        {/* Radial Stroboscopic Graduation Ticks rotating with discAngle */}
                        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                          const rad = (deg * Math.PI) / 180 + discAngle;
                          const cosA = Math.cos(rad);
                          const sinA = Math.sin(rad);
                          const x1 = cosA * 110;
                          const y1 = sinA * 17;
                          const x2 = cosA * 144;
                          const y2 = sinA * 23;
                          return (
                            <line
                              key={`tick_${deg}`}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke="#1e293b"
                              strokeWidth="1.5"
                              strokeOpacity={sinA > -0.2 ? 0.9 : 0.2}
                            />
                          );
                        })}

                        {/* High Visibility RED MARKER on Disc Edge */}
                        {(() => {
                          const cosM = Math.cos(discAngle);
                          const sinM = Math.sin(discAngle);
                          const xM = cosM * 144;
                          const yM = sinM * 23;
                          const isFront = sinM >= -0.2;
                          return (
                            <circle
                              cx={xM}
                              cy={yM}
                              r={isFront ? 6.5 : 3.5}
                              fill="#ef4444"
                              stroke="#ffffff"
                              strokeWidth={isFront ? 2 : 1}
                              opacity={isFront ? 1 : 0.4}
                            />
                          );
                        })()}
                      </g>

                      {/* Direction of Rotation Arrow */}
                      <path d="M 330 148 Q 360 155 380 140" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3 2" />
                      <polygon points="385,137 375,138 382,148" fill="#38bdf8" />
                      <text x="360" y="170" fill="#38bdf8" fontSize="9" fontWeight="bold">ROTATION ω ∝ P</text>
                    </svg>
                  </div>

                  {/* Physics Explanation Pill */}
                  <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-amber-300">How the Induction Meter Works:</span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      The shunt coil produces alternating flux Φ_V ∝ V lagging 90°, and series coils produce Φ_I ∝ I. Induced eddy currents in the aluminum disc produce a driving torque τ_d ∝ V × I = P. The brake magnet creates retarding eddy drag τ_b ∝ ω. Equilibrium torque yields rotational speed directly proportional to active power: ω ∝ P.
                    </p>
                  </div>
                </div>
              ) : (
                /* ------------------------------------------------------------- */
                /* 2B. DIGITAL SMART CIU PREPAID METER (KENYA POWER TOKEN STYLE) */
                /* ------------------------------------------------------------- */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="font-bold text-base text-emerald-300 flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-emerald-400" />
                        Digital Smart Pre-Paid Customer Interface Unit (CIU)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Modern split-meter with LCD register display and 20-digit STS token entry.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      Meter No: 3719-4028-55
                    </span>
                  </div>

                  {/* Digital Backlit Green LCD Display */}
                  <div className="bg-[#022c22] rounded-2xl p-5 border-4 border-[#065f46] shadow-2xl flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                    <div className="flex items-center justify-between text-[#34d399] font-mono text-xs border-b border-[#047857]/60 pb-2">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${isPowerOn ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                        {isPowerOn ? 'GRID CONNECTED' : 'SUPPLY ISOLATED'}
                      </span>
                      <span>50.0 Hz • TARIFF DOM-1</span>
                    </div>

                    {/* Main LCD Digital Readout */}
                    <div className="my-3 text-center">
                      <span className="text-[10px] font-mono text-[#a7f3d0] tracking-widest uppercase block">
                        Remaining Prepaid Balance Units
                      </span>
                      <div className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-[#6ee7b7] drop-shadow-md">
                        {smartTokenUnits.toFixed(2)} <span className="text-lg">kWh</span>
                      </div>
                    </div>

                    {/* Secondary Grid Telemetry on LCD */}
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono text-[#a7f3d0] pt-2 border-t border-[#047857]/60">
                      <div>
                        <span className="text-[#34d399]/70 text-[9px] block">ACTIVE LOAD</span>
                        <span className="font-bold">{totalInstantKw.toFixed(3)} kW</span>
                      </div>
                      <div>
                        <span className="text-[#34d399]/70 text-[9px] block">MAINS VOLTAGE</span>
                        <span className="font-bold">{gridVoltage} V</span>
                      </div>
                      <div>
                        <span className="text-[#34d399]/70 text-[9px] block">LINE CURRENT</span>
                        <span className="font-bold">{totalMainsCurrent.toFixed(2)} A</span>
                      </div>
                    </div>
                  </div>

                  {/* LED Pulse & Alarm Indicators */}
                  <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 flex items-center justify-around">
                    {/* Optical Pulse LED */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          pulseLedActive
                            ? 'bg-rose-500 border-rose-300 shadow-lg shadow-rose-500/80 scale-125'
                            : 'bg-rose-950 border-rose-800'
                        }`}
                      />
                      <div className="text-[11px]">
                        <span className="font-bold text-slate-300 block">1000 imp / kWh</span>
                        <span className="text-slate-500 text-[10px] font-mono">
                          Pulse Rate: {(smartImpPulseHz * simSpeed).toFixed(1)} Hz
                        </span>
                      </div>
                    </div>

                    {/* Low Credit Alarm LED */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          smartTokenUnits <= 10.0
                            ? 'bg-amber-500 border-amber-300 animate-ping'
                            : 'bg-emerald-950 border-emerald-800'
                        }`}
                      />
                      <div className="text-[11px]">
                        <span className={`font-bold block ${smartTokenUnits <= 10.0 ? 'text-amber-400' : 'text-slate-400'}`}>
                          Credit Status
                        </span>
                        <span className="text-slate-500 text-[10px]">
                          {smartTokenUnits <= 10.0 ? 'LOW CREDIT WARNING' : 'NORMAL BALANCE'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Virtual 12-Key Keypad for STS Kenya Power Token Recharge */}
                  <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">Enter 20-Digit STS Prepaid Token:</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {tokenInputCode.length}/20 digits
                      </span>
                    </div>

                    {/* Code Display Screen */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-center font-mono font-bold text-amber-300 text-sm tracking-widest min-h-[38px] flex items-center justify-center">
                      {tokenInputCode || '— — — —   — — — —   — — — —   — — — —   — — — —'}
                    </div>

                    {tokenFeedbackMsg && (
                      <div className="text-xs font-bold text-center py-1 text-emerald-400 bg-emerald-950/40 rounded-lg border border-emerald-800">
                        {tokenFeedbackMsg}
                      </div>
                    )}

                    {/* Keypad Buttons (0-9, Backspace, Submit) */}
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {[1, 2, 3, '+50'].map((val) => (
                        <button
                          key={val}
                          onClick={() => (val === '+50' ? handleRechargeToken(50) : handleTokenKeypadPress(val.toString()))}
                          className="py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-mono font-bold text-xs border border-slate-800 active:scale-95"
                        >
                          {val === '+50' ? '+50 kWh' : val}
                        </button>
                      ))}
                      {[4, 5, 6, '+100'].map((val) => (
                        <button
                          key={val}
                          onClick={() => (val === '+100' ? handleRechargeToken(100) : handleTokenKeypadPress(val.toString()))}
                          className="py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-mono font-bold text-xs border border-slate-800 active:scale-95"
                        >
                          {val === '+100' ? '+100 kWh' : val}
                        </button>
                      ))}
                      {[7, 8, 9, 'DEL'].map((val) => (
                        <button
                          key={val}
                          onClick={() => (val === 'DEL' ? handleTokenBackspace() : handleTokenKeypadPress(val.toString()))}
                          className="py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-mono font-bold text-xs border border-slate-800 active:scale-95"
                        >
                          {val}
                        </button>
                      ))}
                      {['0', '00', 'ENTER', '+200'].map((val) => (
                        <button
                          key={val}
                          onClick={() => {
                            if (val === 'ENTER') handleTokenSubmit();
                            else if (val === '+200') handleRechargeToken(200);
                            else handleTokenKeypadPress(val);
                          }}
                          className={`py-1.5 rounded-lg font-mono font-bold text-xs border active:scale-95 ${
                            val === 'ENTER'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-md'
                              : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800'
                          }`}
                        >
                          {val === '+200' ? '+200 kWh' : val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Mathematical Formulations & Derivations (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Quantitative Metrics Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-cyan-400" />
                  Meter Calibration & Rotational Dynamics
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400">Meter Constant ($K$):</span>
                    <span className="font-mono font-bold text-amber-300">{meterConstantK} revs / kWh</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400">Rotational Speed (RPM):</span>
                    <span className="font-mono font-bold text-cyan-300">
                      {discRpm.toFixed(2)} rev / min
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400">Time per 1 Revolution:</span>
                    <span className="font-mono font-bold text-emerald-300">
                      {discRpm > 0 ? `${(60.0 / discRpm).toFixed(1)} s / rev` : '∞ (Stationary)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400">Cumulative Registered Energy:</span>
                    <span className="font-mono font-bold text-purple-300">
                      {accumulatedKwh.toFixed(2)} kWh
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400">Energy in Joules ($E = P × t$):</span>
                    <span className="font-mono font-bold text-rose-300">
                      {(accumulatedKwh * 3.6).toFixed(2)} × 10⁶ J (MJ)
                    </span>
                  </div>
                </div>

                {/* Meter Constant Selector */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-300 block">Select Meter Constant ($K$):</span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[300, 600, 1200].map((kVal) => (
                      <button
                        key={kVal}
                        onClick={() => setMeterConstantK(kVal)}
                        className={`py-1.5 rounded-xl font-mono font-bold border transition-all ${
                          meterConstantK === kVal
                            ? 'bg-amber-600 border-amber-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {kVal} rev/kWh
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* KCSE Textbook Derivation Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs">
                <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> KCSE Examination Principle: The Kilowatt-Hour
                </h4>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  The SI unit of electrical energy is the <strong>Joule (J)</strong>. However, the Joule is too small for commercial utility billing:
                </p>
                <div className="bg-slate-950 rounded-xl p-3 font-mono text-cyan-300 text-[11px] space-y-1 border border-slate-800">
                  <div>$1 kWh} = 1000 W} × 3600 seconds}$</div>
                  <div className="font-bold text-emerald-400">$1 kWh} = 3,600,000 J} = 3.6 × 10^6 J}$</div>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  When answering KCSE exam questions, remember that electricity utilities sell electrical <strong>energy</strong>, not electrical power!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KENYA POWER UTILITY BILL & TARIFF BREAKDOWN */}
      {/* ========================================================================= */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Top Billing Parameters Control Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-400" />
                  Kenya Power (KPLC / EPRA) Utility Tariff Architecture
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulate itemized monthly billing slips with fuel energy costs, forex adjustments, levies, and 16% VAT.
                </p>
              </div>

              {/* Tariff Mode Toggle */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setTariffMode('tiered')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    tariffMode === 'tiered'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Official Kenya Power Multi-Tier
                </button>
                <button
                  onClick={() => setTariffMode('flat')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    tariffMode === 'flat'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  KCSE Standard Flat Rate
                </button>
              </div>
            </div>

            {/* Configurable Rate Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {/* Flat Rate or Tier info */}
              {tariffMode === 'flat' ? (
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Flat Energy Tariff:</span>
                    <span className="font-mono font-bold text-white">KES {flatRatePerKwh.toFixed(2)} / kWh</span>
                  </div>
                  <input
                    type="range"
                    min="10.0"
                    max="35.0"
                    step="0.5"
                    value={flatRatePerKwh}
                    onChange={(e) => setFlatRatePerKwh(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>10 KES/kWh</span>
                    <span>20 KES/kWh</span>
                    <span>35 KES/kWh</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs space-y-1">
                  <span className="font-bold text-amber-300 block">Approved EPRA Domestic Tiers:</span>
                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    <div>• 0 to 30 kWh (Lifeline): <span className="text-white font-mono">KES 12.50 / kWh</span></div>
                    <div>• 31 to 100 kWh (Ordinary 1): <span className="text-white font-mono">KES 16.50 / kWh</span></div>
                    <div>• &gt; 100 kWh (Ordinary 2): <span className="text-white font-mono">KES 20.97 / kWh</span></div>
                  </div>
                </div>
              )}

              {/* Fuel Cost Charge Slider */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Fuel Cost Charge (FCC):</span>
                  <span className="font-mono font-bold text-amber-300">KES {fuelCostCharge.toFixed(2)} / kWh</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="9.0"
                  step="0.1"
                  value={fuelCostCharge}
                  onChange={(e) => setFuelCostCharge(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1.0 (Low hydro/wind)</span>
                  <span>4.6 (Normal)</span>
                  <span>9.0 (Thermal peak)</span>
                </div>
              </div>

              {/* Forex Adjustment Slider */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Forex Adjustment (FERFA):</span>
                  <span className="font-mono font-bold text-purple-300">KES {forexAdjustment.toFixed(2)} / kWh</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="4.0"
                  step="0.05"
                  value={forexAdjustment}
                  onChange={(e) => setForexAdjustment(parseFloat(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.00 KES</span>
                  <span>1.25 KES</span>
                  <span>4.00 KES</span>
                </div>
              </div>
            </div>
          </div>

          {/* DUAL COLUMN: Authentic Printable Invoice Slip + Visual Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: Authentic KPLC Monthly Electricity Bill / Receipt (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono">
                    KP
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white leading-tight">KENYA POWER & LIGHTING COMPANY PLC</h4>
                    <span className="text-[10px] text-slate-400">TAX INVOICE / POST-PAID ELECTRICITY BILL</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                  ORIGINAL
                </span>
              </div>

              {/* Customer & Period Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Account No:</span>
                  <span className="font-mono font-bold text-white">48201934-01</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Meter No:</span>
                  <span className="font-mono font-bold text-white">3719-4028</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Billing Period:</span>
                  <span className="font-bold text-white">30 Days</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Units:</span>
                  <span className="font-mono font-bold text-cyan-400">{billingBreakdown.kwh.toFixed(1)} kWh</span>
                </div>
              </div>

              {/* Itemized Line-Item Invoice Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2 px-2">Charge Item / Levy</th>
                      <th className="py-2 px-2 text-center">Rate</th>
                      <th className="py-2 px-2 text-right">Units</th>
                      <th className="py-2 px-2 text-right">Amount (KES)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {/* Energy consumption tiers */}
                    {billingBreakdown.tierDetails.map((td, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-1.5 px-2 text-slate-300">{td.label}</td>
                        <td className="py-1.5 px-2 text-center text-slate-400">{td.rate.toFixed(2)}</td>
                        <td className="py-1.5 px-2 text-right text-slate-400">{td.units.toFixed(1)}</td>
                        <td className="py-1.5 px-2 text-right text-cyan-300 font-bold">{td.amount.toFixed(2)}</td>
                      </tr>
                    ))}

                    {/* Fuel Energy Cost */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-1.5 px-2 text-slate-300">Fuel Cost Charge (FCC)</td>
                      <td className="py-1.5 px-2 text-center text-slate-400">{fuelCostCharge.toFixed(2)}</td>
                      <td className="py-1.5 px-2 text-right text-slate-400">{billingBreakdown.kwh.toFixed(1)}</td>
                      <td className="py-1.5 px-2 text-right text-amber-300">{billingBreakdown.fuelCostTotal.toFixed(2)}</td>
                    </tr>

                    {/* Forex Adjustment */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-1.5 px-2 text-slate-300">Forex Adjustment (FERFA)</td>
                      <td className="py-1.5 px-2 text-center text-slate-400">{forexAdjustment.toFixed(2)}</td>
                      <td className="py-1.5 px-2 text-right text-slate-400">{billingBreakdown.kwh.toFixed(1)}</td>
                      <td className="py-1.5 px-2 text-right text-purple-300">{billingBreakdown.forexTotal.toFixed(2)}</td>
                    </tr>

                    {/* EPRA Levy */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-1.5 px-2 text-slate-300">EPRA Regulatory Levy</td>
                      <td className="py-1.5 px-2 text-center text-slate-400">0.08</td>
                      <td className="py-1.5 px-2 text-right text-slate-400">{billingBreakdown.kwh.toFixed(1)}</td>
                      <td className="py-1.5 px-2 text-right text-slate-300">{billingBreakdown.epraTotal.toFixed(2)}</td>
                    </tr>

                    {/* WARMA Levy */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-1.5 px-2 text-slate-300">WRA / WARMA Water Resource Levy</td>
                      <td className="py-1.5 px-2 text-center text-slate-400">0.02</td>
                      <td className="py-1.5 px-2 text-right text-slate-400">{billingBreakdown.kwh.toFixed(1)}</td>
                      <td className="py-1.5 px-2 text-right text-slate-300">{billingBreakdown.warmaTotal.toFixed(2)}</td>
                    </tr>

                    {/* Inflation Adjustment */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-1.5 px-2 text-slate-300">Inflation Adjustment (INFA)</td>
                      <td className="py-1.5 px-2 text-center text-slate-400">0.38</td>
                      <td className="py-1.5 px-2 text-right text-slate-400">{billingBreakdown.kwh.toFixed(1)}</td>
                      <td className="py-1.5 px-2 text-right text-slate-300">{billingBreakdown.inflationTotal.toFixed(2)}</td>
                    </tr>

                    {/* REP Levy (5% on energy) */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-1.5 px-2 text-slate-300">Rural Electrification (REP) Levy (5%)</td>
                      <td className="py-1.5 px-2 text-center text-slate-400">5.0%</td>
                      <td className="py-1.5 px-2 text-right text-slate-400">—</td>
                      <td className="py-1.5 px-2 text-right text-slate-300">{billingBreakdown.repTotal.toFixed(2)}</td>
                    </tr>

                    {/* Taxable Subtotal */}
                    <tr className="border-t-2 border-slate-700 font-bold text-white">
                      <td colSpan="3" className="py-2 px-2 text-right uppercase text-[10px]">
                        Taxable Subtotal:
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-white">
                        KES {billingBreakdown.taxableSubtotal.toFixed(2)}
                      </td>
                    </tr>

                    {/* 16% VAT */}
                    <tr className="text-rose-300">
                      <td colSpan="3" className="py-1.5 px-2 text-right uppercase text-[10px]">
                        Value Added Tax (VAT @ 16%):
                      </td>
                      <td className="py-1.5 px-2 text-right font-bold">
                        KES {billingBreakdown.vatTotal.toFixed(2)}
                      </td>
                    </tr>

                    {/* Grand Total */}
                    <tr className="border-t-2 border-emerald-500 bg-emerald-950/40 text-emerald-300 text-sm font-black">
                      <td colSpan="3" className="py-2.5 px-2 text-right uppercase tracking-wider">
                        Total Amount Payable:
                      </td>
                      <td className="py-2.5 px-2 text-right text-base text-emerald-400 font-mono">
                        KES {billingBreakdown.grandTotal.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Col: Bill Composition Pie / Bar Chart & Savings Advisor (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Cost Composition Visualizer */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Bill Composition & Percentage Breakdown
                </h4>

                {/* Percentage Stacked Bar */}
                {(() => {
                  const total = Math.max(1, billingBreakdown.grandTotal);
                  const basePct = (billingBreakdown.baseEnergyCost / total) * 100;
                  const fuelPct = (billingBreakdown.fuelCostTotal / total) * 100;
                  const forexPct = (billingBreakdown.forexTotal / total) * 100;
                  const taxLevyPct = ((billingBreakdown.vatTotal + billingBreakdown.repTotal + billingBreakdown.epraTotal + billingBreakdown.warmaTotal + billingBreakdown.inflationTotal) / total) * 100;

                  return (
                    <div className="space-y-3 text-xs">
                      <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-950 border border-slate-800">
                        <div
                          style={{ width: `${basePct}%` }}
                          className="bg-cyan-500 h-full flex items-center justify-center text-[10px] font-bold text-slate-950"
                          title={`Base Energy: ${basePct.toFixed(1)}%`}
                        >
                          {basePct > 15 && `${basePct.toFixed(0)}%`}
                        </div>
                        <div
                          style={{ width: `${fuelPct}%` }}
                          className="bg-amber-500 h-full flex items-center justify-center text-[10px] font-bold text-slate-950"
                          title={`Fuel Charge: ${fuelPct.toFixed(1)}%`}
                        >
                          {fuelPct > 12 && `${fuelPct.toFixed(0)}%`}
                        </div>
                        <div
                          style={{ width: `${forexPct}%` }}
                          className="bg-purple-500 h-full flex items-center justify-center text-[10px] font-bold text-white"
                          title={`Forex: ${forexPct.toFixed(1)}%`}
                        >
                          {forexPct > 8 && `${forexPct.toFixed(0)}%`}
                        </div>
                        <div
                          style={{ width: `${taxLevyPct}%` }}
                          className="bg-rose-500 h-full flex items-center justify-center text-[10px] font-bold text-white"
                          title={`Taxes & Levies: ${taxLevyPct.toFixed(1)}%`}
                        >
                          {taxLevyPct > 12 && `${taxLevyPct.toFixed(0)}%`}
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-cyan-500 shrink-0" />
                          <span className="text-slate-300">Base Energy ({basePct.toFixed(1)}%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-amber-500 shrink-0" />
                          <span className="text-slate-300">Fuel Cost Charge ({fuelPct.toFixed(1)}%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-purple-500 shrink-0" />
                          <span className="text-slate-300">Forex Adj ({forexPct.toFixed(1)}%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-rose-500 shrink-0" />
                          <span className="text-slate-300">Taxes & 16% VAT ({taxLevyPct.toFixed(1)}%)</span>
                        </div>
                      </div>

                      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">Effective Average Cost:</span>
                        <span className="font-mono font-bold text-cyan-300 text-sm">
                          KES {billingBreakdown.effectiveCostPerKwh.toFixed(2)} / kWh
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Energy Saving Solar Geyser Payback Calculator */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
                <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  Energy Audit: Solar Water Heater Payback
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A typical 2000 W geyser operating for 2 hours daily consumes:
                </p>
                <div className="bg-slate-950 rounded-xl p-3 text-xs font-mono space-y-1 text-slate-300 border border-slate-800">
                  <div>Daily: 2.0 kW × 2.0 h = 4.0 kWh/day</div>
                  <div>Monthly: 4.0 kWh/day × 30 = 120.0 kWh/month</div>
                  <div className="text-rose-400 font-bold">
                    Cost = 120 kWh × KES {billingBreakdown.effectiveCostPerKwh.toFixed(2)} ≈ KES {(120 * billingBreakdown.effectiveCostPerKwh).toFixed(0)} / month
                  </div>
                </div>
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-emerald-300">
                  Replacing the geyser with a 150L Solar Thermal Collector saves ~<strong>KES {(120 * billingBreakdown.effectiveCostPerKwh * 12).toFixed(0)} per year</strong>, paying back an 80,000 KES solar system in ~{Math.max(1, (80000 / (120 * billingBreakdown.effectiveCostPerKwh * 12))).toFixed(1)} years!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: KCSE EXAM PRACTICE CALCULATION LAB */}
      {/* ========================================================================= */}
      {activeTab === 'kcse' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Problem Statement & Interactive Input (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
            {/* Problem Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  {currentProblem.year}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">{currentProblem.title}</h3>
              </div>
              <div className="flex items-center gap-1">
                {KCSE_PRACTICE_PROBLEMS.map((prob, idx) => (
                  <button
                    key={prob.id}
                    onClick={() => {
                      setCurrentProblemIdx(idx);
                      setUserAnswer('');
                      setAnswerStatus(null);
                      setShowSolution(false);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center ${
                      currentProblemIdx === idx
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                        : solvedProblems[prob.id]
                        ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Body */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2">
              <p>{currentProblem.scenario}</p>
            </div>

            {/* Interactive Student Answer Form */}
            <form onSubmit={handleCheckKcseAnswer} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Your Answer in {currentProblem.unit}:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`e.g. ${currentProblem.targetValue}`}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-900/40"
                  >
                    Check Answer
                  </button>
                </div>
              </div>

              {/* Answer Feedback Banner */}
              {answerStatus === 'correct' && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-600/60 rounded-xl flex items-center justify-between gap-2 text-xs text-emerald-200 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold block">Correct! Full marks awarded.</span>
                      <span className="text-[11px] text-emerald-300">
                        Matches marking scheme within scientific tolerance.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextProblem}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                  >
                    Next Question <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {answerStatus === 'incorrect' && (
                <div className="p-3 bg-rose-950/60 border border-rose-600/60 rounded-xl flex items-center justify-between gap-2 text-xs text-rose-200 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <span className="font-bold block">Incorrect numerical evaluation.</span>
                      <span className="text-[11px] text-rose-300">
                        Check your formula substitution or units conversion.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSolution(true)}
                    className="px-2.5 py-1 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 text-xs font-semibold"
                  >
                    View Hint / Steps
                  </button>
                </div>
              )}

              {/* Hint & Reveal Solution Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentProblem.hint}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSolution(!showSolution)}
                  className="text-purple-400 hover:text-purple-300 font-semibold underline text-xs whitespace-nowrap ml-2"
                >
                  {showSolution ? 'Hide Marking Scheme' : 'Reveal KCSE Marking Scheme'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Step-by-Step Marking Scheme & Examiner Notes (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {showSolution || answerStatus === 'correct' ? (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Official KNEC / KCSE Marking Scheme
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
                    Total Marks: 3 Marks
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {currentProblem.markingScheme.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-2.5"
                    >
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono font-bold text-[11px] shrink-0">
                        {step.mark}
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>

                {/* Examiner Common Pitfalls Card */}
                <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" /> KNEC Chief Examiner Report Tip:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {currentProblem.examinerNote}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
                <HelpCircle className="w-10 h-10 text-purple-400/50" />
                <h4 className="font-bold text-sm text-white">Marking Scheme Locked</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Attempt the problem by calculating the answer and entering your result, or click "Reveal KCSE Marking Scheme" to inspect the examiner guide.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
