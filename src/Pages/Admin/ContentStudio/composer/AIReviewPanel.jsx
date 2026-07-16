import React from 'react';
import { Brain, FileText, ImageIcon, Activity, Clock, CheckCircle, Lightbulb, AlertTriangle } from 'lucide-react';

export default function AIReviewPanel({ lesson, blocks, assets }) {
    // ─── Heuristic Computations ──────────────────────────────────────────────
    
    // 1. Reading Load
    let wordCount = 0;
    blocks.forEach(b => {
        let text = b.content || '';
        if (typeof text === 'object') text = JSON.stringify(text);
        wordCount += text.split(/\s+/).length;
    });
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    const readingLoadStatus = readingTime > 15 ? 'High' : (readingTime < 3 ? 'Low' : 'Optimal');

    // 2. Media Coverage
    const visualBlocks = blocks.filter(b => ['suggested_diagram', 'suggested_video', 'suggested_image', 'image_placeholder', 'video_ref', 'suggested_illustration', 'suggested_infographic'].includes(b.block_type)).length;
    const missingAssets = assets.filter(a => a.status === 'pending').length;
    const mediaCoverage = visualBlocks > 0 ? (missingAssets === 0 ? 'Excellent' : 'Needs Assets') : 'Poor';

    // 3. Interaction Density
    const activeBlocks = blocks.filter(b => ['knowledge_check', 'multiple_choice', 'true_false', 'short_answer', 'reflection', 'experiment', 'classroom_activity'].includes(b.block_type)).length;
    const interactionDensity = activeBlocks >= 2 ? 'High' : (activeBlocks === 1 ? 'Moderate' : 'Low');

    // 4. Local Context & Coaching
    const hasContext = blocks.some(b => ['real_world_example', 'analogy'].includes(b.block_type));
    const hasMisconception = blocks.some(b => ['common_misconception', 'common_mistake'].includes(b.block_type));
    const hasSummary = blocks.some(b => ['summary', 'key_takeaway'].includes(b.block_type));

    // ─── Actionable Coaching ─────────────────────────────────────────────────
    const tips = [];
    if (readingLoadStatus === 'High') tips.push("This concept is text-heavy. Consider breaking it down or adding visuals.");
    if (mediaCoverage === 'Poor') tips.push("Add a diagram or video to support visual learners.");
    if (interactionDensity === 'Low') tips.push("Add a Knowledge Check or Pause & Reflect to improve engagement.");
    if (!hasContext) tips.push("Consider adding a Real-World Example or Analogy to ground the concept.");
    if (!hasMisconception) tips.push("Pre-empt confusion by adding a Common Misconception.");
    if (!hasSummary) tips.push("Add a Key Takeaway to reinforce the main learning goal.");
    
    return (
        <div className="w-72 bg-custom-cream border-l border-gray-200/60 flex flex-col h-full overflow-y-auto">
            <div className="px-5 py-4 border-b border-gray-200/60 bg-white sticky top-0 shadow-sm z-10">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 font-serif">
                    <Brain size={18} className="text-custom-terracotta" /> Instructional Coach
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 font-sans">Real-time analysis</p>
            </div>

            <div className="p-5 space-y-8">
                
                {/* Actionable Feedback */}
                <div>
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 font-sans">Coaching Suggestions</p>
                    {tips.length > 0 ? (
                        <div className="space-y-3">
                            {tips.slice(0, 3).map((tip, i) => (
                                <div key={i} className="bg-white border-l-2 border-custom-terracotta p-3 rounded-r-xl shadow-sm text-sm text-gray-700 leading-relaxed font-sans flex gap-2">
                                    <Lightbulb size={14} className="text-custom-ochre shrink-0 mt-0.5" />
                                    <span>{tip}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-[#E3EBE6] p-3 rounded-xl shadow-sm text-sm text-custom-forest flex gap-2 font-sans">
                            <CheckCircle size={16} className="text-custom-forest shrink-0 mt-0.5" />
                            <span>This concept looks well-balanced and highly engaging!</span>
                        </div>
                    )}
                </div>

                <hr className="border-gray-200/60" />

                {/* Pedagogy Metrics */}
                <div>
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4 font-sans">Pedagogical Health</p>
                    <div className="space-y-4">
                        <MetricRow icon={FileText} label="Reading Load" value={readingLoadStatus} color={readingLoadStatus === 'Optimal' ? 'text-custom-forest' : 'text-custom-terracotta'} />
                        <MetricRow icon={Activity} label="Interaction Density" value={interactionDensity} color={interactionDensity === 'Low' ? 'text-custom-terracotta' : 'text-custom-forest'} />
                        <MetricRow icon={ImageIcon} label="Media Coverage" value={mediaCoverage} color={mediaCoverage === 'Poor' || mediaCoverage === 'Needs Assets' ? 'text-custom-ochre' : 'text-custom-forest'} />
                        <MetricRow icon={Clock} label="Est. Reading Time" value={`~${readingTime} min`} />
                    </div>
                </div>

                <hr className="border-gray-200/60" />

                {/* Checklist */}
                <div>
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4 font-sans">Design Checklist</p>
                    <div className="space-y-3">
                        <ChecklistItem label="Real-World Context" checked={hasContext} />
                        <ChecklistItem label="Misconception Addressed" checked={hasMisconception} />
                        <ChecklistItem label="Checks for Understanding" checked={activeBlocks > 0} />
                        <ChecklistItem label="Clear Summary" checked={hasSummary} />
                    </div>
                </div>

            </div>
        </div>
    );
}

function MetricRow({ icon: Icon, label, value, color = 'text-gray-900' }) {
    return (
        <div className="flex items-center justify-between font-sans">
            <span className="text-xs font-semibold text-gray-500 flex items-center gap-2">
                <Icon size={14} className="text-gray-400" /> {label}
            </span>
            <span className={`text-xs font-bold ${color}`}>{value}</span>
        </div>
    );
}

function ChecklistItem({ label, checked }) {
    return (
        <div className="flex items-center gap-2 font-sans">
            {checked ? (
                <CheckCircle size={14} className="text-custom-forest shrink-0" />
            ) : (
                <div className="w-[14px] h-[14px] rounded-full border-2 border-gray-300 shrink-0" />
            )}
            <span className={`text-xs ${checked ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                {label}
            </span>
        </div>
    );
}
