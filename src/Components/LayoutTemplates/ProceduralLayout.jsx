import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * ProceduralLayout (Presentation Strategy)
 * Step-by-step algorithmic / procedural calculation layout container.
 * Emphasizes worked examples, problem setup, step execution, and verification.
 */
export const ProceduralLayout = ({ page, renderBlock, context }) => {
  const blocks = page?.blocks || [];

  return (
    <div className="layout-strategy procedural-layout max-w-4xl mx-auto space-y-8">
      {/* Strategy Banner */}
      <div className="bg-custom-navy/5 border-l-4 border-custom-navy p-6 rounded-r-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-custom-navy uppercase tracking-widest block mb-1">
            Procedural / Problem-Solving Strategy
          </span>
          <h3 className="text-xl font-bold text-gray-900 font-serif">
            {context?.conceptGroup || page?.pageTitle || 'Step-by-Step Procedure'}
          </h3>
        </div>
        <CheckCircle2 className="w-8 h-8 text-custom-navy opacity-80" />
      </div>

      {/* Procedural Moments */}
      <div className="space-y-8">
        {blocks.map((block, idx) => (
          <div
            key={block.id || idx}
            className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-sm hover:border-custom-navy/30 transition-all"
          >
            {renderBlock ? renderBlock(block) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProceduralLayout;
