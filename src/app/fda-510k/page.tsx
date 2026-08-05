'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  ShieldCheck, Activity, Download, FileSpreadsheet, Sparkles, Loader2, 
  AlertTriangle, CheckCircle2, FileText, ArrowRight, ShieldAlert, Cpu
} from 'lucide-react';

export default function Fda510kResolverPage() {
  const [deviceName, setDeviceName] = useState('');
  const [deviceClass, setDeviceClass] = useState('Class II (510k Required)');
  const [predicateDevice, setPredicateDevice] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    summary: string;
    predicateComparison: string;
    items: Array<{
      clause: string;
      topic: string;
      status: string;
      riskRating: string;
      regulatoryRationale: string;
      recommendedRemediation: string;
    }>;
  } | null>(null);

  const handleResolve = async () => {
    if (!deviceName.trim() || !specifications.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/fda-510k', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceName,
          deviceClass,
          predicateDevice,
          specifications,
        }),
      });

      const rawText = await res.text();
      let data: any = {};
      try { data = JSON.parse(rawText); } catch (e) {}

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to run FDA 510(k) analysis.');
      }
    } catch (err: any) {
      console.error('FDA 510k Analysis Error:', err);
      setError(err.message || 'An unexpected error occurred during FDA 510(k) analysis.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type: string) => {
    if (type === 'samd') {
      setDeviceName('AI CardioScan SaMD (Software as a Medical Device)');
      setDeviceClass('Class II (510k Required)');
      setPredicateDevice('K210452 - MedECG AI Diagnostic Assistant');
      setSpecifications(`Intended Use: Real-time electrocardiogram (ECG) rhythm analysis software using deep convolutional neural networks.
Software Architecture: Cloud-hosted inference engine on AWS GovCloud.
Safety Controls: IEC 62304 Software Lifecycle Process compliant, ISO 14971 Risk Management hazard analysis conducted. Cybersecurity controls match FDA 2023 Premarket Cybersecurity Guidance.`);
    } else if (type === 'implant') {
      setDeviceName('Titanium Spinal Fixation System');
      setDeviceClass('Class II (510k Required)');
      setPredicateDevice('K183204 - DePuy Synthes Spinal System');
      setSpecifications(`Intended Use: Pedicle screw spinal fixation system for lumbar fusion.
Materials: Ti-6Al-4V ELI Alloy per ASTM F136.
Biocompatibility: ISO 10993 cytotoxicity, sensitization, and systemic toxicity testing passed.
Mechanical Testing: ASTM F1717 static compression, tension, and fatigue testing.`);
    }
  };

  const exportCSV = () => {
    if (!result) return;
    let csvContent = 'Clause/Standard,Topic,Status,Risk Rating,Regulatory Rationale,Recommended Remediation\n';
    result.items.forEach((item) => {
      csvContent += `"${item.clause}","${item.topic}","${item.status}","${item.riskRating}","${item.regulatoryRationale.replace(/"/g, '""')}","${item.recommendedRemediation.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FDA_510k_Audit_${deviceName.replace(/\s+/g, '_')}.csv`);
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
              ContextSkeleton is an automated software data processing service. Outputs do NOT constitute legal, medical, regulatory, or certified engineering advice and do not replace licensed Regulatory Affairs Professionals (RAC), internal CISOs, or official government agency filings.
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Activity className="h-3.5 w-3.5" /> MedTech Regulatory Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white">FDA 510(k) &amp; ISO 13485 Regulatory Resolver</h1>
            <p className="text-slate-400 text-xs mt-1">Automate predicate device substantial equivalence, 21 CFR Part 820 quality controls, and ISO 14971 hazard analysis.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => loadPreset('samd')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load SaMD Preset
            </button>
            <button
              onClick={() => loadPreset('implant')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load Implant Preset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 lg:col-span-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Cpu className="h-4 w-4 text-rose-400" /> Medical Device Submission Parameters
            </h2>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subject Device Name</label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="e.g. AI CardioScan SaMD"
                className="w-full glass-input rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Classification</label>
                <select
                  value={deviceClass}
                  onChange={(e) => setDeviceClass(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                >
                  <option value="Class II (510k Required)">Class II (510k)</option>
                  <option value="Class I (Exempt)">Class I (Exempt)</option>
                  <option value="Class III (PMA Required)">Class III (PMA)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Predicate Device K#</label>
                <input
                  type="text"
                  value={predicateDevice}
                  onChange={(e) => setPredicateDevice(e.target.value)}
                  placeholder="K210452"
                  className="w-full glass-input rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Technical Specifications &amp; Intended Use</label>
              <textarea
                rows={10}
                value={specifications}
                onChange={(e) => setSpecifications(e.target.value)}
                placeholder="Paste device specifications, materials, software IEC 62304 standards, or hazard analysis here..."
                className="w-full glass-input rounded-xl p-3 text-xs text-white resize-none"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                {error}
              </div>
            )}

            <button
              onClick={handleResolve}
              disabled={loading || !deviceName.trim() || !specifications.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-rose-500/10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running FDA 510(k) Substantial Equivalence Audit...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4" />
                  Run FDA 510(k) Analysis
                </>
              )}
            </button>
          </div>

          {/* Right Results Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-6 lg:col-span-2">
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" /> Regulatory Equivalence &amp; Audit Dossier
              </h2>

              {result && (
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Export CSV Spreadsheet
                </button>
              )}
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">Executive 510(k) Summary</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{result.summary}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Substantial Equivalence Analysis</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{result.predicateComparison}</p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Detailed 21 CFR Part 820 &amp; ISO 13485 Checklist</span>
                  
                  <div className="space-y-3">
                    {result.items.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{item.clause} — {item.topic}</span>
                          <div className="flex gap-2">
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              item.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {item.status}
                            </span>
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                              Risk: {item.riskRating}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400">{item.regulatoryRationale}</p>
                        <p className="text-[11px] text-cyan-300/90 font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-900">
                          Remediation: {item.recommendedRemediation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                <Activity className="h-10 w-10 text-slate-700 mb-3" />
                <p className="text-xs">Fill out the medical device submission form on the left to generate FDA 510(k) substantial equivalence reports.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
