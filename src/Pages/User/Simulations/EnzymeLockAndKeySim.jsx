import React, { useState, useEffect } from 'react';
import { KeyRound, CheckCircle2, XCircle, RotateCcw, Sparkles, ArrowRight, ShieldAlert, Zap } from 'lucide-react';

export default function EnzymeLockAndKeySim({ config = {}, onTelemetry }) {
  // Primary Variable: Selected Substrate
  const [selectedSubstrateId, setSelectedSubstrateId] = useState('sucrose');
  const [reactionStage, setReactionStage] = useState('approach'); // approach -> binding -> catalysis -> products
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasCompletedReaction, setHasCompletedReaction] = useState(false);

  const substrates = [
    {
      id: 'sucrose',
      name: 'Sucrose (Disaccharide)',
      shape: 'complementary',
      isMatch: true,
      color: '#10B981', // emerald
      description: 'Contains α-D-glucopyranosyl and β-D-fructofuranoside linked via an glycosidic bond. Its precise 3D stereochemistry matches the active site.',
      formula: 'C₁₂H₂₂O₁₁',
      products: 'Glucose (C₆H₁₂O₆) + Fructose (C₆H₁₂O₆)'
    },
    {
      id: 'dipeptide',
      name: 'Dipeptide (Protein Fragment)',
      shape: 'mismatch_angular',
      isMatch: false,
      color: '#F59E0B', // amber
      description: 'Contains rigid planar peptide (-CONH-) bonds with bulky amino acid side chains that steric-clash with the active site pockets.',
      formula: 'Gly-Ala Dipeptide',
      products: 'None — No binding or catalytic cleavage occurs.'
    },
    {
      id: 'triglyceride',
      name: 'Triglyceride (Lipid Ester)',
      shape: 'mismatch_bulky',
      isMatch: false,
      color: '#EC4899', // pink
      description: 'A large, non-polar hydrophobic glycerol ester with three long hydrocarbon tails; far too bulky to enter the catalytic cleft.',
      formula: 'Glycerol Tristearate',
      products: 'None — Repelled by active site hydrophilic residues.'
    }
  ];

  const currentSubstrate = substrates.find((s) => s.id === selectedSubstrateId) || substrates[0];

  useEffect(() => {
    // Reset reaction stage when substrate changes
    setReactionStage('approach');
    setIsAnimating(false);
  }, [selectedSubstrateId]);

  const runReactionCycle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setReactionStage('approach');

    setTimeout(() => {
      setReactionStage('binding');
      if (!currentSubstrate.isMatch) {
        setIsAnimating(false);
        return;
      }
      setTimeout(() => {
        setReactionStage('catalysis');
        setTimeout(() => {
          setReactionStage('products');
          setIsAnimating(false);
          setHasCompletedReaction(true);
          onTelemetry && onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
            simulation: 'enzyme_lock_and_key',
            substrate: currentSubstrate.id,
            success: true
          });
        }, 1400);
      }, 1200);
    }, 800);
  };

  const handleReset = () => {
    setReactionStage('approach');
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              Enzyme Specificity: Lock and Key Hypothesis
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Grade 10 Biology • Topic: Chemicals of Life (Sucrase Enzyme Model)
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Substrate Selector Bar */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Step 1: Choose a Candidate Substrate to Test
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {substrates.map((sub) => {
            const isSelected = sub.id === selectedSubstrateId;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubstrateId(sub.id)}
                disabled={isAnimating}
                className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80'
                } ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white">{sub.name}</span>
                  {sub.isMatch ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Target Match
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Non-Target
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-1">{sub.formula}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* SVG Biological Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-950 p-5 rounded-2xl border border-slate-800 relative min-h-[380px] overflow-hidden">
          {/* Reaction status notification badge */}
          <div className="absolute top-4 left-4 z-10">
            {reactionStage === 'approach' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-300 text-xs font-semibold">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Substrate approaching active site...
              </div>
            )}
            {reactionStage === 'binding' && currentSubstrate.isMatch && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Enzyme-Substrate (E-S) Complex Formed!
              </div>
            )}
            {reactionStage === 'binding' && !currentSubstrate.isMatch && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-600/50 text-rose-300 text-xs font-semibold">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                Steric Clash: Geometric mismatch! Cannot bind.
              </div>
            )}
            {reactionStage === 'catalysis' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-600/50 text-amber-300 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                Catalytic Hydrolysis of Glycosidic Bond...
              </div>
            )}
            {reactionStage === 'products' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-600/50 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Products Released! Enzyme Unchanged.
              </div>
            )}
          </div>

          {/* SVG Graphic */}
          <svg viewBox="0 0 500 320" className="w-full max-w-[480px] h-auto select-none">
            <defs>
              {/* Enzyme Gradient */}
              <linearGradient id="enzymeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>
              <linearGradient id="sucroseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="glucoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
              <linearGradient id="fructoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Grid Pattern */}
            <g opacity="0.1">
              <path d="M 0 50 L 500 50 M 0 100 L 500 100 M 0 150 L 500 150 M 0 200 L 500 200 M 0 250 L 500 250" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M 100 0 L 100 320 M 200 0 L 200 320 M 300 0 L 300 320 M 400 0 L 400 320" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
            </g>

            {/* ENZYME BODY (Large Globular Protein Macromolecule) */}
            {/* Positioned at bottom center with active site notch on top */}
            <g transform="translate(100, 150)">
              {/* Enzyme Outline with precise notch */}
              {/* Active site notch consists of: Left semicircular socket + Right triangular peg socket */}
              <path
                d="M 20 50 
                   C 20 0, 80 0, 100 20 
                   C 110 30, 115 50, 125 50 
                   A 25 25 0 0 1 175 50 
                   L 190 20 
                   L 210 50 
                   C 220 50, 230 30, 240 20
                   C 260 0, 310 0, 310 60
                   C 310 130, 290 145, 230 145
                   L 70 145
                   C 10 145, 20 100, 20 50 Z"
                fill="url(#enzymeGrad)"
                stroke="#60A5FA"
                strokeWidth="2.5"
                filter="drop-shadow(0px 8px 16px rgba(30, 58, 138, 0.4))"
              />

              {/* Active site cleft boundary glow */}
              <path
                d="M 125 50 A 25 25 0 0 1 175 50 L 190 20 L 210 50"
                fill="none"
                stroke="#93C5FD"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* Labels inside Enzyme */}
              <text x="165" y="110" fill="#E2E8F0" fontSize="13" fontWeight="bold" textAnchor="middle">
                SUCRASE ENZYME
              </text>
              <text x="165" y="126" fill="#93C5FD" fontSize="9.5" textAnchor="middle" letterSpacing="0.5">
                (Biological Catalyst • Unaltered)
              </text>

              {/* Active Site Pointer Label */}
              <line x1="80" y1="20" x2="135" y2="45" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="50" y="18" fill="#FDE047" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                Active Site
              </text>
            </g>

            {/* SUBSTRATES / PRODUCTS DYNAMICS */}
            {/* 1. SUCROSE (TARGET MATCH) */}
            {selectedSubstrateId === 'sucrose' && (
              <>
                {/* APPROACH STAGE */}
                {reactionStage === 'approach' && (
                  <g transform="translate(210, 45)" className="transition-all duration-500">
                    <path
                      d="M 15 35 A 24 24 0 0 0 65 35 L 80 5 L 100 35 L 105 10 C 105 0, 80 0, 60 5 C 40 0, 10 0, 15 35 Z"
                      fill="url(#sucroseGrad)"
                      stroke="#A7F3D0"
                      strokeWidth="2"
                    />
                    <text x="58" y="22" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Sucrose
                    </text>
                  </g>
                )}

                {/* BINDING & CATALYSIS (LOCKED IN ACTIVE SITE) */}
                {(reactionStage === 'binding' || reactionStage === 'catalysis') && (
                  <g transform="translate(225, 150)" className="transition-all duration-300">
                    <path
                      d="M 0 50 A 25 25 0 0 0 50 50 L 65 20 L 85 50 L 90 25 C 90 15, 75 15, 55 18 C 35 15, -5 15, 0 50 Z"
                      fill={reactionStage === 'catalysis' ? '#F59E0B' : 'url(#sucroseGrad)'}
                      stroke={reactionStage === 'catalysis' ? '#FDE047' : '#A7F3D0'}
                      strokeWidth="2.5"
                    />
                    <text x="45" y="36" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                      {reactionStage === 'catalysis' ? 'E-S Complex (Cleaving)' : 'E-S Complex'}
                    </text>
                    {reactionStage === 'catalysis' && (
                      <circle cx="58" cy="35" r="14" fill="#FEF08A" opacity="0.4" filter="url(#glowEffect)" />
                    )}
                  </g>
                )}

                {/* PRODUCTS RELEASED */}
                {reactionStage === 'products' && (
                  <>
                    {/* Glucose Product floating up-left */}
                    <g transform="translate(160, 50)" className="animate-fade-in">
                      <path
                        d="M 5 35 A 22 22 0 0 0 45 35 L 45 15 C 45 5, 5 5, 5 35 Z"
                        fill="url(#glucoseGrad)"
                        stroke="#93C5FD"
                        strokeWidth="2"
                      />
                      <text x="25" y="24" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                        Glucose
                      </text>
                    </g>
                    {/* Fructose Product floating up-right */}
                    <g transform="translate(290, 40)" className="animate-fade-in">
                      <polygon points="10,35 25,5 45,35" fill="url(#fructoseGrad)" stroke="#C4B5FD" strokeWidth="2" />
                      <text x="27" y="26" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                        Fructose
                      </text>
                    </g>
                  </>
                )}
              </>
            )}

            {/* 2. DIPEPTIDE (MISMATCH) */}
            {selectedSubstrateId === 'dipeptide' && (
              <g
                transform={
                  reactionStage === 'binding'
                    ? 'translate(235, 110) rotate(-15)'
                    : 'translate(225, 45)'
                }
                className="transition-all duration-500"
              >
                {/* Rectangular rigid blocks that cannot fit the curve */}
                <rect x="0" y="10" width="40" height="25" rx="3" fill="#F59E0B" stroke="#FDE68A" strokeWidth="2" />
                <rect x="35" y="0" width="45" height="30" rx="3" fill="#D97706" stroke="#FDE68A" strokeWidth="2" />
                <text x="40" y="22" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  Dipeptide
                </text>
                {reactionStage === 'binding' && (
                  <g transform="translate(30, 40)">
                    <circle cx="10" cy="5" r="10" fill="#EF4444" opacity="0.9" />
                    <text x="10" y="9" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">✕</text>
                  </g>
                )}
              </g>
            )}

            {/* 3. TRIGLYCERIDE (MISMATCH) */}
            {selectedSubstrateId === 'triglyceride' && (
              <g
                transform={
                  reactionStage === 'binding'
                    ? 'translate(220, 100) rotate(12)'
                    : 'translate(220, 45)'
                }
                className="transition-all duration-500"
              >
                {/* Bulky spherical clusters with long wavy tails */}
                <circle cx="20" cy="20" r="18" fill="#EC4899" stroke="#FBCFE8" strokeWidth="2" />
                <circle cx="50" cy="15" r="16" fill="#DB2777" stroke="#FBCFE8" strokeWidth="2" />
                <circle cx="45" cy="40" r="14" fill="#BE185D" stroke="#FBCFE8" strokeWidth="2" />
                <text x="35" y="24" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Triglyceride
                </text>
                {reactionStage === 'binding' && (
                  <g transform="translate(35, 45)">
                    <circle cx="0" cy="5" r="10" fill="#EF4444" opacity="0.9" />
                    <text x="0" y="9" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">✕</text>
                  </g>
                )}
              </g>
            )}
          </svg>

          {/* Action Trigger Button */}
          <div className="w-full flex justify-center mt-3">
            <button
              onClick={runReactionCycle}
              disabled={isAnimating}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                isAnimating
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40 hover:scale-[1.02]'
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              {reactionStage === 'products'
                ? 'Test Again / Repeat Cycle'
                : 'Simulate Substrate Binding'}
            </button>
          </div>
        </div>

        {/* Science Info & Biological Observations */}
        <div className="lg:col-span-4 flex flex-col gap-3 justify-between">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Biological Mechanism
            </h3>
            
            <div className="text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-white mb-1">{currentSubstrate.name}:</p>
              {currentSubstrate.description}
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
              <span className="font-bold text-slate-400 block mb-1">Resulting Products:</span>
              <span className={currentSubstrate.isMatch ? 'text-emerald-300 font-medium' : 'text-slate-500'}>
                {currentSubstrate.products}
              </span>
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/70 text-xs text-slate-300 flex flex-col gap-2">
            <h4 className="font-bold text-slate-200">The Lock and Key Principles:</h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
              <li><strong className="text-slate-200">Active Site:</strong> A specific 3D cleft where catalytic amino acid residues bind only complementary substrates.</li>
              <li><strong className="text-slate-200">High Specificity:</strong> One enzyme catalyzes only one specific biochemical reaction.</li>
              <li><strong className="text-slate-200">Enzyme Recycled:</strong> After releasing products, the enzyme remains completely unchanged and ready to bind another substrate molecule.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
