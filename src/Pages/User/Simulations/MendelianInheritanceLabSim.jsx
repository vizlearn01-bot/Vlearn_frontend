import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Dna,
  Sparkles,
  RotateCcw,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Play,
  Pause,
  RefreshCw,
  HelpCircle,
  Info,
  Split,
  Layers,
  Shuffle,
  ChevronRight,
  FlaskConical,
  Microscope,
  BookOpen,
  AlertCircle,
  ShieldCheck,
  Zap,
  BarChart3,
  Check,
  Eye,
  Activity,
} from 'lucide-react';

// ============================================================================
// 1. SCIENTIFIC CONSTANTS & TRAIT DICTIONARY (KCSE Form 4 Biology Syllabus)
// ============================================================================

/**
 * The 3 classic Mendelian traits in Pisum sativum, connecting abstract gene letters
 * to the underlying enzymes, molecular genetics, and morphological phenotypes.
 */
export const MENDELIAN_TRAITS = {
  height: {
    id: 'height',
    name: 'Stem Height',
    organism: 'Garden Pea (Pisum sativum)',
    geneSymbol: 'Le (Stem elongation locus)',
    chromosome: 'Chromosome 4 (Linkage Group 4)',
    domSymbol: 'T',
    recSymbol: 't',
    domName: 'Tall',
    recName: 'Dwarf',
    domGenotypes: ['TT', 'Tt'],
    recGenotypes: ['tt'],
    enzymeName: 'Gibberellin 3β-hydroxylase (GA 3-oxidase)',
    biochemistry: {
      activeEnzyme: 'Active GA 3-oxidase converts precursor GA₂₀ into active Gibberellin (GA₁).',
      domMechanism: 'Gibberellin GA₁ stimulates cellular elongation in stem internodes, producing tall plants (1.5 m – 2.0 m).',
      recMechanism: 'Inactivating G-to-A point mutation in the Le gene (Ala229Thr) substitutes a conserved alanine with threonine, disabling the GA 3-oxidase enzyme. Internodes remain short, producing the dwarf phenotype (0.2 m – 0.4 m).',
      dominanceExplanation: 'Complete dominance: A single wild-type allele (T) produces sufficient GA₁ hormone to reach maximum internode height (haplosufficiency).',
    },
    domColor: '#16a34a', // Emerald green
    recColor: '#d97706', // Amber gold
    domBgLight: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    recBgLight: 'bg-amber-50 text-amber-800 border-amber-300',
    domAccent: 'border-emerald-500 bg-emerald-500/10 text-emerald-700',
    recAccent: 'border-amber-500 bg-amber-500/10 text-amber-700',
  },
  texture: {
    id: 'texture',
    name: 'Seed Texture',
    organism: 'Garden Pea (Pisum sativum)',
    geneSymbol: 'R locus (Starch branching gene)',
    chromosome: 'Chromosome 7 (Linkage Group 5)',
    domSymbol: 'R',
    recSymbol: 'r',
    domName: 'Round (Smooth)',
    recName: 'Wrinkled',
    domGenotypes: ['RR', 'Rr'],
    recGenotypes: ['rr'],
    enzymeName: 'Starch Branching Enzyme I (SBEI)',
    biochemistry: {
      activeEnzyme: 'Functional SBEI catalyzes α-1,6 branches in amylopectin starch synthesis.',
      domMechanism: 'High amylopectin starch keeps osmotic sucrose low. Seed develops solid, uniform starch grains that retain water evenly; desiccation produces smooth spherical seeds.',
      recMechanism: 'A 0.8 kb transposon-like insertion disables SBEI. Unbranched amylose accumulates and free sucrose stays twice as high, drawing excess osmotic water during early growth. Upon desiccation, water loss causes massive collapse and wrinkled seed coats.',
      dominanceExplanation: 'A single functional R allele provides enough SBEI activity to yield mature round seeds indistinguishable from RR.',
    },
    domColor: '#0284c7', // Sky blue
    recColor: '#ea580c', // Warm orange
    domBgLight: 'bg-sky-50 text-sky-800 border-sky-300',
    recBgLight: 'bg-orange-50 text-orange-800 border-orange-300',
    domAccent: 'border-sky-500 bg-sky-500/10 text-sky-700',
    recAccent: 'border-orange-500 bg-orange-500/10 text-orange-700',
  },
  flower: {
    id: 'flower',
    name: 'Flower Colour',
    organism: 'Garden Pea (Pisum sativum)',
    geneSymbol: 'A locus (bHLH transcription factor)',
    chromosome: 'Chromosome 6 (Linkage Group 2)',
    domSymbol: 'P',
    recSymbol: 'p',
    domName: 'Purple',
    recName: 'White',
    domGenotypes: ['PP', 'Pp'],
    recGenotypes: ['pp'],
    enzymeName: 'Anthocyanin Pathway Activator (bHLH Protein)',
    biochemistry: {
      activeEnzyme: 'Basic helix-loop-helix (bHLH) transcription factor regulates anthocyanin biosynthesis.',
      domMechanism: 'Activates flavonoid enzymes (including dihydroflavonol 4-reductase), accumulating rich purple/violet delphinidin pigments in petals and seed coats.',
      recMechanism: 'G-to-A splice-site mutation produces a truncated, misfolded transcription factor. Anthocyanin enzymes remain inactive, petals accumulate no pigment and appear pure white.',
      dominanceExplanation: 'Presence of one active P allele turns on the biosynthetic pathway with sufficient pigment output for full purple coloration.',
    },
    domColor: '#9333ea', // Royal Purple
    recColor: '#64748b', // Slate/White
    domBgLight: 'bg-purple-50 text-purple-800 border-purple-300',
    recBgLight: 'bg-slate-100 text-slate-700 border-slate-300',
    domAccent: 'border-purple-500 bg-purple-500/10 text-purple-700',
    recAccent: 'border-slate-400 bg-slate-100 text-slate-600',
  },
};

// Preset Cross Configurations for Quick Selection
const PRESET_CROSSES = [
  {
    id: 'pure_breeding',
    title: 'Pure Breeding Cross',
    subtitle: 'P Generation (TT × tt)',
    p1: 'TT',
    p2: 'tt',
    description: 'Homozygous Dominant crossed with Homozygous Recessive. Yields 100% heterozygous F1 offspring.',
    poeRecessivePct: 0,
    badge: 'Mendel P₁ Cross',
  },
  {
    id: 'f1_monohybrid',
    title: 'Monohybrid F1 Cross',
    subtitle: 'Selfing F1 (Tt × Tt)',
    p1: 'Tt',
    p2: 'Tt',
    description: 'Two heterozygous F1 individuals cross to generate the classic F2 3:1 phenotypic ratio.',
    poeRecessivePct: 25,
    badge: 'Classic 3:1 F₂ Cross',
  },
  {
    id: 'test_cross',
    title: 'Test Cross / Backcross',
    subtitle: 'Diagnostic Cross (Tt × tt)',
    p1: 'Tt',
    p2: 'tt',
    description: 'Heterozygote crossed with homozygous recessive tester. Yields a 1:1 phenotypic diagnostic ratio.',
    poeRecessivePct: 50,
    badge: 'Diagnostic 1:1 Cross',
  },
  {
    id: 'homo_dom_test',
    title: 'Homozygous Dominant Test',
    subtitle: 'Pure Tall × Tester (TT × tt)',
    p1: 'TT',
    p2: 'tt',
    description: 'If the unknown dominant parent is TT, 100% of progeny are tall and 0% are dwarf.',
    poeRecessivePct: 0,
    badge: '100% Dominant Progeny',
  },
];

// KCSE Examination Review Questions on Mendelian Inheritance
const KCSE_MENDEL_QUESTIONS = [
  {
    id: 'q1',
    question:
      'What is the cytological basis of Mendel\'s First Law (Law of Segregation)?',
    options: [
      'Separation of homologous chromosome pairs during Anaphase I of meiosis so each gamete carries only one allele for each gene',
      'Replication of sister chromatids during Interphase S-phase to double the allele count in gametes',
      'Random assortment of non-homologous chromosomes on the Metaphase I equatorial plate',
      'Crossing over and chiasmata formation between non-sister chromatids during Prophase I',
    ],
    correct: 0,
    rationale:
      'Mendel\'s First Law (Law of Segregation) states that alleles separate during gamete formation. In cell biology, this occurs during Anaphase I when homologous chromosomes with their respective alleles migrate to opposite poles of the spindle.',
    paperRef: 'KCSE Biology Paper 2 · Section B',
  },
  {
    id: 'q2',
    question:
      'A botanist crosses a tall pea plant with a dwarf pea plant (tt). The resulting harvest comprises 48 tall plants and 52 dwarf plants. What was the genotype of the tall parent plant?',
    options: [
      'Heterozygous (Tt)',
      'Homozygous dominant (TT)',
      'Homozygous recessive (tt)',
      'Hemizygous (T-)',
    ],
    correct: 0,
    rationale:
      'A cross with homozygous recessive (tt) is a test cross. The offspring ratio is approximately 1 Tall : 1 Dwarf (48:52 ≈ 1:1). This 1:1 ratio proves that the tall parent was heterozygous (Tt), providing the recessive \'t\' allele to half the gametes.',
    paperRef: 'KCSE Biology Paper 1 · Genetics Diagnostics',
  },
  {
    id: 'q3',
    question:
      'In garden peas, the dwarf phenotype (tt) is caused by a deficient gibberellin synthesis enzyme (GA 3-oxidase). Why is the heterozygous plant (Tt) tall rather than intermediate in height?',
    options: [
      'A single functional wild-type allele (T) produces sufficient active enzyme to satisfy hormonal growth requirements (haplosufficiency)',
      'The recessive allele (t) is actively destroyed during transcription by ribosomal enzymes',
      'Heterozygous plants synthesize a completely different hormone to compensate for GA₁ absence',
      'Dominance is caused by physical dominance of the larger chromosome over the smaller chromosome',
    ],
    correct: 0,
    rationale:
      'Complete dominance is rooted in enzyme kinetics: in heterozygous plants (Tt), the single functional \'T\' allele produces enough active GA 3-oxidase enzyme to synthesize the necessary threshold concentration of gibberellin (GA₁) for full stem elongation.',
    paperRef: 'KCSE Biology Form 4 · Gene Action & Enzyme Function',
  },
  {
    id: 'q4',
    question:
      'In a dihybrid cross between two pea plants heterozygous for both seed shape and seed colour (RrYy × RrYy), what fraction of the F2 harvest is expected to have wrinkled green seeds (rryy)?',
    options: [
      '1 / 16 (6.25%)',
      '3 / 16 (18.75%)',
      '9 / 16 (56.25%)',
      '4 / 16 (25.0%)',
    ],
    correct: 0,
    rationale:
      'Mendel\'s Second Law states that independent assortment of two heterozygous pairs produces a 9:3:3:1 phenotypic ratio. Wrinkled green seeds are homozygous recessive for both traits (rryy), representing 1 out of every 16 offspring (1/4 × 1/4 = 1/16).',
    paperRef: 'KCSE Biology Paper 2 · Dihybrid Calculations',
  },
];

// ============================================================================
// 2. SVG ILLUSTRATIONS (PEA PLANTS, SEEDS, FLOWERS & GAMETES)
// ============================================================================

/**
 * High-quality SVG graphic representing the phenotype for Pisum sativum:
 * Tall vs Dwarf stem, Round vs Wrinkled seed, or Purple vs White flower.
 */
function PeaPhenotypeVisual({
  traitKey = 'height',
  genotype = 'Tt',
  scale = 1,
  showLabels = false,
  className = '',
}) {
  const trait = MENDELIAN_TRAITS[traitKey];
  const isDominant = genotype.includes(trait.domSymbol);

  if (traitKey === 'height') {
    // Stem Height SVG: Tall climbing pea vine vs stunted dwarf vine
    const isTall = isDominant;
    return (
      <div className={`relative flex flex-col items-center justify-end ${className}`}>
        <svg
          viewBox="0 0 140 180"
          className="w-full h-full max-h-[180px] drop-shadow-sm select-none"
          aria-label={isTall ? 'Tall Pea Plant' : 'Dwarf Pea Plant'}
        >
          {/* Soil Mound Base */}
          <ellipse cx="70" cy="172" rx="55" ry="7" fill="#78350f" opacity="0.3" />
          <path d="M 20 174 Q 70 162 120 174 Q 70 179 20 174 Z" fill="#92400e" />
          {/* Soil pebbles */}
          <circle cx="45" cy="173" r="2.5" fill="#5c2605" />
          <circle cx="78" cy="171" r="2" fill="#451a03" />
          <circle cx="95" cy="174" r="3" fill="#5c2605" />

          {isTall ? (
            /* Tall Pea Plant (1.5 - 2.0m scale) */
            <g id="tall-plant">
              {/* Supporting Garden Stake */}
              <line x1="82" y1="20" x2="82" y2="170" stroke="#a16207" strokeWidth="3" strokeDasharray="3,3" opacity="0.4" />
              <line x1="82" y1="20" x2="82" y2="170" stroke="#ca8a04" strokeWidth="1.5" opacity="0.6" />

              {/* Main climbing stem - curved sinuous vine */}
              <path
                d="M 70 170 Q 64 135 75 110 Q 86 85 68 55 Q 54 30 72 15"
                fill="none"
                stroke="#15803d"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <path
                d="M 70 170 Q 64 135 75 110 Q 86 85 68 55 Q 54 30 72 15"
                fill="none"
                stroke="#4ade80"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.7"
              />

              {/* Node 1 Leaves (Lower) */}
              <g transform="translate(68, 140)">
                <path d="M 0 0 C -25 -10 -35 5 -15 15 C -5 20 0 0 0 0" fill="#22c55e" stroke="#166534" strokeWidth="1" />
                <path d="M 0 0 C 25 -12 35 5 15 15 C 5 20 0 0 0 0" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
              </g>

              {/* Node 2 Leaves & Tendrils (Mid-low) */}
              <g transform="translate(73, 110)">
                <path d="M 0 0 C -30 -15 -35 -35 -10 -25 C 0 -15 0 0 0 0" fill="#22c55e" stroke="#166534" strokeWidth="1" />
                {/* Tendril curl */}
                <path d="M 0 0 Q -25 5 -35 -5 Q -40 -15 -30 -20 Q -20 -15 -25 -5" fill="none" stroke="#15803d" strokeWidth="1.5" />
              </g>

              {/* Node 3 Leaves & Blossom (Mid-high) */}
              <g transform="translate(72, 75)">
                <path d="M 0 0 C 30 -15 40 5 15 20 C 5 15 0 0 0 0" fill="#22c55e" stroke="#166534" strokeWidth="1" />
                {/* Mini pea flower */}
                <circle cx="28" cy="-5" r="5" fill="#a855f7" />
                <circle cx="25" cy="-2" r="3.5" fill="#c084fc" />
              </g>

              {/* Node 4 (Apex climbing tip & tendril) */}
              <g transform="translate(70, 35)">
                <path d="M 0 0 C -25 -15 -30 10 -10 15 C 0 10 0 0 0 0" fill="#4ade80" stroke="#166534" strokeWidth="1" />
                {/* Top curl tendril */}
                <path d="M 0 0 Q 25 -20 15 -35 Q 5 -40 0 -30 Q -5 -15 10 -10" fill="none" stroke="#22c55e" strokeWidth="1.5" />
              </g>

              {/* Apex young bud */}
              <circle cx="72" cy="15" r="4.5" fill="#86efac" stroke="#15803d" strokeWidth="1" />

              {/* Height indicator badge */}
              <g transform="translate(10, 30)">
                <rect x="0" y="0" width="38" height="20" rx="4" fill="#15803d" opacity="0.9" />
                <text x="19" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ~1.8 m
                </text>
              </g>
            </g>
          ) : (
            /* Dwarf Pea Plant (0.2 - 0.4m scale) */
            <g id="dwarf-plant">
              {/* Short, thick, compressed stem */}
              <path
                d="M 70 170 Q 68 145 71 125 Q 73 110 70 95"
                fill="none"
                stroke="#15803d"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 70 170 Q 68 145 71 125 Q 73 110 70 95"
                fill="none"
                stroke="#86efac"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.6"
              />

              {/* Compressed clustered foliage near ground */}
              <g transform="translate(70, 145)">
                <path d="M 0 0 C -28 -5 -32 15 -12 18 C -2 15 0 0 0 0" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
                <path d="M 0 0 C 28 -5 32 15 12 18 C 2 15 0 0 0 0" fill="#15803d" stroke="#14532d" strokeWidth="1" />
              </g>

              <g transform="translate(71, 120)">
                <path d="M 0 0 C -25 -15 -28 5 -10 12 C 0 8 0 0 0 0" fill="#22c55e" stroke="#166534" strokeWidth="1" />
                <path d="M 0 0 C 25 -15 28 5 10 12 C 0 8 0 0 0 0" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
              </g>

              {/* Terminal apex rosette at short height */}
              <g transform="translate(70, 95)">
                <ellipse cx="0" cy="-5" rx="14" ry="8" fill="#4ade80" stroke="#166534" strokeWidth="1" />
                <circle cx="-8" cy="-6" r="4" fill="#86efac" />
                <circle cx="8" cy="-6" r="4" fill="#86efac" />
                <circle cx="0" cy="-10" r="4" fill="#bbf7d0" stroke="#15803d" strokeWidth="0.8" />
              </g>

              {/* Height indicator badge */}
              <g transform="translate(10, 105)">
                <rect x="0" y="0" width="38" height="20" rx="4" fill="#d97706" opacity="0.9" />
                <text x="19" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ~0.3 m
                </text>
              </g>
            </g>
          )}
        </svg>

        {showLabels && (
          <div className="mt-1 text-center">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isDominant
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {isDominant ? 'Tall Stem (Dominant)' : 'Dwarf Stem (Recessive)'}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (traitKey === 'texture') {
    // Seed Texture SVG: Round smooth sphere vs irregular wrinkled seed
    const isRound = isDominant;
    return (
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full max-h-[140px] drop-shadow-sm select-none"
          aria-label={isRound ? 'Round Pea Seed' : 'Wrinkled Pea Seed'}
        >
          <defs>
            {/* Round seed 3D shading */}
            <radialGradient id="roundSeedGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#84cc16" />
              <stop offset="85%" stopColor="#4d7c0f" />
              <stop offset="100%" stopColor="#365314" />
            </radialGradient>
            {/* Wrinkled seed rough shading */}
            <radialGradient id="wrinkledSeedGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="80%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
          </defs>

          {/* Shadow under seed */}
          <ellipse cx="60" cy="104" rx="42" ry="8" fill="#0f172a" opacity="0.18" />

          {isRound ? (
            /* Smooth Round Seed */
            <g id="round-seed">
              {/* Perfectly round body with subtle natural eccentricity */}
              <circle cx="60" cy="58" r="44" fill="url(#roundSeedGrad)" stroke="#3f6212" strokeWidth="2" />
              {/* Hilum (seed scar) */}
              <ellipse cx="38" cy="45" rx="5" ry="3" fill="#65a30d" opacity="0.6" transform="rotate(-25 38 45)" />
              {/* Specular highlight */}
              <ellipse cx="48" cy="38" rx="14" ry="8" fill="#ffffff" opacity="0.45" transform="rotate(-30 48 38)" />
              <circle cx="44" cy="34" r="3.5" fill="#ffffff" opacity="0.75" />
            </g>
          ) : (
            /* Wrinkled Shrunken Seed */
            <g id="wrinkled-seed">
              {/* Dimpled, crumpled, shrunken perimeter */}
              <path
                d="M 60 16 
                   C 75 14, 90 22, 98 35 
                   C 106 48, 102 62, 100 75 
                   C 98 88, 88 98, 72 101 
                   C 56 104, 42 98, 30 92 
                   C 18 84, 14 70, 16 55 
                   C 18 40, 28 26, 42 19 
                   C 50 15, 55 16, 60 16 Z"
                fill="url(#wrinkledSeedGrad)"
                stroke="#9a3412"
                strokeWidth="2.5"
              />
              {/* Wrinkle crease lines and indentations */}
              <path
                d="M 40 32 Q 55 42 50 62 Q 46 80 62 88"
                fill="none"
                stroke="#78350f"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                d="M 65 30 Q 75 48 70 70"
                fill="none"
                stroke="#78350f"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d="M 32 55 Q 45 58 55 52"
                fill="none"
                stroke="#9a3412"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
              <path
                d="M 72 58 Q 88 62 94 50"
                fill="none"
                stroke="#78350f"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.7"
              />
              {/* Depressed hollows */}
              <ellipse cx="48" cy="48" rx="8" ry="5" fill="#78350f" opacity="0.35" transform="rotate(15 48 48)" />
              <ellipse cx="75" cy="42" rx="7" ry="4" fill="#78350f" opacity="0.3" transform="rotate(-20 75 42)" />
              {/* Weak specular glint */}
              <circle cx="42" cy="28" r="2.5" fill="#ffffff" opacity="0.5" />
            </g>
          )}
        </svg>

        {showLabels && (
          <div className="mt-1 text-center">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isDominant
                  ? 'bg-sky-100 text-sky-800 border border-sky-300'
                  : 'bg-orange-100 text-orange-800 border border-orange-300'
              }`}
            >
              {isDominant ? 'Round (SBEI Active)' : 'Wrinkled (SBEI Deficient)'}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (traitKey === 'flower') {
    // Flower Colour SVG: Vibrant Purple vs Pure White pea flower
    const isPurple = isDominant;
    return (
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full max-h-[140px] drop-shadow-sm select-none"
          aria-label={isPurple ? 'Purple Pea Flower' : 'White Pea Flower'}
        >
          <defs>
            <radialGradient id="purplePetalGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#e9d5ff" />
              <stop offset="35%" stopColor="#c084fc" />
              <stop offset="80%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#581c87" />
            </radialGradient>
            <radialGradient id="whitePetalGrad" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f8fafc" />
              <stop offset="85%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </radialGradient>
          </defs>

          {/* Calyx & Stem */}
          <path d="M 60 90 L 60 115" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
          <path d="M 52 92 C 55 85 65 85 68 92 Z" fill="#166534" />
          {/* Sepals */}
          <path d="M 54 88 L 42 98 L 52 94 Z" fill="#15803d" />
          <path d="M 66 88 L 78 98 L 68 94 Z" fill="#15803d" />

          {isPurple ? (
            /* Papilionaceous Pea Flower - Purple Anthocyanin */
            <g id="purple-flower">
              {/* Standard (Banner) Petal - Large Upper Petal */}
              <path
                d="M 60 78 
                   C 32 78, 18 55, 24 35 
                   C 30 15, 52 12, 60 18 
                   C 68 12, 90 15, 96 35 
                   C 102 55, 88 78, 60 78 Z"
                fill="url(#purplePetalGrad)"
                stroke="#6b21a8"
                strokeWidth="1.8"
              />
              {/* Standard Petal Veins */}
              <path d="M 60 22 Q 45 42 38 60" fill="none" stroke="#7e22ce" strokeWidth="1" opacity="0.6" />
              <path d="M 60 22 Q 75 42 82 60" fill="none" stroke="#7e22ce" strokeWidth="1" opacity="0.6" />
              <path d="M 60 22 L 60 68" fill="none" stroke="#6b21a8" strokeWidth="1.2" opacity="0.7" />

              {/* Wing Petals (Lateral Petals) */}
              <path
                d="M 60 72 C 40 70, 36 50, 48 42 C 56 38, 60 55, 60 72 Z"
                fill="#7e22ce"
                stroke="#581c87"
                strokeWidth="1.2"
              />
              <path
                d="M 60 72 C 80 70, 84 50, 72 42 C 64 38, 60 55, 60 72 Z"
                fill="#7e22ce"
                stroke="#581c87"
                strokeWidth="1.2"
              />

              {/* Keel Petal (Center boat-shaped) */}
              <ellipse cx="60" cy="62" rx="10" ry="14" fill="#a855f7" stroke="#6b21a8" strokeWidth="1" />
              {/* Stamen/Pollen Center Core */}
              <circle cx="60" cy="56" r="3.5" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            </g>
          ) : (
            /* Papilionaceous Pea Flower - Pure White (No Anthocyanin) */
            <g id="white-flower">
              {/* Standard (Banner) Petal */}
              <path
                d="M 60 78 
                   C 32 78, 18 55, 24 35 
                   C 30 15, 52 12, 60 18 
                   C 68 12, 90 15, 96 35 
                   C 102 55, 88 78, 60 78 Z"
                fill="url(#whitePetalGrad)"
                stroke="#94a3b8"
                strokeWidth="1.8"
              />
              {/* Subtle translucent veins */}
              <path d="M 60 22 Q 45 42 38 60" fill="none" stroke="#cbd5e1" strokeWidth="1" opacity="0.8" />
              <path d="M 60 22 Q 75 42 82 60" fill="none" stroke="#cbd5e1" strokeWidth="1" opacity="0.8" />
              <path d="M 60 22 L 60 68" fill="none" stroke="#94a3b8" strokeWidth="1.2" opacity="0.8" />

              {/* Wing Petals */}
              <path
                d="M 60 72 C 40 70, 36 50, 48 42 C 56 38, 60 55, 60 72 Z"
                fill="#f1f5f9"
                stroke="#94a3b8"
                strokeWidth="1.2"
              />
              <path
                d="M 60 72 C 80 70, 84 50, 72 42 C 64 38, 60 55, 60 72 Z"
                fill="#f1f5f9"
                stroke="#94a3b8"
                strokeWidth="1.2"
              />

              {/* Keel Petal */}
              <ellipse cx="60" cy="62" rx="10" ry="14" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
              {/* Stamen/Pollen Center Core */}
              <circle cx="60" cy="56" r="3.5" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            </g>
          )}
        </svg>

        {showLabels && (
          <div className="mt-1 text-center">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isDominant
                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                  : 'bg-slate-100 text-slate-800 border border-slate-300'
              }`}
            >
              {isDominant ? 'Purple (Anthocyanin +)' : 'White (Anthocyanin Deficient)'}
            </span>
          </div>
        )}
      </div>
    );
  }

  return null;
}

/**
 * Miniature phenotype icon to embed inside individual Punnett square cells.
 */
function MiniPhenotypeIcon({ traitKey, isDominant, size = 32 }) {
  if (traitKey === 'height') {
    return isDominant ? (
      <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full border border-emerald-300">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-emerald-700">
          <path d="M 12 22 L 12 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 12 12 Q 6 10 7 6 Q 11 8 12 12" fill="currentColor" opacity="0.8" />
          <path d="M 12 8 Q 18 6 17 2 Q 13 4 12 8" fill="currentColor" opacity="0.8" />
          <circle cx="12" cy="3" r="2" fill="#4ade80" />
        </svg>
      </div>
    ) : (
      <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full border border-amber-300">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-700">
          <path d="M 12 22 L 12 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M 12 16 Q 7 14 8 11 Q 12 12 12 16" fill="currentColor" opacity="0.8" />
          <circle cx="12" cy="11" r="2" fill="#f59e0b" />
        </svg>
      </div>
    );
  }

  if (traitKey === 'texture') {
    return isDominant ? (
      <div className="w-8 h-8 flex items-center justify-center bg-sky-100 rounded-full border border-sky-300">
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-lime-600 to-yellow-300 border border-lime-700 shadow-inner" />
      </div>
    ) : (
      <div className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-full border border-orange-300">
        <svg viewBox="0 0 20 20" className="w-5 h-5 text-orange-600">
          <path
            d="M 10 2 C 14 1 17 4 18 8 C 19 12 16 16 12 18 C 8 19 3 17 2 12 C 1 7 4 3 10 2 Z"
            fill="#d97706"
            stroke="#9a3412"
            strokeWidth="1.2"
          />
          <path d="M 7 6 Q 10 10 8 14" stroke="#78350f" strokeWidth="1" fill="none" />
          <path d="M 11 7 Q 13 11 12 13" stroke="#78350f" strokeWidth="1" fill="none" />
        </svg>
      </div>
    );
  }

  if (traitKey === 'flower') {
    return isDominant ? (
      <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-full border border-purple-300">
        <div className="w-5 h-5 rounded-full bg-purple-600 border border-purple-800 flex items-center justify-center shadow-sm">
          <div className="w-2 h-2 rounded-full bg-amber-300" />
        </div>
      </div>
    ) : (
      <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full border border-slate-300">
        <div className="w-5 h-5 rounded-full bg-white border border-slate-400 flex items-center justify-center shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Animated Gamete Token representation for pollen (male) or ovule (female).
 */
function GameteToken({
  allele,
  isDominant,
  type = 'pollen', // 'pollen' | 'ovule'
  animState = 'idle',
}) {
  const isPollen = type === 'pollen';
  return (
    <div
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full font-mono font-bold text-base shadow transition-all duration-500 ${
        isPollen
          ? 'bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-amber-400 text-amber-900'
          : 'bg-gradient-to-b from-indigo-100 to-indigo-200 border-2 border-indigo-400 text-indigo-900'
      } ${animState === 'fusing' ? 'scale-110 ring-4 ring-yellow-400 animate-pulse' : ''}`}
      title={`${isPollen ? 'Male Pollen' : 'Female Ovule'} Gamete (Allele ${allele})`}
    >
      <span className="relative z-10">{allele}</span>
      <span
        className={`absolute -bottom-1 -right-1 text-[9px] px-1 py-0.5 rounded font-sans font-semibold uppercase ${
          isPollen ? 'bg-amber-600 text-white' : 'bg-indigo-600 text-white'
        }`}
      >
        {isPollen ? '♂' : '♀'}
      </span>
    </div>
  );
}

// ============================================================================
// 3. MAIN COMPONENT: MendelianInheritanceLabSim
// ============================================================================

export default function MendelianInheritanceLabSim({ config = {}, onTelemetry }) {
  // Navigation tabs:
  // - 'monohybrid': 2x2 Punnett Square with animated fertilization, POE hypothesis, ratios
  // - 'testcross': Mystery parent diagnostic solver (KCSE backcross testing)
  // - 'dihybrid': 4x4 Punnett Grid exploring Mendel's 2nd Law (Independent Assortment)
  // - 'biochemistry': Molecular mechanism deep-dive (Le gene, SBEI, bHLH)
  // - 'kcse_quiz': Form 4 Biology exam review questions with instant feedback
  const [activeTab, setActiveTab] = useState('monohybrid');

  // CONTROL 1: Trait Selector (Height, Texture, Flower)
  const [traitKey, setTraitKey] = useState('height');
  const activeTrait = MENDELIAN_TRAITS[traitKey];

  // CONTROL 2: Parent Genotypes (TT, Tt, tt)
  const [parent1Genotype, setParent1Genotype] = useState('Tt'); // Male / Pollen parent
  const [parent2Genotype, setParent2Genotype] = useState('Tt'); // Female / Ovule parent

  // CONTROL 3: Fertilisation & Gamete Animation State
  // 'idle' -> 'segregating' -> 'migrating' -> 'fertilised'
  const [fertilisationStage, setFertilisationStage] = useState('idle');
  const [isAutoAnimating, setIsAutoAnimating] = useState(false);
  const animTimerRef = useRef(null);

  // PREDICT-OBSERVE-EXPLAIN (POE) STATE
  const [poePrediction, setPoePrediction] = useState(null); // 0, 25, 50, 75, 100 (%)
  const [poeSubmitted, setPoeSubmitted] = useState(false);
  const [poeFeedbackOpen, setPoeFeedbackOpen] = useState(false);

  // TEST CROSS CHALLENGE STATE
  const [mysteryTraitKey, setMysteryTraitKey] = useState('height');
  const [mysteryTrueGenotype, setMysteryTrueGenotype] = useState('Tt'); // Secret: 'TT' or 'Tt'
  const [testSampleSize, setTestSampleSize] = useState(40);
  const [testCrossOffspring, setTestCrossOffspring] = useState(null);
  const [testCrossUserClaim, setTestCrossUserClaim] = useState(null); // 'TT' or 'Tt'
  const [testCrossVerdict, setTestCrossVerdict] = useState(null);
  const [mysteryRevealed, setMysteryRevealed] = useState(false);
  const [testCrossStreak, setTestCrossStreak] = useState(0);

  // DIHYBRID CROSS STATE (Seed Shape R/r & Seed Colour Y/y)
  const [dihybridP1, setDihybridP1] = useState('RrYy');
  const [dihybridP2, setDihybridP2] = useState('RrYy');

  // KCSE QUIZ STATE
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Telemetry Tracker
  const [telemetryEmitted, setTelemetryEmitted] = useState({});

  // --------------------------------------------------------------------------
  // MONOHYBRID CALCULATIONS & GAMETE SEGREGATION (Mendel's First Law)
  // --------------------------------------------------------------------------

  // Gametes segregated from Parent 1 and Parent 2
  const p1Gametes = useMemo(() => parent1Genotype.split(''), [parent1Genotype]);
  const p2Gametes = useMemo(() => parent2Genotype.split(''), [parent2Genotype]);

  // Helper to normalize genotype string with capital dominant letter first
  const normalizeGenotype = (g1, g2, domSym, recSym) => {
    if (g1 === domSym || g2 === domSym) {
      if (g1 === domSym && g2 === domSym) return `${domSym}${domSym}`;
      return `${domSym}${recSym}`;
    }
    return `${recSym}${recSym}`;
  };

  // 2x2 Punnett Grid cells (4 combinations)
  const punnettCells = useMemo(() => {
    const dom = activeTrait.domSymbol;
    const rec = activeTrait.recSymbol;
    const cells = [];

    // Row = Parent 1 gamete (pollen), Col = Parent 2 gamete (ovule)
    p1Gametes.forEach((g1, rowIdx) => {
      p2Gametes.forEach((g2, colIdx) => {
        const genotype = normalizeGenotype(g1, g2, dom, rec);
        const isDominant = genotype.includes(dom);
        const phenotype = isDominant ? activeTrait.domName : activeTrait.recName;
        const zygosity =
          genotype === `${dom}${dom}`
            ? 'Homozygous Dominant'
            : genotype === `${dom}${rec}`
            ? 'Heterozygous'
            : 'Homozygous Recessive';

        cells.push({
          id: `cell-${rowIdx}-${colIdx}`,
          rowIdx,
          colIdx,
          p1Gamete: g1,
          p2Gamete: g2,
          genotype,
          phenotype,
          isDominant,
          zygosity,
          probability: '25% (1/4)',
        });
      });
    });
    return cells;
  }, [p1Gametes, p2Gametes, activeTrait]);

  // Dynamic Ratios and Percentage Breakdowns
  const ratioStats = useMemo(() => {
    const dom = activeTrait.domSymbol;
    const rec = activeTrait.recSymbol;
    const domHom = `${dom}${dom}`;
    const het = `${dom}${rec}`;
    const recHom = `${rec}${rec}`;

    let domHomCount = 0;
    let hetCount = 0;
    let recHomCount = 0;
    let dominantCount = 0;
    let recessiveCount = 0;

    punnettCells.forEach((c) => {
      if (c.genotype === domHom) domHomCount++;
      else if (c.genotype === het) hetCount++;
      else if (c.genotype === recHom) recHomCount++;

      if (c.isDominant) dominantCount++;
      else recessiveCount++;
    });

    const dominantPct = (dominantCount / 4) * 100;
    const recessivePct = (recessiveCount / 4) * 100;

    return {
      domHomCount,
      hetCount,
      recHomCount,
      dominantCount,
      recessiveCount,
      dominantPct,
      recessivePct,
      phenotypicRatio: `${dominantCount} ${activeTrait.domName} : ${recessiveCount} ${activeTrait.recName}`,
      genotypicRatio: `${domHomCount} ${domHom} : ${hetCount} ${het} : ${recHomCount} ${recHom}`,
      domHomKey: domHom,
      hetKey: het,
      recHomKey: recHom,
    };
  }, [punnettCells, activeTrait]);

  // --------------------------------------------------------------------------
  // ANIMATION ENGINE: Fertilise & Generate Offspring
  // --------------------------------------------------------------------------

  const runFertilisationAnimation = () => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    setIsAutoAnimating(true);
    setFertilisationStage('segregating');

    // Step 1: Gamete segregation (0.6s)
    animTimerRef.current = setTimeout(() => {
      setFertilisationStage('migrating');

      // Step 2: Gamete descent into Punnett grid (1.2s)
      animTimerRef.current = setTimeout(() => {
        setFertilisationStage('fertilised');
        setIsAutoAnimating(false);
        setPoeFeedbackOpen(true);

        // Emit simulation telemetry on cross completion
        if (onTelemetry && !telemetryEmitted['first_cross']) {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            simulation: 'monohybrid_dihybrid_punnett_genetics',
            step: 'cross_completed',
            trait: traitKey,
            p1: parent1Genotype,
            p2: parent2Genotype,
            phenotypicRatio: ratioStats.phenotypicRatio,
          });
          setTelemetryEmitted((prev) => ({ ...prev, first_cross: true }));
        }
      }, 700);
    }, 600);
  };

  // Reset to standard F1 cross defaults
  const handleResetCross = () => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    setParent1Genotype('Tt');
    setParent2Genotype('Tt');
    setFertilisationStage('idle');
    setIsAutoAnimating(false);
    setPoePrediction(null);
    setPoeSubmitted(false);
    setPoeFeedbackOpen(false);
  };

  // Apply a preset cross
  const handleApplyPreset = (preset) => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    const dom = activeTrait.domSymbol;
    const rec = activeTrait.recSymbol;

    // Convert template letters (T/t) to active trait letters
    const mapGenotype = (gt) =>
      gt
        .replace(/T/g, dom)
        .replace(/t/g, rec);

    setParent1Genotype(mapGenotype(preset.p1));
    setParent2Genotype(mapGenotype(preset.p2));
    setFertilisationStage('idle');
    setPoePrediction(null);
    setPoeSubmitted(false);
    setPoeFeedbackOpen(false);
  };

  // When trait changes, remap parent genotypes to current trait letters
  const handleTraitChange = (newTraitKey) => {
    const oldTrait = MENDELIAN_TRAITS[traitKey];
    const newTrait = MENDELIAN_TRAITS[newTraitKey];

    const convert = (gt) =>
      gt
        .replace(new RegExp(oldTrait.domSymbol, 'g'), newTrait.domSymbol)
        .replace(new RegExp(oldTrait.recSymbol, 'g'), newTrait.recSymbol);

    setParent1Genotype(convert(parent1Genotype));
    setParent2Genotype(convert(parent2Genotype));
    setTraitKey(newTraitKey);
    setFertilisationStage('idle');
    setPoeSubmitted(false);
  };

  // Clean up animation timers on unmount
  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, []);

  // --------------------------------------------------------------------------
  // TEST CROSS GENERATOR & DIAGNOSTIC ENGINE
  // --------------------------------------------------------------------------

  // Initialize a new mystery plant challenge
  const handleNewMysteryPlant = () => {
    // Randomly pick homozygous dominant (TT) or heterozygous (Tt)
    const secret = Math.random() < 0.5 ? 'TT' : 'Tt';
    setMysteryTrueGenotype(secret);
    setTestCrossOffspring(null);
    setTestCrossUserClaim(null);
    setTestCrossVerdict(null);
    setMysteryRevealed(false);
  };

  // Perform the test cross with homozygous recessive tester (tt)
  const handleRunTestCross = () => {
    const isHetero = mysteryTrueGenotype === 'Tt';
    let domCount = 0;
    let recCount = 0;

    // Simulate binomial offspring production
    for (let i = 0; i < testSampleSize; i++) {
      if (isHetero) {
        // Heterozygote: 50% chance of passing 't' + tester 't' -> tt (recessive)
        if (Math.random() < 0.5) domCount++;
        else recCount++;
      } else {
        // Homozygous dominant (TT): 100% inherit 'T' from mystery parent -> Tt (all dominant)
        domCount++;
      }
    }

    // Pedagogical safeguard: A heterozygous test cross must produce at least 1 recessive offspring
    // so the student can perform the diagnostic deduction accurately.
    if (isHetero && recCount === 0 && testSampleSize >= 20) {
      recCount = 1;
      domCount = testSampleSize - 1;
    }

    setTestCrossOffspring({
      total: testSampleSize,
      domCount,
      recCount,
      domPct: Math.round((domCount / testSampleSize) * 100),
      recPct: Math.round((recCount / testSampleSize) * 100),
      hasRecessiveProgeny: recCount > 0,
    });
  };

  // Student submits their diagnostic claim
  const handleDiagnoseMystery = (claimedGenotype) => {
    setTestCrossUserClaim(claimedGenotype);
    const isCorrect = claimedGenotype === mysteryTrueGenotype;
    setMysteryRevealed(true);

    if (isCorrect) {
      setTestCrossVerdict('correct');
      setTestCrossStreak((prev) => prev + 1);

      // Emit telemetry for test cross checkpoint
      if (onTelemetry) {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'monohybrid_dihybrid_punnett_genetics',
          checkpoint: 'test_cross_diagnostic_verified',
          claimed: claimedGenotype,
          actual: mysteryTrueGenotype,
          streak: testCrossStreak + 1,
        });
      }
    } else {
      setTestCrossVerdict('incorrect');
      setTestCrossStreak(0);
    }
  };

  // --------------------------------------------------------------------------
  // DIHYBRID CALCULATIONS (16-Square Grid: Mendel's Second Law)
  // --------------------------------------------------------------------------

  // Extract gametes for dihybrid genotype (e.g. RrYy -> RY, Ry, rY, ry)
  const getDihybridGametes = (genotype) => {
    const a1 = [genotype[0], genotype[1]];
    const a2 = [genotype[2], genotype[3]];
    const gametes = [];
    a1.forEach((g1) => {
      a2.forEach((g2) => {
        gametes.push(`${g1}${g2}`);
      });
    });
    return gametes;
  };

  const dihybridG1 = useMemo(() => getDihybridGametes(dihybridP1), [dihybridP1]);
  const dihybridG2 = useMemo(() => getDihybridGametes(dihybridP2), [dihybridP2]);

  const dihybridGrid = useMemo(() => {
    const cells = [];
    dihybridG1.forEach((g1, rowIdx) => {
      dihybridG2.forEach((g2, colIdx) => {
        // Gene 1: Seed Shape (R/r)
        const shapeAlleles = [g1[0], g2[0]].sort();
        const shapeGenotype =
          shapeAlleles.includes('R') && !shapeAlleles.includes('r')
            ? 'RR'
            : shapeAlleles.includes('R')
            ? 'Rr'
            : 'rr';
        const isRound = shapeGenotype.includes('R');

        // Gene 2: Seed Colour (Y/y)
        const colorAlleles = [g1[1], g2[1]].sort();
        const colorGenotype =
          colorAlleles.includes('Y') && !colorAlleles.includes('y')
            ? 'YY'
            : colorAlleles.includes('Y')
            ? 'Yy'
            : 'yy';
        const isYellow = colorGenotype.includes('Y');

        const combinedGenotype = `${shapeGenotype}${colorGenotype}`;
        const phenotype = `${isRound ? 'Round' : 'Wrinkled'} ${isYellow ? 'Yellow' : 'Green'}`;

        cells.push({
          id: `dihybrid-${rowIdx}-${colIdx}`,
          rowGamete: g1,
          colGamete: g2,
          genotype: combinedGenotype,
          phenotype,
          isRound,
          isYellow,
          shapeGenotype,
          colorGenotype,
        });
      });
    });
    return cells;
  }, [dihybridG1, dihybridG2]);

  // Phenotypic counts for dihybrid cross (Classic 9:3:3:1)
  const dihybridCounts = useMemo(() => {
    let roundYellow = 0;
    let roundGreen = 0;
    let wrinkledYellow = 0;
    let wrinkledGreen = 0;

    dihybridGrid.forEach((c) => {
      if (c.isRound && c.isYellow) roundYellow++;
      else if (c.isRound && !c.isYellow) roundGreen++;
      else if (!c.isRound && c.isYellow) wrinkledYellow++;
      else wrinkledGreen++;
    });

    return { roundYellow, roundGreen, wrinkledYellow, wrinkledGreen };
  }, [dihybridGrid]);

  // --------------------------------------------------------------------------
  // KCSE QUIZ EVALUATION
  // --------------------------------------------------------------------------

  const handleSelectQuizAnswer = (qId, optionIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    KCSE_MENDEL_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (onTelemetry) {
      onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
        simulation: 'monohybrid_dihybrid_punnett_genetics',
        checkpoint: 'kcse_quiz_completed',
        score,
        total: KCSE_MENDEL_QUESTIONS.length,
      });
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  // ============================================================================
  // 4. RENDER UI
  // ============================================================================

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-5 font-sans space-y-6 text-slate-800">
      {/* HEADER BANNER */}
      <header className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl relative overflow-hidden">
        {/* Background decorative genetics motifs */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-6 pointer-events-none">
          <Dna className="w-64 h-64 text-emerald-200" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-500/30 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1.5">
              <Dna className="w-3.5 h-3.5" /> Form 4 Biology · Topic 1: Genetics
            </span>
            <span className="bg-teal-500/30 text-teal-200 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-teal-400/30">
              Mendelian Genetics & Punnett Squares
            </span>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-medium px-2 py-0.5 rounded-full border border-amber-400/30">
              KCSE Core Syllabus
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>Mendelian Inheritance Lab</span>
            <span className="text-xs font-medium bg-emerald-400/20 text-emerald-300 px-2 py-1 rounded-md border border-emerald-400/40">
              Pisum sativum
            </span>
          </h1>

          <p className="text-emerald-100/90 text-sm max-w-2xl leading-relaxed">
            Investigate how allele pairs segregate during meiosis (Mendel&apos;s First Law) and randomly
            fertilise to determine offspring genotypes and phenotypes. Connect abstract gene letters to
            active enzymes, gibberellin synthesis, and starch biochemistry.
          </p>
        </div>

        {/* NAVIGATION TABS */}
        <nav className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-emerald-700/50">
          <button
            onClick={() => setActiveTab('monohybrid')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'monohybrid'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/30'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" /> Monohybrid Cross (2×2)
          </button>
          <button
            onClick={() => setActiveTab('testcross')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'testcross'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/30'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <Microscope className="w-4 h-4" /> Test Cross Diagnostic
          </button>
          <button
            onClick={() => setActiveTab('dihybrid')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'dihybrid'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/30'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <Shuffle className="w-4 h-4" /> Dihybrid Cross (4×4)
          </button>
          <button
            onClick={() => setActiveTab('biochemistry')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'biochemistry'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/30'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4" /> Biochemical Basis
          </button>
          <button
            onClick={() => setActiveTab('kcse_quiz')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'kcse_quiz'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/30'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" /> KCSE Questions
          </button>
        </nav>
      </header>

      {/* ====================================================================== */}
      {/* TAB 1: MONOHYBRID PUNNETT SQUARE LAB                                   */}
      {/* ====================================================================== */}
      {activeTab === 'monohybrid' && (
        <div className="space-y-6">
          {/* TOP CONTROLS ROW */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* CONTROL 2: Trait Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                  <Split className="w-3.5 h-3.5 text-emerald-600" /> Select Mendelian Trait
                </label>
                <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                  {Object.values(MENDELIAN_TRAITS).map((trait) => (
                    <button
                      key={trait.id}
                      onClick={() => handleTraitChange(trait.id)}
                      className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                        traitKey === trait.id
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {trait.name} ({trait.domSymbol}/{trait.recSymbol})
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS: FERTILISE & RESET */}
              <div className="flex items-center gap-2">
                <button
                  onClick={runFertilisationAnimation}
                  disabled={isAutoAnimating}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition-all ${
                    isAutoAnimating
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-200 active:scale-95'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${isAutoAnimating ? 'animate-spin' : ''}`} />
                  {isAutoAnimating ? 'Fertilising...' : 'Fertilise & Generate Offspring'}
                </button>

                <button
                  onClick={handleResetCross}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
                  title="Reset to default Tt × Tt cross"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PRESET QUICK BUTTONS */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500 mr-2">Standard Cross Presets:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1 sm:mt-0">
                {PRESET_CROSSES.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className="text-xs font-medium px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PREDICT-OBSERVE-EXPLAIN (POE) PROMPT BANNER */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-2xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl shadow-sm">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Predict-Observe-Explain (POE) Prompt
                  </span>
                  <span className="text-[11px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-semibold">
                    Scientific Method
                  </span>
                </div>
                <p className="text-sm text-amber-950 font-medium mt-1">
                  Before fertilisation of{' '}
                  <span className="font-bold font-mono text-emerald-700">{parent1Genotype}</span> ×{' '}
                  <span className="font-bold font-mono text-emerald-700">{parent2Genotype}</span>, predict:{' '}
                  <strong>What percentage of the offspring will express the recessive {activeTrait.recName} phenotype?</strong>
                </p>
              </div>
            </div>

            {/* Prediction Choices */}
            <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-10">
              {[0, 25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    setPoePrediction(pct);
                    setPoeSubmitted(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    poePrediction === pct
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400 ring-offset-1'
                      : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-100/60'
                  }`}
                >
                  {pct}% {pct === 25 ? '(1 in 4)' : pct === 50 ? '(1 in 2)' : pct === 0 ? '(None)' : ''}
                </button>
              ))}

              {poePrediction !== null && !poeFeedbackOpen && (
                <span className="text-xs text-amber-800 italic ml-2">
                  Hypothesis logged! Click &quot;Fertilise&quot; to test.
                </span>
              )}
            </div>

            {/* Observation & Explanation (unlocked upon fertilisation) */}
            {poeFeedbackOpen && poePrediction !== null && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-amber-200/80 text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-2">
                  {poePrediction === ratioStats.recessivePct ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hypothesis Confirmed!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-bold text-amber-700">
                      <Info className="w-4 h-4 text-amber-600" /> Observation vs Prediction:
                    </span>
                  )}
                  <span className="text-slate-500">
                    You predicted <strong>{poePrediction}%</strong>; observed frequency is{' '}
                    <strong>{ratioStats.recessivePct}%</strong> ({ratioStats.recessiveCount}/4 cells).
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Biological Mechanism:</strong> Mendel&apos;s First Law states that paired alleles segregate
                  independently during meiosis. In this cross ({parent1Genotype} × {parent2Genotype}), recessive alleles
                  unite in {ratioStats.recessiveCount} out of 4 fertilisation events ({ratioStats.recessivePct}%).
                </p>
              </div>
            )}
          </div>

          {/* PARENT PLANTS & GAMETE SEGREGATION ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PARENT 1 (MALE / POLLEN DONOR) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h3 className="text-sm font-bold text-slate-900">Parent 1 (Pollen Donor ♂)</h3>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                    Diploid (2n)
                  </span>
                </div>

                {/* Genotype Picker for Parent 1 */}
                <div className="flex gap-2 mb-4">
                  {[`${activeTrait.domSymbol}${activeTrait.domSymbol}`, `${activeTrait.domSymbol}${activeTrait.recSymbol}`, `${activeTrait.recSymbol}${activeTrait.recSymbol}`].map(
                    (gt) => (
                      <button
                        key={gt}
                        onClick={() => {
                          setParent1Genotype(gt);
                          setFertilisationStage('idle');
                        }}
                        className={`flex-1 py-2 px-1 rounded-xl text-center font-mono font-bold text-sm border transition-all ${
                          parent1Genotype === gt
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>{gt}</div>
                        <div className="text-[10px] font-sans font-normal text-slate-500">
                          {gt === `${activeTrait.domSymbol}${activeTrait.domSymbol}`
                            ? 'Homozygous Dom'
                            : gt === `${activeTrait.domSymbol}${activeTrait.recSymbol}`
                            ? 'Heterozygous'
                            : 'Homozygous Rec'}
                        </div>
                      </button>
                    )
                  )}
                </div>

                {/* Plant Visual Illustration */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-center min-h-[160px]">
                  <PeaPhenotypeVisual
                    traitKey={traitKey}
                    genotype={parent1Genotype}
                    showLabels={true}
                    className="w-48"
                  />
                </div>
              </div>

              {/* Gamete Segregation Container */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold flex items-center gap-1">
                    <Split className="w-3 h-3 text-amber-500" /> Meiosis: Segregated Pollen Gametes (n)
                  </span>
                  <span>50% : 50%</span>
                </div>
                <div className="flex items-center justify-around p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/60">
                  <div className="flex items-center gap-2">
                    <GameteToken
                      allele={p1Gametes[0]}
                      isDominant={p1Gametes[0] === activeTrait.domSymbol}
                      type="pollen"
                      animState={fertilisationStage}
                    />
                    <span className="text-xs font-mono text-slate-600">Gamete A</span>
                  </div>
                  <div className="h-6 w-[1px] bg-amber-200" />
                  <div className="flex items-center gap-2">
                    <GameteToken
                      allele={p1Gametes[1]}
                      isDominant={p1Gametes[1] === activeTrait.domSymbol}
                      type="pollen"
                      animState={fertilisationStage}
                    />
                    <span className="text-xs font-mono text-slate-600">Gamete B</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PARENT 2 (FEMALE / OVULE DONOR) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <h3 className="text-sm font-bold text-slate-900">Parent 2 (Ovule Donor ♀)</h3>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                    Diploid (2n)
                  </span>
                </div>

                {/* Genotype Picker for Parent 2 */}
                <div className="flex gap-2 mb-4">
                  {[`${activeTrait.domSymbol}${activeTrait.domSymbol}`, `${activeTrait.domSymbol}${activeTrait.recSymbol}`, `${activeTrait.recSymbol}${activeTrait.recSymbol}`].map(
                    (gt) => (
                      <button
                        key={gt}
                        onClick={() => {
                          setParent2Genotype(gt);
                          setFertilisationStage('idle');
                        }}
                        className={`flex-1 py-2 px-1 rounded-xl text-center font-mono font-bold text-sm border transition-all ${
                          parent2Genotype === gt
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>{gt}</div>
                        <div className="text-[10px] font-sans font-normal text-slate-500">
                          {gt === `${activeTrait.domSymbol}${activeTrait.domSymbol}`
                            ? 'Homozygous Dom'
                            : gt === `${activeTrait.domSymbol}${activeTrait.recSymbol}`
                            ? 'Heterozygous'
                            : 'Homozygous Rec'}
                        </div>
                      </button>
                    )
                  )}
                </div>

                {/* Plant Visual Illustration */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-center min-h-[160px]">
                  <PeaPhenotypeVisual
                    traitKey={traitKey}
                    genotype={parent2Genotype}
                    showLabels={true}
                    className="w-48"
                  />
                </div>
              </div>

              {/* Gamete Segregation Container */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold flex items-center gap-1">
                    <Split className="w-3 h-3 text-indigo-500" /> Meiosis: Segregated Ovule Gametes (n)
                  </span>
                  <span>50% : 50%</span>
                </div>
                <div className="flex items-center justify-around p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-200/60">
                  <div className="flex items-center gap-2">
                    <GameteToken
                      allele={p2Gametes[0]}
                      isDominant={p2Gametes[0] === activeTrait.domSymbol}
                      type="ovule"
                      animState={fertilisationStage}
                    />
                    <span className="text-xs font-mono text-slate-600">Gamete A</span>
                  </div>
                  <div className="h-6 w-[1px] bg-indigo-200" />
                  <div className="flex items-center gap-2">
                    <GameteToken
                      allele={p2Gametes[1]}
                      isDominant={p2Gametes[1] === activeTrait.domSymbol}
                      type="ovule"
                      animState={fertilisationStage}
                    />
                    <span className="text-xs font-mono text-slate-600">Gamete B</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PUNNETT SQUARE (2x2 GRID) & RATIO SUMMARY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT 7 COLS: THE 2x2 PUNNETT GRID */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>Mendel&apos;s 2×2 Punnett Square Grid</span>
                    <span className="text-xs font-normal text-slate-500">
                      ({activeTrait.name})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Row gametes (P1 ♂) × Column gametes (P2 ♀) → Diploid F1/F2 Offspring
                  </p>
                </div>

                {fertilisationStage === 'fertilised' && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Fertilised (4 Zygotes)
                  </span>
                )}
              </div>

              {/* PUNNETT GRID LAYOUT */}
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[340px] max-w-[440px] mx-auto">
                  {/* TOP HEADER: Parent 2 Gametes (Columns) */}
                  <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                    <div className="col-span-3 text-right pr-2">
                      <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                        Ovule ♀
                      </span>
                      <span className="text-[10px] text-slate-400">P2 Gamete</span>
                    </div>

                    <div className="col-span-4 flex justify-center">
                      <GameteToken
                        allele={p2Gametes[0]}
                        isDominant={p2Gametes[0] === activeTrait.domSymbol}
                        type="ovule"
                        animState={fertilisationStage}
                      />
                    </div>

                    <div className="col-span-4 flex justify-center">
                      <GameteToken
                        allele={p2Gametes[1]}
                        isDominant={p2Gametes[1] === activeTrait.domSymbol}
                        type="ovule"
                        animState={fertilisationStage}
                      />
                    </div>
                  </div>

                  {/* ROW 1: Parent 1 Gamete A */}
                  <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                    <div className="col-span-3 flex items-center justify-end gap-2 pr-2">
                      <div>
                        <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block text-right">
                          Pollen ♂
                        </span>
                        <span className="text-[10px] text-slate-400 block text-right">Gamete 1A</span>
                      </div>
                      <GameteToken
                        allele={p1Gametes[0]}
                        isDominant={p1Gametes[0] === activeTrait.domSymbol}
                        type="pollen"
                        animState={fertilisationStage}
                      />
                    </div>

                    {/* Cell (0,0) */}
                    <div className="col-span-4">
                      <PunnettGridCell
                        cell={punnettCells[0]}
                        traitKey={traitKey}
                        animStage={fertilisationStage}
                      />
                    </div>

                    {/* Cell (0,1) */}
                    <div className="col-span-4">
                      <PunnettGridCell
                        cell={punnettCells[1]}
                        traitKey={traitKey}
                        animStage={fertilisationStage}
                      />
                    </div>
                  </div>

                  {/* ROW 2: Parent 1 Gamete B */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3 flex items-center justify-end gap-2 pr-2">
                      <div>
                        <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block text-right">
                          Pollen ♂
                        </span>
                        <span className="text-[10px] text-slate-400 block text-right">Gamete 1B</span>
                      </div>
                      <GameteToken
                        allele={p1Gametes[1]}
                        isDominant={p1Gametes[1] === activeTrait.domSymbol}
                        type="pollen"
                        animState={fertilisationStage}
                      />
                    </div>

                    {/* Cell (1,0) */}
                    <div className="col-span-4">
                      <PunnettGridCell
                        cell={punnettCells[2]}
                        traitKey={traitKey}
                        animStage={fertilisationStage}
                      />
                    </div>

                    {/* Cell (1,1) */}
                    <div className="col-span-4">
                      <PunnettGridCell
                        cell={punnettCells[3]}
                        traitKey={traitKey}
                        animStage={fertilisationStage}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Biological takeaway caption */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Mendel&apos;s First Law (Law of Segregation):</strong> The two alleles for a trait
                  separate during gamete formation so that each gamete carries only one allele. Fertilisation
                  re-establishes the diploid pair with equal 25% mathematical probability per grid cell.
                </p>
              </div>
            </div>

            {/* RIGHT 5 COLS: PHENOTYPIC & GENOTYPIC RATIO READOUTS */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" /> Statistical Ratio Readouts
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculated from the 4-cell Punnett Square segregation
                </p>

                {/* PHENOTYPIC RATIO CARD */}
                <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                      Phenotypic Ratio
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {ratioStats.phenotypicRatio}
                    </span>
                  </div>

                  {/* Visual Proportion Bar */}
                  <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      style={{ width: `${ratioStats.dominantPct}%` }}
                      className="bg-emerald-500 h-full transition-all duration-500 relative group"
                      title={`${activeTrait.domName}: ${ratioStats.dominantPct}%`}
                    />
                    <div
                      style={{ width: `${ratioStats.recessivePct}%` }}
                      className="bg-amber-500 h-full transition-all duration-500 relative group"
                      title={`${activeTrait.recName}: ${ratioStats.recessivePct}%`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      {activeTrait.domName}: {ratioStats.dominantPct}% ({ratioStats.dominantCount}/4)
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      {activeTrait.recName}: {ratioStats.recessivePct}% ({ratioStats.recessiveCount}/4)
                    </span>
                  </div>
                </div>

                {/* GENOTYPIC RATIO CARD */}
                <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                      Genotypic Ratio
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      {ratioStats.genotypicRatio}
                    </span>
                  </div>

                  {/* Genotypic Frequency Breakdown */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <div className="font-mono font-bold text-slate-800">{ratioStats.domHomKey}</div>
                      <div className="text-[10px] text-slate-400">Homozygous Dom</div>
                      <div className="font-semibold text-emerald-700 mt-0.5">
                        {((ratioStats.domHomCount / 4) * 100).toFixed(0)}% ({ratioStats.domHomCount}/4)
                      </div>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <div className="font-mono font-bold text-slate-800">{ratioStats.hetKey}</div>
                      <div className="text-[10px] text-slate-400">Heterozygous</div>
                      <div className="font-semibold text-blue-700 mt-0.5">
                        {((ratioStats.hetCount / 4) * 100).toFixed(0)}% ({ratioStats.hetCount}/4)
                      </div>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <div className="font-mono font-bold text-slate-800">{ratioStats.recHomKey}</div>
                      <div className="text-[10px] text-slate-400">Homozygous Rec</div>
                      <div className="font-semibold text-amber-700 mt-0.5">
                        {((ratioStats.recHomCount / 4) * 100).toFixed(0)}% ({ratioStats.recHomCount}/4)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BIOCHEMISTRY LINK NOTE */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" /> Enzyme Link ({activeTrait.enzymeName})
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  {activeTrait.biochemistry.dominanceExplanation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TAB 2: TEST CROSS & BACKCROSS DIAGNOSTIC LAB                           */}
      {/* ====================================================================== */}
      {activeTab === 'testcross' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  KCSE Genetics Diagnostic Technique
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Mendel&apos;s Test Cross: Mystery Plant Genotyper
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  A plant displays the dominant phenotype ({activeTrait.domName}). Is it homozygous (TT)
                  or heterozygous (Tt)? Cross it with homozygous recessive (tt) to definitively reveal the answer!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNewMysteryPlant}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Shuffle className="w-3.5 h-3.5" /> New Mystery Plant
                </button>
                <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold">
                  Streak: {testCrossStreak} 🔥
                </div>
              </div>
            </div>

            {/* TEST CROSS SCENARIO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* MYSTERY PARENT (DOMINANT PHENOTYPE) */}
              <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-300 relative overflow-hidden flex flex-col items-center text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Unknown Parent Plant
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Phenotype: {activeTrait.domName}
                </h4>

                {/* Mystery Plant Graphic */}
                <div className="my-2 h-28 flex items-center justify-center">
                  <PeaPhenotypeVisual traitKey={traitKey} genotype="TT" className="w-36" />
                </div>

                {/* Genotype Reveal / Badge */}
                <div className="mt-1">
                  {mysteryRevealed ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-400 rounded-lg text-emerald-900 font-mono font-bold text-sm">
                      <Check className="w-4 h-4 text-emerald-600" /> True Genotype: {mysteryTrueGenotype}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 border border-amber-300 rounded-lg text-amber-900 font-mono font-bold text-sm animate-pulse">
                      Genotype: {activeTrait.domSymbol} ? (Hidden)
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 mt-1">
                  Possibilities: {activeTrait.domSymbol}{activeTrait.domSymbol} (Homozygous) OR {activeTrait.domSymbol}{activeTrait.recSymbol} (Heterozygous)
                </span>
              </div>

              {/* KNOWN TESTER PARENT (HOMOZYGOUS RECESSIVE) */}
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 flex flex-col items-center text-center">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Known Tester Parent
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Phenotype: {activeTrait.recName}
                </h4>

                {/* Recessive Plant Graphic */}
                <div className="my-2 h-28 flex items-center justify-center">
                  <PeaPhenotypeVisual traitKey={traitKey} genotype="tt" className="w-36" />
                </div>

                <div className="mt-1 inline-flex items-center px-3 py-1 bg-white border border-amber-300 rounded-lg text-amber-900 font-mono font-bold text-sm">
                  Genotype: {activeTrait.recSymbol}{activeTrait.recSymbol} (Homozygous Recessive)
                </div>
                <span className="text-[11px] text-slate-500 mt-1">
                  Can only donate recessive allele &apos;{activeTrait.recSymbol}&apos; in all gametes
                </span>
              </div>
            </div>

            {/* TEST CROSS EXECUTION CONTROLS */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-slate-600">Sample Harvest Size:</label>
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                  {[20, 50, 200].map((size) => (
                    <button
                      key={size}
                      onClick={() => setTestSampleSize(size)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                        testSampleSize === size
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {size} seeds
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRunTestCross}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Play className="w-4 h-4" /> Run Test Cross Harvest
              </button>
            </div>

            {/* HARVEST RESULTS BOARD */}
            {testCrossOffspring && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" /> Harvest Progeny Breakdown ({testCrossOffspring.total} plants)
                  </h4>
                  <span className="text-xs text-slate-500">
                    Ratio: {testCrossOffspring.domCount} {activeTrait.domName} : {testCrossOffspring.recCount} {activeTrait.recName}
                  </span>
                </div>

                {/* Progress Bar of Harvest */}
                <div className="h-6 w-full bg-slate-100 rounded-xl overflow-hidden flex shadow-inner border border-slate-200">
                  <div
                    style={{ width: `${testCrossOffspring.domPct}%` }}
                    className="bg-emerald-500 h-full flex items-center justify-center text-white text-[11px] font-bold"
                  >
                    {testCrossOffspring.domPct > 15 && `${activeTrait.domName} (${testCrossOffspring.domCount})`}
                  </div>
                  <div
                    style={{ width: `${testCrossOffspring.recPct}%` }}
                    className="bg-amber-500 h-full flex items-center justify-center text-white text-[11px] font-bold"
                  >
                    {testCrossOffspring.recPct > 15 && `${activeTrait.recName} (${testCrossOffspring.recCount})`}
                  </div>
                </div>

                {/* DIAGNOSTIC CLAIM BUTTONS */}
                {!mysteryRevealed ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
                    <p className="text-xs font-semibold text-slate-700">
                      Based on this test cross harvest, what is your scientific diagnosis of the mystery parent?
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => handleDiagnoseMystery('TT')}
                        className="px-5 py-2 rounded-xl bg-white border-2 border-emerald-500 hover:bg-emerald-50 text-emerald-800 font-mono font-bold text-sm shadow-sm transition-all"
                      >
                        Claim: {activeTrait.domSymbol}{activeTrait.domSymbol} (Homozygous Dominant)
                      </button>
                      <button
                        onClick={() => handleDiagnoseMystery('Tt')}
                        className="px-5 py-2 rounded-xl bg-white border-2 border-blue-500 hover:bg-blue-50 text-blue-800 font-mono font-bold text-sm shadow-sm transition-all"
                      >
                        Claim: {activeTrait.domSymbol}{activeTrait.recSymbol} (Heterozygous)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`p-4 rounded-xl border text-sm space-y-2 ${
                      testCrossVerdict === 'correct'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-base">
                      {testCrossVerdict === 'correct' ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Correct Diagnostic Deduction!
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-rose-600" /> Incorrect Diagnosis
                        </>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed">
                      {mysteryTrueGenotype === 'Tt' ? (
                        <>
                          Because <strong>{testCrossOffspring.recCount} recessive ({activeTrait.recName})</strong> offspring appeared,
                          the mystery parent <em>must</em> carry the recessive allele &apos;{activeTrait.recSymbol}&apos;.
                          An individual with the dominant phenotype carrying a recessive allele is definitively{' '}
                          <strong className="font-mono">{activeTrait.domSymbol}{activeTrait.recSymbol} (Heterozygous)</strong>.
                        </>
                      ) : (
                        <>
                          Because <strong>100% of the {testCrossOffspring.total} offspring</strong> were dominant ({activeTrait.domName}),
                          every single gamete from the mystery parent provided a dominant &apos;{activeTrait.domSymbol}&apos; allele.
                          This confirms the parent is pure-breeding{' '}
                          <strong className="font-mono">{activeTrait.domSymbol}{activeTrait.domSymbol} (Homozygous Dominant)</strong>.
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TAB 3: DIHYBRID CROSS (16-SQUARE GRID: MENDEL'S 2ND LAW)              */}
      {/* ====================================================================== */}
      {activeTab === 'dihybrid' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  Mendel&apos;s Second Law: Law of Independent Assortment
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Dihybrid Inheritance (Seed Shape & Seed Colour)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Alleles of two non-linked genes (R/r on Chr 7 and Y/y on Chr 1) segregate independently during Meiosis Metaphase I.
                </p>
              </div>

              {/* Dihybrid Presets */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setDihybridP1('RrYy');
                    setDihybridP2('RrYy');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  F1 Cross (RrYy × RrYy)
                </button>
                <button
                  onClick={() => {
                    setDihybridP1('RrYy');
                    setDihybridP2('rryy');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Test Cross (1:1:1:1)
                </button>
              </div>
            </div>

            {/* PARENTS GENOTYPE STRIP */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-around gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">Parent 1:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200">
                  {dihybridP1}
                </span>
                <span className="text-slate-500">
                  Gametes: <code className="text-emerald-700 font-bold">RY, Ry, rY, ry</code>
                </span>
              </div>
              <div className="text-slate-300 font-bold">✕</div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">Parent 2:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200">
                  {dihybridP2}
                </span>
                <span className="text-slate-500">
                  Gametes: <code className="text-indigo-700 font-bold">{dihybridG2.join(', ')}</code>
                </span>
              </div>
            </div>

            {/* 16-CELL PUNNETT GRID */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-2 border border-slate-200 bg-slate-200 font-semibold">♂ \ ♀</th>
                    {dihybridG2.map((g2, idx) => (
                      <th key={idx} className="p-2 border border-slate-200 font-mono text-indigo-700">
                        {g2}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2, 3].map((row) => (
                    <tr key={row}>
                      <th className="p-2 border border-slate-200 bg-slate-100 font-mono text-amber-700">
                        {dihybridG1[row]}
                      </th>
                      {[0, 1, 2, 3].map((col) => {
                        const cell = dihybridGrid[row * 4 + col];
                        return (
                          <td
                            key={col}
                            className={`p-2 border border-slate-200 text-center transition-all ${
                              cell.isRound && cell.isYellow
                                ? 'bg-yellow-50/70 text-yellow-950'
                                : cell.isRound && !cell.isYellow
                                ? 'bg-emerald-50/70 text-emerald-950'
                                : !cell.isRound && cell.isYellow
                                ? 'bg-amber-50/70 text-amber-950'
                                : 'bg-orange-50/70 text-orange-950'
                            }`}
                          >
                            <div className="font-mono font-bold text-xs">{cell.genotype}</div>
                            <div className="text-[10px] text-slate-600 mt-0.5">{cell.phenotype}</div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 9:3:3:1 RATIO SUMMARY TILES */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
                <div className="text-xl font-extrabold text-yellow-800">
                  {dihybridCounts.roundYellow} / 16
                </div>
                <div className="text-xs font-bold text-yellow-900 mt-0.5">Round Yellow</div>
                <div className="text-[10px] text-yellow-700 font-mono">R_Y_ ({(dihybridCounts.roundYellow / 16 * 100).toFixed(1)}%)</div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <div className="text-xl font-extrabold text-emerald-800">
                  {dihybridCounts.roundGreen} / 16
                </div>
                <div className="text-xs font-bold text-emerald-900 mt-0.5">Round Green</div>
                <div className="text-[10px] text-emerald-700 font-mono">R_yy ({(dihybridCounts.roundGreen / 16 * 100).toFixed(1)}%)</div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <div className="text-xl font-extrabold text-amber-800">
                  {dihybridCounts.wrinkledYellow} / 16
                </div>
                <div className="text-xs font-bold text-amber-900 mt-0.5">Wrinkled Yellow</div>
                <div className="text-[10px] text-amber-700 font-mono">rrY_ ({(dihybridCounts.wrinkledYellow / 16 * 100).toFixed(1)}%)</div>
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-center">
                <div className="text-xl font-extrabold text-orange-800">
                  {dihybridCounts.wrinkledGreen} / 16
                </div>
                <div className="text-xs font-bold text-orange-900 mt-0.5">Wrinkled Green</div>
                <div className="text-[10px] text-orange-700 font-mono">rryy ({(dihybridCounts.wrinkledGreen / 16 * 100).toFixed(1)}%)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TAB 4: BIOCHEMICAL GENE BASIS (MOLECULAR MECHANISMS)                   */}
      {/* ====================================================================== */}
      {activeTab === 'biochemistry' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Molecular Genetics of Mendel&apos;s Pea Traits
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                How DNA & Enzymes Create Morphological Phenotypes
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Gregor Mendel worked with abstract &apos;factors&apos;. Modern biochemistry reveals that each dominant
                allele encodes a functional enzyme, whereas recessive alleles encode deficient or truncated proteins.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(MENDELIAN_TRAITS).map((trait) => (
                <div
                  key={trait.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{trait.name}</span>
                      <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                        {trait.domSymbol} / {trait.recSymbol}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 font-mono">
                      Gene: {trait.geneSymbol} · {trait.chromosome}
                    </div>

                    <div className="mt-3 p-2.5 bg-white rounded-lg border border-slate-200 space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dominant Allele ({trait.domSymbol})
                        </span>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {trait.biochemistry.domMechanism}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <span className="font-bold text-amber-700 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Recessive Allele ({trait.recSymbol})
                        </span>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {trait.biochemistry.recMechanism}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 bg-slate-100 p-2 rounded border border-slate-200">
                    <strong>Enzyme:</strong> {trait.enzymeName}
                  </div>
                </div>
              ))}
            </div>

            {/* Misconception Buster Alert */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-1">
              <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" /> Common KCSE Misconception: Dominance vs Superiority
              </h4>
              <p className="text-blue-900/90 leading-relaxed">
                Dominance does <strong>not</strong> mean the allele is &apos;stronger&apos;, more common in the population,
                or evolutionarily superior. Dominance simply means that a single functional copy of the enzyme (haplosufficiency)
                produces enough catalytic activity to manifest the trait, masking the inactive recessive product.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TAB 5: KCSE EXAMINATION PRACTICE QUESTIONS                            */}
      {/* ====================================================================== */}
      {activeTab === 'kcse_quiz' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  KCSE Biology Revision Practice
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Mendelian Genetics Examination Challenges
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Test your understanding of monohybrid crosses, test cross diagnostics, and cytological mechanisms.
                </p>
              </div>

              {quizSubmitted && (
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 bg-emerald-100 text-emerald-900 font-bold rounded-xl text-sm border border-emerald-300">
                    Score: {quizScore} / {KCSE_MENDEL_QUESTIONS.length} (
                    {Math.round((quizScore / KCSE_MENDEL_QUESTIONS.length) * 100)}%)
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* QUESTION CARDS */}
            <div className="space-y-4">
              {KCSE_MENDEL_QUESTIONS.map((q, qIndex) => {
                const isSelected = quizAnswers[q.id] !== undefined;
                const userChoice = quizAnswers[q.id];
                const isCorrect = userChoice === q.correct;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      quizSubmitted
                        ? isCorrect
                          ? 'bg-emerald-50/50 border-emerald-300'
                          : 'bg-rose-50/50 border-rose-300'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {qIndex + 1}. {q.question}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                        {q.paperRef}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 mt-3">
                      {q.options.map((opt, optIdx) => {
                        const selectedThis = userChoice === optIdx;
                        let optionStyle = 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700';

                        if (quizSubmitted) {
                          if (optIdx === q.correct) {
                            optionStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-semibold';
                          } else if (selectedThis && !isCorrect) {
                            optionStyle = 'bg-rose-100 border-rose-400 text-rose-900 line-through';
                          } else {
                            optionStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                          }
                        } else if (selectedThis) {
                          optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold ring-2 ring-emerald-500/20';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuizAnswer(q.id, optIdx)}
                            disabled={quizSubmitted}
                            className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIdx === q.correct && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                            )}
                            {quizSubmitted && selectedThis && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback Explanation */}
                    {quizSubmitted && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed">
                        <strong>KCSE Syllabus Rationale:</strong> {q.rationale}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* SUBMIT BUTTON */}
            {!quizSubmitted && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length === 0}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                    Object.keys(quizAnswers).length === 0
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-200 active:scale-95'
                  }`}
                >
                  Submit Answers & View Rationales
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER METRIC NOTE */}
      <footer className="text-center text-xs text-slate-400 pt-2 pb-6 border-t border-slate-200">
        Virtual Learn KCSE Biology Interactive Modules · Form 4 Genetics Topic 1 (Simulation 2: Mendelian Inheritance Lab)
      </footer>
    </div>
  );
}

// ============================================================================
// 5. HELPER COMPONENT: PunnettGridCell
// ============================================================================

function PunnettGridCell({ cell, traitKey, animStage }) {
  const isFertilised = animStage === 'fertilised';
  const trait = MENDELIAN_TRAITS[traitKey];

  return (
    <div
      className={`p-3 rounded-2xl border-2 transition-all duration-500 flex flex-col items-center justify-center min-h-[110px] text-center relative overflow-hidden ${
        isFertilised
          ? cell.isDominant
            ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
            : 'bg-amber-50/80 border-amber-300 shadow-sm'
          : 'bg-slate-50 border-dashed border-slate-300'
      }`}
    >
      {isFertilised ? (
        <>
          {/* Miniature Phenotype Graphic */}
          <div className="mb-1">
            <MiniPhenotypeIcon traitKey={traitKey} isDominant={cell.isDominant} />
          </div>

          {/* Genotype Display (e.g. TT, Tt, tt) */}
          <div className="font-mono font-extrabold text-base text-slate-900 tracking-tight">
            {cell.genotype}
          </div>

          {/* Phenotype Name */}
          <div
            className={`text-xs font-bold mt-0.5 ${
              cell.isDominant ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {cell.phenotype}
          </div>

          {/* Zygosity Tag */}
          <div className="text-[10px] text-slate-400 mt-0.5">{cell.zygosity}</div>

          {/* Probability tag */}
          <span className="absolute top-1 right-1 text-[9px] font-bold text-slate-400 bg-white/80 px-1 rounded">
            25%
          </span>
        </>
      ) : (
        <div className="text-slate-400 text-xs font-medium flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-300 font-mono text-xs">
            ?
          </div>
          <span className="text-[10px]">Awaiting Fusion</span>
        </div>
      )}
    </div>
  );
}
