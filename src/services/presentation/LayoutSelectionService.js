/**
 * LayoutSelectionService
 * Resolves per-page layout strategy keys from block or page metadata
 * via LayoutRegistry.
 */

import { LayoutRegistry } from './LayoutRegistry';

export class LayoutSelectionService {
  static resolveLayoutKey(page) {
    if (!page) return 'DiscoveryLayout';

    // 1. Check page explicit layoutTemplate
    if (page.layoutTemplate) {
      return page.layoutTemplate;
    }

    // 2. Check first block metadata
    if (page.blocks && page.blocks.length > 0) {
      const firstBlockLayout = page.blocks[0].metadata?.layout_template;
      if (firstBlockLayout) {
        return firstBlockLayout;
      }
    }

    return 'DiscoveryLayout';
  }

  static getStrategyComponent(layoutKey) {
    return LayoutRegistry.get(layoutKey);
  }
}
