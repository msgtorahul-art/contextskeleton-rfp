'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Building2, FileText, Loader2, FileSpreadsheet, Sparkles, ShieldAlert
} from 'lucide-react';

export default function CreLeasePage() {
  const [propertyAddress, setPropertyAddress] = useState('');
  const [leaseText, setLeaseText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgressText, setLoadingProgressText] = useState('Shredding Commercial Lease & Extracting Financial Matrices...');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    summary: string;
    items: Array<{
      clause: string;
      details: string;
      riskFlag: string;
      recommendation: string;
    }>;
  } | null>(null);

  useEffect(() => {
    let t1: NodeJS.Timeout, t2: NodeJS.Timeout;
    if (loading) {
      setLoadingProgressText('Shredding Commercial Lease & Extracting Financial Matrices...');
      t1 = setTimeout(() => setLoadingProgressText('Analyzing rent escalations, CAM expense caps, and audit rights...'), 10000);
      t2 = setTimeout(() => setLoadingProgressText('Checking co-tenancy rules and legal risk contradictions...'), 25000);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loading]);

  const handleAudit = async () => {
    if (!leaseText.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/cre-lease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyAddress, leaseText }),
      });

      const rawText = await res.text();
      let data: any = {};
      try { data = JSON.parse(rawText); } catch (e) {}

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to abstract CRE lease.');
      }
    } catch (err: any) {
      console.error('Audit submission error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleLease = () => {
    setPropertyAddress('100 Plaza Drive, Suite 400 (TechCorp Plaza)');
    setLeaseText(`COMMERCIAL LEASE AGREEMENT SUMMARY
1. Term & Rent: 5-Year initial term starting Oct 1, 2025. Base rent $45/sq ft ($180,000/yr) with 3% annual escalation on each anniversary date.
2. Section 4.2 Operating Expenses (CAM): Tenant shall pay proportionate share of CAM expenses. Controllable operating expenses shall be capped at a cumulative 10% annual increase.
3. Section 8.1 Renewal & Expenses: Tenant retains option to renew for 5 years at Fair Market Rent (FMR). Operating expenses during renewal shall not exceed a non-cumulative 15% annual increase.
4. Section 12.1 Assignment & Subletting: Tenant may not assign lease without Landlord written consent. Landlord shall not unreasonably withhold consent.`);
  };

  const exportCSV = () => {
    if (!result) return;
    let csvContent = 'Lease Clause,Extracted Details,Risk Flag,Action Recommendation\n';
    (result.items || []).forEach((item) => {
      csvContent += `"${item.clause}","${(item.details || '').replace(/"/g, '""')}","${item.riskFlag}","${(item.recommendation || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CRE_Lease_Abstraction.csv`);
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
              ⚠️ CRE LEGAL DISCLAIMER
            </span>
            <span>
              ContextSkeleton is an automated administrative lease due-diligence tool. Abstraction matrices are preliminary software summaries and must be reviewed by qualified commercial real estate legal counsel.
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Building2 className="h-3.5 w-3.5" /> CRE Lease Abstractor Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white">Commercial Real Estate Lease Due Diligence</h1>
            <p className="text-slate-400 text-xs mt-1">Extract rent rolls, CAM expense caps, co-tenancy rules, and legal risk flags from commercial leases.</p>
          </div>

          <button
            onClick={loadSampleLease}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
          >
            <FileText className="h-4 w-4 text-amber-400" />
            Load Sample Commercial Lease
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Property Address / Tenant Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100 Plaza Drive, Suite 400"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Commercial Lease Agreement Text
                </label>
                <textarea
                  rows={10}
                  value={leaseText}
                  onChange={(e) => setLeaseText(e.target.value)}
                  placeholder="Paste commercial lease agreement text, CAM operating expense clauses, and rent escalation schedules..."
                  className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none leading-relaxed font-mono"
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                onClick={handleAudit}
                disabled={loading || !leaseText.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-amber-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span className="truncate">{loadingProgressText}</span>
                  </>
                ) : (
                  <>
                    <Building2 className="h-4 w-4" />
                    Abstract CRE Lease ($1,500 Tier)
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
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    Lease Abstraction Matrix &amp; Risk Flags
                  </h2>

                  {result && (
                    <button
                      onClick={exportCSV}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-amber-400" />
                      Export CSV Lease Matrix
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <Loader2 className="h-7 w-7 text-amber-400 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-sm">CRE Lease Due Diligence Engine Running</h3>
                      <p className="text-slate-400 text-xs max-w-xs mx-auto animate-pulse">
                        {loadingProgressText}
                      </p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-6">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-2">
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">Executive Lease Summary</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">{result.summary}</p>
                    </div>

                    <div className="space-y-4">
                      {(result.items || []).map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-900 text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">{item.clause}</span>
                            <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                              item.riskFlag === 'HIGH' 
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              Risk: {item.riskFlag || 'LOW'}
                            </span>
                          </div>
                          <p className="text-slate-300">{item.details}</p>
                          {item.recommendation && (
                            <p className="text-amber-300/80 text-[11px]"><strong>Recommendation:</strong> {item.recommendation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                    <Building2 className="h-10 w-10 text-slate-700 mb-3" />
                    <p className="text-xs">Paste commercial lease text on the left to extract rent rolls, CAM caps, and legal risk flags.</p>
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
