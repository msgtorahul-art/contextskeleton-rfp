'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Server, FileText, Loader2, FileSpreadsheet, Sparkles, ShieldAlert
} from 'lucide-react';

export default function DoraAuditPage() {
  const [vendorName, setVendorName] = useState('');
  const [systemSpec, setSystemSpec] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgressText, setLoadingProgressText] = useState('Auditing ICT Infrastructure against EU DORA (Reg EU 2022/2554)...');
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
    let t1: NodeJS.Timeout, t2: NodeJS.Timeout;
    if (loading) {
      setLoadingProgressText('Auditing ICT Infrastructure against EU DORA (Reg EU 2022/2554)...');
      t1 = setTimeout(() => setLoadingProgressText('Scanning DORA Article 9 & 28 third-party concentration risks...'), 10000);
      t2 = setTimeout(() => setLoadingProgressText('Compiling ICT failover & audit access evidence pack...'), 25000);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loading]);

  const handleAudit = async () => {
    if (!systemSpec.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/dora-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorName, systemSpec }),
      });

      const rawText = await res.text();
      let data: any = {};
      try { data = JSON.parse(rawText); } catch (e) {}

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to run DORA ICT audit.');
      }
    } catch (err: any) {
      console.error('Audit submission error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleVendor = () => {
    setVendorName('CloudHost Banking SaaS Platform v3.0');
    setSystemSpec(`Vendor Infrastructure & Resilience Overview:
- Primary Hosting: AWS Frankfurt (eu-central-1) with synchronous replication to AWS Dublin (eu-west-1).
- Recovery Time Objective (RTO): 15 minutes; Recovery Point Objective (RPO): 5 seconds.
- Subcontracting & 4th-Party Vendors: Relies on Datadog for APM logging and Snowflake for analytical data warehouse.
- Failover Simulation Testing: Annual Chaos Engineering exercises conducted with simulated region outage.
- Incident Notification SLA: 2-hour notification commitment for critical severity ICT disruptions.`);
  };

  const exportCSV = () => {
    if (!result) return;
    let csvContent = 'DORA Article,Topic,Status,Risk Rating,Audit Findings,Recommendation\n';
    (result.items || []).forEach((item) => {
      csvContent += `"${item.article}","${item.topic}","${item.status}","${item.riskRating}","${(item.findings || '').replace(/"/g, '""')}","${(item.recommendation || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EU_DORA_Resilience_Audit.csv`);
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
              ⚠️ EU DORA &amp; NIS2 DISCLAIMER
            </span>
            <span>
              ContextSkeleton is an automated ICT resilience software audit tool. Results are technical pre-audits and do not replace official European Supervisory Authority (ESA) audit attestations under Regulation (EU) 2022/2554.
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Server className="h-3.5 w-3.5" /> EU DORA &amp; NIS2 ICT Auditor
            </div>
            <h1 className="text-3xl font-extrabold text-white">EU Financial Supply Chain Resilience Auditor</h1>
            <p className="text-slate-400 text-xs mt-1">Audit ICT vendor failover, database replication, and DORA Article 9 &amp; 28 concentration risk evidence.</p>
          </div>

          <button
            onClick={loadSampleVendor}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
          >
            <FileText className="h-4 w-4 text-indigo-400" />
            Load Sample ICT Vendor Spec
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  ICT Vendor / Subcontractor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. CloudHost Banking SaaS Platform"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Vendor Infrastructure &amp; Resilience Spec
                </label>
                <textarea
                  rows={10}
                  value={systemSpec}
                  onChange={(e) => setSystemSpec(e.target.value)}
                  placeholder="Paste multi-region failover architecture, RTO/RPO metrics, and 4th-party subcontractor policies..."
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
                disabled={loading || !systemSpec.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-indigo-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span className="truncate">{loadingProgressText}</span>
                  </>
                ) : (
                  <>
                    <Server className="h-4 w-4" />
                    Run DORA ICT Audit ($1,200 Tier)
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
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    DORA Resilience Audit Findings
                  </h2>

                  {result && (
                    <button
                      onClick={exportCSV}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-indigo-400" />
                      Export CSV Resilience Pack
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <Loader2 className="h-7 w-7 text-indigo-400 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-sm">DORA Technical Resilience Engine Running</h3>
                      <p className="text-slate-400 text-xs max-w-xs mx-auto animate-pulse">
                        {loadingProgressText}
                      </p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-6">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-2">
                      <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider block">DORA Article 9/28 Summary</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">{result.summary}</p>
                    </div>

                    <div className="space-y-4">
                      {(result.items || []).map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-900 text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">{item.article} ({item.topic})</span>
                            <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                              item.status === 'PASS' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-slate-300">{item.findings}</p>
                          {item.recommendation && (
                            <p className="text-indigo-300/80 text-[11px]"><strong>Recommendation:</strong> {item.recommendation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                    <Server className="h-10 w-10 text-slate-700 mb-3" />
                    <p className="text-xs">Paste ICT vendor infrastructure specs on the left to evaluate against Regulation (EU) 2022/2554.</p>
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
