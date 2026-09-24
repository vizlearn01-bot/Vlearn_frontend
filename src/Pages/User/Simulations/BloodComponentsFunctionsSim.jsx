import React, { useState } from 'react';
import { Droplet, RotateCcw, Sparkles, CheckCircle2, Info, Shield, Heart } from 'lucide-react';

export default function BloodComponentsFunctionsSim({ config = {}, onTelemetry }) {
  // Primary Variable: Selected Component to Inspect
  const [selectedCompId, setSelectedCompId] = useState('rbc');

  const components = [
    {
      id: 'rbc',
      name: 'Erythrocytes (Red Blood Cells)',
      fraction: '44% of Blood Volume',
      layer: 'Bottom Sediment (Dense Packed Cells)',
      primaryRole: 'Oxygen (O₂) & Carbon Dioxide Transport',
      adaptations: [
        'Biconcave Disc Shape: Increases surface area to volume ratio, accelerating oxygen diffusion in and out.',
        'Enucleated at Maturity: Lacks a nucleus, mitochondria, and ER to pack maximum haemoglobin molecules (~280 million molecules per cell).',
        'Flexible Membrane: Easily deforms and folds to squeeze through narrow capillaries with diameters smaller than the cell itself (7 µm).'
      ],
      color: '#EF4444',
      bg: 'bg-rose-500/20',
      border: 'border-rose-500/40'
    },
    {
      id: 'plasma',
      name: 'Blood Plasma (Fluid Matrix)',
      fraction: '55% of Blood Volume',
      layer: 'Top Transparent Straw-Coloured Supernatant',
      primaryRole: 'Medium for Transport of Nutrients, Wastes & Hormones',
      adaptations: [
        '90% Water Content: Acts as a universal solvent with high specific heat capacity to distribute body heat evenly.',
        'Transport of Solutes: Dissolves glucose, amino acids, vitamins, mineral ions, and hormones from endocrine glands.',
        'Plasma Proteins: Contains Albumin (maintains blood osmotic pressure) and Fibrinogen (essential for blood clotting).'
      ],
      color: '#F59E0B',
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/40'
    },
    {
      id: 'wbc',
      name: 'Leucocytes (White Blood Cells)',
      fraction: '< 1% of Blood Volume (Buffy Coat)',
      layer: 'Thin White Interfacial Buffy Coat',
      primaryRole: 'Immune Defence & Pathogen Destruction',
      adaptations: [
        'Phagocytes (Neutrophils & Monocytes): Lobed nucleus and flexible pseudopodia to engulf and enzymatically digest bacteria by phagocytosis.',
        'Lymphocytes: Large rounded nucleus; synthesize and secrete specific antibodies that neutralize viral antigens and bacterial toxins.',
        'Amoeboid Movement (Diapedesis): Capable of squeezing between endothelial cells of capillary walls into infected tissues.'
      ],
      color: '#3B82F6',
      bg: 'bg-sky-500/20',
      border: 'border-sky-500/40'
    },
    {
      id: 'platelets',
      name: 'Platelets (Thrombocytes)',
      fraction: '< 1% of Blood Volume (Buffy Coat)',
      layer: 'Thin White Interfacial Buffy Coat',
      primaryRole: 'Hemostasis (Blood Clotting & Vessel Repair)',
      adaptations: [
        'Cellular Fragments: Tiny, anucleated cytoplasmic discs pinched off from giant bone marrow megakaryocytes.',
        'Thrombokinase Release: Contact with damaged collagen triggers release of thromboplastin, initiating conversion of prothrombin to thrombin.',
        'Fibrin Meshwork: Thrombin converts soluble fibrinogen into an insoluble network of fibrin threads, trapping RBCs to form a clot.'
      ],
      color: '#A855F7',
      bg: 'bg-purple-500/20',
      border: 'border-purple-500/40'
    }
  ];

  const current = components.find((c) => c.id === selectedCompId) || components[0];

  const handleSelectComponent = (id) => {
    setSelectedCompId(id);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'blood_components_functions',
      component: id
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
            <Droplet className="w-6 h-6 fill-rose-500/40 text-rose-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Blood Composition & Cellular Specialization
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Animal Transport (Centrifugation Separation & Cellular Adaptations)
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelectedCompId('rbc')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Primary Variable Control: Component Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {components.map((c) => {
          const isSelected = c.id === selectedCompId;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectComponent(c.id)}
              className={`flex flex-col p-3 rounded-2xl border text-left transition ${
                isSelected
                  ? 'bg-slate-800 border-rose-500 shadow-md ring-1 ring-rose-500 shadow-rose-950/40'
                  : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {c.fraction}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white mt-0.5 line-clamp-1">
                {c.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Simulation Viewport: Centrifuge Tube & High-Power Cellular Morphology */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${current.bg} ${current.border} text-white`}>
              {current.name} • {current.fraction}
            </span>
          </div>

          {/* SVG Graphic: Centrifuged Tube (Left) + Zoomed Microscopic Cellular View (Right) */}
          <svg viewBox="0 0 480 300" className="w-full max-w-[450px] h-auto select-none my-auto">
            {/* 1. CENTRIFUGED TEST TUBE (Left: x = 40 to 110) */}
            <g transform="translate(50, 30)">
              {/* Glass Test Tube Contour */}
              <rect x="0" y="0" width="60" height="200" rx="30" fill="none" stroke="#CBD5E1" strokeWidth="2.5" />

              {/* LAYER 1: PLASMA (Top 55%: y = 10 to 110) */}
              <rect
                x="2"
                y="10"
                width="56"
                height="100"
                fill="#FEF08A"
                fillOpacity={selectedCompId === 'plasma' ? 0.9 : 0.4}
                className="cursor-pointer"
                onClick={() => setSelectedCompId('plasma')}
              />
              <text x="30" y="65" fill="#854D0E" fontSize="9" fontWeight="bold" textAnchor="middle">
                Plasma (55%)
              </text>

              {/* LAYER 2: BUFFY COAT (WBCs & Platelets <1%: y = 110 to 118) */}
              <rect
                x="2"
                y="110"
                width="56"
                height="10"
                fill="#FFFFFF"
                fillOpacity={selectedCompId === 'wbc' || selectedCompId === 'platelets' ? 1.0 : 0.6}
                stroke="#94A3B8"
                strokeWidth="1"
              />
              <text x="75" y="118" fill="#FFFFFF" fontSize="8" fontWeight="bold">
                ← Buffy Coat (&lt;1%)
              </text>

              {/* LAYER 3: RED BLOOD CELLS (Bottom 44%: y = 120 to 198) */}
              <path
                d="M 2 120 L 58 120 L 58 170 C 58 190, 2 190, 2 170 Z"
                fill="#DC2626"
                fillOpacity={selectedCompId === 'rbc' ? 0.95 : 0.5}
                className="cursor-pointer"
                onClick={() => setSelectedCompId('rbc')}
              />
              <text x="30" y="155" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                RBCs (44%)
              </text>
            </g>

            {/* 2. HIGH MAGNIFICATION MICROSCOPIC CELLULAR ZOOM (Right: x = 160 to 440) */}
            <g transform="translate(180, 25)">
              {/* Microscope Circular Field of View */}
              <circle cx="130" cy="125" r="115" fill="#022C22" stroke="#10B981" strokeWidth="2.5" />

              {/* ERYTHROCYTE VIEW */}
              {selectedCompId === 'rbc' && (
                <g transform="translate(130, 125)">
                  {/* Biconcave Disc (Face-on view) */}
                  <circle cx="-35" cy="-25" r="45" fill="#EF4444" stroke="#B91C1C" strokeWidth="3" />
                  <circle cx="-35" cy="-25" r="24" fill="#B91C1C" fillOpacity="0.4" />

                  {/* Biconcave Side Profile View (dumbbell shape) */}
                  <g transform="translate(30, 20)">
                    <path
                      d="M -30 -10 C -20 -15, 20 -15, 30 -10 C 35 -5, 35 5, 30 10 C 20 15, -20 15, -30 10 C -35 5, -35 -5, -30 -10 Z"
                      fill="#EF4444"
                      stroke="#B91C1C"
                      strokeWidth="2.5"
                    />
                    <text x="0" y="30" fill="#FCA5A5" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                      Biconcave Cross-Section
                    </text>
                  </g>

                  <text x="-35" y="-22" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    No Nucleus
                  </text>
                  <text x="-35" y="-10" fill="#FEE2E2" fontSize="7.5" textAnchor="middle">
                    (Packed with Hb)
                  </text>
                </g>
              )}

              {/* PLASMA VIEW */}
              {selectedCompId === 'plasma' && (
                <g transform="translate(130, 125)">
                  {/* Liquid matrix molecules */}
                  <rect x="-90" y="-80" width="180" height="160" rx="10" fill="#FEF08A" fillOpacity="0.2" />
                  {/* Solute particles floating */}
                  <circle cx="-40" cy="-30" r="8" fill="#38BDF8" />
                  <text x="-40" y="-18" fill="#38BDF8" fontSize="7" textAnchor="middle">Glucose</text>

                  <circle cx="40" cy="-20" r="10" fill="#F59E0B" />
                  <text x="40" y="-7" fill="#F59E0B" fontSize="7" textAnchor="middle">Albumin</text>

                  <circle cx="-20" cy="35" r="6" fill="#10B981" />
                  <text x="-20" y="47" fill="#10B981" fontSize="7" textAnchor="middle">Urea</text>

                  <circle cx="45" cy="40" r="7" fill="#EC4899" />
                  <text x="45" y="52" fill="#EC4899" fontSize="7" textAnchor="middle">Hormone</text>

                  <text x="0" y="-55" fill="#FEF08A" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                    90% H₂O + Dissolved Solutes
                  </text>
                </g>
              )}

              {/* LEUCOCYTE (WBC) VIEW */}
              {selectedCompId === 'wbc' && (
                <g transform="translate(130, 125)">
                  {/* Phagocyte (Neutrophil with multi-lobed nucleus) */}
                  <circle cx="-40" cy="0" r="45" fill="#3B82F6" fillOpacity="0.3" stroke="#60A5FA" strokeWidth="2" />
                  {/* Multi-lobed nucleus */}
                  <path
                    d="M -55 -15 C -45 -30, -25 -25, -25 -10 C -25 5, -45 5, -40 20 C -35 30, -55 25, -55 10 Z"
                    fill="#1E3A8A"
                    stroke="#93C5FD"
                    strokeWidth="1.5"
                  />
                  <text x="-40" y="55" fill="#93C5FD" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    Phagocyte (Lobed Nucleus)
                  </text>

                  {/* Lymphocyte (large round nucleus filling cell) */}
                  <circle cx="50" cy="0" r="35" fill="#3B82F6" fillOpacity="0.3" stroke="#60A5FA" strokeWidth="2" />
                  <circle cx="50" cy="0" r="28" fill="#1E3A8A" stroke="#93C5FD" strokeWidth="1.5" />
                  <text x="50" y="48" fill="#93C5FD" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    Lymphocyte (Antibodies)
                  </text>
                </g>
              )}

              {/* PLATELETS VIEW */}
              {selectedCompId === 'platelets' && (
                <g transform="translate(130, 125)">
                  {/* Small irregular cytoplasmic fragments */}
                  <ellipse cx="-40" cy="-20" rx="14" ry="9" fill="#A855F7" stroke="#D8B4FE" strokeWidth="1.5" />
                  <ellipse cx="20" cy="-30" rx="12" ry="8" fill="#A855F7" stroke="#D8B4FE" strokeWidth="1.5" />
                  <ellipse cx="-10" cy="20" rx="15" ry="10" fill="#A855F7" stroke="#D8B4FE" strokeWidth="1.5" />
                  <ellipse cx="40" cy="25" rx="10" ry="7" fill="#A855F7" stroke="#D8B4FE" strokeWidth="1.5" />

                  {/* Fibrin meshwork threads */}
                  <line x1="-70" y1="0" x2="70" y2="0" stroke="#FDE047" strokeWidth="2" strokeDasharray="4 2" />
                  <line x1="-50" y1="-40" x2="50" y2="40" stroke="#FDE047" strokeWidth="2" strokeDasharray="4 2" />

                  <text x="0" y="-55" fill="#E9D5FF" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                    Platelet Activation & Fibrin Mesh
                  </text>
                </g>
              )}
            </g>
          </svg>

          {/* Telemetry Strip */}
          <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Fraction: <strong className="text-white">{current.fraction}</strong>
            </span>
            <span className="font-mono text-cyan-300 font-semibold">
              Primary Role: {current.primaryRole}
            </span>
          </div>
        </div>

        {/* Morphological Adaptations Card */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Functional Adaptations
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              {current.adaptations.map((a, i) => (
                <div key={i} className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-300 leading-snug">{a}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Clinical Relevance:
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Centrifuging anticoagulated whole blood in a hematocrit tube yields the Packed Cell Volume (PCV), typically 40–45% in healthy humans. A PCV below 35% indicates anemia (insufficient erythrocytes or haemoglobin).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
