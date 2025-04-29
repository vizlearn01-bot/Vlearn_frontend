import { lazy, Suspense, useState, useContext } from 'react';
import UserContext from '../Context/UserContext';
import { Link } from 'react-router-dom';

const simulationComponents = {
  charles_law: lazy(() => import('./Simulations/CharlesLawSim')),
  reaction_rate: lazy(() => import('./Simulations/ReactionRatesim')),
  electrolysis: lazy(() => import('./Simulations/ElectrolysisSim')),
  freefall: lazy(() => import('./Simulations/FreefallSim')),
  chemical: lazy(() => import('./Simulations/ChemicalSim')),
  circuit: lazy(() => import('./Simulations/CircuitSim')),

  // pendulum: lazy(() => import('./PendulumSim')),
  optics: lazy(() => import('./Simulations/OpticsSim')),
  // waves: lazy(() => import('./WavesSim')),
  // ...add as many as needed
};


export default function Simulations() {
  const [currentSimulation, setCurrentSimulation] = useState(null);
  const { user } = useContext(UserContext)

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
      <div className=" mx-auto pt-6 pl-2">
        <h1 className="text-3xl font-bold mb-6">Experiment Simulations</h1>
      </div>
      {
        user ? (
          <>
            <div className="flex flex-wrap gap-2 mb-4 pl-2">
              {Object.keys(simulationComponents).map((simKey) => (
                <button
                  key={simKey}
                  onClick={() => setCurrentSimulation(simKey)}
                  className={`px-4 py-2 rounded-3xl transition-colors ${currentSimulation === simKey
                    ? 'bg-custom-orange text-white'
                    : 'bg-custom-blue text-white hover:bg-custom-orange'
                    }`}
                >
                  {simKey.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase())}
                </button>
              ))}
            </div>

            <div className="bg-white p-4 ">
              {renderSimulation()}
            </div>
          </>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-100/80 z-10">
            <div className="bg-white p-6 rounded-3xl shadow-2xl text-center max-w-md mx-4">
              <p className="text-red-500 font-medium text-lg mb-4">
                Login Required
              </p>
              <p className="text-gray-600">
                Please log in to access the simulations.
              </p>
              <Link
                to="/login"
                className="mt-4 inline-block bg-custom-blue text-white px-4 py-2 rounded-3xl hover:bg-custom-orange transition"
              >
                Go to Login
              </Link>
            </div>
          </div>
        )
      }
    </>

  );
}


