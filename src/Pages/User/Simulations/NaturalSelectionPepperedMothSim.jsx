import React, { useState, useEffect, useRef, useId } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  FastForward,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  Crosshair,
  TrendingUp,
  Factory,
  Trees,
  Award,
  Zap,
  RefreshCw
} from 'lucide-react';

// Environments
const ENVIRONMENTS = {
  unpolluted: {
    id: 'unpolluted',
    name: 'Unpolluted Forest',
    sub: 'Pre-Industrial / Rural',
    barkColor: '#d4cebe',
    lichenColor: '#e2f0d9',
    sootLevel: 0,
    palePredationRate: 0.12, // 12% mortality per gen
    darkPredationRate: 0.65, // 65% mortality per gen (conspicuous on lichen)
    description:
      'Tree trunks are richly encrusted with pale lichens and free of atmospheric sulfur dioxide/soot. Pale speckled moths are cryptically camouflaged, while dark melanic morphs stand out starkly to insectivorous birds.'
  },
  industrial: {
    id: 'industrial',
    name: 'Industrial Soot Forest',
    sub: 'Coal Smog / Industrial Revolution',
    barkColor: '#1e1c1b',
    lichenColor: '#332d29',
    sootLevel: 1,
    palePredationRate: 0.72, // 72% mortality (conspicuous against dark soot)
    darkPredationRate: 0.10, // 10% mortality (cryptic on soot-coated bark)
    description:
      'Coal combustion produces heavy airborne soot deposits that kill sensitive epiphytic lichens and blacken the tree bark. Dark melanic (carbonaria) moths blend seamlessly, whereas pale typica morphs are readily preyed upon.'
  }
};

// KCSE Form 4 Questions on Natural Selection
const KCSE_QUESTIONS = [
  {
    id: 1,
    question:
      'Industrial melanism in the peppered moth (Biston betularia) provides a classic example of natural selection in action. What is the selective pressure operating in this ecosystem?',
    options: [
      { id: 'A', text: 'Airborne sulfur dioxide mutating genes directly from pale to dark' },
      { id: 'B', text: 'Differential visual predation by insectivorous birds based on background camouflage' },
      { id: 'C', text: 'Lethal cold temperatures favouring dark pigmentation for heat absorption' },
      { id: 'D', text: 'Dietary intake of soot soot-staining the moth wings during larval stage' }
    ],
    correct: 'B',
    explanation:
      'The selective agent is differential bird predation. Birds hunt by sight; moths that fail to match their background (lichen vs soot) are spotted and eaten more frequently, reducing their reproductive output.'
  },
  {
    id: 2,
    question:
      'The melanic allele (C) is dominant over the typica pale allele (c). In an unpolluted forest where pale moths (cc) are favored, why does the melanic allele (C) rarely disappear completely from the population?',
    options: [
      { id: 'A', text: 'The dominant allele C can persist hidden in heterozygous carriers (Cc) that occasionally survive or migrate from adjacent industrial zones' },
      { id: 'B', text: 'Recessive alleles mutate back into dominant alleles in every generation' },
      { id: 'C', text: 'Birds refuse to consume any organism carrying a dominant allele' },
      { id: 'D', text: 'Dominant alleles are chemically indestructible under natural conditions' }
    ],
    correct: 'A',
    explanation:
      'Dominant alleles can be replenished via recurrent low-frequency mutation or gene flow (migration from adjacent soot-polluted industrial pockets), and low numbers survive when resting under sheltered foliage.'
  },
  {
    id: 3,
    question:
      'Following the enactment of Clean Air Legislation in Britain, coal pollution declined sharply. What phenotypic shift occurred in Biston betularia populations according to KCSE biological records?',
    options: [
      { id: 'A', text: 'Melanic carbonaria frequencies increased to 100%' },
      { id: 'B', text: 'Moths ceased reproduction and entered permanent diapause' },
      { id: 'C', text: 'Typica pale morph frequencies steadily rebounded as lichens recolonized tree trunks' },
      { id: 'D', text: 'All moths mutated into green variants' }
    ],
    correct: 'C',
    explanation:
      'Reduced smoke emissions enabled crustose and foliose lichens to regrow. The pale bark background once again favored typica (cc), exerting directional selection against the melanic carbonaria morph.'
  }
];

export default function NaturalSelectionPepperedMothSim({ onTelemetry }) {
  const [environment, setEnvironment] = useState('industrial');
  const [generation, setGeneration] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [cleanAirActPassed, setCleanAirActPassed] = useState(false);

  // Population counts & Allele Frequencies (Hardy-Weinberg foundation)
  // Let C = melanic (dominant), c = typica (recessive)
  // Initially in industrial environment: C allele frequency p ≈ 0.68, c allele frequency q ≈ 0.32
  // Typica (pale) = cc (q^2), Carbonaria (dark) = CC (p^2) + Cc (2pq)
  const [popHistory, setPopHistory] = useState([
    {
      gen: 1,
      palePercent: 22,
      darkPercent: 78,
      freqC: 0.53,
      freq_c: 0.47,
      env: 'industrial'
    }
  ]);

  // Live resting moths displayed on trunk tree canvas
  // Array of { id, type: 'pale'|'dark', x, y, rotation, scale, eaten: boolean }
  const [moths, setMoths] = useState([]);
  const [predatorClicksCount, setPredatorClicksCount] = useState(0);
  const [lastEatenType, setLastEatenType] = useState(null);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const canvasRef = useRef(null);
  const graphCanvasRef = useRef(null);

  const envData = ENVIRONMENTS[environment];
  const latestPop = popHistory[popHistory.length - 1];

  // Initialize randomized moth positions based on current population percentages
  const generateMothsForDisplay = (paleRatio) => {
    const totalMoths = 18;
    const paleCount = Math.round(totalMoths * (paleRatio / 100));
    const newMoths = [];

    for (let i = 0; i < totalMoths; i++) {
      const isPale = i < paleCount;
      newMoths.push({
        id: `moth-${Date.now()}-${i}-${Math.random()}`,
        type: isPale ? 'pale' : 'dark',
        x: 40 + Math.random() * 520,
        y: 40 + Math.random() * 320,
        rotation: (Math.random() - 0.5) * 60,
        scale: 0.85 + Math.random() * 0.3,
        eaten: false
      });
    }
    // Shuffle array so moths are interspersed
    return newMoths.sort(() => Math.random() - 0.5);
  };

  // On mount or reset, populate tree trunk
  useEffect(() => {
    setMoths(generateMothsForDisplay(latestPop.palePercent));
  }, [environment]);

  // Draw Tree Trunk background and Moths on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw Organic Tree Trunk Texture
    const isInd = environment === 'industrial';
    const trunkGrad = ctx.createLinearGradient(0, 0, W, 0);

    if (isInd) {
      trunkGrad.addColorStop(0, '#1c1917'); // Dark slate soot
      trunkGrad.addColorStop(0.3, '#292524');
      trunkGrad.addColorStop(0.7, '#1f1d1b');
      trunkGrad.addColorStop(1, '#0c0a09');
    } else {
      trunkGrad.addColorStop(0, '#78716c'); // Pale weathered bark
      trunkGrad.addColorStop(0.3, '#a8a29e');
      trunkGrad.addColorStop(0.7, '#948f87');
      trunkGrad.addColorStop(1, '#57534e');
    }
    ctx.fillStyle = trunkGrad;
    ctx.fillRect(0, 0, W, H);

    // Vertical bark ridges
    ctx.strokeStyle = isInd ? 'rgba(0, 0, 0, 0.4)' : 'rgba(68, 64, 60, 0.35)';
    for (let x = 10; x < W; x += 16) {
      ctx.lineWidth = 2 + (x % 5);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + 10, H * 0.3, x - 10, H * 0.7, x + 5, H);
      ctx.stroke();
    }

    // 2. Lichen patches (Abundant in unpolluted, killed off in industrial)
    if (!isInd) {
      ctx.fillStyle = 'rgba(217, 237, 203, 0.75)'; // Crustose lichen green-white
      for (let i = 0; i < 28; i++) {
        const lx = (i * 47) % (W - 40) + 20;
        const ly = (i * 73) % (H - 40) + 20;
        const lr = 15 + (i % 20);
        ctx.beginPath();
        ctx.ellipse(lx, ly, lr * 1.6, lr, i * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Lichen texture flecks
        ctx.fillStyle = 'rgba(187, 218, 170, 0.6)';
        ctx.beginPath();
        ctx.arc(lx + 4, ly - 3, lr * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(217, 237, 203, 0.75)';
      }
    } else {
      // Soot smog grime film & patchy residue
      ctx.fillStyle = 'rgba(15, 12, 10, 0.55)';
      for (let i = 0; i < 15; i++) {
        const sx = (i * 61) % W;
        const sy = (i * 41) % H;
        ctx.beginPath();
        ctx.arc(sx, sy, 35 + (i % 25), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Draw Peppered Moths (Biston betularia)
    moths.forEach((moth) => {
      if (moth.eaten) return;

      ctx.save();
      ctx.translate(moth.x, moth.y);
      ctx.rotate((moth.rotation * Math.PI) / 180);
      ctx.scale(moth.scale, moth.scale);

      // Subtle shadow under moth wings
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 4;

      const isPale = moth.type === 'pale';

      // Forewings (Triangular deltoid shape)
      ctx.beginPath();
      // Left forewing
      ctx.moveTo(0, -6);
      ctx.bezierCurveTo(-18, -26, -34, -18, -32, 6);
      ctx.bezierCurveTo(-26, 16, -10, 10, 0, 2);
      // Right forewing
      ctx.bezierCurveTo(10, 10, 26, 16, 32, 6);
      ctx.bezierCurveTo(34, -18, 18, -26, 0, -6);
      ctx.closePath();

      if (isPale) {
        // Pale speckled Typica morph
        ctx.fillStyle = '#f8fafc';
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Peppered black specks
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        const specks = [
          [-12, -8], [-20, -2], [-14, 6], [-24, 4],
          [12, -8], [20, -2], [14, 6], [24, 4],
          [-6, -16], [6, -16], [-2, -2], [2, 4]
        ];
        specks.forEach(([sx, sy]) => {
          ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
        });
        ctx.fill();
      } else {
        // Melanic Carbonaria morph
        ctx.fillStyle = '#0f172a'; // Deep soot black
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Subtle dark charcoal sheen
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Hindwings (Smaller lower wings)
      ctx.beginPath();
      ctx.moveTo(-10, 4);
      ctx.bezierCurveTo(-20, 14, -16, 26, -4, 22);
      ctx.lineTo(0, 12);
      ctx.lineTo(4, 22);
      ctx.bezierCurveTo(16, 26, 20, 14, 10, 4);
      ctx.closePath();
      ctx.fillStyle = isPale ? '#f1f5f9' : '#1e293b';
      ctx.fill();

      // Thorax & Abdomen
      ctx.beginPath();
      ctx.ellipse(0, 3, 3.5, 13, 0, 0, Math.PI * 2);
      ctx.fillStyle = isPale ? '#e2e8f0' : '#020617';
      ctx.fill();

      // Antennae (Bipectinate feathery sensory filaments)
      ctx.strokeStyle = isPale ? '#475569' : '#94a3b8';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-1, -8);
      ctx.quadraticCurveTo(-6, -18, -12, -22);
      ctx.moveTo(1, -8);
      ctx.quadraticCurveTo(6, -18, 12, -22);
      ctx.stroke();

      ctx.restore();
    });
  }, [environment, moths]);

  // Draw Population Frequency Line Graph
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const padLeft = 46;
    const padRight = 20;
    const padTop = 24;
    const padBottom = 32;
    const plotW = W - padLeft - padRight;
    const plotH = H - padTop - padBottom;

    // Grid lines & Y-axis labels (0% to 100%)
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'right';

    for (let p = 0; p <= 100; p += 25) {
      const y = padTop + plotH - (p / 100) * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(W - padRight, y);
      ctx.stroke();
      ctx.fillText(`${p}%`, padLeft - 6, y + 3);
    }

    // X-axis baseline
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop + plotH);
    ctx.lineTo(W - padRight, padTop + plotH);
    ctx.stroke();

    // Plot points
    const pts = popHistory;
    const totalGens = Math.max(10, pts.length);
    const getX = (idx) => padLeft + (idx / (totalGens - 1 || 1)) * plotW;
    const getY = (val) => padTop + plotH - (val / 100) * plotH;

    // Line 1: Pale Typica % (White/Cyan line)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    pts.forEach((p, idx) => {
      const x = getX(idx);
      const y = getY(p.palePercent);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Line 2: Melanic Carbonaria % (Amber/Dark charcoal line)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    pts.forEach((p, idx) => {
      const x = getX(idx);
      const y = getY(p.darkPercent);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Data points & Tooltips
    pts.forEach((p, idx) => {
      const x = getX(idx);
      // Pale dot
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(x, getY(p.palePercent), 4, 0, Math.PI * 2);
      ctx.fill();

      // Dark dot
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, getY(p.darkPercent), 4, 0, Math.PI * 2);
      ctx.fill();

      // Gen label for key steps
      if (idx % Math.ceil(pts.length / 6) === 0 || idx === pts.length - 1) {
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        ctx.fillText(`G${p.gen}`, x, padTop + plotH + 16);
      }
    });

    // Clean Air Act vertical landmark line if enacted
    if (cleanAirActPassed) {
      const enactedIdx = pts.findIndex((p) => p.cleanAirEvent);
      if (enactedIdx !== -1) {
        const actX = getX(enactedIdx);
        ctx.save();
        ctx.strokeStyle = '#10b981';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(actX, padTop);
        ctx.lineTo(actX, padTop + plotH);
        ctx.stroke();
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 9px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Clean Air Act', actX, padTop - 6);
        ctx.restore();
      }
    }
  }, [popHistory, cleanAirActPassed]);

  // Click on Canvas = Student playing Insectivorous Bird Predator!
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Find nearest uneaten moth within hit radius
    let hitIndex = -1;
    let minDist = 34; // Pixel hit radius

    moths.forEach((m, idx) => {
      if (m.eaten) return;
      const d = Math.hypot(m.x - clickX, m.y - clickY);
      if (d < minDist) {
        minDist = d;
        hitIndex = idx;
      }
    });

    if (hitIndex !== -1) {
      const victim = moths[hitIndex];
      setLastEatenType(victim.type);
      setPredatorClicksCount((c) => c + 1);

      // Mark moth as eaten
      const updatedMoths = [...moths];
      updatedMoths[hitIndex] = { ...victim, eaten: true };
      setMoths(updatedMoths);

      // Adjust population ratio slightly based on student predation
      setPopHistory((prev) => {
        const last = prev[prev.length - 1];
        let newPale = last.palePercent;
        let newDark = last.darkPercent;
        if (victim.type === 'pale') {
          newPale = Math.max(5, newPale - 2.5);
          newDark = 100 - newPale;
        } else {
          newDark = Math.max(5, newDark - 2.5);
          newPale = 100 - newDark;
        }
        return [
          ...prev.slice(0, prev.length - 1),
          {
            ...last,
            palePercent: Math.round(newPale),
            darkPercent: Math.round(newDark),
            freq_c: Math.round(Math.sqrt(newPale / 100) * 100) / 100,
            freqC: Math.round((1 - Math.sqrt(newPale / 100)) * 100) / 100
          }
        ];
      });
    }
  };

  // Run 1 Generation step of Natural Selection mathematically
  const runGenerationStep = (historySoFar, currentEnv) => {
    const last = historySoFar[historySoFar.length - 1];
    const env = ENVIRONMENTS[currentEnv];

    // Selective survival:
    // Pale survival = 1 - palePredationRate
    // Dark survival = 1 - darkPredationRate
    const paleSurv = (last.palePercent / 100) * (1 - env.palePredationRate);
    const darkSurv = (last.darkPercent / 100) * (1 - env.darkPredationRate);
    const totalSurv = paleSurv + darkSurv;

    let nextPale = Math.min(95, Math.max(5, (paleSurv / totalSurv) * 100));
    let nextDark = 100 - nextPale;

    // Hardy-Weinberg allele frequencies
    // cc = pale = q^2 => q = sqrt(paleFreq)
    const q = Math.min(0.97, Math.max(0.03, Math.sqrt(nextPale / 100)));
    const p = 1 - q;

    return {
      gen: last.gen + 1,
      palePercent: Math.round(nextPale),
      darkPercent: Math.round(nextDark),
      freq_c: Math.round(q * 100) / 100,
      freqC: Math.round(p * 100) / 100,
      env: currentEnv
    };
  };

  // Automated 10 Generations Simulation Run
  const handleSimulate10Generations = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    let currentHistory = [...popHistory];
    for (let step = 0; step < 10; step++) {
      await new Promise((res) => setTimeout(res, 180));
      const nextGen = runGenerationStep(currentHistory, environment);
      currentHistory = [...currentHistory, nextGen];
      setPopHistory([...currentHistory]);
      setGeneration(nextGen.gen);
    }
    setMoths(generateMothsForDisplay(currentHistory[currentHistory.length - 1].palePercent));
    setIsSimulating(false);
  };

  // Enact Clean Air Act (Historically passed in 1956, turning soot forest back to unpolluted)
  const handleEnactCleanAirAct = () => {
    setCleanAirActPassed(true);
    setEnvironment('unpolluted');
    setPopHistory((prev) => {
      const last = prev[prev.length - 1];
      return [
        ...prev,
        {
          ...last,
          gen: last.gen + 1,
          cleanAirEvent: true,
          env: 'unpolluted'
        }
      ];
    });
    setGeneration((g) => g + 1);
  };

  // Reset simulation to baseline
  const handleReset = () => {
    setEnvironment('industrial');
    setGeneration(1);
    setCleanAirActPassed(false);
    setPredatorClicksCount(0);
    setLastEatenType(null);
    const initialPop = [
      {
        gen: 1,
        palePercent: 22,
        darkPercent: 78,
        freqC: 0.53,
        freq_c: 0.47,
        env: 'industrial'
      }
    ];
    setPopHistory(initialPop);
    setMoths(generateMothsForDisplay(22));
  };

  // Quiz Handlers
  const handleQuizOption = (id) => {
    if (isQuizSubmitted) return;
    setSelectedOpt(id);
  };

  const handleQuizSubmit = () => {
    if (!selectedOpt) return;
    setIsQuizSubmitted(true);
    if (selectedOpt === KCSE_QUESTIONS[quizIndex].correct) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex + 1 < KCSE_QUESTIONS.length) {
      setQuizIndex((i) => i + 1);
      setSelectedOpt(null);
      setIsQuizSubmitted(false);
    } else {
      setQuizCompleted(true);
      if (onTelemetry) {
        onTelemetry({
          event: 'simulation_quiz_completed',
          simulation: 'NaturalSelectionPepperedMothSim',
          score: quizScore + (selectedOpt === KCSE_QUESTIONS[quizIndex].correct ? 1 : 0),
          maxScore: KCSE_QUESTIONS.length,
          passed: quizScore >= 2
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedOpt(null);
    setIsQuizSubmitted(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-5 text-slate-100 font-sans space-y-5">
      {/* Header Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              KCSE Biology Form 4 • Topic 4: Evolution & Natural Selection
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Natural Selection & Industrial Melanism
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Simulate selective bird predation in <em>Biston betularia</em>. Witness rapid directional
              selection shifting gene frequencies between pre-industrial lichens and soot pollution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-xs font-bold text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Experiment
            </button>
          </div>
        </div>
      </div>

      {/* Main Simulation Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Interactive Tree Trunk & Predation Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between">
          {/* Viewport Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-200">
                Bird Predation Viewport (Click on visible moths to hunt)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Hunted: <strong className="text-white">{predatorClicksCount}</strong></span>
              {lastEatenType && (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  Last: {lastEatenType === 'pale' ? 'Typica (Pale)' : 'Carbonaria (Dark)'}
                </span>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="relative w-full h-[360px] sm:h-[400px] overflow-hidden rounded-2xl my-2 cursor-crosshair border border-slate-800">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              onClick={handleCanvasClick}
              className="w-full h-full object-cover select-none"
            />

            {/* In-canvas environment badge */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold flex items-center gap-2">
              {environment === 'industrial' ? (
                <>
                  <Factory className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-200">Industrial Soot Trunk</span>
                </>
              ) : (
                <>
                  <Trees className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-200">Lichen-Covered Trunk</span>
                </>
              )}
            </div>

            <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] text-slate-300">
              Gen {generation} • Pale: {latestPop.palePercent}% | Dark: {latestPop.darkPercent}%
            </div>
          </div>

          {/* Morph Legend & Camouflage Effectiveness */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-white border border-slate-400 flex items-center justify-center text-[9px] font-black text-slate-900">
                  c
                </span>
                <div>
                  <div className="font-bold text-slate-200">Typica (Pale)</div>
                  <div className="text-[10px] text-slate-400">Homozygous recessive (cc)</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sky-400">{latestPop.palePercent}%</div>
                <div className="text-[10px] text-slate-400">
                  Surv: {Math.round((1 - envData.palePredationRate) * 100)}%
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-slate-950 border border-slate-600 flex items-center justify-center text-[9px] font-black text-amber-400">
                  C
                </span>
                <div>
                  <div className="font-bold text-slate-200">Carbonaria (Melanic)</div>
                  <div className="text-[10px] text-slate-400">Dominant (CC / Cc)</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-amber-400">{latestPop.darkPercent}%</div>
                <div className="text-[10px] text-slate-400">
                  Surv: {Math.round((1 - envData.darkPredationRate) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls, Allele Dynamics & Graph (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Environment Switcher & Generation Runner */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Environmental Selective Regime
            </div>

            <div className="grid grid-cols-2 gap-2">
              {Object.values(ENVIRONMENTS).map((env) => {
                const isActive = environment === env.id;
                return (
                  <button
                    key={env.id}
                    onClick={() => setEnvironment(env.id)}
                    disabled={isSimulating}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isActive
                        ? env.id === 'industrial'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-100 font-bold shadow-md'
                          : 'bg-emerald-500/20 border-emerald-500 text-emerald-100 font-bold shadow-md'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      {env.id === 'industrial' ? (
                        <Factory className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Trees className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {env.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{env.sub}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSimulate10Generations}
                disabled={isSimulating}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSimulating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FastForward className="w-4 h-4" />
                )}
                {isSimulating ? 'Simulating Predation...' : 'Simulate 10 Generations'}
              </button>

              {!cleanAirActPassed && environment === 'industrial' && (
                <button
                  onClick={handleEnactCleanAirAct}
                  className="px-3.5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-700/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Enact Britain Clean Air Act 1956"
                >
                  <Trees className="w-4 h-4" />
                  Clean Air Act
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Population Frequency Line Graph */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                Allele & Phenotype Trajectory
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-sky-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-sky-400" /> Pale (typica)
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Melanic (carbonaria)
                </span>
              </div>
            </div>

            <div className="w-full h-44 bg-slate-950/60 rounded-2xl border border-slate-800 p-2">
              <canvas
                ref={graphCanvasRef}
                width={440}
                height={160}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Hardy-Weinberg Allele Frequencies */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-800/70 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block font-medium">
                  Dominant Allele Freq (p [C])
                </span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {latestPop.freqC.toFixed(2)}
                </span>
              </div>
              <div className="p-2.5 bg-slate-800/70 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block font-medium">
                  Recessive Allele Freq (q [c])
                </span>
                <span className="font-mono font-bold text-sky-400 text-sm">
                  {latestPop.freq_c.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KCSE Examination Challenge */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              KCSE Evaluation Challenge: Natural Selection in Peppered Moths
            </h2>
          </div>
          {!quizCompleted && (
            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Question {quizIndex + 1} of {KCSE_QUESTIONS.length}
            </span>
          )}
        </div>

        {!quizCompleted ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              {KCSE_QUESTIONS[quizIndex].question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {KCSE_QUESTIONS[quizIndex].options.map((opt) => {
                const isSelected = selectedOpt === opt.id;
                let optClass = 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800';

                if (isQuizSubmitted) {
                  if (opt.id === KCSE_QUESTIONS[quizIndex].correct) {
                    optClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected) {
                    optClass = 'bg-rose-500/20 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  optClass = 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleQuizOption(opt.id)}
                    disabled={isQuizSubmitted}
                    className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start gap-2.5 ${optClass} cursor-pointer disabled:cursor-default`}
                  >
                    <span className="font-bold shrink-0">{opt.id}.</span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {isQuizSubmitted && (
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center gap-2">
                  {selectedOpt === KCSE_QUESTIONS[quizIndex].correct ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Correct KCSE Marking Scheme Answer!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                      <XCircle className="w-4 h-4" /> Incorrect
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {KCSE_QUESTIONS[quizIndex].explanation}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              {!isQuizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={!selectedOpt}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-amber-600/30"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuiz}
                  className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {quizIndex + 1 < KCSE_QUESTIONS.length ? 'Next Question' : 'Complete Challenge'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Natural Selection Challenge Finished!</h3>
            <p className="text-xs text-slate-300">
              You scored <span className="font-bold text-emerald-400">{quizScore}</span> out of{' '}
              <span className="font-bold">{KCSE_QUESTIONS.length}</span> questions.
            </p>
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Retake Challenge
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
