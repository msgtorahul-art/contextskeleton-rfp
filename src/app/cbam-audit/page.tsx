'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Leaf, Loader2, ShieldAlert } from 'lucide-react';

export default function CbamAuditPage() {
  const [goodsCategory, setGoodsCategory] = useState('Steel & Aluminum (EU CBAM)');
  const [shipmentData, setShipmentData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAudit = async () => {
    if (!shipmentData.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/cbam-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goodsCategory, shipmentData }),
      });
      setResult(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <Sidebar />
      <main className="pl-80 flex-1 p-10 min-h-screen">
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
          ⚠️ EU Carbon Border Adjustment Mechanism (CBAM) Customs Auditor under Regulation (EU) 2023/956.
        </div>

        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Leaf className="h-3.5 w-3.5" /> EU CBAM Customs Carbon Auditor
            </div>
            <h1 className="text-3xl font-extrabold text-white">EU Import Carbon Certificate Generator</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-5">
              <textarea
                rows={10}
                value={shipmentData}
                onChange={(e) => setShipmentData(e.target.value)}
                placeholder="Paste bill of lading, supplier invoices, steel tonnage, and smelter energy origin..."
                className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-200"
              />
              <button
                onClick={handleAudit}
                disabled={loading || !shipmentData.trim()}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs py-3.5 rounded-xl"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Run CBAM Carbon Audit ($2,000 Tier)'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-panel p-6 rounded-3xl min-h-[500px]">
              {result ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl">{result.summary}</p>
                  {result.items?.map((item: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-900 text-xs flex justify-between">
                      <span className="font-bold text-white">{item.parameter}: {item.value}</span>
                      <span className={item.status === 'COMPLIANT' ? 'text-emerald-400' : 'text-rose-400'}>{item.status}</span>
                    </div>
                  ))}
                </div>
              ) : <div className="text-center text-slate-500 py-20 text-xs">Paste bill of lading data to calculate CBAM carbon certificate values.</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
