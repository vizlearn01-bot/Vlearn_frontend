import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, Activity, Sliders, Zap } from 'lucide-react';

const Y_GAIN_SETTINGS = [0.5, 1.0, 2.0, 5.0, 10.0]; // Volts / div
const TIME_BASE_SETTINGS = [
  { label: 'OFF', value: 0 },
  { label: '0.2 ms/div', value: 0.2 },
  { label: '0.5 ms/div', value: 0.5 },
  { label: '1.0 ms/div', value: 1.0 },
  { label: '2.0 ms/div', value: 2.0 },
  { label: '5.0 ms/div', value: 5.0 },
  { label: '10.0 ms/div', value: 10.0 },
];

export default function CROWaveformDiagnosticsSim({ config = {}, onTelemetry }) {
  const [yGain, setYGain] = useState(2.0); // V/div
  const [timeBaseIdx, setTimeBaseIdx] = useState(3); // default 1.0 ms/div
  const [signalWave, setSignalWave] = useState('sine'); // 'sine' | 'square' | 'dc'
  const [peakVoltage, setPeakVoltage] = useState(6.0); // Volts (V0)
  const [frequencyHz, setFrequencyHz] = useState(250); // Hz
  const [isPlaying, setIsPlaying] = useState(true);

  // Exam questions
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [userAns, setUserAns] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  const timeBase = TIME_BASE_SETTINGS[timeBaseIdx];
  const screenW = 320;
  const screenH = 240;
  const numXDivs = 10;
  const numYDivs = 8;
  const divPx = 30; // 300px wide (10 divs) x 240px high (8 divs)

  // Wave period T in ms = 1000 / f
  const periodMs = 1000 / frequencyHz;
  const peakToPeakV = signalWave === 'dc' ? peakVoltage : 2 * peakVoltage;
  const verticalDivisions = (peakToPeakV / yGain).toFixed(1);
  const horizontalDivisionsPerCycle = timeBase.value > 0 ? (periodMs / timeBase.value).toFixed(1) : 0;

  // Animation phase
  const phaseRef = useRef(0);
  const animFrameRef = useRef(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let last = performance.now();
    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      if (isPlaying && timeBase.value > 0) {
        phaseRef.current += 2 * Math.PI * frequencyHz * dt;
        setPhase(phaseRef.current);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, frequencyHz, timeBase.value]);

  const handleReset = () => {
    setYGain(2.0);
    setTimeBaseIdx(3);
    setSignalWave('sine');
    setPeakVoltage(6.0);
    setFrequencyHz(250);
    setIsPlaying(true);
    setQuizStatus(null);
    setUserAns('');
  };

  // Generate phosphor trace
  const getTracePath = () => {
    const cy = screenH / 2;
    const cx = screenW / 2;

    // Mode: Time base OFF -> No horizontal sweep
    if (timeBase.value === 0) {
      if (signalWave === 'dc') {
        // Single static dot displaced vertically
        const yOffset = -(peakVoltage / yGain) * divPx;
        return { type: 'dot', x: cx, y: cy + yOffset };
      } else {
        // Vertical line representing peak-to-peak swing
        const peakPx = (peakVoltage / yGain) * divPx;
        return {
          type: 'line',
          x1: cx,
          y1: cy - peakPx,
          x2: cx,
          y2: cy + peakPx,
        };
      }
    }

    // Time base ON -> Continuous sweep along X axis
    const points = [];
    const totalTimeMs = numXDivs * timeBase.value; // total sweep time across screen
    const steps = 200;

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * (numXDivs * divPx) + 10;
      const tMs = (i / steps) * totalTimeMs;
      let vInst = 0;

      if (signalWave === 'sine') {
        const theta = (2 * Math.PI * tMs) / periodMs + phase;
        vInst = peakVoltage * Math.sin(theta);
      } else if (signalWave === 'square') {
        const theta = (2 * Math.PI * tMs) / periodMs + phase;
        vInst = Math.sin(theta) >= 0 ? peakVoltage : -peakVoltage;
      } else if (signalWave === 'dc') {
        vInst = peakVoltage;
      }

      // Vertical deflection in pixels (up is negative Y in SVG)
      const y = cy - (vInst / yGain) * divPx;
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    return { type: 'path', d: 'M ' + points.join(' L ') };
  };

  const trace = getTracePath();

  const QUESTIONS = [
    {
      prompt: 'With Y-Gain at 2.0 V/div, a waveform occupies 6 vertical divisions peak-to-peak. What is the peak voltage (V0)?',
      ans: 6.0,
      unit: 'V',
      explanation: 'Vp-p = 6 divs × 2 V/div = 12 V. Peak voltage V0 = 12 / 2 = 6.0 V.',
    },
    {
      prompt: 'With Time-Base at 1.0 ms/div, 1 complete cycle occupies 4 horizontal divisions. What is the signal frequency?',
      ans: 250,
      unit: 'Hz',
      explanation: 'Period T = 4 divs × 1.0 ms = 4.0 ms = 0.004 s. Frequency f = 1 / 0.004 = 250 Hz.',
    },
    {
      prompt: 'When Time-Base is switched OFF, an AC input produces a vertical line of 8 divisions. What is Vrms if Y-Gain is 5 V/div?',
      ans: 14.14,
      unit: 'V',
      tolerance: 0.5,
      explanation: 'Vp-p = 8 × 5 = 40 V. V0 = 20 V. Vrms = 20 / √2 ≈ 14.14 V.',
    },
  ];

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const cur = QUESTIONS[activeQuestion];
    const val = parseFloat(userAns.trim());
    const tol = cur.tolerance || 0.1;
    if (Math.abs(val - cur.ans) <= tol) {
      setQuizStatus('correct');
      if (onTelemetry) onTelemetry('cro_quiz_correct', { q: activeQuestion });
    } else {
      setQuizStatus('incorrect');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              PHYSICS FORM 4 • TOPIC 7
            </span>
            <span className="text-xs text-slate-400 font-mono">Signal Diagnostics Suite</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            Cathode Ray Oscilloscope (CRO) Waveform & Diagnostics Simulator
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Oscilloscope
        </button>
      </div>

      {/* Main CRO Instrument Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Phosphor Graticule Screen (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border-2 border-slate-800 p-4 sm:p-5 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="w-full flex justify-between items-center mb-2 px-1 text-xs">
            <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> 8×10 cm Calibrated Graticule Display
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              Y-Gain: <strong className="text-emerald-300">{yGain} V/div</strong> | X-Base: <strong className="text-cyan-300">{timeBase.label}</strong>
            </span>
          </div>

          {/* Graticule Display Box */}
          <div className="w-full max-w-[340px] aspect-[10/8] bg-black rounded-xl border-2 border-emerald-950 p-1 relative overflow-hidden shadow-inner shadow-emerald-950 flex items-center justify-center">
            <svg viewBox={`0 0 ${screenW} ${screenH}`} className="w-full h-full">
              {/* Dark Green Grid Lines */}
              {Array.from({ length: numXDivs + 1 }).map((_, i) => {
                const x = 10 + i * divPx;
                const isCenter = i === numXDivs / 2;
                return (
                  <line
                    key={`v-${i}`}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={screenH}
                    stroke="#064e3b"
                    strokeWidth={isCenter ? '1.5' : '0.75'}
                    strokeDasharray={isCenter ? '' : '1 3'}
                  />
                );
              })}

              {Array.from({ length: numYDivs + 1 }).map((_, i) => {
                const y = i * divPx;
                const isCenter = i === numYDivs / 2;
                return (
                  <line
                    key={`h-${i}`}
                    x1={10}
                    y1={y}
                    x2={10 + numXDivs * divPx}
                    y2={y}
                    stroke="#064e3b"
                    strokeWidth={isCenter ? '1.5' : '0.75'}
                    strokeDasharray={isCenter ? '' : '1 3'}
                  />
                );
              })}

              {/* Sub-division ticks on center axes */}
              {Array.from({ length: numXDivs * 5 + 1 }).map((_, i) => {
                const x = 10 + (i * divPx) / 5;
                const cy = screenH / 2;
                return <line key={`tick-x-${i}`} x1={x} y1={cy - 2} x2={x} y2={cy + 2} stroke="#047857" strokeWidth="1" />;
              })}
              {Array.from({ length: numYDivs * 5 + 1 }).map((_, i) => {
                const y = (i * divPx) / 5;
                const cx = 10 + (numXDivs / 2) * divPx;
                return <line key={`tick-y-${i}`} x1={cx - 2} y1={y} x2={cx + 2} y2={y} stroke="#047857" strokeWidth="1" />;
              })}

              {/* Electron Beam Phosphor Waveform */}
              {trace.type === 'path' && (
                <path
                  d={trace.d}
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_8px_rgba(74,222,128,0.85)]"
                />
              )}

              {trace.type === 'line' && (
                <line
                  x1={trace.x1}
                  y1={trace.y1}
                  x2={trace.x2}
                  y2={trace.y2}
                  stroke="#4ade80"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_10px_rgba(74,222,128,1)]"
                />
              )}

              {trace.type === 'dot' && (
                <circle
                  cx={trace.x}
                  cy={trace.y}
                  r="4.5"
                  fill="#4ade80"
                  className="drop-shadow-[0_0_10px_rgba(74,222,128,1)]"
                />
              )}
            </svg>
          </div>

          {/* Educational Observation Bar */}
          <div className="w-full mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-300 flex justify-between items-center">
            <span>
              Peak-to-Peak Height: <strong className="text-emerald-400 font-mono">{verticalDivisions} divs</strong> ({peakToPeakV.toFixed(1)} V)
            </span>
            <span>
              1 Cycle Width: <strong className="text-cyan-400 font-mono">{horizontalDivisionsPerCycle} divs</strong> ({periodMs.toFixed(1)} ms)
            </span>
          </div>
        </div>

        {/* Oscilloscope Hardware Knobs & Signal Controls (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Signal Generator Panel */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Signal Generator Input
            </div>

            {/* Waveform Selector */}
            <div className="flex gap-1.5">
              {['sine', 'square', 'dc'].map((w) => (
                <button
                  key={w}
                  onClick={() => setSignalWave(w)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    signalWave === w
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            {/* Voltage Amplitude Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Signal Amplitude (V0):</span>
                <span className="font-mono font-bold text-emerald-400">{peakVoltage} V</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.5"
                value={peakVoltage}
                onChange={(e) => setPeakVoltage(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Frequency Slider (only for AC) */}
            {signalWave !== 'dc' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Frequency:</span>
                  <span className="font-mono font-bold text-cyan-400">{frequencyHz} Hz (T = {periodMs.toFixed(1)} ms)</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={frequencyHz}
                  onChange={(e) => setFrequencyHz(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* CRO Hardware Attenuator Knobs */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-cyan-400" /> Calibrated Dial Controls
            </div>

            {/* Y-Gain Sensitivity */}
            <div>
              <div className="text-xs text-slate-400 mb-1.5">Y-Gain Sensitivity (Volts/div):</div>
              <div className="grid grid-cols-5 gap-1">
                {Y_GAIN_SETTINGS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setYGain(g)}
                    className={`py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      yGain === g
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {g}V
                  </button>
                ))}
              </div>
            </div>

            {/* Time-Base Knob */}
            <div>
              <div className="text-xs text-slate-400 mb-1.5">Time-Base Selector (Sweep Speed):</div>
              <div className="grid grid-cols-4 gap-1">
                {TIME_BASE_SETTINGS.map((tb, idx) => (
                  <button
                    key={tb.label}
                    onClick={() => setTimeBaseIdx(idx)}
                    className={`py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                      timeBaseIdx === idx
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KCSE Graticule Reading Exam Module */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              KCSE Waveform Calculation Challenge
            </h3>
          </div>
          <div className="flex gap-1.5">
            {QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveQuestion(i);
                  setQuizStatus(null);
                  setUserAns('');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeQuestion === i ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Q{i + 1}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          {QUESTIONS[activeQuestion].prompt}
        </p>

        <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            step="0.01"
            placeholder={`Value in ${QUESTIONS[activeQuestion].unit}`}
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500 w-36"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Submit Answer
          </button>
          {quizStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Spot on! {QUESTIONS[activeQuestion].explanation}
            </span>
          )}
          {quizStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Incorrect. Check your vertical/horizontal division formula!
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
