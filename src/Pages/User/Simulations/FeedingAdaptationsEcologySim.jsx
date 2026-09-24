import React, { useState } from 'react';
import { Skull, RotateCcw, Sparkles, CheckCircle2, Info, ArrowRight, Play, Eye } from 'lucide-react';

export default function FeedingAdaptationsEcologySim({ config = {}, onTelemetry }) {
  // Primary Variable 1: Selected Mammalian Diet Guild ('herbivore' vs 'carnivore')
  const [selectedDiet, setSelectedDiet] = useState('carnivore');

  // Primary Variable 2: Jaw Posture / Articulation
  // For carnivore: 'ajar' (detailed profile) vs 'occluded' (scissor bite)
  // For herbivore: 'rest' vs 'lateral_grind' (side-to-side mastication)
  const [jawPosture, setJawPosture] = useState('ajar');

  const mammals = {
    carnivore: {
      name: 'Predatory Carnivore (Dog / Wolf / Lion)',
      dentalFormula: 'i 3/3, c 1/1, pm 4/4, m 2/3 = 42',
      jawMovement: 'Strict Vertical Scissor Action (Hinge joint; no lateral play)',
      gutLength: 'Short & Simple (4–5× body length); rapid digestion of protein',
      primaryFeatures: [
        {
          name: 'Formidable Recurved Canines',
          detail: 'Enormous, conical, backward-curving teeth with deep roots in maxilla and mandible. Upper canine descends behind lower canine, anchoring and suffocating prey with tremendous grip.'
        },
        {
          name: 'Carnassial Shearing Pair (P⁴ / M₁)',
          detail: 'Last upper premolar (P⁴) and first lower molar (M₁) act like heavy-duty scissor shears, slicing tough muscle fibers and sinews cleanly off bone.'
        },
        {
          name: 'Pointed Scraping Incisors',
          detail: 'Six small, sharp, chisel-edged incisors on each jaw for picking meat and delicate tissue cleanly off bone surfaces.'
        },
        {
          name: 'Locked Hinge Temporomandibular Joint (TMJ)',
          detail: 'Deep cylindrical mandibular fossa tightly grasps the transverse condyle, preventing any sideways dislocation while gripping violent prey.'
        },
        {
          name: 'Massive Sagittal Crest & Coronoid Process',
          detail: 'High dorsal crest and tall coronoid blade provide massive surface area for powerful temporalis jaw-closing muscles.'
        }
      ],
      color: '#EF4444'
    },
    herbivore: {
      name: 'Ruminant Herbivore (Sheep / Cow)',
      dentalFormula: 'i 0/3, c 0/1, pm 3/3, m 3/3 = 32',
      jawMovement: 'Lateral & Rotary Grinding (Side-to-side circular chewing)',
      gutLength: 'Extremely Long (20–25× body length) with 4-chambered fermentation rumen',
      primaryFeatures: [
        {
          name: 'Horny Dental Pad (Upper Jaw)',
          detail: 'Upper incisors and canines are completely absent; replaced by a tough, keratinized fibrous pad against which lower incisors pinch and shear grass.'
        },
        {
          name: 'The Diastema (Toothless Gap)',
          detail: 'Large space between front biting teeth and rear grinding molars. Allows the muscular tongue to manipulate, sort, and roll grass into cud boluses.'
        },
        {
          name: 'Ridged Grinding Molars (Hypsodont / Selenodont)',
          detail: 'High-crowned premolars and molars with crescent enamel ridges that wear down unevenly, forming self-sharpening abrasive washboard surfaces.'
        },
        {
          name: 'Loose, Flat Temporomandibular Joint',
          detail: 'Shallow, smooth glenoid cavity allows extensive sideways sliding and circular rotary chewing motions to crush cellulose walls.'
        }
      ],
      color: '#10B981'
    }
  };

  const current = mammals[selectedDiet];

  const handleSelectDiet = (diet) => {
    setSelectedDiet(diet);
    setJawPosture(diet === 'carnivore' ? 'ajar' : 'rest');
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'feeding_adaptations_ecology',
      diet
    });
  };

  const handleTogglePosture = (posture) => {
    setJawPosture(posture);
    onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
      simulation: 'feeding_adaptations_ecology',
      diet: selectedDiet,
      posture
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Skull className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Mammalian Dentition & Feeding Adaptations
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Animal Nutrition (Comparative Cranial & Dental Anatomy)
            </p>
          </div>
        </div>
        <button
          onClick={() => { setSelectedDiet('carnivore'); setJawPosture('ajar'); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Primary Variable 1: Diet Toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleSelectDiet('carnivore')}
          className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border font-bold text-xs sm:text-sm transition-all shadow-md ${
            selectedDiet === 'carnivore'
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/40 shadow-rose-950/40'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>1. Carnivore Dentition (Wolf / Dog / Lion)</span>
        </button>

        <button
          onClick={() => handleSelectDiet('herbivore')}
          className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border font-bold text-xs sm:text-sm transition-all shadow-md ${
            selectedDiet === 'herbivore'
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40 shadow-emerald-950/40'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>2. Herbivore Dentition (Sheep / Cow / Grazer)</span>
        </button>
      </div>

      {/* Primary Variable 2: Jaw Articulation & Action Mode */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-400">
            Jaw Articulation Mode:
          </span>
        </div>

        {selectedDiet === 'carnivore' ? (
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => handleTogglePosture('ajar')}
              className={`px-3 py-1.5 rounded-xl border transition font-bold ${
                jawPosture === 'ajar'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm ring-1 ring-rose-500'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              Slightly Ajar (Canine Profile View)
            </button>
            <button
              onClick={() => handleTogglePosture('occluded')}
              className={`px-3 py-1.5 rounded-xl border transition font-bold ${
                jawPosture === 'occluded'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm ring-1 ring-rose-500'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              Jaws Closed (Interlocking Canines & Carnassial Shear)
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => handleTogglePosture('rest')}
              className={`px-3 py-1.5 rounded-xl border transition font-bold ${
                jawPosture === 'rest'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm ring-1 ring-emerald-500'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              Resting Occlusion
            </button>
            <button
              onClick={() => handleTogglePosture('lateral_grind')}
              className={`px-3 py-1.5 rounded-xl border transition font-bold ${
                jawPosture === 'lateral_grind'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm ring-1 ring-emerald-500'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              Lateral Rotary Grinding (Side-to-Side Chewing)
            </button>
          </div>
        )}
      </div>

      {/* Main Simulation Viewport: Skull & Dental Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative min-h-[400px] overflow-hidden">
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
              selectedDiet === 'herbivore'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50'
                : 'bg-rose-950/80 text-rose-300 border-rose-700/50'
            }`}>
              {current.name} • {current.dentalFormula}
            </span>
          </div>

          {/* SVG Skull Morphology */}
          <svg viewBox="0 0 500 330" className="w-full max-w-[460px] h-auto select-none my-auto">
            <defs>
              {/* Natural Ivory Tooth Enamel Gradient */}
              <linearGradient id="toothIvoryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>

              {/* 3D Canine Ivory Gradients */}
              <linearGradient id="canineIvoryUpper" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#F8FAFC" />
                <stop offset="70%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>

              <linearGradient id="canineIvoryLower" x1="20%" y1="100%" x2="80%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#F8FAFC" />
                <stop offset="70%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>

              {/* Bone Texture Gradients */}
              <linearGradient id="craniumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748B" />
                <stop offset="40%" stopColor="#475569" />
                <stop offset="85%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              <linearGradient id="mandibleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="60%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              <linearGradient id="boneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              {/* Soft Drop Shadow for Depth */}
              <filter id="toothGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="1.5" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.6"/>
              </filter>
            </defs>

            {/* 1. CARNIVORE SKULL (Predator / Canid Model) */}
            {selectedDiet === 'carnivore' && (
              <g transform="translate(45, 25)">
                {/* LAYER 1: UPPER CRANIUM & SNOUT */}
                <g id="carnivore-cranium">
                  {/* Main Cranium Bone Body */}
                  <path
                    d="M 60 146
                       L 60 134
                       C 65 125, 95 118, 140 108
                       C 175 100, 195 86, 225 64
                       C 255 42, 295 38, 335 44
                       C 365 48, 380 72, 380 102
                       C 380 124, 368 144, 345 152
                       L 315 148
                       C 280 144, 220 144, 180 146
                       Z"
                    fill="url(#craniumGrad)"
                    stroke="#94A3B8"
                    strokeWidth="2.5"
                  />

                  {/* Sagittal Crest (Prominent dorsal ridge for temporalis muscles) */}
                  <path
                    d="M 230 63 C 265 41, 305 38, 340 44 L 342 54 C 308 50, 268 53, 235 69 Z"
                    fill="#94A3B8"
                    opacity="0.9"
                  />
                  <text x="290" y="32" fill="#FCA5A5" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    Sagittal Crest (Temporalis Muscle Anchor)
                  </text>

                  {/* Large Forward-Facing Orbit (Binocular Depth Perception) */}
                  <ellipse cx="215" cy="100" rx="19" ry="17" fill="#020617" stroke="#94A3B8" strokeWidth="2" />
                  <circle cx="215" cy="100" r="9" fill="#0F172A" />
                  <text x="215" y="76" fill="#CBD5E1" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Binocular Orbit
                  </text>

                  {/* Zygomatic Arch (Wide Flaring Cheekbone) */}
                  <path
                    d="M 185 122 C 225 132, 280 132, 320 140"
                    stroke="#94A3B8"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Mandibular Fossa / TMJ Hinge (Locked cylindrical joint) */}
                  <circle cx="315" cy="148" r="7" fill="#020617" stroke="#FDE047" strokeWidth="2" />
                  <text x="315" y="168" fill="#FDE047" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                    Locked TMJ
                  </text>

                  {/* Pre-canine Diastematic Notch in Maxilla (Accepts lower canine crown) */}
                  <path d="M 82 146 C 88 138, 96 138, 102 146" stroke="#1E293B" strokeWidth="2.5" fill="none" />

                  {/* Canine Root Jugum (Prominent alveolar ridge in maxilla bone) */}
                  <path
                    d="M 102 146 C 104 122, 116 120, 118 146"
                    fill="#334155"
                    stroke="#64748B"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />

                  {/* UPPER DENTITION (Except upper canine which is layered over mandible) */}
                  {/* Upper Incisors (I1, I2, I3) - 3 sharp chisel nibbling teeth */}
                  <g transform="translate(62, 144)">
                    <polygon points="0,0 2.5,12 5,0" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                    <polygon points="6,0 9,13 12,0" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                    <polygon points="13,0 16.5,14 20,0" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                    <text x="10" y="-5" fill="#E2E8F0" fontSize="7" fontWeight="bold" textAnchor="middle">Incisors</text>
                  </g>

                  {/* Upper Premolars (P1, P2, P3) */}
                  <g transform="translate(124, 146)">
                    <polygon points="2,0 6,10 10,0" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                    <polygon points="14,0 19,13 24,0" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                    <polygon points="28,0 34,15 40,0" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                  </g>

                  {/* Upper Carnassial (P⁴) - Prominent shearing blade */}
                  <g transform="translate(168, 146)">
                    <path
                      d="M 0 0 L 8 19 L 18 20 L 28 8 L 32 0 Z"
                      fill="#FEF2F2"
                      stroke="#DC2626"
                      strokeWidth="2"
                      filter="url(#toothGlow)"
                    />
                    <text x="16" y="-6" fill="#EF4444" fontSize="8.5" fontWeight="extrabold" textAnchor="middle">
                      Upper Carnassial (P⁴)
                    </text>
                  </g>

                  {/* Upper Molars (M1, M2) - Crushing teeth behind carnassial */}
                  <g transform="translate(204, 146)">
                    <rect x="0" y="0" width="9" height="7" rx="2" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                    <rect x="11" y="0" width="8" height="6" rx="2" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                  </g>
                </g>

                {/* LAYER 2: LOWER JAW (MANDIBLE) */}
                {/* In 'ajar' mode: rotated down -18° around TMJ (315, 148) */}
                {/* In 'occluded' mode: rotated 0° around TMJ (315, 148) */}
                <g
                  id="carnivore-mandible"
                  transform={
                    jawPosture === 'ajar'
                      ? 'rotate(-18, 315, 148)'
                      : 'rotate(0, 315, 148)'
                  }
                  className="transition-transform duration-500"
                >
                  {/* Mandible Bone */}
                  <path
                    d="M 62 165
                       L 120 165
                       L 225 165
                       L 285 136
                       C 302 85, 318 72, 324 82
                       L 315 148
                       C 330 170, 330 195, 310 205
                       L 220 205
                       L 115 200
                       L 60 185
                       Z"
                    fill="url(#mandibleGrad)"
                    stroke="#64748B"
                    strokeWidth="2.5"
                  />

                  {/* Massive Coronoid Process (High vertical blade inside temporal fossa) */}
                  <path
                    d="M 270 144 C 295 90, 315 75, 322 80 L 314 148 Z"
                    fill="#334155"
                    opacity="0.8"
                  />
                  <text x="310" y="112" fill="#FCA5A5" fontSize="7.5" fontWeight="bold" textAnchor="end">
                    Coronoid Process
                  </text>

                  {/* Lower Incisors (3 chisel nibblers) */}
                  <g transform="translate(62, 153)">
                    <polygon points="0,12 2.5,0 5,12" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                    <polygon points="6,12 9,0 12,12" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                    <polygon points="13,12 16.5,0 20,12" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                  </g>

                  {/* LOWER CANINE (Recurved conical dagger, curves Up & Backward) */}
                  {/* Root anchor bulge in chin */}
                  <path
                    d="M 88 165 C 90 180, 99 180, 102 165"
                    fill="#334155"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                  {/* Lower Canine Crown: Elegant conical recurve */}
                  <path
                    d="M 88 165
                       C 86 150, 90 138, 96 122
                       C 98 136, 100 150, 102 165
                       Z"
                    fill="url(#canineIvoryLower)"
                    stroke="#334155"
                    strokeWidth="1.8"
                    filter="url(#toothGlow)"
                  />
                  {/* Carina cutting edge highlight */}
                  <path d="M 88 163 C 87 149, 91 138, 96 123" stroke="#FFFFFF" strokeWidth="1.1" fill="none" opacity="0.9" />

                  {/* Lower Premolars (P2, P3, P4) */}
                  <g transform="translate(106, 153)">
                    <polygon points="2,12 6,2 10,12" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                    <polygon points="14,12 19,0 24,12" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                    <polygon points="28,12 34,0 40,12" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                  </g>

                  {/* Lower Carnassial (M₁) - Shears inside upper P⁴ */}
                  <g transform="translate(154, 149)">
                    <path
                      d="M 0 16 L 8 0 L 22 2 L 28 10 L 30 16 Z"
                      fill="#FEF2F2"
                      stroke="#DC2626"
                      strokeWidth="2"
                      filter="url(#toothGlow)"
                    />
                    <text x="15" y="30" fill="#EF4444" fontSize="8.5" fontWeight="extrabold" textAnchor="middle">
                      Lower Carnassial (M₁)
                    </text>
                  </g>

                  {/* Lower Molars (M2, M3) */}
                  <g transform="translate(188, 158)">
                    <rect x="0" y="0" width="9" height="7" rx="2" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                    <rect x="11" y="1" width="8" height="6" rx="2" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1" />
                  </g>
                </g>

                {/* LAYER 3: UPPER CANINE (Attached to Cranium, rendered in front of mandible so it overlaps buccal lower jaw cleanly when occluded) */}
                <g id="upper-canine-group">
                  {/* Upper Canine Crown: Majestic Recurved Dagger */}
                  <path
                    d="M 102 146
                       C 100 160, 105 171, 114 180
                       C 116 169, 117 157, 118 146
                       Z"
                    fill="url(#canineIvoryUpper)"
                    stroke="#334155"
                    strokeWidth="1.8"
                    filter="url(#toothGlow)"
                  />
                  {/* Carina cutting ridge highlight */}
                  <path d="M 103 148 C 102 161, 106 170, 113 179" stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.9" />
                </g>

                {/* LAYER 4: DYNAMIC ANNOTATION CALLOUTS */}
                {jawPosture === 'occluded' ? (
                  <g id="annotations-occluded">
                    {/* Lower canine fits in front into diastematic notch */}
                    <line x1="96" y1="122" x2="50" y2="85" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="2 2" />
                    <text x="46" y="80" fill="#FDE047" fontSize="9" fontWeight="extrabold" textAnchor="end">
                      Lower Canine (Seats in Front of Upper)
                    </text>

                    {/* Upper canine descends outside mandible */}
                    <line x1="114" y1="180" x2="145" y2="235" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="2 2" />
                    <text x="150" y="240" fill="#FDE047" fontSize="9" fontWeight="extrabold">
                      Upper Canine (Overlaps Outside Mandible)
                    </text>

                    {/* Carnassial scissor shear */}
                    <line x1="178" y1="146" x2="178" y2="225" stroke="#F87171" strokeWidth="1.5" strokeDasharray="2 2" />
                    <text x="183" y="228" fill="#F87171" fontSize="8.5" fontWeight="bold">
                      Scissor Shear (P⁴ / M₁)
                    </text>
                  </g>
                ) : (
                  <g id="annotations-ajar">
                    {/* Gape View: Lower canine tip rotated to ~ (94, 192) */}
                    <line x1="94" y1="192" x2="45" y2="235" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="2 2" />
                    <text x="40" y="240" fill="#FDE047" fontSize="9" fontWeight="extrabold" textAnchor="end">
                      Lower Canine (Recurved Upward)
                    </text>

                    {/* Upper canine */}
                    <line x1="114" y1="180" x2="150" y2="235" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="2 2" />
                    <text x="155" y="240" fill="#FDE047" fontSize="9" fontWeight="extrabold">
                      Upper Canine (Recurved Dagger)
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* 2. HERBIVORE SKULL (Ruminant / Sheep Model) */}
            {selectedDiet === 'herbivore' && (
              <g transform="translate(45, 30)">
                {/* UPPER CRANIUM & ELONGATED SNOUT */}
                <g id="herbivore-cranium">
                  <path
                    d="M 40 145 
                       L 40 125 
                       C 60 115, 120 100, 180 85 
                       C 230 75, 270 65, 310 65 
                       C 350 65, 375 90, 370 135 
                       L 340 145 
                       C 320 140, 240 142, 175 145 
                       Z"
                    fill="url(#boneGrad)"
                    stroke="#64748B"
                    strokeWidth="2.5"
                  />

                  {/* Eye Orbit located far posterior and high up (Panoramic 360° Vision) */}
                  <circle cx="300" cy="95" r="18" fill="#020617" stroke="#94A3B8" strokeWidth="2" />
                  <circle cx="300" cy="95" r="9" fill="#0F172A" />
                  <text x="300" y="70" fill="#CBD5E1" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Lateral Orbit (Panoramic Vision)
                  </text>

                  {/* Shallow, Flat TMJ (Allows lateral sliding & rotary mastication) */}
                  <ellipse cx="345" cy="148" rx="10" ry="5" fill="#0F172A" stroke="#34D399" strokeWidth="2" />
                  <text x="345" y="165" fill="#34D399" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                    Flat TMJ
                  </text>

                  {/* HORNY DENTAL PAD (No upper incisors or canines!) */}
                  <rect x="40" y="138" width="48" height="14" rx="4" fill="#B45309" stroke="#F59E0B" strokeWidth="2" />
                  <text x="64" y="132" fill="#FDE68A" fontSize="9" fontWeight="extrabold" textAnchor="middle">
                    Horny Dental Pad
                  </text>
                  <text x="64" y="148" fill="#FEF3C7" fontSize="7" fontStyle="italic" textAnchor="middle">
                    (No Front Teeth)
                  </text>

                  {/* DIASTEMA GAP (Upper Jaw) */}
                  <line x1="90" y1="145" x2="170" y2="145" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 3" />
                  <text x="130" y="138" fill="#38BDF8" fontSize="9.5" fontWeight="extrabold" textAnchor="middle">
                    Diastema (Large Toothless Gap)
                  </text>

                  {/* Upper Premolars & Molars (Ridged Selenodont Washboard Teeth) */}
                  <g transform="translate(175, 142)">
                    {[0, 22, 44, 66, 88, 110].map((mx, i) => (
                      <g key={i} transform={`translate(${mx}, 0)`}>
                        <rect x="0" y="0" width="18" height="22" rx="3" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1.5" />
                        {/* Washboard crescent enamel ridges */}
                        <line x1="4" y1="6" x2="14" y2="6" stroke="#94A3B8" strokeWidth="1.5" />
                        <line x1="4" y1="12" x2="14" y2="12" stroke="#94A3B8" strokeWidth="1.5" />
                        <line x1="4" y1="18" x2="14" y2="18" stroke="#94A3B8" strokeWidth="1.5" />
                      </g>
                    ))}
                    <text x="64" y="-6" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Hypsodont Grinding Molars
                    </text>
                  </g>
                </g>

                {/* LOWER JAW (MANDIBLE) */}
                {/* In 'rest' mode: aligned underneath */}
                {/* In 'lateral_grind' mode: shifted horizontally to simulate sideways chewing */}
                <g
                  id="herbivore-mandible"
                  transform={
                    jawPosture === 'lateral_grind'
                      ? 'translate(14, 4)'
                      : 'translate(0, 0)'
                  }
                  className="transition-transform duration-500"
                >
                  <path
                    d="M 35 160 
                       L 170 160 
                       L 310 156 
                       L 345 148 
                       L 330 200 
                       C 310 220, 250 225, 180 220 
                       L 45 200 
                       Z"
                    fill="url(#boneGrad)"
                    stroke="#475569"
                    strokeWidth="2.5"
                  />

                  {/* LOWER INCISORS & INCISIFORM CANINES (Forward-angled spatulas) */}
                  <g transform="translate(32, 142)">
                    {[0, 8, 16, 24].map((ix, i) => (
                      <polygon
                        key={i}
                        points={`${ix},18 ${ix + 3},0 ${ix + 7},0 ${ix + 5},18`}
                        fill="url(#toothIvoryGrad)"
                        stroke="#475569"
                        strokeWidth="1"
                      />
                    ))}
                    <text x="15" y="32" fill="#6EE7B7" fontSize="8" fontWeight="bold" textAnchor="middle">
                      Lower Incisors
                    </text>
                  </g>

                  {/* DIASTEMA GAP (Lower Jaw) */}
                  <line x1="65" y1="160" x2="170" y2="160" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 3" />

                  {/* Lower Grinding Molars */}
                  <g transform="translate(175, 150)">
                    {[0, 22, 44, 66, 88, 110].map((mx, i) => (
                      <g key={i} transform={`translate(${mx}, 0)`}>
                        <rect x="0" y="0" width="18" height="20" rx="3" fill="url(#toothIvoryGrad)" stroke="#475569" strokeWidth="1.5" />
                        <line x1="4" y1="5" x2="14" y2="5" stroke="#94A3B8" strokeWidth="1.5" />
                        <line x1="4" y1="11" x2="14" y2="11" stroke="#94A3B8" strokeWidth="1.5" />
                      </g>
                    ))}
                  </g>

                  {jawPosture === 'lateral_grind' && (
                    <text x="140" y="195" fill="#34D399" fontSize="9" fontWeight="bold" textAnchor="middle" className="animate-pulse">
                      ↔ Lateral Grinding Stroke
                    </text>
                  )}
                </g>
              </g>
            )}
          </svg>

          {/* Real-time Biomechanics Readout Strip */}
          <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              Joint Type: <strong className="text-white">{current.jawMovement.split('(')[0]}</strong>
            </span>
            <span className="font-mono text-amber-300 font-bold">
              {selectedDiet === 'carnivore'
                ? jawPosture === 'ajar'
                  ? 'Gape: Showing Recurve & Deep Roots'
                  : 'Occlusion: Lower Canine in Front, P⁴/M₁ Shear'
                : jawPosture === 'rest'
                ? 'Occlusion: Grinding Cusps Aligned'
                : 'Mastication: Side-to-side Cellulose Shearing'}
            </span>
          </div>
        </div>

        {/* Anatomical Adaptations Breakdown Card */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Dental & Digestive Specializations
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              {current.primaryFeatures.map((f, i) => (
                <div key={i} className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <strong className={selectedDiet === 'herbivore' ? 'text-emerald-300 block mb-0.5' : 'text-rose-300 block mb-0.5'}>
                    {f.name}:
                  </strong>
                  <span className="text-[11px] text-slate-400 leading-snug">{f.detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Alimentary Canal Correlation:
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Gut Architecture:</strong> {current.gutLength}. Cellulose requires prolonged bacterial fermentation in a complex gut, while animal meat is quickly cleaved by stomach pepsin and pancreatic trypsin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
