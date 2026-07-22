import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle2, Target, Plus, Sparkles, Trash2 } from 'lucide-react';

// Salt definitions with simple math engine parameters
const SALTS = {
  nacl: {
    key: 'nacl',
    name: 'Table Salt (NaCl)',
    emoji: '🧂',
    label: 'Soluble',
    labelColor: 'bg-blue-500 text-white',
    headerColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgAccent: 'rgba(59, 130, 246, 0.12)',
    lineColor: '#3B82F6',
    // Max solubility at 25°C: ~36 g per 100 mL water
    maxSolubilityAt25: 36.0,
    // Solubility increases with temperature (rough linear approximation)
    tempCoefficient: 0.12, // +0.12 g per °C above 25°C
    ionColor1: '#60A5FA', // Na+ (blue)
    ionLabel1: 'Na⁺',
    ionColor2: '#34D399', // Cl- (green)
    ionLabel2: 'Cl⁻',
    description: 'Highly soluble. Dissolves fully into Na⁺ and Cl⁻ ions, leaving the water clear.',
  },
  agcl: {
    key: 'agcl',
    name: 'Silver Chloride (AgCl)',
    emoji: '⚪',
    label: 'Insoluble',
    labelColor: 'bg-slate-500 text-white',
    headerColor: 'text-slate-300',
    borderColor: 'border-slate-400/30',
    bgAccent: 'rgba(148, 163, 184, 0.12)',
    lineColor: '#94A3B8',
    // Max solubility at 25°C: ~0.0002 g per 100 mL (practically insoluble)
    maxSolubilityAt25: 0.0002,
    tempCoefficient: 0.000008,
    ionColor1: '#C4B5FD', // Ag+ (violet)
    ionLabel1: 'Ag⁺',
    ionColor2: '#94A3B8', // Cl- (slate)
    ionLabel2: 'Cl⁻',
    description: 'Practically insoluble. Forms a white solid precipitate at the bottom of the vessel.',
  },
};

export default function SaltSolubilitySim({ config = {}, onTelemetry }) {
  const [saltKey, setSaltKey] = useState('nacl');
  const [addedMass, setAddedMass] = useState(0); // grams
  const [temperature, setTemperature] = useState(25); // °C
  const [missionAchieved, setMissionAchieved] = useState(false);

  const salt = SALTS[saltKey];
  const maxMass = 10; // grams (slider max)

  // Solubility adjusted for temperature
  const maxSolubility = useMemo(() => {
    const tempDelta = Math.max(0, temperature - 25);
    return Math.min(
      maxMass,
      salt.maxSolubilityAt25 + salt.tempCoefficient * tempDelta
    );
  }, [salt, temperature]);

  // Precipitate math engine
  const dissolvedMass = useMemo(() => Math.min(addedMass, maxSolubility), [addedMass, maxSolubility]);
  const precipitateMass = useMemo(() => Math.max(0, addedMass - maxSolubility), [addedMass, maxSolubility]);
  const dissolvedPercent = addedMass > 0 ? (dissolvedMass / addedMass) * 100 : 0;
  const hasPrecipitate = precipitateMass > 0.00001;

  const saturationState = useMemo(() => {
    if (addedMass === 0) return { label: 'Empty Beaker', color: 'text-slate-400' };
    if (!hasPrecipitate) return { label: 'Unsaturated — Fully Dissolved', color: 'text-blue-400' };
    return { label: 'Saturated — Precipitate Formed', color: 'text-amber-400' };
  }, [addedMass, hasPrecipitate]);

  // Mission: add AgCl and observe precipitate
  useEffect(() => {
    const missionMet = saltKey === 'agcl' && hasPrecipitate && !missionAchieved;
    if (missionMet) {
      setMissionAchieved(true);
      if (typeof onTelemetry === 'function') {
        onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
          simulation: 'chem_salts_solubility_precipitation',
          salt: saltKey,
          addedMass,
          precipitateMass: Number(precipitateMass.toFixed(4)),
        });
      }
    }
  }, [saltKey, hasPrecipitate, missionAchieved, addedMass, precipitateMass, onTelemetry]);

  // Reset added mass when switching salts
  const handleSaltChange = (key) => {
    setSaltKey(key);
    setAddedMass(0);
  };

  const handleAddSpoonful = () => setAddedMass((m) => Math.min(maxMass, parseFloat((m + 1).toFixed(1))));
  const handleReset = () => setAddedMass(0);

  // Particle count for visual (dissolved only, capped at 18)
  const ionCount = Math.round(Math.min(18, (dissolvedMass / Math.max(maxSolubility, 0.0001)) * 18));

  // Precipitate pile height (px visual, max 50px at 10g)
  const pileHeight = Math.min(60, (precipitateMass / maxMass) * 72);
  const pileWidth = Math.min(140, 60 + (precipitateMass / maxMass) * 80);

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto p-2 sm:p-4 bg-white rounded-3xl">

      {/* MISSION BANNER */}
      {!missionAchieved && (
        <div className="p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-custom-orange text-white">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-100 text-orange-800">
                Mission Challenge
              </span>
              <p className="text-xs sm:text-sm font-semibold mt-1 text-gray-800">
                Select Silver Chloride (AgCl) and add 2 spoonfuls. What happens to the salt?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SALT CHOICE PILLS */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-gray-600">Choose Salt Type</label>
        <div className="grid grid-cols-2 gap-3 bg-gray-100 p-1.5 rounded-2xl">
          {Object.values(SALTS).map((s) => (
            <button
              key={s.key}
              onClick={() => handleSaltChange(s.key)}
              className={`py-3 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer text-left flex flex-col gap-0.5 ${
                saltKey === s.key ? 'bg-white shadow-md border border-gray-200' : 'text-gray-600 hover:bg-white/60'
              }`}
            >
              <span className="text-sm">{s.emoji} {s.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold self-start mt-0.5 ${s.labelColor}`}>
                {s.label}
              </span>
              <span className="text-[10px] text-gray-500 font-normal mt-0.5 leading-tight">{s.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CONTROLS: ADD SALT + TEMPERATURE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Add Salt Controls */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-gray-600">Amount Added</label>
            <span className="font-mono text-sm font-extrabold text-custom-blue bg-white px-2.5 py-0.5 rounded-xl border border-blue-200">
              {addedMass.toFixed(1)} g
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={maxMass}
            step="0.1"
            value={addedMass}
            onChange={(e) => setAddedMass(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-custom-orange"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddSpoonful}
              disabled={addedMass >= maxMass}
              className="flex-1 flex items-center justify-center gap-1.5 bg-custom-orange text-white py-2.5 px-3 rounded-xl font-bold text-xs shadow hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Spoonful (+1 g)
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
              title="Reset"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Temperature Control */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-gray-600">Water Temperature</label>
            <span className="font-mono text-sm font-extrabold text-red-600 bg-white px-2.5 py-0.5 rounded-xl border border-red-200">
              {temperature}°C
            </span>
          </div>
          <input
            type="range"
            min="25"
            max="80"
            step="1"
            value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex justify-between text-[10px] font-medium text-slate-500">
            <span>25°C (Room Temp)</span>
            <span>80°C (Hot)</span>
          </div>
          {saltKey === 'nacl' && temperature > 40 && (
            <p className="text-[10px] text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-lg">
              ↑ Heating increases NaCl solubility to {maxSolubility.toFixed(1)} g
            </p>
          )}
        </div>
      </div>

      {/* INTERACTIVE BEAKER STAGE */}
      <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 text-white shadow-xl">
        {/* Beaker Header Status */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-base font-extrabold ${salt.headerColor}`}>{salt.emoji} {salt.name}</h3>
            <p className={`text-xs font-semibold mt-0.5 ${saturationState.color}`}>{saturationState.label}</p>
          </div>
          <div className="flex gap-3 text-right">
            <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <p className="text-[9px] font-mono text-slate-400 uppercase block mb-0.5">💧 Dissolved</p>
              <p className="font-mono text-sm font-extrabold text-blue-300">
                {dissolvedMass < 0.001 ? '0.00 g' : dissolvedMass.toFixed(2)} g
              </p>
            </div>
            <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <p className="text-[9px] font-mono text-slate-400 uppercase block mb-0.5">⏳ Precipitate</p>
              <p className={`font-mono text-sm font-extrabold ${hasPrecipitate ? 'text-amber-400' : 'text-slate-500'}`}>
                {precipitateMass < 0.001 ? '0.00 g' : precipitateMass.toFixed(2)} g
              </p>
            </div>
          </div>
        </div>

        {/* SVG Beaker Vessel */}
        <div className="flex justify-center">
          <svg className="w-full max-w-sm h-56" viewBox="0 0 260 200">
            {/* Water body */}
            <rect x="30" y="30" width="200" height="145" rx="4" fill={addedMass > 0 ? (hasPrecipitate ? 'rgba(148,163,184,0.25)' : `rgba(59,130,246,0.18)`) : 'rgba(100,116,139,0.10)'} />

            {/* Water surface line */}
            <line x1="30" y1="30" x2="230" y2="30" stroke={hasPrecipitate ? '#94A3B8' : '#3B82F6'} strokeWidth="2" strokeDasharray="4 3" />

            {/* Beaker walls */}
            <rect x="28" y="28" width="204" height="148" rx="6" fill="none" stroke="#475569" strokeWidth="2.5" />

            {/* Dissolved Particles (Floating Ions) */}
            {addedMass > 0 && !hasPrecipitate &&
              Array.from({ length: Math.min(ionCount, 18) }).map((_, i) => {
                const row = Math.floor(i / 6);
                const col = i % 6;
                const cx = 52 + col * 30 + (row % 2 === 0 ? 0 : 12);
                const cy = 55 + row * 30;
                const isIon1 = i % 2 === 0;
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="7" fill={isIon1 ? salt.ionColor1 : salt.ionColor2} opacity="0.85" />
                    <text x={cx} y={cy + 3} textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">
                      {isIon1 ? salt.ionLabel1 : salt.ionLabel2}
                    </text>
                  </g>
                );
              })
            }

            {/* AgCl: A mix — few dissolved, rest shown sinking as dots */}
            {addedMass > 0 && hasPrecipitate && dissolvedMass > 0 && (
              <g opacity="0.5">
                <circle cx="60" cy="50" r="5" fill={salt.ionColor1} />
                <circle cx="80" cy="65" r="5" fill={salt.ionColor2} />
              </g>
            )}

            {/* Sinking particles (AgCl visual: dots falling to bottom) */}
            {hasPrecipitate && (
              <g>
                <circle cx="130" cy="80" r="4" fill="#E2E8F0" opacity="0.5" />
                <circle cx="155" cy="100" r="4" fill="#CBD5E1" opacity="0.5" />
                <circle cx="100" cy="110" r="4" fill="#E2E8F0" opacity="0.5" />
              </g>
            )}

            {/* Precipitate Pile at Bottom */}
            {hasPrecipitate && (
              <g>
                {/* Pile shape (rounded ellipse pile) */}
                <ellipse
                  cx="130"
                  cy={175 - pileHeight / 3}
                  rx={pileWidth / 2}
                  ry={Math.max(8, pileHeight / 2)}
                  fill="#E2E8F0"
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                />
                <text x="130" y={177 - pileHeight / 3 + 4} textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">
                  PRECIPITATE
                </text>
                {/* Pile surface texture */}
                <ellipse cx="130" cy={175 - pileHeight / 3 - pileHeight / 4} rx={pileWidth / 2 - 6} ry="4" fill="rgba(255,255,255,0.35)" />
              </g>
            )}

            {/* Bottom of beaker */}
            <line x1="28" y1="176" x2="232" y2="176" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Dissolution Progress Bar */}
        {addedMass > 0 && (
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Dissolved: {dissolvedPercent.toFixed(1)}%</span>
              <span>Total Added: {addedMass.toFixed(1)} g</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${dissolvedPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* LEGEND */}
      <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-around gap-3 text-xs text-slate-700 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-400 inline-block" />
          <span>Dissolved Ions (Free in solution)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-3 rounded-full bg-slate-300 inline-block" />
          <span>Solid Precipitate (Undissolved)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
          <span>Saturated State</span>
        </div>
      </div>
    </div>
  );
}
