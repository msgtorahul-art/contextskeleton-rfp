'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Building2, Loader2 } from 'lucide-react';

export default function CreLeasePage() {
  const [propertyAddress, setPropertyAddress] = useState('');
  const [leaseText, setLeaseText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAudit = async () => {
    if (!leaseText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/cre-lease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyAddress, leaseText }),
      });
      setResult(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <Sidebar />
      <main className="pl-80 flex-1 p-10 min-h-screen">
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Building2 className="h-3.5 w-3.5" /> CRE Lease Abstractor Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white">Commercial Real Estate Lease Due Diligence</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-5">
              <input
                type="text"
                placeholder="Property Address / Tenant Name"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white"
              />
              <textarea
                rows={10}
                value={leaseText}
                onChange={(e) => setLeaseText(e.target.value)}
                placeholder="Paste commercial lease agreement text, CAM operating expense clauses, and rent escalation schedules..."
                className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-200"
              />
              <button
                onClick={handleAudit}
                disabled={loading || !leaseText.trim()}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs py-3.5 rounded-xl"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Abstract CRE Lease ($1,500 Tier)'}
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
                      <span className="font-bold text-white block">{item.clause}</span>
                      <p className="text-slate-400">{item.details}</p>
                    </div>
                  ))}
                </div>
              ) : <div className="text-center text-slate-500 py-20 text-xs">Paste commercial lease text to extract rent rolls, CAM caps, and co-tenancy rules.</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
