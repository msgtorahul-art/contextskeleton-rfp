'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, Download } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      title: "Grounded in Your Knowledge",
      description: "Our RAG vector engine indexes your past proposals, brochures, and compliance PDFs, generating drafts backed by verified company facts.",
      icon: ShieldCheck,
    },
    {
      title: "92% Faster Turnaround",
      description: "Shred incoming RFP questionnaires instantly. Automatically draft detailed responses, saving proposal managers hours of copy-pasting.",
      icon: Zap,
    },
    {
      title: "Direct Microsoft Word Export",
      description: "Download completed proposals as beautifully structured .docx documents matching corporate formatting guidelines.",
      icon: Download,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 relative overflow-hidden font-sans">
      {/* Background radial glow gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg">
            C
          </div>
          <span className="font-bold text-white text-lg">ContextSkeleton</span>
        </div>

        <Link
          id="nav-login"
          href="/auth"
          className="inline-flex items-center justify-center bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
        >
          Access Platform
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center z-10 relative">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6">
          <Sparkles className="h-3.5 w-3.5" /> Introducing Autonomous RAG Bidding
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight max-w-4xl mx-auto">
          Win More Bids.<br />
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Ground Your Proposals.
          </span>
        </h1>
        
        <p className="text-slate-400 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
          Stop copy-pasting answers from old tenders. ContextSkeleton automatically drafts compliant, grounded proposal answers directly from your private knowledge base.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            id="hero-start-trial"
            href="/auth?mode=register"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 px-8 rounded-xl transition shadow-lg shadow-violet-500/20 cursor-pointer"
          >
            Start Free Trial
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center gap-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold py-3.5 px-8 rounded-xl transition cursor-pointer"
          >
            View Pricing
          </a>
        </div>
      </header>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 z-10 relative">
        {features.map((feature, i) => (
          <div key={i} className="glass-panel p-8 rounded-3xl flex flex-col h-full justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-violet-600/10 flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Commercial Pricing Section */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20 z-10 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">Commercial Pricing Plans</h2>
          <p className="text-slate-400 mt-3 text-sm">Transparent, ROI-driven plans to secure more enterprise contracts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between border-slate-900">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Evaluation</span>
              <h3 className="text-2xl font-bold text-white mb-4">Free Trial</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-500 font-semibold">forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-400 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" /> 10 Free Drafting Credits
                </li>
                <li className="flex items-center gap-2 text-slate-400 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" /> Grounding vector indexing
                </li>
                <li className="flex items-center gap-2 text-slate-400 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" /> Drag-and-drop document upload
                </li>
              </ul>
            </div>
            <Link
              id="pricing-free"
              href="/auth"
              className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-xs py-3 px-4 rounded-xl transition cursor-pointer"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between border-violet-500/30 relative overflow-hidden">
            {/* Best value tag */}
            <div className="absolute top-0 right-0 bg-violet-600 text-white text-[9px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider">
              Popular
            </div>

            <div>
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-2">Growth & Scale</span>
              <h3 className="text-2xl font-bold text-white mb-4">Professional Plan</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$499</span>
                <span className="text-xs text-slate-400 font-semibold">/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" /> **Unlimited RFP Generations**
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" /> Full Microsoft Word Exporter (.docx)
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" /> Secure B2B tenant document isolation
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" /> Premium priority API lines
                </li>
              </ul>
            </div>
            <Link
              id="pricing-pro"
              href="/auth?mode=register"
              className="w-full inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs py-3 px-4 rounded-xl transition cursor-pointer shadow-lg shadow-violet-500/10"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-900/60 text-center text-slate-500 text-xs z-10 relative">
        &copy; {new Date().getFullYear()} ContextSkeleton. All rights reserved. Built for global B2B procurement compliance.
      </footer>
    </main>
  );
}
