import React, { useState } from 'react';
import { Feather, RotateCcw, Sparkles, CheckCircle2, Info } from 'lucide-react';

export default function BirdBeaksFeedingAdaptationsSim({ config = {}, onTelemetry }) {
  // Primary Variable: Selected Bird Specimen
  const [selectedBirdId, setSelectedBirdId] = useState('finch');

  const birds = [
    {
      id: 'finch',
      name: 'Seed-Cracking Finch',
      guild: 'Granivore (Seed Eater)',
      beakShape: 'Short, Stout, Deep Conical Beak',
      foodTarget: 'Hard-shelled seeds, grains, and nuts',
      biomechanics: 'Short lever arm produces massive crushing mechanical advantage, generating forces up to 70 Newtons to crack open tough seed coats.',
      adaptations: [
        'Broad, reinforced jaw bones provide deep anchorage for massive adductor jaw muscles.',
        'Sharp crushing ridges along the palatal tomia slice seed hulls cleanly.',
        'Short beak length minimizes mechanical bending stress during heavy biting.'
      ],
      color: '#F59E0B'
    },
    {
      id: 'eagle',
      name: 'Raptor / African Fish Eagle',
      guild: 'Carnivore (Apex Predator)',
      beakShape: 'Sharp, Heavy Down-Hooked Beak',
      foodTarget: 'Vertebrate prey (fish, rodents, birds)',
      biomechanics: 'Sharp, pointed hook pierces skin; curved tomial cutting edges shear muscle fibers and strip meat from skeletons with backward neck pulls.',
      adaptations: [
        'Curved downward hook concentrates massive point pressure for tearing tough animal hide.',
        'Serrated cutting edges (tomia) act like surgical shears against meat.',
        'Strong bony nasal bridge resists twisting forces when wrestling struggling prey.'
      ],
      color: '#EF4444'
    },
    {
      id: 'sunbird',
      name: 'Sunbird / Hummingbird',
      guild: 'Nectarivore (Floral Specialist)',
      beakShape: 'Long, Slender, Decurved Needle Beak',
      foodTarget: 'Floral nectar deep in flower corollas',
      biomechanics: 'Delicate, elongated probes penetrate deep into tubular blossoms; capillary action and grooved tongue draw up sugary liquid.',
      adaptations: [
        'Extremely slender, lightweight keratin sheath enables probing narrow petals without damage.',
        'Curvature matches the floral morphology of co-evolved native plant species.',
        'Contains an extensible, tubular, brush-tipped tongue that laps up nectar at high frequency.'
      ],
      color: '#3B82F6'
    },
    {
      id: 'heron',
      name: 'Goliath Heron / Pelican',
      guild: 'Piscivore (Fish Hunter)',
      beakShape: 'Long, Dagger-like Spearing Beak',
      foodTarget: 'Fast-swimming aquatic fish and amphibians',
      biomechanics: 'Rapid spring-loaded neck extension drives the sharp dagger-like tip forward like a harpoon, impaling or clamping slippery aquatic prey.',
      adaptations: [
        'Streamlined, laterally compressed bill slices through water with minimal hydrodynamic drag.',
        'Fine backward-pointing serrations along the bill margin prevent slippery fish from escaping.',
        'Flexible mandibular joints allow swallowing large whole fish head-first.'
      ],
      color: '#10B981'
    }
  ];

  const currentBird = birds.find((b) => b.id === selectedBirdId) || birds[0];

  const handleSelectBird = (id) => {
    setSelectedBirdId(id);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'bird_beaks_feeding_adaptations',
      bird: id
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Feather className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Adaptive Radiation of Avian Beaks
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Animal Nutrition & Feeding Adaptations (Form Follows Function)
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelectedBirdId('finch')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Primary Variable Control: Bird Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {birds.map((b) => {
          const isSelected = b.id === selectedBirdId;
          return (
            <button
              key={b.id}
              onClick={() => handleSelectBird(b.id)}
              className={`flex flex-col p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-800 border-amber-500 shadow-md ring-1 ring-amber-500 shadow-amber-950/40'
                  : 'bg-slate-800/40 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {b.guild.split(' ')[0]}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white mt-0.5">
                {b.name.split('/')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Simulation Viewport: Beak Anatomy Graphic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-amber-300">
              {currentBird.guild} • {currentBird.beakShape}
            </span>
          </div>

          {/* SVG Head & Beak Anatomy */}
          <svg viewBox="0 0 460 300" className="w-full max-w-[420px] h-auto select-none my-auto">
            {/* Common Cranium Structure (Rear Head) */}
            <g transform="translate(60, 40)">
              {/* Skull / Feathered Cranium */}
              <path
                d="M 50 180 C 10 180, 0 120, 20 80 C 40 30, 110 30, 140 60 L 160 110 C 160 160, 120 180, 50 180 Z"
                fill="#334155"
                stroke="#64748B"
                strokeWidth="2.5"
              />
              {/* Bird Eye */}
              <circle cx="115" cy="85" r="14" fill="#0F172A" stroke="#FDE047" strokeWidth="2.5" />
              <circle cx="115" cy="85" r="7" fill="#000000" />
              <circle cx="112" cy="82" r="2.5" fill="#FFFFFF" />

              {/* DYNAMIC BEAK SHAPES PROJECTING FORWARD (Right: x = 140 to 360) */}
              {/* 1. SEED FINCH: SHORT, DEEP, CONICAL CRUSHER */}
              {selectedBirdId === 'finch' && (
                <g transform="translate(140, 75)">
                  {/* Upper Mandible (Rhamphotheca) */}
                  <polygon points="0,5 110,35 0,35" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
                  {/* Lower Mandible */}
                  <polygon points="0,35 110,35 0,70" fill="#D97706" stroke="#B45309" strokeWidth="2" />
                  {/* Seed held in crushing jaws */}
                  <ellipse cx="65" cy="35" rx="14" ry="10" fill="#78350F" stroke="#FDE68A" strokeWidth="1.5" />
                  <text x="65" y="38" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">Seed</text>
                  <text x="75" y="100" fill="#FDE68A" fontSize="10" fontWeight="bold" textAnchor="middle">
                    High Crushing Mechanical Force (70 N)
                  </text>
                </g>
              )}

              {/* 2. RAPTOR EAGLE: CURVED SHARP HOOK */}
              {selectedBirdId === 'eagle' && (
                <g transform="translate(140, 70)">
                  {/* Upper hooked mandible */}
                  <path
                    d="M 0 0 C 70 0, 110 20, 125 50 C 130 65, 120 75, 110 65 C 95 40, 60 30, 0 30 Z"
                    fill="#EAB308"
                    stroke="#CA8A04"
                    strokeWidth="2.5"
                  />
                  {/* Lower sharp cutting mandible */}
                  <path d="M 0 30 L 80 30 L 70 50 L 0 50 Z" fill="#CA8A04" stroke="#A16207" strokeWidth="2" />
                  <text x="80" y="95" fill="#FDE047" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Hooked Tomium (Tearing Meat & Skin)
                  </text>
                </g>
              )}

              {/* 3. SUNBIRD: LONG, SLENDER DECURVED NEEDLE */}
              {selectedBirdId === 'sunbird' && (
                <g transform="translate(140, 85)">
                  {/* Long curved upper probe */}
                  <path d="M 0 0 Q 120 15 220 55 L 0 10 Z" fill="#3B82F6" stroke="#2563EB" strokeWidth="1.5" />
                  {/* Lower needle probe */}
                  <path d="M 0 10 Q 120 20 220 55 L 0 18 Z" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="1.5" />

                  {/* Co-evolved Tubular Flower */}
                  <g transform="translate(180, 20)">
                    <path d="M 40 40 C 20 10, 60 10, 40 40" stroke="#EC4899" strokeWidth="8" fill="none" />
                    <text x="40" y="10" fill="#F472B6" fontSize="8" fontWeight="bold">Flower Corolla</text>
                  </g>
                  <text x="110" y="85" fill="#93C5FD" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Slender Probe (Nectar Sipping)
                  </text>
                </g>
              )}

              {/* 4. HERON: LONG, STRAIGHT DAGGER / SPEAR */}
              {selectedBirdId === 'heron' && (
                <g transform="translate(140, 80)">
                  {/* Upper spear */}
                  <polygon points="0,0 210,20 0,20" fill="#10B981" stroke="#059669" strokeWidth="2" />
                  {/* Lower spear */}
                  <polygon points="0,20 210,20 0,40" fill="#059669" stroke="#047857" strokeWidth="2" />
                  {/* Captured fish clamped in beak */}
                  <g transform="translate(120, 10)">
                    <ellipse cx="25" cy="10" rx="22" ry="7" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
                    <polygon points="45,10 55,5 55,15" fill="#0284C7" />
                  </g>
                  <text x="110" y="85" fill="#6EE7B7" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Dagger Beak (Harpooning Slippery Fish)
                  </text>
                </g>
              )}
            </g>
          </svg>

          {/* Telemetry Bar */}
          <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Primary Diet Target: <strong className="text-white">{currentBird.foodTarget}</strong>
            </span>
          </div>
        </div>

        {/* Biomechanical Analysis Card */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Biomechanical Engineering
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {currentBird.biomechanics}
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              {currentBird.adaptations.map((a, i) => (
                <div key={i} className="p-2 bg-slate-900/90 rounded-xl border border-slate-800 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-300 leading-snug">{a}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Darwin's Natural Selection:
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              In the Galápagos Islands, ancestral seed-eating finches diversified into separate species with specialized beaks to exploit non-overlapping food sources, eliminating competitive exclusion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
