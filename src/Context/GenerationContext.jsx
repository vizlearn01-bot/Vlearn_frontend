import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../config/apiClient';

const GenerationContext = createContext(null);

const STORAGE_KEY = 'vlearn_active_generation_jobs';

const PIPELINE_STEPS = [
    { label: 'Retrieving curriculum knowledge chunks...', pct: 20 },
    { label: 'Synthesizing pedagogical lesson structure...', pct: 45 },
    { label: 'Generating rich explanations & activities...', pct: 70 },
    { label: 'Assembling media, diagrams & formatting blocks...', pct: 90 },
];

export function GenerationProvider({ children }) {
    const [jobs, setJobs] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [isMonitorOpen, setIsMonitorOpen] = useState(false);
    const [isFloatingMinimized, setIsFloatingMinimized] = useState(false);
    const [activeToast, setActiveToast] = useState(null);

    // Synchronize to localStorage
    useEffect(() => {
        try {
            // Keep recent 30 jobs at most
            const trimmed = jobs.slice(-30);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        } catch (e) {
            console.warn('Failed to save generation jobs to localStorage', e);
        }
    }, [jobs]);

    // Track active jobs ref for polling loop
    const jobsRef = useRef(jobs);
    useEffect(() => {
        jobsRef.current = jobs;
    }, [jobs]);

    // ─────────────────────────────────────────────────────────────────────────
    // Polling Loop
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const hasActiveJobs = jobs.some(j => j.status === 'pending' || j.status === 'generating');
        if (!hasActiveJobs) return;

        const interval = setInterval(async () => {
            const currentJobs = jobsRef.current;
            const activeList = currentJobs.filter(j => j.status === 'pending' || j.status === 'generating');

            if (activeList.length === 0) return;

            for (const job of activeList) {
                try {
                    const res = await apiClient.get(`/api/curriculum/generation-jobs/${job.jobId}/`);
                    const backendStatus = res.data.status;
                    const errorMsg = res.data.error_message;

                    if (backendStatus === 'completed') {
                        setJobs(prev => prev.map(j => {
                            if (j.jobId !== job.jobId) return j;
                            return {
                                ...j,
                                status: 'completed',
                                step: 'Lesson generation complete!',
                                progressPercent: 100,
                                completedAt: Date.now(),
                            };
                        }));

                        // Trigger completion toast
                        setActiveToast({
                            type: 'success',
                            title: 'Lesson Generated!',
                            message: `Lesson for "${job.unitTitle || 'Learning Unit'}" is ready.`,
                            learningUnitId: job.learningUnitId,
                            jobId: job.jobId,
                        });

                        // Dispatch global event for listening pages (e.g. ContentStudio)
                        window.dispatchEvent(new CustomEvent('vlearn:lesson-generated', {
                            detail: { learningUnitId: job.learningUnitId, jobId: job.jobId }
                        }));

                    } else if (backendStatus === 'failed') {
                        const formattedError = errorMsg || "We couldn't complete the lesson generation. Please retry.";
                        setJobs(prev => prev.map(j => {
                            if (j.jobId !== job.jobId) return j;
                            return {
                                ...j,
                                status: 'failed',
                                step: 'Generation failed',
                                progressPercent: 100,
                                errorMessage: formattedError,
                                completedAt: Date.now(),
                            };
                        }));

                        setActiveToast({
                            type: 'error',
                            title: 'Generation Failed',
                            message: `Failed for "${job.unitTitle || 'Learning Unit'}": ${formattedError}`,
                            learningUnitId: job.learningUnitId,
                            jobId: job.jobId,
                        });
                    } else {
                        // Smoothly advance pipeline step
                        setJobs(prev => prev.map(j => {
                            if (j.jobId !== job.jobId) return j;
                            const nextStepIdx = Math.min((j.stepIndex || 0) + 1, PIPELINE_STEPS.length - 1);
                            return {
                                ...j,
                                status: 'generating',
                                stepIndex: nextStepIdx,
                                step: PIPELINE_STEPS[nextStepIdx].label,
                                progressPercent: PIPELINE_STEPS[nextStepIdx].pct,
                            };
                        }));
                    }
                } catch (err) {
                    // Transient network error during polling — keep trying up to 15 failures
                    setJobs(prev => prev.map(j => {
                        if (j.jobId !== job.jobId) return j;
                        const pollErrors = (j.pollErrors || 0) + 1;
                        if (pollErrors > 15) {
                            return {
                                ...j,
                                status: 'failed',
                                step: 'Connection timed out',
                                errorMessage: 'Server connection timed out while polling job.',
                                completedAt: Date.now(),
                            };
                        }
                        return { ...j, pollErrors };
                    }));
                }
            }
        }, 2500);

        return () => clearInterval(interval);
    }, [jobs.some(j => j.status === 'pending' || j.status === 'generating')]);

    // ─────────────────────────────────────────────────────────────────────────
    // Start Generation Action
    // ─────────────────────────────────────────────────────────────────────────
    const startGeneration = useCallback(async ({
        learningUnitId,
        unitTitle = 'Learning Unit',
        topicTitle = '',
        mode = 'learning_experience_planner',
    }) => {
        if (!learningUnitId) {
            throw new Error('learningUnitId is required to start generation.');
        }

        try {
            const response = await apiClient.post(
                `/api/curriculum/learning-units/${learningUnitId}/generate_lesson/`,
                { mode }
            );

            const jobId = response.data.jobId || response.data.job_id;

            const newJob = {
                jobId,
                learningUnitId,
                unitTitle,
                topicTitle,
                mode,
                status: 'generating',
                step: PIPELINE_STEPS[0].label,
                stepIndex: 0,
                progressPercent: PIPELINE_STEPS[0].pct,
                createdAt: Date.now(),
                completedAt: null,
                errorMessage: null,
                pollErrors: 0,
            };

            setJobs(prev => {
                // Replace any previous job for this unit with the fresh generation job
                const filtered = prev.filter(j => String(j.learningUnitId) !== String(learningUnitId));
                return [newJob, ...filtered];
            });

            // Automatically open floating indicator
            setIsFloatingMinimized(false);

            return { success: true, jobId };
        } catch (error) {
            const message = error.response?.data?.error || error.response?.data?.detail || error.message || 'Failed to start lesson generation.';
            setActiveToast({
                type: 'error',
                title: 'Start Failed',
                message,
                learningUnitId,
            });
            throw error;
        }
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // Helper Methods
    // ─────────────────────────────────────────────────────────────────────────
    const isGeneratingUnit = useCallback((unitId) => {
        if (!unitId) return false;
        return jobs.some(j => String(j.learningUnitId) === String(unitId) && (j.status === 'pending' || j.status === 'generating'));
    }, [jobs]);

    const getJobForUnit = useCallback((unitId) => {
        if (!unitId) return null;
        return jobs.find(j => String(j.learningUnitId) === String(unitId)) || null;
    }, [jobs]);

    const dismissJob = useCallback((jobId) => {
        setJobs(prev => prev.filter(j => j.jobId !== jobId));
    }, []);

    const clearCompleted = useCallback(() => {
        setJobs(prev => prev.filter(j => j.status === 'pending' || j.status === 'generating'));
    }, []);

    const activeJobs = jobs.filter(j => j.status === 'pending' || j.status === 'generating');
    const completedJobs = jobs.filter(j => j.status === 'completed');
    const failedJobs = jobs.filter(j => j.status === 'failed');

    const value = {
        jobs,
        activeJobs,
        completedJobs,
        failedJobs,
        startGeneration,
        isGeneratingUnit,
        getJobForUnit,
        dismissJob,
        clearCompleted,
        isMonitorOpen,
        setIsMonitorOpen,
        toggleMonitor: () => setIsMonitorOpen(prev => !prev),
        isFloatingMinimized,
        setIsFloatingMinimized,
        activeToast,
        dismissToast: () => setActiveToast(null),
    };

    return (
        <GenerationContext.Provider value={value}>
            {children}
        </GenerationContext.Provider>
    );
}

export function useGeneration() {
    const context = useContext(GenerationContext);
    if (!context) {
        throw new Error('useGeneration must be used within a GenerationProvider');
    }
    return context;
}

export default GenerationContext;
