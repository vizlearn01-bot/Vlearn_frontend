import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, Sliders, Sparkles, Zap, Sun, Thermometer } from 'lucide-react';

export default function TransistorSwitchCircuitSim({ config = {}, onTelemetry }) {
  const [sensorType, setSensorType] = useState('ldr'); // 'ldr' | 'thermistor'
  const [ambientLux, setAmbientLux] = useState(20); // 0 (Dark) to 100 (Bright)
  const [tempC, setTempC] = useState(25); // 0 to 100 °C
  const [r1Kohm, setR1Kohm] = useState(10); // 1 to 50 kOhm
  const [userAns, setUserAns] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  const Vcc = 9.0; // Volts

  // Sensor resistance:
  // LDR: Dark = 100 kOhm, Bright = 0.5 kOhm
  // NTC Thermistor: 0°C = 50 kOhm, 100°C = 1 kOhm
  let rSensorKohm = 10;
  if (sensorType === 'ldr') {
    rSensorKohm = Math.max(0.5, 100 * Math.exp(-ambientLux / 22));
  } else {
    rSensorKohm = Math.max(0.8, 50 * Math.exp(-tempC / 25));
  }

  // Potential divider: V_base = Vcc * (R_sensor / (R1 + R_sensor))
  // In automatic night switch (LDR at bottom): V_base rises in dark
  const vBase = Vcc * (rSensorKohm / (r1Kohm + rSensorKohm));
  const isTransistorOn = vBase >= 0.65;
  const iCollectorMA = isTransistorOn ? 45 : 0; // collector load current

  const handleReset = () => {
    setSensorType('ldr');
    setAmbientLux(20);
    setTempC(25);
    setR1Kohm(10);
    setQuizStatus(null);
    setUserAns('');
  };

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const val = parseFloat(userAns.trim());
    // Potential divider: Vcc = 9V, R1 = 10k, R2 (sensor) = 20k. Find V_base in Volts:
    // V_base = 9 * (20 / (10 + 20)) = 9 * (2/3) = 6.0 V
    if (Math.abs(val - 6.0) < 0.2 || Math.abs(val - 6) < 0.2) {
      setQuizStatus('correct');
      if (onTelemetry) onTelemetry('transistor_quiz_correct', { problem: 'potential_divider' });
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              PHYSICS FORM 4 • TOPIC 11
            </span>
            <span className="text-xs text-slate-400 font-mono">Bipolar Junction Transistor (NPN) Electronics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            Transistor as an Electronic Switch & Sensor Circuit
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Circuit
        </button>
      </div>

      {/* Sensor Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
        {[
          { id: 'ldr', name: 'Light-Controlled Switch (LDR)', desc: 'Turns output ON in darkness (Automatic Night Lamp)' },
          { id: 'thermistor', name: 'Temperature Switch (NTC Thermistor)', desc: 'Turns output ON when hot (Fire Alarm / Cooling Fan)' },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setSensorType(s.id)}
            className={`text-left p-3 rounded-2xl border transition-all ${
              sensorType === s.id
                ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-950/50 text-white'
                : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-400'
            }`}
          >
            <div className="text-xs font-bold text-slate-200">{s.name}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{s.desc}</div>
          </button>
        ))}
      </div>

      {/* Main Bench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Schematic Circuit Canvas (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> NPN Transistor Common-Emitter Switch
            </span>
            <span className="font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-lg">
              V_BE = {vBase.toFixed(2)} V ({isTransistorOn ? 'SATURATED (ON)' : 'CUT-OFF (OFF)'})
            </span>
          </div>

          {/* SVG Schematic */}
          <div className="w-full h-[250px] bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
            <svg viewBox="0 0 460 220" className="w-full h-full">
              {/* Supply Rails */}
              <line x1="40" y1="25" x2="420" y2="25" stroke="#ef4444" strokeWidth="2.5" />
              <text x="425" y="28" fill="#ef4444" fontSize="10" fontWeight="bold">+9V (Vcc)</text>
              <line x1="40" y1="195" x2="420" y2="195" stroke="#3b82f6" strokeWidth="2.5" />
              <text x="425" y="198" fill="#3b82f6" fontSize="10" fontWeight="bold">0V (GND)</text>

              {/* Potential Divider Resistor R1 */}
              <rect x="85" y="45" width="20" height="40" fill="#1e293b" stroke="#64748b" rx="2" />
              <text x="75" y="68" fill="#94a3b8" fontSize="8" textAnchor="end">R1 ({r1Kohm}kΩ)</text>
              <line x1="95" y1="25" x2="95" y2="45" stroke="#ef4444" strokeWidth="2" />
              <line x1="95" y1="85" x2="95" y2="120" stroke="#cbd5e1" strokeWidth="2" />

              {/* Sensor (LDR or Thermistor) */}
              <rect x="85" y="120" width="20" height="40" fill="#1e293b" stroke="#38bdf8" rx="2" />
              <text x="75" y="143" fill="#38bdf8" fontSize="8" textAnchor="end">
                {sensorType === 'ldr' ? 'LDR' : 'NTC'} ({rSensorKohm.toFixed(1)}kΩ)
              </text>
              <line x1="95" y1="160" x2="95" y2="195" stroke="#3b82f6" strokeWidth="2" />

              {/* Base Connection to Transistor */}
              <line x1="95" y1="105" x2="200" y2="105" stroke={isTransistorOn ? '#4ade80' : '#64748b'} strokeWidth="2" />
              <text x="145" y="98" fill={isTransistorOn ? '#4ade80' : '#94a3b8'} fontSize="8" fontWeight="bold">
                V_base = {vBase.toFixed(2)}V
              </text>

              {/* NPN Transistor Symbol */}
              <g transform="translate(220, 105)">
                <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                {/* Base bar */}
                <line x1="-8" y1="-14" x2="-8" y2="14" stroke="#e2e8f0" strokeWidth="3" />
                <line x1="-20" y1="0" x2="-8" y2="0" stroke="#e2e8f0" strokeWidth="2" />
                {/* Collector arm */}
                <line x1="-8" y1="-8" x2="12" y2="-18" stroke="#e2e8f0" strokeWidth="2" />
                {/* Emitter arm with arrow pointing outward */}
                <line x1="-8" y1="8" x2="12" y2="18" stroke="#e2e8f0" strokeWidth="2" />
                <polygon points="12,18 4,13 8,9" fill="#e2e8f0" />
              </g>

              {/* Emitter connection to GND */}
              <line x1="232" y1="123" x2="232" y2="195" stroke="#3b82f6" strokeWidth="2" />

              {/* Collector Load (Lamp / Relay) */}
              <line x1="232" y1="87" x2="232" y2="65" stroke="#cbd5e1" strokeWidth="2" />
              <circle
                cx="232"
                cy="48"
                r="16"
                fill={isTransistorOn ? '#facc15' : '#1e293b'}
                stroke="#e2e8f0"
                strokeWidth="2"
                className={isTransistorOn ? 'drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]' : ''}
              />
              <line x1="232" y1="32" x2="232" y2="25" stroke="#ef4444" strokeWidth="2" />
              <text x="232" y="52" fill={isTransistorOn ? '#854d0e' : '#94a3b8'} fontSize="9" fontWeight="bold" textAnchor="middle">
                LOAD
              </text>
            </svg>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-300">
            <span>
              Collector Current (Ic): <strong className="text-cyan-400 font-mono">{iCollectorMA} mA</strong>
            </span>
            <span>
              Load Output State: <strong className={isTransistorOn ? 'text-emerald-400' : 'text-slate-500'}>
                {isTransistorOn ? '⚡ SWITCHED ON (Conducting)' : '◯ SWITCHED OFF (Isolated)'}
              </strong>
            </span>
          </div>
        </div>

        {/* Controls (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-cyan-400" /> Sensor & Calibration Knobs
            </div>

            {/* Variable Resistor R1 calibration */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Potentiometer Sensitivity R1:</span>
                <span className="font-mono font-bold text-cyan-400">{r1Kohm} kΩ</span>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                step="1"
                value={r1Kohm}
                onChange={(e) => setR1Kohm(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Environmental condition slider */}
            {sensorType === 'ldr' ? (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Light Level (Lux):</span>
                  <span className="font-mono font-bold text-amber-400">{ambientLux}% ({ambientLux < 30 ? 'Dark' : 'Bright'})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={ambientLux}
                  onChange={(e) => setAmbientLux(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Temperature (°C):</span>
                  <span className="font-mono font-bold text-rose-400">{tempC} °C</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="2"
                  value={tempC}
                  onChange={(e) => setTempC(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Scientific Rule */}
            <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-[11px] text-cyan-300 leading-relaxed">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />
              <strong>Silicon Base Barrier (0.65V):</strong> When base voltage V_BE ≥ 0.65 V, base current flows, triggering collector current to switch the load fully ON.
            </div>
          </div>
        </div>
      </div>

      {/* KCSE Exam Challenge */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            KCSE Potential Divider Diagnostic
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          A potential divider powered by V_cc = 9.0 V consists of fixed resistor R₁ = 10 kΩ and sensor resistor R₂ = 20 kΩ. Calculate the <strong>base voltage (V_base)</strong> across R₂ in <strong>Volts</strong>.
        </p>

        <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 6.0"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500 w-36"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Check Potential
          </button>
          {quizStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Correct! V_base = 9 × [20 / (10 + 20)] = 6.0 V.
            </span>
          )}
          {quizStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Incorrect. Use formula V_out = Vcc × [R2 / (R1 + R2)].
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
