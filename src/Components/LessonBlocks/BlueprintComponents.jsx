import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import BASE_URL from '../../config';
import {
  Target, Book, PenTool, Lightbulb, AlertTriangle, XCircle, Zap, Star, BrainCircuit, Globe, Hand, FlaskConical, Sparkles, CheckCircle2, PlayCircle, BarChart, Image as ImageIcon, MonitorPlay, Link2, BookOpen, Check, X
} from 'lucide-react';

// ─── Content extraction helper ───────────────────────────────────────────────
const text = (c) => {
  if (!c) return '';
  if (typeof c === 'string') { try { const p = JSON.parse(c); return p.text || p.content || c; } catch { return c; } }
  if (typeof c === 'object') return c.text || c.content || c.procedure || '';
  return String(c);
};

const MD = ({ children, className = '' }) => (
  <div className={`prose prose-gray max-w-none leading-relaxed ${className}`}>
    <ReactMarkdown>{children}</ReactMarkdown>
  </div>
);

const parseContent = (content) => {
  if (!content) return {};
  if (typeof content === 'object') return content;
  if (typeof content === 'string') {
      try { return JSON.parse(content); }
      catch { return { text: content }; }
  }
  return {};
};

// ─── Learning Goal ────────────────────────────────────────────────────────────
export const LearningGoalBlock = ({ block }) => (
  <div className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl px-5 py-4 my-4">
    <Target className="text-blue-500 w-5 h-5 mt-0.5 shrink-0" />
    <div>
      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">By the end of this concept</p>
      <p className="text-blue-900 font-medium text-sm leading-relaxed">{text(block.content)}</p>
    </div>
  </div>
);

// ─── Concept Explanation ──────────────────────────────────────────────────────
export const ConceptExplanationBlock = ({ block }) => (
  <div className="my-5">
    {block.title && <h3 className="text-xl font-bold text-gray-900 mb-3">{block.title}</h3>}
    <MD className="text-gray-700 text-base">{text(block.content)}</MD>
  </div>
);

// ─── Definition Card ──────────────────────────────────────────────────────────
export const DefinitionCardBlock = ({ block }) => {
  const c = parseContent(block.content);
  const term = c.term || block.title || 'Definition';
  const definition = c.content || c.text || text(block.content);
  return (
    <div className="my-5 border-l-4 border-amber-400 bg-amber-50 rounded-r-2xl pl-5 pr-5 py-4 flex gap-3">
      <Book className="text-amber-500 w-5 h-5 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Definition</p>
        <p className="font-bold text-amber-900 text-base mb-1">{term}</p>
        <p className="text-amber-800 text-sm leading-relaxed">{definition}</p>
      </div>
    </div>
  );
};

// ─── Worked Example ───────────────────────────────────────────────────────────
export const WorkedExampleBlock = ({ block }) => (
  <div className="my-6 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
    <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-2">
      <PenTool className="text-gray-500 w-5 h-5 shrink-0" />
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Worked Example</p>
      {block.title && <span className="text-sm font-semibold text-gray-800 ml-1">— {block.title}</span>}
    </div>
    <div className="px-5 py-4">
      <MD className="text-gray-700 text-sm">{text(block.content)}</MD>
    </div>
  </div>
);

// ─── Analogy ──────────────────────────────────────────────────────────────────
export const AnalogyBlock = ({ block }) => (
  <div className="my-5 bg-violet-50 border border-violet-100 rounded-2xl px-5 py-4 flex gap-3">
    <Lightbulb className="text-violet-400 w-5 h-5 mt-0.5 shrink-0" />
    <div>
      <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-1">Think of it this way</p>
      <p className="text-violet-900 text-sm leading-relaxed italic">{text(block.content)}</p>
    </div>
  </div>
);

// ─── Common Misconception ─────────────────────────────────────────────────────
export const CommonMisconceptionBlock = ({ block }) => (
  <div className="my-5 bg-rose-50 border border-rose-100 rounded-2xl px-5 py-4 flex gap-3">
    <AlertTriangle className="text-rose-400 w-5 h-5 mt-0.5 shrink-0" />
    <div>
      <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">Common Misconception</p>
      <p className="text-rose-900 text-sm leading-relaxed">{text(block.content)}</p>
    </div>
  </div>
);

// ─── Common Mistake (action-oriented) ────────────────────────────────────────
export const CommonMistakeBlock = ({ block }) => (
  <div className="my-5 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 flex gap-3">
    <XCircle className="text-orange-400 w-5 h-5 mt-0.5 shrink-0" />
    <div>
      <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Watch Out</p>
      <p className="text-orange-900 text-sm leading-relaxed">{text(block.content)}</p>
    </div>
  </div>
);

// ─── Callout ──────────────────────────────────────────────────────────────────
export const CalloutBlock = ({ block }) => (
  <div className="my-5 bg-sky-50 border-l-4 border-sky-400 rounded-r-2xl px-5 py-4">
    <p className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-1">Important</p>
    <p className="text-sky-900 text-sm leading-relaxed">{text(block.content)}</p>
  </div>
);

// ─── Quick Fact ───────────────────────────────────────────────────────────────
export const QuickFactBlock = ({ block }) => (
  <div className="my-4 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 flex items-start gap-2">
    <Zap className="text-teal-500 w-4 h-4 mt-0.5 shrink-0" />
    <p className="text-teal-900 text-sm font-medium leading-relaxed">{text(block.content)}</p>
  </div>
);

// ─── Did You Know ─────────────────────────────────────────────────────────────
export const DidYouKnowBlock = ({ block }) => (
  <div className="my-4 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 flex items-start gap-2">
    <Star className="text-purple-400 w-4 h-4 mt-0.5 shrink-0" />
    <div>
      <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-0.5">Did you know?</p>
      <p className="text-purple-900 text-sm leading-relaxed">{text(block.content)}</p>
    </div>
  </div>
);

// ─── Memory Tip ───────────────────────────────────────────────────────────────
export const MemoryTipBlock = ({ block }) => (
  <div className="my-4 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-start gap-2">
    <BrainCircuit className="text-yellow-500 w-4 h-4 mt-0.5 shrink-0" />
    <div>
      <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-0.5">Memory tip</p>
      <p className="text-yellow-900 text-sm leading-relaxed">{text(block.content)}</p>
    </div>
  </div>
);

// ─── Real World Connection ────────────────────────────────────────────────────
export const RealWorldConnectionBlock = ({ block }) => (
  <div className="my-5 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 flex gap-3">
    <Globe className="text-emerald-500 w-5 h-5 mt-0.5 shrink-0" />
    <div>
      <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">In the real world</p>
      <p className="text-emerald-900 text-sm leading-relaxed">{text(block.content)}</p>
    </div>
  </div>
);

// ─── Real World Example (legacy) ─────────────────────────────────────────────
export const RealWorldExampleBlock = ({ block }) => (
  <RealWorldConnectionBlock block={block} />
);

// ─── Reflection ───────────────────────────────────────────────────────────────
export const ReflectionBlock = ({ block }) => (
  <div className="my-6 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl px-5 py-5">
    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Pause & Reflect</p>
    <p className="text-indigo-900 text-base font-medium leading-relaxed italic">"{text(block.content)}"</p>
  </div>
);

// ─── Prediction ───────────────────────────────────────────────────────────────
export const PredictionBlock = ({ block }) => (
  <div className="my-6 border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl px-5 py-5">
    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Make a Prediction</p>
    <p className="text-blue-900 text-base leading-relaxed">{text(block.content)}</p>
    <p className="text-blue-400 text-xs mt-3">Keep your answer in mind as you continue.</p>
  </div>
);

// ─── Mini Activity ────────────────────────────────────────────────────────────
export const MiniActivityBlock = ({ block }) => {
  const c = parseContent(block.content);
  const title = c.title || block.title || 'Try This';
  const instruction = c.content || c.text || text(block.content);
  return (
    <div className="my-6 bg-green-50 border border-green-200 rounded-2xl overflow-hidden">
      <div className="bg-green-100 border-b border-green-200 px-5 py-3 flex items-center gap-2">
        <FlaskConical className="text-green-700 w-5 h-5 shrink-0" />
        <p className="text-xs font-bold text-green-700 uppercase tracking-widest">Mini Activity</p>
        <span className="text-sm font-semibold text-green-800 ml-1">— {title}</span>
      </div>
      <div className="px-5 py-4">
        <p className="text-green-900 text-sm leading-relaxed">{instruction}</p>
      </div>
    </div>
  );
};

// ─── Formula Breakdown ────────────────────────────────────────────────────────
export const FormulaBreakdownBlock = ({ block }) => {
  const c = parseContent(block.content);
  const formula = c.formula || block.title || '';
  const breakdown = c.content || c.text || text(block.content);
  return (
    <div className="my-6 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
      <div className="bg-slate-800 px-5 py-4 text-center">
        <p className="text-white font-mono text-xl font-bold tracking-wide">{formula}</p>
      </div>
      <div className="px-5 py-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Variable Breakdown</p>
        <MD className="text-slate-700 text-sm font-mono">{breakdown}</MD>
      </div>
    </div>
  );
};

// ─── Key Takeaway ─────────────────────────────────────────────────────────────
export const KeyTakeawayBlock = ({ block }) => (
  <div className="my-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl px-6 py-5 flex items-start gap-3">
    <Sparkles className="text-white w-5 h-5 mt-0.5 shrink-0" />
    <div>
      <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Key Takeaway</p>
      <p className="text-white font-semibold text-base leading-relaxed">{text(block.content)}</p>
    </div>
  </div>
);

// ─── Before You Continue ──────────────────────────────────────────────────────
export const BeforeYouContinueBlock = ({ block }) => (
  <div className="my-5 bg-amber-50 border-2 border-amber-200 rounded-2xl px-5 py-4 flex gap-3">
    <Hand className="text-amber-500 w-5 h-5 mt-0.5 shrink-0" />
    <div>
      <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Before you continue</p>
      <p className="text-amber-900 text-sm leading-relaxed">{text(block.content)}</p>
    </div>
  </div>
);

// ─── Summary ──────────────────────────────────────────────────────────────────
export const SummaryBlock = ({ block }) => (
  <div className="my-6 bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200 rounded-2xl px-6 py-5">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Summary</p>
    <MD className="text-gray-700 text-sm">{text(block.content)}</MD>
  </div>
);

// ─── Transition ───────────────────────────────────────────────────────────────
export const TransitionBlock = ({ block }) => (
  <div className="my-6 flex items-center gap-3 text-gray-400">
    <div className="flex-1 h-px bg-gray-200" />
    <p className="text-xs text-gray-400 text-center max-w-xs leading-relaxed">{text(block.content)}</p>
    <div className="flex-1 h-px bg-gray-200" />
  </div>
);

// ─── Knowledge Check ──────────────────────────────────────────────────────────
export const KnowledgeCheckBlock = ({ block, onInteract }) => {
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState(null);

  const c = parseContent(block.content);
  const checkType = c.check_type || block.content?.check_type || 'short_answer';
  const question = c.content || c.question || text(block.content);
  const options = c.options || [];
  const answer = c.answer;

  const handleSubmit = () => {
    setRevealed(true);
    if (onInteract) onInteract(block.id);
  };

  const isCorrect = selected !== null && selected === answer;

  return (
    <div className="my-8 bg-white border border-indigo-100 rounded-2xl overflow-hidden shadow-sm relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-2xl" />
      <div className="px-6 py-5">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Check Your Understanding</p>
        <p className="text-gray-800 font-medium text-base mb-4">{question}</p>

        {/* Multiple choice */}
        {checkType === 'multiple_choice' && options.length > 0 && (
          <div className="space-y-2 mb-4">
            {options.map((opt, i) => {
              const label = String.fromCharCode(65 + i);
              const isSelected = selected === label;
              const isRight = revealed && label === answer;
              const isWrong = revealed && isSelected && label !== answer;
              return (
                <button
                  key={i}
                  onClick={() => !revealed && setSelected(label)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    isRight ? 'bg-emerald-50 border-emerald-400 text-emerald-800' :
                    isWrong ? 'bg-rose-50 border-rose-400 text-rose-800' :
                    isSelected ? 'bg-indigo-50 border-indigo-400 text-indigo-800' :
                    'bg-gray-50 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  <span className="font-bold mr-2">{label}.</span>{opt}
                  {isRight && <Check className="inline-block ml-2 w-4 h-4 text-emerald-600" />}
                  {isWrong && <X className="inline-block ml-2 w-4 h-4 text-rose-600" />}
                </button>
              );
            })}
          </div>
        )}

        {/* True / False */}
        {checkType === 'true_false' && (
          <div className="flex gap-3 mb-4">
            {['True', 'False'].map((opt) => {
              const val = opt === 'True';
              const isSelected = selected === val;
              const isRight = revealed && val === answer;
              const isWrong = revealed && isSelected && val !== answer;
              return (
                <button
                  key={opt}
                  onClick={() => !revealed && setSelected(val)}
                  className={`flex-1 py-3 rounded-xl border font-semibold text-sm transition-all ${
                    isRight ? 'bg-emerald-50 border-emerald-400 text-emerald-800' :
                    isWrong ? 'bg-rose-50 border-rose-400 text-rose-800' :
                    isSelected ? 'bg-indigo-50 border-indigo-400 text-indigo-800' :
                    'bg-gray-50 border-gray-200 text-gray-700 hover:border-indigo-300'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Short answer / predict / explain */}
        {(checkType === 'short_answer' || checkType === 'predict_outcome' || checkType === 'explain_in_words' || checkType === 'fill_blank') && !revealed && (
          <textarea
            className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition resize-none mb-4"
            rows={3}
            placeholder="Write your answer here…"
          />
        )}

        {!revealed ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm"
          >
            Submit Answer
          </button>
        ) : (
          <div className="mt-2 space-y-3">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0" />
              <p className="text-emerald-800 text-sm font-semibold">
                {(checkType === 'multiple_choice' || checkType === 'true_false') && isCorrect
                  ? 'Correct! Well done.'
                  : (checkType === 'multiple_choice' || checkType === 'true_false') && !isCorrect
                  ? `Not quite — the correct answer is ${answer}.`
                  : 'Answer noted. Continue when ready.'}
              </p>
            </div>
            {!(checkType === 'multiple_choice' || checkType === 'true_false') && (answer || c.explanation) && (
                <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Suggested Answer / Explanation</p>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{answer || c.explanation}</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Suggested Media (pending asset) ─────────────────────────────────────────
const MEDIA_CONFIG = {
  suggested_diagram:    { icon: BarChart, label: 'Diagram', color: 'blue',   desc: 'A labelled diagram is planned for this concept.' },
  suggested_video:      { icon: PlayCircle, label: 'Video',   color: 'red',    desc: 'A short video is planned for this concept.' },
  suggested_image:      { icon: ImageIcon, label: 'Image',   color: 'violet', desc: 'An illustration is planned for this concept.' },
  suggested_simulation: { icon: FlaskConical, label: 'Interactive Simulation', color: 'cyan', desc: 'An interactive simulation is planned for this concept.' },
  suggested_gif:        { icon: MonitorPlay, label: 'Animation', color: 'teal', desc: 'An animation is planned for this concept.' },
  suggested_activity:   { icon: FlaskConical, label: 'Activity', color: 'green', desc: 'A hands-on activity is planned for this concept.' },
  suggested_external_link: { icon: Link2, label: 'Resource', color: 'slate', desc: 'An external resource is planned for this concept.' },
  repository_asset:     { icon: BookOpen, label: 'Repository Asset', color: 'gray', desc: 'A repository asset is linked to this concept.' },
  // Extra/manual/legacy types mapping
  suggested_illustration: { icon: ImageIcon, label: 'Illustration', color: 'violet', desc: 'An illustration is planned for this concept.' },
  suggested_infographic:  { icon: ImageIcon, label: 'Infographic', color: 'violet', desc: 'An infographic is planned for this concept.' },
  suggested_table:        { icon: BarChart, label: 'Table', color: 'blue', desc: 'A data table is planned for this concept.' },
  suggested_graph:        { icon: BarChart, label: 'Graph', color: 'blue', desc: 'A graph is planned for this concept.' },
  suggested_timeline:     { icon: BarChart, label: 'Timeline', color: 'blue', desc: 'A timeline is planned for this concept.' },
  suggested_flowchart:    { icon: BarChart, label: 'Flowchart', color: 'blue', desc: 'A flowchart is planned for this concept.' },
  suggested_mind_map:     { icon: BarChart, label: 'Mind Map', color: 'blue', desc: 'A mind map is planned for this concept.' },
  image_placeholder:      { icon: ImageIcon, label: 'Image', color: 'violet', desc: 'An image is attached to this concept.' },
  diagram_placeholder:    { icon: BarChart, label: 'Diagram', color: 'blue', desc: 'A diagram is attached to this concept.' },
  video_ref:              { icon: PlayCircle, label: 'Video', color: 'red', desc: 'A video resource is attached to this concept.' },
  simulation_placeholder: { icon: FlaskConical, label: 'Interactive Simulation', color: 'cyan', desc: 'An interactive simulation is attached to this concept.' },
};

const COLOR_MAP = {
  blue:   ['bg-blue-50',   'border-blue-200',   'text-blue-500',  'text-blue-700', 'text-blue-400'],
  red:    ['bg-red-50',    'border-red-200',    'text-red-500',   'text-red-700',  'text-red-400'],
  violet: ['bg-violet-50', 'border-violet-200', 'text-violet-500','text-violet-700','text-violet-400'],
  cyan:   ['bg-cyan-50',   'border-cyan-200',   'text-cyan-500',  'text-cyan-700', 'text-cyan-400'],
  teal:   ['bg-teal-50',   'border-teal-200',   'text-teal-500',  'text-teal-700', 'text-teal-400'],
  green:  ['bg-green-50',  'border-green-200',  'text-green-500', 'text-green-700','text-green-400'],
  slate:  ['bg-slate-50',  'border-slate-200',  'text-slate-500', 'text-slate-700','text-slate-400'],
  gray:   ['bg-gray-50',   'border-gray-200',   'text-gray-500',  'text-gray-700', 'text-gray-400'],
};

export const SuggestedMediaBlock = ({ block }) => {
  const cfg = MEDIA_CONFIG[block.block_type] || MEDIA_CONFIG.suggested_image;
  const [bg, border, iconColor, textColor, subColor] = COLOR_MAP[cfg.color] || COLOR_MAP.blue;
  const c = parseContent(block.content);
  const instruction = c.instruction || c.purpose || c.description || cfg.desc;
  
  const asset = block.assets && block.assets.length > 0 ? block.assets[0] : null;
  const getFileUrl = (fileStr) => {
    if (!fileStr) return null;
    if (fileStr.startsWith('http')) return fileStr;
    const path = fileStr.startsWith('/') ? fileStr : `/media/${fileStr}`;
    return `${BASE_URL}${path}`;
  };
  const assetUrl = getFileUrl(asset?.url) || getFileUrl(asset?.file);
  
  const isVideo = asset 
    ? ['video', 'youtube'].includes(asset.asset_type) 
    : ['suggested_video', 'video_ref'].includes(block.block_type);
  const resolvedUrl = assetUrl || c.resolved_url || c.url || c.resolved_video_id;
  const resolvedImageUrl = !isVideo ? (resolvedUrl || c.resolved_image_url) : c.resolved_image_url;

  if (resolvedImageUrl && !isVideo) {
    if (asset?.asset_type === 'external_link' || 
        ['suggested_external_link', 'suggested_activity', 'suggested_simulation', 'simulation_placeholder'].includes(block.block_type) ||
        asset?.asset_type === 'simulation') {
        return (
          <div className="my-6 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
             <div className="px-5 py-4 flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{cfg.label}</p>
                   <p className="font-semibold text-slate-800 text-sm mt-1">{block.title}</p>
                </div>
                <a href={resolvedImageUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-300 transition">Open Link</a>
             </div>
          </div>
        );
    }
    return (
      <div className="my-8 flex flex-col items-center">
        <figure className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-full overflow-hidden hover:shadow-md transition-shadow">
          <img src={resolvedImageUrl} alt={block.title} className="w-full h-auto object-cover rounded-xl" />
          {block.title && <figcaption className="text-gray-500 mt-3 mb-1 text-sm text-center font-medium">{block.title}</figcaption>}
        </figure>
      </div>
    );
  }

  if (resolvedUrl && isVideo) {
    const isYouTube = resolvedUrl.includes('youtube.com') || resolvedUrl.includes('youtu.be') || /^[a-zA-Z0-9_-]{11}$/.test(resolvedUrl);
    
    if (isYouTube) {
        let videoId = resolvedUrl;
        if (resolvedUrl.includes('youtube.com') || resolvedUrl.includes('youtu.be')) {
            try {
                const u = new URL(resolvedUrl);
                videoId = u.searchParams.get('v') || u.pathname.split('/').pop() || '';
            } catch { /* ignore */ }
        }
        
        return (
          <div className="my-8 bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
            <div className="px-5 py-3 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
              <PlayCircle className="text-red-500 w-5 h-5 shrink-0" />
              <span className="text-white font-semibold text-sm">{block.title || 'Video Resource'}</span>
            </div>
            <div className="aspect-video">
              <iframe src={`https://www.youtube.com/embed/${videoId}`} className="w-full h-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            </div>
          </div>
        );
    }
    
    return (
      <div className="my-8 bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
        <div className="px-5 py-3 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
          <PlayCircle className="text-red-500 w-5 h-5 shrink-0" />
          <span className="text-white font-semibold text-sm">{block.title || 'Video Resource'}</span>
        </div>
        <div className="aspect-video">
          <video controls className="w-full h-full" src={resolvedUrl}>
            Your browser doesn't support video.
          </video>
        </div>
      </div>
    );
  }

  return (
    <div className={`my-6 ${bg} border ${border} rounded-2xl overflow-hidden`}>
      <div className="px-5 py-4 flex items-start gap-3">
        <cfg.icon className={`${iconColor} w-6 h-6 mt-0.5 shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className={`text-xs font-bold ${iconColor} uppercase tracking-widest`}>{cfg.label}</p>
            <span className="text-xs text-gray-400 bg-white/60 border border-gray-200 px-2 py-0.5 rounded-full">Coming soon</span>
          </div>
          {block.title && <p className={`font-semibold ${textColor} text-sm mb-1`}>{block.title}</p>}
          <div className={`${subColor} text-xs leading-relaxed whitespace-pre-wrap`}>{instruction}</div>
        </div>
      </div>
    </div>
  );
};

// ─── Concept Completion Card ──────────────────────────────────────────────────
export const ConceptCompletionCard = ({ page, nextPageTitle, onNext, onComplete, isLast }) => {
  const summaryBlocks = (page?.blocks || []).filter(b =>
    b.block_type === 'key_takeaway' || b.block_type === 'summary'
  );
  const takeaways = summaryBlocks.flatMap(b => {
    const t = text(b.content);
    return t.split('\n').filter(l => l.trim().replace(/^[•\-*]\s*/, ''));
  }).slice(0, 3);

  return (
    <div className="mt-10 mb-2 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl px-6 py-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center">
          <Check className="text-white w-4 h-4" />
        </div>
        <p className="font-bold text-emerald-800 text-base">Concept Complete</p>
      </div>

      {takeaways.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">You now understand</p>
          <ul className="space-y-1">
            {takeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-emerald-800 text-sm">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>{t.replace(/^[•\-*]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isLast && nextPageTitle && (
        <p className="text-sm text-emerald-700 border-t border-emerald-200 pt-4">
          <span className="font-semibold">Next:</span> {nextPageTitle}
        </p>
      )}
    </div>
  );
};
