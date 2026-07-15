import React from 'react';
import { Brain, FileText, ImageIcon, Activity, Clock, CheckCircle } from 'lucide-react';

export default function AIReviewPanel({ lesson, blocks, assets }) {
    // Heuristic computations for the review panel
    const totalAssets = assets.length;
    const repoAssets = assets.filter(a => a.source_type === 'knowledge_repository').length;
    const repoCoverage = totalAssets === 0 ? 100 : Math.round((repoAssets / totalAssets) * 100);
    
    const missingAssets = assets.filter(a => a.status === 'pending').length;
    const visualOpps = blocks.filter(b => ['suggested_diagram', 'suggested_video', 'suggested_image', 'image_placeholder', 'video_ref'].includes(b.block_type)).length;

    let wordCount = 0;
    blocks.forEach(b => {
        let text = b.content || '';
        if (typeof text === 'object') text = JSON.stringify(text);
        wordCount += text.split(/\s+/).length;
    });
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const kcCount = blocks.filter(b => ['knowledge_check', 'revision_questions'].includes(b.block_type)).length;
    const actCount = blocks.filter(b => b.block_type === 'experiment').length;

    // A fake pedagogy score based on component diversity
    const hasGoals = blocks.some(b => ['learning_goal', 'objectives'].includes(b.block_type));
    const hasSummary = blocks.some(b => b.block_type === 'summary');
    let pedagogyScore = 'Moderate';
    if (hasGoals && hasSummary && kcCount > 0 && visualOpps > 0) pedagogyScore = 'High';
    
    let genQuality = 94; // Dummy AI metric
    
    return (
        <div className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col h-full overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200 bg-white sticky top-0">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <Brain size={16} className="text-custom-blue" /> AI Review
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Instructional Designer</p>
            </div>

            <div className="p-4 space-y-6">
                
                {/* Generation Quality */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quality</p>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Generation Quality</span>
                        <span className="text-sm font-bold text-emerald-600">{genQuality}%</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-700">Pedagogy Score</span>
                        <span className="text-sm font-bold text-custom-blue">{pedagogyScore}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-700">Repository Coverage</span>
                        <span className="text-sm font-bold text-gray-800">{repoCoverage}%</span>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Content Metrics */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Content</p>
                    <div className="space-y-3">
                        <MetricRow icon={FileText} label="Reading Difficulty" value="Moderate" />
                        <MetricRow icon={Clock} label="Estimated Time" value={`${readingTime} min`} />
                        <MetricRow icon={CheckCircle} label="Knowledge Checks" value={kcCount} />
                        <MetricRow icon={Activity} label="Activities" value={actCount} />
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Media Metrics */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Media</p>
                    <div className="space-y-3">
                        <MetricRow icon={ImageIcon} label="Visual Opportunities" value={visualOpps} />
                        <MetricRow icon={ImageIcon} label="Missing Assets" value={missingAssets} color={missingAssets > 0 ? 'text-amber-600' : 'text-emerald-600'} />
                    </div>
                </div>

            </div>
        </div>
    );
}

function MetricRow({ icon: Icon, label, value, color = 'text-gray-800' }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 flex items-center gap-2">
                <Icon size={14} className="text-gray-400" /> {label}
            </span>
            <span className={`text-sm font-bold ${color}`}>{value}</span>
        </div>
    );
}
