'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { FileText, Plus, Loader2, ArrowRight, ClipboardList, Trash2 } from 'lucide-react';

interface ProjectInfo {
  id: string;
  name: string;
  created_at: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [projectName, setProjectName] = useState('');
  const [questionsInput, setQuestionsInput] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/rfp');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/rfp?projectId=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error('Delete project failed:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !questionsInput.trim()) return;

    setCreating(true);
    setError('');

    // Split questions input by newlines and filter out empty items
    const questions = questionsInput
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    try {
      const res = await fetch('/api/rfp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_project',
          name: projectName,
          questions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create project');
      }

      // Navigate to project workspace
      router.push(`/projects/${data.projectId}`);
    } catch (err: any) {
      setError(err.message || 'Error creating RFP project');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans">
      <Sidebar />

      <main className="flex-1 pl-80 min-h-screen relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-8 py-12 z-10 relative">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-white">RFP Projects</h1>
            <p className="text-slate-400 mt-2 text-sm">
              Create and manage bid proposal questionnaires. Upload the requirements list, run automated drafting, and review answers.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Create Project Form */}
            <div className="lg:col-span-1">
              <div className="glass-panel p-6 rounded-3xl sticky top-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-violet-400" />
                  New RFP Project
                </h2>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <label htmlFor="projectName" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Tender Name
                    </label>
                    <input
                      id="projectName"
                      type="text"
                      required
                      placeholder="e.g. Wellington Council IT Bid"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-white placeholder-slate-600 text-xs"
                    />
                  </div>

                  <div>
                    <label htmlFor="questions" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Questionnaires (One Per Line)
                    </label>
                    <textarea
                      id="questions"
                      required
                      rows={8}
                      placeholder="e.g. Describe your data security standards.&#10;What is your customer support SLA?&#10;List your team key credentials."
                      value={questionsInput}
                      onChange={(e) => setQuestionsInput(e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-white placeholder-slate-600 text-xs font-mono resize-none"
                    />
                  </div>

                  <button
                    id="submit-project"
                    type="submit"
                    disabled={creating}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs py-3 px-4 rounded-xl transition cursor-pointer"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      <>
                        Create Project
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: List of RFP Projects */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-panel rounded-3xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-slate-400" />
                  Active Bids ({projects.length})
                </h2>

                {loading ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="h-6 w-6 text-slate-500 animate-spin" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-sm">
                    No active RFP projects found. Submit the form on the left to start your first bid compilation.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => router.push(`/projects/${proj.id}`)}
                        className="glass-panel p-5 rounded-2xl flex justify-between items-center group cursor-pointer hover:border-violet-500/40 hover:bg-slate-900/35 transition-all"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
                            <FileText className="h-5 w-5 text-violet-400" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block group-hover:text-violet-400 transition-colors">
                              {proj.name}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-1">
                              Created on {new Date(proj.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleDeleteProject(e, proj.id)}
                            className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-xl transition cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <ArrowRight className="h-4.5 w-4.5 text-slate-500 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
