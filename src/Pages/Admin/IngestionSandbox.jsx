import React, { useState } from 'react';
import apiClient from '../../config/apiClient';
import {
  Upload,
  Cpu,
  FileText,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Image as ImageIcon,
  Clock,
  Layers,
  Search,
  Code,
  Activity,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

export default function IngestionSandbox() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  const [activeTab, setActiveTab] = useState('chunks'); // 'chunks' | 'coords' | 'metrics'
  const [chunkFilter, setChunkFilter] = useState('all');
  const [chunkSearch, setChunkSearch] = useState('');
  const [selectedPage, setSelectedPage] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleRunDiagnostic = async () => {
    if (!file) {
      setError('Please select or drop a PDF file to run parsing diagnostics.');
      return;
    }

    setLoading(true);
    setError(null);
    setProgressMsg('Uploading & reading full PDF document...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setProgressMsg('Extracting text layouts, diagrams & Table of Contents across all pages...');
      const response = await apiClient.post(
        '/api/curriculum/knowledge-packs/test-extraction/',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setReport(response.data);
    } catch (err) {
      console.error('Diagnostic error:', err);
      const detailMsg = err.response?.data?.detail || err.message || 'Document ingestion diagnostic failed.';
      setError(detailMsg);
    } finally {
      setLoading(false);
      setProgressMsg('');
    }
  };

  const getAllChunks = () => {
    if (!report || !report.pages) return [];
    let chunks = [];
    report.pages.forEach((p) => {
      if (selectedPage !== null && p.page_number !== selectedPage) return;
      p.chunks.forEach((c) => {
        chunks.push({ ...c, page_number: p.page_number });
      });
    });
    return chunks;
  };

  const filteredChunks = getAllChunks().filter((c) => {
    const matchesFilter = chunkFilter === 'all' || c.chunk_type === chunkFilter;
    const matchesSearch =
      !chunkSearch ||
      (c.content && c.content.toLowerCase().includes(chunkSearch.toLowerCase())) ||
      c.chunk_type.toLowerCase().includes(chunkSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getChunkBadgeStyle = (type) => {
    switch (type) {
      case 'definition':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'worked_example':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'exercise':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'diagram':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'practical':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-custom-blue text-white rounded-lg">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Ingestion Sandbox & Parser Diagnostic
              </h1>
              <p className="text-sm text-gray-500">
                Deterministic full-document parsing diagnostic (PyMuPDF layout analysis, OCR fallback & automatic TOC recovery).
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-medium">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Non-LLM Deterministic Engine</span>
        </div>
      </div>

      {/* Streamlined Upload & Run Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 w-full">
          <label className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm">
            <Upload className="h-4 w-4 text-custom-blue" />
            <span>Upload Textbook PDF</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 hover:border-custom-blue rounded-lg p-5 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-indigo-50/30">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="sandbox-pdf-upload"
            />
            <label htmlFor="sandbox-pdf-upload" className="cursor-pointer block">
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-custom-blue" />
                  <div className="text-left truncate">
                    <span className="font-bold text-custom-blue text-sm truncate block">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Click to browse or drop PDF document here
                  </span>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col justify-center min-w-[220px]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-lg flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleRunDiagnostic}
            disabled={loading || !file}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-white shadow transition flex items-center justify-center gap-2 ${
              loading || !file
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-custom-blue hover:bg-opacity-90 active:scale-[0.99]'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span className="text-sm">{progressMsg || 'Parsing Document...'}</span>
              </>
            ) : (
              <>
                <Cpu className="h-5 w-5" />
                <span>Parse Full Document</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Diagnostic Results Dashboard */}
      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Extracted TOC Tree */}
          <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[750px]">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-custom-blue" />
                <h3 className="font-bold text-gray-800">Document TOC Tree</h3>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                {report.toc_structure.length} topics
              </span>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 space-y-2">
              {report.toc_structure.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50 text-amber-500" />
                  <p className="text-sm">No Table of Contents outline recovered.</p>
                </div>
              ) : (
                report.toc_structure.map((topic, idx) => (
                  <div key={topic.id || idx} className="border border-gray-100 rounded-lg p-2.5 bg-gray-50/50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-gray-800">
                        <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        <span>{topic.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                            topic.source_type === 'native'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {topic.source_type === 'native' ? 'Native' : 'Regex'}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          p.{topic.start_page}
                        </span>
                      </div>
                    </div>

                    {topic.children && topic.children.length > 0 && (
                      <div className="ml-4 mt-2 space-y-1.5 border-l-2 border-gray-200 pl-2">
                        {topic.children.map((unit, uIdx) => (
                          <div
                            key={unit.id || uIdx}
                            className="flex justify-between items-center text-[11px] text-gray-600 hover:text-custom-blue cursor-pointer py-0.5"
                            onClick={() => setSelectedPage(unit.start_page)}
                          >
                            <span className="truncate pr-2">{unit.title}</span>
                            <span className="text-gray-400 font-mono">p.{unit.start_page}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Tabbed Data Analyzer */}
          <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[750px]">
            {/* Tab Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('chunks')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                    activeTab === 'chunks'
                      ? 'bg-custom-blue text-white shadow'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Chunk Inspector ({filteredChunks.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('coords')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                    activeTab === 'coords'
                      ? 'bg-custom-blue text-white shadow'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Code className="h-4 w-4" />
                  <span>Coordinate Debugger</span>
                </button>
                <button
                  onClick={() => setActiveTab('metrics')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                    activeTab === 'metrics'
                      ? 'bg-custom-blue text-white shadow'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  <span>Performance & Health</span>
                </button>
              </div>

              {selectedPage !== null && (
                <button
                  onClick={() => setSelectedPage(null)}
                  className="text-xs text-custom-orange hover:underline font-medium"
                >
                  Clear Page Filter (p.{selectedPage})
                </button>
              )}
            </div>

            {/* TAB A: CHUNK INSPECTOR */}
            {activeTab === 'chunks' && (
              <div className="flex flex-col flex-1 overflow-hidden space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search extracted chunk content..."
                      value={chunkSearch}
                      onChange={(e) => setChunkSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-custom-blue"
                    />
                  </div>
                  <select
                    value={chunkFilter}
                    onChange={(e) => setChunkFilter(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-custom-blue text-gray-700"
                  >
                    <option value="all">All Chunk Types</option>
                    <option value="core_text">Core Text</option>
                    <option value="definition">Definition</option>
                    <option value="worked_example">Worked Example</option>
                    <option value="exercise">Exercise</option>
                    <option value="diagram">Diagram</option>
                    <option value="practical">Practical</option>
                  </select>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {filteredChunks.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <p className="text-sm">No chunks match your current filter.</p>
                    </div>
                  ) : (
                    filteredChunks.map((chunk, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs space-y-2 ${getChunkBadgeStyle(
                          chunk.chunk_type
                        )}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold uppercase tracking-wider text-[10px]">
                            {chunk.chunk_type}
                          </span>
                          <span className="font-mono text-[10px] text-gray-500">
                            Page {chunk.page_number} | bbox: [{chunk.bbox.map((n) => Math.round(n)).join(', ')}]
                          </span>
                        </div>

                        {chunk.chunk_type === 'diagram' && chunk.image_b64 ? (
                          <div className="bg-white p-2 rounded border border-gray-200 text-center">
                            <img
                              src={chunk.image_b64}
                              alt="Diagram Clip"
                              className="max-h-48 mx-auto object-contain rounded"
                            />
                            <span className="text-[10px] text-gray-400 block mt-1">
                              Base64 PNG Rendered Clip
                            </span>
                          </div>
                        ) : (
                          <p className="text-gray-800 leading-relaxed font-sans whitespace-pre-wrap">
                            {chunk.content}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB B: RAW COORDINATE DEBUGGER */}
            {activeTab === 'coords' && (
              <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto space-y-2">
                  <p className="text-slate-400 border-b border-slate-700 pb-2">
                    // Document Layout Coordinate Map: Total Pages: {report.file_metadata.total_pages}
                  </p>
                  {report.pages.map((p) => (
                    <div key={p.page_number} className="space-y-1">
                      <div className="text-custom-orange font-bold">
                        === PAGE {p.page_number} ({p.text_length} chars, OCR:{' '}
                        {p.was_ocr_triggered ? 'YES' : 'NO'}) ===
                      </div>
                      {p.chunks.map((c, cIdx) => (
                        <div key={cIdx} className="pl-4 text-slate-300">
                          <span className="text-emerald-400">[{c.chunk_type}]</span> bbox=[
                          {c.bbox.map((n) => n.toFixed(1)).join(', ')}] :{' '}
                          <span className="text-slate-400">"{c.content.substring(0, 60)}..."</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB C: PERFORMANCE & HEALTH */}
            {activeTab === 'metrics' && (
              <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <span className="text-xs text-blue-600 font-medium block">Total Pages Parsed</span>
                    <span className="text-2xl font-bold text-blue-900">
                      {report.file_metadata.total_pages}
                    </span>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <span className="text-xs text-purple-600 font-medium block">Total Chunks Extracted</span>
                    <span className="text-2xl font-bold text-purple-900">
                      {report.extraction_metrics.total_chunks_found}
                    </span>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <span className="text-xs text-amber-600 font-medium block">Processing Speed</span>
                    <span className="text-2xl font-bold text-amber-900">
                      {report.extraction_metrics.processing_time_ms} ms
                    </span>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <span className="text-xs text-emerald-600 font-medium block">Avg OCR Confidence</span>
                    <span className="text-2xl font-bold text-emerald-900">
                      {report.extraction_metrics.average_ocr_confidence
                        ? `${report.extraction_metrics.average_ocr_confidence}%`
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3">
                    Chunk Type Breakdown
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(report.extraction_metrics.chunk_type_counts).map(([type, count]) => (
                      <div key={type} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-700 capitalize">
                          {type.replace('_', ' ')}
                        </span>
                        <span className="text-sm font-bold text-custom-blue">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
