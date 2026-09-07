import React from 'react';
import { useNavigate } from 'react-router';
import { useGeneration } from '../../Context/GenerationContext';
import {
    Sparkles, Bell, CheckCircle, AlertCircle, X,
    ChevronDown, ChevronUp, RotateCcw, ExternalLink, Loader2
} from 'lucide-react';

export default function GenerationMonitor() {
    const navigate = useNavigate();
    const {
        jobs,
        activeJobs,
        completedJobs,
        failedJobs,
        startGeneration,
        dismissJob,
        clearCompleted,
        isMonitorOpen,
        setIsMonitorOpen,
        toggleMonitor,
        isFloatingMinimized,
        setIsFloatingMinimized,
        activeToast,
        dismissToast,
    } = useGeneration();

    const hasActive = activeJobs.length > 0;
    const totalJobs = jobs.length;

    const handleOpenLesson = (unitId) => {
        setIsMonitorOpen(false);
        navigate(`/admin-dashboard/content-studio/${unitId}`);
    };

    const handleRetry = async (job) => {
        try {
            await startGeneration({
                learningUnitId: job.learningUnitId,
                unitTitle: job.unitTitle,
                topicTitle: job.topicTitle,
                mode: job.mode,
            });
        } catch (e) {
            console.error('Retry failed', e);
        }
    };

    return (
        <>
            {/* ── Fixed Bottom-Right Generation Trigger / Floating Dock ─────────── */}
            {!isMonitorOpen && hasActive && !isFloatingMinimized ? (
                /* Active Progress Card (Expanded) */
                <div className="fixed bottom-5 right-5 z-40 animate-slide-up">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3.5 max-w-sm w-80 text-gray-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-custom-blue"></span>
                                </span>
                                <span className="text-xs font-bold text-gray-800">
                                    Generating Lesson ({activeJobs.length})
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsFloatingMinimized(true)}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                                    title="Minimize to pill"
                                >
                                    <ChevronDown size={14} />
                                </button>
                                <button
                                    onClick={() => setIsMonitorOpen(true)}
                                    className="p-1 text-custom-blue hover:text-blue-700 font-semibold text-xs"
                                    title="Expand full monitor"
                                >
                                    Expand
                                </button>
                            </div>
                        </div>

                        {/* Active job preview (first one) */}
                        {activeJobs[0] && (
                            <div className="space-y-1 bg-gray-50 p-2 rounded-xl border border-gray-100">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-bold text-gray-700 truncate max-w-[170px]" title={activeJobs[0].unitTitle}>
                                        {activeJobs[0].unitTitle}
                                    </span>
                                    <span className="font-mono font-semibold text-custom-blue">
                                        {activeJobs[0].progressPercent}%
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-500 truncate">
                                    {activeJobs[0].step}
                                </p>
                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-custom-blue transition-all duration-300 rounded-full"
                                        style={{ width: `${activeJobs[0].progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <p className="text-[10px] text-gray-400 italic text-center">
                            Safe to navigate. Tasks continue in background.
                        </p>
                    </div>
                </div>
            ) : (
                /* Bell Icon Button or Minimized Pill */
                <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
                    <button
                        onClick={toggleMonitor}
                        className={`relative p-3 rounded-full transition-all shadow-lg flex items-center gap-2 text-xs font-semibold ${
                            hasActive
                                ? 'bg-custom-blue text-white ring-4 ring-blue-200/60 shadow-blue-500/20'
                                : totalJobs > 0
                                ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                        }`}
                        title={hasActive ? `${activeJobs.length} active generations (click to open monitor)` : 'AI Generation Monitor'}
                        aria-label="Toggle Generation Monitor"
                    >
                        {hasActive ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                <span className="font-bold">
                                    {activeJobs.length} Generating...
                                </span>
                                <ChevronUp
                                    size={14}
                                    className="hover:text-blue-200 ml-0.5"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsFloatingMinimized(false);
                                    }}
                                    title="Expand progress card"
                                />
                            </>
                        ) : (
                            <Bell size={18} />
                        )}

                        {/* Active badge */}
                        {hasActive && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-custom-orange text-[9px] font-bold text-white items-center justify-center">
                                    {activeJobs.length}
                                </span>
                            </span>
                        )}

                        {!hasActive && completedJobs.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white items-center justify-center">
                                <span className="text-[8px] font-bold text-white leading-none">✓</span>
                            </span>
                        )}
                    </button>
                </div>
            )}

            {/* ── Slide-up Panel / Popover from Bottom-Right ─────────────── */}
            {isMonitorOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                        onClick={() => setIsMonitorOpen(false)}
                    />
                    <div className="fixed bottom-16 right-5 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slide-up">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-50 text-custom-blue rounded-lg">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">AI Generations</h3>
                                <p className="text-[11px] text-gray-500">
                                    {activeJobs.length} running • {completedJobs.length} completed
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {(completedJobs.length > 0 || failedJobs.length > 0) && (
                                <button
                                    onClick={clearCompleted}
                                    className="px-2 py-1 text-[11px] font-medium text-gray-500 hover:text-gray-800 rounded transition-colors"
                                    title="Clear completed and failed jobs"
                                >
                                    Clear finished
                                </button>
                            )}
                            <button
                                onClick={() => setIsMonitorOpen(false)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Jobs List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-100">
                        {jobs.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 space-y-2">
                                <Sparkles size={28} className="mx-auto text-gray-300" />
                                <p className="text-xs font-medium">No recent generation jobs</p>
                                <p className="text-[11px] text-gray-400 max-w-[200px] mx-auto">
                                    Click "Generate with AI" on any learning unit to create a lesson.
                                </p>
                            </div>
                        ) : (
                            jobs.map((job) => (
                                <div key={job.jobId} className="pt-3 first:pt-0">
                                    {/* Top row: Title and Status */}
                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-xs font-bold text-gray-800 truncate" title={job.unitTitle}>
                                                {job.unitTitle || 'Learning Unit'}
                                            </h4>
                                            {job.topicTitle && (
                                                <p className="text-[10px] text-gray-400 truncate">
                                                    {job.topicTitle}
                                                </p>
                                            )}
                                        </div>

                                        {/* Status badge */}
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            {job.status === 'generating' && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-custom-blue flex items-center gap-1 border border-blue-100">
                                                    <Loader2 size={10} className="animate-spin" /> Generating
                                                </span>
                                            )}
                                            {job.status === 'completed' && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 flex items-center gap-1 border border-emerald-100">
                                                    <CheckCircle size={10} /> Ready
                                                </span>
                                            )}
                                            {job.status === 'failed' && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 flex items-center gap-1 border border-rose-100">
                                                    <AlertCircle size={10} /> Failed
                                                </span>
                                            )}
                                            <button
                                                onClick={() => dismissJob(job.jobId)}
                                                className="text-gray-300 hover:text-gray-500 p-0.5"
                                                title="Dismiss"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress or Step */}
                                    {job.status === 'generating' && (
                                        <div className="space-y-1.5 mt-2 bg-blue-50/50 p-2 rounded-lg border border-blue-100/60">
                                            <div className="flex justify-between text-[11px] text-gray-600">
                                                <span className="truncate">{job.step}</span>
                                                <span className="font-mono font-bold text-custom-blue">{job.progressPercent}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-custom-blue to-indigo-500 transition-all duration-500 rounded-full"
                                                    style={{ width: `${job.progressPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Completed Action */}
                                    {job.status === 'completed' && (
                                        <div className="mt-2 flex items-center justify-between bg-emerald-50/40 p-2 rounded-lg border border-emerald-100/60">
                                            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                                                <CheckCircle size={12} className="text-emerald-500" /> Complete
                                            </span>
                                            <button
                                                onClick={() => handleOpenLesson(job.learningUnitId)}
                                                className="px-2.5 py-1 text-xs font-bold rounded-md bg-custom-blue text-white hover:opacity-90 transition-all flex items-center gap-1 shadow-xs"
                                            >
                                                <ExternalLink size={11} /> Open Lesson
                                            </button>
                                        </div>
                                    )}

                                    {/* Failed Details & Retry */}
                                    {job.status === 'failed' && (
                                        <div className="mt-2 space-y-1.5 bg-rose-50/40 p-2 rounded-lg border border-rose-100/60">
                                            <p className="text-[11px] text-rose-700 leading-snug line-clamp-2">
                                                {job.errorMessage || 'Unknown generation failure.'}
                                            </p>
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleRetry(job)}
                                                    className="px-2.5 py-1 text-xs font-bold rounded-md bg-rose-600 text-white hover:bg-rose-700 transition-all flex items-center gap-1"
                                                >
                                                    <RotateCcw size={11} /> Retry
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                </>
            )}


            {/* ── Auto-dismissing Toast Notification ──────────────────────── */}
            {activeToast && (
                <div className={`fixed bottom-20 right-6 z-50 flex items-start gap-3 p-4 rounded-xl shadow-2xl max-w-sm border transition-all animate-slide-left ${
                    activeToast.type === 'error'
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                    {activeToast.type === 'error' ? (
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
                    ) : (
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">{activeToast.title}</p>
                        <p className="text-xs mt-0.5 leading-snug">{activeToast.message}</p>
                        {activeToast.learningUnitId && activeToast.type === 'success' && (
                            <button
                                onClick={() => {
                                    dismissToast();
                                    handleOpenLesson(activeToast.learningUnitId);
                                }}
                                className="mt-2 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition shadow-xs flex items-center gap-1"
                            >
                                <ExternalLink size={12} /> View Lesson
                            </button>
                        )}
                    </div>
                    <button
                        onClick={dismissToast}
                        className="opacity-50 hover:opacity-100 p-0.5 text-gray-500"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
        </>
    );
}
