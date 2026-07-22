import React from 'react';

/**
 * SpatialStructuralLayout (Presentation Strategy)
 * Responsive 2-column spatial arrangement container.
 * Left Column: Visuals, diagrams, and simulations.
 * Right Column: Structured pedagogical explanations, worked examples, and reflections.
 */
export const SpatialStructuralLayout = ({ page, renderBlock, context }) => {
  const blocks = page?.blocks || [];

  // Separate visual/simulation media blocks from text/explanation blocks
  const isMediaBlock = (block) => {
    const type = block?.block_type || '';
    return (
      type.startsWith('suggested_') ||
      type.endsWith('_placeholder') ||
      type === 'video_ref' ||
      type === 'simulation'
    );
  };

  const visualBlocks = blocks.filter(isMediaBlock);
  const textBlocks = blocks.filter((b) => !isMediaBlock(b));

  // If no visual blocks exist, render single column cleanly
  if (visualBlocks.length === 0) {
    return (
      <div className="layout-strategy spatial-layout max-w-4xl mx-auto space-y-8">
        {blocks.map((block, idx) => (
          <div key={block.id || idx}>{renderBlock ? renderBlock(block) : null}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="layout-strategy spatial-layout max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual & Media Panel (Sticky on Desktop) */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-8">
          <div className="bg-gradient-to-br from-custom-ochre/5 to-custom-sand/20 rounded-2xl p-4 border border-custom-ochre/15 shadow-sm">
            <span className="text-[10px] font-bold text-custom-ochre uppercase tracking-widest block mb-4">
              Spatial Visual Focus
            </span>
            <div className="space-y-6">
              {visualBlocks.map((block, idx) => (
                <div key={block.id || idx} className="rounded-xl overflow-hidden shadow-sm bg-white">
                  {renderBlock ? renderBlock(block) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pedagogical Content Panel */}
        <div className="lg:col-span-6 space-y-6">
          {textBlocks.map((block, idx) => (
            <div key={block.id || idx} className="spatial-text-moment">
              {renderBlock ? renderBlock(block) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpatialStructuralLayout;
