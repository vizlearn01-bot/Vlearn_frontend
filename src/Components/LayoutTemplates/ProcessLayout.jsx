import React from 'react';
import { ArrowDown } from 'lucide-react';

/**
 * ProcessLayout (Presentation Strategy)
 * Sequential process/mechanism layout container.
 * Features vertical process step connectors between learning moments.
 */
export const ProcessLayout = ({ page, renderBlock, context }) => {
  const blocks = page?.blocks || [];

  return (
    <div className="layout-strategy process-layout max-w-4xl mx-auto space-y-8">
      {/* Concept Header */}
      <div className="bg-custom-forest/5 border border-custom-forest/20 rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-custom-forest uppercase tracking-widest block mb-1">
            Sequential Mechanism Flow
          </span>
          <h3 className="text-xl font-bold text-gray-900 font-serif">
            {context?.conceptGroup || page?.pageTitle || 'Process Overview'}
          </h3>
        </div>
        <span className="px-3 py-1 bg-custom-forest text-white text-xs font-bold rounded-full uppercase tracking-wider">
          Process Strategy
        </span>
      </div>

      {/* Sequential Blocks with Flow Connectors */}
      <div className="relative space-y-6">
        {blocks.map((block, idx) => {
          const isLast = idx === blocks.length - 1;
          return (
            <React.Fragment key={block.id || idx}>
              <div className="relative bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-custom-forest text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {idx + 1}
                </div>
                <div className="pl-4">{renderBlock ? renderBlock(block) : null}</div>
              </div>

              {!isLast && (
                <div className="flex justify-center py-2 text-custom-forest/40">
                  <ArrowDown className="w-5 h-5 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessLayout;
