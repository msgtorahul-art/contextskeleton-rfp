'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Leaf, FileText, Loader2, FileSpreadsheet, Sparkles, ShieldAlert
} from 'lucide-react';

export default function CbamAuditPage() {
  const [goodsCategory, setGoodsCategory] = useState('Steel & Aluminum (EU CBAM)');
  const [shipmentData, setShipmentData] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgressText, setLoadingProgressText] = useState('Calculating Embedded Carbon under Regulation (EU) 2023/956...');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    summary: string;
    items: Array<{
      parameter: string;
      value: string;
      status: string;
      recommendation: string;
    }>;
  } | null>(null);

  useEffect(() => {
    let t1: NodeJS.Timeout, t2: NodeJS.Timeout;
    if (loading) {
      setLoadingProgressText('Calculating Embedded Carbon under Regulation (EU) 2023/956...');
      t1 = setTimeout(() => setLoadingProgressText('Applying EU CBAM precursor emission factors...'), 12000);
      t2 = setTimeout(() => setLoadingProgressText('Formatting customs carbon declaration certificate skeleton...'), 35000);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loading]);

  const handleAudit = async () => {
    if (!shipmentData.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/cbam-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goodsCategory, shipmentData }),
      });

      const rawText = await res.text();
      let data: any = {};
      try { data = JSON.parse(rawText); } catch (e) {}

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to calculate CBAM carbon certificates.');
      }
    } catch (err: any) {
      console.error('Audit submission error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleShipment = () => {
    setGoodsCategory('Hot-Rolled Structural Steel Coil (CN Code 7208)');
    setShipmentData(`Shipment Details:
- Commodity: 450 Metric Tons Hot-Rolled Carbon Steel Coils.
- Country of Origin: India (Jamshedpur Smelter Complex).
- Energy Source: Integrated Coal-Fired Blast Furnace (BF-BOF Route).
- Direct Facility Emissions Report: 2.15 tCO2e per metric ton crude steel.
- Bill of Lading #: BL-2026-IN-EU-9482.
- Destination Customs Port: Rotterdam Port, Netherlands.`);
  };

  const exportCSV = () => {
    if (!result) return;
    let csvContent = 'Customs Parameter,Calculated Value,Status,Customs Recommendation\n';
    (result.items || []).forEach((item) => {
      csvContent += `"${item.parameter}","${item.value}","${item.status}","${(item.recommendation || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EU_CBAM_Carbon_Certificate.csv`);
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
              ⚠️ EU CUSTOMS DISCLAIMER
            </span>
            <span>
              ContextSkeleton is an automated carbon accounting tool under Regulation (EU) 2023/956. Certificates are calculation skeletons and must be verified by an accredited CBAM verifier prior to EU customs submission.
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Leaf className="h-3.5 w-3.5" /> EU CBAM Customs Carbon Auditor
            </div>
            <h1 className="text-3xl font-extrabold text-white">EU Import Carbon Certificate Generator</h1>
            <p className="text-slate-400 text-xs mt-1">Calculate embedded emissions &amp; certificate obligations for steel, aluminum, fertilizers, and electronics.</p>
          </div>

          <button
            onClick={loadSampleShipment}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
          >
            <FileText className="h-4 w-4 text-emerald-400" />
            Load Sample Steel Import Invoices
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Goods &amp; CN Code Category
                </label>
                <select
                  value={goodsCategory}
                  onChange={(e) => setGoodsCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Steel & Aluminum (EU CBAM)">Steel &amp; Aluminum Imports (CN Code 72/76)</option>
                  <option value="Fertilizers & Chemicals">Fertilizers &amp; Ammonia (CN Code 31)</option>
                  <option value="Hydrogen & Energy Carriers">Hydrogen &amp; Clean Energy Carriers</option>
                  <option value="Electronics & Components">Industrial Electronics &amp; Solar Panels</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Shipment Invoices &amp; Bill of Lading Data
                </label>
                <textarea
                  rows={10}
                  value={shipmentData}
                  onChange={(e) => setShipmentData(e.target.value)}
                  placeholder="Paste bill of lading, tonnage, smelter energy origin, and direct facility emission reports..."
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
                disabled={loading || !shipmentData.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span className="truncate">{loadingProgressText}</span>
                  </>
                ) : (
                  <>
                    <Leaf className="h-4 w-4" />
                    Run CBAM Carbon Audit ($2,000 Tier)
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
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    CBAM Customs Certificate Findings
                  </h2>

                  {result && (
                    <button
                      onClick={exportCSV}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                      Export CSV Carbon Certificate
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Loader2 className="h-7 w-7 text-emerald-400 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-sm">EU CBAM Carbon Audit Engine Running</h3>
                      <p className="text-slate-400 text-xs max-w-xs mx-auto animate-pulse">
                        {loadingProgressText}
                      </p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-6">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-2">
                      <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">Customs Carbon Declaration Summary</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">{result.summary}</p>
                    </div>

                    <div className="space-y-4">
                      {(result.items || []).map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-900 text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">{item.parameter}</span>
                            <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                              item.status === 'COMPLIANT' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-slate-300 font-mono">Calculated: {item.value}</p>
                          {item.recommendation && (
                            <p className="text-emerald-300/80 text-[11px]"><strong>Recommendation:</strong> {item.recommendation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                    <Leaf className="h-10 w-10 text-slate-700 mb-3" />
                    <p className="text-xs">Paste bill of lading and shipment invoices on the left to calculate embedded carbon under Regulation (EU) 2023/956.</p>
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
