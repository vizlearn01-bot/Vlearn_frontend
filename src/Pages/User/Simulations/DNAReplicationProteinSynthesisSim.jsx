import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  Search,
  Activity,
  Zap,
  ArrowRight,
  Maximize2,
  ChevronRight,
  Eye,
  Sliders,
  RefreshCw,
  FlaskConical,
} from 'lucide-react';

// ============================================================================
// CODON DICTIONARY & GENETIC CODE (KCSE Form 4 Syllabus)
// ============================================================================
const GENETIC_CODE = {
  AUG: { aa: 'Methionine (Met)', abbr: 'Met', start: true, color: '#10B981' },
  UUU: { aa: 'Phenylalanine (Phe)', abbr: 'Phe', color: '#6366F1' },
  UUC: { aa: 'Phenylalanine (Phe)', abbr: 'Phe', color: '#6366F1' },
  UUA: { aa: 'Leucine (Leu)', abbr: 'Leu', color: '#3B82F6' },
  UUG: { aa: 'Leucine (Leu)', abbr: 'Leu', color: '#3B82F6' },
  UCU: { aa: 'Serine (Ser)', abbr: 'Ser', color: '#EC4899' },
  UCC: { aa: 'Serine (Ser)', abbr: 'Ser', color: '#EC4899' },
  UCA: { aa: 'Serine (Ser)', abbr: 'Ser', color: '#EC4899' },
  UCG: { aa: 'Serine (Ser)', abbr: 'Ser', color: '#EC4899' },
  UAU: { aa: 'Tyrosine (Tyr)', abbr: 'Tyr', color: '#8B5CF6' },
  UAC: { aa: 'Tyrosine (Tyr)', abbr: 'Tyr', color: '#8B5CF6' },
  UAA: { aa: 'STOP (Ochre)', abbr: 'STOP', stop: true, color: '#EF4444' },
  UAG: { aa: 'STOP (Amber)', abbr: 'STOP', stop: true, color: '#EF4444' },
  UGU: { aa: 'Cysteine (Cys)', abbr: 'Cys', color: '#F59E0B' },
  UGC: { aa: 'Cysteine (Cys)', abbr: 'Cys', color: '#F59E0B' },
  UGA: { aa: 'STOP (Opal)', abbr: 'STOP', stop: true, color: '#EF4444' },
  UGG: { aa: 'Tryptophan (Trp)', abbr: 'Trp', color: '#14B8A6' },
  CUU: { aa: 'Leucine (Leu)', abbr: 'Leu', color: '#3B82F6' },
  CUC: { aa: 'Leucine (Leu)', abbr: 'Leu', color: '#3B82F6' },
  CUA: { aa: 'Leucine (Leu)', abbr: 'Leu', color: '#3B82F6' },
  CUG: { aa: 'Leucine (Leu)', abbr: 'Leu', color: '#3B82F6' },
  CCU: { aa: 'Proline (Pro)', abbr: 'Pro', color: '#06B6D4' },
  CCC: { aa: 'Proline (Pro)', abbr: 'Pro', color: '#06B6D4' },
  CCA: { aa: 'Proline (Pro)', abbr: 'Pro', color: '#06B6D4' },
  CCG: { aa: 'Proline (Pro)', abbr: 'Pro', color: '#06B6D4' },
  CAU: { aa: 'Histidine (His)', abbr: 'His', color: '#A855F7' },
  CAC: { aa: 'Histidine (His)', abbr: 'His', color: '#A855F7' },
  CAA: { aa: 'Glutamine (Gln)', abbr: 'Gln', color: '#38BDF8' },
  CAG: { aa: 'Glutamine (Gln)', abbr: 'Gln', color: '#38BDF8' },
  CGU: { aa: 'Arginine (Arg)', abbr: 'Arg', color: '#F97316' },
  CGC: { aa: 'Arginine (Arg)', abbr: 'Arg', color: '#F97316' },
  CGA: { aa: 'Arginine (Arg)', abbr: 'Arg', color: '#F97316' },
  CGG: { aa: 'Arginine (Arg)', abbr: 'Arg', color: '#F97316' },
  AUU: { aa: 'Isoleucine (Ile)', abbr: 'Ile', color: '#84CC16' },
  AUC: { aa: 'Isoleucine (Ile)', abbr: 'Ile', color: '#84CC16' },
  AUA: { aa: 'Isoleucine (Ile)', abbr: 'Ile', color: '#84CC16' },
  ACU: { aa: 'Threonine (Thr)', abbr: 'Thr', color: '#EAB308' },
  ACC: { aa: 'Threonine (Thr)', abbr: 'Thr', color: '#EAB308' },
  ACA: { aa: 'Threonine (Thr)', abbr: 'Thr', color: '#EAB308' },
  ACG: { aa: 'Threonine (Thr)', abbr: 'Thr', color: '#EAB308' },
  AAU: { aa: 'Asparagine (Asn)', abbr: 'Asn', color: '#4ADE80' },
  AAC: { aa: 'Asparagine (Asn)', abbr: 'Asn', color: '#4ADE80' },
  AAA: { aa: 'Lysine (Lys)', abbr: 'Lys', color: '#FB7185' },
  AAG: { aa: 'Lysine (Lys)', abbr: 'Lys', color: '#FB7185' },
  GUU: { aa: 'Valine (Val)', abbr: 'Val', color: '#22C55E' },
  GUC: { aa: 'Valine (Val)', abbr: 'Val', color: '#22C55E' },
  GUA: { aa: 'Valine (Val)', abbr: 'Val', color: '#22C55E' },
  GUG: { aa: 'Valine (Val)', abbr: 'Val', color: '#22C55E' },
  GCU: { aa: 'Alanine (Ala)', abbr: 'Ala', color: '#0EA5E9' },
  GCC: { aa: 'Alanine (Ala)', abbr: 'Ala', color: '#0EA5E9' },
  GCA: { aa: 'Alanine (Ala)', abbr: 'Ala', color: '#0EA5E9' },
  GCG: { aa: 'Alanine (Ala)', abbr: 'Ala', color: '#0EA5E9' },
  GAU: { aa: 'Aspartate (Asp)', abbr: 'Asp', color: '#F43F5E' },
  GAC: { aa: 'Aspartate (Asp)', abbr: 'Asp', color: '#F43F5E' },
  GAA: { aa: 'Glutamate (Glu)', abbr: 'Glu', color: '#FB923C' },
  GAG: { aa: 'Glutamate (Glu)', abbr: 'Glu', color: '#FB923C' },
  GGU: { aa: 'Glycine (Gly)', abbr: 'Gly', color: '#64748B' },
  GGC: { aa: 'Glycine (Gly)', abbr: 'Gly', color: '#64748B' },
  GGA: { aa: 'Glycine (Gly)', abbr: 'Gly', color: '#64748B' },
  GGG: { aa: 'Glycine (Gly)', abbr: 'Gly', color: '#64748B' },
};

// Nitrogenous Base Color Map
const BASE_COLORS = {
  A: { bg: '#10B981', border: '#059669', text: '#FFFFFF', name: 'Adenine (Purine)', pairsWith: 'T / U', hBonds: 2 },
  T: { bg: '#EF4444', border: '#DC2626', text: '#FFFFFF', name: 'Thymine (Pyrimidine)', pairsWith: 'A', hBonds: 2 },
  C: { bg: '#3B82F6', border: '#2563EB', text: '#FFFFFF', name: 'Cytosine (Pyrimidine)', pairsWith: 'G', hBonds: 3 },
  G: { bg: '#F59E0B', border: '#D97706', text: '#FFFFFF', name: 'Guanine (Purine)', pairsWith: 'C', hBonds: 3 },
  U: { bg: '#8B5CF6', border: '#7C3AED', text: '#FFFFFF', name: 'Uracil (Pyrimidine)', pairsWith: 'A', hBonds: 2 },
};

// Default Gene Template (30 base pairs = 10 triplets/codons)
// Template strand (3' to 5'): TAC TTC AAA CCG GAC CTC CAC CGA ACT ATT
// Coding strand (5' to 3'):   ATG AAG TTT GGC CTG GAG GTG GCT TGA TAA
// mRNA transcript (5' to 3'): AUG AAG UUU GGC CUG GAG GUG GCU UGA UAA
// Polypeptide:                Met - Lys - Phe - Gly - Leu - Glu - Val - Ala - STOP
const DEFAULT_TEMPLATE_STRAND = 'TACTTCAAACCGGACCTCCACCGAATCATT';

const KCSE_EXAM_CHALLENGES = [
  {
    id: 'kcse_triplet_1',
    title: 'KCSE Challenge 1: Transcription Base-Pairing',
    scenario: "A portion of a DNA template strand has the nitrogenous base sequence: 3'- T A C G C T A A G - 5'.",
    question: 'What is the corresponding base sequence of the messenger RNA (mRNA) synthesized by RNA polymerase?',
    options: [
      "5'- A U G C G A U U C - 3'",
      "5'- A T G C G A T T C - 3'",
      "5'- U A C G C U A A G - 3'",
      "5'- C A U G C U A A G - 3'",
    ],
    correctIdx: 0,
    explanation: 'In RNA transcription, RNA polymerase pairs Uracil (U) opposite Adenine (A), Adenine (A) opposite Thymine (T), Guanine (G) opposite Cytosine (C), and Cytosine (C) opposite Guanine (G). Hence: T->A, A->U, C->G, G->C, C->G, T->A, A->U, A->U, G->C gives AUG CGA UUC.',
    syllRef: 'KCSE Biology Paper 2 · Section B (Transcription)',
  },
  {
    id: 'kcse_triplet_2',
    title: 'KCSE Challenge 2: tRNA Anticodon Binding',
    scenario: "A ribosome encounters the mRNA codon 5'- G A G - 3' coding for Glutamic Acid.",
    question: 'What is the precise tRNA anticodon triplet that pairs with this codon, and where does translation occur?',
    options: [
      "3'- C U C - 5' in the Ribosome (Cytoplasm/RER)",
      "3'- C T C - 5' in the Nucleus",
      "5'- G A G - 3' in the Mitochondria",
      "3'- U A U - 5' in the Golgi apparatus",
    ],
    correctIdx: 0,
    explanation: "tRNA contains an anticodon complementary to the mRNA codon. For codon G-A-G (5' to 3'), the complementary RNA anticodon is 3'- C-U-C - 5'. Protein synthesis takes place on ribosomes either free in the cytoplasm or attached to the rough endoplasmic reticulum (RER).",
    syllRef: 'KCSE Form 4 Topic 2 · Protein Synthesis',
  },
  {
    id: 'kcse_triplet_3',
    title: 'KCSE Challenge 3: Sickle Cell Point Mutation',
    scenario: 'In normal adult hemoglobin (HbA), codon 6 is GAG (Glutamic acid). In sickle cell hemoglobin (HbS), a substitution point mutation converts the DNA triplet CTC into CAC, resulting in codon GUG.',
    question: 'Which amino acid replaces Glutamic Acid in HbS, and what physiological consequence results under low oxygen tension?',
    options: [
      'Valine replaces Glutamic acid; HbS polymerizes into long fibers causing red blood cells to sickle and occlude capillaries',
      'Leucine replaces Glutamic acid; RBCs swell and burst by lysis',
      'Alanine replaces Glutamic acid; hemoglobin binds oxygen too tightly',
      'Stop codon terminates chain early; hemoglobin is completely missing',
    ],
    correctIdx: 0,
    explanation: 'Codon GUG codes for Valine (a hydrophobic amino acid) instead of hydrophilic Glutamic acid (GAG). Under low partial pressure of oxygen, deoxygenated HbS molecules polymerize into rigid sickle-shaped crystals that distort erythrocyte shape, cause hemolytic anemia and tissue hypoxia.',
    syllRef: 'KCSE Biology Paper 1 & 2 · Gene Mutation',
  },
  {
    id: 'kcse_triplet_4',
    title: 'KCSE Challenge 4: Semi-Conservative Replication Enzymes',
    scenario: 'During the S-phase of interphase, a eukaryotic DNA double helix undergoes replication.',
    question: "Which statement accurately describes the specific roles of Helicase, DNA Polymerase, and DNA Ligase?",
    options: [
      "Helicase breaks hydrogen bonds to unzip the duplex; DNA Polymerase synthesizes new complementary strands 5' to 3'; Ligase seals Okazaki fragments on the lagging strand",
      'DNA Polymerase unzips hydrogen bonds; Helicase joins Okazaki fragments; Ligase makes mRNA',
      'RNA Polymerase replicates DNA; Helicase adds amino acids; Ligase condenses ribosomes',
      'Helicase synthesizes primers; Polymerase breaks phosphodiester backbones; Ligase unwinds DNA',
    ],
    correctIdx: 0,
    explanation: "Helicase unwinds the double helix and unzips hydrogen bonds between complementary bases. DNA Polymerase synthesizes new complementary daughter strands in the 5' to 3' direction. On the discontinuous lagging strand, DNA Ligase links Okazaki fragments together with covalent phosphodiester bonds.",
    syllRef: 'KCSE Biology · DNA Replication Mechanism',
  },
];

export default function DNAReplicationProteinSynthesisSim({ config = {}, onTelemetry }) {
  // Active Tab / Step:
  // 'structure' = 3D rotating DNA double helix
  // 'replication' = Step 1: Replication fork (Helicase, Polymerase, leading/lagging)
  // 'transcription' = Step 2: mRNA synthesis (RNA Polymerase, template strand)
  // 'translation' = Step 3: Ribosome translation (mRNA, tRNA anticodons, polypeptide chain)
  // 'codon_table' = Genetic code lookup dictionary
  // 'kcse_quiz' = KCSE exam questions & challenge
  const [activeTab, setActiveTab] = useState('structure');

  // Animation & playback
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1); // 0.5x, 1x, 2x
  const [yawAngle, setYawAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Replication state
  const [forkPosition, setForkPosition] = useState(45); // 0% to 100% unzipped
  const [leadingPolymerasePos, setLeadingPolymerasePos] = useState(40);

  // Transcription state
  const [rnaPolymerasePos, setRnaPolymerasePos] = useState(5); // base index 0 to 10

  // Translation state
  const [ribosomeCodonIndex, setRibosomeCodonIndex] = useState(0);
  const [growingPolypeptide, setGrowingPolypeptide] = useState(['Met']);

  // Codon lookup tool
  const [searchCodon, setSearchCodon] = useState('AUG');
  const [selectedBase1, setSelectedBase1] = useState('A');
  const [selectedBase2, setSelectedBase2] = useState('U');
  const [selectedBase3, setSelectedBase3] = useState('G');

  // KCSE Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [telemetrySent, setTelemetrySent] = useState(false);

  // Canvas ref for 3D DNA Double Helix renderer
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Derive mRNA sequence from default template strand
  const templateStrand = DEFAULT_TEMPLATE_STRAND;
  const codingStrand = useMemo(() => {
    return templateStrand
      .split('')
      .map((b) => {
        if (b === 'A') return 'T';
        if (b === 'T') return 'A';
        if (b === 'C') return 'G';
        if (b === 'G') return 'C';
        return 'N';
      })
      .join('');
  }, [templateStrand]);

  const mrnaStrand = useMemo(() => {
    return templateStrand
      .split('')
      .map((b) => {
        if (b === 'A') return 'U';
        if (b === 'T') return 'A';
        if (b === 'C') return 'G';
        if (b === 'G') return 'C';
        return 'N';
      })
      .join('');
  }, [templateStrand]);

  const mrnaCodons = useMemo(() => {
    const list = [];
    for (let i = 0; i < mrnaStrand.length; i += 3) {
      if (i + 3 <= mrnaStrand.length) {
        list.push(mrnaStrand.slice(i, i + 3));
      }
    }
    return list;
  }, [mrnaStrand]);

  const proteinChain = useMemo(() => {
    return mrnaCodons.map((c) => GENETIC_CODE[c] || { aa: 'Unknown', abbr: '???', color: '#94A3B8' });
  }, [mrnaCodons]);

  // Handle 3D Canvas rendering of DNA Double Helix with pseudo-3D perspective
  useEffect(() => {
    let currentYaw = yawAngle;
    let lastTime = performance.now();

    const render = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying && isAutoRotating) {
        currentYaw += dt * 0.8 * simSpeed;
        setYawAngle(currentYaw);
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      // Dark slate laboratory canvas background
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle background grid
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw central axis
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width * 0.32, 140);
      const totalPairs = 24;
      const pitchHeight = height * 0.78;
      const startY = cy - pitchHeight / 2;
      const stepY = pitchHeight / totalPairs;

      // Base pairs along the strand
      const basesSequence = [
        ['A', 'T'], ['G', 'C'], ['C', 'G'], ['T', 'A'],
        ['A', 'T'], ['T', 'A'], ['C', 'G'], ['G', 'C'],
        ['G', 'C'], ['A', 'T'], ['T', 'A'], ['C', 'G'],
        ['A', 'T'], ['G', 'C'], ['C', 'G'], ['T', 'A'],
        ['A', 'T'], ['C', 'G'], ['T', 'A'], ['G', 'C'],
        ['C', 'G'], ['T', 'A'], ['A', 'T'], ['G', 'C'],
      ];

      // Draw elements sorted by z-depth for correct pseudo-3D occlusion
      const renderElements = [];

      for (let i = 0; i < totalPairs; i++) {
        const y = startY + i * stepY;
        const theta = currentYaw + (i * Math.PI) / 6; // helical twist 30 deg per pair
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        // Strand 1 (Leading / Template):
        const x1 = cx + radius * cosTheta;
        const z1 = radius * sinTheta;

        // Strand 2 (Lagging / Coding, 180 deg opposite):
        const x2 = cx - radius * cosTheta;
        const z2 = -radius * sinTheta;

        const [base1, base2] = basesSequence[i % basesSequence.length];

        renderElements.push({
          type: 'base_pair',
          idx: i,
          y,
          x1,
          z1,
          x2,
          z2,
          zAvg: (z1 + z2) / 2,
          base1,
          base2,
        });
      }

      // Sort back-to-front
      renderElements.sort((a, b) => a.zAvg - b.zAvg);

      // Render back sugar-phosphate backbone links first
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Trace Strand 1
      ctx.beginPath();
      for (let i = 0; i < totalPairs; i++) {
        const theta = currentYaw + (i * Math.PI) / 6;
        const x = cx + radius * Math.cos(theta);
        const y = startY + i * stepY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#0284C7'; // Cyan-blue 5' to 3' strand
      ctx.stroke();

      // Trace Strand 2
      ctx.beginPath();
      for (let i = 0; i < totalPairs; i++) {
        const theta = currentYaw + (i * Math.PI) / 6;
        const x = cx - radius * Math.cos(theta);
        const y = startY + i * stepY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#F97316'; // Amber-orange 3' to 5' strand
      ctx.stroke();

      // Draw rungs (Hydrogen bonded nitrogenous base pairs)
      renderElements.forEach((el) => {
        const { y, x1, z1, x2, z2, base1, base2, idx } = el;

        // Perspective scale factor based on depth
        const scale1 = (z1 + 200) / 200;
        const scale2 = (z2 + 200) / 200;

        // Midpoint of hydrogen bond
        const mx = (x1 + x2) / 2;

        // Base 1 bar
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(mx, y);
        ctx.strokeStyle = BASE_COLORS[base1]?.bg || '#10B981';
        ctx.lineWidth = Math.max(3, 5 * scale1);
        ctx.stroke();

        // Base 2 bar
        ctx.beginPath();
        ctx.moveTo(mx, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = BASE_COLORS[base2]?.bg || '#EF4444';
        ctx.lineWidth = Math.max(3, 5 * scale2);
        ctx.stroke();

        // Hydrogen bonds dotted line in the middle (2 bonds for A=T, 3 bonds for C=G)
        const hBondsCount = (base1 === 'A' || base1 === 'T') ? 2 : 3;
        ctx.fillStyle = '#FFFFFF';
        for (let b = 0; b < hBondsCount; b++) {
          const bOff = (b - (hBondsCount - 1) / 2) * 4;
          ctx.beginPath();
          ctx.arc(mx + bOff, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Spherical Sugar-Phosphate Nodes on Strand 1
        const r1 = Math.max(4, 7 * scale1);
        ctx.beginPath();
        ctx.arc(x1, y, r1, 0, Math.PI * 2);
        ctx.fillStyle = '#0284C7';
        ctx.fill();
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Spherical Sugar-Phosphate Nodes on Strand 2
        const r2 = Math.max(4, 7 * scale2);
        ctx.beginPath();
        ctx.arc(x2, y, r2, 0, Math.PI * 2);
        ctx.fillStyle = '#EA580C';
        ctx.fill();
        ctx.strokeStyle = '#FDBA74';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Text labels for front-most bases
        if (z1 > 30) {
          ctx.font = 'bold 11px system-ui, sans-serif';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(base1, x1 - 18, y + 4);
        }
        if (z2 > 30) {
          ctx.font = 'bold 11px system-ui, sans-serif';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(base2, x2 + 8, y + 4);
        }

        // Highlight 5' and 3' terminal ends at the top and bottom
        if (idx === 0) {
          ctx.font = 'bold 12px monospace';
          ctx.fillStyle = '#38BDF8';
          ctx.fillText("5' Strand A", x1 - 45, y - 10);
          ctx.fillStyle = '#FB923C';
          ctx.fillText("3' Strand B", x2 + 10, y - 10);
        } else if (idx === totalPairs - 1) {
          ctx.font = 'bold 12px monospace';
          ctx.fillStyle = '#38BDF8';
          ctx.fillText("3' Strand A", x1 - 45, y + 20);
          ctx.fillStyle = '#FB923C';
          ctx.fillText("5' Strand B", x2 + 10, y + 20);
        }
      });

      // Overlay watermark / legend in canvas
      ctx.font = '10px monospace';
      ctx.fillStyle = '#64748B';
      ctx.fillText('Watson-Crick B-DNA Model · 10.5 bp/turn · Major & Minor Grooves', 16, height - 16);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isAutoRotating, simSpeed, yawAngle]);

  // Automated 1-Click Simulation sequence
  const handleAutomatedTour = () => {
    setIsPlaying(true);
    setSimSpeed(1.2);
    // Cycle through structure -> replication -> transcription -> translation smoothly
    setActiveTab('replication');
    setForkPosition(20);
    let p = 20;
    const interval = setInterval(() => {
      p += 10;
      if (p <= 90) {
        setForkPosition(p);
      } else {
        clearInterval(interval);
        setActiveTab('transcription');
        setRnaPolymerasePos(1);
        let tr = 1;
        const trInt = setInterval(() => {
          tr += 1;
          setRnaPolymerasePos(tr);
          if (tr >= 9) {
            clearInterval(trInt);
            setActiveTab('translation');
            setRibosomeCodonIndex(0);
          }
        }, 800);
      }
    }, 450);
  };

  // Step 1: Replication Fork forward step
  const handleStepReplication = () => {
    setForkPosition((prev) => (prev >= 90 ? 20 : prev + 15));
    setLeadingPolymerasePos((prev) => (prev >= 85 ? 15 : prev + 15));
  };

  // Step 2: Transcription forward step
  const handleStepTranscription = () => {
    setRnaPolymerasePos((prev) => (prev >= 8 ? 0 : prev + 1));
  };

  // Step 3: Translation forward step
  const handleStepTranslation = () => {
    setRibosomeCodonIndex((prev) => {
      const next = prev >= mrnaCodons.length - 1 ? 0 : prev + 1;
      const currentAA = proteinChain.slice(0, next + 1).map((a) => a.abbr);
      setGrowingPolypeptide(currentAA);
      return next;
    });
  };

  // Codon selector helper
  const handleCodonSelect = (b1, b2, b3) => {
    setSelectedBase1(b1);
    setSelectedBase2(b2);
    setSelectedBase3(b3);
    setSearchCodon(`${b1}${b2}${b3}`);
  };

  // Handle KCSE Quiz Submission
  const handleQuizAnswer = (qId, optionIdx) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleEvaluateQuiz = () => {
    let score = 0;
    KCSE_EXAM_CHALLENGES.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIdx) {
        score += 1;
      }
    });
    setQuizScore(score);
    setShowQuizResults(true);

    if (onTelemetry && !telemetrySent) {
      onTelemetry('kcse_dna_genetics_quiz_completed', {
        score,
        total: KCSE_EXAM_CHALLENGES.length,
        percentage: Math.round((score / KCSE_EXAM_CHALLENGES.length) * 100),
      });
      setTelemetrySent(true);
    }
  };

  const activeCodonData = GENETIC_CODE[searchCodon] || {
    aa: 'Unknown codon',
    abbr: '???',
    color: '#64748B',
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col font-sans">
      {/* 1. TOP HEADER & TELEMETRY BAR */}
      <header className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 shadow-inner">
            <FlaskConical className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                KCSE Biology Form 4 · Topic 2
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Molecular Genetics
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              DNA Structure, Replication & Protein Synthesis 3D
            </h1>
          </div>
        </div>

        {/* 1-Click Automated Tour & Quick Presets */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleAutomatedTour}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40 transition-all cursor-pointer transform active:scale-95"
            title="Automatically run through DNA replication, transcription, and translation"
          >
            <Zap className="w-4 h-4 text-emerald-200 fill-emerald-200" />
            <span>1-Click Full Synthesis Run</span>
          </button>
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            <span>{isPlaying ? 'Pause 3D' : 'Play 3D'}</span>
          </button>
          <button
            onClick={() => {
              setYawAngle(0);
              setForkPosition(45);
              setRnaPolymerasePos(0);
              setRibosomeCodonIndex(0);
              setGrowingPolypeptide(['Met']);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            title="Reset simulation parameters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. NAVIGATION TABS */}
      <nav className="flex overflow-x-auto border-b border-slate-800 bg-slate-900/70 px-4 scrollbar-none">
        {[
          { id: 'structure', label: '3D Double Helix', icon: Layers, desc: 'Antiparallel Watson-Crick model' },
          { id: 'replication', label: 'Step 1: DNA Replication Fork', icon: RefreshCw, desc: 'Helicase & DNA Polymerase' },
          { id: 'transcription', label: 'Step 2: mRNA Transcription', icon: Activity, desc: 'RNA Polymerase & Template' },
          { id: 'translation', label: 'Step 3: Ribosome Translation', icon: Zap, desc: 'tRNA Anticodons & Peptide Bonds' },
          { id: 'codon_table', label: 'Genetic Code & Codon Chart', icon: Search, desc: '64 Triplet Codon Directory' },
          { id: 'kcse_quiz', label: 'KCSE Exam Challenge', icon: Award, desc: 'Form 4 Genetics Mastery' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. MAIN SIMULATION STAGE */}
      <main className="p-4 sm:p-6 flex-1 flex flex-col gap-6">
        {/* TAB 1: 3D DNA DOUBLE HELIX STRUCTURE */}
        {activeTab === 'structure' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 3D Canvas Viewport */}
            <div className="lg:col-span-8 flex flex-col gap-3">
              <div className="relative w-full aspect-[16/10] bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={720}
                  height={450}
                  className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
                  onMouseDown={(e) => {
                    const startX = e.clientX;
                    const initYaw = yawAngle;
                    const handleMouseMove = (moveEvent) => {
                      const deltaX = moveEvent.clientX - startX;
                      setYawAngle(initYaw + deltaX * 0.01);
                    };
                    const handleMouseUp = () => {
                      window.removeEventListener('mousemove', handleMouseMove);
                      window.removeEventListener('mouseup', handleMouseUp);
                    };
                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mouseup', handleMouseUp);
                  }}
                />

                {/* 3D Interactive Floating Badge */}
                <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/70 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-slate-200">Interactive 360° Double Helix</span>
                  <span className="text-[10px] text-slate-400">(Drag to rotate)</span>
                </div>

                {/* Helix Speed & Rotation Quick Controls */}
                <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-800 flex items-center gap-3">
                  <span className="text-[11px] font-medium text-slate-400">Rotation:</span>
                  <button
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      isAutoRotating ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isAutoRotating ? 'Auto' : 'Manual'}
                  </button>
                  <button
                    onClick={() => setSimSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
                    className="px-2 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-indigo-300 cursor-pointer"
                  >
                    {simSpeed}x
                  </button>
                </div>
              </div>

              {/* Complementary Base Pairing Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { base: 'A', name: 'Adenine (Purine)', pairs: 'Thymine (T)', bonds: '2 H-Bonds', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
                  { base: 'T', name: 'Thymine (Pyrimidine)', pairs: 'Adenine (A)', bonds: '2 H-Bonds', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
                  { base: 'C', name: 'Cytosine (Pyrimidine)', pairs: 'Guanine (G)', bonds: '3 H-Bonds', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
                  { base: 'G', name: 'Guanine (Purine)', pairs: 'Cytosine (C)', bonds: '3 H-Bonds', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
                ].map((item) => (
                  <div key={item.base} className={`p-3 rounded-2xl border ${item.color} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black font-mono">{item.base}</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold opacity-80">{item.bonds}</span>
                    </div>
                    <div className="mt-1">
                      <div className="text-xs font-semibold">{item.name}</div>
                      <div className="text-[11px] opacity-75 mt-0.5">Pairs with: {item.pairs}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Anatomical Key & Watson-Crick Analysis */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    Watson-Crick Double Helix Rules
                  </h3>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="font-bold text-sky-400">1. Antiparallel Strands:</span>
                    <p className="mt-1 text-slate-400">
                      One strand runs in the <strong>5&apos; → 3&apos;</strong> direction while the opposite complementary strand runs antiparallel in the <strong>3&apos; → 5&apos;</strong> direction.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="font-bold text-amber-400">2. Sugar-Phosphate Backbone:</span>
                    <p className="mt-1 text-slate-400">
                      Formed of alternating <strong>deoxyribose sugars</strong> and <strong>phosphate groups</strong> linked by strong covalent <strong>phosphodiester bonds</strong>.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="font-bold text-emerald-400">3. Chargaff&apos;s Base-Pairing Rules:</span>
                    <p className="mt-1 text-slate-400">
                      A purine always pairs with a pyrimidine:
                      <code className="block mt-1 p-2 bg-slate-900 rounded font-mono text-emerald-300">
                        Adenine (A) = Thymine (T) [2 H-bonds]
                        <br />
                        Guanine (G) ≡ Cytosine (C) [3 H-bonds]
                      </code>
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="font-bold text-purple-400">4. Physical Dimensions:</span>
                    <p className="mt-1 text-slate-400">
                      Diameter is <strong>2.0 nm</strong>. One complete 360° helical turn spans <strong>3.4 nm</strong> and contains approximately <strong>10.5 base pairs</strong>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('replication')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg transition cursor-pointer"
                >
                  <span>Proceed to Step 1: DNA Replication</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STEP 1 - DNA REPLICATION FORK */}
        {activeTab === 'replication' && (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-emerald-400" />
                    Step 1: Semi-Conservative Replication Fork
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Enzymatic unwinding by <strong>DNA Helicase</strong> and 5&apos; to 3&apos; synthesis by <strong>DNA Polymerase</strong>.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleStepReplication}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span>Advance Replication Fork</span>
                  </button>
                  <button
                    onClick={() => {
                      setForkPosition(20);
                      setLeadingPolymerasePos(15);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                    title="Reset fork"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Graphical Replication Fork Model */}
              <div className="relative w-full bg-slate-950 rounded-2xl border border-slate-800 p-6 overflow-hidden min-h-[360px] flex flex-col justify-between">
                {/* Visual Fork Representation */}
                <div className="relative w-full h-64 flex items-center">
                  {/* Intact Parent Duplex (Right Side) */}
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-16 border-2 border-dashed border-indigo-500/40 rounded-xl flex items-center justify-center px-4 bg-indigo-950/20"
                    style={{ width: `${100 - forkPosition}%` }}
                  >
                    <div className="text-center">
                      <span className="text-xs font-mono font-bold text-indigo-300">Intact Parent Duplex</span>
                      <span className="block text-[10px] text-slate-400">Hydrogen bonds intact</span>
                    </div>
                  </div>

                  {/* DNA Helicase Enzyme Wedge */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-16 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 border-2 border-amber-300 shadow-xl flex flex-col items-center justify-center text-center p-1.5 transition-all duration-500"
                    style={{ left: `${forkPosition}%` }}
                  >
                    <Zap className="w-5 h-5 text-amber-100 animate-bounce" />
                    <span className="text-[10px] font-black text-white leading-tight uppercase mt-0.5">Helicase</span>
                    <span className="text-[8px] text-amber-100 font-mono">Unzips H-bonds</span>
                  </div>

                  {/* Top Arm: Leading Strand (Continuous synthesis 5' to 3') */}
                  <div
                    className="absolute top-4 left-0 h-20 flex flex-col justify-between"
                    style={{ width: `${forkPosition}%` }}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sky-400 border-b border-sky-500/40 pb-1">
                      <span>3&apos; Parent Template Strand (Leading)</span>
                      <span>5&apos;</span>
                    </div>

                    {/* Synthesized Daughter Strand */}
                    <div className="relative w-full h-8 bg-sky-950/40 rounded-lg border border-sky-500/40 flex items-center px-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center px-2 text-[10px] font-black text-slate-950 transition-all duration-500"
                        style={{ width: `${Math.min(100, (leadingPolymerasePos / forkPosition) * 100)}%` }}
                      >
                        5&apos; → 3&apos; Continuous Leading Daughter Strand
                      </div>

                      {/* DNA Polymerase III Icon */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-emerald-600 border-2 border-emerald-300 shadow-lg flex flex-col items-center justify-center text-center transition-all duration-500"
                        style={{ left: `${Math.min(forkPosition - 5, leadingPolymerasePos)}%` }}
                      >
                        <span className="text-[9px] font-black text-white">DNA Pol</span>
                        <span className="text-[7px] text-emerald-200">Leading</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Arm: Lagging Strand (Discontinuous Okazaki fragments) */}
                  <div
                    className="absolute bottom-4 left-0 h-20 flex flex-col justify-between"
                    style={{ width: `${forkPosition}%` }}
                  >
                    {/* Synthesized Okazaki fragments */}
                    <div className="w-full h-8 bg-orange-950/40 rounded-lg border border-orange-500/40 flex items-center gap-3 px-2">
                      <div className="w-24 h-6 rounded bg-amber-500/80 border border-amber-300 flex items-center justify-center text-[9px] font-bold text-slate-950">
                        Okazaki Frag #1
                      </div>
                      <div className="w-20 h-6 rounded bg-amber-500/80 border border-amber-300 flex items-center justify-center text-[9px] font-bold text-slate-950">
                        Okazaki Frag #2
                      </div>
                      <div className="px-2 py-0.5 rounded bg-rose-500/60 text-white text-[8px] font-bold">
                        RNA Primer
                      </div>
                      <div className="ml-auto px-2 py-0.5 rounded bg-indigo-500/60 text-indigo-100 text-[8px] font-bold">
                        DNA Ligase Seals
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-400 border-t border-amber-500/40 pt-1">
                      <span>5&apos; Parent Template Strand (Lagging)</span>
                      <span>3&apos;</span>
                    </div>
                  </div>
                </div>

                {/* Fork Telemetry & Key Concept Callouts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-bold text-emerald-400">Leading Strand Synthesis:</span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Synthesized <strong>continuously</strong> toward the replication fork in the 5&apos; to 3&apos; direction using single RNA primer.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-bold text-amber-400">Lagging Strand Synthesis:</span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Synthesized <strong>discontinuously</strong> away from the fork as short <strong>Okazaki fragments</strong>, joined by <strong>DNA Ligase</strong>.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-bold text-purple-400">Semi-Conservative Rule:</span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Each new DNA double helix contains <strong>one intact conserved parental strand</strong> and <strong>one newly synthesized daughter strand</strong> (Meselson-Stahl).
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveTab('transcription')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg transition cursor-pointer"
                >
                  <span>Proceed to Step 2: mRNA Transcription</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STEP 2 - TRANSCRIPTION */}
        {activeTab === 'transcription' && (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    Step 2: Transcription of mRNA in the Nucleus
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    <strong>RNA Polymerase</strong> reads the 3&apos; → 5&apos; template DNA strand to synthesize complementary single-stranded <strong>mRNA</strong> (Uracil substituting Thymine).
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleStepTranscription}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span>Advance RNA Polymerase</span>
                  </button>
                  <button
                    onClick={() => setRnaPolymerasePos(0)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                    title="Restart transcription"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Visual Nucleotide Pairing Matrix */}
              <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 p-6 overflow-x-auto space-y-6">
                {/* 1. Coding Strand (5' to 3') Non-Template */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      5&apos; Coding Strand (Non-Template DNA):
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Sense Strand</span>
                  </div>
                  <div className="flex gap-1.5 font-mono text-xs">
                    {codingStrand.split('').map((base, idx) => (
                      <span
                        key={idx}
                        className="w-7 h-8 rounded-lg flex items-center justify-center font-bold bg-slate-900 border border-slate-800 text-slate-400"
                      >
                        {base}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Template Strand (3' to 5') Read by RNA Polymerase */}
                <div className="relative py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      3&apos; Template Strand (Antisense DNA):
                    </span>
                    <span className="text-[10px] text-amber-400/80 font-mono">Transcribed Strand</span>
                  </div>
                  <div className="flex gap-1.5 font-mono text-xs">
                    {templateStrand.split('').map((base, idx) => {
                      const isTranscribed = idx < rnaPolymerasePos * 3;
                      const isCurrent = Math.floor(idx / 3) === rnaPolymerasePos;
                      return (
                        <span
                          key={idx}
                          className={`w-7 h-8 rounded-lg flex items-center justify-center font-bold transition-all duration-300 ${
                            isCurrent
                              ? 'bg-indigo-600 text-white scale-110 shadow-lg border border-indigo-300 z-10'
                              : isTranscribed
                              ? 'bg-amber-950/60 border border-amber-500/50 text-amber-300'
                              : 'bg-slate-900 border border-slate-800 text-slate-400'
                          }`}
                        >
                          {base}
                        </span>
                      );
                    })}
                  </div>

                  {/* RNA Polymerase Bubble Overlay */}
                  <div
                    className="absolute -top-3 h-28 border-2 border-indigo-400 rounded-3xl bg-indigo-500/15 backdrop-blur-xs flex items-center justify-center transition-all duration-500 pointer-events-none"
                    style={{
                      left: `${rnaPolymerasePos * 3 * 34}px`,
                      width: '110px',
                    }}
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 bg-slate-950/80 px-2 py-0.5 rounded-full border border-indigo-500/50">
                      RNA Polymerase
                    </span>
                  </div>
                </div>

                {/* 3. Emerging mRNA Transcript (5' to 3') */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      5&apos; Emerging mRNA Transcript:
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Uracil replaces Thymine</span>
                  </div>
                  <div className="flex gap-1.5 font-mono text-xs">
                    {mrnaStrand.split('').map((base, idx) => {
                      const isSynthesized = idx < rnaPolymerasePos * 3;
                      if (!isSynthesized) {
                        return (
                          <span
                            key={idx}
                            className="w-7 h-8 rounded-lg flex items-center justify-center font-bold border border-dashed border-slate-800 text-slate-700"
                          >
                            ·
                          </span>
                        );
                      }
                      return (
                        <span
                          key={idx}
                          className={`w-7 h-8 rounded-lg flex items-center justify-center font-bold ${
                            base === 'U'
                              ? 'bg-purple-600 text-white border border-purple-400 font-black'
                              : 'bg-emerald-600 text-white border border-emerald-400'
                          }`}
                        >
                          {base}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Key Concept Callout */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3 text-xs text-indigo-200">
                <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-100">KCSE Crucial Distinction:</strong> Unlike DNA, RNA contains <strong>ribose sugar</strong> (instead of deoxyribose) and uses the pyrimidine <strong>Uracil (U)</strong> in place of <strong>Thymine (T)</strong>. The mRNA transcript exits nuclear pores into the cytoplasm to attach to a ribosome for translation.
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveTab('translation')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg transition cursor-pointer"
                >
                  <span>Proceed to Step 3: Ribosome Translation</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STEP 3 - TRANSLATION */}
        {activeTab === 'translation' && (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    Step 3: Translation on the Ribosome (Polypeptide Synthesis)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    tRNA molecules carry specific amino acids to the ribosome; their <strong>anticodons</strong> bind complementary <strong>mRNA codons</strong> via peptide bonds.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleStepTranslation}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span>Advance Next Codon / tRNA</span>
                  </button>
                  <button
                    onClick={() => {
                      setRibosomeCodonIndex(0);
                      setGrowingPolypeptide(['Met']);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                    title="Reset translation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Ribosome Anatomy & Translation Viewport */}
              <div className="relative w-full bg-slate-950 rounded-2xl border border-slate-800 p-6 overflow-hidden flex flex-col items-center gap-8 min-h-[420px]">
                {/* 1. Growing Polypeptide Chain at Top */}
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs font-mono font-bold text-amber-300 mb-2 uppercase tracking-wider">
                    Elongating Polypeptide Chain (Peptide Bonds Formed by Peptidyl Transferase)
                  </span>
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {growingPolypeptide.map((aa, idx) => (
                      <React.Fragment key={idx}>
                        <div className="px-3 py-1.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-mono text-xs font-black shadow-md border border-indigo-400/50 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>{aa}</span>
                        </div>
                        {idx < growingPolypeptide.length - 1 && (
                          <span className="text-amber-400 font-bold text-sm">─</span>
                        )}
                      </React.Fragment>
                    ))}
                    {growingPolypeptide.length === proteinChain.length && (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono">
                        STOP (Release Factor)
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Ribosome Organelle (Large 60S & Small 40S Subunits) */}
                <div className="relative w-full max-w-xl bg-slate-900/90 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-5">
                  <div className="absolute -top-3.5 bg-indigo-600 text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow">
                    Ribosome Functional Complex (P-Site & A-Site)
                  </div>

                  {/* Active tRNA Docking Site */}
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {/* P-Site (Peptidyl) */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 flex flex-col items-center text-center">
                      <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wide">P-Site (Peptidyl)</span>
                      <div className="w-16 h-20 my-2 rounded-xl bg-indigo-600/30 border border-indigo-400/60 flex flex-col items-center justify-between p-2">
                        <span className="text-[10px] font-mono font-black text-amber-300">
                          {proteinChain[ribosomeCodonIndex]?.abbr || 'Met'}
                        </span>
                        <div className="text-[9px] font-mono text-slate-300">tRNA</div>
                        <span className="text-[10px] font-mono font-bold text-sky-300">
                          {mrnaCodons[ribosomeCodonIndex]
                            ?.split('')
                            .map((b) => (b === 'A' ? 'U' : b === 'U' ? 'A' : b === 'C' ? 'G' : 'C'))
                            .join('') || 'UAC'}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">Holds growing chain</span>
                    </div>

                    {/* A-Site (Aminoacyl) */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex flex-col items-center text-center">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">A-Site (Aminoacyl)</span>
                      <div className="w-16 h-20 my-2 rounded-xl bg-emerald-600/30 border border-emerald-400/60 flex flex-col items-center justify-between p-2">
                        <span className="text-[10px] font-mono font-black text-emerald-300">
                          {proteinChain[ribosomeCodonIndex + 1]?.abbr || '...'}
                        </span>
                        <div className="text-[9px] font-mono text-slate-300">tRNA</div>
                        <span className="text-[10px] font-mono font-bold text-sky-300">
                          {mrnaCodons[ribosomeCodonIndex + 1]
                            ?.split('')
                            .map((b) => (b === 'A' ? 'U' : b === 'U' ? 'A' : b === 'C' ? 'G' : 'C'))
                            .join('') || '...'}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">Receives incoming tRNA</span>
                    </div>
                  </div>

                  {/* mRNA Ribbon Passing Through Ribosome */}
                  <div className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-center gap-2 overflow-x-auto">
                    <span className="text-[11px] font-mono text-sky-400 font-bold">5&apos;</span>
                    {mrnaCodons.map((codon, cIdx) => {
                      const isCurrent = cIdx === ribosomeCodonIndex;
                      return (
                        <div
                          key={cIdx}
                          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-black transition-all ${
                            isCurrent
                              ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg border-2 border-amber-200'
                              : cIdx < ribosomeCodonIndex
                              ? 'bg-slate-800 text-slate-500'
                              : 'bg-slate-900 text-indigo-300 border border-slate-700'
                          }`}
                        >
                          {codon}
                        </div>
                      );
                    })}
                    <span className="text-[11px] font-mono text-sky-400 font-bold">3&apos;</span>
                  </div>
                </div>

                {/* Live Translation Summary Banner */}
                <div className="w-full max-w-xl p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Current Codon:</span>{' '}
                    <strong className="font-mono text-amber-300">{mrnaCodons[ribosomeCodonIndex]}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Anticodon:</span>{' '}
                    <strong className="font-mono text-sky-300">
                      {mrnaCodons[ribosomeCodonIndex]
                        ?.split('')
                        .map((b) => (b === 'A' ? 'U' : b === 'U' ? 'A' : b === 'C' ? 'G' : 'C'))
                        .join('')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Amino Acid:</span>{' '}
                    <strong className="text-emerald-300">{proteinChain[ribosomeCodonIndex]?.aa}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CODON TABLE LOOKUP */}
        {activeTab === 'codon_table' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Codon Dial / Picker */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Search className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black text-white">Interactive Triplet Codon Finder</h3>
              </div>

              {/* Base 1, 2, 3 Selector */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">1st Base (5&apos; End):</label>
                  <div className="grid grid-cols-4 gap-2 font-mono">
                    {['U', 'C', 'A', 'G'].map((b) => (
                      <button
                        key={b}
                        onClick={() => handleCodonSelect(b, selectedBase2, selectedBase3)}
                        className={`py-2 rounded-xl text-sm font-black transition cursor-pointer ${
                          selectedBase1 === b
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">2nd Base (Middle):</label>
                  <div className="grid grid-cols-4 gap-2 font-mono">
                    {['U', 'C', 'A', 'G'].map((b) => (
                      <button
                        key={b}
                        onClick={() => handleCodonSelect(selectedBase1, b, selectedBase3)}
                        className={`py-2 rounded-xl text-sm font-black transition cursor-pointer ${
                          selectedBase2 === b
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">3rd Base (3&apos; End):</label>
                  <div className="grid grid-cols-4 gap-2 font-mono">
                    {['U', 'C', 'A', 'G'].map((b) => (
                      <button
                        key={b}
                        onClick={() => handleCodonSelect(selectedBase1, selectedBase2, b)}
                        className={`py-2 rounded-xl text-sm font-black transition cursor-pointer ${
                          selectedBase3 === b
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Codon Lookup Result Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-slate-400">Selected Codon:</span>
                  <span className="text-2xl font-black font-mono text-amber-400">{searchCodon}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Encoded Amino Acid:</span>
                  <span className="text-base font-bold text-white">{activeCodonData.aa}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">tRNA Anticodon:</span>
                  <span className="text-sm font-mono font-bold text-sky-400">
                    {searchCodon
                      .split('')
                      .map((b) => (b === 'A' ? 'U' : b === 'U' ? 'A' : b === 'C' ? 'G' : 'C'))
                      .join('')}
                  </span>
                </div>
                {activeCodonData.start && (
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold text-center">
                    START Codon (Initiates translation)
                  </div>
                )}
                {activeCodonData.stop && (
                  <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold text-center">
                    Nonsense / STOP Codon (Terminates translation)
                  </div>
                )}
              </div>
            </div>

            {/* Standard 64-Codon Matrix Grid */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Universal Genetic Code (64 Codons)
                </h3>
                <span className="text-xs text-slate-400">Degenerate / Non-overlapping</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 max-h-[380px] overflow-y-auto p-1 font-mono text-[11px]">
                {Object.entries(GENETIC_CODE).map(([codon, info]) => {
                  const isMatch = codon === searchCodon;
                  return (
                    <button
                      key={codon}
                      onClick={() => handleCodonSelect(codon[0], codon[1], codon[2])}
                      className={`p-1.5 rounded-lg border text-center transition cursor-pointer flex flex-col justify-between ${
                        isMatch
                          ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-300'
                          : info.stop
                          ? 'bg-rose-950/40 border-rose-800/40 text-rose-300 hover:bg-rose-900/60'
                          : info.start
                          ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/60'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="font-black text-xs">{codon}</span>
                      <span className="text-[9px] opacity-80 mt-0.5 truncate">{info.abbr}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p>
                  <strong>Degeneracy of the Genetic Code:</strong> Multiple codons code for the same amino acid (e.g. 6 different codons code for Leucine: UUA, UUG, CUU, CUC, CUA, CUG).
                </p>
                <p>
                  <strong>Universal Nature:</strong> The same codons code for identical amino acids across bacteria, plants, and humans, serving as compelling evidence for common descent.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: KCSE EXAM CHALLENGES */}
        {activeTab === 'kcse_quiz' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  KCSE Form 4 Genetics Examination Challenges
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Test your mastery of base pairing, transcription, sickle cell mutation, and replication enzymes.
                </p>
              </div>
              {showQuizResults && (
                <div className="px-4 py-2 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
                  Score: {quizScore} / {KCSE_EXAM_CHALLENGES.length} (
                  {Math.round((quizScore / KCSE_EXAM_CHALLENGES.length) * 100)}%)
                </div>
              )}
            </div>

            <div className="space-y-6">
              {KCSE_EXAM_CHALLENGES.map((q) => {
                const userChoice = selectedAnswers[q.id];
                const isCorrect = userChoice === q.correctIdx;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
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
                          btnStyle = 'bg-indigo-600 text-white border-indigo-400 font-bold';
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
                disabled={Object.keys(selectedAnswers).length < KCSE_EXAM_CHALLENGES.length}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg transition cursor-pointer"
              >
                Submit Answers & Evaluate
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 4. FOOTER & SYLLABUS REFERENCE */}
      <footer className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>KCSE Form 4 Syllabus: Unit 2 · Genetics · DNA Replication & Protein Synthesis</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Purines: Adenine & Guanine</span>
          <span>Pyrimidines: Cytosine, Thymine & Uracil</span>
        </div>
      </footer>
    </div>
  );
}
