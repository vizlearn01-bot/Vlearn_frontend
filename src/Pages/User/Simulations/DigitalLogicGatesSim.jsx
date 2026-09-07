import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, Activity, Sparkles, Lightbulb } from 'lucide-react';

const GATES = [
  { id: 'AND', formula: 'Y = A · B', symbol: 'AND', truth: [[0,0,0],[0,1,0],[1,0,0],[1,1,1]], eval: (a, b) => a & b },
  { id: 'OR', formula: 'Y = A + B', symbol: 'OR', truth: [[0,0,0],[0,1,1],[1,0,1],[1,1,1]], eval: (a, b) => a | b },
  { id: 'NOT', formula: 'Y = Ā', symbol: 'NOT', truth: [[0,0,1],[1,0,0]], eval: (a) => (a === 0 ? 1 : 0), singleInput: true },
  { id: 'NAND', formula: 'Y = (A · B)̄', symbol: 'NAND', truth: [[0,0,1],[0,1,1],[1,0,1],[1,1,0]], eval: (a, b) => (a & b ? 0 : 1) },
  { id: 'NOR', formula: 'Y = (A + B)̄', symbol: 'NOR', truth: [[0,0,1],[0,1,0],[1,0,0],[1,1,0]], eval: (a, b) => (a | b ? 0 : 1) },
  { id: 'XOR', formula: 'Y = A ⊕ B', symbol: 'XOR', truth: [[0,0,0],[0,1,1],[1,0,1],[1,1,0]], eval: (a, b) => a ^ b },
];

export default function DigitalLogicGatesSim({ config = {}, onTelemetry }) {
  const [activeGateId, setActiveGateId] = useState('AND');
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);
  const [userAns, setUserAns] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  const gate = GATES.find((g) => g.id === activeGateId) || GATES[0];
  const outputY = gate.singleInput ? gate.eval(inputA) : gate.eval(inputA, inputB);

  const handleReset = () => {
    setActiveGateId('AND');
    setInputA(0);
    setInputB(0);
    setQuizStatus(null);
    setUserAns('');
  };

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    const val = parseInt(userAns.trim(), 10);
    // Question: For a NAND gate with inputs A=1 and B=1, what is output Y?
    // 1 NAND 1 = 0
    if (val === 0) {
      setQuizStatus('correct');
      if (onTelemetry) onTelemetry('logic_gates_quiz_correct', { problem: 'nand_output' });
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
            <span className="text-xs text-slate-400 font-mono">Digital Electronics Suite</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            Digital Logic Gates & Live Truth Table Explorer
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Logic Bench
        </button>
      </div>

      {/* Gate Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
        {GATES.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGateId(g.id)}
            className={`p-2.5 text-center rounded-2xl border transition-all ${
              activeGateId === g.id
                ? 'bg-cyan-950/50 border-cyan-500/60 shadow-lg shadow-cyan-950/50 text-white font-bold'
                : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-400'
            }`}
          >
            <div className="text-xs text-slate-200">{g.id} Gate</div>
            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{g.formula}</div>
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Interactive Gate Diagram (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Circuit Logic Symbol & Output Indicator
            </span>
            <span className="font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-lg">
              Output: Y = {outputY} ({outputY === 1 ? 'HIGH / ON' : 'LOW / OFF'})
            </span>
          </div>

          {/* SVG Logic Diagram */}
          <div className="w-full h-[240px] bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
            <svg viewBox="0 0 460 200" className="w-full h-full">
              {/* Input A Line */}
              <line x1="40" y1="70" x2="160" y2="70" stroke={inputA === 1 ? '#22c55e' : '#475569'} strokeWidth="3" />
              <text x="30" y="74" fill={inputA === 1 ? '#4ade80' : '#94a3b8'} fontSize="11" fontWeight="bold" textAnchor="end">
                A ({inputA})
              </text>

              {/* Input B Line (if dual input) */}
              {!gate.singleInput && (
                <g>
                  <line x1="40" y1="130" x2="160" y2="130" stroke={inputB === 1 ? '#22c55e' : '#475569'} strokeWidth="3" />
                  <text x="30" y="134" fill={inputB === 1 ? '#4ade80' : '#94a3b8'} fontSize="11" fontWeight="bold" textAnchor="end">
                    B ({inputB})
                  </text>
                </g>
              )}

              {/* Logic Gate Symbol Box / Shape */}
              <rect x="160" y="45" width="120" height="110" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
              <text x="220" y="95" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle">
                {gate.id}
              </text>
              <text x="220" y="125" fill="#94a3b8" fontSize="10" fontStyle="italic" textAnchor="middle">
                {gate.formula}
              </text>

              {/* Output Line */}
              <line x1="280" y1="100" x2="380" y2="100" stroke={outputY === 1 ? '#4ade80' : '#475569'} strokeWidth="3.5" />
              <text x="395" y="104" fill={outputY === 1 ? '#4ade80' : '#94a3b8'} fontSize="12" fontWeight="bold">
                Y = {outputY}
              </text>

              {/* Live LED Output Indicator */}
              <g transform="translate(350, 100)">
                <circle
                  cx="0"
                  cy="0"
                  r="14"
                  fill={outputY === 1 ? '#22c55e' : '#334155'}
                  className={outputY === 1 ? 'drop-shadow-[0_0_12px_rgba(74,222,128,1)]' : ''}
                />
              </g>
            </svg>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-300">
            <span>
              Input State: <strong className="text-cyan-400 font-mono">A={inputA}{!gate.singleInput ? `, B=${inputB}` : ''}</strong>
            </span>
            <span>
              LED Lamp: <strong className={outputY === 1 ? 'text-emerald-400' : 'text-slate-500'}>
                {outputY === 1 ? 'GLOWING GREEN (Logic 1)' : 'DARK (Logic 0)'}
              </strong>
            </span>
          </div>
        </div>

        {/* Live Truth Table & Switches (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
              Toggle Digital Inputs
            </div>

            {/* Input Switches */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Input A:</span>
                <button
                  onClick={() => setInputA(inputA === 0 ? 1 : 0)}
                  className={`w-full py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                    inputA === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {inputA === 1 ? 'HIGH (1)' : 'LOW (0)'}
                </button>
              </div>

              {!gate.singleInput && (
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Input B:</span>
                  <button
                    onClick={() => setInputB(inputB === 0 ? 1 : 0)}
                    className={`w-full py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                      inputB === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {inputB === 1 ? 'HIGH (1)' : 'LOW (0)'}
                  </button>
                </div>
              )}
            </div>

            {/* Live Truth Table */}
            <div>
              <span className="text-xs text-slate-400 block mb-1.5 font-bold">Dynamic Truth Table:</span>
              <table className="w-full text-xs text-center border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-800 text-slate-300">
                    <th className="p-1.5 border border-slate-700">A</th>
                    {!gate.singleInput && <th className="p-1.5 border border-slate-700">B</th>}
                    <th className="p-1.5 border border-slate-700 text-cyan-400">Y</th>
                  </tr>
                </thead>
                <tbody>
                  {gate.truth.map((row, idx) => {
                    const isCurRow = gate.singleInput
                      ? row[0] === inputA
                      : row[0] === inputA && row[1] === inputB;
                    return (
                      <tr
                        key={idx}
                        className={isCurRow ? 'bg-cyan-950 text-cyan-300 font-bold border-2 border-cyan-500' : 'border border-slate-800 text-slate-400'}
                      >
                        <td className="p-1.5 border border-slate-700">{row[0]}</td>
                        {!gate.singleInput && <td className="p-1.5 border border-slate-700">{row[1]}</td>}
                        <td className="p-1.5 border border-slate-700 font-bold">{row[gate.singleInput ? 2 : 2]}</td>
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
            KCSE Logic Gate Question
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          Both inputs to a <strong>NAND gate</strong> are in the logic <strong>1 (HIGH)</strong> state. What is the logic output state (0 or 1)?
        </p>

        <form onSubmit={handleCheckQuiz} className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            min="0"
            max="1"
            placeholder="0 or 1"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500 w-28"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Submit Logic State
          </button>
          {quizStatus === 'correct' && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Correct! 1 · 1 = 1, and inverting gives Y = 0.
            </span>
          )}
          {quizStatus === 'incorrect' && (
            <span className="text-xs text-rose-400 font-medium">
              Incorrect. NAND outputs LOW (0) ONLY when all inputs are HIGH (1).
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
