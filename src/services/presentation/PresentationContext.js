/**
 * PresentationContext
 * Encapsulates lesson metadata, current learning moment, available media,
 * learning objectives, and navigation state into a unified object.
 * Prevents prop explosion across layout strategies.
 */
export class PresentationContext {
  constructor({
    lessonId = null,
    lessonTitle = '',
    conceptGroup = '',
    learningObjectives = [],
    currentMoment = null,
    availableMedia = [],
    navigationState = { currentPage: 1, totalPages: 1, isFirstPage: true, isLastPage: true },
    metadata = {}
  } = {}) {
    this.lessonId = lessonId;
    this.lessonTitle = lessonTitle;
    this.conceptGroup = conceptGroup;
    this.learningObjectives = learningObjectives;
    this.currentMoment = currentMoment;
    this.availableMedia = availableMedia;
    this.navigationState = navigationState;
    this.metadata = metadata;
  }

  static create(params = {}) {
    return new PresentationContext(params);
  }
}
