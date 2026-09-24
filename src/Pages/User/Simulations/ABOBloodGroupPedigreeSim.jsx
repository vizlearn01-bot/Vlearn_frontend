import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronRight,
  Droplets,
  AlertCircle,
  Sparkles,
  Info,
  GitBranch,
  ShieldCheck,
  Search,
  RefreshCw
} from 'lucide-react';

// Blood Group configurations
// Alleles: IA, IB, IO (or i). Rh: Rh+ (D antigen present), Rh- (no D antigen)
const BLOOD_TYPES = [
  {
    type: 'A+',
    abo: 'A',
    rh: '+',
    genotypes: ['IᴬIᴬ Rh⁺/Rh⁺', 'IᴬIᴬ Rh⁺/Rh⁻', 'IᴬIᴼ Rh⁺/Rh⁺', 'IᴬIᴼ Rh⁺/Rh⁻'],
    antigens: ['A', 'Rh (D)'],
    antibodies: ['Anti-B'],
    agglutination: { antiA: true, antiB: false, antiD: true },
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    color: '#ef4444'
  },
  {
    type: 'A-',
    abo: 'A',
    rh: '-',
    genotypes: ['IᴬIᴬ Rh⁻/Rh⁻', 'IᴬIᴼ Rh⁻/Rh⁻'],
    antigens: ['A'],
    antibodies: ['Anti-B', 'Anti-D (if sensitized)'],
    agglutination: { antiA: true, antiB: false, antiD: false },
    canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveFrom: ['A-', 'O-'],
    color: '#f87171'
  },
  {
    type: 'B+',
    abo: 'B',
    rh: '+',
    genotypes: ['IᴮIᴮ Rh⁺/Rh⁺', 'IᴮIᴮ Rh⁺/Rh⁻', 'IᴮIᴼ Rh⁺/Rh⁺', 'IᴮIᴼ Rh⁺/Rh⁻'],
    antigens: ['B', 'Rh (D)'],
    antibodies: ['Anti-A'],
    agglutination: { antiA: false, antiB: true, antiD: true },
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    color: '#3b82f6'
  },
  {
    type: 'B-',
    abo: 'B',
    rh: '-',
    genotypes: ['IᴮIᴮ Rh⁻/Rh⁻', 'IᴮIᴼ Rh⁻/Rh⁻'],
    antigens: ['B'],
    antibodies: ['Anti-A', 'Anti-D (if sensitized)'],
    agglutination: { antiA: false, antiB: true, antiD: false },
    canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['B-', 'O-'],
    color: '#60a5fa'
  },
  {
    type: 'AB+',
    abo: 'AB',
    rh: '+',
    genotypes: ['IᴬIᴮ Rh⁺/Rh⁺', 'IᴬIᴮ Rh⁺/Rh⁻'],
    antigens: ['A', 'B', 'Rh (D)'],
    antibodies: ['None'],
    agglutination: { antiA: true, antiB: true, antiD: true },
    canDonateTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    badge: 'Universal Recipient',
    color: '#a855f7'
  },
  {
    type: 'AB-',
    abo: 'AB',
    rh: '-',
    genotypes: ['IᴬIᴮ Rh⁻/Rh⁻'],
    antigens: ['A', 'B'],
    antibodies: ['Anti-D (if sensitized)'],
    agglutination: { antiA: true, antiB: true, antiD: false },
    canDonateTo: ['AB+', 'AB-'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    color: '#c084fc'
  },
  {
    type: 'O+',
    abo: 'O',
    rh: '+',
    genotypes: ['IᴼIᴼ Rh⁺/Rh⁺', 'IᴼIᴼ Rh⁺/Rh⁻'],
    antigens: ['Rh (D)'],
    antibodies: ['Anti-A', 'Anti-B'],
    agglutination: { antiA: false, antiB: false, antiD: true },
    canDonateTo: ['A+', 'B+', 'AB+', 'O+'],
    canReceiveFrom: ['O+', 'O-'],
    color: '#eab308'
  },
  {
    type: 'O-',
    abo: 'O',
    rh: '-',
    genotypes: ['IᴼIᴼ Rh⁻/Rh⁻'],
    antigens: ['None'],
    antibodies: ['Anti-A', 'Anti-B', 'Anti-D (if sensitized)'],
    agglutination: { antiA: false, antiB: false, antiD: false },
    canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    badge: 'Universal Donor',
    color: '#10b981'
  }
];

// Pedigree Family Tree Nodes
const PEDIGREE_NODES = [
  // Generation I (Grandparents)
  {
    id: 'I-1',
    label: 'Grandfather 1',
    gen: 1,
    sex: 'male',
    actualType: 'A+',
    actualGenotype: 'IᴬIᴼ Rh⁺/Rh⁻',
    phenotype: 'Group A, Rh+',
    deducedGenotype: '',
    options: ['IᴬIᴬ Rh⁺/Rh⁺', 'IᴬIᴼ Rh⁺/Rh⁻', 'IᴬIᴮ Rh⁺/Rh⁻', 'IᴼIᴼ Rh⁺/Rh⁻'],
    x: 100,
    y: 40
  },
  {
    id: 'I-2',
    label: 'Grandmother 1',
    gen: 1,
    sex: 'female',
    actualType: 'B+',
    actualGenotype: 'IᴮIᴼ Rh⁺/Rh⁻',
    phenotype: 'Group B, Rh+',
    deducedGenotype: '',
    options: ['IᴮIᴮ Rh⁺/Rh⁺', 'IᴮIᴼ Rh⁺/Rh⁻', 'IᴬIᴮ Rh⁻/Rh⁻', 'IᴼIᴼ Rh⁻/Rh⁻'],
    x: 230,
    y: 40
  },
  {
    id: 'I-3',
    label: 'Grandfather 2',
    gen: 1,
    sex: 'male',
    actualType: 'AB-',
    actualGenotype: 'IᴬIᴮ Rh⁻/Rh⁻',
    phenotype: 'Group AB, Rh-',
    deducedGenotype: '',
    options: ['IᴬIᴮ Rh⁻/Rh⁻', 'IᴬIᴬ Rh⁻/Rh⁻', 'IᴮIᴮ Rh⁻/Rh⁻', 'IᴬIᴼ Rh⁺/Rh⁻'],
    x: 430,
    y: 40
  },
  {
    id: 'I-4',
    label: 'Grandmother 2',
    gen: 1,
    sex: 'female',
    actualType: 'O+',
    actualGenotype: 'IᴼIᴼ Rh⁺/Rh⁻',
    phenotype: 'Group O, Rh+',
    deducedGenotype: '',
    options: ['IᴼIᴼ Rh⁺/Rh⁻', 'IᴼIᴼ Rh⁺/Rh⁺', 'IᴬIᴼ Rh⁻/Rh⁻', 'IᴮIᴼ Rh⁺/Rh⁻'],
    x: 560,
    y: 40
  },
  // Generation II (Parents)
  {
    id: 'II-1',
    label: 'Father (Peter)',
    gen: 2,
    sex: 'male',
    actualType: 'O-',
    actualGenotype: 'IᴼIᴼ Rh⁻/Rh⁻',
    phenotype: 'Group O, Rh- (Universal RBC Donor)',
    deducedGenotype: '',
    options: ['IᴼIᴼ Rh⁻/Rh⁻', 'IᴬIᴼ Rh⁻/Rh⁻', 'IᴮIᴼ Rh⁺/Rh⁻', 'IᴬIᴬ Rh⁻/Rh⁻'],
    x: 165,
    y: 150
  },
  {
    id: 'II-2',
    label: 'Mother (Jane)',
    gen: 2,
    sex: 'female',
    actualType: 'A+',
    actualGenotype: 'IᴬIᴼ Rh⁺/Rh⁻',
    phenotype: 'Group A, Rh+',
    deducedGenotype: '',
    options: ['IᴬIᴼ Rh⁺/Rh⁻', 'IᴬIᴬ Rh⁺/Rh⁺', 'IᴬIᴮ Rh⁺/Rh⁻', 'IᴼIᴼ Rh⁺/Rh⁻'],
    x: 495,
    y: 150
  },
  // Generation III (Children)
  {
    id: 'III-1',
    label: 'Child 1 (David)',
    gen: 3,
    sex: 'male',
    actualType: 'A+',
    actualGenotype: 'IᴬIᴼ Rh⁺/Rh⁻',
    phenotype: 'Group A, Rh+',
    deducedGenotype: '',
    options: ['IᴬIᴼ Rh⁺/Rh⁻', 'IᴬIᴬ Rh⁺/Rh⁺', 'IᴬIᴮ Rh⁺/Rh⁻', 'IᴼIᴼ Rh⁺/Rh⁻'],
    x: 230,
    y: 260
  },
  {
    id: 'III-2',
    label: 'Child 2 (Mercy)',
    gen: 3,
    sex: 'female',
    actualType: 'O-',
    actualGenotype: 'IᴼIᴼ Rh⁻/Rh⁻',
    phenotype: 'Group O, Rh-',
    deducedGenotype: '',
    options: ['IᴼIᴼ Rh⁻/Rh⁻', 'IᴬIᴼ Rh⁻/Rh⁻', 'IᴼIᴼ Rh⁺/Rh⁻', 'IᴮIᴼ Rh⁻/Rh⁻'],
    x: 430,
    y: 260
  }
];

// KCSE Exam Problems
const KCSE_PROBLEMS = [
  {
    id: 1,
    question: 'A father of blood group A and a mother of blood group B have a child with blood group O. What are the genotypes of the parents?',
    options: [
      { id: 'A', text: 'Father: IᴬIᴬ, Mother: IᴮIᴮ' },
      { id: 'B', text: 'Father: IᴬIᴼ, Mother: IᴮIᴼ', correct: true },
      { id: 'C', text: 'Father: IᴬIᴮ, Mother: IᴼIᴼ' },
      { id: 'D', text: 'Father: IᴬIᴼ, Mother: IᴮIᴮ' }
    ],
    explanation: 'Blood group O has genotype IᴼIᴼ. Because allele Iᴼ is recessive, the child must inherit one Iᴼ allele from each parent. Therefore, both parents must be heterozygous: IᴬIᴼ and IᴮIᴼ.'
  },
  {
    id: 2,
    question: 'Why is blood group AB considered codominant in KCSE biology?',
    options: [
      { id: 'A', text: 'Allele Iᴬ masks allele Iᴮ completely' },
      { id: 'B', text: 'Allele Iᴼ is expressed alongside allele Iᴬ' },
      { id: 'C', text: 'Both alleles Iᴬ and Iᴮ are equally expressed in the heterozygote without blending, producing both A and B antigens', correct: true },
      { id: 'D', text: 'Neither allele produces antigens on red blood cells' }
    ],
    explanation: 'Codominance occurs when both alleles in a heterozygote are fully and independently expressed in the phenotype. Individual with genotype IᴬIᴮ produces both antigen A and antigen B on RBCs.'
  },
  {
    id: 3,
    question: 'A Rhesus-negative (Rh⁻) mother carries a second Rhesus-positive (Rh⁺) fetus. Which condition may develop, and why?',
    options: [
      { id: 'A', text: 'Haemophilia due to lack of blood clotting factor VIII' },
      { id: 'B', text: 'Erythroblastosis foetalis (haemolytic disease of the newborn) because maternal anti-Rh antibodies cross the placenta and destroy foetal RBCs', correct: true },
      { id: 'C', text: 'Sickle cell anaemia due to substitution of glutamic acid with valine' },
      { id: 'D', text: 'Klinefelter syndrome due to non-disjunction of sex chromosomes' }
    ],
    explanation: 'Sensitization during the 1st Rh+ pregnancy causes the Rh- mother to manufacture anti-Rh (Anti-D) antibodies. In subsequent Rh+ pregnancies, maternal IgG antibodies cross placenta, haemolysing foetal RBCs.'
  },
  {
    id: 4,
    question: 'A patient with blood group B- urgently requires a blood transfusion. Which of the following donor blood groups is completely safe?',
    options: [
      { id: 'A', text: 'Group AB+ and B+' },
      { id: 'B', text: 'Group A- and O+' },
      { id: 'C', text: 'Group B- and O-', correct: true },
      { id: 'D', text: 'Group AB- and B-' }
    ],
    explanation: 'A Group B- recipient possesses Anti-A antibodies in plasma and lacks the Rh factor (anti-D can form). Only B- and O- red cells contain neither A antigen nor Rh antigen, preventing agglutination.'
  }
];

export default function ABOBloodGroupPedigreeSim({ onTelemetry }) {
  const [activeTab, setActiveTab] = useState('tile'); // 'tile' | 'matrix' | 'pedigree' | 'solver'
  
  // Virtual Blood Testing Tile States
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0); // index in BLOOD_TYPES
  const [wellDrops, setWellDrops] = useState({ antiA: false, antiB: false, antiD: false });
  const [agglutinationProgress, setAgglutinationProgress] = useState({ antiA: 0, antiB: 0, antiD: 0 });
  const [tileTested, setTileTested] = useState(false);
  const [studentDiagnosis, setStudentDiagnosis] = useState('');
  const [diagnosisFeedback, setDiagnosisFeedback] = useState(null);

  // Matrix State
  const [matrixDonor, setMatrixDonor] = useState('O-');
  const [matrixRecipient, setMatrixRecipient] = useState('AB+');

  // Pedigree State
  const [pedigreeState, setPedigreeState] = useState(
    PEDIGREE_NODES.map(node => ({ ...node, userSelection: '' }))
  );
  const [selectedPedigreeNode, setSelectedPedigreeNode] = useState(PEDIGREE_NODES[0].id);
  const [pedigreeScore, setPedigreeScore] = useState(null);

  // Quiz / Solver State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentPatient = BLOOD_TYPES[selectedPatientIndex];

  // Tile Drop Animation handler
  const handleAddDrop = (serum) => {
    setWellDrops(prev => ({ ...prev, [serum]: true }));
    const willClump = currentPatient.agglutination[serum];
    let start = performance.now();
    const duration = 1200;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setAgglutinationProgress(prev => ({
        ...prev,
        [serum]: willClump ? progress : progress * 0.15
      }));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTileTested(true);
      }
    };
    requestAnimationFrame(animate);
  };

  const handleAddAllDrops = () => {
    handleAddDrop('antiA');
    setTimeout(() => handleAddDrop('antiB'), 250);
    setTimeout(() => handleAddDrop('antiD'), 500);
  };

  const handleResetTile = () => {
    setWellDrops({ antiA: false, antiB: false, antiD: false });
    setAgglutinationProgress({ antiA: 0, antiB: 0, antiD: 0 });
    setTileTested(false);
    setStudentDiagnosis('');
    setDiagnosisFeedback(null);
  };

  const handleVerifyDiagnosis = () => {
    if (!studentDiagnosis) return;
    const isCorrect = studentDiagnosis === currentPatient.type;
    setDiagnosisFeedback({
      correct: isCorrect,
      msg: isCorrect
        ? `Spot on! Patient blood agglutinated with ${
            currentPatient.agglutination.antiA ? 'Anti-A ' : ''
          }${currentPatient.agglutination.antiB ? 'Anti-B ' : ''}${
            currentPatient.agglutination.antiD ? 'Anti-D ' : ''
          }${
            !currentPatient.agglutination.antiA &&
            !currentPatient.agglutination.antiB &&
            !currentPatient.agglutination.antiD
              ? 'neither antiserum (O-)'
              : ''
          }, confirming blood group ${currentPatient.type}.`
        : `Incorrect diagnosis. Carefully re-examine which wells showed clumping (agglutination). Expected: ${currentPatient.type}.`
    });

    if (isCorrect && onTelemetry) {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'abo_blood_group_pedigree_genetics',
        checkpoint: 'blood_typing_completed',
        patientType: currentPatient.type
      });
    }
  };

  // Matrix compatibility check
  const donorObj = BLOOD_TYPES.find(b => b.type === matrixDonor);
  const recipientObj = BLOOD_TYPES.find(b => b.type === matrixRecipient);
  const isCompatible = donorObj && recipientObj && donorObj.canDonateTo.includes(matrixRecipient);

  // Pedigree selection update
  const handlePedigreeSelectGenotype = (nodeId, genotype) => {
    setPedigreeState(prev =>
      prev.map(n => (n.id === nodeId ? { ...n, userSelection: genotype } : n))
    );
  };

  const handleCheckPedigree = () => {
    let correct = 0;
    pedigreeState.forEach(node => {
      if (node.userSelection === node.actualGenotype) {
        correct++;
      }
    });
    setPedigreeScore({ correct, total: pedigreeState.length });

    if (correct === pedigreeState.length && onTelemetry) {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'abo_blood_group_pedigree_genetics',
        checkpoint: 'pedigree_deduction_perfect',
        score: correct
      });
    }
  };

  // Quiz submission
  const handleQuizOption = (optionId) => {
    if (quizSubmitted) return;
    setSelectedAnswer(optionId);
  };

  const handleSubmitQuiz = () => {
    if (!selectedAnswer || quizSubmitted) return;
    setQuizSubmitted(true);
    const q = KCSE_PROBLEMS[currentQuizIndex];
    const isCorrect = q.options.find(opt => opt.id === selectedAnswer)?.correct;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex + 1 < KCSE_PROBLEMS.length) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setQuizSubmitted(false);
    } else {
      setQuizFinished(true);
      if (onTelemetry) {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'abo_blood_group_pedigree_genetics',
          checkpoint: 'kcse_problems_completed',
          score: quizScore + (KCSE_PROBLEMS[currentQuizIndex].options.find(o => o.id === selectedAnswer)?.correct ? 1 : 0)
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 flex flex-col items-center">
      {/* Simulation Header */}
      <header className="w-full max-w-6xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-500/20 text-rose-400 text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider border border-rose-500/30 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-rose-400" /> KCSE Form 4 Biology • Topic 2
            </span>
            <span className="text-slate-500 text-xs">• Multiple Alleles & Codominance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
            ABO Blood Groups & Pedigree Genetics
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Interactive virtual agglutination testing, compatibility matrix, and inheritance pedigree tree.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 gap-1 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('tile')}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tile'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Droplets className="w-4 h-4" /> Agglutination Tile
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Transfusion Matrix
          </button>
          <button
            onClick={() => setActiveTab('pedigree')}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pedigree'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GitBranch className="w-4 h-4" /> Family Pedigree
          </button>
          <button
            onClick={() => setActiveTab('solver')}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'solver'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" /> KCSE Solver
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl flex flex-col gap-6">
        {/* ================= TAB 1: AGGLUTINATION TILE ================= */}
        {activeTab === 'tile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive Tile & Controls */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Patient Sample:
                    </span>
                    <select
                      value={selectedPatientIndex}
                      onChange={(e) => {
                        setSelectedPatientIndex(Number(e.target.value));
                        handleResetTile();
                      }}
                      className="bg-slate-950 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      {BLOOD_TYPES.map((pt, idx) => (
                        <option key={pt.type} value={idx}>
                          Patient #{idx + 1} (Unknown Sample {String.fromCharCode(65 + idx)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddAllDrops}
                      className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> 1-Click Test All
                    </button>
                    <button
                      onClick={handleResetTile}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Wash Tile
                    </button>
                  </div>
                </div>

                {/* Porcelain Reaction Tile Canvas / Visual */}
                <div className="my-6 p-6 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                  <p className="text-xs text-slate-400 mb-4 font-mono">
                    CERAMIC THREE-WELL AGGLUTINATION REACTION PLATE
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-xl">
                    {/* Well 1: Anti-A */}
                    <div className="flex flex-col items-center bg-slate-900 border border-slate-800 rounded-xl p-4 relative shadow-inner">
                      <div className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                        Anti-A Serum (Blue)
                      </div>
                      {/* Well Circle */}
                      <div className="w-32 h-32 rounded-full border-4 border-slate-700 bg-slate-950 relative overflow-hidden flex items-center justify-center shadow-2xl">
                        {/* Blood base */}
                        <div className="w-24 h-24 rounded-full bg-rose-800/80 absolute transition-all duration-500"></div>

                        {/* Antiserum drop indicator */}
                        {wellDrops.antiA && (
                          <div className="absolute inset-0 bg-blue-500/20 mix-blend-screen pointer-events-none transition-opacity duration-300"></div>
                        )}

                        {/* Agglutination particulate simulation */}
                        {wellDrops.antiA && currentPatient.agglutination.antiA && (
                          <div
                            className="absolute inset-0 flex flex-wrap items-center justify-center p-2 gap-1 transition-opacity duration-700"
                            style={{ opacity: agglutinationProgress.antiA }}
                          >
                            {[...Array(24)].map((_, i) => (
                              <div
                                key={i}
                                className="w-2.5 h-2.5 rounded-full bg-rose-950 border border-rose-400/90 shadow animate-pulse"
                                style={{
                                  transform: `translate(${(i % 5 - 2) * 4}px, ${(Math.floor(i / 5) - 2) * 4}px) scale(${0.8 + (i % 3) * 0.2})`,
                                  transition: 'all 0.6s ease-out'
                                }}
                              ></div>
                            ))}
                          </div>
                        )}

                        {/* Smooth non-agglutinated liquid */}
                        {wellDrops.antiA && !currentPatient.agglutination.antiA && (
                          <div
                            className="absolute inset-2 rounded-full bg-gradient-to-br from-rose-700 to-rose-900 opacity-90 transition-opacity"
                            style={{ opacity: 0.9 }}
                          >
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-rose-300 font-mono">
                              Homogeneous
                            </span>
                          </div>
                        )}

                        {!wellDrops.antiA && (
                          <span className="text-[11px] text-slate-500 font-mono z-10 text-center px-2">
                            Patient Blood Only
                          </span>
                        )}
                      </div>

                      {/* Add Drop Button */}
                      <button
                        onClick={() => handleAddDrop('antiA')}
                        disabled={wellDrops.antiA}
                        className={`mt-3 w-full py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                          wellDrops.antiA
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                        }`}
                      >
                        <Droplets className="w-3.5 h-3.5" /> + Anti-A
                      </button>
                      <span className="text-[11px] text-slate-400 mt-1 font-mono">
                        {wellDrops.antiA
                          ? currentPatient.agglutination.antiA
                            ? 'CLUMPING (+)'
                            : 'NO REACTION (-)'
                          : 'Awaiting reagent'}
                      </span>
                    </div>

                    {/* Well 2: Anti-B */}
                    <div className="flex flex-col items-center bg-slate-900 border border-slate-800 rounded-xl p-4 relative shadow-inner">
                      <div className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                        Anti-B Serum (Yellow)
                      </div>
                      {/* Well Circle */}
                      <div className="w-32 h-32 rounded-full border-4 border-slate-700 bg-slate-950 relative overflow-hidden flex items-center justify-center shadow-2xl">
                        <div className="w-24 h-24 rounded-full bg-rose-800/80 absolute transition-all duration-500"></div>

                        {wellDrops.antiB && (
                          <div className="absolute inset-0 bg-amber-500/20 mix-blend-screen pointer-events-none transition-opacity duration-300"></div>
                        )}

                        {wellDrops.antiB && currentPatient.agglutination.antiB && (
                          <div
                            className="absolute inset-0 flex flex-wrap items-center justify-center p-2 gap-1 transition-opacity duration-700"
                            style={{ opacity: agglutinationProgress.antiB }}
                          >
                            {[...Array(24)].map((_, i) => (
                              <div
                                key={i}
                                className="w-2.5 h-2.5 rounded-full bg-rose-950 border border-rose-400/90 shadow animate-pulse"
                                style={{
                                  transform: `translate(${(i % 5 - 2) * 4}px, ${(Math.floor(i / 5) - 2) * 4}px) scale(${0.8 + (i % 3) * 0.2})`,
                                  transition: 'all 0.6s ease-out'
                                }}
                              ></div>
                            ))}
                          </div>
                        )}

                        {wellDrops.antiB && !currentPatient.agglutination.antiB && (
                          <div
                            className="absolute inset-2 rounded-full bg-gradient-to-br from-rose-700 to-rose-900 opacity-90 transition-opacity"
                            style={{ opacity: 0.9 }}
                          >
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-rose-300 font-mono">
                              Homogeneous
                            </span>
                          </div>
                        )}

                        {!wellDrops.antiB && (
                          <span className="text-[11px] text-slate-500 font-mono z-10 text-center px-2">
                            Patient Blood Only
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddDrop('antiB')}
                        disabled={wellDrops.antiB}
                        className={`mt-3 w-full py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                          wellDrops.antiB
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-amber-600 hover:bg-amber-500 text-white shadow'
                        }`}
                      >
                        <Droplets className="w-3.5 h-3.5" /> + Anti-B
                      </button>
                      <span className="text-[11px] text-slate-400 mt-1 font-mono">
                        {wellDrops.antiB
                          ? currentPatient.agglutination.antiB
                            ? 'CLUMPING (+)'
                            : 'NO REACTION (-)'
                          : 'Awaiting reagent'}
                      </span>
                    </div>

                    {/* Well 3: Anti-D */}
                    <div className="flex flex-col items-center bg-slate-900 border border-slate-800 rounded-xl p-4 relative shadow-inner">
                      <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                        Anti-D / Rh (Clear)
                      </div>
                      {/* Well Circle */}
                      <div className="w-32 h-32 rounded-full border-4 border-slate-700 bg-slate-950 relative overflow-hidden flex items-center justify-center shadow-2xl">
                        <div className="w-24 h-24 rounded-full bg-rose-800/80 absolute transition-all duration-500"></div>

                        {wellDrops.antiD && (
                          <div className="absolute inset-0 bg-emerald-500/20 mix-blend-screen pointer-events-none transition-opacity duration-300"></div>
                        )}

                        {wellDrops.antiD && currentPatient.agglutination.antiD && (
                          <div
                            className="absolute inset-0 flex flex-wrap items-center justify-center p-2 gap-1 transition-opacity duration-700"
                            style={{ opacity: agglutinationProgress.antiD }}
                          >
                            {[...Array(24)].map((_, i) => (
                              <div
                                key={i}
                                className="w-2.5 h-2.5 rounded-full bg-rose-950 border border-rose-400/90 shadow animate-pulse"
                                style={{
                                  transform: `translate(${(i % 5 - 2) * 4}px, ${(Math.floor(i / 5) - 2) * 4}px) scale(${0.8 + (i % 3) * 0.2})`,
                                  transition: 'all 0.6s ease-out'
                                }}
                              ></div>
                            ))}
                          </div>
                        )}

                        {wellDrops.antiD && !currentPatient.agglutination.antiD && (
                          <div
                            className="absolute inset-2 rounded-full bg-gradient-to-br from-rose-700 to-rose-900 opacity-90 transition-opacity"
                            style={{ opacity: 0.9 }}
                          >
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-rose-300 font-mono">
                              Homogeneous
                            </span>
                          </div>
                        )}

                        {!wellDrops.antiD && (
                          <span className="text-[11px] text-slate-500 font-mono z-10 text-center px-2">
                            Patient Blood Only
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddDrop('antiD')}
                        disabled={wellDrops.antiD}
                        className={`mt-3 w-full py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                          wellDrops.antiD
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                        }`}
                      >
                        <Droplets className="w-3.5 h-3.5" /> + Anti-D
                      </button>
                      <span className="text-[11px] text-slate-400 mt-1 font-mono">
                        {wellDrops.antiD
                          ? currentPatient.agglutination.antiD
                            ? 'CLUMPING (Rh+)'
                            : 'NO REACTION (Rh-)'
                          : 'Awaiting reagent'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Student Diagnosis Interactive Bar */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-400">
                      Determine Patient Blood Group from Observed Agglutination:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Clumping indicates antigen present on cell membrane.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <select
                      value={studentDiagnosis}
                      onChange={(e) => setStudentDiagnosis(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 flex-1 md:flex-none"
                    >
                      <option value="">Select Group...</option>
                      {BLOOD_TYPES.map((bt) => (
                        <option key={bt.type} value={bt.type}>
                          Blood Group {bt.type}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleVerifyDiagnosis}
                      disabled={!studentDiagnosis || !tileTested}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow ${
                        !studentDiagnosis || !tileTested
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      Confirm Diagnosis
                    </button>
                  </div>
                </div>

                {/* Diagnosis Result Alert */}
                {diagnosisFeedback && (
                  <div
                    className={`mt-4 p-3.5 rounded-xl border flex items-start gap-3 ${
                      diagnosisFeedback.correct
                        ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                    }`}
                  >
                    {diagnosisFeedback.correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs">
                      <p className="font-semibold">{diagnosisFeedback.msg}</p>
                      {diagnosisFeedback.correct && (
                        <div className="mt-2 text-slate-300 font-mono text-[11px] bg-slate-950/60 p-2 rounded border border-emerald-900/50">
                          <div>Antigens on RBC: {currentPatient.antigens.join(', ') || 'None'}</div>
                          <div>Antibodies in Plasma: {currentPatient.antibodies.join(', ')}</div>
                          <div>Possible Genotypes: {currentPatient.genotypes.join(', ')}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: KCSE Biology Guide & Rules */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-rose-400" />
                  KCSE Biology Key Principles
                </h3>
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-semibold text-rose-400 block mb-1">
                      1. Multiple Alleles:
                    </span>
                    The ABO blood group is determined by 3 alleles at a single gene locus on chromosome 9: <code className="text-amber-300">Iᴬ</code>, <code className="text-blue-300">Iᴮ</code>, and <code className="text-emerald-300">Iᴼ</code>.
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-semibold text-rose-400 block mb-1">
                      2. Codominance & Recessiveness:
                    </span>
                    <code className="text-white">Iᴬ</code> and <code className="text-white">Iᴮ</code> are codominant (both produce functional glycosyltransferase enzymes). Allele <code className="text-white">Iᴼ</code> is completely recessive to both.
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-semibold text-rose-400 block mb-1">
                      3. Agglutination Reaction:
                    </span>
                    Clumping occurs when antibody binds to homologous surface antigen (e.g. Anti-A + Antigen A), causing RBCs to clump and block capillaries.
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-semibold text-rose-400 block mb-1">
                      4. Rhesus (Rh) Factor:
                    </span>
                    Determined by dominant allele <code className="text-emerald-400">Rh⁺</code> (or D) and recessive <code className="text-emerald-400">Rh⁻</code> (or d).
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: TRANSFUSION COMPATIBILITY MATRIX ================= */}
        {activeTab === 'matrix' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rose-500" />
                Universal Donor vs Universal Recipient Compatibility Checker
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Transfusion rule: The donor's RBC antigens must NOT react with recipient's plasma antibodies.
              </p>
            </div>

            {/* Interactive Pair Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-5 rounded-xl border border-slate-800">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2 uppercase tracking-wide">
                  Select Donor Blood Group (RBCs infused):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_TYPES.map(bt => (
                    <button
                      key={bt.type}
                      onClick={() => setMatrixDonor(bt.type)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        matrixDonor === bt.type
                          ? 'bg-rose-600 border-rose-400 text-white shadow-lg ring-2 ring-rose-400/40'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {bt.type}
                      {bt.type === 'O-' && <span className="block text-[9px] text-emerald-300 font-normal">Donor</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2 uppercase tracking-wide">
                  Select Recipient Blood Group (Host Plasma):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_TYPES.map(bt => (
                    <button
                      key={bt.type}
                      onClick={() => setMatrixRecipient(bt.type)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        matrixRecipient === bt.type
                          ? 'bg-blue-600 border-blue-400 text-white shadow-lg ring-2 ring-blue-400/40'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {bt.type}
                      {bt.type === 'AB+' && <span className="block text-[9px] text-purple-300 font-normal">Recipient</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Transfusion Verdict Banner */}
            <div
              className={`p-5 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
                isCompatible
                  ? 'bg-emerald-950/30 border-emerald-600/50 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-600/50 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-4">
                {isCompatible ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-500 shrink-0" />
                )}
                <div>
                  <h3 className="text-base font-bold">
                    {isCompatible
                      ? `SAFE TRANSFUSION: ${matrixDonor} → ${matrixRecipient}`
                      : `HAZARDOUS TRANSFUSION: ${matrixDonor} → ${matrixRecipient}`}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    {isCompatible
                      ? `Donor ${matrixDonor} RBC antigens (${
                          donorObj.antigens.join(', ') || 'None'
                        }) do not trigger attack from Recipient ${matrixRecipient} antibodies (${recipientObj.antibodies.join(
                          ', '
                        )}). No fatal haemolytic agglutination.`
                      : `FATAL CLUMPING! Recipient ${matrixRecipient} plasma possesses antibodies against donor ${matrixDonor} surface antigens (${donorObj.antigens.join(
                          ', '
                        )}), inducing severe intravascular haemolysis and renal failure.`}
                  </p>
                </div>
              </div>

              <div className="shrink-0 font-mono text-xs px-4 py-2 rounded-lg bg-slate-950/70 border border-slate-800">
                Compatibility: <span className={isCompatible ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {isCompatible ? '100% MATCH' : 'INCOMPATIBLE'}
                </span>
              </div>
            </div>

            {/* Complete Compatibility Grid Table */}
            <div className="overflow-x-auto">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Universal Compatibility Grid (8x8):
              </h3>
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border border-slate-800">
                    <th className="p-2 border border-slate-800 text-left">Donor \ Recipient</th>
                    {BLOOD_TYPES.map(r => (
                      <th key={r.type} className="p-2 border border-slate-800 font-bold text-white">
                        {r.type}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BLOOD_TYPES.map(d => (
                    <tr key={d.type} className="hover:bg-slate-800/40">
                      <td className="p-2 border border-slate-800 font-bold text-white text-left bg-slate-950">
                        {d.type}
                        {d.type === 'O-' && <span className="ml-1 text-[10px] text-emerald-400">(Univ Donor)</span>}
                      </td>
                      {BLOOD_TYPES.map(r => {
                        const can = d.canDonateTo.includes(r.type);
                        const isCurrentPair = d.type === matrixDonor && r.type === matrixRecipient;
                        return (
                          <td
                            key={r.type}
                            className={`p-2 border border-slate-800 transition-all font-mono font-bold ${
                              isCurrentPair
                                ? 'ring-2 ring-amber-400 scale-105 z-10'
                                : ''
                            } ${
                              can
                                ? 'bg-emerald-950/40 text-emerald-300'
                                : 'bg-rose-950/30 text-rose-400'
                            }`}
                          >
                            {can ? '✓' : '✗'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: FAMILY PEDIGREE INHERITANCE ================= */}
        {activeTab === 'pedigree' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-rose-500" />
                  3-Generation Blood Group Pedigree & Genotype Deduction
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Examine family phenotypes. Click any individual to inspect family clues and deduce their exact genotype.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCheckPedigree}
                  className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" /> Verify Deductions
                </button>
                {pedigreeScore && (
                  <span className="text-xs font-mono px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-amber-300">
                    Score: {pedigreeScore.correct} / {pedigreeScore.total}
                  </span>
                )}
              </div>
            </div>

            {/* Pedigree Graphic Canvas / Visual Layout */}
            <div className="w-full bg-slate-950 rounded-xl border border-slate-800 p-6 overflow-x-auto flex justify-center">
              <div className="relative w-[700px] h-[360px]">
                {/* SVG Connectors for Pedigree Tree */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-600" strokeWidth="2" fill="none">
                  {/* Gen 1 marriage 1 */}
                  <line x1="140" y1="60" x2="270" y2="60" />
                  <line x1="205" y1="60" x2="205" y2="105" />

                  {/* Gen 1 marriage 2 */}
                  <line x1="470" y1="60" x2="600" y2="60" />
                  <line x1="535" y1="60" x2="535" y2="105" />

                  {/* Drop to Father and Mother */}
                  <line x1="205" y1="105" x2="205" y2="150" />
                  <line x1="535" y1="105" x2="535" y2="150" />

                  {/* Parents Marriage */}
                  <line x1="205" y1="170" x2="535" y2="170" />
                  {/* Offspring branch */}
                  <line x1="370" y1="170" x2="370" y2="215" />
                  <line x1="270" y1="215" x2="470" y2="215" />
                  <line x1="270" y1="215" x2="270" y2="260" />
                  <line x1="470" y1="215" x2="470" y2="260" />
                </svg>

                {/* Pedigree Nodes */}
                {pedigreeState.map((node) => {
                  const isSelected = selectedPedigreeNode === node.id;
                  const hasAnswered = !!node.userSelection;
                  const isCorrect = node.userSelection === node.actualGenotype;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedPedigreeNode(node.id)}
                      style={{ left: `${node.x}px`, top: `${node.y}px` }}
                      className={`absolute cursor-pointer flex flex-col items-center p-2 rounded-xl border transition-all duration-200 z-10 w-28 bg-slate-900 ${
                        isSelected
                          ? 'border-rose-500 ring-2 ring-rose-500/50 scale-105'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {/* Shape: Square for male, Circle for female */}
                      <div
                        className={`w-10 h-10 flex items-center justify-center font-bold text-sm text-white mb-1 shadow ${
                          node.sex === 'male' ? 'rounded-md' : 'rounded-full'
                        } ${
                          hasAnswered
                            ? isCorrect
                              ? 'bg-emerald-600'
                              : 'bg-rose-600'
                            : 'bg-indigo-600'
                        }`}
                      >
                        {node.actualType}
                      </div>

                      <span className="text-[10px] font-semibold text-white truncate max-w-full">
                        {node.label}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {node.userSelection || 'Genotype ?'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Node Deduction Panel */}
            {selectedPedigreeNode && (
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start justify-between gap-6">
                {(() => {
                  const node = pedigreeState.find(n => n.id === selectedPedigreeNode);
                  return (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                            Deduction Inspector:
                          </span>
                          <span className="text-sm font-bold text-white">{node.label}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            Phenotype: {node.phenotype}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Clue: Check this individual's parents and offspring. A child with blood group O (IᴼIᴼ) requires each parent to possess at least one recessive <code className="text-rose-300">Iᴼ</code> allele.
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <span className="text-xs font-semibold text-slate-300">
                          Select Deduced Genotype:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {node.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handlePedigreeSelectGenotype(node.id, opt)}
                              className={`px-3 py-2 text-xs font-mono font-bold rounded-lg border transition-all ${
                                node.userSelection === opt
                                  ? 'bg-rose-600 border-rose-400 text-white shadow'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: KCSE BLOOD GROUP SOLVER ================= */}
        {activeTab === 'solver' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-rose-500" />
                  KCSE Biology Exam Challenge Quiz
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Past national examinations question sets on codominance, multiple alleles, and Rh incompatibility.
                </p>
              </div>
              <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-amber-400">
                Score: {quizScore} / {KCSE_PROBLEMS.length}
              </div>
            </div>

            {!quizFinished ? (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Question {currentQuizIndex + 1} of {KCSE_PROBLEMS.length}</span>
                  <span className="text-rose-400 font-semibold">Form 4 KCSE Standard</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm font-medium text-white leading-relaxed">
                  {KCSE_PROBLEMS[currentQuizIndex].question}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-3">
                  {KCSE_PROBLEMS[currentQuizIndex].options.map((option) => {
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
                      style = 'bg-rose-900/30 border-rose-500 text-white font-semibold ring-1 ring-rose-500';
                    }

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleQuizOption(option.id)}
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

                {/* Explanation */}
                {quizSubmitted && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs leading-relaxed">
                    <span className="font-bold text-rose-400 block mb-1">Marking Scheme Explanation:</span>
                    <p className="text-slate-300">{KCSE_PROBLEMS[currentQuizIndex].explanation}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-2">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={!selectedAnswer}
                      className={`px-5 py-2 rounded-lg text-xs font-bold transition-all shadow ${
                        !selectedAnswer
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuiz}
                      className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5"
                    >
                      {currentQuizIndex + 1 < KCSE_PROBLEMS.length ? 'Next Question' : 'View Final Results'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Finished Screen */
              <div className="p-8 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-2">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Quiz Completed!</h3>
                <p className="text-sm text-slate-400 max-w-md">
                  You scored <span className="font-bold text-rose-400">{quizScore}</span> out of{' '}
                  <span className="font-bold text-white">{KCSE_PROBLEMS.length}</span> ({Math.round((quizScore / KCSE_PROBLEMS.length) * 100)}%).
                </p>
                <button
                  onClick={handleRestartQuiz}
                  className="mt-4 bg-rose-600 hover:bg-rose-500 text-white px-6 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow"
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
