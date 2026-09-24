import React, { useState } from 'react';
import {
  RotateCcw,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  GitBranch,
  Layers,
  ZoomIn,
  Eye,
  EyeOff,
  Sliders,
  Info,
  Activity,
  Dna,
  Binary,
  Compass,
  Split
} from 'lucide-react';

// Standardized Pentadactyl Limb Color Palette (KCSE & Comparative Anatomy Standard)
export const BONE_COLORS = {
  humerus: '#3B82F6',     // Blue - Single proximal long bone
  radius: '#10B981',      // Emerald - Lateral middle forearm bone
  ulna: '#06B6D4',        // Cyan - Medial middle forearm bone with olecranon
  carpals: '#F59E0B',     // Amber - Wrist cluster
  metacarpals: '#F97316', // Orange - Palm rays (ancestral formula 5)
  phalanges: '#EC4899',   // Pink - Terminal digit segments
};

// Filter categories
export const BONE_FILTERS = [
  { id: 'all', label: 'All Bones', color: '#94A3B8' },
  { id: 'humerus', label: 'Humerus', color: BONE_COLORS.humerus, desc: '1 proximal long bone' },
  { id: 'radius_ulna', label: 'Radius & Ulna', color: BONE_COLORS.radius, desc: '2 paired middle forearm bones' },
  { id: 'carpals', label: 'Carpals', color: BONE_COLORS.carpals, desc: 'Wrist skeletal cluster' },
  { id: 'metacarpals', label: 'Metacarpals', color: BONE_COLORS.metacarpals, desc: 'Palm skeletal rays (5 ancestral)' },
  { id: 'phalanges', label: 'Phalanges', color: BONE_COLORS.phalanges, desc: 'Finger / digit terminal joints' },
];

// Specimen Comparative Data
export const SPECIMENS = {
  human: {
    id: 'human',
    name: 'Human Arm',
    taxon: 'Homo sapiens (Mammalia / Primate)',
    primaryFunction: 'Grasping, tool manipulation & fine motor dexterity',
    habitat: 'Terrestrial / Arboreal ancestry',
    evolutionaryRole: 'Divergent Evolution (Adaptive Radiation)',
    keyAdaptations: [
      'Unspecialized classic pentadactyl limb preserved in ancestral proportions',
      'True opposable thumb (Digit I) rotated on a saddle carpal joint',
      'Mobile radius capable of full pronation and supination around the ulna',
      '8 distinct, flexible carpal wrist bones for wide range of motion'
    ],
    boneDetails: {
      humerus: {
        title: 'Humerus (Upper Arm)',
        proportions: 'Long, slender cylindrical shaft (~30 cm)',
        modifications: 'Rounded hemispherical head fits into the shallow scapular glenoid cavity, allowing 360° circumduction.',
        biomechanics: 'Leverage for throwing, lifting, and swinging without bearing body weight.'
      },
      radius_ulna: {
        title: 'Radius & Ulna (Forearm)',
        proportions: 'Paired parallel bones of equal length (~25 cm)',
        modifications: 'Radial head rotates inside radial notch of ulna. Prominent olecranon process prevents elbow hyperextension.',
        biomechanics: 'Enables 180° forearm rotation (pronation/supination) crucial for hand tool orientation.'
      },
      carpals: {
        title: 'Carpals (Wrist)',
        proportions: '8 distinct pebble-like bones in 2 rows',
        modifications: 'Scaphoid, lunate, triquetrum, pisiform (proximal); trapezium, trapezoid, capitate, hamate (distal).',
        biomechanics: 'Provides multi-axial wrist flexion, extension, and radial/ulnar deviation.'
      },
      metacarpals: {
        title: 'Metacarpals (Palm)',
        proportions: '5 individual cylindrical rays',
        modifications: 'Metacarpal I (thumb) is independently mobile and offset by 35° from metacarpals II–V.',
        biomechanics: 'Allows thumb pad to meet finger pads (precision grip and power grip).'
      },
      phalanges: {
        title: 'Phalanges (Fingers)',
        proportions: '14 phalanges (Formula: 2-3-3-3-3)',
        modifications: 'Thumb possesses 2 phalanges; fingers II–V possess 3 (proximal, intermediate, distal).',
        biomechanics: 'High nerve ending density on palmar pads for tactile feedback and fine motor dexterity.'
      }
    }
  },
  bird: {
    id: 'bird',
    name: 'Bird Wing',
    taxon: 'Columba livia (Aves / Neognathae)',
    primaryFunction: 'Powered aerial flapping flight & aerodynamic lift',
    habitat: 'Aerial / Arboreal',
    evolutionaryRole: 'Divergent Evolution (Adaptive Radiation)',
    keyAdaptations: [
      'Pneumatized hollow bones with internal trabecular struts minimize flight weight',
      'Carpals and metacarpals fused solidly into a rigid Carpometacarpus',
      'Digits reduced from 5 to 3 (Digits I, II, III) to support primary feathers',
      'Digit I forms the mobile Alula ("bastard wing") to prevent stall at low speeds'
    ],
    boneDetails: {
      humerus: {
        title: 'Humerus (Proximal Wing)',
        proportions: 'Short, stout, pneumatic bone with pneumatic foramen',
        modifications: 'Enlarged deltopectoral crest anchors massive pectoralis major (downstroke) and supracoracoideus (upstroke).',
        biomechanics: 'High torsional resistance against aerodynamic drag forces during wing flaps.'
      },
      radius_ulna: {
        title: 'Radius & Ulna (Forearm)',
        proportions: 'Ulna is distinctly thicker and bowed compared to the slender radius',
        modifications: 'Ulna bears quill knobs (follicular nodes) where secondary flight feathers anchor directly to bone.',
        biomechanics: 'Maintains rigid airfoil curvature during flight while resisting air pressure.'
      },
      carpals: {
        title: 'Reduced Free Carpals',
        proportions: 'Drastically reduced to only 2 free bones: Radiale & Ulnare',
        modifications: 'Distal carpals are embryologically fused with metacarpals to eliminate wrist bending under flight load.',
        biomechanics: 'Limits wing movement strictly to the horizontal folding plane.'
      },
      metacarpals: {
        title: 'Carpometacarpus (Fused Palm)',
        proportions: 'Fused composite bone with an elongated central fenestra',
        modifications: 'Metacarpals II and III are fused with carpal elements into a single rigid beam.',
        biomechanics: 'Eliminates joint laxity, providing an unbending foundation for primary flight feathers.'
      },
      phalanges: {
        title: 'Reduced Digits (3 Functional Digits)',
        proportions: 'Reduced phalangeal formula (Digits I, II, III preserved; IV & V lost)',
        modifications: 'Digit I (Alula, 2 phalanges); Digit II (Major digit, 2 large flattened phalanges); Digit III (1 small phalanx).',
        biomechanics: 'Alula acts as an aerodynamic slot; major digit bears the tip flight feathers.'
      }
    }
  },
  bat: {
    id: 'bat',
    name: 'Bat Wing',
    taxon: 'Pteropus vampyrus (Mammalia / Chiroptera)',
    primaryFunction: 'Powered flapping flight & agile echolocation navigation',
    habitat: 'Aerial / Troglobiont',
    evolutionaryRole: 'Divergent Evolution (Adaptive Radiation)',
    keyAdaptations: [
      'Metacarpals II–V and phalanges enormously elongated like spokes of an umbrella',
      'Elastic, vascularized skin membrane (Patagium) stretches between extended fingers',
      'Digit I (thumb) remains short, free, and tipped with a sharp hook claw for roosting',
      'Ulna is vestigial and reduced to a thin proximal splint fused to the dominant radius'
    ],
    boneDetails: {
      humerus: {
        title: 'Humerus (Upper Arm)',
        proportions: 'Slender, elongated tubular bone',
        modifications: 'Smooth shaft with compact head allowing rapid flapping cadence rather than soaring stability.',
        biomechanics: 'Transmits shoulder muscular strokes to the sprawling wing membrane.'
      },
      radius_ulna: {
        title: 'Radius & Vestigial Ulna',
        proportions: 'Radius accounts for >90% of forearm mass; ulna is a rudimentary thread',
        modifications: 'The ulna is reduced to a tiny proximal olecranon sliver fused to the bowed, dominant radius.',
        biomechanics: 'Lightens the wing while preventing forearm rotation so the wing plane remains taut.'
      },
      carpals: {
        title: 'Carpals (Wrist Knot)',
        proportions: 'Small, compact, fused cluster of carpal bones',
        modifications: 'Tightly locked wrist joint acting as a pivot anchor for the radiating finger rays.',
        biomechanics: 'Acts as the main tension pulley when the bat extends or furls its flight membrane.'
      },
      metacarpals: {
        title: 'Elongated Metacarpals (Rays II–V)',
        proportions: 'Metacarpals II–V are exceptionally elongated (often longer than humerus & radius combined)',
        modifications: 'Metacarpal I remains short and robust; II–V are ultra-thin, flexible beams.',
        biomechanics: 'Spread wide apart to create the framework for the dactylopatagium membrane.'
      },
      phalanges: {
        title: 'Hyper-Elongated Phalanges',
        proportions: 'Extremely elongated, flexible distal segments',
        modifications: 'Digit I has 2 short phalanges ending in a recurved claw. Digits II–V have long, cartilage-tipped phalanges.',
        biomechanics: 'Bats dynamically curve their finger joints in mid-air to alter airfoil camber and perform 180° hairpin turns.'
      }
    }
  },
  whale: {
    id: 'whale',
    name: 'Whale Flipper',
    taxon: 'Megaptera novaeangliae (Mammalia / Cetacea)',
    primaryFunction: 'Hydrodynamic steering, depth pitching & aquatic stabilization',
    habitat: 'Marine / Pelagic oceans',
    evolutionaryRole: 'Divergent Evolution (Adaptive Radiation)',
    keyAdaptations: [
      'Proximal limb bones (humerus, radius, ulna) are drastically shortened, broadened, and flattened',
      'Demonstrates Hyperphalangy: multiplication of phalanges per digit (up to 7–8 segments)',
      'Immobile fibrous cartilage cushions joints—flipper functions as an unbendable hydrofoil paddle',
      'External limb completely enclosed in smooth, blubber-insulated cutaneous skin'
    ],
    boneDetails: {
      humerus: {
        title: 'Humerus (Basal Anchor)',
        proportions: 'Drastically shortened, flattened, massive rectangular block (~25 cm)',
        modifications: 'Enormous ball head with broad distal condyles articulating immobiler with radius and ulna.',
        biomechanics: 'Resists immense hydrodynamic water pressure during fast swimming and deep diving.'
      },
      radius_ulna: {
        title: 'Radius & Ulna (Flat Struts)',
        proportions: 'Short, broad, flattened paddle plates arranged strictly parallel',
        modifications: 'Ulna retains a broad, fan-like olecranon crest. Joint between radius and ulna is immobile.',
        biomechanics: 'Forms a broad, stiff planar hydrofoil surface that will not twist under laminar flow.'
      },
      carpals: {
        title: 'Mosaic Carpals',
        proportions: '5–6 flattened polygonal pebble bones embedded in dense cartilage matrix',
        modifications: 'Bones do not form synovial sliding joints; instead they are cemented by tough fibrous cartilage.',
        biomechanics: 'Absorbs shock while preventing wrist bending during high-speed aquatic maneuvers.'
      },
      metacarpals: {
        title: 'Flattened Metacarpals',
        proportions: '5 short, wide, flat rectangular bones',
        modifications: 'Closely aligned in a planar fan, seamlessly continuing the carpal hydrofoil.',
        biomechanics: 'Provides a broad transition base from wrist to the multiplied finger rays.'
      },
      phalanges: {
        title: 'Phalanges (Hyperphalangy)',
        proportions: 'Multiplied disc-like phalangeal counts (Digit I: 2-3, II: 7-8, III: 7-8, IV: 6, V: 4)',
        modifications: 'Hyperphalangy evolved secondarily from tetrapod ancestors to lengthen the paddle.',
        biomechanics: 'Creates a long, flexible, yet rigid steering hydrofoil similar to an aircraft winglet.'
      }
    }
  },
  mole: {
    id: 'mole',
    name: 'Mole Forelimb',
    taxon: 'Talpa europaea (Mammalia / Eulipotyphla)',
    primaryFunction: 'Subterranean burrowing, soil excavation & tunnel consolidation',
    habitat: 'Fossorial (Underground soil strata)',
    evolutionaryRole: 'Divergent Evolution (Adaptive Radiation)',
    keyAdaptations: [
      'Humerus is exceptionally short, broad, and cube-like with massive flanged muscle crests',
      'Ulna possesses an enormous hypertrophied Olecranon Process acting as a high-torque lever',
      'Hand is permanently turned outward like a spade shovel with broad sickle claws',
      'Possesses an extra sickle-shaped radial sesamoid bone (Prepollex / Falciform bone) widening the palm'
    ],
    boneDetails: {
      humerus: {
        title: 'Humerus (Power Cube)',
        proportions: 'Almost as wide as it is long; butterfly-like or cruciform shape',
        modifications: 'Hypertrophied teres major tubercle and pectoral ridge for insertion of massive digging musculature.',
        biomechanics: 'Produces massive rotational torque to push compacted subterranean clay and loam.'
      },
      radius_ulna: {
        title: 'Radius & Lever Ulna',
        proportions: 'Short, thick, heavy bones; ulna has a massive upward olecranon lever',
        modifications: 'Olecranon process extends far behind the elbow, tripling the mechanical advantage of the triceps.',
        biomechanics: 'Acts as a heavy crowbar lever, maximizing force output over distance.'
      },
      carpals: {
        title: 'Carpals & Falciform Prepollex',
        proportions: 'Broad, transverse arch of heavily ossified carpal bones',
        modifications: 'Includes a specialized sickle-shaped sesamoid bone (falciform / prepollex) on the radial margin.',
        biomechanics: 'Widens the palm surface by ~30%, converting the hand into an effective soil scoop.'
      },
      metacarpals: {
        title: 'Metacarpals (Heavy Beams)',
        proportions: '5 short, broad, thick rectangular block bones',
        modifications: 'Tightly bound by tough transverse ligaments to prevent spreading under soil pressure.',
        biomechanics: 'Transmits heavy muscular thrust directly into the digging claws without fracturing.'
      },
      phalanges: {
        title: 'Phalanges & Digging Claws',
        proportions: 'Short, powerful phalanges capped with 5 massive keratinous shovel claws',
        modifications: 'Terminal (ungual) phalanges are deeply notched to anchor heavy, curved digging claws.',
        biomechanics: 'Scratch, shear, and displace heavy compacted soil during underground tunnel boring.'
      }
    }
  }
};

// KCSE Exam Review Questions
export const KCSE_QUESTIONS = [
  {
    id: 1,
    question: "What does the presence of the homologous pentadactyl limb blueprint across humans, birds, bats, whales, and moles demonstrate according to organic evolution?",
    options: [
      "Organisms intentionally modified their bone shapes after birth depending on their daily needs (Lamarckism)",
      "All these vertebrates evolved from a common ancestral tetrapod through divergent evolution (adaptive radiation)",
      "Vertebrate bones spontaneously mutate into new designs whenever an organism migrates to water or air",
      "These organisms belong to the same species but live in different geographic climatic regions"
    ],
    correctIndex: 1,
    explanation: "Homologous structures share a common basic structural plan inherited from a shared ancestor (e.g. lobe-finned fish / early tetrapod), but have undergone divergent evolution (adaptive radiation) to perform different functions in diverse ecological niches."
  },
  {
    id: 2,
    question: "How does the wing of a bird compare to the wing of an insect (e.g. Dragonfly) in evolutionary biology?",
    options: [
      "They are homologous structures because both are used for flight and aerodynamic lift",
      "They are vestigial structures that have lost their original anatomical utility in modern times",
      "They are analogous structures resulting from convergent evolution; they share the same function but differ completely in structural blueprint and embryonic origin",
      "They share identical internal pentadactyl bone arrangements derived from the same embryonic mesoderm"
    ],
    correctIndex: 2,
    explanation: "Insect wings are non-cellular chitinous outfoldings of the thoracic ectodermal body wall, lacking bones. Bird wings have internal living bone frameworks derived from mesoderm. Because they have different origins but similar functions, they are analogous structures (convergent evolution)."
  },
  {
    id: 3,
    question: "Which anatomical modification of the ancestral pentadactyl limb is characteristic of avian (bird) wings to withstand flight stresses?",
    options: [
      "Hyperphalangy resulting in up to 10 phalanges per finger ray",
      "Distal carpals and metacarpals fuse into a rigid Carpometacarpus and digits are reduced to three",
      "Total absence of the humerus and replacement by elastic cartilage ribbons",
      "Development of an opposable thumb equipped with an opposable suction disc"
    ],
    correctIndex: 1,
    explanation: "Birds evolved fused carpals and metacarpals (the carpometacarpus) and reduced their functional digits to three (Digits I, II, III). This creates a lightweight, unbending skeletal anchor for flight feathers."
  },
  {
    id: 4,
    question: "What unique phalangeal modification is demonstrated in the pectoral flipper of cetaceans (whales and dolphins)?",
    options: [
      "Hyperphalangy: multiplication of phalanges per digit into long, unsegmented paddle supports",
      "Total loss of all digits leaving only a round ball humerus",
      "Conversion of bone tissue into flexible keratinous insect chitin",
      "Permanent fusion of all five fingers into a single solid hollow bone"
    ],
    correctIndex: 0,
    explanation: "Whales show hyperphalangy, where the number of phalanges per digit is multiplied (often 7–8 in digits II and III). Enclosed in fibrous cartilage and skin, this forms a stiff, hydrodynamic steering paddle."
  },
  {
    id: 5,
    question: "In the mole forelimb (fossorial adaptation), what is the biomechanical significance of the hypertrophied olecranon process of the ulna?",
    options: [
      "It acts as a lightweight rudder during aerial gliding",
      "It acts as a high-torque mechanical lever arm for the triceps muscle, maximizing soil excavation force",
      "It stores high-pressure acoustic fluid for echolocating insects underground",
      "It fuses with the clavicle to eliminate forearm motion entirely"
    ],
    correctIndex: 1,
    explanation: "The enlarged, elongated olecranon process on the mole's ulna provides a long lever arm for muscle attachment (triceps), generating high torque (force) to shovel through compacted subterranean soil."
  }
];

// SVG Bone Component with high-fidelity path rendering
function BonePath({
  path,
  boneType,
  activeFilter,
  selectedBone,
  onHoverBone,
  onSelectBone,
  color,
  label,
  transform = '',
  className = '',
  detailObj = null
}) {
  const isFiltered = activeFilter !== 'all' && activeFilter !== boneType;
  const isSelected = selectedBone === boneType;

  // Opacity: if filtered out -> 0.18; if selected -> 1.0; otherwise 0.9
  const fillOpacity = isFiltered ? 0.18 : isSelected ? 1.0 : 0.9;
  const strokeOpacity = isFiltered ? 0.3 : 1.0;
  const strokeWidth = isSelected ? 3 : 1.5;
  const strokeColor = isSelected ? '#FFFFFF' : '#0F172A';

  return (
    <g
      transform={transform}
      className={`transition-all duration-300 cursor-pointer ${className}`}
      onMouseEnter={() => onHoverBone && onHoverBone({ boneType, label, color, detailObj })}
      onMouseLeave={() => onHoverBone && onHoverBone(null)}
      onClick={(e) => {
        e.stopPropagation();
        onSelectBone && onSelectBone(boneType);
      }}
    >
      <path
        d={path}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{
          filter: isSelected
            ? `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 3px #fff)`
            : isFiltered
            ? 'none'
            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
        }}
      />
    </g>
  );
}

// 1. Human Forelimb SVG
function HumanLimbSVG({ activeFilter, selectedBone, onHoverBone, onSelectBone, showSilhouette, explodedOffset, specimen }) {
  const c = BONE_COLORS;
  const exp = explodedOffset;
  const details = specimen.boneDetails;

  return (
    <svg viewBox="0 0 340 480" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="humanSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* External flesh/skin silhouette outline */}
      {showSilhouette && (
        <path
          d="M 140 30 C 130 50, 125 110, 120 150 C 115 190, 105 240, 100 280 C 90 310, 70 330, 60 350 C 50 370, 70 385, 85 375 C 95 365, 110 340, 115 320 C 115 350, 120 420, 130 435 C 138 445, 150 440, 152 420 C 155 390, 152 350, 155 330 C 158 360, 165 445, 175 455 C 185 460, 195 450, 195 425 C 195 385, 195 350, 198 335 C 202 360, 210 435, 222 445 C 232 448, 240 438, 238 415 C 235 380, 230 345, 230 330 C 235 350, 245 400, 258 405 C 268 408, 275 395, 270 375 C 260 340, 245 300, 240 270 C 235 220, 245 160, 240 120 C 235 80, 220 40, 200 30 Z"
          fill="url(#humanSkinGrad)"
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          strokeOpacity="0.4"
        />
      )}

      {/* 1. HUMERUS */}
      <g transform={`translate(0, ${-exp * 0.45})`}>
        <BonePath
          path="M 160 40 C 145 42, 140 60, 150 72 C 155 78, 160 90, 160 110 L 160 145 C 150 148, 145 160, 155 170 C 165 178, 185 178, 195 170 C 205 160, 200 148, 190 145 L 190 110 C 190 90, 195 78, 200 72 C 210 60, 205 42, 190 40 C 175 38, 168 38, 160 40 Z"
          boneType="humerus"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.humerus}
          label="Humerus (Single Proximal Bone)"
          detailObj={details.humerus}
        />
      </g>

      {/* 2. RADIUS & ULNA (Paired Forearm) */}
      <g>
        {/* Radius (Lateral / Thumb side) */}
        <BonePath
          path="M 148 182 C 140 182, 138 190, 145 195 C 148 197, 148 205, 145 220 L 138 245 C 132 255, 128 265, 135 272 C 142 278, 152 276, 156 268 L 162 235 C 165 215, 162 198, 158 195 C 156 190, 155 182, 148 182 Z"
          boneType="radius_ulna"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.radius}
          label="Radius (Lateral Forearm Bone)"
          detailObj={details.radius_ulna}
        />
        {/* Ulna (Medial / Little finger side) */}
        <BonePath
          path="M 188 175 C 180 175, 175 185, 176 198 C 178 215, 178 235, 176 250 L 175 265 C 174 272, 180 278, 188 276 C 195 274, 196 268, 195 262 L 196 230 C 198 210, 198 190, 196 182 C 196 176, 192 175, 188 175 Z"
          boneType="radius_ulna"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.ulna}
          label="Ulna with Olecranon Process"
          detailObj={details.radius_ulna}
        />
      </g>

      {/* 3. CARPALS (Wrist Cluster - 8 distinct bones) */}
      <g transform={`translate(0, ${exp * 0.45})`}>
        <BonePath
          path="M 136 282 Q 142 278 148 282 Q 150 290 144 294 Q 136 292 136 282 Z
                M 152 282 Q 158 278 164 282 Q 166 290 160 294 Q 152 292 152 282 Z
                M 168 282 Q 174 278 180 282 Q 182 290 176 294 Q 168 292 168 282 Z
                M 184 283 Q 190 280 195 285 Q 195 292 188 294 Q 183 290 184 283 Z
                M 130 297 Q 138 293 144 298 Q 144 306 136 308 Q 128 304 130 297 Z
                M 147 298 Q 154 294 160 298 Q 162 306 155 308 Q 147 306 147 298 Z
                M 164 298 Q 172 294 178 299 Q 178 307 170 308 Q 163 306 164 298 Z
                M 181 298 Q 188 295 194 300 Q 194 308 187 308 Q 180 306 181 298 Z"
          boneType="carpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.carpals}
          label="Carpals (8 Wrist Bones)"
          detailObj={details.carpals}
        />
      </g>

      {/* 4. METACARPALS (Palm Rays 1 to 5) */}
      <g transform={`translate(0, ${exp * 0.95})`}>
        {/* Metacarpal I (Opposable Thumb) */}
        <BonePath
          path="M 124 306 L 98 335 C 94 340 100 348 106 344 L 132 318 C 136 312 130 304 124 306 Z"
          boneType="metacarpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.metacarpals}
          label="Metacarpal I (Opposable Thumb Ray)"
          detailObj={details.metacarpals}
        />
        {/* Metacarpals II to V */}
        <BonePath
          path="M 140 312 L 140 355 C 138 360 148 360 148 355 L 148 312 Z
                M 156 312 L 157 358 C 155 363 166 363 166 358 L 165 312 Z
                M 174 312 L 176 356 C 174 361 184 361 184 356 L 182 312 Z
                M 190 312 L 194 350 C 192 355 202 355 202 350 L 198 312 Z"
          boneType="metacarpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.metacarpals}
          label="Metacarpals II–V (Palm Rays)"
          detailObj={details.metacarpals}
        />
      </g>

      {/* 5. PHALANGES (Digits I to V) */}
      <g transform={`translate(0, ${exp * 1.45})`}>
        {/* Thumb (Digit I: 2 segments) */}
        <BonePath
          path="M 96 348 L 78 368 C 74 372 80 378 86 374 L 102 354 Z
                M 76 372 L 62 388 C 58 392 64 398 70 394 L 84 378 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Phalanges I (Pollex / Thumb: 2 Segments)"
          detailObj={details.phalanges}
        />
        {/* Index Finger (Digit II: 3 segments) */}
        <BonePath
          path="M 140 362 L 139 385 C 137 388 147 388 147 385 L 148 362 Z
                M 139 390 L 138 410 C 136 413 146 413 146 410 L 147 390 Z
                M 138 414 L 137 428 C 136 432 144 432 144 428 L 145 414 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Phalanges II (Index: 3 Segments)"
          detailObj={details.phalanges}
        />
        {/* Middle Finger (Digit III: 3 segments) */}
        <BonePath
          path="M 157 364 L 157 392 C 155 395 165 395 165 392 L 165 364 Z
                M 157 396 L 157 422 C 155 425 165 425 165 422 L 165 396 Z
                M 157 426 L 157 444 C 155 448 165 448 165 444 L 165 426 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Phalanges III (Middle: 3 Segments - Longest)"
          detailObj={details.phalanges}
        />
        {/* Ring Finger (Digit IV: 3 segments) */}
        <BonePath
          path="M 176 362 L 177 388 C 175 391 185 391 185 388 L 184 362 Z
                M 177 392 L 178 416 C 176 419 186 419 186 416 L 185 392 Z
                M 178 420 L 179 436 C 177 440 186 440 186 436 L 185 420 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Phalanges IV (Ring: 3 Segments)"
          detailObj={details.phalanges}
        />
        {/* Little Finger (Digit V: 3 segments) */}
        <BonePath
          path="M 194 356 L 196 376 C 194 380 204 380 204 376 L 202 356 Z
                M 196 380 L 198 400 C 196 404 206 404 206 400 L 204 380 Z
                M 198 404 L 200 418 C 198 422 206 422 206 418 L 204 404 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Phalanges V (Little: 3 Segments)"
          detailObj={details.phalanges}
        />
      </g>
    </svg>
  );
}

// 2. Bird Wing SVG
function BirdWingSVG({ activeFilter, selectedBone, onHoverBone, onSelectBone, showSilhouette, explodedOffset, specimen }) {
  const c = BONE_COLORS;
  const exp = explodedOffset;
  const details = specimen.boneDetails;

  return (
    <svg viewBox="0 0 340 480" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="birdFeatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* Aerodynamic Wing & Feather Silhouette */}
      {showSilhouette && (
        <g>
          {/* Main Airfoil Body */}
          <path
            d="M 140 40 C 110 50, 90 90, 80 140 C 70 180, 50 240, 40 290 C 30 350, 40 420, 160 460 C 220 440, 270 380, 280 300 C 290 220, 260 120, 210 50 Z"
            fill="url(#birdFeatherGrad)"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            strokeOpacity="0.4"
          />
          {/* Primary & Secondary Flight Feather Vanes (Dotted Guides) */}
          <path
            d="M 200 220 C 260 240, 300 270, 310 320
               M 190 240 C 250 270, 290 310, 295 360
               M 180 260 C 240 300, 280 350, 280 400
               M 170 330 C 220 370, 250 420, 240 450"
            stroke="#06B6D4"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="3 3"
          />
        </g>
      )}

      {/* 1. HUMERUS (Pneumatized with Deltopectoral Crest) */}
      <g transform={`translate(0, ${-exp * 0.45})`}>
        <BonePath
          path="M 160 45 C 135 48, 125 70, 140 85 C 148 92, 155 105, 155 125 L 155 145 C 145 150, 145 165, 155 172 C 168 178, 185 178, 195 170 C 205 162, 202 148, 192 145 L 188 120 C 185 95, 195 85, 200 75 C 208 60, 195 45, 175 42 Z"
          boneType="humerus"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.humerus}
          label="Pneumatic Humerus with Deltopectoral Crest"
          detailObj={details.humerus}
        />
      </g>

      {/* 2. RADIUS & ULNA (Bowed with Quill Knobs) */}
      <g>
        {/* Radius (Slender cranial rod) */}
        <BonePath
          path="M 148 184 C 142 184, 140 192, 144 198 L 144 260 C 140 265, 146 274, 154 272 C 160 270, 158 262, 156 258 L 156 198 C 158 192, 154 184, 148 184 Z"
          boneType="radius_ulna"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.radius}
          label="Radius (Slender Cranial Bone)"
          detailObj={details.radius_ulna}
        />
        {/* Ulna (Stout, bowed with feather attachment quill knobs) */}
        <BonePath
          path="M 180 180 C 172 180, 168 190, 170 200 C 176 220, 176 240, 172 260 L 170 268 C 170 275, 180 278, 186 274 C 194 270, 192 262, 190 256 C 196 238, 196 218, 188 198 C 188 188, 188 180, 180 180 Z"
          boneType="radius_ulna"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.ulna}
          label="Ulna (Stout, Bowed with Quill Knobs)"
          detailObj={details.radius_ulna}
        />
        {/* Small quill knob dots along Ulna */}
        <circle cx="193" cy="210" r="1.8" fill="#FFFFFF" opacity="0.6" />
        <circle cx="194" cy="225" r="1.8" fill="#FFFFFF" opacity="0.6" />
        <circle cx="193" cy="240" r="1.8" fill="#FFFFFF" opacity="0.6" />
      </g>

      {/* 3. REDUCED CARPALS (Only 2 Free Bones: Radiale & Ulnare) */}
      <g transform={`translate(0, ${exp * 0.45})`}>
        <BonePath
          path="M 144 280 Q 152 276 158 282 Q 158 290 150 292 Q 142 288 144 280 Z
                M 172 282 Q 180 278 186 284 Q 186 292 178 294 Q 170 290 172 282 Z"
          boneType="carpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.carpals}
          label="Reduced Carpals (Radiale & Ulnare)"
          detailObj={details.carpals}
        />
      </g>

      {/* 4. CARPOMETACARPUS (Fused Carpals & Metacarpals II + III with Fenestra) */}
      <g transform={`translate(0, ${exp * 0.95})`}>
        <BonePath
          path="M 150 298 C 142 298, 140 306, 144 314 L 144 350 C 140 358, 146 366, 156 366 C 166 366, 172 358, 168 350 L 168 314 C 172 306, 166 298, 150 298 Z
                M 152 315 L 152 345 C 158 345, 160 345, 160 315 Z"
          boneType="metacarpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.metacarpals}
          label="Fused Carpometacarpus (Metacarpals II + III)"
          detailObj={details.metacarpals}
        />
      </g>

      {/* 5. PHALANGES (Reduced to Digits I, II, III) */}
      <g transform={`translate(0, ${exp * 1.45})`}>
        {/* Digit I: Alula (Bastard wing - 2 phalanges pointing anteriorly) */}
        <BonePath
          path="M 136 304 L 115 288 C 110 284 104 290 108 296 L 126 312 Z
                M 108 287 L 96 276 C 92 272 86 278 90 284 L 102 295 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit I: Alula (Prevents Aerodynamic Stall)"
          detailObj={details.phalanges}
        />
        {/* Digit II: Major Digit (2 large flattened phalanges for flight feathers) */}
        <BonePath
          path="M 150 372 L 150 405 C 148 410, 162 410, 160 405 L 160 372 Z
                M 151 412 L 151 440 C 148 446, 160 446, 158 440 L 158 412 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit II: Major Digit (Anchors Primary Feathers)"
          detailObj={details.phalanges}
        />
        {/* Digit III: Minor Digit (1 small phalanx pressed to digit II) */}
        <BonePath
          path="M 166 372 L 168 395 C 166 400, 174 400, 174 395 L 172 372 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit III: Minor Digit (1 Phalanx)"
          detailObj={details.phalanges}
        />
      </g>
    </svg>
  );
}

// 3. Bat Wing SVG
function BatWingSVG({ activeFilter, selectedBone, onHoverBone, onSelectBone, showSilhouette, explodedOffset, specimen }) {
  const c = BONE_COLORS;
  const exp = explodedOffset;
  const details = specimen.boneDetails;

  return (
    <svg viewBox="0 0 340 480" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="patagiumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Leathery Wing Membrane (Patagium) Silhouette */}
      {showSilhouette && (
        <path
          d="M 150 40 C 110 50, 70 80, 50 140 C 30 200, 20 280, 25 380 C 40 430, 80 460, 120 465 C 160 470, 200 465, 240 460 C 280 445, 310 400, 315 340 C 320 280, 290 150, 250 80 C 220 50, 180 40, 150 40 Z"
          fill="url(#patagiumGrad)"
          stroke="#A855F7"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          strokeOpacity="0.45"
        />
      )}

      {/* 1. HUMERUS (Slender) */}
      <g transform={`translate(0, ${-exp * 0.45})`}>
        <BonePath
          path="M 162 45 C 150 45, 148 58, 155 70 L 158 135 C 152 140, 155 152, 165 152 C 175 152, 178 140, 172 135 L 172 70 C 178 58, 175 45, 162 45 Z"
          boneType="humerus"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.humerus}
          label="Slender Humerus"
          detailObj={details.humerus}
        />
      </g>

      {/* 2. RADIUS & VESTIGIAL ULNA */}
      <g>
        {/* Dominant Bowed Radius */}
        <BonePath
          path="M 158 160 C 150 160, 146 170, 150 180 L 150 250 C 146 256, 152 266, 162 266 C 170 266, 174 256, 170 250 L 168 180 C 170 170, 168 160, 158 160 Z"
          boneType="radius_ulna"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.radius}
          label="Dominant Radius (>90% Forearm Mass)"
          detailObj={details.radius_ulna}
        />
        {/* Vestigial Ulna Splint */}
        <BonePath
          path="M 175 162 C 173 162, 172 166, 173 172 L 174 195 C 175 198, 178 198, 178 195 L 177 172 C 178 166, 177 162, 175 162 Z"
          boneType="radius_ulna"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.ulna}
          label="Vestigial Rudimentary Ulna"
          detailObj={details.radius_ulna}
        />
      </g>

      {/* 3. CARPALS (Compact Locked Wrist Knot) */}
      <g transform={`translate(0, ${exp * 0.45})`}>
        <BonePath
          path="M 154 272 Q 162 268 168 274 Q 168 284 160 286 Q 152 282 154 272 Z"
          boneType="carpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.carpals}
          label="Fused Carpal Wrist Block"
          detailObj={details.carpals}
        />
      </g>

      {/* 4. METACARPALS (Elongated Umbrella Spokes II–V; Short Thumb I) */}
      <g transform={`translate(0, ${exp * 0.95})`}>
        {/* Metacarpal I (Thumb - Short) */}
        <BonePath
          path="M 148 278 L 126 295 C 122 298, 126 305, 130 302 L 152 285 Z"
          boneType="metacarpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.metacarpals}
          label="Metacarpal I (Short Roosting Thumb)"
          detailObj={details.metacarpals}
        />
        {/* Metacarpal II (Leading edge strut) */}
        <BonePath
          path="M 154 288 L 85 350 C 82 353, 86 357, 89 354 L 158 292 Z"
          boneType="metacarpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.metacarpals}
          label="Metacarpal II (Leading Edge Flight Strut)"
          detailObj={details.metacarpals}
        />
        {/* Metacarpal III (Wing tip strut) */}
        <BonePath
          path="M 158 290 L 140 375 C 138 378, 143 381, 145 378 L 163 292 Z"
          boneType="metacarpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.metacarpals}
          label="Metacarpal III (Main Wing Tip Beam)"
          detailObj={details.metacarpals}
        />
        {/* Metacarpal IV (Intermediate strut) */}
        <BonePath
          path="M 164 290 L 205 370 C 208 373, 212 370, 210 366 L 168 288 Z"
          boneType="metacarpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.metacarpals}
          label="Metacarpal IV (Membrane Tension Beam)"
          detailObj={details.metacarpals}
        />
        {/* Metacarpal V (Trailing edge strut) */}
        <BonePath
          path="M 168 288 L 260 345 C 264 347, 266 342, 263 339 L 172 284 Z"
          boneType="metacarpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.metacarpals}
          label="Metacarpal V (Trailing Edge Support)"
          detailObj={details.metacarpals}
        />
      </g>

      {/* 5. PHALANGES (Ultra-Elongated Flexible Rays; Free Thumb Claw) */}
      <g transform={`translate(0, ${exp * 1.45})`}>
        {/* Thumb Claw (Digit I: 2 segments ending in hooked claw) */}
        <BonePath
          path="M 124 300 L 105 316 C 102 319, 107 324, 110 321 L 128 306 Z
                M 104 320 C 95 328, 92 338, 98 340 C 104 340, 108 330, 108 322 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Hooked Roosting Claw (Digit I)"
          detailObj={details.phalanges}
        />
        {/* Digit II Phalanges */}
        <BonePath
          path="M 84 354 L 45 395 C 42 398, 46 402, 49 399 L 88 358 Z
                M 44 400 L 25 435 C 22 438, 27 441, 29 438 L 48 403 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit II Elongated Phalanges"
          detailObj={details.phalanges}
        />
        {/* Digit III Phalanges (Longest wing tip) */}
        <BonePath
          path="M 140 382 L 125 425 C 123 428, 128 431, 130 428 L 145 385 Z
                M 124 430 L 115 460 C 113 463, 118 466, 120 463 L 129 433 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit III Tip Phalanges (Airfoil Camber Control)"
          detailObj={details.phalanges}
        />
        {/* Digit IV Phalanges */}
        <BonePath
          path="M 208 374 L 225 420 C 227 423, 232 421, 230 417 L 213 371 Z
                M 226 424 L 238 455 C 240 458, 245 456, 243 452 L 231 421 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit IV Elongated Phalanges"
          detailObj={details.phalanges}
        />
        {/* Digit V Phalanges */}
        <BonePath
          path="M 264 347 L 285 385 C 287 388, 292 386, 290 382 L 269 344 Z
                M 287 388 L 305 420 C 307 423, 312 421, 310 417 L 292 385 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit V Trailing Edge Phalanges"
          detailObj={details.phalanges}
        />
      </g>
    </svg>
  );
}

// 4. Whale Flipper SVG
function WhaleFlipperSVG({ activeFilter, selectedBone, onHoverBone, onSelectBone, showSilhouette, explodedOffset, specimen }) {
  const c = BONE_COLORS;
  const exp = explodedOffset;
  const details = specimen.boneDetails;

  return (
    <svg viewBox="0 0 340 480" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="whaleSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0369A1" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Smooth Hydrodynamic Flipper Outline */}
      {showSilhouette && (
        <path
          d="M 155 35 C 130 45, 115 80, 100 130 C 85 180, 75 250, 75 320 C 75 380, 95 440, 150 465 C 190 440, 220 370, 235 300 C 250 230, 245 150, 225 90 C 210 50, 185 35, 155 35 Z"
          fill="url(#whaleSkinGrad)"
          stroke="#0284C7"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          strokeOpacity="0.4"
        />
      )}

      {/* 1. HUMERUS (Drastically Shortened, Flattened Block) */}
      <g transform={`translate(0, ${-exp * 0.45})`}>
        <BonePath
          path="M 145 50 C 132 50, 128 65, 134 80 L 136 120 C 136 128, 144 132, 152 132 L 180 132 C 188 132, 196 128, 196 120 L 198 80 C 204 65, 198 50, 185 50 Z"
          boneType="humerus"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.humerus}
          label="Shortened, Flattened Whale Humerus"
          detailObj={details.humerus}
        />
      </g>

      {/* 2. RADIUS & ULNA (Broad Paddle Struts) */}
      <g>
        {/* Radius (Broad anterior strut) */}
        <BonePath
          path="M 136 142 L 132 205 C 132 212, 140 216, 148 216 L 158 216 C 164 216, 168 210, 168 205 L 166 142 Z"
          boneType="radius_ulna"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.radius}
          label="Radius (Broad Anterior Strut)"
          detailObj={details.radius_ulna}
        />
        {/* Ulna (With flat olecranon fan) */}
        <BonePath
          path="M 172 142 L 174 205 C 174 210, 178 216, 184 216 L 196 216 C 204 216, 208 210, 206 200 L 202 142 C 200 138, 194 136, 188 136 Z"
          boneType="radius_ulna"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.ulna}
          label="Ulna (Broad Posterior Strut)"
          detailObj={details.radius_ulna}
        />
      </g>

      {/* 3. MOSAIC CARPALS (Pebble stones in cartilage) */}
      <g transform={`translate(0, ${exp * 0.45})`}>
        <BonePath
          path="M 130 225 Q 138 220 144 225 Q 146 235 138 238 Q 130 234 130 225 Z
                M 148 225 Q 156 220 162 225 Q 164 235 156 238 Q 148 234 148 225 Z
                M 166 225 Q 174 220 180 225 Q 182 235 174 238 Q 166 234 166 225 Z
                M 184 225 Q 192 220 198 225 Q 200 235 192 238 Q 184 234 184 225 Z
                M 138 242 Q 146 238 152 243 Q 154 252 146 255 Q 138 250 138 242 Z
                M 156 242 Q 164 238 170 243 Q 172 252 164 255 Q 156 250 156 242 Z
                M 174 242 Q 182 238 188 243 Q 190 252 182 255 Q 174 250 174 242 Z"
          boneType="carpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.carpals}
          label="Mosaic Carpals Embedded in Fibrous Cartilage"
          detailObj={details.carpals}
        />
      </g>

      {/* 4. FLATTENED METACARPALS (Rays I to V) */}
      <g transform={`translate(0, ${exp * 0.95})`}>
        <BonePath
          path="M 122 260 L 120 285 C 118 290 128 290 128 285 L 130 260 Z
                M 134 260 L 134 290 C 132 295 144 295 144 290 L 144 260 Z
                M 150 260 L 150 292 C 148 297 160 297 160 292 L 160 260 Z
                M 166 260 L 166 288 C 164 293 176 293 176 288 L 176 260 Z
                M 182 260 L 184 282 C 182 287 192 287 192 282 L 190 260 Z"
          boneType="metacarpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.metacarpals}
          label="Flattened Metacarpal Rays"
          detailObj={details.metacarpals}
        />
      </g>

      {/* 5. PHALANGES (Hyperphalangy: Multiplied Disc Segments) */}
      <g transform={`translate(0, ${exp * 1.45})`}>
        {/* Digit I (3 phalanges) */}
        <BonePath
          path="M 120 295 L 118 312 C 116 315 124 315 124 312 L 126 295 Z
                M 118 316 L 116 332 C 114 335 122 335 122 332 L 124 316 Z
                M 116 336 L 114 348 C 112 352 118 352 118 348 L 120 336 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit I (3 Phalanges)"
          detailObj={details.phalanges}
        />
        {/* Digit II (7-8 phalanges) */}
        <BonePath
          path="M 134 298 L 132 318 C 130 322 140 322 140 318 L 142 298 Z
                M 132 322 L 130 342 C 128 346 138 346 138 342 L 140 322 Z
                M 130 346 L 128 366 C 126 370 136 370 136 366 L 138 346 Z
                M 128 370 L 126 390 C 124 394 134 394 134 390 L 136 370 Z
                M 126 394 L 124 412 C 122 416 132 416 132 412 L 134 394 Z
                M 124 416 L 122 432 C 120 436 128 436 128 432 L 130 416 Z
                M 122 436 L 120 448 C 118 452 125 452 125 448 L 127 436 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit II (Hyperphalangy: 7 Segments)"
          detailObj={details.phalanges}
        />
        {/* Digit III (8 phalanges - Longest Paddle Ray) */}
        <BonePath
          path="M 150 300 L 150 320 C 148 324 158 324 158 320 L 158 300 Z
                M 150 324 L 150 344 C 148 348 158 348 158 344 L 158 324 Z
                M 150 348 L 150 368 C 148 372 158 372 158 368 L 158 348 Z
                M 150 372 L 150 392 C 148 396 158 396 158 392 L 158 372 Z
                M 150 396 L 148 414 C 146 418 156 418 156 414 L 158 396 Z
                M 148 418 L 146 434 C 144 438 154 438 154 434 L 156 418 Z
                M 146 438 L 144 450 C 142 454 150 454 150 450 L 152 438 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit III (Hyperphalangy: 8 Segments)"
          detailObj={details.phalanges}
        />
        {/* Digit IV (6 phalanges) */}
        <BonePath
          path="M 166 296 L 168 316 C 166 320 176 320 174 316 L 174 296 Z
                M 168 320 L 170 340 C 168 344 178 344 176 340 L 176 320 Z
                M 170 344 L 172 364 C 170 368 180 368 178 364 L 178 344 Z
                M 172 368 L 174 386 C 172 390 182 390 180 386 L 180 368 Z
                M 174 390 L 176 406 C 174 410 182 410 180 406 L 180 390 Z
                M 176 410 L 178 424 C 176 428 184 428 182 424 L 182 410 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit IV (Hyperphalangy: 6 Segments)"
          detailObj={details.phalanges}
        />
        {/* Digit V (4 phalanges) */}
        <BonePath
          path="M 184 290 L 186 308 C 184 312 194 312 192 308 L 192 290 Z
                M 186 312 L 188 330 C 186 334 196 334 194 330 L 194 312 Z
                M 188 334 L 190 350 C 188 354 196 354 194 350 L 194 334 Z
                M 190 354 L 192 368 C 190 372 196 372 194 368 L 194 354 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit V (4 Segments)"
          detailObj={details.phalanges}
        />
      </g>
    </svg>
  );
}

// 5. Mole Forelimb SVG
function MoleForelimbSVG({ activeFilter, selectedBone, onHoverBone, onSelectBone, showSilhouette, explodedOffset, specimen }) {
  const c = BONE_COLORS;
  const exp = explodedOffset;
  const details = specimen.boneDetails;

  return (
    <svg viewBox="0 0 340 480" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="moleSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#EA580C" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Broad Muscular Digging Spade Silhouette */}
      {showSilhouette && (
        <path
          d="M 130 40 C 100 50, 70 90, 60 140 C 50 190, 45 250, 45 310 C 45 360, 60 410, 80 435 C 100 455, 140 460, 190 460 C 240 455, 275 430, 285 390 C 295 330, 290 240, 275 170 C 260 110, 230 60, 190 40 Z"
          fill="url(#moleSkinGrad)"
          stroke="#F59E0B"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          strokeOpacity="0.45"
        />
      )}

      {/* 1. HUMERUS (Extreme Shortening, Massive Flanged Power Cube) */}
      <g transform={`translate(0, ${-exp * 0.45})`}>
        <BonePath
          path="M 140 55 C 115 60, 100 80, 110 100 C 115 110, 105 125, 120 140 L 140 145 C 155 148, 175 148, 190 145 L 210 140 C 225 125, 215 110, 220 100 C 230 80, 215 60, 190 55 C 175 52, 155 52, 140 55 Z"
          boneType="humerus"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.humerus}
          label="Short, Flanged Power-Cube Humerus"
          detailObj={details.humerus}
        />
      </g>

      {/* 2. RADIUS & LEVER ULNA */}
      <g>
        {/* Short Thick Radius */}
        <BonePath
          path="M 134 155 C 124 155, 120 165, 124 175 L 126 215 C 124 225, 134 230, 144 230 C 154 230, 156 222, 154 215 L 152 175 C 154 165, 146 155, 134 155 Z"
          boneType="radius_ulna"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.radius}
          label="Radius (Short, Heavy Strut)"
          detailObj={details.radius_ulna}
        />
        {/* Ulna with Massive Hypertrophied Olecranon Process */}
        <BonePath
          path="M 195 130 C 182 130, 176 142, 180 155 L 180 215 C 178 225, 186 232, 198 232 C 208 232, 212 225, 210 215 L 212 165 C 218 150, 212 130, 195 130 Z"
          boneType="radius_ulna"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.ulna}
          label="Ulna with Giant Olecranon Lever Arm"
          detailObj={details.radius_ulna}
        />
      </g>

      {/* 3. CARPALS & FALCIFORM SICKLE BONE (Prepollex) */}
      <g transform={`translate(0, ${exp * 0.45})`}>
        {/* Falciform Prepollex (Unique sickle bone widening the spade) */}
        <BonePath
          path="M 95 240 C 85 248, 80 265, 88 280 C 95 292, 106 295, 110 285 C 104 272, 106 256, 112 245 Z"
          boneType="carpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color="#FBBF24"
          label="Falciform Bone (Prepollex - Widens Digging Shovel)"
          detailObj={details.carpals}
        />
        {/* Carpal Transverse Arch */}
        <BonePath
          path="M 120 238 Q 130 232 140 238 Q 142 248 132 252 Q 120 248 120 238 Z
                M 144 238 Q 154 232 164 238 Q 166 248 156 252 Q 144 248 144 238 Z
                M 168 238 Q 178 232 188 238 Q 190 248 180 252 Q 168 248 168 238 Z
                M 192 238 Q 202 232 210 238 Q 212 248 202 252 Q 192 248 192 238 Z"
          boneType="carpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.carpals}
          label="Heavy Ossified Carpal Arch"
          detailObj={details.carpals}
        />
      </g>

      {/* 4. METACARPALS (Thick Heavy Blocks) */}
      <g transform={`translate(0, ${exp * 0.95})`}>
        <BonePath
          path="M 112 258 L 105 295 C 102 302, 115 305, 118 298 L 124 260 Z
                M 130 258 L 128 300 C 126 306, 140 306, 140 300 L 140 258 Z
                M 148 258 L 148 302 C 146 308, 160 308, 160 302 L 160 258 Z
                M 168 258 L 170 300 C 168 306, 182 306, 182 300 L 180 258 Z
                M 188 258 L 194 295 C 192 302, 205 302, 204 295 L 198 258 Z"
          boneType="metacarpals"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.metacarpals}
          label="Heavy Metacarpal Beams (Rays I–V)"
          detailObj={details.metacarpals}
        />
      </g>

      {/* 5. PHALANGES & MASSIVE DIGGING CLAWS */}
      <g transform={`translate(0, ${exp * 1.45})`}>
        {/* Claw I */}
        <BonePath
          path="M 102 306 L 96 340 C 90 370, 75 390, 85 410 C 95 395, 105 365, 114 340 L 116 306 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit I with Curved Shovel Claw"
          detailObj={details.phalanges}
        />
        {/* Claw II */}
        <BonePath
          path="M 126 310 L 124 350 C 120 385, 110 415, 118 435 C 130 415, 138 380, 138 350 L 138 310 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit II Heavy Excavation Claw"
          detailObj={details.phalanges}
        />
        {/* Claw III */}
        <BonePath
          path="M 146 312 L 146 355 C 144 395, 142 425, 150 448 C 158 425, 158 395, 158 355 L 158 312 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit III Primary Soil Gouging Claw"
          detailObj={details.phalanges}
        />
        {/* Claw IV */}
        <BonePath
          path="M 168 310 L 170 350 C 172 385, 178 415, 174 435 C 166 415, 162 380, 160 350 L 160 310 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit IV Excavation Claw"
          detailObj={details.phalanges}
        />
        {/* Claw V */}
        <BonePath
          path="M 192 304 L 194 338 C 198 368, 208 390, 202 410 C 194 392, 186 365, 184 338 L 182 304 Z"
          boneType="phalanges"
          activeFilter={activeFilter}
          selectedBone={selectedBone}
          onHoverBone={onHoverBone}
          onSelectBone={onSelectBone}
          color={c.phalanges}
          label="Digit V Lateral Shovel Claw"
          detailObj={details.phalanges}
        />
      </g>
    </svg>
  );
}

// 6. Insect Wing (Analogous Comparison SVG)
function InsectWingSVG() {
  return (
    <svg viewBox="0 0 340 480" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="chitinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#EC4899" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Insect Wing Cuticular Membrane */}
      <path
        d="M 60 80 C 120 70, 240 90, 300 130 C 320 145, 325 170, 310 195 C 270 250, 180 320, 100 370 C 60 395, 40 370, 45 330 C 50 250, 50 150, 60 80 Z"
        fill="url(#chitinGrad)"
        stroke="#A855F7"
        strokeWidth="2"
      />

      {/* Chitinous Vein Framework (Costa, Subcosta, Radius, Media, Cubitus) */}
      <path
        d="M 60 80 C 130 75, 240 95, 300 130
           M 60 85 C 130 85, 230 110, 285 150
           M 58 110 C 120 120, 200 160, 270 210
           M 55 150 C 110 170, 180 220, 240 280
           M 52 200 C 100 230, 150 280, 190 330
           M 48 270 C 80 300, 110 340, 140 360"
        stroke="#EC4899"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Crossveins network */}
      <path
        d="M 120 77 L 122 86 M 150 79 L 152 90 M 180 82 L 183 95 M 210 86 L 214 103 M 240 93 L 245 113 M 270 105 L 275 130
           M 100 116 L 105 168 M 140 132 L 145 185 M 180 152 L 185 220 M 220 180 L 225 250
           M 80 160 L 85 215 M 115 178 L 120 240 M 150 205 L 155 270"
        stroke="#A855F7"
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />

      {/* Pterostigma (Inertial balance cell at leading edge) */}
      <rect x="250" y="105" width="28" height="12" rx="2" fill="#F59E0B" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="1" />
      <text x="264" y="114" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">STIGMA</text>
    </svg>
  );
}

export default function HomologousLimbsEvolutionSim({ config = {}, onTelemetry }) {
  // Primary Interactive Controls
  const [selectedSpecimenId, setSelectedSpecimenId] = useState('human');
  const [activeBoneFilter, setActiveBoneFilter] = useState('all');
  const [comparisonMode, setComparisonMode] = useState('inspector'); // 'inspector' | 'matrix' | 'analogy'

  // Additional Interactive Parameters
  const [showSilhouette, setShowSilhouette] = useState(true);
  const [explodedOffset, setExplodedOffset] = useState(0); // 0 to 40 px
  const [hoveredBone, setHoveredBone] = useState(null);
  const [selectedBone, setSelectedBone] = useState(null);

  // Checkpoint & Telemetry Tracking
  const [exploredSpecimens, setExploredSpecimens] = useState(new Set(['human']));
  const [exploredBoneFilters, setExploredBoneFilters] = useState(new Set(['all']));
  const [exploredModes, setExploredModes] = useState(new Set(['inspector']));
  const [checkpointVerified, setCheckpointVerified] = useState(false);

  // Quiz State
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const currentSpecimen = SPECIMENS[selectedSpecimenId] || SPECIMENS.human;

  // Track Specimen exploration
  const handleSpecimenSelect = (id) => {
    setSelectedSpecimenId(id);
    setSelectedBone(null);
    setExploredSpecimens((prev) => {
      const next = new Set(prev).add(id);
      checkCheckpointEligibility(next, exploredBoneFilters, exploredModes);
      return next;
    });
  };

  // Track Bone Filter exploration
  const handleFilterSelect = (filterId) => {
    setActiveBoneFilter(filterId);
    if (filterId !== 'all') {
      setSelectedBone(filterId);
    } else {
      setSelectedBone(null);
    }
    setExploredBoneFilters((prev) => {
      const next = new Set(prev).add(filterId);
      checkCheckpointEligibility(exploredSpecimens, next, exploredModes);
      return next;
    });
  };

  // Track Mode change
  const handleModeChange = (mode) => {
    setComparisonMode(mode);
    setExploredModes((prev) => {
      const next = new Set(prev).add(mode);
      checkCheckpointEligibility(exploredSpecimens, exploredBoneFilters, next);
      return next;
    });
  };

  // Verification criteria
  const checkCheckpointEligibility = (specimens, filters, modes) => {
    if (checkpointVerified) return;
    const allSpecimensVisited = Object.keys(SPECIMENS).every((id) => specimens.has(id));
    const multipleFiltersUsed = filters.size >= 4;
    const multipleModesViewed = modes.size >= 2;

    if (allSpecimensVisited && multipleFiltersUsed && multipleModesViewed) {
      setCheckpointVerified(true);
      if (onTelemetry) {
        try {
          onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            simulation: 'homologous_pentadactyl_limb_evolution_3d',
            specimensExplored: Array.from(specimens),
            boneFiltersUsed: Array.from(filters),
            modesExplored: Array.from(modes),
            timestamp: Date.now()
          });
        } catch (e) {
          try {
            onTelemetry({
              event: 'SIMULATION_CHECKPOINT_VERIFIED',
              simulation: 'homologous_pentadactyl_limb_evolution_3d',
              specimensExplored: Array.from(specimens),
              boneFiltersUsed: Array.from(filters),
              modesExplored: Array.from(modes)
            });
          } catch (err) {
            console.warn('Telemetry dispatch error', err);
          }
        }
      }
    }
  };

  // Reset Button (Restores Human vs Bird baseline)
  const handleReset = () => {
    setSelectedSpecimenId('human');
    setActiveBoneFilter('all');
    setSelectedBone(null);
    setHoveredBone(null);
    setComparisonMode('inspector');
    setShowSilhouette(true);
    setExplodedOffset(0);
  };

  // Quiz Answer Selection
  const handleSelectQuizOption = (qId, optionIdx) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    let score = 0;
    KCSE_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (onTelemetry) {
      try {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'homologous_pentadactyl_limb_evolution_3d',
          quizCompleted: true,
          score,
          totalQuestions: KCSE_QUESTIONS.length
        });
      } catch (e) {
        // fallback
      }
    }
  };

  // Render SVG based on specimen ID
  const renderSpecimenSVG = (specId, size = 'full') => {
    const spec = SPECIMENS[specId] || SPECIMENS.human;
    const props = {
      activeFilter: activeBoneFilter,
      selectedBone: selectedBone,
      onHoverBone: setHoveredBone,
      onSelectBone: (boneType) => {
        setSelectedBone((prev) => (prev === boneType ? null : boneType));
        setActiveBoneFilter(boneType);
      },
      showSilhouette: showSilhouette,
      explodedOffset: explodedOffset,
      specimen: spec
    };

    switch (specId) {
      case 'human':
        return <HumanLimbSVG {...props} />;
      case 'bird':
        return <BirdWingSVG {...props} />;
      case 'bat':
        return <BatWingSVG {...props} />;
      case 'whale':
        return <WhaleFlipperSVG {...props} />;
      case 'mole':
        return <MoleForelimbSVG {...props} />;
      default:
        return <HumanLimbSVG {...props} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans p-3 md:p-6 select-none">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 1. Header Bar with KCSE Syllabus Context & Checkpoint Badge */}
        <header className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Form 4 Biology • Topic 2: Evolution
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Comparative Anatomy
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <GitBranch className="w-6 h-6 text-sky-400" />
                Evidence for Evolution: Homologous Limbs
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Explore the vertebrate <strong>Pentadactyl Limb</strong> blueprint inherited from Devonian stem tetrapods, proving <em>Divergent Evolution (Adaptive Radiation)</em> across disparate ecological niches.
              </p>
            </div>

            {/* Checkpoint Status Pill & Reset */}
            <div className="flex items-center gap-3">
              {checkpointVerified ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-lg shadow-emerald-950/50 animate-pulse">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Checkpoint Verified
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Exploration: {exploredSpecimens.size}/5 Specimens</span>
                </div>
              )}

              <button
                onClick={handleReset}
                title="Reset simulation to default Human baseline"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        </header>

        {/* 2. Top-Level Control Panel (Modes & Bone Filters) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Control 3: Comparison Mode Selector */}
          <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
            <label className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5 mb-2.5">
              <Compass className="w-4 h-4 text-sky-400" />
              Comparison Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleModeChange('inspector')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition flex flex-col items-center gap-1 text-center ${
                  comparisonMode === 'inspector'
                    ? 'bg-sky-600 text-white border-sky-400 shadow-lg shadow-sky-900/40'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                }`}
              >
                <ZoomIn className="w-4 h-4" />
                <span>Single Inspector</span>
              </button>

              <button
                onClick={() => handleModeChange('matrix')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition flex flex-col items-center gap-1 text-center ${
                  comparisonMode === 'matrix'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-900/40'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>5-Limb Matrix</span>
              </button>

              <button
                onClick={() => handleModeChange('analogy')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition flex flex-col items-center gap-1 text-center ${
                  comparisonMode === 'analogy'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/40'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                }`}
              >
                <Split className="w-4 h-4" />
                <span>Homology vs Analogy</span>
              </button>
            </div>
          </div>

          {/* Control 2: Homologous Bone Highlight Filter */}
          <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                <Dna className="w-4 h-4 text-emerald-400" />
                Homologous Bone Filter
              </label>
              <span className="text-[11px] text-slate-400">
                Click any bone to isolate across tetrapods
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {BONE_FILTERS.map((bf) => {
                const isActive = activeBoneFilter === bf.id;
                return (
                  <button
                    key={bf.id}
                    onClick={() => handleFilterSelect(bf.id)}
                    className={`py-2 px-1 text-xs font-semibold rounded-xl border transition flex flex-col items-center text-center gap-1 ${
                      isActive
                        ? 'bg-slate-800 border-white text-white shadow-md ring-2'
                        : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    }`}
                    style={isActive ? { borderColor: bf.color, ringColor: bf.color } : {}}
                  >
                    <span
                      className="w-3 h-3 rounded-full shadow"
                      style={{ backgroundColor: bf.color }}
                    />
                    <span className="truncate w-full">{bf.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. MAIN WORKSPACE VIEW (Switched by comparisonMode) */}

        {/* ===================== VIEW 1: SINGLE ANATOMICAL INSPECTOR ===================== */}
        {comparisonMode === 'inspector' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left/Middle Column: Specimen Tabs + Interactive SVG Artboard */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Control 1: Specimen Selector */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-xl flex items-center justify-between gap-1 overflow-x-auto">
                {Object.values(SPECIMENS).map((sp) => {
                  const isSelected = selectedSpecimenId === sp.id;
                  return (
                    <button
                      key={sp.id}
                      onClick={() => handleSpecimenSelect(sp.id)}
                      className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center gap-0.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-900/40'
                          : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{sp.name}</span>
                      <span className={`text-[10px] font-normal ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                        {sp.id === 'human' && 'Grasping'}
                        {sp.id === 'bird' && 'Airfoil'}
                        {sp.id === 'bat' && 'Patagium'}
                        {sp.id === 'whale' && 'Paddle'}
                        {sp.id === 'mole' && 'Digging'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Interactive Vector Anatomy Artboard */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative flex flex-col items-center justify-center min-h-[460px] overflow-hidden">
                
                {/* Background Blueprint Grid */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #38BDF8 1px, transparent 1px), linear-gradient(to bottom, #38BDF8 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                  }}
                />

                {/* Top Artboard Bar: X-Ray Silhouette & Disarticulation Slider */}
                <div className="w-full flex items-center justify-between z-10 mb-2 px-2">
                  <button
                    onClick={() => setShowSilhouette(!showSilhouette)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                      showSilhouette
                        ? 'bg-sky-950/80 border-sky-500/50 text-sky-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {showSilhouette ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>X-Ray Outline</span>
                  </button>

                  <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[11px] text-slate-300 font-medium">Joint Explosion:</span>
                    <input
                      type="range"
                      min="0"
                      max="35"
                      value={explodedOffset}
                      onChange={(e) => setExplodedOffset(Number(e.target.value))}
                      className="w-20 accent-indigo-500 cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-indigo-300 w-5">{explodedOffset}px</span>
                  </div>
                </div>

                {/* Primary SVG Rendering Canvas */}
                <div className="w-full max-w-[340px] h-[400px] flex items-center justify-center z-10">
                  {renderSpecimenSVG(selectedSpecimenId)}
                </div>

                {/* Bottom Bone Hover/Click Legend Indicator */}
                <div className="w-full mt-2 pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-xs z-10 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Inspecting:</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      {hoveredBone ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredBone.color }} />
                          {hoveredBone.label}
                        </>
                      ) : selectedBone ? (
                        <>
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: BONE_COLORS[selectedBone] || '#94A3B8' }}
                          />
                          {BONE_FILTERS.find((f) => f.id === selectedBone)?.label || selectedBone}
                        </>
                      ) : (
                        <span className="text-slate-400 font-normal">Hover or click any bone segment</span>
                      )}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 italic">
                    Ancestral blueprint: 1 Humerus → 2 Radius/Ulna → Carpals → 5 Metacarpals → Phalanges
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Comparative Anatomy Breakdown */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Specimen Profile Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white">{currentSpecimen.name}</h2>
                    <p className="text-xs text-slate-400 italic">{currentSpecimen.taxon}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {currentSpecimen.evolutionaryRole}
                  </span>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] uppercase font-bold text-sky-400 tracking-wider block mb-1">
                    Primary Biomechanical Function:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {currentSpecimen.primaryFunction}
                  </p>
                </div>

                {/* Key Evolutionary Adaptations Checklist */}
                <div>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    KCSE Morphological Adaptations
                  </h3>
                  <ul className="space-y-1.5">
                    {currentSpecimen.keyAdaptations.map((adapt, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                        <span className="text-emerald-400 font-bold mt-0.5">•</span>
                        <span>{adapt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Active Bone Deep-Dive Inspector */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  Homologous Segment Analysis:
                  <span className="text-indigo-300 ml-1">
                    {selectedBone
                      ? BONE_FILTERS.find((f) => f.id === selectedBone)?.label
                      : 'Complete Pentadactyl Plan'}
                  </span>
                </h3>

                {selectedBone && currentSpecimen.boneDetails[selectedBone] ? (
                  <div className="space-y-2.5 text-xs">
                    <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                      <strong className="text-amber-300 block mb-1">Proportions & Morphology:</strong>
                      <p className="text-slate-300 leading-relaxed">
                        {currentSpecimen.boneDetails[selectedBone].proportions}
                      </p>
                    </div>

                    <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                      <strong className="text-sky-300 block mb-1">Evolutionary Modification:</strong>
                      <p className="text-slate-300 leading-relaxed">
                        {currentSpecimen.boneDetails[selectedBone].modifications}
                      </p>
                    </div>

                    <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                      <strong className="text-emerald-300 block mb-1">Functional Biomechanics:</strong>
                      <p className="text-slate-300 leading-relaxed">
                        {currentSpecimen.boneDetails[selectedBone].biomechanics}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs text-slate-400 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <p>
                      The pentadactyl blueprint originated in Devonian lobe-finned fish like <em>Tiktaalik</em> and was passed down to all amphibians, reptiles, birds, and mammals.
                    </p>
                    <p className="text-slate-300">
                      Click any bone filter button above (e.g., <strong>Humerus</strong>, <strong>Carpals</strong>, or <strong>Phalanges</strong>) or click directly on the limb skeleton to inspect detailed mechanical adaptations.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== VIEW 2: 5-LIMB SIDE-BY-SIDE PENTADACTYL MATRIX ===================== */}
        {comparisonMode === 'matrix' && (
          <div className="space-y-6">
            
            {/* Cladogram / Ancestral Root Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Common Ancestral Tetrapod Blueprint (*Tiktaalik* / *Acanthostega*)
                    </h3>
                    <p className="text-xs text-slate-400">
                      All 5 modern forelimbs share identical homologous bones modified by natural selection into specialized tools.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                    Active Bone Highlight: <strong className="text-sky-300">{BONE_FILTERS.find((f) => f.id === activeBoneFilter)?.label}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* 5-Column Side-by-Side Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {Object.values(SPECIMENS).map((sp) => {
                return (
                  <div
                    key={sp.id}
                    onClick={() => {
                      setSelectedSpecimenId(sp.id);
                      setComparisonMode('inspector');
                    }}
                    className="bg-slate-900 border border-slate-800 hover:border-sky-500/60 rounded-2xl p-3 shadow-xl flex flex-col items-center cursor-pointer transition transform hover:-translate-y-1 group"
                  >
                    {/* Header */}
                    <div className="w-full text-center pb-2 border-b border-slate-800 mb-2">
                      <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition">
                        {sp.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {sp.id === 'human' && 'Grasping Dexterity'}
                        {sp.id === 'bird' && 'Airfoil Lift'}
                        {sp.id === 'bat' && 'Flapping Patagium'}
                        {sp.id === 'whale' && 'Steering Paddle'}
                        {sp.id === 'mole' && 'Soil Digging Spade'}
                      </span>
                    </div>

                    {/* SVG Thumbnail */}
                    <div className="w-full h-64 flex items-center justify-center pointer-events-none">
                      {renderSpecimenSVG(sp.id, 'matrix')}
                    </div>

                    {/* Bottom Feature Tag */}
                    <div className="w-full pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 text-center">
                      <span className="text-sky-400 font-semibold group-hover:underline flex items-center justify-center gap-1">
                        Inspect Anatomy <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comparative Summary Matrix Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl overflow-x-auto">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Binary className="w-4 h-4 text-emerald-400" />
                Pentadactyl Homology Comparative Reference Table
              </h3>

              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Bone Segment</th>
                    <th className="py-2.5 px-3">Human Arm</th>
                    <th className="py-2.5 px-3">Bird Wing</th>
                    <th className="py-2.5 px-3">Bat Wing</th>
                    <th className="py-2.5 px-3">Whale Flipper</th>
                    <th className="py-2.5 px-3">Mole Forelimb</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-normal">
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-bold text-sky-400">1. Humerus</td>
                    <td className="py-2.5 px-3">Long, cylindrical; full 360° circumduction</td>
                    <td className="py-2.5 px-3">Pneumatic hollow bone; deltopectoral crest</td>
                    <td className="py-2.5 px-3">Slender, straight; rapid flapping cadence</td>
                    <td className="py-2.5 px-3">Short, massive, flattened rectangular block</td>
                    <td className="py-2.5 px-3">Short, cruciform, massive digging flanges</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">2. Radius & Ulna</td>
                    <td className="py-2.5 px-3">Parallel; enables 180° pronation / supination</td>
                    <td className="py-2.5 px-3">Ulna bowed with quill knobs for feathers</td>
                    <td className="py-2.5 px-3">Radius dominates; ulna vestigial splint</td>
                    <td className="py-2.5 px-3">Broad, flat, immobile parallel hydrofoil plates</td>
                    <td className="py-2.5 px-3">Ulna has giant olecranon process lever</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-bold text-amber-400">3. Carpals</td>
                    <td className="py-2.5 px-3">8 distinct bones in 2 sliding rows</td>
                    <td className="py-2.5 px-3">Reduced to 2 free bones (Radiale & Ulnare)</td>
                    <td className="py-2.5 px-3">Compact, fused wrist anchor pulley</td>
                    <td className="py-2.5 px-3">Mosaic pavement embedded in fibrous cartilage</td>
                    <td className="py-2.5 px-3">Transverse arch + Falciform sickle bone</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-bold text-orange-400">4. Metacarpals</td>
                    <td className="py-2.5 px-3">5 rays; Metacarpal I offset for opposability</td>
                    <td className="py-2.5 px-3">Fused into rigid Carpometacarpus</td>
                    <td className="py-2.5 px-3">Rays II–V ultra-elongated wing struts</td>
                    <td className="py-2.5 px-3">5 short, flattened rectangular rays</td>
                    <td className="py-2.5 px-3">5 short, thick, heavy cylindrical beams</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-bold text-pink-400">5. Phalanges</td>
                    <td className="py-2.5 px-3">14 phalanges (2-3-3-3-3 formula)</td>
                    <td className="py-2.5 px-3">Reduced to 3 digits (I: Alula, II & III)</td>
                    <td className="py-2.5 px-3">Finger joints elongated to spread patagium</td>
                    <td className="py-2.5 px-3">Hyperphalangy (multiplied disc segments)</td>
                    <td className="py-2.5 px-3">Short, wide phalanges + 5 giant digging claws</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================== VIEW 3: HOMOLOGY VS ANALOGY TOGGLE ===================== */}
        {comparisonMode === 'analogy' && (
          <div className="space-y-6">
            
            {/* Introductory Concept Banner */}
            <div className="bg-purple-950/40 border border-purple-800/60 rounded-2xl p-5 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Split className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Divergent Evolution (Homology) vs. Convergent Evolution (Analogy)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A cardinal principle tested in the KCSE syllabus: organisms in similar environments face identical selective pressures (e.g. aerodynamic lift for flight). However, <strong>homologous structures</strong> share a common embryonic blueprint proving common ancestry, whereas <strong>analogous structures</strong> arise independently without shared ancestry.
                  </p>
                </div>
              </div>
            </div>

            {/* Side-by-Side Visual Comparison: Bird/Bat Wing vs Insect Wing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Card: Homologous Vertebrate Wing */}
              <div className="bg-slate-900 border border-sky-500/40 rounded-3xl p-5 shadow-2xl flex flex-col items-center">
                <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Homologous Structure
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">Vertebrate Wing (Bird / Bat)</h4>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">Divergent Evolution</span>
                </div>

                <div className="w-full max-w-[280px] h-72 flex items-center justify-center">
                  <BirdWingSVG
                    activeFilter={activeBoneFilter}
                    selectedBone={null}
                    showSilhouette={true}
                    explodedOffset={0}
                    specimen={SPECIMENS.bird}
                  />
                </div>

                <div className="w-full space-y-2 mt-3 pt-3 border-t border-slate-800 text-xs">
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                    <strong className="text-sky-300 block mb-0.5">Embryonic Origin:</strong>
                    Lateral plate mesoderm forming internal living endoskeletal bones and cartilage.
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                    <strong className="text-emerald-300 block mb-0.5">Evolutionary Meaning:</strong>
                    Proof of common descent from ancestral tetrapods with modified pentadactyl bones.
                  </div>
                </div>
              </div>

              {/* Right Card: Analogous Invertebrate Wing */}
              <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-5 shadow-2xl flex flex-col items-center">
                <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Analogous Structure
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">Insect Wing (Dragonfly / Bee)</h4>
                  </div>
                  <span className="text-xs text-purple-400 font-semibold">Convergent Evolution</span>
                </div>

                <div className="w-full max-w-[280px] h-72 flex items-center justify-center">
                  <InsectWingSVG />
                </div>

                <div className="w-full space-y-2 mt-3 pt-3 border-t border-slate-800 text-xs">
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                    <strong className="text-purple-300 block mb-0.5">Embryonic Origin:</strong>
                    Ectodermal outfoldings of the thoracic dorsal body wall; entirely non-cellular chitin.
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                    <strong className="text-pink-300 block mb-0.5">Evolutionary Meaning:</strong>
                    Zero shared ancestry; evolved independently to solve aerodynamic lift physics.
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Criteria Matrix Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl overflow-x-auto">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Key Distinctions for KCSE Biology Examinations
              </h3>

              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Diagnostic Feature</th>
                    <th className="py-2.5 px-3">Homologous Structures (e.g. Bat & Human)</th>
                    <th className="py-2.5 px-3">Analogous Structures (e.g. Bat & Insect)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-semibold text-white">Structural Blueprint</td>
                    <td className="py-2.5 px-3 text-emerald-300">Identical basic anatomical plan (1-2-carpals-metacarpals-phalanges)</td>
                    <td className="py-2.5 px-3 text-purple-300">Totally distinct blueprints (bones vs. chitinous venation)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-semibold text-white">Embryological Origin</td>
                    <td className="py-2.5 px-3">Develop from the same embryonic germ layer (mesoderm)</td>
                    <td className="py-2.5 px-3">Develop from different embryonic germ layers (mesoderm vs. ectoderm)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-semibold text-white">Organ Function</td>
                    <td className="py-2.5 px-3">Adapted for different ecological functions (grasp, swim, dig, fly)</td>
                    <td className="py-2.5 px-3">Adapted for the same identical function (aerial flight)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-semibold text-white">Evolutionary Pattern</td>
                    <td className="py-2.5 px-3 font-bold text-sky-400">Divergent Evolution (Adaptive Radiation)</td>
                    <td className="py-2.5 px-3 font-bold text-pink-400">Convergent Evolution</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-semibold text-white">Proof of Common Ancestor</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">YES — Direct evidence of shared phylogeny</td>
                    <td className="py-2.5 px-3 font-bold text-red-400">NO — Only proves similar environmental selection</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. KCSE High-Yield Interactive Challenge Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Self-Assessment Checkpoint
                </span>
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                KCSE Evolutionary Biology Knowledge Challenge
              </h3>
              <p className="text-xs text-slate-400">
                Test your mastery of homologous limbs, adaptive radiation, and analogous structures.
              </p>
            </div>

            {quizSubmitted && (
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs text-slate-400">Your Score:</div>
                  <div className="text-sm font-bold text-white">
                    {quizScore} / {KCSE_QUESTIONS.length} ({Math.round((quizScore / KCSE_QUESTIONS.length) * 100)}%)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Question Cards */}
          <div className="space-y-6">
            {KCSE_QUESTIONS.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === q.correctIndex;

              return (
                <div key={q.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <h4 className="text-xs md:text-sm font-semibold text-slate-200 leading-relaxed">
                      {q.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pl-9">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                        } else if (isChosen && optIdx !== q.correctIndex) {
                          btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                        } else {
                          btnStyle = 'bg-slate-900/50 border-slate-800/50 text-slate-400';
                        }
                      } else if (isChosen) {
                        btnStyle = 'bg-sky-950/80 border-sky-400 text-sky-200 font-semibold ring-1 ring-sky-400';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectQuizOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-start gap-2.5 ${btnStyle}`}
                        >
                          <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Post-submission rationale */}
                  {quizSubmitted && (
                    <div className="pl-9 pt-2">
                      <div className={`p-3 rounded-xl text-xs border ${
                        isCorrect
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              Correct!
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-400" />
                              Incorrect
                            </>
                          )}
                        </div>
                        <p className="leading-relaxed text-slate-300">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quiz Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              {Object.keys(userAnswers).length} of {KCSE_QUESTIONS.length} answered
            </span>

            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Answers & Check Rationale
              </button>
            ) : (
              <button
                onClick={() => {
                  setUserAnswers({});
                  setQuizSubmitted(false);
                  setQuizScore(0);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                Retake Challenge
              </button>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
