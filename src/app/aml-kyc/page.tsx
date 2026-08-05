'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Building2, ShieldAlert, Download, FileSpreadsheet, Sparkles, Loader2, 
  CheckCircle2, FileText, ArrowRight, DollarSign, Shield
} from 'lucide-react';

export default function AmlKycResolverPage() {
  const [entityName, setEntityName] = useState('');
  const [amlFramework, setAmlFramework] = useState('FATF 40 Recommendations & US BSA');
  const [transactionData, setTransactionData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    riskRating: string;
    items: Array<{
      riskCategory: string;
      flaggedIndicator: string;
      status: string;
      amlRationale: string;
      complianceAction: string;
    }>;
  } | null>(null);

  const handleResolve = async () => {
    if (!entityName.trim() || !transactionData.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/aml-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityName,
          amlFramework,
          transactionData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to run AML risk analysis.');
      }
    } catch (err) {
      console.error('AML Analysis Error:', err);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type: string) => {
    if (type === 'crypto') {
      setEntityName('Nexus Digital Crypto Exchange & Custody LLC');
      setAmlFramework('FATF Guidance for Virtual Asset Service Providers (VASPs) & Travel Rule');
      setTransactionData(`Entity Onboarding: Account registered by BVI holding company "Apex Capital Holdings Ltd". Ultimate Beneficial Owner (UBO) listed as a non-resident PEP relative.
Transaction Flow: 14 outbound wire transfers totaling $480,000 to un-hosted crypto wallet addresses across 48 hours.
Mixing Services: 3 transactions interacted with mixing protocol smart contracts (Tornado Cash pool history).
Source of Wealth: Declared as "consulting advisory fees" without supporting invoice documentation.`);
    } else if (type === 'fintech') {
      setEntityName('Veritas Cross-Border Merchant Payments Inc.');
      setAmlFramework('US Bank Secrecy Act (BSA) & FinCEN Suspicious Activity Rules');
      setTransactionData(`Merchant Profile: E-commerce merchant selling high-value luxury goods.
Transaction Velocity: Rapid spike from average $12k/month to $840k/month over 10 days.
Structuring Pattern: 62 consecutive card transactions processed at exactly $9,950 (just below $10,000 currency transaction report threshold).
Geographic Exposure: IP address origin resolves to high-risk jurisdiction listed under FATF grey list monitoring.`);
    }
  };

  const exportCSV = () => {
    if (!result) return;
    let csvContent = 'Risk Category,Flagged Indicator,Status,AML Rationale,Compliance Action\n';
    result.items.forEach((item) => {
      csvContent += `"${item.riskCategory}","${item.flaggedIndicator}","${item.status}","${item.amlRationale.replace(/"/g, '""')}","${item.complianceAction.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AML_KYC_Compliance_Audit_${entityName.replace(/\s+/g, '_')}.csv`);
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
              ContextSkeleton is an automated software data processing service. Outputs do NOT constitute certified financial compliance advice or formal suspicious activity report (SAR) filings and do not replace licensed Anti-Money Laundering Officers (AMLO), Certified Anti-Money Laundering Specialists (CAMS), or official financial intelligence unit (FIU) disclosures.
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <DollarSign className="h-3.5 w-3.5" /> FinTech &amp; Banking Risk Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white">AML &amp; KYC Anti-Money Laundering Auditor</h1>
            <p className="text-slate-400 text-xs mt-1">Audit customer onboarding, PEP sanctions risk, and structuring patterns against FATF, FinCEN, and BSA rules.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => loadPreset('crypto')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load Crypto VASP Preset
            </button>
            <button
              onClick={() => loadPreset('fintech')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load Merchant Structuring Preset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 lg:col-span-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-yellow-400" /> AML Audit Parameters
            </h2>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Entity / Customer Name</label>
              <input
                type="text"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="e.g. Nexus Digital Crypto Exchange"
                className="w-full glass-input rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Regulatory Framework</label>
              <select
                value={amlFramework}
                onChange={(e) => setAmlFramework(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
              >
                <option value="FATF 40 Recommendations & US BSA">FATF 40 Recommendations &amp; US BSA</option>
                <option value="EU 6th Anti-Money Laundering Directive (6AMLD)">EU 6th Anti-Money Laundering Directive (6AMLD)</option>
                <option value="FATF Virtual Asset Service Provider (VASP) Guidelines">FATF VASP &amp; Travel Rule Guidelines</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Transaction &amp; KYC Manifest</label>
              <textarea
                rows={10}
                value={transactionData}
                onChange={(e) => setTransactionData(e.target.value)}
                placeholder="Paste transaction logs, UBO ownership structure, PEP screening records, or card processing velocity data..."
                className="w-full glass-input rounded-xl p-3 text-xs text-white resize-none"
              />
            </div>

            <button
              onClick={handleResolve}
              disabled={loading || !entityName.trim() || !transactionData.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-amber-500/10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Auditing Transaction Velocity &amp; Sanction Risks...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4" />
                  Run AML Statutory Audit
                </>
              )}
            </button>
          </div>

          {/* Right Results Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-6 lg:col-span-2">
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" /> Statutory AML Risk Audit Scorecard
              </h2>

              {result && (
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-yellow-400 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Export CSV AML Audit Report
                </button>
              )}
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest block">Executive AML Summary</span>
                    <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                      result.riskRating === 'LOW' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      Risk Score: {result.riskRating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{result.summary}</p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Suspicious Activity &amp; Structuring Checklist</span>
                  
                  <div className="space-y-3">
                    {result.items.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{item.riskCategory}</span>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            item.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-semibold">{item.flaggedIndicator}</p>
                        <p className="text-xs text-slate-400">{item.amlRationale}</p>
                        <p className="text-[11px] text-amber-300/90 font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-900">
                          Compliance Action: {item.complianceAction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                <DollarSign className="h-10 w-10 text-slate-700 mb-3" />
                <p className="text-xs">Fill out the AML audit parameters on the left to evaluate transaction velocity, structuring, and PEP sanction risk.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
