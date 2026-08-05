'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, FileText, Download, 
  Sparkles, Loader2, FileSpreadsheet, ArrowRight, Building, Check, ShieldAlert
} from 'lucide-react';

export default function BuildingConsentAuditorPage() {
  const [buildingType, setBuildingType] = useState('Residential Multi-Unit');
  const [specificationText, setSpecificationText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgressText, setLoadingProgressText] = useState('Auditing Specs against NZBC Database...');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    summary: string;
    items: Array<{
      clause: string;
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
      setLoadingProgressText('Auditing Specs against NZBC Database...');
      t1 = setTimeout(() => setLoadingProgressText('Analyzing complex multi-storey architectural clauses...'), 15000);
      t2 = setTimeout(() => setLoadingProgressText('Checking structural (B1), moisture (E2) & energy (H1) contradictions...'), 45000);
      t3 = setTimeout(() => setLoadingProgressText('Compiling clause recommendations & risk ratings...'), 85000);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [loading]);

  const handleAudit = async () => {
    if (!specificationText.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildingType, specificationText }),
      });

      const rawText = await res.text();
      let data: any = {};
      try { data = JSON.parse(rawText); } catch (e) {}

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to run consent audit. Please check your specifications.');
      }
    } catch (err: any) {
      console.error('Audit submission error:', err);
      setError(err.message || 'An unexpected error occurred during building consent audit.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleSpec = () => {
    setSpecificationText(`Project: Proposed 3-Storey Residential Townhouse Complex (Zone: High Wind / Exposure Zone D)
Cladding Specification:
- Ground & First Floor: 70mm Clay brick veneer over 50mm cavity on timber framing with RAB board.
- Second Floor: Vertical Cedar Weatherboard with 20mm drained cavity system over rigid air barrier.
Roofing: Colorsteel trapezoidal roofing profile at 5-degree pitch with continuous butyl rubber gutters.
Foundations: Reinforced concrete slab-on-ground to NZS 3604 with R-1.5 perimeter insulation.
Glazing: Low-E double glazing thermally broken aluminium joinery (R-0.46 overall window system).
Water Supply: Mains pressure hot water cylinder with tempering valves set to 55°C at outlets.
Fire Safety: Interconnected hardwired optical smoke alarms in all bedrooms and egress corridors.
Insulation: R-4.0 ceiling batts, R-2.8 wall batts.`);
  };

  const exportCSV = () => {
    if (!result) return;
    let csvContent = 'NZBC Clause,Topic,Status,Risk Rating,Audit Findings,Recommendation\n';
    result.items.forEach((item) => {
      csvContent += `"${item.clause}","${item.topic}","${item.status}","${item.riskRating}","${item.findings.replace(/"/g, '""')}","${item.recommendation.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NZBC_Consent_Audit_${buildingType.replace(/\s+/g, '_')}.csv`);
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
              ⚠️ BUSINESS SAFEGUARD & LEGAL DISCLAIMER
            </span>
            <span>
              ContextSkeleton is an automated software data processing service. Outputs do NOT constitute legal, architectural, engineering, or certified building code advice and do not replace licensed Registered Architects, Chartered Professional Engineers (CPEng), or official council consent lodgements.
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <ShieldCheck className="h-3.5 w-3.5" /> AI Building Consent &amp; Plan Auditor
            </div>
            <h1 className="text-3xl font-extrabold text-white">Council Consent Pre-Audit Engine</h1>
            <p className="text-slate-400 text-xs mt-1">Audit architectural drawings &amp; specs against NZBC Building Code prior to council submission.</p>
          </div>

          <button
            onClick={loadSampleSpec}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
          >
            <FileText className="h-4 w-4 text-violet-400" />
            Load Sample NZ Spec
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Building Typology / Classification
                </label>
                <select
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Residential Multi-Unit">Residential Multi-Unit (Townhouses / Apartments)</option>
                  <option value="Single Standalone Dwelling">Single Standalone Dwelling (NZS 3604)</option>
                  <option value="Commercial Office / Retail">Commercial Office / Retail (C1-C6 Fire)</option>
                  <option value="Industrial / Warehouse">Industrial / Warehouse (Hazardous Goods)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Architectural &amp; Engineering Specification Text
                </label>
                <textarea
                  rows={10}
                  value={specificationText}
                  onChange={(e) => setSpecificationText(e.target.value)}
                  placeholder="Paste architectural specification notes, exterior cladding details, foundation schedules, or structural notes..."
                  className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed font-mono"
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                onClick={handleAudit}
                disabled={loading || !specificationText.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span className="truncate">{loadingProgressText}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Run NZBC Pre-Consent Audit
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
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    Audit Summary &amp; Clause Findings
                  </h2>

                  {result && (
                    <button
                      onClick={exportCSV}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                      Export CSV Audit Report
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Loader2 className="h-7 w-7 text-emerald-400 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-sm">Pre-Consent Audit Engine Running</h3>
                      <p className="text-slate-400 text-xs max-w-xs mx-auto animate-pulse">
                        {loadingProgressText}
                      </p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-6">
                    {/* Executive Summary */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-2">
                      <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">Executive Pre-Audit Summary</span>
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
                                <span className="text-xs font-bold text-white">{item.clause}</span>
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

                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-xs text-emerald-300/90 font-mono">
                              <strong>Recommendation:</strong> {item.recommendation}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                    <ShieldCheck className="h-10 w-10 text-slate-700 mb-3" />
                    <p className="text-xs">Paste architectural specifications on the left to generate an automated NZBC Pre-Consent audit report.</p>
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
