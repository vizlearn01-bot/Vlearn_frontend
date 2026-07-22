/**
 * LayoutRegistry
 * Dynamic registry of layout presentation strategies.
 * Replaces hardcoded switch statements with a pluggable registry.
 * Provides graceful fallback to 'DiscoveryLayout' with a warning.
 */

import { DiscoveryLayout } from '../../Components/LayoutTemplates/DiscoveryLayout';
import { ProcessLayout } from '../../Components/LayoutTemplates/ProcessLayout';
import { SpatialStructuralLayout } from '../../Components/LayoutTemplates/SpatialStructuralLayout';
import { ProceduralLayout } from '../../Components/LayoutTemplates/ProceduralLayout';
import { ComparativeLayout } from '../../Components/LayoutTemplates/ComparativeLayout';
import { NarrativeTimelineLayout } from '../../Components/LayoutTemplates/NarrativeTimelineLayout';

class LayoutRegistryService {
  constructor() {
    this.strategies = new Map();
    this.registerDefaults();
  }

  registerDefaults() {
    this.register('DiscoveryLayout', DiscoveryLayout);
    this.register('Discovery', DiscoveryLayout);

    this.register('ProcessLayout', ProcessLayout);
    this.register('Process', ProcessLayout);

    this.register('SpatialStructuralLayout', SpatialStructuralLayout);
    this.register('SpatialStructural', SpatialStructuralLayout);

    this.register('ProceduralLayout', ProceduralLayout);
    this.register('Procedural', ProceduralLayout);

    this.register('ComparativeLayout', ComparativeLayout);
    this.register('Comparative', ComparativeLayout);

    this.register('NarrativeTimelineLayout', NarrativeTimelineLayout);
    this.register('NarrativeTimeline', NarrativeTimelineLayout);
  }

  register(key, component) {
    if (!key || !component) return;
    this.strategies.set(key.toLowerCase(), component);
  }

  get(key) {
    if (!key) return this.getFallback('DiscoveryLayout');
    const normalizedKey = key.toLowerCase().trim();
    if (this.strategies.has(normalizedKey)) {
      return this.strategies.get(normalizedKey);
    }
    console.warn(
      `[PresentationEngine] Layout strategy '${key}' is unregistered. Falling back gracefully to 'DiscoveryLayout'.`
    );
    return this.getFallback('DiscoveryLayout');
  }

  getFallback(fallbackKey = 'DiscoveryLayout') {
    const key = fallbackKey.toLowerCase();
    return this.strategies.get(key) || DiscoveryLayout;
  }

  has(key) {
    return key && this.strategies.has(key.toLowerCase().trim());
  }

  listRegistered() {
    return Array.from(this.strategies.keys());
  }
}

export const LayoutRegistry = new LayoutRegistryService();
