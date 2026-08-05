'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  HardHat, ShieldAlert, Download, FileSpreadsheet, Sparkles, Loader2, 
  CheckCircle2, FileText, ArrowRight, AlertTriangle, ShieldCheck
} from 'lucide-react';

export default function EhsSafetyResolverPage() {
  const [facilityName, setFacilityName] = useState('');
  const [safetyStandard, setSafetyStandard] = useState('OSHA 1910 General Industry & ISO 45001');
  const [incidentData, setIncidentData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    hazardRating: string;
    items: Array<{
      safetyCategory: string;
      hazardObserved: string;
      status: string;
      oshaRationale: string;
      correctiveAction: string;
    }>;
  } | null>(null);

  const handleResolve = async () => {
    if (!facilityName.trim() || !incidentData.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ehs-safety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facilityName,
          safetyStandard,
          incidentData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to run EHS safety audit.');
      }
    } catch (err) {
      console.error('EHS Analysis Error:', err);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type: string) => {
    if (type === 'manufacturing') {
      setFacilityName('Titan Heavy Equipment Assembly Plant #4');
      setSafetyStandard('OSHA 1910 General Industry & ISO 45001');
      setIncidentData(`Workplace Inspection Notes:
1. Lockout/Tagout (LOTO): 3 stamping press machines serviced without energy isolating device padlocks applied.
2. Machine Guarding: Hydraulic press missing interlocked safety light curtain barrier.
3. Hazard Communication (GHS): Trichloroethylene solvent barrels stored without GHS hazard warning pictograms or updated MSDS safety sheets accessible within 50 feet.
4. PPE Audit: Noise exposure in stamping area measured at 94 dBA TWA. Hearing protection mandatory sign missing.`);
    } else if (type === 'construction') {
      setFacilityName('Metropolitan High-Rise Construction Site B');
      setSafetyStandard('OSHA 1926 Construction Safety Standards');
      setIncidentData(`Site Audit Notes:
1. Fall Protection: Unprotected edge on 6th floor deck without guardrail system, safety net, or personal fall arrest system (PFAS) anchored.
2. Scaffolding: Tubular welded frame scaffold missing mudsills and base plates under leg supports.
3. Electrical Safety: Temporary power distribution box operating without Ground Fault Circuit Interrupters (GFCI).`);
    }
  };

  const exportCSV = () => {
    if (!result) return;
    let csvContent = 'Safety Category,Hazard Observed,Status,OSHA Rationale,Corrective Action\n';
    result.items.forEach((item) => {
      csvContent += `"${item.safetyCategory}","${item.hazardObserved}","${item.status}","${item.oshaRationale.replace(/"/g, '""')}","${item.correctiveAction.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `OSHA_EHS_Safety_Audit_${facilityName.replace(/\s+/g, '_')}.csv`);
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
              ContextSkeleton is an automated software data processing service. Outputs do NOT constitute certified industrial hygiene advice, structural safety engineering certification, or formal OSHA compliance filings and do not replace licensed Environmental Health & Safety (EHS) managers or certified safety professionals (CSP).
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <HardHat className="h-3.5 w-3.5" /> EHS &amp; Workplace Safety Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white">OSHA &amp; EHS Workplace Safety Regulatory Auditor</h1>
            <p className="text-slate-400 text-xs mt-1">Audit factory floor hazards, LOTO protocols, and MSDS chemical sheets against OSHA 1910 and ISO 45001 rules.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => loadPreset('manufacturing')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load Manufacturing LOTO Preset
            </button>
            <button
              onClick={() => loadPreset('construction')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load Construction Fall Protection Preset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 lg:col-span-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <HardHat className="h-4 w-4 text-orange-400" /> Facility &amp; Hazard Inspection Inputs
            </h2>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Facility / Site Name</label>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="e.g. Titan Equipment Assembly Plant"
                className="w-full glass-input rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Workplace Safety Standard</label>
              <select
                value={safetyStandard}
                onChange={(e) => setSafetyStandard(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
              >
                <option value="OSHA 1910 General Industry & ISO 45001">OSHA 1910 General Industry &amp; ISO 45001</option>
                <option value="OSHA 1926 Construction Safety Standards">OSHA 1926 Construction Safety Standards</option>
                <option value="ISO 45001 Occupational Health and Safety">ISO 45001 Occupational Health and Safety</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hazard Observations &amp; Inspection Logs</label>
              <textarea
                rows={10}
                value={incidentData}
                onChange={(e) => setIncidentData(e.target.value)}
                placeholder="Paste site inspection notes, machinery LOTO logs, chemical MSDS sheets, or PPE noise level audits..."
                className="w-full glass-input rounded-xl p-3 text-xs text-white resize-none"
              />
            </div>

            <button
              onClick={handleResolve}
              disabled={loading || !facilityName.trim() || !incidentData.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-orange-500/10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Auditing Workplace Hazards against OSHA Rules...
                </>
              ) : (
                <>
                  <HardHat className="h-4 w-4" />
                  Run OSHA Safety Audit
                </>
              )}
            </button>
          </div>

          {/* Right Results Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-6 lg:col-span-2">
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" /> OSHA &amp; EHS Regulatory Audit Scorecard
              </h2>

              {result && (
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-orange-400 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Export CSV Safety Audit Report
                </button>
              )}
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">Executive EHS Safety Summary</span>
                    <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                      result.hazardRating === 'LOW' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      Hazard Level: {result.hazardRating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{result.summary}</p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">OSHA 1910 / 1926 Regulatory Compliance Checklist</span>
                  
                  <div className="space-y-3">
                    {result.items.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{item.safetyCategory}</span>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            item.status === 'COMPLIANT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-semibold">{item.hazardObserved}</p>
                        <p className="text-xs text-slate-400">{item.oshaRationale}</p>
                        <p className="text-[11px] text-orange-300/90 font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-900">
                          Corrective Action: {item.correctiveAction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                <HardHat className="h-10 w-10 text-slate-700 mb-3" />
                <p className="text-xs">Fill out the facility safety parameters on the left to evaluate Lockout/Tagout, Machine Guarding, and OSHA 1910 hazards.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
