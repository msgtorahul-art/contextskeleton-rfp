'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  ShieldCheck, Lock, Download, FileSpreadsheet, Sparkles, Loader2, 
  AlertTriangle, CheckCircle2, FileText, ArrowRight, ShieldAlert, KeyRound
} from 'lucide-react';

export default function PrivacyDpiaResolverPage() {
  const [systemName, setSystemName] = useState('');
  const [privacyStandard, setPrivacyStandard] = useState('EU GDPR Article 35 (DPIA) & HIPAA Security Rule');
  const [dataFlowSummary, setDataFlowSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    riskRating: string;
    items: Array<{
      privacyArea: string;
      requirement: string;
      status: string;
      dpoRationale: string;
      remediationAction: string;
    }>;
  } | null>(null);

  const handleResolve = async () => {
    if (!systemName.trim() || !dataFlowSummary.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/privacy-dpia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemName,
          privacyStandard,
          dataFlowSummary,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to run privacy impact assessment.');
      }
    } catch (err) {
      console.error('Privacy Analysis Error:', err);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type: string) => {
    if (type === 'saas') {
      setSystemName('OmniCloud Enterprise AI SaaS Platform');
      setPrivacyStandard('EU GDPR Article 35 (DPIA) & UK GDPR');
      setSupplyChainData(`Data Processing Manifest: User account registration collects Full Name, Work Email, Billing Address, and IP logs.
AI Processing: Customer prompt data passed to OpenAI API (US subprocessor) under Standard Contractual Clauses (SCCs). Zero training retention enabled.
Storage & Encryption: User PII stored in AWS us-east-1 RDS PostgreSQL with AES-256 encryption-at-rest and TLS 1.3 in-transit.
Subprocessors: Stripe (Payment Processing), AWS (Cloud Infrastructure), OpenAI (LLM Processing).
DSAR Rights: Self-service account data export and deletion endpoint implemented.`);
    } else if (type === 'healthcare') {
      setSystemName('PulseHealth Telehealth & Electronic Health Record (EHR) Portal');
      setPrivacyStandard('HIPAA Security Rule (§ 164.308) & EU GDPR Article 9 (Special Category Data)');
      setSupplyChainData(`Data Processing Manifest: Processes Protected Health Information (PHI) including patient diagnostic ICD-10 codes, lab records, and video consultation logs.
Subprocessor DPAs: Business Associate Agreements (BAAs) executed with Twilio (Video), AWS HealthLake (PHI storage), and Datadog (Logs).
Security Controls: Role-Based Access Control (RBAC) with mandatory Hardware MFA for all clinical staff. Audit logging tracks every PHI read/write event.
Cross-Border Transfer: No EU patient data transferred outside EU EEA boundaries.`);
    }
  };

  // Quick helper for setting data flow string
  const setSupplyChainData = (val: string) => setDataFlowSummary(val);

  const exportCSV = () => {
    if (!result) return;
    let csvContent = 'Privacy Area,Requirement,Status,DPO Rationale,Remediation Action\n';
    result.items.forEach((item) => {
      csvContent += `"${item.privacyArea}","${item.requirement}","${item.status}","${item.dpoRationale.replace(/"/g, '""')}","${item.remediationAction.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GDPR_HIPAA_Privacy_DPIA_${systemName.replace(/\s+/g, '_')}.csv`);
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
              ContextSkeleton is an automated software data processing service. Outputs do NOT constitute formal legal advice, certified Data Protection Officer (DPO) representation, or official regulatory agency filings and do not replace qualified privacy attorneys or certified CIPP/E data protection professionals.
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <KeyRound className="h-3.5 w-3.5" /> Privacy &amp; Regulatory DPO Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white">GDPR &amp; HIPAA Data Privacy Impact Assessment (DPIA)</h1>
            <p className="text-slate-400 text-xs mt-1">Audit cross-border data flows, subprocessor DPAs, and PII/PHI encryption against EU GDPR Article 35 and HIPAA Security Rules.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => loadPreset('saas')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load AI SaaS DPIA Preset
            </button>
            <button
              onClick={() => loadPreset('healthcare')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load Telehealth HIPAA Preset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 lg:col-span-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Lock className="h-4 w-4 text-indigo-400" /> System Architecture &amp; Data Flow Inputs
            </h2>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">System / Product Name</label>
              <input
                type="text"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                placeholder="e.g. OmniCloud SaaS Platform"
                className="w-full glass-input rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Privacy Standard</label>
              <select
                value={privacyStandard}
                onChange={(e) => setPrivacyStandard(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
              >
                <option value="EU GDPR Article 35 (DPIA) & UK GDPR">EU GDPR Article 35 (DPIA) &amp; UK GDPR</option>
                <option value="HIPAA Security Rule (§ 164.308 Administrative Safeguards)">HIPAA Security Rule (§ 164.308 Safeguards)</option>
                <option value="California CCPA / CPRA & US Privacy Laws">California CCPA / CPRA &amp; US Privacy Laws</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Data Flow, Subprocessors &amp; PII/PHI Scope</label>
              <textarea
                rows={10}
                value={dataFlowSummary}
                onChange={(e) => setDataFlowSummary(e.target.value)}
                placeholder="Paste PII data categories, subprocessor list, database encryption specs, or cross-border transfer details..."
                className="w-full glass-input rounded-xl p-3 text-xs text-white resize-none"
              />
            </div>

            <button
              onClick={handleResolve}
              disabled={loading || !systemName.trim() || !dataFlowSummary.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-indigo-500/10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Auditing Data Flow against GDPR Article 35 &amp; HIPAA...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Run Privacy DPIA Audit
                </>
              )}
            </button>
          </div>

          {/* Right Results Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-6 lg:col-span-2">
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" /> Data Protection Impact Audit Dossier
              </h2>

              {result && (
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-400 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Export CSV Privacy Audit Report
                </button>
              )}
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">DPIA Executive Privacy Summary</span>
                    <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                      result.riskRating === 'LOW' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      Risk Rating: {result.riskRating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{result.summary}</p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">GDPR &amp; HIPAA Compliance Audit Matrix</span>
                  
                  <div className="space-y-3">
                    {result.items.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{item.privacyArea}</span>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            item.status === 'COMPLIANT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-semibold">{item.requirement}</p>
                        <p className="text-xs text-slate-400">{item.dpoRationale}</p>
                        <p className="text-[11px] text-indigo-300/90 font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-900">
                          Remediation Action: {item.remediationAction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                <Lock className="h-10 w-10 text-slate-700 mb-3" />
                <p className="text-xs">Fill out the system architecture inputs on the left to evaluate PII/PHI data flows against GDPR Article 35 &amp; HIPAA rules.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
