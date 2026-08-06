import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, FileText, Scale, CheckCircle2, ShieldCheck, Lock, Award } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service & Legal Safeguards | ContextSkeleton Enterprise AI',
  description: 'Commercial Terms of Service, Legal Protections, Defense Disclaimers, and Professional Liability Limits for ContextSkeleton.',
  alternates: {
    canonical: 'https://contextskeleton.com/terms',
  },
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
            <Scale className="h-3.5 w-3.5" /> Commercial Terms, Defense Safeguards &amp; Liability Disclaimers
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">Terms of Service &amp; Legal Protection</h1>
          <p className="text-slate-400 text-xs">Last Updated: August 6, 2026</p>
        </header>

        <div className="space-y-8 text-xs text-slate-300 leading-relaxed font-sans">
          {/* PROFESSIONAL & COMPLIANCE DISCLAIMER ALERT */}
          <section className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3">
            <h2 className="text-sm font-bold text-amber-300 flex items-center gap-2 uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4" /> 1. MANDATORY PROFESSIONAL &amp; REGULATORY DISCLAIMER
            </h2>
            <p>
              ContextSkeleton provides automated software data-processing tools including RFP proposal drafting, NZBC/IBC building consent pre-auditing, FDA 510(k) predicate screening, SBIR/GovWin federal grant narrative formatting, and SOC 2 / ISO 27001 security questionnaire resolving.
            </p>
            <p>
              <strong>AI OUTPUTS ARE PROVIDED FOR INFORMATIONAL DATA-PROCESSING PURPOSES ONLY AND DO NOT CONSTITUTE CERTIFIED LEGAL, ARCHITECTURAL, ENGINEERING, MEDICAL REGULATORY, DEFENSE CONTRACTING, OR FORMAL AUDIT ADVICE.</strong>
            </p>
            <p>
              Final building consent submissions must be signed off by a licensed Registered Architect or Chartered Professional Engineer (CPEng); security questionnaires by your internal CISO; grant proposals by an authorized corporate signee; and FDA filings by certified regulatory counsel. Users retain 100% sole responsibility for reviewing and verifying all generated drafts prior to submission to any third party or government entity.
            </p>
          </section>

          {/* DEFENSE & FEDERAL PROCUREMENT SAFEGUARDS */}
          <section className="glass-panel p-8 rounded-3xl border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-400" /> 2. Federal Procurement, Defense &amp; SBIR Grant Disclaimers
            </h2>
            <p>
              ContextSkeleton is an independent commercial software platform. It is <strong>NOT affiliated with, endorsed by, or sponsored by SAM.gov, the U.S. Department of Defense (DoD), DARPA, NIH, NSF, or any government department or defense agency.</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li><strong>Unclassified Data Only:</strong> Users are strictly prohibited from uploading Classified, ITAR-controlled (International Traffic in Arms Regulations), EAR-controlled, or Top Secret government data to the platform.</li>
              <li><strong>No Award Guarantees:</strong> Pre-audit screening recommendations do not guarantee SBIR/STTR Phase I/II grant funding or federal contract awards by Contracting Officers (CO).</li>
            </ul>
          </section>

          {/* SUBSCRIPTIONS & ACCEPTABLE USE */}
          <section className="glass-panel p-8 rounded-3xl border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-violet-400" /> 3. Subscriptions &amp; Billing Terms
            </h2>
            <p>
              Access to ContextSkeleton commercial products is billed on a monthly recurring subscription basis ($499/mo to $2,500/mo). Subscriptions auto-renew monthly until cancelled via your dashboard or by emailing support@contextskeleton.com.
            </p>
          </section>

          {/* INDEMNIFICATION & LIABILITY LIMITS */}
          <section className="glass-panel p-8 rounded-3xl border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="h-5 w-5 text-rose-400" /> 4. Total Indemnification &amp; Limitation of Liability
            </h2>
            <p>
              <strong>Indemnification:</strong> You agree to defend, indemnify, and hold harmless ContextSkeleton, its operating company, founders, owners, officers, and employees from and against any third-party claims, damages, liabilities, regulatory fines, or costs arising out of your use of the platform, submission of AI-generated content, or violation of government filing rules.
            </p>
            <p>
              <strong>Liability Cap:</strong> To the maximum extent permitted by applicable law, ContextSkeleton&apos;s aggregate liability for any claims shall strictly not exceed the lesser of $100 USD or the total subscription fees paid by you to ContextSkeleton in the twelve (12) months preceding the claim.
            </p>
          </section>

          <footer className="pt-4 border-t border-slate-900 text-center text-slate-500">
            For legal inquiries or corporate compliance questions, contact <a href="mailto:support@contextskeleton.com" className="text-violet-400 underline font-bold">support@contextskeleton.com</a>.
          </footer>
        </div>
      </div>
    </main>
  );
}
