'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, Download, 
  FileText, Database, Layers, Cpu, Check, Mail, Globe, Code, Key, ChevronRight, Lock
} from 'lucide-react';

export default function LandingPage() {
  const [calcPages, setCalcPages] = useState(30);

  const mainServices = [
    {
      id: 'service-rfp',
      badge: 'Flagship Core Product',
      badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      title: 'Autonomous RFP & Tender Engine',
      icon: FileText,
      iconColor: 'text-violet-400',
      glowColor: 'hover:border-violet-500/50 hover:shadow-violet-500/10',
      tagline: 'Draft 100-page tender questionnaires in minutes grounded in verified company facts.',
      highlights: [
        'Automatic PDF & DOCX questionnaire shredding',
        'Fact-grounded answers with exact citations',
        'Single-click Microsoft Word (.docx) export',
        'Collaborative reviewer workspace',
      ],
      ctaText: 'Launch Proposal Builder',
      ctaHref: '/projects',
    },
    {
      id: 'service-consent',
      badge: 'NZ & Global Compliance',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      title: 'AI Building Consent Auditor',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      glowColor: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
      tagline: 'Audit blueprints and architectural specs against NZBC Building Code prior to council submission.',
      highlights: [
        'Evaluates NZBC E2 (Moisture) & H1 (Energy)',
        'Flags critical RFI rejection risks',
        'Generates producer statement (PS1/PS3) lists',
        'Reduces council approval delays by weeks',
      ],
      ctaText: 'Audit Building Consent',
      ctaHref: '/consent',
    },
    {
      id: 'service-knowledge',
      badge: 'Vector Infrastructure',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Enterprise Vector Knowledge Base',
      icon: Database,
      iconColor: 'text-indigo-400',
      glowColor: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10',
      tagline: 'Turn company PDFs, brochures, and compliance policies into searchable intelligence.',
      highlights: [
        'High-speed semantic vector similarity search',
        'Isolated Turso Cloud database storage',
        'Automatic PDF, DOCX, and TXT chunking',
        'Multi-tenant enterprise security boundaries',
      ],
      ctaText: 'Build Knowledge Base',
      ctaHref: '/knowledge',
    },
    {
      id: 'service-skeleton',
      badge: 'Developer Tooling',
      icon: Layers,
      iconColor: 'text-cyan-400',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glowColor: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10',
      tagline: 'Compress codebases and documents by 90%+ without losing structural context.',
      highlights: [
        'AST-level structural AST code & doc folding',
        'Cuts prompt token costs by up to 92%',
        'Built-in MCP server for AI agent workflows',
        'Preserves 100% context for LLM logic',
      ],
      ctaText: 'Use Token Skeletonizer',
      ctaHref: '/skeletonizer',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Glow background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navigation Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center z-30 relative border-b border-slate-900/80 backdrop-blur-md bg-slate-950/80 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-violet-500/20">
            C
          </div>
          <div>
            <span className="font-extrabold text-white text-lg tracking-tight block">ContextSkeleton</span>
            <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block -mt-1">Unified AI Platform</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-400">
          <a href="#services" className="hover:text-white transition">Products & Services</a>
          <a href="#workflow" className="hover:text-white transition">How It Works</a>
          <a href="#calculator" className="hover:text-white transition">ROI Calculator</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            id="nav-login"
            href="/auth"
            className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
          >
            Sign In
          </Link>
          <Link
            id="nav-register"
            href="/auth?mode=register"
            className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition cursor-pointer shadow-lg shadow-violet-500/10"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* HERO SECTION WITH TOP PRODUCTS GRID (ABOVE THE FOLD) */}
      <header className="max-w-7xl mx-auto px-6 pt-12 pb-16 z-10 relative">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
            <Sparkles className="h-4 w-4" /> Enterprise Autonomous AI Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Single Platform.<br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              All Enterprise AI Products & Services.
            </span>
          </h1>

          <p className="text-slate-400 mt-4 text-base max-w-2xl mx-auto leading-relaxed">
            From automated RFP proposal drafting to AI building consent pre-auditing, vector knowledge bases, and token skeletonization—access all tools on one domain.
          </p>
        </div>

        {/* TOP PRODUCT & SERVICES SHOWCASE GRID (IMMEDIATELY VISIBLE AT TOP) */}
        <section id="services" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainServices.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className={`glass-panel p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 ${s.glowColor} group`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`h-11 w-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center ${s.iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${s.badgeColor}`}>
                      {s.badge}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                    {s.title}
                  </h2>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {s.tagline}
                  </p>

                  <ul className="space-y-2 mb-6 border-t border-slate-900/80 pt-4">
                    {s.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  id={s.id}
                  href={s.ctaHref}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-violet-600 border border-slate-800 hover:border-violet-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer group-hover:shadow-lg group-hover:shadow-violet-500/10"
                >
                  {s.ctaText}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </section>
      </header>

      {/* METRICS BANNER */}
      <section className="border-y border-slate-900/80 bg-slate-950/60 py-8 backdrop-blur-sm z-10 relative">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-3xl font-extrabold text-white block">92%</span>
            <span className="text-xs text-slate-500 font-medium">Faster Proposal & Audit Completion</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white block">100%</span>
            <span className="text-xs text-slate-500 font-medium">NZBC & Grounded Fact Verification</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white block">.docx</span>
            <span className="text-xs text-slate-500 font-medium">Direct Microsoft Word Export</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white block">$0/mo</span>
            <span className="text-xs text-slate-500 font-medium">Free Evaluation Tier</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS WORKFLOW */}
      <section id="workflow" className="max-w-6xl mx-auto px-6 py-20 z-10 relative">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-2">Automated Architecture</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">How ContextSkeleton Works</h2>
          <p className="text-slate-400 mt-3 text-sm">Three seamless steps to automate your entire tender proposal & building audit pipeline.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl relative">
            <span className="text-5xl font-extrabold text-violet-500/20 absolute top-6 right-6">01</span>
            <div className="h-12 w-12 rounded-2xl bg-violet-600/10 flex items-center justify-center mb-6">
              <Database className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload Source Knowledge</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Upload past bids, architectural specs, ISO policies, and brochures into Turso Cloud Vector Storage.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl relative">
            <span className="text-5xl font-extrabold text-indigo-500/20 absolute top-6 right-6">02</span>
            <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Run AI Proposals & Audits</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Select RFP drafting or NZBC building consent pre-auditing. Gemini 2.5 Flash evaluates specs against verified standards.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl relative">
            <span className="text-5xl font-extrabold text-cyan-500/20 absolute top-6 right-6">03</span>
            <div className="h-12 w-12 rounded-2xl bg-cyan-600/10 flex items-center justify-center mb-6">
              <Download className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Export Professional Reports</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Click once to download formatted `.docx` Word proposals or PDF consent audit reports ready for client/council submission.
            </p>
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section id="calculator" className="max-w-5xl mx-auto px-6 py-16 z-10 relative">
        <div className="glass-panel p-10 md:p-14 rounded-3xl border-indigo-500/30">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">Enterprise Value</span>
            <h2 className="text-3xl font-extrabold text-white mb-3">Calculate Monthly Time Saved</h2>
            <p className="text-slate-400 text-xs">Estimate how many engineering, proposal, and consent audit hours ContextSkeleton saves your team.</p>
          </div>

          <div className="max-w-xl mx-auto bg-slate-950/80 p-8 rounded-2xl border border-slate-900 mb-8">
            <label className="flex justify-between text-xs font-bold text-slate-300 mb-3">
              <span>Tender Questionnaire Pages & Consent Specs Per Month:</span>
              <span className="text-violet-400 text-sm font-extrabold">{calcPages} Pages</span>
            </label>
            <input
              type="range"
              min="5"
              max="200"
              value={calcPages}
              onChange={(e) => setCalcPages(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500 mb-6"
            />

            <div className="grid grid-cols-2 gap-4 text-center border-t border-slate-900 pt-6">
              <div>
                <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Manual Evaluation Time</span>
                <span className="text-2xl font-extrabold text-slate-400">{calcPages * 1.5} Hours</span>
              </div>
              <div>
                <span className="text-violet-400 text-[10px] font-bold uppercase block mb-1">With ContextSkeleton</span>
                <span className="text-2xl font-extrabold text-emerald-400">{Math.round(calcPages * 0.12)} Hours</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <span className="inline-block text-xs font-bold text-slate-300 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-emerald-400">
              ⚡ You save approx. {Math.round(calcPages * 1.38)} hours of team productivity every month!
            </span>
          </div>
        </div>
      </section>

      {/* COMMERCIAL PRICING SECTION */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 z-10 relative">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-2">Transparent Subscriptions</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">Commercial Pricing Plans</h2>
          <p className="text-slate-400 mt-3 text-sm">One subscription unlocks all products & tools across the platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Evaluation */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between border-slate-900">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Evaluation</span>
              <h3 className="text-2xl font-bold text-white mb-3">Free Trial</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-500 font-semibold">forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-400 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" /> 10 Free Platform Generations
                </li>
                <li className="flex items-center gap-2 text-slate-400 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" /> RFP Engine & Building Consent Auditor
                </li>
                <li className="flex items-center gap-2 text-slate-400 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" /> Vector document indexing
                </li>
                <li className="flex items-center gap-2 text-slate-400 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" /> Microsoft Word exporter
                </li>
              </ul>
            </div>
            <Link
              id="pricing-free"
              href="/auth?mode=register"
              className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-xs py-3.5 px-4 rounded-xl transition cursor-pointer"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Professional Plan (Popular) */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between border-violet-500/40 relative overflow-hidden shadow-2xl shadow-violet-500/10">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest block mb-2">Growth & Sales</span>
              <h3 className="text-2xl font-bold text-white mb-3">Professional Plan</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$499</span>
                <span className="text-xs text-slate-400 font-semibold">/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" /> Unlimited Platform Access
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" /> Full Building Consent & RFP Exporter
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" /> Isolated Turso Cloud Vector Storage
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" /> Priority Gemini 2.5 API lines
                </li>
              </ul>
            </div>
            <Link
              id="pricing-pro"
              href="/auth?mode=register"
              className="w-full inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition cursor-pointer shadow-lg shadow-violet-500/20"
            >
              Get Started Now
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between border-slate-900">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-2">Large Enterprise</span>
              <h3 className="text-2xl font-bold text-white mb-3">Enterprise Custom</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" /> Dedicated Turso / Postgres Cluster
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" /> Custom SAML / Okta / Azure AD SSO
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" /> Custom LLM model fine-tuning
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" /> 99.9% SLA & Dedicated Support
                </li>
              </ul>
            </div>
            <a
              href="#contact"
              className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-xs py-3.5 px-4 rounded-xl transition cursor-pointer"
            >
              Contact Enterprise Sales
            </a>
          </div>
        </div>
      </section>

      {/* ENTERPRISE CONTACT SECTION */}
      <section id="contact" className="max-w-4xl mx-auto px-6 py-16 z-10 relative">
        <div className="glass-panel p-10 md:p-12 rounded-3xl border-violet-500/20 text-center">
          <div className="h-12 w-12 rounded-2xl bg-violet-600/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-6 w-6 text-violet-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">Have Custom Enterprise Requirements?</h2>
          <p className="text-slate-400 text-xs max-w-xl mx-auto mb-8">
            Contact our engineering team for custom deployment options, private cloud VPC setups, or dedicated data security compliance reviews.
          </p>
          <a
            href="mailto:contact@contextskeleton.com?subject=Enterprise%20AI%20Platform%20Inquiry"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs py-3.5 px-8 rounded-xl transition cursor-pointer shadow-lg shadow-violet-500/10"
          >
            Email Enterprise Engineering
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-900/80 text-slate-500 text-xs z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-xl bg-violet-600 flex items-center justify-center font-extrabold text-white text-xs">
              C
            </div>
            <span className="font-bold text-white text-sm">ContextSkeleton</span>
            <span className="text-slate-600">|</span>
            <span>&copy; {new Date().getFullYear()} ContextSkeleton. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-xs">
            <Link href="/auth" className="hover:text-white transition">Platform Login</Link>
            <a href="#services" className="hover:text-white transition">Products &amp; Services</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="mailto:contact@contextskeleton.com" className="hover:text-white transition">Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
