import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, Sliders, Sparkles, Zap, Activity } from 'lucide-react';

export default function PNJunctionRectificationSim({ config = {}, onTelemetry }) {
  const [circuitMode, setCircuitMode] = useState('bridge'); // 'half' | 'bridge'
  const [smoothingCapacitor, setSmoothingCapacitor] = useState(false);
  const [acVoltagePeak, setAcVoltagePeak] = useState(6.0); // Volts
  const [userAns, setUserAns] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  const handleReset = () => {
    setCircuitMode('bridge');
    setSmoothingCapacitor(false);
    setAcVoltagePeak(6.0);
    setQuizStatus(null);
    setUserAns('');
  };

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const val = parseFloat(userAns.trim());
    // For AC of 50 Hz, half-wave rectifier ripple frequency = 50 Hz, full-wave bridge ripple frequency = 100 Hz!
    // Question asks for bridge ripple frequency if input is 50 Hz: 100 Hz
    if (Math.abs(val - 100) < 2) {
      setQuizStatus('correct');
      if (onTelemetry) onTelemetry('rectifier_quiz_correct', { problem: 'ripple_frequency' });
    } else {
      setQuizStatus('incorrect');
    }
  };

  const graphW = 340;

  // Waveform paths
  const getInputWavePath = () => {
    const points = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * graphW;
      const t = (i / steps) * 4 * Math.PI; // 2 complete cycles
      const v = acVoltagePeak * Math.sin(t);
      const y = 30 - (v / 12) * 25;
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return 'M ' + points.join(' L ');
  };

  const getOutputWavePath = () => {
    const points = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * graphW;
      const t = (i / steps) * 4 * Math.PI;
      const sinVal = Math.sin(t);
      let vOut = 0;

      if (circuitMode === 'half') {
        vOut = sinVal > 0 ? (sinVal * acVoltagePeak - 0.7) : 0;
      } else {
        // Full wave bridge: conducts on both half cycles minus 2 diode drops (1.4V)
        vOut = Math.abs(sinVal) * acVoltagePeak - 1.4;
      }
      vOut = Math.max(0, vOut);

      // Smoothing filter effect: capacitors discharge exponentially
      if (smoothingCapacitor) {
        vOut = Math.max(vOut, acVoltagePeak * 0.78);
      }

      const y = 65 - (vOut / 12) * 52;
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return 'M ' + points.join(' L ');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              PHYSICS FORM 4 • TOPIC 11
            </span>
            <span className="text-xs text-slate-400 font-mono">Semiconductor Diode Electronics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            P-N Junction Diode & AC Rectification Circuits
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Circuit
        </button>
      </div>

      {/* Rectifier Type Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
        {[
          { id: 'half', title: 'Half-Wave Rectification', desc: '1 Diode: conducts only on positive half-cycle, 50% duty' },
          { id: 'bridge', title: 'Full-Wave Bridge Rectifier', desc: '4 Diodes in diamond bridge: conducts on BOTH half-cycles' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setCircuitMode(m.id)}
            className={`text-left p-3 rounded-2xl border transition-all ${
              circuitMode === m.id
                ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-950/50 text-white'
                : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-400'
            }`}
          >
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Activity className={`w-3.5 h-3.5 ${circuitMode === m.id ? 'text-cyan-400' : 'text-slate-500'}`} />
              {m.title}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Oscilloscope Traces (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Dual-Trace Oscilloscope (Input AC vs Rectified Output)
            </span>
            <span className="font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-lg">
              {smoothingCapacitor ? 'Capacitor Filter ON' : 'Pulsating DC'}
            </span>
          </div>

          {/* SVG Oscilloscope Traces */}
          <div className="w-full h-[240px] bg-slate-950 rounded-xl border border-slate-800 p-2 flex flex-col justify-around">
            {/* Trace 1: Input AC Waveform */}
            <div className="relative">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">Channel 1: Input AC (±{acVoltagePeak}V)</span>
              <svg viewBox={`0 0 ${graphW} 60`} className="w-full h-[60px] bg-black rounded-lg border border-slate-900">
                <line x1="0" y1="30" x2={graphW} y2="30" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <path d={getInputWavePath()} fill="none" stroke="#60a5fa" strokeWidth="2" />
              </svg>
            </div>

            {/* Trace 2: Rectified DC Waveform */}
            <div className="relative">
              <span className="text-[10px] font-mono text-emerald-400 block mb-1">
                Channel 2: Rectified Load Output ({circuitMode === 'half' ? 'Half-Wave' : 'Full-Wave'})
              </span>
              <svg viewBox={`0 0 ${graphW} 80`} className="w-full h-[80px] bg-black rounded-lg border border-emerald-950/50">
                <line x1="0" y1="65" x2={graphW} y2="65" stroke="#064e3b" strokeWidth="1" />
                <path
                  d={getOutputWavePath()}
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2.5"
                  className="drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]"
                />
              </svg>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-300">
            <span>
              Diode Voltage Drop: <strong className="text-cyan-400 font-mono">{circuitMode === 'half' ? '0.7 V (1 Diode)' : '1.4 V (2 Diodes)'}</strong>
            </span>
            <span>
              Output Peak: <strong className="text-emerald-400 font-mono">{(acVoltagePeak - (circuitMode === 'half' ? 0.7 : 1.4)).toFixed(1)} V</strong>
            </span>
          </div>
        </div>

        {/* Controls (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-cyan-400" /> Circuit Parameters
            </div>

            {/* Input AC Voltage */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Input AC Peak (V₀):</span>
                <span className="font-mono font-bold text-cyan-400">{acVoltagePeak} V</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="12.0"
                step="0.5"
                value={acVoltagePeak}
                onChange={(e) => setAcVoltagePeak(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Smoothing Capacitor Filter Toggle */}
            <div className="space-y-2">
              <div className="text-xs text-slate-400">Smoothing Capacitor (C):</div>
              <button
                onClick={() => setSmoothingCapacitor(!smoothingCapacitor)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  smoothingCapacitor
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {smoothingCapacitor ? '✓ Smoothing Capacitor CONNECTED (DC Ripple Smoothed)' : '+ Connect Smoothing Capacitor (100 µF)'}
              </button>
            </div>

            {/* Physics Principle */}
            <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-[11px] text-cyan-300 leading-relaxed">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />
              <strong>Bridge Action:</strong> In a bridge rectifier, diodes conduct in pairs. Current passes through the load in the <em>identical direction</em> during both halves of the AC cycle, doubling efficiency!
            </div>
          </div>
        </div>
      </div>

      {/* KCSE Exam Challenge */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            KCSE Diagnostic: Ripple Frequency
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          An alternating current supply of frequency <strong>50 Hz</strong> is connected to a <strong>full-wave bridge rectifier</strong> without a capacitor. What is the frequency of the output voltage ripples in <strong>Hz</strong>?
        </p>

        <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            placeholder="e.g. 100"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500 w-36"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Check Frequency
          </button>
          {quizStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Correct! For full-wave rectification, ripple frequency is 2f = 2 × 50 = 100 Hz.
            </span>
          )}
          {quizStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Incorrect. Each input cycle produces two output pulses in full-wave rectification.
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
