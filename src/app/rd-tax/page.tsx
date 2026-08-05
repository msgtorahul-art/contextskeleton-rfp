'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Calculator, DollarSign, Download, FileSpreadsheet, Sparkles, Loader2, 
  AlertTriangle, CheckCircle2, FileText, ArrowRight, ShieldAlert, Cpu
} from 'lucide-react';

export default function RdTaxResolverPage() {
  const [projectName, setProjectName] = useState('');
  const [taxJurisdiction, setTaxJurisdiction] = useState('NZ IRD (15% RDTI)');
  const [projectDescription, setProjectDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    technicalJustification: string;
    items: Array<{
      activityName: string;
      classification: string;
      uncertaintyType: string;
      auditRisk: string;
      taxRationale: string;
      documentationRecommendation: string;
    }>;
  } | null>(null);

  const handleResolve = async () => {
    if (!projectName.trim() || !projectDescription.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/rd-tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          taxJurisdiction,
          projectDescription,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to run R&D tax analysis.');
      }
    } catch (err) {
      console.error('R&D Tax Analysis Error:', err);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type: string) => {
    if (type === 'software') {
      setProjectName('Distributed High-Throughput Vector Embedding Pipeline');
      setTaxJurisdiction('NZ IRD (15% RDTI)');
      setProjectDescription(`Objective: Develop an autonomous low-latency vector RAG query router capable of processing 50,000 queries/sec with sub-10ms response times over SQLite clusters.
Technological Uncertainty: Standard off-the-shelf vector indexing failed under multi-tenant lock contention.
Systematic Investigation: Conducted 14 benchmark iterations evaluating custom memory-mapped HNSW graph indexing against SQLite WAL mode concurrency.
Result: Created proprietary lock-free query caching layer yielding 92% token compression.`);
    } else if (type === 'hardware') {
      setProjectName('Autonomous Robotic Assembly Control Hardware');
      setTaxJurisdiction('Australian ATO R&D Incentive');
      setProjectDescription(`Objective: Design custom micro-controller PCB and real-time firmware for sub-millimeter robotic arm alignment in high-temperature environments.
Technological Uncertainty: Thermal dissipation caused micro-controller clock drift exceeding ±5ms.
Systematic Investigation: Tested 6 heat sink geometries and ceramic insulation layers while monitoring CPU clock stability.
Result: Achieved stable clock frequencies up to 125°C ambient operating temperature.`);
    }
  };

  const exportCSV = () => {
    if (!result) return;
    let csvContent = 'Activity Name,Classification,Uncertainty Type,Audit Risk,Tax Rationale,Documentation Recommendation\n';
    result.items.forEach((item) => {
      csvContent += `"${item.activityName}","${item.classification}","${item.uncertaintyType}","${item.auditRisk}","${item.taxRationale.replace(/"/g, '""')}","${item.documentationRecommendation.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RD_Tax_Audit_${projectName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <Sidebar />

      <main className="pl-80 flex-1 p-10 min-h-screen">
        {/* SAFEGUARD & BUSINESS PROTECTION NOTICE BANNER */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block mb-0.5 text-amber-300">
              ⚠️ BUSINESS SAFEGUARD & LEGAL DISCLAIMER
            </span>
            <span>
              ContextSkeleton is an automated software data processing service. Outputs do NOT constitute formal tax, legal, or certified accounting advice and do not replace licensed CPAs, Chartered Accountants, or official government tax authority filings.
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Calculator className="h-3.5 w-3.5" /> R&amp;D Tax &amp; Audit Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white">R&amp;D Tax Credit &amp; Audit Risk Analyzer</h1>
            <p className="text-slate-400 text-xs mt-1">Automate technical justifications and tax audit defense for IRD (15% RDTI), ATO, and IRS Section 41 claims.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => loadPreset('software')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load Software R&amp;D Preset
            </button>
            <button
              onClick={() => loadPreset('hardware')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load Hardware R&amp;D Preset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 lg:col-span-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-amber-400" /> R&amp;D Project Claim Parameters
            </h2>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">R&amp;D Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. High-Throughput RAG Vector Engine"
                className="w-full glass-input rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tax Authority Jurisdiction</label>
              <select
                value={taxJurisdiction}
                onChange={(e) => setTaxJurisdiction(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
              >
                <option value="NZ IRD (15% RDTI)">NZ IRD (15% R&D Tax Incentive)</option>
                <option value="Australian ATO R&D Incentive">Australian ATO R&D Incentive</option>
                <option value="US IRS Section 41 R&D Credit">US IRS Section 41 R&D Credit</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Technical Description &amp; Experimentation Notes</label>
              <textarea
                rows={10}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe technological uncertainties, experimental iterations, software benchmark results, or engineering challenges..."
                className="w-full glass-input rounded-xl p-3 text-xs text-white resize-none"
              />
            </div>

            <button
              onClick={handleResolve}
              disabled={loading || !projectName.trim() || !projectDescription.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-amber-500/10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing R&amp;D Eligibility &amp; Tax Audit Risk...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4" />
                  Run R&amp;D Tax Audit Analysis
                </>
              )}
            </button>
          </div>

          {/* Right Results Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-6 lg:col-span-2">
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" /> R&amp;D Technical Justification &amp; Defense File
              </h2>

              {result && (
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Export CSV Tax Spreadsheet
                </button>
              )}
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Executive R&amp;D Claim Summary</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{result.summary}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Tax Audit Defense Technical Narrative</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{result.technicalJustification}</p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Activity Classification &amp; Audit Risk Breakdown</span>
                  
                  <div className="space-y-3">
                    {result.items.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{item.activityName}</span>
                          <div className="flex gap-2">
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              item.classification === 'ELIGIBLE_CORE_RD' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {item.classification}
                            </span>
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                              Audit Risk: {item.auditRisk}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400">{item.taxRationale}</p>
                        <p className="text-[11px] text-amber-300/90 font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-900">
                          Archive Recommendation: {item.documentationRecommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                <Calculator className="h-10 w-10 text-slate-700 mb-3" />
                <p className="text-xs">Fill out the R&amp;D project parameters on the left to generate tax authority technical justification narratives.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
