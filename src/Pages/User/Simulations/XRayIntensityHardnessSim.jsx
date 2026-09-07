import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, Sliders, Zap, Sparkles } from 'lucide-react';

const TARGET_MATERIALS = {
  tungsten: { name: 'Tungsten (W)', Z: 74, kAlpha: 0.021, color: '#38bdf8' },
  molybdenum: { name: 'Molybdenum (Mo)', Z: 42, kAlpha: 0.071, color: '#a855f7' },
  copper: { name: 'Copper (Cu)', Z: 29, kAlpha: 0.154, color: '#f59e0b' },
};

export default function XRayIntensityHardnessSim({ config = {}, onTelemetry }) {
  const [acceleratingKV, setAcceleratingKV] = useState(60); // 20 - 120 kV
  const [filamentCurrentMA, setFilamentCurrentMA] = useState(25); // 5 - 50 mA
  const [targetMatKey, setTargetMatKey] = useState('tungsten');
  const [userAns, setUserAns] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  const mat = TARGET_MATERIALS[targetMatKey];

  // Duane-Hunt Cutoff Wavelength: lambda_min = hc / (e * Va)
  // hc/e = 1.24 x 10^-6 V*m = 1240 pm*kV
  const lambdaMinPM = (1240 / acceleratingKV).toFixed(1);
  const lambdaMinNM = 1.24 / acceleratingKV;

  // X-Ray beam intensity: Intensity ~ I_filament * Z * Va^2
  const relativeIntensity = ((filamentCurrentMA / 50) * (mat.Z / 74) * Math.pow(acceleratingKV / 100, 1.6) * 100).toFixed(0);

  // Electrical power conversion: <1% X-rays, >99% Heat
  const totalPowerW = (acceleratingKV * 1000 * (filamentCurrentMA / 1000)).toFixed(0);
  const heatPowerW = (totalPowerW * 0.99).toFixed(0);
  const xrayPowerW = (totalPowerW * 0.01).toFixed(1);

  // SVG Spectrum points
  const graphW = 340;
  const graphH = 160;
  const originX = 35;
  const originY = graphH + 10;
  const maxLambdaNM = 0.14; // graph domain 0 to 0.14 nm

  const getSpectrumPath = () => {
    const points = [];
    const minX = (lambdaMinNM / maxLambdaNM) * graphW;
    const startX = originX + minX;

    points.push(`${Math.max(originX, startX).toFixed(1)},${originY}`);

    const steps = 60;
    let lastX = startX;
    for (let i = 1; i <= steps; i++) {
      const curNM = lambdaMinNM + (i / steps) * (maxLambdaNM - lambdaMinNM);
      const curX = originX + (curNM / maxLambdaNM) * graphW;
      if (curX > originX + graphW) break;
      lastX = curX;

      // Bremsstrahlung continuum curve: I(lambda) ~ (1/lambda^2) * (lambda/lambda_min - 1)
      const diff = curNM - lambdaMinNM;
      const heightFrac = Math.exp(-diff / 0.035) * (diff / 0.035) * 3.5;
      const amplitudeFactor = (filamentCurrentMA / 30) * (mat.Z / 74) * Math.pow(acceleratingKV / 60, 1.4);
      const curY = Math.max(15, originY - heightFrac * 110 * amplitudeFactor);

      points.push(`${curX.toFixed(1)},${curY.toFixed(1)}`);
    }

    return {
      line: 'M ' + points.join(' L '),
      area: `M ${points.join(' L ')} L ${lastX.toFixed(1)},${originY} Z`,
    };
  };

  const kAlphaX = (mat.kAlpha / maxLambdaNM) * graphW;
  const canShowKAlpha = lambdaMinNM <= mat.kAlpha;

  const handleReset = () => {
    setAcceleratingKV(60);
    setFilamentCurrentMA(25);
    setTargetMatKey('tungsten');
    setQuizStatus(null);
    setUserAns('');
  };

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const val = parseFloat(userAns.trim());
    // Va = 80 kV. Find lambda_min in pm: 1240 / 80 = 15.5 pm
    if (Math.abs(val - 15.5) < 0.5) {
      setQuizStatus('correct');
      if (onTelemetry) onTelemetry('xray_quiz_correct', { problem: 'cutoff_wavelength' });
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              PHYSICS FORM 4 • TOPIC 8
            </span>
            <span className="text-xs text-slate-400 font-mono">Modern Coolidge Tube Mechanics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            X-Ray Tube Intensity vs Hardness Control Simulator
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Controls
        </button>
      </div>

      {/* Main Bench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Dynamic X-Ray Spectrum Graph (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> X-Ray Emission Spectrum (Bremsstrahlung + Characteristic)
            </span>
            <span className="font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-lg">
              λ_min = {lambdaMinPM} pm
            </span>
          </div>

          {/* SVG Spectrum */}
          <div className="w-full h-[240px] bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
            <svg viewBox={`0 0 ${graphW + 40} ${graphH + 40}`} className="w-full h-full">
              {/* Axes */}
              <line x1="35" y1="10" x2="35" y2={graphH + 10} stroke="#475569" strokeWidth="1.5" />
              <line x1="35" y1={graphH + 10} x2={graphW + 35} y2={graphH + 10} stroke="#475569" strokeWidth="1.5" />
              <text x="30" y="20" fill="#94a3b8" fontSize="8" textAnchor="end">Intensity (I)</text>
              <text x={graphW + 35} y={graphH + 25} fill="#94a3b8" fontSize="8" textAnchor="end">Wavelength λ (nm)</text>

              {/* Gridlines */}
              {[0.03, 0.06, 0.09, 0.12].map((wl, i) => {
                const x = 35 + (wl / maxLambdaNM) * graphW;
                return (
                  <g key={i}>
                    <line x1={x} y1="10" x2={x} y2={graphH + 10} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                    <text x={x} y={graphH + 22} fill="#64748b" fontSize="7" textAnchor="middle">{wl}</text>
                  </g>
                );
              })}

              {/* Continuous Bremsstrahlung Spectrum */}
              {(() => {
                const pathData = getSpectrumPath();
                return (
                  <>
                    <path
                      d={pathData.area}
                      fill="rgba(245, 158, 11, 0.12)"
                    />
                    <path
                      d={pathData.line}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />
                  </>
                );
              })()}

              {/* Characteristic K-alpha line spike */}
              {canShowKAlpha && (
                <g>
                  <line
                    x1={35 + kAlphaX}
                    y1={graphH + 10}
                    x2={35 + kAlphaX}
                    y2="20"
                    stroke={mat.color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                  />
                  <text x={35 + kAlphaX} y="15" fill={mat.color} fontSize="8" fontWeight="bold" textAnchor="middle">
                    K_α ({mat.name.split(' ')[0]})
                  </text>
                </g>
              )}

              {/* Cutoff Marker λ_min */}
              <line
                x1={35 + (lambdaMinNM / maxLambdaNM) * graphW}
                y1={graphH + 5}
                x2={35 + (lambdaMinNM / maxLambdaNM) * graphW}
                y2={graphH + 15}
                stroke="#ef4444"
                strokeWidth="2"
              />
              <text
                x={35 + (lambdaMinNM / maxLambdaNM) * graphW}
                y={graphH + 24}
                fill="#ef4444"
                fontSize="7.5"
                fontWeight="bold"
                textAnchor="middle"
              >
                λ_min
              </text>
            </svg>
          </div>

          {/* Readout Footer */}
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-300">
            <span>
              Beam Quality: <strong className={acceleratingKV >= 70 ? 'text-cyan-400' : 'text-amber-400'}>
                {acceleratingKV >= 70 ? 'HARD X-Rays (High Penetration)' : 'SOFT X-Rays (Low Penetration)'}
              </strong>
            </span>
            <span>
              Thermal Dissipation: <strong className="text-rose-400 font-mono">{heatPowerW} W ({((heatPowerW/totalPowerW)*100).toFixed(0)}%)</strong>
            </span>
          </div>
        </div>

        {/* Controls Panel (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-amber-400" /> Operational Parameters
            </div>

            {/* Target Material */}
            <div>
              <div className="text-xs text-slate-400 mb-1.5">Target Material (Z):</div>
              <div className="grid grid-cols-3 gap-1.5">
                {Object.entries(TARGET_MATERIALS).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setTargetMatKey(k)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                      targetMatKey === k
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Filament Current (mA) -> Intensity */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Filament Heating Current:</span>
                <span className="font-mono font-bold text-amber-400">{filamentCurrentMA} mA (Intensity)</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={filamentCurrentMA}
                onChange={(e) => setFilamentCurrentMA(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Controls rate of thermionic emission ⟹ Number of X-ray photons per second (Quantity).
              </p>
            </div>

            {/* High Voltage (kV) -> Hardness */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Anode Voltage (EHT):</span>
                <span className="font-mono font-bold text-cyan-400">{acceleratingKV} kV (Hardness)</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="2"
                value={acceleratingKV}
                onChange={(e) => setAcceleratingKV(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Controls kinetic energy of electrons ⟹ Penetrating power and cutoff wavelength λ_min (Quality).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KCSE Exam Challenge */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            KCSE Diagnostic Problem: Minimum Wavelength Calculation
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          An X-ray tube operates at an accelerating potential of <strong>80 kV</strong>. Given hc/e ≈ 1.24 × 10⁻⁶ V·m = 1240 pm·kV, calculate the <strong>minimum wavelength (λ_min)</strong> of the emitted X-rays in picometres (pm).
        </p>

        <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 15.5"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500 w-36"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Submit Answer
          </button>
          {quizStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Correct! λ_min = 1240 / 80 = 15.5 pm.
            </span>
          )}
          {quizStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Incorrect. Use Duane-Hunt Law: λ_min = hc / (e·Va) = 1240 pm·kV / 80 kV = 15.5 pm.
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
