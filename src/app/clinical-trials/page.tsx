'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Stethoscope, Activity, Download, FileSpreadsheet, Sparkles, Loader2, 
  AlertTriangle, CheckCircle2, FileText, ArrowRight, ShieldAlert, Heart
} from 'lucide-react';

export default function ClinicalTrialsResolverPage() {
  const [protocolTitle, setProtocolTitle] = useState('');
  const [phase, setPhase] = useState('Phase II Clinical Trial');
  const [patientRecord, setPatientRecord] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    eligibilityStatus: string;
    items: Array<{
      criteriaType: string;
      requirement: string;
      status: string;
      clinicalRationale: string;
      investigatorAction: string;
    }>;
  } | null>(null);

  const handleResolve = async () => {
    if (!protocolTitle.trim() || !patientRecord.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/clinical-trials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocolTitle,
          phase,
          patientRecord,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to run clinical trial eligibility analysis.');
      }
    } catch (err) {
      console.error('Clinical Trial Analysis Error:', err);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type: string) => {
    if (type === 'oncology') {
      setProtocolTitle('Phase II Anti-PD-1 Immunotherapy Trial in Metastatic Non-Small Cell Lung Cancer');
      setPhase('Phase II Clinical Trial');
      setPatientRecord(`Patient ID: PT-9042 (Age: 62, Male)
Diagnosis: Stage IV NSCLC with adenocarcinoma histology.
Biomarker Testing: PD-L1 Tumor Proportion Score (TPS) = 65% by IHC 22C3. EGFR wild-type, ALK negative.
Prior Therapy: 1st line platinum-based chemotherapy completed 3 months ago.
Laboratory Function: Absolute Neutrophil Count (ANC) = 2.1 x 10^9/L, Platelets = 145 x 10^9/L, Serum Creatinine = 0.9 mg/dL, ALT/AST < 1.5x ULN.
ECG / Cardiac: QTc = 420 ms, LVEF = 58%.
Exclusion Check: No active autoimmune disease, no systemic corticosteroid therapy > 10mg prednisone daily.`);
    } else if (type === 'cardiology') {
      setProtocolTitle('Phase III Transcatheter Mitral Valve Repair (TMVR) Device Trial');
      setPhase('Phase III Pivotal Trial');
      setPatientRecord(`Patient ID: PT-3108 (Age: 74, Female)
Diagnosis: Severe functional mitral regurgitation (3+ MR) secondary to ischemic cardiomyopathy.
Cardiac Echo: NYHA Class III heart failure, Left Ventricular Ejection Fraction (LVEF) = 32%, Mitral valve orifice area = 3.8 cm2.
Comorbidities: Type 2 Diabetes (HbA1c = 7.2%), Stage 3 Chronic Kidney Disease (eGFR = 48 mL/min).
Exclusion Check: No active endocarditis, no stroke within past 6 months.`);
    }
  };

  const exportCSV = () => {
    if (!result || !Array.isArray(result.items)) return;
    let csvContent = 'Criteria Type,Requirement,Status,Clinical Rationale,Investigator Action\n';
    result.items.forEach((item) => {
      const criteria = (item.criteriaType || '').replace(/"/g, '""');
      const req = (item.requirement || '').replace(/"/g, '""');
      const stat = (item.status || '').replace(/"/g, '""');
      const rat = (item.clinicalRationale || '').replace(/"/g, '""');
      const act = (item.investigatorAction || '').replace(/"/g, '""');
      csvContent += `"${criteria}","${req}","${stat}","${rat}","${act}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Clinical_Trial_Eligibility_${protocolTitle.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const safeItems = result && Array.isArray(result.items) ? result.items : [];

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
              ContextSkeleton is an automated software data processing service. Outputs do NOT constitute formal medical diagnosis, clinical treatment advice, or certified medical opinion and do not replace licensed Principal Investigators (MD), certified Clinical Research Coordinators (CRC), or official FDA/EMA IRB approvals.
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Stethoscope className="h-3.5 w-3.5" /> Pharma &amp; CRO Trial Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white">Clinical Trial Protocol &amp; Eligibility Matching Resolver</h1>
            <p className="text-slate-400 text-xs mt-1">Automate patient cohort inclusion/exclusion screening against FDA and EMA trial protocols.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => loadPreset('oncology')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load Oncology Protocol
            </button>
            <button
              onClick={() => loadPreset('cardiology')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              Load Cardiology Protocol
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 lg:col-span-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-rose-400" /> Trial &amp; Patient Screening Inputs
            </h2>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Clinical Protocol Title / ID</label>
              <input
                type="text"
                value={protocolTitle}
                onChange={(e) => setProtocolTitle(e.target.value)}
                placeholder="e.g. Phase II Anti-PD-1 NSCLC Trial"
                className="w-full glass-input rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Trial Phase</label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
              >
                <option value="Phase II Clinical Trial">Phase II Clinical Trial</option>
                <option value="Phase I First-in-Human">Phase I First-in-Human</option>
                <option value="Phase III Pivotal Trial">Phase III Pivotal Trial</option>
                <option value="Phase IV Post-Marketing Study">Phase IV Post-Marketing Study</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Patient Clinical Summary &amp; Lab Data</label>
              <textarea
                rows={10}
                value={patientRecord}
                onChange={(e) => setPatientRecord(e.target.value)}
                placeholder="Paste anonymized patient medical history, biomarker status, lab values, or prior lines of therapy..."
                className="w-full glass-input rounded-xl p-3 text-xs text-white resize-none"
              />
            </div>

            <button
              onClick={handleResolve}
              disabled={loading || !protocolTitle.trim() || !patientRecord.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-rose-500/10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Auditing Patient Eligibility against Trial Protocol...
                </>
              ) : (
                <>
                  <Stethoscope className="h-4 w-4" />
                  Run Clinical Trial Eligibility Audit
                </>
              )}
            </button>
          </div>

          {/* Right Results Panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-6 lg:col-span-2">
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" /> Patient Eligibility &amp; Protocol Audit Dossier
              </h2>

              {result && (
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-400 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Export CSV Eligibility Report
                </button>
              )}
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">Executive Trial Eligibility Summary</span>
                    <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                      result.eligibilityStatus === 'ELIGIBLE' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      Status: {result.eligibilityStatus || 'COMPLETED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{result.summary}</p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Inclusion / Exclusion Checklist</span>
                  
                  <div className="space-y-3">
                    {safeItems.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{item.criteriaType || 'Protocol Standard'}</span>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            item.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {item.status || 'CHECKED'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-semibold">{item.requirement}</p>
                        <p className="text-xs text-slate-400">{item.clinicalRationale}</p>
                        {item.investigatorAction && (
                          <p className="text-[11px] text-rose-300/90 font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-900">
                            Investigator Action: {item.investigatorAction}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                <Stethoscope className="h-10 w-10 text-slate-700 mb-3" />
                <p className="text-xs">Fill out the trial protocol screening inputs on the left to evaluate patient inclusion/exclusion eligibility.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
