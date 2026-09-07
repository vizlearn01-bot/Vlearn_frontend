import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, Sliders, ShieldCheck, Eye } from 'lucide-react';

const SUBJECTS = [
  { id: 'hand', name: 'Human Hand Phantom', desc: 'Bone (Calcium Z=20) inside soft flesh (Z=7.4)' },
  { id: 'chest', name: 'Chest Radiograph', desc: 'Rib bones, soft lung tissue, and cardiac shadow' },
  { id: 'pipe', name: 'Welded Industrial Joint', desc: 'Steel pipe with internal hairline fracture flaw' },
];

export default function XRayRadiographySim({ config = {}, onTelemetry }) {
  const [selectedSubject, setSelectedSubject] = useState('hand');
  const [beamEnergyKeV, setBeamEnergyKeV] = useState(60); // 30 - 120 keV
  const [leadShieldMm, setLeadShieldMm] = useState(0); // 0 - 3 mm
  const [exposureTimeS, setExposureTimeS] = useState(1.0); // 0.2 - 3.0 s
  const [userAns, setUserAns] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  // Attenuation coefficients: mu ~ density * Z^3 / E^3
  // Bone vs Flesh contrast decreases as energy increases (Compton effect dominates over Photoelectric)
  const boneAttenuation = Math.min(0.95, (120 / (beamEnergyKeV + 20)) * 0.9);
  const tissueAttenuation = Math.min(0.7, (50 / (beamEnergyKeV + 20)) * 0.4);
  const leadAttenuation = 1 - Math.exp(-1.8 * leadShieldMm);

  // Overall film darkness / exposure
  const baseExposure = Math.min(1.0, (exposureTimeS * (beamEnergyKeV / 60)) * (1 - leadAttenuation * 0.95));

  const handleReset = () => {
    setSelectedSubject('hand');
    setBeamEnergyKeV(60);
    setLeadShieldMm(0);
    setExposureTimeS(1.0);
    setQuizStatus(null);
    setUserAns('');
  };

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const val = parseFloat(userAns.trim());
    // Half-value layer (HVL) problem: Initial dose 80 mGy. Lead HVL is 0.5 mm. What is dose after 1.5 mm lead?
    // 1.5 mm = 3 HVLs -> 80 * (1/2)^3 = 80 / 8 = 10 mGy
    if (Math.abs(val - 10) < 0.8) {
      setQuizStatus('correct');
      if (onTelemetry) onTelemetry('radiography_quiz_correct', { problem: 'hvl_dose' });
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
            <span className="text-xs text-slate-400 font-mono">Medical & Industrial Attenuation Lab</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Eye className="w-6 h-6 text-amber-400" />
            X-Ray Attenuation, Half-Value Layer & Radiography Simulator
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Phantom
        </button>
      </div>

      {/* Subject Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSubject(s.id)}
            className={`text-left p-3 rounded-2xl border transition-all ${
              selectedSubject === s.id
                ? 'bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-950/50 text-white'
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
        {/* Radiographic Film Simulation (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300">
              Developed Radiographic Film (Negative Exposure)
            </span>
            <span className="font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-lg">
              Energy: {beamEnergyKeV} keV
            </span>
          </div>

          {/* Film Visualizer */}
          <div className="w-full h-[260px] bg-black rounded-xl border-2 border-slate-700 p-2 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 400 240" className="w-full h-full">
              {/* Exposed Film Background (Black when high exposure) */}
              <rect
                x="0"
                y="0"
                width="400"
                height="240"
                fill={`rgba(20, 24, 33, ${baseExposure})`}
              />

              {/* Hand Phantom Silhouette */}
              {selectedSubject === 'hand' && (
                <g transform="translate(140, 30)">
                  {/* Soft Tissue Contour (Translucent gray) */}
                  <path
                    d="M 20,180 C 10,130 5,80 15,50 C 25,20 40,20 45,55 C 50,20 65,20 70,50 C 75,20 90,25 93,60 C 105,40 120,50 115,85 C 110,120 100,180 100,180 Z"
                    fill={`rgba(148, 163, 184, ${0.45 * (1 - tissueAttenuation) * baseExposure})`}
                    stroke="rgba(203, 213, 225, 0.2)"
                  />
                  {/* Dense Bones (Opaque white/bright because X-rays absorbed by calcium) */}
                  <g fill={`rgba(255, 255, 255, ${0.85 * boneAttenuation})`}>
                    {/* Palm Carpals / Metacarpals */}
                    <rect x="35" y="110" width="10" height="40" rx="3" />
                    <rect x="50" y="105" width="10" height="45" rx="3" />
                    <rect x="65" y="105" width="10" height="45" rx="3" />
                    <rect x="80" y="115" width="9" height="35" rx="3" />
                    {/* Phalanges */}
                    <rect x="34" y="60" width="8" height="42" rx="3" />
                    <rect x="50" y="50" width="8" height="48" rx="3" />
                    <rect x="66" y="55" width="8" height="44" rx="3" />
                    <rect x="82" y="70" width="7" height="35" rx="3" />
                  </g>
                </g>
              )}

              {/* Chest Radiograph */}
              {selectedSubject === 'chest' && (
                <g transform="translate(100, 20)">
                  {/* Lung Fields (Dark because air absorbs very few X-rays) */}
                  <ellipse cx="60" cy="100" rx="40" ry="60" fill={`rgba(15, 23, 42, ${0.9 * baseExposure})`} />
                  <ellipse cx="140" cy="100" rx="40" ry="60" fill={`rgba(15, 23, 42, ${0.9 * baseExposure})`} />
                  {/* Cardiac Silhouette (Heart absorbs some X-rays) */}
                  <circle cx="90" cy="115" r="35" fill={`rgba(226, 232, 240, ${0.5 * boneAttenuation})`} />
                  {/* Ribs (Bright horizontal arcs) */}
                  {[60, 80, 100, 120, 140].map((y, i) => (
                    <g key={i} stroke={`rgba(255, 255, 255, ${0.8 * boneAttenuation})`} strokeWidth="5" fill="none">
                      <path d={`M 20,${y} Q 60,${y + 15} 90,${y + 5}`} />
                      <path d={`M 180,${y} Q 140,${y + 15} 110,${y + 5}`} />
                    </g>
                  ))}
                </g>
              )}

              {/* Welded Pipe Joint */}
              {selectedSubject === 'pipe' && (
                <g transform="translate(80, 40)">
                  {/* Steel Pipe */}
                  <rect x="0" y="30" width="240" height="100" fill={`rgba(203, 213, 225, ${0.35 * boneAttenuation})`} rx="4" />
                  {/* Weld Bead */}
                  <rect x="110" y="25" width="20" height="110" fill={`rgba(255, 255, 255, ${0.7 * boneAttenuation})`} rx="3" />
                  {/* Internal Crack Flaw (Air in crack transmits more X-rays -> dark line on film!) */}
                  <line x1="118" y1="50" x2="122" y2="90" stroke="#000000" strokeWidth="2.5" />
                  <text x="120" y="115" fill="#f87171" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Crack Defect Detected
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-300">
            <span>
              Bone Attenuation: <strong className="text-amber-400 font-mono">{(boneAttenuation * 100).toFixed(0)}%</strong>
            </span>
            <span>
              Lead Apron Thickness: <strong className="text-cyan-400 font-mono">{leadShieldMm} mm Pb</strong>
            </span>
          </div>
        </div>

        {/* Controls (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-amber-400" /> Exposure & Shielding Dials
            </div>

            {/* Beam Energy */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Beam Quality (keV):</span>
                <span className="font-mono font-bold text-amber-400">{beamEnergyKeV} keV</span>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                step="5"
                value={beamEnergyKeV}
                onChange={(e) => setBeamEnergyKeV(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Low keV enhances contrast between bone and soft tissue; high keV penetrates thick body parts.
              </p>
            </div>

            {/* Lead Apron Shielding */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Lead Shielding Apron:</span>
                <span className="font-mono font-bold text-cyan-400">{leadShieldMm} mm Lead</span>
              </div>
              <input
                type="range"
                min="0"
                max="3.0"
                step="0.5"
                value={leadShieldMm}
                onChange={(e) => setLeadShieldMm(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Exposure Time */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Exposure Time:</span>
                <span className="font-mono font-bold text-emerald-400">{exposureTimeS} s</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.2"
                value={exposureTimeS}
                onChange={(e) => setExposureTimeS(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* ALARA Principle Note */}
            <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-[11px] text-amber-300 leading-relaxed">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 inline mr-1" />
              <strong>ALARA Radiation Safety:</strong> As Low As Reasonably Achievable. Reduce <em>Time</em>, increase <em>Distance</em>, and use dense <em>Lead Shielding</em>.
            </div>
          </div>
        </div>
      </div>

      {/* KCSE Half-Value Layer Exam Module */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            KCSE Radiation Shielding Diagnostic
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          An unshielded diagnostic X-ray beam produces an entrance dose of <strong>80 mGy</strong>. If the Half-Value Layer (HVL) of lead for this beam is <strong>0.5 mm</strong>, what radiation dose in <strong>mGy</strong> will penetrate through a <strong>1.5 mm lead apron</strong>?
        </p>

        <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 10.0"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500 w-36"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Submit Dose
          </button>
          {quizStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Correct! 1.5 mm = 3 HVLs ⟹ Dose = 80 × (1/2)³ = 10 mGy.
            </span>
          )}
          {quizStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Incorrect. Number of HVLs n = 1.5 / 0.5 = 3. Remaining dose = 80 / (2³).
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
