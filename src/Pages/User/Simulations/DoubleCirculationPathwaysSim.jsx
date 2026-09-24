import React, { useState } from 'react';
import { Heart, RotateCcw, Sparkles, CheckCircle2, Info, ArrowRight, Activity } from 'lucide-react';

export default function DoubleCirculationPathwaysSim({ config = {}, onTelemetry }) {
  // Primary Variable: Circuit Focus
  const [selectedCircuit, setSelectedCircuit] = useState('both'); // 'both' | 'pulmonary' | 'systemic'

  const circuits = {
    both: {
      name: 'Complete Double Circulation',
      description: 'Blood passes through the heart twice for every complete circuit around the body. The muscular interventricular septum prevents any mixing of oxygenated (left) and deoxygenated (right) blood.',
      path: 'Right Heart → Lungs → Left Heart → Body Tissues → Right Heart',
      pressureDesc: 'Differential Pressure: Low pressure in pulmonary loop (protects delicate lung capillaries); High pressure in systemic loop (powers perfusion over long distances).'
    },
    pulmonary: {
      name: '1. Pulmonary Circulation Loop',
      description: 'Deoxygenated blood leaves the Right Ventricle via the Pulmonary Artery, flows through alveolar lung capillaries (where it unloads CO₂ and takes up O₂), and returns as oxygenated blood to the Left Atrium via Pulmonary Veins.',
      path: 'Right Ventricle → Pulmonary Artery → Lung Capillaries → Pulmonary Veins → Left Atrium',
      pressureDesc: 'Low Hydrostatic Pressure (~25/10 mmHg): Prevents alveolar wall rupture and pulmonary oedema (fluid leaking into air sacs).'
    },
    systemic: {
      name: '2. Systemic Circulation Loop',
      description: 'Oxygenated blood is pumped out of the powerfully muscular Left Ventricle into the Aorta, branching to systemic tissues (head, limbs, kidneys, liver, gut), delivering O₂ and glucose, and returning deoxygenated blood via Vena Cava to the Right Atrium.',
      path: 'Left Ventricle → Aorta → Systemic Body Capillaries → Vena Cava → Right Atrium',
      pressureDesc: 'High Hydrostatic Pressure (~120/80 mmHg): Overcomes vascular resistance across millions of branching systemic capillary beds.'
    }
  };

  const current = circuits[selectedCircuit];

  const handleSelectCircuit = (c) => {
    setSelectedCircuit(c);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'double_circulation_pathways',
      circuit: c
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Mammalian Double Circulation System
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Animal Transport (Pulmonary vs Systemic Circuits)
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelectedCircuit('both')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset View
        </button>
      </div>

      {/* Primary Variable Control: Circuit Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {Object.entries(circuits).map(([key, item]) => {
          const isSelected = key === selectedCircuit;
          return (
            <button
              key={key}
              onClick={() => handleSelectCircuit(key)}
              className={`flex flex-col p-3 rounded-2xl border text-left transition ${
                isSelected
                  ? 'bg-slate-800 border-rose-500 shadow-md ring-1 ring-rose-500 shadow-rose-950/40'
                  : 'bg-slate-800/40 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80'
              }`}
            >
              <span className="text-xs font-bold text-white">{item.name}</span>
              <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">{item.path}</span>
            </button>
          );
        })}
      </div>

      {/* Main Simulation Viewport: Figure-8 Dual Loop Cardiovascular Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-rose-300">
              {current.name}
            </span>
          </div>

          {/* SVG Diagram: Figure-8 Double Circulation Scheme */}
          <svg viewBox="0 0 460 340" className="w-full max-w-[420px] h-auto select-none my-auto">
            {/* 1. LUNGS (Top Organ: Gas Exchange) */}
            <g
              transform="translate(150, 15)"
              className={`transition-opacity duration-300 ${
                selectedCircuit === 'systemic' ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <rect x="0" y="0" width="160" height="50" rx="14" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
              <text x="80" y="22" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                LUNGS (Pulmonary Bed)
              </text>
              <text x="80" y="38" fill="#38BDF8" fontSize="8.5" textAnchor="middle">
                Releases CO₂ ↑ • Absorbs O₂ ↓
              </text>
            </g>

            {/* 2. THE HEART (Center 4 Chambers) */}
            <g transform="translate(130, 100)">
              {/* Outer Heart Contour */}
              <rect x="0" y="0" width="200" height="120" rx="16" fill="#0F172A" stroke="#475569" strokeWidth="2.5" />

              {/* Central Interventricular Septum (thick dividing wall) */}
              <rect x="95" y="0" width="10" height="120" fill="#334155" />
              <text x="100" y="65" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle" transform="rotate(-90 100 65)">
                SEPTUM
              </text>

              {/* RIGHT SIDE OF HEART (Anatomical Right = Viewer Left) -> DEOXYGENATED (BLUE) */}
              {/* Right Atrium (RA) */}
              <rect x="5" y="5" width="85" height="50" rx="8" fill="#1E3A8A" fillOpacity="0.8" stroke="#3B82F6" strokeWidth="1.5" />
              <text x="47" y="32" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">Right Atrium</text>
              <text x="47" y="44" fill="#93C5FD" fontSize="7.5" textAnchor="middle">(Deoxygenated)</text>

              {/* Right Ventricle (RV) */}
              <rect x="5" y="60" width="85" height="55" rx="8" fill="#1E40AF" fillOpacity="0.8" stroke="#3B82F6" strokeWidth="1.5" />
              <text x="47" y="88" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">Right Ventricle</text>
              <text x="47" y="100" fill="#93C5FD" fontSize="7.5" textAnchor="middle">(To Lungs)</text>

              {/* LEFT SIDE OF HEART (Anatomical Left = Viewer Right) -> OXYGENATED (RED) */}
              {/* Left Atrium (LA) */}
              <rect x="110" y="5" width="85" height="50" rx="8" fill="#991B1B" fillOpacity="0.8" stroke="#EF4444" strokeWidth="1.5" />
              <text x="152" y="32" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">Left Atrium</text>
              <text x="152" y="44" fill="#FCA5A5" fontSize="7.5" textAnchor="middle">(From Lungs)</text>

              {/* Left Ventricle (LV) - Extra thick muscle border */}
              <rect x="110" y="60" width="85" height="55" rx="8" fill="#B91C1C" fillOpacity="0.8" stroke="#EF4444" strokeWidth="3" />
              <text x="152" y="88" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">Left Ventricle</text>
              <text x="152" y="100" fill="#FEF08A" fontSize="7.5" fontWeight="bold" textAnchor="middle">(Thick Wall • To Body)</text>
            </g>

            {/* 3. BODY TISSUES / ORGANS (Bottom Organ: Oxygen Consumption) */}
            <g
              transform="translate(150, 260)"
              className={`transition-opacity duration-300 ${
                selectedCircuit === 'pulmonary' ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <rect x="0" y="0" width="160" height="55" rx="14" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
              <text x="80" y="24" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                BODY TISSUES & ORGANS
              </text>
              <text x="80" y="40" fill="#F87171" fontSize="8.5" textAnchor="middle">
                Delivers O₂ ↓ • Collects CO₂ ↑
              </text>
            </g>

            {/* CONNECTING BLOOD VESSELS & STREAMLINES */}
            {/* PULMONARY LOOP (Upper Vessels) */}
            <g className={`transition-opacity duration-300 ${selectedCircuit === 'systemic' ? 'opacity-20' : 'opacity-100'}`}>
              {/* Pulmonary Artery: Right Ventricle (x=150, y=160) UP to Lungs (x=180, y=65) */}
              <path d="M 150 160 C 90 130, 90 80, 180 65" stroke="#3B82F6" strokeWidth="3.5" fill="none" strokeDasharray="6 3" />
              <text x="75" y="85" fill="#60A5FA" fontSize="8" fontWeight="bold">Pulmonary Artery</text>

              {/* Pulmonary Veins: Lungs (x=270, y=65) DOWN to Left Atrium (x=280, y=115) */}
              <path d="M 280 65 C 360 80, 350 110, 290 115" stroke="#EF4444" strokeWidth="3.5" fill="none" strokeDasharray="6 3" />
              <text x="340" y="85" fill="#F87171" fontSize="8" fontWeight="bold">Pulmonary Vein</text>
            </g>

            {/* SYSTEMIC LOOP (Lower Vessels) */}
            <g className={`transition-opacity duration-300 ${selectedCircuit === 'pulmonary' ? 'opacity-20' : 'opacity-100'}`}>
              {/* Aorta: Left Ventricle (x=280, y=210) DOWN to Body Tissues (x=280, y=260) */}
              <path d="M 280 210 C 370 220, 360 250, 280 260" stroke="#EF4444" strokeWidth="4" fill="none" strokeDasharray="6 3" />
              <text x="350" y="240" fill="#EF4444" fontSize="9" fontWeight="extrabold">Aorta (High P)</text>

              {/* Vena Cava: Body Tissues (x=180, y=260) UP to Right Atrium (x=140, y=115) */}
              <path d="M 180 260 C 80 250, 80 130, 140 115" stroke="#3B82F6" strokeWidth="4" fill="none" strokeDasharray="6 3" />
              <text x="45" y="225" fill="#60A5FA" fontSize="9" fontWeight="extrabold">Vena Cava</text>
            </g>
          </svg>

          {/* Telemetry Strip */}
          <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-slate-400 block mb-0.5">Hydraulic Pressure Rationale:</span>
            <span className="text-slate-300">{current.pressureDesc}</span>
          </div>
        </div>

        {/* Anatomical Significance Card */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Why Double Circulation Matters
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {current.description}
            </p>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
              <span className="font-bold text-slate-400 block mb-1">Functional Circuit Path:</span>
              <span className="text-emerald-300 font-mono text-[11px] font-semibold">{current.path}</span>
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Comparison with Fish (Single Circuit):
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Fish possess a <em>single circulation</em> (Heart → Gill Capillaries → Body Tissues → Heart). Blood pressure plunges sharply as it passes through the gill capillaries, resulting in slow, sluggish blood delivery to body tissues. Mammals solve this by returning blood to the heart to be re-pressurized before systemic delivery!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
