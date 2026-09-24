import React, { useState } from 'react';
import { Beaker, Flame, Droplets, RotateCcw, AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';

export default function LeafStarchTestExperimentSim({ config = {}, onTelemetry }) {
  // Primary Variable: Experiment Step (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: '1. Boil Leaf in Water (1–2 Minutes)',
      apparatus: 'Beaker of boiling water on tripod and gauze with Bunsen burner',
      leafColor: 'Deep Green (Softening)',
      purpose: 'Kills the plant protoplasm, breaks down cell walls and cell membranes, and denatures cellular enzymes, making the leaf tissues fully permeable to reagents.',
      hazardAlert: 'Hot boiling water: use forceps to handle the specimen.',
      statusTag: 'Cell Lysis & Permeability'
    },
    {
      step: 2,
      title: '2. Boil in Alcohol / Ethanol (Water Bath)',
      apparatus: 'Boiling tube with 90% ethanol immersed in a boiling water bath',
      leafColor: 'Pale Cream / White (Decolorized)',
      purpose: 'Extracts chlorophyll pigments (chlorophyll is soluble in organic ethanol but insoluble in water). Decolorizing to pale white is essential so subsequent color changes with iodine are clearly visible.',
      hazardAlert: 'FIRE HAZARD: Alcohol is highly flammable! Never heat ethanol directly over an open naked flame; always use a hot water bath.',
      statusTag: 'Chlorophyll Extraction'
    },
    {
      step: 3,
      title: '3. Dip in Warm Water',
      apparatus: 'Petri dish of lukewarm water',
      leafColor: 'Soft, Pliable Pale Cream Leaf',
      purpose: 'Alcohol dehydrates leaf tissues, making them hard and brittle. Dipping briefly in warm water rehydrates the cell walls, making the leaf soft, pliable, and easy to spread flat.',
      hazardAlert: 'Handle gently with forceps to prevent tearing the delicate leaf blade.',
      statusTag: 'Tissue Rehydration'
    },
    {
      step: 4,
      title: '4. Flood with Iodine Solution',
      apparatus: 'White ceramic tile / petri dish with dropper of Iodine solution (Lugol\'s)',
      leafColor: 'Blue-Black Pattern with Yellow-Brown Strip',
      purpose: 'Iodine stains amylose helical coils in starch. Areas exposed to light photosynthesized glucose and stored it as starch (turn intense Blue-Black). The covered center strip received no light, could not photosynthesize (remains Yellow-Brown).',
      hazardAlert: 'Iodine stains skin and clothing; handle dropper carefully.',
      statusTag: 'Starch Diagnostic Reaction'
    }
  ];

  const currentStepData = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep === 4) {
        onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'leaf_starch_test_experiment',
          completedExperiment: true
        });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Beaker className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Testing a Leaf for Starch (Sachs' Experiment)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Plant Nutrition & Photosynthesis
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset Lab
        </button>
      </div>

      {/* Step Navigator Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {steps.map((s) => {
          const isActive = s.step === currentStep;
          const isDone = s.step < currentStep;
          return (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`flex flex-col p-3 rounded-2xl border text-left transition ${
                isActive
                  ? 'bg-amber-500/20 border-amber-500/60 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/50'
                  : isDone
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                  : 'bg-slate-800/40 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Step {s.step}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                ) : null}
              </div>
              <span className={`text-xs font-bold mt-1 line-clamp-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                {s.statusTag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Lab Bench Simulation Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Stage Title Callout */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-amber-300 shadow">
              {currentStepData.title}
            </span>
          </div>

          {/* SVG Apparatus & Leaf Demonstration */}
          <svg viewBox="0 0 500 320" className="w-full max-w-[480px] h-auto select-none">
            {/* Lab Bench Table */}
            <rect x="20" y="270" width="460" height="20" rx="3" fill="#334155" stroke="#475569" strokeWidth="1.5" />
            <line x1="20" y1="290" x2="480" y2="290" stroke="#1E293B" strokeWidth="2" />

            {/* STEP 1: Boiling in Water */}
            {currentStep === 1 && (
              <g transform="translate(160, 40)">
                {/* Tripod & Bunsen burner */}
                <path d="M 40 230 L 10 160 M 140 230 L 170 160" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
                <rect x="5" y="160" width="170" height="6" rx="2" fill="#CBD5E1" />
                {/* Bunsen Base & Barrel */}
                <rect x="80" y="195" width="20" height="35" fill="#64748B" />
                <ellipse cx="90" cy="230" rx="35" ry="8" fill="#475569" />
                {/* Flame */}
                <polygon points="85,195 90,165 95,195" fill="#38BDF8" opacity="0.8" />
                <polygon points="82,195 90,150 98,195" fill="#F59E0B" opacity="0.9" className="animate-pulse" />

                {/* Beaker with boiling water */}
                <rect x="30" y="60" width="120" height="100" rx="6" fill="#0284C7" fillOpacity="0.25" stroke="#94A3B8" strokeWidth="2.5" />
                {/* Boiling bubbles */}
                <circle cx="55" cy="120" r="4" fill="#E0F2FE" opacity="0.7" className="animate-bounce" />
                <circle cx="85" cy="100" r="5" fill="#E0F2FE" opacity="0.6" />
                <circle cx="120" cy="130" r="3" fill="#E0F2FE" opacity="0.8" />
                <circle cx="100" cy="80" r="4" fill="#E0F2FE" opacity="0.7" />

                {/* Green Leaf inside beaker */}
                <g transform="translate(70, 75) rotate(20)">
                  <path
                    d="M 20 0 C 45 10, 45 50, 20 65 C -5 50, -5 10, 20 0 Z"
                    fill="#15803D"
                    stroke="#166534"
                    strokeWidth="1.5"
                  />
                  {/* Black paper strip across leaf */}
                  <rect x="2" y="25" width="36" height="12" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
                </g>

                <text x="90" y="45" fill="#93C5FD" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Boiling Water (100°C)
                </text>
              </g>
            )}

            {/* STEP 2: Boiling in Ethanol (Water Bath) */}
            {currentStep === 2 && (
              <g transform="translate(150, 30)">
                {/* Tripod & Gauze */}
                <path d="M 40 240 L 10 170 M 160 240 L 190 170" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
                <rect x="5" y="170" width="190" height="6" rx="2" fill="#CBD5E1" />
                {/* Flame under water bath */}
                <polygon points="95,200 100,160 105,200" fill="#F59E0B" className="animate-pulse" />

                {/* Outer Beaker (Water Bath) */}
                <rect x="20" y="70" width="160" height="100" rx="8" fill="#0284C7" fillOpacity="0.2" stroke="#94A3B8" strokeWidth="2" />
                <text x="40" y="150" fill="#38BDF8" fontSize="9" fontWeight="bold">
                  Water Bath
                </text>

                {/* Inner Boiling Tube with Alcohol/Ethanol */}
                <rect x="80" y="30" width="40" height="125" rx="10" fill="#10B981" fillOpacity="0.3" stroke="#CBD5E1" strokeWidth="2.5" />
                <text x="100" y="22" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Ethanol Tube
                </text>

                {/* Decolorizing Leaf in Ethanol (becoming pale white) */}
                <g transform="translate(90, 80) rotate(10)">
                  <path
                    d="M 10 0 C 25 10, 25 40, 10 55 C -5 40, -5 10, 10 0 Z"
                    fill="#F1F5F9"
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                  />
                  <rect x="-1" y="20" width="22" height="10" fill="#334155" />
                </g>

                {/* Green chlorophyll leaching out indicator */}
                <text x="100" y="145" fill="#6EE7B7" fontSize="8" textAnchor="middle">
                  Chlorophyll dissolved
                </text>
              </g>
            )}

            {/* STEP 3: Dipping in Warm Water */}
            {currentStep === 3 && (
              <g transform="translate(140, 70)">
                {/* Petri Dish of Warm Water */}
                <ellipse cx="110" cy="140" rx="110" ry="35" fill="#0284C7" fillOpacity="0.25" stroke="#94A3B8" strokeWidth="2" />
                <ellipse cx="110" cy="135" rx="100" ry="28" fill="#38BDF8" fillOpacity="0.2" />

                {/* Forceps holding the pale leaf */}
                <path d="M 60 20 L 95 100 M 130 20 L 105 100" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
                <text x="95" y="15" fill="#CBD5E1" fontSize="10" textAnchor="middle">
                  Forceps
                </text>

                {/* Pale Leaf floating in water, softening */}
                <g transform="translate(100, 105) rotate(15)">
                  <path
                    d="M 15 0 C 35 10, 35 45, 15 60 C -5 45, -5 10, 15 0 Z"
                    fill="#F8FAFC"
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                  />
                  <rect x="0" y="22" width="30" height="12" fill="#475569" opacity="0.8" />
                </g>

                <text x="110" y="195" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Lukewarm Water Dish (Rehydrating Brittle Leaf)
                </text>
              </g>
            )}

            {/* STEP 4: Staining with Iodine on White Tile */}
            {currentStep === 4 && (
              <g transform="translate(120, 40)">
                {/* White Ceramic Tile */}
                <rect x="20" y="70" width="220" height="150" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.4))" />
                <text x="130" y="90" fill="#64748B" fontSize="10" fontWeight="bold" textAnchor="middle">
                  White Ceramic Diagnostic Tile
                </text>

                {/* Dropper adding Iodine */}
                <g transform="translate(160, 10)">
                  <path d="M 10 0 L 20 0 L 18 35 L 15 45 L 12 35 Z" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
                  <ellipse cx="15" cy="0" rx="8" ry="4" fill="#DC2626" />
                  {/* Droplet falling */}
                  <circle cx="15" cy="55" r="2.5" fill="#B45309" className="animate-bounce" />
                  <text x="25" y="25" fill="#F59E0B" fontSize="9.5" fontWeight="bold">
                    Iodine (Lugol's)
                  </text>
                </g>

                {/* STARCH REACTION RESULT ON LEAF */}
                <g transform="translate(90, 95)">
                  {/* Outer / exposed areas: Intense Blue-Black (Starch Positive) */}
                  <path
                    d="M 40 0 C 80 15, 80 80, 40 110 C 0 80, 0 15, 40 0 Z"
                    fill="#1E1B4B"
                    stroke="#312E81"
                    strokeWidth="2"
                  />

                  {/* Covered Center Strip: Remained Yellow-Brown (Starch Negative) */}
                  <rect x="5" y="42" width="70" height="26" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />

                  {/* Annotations */}
                  <text x="40" y="58" fill="#FEF3C7" fontSize="9" fontWeight="extrabold" textAnchor="middle">
                    NO STARCH (Yellow-Brown)
                  </text>
                  <text x="40" y="28" fill="#93C5FD" fontSize="9" fontWeight="extrabold" textAnchor="middle">
                    STARCH PRESENT
                  </text>
                  <text x="40" y="96" fill="#93C5FD" fontSize="9" fontWeight="extrabold" textAnchor="middle">
                    (Blue-Black)
                  </text>
                </g>

                {/* Pin pointer labels */}
                <line x1="30" y1="150" x2="90" y2="150" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="25" y="145" fill="#F59E0B" fontSize="9" fontWeight="bold" textAnchor="end">
                  Covered by Black Paper
                </text>
              </g>
            )}
          </svg>

          {/* Navigation Controls */}
          <div className="w-full flex items-center justify-between mt-4 px-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition ${
                currentStep === 1
                  ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Previous Step
            </button>

            <span className="text-xs font-bold text-slate-400">
              Step {currentStep} of 4
            </span>

            <button
              onClick={handleNext}
              disabled={currentStep === 4}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow ${
                currentStep === 4
                  ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-800/40'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/40'
              }`}
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Detailed Scientific Rationale Card */}
        <div className="lg:col-span-4 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Step Rationale & Protocol
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                {currentStepData.leafColor}
              </span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Biological Purpose:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentStepData.purpose}
              </p>
            </div>

            {/* Safety Warning Box */}
            <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-800/40 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-rose-200 leading-snug">
                {currentStepData.hazardAlert}
              </p>
            </div>
          </div>

          {/* Diagnostic Takeaways */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Scientific Deductions:
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-slate-400">
              <li>
                <strong className="text-slate-200">Destarching Before Test:</strong> The potted plant must first be kept in total darkness for 48 hours to ensure all pre-existing starch is translocated away.
              </li>
              <li>
                <strong className="text-slate-200">Light is Essential:</strong> Since only the unmasked area formed starch, light is conclusively demonstrated to be an indispensable requirement for photosynthesis.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
