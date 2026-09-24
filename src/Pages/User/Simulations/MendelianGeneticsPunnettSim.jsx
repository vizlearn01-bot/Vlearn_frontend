import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Sparkles,
  HelpCircle,
  BookOpen,
  Award,
  Layers,
  Search,
  Zap,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Split,
  Grid3X3,
  Dna,
  Shuffle,
  Info,
} from 'lucide-react';

// ============================================================================
// TRAIT DEFINITIONS & MENDELIAN INHERITANCE CONSTANTS (KCSE Form 4 Syllabus)
// ============================================================================

// Monohybrid Traits: Stem Height (T = Tall, t = Dwarf)
const MONOHYBRID_TRAITS = {
  height: {
    name: 'Plant Height (Pisum sativum)',
    dominantSymbol: 'T',
    recessiveSymbol: 't',
    dominantName: 'Tall',
    recessiveName: 'Dwarf (Short)',
    dominantDesc: 'Tall phenotype (produces gibberellin hormone)',
    recessiveDesc: 'Dwarf phenotype (gibberellin synthesis deficient)',
  },
  flowerColor: {
    name: 'Flower Colour',
    dominantSymbol: 'P',
    recessiveSymbol: 'p',
    dominantName: 'Purple',
    recessiveName: 'White',
    dominantDesc: 'Purple petals (anthocyanin pigment present)',
    recessiveDesc: 'White petals (anthocyanin absent)',
  },
  podShape: {
    name: 'Pod Shape',
    dominantSymbol: 'I',
    recessiveSymbol: 'i',
    dominantName: 'Inflated',
    recessiveName: 'Constricted',
    dominantDesc: 'Smooth, full pod contour',
    recessiveDesc: 'Pinched around seeds',
  },
};

// Dihybrid Traits: Seed Shape (R/r) and Seed Colour (Y/y)
const DIHYBRID_CONFIG = {
  gene1: {
    name: 'Seed Shape',
    dominant: { symbol: 'R', name: 'Round', color: '#10B981' },
    recessive: { symbol: 'r', name: 'Wrinkled', color: '#F59E0B' },
  },
  gene2: {
    name: 'Cotyledon / Seed Colour',
    dominant: { symbol: 'Y', name: 'Yellow', color: '#EAB308' },
    recessive: { symbol: 'y', name: 'Green', color: '#22C55E' },
  },
};

// KCSE Examination Calculation Challenges
const KCSE_MENDEL_CHALLENGES = [
  {
    id: 'kcse_mendel_1',
    title: 'KCSE Challenge 1: F2 Phenotypic & Genotypic Ratio',
    scenario: 'A pure-breeding tall pea plant (TT) is crossed with a pure-breeding dwarf pea plant (tt). The resulting F1 heterozygous plants (Tt) are self-pollinated to produce the F2 generation.',
    question: 'What are the expected F2 phenotypic ratio and genotypic ratio respectively?',
    options: [
      'Phenotypic ratio 3 Tall : 1 Dwarf; Genotypic ratio 1 TT : 2 Tt : 1 tt',
      'Phenotypic ratio 1 Tall : 1 Dwarf; Genotypic ratio 1 TT : 1 tt',
      'Phenotypic ratio 9 Tall : 3 Dwarf; Genotypic ratio 3 TT : 1 tt',
      'Phenotypic ratio 2 Tall : 2 Dwarf; Genotypic ratio 1 TT : 2 Tt',
    ],
    correctIdx: 0,
    explanation: 'In Mendelian monohybrid inheritance with complete dominance: Crossing Tt × Tt yields 1/4 TT (Tall), 2/4 Tt (Tall), and 1/4 tt (Dwarf). The phenotypic ratio is 3 Tall : 1 Dwarf, and the genotypic ratio is 1 TT : 2 Tt : 1 tt.',
    syllRef: 'KCSE Biology Paper 2 · Section B (Mendelian Genetics)',
  },
  {
    id: 'kcse_mendel_2',
    title: 'KCSE Challenge 2: Test Cross / Back Cross Diagnostic',
    scenario: 'A botanist is presented with a tall pea plant with an unknown genotype (either homozygous dominant TT or heterozygous Tt).',
    question: 'What type of cross should the botanist perform to determine the exact genotype, and what outcome confirms the plant is heterozygous (Tt)?',
    options: [
      'Test cross with a homozygous recessive dwarf plant (tt); a 1:1 phenotypic ratio (50% Tall, 50% Dwarf) confirms heterozygosity',
      'Cross with a pure-breeding tall plant (TT); all tall offspring confirm heterozygosity',
      'Self-pollinate; if all offspring are dwarf, it is heterozygous',
      'Cross with another unknown tall plant; a 3:1 ratio confirms it was homozygous',
    ],
    correctIdx: 0,
    explanation: 'A test cross involves mating an individual of dominant phenotype with a homozygous recessive organism (tt). If the unknown parent is TT, 100% of progeny are tall (Tt). If the parent is heterozygous (Tt), segregation produces 50% Tall (Tt) and 50% Dwarf (tt) in a 1:1 ratio.',
    syllRef: 'KCSE Biology Paper 1 · Genetics Definitions',
  },
  {
    id: 'kcse_mendel_3',
    title: 'KCSE Challenge 3: Dihybrid F2 Independent Assortment',
    scenario: 'In pea plants, round seed shape (R) is dominant over wrinkled (r), and yellow seed color (Y) is dominant over green (y). Two double heterozygotes (RrYy) are crossed (RrYy × RrYy).',
    question: 'In a total harvest of 1,600 F2 seeds, approximately how many seeds are expected to be wrinkled and green (rryy)?',
    options: [
      '100 seeds (1/16 of 1,600)',
      '300 seeds (3/16 of 1,600)',
      '900 seeds (9/16 of 1,600)',
      '400 seeds (1/4 of 1,600)',
    ],
    correctIdx: 0,
    explanation: 'According to Mendel’s Second Law (Law of Independent Assortment), the F2 phenotypic ratio of a dihybrid cross is 9 Round Yellow : 3 Round Green : 3 Wrinkled Yellow : 1 Wrinkled Green. The proportion of double recessive (rryy) is 1/16. In 1,600 seeds: (1/16) × 1600 = 100 seeds.',
    syllRef: 'KCSE Biology Paper 2 · Dihybrid Cross Calculation',
  },
  {
    id: 'kcse_mendel_4',
    title: 'KCSE Challenge 4: Mendel\'s First Law of Segregation',
    scenario: 'A student investigates gamete formation during meiosis in an organism with genotype Tt.',
    question: 'Which biological mechanism accounts for Mendel\'s First Law (Law of Segregation)?',
    options: [
      'Homologous chromosomes and their alternate alleles separate during Anaphase I of meiosis, so each gamete carries only one allele for each gene',
      'Sister chromatids duplicate during S-phase to form identical diploid gametes',
      'Non-homologous chromosomes fuse together during metaphase II',
      'Alleles blend together into an intermediate phenotype before fertilization',
    ],
    correctIdx: 0,
    explanation: 'Mendel\'s First Law (Law of Segregation) states that the characteristics of an organism are controlled by pairs of alleles which separate during gamete formation (meiosis Anaphase I), with only one allele passing into each gamete.',
    syllRef: 'KCSE Biology Form 4 · Meiosis & Inheritance',
  },
];

export default function MendelianGeneticsPunnettSim({ config = {}, onTelemetry }) {
  // Mode selection:
  // 'monohybrid' = 4-Square Punnett Grid (TT x tt, Tt x Tt, etc.)
  // 'dihybrid' = 16-Square Punnett Grid (Seed shape & color)
  // 'testcross' = Unknown parent test cross solver
  // 'kcse_quiz' = KCSE genetics challenges
  const [activeTab, setActiveTab] = useState('monohybrid');

  // MONOHYBRID STATE
  const [selectedTraitKey, setSelectedTraitKey] = useState('height');
  const [parent1Mono, setParent1Mono] = useState('Tt'); // 'TT' | 'Tt' | 'tt'
  const [parent2Mono, setParent2Mono] = useState('Tt'); // 'TT' | 'Tt' | 'tt'

  // DIHYBRID STATE
  const [parent1Dihybrid, setParent1Dihybrid] = useState('RrYy');
  const [parent2Dihybrid, setParent2Dihybrid] = useState('RrYy');

  // TEST CROSS STATE
  const [testCrossMystery, setTestCrossMystery] = useState('Tt'); // Unknown parent: 'TT' or 'Tt'
  const [isMysteryRevealed, setIsMysteryRevealed] = useState(false);
  const [simulatedOffspringCount, setSimulatedOffspringCount] = useState(200);

  // KCSE QUIZ STATE
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [telemetrySent, setTelemetrySent] = useState(false);

  const activeTrait = MONOHYBRID_TRAITS[selectedTraitKey];

  // --------------------------------------------------------------------------
  // MONOHYBRID CALCULATIONS (4-Square Grid)
  // --------------------------------------------------------------------------
  const monoGametes1 = useMemo(() => parent1Mono.split(''), [parent1Mono]);
  const monoGametes2 = useMemo(() => parent2Mono.split(''), [parent2Mono]);

  const monoPunnettGrid = useMemo(() => {
    // 2x2 grid = 4 cells
    const cells = [];
    monoGametes1.forEach((g1) => {
      monoGametes2.forEach((g2) => {
        // Sort uppercase first (e.g., 'tT' -> 'Tt')
        let genotype = [g1, g2].sort().join('');
        if (g1 === activeTrait.dominantSymbol || g2 === activeTrait.dominantSymbol) {
          genotype = `${activeTrait.dominantSymbol}${activeTrait.recessiveSymbol}`;
          if (g1 === activeTrait.dominantSymbol && g2 === activeTrait.dominantSymbol) {
            genotype = `${activeTrait.dominantSymbol}${activeTrait.dominantSymbol}`;
          }
        }
        const isDominant = genotype.includes(activeTrait.dominantSymbol);
        cells.push({
          rowGamete: g1,
          colGamete: g2,
          genotype,
          phenotype: isDominant ? activeTrait.dominantName : activeTrait.recessiveName,
          isDominant,
        });
      });
    });
    return cells;
  }, [monoGametes1, monoGametes2, activeTrait]);

  const monoRatios = useMemo(() => {
    const counts = { TT: 0, Tt: 0, tt: 0 };
    const D = activeTrait.dominantSymbol;
    const r = activeTrait.recessiveSymbol;
    const domHom = `${D}${D}`;
    const het = `${D}${r}`;
    const recHom = `${r}${r}`;

    counts[domHom] = 0;
    counts[het] = 0;
    counts[recHom] = 0;

    let dominantCount = 0;
    let recessiveCount = 0;

    monoPunnettGrid.forEach((cell) => {
      if (cell.genotype === domHom) counts[domHom]++;
      else if (cell.genotype === het) counts[het]++;
      else counts[recHom]++;

      if (cell.isDominant) dominantCount++;
      else recessiveCount++;
    });

    return {
      genotypes: counts,
      dominantCount,
      recessiveCount,
      phenotypicRatio: `${dominantCount} ${activeTrait.dominantName} : ${recessiveCount} ${activeTrait.recessiveName}`,
      genotypicRatio: `${counts[domHom]} ${domHom} : ${counts[het]} ${het} : ${counts[recHom]} ${recHom}`,
    };
  }, [monoPunnettGrid, activeTrait]);

  // --------------------------------------------------------------------------
  // DIHYBRID CALCULATIONS (16-Square Grid)
  // --------------------------------------------------------------------------
  const getDihybridGametes = (genotype) => {
    // genotype e.g. 'RrYy' -> gametes 'RY', 'Ry', 'rY', 'ry'
    const alleles1 = [genotype[0], genotype[1]];
    const alleles2 = [genotype[2], genotype[3]];
    const gametes = [];
    alleles1.forEach((a1) => {
      alleles2.forEach((a2) => {
        gametes.push(`${a1}${a2}`);
      });
    });
    return gametes;
  };

  const dihybridGametes1 = useMemo(() => getDihybridGametes(parent1Dihybrid), [parent1Dihybrid]);
  const dihybridGametes2 = useMemo(() => getDihybridGametes(parent2Dihybrid), [parent2Dihybrid]);

  const dihybridPunnettGrid = useMemo(() => {
    // 4x4 grid = 16 cells
    const cells = [];
    dihybridGametes1.forEach((g1) => {
      dihybridGametes2.forEach((g2) => {
        // Gene 1: g1[0] + g2[0], Gene 2: g1[1] + g2[1]
        const gene1Alleles = [g1[0], g2[0]].sort().join('');
        const g1Pair = gene1Alleles.includes('R') && gene1Alleles.includes('r') ? 'Rr' : gene1Alleles;
        const gene2Alleles = [g1[1], g2[1]].sort().join('');
        const g2Pair = gene2Alleles.includes('Y') && gene2Alleles.includes('y') ? 'Yy' : gene2Alleles;

        const fullGenotype = `${g1Pair}${g2Pair}`;
        const isRound = fullGenotype.includes('R');
        const isYellow = fullGenotype.includes('Y');

        let phenotype = '';
        if (isRound && isYellow) phenotype = 'Round Yellow';
        else if (isRound && !isYellow) phenotype = 'Round Green';
        else if (!isRound && isYellow) phenotype = 'Wrinkled Yellow';
        else phenotype = 'Wrinkled Green';

        cells.push({
          rowGamete: g1,
          colGamete: g2,
          genotype: fullGenotype,
          phenotype,
          isRound,
          isYellow,
        });
      });
    });
    return cells;
  }, [dihybridGametes1, dihybridGametes2]);

  const dihybridRatios = useMemo(() => {
    let ry = 0; // Round Yellow
    let rg = 0; // Round Green
    let wy = 0; // Wrinkled Yellow
    let wg = 0; // Wrinkled Green

    dihybridPunnettGrid.forEach((c) => {
      if (c.phenotype === 'Round Yellow') ry++;
      else if (c.phenotype === 'Round Green') rg++;
      else if (c.phenotype === 'Wrinkled Yellow') wy++;
      else wg++;
    });

    return {
      roundYellow: ry,
      roundGreen: rg,
      wrinkledYellow: wy,
      wrinkledGreen: wg,
      ratioStr: `${ry} Round Yellow : ${rg} Round Green : ${wy} Wrinkled Yellow : ${wg} Wrinkled Green`,
    };
  }, [dihybridPunnettGrid]);

  // --------------------------------------------------------------------------
  // TEST CROSS SIMULATION
  // --------------------------------------------------------------------------
  const testCrossOutcome = useMemo(() => {
    // Mystery parent (TT or Tt) crossed with Homozygous Recessive (tt)
    const isHet = testCrossMystery === 'Tt';
    // If TT x tt -> 100% Tt (Tall)
    // If Tt x tt -> 50% Tt (Tall), 50% tt (Dwarf)
    const tallPercent = isHet ? 50 : 100;
    const dwarfPercent = isHet ? 50 : 0;
    const tallCount = Math.round((tallPercent / 100) * simulatedOffspringCount);
    const dwarfCount = simulatedOffspringCount - tallCount;

    return {
      isHet,
      tallPercent,
      dwarfPercent,
      tallCount,
      dwarfCount,
    };
  }, [testCrossMystery, simulatedOffspringCount]);

  // Quick 1-Click Monohybrid Presets
  const applyPreset = (preset) => {
    if (preset === 'mendel_f1') {
      setParent1Mono('TT');
      setParent2Mono('tt');
    } else if (preset === 'mendel_f2') {
      setParent1Mono('Tt');
      setParent2Mono('Tt');
    } else if (preset === 'test_cross') {
      setParent1Mono('Tt');
      setParent2Mono('tt');
    }
  };

  // KCSE Quiz evaluation
  const handleQuizAnswer = (qId, optionIdx) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleEvaluateQuiz = () => {
    let score = 0;
    KCSE_MENDEL_CHALLENGES.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIdx) score += 1;
    });
    setQuizScore(score);
    setShowQuizResults(true);

    if (onTelemetry && !telemetrySent) {
      onTelemetry('kcse_mendelian_genetics_quiz_completed', {
        score,
        total: KCSE_MENDEL_CHALLENGES.length,
        percentage: Math.round((score / KCSE_MENDEL_CHALLENGES.length) * 100),
      });
      setTelemetrySent(true);
    }
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col font-sans">
      {/* TOP HEADER */}
      <header className="px-6 py-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-inner">
            <Dna className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                KCSE Biology Form 4 · Topic 2
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Mendelian Inheritance
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              Mendelian Genetics & Punnett Square Laboratory
            </h1>
          </div>
        </div>

        {/* 1-Click Fast Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => applyPreset('mendel_f1')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            title="Pure breeding parental cross TT x tt"
          >
            P1 Cross (TT × tt)
          </button>
          <button
            onClick={() => applyPreset('mendel_f2')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg transition cursor-pointer"
            title="Heterozygous F2 monohybrid cross Tt x Tt (3:1 ratio)"
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1" />
            F2 Cross (Tt × Tt)
          </button>
          <button
            onClick={() => {
              setParent1Mono('Tt');
              setParent2Mono('Tt');
              setParent1Dihybrid('RrYy');
              setParent2Dihybrid('RrYy');
              setIsMysteryRevealed(false);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            title="Reset simulation parameters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <nav className="flex overflow-x-auto border-b border-slate-800 bg-slate-900/70 px-4 scrollbar-none">
        {[
          { id: 'monohybrid', label: 'Monohybrid Cross (4-Square)', icon: Grid3X3, desc: 'Single trait inheritance (3:1 ratio)' },
          { id: 'dihybrid', label: 'Dihybrid Cross (16-Square)', icon: Layers, desc: 'Independent assortment (9:3:3:1 ratio)' },
          { id: 'testcross', label: 'Test Cross Diagnostic', icon: Search, desc: 'Detect unknown homozygous/heterozygous' },
          { id: 'kcse_quiz', label: 'KCSE Exam Challenge', icon: Award, desc: 'Inheritance problems and ratios' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* MAIN EXPERIMENT BODY */}
      <main className="p-4 sm:p-6 flex-1 flex flex-col gap-6">
        {/* TAB 1: MONOHYBRID CROSS */}
        {activeTab === 'monohybrid' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls & Parent Setup */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Split className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    Trait & Parental Alleles
                  </h3>
                </div>

                {/* Trait Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Select Pea Plant Trait:</label>
                  <div className="space-y-1.5">
                    {Object.entries(MONOHYBRID_TRAITS).map(([key, trait]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedTraitKey(key)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                          selectedTraitKey === key
                            ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                        }`}
                      >
                        <span>{trait.name}</span>
                        <span className="font-mono text-[11px] opacity-80">
                          {trait.dominantSymbol} vs {trait.recessiveSymbol}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Parent 1 (Maternal) Allele Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Parent 1 (♀ Maternal):</label>
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                    {[`${activeTrait.dominantSymbol}${activeTrait.dominantSymbol}`, `${activeTrait.dominantSymbol}${activeTrait.recessiveSymbol}`, `${activeTrait.recessiveSymbol}${activeTrait.recessiveSymbol}`].map((g) => (
                      <button
                        key={g}
                        onClick={() => setParent1Mono(g)}
                        className={`py-2 rounded-xl border font-bold transition cursor-pointer ${
                          parent1Mono === g
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Parent 2 (Paternal) Allele Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Parent 2 (♂ Paternal):</label>
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                    {[`${activeTrait.dominantSymbol}${activeTrait.dominantSymbol}`, `${activeTrait.dominantSymbol}${activeTrait.recessiveSymbol}`, `${activeTrait.recessiveSymbol}${activeTrait.recessiveSymbol}`].map((g) => (
                      <button
                        key={g}
                        onClick={() => setParent2Mono(g)}
                        className={`py-2 rounded-xl border font-bold transition cursor-pointer ${
                          parent2Mono === g
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Law of Segregation Reminder */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-400" />
                    <span>Mendel&apos;s 1st Law (Segregation):</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Allele pair <strong>{parent1Mono}</strong> segregates during meiosis to form haploid gametes:
                    <span className="font-mono text-emerald-300 ml-1">[{monoGametes1[0]}] and [{monoGametes1[1]}]</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Interactive 4-Square Punnett Grid & Pea Plant Phenotypes */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Grid3X3 className="w-5 h-5 text-emerald-400" />
                    Monohybrid Punnett Square (4 Offspring Combinations)
                  </h3>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300">
                    Cross: {parent1Mono} × {parent2Mono}
                  </span>
                </div>

                {/* 2x2 Punnett Grid Container */}
                <div className="flex justify-center p-4">
                  <div className="grid grid-cols-3 gap-3 max-w-md w-full font-mono text-center">
                    {/* Header Row */}
                    <div className="p-2 flex items-center justify-center text-xs text-slate-500">
                      ♀ \ ♂
                    </div>
                    {monoGametes2.map((g2, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-base font-black text-sky-400 flex flex-col items-center justify-center shadow"
                      >
                        <span className="text-[10px] uppercase text-slate-400 font-sans">Gamete</span>
                        <span>{g2}</span>
                      </div>
                    ))}

                    {/* Row 1 */}
                    <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-base font-black text-amber-400 flex flex-col items-center justify-center shadow">
                      <span className="text-[10px] uppercase text-slate-400 font-sans">Gamete</span>
                      <span>{monoGametes1[0]}</span>
                    </div>
                    {monoPunnettGrid.slice(0, 2).map((cell, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          cell.isDominant
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                            : 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                        }`}
                      >
                        <span className="text-lg font-black">{cell.genotype}</span>
                        <span className="text-[11px] font-sans font-bold">{cell.phenotype}</span>
                      </div>
                    ))}

                    {/* Row 2 */}
                    <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-base font-black text-amber-400 flex flex-col items-center justify-center shadow">
                      <span className="text-[10px] uppercase text-slate-400 font-sans">Gamete</span>
                      <span>{monoGametes1[1]}</span>
                    </div>
                    {monoPunnettGrid.slice(2, 4).map((cell, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          cell.isDominant
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                            : 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                        }`}
                      >
                        <span className="text-lg font-black">{cell.genotype}</span>
                        <span className="text-[11px] font-sans font-bold">{cell.phenotype}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantitative Ratios Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                      Phenotypic Ratio (Appearance)
                    </span>
                    <div className="text-base font-black text-emerald-300 mt-1">
                      {monoRatios.phenotypicRatio}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {Math.round((monoRatios.dominantCount / 4) * 100)}% {activeTrait.dominantName} vs{' '}
                      {Math.round((monoRatios.recessiveCount / 4) * 100)}% {activeTrait.recessiveName}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                      Genotypic Ratio (Allele Composition)
                    </span>
                    <div className="text-base font-black font-mono text-sky-300 mt-1">
                      {monoRatios.genotypicRatio}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Pure Dominant vs Heterozygous vs Pure Recessive
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIHYBRID CROSS */}
        {activeTab === 'dihybrid' && (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    Dihybrid Cross: Seed Shape (R/r) & Seed Colour (Y/y)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Demonstrating <strong>Mendel&apos;s Second Law</strong> (Law of Independent Assortment) with a 16-square Punnett matrix.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300">
                    P1: {parent1Dihybrid}
                  </span>
                  <span className="text-slate-500 font-black">×</span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300">
                    P2: {parent2Dihybrid}
                  </span>
                </div>
              </div>

              {/* Dihybrid 4x4 Interactive Punnett Matrix */}
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[580px] max-w-3xl mx-auto grid grid-cols-5 gap-2 font-mono text-center">
                  {/* Top Header Corner */}
                  <div className="p-2 flex items-center justify-center text-xs text-slate-500">
                    ♀ \ ♂
                  </div>
                  {/* Column Gametes */}
                  {dihybridGametes2.map((g, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-black text-sky-300 flex items-center justify-center shadow"
                    >
                      {g}
                    </div>
                  ))}

                  {/* 4 Rows */}
                  {[0, 1, 2, 3].map((rowIdx) => (
                    <React.Fragment key={rowIdx}>
                      {/* Row Gamete */}
                      <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-black text-amber-300 flex items-center justify-center shadow">
                        {dihybridGametes1[rowIdx]}
                      </div>

                      {/* 4 Offspring Cells in this Row */}
                      {dihybridPunnettGrid.slice(rowIdx * 4, rowIdx * 4 + 4).map((cell, cIdx) => {
                        let cellBg = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200';
                        if (cell.phenotype === 'Round Green') {
                          cellBg = 'bg-teal-950/40 border-teal-500/50 text-teal-200';
                        } else if (cell.phenotype === 'Wrinkled Yellow') {
                          cellBg = 'bg-amber-950/40 border-amber-500/50 text-amber-200';
                        } else if (cell.phenotype === 'Wrinkled Green') {
                          cellBg = 'bg-rose-950/40 border-rose-500/50 text-rose-200';
                        }

                        return (
                          <div
                            key={cIdx}
                            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${cellBg}`}
                          >
                            <span className="text-xs font-black">{cell.genotype}</span>
                            <span className="text-[9px] font-sans font-semibold mt-0.5 truncate">
                              {cell.phenotype}
                            </span>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Dihybrid 9:3:3:1 Quantitative Phenotypic Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Round Yellow</span>
                    <span className="text-lg font-black text-emerald-300">{dihybridRatios.roundYellow}/16</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">R_ Y_ (Both Dominant)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-500/40 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-400">Round Green</span>
                    <span className="text-lg font-black text-teal-300">{dihybridRatios.roundGreen}/16</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">R_ yy (Recombinant)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Wrinkled Yellow</span>
                    <span className="text-lg font-black text-amber-300">{dihybridRatios.wrinkledYellow}/16</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">rr Y_ (Recombinant)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400">Wrinkled Green</span>
                    <span className="text-lg font-black text-rose-300">{dihybridRatios.wrinkledGreen}/16</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">rr yy (Double Recessive)</span>
                </div>
              </div>

              {/* Law of Independent Assortment Note */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-200">KCSE Form 4 Principle:</strong> Mendel&apos;s Second Law states that when two or more characteristics are inherited, individual hereditary factors assort independently during gamete production, provided the gene loci reside on separate non-homologous chromosomes (unlinked genes).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEST CROSS DIAGNOSTIC */}
        {activeTab === 'testcross' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Test Cross Setup & Mystery Parent */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Search className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">Test Cross / Back Cross Simulator</h3>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <p>
                  You are presented with a phenotypically <strong>Tall pea plant</strong>. Its genotype is uncertain: it could be pure homozygous dominant (<strong>TT</strong>) or heterozygous (<strong>Tt</strong>).
                </p>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="font-bold text-slate-200 block">Configure Unknown Parent (Mystery):</span>
                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <button
                      onClick={() => {
                        setTestCrossMystery('TT');
                        setIsMysteryRevealed(false);
                      }}
                      className={`py-2.5 rounded-xl border font-bold transition cursor-pointer ${
                        testCrossMystery === 'TT'
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      Unknown A (TT)
                    </button>
                    <button
                      onClick={() => {
                        setTestCrossMystery('Tt');
                        setIsMysteryRevealed(false);
                      }}
                      className={`py-2.5 rounded-xl border font-bold transition cursor-pointer ${
                        testCrossMystery === 'Tt'
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      Unknown B (Tt)
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-slate-200 block mb-1">Tester Mate:</span>
                  <p className="text-slate-400">
                    Always crossed with a <strong>homozygous recessive</strong> dwarf plant (<code className="text-amber-400 font-mono">tt</code>).
                  </p>
                </div>

                <button
                  onClick={() => setIsMysteryRevealed(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-xs text-white shadow-lg transition cursor-pointer"
                >
                  Reveal Genotype Analysis
                </button>
              </div>
            </div>

            {/* Right: Test Cross Diagnostic Offspring Visualizer */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Offspring Progeny Diagnostic (Simulated N={simulatedOffspringCount})
                </h3>
                <span className="text-xs text-emerald-400 font-mono">Test Cross: ? × tt</span>
              </div>

              {/* Live Proportion Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-400">Tall Offspring: {testCrossOutcome.tallPercent}% ({testCrossOutcome.tallCount} plants)</span>
                  <span className="text-amber-400">Dwarf Offspring: {testCrossOutcome.dwarfPercent}% ({testCrossOutcome.dwarfCount} plants)</span>
                </div>
                <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${testCrossOutcome.tallPercent}%` }}
                  />
                  <div
                    className="bg-amber-500 h-full transition-all duration-500"
                    style={{ width: `${testCrossOutcome.dwarfPercent}%` }}
                  />
                </div>
              </div>

              {/* Diagnostic Interpretation Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Diagnostic Conclusion:
                </span>
                {testCrossOutcome.isHet ? (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-1">
                    <strong className="block text-sm text-amber-300">Heterozygous Parent Confirmed (Tt):</strong>
                    <p>
                      Because dwarf offspring (<code className="font-mono">tt</code>) appeared in a <strong>1:1 ratio (50% Tall : 50% Dwarf)</strong>, the unknown parent must have donated recessive allele &apos;t&apos;.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs space-y-1">
                    <strong className="block text-sm text-emerald-300">Homozygous Dominant Parent Confirmed (TT):</strong>
                    <p>
                      Because <strong>100% of the progeny are tall</strong>, the unknown parent only donated dominant allele &apos;T&apos; to all offspring.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KCSE EXAM CHALLENGES */}
        {activeTab === 'kcse_quiz' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  KCSE Form 4 Mendelian Genetics Examination Challenges
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Master standard KCSE genetic crosses, ratios, test crosses, and Mendel&apos;s laws.
                </p>
              </div>
              {showQuizResults && (
                <div className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  Score: {quizScore} / {KCSE_MENDEL_CHALLENGES.length} (
                  {Math.round((quizScore / KCSE_MENDEL_CHALLENGES.length) * 100)}%)
                </div>
              )}
            </div>

            <div className="space-y-6">
              {KCSE_MENDEL_CHALLENGES.map((q) => {
                const userChoice = selectedAnswers[q.id];
                const isCorrect = userChoice === q.correctIdx;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                      <span>{q.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{q.syllRef}</span>
                    </div>

                    <p className="text-xs text-slate-300 italic">{q.scenario}</p>
                    <p className="text-sm font-semibold text-white">{q.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userChoice === optIdx;
                        let btnStyle = 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800';

                        if (showQuizResults) {
                          if (optIdx === q.correctIdx) {
                            btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-emerald-600 text-white border-emerald-400 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleQuizAnswer(q.id, optIdx)}
                            className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-start gap-2 ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showQuizResults && (
                      <div
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                          isCorrect
                            ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                            : 'bg-rose-950/40 border-rose-800/40 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                          <span>{isCorrect ? 'Correct Answer' : 'Incorrect'}</span>
                        </div>
                        <p className="text-slate-300">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setShowQuizResults(false);
                  setQuizScore(0);
                  setTelemetrySent(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Reset Challenge
              </button>

              <button
                onClick={handleEvaluateQuiz}
                disabled={Object.keys(selectedAnswers).length < KCSE_MENDEL_CHALLENGES.length}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg transition cursor-pointer"
              >
                Submit Answers & Evaluate
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>KCSE Form 4 Syllabus: Unit 2 · Genetics · Mendelian Monohybrid & Dihybrid Crosses</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Gregor Mendel&apos;s Laws of Inheritance</span>
          <span>Complete Dominance & Test Cross</span>
        </div>
      </footer>
    </div>
  );
}
