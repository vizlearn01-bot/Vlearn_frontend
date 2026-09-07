import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  Zap,
  Radio,
  Sun,
  Activity,
  Info,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Sliders,
  Sparkles,
  Layers,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Flame,
  Atom,
  Thermometer,
  Award,
} from 'lucide-react';

// ============================================================================
// 1. FUNDAMENTAL PHYSICAL CONSTANTS
// ============================================================================
const C_VACUUM = 299792458; // m/s (~3.0 x 10^8 m/s)
const PLANCK_H = 6.62607015e-34; // J*s
const EV_TO_J = 1.602176634e-19; // J per eV
const WIEN_B = 2.897771955e-3; // m*K (Wien's displacement constant)
const IONIZING_ENERGY_EV_THRESHOLD = 10.0; // ~10 eV molecular ionization threshold (approx 124 nm)

// ============================================================================
// 2. SPECTRAL BANDS MASTER DATABASE
// ============================================================================
const SPECTRAL_BANDS = [
  {
    id: 'radio',
    name: 'Radio Waves',
    shortName: 'Radio',
    color: '#38bdf8', // Sky Blue
    glowColor: 'rgba(56, 189, 248, 0.4)',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    borderActive: 'border-sky-500',
    logMin: 0.0, // 1 m
    logMax: 4.0, // 10,000 m
    defaultLog: 2.0, // 100 m
    freqRange: '< 300 MHz',
    waveRange: '> 1 m (up to 10 km+)',
    energyRange: '< 1.24 µeV',
    isIonizing: false,
    hazardLevel: 'Non-Ionizing (Harmless at environmental levels)',
    generation: 'Rapid oscillation of conduction electrons in transmitting aerials / resonant LC circuits.',
    detection: 'Receiving dipole aerials, tuned LC resonant circuits, semiconductor diodes.',
    applications: [
      'FM & AM radio broadcasting across Kenya (KBC, Radio Citizen)',
      'VHF / UHF television transmissions',
      'Maritime & air traffic control radio navigation',
      'RFID tags and long-range telecommunications',
    ],
    hazards: 'Completely non-ionizing. Negligible biological effect under normal field strengths. Extreme high-power RF can induce minor superficial heating.',
    atmosphere: 'Completely Transparent (Radio Window lets cosmic radio signals pass to ground radio telescopes).',
  },
  {
    id: 'microwave',
    name: 'Microwaves',
    shortName: 'Microwave',
    color: '#2dd4bf', // Teal
    glowColor: 'rgba(45, 212, 191, 0.4)',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    borderActive: 'border-teal-500',
    logMin: -3.0, // 1 mm
    logMax: 0.0, // 1 m
    defaultLog: -1.5, // ~3.16 cm
    freqRange: '300 MHz – 300 GHz',
    waveRange: '1 mm – 1 m',
    energyRange: '1.24 µeV – 1.24 meV',
    isIonizing: false,
    hazardLevel: 'Non-Ionizing (Thermal heating of water molecules)',
    generation: 'Magnetron cavity oscillators, klystrons, Gunn diodes, travelling wave tubes (TWT).',
    detection: 'Point-contact semiconductor diodes, horn antennas, parabolic dish receivers, crystal detectors.',
    applications: [
      'Cellular mobile communication (GSM, 3G, 4G LTE, 5G)',
      'RADAR systems for aircraft tracking, ship navigation, and speed traps',
      'Domestic microwave ovens (2.45 GHz dielectric water heating)',
      'Satellite communication & GPS navigation links',
    ],
    hazards: 'Non-ionizing. Penetrates tissue to cause internal dielectric heating. The lens of the human eye is vulnerable to thermal cataract formation due to lack of blood cooling.',
    atmosphere: 'Mostly Transparent (except specific narrow water vapor and oxygen absorption bands at millimeter wavelengths).',
  },
  {
    id: 'infrared',
    name: 'Infrared Radiation',
    shortName: 'Infrared (IR)',
    color: '#f87171', // Red / Rose
    glowColor: 'rgba(248, 113, 113, 0.4)',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
    borderActive: 'border-red-500',
    logMin: -6.1549, // 700 nm
    logMax: -3.0, // 1 mm
    defaultLog: -5.0, // 10 µm
    freqRange: '300 GHz – 430 THz',
    waveRange: '700 nm – 1 mm',
    energyRange: '1.24 meV – 1.77 eV',
    isIonizing: false,
    hazardLevel: 'Non-Ionizing (Thermal radiation & burns)',
    generation: 'Thermal vibration and rotational transitions of atoms and molecules in hot objects; incandescent sources; IR LEDs.',
    detection: 'Thermopiles, blackened bulb thermometers, bolometers, pyroelectric sensors, infrared photodiodes.',
    applications: [
      'Thermal imaging cameras for firefighting, building heat loss, and fever screening',
      'Night-vision surveillance and security motion sensors (PIR)',
      'Television remote control optical pulses',
      'Fiber-optic telecommunications (1310 nm & 1550 nm low-attenuation windows)',
      'Physiotherapy heating lamps for muscle relief',
    ],
    hazards: 'Non-ionizing radiation. High intensity IR radiation causes severe cutaneous thermal burns and corneal burns.',
    atmosphere: 'Partially Absorbed by atmospheric water vapor (H₂O) and carbon dioxide (CO₂); critical in Earth greenhouse effect.',
  },
  {
    id: 'visible',
    name: 'Visible Light',
    shortName: 'Visible',
    color: '#22c55e', // Vibrant Green
    glowColor: 'rgba(34, 197, 94, 0.4)',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderActive: 'border-emerald-500',
    logMin: -6.3979, // 400 nm
    logMax: -6.1549, // 700 nm
    defaultLog: -6.2596, // 550 nm (Green)
    freqRange: '430 THz – 750 THz',
    waveRange: '400 nm – 700 nm',
    energyRange: '1.77 eV – 3.10 eV',
    isIonizing: false,
    hazardLevel: 'Non-Ionizing (Visual spectrum, laser retinal risk)',
    generation: 'Outer-shell valence electron transitions in excited atoms (de-excitation); incandescent filaments; LEDs; sunlight.',
    detection: 'Human eye retina (rhodopsin in rods & cones), photographic emulsion film, CMOS/CCD image sensors, LDRs, photodiodes.',
    applications: [
      'Human vision, optical microscopy, and photography',
      'Photosynthesis in green plants (driving Earth biosphere)',
      'Laser barcode scanners and optical disc drives',
      'Interior lighting (LEDs, fluorescent tubes) and display screens',
    ],
    hazards: 'Non-ionizing. High-intensity coherent light (lasers) or intense blue-violet light can burn the retina and cause permanent blindness.',
    atmosphere: 'Completely Transparent (The Optical Atmospheric Window lets sunlight illuminate Earth surface).',
  },
  {
    id: 'ultraviolet',
    name: 'Ultraviolet Radiation',
    shortName: 'Ultraviolet (UV)',
    color: '#c084fc', // Purple
    glowColor: 'rgba(192, 132, 252, 0.4)',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    borderActive: 'border-purple-500',
    logMin: -8.0, // 10 nm
    logMax: -6.3979, // 400 nm
    defaultLog: -7.3, // ~50 nm
    freqRange: '750 THz – 30 PHz',
    waveRange: '10 nm – 400 nm',
    energyRange: '3.10 eV – 124 eV',
    isIonizing: false, // Near-ionizing to early ionizing at extreme UV (<100 nm)
    hazardLevel: 'Near-Ionizing / Photochemical Hazard (Sunburn, skin cancer, cataract)',
    generation: 'Very hot bodies (Sun, electric arcs), mercury discharge lamps, synchrotron accelerators.',
    detection: 'Fluorescent substances (glowing visible light upon UV excitation), photographic plates, photocells, UV photodiodes.',
    applications: [
      'Germicidal water purification and hospital sterilization (UV-C at 254 nm)',
      'Fluorescent anti-counterfeiting verification on Kenyan banknotes and passports',
      'Stimulation of Vitamin D synthesis in human skin',
      'Semiconductor photolithography for microchip manufacturing',
    ],
    hazards: 'Critical boundary! Causes photochemical damage: pyrimidine dimer formation in DNA, sunburn (erythema), photokeratitis (welder flash), skin cancer, and cataracts.',
    atmosphere: 'Stratospheric Ozone (O₃) layer absorbs almost 100% of UV-C and 90% of UV-B, shielding terrestrial life.',
  },
  {
    id: 'xray',
    name: 'X-Rays',
    shortName: 'X-Rays',
    color: '#38bdf8', // Electric Blue / Cyan
    glowColor: 'rgba(56, 189, 248, 0.4)',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    borderActive: 'border-sky-500',
    logMin: -11.0, // 0.01 nm (10 pm)
    logMax: -8.0, // 10 nm
    defaultLog: -9.5, // ~0.316 nm
    freqRange: '30 PHz – 30 EHz',
    waveRange: '0.01 nm – 10 nm',
    energyRange: '124 eV – 124 keV',
    isIonizing: true,
    hazardLevel: 'Ionizing Radiation Hazard (DNA strand breaks, cell death, cancer)',
    generation: 'Coolidge X-Ray Tube: Rapid deceleration of fast electrons striking heavy metal targets (Bremsstrahlung) and inner-shell electron knockouts.',
    detection: 'Photographic film (with fluorescent intensifying screens), Geiger-Müller (GM) tubes, digital flat-panel semiconductor detectors, ionization chambers.',
    applications: [
      'Diagnostic medical radiography (bone fracture imaging, dental diagnostics)',
      'Computed Tomography (CT) 3D body scans',
      'Airport baggage inspection scanners',
      'Industrial non-destructive testing of structural welds and metal castings',
      'X-ray crystallography for determining 3D molecular and protein crystal structures',
    ],
    hazards: 'STRONGLY IONIZING. Dislodges electrons from biological molecules, generates reactive free radicals, causes DNA mutations, radiation sickness, and leukemia. Requires lead apron shielding.',
    atmosphere: 'Opaque (Earth upper atmosphere absorbs X-rays; space telescopes like Chandra must be placed in orbit).',
  },
  {
    id: 'gamma',
    name: 'Gamma Rays',
    shortName: 'Gamma (γ)',
    color: '#f43f5e', // Hot Rose / Magenta
    glowColor: 'rgba(244, 63, 94, 0.4)',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    borderActive: 'border-rose-500',
    logMin: -14.0, // 0.00001 nm (10 fm)
    logMax: -11.0, // 0.01 nm (10 pm)
    defaultLog: -12.5, // ~31.6 fm
    freqRange: '> 30 EHz',
    waveRange: '< 0.01 nm (< 10 pm down to sub-fermi)',
    energyRange: '> 124 keV (up to MeV / GeV)',
    isIonizing: true,
    hazardLevel: 'Extremely Lethal Ionizing Hazard (Deep penetrating nuclear radiation)',
    generation: 'Spontaneous nuclear de-excitation transitions in unstable radioactive nuclei (e.g., Cobalt-60, Technetium-99m), nuclear fission, positron-electron annihilation, astrophysical gamma-ray bursts.',
    detection: 'Geiger-Müller counters, sodium iodide (NaI) scintillation detectors, semiconductor detectors (HPGe), bubble chambers.',
    applications: [
      'Targeted cancer radiotherapy (Cobalt-60 teletherapy, Gamma Knife radiosurgery)',
      'Gamma irradiation sterilization of disposable surgical syringes, gloves, and medical equipment',
      'Food irradiation to destroy Salmonella, bacteria, and delay fruit ripening',
      'Industrial pipe gamma radiography to detect concealed corrosion flaws',
    ],
    hazards: 'EXTREME IONIZING HAZARD. Tremendous penetrating power. Passes through human body, inducing catastrophic double-strand DNA cleavage, bone marrow failure, and fatal acute radiation syndrome. Requires thick lead or massive concrete shields.',
    atmosphere: 'Opaque (Absorbed by the upper atmosphere; detected from orbit via Fermi Gamma-ray Space Telescope).',
  },
];

// ============================================================================
// 3. SCALE BENCHMARKS DATABASE (Comparing Wavelength to Real-World Objects)
// ============================================================================
const SCALE_BENCHMARKS = [
  {
    logMax: 4.5,
    logMin: 3.5,
    name: 'Mountain Peak & Radio Mast',
    sizeLabel: '~1 km to 10 km',
    category: 'Macro Geological Scale',
    comparison: 'Comparable to the height of Mt. Kenya (5,199 m) or long-wave transmission masts.',
    icon: 'mountain',
  },
  {
    logMax: 3.5,
    logMin: 2.5,
    name: 'Skyscraper / Burj Khalifa',
    sizeLabel: '~500 m to 1 km',
    category: 'Megastructure Scale',
    comparison: 'Equal to the height of towering world skyscrapers (Burj Khalifa is 828 m).',
    icon: 'building',
  },
  {
    logMax: 2.5,
    logMin: 1.5,
    name: 'Football Pitch / 100m Track',
    sizeLabel: '~50 m to 150 m',
    category: 'Sports Arena Scale',
    comparison: 'Approximately the length of a standard Kasarani athletics track straight or football pitch (105 m).',
    icon: 'stadium',
  },
  {
    logMax: 1.5,
    logMin: 0.5,
    name: 'Public Service Bus (Matatu/Coach)',
    sizeLabel: '~5 m to 15 m',
    category: 'Vehicular Scale',
    comparison: 'Equal to the physical bumper-to-bumper length of a commercial passenger bus (~12 m).',
    icon: 'bus',
  },
  {
    logMax: 0.5,
    logMin: -0.5,
    name: 'Human Being / Laboratory Bench',
    sizeLabel: '~0.5 m to 2 m',
    category: 'Human Anatomical Scale',
    comparison: 'Equal to the height of a secondary school student (~1.7 m) or a standard laboratory desk.',
    icon: 'human',
  },
  {
    logMax: -0.5,
    logMin: -1.5,
    name: 'Coffee Mug / Honeybee',
    sizeLabel: '~3 cm to 15 cm',
    category: 'Handheld & Insect Scale',
    comparison: 'Equal to the diameter of a laboratory beaker or the wingspan of a large honeybee (~2 cm).',
    icon: 'bee',
  },
  {
    logMax: -1.5,
    logMin: -2.5,
    name: 'Kenyan 1-Shilling Coin',
    sizeLabel: '~1 cm to 3 cm',
    category: 'Centimetric Scale',
    comparison: 'Equal to the diameter of a standard metallic coin or a human fingernail (~1.5 cm).',
    icon: 'coin',
  },
  {
    logMax: -2.5,
    logMin: -3.5,
    name: 'Pinhead / Grain of Sand',
    sizeLabel: '~0.5 mm to 2 mm',
    category: 'Millimetric Scale',
    comparison: 'Comparable to the tip of an optical pin or an individual grain of coarse beach sand (~1 mm).',
    icon: 'pin',
  },
  {
    logMax: -3.5,
    logMin: -4.5,
    name: 'Human Hair Diameter',
    sizeLabel: '~50 µm to 100 µm',
    category: 'Microscopic Strands',
    comparison: 'Approximately the cross-sectional thickness of a single strand of human scalp hair (~80 µm).',
    icon: 'hair',
  },
  {
    logMax: -4.5,
    logMin: -5.5,
    name: 'Human Red Blood Cell (Erythrocyte)',
    sizeLabel: '~6 µm to 10 µm',
    category: 'Cellular Biological Scale',
    comparison: 'Equal to the diameter of an oxygen-carrying human red blood cell (~7.5 µm).',
    icon: 'cell',
  },
  {
    logMax: -5.5,
    logMin: -6.5,
    name: 'Bacterium (E. coli)',
    sizeLabel: '~0.5 µm to 2 µm',
    category: 'Single-Celled Organism Scale',
    comparison: 'Equal to the physical length of an Escherichia coli bacterium cell (~1.5 µm).',
    icon: 'bacteria',
  },
  {
    logMax: -6.5,
    logMin: -7.5,
    name: 'Virus Particle (Influenza / COVID-19)',
    sizeLabel: '~50 nm to 150 nm',
    category: 'Sub-Microscopic Viral Scale',
    comparison: 'Equal to the diameter of a coronavirus or influenza viral capsid (~100 nm).',
    icon: 'virus',
  },
  {
    logMax: -7.5,
    logMin: -8.5,
    name: 'DNA Double Helix Diameter',
    sizeLabel: '~2 nm to 10 nm',
    category: 'Biomolecular Macromolecule Scale',
    comparison: 'Equal to the physical width across the Watson-Crick DNA double helix ladder (~2.0 nm).',
    icon: 'dna',
  },
  {
    logMax: -8.5,
    logMin: -9.5,
    name: 'Glucose / Small Molecule',
    sizeLabel: '~0.5 nm to 1.5 nm',
    category: 'Molecular Nanoscale',
    comparison: 'Equal to the diameter of a single glucose sugar ring or water cluster (~0.8 nm).',
    icon: 'molecule',
  },
  {
    logMax: -9.5,
    logMin: -10.5,
    name: 'Single Atom Diameter (Bohr Radius)',
    sizeLabel: '~0.1 nm (1 Ångström)',
    category: 'Atomic Orbital Scale',
    comparison: 'Equal to the full electron orbital diameter of an isolated Carbon or Hydrogen atom (~0.1 nm).',
    icon: 'atom',
  },
  {
    logMax: -10.5,
    logMin: -11.5,
    name: 'Inner K-Shell Electron Orbital',
    sizeLabel: '~10 pm to 30 pm',
    category: 'Sub-Atomic Shell Scale',
    comparison: 'Equal to the tightly bound inner K-shell electron orbit of heavy transition metals.',
    icon: 'orbital',
  },
  {
    logMax: -11.5,
    logMin: -12.5,
    name: 'Proton Compton Wavelength',
    sizeLabel: '~1 pm to 3 pm',
    category: 'Quantum Nuclear Scale',
    comparison: 'The characteristic quantum wave packet spread of relativistic subatomic hadrons.',
    icon: 'hadron',
  },
  {
    logMax: -12.5,
    logMin: -14.5,
    name: 'Atomic Nucleus (Uranium / Lead)',
    sizeLabel: '~1 fm to 15 fm (10⁻¹⁵ m)',
    category: 'Femtometer Core Scale',
    comparison: 'Equal to the dense, positively charged nucleus holding 238 nucleons in a Uranium-238 atom (~15 fm).',
    icon: 'nucleus',
  },
];

// ============================================================================
// 4. VISIBLE SPECTRUM ROYGBIV BREAKDOWN & COLOR COMPUTATION
// ============================================================================
const VISIBLE_COLORS = [
  { name: 'Red', hex: '#ef4444', nmRange: '620 – 700 nm', targetNm: 660, logVal: -6.1804 },
  { name: 'Orange', hex: '#f97316', nmRange: '590 – 620 nm', targetNm: 605, logVal: -6.2182 },
  { name: 'Yellow', hex: '#eab308', nmRange: '570 – 590 nm', targetNm: 580, logVal: -6.2365 },
  { name: 'Green', hex: '#22c55e', nmRange: '495 – 570 nm', targetNm: 540, logVal: -6.2676 },
  { name: 'Blue', hex: '#0ea5e9', nmRange: '450 – 495 nm', targetNm: 470, logVal: -6.3279 },
  { name: 'Indigo', hex: '#6366f1', nmRange: '425 – 450 nm', targetNm: 435, logVal: -6.3615 },
  { name: 'Violet', hex: '#a855f7', nmRange: '400 – 425 nm', targetNm: 410, logVal: -6.3872 },
];

/**
 * High-accuracy conversion from visible wavelength (nm) to RGB color
 */
function wavelengthToRGB(wavelengthNm) {
  let r = 0, g = 0, b = 0;
  if (wavelengthNm >= 380 && wavelengthNm < 440) {
    r = -(wavelengthNm - 440) / (440 - 380);
    g = 0.0;
    b = 1.0;
  } else if (wavelengthNm >= 440 && wavelengthNm < 490) {
    r = 0.0;
    g = (wavelengthNm - 440) / (490 - 440);
    b = 1.0;
  } else if (wavelengthNm >= 490 && wavelengthNm < 510) {
    r = 0.0;
    g = 1.0;
    b = -(wavelengthNm - 510) / (510 - 490);
  } else if (wavelengthNm >= 510 && wavelengthNm < 580) {
    r = (wavelengthNm - 510) / (580 - 510);
    g = 1.0;
    b = 0.0;
  } else if (wavelengthNm >= 580 && wavelengthNm < 645) {
    r = 1.0;
    g = -(wavelengthNm - 645) / (645 - 580);
    b = 0.0;
  } else if (wavelengthNm >= 645 && wavelengthNm <= 780) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  }

  let factor = 0;
  if (wavelengthNm >= 380 && wavelengthNm < 420) {
    factor = 0.3 + 0.7 * (wavelengthNm - 380) / (420 - 380);
  } else if (wavelengthNm >= 420 && wavelengthNm <= 700) {
    factor = 1.0;
  } else if (wavelengthNm > 700 && wavelengthNm <= 780) {
    factor = 0.3 + 0.7 * (780 - wavelengthNm) / (780 - 700);
  } else {
    factor = 0.0;
  }

  const gamma = 0.8;
  const R = Math.round(255 * Math.pow(Math.max(0, r * factor), gamma));
  const G = Math.round(255 * Math.pow(Math.max(0, g * factor), gamma));
  const B = Math.round(255 * Math.pow(Math.max(0, b * factor), gamma));
  return `rgb(${R}, ${G}, ${B})`;
}

// ============================================================================
// 5. KCSE PHYSICS PROBLEMS MASTER DATABASE
// ============================================================================
const KCSE_PROBLEMS = [
  {
    id: 'kcse_em_p1',
    title: 'Problem 1: Radio Citizen Broadcast Frequency to Wavelength',
    question:
      'A radio transmitter broadcasts FM signals in Nairobi at a carrier frequency of f = 106.7 MHz. Taking the speed of electromagnetic waves in air/vacuum as c = 3.0 × 10⁸ m/s, calculate the physical wavelength λ of the broadcast in metres.',
    unit: 'm',
    target: 2.81,
    tolerance: 0.12,
    formula: 'c = f × λ  ⟹  λ = c / f',
    hint: 'Convert frequency to SI units first: 106.7 MHz = 106.7 × 10⁶ Hz. Then divide speed of light (3.0 × 10⁸ m/s) by frequency.',
    steps: [
      'Recall the fundamental EM wave equation: c = f × λ',
      'Rearrange for wavelength: λ = c / f',
      'Convert 106.7 MHz to standard SI units: f = 106.7 × 10⁶ Hz',
      'Substitute values: λ = (3.0 × 10⁸ m/s) / (106.7 × 10⁶ Hz)',
      'Calculate: λ = 2.8116 m ≈ 2.81 m',
    ],
  },
  {
    id: 'kcse_em_p2',
    title: 'Problem 2: Photon Energy of Green Laboratory Laser Light',
    question:
      'A green laser pointer emits monochromatic light of wavelength λ = 532 nm in a vacuum. Taking Planck\'s constant h = 6.63 × 10⁻³⁴ J·s, c = 3.0 × 10⁸ m/s, and 1 eV = 1.6 × 10⁻¹⁹ J, calculate the energy of a single green photon in electron-volts (eV).',
    unit: 'eV',
    target: 2.34,
    tolerance: 0.12,
    formula: 'E = (h × c) / λ  ⟹  E_eV = E_Joules / (1.6 × 10⁻¹⁹)',
    hint: 'Convert 532 nm to metres: 532 × 10⁻⁹ m. Find energy in Joules using E = hc/λ, then divide by 1.6 × 10⁻¹⁹ to convert to eV.',
    steps: [
      'Convert wavelength to SI metres: λ = 532 nm = 532 × 10⁻⁹ m = 5.32 × 10⁻⁷ m',
      'Apply Planck\'s photon equation: E = h × f = (h × c) / λ',
      'Calculate photon energy in Joules: E = (6.63 × 10⁻³⁴ × 3.0 × 10⁸) / (5.32 × 10⁻⁷) = 3.7387 × 10⁻¹⁹ J',
      'Convert Joules to electron-volts: E_eV = (3.7387 × 10⁻¹⁹ J) / (1.6 × 10⁻¹⁹ J/eV)',
      'Final answer: E = 2.3367 eV ≈ 2.34 eV',
    ],
  },
  {
    id: 'kcse_em_p3',
    title: 'Problem 3: Coolidge X-Ray Tube Duane-Hunt Minimum Wavelength',
    question:
      'A hospital X-ray tube operates at an accelerating potential difference of V = 60 kV (60,000 V). Assuming all kinetic energy of an incident electron is converted into a single photon upon impact, determine the minimum Duane-Hunt cutoff wavelength λ_min in picometres (pm). (h = 6.63 × 10⁻³⁴ J·s, e = 1.6 × 10⁻¹⁹ C, c = 3.0 × 10⁸ m/s, 1 pm = 10⁻¹² m)',
    unit: 'pm',
    target: 20.7,
    tolerance: 1.2,
    formula: 'e × V = h × f_max = (h × c) / λ_min  ⟹  λ_min = (h × c) / (e × V)',
    hint: 'Electron kinetic energy KE = eV = 1.6 × 10⁻¹⁹ × 60,000 = 9.6 × 10⁻¹⁵ J. Then λ_min = hc / (eV). Finally express in pm (10⁻¹² m).',
    steps: [
      'Equate maximum kinetic energy to maximum photon energy: eV = h × f_max = (h × c) / λ_min',
      'Rearrange for Duane-Hunt cutoff wavelength: λ_min = (h × c) / (e × V)',
      'Substitute values: λ_min = (6.63 × 10⁻³⁴ × 3.0 × 10⁸) / (1.6 × 10⁻¹⁹ × 60,000)',
      'Numerator = 1.989 × 10⁻²⁵; Denominator = 9.6 × 10⁻¹⁵',
      'λ_min = 2.071875 × 10⁻¹¹ m = 20.72 × 10⁻¹² m = 20.7 pm',
    ],
  },
];

// ============================================================================
// 6. HELPER FORMATTING FUNCTIONS
// ============================================================================
function formatScientific(val, decimals = 2) {
  if (val === 0 || !isFinite(val)) return '0';
  const exponent = Math.floor(Math.log10(Math.abs(val)));
  const mantissa = val / Math.pow(10, exponent);
  return `${mantissa.toFixed(decimals)} × 10${toSuperscript(exponent)}`;
}

function toSuperscript(num) {
  const map = {
    '-': '⁻',
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
  };
  return String(num)
    .split('')
    .map((c) => map[c] || c)
    .join('');
}

function formatWavelengthPretty(meters) {
  if (meters >= 1e3) return `${(meters / 1e3).toFixed(2)} km`;
  if (meters >= 1) return `${meters.toFixed(2)} m`;
  if (meters >= 1e-2) return `${(meters * 1e2).toFixed(2)} cm`;
  if (meters >= 1e-3) return `${(meters * 1e3).toFixed(2)} mm`;
  if (meters >= 1e-6) return `${(meters * 1e6).toFixed(2)} µm`;
  if (meters >= 1e-9) return `${(meters * 1e9).toFixed(2)} nm`;
  if (meters >= 1e-12) return `${(meters * 1e12).toFixed(2)} pm`;
  return `${(meters * 1e15).toFixed(2)} fm`;
}

function formatFrequencyPretty(hz) {
  if (hz >= 1e21) return `${(hz / 1e21).toFixed(2)} YHz`;
  if (hz >= 1e18) return `${(hz / 1e18).toFixed(2)} EHz`;
  if (hz >= 1e15) return `${(hz / 1e15).toFixed(2)} PHz`;
  if (hz >= 1e12) return `${(hz / 1e12).toFixed(2)} THz`;
  if (hz >= 1e9) return `${(hz / 1e9).toFixed(2)} GHz`;
  if (hz >= 1e6) return `${(hz / 1e6).toFixed(2)} MHz`;
  if (hz >= 1e3) return `${(hz / 1e3).toFixed(2)} kHz`;
  return `${hz.toFixed(1)} Hz`;
}

function formatEnergyEV(ev) {
  if (ev >= 1e9) return `${(ev / 1e9).toFixed(2)} GeV`;
  if (ev >= 1e6) return `${(ev / 1e6).toFixed(2)} MeV`;
  if (ev >= 1e3) return `${(ev / 1e3).toFixed(2)} keV`;
  if (ev >= 1) return `${ev.toFixed(2)} eV`;
  if (ev >= 1e-3) return `${(ev * 1e3).toFixed(2)} meV`;
  return `${(ev * 1e6).toFixed(2)} µeV`;
}

// ============================================================================
// 7. MAIN SIMULATION COMPONENT
// ============================================================================
export default function EMSpectrumAnalyzerSim({ config = {}, onTelemetry }) {
  // State: Log10 of wavelength in metres. Default: 550 nm (Green visible light)
  // log10(550e-9) = log10(5.5e-7) ≈ -6.259637
  const DEFAULT_LOG_WAVELENGTH = -6.259637;
  const [logWavelength, setLogWavelength] = useState(DEFAULT_LOG_WAVELENGTH);

  // Active UI tab: 'explorer' | 'properties' | 'applications' | 'practice'
  const [activeTab, setActiveTab] = useState('explorer');

  // Animation controls for the transverse wave canvas
  const [isPlaying, setIsPlaying] = useState(true);
  const [waveSpeedMultiplier, setWaveSpeedMultiplier] = useState(1.0);

  // KCSE Interactive practice problem states
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [practiceStatus, setPracticeStatus] = useState(null); // null | 'correct' | 'incorrect'
  const [showSolution, setShowSolution] = useState(false);

  // Canvas ref
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const phaseRef = useRef(0);

  // Telemetry logger helper
  const logTelemetry = useCallback(
    (eventName, payload) => {
      if (typeof onTelemetry === 'function') {
        onTelemetry(eventName, {
          timestamp: Date.now(),
          simKey: 'em_spectrum_analyzer_bands',
          ...payload,
        });
      }
    },
    [onTelemetry]
  );

  // Log mount
  useEffect(() => {
    logTelemetry('sim_mounted', { initialLogLambda: DEFAULT_LOG_WAVELENGTH });
  }, [logTelemetry]);

  // Derived Physical Variables
  const wavelengthMeters = useMemo(() => Math.pow(10, logWavelength), [logWavelength]);
  const frequencyHz = useMemo(() => C_VACUUM / wavelengthMeters, [wavelengthMeters]);
  const photonEnergyJoules = useMemo(() => PLANCK_H * frequencyHz, [frequencyHz]);
  const photonEnergyEV = useMemo(() => photonEnergyJoules / EV_TO_J, [photonEnergyJoules]);
  const blackbodyPeakTempK = useMemo(() => WIEN_B / wavelengthMeters, [wavelengthMeters]);
  const blackbodyPeakTempC = useMemo(() => blackbodyPeakTempK - 273.15, [blackbodyPeakTempK]);

  // Determine current active spectral band
  const currentBand = useMemo(() => {
    const found = SPECTRAL_BANDS.find(
      (b) => logWavelength >= b.logMin && logWavelength <= b.logMax
    );
    if (found) return found;
    // Edge guards
    if (logWavelength < -11.0) return SPECTRAL_BANDS[6]; // Gamma
    return SPECTRAL_BANDS[0]; // Radio
  }, [logWavelength]);

  // Determine if radiation is ionizing
  const isIonizing = useMemo(() => photonEnergyEV >= IONIZING_ENERGY_EV_THRESHOLD, [photonEnergyEV]);

  // Determine matching scale benchmark
  const currentBenchmark = useMemo(() => {
    const b = SCALE_BENCHMARKS.find(
      (item) => logWavelength <= item.logMax && logWavelength >= item.logMin
    );
    return b || SCALE_BENCHMARKS[SCALE_BENCHMARKS.length - 1];
  }, [logWavelength]);

  // Check if current wavelength is in visible range (approx 380 nm to 750 nm)
  const isVisibleRange = useMemo(() => {
    const nm = wavelengthMeters * 1e9;
    return nm >= 380 && nm <= 780;
  }, [wavelengthMeters]);

  const visibleNm = useMemo(() => wavelengthMeters * 1e9, [wavelengthMeters]);
  const visibleColorHex = useMemo(() => {
    if (!isVisibleRange) return currentBand.color;
    return wavelengthToRGB(visibleNm);
  }, [isVisibleRange, visibleNm, currentBand.color]);

  // Astronomical / Thermal Analogue context for Wien's Law
  const thermalAnalogue = useMemo(() => {
    if (blackbodyPeakTempK < 3.0) return 'Cosmic Microwave Background (CMBR at 2.73 K, ancient Big Bang remnant)';
    if (blackbodyPeakTempK < 50) return 'Cold interstellar molecular dust clouds in deep outer space';
    if (blackbodyPeakTempK < 200) return 'Surface of Outer Solar System Moons (e.g. Titan, Europa)';
    if (blackbodyPeakTempK < 350) return 'Earth surface temperature (~290 K / 17 °C) & Human Body infrared emission';
    if (blackbodyPeakTempK < 1000) return 'Hot domestic stove element / charcoal embers emitting deep dull red IR';
    if (blackbodyPeakTempK < 3500) return 'Incandescent tungsten lamp filament (~2,800 K) emitting warm yellow-white';
    if (blackbodyPeakTempK < 7500) return "Sun's Photosphere surface (~5,778 K) peaking in green-yellow visible light";
    if (blackbodyPeakTempK < 30000) return 'Massive O-type Blue Giant stars radiating powerful ultraviolet flux';
    if (blackbodyPeakTempK < 5000000) return 'Solar Corona / superheated stellar accretion discs radiating soft X-rays';
    return 'Supernova explosion blast fronts & hyper-dense neutron star collapses producing Gamma photons';
  }, [blackbodyPeakTempK]);

  // Handle band jump
  const handleJumpBand = (band) => {
    setLogWavelength(band.defaultLog);
    logTelemetry('band_jump', { bandId: band.id, defaultLog: band.defaultLog });
  };

  // Handle direct visible color jump
  const handleJumpVisibleColor = (col) => {
    setLogWavelength(col.logVal);
    logTelemetry('visible_color_jump', { colorName: col.name, targetNm: col.targetNm });
  };

  // Reset to default
  const handleReset = () => {
    setLogWavelength(DEFAULT_LOG_WAVELENGTH);
    setIsPlaying(true);
    setWaveSpeedMultiplier(1.0);
    setPracticeStatus(null);
    setUserAnswer('');
    setShowSolution(false);
    logTelemetry('reset_state', { defaultLog: DEFAULT_LOG_WAVELENGTH });
  };

  // KCSE problem check handler
  const handleCheckPractice = (e) => {
    e.preventDefault();
    const problem = KCSE_PROBLEMS[activeProblemIdx];
    const parsed = parseFloat(userAnswer);
    if (isNaN(parsed)) {
      setPracticeStatus('invalid');
      return;
    }

    const diff = Math.abs(parsed - problem.target);
    const isCorrect = diff <= problem.tolerance;
    setPracticeStatus(isCorrect ? 'correct' : 'incorrect');
    logTelemetry('kcse_problem_submit', {
      problemId: problem.id,
      userAnswer: parsed,
      target: problem.target,
      isCorrect,
    });
  };

  // ============================================================================
  // 8. CANVAS ANIMATION: DYNAMIC TRANSVERSE EM WAVE
  // ============================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear dark laboratory background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
      ctx.lineWidth = 1;
      const gridSpacing = 40;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const centerY = height / 2;

      // Draw central propagation axis (Direction of c)
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, centerY);
      ctx.lineTo(width - 30, centerY);
      ctx.stroke();

      // Axis Arrowhead
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(width - 30, centerY - 6);
      ctx.lineTo(width - 16, centerY);
      ctx.lineTo(width - 30, centerY + 6);
      ctx.fill();

      // Axis Label
      ctx.font = '10px ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Direction of Wave Propagation (c = 3.0 × 10⁸ m/s)', width - 290, centerY - 10);

      // Map slider position to visual wave parameters
      // Visual spatial wavelength: from wide slow ripples (radio) to tight dense ripples (gamma)
      // logWavelength: -14 to +4 (span of 18)
      // Normalized: 0 (gamma, tightest) to 1 (radio, widest)
      const normLog = (logWavelength + 14) / 18; // 0 to 1
      const visualLambda = 45 + normLog * 220; // 45px (gamma) to 265px (radio)
      const visualAmplitude = 55; // pixels
      const k = (2 * Math.PI) / visualLambda;

      // Speed: higher frequency waves visually oscillate with greater energy
      const visualSpeed = (1.5 + (1 - normLog) * 4.5) * waveSpeedMultiplier;

      if (isPlaying) {
        phaseRef.current += visualSpeed * 0.035;
      }

      const phase = phaseRef.current;
      const beamColor = isVisibleRange ? visibleColorHex : currentBand.color;

      // Draw vertical electric field vectors under the wave
      const vectorStep = Math.max(12, Math.floor(visualLambda / 10));
      for (let x = 30; x < width - 40; x += vectorStep) {
        const yVal = visualAmplitude * Math.sin(k * x - phase);
        ctx.strokeStyle = isVisibleRange ? visibleColorHex : currentBand.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(x, centerY);
        ctx.lineTo(x, centerY - yVal);
        ctx.stroke();

        // Vector arrowhead
        if (Math.abs(yVal) > 8) {
          const arrowDir = yVal > 0 ? -1 : 1;
          ctx.fillStyle = isVisibleRange ? visibleColorHex : currentBand.color;
          ctx.beginPath();
          ctx.moveTo(x, centerY - yVal);
          ctx.lineTo(x - 3, centerY - yVal - arrowDir * 5);
          ctx.lineTo(x + 3, centerY - yVal - arrowDir * 5);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;

      // Draw glowing sinusoidal electric field curve
      ctx.save();
      ctx.shadowColor = beamColor;
      ctx.shadowBlur = 14;
      ctx.strokeStyle = beamColor;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let x = 20; x < width - 25; x += 2) {
        const y = centerY - visualAmplitude * Math.sin(k * x - phase);
        if (x === 20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // Wavelength caliper dimension overlay
      // Find two consecutive crests on screen
      // crest when k*x - phase = PI/2 + 2*PI*n => x = (PI/2 + phase + 2*PI*n) / k
      const crest1 = ((Math.PI / 2 + phase) % (2 * Math.PI)) / k;
      let c1 = crest1;
      while (c1 < 60) c1 += visualLambda;
      const c2 = c1 + visualLambda;

      if (c2 < width - 40) {
        const caliperY = centerY - visualAmplitude - 26;

        ctx.strokeStyle = '#facc15'; // Amber yellow
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);

        // Vertical drop guidelines from crests to caliper
        ctx.beginPath();
        ctx.moveTo(c1, centerY - visualAmplitude);
        ctx.lineTo(c1, caliperY);
        ctx.moveTo(c2, centerY - visualAmplitude);
        ctx.lineTo(c2, caliperY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Caliper horizontal bar with arrows
        ctx.beginPath();
        ctx.moveTo(c1, caliperY);
        ctx.lineTo(c2, caliperY);
        ctx.stroke();

        // Arrows on caliper
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(c1, caliperY);
        ctx.lineTo(c1 + 6, caliperY - 3);
        ctx.lineTo(c1 + 6, caliperY + 3);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(c2, caliperY);
        ctx.lineTo(c2 - 6, caliperY - 3);
        ctx.lineTo(c2 - 6, caliperY + 3);
        ctx.fill();

        // Label on caliper
        ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif';
        ctx.fillStyle = '#fef08a';
        ctx.textAlign = 'center';
        ctx.fillText(`λ = ${formatWavelengthPretty(wavelengthMeters)}`, (c1 + c2) / 2, caliperY - 6);
      }

      // Draw active band and frequency telemetry banner overlay
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.fillRect(20, height - 42, width - 40, 32);
      ctx.strokeRect(20, height - 42, width - 40, 32);

      ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = beamColor;
      ctx.fillText(`Active Band: ${currentBand.name.toUpperCase()}`, 35, height - 22);

      ctx.fillStyle = '#cbd5e1';
      ctx.textAlign = 'center';
      ctx.fillText(`f = ${formatFrequencyPretty(frequencyHz)}`, width / 2, height - 22);

      ctx.textAlign = 'right';
      ctx.fillStyle = isIonizing ? '#f43f5e' : '#4ade80';
      ctx.fillText(isIonizing ? '● IONIZING RADIATION' : '● NON-IONIZING', width - 35, height - 22);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [
    logWavelength,
    isPlaying,
    waveSpeedMultiplier,
    currentBand,
    wavelengthMeters,
    frequencyHz,
    isIonizing,
    isVisibleRange,
    visibleColorHex,
  ]);

  return (
    <div className="flex flex-col w-full min-h-[750px] bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-sans select-none">
      {/* ==================================================================== */}
      {/* 1. TOP HEADER & TELEMETRY STATUS BAR */}
      {/* ==================================================================== */}
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors"
            style={{
              backgroundColor: isVisibleRange ? visibleColorHex : currentBand.color,
              boxShadow: `0 0 20px ${currentBand.glowColor}`,
            }}
          >
            <Activity className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              Interactive EM Spectrum Bands & Wavelength Analyzer
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Form 4 Physics
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Topic 4: Electromagnetic Spectrum • Lesson 245: Spectral Band Analysis & Speed of Light
            </p>
          </div>
        </div>

        {/* Global Quick Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Ionization Status Pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-inner transition-all ${
              isIonizing
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-950 animate-pulse'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-emerald-950'
            }`}
          >
            {isIonizing ? (
              <>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>IONIZING HAZARD (E ≥ 10 eV)</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>NON-IONIZING (Safe at normal levels)</span>
              </>
            )}
          </div>

          {/* Reset Button (Restores Green Light 550nm) */}
          <button
            onClick={handleReset}
            title="Reset to Visible Green Light (550 nm)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset (550 nm)</span>
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. SUB-NAVIGATION TABS */}
      {/* ==================================================================== */}
      <nav className="flex items-center gap-1 px-6 py-2 bg-slate-900/60 border-b border-slate-800/60 overflow-x-auto">
        {[
          { id: 'explorer', label: 'Spectrum Explorer & Dual Scales', icon: Sliders },
          { id: 'properties', label: 'Quantitative Telemetry & Wien’s Law', icon: Zap },
          { id: 'applications', label: 'KCSE Syllabus Master Analysis', icon: Layers },
          { id: 'practice', label: 'KCSE Exam Calculation Practice', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* ==================================================================== */}
      {/* 3. TAB 1: SPECTRUM EXPLORER & DUAL SCALES */}
      {/* ==================================================================== */}
      {activeTab === 'explorer' && (
        <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-6">
          {/* Quick Jump Band Selector Buttons */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Select Major Electromagnetic Band (Decreasing λ / Increasing Frequency & Energy):
              </span>
              <span className="hidden sm:inline text-slate-500">Click to jump directly</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {SPECTRAL_BANDS.map((b) => {
                const isSelected = currentBand.id === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => handleJumpBand(b)}
                    className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? `${b.borderActive} bg-slate-800/90 shadow-lg scale-102`
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: b.color }}
                      />
                      <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {b.shortName}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">{b.waveRange}</span>
                    {isSelected && (
                      <span
                        className="absolute -bottom-1 w-10 h-0.5 rounded-full"
                        style={{ backgroundColor: b.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Continuous Logarithmic Spectrum Ribbon */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-inner space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                <span className="text-slate-200">Continuous Spectrum Logarithmic Slider (10⁻¹⁴ m to 10⁺⁴ m):</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-slate-400">
                  log₁₀(λ) = <strong className="text-white">{logWavelength.toFixed(2)}</strong>
                </span>
                <span className="text-sky-300 font-bold">
                  λ = {formatWavelengthPretty(wavelengthMeters)} ({formatScientific(wavelengthMeters, 2)} m)
                </span>
              </div>
            </div>

            {/* Slider with Gradient Visual Background */}
            <div className="relative pt-2 pb-1">
              {/* Spectral gradient bar representing the 7 bands */}
              <div
                className="h-7 w-full rounded-xl relative overflow-hidden flex items-center shadow-inner cursor-pointer"
                style={{
                  background:
                    'linear-gradient(to right, #f43f5e 0%, #38bdf8 17%, #c084fc 33%, #22c55e 42%, #eab308 44%, #f87171 48%, #2dd4bf 65%, #38bdf8 100%)',
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const fraction = (e.clientX - rect.left) / rect.width;
                  // Left is 10^-14 (gamma), Right is 10^+4 (radio)
                  const newLog = -14.0 + fraction * 18.0;
                  setLogWavelength(Math.max(-14.0, Math.min(4.0, newLog)));
                }}
              >
                {/* Visual band boundary ticks */}
                <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none text-[9px] font-black text-slate-950 uppercase opacity-75">
                  <span>Gamma (10⁻¹⁴)</span>
                  <span>X-Ray</span>
                  <span>UV</span>
                  <span className="font-extrabold text-white drop-shadow-md">Visible</span>
                  <span>Infrared</span>
                  <span>Micro</span>
                  <span>Radio (10⁴)</span>
                </div>
              </div>

              {/* Native Range Slider */}
              <input
                type="range"
                min="-14.0"
                max="4.0"
                step="0.02"
                value={logWavelength}
                onChange={(e) => setLogWavelength(parseFloat(e.target.value))}
                className="w-full mt-2 accent-sky-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />

              {/* Order of magnitude ticks */}
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 px-1">
                <span>10⁻¹⁴ m (fm)</span>
                <span>10⁻¹¹ m</span>
                <span>10⁻⁸ m</span>
                <span>10⁻⁵ m</span>
                <span>10⁻² m (cm)</span>
                <span>10⁺¹ m</span>
                <span>10⁺⁴ m (km)</span>
              </div>
            </div>

            {/* Micro Fine-Tuning Step Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-xs">
              <span className="text-slate-400">Step Fine Adjustment:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setLogWavelength((prev) => Math.max(-14.0, prev - 1.0))}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  −10× λ (Higher Energy)
                </button>
                <button
                  onClick={() => setLogWavelength((prev) => Math.max(-14.0, prev - 0.1))}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  −0.1 log
                </button>
                <button
                  onClick={() => setLogWavelength((prev) => Math.min(4.0, prev + 0.1))}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  +0.1 log
                </button>
                <button
                  onClick={() => setLogWavelength((prev) => Math.min(4.0, prev + 1.0))}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  +10× λ (Lower Energy)
                </button>
              </div>
            </div>
          </div>

          {/* Visible Light Color Breakdown Sub-Bar (Active when in visible or nearby) */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isVisibleRange
                ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                : 'bg-slate-900/40 border-slate-800/80 opacity-85'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">Visible Light Spectrum Breakdown (400 nm to 700 nm):</span>
                {isVisibleRange && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Active Optical Window
                  </span>
                )}
              </div>
              {isVisibleRange && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Current Visible Swatch:</span>
                  <div
                    className="w-5 h-5 rounded-md border border-white/40 shadow-inner"
                    style={{ backgroundColor: visibleColorHex }}
                  />
                  <span className="text-xs font-mono font-bold text-white">
                    {visibleNm.toFixed(1)} nm
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {VISIBLE_COLORS.map((col) => {
                const isColActive =
                  isVisibleRange &&
                  Math.abs(visibleNm - col.targetNm) <= (col.name === 'Red' ? 40 : 25);
                return (
                  <button
                    key={col.name}
                    onClick={() => handleJumpVisibleColor(col)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isColActive
                        ? 'bg-slate-800 border-white/60 shadow-md scale-102'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full shrink-0 border border-white/30"
                      style={{ backgroundColor: col.hex }}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">{col.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{col.nmRange}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dual Main Panels: Dynamic Transverse Waveform & Real-World Scale Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Panel A: Dynamic Transverse Waveform Canvas (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Transverse Waveform & Caliper Dimension
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <select
                    value={waveSpeedMultiplier}
                    onChange={(e) => setWaveSpeedMultiplier(parseFloat(e.target.value))}
                    className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono"
                  >
                    <option value={0.5}>0.5× Speed</option>
                    <option value={1.0}>1.0× Speed</option>
                    <option value={2.0}>2.0× Speed</option>
                  </select>
                </div>
              </div>

              {/* Canvas element */}
              <div className="relative w-full h-[220px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={220}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>
                  Electric field vector <strong className="text-slate-200">E(x, t)</strong> oscillates perpendicular to wave propagation.
                </span>
                <span className="font-mono text-amber-300 font-semibold">
                  λ = c / f = {formatWavelengthPretty(wavelengthMeters)}
                </span>
              </div>
            </div>

            {/* Panel B: Real-World Physical Scale Benchmark Visualizer (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <Atom className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Relative Physical Scale Benchmark
                </h2>
              </div>

              {/* Benchmark Visual Card */}
              <div className="flex flex-col flex-1 p-4 rounded-xl bg-slate-950 border border-slate-800 justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                      {currentBenchmark.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                      {currentBenchmark.sizeLabel}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white">{currentBenchmark.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentBenchmark.comparison}
                  </p>
                </div>

                {/* Scale Comparison Bar Visual */}
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Selected Wavelength:</span>
                    <span className="font-mono font-bold text-white">
                      {formatWavelengthPretty(wavelengthMeters)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Equivalence:</span>
                    <span className="font-mono text-emerald-300 font-semibold">
                      10{toSuperscript(Math.round(logWavelength))} metres
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(5, Math.min(100, ((logWavelength + 14) / 18) * 100))}%`,
                        backgroundColor: isVisibleRange ? visibleColorHex : currentBand.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>Atomic Nucleus (10⁻¹⁴)</span>
                    <span>Hair (10⁻⁴)</span>
                    <span>Mountain (10⁺⁴)</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 italic">
                  Tip: Shorter wavelengths resolve smaller structures in microscopy and radiography (Diffraction limit: d ≈ λ/2).
                </div>
              </div>
            </div>
          </div>

          {/* 4 Quantitative Derived Parameter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Wavelength */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 shadow-sm">
              <span className="text-xs text-slate-400 font-semibold block">Wavelength (λ)</span>
              <div className="text-xl font-black text-white font-mono">
                {formatWavelengthPretty(wavelengthMeters)}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {formatScientific(wavelengthMeters, 3)} m
              </div>
            </div>

            {/* Card 2: Frequency */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 shadow-sm">
              <span className="text-xs text-slate-400 font-semibold block">Frequency (f = c / λ)</span>
              <div className="text-xl font-black text-sky-400 font-mono">
                {formatFrequencyPretty(frequencyHz)}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {formatScientific(frequencyHz, 3)} Hz
              </div>
            </div>

            {/* Card 3: Photon Energy */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 shadow-sm">
              <span className="text-xs text-slate-400 font-semibold block">Photon Energy (E = h·f)</span>
              <div className="text-xl font-black text-amber-400 font-mono">
                {formatEnergyEV(photonEnergyEV)}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {formatScientific(photonEnergyJoules, 3)} Joules
              </div>
            </div>

            {/* Card 4: Wien's Peak Temperature */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 shadow-sm">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                Blackbody Peak Temp (Wien's Law)
              </span>
              <div className="text-xl font-black text-rose-400 font-mono">
                {blackbodyPeakTempK < 1e6
                  ? `${blackbodyPeakTempK.toLocaleString(undefined, { maximumFractionDigits: 1 })} K`
                  : `${formatScientific(blackbodyPeakTempK, 2)} K`}
              </div>
              <div className="text-[11px] text-slate-400 font-mono truncate">
                {blackbodyPeakTempC < 1e6
                  ? `${blackbodyPeakTempC.toLocaleString(undefined, { maximumFractionDigits: 1 })} °C`
                  : 'Extreme Stellar Core'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. TAB 2: QUANTITATIVE TELEMETRY & WIEN’S LAW */}
      {/* ==================================================================== */}
      {activeTab === 'properties' && (
        <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-6">
          {/* Active Band Deep-Dive Header */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-slate-950 shadow-md"
                  style={{ backgroundColor: currentBand.color }}
                >
                  {currentBand.shortName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">{currentBand.name}</h2>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${currentBand.badgeBg}`}>
                      {currentBand.hazardLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Speed in Free Space: <strong className="text-white">c = 2.998 × 10⁸ m/s</strong> (Invariable in vacuum)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700"
                >
                  Reset Default
                </button>
              </div>
            </div>

            {/* Core Band Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-semibold block">Wavelength Limits:</span>
                <span className="text-base font-bold text-sky-400 font-mono">{currentBand.waveRange}</span>
                <span className="text-[11px] text-slate-500 block">KCSE syllabus standard classification</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-semibold block">Frequency Limits:</span>
                <span className="text-base font-bold text-emerald-400 font-mono">{currentBand.freqRange}</span>
                <span className="text-[11px] text-slate-500 block">Inversely proportional to wavelength (c = fλ)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-semibold block">Single Photon Energy:</span>
                <span className="text-base font-bold text-amber-400 font-mono">{currentBand.energyRange}</span>
                <span className="text-[11px] text-slate-500 block">Directly proportional to frequency (E = hf)</span>
              </div>
            </div>
          </div>

          {/* Wien's Displacement Law & Thermal Physics Callout */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Wien's Displacement Law: Thermal Peak Radiation (λ_max · T = b)
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    According to Wien’s Displacement Law, an idealized blackbody emitter at absolute temperature{' '}
                    <strong className="text-white">T (in Kelvin)</strong> radiates continuous electromagnetic radiation
                    peaking at a wavelength inversely proportional to its temperature:
                  </p>
                  <div className="font-mono text-xs text-amber-300 font-bold bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 inline-block">
                    λ_peak × T = b = 2.898 × 10⁻³ m·K ⟹ T = b / λ
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-right min-w-[200px]">
                  <span className="text-[11px] text-slate-400 block font-medium">Equivalent Blackbody Peak:</span>
                  <div className="text-xl font-black text-amber-400 font-mono">
                    {blackbodyPeakTempK < 1e6
                      ? `${blackbodyPeakTempK.toLocaleString(undefined, { maximumFractionDigits: 1 })} K`
                      : `${formatScientific(blackbodyPeakTempK, 2)} K`}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    ({blackbodyPeakTempC < 1e6 ? `${blackbodyPeakTempC.toFixed(1)} °C` : 'Stellar Core'})
                  </span>
                </div>
              </div>

              {/* Physical / Astrophysical Match Card */}
              <div className="p-3 rounded-lg bg-slate-900/90 border border-amber-500/30 flex items-center gap-3">
                <Sun className="w-6 h-6 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-amber-300">Cosmic / Natural Analogue for Current λ: </span>
                  <span className="text-slate-200">{thermalAnalogue}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Master 7-Band Comparison Table */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Comprehensive Electromagnetic Spectrum Master Table (KCSE Reference)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Band</th>
                    <th className="py-2.5 px-3">Wavelength λ</th>
                    <th className="py-2.5 px-3">Frequency f</th>
                    <th className="py-2.5 px-3">Photon Energy E</th>
                    <th className="py-2.5 px-3">Ionizing Status</th>
                    <th className="py-2.5 px-3">Atmospheric Penetration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {SPECTRAL_BANDS.map((b) => {
                    const isSelected = currentBand.id === b.id;
                    return (
                      <tr
                        key={b.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-slate-800/80 font-bold text-white' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3 px-3 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                          <span className="font-sans font-bold">{b.name}</span>
                        </td>
                        <td className="py-3 px-3 text-sky-300">{b.waveRange}</td>
                        <td className="py-3 px-3 text-emerald-300">{b.freqRange}</td>
                        <td className="py-3 px-3 text-amber-300">{b.energyRange}</td>
                        <td className="py-3 px-3 font-sans">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              b.isIonizing
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {b.isIonizing ? 'Ionizing' : 'Non-Ionizing'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">{b.atmosphere}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. TAB 3: APPLICATIONS, DETECTORS & HAZARDS */}
      {/* ==================================================================== */}
      {activeTab === 'applications' && (
        <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-400" />
                KCSE Syllabus Master Analysis: Production, Detection, Applications & Hazards
              </h2>
              <p className="text-xs text-slate-400">
                Detailed breakdown for active band: <strong className="text-sky-300">{currentBand.name}</strong>
              </p>
            </div>

            {/* Quick band tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {SPECTRAL_BANDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleJumpBand(b)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    currentBand.id === b.id
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {b.shortName}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Box 1: Generation & Production Mechanisms */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                Production & Generation Mechanism
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{currentBand.generation}</p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                <strong className="text-amber-300 block mb-1">Key Physical Principle:</strong>
                All EM waves originate from accelerated electrical charges. When an electric charge undergoes acceleration, it radiates oscillating orthogonal electric and magnetic fields.
              </div>
            </div>

            {/* Box 2: Detection Devices & Scientific Instruments */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                <Eye className="w-4 h-4" />
                Detectors & Sensor Principles
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{currentBand.detection}</p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                <strong className="text-sky-300 block mb-1">Detection Mechanism:</strong>
                EM waves deposit energy into detectors by exciting resonance, photo-electric release of electrons, photochemical reactions, or ionizing target gas molecules.
              </div>
            </div>

            {/* Box 3: Everyday, Industrial & Medical Applications */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Award className="w-4 h-4" />
                Real-World Kenyan & Global Applications
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                {currentBand.applications.map((app, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Box 4: Radiation Hazards, Ionization & Safety Precautions */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                Biological Hazards & Safety Precautions
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{currentBand.hazards}</p>
              <div
                className={`p-3 rounded-xl border text-[11px] space-y-1 ${
                  currentBand.isIonizing
                    ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                    : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                }`}
              >
                <strong className="block font-bold">
                  {currentBand.isIonizing
                    ? '⚠️ Critical Precaution (ALARA Protocol):'
                    : '✓ Non-Ionizing Safety Summary:'}
                </strong>
                <span>
                  {currentBand.isIonizing
                    ? 'Employ the 3 Cardinal Rules of Radiation Protection: Minimize Exposure Time, Maximize Distance (Inverse Square Law), and use Dense Lead (Pb) / Barium Concrete Shielding.'
                    : 'Safe at environmental levels. For high-power microwaves, ensure microwave oven door interlocks are intact. For high-power IR/Lasers, wear certified optical protective goggles.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. TAB 4: KCSE EXAM CALCULATION PRACTICE */}
      {/* ==================================================================== */}
      {activeTab === 'practice' && (
        <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                KCSE Physics Paper 2: Spectral Band & Wave Equation Practice
              </h2>
              <p className="text-xs text-slate-400">
                Solve authentic past exam problems testing wave speed, frequency, photon energy, and cutoff limits.
              </p>
            </div>

            {/* Problem selector tabs */}
            <div className="flex items-center gap-2">
              {KCSE_PROBLEMS.map((prob, idx) => (
                <button
                  key={prob.id}
                  onClick={() => {
                    setActiveProblemIdx(idx);
                    setPracticeStatus(null);
                    setUserAnswer('');
                    setShowSolution(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeProblemIdx === idx
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  Problem {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active Problem Card */}
          {(() => {
            const currentProb = KCSE_PROBLEMS[activeProblemIdx];
            return (
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-lg">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {currentProb.title}
                  </span>
                  <p className="text-sm text-slate-100 leading-relaxed font-medium">
                    {currentProb.question}
                  </p>
                  <div className="inline-block px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300">
                    Governing Equation: {currentProb.formula}
                  </div>
                </div>

                {/* Input Form */}
                <form onSubmit={handleCheckPractice} className="flex flex-wrap items-end gap-3 pt-2">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Calculated Answer:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g. 2.81"
                        value={userAnswer}
                        onChange={(e) => {
                          setUserAnswer(e.target.value);
                          setPracticeStatus(null);
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400 w-44 shadow-inner"
                      />
                      <span className="text-sm font-bold text-slate-300 font-mono">{currentProb.unit}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                  >
                    Submit Answer
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSolution(!showSolution)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    {showSolution ? 'Hide Marking Scheme' : 'View KCSE Marking Scheme'}
                  </button>
                </form>

                {/* Feedback Banner */}
                {practiceStatus === 'correct' && (
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center gap-3 text-emerald-200 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <strong className="block text-sm font-bold text-emerald-300">
                        Excellent! Correct Calculation (+3 Marks)
                      </strong>
                      <span>
                        Your answer of {userAnswer} {currentProb.unit} matches the expected target of {currentProb.target} {currentProb.unit} within accepted syllabus tolerance.
                      </span>
                    </div>
                  </div>
                )}

                {practiceStatus === 'incorrect' && (
                  <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 flex items-center gap-3 text-rose-200 text-xs">
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <strong className="block text-sm font-bold text-rose-300">
                        Incorrect Answer. Review Metric Conversions
                      </strong>
                      <span>
                        Hint: {currentProb.hint}
                      </span>
                    </div>
                  </div>
                )}

                {practiceStatus === 'invalid' && (
                  <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-center gap-3 text-amber-200 text-xs">
                    <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Please enter a valid numerical answer before submitting.</span>
                  </div>
                )}

                {/* Step-by-Step KCSE Marking Scheme Solution */}
                {showSolution && (
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Official KCSE Step-by-Step Marking Scheme:
                    </h4>
                    <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside font-mono">
                      {currentProb.steps.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <span className="font-sans text-slate-200">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 7. FOOTER */}
      {/* ==================================================================== */}
      <footer className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span>Fundamental Constants:</span>
          <span className="font-mono text-slate-300">c = 3.0×10⁸ m/s</span>
          <span>•</span>
          <span className="font-mono text-slate-300">h = 6.63×10⁻³⁴ J·s</span>
          <span>•</span>
          <span className="font-mono text-slate-300">b = 2.898×10⁻³ m·K</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Kenya National Curriculum (KCSE Physics Form 4)</span>
          <span className="text-emerald-400 font-semibold">● Real-time Simulation Engine Active</span>
        </div>
      </footer>
    </div>
  );
}
