/**
 * PresentationEngine
 * Main orchestrator for the presentation layer.
 * Flow:
 *   LearningExperiencePlan / Backend Blocks
 *          ↓
 *   Backend PresentationSpecification (if present) OR PresentationEngine Fallback Composition
 *          ↓
 *   Presentation Context Assembly
 *          ↓
 *   Presentation Constraint Validation
 *          ↓
 *   Per-Page Layout Strategy Resolution & Rendering
 */

import { PresentationContext } from './PresentationContext';
import { PresentationNormalizer } from './PresentationNormalizer';
import { PageGroupingService } from './PageGroupingService';
import { PresentationValidator } from './PresentationValidator';
import { LayoutSelectionService } from './LayoutSelectionService';

export class PresentationEngine {
  /**
   * Composes a complete presentation specification from raw lesson data.
   */
  static composeExperience(lesson, blocks = [], allAssets = []) {
    // 1. Check if backend provided a full presentation_spec
    if (lesson?.presentation_spec && Array.isArray(lesson.presentation_spec.pages)) {
      const pages = lesson.presentation_spec.pages;
      const validationReport = PresentationValidator.validate(pages);
      return {
        isBackendCompiled: true,
        pages,
        validationReport,
        getPresentationContext: (pageIdx) =>
          this.buildContextForPage(lesson, pages[pageIdx], pageIdx, pages.length, allAssets),
      };
    }

    // 2. Client-side Composition Fallback
    const sortedBlocks = PresentationNormalizer.sortBlocks(blocks);
    const pages = PageGroupingService.groupIntoPages(sortedBlocks);

    // Enrich each page with normalized learning moments
    const enrichedPages = pages.map((page) => ({
      ...page,
      moments: PresentationNormalizer.normalizeLearningMoments(page.blocks),
      resolvedLayoutKey: LayoutSelectionService.resolveLayoutKey(page),
    }));

    // 3. Presentation Constraint Validation
    const validationReport = PresentationValidator.validate(enrichedPages);

    return {
      isBackendCompiled: false,
      pages: enrichedPages,
      validationReport,
      getPresentationContext: (pageIdx) =>
        this.buildContextForPage(lesson, enrichedPages[pageIdx], pageIdx, enrichedPages.length, allAssets),
    };
  }

  static buildContextForPage(lesson, page, pageIdx, totalPages, allAssets = []) {
    if (!page) return PresentationContext.create();

    const pageBlockIds = new Set((page.blocks || []).map((b) => b.id));
    const pageAssets = allAssets.filter((a) =>
      a.blocks?.some((b) => (typeof b === 'object' ? pageBlockIds.has(b.id) : pageBlockIds.has(b)))
    );

    return PresentationContext.create({
      lessonId: lesson?.id || null,
      lessonTitle: lesson?.title || 'Learning Experience',
      conceptGroup: page.conceptGroup || page.pageTitle || `Page ${pageIdx + 1}`,
      learningObjectives: lesson?.learning_objectives || [],
      currentMoment: page.moments ? page.moments[0] : null,
      availableMedia: pageAssets,
      navigationState: {
        currentPage: pageIdx + 1,
        totalPages: totalPages,
        isFirstPage: pageIdx === 0,
        isLastPage: pageIdx === totalPages - 1,
      },
      metadata: {
        layoutTemplate: page.resolvedLayoutKey || page.layoutTemplate || 'DiscoveryLayout',
      },
    });
  }
}
