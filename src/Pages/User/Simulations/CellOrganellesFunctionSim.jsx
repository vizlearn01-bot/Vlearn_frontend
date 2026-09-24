import React, { useState } from 'react';
import { Target, RotateCcw, Sparkles, CheckCircle2, Zap, Sun, Shield, Layers } from 'lucide-react';

export default function CellOrganellesFunctionSim({ config = {}, onTelemetry }) {
  // Primary Variable: Selected Organelle
  const [selectedOrganelleId, setSelectedOrganelleId] = useState('nucleus');
  const [animatedPulse, setAnimatedPulse] = useState(true);

  const organelles = [
    {
      id: 'nucleus',
      name: 'Nucleus',
      icon: Shield,
      tag: 'Information Center',
      tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      functionShort: 'Houses genomic DNA and controls all cellular metabolic activities and division.',
      detailedMechanism: 'Enclosed by a double nuclear envelope perforated by nuclear pores. Contains chromosomes (DNA wrapped around histone proteins) and a dense nucleolus where ribosomal RNA (rRNA) is transcribed.',
      markerColor: '#A855F7',
      cx: 150,
      cy: 130,
      rx: 40,
      ry: 36
    },
    {
      id: 'mitochondrion',
      name: 'Mitochondrion',
      icon: Zap,
      tag: 'Powerhouse (ATP)',
      tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      functionShort: 'Site of aerobic cellular respiration, synthesizing adenosine triphosphate (ATP) energy.',
      detailedMechanism: 'Possesses a smooth outer membrane and an intensely folded inner membrane forming cristae. Cristae drastically multiply the surface area for ATP synthase and electron transport chain complexes.',
      markerColor: '#F59E0B',
      cx: 80,
      cy: 90,
      rx: 22,
      ry: 14
    },
    {
      id: 'chloroplast',
      name: 'Chloroplast',
      icon: Sun,
      tag: 'Photosynthesis Engine',
      tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      functionShort: 'Absorbs sunlight photons to convert CO₂ and water into chemical energy (glucose).',
      detailedMechanism: 'Double-membraned organelle containing fluid stroma and membrane sacks (thylakoids) stacked into grana. Thylakoid membranes contain green chlorophyll pigments that drive light reactions.',
      markerColor: '#10B981',
      cx: 220,
      cy: 85,
      rx: 25,
      ry: 16
    },
    {
      id: 'ribosome',
      name: 'Ribosomes',
      icon: Sparkles,
      tag: 'Protein Factories',
      tagColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      functionShort: 'Synthesizes polypeptide protein chains by translating messenger RNA (mRNA) codons.',
      detailedMechanism: 'Non-membrane-bound complexes composed of ribosomal RNA and proteins. Found floating freely in cytoplasm (producing intracellular proteins) or studded onto the Rough Endoplasmic Reticulum (secretion proteins).',
      markerColor: '#38BDF8',
      cx: 195,
      cy: 175,
      rx: 16,
      ry: 16
    },
    {
      id: 'vacuole',
      name: 'Central Vacuole',
      icon: Layers,
      tag: 'Turgor & Storage',
      tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      functionShort: 'Stores cell sap (water, salts, sugars) and exerts outward hydrostatic turgor pressure.',
      detailedMechanism: 'Bounded by a selectively permeable tonoplast membrane. In plant cells, hydrostatic turgor pressure against the cellulose cell wall keeps the plant stem erect and supports soft tissues.',
      markerColor: '#06B6D4',
      cx: 90,
      cy: 170,
      rx: 34,
      ry: 26
    },
    {
      id: 'membrane',
      name: 'Cell Membrane',
      icon: Shield,
      tag: 'Selective Gatekeeper',
      tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      functionShort: 'Selectively permeable barrier that controls the entry and exit of molecules.',
      detailedMechanism: 'Composed of a phospholipid bilayer with embedded transport proteins, receptor glycoproteins, and cholesterol (fluid mosaic model). Maintains stable cellular homeostasis.',
      markerColor: '#F43F5E',
      cx: 150,
      cy: 130,
      rx: 135,
      ry: 95
    }
  ];

  const currentOrg = organelles.find((o) => o.id === selectedOrganelleId) || organelles[0];

  const handleSelectOrganelle = (id) => {
    setSelectedOrganelleId(id);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'cell_organelles_function',
      organelle: id
    });
  };

  const handleReset = () => {
    setSelectedOrganelleId('nucleus');
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Cell Organelles & Cellular Physiology
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Form Follows Function Inside Living Cells
            </p>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Selection
        </button>
      </div>

      {/* Organelle Selection Chips */}
      <div className="flex flex-wrap gap-2">
        {organelles.map((org) => {
          const isSelected = org.id === selectedOrganelleId;
          const IconComponent = org.icon;
          return (
            <button
              key={org.id}
              onClick={() => handleSelectOrganelle(org.id)}
              className={`px-3 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 border-white text-white shadow-lg shadow-black/40 scale-102'
                  : 'bg-slate-800/40 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" style={{ color: org.markerColor }} />
              <span>{org.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: 3D Living Educational Cell Diagram (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950/70 rounded-3xl p-6 border border-slate-800 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
          <svg viewBox="0 0 300 260" className="w-full max-w-md h-auto">
            {/* Cytoplasm Matrix */}
            <ellipse
              cx="150"
              cy="130"
              rx="135"
              ry="95"
              fill="#1E293B"
              stroke={selectedOrganelleId === 'membrane' ? '#F43F5E' : '#334155'}
              strokeWidth={selectedOrganelleId === 'membrane' ? '4' : '2'}
              className="transition-all duration-300"
            />

            {/* Central Vacuole */}
            <g
              className="cursor-pointer transition-all duration-300"
              onClick={() => handleSelectOrganelle('vacuole')}
            >
              <ellipse
                cx="90"
                cy="170"
                rx="34"
                ry="26"
                fill="#06B6D4"
                fillOpacity={selectedOrganelleId === 'vacuole' ? '0.5' : '0.2'}
                stroke="#06B6D4"
                strokeWidth={selectedOrganelleId === 'vacuole' ? '3' : '1.5'}
              />
              <text x="90" y="174" textAnchor="middle" fill="#A5F3FC" fontSize="9" fontWeight="bold">
                Vacuole
              </text>
            </g>

            {/* Chloroplast */}
            <g
              className="cursor-pointer transition-all duration-300"
              onClick={() => handleSelectOrganelle('chloroplast')}
            >
              <ellipse
                cx="220"
                cy="85"
                rx="26"
                ry="18"
                fill="#10B981"
                fillOpacity={selectedOrganelleId === 'chloroplast' ? '0.55' : '0.25'}
                stroke="#10B981"
                strokeWidth={selectedOrganelleId === 'chloroplast' ? '3' : '1.5'}
              />
              {/* Thylakoid Stacks */}
              <line x1="208" y1="82" x2="232" y2="82" stroke="#6EE7B7" strokeWidth="2" />
              <line x1="210" y1="88" x2="230" y2="88" stroke="#6EE7B7" strokeWidth="2" />
              <text x="220" y="112" textAnchor="middle" fill="#6EE7B7" fontSize="8" fontWeight="bold">
                Chloroplast
              </text>
            </g>

            {/* Mitochondria */}
            <g
              className="cursor-pointer transition-all duration-300"
              onClick={() => handleSelectOrganelle('mitochondrion')}
            >
              <ellipse
                cx="80"
                cy="90"
                rx="24"
                ry="16"
                fill="#F59E0B"
                fillOpacity={selectedOrganelleId === 'mitochondrion' ? '0.55' : '0.25'}
                stroke="#F59E0B"
                strokeWidth={selectedOrganelleId === 'mitochondrion' ? '3' : '1.5'}
              />
              {/* Folded Cristae */}
              <path d="M 66 90 Q 73 83, 80 90 T 94 90" fill="none" stroke="#FDE047" strokeWidth="2" />
              <text x="80" y="116" textAnchor="middle" fill="#FDE047" fontSize="8" fontWeight="bold">
                Mitochondrion
              </text>
            </g>

            {/* Nucleus */}
            <g
              className="cursor-pointer transition-all duration-300"
              onClick={() => handleSelectOrganelle('nucleus')}
            >
              <ellipse
                cx="150"
                cy="130"
                rx="42"
                ry="38"
                fill="#A855F7"
                fillOpacity={selectedOrganelleId === 'nucleus' ? '0.45' : '0.2'}
                stroke="#A855F7"
                strokeWidth={selectedOrganelleId === 'nucleus' ? '3.5' : '1.8'}
              />
              {/* Nucleolus */}
              <circle cx="150" cy="128" r="12" fill="#7E22CE" stroke="#C084FC" strokeWidth="1.5" />
              <text x="150" y="132" textAnchor="middle" fill="#F3E8FF" fontSize="7" fontWeight="bold">
                Nucleolus
              </text>
              <text x="150" y="156" textAnchor="middle" fill="#E9D5FF" fontSize="9" fontWeight="extrabold">
                Nucleus (DNA)
              </text>
            </g>

            {/* Ribosomes (cluster) */}
            <g
              className="cursor-pointer transition-all duration-300"
              onClick={() => handleSelectOrganelle('ribosome')}
            >
              {[
                { x: 195, y: 175 }, { x: 205, y: 170 }, { x: 215, y: 180 }, { x: 200, y: 185 }
              ].map((dot, i) => (
                <circle
                  key={i}
                  cx={dot.x}
                  cy={dot.y}
                  r="3.5"
                  fill="#38BDF8"
                  stroke="#0284C7"
                  strokeWidth="1"
                  className={selectedOrganelleId === 'ribosome' ? 'animate-ping' : ''}
                />
              ))}
              <text x="210" y="200" textAnchor="middle" fill="#7DD3FC" fontSize="8" fontWeight="bold">
                Ribosomes
              </text>
            </g>
          </svg>
        </div>

        {/* Right: Physiological Mechanism Inspector (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Organelle Title & Tag */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentOrg.markerColor }} />
                {currentOrg.name}
              </h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${currentOrg.tagColor}`}>
                {currentOrg.tag}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-relaxed">
              {currentOrg.functionShort}
            </p>
          </div>

          {/* Biological Mechanism Card */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Structural & Physiological Detail
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentOrg.detailedMechanism}
            </p>
          </div>

          {/* Quick Learning Tip */}
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-[11px] text-slate-400 leading-normal">
            💡 <span className="font-semibold text-slate-200">Exam Note:</span> Plant and animal cells share nuclei, mitochondria, ribosomes, and cell membranes. Chloroplasts and large permanent vacuoles are unique to plant cells!
          </div>
        </div>
      </div>
    </div>
  );
}
