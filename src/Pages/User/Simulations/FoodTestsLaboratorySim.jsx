import React, { useState } from 'react';
import { Beaker, Flame, RotateCcw, Sparkles, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export default function FoodTestsLaboratorySim({ config = {}, onTelemetry }) {
  // Primary Variable: Selected Food Test
  const [selectedTestId, setSelectedTestId] = useState('benedict');
  const [testedReagents, setTestedReagents] = useState({ benedict: true });

  const foodTests = [
    {
      id: 'benedict',
      name: "Benedict's Test",
      targetNutrient: 'Reducing Sugars (Glucose / Maltose)',
      reagentName: "Benedict's Quantitative Reagent",
      reagentInitialColor: 'Clear Bright Blue',
      initialHex: '#38BDF8',
      requiresHeat: true,
      resultPositiveColor: 'Brick-Red Precipitate',
      resultHex: '#DC2626',
      procedure: 'Add equal volume of Benedict\'s solution to food sample. Heat in a boiling water bath (80–100°C) for 3–5 minutes.',
      chemicalPrinciple: 'Cu²⁺ ions in alkaline copper sulfate are reduced by free aldehyde/ketone groups of reducing sugars to insoluble Cu⁺ red copper(I) oxide (Cu₂O) precipitate.',
      gradientColors: ['#38BDF8 (Blue)', '#22C55E (Green trace)', '#F59E0B (Orange moderate)', '#DC2626 (Brick-Red high)']
    },
    {
      id: 'iodine',
      name: 'Iodine Test',
      targetNutrient: 'Starch (Polysaccharide)',
      reagentName: 'Iodine in Potassium Iodide (Lugol\'s)',
      reagentInitialColor: 'Yellow-Brown / Amber',
      initialHex: '#D97706',
      requiresHeat: false,
      resultPositiveColor: 'Deep Blue-Black Complex',
      resultHex: '#1E1B4B',
      procedure: 'Add 2–3 drops of iodine solution directly to solid or suspension of food sample. No heating required.',
      chemicalPrinciple: 'Polyiodide ions (I₃⁻ and I₅⁻) slip into the center of the helical amylose starch polymer coil, absorbing visible light to produce an intense blue-black coloration.',
      gradientColors: ['#D97706 (Yellow-Brown Negative)', '#1E1B4B (Blue-Black Positive)']
    },
    {
      id: 'biuret',
      name: 'Biuret Test',
      targetNutrient: 'Proteins (Peptide Bonds)',
      reagentName: 'Biuret Reagent (NaOH + dilute CuSO₄)',
      reagentInitialColor: 'Light Blue',
      initialHex: '#60A5FA',
      requiresHeat: false,
      resultPositiveColor: 'Vivid Violet / Purple',
      resultHex: '#8B5CF6',
      procedure: 'Add equal volume of 10% sodium hydroxide (NaOH) to food solution, then add 2–3 drops of 1% copper(II) sulfate (CuSO₄) without shaking violently.',
      chemicalPrinciple: 'In alkaline solution, cupric (Cu²⁺) ions coordinate with nitrogen atoms in 4 to 6 adjacent peptide (-CONH-) bonds, shifting light absorption to violet.',
      gradientColors: ['#60A5FA (Blue Negative)', '#C084FC (Pink/Violet Low)', '#7C3AED (Deep Purple High)']
    },
    {
      id: 'ethanol',
      name: 'Ethanol Emulsion Test',
      targetNutrient: 'Lipids (Fats & Oils)',
      reagentName: 'Absolute Ethanol + Cold Distilled Water',
      reagentInitialColor: 'Clear Colourless Solution',
      initialHex: '#E2E8F0',
      requiresHeat: false,
      resultPositiveColor: 'Cloudy White (Milky) Emulsion',
      resultHex: '#F8FAFC',
      procedure: 'Crush food sample with 2 ml of absolute ethanol and shake vigorously to dissolve lipids. Decant clear liquid into equal volume of cold water.',
      chemicalPrinciple: 'Lipids are non-polar and dissolve in ethanol, but are insoluble in water. Adding water forces lipid molecules to precipitate out as microscopic suspended droplets, scattering light.',
      gradientColors: ['#E2E8F0 (Clear Negative)', '#F1F5F9 (Milky Cloudy White Emulsion Positive)']
    }
  ];

  const currentTest = foodTests.find((t) => t.id === selectedTestId) || foodTests[0];

  const handleSelectTest = (id) => {
    setSelectedTestId(id);
    setTestedReagents((prev) => {
      const updated = { ...prev, [id]: true };
      if (Object.keys(updated).length >= 4) {
        onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'food_tests_laboratory',
          allTestsMastered: true
        });
      }
      return updated;
    });
  };

  const handleReset = () => {
    setSelectedTestId('benedict');
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Beaker className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Virtual Food Testing Laboratory
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Qualitative Biochemical Assays
            </p>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Lab Bench
        </button>
      </div>

      {/* Test Selector Buttons (1 Primary Interaction) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {foodTests.map((test) => {
          const isSelected = test.id === selectedTestId;
          return (
            <button
              key={test.id}
              onClick={() => handleSelectTest(test.id)}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/10 text-white shadow-lg shadow-black/40 scale-102'
                  : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className="text-xs font-extrabold">{test.name}</span>
              <span className="text-[10px] font-mono text-amber-300/80">{test.targetNutrient.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Laboratory Bench Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: Interactive Test Tube Apparatus (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-950/70 rounded-3xl p-6 border border-slate-800 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
          {/* Apparatus Stage */}
          <div className="relative w-full max-w-xs flex flex-col items-center justify-center">
            {/* Water Bath Flask (if heat is required) */}
            {currentTest.requiresHeat ? (
              <div className="flex flex-col items-center animate-fadeIn">
                {/* Boiling Beaker */}
                <div className="relative w-48 h-44 rounded-b-3xl border-4 border-slate-400 bg-cyan-950/30 overflow-hidden flex items-end justify-center pb-2 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                  {/* Boiling Water */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-sky-500/20 border-t border-sky-400/40 flex items-center justify-around">
                    <span className="animate-bounce text-xs">🫧</span>
                    <span className="animate-bounce delay-150 text-xs">🫧</span>
                    <span className="animate-bounce delay-300 text-xs">🫧</span>
                  </div>

                  {/* Suspended Test Tube inside Water Bath */}
                  <div className="relative w-12 h-36 rounded-b-full border-2 border-slate-200 bg-slate-800/80 overflow-hidden flex items-end justify-center shadow-lg z-10">
                    {/* Liquid Column with Reaction Result Color */}
                    <div
                      className="w-full h-24 rounded-b-full transition-all duration-700 ease-out flex items-center justify-center"
                      style={{ backgroundColor: currentTest.resultHex }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white/40 animate-ping" />
                    </div>
                  </div>
                </div>

                {/* Bunsen Burner Flame Beneath Beaker */}
                <div className="flex flex-col items-center mt-2">
                  <div className="flex items-center gap-1 text-amber-400 animate-pulse">
                    <Flame className="w-7 h-7 text-amber-500 fill-amber-400" />
                    <Flame className="w-8 h-8 text-blue-400 fill-blue-500" />
                    <Flame className="w-7 h-7 text-amber-500 fill-amber-400" />
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 font-bold uppercase">
                    Boiling Water Bath (100°C)
                  </span>
                </div>
              </div>
            ) : (
              /* Ambient Temperature Test Tube Rack */
              <div className="flex flex-col items-center justify-center py-6 animate-fadeIn">
                {/* Free Standing Test Tube with Dropper */}
                <div className="relative w-16 h-52 rounded-b-full border-3 border-slate-300 bg-slate-800/80 overflow-hidden flex items-end justify-center shadow-[0_0_30px_rgba(0,0,0,0.6)]">
                  {/* Liquid Column */}
                  <div
                    className="w-full h-32 rounded-b-full transition-all duration-700 ease-out flex flex-col items-center justify-center"
                    style={{ backgroundColor: currentTest.resultHex }}
                  >
                    {currentTest.id === 'ethanol' && (
                      <div className="text-[10px] font-bold text-slate-800 bg-white/70 px-1 rounded">
                        Milky Emulsion
                      </div>
                    )}
                  </div>
                </div>

                {/* Wooden Rack Stand */}
                <div className="w-36 h-4 bg-amber-800 rounded-md mt-2 shadow border border-amber-700" />
                <span className="text-[10px] font-mono text-slate-400 mt-2">
                  Room Temperature Reaction
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chemistry & Observation Inspector (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          {/* Target Nutrient Badge */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Nutrient Tested
              </span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                {currentTest.targetNutrient}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-100">
              Reagent Used: <span className="text-amber-300">{currentTest.reagentName}</span>
            </p>
          </div>

          {/* Observable Color Result Card */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Observable Color Transformation
            </span>
            <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700">
              <div className="flex flex-col items-center">
                <span className="w-5 h-5 rounded-full border border-white/20 mb-1" style={{ backgroundColor: currentTest.initialHex }} />
                <span className="text-[10px] text-slate-400 font-mono text-center">Initial</span>
              </div>
              <span className="text-slate-500 font-bold">→</span>
              <div className="flex flex-col items-center flex-1">
                <span className="w-5 h-5 rounded-full border border-white/40 mb-1" style={{ backgroundColor: currentTest.resultHex }} />
                <span className="text-xs font-extrabold text-emerald-400 font-mono text-center">
                  {currentTest.resultPositiveColor}
                </span>
              </div>
            </div>
          </div>

          {/* Biochemical Mechanism */}
          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/80 text-xs text-slate-300 leading-relaxed">
            <div className="font-bold text-slate-200 mb-1 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              Laboratory Principle
            </div>
            {currentTest.chemicalPrinciple}
          </div>
        </div>
      </div>
    </div>
  );
}
