import { lazy, Suspense, useState, useContext } from 'react';
import UserContext from '../Context/UserContext';


const simulationComponents = {
  freefall: lazy(() => import('./Simulations/FreefallSim')),
  chemical: lazy(() => import('./Simulations/ChemicalSim')),
  circuit: lazy(() => import('./Simulations/CircuitSim')),
  charleslaw: lazy(() => import('./Simulations/CharlesLawSim')),
  // pendulum: lazy(() => import('./PendulumSim')),
  optics: lazy(() => import('./Simulations/OpticsSim')),
  // waves: lazy(() => import('./WavesSim')),
  // ...add as many as needed
};


export default function Simulations() {
  const [currentSimulation, setCurrentSimulation] = useState(null);
  const {user} = useContext(UserContext)

  const renderSimulation = () => {
    const SelectedSimulation = simulationComponents[currentSimulation];
    return SelectedSimulation ? (
      <Suspense fallback={<div className="text-center py-10">Loading simulation...</div>}>
        <SelectedSimulation />
      </Suspense>
    ) : (
      <div className="text-center py-10 text-gray-500">
        Select a simulation from the menu above.
      </div>
    );
  };

  return (
    <>
      {
        user ? (
          <>
            <div className=" mx-auto p-6">
              <h1 className="text-3xl font-bold mb-6">Physics Simulations</h1>

              <div className="flex flex-wrap gap-3 mb-8">
                {Object.keys(simulationComponents).map((simKey) => (
                  <button
                    key={simKey}
                    onClick={() => setCurrentSimulation(simKey)}
                    className={`px-4 py-2 rounded-3xl transition-colors ${currentSimulation === simKey
                        ? 'bg-custom-orange text-white'
                        : 'bg-custom-blue text-white hover:bg-custom-orange'
                      }`}
                  >
                    {simKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-lg shadow p-4 min-h-[400px]">
                {renderSimulation()}
              </div>
            </div>
          </>
        ) : null
      }
    </>

  );
}


