import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, Activity, Sparkles } from 'lucide-react';

export default function CombinationalLogicAdderSim({ config = {}, onTelemetry }) {
  const [adderMode, setAdderMode] = useState('half'); // 'half' | 'full'
  const [bitA, setBitA] = useState(1);
  const [bitB, setBitB] = useState(1);
  const [carryIn, setCarryIn] = useState(0);
  const [userAns, setUserAns] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  // Binary Arithmetic Logic:
  // Half Adder: Sum = A XOR B, Carry = A AND B
  // Full Adder: Sum = A XOR B XOR Cin, CarryOut = (A AND B) OR (Cin AND (A XOR B))
  let sumBit = 0;
  let carryOutBit = 0;

  if (adderMode === 'half') {
    sumBit = bitA ^ bitB;
    carryOutBit = bitA & bitB;
  } else {
    const halfSum = bitA ^ bitB;
    sumBit = halfSum ^ carryIn;
    carryOutBit = (bitA & bitB) | (carryIn & halfSum);
  }

  const decimalSum = (carryOutBit << 1) | sumBit;

  const handleReset = () => {
    setAdderMode('half');
    setBitA(1);
    setBitB(1);
    setCarryIn(0);
    setQuizStatus(null);
    setUserAns('');
  };

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const clean = userAns.trim();
    // Question: For 1 + 1 in a half-adder, what is (Carry, Sum) in binary? Answer: 10
    if (clean === '10' || clean === '1 0' || clean === 'C=1, S=0') {
      setQuizStatus('correct');
      if (onTelemetry) onTelemetry('adder_quiz_correct', { problem: 'binary_sum' });
    } else {
      setQuizStatus('incorrect');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              PHYSICS FORM 4 • TOPIC 11
            </span>
            <span className="text-xs text-slate-400 font-mono">Digital Computing Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            Combinational Logic & Binary Half-Adder / Full-Adder Circuit
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Adder
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
        {[
          { id: 'half', title: 'Binary Half-Adder (2 Bits)', desc: 'XOR gate (Sum S) + AND gate (Carry C)' },
          { id: 'full', title: 'Binary Full-Adder (3 Bits)', desc: 'Adds A + B + Carry_in using 2 Half-Adders & OR gate' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setAdderMode(m.id)}
            className={`text-left p-3 rounded-2xl border transition-all ${
              adderMode === m.id
                ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-950/50 text-white'
                : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-400'
            }`}
          >
            <div className="text-xs font-bold text-slate-200">{m.title}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Logic Architecture Diagram (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Gate Network & Signal Propagation
            </span>
            <span className="font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-lg">
              Binary Result: {carryOutBit}{sumBit}₂ (Decimal: {decimalSum})
            </span>
          </div>

          {/* SVG Adder Schematic */}
          <div className="w-full h-[250px] bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
            {adderMode === 'half' ? (
              <svg viewBox="0 0 480 220" className="w-full h-full">
                {/* Half Adder Schematic */}
                <line x1="30" y1="50" x2="160" y2="50" stroke={bitA ? '#22c55e' : '#475569'} strokeWidth="3" />
                <text x="25" y="54" fill={bitA ? '#4ade80' : '#94a3b8'} fontSize="11" fontWeight="bold" textAnchor="end">
                  A ({bitA})
                </text>
                <line x1="30" y1="90" x2="160" y2="90" stroke={bitB ? '#22c55e' : '#475569'} strokeWidth="3" />
                <text x="25" y="94" fill={bitB ? '#4ade80' : '#94a3b8'} fontSize="11" fontWeight="bold" textAnchor="end">
                  B ({bitB})
                </text>

                {/* Taps connecting into lower AND gate */}
                <line x1="90" y1="50" x2="90" y2="150" stroke={bitA ? '#22c55e' : '#475569'} strokeWidth="2.5" />
                <line x1="90" y1="150" x2="160" y2="150" stroke={bitA ? '#22c55e' : '#475569'} strokeWidth="2.5" />
                <line x1="120" y1="90" x2="120" y2="180" stroke={bitB ? '#22c55e' : '#475569'} strokeWidth="2.5" />
                <line x1="120" y1="180" x2="160" y2="180" stroke={bitB ? '#22c55e' : '#475569'} strokeWidth="2.5" />

                {/* XOR Gate (Sum Generator) */}
                <rect x="160" y="40" width="90" height="60" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                <text x="205" y="75" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                  XOR
                </text>

                {/* AND Gate (Carry Generator) */}
                <rect x="160" y="135" width="90" height="60" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                <text x="205" y="170" fill="#f59e0b" fontSize="13" fontWeight="bold" textAnchor="middle">
                  AND
                </text>

                {/* Output Lines */}
                <line x1="250" y1="70" x2="380" y2="70" stroke={sumBit ? '#4ade80' : '#475569'} strokeWidth="3" />
                <text x="390" y="74" fill={sumBit ? '#4ade80' : '#94a3b8'} fontSize="11" fontWeight="bold">
                  SUM (S) = {sumBit}
                </text>

                <line x1="250" y1="165" x2="380" y2="165" stroke={carryOutBit ? '#f59e0b' : '#475569'} strokeWidth="3" />
                <text x="390" y="169" fill={carryOutBit ? '#f59e0b' : '#94a3b8'} fontSize="11" fontWeight="bold">
                  CARRY (C) = {carryOutBit}
                </text>
              </svg>
            ) : (
              <svg viewBox="0 0 480 220" className="w-full h-full">
                {/* Full Adder Composite Schematic */}
                {/* Inputs A, B, Cin */}
                <line x1="20" y1="45" x2="80" y2="45" stroke={bitA ? '#22c55e' : '#475569'} strokeWidth="2.5" />
                <text x="15" y="49" fill={bitA ? '#4ade80' : '#94a3b8'} fontSize="10" fontWeight="bold" textAnchor="end">A({bitA})</text>
                <line x1="20" y1="75" x2="80" y2="75" stroke={bitB ? '#22c55e' : '#475569'} strokeWidth="2.5" />
                <text x="15" y="79" fill={bitB ? '#4ade80' : '#94a3b8'} fontSize="10" fontWeight="bold" textAnchor="end">B({bitB})</text>
                <line x1="20" y1="150" x2="220" y2="150" stroke={carryIn ? '#22c55e' : '#475569'} strokeWidth="2.5" />
                <text x="15" y="154" fill={carryIn ? '#4ade80' : '#94a3b8'} fontSize="10" fontWeight="bold" textAnchor="end">Cin({carryIn})</text>

                {/* Half Adder 1 Box */}
                <rect x="80" y="30" width="80" height="65" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                <text x="120" y="65" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">HA 1</text>

                {/* HA1 Intermediate Outputs: Sum1 to HA2, Carry1 to OR gate */}
                <line x1="160" y1="48" x2="220" y2="48" stroke={(bitA ^ bitB) ? '#4ade80' : '#475569'} strokeWidth="2.5" />
                <text x="190" y="43" fill="#94a3b8" fontSize="8" textAnchor="middle">S₁</text>
                <line x1="160" y1="78" x2="190" y2="78" stroke={(bitA & bitB) ? '#f59e0b' : '#475569'} strokeWidth="2" />
                <line x1="190" y1="78" x2="190" y2="175" stroke={(bitA & bitB) ? '#f59e0b' : '#475569'} strokeWidth="2" />
                <line x1="190" y1="175" x2="340" y2="175" stroke={(bitA & bitB) ? '#f59e0b' : '#475569'} strokeWidth="2" />
                <text x="195" y="100" fill="#f59e0b" fontSize="8">C₁</text>

                {/* Half Adder 2 Box */}
                <line x1="220" y1="48" x2="240" y2="48" stroke={(bitA ^ bitB) ? '#4ade80' : '#475569'} strokeWidth="2.5" />
                <line x1="220" y1="150" x2="240" y2="80" stroke={carryIn ? '#22c55e' : '#475569'} strokeWidth="2.5" />
                <rect x="240" y="30" width="80" height="65" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                <text x="280" y="65" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">HA 2</text>

                {/* HA2 Outputs: Final Sum, Carry 2 to OR */}
                <line x1="320" y1="50" x2="410" y2="50" stroke={sumBit ? '#4ade80' : '#475569'} strokeWidth="3" />
                <text x="415" y="54" fill={sumBit ? '#4ade80' : '#94a3b8'} fontSize="11" fontWeight="bold">SUM (S) = {sumBit}</text>

                <line x1="320" y1="78" x2="340" y2="78" stroke="orange" strokeWidth="2" />
                <line x1="340" y1="78" x2="340" y2="155" stroke="orange" strokeWidth="2" />

                {/* OR Gate for Carries */}
                <rect x="340" y="145" width="55" height="45" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                <text x="367" y="172" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">OR</text>

                {/* Final Carry Output */}
                <line x1="395" y1="168" x2="410" y2="168" stroke={carryOutBit ? '#f59e0b' : '#475569'} strokeWidth="3" />
                <text x="415" y="172" fill={carryOutBit ? '#f59e0b' : '#94a3b8'} fontSize="11" fontWeight="bold">COUT = {carryOutBit}</text>
              </svg>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-300">
            <span>
              Sum Expression: <strong className="text-cyan-400 font-mono">{adderMode === 'half' ? `S = A ⊕ B = ${sumBit}` : `S = A ⊕ B ⊕ Cin = ${sumBit}`}</strong>
            </span>
            <span>
              Carry Expression: <strong className="text-amber-400 font-mono">{adderMode === 'half' ? `C = A · B = ${carryOutBit}` : `Cout = (A·B) + Cin(A⊕B) = ${carryOutBit}`}</strong>
            </span>
          </div>
        </div>

        {/* Controls & Truth Table (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
              Binary Bit Toggles
            </div>

            {/* Inputs */}
            <div className={`grid ${adderMode === 'full' ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
              <button
                onClick={() => setBitA(bitA ? 0 : 1)}
                className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                  bitA ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Bit A: {bitA}
              </button>
              <button
                onClick={() => setBitB(bitB ? 0 : 1)}
                className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                  bitB ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Bit B: {bitB}
              </button>
              {adderMode === 'full' && (
                <button
                  onClick={() => setCarryIn(carryIn ? 0 : 1)}
                  className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                    carryIn ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Cin: {carryIn}
                </button>
              )}
            </div>

            {/* Truth Table */}
            <div>
              <span className="text-xs text-slate-400 block mb-1 font-bold">
                {adderMode === 'half' ? 'Half-Adder Truth Table:' : 'Full-Adder Truth Table:'}
              </span>
              <table className="w-full text-xs text-center border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-800 text-slate-300">
                    {adderMode === 'full' && <th className="p-1 border border-slate-700 text-slate-400">Cin</th>}
                    <th className="p-1 border border-slate-700">A</th>
                    <th className="p-1 border border-slate-700">B</th>
                    <th className="p-1 border border-slate-700 text-amber-400">{adderMode === 'full' ? 'Cout' : 'Carry'}</th>
                    <th className="p-1 border border-slate-700 text-cyan-400">Sum</th>
                  </tr>
                </thead>
                <tbody>
                  {adderMode === 'half'
                    ? [
                        [0, 0, 0, 0],
                        [0, 1, 0, 1],
                        [1, 0, 0, 1],
                        [1, 1, 1, 0],
                      ].map((row, idx) => {
                        const isCur = row[0] === bitA && row[1] === bitB;
                        return (
                          <tr
                            key={idx}
                            className={isCur ? 'bg-cyan-950 text-cyan-300 font-bold border-2 border-cyan-500' : 'border border-slate-800 text-slate-400'}
                          >
                            <td className="p-1 border border-slate-700">{row[0]}</td>
                            <td className="p-1 border border-slate-700">{row[1]}</td>
                            <td className="p-1 border border-slate-700 text-amber-400">{row[2]}</td>
                            <td className="p-1 border border-slate-700 text-cyan-400">{row[3]}</td>
                          </tr>
                        );
                      })
                    : [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 0, 1],
                        [0, 1, 0, 0, 1],
                        [0, 1, 1, 1, 0],
                        [1, 0, 0, 0, 1],
                        [1, 0, 1, 1, 0],
                        [1, 1, 0, 1, 0],
                        [1, 1, 1, 1, 1],
                      ].map((row, idx) => {
                        const isCur = row[0] === carryIn && row[1] === bitA && row[2] === bitB;
                        return (
                          <tr
                            key={idx}
                            className={isCur ? 'bg-cyan-950 text-cyan-300 font-bold border-2 border-cyan-500' : 'border border-slate-800 text-slate-400'}
                          >
                            <td className="p-1 border border-slate-700 text-slate-400">{row[0]}</td>
                            <td className="p-1 border border-slate-700">{row[1]}</td>
                            <td className="p-1 border border-slate-700">{row[2]}</td>
                            <td className="p-1 border border-slate-700 text-amber-400">{row[3]}</td>
                            <td className="p-1 border border-slate-700 text-cyan-400">{row[4]}</td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* KCSE Exam Challenge */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            KCSE Binary Addition Diagnostic
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          In a binary half-adder, inputs A = 1 and B = 1 are added. Give the 2-bit binary output string in the format <strong>CS</strong> (Carry followed by Sum).
        </p>

        <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="e.g. 10"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500 w-28"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Submit Output
          </button>
          {quizStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Correct! 1 + 1 = 10₂ (Carry = 1, Sum = 0).
            </span>
          )}
          {quizStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Incorrect. In binary, 1 + 1 = 2₁₀ = 10₂.
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
