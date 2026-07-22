import React from 'react';
import { Play, Clock, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function SimulationCard({ simulation, onLaunch }) {
  const { title, topic, subject, status, description, config } = simulation;
  const isActive = status === 'ACTIVE';

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 border ${
        isActive
          ? 'bg-white border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-custom-orange/40'
          : 'bg-gray-50/70 border-gray-200/60 opacity-90'
      }`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-custom-blue border border-blue-100">
            <BookOpen className="w-3 h-3 mr-1" />
            {topic || subject}
          </span>

          {isActive ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Interactive Sim
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-3 h-3 mr-1 text-amber-500" />
              Coming Soon
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
          {description || 'Interactive simulation model for visual concept mastery.'}
        </p>

        {/* Planned Features list for Placeholders */}
        {!isActive && config?.planned_features && (
          <div className="mb-4 p-3 bg-white/70 rounded-2xl border border-gray-200/50">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center mb-1.5">
              <Sparkles className="w-3 h-3 mr-1 text-amber-500" />
              Coverage Preview:
            </span>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              {config.planned_features.slice(0, 3).map((feat, idx) => (
                <li key={idx}>{feat}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer / Action Button */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        {isActive ? (
          <button
            onClick={() => onLaunch(simulation)}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-custom-orange text-white font-medium text-sm shadow-md hover:bg-orange-600 transition-all cursor-pointer group"
          >
            <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            Launch Simulation
          </button>
        ) : (
          <button
            disabled
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-200 text-gray-500 font-medium text-sm cursor-not-allowed"
          >
            <Layers className="w-4 h-4 text-gray-400" />
            Under Development
          </button>
        )}
      </div>
    </div>
  );
}
