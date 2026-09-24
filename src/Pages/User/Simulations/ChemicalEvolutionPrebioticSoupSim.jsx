import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Flame,
  Zap,
  Droplets,
  Layers,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Beaker,
  TestTube,
  Activity,
  AlertTriangle,
  Info,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

// KCSE Origin of Life & Chemical Evolution Quiz Data
const KCSE_CHALLENGES = [
  {
    id: 1,
    question: "According to the Oparin-Haldane hypothesis, what critical condition distinguished Earth's primitive atmosphere from today's atmosphere?",
    options: [
      "It was rich in ozone (O₃) protecting against cosmic rays",
      "It was a reducing atmosphere with almost no free molecular oxygen (O₂)",
      "It contained high concentrations of gaseous chlorofluorocarbons",
      "It had 78% nitrogen and 21% oxygen just like modern ambient air"
    ],
    correctIndex: 1,
    explanation: "Primitive Earth possessed a reducing atmosphere lacking free oxygen (O₂). The absence of oxygen prevented the immediate oxidative breakdown of newly synthesized prebiotic organic molecules."
  },
  {
    id: 2,
    question: "In the historic 1953 Miller-Urey experiment, what did high-voltage electric discharges across the tungsten electrodes represent?",
    options: [
      "Geothermal heat from underwater volcanic hydrothermal vents",
      "Lightning strikes providing activation energy for bond cracking and synthesis",
      "Cosmic gamma irradiation emitted by decaying radioactive isotopes",
      "Solar infrared wavelengths warming the primeval ocean surface"
    ],
    correctIndex: 1,
    explanation: "Continuous high-voltage electrical sparks simulated primordial lightning storms, supplying the necessary activation energy to crack simple inorganic bonds (CH₄, NH₃, H₂, H₂O) into reactive radicals."
  },
  {
    id: 3,
    question: "Why was a water condenser cooling coil installed immediately downstream of the spark discharge flask?",
    options: [
      "To condense water vapor into liquid 'rain', washing newly formed organic molecules down into the ocean trap",
      "To sterilize the glassware from modern bacterial spore contamination",
      "To freeze the mixture into ice crystals for crystalline lattice diffraction",
      "To neutralize acidic cyanides before escaping into the laboratory room"
    ],
    correctIndex: 0,
    explanation: "The cold-water condenser represented atmospheric cooling and torrential rainfall, dissolving freshly synthesized hydrogen cyanide and aldehydes and channeling them into the ocean reservoir before they were decomposed by repeated sparking."
  },
  {
    id: 4,
    question: "Which organic monomers detected in the Miller-Urey apparatus provided direct biochemical proof for chemical evolution?",
    options: [
      "Adenosine triphosphate (ATP) and complex DNA double helices",
      "Amino acids such as Glycine, Alanine, and Aspartic acid",
      "Long-chain saturated triglycerides and phospholipids",
      "Cellulose and amylose polysaccharides"
    ],
    correctIndex: 1,
    explanation: "Miller and Urey identified simple amino acids (predominantly Glycine and Alanine) via paper chromatography with ninhydrin, proving that fundamental building blocks of proteins could arise abiogenically."
  },
  {
    id: 5,
    question: "In paper chromatography of amino acids, what is the role of spraying with ninhydrin reagent?",
    options: [
      "To hydrolyze peptide bonds between adjacent residues",
      "To react with free alpha-amino groups producing purple/violet spots for visualization",
      "To dissolve the cellulose fibers of the chromatography paper",
      "To change the solvent front migration speed across the stationary phase"
    ],
    correctIndex: 1,
    explanation: "Amino acids are colorless. Ninhydrin (triketohydrindene hydrate) reacts specifically with free alpha-amino acids to produce a characteristic purple-violet complex (Ruhemann's purple), visualizing the separated spots."
  }
];

export default function ChemicalEvolutionPrebioticSoupSim({ config = {}, onTelemetry }) {
  // Tab state: 'apparatus' | 'chromatography' | 'kcse'
  const [activeTab, setActiveTab] = useState('apparatus');

  // Simulation controls
  const [isRunning, setIsRunning] = useState(false);
  const [sparkPower, setSparkPower] = useState(65); // 0 to 100 kV/intensity
  const [boilingHeat, setBoilingHeat] = useState(70); // 0 to 100 % heat
  const [simDays, setSimDays] = useState(0.0); // 0 to 7 simulated days
  const [reactionProgress, setReactionProgress] = useState(0); // 0 to 100%

  // Gas concentrations (arbitrary units / relative)
  const [gases, setGases] = useState({
    ch4: 100,
    nh3: 100,
    h2: 100,
    h2o_vapor: 80,
    hcn: 0,
    aldehydes: 0,
    glycine: 0,
    alanine: 0,
    aspartic: 0
  });

  // Chromatography station state
  const [chromaStep, setChromaStep] = useState('dry'); // 'dry' | 'running' | 'developed' | 'sprayed'
  const [solventProgress, setSolventProgress] = useState(0); // 0 to 100%
  const [isChromaRunning, setIsChromaRunning] = useState(false);
  const [selectedMolecule, setSelectedMolecule] = useState(null);

  // Spark visual flicker
  const [sparkActive, setSparkActive] = useState(false);

  // Checkpoint tracking
  const [milestones, setMilestones] = useState({
    sparkDischarge: false,
    oceanBoiling: false,
    radicalsFormed: false,
    aminoAcidsSynthesized: false,
    chromatographyDone: false,
    quizPassed: false
  });

  // Quiz state
  const [userAnswers, setUserAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [telemetrySent, setTelemetrySent] = useState(false);

  // Animation frame ref
  const animRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Tick simulation
  useEffect(() => {
    if (!isRunning) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Spark flickering effect
      if (Math.random() < 0.85) {
        setSparkActive(true);
      } else {
        setSparkActive(false);
      }

      setSimDays((prev) => {
        const rate = 0.35 * (sparkPower / 50) * (boilingHeat / 50);
        const next = prev + dt * rate;
        if (next >= 7.0) {
          setIsRunning(false);
          return 7.0;
        }
        return next;
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isRunning, sparkPower, boilingHeat]);

  // Derived reaction calculations based on simDays
  useEffect(() => {
    const p = Math.min(100, (simDays / 7.0) * 100);
    setReactionProgress(p);

    // Chemical cracking & prebiotic synthesis curves
    const ch4 = Math.max(15, 100 - p * 0.85);
    const nh3 = Math.max(10, 100 - p * 0.9);
    const h2 = Math.max(20, 100 - p * 0.75);
    const h2o_vapor = Math.min(100, 30 + boilingHeat * 0.65);

    // Intermediates: HCN & Aldehydes peak early then convert to amino acids (Strecker synthesis)
    const hcn = p < 50 ? p * 1.4 : Math.max(10, 70 - (p - 50) * 1.1);
    const aldehydes = p < 45 ? p * 1.2 : Math.max(8, 54 - (p - 45) * 0.9);

    // Stable amino acids accumulate in prebiotic ocean trap
    const glycine = Math.min(100, Math.pow(p / 100, 1.4) * 100);
    const alanine = Math.min(100, Math.pow(Math.max(0, p - 15) / 85, 1.6) * 78);
    const aspartic = Math.min(100, Math.pow(Math.max(0, p - 30) / 70, 1.8) * 55);

    setGases({
      ch4,
      nh3,
      h2,
      h2o_vapor,
      hcn,
      aldehydes,
      glycine,
      alanine,
      aspartic
    });

    // Track milestones
    setMilestones((prev) => ({
      ...prev,
      sparkDischarge: prev.sparkDischarge || sparkPower >= 40,
      oceanBoiling: prev.oceanBoiling || boilingHeat >= 40,
      radicalsFormed: prev.radicalsFormed || p >= 20,
      aminoAcidsSynthesized: prev.aminoAcidsSynthesized || glycine >= 45
    }));
  }, [simDays, sparkPower, boilingHeat]);

  // Chromatography animation loop
  useEffect(() => {
    let chromaInterval;
    if (isChromaRunning) {
      chromaInterval = setInterval(() => {
        setSolventProgress((prev) => {
          if (prev >= 100) {
            setIsChromaRunning(false);
            setChromaStep('developed');
            return 100;
          }
          return prev + 2.5;
        });
      }, 70);
    }
    return () => clearInterval(chromaInterval);
  }, [isChromaRunning]);

  const handleStartChroma = () => {
    if (reactionProgress < 15) return;
    setSolventProgress(0);
    setChromaStep('running');
    setIsChromaRunning(true);
  };

  const handleApplyNinhydrin = () => {
    setChromaStep('sprayed');
    setMilestones((prev) => ({ ...prev, chromatographyDone: true }));
  };

  const handleResetChroma = () => {
    setIsChromaRunning(false);
    setSolventProgress(0);
    setChromaStep('dry');
  };

  // Reset experiment
  const handleResetSim = () => {
    setIsRunning(false);
    setSimDays(0);
    setReactionProgress(0);
    setSparkActive(false);
    setGases({
      ch4: 100,
      nh3: 100,
      h2: 100,
      h2o_vapor: 80,
      hcn: 0,
      aldehydes: 0,
      glycine: 0,
      alanine: 0,
      aspartic: 0
    });
  };

  // 1-Click Complete Run
  const handleRunFullExperiment = () => {
    setBoilingHeat(85);
    setSparkPower(90);
    setSimDays(7.0);
    setIsRunning(false);
  };

  // Quiz evaluation
  const quizScore = useMemo(() => {
    let correct = 0;
    KCSE_CHALLENGES.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  }, [userAnswers]);

  const handleQuizSubmit = () => {
    setSubmittedQuiz(true);
    const passed = quizScore >= 4;
    setMilestones((prev) => ({ ...prev, quizPassed: passed }));

    if (onTelemetry && !telemetrySent) {
      setTelemetrySent(true);
      onTelemetry({
        simulation: 'chemical_evolution_prebiotic_soup_sim',
        topic: 'Evolution - Chemical Evolution & Origin of Life',
        score: quizScore,
        maxScore: KCSE_CHALLENGES.length,
        passed,
        simDays,
        glycineYield: gases.glycine.toFixed(1)
      });
    }
  };

  // Ocean color shifts from pristine crystal blue to rich murky brown prebiotic broth
  const getOceanColor = () => {
    const p = reactionProgress / 100;
    // Blue [56, 189, 248] to amber-brown [180, 83, 9]
    const r = Math.round(56 + (180 - 56) * p);
    const g = Math.round(56 + (120 - 56) * p);
    const b = Math.max(10, Math.round(248 - 220 * p));
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none pb-12">
      {/* Top Header Banner */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-5 py-4 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Beaker className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Miller-Urey Chemical Evolution
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 border border-indigo-500/40 text-indigo-300">
                KCSE Form 4 Biology
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Oparin-Haldane Prebiotic Soup Hypothesis • Abiogenic Monomer Synthesis
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab('apparatus')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'apparatus'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Glass Apparatus
          </button>
          <button
            onClick={() => setActiveTab('chromatography')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'chromatography'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Paper Chromatography
          </button>
          <button
            onClick={() => setActiveTab('kcse')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'kcse'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            KCSE Exam Challenge
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Canvas & Lab Workstation */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {activeTab === 'apparatus' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col relative overflow-hidden">
              {/* Status Header */}
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                  <span className="text-sm font-semibold text-slate-200">
                    Closed Sterile Circulation Apparatus
                  </span>
                  <span className="text-xs bg-slate-800 px-2.5 py-0.5 rounded-full text-slate-400 font-mono">
                    Elapsed: {simDays.toFixed(1)} / 7.0 Days
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-md font-medium">
                    Prebiotic Broth: {reactionProgress < 15 ? 'Inorganic Steam' : reactionProgress < 60 ? 'HCN & Aldehydes' : 'Amino Acid Soup'}
                  </span>
                </div>
              </div>

              {/* Pseudo-3D / High-Fidelity SVG Apparatus Canvas */}
              <div className="relative w-full h-[460px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800/80 overflow-hidden shadow-inner">
                <svg viewBox="0 0 800 500" className="w-full h-full">
                  <defs>
                    {/* Glass tubing gradient */}
                    <linearGradient id="glassTubeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                      <stop offset="35%" stopColor="#bae6fd" stopOpacity="0.75" />
                      <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.5" />
                    </linearGradient>

                    {/* Flask glass gradient */}
                    <radialGradient id="flaskShine" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                      <stop offset="60%" stopColor="#0284c7" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.4" />
                    </radialGradient>

                    {/* Lightning glow */}
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Connecting Glass Circulation Loop */}
                  {/* Left tube: Boiling ocean -> Spark chamber */}
                  <path
                    d="M 220,380 L 220,180 Q 220,140 260,140 L 400,140"
                    fill="none"
                    stroke="url(#glassTubeGrad)"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  {/* Inner steam vapor path */}
                  <path
                    d="M 220,380 L 220,180 Q 220,140 260,140 L 400,140"
                    fill="none"
                    stroke="#e0f2fe"
                    strokeWidth="4"
                    strokeDasharray="6 8"
                    strokeDashoffset={isRunning ? -simDays * 40 : 0}
                    opacity="0.8"
                  />

                  {/* Spark Chamber to Condenser */}
                  <path
                    d="M 480,140 L 570,140 Q 610,140 610,180 L 610,240"
                    fill="none"
                    stroke="url(#glassTubeGrad)"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 480,140 L 570,140 Q 610,140 610,180 L 610,240"
                    fill="none"
                    stroke="#a5f3fc"
                    strokeWidth="3"
                    strokeDasharray="4 6"
                    strokeDashoffset={isRunning ? -simDays * 35 : 0}
                    opacity="0.7"
                  />

                  {/* Condenser Straight Column */}
                  <line x1="610" y1="240" x2="610" y2="350" stroke="url(#glassTubeGrad)" strokeWidth="18" />
                  {/* Outer cooling water jacket */}
                  <rect x="592" y="245" width="36" height="100" rx="8" fill="#0284c7" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="2" />
                  {/* Water in/out cooling nozzles */}
                  <line x1="628" y1="260" x2="665" y2="260" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                  <text x="670" y="264" fill="#38bdf8" fontSize="10" fontWeight="bold">Water Out</text>
                  <line x1="628" y1="330" x2="665" y2="330" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                  <text x="670" y="334" fill="#38bdf8" fontSize="10" fontWeight="bold">Cold In</text>

                  {/* Condensate droplets trickling down */}
                  {isRunning && (
                    <g fill="#67e8f9">
                      <circle cx="610" cy={260 + ((simDays * 120) % 80)} r="3.5" opacity="0.9" />
                      <circle cx="610" cy={280 + ((simDays * 160) % 80)} r="2.5" opacity="0.8" />
                    </g>
                  )}

                  {/* U-Tube Trap & Prebiotic Ocean Return */}
                  <path
                    d="M 610,350 L 610,400 Q 610,440 560,440 L 460,440 Q 420,440 420,400 L 420,380 Q 420,350 370,350 L 260,350"
                    fill="none"
                    stroke="url(#glassTubeGrad)"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  {/* Liquid inside U-tube trap */}
                  <path
                    d="M 610,380 L 610,400 Q 610,440 560,440 L 460,440 Q 420,440 420,400 L 420,380"
                    fill="none"
                    stroke={getOceanColor()}
                    strokeWidth="12"
                    strokeLinecap="round"
                    opacity="0.85"
                  />

                  {/* Sampling stopcock valve on U-tube trap */}
                  <g transform="translate(490, 440)">
                    <line x1="0" y1="0" x2="0" y2="25" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                    <rect x="-8" y="10" width="16" height="5" rx="2" fill="#ef4444" />
                    <text x="-35" y="42" fill="#cbd5e1" fontSize="10" fontWeight="600">Sample Stopcock</text>
                  </g>

                  {/* Left: Oceanic Boiling Flask */}
                  <g transform="translate(220, 390)">
                    {/* Burner Flame */}
                    {boilingHeat > 10 && (
                      <g transform="translate(0, 52)">
                        <path
                          d="M -16,0 Q 0,-35 16,0 Q 0,10 -16,0"
                          fill="#f97316"
                          opacity={0.3 + (boilingHeat / 100) * 0.7}
                        />
                        <path
                          d="M -10,0 Q 0,-25 10,0 Q 0,8 -10,0"
                          fill="#facc15"
                          opacity={0.5 + (boilingHeat / 100) * 0.5}
                        />
                        <path
                          d="M -5,0 Q 0,-15 5,0 Q 0,5 -5,0"
                          fill="#38bdf8"
                          opacity={0.8}
                        />
                      </g>
                    )}
                    {/* Heat Source Tripod */}
                    <line x1="-30" y1="52" x2="30" y2="52" stroke="#64748b" strokeWidth="4" />
                    <line x1="-25" y1="52" x2="-35" y2="80" stroke="#475569" strokeWidth="3" />
                    <line x1="25" y1="52" x2="35" y2="80" stroke="#475569" strokeWidth="3" />

                    {/* Flask Body */}
                    <circle cx="0" cy="0" r="48" fill={getOceanColor()} fillOpacity="0.75" />
                    <circle cx="0" cy="0" r="48" fill="url(#flaskShine)" />
                    <circle cx="0" cy="0" r="48" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.6" />

                    {/* Water boiling bubbles */}
                    {boilingHeat > 20 && isRunning && (
                      <g fill="#e0f2fe" opacity="0.75">
                        <circle cx={-12 + ((simDays * 70) % 24)} cy={15 - ((simDays * 90) % 35)} r="3" />
                        <circle cx={14 - ((simDays * 50) % 20)} cy={20 - ((simDays * 110) % 40)} r="2.5" />
                        <circle cx={0 + ((simDays * 30) % 15)} cy={25 - ((simDays * 75) % 45)} r="4" />
                      </g>
                    )}

                    <text x="0" y="5" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Boiling Water
                    </text>
                    <text x="0" y="20" fill="#bae6fd" fontSize="9" textAnchor="middle">
                      (Primordial Ocean)
                    </text>
                  </g>

                  {/* Center-Top: Spark Reaction Chamber */}
                  <g transform="translate(440, 140)">
                    {/* Chamber Sphere */}
                    <circle cx="0" cy="0" r="62" fill="#0f172a" fillOpacity="0.9" />
                    <circle cx="0" cy="0" r="62" fill="url(#flaskShine)" />
                    <circle cx="0" cy="0" r="62" fill="none" stroke="#60a5fa" strokeWidth="3.5" opacity="0.7" />

                    {/* Atmosphere Gases Label */}
                    <text x="0" y="-38" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Reducing Atmosphere
                    </text>
                    <text x="0" y="-23" fill="#cbd5e1" fontSize="9" textAnchor="middle">
                      CH₄ + NH₃ + H₂ + H₂O
                    </text>

                    {/* Tungsten Electrodes */}
                    <line x1="-65" y1="0" x2="-22" y2="0" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
                    <circle cx="-65" cy="0" r="6" fill="#3b82f6" />
                    <line x1="65" y1="0" x2="22" y2="0" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
                    <circle cx="65" cy="0" r="6" fill="#ef4444" />

                    {/* High Voltage Lightning Arc */}
                    {isRunning && sparkActive && sparkPower > 15 && (
                      <g filter="url(#glow)">
                        <path
                          d={`M -22,0 L -12,${(Math.random() - 0.5) * 22} L 0,${(Math.random() - 0.5) * 28} L 12,${(Math.random() - 0.5) * 22} L 22,0`}
                          fill="none"
                          stroke="#67e8f9"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        <path
                          d={`M -22,0 L -8,${(Math.random() - 0.5) * 16} L 6,${(Math.random() - 0.5) * 20} L 22,0`}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <circle cx="0" cy="0" r="14" fill="#a5f3fc" opacity="0.35" />
                      </g>
                    )}

                    {/* Floating Gas Radicals when sparked */}
                    {isRunning && sparkPower > 25 && (
                      <g fontSize="8" fontWeight="bold" fill="#fde047" opacity="0.8">
                        <text x="-15" y="24">·CH₃</text>
                        <text x="10" y="28">·NH₂</text>
                        <text x="-5" y="42">·OH</text>
                      </g>
                    )}

                    <text x="0" y="55" fill="#f1f5f9" fontSize="8.5" fontWeight="600" textAnchor="middle">
                      High-Voltage Spark (~50kV)
                    </text>
                  </g>

                  {/* Flow Arrows and Labels */}
                  <g fill="#94a3b8" fontSize="10">
                    <text x="140" y="260" fill="#38bdf8" fontWeight="600">Water Vapor ↑</text>
                    <text x="590" y="220" fill="#a5f3fc" fontWeight="600">Gases to Cooler ↓</text>
                    <text x="350" y="465" fill="#f59e0b" fontWeight="600">Prebiotic Soup Circulation ➔</text>
                  </g>
                </svg>

                {/* Floating Telemetry HUD */}
                <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700/70 backdrop-blur rounded-xl p-3 shadow-lg max-w-xs text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-4 font-semibold text-slate-200">
                    <span className="flex items-center gap-1 text-indigo-400">
                      <Activity className="w-3.5 h-3.5" /> Chemical Phase:
                    </span>
                    <span className="text-amber-400">
                      {simDays < 1 ? 'Thermal Evaporation' : simDays < 3 ? 'Radical Cracking' : simDays < 5 ? 'Aldehyde / Cyanide' : 'Monomer Soup'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-400 pt-1 border-t border-slate-800">
                    <div>CH₄ Level: <span className="text-slate-200">{gases.ch4.toFixed(0)}%</span></div>
                    <div>NH₃ Level: <span className="text-slate-200">{gases.nh3.toFixed(0)}%</span></div>
                    <div>Glycine Yield: <span className="text-emerald-400 font-bold">{gases.glycine.toFixed(1)}%</span></div>
                    <div>Alanine Yield: <span className="text-emerald-400 font-bold">{gases.alanine.toFixed(1)}%</span></div>
                  </div>
                </div>

                {/* Spark Indicator Tag */}
                <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-900/90 border border-slate-700/70 backdrop-blur px-3 py-1.5 rounded-xl text-xs">
                  <Zap className={`w-4 h-4 ${sparkActive && isRunning ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
                  <span className="text-slate-300 font-medium">
                    Spark: {isRunning && sparkPower > 10 ? `${(sparkPower * 0.75).toFixed(0)} kV Active` : 'Discharged / Off'}
                  </span>
                </div>
              </div>

              {/* Apparatus Controls Bar */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
                {/* Spark intensity slider */}
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <Zap className="w-4 h-4" /> Electrode Voltage
                    </span>
                    <span className="font-mono text-white">{sparkPower}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sparkPower}
                    onChange={(e) => setSparkPower(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-400">Simulates thunderstorm electrical energy</span>
                </div>

                {/* Oceanic heat slider */}
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Flame className="w-4 h-4" /> Ocean Boiling Heat
                    </span>
                    <span className="font-mono text-white">{boilingHeat}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={boilingHeat}
                    onChange={(e) => setBoilingHeat(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-400">Generates circulation steam & evaporation</span>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                      isRunning
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30'
                    }`}
                  >
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isRunning ? 'Pause Lab' : 'Simulate Run'}
                  </button>

                  <button
                    onClick={handleResetSim}
                    title="Reset Apparatus"
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleRunFullExperiment}
                    title="1-Click 7-Day Run"
                    className="px-3 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold whitespace-nowrap shadow-lg shadow-emerald-950/40 transition-colors"
                  >
                    1-Click 7-Day
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chromatography' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    Paper Chromatography & Ninhydrin Assay
                  </h2>
                  <p className="text-xs text-slate-400">
                    Identification of synthesized amino acid monomers from the cooled U-tube prebiotic trap.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    Sample: {reactionProgress < 15 ? 'Sterile Distilled H₂O (No Amino Acids)' : 'Day 7 Prebiotic Broth'}
                  </span>
                </div>
              </div>

              {reactionProgress < 15 ? (
                <div className="bg-amber-950/30 border border-amber-800/40 p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-300">
                    <strong className="text-amber-300 font-semibold block mb-0.5">Insufficient Prebiotic Reaction Time</strong>
                    Return to the Glass Apparatus tab and run the electrical discharges for at least 1–2 simulated days so amino acid monomers can synthesize before taking a chromatography sample.
                  </div>
                </div>
              ) : null}

              {/* Chromatography Strip Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Chromatography Tank Canvas */}
                <div className="md:col-span-6 bg-slate-950 rounded-xl border border-slate-800 p-4 flex justify-center items-center h-[380px] relative">
                  <div className="relative w-48 h-80 bg-amber-50/95 rounded-sm shadow-xl border border-amber-200/40 p-3 flex flex-col justify-between overflow-hidden">
                    {/* Chromatography Paper texture */}
                    <div className="absolute inset-0 bg-repeat opacity-5 pointer-events-none" />

                    {/* Solvent Front Line */}
                    {chromaStep !== 'dry' && (
                      <div
                        className="absolute left-0 right-0 border-b-2 border-dashed border-cyan-700 transition-all pointer-events-none"
                        style={{ bottom: `${15 + solventProgress * 0.7}%` }}
                      >
                        <span className="absolute right-1 -top-4 text-[9px] font-bold text-cyan-800">
                          Solvent Front ({(solventProgress * 0.01 * 8.5).toFixed(1)} cm)
                        </span>
                      </div>
                    )}

                    {/* Wet Solvent Zone */}
                    {chromaStep !== 'dry' && (
                      <div
                        className="absolute left-0 right-0 bottom-0 bg-cyan-100/40 transition-all pointer-events-none"
                        style={{ height: `${15 + solventProgress * 0.7}%` }}
                      />
                    )}

                    {/* Origin Baseline */}
                    <div className="absolute left-2 right-2 bottom-12 border-b border-slate-500">
                      <span className="text-[9px] font-bold text-slate-600 block -mt-3.5">
                        Origin Baseline
                      </span>
                    </div>

                    {/* Amino Acid Spots */}
                    {/* Spot 1: Aspartic Acid (Rf ~ 0.24) */}
                    {chromaStep === 'sprayed' && (
                      <div
                        onClick={() => setSelectedMolecule('aspartic')}
                        className="absolute left-1/2 -translate-x-1/2 w-6 h-5 rounded-full bg-purple-600/85 hover:bg-purple-500 cursor-pointer shadow transition-transform hover:scale-125 flex items-center justify-center"
                        style={{ bottom: `${15 + solventProgress * 0.7 * 0.24}%` }}
                        title="Aspartic Acid spot"
                      >
                        <span className="text-[7px] font-extrabold text-white">Asp</span>
                      </div>
                    )}

                    {/* Spot 2: Glycine (Rf ~ 0.40) */}
                    {chromaStep === 'sprayed' && (
                      <div
                        onClick={() => setSelectedMolecule('glycine')}
                        className="absolute left-1/2 -translate-x-1/2 w-7 h-6 rounded-full bg-purple-800/90 hover:bg-purple-700 cursor-pointer shadow transition-transform hover:scale-125 flex items-center justify-center ring-2 ring-purple-400"
                        style={{ bottom: `${15 + solventProgress * 0.7 * 0.40}%` }}
                        title="Glycine spot (Major Product)"
                      >
                        <span className="text-[8px] font-extrabold text-white">Gly</span>
                      </div>
                    )}

                    {/* Spot 3: Alanine (Rf ~ 0.60) */}
                    {chromaStep === 'sprayed' && (
                      <div
                        onClick={() => setSelectedMolecule('alanine')}
                        className="absolute left-1/2 -translate-x-1/2 w-6 h-5 rounded-full bg-purple-700/85 hover:bg-purple-600 cursor-pointer shadow transition-transform hover:scale-125 flex items-center justify-center"
                        style={{ bottom: `${15 + solventProgress * 0.7 * 0.60}%` }}
                        title="Alanine spot"
                      >
                        <span className="text-[7px] font-extrabold text-white">Ala</span>
                      </div>
                    )}

                    {/* Original Sample Spot at baseline */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 bottom-11 w-3.5 h-3.5 rounded-full ${
                        chromaStep === 'dry' ? 'bg-amber-800' : 'bg-amber-900/30'
                      }`}
                    />
                  </div>

                  {/* Chamber Solvent Level at bottom */}
                  <div className="absolute bottom-2 left-6 right-6 h-5 bg-cyan-900/30 border-t border-cyan-500/40 rounded-b flex items-center justify-center">
                    <span className="text-[9px] text-cyan-300 font-mono">
                      Solvent: Butanol : Acetic Acid : Water (4:1:1)
                    </span>
                  </div>
                </div>

                {/* Right: Controls and Molecule Detective */}
                <div className="md:col-span-6 flex flex-col gap-4">
                  {/* Step Buttons */}
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                    <span className="text-xs font-semibold text-slate-300 block">
                      Chromatographic Assay Steps:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={reactionProgress < 15 || isChromaRunning || chromaStep !== 'dry'}
                        onClick={handleStartChroma}
                        className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Play className="w-3.5 h-3.5" />
                        1. Run Solvent Front
                      </button>

                      <button
                        disabled={chromaStep !== 'developed'}
                        onClick={handleApplyNinhydrin}
                        className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Droplets className="w-3.5 h-3.5" />
                        2. Spray Ninhydrin Reagent
                      </button>

                      <button
                        onClick={handleResetChroma}
                        className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition"
                      >
                        Reset Strip
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      {chromaStep === 'dry' && 'Spot of concentrated prebiotic soup placed on pencil baseline.'}
                      {chromaStep === 'running' && 'Capillary action drawing mobile phase upwards and partitioning solutes...'}
                      {chromaStep === 'developed' && 'Solvent front reached top mark! Amino acids are colorless until stained.'}
                      {chromaStep === 'sprayed' && 'Ninhydrin reacted with primary alpha-amino groups forming purple Ruhemann complexes!'}
                    </p>
                  </div>

                  {/* Identified Monomers Card */}
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 flex-1">
                    <span className="text-xs font-bold text-slate-200 mb-2 block">
                      Identified Prebiotic Amino Acids:
                    </span>

                    <div className="space-y-2">
                      <div
                        onClick={() => setSelectedMolecule('glycine')}
                        className={`p-2.5 rounded-lg border cursor-pointer transition text-xs flex items-center justify-between ${
                          selectedMolecule === 'glycine'
                            ? 'bg-purple-950/60 border-purple-500'
                            : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <strong className="text-purple-300 font-semibold block">Glycine (NH₂-CH₂-COOH)</strong>
                          <span className="text-[10px] text-slate-400">Rf = 0.40 • Simplest amino acid (Hydrogen R-group)</span>
                        </div>
                        <span className="text-xs font-bold text-purple-400">Most Abundant</span>
                      </div>

                      <div
                        onClick={() => setSelectedMolecule('alanine')}
                        className={`p-2.5 rounded-lg border cursor-pointer transition text-xs flex items-center justify-between ${
                          selectedMolecule === 'alanine'
                            ? 'bg-purple-950/60 border-purple-500'
                            : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <strong className="text-purple-300 font-semibold block">Alanine (CH₃-CH(NH₂)-COOH)</strong>
                          <span className="text-[10px] text-slate-400">Rf = 0.60 • Non-polar methyl side chain</span>
                        </div>
                        <span className="text-xs font-bold text-slate-300">Moderate</span>
                      </div>

                      <div
                        onClick={() => setSelectedMolecule('aspartic')}
                        className={`p-2.5 rounded-lg border cursor-pointer transition text-xs flex items-center justify-between ${
                          selectedMolecule === 'aspartic'
                            ? 'bg-purple-950/60 border-purple-500'
                            : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <strong className="text-purple-300 font-semibold block">Aspartic Acid (HOOC-CH₂-CH(NH₂)-COOH)</strong>
                          <span className="text-[10px] text-slate-400">Rf = 0.24 • Acidic dicarboxylic amino acid</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400">Trace</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kcse' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    KCSE Form 4 Biology: Chemical Evolution Examination
                  </h2>
                  <p className="text-xs text-slate-400">
                    Official syllabus questions evaluating the Miller-Urey experiment, prebiotic atmosphere, and origin of life.
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

              {/* Quiz Questions List */}
              <div className="space-y-4">
                {KCSE_CHALLENGES.map((item, idx) => (
                  <div key={item.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-900/70 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
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
                          btnStyle = 'bg-indigo-900/80 border-indigo-400 text-white font-medium';
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

              {/* Quiz Action Submit */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  {Object.keys(userAnswers).length} of {KCSE_CHALLENGES.length} answered
                </span>

                {!submittedQuiz ? (
                  <button
                    disabled={Object.keys(userAnswers).length < KCSE_CHALLENGES.length}
                    onClick={handleQuizSubmit}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-lg transition"
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

        {/* Right Column: Chemical Reaction Steps & Scientific Principles */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Reaction Stages Stepper */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Prebiotic Reaction Mechanism
            </h3>

            <div className="space-y-2.5">
              {/* Stage 1 */}
              <div className={`p-3 rounded-xl border text-xs transition-colors ${
                milestones.oceanBoiling
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                  : 'bg-slate-800/30 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    1. Thermal Evaporation & Reducing Mix
                  </span>
                  {milestones.oceanBoiling ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                  )}
                </div>
                <p className="text-[11px] leading-relaxed">
                  Boiling ocean water provides continuous steam ($H_2O$), sweeping CH₄, NH₃, and H₂ into closed circulation.
                </p>
              </div>

              {/* Stage 2 */}
              <div className={`p-3 rounded-xl border text-xs transition-colors ${
                milestones.sparkDischarge
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                  : 'bg-slate-800/30 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    2. Electric Spark Bond Cracking
                  </span>
                  {milestones.sparkDischarge ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                  )}
                </div>
                <p className="text-[11px] leading-relaxed">
                  High-voltage tungsten sparks split covalent bonds, creating free radicals: $\cdot\text{CH}_3$, $\cdot\text{NH}_2$, $\cdot\text{H}$, and $\cdot\text{OH}$.
                </p>
              </div>

              {/* Stage 3 */}
              <div className={`p-3 rounded-xl border text-xs transition-colors ${
                milestones.radicalsFormed
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                  : 'bg-slate-800/30 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    3. Strecker Synthesis Intermediates
                  </span>
                  {milestones.radicalsFormed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                  )}
                </div>
                <p className="text-[11px] leading-relaxed">
                  Radicals recombine into Hydrogen Cyanide ($HCN$) and Formaldehyde ($HCHO$), which react with ammonia to form aminonitriles.
                </p>
              </div>

              {/* Stage 4 */}
              <div className={`p-3 rounded-xl border text-xs transition-colors ${
                milestones.aminoAcidsSynthesized
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                  : 'bg-slate-800/30 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    4. Condensation into Prebiotic Soup
                  </span>
                  {milestones.aminoAcidsSynthesized ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                  )}
                </div>
                <p className="text-[11px] leading-relaxed">
                  Water condenser washes stable amino acids down into the U-trap trap, preventing thermal decomposition.
                </p>
              </div>
            </div>
          </div>

          {/* Syllabus Knowledge Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" />
              KCSE Form 4 Syllabus Key Concepts
            </h3>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <span className="font-semibold text-indigo-300 block mb-1">1. Abiogenesis / Chemical Evolution:</span>
                The hypothesis that living organisms arose from non-living organic compounds through continuous polymerisation and self-assembly over billions of years.
              </div>

              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <span className="font-semibold text-cyan-300 block mb-1">2. Reducing vs. Oxidizing Atmosphere:</span>
                Without molecular oxygen, organic monomers did not oxidize. Without an ozone layer, intense solar UV and lightning struck the surface unimpeded.
              </div>

              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <span className="font-semibold text-amber-300 block mb-1">3. Significance of Amino Acids:</span>
                Amino acids are the building blocks of proteins, catalysts (enzymes), and structural tissue necessary for the emergence of protocells.
              </div>
            </div>
          </div>

          {/* Quick Mastery Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-xs space-y-2">
            <span className="font-bold text-slate-200 block text-xs">Laboratory Learning Milestones:</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                {milestones.sparkDischarge ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                Spark Activated
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                {milestones.oceanBoiling ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                Ocean Steam Loop
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                {milestones.aminoAcidsSynthesized ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                Amino Acids Formed
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                {milestones.chromatographyDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                Ninhydrin Stained
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
