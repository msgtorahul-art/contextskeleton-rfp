'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Globe, Leaf, Download, FileSpreadsheet, Sparkles, Loader2, 
  AlertTriangle, CheckCircle2, FileText, ArrowRight, ShieldAlert, Cpu
} from 'lucide-react';

export default function EsgClimateResolverPage() {
  const [companyName, setCompanyName] = useState('');
  const [esgStandard, setEsgStandard] = useState('EU CSRD (Corporate Sustainability Reporting Directive)');
  const [supplyChainData, setSupplyChainData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    scopeBreakdown: string;
    items: Array<{
      scopeCategory: string;
      metric: string;
      status: string;
      riskRating: string;
      esgRationale: string;
      decarbonizationAction: string;
    }>;
  } | null>(null);

  const handleResolve = async () => {
    if (!companyName.trim() || !supplyChainData.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/esg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          esgStandard,
          supplyChainData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to run ESG climate audit.');
      }
    } catch (err) {
      console.error('ESG Climate Analysis Error:', err);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type: string) => {
    if (type === 'logistics') {
      setCompanyName('Pacific Global Freight & Logistics Inc.');
      setEsgStandard('EU CSRD (Corporate Sustainability Reporting Directive)');
      setSupplyChainData(`Fleet Logistics Data: 45 heavy diesel trucks covering 2.4 million km annually. Fuel consumption: 720,000 liters diesel.
Warehousing Scope 2: 1,800,000 kWh electricity from grid (grid emission factor: 0.42 kg CO2e/kWh).
Scope 3 Upstream Procurement: 12 sub-contracted ocean freight partners without verified ISO 14064 carbon certifications.`);
    } else if (type === 'realestate') {
      setCompanyName('AeroTech Commercial Real Estate & Data Centers');
      setEsgStandard('ISSB IFRS S2 Climate Disclosures');
      setSupplyChainData(`Facility Footprint: 5 commercial office towers and 2 data center facilities.
Scope 2 Electricity: 14.2 GWh annual electricity. HVAC refrigerant leakage: R-410A refrigerant loss recorded at 12 kg/year.
Scope 3 Tenant Business Travel: Commercial flights totaling 850,000 passenger-kilometers.`);
    }
  };

  const exportCSV = () => {
    if (!result) return;
    let csvContent = 'Scope Category,Metric,Status,Risk Rating,ESG Rationale,Decarbonization Action\n';
    result.items.forEach((item) => {
      csvContent += `"${item.scopeCategory}","${item.metric}","${item.status}","${item.riskRating}","${item.esgRationale.replace(/"/g, '""')}","${item.decarbonizationAction.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ESG_CSRD_Climate_Audit_${companyName.replace(/\s+/g, '_')}.csv`);
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
              ContextSkeleton is an automated software data processing service. Outputs do NOT constitute certified environmental auditing, carbon accounting certification, or formal legal compliance advice and do not replace certified sustainability auditors or official regulatory agency disclosures.
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Leaf className="h-3.5 w-3.5" /> ESG &amp; Climate Sustainability Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white">ESG &amp; CSRD Climate Disclosure Auditor</h1>
            <p className="text-slate-400 text-xs mt-1">Audit Scope 1, 2, &amp; 3 supply chain carbon footprints for EU CSRD, ISSB, and GRI reporting.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => loadPreset('logistics')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load Logistics &amp; Freight Preset
            </button>
            <button
              onClick={() => loadPreset('realestate')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load Real Estate &amp; Data Center Preset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 lg:col-span-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-emerald-400" /> Climate Disclosure Parameters
            </h2>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company / Enterprise Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Pacific Global Logistics"
                className="w-full glass-input rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Reporting Framework</label>
              <select
                value={esgStandard}
                onChange={(e) => setEsgStandard(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
              >
                <option value="EU CSRD (Corporate Sustainability Reporting Directive)">EU CSRD (Corporate Sustainability Reporting Directive)</option>
                <option value="ISSB IFRS S2 Climate Disclosures">ISSB IFRS S2 Climate Disclosures</option>
                <option value="GRI Sustainability Reporting Standards">GRI Sustainability Reporting Standards</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Supply Chain, Fleet &amp; Energy Data</label>
              <textarea
                rows={10}
                value={supplyChainData}
                onChange={(e) => setSupplyChainData(e.target.value)}
                placeholder="Paste fuel consumption metrics, electricity kWh data, supplier logistics manifests, or travel logs..."
                className="w-full glass-input rounded-xl p-3 text-xs text-white resize-none"
              />
            </div>

            <button
              onClick={handleResolve}
              disabled={loading || !companyName.trim() || !supplyChainData.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Auditing Scope 1, 2, &amp; 3 Greenhouse Gas Footprint...
                </>
              ) : (
                <>
                  <Leaf className="h-4 w-4" />
                  Run CSRD Climate Audit
                </>
              )}
            </button>
          </div>

          {/* Right Results Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-6 lg:col-span-2">
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" /> Climate Disclosure &amp; Scope 1-3 Scorecard
              </h2>

              {result && (
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Export CSV Climate Spreadsheet
                </button>
              )}
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Executive Climate Summary</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{result.summary}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Scope 1, Scope 2, &amp; Scope 3 Footprint Breakdown</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{result.scopeBreakdown}</p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CSRD &amp; ISSB Compliance Checklist</span>
                  
                  <div className="space-y-3">
                    {result.items.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{item.scopeCategory} — {item.metric}</span>
                          <div className="flex gap-2">
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              item.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {item.status}
                            </span>
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                              Risk: {item.riskRating}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400">{item.esgRationale}</p>
                        <p className="text-[11px] text-emerald-300/90 font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-900">
                          Decarbonization Action: {item.decarbonizationAction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                <Leaf className="h-10 w-10 text-slate-700 mb-3" />
                <p className="text-xs">Fill out the climate disclosure parameters on the left to generate Scope 1, 2, &amp; 3 ESG carbon audit reports.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
