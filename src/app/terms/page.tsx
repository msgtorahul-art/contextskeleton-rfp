import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, FileText, Scale, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | ContextSkeleton',
  description: 'Terms of Service and Professional Disclaimer for ContextSkeleton Enterprise AI Platform.',
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Homepage
        </Link>

        <header className="mb-12 border-b border-slate-900 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold mb-4">
            <Scale className="h-3.5 w-3.5" /> Commercial Terms & Professional Disclaimer
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">Terms of Service</h1>
          <p className="text-slate-400 text-xs">Last Updated: August 5, 2026</p>
        </header>

        <div className="space-y-8 text-xs text-slate-300 leading-relaxed font-sans">
          {/* PROFESSIONAL & COMPLIANCE DISCLAIMER ALERT */}
          <section className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3">
            <h2 className="text-sm font-bold text-amber-300 flex items-center gap-2 uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4" /> IMPORTANT PROFESSIONAL & REGULATORY DISCLAIMER
            </h2>
            <p>
              ContextSkeleton provides automated decision-support AI tools including RFP proposal drafting, NZBC building consent pre-auditing, and SOC 2 / ISO 27001 security questionnaire resolving.
            </p>
            <p>
              <strong>AI outputs are provided for assistance purposes only and do NOT constitute legal, engineering, architectural, or certified audit advice.</strong> Final building consent applications must be signed off by a qualified professional (e.g. Registered Architect or Chartered Professional Engineer), and security responses must be reviewed by your internal CISO or compliance officer prior to formal submission.
            </p>
          </section>

          <section className="glass-panel p-8 rounded-3xl border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-violet-400" /> 1. Subscriptions & Billing Terms
            </h2>
            <p>
              Access to ContextSkeleton commercial products is billed on a monthly subscription basis (e.g. $499/mo RFP Pro, $750/mo Building Consent Auditor Pro). Subscriptions auto-renew monthly until cancelled via your dashboard or by emailing support@contextskeleton.com.
            </p>
          </section>

          <section className="glass-panel p-8 rounded-3xl border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" /> 2. User Responsibilities & Acceptable Use
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>Users agree not to upload illegal, infringing, or malicious content.</li>
              <li>Users are responsible for verifying the accuracy of AI-generated drafts prior to submitting proposals or regulatory filings.</li>
              <li>You agree not to reverse engineer or attempt unauthorized access to platform API endpoints.</li>
            </ul>
          </section>

          <section className="glass-panel p-8 rounded-3xl border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="h-5 w-5 text-cyan-400" /> 3. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, ContextSkeleton and its operators shall not be liable for any indirect, incidental, or consequential damages resulting from council consent delays, rejected tender bids, or reliance on automated AI analysis.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
