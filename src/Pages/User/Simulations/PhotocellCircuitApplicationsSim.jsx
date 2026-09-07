import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, ShieldAlert, Sun, Moon, BellRing } from 'lucide-react';

const APPS = [
  { id: 'alarm', name: 'Burglar Alarm / Perimeter Beam', desc: 'Infrared light beam shines on photocell to hold alarm relay open' },
  { id: 'street', name: 'Automatic Street Light', desc: 'LDR ambient light sensor turns street lamps ON at dusk automatically' },
  { id: 'solar', name: 'Solar Photovoltaic Meter', desc: 'Direct photon-to-electric conversion powering a DC motor' },
];

export default function PhotocellCircuitApplicationsSim({ config = {}, onTelemetry }) {
  const [activeApp, setActiveApp] = useState('alarm');
  const [beamInterrupted, setBeamInterrupted] = useState(false);
  const [ambientLight, setAmbientLight] = useState(70); // 0 (Night) to 100 (Bright daylight)
  const [userAns, setUserAns] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  // Burglar alarm state: Beam intact -> relay energized -> alarm OFF. Beam cut -> relay drops -> siren ON!
  const isAlarmTriggered = activeApp === 'alarm' && beamInterrupted;
  // Street light state: Ambient light < 30 lux -> lamp ON
  const isStreetLightOn = activeApp === 'street' && ambientLight < 35;
  // Solar motor speed: proportional to ambient sunlight
  const motorRpm = activeApp === 'solar' ? Math.round(ambientLight * 25) : 0;

  const handleReset = () => {
    setActiveApp('alarm');
    setBeamInterrupted(false);
    setAmbientLight(70);
    setQuizStatus(null);
    setUserAns('');
  };

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const clean = userAns.trim().toLowerCase();
    // Question: In a photoelectric burglar alarm, why does breaking the light beam cause the alarm to sound?
    // User answer check keywords: de-energize, open, close, circuit, relay
    if (clean.includes('relay') || clean.includes('current') || clean.includes('switch') || clean.includes('contact')) {
      setQuizStatus('correct');
      if (onTelemetry) onTelemetry('photocell_app_quiz_correct', { problem: 'alarm_mechanism' });
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              PHYSICS FORM 4 • TOPIC 9
            </span>
            <span className="text-xs text-slate-400 font-mono">Industrial & Security Circuits</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <BellRing className="w-6 h-6 text-violet-400" />
            Photocell Circuit Applications & Light Sensors
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Circuit
        </button>
      </div>

      {/* Application Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
        {APPS.map((a) => (
          <button
            key={a.id}
            onClick={() => setActiveApp(a.id)}
            className={`text-left p-3 rounded-2xl border transition-all ${
              activeApp === a.id
                ? 'bg-violet-950/40 border-violet-500/50 shadow-lg shadow-violet-950/50 text-white'
                : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-400'
            }`}
          >
            <div className="text-xs font-bold text-slate-200">{a.name}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{a.desc}</div>
          </button>
        ))}
      </div>

      {/* Main Bench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Interactive Schematic Diagram (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300">
              Circuit Schematic & Actuation Status
            </span>
            <span className="font-mono text-violet-400 bg-violet-950/60 border border-violet-800/60 px-2 py-0.5 rounded-lg">
              Mode: {APPS.find((a) => a.id === activeApp)?.name}
            </span>
          </div>

          {/* SVG Circuit Canvas */}
          <div className="w-full h-[260px] bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 500 240" className="w-full h-full">
              {/* Mode 1: Burglar Alarm */}
              {activeApp === 'alarm' && (
                <g>
                  {/* Infrared Transmitter Lamp */}
                  <rect x="40" y="90" width="30" height="50" fill="#334155" rx="4" />
                  <circle cx="55" cy="115" r="10" fill="#f43f5e" />
                  <text x="55" y="80" fill="#f43f5e" fontSize="8" fontWeight="bold" textAnchor="middle">IR Lamp</text>

                  {/* Light Beam */}
                  {!beamInterrupted ? (
                    <line x1="70" y1="115" x2="220" y2="115" stroke="#f43f5e" strokeWidth="4" strokeDasharray="5 3" />
                  ) : (
                    <g>
                      <line x1="70" y1="115" x2="130" y2="115" stroke="#f43f5e" strokeWidth="4" strokeDasharray="5 3" />
                      {/* Intruder Hand blocking */}
                      <rect x="135" y="70" width="30" height="90" fill="#ef4444" rx="6" />
                      <text x="150" y="65" fill="#f87171" fontSize="8" fontWeight="bold" textAnchor="middle">Obstacle</text>
                    </g>
                  )}

                  {/* Photocell Receiver */}
                  <rect x="220" y="85" width="20" height="60" fill="#1e293b" stroke="#0284c7" strokeWidth="2" rx="3" />
                  <text x="230" y="75" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">Photocell</text>

                  {/* Relay Coil & Contacts */}
                  <rect x="300" y="90" width="45" height="50" fill="#1e293b" stroke="#64748b" rx="4" />
                  <text x="322" y="80" fill="#94a3b8" fontSize="8" textAnchor="middle">Relay</text>

                  {/* Alarm Siren / Bell */}
                  <g transform="translate(420, 115)">
                    <circle cx="0" cy="0" r="24" fill={isAlarmTriggered ? '#ef4444' : '#334155'} />
                    <text x="0" y="4" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">
                      {isAlarmTriggered ? 'ALARM!' : 'Silent'}
                    </text>
                  </g>
                </g>
              )}

              {/* Mode 2: Automatic Street Light */}
              {activeApp === 'street' && (
                <g>
                  {/* Sun / Moon Sky Indicator */}
                  <circle cx="80" cy="60" r="22" fill={ambientLight > 40 ? '#f59e0b' : '#38bdf8'} />
                  <text x="80" y="95" fill={ambientLight > 40 ? '#f59e0b' : '#38bdf8'} fontSize="9" fontWeight="bold" textAnchor="middle">
                    {ambientLight > 40 ? 'Daylight (Sun)' : 'Night (Darkness)'}
                  </text>

                  {/* Light Sensor / LDR */}
                  <rect x="180" y="100" width="40" height="30" fill="#1e293b" stroke="#38bdf8" rx="4" />
                  <text x="200" y="90" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">LDR Sensor</text>

                  {/* Street Lamp Post */}
                  <line x1="360" y1="200" x2="360" y2="70" stroke="#64748b" strokeWidth="6" />
                  <path d="M 360,70 Q 380,50 410,60" fill="none" stroke="#64748b" strokeWidth="5" />
                  {/* Lamp Bulb */}
                  <circle
                    cx="410"
                    cy="70"
                    r="16"
                    fill={isStreetLightOn ? '#facc15' : '#334155'}
                    className={isStreetLightOn ? 'drop-shadow-[0_0_15px_rgba(250,204,21,0.9)]' : ''}
                  />
                  <text x="410" y="105" fill={isStreetLightOn ? '#facc15' : '#94a3b8'} fontSize="9" fontWeight="bold" textAnchor="middle">
                    {isStreetLightOn ? 'LAMP ON' : 'Lamp OFF'}
                  </text>
                </g>
              )}

              {/* Mode 3: Solar Motor */}
              {activeApp === 'solar' && (
                <g>
                  {/* Solar Photovoltaic Panel */}
                  <rect x="80" y="80" width="120" height="70" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" rx="4" />
                  <text x="140" y="70" fill="#60a5fa" fontSize="8" fontWeight="bold" textAnchor="middle">PV Solar Cell</text>

                  {/* DC Electric Motor with Spinning Propeller */}
                  <circle cx="360" cy="115" r="30" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                  <text x="360" y="120" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {motorRpm} RPM
                  </text>
                  <text x="360" y="165" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
                    DC Motor Load
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-300">
            <span>
              Status: <strong className={isAlarmTriggered || isStreetLightOn ? 'text-amber-400' : 'text-emerald-400'}>
                {activeApp === 'alarm'
                  ? (isAlarmTriggered ? '🚨 Beam Interrupted - Siren Actuated!' : '✓ Beam Intact - Area Secure')
                  : activeApp === 'street'
                  ? (isStreetLightOn ? '🌙 Darkness Detected - Lamp ON' : '☀️ Adequate Light - Lamp Standby')
                  : `⚡ Solar Generation: ${motorRpm} RPM`}
              </strong>
            </span>
          </div>
        </div>

        {/* Controls (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sun className="w-4 h-4 text-violet-400" /> Interactive Inputs
            </div>

            {/* Mode 1: Alarm Beam Obstacle Toggle */}
            {activeApp === 'alarm' && (
              <div className="space-y-2">
                <div className="text-xs text-slate-400">Infrared Security Beam:</div>
                <button
                  onClick={() => setBeamInterrupted(!beamInterrupted)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    beamInterrupted ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {beamInterrupted ? 'Remove Obstacle (Clear Beam)' : 'Walk Through Beam (Trigger Alarm)'}
                </button>
              </div>
            )}

            {/* Mode 2 & 3: Ambient Light Slider */}
            {(activeApp === 'street' || activeApp === 'solar') && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Ambient Illumination (Lux):</span>
                  <span className="font-mono font-bold text-amber-400">{ambientLight}% ({ambientLight > 35 ? 'Day' : 'Dusk/Night'})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={ambientLight}
                  onChange={(e) => setAmbientLight(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Educational Note */}
            <div className="p-3 bg-violet-950/30 border border-violet-800/40 rounded-xl text-[11px] text-violet-300 leading-relaxed">
              <strong>Relay Operation in Burglar Alarm:</strong> When continuous light strikes the photocell, photocurrent flows through the electromagnet coil, holding the switch armature away from the alarm contacts. When an intruder blocks the light, photocurrent drops to zero, releasing the armature to close the alarm circuit!
            </div>
          </div>
        </div>
      </div>

      {/* KCSE Practice Question */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            KCSE Diagnostic: Photocell Relay Mechanism
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          State the essential function of the <strong>electromagnetic relay</strong> in a photoelectric burglar alarm system when light is interrupted.
        </p>

        <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="e.g. closes secondary alarm circuit when relay de-energizes"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-violet-500 flex-1 min-w-[240px]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Submit Answer
          </button>
          {quizStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-violet-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Correct! The de-energized relay allows spring contacts to close, sounding the alarm.
            </span>
          )}
          {quizStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Include keywords like 'relay', 'current', or 'circuit contact'.
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
