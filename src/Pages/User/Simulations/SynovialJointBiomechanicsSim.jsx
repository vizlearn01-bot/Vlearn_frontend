import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  RotateCcw,
  Play,
  Pause,
  Layers,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  Sliders,
  ShieldAlert,
  Droplets,
  Gauge,
  Compass,
  Maximize2,
  ChevronRight,
  Eye,
  Zap,
} from 'lucide-react';

// ============================================================================
// KCSE EXAM QUESTIONS FOR SYNOVIAL JOINTS
// ============================================================================
const KCSE_QUESTIONS = [
  {
    id: 'q1',
    title: 'KCSE Biology Paper 1: Synovial Membrane & Fluid',
    prompt:
      'What is the primary physiological function of the synovial fluid secreted by the synovial membrane in a freely movable joint?',
    options: [
      {
        id: 'A',
        text: 'Acts as a shock absorber and lubricates the articular surfaces to eliminate friction and wear.',
        correct: true,
      },
      {
        id: 'B',
        text: 'Calcifies the capsular ligament to prevent joint dislocation under extreme loads.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Generates electrical action potentials to trigger rapid contraction of surrounding flexor muscles.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Secretes calcium phosphate salts to continuously thicken the periosteum of the epiphysis.',
        correct: false,
      },
    ],
    explanation:
      'Synovial fluid is a viscous egg-white-like fluid containing hyaluronic acid. It lubricates the smooth hyaline (articular) cartilages, minimizes friction during movement, absorbs mechanical shock, and nourishes the avascular articular cartilage.',
  },
  {
    id: 'q2',
    title: 'KCSE Biology Paper 2: Hyaline Cartilage Adaptation',
    prompt:
      'Which structural adaptation enables articular (hyaline) cartilage to withstand high compressive loading across long bone ends?',
    options: [
      {
        id: 'A',
        text: 'Abundant dense networks of elastin fibers that allow it to stretch to 5 times its original length.',
        correct: false,
      },
      {
        id: 'B',
        text: 'Smooth glassy matrix with high water retention and collagen fibrils that cushions impact and provides low-friction articulation.',
        correct: true,
      },
      {
        id: 'C',
        text: 'A rich network of blood capillaries delivering rapid osteoblast repair within minutes of impact.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Rigid concentric lamellae organized in Haversian systems filled with marrow.',
        correct: false,
      },
    ],
    explanation:
      'Articular cartilage is hyaline cartilage. It has a smooth, glassy, resilient matrix rich in proteoglycans and collagen fibrils that trap water under hydrostatic pressure. It lacks blood vessels and nerves (avascular), relying on synovial fluid for nutrient diffusion.',
  },
  {
    id: 'q3',
    title: 'KCSE Biology: Joint Classification',
    prompt:
      'Distinguish between a hinge joint (e.g., knee/elbow) and a ball-and-socket joint (e.g., shoulder/hip) in terms of degrees of movement.',
    options: [
      {
        id: 'A',
        text: 'A hinge joint allows movement in only one plane (flexion & extension, 180°), whereas a ball-and-socket allows movement in all 3 planes (360° rotation, circumduction, abduction/adduction).',
        correct: true,
      },
      {
        id: 'B',
        text: 'A hinge joint allows rotational circumduction while a ball-and-socket is restricted to gliding in one plane.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Hinge joints lack synovial cavities and ligaments, whereas ball-and-socket joints possess them.',
        correct: false,
      },
      {
        id: 'D',
        text: 'Hinge joints articulate three bones simultaneously, whereas ball-and-socket joints articulate only fused vertebrae.',
        correct: false,
      },
    ],
    explanation:
      'Hinge joints permit motion in one plane only (mono-axial, typically flexion and extension up to ~140°-180°). Ball-and-socket joints consist of a hemispherical head articulating in a cup-like socket, permitting multiaxial 360° rotational motion, abduction, adduction, and circumduction.',
  },
  {
    id: 'q4',
    title: 'KCSE Biology Paper 2: Osteoarthritis Pathology',
    prompt:
      'In degenerative joint disease (Osteoarthritis), what sequence of mechanical and anatomical breakdown occurs within the synovial joint?',
    options: [
      {
        id: 'A',
        text: 'Wearing down of articular cartilage leads to direct bone-on-bone friction, formation of osteophytes (bone spurs), and joint inflammation.',
        correct: true,
      },
      {
        id: 'B',
        text: 'Synovial fluid crystallizes into bone lamellae, locking the joint permanently into an immovable suture.',
        correct: false,
      },
      {
        id: 'C',
        text: 'Ligaments dissolve due to alkaline synovial fluid, causing spontaneous dislocation without bone contact.',
        correct: false,
      },
      {
        id: 'D',
        text: 'The tendon of the biceps brachii ruptures, preventing all nervous impulses from reaching the spinal cord.',
        correct: false,
      },
    ],
    explanation:
      'In Osteoarthritis, mechanical wear or aging degrades the smooth hyaline cartilage. The synovial membrane becomes inflamed, friction jumps significantly, and the exposed subchondral bones rub directly together. Micro-fractures and compensatory bone remodeling produce painful osteophytes (bone spurs).',
  },
];

export default function SynovialJointBiomechanicsSim({ config = {}, onTelemetry }) {
  // Joint type: 'hinge' (Knee/Elbow) or 'ball_socket' (Hip/Shoulder)
  const [jointType, setJointType] = useState('hinge');

  // Interactive biomechanical parameters
  const [flexionAngle, setFlexionAngle] = useState(35); // 0 (full extension) to 135 (deep flexion)
  const [loadForce, setLoadForce] = useState(250); // Newtons: 50 N to 1200 N
  const [hasOsteoarthritis, setHasOsteoarthritis] = useState(false);
  const [synovialFluidVolume, setSynovialFluidVolume] = useState(100); // % of normal (10% to 100%)

  // View & animation states
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewAngle3D, setViewAngle3D] = useState(20); // Orbit angle for 3D pseudo rotation
  const [showCutaway, setShowCutaway] = useState(true);
  const [showForceVectors, setShowForceVectors] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedTissue, setSelectedTissue] = useState('cartilage');

  // Quiz state
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const canvasRef = useRef(null);

  // Biomechanical derived metrics
  const mechanics = useMemo(() => {
    // Normal cartilage coefficient of friction ~ 0.005 - 0.02
    // Degraded bone-on-bone friction ~ 0.35 - 0.65
    const baseMu = hasOsteoarthritis ? 0.48 : 0.012;
    const fluidStarvation = (100 - synovialFluidVolume) / 100;
    const mu = Math.min(0.7, baseMu + (hasOsteoarthritis ? fluidStarvation * 0.18 : fluidStarvation * 0.06));

    // Hydrostatic pressure in synovial cavity (kPa)
    // Increases with load force and decreases with fluid loss or cartilage wear
    const nominalPressure = (loadForce / 12) * (synovialFluidVolume / 100);
    const pressureKPa = Math.max(12, Math.round(nominalPressure * (hasOsteoarthritis ? 1.65 : 1.0)));

    // Frictional shear force F_friction = mu * Normal Force
    const frictionForceN = (mu * loadForce).toFixed(1);

    // Wear rate index (arbitrary biological unit mm³/yr)
    const wearRate = hasOsteoarthritis ? (loadForce * 0.045 * mu).toFixed(2) : (loadForce * 0.0006 * mu).toFixed(3);

    // Shock absorption efficiency %
    const shockAbsorption = hasOsteoarthritis
      ? Math.max(12, Math.round(28 - (loadForce / 1200) * 15))
      : Math.round(92 - (loadForce / 1200) * 12);

    return {
      mu: mu.toFixed(3),
      pressureKPa,
      frictionForceN,
      wearRate,
      shockAbsorption,
    };
  }, [loadForce, hasOsteoarthritis, synovialFluidVolume]);

  // Automated flexion cycle animation
  useEffect(() => {
    if (!isPlaying) return;
    let step = 1.2;
    let direction = 1;

    const interval = setInterval(() => {
      setFlexionAngle((prev) => {
        let next = prev + step * direction;
        if (next >= 120) {
          direction = -1;
          next = 120;
        } else if (next <= 10) {
          direction = 1;
          next = 10;
        }
        return next;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Canvas 2D / Pseudo-3D Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#0d1527');
    bgGrad.addColorStop(1, '#050912');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle coordinate grid / laboratory markings
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Joint Pivot Center
    const cx = width * 0.46;
    const cy = height * 0.52;

    // Perspective transformation parameters based on viewAngle3D
    const radView = (viewAngle3D * Math.PI) / 180;
    const sinV = Math.sin(radView);

    // Rotation angle for articulating bone
    const radFlex = (flexionAngle * Math.PI) / 180;

    // Draw biomechanical assembly
    ctx.save();

    if (jointType === 'hinge') {
      // ======================================================================
      // HINGE JOINT (KNEE / ELBOW)
      // Proximal Bone (Femur / Humerus) on Top (Fixed)
      // Distal Bone (Tibia / Ulna) Below (Rotates with flexionAngle)
      // ======================================================================

      // 1. PROXIMAL BONE (Top Femur / Humerus)
      const topBoneGradient = ctx.createLinearGradient(cx - 50, cy - 200, cx + 50, cy - 20);
      topBoneGradient.addColorStop(0, '#f8fafc');
      topBoneGradient.addColorStop(0.3, '#e2e8f0');
      topBoneGradient.addColorStop(0.7, '#cbd5e1');
      topBoneGradient.addColorStop(1, '#94a3b8');

      // Femur shaft & condyles
      ctx.beginPath();
      ctx.moveTo(cx - 32 + sinV * 6, cy - 210);
      ctx.lineTo(cx + 32 + sinV * 6, cy - 210);
      ctx.lineTo(cx + 38, cy - 70);
      // Condyle bulb expansion
      ctx.bezierCurveTo(cx + 65, cy - 45, cx + 55, cy - 12, cx + 18, cy - 10);
      // Intercondylar notch
      ctx.bezierCurveTo(cx + 5, cy - 14, cx - 5, cy - 14, cx - 18, cy - 10);
      ctx.bezierCurveTo(cx - 55, cy - 12, cx - 65, cy - 45, cx - 38, cy - 70);
      ctx.closePath();
      ctx.fillStyle = topBoneGradient;
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Cancellous / Trabecular bone cutaway interior texture
      if (showCutaway) {
        ctx.save();
        ctx.clip();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 1;
        for (let i = -40; i < 40; i += 10) {
          ctx.beginPath();
          ctx.arc(cx + i, cy - 60, 25, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Osteophyte bone spurs if Osteoarthritis
      if (hasOsteoarthritis) {
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.5;

        // Medial osteophyte spur
        ctx.beginPath();
        ctx.moveTo(cx + 50, cy - 24);
        ctx.lineTo(cx + 68, cy - 18);
        ctx.lineTo(cx + 54, cy - 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Lateral osteophyte spur
        ctx.beginPath();
        ctx.moveTo(cx - 50, cy - 24);
        ctx.lineTo(cx - 68, cy - 18);
        ctx.lineTo(cx - 54, cy - 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // 2. PROXIMAL ARTICULAR (HYALINE) CARTILAGE
      const cartilageThick = hasOsteoarthritis ? 2.5 : 8.5;
      ctx.beginPath();
      ctx.moveTo(cx - 52, cy - 14);
      ctx.bezierCurveTo(cx - 30, cy - 2, cx - 5, cy - 5, cx, cy - 5);
      ctx.bezierCurveTo(cx + 5, cy - 5, cx + 30, cy - 2, cx + 52, cy - 14);
      ctx.lineTo(cx + 48, cy - 14 + cartilageThick);
      ctx.bezierCurveTo(cx + 26, cy - 2 + cartilageThick, cx + 5, cy - 5 + cartilageThick, cx, cy - 5 + cartilageThick);
      ctx.bezierCurveTo(cx - 5, cy - 5 + cartilageThick, cx - 26, cy - 2 + cartilageThick, cx - 48, cy - 14 + cartilageThick);
      ctx.closePath();

      if (hasOsteoarthritis) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.75)';
        ctx.strokeStyle = '#dc2626';
        ctx.setLineDash([4, 3]);
      } else {
        const cartGrad = ctx.createLinearGradient(cx - 40, cy - 15, cx + 40, cy);
        cartGrad.addColorStop(0, '#38bdf8');
        cartGrad.addColorStop(0.5, '#7dd3fc');
        cartGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = cartGrad;
        ctx.strokeStyle = '#bae6fd';
        ctx.setLineDash([]);
      }
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. DISTAL ARTICULATING BONE (Tibia / Ulna) with Flexion Pivot
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(radFlex);

      // Distal Cartilage on Tibial Plateau
      const distalCartThick = hasOsteoarthritis ? 2.2 : 7.8;
      ctx.beginPath();
      ctx.moveTo(-48, 6);
      ctx.bezierCurveTo(-25, 12, 0, 10, 25, 12);
      ctx.lineTo(48, 6);
      ctx.lineTo(46, 6 + distalCartThick);
      ctx.bezierCurveTo(25, 12 + distalCartThick, 0, 10 + distalCartThick, -25, 12 + distalCartThick);
      ctx.lineTo(-46, 6 + distalCartThick);
      ctx.closePath();

      if (hasOsteoarthritis) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.strokeStyle = '#ef4444';
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#bae6fd';
      }
      ctx.lineWidth = 1.8;
      ctx.fill();
      ctx.stroke();

      // Tibia / Distal Bone Head and Shaft
      const bottomBoneGrad = ctx.createLinearGradient(-40, 10, 40, 210);
      bottomBoneGrad.addColorStop(0, '#cbd5e1');
      bottomBoneGrad.addColorStop(0.4, '#e2e8f0');
      bottomBoneGrad.addColorStop(1, '#94a3b8');

      ctx.beginPath();
      ctx.moveTo(-46, 12 + distalCartThick);
      ctx.bezierCurveTo(-56, 30, -42, 60, -28, 80);
      ctx.lineTo(-24, 210);
      ctx.lineTo(24, 210);
      ctx.lineTo(28, 80);
      ctx.bezierCurveTo(42, 60, 56, 30, 46, 12 + distalCartThick);
      ctx.closePath();
      ctx.fillStyle = bottomBoneGrad;
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Osteophyte spurs on distal tibia if Osteoarthritis
      if (hasOsteoarthritis) {
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(44, 20);
        ctx.lineTo(58, 25);
        ctx.lineTo(42, 34);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore(); // restore tibia rotation

      // 4. SYNOVIAL CAVITY WITH SYNOVIAL FLUID & SYNOVIAL MEMBRANE
      const fluidOpacity = Math.max(0.15, synovialFluidVolume / 130);
      ctx.fillStyle = hasOsteoarthritis
        ? `rgba(245, 158, 11, ${fluidOpacity * 0.8})`
        : `rgba(56, 189, 248, ${fluidOpacity})`;

      ctx.beginPath();
      ctx.moveTo(cx - 52, cy - 14);
      ctx.bezierCurveTo(cx - 70, cy - 2, cx - 68, cy + 18, cx - 46 * Math.cos(radFlex) + 6, cy + 46 * Math.sin(radFlex));
      ctx.lineTo(cx + 46 * Math.cos(radFlex) - 6, cy - 46 * Math.sin(radFlex) + 12);
      ctx.bezierCurveTo(cx + 68, cy + 18, cx + 70, cy - 2, cx + 52, cy - 14);
      ctx.closePath();
      ctx.fill();

      // Synovial fluid particle micro-droplets
      const numDroplets = Math.round((synovialFluidVolume / 100) * 14);
      ctx.fillStyle = hasOsteoarthritis ? '#fde047' : '#e0f2fe';
      for (let d = 0; d < numDroplets; d++) {
        const dropX = cx - 25 + ((d * 37) % 50);
        const dropY = cy - 4 + ((d * 19) % 16);
        ctx.beginPath();
        ctx.arc(dropX, dropY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. FIBROUS CAPSULE & SYNOVIAL MEMBRANE LINING
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx - 48, cy - 42);
      ctx.bezierCurveTo(cx - 74, cy - 10, cx - 72, cy + 22, cx - 44 * Math.cos(radFlex), cy + 20 + 20 * Math.sin(radFlex));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 48, cy - 42);
      ctx.bezierCurveTo(cx + 74, cy - 10, cx + 72, cy + 22, cx + 44 * Math.cos(radFlex), cy + 20 - 20 * Math.sin(radFlex));
      ctx.stroke();

      ctx.strokeStyle = hasOsteoarthritis ? '#f43f5e' : '#ec4899';
      ctx.lineWidth = 2.2;
      ctx.setLineDash([3, 2]);

      ctx.beginPath();
      ctx.moveTo(cx - 44, cy - 36);
      ctx.bezierCurveTo(cx - 68, cy - 8, cx - 66, cy + 18, cx - 40 * Math.cos(radFlex), cy + 16 + 18 * Math.sin(radFlex));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 44, cy - 36);
      ctx.bezierCurveTo(cx + 68, cy - 8, cx + 66, cy + 18, cx + 40 * Math.cos(radFlex), cy + 16 - 18 * Math.sin(radFlex));
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      // ======================================================================
      // BALL-AND-SOCKET JOINT (HIP / SHOULDER)
      // ======================================================================
      const socketGrad = ctx.createLinearGradient(cx - 90, cy - 120, cx + 30, cy + 20);
      socketGrad.addColorStop(0, '#64748b');
      socketGrad.addColorStop(0.5, '#94a3b8');
      socketGrad.addColorStop(1, '#cbd5e1');

      ctx.beginPath();
      ctx.moveTo(cx - 110, cy - 90);
      ctx.lineTo(cx - 30, cy - 90);
      ctx.bezierCurveTo(cx + 30, cy - 70, cx + 55, cy - 20, cx + 45, cy + 35);
      ctx.bezierCurveTo(cx + 35, cy + 70, cx - 10, cy + 85, cx - 65, cy + 75);
      ctx.lineTo(cx - 110, cy + 70);
      ctx.closePath();
      ctx.fillStyle = socketGrad;
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx - 5, cy, 62, -Math.PI * 0.42, Math.PI * 0.45);
      ctx.strokeStyle = hasOsteoarthritis ? '#ef4444' : '#38bdf8';
      ctx.lineWidth = hasOsteoarthritis ? 3 : 8;
      ctx.stroke();

      // Ball Articulation
      ctx.save();
      ctx.translate(cx - 5, cy);
      ctx.rotate(radFlex * 0.85);

      const ballGrad = ctx.createRadialGradient(-15, -15, 10, 0, 0, 56);
      ballGrad.addColorStop(0, '#f8fafc');
      ballGrad.addColorStop(0.7, '#cbd5e1');
      ballGrad.addColorStop(1, '#64748b');

      ctx.beginPath();
      ctx.arc(0, 0, 54, 0, Math.PI * 2);
      ctx.fillStyle = ballGrad;
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 55, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.strokeStyle = hasOsteoarthritis ? '#dc2626' : '#7dd3fc';
      ctx.lineWidth = hasOsteoarthritis ? 2.5 : 7;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(35, -20);
      ctx.lineTo(130, -5);
      ctx.lineTo(130, 45);
      ctx.lineTo(35, 30);
      ctx.closePath();
      ctx.fillStyle = '#cbd5e1';
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(130, -25);
      ctx.lineTo(165, -15);
      ctx.lineTo(150, 160);
      ctx.lineTo(110, 160);
      ctx.lineTo(125, 45);
      ctx.closePath();
      ctx.fillStyle = '#94a3b8';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      if (hasOsteoarthritis) {
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(38, -48);
        ctx.lineTo(52, -58);
        ctx.lineTo(44, -38);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(38, 48);
        ctx.lineTo(54, 58);
        ctx.lineTo(44, 38);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx - 5, cy, 72, -Math.PI * 0.35, Math.PI * 0.35);
      ctx.stroke();

      ctx.strokeStyle = hasOsteoarthritis ? '#f43f5e' : '#ec4899';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(cx - 5, cy, 68, -Math.PI * 0.32, Math.PI * 0.32);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Force Vectors
    if (showForceVectors) {
      const loadArrowLen = Math.min(100, Math.max(25, (loadForce / 1200) * 95));
      const arrowStartX = cx;
      const arrowStartY = cy - 130;

      ctx.strokeStyle = '#ef4444';
      ctx.fillStyle = '#ef4444';
      ctx.lineWidth = 3.5;

      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowStartY - loadArrowLen);
      ctx.lineTo(arrowStartX, arrowStartY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(arrowStartX - 7, arrowStartY - 14);
      ctx.lineTo(arrowStartX, arrowStartY + 2);
      ctx.lineTo(arrowStartX + 7, arrowStartY - 14);
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.fillText(`Load: ${loadForce} N`, arrowStartX + 12, arrowStartY - loadArrowLen / 2);

      const frictLen = Math.min(65, Math.max(10, parseFloat(mechanics.frictionForceN) * 0.45));
      ctx.strokeStyle = hasOsteoarthritis ? '#f97316' : '#22c55e';
      ctx.fillStyle = hasOsteoarthritis ? '#f97316' : '#22c55e';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(cx + 35, cy);
      ctx.lineTo(cx + 35 + frictLen, cy);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 35 + frictLen - 6, cy - 5);
      ctx.lineTo(cx + 35 + frictLen + 4, cy);
      ctx.lineTo(cx + 35 + frictLen - 6, cy + 5);
      ctx.closePath();
      ctx.fill();

      ctx.fillText(`F_friction: ${mechanics.frictionForceN} N`, cx + 38, cy - 8);
    }

    // Labels
    if (showLabels) {
      ctx.font = '10.5px Inter, system-ui, sans-serif';
      ctx.lineWidth = 1;

      const drawLabel = (text, targetX, targetY, boxX, boxY, tagColor = '#94a3b8') => {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(boxX, boxY);
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        const txtWidth = ctx.measureText(text).width;
        ctx.fillRect(boxX > targetX ? boxX : boxX - txtWidth - 12, boxY - 10, txtWidth + 12, 18);
        ctx.strokeStyle = tagColor;
        ctx.strokeRect(boxX > targetX ? boxX : boxX - txtWidth - 12, boxY - 10, txtWidth + 12, 18);

        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(text, boxX > targetX ? boxX + 6 : boxX - txtWidth - 6, boxY + 3);

        ctx.beginPath();
        ctx.arc(targetX, targetY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = tagColor;
        ctx.fill();
      };

      if (jointType === 'hinge') {
        drawLabel('Femur (Proximal Epiphysis)', cx, cy - 140, cx - 180, cy - 140, '#94a3b8');
        drawLabel(
          hasOsteoarthritis ? 'Articular Cartilage (Degraded)' : 'Articular (Hyaline) Cartilage',
          cx - 20,
          cy - 8,
          cx - 210,
          cy - 40,
          hasOsteoarthritis ? '#ef4444' : '#38bdf8'
        );
        drawLabel('Synovial Cavity + Viscous Fluid', cx + 15, cy + 2, cx + 110, cy - 20, '#38bdf8');
        drawLabel('Synovial Membrane (Secretes Fluid)', cx + 58, cy + 10, cx + 110, cy + 40, '#ec4899');
        drawLabel('Capsular Ligament (Fibrous Capsule)', cx - 64, cy + 12, cx - 210, cy + 35, '#64748b');
        drawLabel('Tibia / Ulna (Articulating Bone)', cx, cy + 110, cx + 110, cy + 110, '#94a3b8');

        if (hasOsteoarthritis) {
          drawLabel('Osteophyte (Bone Spur)', cx + 62, cy - 16, cx + 115, cy - 70, '#f59e0b');
        }
      } else {
        drawLabel('Pelvis / Scapular Cavity', cx - 60, cy - 75, cx - 190, cy - 90, '#94a3b8');
        drawLabel('Glenoid / Acetabular Cartilage', cx - 30, cy - 35, cx - 195, cy - 30, '#38bdf8');
        drawLabel('Head of Femur / Humerus (Ball)', cx + 25, cy, cx + 120, cy - 50, '#94a3b8');
        drawLabel('Capsular Ligament & Synovial Lining', cx + 52, cy + 40, cx + 120, cy + 60, '#ec4899');

        if (hasOsteoarthritis) {
          drawLabel('Osteophyte Spurs & Bone Abrasion', cx + 45, cy - 48, cx + 120, cy - 90, '#f59e0b');
        }
      }
    }

    ctx.restore();
  }, [
    jointType,
    flexionAngle,
    loadForce,
    hasOsteoarthritis,
    synovialFluidVolume,
    viewAngle3D,
    showCutaway,
    showForceVectors,
    showLabels,
    mechanics,
  ]);

  const handleSelectOption = (questionId, optionId) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setShowFeedback(true);
  };

  const calculateScore = () => {
    let score = 0;
    KCSE_QUESTIONS.forEach((q) => {
      const correctOpt = q.options.find((opt) => opt.correct);
      if (userAnswers[q.id] === correctOpt.id) {
        score += 1;
      }
    });
    setQuizScore(score);

    if (onTelemetry) {
      onTelemetry({
        type: 'quiz_completed',
        simKey: 'synovial_joint_biomechanics_3d',
        score,
        total: KCSE_QUESTIONS.length,
        percentage: Math.round((score / KCSE_QUESTIONS.length) * 100),
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                  KCSE Biology · Form 4
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                  Topic 1: Support & Movement
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
                Synovial Joint Biomechanics & Articulation 3D
              </h1>
            </div>
          </div>

          {/* Preset Buttons & Quick Reset */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setJointType('hinge');
                setFlexionAngle(35);
                setLoadForce(250);
                setHasOsteoarthritis(false);
                setSynovialFluidVolume(100);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                jointType === 'hinge' && !hasOsteoarthritis
                  ? 'bg-cyan-600 border-cyan-400 text-white shadow-md shadow-cyan-900/40'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Hinge Joint (Knee/Elbow)
            </button>
            <button
              onClick={() => {
                setJointType('ball_socket');
                setFlexionAngle(30);
                setLoadForce(350);
                setHasOsteoarthritis(false);
                setSynovialFluidVolume(100);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                jointType === 'ball_socket' && !hasOsteoarthritis
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-900/40'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Ball-and-Socket (Hip/Shoulder)
            </button>
            <button
              onClick={() => {
                setHasOsteoarthritis((prev) => !prev);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                hasOsteoarthritis
                  ? 'bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-900/40 animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              {hasOsteoarthritis ? 'Osteoarthritis Active' : 'Toggle Osteoarthritis'}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN SIMULATION GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / CENTER VIEWPORT (CANVAS + METERS) - 8 COLS */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* 3D Visualizer Canvas Container */}
          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
            {/* Viewport Floating Overlays */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-xs font-mono text-cyan-300 border border-slate-700/60 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                {jointType === 'hinge' ? 'Hinge Joint (1 Degree of Freedom)' : 'Ball & Socket (3 Degrees)'}
              </span>
              {hasOsteoarthritis && (
                <span className="px-2.5 py-1 rounded-xl bg-rose-950/90 text-rose-300 border border-rose-700 text-xs font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Cartilage Erosion & Bone Spurs
                </span>
              )}
            </div>

            {/* Quick Viewport Toggles */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setShowLabels((prev) => !prev)}
                title="Toggle Anatomy Labels"
                className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                  showLabels ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowForceVectors((prev) => !prev)}
                title="Toggle Biomechanical Force Vectors"
                className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                  showForceVectors ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                title={isPlaying ? 'Pause Articulation' : 'Play Continuous Articulation'}
                className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                  isPlaying ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>

            {/* 3D Anatomical Canvas */}
            <canvas
              ref={canvasRef}
              width={760}
              height={460}
              className="w-full h-[460px] block cursor-grab active:cursor-grabbing"
              onMouseMove={(e) => {
                if (e.buttons === 1) {
                  setViewAngle3D((prev) => (prev + e.movementX * 0.4) % 360);
                }
              }}
            />

            {/* Bottom Floating Stats Strip */}
            <div className="absolute bottom-3 inset-x-3 z-10 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                  Articular Friction (μ)
                </span>
                <span
                  className={`text-sm font-mono font-bold ${
                    parseFloat(mechanics.mu) > 0.1 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {mechanics.mu}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                  Cavity Pressure
                </span>
                <span className="text-sm font-mono font-bold text-cyan-300">{mechanics.pressureKPa} kPa</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                  Shear Resistance
                </span>
                <span className="text-sm font-mono font-bold text-amber-300">{mechanics.frictionForceN} N</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                  Shock Dampening
                </span>
                <span
                  className={`text-sm font-mono font-bold ${
                    mechanics.shockAbsorption < 50 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {mechanics.shockAbsorption}%
                </span>
              </div>
            </div>
          </div>

          {/* BIOMECHANICAL CONTROL SLIDERS PANEL */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" /> Articulation & Load Controls
              </h3>
              <button
                onClick={() => {
                  setFlexionAngle(35);
                  setLoadForce(250);
                  setSynovialFluidVolume(100);
                  setHasOsteoarthritis(false);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset Controls
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Flexion Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Flexion / Articulation</span>
                  <span className="font-mono text-cyan-300 font-bold">{Math.round(flexionAngle)}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="135"
                  step="1"
                  value={flexionAngle}
                  onChange={(e) => setFlexionAngle(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0° Extension</span>
                  <span>135° Deep Flexion</span>
                </div>
              </div>

              {/* Compressive Load Force */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Compressive Load Force</span>
                  <span className="font-mono text-amber-300 font-bold">{loadForce} N</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1200"
                  step="10"
                  value={loadForce}
                  onChange={(e) => setLoadForce(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>50 N (Resting)</span>
                  <span>1200 N (Running Impact)</span>
                </div>
              </div>

              {/* Synovial Fluid Volume */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Synovial Fluid Volume</span>
                  <span
                    className={`font-mono font-bold ${
                      synovialFluidVolume < 40 ? 'text-rose-400' : 'text-blue-300'
                    }`}
                  >
                    {synovialFluidVolume}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={synovialFluidVolume}
                  onChange={(e) => setSynovialFluidVolume(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>10% (Starvation)</span>
                  <span>100% (Healthy Viscosity)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (ANATOMY GUIDE & KCSE EXAM CHALLENGE) - 4 COLS */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* TISSUE FUNCTION EXPLORER */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Synovial Joint Functional Anatomy
            </h3>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setSelectedTissue('cartilage')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedTissue === 'cartilage' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cartilage
              </button>
              <button
                onClick={() => setSelectedTissue('membrane')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedTissue === 'membrane' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Membrane
              </button>
              <button
                onClick={() => setSelectedTissue('ligament')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedTissue === 'ligament' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ligament
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs leading-relaxed text-slate-300">
              {selectedTissue === 'cartilage' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> Articular (Hyaline) Cartilage
                  </div>
                  <p>
                    Covers the articulating epiphyses of long bones. Its glass-like, collagen-matrix structure absorbs shock
                    and provides an ultra-low friction bearing surface (μ ≈ 0.005–0.02). Lacks nerves and blood vessels.
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">KCSE Key Fact:</strong> Nutrients diffuse entirely from synovial fluid;
                    hence damage heals extremely slowly.
                  </p>
                </div>
              )}
              {selectedTissue === 'membrane' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-pink-300">
                    <span className="w-2 h-2 rounded-full bg-pink-400" /> Synovial Membrane & Fluid
                  </div>
                  <p>
                    Vascular inner lining of the joint capsule. Secretes clear, viscous, slippery synovial fluid rich in
                    hyaluronic acid into the synovial cavity.
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">KCSE Key Fact:</strong> Acts as a biological shock absorber,
                    lubricates opposing cartilage surfaces, and supplies oxygen/glucose to chondrocytes.
                  </p>
                </div>
              )}
              {selectedTissue === 'ligament' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-slate-400" /> Capsular Ligaments & Tendons
                  </div>
                  <p>
                    Tough, non-elastic fibrous connective tissue composed of parallel collagen fibers that encase the joint.
                    Ligaments connect <strong className="text-cyan-300">bone to bone</strong> to prevent dislocation, while
                    tendons attach muscle to bone.
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">KCSE Key Fact:</strong> High tensile strength holds bones in place
                    while allowing controlled articulation along anatomical planes.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* KCSE EXAM CHALLENGE COMPONENT */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> KCSE Examination Practice
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Q {activeQuestionIdx + 1} of {KCSE_QUESTIONS.length}
                </span>
              </div>

              {/* Question selector tabs */}
              <div className="flex items-center gap-1.5">
                {KCSE_QUESTIONS.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQuestionIdx(idx);
                      setShowFeedback(!!userAnswers[q.id]);
                    }}
                    className={`flex-1 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeQuestionIdx === idx
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : userAnswers[q.id]
                        ? 'bg-slate-800 text-cyan-300'
                        : 'bg-slate-950 text-slate-500 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Active Question Prompt */}
              {(() => {
                const currentQ = KCSE_QUESTIONS[activeQuestionIdx];
                const answeredOptId = userAnswers[currentQ.id];
                const correctOpt = currentQ.options.find((opt) => opt.correct);
                const isCorrect = answeredOptId === correctOpt.id;

                return (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300">{currentQ.title}</h4>
                    <p className="text-xs leading-relaxed text-slate-200">{currentQ.prompt}</p>

                    {/* Options list */}
                    <div className="space-y-2">
                      {currentQ.options.map((opt) => {
                        const isChosen = answeredOptId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectOption(currentQ.id, opt.id)}
                            className={`w-full p-2.5 rounded-2xl text-left text-xs transition-all border cursor-pointer flex items-start gap-2.5 ${
                              isChosen
                                ? opt.correct
                                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-md'
                                  : 'bg-rose-950/60 border-rose-500 text-rose-100 shadow-md'
                                : showFeedback && opt.correct
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
                            <span className="leading-snug">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback Explanation */}
                    {showFeedback && answeredOptId && (
                      <div
                        className={`p-3 rounded-2xl border text-xs leading-relaxed space-y-1 animate-fadeIn ${
                          isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                            : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Correct! Excellent biological reasoning.</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-400" />
                              <span>Incorrect. Review the KCSE marking scheme below:</span>
                            </>
                          )}
                        </div>
                        <p className="text-slate-300 text-[11px] font-sans">{currentQ.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Quiz Summary Action */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              {quizScore !== null ? (
                <span className="text-xs font-semibold text-emerald-400">
                  Score: {quizScore} / {KCSE_QUESTIONS.length} ({Math.round((quizScore / KCSE_QUESTIONS.length) * 100)}%)
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Answer all questions to finalize score</span>
              )}
              <button
                onClick={calculateScore}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer transition-all shadow-md"
              >
                Submit Answers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
