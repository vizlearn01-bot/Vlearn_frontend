import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  Award,
  BookOpen,
  Compass,
  Layers,
  ArrowRight,
  ChevronRight,
  Activity,
  Sliders,
  RotateCw
} from 'lucide-react';

// Anatomical Regions and Pins for the Human Ear
const EAR_ANATOMY_REGIONS = [
  {
    id: 'pinna',
    part: 'Outer Ear',
    name: 'Pinna (Auricle)',
    x: 90,
    y: 180,
    function:
      'Cartilaginous flap that collects and funnels airborne acoustic sound waves into the external auditory meatus.',
    kcseKey: 'Funnels sound waves; helps in localizing source of sound.'
  },
  {
    id: 'auditory_canal',
    part: 'Outer Ear',
    name: 'Auditory Canal (Meatus)',
    x: 180,
    y: 200,
    function:
      'Tube lined with ceruminous glands producing earwax (cerumen) and hairs to trap foreign dust and pathogens.',
    kcseKey: 'Directs sound to eardrum; wax prevents entry of foreign bodies/insects.'
  },
  {
    id: 'tympanic_membrane',
    part: 'Middle Ear',
    name: 'Tympanic Membrane (Eardrum)',
    x: 270,
    y: 200,
    function:
      'Taut circular membrane vibrating synchronously with compressed air waves; converts airborne acoustic energy to mechanical vibrations.',
    kcseKey: 'Converts air vibrations into mechanical vibrations of malleus.'
  },
  {
    id: 'malleus',
    part: 'Middle Ear',
    name: 'Malleus (Hammer)',
    x: 305,
    y: 185,
    function:
      'First auditory ossicle firmly attached to the inner surface of the tympanum. Transmits displacement to incus.',
    kcseKey: 'First lever ossicle; mechanical advantage amplification.'
  },
  {
    id: 'incus',
    part: 'Middle Ear',
    name: 'Incus (Anvil)',
    x: 335,
    y: 175,
    function:
      'Intermediate ossicle acting as a fulcrum pivot, linking the malleus motion directly to the stapes.',
    kcseKey: 'Intermediate bone multiplying force applied.'
  },
  {
    id: 'stapes',
    part: 'Middle Ear',
    name: 'Stapes (Stirrup)',
    x: 365,
    y: 190,
    function:
      'Smallest bone in the human body with a footplate seated on the flexible Oval Window. Concentrates force onto small area.',
    kcseKey: 'Applies amplified hydraulic pressure onto oval window (~20x amplification).'
  },
  {
    id: 'eustachian_tube',
    part: 'Middle Ear',
    name: 'Eustachian Tube',
    x: 320,
    y: 290,
    function:
      'Slender duct connecting middle ear cavity to the nasopharynx. Equalizes atmospheric pressure on both sides of tympanum.',
    kcseKey: 'Equalizes air pressure between middle ear and atmosphere to prevent eardrum rupture.'
  },
  {
    id: 'cochlea',
    part: 'Inner Ear',
    name: 'Cochlea & Organ of Corti',
    x: 480,
    y: 220,
    function:
      'Spiral snail-like organ with perilymph/endolymph chambers and basilar membrane. Sensory hair cells transduce fluid shear into nerve impulses.',
    kcseKey: 'Sensory organ for hearing; hair cells generate sensory impulses.'
  },
  {
    id: 'semicircular_canals',
    part: 'Inner Ear',
    name: 'Semicircular Canals (3 Planes)',
    x: 430,
    y: 110,
    function:
      'Three fluid-filled loops positioned at right angles (sagittal, frontal, horizontal). Ampullae contain cristae to detect angular rotation.',
    kcseKey: 'Detects rotational/dynamic body balance and angular acceleration.'
  },
  {
    id: 'utricle_saccule',
    part: 'Inner Ear',
    name: 'Utricle and Saccule (Vestibule)',
    x: 420,
    y: 170,
    function:
      'Contains maculae with gelatinous otolith membrane and calcium carbonate granules. Detects linear acceleration and head tilt relative to gravity.',
    kcseKey: 'Maintains static balance and detects orientation with respect to gravity.'
  },
  {
    id: 'auditory_nerve',
    part: 'Inner Ear',
    name: 'Auditory Nerve (Vestibulocochlear - Cranial VIII)',
    x: 570,
    y: 160,
    function:
      'Transmits acoustic signals from the cochlea and equilibrium signals from the vestibular apparatus to the brain.',
    kcseKey: 'Relays nerve impulses to temporal lobe (hearing) and cerebellum (balance).'
  }
];

// KCSE Exam Form 4 Practice Questions
const KCSE_EAR_QUESTIONS = [
  {
    id: 'q1',
    question:
      'How do the auditory ossicles (malleus, incus, stapes) and the difference in area between the tympanic membrane and oval window enhance hearing?',
    options: [
      { text: 'They filter out high-frequency sound waves to prevent acoustic shock', correct: false },
      { text: 'They amplify sound pressure by approximately 20-fold through lever action and hydraulic area reduction', correct: true },
      { text: 'They convert mechanical impulses directly into electrical currents without fluid displacement', correct: false },
      { text: 'They produce endolymph fluid to lubricate the middle ear cavity', correct: false }
    ],
    explanation:
      'The large tympanic membrane (area ≈ 55 mm²) collects sound and acts on the small oval window (area ≈ 3.2 mm²). Combined with ossicular lever action, this amplifies pressure ~20 to 22 times, overcoming the acoustic impedance of fluid in the inner ear.'
  },
  {
    id: 'q2',
    question:
      'A passenger flying in an aircraft experiences a painful sensation in the ears during sudden descent, which is relieved upon swallowing or yawning. Explain the biological basis of this relief.',
    options: [
      { text: 'Swallowing tightens the suspensory ligaments of the stapes', correct: false },
      { text: 'Swallowing causes the Eustachian tube to open, equalizing air pressure across the tympanic membrane', correct: true },
      { text: 'Swallowing drains excess perilymph from the semicircular canals into the pharynx', correct: false },
      { text: 'Swallowing temporarily paralyzes the auditory nerve to relieve pain', correct: false }
    ],
    explanation:
      'The Eustachian tube connects the middle ear cavity with the pharynx. Swallowing opens the tube, equalizing higher external atmospheric pressure with middle ear pressure, allowing the stretched tympanic membrane to return to its normal vibrating resting position.'
  },
  {
    id: 'q3',
    question:
      'Which structure of the inner ear is specifically responsible for maintaining dynamic/rotational balance when an athlete spins rapidly?',
    options: [
      { text: 'Cochlea with basilar membrane', correct: false },
      { text: 'Ampullae within the three semicircular canals', correct: true },
      { text: 'Otoliths inside the saccule and utricle', correct: false },
      { text: 'Tympanic cavity', correct: false }
    ],
    explanation:
      'The three semicircular canals lie in three mutually perpendicular planes. Angular head rotation shifts endolymph fluid against the cupula in the ampulla, deflecting hair cells and signaling rotational acceleration to the cerebellum.'
  },
  {
    id: 'q4',
    question:
      'State the precise role of the Organ of Corti situated on the basilar membrane in the mammalian cochlea.',
    options: [
      { text: 'Produces cerumen to trap pathogens in the inner ear', correct: false },
      { text: 'Secretes perilymph to fill the middle ear cavity', correct: false },
      { text: 'Transduces fluid mechanical wave vibrations into sensory electrical nerve impulses', correct: true },
      { text: 'Regulates blood pressure in the internal carotid artery', correct: false }
    ],
    explanation:
      'The Organ of Corti rests on the basilar membrane. When perilymph/endolymph pressure waves ripple through the cochlear ducts, its stereocilia hair cells are sheared against the tectorial membrane, generating action potentials in the cochlear nerve fibres.'
  }
];

export default function HumanEarHearingBalanceSim({ config = {}, onTelemetry }) {
  // Mode: 'hearing' | 'balance' | 'anatomy'
  const [activeTab, setActiveTab] = useState('hearing');

  // Hearing Engine States
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [soundFrequency, setSoundFrequency] = useState(1000); // Hz (200 - 4000)
  const [soundAmplitude, setSoundAmplitude] = useState(60); // dB (20 - 100)
  const [wavePhase, setWavePhase] = useState(0);

  // Dynamic Balance States (Head Rotation)
  const [headYaw, setHeadYaw] = useState(0); // degrees (-60 to +60)
  const [headPitch, setHeadPitch] = useState(0); // degrees (-30 to +30)
  const [isRotatingAuto, setIsRotatingAuto] = useState(false);

  // Selected Pin for Anatomical Inspection
  const [selectedPinId, setSelectedPinId] = useState(null);

  // KCSE Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const canvasRef = useRef(null);

  // Animation frame for wave motion & ossicle oscillation
  useEffect(() => {
    let animId;
    const animate = () => {
      if (isPlayingSound) {
        setWavePhase((prev) => (prev + (soundFrequency / 300)) % (Math.PI * 200));
      }
      if (isRotatingAuto) {
        setHeadYaw((prev) => Math.sin(Date.now() * 0.002) * 55);
        setHeadPitch((prev) => Math.cos(Date.now() * 0.002) * 25);
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlayingSound, isRotatingAuto, soundFrequency]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Dark grid background
    ctx.save();
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 35) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // Partition lines demarcating Outer, Middle, and Inner Ear
    ctx.save();
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);

    // Outer / Middle partition (at eardrum x=270)
    ctx.beginPath();
    ctx.moveTo(270, 30);
    ctx.lineTo(270, 380);
    ctx.stroke();

    // Middle / Inner partition (at oval window x=390)
    ctx.beginPath();
    ctx.moveTo(390, 30);
    ctx.lineTo(390, 380);
    ctx.stroke();

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('OUTER EAR (Acoustic)', 80, 50);
    ctx.fillText('MIDDLE EAR (Mechanical ~20×)', 275, 50);
    ctx.fillText('INNER EAR (Hydraulic & Sensory)', 430, 50);
    ctx.restore();

    // Sound vibration amplitude factor
    const vibAmp = isPlayingSound ? (soundAmplitude / 100) * 4 : 0;
    const osc = Math.sin(wavePhase * 0.2) * vibAmp;

    // 1. OUTER EAR: Pinna (Artistic Cartilage curve)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(70, 80);
    ctx.bezierCurveTo(20, 120, 15, 230, 80, 270);
    ctx.bezierCurveTo(95, 280, 110, 250, 100, 235);
    ctx.bezierCurveTo(60, 215, 60, 140, 95, 115);
    ctx.bezierCurveTo(115, 100, 105, 80, 70, 80);
    ctx.fillStyle = '#fca5a5';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();

    // Auditory Meatus (Canal)
    ctx.beginPath();
    ctx.moveTo(95, 185);
    ctx.bezierCurveTo(150, 180, 210, 185, 268, 175);
    ctx.lineTo(268, 225);
    ctx.bezierCurveTo(210, 220, 150, 230, 95, 215);
    ctx.closePath();
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();

    // 2. Incident Acoustic Sound Waves in Outer Canal
    if (isPlayingSound) {
      ctx.save();
      const numWaves = 10;
      for (let i = 0; i < numWaves; i++) {
        const waveX = 95 + ((i * 18 + wavePhase * 3) % 170);
        if (waveX < 268) {
          ctx.beginPath();
          ctx.moveTo(waveX, 185 + Math.sin(i + wavePhase) * 2);
          ctx.quadraticCurveTo(waveX + 5, 202, waveX, 220 + Math.cos(i + wavePhase) * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 + (i % 2) * 0.5})`;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // 3. MIDDLE EAR CAVITY (Tympanum & Ossicles)
    // Tympanic Membrane (Eardrum) - vibrates with osc
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(268 + osc, 200, 4, 25, -0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#e2e8f0';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = isPlayingSound ? 10 : 0;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();
    ctx.restore();

    // Eustachian Tube angling down into nasopharynx
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(310, 240);
    ctx.bezierCurveTo(315, 280, 330, 310, 360, 340);
    ctx.lineTo(378, 332);
    ctx.bezierCurveTo(348, 305, 332, 275, 330, 238);
    ctx.closePath();
    ctx.fillStyle = 'rgba(71, 85, 105, 0.4)';
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('To Nasopharynx', 365, 350);
    ctx.restore();

    // AUDITORY OSSICLES LEVER SYSTEM
    // Malleus (Hammer) attached to eardrum at (268, 200)
    const malHeadX = 300 + osc * 0.9;
    const malHeadY = 175;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(268 + osc, 200); // Handle
    ctx.lineTo(malHeadX, malHeadY); // Neck & Head
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#facc15'; // Golden ossicle
    ctx.lineCap = 'round';
    ctx.stroke();
    // Head bulb
    ctx.beginPath();
    ctx.arc(malHeadX, malHeadY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.fill();
    ctx.restore();

    // Incus (Anvil) pivoting on Malleus
    const incPivotX = malHeadX + 5;
    const incPivotY = malHeadY;
    const incBodyX = 330 - osc * 0.7;
    const incBodyY = 170;
    const incLongProcessX = 355 - osc * 0.6;
    const incLongProcessY = 195;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(incPivotX, incPivotY);
    ctx.lineTo(incBodyX, incBodyY);
    ctx.lineTo(incLongProcessX, incLongProcessY);
    ctx.lineWidth = 4.5;
    ctx.strokeStyle = '#fb923c'; // Orange ossicle
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    // Stapes (Stirrup) acting on Oval Window at x=390
    const stapesArchX = 372 - osc * 0.4;
    const stapesFootplateX = 390 - osc * 0.3;
    ctx.save();
    ctx.beginPath();
    // Head attached to incus
    ctx.moveTo(incLongProcessX, incLongProcessY);
    ctx.lineTo(stapesArchX, 190);
    ctx.lineTo(stapesFootplateX, 185);
    ctx.lineTo(stapesFootplateX, 205);
    ctx.lineTo(stapesArchX, 200);
    ctx.closePath();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.fill();
    ctx.strokeStyle = '#ef4444'; // Red stapes
    ctx.lineWidth = 3;
    ctx.stroke();

    // Oval Window Membrane (Small area = high pressure!)
    ctx.beginPath();
    ctx.ellipse(390, 195, 3.5, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Round Window (Pressure release bulging synchronously out of phase)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(392, 235 + osc * 0.3, 3.5, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#c084fc';
    ctx.fill();
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Round Window', 345, 252);
    ctx.restore();

    // 4. INNER EAR: COCHLEA & ORGAN OF CORTI
    // Spiral Cochlea (Mathematical Archimedean Spiral in 2.5 turns)
    ctx.save();
    ctx.translate(470, 230);
    ctx.beginPath();
    const turns = 2.5;
    const spiralScale = 14;
    for (let theta = 0; theta < turns * Math.PI * 2; theta += 0.05) {
      const r = 5 + (turns * Math.PI * 2 - theta) * (spiralScale / (turns * Math.PI * 2));
      const sx = r * Math.cos(theta);
      const sy = r * Math.sin(theta);
      if (theta === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#0284c7';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Perilymph fluid wave pulses inside Cochlea
    if (isPlayingSound) {
      ctx.beginPath();
      for (let theta = 0; theta < turns * Math.PI * 2; theta += 0.08) {
        const r = 5 + (turns * Math.PI * 2 - theta) * (spiralScale / (turns * Math.PI * 2));
        const pulse = Math.sin(theta * 3 - wavePhase * 2) * 3;
        const sx = (r + pulse) * Math.cos(theta);
        const sy = (r + pulse) * Math.sin(theta);
        if (theta === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 8;
      ctx.stroke();
    }
    ctx.restore();

    // 5. VESTIBULAR APPARATUS (3 Semicircular Canals & Ampullae)
    // Adjust dynamic visual deflection by headYaw and headPitch
    const yawRadian = (headYaw * Math.PI) / 180;
    const pitchRadian = (headPitch * Math.PI) / 180;

    ctx.save();
    ctx.translate(420, 120);

    // Superior / Anterior Canal (Vertical plane)
    ctx.beginPath();
    ctx.ellipse(
      0,
      -35 + Math.sin(pitchRadian) * 6,
      28,
      20,
      -0.2 + yawRadian * 0.2,
      0,
      Math.PI * 2
    );
    ctx.lineWidth = 6;
    ctx.strokeStyle = activeTab === 'balance' ? '#34d399' : '#059669';
    ctx.stroke();

    // Posterior Canal (Vertical sagittal orthogonal)
    ctx.beginPath();
    ctx.ellipse(
      28 + Math.cos(yawRadian) * 4,
      -10,
      24,
      18,
      0.8 + pitchRadian * 0.2,
      0,
      Math.PI * 2
    );
    ctx.lineWidth = 6;
    ctx.strokeStyle = activeTab === 'balance' ? '#6ee7b7' : '#10b981';
    ctx.stroke();

    // Horizontal / Lateral Canal
    ctx.beginPath();
    ctx.ellipse(-15, -5, 26, 12, 0.4 + yawRadian * 0.4, 0, Math.PI * 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = activeTab === 'balance' ? '#10b981' : '#047857';
    ctx.stroke();

    // Ampullae Dilatations with hair-cell cristae
    [-18, 12, 34].forEach((ampX, i) => {
      ctx.beginPath();
      ctx.arc(ampX, -20 + i * 8, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
    });

    // Utricle & Saccule (Vestibule bag with Otoliths)
    ctx.beginPath();
    ctx.ellipse(5, 20, 14, 18, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#065f46';
    ctx.fill();
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Otolith Crystals shifting with gravity
    const otolithOffsetX = Math.sin(yawRadian) * 4;
    const otolithOffsetY = Math.sin(pitchRadian) * 4;
    ctx.fillStyle = '#ffffff';
    for (let k = 0; k < 6; k++) {
      ctx.fillRect(
        3 + (k % 3) * 3 + otolithOffsetX,
        18 + Math.floor(k / 3) * 4 + otolithOffsetY,
        2,
        2
      );
    }

    ctx.restore();

    // 6. Auditory / Vestibulocochlear Nerve (Cranial VIII)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(500, 180);
    ctx.bezierCurveTo(540, 175, 570, 165, 620, 160);
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#f59e0b'; // Gold sensory nerve trunk
    ctx.lineCap = 'round';
    ctx.stroke();

    // Nerve Action Potential Sparks when active
    if (isPlayingSound || activeTab === 'balance') {
      const sparkCount = 4;
      for (let s = 0; s < sparkCount; s++) {
        const sparkPos = (wavePhase * 4 + s * 30) % 110;
        const sx = 505 + sparkPos;
        const sy = 180 - sparkPos * 0.16;
        ctx.beginPath();
        ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.fill();
      }
    }
    ctx.restore();

    // 7. Render Anatomical Pins (if on Anatomy Tab)
    if (activeTab === 'anatomy') {
      EAR_ANATOMY_REGIONS.forEach((pin) => {
        const isSelected = selectedPinId === pin.id;
        ctx.save();
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, isSelected ? 8 : 5.5, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#38bdf8' : '#e0e7ff';
        ctx.shadowColor = isSelected ? '#0284c7' : '#6366f1';
        ctx.shadowBlur = isSelected ? 12 : 5;
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = isSelected ? 'bold 11px sans-serif' : '10px sans-serif';
        ctx.fillStyle = isSelected ? '#38bdf8' : '#cbd5e1';
        ctx.fillText(pin.name, pin.x + 9, pin.y + 3);
        ctx.restore();
      });
    }
  }, [
    isPlayingSound,
    soundFrequency,
    soundAmplitude,
    wavePhase,
    headYaw,
    headPitch,
    activeTab,
    selectedPinId
  ]);

  // Handle canvas click to inspect anatomical pin
  const handleCanvasClick = (e) => {
    if (activeTab !== 'anatomy') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    let found = null;
    let minDist = 30;
    EAR_ANATOMY_REGIONS.forEach((pin) => {
      const dist = Math.hypot(pin.x - clickX, pin.y - clickY);
      if (dist < minDist) {
        minDist = dist;
        found = pin.id;
      }
    });

    if (found) {
      setSelectedPinId(found);
      if (onTelemetry) {
        onTelemetry('ear_pin_inspected', { pinId: found });
      }
    }
  };

  // 1-Click Automated Experiments
  const runPreset = (type) => {
    if (type === 'transduce_wave') {
      setActiveTab('hearing');
      setIsPlayingSound(true);
      setSoundFrequency(1200);
      setSoundAmplitude(75);
    } else if (type === 'high_pitch') {
      setActiveTab('hearing');
      setIsPlayingSound(true);
      setSoundFrequency(3500);
      setSoundAmplitude(85);
    } else if (type === 'dynamic_rotational_spin') {
      setActiveTab('balance');
      setIsPlayingSound(false);
      setIsRotatingAuto(true);
    } else if (type === 'static_tilt') {
      setActiveTab('balance');
      setIsRotatingAuto(false);
      setHeadYaw(40);
      setHeadPitch(-20);
    }
    if (onTelemetry) {
      onTelemetry('ear_preset_triggered', { preset: type });
    }
  };

  // KCSE Quiz Submission
  const submitQuiz = () => {
    if (selectedOption === null) return;
    const curr = KCSE_EAR_QUESTIONS[quizIndex];
    const isCorrect = curr.options[selectedOption].correct;
    if (isCorrect) setQuizScore((prev) => prev + 1);
    setQuizSubmitted(true);
    if (onTelemetry) {
      onTelemetry('ear_kcse_quiz_question_answered', {
        questionId: curr.id,
        isCorrect
      });
    }
  };

  const nextQuestion = () => {
    if (quizIndex < KCSE_EAR_QUESTIONS.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      setQuizComplete(true);
      if (onTelemetry) {
        onTelemetry('SIMULATION_CHALLENGE_COMPLETED', {
          topic: 'human_ear_hearing_balance_kcse',
          finalScore: quizScore + (KCSE_EAR_QUESTIONS[quizIndex].options[selectedOption]?.correct ? 1 : 0),
          totalQuestions: KCSE_EAR_QUESTIONS.length
        });
      }
    }
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizSubmitted(false);
    setQuizComplete(false);
  };

  // Calculations for Telemetry HUD
  const hydraulicPressureAmp = (55 / 3.2).toFixed(1); // 17.2x area ratio
  const ossicleLeverAmp = 1.3;
  const totalMechanicalAdvantage = (17.2 * 1.3).toFixed(1); // ~22.4x

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      {/* Top Banner Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Activity className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Human Ear: Hearing & Balance Mechanism
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  KCSE Biology Form 4
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Topic 3: Reception, Response and Coordination in Animals • Acoustic Transduction &
                Vestibular Equilibrium
              </p>
            </div>
          </div>
        </div>

        {/* 1-Click Automated Runs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            1-Click Automated Runs:
          </span>
          <button
            onClick={() => runPreset('transduce_wave')}
            className="px-3 py-1.5 text-xs font-medium bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded-lg border border-blue-500/40 transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> Transduce Sound Wave
          </button>
          <button
            onClick={() => runPreset('high_pitch')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
          >
            High Frequency (3.5 kHz)
          </button>
          <button
            onClick={() => runPreset('dynamic_rotational_spin')}
            className="px-3 py-1.5 text-xs font-medium bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 rounded-lg border border-emerald-800/40 transition flex items-center gap-1"
          >
            <RotateCw className="w-3.5 h-3.5" /> Rotational Spin
          </button>
          <button
            onClick={() => runPreset('static_tilt')}
            className="px-3 py-1.5 text-xs font-medium bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 rounded-lg border border-purple-800/40 transition"
          >
            Gravitational Tilt
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Visual Canvas & Mode Switcher */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTab('hearing');
                setIsRotatingAuto(false);
              }}
              className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
                activeTab === 'hearing'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              1. Sound Wave & Ossicle Transduction
            </button>
            <button
              onClick={() => {
                setActiveTab('balance');
                setIsPlayingSound(false);
              }}
              className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
                activeTab === 'balance'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              2. Vestibular Balance (Canals & Otoliths)
            </button>
            <button
              onClick={() => {
                setActiveTab('anatomy');
                setIsPlayingSound(false);
                setIsRotatingAuto(false);
              }}
              className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
                activeTab === 'anatomy'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              3. Interactive Ear Anatomy
            </button>
          </div>

          {/* Canvas Viewport */}
          <div className="relative bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl p-2">
            <canvas
              ref={canvasRef}
              width={760}
              height={410}
              onClick={handleCanvasClick}
              className="w-full h-auto cursor-crosshair rounded-xl bg-slate-950"
            />

            {/* Quick Status Pill */}
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
              <span className="font-mono text-slate-300">
                {activeTab === 'hearing' &&
                  `Acoustic Tone: ${soundFrequency} Hz • Sound Pressure: ${soundAmplitude} dB • Ossicle Lever: 1.3×`}
                {activeTab === 'balance' &&
                  `Yaw Rotation: ${headYaw.toFixed(1)}° • Pitch Tilt: ${headPitch.toFixed(
                    1
                  )}° • Endolymph Fluid Inertia Active`}
                {activeTab === 'anatomy' && 'Click any circular node to inspect anatomical structures'}
              </span>
            </div>

            {/* In-Canvas Dynamic Telemetry HUD */}
            <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 text-xs font-mono space-y-1 text-slate-300">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Tympanic : Oval Window Ratio:</span>
                <span className="text-emerald-400 font-bold">55mm² : 3.2mm² (~17:1)</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Total Pressure Amplification:</span>
                <span className="text-amber-400 font-bold">{totalMechanicalAdvantage}×</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Perilymph Fluid Impedance:</span>
                <span className="text-cyan-400 font-bold">Matched & Transduced</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Vestibulocochlear Nerve (VIII):</span>
                <span className="text-purple-400 font-bold">
                  {isPlayingSound || activeTab === 'balance' ? 'Action Potentials Firing' : 'Quiescent'}
                </span>
              </div>
            </div>
          </div>

          {/* Biological Controls Drawer */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            {activeTab === 'hearing' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    Sound Wave Transduction Generator
                  </span>
                  <button
                    onClick={() => setIsPlayingSound((p) => !p)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 ${
                      isPlayingSound
                        ? 'bg-red-600/30 text-red-300 border-red-500/40 hover:bg-red-600/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
                    }`}
                  >
                    {isPlayingSound ? (
                      <>
                        <Pause className="w-3.5 h-3.5" /> Stop Wave Generator
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> Start Sound Wave Generator
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Sound Frequency (Pitch):</span>
                      <span className="font-mono text-emerald-400 font-bold">{soundFrequency} Hz</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="4000"
                      step="50"
                      value={soundFrequency}
                      onChange={(e) => setSoundFrequency(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>200 Hz (Bass / Apex Cochlea)</span>
                      <span>4000 Hz (Treble / Base Cochlea)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Sound Intensity (Amplitude):</span>
                      <span className="font-mono text-amber-400 font-bold">{soundAmplitude} dB</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="1"
                      value={soundAmplitude}
                      onChange={(e) => setSoundAmplitude(parseInt(e.target.value))}
                      className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>Whisper (20 dB)</span>
                      <span>Loud / High Ossicle Vibration (100 dB)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 text-xs text-slate-300">
                  <span className="font-bold text-blue-400 block mb-1">
                    Path of Sound Wave in Mammalian Ear (KCSE Form 4):
                  </span>
                  Air vibrations collected by <strong>Pinna</strong> → funneled along{' '}
                  <strong>Auditory Canal</strong> → vibrates <strong>Tympanum</strong> → amplified by
                  ossicular lever system (<strong>Malleus → Incus → Stapes</strong>) → concentrates on
                  smaller <strong>Oval Window</strong> (~20× pressure boost) → displaces perilymph in
                  vestibular canal → ripples basilar membrane in <strong>Organ of Corti</strong> → hair
                  cells fire action potentials along <strong>Auditory Nerve (VIII)</strong> to
                  temporal cortex of cerebrum.
                </div>
              </div>
            )}

            {activeTab === 'balance' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    Dynamic & Static Equilibrium Sensor
                  </span>
                  <button
                    onClick={() => setIsRotatingAuto((p) => !p)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-500/40 transition"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    {isRotatingAuto ? 'Pause Auto Head Spin' : 'Auto Head Spin Simulator'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Angular Yaw Rotation (Semicircular Canals):</span>
                      <span className="font-mono text-emerald-400 font-bold">{headYaw.toFixed(1)}°</span>
                    </div>
                    <input
                      type="range"
                      min="-60"
                      max="60"
                      value={headYaw}
                      onChange={(e) => {
                        setIsRotatingAuto(false);
                        setHeadYaw(parseFloat(e.target.value));
                      }}
                      className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Gravitational Pitch Tilt (Utricle & Saccule):</span>
                      <span className="font-mono text-purple-400 font-bold">{headPitch.toFixed(1)}°</span>
                    </div>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      value={headPitch}
                      onChange={(e) => {
                        setIsRotatingAuto(false);
                        setHeadPitch(parseFloat(e.target.value));
                      }}
                      className="w-full accent-purple-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
                    <span className="font-bold text-emerald-400 block mb-1">
                      Dynamic / Rotational Balance:
                    </span>
                    Three semicircular canals in three orthogonal planes (X, Y, Z). Head rotation
                    causes endolymph lag which bends the gelatinous cupula inside the ampullae,
                    stimulating sensory hair cells.
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
                    <span className="font-bold text-purple-400 block mb-1">
                      Static Balance & Gravity:
                    </span>
                    Utricle and Saccule contain maculae covered with calcium carbonate otoliths. Head
                    tilt causes otolith stones to slide under gravity, deflecting cilia to detect
                    linear posture.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'anatomy' && (
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Select Anatomical Part to Highlight:
                </span>
                <div className="flex flex-wrap gap-2">
                  {EAR_ANATOMY_REGIONS.map((pin) => (
                    <button
                      key={pin.id}
                      onClick={() => setSelectedPinId(pin.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                        selectedPinId === pin.id
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {pin.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Anatomical Inspector & KCSE Pathology Quiz */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Anatomical Inspector Card */}
          {activeTab === 'anatomy' && selectedPinId ? (
            <div className="bg-slate-900 p-5 rounded-2xl border border-emerald-500/40 shadow-xl">
              {(() => {
                const pin = EAR_ANATOMY_REGIONS.find((p) => p.id === selectedPinId);
                if (!pin) return null;
                return (
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <h3 className="text-lg font-bold text-emerald-400">{pin.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {pin.part}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mt-3 leading-relaxed">{pin.function}</p>
                    <div className="mt-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-400">
                      <span className="font-bold text-amber-400 block mb-1">
                        KCSE Expected Point:
                      </span>
                      {pin.kcseKey}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400">
              <span className="font-bold text-slate-200 block mb-1">
                Form 4 Biology Syllabus Objective:
              </span>
              Relate the structural adaptations of the mammalian ear to the twin functions of hearing
              (acoustic transduction) and posture maintenance (rotational and gravitational balance).
            </div>
          )}

          {/* Interactive KCSE Exam Challenge Card */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <Award className="w-4 h-4 text-amber-400" />
                  KCSE Ear Pathology & Physiology Quiz
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Q{quizIndex + 1} of {KCSE_EAR_QUESTIONS.length}
                </span>
              </div>

              {!quizComplete ? (
                <div className="mt-4 space-y-3">
                  <p className="text-sm font-medium text-slate-200 leading-snug">
                    {KCSE_EAR_QUESTIONS[quizIndex].question}
                  </p>

                  <div className="space-y-2 mt-3">
                    {KCSE_EAR_QUESTIONS[quizIndex].options.map((opt, idx) => {
                      const isChosen = selectedOption === idx;
                      let btnStyle = 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800';
                      if (quizSubmitted) {
                        if (opt.correct) {
                          btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300';
                        } else if (isChosen && !opt.correct) {
                          btnStyle = 'bg-red-950/60 border-red-500 text-red-300';
                        }
                      } else if (isChosen) {
                        btnStyle = 'bg-emerald-600/30 border-emerald-400 text-emerald-200';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => !quizSubmitted && setSelectedOption(idx)}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-3 text-xs font-medium rounded-xl border transition flex items-start gap-2 ${btnStyle}`}
                        >
                          <span className="font-mono text-slate-400 mt-0.5">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span className="flex-1">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 text-xs text-slate-300 mt-3">
                      <span className="font-bold text-emerald-400 block mb-1">
                        Examiner Rationale:
                      </span>
                      {KCSE_EAR_QUESTIONS[quizIndex].explanation}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 text-center space-y-4 py-4">
                  <div className="inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Quiz Completed!</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      You scored {quizScore} out of {KCSE_EAR_QUESTIONS.length} on Ear Physiology.
                    </p>
                  </div>
                  <button
                    onClick={restartQuiz}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
                  >
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>

            {!quizComplete && (
              <div className="pt-4 border-t border-slate-800 mt-4 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono">Score: {quizScore} pts</span>
                {!quizSubmitted ? (
                  <button
                    onClick={submitQuiz}
                    disabled={selectedOption === null}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                  >
                    {quizIndex < KCSE_EAR_QUESTIONS.length - 1 ? (
                      <>
                        Next Question <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      'Finish Challenge'
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
