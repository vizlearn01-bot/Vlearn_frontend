import React from 'react';

/**
 * DiscoveryLayout (Presentation Strategy)
 * Guided progressive disclosure spatial layout container.
 * Focuses on sequential discovery: Phenomenon → Model → Formalization → Reflection.
 */
export const DiscoveryLayout = ({ page, renderBlock, context }) => {
  const blocks = page?.blocks || [];

  return (
    <div className="layout-strategy discovery-layout max-w-4xl mx-auto space-y-8">
      {/* Optional Concept Badge */}
      {context?.conceptGroup && (
        <div className="flex items-center gap-2 text-xs font-bold text-custom-terracotta uppercase tracking-widest border-b border-gray-100 pb-3 mb-6">
          <span className="w-2 h-2 rounded-full bg-custom-terracotta inline-block" />
          <span>Discovery Strategy — {context.conceptGroup}</span>
        </div>
      )}

      {/* Render blocks in exact pedagogical sequence */}
      <div className="space-y-8">
        {blocks.map((block, idx) => (
          <div key={block.id || idx} className="discovery-moment transition-all duration-300">
            {renderBlock ? renderBlock(block) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoveryLayout;
