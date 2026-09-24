import React, { useState } from 'react';
import { Microscope, RotateCcw, Sparkles, Info } from 'lucide-react';

export default function MicroscopeMagnificationSim({ config = {}, onTelemetry }) {
  // Primary Variable: Objective Lens Magnification
  // Options: 4x (Low, Total 40x), 10x (Medium, Total 100x), 40x (High, Total 400x)
  const [objectiveIndex, setObjectiveIndex] = useState(0); // 0 = 4x, 1 = 10x, 2 = 40x
  const [focusOffset, setFocusOffset] = useState(0); // -6 to +6, 0 is crisp
  const [specimenType, setSpecimenType] = useState('onion'); // 'onion' (plant) or 'cheek' (animal)

  const objectives = [
    {
      power: '4x',
      eyepiece: '10x',
      totalMag: '40x',
      label: 'Low Power (Scan)',
      fieldDiameterUm: 4500, // 4.5 mm
      visibleCellsCount: 48,
      cellZoomScale: 1.0,
      description: 'Wide field of view. Best for locating the specimen and scanning tissue layout.',
      color: 'border-red-500 text-red-600 bg-red-50'
    },
    {
      power: '10x',
      eyepiece: '10x',
      totalMag: '100x',
      label: 'Medium Power',
      fieldDiameterUm: 1800, // 1.8 mm
      visibleCellsCount: 16,
      cellZoomScale: 2.5,
      description: 'Intermediate field of view. Individual cell boundaries and nuclei become distinct.',
      color: 'border-yellow-500 text-yellow-600 bg-yellow-50'
    },
    {
      power: '40x',
      eyepiece: '10x',
      totalMag: '400x',
      label: 'High Power',
      fieldDiameterUm: 450, // 0.45 mm
      visibleCellsCount: 4,
      cellZoomScale: 6.5,
      description: 'Narrow field of view. High detail revealing cell walls, nucleoli, and granular cytoplasm.',
      color: 'border-blue-500 text-blue-600 bg-blue-50'
    }
  ];

  const currentObj = objectives[objectiveIndex];

  const handleSelectObjective = (idx) => {
    setObjectiveIndex(idx);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'microscope_magnification_explorer',
      objective: objectives[idx].power,
      totalMag: objectives[idx].totalMag
    });
  };

  const handleReset = () => {
    setObjectiveIndex(0);
    setFocusOffset(0);
    setSpecimenType('onion');
  };

  // Blur level derived from focus offset
  const blurPx = Math.abs(focusOffset) * 0.6;

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Microscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Microscope Magnification & Field of View
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Cell Structure & Specialization
            </p>
          </div>
        </div>

        {/* Specimen Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-xs font-bold">
          <button
            onClick={() => setSpecimenType('onion')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              specimenType === 'onion' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🧅 Onion Epidermis (Plant)
          </button>
          <button
            onClick={() => setSpecimenType('cheek')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              specimenType === 'cheek' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            👄 Cheek Epithelium (Animal)
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: Circular Microscope Eyepiece View (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          {/* Eyepiece Outer Barrel */}
          <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 border-slate-600 flex items-center justify-center">
            {/* Ocular Circular Aperture / Field of View */}
            <div className="relative w-full h-full rounded-full overflow-hidden bg-amber-50/10 border-2 border-slate-400 shadow-inner flex items-center justify-center">
              {/* Microscope Reticle Crosshairs */}
              <div className="absolute inset-0 pointer-events-none z-20 opacity-30">
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-400" />
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-400" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-slate-400" />
              </div>

              {/* Dynamic Cell Specimen SVG Canvas */}
              <div
                className="w-full h-full flex items-center justify-center transition-all duration-500 ease-out"
                style={{
                  filter: `blur(${blurPx}px)`,
                  transform: `scale(${currentObj.cellZoomScale})`
                }}
              >
                {specimenType === 'onion' ? (
                  /* Onion Epidermal Cells (Brick-like regular lattice) */
                  <svg viewBox="-150 -150 300 300" className="w-[320px] h-[320px]">
                    {[-120, -60, 0, 60, 120].map((y, rowIdx) =>
                      [-120, -40, 40, 120].map((x, colIdx) => {
                        const offsetX = (rowIdx % 2) * 20;
                        return (
                          <g key={`${rowIdx}-${colIdx}`} transform={`translate(${x + offsetX}, ${y})`}>
                            {/* Rigid Cellulose Cell Wall */}
                            <rect
                              x="-36"
                              y="-26"
                              width="72"
                              height="52"
                              rx="4"
                              fill="#10B981"
                              fillOpacity="0.18"
                              stroke="#059669"
                              strokeWidth={currentObj.cellZoomScale > 3 ? "2" : "1.2"}
                            />
                            {/* Plasma membrane inner line */}
                            <rect
                              x="-34"
                              y="-24"
                              width="68"
                              height="48"
                              rx="3"
                              fill="none"
                              stroke="#34D399"
                              strokeWidth="0.8"
                              strokeDasharray="3,1"
                            />
                            {/* Cytoplasm & Large Central Vacuole */}
                            <ellipse cx="2" cy="0" rx="26" ry="18" fill="#6EE7B7" fillOpacity="0.12" />
                            {/* Stained Nucleus (displaced to edge) */}
                            <circle cx="16" cy="10" r={currentObj.cellZoomScale > 3 ? "7" : "4.5"} fill="#D97706" fillOpacity="0.85" />
                            {/* Nucleolus inside nucleus */}
                            {currentObj.cellZoomScale > 3 && (
                              <circle cx="17.5" cy="9" r="2" fill="#78350F" />
                            )}
                          </g>
                        );
                      })
                    )}
                  </svg>
                ) : (
                  /* Cheek Epithelial Cells (Irregular polygonal squamous cells) */
                  <svg viewBox="-150 -150 300 300" className="w-[320px] h-[320px]">
                    {[
                      { x: -50, y: -40, r: 42, rot: 15 },
                      { x: 45, y: -30, r: 38, rot: -20 },
                      { x: -30, y: 50, r: 45, rot: 40 },
                      { x: 55, y: 45, r: 36, rot: -10 },
                      { x: 0, y: 0, r: 40, rot: 5 }
                    ].map((cell, idx) => (
                      <g key={idx} transform={`translate(${cell.x}, ${cell.y}) rotate(${cell.rot})`}>
                        {/* Flexible, Irregular Cell Membrane */}
                        <path
                          d="M -35 -20 Q -40 10, -25 35 Q 0 42, 25 32 Q 40 15, 35 -15 Q 15 -35, -20 -32 Z"
                          fill="#F43F5E"
                          fillOpacity="0.18"
                          stroke="#E11D48"
                          strokeWidth={currentObj.cellZoomScale > 3 ? "2" : "1.2"}
                        />
                        {/* Cytoplasm Granules */}
                        <circle cx="-10" cy="-8" r="1.5" fill="#FDA4AF" opacity="0.6" />
                        <circle cx="12" cy="15" r="1.2" fill="#FDA4AF" opacity="0.6" />
                        {/* Central Dark Blue Methylene Blue Stained Nucleus */}
                        <circle cx="2" cy="1" r={currentObj.cellZoomScale > 3 ? "8" : "5"} fill="#1E3A8A" fillOpacity="0.9" />
                        {currentObj.cellZoomScale > 3 && (
                          <circle cx="3.5" cy="0" r="2.2" fill="#172554" />
                        )}
                      </g>
                    ))}
                  </svg>
                )}
              </div>

              {/* Live Field of View Label in Lens */}
              <div className="absolute bottom-4 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700 text-[11px] font-mono text-amber-300">
                Field Diameter: ~{currentObj.fieldDiameterUm} µm
              </div>
            </div>
          </div>
        </div>

        {/* Right: Objective Turret & Metrics Panel (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Step 1: Revolving Nosepiece / Objective Selector */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Select Objective Lens
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Total Mag = {currentObj.totalMag}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {objectives.map((obj, idx) => (
                <button
                  key={obj.power}
                  onClick={() => handleSelectObjective(idx)}
                  className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    objectiveIndex === idx
                      ? `${obj.color} shadow-lg shadow-black/40 scale-102`
                      : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-extrabold">{obj.power}</span>
                  <span className="text-[10px] font-medium opacity-80">{obj.totalMag}</span>
                </button>
              ))}
            </div>

            {/* Explanation of active objective */}
            <div className="mt-3 p-2.5 bg-slate-900/80 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>{currentObj.description}</span>
            </div>
          </div>

          {/* Step 2: Fine Focus Adjustment Slider */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Fine Focus Knob
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                Math.abs(focusOffset) <= 2
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {Math.abs(focusOffset) <= 2 ? 'Sharp Focus ✓' : 'Blurry'}
              </span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="1"
              value={focusOffset}
              onChange={(e) => setFocusOffset(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>Under-focused</span>
              <span className="text-slate-400 font-bold">Optimal Focal Plane (0)</span>
              <span>Over-focused</span>
            </div>
          </div>

          {/* Biological Principle Comparison Card */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              The Inverse Law of Field of View
            </h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Apparent Size</span>
                <span className="text-sm font-extrabold text-blue-400">
                  {objectiveIndex === 0 ? 'Smallest' : objectiveIndex === 1 ? 'Medium' : 'Largest (Detailed)'}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Field of View (Area)</span>
                <span className="text-sm font-extrabold text-amber-400">
                  {objectiveIndex === 0 ? 'Widest (~4.5 mm)' : objectiveIndex === 1 ? 'Intermediate' : 'Narrowest (~0.45 mm)'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
              💡 <span className="font-semibold text-slate-200">Rule:</span> When magnification increases, you see <em>fewer cells</em> in greater detail because the field of view diameter shrinks proportionally!
            </p>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Microscope
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
