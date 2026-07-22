import React from 'react';
import { Sparkles, Layers } from 'lucide-react';

function ChemicalSim({ config = {} }) {
  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 text-center">
      <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Layers className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Chemical Equilibrium Simulation</h2>
      <p className="text-gray-600 max-w-lg mx-auto mb-6">
        Explore dynamic equilibrium shifts, reaction rates in forward & reverse directions, and Le Chatelier's principle when pressure, concentration, or thermal state changes.
      </p>

      {config.planned_features && (
        <div className="bg-purple-50/50 p-4 rounded-2xl max-w-md mx-auto text-left border border-purple-100">
          <div className="flex items-center text-purple-700 font-semibold text-sm mb-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Module Roadmap & Config Specs:
          </div>
          <ul className="list-disc list-inside text-xs text-purple-900 space-y-1">
            {config.planned_features.map((feat, idx) => (
              <li key={idx}>{feat}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ChemicalSim;
