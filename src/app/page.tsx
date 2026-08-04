'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, Download, 
  FileText, Database, Layers, Cpu, Check, HelpCircle, Mail, Globe, Lock
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'rfp' | 'knowledge' | 'skeleton' | 'enterprise'>('rfp');
  const [calcPages, setCalcPages] = useState(25);

  const products = [
    {
      id: 'rfp',
      title: 'Autonomous RFP & Tender Engine',
      badge: 'Flagship Product',
      icon: FileText,
      tagline: 'Draft 100-page tender questionnaires in minutes, grounded in verified facts.',
      description: 'Shred incoming RFPs, RFIs, and security questionnaires automatically. ContextSkeleton matches every question against your company’s historical proposals and security docs, generating grounded answers with exact source citations.',
      features: [
        'Automatic PDF & DOCX questionnaire shredding',
        'Grounded RAG answers with source citations',
        'One-click Microsoft Word (.docx) proposal export',
        'Human-in-the-loop reviewer workspace',
      ],
    },
    {
      id: 'knowledge',
      title: 'Enterprise Vector Knowledge Base',
      badge: 'Core Infrastructure',
      icon: Database,
      tagline: 'Turn company PDFs, brochures, and compliance policies into searchable intelligence.',
      description: 'Drag and drop your company’s technical brochures, past bids, ISO certificates, and SLAs. Our high-performance vector engine chunks and embeds your documents semantically for instant RAG retrieval.',
      features: [
        'Semantic vector similarity search',
        'Multi-tenant document security isolation',
        'Supports PDF, DOCX, and TXT formats',
        'Automatic document chunking and vector indexing',
      ],
    },
    {
      id: 'skeleton',
      title: 'LLM Token Skeletonizer',
      badge: 'Developer Tooling',
      icon: Layers,
      tagline: 'Compress codebases and documents by 90%+ without losing structural context.',
      description: 'Extract structural AST signatures, function definitions, and document skeletons. Feed massive codebases or technical specifications into LLMs while keeping token costs near zero.',
      features: [
        'AST-level code & document folding',
        'Up to 92% reduction in prompt token usage',
        'Built-in MCP server integration for AI agents',
        'Preserves 100% structural context for LLM logic',
      ],
    },
    {
      id: 'enterprise',
      title: 'Custom RAG & AI Integration',
      badge: 'B2B Services',
      icon: Cpu,
      tagline: 'Tailored AI proposal pipelines and private cloud database deployments.',
      description: 'For enterprise procurement teams requiring dedicated infrastructure, custom LLM fine-tuning, private Turso/PostgreSQL database clusters, and custom SAML/SSO authentication.',
      features: [
        'Dedicated Turso / Postgres private database cluster',
        'Custom fine-tuned LLM models (Gemini / Claude)',
        'SAML, Okta, and Azure AD SSO integration',
        '99.9% uptime SLA and dedicated support',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Dynamic Background Blur Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-20 relative border-b border-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-violet-500/20">
            C
          </div>
          <div>
            <span className="font-extrabold text-white text-lg tracking-tight block">ContextSkeleton</span>
            <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block -mt-1">Autonomous AI Hub</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
          <a href="#products" className="hover:text-white transition">Products & Services</a>
          <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
          <a href="#calculator" className="hover:text-white transition">ROI Calculator</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            id="nav-login"
            href="/auth"
            className="inline-flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition cursor-pointer"
          >
            Log In
          </Link>
          <Link
            id="nav-signup"
            href="/auth?mode=register"
            className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition cursor-pointer shadow-lg shadow-violet-500/10"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center z-10 relative">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 px-4 py-1.5 rounded-full text-xs font-semibold mb-8">
          <Sparkles className="h-4 w-4" /> Next-Generation B2B RFP Automation & Vector RAG Engine
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight max-w-5xl mx-auto">
          Automate Proposal Drafting.<br />
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Win Enterprise Bids 92% Faster.
          </span>
        </h1>

        <p className="text-slate-400 mt-6 text-lg max-w-3xl mx-auto leading-relaxed font-normal">
          ContextSkeleton connects your company’s past proposals, security policies, and technical brochures into a grounded AI engine that automatically drafts compliant tender responses and exports formatted Microsoft Word documents.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            id="hero-register"
            href="/auth?mode=register"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-sm py-4 px-9 rounded-2xl transition shadow-xl shadow-violet-500/20 cursor-pointer"
          >
            Start Free Trial (10 Free Credits)
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#products"
            className="inline-flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-sm py-4 px-9 rounded-2xl transition cursor-pointer"
          >
            Explore Products & Services
          </a>
        </div>

        {/* Highlight Metrics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-900/80 pt-10">
          <div>
            <span className="text-3xl font-extrabold text-white block">92%</span>
            <span className="text-xs text-slate-500 font-medium">Faster Proposal Completion</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white block">100%</span>
            <span className="text-xs text-slate-500 font-medium">Fact-Grounded (Zero Hallucinations)</span>
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
      </header>

      {/* PRODUCTS & SERVICES SECTION */}
      <section id="products" className="max-w-6xl mx-auto px-6 py-20 z-10 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">Our Products & Services</h2>
          <p className="text-slate-400 mt-3 text-sm">Everything your sales and compliance teams need to win tenders effortlesly.</p>
        </div>

        {/* Product Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {products.map((p) => {
            const Icon = p.icon;
            const active = activeTab === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id as any)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {p.title}
              </button>
            );
          })}
        </div>

        {/* Active Product Details Display */}
        {products
          .filter((p) => p.id === activeTab)
          .map((product) => {
            const Icon = product.icon;
            return (
              <div key={product.id} className="glass-panel p-8 md:p-12 rounded-3xl border-violet-500/20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="inline-block bg-violet-600/10 text-violet-400 border border-violet-500/20 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                    {product.badge}
                  </span>
                  <h3 className="text-3xl font-extrabold text-white mb-3">{product.title}</h3>
                  <p className="text-violet-300 font-semibold text-sm mb-4 leading-relaxed">{product.tagline}</p>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{product.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/auth?mode=register"
                    className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs py-3 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-violet-500/10"
                  >
                    Try {product.title}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-slate-500 text-[10px]">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live AI Engine Console
                    </span>
                    <span>v2.4 Production</span>
                  </div>
                  {product.id === 'rfp' && (
                    <div className="space-y-3">
                      <p className="text-violet-400">&gt; Question: "What are your data encryption standards at rest?"</p>
                      <p className="text-slate-400">&gt; Searching vector index (Turso Cloud)... Found 3 source matches.</p>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-emerald-300">
                        "All customer data is encrypted at rest using AES-256 GCM... [Source: Security_Policy_2026.pdf]"
                      </div>
                      <p className="text-slate-500">&gt; Document exported: Proposal_Security_Response.docx ✓</p>
                    </div>
                  )}
                  {product.id === 'knowledge' && (
                    <div className="space-y-3">
                      <p className="text-indigo-400">&gt; Uploading: Company_SLA_Brochure.pdf (4.2 MB)</p>
                      <p className="text-slate-400">&gt; Extracting text via PDFParse v2... 18 pages extracted.</p>
                      <p className="text-slate-400">&gt; Chunking text into 42 semantic blocks.</p>
                      <p className="text-emerald-400">&gt; Generated 42 embeddings via gemini-embedding-2. Stored in Turso.</p>
                    </div>
                  )}
                  {product.id === 'skeleton' && (
                    <div className="space-y-3">
                      <p className="text-cyan-400">&gt; Skeletonizing codebase: /src/app/api/rfp/route.ts</p>
                      <p className="text-slate-400">&gt; Original tokens: 14,200 tokens</p>
                      <p className="text-emerald-400">&gt; Folded AST skeleton: 1,120 tokens (-92.1% reduction)</p>
                      <p className="text-slate-300">&gt; Ready for LLM prompt context injection.</p>
                    </div>
                  )}
                  {product.id === 'enterprise' && (
                    <div className="space-y-3">
                      <p className="text-amber-400">&gt; Provisioning Enterprise Private Cluster...</p>
                      <p className="text-slate-400">&gt; Database: Turso Isolated Node (aws-ap-south-1)</p>
                      <p className="text-slate-400">&gt; SSO Integration: Okta SAML v2 configured.</p>
                      <p className="text-emerald-400">&gt; SLA Uptime Guarantee: 99.9% Active.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">How ContextSkeleton Works</h2>
          <p className="text-slate-400 mt-3 text-sm">Three seamless steps to automate your entire tender proposal workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl relative">
            <span className="text-5xl font-extrabold text-violet-500/20 absolute top-6 right-6">01</span>
            <div className="h-12 w-12 rounded-2xl bg-violet-600/10 flex items-center justify-center mb-6">
              <Database className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Build Your Knowledge Base</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Upload past RFP bids, security policies, standard SLAs, and product specs. The engine chunks and indexes them into an encrypted vector database.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl relative">
            <span className="text-5xl font-extrabold text-indigo-500/20 absolute top-6 right-6">02</span>
            <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Run Grounded AI Drafting</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Paste incoming tender questionnaires. The AI retrieves exact matching facts from your knowledge base and drafts authoritative responses with citations.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl relative">
            <span className="text-5xl font-extrabold text-cyan-500/20 absolute top-6 right-6">03</span>
            <div className="h-12 w-12 rounded-2xl bg-cyan-600/10 flex items-center justify-center mb-6">
              <Download className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Export to Microsoft Word</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Review and approve generated answers in our side-by-side workspace, then export a perfectly formatted `.docx` Word proposal ready for client submission.
            </p>
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR SECTION */}
      <section id="calculator" className="max-w-5xl mx-auto px-6 py-16 z-10 relative">
        <div className="glass-panel p-10 md:p-14 rounded-3xl border-indigo-500/30">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white mb-3">Calculate Your Proposal Time Saved</h2>
            <p className="text-slate-400 text-xs">Estimate how many engineering and sales hours ContextSkeleton saves your company every month.</p>
          </div>

          <div className="max-w-xl mx-auto bg-slate-950/80 p-8 rounded-2xl border border-slate-900 mb-8">
            <label className="flex justify-between text-xs font-bold text-slate-300 mb-3">
              <span>Tender Questionnaire Pages Per Month:</span>
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
                <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Manual Response Time</span>
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
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">Commercial Pricing Plans</h2>
          <p className="text-slate-400 mt-3 text-sm">Clear, ROI-focused plans with zero hidden fees.</p>
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
                  <CheckCircle2 className="h-4 w-4 text-violet-500" /> 10 Free Proposal Generations
                </li>
                <li className="flex items-center gap-2 text-slate-400 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" /> Vector document indexing
                </li>
                <li className="flex items-center gap-2 text-slate-400 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" /> PDF & DOCX file uploads
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
                  <CheckCircle2 className="h-4 w-4 text-violet-400" /> Unlimited RFP Generations
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
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" /> 99.9% SLA & Dedicated Account Manager
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
            href="mailto:contact@contextskeleton.com?subject=Enterprise%20RFP%20Engine%20Inquiry"
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
            <a href="#products" className="hover:text-white transition">Products & Services</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="mailto:contact@contextskeleton.com" className="hover:text-white transition">Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
