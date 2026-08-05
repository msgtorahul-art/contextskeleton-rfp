'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, Download, 
  FileText, Database, Layers, Cpu, Check, Mail, Globe, Code, Key, ChevronRight, Lock, Loader2, Send
} from 'lucide-react';

export default function LandingPage() {
  const [calcPages, setCalcPages] = useState(30);

  // Support & Complaint Form state
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportSubject, setSupportSubject] = useState('Enterprise Sales & Support Inquiry');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportStatus, setSupportStatus] = useState('');

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupportLoading(true);
    setSupportStatus('');

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: supportName,
          email: supportEmail,
          subject: supportSubject,
          message: supportMessage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSupportStatus('SUCCESS');
        setSupportMessage('');
      } else {
        alert(data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Support submit error:', err);
      alert('An unexpected error occurred.');
    } finally {
      setSupportLoading(false);
    }
  };

  const mainServices = [
    {
      id: 'service-rfp',
      badge: 'B2B Tender Teams',
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
      ctaText: 'Launch RFP Workspace',
      ctaHref: '/projects',
    },
    {
      id: 'service-consent',
      badge: 'Architects & Builders',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      title: 'AI Building Consent Auditor',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      glowColor: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
      tagline: 'Audit blueprints and specs against NZBC Building Code prior to council submission.',
      highlights: [
        'Evaluates NZBC E2 (Moisture) & H1 (Energy)',
        'Flags critical RFI rejection risks',
        'Generates producer statement (PS1/PS3) lists',
        'Reduces council approval delays by weeks',
      ],
      ctaText: 'Launch Building Auditor',
      ctaHref: '/consent',
    },
    {
      id: 'service-security',
      badge: 'CISOs & SaaS Security',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      title: 'SOC2 & ISO 27001 Security Resolver',
      icon: Lock,
      iconColor: 'text-rose-400',
      glowColor: 'hover:border-rose-500/50 hover:shadow-rose-500/10',
      tagline: 'Automate vendor risk assessments grounded in SOC 2 policies and ISO security controls.',
      highlights: [
        'SOC 2 Type II & ISO 27001 control mapping',
        'Grounded policy section citations',
        'Confidence ratings & compliance status',
        'Single-click CSV / Excel spreadsheet export',
      ],
      ctaText: 'Launch Security Resolver',
      ctaHref: '/security-questionnaire',
    },
    {
      id: 'service-knowledge',
      badge: 'Vector Knowledge Hub',
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
      ctaText: 'Manage Knowledge Base',
      ctaHref: '/knowledge',
    },
    {
      id: 'service-skeleton',
      badge: 'Developers & AI Agents',
      icon: Layers,
      iconColor: 'text-cyan-400',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glowColor: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10',
      tagline: 'Compress codebases and documents by 90%+ without losing structural context.',
      highlights: [
        'AST-level structural AST code & doc folding',
        'Cuts prompt token costs by up to 92%',
        'Built-in MCP server for Claude & AI agents',
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
            <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block -mt-1">Unified AI Product Suite</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-400">
          <a href="#services" className="hover:text-white transition">Independent Products</a>
          <a href="#workflow" className="hover:text-white transition">How It Works</a>
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

      {/* HERO SECTION WITH SEPARATED PRODUCTS SHOWCASE (ABOVE THE FOLD) */}
      <header className="max-w-7xl mx-auto px-6 pt-12 pb-16 z-10 relative">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
            <Sparkles className="h-4 w-4" /> Dedicated Autonomous AI Products
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Specialized Autonomous AI.<br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Independent Solutions for Every User.
            </span>
          </h1>

          <p className="text-slate-400 mt-4 text-base max-w-2xl mx-auto leading-relaxed">
            Select your dedicated product workspace below. Each solution operates independently with specialized compliance engines and custom data pipelines.
          </p>
        </div>

        {/* INDEPENDENT PRODUCTS GRID */}
        <section id="services" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <span className="text-3xl font-extrabold text-white block">.docx & .csv</span>
            <span className="text-xs text-slate-500 font-medium">Word & Excel Exporters</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white block">$0/mo</span>
            <span className="text-xs text-slate-500 font-medium">Free Evaluation Tier</span>
          </div>
        </div>
      </section>

      {/* COMMERCIAL PRICING SECTION - ALL 4 PRODUCTS DISPLAYED */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 z-10 relative">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-2">Transparent Subscriptions</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">Commercial Product Pricing</h2>
          <p className="text-slate-400 mt-3 text-sm">Select the exact product tier tailored for your business needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. RFP Engine Pricing */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between border-violet-500/40 relative overflow-hidden shadow-xl shadow-violet-500/10">
            <div className="absolute top-0 right-0 bg-violet-600 text-white text-[8px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Product #1
            </div>

            <div>
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest block mb-1">B2B Tender Proposals</span>
              <h3 className="text-xl font-bold text-white mb-2">RFP Pro Engine</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-white">$499</span>
                <span className="text-xs text-slate-400 font-semibold">/ month</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                <li className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" /> Unlimited Proposal Generation
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" /> Word (.docx) Document Export
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" /> Grounded Fact Citation Engine
                </li>
              </ul>
            </div>
            <Link
              href="/auth?mode=register"
              className="w-full inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs py-3 px-4 rounded-xl transition cursor-pointer"
            >
              Get RFP Pro ($499/mo)
            </Link>
          </div>

          {/* 2. Building Consent Auditor Pricing */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between border-emerald-500/40 relative overflow-hidden shadow-xl shadow-emerald-500/10">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[8px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Product #2
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Architects & Builders</span>
              <h3 className="text-xl font-bold text-white mb-2">Consent Auditor Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-white">$750</span>
                <span className="text-xs text-slate-400 font-semibold">/ month</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                <li className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Unlimited NZBC Pre-Audits
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> NZBC E2, H1, B1, G12 Checkers
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Producer Statements (PS1/PS3)
                </li>
              </ul>
            </div>
            <Link
              href="/auth?mode=register"
              className="w-full inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3 px-4 rounded-xl transition cursor-pointer"
            >
              Get Consent Pro ($750/mo)
            </Link>
          </div>

          {/* 3. Security Questionnaire Pricing */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between border-rose-500/40 relative overflow-hidden shadow-xl shadow-rose-500/10">
            <div className="absolute top-0 right-0 bg-rose-600 text-white text-[8px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Product #3
            </div>

            <div>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block mb-1">CISOs & SaaS Vendors</span>
              <h3 className="text-xl font-bold text-white mb-2">Security Resolver Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-white">$499</span>
                <span className="text-xs text-slate-400 font-semibold">/ month</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                <li className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0" /> Unlimited SOC 2 & ISO 27001 Audits
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0" /> CSV / Excel Spreadsheet Export
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0" /> Confidence Rating & Control Mapping
                </li>
              </ul>
            </div>
            <Link
              href="/auth?mode=register"
              className="w-full inline-flex items-center justify-center bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs py-3 px-4 rounded-xl transition cursor-pointer"
            >
              Get Security Pro ($499/mo)
            </Link>
          </div>

          {/* 4. Vector Knowledge Base Pricing */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between border-indigo-500/40 relative overflow-hidden shadow-xl shadow-indigo-500/10">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[8px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Product #4
            </div>

            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Knowledge Infrastructure</span>
              <h3 className="text-xl font-bold text-white mb-2">Vector Storage Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-white">$299</span>
                <span className="text-xs text-slate-400 font-semibold">/ month</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                <li className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" /> Isolated Turso Vector DB Storage
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" /> Automatic PDF/DOCX Parsing
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" /> High-speed Semantic Search API
                </li>
              </ul>
            </div>
            <Link
              href="/auth?mode=register"
              className="w-full inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs py-3 px-4 rounded-xl transition cursor-pointer"
            >
              Get Vector Pro ($299/mo)
            </Link>
          </div>
        </div>
      </section>

      {/* ENTERPRISE CONTACT SECTION */}
      <section id="contact" className="max-w-4xl mx-auto px-6 py-16 z-10 relative">
        <div className="glass-panel p-10 md:p-12 rounded-3xl border-violet-500/20 text-center">
          <div className="h-12 w-12 rounded-2xl bg-violet-600/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-6 w-6 text-violet-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">Customer Support, Enquiries & Complaints</h2>
          <p className="text-slate-400 text-xs max-w-xl mx-auto mb-8">
            Have questions, complaints, or custom enterprise requirements? Send a message directly to <strong>support@contextskeleton.com</strong>.
          </p>

          {supportStatus === 'SUCCESS' ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold">
              ✓ Thank you! Your message has been dispatched directly to our official support team at <strong>support@contextskeleton.com</strong>.
            </div>
          ) : (
            <form onSubmit={handleSupportSubmit} className="max-w-lg mx-auto text-left space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={supportName}
                    onChange={(e) => setSupportName(e.target.value)}
                    placeholder="Rahul Gautam"
                    className="w-full glass-input rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full glass-input rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subject</label>
                <select
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
                >
                  <option value="Enterprise Sales & Support Inquiry">Enterprise Sales & Support Inquiry</option>
                  <option value="Building Consent Auditor Question">Building Consent Auditor Question</option>
                  <option value="Customer Complaint / Feedback">Customer Complaint / Feedback</option>
                  <option value="Billing & Subscription Issue">Billing & Subscription Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Type your message, complaint, or enquiry here..."
                  className="w-full glass-input rounded-xl p-3 text-xs text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={supportLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition shadow-lg shadow-violet-500/10 cursor-pointer"
              >
                {supportLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message to support@contextskeleton.com
                  </>
                )}
              </button>
            </form>
          )}
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
            <a href="mailto:support@contextskeleton.com" className="hover:text-white transition">Support (support@contextskeleton.com)</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
