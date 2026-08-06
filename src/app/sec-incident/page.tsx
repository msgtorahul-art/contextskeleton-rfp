'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { AlertTriangle, Loader2, ShieldAlert } from 'lucide-react';

export default function SecIncidentPage() {
  const [companyName, setCompanyName] = useState('');
  const [incidentNotes, setIncidentNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAudit = async () => {
    if (!incidentNotes.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/sec-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, incidentNotes }),
      });
      setResult(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <Sidebar />
      <main className="pl-80 flex-1 p-10 min-h-screen">
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs">
          ⚠️ SEC 4-Day Cybersecurity Incident Materiality War Room (Form 8-K Item 1.05).
        </div>

        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <AlertTriangle className="h-3.5 w-3.5" /> SEC 4-Day Incident War Room
            </div>
            <h1 className="text-3xl font-extrabold text-white">SEC Form 8-K Item 1.05 Materiality Engine</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-5">
              <input
                type="text"
                placeholder="Public Company Name / Ticker"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-white"
              />
              <textarea
                rows={10}
                value={incidentNotes}
                onChange={(e) => setIncidentNotes(e.target.value)}
                placeholder="Paste incident responder triage notes, exfiltrated record estimates, and operational downtime logs..."
                className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-200"
              />
              <button
                onClick={handleAudit}
                disabled={loading || !incidentNotes.trim()}
                className="w-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold text-xs py-3.5 rounded-xl"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Evaluate SEC Materiality ($5,000 Tier)'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-panel p-6 rounded-3xl min-h-[500px]">
              {result ? (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
                    <span className="text-[10px] font-bold text-rose-400 uppercase">Materiality Determination</span>
                    <p className="text-xs text-slate-200 mt-1">{result.materialityAssessment}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Draft Form 8-K Item 1.05 Text</span>
                    <pre className="text-xs text-slate-300 mt-1 whitespace-pre-wrap font-sans">{result.item105Draft}</pre>
                  </div>
                </div>
              ) : <div className="text-center text-slate-500 py-20 text-xs">Paste breach triage notes to calculate materiality under SEC Form 8-K Item 1.05 rules.</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
