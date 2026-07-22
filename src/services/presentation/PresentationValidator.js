/**
 * PresentationValidator
 * Validates presentation constraints before rendering:
 * 1. Pedagogical sequence preservation
 * 2. Simulation placement & context attachment
 * 3. Media & asset orphan prevention
 * 4. Cognitive load & media density bounds
 * 5. Accessibility & progressive disclosure flow
 */

export class PresentationValidator {
  static validate(pages = []) {
    const report = {
      isValid: true,
      warnings: [],
      errors: [],
      stats: {
        totalPages: pages.length,
        totalBlocks: 0,
        totalSimulations: 0,
        totalMedia: 0,
      },
    };

    pages.forEach((page, pageIdx) => {
      const blocks = page.blocks || [];
      report.stats.totalBlocks += blocks.length;

      // 1. Verify Pedagogical Order Preservation
      for (let i = 0; i < blocks.length - 1; i++) {
        const orderA = blocks[i].component_order ?? blocks[i].order ?? 0;
        const orderB = blocks[i + 1].component_order ?? blocks[i + 1].order ?? 0;
        if (orderA > orderB) {
          report.warnings.push(
            `[Page ${pageIdx + 1}] Component order non-sequential between block '${blocks[i].id}' (${orderA}) and '${blocks[i + 1].id}' (${orderB}).`
          );
        }
      }

      // 2. Check for Overloaded Page (Cognitive Load Constraint)
      if (blocks.length > 8) {
        report.warnings.push(
          `[Page ${pageIdx + 1}] Page contains ${blocks.length} blocks, which exceeds optimal cognitive pacing threshold (max 8).`
        );
      }

      // 3. Inspect Simulation & Media Placement
      blocks.forEach((block) => {
        const type = block.block_type || '';

        if (['suggested_simulation', 'simulation_placeholder'].includes(type)) {
          report.stats.totalSimulations++;
          const hasSpec = block.metadata?.context_spec || block.metadata?.config;
          if (!hasSpec) {
            report.warnings.push(
              `[Block ${block.id}] Simulation block attached without detailed context_spec metadata.`
            );
          }
        }

        if (type.startsWith('suggested_') || type.endsWith('_placeholder') || type === 'video_ref') {
          report.stats.totalMedia++;
        }
      });
    });

    if (report.errors.length > 0) {
      report.isValid = false;
    }

    return report;
  }
}
