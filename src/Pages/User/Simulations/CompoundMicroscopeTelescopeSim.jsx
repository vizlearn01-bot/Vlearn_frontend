import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Microscope,
  Eye,
  RotateCcw,
  Sliders,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  Layers,
  Compass,
  ZoomIn,
  ZoomOut,
  Maximize2,
  BookOpen,
  Award,
} from 'lucide-react';

// ============================================================================
// PRESETS FOR COMPOUND MICROSCOPE & ASTRONOMICAL TELESCOPE
// ============================================================================
const MICROSCOPE_PRESETS = [
  {
    id: 'normal_adj',
    label: 'Normal Adjustment (Near Point D = 25 cm)',
    tag: 'Sharp Focus · 72×',
    fo: 16,
    fe: 50,
    uo: 18.5,
    tubeLength: 161.7,
    desc: 'Standard laboratory adjustment with intermediate image I₁ inside Fe and final virtual image at the near point.',
  },
  {
    id: 'high_power',
    label: 'High Power Eyepiece (Oil Immersion)',
    tag: 'Extreme Zoom · 128×',
    fo: 14,
    fe: 36,
    uo: 16.0,
    tubeLength: 147.0,
    desc: 'Short focal length objective and eyepiece maximizing total magnification for subcellular organelle inspection.',
  },
  {
    id: 'low_power',
    label: 'Low Power Scanning Setup',
    tag: 'Wide FOV · 36×',
    fo: 20,
    fe: 55,
    uo: 24.5,
    tubeLength: 160.0,
    desc: 'Gentle magnification offering wider field of view for scanning entire tissue slices.',
  },
  {
    id: 'defocused',
    label: 'Out of Focus (Search Mode)',
    tag: 'Blurry · Needs Tuning',
    fo: 16,
    fe: 50,
    uo: 18.5,
    tubeLength: 180.0,
    desc: 'Tube length racked too far outwards; intermediate image falls outside comfortable eyepiece focus.',
  },
];

const TELESCOPE_PRESETS = [
  {
    id: 'normal_tele',
    label: 'Normal Adjustment (L = fo + fe)',
    tag: 'Parallel Rays · 5.0×',
    fo: 200,
    fe: 40,
    tubeLength: 240,
    target: 'moon',
    desc: 'Intermediate image forms at common focal point Fo/Fe; rays emerge parallel into relaxed, unaccommodated eye.',
  },
  {
    id: 'planetary_saturn',
    label: 'High-Power Planetary Setup (Saturn)',
    tag: 'Ring Detail · 8.0×',
    fo: 240,
    fe: 30,
    tubeLength: 270,
    target: 'saturn',
    desc: 'Long objective focal length combined with compact ocular for resolving Saturnian rings and Cassini division.',
  },
  {
    id: 'wide_moon',
    label: 'Lunar Explorer (Craters & Maria)',
    tag: 'Bright Aperture · 4.4×',
    fo: 176,
    fe: 40,
    tubeLength: 216,
    target: 'moon',
    desc: 'Balanced aperture capturing rich contrast across the terminator shadows of Tycho and Copernicus craters.',
  },
  {
    id: 'tele_defocused',
    label: 'Defocussed Drawtube',
    tag: 'Hazy Disc · Needs Tuning',
    fo: 200,
    fe: 40,
    tubeLength: 218,
    target: 'saturn',
    desc: 'Tube racked too short (L < fo + fe); rays emerge diverging, producing out-of-focus celestial bokeh.',
  },
];

// ============================================================================
// KCSE EXAM PRACTICE QUESTIONS
// ============================================================================
const KCSE_QUESTIONS = [
  {
    id: 'q1',
    instrument: 'microscope',
    title: 'KCSE Question 1: Image Characteristics',
    prompt:
      'In a compound microscope under normal adjustment, what are the nature and orientations of the intermediate image (I₁) and the final image (I₂)?',
    options: [
      {
        id: 'A',
        text: 'I₁ is real, inverted and magnified; I₂ is virtual, inverted (w.r.t object) and hugely magnified at the near point.',
        correct: true,
      },
      {
        id: 'B',
        text: 'I₁ is virtual and upright; I₂ is real and inverted at infinity.',
        correct: false,
      },
      {
        id: 'C',
        text: 'I₁ is real, upright and diminished; I₂ is virtual and upright at 2F.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Both I₁ and I₂ are real, upright and formed on a projection screen.',
        correct: false,
      },
    ],
    explanation:
      'The objective lens forms a real, inverted and magnified intermediate image (I₁) just inside the principal focus of the eyepiece (Fe). The eyepiece then acts as a simple magnifying glass, forming a final virtual, inverted (relative to the original specimen), and highly enlarged image (I₂) at the near point (D = 25 cm).',
  },
  {
    id: 'q2',
    instrument: 'telescope',
    title: 'KCSE Question 2: Normal Adjustment Tube Length',
    prompt:
      'An astronomical telescope has an objective lens of focal length fo = 120 cm and an eyepiece of focal length fe = 6 cm. In normal adjustment, what is the separation distance between the lenses (L) and the angular magnification (M)?',
    options: [
      {
        id: 'A',
        text: 'L = 126 cm, M = 20',
        correct: true,
      },
      {
        id: 'B',
        text: 'L = 114 cm, M = 20',
        correct: false,
      },
      {
        id: 'C',
        text: 'L = 126 cm, M = 0.05',
        correct: false,
      },
      {
        id: 'D',
        text: 'L = 720 cm, M = 26',
        correct: false,
      },
    ],
    explanation:
      'In normal adjustment of an astronomical telescope: 1) Separation between lenses L = fo + fe = 120 cm + 6 cm = 126 cm. 2) Angular magnification M = fo / fe = 120 cm / 6 cm = 20.',
  },
  {
    id: 'q3',
    instrument: 'both',
    title: 'KCSE Question 3: Optical Design Rationale',
    prompt:
      'Why does the objective lens of an astronomical telescope require a very large focal length (fo) and large diameter, whereas the objective lens of a compound microscope requires a very short focal length (fo)?',
    options: [
      {
        id: 'A',
        text: 'Telescope M = fo/fe (large fo gives high angular magnification & collects faint celestial light), while microscope linear mo = vo/uo requires short fo to create huge magnification within a practical tube length.',
        correct: true,
      },
      {
        id: 'B',
        text: 'Microscope lenses must be small to prevent refraction of ambient atmospheric dust.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Telescope objectives must produce a virtual image inside the barrel, unlike microscopes.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Short focal length in microscopes prevents chromatic aberration completely without glass.',
        correct: false,
      },
    ],
    explanation:
      'For a telescope, angular magnification M = fo / fe, so a large fo increases magnification while a large diameter aperture maximizes light-gathering power from faint astronomical bodies. In a compound microscope, mo = vo / uo; placing the specimen just beyond a short focal length fo creates a huge real image vo within a modest tube length of 16-20 cm.',
  },
  {
    id: 'q4',
    instrument: 'microscope',
    title: 'KCSE Question 4: Quantitative Magnification Calculation',
    prompt:
      'A specimen slide is placed 1.8 cm from a microscope objective lens of focal length fo = 1.5 cm. If the eyepiece has focal length fe = 5.0 cm and the final image is viewed at near point D = 25 cm, calculate total magnification M = (vo / uo) × (D / fe).',
    options: [
      {
        id: 'A',
        text: 'M = 25× (vo = 9.0 cm, mo = 5, me = 5)',
        correct: true,
      },
      {
        id: 'B',
        text: 'M = 45× (vo = 18.0 cm, mo = 10, me = 4.5)',
        correct: false,
      },
      {
        id: 'C',
        text: 'M = 12.5× (vo = 4.5 cm, mo = 2.5, me = 5)',
        correct: false,
      },
      {
        id: 'D',
        text: 'M = 75× (vo = 15.0 cm, mo = 15, me = 5)',
        correct: false,
      },
    ],
    explanation:
      '1) Lens equation: 1/vo = 1/fo - 1/uo = 1/1.5 - 1/1.8 = (6 - 5)/9 = 1/9 ⇒ vo = 9.0 cm. 2) Objective magnification mo = vo / uo = 9.0 / 1.8 = 5.0. 3) Eyepiece magnification me = D / fe = 25 / 5.0 = 5.0. 4) Total magnification M = mo × me = 5.0 × 5.0 = 25×.',
  },
];

export default function CompoundMicroscopeTelescopeSim({ config = {}, onTelemetry }) {
  // Mode selection: 'microscope' | 'telescope'
  const [mode, setMode] = useState('microscope');

  // Telescope target celestial body: 'moon' | 'saturn'
  const [celestialTarget, setCelestialTarget] = useState('moon');

  // Interactive controls for Microscope (in mm)
  const [foMicro, setFoMicro] = useState(16); // 12 - 24 mm
  const [feMicro, setFeMicro] = useState(50); // 35 - 65 mm
  const [uoMicro, setUoMicro] = useState(18.5); // must be > foMicro
  const [tubeLengthMicro, setTubeLengthMicro] = useState(161.7); // 130 - 200 mm
  const nearPointD = 250; // mm (25 cm)

  // Interactive controls for Telescope (in mm)
  const [foTele, setFoTele] = useState(200); // 150 - 260 mm
  const [feTele, setFeTele] = useState(40); // 25 - 55 mm
  const [tubeLengthTele, setTubeLengthTele] = useState(240); // 190 - 290 mm

  // UI state
  const [activePresetId, setActivePresetId] = useState('normal_adj');
  const [showRays, setShowRays] = useState(true);
  const [show3DCutaway, setShow3DCutaway] = useState(true);
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showQuestionFeedback, setShowQuestionFeedback] = useState(false);

  // Canvas ref for ray diagram & 3D bench
  const canvasRef = useRef(null);

  // Optical calculations for Compound Microscope
  const microscopeOptics = useMemo(() => {
    // Ensure uo > fo so real image is formed
    const effectiveUo = Math.max(foMicro + 0.5, uoMicro);
    // Objective lens equation: 1/vo = 1/fo - 1/uo
    const vo = (foMicro * effectiveUo) / (effectiveUo - foMicro);
    const mo = vo / effectiveUo; // linear magnification of objective

    // Eyepiece distance to intermediate image: ue = tubeLength - vo
    const ue = tubeLengthMicro - vo;

    // Ideal ue for sharp image at near point D = 250 mm:
    // 1/fe = 1/ue + 1/(-D) => 1/ue = 1/fe + 1/D => ue* = (fe * D) / (fe + D)
    const idealUeNearPoint = (feMicro * nearPointD) / (feMicro + nearPointD);
    const idealTubeLength = vo + idealUeNearPoint;

    // Focus deviation
    const focusError = Math.abs(tubeLengthMicro - idealTubeLength);
    const isSharp = focusError <= 2.2;
    const focusScore = Math.max(0, Math.min(100, Math.round(100 - focusError * 4.5)));

    // Virtual image distance ve
    let ve = -9999;
    if (ue < feMicro && ue > 2) {
      ve = -(feMicro * ue) / (feMicro - ue);
    }

    // Magnifications
    const meNearPoint = 1 + nearPointD / feMicro; // at near point
    const meStandard = nearPointD / feMicro; // standard KCSE formula
    const totalMagnification = mo * meStandard;

    // Blur in px for eyepiece view (0 if sharp)
    const blurPx = Math.max(0, Math.min(18, focusError * 0.7));

    return {
      effectiveUo,
      vo,
      mo,
      ue,
      idealUeNearPoint,
      idealTubeLength,
      focusError,
      isSharp,
      focusScore,
      ve,
      meStandard,
      meNearPoint,
      totalMagnification,
      blurPx,
    };
  }, [foMicro, feMicro, uoMicro, tubeLengthMicro]);

  // Optical calculations for Astronomical Telescope
  const telescopeOptics = useMemo(() => {
    // In normal adjustment, intermediate image forms at fo
    const vo = foTele;
    const idealTubeLength = foTele + feTele; // L = fo + fe
    const focusError = Math.abs(tubeLengthTele - idealTubeLength);
    const isSharp = focusError <= 2.5;
    const focusScore = Math.max(0, Math.min(100, Math.round(100 - focusError * 3.8)));

    // Eyepiece distance to intermediate image: ue = tubeLength - fo
    const ue = tubeLengthTele - vo;

    // Angular magnification in normal adjustment: M = fo / fe
    const angularMagnification = foTele / feTele;

    // Blur in px for eyepiece view
    const blurPx = Math.max(0, Math.min(18, focusError * 0.65));

    return {
      vo,
      idealTubeLength,
      focusError,
      isSharp,
      focusScore,
      ue,
      angularMagnification,
      blurPx,
    };
  }, [foTele, feTele, tubeLengthTele]);

  // Telemetry dispatch
  const triggerTelemetry = useCallback(
    (checkpointName, extra = {}) => {
      if (typeof onTelemetry === 'function') {
        onTelemetry(checkpointName, {
          mode,
          timestamp: Date.now(),
          ...extra,
        });
      }
    },
    [mode, onTelemetry]
  );

  // Switch to preset
  const applyMicroscopePreset = (p) => {
    setActivePresetId(p.id);
    setFoMicro(p.fo);
    setFeMicro(p.fe);
    setUoMicro(p.uo);
    setTubeLengthMicro(p.tubeLength);
    triggerTelemetry('PRESET_APPLIED', { preset: p.id, instrument: 'microscope' });
  };

  const applyTelescopePreset = (p) => {
    setActivePresetId(p.id);
    setFoTele(p.fo);
    setFeTele(p.fe);
    setTubeLengthTele(p.tubeLength);
    if (p.target) setCelestialTarget(p.target);
    triggerTelemetry('PRESET_APPLIED', { preset: p.id, instrument: 'telescope' });
  };

  // Reset current instrument to default normal adjustment
  const handleReset = () => {
    if (mode === 'microscope') {
      applyMicroscopePreset(MICROSCOPE_PRESETS[0]);
    } else {
      applyTelescopePreset(TELESCOPE_PRESETS[0]);
    }
  };

  // Check quiz answer
  const handleAnswerOption = (questionId, optionId) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setShowQuestionFeedback(true);
    const q = KCSE_QUESTIONS[selectedQuestionIdx];
    const isCorrect = q.options.find((o) => o.id === optionId)?.correct;
    triggerTelemetry('KCSE_QUIZ_ATTEMPTED', { questionId, optionId, isCorrect });
  };

  // ============================================================================
  // CANVAS RENDERING: HYPERREALISTIC PSEUDO-3D BENCH & DYNAMIC RAY TRACING
  // ============================================================================
  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cy = H / 2; // Optical principal axis

    ctx.clearRect(0, 0, W, H);

    // 1. Subtle Dark Laboratory Environment Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#020617'); // slate-950
    bgGrad.addColorStop(0.5, '#090d1f'); // deep midnight
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Optical Bench Base & Millimeter Grid Ruler
    const benchY = cy + 115;
    const benchH = 34;

    // Bench metallic gradient
    const benchGrad = ctx.createLinearGradient(0, benchY, 0, benchY + benchH);
    benchGrad.addColorStop(0, '#475569'); // slate-600 top bevel
    benchGrad.addColorStop(0.15, '#1e293b'); // slate-800
    benchGrad.addColorStop(0.85, '#0f172a'); // slate-900
    benchGrad.addColorStop(1, '#020617');
    ctx.fillStyle = benchGrad;
    ctx.fillRect(40, benchY, W - 80, benchH);

    // Bench upper chrome rail highlight
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(40, benchY);
    ctx.lineTo(W - 40, benchY);
    ctx.stroke();

    // Bench metric millimeter scale ticks
    ctx.fillStyle = '#64748b';
    ctx.font = '9px ui-monospace, monospace';
    ctx.textAlign = 'center';
    for (let x = 60; x <= W - 60; x += 15) {
      const isMajor = (x - 60) % 60 === 0;
      const isMedium = (x - 60) % 30 === 0;
      const tickH = isMajor ? 9 : isMedium ? 6 : 3.5;

      ctx.strokeStyle = isMajor ? 'rgba(248, 250, 252, 0.5)' : 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = isMajor ? 1.2 : 0.8;
      ctx.beginPath();
      ctx.moveTo(x, benchY + 1);
      ctx.lineTo(x, benchY + 1 + tickH);
      ctx.stroke();

      if (isMajor && x < W - 80) {
        ctx.fillText(`${Math.round((x - 60) * 0.4)}mm`, x, benchY + tickH + 11);
      }
    }

    // 3. Principal Optical Axis
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(25, cy);
    ctx.lineTo(W - 25, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Axis label
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Principal Optical Axis', 32, cy - 8);

    // ========================================================================
    // MODE: COMPOUND MICROSCOPE
    // ========================================================================
    if (mode === 'microscope') {
      const { effectiveUo, vo, mo, isSharp } = microscopeOptics;

      // Coordinate scaling for microscope layout:
      // Objective lens L1 fixed at xObj
      const xObj = 240;
      // Object placed to the left: xItem = xObj - uo * scaleU
      const scaleU = 3.6;
      const xItem = xObj - effectiveUo * scaleU;
      const itemHeight = 22; // object height px

      // Intermediate image position: xI1 = xObj + vo * scaleV
      // Scale tube length so it fits neatly across the canvas
      const scaleTube = 2.4;
      const xI1 = xObj + vo * scaleTube;
      const xEye = xObj + tubeLengthMicro * scaleTube;
      const intermediateH = itemHeight * mo * (scaleTube / scaleU); // magnified intermediate image height

      // L1 Focal points
      const xFo = xObj - foMicro * scaleU;
      const xFoPrime = xObj + foMicro * scaleTube;

      // L2 Eyepiece Focal points
      const xFe = xEye - feMicro * scaleTube;

      // --- 3D Cutaway Brass Microscope Tube & Mechanical Barrel ---
      if (show3DCutaway) {
        // Outer Brass Body Tube
        const tubeOuterGrad = ctx.createLinearGradient(0, cy - 75, 0, cy + 75);
        tubeOuterGrad.addColorStop(0, '#78350f'); // deep bronze
        tubeOuterGrad.addColorStop(0.2, '#d97706'); // amber brass
        tubeOuterGrad.addColorStop(0.45, '#fef08a'); // golden specular highlight
        tubeOuterGrad.addColorStop(0.65, '#b45309'); // rich brass
        tubeOuterGrad.addColorStop(1, '#451a03'); // shadow bronze

        // Fixed Objective Barrel (Brass)
        ctx.fillStyle = tubeOuterGrad;
        ctx.beginPath();
        ctx.roundRect(xObj - 26, cy - 44, 46, 88, 4);
        ctx.fill();

        // Knurled Objective Nosepiece Rim
        ctx.fillStyle = '#b45309';
        ctx.fillRect(xObj - 28, cy - 48, 8, 96);
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        ctx.strokeRect(xObj - 28, cy - 48, 8, 96);

        // Telescoping Internal Brass Drawtube (moves with tubeLength)
        const drawtubeStart = xObj + 20;
        const drawtubeWidth = Math.max(30, xEye - drawtubeStart + 18);
        const drawGrad = ctx.createLinearGradient(0, cy - 54, 0, cy + 54);
        drawGrad.addColorStop(0, 'rgba(120, 53, 15, 0.45)');
        drawGrad.addColorStop(0.3, 'rgba(217, 119, 6, 0.35)');
        drawGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.25)');
        drawGrad.addColorStop(1, 'rgba(69, 26, 3, 0.45)');

        ctx.fillStyle = drawGrad;
        ctx.fillRect(drawtubeStart, cy - 50, drawtubeWidth, 100);

        // Cutaway Window (Reveals inner rays and intermediate focal plane)
        ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
        ctx.fillRect(xObj + 22, cy - 42, Math.max(10, xEye - xObj - 24), 84);
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(xObj + 22, cy - 42, Math.max(10, xEye - xObj - 24), 84);

        // Rack & Pinion Focusing Gear & Knob
        const knobX = xObj + 65;
        const knobY = cy + 56;
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.arc(knobX, knobY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Knurling ridges on knob
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          ctx.beginPath();
          ctx.moveTo(knobX + Math.cos(a) * 8, knobY + Math.sin(a) * 8);
          ctx.lineTo(knobX + Math.cos(a) * 15, knobY + Math.sin(a) * 15);
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Mechanical Mount Pillars from Bench to Lens Holders
        ctx.fillStyle = '#334155';
        ctx.fillRect(xObj - 12, cy + 44, 24, benchY - (cy + 44));
        ctx.fillRect(xEye - 12, cy + 44, 24, benchY - (cy + 44));

        // Eyepiece Ocular Tube & Ergonomic Soft Rubber Eyecup
        const ocularGrad = ctx.createLinearGradient(0, cy - 60, 0, cy + 60);
        ocularGrad.addColorStop(0, '#64748b');
        ocularGrad.addColorStop(0.4, '#cbd5e1');
        ocularGrad.addColorStop(1, '#1e293b');

        ctx.fillStyle = ocularGrad;
        ctx.fillRect(xEye - 4, cy - 48, 22, 96);

        // Rubber Eyecup (Matte Dark)
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(xEye + 18, cy - 54, 18, 108, 6);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Specimen Stage & Glass Slide Carrier
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(xItem - 14, cy + 28, 28, 10);
        // Stage Clip (Chrome)
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xItem - 16, cy + 27);
        ctx.lineTo(xItem + 16, cy + 27);
        ctx.stroke();
        // Glass slide glow
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.fillRect(xItem - 12, cy + 24, 24, 3);
      }

      // --- Optical Lenses (Glass Elements) ---
      // 1. Objective Lens (L1: Convex, short focal length, smaller aperture)
      const l1Radius = 38;
      const l1Grad = ctx.createRadialGradient(xObj - 4, cy - 10, 2, xObj, cy, l1Radius);
      l1Grad.addColorStop(0, 'rgba(224, 242, 254, 0.85)');
      l1Grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.35)');
      l1Grad.addColorStop(1, 'rgba(14, 165, 233, 0.75)');

      ctx.fillStyle = l1Grad;
      ctx.beginPath();
      ctx.ellipse(xObj, cy, 7, l1Radius, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // L1 Label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Objective Lens (L₁)', xObj, cy - l1Radius - 14);
      ctx.font = '10px ui-monospace, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`fo = ${foMicro}mm`, xObj, cy - l1Radius - 3);

      // 2. Eyepiece Lens (L2: Convex, longer focal length, larger aperture)
      const l2Radius = 50;
      const l2Grad = ctx.createRadialGradient(xEye - 5, cy - 12, 3, xEye, cy, l2Radius);
      l2Grad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
      l2Grad.addColorStop(0.6, 'rgba(245, 158, 11, 0.35)');
      l2Grad.addColorStop(1, 'rgba(217, 119, 6, 0.75)');

      ctx.fillStyle = l2Grad;
      ctx.beginPath();
      ctx.ellipse(xEye, cy, 9, l2Radius, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();

      // L2 Label
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('Eyepiece Lens (L₂)', xEye, cy - l2Radius - 14);
      ctx.font = '10px ui-monospace, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`fe = ${feMicro}mm`, xEye, cy - l2Radius - 3);

      // --- Focal Points & Glow Markers ---
      const focalMarkers = [
        { x: xFo, label: 'Fo', col: '#38bdf8' },
        { x: xFoPrime, label: "Fo'", col: '#38bdf8' },
        { x: xFe, label: 'Fe', col: '#fbbf24' },
      ];

      focalMarkers.forEach((m) => {
        if (m.x > 30 && m.x < W - 30) {
          ctx.fillStyle = m.col;
          ctx.beginPath();
          ctx.arc(m.x, cy, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = 'bold 10px ui-monospace, monospace';
          ctx.fillText(m.label, m.x, cy + 16);
        }
      });

      // --- Object Arrow (Tiny Specimen Cell) ---
      const objTopY = cy - itemHeight;
      ctx.strokeStyle = '#22c55e'; // vivid green
      ctx.fillStyle = '#22c55e';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(xItem, cy);
      ctx.lineTo(xItem, objTopY);
      ctx.stroke();
      // Arrowhead pointing up
      ctx.beginPath();
      ctx.moveTo(xItem, objTopY);
      ctx.lineTo(xItem - 4, objTopY + 7);
      ctx.lineTo(xItem + 4, objTopY + 7);
      ctx.closePath();
      ctx.fill();

      // Object label
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('Object (AB)', xItem, objTopY - 7);
      ctx.font = '9px monospace';
      ctx.fillStyle = '#86efac';
      ctx.fillText(`uo=${effectiveUo.toFixed(1)}mm`, xItem, cy + 26);

      // --- Intermediate Image I1 (Real, Inverted, Magnified) ---
      const i1BottomY = cy + intermediateH;
      if (xI1 < xEye + 20) {
        ctx.strokeStyle = '#f59e0b';
        ctx.fillStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(xI1, cy);
        ctx.lineTo(xI1, i1BottomY);
        ctx.stroke();
        // Arrowhead pointing down (inverted!)
        ctx.beginPath();
        ctx.moveTo(xI1, i1BottomY);
        ctx.lineTo(xI1 - 4, i1BottomY - 7);
        ctx.lineTo(xI1 + 4, i1BottomY - 7);
        ctx.closePath();
        ctx.fill();

        // Intermediate image plane glow line
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xI1, cy - 35);
        ctx.lineTo(xI1, cy + 35);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText("Intermediate Image (I₁)", xI1, i1BottomY + 14);
        ctx.font = '9px monospace';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`mo = ${mo.toFixed(1)}×`, xI1, i1BottomY + 26);
      }

      // --- Real-time Ray Diagram Tracing ---
      if (showRays) {
        // Ray 1: From Object Tip parallel to axis, refracts through Fo' to I1 tip
        ctx.strokeStyle = '#38bdf8'; // Cyan
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(xItem, objTopY);
        ctx.lineTo(xObj, objTopY);
        ctx.lineTo(xI1, i1BottomY);
        ctx.stroke();

        // Arrow marker on Ray 1
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo((xItem + xObj) / 2 + 3, objTopY);
        ctx.lineTo((xItem + xObj) / 2 - 3, objTopY - 3);
        ctx.lineTo((xItem + xObj) / 2 - 3, objTopY + 3);
        ctx.fill();

        // Ray 2: From Object Tip through optical center of Objective (undeviated)
        ctx.strokeStyle = '#a855f7'; // Purple
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(xItem, objTopY);
        ctx.lineTo(xObj, cy);
        ctx.lineTo(xI1, i1BottomY);
        ctx.stroke();

        // Ray continuation from I1 through Eyepiece Lens (Magnifying Glass Action)
        if (xI1 < xEye) {
          // Ray A: from I1 tip through Eyepiece Optical Center
          const eyeSlope = i1BottomY / (xI1 - xEye);
          const xRayOut = xEye + 60;
          const yRayOutA = eyeSlope * (xRayOut - xEye) + cy;

          ctx.strokeStyle = '#ec4899'; // Pink/amber
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(xI1, i1BottomY);
          ctx.lineTo(xEye, cy);
          ctx.lineTo(xRayOut, yRayOutA);
          ctx.stroke();

          // Virtual ray backward extension (dashed to near point)
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.65)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(xEye, cy);
          ctx.lineTo(xObj - 40, cy + eyeSlope * (xObj - 40 - xEye));
          ctx.stroke();
          ctx.setLineDash([]);

          // Ray B: from I1 tip parallel to axis to Eyepiece, then diverges through Fe'
          ctx.strokeStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(xI1, i1BottomY);
          ctx.lineTo(xEye, i1BottomY);
          // Refracts away as if coming from Fe
          const feSlope = (i1BottomY - cy) / (xEye - xFe);
          const yRayOutB = cy + feSlope * (xRayOut - xFe);
          ctx.lineTo(xRayOut, yRayOutB);
          ctx.stroke();

          // Virtual ray backward dashed extension
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(xEye, i1BottomY);
          ctx.lineTo(xFe - 60, cy - feSlope * 60);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Observer Eye Graphic on the Right
      const eyeX = xEye + 45;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(eyeX, cy, 14, -Math.PI / 3, Math.PI / 3, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(eyeX, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText('Observer Eye', eyeX - 6, cy + 30);
    }

    // ========================================================================
    // MODE: ASTRONOMICAL TELESCOPE
    // ========================================================================
    else {
      const { angularMagnification } = telescopeOptics;

      // Coordinate scaling for telescope
      const xObj = 180; // Large Objective Lens
      const scaleTele = 1.95;
      const xFo = xObj + foTele * scaleTele;
      const xEye = xObj + tubeLengthTele * scaleTele;
      const xFe = xEye - feTele * scaleTele;

      // Intermediate image formed at focal point Fo:
      const xI1 = xFo;
      const theta = 0.055; // incident ray angle in radians (~3.1 degrees)
      const intermediateH = foTele * scaleTele * Math.tan(theta);

      // --- 3D Cutaway Astronomical Brass Telescope ---
      if (show3DCutaway) {
        // Main Outer Brass Optical Tube (Large aperture)
        const mainTubeGrad = ctx.createLinearGradient(0, cy - 80, 0, cy + 80);
        mainTubeGrad.addColorStop(0, '#78350f');
        mainTubeGrad.addColorStop(0.2, '#d97706');
        mainTubeGrad.addColorStop(0.45, '#fef08a');
        mainTubeGrad.addColorStop(0.7, '#b45309');
        mainTubeGrad.addColorStop(1, '#451a03');

        // Main Barrel
        ctx.fillStyle = mainTubeGrad;
        ctx.beginPath();
        ctx.roundRect(xObj - 30, cy - 64, 90, 128, 6);
        ctx.fill();

        // Sliding Brass Drawtube (moves with tubeLength)
        const drawtubeStart = xObj + 50;
        const drawtubeW = Math.max(30, xEye - drawtubeStart + 18);
        const drawGrad = ctx.createLinearGradient(0, cy - 50, 0, cy + 50);
        drawGrad.addColorStop(0, 'rgba(120, 53, 15, 0.4)');
        drawGrad.addColorStop(0.3, 'rgba(217, 119, 6, 0.3)');
        drawGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.2)');
        drawGrad.addColorStop(1, 'rgba(69, 26, 3, 0.4)');

        ctx.fillStyle = drawGrad;
        ctx.fillRect(drawtubeStart, cy - 46, drawtubeW, 92);

        // Cutaway Window to inspect interior ray convergence
        ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
        ctx.fillRect(xObj + 52, cy - 40, Math.max(10, xEye - xObj - 56), 80);
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(xObj + 52, cy - 40, Math.max(10, xEye - xObj - 56), 80);

        // Focusing Thumbwheel
        const knobX = xEye - 35;
        const knobY = cy + 52;
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(knobX, knobY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Mechanical Mount Struts to Bench
        ctx.fillStyle = '#334155';
        ctx.fillRect(xObj - 10, cy + 64, 26, benchY - (cy + 64));
        ctx.fillRect(xEye - 10, cy + 46, 22, benchY - (cy + 46));

        // Eyepiece Ocular Ring
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(xEye + 14, cy - 42, 18, 84, 5);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // --- Optical Lenses (Glass Elements) ---
      // 1. Objective Lens (L1: Large aperture, large focal length)
      const l1Radius = 58;
      const l1Grad = ctx.createRadialGradient(xObj - 6, cy - 15, 3, xObj, cy, l1Radius);
      l1Grad.addColorStop(0, 'rgba(224, 242, 254, 0.9)');
      l1Grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.4)');
      l1Grad.addColorStop(1, 'rgba(14, 165, 233, 0.8)');

      ctx.fillStyle = l1Grad;
      ctx.beginPath();
      ctx.ellipse(xObj, cy, 10, l1Radius, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // L1 Label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Objective Lens (L₁)', xObj, cy - l1Radius - 14);
      ctx.font = '10px ui-monospace, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`fo = ${foTele}mm (Large Aperture)`, xObj, cy - l1Radius - 3);

      // 2. Eyepiece Lens (L2: Small aperture, short focal length)
      const l2Radius = 36;
      const l2Grad = ctx.createRadialGradient(xEye - 4, cy - 8, 2, xEye, cy, l2Radius);
      l2Grad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
      l2Grad.addColorStop(0.6, 'rgba(245, 158, 11, 0.35)');
      l2Grad.addColorStop(1, 'rgba(217, 119, 6, 0.75)');

      ctx.fillStyle = l2Grad;
      ctx.beginPath();
      ctx.ellipse(xEye, cy, 7, l2Radius, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();

      // L2 Label
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('Eyepiece Lens (L₂)', xEye, cy - l2Radius - 14);
      ctx.font = '10px ui-monospace, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`fe = ${feTele}mm`, xEye, cy - l2Radius - 3);

      // --- Focal Points & Common Focus Plane ---
      const isCoincident = Math.abs(xFo - xFe) < 5;

      if (isCoincident) {
        // Special highlighted common focal plane in Normal Adjustment
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(xFo, cy, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(xFo, cy - 45);
        ctx.lineTo(xFo, cy + 45);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('Common Focal Plane (Fo & Fe)', xFo, cy - 50);
      } else {
        // Distinct Fo and Fe
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(xFo, cy, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('Fo', xFo, cy + 18);

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(xFe, cy, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('Fe', xFe, cy + 18);
      }

      // --- Intermediate Image I1 (Real, Inverted, Diminished at Fo) ---
      const i1Y = cy + intermediateH;
      ctx.strokeStyle = '#f59e0b';
      ctx.fillStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(xFo, cy);
      ctx.lineTo(xFo, i1Y);
      ctx.stroke();
      // Arrowhead pointing down
      ctx.beginPath();
      ctx.moveTo(xFo, i1Y);
      ctx.lineTo(xFo - 4, i1Y - 6);
      ctx.lineTo(xFo + 4, i1Y - 6);
      ctx.closePath();
      ctx.fill();

      // Label
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('Intermediate Image (I₁ at Fo)', xFo, i1Y + 14);

      // --- Real-time Telescope Ray Tracing ---
      if (showRays) {
        // Incoming parallel rays from distant celestial body (at angle theta)
        const rayYs = [cy - 38, cy, cy + 38];
        const colors = ['#38bdf8', '#818cf8', '#38bdf8'];

        rayYs.forEach((yIn, idx) => {
          const xStart = 35;
          const yStart = yIn - (xObj - xStart) * Math.tan(theta);

          ctx.strokeStyle = colors[idx];
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(xStart, yStart);
          ctx.lineTo(xObj, yIn);
          // Converge to Intermediate Image tip I1
          ctx.lineTo(xFo, i1Y);
          ctx.stroke();

          // Arrowhead showing light direction
          ctx.fillStyle = colors[idx];
          ctx.beginPath();
          ctx.moveTo(100, yIn - (xObj - 100) * Math.tan(theta));
          ctx.lineTo(95, yIn - (xObj - 100) * Math.tan(theta) - 3);
          ctx.lineTo(95, yIn - (xObj - 100) * Math.tan(theta) + 3);
          ctx.fill();

          // Eyepiece refraction: from I1 tip through eyepiece lens
          if (xFo < xEye) {
            const eyeY = cy + (idx - 1) * 16;
            ctx.beginPath();
            ctx.moveTo(xFo, i1Y);
            ctx.lineTo(xEye, eyeY);

            // In normal adjustment (L = fo + fe), rays emerge parallel to each other at angle beta!
            const xExit = xEye + 65;
            let yExit;
            if (isCoincident) {
              // Collimated parallel beam exiting at magnified angle beta = theta * M
              const beta = theta * angularMagnification;
              yExit = eyeY - 65 * Math.tan(beta);
            } else {
              // Diverging or converging out of focus
              const defocusSlope = (eyeY - i1Y) / (xEye - xFo) - 0.1;
              yExit = eyeY + 65 * defocusSlope;
            }

            ctx.lineTo(xExit, yExit);
            ctx.stroke();
          }
        });

        // Parallel Ray Bundle Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px sans-serif';
        ctx.fillText('Parallel rays from star/planet', 35, cy - 58);
      }

      // Observer Eye Graphic on the Right
      const eyeX = xEye + 45;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(eyeX, cy, 14, -Math.PI / 3, Math.PI / 3, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(eyeX, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText('Relaxed Eye (∞)', eyeX - 12, cy + 30);
    }
  }, [
    mode,
    show3DCutaway,
    showRays,
    foMicro,
    feMicro,
    uoMicro,
    tubeLengthMicro,
    microscopeOptics,
    foTele,
    feTele,
    tubeLengthTele,
    telescopeOptics,
  ]);

  // Redraw when state updates
  useEffect(() => {
    drawScene();
    const handleResize = () => drawScene();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawScene]);

  // Current optical values for badges & metrics
  const isMicroscope = mode === 'microscope';
  const currentSharp = isMicroscope ? microscopeOptics.isSharp : telescopeOptics.isSharp;
  const currentBlur = isMicroscope ? microscopeOptics.blurPx : telescopeOptics.blurPx;
  const currentFocusScore = isMicroscope ? microscopeOptics.focusScore : telescopeOptics.focusScore;
  const currentMagnification = isMicroscope
    ? microscopeOptics.totalMagnification
    : telescopeOptics.angularMagnification;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 font-sans text-slate-100">
      {/* ==================================================================== */}
      {/* 1. HEADER BANNER & MODE SELECTOR */}
      {/* ==================================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                KCSE Form 4 Physics · Topic 1: Thin Lenses & Optical Instruments
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              {isMicroscope ? (
                <>
                  <Microscope className="w-6 h-6 text-cyan-400" />
                  Compound Microscope: Dual-Lens Magnification
                </>
              ) : (
                <>
                  <Eye className="w-6 h-6 text-amber-400" />
                  Astronomical Telescope: Normal Adjustment & Infinity Focus
                </>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {isMicroscope
                ? 'Investigate how a short-focal-length objective (fo) forms a real, magnified intermediate image inside Fe, which the eyepiece magnifies into a massive virtual image at the near point (D = 25 cm).'
                : 'Explore parallel starlight refraction through a large objective lens (fo) to common focal point Fo/Fe, emerging parallel from the eyepiece (L = fo + fe) for viewing at infinity.'}
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 self-start lg:self-center shrink-0">
            <button
              onClick={() => {
                setMode('microscope');
                applyMicroscopePreset(MICROSCOPE_PRESETS[0]);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isMicroscope
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Microscope className="w-4 h-4" />
              Compound Microscope
            </button>
            <button
              onClick={() => {
                setMode('telescope');
                applyTelescopePreset(TELESCOPE_PRESETS[0]);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isMicroscope
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40 border border-amber-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Eye className="w-4 h-4" />
              Astronomical Telescope
            </button>
          </div>
        </div>

        {/* Status Badges Row */}
        <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-4 border-t border-slate-800/80 text-xs">
          {/* Focus Quality Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold border transition-colors ${
              currentSharp
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs shadow-emerald-500/20'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {currentSharp ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {isMicroscope ? 'Specimen in Sharp Focus (Near Point)' : 'Normal Adjustment (Sharp at ∞)'}
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 text-amber-400" />
                Blurry / Out of Focus (Tune Tube Length)
              </>
            )}
          </span>

          {/* Intermediate Image Nature */}
          <span className="bg-slate-800/80 text-slate-300 border border-slate-700/60 px-3 py-1 rounded-full font-mono">
            {isMicroscope ? "I₁: Real, Inverted & Magnified" : "I₁: Real, Inverted & Diminished at Fo"}
          </span>

          {/* Final Image Nature */}
          <span className="bg-slate-800/80 text-slate-300 border border-slate-700/60 px-3 py-1 rounded-full font-mono">
            {isMicroscope ? 'I₂: Virtual, Inverted at D=25cm' : 'I₂: Virtual, Inverted at Infinity (∞)'}
          </span>

          {/* Current Total Magnification */}
          <span className="bg-purple-950/80 text-purple-200 border border-purple-500/30 px-3 py-1 rounded-full font-bold ml-auto font-mono">
            Total M: {currentMagnification.toFixed(1)}×
          </span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. MAIN INTERACTIVE STAGE & EYEPIECE VIEWPORT */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* Optical Bench & Ray Diagram Stage (8 Cols) */}
        <div className="xl:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between relative">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                Pseudo-3D Optical Bench & Ray Overlay
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRays((v) => !v)}
                className={`px-3 py-1 text-xs rounded-lg font-bold border transition-all cursor-pointer ${
                  showRays
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-600/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {showRays ? '✓ Rays On' : 'Rays Off'}
              </button>
              <button
                onClick={() => setShow3DCutaway((v) => !v)}
                className={`px-3 py-1 text-xs rounded-lg font-bold border transition-all cursor-pointer ${
                  show3DCutaway
                    ? 'bg-amber-950 text-amber-300 border-amber-600/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {show3DCutaway ? '✓ 3D Cutaway' : 'Flat Schematic'}
              </button>
            </div>
          </div>

          {/* Interactive Ray Tracing Canvas */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/80 shadow-inner">
            <canvas
              ref={canvasRef}
              width={920}
              height={360}
              className="w-full h-auto block select-none cursor-crosshair"
            />
          </div>

          {/* Ray Color Legend & Quick Explanations */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-cyan-400 rounded-full" />
                Objective Rays (L₁)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-amber-400 rounded-full" />
                Eyepiece Rays (L₂)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 border-t border-dashed border-pink-400" />
                Virtual Ray Extensions
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {isMicroscope ? 'L = Distance between L₁ and L₂' : 'Normal Adjustment: L = fo + fe'}
            </div>
          </div>
        </div>

        {/* "Look Through the Lens!" Eyepiece Reticle View (4 Cols) */}
        <div className="xl:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Observer Eyepiece View
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                FOV: {currentMagnification.toFixed(0)}×
              </span>
            </div>

            {/* Circular Ocular Bezel Viewport */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto rounded-full p-2 bg-gradient-to-b from-slate-700 via-amber-900/60 to-slate-900 shadow-2xl border-4 border-amber-600/30 flex items-center justify-center overflow-hidden">
              {/* Internal Glass Vignette / Diaphragm */}
              <div
                className="relative w-full h-full rounded-full bg-slate-950 overflow-hidden flex items-center justify-center transition-all duration-300"
                style={{
                  boxShadow: 'inset 0 0 45px rgba(0,0,0,0.95)',
                }}
              >
                {/* 1. Microscope Specimen: High-Resolution Onion Epidermal Cells */}
                {isMicroscope && (
                  <div
                    className="w-full h-full relative transition-all duration-150"
                    style={{
                      filter: `blur(${currentBlur.toFixed(1)}px)`,
                      transform: `scale(${Math.min(2.0, 0.7 + currentMagnification / 60)})`,
                    }}
                  >
                    {/* Biological Cell Wall Mesh & Cytoplasmic Staining */}
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 200 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Cell wall lattice (onion epidermal cell pattern) */}
                      <rect width="200" height="200" fill="#064e3b" fillOpacity="0.45" />

                      {/* Cell row 1 */}
                      <path
                        d="M 10,25 Q 60,20 110,24 Q 160,28 210,22"
                        stroke="#86efac"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M -10,65 Q 50,60 110,64 Q 170,68 220,62"
                        stroke="#86efac"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M 10,105 Q 60,102 110,106 Q 160,108 210,102"
                        stroke="#86efac"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M -10,145 Q 50,142 110,146 Q 170,148 220,144"
                        stroke="#86efac"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M 10,185 Q 60,182 110,186 Q 160,188 210,182"
                        stroke="#86efac"
                        strokeWidth="2.5"
                      />

                      {/* Cross walls between cells */}
                      <path d="M 60,22 L 58,63" stroke="#86efac" strokeWidth="2" />
                      <path d="M 130,24 L 132,64" stroke="#86efac" strokeWidth="2" />
                      <path d="M 95,64 L 92,104" stroke="#86efac" strokeWidth="2" />
                      <path d="M 165,66 L 167,106" stroke="#86efac" strokeWidth="2" />
                      <path d="M 50,104 L 52,144" stroke="#86efac" strokeWidth="2" />
                      <path d="M 125,106 L 123,146" stroke="#86efac" strokeWidth="2" />
                      <path d="M 85,145 L 83,185" stroke="#86efac" strokeWidth="2" />
                      <path d="M 155,147 L 157,187" stroke="#86efac" strokeWidth="2" />

                      {/* Nuclei (Iodine stain dark purple/amber) */}
                      <circle cx="95" cy="42" r="7.5" fill="#7c2d12" stroke="#fde047" strokeWidth="1" />
                      <circle cx="96" cy="43" r="2.5" fill="#fde047" />

                      <circle cx="130" cy="85" r="8" fill="#7c2d12" stroke="#fde047" strokeWidth="1" />
                      <circle cx="131" cy="86" r="2.5" fill="#fde047" />

                      <circle cx="85" cy="125" r="7.5" fill="#7c2d12" stroke="#fde047" strokeWidth="1" />
                      <circle cx="86" cy="126" r="2.5" fill="#fde047" />

                      {/* Chloroplast / Granule Specks */}
                      {[
                        [70, 35],
                        [80, 48],
                        [115, 38],
                        [145, 52],
                        [110, 78],
                        [150, 92],
                        [65, 120],
                        [72, 135],
                        [100, 130],
                        [140, 125],
                      ].map(([gx, gy], gi) => (
                        <circle key={gi} cx={gx} cy={gy} r="1.8" fill="#4ade80" />
                      ))}
                    </svg>
                  </div>
                )}

                {/* 2. Telescope View: Moon Craters or Saturn Planetary System */}
                {!isMicroscope && celestialTarget === 'moon' && (
                  <div
                    className="w-full h-full relative flex items-center justify-center transition-all duration-150"
                    style={{
                      filter: `blur(${currentBlur.toFixed(1)}px)`,
                      transform: `scale(${Math.min(1.8, 0.7 + currentMagnification / 8)})`,
                    }}
                  >
                    {/* Deep Space Moon Canvas */}
                    <svg className="w-48 h-48" viewBox="0 0 160 160" fill="none">
                      {/* Deep starry background */}
                      <circle cx="12" cy="24" r="0.8" fill="#ffffff" />
                      <circle cx="140" cy="35" r="0.8" fill="#ffffff" />
                      <circle cx="130" cy="130" r="0.9" fill="#ffffff" />
                      <circle cx="28" cy="140" r="0.7" fill="#ffffff" />

                      {/* Moon Body */}
                      <circle cx="80" cy="80" r="62" fill="#cbd5e1" />

                      {/* Lunar Maria (Dark Basalt Plains) */}
                      <path
                        d="M 45,60 Q 60,40 85,55 Q 105,70 85,90 Q 65,85 45,60 Z"
                        fill="#64748b"
                        fillOpacity="0.75"
                      />
                      <path
                        d="M 90,80 Q 115,75 125,95 Q 110,120 85,110 Q 75,95 90,80 Z"
                        fill="#64748b"
                        fillOpacity="0.75"
                      />

                      {/* Tycho Crater & Impact Rays */}
                      <circle cx="80" cy="115" r="7" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
                      <circle cx="80" cy="115" r="2.5" fill="#334155" />
                      {/* Rays */}
                      <line x1="80" y1="115" x2="40" y2="85" stroke="#f8fafc" strokeWidth="0.8" strokeOpacity="0.7" />
                      <line x1="80" y1="115" x2="120" y2="90" stroke="#f8fafc" strokeWidth="0.8" strokeOpacity="0.7" />
                      <line x1="80" y1="115" x2="80" y2="50" stroke="#f8fafc" strokeWidth="0.8" strokeOpacity="0.7" />

                      {/* Copernicus Crater */}
                      <circle cx="55" cy="72" r="5.5" fill="#f1f5f9" stroke="#475569" strokeWidth="1.2" />
                      <circle cx="55" cy="72" r="2" fill="#1e293b" />
                    </svg>
                  </div>
                )}

                {!isMicroscope && celestialTarget === 'saturn' && (
                  <div
                    className="w-full h-full relative flex items-center justify-center transition-all duration-150"
                    style={{
                      filter: `blur(${currentBlur.toFixed(1)}px)`,
                      transform: `scale(${Math.min(1.8, 0.65 + currentMagnification / 9)})`,
                    }}
                  >
                    {/* Saturn with Rings */}
                    <svg className="w-52 h-52" viewBox="0 0 180 180" fill="none">
                      {/* Background stars */}
                      <circle cx="20" cy="30" r="0.8" fill="#ffffff" />
                      <circle cx="160" cy="45" r="0.9" fill="#ffffff" />
                      <circle cx="150" cy="140" r="0.8" fill="#ffffff" />

                      {/* Back section of rings */}
                      <ellipse
                        cx="90"
                        cy="90"
                        rx="68"
                        ry="22"
                        fill="none"
                        stroke="#fef08a"
                        strokeWidth="7"
                        strokeOpacity="0.8"
                        transform="rotate(-22 90 90)"
                      />
                      {/* Cassini Division */}
                      <ellipse
                        cx="90"
                        cy="90"
                        rx="62"
                        ry="20"
                        fill="none"
                        stroke="#0f172a"
                        strokeWidth="1.5"
                        transform="rotate(-22 90 90)"
                      />

                      {/* Saturn Body */}
                      <circle cx="90" cy="90" r="28" fill="#fde047" />
                      {/* Equatorial atmospheric bands */}
                      <path
                        d="M 64,88 Q 90,98 116,88"
                        stroke="#d97706"
                        strokeWidth="3.5"
                        strokeOpacity="0.6"
                      />
                      <path
                        d="M 66,82 Q 90,92 114,82"
                        stroke="#b45309"
                        strokeWidth="2.5"
                        strokeOpacity="0.6"
                      />

                      {/* Front section of rings */}
                      <ellipse
                        cx="90"
                        cy="90"
                        rx="68"
                        ry="22"
                        fill="none"
                        stroke="#fef08a"
                        strokeWidth="7"
                        strokeOpacity="0.8"
                        strokeDasharray="140 160"
                        strokeDashoffset="-20"
                        transform="rotate(-22 90 90)"
                      />
                    </svg>
                  </div>
                )}

                {/* Eyepiece Crosshair & Metric Scale Reticle */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* Subtle crosshairs */}
                  <div className="w-full h-px bg-cyan-400/25 absolute top-1/2 left-0 -translate-y-1/2" />
                  <div className="h-full w-px bg-cyan-400/25 absolute left-1/2 top-0 -translate-x-1/2" />

                  {/* Tick markings on crosshair */}
                  <div className="w-32 h-2 flex justify-between absolute items-center">
                    {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((tk) => (
                      <div
                        key={tk}
                        className={`bg-cyan-400/50 ${tk === 0 ? 'h-3 w-0.5' : 'h-1.5 w-0.5'}`}
                      />
                    ))}
                  </div>

                  {/* Specular glass reflection arc */}
                  <div className="absolute top-2 left-6 w-32 h-14 rounded-full border-t-2 border-white/20 -rotate-35 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Telescope Target Picker */}
            {!isMicroscope && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <button
                  onClick={() => setCelestialTarget('moon')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    celestialTarget === 'moon'
                      ? 'bg-amber-950 text-amber-300 border-amber-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  🌕 Lunar Craters
                </button>
                <button
                  onClick={() => setCelestialTarget('saturn')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    celestialTarget === 'saturn'
                      ? 'bg-amber-950 text-amber-300 border-amber-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  🪐 Saturn Rings
                </button>
              </div>
            )}

            {/* Focus Accuracy Meter */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1 font-mono">
                <span className="text-slate-400">Focus Alignment:</span>
                <span
                  className={`font-bold ${
                    currentSharp ? 'text-emerald-400' : currentFocusScore > 70 ? 'text-amber-400' : 'text-rose-400'
                  }`}
                >
                  {currentFocusScore}% {currentSharp ? '(Sharp)' : '(Blurry)'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 ${
                    currentSharp ? 'bg-emerald-500' : currentFocusScore > 70 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${currentFocusScore}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 p-3 bg-slate-950/70 rounded-2xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <Info className="w-3.5 h-3.5 text-cyan-400 inline mr-1 -mt-0.5" />
            {isMicroscope
              ? 'Rotate the fine-focus knob to adjust tube length (L) until the cell nuclei and chloroplasts become crystal clear.'
              : 'Adjust the drawtube length (L) until it matches fo + fe (Normal Adjustment), forming parallel rays for comfortable viewing at infinity.'}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. INTERACTIVE CONTROLS & FORMULA COMPARISON BAR */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Presets & Manual Slider Controls (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                1. Instrument Presets
              </span>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Quick Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {(isMicroscope ? MICROSCOPE_PRESETS : TELESCOPE_PRESETS).map((p) => {
                const isActive = activePresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => (isMicroscope ? applyMicroscopePreset(p) : applyTelescopePreset(p))}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? isMicroscope
                          ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-md shadow-cyan-950/50'
                          : 'bg-amber-950/70 border-amber-500 text-white shadow-md shadow-amber-950/50'
                        : 'bg-slate-950/50 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold leading-snug">{p.label}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md shrink-0 ${
                          isActive
                            ? isMicroscope
                              ? 'bg-cyan-600 text-white'
                              : 'bg-amber-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {p.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-normal">{p.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Interactive Sliders */}
            <div className="pt-3 border-t border-slate-800 space-y-3.5">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                2. Fine-Tuning Focus & Lens Parameters
              </div>

              {isMicroscope ? (
                <>
                  {/* Microscope Tube Length Slider (Focus Knob) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">
                        Tube Length / Separation (L) — Focusing Knob:
                      </span>
                      <span className="font-mono text-cyan-300 font-bold">{tubeLengthMicro.toFixed(1)} mm</span>
                    </div>
                    <input
                      type="range"
                      min="135"
                      max="195"
                      step="0.5"
                      value={tubeLengthMicro}
                      onChange={(e) => {
                        setTubeLengthMicro(parseFloat(e.target.value));
                        setActivePresetId('custom');
                      }}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>135 mm</span>
                      <span className="text-emerald-400 font-bold">
                        Ideal: {microscopeOptics.idealTubeLength.toFixed(1)} mm
                      </span>
                      <span>195 mm</span>
                    </div>
                  </div>

                  {/* Object Distance uo */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">
                        Object Distance (uo) [Must satisfy: fo &lt; uo &lt; 2fo]:
                      </span>
                      <span className="font-mono text-emerald-300 font-bold">{uoMicro.toFixed(1)} mm</span>
                    </div>
                    <input
                      type="range"
                      min={foMicro + 0.5}
                      max={foMicro * 2 - 0.5}
                      step="0.2"
                      value={uoMicro}
                      onChange={(e) => {
                        setUoMicro(parseFloat(e.target.value));
                        setActivePresetId('custom');
                      }}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Objective & Eyepiece focal lengths */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Objective fo:</span>
                        <span className="font-mono text-cyan-300">{foMicro} mm</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="22"
                        value={foMicro}
                        onChange={(e) => {
                          const n = parseInt(e.target.value, 10);
                          setFoMicro(n);
                          if (uoMicro <= n) setUoMicro(n + 1.5);
                          setActivePresetId('custom');
                        }}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Eyepiece fe:</span>
                        <span className="font-mono text-amber-300">{feMicro} mm</span>
                      </div>
                      <input
                        type="range"
                        min="35"
                        max="65"
                        value={feMicro}
                        onChange={(e) => {
                          setFeMicro(parseInt(e.target.value, 10));
                          setActivePresetId('custom');
                        }}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Telescope Tube Length Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">
                        Tube Length / Separation (L) — Focusing Slider:
                      </span>
                      <span className="font-mono text-amber-300 font-bold">{tubeLengthTele.toFixed(1)} mm</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="285"
                      step="0.5"
                      value={tubeLengthTele}
                      onChange={(e) => {
                        setTubeLengthTele(parseFloat(e.target.value));
                        setActivePresetId('custom');
                      }}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>200 mm</span>
                      <span className="text-emerald-400 font-bold">
                        Normal Adjustment (fo + fe): {telescopeOptics.idealTubeLength} mm
                      </span>
                      <span>285 mm</span>
                    </div>
                  </div>

                  {/* Objective fo & Eyepiece fe */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Objective fo (Long):</span>
                        <span className="font-mono text-cyan-300">{foTele} mm</span>
                      </div>
                      <input
                        type="range"
                        min="160"
                        max="240"
                        step="10"
                        value={foTele}
                        onChange={(e) => {
                          setFoTele(parseInt(e.target.value, 10));
                          setActivePresetId('custom');
                        }}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Eyepiece fe (Short):</span>
                        <span className="font-mono text-amber-300">{feTele} mm</span>
                      </div>
                      <input
                        type="range"
                        min="25"
                        max="50"
                        step="5"
                        value={feTele}
                        onChange={(e) => {
                          setFeTele(parseInt(e.target.value, 10));
                          setActivePresetId('custom');
                        }}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Live Mathematical Optics & Quantitative Results (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              3. KCSE Physics Quantitative Metrics
            </div>

            {isMicroscope ? (
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase block font-sans">
                    Objective Image Distance (vo)
                  </span>
                  <span className="font-bold text-cyan-400 text-sm">
                    {microscopeOptics.vo.toFixed(1)} mm
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    vo = (fo · uo)/(uo - fo)
                  </span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase block font-sans">
                    Objective Magnification (mo)
                  </span>
                  <span className="font-bold text-cyan-300 text-sm">
                    {microscopeOptics.mo.toFixed(2)}×
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">mo = vo / uo</span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase block font-sans">
                    Eyepiece Object Distance (ue)
                  </span>
                  <span
                    className={`font-bold text-sm ${
                      microscopeOptics.ue < feMicro ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    {microscopeOptics.ue.toFixed(1)} mm
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    ue = L - vo {microscopeOptics.ue < feMicro ? '(Inside Fe ✓)' : '(Outside Fe ✗)'}
                  </span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase block font-sans">
                    Eyepiece Power (me)
                  </span>
                  <span className="font-bold text-amber-300 text-sm">
                    {microscopeOptics.meStandard.toFixed(1)}×
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">me = D / fe (D=250mm)</span>
                </div>

                {/* Total Magnification Highlight */}
                <div className="col-span-2 p-3 bg-purple-950/50 border border-purple-800/60 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-purple-300 uppercase block font-sans font-bold">
                      Total Angular Magnification (M = mo × me)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {microscopeOptics.mo.toFixed(1)} × {microscopeOptics.meStandard.toFixed(1)} =
                    </span>
                  </div>
                  <span className="text-xl font-black text-purple-300 font-mono">
                    {microscopeOptics.totalMagnification.toFixed(1)}×
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase block font-sans">
                    Objective Focal Length (fo)
                  </span>
                  <span className="font-bold text-cyan-400 text-sm">{foTele} mm</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Forms I₁ at Fo</span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase block font-sans">
                    Eyepiece Focal Length (fe)
                  </span>
                  <span className="font-bold text-amber-300 text-sm">{feTele} mm</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Refracts to infinity</span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase block font-sans">
                    Current Separation (L)
                  </span>
                  <span className="font-bold text-slate-200 text-sm">
                    {tubeLengthTele.toFixed(1)} mm
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Drawtube length</span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase block font-sans">
                    Normal Adjustment Length
                  </span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {telescopeOptics.idealTubeLength} mm
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">L = fo + fe</span>
                </div>

                {/* Total Magnification Highlight */}
                <div className="col-span-2 p-3 bg-purple-950/50 border border-purple-800/60 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-purple-300 uppercase block font-sans font-bold">
                      Angular Magnification in Normal Adjustment (M = fo / fe)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {foTele} mm / {feTele} mm =
                    </span>
                  </div>
                  <span className="text-xl font-black text-purple-300 font-mono">
                    {telescopeOptics.angularMagnification.toFixed(1)}×
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick KCSE Key Insight Note */}
          <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-2xl text-[11px] text-slate-300 leading-relaxed font-medium">
            <span className="text-amber-400 font-bold mr-1">KCSE Physics Rule:</span>
            {isMicroscope ? (
              <span>
                To produce a magnified real intermediate image within a manageable tube length, the microscope objective must have a{' '}
                <strong className="text-white">very short focal length</strong> (fo) and the specimen must be placed just beyond Fo (fo &lt; uo &lt; 2fo).
              </span>
            ) : (
              <span>
                In normal adjustment of an astronomical telescope, the separation between lenses is{' '}
                <strong className="text-white">L = fo + fe</strong>. The common focal plane allows parallel rays to emerge, enabling relaxed observation at infinity with zero eye strain.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. INTERACTIVE KCSE EXAM PRACTICE SECTION */}
      {/* ==================================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                KCSE Form 4 Exam Practice: Optical Instruments Checkpoint
              </h3>
              <p className="text-xs text-slate-400">
                Test your mastery with genuine Kenya Certificate of Secondary Education Form 4 exam questions.
              </p>
            </div>
          </div>

          {/* Question Switcher Tabs */}
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            {KCSE_QUESTIONS.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isSelected = selectedQuestionIdx === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedQuestionIdx(idx);
                    setShowQuestionFeedback(userAnswers[q.id] !== undefined);
                  }}
                  className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                      : isAnswered
                      ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Question Card */}
        {(() => {
          const currentQ = KCSE_QUESTIONS[selectedQuestionIdx];
          const answeredOpt = userAnswers[currentQ.id];
          const isCorrect = currentQ.options.find((o) => o.id === answeredOpt)?.correct;

          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                <span>{currentQ.title}</span>
              </div>
              <p className="text-sm font-medium text-slate-100 leading-relaxed">
                {currentQ.prompt}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {currentQ.options.map((opt) => {
                  const isChosen = answeredOpt === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswerOption(currentQ.id, opt.id)}
                      className={`p-3.5 rounded-2xl text-left text-xs transition-all border cursor-pointer flex items-start gap-2.5 ${
                        isChosen
                          ? opt.correct
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-md'
                            : 'bg-rose-950/60 border-rose-500 text-rose-100 shadow-md'
                          : showQuestionFeedback && opt.correct
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                          : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono font-bold text-[11px] shrink-0 ${
                          isChosen
                            ? opt.correct
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-rose-500 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="leading-relaxed font-normal">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback & KCSE Marking Scheme Explanation */}
              {showQuestionFeedback && answeredOpt && (
                <div
                  className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 animate-fadeIn ${
                    isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Correct! Outstanding physics application.</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Incorrect. Review the KCSE Marking Scheme below:</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-300 font-sans">{currentQ.explanation}</p>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
