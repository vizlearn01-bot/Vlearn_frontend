import React, { useState } from 'react';
import { Target, RotateCcw, Sparkles, CheckCircle2, Info, ArrowRight } from 'lucide-react';

export default function SpecializedCellsAdaptationsSim({ config = {}, onTelemetry }) {
  // Primary Variable: Selected Specialized Cell
  const [selectedCellId, setSelectedCellId] = useState('rbc');
  const [activePin, setActivePin] = useState(null);

  const specializedCells = [
    {
      id: 'rbc',
      name: 'Red Blood Cell',
      scientificName: 'Erythrocyte',
      organism: 'Human / Mammal',
      themeColor: 'border-rose-500 text-rose-500 bg-rose-500/10',
      badgeColor: 'bg-rose-500 text-white',
      coreFunction: 'Transports oxygen from the lungs to all respiring body tissues.',
      adaptations: [
        {
          feature: 'Biconcave Disc Shape',
          benefit: 'Depressed center dramatically increases surface-area-to-volume ratio (SA/V), shortening diffusion distance for O₂ exchange.'
        },
        {
          feature: 'Absence of Nucleus & Organelles',
          benefit: 'Enucleated at maturity, freeing up 100% of internal volume to pack ~270 million haemoglobin molecules.'
        },
        {
          feature: 'Flexible Elastic Membrane',
          benefit: 'Can deform and fold into a parachute shape to slip single-file through narrow 5 µm capillaries without rupturing.'
        }
      ]
    },
    {
      id: 'sperm',
      name: 'Sperm Cell',
      scientificName: 'Spermatozoon',
      organism: 'Human / Animal Male',
      themeColor: 'border-cyan-500 text-cyan-500 bg-cyan-500/10',
      badgeColor: 'bg-cyan-500 text-white',
      coreFunction: 'Delivers male genetic material (paternal haploid genome) to the ovum for fertilisation.',
      adaptations: [
        {
          feature: 'Acrosome Cap',
          benefit: 'Contains hydrolytic proteases to chemically digest the jelly coat (zona pellucida) of the female ovum.'
        },
        {
          feature: 'Mitochondrial Spiral Midpiece',
          benefit: 'Tightly packed with spiral mitochondria synthesizing continuous ATP to power flagellar beating.'
        },
        {
          feature: 'Streamlined Flagellum (Tail)',
          benefit: 'Axoneme microtubule core whips rhythmically to propel the sperm forward against viscous female reproductive fluids.'
        }
      ]
    },
    {
      id: 'roothair',
      name: 'Root Hair Cell',
      scientificName: 'Piliferous Cell',
      organism: 'Plant Root Epidermis',
      themeColor: 'border-amber-500 text-amber-500 bg-amber-500/10',
      badgeColor: 'bg-amber-500 text-white',
      coreFunction: 'Absorbs water via osmosis and dissolved mineral ions via active transport from soil solution.',
      adaptations: [
        {
          feature: 'Elongated Hair Protrusion',
          benefit: 'Greatly magnifies surface area in direct contact with soil water film for rapid osmotic uptake.'
        },
        {
          feature: 'Large Central Vacuole with Concentrated Sap',
          benefit: 'Maintains high osmotic solute concentration, keeping cell water potential lower than soil water to pull water in.'
        },
        {
          feature: 'No Chloroplasts & Thin Wall',
          benefit: 'Located underground where light is absent (no wasted chlorophyll energy); thin wall minimizes diffusion resistance.'
        }
      ]
    },
    {
      id: 'palisade',
      name: 'Palisade Mesophyll Cell',
      scientificName: 'Chlorenchyma Cell',
      organism: 'Plant Leaf (Upper Layer)',
      themeColor: 'border-emerald-500 text-emerald-500 bg-emerald-500/10',
      badgeColor: 'bg-emerald-500 text-white',
      coreFunction: 'Primary site of photosynthesis, capturing maximum solar photon energy to synthesize glucose.',
      adaptations: [
        {
          feature: 'Columnar Packed Arrangement',
          benefit: 'Oriented end-on at right angles to upper leaf surface, ensuring light penetrates deep into the mesophyll.'
        },
        {
          feature: 'High Chloroplast Density',
          benefit: 'Contains up to 100 chloroplasts per cell which circulate along outer cell walls via cyclosis to catch light.'
        },
        {
          feature: 'Large Vacuole & Transparent Wall',
          benefit: 'Vacuole pushes chloroplasts outward against the cell membrane, reducing light scattering and diffusion paths.'
        }
      ]
    }
  ];

  const currentCell = specializedCells.find((c) => c.id === selectedCellId) || specializedCells[0];

  const handleSelectCell = (id) => {
    setSelectedCellId(id);
    setActivePin(null);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'specialized_cells_adaptations',
      cellSelected: id
    });
  };

  const handleReset = () => {
    setSelectedCellId('rbc');
    setActivePin(null);
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Specialized Cells & Structural Adaptations
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Structure Fits Function
            </p>
          </div>
        </div>

        {/* Quick Reset */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset View
        </button>
      </div>

      {/* Cell Selector Chips (1 Primary Interaction) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {specializedCells.map((cell) => {
          const isSelected = cell.id === selectedCellId;
          return (
            <button
              key={cell.id}
              onClick={() => handleSelectCell(cell.id)}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                isSelected
                  ? `${cell.themeColor} border-current shadow-lg shadow-black/40 scale-102`
                  : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className="text-xs font-extrabold">{cell.name}</span>
              <span className="text-[10px] font-mono opacity-70 italic">{cell.scientificName}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: Interactive Biological Vector Illustration (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950/70 rounded-3xl p-6 border border-slate-800 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
          {/* Organism & Role Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${currentCell.badgeColor}`}>
              {currentCell.name}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {currentCell.organism}
            </span>
          </div>

          {/* SVG Diagram Rendering based on selected cell */}
          <div className="w-full max-w-sm h-auto flex items-center justify-center py-6">
            {selectedCellId === 'rbc' && (
              /* Red Blood Cell 3D Biconcave Render */
              <svg viewBox="0 0 300 200" className="w-full h-auto">
                <defs>
                  <radialGradient id="rbcShade" cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#F87171" />
                    <stop offset="60%" stopColor="#DC2626" />
                    <stop offset="100%" stopColor="#7F1D1D" />
                  </radialGradient>
                  <radialGradient id="rbcDip" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#7F1D1D" stopOpacity="0.8" />
                    <stop offset="80%" stopColor="#DC2626" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Outer Biconcave Perimeter */}
                <ellipse cx="150" cy="100" rx="110" ry="70" fill="url(#rbcShade)" stroke="#991B1B" strokeWidth="3" />
                {/* Central Biconcave Depression */}
                <ellipse cx="150" cy="100" rx="55" ry="32" fill="url(#rbcDip)" />
                {/* Oxygen Diffusion Particles Streaming In */}
                <g className="animate-pulse">
                  {[40, 80, 150, 220, 260].map((cx, i) => (
                    <circle key={i} cx={cx} cy={30 + (i % 2) * 15} r="4" fill="#38BDF8" opacity="0.85" />
                  ))}
                </g>
                <text x="150" y="25" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  O₂ molecules diffusing inward (High SA:V)
                </text>
                {/* Annotation Pin: Biconcave Depression */}
                <g className="cursor-pointer" onClick={() => setActivePin(0)}>
                  <line x1="150" y1="100" x2="150" y2="155" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3,2" />
                  <circle cx="150" cy="100" r="4" fill="#FBBF24" />
                  <rect x="90" y="155" width="120" height="22" rx="6" fill="#1E293B" stroke="#FBBF24" strokeWidth="1" />
                  <text x="150" y="170" textAnchor="middle" fill="#FDE047" fontSize="10" fontWeight="bold">
                    Biconcave Center
                  </text>
                </g>
              </svg>
            )}

            {selectedCellId === 'sperm' && (
              /* Sperm Cell Render */
              <svg viewBox="0 0 340 180" className="w-full h-auto">
                <defs>
                  <linearGradient id="flagellumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                {/* Beating Flagellum (Wave Path) */}
                <path
                  d="M 140 90 Q 180 50, 220 90 T 300 90 T 340 70"
                  fill="none"
                  stroke="url(#flagellumGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                {/* Midpiece packed with spiral mitochondria */}
                <rect x="100" y="80" width="40" height="20" rx="5" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
                {/* Mitochondria spiral coils */}
                <path d="M 105 84 Q 110 96, 115 84 Q 120 96, 125 84 Q 130 96, 135 84" fill="none" stroke="#FDE047" strokeWidth="2.5" />
                {/* Head Body (Haploid Nucleus) */}
                <ellipse cx="65" cy="90" rx="35" ry="24" fill="#0369A1" stroke="#38BDF8" strokeWidth="2" />
                {/* Haploid Nucleus inside */}
                <ellipse cx="68" cy="90" rx="20" ry="15" fill="#0C4A6E" />
                <text x="68" y="94" textAnchor="middle" fill="#BAE6FD" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  n = 23
                </text>
                {/* Acrosome Cap at tip */}
                <path d="M 30 90 Q 30 70, 50 68 Q 45 90, 50 112 Q 30 110, 30 90 Z" fill="#F59E0B" stroke="#FBBF24" strokeWidth="1.5" />
                {/* Pin: Acrosome */}
                <g className="cursor-pointer" onClick={() => setActivePin(0)}>
                  <line x1="38" y1="75" x2="38" y2="35" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3,2" />
                  <circle cx="38" cy="75" r="3.5" fill="#FBBF24" />
                  <rect x="5" y="15" width="85" height="20" rx="5" fill="#1E293B" stroke="#FBBF24" strokeWidth="1" />
                  <text x="47" y="29" textAnchor="middle" fill="#FDE047" fontSize="9" fontWeight="bold">
                    Acrosome Cap
                  </text>
                </g>
                {/* Pin: Mitochondria */}
                <g className="cursor-pointer" onClick={() => setActivePin(1)}>
                  <line x1="120" y1="100" x2="120" y2="145" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3,2" />
                  <circle cx="120" cy="100" r="3.5" fill="#FBBF24" />
                  <rect x="65" y="145" width="115" height="20" rx="5" fill="#1E293B" stroke="#FBBF24" strokeWidth="1" />
                  <text x="122" y="159" textAnchor="middle" fill="#FDE047" fontSize="9" fontWeight="bold">
                    Mitochondria Midpiece
                  </text>
                </g>
              </svg>
            )}

            {selectedCellId === 'roothair' && (
              /* Root Hair Cell Render */
              <svg viewBox="0 0 320 200" className="w-full h-auto">
                {/* Main Epidermal Cell Box */}
                <rect x="30" y="40" width="80" height="120" rx="4" fill="#D97706" fillOpacity="0.2" stroke="#B45309" strokeWidth="2" />
                {/* Finger-like Cytoplasmic Extension (Root Hair) */}
                <path
                  d="M 110 70 C 180 70, 240 75, 290 85 C 305 90, 305 110, 290 115 C 240 125, 180 130, 110 130 Z"
                  fill="#F59E0B"
                  fillOpacity="0.25"
                  stroke="#D97706"
                  strokeWidth="2"
                />
                {/* Continuous Extended Vacuole */}
                <path
                  d="M 50 60 L 95 60 C 170 78, 230 82, 275 92 C 285 96, 285 104, 275 108 C 230 118, 170 122, 95 140 L 50 140 Z"
                  fill="#0284C7"
                  fillOpacity="0.3"
                  stroke="#38BDF8"
                  strokeWidth="1.2"
                />
                {/* Nucleus in main body */}
                <circle cx="70" cy="100" r="14" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
                {/* Water Particles Influx via Osmosis */}
                <g className="animate-pulse">
                  {[260, 280, 300].map((x, i) => (
                    <circle key={i} cx={x} cy={60 + i * 40} r="3.5" fill="#38BDF8" />
                  ))}
                </g>
                <text x="290" y="45" textAnchor="end" fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  H₂O Osmosis Influx
                </text>
                {/* Pin: Hair Extension */}
                <g className="cursor-pointer" onClick={() => setActivePin(0)}>
                  <line x1="220" y1="100" x2="220" y2="155" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3,2" />
                  <circle cx="220" cy="100" r="4" fill="#FBBF24" />
                  <rect x="155" y="155" width="130" height="22" rx="6" fill="#1E293B" stroke="#FBBF24" strokeWidth="1" />
                  <text x="220" y="170" textAnchor="middle" fill="#FDE047" fontSize="10" fontWeight="bold">
                    High SA Extension
                  </text>
                </g>
              </svg>
            )}

            {selectedCellId === 'palisade' && (
              /* Palisade Mesophyll Cell Render */
              <svg viewBox="0 0 240 240" className="w-full h-auto">
                {/* Columnar Cell Wall */}
                <rect x="60" y="20" width="120" height="200" rx="8" fill="#065F46" fillOpacity="0.2" stroke="#059669" strokeWidth="3" />
                {/* Plasma membrane inner */}
                <rect x="65" y="25" width="110" height="190" rx="6" fill="none" stroke="#34D399" strokeWidth="1" strokeDasharray="4,2" />
                {/* Large Central Vacuole */}
                <rect x="85" y="45" width="70" height="140" rx="12" fill="#6EE7B7" fillOpacity="0.15" stroke="#10B981" strokeWidth="1" />
                {/* Peripheral Chloroplasts with Stacks */}
                {[
                  { x: 72, y: 35 }, { x: 105, y: 32 }, { x: 140, y: 35 }, { x: 168, y: 38 },
                  { x: 72, y: 75 }, { x: 168, y: 75 },
                  { x: 72, y: 115 }, { x: 168, y: 115 },
                  { x: 72, y: 155 }, { x: 168, y: 155 },
                  { x: 80, y: 195 }, { x: 120, y: 198 }, { x: 160, y: 195 }
                ].map((pos, idx) => (
                  <g key={idx} transform={`translate(${pos.x}, ${pos.y})`}>
                    <ellipse cx="0" cy="0" rx="8" ry="6" fill="#15803D" stroke="#22C55E" strokeWidth="1" />
                    <line x1="-5" y1="0" x2="5" y2="0" stroke="#86EFAC" strokeWidth="1.5" />
                  </g>
                ))}
                {/* Nucleus at base */}
                <circle cx="120" cy="165" r="14" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />
                {/* Sunlight Photons */}
                <path d="M 120 0 L 120 20" stroke="#FDE047" strokeWidth="3" strokeDasharray="3,2" />
                <text x="120" y="12" textAnchor="middle" fill="#FDE047" fontSize="10" fontWeight="bold">
                  ☀️ Sunlight
                </text>
                {/* Pin: Dense Chloroplasts */}
                <g className="cursor-pointer" onClick={() => setActivePin(1)}>
                  <line x1="72" y1="75" x2="20" y2="75" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3,2" />
                  <circle cx="72" cy="75" r="3.5" fill="#FBBF24" />
                  <rect x="0" y="65" width="45" height="20" rx="5" fill="#1E293B" stroke="#FBBF24" strokeWidth="1" />
                  <text x="22" y="79" textAnchor="middle" fill="#FDE047" fontSize="8" fontWeight="bold">
                    Chloroplast
                  </text>
                </g>
              </svg>
            )}
          </div>
        </div>

        {/* Right: Structural Adaptations Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Primary Physiological Role */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Primary Biological Function
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed">
              {currentCell.coreFunction}
            </p>
          </div>

          {/* Key Structural Adaptations (Why structure fits function) */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Specialized Adaptations
            </span>
            <div className="space-y-2">
              {currentCell.adaptations.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePin(idx)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    activePin === idx
                      ? 'bg-amber-500/10 border-amber-500/50 text-white'
                      : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-300 mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.feature}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal pl-5">
                    {item.benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
