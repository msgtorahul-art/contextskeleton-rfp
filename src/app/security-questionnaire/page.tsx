'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  ShieldCheck, Lock, FileSpreadsheet, Loader2, Download, CheckCircle2, 
  AlertTriangle, RefreshCw, Sparkles, HelpCircle, ArrowRight, ShieldAlert, FileText
} from 'lucide-react';

interface QuestionResult {
  id: string;
  question: string;
  answer: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  control: string;
  status: 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NEEDS_REVIEW';
  sources: string[];
}

const TEMPLATE_PRESETS = [
  {
    name: 'SOC 2 Type II Vendor Risk',
    framework: 'SOC 2 Type II',
    questions: [
      'Is customer data encrypted both in transit (TLS 1.3) and at rest (AES-256)?',
      'Describe your identity and access management (IAM) and MFA enforcement policy.',
      'How frequently are penetration tests and vulnerability scans conducted by third parties?',
      'Describe your disaster recovery (DR) and business continuity plan RTO/RPO targets.',
    ],
  },
  {
    name: 'ISO 27001 Compliance Audit',
    framework: 'ISO 27001:2022',
    questions: [
      'Do you maintain an Information Security Management System (ISMS) certified by an accredited body?',
      'How are employee background checks and security awareness trainings enforced?',
      'Describe your incident response workflow and customer notification SLAs in event of data breach.',
      'How is physical and environmental security managed at data center facilities?',
    ],
  },
  {
    name: 'GDPR & Privacy Impact',
    framework: 'GDPR / CCPA',
    questions: [
      'Do you support customer Data Subject Access Requests (DSAR) and Right-to-be-Forgotten deletion?',
      'Where is customer personal data hosted geographically, and what cross-border transfer mechanisms are used?',
      'Are sub-processors audited and bound by Data Processing Agreements (DPA)?',
    ],
  },
];

export default function SecurityQuestionnairePage() {
  const [questionsInput, setQuestionsInput] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('SOC 2 Type II & ISO 27001');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [error, setError] = useState('');

  const handlePresetSelect = (preset: typeof TEMPLATE_PRESETS[0]) => {
    setQuestionsInput(preset.questions.join('\n'));
    setSelectedFramework(preset.framework);
    setError('');
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    const questionsArray = questionsInput
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    if (questionsArray.length === 0) {
      setError('Please enter at least one security question or load a preset template.');
      return;
    }

    setLoading(true);
    setError('');

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
    link.setAttribute('download', `Security_Questionnaire_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="pl-80 flex-1 p-10 min-h-screen">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-semibold mb-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Product #5: SOC2 & ISO 27001 Security Resolver
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Security Questionnaire Engine</h1>
            <p className="text-slate-400 text-xs mt-1">
              Automate enterprise vendor risk assessments (SOC 2, ISO 27001, GDPR) grounded in your policy documents.
            </p>
          </div>

          {results.length > 0 && (
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export to CSV / Excel
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Questionnaire Input & Presets */}
          <div className="space-y-6">
            {/* Presets Card */}
            <div className="glass-panel p-6 rounded-3xl border-slate-800">
              <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" /> Quick Load Preset Templates
              </h2>
              <div className="space-y-2">
                {TEMPLATE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-violet-600/15 border border-slate-800 hover:border-violet-500/40 transition group cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white group-hover:text-violet-300 transition">
                        {preset.name}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        {preset.questions.length} Questions
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="glass-panel p-6 rounded-3xl border-slate-800">
              <form onSubmit={handleResolve} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Compliance Framework Target
                  </label>
                  <select
                    value={selectedFramework}
                    onChange={(e) => setSelectedFramework(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  >
                    <option value="SOC 2 Type II & ISO 27001">SOC 2 Type II & ISO 27001:2022</option>
                    <option value="GDPR & Data Privacy">GDPR & EU Privacy Impact</option>
                    <option value="NIST SP 800-53 / Cybersecurity">NIST SP 800-53 Cybersecurity</option>
                    <option value="HIPAA Security & Privacy">HIPAA Compliance (Healthcare)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Paste Security Questions (One per line)
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={questionsInput}
                    onChange={(e) => setQuestionsInput(e.target.value)}
                    placeholder="e.g. Is customer data encrypted at rest using AES-256?&#10;How are SOC 2 audit logs stored and retained?"
                    className="w-full glass-input rounded-xl p-3.5 text-xs text-white placeholder-slate-500 resize-none font-mono"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition shadow-lg shadow-violet-500/10 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resolving Security Policy...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Resolve Security Questionnaire
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Interactive Results Workspace */}
          <div className="lg:col-span-2 space-y-4">
            {results.length === 0 ? (
              <div className="glass-panel p-12 rounded-3xl border-slate-800 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="h-14 w-14 rounded-2xl bg-violet-600/10 flex items-center justify-center mb-4 text-violet-400">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Questionnaire Resolved Yet</h3>
                <p className="text-slate-400 text-xs max-w-sm leading-relaxed mb-6">
                  Select a preset template on the left or paste vendor security questions to generate grounded compliance answers.
                </p>
                <button
                  onClick={() => handlePresetSelect(TEMPLATE_PRESETS[0])}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
                >
                  Load Sample SOC 2 Template &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Resolved Questions ({results.length})
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 100% Policy Grounded
                  </span>
                </div>

                {results.map((r, idx) => (
                  <div key={r.id} className="glass-panel p-6 rounded-3xl border-slate-800 hover:border-slate-700 transition">
                    <div className="flex justify-between items-start mb-3 gap-4">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-violet-400">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white">{r.question}</h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                          r.confidence === 'HIGH' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          r.confidence === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {r.confidence} Confidence
                        </span>

                        <span className="text-[9px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded-md">
                          {r.control}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-900 text-xs text-slate-200 leading-relaxed font-sans mb-3">
                      {r.answer}
                    </div>

                    {r.sources.length > 0 && (
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-900/60">
                        <FileText className="h-3 w-3 text-violet-400" />
                        <span>Source Documents: {r.sources.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
