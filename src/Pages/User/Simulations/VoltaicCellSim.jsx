import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Eye, RefreshCw, CheckCircle2, BatteryCharging, Zap, Info, ArrowRight, ShieldAlert, Award, Activity } from 'lucide-react';

const CELL_CONFIG = {
  anode: "Zn",
  cathode: "Cu",
  anodeElectrolyte: "ZnSO₄",
  cathodeElectrolyte: "CuSO₄",
  anodeIon: "Zn²⁺",
  cathodeIon: "Cu²⁺",
  saltBridgeAnion: "Cl⁻",
  saltBridgeCation: "K⁺"
};

const PHASES = {
  IDLE: 0,
  STARTED: 1,
  ELECTRON_PAUSE: 2,
  ELECTRON_FLOW: 3,
  OXIDATION: 4,
  REDUCTION: 5,
  SALT_BRIDGE: 6,
  COMPLETED: 7,
};

export default function VoltaicCellSim({ config, onTelemetry }) {
  const [phase, setPhase] = useState(PHASES.IDLE);
  const [showLabels, setShowLabels] = useState(false);
  const [mastered, setMastered] = useState(false);

  // Sequential progression logic
  useEffect(() => {
    let timeout;
    switch (phase) {
      case PHASES.STARTED:
        timeout = setTimeout(() => setPhase(PHASES.ELECTRON_PAUSE), 1000);
        break;
      case PHASES.ELECTRON_PAUSE:
        // Waits for user to click continue, or we could auto advance after 5s. Let's auto advance.
        timeout = setTimeout(() => setPhase(PHASES.ELECTRON_FLOW), 5000);
        break;
      case PHASES.ELECTRON_FLOW:
        timeout = setTimeout(() => setPhase(PHASES.OXIDATION), 2000);
        break;
      case PHASES.OXIDATION:
        timeout = setTimeout(() => setPhase(PHASES.REDUCTION), 2000);
        break;
      case PHASES.REDUCTION:
        timeout = setTimeout(() => setPhase(PHASES.SALT_BRIDGE), 2000);
        break;
      case PHASES.SALT_BRIDGE:
        timeout = setTimeout(() => {
          setPhase(PHASES.COMPLETED);
          if (!mastered) {
            setMastered(true);
            if (onTelemetry) {
              onTelemetry('SIMULATION_CHECKPOINT_VERIFIED', {
                checkpoint: 'Voltaic Cell Mastered',
              });
            }
          }
        }, 3000);
        break;
      default:
        break;
    }
    return () => clearTimeout(timeout);
  }, [phase, mastered, onTelemetry]);

  const handleStart = () => {
    if (phase === PHASES.IDLE) {
      setPhase(PHASES.STARTED);
    }
  };

  const handleReset = () => {
    setPhase(PHASES.IDLE);
  };

  const handleReplay = () => {
    setPhase(PHASES.STARTED);
  };

  const renderParticles = () => {
    if (phase < PHASES.STARTED) return null;

    return (
      <div className="absolute inset-0 pointer-events-none">
        
        {/* Electrons in wire */}
        {phase >= PHASES.ELECTRON_PAUSE && (
          <div 
            className={`absolute top-[48px] h-3 rounded-full flex items-center justify-center bg-yellow-400 font-bold text-[10px] text-yellow-900 shadow-sm transition-all duration-[2000ms] ease-linear z-10 ${phase === PHASES.ELECTRON_PAUSE ? 'left-[30%] opacity-100' : phase >= PHASES.ELECTRON_FLOW ? 'left-[65%] opacity-0' : 'left-[25%] opacity-0'}`}
            style={{ width: '24px' }}
          >
            e⁻
            {showLabels && <div className="absolute -top-6 bg-white px-1 border rounded shadow-sm text-gray-700 whitespace-nowrap">Electron</div>}
          </div>
        )}

        {/* Oxidation: Zn -> Zn2+ */}
        {phase >= PHASES.OXIDATION && (
          <div 
            className={`absolute rounded-full w-5 h-5 flex items-center justify-center bg-slate-300 border border-slate-500 font-bold text-[9px] text-slate-800 shadow-sm transition-all duration-1000 ease-out z-10 ${phase === PHASES.OXIDATION ? 'top-[160px] left-[20%] opacity-100' : phase > PHASES.OXIDATION ? 'top-[200px] left-[25%] opacity-50' : 'top-[130px] left-[15%] opacity-0'}`}
          >
            {CELL_CONFIG.anodeIon}
            {showLabels && <div className="absolute -left-10 bg-white px-1 border rounded shadow-sm text-gray-700 whitespace-nowrap">{CELL_CONFIG.anodeIon}</div>}
          </div>
        )}

        {/* Reduction: Cu2+ -> Cu */}
        {phase >= PHASES.REDUCTION && (
          <div 
            className={`absolute rounded-full w-5 h-5 flex items-center justify-center bg-orange-300 border border-orange-500 font-bold text-[9px] text-orange-900 shadow-sm transition-all duration-1000 ease-out z-10 ${phase === PHASES.REDUCTION ? 'top-[200px] right-[25%] opacity-100' : phase > PHASES.REDUCTION ? 'top-[160px] right-[20%] opacity-0' : 'top-[220px] right-[15%] opacity-0'}`}
          >
            {CELL_CONFIG.cathodeIon}
            {showLabels && <div className="absolute -right-10 bg-white px-1 border rounded shadow-sm text-gray-700 whitespace-nowrap">{CELL_CONFIG.cathodeIon}</div>}
          </div>
        )}

        {/* Salt Bridge Ions */}
        {phase >= PHASES.SALT_BRIDGE && (
          <>
            {/* Anions move left */}
            <div 
              className={`absolute top-[100px] rounded-full w-5 h-5 flex items-center justify-center bg-purple-200 border border-purple-400 font-bold text-[8px] text-purple-900 shadow-sm transition-all duration-2000 ease-linear z-20 ${phase >= PHASES.SALT_BRIDGE ? 'left-[35%] opacity-100' : 'left-[45%] opacity-0'}`}
            >
              {CELL_CONFIG.saltBridgeAnion}
              {showLabels && <div className="absolute -top-6 bg-white px-1 border rounded shadow-sm text-gray-700 whitespace-nowrap">Anion</div>}
            </div>

            {/* Cations move right */}
            <div 
              className={`absolute top-[100px] rounded-full w-5 h-5 flex items-center justify-center bg-pink-200 border border-pink-400 font-bold text-[8px] text-pink-900 shadow-sm transition-all duration-2000 ease-linear z-20 ${phase >= PHASES.SALT_BRIDGE ? 'right-[35%] opacity-100' : 'right-[45%] opacity-0'}`}
            >
              {CELL_CONFIG.saltBridgeCation}
              {showLabels && <div className="absolute -bottom-6 bg-white px-1 border rounded shadow-sm text-gray-700 whitespace-nowrap">Cation</div>}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-50 rounded-3xl overflow-hidden shadow-sm border border-slate-200 p-6 font-sans max-w-5xl mx-auto">
      
      {/* Mission Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-5 rounded-2xl shadow-sm mb-6 flex items-start gap-4">
        <div className="bg-white/20 p-2.5 rounded-xl flex-shrink-0">
          <Zap className="w-6 h-6 text-yellow-300" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Mission</h2>
          <p className="text-blue-100 mt-1 max-w-3xl leading-relaxed">
            Start the voltaic cell.<br/>
            Watch every moving particle.<br/>
            <strong>Can you explain why the salt bridge is essential for continuous current flow?</strong>
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-8 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        {phase === PHASES.IDLE ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Play className="w-4 h-4 fill-current" /> Start Cell
          </button>
        ) : (
          <button
            onClick={handleReplay}
            disabled={phase !== PHASES.COMPLETED}
            className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg transition-colors ${phase === PHASES.COMPLETED ? 'text-white bg-emerald-600 hover:bg-emerald-700' : 'text-slate-400 bg-slate-100 cursor-not-allowed'}`}
          >
            <RefreshCw className={`w-4 h-4 ${phase !== PHASES.COMPLETED && 'animate-spin-slow'}`} /> {phase === PHASES.COMPLETED ? 'Replay Animation' : 'Running...'}
          </button>
        )}

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors ml-auto"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>

        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors border ${showLabels ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          <Eye className="w-4 h-4" /> Show Labels
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: The Visual Cell */}
        <div className="lg:col-span-8 relative">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative min-h-[350px] flex items-end justify-between overflow-hidden">
            
            {/* The Wire */}
            <div className="absolute top-[50px] left-[20%] right-[20%] h-1 bg-slate-800 z-0 flex items-center justify-center">
              <div className="bg-slate-800 p-2 rounded-full border-4 border-white shadow-sm absolute -top-4">
                <BatteryCharging className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            
            {/* The Salt Bridge */}
            <div className="absolute top-[80px] left-[35%] right-[35%] h-[120px] z-10 border-4 border-b-0 border-blue-200 rounded-t-3xl bg-blue-50/50 flex flex-col items-center justify-start pt-2">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-full">Salt Bridge</span>
            </div>

            {/* Left Beaker (Anode) */}
            <div className="relative w-[30%] h-[180px] border-b-4 border-l-4 border-r-4 border-blue-100 rounded-b-xl flex justify-center items-end bg-blue-50/30">
              <div className="absolute inset-0 bg-blue-400/20 top-1/4 rounded-b-lg"></div>
              <div className="absolute bottom-2 text-blue-800 font-bold text-xs">{CELL_CONFIG.anodeElectrolyte}</div>
              
              {/* Zn Electrode */}
              <div 
                className={`w-12 bg-slate-400 border-2 border-slate-500 rounded-t-sm z-10 flex flex-col items-center justify-start pt-2 transition-all duration-[4000ms] ease-out ${phase >= PHASES.OXIDATION ? 'h-[110px] w-10 mx-1' : 'h-[140px]'}`}
              >
                <span className="text-xs font-bold text-slate-800 bg-white/80 px-1 rounded">{CELL_CONFIG.anode} (s)</span>
                <span className="text-[9px] font-bold text-slate-700 mt-1 uppercase">Anode (-)</span>
              </div>
            </div>

            {/* Right Beaker (Cathode) */}
            <div className="relative w-[30%] h-[180px] border-b-4 border-l-4 border-r-4 border-blue-100 rounded-b-xl flex justify-center items-end bg-blue-50/30">
              <div className="absolute inset-0 bg-blue-500/30 top-1/4 rounded-b-lg transition-colors duration-[4000ms] ease-out"></div>
              <div className="absolute bottom-2 text-blue-900 font-bold text-xs">{CELL_CONFIG.cathodeElectrolyte}</div>
              
              {/* Cu Electrode */}
              <div 
                className={`w-12 bg-orange-400 border-2 border-orange-500 rounded-t-sm z-10 flex flex-col items-center justify-start pt-2 transition-all duration-[4000ms] ease-out ${phase >= PHASES.REDUCTION ? 'h-[150px] w-14 -mx-1 border-4' : 'h-[140px]'}`}
              >
                <span className="text-xs font-bold text-orange-900 bg-white/80 px-1 rounded">{CELL_CONFIG.cathode} (s)</span>
                <span className="text-[9px] font-bold text-orange-800 mt-1 uppercase">Cathode (+)</span>
              </div>
            </div>

            {/* Particle Animations */}
            {renderParticles()}

            {/* Aha Moment Popup */}
            {phase === PHASES.ELECTRON_PAUSE && (
              <div className="absolute top-[10px] left-1/2 -translate-x-1/2 bg-yellow-100 border border-yellow-300 text-yellow-900 p-3 rounded-xl shadow-lg z-50 text-sm font-bold w-3/4 text-center animate-bounce">
                Electric current begins because {CELL_CONFIG.anode} releases electrons more readily than {CELL_CONFIG.cathode}.
              </div>
            )}
          </div>

          {/* Charge Balance Indicator */}
          <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-500" /> Charge Balance
            </h4>
            
            {phase < PHASES.SALT_BRIDGE ? (
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-sm">
                   <div className="font-bold text-slate-700 text-xs uppercase mb-1">Left Cell</div>
                   <div className="text-red-700 font-bold flex items-center gap-1">Positive Build-up</div>
                 </div>
                 <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-sm">
                   <div className="font-bold text-slate-700 text-xs uppercase mb-1">Right Cell</div>
                   <div className="text-red-700 font-bold flex items-center gap-1">Negative Build-up</div>
                 </div>
                 {phase >= PHASES.ELECTRON_FLOW && phase < PHASES.SALT_BRIDGE && (
                   <div className="col-span-2 text-center text-xs font-bold text-red-600 bg-red-100 p-1 rounded">Current will soon stop without Salt Bridge</div>
                 )}
               </div>
            ) : (
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-sm">
                   <div className="font-bold text-slate-700 text-xs uppercase mb-1">Left Cell</div>
                   <div className="text-emerald-700 font-bold flex items-center gap-1">Neutral</div>
                 </div>
                 <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-sm">
                   <div className="font-bold text-slate-700 text-xs uppercase mb-1">Right Cell</div>
                   <div className="text-emerald-700 font-bold flex items-center gap-1">Neutral</div>
                 </div>
               </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Observation Panel */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-slate-800 text-white rounded-2xl shadow-sm p-5 border-4 border-slate-700">
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-sm mb-4">Observation Panel</h3>
            
            <div className="space-y-3">
              <ObsRow 
                active={phase >= PHASES.ELECTRON_FLOW} 
                title="Electron Flow" 
                detail={`${CELL_CONFIG.anode} → ${CELL_CONFIG.cathode}`} 
              />
              <ObsRow 
                active={phase >= PHASES.OXIDATION} 
                title="Oxidation" 
                detail={`${CELL_CONFIG.anode} → ${CELL_CONFIG.anodeIon} + 2e⁻`} 
              />
              <ObsRow 
                active={phase >= PHASES.REDUCTION} 
                title="Reduction" 
                detail={`${CELL_CONFIG.cathodeIon} + 2e⁻ → ${CELL_CONFIG.cathode}`} 
              />
              <ObsRow 
                active={phase >= PHASES.SALT_BRIDGE} 
                title="Salt Bridge" 
                detail="Maintaining charge balance" 
              />
            </div>

            <div className={`mt-6 pt-4 border-t border-slate-600 flex items-center gap-3 font-bold ${phase >= PHASES.SALT_BRIDGE ? 'text-yellow-400' : 'text-slate-500'}`}>
              <Activity className={`w-5 h-5 ${phase >= PHASES.SALT_BRIDGE && 'animate-pulse'}`} />
              Cell Status: {phase >= PHASES.SALT_BRIDGE ? 'Generating Electricity' : 'Starting up...'}
            </div>
          </div>

          {mastered && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm p-5">
              <h4 className="font-extrabold text-emerald-800 text-lg flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Voltaic Cell Mastered
              </h4>
              <p className="text-emerald-900 text-sm leading-relaxed">
                <strong>Key Discovery:</strong> Electrons travel through the external wire while ions move through the salt bridge to maintain electrical neutrality. Both are required for the cell to continue producing electricity.
              </p>
            </div>
          )}

          {phase === PHASES.COMPLETED && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-blue-50 opacity-50"><Award className="w-24 h-24" /></div>
              <h4 className="font-bold text-slate-800 text-md mb-3 flex items-center gap-2 relative z-10">
                <Info className="w-4 h-4 text-blue-500" />
                Voltaic Cell Summary
              </h4>
              <ul className="text-sm text-slate-600 space-y-2 relative z-10 font-medium">
                <li className="flex items-start gap-2"><ArrowRight className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0"/> Oxidation occurs at the Anode</li>
                <li className="flex items-start gap-2"><ArrowRight className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0"/> Reduction occurs at the Cathode</li>
                <li className="flex items-start gap-2"><ArrowRight className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0"/> Electrons travel through the wire</li>
                <li className="flex items-start gap-2"><ArrowRight className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0"/> Ions travel through the salt bridge</li>
                <li className="flex items-start gap-2"><ArrowRight className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0"/> Chemical energy becomes electrical energy</li>
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function ObsRow({ active, title, detail }) {
  return (
    <div className={`p-3 rounded-lg border flex items-center justify-between transition-all duration-500 ${active ? 'bg-slate-700 border-slate-500 text-white shadow-sm' : 'bg-slate-800 border-slate-700 text-slate-500 opacity-50'}`}>
      <span className="font-bold text-sm">{title}</span>
      <span className={`text-xs font-mono px-2 py-0.5 rounded ${active ? 'bg-slate-900 text-blue-300' : 'bg-slate-700'}`}>{detail}</span>
    </div>
  );
}
