'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Database, FileText, ArrowRight, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface Stats {
  documentsCount: number;
  projectsCount: number;
  totalQuestions: number;
  completedQuestions: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    documentsCount: 0,
    projectsCount: 0,
    totalQuestions: 0,
    completedQuestions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [docsRes, projectsRes] = await Promise.all([
          fetch('/api/knowledge'),
          fetch('/api/rfp'),
        ]);

        if (docsRes.status === 401 || projectsRes.status === 401) {
          router.push('/auth');
          return;
        }

        const docsData = await docsRes.json();
        const projectsData = await projectsRes.json();

        const docsCount = docsData.documents?.length || 0;
        const projectsCount = projectsData.projects?.length || 0;

        // Calculate question details
        let totalQ = 0;
        let completedQ = 0;

        if (projectsData.projects) {
          for (const proj of projectsData.projects) {
            const detailRes = await fetch(`/api/rfp?projectId=${proj.id}`);
            if (detailRes.ok) {
              const detailData = await detailRes.json();
              if (detailData.questions) {
                totalQ += detailData.questions.length;
                completedQ += detailData.questions.filter((q: any) => q.status === 'approved' || q.status === 'drafted').length;
              }
            }
          }
        }

        setStats({
          documentsCount: docsCount,
          projectsCount: projectsCount,
          totalQuestions: totalQ,
          completedQuestions: completedQ,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 pl-80 min-h-screen relative overflow-hidden">
        {/* Glowing header backgrounds */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-8 py-12 z-10 relative">
          {/* Top Welcome Header */}
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-white">Workspace Overview</h1>
              <p className="text-slate-400 mt-2 text-sm font-medium">
                Manage your proposal intelligence and monitor automated bid pipelines.
              </p>
            </div>
          </header>

          {/* Quick Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Knowledge Assets</span>
                <Database className="h-5 w-5 text-violet-400" />
              </div>
              <span className="text-3xl font-bold text-white block">{stats.documentsCount}</span>
              <span className="text-xs text-slate-500 mt-2 block">Company source files</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active RFPs</span>
                <FileText className="h-5 w-5 text-indigo-400" />
              </div>
              <span className="text-3xl font-bold text-white block">{stats.projectsCount}</span>
              <span className="text-xs text-slate-500 mt-2 block">Tender projects configured</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</span>
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-3xl font-bold text-white block">
                {stats.totalQuestions > 0 ? Math.round((stats.completedQuestions / stats.totalQuestions) * 100) : 0}%
              </span>
              <span className="text-xs text-slate-500 mt-2 block">
                {stats.completedQuestions} of {stats.totalQuestions} drafted
              </span>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Time Saved</span>
                <Clock className="h-5 w-5 text-cyan-400" />
              </div>
              <span className="text-3xl font-bold text-white block">
                {stats.completedQuestions * 2} hrs
              </span>
              <span className="text-xs text-slate-500 mt-2 block">Based on 2 hours average per bid page</span>
            </div>
          </section>

          {/* Action Panels */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-violet-600/10 flex items-center justify-center mb-6">
                  <Database className="h-6 w-6 text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Build Proposal Context</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Upload past bids, company security questionnaires, standard product brochures, and terms of service. The engine indexes your documents semantically for grounding responses.
                </p>
              </div>
              <a
                href="/knowledge"
                className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-semibold text-sm transition-all group-hover:translate-x-1 cursor-pointer"
              >
                Go to Knowledge Base
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Run RFP Compliance Drafts</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Initialize a new bid project. Shred incoming RFP documents, generate auto-drafts using AI grounding, and refine/approve answers in a collaborative reviewer environment.
                </p>
              </div>
              <a
                href="/projects"
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold text-sm transition-all group-hover:translate-x-1 cursor-pointer"
              >
                Manage RFP Projects
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </section>

          {/* Performance Chart / Value Metrics */}
          <section className="glass-panel p-8 rounded-3xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Enterprise ROI Performance</h3>
                <p className="text-slate-400 text-xs mt-1">Simulated metrics comparing manual versus AI proposal drafting</p>
              </div>
              <div className="inline-flex items-center gap-1 bg-violet-600/10 text-violet-400 border border-violet-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                <TrendingUp className="h-3.5 w-3.5" /> High Performance
              </div>
            </div>

            {/* Simulated bar graphs */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
                  <span>Proposal Response Time (lower is better)</span>
                  <span className="text-violet-400">92% faster with AI</span>
                </div>
                <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full" style={{ width: '8%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>AI: 3 hours</span>
                  <span>Manual: 36 hours</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
                  <span>Tender Win Rate Success (higher is better)</span>
                  <span className="text-emerald-400">+18% increase</span>
                </div>
                <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full" style={{ width: '78%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>With Grounded AI Engine: 78%</span>
                  <span>Historical Average: 60%</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
