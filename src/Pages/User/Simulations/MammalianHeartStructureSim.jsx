import React, { useState } from 'react';
import { Heart, RotateCcw, Sparkles, CheckCircle2, Info, ArrowRight, Activity } from 'lucide-react';

export default function MammalianHeartStructureSim({ config = {}, onTelemetry }) {
  // Primary Variable: Cardiac Cycle Phase ('diastole' vs 'systole')
  const [cardiacPhase, setCardiacPhase] = useState('diastole');

  const handleTogglePhase = (phase) => {
    setCardiacPhase(phase);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'mammalian_heart_structure',
      phase
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
            <Heart className="w-6 h-6 fill-rose-500/40 text-rose-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Mammalian Heart Anatomy & Cardiac Cycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Animal Transport (4 Chambers, Asymmetric Walls & Valve Action)
            </p>
          </div>
        </div>
        <button
          onClick={() => setCardiacPhase('diastole')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset Phase
        </button>
      </div>

      {/* Primary Variable Control: Cardiac Cycle Phase Toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleTogglePhase('diastole')}
          className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border font-bold text-xs sm:text-sm transition-all shadow-md ${
            cardiacPhase === 'diastole'
              ? 'bg-sky-500/20 border-sky-500 text-sky-300 ring-2 ring-sky-500/40 shadow-sky-950/40'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 text-sky-400" />
          <span>1. Atrial & Ventricular Diastole (Filling Phase)</span>
        </button>

        <button
          onClick={() => handleTogglePhase('systole')}
          className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border font-bold text-xs sm:text-sm transition-all shadow-md ${
            cardiacPhase === 'systole'
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/40 shadow-rose-950/40'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 text-rose-400" />
          <span>2. Ventricular Systole (Ejection Phase)</span>
        </button>
      </div>

      {/* Main Simulation Viewport: Coronal Heart Cross Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border ${
              cardiacPhase === 'diastole'
                ? 'bg-sky-950/80 text-sky-300 border-sky-600/40'
                : 'bg-rose-950/80 text-rose-300 border-rose-600/40'
            }`}>
              {cardiacPhase === 'diastole'
                ? 'Diastole: AV Valves OPEN • Semilunar Valves CLOSED (Filling)'
                : 'Systole: AV Valves SHUT ("LUB") • Semilunar FORCED OPEN (Ejection)'}
            </span>
          </div>

          {/* SVG Diagram: Coronal Heart Section */}
          <svg viewBox="0 0 480 340" className="w-full max-w-[440px] h-auto select-none my-auto">
            <defs>
              <linearGradient id="myoRight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1E40AF" />
                <stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>
              <linearGradient id="myoLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#991B1B" />
                <stop offset="100%" stopColor="#B91C1C" />
              </linearGradient>
            </defs>

            {/* HEART MUSCLE WALL CONTOURS */}
            <g transform="translate(60, 20)">
              {/* Outer Pericardium & Myocardium Shape */}
              <path
                d="M 50 100 
                   C 20 100, 0 160, 10 230 
                   C 20 280, 100 300, 175 300 
                   C 250 300, 340 280, 350 230 
                   C 360 160, 340 100, 310 100 
                   Z"
                fill="#0F172A"
                stroke="#64748B"
                strokeWidth="3"
              />

              {/* THICK MYOCARDIUM WALLS */}
              {/* Right Ventricle Outer Wall (Thin: ~4mm representation) */}
              <path
                d="M 15 200 C 18 250, 60 275, 105 285"
                stroke="#3B82F6"
                strokeWidth="7"
                fill="none"
              />
              <text x="50" y="275" fill="#93C5FD" fontSize="8" fontWeight="bold">RV Thin Wall</text>

              {/* Left Ventricle Outer Wall (Massively Thick: ~14mm representation, 3× thicker!) */}
              <path
                d="M 345 200 C 340 250, 290 280, 215 288"
                stroke="#EF4444"
                strokeWidth="20"
                fill="none"
              />
              <text x="310" y="275" fill="#FCA5A5" fontSize="8" fontWeight="bold">LV Thick Wall (3×)</text>

              {/* CENTRAL INTERVENTRICULAR SEPTUM (Dividing Wall) */}
              <rect x="160" y="100" width="30" height="195" rx="8" fill="#475569" stroke="#64748B" strokeWidth="2" />
              <text x="175" y="200" fill="#E2E8F0" fontSize="9" fontWeight="extrabold" textAnchor="middle" transform="rotate(-90 175 200)">
                SEPTUM (No Blood Mixing)
              </text>

              {/* RIGHT ATRIUM (RA) - Top Left (Viewer Perspective) */}
              <rect x="40" y="50" width="105" height="50" rx="8" fill="#1E3A8A" fillOpacity="0.7" stroke="#3B82F6" strokeWidth="1.5" />
              <text x="92" y="75" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">Right Atrium</text>
              <text x="92" y="88" fill="#93C5FD" fontSize="7.5" textAnchor="middle">(Vena Cava In)</text>

              {/* LEFT ATRIUM (LA) - Top Right */}
              <rect x="205" y="50" width="105" height="50" rx="8" fill="#991B1B" fillOpacity="0.7" stroke="#EF4444" strokeWidth="1.5" />
              <text x="257" y="75" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">Left Atrium</text>
              <text x="257" y="88" fill="#FCA5A5" fontSize="7.5" textAnchor="middle">(Pulm Vein In)</text>

              {/* RIGHT VENTRICLE (RV) - Bottom Left */}
              <rect x="40" y="115" width="105" height="110" rx="10" fill="#1E40AF" fillOpacity="0.5" />
              <text x="92" y="170" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">Right Ventricle</text>
              <text x="92" y="184" fill="#93C5FD" fontSize="8" textAnchor="middle">(Pulmonary Artery)</text>

              {/* LEFT VENTRICLE (LV) - Bottom Right */}
              <rect x="205" y="115" width="105" height="110" rx="10" fill="#B91C1C" fillOpacity="0.5" />
              <text x="257" y="170" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">Left Ventricle</text>
              <text x="257" y="184" fill="#FEF08A" fontSize="8.5" fontWeight="bold" textAnchor="middle">(Aorta • High P)</text>

              {/* VALVES DYNAMICS */}
              {/* 1. TRICUSPID VALVE (Between RA and RV) */}
              {cardiacPhase === 'diastole' ? (
                // AV Valve OPEN: flaps hanging down into ventricle
                <g transform="translate(65, 100)">
                  <line x1="0" y1="0" x2="15" y2="20" stroke="#FDE047" strokeWidth="3" />
                  <line x1="45" y1="0" x2="30" y2="20" stroke="#FDE047" strokeWidth="3" />
                  <text x="22" y="32" fill="#FDE047" fontSize="8" fontWeight="bold" textAnchor="middle">OPEN</text>
                </g>
              ) : (
                // AV Valve CLOSED: flaps pressed tight together
                <g transform="translate(65, 100)">
                  <line x1="0" y1="0" x2="22" y2="8" stroke="#EF4444" strokeWidth="3.5" />
                  <line x1="45" y1="0" x2="22" y2="8" stroke="#EF4444" strokeWidth="3.5" />
                  <text x="22" y="24" fill="#F87171" fontSize="8" fontWeight="bold" textAnchor="middle">SHUT</text>
                </g>
              )}

              {/* 2. BICUSPID / MITRAL VALVE (Between LA and LV) */}
              {cardiacPhase === 'diastole' ? (
                // Mitral OPEN
                <g transform="translate(235, 100)">
                  <line x1="0" y1="0" x2="15" y2="20" stroke="#FDE047" strokeWidth="3" />
                  <line x1="45" y1="0" x2="30" y2="20" stroke="#FDE047" strokeWidth="3" />
                  <text x="22" y="32" fill="#FDE047" fontSize="8" fontWeight="bold" textAnchor="middle">OPEN</text>
                </g>
              ) : (
                // Mitral CLOSED
                <g transform="translate(235, 100)">
                  <line x1="0" y1="0" x2="22" y2="8" stroke="#EF4444" strokeWidth="3.5" />
                  <line x1="45" y1="0" x2="22" y2="8" stroke="#EF4444" strokeWidth="3.5" />
                  <text x="22" y="24" fill="#F87171" fontSize="8" fontWeight="bold" textAnchor="middle">SHUT</text>
                </g>
              )}

              {/* Chordae Tendineae (Heart Strings) & Papillary Muscles */}
              <line x1="87" y1="120" x2="87" y2="210" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="87" cy="210" r="6" fill="#64748B" />

              <line x1="257" y1="120" x2="257" y2="210" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="257" cy="210" r="7" fill="#64748B" />

              {/* Blood Flow Vectors */}
              {cardiacPhase === 'diastole' ? (
                // Filling: Flow from atria into ventricles
                <g className="animate-pulse">
                  <path d="M 92 80 L 92 145" stroke="#38BDF8" strokeWidth="3" />
                  <path d="M 257 80 L 257 145" stroke="#F87171" strokeWidth="3" />
                </g>
              ) : (
                // Ejection: Flow up through semilunar valves into Aorta & Pulm Artery
                <g className="animate-pulse">
                  <path d="M 92 180 C 110 130, 130 50, 130 0" stroke="#38BDF8" strokeWidth="4" fill="none" />
                  <path d="M 257 180 C 230 120, 200 40, 200 0" stroke="#EF4444" strokeWidth="4.5" fill="none" />
                  <text x="200" y="-8" fill="#EF4444" fontSize="9.5" fontWeight="extrabold" textAnchor="middle">AORTA ↑</text>
                </g>
              )}
            </g>
          </svg>

          {/* Heart Sound Indicator Bar */}
          <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Heart Sound: <strong className="text-amber-400">{cardiacPhase === 'systole' ? '"LUB" (AV Valves close)' : '"DUB" (Semilunars close at onset)'}</strong>
            </span>
            <span className="font-mono text-cyan-300 font-semibold">
              {cardiacPhase === 'diastole' ? 'Ventricular Relaxation & Refilling' : 'Ventricular Contraction & Ejection'}
            </span>
          </div>
        </div>

        {/* Anatomical Significance Card */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Crucial Structural Adaptations
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <strong className="text-rose-300 block mb-0.5">Why Left Ventricle is 3× Thicker:</strong>
                The Right Ventricle only pumps blood a short distance to the lungs under low resistance, while the Left Ventricle must pump blood around the entire systemic body against high vascular resistance.
              </div>
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <strong className="text-amber-300 block mb-0.5">Chordae Tendineae (Heart Strings):</strong>
                Inelastic collagen cords tethering the valve flaps to ventricular papillary muscles, preventing the valves from being blown inside-out (inverted) into the atria during high-pressure systole.
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Valve Function Rule:
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Heart valves operate strictly passively depending on hydrostatic pressure gradients: they open when upstream pressure exceeds downstream pressure, and snap shut when downstream pressure rises to prevent backflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
