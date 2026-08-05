import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, CheckCircle2, Lock, ArrowRight, FileText, AlertTriangle, Cpu, Terminal
} from 'lucide-react';

export default function TrustTestingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center z-30 relative border-b border-slate-900/80 backdrop-blur-md bg-slate-950/80 sticky top-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-violet-500/20 group-hover:scale-105 transition duration-300">
            C
          </div>
          <div>
            <span className="font-extrabold text-white text-lg tracking-tight block group-hover:text-violet-400 transition">ContextSkeleton</span>
            <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block -mt-1">Trust &amp; Security Engineering</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/auth" className="text-xs text-slate-400 hover:text-white font-semibold">Sign In</Link>
          <Link href="/auth?mode=register" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl">Start Free Trial</Link>
        </div>
      </nav>

      {/* Header Banner */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 z-10 relative text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
          <ShieldCheck className="h-4 w-4 text-emerald-400" /> Internal QA &amp; Adversarial Security Benchmarks (August 2026)
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
          Built for Compliance Work.<br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            Tested Like It.
          </span>
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-4 leading-relaxed font-medium">
          Compliance and audit tools carry real consequences when they get something wrong. Before any ContextSkeleton product ships, we run it through adversarial stress-testing designed to break it—not just demo it.
        </p>
      </section>

      {/* What We Test For */}
      <section className="max-w-5xl mx-auto px-6 py-8 z-10 relative space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="glass-panel p-6 rounded-3xl space-y-3 border-slate-800">
            <div className="h-10 w-10 rounded-xl bg-violet-600/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-violet-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Grounding, Not Guessing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every audit and questionnaire product is tested with zero supporting source documents to confirm it flags answers as ungrounded rather than fabricating a confident-sounding response. If there&apos;s no policy document behind a claim, the product says so.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-3 border-slate-800">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Prompt Injection Resistance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We&apos;ve run direct injection attacks against our Security Questionnaire Resolver—including attempts to make it leak internal instructions or output a false &quot;approved&quot; result—and it correctly treated the attack as literal input text rather than following it.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-3 border-slate-800">
            <div className="h-10 w-10 rounded-xl bg-cyan-600/10 flex items-center justify-center">
              <Cpu className="h-5 w-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Enterprise-Scale Complexity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our audit tools have been tested against realistic large-scale scenarios: multi-page technical specifications, 15+ item RFP questionnaires, and deliberately contradictory data planted to see whether the system catches coordination conflicts a human reviewer would need to flag.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-3 border-slate-800">
            <div className="h-10 w-10 rounded-xl bg-amber-600/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Domain Accuracy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our SOX 404 / SOC 1 Auditor correctly distinguishes a &quot;significant deficiency&quot; from a &quot;material weakness&quot;—a distinction that matters to real auditors and is easy for a less careful system to blur. Our ESG &amp; CSRD Climate Auditor&apos;s Scope 1–3 emissions math checks out to the decimal against manual verification.
            </p>
          </div>

        </div>

        {/* Per-Product Verified Audit Summary */}
        <div className="glass-panel p-8 rounded-3xl border-slate-800 space-y-6">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" /> Verified Product Testing Findings
          </h2>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900">
              <strong className="text-violet-400 block mb-1">Security Questionnaire Resolver</strong>
              Tested against live prompt-injection attacks—resists attempts to extract instructions or force approval, and flags ungrounded answers instead of fabricating them.
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900">
              <strong className="text-orange-400 block mb-1">OSHA &amp; EHS Safety Auditor</strong>
              Reports only what&apos;s in your actual inspection notes—tested to confirm it won&apos;t invent violations, equipment, or observations that weren&apos;t submitted.
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900">
              <strong className="text-emerald-400 block mb-1">SOX 404 &amp; SOC 1 Financial Auditor</strong>
              Correctly distinguishes control-deficiency severity levels per PCAOB AS 2201—tested against real internal-audit scenarios.
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900">
              <strong className="text-teal-400 block mb-1">ESG &amp; CSRD Climate Auditor</strong>
              Scope 1–3 emissions calculations independently verified for accuracy against source data.
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900">
              <strong className="text-emerald-400 block mb-1">Building Consent Auditor</strong>
              Tested against deliberately contradictory architectural specs—correctly flags cross-discipline coordination conflicts a human reviewer would need to catch.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/20 text-center">
            <p className="text-xs text-slate-300">
              We publish this not as a badge, but as a standing commitment: if you find a case where one of our products fabricates an answer, ignores a planted contradiction, or falls for an injection attempt, send a report directly to{' '}
              <a href="mailto:support@contextskeleton.com" className="text-violet-400 font-bold underline">support@contextskeleton.com</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-900 text-slate-500 text-xs text-center">
        &copy; {new Date().getFullYear()} ContextSkeleton. All rights reserved. | <Link href="/" className="hover:text-white">Home</Link> | <Link href="/blog" className="hover:text-white">Blog</Link>
      </footer>
    </main>
  );
}
