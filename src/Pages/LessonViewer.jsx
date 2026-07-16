import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { BlockRenderer } from '../Components/LessonBlocks/BlockRenderer';
import { ConceptCompletionCard } from '../Components/LessonBlocks/BlueprintComponents';
import apiClient from '../config/apiClient';
import { ContentNormalizer } from '../utils/ContentNormalizer';
import {
    ChevronLeft, ChevronRight, BookOpen, Clock,
    CheckCircle, Circle, LayoutList, Zap
} from 'lucide-react';
import { useLessonProgress } from '../Hooks/useLessonProgress';
import { LessonTimeline, LessonCompletionCard, LessonResumeBanner } from '../Components/LessonBlocks/LessonProgressComponents';

// ─────────────────────────────────────────────────────────────────────────────
// Page grouping helper (mirrors ConceptNavigator logic)
// ─────────────────────────────────────────────────────────────────────────────
const blockOrder = {
    'learning_goal': 1,
    'objectives': 1,
    'hook': 1,
    'story': 2,
    'overview': 2,
    'introduction': 2,
    'definitions': 3,
    'core_explanation': 4,
    'concept_explanation': 4,
    'visual_learning': 4,
    'analogy': 4,
    'suggested_diagram': 5,
    'suggested_illustration': 5,
    'suggested_image': 5,
    'suggested_infographic': 5,
    'suggested_table': 5,
    'suggested_graph': 5,
    'suggested_timeline': 5,
    'suggested_flowchart': 5,
    'suggested_mind_map': 5,
    'image_placeholder': 5,
    'diagram_placeholder': 5,
    'suggested_gif': 5,
    'video_ref': 6,
    'suggested_video': 6,
    'repository_asset': 6,
    'experiment': 7,
    'classroom_activity': 7,
    'discussion_prompt': 7,
    'suggested_simulation': 8,
    'simulation_placeholder': 8,
    'suggested_external_link': 8,
    'worked_example': 9,
    'real_world_example': 9,
    'knowledge_check': 10,
    'multiple_choice': 10,
    'true_false': 10,
    'fill_in_the_blank': 10,
    'short_answer': 10,
    'reflection': 10,
    'revision_questions': 10,
    'common_misconception': 11,
    'key_takeaway': 12,
    'summary': 13
};

function groupBlocksIntoPages(blocks) {
    const pages = {};
    const order = [];
    let currentVirtualPage = 1;

    blocks.forEach((block, index) => {
        let key = block.page_number;
        
        if (key == null) {
            // Intelligent grouping for legacy lessons
            if (index > 0 && (block.block_type === 'overview' || block.block_type === 'knowledge_check' || block.block_type === 'revision_questions' || block.block_type === 'summary')) {
                currentVirtualPage++;
            }
            key = `v1_virtual_page_${currentVirtualPage}`;
        }

        if (!pages[key]) {
            pages[key] = {
                key,
                title: block.page_title || block.title || `Concept ${order.length + 1}`,
                blocks: [],
            };
            order.push(key);
        }
        pages[key].blocks.push(block);
    });

    return order.map((k) => {
        const page = pages[k];
        page.blocks.sort((a, b) => {
            if (a.component_order !== undefined && b.component_order !== undefined && a.component_order !== null && b.component_order !== null) {
                return a.component_order - b.component_order;
            }
            const orderA = blockOrder[a.block_type] || 50;
            const orderB = blockOrder[b.block_type] || 50;
            return orderA - orderB;
        });
        return page;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Region grouping helper (Migration mapping)
// ─────────────────────────────────────────────────────────────────────────────
function getFallbackRegion(blockType) {
    const heroTypes = ['learning_goal', 'objectives', 'hook', 'story', 'introduction', 'overview'];
    const coreTypes = ['concept_explanation', 'core_explanation', 'definitions', 'formula_breakdown'];
    const visualTypes = ['visual_learning', 'suggested_diagram', 'suggested_illustration', 'suggested_image', 'image_placeholder', 'diagram_placeholder', 'suggested_gif', 'video_ref', 'suggested_video', 'repository_asset', 'suggested_infographic', 'suggested_table', 'suggested_graph', 'suggested_timeline', 'suggested_flowchart', 'suggested_mind_map'];
    const engagementTypes = ['experiment', 'classroom_activity', 'discussion_prompt', 'suggested_simulation', 'simulation_placeholder', 'mini_activity', 'suggested_activity', 'suggested_external_link'];
    const contextTypes = ['worked_example', 'real_world_example', 'real_world_connection', 'analogy'];
    const checkTypes = ['knowledge_check', 'multiple_choice', 'true_false', 'fill_in_the_blank', 'short_answer', 'revision_questions', 'prediction', 'reflection'];
    const coachingTypes = ['common_misconception', 'common_mistake', 'callout', 'quick_fact', 'did_you_know', 'memory_tip', 'before_you_continue', 'transition'];
    const summaryTypes = ['key_takeaway', 'summary'];

    if (heroTypes.includes(blockType)) return 'hero';
    if (coreTypes.includes(blockType)) return 'core';
    if (visualTypes.includes(blockType)) return 'visual';
    if (engagementTypes.includes(blockType)) return 'engagement';
    if (contextTypes.includes(blockType)) return 'context';
    if (checkTypes.includes(blockType)) return 'check';
    if (coachingTypes.includes(blockType)) return 'coaching';
    if (summaryTypes.includes(blockType)) return 'summary';
    
    return 'core'; // default fallback
}

function groupBlocksIntoRegions(blocks) {
    const regions = {
        hero: [],
        core: [],
        visual: [],
        engagement: [],
        context: [],
        coaching: [],
        check: [],
        summary: [],
        uncategorized: []
    };

    blocks.forEach(block => {
        if (!ContentNormalizer.hasContent(block)) return;

        // Use backend supplied region if available, otherwise fallback
        const region = block.region || getFallbackRegion(block.block_type);
        if (regions[region]) {
            regions[region].push(block);
        } else {
            // If backend provides a new unknown region, capture it dynamically
            regions[region] = [block];
        }
    });

    return regions;
}

// ─────────────────────────────────────────────────────────────────────────────
// Estimated reading time (rough: 200 wpm)
// ─────────────────────────────────────────────────────────────────────────────
function estimateReadingTime(blocks) {
    let seconds = 0;
    blocks.forEach((b) => {
        const type = b.block_type;
        if (type === 'video_ref' || type === 'suggested_video') {
            seconds += 180;
        } else if (type === 'image_placeholder' || type === 'suggested_image' || type === 'suggested_diagram') {
            seconds += 60;
        } else if (type === 'knowledge_check' || type === 'revision_questions') {
            seconds += 120;
        } else if (type === 'experiment' || type === 'mini_activity' || type === 'suggested_activity') {
            seconds += 120;
        } else if (type === 'suggested_simulation') {
            seconds += 180;
        }
        
        const textStr = ContentNormalizer.extractText(b.content);
        const words = textStr.split(/\s+/).filter(Boolean).length;
        seconds += (words / 200) * 60;
    });
    return Math.max(1, Math.ceil(seconds / 60));
}

// ─────────────────────────────────────────────────────────────────────────────
// LessonViewer
//
// Modes:
//   - Default (paginated=false): V1 scrolling behaviour — UNCHANGED
//   - paginated=true            : concept-by-concept student experience
//
// The ContentStudio uses paginated=false (default) so the existing preview
// in the old layout continues to work without any change.
// The new student route can pass paginated={true}.
// ─────────────────────────────────────────────────────────────────────────────
export const LessonViewer = ({ lessonData, paginated = false }) => {
    const { topicId } = useParams();
    const [lesson, setLesson] = useState(lessonData || null);
    const [loading, setLoading] = useState(!lessonData);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (lessonData) {
            setLesson(lessonData);
            setLoading(false);
            return;
        }
        if (!topicId) {
            setError('No topic specified.');
            setLoading(false);
            return;
        }
        const fetchLesson = async () => {
            try {
                const searchParams = new URLSearchParams(window.location.search);
                const isPreview = searchParams.get('preview') === 'true';
                const url = `/api/curriculum/topics/${topicId}/lesson/${isPreview ? '?preview=true' : ''}`;
                
                const response = await apiClient.get(url);
                setLesson(response.data);
            } catch (err) {
                setError(
                    err.response?.status === 404
                        ? 'No published lesson is available for this topic yet.'
                        : 'Failed to load lesson. Please try again.'
                );
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [topicId, lessonData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-blue-600 font-semibold animate-pulse">Loading Lesson...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-red-50 text-red-600 p-6 rounded-lg shadow-md max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-2">Unable to Load Lesson</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-400 text-center">
                    <p className="text-lg font-medium">No lesson content available.</p>
                    <p className="text-sm mt-1">This topic has not been published yet.</p>
                </div>
            </div>
        );
    }

    // ── Render ──────────────────────────────────────────────────────────────
    if (paginated && lesson.blocks && lesson.blocks.length > 0) {
        const searchParams = new URLSearchParams(window.location.search);
        const isPreview = searchParams.get('preview') === 'true';
        return <PaginatedViewer lesson={lesson} topicId={topicId} isPreview={isPreview} />;
    }

    // ── V1 scrolling mode (default, unchanged) ───────────────────────────────
    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold mb-4">{lesson.title}</h1>
                    <div className="flex gap-4 text-sm opacity-80">
                        <span className="bg-white/20 px-3 py-1 rounded-full">Version: {lesson.version}</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full capitalize">Status: {lesson.status}</span>
                        {lesson.published_at && (
                            <span className="bg-white/20 px-3 py-1 rounded-full">
                                Published: {new Date(lesson.published_at).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="space-y-6">
                    {lesson.blocks && lesson.blocks.map((block) => (
                        <BlockRenderer key={block.id} block={block} />
                    ))}
                </div>
                {(!lesson.blocks || lesson.blocks.length === 0) && (
                    <div className="text-center text-gray-500 py-12 border-2 border-dashed border-gray-200 rounded-lg">
                        This lesson has no content blocks yet.
                    </div>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Paginated Viewer — one concept at a time
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function PaginatedViewer({ lesson, topicId, isPreview }) {
    const navigate = useNavigate();
    const pages = groupBlocksIntoPages(lesson.blocks || []);
    const totalPages = pages.length;
    
    const progress = useLessonProgress(lesson.id, totalPages, isPreview);
    const { 
        savedConceptIndex,
        completedConcepts,
        isCompleted,
        completionPercentage,
        markConceptCompleted,
        saveCurrentConcept,
        completeLesson,
        updateMetadata
    } = progress;

    useEffect(() => {
        if (lesson?.title) {
            updateMetadata(lesson.title, topicId, totalPages);
        }
    }, [lesson?.title, topicId, totalPages, updateMetadata]);

    const [pageIndex, setPageIndex] = useState(savedConceptIndex || 0);
    const [showContents, setShowContents] = useState(false);
    const [interactedBlocks, setInteractedBlocks] = useState(new Set());
    const [topicData, setTopicData] = useState(null);

    useEffect(() => {
        if (topicId) {
            apiClient.get(`/api/curriculum/topics/${topicId}/`).then(res => setTopicData(res.data)).catch(console.error);
        }
    }, [topicId]);

    const currentPage = pages[pageIndex];
    const readingTime = estimateReadingTime(currentPage?.blocks || []);
    const totalReadingTime = estimateReadingTime(lesson.blocks || []);

    const navigateTo = useCallback((idx) => {
        setPageIndex(idx);
        saveCurrentConcept(idx);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [saveCurrentConcept]);

    const goNext = useCallback(() => {
        markConceptCompleted(pageIndex);
        const nextIdx = Math.min(pageIndex + 1, totalPages - 1);
        navigateTo(nextIdx);
    }, [pageIndex, totalPages, markConceptCompleted, navigateTo]);

    const goPrev = useCallback(() => {
        navigateTo(Math.max(pageIndex - 1, 0));
    }, [pageIndex, navigateTo]);

    const handleComplete = () => {
        markConceptCompleted(pageIndex);
        completeLesson();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const knowledgeCheckBlocks = currentPage?.blocks?.filter(b => 
        b.block_type === 'knowledge_check' || b.block_type === 'revision_questions'
    ) || [];
    const isGated = knowledgeCheckBlocks.some(b => !interactedBlocks.has(b.id));

    const handleInteract = useCallback((blockId) => {
        setInteractedBlocks((prev) => new Set([...prev, blockId]));
    }, []);

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <LessonCompletionCard 
                    lessonTitle={lesson.title}
                    completedConceptsCount={totalPages}
                    estimatedStudyTime={totalReadingTime}
                    onBackToTopic={() => navigate(-1)}
                    onReview={() => {
                        progress.resetProgress();
                        setPageIndex(0);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-custom-cream font-sans flex flex-col">
            {/* ── Top bar ──────────────────────────────────────────────── */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
                {/* Progress bar */}
                <div className="h-1 bg-gray-100">
                    <div
                        className="h-1 bg-custom-terracotta transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>

                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    {/* Lesson title + progress meta */}
                    <div className="flex-1 min-w-0">
                        {topicData && (
                            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                                <button onClick={() => navigate('/dashboard')} className="hover:text-custom-blue transition-colors">Dashboard</button>
                                <ChevronRight size={12} className="text-gray-300" />
                                <span className="hover:text-custom-blue cursor-pointer transition-colors" onClick={() => navigate(`/dashboard/subject/${topicData.subject}`)}>{topicData.subject_name}</span>
                                <ChevronRight size={12} className="text-gray-300" />
                                <span>{topicData.name}</span>
                            </div>
                        )}
                        <h1 className="text-sm font-bold text-gray-800 truncate">{lesson.title}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-custom-blue font-bold">
                                {completionPercentage}% complete
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock size={11} />
                                ~{Math.max(0, totalReadingTime - Math.round(totalReadingTime * completionPercentage / 100))} min left
                            </span>
                        </div>
                    </div>

                    {/* Contents toggle */}
                    <button
                        onClick={() => setShowContents((v) => !v)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        title="All concepts"
                    >
                        <LayoutList size={16} />
                    </button>
                </div>
            </div>

            {/* ── Table of Contents overlay ─────────────────────────────── */}
            {showContents && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 flex items-start justify-center pt-20"
                    onClick={() => setShowContents(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800">Table of Contents</h2>
                            <p className="text-xs text-gray-500 mt-0.5">{lesson.title}</p>
                        </div>
                        <div className="max-h-80 overflow-y-auto p-2">
                            {pages.map((page, idx) => {
                                const isDone = completedConcepts.includes(idx);
                                const isCurrent = idx === pageIndex;
                                return (
                                    <button
                                        key={page.key}
                                        onClick={() => { navigateTo(idx); setShowContents(false); }}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                            isCurrent ? 'bg-blue-50' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="flex-shrink-0">
                                            {isDone
                                                ? <CheckCircle size={16} className="text-emerald-500" />
                                                : isCurrent
                                                ? <Circle size={16} className="text-custom-blue fill-custom-blue/20" />
                                                : <Circle size={16} className="text-gray-300" />
                                            }
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${isCurrent ? 'text-custom-blue' : 'text-gray-700'}`}>
                                                {page.title}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400 flex-shrink-0">
                                            {idx + 1}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Page content ─────────────────────────────────────────── */}
            <div key={pageIndex} className="flex-1 w-full animate-slide-up-fade">
                
                {/* We render regions sequentially based on standard layout flow */}
                {(() => {
                    const regions = groupBlocksIntoRegions(currentPage?.blocks || []);
                    
                    return (
                        <div className="max-w-4xl mx-auto w-full px-4 py-10 lg:py-16">
                            
                            {/* Hero Region */}
                            {(regions.hero?.length > 0 || currentPage?.title) && (
                                <div className="mb-12 pb-8 border-b border-gray-200/60">
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="text-[11px] font-bold text-custom-terracotta bg-red-50/50 px-3 py-1 rounded-full uppercase tracking-widest border border-red-100/50">
                                            Concept {pageIndex + 1} of {totalPages}
                                        </span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                                            <Clock size={12} /> ~{readingTime} min read
                                        </span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-8">
                                        {currentPage?.title}
                                    </h2>
                                    <div className="space-y-6">
                                        {regions.hero?.map((block) => (
                                            <BlockRenderer key={block.id} block={block} onInteract={handleInteract} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Core, Visual, Context, Coaching Interleaved (Basic flow) */}
                            <div className="space-y-12">
                                {/* Core Region */}
                                {regions.core?.length > 0 && (
                                    <div className="space-y-6">
                                        {regions.core.map((block) => (
                                            <BlockRenderer key={block.id} block={block} onInteract={handleInteract} />
                                        ))}
                                    </div>
                                )}
                                
                                {/* Visual Region */}
                                {regions.visual?.length > 0 && (
                                    <div className="space-y-8 my-10 px-2 sm:px-8 bg-white/50 rounded-3xl py-8 border border-gray-100">
                                        {regions.visual.map((block) => (
                                            <BlockRenderer key={block.id} block={block} onInteract={handleInteract} />
                                        ))}
                                    </div>
                                )}

                                {/* Context Region */}
                                {regions.context?.length > 0 && (
                                    <div className="space-y-6">
                                        {regions.context.map((block) => (
                                            <BlockRenderer key={block.id} block={block} onInteract={handleInteract} />
                                        ))}
                                    </div>
                                )}

                                {/* Engagement Region */}
                                {regions.engagement?.length > 0 && (
                                    <div className="space-y-6">
                                        {regions.engagement.map((block) => (
                                            <BlockRenderer key={block.id} block={block} onInteract={handleInteract} />
                                        ))}
                                    </div>
                                )}

                                {/* Coaching Region */}
                                {regions.coaching?.length > 0 && (
                                    <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {regions.coaching.map((block) => (
                                            <div key={block.id} className="break-inside-avoid">
                                                <BlockRenderer block={block} onInteract={handleInteract} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Check Region */}
                            {regions.check?.length > 0 && (
                                <div className="mt-16 pt-12 border-t border-gray-200/60">
                                    <div className="space-y-8">
                                        {regions.check.map((block) => (
                                            <BlockRenderer key={block.id} block={block} onInteract={handleInteract} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Summary Region */}
                            {regions.summary?.length > 0 && (
                                <div className="mt-12">
                                    <div className="space-y-6">
                                        {regions.summary.map((block) => (
                                            <BlockRenderer key={block.id} block={block} onInteract={handleInteract} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Render any unrecognized regions (for future compatibility) */}
                            {Object.entries(regions).filter(([k, v]) => !['hero', 'core', 'visual', 'engagement', 'context', 'check', 'coaching', 'summary'].includes(k) && v.length > 0).map(([regionName, blocks]) => (
                                <div key={regionName} className="mt-12">
                                    <div className="space-y-6">
                                        {blocks.map((block) => (
                                            <BlockRenderer key={block.id} block={block} onInteract={handleInteract} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })()}

                {/* Concept completion card */}
                <div className="max-w-4xl mx-auto px-4">
                    <ConceptCompletionCard
                        page={currentPage}
                        nextPageTitle={pageIndex < totalPages - 1 ? pages[pageIndex + 1]?.title : null}
                        isLast={pageIndex === totalPages - 1}
                    />
                </div>

                <div className="max-w-4xl mx-auto px-4 pb-12">
                    <LessonTimeline 
                        totalPages={totalPages} 
                        currentPageIndex={pageIndex} 
                        completedConcepts={completedConcepts} 
                        onNavigate={navigateTo} 
                    />
                </div>
            </div>

            {/* ── Navigation footer ─────────────────────────────────────── */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-200/60 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={goPrev}
                        disabled={pageIndex === 0}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                            pageIndex === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <ChevronLeft size={18} /> Previous
                    </button>

                    {/* Completion message on last page */}
                    {pageIndex === totalPages - 1 ? (
                        <button
                            onClick={handleComplete}
                            disabled={isGated}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                                isGated ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600'
                            }`}
                        >
                            <CheckCircle size={16} /> Complete Lesson
                        </button>
                    ) : (
                        <button
                            onClick={goNext}
                            disabled={isGated}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                                isGated ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-custom-terracotta text-white hover:bg-custom-terracotta-dark'
                            }`}
                        >
                            Next Concept <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
