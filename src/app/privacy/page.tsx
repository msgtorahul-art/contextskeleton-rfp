import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Database, Mail, Key } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | ContextSkeleton Enterprise AI',
  description: 'Privacy Policy and data security practices for ContextSkeleton Enterprise AI Platform.',
  alternates: {
    canonical: 'https://contextskeleton.com/privacy',
  },
};

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-semibold mb-4">
            <ShieldCheck className="h-3.5 w-3.5" /> Enterprise Privacy &amp; Data Protection
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-slate-400 text-xs">Last Updated: August 5, 2026</p>
        </header>

        <div className="space-y-8 text-xs text-slate-300 leading-relaxed font-sans">
          <section className="glass-panel p-8 rounded-3xl border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-violet-400" /> 1. Data Collection &amp; Processing Boundaries
            </h2>
            <p>
              ContextSkeleton (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;) provides autonomous AI proposal generation, building consent pre-auditing, vector knowledge bases, and token skeletonization services. We collect minimal personal data required to deliver our enterprise services:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li><strong>Account Data:</strong> Name, work email address, and hashed authentication credentials.</li>
              <li><strong>Customer Ingested Content:</strong> Tender questionnaires, architectural blueprints, SOC 2 policies, and vector knowledge base uploads.</li>
              <li><strong>Technical Metadata:</strong> Session tokens, IP addresses, browser agents, and API consumption logs.</li>
            </ul>
          </section>

          <section className="glass-panel p-8 rounded-3xl border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-400" /> 2. AI Model Training &amp; Data Isolation
            </h2>
            <p>
              <strong>We do NOT sell, license, or use customer data to train public artificial intelligence models.</strong>
            </p>
            <p>
              All uploaded documents, PDF vector embeddings, and generated responses are stored in isolated, multi-tenant database clusters (Turso Cloud / SQLite). Customer data remains strictly segregated within your organization&apos;s account boundary.
            </p>
          </section>

          <section className="glass-panel p-8 rounded-3xl border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="h-5 w-5 text-cyan-400" /> 3. Cookies &amp; Local Storage Disclosure
            </h2>
            <p>
              ContextSkeleton utilizes essential HTTP-only cookies and browser session storage strictly necessary for authentication security and billing status verification. We do NOT use third-party advertising cookies or cross-site tracking pixels.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li><strong>Authentication Tokens:</strong> Secure HTTP-only cookies storing encrypted session tokens.</li>
              <li><strong>User Preference Cache:</strong> Local storage used to persist workspace UI layout states.</li>
            </ul>
          </section>

          <section className="glass-panel p-8 rounded-3xl border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" /> 4. Data Retention &amp; Deletion Rights (GDPR / DSAR)
            </h2>
            <p>
              Customers retain 100% ownership of their uploaded documents and vector indexes. You may delete any uploaded file or knowledge base index at any time through your account dashboard. Upon deletion, vector embeddings and associated database records are permanently purged from active storage.
            </p>
          </section>

          <section className="glass-panel p-8 rounded-3xl border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-cyan-400" /> 5. Contact Privacy Officer
            </h2>
            <p>
              For privacy inquiries, Data Subject Access Requests (DSAR), or security compliance questions, contact our Security &amp; Data Protection Team:
            </p>
            <p className="font-mono text-violet-300">
              Email: support@contextskeleton.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
