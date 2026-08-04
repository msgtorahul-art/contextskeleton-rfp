'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  ShieldCheck, FileText, AlertTriangle, CheckCircle2, XCircle, 
  Loader2, Sparkles, Download, Building, Layers, ArrowRight, RefreshCw 
} from 'lucide-react';

interface ClauseAudit {
  clause: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  findings: string;
  missingItems: string[];
  recommendation: string;
}

interface AuditReport {
  overallScore: number;
  status: 'APPROVED' | 'NEEDS_REVISION' | 'HIGH_RISK';
  summary: string;
  clauseAudits: ClauseAudit[];
  criticalRedFlags: string[];
  recommendedCouncilDocs: string[];
}

export default function ConsentAuditorPage() {
  const [specText, setSpecText] = useState('');
  const [buildingType, setBuildingType] = useState('Residential Multi-Unit');
  const [selectedClauses, setSelectedClauses] = useState<string[]>([
    'NZBC E2 (External Moisture)',
    'NZBC H1 (Energy Efficiency)',
    'NZBC B1 (Structure)',
    'NZBC G12 (Water Supply)',
  ]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);

  const toggleClause = (clause: string) => {
    if (selectedClauses.includes(clause)) {
      setSelectedClauses(selectedClauses.filter((c) => c !== clause));
    } else {
      setSelectedClauses([...selectedClauses, clause]);
    }
  };

  const handleAudit = async () => {
    if (!specText.trim()) return;
    setLoading(true);
    setReport(null);

    try {
      const res = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specText,
          buildingType,
          selectedClauses,
        }),
      });

      const data = await res.json();
      if (data.auditReport) {
        setReport(data.auditReport);
        window.dispatchEvent(new Event('billing-update'));
      } else {
        alert(data.error || 'Failed to generate consent audit report.');
      }
    } catch (err) {
      console.error('Audit Error:', err);
      alert('An unexpected error occurred during audit.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleSpec = () => {
    setSpecText(`PROJECT SPECIFICATION & ARCHITECTURAL OUTLINE:
Project: 4-Unit Residential Townhouses, Auckland NZ
External Cladding: Vertical Cedar Weatherboard with 20mm drained cavity system over rigid air barrier.
Roofing: Colorsteel trapezoidal roofing profile at 5-degree pitch with continuous butyl rubber gutters.
Foundations: Reinforced concrete slab-on-ground to NZS 3604 with R-1.5 perimeter insulation.
Glazing: Low-E double glazing thermally broken aluminium joinery (R-0.46 overall window system).
Water Supply: Mains pressure hot water cylinder with tempering valves set to 55°C at outlets.
Fire Safety: Interconnected hardwired optical smoke alarms in all bedrooms and egress corridors.
Insulation: R-4.0 ceiling batts, R-2.8 wall batts.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <Sidebar />

      <main className="pl-80 flex-1 p-10 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <ShieldCheck className="h-3.5 w-3.5" /> AI Building Consent & Plan Auditor
            </div>
            <h1 className="text-3xl font-extrabold text-white">Council Consent Pre-Audit Engine</h1>
            <p className="text-slate-400 text-xs mt-1">Audit architectural drawings & specs against NZBC Building Code prior to council submission.</p>
          </div>

          <button
            onClick={loadSampleSpec}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
          >
            <FileText className="h-4 w-4 text-violet-400" />
            Load Sample NZ Spec
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Input Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="h-4 w-4 text-violet-400" />
                Building Type & Scope
              </h2>

              <select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-violet-500 font-medium"
              >
                <option value="Residential Multi-Unit">Residential Multi-Unit Townhouses</option>
                <option value="Standalone Residential Dwelling">Standalone Residential Dwelling</option>
                <option value="Commercial Office Building">Commercial Office Building</option>
                <option value="Industrial Warehouse & Factory">Industrial Warehouse & Factory</option>
                <option value="Educational & Institutional">Educational & Institutional Facility</option>
              </select>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">Target NZBC Code Standards:</label>
                <div className="space-y-2">
                  {[
                    'NZBC E2 (External Moisture)',
                    'NZBC H1 (Energy Efficiency)',
                    'NZBC B1 (Structure & Seismic)',
                    'NZBC G12 (Water Supply & Plumbing)',
                    'NZBC C1-C6 (Fire Safety)',
                  ].map((clause) => (
                    <label
                      key={clause}
                      onClick={() => toggleClause(clause)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        selectedClauses.includes(clause)
                          ? 'bg-violet-600/10 border-violet-500/40 text-violet-300'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedClauses.includes(clause)}
                        onChange={() => {}}
                        className="rounded border-slate-700 bg-slate-800 text-violet-600 focus:ring-0"
                      />
                      {clause}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">Architectural Specification / Plan Text:</label>
                <textarea
                  value={specText}
                  onChange={(e) => setSpecText(e.target.value)}
                  placeholder="Paste specification notes, cladding profiles, R-values, membrane specs, or drainage details here..."
                  className="w-full h-48 bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-violet-500 resize-none font-mono"
                />
              </div>

              <button
                onClick={handleAudit}
                disabled={loading || !specText.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Auditing Against NZBC Standards...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Run Pre-Consent Compliance Audit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Results Display */}
          <div className="lg:col-span-7">
            {!report && !loading && (
              <div className="glass-panel p-12 rounded-3xl text-center border-dashed border-slate-800">
                <ShieldCheck className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">No Audit Generated Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Paste your architectural specs on the left and click "Run Pre-Consent Compliance Audit" to check against NZBC rules.
                </p>
              </div>
            )}

            {loading && (
              <div className="glass-panel p-16 rounded-3xl text-center">
                <Loader2 className="h-10 w-10 text-emerald-400 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">Auditing Specifications</h3>
                <p className="text-xs text-slate-400">Evaluating cladding cavities, H1 R-values, and producer statement requirements...</p>
              </div>
            )}

            {report && (
              <div className="space-y-6">
                {/* Score Header */}
                <div className="glass-panel p-6 rounded-3xl border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Pre-Submission Audit Result</span>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-extrabold text-white">{report.overallScore} / 100</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        report.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-violet-400" />
                    Export Audit Report
                  </button>
                </div>

                {/* Summary */}
                <div className="glass-panel p-6 rounded-3xl">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Audit Executive Summary</h3>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{report.summary}</p>
                </div>

                {/* Critical Red Flags */}
                {report.criticalRedFlags && report.criticalRedFlags.length > 0 && (
                  <div className="bg-rose-950/40 border border-rose-500/30 p-6 rounded-3xl">
                    <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4" />
                      Critical Consent Risk Flags (Will Cause Council RFI / Rejection)
                    </h3>
                    <ul className="space-y-2">
                      {report.criticalRedFlags.map((flag, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-rose-200">
                          <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Clause Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detailed NZBC Clause Evaluations</h3>
                  {report.clauseAudits.map((ca, idx) => (
                    <div key={idx} className="glass-panel p-6 rounded-3xl border-slate-800/80 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white">{ca.clause}</h4>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          ca.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {ca.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{ca.findings}</p>

                      {ca.missingItems && ca.missingItems.length > 0 && (
                        <div className="bg-slate-900/80 p-3 rounded-xl text-xs text-amber-300 space-y-1">
                          <span className="font-bold block text-[10px] uppercase text-amber-400">Missing Consent Details:</span>
                          {ca.missingItems.map((m, mIdx) => (
                            <div key={mIdx}>• {m}</div>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-emerald-400 font-medium bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                        <strong className="block text-[10px] uppercase text-emerald-500 mb-0.5">Remediation Recommendation:</strong>
                        {ca.recommendation}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommended Council Producer Statements */}
                {report.recommendedCouncilDocs && (
                  <div className="glass-panel p-6 rounded-3xl border-slate-800">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Required Council Producer Statements & Documentation</h3>
                    <div className="flex flex-wrap gap-2">
                      {report.recommendedCouncilDocs.map((doc, idx) => (
                        <span key={idx} className="bg-violet-600/10 text-violet-300 border border-violet-500/20 text-xs font-semibold px-3 py-1.5 rounded-xl">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
