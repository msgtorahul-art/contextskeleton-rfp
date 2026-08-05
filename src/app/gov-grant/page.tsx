'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  ShieldCheck, FileText, Loader2, FileSpreadsheet, Sparkles, Building2, Check, ShieldAlert, Award
} from 'lucide-react';

export default function GovGrantArchitectPage() {
  const [grantType, setGrantType] = useState('SBIR / STTR Phase I');
  const [grantTitle, setGrantTitle] = useState('');
  const [proposalNarrative, setProposalNarrative] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgressText, setLoadingProgressText] = useState('Auditing Proposal against SAM.gov & FAR Database...');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    summary: string;
    items: Array<{
      requirement: string;
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
      setLoadingProgressText('Auditing Proposal against SAM.gov & FAR Database...');
      t1 = setTimeout(() => setLoadingProgressText('Analyzing FAR commercialization & technical merit clauses...'), 12000);
      t2 = setTimeout(() => setLoadingProgressText('Checking Cost Accounting Standards (CAS) & key personnel schedules...'), 35000);
      t3 = setTimeout(() => setLoadingProgressText('Compiling FAR screening recommendations & rejection risk ratings...'), 65000);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [loading]);

  const handleAudit = async () => {
    if (!proposalNarrative.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/gov-grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grantType, grantTitle, proposalNarrative }),
      });

      const rawText = await res.text();
      let data: any = {};
      try { data = JSON.parse(rawText); } catch (e) {}

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to run Federal Grant pre-audit. Please check your narrative text.');
      }
    } catch (err: any) {
      console.error('Audit submission error:', err);
      setError(err.message || 'An unexpected error occurred during grant pre-audit.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleGrant = () => {
    setGrantTitle('DoD SBIR Topic N261-042: Autonomous Edge Mesh AI Systems');
    setProposalNarrative(`Project Executive Summary:
This Phase I SBIR proposal introduces a dual-use resilient autonomous mesh AI architecture designed for degraded electromagnetic environments.

Technical Merit & Approach:
- Employs zero-bandwidth token skeletonization algorithms to minimize satellite link latency by 90%.
- Implements decentralized consensus across tactical edge nodes without relying on centralized cloud servers.
- Primary Investigator: Dr. Marcus Vance (15 years defense AI research, 4 patents in resilient mesh protocols).

Commercialization & Dual-Use Strategy:
- Primary DoD Customer: US Navy PEO C4I and Air Force Research Lab (AFRL).
- Commercial Market: Industrial IoT infrastructure monitoring for oil & gas energy grids (Estimated TAM: $2.4B).
- Targeted Phase III Transition Partner: Defense prime contractors (Northrop Grumman, General Dynamics).

Budget & Facilities:
- Direct Labor: $140,000 (Principal Investigator: 500 hours @ $140/hr).
- Materials & Subcontracts: $35,000 for high-density edge hardware testbeds.
- Total Phase I Request: $225,000 over 6 months.`);
  };

  const exportCSV = () => {
    if (!result) return;
    let csvContent = 'FAR Requirement,Topic,Status,Risk Rating,Audit Findings,Recommendation\n';
    result.items.forEach((item) => {
      csvContent += `"${item.requirement}","${item.topic}","${item.status}","${item.riskRating}","${item.findings.replace(/"/g, '""')}","${item.recommendation.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GovWin_Grant_Audit_${grantType.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <Sidebar />

      <main className="pl-80 flex-1 p-10 min-h-screen">
        {/* SAFEGUARD BANNER */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block mb-0.5 text-amber-300">
              ⚠️ FEDERAL PROCUREMENT DISCLAIMER
            </span>
            <span>
              ContextSkeleton is an automated software evaluation service. Pre-audit screening results do not replace official Contracting Officer (CO) reviews or guaranteed grant award decisions by SAM.gov, DoD, DARPA, or NIH agencies.
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Award className="h-3.5 w-3.5" /> GovWin &amp; SBIR Defense Grant Architect
            </div>
            <h1 className="text-3xl font-extrabold text-white">Federal Grant &amp; SAM.gov Pre-Audit Engine</h1>
            <p className="text-slate-400 text-xs mt-1">Screen SBIR/STTR grants &amp; federal procurement proposals against FAR jargon and narrative skeleton requirements.</p>
          </div>

          <button
            onClick={loadSampleGrant}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
          >
            <FileText className="h-4 w-4 text-indigo-400" />
            Load Sample DoD SBIR Spec
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Grant / Procurement Vehicle Typology
                </label>
                <select
                  value={grantType}
                  onChange={(e) => setGrantType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="SBIR / STTR Phase I">DoD / NSF / NIH SBIR Phase I ($225k–$275k)</option>
                  <option value="SBIR / STTR Phase II">DoD / NSF / NIH SBIR Phase II ($1.5M–$2.0M)</option>
                  <option value="GovWin Federal RFP">SAM.gov Federal Procurement Tender (FAR Jargon)</option>
                  <option value="DARPA / ARPA-E BAA">Broad Agency Announcement (BAA) Technical Proposal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Grant Opportunity Title / Topic #
                </label>
                <input
                  type="text"
                  placeholder="e.g. DoD SBIR Topic N261-042"
                  value={grantTitle}
                  onChange={(e) => setGrantTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Proposal Narrative &amp; Technical Approach
                </label>
                <textarea
                  rows={9}
                  value={proposalNarrative}
                  onChange={(e) => setProposalNarrative(e.target.value)}
                  placeholder="Paste technical narrative, commercialization strategy, key personnel schedules, and budget justifications..."
                  className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed font-mono"
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                onClick={handleAudit}
                disabled={loading || !proposalNarrative.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-indigo-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span className="truncate">{loadingProgressText}</span>
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4" />
                    Run Federal Grant Pre-Audit ($999 Tier)
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
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    FAR Audit Summary &amp; Compliance Findings
                  </h2>

                  {result && (
                    <button
                      onClick={exportCSV}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-indigo-400" />
                      Export CSV Grant Audit Report
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <Loader2 className="h-7 w-7 text-indigo-400 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-sm">Federal Grant Screening Engine Running</h3>
                      <p className="text-slate-400 text-xs max-w-xs mx-auto animate-pulse">
                        {loadingProgressText}
                      </p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-6">
                    {/* Executive Summary */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-2">
                      <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider block">Executive Screening Pre-Audit Summary</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">{result.summary}</p>
                    </div>

                    {/* Clause-by-Clause Findings */}
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
                                <span className="text-xs font-bold text-white">{item.requirement}</span>
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

                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-xs text-indigo-300/90 font-mono">
                              <strong>Actionable Recommendation:</strong> {item.recommendation}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                    <Award className="h-10 w-10 text-slate-700 mb-3" />
                    <p className="text-xs">Paste proposal narratives on the left to pre-audit against SAM.gov, FAR clauses, and SBIR Phase I/II commercialization rules.</p>
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
