/**
 * PresentationNormalizer
 * Preserves LLM pedagogical node ordering (component_order / order)
 * and aggregates raw blocks into structured LearningMoment units.
 */

export class LearningMoment {
  constructor({ id, type, title, blocks = [], layoutTemplate = 'DiscoveryLayout', metadata = {} }) {
    this.id = id;
    this.type = type; // e.g., 'hook', 'explanation', 'phenomenon', 'simulation', 'practice', 'reflection'
    this.title = title;
    this.blocks = blocks;
    this.layoutTemplate = layoutTemplate;
    this.metadata = metadata;
  }
}

export class PresentationNormalizer {
  /**
   * Sorts blocks strictly preserving Agent 3 ordering metadata.
   */
  static sortBlocks(blocks = []) {
    return [...blocks].sort((a, b) => {
      const orderA = a.component_order ?? a.order ?? 999;
      const orderB = b.component_order ?? b.order ?? 999;
      return orderA - orderB;
    });
  }

  /**
   * Group flat blocks into structured LearningMoment objects.
   */
  static normalizeLearningMoments(blocks = []) {
    const sorted = this.sortBlocks(blocks);
    const moments = [];

    sorted.forEach((block) => {
      const type = block.block_type || 'concept_explanation';
      const momentType = block.metadata?.learning_moment || this.inferMomentType(type);
      const layoutTemplate = block.metadata?.layout_template || 'DiscoveryLayout';

      // Check if current block belongs to previous open moment or starts a new one
      const lastMoment = moments[moments.length - 1];

      if (lastMoment && lastMoment.type === momentType && !this.isStandaloneMomentType(type)) {
        lastMoment.blocks.push(block);
      } else {
        moments.push(
          new LearningMoment({
            id: `moment_${moments.length + 1}_${block.id}`,
            type: momentType,
            title: block.title || momentType.replace(/_/g, ' '),
            blocks: [block],
            layoutTemplate: layoutTemplate,
            metadata: block.metadata || {},
          })
        );
      }
    });

    return moments;
  }

  static inferMomentType(blockType) {
    if (['hook', 'story', 'learning_goal'].includes(blockType)) return 'orient_and_engage';
    if (['prediction', 'experiment'].includes(blockType)) return 'observe_and_predict';
    if (['concept_explanation', 'definitions', 'analogy'].includes(blockType)) return 'core_explanation';
    if (['worked_example', 'real_world_example', 'formula_breakdown'].includes(blockType)) return 'deepen_understanding';
    if (['suggested_simulation', 'simulation_placeholder'].includes(blockType)) return 'interactive_simulation';
    if (['knowledge_check', 'multiple_choice', 'true_false', 'short_answer'].includes(blockType)) return 'check_understanding';
    if (['summary', 'key_takeaway', 'reflection', 'common_misconception'].includes(blockType)) return 'reflect_and_consolidate';
    return 'core_explanation';
  }

  static isStandaloneMomentType(blockType) {
    return [
      'suggested_simulation',
      'simulation_placeholder',
      'knowledge_check',
      'summary',
      'worked_example',
    ].includes(blockType);
  }
}
