'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  ShieldCheck, FileText, Loader2, FileSpreadsheet, Sparkles, Cpu, ShieldAlert, CpuIcon
} from 'lucide-react';

export default function AIActCompliancePage() {
  const [modelName, setModelName] = useState('');
  const [riskCategory, setRiskCategory] = useState('High-Risk AI System (Article 6)');
  const [modelArchitectureText, setModelArchitectureText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgressText, setLoadingProgressText] = useState('Auditing Model against EU AI Act (Reg EU 2024/1689)...');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    summary: string;
    items: Array<{
      article: string;
      topic: string;
      status: string;
      riskRating: string;
      findings: string;
      recommendation: string;
    }>;
  } | null>(null);

  useEffect(() => {
    let t1: NodeJS.Timeout, t2: NodeJS.Timeout, t3: NodeJS.Timeout;
    if (loading) {
      setLoadingProgressText('Auditing Model against EU AI Act (Reg EU 2024/1689)...');
      t1 = setTimeout(() => setLoadingProgressText('Scanning Annex IV technical documentation & dataset provenance...'), 12000);
      t2 = setTimeout(() => setLoadingProgressText('Checking Article 9 Risk System & Article 14 Human Oversight...'), 35000);
      t3 = setTimeout(() => setLoadingProgressText('Compiling Annex IV audit pack & EU fine exposure rating...'), 65000);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [loading]);

  const handleAudit = async () => {
    if (!modelArchitectureText.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ai-act', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName, riskCategory, modelArchitectureText }),
      });

      const rawText = await res.text();
      let data: any = {};
      try { data = JSON.parse(rawText); } catch (e) {}

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to run EU AI Act pre-audit.');
      }
    } catch (err: any) {
      console.error('Audit submission error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleSpec = () => {
    setModelName('Cognitive HR Screening & Credit Risk Model v4.2');
    setModelArchitectureText(`AI System Architecture & Intended Purpose:
- Primary Function: Automated scoring of candidate resume suitability and credit applicant risk profiles.
- Backbone Architecture: Fine-tuned Llama-3 70B parameter model integrated with pinecone RAG vector index.
- Training Data Provenance: 2.4M historical applicant profiles collected between 2018–2025.
- Risk Management & Guardrail Systems: Cosine similarity thresholding set to 0.75 for fact retrieval.
- Human Oversight Protocol: Output scores above 80% are auto-approved; output scores between 40-79% flagged for manual HR review.`);
  };

  const exportCSV = () => {
    if (!result) return;
    let csvContent = 'EU AI Act Article,Topic,Status,Risk Rating,Audit Findings,Recommendation\n';
    result.items.forEach((item) => {
      csvContent += `"${item.article}","${item.topic}","${item.status}","${item.riskRating}","${item.findings.replace(/"/g, '""')}","${item.recommendation.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EU_AI_Act_Annex_IV_Audit.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <Sidebar />

      <main className="pl-80 flex-1 p-10 min-h-screen">
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block mb-0.5 text-amber-300">
              ⚠️ EU REGULATORY DISCLAIMER
            </span>
            <span>
              ContextSkeleton is an automated software audit tool. Pre-audit technical cards do not replace formal EU Notified Body assessments, CE mark registrations, or certified legal counsel under Regulation (EU) 2024/1689.
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Cpu className="h-3.5 w-3.5" /> EU AI Act Annex IV Compliance Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white">EU AI Act Technical Documentation Audit</h1>
            <p className="text-slate-400 text-xs mt-1">Audit AI model repos &amp; system architecture against mandatory Regulation (EU) 2024/1689 Annex IV requirements.</p>
          </div>

          <button
            onClick={loadSampleSpec}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
          >
            <FileText className="h-4 w-4 text-cyan-400" />
            Load Sample AI Model Spec
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  AI System Classification
                </label>
                <select
                  value={riskCategory}
                  onChange={(e) => setRiskCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="High-Risk AI System (Article 6)">High-Risk System (Article 6 - Biometrics, Credit, Employment)</option>
                  <option value="General Purpose AI (GPAI) Model">General Purpose AI (GPAI) Model (Article 51 - Systemic Risk)</option>
                  <option value="Limited Risk System">Limited Risk System (Transparency / Chatbot Article 50)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Model / System Identifier
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cognitive HR Screening v4.2"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Model Architecture &amp; Training Spec
                </label>
                <textarea
                  rows={9}
                  value={modelArchitectureText}
                  onChange={(e) => setModelArchitectureText(e.target.value)}
                  placeholder="Paste model training dataset details, backbone parameters, RAG retrieval thresholds, and human oversight controls..."
                  className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed font-mono"
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                onClick={handleAudit}
                disabled={loading || !modelArchitectureText.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-cyan-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span className="truncate">{loadingProgressText}</span>
                  </>
                ) : (
                  <>
                    <Cpu className="h-4 w-4" />
                    Run EU AI Act Annex IV Audit ($1,499 Tier)
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
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    Annex IV Compliance Findings
                  </h2>

                  {result && (
                    <button
                      onClick={exportCSV}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-cyan-400" />
                      Export CSV Annex IV Audit Pack
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Loader2 className="h-7 w-7 text-cyan-400 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-sm">EU AI Act Pre-Audit Engine Running</h3>
                      <p className="text-slate-400 text-xs max-w-xs mx-auto animate-pulse">
                        {loadingProgressText}
                      </p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-6">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-2">
                      <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider block">Executive Annex IV Audit Summary</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">{result.summary}</p>
                    </div>

                    <div className="space-y-4">
                      {result.items.map((item, idx) => {
                        const isPass = item.status === 'PASS';
                        return (
                          <div
                            key={idx}
                            className={`p-5 rounded-2xl border transition-all ${
                              isPass 
                                ? 'bg-slate-950/80 border-slate-900' 
                                : 'bg-rose-950/10 border-rose-500/20'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">{item.article}</span>
                                <span className="text-xs text-slate-400 font-medium">({item.topic})</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                                  isPass 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {item.status}
                                </span>
                                <span className="text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                                  Risk: {item.riskRating}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                              {item.findings}
                            </p>

                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-xs text-cyan-300/90 font-mono">
                              <strong>Engineering Revision:</strong> {item.recommendation}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                    <Cpu className="h-10 w-10 text-slate-700 mb-3" />
                    <p className="text-xs">Paste model specifications on the left to pre-audit against Regulation (EU) 2024/1689 Annex IV requirements.</p>
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
