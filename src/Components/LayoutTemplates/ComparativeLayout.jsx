import React from 'react';
import { Columns } from 'lucide-react';

/**
 * ComparativeLayout (Presentation Strategy)
 * Side-by-side comparative spatial layout container.
 * Perfect for contrasting concepts, alternative models, before/after, or misconceptions.
 */
export const ComparativeLayout = ({ page, renderBlock, context }) => {
  const blocks = page?.blocks || [];

  // If even number of blocks >= 2, arrange in 2-column comparative grid
  const useGrid = blocks.length >= 2;

  return (
    <div className="layout-strategy comparative-layout max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-custom-terracotta uppercase tracking-widest block mb-1">
            Comparative Analysis Strategy
          </span>
          <h3 className="text-xl font-bold text-gray-900 font-serif">
            {context?.conceptGroup || page?.pageTitle || 'Comparative Evaluation'}
          </h3>
        </div>
        <div className="p-2 bg-custom-terracotta/10 text-custom-terracotta rounded-lg">
          <Columns className="w-5 h-5" />
        </div>
      </div>

      <div className={useGrid ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
        {blocks.map((block, idx) => (
          <div
            key={block.id || idx}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {renderBlock ? renderBlock(block) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparativeLayout;
