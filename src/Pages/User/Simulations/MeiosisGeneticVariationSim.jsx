import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
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
  Shuffle,
  Info,
  Sliders,
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
  Dna,
  Check,
} from 'lucide-react';

// ============================================================================
// STAGE DEFINITIONS & BIOLOGICAL SPECIFICATIONS (KCSE Form 4 Syllabus)
// ============================================================================

const MEIOSIS_STAGES = [
  {
    id: 0,
    key: 'interphase',
    shortName: 'Interphase',
    fullName: 'Interphase (G₂ Phase) · Replicated Diploid Germ Cell',
    stageBadge: 'Pre-Meiotic Replication',
    ploidy: '2n = 4',
    ploidyType: 'Diploid (Duplicated Chromosomes)',
    chrCount: 4,
    chromatidCount: 8,
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    summary:
      'Prior to meiosis, DNA replicates during S-phase. The diploid germ cell (2n = 4) contains 2 homologous pairs (one large pair, one small pair). Each chromosome consists of two identical sister chromatids joined at a centromere.',
    keyMechanism:
      'Centrosomes replicate; chromatin fibers condense into visible chromosomes; the nuclear envelope remains intact.',
    kcseTakeaway:
      'DNA replication occurs only during Interphase prior to Meiosis I. Each chromosome becomes double-stranded with two genetically identical sister chromatids.',
  },
  {
    id: 1,
    key: 'prophase1',
    shortName: 'Prophase I',
    fullName: 'Prophase I · Synapsis & Crossing Over (Chiasmata)',
    stageBadge: 'Primary Source of Variation',
    ploidy: '2n = 4',
    ploidyType: 'Diploid (Bivalents / Tetrads)',
    chrCount: 4,
    chromatidCount: 8,
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    summary:
      'Homologous chromosomes pair gene-for-gene (synapsis) to form bivalents (tetrads). Non-sister chromatids intertwine at contact points called chiasmata, where reciprocal segment exchange (crossing over) occurs.',
    keyMechanism:
      'Crossing over breaks maternal and paternal linkage groups, swapping alleles between non-sister chromatids and generating novel recombinant chromatids.',
    kcseTakeaway:
      'Crossing over during Prophase I breaks linkage between genes, creating new combinations of maternal and paternal alleles (recombinants) essential for genetic diversity.',
  },
  {
    id: 2,
    key: 'metaphase1',
    shortName: 'Metaphase I',
    fullName: 'Metaphase I · Independent Assortment at the Equator',
    stageBadge: 'Mendelian Assortment',
    ploidy: '2n = 4',
    ploidyType: 'Diploid (Equatorial Alignment)',
    chrCount: 4,
    chromatidCount: 8,
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    summary:
      'Bivalents align along the equatorial (metaphase) plate. Spindle fibres from opposite centrioles attach to the kinetochores of homologous chromosomes. The orientation of maternal vs paternal chromosomes is completely random.',
    keyMechanism:
      'Independent Assortment: Orientation of one bivalent does not influence another (2ⁿ = 2² = 4 possible combinations), ensuring varied gamete genotypes.',
    kcseTakeaway:
      'Mendel’s Law of Independent Assortment operates in Metaphase I. Whole homologous chromosomes align in pairs; centromeres do NOT split here.',
  },
  {
    id: 3,
    key: 'anaphase1',
    shortName: 'Anaphase I',
    fullName: 'Anaphase I · Segregation of Homologues (Reduction Division)',
    stageBadge: 'Reduction Division (2n → n)',
    ploidy: '2n = 4 → n = 2',
    ploidyType: 'Reduction Division in Progress',
    chrCount: 4,
    chromatidCount: 8,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    summary:
      'Spindle fibres contract and pull whole homologous chromosomes apart toward opposite poles. Crucially, centromeres DO NOT divide; sister chromatids remain attached.',
    keyMechanism:
      'The diploid chromosome complement (2n = 4) is halved into two haploid sets (n = 2 double-chromatid chromosomes at each pole).',
    kcseTakeaway:
      'Meiosis I is a reduction division because homologous pairs separate, halving chromosome number. Centromeres remain intact throughout Meiosis I.',
  },
  {
    id: 4,
    key: 'telophase1',
    shortName: 'Telophase I',
    fullName: 'Telophase I & Cytokinesis · Two Haploid Daughter Cells',
    stageBadge: 'First Cytokinesis',
    ploidy: 'n = 2 (per cell)',
    ploidyType: 'Haploid (Duplicated Chromosomes)',
    chrCount: 2,
    chromatidCount: 4,
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    summary:
      'Cleavage furrow divides the mother cell into two daughter cells. Each daughter cell contains n = 2 chromosomes (one large, one small). Notice each chromosome is still double-stranded.',
    keyMechanism:
      'Recombinant chromatids are now segregated into different daughter cells. No further DNA replication occurs before Meiosis II begins.',
    kcseTakeaway:
      'At the completion of Meiosis I, the two daughter cells are already haploid (n = 2), but each chromosome still consists of two sister chromatids.',
  },
  {
    id: 5,
    key: 'meiosis2',
    shortName: 'Meiosis II',
    fullName: 'Meiosis II (Anaphase II) · Centromere Division & Chromatid Separation',
    stageBadge: 'Equational Division',
    ploidy: 'n = 2',
    ploidyType: 'Centromeres Split to Form Daughter Chromosomes',
    chrCount: 4,
    chromatidCount: 4,
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    summary:
      'In both haploid daughter cells, chromosomes align at metaphase II plates. Centromeres divide, and sister chromatids are pulled apart as individual daughter chromosomes to opposite poles.',
    keyMechanism:
      'Centromeres divide during Anaphase II (resembling mitotic division), separating recombinant sister chromatids from non-recombinant ones.',
    kcseTakeaway:
      'Centromeres divide only in Meiosis II (Anaphase II). Sister chromatids become individual single-stranded chromosomes.',
  },
  {
    id: 6,
    key: 'gametes',
    shortName: '4 Haploid Gametes',
    fullName: 'Telophase II · Four Genetically Unique Haploid Gametes',
    stageBadge: 'Final Recombinant Gametes',
    ploidy: 'n = 2 (each gamete)',
    ploidyType: 'Haploid Gametes (Sperm / Ova)',
    chrCount: 2,
    chromatidCount: 2,
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    summary:
      'Cytokinesis produces 4 distinct haploid gametes (n = 2). When crossing over was active, all 4 gametes can possess unique recombinant genotypes! Without crossing over, only 2 parental combinations exist.',
    keyMechanism:
      'Synergy of crossing over and independent assortment yields maximum genetic diversity, ensuring evolutionary adaptability of sexually reproducing populations.',
    kcseTakeaway:
      'One diploid germ cell (2n = 4) produces 4 haploid gametes (n = 2). Crossing over maximizes the number of distinct recombinant genotypes produced.',
  },
];

// ============================================================================
// ANATOMICAL & STRUCTURAL DEFINITIONS (INSPECTOR GLOSSARY)
// ============================================================================

const STRUCTURE_GLOSSARY = {
  homologous_pair: {
    title: 'Homologous Chromosome Pair (Bivalent / Tetrad)',
    color: '#38BDF8',
    definition:
      'A pair of chromosomes (one maternal, one paternal) having identical gene loci in the same linear order, though potentially carrying different alleles (e.g. A vs a).',
    roleInMeiosis:
      'Pair up during Prophase I synapsis to allow crossing over, and align along the equatorial plate in Metaphase I before segregating.',
    kcseTip:
      'Do not confuse homologous chromosomes with sister chromatids. Homologous chromosomes originate from different parents and carry matching gene loci, not necessarily identical DNA sequences.',
  },
  sister_chromatids: {
    title: 'Sister Chromatids',
    color: '#F43F5E',
    definition:
      'Two identical copies of a single replicated chromosome joined together at a shared centromere, synthesized during interphase S-phase.',
    roleInMeiosis:
      'Stay attached during Meiosis I reduction division; their centromere divides in Anaphase II so they segregate into separate gametes.',
    kcseTip:
      'Sister chromatids are genetically identical before crossing over. After crossing over, non-sister chromatid exchange makes them genetically distinct recombinant chromatids.',
  },
  centromere: {
    title: 'Centromere & Kinetochore',
    color: '#FACC15',
    definition:
      'The specialized constricted DNA region of a chromosome where two sister chromatids are held together and where spindle kinetochore fibres attach.',
    roleInMeiosis:
      'Remains intact during Meiosis I (homologous chromosomes segregate whole); divides during Meiosis II (Anaphase II) to allow chromatid segregation.',
    kcseTip:
      'A classic KCSE question asks: "In which meiotic stage do centromeres divide?" Answer: Anaphase II only!',
  },
  chiasma: {
    title: 'Chiasma (Plural: Chiasmata)',
    color: '#A855F7',
    definition:
      'The visible X-shaped point of physical overlap and contact between non-sister chromatids of homologous chromosomes during Prophase I.',
    roleInMeiosis:
      'Site where chromatid breakage and reciprocal rejoining occur, resulting in crossing over and exchange of genetic alleles.',
    kcseTip:
      'Chiasmata hold bivalents together until Anaphase I and are direct microscopic evidence of crossing over.',
  },
  spindle_fibres: {
    title: 'Spindle Fibres & Centrioles',
    color: '#06B6D4',
    definition:
      'Microtubule protein filaments radiating from centrosomes/centrioles at opposite cell poles that orchestrate chromosome movement.',
    roleInMeiosis:
      'Contract during Anaphase I to separate homologous chromosomes, and contract in Anaphase II to pull separated sister chromatids to opposite poles.',
    kcseTip:
      'Chemicals like colchicine disrupt spindle fibre formation, causing meiotic arrest or polyploidy.',
  },
  recombinant_chromatid: {
    title: 'Recombinant Chromatid',
    color: '#10B981',
    definition:
      'A chromatid that carries a newly created mosaic combination of maternal and paternal alleles resulting from reciprocal crossing over.',
    roleInMeiosis:
      'Ensures that gametes contain combinations of traits never before found in either parent, promoting continuous variation in the species.',
    kcseTip:
      'Offspring inheriting recombinant chromatids are termed recombinant phenotypes; they provide raw genetic variation for natural selection.',
  },
};

// ============================================================================
// KCSE EXAMINATION CHALLENGES & HIGH-YIELD QUESTIONS
// ============================================================================

const KCSE_MEIOSIS_QUESTIONS = [
  {
    id: 1,
    question:
      'Which specific meiotic event breaks gene linkage and creates novel recombinant allele combinations in gametes?',
    options: [
      { id: 'A', text: 'DNA replication during Interphase' },
      {
        id: 'B',
        text: 'Crossing over between non-sister chromatids of homologous chromosomes at chiasmata in Prophase I',
        correct: true,
      },
      { id: 'C', text: 'Division of centromeres during Anaphase I' },
      { id: 'D', text: 'Formation of the cleavage furrow during cytokinesis' },
    ],
    explanation:
      'Crossing over occurs in Prophase I when non-sister chromatids within a bivalent form chiasmata and exchange reciprocal genetic segments, breaking linkage groups and generating new allele combinations.',
    syllabusRef: 'KCSE Biology Paper 2 · Topic 1 (Genetics: Meiosis & Variation)',
  },
  {
    id: 2,
    question:
      'Why is Meiosis I called a "reduction division" while Meiosis II is called an "equational division"?',
    options: [
      {
        id: 'A',
        text: 'In Meiosis I, the diploid chromosome count (2n) is halved to haploid (n) as homologous pairs segregate; in Meiosis II, centromeres divide and sister chromatids separate without halving chromosome number',
        correct: true,
      },
      { id: 'B', text: 'Meiosis I produces gametes, while Meiosis II produces somatic cells' },
      { id: 'C', text: 'Centromeres divide in Meiosis I but stay fused in Meiosis II' },
      { id: 'D', text: 'Meiosis I occurs in plants and Meiosis II occurs in animals' },
    ],
    explanation:
      'Meiosis I separates whole homologous chromosome pairs, reducing ploidy from 2n=4 to n=2. Meiosis II splits centromeres and separates sister chromatids, maintaining haploid status (n=2).',
    syllabusRef: 'KCSE Form 4 Biology · Cell Division Mechanics',
  },
  {
    id: 3,
    question:
      'If a sexually reproducing diploid species has 2n = 6 chromosomes, how many genetically different gamete combinations can arise from Independent Assortment alone (without crossing over)?',
    options: [
      { id: 'A', text: '3 combinations' },
      { id: 'B', text: '6 combinations' },
      { id: 'C', text: '8 combinations (2³ = 8)', correct: true },
      { id: 'D', text: '64 combinations' },
    ],
    explanation:
      'The number of possible chromosome combinations in gametes due to independent assortment is given by 2ⁿ, where n is the haploid number. For 2n = 6, n = 3. Therefore, 2³ = 8 distinct gametic chromosome combinations.',
    syllabusRef: 'KCSE Biology · Mendelian Genetics & Assortment Calculations',
  },
  {
    id: 4,
    question:
      'What serious cytogenetic consequence occurs if homologous chromosomes fail to separate during Anaphase I of meiosis?',
    options: [
      { id: 'A', text: 'Mitotic spindle becomes permanent' },
      {
        id: 'B',
        text: 'Non-disjunction occurs, producing aneuploid gametes with (n + 1) and (n - 1) chromosomes, leading to conditions like Down syndrome (Trisomy 21)',
        correct: true,
      },
      { id: 'C', text: 'All daughter gametes become genetically identical clones' },
      { id: 'D', text: 'Crossing over frequency increases tenfold' },
    ],
    explanation:
      'Failure of homologous chromosomes to segregate in Anaphase I is termed non-disjunction. It yields two gametes with (n + 1) chromosomes and two with (n - 1) chromosomes. Fertilization creates trisomy or monosomy aneuploidies.',
    syllabusRef: 'KCSE Form 4 Topic 1 · Chromosomal Mutations (Aneuploidy)',
  },
];

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================

export default function MeiosisGeneticVariationSim({ config = {}, onTelemetry }) {
  // Navigation & Control States
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'matrix' | 'quiz'
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [crossingOver, setCrossingOver] = useState(true);
  const [assortmentOrientation, setAssortmentOrientation] = useState(1); // 1 = Orientation A (1M & 2M left), 2 = Orientation B (1M & 2P left)
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(3000); // ms per stage

  // Discovery / Nondisjunction mode
  const [nondisjunctionMode, setNondisjunctionMode] = useState(false);

  // Inspector & Interactive Tooltips
  const [inspectedStructure, setInspectedStructure] = useState(null);
  const [showLabels, setShowLabels] = useState(true);

  // Telemetry & Verification Tracking
  const [stagesVisited, setStagesVisited] = useState(new Set([0]));
  const [crossingOverTested, setCrossingOverTested] = useState(new Set([true]));
  const [telemetrySent, setTelemetrySent] = useState(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const stage = MEIOSIS_STAGES[currentStageIdx];
  const autoPlayTimerRef = useRef(null);

  // Mark stages visited and check telemetry completion
  useEffect(() => {
    setStagesVisited((prev) => {
      const next = new Set(prev);
      next.add(currentStageIdx);
      return next;
    });
  }, [currentStageIdx]);

  useEffect(() => {
    setCrossingOverTested((prev) => {
      const next = new Set(prev);
      next.add(crossingOver);
      return next;
    });
  }, [crossingOver]);

  // Checkpoint telemetry dispatch
  useEffect(() => {
    if (!telemetrySent && stagesVisited.size >= 7 && crossingOverTested.has(true) && crossingOverTested.has(false)) {
      setTelemetrySent(true);
      if (onTelemetry) {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'meiosis_genetic_variation',
          checkpoint: 'crossing_over_and_stages_completed',
          totalStagesVisited: stagesVisited.size,
          testedBothModes: true,
          timestamp: Date.now(),
        });
      }
    }
  }, [stagesVisited, crossingOverTested, telemetrySent, onTelemetry]);

  // Auto-play walkthrough timer
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setTimeout(() => {
        setCurrentStageIdx((prev) => {
          if (prev >= MEIOSIS_STAGES.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    }
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, currentStageIdx, playbackSpeed]);

  const handleNextStage = () => {
    if (currentStageIdx < MEIOSIS_STAGES.length - 1) {
      setCurrentStageIdx((prev) => prev + 1);
    }
  };

  const handlePrevStage = () => {
    if (currentStageIdx > 0) {
      setCurrentStageIdx((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStageIdx(0);
    setCrossingOver(true);
    setAssortmentOrientation(1);
    setNondisjunctionMode(false);
    setInspectedStructure(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeTab !== 'simulation') return;
      if (e.key === 'ArrowRight') {
        handleNextStage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevStage();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStageIdx, activeTab]);

  // Quiz evaluation
  const handleAnswerSelect = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleEvaluateQuiz = () => {
    let correctCount = 0;
    KCSE_MEIOSIS_QUESTIONS.forEach((q) => {
      const selected = selectedAnswers[q.id];
      const correctOpt = q.options.find((o) => o.correct);
      if (selected === correctOpt.id) {
        correctCount += 1;
      }
    });
    setQuizScore(correctCount);
    setShowQuizResults(true);

    if (onTelemetry) {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'meiosis_genetic_variation',
        checkpoint: 'meiosis_quiz_evaluated',
        score: correctCount,
        total: KCSE_MEIOSIS_QUESTIONS.length,
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-950 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden font-sans">
      {/* 1. HEADER & NAVIGATION BAR */}
      <header className="px-5 py-4 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Dna className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Meiosis &amp; Genetic Variation
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wide">
                Form 4 Biology
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Cytogenetic Model · KCSE Topic 1 (Genetics) · Chromosome Halving &amp; Recombination
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'simulation'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Model</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Variation Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>KCSE Exam Quiz</span>
          </button>
        </div>
      </header>

      {/* 2. TAB: MAIN INTERACTIVE SIMULATION */}
      {activeTab === 'simulation' && (
        <main className="p-4 sm:p-6 space-y-5">
          {/* Top Control Bar: Stage Timeline Stepper */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Meiotic Stage Timeline ({currentStageIdx + 1} of {MEIOSIS_STAGES.length})
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${stage.badgeColor}`}>
                  {stage.ploidy} · {stage.ploidyType}
                </span>
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
              {MEIOSIS_STAGES.map((s, idx) => {
                const isActive = idx === currentStageIdx;
                const isPassed = idx < currentStageIdx;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStageIdx(idx);
                    }}
                    className={`px-2 py-2 rounded-lg text-left transition flex flex-col justify-between border cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                        : isPassed
                        ? 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        0{idx + 1}
                      </span>
                      {isPassed && <Check className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <span className="text-[11px] font-semibold truncate mt-0.5">
                      {s.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Simulation Canvas Area */}
          <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            {/* SVG Header Overlay: Active Stage Info */}
            <div className="absolute top-3 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 shadow-lg pointer-events-auto">
                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  {stage.fullName}
                </span>
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => setShowLabels((p) => !p)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1 transition cursor-pointer ${
                    showLabels
                      ? 'bg-slate-800/90 border-slate-700 text-slate-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                  title="Toggle Anatomical Labels"
                >
                  {showLabels ? <Eye className="w-3 h-3 text-indigo-400" /> : <EyeOff className="w-3 h-3" />}
                  <span>Labels</span>
                </button>

                <span
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border shadow-sm ${
                    crossingOver
                      ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300'
                      : 'bg-amber-950/60 border-amber-600/50 text-amber-300'
                  }`}
                >
                  Crossing Over: {crossingOver ? 'ACTIVE (Recombinants)' : 'OFF (Parental Only)'}
                </span>
              </div>
            </div>

            {/* SVG Visual Stage Canvas */}
            <div className="w-full aspect-[16/9] max-h-[490px] min-h-[340px] flex items-center justify-center p-2">
              <svg
                viewBox="0 0 900 480"
                className="w-full h-full select-none"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Gradients */}
                  <linearGradient id="cellBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0f172a" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#1e293b" stopOpacity="0.75" />
                  </linearGradient>

                  <linearGradient id="daughterCellBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0b132b" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#1c2541" stopOpacity="0.8" />
                  </linearGradient>

                  <radialGradient id="gameteBg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
                    <stop offset="85%" stopColor="#0f172a" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                  </radialGradient>

                  <radialGradient id="centromereGrad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="60%" stopColor="#FACC15" />
                    <stop offset="100%" stopColor="#CA8A04" />
                  </radialGradient>

                  {/* Chromosome Arm Gradients */}
                  <linearGradient id="matGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FB7185" />
                    <stop offset="50%" stopColor="#F43F5E" />
                    <stop offset="100%" stopColor="#BE123C" />
                  </linearGradient>

                  <linearGradient id="patGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>

                  <linearGradient id="matGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FDBA74" />
                    <stop offset="50%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#C2410C" />
                  </linearGradient>

                  <linearGradient id="patGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C4B5FD" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6D28D9" />
                  </linearGradient>

                  {/* Filters */}
                  <filter id="chiasmaGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* ========================================================== */}
                {/* 1. STAGE 0: INTERPHASE (G2)                                */}
                {/* ========================================================== */}
                {currentStageIdx === 0 && (
                  <g className="transition-all duration-700 ease-out">
                    {/* Cell Membrane */}
                    <ellipse
                      cx="450"
                      cy="240"
                      rx="380"
                      ry="205"
                      fill="url(#cellBg)"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                      className="cursor-pointer"
                      onClick={() => setInspectedStructure('cleavage_furrow')}
                    />

                    {/* Nuclear Envelope (Intact) */}
                    <ellipse
                      cx="450"
                      cy="240"
                      rx="270"
                      ry="150"
                      fill="#030712"
                      fillOpacity="0.4"
                      stroke="#94A3B8"
                      strokeWidth="2"
                      strokeDasharray="6 5"
                    />

                    {/* Centrosomes (Replicated pair) */}
                    <g
                      className="cursor-pointer"
                      onClick={() => setInspectedStructure('spindle_fibres')}
                    >
                      <circle cx="230" cy="140" r="9" fill="#06B6D4" opacity="0.8" />
                      <line x1="220" y1="140" x2="240" y2="140" stroke="#22D3EE" strokeWidth="2" />
                      <line x1="230" y1="130" x2="230" y2="150" stroke="#22D3EE" strokeWidth="2" />
                      <circle cx="248" cy="145" r="7" fill="#06B6D4" opacity="0.6" />
                    </g>

                    {/* Chromosomes inside nucleus */}
                    {/* Maternal Chromosome 1 (Rose) */}
                    <g
                      transform="translate(370, 200)"
                      className="cursor-pointer"
                      onClick={() => setInspectedStructure('sister_chromatids')}
                    >
                      <rect x="-24" y="-55" width="16" height="110" rx="8" fill="url(#matGrad1)" />
                      <rect x="-6" y="-55" width="16" height="110" rx="8" fill="url(#matGrad1)" />
                      <circle cx="-7" cy="0" r="10" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                      <circle cx="-16" cy="-30" r="6" fill="#881337" />
                      <text x="-16" y="-27" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">A</text>
                      <circle cx="2" cy="-30" r="6" fill="#881337" />
                      <text x="2" y="-27" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">A</text>
                      <circle cx="-16" cy="30" r="6" fill="#881337" />
                      <text x="-16" y="33" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">B</text>
                      <circle cx="2" cy="30" r="6" fill="#881337" />
                      <text x="2" y="33" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">B</text>
                    </g>

                    {/* Paternal Chromosome 1 (Blue) */}
                    <g
                      transform="translate(530, 200)"
                      className="cursor-pointer"
                      onClick={() => setInspectedStructure('homologous_pair')}
                    >
                      <rect x="-10" y="-55" width="16" height="110" rx="8" fill="url(#patGrad1)" />
                      <rect x="8" y="-55" width="16" height="110" rx="8" fill="url(#patGrad1)" />
                      <circle cx="7" cy="0" r="10" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                      <circle cx="-2" cy="-30" r="6" fill="#1E3A8A" />
                      <text x="-2" y="-27" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">a</text>
                      <circle cx="16" cy="-30" r="6" fill="#1E3A8A" />
                      <text x="16" y="-27" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">a</text>
                      <circle cx="-2" cy="30" r="6" fill="#1E3A8A" />
                      <text x="-2" y="33" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">b</text>
                      <circle cx="16" cy="30" r="6" fill="#1E3A8A" />
                      <text x="16" y="33" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">b</text>
                    </g>

                    {/* Maternal Chromosome 2 (Orange) */}
                    <g
                      transform="translate(380, 310)"
                      className="cursor-pointer"
                      onClick={() => setInspectedStructure('sister_chromatids')}
                    >
                      <rect x="-20" y="-35" width="14" height="70" rx="7" fill="url(#matGrad2)" />
                      <rect x="-4" y="-35" width="14" height="70" rx="7" fill="url(#matGrad2)" />
                      <circle cx="-5" cy="0" r="8" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                      <circle cx="-13" cy="18" r="5" fill="#7C2D12" />
                      <text x="-13" y="21" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">C</text>
                      <circle cx="3" cy="18" r="5" fill="#7C2D12" />
                      <text x="3" y="21" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">C</text>
                    </g>

                    {/* Paternal Chromosome 2 (Violet) */}
                    <g
                      transform="translate(520, 310)"
                      className="cursor-pointer"
                      onClick={() => setInspectedStructure('homologous_pair')}
                    >
                      <rect x="-10" y="-35" width="14" height="70" rx="7" fill="url(#patGrad2)" />
                      <rect x="6" y="-35" width="14" height="70" rx="7" fill="url(#patGrad2)" />
                      <circle cx="5" cy="0" r="8" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                      <circle cx="-3" cy="18" r="5" fill="#4C1D95" />
                      <text x="-3" y="21" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">c</text>
                      <circle cx="13" cy="18" r="5" fill="#4C1D95" />
                      <text x="13" y="21" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">c</text>
                    </g>

                    {/* Callouts */}
                    {showLabels && (
                      <g className="text-xs font-semibold text-slate-300">
                        <line x1="200" y1="280" x2="260" y2="280" stroke="#94A3B8" strokeWidth="1.5" />
                        <circle cx="260" cy="280" r="3" fill="#94A3B8" />
                        <text x="190" y="284" textAnchor="end" fill="#94A3B8" fontSize="11" fontWeight="bold">
                          Nuclear Envelope (Intact)
                        </text>

                        <line x1="240" y1="120" x2="240" y2="90" stroke="#06B6D4" strokeWidth="1.5" />
                        <circle cx="240" cy="120" r="3" fill="#06B6D4" />
                        <text x="240" y="80" textAnchor="middle" fill="#22D3EE" fontSize="11" fontWeight="bold">
                          Centrosome (Replicated)
                        </text>

                        <line x1="450" y1="130" x2="450" y2="95" stroke="#38BDF8" strokeWidth="1.5" />
                        <line x1="370" y1="130" x2="530" y2="130" stroke="#38BDF8" strokeWidth="1.5" />
                        <circle cx="370" cy="130" r="3" fill="#38BDF8" />
                        <circle cx="530" cy="130" r="3" fill="#38BDF8" />
                        <text x="450" y="85" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="bold">
                          Homologous Pair 1 (Maternal 1M &amp; Paternal 1P)
                        </text>

                        <line x1="363" y1="200" x2="290" y2="170" stroke="#FACC15" strokeWidth="1.5" />
                        <circle cx="363" cy="200" r="3" fill="#FACC15" />
                        <text x="280" y="174" textAnchor="end" fill="#FACC15" fontSize="11" fontWeight="bold">
                          Centromere
                        </text>

                        <line x1="546" y1="200" x2="630" y2="170" stroke="#60A5FA" strokeWidth="1.5" />
                        <circle cx="538" cy="200" r="3" fill="#60A5FA" />
                        <text x="640" y="174" textAnchor="start" fill="#60A5FA" fontSize="11" fontWeight="bold">
                          Identical Sister Chromatids
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* ========================================================== */}
                {/* 2. STAGE 1: PROPHASE I (CROSSING OVER / CHIASMA)           */}
                {/* ========================================================== */}
                {currentStageIdx === 1 && (
                  <g className="transition-all duration-700 ease-out">
                    <ellipse
                      cx="450"
                      cy="240"
                      rx="380"
                      ry="205"
                      fill="url(#cellBg)"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                    />

                    {/* Dissolving Nuclear Envelope */}
                    <ellipse
                      cx="450"
                      cy="240"
                      rx="275"
                      ry="155"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                      strokeDasharray="4 18"
                      opacity="0.4"
                    />

                    {/* Centrosomes migrating */}
                    <g
                      className="cursor-pointer"
                      onClick={() => setInspectedStructure('spindle_fibres')}
                    >
                      <circle cx="140" cy="240" r="10" fill="#06B6D4" opacity="0.85" />
                      <line x1="140" y1="220" x2="140" y2="260" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="2 2" />
                      <line x1="120" y1="240" x2="160" y2="240" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="2 2" />

                      <circle cx="760" cy="240" r="10" fill="#06B6D4" opacity="0.85" />
                      <line x1="760" y1="220" x2="760" y2="260" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="2 2" />
                      <line x1="740" y1="240" x2="780" y2="240" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="2 2" />
                    </g>

                    {/* BIVALENT 1: Large Chromosome Pair (Synapsis & Chiasma) */}
                    <g transform="translate(370, 240)">
                      <rect x="-35" y="-65" width="16" height="130" rx="8" fill="url(#matGrad1)" />
                      <circle cx="-17" cy="0" r="10" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />

                      {crossingOver ? (
                        <>
                          <path
                            d="M -17 -65 C -17 -30, -5 0, 10 25 L 3 32 C -10 10, -25 -30, -25 -65 Z"
                            fill="url(#matGrad1)"
                          />
                          <path
                            d="M 10 25 C 20 42, 28 55, 30 65 L 14 65 C 10 55, 3 42, 3 32 Z"
                            fill="url(#patGrad1)"
                            stroke="#38BDF8"
                            strokeWidth="1"
                          />
                          <circle cx="18" cy="52" r="5" fill="#1E3A8A" />
                          <text x="18" y="55" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">b</text>
                        </>
                      ) : (
                        <rect x="-17" y="-65" width="16" height="130" rx="8" fill="url(#matGrad1)" />
                      )}

                      <circle cx="-27" cy="-35" r="6" fill="#881337" />
                      <text x="-27" y="-32" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">A</text>
                      <circle cx="-27" cy="35" r="6" fill="#881337" />
                      <text x="-27" y="38" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">B</text>
                    </g>

                    {/* 1P Paternal in Bivalent */}
                    <g transform="translate(425, 240)">
                      <rect x="25" y="-65" width="16" height="130" rx="8" fill="url(#patGrad1)" />
                      <circle cx="17" cy="0" r="10" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />

                      {crossingOver ? (
                        <>
                          <path
                            d="M 17 -65 C 17 -30, 5 0, -10 25 L -3 32 C 10 10, 25 -30, 25 -65 Z"
                            fill="url(#patGrad1)"
                          />
                          <path
                            d="M -10 25 C -20 42, -28 55, -30 65 L -14 65 C -10 55, -3 42, -3 32 Z"
                            fill="url(#matGrad1)"
                            stroke="#FB7185"
                            strokeWidth="1"
                          />
                          <circle cx="-18" cy="52" r="5" fill="#881337" />
                          <text x="-18" y="55" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">B</text>
                        </>
                      ) : (
                        <rect x="5" y="-65" width="16" height="130" rx="8" fill="url(#patGrad1)" />
                      )}

                      <circle cx="33" cy="-35" r="6" fill="#1E3A8A" />
                      <text x="33" y="-32" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">a</text>
                      <circle cx="33" cy="35" r="6" fill="#1E3A8A" />
                      <text x="33" y="38" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">b</text>
                    </g>

                    {/* Chiasma Indicator */}
                    {crossingOver && (
                      <g
                        className="cursor-pointer"
                        onClick={() => setInspectedStructure('chiasma')}
                      >
                        <circle
                          cx="400"
                          cy="268"
                          r="22"
                          fill="none"
                          stroke="#A855F7"
                          strokeWidth="2.5"
                          strokeDasharray="4 3"
                          filter="url(#chiasmaGlow)"
                          className="animate-pulse"
                        />
                        <circle cx="400" cy="268" r="4" fill="#E879F9" />
                      </g>
                    )}

                    {/* BIVALENT 2: Small Pair */}
                    <g transform="translate(560, 240)">
                      <rect x="-24" y="-45" width="14" height="90" rx="7" fill="url(#matGrad2)" />
                      <rect x="-8" y="-45" width="14" height="90" rx="7" fill="url(#matGrad2)" />
                      <circle cx="-9" cy="0" r="8" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                      <circle cx="-17" cy="25" r="5" fill="#7C2D12" />
                      <text x="-17" y="28" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">C</text>

                      <rect x="8" y="-45" width="14" height="90" rx="7" fill="url(#patGrad2)" />
                      <rect x="24" y="-45" width="14" height="90" rx="7" fill="url(#patGrad2)" />
                      <circle cx="17" cy="0" r="8" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                      <circle cx="31" cy="25" r="5" fill="#4C1D95" />
                      <text x="31" y="28" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">c</text>
                    </g>

                    {/* Labels */}
                    {showLabels && (
                      <g className="text-xs font-semibold">
                        {crossingOver ? (
                          <>
                            <line x1="400" y1="290" x2="400" y2="380" stroke="#C084FC" strokeWidth="1.5" />
                            <circle cx="400" cy="290" r="3" fill="#C084FC" />
                            <rect x="300" y="380" width="200" height="26" rx="6" fill="#1e1b4b" stroke="#A855F7" strokeWidth="1" />
                            <text x="400" y="397" textAnchor="middle" fill="#E9D5FF" fontSize="11" fontWeight="bold">
                              Chiasma · Crossing Over (A-b / a-B)
                            </text>
                          </>
                        ) : (
                          <>
                            <line x1="400" y1="270" x2="400" y2="380" stroke="#F59E0B" strokeWidth="1.5" />
                            <rect x="300" y="380" width="200" height="26" rx="6" fill="#451a03" stroke="#F59E0B" strokeWidth="1" />
                            <text x="400" y="397" textAnchor="middle" fill="#FEF08A" fontSize="11" fontWeight="bold">
                              Crossing Over Switched OFF (No Chiasma)
                            </text>
                          </>
                        )}

                        <line x1="395" y1="165" x2="395" y2="95" stroke="#38BDF8" strokeWidth="1.5" />
                        <line x1="330" y1="165" x2="460" y2="165" stroke="#38BDF8" strokeWidth="1.5" />
                        <circle cx="330" cy="165" r="3" fill="#38BDF8" />
                        <circle cx="460" cy="165" r="3" fill="#38BDF8" />
                        <rect x="290" y="70" width="210" height="25" rx="6" fill="#0c4a6e" stroke="#38BDF8" strokeWidth="1" />
                        <text x="395" y="87" textAnchor="middle" fill="#E0F2FE" fontSize="11" fontWeight="bold">
                          Bivalent / Tetrad (Synapsis)
                        </text>

                        <line x1="565" y1="185" x2="565" y2="110" stroke="#F97316" strokeWidth="1.5" />
                        <circle cx="565" cy="185" r="3" fill="#F97316" />
                        <text x="565" y="100" textAnchor="middle" fill="#FDBA74" fontSize="11" fontWeight="bold">
                          Bivalent 2 (Pair 2)
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* ========================================================== */}
                {/* 3. STAGE 2: METAPHASE I (INDEPENDENT ASSORTMENT)           */}
                {/* ========================================================== */}
                {currentStageIdx === 2 && (
                  <g className="transition-all duration-700 ease-out">
                    <ellipse
                      cx="450"
                      cy="240"
                      rx="380"
                      ry="205"
                      fill="url(#cellBg)"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                    />

                    {/* Equator */}
                    <line
                      x1="450"
                      y1="50"
                      x2="450"
                      y2="430"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.6"
                    />

                    {/* Centrosomes */}
                    <circle cx="110" cy="240" r="11" fill="#06B6D4" opacity="0.9" />
                    <circle cx="790" cy="240" r="11" fill="#06B6D4" opacity="0.9" />

                    {/* Spindles */}
                    <line x1="110" y1="240" x2="390" y2="160" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
                    <line x1="790" y1="240" x2="510" y2="160" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
                    <line x1="110" y1="240" x2="395" y2="320" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
                    <line x1="790" y1="240" x2="505" y2="320" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />

                    {/* PAIR 1 at Y=160 */}
                    <g transform="translate(390, 160)">
                      <rect x="-24" y="-55" width="16" height="110" rx="8" fill="url(#matGrad1)" />
                      {crossingOver ? (
                        <>
                          <rect x="-6" y="-55" width="16" height="75" rx="8" fill="url(#matGrad1)" />
                          <rect x="-6" y="20" width="16" height="35" rx="6" fill="url(#patGrad1)" stroke="#38BDF8" strokeWidth="1" />
                          <circle cx="2" cy="36" r="5" fill="#1E3A8A" />
                          <text x="2" y="39" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">b</text>
                        </>
                      ) : (
                        <rect x="-6" y="-55" width="16" height="110" rx="8" fill="url(#matGrad1)" />
                      )}
                      <circle cx="-6" cy="0" r="10" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                      <circle cx="-16" cy="-30" r="6" fill="#881337" />
                      <text x="-16" y="-27" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">A</text>
                      <circle cx="-16" cy="30" r="6" fill="#881337" />
                      <text x="-16" y="33" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">B</text>
                    </g>

                    <g transform="translate(510, 160)">
                      {crossingOver ? (
                        <>
                          <rect x="-10" y="-55" width="16" height="75" rx="8" fill="url(#patGrad1)" />
                          <rect x="-10" y="20" width="16" height="35" rx="6" fill="url(#matGrad1)" stroke="#FB7185" strokeWidth="1" />
                          <circle cx="-2" cy="36" r="5" fill="#881337" />
                          <text x="-2" y="39" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">B</text>
                        </>
                      ) : (
                        <rect x="-10" y="-55" width="16" height="110" rx="8" fill="url(#patGrad1)" />
                      )}
                      <rect x="8" y="-55" width="16" height="110" rx="8" fill="url(#patGrad1)" />
                      <circle cx="7" cy="0" r="10" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                      <circle cx="16" cy="-30" r="6" fill="#1E3A8A" />
                      <text x="16" y="-27" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">a</text>
                      <circle cx="16" cy="30" r="6" fill="#1E3A8A" />
                      <text x="16" y="33" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">b</text>
                    </g>

                    {/* PAIR 2 at Y=320 */}
                    {assortmentOrientation === 1 ? (
                      <>
                        <g transform="translate(395, 320)">
                          <rect x="-20" y="-35" width="14" height="70" rx="7" fill="url(#matGrad2)" />
                          <rect x="-4" y="-35" width="14" height="70" rx="7" fill="url(#matGrad2)" />
                          <circle cx="-5" cy="0" r="8" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                          <circle cx="-13" cy="18" r="5" fill="#7C2D12" />
                          <text x="-13" y="21" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">C</text>
                        </g>
                        <g transform="translate(505, 320)">
                          <rect x="-10" y="-35" width="14" height="70" rx="7" fill="url(#patGrad2)" />
                          <rect x="6" y="-35" width="14" height="70" rx="7" fill="url(#patGrad2)" />
                          <circle cx="5" cy="0" r="8" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                          <circle cx="13" cy="18" r="5" fill="#4C1D95" />
                          <text x="13" y="21" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">c</text>
                        </g>
                      </>
                    ) : (
                      <>
                        <g transform="translate(395, 320)">
                          <rect x="-20" y="-35" width="14" height="70" rx="7" fill="url(#patGrad2)" />
                          <rect x="-4" y="-35" width="14" height="70" rx="7" fill="url(#patGrad2)" />
                          <circle cx="-5" cy="0" r="8" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                          <circle cx="-13" cy="18" r="5" fill="#4C1D95" />
                          <text x="-13" y="21" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">c</text>
                        </g>
                        <g transform="translate(505, 320)">
                          <rect x="-10" y="-35" width="14" height="70" rx="7" fill="url(#matGrad2)" />
                          <rect x="6" y="-35" width="14" height="70" rx="7" fill="url(#matGrad2)" />
                          <circle cx="5" cy="0" r="8" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                          <circle cx="13" cy="18" r="5" fill="#7C2D12" />
                          <text x="13" y="21" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">C</text>
                        </g>
                      </>
                    )}

                    {/* Labels */}
                    {showLabels && (
                      <g className="text-xs font-semibold">
                        <text x="450" y="40" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="bold">
                          Equatorial (Metaphase) Plate
                        </text>
                        <line x1="200" y1="200" x2="270" y2="180" stroke="#22D3EE" strokeWidth="1.5" />
                        <circle cx="270" cy="180" r="3" fill="#22D3EE" />
                        <text x="190" y="204" textAnchor="end" fill="#22D3EE" fontSize="11" fontWeight="bold">
                          Spindle Fibre to Whole Kinetochore
                        </text>
                        <text x="450" y="450" textAnchor="middle" fill="#94A3B8" fontSize="11">
                          Independent Assortment: Orientation {assortmentOrientation} of 2 possible arrangements
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* ========================================================== */}
                {/* 4. STAGE 3: ANAPHASE I (REDUCTION DIVISION)                */}
                {/* ========================================================== */}
                {currentStageIdx === 3 && (
                  <g className="transition-all duration-700 ease-out">
                    <path
                      d="M 450 55 C 650 55, 830 110, 830 240 C 830 370, 650 425, 450 425 C 440 425, 435 410, 450 395 C 465 410, 460 425, 450 425 C 250 425, 70 370, 70 240 C 70 110, 250 55, 450 55 Z"
                      fill="url(#cellBg)"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                    />

                    {/* Furrow Indents */}
                    <path d="M 450 55 C 445 75, 445 85, 450 100" stroke="#38BDF8" strokeWidth="2" fill="none" opacity="0.7" />
                    <path d="M 450 425 C 445 405, 445 395, 450 380" stroke="#38BDF8" strokeWidth="2" fill="none" opacity="0.7" />

                    {/* Spindle poles */}
                    <circle cx="100" cy="240" r="10" fill="#06B6D4" opacity="0.9" />
                    <circle cx="800" cy="240" r="10" fill="#06B6D4" opacity="0.9" />

                    {/* Spindle fibres shortened */}
                    <line x1="100" y1="240" x2="270" y2="160" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
                    <line x1="100" y1="240" x2="280" y2="310" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
                    <line x1="800" y1="240" x2="630" y2="160" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
                    <line x1="800" y1="240" x2="620" y2="310" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />

                    {!nondisjunctionMode ? (
                      <>
                        {/* LEFT POLE: Pair 1 Maternal (1M) at x=270 */}
                        <g transform="translate(270, 160)">
                          <circle cx="-15" cy="0" r="10" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                          <path d="M -15 0 C 5 -15, 25 -25, 35 -35" stroke="url(#matGrad1)" strokeWidth="14" strokeLinecap="round" fill="none" />
                          <path d="M -15 0 C 5 15, 25 25, 35 35" stroke="url(#matGrad1)" strokeWidth="14" strokeLinecap="round" fill="none" />
                          {crossingOver && (
                            <path d="M 22 23 C 28 28, 35 35, 38 38" stroke="url(#patGrad1)" strokeWidth="14" strokeLinecap="round" fill="none" />
                          )}
                          <circle cx="-5" cy="-10" r="5" fill="#881337" />
                          <text x="-5" y="-7" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">A</text>
                        </g>

                        {/* LEFT POLE: Pair 2 Chromosome at x=280 */}
                        <g transform="translate(280, 310)">
                          <circle cx="-12" cy="0" r="8" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                          <path
                            d="M -12 0 C 2 -10, 15 -18, 24 -24"
                            stroke={assortmentOrientation === 1 ? 'url(#matGrad2)' : 'url(#patGrad2)'}
                            strokeWidth="11"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            d="M -12 0 C 2 10, 15 18, 24 24"
                            stroke={assortmentOrientation === 1 ? 'url(#matGrad2)' : 'url(#patGrad2)'}
                            strokeWidth="11"
                            strokeLinecap="round"
                            fill="none"
                          />
                        </g>

                        {/* RIGHT POLE: Pair 1 Paternal (1P) at x=630 */}
                        <g transform="translate(630, 160)">
                          <circle cx="15" cy="0" r="10" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                          <path d="M 15 0 C -5 -15, -25 -25, -35 -35" stroke="url(#patGrad1)" strokeWidth="14" strokeLinecap="round" fill="none" />
                          <path d="M 15 0 C -5 15, -25 25, -35 35" stroke="url(#patGrad1)" strokeWidth="14" strokeLinecap="round" fill="none" />
                          {crossingOver && (
                            <path d="M -22 23 C -28 28, -35 35, -38 38" stroke="url(#matGrad1)" strokeWidth="14" strokeLinecap="round" fill="none" />
                          )}
                          <circle cx="5" cy="-10" r="5" fill="#1E3A8A" />
                          <text x="5" y="-7" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">a</text>
                        </g>

                        {/* RIGHT POLE: Pair 2 Chromosome at x=620 */}
                        <g transform="translate(620, 310)">
                          <circle cx="12" cy="0" r="8" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                          <path
                            d="M 12 0 C -2 -10, -15 -18, -24 -24"
                            stroke={assortmentOrientation === 1 ? 'url(#patGrad2)' : 'url(#matGrad2)'}
                            strokeWidth="11"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            d="M 12 0 C -2 10, -15 18, -24 24"
                            stroke={assortmentOrientation === 1 ? 'url(#patGrad2)' : 'url(#matGrad2)'}
                            strokeWidth="11"
                            strokeLinecap="round"
                            fill="none"
                          />
                        </g>
                      </>
                    ) : (
                      /* NONDISJUNCTION: Both Homologues of Pair 1 go to Left Pole! */
                      <>
                        <g transform="translate(240, 140)">
                          <circle cx="-15" cy="0" r="10" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                          <path d="M -15 0 C 5 -15, 25 -25, 35 -35" stroke="url(#matGrad1)" strokeWidth="14" strokeLinecap="round" fill="none" />
                          <path d="M -15 0 C 5 15, 25 25, 35 35" stroke="url(#matGrad1)" strokeWidth="14" strokeLinecap="round" fill="none" />
                        </g>
                        <g transform="translate(300, 190)">
                          <circle cx="-15" cy="0" r="10" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                          <path d="M -15 0 C 5 -15, 25 -25, 35 -35" stroke="url(#patGrad1)" strokeWidth="14" strokeLinecap="round" fill="none" />
                          <path d="M -15 0 C 5 15, 25 25, 35 35" stroke="url(#patGrad1)" strokeWidth="14" strokeLinecap="round" fill="none" />
                        </g>
                        <g transform="translate(260, 310)">
                          <circle cx="-12" cy="0" r="8" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                          <path d="M -12 0 C 2 -10, 15 -18, 24 -24" stroke="url(#matGrad2)" strokeWidth="11" strokeLinecap="round" fill="none" />
                          <path d="M -12 0 C 2 10, 15 18, 24 24" stroke="url(#matGrad2)" strokeWidth="11" strokeLinecap="round" fill="none" />
                        </g>
                        <g transform="translate(620, 310)">
                          <circle cx="12" cy="0" r="8" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                          <path d="M 12 0 C -2 -10, -15 -18, -24 -24" stroke="url(#patGrad2)" strokeWidth="11" strokeLinecap="round" fill="none" />
                          <path d="M 12 0 C -2 10, -15 18, -24 24" stroke="url(#patGrad2)" strokeWidth="11" strokeLinecap="round" fill="none" />
                        </g>
                      </>
                    )}

                    {/* Labels */}
                    {showLabels && (
                      <g className="text-xs font-semibold">
                        <text x="450" y="455" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="bold">
                          {nondisjunctionMode
                            ? 'NON-DISJUNCTION: Homologous Pair 1 failed to separate!'
                            : 'Reduction Division: Homologous chromosomes pulled to opposite poles (Centromeres intact)'}
                        </text>
                        <text x="240" y="85" textAnchor="middle" fill="#38BDF8" fontSize="11" fontWeight="bold">
                          Haploid Set 1 (n = 2)
                        </text>
                        <text x="660" y="85" textAnchor="middle" fill="#38BDF8" fontSize="11" fontWeight="bold">
                          Haploid Set 2 (n = 2)
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* ========================================================== */}
                {/* 5. STAGE 4: TELOPHASE I & CYTOKINESIS (2 DAUGHTER CELLS)   */}
                {/* ========================================================== */}
                {currentStageIdx === 4 && (
                  <g className="transition-all duration-700 ease-out">
                    <ellipse
                      cx="275"
                      cy="240"
                      rx="185"
                      ry="185"
                      fill="url(#daughterCellBg)"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                    />

                    <ellipse
                      cx="625"
                      cy="240"
                      rx="185"
                      ry="185"
                      fill="url(#daughterCellBg)"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                    />

                    <line x1="450" y1="40" x2="450" y2="440" stroke="#0f172a" strokeWidth="10" />

                    <ellipse cx="275" cy="240" rx="120" ry="120" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
                    <ellipse cx="625" cy="240" rx="120" ry="120" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />

                    {/* Cell 1 Chromosomes */}
                    <g transform="translate(250, 210)">
                      <rect x="-18" y="-45" width="14" height="90" rx="7" fill="url(#matGrad1)" />
                      {crossingOver ? (
                        <>
                          <rect x="-2" y="-45" width="14" height="60" rx="7" fill="url(#matGrad1)" />
                          <rect x="-2" y="15" width="14" height="30" rx="5" fill="url(#patGrad1)" stroke="#38BDF8" strokeWidth="1" />
                        </>
                      ) : (
                        <rect x="-2" y="-45" width="14" height="90" rx="7" fill="url(#matGrad1)" />
                      )}
                      <circle cx="-3" cy="0" r="9" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                    </g>
                    <g transform="translate(310, 270)">
                      <rect x="-14" y="-30" width="11" height="60" rx="5.5" fill="url(#matGrad2)" />
                      <rect x="-1" y="-30" width="11" height="60" rx="5.5" fill="url(#matGrad2)" />
                      <circle cx="-2" cy="0" r="7" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                    </g>

                    {/* Cell 2 Chromosomes */}
                    <g transform="translate(600, 210)">
                      {crossingOver ? (
                        <>
                          <rect x="-18" y="-45" width="14" height="60" rx="7" fill="url(#patGrad1)" />
                          <rect x="-18" y="15" width="14" height="30" rx="5" fill="url(#matGrad1)" stroke="#FB7185" strokeWidth="1" />
                        </>
                      ) : (
                        <rect x="-18" y="-45" width="14" height="90" rx="7" fill="url(#patGrad1)" />
                      )}
                      <rect x="-2" y="-45" width="14" height="90" rx="7" fill="url(#patGrad1)" />
                      <circle cx="-3" cy="0" r="9" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                    </g>
                    <g transform="translate(660, 270)">
                      <rect x="-14" y="-30" width="11" height="60" rx="5.5" fill="url(#patGrad2)" />
                      <rect x="-1" y="-30" width="11" height="60" rx="5.5" fill="url(#patGrad2)" />
                      <circle cx="-2" cy="0" r="7" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1.5" />
                    </g>

                    {/* Labels */}
                    {showLabels && (
                      <g className="text-xs font-semibold">
                        <text x="275" y="80" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold">
                          Daughter Cell 1 · Haploid (n = 2)
                        </text>
                        <text x="625" y="80" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold">
                          Daughter Cell 2 · Haploid (n = 2)
                        </text>
                        <text x="450" y="460" textAnchor="middle" fill="#94A3B8" fontSize="11">
                          Cytokinesis I Complete · Chromosomes still have 2 chromatids
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* ========================================================== */}
                {/* 6. STAGE 5: MEIOSIS II (CENTROMERES DIVIDE & CHROMATIDS)   */}
                {/* ========================================================== */}
                {currentStageIdx === 5 && (
                  <g className="transition-all duration-700 ease-out">
                    <ellipse
                      cx="275"
                      cy="240"
                      rx="180"
                      ry="185"
                      fill="url(#daughterCellBg)"
                      stroke="#818CF8"
                      strokeWidth="2"
                    />

                    <ellipse
                      cx="625"
                      cy="240"
                      rx="180"
                      ry="185"
                      fill="url(#daughterCellBg)"
                      stroke="#818CF8"
                      strokeWidth="2"
                    />

                    {/* Spindle poles inside Cell 1 */}
                    <circle cx="275" cy="85" r="7" fill="#06B6D4" />
                    <circle cx="275" cy="395" r="7" fill="#06B6D4" />
                    <line x1="275" y1="85" x2="230" y2="160" stroke="#22D3EE" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
                    <line x1="275" y1="395" x2="230" y2="320" stroke="#22D3EE" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
                    <line x1="275" y1="85" x2="320" y2="175" stroke="#22D3EE" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
                    <line x1="275" y1="395" x2="320" y2="305" stroke="#22D3EE" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />

                    {/* Spindle poles inside Cell 2 */}
                    <circle cx="625" cy="85" r="7" fill="#06B6D4" />
                    <circle cx="625" cy="395" r="7" fill="#06B6D4" />
                    <line x1="625" y1="85" x2="580" y2="160" stroke="#22D3EE" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
                    <line x1="625" y1="395" x2="580" y2="320" stroke="#22D3EE" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
                    <line x1="625" y1="85" x2="670" y2="175" stroke="#22D3EE" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
                    <line x1="625" y1="395" x2="670" y2="305" stroke="#22D3EE" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />

                    {/* CELL 1: Sister Chromatids Separating */}
                    <g transform="translate(230, 160)">
                      <circle cx="0" cy="-6" r="7" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1" />
                      <rect x="-6" y="-3" width="12" height="42" rx="6" fill="url(#matGrad1)" />
                    </g>
                    <g transform="translate(230, 320)">
                      <circle cx="0" cy="6" r="7" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1" />
                      {crossingOver ? (
                        <>
                          <rect x="-6" y="-39" width="12" height="26" rx="5" fill="url(#matGrad1)" />
                          <rect x="-6" y="-13" width="12" height="15" rx="4" fill="url(#patGrad1)" stroke="#38BDF8" strokeWidth="0.8" />
                        </>
                      ) : (
                        <rect x="-6" y="-39" width="12" height="42" rx="6" fill="url(#matGrad1)" />
                      )}
                    </g>
                    <g transform="translate(320, 175)">
                      <circle cx="0" cy="-5" r="6" fill="url(#centromereGrad)" />
                      <rect x="-5" y="-2" width="10" height="28" rx="5" fill="url(#matGrad2)" />
                    </g>
                    <g transform="translate(320, 305)">
                      <circle cx="0" cy="5" r="6" fill="url(#centromereGrad)" />
                      <rect x="-5" y="-26" width="10" height="28" rx="5" fill="url(#matGrad2)" />
                    </g>

                    {/* CELL 2: Sister Chromatids Separating */}
                    <g transform="translate(580, 160)">
                      <circle cx="0" cy="-6" r="7" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1" />
                      {crossingOver ? (
                        <>
                          <rect x="-6" y="-3" width="12" height="26" rx="5" fill="url(#patGrad1)" />
                          <rect x="-6" y="23" width="12" height="16" rx="4" fill="url(#matGrad1)" stroke="#FB7185" strokeWidth="0.8" />
                        </>
                      ) : (
                        <rect x="-6" y="-3" width="12" height="42" rx="6" fill="url(#patGrad1)" />
                      )}
                    </g>
                    <g transform="translate(580, 320)">
                      <circle cx="0" cy="6" r="7" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1" />
                      <rect x="-6" y="-39" width="12" height="42" rx="6" fill="url(#patGrad1)" />
                    </g>
                    <g transform="translate(670, 175)">
                      <circle cx="0" cy="-5" r="6" fill="url(#centromereGrad)" />
                      <rect x="-5" y="-2" width="10" height="28" rx="5" fill="url(#patGrad2)" />
                    </g>
                    <g transform="translate(670, 305)">
                      <circle cx="0" cy="5" r="6" fill="url(#centromereGrad)" />
                      <rect x="-5" y="-26" width="10" height="28" rx="5" fill="url(#patGrad2)" />
                    </g>

                    {/* Labels */}
                    {showLabels && (
                      <g className="text-xs font-semibold">
                        <text x="450" y="50" textAnchor="middle" fill="#F43F5E" fontSize="13" fontWeight="bold">
                          Centromeres Divide (Anaphase II) · Sister Chromatids Segregate
                        </text>
                        <text x="450" y="455" textAnchor="middle" fill="#94A3B8" fontSize="11">
                          Equational Division: Each chromatid is now an independent daughter chromosome
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* ========================================================== */}
                {/* 7. STAGE 6: TELOPHASE II (4 HAPLOID GAMETES RESULT)        */}
                {/* ========================================================== */}
                {currentStageIdx === 6 && (
                  <g className="transition-all duration-700 ease-out">
                    {/* GAMETE 1 */}
                    <g
                      transform="translate(130, 240)"
                      className="cursor-pointer"
                      onClick={() => setInspectedStructure('haploid_gamete')}
                    >
                      <circle cx="0" cy="0" r="95" fill="url(#gameteBg)" stroke="#10B981" strokeWidth="2.5" />
                      <ellipse cx="0" cy="0" rx="70" ry="70" fill="none" stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                      <g transform="translate(-18, -5)">
                        <rect x="-6" y="-38" width="12" height="76" rx="6" fill="url(#matGrad1)" />
                        <circle cx="0" cy="0" r="7" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1" />
                        <circle cx="0" cy="-20" r="5" fill="#881337" />
                        <text x="0" y="-17" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">A</text>
                        <circle cx="0" cy="20" r="5" fill="#881337" />
                        <text x="0" y="23" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">B</text>
                      </g>
                      <g transform="translate(18, 10)">
                        <rect x="-5" y="-25" width="10" height="50" rx="5" fill="url(#matGrad2)" />
                        <circle cx="0" cy="0" r="6" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1" />
                        <circle cx="0" cy="14" r="4.5" fill="#7C2D12" />
                        <text x="0" y="17" textAnchor="middle" fontSize="6" fill="#FFF" fontWeight="bold">C</text>
                      </g>
                      <rect x="-70" y="108" width="140" height="42" rx="8" fill="#064e3b" stroke="#059669" strokeWidth="1" />
                      <text x="0" y="124" textAnchor="middle" fill="#A7F3D0" fontSize="11" fontWeight="bold">
                        Gamete 1 · Parental
                      </text>
                      <text x="0" y="140" textAnchor="middle" fill="#E2E8F0" fontSize="10" className="font-mono">
                        [A-B, C] · n = 2
                      </text>
                    </g>

                    {/* GAMETE 2 */}
                    <g
                      transform="translate(345, 240)"
                      className="cursor-pointer"
                      onClick={() => setInspectedStructure('recombinant_chromatid')}
                    >
                      <circle
                        cx="0"
                        cy="0"
                        r="95"
                        fill="url(#gameteBg)"
                        stroke={crossingOver ? '#A855F7' : '#10B981'}
                        strokeWidth="2.5"
                      />
                      <ellipse cx="0" cy="0" rx="70" ry="70" fill="none" stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                      <g transform="translate(-18, -5)">
                        {crossingOver ? (
                          <>
                            <rect x="-6" y="-38" width="12" height="50" rx="6" fill="url(#matGrad1)" />
                            <rect x="-6" y="12" width="12" height="26" rx="5" fill="url(#patGrad1)" stroke="#38BDF8" strokeWidth="0.8" />
                            <circle cx="0" cy="0" r="7" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1" />
                            <circle cx="0" cy="-20" r="5" fill="#881337" />
                            <text x="0" y="-17" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">A</text>
                            <circle cx="0" cy="24" r="5" fill="#1E3A8A" />
                            <text x="0" y="27" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">b</text>
                          </>
                        ) : (
                          <>
                            <rect x="-6" y="-38" width="12" height="76" rx="6" fill="url(#matGrad1)" />
                            <circle cx="0" cy="0" r="7" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1" />
                            <circle cx="0" cy="-20" r="5" fill="#881337" />
                            <text x="0" y="-17" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">A</text>
                            <circle cx="0" cy="20" r="5" fill="#881337" />
                            <text x="0" y="23" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">B</text>
                          </>
                        )}
                      </g>
                      <g transform="translate(18, 10)">
                        <rect x="-5" y="-25" width="10" height="50" rx="5" fill="url(#matGrad2)" />
                        <circle cx="0" cy="0" r="6" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1" />
                        <circle cx="0" cy="14" r="4.5" fill="#7C2D12" />
                        <text x="0" y="17" textAnchor="middle" fontSize="6" fill="#FFF" fontWeight="bold">C</text>
                      </g>
                      <rect
                        x="-70"
                        y="108"
                        width="140"
                        height="42"
                        rx="8"
                        fill={crossingOver ? '#4c1d95' : '#064e3b'}
                        stroke={crossingOver ? '#8B5CF6' : '#059669'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="124"
                        textAnchor="middle"
                        fill={crossingOver ? '#E9D5FF' : '#A7F3D0'}
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {crossingOver ? 'Gamete 2 · RECOMBINANT' : 'Gamete 2 · Parental (Clone)'}
                      </text>
                      <text x="0" y="140" textAnchor="middle" fill="#E2E8F0" fontSize="10" className="font-mono">
                        {crossingOver ? '[A-b, C] · n = 2' : '[A-B, C] · n = 2'}
                      </text>
                    </g>

                    {/* GAMETE 3 */}
                    <g
                      transform="translate(555, 240)"
                      className="cursor-pointer"
                      onClick={() => setInspectedStructure('recombinant_chromatid')}
                    >
                      <circle
                        cx="0"
                        cy="0"
                        r="95"
                        fill="url(#gameteBg)"
                        stroke={crossingOver ? '#A855F7' : '#10B981'}
                        strokeWidth="2.5"
                      />
                      <ellipse cx="0" cy="0" rx="70" ry="70" fill="none" stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                      <g transform="translate(-18, -5)">
                        {crossingOver ? (
                          <>
                            <rect x="-6" y="-38" width="12" height="50" rx="6" fill="url(#patGrad1)" />
                            <rect x="-6" y="12" width="12" height="26" rx="5" fill="url(#matGrad1)" stroke="#FB7185" strokeWidth="0.8" />
                            <circle cx="0" cy="0" r="7" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1" />
                            <circle cx="0" cy="-20" r="5" fill="#1E3A8A" />
                            <text x="0" y="-17" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">a</text>
                            <circle cx="0" cy="24" r="5" fill="#881337" />
                            <text x="0" y="27" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">B</text>
                          </>
                        ) : (
                          <>
                            <rect x="-6" y="-38" width="12" height="76" rx="6" fill="url(#patGrad1)" />
                            <circle cx="0" cy="0" r="7" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1" />
                            <circle cx="0" cy="-20" r="5" fill="#1E3A8A" />
                            <text x="0" y="-17" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">a</text>
                            <circle cx="0" cy="20" r="5" fill="#1E3A8A" />
                            <text x="0" y="23" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">b</text>
                          </>
                        )}
                      </g>
                      <g transform="translate(18, 10)">
                        <rect x="-5" y="-25" width="10" height="50" rx="5" fill="url(#patGrad2)" />
                        <circle cx="0" cy="0" r="6" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1" />
                        <circle cx="0" cy="14" r="4.5" fill="#4C1D95" />
                        <text x="0" y="17" textAnchor="middle" fontSize="6" fill="#FFF" fontWeight="bold">c</text>
                      </g>
                      <rect
                        x="-70"
                        y="108"
                        width="140"
                        height="42"
                        rx="8"
                        fill={crossingOver ? '#4c1d95' : '#064e3b'}
                        stroke={crossingOver ? '#8B5CF6' : '#059669'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="124"
                        textAnchor="middle"
                        fill={crossingOver ? '#E9D5FF' : '#A7F3D0'}
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {crossingOver ? 'Gamete 3 · RECOMBINANT' : 'Gamete 3 · Parental'}
                      </text>
                      <text x="0" y="140" textAnchor="middle" fill="#E2E8F0" fontSize="10" className="font-mono">
                        {crossingOver ? '[a-B, c] · n = 2' : '[a-b, c] · n = 2'}
                      </text>
                    </g>

                    {/* GAMETE 4 */}
                    <g
                      transform="translate(770, 240)"
                      className="cursor-pointer"
                      onClick={() => setInspectedStructure('haploid_gamete')}
                    >
                      <circle cx="0" cy="0" r="95" fill="url(#gameteBg)" stroke="#10B981" strokeWidth="2.5" />
                      <ellipse cx="0" cy="0" rx="70" ry="70" fill="none" stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                      <g transform="translate(-18, -5)">
                        <rect x="-6" y="-38" width="12" height="76" rx="6" fill="url(#patGrad1)" />
                        <circle cx="0" cy="0" r="7" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1" />
                        <circle cx="0" cy="-20" r="5" fill="#1E3A8A" />
                        <text x="0" y="-17" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">a</text>
                        <circle cx="0" cy="20" r="5" fill="#1E3A8A" />
                        <text x="0" y="23" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="bold">b</text>
                      </g>
                      <g transform="translate(18, 10)">
                        <rect x="-5" y="-25" width="10" height="50" rx="5" fill="url(#patGrad2)" />
                        <circle cx="0" cy="0" r="6" fill="url(#centromereGrad)" stroke="#EAB308" strokeWidth="1" />
                        <circle cx="0" cy="14" r="4.5" fill="#4C1D95" />
                        <text x="0" y="17" textAnchor="middle" fontSize="6" fill="#FFF" fontWeight="bold">c</text>
                      </g>
                      <rect x="-70" y="108" width="140" height="42" rx="8" fill="#064e3b" stroke="#059669" strokeWidth="1" />
                      <text x="0" y="124" textAnchor="middle" fill="#A7F3D0" fontSize="11" fontWeight="bold">
                        Gamete 4 · Parental
                      </text>
                      <text x="0" y="140" textAnchor="middle" fill="#E2E8F0" fontSize="10" className="font-mono">
                        [a-b, c] · n = 2
                      </text>
                    </g>

                    {/* Labels */}
                    {showLabels && (
                      <g className="text-xs font-semibold">
                        <text x="450" y="45" textAnchor="middle" fill="#10B981" fontSize="14" fontWeight="bold">
                          {crossingOver
                            ? '4 UNIQUE HAPLOID GAMETES PRODUCED (100% Variation Across 4 Cells)'
                            : 'ONLY 2 UNIQUE COMBINATIONS (Duplicates without Crossing Over)'}
                        </text>
                      </g>
                    )}
                  </g>
                )}
              </svg>
            </div>

            {/* Bottom Quick Status Bar inside Canvas */}
            <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 text-slate-300">
                <span>
                  Chromosomes: <strong className="text-white font-mono">{stage.chrCount}</strong>
                </span>
                <span>
                  Chromatids: <strong className="text-white font-mono">{stage.chromatidCount}</strong>
                </span>
                <span>
                  Ploidy: <strong className="text-indigo-400 font-mono">{stage.ploidy}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Homologues:</span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Maternal (1M)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Paternal (1P)
                </span>
              </div>
            </div>
          </div>

          {/* 3. SIMULATION CONTROLS TOOLBAR */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Primary Stepper Buttons */}
            <div className="md:col-span-6 bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={handlePrevStage}
                disabled={currentStageIdx === 0}
                className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Stage</span>
              </button>

              <button
                onClick={() => setIsPlaying((p) => !p)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition shadow-md cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause Walkthrough' : 'Auto Play'}</span>
              </button>

              <button
                onClick={handleNextStage}
                disabled={currentStageIdx === MEIOSIS_STAGES.length - 1}
                className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white transition shadow-sm cursor-pointer"
              >
                <span>Next Stage</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                title="Reset to Interphase"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Scientific Toggles (Crossing Over & Assortment) */}
            <div className="md:col-span-6 bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
              {/* Crossing Over Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">Crossing Over:</span>
                <button
                  onClick={() => setCrossingOver((c) => !c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    crossingOver
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {crossingOver ? '✓ ON (Recombinants)' : '✗ OFF (Parental Only)'}
                </button>
              </div>

              {/* Independent Assortment Toggle (Metaphase I only) */}
              {currentStageIdx === 2 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">Equator Flip:</span>
                  <button
                    onClick={() => setAssortmentOrientation((o) => (o === 1 ? 2 : 1))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Orientation {assortmentOrientation}</span>
                  </button>
                </div>
              )}

              {/* Non-Disjunction Discovery Gate */}
              {currentStageIdx === 3 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setNondisjunctionMode((m) => !m)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      nondisjunctionMode
                        ? 'bg-rose-950/70 border-rose-600 text-rose-300 ring-1 ring-rose-500'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-rose-500/50'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>{nondisjunctionMode ? 'Non-Disjunction ACTIVE' : 'Simulate Non-Disjunction'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 4. KEY MECHANISM & INSIGHT BOX */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 p-4 rounded-xl border border-indigo-500/30 shadow-md">
              <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs uppercase tracking-wide">
                <Info className="w-4 h-4" />
                <span>Key Stage Mechanism · {stage.fullName}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {stage.summary}
              </p>
              <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <span className="font-bold text-amber-400 shrink-0">KCSE Exam Insight:</span>
                <span>{stage.kcseTakeaway}</span>
              </div>
            </div>

            {/* Interactive Anatomical Inspector Card */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-indigo-400" />
                    Structure Inspector
                  </span>
                  {inspectedStructure && (
                    <button
                      onClick={() => setInspectedStructure(null)}
                      className="text-[10px] text-slate-400 hover:text-slate-200"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {inspectedStructure ? (
                  <div className="space-y-2">
                    <div
                      className="text-xs font-bold"
                      style={{ color: STRUCTURE_GLOSSARY[inspectedStructure].color }}
                    >
                      {STRUCTURE_GLOSSARY[inspectedStructure].title}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {STRUCTURE_GLOSSARY[inspectedStructure].definition}
                    </p>
                    <div className="text-[10px] text-slate-400 bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                      <strong className="text-indigo-300">KCSE Tip: </strong>
                      {STRUCTURE_GLOSSARY[inspectedStructure].kcseTip}
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 py-3 space-y-2">
                    <p>Click on any chromosome, chiasma, centromere, or gamete to reveal its cytogenetic role and KCSE exam relevance.</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Object.keys(STRUCTURE_GLOSSARY).map((k) => (
                        <button
                          key={k}
                          onClick={() => setInspectedStructure(k)}
                          className="px-2 py-0.5 rounded-md bg-slate-800/70 hover:bg-slate-700 text-[10px] text-slate-300 transition cursor-pointer"
                        >
                          {STRUCTURE_GLOSSARY[k].title.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ==================================================================== */}
      {/* 3. TAB: GENETIC VARIATION COMPARISON MATRIX                          */}
      {/* ==================================================================== */}
      {activeTab === 'matrix' && (
        <main className="p-4 sm:p-6 space-y-6">
          <div className="bg-gradient-to-r from-indigo-950/50 via-purple-950/30 to-slate-900 p-5 rounded-2xl border border-indigo-500/30">
            <h2 className="text-base sm:text-lg font-bold text-white mb-1.5 flex items-center gap-2">
              <Shuffle className="w-5 h-5 text-indigo-400" />
              Crossing Over vs Independent Assortment · Sources of Genetic Variation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sexual reproduction generates biological diversity through three core mechanisms:
              (1) Crossing over during Prophase I, (2) Independent assortment during Metaphase I, and
              (3) Random fertilization of gametes.
            </p>
          </div>

          {/* Comparative Table */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="p-4 bg-slate-800/50 border-b border-slate-700/80 flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Gamete Outcome Comparison (Our 2n = 4 Model)
              </h3>
              <span className="text-[11px] font-mono text-indigo-300">
                Formula: 2ⁿ = 2² = 4 parental combinations
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="p-3">Gamete #</th>
                    <th className="p-3">With Crossing Over (Active)</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3">Without Crossing Over (OFF)</th>
                    <th className="p-3">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-bold text-white">Gamete 1</td>
                    <td className="p-3 font-mono text-emerald-300 font-bold">[A - B, C]</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                        Parental (Maternal)
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-300">[A - B, C]</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                        Parental
                      </span>
                    </td>
                  </tr>

                  <tr className="bg-purple-950/20 hover:bg-purple-950/30 transition">
                    <td className="p-3 font-bold text-white">Gamete 2</td>
                    <td className="p-3 font-mono text-purple-300 font-bold">[A - b, C]</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-600 animate-pulse">
                        ★ RECOMBINANT (Novel)
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">[A - B, C]</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-amber-400 border border-amber-800/40">
                        Parental Clone (Duplicate)
                      </span>
                    </td>
                  </tr>

                  <tr className="bg-purple-950/20 hover:bg-purple-950/30 transition">
                    <td className="p-3 font-bold text-white">Gamete 3</td>
                    <td className="p-3 font-mono text-purple-300 font-bold">[a - B, c]</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-600 animate-pulse">
                        ★ RECOMBINANT (Novel)
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">[a - b, c]</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                        Parental
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-bold text-white">Gamete 4</td>
                    <td className="p-3 font-mono text-emerald-300 font-bold">[a - b, c]</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                        Parental (Paternal)
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-300">[a - b, c]</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-amber-400 border border-amber-800/40">
                        Parental Clone (Duplicate)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-950/70 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <span>
                Summary: Crossing Over yields <strong className="text-emerald-400">4 distinct genotypes (100% diversity)</strong> vs only <strong className="text-amber-400">2 unique genotypes</strong> without it.
              </span>
              <button
                onClick={() => {
                  setActiveTab('simulation');
                  setCurrentStageIdx(6);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View Gametes in Simulation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mathematical & Evolutionary Significance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Dna className="w-4 h-4" />
                Human Genome Combinatorics
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In humans ($2n = 46, n = 23$), independent assortment produces:
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center font-mono text-indigo-300 text-sm font-bold">
                2²³ = 8,388,608 unique gametic combinations!
              </div>
              <p className="text-xs text-slate-400">
                When random fertilization occurs ($2²³ \times 2²³$), over <strong>70 trillion</strong> diploid zygote combinations are possible, even before factoring in crossing over!
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Evolutionary Significance in KCSE
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Continuous Variation:</strong> Crossing over introduces novel phenotypic traits needed for environmental adaptation.
                </li>
                <li>
                  <strong>Raw Material for Natural Selection:</strong> Individuals with advantageous recombinant allele combinations survive and reproduce.
                </li>
                <li>
                  <strong>Purging Deleterious Mutations:</strong> Allows beneficial alleles to separate from harmful linked mutations.
                </li>
              </ul>
            </div>
          </div>
        </main>
      )}

      {/* ==================================================================== */}
      {/* 4. TAB: KCSE EXAM CHALLENGE QUIZ                                     */}
      {/* ==================================================================== */}
      {activeTab === 'quiz' && (
        <main className="p-4 sm:p-6 space-y-6">
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 p-5 rounded-2xl border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                KCSE Meiosis &amp; Genetics Mastery Quiz
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                4 Form 4 Biology exam questions evaluating cytogenetic principles, ploidy calculations, and crossing over.
              </p>
            </div>

            {showQuizResults && (
              <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Your Score</div>
                <div className="text-lg font-extrabold text-emerald-400 font-mono">
                  {quizScore} / {KCSE_MEIOSIS_QUESTIONS.length}
                </div>
              </div>
            )}
          </div>

          {/* Quiz Questions List */}
          <div className="space-y-4">
            {KCSE_MEIOSIS_QUESTIONS.map((q, idx) => {
              const selectedOption = selectedAnswers[q.id];
              return (
                <div
                  key={q.id}
                  className="bg-slate-900/90 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold text-indigo-400">
                      Question {idx + 1}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                      {q.syllabusRef}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed">
                    {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = selectedOption === opt.id;
                      const isCorrect = opt.correct;

                      let btnStyle = 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800';
                      if (showQuizResults) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200 font-semibold';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-indigo-600/30 border-indigo-500 text-white font-bold ring-1 ring-indigo-500';
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={showQuizResults}
                          onClick={() => handleAnswerSelect(q.id, opt.id)}
                          className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${btnStyle}`}
                        >
                          <span className="font-mono font-bold shrink-0">{opt.id}.</span>
                          <span className="flex-1">{opt.text}</span>
                          {showQuizResults && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          {showQuizResults && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResults && (
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 mt-2">
                      <span className="font-bold text-amber-400">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setSelectedAnswers({});
                setShowQuizResults(false);
                setQuizScore(0);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Reset Quiz
            </button>

            <button
              onClick={handleEvaluateQuiz}
              disabled={Object.keys(selectedAnswers).length < KCSE_MEIOSIS_QUESTIONS.length}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg transition cursor-pointer"
            >
              Submit &amp; Evaluate Answers
            </button>
          </div>
        </main>
      )}

      {/* 5. FOOTER & SYLLABUS REFERENCE */}
      <footer className="px-5 py-3.5 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>KCSE Form 4 Syllabus: Topic 1 (Genetics) · Meiosis, Crossing Over &amp; Variation</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Diploid Germ Cell (2n = 4)</span>
          <ArrowRight className="w-3 h-3 inline text-slate-600" />
          <span>4 Haploid Recombinant Gametes (n = 2)</span>
        </div>
      </footer>
    </div>
  );
}
