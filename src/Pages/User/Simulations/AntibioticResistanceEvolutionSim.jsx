import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Disc,
  Activity,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  GitBranch,
  Pill,
  Users
} from 'lucide-react';

// Antibiotic profiles for Disc Diffusion assay
const ANTIBIOTICS = {
  penicillin: {
    id: 'penicillin',
    name: 'Penicillin (P-10)',
    potency: 10, // micrograms
    target: 'Peptidoglycan transpeptidase (cell wall synthesis)',
    color: '#38bdf8', // sky
    code: 'PEN',
    susceptibleZoneRadius: 82, // px on canvas
    resistantZoneRadius: 28,
  },
  ampicillin: {
    id: 'ampicillin',
    name: 'Ampicillin (AMP-25)',
    potency: 25,
    target: 'Broad-spectrum beta-lactam cell wall inhibitor',
    color: '#818cf8', // indigo
    code: 'AMP',
    susceptibleZoneRadius: 95,
    resistantZoneRadius: 32,
  },
  tetracycline: {
    id: 'tetracycline',
    name: 'Tetracycline (TE-30)',
    potency: 30,
    target: '30S ribosomal subunit (blocks aminoacyl-tRNA)',
    color: '#f59e0b', // amber
    code: 'TET',
    susceptibleZoneRadius: 88,
    resistantZoneRadius: 30,
  }
};

// KCSE Exam Challenge Questions on Antimicrobial Evolution & Natural Selection
const KCSE_CHALLENGES = [
  {
    id: 1,
    question: "According to Darwinian natural selection, how does antibiotic resistance primarily arise in a previously susceptible bacterial population?",
    options: [
      "The antibiotic causes bacteria to adaptively mutate in order to survive",
      "Spontaneous random mutations provide pre-existing resistance alleles; the antibiotic acts as a selective agent",
      "Bacteria consciously build thicker peptidoglycan walls when exposed to sub-lethal doses",
      "Susceptible bacteria learn to neutralize beta-lactam rings after multiple exposures"
    ],
    correctIndex: 1,
    explanation: "Mutations occur spontaneously and randomly before exposure. The antibiotic does not induce resistance; rather, it acts as an environmental selection pressure, eliminating susceptible strains and leaving resistant mutants to proliferate."
  },
  {
    id: 2,
    question: "What is the medical danger of a patient discontinuing an antibiotic course prematurely on Day 3 instead of completing the prescribed 7 days?",
    options: [
      "The patient's immune system stops producing white blood cells",
      "Only the most susceptible bacteria are cleared; partially/highly resistant mutants survive and multiply, establishing a drug-resistant strain",
      "The antibiotic permanently converts into a toxic carcinogenic byproduct in the bloodstream",
      "All remaining bacteria immediately undergo horizontal autolysis"
    ],
    correctIndex: 1,
    explanation: "Stopping treatment prematurely leaves intermediate and mutant resistant bacteria uneliminated. Free from competition with susceptible strains, these resistant bacteria multiply rapidly, causing a relapse that fails subsequent treatment."
  },
  {
    id: 3,
    question: "In the Kirby-Bauer disc diffusion assay, what does a large, clear 'Zone of Inhibition' surrounding an antibiotic disc signify?",
    options: [
      "The bacteria are highly susceptible (sensitive) to the antibiotic diffused through the agar",
      "The bacteria possess high hydrolytic beta-lactamase enzyme activity",
      "The bacteria produce a biofilm that pushes the antibiotic away",
      "The antibiotic molecules degraded and precipitated into harmless crystals"
    ],
    correctIndex: 0,
    explanation: "A wide clear zone of inhibition indicates that the diffused antibiotic successfully killed or inhibited the surrounding bacteria, meaning the bacterial lawn is highly sensitive/susceptible to that drug."
  },
  {
    id: 4,
    question: "Through which mechanism can a non-resistant bacterium directly acquire an r-plasmid (resistance plasmid) from a resistant donor bacterium?",
    options: [
      "Binary fission during vegetative exponential growth",
      "Bacterial conjugation via a sex pilus cytoplasmic mating bridge",
      "Osmotic endocytosis of large capsular lipopolysaccharides",
      "Mitotic spindle alignment across the mesosome septum"
    ],
    correctIndex: 1,
    explanation: "Conjugation is horizontal gene transfer where a donor bacterium (F⁺ or carrying an r-plasmid) extends a sex pilus to form a cytoplasmic bridge, transferring a replicated copy of the resistance plasmid into a recipient."
  },
  {
    id: 5,
    question: "Which of the following is an effective measure recommended in Kenya to prevent the spread of multi-drug resistant 'superbugs'?",
    options: [
      "Over-the-counter dispensing of broad-spectrum antibiotics without medical prescription",
      "Adding prophylactic antibiotics to livestock feed to boost cattle weight",
      "Strict completion of prescribed antibiotic regimens and laboratory culture sensitivity testing",
      "Prescribing penicillins immediately for acute viral colds and influenza"
    ],
    correctIndex: 2,
    explanation: "Prudent antibiotic stewardship—including culture sensitivity testing, avoiding antibiotics for viral infections, and ensuring patients strictly complete full prescribed courses—prevents selection of resistant superbug strains."
  }
];

export default function AntibioticResistanceEvolutionSim({ config = {}, onTelemetry }) {
  // Navigation tabs: 'petri_dish' | 'patient_treatment' | 'conjugation' | 'kcse'
  const [activeTab, setActiveTab] = useState('petri_dish');

  // ==========================================
  // STATION 1: PETRI DISH & DISC DIFFUSION
  // ==========================================
  const [selectedDiscs, setSelectedDiscs] = useState(['penicillin']); // Active discs placed
  const [isLawnIncubated, setIsLawnIncubated] = useState(false);
  const [resistantMutantRatio, setResistantMutantRatio] = useState(15); // % mutant colonies in lawn
  const [measuringDisc, setMeasuringDisc] = useState('penicillin');

  // Seeded bacterial colonies for Canvas representation
  const colonies = useMemo(() => {
    const list = [];
    // Generate 120 deterministic distributed colonies inside petri dish circle (center 250, 220, r=160)
    for (let i = 0; i < 110; i++) {
      // Golden angle distribution for uniform organic spread
      const angle = i * 2.39996;
      const dist = Math.sqrt((i + 1) / 110) * 148;
      const x = 250 + Math.cos(angle) * dist;
      const y = 220 + Math.sin(angle) * dist;
      const isMutant = (i % 100) < resistantMutantRatio;
      list.push({ id: i, x, y, isMutant });
    }
    return list;
  }, [resistantMutantRatio]);

  // Disc positions on agar plate (triangular equidistant arrangement)
  const discPositions = {
    penicillin: { x: 250, y: 130 },
    ampicillin: { x: 175, y: 270 },
    tetracycline: { x: 325, y: 270 }
  };

  const toggleDisc = (discId) => {
    setSelectedDiscs((prev) =>
      prev.includes(discId) ? prev.filter((d) => d !== discId) : [...prev, discId]
    );
  };

  // ==========================================
  // STATION 2: PATIENT TREATMENT SIMULATION
  // ==========================================
  // Regimen: 'full_course' (7 days) vs 'premature_stop' (Day 3 stop)
  const [treatmentRegimen, setTreatmentRegimen] = useState('premature_stop');
  const [patientDay, setPatientDay] = useState(0); // 0 to 7
  const [isTreating, setIsTreating] = useState(false);
  const [popHistory, setPopHistory] = useState({
    susceptible: 1000,
    resistant: 15,
    symptoms: 95
  });

  // Calculate bacterial populations as days progress
  useEffect(() => {
    let s = 1000;
    let r = 15;
    let symptoms = 95;

    for (let day = 1; day <= patientDay; day++) {
      if (treatmentRegimen === 'full_course') {
        // High antibiotic concentration maintained all 7 days
        s = Math.max(0, Math.round(s * 0.18));
        if (day <= 4) {
          r = Math.round(r * 1.05); // Resists initially
        } else {
          // Prolonged course + patient immune response finally clears resistant mutants
          r = Math.max(0, Math.round(r * 0.45));
        }
      } else {
        // Premature stop on Day 3
        if (day <= 3) {
          s = Math.max(10, Math.round(s * 0.22));
          r = Math.round(r * 1.15); // Slight advantage
        } else {
          // Antibiotic withdrawn: Resistant bacteria reproduce with NO drug barrier and NO competition
          s = Math.min(600, Math.round(s * 1.8));
          r = Math.min(1200, Math.round(r * 2.3)); // Exponential explosion of superbugs!
        }
      }
    }

    symptoms = Math.min(100, Math.round(((s + r) / 1015) * 100));
    setPopHistory({ susceptible: s, resistant: r, symptoms });
  }, [patientDay, treatmentRegimen]);

  // Automated treatment playback
  useEffect(() => {
    let t;
    if (isTreating) {
      t = setInterval(() => {
        setPatientDay((prev) => {
          if (prev >= 7) {
            setIsTreating(false);
            return 7;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(t);
  }, [isTreating]);

  // ==========================================
  // STATION 3: PLASMID CONJUGATION ANIMATION
  // ==========================================
  const [conjugationStage, setConjugationStage] = useState(0); // 0: contact, 1: pilus formed, 2: plasmid unrolling/transfer, 3: complementary strand copied / both resistant
  const [isConjugating, setIsConjugating] = useState(false);

  useEffect(() => {
    let interval;
    if (isConjugating) {
      interval = setInterval(() => {
        setConjugationStage((prev) => {
          if (prev >= 3) {
            setIsConjugating(false);
            return 3;
          }
          return prev + 1;
        });
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isConjugating]);

  // ==========================================
  // STATION 4: KCSE EXAM CHALLENGE
  // ==========================================
  const [userAnswers, setUserAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [telemetrySent, setTelemetrySent] = useState(false);

  const quizScore = useMemo(() => {
    let score = 0;
    KCSE_CHALLENGES.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  }, [userAnswers]);

  const handleQuizSubmit = () => {
    setSubmittedQuiz(true);
    const passed = quizScore >= 4;

    if (onTelemetry && !telemetrySent) {
      setTelemetrySent(true);
      onTelemetry({
        simulation: 'antibiotic_resistance_evolution_sim',
        topic: 'Evolution - Natural Selection & Antimicrobial Resistance',
        score: quizScore,
        maxScore: KCSE_CHALLENGES.length,
        passed,
        selectedRegimen: treatmentRegimen,
        finalResistantPop: popHistory.resistant
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none pb-12">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-5 py-4 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Disc className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Evolution of Antibiotic Resistance
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-900/60 border border-emerald-500/40 text-emerald-300">
                KCSE Form 4 Biology
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Darwinian Selection Pressure • Disc Diffusion Assay • Clinical Non-Compliance & Conjugation
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab('petri_dish')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'petri_dish'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            Disc Diffusion Assay
          </button>
          <button
            onClick={() => setActiveTab('patient_treatment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'patient_treatment'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            Patient 7-Day Regimen
          </button>
          <button
            onClick={() => setActiveTab('conjugation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'conjugation'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Plasmid Conjugation
          </button>
          <button
            onClick={() => setActiveTab('kcse')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'kcse'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            KCSE Exam Challenge
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Simulation Stages */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* TAB 1: PETRI DISH & DISC DIFFUSION */}
          {activeTab === 'petri_dish' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-sm font-semibold text-slate-200">
                    Kirby-Bauer Antimicrobial Susceptibility Plate
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 border border-slate-700">
                    Incubation: {isLawnIncubated ? '37°C / 24 Hours Complete' : 'Fresh Inoculum (Unincubated)'}
                  </span>
                </div>
              </div>

              {/* Pseudo-3D Agar Plate Canvas */}
              <div className="relative w-full h-[440px] bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
                <svg viewBox="0 0 500 440" className="w-full h-full">
                  <defs>
                    {/* Glass Petri Dish Rim Gradient */}
                    <radialGradient id="petriRim" cx="50%" cy="50%" r="50%">
                      <stop offset="85%" stopColor="#334155" stopOpacity="0.4" />
                      <stop offset="95%" stopColor="#64748b" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                    </radialGradient>

                    {/* Nutrient Agar Medium Color */}
                    <radialGradient id="agarShine" cx="40%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#fef08a" stopOpacity="0.35" />
                      <stop offset="70%" stopColor="#d97706" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#78350f" stopOpacity="0.3" />
                    </radialGradient>

                    {/* Clear Zone of Inhibition Mask */}
                    <filter id="blurZone">
                      <feGaussianBlur stdDeviation="3" />
                    </filter>
                  </defs>

                  {/* Outer Glass Rim */}
                  <circle cx="250" cy="220" r="185" fill="none" stroke="#475569" strokeWidth="12" />
                  <circle cx="250" cy="220" r="185" fill="url(#petriRim)" />

                  {/* Agar Gel Bed */}
                  <circle cx="250" cy="220" r="175" fill="#1e293b" />
                  <circle cx="250" cy="220" r="175" fill="url(#agarShine)" />

                  {/* Clear Zones of Inhibition around placed discs */}
                  {isLawnIncubated && selectedDiscs.map((discId) => {
                    const pos = discPositions[discId];
                    const cfg = ANTIBIOTICS[discId];
                    return (
                      <g key={`zone-${discId}`}>
                        {/* Susceptible inhibition zone (wide clear circle) */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={cfg.susceptibleZoneRadius}
                          fill="#0f172a"
                          opacity="0.92"
                        />
                        {/* Zone border marker */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={cfg.susceptibleZoneRadius}
                          fill="none"
                          stroke={cfg.color}
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          opacity="0.6"
                        />
                        {/* Label Zone of Inhibition diameter */}
                        <text
                          x={pos.x}
                          y={pos.y + cfg.susceptibleZoneRadius + 14}
                          fill={cfg.color}
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          Zone Ø: {(cfg.susceptibleZoneRadius * 0.4).toFixed(0)} mm
                        </text>
                      </g>
                    );
                  })}

                  {/* Bacterial Lawn Colonies */}
                  {isLawnIncubated && colonies.map((col) => {
                    // Check if colony falls inside any active antibiotic inhibition zone
                    let isKilled = false;
                    selectedDiscs.forEach((dId) => {
                      const dPos = discPositions[dId];
                      const dDist = Math.hypot(col.x - dPos.x, col.y - dPos.y);
                      const zoneRadius = col.isMutant
                        ? ANTIBIOTICS[dId].resistantZoneRadius
                        : ANTIBIOTICS[dId].susceptibleZoneRadius;

                      if (dDist < zoneRadius) {
                        isKilled = true;
                      }
                    });

                    if (isKilled) return null;

                    return (
                      <circle
                        key={col.id}
                        cx={col.x}
                        cy={col.y}
                        r={col.isMutant ? 4 : 2.5}
                        fill={col.isMutant ? '#ef4444' : '#fef08a'}
                        stroke={col.isMutant ? '#991b1b' : '#ca8a04'}
                        strokeWidth="1"
                        opacity={0.85}
                      />
                    );
                  })}

                  {/* Antibiotic Filter Paper Discs */}
                  {selectedDiscs.map((discId) => {
                    const pos = discPositions[discId];
                    const cfg = ANTIBIOTICS[discId];
                    const isSelectedMeasure = measuringDisc === discId;

                    return (
                      <g
                        key={`disc-${discId}`}
                        transform={`translate(${pos.x}, ${pos.y})`}
                        onClick={() => setMeasuringDisc(discId)}
                        className="cursor-pointer"
                      >
                        {/* Disc drop shadow */}
                        <circle cx="2" cy="2" r="16" fill="#000000" opacity="0.4" />
                        {/* Filter paper disc */}
                        <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                        {isSelectedMeasure && (
                          <circle cx="0" cy="0" r="20" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
                        )}
                        <text
                          x="0"
                          y="3"
                          fill="#0f172a"
                          fontSize="9"
                          fontWeight="extrabold"
                          textAnchor="middle"
                        >
                          {cfg.code}
                        </text>
                        <text
                          x="0"
                          y="11"
                          fill="#64748b"
                          fontSize="6.5"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {cfg.potency}µg
                        </text>
                      </g>
                    );
                  })}

                  {/* Plate Legend Watermark */}
                  <g transform="translate(20, 25)" fontSize="9">
                    <circle cx="10" cy="10" r="4" fill="#fef08a" stroke="#ca8a04" />
                    <text x="22" y="13" fill="#cbd5e1">Susceptible Strain (Normal)</text>

                    <circle cx="10" cy="26" r="4.5" fill="#ef4444" stroke="#991b1b" />
                    <text x="22" y="29" fill="#fca5a5" fontWeight="bold">r⁺ Resistant Mutant (r-plasmid)</text>
                  </g>
                </svg>

                {/* Floating Zone Measurement Inspector */}
                {isLawnIncubated && (
                  <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-700/80 backdrop-blur rounded-xl p-3 shadow-xl max-w-xs text-xs space-y-1">
                    <span className="font-bold text-slate-200 block text-xs">
                      Zone Analyzer: <span className="text-emerald-400">{ANTIBIOTICS[measuringDisc].name}</span>
                    </span>
                    <div className="text-[11px] text-slate-300">
                      Normal Lawn Zone: <span className="text-emerald-400 font-bold">{(ANTIBIOTICS[measuringDisc].susceptibleZoneRadius * 0.4).toFixed(0)} mm (Sensitive)</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Mutant Survival Zone: <span className="text-red-400 font-bold">{(ANTIBIOTICS[measuringDisc].resistantZoneRadius * 0.4).toFixed(0)} mm (Resistant)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                      Clear agar indicates bacterial lysis/inhibition. Red mutant colonies grow right up to the disc edge due to beta-lactamase enzyme degradation!
                    </p>
                  </div>
                )}
              </div>

              {/* Lab Controls Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                {/* Place Disc Toggles */}
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300 block">
                    Select Antibiotic Discs:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.values(ANTIBIOTICS).map((a) => {
                      const isPlaced = selectedDiscs.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          onClick={() => toggleDisc(a.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                            isPlaced
                              ? 'bg-emerald-600 text-white shadow'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {a.code}
                          {isPlaced && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mutant Colony Frequency Slider */}
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="text-red-400 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> Spontaneous r⁺ Mutants:
                    </span>
                    <span className="font-mono text-white">{resistantMutantRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    value={resistantMutantRatio}
                    onChange={(e) => setResistantMutantRatio(Number(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-400">Pre-existing genetic variation frequency</span>
                </div>

                {/* Incubate Plate Action */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLawnIncubated(!isLawnIncubated)}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition ${
                      isLawnIncubated
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                    }`}
                  >
                    {isLawnIncubated ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isLawnIncubated ? 'Clear Plate' : 'Incubate Lawn (24h)'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PATIENT TREATMENT SIMULATION */}
          {activeTab === 'patient_treatment' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Pill className="w-5 h-5 text-indigo-400" />
                    Clinical Patient Antibiotic Regimen Simulation
                  </h2>
                  <p className="text-xs text-slate-400">
                    Observe how premature discontinuation selectively breeds a multi-drug resistant bacterial strain.
                  </p>
                </div>
                <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 border border-slate-700 font-mono">
                  Patient Status: Day {patientDay} / 7
                </span>
              </div>

              {/* Treatment Regimen Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setTreatmentRegimen('full_course');
                    setPatientDay(0);
                    setIsTreating(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                    treatmentRegimen === 'full_course'
                      ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-400'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold block text-emerald-300">
                      Regimen A: Complete 7-Day Prescription
                    </strong>
                    <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                      Patient takes antibiotic twice daily for all 7 days without stopping when symptoms resolve.
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setTreatmentRegimen('premature_stop');
                    setPatientDay(0);
                    setIsTreating(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                    treatmentRegimen === 'premature_stop'
                      ? 'bg-red-950/60 border-red-500 text-white ring-1 ring-red-400'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold block text-red-300">
                      Regimen B: Discontinued on Day 3 (Default Non-Compliance)
                    </strong>
                    <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                      Patient feels better on Day 3 and stops taking tablets, saving remainder for later.
                    </span>
                  </div>
                </button>
              </div>

              {/* Population Dynamics Graph / Visual Representation */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Bacterial Colony Census in Patient Tissue:
                  </span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="flex items-center gap-1.5 text-yellow-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      Susceptible: {popHistory.susceptible} CFU
                    </span>
                    <span className="flex items-center gap-1.5 text-red-400 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      Resistant: {popHistory.resistant} CFU
                    </span>
                  </div>
                </div>

                {/* Visual Stacked Population Bar */}
                <div className="w-full bg-slate-900 rounded-xl h-8 overflow-hidden flex border border-slate-800 relative">
                  <div
                    className="bg-yellow-400/90 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-slate-950"
                    style={{ width: `${(popHistory.susceptible / (popHistory.susceptible + popHistory.resistant || 1)) * 100}%` }}
                  >
                    {popHistory.susceptible > 50 ? `${popHistory.susceptible}` : ''}
                  </div>
                  <div
                    className="bg-red-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white shadow-inner"
                    style={{ width: `${(popHistory.resistant / (popHistory.susceptible + popHistory.resistant || 1)) * 100}%` }}
                  >
                    {popHistory.resistant > 30 ? `${popHistory.resistant}` : ''}
                  </div>
                </div>

                {/* Clinical Symptom Gauge */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" /> Patient Clinical Fever & Symptoms:
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          popHistory.symptoms > 60 ? 'bg-red-500' : popHistory.symptoms > 20 ? 'bg-amber-400' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${popHistory.symptoms}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-slate-200">{popHistory.symptoms}%</span>
                  </div>
                </div>

                {/* Day-by-day outcome commentary */}
                <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  treatmentRegimen === 'premature_stop' && patientDay >= 4
                    ? 'bg-red-950/40 border-red-800/60 text-red-200'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-300'
                }`}>
                  {patientDay === 0 && 'Infection onset: Patient presents with high bacterial load containing 98.5% normal susceptible and 1.5% spontaneous mutant bacteria.'}
                  {patientDay >= 1 && patientDay <= 3 && 'Day 1–3: Antibiotic eliminates sensitive bacteria rapidly. Patient symptoms drop sharply from 95% to 20%, giving a false sense of full recovery.'}
                  {patientDay >= 4 && treatmentRegimen === 'full_course' && 'Day 4–7: High antibiotic levels continue to exert lethal pressure on surviving mutant strains. Body immune defenses clean up remaining bacteria: Complete Cure achieved!'}
                  {patientDay >= 4 && treatmentRegimen === 'premature_stop' && 'Day 4–7: DANGER! Antibiotic stopped! Surviving resistant mutants reproduce without competition from susceptible bacteria. The patient suffers a severe relapse with an untreatable Superbug!'}
                </div>
              </div>

              {/* Patient Regimen Step Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    disabled={patientDay >= 7 || isTreating}
                    onClick={() => setPatientDay((d) => Math.min(7, d + 1))}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition"
                  >
                    Advance 1 Day
                  </button>

                  <button
                    onClick={() => setIsTreating(!isTreating)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
                  >
                    {isTreating ? 'Pause Days' : 'Auto Play 7 Days'}
                  </button>
                </div>

                <button
                  onClick={() => {
                    setPatientDay(0);
                    setIsTreating(false);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PLASMID CONJUGATION ANIMATION */}
          {activeTab === 'conjugation' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-indigo-400" />
                    Horizontal Gene Transfer: Plasmid Conjugation
                  </h2>
                  <p className="text-xs text-slate-400">
                    Transfer of r-plasmid through sex pilus from donor bacterium to recipient bacterium.
                  </p>
                </div>
                <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 border border-slate-700">
                  Step {conjugationStage + 1} / 4
                </span>
              </div>

              {/* Conjugation Canvas */}
              <div className="relative w-full h-[360px] bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 600 320" className="w-full h-full">
                  <defs>
                    <linearGradient id="donorBact" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#991b1b" stopOpacity="0.85" />
                    </linearGradient>

                    <linearGradient id="recipBact" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop
                        offset="0%"
                        stopColor={conjugationStage === 3 ? '#ef4444' : '#38bdf8'}
                        stopOpacity="0.4"
                      />
                      <stop
                        offset="100%"
                        stopColor={conjugationStage === 3 ? '#991b1b' : '#0284c7'}
                        stopOpacity="0.85"
                      />
                    </linearGradient>
                  </defs>

                  {/* Donor Bacterium (Left) */}
                  <g transform="translate(140, 160)">
                    {/* Cell capsule */}
                    <rect x="-85" y="-60" width="170" height="120" rx="55" fill="url(#donorBact)" stroke="#ef4444" strokeWidth="2.5" />
                    {/* Main bacterial chromosome */}
                    <path
                      d="M -50,-20 Q -30,-40 -10,-20 Q 10,0 -10,20 Q -40,10 -50,-20"
                      fill="none"
                      stroke="#fca5a5"
                      strokeWidth="2.5"
                      strokeDasharray="3 3"
                    />
                    <text x="-45" y="-5" fill="#fee2e2" fontSize="9" fontWeight="bold">Main DNA</text>

                    {/* Original r-plasmid ring */}
                    <circle cx="25" cy="15" r="14" fill="none" stroke="#facc15" strokeWidth="3" />
                    <text x="25" y="18" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">r⁺</text>

                    <text x="0" y="78" fill="#fca5a5" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Donor (Resistant F⁺ / r⁺)
                    </text>
                  </g>

                  {/* Recipient Bacterium (Right) */}
                  <g transform="translate(460, 160)">
                    {/* Cell capsule */}
                    <rect x="-85" y="-60" width="170" height="120" rx="55" fill="url(#recipBact)" stroke={conjugationStage === 3 ? '#ef4444' : '#38bdf8'} strokeWidth="2.5" />
                    {/* Main bacterial chromosome */}
                    <path
                      d="M -30,-20 Q -10,-40 10,-20 Q 30,0 10,20 Q -20,10 -30,-20"
                      fill="none"
                      stroke="#bae6fd"
                      strokeWidth="2.5"
                      strokeDasharray="3 3"
                    />
                    <text x="-25" y="-5" fill="#e0f2fe" fontSize="9" fontWeight="bold">Main DNA</text>

                    {/* Acquired r-plasmid in Stage 3 */}
                    {conjugationStage === 3 && (
                      <g>
                        <circle cx="-25" cy="15" r="14" fill="none" stroke="#facc15" strokeWidth="3" className="animate-pulse" />
                        <text x="-25" y="18" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">r⁺</text>
                      </g>
                    )}

                    <text x="0" y="78" fill={conjugationStage === 3 ? '#fca5a5' : '#7dd3fc'} fontSize="11" fontWeight="bold" textAnchor="middle">
                      {conjugationStage === 3 ? 'Transconjugant (Now Resistant!)' : 'Recipient (Susceptible F⁻)'}
                    </text>
                  </g>

                  {/* Cytoplasmic Mating Bridge / Sex Pilus (Connecting Center) */}
                  {conjugationStage >= 1 && (
                    <g>
                      <path
                        d="M 225,148 L 375,148 L 375,172 L 225,172 Z"
                        fill="#475569"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        opacity="0.8"
                      />
                      <text x="300" y="140" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
                        Sex Pilus Bridge
                      </text>
                    </g>
                  )}

                  {/* Single-stranded Plasmid DNA navigating through the pilus bridge */}
                  {conjugationStage === 2 && (
                    <g>
                      <path
                        d="M 165,175 Q 220,160 300,160 T 435,175"
                        fill="none"
                        stroke="#facc15"
                        strokeWidth="3.5"
                        strokeDasharray="5 5"
                        className="animate-pulse"
                      />
                      <circle cx="300" cy="160" r="5" fill="#facc15" />
                      <text x="300" y="185" fill="#fde047" fontSize="9" fontWeight="bold" textAnchor="middle">
                        Single strand rolling transfer →
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Conjugation Step Description */}
              <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-white font-bold">
                    {conjugationStage === 0 && '1. Pilus Contact: Donor identifies susceptible recipient cell.'}
                    {conjugationStage === 1 && '2. Cytoplasmic Mating Bridge forms connecting both bacterial envelopes.'}
                    {conjugationStage === 2 && '3. Relaxosome nicks r-plasmid; single DNA strand threads into recipient.'}
                    {conjugationStage === 3 && '4. DNA polymerase synthesizes complementary strands. Both bacteria are now drug resistant!'}
                  </strong>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Horizontal gene transfer allows resistance genes (e.g., penicillinase enzyme synthesis) to jump across different bacterial species within human gut microbiomes.
                </p>
              </div>

              {/* Animation Triggers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsConjugating(true)}
                  disabled={isConjugating}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                >
                  <Play className="w-3.5 h-3.5" /> Start Conjugation Transfer
                </button>
                <button
                  onClick={() => {
                    setIsConjugating(false);
                    setConjugationStage(0);
                  }}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs border border-slate-700 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: KCSE EXAM CHALLENGE */}
          {activeTab === 'kcse' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    KCSE Form 4 Biology: Antibiotic Resistance Challenge
                  </h2>
                  <p className="text-xs text-slate-400">
                    Official Kenya Certificate of Secondary Education exam questions on Darwinian selection and antimicrobial resistance.
                  </p>
                </div>
                {submittedQuiz && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    quizScore >= 4 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                  }`}>
                    Score: {quizScore} / {KCSE_CHALLENGES.length}
                  </span>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {KCSE_CHALLENGES.map((item, idx) => (
                  <div key={item.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-900/70 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <p className="font-semibold text-slate-200 text-sm leading-snug">
                        {item.question}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-7">
                      {item.options.map((opt, optIdx) => {
                        const isSelected = userAnswers[item.id] === optIdx;
                        let btnStyle = 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-500';

                        if (submittedQuiz) {
                          if (optIdx === item.correctIndex) {
                            btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-medium';
                          } else if (isSelected) {
                            btnStyle = 'bg-red-950/70 border-red-500 text-red-300';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-emerald-900/80 border-emerald-400 text-white font-medium';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={submittedQuiz}
                            onClick={() => setUserAnswers((prev) => ({ ...prev, [item.id]: optIdx }))}
                            className={`p-2.5 rounded-lg border text-left transition-colors flex items-start gap-2 ${btnStyle}`}
                          >
                            <span className="font-mono text-[10px] text-slate-400 shrink-0">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {submittedQuiz && (
                      <div className="pl-7 pt-1 text-[11px] text-slate-300 bg-slate-900/50 p-2 rounded-md border border-slate-800">
                        <strong className="text-amber-400 font-semibold">Examiner Note: </strong>
                        {item.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit / Retake Button */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  {Object.keys(userAnswers).length} of {KCSE_CHALLENGES.length} answered
                </span>

                {!submittedQuiz ? (
                  <button
                    disabled={Object.keys(userAnswers).length < KCSE_CHALLENGES.length}
                    onClick={handleQuizSubmit}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-lg transition"
                  >
                    Submit KCSE Challenge
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSubmittedQuiz(false);
                      setUserAnswers({});
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
                  >
                    Retake Challenge
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Educational Notes & Syllabus Principles */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Darwinian Evolution Step-by-Step Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Evolution by Natural Selection
            </h3>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <strong className="text-indigo-300 block mb-1">1. Spontaneous Variation:</strong>
                Bacteria mutate randomly prior to antibiotic contact (e.g. altering target binding sites or producing beta-lactamases).
              </div>

              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <strong className="text-amber-300 block mb-1">2. Environmental Selection Pressure:</strong>
                Antibiotic administration kills sensitive bacteria but cannot destroy mutant cells with r-plasmids.
              </div>

              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <strong className="text-red-300 block mb-1">3. Differential Reproduction:</strong>
                Surviving resistant mutants multiply rapidly without competition for nutrients and space, passing r-genes to progeny.
              </div>
            </div>
          </div>

          {/* Clinical Stewardship Guidelines */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Antimicrobial Stewardship
            </h3>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <span className="font-semibold text-emerald-300 block mb-1">Finish Full Course:</span>
                Eliminate remaining resistant cells before they replicate and cause relapsing superinfections.
              </div>

              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <span className="font-semibold text-cyan-300 block mb-1">Never Treat Viral Infections:</span>
                Antibiotics have zero efficacy against viruses (influenza, common cold). Unnecessary usage only selects for resistant bacteria.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
