import React from 'react';
import { History } from 'lucide-react';

/**
 * NarrativeTimelineLayout (Presentation Strategy)
 * Historical / contextual narrative flow connecting learning moments.
 */
export const NarrativeTimelineLayout = ({ page, renderBlock, context }) => {
  const blocks = page?.blocks || [];

  return (
    <div className="layout-strategy narrative-timeline-layout max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 bg-custom-sand/30 border border-custom-sand/50 rounded-2xl p-6 mb-8">
        <div className="p-3 bg-custom-terracotta text-white rounded-xl shadow-sm">
          <History className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-custom-terracotta uppercase tracking-widest block">
            Narrative & Contextual Timeline Strategy
          </span>
          <h3 className="text-xl font-bold text-gray-900 font-serif">
            {context?.conceptGroup || page?.pageTitle || 'Historical Evolution'}
          </h3>
        </div>
      </div>

      <div className="relative border-l-2 border-custom-terracotta/30 ml-4 pl-8 space-y-10">
        {blocks.map((block, idx) => (
          <div key={block.id || idx} className="relative">
            <div className="absolute -left-[41px] top-4 w-4 h-4 rounded-full bg-custom-terracotta border-4 border-white shadow-sm" />
            <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-sm">
              {renderBlock ? renderBlock(block) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NarrativeTimelineLayout;
