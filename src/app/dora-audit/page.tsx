'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { ShieldCheck, FileText, Loader2, Sparkles, Server, ShieldAlert } from 'lucide-react';

export default function DoraAuditPage() {
  const [vendorName, setVendorName] = useState('');
  const [systemSpec, setSystemSpec] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAudit = async () => {
    if (!systemSpec.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/dora-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorName, systemSpec }),
      });
      setResult(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <Sidebar />
      <main className="pl-80 flex-1 p-10 min-h-screen">
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <span>EU DORA &amp; NIS2 Technical Compliance Engine. Automated audit tools do not replace formal EU supervisory authority attestations.</span>
        </div>

        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Server className="h-3.5 w-3.5" /> EU DORA &amp; NIS2 ICT Auditor
            </div>
            <h1 className="text-3xl font-extrabold text-white">EU Financial Supply Chain Resilience Auditor</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-5">
              <input
                type="text"
                placeholder="ICT Vendor Name (e.g. CloudHost SaaS)"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white"
              />
              <textarea
                rows={10}
                value={systemSpec}
                onChange={(e) => setSystemSpec(e.target.value)}
                placeholder="Paste vendor failover testing, database replication logs, and incident handling policies..."
                className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-200"
              />
              <button
                onClick={handleAudit}
                disabled={loading || !systemSpec.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs py-3.5 rounded-xl"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Run DORA Audit ($1,200 Tier)'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-panel p-6 rounded-3xl min-h-[500px]">
              {result ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl">{result.summary}</p>
                  {result.items?.map((item: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-900 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-white">
                        <span>{item.article}</span>
                        <span className={item.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}>{item.status}</span>
                      </div>
                      <p className="text-slate-400">{item.findings}</p>
                    </div>
                  ))}
                </div>
              ) : <div className="text-center text-slate-500 py-20 text-xs">Paste ICT vendor infrastructure specs to evaluate against DORA Articles 9 &amp; 28.</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
