import React, { useState } from 'react';
import { Bug, RotateCcw, Sparkles, CheckCircle2, Info, ArrowRight } from 'lucide-react';

export default function InsectMouthpartsAdaptationsSim({ config = {}, onTelemetry }) {
  // Primary Variable: Selected Insect Mouthpart Type
  const [selectedInsectId, setSelectedInsectId] = useState('grasshopper');

  const insects = [
    {
      id: 'grasshopper',
      name: 'Grasshopper / Locust',
      type: 'Biting and Chewing',
      diet: 'Tough vegetative foliage & crop leaves',
      primaryOrgan: 'Heavily toothed sclerotized Mandibles',
      mechanism: 'Lateral cutting and grinding of plant tissues by serrated mandibles supported by maxillae and labrum/labium.',
      adaptations: [
        'Hard, heavily chitinized mandibles with sharp cutting edges and ridged grinding molar surfaces.',
        'Mandibles operate sideways in a horizontal transverse plane, exerting high shearing pressure.',
        'Sensory labial and maxillary palps test food texture and chemical palatability before ingestion.'
      ],
      color: '#10B981'
    },
    {
      id: 'mosquito',
      name: 'Female Mosquito',
      type: 'Piercing and Sucking',
      diet: 'Vertebrate blood (essential for egg development)',
      primaryOrgan: '6 Needle-like Stylets enclosed in Labium',
      mechanism: 'Sharp stylets pierce epidermis and capillary walls; saliva containing anti-coagulant is injected, and blood is drawn up the food canal.',
      adaptations: [
        'Mandibles and maxillae are modified into needle-like, serrated stylets that easily pierce vertebrate skin.',
        'Labrum forms the hollow food canal for sucking blood by muscular pharyngeal pumping.',
        'Hypopharynx carries the salivary duct injecting anti-coagulant saliva to prevent blood clotting during feeding.'
      ],
      color: '#EF4444'
    },
    {
      id: 'butterfly',
      name: 'Butterfly / Moth',
      type: 'Siphoning',
      diet: 'Liquid floral nectar deep within corolla tubes',
      primaryOrgan: 'Long, Coiled Tubular Proboscis',
      mechanism: 'Uncoils by hemolymph hydrostatic pressure to reach nectar reservoirs, sucking nectar via capillary action and pharyngeal suction.',
      adaptations: [
        'Formed exclusively from the greatly elongated, interlocking galeae of the maxillae.',
        'Coils up neatly under the head like a clock spring when not in use to avoid flight hindrance.',
        'Mandibles and labium are completely reduced/vestigial since no mechanical mastication is required.'
      ],
      color: '#8B5CF6'
    },
    {
      id: 'housefly',
      name: 'Housefly (Musca domestica)',
      type: 'Sponging and Lapping',
      diet: 'Exposed liquid or liquefiable organic matter',
      primaryOrgan: 'Fleshy Labellum with Pseudotracheae',
      mechanism: 'Regurgitates saliva and crop contents to enzymatically digest food externally, then sponges up dissolved liquid via capillary grooves.',
      adaptations: [
        'Proboscis terminates in two expanded fleshy lobes (labella) grooved with microscopic pseudotracheae tubes.',
        'Capillary action draws fluid into pseudotracheae, funneling liquid directly to the mouth opening.',
        'Capable of external digestion: regurgitates enzymes to liquefy solid sugar crystals before suction.'
      ],
      color: '#F59E0B'
    }
  ];

  const currentInsect = insects.find((i) => i.id === selectedInsectId) || insects[0];

  const handleSelectInsect = (id) => {
    setSelectedInsectId(id);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'insect_mouthparts_adaptations',
      insect: id
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Adaptive Radiation of Insect Mouthparts
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Animal Nutrition & Feeding Adaptations
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelectedInsectId('grasshopper')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Primary Variable Control: Insect Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {insects.map((ins) => {
          const isSelected = ins.id === selectedInsectId;
          return (
            <button
              key={ins.id}
              onClick={() => handleSelectInsect(ins.id)}
              className={`flex flex-col p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-800 border-amber-500 shadow-md ring-1 ring-amber-500 shadow-amber-950/40'
                  : 'bg-slate-800/40 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {ins.type}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white mt-0.5">
                {ins.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Simulation Viewport: Structural Morphology */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Status Header */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-amber-300">
              {currentInsect.type} • {currentInsect.primaryOrgan}
            </span>
          </div>

          {/* Dynamic SVG Graphics for Each Mouthpart */}
          <svg viewBox="0 0 460 300" className="w-full max-w-[420px] h-auto select-none my-auto">
            {/* 1. GRASSHOPPER: BITING & CHEWING */}
            {selectedInsectId === 'grasshopper' && (
              <g transform="translate(110, 30)">
                {/* Insect Head Capsule */}
                <ellipse cx="120" cy="70" rx="90" ry="60" fill="#15803D" stroke="#4ADE80" strokeWidth="2.5" />
                <circle cx="65" cy="55" r="14" fill="#1E293B" stroke="#FDE047" strokeWidth="1.5" />
                <circle cx="175" cy="55" r="14" fill="#1E293B" stroke="#FDE047" strokeWidth="1.5" />
                <text x="120" y="45" fill="#BBF7D0" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Grasshopper Head
                </text>

                {/* Labrum (Upper Lip) */}
                <rect x="90" y="95" width="60" height="25" rx="5" fill="#166534" stroke="#86EFAC" strokeWidth="1.5" />
                <text x="120" y="112" fill="#FFFFFF" fontSize="8.5" textAnchor="middle">Labrum</text>

                {/* Left Mandible (heavily serrated tooth jaw) */}
                <path
                  d="M 60 120 C 60 180, 100 190, 115 170 C 110 150, 95 130, 90 120 Z"
                  fill="#78350F"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                />
                {/* Teeth on left mandible */}
                <polygon points="105,150 115,145 105,140" fill="#FEF3C7" />
                <polygon points="110,165 118,160 110,155" fill="#FEF3C7" />

                {/* Right Mandible */}
                <path
                  d="M 180 120 C 180 180, 140 190, 125 170 C 130 150, 145 130, 150 120 Z"
                  fill="#78350F"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                />
                <polygon points="135,150 125,145 135,140" fill="#FEF3C7" />
                <polygon points="130,165 122,160 130,155" fill="#FEF3C7" />

                {/* Palps (Maxillary sensory appendages) */}
                <path d="M 50 140 Q 20 180 40 210" stroke="#F59E0B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 190 140 Q 220 180 200 210" stroke="#F59E0B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <text x="30" y="225" fill="#FDE68A" fontSize="8" textAnchor="middle">Palp</text>
                <text x="210" y="225" fill="#FDE68A" fontSize="8" textAnchor="middle">Palp</text>

                <text x="120" y="210" fill="#FDE68A" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Mandibles (Transverse Chewing)
                </text>
              </g>
            )}

            {/* 2. MOSQUITO: PIERCING & SUCKING */}
            {selectedInsectId === 'mosquito' && (
              <g transform="translate(130, 30)">
                {/* Head & Huge Compound Eyes */}
                <circle cx="100" cy="50" r="35" fill="#334155" stroke="#64748B" strokeWidth="2" />
                <circle cx="85" cy="45" r="16" fill="#1E1B4B" stroke="#38BDF8" strokeWidth="1.5" />
                <circle cx="115" cy="45" r="16" fill="#1E1B4B" stroke="#38BDF8" strokeWidth="1.5" />
                <text x="100" y="30" fill="#93C5FD" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Mosquito Head
                </text>

                {/* Extended Labium (protective sheath drawn back during bite) */}
                <path d="M 100 85 Q 140 150 115 210" stroke="#475569" strokeWidth="6" fill="none" strokeLinecap="round" />
                <text x="145" y="160" fill="#94A3B8" fontSize="8.5">Labium Sheath</text>

                {/* Fascicle: 6 Stylets (needle bundle penetrating skin) */}
                <g className="animate-pulse">
                  <line x1="98" y1="85" x2="98" y2="235" stroke="#EF4444" strokeWidth="2.5" />
                  <line x1="102" y1="85" x2="102" y2="235" stroke="#F87171" strokeWidth="2" />
                </g>

                {/* Skin & Capillary Layer at Bottom */}
                <rect x="0" y="235" width="200" height="25" rx="3" fill="#881337" opacity="0.8" />
                <text x="100" y="252" fill="#FECDD3" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Host Skin & Blood Capillary
                </text>

                {/* Blood sucked upward arrow */}
                <g transform="translate(65, 140)">
                  <path d="M 20 40 L 20 0" stroke="#F43F5E" strokeWidth="2.5" markerEnd="url(#arrow)" />
                  <text x="10" y="25" fill="#F43F5E" fontSize="8" fontWeight="bold">Blood ↑</text>
                </g>
              </g>
            )}

            {/* 3. BUTTERFLY: SIPHONING */}
            {selectedInsectId === 'butterfly' && (
              <g transform="translate(110, 40)">
                <circle cx="110" cy="50" r="38" fill="#4C1D95" stroke="#8B5CF6" strokeWidth="2" />
                <circle cx="95" cy="45" r="15" fill="#1E1B4B" stroke="#C4B5FD" strokeWidth="1.5" />
                <circle cx="125" cy="45" r="15" fill="#1E1B4B" stroke="#C4B5FD" strokeWidth="1.5" />

                {/* Antennae */}
                <path d="M 95 15 Q 70 -10 60 -15" stroke="#A78BFA" strokeWidth="2" fill="none" />
                <path d="M 125 15 Q 150 -10 160 -15" stroke="#A78BFA" strokeWidth="2" fill="none" />

                {/* Long Coiled Proboscis (interlocked galeae) */}
                <path
                  d="M 110 88 
                     C 110 130, 90 160, 110 190 
                     C 130 220, 170 200, 150 170 
                     C 135 150, 150 135, 160 145 
                     C 168 152, 165 160, 160 160"
                  stroke="#C084FC"
                  strokeWidth="4.5"
                  fill="none"
                  strokeLinecap="round"
                />

                <text x="110" y="240" fill="#E9D5FF" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  Coiled Tubular Proboscis
                </text>
                <text x="110" y="255" fill="#C4B5FD" fontSize="8.5" textAnchor="middle">
                  (Elongated Maxillary Galeae)
                </text>
              </g>
            )}

            {/* 4. HOUSEFLY: SPONGING */}
            {selectedInsectId === 'housefly' && (
              <g transform="translate(120, 30)">
                <ellipse cx="100" cy="50" rx="45" ry="32" fill="#1C1917" stroke="#78716C" strokeWidth="2" />
                <circle cx="80" cy="45" r="16" fill="#7F1D1D" stroke="#EF4444" strokeWidth="1.5" />
                <circle cx="120" cy="45" r="16" fill="#7F1D1D" stroke="#EF4444" strokeWidth="1.5" />

                {/* Rostrum & Haustellum (stalk of proboscis) */}
                <path d="M 100 80 L 100 150" stroke="#78716C" strokeWidth="16" strokeLinecap="round" />

                {/* Labellum: 2 expanded fleshy sponge pads with pseudotracheae */}
                <g transform="translate(45, 150)">
                  {/* Left sponge lobe */}
                  <ellipse cx="35" cy="35" rx="30" ry="20" fill="#B45309" stroke="#F59E0B" strokeWidth="2" />
                  {/* Right sponge lobe */}
                  <ellipse cx="75" cy="35" rx="30" ry="20" fill="#B45309" stroke="#F59E0B" strokeWidth="2" />

                  {/* Pseudotracheae capillary grooves */}
                  <line x1="20" y1="25" x2="50" y2="45" stroke="#FEF3C7" strokeWidth="1.5" />
                  <line x1="25" y1="20" x2="55" y2="40" stroke="#FEF3C7" strokeWidth="1.5" />
                  <line x1="60" y1="45" x2="90" y2="25" stroke="#FEF3C7" strokeWidth="1.5" />
                  <line x1="55" y1="40" x2="85" y2="20" stroke="#FEF3C7" strokeWidth="1.5" />

                  <text x="55" y="70" fill="#FDE68A" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    Fleshy Labellum Pad
                  </text>
                  <text x="55" y="84" fill="#FBBF24" fontSize="8" textAnchor="middle">
                    (Pseudotracheae Channels)
                  </text>
                </g>
              </g>
            )}
          </svg>

          {/* Functional Summary Strip */}
          <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              Feeding Ecology: <strong className="text-white">{currentInsect.diet}</strong>
            </span>
          </div>
        </div>

        {/* Morphological Adaptations & Rationale Card */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Specific Functional Adaptations
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {currentInsect.mechanism}
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              {currentInsect.adaptations.map((a, i) => (
                <div key={i} className="p-2 bg-slate-900/90 rounded-xl border border-slate-800 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-300 leading-snug">{a}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Evolutionary Insight:
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All insect mouthparts represent <em>homologous structures</em> derived from the same ancestral segments (labrum, mandibles, maxillae, labium) modified by divergent natural selection to exploit diverse food niches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
