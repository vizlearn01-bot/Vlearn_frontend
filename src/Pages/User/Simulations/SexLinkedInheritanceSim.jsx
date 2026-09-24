import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Dna,
  Activity,
  Eye,
  EyeOff,
  Droplets,
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  Sparkles,
  User,
  Users,
  ShieldAlert,
  ShieldCheck,
  Zap,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Layers,
  Sliders,
  Split,
} from 'lucide-react';

// ============================================================================
// GENETIC CONSTANTS & TRAIT CONFIGURATIONS (KCSE Form 4 Syllabus)
// ============================================================================

const CONDITIONS = {
  colour_blindness: {
    id: 'colour_blindness',
    name: 'Red-Green Colour Blindness',
    domSymbol: 'B',
    recSymbol: 'b',
    domAlleleText: 'Xᴮ',
    recAlleleText: 'Xᵇ',
    domLabel: 'Normal Vision',
    recLabel: 'Colour Blind',
    geneName: 'OPN1LW / OPN1MW (Cone Photopsins)',
    cytoband: 'Xq28 (Long arm non-homologous segment)',
    description:
      'Recessive mutation causing dysfunction of red-sensitive or green-sensitive cone photopigments in the retina. Affects approximately 8% of males and less than 0.5% of females.',
    primaryColor: '#10b981', // emerald
    mutantColor: '#f43f5e', // rose
  },
  haemophilia: {
    id: 'haemophilia',
    name: 'Haemophilia A (Factor VIII Deficiency)',
    domSymbol: 'H',
    recSymbol: 'h',
    domAlleleText: 'Xᴴ',
    recAlleleText: 'Xʰ',
    domLabel: 'Normal Blood Clotting',
    recLabel: 'Haemophiliac (Bleeder)',
    geneName: 'F8 (Coagulation Factor VIII)',
    cytoband: 'Xq28 (Long arm non-homologous segment)',
    description:
      'Recessive mutation leading to deficiency of clotting Factor VIII. Blood fails to coagulate normally, leading to prolonged haemorrhage and joint haematomas.',
    primaryColor: '#3b82f6', // blue
    mutantColor: '#e11d48', // ruby rose
  },
};

// Preset Scenarios
const PRESETS = [
  {
    id: 'carrier_mother_normal_father',
    name: 'Carrier Mother × Normal Father',
    condition: 'colour_blindness',
    mother: 'carrier',
    father: 'normal',
    badge: 'Standard KCSE Cross',
    takeaway:
      '50% of sons are colour-blind; 50% of daughters are carriers. Mother transmits the mutant allele to half her sons.',
  },
  {
    id: 'normal_mother_affected_father',
    name: 'Normal Mother × Affected Father',
    condition: 'colour_blindness',
    mother: 'normal',
    father: 'affected',
    badge: 'Criss-Cross Inheritance',
    takeaway:
      '100% of daughters become carriers (father transmits his only X); 0% of sons are affected (sons receive father’s Y).',
  },
  {
    id: 'carrier_mother_affected_father',
    name: 'Carrier Mother × Affected Father',
    condition: 'colour_blindness',
    mother: 'carrier',
    father: 'affected',
    badge: 'Affected Daughter Possible',
    takeaway:
      '50% of daughters are affected (homozygous recessive XᵇXᵇ), 50% carriers; 50% of sons are affected. Shows when females can express the condition.',
  },
  {
    id: 'affected_mother_normal_father',
    name: 'Affected Mother × Normal Father',
    condition: 'colour_blindness',
    mother: 'affected',
    father: 'normal',
    badge: '100% Affected Sons',
    takeaway:
      '100% of sons are affected because every son must inherit a mutant maternal X. 100% of daughters are carriers.',
  },
];

// KCSE Examination Review Questions
const KCSE_QUESTIONS = [
  {
    id: 1,
    question:
      'Explain why sex-linked recessive traits such as haemophilia and red-green colour blindness occur far more frequently in human males than in females.',
    options: [
      {
        id: 'A',
        text: 'The Y chromosome carries a suppressor gene that actively destroys clotting factors in males.',
      },
      {
        id: 'B',
        text: 'Males are hemizygous (XY) and have only one X chromosome; the non-homologous portion of the Y chromosome lacks a corresponding allele to mask a recessive mutant gene.',
        correct: true,
      },
      {
        id: 'C',
        text: 'Females have testosterone which provides metabolic protection against X-linked point mutations.',
      },
      {
        id: 'D',
        text: 'X chromosomes in females undergo meiotic degradation, making mutant alleles inert.',
      },
    ],
    explanation:
      'Males possess only one X chromosome (hemizygous). Because the differential (non-homologous) region of the Y chromosome has no homologous locus for the clotting factor or cone opsin genes, a single recessive allele on the X chromosome is immediately expressed phenotypically. Females have two X chromosomes (XX) and require two recessive alleles to express the trait.',
    kcseRef: 'KCSE Biology Paper 2 · Section B (Genetics)',
  },
  {
    id: 2,
    question:
      'A man with haemophilia marries a homozygous normal woman. What proportion of their male offspring is expected to have haemophilia?',
    options: [
      { id: 'A', text: '100% of sons' },
      { id: 'B', text: '50% of sons' },
      { id: 'C', text: '0% of sons', correct: true },
      { id: 'D', text: '25% of sons' },
    ],
    explanation:
      'A haemophiliac father (XʰY) contributes his Y chromosome to all his male offspring, while the mother (XᴴXᴴ) contributes a normal Xᴴ chromosome to all offspring. Therefore, all sons inherit XᴴY and are 100% normal. The father passes his mutant Xʰ chromosome exclusively to his daughters, making 100% of them carriers (XᴴXʰ).',
    kcseRef: 'KCSE Biology Paper 1 & 2 · Pedigrees',
  },
  {
    id: 3,
    question:
      'Under which specific parental genetic combination can a phenotypically colour-blind female child (XᵇXᵇ) be produced?',
    options: [
      { id: 'A', text: 'Homozygous normal mother (XᴮXᴮ) and colour-blind father (XᵇY)' },
      {
        id: 'B',
        text: 'Carrier mother (XᴮXᵇ) and colour-blind father (XᵇY)',
        correct: true,
      },
      { id: 'C', text: 'Carrier mother (XᴮXᵇ) and normal-vision father (XᴮY)' },
      { id: 'D', text: 'Homozygous normal mother (XᴮXᴮ) and normal father (XᴮY)' },
    ],
    explanation:
      'For a female child to be colour-blind, she must inherit one recessive allele from each parent (genotype XᵇXᵇ). Her father MUST be colour-blind (XᵇY) to donate the paternal Xᵇ, and her mother must carry at least one recessive allele (either a carrier XᴮXᵇ or affected XᵇXᵇ).',
    kcseRef: 'KCSE Form 4 Biology · Sex-Linkage Rules',
  },
  {
    id: 4,
    question:
      'What is the precise genetic term that describes the phenomenon where an affected grandfather transmits an X-linked recessive trait to his grandson through a carrier daughter?',
    options: [
      { id: 'A', text: 'Incomplete dominance' },
      { id: 'B', text: 'Criss-cross inheritance', correct: true },
      { id: 'C', text: 'Holandric transmission' },
      { id: 'D', text: 'Epistatic masking' },
    ],
    explanation:
      'Criss-cross inheritance refers to the transmission of a gene from father to daughter (who is a phenotypically unaffected carrier) and from daughter to her son (the grandson, who expresses the recessive phenotype). Holandric inheritance refers exclusively to Y-linked genes transmitted father-to-son.',
    kcseRef: 'KCSE Form 4 Term 1 Genetics Glossary',
  },
];

// Pre-calculated Ishihara plate dot patterns for responsive SVG canvas
const ISHIHARA_DOTS = [
  // Digit 7 & 2 dots (left side)
  { cx: 125, cy: 78, r: 8, isNumber74: true, isNumber21: false },
  { cx: 140, cy: 78, r: 9, isNumber74: true, isNumber21: false },
  { cx: 155, cy: 79, r: 8, isNumber74: true, isNumber21: true },
  { cx: 170, cy: 80, r: 7, isNumber74: true, isNumber21: true },
  { cx: 180, cy: 88, r: 8, isNumber74: true, isNumber21: true },
  { cx: 176, cy: 102, r: 8, isNumber74: true, isNumber21: true },
  { cx: 168, cy: 116, r: 9, isNumber74: true, isNumber21: false },
  { cx: 160, cy: 130, r: 8, isNumber74: true, isNumber21: true },
  { cx: 152, cy: 146, r: 9, isNumber74: true, isNumber21: true },
  { cx: 146, cy: 162, r: 8, isNumber74: true, isNumber21: true },
  { cx: 140, cy: 176, r: 7, isNumber74: true, isNumber21: true },
  { cx: 134, cy: 190, r: 8, isNumber74: true, isNumber21: true },
  { cx: 126, cy: 204, r: 8, isNumber74: false, isNumber21: true },
  { cx: 140, cy: 204, r: 9, isNumber74: false, isNumber21: true },
  { cx: 154, cy: 204, r: 8, isNumber74: false, isNumber21: true },
  { cx: 168, cy: 204, r: 8, isNumber74: false, isNumber21: true },

  // Digit 4 & 1 dots (right side)
  { cx: 215, cy: 80, r: 8, isNumber74: true, isNumber21: false },
  { cx: 210, cy: 95, r: 7, isNumber74: true, isNumber21: false },
  { cx: 205, cy: 110, r: 9, isNumber74: true, isNumber21: false },
  { cx: 200, cy: 125, r: 8, isNumber74: true, isNumber21: false },
  { cx: 195, cy: 140, r: 7, isNumber74: true, isNumber21: false },
  { cx: 210, cy: 140, r: 8, isNumber74: true, isNumber21: false },
  { cx: 225, cy: 140, r: 9, isNumber74: true, isNumber21: true },
  { cx: 240, cy: 140, r: 8, isNumber74: true, isNumber21: true },
  { cx: 250, cy: 140, r: 7, isNumber74: true, isNumber21: false },
  { cx: 235, cy: 85, r: 8, isNumber74: true, isNumber21: true },
  { cx: 235, cy: 100, r: 8, isNumber74: true, isNumber21: true },
  { cx: 235, cy: 115, r: 9, isNumber74: true, isNumber21: true },
  { cx: 235, cy: 130, r: 7, isNumber74: true, isNumber21: true },
  { cx: 235, cy: 155, r: 8, isNumber74: true, isNumber21: true },
  { cx: 235, cy: 170, r: 9, isNumber74: true, isNumber21: true },
  { cx: 235, cy: 185, r: 8, isNumber74: true, isNumber21: true },
  { cx: 235, cy: 200, r: 8, isNumber74: true, isNumber21: true },

  // Background ring dots
  { cx: 65, cy: 80, r: 9, isNumber74: false, isNumber21: false },
  { cx: 85, cy: 60, r: 7, isNumber74: false, isNumber21: false },
  { cx: 110, cy: 50, r: 9, isNumber74: false, isNumber21: false },
  { cx: 140, cy: 45, r: 8, isNumber74: false, isNumber21: false },
  { cx: 170, cy: 45, r: 9, isNumber74: false, isNumber21: false },
  { cx: 200, cy: 50, r: 8, isNumber74: false, isNumber21: false },
  { cx: 225, cy: 60, r: 7, isNumber74: false, isNumber21: false },
  { cx: 250, cy: 80, r: 8, isNumber74: false, isNumber21: false },
  { cx: 265, cy: 105, r: 9, isNumber74: false, isNumber21: false },
  { cx: 270, cy: 135, r: 8, isNumber74: false, isNumber21: false },
  { cx: 265, cy: 165, r: 9, isNumber74: false, isNumber21: false },
  { cx: 255, cy: 195, r: 8, isNumber74: false, isNumber21: false },
  { cx: 230, cy: 220, r: 9, isNumber74: false, isNumber21: false },
  { cx: 200, cy: 235, r: 8, isNumber74: false, isNumber21: false },
  { cx: 170, cy: 240, r: 9, isNumber74: false, isNumber21: false },
  { cx: 140, cy: 240, r: 8, isNumber74: false, isNumber21: false },
  { cx: 110, cy: 235, r: 7, isNumber74: false, isNumber21: false },
  { cx: 85, cy: 220, r: 9, isNumber74: false, isNumber21: false },
  { cx: 65, cy: 195, r: 8, isNumber74: false, isNumber21: false },
  { cx: 55, cy: 165, r: 7, isNumber74: false, isNumber21: false },
  { cx: 50, cy: 135, r: 9, isNumber74: false, isNumber21: false },
  { cx: 55, cy: 105, r: 8, isNumber74: false, isNumber21: false },

  // Inner fillers
  { cx: 80, cy: 100, r: 7, isNumber74: false, isNumber21: false },
  { cx: 95, cy: 85, r: 8, isNumber74: false, isNumber21: false },
  { cx: 90, cy: 120, r: 9, isNumber74: false, isNumber21: false },
  { cx: 85, cy: 145, r: 7, isNumber74: false, isNumber21: false },
  { cx: 90, cy: 170, r: 8, isNumber74: false, isNumber21: false },
  { cx: 105, cy: 190, r: 9, isNumber74: false, isNumber21: false },
  { cx: 105, cy: 110, r: 8, isNumber74: false, isNumber21: false },
  { cx: 105, cy: 135, r: 7, isNumber74: false, isNumber21: false },
  { cx: 105, cy: 160, r: 8, isNumber74: false, isNumber21: false },
  { cx: 125, cy: 100, r: 8, isNumber74: false, isNumber21: false },
  { cx: 120, cy: 125, r: 9, isNumber74: false, isNumber21: false },
  { cx: 120, cy: 150, r: 7, isNumber74: false, isNumber21: false },
  { cx: 185, cy: 170, r: 8, isNumber74: false, isNumber21: false },
  { cx: 195, cy: 190, r: 9, isNumber74: false, isNumber21: false },
  { cx: 205, cy: 170, r: 7, isNumber74: false, isNumber21: false },
  { cx: 215, cy: 195, r: 8, isNumber74: false, isNumber21: false },
  { cx: 215, cy: 220, r: 9, isNumber74: false, isNumber21: false },
  { cx: 250, cy: 115, r: 7, isNumber74: false, isNumber21: false },
  { cx: 255, cy: 165, r: 8, isNumber74: false, isNumber21: false },
];

// ============================================================================
// CHROMOSOME VECTOR SVG COMPONENT
// ============================================================================

function ChromosomeVector({
  type = 'X', // 'X' | 'Y'
  allele = 'dom', // 'dom' | 'rec' | null
  condition = 'colour_blindness',
  size = 'md', // 'sm' | 'md' | 'lg'
  highlightLocus = true,
  label = null,
}) {
  const cond = CONDITIONS[condition];
  const isX = type === 'X';
  const isMutant = allele === 'rec';

  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.15 : 0.85;
  const height = isX ? 150 * scale : 75 * scale;
  const width = 36 * scale;

  return (
    <div className="flex flex-col items-center">
      <svg
        width={width + 30}
        height={height + 24}
        viewBox={`0 0 ${width + 30} ${height + 24}`}
        className="overflow-visible transition-transform duration-300"
      >
        <g transform="translate(15, 6)">
          {isX ? (
            // ==================== X CHROMOSOME ====================
            <g>
              {/* Short Arm (p-arm) */}
              <rect
                x="6"
                y="0"
                width={width - 12}
                height={height * 0.38}
                rx="6"
                fill="#6366f1"
                stroke="#1e1b4b"
                strokeWidth="1.5"
              />
              {/* p-arm G-banding stripes */}
              <rect
                x="8"
                y={height * 0.08}
                width={width - 16}
                height="3.5"
                fill="#312e81"
                opacity="0.8"
                rx="1"
              />
              <rect
                x="8"
                y={height * 0.22}
                width={width - 16}
                height="4"
                fill="#1e1b4b"
                opacity="0.85"
                rx="1"
              />

              {/* Centromere Primary Constriction */}
              <ellipse
                cx={width / 2}
                cy={height * 0.42}
                rx={(width - 16) / 2}
                ry="4"
                fill="#0f172a"
                stroke="#6366f1"
                strokeWidth="1"
              />

              {/* Long Arm (q-arm) - Non-homologous differential region */}
              <rect
                x="6"
                y={height * 0.46}
                width={width - 12}
                height={height * 0.54}
                rx="6"
                fill="#6366f1"
                stroke="#1e1b4b"
                strokeWidth="1.5"
              />
              {/* q-arm G-banding stripes */}
              <rect
                x="8"
                y={height * 0.56}
                width={width - 16}
                height="4"
                fill="#312e81"
                opacity="0.8"
                rx="1"
              />
              <rect
                x="8"
                y={height * 0.7}
                width={width - 16}
                height="3.5"
                fill="#1e1b4b"
                opacity="0.8"
                rx="1"
              />

              {/* Gene Locus Marker on Differential Segment (Xq28) */}
              {allele && highlightLocus && (
                <g>
                  {/* Locus band highlight */}
                  <rect
                    x="5"
                    y={height * 0.78}
                    width={width - 10}
                    height="8"
                    rx="3"
                    fill={isMutant ? cond.mutantColor : cond.primaryColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  {/* Glowing locus beacon point */}
                  <circle
                    cx={width / 2}
                    cy={height * 0.78 + 4}
                    r="4"
                    fill="#ffffff"
                    opacity={isMutant ? '0.9' : '0.6'}
                  />
                  <circle
                    cx={width / 2}
                    cy={height * 0.78 + 4}
                    r="2.5"
                    fill={isMutant ? '#ffe4e6' : '#ecfdf5'}
                  />

                  {/* Allele label indicator on side */}
                  <g transform={`translate(${width + 3}, ${height * 0.78 + 7})`}>
                    <rect
                      x="0"
                      y="-10"
                      width="24"
                      height="18"
                      rx="4"
                      fill={isMutant ? '#881337' : '#064e3b'}
                      stroke={isMutant ? '#fb7185' : '#34d399'}
                      strokeWidth="1"
                    />
                    <text
                      x="12"
                      y="3"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {isMutant ? cond.recSymbol : cond.domSymbol}
                    </text>
                  </g>
                </g>
              )}
            </g>
          ) : (
            // ==================== Y CHROMOSOME ====================
            <g>
              {/* Acrocentric small short arm */}
              <rect
                x="7"
                y="0"
                width={width - 14}
                height={height * 0.3}
                rx="4"
                fill="#f59e0b"
                stroke="#451a03"
                strokeWidth="1.5"
              />
              {/* Centromere */}
              <ellipse
                cx={width / 2}
                cy={height * 0.35}
                rx={(width - 18) / 2}
                ry="3"
                fill="#0f172a"
                stroke="#f59e0b"
                strokeWidth="0.8"
              />
              {/* Short q-arm with heterochromatin */}
              <rect
                x="7"
                y={height * 0.4}
                width={width - 14}
                height={height * 0.58}
                rx="4"
                fill="#f59e0b"
                stroke="#451a03"
                strokeWidth="1.5"
              />
              <rect
                x="8.5"
                y={height * 0.55}
                width={width - 17}
                height="3"
                fill="#78350f"
                opacity="0.9"
                rx="1"
              />

              {/* SRY Gene locus marker (Sex determining region Y) */}
              <circle
                cx={width / 2}
                cy={height * 0.16}
                r="3"
                fill="#fde047"
                stroke="#78350f"
                strokeWidth="1"
              />

              {/* Absent Differential Segment Callout Marker */}
              <g transform={`translate(${width + 2}, ${height * 0.65})`}>
                <rect
                  x="0"
                  y="-9"
                  width="22"
                  height="16"
                  rx="4"
                  fill="#1e293b"
                  stroke="#64748b"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x="11"
                  y="3"
                  fill="#94a3b8"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ∅
                </text>
              </g>
            </g>
          )}
        </g>
      </svg>

      {/* Text label underneath chromosome */}
      {label && (
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 border ${
            isX
              ? isMutant
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
              : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// MAIN SIMULATION COMPONENT
// ============================================================================

export default function SexLinkedInheritanceSim({ config = {}, onTelemetry }) {
  // Navigation Tabs: 'cross' | 'cytology' | 'clinical' | 'kcse'
  const [activeTab, setActiveTab] = useState('cross');

  // Condition selector: 'colour_blindness' | 'haemophilia'
  const [condition, setCondition] = useState('colour_blindness');
  const cond = CONDITIONS[condition];

  // Parental Genotypes
  // Mother: 'normal' (XᴰXᴰ) | 'carrier' (XᴰXʳ) | 'affected' (XʳXʳ)
  const [motherGenotype, setMotherGenotype] = useState('carrier');
  // Father: 'normal' (XᴰY) | 'affected' (XʳY)
  const [fatherGenotype, setFatherGenotype] = useState('normal');

  // Meiosis & Cross animation phase
  // 0: Parental Selection / Diploid Parents
  // 1: Gametogenesis Meiosis Segregation (Ova & Sperm haploid sets)
  // 2: Fertilization Union (Punnett Grid populates)
  // 3: Offspring Phenotype Breakdown & Pedigree Analysis
  const [crossStep, setCrossStep] = useState(3);
  const [isCrossAnimating, setIsCrossAnimating] = useState(false);

  // Selected offspring for clinical tester
  const [selectedOffspringIndex, setSelectedOffspringIndex] = useState(3); // Default affected male

  // Clinical Lab State
  const [visionFilterMode, setVisionFilterMode] = useState('auto'); // 'auto' (tied to selected offspring) | 'normal' | 'colour_blind'
  const [ishiharaUserGuess, setIshiharaUserGuess] = useState('');
  const [ishiharaFeedback, setIshiharaFeedback] = useState(null);

  // Haemophilia Clotting Experiment State
  const [isClottingRunning, setIsClottingRunning] = useState(false);
  const [clottingTime, setClottingTime] = useState(0); // seconds
  const [clotFormed, setClotFormed] = useState(false);
  const clottingTimerRef = useRef(null);

  // KCSE Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Telemetry Tracker
  const telemetrySentRef = useRef(false);
  const [exploredPhenotypes, setExploredPhenotypes] = useState({
    maleAffected: false,
    maleNormal: false,
    femaleCarrier: false,
    femaleAffected: false,
    femaleNormal: false,
  });

  // Calculate Alleles for Mother and Father
  const motherAlleles = useMemo(() => {
    if (motherGenotype === 'normal') return ['dom', 'dom'];
    if (motherGenotype === 'carrier') return ['dom', 'rec'];
    return ['rec', 'rec']; // affected
  }, [motherGenotype]);

  const fatherAlleles = useMemo(() => {
    if (fatherGenotype === 'normal') return ['dom', null];
    return ['rec', null]; // affected
  }, [fatherGenotype]);

  // Compute 4 Offspring Combinations
  // Offspring grid:
  // [0] = Mother egg 1 + Father sperm 1 (X) -> Female
  // [1] = Mother egg 2 + Father sperm 1 (X) -> Female
  // [2] = Mother egg 1 + Father sperm 2 (Y) -> Male
  // [3] = Mother egg 2 + Father sperm 2 (Y) -> Male
  const offspringList = useMemo(() => {
    const list = [
      // Mother Allele 1 + Father X
      {
        id: 'child_1',
        sex: 'female',
        sexSymbol: '♀',
        chr1: 'X',
        allele1: motherAlleles[0],
        chr2: 'X',
        allele2: fatherAlleles[0],
        maternalEggIndex: 1,
        paternalSperm: 'X',
      },
      // Mother Allele 2 + Father X
      {
        id: 'child_2',
        sex: 'female',
        sexSymbol: '♀',
        chr1: 'X',
        allele1: motherAlleles[1],
        chr2: 'X',
        allele2: fatherAlleles[0],
        maternalEggIndex: 2,
        paternalSperm: 'X',
      },
      // Mother Allele 1 + Father Y
      {
        id: 'child_3',
        sex: 'male',
        sexSymbol: '♂',
        chr1: 'X',
        allele1: motherAlleles[0],
        chr2: 'Y',
        allele2: null,
        maternalEggIndex: 1,
        paternalSperm: 'Y',
      },
      // Mother Allele 2 + Father Y
      {
        id: 'child_4',
        sex: 'male',
        sexSymbol: '♂',
        chr1: 'X',
        allele1: motherAlleles[1],
        chr2: 'Y',
        allele2: null,
        maternalEggIndex: 2,
        paternalSperm: 'Y',
      },
    ];

    return list.map((item, idx) => {
      const isFemale = item.sex === 'female';
      let phenotype = '';
      let badgeType = ''; // 'normal' | 'carrier' | 'affected'
      let genotypeStr = '';

      if (isFemale) {
        genotypeStr = `X${item.allele1 === 'dom' ? 'ᴮ' : 'ᵇ'}X${
          item.allele2 === 'dom' ? 'ᴮ' : 'ᵇ'
        }`;
        if (condition === 'haemophilia') {
          genotypeStr = `X${item.allele1 === 'dom' ? 'ᴴ' : 'ʰ'}X${
            item.allele2 === 'dom' ? 'ᴴ' : 'ʰ'
          }`;
        }

        if (item.allele1 === 'dom' && item.allele2 === 'dom') {
          phenotype = `Unaffected Daughter (${cond.domLabel})`;
          badgeType = 'normal';
        } else if (
          (item.allele1 === 'dom' && item.allele2 === 'rec') ||
          (item.allele1 === 'rec' && item.allele2 === 'dom')
        ) {
          phenotype = `Carrier Daughter (${cond.domLabel}, 1 mutant allele)`;
          badgeType = 'carrier';
        } else {
          phenotype = `Affected Daughter (${cond.recLabel})`;
          badgeType = 'affected';
        }
      } else {
        genotypeStr = `X${item.allele1 === 'dom' ? 'ᴮ' : 'ᵇ'}Y`;
        if (condition === 'haemophilia') {
          genotypeStr = `X${item.allele1 === 'dom' ? 'ᴴ' : 'ʰ'}Y`;
        }

        if (item.allele1 === 'dom') {
          phenotype = `Unaffected Son (${cond.domLabel})`;
          badgeType = 'normal';
        } else {
          phenotype = `Affected Son (${cond.recLabel}, Hemizygous)`;
          badgeType = 'affected';
        }
      }

      return {
        ...item,
        index: idx,
        phenotype,
        badgeType,
        genotypeStr,
      };
    });
  }, [motherAlleles, fatherAlleles, condition, cond]);

  // Track exploration of male and female inheritance outcomes for telemetry
  useEffect(() => {
    let hasMaleAff = false;
    let hasMaleNorm = false;
    let hasFemCarr = false;
    let hasFemAff = false;
    let hasFemNorm = false;

    offspringList.forEach(o => {
      if (o.sex === 'male') {
        if (o.badgeType === 'affected') hasMaleAff = true;
        if (o.badgeType === 'normal') hasMaleNorm = true;
      } else {
        if (o.badgeType === 'carrier') hasFemCarr = true;
        if (o.badgeType === 'affected') hasFemAff = true;
        if (o.badgeType === 'normal') hasFemNorm = true;
      }
    });

    setExploredPhenotypes(prev => {
      const updated = {
        maleAffected: prev.maleAffected || hasMaleAff,
        maleNormal: prev.maleNormal || hasMaleNorm,
        femaleCarrier: prev.femaleCarrier || hasFemCarr,
        femaleAffected: prev.femaleAffected || hasFemAff,
        femaleNormal: prev.femaleNormal || hasFemNorm,
      };

      // Checkpoint rule: verified when student explores both male outcome (affected)
      // and female outcome (carrier or affected)
      if (
        !telemetrySentRef.current &&
        updated.maleAffected &&
        (updated.femaleCarrier || updated.femaleAffected)
      ) {
        telemetrySentRef.current = true;
        if (typeof onTelemetry === 'function') {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            simulation: 'sex_linked_inheritance',
            checkpoint: 'both_sexes_explored',
            condition,
            motherGenotype,
            fatherGenotype,
            message:
              'Learner explored sex-linked inheritance mechanisms across both male and female offspring.',
          });
        }
      }

      return updated;
    });
  }, [offspringList, condition, motherGenotype, fatherGenotype, onTelemetry]);

  // Statistics calculation for offspring probabilities
  const stats = useMemo(() => {
    const totalDaughters = 2;
    const totalSons = 2;

    const normalDaughters = offspringList.filter(
      o => o.sex === 'female' && o.badgeType === 'normal'
    ).length;
    const carrierDaughters = offspringList.filter(
      o => o.sex === 'female' && o.badgeType === 'carrier'
    ).length;
    const affectedDaughters = offspringList.filter(
      o => o.sex === 'female' && o.badgeType === 'affected'
    ).length;

    const normalSons = offspringList.filter(
      o => o.sex === 'male' && o.badgeType === 'normal'
    ).length;
    const affectedSons = offspringList.filter(
      o => o.sex === 'male' && o.badgeType === 'affected'
    ).length;

    return {
      daughters: {
        normalPct: (normalDaughters / totalDaughters) * 100,
        carrierPct: (carrierDaughters / totalDaughters) * 100,
        affectedPct: (affectedDaughters / totalDaughters) * 100,
      },
      sons: {
        normalPct: (normalSons / totalSons) * 100,
        affectedPct: (affectedSons / totalSons) * 100,
      },
      overallAffectedPct:
        (offspringList.filter(o => o.badgeType === 'affected').length / 4) * 100,
    };
  }, [offspringList]);

  // Handle Preset Selection
  const handleApplyPreset = preset => {
    setMotherGenotype(preset.mother);
    setFatherGenotype(preset.father);
    setCondition(preset.condition);
    setCrossStep(3); // show full result
  };

  // Animate Segregation & Cross
  const handleRunAnimatedCross = () => {
    setIsCrossAnimating(true);
    setCrossStep(0);

    setTimeout(() => {
      setCrossStep(1); // Gametes
      setTimeout(() => {
        setCrossStep(2); // Fertilization / Punnett
        setTimeout(() => {
          setCrossStep(3); // Result cards
          setIsCrossAnimating(false);
        }, 800);
      }, 800);
    }, 600);
  };

  // Reset to default standard KCSE cross
  const handleResetCross = () => {
    setMotherGenotype('carrier');
    setFatherGenotype('normal');
    setCondition('colour_blindness');
    setCrossStep(3);
    setIsCrossAnimating(false);
    setSelectedOffspringIndex(3);
  };

  // Currently active selected offspring
  const activeOffspring = offspringList[selectedOffspringIndex] || offspringList[0];
  const isSelectedOffspringAffected = activeOffspring.badgeType === 'affected';

  // Determine effective Ishihara vision mode
  const effectiveVisionMode =
    visionFilterMode === 'auto'
      ? isSelectedOffspringAffected
        ? 'colour_blind'
        : 'normal'
      : visionFilterMode;

  // Handle Ishihara plate user response
  const handleTestIshiharaGuess = () => {
    const trimmed = ishiharaUserGuess.trim();
    if (!trimmed) return;

    if (effectiveVisionMode === 'normal') {
      if (trimmed === '74') {
        setIshiharaFeedback({
          correct: true,
          msg: 'Excellent! Normal trichromatic vision clearly perceives the number "74" delineated by the red/orange hue photopigments.',
        });
      } else {
        setIshiharaFeedback({
          correct: false,
          msg: `You entered "${trimmed}". Under normal trichromatic vision, the expected number is "74".`,
        });
      }
    } else {
      // Colour-blind vision
      if (trimmed === '21') {
        setIshiharaFeedback({
          correct: true,
          msg: 'Spot on! Red-green deficient vision fails to distinguish red from green, seeing the alternate number "21" (or nothing).',
        });
      } else if (trimmed === '74') {
        setIshiharaFeedback({
          correct: false,
          msg: 'Incorrect for colour-blind mode: "74" is invisible or masked because red and green cone signals cannot be differentiated!',
        });
      } else {
        setIshiharaFeedback({
          correct: true,
          msg: `You entered "${trimmed}". In red-green deficiency, individuals usually see "21" or are unable to decipher "74".`,
        });
      }
    }
  };

  // Haemophilia Clotting Time Simulation
  const handleStartClottingTest = () => {
    if (isClottingRunning) return;
    setIsClottingRunning(true);
    setClottingTime(0);
    setClotFormed(false);

    const isDeficient = isSelectedOffspringAffected;
    // Normal blood clots in ~6 simulated seconds. Deficient blood takes >25 seconds or fails
    const targetSeconds = isDeficient ? 25 : 6;

    if (clottingTimerRef.current) clearInterval(clottingTimerRef.current);

    clottingTimerRef.current = setInterval(() => {
      setClottingTime(prev => {
        const next = prev + 1;
        if (next >= targetSeconds) {
          clearInterval(clottingTimerRef.current);
          setIsClottingRunning(false);
          setClotFormed(!isDeficient);
        }
        return next;
      });
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (clottingTimerRef.current) clearInterval(clottingTimerRef.current);
    };
  }, []);

  // KCSE Quiz Handlers
  const handleSelectQuizAnswer = optionId => {
    if (quizSubmitted) return;
    setQuizSelectedOption(optionId);
  };

  const handleSubmitQuizAnswer = () => {
    if (!quizSelectedOption || quizSubmitted) return;
    setQuizSubmitted(true);
    const currQ = KCSE_QUESTIONS[quizIndex];
    const isCorrect = currQ.options.find(o => o.id === quizSelectedOption)?.correct;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex + 1 < KCSE_QUESTIONS.length) {
      setQuizIndex(prev => prev + 1);
      setQuizSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      setQuizFinished(true);
      if (typeof onTelemetry === 'function') {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'sex_linked_inheritance',
          checkpoint: 'kcse_genetics_quiz_completed',
          score:
            quizScore +
            (KCSE_QUESTIONS[quizIndex].options.find(o => o.id === quizSelectedOption)
              ?.correct
              ? 1
              : 0),
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 text-slate-100 font-sans space-y-6">
      {/* ==================================================================== */}
      {/* HEADER SECTION                                                      */}
      {/* ==================================================================== */}
      <header className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Form 4 Biology · Topic 1 Genetics
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                <Dna className="w-3 h-3 text-indigo-400" />
                Sex-Linked Inheritance
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              Sex-Linked Inheritance Lab
              <span className="text-base font-medium text-slate-400 hidden sm:inline">
                · Non-Homologous X Transmission
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Investigate why X-linked recessive disorders affect males and
              females differently due to male hemizygosity ($XY$) and absence of
              a homologous locus on the small $Y$ chromosome.
            </p>
          </div>

          {/* Condition Selector Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => {
                setCondition('colour_blindness');
                setIshiharaFeedback(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                condition === 'colour_blindness'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Colour Blindness (B/b)</span>
            </button>
            <button
              onClick={() => {
                setCondition('haemophilia');
                setClotFormed(false);
                setClottingTime(0);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                condition === 'haemophilia'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Haemophilia A (H/h)</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 border-t border-slate-800 pt-4 overflow-x-auto scrollbar-none">
          {[
            { id: 'cross', label: 'Genetic Cross & Punnett Grid', icon: Split },
            {
              id: 'cytology',
              label: 'Chromosome Cytology & Loci',
              icon: Layers,
            },
            {
              id: 'clinical',
              label: 'Clinical Diagnostic Assay',
              icon: condition === 'colour_blindness' ? Eye : Droplets,
            },
            { id: 'kcse', label: 'KCSE Exam Mastery', icon: Award },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ==================================================================== */}
      {/* TAB 1: GENETIC CROSS & PUNNETT LAB                                   */}
      {/* ==================================================================== */}
      {activeTab === 'cross' && (
        <div className="space-y-6">
          {/* Controls & Presets Panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Parental Genotype Configuration
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunAnimatedCross}
                  disabled={isCrossAnimating}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Perform Genetic Cross</span>
                </button>
                <button
                  onClick={handleResetCross}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Genotype Selectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mother Genotype Selector */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-500/40">
                      ♀
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      Mother Phenotype & Genotype
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
                    {motherGenotype === 'normal'
                      ? `X${cond.domSymbol}X${cond.domSymbol}`
                      : motherGenotype === 'carrier'
                      ? `X${cond.domSymbol}X${cond.recSymbol}`
                      : `X${cond.recSymbol}X${cond.recSymbol}`}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'normal',
                      label: 'Normal',
                      code: `X${cond.domSymbol}X${cond.domSymbol}`,
                      detail: 'Homozygous Dominant',
                    },
                    {
                      id: 'carrier',
                      label: 'Carrier',
                      code: `X${cond.domSymbol}X${cond.recSymbol}`,
                      detail: 'Heterozygous Carrier',
                    },
                    {
                      id: 'affected',
                      label: 'Affected',
                      code: `X${cond.recSymbol}X${cond.recSymbol}`,
                      detail: 'Homozygous Recessive',
                    },
                  ].map(opt => {
                    const isSelected = motherGenotype === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setMotherGenotype(opt.id)}
                        className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'bg-rose-950/40 border-rose-500 text-white shadow-md'
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-bold text-white">
                          {opt.label}
                        </span>
                        <span className="text-[11px] font-mono text-rose-300 font-semibold mt-0.5">
                          {opt.code}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-1 leading-tight">
                          {opt.detail}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Father Genotype Selector */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/40">
                      ♂
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      Father Phenotype & Genotype (Hemizygous)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
                    {fatherGenotype === 'normal'
                      ? `X${cond.domSymbol}Y`
                      : `X${cond.recSymbol}Y`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      id: 'normal',
                      label: 'Normal Male',
                      code: `X${cond.domSymbol}Y`,
                      detail: 'Hemizygous Normal (Cannot carry)',
                    },
                    {
                      id: 'affected',
                      label: 'Affected Male',
                      code: `X${cond.recSymbol}Y`,
                      detail: 'Hemizygous Mutant (Expresses condition)',
                    },
                  ].map(opt => {
                    const isSelected = fatherGenotype === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setFatherGenotype(opt.id)}
                        className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'bg-blue-950/40 border-blue-500 text-white shadow-md'
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-bold text-white">
                          {opt.label}
                        </span>
                        <span className="text-[11px] font-mono text-blue-300 font-semibold mt-0.5">
                          {opt.code}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-1 leading-tight">
                          {opt.detail}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Presets Bar */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">
                Quick KCSE Syllabus Presets:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleApplyPreset(p)}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-indigo-400">
                        {p.badge}
                      </span>
                      <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-xs font-bold text-slate-200 leading-tight">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      {p.takeaway}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Biological Meiosis & Punnett Square Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: Meiotic Gametogenesis & Punnett Square (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Split className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    Punnett Square & Meiotic Gamete Segregation
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  KCSE Monohybrid Sex-Linked Cross
                </span>
              </div>

              {/* Meiosis Diagrammatic Explanation */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                {/* Parents Representation */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1 mb-1">
                      <span>Maternal Diploid (2n)</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <ChromosomeVector
                        type="X"
                        allele={motherAlleles[0]}
                        condition={condition}
                        size="sm"
                        label={`X${
                          motherAlleles[0] === 'dom'
                            ? cond.domSymbol
                            : cond.recSymbol
                        }`}
                      />
                      <ChromosomeVector
                        type="X"
                        allele={motherAlleles[1]}
                        condition={condition}
                        size="sm"
                        label={`X${
                          motherAlleles[1] === 'dom'
                            ? cond.domSymbol
                            : cond.recSymbol
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1 mb-1">
                      <span>Paternal Diploid (2n)</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <ChromosomeVector
                        type="X"
                        allele={fatherAlleles[0]}
                        condition={condition}
                        size="sm"
                        label={`X${
                          fatherAlleles[0] === 'dom'
                            ? cond.domSymbol
                            : cond.recSymbol
                        }`}
                      />
                      <ChromosomeVector
                        type="Y"
                        allele={null}
                        condition={condition}
                        size="sm"
                        label="Y"
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Punnett Square Table */}
                <div className="mt-4 overflow-x-auto">
                  <div className="min-w-[320px] text-xs">
                    {/* Header Row: Father Gametes (Sperm) */}
                    <div className="grid grid-cols-3 gap-2 items-center text-center mb-2">
                      <div className="p-2 text-[11px] font-bold text-slate-400 text-left">
                        Gametes (n):
                        <span className="block text-[9px] text-slate-400 font-normal">
                          ♀ Ova ↓ | ♂ Sperm →
                        </span>
                      </div>
                      <div className="p-2 bg-blue-950/40 border border-blue-800/60 rounded-lg">
                        <span className="text-[10px] text-blue-300 block font-bold">
                          Paternal Sperm 1
                        </span>
                        <span className="text-xs font-mono font-bold text-white">
                          X
                          {fatherAlleles[0] === 'dom'
                            ? cond.domSymbol
                            : cond.recSymbol}
                        </span>
                      </div>
                      <div className="p-2 bg-amber-950/40 border border-amber-800/60 rounded-lg">
                        <span className="text-[10px] text-amber-300 block font-bold">
                          Paternal Sperm 2
                        </span>
                        <span className="text-xs font-mono font-bold text-white">
                          Y (No allele)
                        </span>
                      </div>
                    </div>

                    {/* Row 1: Maternal Egg 1 */}
                    <div className="grid grid-cols-3 gap-2 items-stretch mb-2">
                      <div className="p-2 bg-rose-950/40 border border-rose-800/60 rounded-lg flex flex-col justify-center text-center">
                        <span className="text-[10px] text-rose-300 font-bold block">
                          Maternal Egg 1
                        </span>
                        <span className="text-xs font-mono font-bold text-white">
                          X
                          {motherAlleles[0] === 'dom'
                            ? cond.domSymbol
                            : cond.recSymbol}
                        </span>
                      </div>

                      {/* Cell 1: Female Child 1 */}
                      <button
                        onClick={() => setSelectedOffspringIndex(0)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          selectedOffspringIndex === 0
                            ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500/50'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono font-bold text-rose-300">
                            {offspringList[0].genotypeStr}
                          </span>
                          <span className="text-xs">♀ Girl</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            offspringList[0].badgeType === 'carrier'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : offspringList[0].badgeType === 'affected'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {offspringList[0].badgeType === 'carrier'
                            ? 'Carrier'
                            : offspringList[0].badgeType === 'affected'
                            ? 'Affected'
                            : 'Normal'}
                        </span>
                      </button>

                      {/* Cell 2: Male Child 3 */}
                      <button
                        onClick={() => setSelectedOffspringIndex(2)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          selectedOffspringIndex === 2
                            ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500/50'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono font-bold text-blue-300">
                            {offspringList[2].genotypeStr}
                          </span>
                          <span className="text-xs">♂ Boy</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            offspringList[2].badgeType === 'affected'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {offspringList[2].badgeType === 'affected'
                            ? 'Affected'
                            : 'Normal'}
                        </span>
                      </button>
                    </div>

                    {/* Row 2: Maternal Egg 2 */}
                    <div className="grid grid-cols-3 gap-2 items-stretch">
                      <div className="p-2 bg-rose-950/40 border border-rose-800/60 rounded-lg flex flex-col justify-center text-center">
                        <span className="text-[10px] text-rose-300 font-bold block">
                          Maternal Egg 2
                        </span>
                        <span className="text-xs font-mono font-bold text-white">
                          X
                          {motherAlleles[1] === 'dom'
                            ? cond.domSymbol
                            : cond.recSymbol}
                        </span>
                      </div>

                      {/* Cell 3: Female Child 2 */}
                      <button
                        onClick={() => setSelectedOffspringIndex(1)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          selectedOffspringIndex === 1
                            ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500/50'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono font-bold text-rose-300">
                            {offspringList[1].genotypeStr}
                          </span>
                          <span className="text-xs">♀ Girl</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            offspringList[1].badgeType === 'carrier'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : offspringList[1].badgeType === 'affected'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {offspringList[1].badgeType === 'carrier'
                            ? 'Carrier'
                            : offspringList[1].badgeType === 'affected'
                            ? 'Affected'
                            : 'Normal'}
                        </span>
                      </button>

                      {/* Cell 4: Male Child 4 */}
                      <button
                        onClick={() => setSelectedOffspringIndex(3)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          selectedOffspringIndex === 3
                            ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500/50'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono font-bold text-blue-300">
                            {offspringList[3].genotypeStr}
                          </span>
                          <span className="text-xs">♂ Boy</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            offspringList[3].badgeType === 'affected'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {offspringList[3].badgeType === 'affected'
                            ? 'Affected'
                            : 'Normal'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* KCSE Examination Notation Callout */}
                <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <span className="font-bold text-indigo-400 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    KCSE Examination Genetic Cross Convention:
                  </span>
                  <p className="leading-relaxed text-slate-400">
                    Always represent sex-linked alleles as superscripts on the
                    sex chromosome (e.g.{' '}
                    <strong className="text-white">
                      X{cond.domSymbol}
                    </strong>{' '}
                    or{' '}
                    <strong className="text-white">
                      X{cond.recSymbol}
                    </strong>
                    ). The <strong className="text-amber-400">Y</strong>{' '}
                    chromosome never carries an allele letter because the
                    differential segment carrying this gene locus is absent.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Col: Offspring Analysis & Risk Breakdown (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Statistical Risk Summary Box */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Offspring Risk Probabilities
                  </h3>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                    F1 Progeny Ratio
                  </span>
                </div>

                {/* Sons vs Daughters Proportions */}
                <div className="space-y-2.5 text-xs">
                  {/* Sons */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-400 flex items-center gap-1">
                        <span>Male Progeny (Sons)</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Total: 2 / 4 (50%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">
                        Affected ({cond.recLabel}):
                      </span>
                      <span
                        className={`font-bold ${
                          stats.sons.affectedPct > 0
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {stats.sons.affectedPct}% of sons
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">
                        Unaffected ({cond.domLabel}):
                      </span>
                      <span className="font-bold text-emerald-400">
                        {stats.sons.normalPct}% of sons
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-300/90 italic pt-0.5">
                      * Males cannot be carriers — they are hemizygous.
                    </div>
                  </div>

                  {/* Daughters */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-400 flex items-center gap-1">
                        <span>Female Progeny (Daughters)</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Total: 2 / 4 (50%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">
                        Carrier (Phenotypically normal):
                      </span>
                      <span className="font-bold text-amber-400">
                        {stats.daughters.carrierPct}% of daughters
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">
                        Affected ({cond.recLabel}):
                      </span>
                      <span
                        className={`font-bold ${
                          stats.daughters.affectedPct > 0
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {stats.daughters.affectedPct}% of daughters
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">Homozygous Normal:</span>
                      <span className="font-bold text-emerald-400">
                        {stats.daughters.normalPct}% of daughters
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Child Clinical Inspection Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    Selected Offspring Card
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Child #{activeOffspring.index + 1}
                  </span>
                </div>

                <div className="flex items-center gap-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <ChromosomeVector
                      type="X"
                      allele={activeOffspring.allele1}
                      condition={condition}
                      size="sm"
                      label={`X${
                        activeOffspring.allele1 === 'dom'
                          ? cond.domSymbol
                          : cond.recSymbol
                      }`}
                    />
                    <ChromosomeVector
                      type={activeOffspring.chr2}
                      allele={activeOffspring.allele2}
                      condition={condition}
                      size="sm"
                      label={
                        activeOffspring.chr2 === 'X'
                          ? `X${
                              activeOffspring.allele2 === 'dom'
                                ? cond.domSymbol
                                : cond.recSymbol
                            }`
                          : 'Y'
                      }
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white">
                        {activeOffspring.sex === 'female' ? 'Daughter ♀' : 'Son ♂'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          activeOffspring.badgeType === 'carrier'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : activeOffspring.badgeType === 'affected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {activeOffspring.badgeType === 'carrier'
                          ? 'Carrier'
                          : activeOffspring.badgeType === 'affected'
                          ? 'Affected'
                          : 'Normal'}
                      </span>
                    </div>

                    <div className="text-xs font-mono font-bold text-indigo-300">
                      Genotype: {activeOffspring.genotypeStr}
                    </div>

                    <p className="text-[11px] text-slate-300 leading-snug">
                      {activeOffspring.phenotype}
                    </p>

                    <button
                      onClick={() => setActiveTab('clinical')}
                      className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span>Simulate Clinical Vision / Clotting Test</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: CHROMOSOME CYTOLOGY & LOCUS EXPLORER                           */}
      {/* ==================================================================== */}
      {activeTab === 'cytology' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                Comparative Cytogenetics: Human X and Y Chromosomes
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Understand the physical basis of sex-linkage: why the large
                sub-metacentric X chromosome has a large non-homologous
                differential region that lacks any corresponding alleles on the
                small acrocentric Y chromosome.
              </p>
            </div>

            {/* Side-by-Side Chromosome Cytology Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
              {/* Visual Vectors */}
              <div className="flex items-center justify-around py-4 border-b md:border-b-0 md:border-r border-slate-800">
                {/* X Chromosome */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-indigo-300 mb-2">
                    X Chromosome (~155 Mb)
                  </span>
                  <ChromosomeVector
                    type="X"
                    allele="rec"
                    condition={condition}
                    size="lg"
                    highlightLocus={true}
                    label={`Locus: ${cond.cytoband}`}
                  />
                  <div className="mt-2 text-center text-[10px] text-slate-400 max-w-[130px]">
                    Carries &gt;1,100 functional protein-coding genes
                  </div>
                </div>

                {/* Y Chromosome */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-amber-400 mb-2">
                    Y Chromosome (~59 Mb)
                  </span>
                  <ChromosomeVector
                    type="Y"
                    allele={null}
                    condition={condition}
                    size="lg"
                    highlightLocus={false}
                    label="Differential Segment Absent"
                  />
                  <div className="mt-2 text-center text-[10px] text-slate-400 max-w-[130px]">
                    Carries ~78 genes (primarily SRY for male testes development)
                  </div>
                </div>
              </div>

              {/* Cytogenetic Structural Annotations */}
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-slate-900 rounded-xl border border-indigo-900/40 space-y-1.5">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    1. Pseudoautosomal Regions (PAR1 & PAR2)
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Located at the extreme telomeric tips of both X and Y
                    chromosomes. These homologous regions allow X and Y to pair
                    and synapsed during meiotic prophase I in spermatogenesis.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900 rounded-xl border border-rose-900/40 space-y-1.5">
                  <span className="font-bold text-rose-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    2. Non-Homologous Differential Region (X-Specific)
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    The vast majority of the X chromosome (including locus{' '}
                    <span className="text-white font-mono font-bold">Xq28</span>{' '}
                    for photopsin opsin and Factor VIII clotting factor) is
                    completely missing on the Y chromosome.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900 rounded-xl border border-amber-900/40 space-y-1.5">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    3. Hemizygosity in Human Males (XY)
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Because males only have <strong className="text-white">one</strong>{' '}
                    copy of X-linked genes, a single recessive mutant allele
                    (e.g.{' '}
                    <span className="font-mono text-rose-400">
                      X{cond.recSymbol}
                    </span>
                    ) cannot be masked by any dominant allele. Hence, males
                    cannot be unaffected carriers!
                  </p>
                </div>
              </div>
            </div>

            {/* Criss-Cross Inheritance Step-by-Step Walkthrough */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  Mechanism of Criss-Cross Inheritance (Skip-Generation Transmission)
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                KCSE requires students to explain how an X-linked recessive trait
                is transmitted from an affected grandfather to his grandson
                through a normal carrier daughter:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                    Generation I: Affected Grandfather
                  </span>
                  <div className="font-mono font-bold text-white text-sm">
                    X{cond.recSymbol}Y
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    The affected grandfather produces sperm containing either{' '}
                    <span className="text-rose-300 font-mono">
                      X{cond.recSymbol}
                    </span>{' '}
                    or <span className="text-amber-300 font-mono">Y</span>. He
                    transmits his mutant X to 100% of his daughters.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Generation II: Carrier Daughter
                  </span>
                  <div className="font-mono font-bold text-white text-sm">
                    X{cond.domSymbol}X{cond.recSymbol}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    The daughter inherits{' '}
                    <span className="text-rose-300 font-mono">
                      X{cond.recSymbol}
                    </span>{' '}
                    from her father and a normal{' '}
                    <span className="text-emerald-300 font-mono">
                      X{cond.domSymbol}
                    </span>{' '}
                    from her mother. She is phenotypically normal because the
                    normal allele is dominant.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                    Generation III: Affected Grandson
                  </span>
                  <div className="font-mono font-bold text-white text-sm">
                    X{cond.recSymbol}Y
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    The carrier mother passes{' '}
                    <span className="text-rose-300 font-mono">
                      X{cond.recSymbol}
                    </span>{' '}
                    to 50% of her sons. The grandson inherits Y from his father,
                    expressing the condition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: CLINICAL DIAGNOSTIC ASSAYS (Ishihara & Haemostasis)            */}
      {/* ==================================================================== */}
      {activeTab === 'clinical' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  {condition === 'colour_blindness' ? (
                    <Eye className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Droplets className="w-5 h-5 text-rose-400" />
                  )}
                  {condition === 'colour_blindness'
                    ? 'Clinical Ishihara Pseudoisochromatic Plate Test'
                    : 'Laboratory Coagulation & Factor VIII Assay'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Experience how the genetic inheritance in offspring directly
                  translates into physiological and clinical phenotypes.
                </p>
              </div>

              {/* Selected Child Pill */}
              <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2 self-start sm:self-auto">
                <span className="text-slate-400">Testing Offspring:</span>
                <span className="font-bold text-white">
                  Child #{activeOffspring.index + 1} ({activeOffspring.sexSymbol} {activeOffspring.genotypeStr})
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    activeOffspring.badgeType === 'affected'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : activeOffspring.badgeType === 'carrier'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {activeOffspring.badgeType}
                </span>
              </div>
            </div>

            {/* ================= IF COLOUR BLINDNESS ================= */}
            {condition === 'colour_blindness' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Ishihara Plate Canvas (7 cols) */}
                <div className="md:col-span-7 flex flex-col items-center bg-slate-950 p-6 rounded-2xl border border-slate-800 relative">
                  <div className="text-center mb-3">
                    <span className="text-xs font-bold text-slate-300">
                      Ishihara Plate #9 (Diagnostic Digit Discrimination)
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Mode:{' '}
                      <strong className="text-indigo-400 uppercase">
                        {effectiveVisionMode === 'normal'
                          ? 'Trichromatic Normal (Seeing 74)'
                          : 'Protanopia / Deuteranopia Deficiency (Seeing 21)'}
                      </strong>
                    </span>
                  </div>

                  {/* SVG Plate */}
                  <svg
                    width="280"
                    height="280"
                    viewBox="0 0 320 280"
                    className="rounded-full shadow-2xl bg-slate-900 border-4 border-slate-800"
                  >
                    {/* Disc base */}
                    <circle cx="160" cy="140" r="135" fill="#1e293b" />

                    {/* Array of dots */}
                    {ISHIHARA_DOTS.map((dot, idx) => {
                      // Color determination based on vision filter
                      let dotColor = '#64748b'; // default background neutral

                      if (effectiveVisionMode === 'normal') {
                        // Under normal vision: number 74 stands out in orange-red (#f87171 / #fb923c)
                        // background dots are various greens and olives
                        if (dot.isNumber74) {
                          dotColor = idx % 2 === 0 ? '#f87171' : '#fb923c';
                        } else {
                          dotColor =
                            idx % 3 === 0
                              ? '#4ade80'
                              : idx % 3 === 1
                              ? '#22c55e'
                              : '#84cc16';
                        }
                      } else {
                        // Under Red-Green deficiency (Deuteranopia):
                        // Reds and greens collapse into muddy brownish-yellows.
                        // However, dot.isNumber21 dots stand out as a lighter yellow-green contrast!
                        if (dot.isNumber21) {
                          dotColor = '#eab308'; // stands out as 21
                        } else if (dot.isNumber74) {
                          dotColor = '#a1a1aa'; // 74 blends in with background!
                        } else {
                          dotColor = idx % 2 === 0 ? '#71717a' : '#854d0e';
                        }
                      }

                      return (
                        <circle
                          key={idx}
                          cx={dot.cx}
                          cy={dot.cy}
                          r={dot.r}
                          fill={dotColor}
                          opacity="0.9"
                          stroke="#0f172a"
                          strokeWidth="0.8"
                        />
                      );
                    })}
                  </svg>

                  {/* Simulation Lens Switcher */}
                  <div className="flex items-center gap-2 mt-4 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setVisionFilterMode('auto')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        visionFilterMode === 'auto'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Auto (Child #{activeOffspring.index + 1})
                    </button>
                    <button
                      onClick={() => setVisionFilterMode('normal')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        visionFilterMode === 'normal'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Normal Vision (74)
                    </button>
                    <button
                      onClick={() => setVisionFilterMode('colour_blind')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        visionFilterMode === 'colour_blind'
                          ? 'bg-rose-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Colour-Blind View (21)
                    </button>
                  </div>
                </div>

                {/* Interactive Reading Diagnostic (5 cols) */}
                <div className="md:col-span-5 space-y-4">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Interactive Visual Acuity Input
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      What number does this child perceive on the Ishihara plate?
                    </p>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={3}
                        placeholder="e.g. 74"
                        value={ishiharaUserGuess}
                        onChange={e => setIshiharaUserGuess(e.target.value)}
                        className="w-24 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-center font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={handleTestIshiharaGuess}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all"
                      >
                        Verify Reading
                      </button>
                    </div>

                    {ishiharaFeedback && (
                      <div
                        className={`p-3 rounded-xl border text-xs leading-relaxed ${
                          ishiharaFeedback.correct
                            ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                            : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                        }`}
                      >
                        {ishiharaFeedback.msg}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-indigo-300 block">
                      Biological Mechanism:
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      The opsin genes for long-wave (red) and medium-wave (green)
                      pigments sit side-by-side at locus{' '}
                      <span className="font-mono text-white">Xq28</span>. A
                      male inheriting <span className="font-mono text-rose-400">Xᵇ</span>{' '}
                      has no functional red or green cone opsin gene on his Y
                      chromosome, so the brain cannot process red/green spectral
                      wavelength differentials.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ================= IF HAEMOPHILIA ================= */}
            {condition === 'haemophilia' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual Blood Vessel Simulation */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">
                      Capillary Endothelial Injury Assay
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        clotFormed
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : isClottingRunning
                          ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {clotFormed
                        ? 'Clot Sealed (Haemostasis Achieved)'
                        : isClottingRunning
                        ? `Coagulating... ${clottingTime}s`
                        : 'Vessel Punctured'}
                    </span>
                  </div>

                  {/* SVG Vessel Graphic */}
                  <div className="h-44 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                    {/* Vessel walls */}
                    <div className="absolute top-2 inset-x-0 h-4 bg-rose-950/80 border-b border-rose-700/60" />
                    <div className="absolute bottom-2 inset-x-0 h-4 bg-rose-950/80 border-t border-rose-700/60" />

                    {/* Injury gap in top wall */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-transparent border-x border-rose-500" />

                    {/* Clot / Fibrin Mesh or Continuous Bleed */}
                    {clotFormed ? (
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-8 bg-red-800/90 rounded-full border-2 border-emerald-400 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                        Fibrin Mesh Clot
                      </div>
                    ) : isClottingRunning ? (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" />
                        <div className="w-2.5 h-2.5 bg-red-600 rounded-full mt-1 animate-pulse" />
                      </div>
                    ) : (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] text-rose-400 font-bold">
                        Puncture Site
                      </div>
                    )}

                    {/* Flowing RBCs */}
                    <div className="flex items-center gap-6 opacity-60">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full bg-rose-600 border border-rose-800 flex items-center justify-center text-[8px] font-bold text-rose-200"
                        >
                          RBC
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleStartClottingTest}
                    disabled={isClottingRunning}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Activity className="w-4 h-4" />
                    <span>
                      {isClottingRunning
                        ? 'Simulating Coagulation Cascade...'
                        : 'Trigger Bleeding & Time Clot Formation'}
                    </span>
                  </button>
                </div>

                {/* Physiology Explanation */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Clinical Haemostasis Comparison
                  </h4>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-900 rounded-xl border border-emerald-900/40">
                      <span className="font-bold text-emerald-400 block mb-1">
                        Normal Individual (XᴴY or XᴴXᴴ / XᴴXʰ):
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Factor VIII acts as an essential cofactor for Factor IXa
                        in the "tenase" complex, rapidly catalyzing prothrombin
                        into thrombin. Thrombin polymerizes soluble fibrinogen
                        into an insoluble fibrin mesh within 5–8 minutes.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-rose-900/40">
                      <span className="font-bold text-rose-400 block mb-1">
                        Haemophiliac Individual (XʰY or XʰXʰ):
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Lack of functional Factor VIII halts the intrinsic
                        tenase complex. Only an unstable platelet plug forms,
                        which washes away under blood pressure, leading to
                        prolonged and life-threatening bleeding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: KCSE EXAM MASTERY & PEDIGREE CHALLENGES                       */}
      {/* ==================================================================== */}
      {activeTab === 'kcse' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  KCSE Biology Form 4 Genetics Mastery
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Test your understanding against official Kenya National
                  Examinations Council (KNEC) marking criteria.
                </p>
              </div>

              {!quizFinished && (
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Question</span>
                  <span className="text-sm font-bold text-indigo-400 font-mono">
                    {quizIndex + 1} of {KCSE_QUESTIONS.length}
                  </span>
                </div>
              )}
            </div>

            {!quizFinished ? (
              <div className="space-y-5">
                {/* Question Prompt */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                    {KCSE_QUESTIONS[quizIndex].kcseRef}
                  </span>
                  <p className="text-sm font-medium text-white leading-relaxed">
                    {KCSE_QUESTIONS[quizIndex].question}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {KCSE_QUESTIONS[quizIndex].options.map(opt => {
                    const isSelected = quizSelectedOption === opt.id;
                    let optStyle =
                      'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (quizSubmitted) {
                      if (opt.correct) {
                        optStyle =
                          'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md';
                      } else if (isSelected && !opt.correct) {
                        optStyle =
                          'bg-rose-950/80 border-rose-500 text-rose-200';
                      }
                    } else if (isSelected) {
                      optStyle =
                        'bg-indigo-950/60 border-indigo-500 text-white ring-2 ring-indigo-500/40';
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectQuizAnswer(opt.id)}
                        disabled={quizSubmitted}
                        className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${optStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {opt.id}
                        </span>
                        <span className="text-xs leading-relaxed flex-1">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {quizSubmitted && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-indigo-400 block">
                      Marking Scheme Rationale:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {KCSE_QUESTIONS[quizIndex].explanation}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuizAnswer}
                      disabled={!quizSelectedOption}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuizQuestion}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                    >
                      <span>
                        {quizIndex + 1 < KCSE_QUESTIONS.length
                          ? 'Next Question'
                          : 'View Exam Score'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Finished Score Card */
              <div className="text-center py-8 space-y-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Exam Mastery Completed!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  You scored <strong className="text-indigo-400">{quizScore}</strong>{' '}
                  out of <strong>{KCSE_QUESTIONS.length}</strong> (
                  {Math.round((quizScore / KCSE_QUESTIONS.length) * 100)}%).
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleRestartQuiz}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 mx-auto shadow"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retake Quiz</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* FOOTER & KCSE CURRICULUM REFERENCE                                   */}
      {/* ==================================================================== */}
      <footer className="text-center text-[11px] text-slate-400 py-3 border-t border-slate-800/80">
        VLearn Interactive Virtual Science Laboratory · Biology Form 4 (KICD
        Curriculum · KCSE Genetics Topic 1)
      </footer>
    </div>
  );
}
