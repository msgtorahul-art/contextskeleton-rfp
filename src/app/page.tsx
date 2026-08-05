'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, Download, 
  FileText, Database, Layers, Cpu, Check, Mail, Globe, Code, Key, ChevronRight, Lock, Loader2, Send, ShieldAlert, BookOpen, Activity, Calculator, Leaf, Stethoscope, KeyRound, DollarSign, HardHat, CheckSquare, Briefcase
} from 'lucide-react';

export default function LandingPage() {
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
      id: 'service-fda',
      badge: 'MedTech & Biotech',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'FDA 510(k) MedTech Resolver',
      icon: Activity,
      iconColor: 'text-pink-400',
      glowColor: 'hover:border-pink-500/50 hover:shadow-pink-500/10',
      tagline: 'Automate FDA 510(k) predicate device substantial equivalence and ISO 13485 audits.',
      highlights: [
        '21 CFR Part 820 design controls mapping',
        'ISO 14971 risk management hazard analysis',
        'Side-by-side predicate device comparison',
        'Single-click CSV audit spreadsheet export',
      ],
      ctaText: 'Launch MedTech Resolver',
      ctaHref: '/fda-510k',
    },
    {
      id: 'service-isoquality',
      badge: 'Aerospace & Quality QA',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      title: 'ISO 9001 & AS9100 Quality Auditor',
      icon: CheckSquare,
      iconColor: 'text-blue-400',
      glowColor: 'hover:border-blue-500/50 hover:shadow-blue-500/10',
      tagline: 'Audit non-conformances, CAPA root causes, and FAI reports against ISO 9001 and AS9100D standards.',
      highlights: [
        'AS9102 First Article Inspection (FAI) audits',
        'ISO 9001:2015 Clause 8.7 & 10.2 verification',
        'CAPA root cause & preventive action scorecards',
        'Single-click CSV quality audit export',
      ],
      ctaText: 'Launch Quality Auditor',
      ctaHref: '/iso-quality',
    },
    {
      id: 'service-soxaudit',
      badge: 'Internal Audit & Controllers',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      title: 'SOX 404 & SOC 1 Financial Auditor',
      icon: Briefcase,
      iconColor: 'text-emerald-400',
      glowColor: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
      tagline: 'Audit financial close controls, Segregation of Duties (SoD), and ITGC changes against PCAOB and SSAE 18 rules.',
      highlights: [
        'SOX Section 404 ICFR control testing',
        'Segregation of Duties (SoD) conflict detection',
        'ITGC change management & access reviews',
        'Single-click CSV financial audit export',
      ],
      ctaText: 'Launch SOX Auditor',
      ctaHref: '/sox-audit',
    },
    {
      id: 'service-rdtax',
      badge: 'Corporate Finance & Tax',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'AI R&D Tax Credit & Audit Analyzer',
      icon: Calculator,
      iconColor: 'text-amber-400',
      glowColor: 'hover:border-amber-500/50 hover:shadow-amber-500/10',
      tagline: 'Automate technical justifications and tax audit defense for IRD (15% RDTI), ATO, and IRS Section 41 claims.',
      highlights: [
        'Evaluates core systematic experimentation criteria',
        'Generates tax defense technical narratives',
        'Flags non-eligible operational activities',
        'Single-click CSV audit spreadsheet export',
      ],
      ctaText: 'Launch R&D Tax Analyzer',
      ctaHref: '/rd-tax',
    },
    {
      id: 'service-dpia',
      badge: 'DPOs & Enterprise Privacy',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'GDPR & HIPAA Data Privacy Resolver',
      icon: KeyRound,
      iconColor: 'text-indigo-400',
      glowColor: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10',
      tagline: 'Audit PII/PHI data flows and subprocessor DPAs against EU GDPR Article 35 (DPIA) and HIPAA rules.',
      highlights: [
        'EU GDPR Article 35 high-risk processing audit',
        'HIPAA § 164.308 administrative safeguards',
        'Subprocessor DPA & SCC transfer validation',
        'Single-click CSV privacy audit export',
      ],
      ctaText: 'Launch Privacy Resolver',
      ctaHref: '/privacy-dpia',
    },
    {
      id: 'service-aml',
      badge: 'FinTech & Banking Risk',
      badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      title: 'AML & KYC Risk Auditor',
      icon: DollarSign,
      iconColor: 'text-yellow-400',
      glowColor: 'hover:border-yellow-500/50 hover:shadow-yellow-500/10',
      tagline: 'Audit customer onboarding, PEP sanctions risk, and structuring patterns against FATF and BSA rules.',
      highlights: [
        'FATF Recommendations & BSA compliance',
        'PEP & OFAC sanctions screening',
        'Structuring & velocity detection',
        'Single-click CSV AML audit export',
      ],
      ctaText: 'Launch AML Auditor',
      ctaHref: '/aml-kyc',
    },
    {
      id: 'service-ehs',
      badge: 'EHS & Industrial Safety',
      badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      title: 'OSHA & EHS Safety Auditor',
      icon: HardHat,
      iconColor: 'text-orange-400',
      glowColor: 'hover:border-orange-500/50 hover:shadow-orange-500/10',
      tagline: 'Audit factory floor hazards, LOTO protocols, and MSDS chemical sheets against OSHA 1910 and ISO 45001 rules.',
      highlights: [
        'OSHA 1910.147 Lockout/Tagout verification',
        'MSDS & GHS hazard communication audit',
        'Machine guarding & PPE noise checks',
        'Single-click CSV safety audit export',
      ],
      ctaText: 'Launch EHS Safety Auditor',
      ctaHref: '/ehs-safety',
    },
    {
      id: 'service-trials',
      badge: 'Pharma & Clinical Operations',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      title: 'Clinical Trial Protocol Resolver',
      icon: Stethoscope,
      iconColor: 'text-rose-400',
      glowColor: 'hover:border-rose-500/50 hover:shadow-rose-500/10',
      tagline: 'Automate patient inclusion and exclusion criteria screening against FDA and EMA trial protocols.',
      highlights: [
        'Biomarker status & lab threshold validation',
        'Prior line therapy washout audit',
        'Organ function safety scorecards',
        'Single-click CSV eligibility export',
      ],
      ctaText: 'Launch Trial Resolver',
      ctaHref: '/clinical-trials',
    },
    {
      id: 'service-esg',
      badge: 'Enterprise ESG & Climate',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      title: 'AI ESG & CSRD Climate Auditor',
      icon: Leaf,
      iconColor: 'text-teal-400',
      glowColor: 'hover:border-teal-500/50 hover:shadow-teal-500/10',
      tagline: 'Audit Scope 1, 2, & 3 supply chain carbon footprints for EU CSRD, ISSB, and GRI reporting.',
      highlights: [
        'Scope 1, 2, & 3 GHG emissions calculator',
        'EU CSRD & ISSB framework mapping',
        'Actionable decarbonization recommendations',
        'Single-click CSV audit spreadsheet export',
      ],
      ctaText: 'Launch ESG Climate Auditor',
      ctaHref: '/esg',
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
      badge: 'Free Developer Tool',
      title: 'Token Skeletonizer',
      icon: Layers,
      iconColor: 'text-cyan-400',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glowColor: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10',
      tagline: 'Compress codebases and documents by 90%+ without losing structural context.',
      highlights: [
        'AST-level structural AST code & doc folding',
        'Cuts prompt token costs by up to 92%',
        'Built-in MCP server for Claude & AI agents',
        '100% Free Open Access Utility',
      ],
      ctaText: 'Try Token Skeletonizer (Free)',
      ctaHref: '/skeletonizer',
    },
  ];

  const pricingProducts = [
    { name: 'RFP Pro Engine', price: '$499', period: '/ month', tag: 'Product #1', badge: 'B2B Tender Proposals', color: 'violet', href: '/projects', features: ['Unlimited Proposal Generation', 'Microsoft Word (.docx) Export', 'Grounded Citation Engine'] },
    { name: 'Consent Auditor Pro', price: '$750', period: '/ month', tag: 'Product #2', badge: 'Architects & Builders', color: 'emerald', href: '/consent', features: ['Unlimited NZBC Pre-Audits', 'NZBC E2, H1, B1 Checkers', 'Producer Statements (PS1/PS3)'] },
    { name: 'Security Resolver Pro', price: '$499', period: '/ month', tag: 'Product #3', badge: 'CISOs & SaaS Vendors', color: 'rose', href: '/security-questionnaire', features: ['Unlimited SOC 2 & ISO 27001 Audits', 'CSV / Excel Spreadsheet Export', 'Control Mapping & Confidence Ratings'] },
    { name: 'FDA 510(k) MedTech Pro', price: '$999', period: '/ month', tag: 'Product #4', badge: 'MedTech & Biotech', color: 'pink', href: '/fda-510k', features: ['Unlimited 510(k) Predicate Audits', '21 CFR Part 820 Design Controls', 'CSV Predicate Audit Spreadsheet'] },
    { name: 'ISO Quality Pro', price: '$899', period: '/ month', tag: 'Product #5', badge: 'Aerospace & Quality QA', color: 'blue', href: '/iso-quality', features: ['Unlimited AS9100D & ISO 9001 Audits', 'AS9102 First Article Inspection Checks', 'CAPA Root Cause & CSV Export'] },
    { name: 'SOX Controls Pro', price: '$750', period: '/ month', tag: 'Product #6', badge: 'Internal Audit & Controllers', color: 'emerald', href: '/sox-audit', features: ['Unlimited SOX 404 & SOC 1 ICFR Audits', 'Segregation of Duties (SoD) Conflict Checks', 'CSV Financial Audit Spreadsheet Export'] },
    { name: 'R&D Tax Analyzer Pro', price: '$650', period: '/ month', tag: 'Product #7', badge: 'Corporate Finance & Tax', color: 'amber', href: '/rd-tax', features: ['Unlimited R&D Tax Credit Audits', 'NZ IRD (15% RDTI), ATO, & IRS Section 41', 'CSV Technical Defense Export'] },
    { name: 'ESG Climate Pro', price: '$599', period: '/ month', tag: 'Product #8', badge: 'Enterprise ESG & Climate', color: 'teal', href: '/esg', features: ['Unlimited Scope 1, 2, & 3 Carbon Audits', 'EU CSRD & ISSB Framework Mapping', 'CSV Carbon Audit Spreadsheet Export'] },
    { name: 'Clinical Trial Pro', price: '$850', period: '/ month', tag: 'Product #9', badge: 'Pharma & Clinical Ops', color: 'rose', href: '/clinical-trials', features: ['Unlimited Patient Eligibility Audits', 'FDA & EMA Biomarker Protocol Screening', 'CSV Eligibility Scorecard Export'] },
    { name: 'Privacy DPIA Pro', price: '$550', period: '/ month', tag: 'Product #10', badge: 'DPOs & Enterprise Privacy', color: 'indigo', href: '/privacy-dpia', features: ['Unlimited GDPR & HIPAA DPIA Audits', 'Subprocessor DPA & SCC Verification', 'CSV Privacy Audit Spreadsheet Export'] },
    { name: 'AML Risk Auditor Pro', price: '$799', period: '/ month', tag: 'Product #11', badge: 'FinTech & Banking Risk', color: 'yellow', href: '/aml-kyc', features: ['Unlimited AML & KYC Statutory Audits', 'FATF PEP & Sanctions Screening', 'CSV Risk Audit Spreadsheet Export'] },
    { name: 'EHS Safety Pro', price: '$499', period: '/ month', tag: 'Product #12', badge: 'EHS & Industrial Safety', color: 'orange', href: '/ehs-safety', features: ['Unlimited OSHA 1910 Site Audits', 'LOTO & MSDS Hazard Verification', 'CSV Safety Audit Spreadsheet Export'] },
    { name: 'Vector Storage Pro', price: '$299', period: '/ month', tag: 'Product #13', badge: 'Vector Knowledge Hub', color: 'indigo', href: '/knowledge', features: ['Unlimited Turso Cloud Vector Storage', 'PDF, DOCX & TXT Semantic Chunking', 'Multi-Tenant Enterprise Isolation'] },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Glow background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navigation Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center z-30 relative border-b border-slate-900/80 backdrop-blur-md bg-slate-950/80 sticky top-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-violet-500/20 group-hover:scale-105 transition duration-300">
            C
          </div>
          <div>
            <span className="font-extrabold text-white text-lg tracking-tight block group-hover:text-violet-400 transition">ContextSkeleton</span>
            <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block -mt-1">Unified AI Product Suite</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-400">
          <a href="#services" className="hover:text-white transition">Independent Products</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <Link href="/blog" className="hover:text-white transition font-semibold text-cyan-400">Blog &amp; SEO Guides</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
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

      {/* HERO SECTION WITH HIGH-CONTRAST VIBRANT AI NEURAL BRAIN BACKGROUND */}
      <header className="max-w-7xl mx-auto px-6 pt-12 pb-16 z-10 relative">
        <div className="relative text-center max-w-5xl mx-auto mb-16 p-10 md:p-16 rounded-3xl border border-cyan-500/40 overflow-hidden shadow-2xl shadow-cyan-500/20">
          {/* Vibrant high-contrast AI Neural Brain background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-85 pointer-events-none"
            style={{ backgroundImage: `url('/hero-bg.png')` }}
          />
          {/* Subtle vignette gradient overlay for high text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/90 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-violet-950/80 text-violet-300 border border-violet-500/40 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-md backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-cyan-400" /> Dedicated Autonomous AI Products
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
              Specialized Autonomous AI.<br />
              <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                Independent Solutions for Every User.
              </span>
            </h1>

            <p className="text-slate-200 mt-4 text-base max-w-2xl mx-auto leading-relaxed font-medium drop-shadow">
              Select your dedicated product workspace below. Each solution operates independently with specialized compliance engines and custom data pipelines.
            </p>
          </div>
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

      {/* COMMERCIAL PRICING SECTION - ALL 13 PAID COMMERCIAL PRODUCTS DISPLAYED */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 z-10 relative">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-2">Transparent Subscriptions</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">Commercial Product Pricing</h2>
          <p className="text-slate-400 mt-3 text-sm">Select the exact product tier tailored for your business needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingProducts.map((p, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-3xl flex flex-col justify-between border-slate-800 hover:border-violet-500/40 relative overflow-hidden shadow-xl transition duration-300">
              <div className="absolute top-0 right-0 bg-violet-600 text-white text-[8px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                {p.tag}
              </div>

              <div>
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest block mb-1">{p.badge}</span>
                <h3 className="text-xl font-bold text-white mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-extrabold text-white">{p.price}</span>
                  <span className="text-xs text-slate-400 font-semibold">{p.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {p.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-slate-200 text-xs font-medium">
                      <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/auth?mode=register"
                className="w-full inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs py-3 px-4 rounded-xl transition cursor-pointer"
              >
                Get {p.name} ({p.price}/mo)
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ENTERPRISE CONTACT SECTION */}
      <section id="contact" className="max-w-4xl mx-auto px-6 py-16 z-10 relative">
        <div className="glass-panel p-10 md:p-12 rounded-3xl border-violet-500/20 text-center">
          <div className="h-12 w-12 rounded-2xl bg-violet-600/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-6 w-6 text-violet-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">Customer Support, Enquiries &amp; Complaints</h2>
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
                  <option value="RFP & Tender Engine Inquiry">RFP & Tender Engine Inquiry</option>
                  <option value="Building Consent Auditor Question">Building Consent Auditor Question</option>
                  <option value="SOC 2 & ISO 27001 Security Question">SOC 2 & ISO 27001 Security Question</option>
                  <option value="FDA 510(k) MedTech Query">FDA 510(k) MedTech Query</option>
                  <option value="ISO 9001 & AS9100 Quality Query">ISO 9001 & AS9100 Quality Query</option>
                  <option value="SOX 404 Financial Control Query">SOX 404 Financial Control Query</option>
                  <option value="R&D Tax Credit Query">R&D Tax Credit Query</option>
                  <option value="ESG & CSRD Climate Inquiry">ESG & CSRD Climate Inquiry</option>
                  <option value="Clinical Trial Inquiry">Clinical Trial Inquiry</option>
                  <option value="GDPR & HIPAA Privacy DPIA Query">GDPR & HIPAA Privacy DPIA Query</option>
                  <option value="AML & KYC Risk Query">AML & KYC Risk Query</option>
                  <option value="OSHA & EHS Safety Query">OSHA & EHS Safety Query</option>
                  <option value="Vector Knowledge Base Support">Vector Knowledge Base Support</option>
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

      {/* FOOTER WITH PUBLIC LEGAL LINKS & BLOG LINK */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-900/80 text-slate-500 text-xs z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-7 w-7 rounded-xl bg-violet-600 flex items-center justify-center font-extrabold text-white text-xs group-hover:scale-105 transition">
              C
            </div>
            <span className="font-bold text-white text-sm group-hover:text-violet-400 transition">ContextSkeleton</span>
            <span className="text-slate-600">|</span>
            <span>&copy; {new Date().getFullYear()} ContextSkeleton. All rights reserved.</span>
          </Link>

          <div className="flex flex-wrap items-center gap-6 text-slate-400 text-xs">
            <Link href="/auth" className="hover:text-white transition">Platform Login</Link>
            <a href="#services" className="hover:text-white transition">Products &amp; Services</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <Link href="/blog" className="hover:text-white transition font-semibold text-cyan-400">Blog</Link>
            <Link href="/privacy" className="hover:text-white transition font-semibold text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition font-semibold text-slate-300">Terms of Service</Link>
            <a href="mailto:support@contextskeleton.com" className="hover:text-white transition">Support (support@contextskeleton.com)</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
