'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  ShieldCheck, Lock, FileText, CheckCircle2, AlertCircle, 
  Download, Loader2, RefreshCw, FileSpreadsheet, Sparkles, Building2, ShieldAlert, FileOutput
} from 'lucide-react';

interface ResultItem {
  id: string;
  question: string;
  answer: string;
  confidence: string;
  control: string;
  status: 'Pass' | 'Flagged' | 'Needs Context';
  sources: string[];
}

export default function SecurityQuestionnairePage() {
  const [selectedFramework, setSelectedFramework] = useState('SOC 2 Type II');
  const [rawQuestions, setRawQuestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);

  const handleRunAudit = async () => {
    if (!rawQuestions.trim()) {
      setError('Please paste at least one security question.');
      return;
    }

    setLoading(true);
    setError('');

    const questionsArray = rawQuestions
      .split(/\r?\n/)
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    try {
      const res = await fetch('/api/security-questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: questionsArray, framework: selectedFramework }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resolve security questionnaire.');

      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (results.length === 0) return;

    const headers = ['Question', 'Answer', 'Confidence', 'Control Framework', 'Status', 'Source Documents'];
    const rows = results.map((r) => [
      `"${r.question.replace(/"/g, '""')}"`,
      `"${r.answer.replace(/"/g, '""')}"`,
      r.confidence,
      `"${r.control}"`,
      r.status,
      `"${r.sources.join(', ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Security_Audit_Matrix_${selectedFramework.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = async () => {
    if (results.length === 0) return;
    setExportingExcel(true);
    try {
      const res = await fetch('/api/security-questionnaire/export-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: results,
          framework: selectedFramework,
          overallScore: Math.round((results.filter(r => r.status === 'Pass').length / results.length) * 100)
        }),
      });

      if (!res.ok) throw new Error('Failed to generate Excel download');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Security_Audit_Matrix_${selectedFramework.replace(/\s+/g, '_')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setError('Failed to export native Excel spreadsheet.');
    } finally {
      setExportingExcel(false);
    }
  };

  const loadPreset = () => {
    setRawQuestions(
      `1. Does your organization enforce Multi-Factor Authentication (MFA) for all production access?\n` +
      `2. How frequently are vulnerability penetration tests conducted by independent 3rd parties?\n` +
      `3. Describe your customer data encryption standards at rest and in transit.\n` +
      `4. What is your formal incident response notification SLA following a confirmed data breach?`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans">
      <Sidebar />

      <main className="flex-1 pl-80 min-h-screen relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-8 py-12 z-10 relative">
          {/* SAFEGUARD BANNER */}
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider block mb-0.5 text-amber-300">
                ⚠️ AUTOMATED AUDIT DISCLAIMER
              </span>
              <span>
                ContextSkeleton is an automated software tool. Results are intended to streamline vendor security responses and do not replace legal counsel, formal CPA audits, or official SOC 2 Type II auditor attestations.
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <ShieldCheck className="h-3.5 w-3.5" /> Vendor Risk &amp; Security Questionnaire Resolver
              </div>
              <h1 className="text-3xl font-extrabold text-white">Security Questionnaire Automation</h1>
              <p className="text-slate-400 text-xs mt-1">
                Auto-fill incoming vendor questionnaires against your grounded SOC 2, ISO 27001, and NIST policy documents.
              </p>
            </div>

            <button
              onClick={loadPreset}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
            >
              <FileText className="h-4 w-4 text-rose-400" />
              Load Sample Security Questions
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel p-6 rounded-3xl space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Target Framework Baseline
                  </label>
                  <select
                    value={selectedFramework}
                    onChange={(e) => setSelectedFramework(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="SOC 2 Type II">SOC 2 Type II (Trust Services Criteria)</option>
                    <option value="ISO 27001:2022">ISO/IEC 27001:2022 Annex A Controls</option>
                    <option value="NIST Cybersecurity Framework">NIST CSF 2.0 (Identify, Protect, Detect)</option>
                    <option value="HIPAA Security Rule">HIPAA Security &amp; Administrative Safeguards</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Paste Security Questions (One per line)
                  </label>
                  <textarea
                    rows={10}
                    value={rawQuestions}
                    onChange={(e) => setRawQuestions(e.target.value)}
                    placeholder="e.g. Does your company enforce MFA for all production environments?&#10;What is your backup retention policy?"
                    className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-rose-500 resize-none leading-relaxed font-mono"
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleRunAudit}
                  disabled={loading || !rawQuestions.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-rose-500/10"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resolving Questions against Policy Store...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Resolve Questionnaire (1 Credit)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-6 rounded-3xl min-h-[500px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-900 pb-4 mb-6">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-rose-400" />
                      Auto-Filled Questionnaire Evidence Matrix
                    </h2>

                    {results.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={exportToCSV}
                          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                        >
                          <FileSpreadsheet className="h-3.5 w-3.5 text-rose-400" />
                          Export CSV
                        </button>

                        <button
                          onClick={exportToExcel}
                          disabled={exportingExcel}
                          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-500/10"
                        >
                          {exportingExcel ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <FileOutput className="h-3.5 w-3.5 text-white" />
                          )}
                          Export Excel (.xlsx)
                        </button>
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                      <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                        <Loader2 className="h-7 w-7 text-rose-400 animate-spin" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-white font-bold text-sm">Consulting Knowledge Base Policies</h3>
                        <p className="text-slate-400 text-xs max-w-xs mx-auto">
                          Performing vector similarity search to ground answers in verified company security evidence...
                        </p>
                      </div>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="space-y-4">
                      {results.map((item, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-900 space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-white max-w-md">Q{idx + 1}: {item.question}</span>
                            <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                              item.status === 'Pass' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {item.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            {item.answer}
                          </p>

                          <div className="flex justify-between items-center pt-2 border-t border-slate-900/60 text-[10px] text-slate-500">
                            <span>Mapped Control: <strong className="text-rose-400">{item.control}</strong></span>
                            <span>Confidence: <strong className="text-slate-300">{item.confidence}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                      <Lock className="h-10 w-10 text-slate-700 mb-3" />
                      <p className="text-xs">Paste incoming buyer security questions on the left to auto-populate evidence-backed responses.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
