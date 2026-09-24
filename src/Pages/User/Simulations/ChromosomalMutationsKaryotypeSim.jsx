import React, { useState, useEffect, useRef } from 'react';
import {
  Dna,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Info,
  Award,
  ChevronRight,
  Activity,
  Wind,
  Layers,
  Search,
  RefreshCw,
  HelpCircle,
  Sliders
} from 'lucide-react';

// Karyotype Disorders data (KCSE Syllabus)
const KARYOTYPE_DISORDERS = [
  {
    id: 'normal_male',
    name: 'Normal Male',
    karyotypeCode: '46, XY',
    type: 'Normal Euploid (2n = 46)',
    autosomes: 44,
    sexChromosomes: 'XY',
    description: 'Typical human diploid complement with 22 pairs of homologous autosomes and heteromorphic sex chromosomes (XY).',
    clinicalSigns: 'Normal male phenotypic differentiation, intact spermatogenesis.',
    extraChrIndex: null, // chromosome number that has abnormality
    abnormalityType: 'none'
  },
  {
    id: 'normal_female',
    name: 'Normal Female',
    karyotypeCode: '46, XX',
    type: 'Normal Euploid (2n = 46)',
    autosomes: 44,
    sexChromosomes: 'XX',
    description: 'Typical human diploid complement with 22 pairs of homologous autosomes and homomorphic sex chromosomes (XX).',
    clinicalSigns: 'Normal female phenotypic differentiation and oogenesis.',
    extraChrIndex: null,
    abnormalityType: 'none'
  },
  {
    id: 'down_syndrome',
    name: 'Down Syndrome',
    karyotypeCode: '47, XX +21 / 47, XY +21',
    type: 'Autosomal Aneuploidy (Trisomy 21)',
    autosomes: 45,
    sexChromosomes: 'XY or XX',
    description: 'Presence of three copies of chromosome 21 resulting from non-disjunction during maternal or paternal meiotic anaphase I or II.',
    clinicalSigns: 'Flat facial profile, epicanthic eye folds, intellectual disability, single transverse palmar crease (simian crease), congenital heart defects.',
    extraChrIndex: 21,
    abnormalityType: 'trisomy'
  },
  {
    id: 'klinefelter_syndrome',
    name: 'Klinefelter Syndrome',
    karyotypeCode: '47, XXY',
    type: 'Sex Chromosomal Aneuploidy (Trisomy)',
    autosomes: 44,
    sexChromosomes: 'XXY',
    description: 'Presence of an extra X chromosome in a phenotypic male due to non-disjunction of sex chromosomes in parental gametogenesis.',
    clinicalSigns: 'Phenotypically male, tall stature with disproportionately long limbs, reduced facial/body hair, gynaecomastia (breast development), sterile (azoospermia), small testes.',
    extraChrIndex: 23,
    abnormalityType: 'xx_extra'
  },
  {
    id: 'turner_syndrome',
    name: 'Turner Syndrome',
    karyotypeCode: '45, XO',
    type: 'Sex Chromosomal Aneuploidy (Monosomy)',
    autosomes: 44,
    sexChromosomes: 'X (Monosomy X)',
    description: 'Loss of one sex chromosome (monosomy 2n - 1 = 45). Ovum fertilized by a nullisomic sperm or loss of paternal sex chromosome during early cleavage.',
    clinicalSigns: 'Phenotypically female, short stature, webbed neck, broad shield-like chest with widely spaced nipples, rudimentary ovaries (streak gonads), amenorrhoea, infertile.',
    extraChrIndex: 23,
    abnormalityType: 'monosomy'
  }
];

// KCSE Karyotype & Mutation Questions
const KCSE_MUTATION_QUESTIONS = [
  {
    id: 1,
    question: 'What is the precise cytogenetic difference between a gene mutation and a chromosomal mutation?',
    options: [
      { id: 'A', text: 'Gene mutations only occur in plants while chromosomal mutations only occur in animals.' },
      { id: 'B', text: 'Gene mutations involve a change in nucleotide base sequence in a single gene locus, whereas chromosomal mutations involve changes in gross structure or total number of whole chromosomes.', correct: true },
      { id: 'C', text: 'Gene mutations can be seen under a light microscope while chromosomal mutations cannot.' },
      { id: 'D', text: 'Chromosomal mutations never affect phenotype.' }
    ],
    explanation: 'Gene (point) mutations affect DNA nucleotide sequence within a gene (e.g. substitution in HbS). Chromosomal mutations affect chromosome count (aneuploidy/polyploidy) or large-scale structural rearrangement (deletion, duplication, inversion, translocation).'
  },
  {
    id: 2,
    question: 'Sickle cell anaemia is caused by a point mutation on the beta-globin gene. Identify the exact base substitution and resultant amino acid change:',
    options: [
      { id: 'A', text: 'AAG to AAA replacing lysine with arginine' },
      { id: 'B', text: 'GAG substituted to GTG, replacing glutamic acid with valine at position 6', correct: true },
      { id: 'C', text: 'TGA substituted to TAA creating premature stop codon' },
      { id: 'D', text: 'CCT substituted to ACT replacing proline with threonine' }
    ],
    explanation: 'On the DNA coding strand of the beta-globin gene, codon 6 changes from GAG (coding for hydrophilic glutamic acid) to GTG (mRNA GUG, coding for hydrophobic valine). Under low pO2, HbS molecules polymerize into rigid crystalline fibres.'
  },
  {
    id: 3,
    question: 'During which stage of cell division does non-disjunction leading to trisomy 21 (Down syndrome) primarily occur?',
    options: [
      { id: 'A', text: 'Prophase of mitosis' },
      { id: 'B', text: 'Anaphase I or Anaphase II of meiosis when homologous chromosomes or sister chromatids fail to segregate', correct: true },
      { id: 'C', text: 'Interphase G1 phase' },
      { id: 'D', text: 'Telophase II cytokinesis' }
    ],
    explanation: 'Non-disjunction occurs when spindle fibres fail to pull homologous chromosome pairs (Anaphase I) or sister chromatids (Anaphase II) to opposite poles, yielding gametes with n+1 or n-1 chromosomes.'
  },
  {
    id: 4,
    question: 'An individual with karyotype 47, XXY exhibits male secondary characteristics but develops gynaecomastia and is sterile. Diagnose this condition:',
    options: [
      { id: 'A', text: 'Turner Syndrome' },
      { id: 'B', text: 'Klinefelter Syndrome', correct: true },
      { id: 'C', text: 'Down Syndrome' },
      { id: 'D', text: 'Supernumerary Female' }
    ],
    explanation: 'Klinefelter syndrome (47, XXY) occurs when a male inherits an extra X chromosome. Presence of Y initiates testicular development, but double dosage of X-linked genes results in hypogonadism, azoospermia, and gynaecomastia.'
  }
];

export default function ChromosomalMutationsKaryotypeSim({ onTelemetry }) {
  const [activeTab, setActiveTab] = useState('karyotype'); // 'karyotype' | 'sickle' | 'quiz'
  
  // Karyotype state
  const [selectedDisorderId, setSelectedDisorderId] = useState('down_syndrome');
  const [userGuess, setUserGuess] = useState('');
  const [karyotypeFeedback, setKaryotypeFeedback] = useState(null);
  const [highlightedChr, setHighlightedChr] = useState(null);

  // Sickle Cell Point Mutation & Hypoxia Simulation State
  const [oxygenLevel, setOxygenLevel] = useState(95); // % pO2
  const [showPolymerization, setShowPolymerization] = useState(false);
  const [mutationTypeView, setMutationTypeView] = useState('hba'); // 'hba' (normal) | 'hbs' (sickle)

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const activeDisorder = KARYOTYPE_DISORDERS.find(d => d.id === selectedDisorderId);

  // Handle karyotype diagnosis check
  const handleVerifyKaryotype = () => {
    if (!userGuess) return;
    const isCorrect = userGuess === activeDisorder.id;
    setKaryotypeFeedback({
      correct: isCorrect,
      msg: isCorrect
        ? `Correct diagnosis! Karyotype formula: ${activeDisorder.karyotypeCode}. Diagnosis: ${activeDisorder.name}.`
        : `Incorrect diagnosis. Closely analyze chromosome 21 and the sex chromosome pair (23). Expected: ${activeDisorder.name}.`
    });

    if (isCorrect && onTelemetry) {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'chromosomal_mutations_karyotype_sim',
        checkpoint: 'karyotype_diagnosis_correct',
        disorder: activeDisorder.id
      });
    }
  };

  const handleResetKaryotype = () => {
    setUserGuess('');
    setKaryotypeFeedback(null);
    setHighlightedChr(null);
  };

  // Quiz handlers
  const handleSelectQuizOption = (optId) => {
    if (quizSubmitted) return;
    setSelectedAnswer(optId);
  };

  const handleSubmitQuiz = () => {
    if (!selectedAnswer || quizSubmitted) return;
    setQuizSubmitted(true);
    const q = KCSE_MUTATION_QUESTIONS[quizIndex];
    const isCorrect = q.options.find(o => o.id === selectedAnswer)?.correct;
    if (isCorrect) setQuizScore(prev => prev + 1);
  };

  const handleNextQuiz = () => {
    if (quizIndex + 1 < KCSE_MUTATION_QUESTIONS.length) {
      setQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setQuizSubmitted(false);
    } else {
      setQuizFinished(true);
      if (onTelemetry) {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'chromosomal_mutations_karyotype_sim',
          checkpoint: 'mutations_quiz_completed',
          score: quizScore + (KCSE_MUTATION_QUESTIONS[quizIndex].options.find(o => o.id === selectedAnswer)?.correct ? 1 : 0)
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  // Helper to render chromosome pair / set
  const renderChromosomePair = (num) => {
    // Determine count of chromatids/chromosomes for this slot
    let count = 2; // normal diploid
    let isAbnormal = false;

    if (num === 21 && activeDisorder.abnormalityType === 'trisomy') {
      count = 3;
      isAbnormal = true;
    } else if (num === 23) {
      // Sex chromosomes
      if (activeDisorder.abnormalityType === 'monosomy') {
        count = 1; // XO
        isAbnormal = true;
      } else if (activeDisorder.abnormalityType === 'xx_extra') {
        count = 3; // XXY
        isAbnormal = true;
      } else {
        count = 2; // XY or XX
      }
    }

    // Relative height based on chromosome size (1 is largest ~46px, 22 is smallest ~22px)
    const height = num === 23 ? 38 : Math.max(22, Math.round(48 - num * 1.15));

    return (
      <div
        key={num}
        onClick={() => setHighlightedChr(num)}
        className={`p-2 rounded-lg border flex flex-col items-center justify-between cursor-pointer transition-all duration-200 ${
          isAbnormal
            ? 'bg-rose-950/40 border-rose-500/80 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse'
            : highlightedChr === num
            ? 'bg-indigo-950/40 border-indigo-400'
            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
        }`}
      >
        {/* Chromosome visual representation */}
        <div className="flex items-end justify-center gap-1.5 h-14 pb-1">
          {[...Array(count)].map((_, idx) => {
            const isY = num === 23 && (
              (activeDisorder.id === 'normal_male' && idx === 1) ||
              (activeDisorder.id === 'klinefelter_syndrome' && idx === 2) ||
              (activeDisorder.id === 'down_syndrome' && idx === 1)
            );
            const chrHeight = isY ? 20 : height;

            return (
              <div
                key={idx}
                className="flex flex-col items-center group relative"
                style={{ height: `${chrHeight}px` }}
              >
                {/* Upper arm (p-arm) */}
                <div
                  className={`w-2.5 rounded-t-sm border border-slate-900 ${
                    isAbnormal ? 'bg-rose-500' : isY ? 'bg-amber-500' : 'bg-indigo-400'
                  }`}
                  style={{ height: `${chrHeight * 0.42}px` }}
                >
                  {/* Banding patterns */}
                  <div className="w-full h-1 bg-slate-900/50 mt-1"></div>
                </div>
                {/* Centromere constriction */}
                <div className="w-1.5 h-1 bg-slate-950 rounded-full my-[0.5px]"></div>
                {/* Lower arm (q-arm) */}
                <div
                  className={`w-2.5 rounded-b-sm border border-slate-900 ${
                    isAbnormal ? 'bg-rose-500' : isY ? 'bg-amber-500' : 'bg-indigo-400'
                  }`}
                  style={{ height: `${chrHeight * 0.58}px` }}
                >
                  {/* Banding patterns */}
                  <div className="w-full h-1 bg-slate-900/50 mt-1.5"></div>
                  <div className="w-full h-1 bg-slate-900/50 mt-1"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Label */}
        <span className="text-[10px] font-mono font-bold text-slate-300">
          {num === 23 ? (
            <span className={isAbnormal ? 'text-rose-400' : 'text-amber-300'}>
              {activeDisorder.sexChromosomes}
            </span>
          ) : (
            `#${num}`
          )}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-6xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1">
              <Dna className="w-3.5 h-3.5 text-indigo-400" /> KCSE Form 4 Biology • Topic 2
            </span>
            <span className="text-slate-500 text-xs">• Gene vs Chromosomal Mutations</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
            Chromosomal Mutations & Karyotype Analyzer
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Metaphase karyotyping of clinical non-disjunctions, Sickle cell point mutation, and hypoxic RBC sickling.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 gap-1 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('karyotype')}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'karyotype'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" /> Karyotype Board
          </button>
          <button
            onClick={() => setActiveTab('sickle')}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sickle'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" /> Point Mutation & Sickling
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" /> KCSE Quiz
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-6xl flex flex-col gap-6">
        {/* ================= TAB 1: KARYOTYPE BOARD ================= */}
        {activeTab === 'karyotype' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Metaphase Karyotype Grid */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Patient Karyotype Case:
                    </span>
                    <select
                      value={selectedDisorderId}
                      onChange={(e) => {
                        setSelectedDisorderId(e.target.value);
                        handleResetKaryotype();
                      }}
                      className="bg-slate-950 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="down_syndrome">Case Alpha: Amniocentesis Sample (Down)</option>
                      <option value="turner_syndrome">Case Beta: Endocrine Clinic Sample (Turner)</option>
                      <option value="klinefelter_syndrome">Case Gamma: Infertility Clinic Sample (Klinefelter)</option>
                      <option value="normal_male">Case Delta: Routine Screening (Normal Male)</option>
                      <option value="normal_female">Case Epsilon: Routine Screening (Normal Female)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (activeDisorder.extraChrIndex) {
                        setHighlightedChr(activeDisorder.extraChrIndex);
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
                  >
                    <Search className="w-3.5 h-3.5" /> Highlight Anomaly
                  </button>
                </div>

                {/* Karyotype Grid 23 items: 1-22 autosomes + 23 sex chromosomes */}
                <div className="my-5 p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-mono">
                    <span>GIEMSA-STAINED METAPHASE CHROMOSOME SPREAD (G-BANDING)</span>
                    <span className="text-indigo-400">Total Count: {activeDisorder.autosomes + (activeDisorder.abnormalityType === 'monosomy' ? 1 : activeDisorder.abnormalityType === 'xx_extra' ? 3 : 2)}</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
                    {[...Array(22)].map((_, i) => renderChromosomePair(i + 1))}
                    {/* Pair 23: Sex Chromosomes */}
                    {renderChromosomePair(23)}
                  </div>
                </div>

                {/* Diagnosis Interactive Bar */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-400">
                      Submit Formal Cytogenetic Diagnosis:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Identify whether the anomaly represents an autosomal or sex-linked non-disjunction.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <select
                      value={userGuess}
                      onChange={(e) => setUserGuess(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 md:flex-none"
                    >
                      <option value="">Select Syndrome...</option>
                      {KARYOTYPE_DISORDERS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.karyotypeCode})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleVerifyKaryotype}
                      disabled={!userGuess}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow ${
                        !userGuess
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      Diagnose
                    </button>
                  </div>
                </div>

                {/* Feedback Panel */}
                {karyotypeFeedback && (
                  <div
                    className={`mt-4 p-4 rounded-xl border flex items-start gap-3 ${
                      karyotypeFeedback.correct
                        ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                    }`}
                  >
                    {karyotypeFeedback.correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs space-y-2">
                      <p className="font-semibold text-sm">{karyotypeFeedback.msg}</p>
                      <div className="text-slate-300 space-y-1">
                        <p><strong className="text-white">Classification:</strong> {activeDisorder.type}</p>
                        <p><strong className="text-white">Mechanism:</strong> {activeDisorder.description}</p>
                        <p><strong className="text-white">Clinical Manifestations (KCSE):</strong> {activeDisorder.clinicalSigns}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Biological Summary Card */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-indigo-400" />
                  KCSE Chromosomal Non-Disjunction
                </h3>
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-semibold text-indigo-300 block mb-1">
                      Definition:
                    </span>
                    Failure of homologous chromosomes or sister chromatids to separate properly during Anaphase I or II of meiosis, resulting in aneuploid gametes.
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-semibold text-rose-400 block mb-1">
                      Trisomy 21 (Down Syndrome):
                    </span>
                    Individual has 47 chromosomes with 3 copies of autosome 21 (2n + 1). Often correlated with advanced maternal age.
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-semibold text-amber-400 block mb-1">
                      Monosomy X (Turner Syndrome):
                    </span>
                    Individual has 45 chromosomes (45, XO). The only viable human monosomy. Phenotypically female with sterile streak ovaries.
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-semibold text-purple-400 block mb-1">
                      Klinefelter (47, XXY):
                    </span>
                    Male phenotype with extra X chromosome. Results in hypogonadism, azoospermia, and gynaecomastia due to hormonal imbalance.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: POINT MUTATION & SICKLE CELL HYPOXIA ================= */}
        {activeTab === 'sickle' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  Gene Point Mutation: Normal HbA vs Sickle Cell HbS
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Base substitution mutation at codon 6 of the β-globin gene and dynamic erythrocyte sickling under low oxygen tension.
                </p>
              </div>

              {/* Mode switch */}
              <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-lg text-xs">
                <button
                  onClick={() => setMutationTypeView('hba')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    mutationTypeView === 'hba'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Normal Allele (HbA)
                </button>
                <button
                  onClick={() => setMutationTypeView('hbs')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    mutationTypeView === 'hbs'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mutant Allele (HbS)
                </button>
              </div>
            </div>

            {/* DNA, mRNA, and Amino Acid Sequence Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-5 rounded-xl border border-slate-800">
              {/* Normal Beta-Globin Gene (HbA) */}
              <div className={`p-4 rounded-xl border transition-all ${
                mutationTypeView === 'hba' ? 'border-indigo-500/80 bg-indigo-950/20' : 'border-slate-800 bg-slate-900/40 opacity-70'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-indigo-300">Normal β-Globin Gene (HbA)</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono border border-indigo-800">
                    Wild Type
                  </span>
                </div>
                <div className="font-mono text-xs space-y-2 text-slate-300 mt-3">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">DNA Coding Strand (Codons 4-7):</span>
                    <span className="text-slate-400">ACT CCT </span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-700">GAG</span>
                    <span className="text-slate-400"> AAG</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">mRNA Transcript:</span>
                    <span className="text-slate-400">ACU CCU </span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-700">GAG</span>
                    <span className="text-slate-400"> AAG</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Amino Acid Polypeptide:</span>
                    <span className="text-slate-400">Thr - Pro - </span>
                    <span className="text-emerald-400 font-bold">Glutamic Acid (Hydrophilic)</span>
                    <span className="text-slate-400"> - Lys</span>
                  </div>
                </div>
              </div>

              {/* Mutant Sickle Gene (HbS) */}
              <div className={`p-4 rounded-xl border transition-all ${
                mutationTypeView === 'hbs' ? 'border-rose-500/80 bg-rose-950/20' : 'border-slate-800 bg-slate-900/40 opacity-70'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-rose-300">Sickle β-Globin Gene (HbS)</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono border border-rose-800">
                    Base Substitution (A → T)
                  </span>
                </div>
                <div className="font-mono text-xs space-y-2 text-slate-300 mt-3">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">DNA Coding Strand (Codons 4-7):</span>
                    <span className="text-slate-400">ACT CCT </span>
                    <span className="text-rose-400 font-bold bg-rose-950/80 px-1 py-0.5 rounded border border-rose-700">GTG</span>
                    <span className="text-slate-400"> AAG</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">mRNA Transcript:</span>
                    <span className="text-slate-400">ACU CCU </span>
                    <span className="text-rose-400 font-bold bg-rose-950/80 px-1 py-0.5 rounded border border-rose-700">GUG</span>
                    <span className="text-slate-400"> AAG</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Amino Acid Polypeptide:</span>
                    <span className="text-slate-400">Thr - Pro - </span>
                    <span className="text-rose-400 font-bold">Valine (Hydrophobic)</span>
                    <span className="text-slate-400"> - Lys</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Oxygen Tension Slider & Real-time Red Blood Cell Morphing Simulation */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    Arterial / Capillary Oxygen Tension (pO₂):
                  </h3>
                  <span className="text-xs text-slate-400">
                    Adjust oxygen saturation to simulate pulmonary alveoli vs exercising systemic tissues.
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="15"
                    max="100"
                    value={oxygenLevel}
                    onChange={(e) => setOxygenLevel(Number(e.target.value))}
                    className="w-48 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="font-mono text-sm font-bold text-cyan-300 w-16 text-right">
                    {oxygenLevel}% O₂
                  </span>
                </div>
              </div>

              {/* Erythrocyte Visualizer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual Canvas Representation */}
                <div className="h-56 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400">
                    CELLULAR MORPHOLOGY SIMULATION
                  </div>

                  {/* Red Blood Cell SVG representation */}
                  {(() => {
                    const isSickled = mutationTypeView === 'hbs' && oxygenLevel < 55;
                    const sicklingSeverity = Math.max(0, (55 - oxygenLevel) / 40);

                    return (
                      <div className="relative flex items-center justify-center transition-all duration-700">
                        {/* Microscopic Capillary Vessel walls */}
                        <div className="absolute -inset-16 border-y-2 border-dashed border-rose-950/40 pointer-events-none"></div>

                        {/* RBC SVG Shape */}
                        <svg width="200" height="150" viewBox="0 0 200 150" className="transition-all duration-700">
                          <defs>
                            <radialGradient id="rbcGradNormal" cx="40%" cy="40%" r="60%">
                              <stop offset="0%" stopColor="#f87171" />
                              <stop offset="60%" stopColor="#dc2626" />
                              <stop offset="100%" stopColor="#991b1b" />
                            </radialGradient>
                            <radialGradient id="rbcGradSickle" cx="30%" cy="30%" r="70%">
                              <stop offset="0%" stopColor="#fb7185" />
                              <stop offset="70%" stopColor="#e11d48" />
                              <stop offset="100%" stopColor="#881337" />
                            </radialGradient>
                          </defs>

                          {isSickled ? (
                            /* Sickled Crescent Shape */
                            <path
                              d={`M 50,40 Q 150,${20 + sicklingSeverity * 20} 150,110 Q 90,${
                                60 + sicklingSeverity * 30
                              } 50,40 Z`}
                              fill="url(#rbcGradSickle)"
                              stroke="#4c0519"
                              strokeWidth="3"
                              className="drop-shadow-[0_10px_15px_rgba(225,29,72,0.4)] transition-all duration-500"
                            />
                          ) : (
                            /* Normal Biconcave Disc (Orthogonal view) */
                            <g>
                              <ellipse
                                cx="100"
                                cy="75"
                                rx="70"
                                ry="45"
                                fill="url(#rbcGradNormal)"
                                stroke="#7f1d1d"
                                strokeWidth="3"
                                className="drop-shadow-[0_10px_15px_rgba(220,38,38,0.4)]"
                              />
                              {/* Central Biconcave indentation */}
                              <ellipse
                                cx="100"
                                cy="75"
                                rx="32"
                                ry="18"
                                fill="#991b1b"
                                opacity="0.6"
                              />
                            </g>
                          )}
                        </svg>

                        {/* Capillary blockage indicator */}
                        {isSickled && (
                          <div className="absolute bottom-2 text-center text-xs font-bold text-rose-400 bg-slate-950/80 px-3 py-1 rounded-full border border-rose-500/50">
                            Vaso-occlusive Crisis: Capillary Thrombosis!
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Explanation text */}
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-white block mb-1">Observation:</strong>
                    {mutationTypeView === 'hba' ? (
                      <p>
                        Normal HbA erythrocytes retain flexible <strong>biconcave disc</strong> shape across all oxygen concentrations, squeezing smoothly through capillaries with a diameter as narrow as 5 μm.
                      </p>
                    ) : oxygenLevel >= 55 ? (
                      <p>
                        At high oxygen tension (arterial blood ~95%), mutant HbS molecules remain soluble and oxygenated. Erythrocytes retain normal morphology.
                      </p>
                    ) : (
                      <p className="text-rose-300">
                        Under hypoxia (&lt;55% pO₂), hydrophobic <strong>valine</strong> interacts with adjacent hydrophobic pockets on deoxygenated β-globin chains. HbS molecules polymerize into rigid fibrous crystals, twisting erythrocytes into rigid <strong>crescent / sickle shapes</strong>, precipitating haemolysis and severe vaso-occlusive pain crises.
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px]">
                    <div>Erythrocyte Flexibility: <span className={mutationTypeView === 'hbs' && oxygenLevel < 55 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{mutationTypeView === 'hbs' && oxygenLevel < 55 ? 'RIGID / FRAGILE' : 'FLEXIBLE'}</span></div>
                    <div>Oxygen Delivery: <span className="text-cyan-300">{oxygenLevel}% Saturation</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: KCSE QUIZ ================= */}
        {activeTab === 'quiz' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  KCSE Biology Exam Challenge Quiz: Mutations
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluates mastery of gene mutations, chromosomal aneuploidy, and clinical syndromes.
                </p>
              </div>
              <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-amber-400">
                Score: {quizScore} / {KCSE_MUTATION_QUESTIONS.length}
              </div>
            </div>

            {!quizFinished ? (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Question {quizIndex + 1} of {KCSE_MUTATION_QUESTIONS.length}</span>
                  <span className="text-indigo-400 font-semibold">Form 4 Standard</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm font-medium text-white leading-relaxed">
                  {KCSE_MUTATION_QUESTIONS[quizIndex].question}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {KCSE_MUTATION_QUESTIONS[quizIndex].options.map((option) => {
                    const isSelected = selectedAnswer === option.id;
                    const isCorrect = option.correct;
                    let style = 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-850 hover:border-slate-700';

                    if (quizSubmitted) {
                      if (isCorrect) {
                        style = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        style = 'bg-rose-950/50 border-rose-500 text-rose-200';
                      }
                    } else if (isSelected) {
                      style = 'bg-indigo-900/30 border-indigo-500 text-white font-semibold ring-1 ring-indigo-500';
                    }

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectQuizOption(option.id)}
                        className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${style}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-xs">
                            {option.id}
                          </span>
                          <span>{option.text}</span>
                        </div>
                        {quizSubmitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        {quizSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs leading-relaxed">
                    <span className="font-bold text-indigo-400 block mb-1">KCSE Marking Scheme Explanation:</span>
                    <p className="text-slate-300">{KCSE_MUTATION_QUESTIONS[quizIndex].explanation}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-2">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={!selectedAnswer}
                      className={`px-5 py-2 rounded-lg text-xs font-bold transition-all shadow ${
                        !selectedAnswer
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuiz}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5"
                    >
                      {quizIndex + 1 < KCSE_MUTATION_QUESTIONS.length ? 'Next Question' : 'View Final Results'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-2">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Quiz Completed!</h3>
                <p className="text-sm text-slate-400 max-w-md">
                  You scored <span className="font-bold text-indigo-400">{quizScore}</span> out of{' '}
                  <span className="font-bold text-white">{KCSE_MUTATION_QUESTIONS.length}</span> ({Math.round((quizScore / KCSE_MUTATION_QUESTIONS.length) * 100)}%).
                </p>
                <button
                  onClick={handleRestartQuiz}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow"
                >
                  <RefreshCw className="w-4 h-4" /> Retake Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
