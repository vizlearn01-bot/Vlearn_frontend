import React, { useState, useEffect, useMemo } from 'react';
import {
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  Layers,
  Eye,
  EyeOff,
  Activity,
  Award,
  Maximize2,
  Leaf,
  PawPrint,
  Shield,
  Droplets,
  Microscope,
  Split
} from 'lucide-react';

// ============================================================================
// GRADE 10 BIOLOGY DEFINING ORGANELLES & COMPARISON DATA
// ============================================================================
const ORGANELLES = {
  cell_wall: {
    id: 'cell_wall',
    name: 'Cell Wall',
    plantStatus: 'Present (outermost boundary)',
    animalStatus: 'Absent',
    definingDifference:
      'Present in Plant Cell (provides structural rigidity and shape); Absent in Animal Cell (allows flexibility).',
    description:
      'A non-living, permeable layer composed of cellulose microfibrils and pectin matrix. It provides tensile strength to withstand high internal osmotic turgor pressure, preventing cell lysis (bursting).',
    primaryFunction: 'Mechanical support, maintaining fixed cell shape, and resisting osmotic bursting.',
    stainingNote: 'Readily stained with Iodine solution or Light Green in onion epidermis wet mounts.',
    category: 'plant_only',
    color: '#22c55e',
    accentBg: 'bg-emerald-500/20',
    accentBorder: 'border-emerald-500/40',
    accentText: 'text-emerald-400'
  },
  cell_membrane: {
    id: 'cell_membrane',
    name: 'Cell Membrane (Plasma Membrane)',
    plantStatus: 'Present (inner to cell wall)',
    animalStatus: 'Present (outer boundary)',
    definingDifference:
      'Present in both. In plants, it presses firmly against the rigid cell wall; in animals, it forms the outermost flexible boundary allowing cell deformation and motility.',
    description:
      'A selectively permeable phospholipid bilayer with integrated transport proteins and cholesterol. It regulates the influx and efflux of ions, water, and organic metabolites.',
    primaryFunction: 'Controls selective transport, maintains homeostasis, and facilitates cell signaling.',
    stainingNote: 'Stains with Methylene Blue; ultra-thin (~7-10 nm) requiring electron microscopy for detailed bilayers.',
    category: 'shared',
    color: '#38bdf8',
    accentBg: 'bg-sky-500/20',
    accentBorder: 'border-sky-500/40',
    accentText: 'text-sky-400'
  },
  chloroplast: {
    id: 'chloroplast',
    name: 'Chloroplasts',
    plantStatus: 'Present (green photosynthetic cells)',
    animalStatus: 'Absent',
    definingDifference:
      'Present in Plant Cell (site of photosynthesis); Absent in Animal Cell (heterotrophic).',
    description:
      'Double-membraned biconvex organelle containing chlorophyll organized in stacked thylakoid discs (grana) suspended in a gel-like stroma. Contains its own circular DNA and 70S ribosomes.',
    primaryFunction: 'Traps solar light energy to synthesize glucose and oxygen from carbon dioxide and water (photosynthesis).',
    stainingNote: 'Intensely green from chlorophyll; plainly visible unstained under 400x light microscopy in Elodea or moss leaves.',
    category: 'plant_only',
    color: '#16a34a',
    accentBg: 'bg-green-500/20',
    accentBorder: 'border-green-500/40',
    accentText: 'text-green-400'
  },
  vacuole: {
    id: 'vacuole',
    name: 'Vacuole (Central vs. Small)',
    plantStatus: 'Large permanent central vacuole (50-80% volume)',
    animalStatus: 'Small temporary vacuoles / vesicles',
    definingDifference:
      'Large permanent vacuole in Plant Cell (maintains turgor support); Only small temporary vacuoles in Animal Cell.',
    description:
      'In plants, a dominant central organelle enclosed by a semi-permeable tonoplast membrane and filled with cell sap (water, mineral ions, sugars, pigments). In animals, small fleeting vesicles involved in endocytosis or pinocytosis.',
    primaryFunction: 'In plants: osmotic water absorption creates outward turgor pressure against cell walls, keeping stems and leaves firm and upright. In animals: transient storage.',
    stainingNote: 'The massive plant central vacuole displaces the nucleus and cytoplasm to the extreme cell perimeter.',
    category: 'defining_contrast',
    color: '#0ea5e9',
    accentBg: 'bg-cyan-500/20',
    accentBorder: 'border-cyan-500/40',
    accentText: 'text-cyan-400'
  },
  nucleus: {
    id: 'nucleus',
    name: 'Nucleus & Nucleolus',
    plantStatus: 'Present (peripheral location)',
    animalStatus: 'Present (central location)',
    definingDifference:
      'Present in both. Located at the periphery in plant cells (pushed aside by large vacuole); typically centrally positioned in animal cells.',
    description:
      'Large spherical organelle bounded by a double-membraned nuclear envelope perforated by nuclear pores. Contains chromatin (DNA and histone proteins) and a dense nucleolus.',
    primaryFunction: 'Controls all cellular metabolism, directs protein synthesis via mRNA transcription, and transmits hereditary chromosomes during division.',
    stainingNote: 'Intensely stained dark purple or blue with Methylene Blue or Acetocarmine.',
    category: 'shared',
    color: '#818cf8',
    accentBg: 'bg-indigo-500/20',
    accentBorder: 'border-indigo-500/40',
    accentText: 'text-indigo-400'
  },
  mitochondria: {
    id: 'mitochondria',
    name: 'Mitochondria (Powerhouses)',
    plantStatus: 'Present (aerobic respiration 24/7)',
    animalStatus: 'Present (abundant for high motility)',
    definingDifference:
      'Present in both. Both plant and animal cells rely on mitochondria for aerobic cellular respiration to generate ATP.',
    description:
      'Rod-shaped or oval double-membraned organelle. The inner membrane is folded into finger-like cristae to maximize surface area for respiratory electron transport enzymes and ATP synthase.',
    primaryFunction: 'Aerobic cellular respiration: oxidizes pyruvic acid and glucose derivatives to generate ATP energy, water, and carbon dioxide.',
    stainingNote: 'Visualized under high power using vital dye Janus Green B which turns blue-green when oxidized.',
    category: 'shared',
    color: '#f97316',
    accentBg: 'bg-amber-500/20',
    accentBorder: 'border-amber-500/40',
    accentText: 'text-amber-400'
  },
  centrioles: {
    id: 'centrioles',
    name: 'Centrioles / Centrosome',
    plantStatus: 'Absent (in higher plants)',
    animalStatus: 'Present (pair near nucleus)',
    definingDifference:
      'Present in Animal Cell (organizes spindle fibers during cell division); Absent in higher plant cells.',
    description:
      'A centrosomal pair of hollow cylindrical barrels arranged perpendicular to each other. Each barrel is composed of nine triplets of microtubules in a ring.',
    primaryFunction: 'Organizes the microtubule mitotic spindle apparatus that separates sister chromatids during animal mitosis and meiosis.',
    stainingNote: 'Located adjacent to the animal cell nuclear envelope; best resolved during prophase and metaphase.',
    category: 'animal_only',
    color: '#ec4899',
    accentBg: 'bg-pink-500/20',
    accentBorder: 'border-pink-500/40',
    accentText: 'text-pink-400'
  },
  cytoplasm: {
    id: 'cytoplasm',
    name: 'Cytoplasm (Cytosol & Cyclosis)',
    plantStatus: 'Present (active cyclosis around vacuole)',
    animalStatus: 'Present (throughout cell interior)',
    definingDifference:
      'Present in both. In plant cells, exhibits pronounced circular cytoplasmic streaming (cyclosis) around the large central vacuole.',
    description:
      'Gel-like colloidal aqueous matrix composed of water, dissolved salts, amino acids, enzymes, and a cytoskeletal network of microfilaments.',
    primaryFunction: 'Site of fundamental metabolic pathways (such as glycolysis) and provides a medium for cytoplasmic organelle distribution.',
    stainingNote: 'Stains light pinkish-orange with Eosin counterstain in histological preparations.',
    category: 'shared',
    color: '#10b981',
    accentBg: 'bg-teal-500/20',
    accentBorder: 'border-teal-500/40',
    accentText: 'text-teal-400'
  }
};

// ============================================================================
// GRADE 10 QUICK-CHECK ASSESSMENT CHALLENGES
// ============================================================================
const QUICK_CHECK_QUIZ = [
  {
    id: 1,
    question: 'Which structure is present in a plant cell to maintain structural shape and prevent it from bursting in pure water?',
    options: ['Plasma Membrane', 'Cell Wall', 'Centrioles', 'Mitochondria'],
    correctIndex: 1,
    explanation: 'The rigid cellulose cell wall provides mechanical strength, exerting turgor pressure back against the cell sap and preventing osmotic lysis.'
  },
  {
    id: 2,
    question: 'Why are chloroplasts absent in animal cells?',
    options: [
      'Animal cells lack genetic material',
      'Animals are heterotrophs that consume organic nutrients rather than photosynthesizing',
      'Animal cells are too small to house chloroplasts',
      'Animal cell membranes block sunlight'
    ],
    correctIndex: 1,
    explanation: 'Animals are heterotrophs; they must obtain ready-made organic food through feeding rather than producing glucose via solar photosynthesis.'
  },
  {
    id: 3,
    question: 'How does the central vacuole in a mature plant cell differ from animal cell vacuoles?',
    options: [
      'Plant cells have one large permanent central vacuole maintaining turgor support',
      'Plant vacuoles are small and temporary',
      'Animal cell vacuoles produce chlorophyll for energy',
      'Plant vacuoles are used exclusively for locomotion'
    ],
    correctIndex: 0,
    explanation: 'Plant cells develop a large, permanent central vacuole filled with cell sap that maintains turgor pressure to support plant leaves and stems.'
  },
  {
    id: 4,
    question: 'Which structure is found in animal cells to help organize spindle fibers during mitosis, but is absent in higher plants?',
    options: ['Mitochondria', 'Centrioles', 'Ribosomes', 'Cell Membrane'],
    correctIndex: 1,
    explanation: 'Centrioles (arranged in perpendicular pairs inside the centrosome) organize spindle fibers in animal cell division, but higher plants divide without centrioles.'
  }
];

export default function AnimalVsPlantCellSim({ config = {}, onTelemetry }) {
  // Mode selector: 'side-by-side' | 'plant' | 'animal'
  const [mode, setMode] = useState('side-by-side');

  // Currently inspected organelle
  const [selectedOrganelleId, setSelectedOrganelleId] = useState('cell_wall');

  // Filter category: 'all' | 'plant_only' | 'animal_only' | 'shared'
  const [activeFilter, setActiveFilter] = useState('all');

  // Label pins toggle (great for self-assessment)
  const [showLabels, setShowLabels] = useState(true);

  // Living cytoplasmic streaming & shimmer animation toggle
  const [isLivingAnimated, setIsLivingAnimated] = useState(true);

  // Turgor State demonstration for Plant Cell: 'turgid' | 'normal' | 'flaccid'
  const [turgorState, setTurgorState] = useState('turgid');

  // Quick Check assessment state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [hasTriggeredTelemetry, setHasTriggeredTelemetry] = useState(false);

  // Telemetry: Triggered when learner compares both cells
  useEffect(() => {
    if (mode === 'side-by-side' && !hasTriggeredTelemetry) {
      if (onTelemetry) {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'animal_vs_plant_cell',
          mode: 'side-by-side'
        });
      }
      setHasTriggeredTelemetry(true);
    }
  }, [mode, hasTriggeredTelemetry, onTelemetry]);

  // Instant Reset function
  const handleReset = () => {
    setMode('side-by-side');
    setSelectedOrganelleId('cell_wall');
    setActiveFilter('all');
    setShowLabels(true);
    setIsLivingAnimated(true);
    setTurgorState('turgid');
    setQuizAnswers({});
    setShowQuizResults(false);
    if (onTelemetry) {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'animal_vs_plant_cell',
        mode: 'side-by-side'
      });
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (onTelemetry) {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'animal_vs_plant_cell',
        mode: newMode
      });
    }
  };

  const handleSelectOrganelle = (id) => {
    setSelectedOrganelleId(id);
  };

  const handleQuizOptionSelect = (qId, optionIdx) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const currentOrganelle = ORGANELLES[selectedOrganelleId] || ORGANELLES.cell_wall;

  // Filter helper: whether organelle matches active filter or selection
  const isOrganelleHighlighted = (orgId) => {
    if (selectedOrganelleId === orgId) return true;
    if (activeFilter === 'all') return false;
    const item = ORGANELLES[orgId];
    if (!item) return false;
    if (activeFilter === 'plant_only') {
      return item.category === 'plant_only' || item.id === 'vacuole';
    }
    if (activeFilter === 'animal_only') {
      return item.category === 'animal_only';
    }
    if (activeFilter === 'shared') {
      return item.category === 'shared';
    }
    return false;
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col font-sans transition-all duration-300">
      {/* ==================================================================== */}
      {/* 1. TOP HEADER & TELEMETRY NAV BAR */}
      {/* ==================================================================== */}
      <header className="px-6 py-5 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-inner">
            <Microscope className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Grade 10 Biology · Topic 1
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Cell Biology & Biodiversity
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
              Animal Cell vs. Plant Cell
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-normal">
                Ultrastructure Comparison
              </span>
            </h1>
          </div>
        </div>

        {/* Action Controls: Mode Selector & Reset Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="bg-slate-900/90 p-1 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-md">
            <button
              onClick={() => handleModeChange('side-by-side')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'side-by-side'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              Side-by-Side Comparison
            </button>

            <button
              onClick={() => handleModeChange('plant')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'plant'
                  ? 'bg-green-600 text-white shadow-md shadow-green-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-green-300" />
              Plant Cell
            </button>

            <button
              onClick={() => handleModeChange('animal')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'animal'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PawPrint className="w-3.5 h-3.5 text-rose-300" />
              Animal Cell
            </button>
          </div>

          {/* Instant Reset Button */}
          <button
            onClick={handleReset}
            title="Instant Reset to Side-by-Side View"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            Reset
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. SECONDARY CONTROLS & FILTER BAR */}
      {/* ==================================================================== */}
      <div className="px-6 py-3 bg-slate-900/70 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Quick Highlight Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" /> Filter:
          </span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-200 text-slate-950 font-bold'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Structures
          </button>
          <button
            onClick={() => setActiveFilter('plant_only')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              activeFilter === 'plant_only'
                ? 'bg-green-500 text-slate-950 font-bold'
                : 'bg-slate-800/80 text-green-400 hover:bg-green-500/20'
            }`}
          >
            <Leaf className="w-3 h-3" /> Plant-Only (Wall, Chloroplast, Large Vacuole)
          </button>
          <button
            onClick={() => setActiveFilter('animal_only')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              activeFilter === 'animal_only'
                ? 'bg-rose-500 text-slate-950 font-bold'
                : 'bg-slate-800/80 text-rose-400 hover:bg-rose-500/20'
            }`}
          >
            <PawPrint className="w-3 h-3" /> Animal-Only (Centrioles)
          </button>
          <button
            onClick={() => setActiveFilter('shared')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              activeFilter === 'shared'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'bg-slate-800/80 text-sky-400 hover:bg-sky-500/20'
            }`}
          >
            <Shield className="w-3 h-3" /> Shared Structures
          </button>
        </div>

        {/* Visual Toggles: Labels & Living Dynamics */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLabels((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer border ${
              showLabels
                ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {showLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {showLabels ? 'Labels: ON' : 'Labels: OFF'}
          </button>

          <button
            onClick={() => setIsLivingAnimated((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer border ${
              isLivingAnimated
                ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {isLivingAnimated ? 'Living Streaming: Active' : 'Living Streaming: Paused'}
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. DEFINING DIFFERENCES PROMINENT CALLOUT BANNER */}
      {/* ==================================================================== */}
      <section className="mx-6 mt-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-800/40 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl border ${currentOrganelle.accentBg} ${currentOrganelle.accentBorder} ${currentOrganelle.accentText}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Selected Structure:
              </span>
              <h2 className="text-base font-extrabold text-white">
                {currentOrganelle.name}
              </h2>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border ${
                  currentOrganelle.category === 'plant_only'
                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                    : currentOrganelle.category === 'animal_only'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                }`}
              >
                {currentOrganelle.category === 'plant_only'
                  ? '🌿 Plant Cell Only'
                  : currentOrganelle.category === 'animal_only'
                  ? '🐾 Animal Cell Only'
                  : '🔄 Shared by Both'}
              </span>
            </div>
            <p className="text-xs text-indigo-200/90 mt-1 font-medium leading-relaxed">
              <strong className="text-amber-300">Defining Difference:</strong>{' '}
              {currentOrganelle.definingDifference}
            </p>
          </div>
        </div>

        {/* Direct comparison quick badges */}
        <div className="flex items-center gap-3 text-xs bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 self-stretch md:self-auto justify-around">
          <div className="text-center px-2">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Plant Cell</span>
            <span className="font-bold text-slate-200 text-xs">{currentOrganelle.plantStatus}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center px-2">
            <span className="text-[10px] text-rose-400 uppercase font-bold block">Animal Cell</span>
            <span className="font-bold text-slate-200 text-xs">{currentOrganelle.animalStatus}</span>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. MAIN VISUAL CANVAS & CELL ILLUSTRATIONS */}
      {/* ==================================================================== */}
      <main className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Visual Area: High-contrast clean organic SVG diagrams */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div
            className={`grid gap-6 ${
              mode === 'side-by-side' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {/* ------------------------------------------------------------- */}
            {/* PLANT CELL SVG CARD */}
            {/* ------------------------------------------------------------- */}
            {(mode === 'side-by-side' || mode === 'plant') && (
              <div
                className={`bg-slate-900/90 border rounded-3xl p-5 shadow-xl flex flex-col transition-all duration-300 ${
                  mode === 'plant'
                    ? 'border-green-500/50 shadow-green-950/30 ring-1 ring-green-500/30'
                    : 'border-slate-800 hover:border-green-500/40'
                }`}
              >
                {/* Header of Plant Cell */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30">
                      <Leaf className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-white tracking-wide">
                        PLANT CELL (Autotrophic)
                      </h3>
                      <p className="text-[11px] text-green-400 font-medium">
                        Rigid regular shape · Cellulose cell wall · Chloroplasts
                      </p>
                    </div>
                  </div>

                  {mode === 'plant' && (
                    <div className="flex items-center gap-1 text-[11px] bg-green-950/60 text-green-300 px-2.5 py-1 rounded-lg border border-green-700/40">
                      <Maximize2 className="w-3 h-3" /> Focus View
                    </div>
                  )}
                </div>

                {/* SVG Illustration Container */}
                <div className="relative w-full aspect-[500/420] bg-slate-950/80 rounded-2xl overflow-hidden border border-slate-800/80 flex items-center justify-center p-2">
                  <svg
                    viewBox="0 0 500 420"
                    className="w-full h-full select-none"
                    style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}
                  >
                    <defs>
                      <linearGradient id="plantWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#15803d" />
                        <stop offset="50%" stopColor="#166534" />
                        <stop offset="100%" stopColor="#14532d" />
                      </linearGradient>

                      <radialGradient id="plantCytoGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#064e3b" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#022c22" stopOpacity="0.95" />
                      </radialGradient>

                      <linearGradient id="plantVacuoleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.38" />
                        <stop offset="70%" stopColor="#0284c7" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0369a1" stopOpacity="0.45" />
                      </linearGradient>

                      <linearGradient id="chloroplastGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="50%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#15803d" />
                      </linearGradient>

                      <radialGradient id="plantNucleusGrad" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#a5b4fc" />
                        <stop offset="50%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#3730a3" />
                      </radialGradient>

                      <linearGradient id="mitoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fb923c" />
                        <stop offset="60%" stopColor="#ea580c" />
                        <stop offset="100%" stopColor="#9a3412" />
                      </linearGradient>

                      <filter id="activeGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>

                      <style>{`
                        @keyframes cytostreamCW {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                        }
                        @keyframes chloroshimmer {
                          0%, 100% { opacity: 0.85; transform: scale(1); }
                          50% { opacity: 1; transform: scale(1.03); }
                        }
                        @keyframes mitoglow {
                          0%, 100% { filter: drop-shadow(0 0 1px #f97316); }
                          50% { filter: drop-shadow(0 0 4px #fbbf24); }
                        }
                        .streaming-ring {
                          transform-origin: 250px 220px;
                          animation: cytostreamCW ${isLivingAnimated ? '24s' : '0s'} linear infinite;
                        }
                        .chloro-glow {
                          transform-origin: center;
                          animation: chloroshimmer ${isLivingAnimated ? '3.5s' : '0s'} ease-in-out infinite;
                        }
                        .mito-glow {
                          animation: mitoglow ${isLivingAnimated ? '2.5s' : '0s'} ease-in-out infinite;
                        }
                      `}</style>
                    </defs>

                    {/* 1. Rigid Cellulose Cell Wall (Thick regular outer polygon) */}
                    <g
                      onClick={() => handleSelectOrganelle('cell_wall')}
                      className="cursor-pointer group"
                    >
                      <rect
                        x="32"
                        y="24"
                        width="436"
                        height="372"
                        rx="36"
                        ry="36"
                        fill="url(#plantWallGrad)"
                        stroke={
                          isOrganelleHighlighted('cell_wall') ? '#f59e0b' : '#22c55e'
                        }
                        strokeWidth={isOrganelleHighlighted('cell_wall') ? 6 : 4}
                        className="transition-all duration-300"
                        filter={isOrganelleHighlighted('cell_wall') ? 'url(#activeGlow)' : undefined}
                      />

                      {/* Middle Lamella line */}
                      <rect
                        x="40"
                        y="32"
                        width="420"
                        height="356"
                        rx="30"
                        ry="30"
                        fill="none"
                        stroke="#86efac"
                        strokeWidth="1.5"
                        strokeDasharray="5,3"
                        opacity="0.6"
                      />

                      {/* Cellulose corner microfibril braces */}
                      <path
                        d="M 50 34 L 65 24 M 435 34 L 450 24 M 50 386 L 65 396 M 435 386 L 450 396"
                        stroke="#4ade80"
                        strokeWidth="2"
                        opacity="0.7"
                      />
                    </g>

                    {/* 2. Plasma Membrane (Thin layer directly inner to wall) */}
                    <g
                      onClick={() => handleSelectOrganelle('cell_membrane')}
                      className="cursor-pointer group"
                    >
                      <rect
                        x="48"
                        y="40"
                        width="404"
                        height="340"
                        rx="24"
                        ry="24"
                        fill="url(#plantCytoGrad)"
                        stroke={
                          isOrganelleHighlighted('cell_membrane') ? '#38bdf8' : '#4ade80'
                        }
                        strokeWidth={isOrganelleHighlighted('cell_membrane') ? 4 : 2}
                        filter={isOrganelleHighlighted('cell_membrane') ? 'url(#activeGlow)' : undefined}
                        className="transition-all duration-300"
                      />
                    </g>

                    {/* 3. Living Cytoplasmic Streaming Ring (cyclosis particles) */}
                    <g
                      onClick={() => handleSelectOrganelle('cytoplasm')}
                      className="cursor-pointer streaming-ring"
                    >
                      <circle cx="110" cy="180" r="3" fill="#86efac" opacity="0.6" />
                      <circle cx="160" cy="70" r="2.5" fill="#a7f3d0" opacity="0.8" />
                      <circle cx="340" cy="70" r="3" fill="#6ee7b7" opacity="0.7" />
                      <circle cx="410" cy="180" r="2" fill="#86efac" opacity="0.7" />
                      <circle cx="410" cy="270" r="3" fill="#a7f3d0" opacity="0.6" />
                      <circle cx="340" cy="355" r="2.5" fill="#6ee7b7" opacity="0.75" />
                      <circle cx="160" cy="355" r="3" fill="#86efac" opacity="0.8" />
                      <circle cx="95" cy="270" r="2" fill="#a7f3d0" opacity="0.7" />
                    </g>

                    {/* 4. Large Permanent Central Vacuole (Dominant ~65% cell volume) */}
                    <g
                      onClick={() => handleSelectOrganelle('vacuole')}
                      className="cursor-pointer group"
                      style={{
                        transformOrigin: '270px 220px',
                        transform:
                          turgorState === 'turgid'
                            ? 'scale(1.03)'
                            : turgorState === 'flaccid'
                            ? 'scale(0.88)'
                            : 'scale(0.96)'
                      }}
                    >
                      <path
                        d="M 170 115 C 260 90, 360 95, 395 140 C 430 185, 425 265, 385 310 C 345 355, 230 355, 175 325 C 120 295, 130 180, 170 115 Z"
                        fill="url(#plantVacuoleGrad)"
                        stroke={
                          isOrganelleHighlighted('vacuole') ? '#38bdf8' : '#0284c7'
                        }
                        strokeWidth={isOrganelleHighlighted('vacuole') ? 4 : 2.5}
                        filter={isOrganelleHighlighted('vacuole') ? 'url(#activeGlow)' : undefined}
                        className="transition-all duration-300"
                      />

                      {/* Cell Sap Water Shimmer */}
                      <circle cx="280" cy="190" r="22" fill="#38bdf8" opacity="0.1" />
                      <circle cx="320" cy="240" r="30" fill="#bae6fd" opacity="0.08" />
                      <circle cx="230" cy="250" r="16" fill="#38bdf8" opacity="0.12" />

                      {/* Turgor outward force arrows when turgid */}
                      {turgorState === 'turgid' && (
                        <g opacity="0.45" stroke="#38bdf8" strokeWidth="1.5" fill="none">
                          <path d="M 370 200 L 400 200 M 395 195 L 400 200 L 395 205" />
                          <path d="M 280 120 L 280 95 M 275 100 L 280 95 L 285 100" />
                          <path d="M 280 320 L 280 345 M 275 340 L 280 345 L 285 340" />
                          <path d="M 180 220 L 155 220 M 160 215 L 155 220 L 160 225" />
                        </g>
                      )}
                    </g>

                    {/* 5. Nucleus with Nucleolus (Pushed to peripheral wall by vacuole) */}
                    <g
                      onClick={() => handleSelectOrganelle('nucleus')}
                      className="cursor-pointer group"
                    >
                      <circle
                        cx="105"
                        cy="110"
                        r="38"
                        fill="url(#plantNucleusGrad)"
                        stroke={
                          isOrganelleHighlighted('nucleus') ? '#f59e0b' : '#818cf8'
                        }
                        strokeWidth={isOrganelleHighlighted('nucleus') ? 4 : 2}
                        filter={isOrganelleHighlighted('nucleus') ? 'url(#activeGlow)' : undefined}
                        className="transition-all duration-300"
                      />
                      <circle
                        cx="105"
                        cy="110"
                        r="35"
                        fill="none"
                        stroke="#c7d2fe"
                        strokeWidth="1"
                        strokeDasharray="4,4"
                        opacity="0.7"
                      />
                      <circle cx="100" cy="106" r="13" fill="#312e81" stroke="#4338ca" strokeWidth="1" />
                      <path
                        d="M 85 122 Q 95 115 112 124 Q 125 130 130 115"
                        stroke="#e0e7ff"
                        strokeWidth="1.2"
                        fill="none"
                        opacity="0.6"
                      />
                    </g>

                    {/* 6. Chloroplasts with Thylakoid Grana Stacks (Plant Specific) */}
                    <g
                      onClick={() => handleSelectOrganelle('chloroplast')}
                      className="cursor-pointer group chloro-glow"
                    >
                      {/* Chloroplast 1 (Top Right) */}
                      <g transform="translate(320, 68) rotate(15)">
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="26"
                          ry="15"
                          fill="url(#chloroplastGrad)"
                          stroke={isOrganelleHighlighted('chloroplast') ? '#facc15' : '#15803d'}
                          strokeWidth={isOrganelleHighlighted('chloroplast') ? 3 : 1.5}
                          filter={isOrganelleHighlighted('chloroplast') ? 'url(#activeGlow)' : undefined}
                        />
                        <line x1="-14" y1="-5" x2="-14" y2="5" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                        <line x1="-5" y1="-7" x2="-5" y2="7" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                        <line x1="5" y1="-7" x2="5" y2="7" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                        <line x1="14" y1="-5" x2="14" y2="5" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                        <line x1="-14" y1="0" x2="14" y2="0" stroke="#166534" strokeWidth="1" />
                      </g>

                      {/* Chloroplast 2 (Bottom Left) */}
                      <g transform="translate(95, 290) rotate(-20)">
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="27"
                          ry="16"
                          fill="url(#chloroplastGrad)"
                          stroke={isOrganelleHighlighted('chloroplast') ? '#facc15' : '#15803d'}
                          strokeWidth={isOrganelleHighlighted('chloroplast') ? 3 : 1.5}
                        />
                        <line x1="-15" y1="-5" x2="-15" y2="5" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                        <line x1="-5" y1="-8" x2="-5" y2="8" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                        <line x1="5" y1="-8" x2="5" y2="8" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                        <line x1="15" y1="-5" x2="15" y2="5" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                        <line x1="-15" y1="0" x2="15" y2="0" stroke="#166534" strokeWidth="1" />
                      </g>

                      {/* Chloroplast 3 (Bottom Right) */}
                      <g transform="translate(415, 230) rotate(80)">
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="28"
                          ry="16"
                          fill="url(#chloroplastGrad)"
                          stroke={isOrganelleHighlighted('chloroplast') ? '#facc15' : '#15803d'}
                          strokeWidth={isOrganelleHighlighted('chloroplast') ? 3 : 1.5}
                        />
                        <line x1="-15" y1="-5" x2="-15" y2="5" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                        <line x1="-5" y1="-8" x2="-5" y2="8" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                        <line x1="5" y1="-8" x2="5" y2="8" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                        <line x1="15" y1="-5" x2="15" y2="5" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                      </g>

                      {/* Chloroplast 4 (Bottom Center) */}
                      <g transform="translate(250, 355) rotate(-5)">
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="25"
                          ry="15"
                          fill="url(#chloroplastGrad)"
                          stroke={isOrganelleHighlighted('chloroplast') ? '#facc15' : '#15803d'}
                          strokeWidth={isOrganelleHighlighted('chloroplast') ? 3 : 1.5}
                        />
                        <line x1="-13" y1="-5" x2="-13" y2="5" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                        <line x1="-4" y1="-7" x2="-4" y2="7" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                        <line x1="5" y1="-7" x2="5" y2="7" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                        <line x1="14" y1="-5" x2="14" y2="5" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
                      </g>
                    </g>

                    {/* 7. Mitochondria (Cellular Respiration ATP) */}
                    <g
                      onClick={() => handleSelectOrganelle('mitochondria')}
                      className="cursor-pointer group mito-glow"
                    >
                      {/* Mitochondrion 1 */}
                      <g transform="translate(210, 68) rotate(-35)">
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="19"
                          ry="10"
                          fill="url(#mitoGrad)"
                          stroke={isOrganelleHighlighted('mitochondria') ? '#facc15' : '#c2410c'}
                          strokeWidth={isOrganelleHighlighted('mitochondria') ? 3 : 1.5}
                          filter={isOrganelleHighlighted('mitochondria') ? 'url(#activeGlow)' : undefined}
                        />
                        <path
                          d="M -12 -5 L -8 0 L -12 5 M -4 -6 L 0 0 L -4 6 M 4 -6 L 8 0 L 4 6 M 12 -5 L 14 0 L 12 5"
                          stroke="#fef08a"
                          strokeWidth="1.2"
                          fill="none"
                        />
                      </g>

                      {/* Mitochondrion 2 */}
                      <g transform="translate(415, 120) rotate(45)">
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="18"
                          ry="9"
                          fill="url(#mitoGrad)"
                          stroke={isOrganelleHighlighted('mitochondria') ? '#facc15' : '#c2410c'}
                          strokeWidth={isOrganelleHighlighted('mitochondria') ? 3 : 1.5}
                        />
                        <path
                          d="M -10 -4 L -6 0 L -10 4 M -3 -5 L 0 0 L -3 5 M 4 -5 L 7 0 L 4 5"
                          stroke="#fef08a"
                          strokeWidth="1.2"
                          fill="none"
                        />
                      </g>

                      {/* Mitochondrion 3 */}
                      <g transform="translate(85, 205) rotate(70)">
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="17"
                          ry="9"
                          fill="url(#mitoGrad)"
                          stroke={isOrganelleHighlighted('mitochondria') ? '#facc15' : '#c2410c'}
                          strokeWidth={isOrganelleHighlighted('mitochondria') ? 3 : 1.5}
                        />
                        <path
                          d="M -10 -4 L -6 0 L -10 4 M -3 -5 L 0 0 L -3 5 M 4 -5 L 7 0 L 4 5"
                          stroke="#fef08a"
                          strokeWidth="1.2"
                          fill="none"
                        />
                      </g>
                    </g>

                    {/* 8. Labels & Leader Pins (Toggleable) */}
                    {showLabels && (
                      <g className="pointer-events-none text-[10px] font-bold">
                        {/* Cell Wall Label */}
                        <line x1="32" y1="24" x2="20" y2="15" stroke="#22c55e" strokeWidth="1" />
                        <rect x="10" y="4" width="70" height="18" rx="4" fill="#0f172a" stroke="#22c55e" strokeWidth="1" opacity="0.9" />
                        <text x="45" y="16" fill="#86efac" textAnchor="middle">Cell Wall</text>

                        {/* Large Central Vacuole Label */}
                        <line x1="280" y1="220" x2="280" y2="255" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
                        <rect x="235" y="255" width="90" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
                        <text x="280" y="267" fill="#7dd3fc" textAnchor="middle">Central Vacuole</text>

                        {/* Chloroplast Label */}
                        <line x1="320" y1="68" x2="330" y2="35" stroke="#16a34a" strokeWidth="1" />
                        <rect x="290" y="20" width="80" height="18" rx="4" fill="#0f172a" stroke="#16a34a" strokeWidth="1" opacity="0.9" />
                        <text x="330" y="32" fill="#4ade80" textAnchor="middle">Chloroplast</text>

                        {/* Nucleus Label */}
                        <line x1="105" y1="110" x2="105" y2="60" stroke="#818cf8" strokeWidth="1" />
                        <rect x="75" y="45" width="60" height="18" rx="4" fill="#0f172a" stroke="#818cf8" strokeWidth="1" opacity="0.9" />
                        <text x="105" y="57" fill="#c7d2fe" textAnchor="middle">Nucleus</text>

                        {/* Mitochondria Label */}
                        <line x1="415" y1="120" x2="445" y2="100" stroke="#f97316" strokeWidth="1" />
                        <rect x="405" y="85" width="82" height="18" rx="4" fill="#0f172a" stroke="#f97316" strokeWidth="1" opacity="0.9" />
                        <text x="446" y="97" fill="#fed7aa" textAnchor="middle">Mitochondria</text>
                      </g>
                    )}
                  </svg>
                </div>

                {/* Plant Cell Interactive Turgor Pressure Controller */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-sky-400" />
                    <span className="font-semibold text-slate-300">Vacuole Water State:</span>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setTurgorState('flaccid')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        turgorState === 'flaccid'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Flaccid
                    </button>
                    <button
                      onClick={() => setTurgorState('normal')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        turgorState === 'normal'
                          ? 'bg-sky-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => setTurgorState('turgid')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        turgorState === 'turgid'
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Turgid (Support)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* ANIMAL CELL SVG CARD */}
            {/* ------------------------------------------------------------- */}
            {(mode === 'side-by-side' || mode === 'animal') && (
              <div
                className={`bg-slate-900/90 border rounded-3xl p-5 shadow-xl flex flex-col transition-all duration-300 ${
                  mode === 'animal'
                    ? 'border-rose-500/50 shadow-rose-950/30 ring-1 ring-rose-500/30'
                    : 'border-slate-800 hover:border-rose-500/40'
                }`}
              >
                {/* Header of Animal Cell */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <PawPrint className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-white tracking-wide">
                        ANIMAL CELL (Heterotrophic)
                      </h3>
                      <p className="text-[11px] text-rose-400 font-medium">
                        Flexible irregular shape · No cell wall · Centrioles present
                      </p>
                    </div>
                  </div>

                  {mode === 'animal' && (
                    <div className="flex items-center gap-1 text-[11px] bg-rose-950/60 text-rose-300 px-2.5 py-1 rounded-lg border border-rose-700/40">
                      <Maximize2 className="w-3 h-3" /> Focus View
                    </div>
                  )}
                </div>

                {/* SVG Illustration Container */}
                <div className="relative w-full aspect-[500/420] bg-slate-950/80 rounded-2xl overflow-hidden border border-slate-800/80 flex items-center justify-center p-2">
                  <svg
                    viewBox="0 0 500 420"
                    className="w-full h-full select-none"
                    style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}
                  >
                    <defs>
                      <radialGradient id="animalCytoGrad" cx="50%" cy="50%" r="55%">
                        <stop offset="0%" stopColor="#2e1065" stopOpacity="0.85" />
                        <stop offset="60%" stopColor="#1e1b4b" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                      </radialGradient>

                      <radialGradient id="animalNucleusGrad" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#c7d2fe" />
                        <stop offset="45%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#312e81" />
                      </radialGradient>

                      <linearGradient id="animalMembraneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fb7185" />
                        <stop offset="50%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#e11d48" />
                      </linearGradient>

                      <style>{`
                        @keyframes animalFluidShift {
                          0%, 100% { transform: scale(1); }
                          50% { transform: scale(1.012) skewX(0.5deg); }
                        }
                        .animal-membrane-pulse {
                          transform-origin: 250px 210px;
                          animation: animalFluidShift ${isLivingAnimated ? '6s' : '0s'} ease-in-out infinite;
                        }
                      `}</style>
                    </defs>

                    {/* 1. Flexible Amoeboid Cell Membrane (No rigid cell wall) */}
                    <g
                      onClick={() => handleSelectOrganelle('cell_membrane')}
                      className="cursor-pointer group animal-membrane-pulse"
                    >
                      <path
                        d="M 250 38 C 370 34, 460 95, 465 210 C 470 325, 395 385, 260 388 C 125 391, 40 330, 38 215 C 36 100, 130 42, 250 38 Z"
                        fill="url(#animalCytoGrad)"
                        stroke={
                          isOrganelleHighlighted('cell_membrane') ? '#38bdf8' : 'url(#animalMembraneGrad)'
                        }
                        strokeWidth={isOrganelleHighlighted('cell_membrane') ? 5 : 3.5}
                        filter={isOrganelleHighlighted('cell_membrane') ? 'url(#activeGlow)' : undefined}
                        className="transition-all duration-300"
                      />

                      {/* Fluid Mosaic Membrane highlights */}
                      <path
                        d="M 245 42 C 360 38, 450 98, 455 208 C 460 318, 388 378, 258 382 C 128 385, 48 322, 45 212 C 42 105, 132 46, 245 42 Z"
                        fill="none"
                        stroke="#fda4af"
                        strokeWidth="1"
                        strokeDasharray="6,4"
                        opacity="0.4"
                      />
                    </g>

                    {/* Absent Indicator if Cell Wall or Chloroplast is selected */}
                    {(selectedOrganelleId === 'cell_wall' || selectedOrganelleId === 'chloroplast') && (
                      <g className="pointer-events-none">
                        <rect
                          x="100"
                          y="180"
                          width="300"
                          height="60"
                          rx="16"
                          fill="#0f172a"
                          stroke="#e11d48"
                          strokeWidth="2"
                          opacity="0.92"
                        />
                        <text x="250" y="205" fill="#fda4af" textAnchor="middle" className="text-xs font-bold">
                          {selectedOrganelleId === 'cell_wall'
                            ? '❌ CELL WALL ABSENT'
                            : '❌ CHLOROPLASTS ABSENT'}
                        </text>
                        <text x="250" y="224" fill="#94a3b8" textAnchor="middle" className="text-[10px]">
                          {selectedOrganelleId === 'cell_wall'
                            ? 'Allows flexibility, movement & variable shapes'
                            : 'Heterotrophic: feeds on pre-formed organic matter'}
                        </text>
                      </g>
                    )}

                    {/* 2. Centrally Located Nucleus with Prominent Nucleolus */}
                    <g
                      onClick={() => handleSelectOrganelle('nucleus')}
                      className="cursor-pointer group"
                    >
                      <circle
                        cx="245"
                        cy="210"
                        r="52"
                        fill="url(#animalNucleusGrad)"
                        stroke={
                          isOrganelleHighlighted('nucleus') ? '#f59e0b' : '#818cf8'
                        }
                        strokeWidth={isOrganelleHighlighted('nucleus') ? 4 : 2.5}
                        filter={isOrganelleHighlighted('nucleus') ? 'url(#activeGlow)' : undefined}
                        className="transition-all duration-300"
                      />

                      <circle
                        cx="245"
                        cy="210"
                        r="48"
                        fill="none"
                        stroke="#e0e7ff"
                        strokeWidth="1.2"
                        strokeDasharray="5,4"
                        opacity="0.6"
                      />

                      <circle cx="238" cy="204" r="18" fill="#1e1b4b" stroke="#4338ca" strokeWidth="1.5" />

                      <path
                        d="M 220 230 Q 235 220 255 235 Q 270 240 275 220 M 215 190 Q 230 180 260 185"
                        stroke="#c7d2fe"
                        strokeWidth="1.2"
                        fill="none"
                        opacity="0.5"
                      />
                    </g>

                    {/* 3. Centrioles / Centrosome (Animal Specific) */}
                    <g
                      onClick={() => handleSelectOrganelle('centrioles')}
                      className="cursor-pointer group"
                    >
                      <circle
                        cx="325"
                        cy="155"
                        r="22"
                        fill="#ec4899"
                        opacity={isOrganelleHighlighted('centrioles') ? 0.35 : 0.15}
                        filter={isOrganelleHighlighted('centrioles') ? 'url(#activeGlow)' : undefined}
                      />

                      {/* Barrel 1 (Horizontal) */}
                      <rect
                        x="315"
                        y="146"
                        width="20"
                        height="11"
                        rx="3"
                        fill="#f472b6"
                        stroke={isOrganelleHighlighted('centrioles') ? '#facc15' : '#db2777'}
                        strokeWidth={isOrganelleHighlighted('centrioles') ? 2.5 : 1.5}
                      />
                      <line x1="320" y1="146" x2="320" y2="157" stroke="#831843" strokeWidth="1" />
                      <line x1="325" y1="146" x2="325" y2="157" stroke="#831843" strokeWidth="1" />
                      <line x1="330" y1="146" x2="330" y2="157" stroke="#831843" strokeWidth="1" />

                      {/* Barrel 2 (Perpendicular Vertical) */}
                      <rect
                        x="328"
                        y="136"
                        width="11"
                        height="20"
                        rx="3"
                        fill="#ec4899"
                        stroke={isOrganelleHighlighted('centrioles') ? '#facc15' : '#be185d'}
                        strokeWidth={isOrganelleHighlighted('centrioles') ? 2.5 : 1.5}
                      />
                      <line x1="328" y1="142" x2="339" y2="142" stroke="#831843" strokeWidth="1" />
                      <line x1="328" y1="147" x2="339" y2="147" stroke="#831843" strokeWidth="1" />
                      <line x1="328" y1="152" x2="339" y2="152" stroke="#831843" strokeWidth="1" />
                    </g>

                    {/* 4. Mitochondria (Abundant powerhouses for aerobic motility & ATP) */}
                    <g
                      onClick={() => handleSelectOrganelle('mitochondria')}
                      className="cursor-pointer group mito-glow"
                    >
                      {/* Mitochondrion 1 (Upper Left) */}
                      <g transform="translate(135, 120) rotate(-40)">
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="24"
                          ry="12"
                          fill="url(#mitoGrad)"
                          stroke={isOrganelleHighlighted('mitochondria') ? '#facc15' : '#ea580c'}
                          strokeWidth={isOrganelleHighlighted('mitochondria') ? 3 : 1.5}
                          filter={isOrganelleHighlighted('mitochondria') ? 'url(#activeGlow)' : undefined}
                        />
                        <path
                          d="M -16 -6 L -10 0 L -16 6 M -6 -8 L 0 0 L -6 8 M 5 -8 L 10 0 L 5 8 M 15 -5 L 18 0 L 15 5"
                          stroke="#fef08a"
                          strokeWidth="1.2"
                          fill="none"
                        />
                      </g>

                      {/* Mitochondrion 2 (Upper Right) */}
                      <g transform="translate(370, 115) rotate(35)">
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="22"
                          ry="11"
                          fill="url(#mitoGrad)"
                          stroke={isOrganelleHighlighted('mitochondria') ? '#facc15' : '#ea580c'}
                          strokeWidth={isOrganelleHighlighted('mitochondria') ? 3 : 1.5}
                        />
                        <path
                          d="M -14 -5 L -8 0 L -14 5 M -4 -7 L 0 0 L -4 7 M 6 -7 L 10 0 L 6 7"
                          stroke="#fef08a"
                          strokeWidth="1.2"
                          fill="none"
                        />
                      </g>

                      {/* Mitochondrion 3 (Lower Right) */}
                      <g transform="translate(380, 275) rotate(-25)">
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="23"
                          ry="12"
                          fill="url(#mitoGrad)"
                          stroke={isOrganelleHighlighted('mitochondria') ? '#facc15' : '#ea580c'}
                          strokeWidth={isOrganelleHighlighted('mitochondria') ? 3 : 1.5}
                        />
                        <path
                          d="M -15 -5 L -9 0 L -15 5 M -4 -7 L 1 0 L -4 7 M 6 -7 L 11 0 L 6 7"
                          stroke="#fef08a"
                          strokeWidth="1.2"
                          fill="none"
                        />
                      </g>

                      {/* Mitochondrion 4 (Lower Left) */}
                      <g transform="translate(130, 290) rotate(45)">
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="21"
                          ry="11"
                          fill="url(#mitoGrad)"
                          stroke={isOrganelleHighlighted('mitochondria') ? '#facc15' : '#ea580c'}
                          strokeWidth={isOrganelleHighlighted('mitochondria') ? 3 : 1.5}
                        />
                        <path
                          d="M -13 -5 L -7 0 L -13 5 M -3 -6 L 1 0 L -3 6 M 6 -6 L 10 0 L 6 6"
                          stroke="#fef08a"
                          strokeWidth="1.2"
                          fill="none"
                        />
                      </g>
                    </g>

                    {/* 5. Small Temporary Vacuoles / Vesicles */}
                    <g
                      onClick={() => handleSelectOrganelle('vacuole')}
                      className="cursor-pointer group"
                    >
                      <circle
                        cx="175"
                        cy="80"
                        r="12"
                        fill="#38bdf8"
                        opacity={isOrganelleHighlighted('vacuole') ? 0.6 : 0.3}
                        stroke={isOrganelleHighlighted('vacuole') ? '#facc15' : '#0284c7'}
                        strokeWidth={isOrganelleHighlighted('vacuole') ? 2.5 : 1.5}
                        filter={isOrganelleHighlighted('vacuole') ? 'url(#activeGlow)' : undefined}
                      />
                      <circle
                        cx="330"
                        cy="330"
                        r="14"
                        fill="#38bdf8"
                        opacity={isOrganelleHighlighted('vacuole') ? 0.6 : 0.3}
                        stroke={isOrganelleHighlighted('vacuole') ? '#facc15' : '#0284c7'}
                        strokeWidth={isOrganelleHighlighted('vacuole') ? 2.5 : 1.5}
                      />
                      <circle
                        cx="210"
                        cy="330"
                        r="10"
                        fill="#38bdf8"
                        opacity={isOrganelleHighlighted('vacuole') ? 0.6 : 0.3}
                        stroke={isOrganelleHighlighted('vacuole') ? '#facc15' : '#0284c7'}
                        strokeWidth={isOrganelleHighlighted('vacuole') ? 2.5 : 1.5}
                      />
                    </g>

                    {/* 6. Lysosomes (Hydrolytic Enzymes) */}
                    <g className="cursor-default">
                      <circle cx="165" cy="205" r="10" fill="#e11d48" stroke="#9f1239" strokeWidth="1.5" />
                      <circle cx="335" cy="235" r="9" fill="#e11d48" stroke="#9f1239" strokeWidth="1.5" />
                    </g>

                    {/* 7. Golgi Apparatus & Endoplasmic Reticulum folds */}
                    <g stroke="#a855f7" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.65">
                      <path d="M 175 145 Q 185 160 178 175" />
                      <path d="M 183 143 Q 194 160 186 177" />
                      <path d="M 191 142 Q 203 160 195 178" />
                    </g>

                    {/* 8. Labels & Leader Pins (Toggleable) */}
                    {showLabels && (
                      <g className="pointer-events-none text-[10px] font-bold">
                        <line x1="120" y1="45" x2="80" y2="25" stroke="#fb7185" strokeWidth="1" />
                        <rect x="25" y="14" width="115" height="18" rx="4" fill="#0f172a" stroke="#fb7185" strokeWidth="1" opacity="0.9" />
                        <text x="82" y="26" fill="#fda4af" textAnchor="middle">Flexible Membrane</text>

                        <line x1="335" y1="150" x2="390" y2="170" stroke="#ec4899" strokeWidth="1" />
                        <rect x="360" y="170" width="80" height="18" rx="4" fill="#0f172a" stroke="#ec4899" strokeWidth="1" opacity="0.9" />
                        <text x="400" y="182" fill="#f472b6" textAnchor="middle">Centrioles</text>

                        <line x1="245" y1="210" x2="245" y2="280" stroke="#818cf8" strokeWidth="1" strokeDasharray="2,2" />
                        <rect x="205" y="280" width="80" height="18" rx="4" fill="#0f172a" stroke="#818cf8" strokeWidth="1" opacity="0.9" />
                        <text x="245" y="292" fill="#c7d2fe" textAnchor="middle">Central Nucleus</text>

                        <line x1="380" y1="275" x2="415" y2="305" stroke="#f97316" strokeWidth="1" />
                        <rect x="380" y="305" width="84" height="18" rx="4" fill="#0f172a" stroke="#f97316" strokeWidth="1" opacity="0.9" />
                        <text x="422" y="317" fill="#fed7aa" textAnchor="middle">Mitochondria</text>

                        <line x1="175" y1="80" x2="175" y2="50" stroke="#38bdf8" strokeWidth="1" />
                        <rect x="130" y="38" width="90" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
                        <text x="175" y="50" fill="#7dd3fc" textAnchor="middle">Small Vacuoles</text>
                      </g>
                    )}
                  </svg>
                </div>

                {/* Animal Cell Functional Footer Note */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-rose-300 font-medium">
                    <Activity className="w-3.5 h-3.5" />
                    High metabolic flexibility & motility
                  </span>
                  <span className="text-[11px] bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-400">
                    Centrioles & Lysosomes active
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* COMPREHENSIVE GRADE 10 COMPARISON MATRIX TABLE */}
          {/* =============================================================== */}
          <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Syllabus Comparison Matrix (Grade 10 Reference)
              </h3>
              <span className="text-[11px] text-slate-400">Click any row to inspect organelle</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2.5 font-bold uppercase tracking-wider">Structural Feature</th>
                    <th className="pb-2.5 font-bold uppercase tracking-wider text-green-400">
                      Plant Cell
                    </th>
                    <th className="pb-2.5 font-bold uppercase tracking-wider text-rose-400">
                      Animal Cell
                    </th>
                    <th className="pb-2.5 font-bold uppercase tracking-wider text-indigo-300">
                      Biological Significance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {[
                    {
                      id: 'cell_wall',
                      feature: 'Cell Wall',
                      plant: 'Present (rigid cellulose)',
                      animal: 'Absent',
                      sig: 'Maintains fixed shape, withstands turgor pressure preventing lysis.'
                    },
                    {
                      id: 'chloroplast',
                      feature: 'Chloroplasts',
                      plant: 'Present (photosynthesis)',
                      animal: 'Absent',
                      sig: 'Autotrophic food production; traps sunlight energy via chlorophyll.'
                    },
                    {
                      id: 'vacuole',
                      feature: 'Vacuole',
                      plant: 'Single large permanent central vacuole',
                      animal: 'Small temporary scattered vacuoles',
                      sig: 'Maintains turgor support in plants; transport/waste in animals.'
                    },
                    {
                      id: 'centrioles',
                      feature: 'Centrioles',
                      plant: 'Absent (in higher plants)',
                      animal: 'Present (paired near nucleus)',
                      sig: 'Forms spindle fibers for animal chromosome segregation.'
                    },
                    {
                      id: 'cell_membrane',
                      feature: 'Cell Membrane',
                      plant: 'Present (inside cell wall)',
                      animal: 'Present (outer boundary)',
                      sig: 'Selectively permeable barrier controlling transport.'
                    },
                    {
                      id: 'nucleus',
                      feature: 'Nucleus Position',
                      plant: 'Peripheral (pushed to edge)',
                      animal: 'Central position',
                      sig: 'Pushed aside by large plant vacuole; stores genetic DNA.'
                    }
                  ].map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => handleSelectOrganelle(row.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedOrganelleId === row.id
                          ? 'bg-indigo-950/40 text-white font-semibold'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 font-bold flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: ORGANELLES[row.id]?.color || '#64748b' }}
                        />
                        {row.feature}
                      </td>
                      <td className="py-2.5 text-green-300">{row.plant}</td>
                      <td className="py-2.5 text-rose-300">{row.animal}</td>
                      <td className="py-2.5 text-slate-400">{row.sig}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* =============================================================== */}
        {/* Right Column: In-Depth Inspector, Quiz, & Syllabus Mastery */}
        {/* =============================================================== */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Organelle Inspector Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400" />
                Organelle Detailed Inspector
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 uppercase font-mono">
                {currentOrganelle.id}
              </span>
            </div>

            {/* Quick Organelle Selector Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {Object.values(ORGANELLES).map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleSelectOrganelle(org.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedOrganelleId === org.id
                      ? `${org.accentBg} ${org.accentText} border ${org.accentBorder} font-bold`
                      : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {org.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Detailed Inspector Information */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  Structure & Composition:
                </span>
                <p className="text-slate-300">{currentOrganelle.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                  Primary Biological Function:
                </span>
                <p className="text-slate-300">{currentOrganelle.primaryFunction}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] font-bold text-amber-400 block mb-1">
                  Microscopic Identification & Staining:
                </span>
                <p className="text-slate-300">{currentOrganelle.stainingNote}</p>
              </div>
            </div>
          </div>

          {/* Grade 10 Quick-Check Assessment Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Grade 10 Quick Check Quiz
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {Object.keys(quizAnswers).length} / {QUICK_CHECK_QUIZ.length} Answered
              </span>
            </div>

            <div className="space-y-4">
              {QUICK_CHECK_QUIZ.map((q, idx) => {
                const selected = quizAnswers[q.id];
                const isCorrect = selected === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/90 text-xs flex flex-col gap-2.5"
                  >
                    <p className="font-bold text-slate-200">
                      {idx + 1}. {q.question}
                    </p>

                    <div className="grid grid-cols-1 gap-1.5">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleQuizOptionSelect(q.id, optIdx)}
                          className={`text-left px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            selected === optIdx
                              ? showQuizResults
                                ? isCorrect
                                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                                  : 'bg-rose-950/60 border-rose-500 text-rose-300 font-bold'
                                : 'bg-indigo-950/60 border-indigo-500 text-indigo-200 font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {showQuizResults && selected === optIdx && (
                            <span>
                              {isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-400" />
                              )}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {showQuizResults && (
                      <p
                        className={`text-[11px] p-2 rounded-lg leading-relaxed ${
                          isCorrect
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                        }`}
                      >
                        <strong>{isCorrect ? 'Correct!' : 'Notice:'}</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Quiz Check Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowQuizResults(true)}
                disabled={Object.keys(quizAnswers).length === 0}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                Check My Answers
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
