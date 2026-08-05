'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Building, ShieldAlert, Download, FileSpreadsheet, Sparkles, Loader2, 
  CheckCircle2, FileText, ArrowRight, DollarSign, Briefcase
} from 'lucide-react';

export default function SoxAuditResolverPage() {
  const [companyName, setCompanyName] = useState('');
  const [auditStandard, setAuditStandard] = useState('SOX Section 404 & SSAE 18 SOC 1 Type II');
  const [controlManifest, setControlManifest] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    controlDeficiencyLevel: string;
    items: Array<{
      controlCategory: string;
      controlActivity: string;
      status: string;
      soxRationale: string;
      remediationAction: string;
    }>;
  } | null>(null);

  const handleResolve = async () => {
    if (!companyName.trim() || !controlManifest.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/sox-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          auditStandard,
          controlManifest,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to run financial controls audit.');
      }
    } catch (err) {
      console.error('SOX Audit Analysis Error:', err);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type: string) => {
    if (type === 'sox') {
      setCompanyName('Global FinCorp Enterprises Inc. (NASDAQ: GFCE)');
      setAuditStandard('SOX Section 404 Internal Control over Financial Reporting (ICFR)');
      setControlManifest(`SOX Control Audit Log:
1. Journal Entry Approvals (Control FIN-201): Manual manual journal entries exceeding $500,000 posted by Lead Accountant without secondary Controller sign-off in SAP ERP.
2. Segregation of Duties (SoD) (Control ITGC-104): 3 Senior Developers possess administrative write access to both production financial databases and code deployment repositories.
3. Financial Close Reconciliation (Control FIN-305): Bank account reconciliations for cash accounts completed 45 days after month-end close.`);
    } else if (type === 'soc1') {
      setCompanyName('PayCloud Merchant Processing Solutions');
      setAuditStandard('SSAE 18 SOC 1 Type II Service Organization Controls');
      setControlManifest(`SOC 1 Type II Audit Log:
1. Change Management (Control ITGC-302): Production database schema migration deployed without documented peer code review or Change Advisory Board (CAB) ticket.
2. User Access Deprovisioning (Control HR-102): Terminated employee credentials remained active in payroll system for 18 days post-termination.`);
    }
  };

  const exportCSV = () => {
    if (!result) return;
    let csvContent = 'Control Category,Control Activity,Status,SOX Rationale,Remediation Action\n';
    result.items.forEach((item) => {
      csvContent += `"${item.controlCategory}","${item.controlActivity}","${item.status}","${item.soxRationale.replace(/"/g, '""')}","${item.remediationAction.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SOX_404_Financial_Controls_Audit_${companyName.replace(/\s+/g, '_')}.csv`);
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
              ContextSkeleton is an automated software data processing service. Outputs do NOT constitute certified public accounting opinion, formal PCAOB audit representation, or official SEC 10-K SOX filings and do not replace licensed Certified Public Accountants (CPA) or Certified Information Systems Auditors (CISA).
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Briefcase className="h-3.5 w-3.5" /> Internal Audit &amp; Finance Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white">SOC 1 &amp; SOX 404 Financial Controls Auditor</h1>
            <p className="text-slate-400 text-xs mt-1">Audit financial close controls, Segregation of Duties (SoD), and ITGC changes against PCAOB and SSAE 18 rules.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => loadPreset('sox')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load SOX 404 Financial Preset
            </button>
            <button
              onClick={() => loadPreset('soc1')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load SSAE 18 SOC 1 ITGC Preset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 lg:col-span-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Building className="h-4 w-4 text-emerald-400" /> Financial Control Parameters
            </h2>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company / Enterprise Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Global FinCorp Enterprises"
                className="w-full glass-input rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Audit Framework</label>
              <select
                value={auditStandard}
                onChange={(e) => setAuditStandard(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
              >
                <option value="SOX Section 404 & SSAE 18 SOC 1 Type II">SOX Section 404 &amp; SSAE 18 SOC 1 Type II</option>
                <option value="PCAOB Auditing Standard AS 2201 (ICFR)">PCAOB AS 2201 ICFR Standards</option>
                <option value="COSO Internal Control Integrated Framework">COSO Integrated Control Framework</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Financial Controls &amp; ITGC Log</label>
              <textarea
                rows={10}
                value={controlManifest}
                onChange={(e) => setControlManifest(e.target.value)}
                placeholder="Paste journal entry logs, Segregation of Duties (SoD) matrix, ITGC change tickets, or bank reconciliation audits..."
                className="w-full glass-input rounded-xl p-3 text-xs text-white resize-none"
              />
            </div>

            <button
              onClick={handleResolve}
              disabled={loading || !companyName.trim() || !controlManifest.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Auditing Financial Controls &amp; ITGC Changes...
                </>
              ) : (
                <>
                  <Briefcase className="h-4 w-4" />
                  Run SOX 404 Controls Audit
                </>
              )}
            </button>
          </div>

          {/* Right Results Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-6 lg:col-span-2">
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" /> SOX 404 / SOC 1 Internal Control Audit Dossier
              </h2>

              {result && (
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Export CSV Financial Audit Report
                </button>
              )}
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Executive Financial Control Summary</span>
                    <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                      result.controlDeficiencyLevel === 'EFFECTIVE' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      Deficiency Level: {result.controlDeficiencyLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{result.summary}</p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">PCAOB / COSO Financial Controls Matrix</span>
                  
                  <div className="space-y-3">
                    {result.items.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{item.controlCategory}</span>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            item.status === 'EFFECTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-semibold">{item.controlActivity}</p>
                        <p className="text-xs text-slate-400">{item.soxRationale}</p>
                        <p className="text-[11px] text-emerald-300/90 font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-900">
                          Remediation Action: {item.remediationAction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                <Briefcase className="h-10 w-10 text-slate-700 mb-3" />
                <p className="text-xs">Fill out the financial control parameters on the left to evaluate journal entry approvals, SoD conflicts, and ITGC change controls.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
