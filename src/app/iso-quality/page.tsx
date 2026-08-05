'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  CheckSquare, ShieldAlert, Download, FileSpreadsheet, Sparkles, Loader2, 
  CheckCircle2, FileText, ArrowRight, Settings, Sliders
} from 'lucide-react';

export default function IsoQualityResolverPage() {
  const [plantName, setPlantName] = useState('');
  const [qualityStandard, setQualityStandard] = useState('AS9100D Aerospace & ISO 9001:2015');
  const [auditData, setAuditData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    auditRating: string;
    items: Array<{
      clauseSection: string;
      nonConformance: string;
      status: string;
      isoRationale: string;
      capaAction: string;
    }>;
  } | null>(null);

  const handleResolve = async () => {
    if (!plantName.trim() || !auditData.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/iso-quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantName,
          qualityStandard,
          auditData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to run quality system audit.');
      }
    } catch (err) {
      console.error('ISO Quality Analysis Error:', err);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type: string) => {
    if (type === 'aerospace') {
      setPlantName('Apex Precision Aerospace Machining Plant #2');
      setQualityStandard('AS9100D Aerospace & Defense Quality System');
      setAuditData(`Audit Inspection & CAPA Log:
1. Clause 8.5.2 First Article Inspection (FAI): 12 CNC machined turbine blade components shipped to Boeing without verified AS9102 FAI report documentation attached.
2. Clause 7.1.5 Measurement Traceability: Torque wrench #TW-804 used on assembly line was past its 12-month calibration expiration date by 14 days.
3. Clause 8.7 Non-Conforming Material: 4 defectively anodized aluminum wing brackets found unlabelled in standard inventory racks without red containment tag.`);
    } else if (type === 'automotive') {
      setPlantName('Vanguard Automotive Components Manufacturing');
      setQualityStandard('IATF 16949 / ISO 9001:2015 Automotive Quality System');
      setAuditData(`Audit Inspection & CAPA Log:
1. Clause 10.2 Root Cause Analysis: Recurring dimension variance in brake rotor casting resolved via operator training without updating the Control Plan or Failure Mode and Effects Analysis (FMEA).
2. Clause 8.4 Supplier Evaluation: Tier-2 raw steel supplier delivered coil stock with unverified mill test certificates.`);
    }
  };

  const exportCSV = () => {
    if (!result) return;
    let csvContent = 'Clause Section,Non-Conformance,Status,ISO Rationale,CAPA Action\n';
    result.items.forEach((item) => {
      csvContent += `"${item.clauseSection}","${item.nonConformance}","${item.status}","${item.isoRationale.replace(/"/g, '""')}","${item.capaAction.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ISO_AS9100_Quality_Audit_${plantName.replace(/\s+/g, '_')}.csv`);
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
              ContextSkeleton is an automated software data processing service. Outputs do NOT constitute certified ISO lead auditor representation, formal AS9100 aerospace certification, or official registrar compliance audits and do not replace licensed Quality Assurance (QA) directors or certified Lead Auditors.
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <CheckSquare className="h-3.5 w-3.5" /> Aerospace &amp; ISO Quality Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white">ISO 9001 &amp; AS9100 Quality System Auditor</h1>
            <p className="text-slate-400 text-xs mt-1">Audit non-conformances, CAPA root causes, and FAI reports against ISO 9001:2015 and AS9100D aerospace standards.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => loadPreset('aerospace')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load AS9100D Aerospace Preset
            </button>
            <button
              onClick={() => loadPreset('automotive')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load Automotive IATF Preset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 lg:col-span-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Sliders className="h-4 w-4 text-blue-400" /> Quality Audit Parameters
            </h2>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Facility / Plant Name</label>
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="e.g. Apex Precision Aerospace"
                className="w-full glass-input rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Quality Standard</label>
              <select
                value={qualityStandard}
                onChange={(e) => setQualityStandard(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
              >
                <option value="AS9100D Aerospace & ISO 9001:2015">AS9100D Aerospace &amp; ISO 9001:2015</option>
                <option value="ISO 9001:2015 Quality Management">ISO 9001:2015 Quality Management</option>
                <option value="IATF 16949 Automotive Quality Management">IATF 16949 Automotive Quality</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Audit Log, NCRs &amp; CAPA Data</label>
              <textarea
                rows={10}
                value={auditData}
                onChange={(e) => setAuditData(e.target.value)}
                placeholder="Paste non-conformance reports, first article inspection notes, calibration logs, or corrective action plans..."
                className="w-full glass-input rounded-xl p-3 text-xs text-white resize-none"
              />
            </div>

            <button
              onClick={handleResolve}
              disabled={loading || !plantName.trim() || !auditData.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-blue-500/10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Auditing Quality System &amp; CAPA Root Causes...
                </>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4" />
                  Run ISO Quality System Audit
                </>
              )}
            </button>
          </div>

          {/* Right Results Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-6 lg:col-span-2">
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" /> ISO / AS9100 Quality Audit Dossier
              </h2>

              {result && (
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-blue-400 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Export CSV Quality Report
                </button>
              )}
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Executive Quality Summary</span>
                    <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                      result.auditRating === 'PASS_CONFORMANT' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      Audit Rating: {result.auditRating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{result.summary}</p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">ISO 9001 / AS9100 Clause Non-Conformance Matrix</span>
                  
                  <div className="space-y-3">
                    {result.items.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{item.clauseSection}</span>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            item.status === 'CONFORMANT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-semibold">{item.nonConformance}</p>
                        <p className="text-xs text-slate-400">{item.isoRationale}</p>
                        <p className="text-[11px] text-blue-300/90 font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-900">
                          CAPA Action: {item.capaAction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                <CheckSquare className="h-10 w-10 text-slate-700 mb-3" />
                <p className="text-xs">Fill out the quality parameters on the left to evaluate non-conformance reports and CAPA root causes against AS9100D and ISO 9001 rules.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
