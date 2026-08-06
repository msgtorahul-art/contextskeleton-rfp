'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Stethoscope, FileText, Loader2, FileSpreadsheet, Sparkles, HeartPulse, ShieldAlert, PhoneCall, Copy, Check
} from 'lucide-react';

export default function MedicalClaimAppealPage() {
  const [denialReason, setDenialReason] = useState('Experimental / Not Medically Necessary');
  const [cptCodes, setCptCodes] = useState('');
  const [patientClinicalNotes, setPatientClinicalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgressText, setLoadingProgressText] = useState('Analyzing Clinical Notes & Denial Reason...');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    appealLetter: string;
    cptAnalysis: Array<{
      code: string;
      status: string;
      medicalNecessityRationale: string;
    }>;
    peerToPeerScript: string;
  } | null>(null);

  useEffect(() => {
    let t1: NodeJS.Timeout, t2: NodeJS.Timeout;
    if (loading) {
      setLoadingProgressText('Analyzing Clinical Notes & Denial Reason...');
      t1 = setTimeout(() => setLoadingProgressText('Cross-referencing AMA CPT coding & LCD coverage guidelines...'), 12000);
      t2 = setTimeout(() => setLoadingProgressText('Drafting formal clinical appeal letter & physician peer-to-peer script...'), 35000);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loading]);

  const handleAudit = async () => {
    if (!patientClinicalNotes.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/claim-appeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ denialReason, cptCodes, patientClinicalNotes }),
      });

      const rawText = await res.text();
      let data: any = {};
      try { data = JSON.parse(rawText); } catch (e) {}

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to generate medical claim appeal.');
      }
    } catch (err: any) {
      console.error('Audit submission error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleClaim = () => {
    setDenialReason('Experimental / Lacks Medical Necessity (Aetna Policy #0421)');
    setCptCodes('CPT 27447 (Total Knee Arthroplasty) / ICD-10 M17.11 (Primary Osteoarthritis, Right Knee)');
    setPatientClinicalNotes(`Patient: 64-year-old female with severe right knee pain.
Duration: 18 months of progressive pain affecting weight-bearing activities.
Prior Therapies Attempted:
1. Physical Therapy: 12 weeks completed (Jan-Apr 2025) with minimal functional improvement.
2. Pharmacotherapy: Daily NSAIDs (Meloxicam 15mg) with inadequate pain control and stomach upset.
3. Injections: Intra-articular hyaluronic acid & corticosteroid injections (May 2025), pain relief lasted < 3 weeks.
Diagnostic Imaging: Right knee weight-bearing X-rays show severe joint space narrowing, subchondral sclerosis, and osteophytes (Kellgren-Lawrence Grade IV).`);
  };

  const handleCopyLetter = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.appealLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <Sidebar />

      <main className="pl-80 flex-1 p-10 min-h-screen">
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block mb-0.5 text-amber-300">
              ⚠️ CLINICAL &amp; MEDICAL PRACTICE DISCLAIMER
            </span>
            <span>
              ContextSkeleton is an automated administrative drafting software tool. Appeal letters do not constitute medical diagnosis or formal legal representation and must be reviewed and signed by the attending licensed physician.
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <HeartPulse className="h-3.5 w-3.5" /> Medical Claim Appeal Architect
            </div>
            <h1 className="text-3xl font-extrabold text-white">Clinical Claim Denial Appeal Generator</h1>
            <p className="text-slate-400 text-xs mt-1">Rebut insurance prior authorization (PA) claim denials with CPT/ICD-10 clinical necessity evidence.</p>
          </div>

          <button
            onClick={loadSampleClaim}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
          >
            <FileText className="h-4 w-4 text-rose-400" />
            Load Sample Insurer Denial
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Insurer Denial Reason / Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. Experimental / Lacks Medical Necessity"
                  value={denialReason}
                  onChange={(e) => setDenialReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  CPT &amp; ICD-10 Codes
                </label>
                <input
                  type="text"
                  placeholder="e.g. CPT 27447 / ICD-10 M17.11"
                  value={cptCodes}
                  onChange={(e) => setCptCodes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Patient Clinical Notes &amp; History
                </label>
                <textarea
                  rows={9}
                  value={patientClinicalNotes}
                  onChange={(e) => setPatientClinicalNotes(e.target.value)}
                  placeholder="Paste patient chart notes, prior failed therapies, and diagnostic imaging findings..."
                  className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-rose-500 resize-none leading-relaxed font-mono"
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                onClick={handleAudit}
                disabled={loading || !patientClinicalNotes.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-rose-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span className="truncate">{loadingProgressText}</span>
                  </>
                ) : (
                  <>
                    <HeartPulse className="h-4 w-4" />
                    Generate Appeal Letter ($999 Tier)
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
                    <Sparkles className="h-4 w-4 text-rose-400" />
                    Formal Clinical Appeal Letter &amp; Peer-to-Peer Script
                  </h2>

                  {result && (
                    <button
                      onClick={handleCopyLetter}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-rose-400" />}
                      {copied ? 'Copied Appeal Letter' : 'Copy Appeal Letter'}
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                      <Loader2 className="h-7 w-7 text-rose-400 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-sm">Medical Necessity Engine Running</h3>
                      <p className="text-slate-400 text-xs max-w-xs mx-auto animate-pulse">
                        {loadingProgressText}
                      </p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-6">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-3">
                      <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider block">Formal Rebuttal Appeal Text</span>
                      <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">{result.appealLetter}</pre>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-3">
                      <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
                        <PhoneCall className="h-3.5 w-3.5" /> 3-Minute Physician Peer-to-Peer Discussion Script
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed font-mono">{result.peerToPeerScript}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[450px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                    <Stethoscope className="h-10 w-10 text-slate-700 mb-3" />
                    <p className="text-xs">Paste patient clinical notes and denial reasons on the left to generate evidence-backed clinical appeal letters.</p>
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
