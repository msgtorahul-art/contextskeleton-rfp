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

      {/* COMMERCIAL PRICING SECTION */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 z-10 relative">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-2">Independent Product Subscriptions</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">Commercial Product Plans</h2>
          <p className="text-slate-400 mt-3 text-sm">Select a plan tailored specifically for your organization's workflow.</p>
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
                  <CheckCircle2 className="h-4 w-4 text-violet-500" /> Access All 5 Product Workspaces
                </li>
                <li className="flex items-center gap-2 text-slate-400 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" /> Vector document indexing
                </li>
                <li className="flex items-center gap-2 text-slate-400 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" /> Word & Excel exporters
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

          {/* RFP Professional Plan */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between border-violet-500/40 relative overflow-hidden shadow-2xl shadow-violet-500/10">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              RFP Engine
            </div>

            <div>
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest block mb-2">Growth & Proposals</span>
              <h3 className="text-2xl font-bold text-white mb-3">RFP Pro Plan</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$499</span>
                <span className="text-xs text-slate-400 font-semibold">/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" /> Unlimited RFP Proposal Drafts
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" /> Full Microsoft Word (.docx) Exporter
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
              Get Started ($499/mo)
            </Link>
          </div>

          {/* AI Building Consent Professional Plan */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between border-emerald-500/40 relative overflow-hidden shadow-2xl shadow-emerald-500/10">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[9px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              Consent Auditor
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-2">Architectural & Builders</span>
              <h3 className="text-2xl font-bold text-white mb-3">Consent Auditor Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$750</span>
                <span className="text-xs text-slate-400 font-semibold">/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Unlimited NZBC Pre-Consent Audits
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> NZBC E2, H1, B1, G12 Clause Checkers
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Critical RFI Risk Warnings & Producer Statements
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> PDF Pre-Submission Audit Exporter
                </li>
              </ul>
            </div>
            <Link
              id="pricing-consent"
              href="/auth?mode=register"
              className="w-full inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Get Started ($750/mo)
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
