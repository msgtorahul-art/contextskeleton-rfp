'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  AlertTriangle, FileText, Loader2, Sparkles, ShieldAlert, Copy, Check, ShieldCheck
} from 'lucide-react';

export default function SecIncidentPage() {
  const [companyName, setCompanyName] = useState('');
  const [incidentNotes, setIncidentNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgressText, setLoadingProgressText] = useState('Evaluating Breach Triage against SEC Item 1.05 Materiality Thresholds...');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    summary?: string;
    materialityAssessment?: string;
    item105Draft?: string;
    recommendedActions?: string[];
  } | null>(null);

  useEffect(() => {
    let t1: NodeJS.Timeout, t2: NodeJS.Timeout;
    if (loading) {
      setLoadingProgressText('Evaluating Breach Triage against SEC Item 1.05 Materiality Thresholds...');
      t1 = setTimeout(() => setLoadingProgressText('Calculating financial & operational downtime impact...'), 10000);
      t2 = setTimeout(() => setLoadingProgressText('Drafting formal SEC Form 8-K disclosure text...'), 25000);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loading]);

  const handleAudit = async () => {
    if (!incidentNotes.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/sec-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, incidentNotes }),
      });

      const rawText = await res.text();
      let data: any = {};
      try { data = JSON.parse(rawText); } catch (e) {}

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to evaluate SEC materiality.');
      }
    } catch (err: any) {
      console.error('Audit submission error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleBreach = () => {
    setCompanyName('Apex Financial Systems Corp (NASDAQ: AFSC)');
    setIncidentNotes(`Breach Discovery & Triage Summary:
- Discovery Date: August 4, 2026 at 03:15 UTC.
- Incident Vector: Ransomware deployment targeting primary SAP ERP & customer database clusters.
- Scope of Impact: 48 hours of total trading system downtime; an estimated 480,000 customer payment records exfiltrated.
- Financial Impact: Estimated direct remediation & forensic cost: $4.2M; operational downtime revenue impact: $8.5M.
- Law Enforcement: FBI Cyber Division notified; third-party breach incident response team (Mandiant) engaged.`);
  };

  const handleCopyForm8K = () => {
    if (!result) return;
    const textToCopy = result.item105Draft || (result as any).draft8k || (result as any).form8kText || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const materialityText = result ? (result.materialityAssessment || (result as any).materiality || (result as any).summary || 'Materiality determination completed.') : '';
  const form8kText = result ? (result.item105Draft || (result as any).draft8k || (result as any).form8kText || (result as any).item105 || 'Form 8-K disclosure text generated.') : '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <Sidebar />

      <main className="pl-80 flex-1 p-10 min-h-screen">
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block mb-0.5 text-amber-300">
              ⚠️ SECURITIES LAW DISCLAIMER
            </span>
            <span>
              ContextSkeleton is an automated administrative decision-support tool under SEC Item 1.05 rules. Materiality determinations and Form 8-K drafts must be reviewed by qualified corporate securities counsel prior to SEC EDGAR submission.
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <AlertTriangle className="h-3.5 w-3.5" /> SEC 4-Day Incident War Room
            </div>
            <h1 className="text-3xl font-extrabold text-white">SEC Form 8-K Item 1.05 Materiality Engine</h1>
            <p className="text-slate-400 text-xs mt-1">Evaluate incident materiality &amp; draft SEC Form 8-K Item 1.05 filings within the mandatory 4-day window.</p>
          </div>

          <button
            onClick={loadSampleBreach}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
          >
            <FileText className="h-4 w-4 text-rose-400" />
            Load Sample Breach Triage
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Public Company / Entity Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Financial Systems (NASDAQ: AFSC)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Incident Responder Forensic &amp; Downtime Notes
                </label>
                <textarea
                  rows={10}
                  value={incidentNotes}
                  onChange={(e) => setIncidentNotes(e.target.value)}
                  placeholder="Paste breach discovery logs, exfiltrated record estimates, financial impact, and downtime notes..."
                  className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-rose-500 resize-none leading-relaxed font-mono"
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                onClick={handleAudit}
                disabled={loading || !incidentNotes.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-rose-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span className="truncate">{loadingProgressText}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    Evaluate SEC Materiality ($5,000 Retainer)
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-panel p-6 rounded-3xl min-h-[500px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-slate-900 pb-4 mb-6">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-rose-400" />
                    SEC Item 1.05 Materiality Assessment &amp; Draft Filing
                  </h2>

                  {result && (
                    <button
                      onClick={handleCopyForm8K}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-rose-400" />}
                      {copied ? 'Copied Form 8-K Text' : 'Copy Form 8-K Text'}
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                      <Loader2 className="h-7 w-7 text-rose-400 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-sm">Evaluating SEC Disclosure Thresholds</h3>
                      <p className="text-slate-400 text-xs max-w-xs mx-auto animate-pulse">
                        {loadingProgressText}
                      </p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-6">
                    {/* Materiality Determination Box */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-2">
                      <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider block flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" /> SEC Item 1.05 Materiality Determination
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">{materialityText}</p>
                    </div>

                    {/* Draft Form 8-K Box */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-2">
                      <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider block flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5" /> Draft Form 8-K Item 1.05 Text (EDGAR Ready)
                      </span>
                      <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{form8kText}</pre>
                    </div>

                    {/* Recommended Actions */}
                    {result.recommendedActions && result.recommendedActions.length > 0 && (
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-2">
                        <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider block">Immediate 4-Day Action Items</span>
                        <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1">
                          {result.recommendedActions.map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                    <AlertTriangle className="h-10 w-10 text-slate-700 mb-3" />
                    <p className="text-xs">Paste incident responder triage notes on the left to evaluate SEC materiality under Item 1.05 rules.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
