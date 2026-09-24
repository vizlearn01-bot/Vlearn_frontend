import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  ChevronRight,
  Crosshair,
  TrendingUp,
  Factory,
  Trees,
  Zap,
  Info,
  Timer,
  BarChart3,
  Dna,
  History,
  Target
} from 'lucide-react';

// ============================================================================
// ENVIRONMENT SPECIFICATIONS & BIOLOGICAL PARAMETERS
// ============================================================================
const ENVIRONMENTS = {
  pristine: {
    id: 'pristine',
    name: 'Pristine Lichen Forest',
    subTitle: 'Pre-Industrial / Clean Air post-1956',
    icon: Trees,
    accentColor: '#10b981',
    barkTheme: 'lichen',
    airQuality: 'Clean & Unpolluted (SO₂ < 10 µg/m³)',
    lichenCover: 'Abundant crustose & foliose lichens encrusting bark',
    sootLevel: 'Zero soot deposition',
    // Survival rates under Low and High predation pressure
    fitness: {
      low: { pale: 0.92, dark: 0.58 },
      high: { pale: 0.88, dark: 0.22 }
    },
    advantageText: 'Camouflage Advantage: Pale Moths (+70% survival on lichen-encrusted bark)',
    advantageColor: 'text-emerald-400',
    description:
      'Atmosphere is free of sulfur dioxide and coal smoke. Tree trunks are thickly blanketed with pale, speckled lichens. The pale speckled typica morph (cc) is exceptionally camouflaged against avian sight hunters, whereas dark melanic carbonaria (C-) moths stand out starkly.'
  },
  industrial: {
    id: 'industrial',
    name: 'Industrial Sooty Forest',
    subTitle: 'Peak Industrial Revolution (Coal Smog)',
    icon: Factory,
    accentColor: '#f59e0b',
    barkTheme: 'soot',
    airQuality: 'Severe Coal Smog (Heavy SO₂ & airborne soot)',
    lichenCover: 'Lichens eradicated by acid pollutants; bark soot-coated',
    sootLevel: 'Dense black carbon deposits',
    fitness: {
      low: { pale: 0.52, dark: 0.94 },
      high: { pale: 0.18, dark: 0.90 }
    },
    advantageText: 'Camouflage Advantage: Melanic Moths (+75% survival on soot-blackened bark)',
    advantageColor: 'text-amber-400',
    description:
      'Widespread burning of bituminous coal covers forests downwind of industrial cities in acidic soot. Delicate epiphytic lichens die off, and tree bark is stained deep carbon black. The dark melanic morph (carbonaria) blends seamlessly, while pale typica moths are easily spotted and captured by birds.'
  }
};

// ============================================================================
// KCSE FORM 4 BIOLOGY EXAM QUESTIONS (EVOLUTION & NATURAL SELECTION)
// ============================================================================
const KCSE_EXAM_QUESTIONS = [
  {
    id: 1,
    question:
      'In Biston betularia (Peppered Moth), what was the exact selective agent responsible for the rapid increase in the melanic carbonaria morph during the Industrial Revolution?',
    options: [
      'Chemical mutagenic action of airborne sulfur dioxide converting pale genes directly into dark genes',
      'Differential visual predation by insectivorous birds selecting against conspicuous pale moths on soot-covered trunks',
      'Physiological adaptation where individual living moths produced extra melanin to absorb toxic chimney fumes',
      'Deposition of soot grains coating the moth wings during larval feeding stages'
    ],
    correctIndex: 1,
    explanation:
      'The selective agent was differential visual predation by insectivorous birds (e.g., robins, thrushes). Soot blackened the tree bark and killed pale lichens. Pale moths lost their camouflage, making them easily spotted and eaten, while pre-existing dark mutants survived to reproduce at higher rates.'
  },
  {
    id: 2,
    question:
      'Melanism in the peppered moth is controlled by a dominant allele (C), whereas the typica pale speckled morph is homozygous recessive (cc). Why did the recessive pale allele (c) NOT become completely extinct even during peak industrial pollution?',
    options: [
      'Recessive alleles are completely immune to predatory bird digestion',
      'The recessive allele (c) remained sheltered from natural selection inside heterozygous melanic carriers (Cc)',
      'Pale moths migrated into industrial cities every spring to replace those consumed by predators',
      'Birds refuse to prey on any organism possessing a recessive genotype'
    ],
    correctIndex: 1,
    explanation:
      'Heterozygous moths (Cc) have a melanic phenotype and therefore enjoy the full camouflage advantage on soot-coated bark. Because selection acts on the phenotype, the recessive (c) allele is shielded from negative selection within heterozygous individuals.'
  },
  {
    id: 3,
    question:
      'Which fundamental Darwinian principle is demonstrated by the phenomenon of Industrial Melanism in peppered moths?',
    options: [
      'Acquired phenotypic changes developed within an organism’s lifetime are directly inherited by its progeny',
      'Individual organisms actively decide to evolve when environmental conditions deteriorate',
      'Pre-existing heritable variations that confer a survival advantage in a specific environment increase in frequency across generations',
      'Evolution always progresses toward organisms with greater biological complexity and darker pigmentation'
    ],
    correctIndex: 2,
    explanation:
      'Natural selection acts on pre-existing heritable variation. The melanic mutant allele existed at low frequency before pollution. When the environment changed, this trait offered superior camouflage, leading to differential survival and reproductive success (natural selection).'
  },
  {
    id: 4,
    question:
      'Following the Clean Air Acts of 1956 in the UK, coal smoke pollution drastically decreased and lichens returned to tree trunks. What evolutionary shift was recorded in peppered moth populations?',
    options: [
      'Melanic moths permanently mutated into a brand-new species that feeds only at night',
      'The typica pale morph frequency steadily rebounded from less than 10% back above 90% as directional selection reversed',
      'Both morphs became completely extinct due to sudden absence of sulfur dioxide',
      'Moths ceased mating and reproduced exclusively via asexual parthenogenesis'
    ],
    correctIndex: 1,
    explanation:
      'As air quality improved, lichens recolonized tree trunks. The pale bark background once again favored typica (cc) moths. Directional selection reversed, and the melanic morph dropped in frequency while the pale morph rebounded over successive generations.'
  },
  {
    id: 5,
    question:
      'A student claims: "A pale moth resting on a dirty tree trunk turned black over 3 days so that birds wouldn’t eat it." How would a KCSE Biology examiner evaluate this statement?',
    options: [
      'Correct, because physiological acclimation is the primary driver of Darwinian speciation',
      'Incorrect; individual organisms do not alter their heritable genotype or morph in response to need. Populations evolve across generations due to differential survival of pre-existing variants',
      'Correct, because exposure to carbon particles triggers immediate enzymatic upregulation of tyrosinase in adult wing scales',
      'Incorrect; birds do not hunt moths on tree trunks'
    ],
    correctIndex: 1,
    explanation:
      'This reflects a classic Lamarckian misconception. An individual moth cannot change its wing pattern during its lifetime. Evolution by natural selection is a population-level phenomenon occurring across generations via differential survival and reproduction.'
  }
];

// ============================================================================
// REALISTIC SVG MOTH COMPONENT (Biston betularia)
// ============================================================================
function MothSVG({
  type = 'pale', // 'pale' | 'dark'
  scale = 1,
  rotation = 0,
  isHovered = false,
  isTargeted = false,
  eaten = false,
  onClick,
  showLabel = false
}) {
  const isPale = type === 'pale';

  return (
    <div
      onClick={onClick}
      style={{
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease'
      }}
      className={`absolute select-none cursor-pointer group ${
        eaten ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100'
      }`}
      title={
        isPale
          ? 'Typica (Pale Speckled Morph) - Genotype: cc (Recessive)'
          : 'Carbonaria (Melanic Dark Morph) - Genotype: CC or Cc (Dominant)'
      }
    >
      <div className="relative">
        {/* Subtle moth drop shadow on bark */}
        <svg
          width="84"
          height="54"
          viewBox="0 0 84 54"
          className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.65)] transition-all duration-200 ${
            isHovered || isTargeted ? 'scale-105 filter drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]' : ''
          }`}
        >
          <defs>
            {/* Pale wing gradients and textures */}
            <linearGradient id={`paleGrad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5f0e6" />
              <stop offset="50%" stopColor="#e8e0ce" />
              <stop offset="100%" stopColor="#d9cfba" />
            </linearGradient>

            {/* Melanic dark wing gradient */}
            <linearGradient id={`darkGrad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2a2725" />
              <stop offset="40%" stopColor="#1c1917" />
              <stop offset="100%" stopColor="#0f0e0d" />
            </linearGradient>

            {/* Peppered speckling pattern for Typica */}
            <pattern id="pepperPattern" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="3" r="0.75" fill="#292524" opacity="0.8" />
              <circle cx="7" cy="8" r="0.9" fill="#1c1917" opacity="0.85" />
              <circle cx="10" cy="2" r="0.6" fill="#44403c" opacity="0.75" />
              <circle cx="4" cy="10" r="0.8" fill="#1c1917" opacity="0.8" />
              <path d="M 1,6 Q 3,7 5,6" stroke="#292524" strokeWidth="0.5" fill="none" opacity="0.7" />
              <path d="M 7,3 Q 9,2 11,4" stroke="#1c1917" strokeWidth="0.5" fill="none" opacity="0.7" />
            </pattern>
          </defs>

          {/* HINDWINGS (Underneath) */}
          <g>
            {/* Left Hindwing */}
            <path
              d="M 42 27 C 32 30 20 38 23 48 C 26 53 36 51 42 43 Z"
              fill={isPale ? `url(#paleGrad-${type})` : `url(#darkGrad-${type})`}
              stroke={isPale ? '#78716c' : '#0a0a0a'}
              strokeWidth="0.75"
            />
            {isPale && (
              <path
                d="M 42 27 C 32 30 20 38 23 48 C 26 53 36 51 42 43 Z"
                fill="url(#pepperPattern)"
                opacity="0.85"
              />
            )}

            {/* Right Hindwing */}
            <path
              d="M 42 27 C 52 30 64 38 61 48 C 58 53 48 51 42 43 Z"
              fill={isPale ? `url(#paleGrad-${type})` : `url(#darkGrad-${type})`}
              stroke={isPale ? '#78716c' : '#0a0a0a'}
              strokeWidth="0.75"
            />
            {isPale && (
              <path
                d="M 42 27 C 52 30 64 38 61 48 C 58 53 48 51 42 43 Z"
                fill="url(#pepperPattern)"
                opacity="0.85"
              />
            )}
          </g>

          {/* FOREWINGS (Spread flat in resting posture) */}
          <g>
            {/* Left Forewing */}
            <path
              d="M 42 23 C 34 16 12 11 4 20 C -1 26 8 38 26 37 C 34 36 40 31 42 26 Z"
              fill={isPale ? `url(#paleGrad-${type})` : `url(#darkGrad-${type})`}
              stroke={isPale ? '#57534e' : '#000000'}
              strokeWidth="0.85"
            />
            {isPale ? (
              <>
                <path
                  d="M 42 23 C 34 16 12 11 4 20 C -1 26 8 38 26 37 C 34 36 40 31 42 26 Z"
                  fill="url(#pepperPattern)"
                  opacity="0.9"
                />
                {/* Wavy antemedian and postmedian fasciae (dark wavy lines) */}
                <path
                  d="M 12 18 Q 18 24 24 35"
                  stroke="#1c1917"
                  strokeWidth="1.2"
                  strokeDasharray="2,1"
                  fill="none"
                  opacity="0.85"
                />
                <path
                  d="M 22 14 Q 28 22 34 32"
                  stroke="#292524"
                  strokeWidth="1"
                  strokeDasharray="1.5,1"
                  fill="none"
                  opacity="0.75"
                />
              </>
            ) : (
              <>
                {/* Faint subtle venation lines on dark moth */}
                <path
                  d="M 40 24 C 28 20 16 18 8 22"
                  stroke="#3a3734"
                  strokeWidth="0.6"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M 40 25 C 30 25 18 28 12 32"
                  stroke="#3a3734"
                  strokeWidth="0.6"
                  fill="none"
                  opacity="0.5"
                />
              </>
            )}

            {/* Right Forewing */}
            <path
              d="M 42 23 C 50 16 72 11 80 20 C 85 26 76 38 58 37 C 50 36 44 31 42 26 Z"
              fill={isPale ? `url(#paleGrad-${type})` : `url(#darkGrad-${type})`}
              stroke={isPale ? '#57534e' : '#000000'}
              strokeWidth="0.85"
            />
            {isPale ? (
              <>
                <path
                  d="M 42 23 C 50 16 72 11 80 20 C 85 26 76 38 58 37 C 50 36 44 31 42 26 Z"
                  fill="url(#pepperPattern)"
                  opacity="0.9"
                />
                {/* Wavy lines on right wing */}
                <path
                  d="M 72 18 Q 66 24 60 35"
                  stroke="#1c1917"
                  strokeWidth="1.2"
                  strokeDasharray="2,1"
                  fill="none"
                  opacity="0.85"
                />
                <path
                  d="M 62 14 Q 56 22 50 32"
                  stroke="#292524"
                  strokeWidth="1"
                  strokeDasharray="1.5,1"
                  fill="none"
                  opacity="0.75"
                />
              </>
            ) : (
              <>
                <path
                  d="M 44 24 C 56 20 68 18 76 22"
                  stroke="#3a3734"
                  strokeWidth="0.6"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M 44 25 C 54 25 66 28 72 32"
                  stroke="#3a3734"
                  strokeWidth="0.6"
                  fill="none"
                  opacity="0.5"
                />
              </>
            )}
          </g>

          {/* MOTH BODY (Thorax, Abdomen, Head) */}
          <g>
            {/* Abdomen */}
            <ellipse
              cx="42"
              cy="34"
              rx="3.2"
              ry="11"
              fill={isPale ? '#d6cdbd' : '#141211'}
              stroke={isPale ? '#78716c' : '#000000'}
              strokeWidth="0.75"
            />
            {/* Abdomen segments */}
            <line
              x1="39"
              y1="30"
              x2="45"
              y2="30"
              stroke={isPale ? '#57534e' : '#292524'}
              strokeWidth="0.5"
            />
            <line
              x1="39"
              y1="34"
              x2="45"
              y2="34"
              stroke={isPale ? '#57534e' : '#292524'}
              strokeWidth="0.5"
            />
            <line
              x1="40"
              y1="38"
              x2="44"
              y2="38"
              stroke={isPale ? '#57534e' : '#292524'}
              strokeWidth="0.5"
            />

            {/* Thorax (Furry, wider) */}
            <ellipse
              cx="42"
              cy="23"
              rx="4.2"
              ry="5.5"
              fill={isPale ? '#f5f0e6' : '#1c1917'}
              stroke={isPale ? '#44403c' : '#000000'}
              strokeWidth="0.75"
            />

            {/* Head */}
            <circle
              cx="42"
              cy="16"
              r="2.6"
              fill={isPale ? '#a8a29e' : '#110f0e'}
              stroke={isPale ? '#44403c' : '#000000'}
              strokeWidth="0.5"
            />
            {/* Compound Eyes */}
            <circle cx="40.2" cy="15.2" r="1.1" fill="#000000" />
            <circle cx="43.8" cy="15.2" r="1.1" fill="#000000" />

            {/* Feathered (Bipectinate) Antennae */}
            {/* Left Antenna */}
            <path
              d="M 40.5 15 Q 35 11 31 7"
              stroke={isPale ? '#44403c' : '#000000'}
              strokeWidth="0.9"
              fill="none"
            />
            <line x1="39" y1="14" x2="37" y2="12" stroke={isPale ? '#57534e' : '#171412'} strokeWidth="0.6" />
            <line x1="37" y1="12" x2="35" y2="10" stroke={isPale ? '#57534e' : '#171412'} strokeWidth="0.6" />
            <line x1="35" y1="10.5" x2="33" y2="8.5" stroke={isPale ? '#57534e' : '#171412'} strokeWidth="0.6" />
            <line x1="33" y1="9" x2="31" y2="7" stroke={isPale ? '#57534e' : '#171412'} strokeWidth="0.6" />

            {/* Right Antenna */}
            <path
              d="M 43.5 15 Q 49 11 53 7"
              stroke={isPale ? '#44403c' : '#000000'}
              strokeWidth="0.9"
              fill="none"
            />
            <line x1="45" y1="14" x2="47" y2="12" stroke={isPale ? '#57534e' : '#171412'} strokeWidth="0.6" />
            <line x1="47" y1="12" x2="49" y2="10" stroke={isPale ? '#57534e' : '#171412'} strokeWidth="0.6" />
            <line x1="49" y1="10.5" x2="51" y2="8.5" stroke={isPale ? '#57534e' : '#171412'} strokeWidth="0.6" />
            <line x1="51" y1="9" x2="53" y2="7" stroke={isPale ? '#57534e' : '#171412'} strokeWidth="0.6" />
          </g>
        </svg>

        {/* Small badge if showLabel is active */}
        {showLabel && (
          <div
            className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap shadow-md pointer-events-none ${
              isPale
                ? 'bg-slate-800/90 text-emerald-300 border border-emerald-500/40'
                : 'bg-black/90 text-amber-300 border border-amber-500/40'
            }`}
          >
            {isPale ? 'typica (cc)' : 'carbonaria (C-)'}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT: NaturalSelectionEvolutionSim
// ============================================================================
export default function NaturalSelectionEvolutionSim({ config = {}, onTelemetry }) {
  // Navigation tabs: 'simulation' | 'hunting_mode' | 'genetics' | 'kcse_mastery'
  const [activeTab, setActiveTab] = useState('simulation');

  // Simulation Controls & Environment
  const [environment, setEnvironment] = useState('pristine'); // 'pristine' | 'industrial'
  const [predationPressure, setPredationPressure] = useState('high'); // 'low' | 'high'
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x or 2x
  const [showGenotypeLabels, setShowGenotypeLabels] = useState(false);
  const [showPredatorSwoop, setShowPredatorSwoop] = useState(false);
  const [lastSwoopInfo, setLastSwoopInfo] = useState(null);

  // Population History (Hardy-Weinberg F0 baseline)
  // Initially in pristine forest: q = 0.9487, p = 0.0513 -> pale ≈ 90%, dark ≈ 10%
  const initialPop = useMemo(
    () => ({
      gen: 0,
      palePercent: 90,
      darkPercent: 10,
      freq_c: 0.9487, // recessive pale allele
      freq_C: 0.0513, // dominant melanic allele
      genotypes: {
        CC: 0.003, // p^2
        Cc: 0.097, // 2pq
        cc: 0.90   // q^2
      },
      env: 'pristine',
      predation: 'high'
    }),
    []
  );

  const [popHistory, setPopHistory] = useState([initialPop]);
  const currentPop = popHistory[popHistory.length - 1];

  // Resting Moths on Live Tree Canvas
  // 16 moths placed randomly on the tree trunk canvas
  const generateMothsForTrunk = useCallback((palePct) => {
    const totalMoths = 16;
    const paleCount = Math.round((totalMoths * palePct) / 100);
    const list = [];

    // Pre-distributed organic zones to avoid clumping
    for (let i = 0; i < totalMoths; i++) {
      const isPale = i < paleCount;
      const col = i % 4;
      const row = Math.floor(i / 4);
      const baseX = 15 + col * 23 + (Math.random() - 0.5) * 8;
      const baseY = 16 + row * 22 + (Math.random() - 0.5) * 8;

      list.push({
        id: `moth-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type: isPale ? 'pale' : 'dark',
        x: Math.max(10, Math.min(90, baseX)),
        y: Math.max(12, Math.min(88, baseY)),
        rotation: Math.floor((Math.random() - 0.5) * 55),
        scale: 0.88 + Math.random() * 0.22,
        eaten: false
      });
    }

    // Shuffle list so pale and dark are naturally interspersed
    return list.sort(() => Math.random() - 0.5);
  }, []);

  const [trunkMoths, setTrunkMoths] = useState(() => generateMothsForTrunk(initialPop.palePercent));

  // Sync displayed moths whenever population percentages update
  useEffect(() => {
    setTrunkMoths(generateMothsForTrunk(currentPop.palePercent));
  }, [currentPop.palePercent, generateMothsForTrunk]);

  // ============================================================================
  // HARDY-WEINBERG NATURAL SELECTION MATHEMATICAL STEPPER
  // ============================================================================
  const simulateNextGeneration = useCallback(() => {
    setPopHistory((prev) => {
      const last = prev[prev.length - 1];
      const nextGen = last.gen + 1;
      const envObj = ENVIRONMENTS[environment];
      const fitness = envObj.fitness[predationPressure];

      const p = last.freq_C; // dominant melanic allele frequency
      const q = last.freq_c; // recessive pale allele frequency

      const wM = fitness.dark; // fitness of melanic morph (C_)
      // Next generation allele frequencies after differential survival in diploid population
      // Complete dominance: Melanic (CC and Cc) = p^2 + 2pq; Pale (cc) = q^2
      const fMelanic = p * p + 2 * p * q;
      const fPale = q * q;
      const avgFitness = fMelanic * wM + fPale * wP;

      // Post-selection frequency of dominant allele C (carbonaria):
      // Surviving C alleles = 2*(p^2 * wM) + 2pq * wM = 2p * wM
      // Total surviving alleles = 2 * avgFitness
      // Therefore nextP = (p * wM) / avgFitness
      const nextP = Math.max(0.01, Math.min(0.99, (p * wM) / avgFitness));
      const nextQ = 1 - nextP;

      // Genotype frequencies under random mating
      const fCC = nextP * nextP;
      const fCc = 2 * nextP * nextQ;
      const fcc = nextQ * nextQ;

      const newPalePercent = Math.round(fcc * 100);
      const newDarkPercent = 100 - newPalePercent;

      const newRecord = {
        gen: nextGen,
        palePercent: newPalePercent,
        darkPercent: newDarkPercent,
        freq_C: parseFloat(nextP.toFixed(4)),
        freq_c: parseFloat(nextQ.toFixed(4)),
        genotypes: {
          CC: parseFloat(fCC.toFixed(3)),
          Cc: parseFloat(fCc.toFixed(3)),
          cc: parseFloat(fcc.toFixed(3))
        },
        env: environment,
        predation: predationPressure
      };

      // Trigger predator swoop visual feedback
      const eatenMorph = environment === 'pristine' ? 'dark' : 'pale';
      setLastSwoopInfo({
        morph: eatenMorph,
        reason:
          environment === 'pristine'
            ? 'Birds readily spot conspicuous dark carbonaria on pale lichen bark!'
            : 'Birds easily spot conspicuous pale typica against soot-blackened bark!'
      });
      setShowPredatorSwoop(true);
      setTimeout(() => setShowPredatorSwoop(false), 1400);

      // Telemetry trigger if milestone reached
      if (nextGen === 10 || nextGen % 5 === 0) {
        if (onTelemetry) {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            simulation: 'natural_selection_peppered_moth_simulation',
            generation: nextGen,
            environment,
            predationPressure,
            palePercent: newPalePercent,
            darkPercent: newDarkPercent,
            freq_C: nextP,
            freq_c: nextQ
          });
        }
      }

      return [...prev, newRecord];
    });
  }, [environment, predationPressure, onTelemetry]);

  // Auto-run loop
  useEffect(() => {
    let timer = null;
    if (isAutoRunning) {
      const intervalMs = playbackSpeed === 2 ? 650 : 1200;
      timer = setInterval(() => {
        setPopHistory((prev) => {
          if (prev.length > 10) {
            setIsAutoRunning(false);
            return prev;
          }
          return prev;
        });
        simulateNextGeneration();
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoRunning, playbackSpeed, simulateNextGeneration]);

  // Reset to Baseline
  const handleReset = () => {
    setIsAutoRunning(false);
    const baseline =
      environment === 'pristine'
        ? initialPop
        : {
            gen: 0,
            palePercent: 12,
            darkPercent: 88,
            freq_c: 0.3464,
            freq_C: 0.6536,
            genotypes: { CC: 0.427, Cc: 0.453, cc: 0.12 },
            env: 'industrial',
            predation: predationPressure
          };
    setPopHistory([baseline]);
    setTrunkMoths(generateMothsForTrunk(baseline.palePercent));
  };

  // Quick Environmental Preset Jumps
  const applyPreset = (presetKey) => {
    setIsAutoRunning(false);
    if (presetKey === 'pre_industrial') {
      setEnvironment('pristine');
      setPopHistory([
        {
          gen: 0,
          palePercent: 94,
          darkPercent: 6,
          freq_c: 0.9695,
          freq_C: 0.0305,
          genotypes: { CC: 0.001, Cc: 0.059, cc: 0.94 },
          env: 'pristine',
          predation: 'high'
        }
      ]);
    } else if (presetKey === 'industrial_peak') {
      setEnvironment('industrial');
      setPopHistory([
        {
          gen: 0,
          palePercent: 8,
          darkPercent: 92,
          freq_c: 0.2828,
          freq_C: 0.7172,
          genotypes: { CC: 0.514, Cc: 0.406, cc: 0.08 },
          env: 'industrial',
          predation: 'high'
        }
      ]);
    } else if (presetKey === 'clean_air_act') {
      setEnvironment('pristine');
      // Starts with high melanic legacy, then evolves towards pale
      setPopHistory([
        {
          gen: 0,
          palePercent: 15,
          darkPercent: 85,
          freq_c: 0.3873,
          freq_C: 0.6127,
          genotypes: { CC: 0.375, Cc: 0.475, cc: 0.15 },
          env: 'pristine',
          predation: 'high'
        }
      ]);
    }
  };

  // ============================================================================
  // STATION 2: INTERACTIVE PREDATOR HUNT LAB ("BE THE BIRD!")
  // ============================================================================
  const [huntActive, setHuntActive] = useState(false);
  const [huntTimeLeft, setHuntTimeLeft] = useState(10);
  const [huntScore, setHuntScore] = useState({ pale: 0, dark: 0 });
  const [huntMoths, setHuntMoths] = useState([]);
  const [huntFinished, setHuntFinished] = useState(false);
  const [huntEnv, setHuntEnv] = useState(environment);

  // Initialize hunt lab
  const startHuntLab = () => {
    const list = [];
    const total = 20;
    // Equal 50/50 starting split in hunt mode to test pure visual detection bias!
    for (let i = 0; i < total; i++) {
      const isPale = i < 10;
      list.push({
        id: `hunt-moth-${i}`,
        type: isPale ? 'pale' : 'dark',
        x: 10 + Math.random() * 80,
        y: 12 + Math.random() * 76,
        rotation: Math.floor((Math.random() - 0.5) * 60),
        scale: 0.95,
        eaten: false
      });
    }
    setHuntMoths(list.sort(() => Math.random() - 0.5));
    setHuntScore({ pale: 0, dark: 0 });
    setHuntTimeLeft(10);
    setHuntFinished(false);
    setHuntActive(true);
  };

  // Hunt timer countdown
  useEffect(() => {
    let t = null;
    if (huntActive && huntTimeLeft > 0) {
      t = setInterval(() => {
        setHuntTimeLeft((prev) => {
          if (prev <= 1) {
            setHuntActive(false);
            setHuntFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (t) clearInterval(t);
    };
  }, [huntActive, huntTimeLeft]);

  // Click handler when student "pecks" a moth
  const handleMothCatch = (mothId, mothType) => {
    if (!huntActive) return;
    setHuntMoths((prev) =>
      prev.map((m) => (m.id === mothId ? { ...m, eaten: true } : m))
    );
    setHuntScore((prev) => ({
      ...prev,
      [mothType]: prev[mothType] + 1
    }));
  };

  // ============================================================================
  // STATION 4: KCSE REVISION & MASTERY QUIZ
  // ============================================================================
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const handleSelectAnswer = (qId, optionIdx) => {
    if (submittedQuiz) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const quizScore = useMemo(() => {
    let score = 0;
    KCSE_EXAM_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) score++;
    });
    return score;
  }, [quizAnswers]);

  const activeEnvConfig = ENVIRONMENTS[environment];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-slate-950 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 font-sans">
      {/* ===================================================================== */}
      {/* HEADER & BIOLOGICAL BANNER                                           */}
      {/* ===================================================================== */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              Form 4 Biology • Topic 2: Evolution
            </span>
            <span>• Simulation 4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Natural Selection in Action
            <span className="text-slate-400 text-lg font-medium hidden sm:inline">
              (Peppered Moth / <span className="italic">Biston betularia</span>)
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Investigate how industrial pollution, differential bird predation, and heritable camouflage drive
            directional selection and population allele frequency shifts across generations.
          </p>
        </div>

        {/* Status Indicator Chip */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-right">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Current Generation
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              F{currentPop.gen}
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* NAVIGATION TABS                                                       */}
      {/* ===================================================================== */}
      <nav className="flex flex-wrap gap-2 my-5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('simulation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'simulation'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Trees className="w-4 h-4" />
          Ecosystem Simulation
        </button>

        <button
          onClick={() => setActiveTab('hunting_mode')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'hunting_mode'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Target className="w-4 h-4 text-amber-300" />
          Predator Hunt Lab (Be the Bird!)
        </button>

        <button
          onClick={() => setActiveTab('genetics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'genetics'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Hardy-Weinberg & Genetics
        </button>

        <button
          onClick={() => setActiveTab('kcse_mastery')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'kcse_mastery'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4" />
          KCSE Exam Mastery
        </button>
      </nav>

      {/* ===================================================================== */}
      {/* TAB 1: ECOSYSTEM SIMULATION                                           */}
      {/* ===================================================================== */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          {/* Qualitative Camouflage Advantage Indicator Banner */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-slate-800 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <div className="text-xs uppercase font-semibold tracking-wider text-slate-400">
                  Natural Selection Directional Force
                </div>
                <div className={`text-sm sm:text-base font-bold ${activeEnvConfig.advantageColor}`}>
                  {activeEnvConfig.advantageText}
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {environment === 'pristine' ? 'Typica (cc) Cryptic' : 'Carbonaria (C-) Cryptic'}
            </div>
          </div>

          {/* MAIN SIMULATION STAGE (Tree Trunk Canvas + Interactive Controls) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* TREE TRUNK STAGE (7 Columns on large screens) */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 group">
                {/* DYNAMIC SVG TREE TRUNK BACKGROUND (Morphing between Lichen and Sooty Bark) */}
                <svg
                  className="w-full h-full object-cover select-none"
                  viewBox="0 0 600 450"
                  preserveAspectRatio="none"
                >
                  <defs>
                    {/* Pristine Lichen Tree Bark Gradient */}
                    <linearGradient id="lichenTrunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#78716c" />
                      <stop offset="15%" stopColor="#a8a29e" />
                      <stop offset="50%" stopColor="#d6d3d1" />
                      <stop offset="85%" stopColor="#a8a29e" />
                      <stop offset="100%" stopColor="#57534e" />
                    </linearGradient>

                    {/* Industrial Soot Tree Bark Gradient */}
                    <linearGradient id="sootTrunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1c1917" />
                      <stop offset="20%" stopColor="#292524" />
                      <stop offset="50%" stopColor="#1f1d1b" />
                      <stop offset="80%" stopColor="#292524" />
                      <stop offset="100%" stopColor="#0c0a09" />
                    </linearGradient>

                    {/* Lichen Rosette Foliose Pattern */}
                    <radialGradient id="lichenSpotGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#d9ecc5" stopOpacity="0.95" />
                      <stop offset="65%" stopColor="#b7d99c" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#8ea873" stopOpacity="0.1" />
                    </radialGradient>

                    {/* Soot Smog Grime Gradient */}
                    <radialGradient id="sootGrimeGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#0a0908" stopOpacity="0.95" />
                      <stop offset="70%" stopColor="#1c1917" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#292524" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Base Bark Fill */}
                  <rect
                    width="600"
                    height="450"
                    fill={environment === 'pristine' ? 'url(#lichenTrunkGrad)' : 'url(#sootTrunkGrad)'}
                    className="transition-all duration-700 ease-in-out"
                  />

                  {/* Vertical Bark Furrows & Ridges */}
                  <g
                    stroke={environment === 'pristine' ? 'rgba(68, 64, 60, 0.45)' : 'rgba(0, 0, 0, 0.65)'}
                    strokeWidth="2.5"
                    className="transition-colors duration-700"
                  >
                    <path d="M 40 0 Q 55 225 35 450" fill="none" />
                    <path d="M 85 0 Q 75 220 95 450" fill="none" strokeWidth="3" />
                    <path d="M 140 0 Q 155 180 135 450" fill="none" />
                    <path d="M 210 0 Q 195 240 220 450" fill="none" strokeWidth="4" />
                    <path d="M 280 0 Q 300 200 275 450" fill="none" strokeWidth="3.5" />
                    <path d="M 350 0 Q 335 250 360 450" fill="none" strokeWidth="4" />
                    <path d="M 420 0 Q 445 190 415 450" fill="none" strokeWidth="3" />
                    <path d="M 490 0 Q 475 260 500 450" fill="none" strokeWidth="4.5" />
                    <path d="M 550 0 Q 570 210 545 450" fill="none" strokeWidth="2.5" />
                  </g>

                  {/* LICHEN COLONIES (Flourish in clean pristine forest; wither/fade out in soot) */}
                  <g
                    opacity={environment === 'pristine' ? 0.95 : 0.08}
                    className="transition-opacity duration-700 ease-in-out"
                  >
                    {/* Organic Lichen Rosettes */}
                    <path
                      d="M 120 70 Q 160 50 180 80 Q 210 110 170 140 Q 130 155 105 125 Q 85 95 120 70 Z"
                      fill="url(#lichenSpotGrad)"
                    />
                    <path
                      d="M 320 180 Q 370 150 400 190 Q 425 240 370 260 Q 320 275 295 235 Q 285 195 320 180 Z"
                      fill="url(#lichenSpotGrad)"
                    />
                    <path
                      d="M 220 320 Q 265 290 295 330 Q 310 380 260 410 Q 210 415 190 375 Q 185 335 220 320 Z"
                      fill="url(#lichenSpotGrad)"
                    />
                    <path
                      d="M 460 75 Q 500 60 520 95 Q 545 130 500 155 Q 455 160 440 125 Q 430 90 460 75 Z"
                      fill="url(#lichenSpotGrad)"
                    />
                    <path
                      d="M 50 250 Q 80 230 105 260 Q 120 295 90 320 Q 60 330 40 300 Q 30 270 50 250 Z"
                      fill="url(#lichenSpotGrad)"
                    />
                    <path
                      d="M 440 310 Q 485 285 510 325 Q 535 375 480 395 Q 440 405 415 365 Q 410 330 440 310 Z"
                      fill="url(#lichenSpotGrad)"
                    />

                    {/* Crustose Flecks */}
                    <circle cx="150" cy="110" r="18" fill="#d2e7be" opacity="0.8" />
                    <circle cx="350" cy="220" r="22" fill="#c3e0a8" opacity="0.8" />
                    <circle cx="250" cy="360" r="20" fill="#d8ecc6" opacity="0.85" />
                    <circle cx="480" cy="115" r="16" fill="#badba0" opacity="0.75" />
                  </g>

                  {/* INDUSTRIAL SOOT DEPOSITS & COAL SMOG LAYER (Intense in Industrial mode) */}
                  <g
                    opacity={environment === 'industrial' ? 0.95 : 0.05}
                    className="transition-opacity duration-700 ease-in-out"
                  >
                    <rect width="600" height="450" fill="url(#sootGrimeGrad)" opacity="0.85" />
                    <path
                      d="M 80 50 Q 150 20 220 60 Q 280 110 230 170 Q 160 190 100 150 Q 50 110 80 50 Z"
                      fill="#0e0d0c"
                      opacity="0.75"
                    />
                    <path
                      d="M 330 160 Q 410 130 460 180 Q 500 240 430 280 Q 360 300 310 250 Q 280 200 330 160 Z"
                      fill="#0d0c0a"
                      opacity="0.8"
                    />
                    <path
                      d="M 180 280 Q 270 250 320 310 Q 350 370 280 410 Q 200 425 150 370 Q 130 320 180 280 Z"
                      fill="#12100e"
                      opacity="0.75"
                    />
                  </g>
                </svg>

                {/* RESTING MOTHS OVERLAY */}
                <div className="absolute inset-0 pointer-events-none">
                  {trunkMoths.map((moth) => (
                    <div
                      key={moth.id}
                      style={{ left: `${moth.x}%`, top: `${moth.y}%` }}
                      className="absolute pointer-events-auto"
                    >
                      <MothSVG
                        type={moth.type}
                        scale={moth.scale}
                        rotation={moth.rotation}
                        eaten={moth.eaten}
                        showLabel={showGenotypeLabels}
                      />
                    </div>
                  ))}
                </div>

                {/* PREDATOR SWOOP AVIAN STRIKE ANIMATION OVERLAY */}
                {showPredatorSwoop && lastSwoopInfo && (
                  <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none animate-fadeIn transition-all">
                    <div className="bg-slate-900/95 border-2 border-amber-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-sm animate-bounce">
                      <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                        <Crosshair className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs uppercase font-bold tracking-wider text-amber-400">
                          Avian Predator Strike!
                        </div>
                        <div className="text-sm font-semibold text-slate-100">
                          {lastSwoopInfo.reason}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Bark Caption Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs text-slate-300">
                    <span className="font-semibold text-white">Habitat: </span>
                    {activeEnvConfig.name} ({activeEnvConfig.airQuality})
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs text-slate-300">
                    <span className="font-semibold text-white">Moths resting: </span>16 specimens
                  </div>
                </div>
              </div>

              {/* Trunk Display Option Toggles */}
              <div className="flex items-center justify-between mt-3 px-1 text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={showGenotypeLabels}
                    onChange={(e) => setShowGenotypeLabels(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                  />
                  <span>Show genotype badges on moths</span>
                </label>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-slate-200 border border-slate-400 inline-block"></span>
                    Typica (cc)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-stone-900 border border-stone-600 inline-block"></span>
                    Carbonaria (C-)
                  </span>
                </div>
              </div>
            </div>

            {/* CONTROLS & DIAGNOSTICS SIDEBAR (5 Columns on large screens) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* CONTROL 1: ENVIRONMENT SELECTOR */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Control 1: Environment</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Air & Bark State</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setEnvironment('pristine');
                      setIsAutoRunning(false);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      environment === 'pristine'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold shadow-md shadow-emerald-950/50'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Trees className="w-5 h-5 mb-1.5 text-emerald-400" />
                    <span className="text-xs font-bold leading-tight">Pristine Lichen</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Clean Air</span>
                  </button>

                  <button
                    onClick={() => {
                      setEnvironment('industrial');
                      setIsAutoRunning(false);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      environment === 'industrial'
                        ? 'bg-amber-950/40 border-amber-500 text-amber-300 font-semibold shadow-md shadow-amber-950/50'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Factory className="w-5 h-5 mb-1.5 text-amber-400" />
                    <span className="text-xs font-bold leading-tight">Industrial Sooty</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Coal Smog</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  {activeEnvConfig.description}
                </p>
              </div>

              {/* CONTROL 2: BIRD PREDATION PRESSURE */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Control 2: Predation Pressure</span>
                  <span className="text-[10px] text-sky-400 font-mono">Avian Foraging Intensity</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPredationPressure('low')}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                      predationPressure === 'low'
                        ? 'bg-sky-950/40 border-sky-500 text-sky-300 font-bold shadow-sm'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Low Predation
                    <span className="block text-[10px] text-slate-400 font-normal">Moderate selection</span>
                  </button>

                  <button
                    onClick={() => setPredationPressure('high')}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                      predationPressure === 'high'
                        ? 'bg-rose-950/40 border-rose-500 text-rose-300 font-bold shadow-sm'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    High Predation
                    <span className="block text-[10px] text-slate-400 font-normal">Intense selection</span>
                  </button>
                </div>
              </div>

              {/* CONTROL 3: GENERATION ADVANCE & AUTO-RUN */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Control 3: Generational Stepper</span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    F{currentPop.gen} → F{currentPop.gen + 1}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={simulateNextGeneration}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-emerald-900/40 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                    Simulate 1 Generation
                  </button>

                  <button
                    onClick={() => setIsAutoRunning(!isAutoRunning)}
                    className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isAutoRunning
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-900/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {isAutoRunning ? (
                      <>
                        <Pause className="w-4 h-4" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-emerald-400" /> Auto-Run
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    title="Reset to Generation 0 Baseline"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Speed toggle for auto-run */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span>Playback Rate:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPlaybackSpeed(1)}
                      className={`px-2 py-0.5 rounded ${
                        playbackSpeed === 1
                          ? 'bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      1x
                    </button>
                    <button
                      onClick={() => setPlaybackSpeed(2)}
                      className={`px-2 py-0.5 rounded ${
                        playbackSpeed === 2
                          ? 'bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      2x Fast
                    </button>
                  </div>
                </div>

                {/* Core Misconception Guard Note */}
                <div className="text-[10px] text-slate-300 bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex items-start gap-1.5 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1" />
                  <span>
                    <strong className="text-emerald-400">KCSE Misconception Guard:</strong> Populations evolve across generations via differential bird predation. Living moths <span className="underline decoration-emerald-400/60">never</span> adapt or alter their wing pigmentation during their lifespan!
                  </span>
                </div>
              </div>

              {/* LIVE POPULATION & ALLELE FREQUENCY SUMMARY */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <span>Population Frequencies (F{currentPop.gen})</span>
                  <span className="text-[10px] text-slate-400 font-mono">Hardy-Weinberg</span>
                </div>

                {/* Phenotype Proportions Bar */}
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-emerald-300 font-mono">
                      Pale (typica cc): {currentPop.palePercent}%
                    </span>
                    <span className="text-amber-300 font-mono">
                      Melanic (carbonaria C-): {currentPop.darkPercent}%
                    </span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                    <div
                      style={{ width: `${currentPop.palePercent}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    ></div>
                    <div
                      style={{ width: `${currentPop.darkPercent}%` }}
                      className="h-full bg-gradient-to-r from-stone-800 to-stone-950 transition-all duration-500"
                    ></div>
                  </div>
                </div>

                {/* Allele Frequencies (p and q) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 bg-slate-950/70 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Pale Allele (c)</div>
                    <div className="text-base font-bold font-mono text-emerald-400">
                      q = {currentPop.freq_c.toFixed(3)}
                    </div>
                    <div className="text-[10px] text-slate-400">Recessive (typica)</div>
                  </div>

                  <div className="p-2 bg-slate-950/70 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Melanic Allele (C)</div>
                    <div className="text-base font-bold font-mono text-amber-400">
                      p = {currentPop.freq_C.toFixed(3)}
                    </div>
                    <div className="text-[10px] text-slate-400">Dominant (carbonaria)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HISTORICAL PRESETS & KEY CONCEPT CALLOUT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => applyPreset('pre_industrial')}
              className="p-3.5 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
                <span>Preset 1: Pre-Industrial (1840)</span>
                <Trees className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-xs text-slate-400">
                Pristine lichen forest baseline. Pale typica moths dominate (94%), rare melanic mutants (6%).
              </p>
            </button>

            <button
              onClick={() => applyPreset('industrial_peak')}
              className="p-3.5 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                <span>Preset 2: Peak Industry (1895)</span>
                <Factory className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-xs text-slate-400">
                Heavy coal smoke deposits. Directional selection drives melanic carbonaria up to 92%.
              </p>
            </button>

            <button
              onClick={() => applyPreset('clean_air_act')}
              className="p-3.5 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/50 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-sky-400 mb-1">
                <span>Preset 3: Clean Air Act (1956)</span>
                <History className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-xs text-slate-400">
                Pollution clears and lichens regrow. Reversal of natural selection restores typica dominance.
              </p>
            </button>
          </div>

          {/* CRITICAL KCSE CONCEPT HIGHLIGHT BOX */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-emerald-400">Core Biological Concept: </strong>
              Individual moths <span className="underline decoration-emerald-500">do not adapt or change colour</span> during
              their lifetime. The population changes across generations because individuals with advantageous camouflage
              survive predation to leave more offspring, altering allele frequencies in the gene pool.
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: PREDATOR HUNT LAB ("BE THE BIRD!")                            */}
      {/* ===================================================================== */}
      {activeTab === 'hunting_mode' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-amber-400 mb-1">
                <Target className="w-4 h-4" />
                Avian Foraging Experiment
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Be the Insectivorous Bird Predator!
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Experience how camouflage contrast influences visual predation. You have 10 seconds to spot and tap as
                many moths as possible on the tree trunk.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Forest toggle for hunt */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    if (!huntActive) setHuntEnv('pristine');
                  }}
                  disabled={huntActive}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    huntEnv === 'pristine'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Lichen Bark
                </button>
                <button
                  onClick={() => {
                    if (!huntActive) setHuntEnv('industrial');
                  }}
                  disabled={huntActive}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    huntEnv === 'industrial'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sooty Bark
                </button>
              </div>

              {!huntActive && (
                <button
                  onClick={startHuntLab}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-950/40 transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {huntFinished ? 'Hunt Again' : 'Start 10s Hunt'}
                </button>
              )}
            </div>
          </div>

          {/* HUNTING CANVAS & GAMEPLAY */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/80 select-none cursor-crosshair">
            {/* Tree Trunk Background */}
            <svg
              className="w-full h-full object-cover pointer-events-none"
              viewBox="0 0 600 350"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="huntLichenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#78716c" />
                  <stop offset="25%" stopColor="#a8a29e" />
                  <stop offset="50%" stopColor="#d6d3d1" />
                  <stop offset="75%" stopColor="#a8a29e" />
                  <stop offset="100%" stopColor="#57534e" />
                </linearGradient>

                <linearGradient id="huntSootGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1c1917" />
                  <stop offset="30%" stopColor="#292524" />
                  <stop offset="60%" stopColor="#1f1d1b" />
                  <stop offset="100%" stopColor="#0a0908" />
                </linearGradient>
              </defs>

              <rect
                width="600"
                height="350"
                fill={huntEnv === 'pristine' ? 'url(#huntLichenGrad)' : 'url(#huntSootGrad)'}
              />

              {/* Texture Lines */}
              <g stroke={huntEnv === 'pristine' ? 'rgba(68, 64, 60, 0.4)' : 'rgba(0, 0, 0, 0.65)'} strokeWidth="2.5">
                <path d="M 60 0 Q 75 175 55 350" fill="none" />
                <path d="M 160 0 Q 145 190 170 350" fill="none" strokeWidth="3" />
                <path d="M 280 0 Q 305 160 275 350" fill="none" strokeWidth="4" />
                <path d="M 400 0 Q 380 200 410 350" fill="none" strokeWidth="3.5" />
                <path d="M 520 0 Q 540 180 510 350" fill="none" strokeWidth="3" />
              </g>

              {/* Lichen patches if pristine */}
              {huntEnv === 'pristine' && (
                <g fill="#cbe3b3" opacity="0.85">
                  <circle cx="120" cy="80" r="38" />
                  <circle cx="320" cy="180" r="45" />
                  <circle cx="480" cy="100" r="32" />
                  <circle cx="220" cy="280" r="42" />
                  <circle cx="450" cy="270" r="35" />
                </g>
              )}
            </svg>

            {/* Live Moths on Screen */}
            {huntActive && (
              <div className="absolute inset-0">
                {huntMoths.map((moth) => (
                  <div
                    key={moth.id}
                    style={{ left: `${moth.x}%`, top: `${moth.y}%` }}
                    className="absolute"
                  >
                    <MothSVG
                      type={moth.type}
                      scale={moth.scale}
                      rotation={moth.rotation}
                      eaten={moth.eaten}
                      onClick={() => handleMothCatch(moth.id, moth.type)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* PRE-START OR FINISHED OVERLAY */}
            {!huntActive && !huntFinished && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-300 mb-3 border border-amber-500/40">
                  <Crosshair className="w-10 h-10 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ready to Hunt?</h3>
                <p className="text-sm text-slate-300 max-w-md mb-5 leading-relaxed">
                  Click/tap on moths resting on the tree trunk. The timer runs for 10 seconds. Observe which morph you
                  spot first!
                </p>
                <button
                  onClick={startHuntLab}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-base shadow-xl shadow-amber-950/50 active:scale-95 transition-all"
                >
                  Start 10s Predator Test
                </button>
              </div>
            )}

            {/* GAME TIMER & HUD */}
            {huntActive && (
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2.5">
                  <Timer className="w-5 h-5 text-amber-400 animate-spin" />
                  <span className="text-xs text-slate-400 font-semibold uppercase">Time Remaining:</span>
                  <span className="text-lg font-mono font-bold text-amber-400">{huntTimeLeft}s</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-500/40 text-xs font-mono text-emerald-300">
                    Pale typica caught: <strong className="text-white text-sm">{huntScore.pale}</strong>
                  </div>
                  <div className="bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-500/40 text-xs font-mono text-amber-300">
                    Dark carbonaria caught: <strong className="text-white text-sm">{huntScore.dark}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* RESULTS MODAL (Triggered after 10s hunt) */}
            {huntFinished && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl space-y-4">
                  <div className="inline-flex p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Award className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-bold text-white">Foraging Results Analysis</h3>

                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-xs text-slate-400 uppercase font-semibold">Pale typica</div>
                      <div className="text-2xl font-bold font-mono text-emerald-400">{huntScore.pale}</div>
                      <div className="text-[10px] text-slate-400">Captured / 10 available</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-xs text-slate-400 uppercase font-semibold">Dark carbonaria</div>
                      <div className="text-2xl font-bold font-mono text-amber-400">{huntScore.dark}</div>
                      <div className="text-[10px] text-slate-400">Captured / 10 available</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-left leading-relaxed">
                    <strong className="text-amber-400">Scientific Finding: </strong>
                    {huntEnv === 'pristine' ? (
                      huntScore.dark >= huntScore.pale ? (
                        <span>
                          You captured more dark carbonaria moths ({huntScore.dark} vs {huntScore.pale}) because their dark
                          pigment created sharp contrast against the pale lichen bark, exactly as insectivorous birds do!
                        </span>
                      ) : (
                        <span>
                          In pristine lichen forests, pale moths blend into lichens, while conspicuous dark moths suffer
                          significantly higher avian predation in nature.
                        </span>
                      )
                    ) : huntScore.pale >= huntScore.dark ? (
                      <span>
                        You captured more pale typica moths ({huntScore.pale} vs {huntScore.dark}) because white wings
                        starkly contrasted against soot-stained bark. This differential predation drove the historical rise
                        of Industrial Melanism!
                      </span>
                    ) : (
                      <span>
                        On soot-covered bark, dark moths blend in cryptically. Birds spot contrasting pale moths far more
                        readily, creating powerful directional selection!
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={startHuntLab}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all"
                    >
                      Retry Hunt
                    </button>
                    <button
                      onClick={() => {
                        setHuntFinished(false);
                        setActiveTab('simulation');
                      }}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-xl text-sm transition-all border border-slate-700"
                    >
                      Return to Sim
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: HARDY-WEINBERG & POPULATION GENETICS                           */}
      {/* ===================================================================== */}
      {activeTab === 'genetics' && (
        <div className="space-y-6">
          {/* POPULATION LINE GRAPH ACROSS GENERATIONS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Population & Allele Frequency Trajectory (F0 to F{currentPop.gen})
                </h3>
                <p className="text-xs text-slate-400">
                  Tracking phenotypic percentages (% Pale vs % Melanic) and allele frequencies across generations.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span>
                  Pale Morph (% typica)
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-3 h-0.5 bg-amber-400 inline-block"></span>
                  Melanic Morph (% carbonaria)
                </span>
              </div>
            </div>

            {/* SVG Generational Coordinate Graph */}
            <div className="w-full h-64 bg-slate-950 rounded-xl p-3 border border-slate-800 relative">
              <svg className="w-full h-full" viewBox="0 0 520 200" preserveAspectRatio="none">
                {/* Horizontal Grid lines (0%, 25%, 50%, 75%, 100%) */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = 180 - (val / 100) * 160;
                  return (
                    <g key={val}>
                      <line x1="40" y1={y} x2="500" y2={y} stroke="rgba(51, 65, 85, 0.4)" strokeWidth="1" />
                      <text x="32" y={y + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis labels for generations */}
                {popHistory.map((rec, idx) => {
                  const x = 40 + (idx / Math.max(1, popHistory.length - 1)) * 460;
                  return (
                    <g key={rec.gen}>
                      <line x1={x} y1="180" x2={x} y2="185" stroke="#64748b" strokeWidth="1" />
                      <text x={x} y="196" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                        F{rec.gen}
                      </text>
                    </g>
                  );
                })}

                {/* Pale Percentage Line (Emerald) */}
                {popHistory.length > 1 && (
                  <path
                    d={popHistory
                      .map((rec, idx) => {
                        const x = 40 + (idx / (popHistory.length - 1)) * 460;
                        const y = 180 - (rec.palePercent / 100) * 160;
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                )}

                {/* Melanic Percentage Line (Amber) */}
                {popHistory.length > 1 && (
                  <path
                    d={popHistory
                      .map((rec, idx) => {
                        const x = 40 + (idx / (popHistory.length - 1)) * 460;
                        const y = 180 - (rec.darkPercent / 100) * 160;
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                )}

                {/* Data Points */}
                {popHistory.map((rec, idx) => {
                  const x = 40 + (idx / Math.max(1, popHistory.length - 1)) * 460;
                  const yPale = 180 - (rec.palePercent / 100) * 160;
                  const yDark = 180 - (rec.darkPercent / 100) * 160;
                  return (
                    <g key={`dots-${rec.gen}`}>
                      <circle cx={x} cy={yPale} r="4" fill="#10b981" stroke="#064e3b" strokeWidth="1.5" />
                      <circle cx={x} cy={yDark} r="4" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* HARDY-WEINBERG MATHEMATICAL EQUILIBRIUM BREAKDOWN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Allele & Genotype Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                <Dna className="w-4 h-4" />
                Hardy-Weinberg Formula: p² + 2pq + q² = 1
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">p² (Homozygous Dominant CC - Melanic):</span>
                  <span className="text-amber-400 font-bold">
                    {(currentPop.genotypes.CC * 100).toFixed(1)}% ({currentPop.genotypes.CC})
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">2pq (Heterozygous Cc - Melanic):</span>
                  <span className="text-amber-300 font-bold">
                    {(currentPop.genotypes.Cc * 100).toFixed(1)}% ({currentPop.genotypes.Cc})
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">q² (Homozygous Recessive cc - Pale typica):</span>
                  <span className="text-emerald-400 font-bold">
                    {(currentPop.genotypes.cc * 100).toFixed(1)}% ({currentPop.genotypes.cc})
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Notice that even when pale moths (cc) are strongly selected against, the recessive allele <em>c</em> is
                never totally eradicated because it remains protected from avian predation inside heterozygous (<em>Cc</em>)
                carriers!
              </p>
            </div>

            {/* Differential Selection & Fitness Coefficients */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
                <Zap className="w-4 h-4" />
                Selection Pressure Coefficients
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Relative Fitness of Pale Morph (w_typica):</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {ENVIRONMENTS[environment].fitness[predationPressure].pale}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Relative Fitness of Melanic Morph (w_melanic):</span>
                  <span className="font-mono font-bold text-amber-400">
                    {ENVIRONMENTS[environment].fitness[predationPressure].dark}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Selection Coefficient (s = 1 - w_rel):</span>
                  <span className="font-mono font-bold text-rose-400">
                    s = {(1 - (Math.min(
                      ENVIRONMENTS[environment].fitness[predationPressure].pale,
                      ENVIRONMENTS[environment].fitness[predationPressure].dark
                    ) / Math.max(
                      ENVIRONMENTS[environment].fitness[predationPressure].pale,
                      ENVIRONMENTS[environment].fitness[predationPressure].dark
                    ))).toFixed(2)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                The selection coefficient <em>s</em> measures the relative fitness disadvantage of the conspicuous morph (<em>s = 1 - w_disfavoured / w_favoured</em>). High
                predation pressure elevates <em>s</em>, accelerating directional shifts in population allele frequencies (<em>p</em> and <em>q</em>).
              </p>
            </div>
          </div>

          {/* GENERATION DATA LOG TABLE */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm overflow-x-auto">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Complete Generational Registry</span>
              <span className="text-emerald-400 font-mono text-[10px]">{popHistory.length} Recorded Generations</span>
            </div>

            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">Gen</th>
                  <th className="pb-2">Env</th>
                  <th className="pb-2">% Pale (typica)</th>
                  <th className="pb-2">% Melanic (carbonaria)</th>
                  <th className="pb-2">Freq c (q)</th>
                  <th className="pb-2">Freq C (p)</th>
                  <th className="pb-2">Genotypes (CC : Cc : cc)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {popHistory.map((r) => (
                  <tr key={r.gen} className="hover:bg-slate-850/50">
                    <td className="py-2 font-bold text-white">F{r.gen}</td>
                    <td className="py-2 capitalize">{r.env}</td>
                    <td className="py-2 text-emerald-400">{r.palePercent}%</td>
                    <td className="py-2 text-amber-400">{r.darkPercent}%</td>
                    <td className="py-2">{r.freq_c.toFixed(3)}</td>
                    <td className="py-2">{r.freq_C.toFixed(3)}</td>
                    <td className="py-2 text-slate-400">
                      {r.genotypes.CC} : {r.genotypes.Cc} : {r.genotypes.cc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: KCSE EXAM MASTERY                                              */}
      {/* ===================================================================== */}
      {activeTab === 'kcse_mastery' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-emerald-400 mb-1">
                <Award className="w-4 h-4" />
                KNEC / KCSE Form 4 Biology Review
              </div>
              <h2 className="text-xl font-bold text-white">Natural Selection & Industrial Melanism</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Targeted examination questions testing understanding of heritable variation, selective agents, and
                Hardy-Weinberg dynamics.
              </p>
            </div>

            {submittedQuiz && (
              <div className="bg-slate-950 border border-slate-700 px-4 py-2 rounded-xl text-center">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Your Score</div>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {quizScore} / {KCSE_EXAM_QUESTIONS.length}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {KCSE_EXAM_QUESTIONS.map((q, qIndex) => {
              const selected = quizAnswers[q.id];
              const isAnswered = selected !== undefined;
              const isCorrect = selected === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-xl border transition-all ${
                    submittedQuiz
                      ? isCorrect
                        ? 'bg-emerald-950/20 border-emerald-500/50'
                        : 'bg-rose-950/20 border-rose-500/50'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs font-bold font-mono text-slate-300 shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white leading-relaxed mb-3">
                        {q.question}
                      </h4>

                      <div className="space-y-2">
                        {q.options.map((optionText, optIdx) => {
                          const isOptionSelected = selected === optIdx;
                          const isOptionCorrect = optIdx === q.correctIndex;

                          let btnClasses =
                            'w-full text-left p-3 rounded-lg text-xs transition-all border flex items-start gap-2.5 ';

                          if (!submittedQuiz) {
                            btnClasses += isOptionSelected
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white';
                          } else {
                            if (isOptionCorrect) {
                              btnClasses += 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                            } else if (isOptionSelected && !isOptionCorrect) {
                              btnClasses += 'bg-rose-950/60 border-rose-500 text-rose-300 line-through';
                            } else {
                              btnClasses += 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectAnswer(q.id, optIdx)}
                              disabled={submittedQuiz}
                              className={btnClasses}
                            >
                              <span className="font-mono text-slate-400 font-bold">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span className="flex-1">{optionText}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box on submit */}
                      {submittedQuiz && (
                        <div className="mt-3.5 p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-xs leading-relaxed">
                          <strong className="text-emerald-400 flex items-center gap-1.5 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            KNEC Examiner Biological Rationale:
                          </strong>
                          <p className="text-slate-300">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quiz Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            {!submittedQuiz ? (
              <button
                onClick={() => setSubmittedQuiz(true)}
                disabled={Object.keys(quizAnswers).length === 0}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-lg shadow-emerald-900/40 transition-all"
              >
                Submit Answers for Grading
              </button>
            ) : (
              <button
                onClick={() => {
                  setSubmittedQuiz(false);
                  setQuizAnswers({});
                }}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-5 rounded-xl text-sm border border-slate-700 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FOOTER & ACCREDITATION                                                */}
      {/* ===================================================================== */}
      <footer className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Form 4 Biology • Topic 2: Evolution & Natural Selection</span>
        </div>
        <div>Compliant with Kenya National Curriculum (KICD / KCSE Biology Paper 1 & 2)</div>
      </footer>
    </div>
  );
}
