import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Radio,
  Zap,
  Compass,
  Eye,
  Layers,
  Activity,
  Sliders,
  Sparkles,
  ChevronRight,
  BookOpen,
  Info,
  Maximize2,
} from 'lucide-react';

// Fundamental Physics Constants
const C_VACUUM = 299792458; // m/s (~3.0 x 10^8 m/s)
const PLANCK_H = 6.62607015e-34; // J*s
const EV_TO_J = 1.602176634e-19; // J per eV

// Optical & Dielectric Media
const MEDIA = [
  { id: 'vacuum', name: 'Vacuum', n: 1.0, desc: 'Free space (reference, c = 3.0×10⁸ m/s)', color: '#38bdf8' },
  { id: 'air', name: 'Air (STP)', n: 1.0003, desc: 'Atmosphere (n ≈ 1.0003)', color: '#67e8f9' },
  { id: 'water', name: 'Water', n: 1.333, desc: 'Pure liquid water (n = 1.33)', color: '#06b6d4' },
  { id: 'glass', name: 'Crown Glass', n: 1.5, desc: 'Optical crown glass (n = 1.50)', color: '#a855f7' },
  { id: 'diamond', name: 'Diamond', n: 2.417, desc: 'High refractive index crystal (n = 2.42)', color: '#ec4899' },
];

// KCSE Practice Problems
const KCSE_PROBLEMS = [
  {
    id: 'kcse_p1',
    title: 'Problem 1: Radio Wave Wavelength in Vacuum',
    question:
      'A radio transmitter broadcasts FM signals at a frequency of 100 MHz in a vacuum (speed c = 3.0 × 10⁸ m/s). Calculate the wavelength λ of the wave in metres.',
    unit: 'm',
    target: 3.0,
    tolerance: 0.15,
    hint: 'Use the wave equation: c = f × λ  ⟹  λ = c / f. Remember 100 MHz = 100 × 10⁶ Hz = 1.0 × 10⁸ Hz.',
    solutionSteps: [
      'State the wave equation: c = f × λ',
      'Rearrange for wavelength: λ = c / f',
      'Convert frequency to standard SI units: f = 100 MHz = 1.0 × 10⁸ Hz',
      'Substitute values: λ = (3.0 × 10⁸ m/s) / (1.0 × 10⁸ Hz) = 3.0 m',
    ],
  },
  {
    id: 'kcse_p2',
    title: 'Problem 2: Wave Speed in Crown Glass',
    question:
      'An electromagnetic wave enters crown glass of refractive index n = 1.50. Taking the speed of light in vacuum as c = 3.0 × 10⁸ m/s, determine the speed of the wave in the glass (in × 10⁸ m/s).',
    unit: '× 10⁸ m/s',
    target: 2.0,
    tolerance: 0.1,
    hint: 'Use the refractive index relationship: n = c / v  ⟹  v = c / n. Divide 3.0 by 1.50.',
    solutionSteps: [
      'State the refractive index definition: n = c / v',
      'Rearrange for speed inside the medium: v = c / n',
      'Substitute values: v = (3.0 × 10⁸ m/s) / 1.50 = 2.0 × 10⁸ m/s',
      'Notice: Frequency remains unchanged, but wavelength is compressed to λ_medium = λ_vacuum / 1.50.',
    ],
  },
  {
    id: 'kcse_p3',
    title: 'Problem 3: Radar Pulse Frequency',
    question:
      'A marine radar unit transmits microwave pulses with a wavelength of 0.30 m in air (speed v ≈ 3.0 × 10⁸ m/s). Calculate the frequency of the pulse in MHz.',
    unit: 'MHz',
    target: 1000,
    tolerance: 30,
    hint: 'Rearrange v = f × λ  ⟹  f = v / λ. Then convert Hz to MHz by dividing by 10⁶.',
    solutionSteps: [
      'State the wave equation: v = f × λ',
      'Rearrange for frequency: f = v / λ',
      'Substitute: f = (3.0 × 10⁸ m/s) / (0.30 m) = 1.0 × 10⁹ Hz (1.0 GHz)',
      'Convert to MHz: 1.0 × 10⁹ Hz / 10⁶ = 1000 MHz.',
    ],
  },
];

export default function EMWaveOrthogonalFieldsSim({ config = {}, onTelemetry }) {
  // State: Wave parameters
  const [selectedMediumId, setSelectedMediumId] = useState('vacuum');
  const [frequencyMHz, setFrequencyMHz] = useState(300); // 100 MHz to 1000 MHz
  const [amplitude, setAmplitude] = useState(70); // px visual amplitude

  // Visual toggles
  const [fieldMode, setFieldMode] = useState('both'); // 'both' | 'e_only' | 'b_only'
  const [showVectors, setShowVectors] = useState(true);
  const [showRibbons, setShowRibbons] = useState(true);
  const [showPoynting, setShowPoynting] = useState(true);
  const [showDimension, setShowDimension] = useState(true);
  const [showNodes, setShowNodes] = useState(true);

  // Animation controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // 0.25, 0.5, 1.0, 2.0

  // 3D Camera Angles (yaw and pitch in radians)
  // yaw = 0.42, pitch = 0.38 gives classic 3D isometric view
  const [yaw, setYaw] = useState(0.42);
  const [pitch, setPitch] = useState(0.36);
  const [cameraPreset, setCameraPreset] = useState('isometric');

  // Interactive RHR Guide Drawer/Modal
  const [showRHRGuide, setShowRHRGuide] = useState(false);

  // KCSE Practice state
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [practiceStatus, setPracticeStatus] = useState(null); // null | 'correct' | 'incorrect'
  const [showSolution, setShowSolution] = useState(false);

  // Canvas & Animation refs
  const canvasRef = useRef(null);
  const animTimeRef = useRef(0);
  const animFrameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Current medium
  const currentMedium = useMemo(
    () => MEDIA.find((m) => m.id === selectedMediumId) || MEDIA[0],
    [selectedMediumId]
  );

  // Quantitative Physics Computations
  const waveSpeed = useMemo(() => C_VACUUM / currentMedium.n, [currentMedium]);
  const freqHz = useMemo(() => frequencyMHz * 1e6, [frequencyMHz]);
  const wavelengthMeters = useMemo(() => waveSpeed / freqHz, [waveSpeed, freqHz]);
  const photonEnergyJ = useMemo(() => PLANCK_H * freqHz, [freqHz]);
  const photonEnergyEV = useMemo(() => photonEnergyJ / EV_TO_J, [photonEnergyJ]);
  const waveNumberK = useMemo(() => (2 * Math.PI) / wavelengthMeters, [wavelengthMeters]);

  // Handle telemetry reporting
  const logTelemetry = useCallback(
    (eventName, payload) => {
      if (typeof onTelemetry === 'function') {
        onTelemetry(eventName, {
          timestamp: Date.now(),
          simKey: 'em_wave_orthogonal_fields',
          ...payload,
        });
      }
    },
    [onTelemetry]
  );

  // Update medium
  const handleSelectMedium = (medId) => {
    setSelectedMediumId(medId);
    logTelemetry('sim_interaction', {
      action: 'change_medium',
      medium: medId,
      frequencyMHz,
    });
  };

  // Update frequency
  const handleFrequencyChange = (e) => {
    const val = parseFloat(e.target.value);
    setFrequencyMHz(val);
    logTelemetry('sim_interaction', {
      action: 'change_frequency',
      frequencyMHz: val,
    });
  };

  // Direct wavelength slider handler (strictly constrained by v = f * lambda)
  const handleWavelengthChange = (e) => {
    const targetWl = parseFloat(e.target.value);
    if (targetWl > 0) {
      const computedFreqHz = waveSpeed / targetWl;
      const computedFreqMHz = Math.max(100, Math.min(1000, Math.round(computedFreqHz / 1e6)));
      setFrequencyMHz(computedFreqMHz);
      logTelemetry('sim_interaction', {
        action: 'change_wavelength',
        targetWavelengthMeters: targetWl,
        derivedFrequencyMHz: computedFreqMHz,
      });
    }
  };

  // Camera presets
  const applyCameraPreset = (presetKey) => {
    setCameraPreset(presetKey);
    let newYaw = 0.42;
    let newPitch = 0.36;
    if (presetKey === 'isometric') {
      newYaw = 0.42;
      newPitch = 0.36;
    } else if (presetKey === 'side_e') {
      newYaw = 0.0;
      newPitch = 0.0; // Side view: E vertical, Z horizontal, B edge-on
    } else if (presetKey === 'top_b') {
      newYaw = 0.0;
      newPitch = 1.55; // Top-down view: B lateral, Z horizontal, E edge-on
    } else if (presetKey === 'head_on') {
      newYaw = 1.5707;
      newPitch = 0.0; // Looking down the propagation Z-axis (orthogonal cross)
    }
    setYaw(newYaw);
    setPitch(newPitch);
    logTelemetry('sim_interaction', { action: 'set_camera_preset', preset: presetKey });
  };

  // Full reset
  const handleReset = () => {
    setSelectedMediumId('vacuum');
    setFrequencyMHz(300);
    setAmplitude(70);
    setFieldMode('both');
    setShowVectors(true);
    setShowRibbons(true);
    setShowPoynting(true);
    setShowDimension(true);
    setShowNodes(true);
    setIsPlaying(true);
    setPlaybackSpeed(1.0);
    applyCameraPreset('isometric');
    setPracticeStatus(null);
    setUserAnswer('');
    setShowSolution(false);
    animTimeRef.current = 0;
    logTelemetry('sim_interaction', { action: 'reset_simulation' });
  };

  // KCSE check
  const handleCheckPractice = (e) => {
    e.preventDefault();
    const currentProb = KCSE_PROBLEMS[activeProblemIdx];
    const userVal = parseFloat(userAnswer.trim());
    if (isNaN(userVal)) return;

    const isCorrect = Math.abs(userVal - currentProb.target) <= currentProb.tolerance;
    if (isCorrect) {
      setPracticeStatus('correct');
      logTelemetry('practice_correct', {
        problemId: currentProb.id,
        userAnswer: userVal,
        expected: currentProb.target,
        score: 100,
      });
    } else {
      setPracticeStatus('incorrect');
      logTelemetry('practice_incorrect', {
        problemId: currentProb.id,
        userAnswer: userVal,
        expected: currentProb.target,
      });
    }
  };

  // 3D Projection Engine
  // Projects 3D world coordinates (x: B-field, y: E-field, z: propagation) to 2D canvas coordinates
  const project3D = useCallback((x, y, z, cx, cy, currentYaw, currentPitch, zoom = 1.0) => {
    const cosY = Math.cos(currentYaw);
    const sinY = Math.sin(currentYaw);
    // Base frame: screen-X is primarily +Z, screen-Z (depth) is primarily +X
    const wx = z * cosY - x * sinY;
    const wz = z * sinY + x * cosY;
    const wy = y;

    // Pitch rotates around screen horizontal axis
    const cosP = Math.cos(currentPitch);
    const sinP = Math.sin(currentPitch);
    const screenX = wx;
    const screenY = wy * cosP - wz * sinP;
    const screenZ = wy * sinP + wz * cosP;

    const fov = 750;
    const pScale = (fov / (fov + screenZ * 0.3)) * zoom;

    return {
      x: cx + screenX * pScale,
      y: cy - screenY * pScale,
      depth: screenZ,
    };
  }, []);

  // Animation Loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        animTimeRef.current += dt * playbackSpeed;
      }

      renderCanvas();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    isPlaying,
    playbackSpeed,
    frequencyMHz,
    selectedMediumId,
    fieldMode,
    showVectors,
    showRibbons,
    showPoynting,
    showDimension,
    showNodes,
    amplitude,
    yaw,
    pitch,
    project3D,
    wavelengthMeters,
  ]);

  // Main Canvas Rendering Function
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const cx = width * 0.48;
    const cy = height * 0.52;
    const t = animTimeRef.current;

    // 3D Spatial parameters
    const zSpan = 520;
    const zStart = -zSpan / 2;
    const zEnd = zSpan / 2;

    // Visual wavelength scaling:
    // Scale cycles so that at 300 MHz in vacuum, lambda_px = 240px (~2.1 cycles)
    // Refractive index compresses the wavelength in space: lambda_px = lambda_vac / n
    const baseLambdaPx = 240 * (300 / frequencyMHz);
    const lambdaPx = Math.max(65, Math.min(380, baseLambdaPx / currentMedium.n));
    const kVisual = (2 * Math.PI) / lambdaPx;
    const omega = 4.0; // angular frequency for smooth aesthetic motion

    // 1. Draw subtle 3D Reference Floor Grid (horizontal X-Z plane at y = -amplitude - 18)
    const gridY = -amplitude - 16;
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.lineWidth = 1;
    const gridStepsZ = 12;
    const gridStepsX = 6;
    const xSpan = 180;

    for (let i = 0; i <= gridStepsZ; i++) {
      const zPos = zStart + (i / gridStepsZ) * zSpan;
      const p1 = project3D(-xSpan / 2, gridY, zPos, cx, cy, yaw, pitch);
      const p2 = project3D(xSpan / 2, gridY, zPos, cx, cy, yaw, pitch);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    for (let j = 0; j <= gridStepsX; j++) {
      const xPos = -xSpan / 2 + (j / gridStepsX) * xSpan;
      const p1 = project3D(xPos, gridY, zStart, cx, cy, yaw, pitch);
      const p2 = project3D(xPos, gridY, zEnd, cx, cy, yaw, pitch);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // 2. Medium boundary indicator if inside a dielectric medium
    if (currentMedium.n > 1.0) {
      // Draw a translucent dielectric block in the background
      ctx.save();
      const pCorner1 = project3D(-xSpan / 2, amplitude + 24, zStart, cx, cy, yaw, pitch);
      const pCorner2 = project3D(xSpan / 2, amplitude + 24, zStart, cx, cy, yaw, pitch);
      const pCorner3 = project3D(xSpan / 2, gridY, zStart, cx, cy, yaw, pitch);
      const pCorner4 = project3D(-xSpan / 2, gridY, zStart, cx, cy, yaw, pitch);

      ctx.fillStyle = `${currentMedium.color}0a`;
      ctx.strokeStyle = `${currentMedium.color}33`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pCorner1.x, pCorner1.y);
      ctx.lineTo(pCorner2.x, pCorner2.y);
      ctx.lineTo(pCorner3.x, pCorner3.y);
      ctx.lineTo(pCorner4.x, pCorner4.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // 3. Central Propagation Axis (+Z)
    const pAxisStart = project3D(0, 0, zStart - 20, cx, cy, yaw, pitch);
    const pAxisEnd = project3D(0, 0, zEnd + 35, cx, cy, yaw, pitch);

    ctx.save();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pAxisStart.x, pAxisStart.y);
    ctx.lineTo(pAxisEnd.x, pAxisEnd.y);
    ctx.stroke();

    // Arrowhead at +Z axis
    const angleZ = Math.atan2(pAxisEnd.y - pAxisStart.y, pAxisEnd.x - pAxisStart.x);
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(pAxisEnd.x, pAxisEnd.y);
    ctx.lineTo(
      pAxisEnd.x - 12 * Math.cos(angleZ - Math.PI / 6),
      pAxisEnd.y - 12 * Math.sin(angleZ - Math.PI / 6)
    );
    ctx.lineTo(
      pAxisEnd.x - 12 * Math.cos(angleZ + Math.PI / 6),
      pAxisEnd.y - 12 * Math.sin(angleZ + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

    // Axis label
    ctx.font = '600 12px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('+z (Propagation Direction k)', pAxisEnd.x + 8, pAxisEnd.y + 4);
    ctx.restore();

    // 4. Sample wave curves in 3D
    const sampleCount = 180;
    const curvePointsE = [];
    const curvePointsB = [];
    const zeroLinePoints = [];

    for (let i = 0; i <= sampleCount; i++) {
      const zPos = zStart + (i / sampleCount) * zSpan;
      const phase = kVisual * (zPos - zStart) - omega * t;
      const eVal = amplitude * Math.sin(phase);
      const bVal = amplitude * Math.sin(phase);

      const ptZero = project3D(0, 0, zPos, cx, cy, yaw, pitch);
      const ptE = project3D(0, eVal, zPos, cx, cy, yaw, pitch);
      const ptB = project3D(bVal, 0, zPos, cx, cy, yaw, pitch);

      zeroLinePoints.push(ptZero);
      curvePointsE.push({ ...ptE, eVal, zPos });
      curvePointsB.push({ ...ptB, bVal, zPos });
    }

    // 5. Render Translucent Ribbons (Filled Waves)
    if (showRibbons) {
      // Magnetic Field (B) horizontal ribbon (Amber)
      if (fieldMode === 'both' || fieldMode === 'b_only') {
        ctx.save();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.beginPath();
        ctx.moveTo(zeroLinePoints[0].x, zeroLinePoints[0].y);
        for (let i = 0; i <= sampleCount; i++) {
          ctx.lineTo(curvePointsB[i].x, curvePointsB[i].y);
        }
        for (let i = sampleCount; i >= 0; i--) {
          ctx.lineTo(zeroLinePoints[i].x, zeroLinePoints[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Electric Field (E) vertical ribbon (Cyan)
      if (fieldMode === 'both' || fieldMode === 'e_only') {
        ctx.save();
        ctx.fillStyle = 'rgba(6, 182, 212, 0.14)';
        ctx.beginPath();
        ctx.moveTo(zeroLinePoints[0].x, zeroLinePoints[0].y);
        for (let i = 0; i <= sampleCount; i++) {
          ctx.lineTo(curvePointsE[i].x, curvePointsE[i].y);
        }
        for (let i = sampleCount; i >= 0; i--) {
          ctx.lineTo(zeroLinePoints[i].x, zeroLinePoints[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // 6. Render Discrete Field Vector Arrows
    if (showVectors) {
      const vectorCount = 28;
      for (let i = 0; i <= vectorCount; i++) {
        const zPos = zStart + (i / vectorCount) * zSpan;
        const phase = kVisual * (zPos - zStart) - omega * t;
        const eVal = amplitude * Math.sin(phase);
        const bVal = amplitude * Math.sin(phase);

        // Magnetic Field Vectors (horizontal, Amber)
        if (fieldMode === 'both' || fieldMode === 'b_only') {
          if (Math.abs(bVal) > 4) {
            const pStart = project3D(0, 0, zPos, cx, cy, yaw, pitch);
            const pEnd = project3D(bVal, 0, zPos, cx, cy, yaw, pitch);
            draw3DArrow(ctx, pStart, pEnd, '#f59e0b', 1.6, 5);
          }
        }

        // Electric Field Vectors (vertical, Cyan)
        if (fieldMode === 'both' || fieldMode === 'e_only') {
          if (Math.abs(eVal) > 4) {
            const pStart = project3D(0, 0, zPos, cx, cy, yaw, pitch);
            const pEnd = project3D(0, eVal, zPos, cx, cy, yaw, pitch);
            draw3DArrow(ctx, pStart, pEnd, '#06b6d4', 1.8, 5.5);
          }
        }
      }
    }

    // 7. Render Continuous Wave Spine Curves
    // B-Field Spine (Amber)
    if (fieldMode === 'both' || fieldMode === 'b_only') {
      ctx.save();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.4;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(curvePointsB[0].x, curvePointsB[0].y);
      for (let i = 1; i <= sampleCount; i++) {
        ctx.lineTo(curvePointsB[i].x, curvePointsB[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // E-Field Spine (Cyan)
    if (fieldMode === 'both' || fieldMode === 'e_only') {
      ctx.save();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2.8;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(curvePointsE[0].x, curvePointsE[0].y);
      for (let i = 1; i <= sampleCount; i++) {
        ctx.lineTo(curvePointsE[i].x, curvePointsE[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 8. Nodes and Crests Indicators
    if (showNodes) {
      // Find visible crests & nodes
      for (let i = 1; i < sampleCount - 1; i++) {
        const prev = curvePointsE[i - 1].eVal;
        const curr = curvePointsE[i].eVal;
        const next = curvePointsE[i + 1].eVal;

        // Crest (local maximum)
        if (curr > 0 && curr >= prev && curr >= next && curr > amplitude * 0.95) {
          const pt = curvePointsE[i];
          ctx.save();
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.font = 'bold 10px monospace';
          ctx.fillStyle = '#7dd3fc';
          ctx.fillText('+Emax', pt.x - 16, pt.y - 8);
          ctx.restore();
        }

        // Zero-crossing Node
        if ((prev < 0 && next > 0) || (prev > 0 && next < 0)) {
          const ptZero = zeroLinePoints[i];
          ctx.save();
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.arc(ptZero.x, ptZero.y, 3, 0, 2 * Math.PI);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // 9. Wavelength Dimension Bracket (between two consecutive crests)
    if (showDimension && (fieldMode === 'both' || fieldMode === 'e_only')) {
      // Find two consecutive positive peaks of E
      let crest1Z = null;
      let crest2Z = null;

      for (let i = 1; i < sampleCount - 1; i++) {
        const prev = curvePointsE[i - 1].eVal;
        const curr = curvePointsE[i].eVal;
        const next = curvePointsE[i + 1].eVal;
        if (curr > 0 && curr >= prev && curr >= next && curr > amplitude * 0.95) {
          if (crest1Z === null) {
            crest1Z = curvePointsE[i].zPos;
          } else if (crest2Z === null && Math.abs(curvePointsE[i].zPos - crest1Z) > lambdaPx * 0.7) {
            crest2Z = curvePointsE[i].zPos;
            break;
          }
        }
      }

      if (crest1Z !== null && crest2Z !== null) {
        const bracketY = amplitude + 24;
        const pBracket1 = project3D(0, bracketY, crest1Z, cx, cy, yaw, pitch);
        const pBracket2 = project3D(0, bracketY, crest2Z, cx, cy, yaw, pitch);
        const pCrestTip1 = project3D(0, amplitude, crest1Z, cx, cy, yaw, pitch);
        const pCrestTip2 = project3D(0, amplitude, crest2Z, cx, cy, yaw, pitch);

        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.6;
        ctx.setLineDash([3, 3]);

        // Vertical tick lines from crests to bracket
        ctx.beginPath();
        ctx.moveTo(pCrestTip1.x, pCrestTip1.y);
        ctx.lineTo(pBracket1.x, pBracket1.y);
        ctx.moveTo(pCrestTip2.x, pCrestTip2.y);
        ctx.lineTo(pBracket2.x, pBracket2.y);
        ctx.stroke();

        ctx.setLineDash([]);
        // Main horizontal dimension line
        ctx.beginPath();
        ctx.moveTo(pBracket1.x, pBracket1.y);
        ctx.lineTo(pBracket2.x, pBracket2.y);
        ctx.stroke();

        // End chevrons
        drawChevron(ctx, pBracket1, pBracket2, 6);
        drawChevron(ctx, pBracket2, pBracket1, 6);

        // Wavelength label pill
        const midX = (pBracket1.x + pBracket2.x) / 2;
        const midY = (pBracket1.y + pBracket2.y) / 2 - 12;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        const text = `λ = ${wavelengthMeters.toFixed(2)} m`;
        ctx.font = '600 11px monospace';
        const tw = ctx.measureText(text).width;
        ctx.beginPath();
        ctx.roundRect(midX - tw / 2 - 6, midY - 10, tw + 12, 20, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.fillText(text, midX - tw / 2, midY + 4);
        ctx.restore();
      }
    }

    // 10. Poynting Vector S = (1/mu0) * (E x B) at the wave leading edge
    if (showPoynting) {
      const pSStart = project3D(0, 0, zEnd, cx, cy, yaw, pitch);
      const pSEnd = project3D(0, 0, zEnd + 55, cx, cy, yaw, pitch);

      ctx.save();
      // Draw thick glowing Poynting vector
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 10;
      draw3DArrow(ctx, pSStart, pSEnd, '#ec4899', 3.2, 8);

      // Poynting label
      ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = '#f472b6';
      ctx.fillText('S = (1/μ₀)(E × B)', pSEnd.x + 8, pSEnd.y - 6);
      ctx.font = '500 10px ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = '#fbcfe8';
      ctx.fillText('[Poynting Energy Flux]', pSEnd.x + 8, pSEnd.y + 8);
      ctx.restore();
    }

    // 11. Coordinate Tripod in bottom-left corner
    drawOrientationTripod(ctx, 60, height - 60, yaw, pitch, project3D);

    ctx.restore();
  };

  // Helper: Draw 3D arrow on canvas
  const draw3DArrow = (ctx, pStart, pEnd, color, lineWidth = 2, headSize = 6) => {
    const dx = pEnd.x - pStart.x;
    const dy = pEnd.y - pStart.y;
    const len = Math.hypot(dx, dy);
    if (len < 1) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(pStart.x, pStart.y);
    ctx.lineTo(pEnd.x, pEnd.y);
    ctx.stroke();

    // Arrowhead cone
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(pEnd.x, pEnd.y);
    ctx.lineTo(
      pEnd.x - headSize * Math.cos(angle - Math.PI / 6),
      pEnd.y - headSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      pEnd.x - headSize * Math.cos(angle + Math.PI / 6),
      pEnd.y - headSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  // Helper: Dimension chevron
  const drawChevron = (ctx, pAt, pTowards, size) => {
    const angle = Math.atan2(pTowards.y - pAt.y, pTowards.x - pAt.x);
    ctx.beginPath();
    ctx.moveTo(
      pAt.x + size * Math.cos(angle - Math.PI / 5),
      pAt.y + size * Math.sin(angle - Math.PI / 5)
    );
    ctx.lineTo(pAt.x, pAt.y);
    ctx.lineTo(
      pAt.x + size * Math.cos(angle + Math.PI / 5),
      pAt.y + size * Math.sin(angle + Math.PI / 5)
    );
    ctx.stroke();
  };

  // Helper: Orientation Tripod indicator in corner
  const drawOrientationTripod = (ctx, originX, originY, curYaw, curPitch, projFn) => {
    const axisLen = 30;
    const pOrigin = { x: originX, y: originY };
    const pX = projFn(axisLen, 0, 0, originX, originY, curYaw, curPitch, 1.0);
    const pY = projFn(0, axisLen, 0, originX, originY, curYaw, curPitch, 1.0);
    const pZ = projFn(0, 0, axisLen, originX, originY, curYaw, curPitch, 1.0);

    ctx.save();
    // Background circle
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.beginPath();
    ctx.arc(originX, originY, 40, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    // +X (B-field, Amber)
    draw3DArrow(ctx, pOrigin, pX, '#f59e0b', 1.8, 5);
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('B (x)', pX.x + 3, pX.y + 3);

    // +Y (E-field, Cyan)
    draw3DArrow(ctx, pOrigin, pY, '#06b6d4', 1.8, 5);
    ctx.fillStyle = '#06b6d4';
    ctx.fillText('E (y)', pY.x - 3, pY.y - 4);

    // +Z (k / Poynting, Slate/White)
    draw3DArrow(ctx, pOrigin, pZ, '#cbd5e1', 1.8, 5);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('k (z)', pZ.x + 4, pZ.y + 4);

    ctx.restore();
  };

  // Interactive Mouse/Touch Rotation handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    // Rotate camera: dx affects yaw, dy affects pitch
    setYaw((prev) => prev - dx * 0.007);
    setPitch((prev) => Math.max(-1.4, Math.min(1.4, prev + dy * 0.007)));
    setCameraPreset('custom');
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMousePosRef.current.x;
    const dy = e.touches[0].clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setYaw((prev) => prev - dx * 0.007);
    setPitch((prev) => Math.max(-1.4, Math.min(1.4, prev + dy * 0.007)));
    setCameraPreset('custom');
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-3xl p-4 sm:p-6 md:p-8 space-y-6 font-sans border border-slate-800 shadow-2xl">
      {/* 1. Header with Topic Badge, Title, and Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Radio className="w-3.5 h-3.5" /> Form 4 Physics • Topic 4: EM Spectrum
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Zap className="w-3.5 h-3.5" /> Maxwell Wave Equation
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-400 bg-clip-text text-transparent">
            Orthogonal EM Wave Fields & Wave Equation
          </h2>
          <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
            Investigate transverse electromagnetic wave propagation: mutually perpendicular electric (<span className="text-cyan-400 font-semibold">E</span>) and magnetic (<span className="text-amber-400 font-semibold">B</span>) field oscillations, Poynting energy flux vector (<span className="text-pink-400 font-semibold">S</span>), speed of light across optical media (<span className="text-sky-300 font-semibold">v = c / n</span>), and photon energetics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowRHRGuide(!showRHRGuide)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              showRHRGuide
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Right-Hand Rule Guide
          </button>

          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Reset simulation parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* 2. Interactive Visual Stage (3D Canvas + Overlay Controls) */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-inner">
        {/* Floating Camera Perspective Selector */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
            <Eye className="w-3 h-3 text-cyan-400" /> View:
          </span>
          {[
            { id: 'isometric', label: '3D Isometric' },
            { id: 'side_e', label: 'Side (E-Plane)' },
            { id: 'top_b', label: 'Top (B-Plane)' },
            { id: 'head_on', label: 'Axial (E ⟂ B)' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyCameraPreset(preset.id)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                cameraPreset === preset.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Floating Animation Bar */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-colors"
            title={isPlaying ? 'Pause Wave' : 'Play Wave'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 px-1">
            {[0.5, 1.0, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  playbackSpeed === spd
                    ? 'bg-slate-700 text-cyan-400 font-bold'
                    : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* 3D Canvas Visualizer */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-[380px] sm:h-[450px] md:h-[480px] cursor-grab active:cursor-grabbing block"
        />

        {/* Live On-Screen Telemetry Badges */}
        <div className="absolute bottom-3 right-3 z-10 flex flex-col sm:flex-row items-end sm:items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-slate-400">Medium:</span>
            <span className="font-semibold text-slate-200">{currentMedium.name} (n = {currentMedium.n})</span>
          </div>
          <span className="hidden sm:inline text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Wave Speed v:</span>
            <span className="font-mono font-bold text-sky-400">
              {(waveSpeed / 1e8).toFixed(3)} × 10⁸ m/s
            </span>
          </div>
          <span className="hidden sm:inline text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Wavelength λ:</span>
            <span className="font-mono font-bold text-amber-400">
              {wavelengthMeters.toFixed(3)} m
            </span>
          </div>
        </div>

        {/* Drag Hint Tooltip */}
        <div className="absolute bottom-3 left-24 z-10 hidden md:flex items-center gap-1 text-[10px] text-slate-500 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800/60">
          <Activity className="w-3 h-3 text-cyan-400/70" /> Drag anywhere to orbit 3D view
        </div>
      </div>

      {/* 3. Field Display & Layer Toggles Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center justify-between col-span-2 sm:col-span-3 md:col-span-2 px-2">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Active Fields:
          </span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFieldMode('both')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                fieldMode === 'both'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              E & B
            </button>
            <button
              onClick={() => setFieldMode('e_only')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                fieldMode === 'e_only'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              E-Field
            </button>
            <button
              onClick={() => setFieldMode('b_only')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                fieldMode === 'b_only'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              B-Field
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowVectors(!showVectors)}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border transition-all ${
            showVectors
              ? 'bg-slate-800 text-cyan-300 border-cyan-500/30 font-semibold'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${showVectors ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
          Field Vectors
        </button>

        <button
          onClick={() => setShowRibbons(!showRibbons)}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border transition-all ${
            showRibbons
              ? 'bg-slate-800 text-amber-300 border-amber-500/30 font-semibold'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${showRibbons ? 'bg-amber-400' : 'bg-slate-600'}`}></span>
          Wave Ribbon
        </button>

        <button
          onClick={() => setShowPoynting(!showPoynting)}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border transition-all ${
            showPoynting
              ? 'bg-slate-800 text-pink-300 border-pink-500/30 font-semibold'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${showPoynting ? 'bg-pink-400' : 'bg-slate-600'}`}></span>
          Poynting Flux (S)
        </button>

        <button
          onClick={() => setShowDimension(!showDimension)}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border transition-all ${
            showDimension
              ? 'bg-slate-800 text-sky-300 border-sky-500/30 font-semibold'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${showDimension ? 'bg-sky-400' : 'bg-slate-600'}`}></span>
          Wavelength (λ)
        </button>
      </div>

      {/* 4. Real-time Control Sliders & Medium Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Optical Media Selector (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Propagation Medium (Refractive Index n)
            </label>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              v = c / n
            </span>
          </div>

          <div className="space-y-2">
            {MEDIA.map((med) => {
              const isSelected = med.id === selectedMediumId;
              const calculatedV = C_VACUUM / med.n;
              const calculatedWl = calculatedV / freqHz;
              return (
                <button
                  key={med.id}
                  onClick={() => handleSelectMedium(med.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/60 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                      : 'bg-slate-950/60 hover:bg-slate-800/50 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 text-sm">{med.name}</span>
                      <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700">
                        n = {med.n}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{med.desc}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-mono font-semibold text-cyan-400">
                      {(calculatedV / 1e8).toFixed(2)} × 10⁸ m/s
                    </span>
                    <span className="block text-[10px] font-mono text-amber-400">
                      λ = {calculatedWl.toFixed(2)} m
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-[11px] text-cyan-300 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-cyan-200">KCSE Key Principle:</strong> When an EM wave transitions into an optically denser medium, its frequency (<code className="font-mono text-amber-300">f</code>) remains constant (determined by the transmitter source), while its velocity (<code className="font-mono text-sky-300">v = c/n</code>) and wavelength (<code className="font-mono text-cyan-300">λ = v/f</code>) shrink proportionally!
            </div>
          </div>
        </div>

        {/* Right Column: High-Precision Sliders (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-6">
          {/* Slider 1: Frequency f */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <label className="text-sm font-bold text-slate-200">Frequency (f)</label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-cyan-500/30">
                  {frequencyMHz} MHz
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {(freqHz / 1e8).toFixed(2)} × 10⁸ Hz
                </span>
              </div>
            </div>

            <input
              type="range"
              min={100}
              max={1000}
              step={10}
              value={frequencyMHz}
              onChange={handleFrequencyChange}
              className="w-full h-2 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
            />

            <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
              <span>100 MHz (FM Radio)</span>
              <span>300 MHz (VHF)</span>
              <span>600 MHz (UHF TV)</span>
              <span>1000 MHz (1 GHz)</span>
            </div>
          </div>

          {/* Slider 2: Wavelength lambda (Strictly Constrained) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <label className="text-sm font-bold text-slate-200">
                  Wavelength (λ = v / f)
                </label>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-amber-500/30">
                {wavelengthMeters.toFixed(3)} metres
              </span>
            </div>

            <input
              type="range"
              min={waveSpeed / 1e9} // 1000 MHz
              max={waveSpeed / 1e8} // 100 MHz
              step={0.01}
              value={wavelengthMeters}
              onChange={handleWavelengthChange}
              className="w-full h-2 rounded-lg bg-slate-800 accent-amber-400 cursor-pointer"
            />

            <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
              <span>{(waveSpeed / 1e9).toFixed(2)} m (Short wave)</span>
              <span className="text-amber-400/80 font-sans text-[10px]">
                Strictly constrained by v = f × λ
              </span>
              <span>{(waveSpeed / 1e8).toFixed(2)} m (Long wave)</span>
            </div>
          </div>

          {/* Slider 3: Visual Field Amplitude */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-300">
                Field Amplitude (E₀ / B₀ visual scale)
              </label>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                {amplitude} px
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={100}
              step={5}
              value={amplitude}
              onChange={(e) => setAmplitude(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-800 accent-slate-400 cursor-pointer"
            />
          </div>

          {/* Frequency Presets Chips */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 text-[11px] font-semibold">Quick Presets:</span>
            {[
              { label: 'FM Broadcast (100 MHz)', f: 100 },
              { label: 'Aviation Band (300 MHz)', f: 300 },
              { label: 'Cellular Band (800 MHz)', f: 800 },
              { label: 'Microwave Radar (1000 MHz)', f: 1000 },
            ].map((preset) => (
              <button
                key={preset.f}
                onClick={() => setFrequencyMHz(preset.f)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                  frequencyMHz === preset.f
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Quantitative Telemetry & Formula Readout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Wave Speed in Medium */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Wave Speed</span>
            <span className="font-mono text-cyan-400">v = c / n</span>
          </div>
          <div className="text-2xl font-mono font-bold text-cyan-400">
            {(waveSpeed / 1e8).toFixed(3)}
            <span className="text-xs font-sans text-slate-400 ml-1.5">× 10⁸ m/s</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Vacuum reference: <code className="font-mono text-slate-300">3.00 × 10⁸ m/s</code>. Reduced by factor <code className="font-mono text-cyan-300">n = {currentMedium.n}</code>.
          </p>
        </div>

        {/* Card 2: Wavelength */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Wavelength in Medium</span>
            <span className="font-mono text-amber-400">λ = v / f</span>
          </div>
          <div className="text-2xl font-mono font-bold text-amber-400">
            {wavelengthMeters.toFixed(3)}
            <span className="text-xs font-sans text-slate-400 ml-1.5">metres</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Spatial period between consecutive field crests in {currentMedium.name}.
          </p>
        </div>

        {/* Card 3: Photon Energy E = hf */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Photon Quantum Energy</span>
            <span className="font-mono text-pink-400">E = h × f</span>
          </div>
          <div className="text-2xl font-mono font-bold text-pink-400">
            {(photonEnergyEV * 1e6).toFixed(3)}
            <span className="text-xs font-sans text-slate-400 ml-1.5">μeV</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            = {(photonEnergyJ * 1e25).toFixed(2)} × 10⁻²⁵ Joules
          </div>
        </div>

        {/* Card 4: Transverse Orthogonality */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Vector Perpendicularity</span>
            <span className="font-mono text-emerald-400">E ⟂ B ⟂ k</span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">
            90.0°
            <span className="text-xs font-sans text-slate-400 ml-1.5">phase match (0°)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Electric & magnetic fields oscillate in phase: <code className="font-mono text-emerald-300">E·B = 0</code>.
          </p>
        </div>
      </div>

      {/* 6. Expandable Right-Hand Rule & Vector Physics Guide */}
      {showRHRGuide && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              Right-Hand Rule & Vector Orthogonality Guide
            </h3>
            <button
              onClick={() => setShowRHRGuide(false)}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg bg-slate-800"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-1.5">
              <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span> 1. Outstretched Fingers (E)
              </div>
              <p className="text-slate-300 leading-relaxed">
                Align your right-hand fingers pointing along the <strong>Electric Field vector (E)</strong> in the vertical y-plane.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> 2. Curl Toward B-Field
              </div>
              <p className="text-slate-300 leading-relaxed">
                Curl your fingers by 90° towards the <strong>Magnetic Field vector (B)</strong> oscillating along the horizontal x-plane.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-pink-500/30 space-y-1.5">
              <div className="font-bold text-pink-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-400"></span> 3. Outstretched Thumb (S, k)
              </div>
              <p className="text-slate-300 leading-relaxed">
                Your outstretched thumb points directly in the direction of wave travel (<strong>+z</strong>), identical to the <strong>Poynting Vector (S = (1/μ₀)(E × B))</strong>.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1 font-mono">
            <div className="text-slate-300 font-bold">Vector Verification Proof:</div>
            <div>• E · B = (0)(Bx) + (Ey)(0) + (0)(0) = 0  ⟹  Strictly orthogonal (90°)</div>
            <div>• E · k = 0  and  B · k = 0  ⟹  Transverse wave (no longitudinal component)</div>
            <div>• S = (1/μ₀)(E × B)  ⟹  Directs energy flux in direction of propagation +z</div>
          </div>
        </div>
      )}

      {/* 7. Interactive KCSE Practice Challenge */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-1.5">
              <BookOpen className="w-3.5 h-3.5" /> KCSE Examination Challenge
            </span>
            <h3 className="text-base font-bold text-slate-100">
              Wave Equation & Medium Refraction Practice
            </h3>
          </div>

          {/* Problem selector tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {KCSE_PROBLEMS.map((prob, idx) => (
              <button
                key={prob.id}
                onClick={() => {
                  setActiveProblemIdx(idx);
                  setPracticeStatus(null);
                  setUserAnswer('');
                  setShowSolution(false);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeProblemIdx === idx
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Q{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Problem Prompt */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="text-xs font-bold text-emerald-400">
              {KCSE_PROBLEMS[activeProblemIdx].title}
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {KCSE_PROBLEMS[activeProblemIdx].question}
            </p>
          </div>

          <form onSubmit={handleCheckPractice} className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <input
                type="number"
                step="any"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter numerical answer..."
                className="w-full bg-slate-950 text-slate-100 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                {KCSE_PROBLEMS[activeProblemIdx].unit}
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-lg shadow-emerald-500/10 flex items-center gap-2"
            >
              Check Answer
            </button>

            <button
              type="button"
              onClick={() => setShowSolution(!showSolution)}
              className="px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {showSolution ? 'Hide Marking Scheme' : 'View Step-by-Step Solution'}
            </button>
          </form>

          {/* Feedback states */}
          {practiceStatus === 'correct' && (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <strong>Excellent work! That is correct.</strong> Wavelength and speed conform exactly to Maxwell's wave equation.
              </div>
            </div>
          )}

          {practiceStatus === 'incorrect' && (
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-3 animate-fade-in">
              <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <div>
                <strong>Incorrect value.</strong> {KCSE_PROBLEMS[activeProblemIdx].hint}
              </div>
            </div>
          )}

          {/* Detailed KCSE Solution Steps */}
          {showSolution && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                KCSE Marking Scheme & Step-by-Step Solution:
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-400 font-mono">
                {KCSE_PROBLEMS[activeProblemIdx].solutionSteps.map((step, sIdx) => (
                  <li key={sIdx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
