'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { 
  Layers, Code, Copy, Check, Sparkles, Loader2, ArrowRight, FileCode, Key
} from 'lucide-react';

export default function TokenSkeletonizerPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [codeText, setCodeText] = useState('');
  const [language, setLanguage] = useState('TypeScript');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    skeletonText: string;
    originalTokens: number;
    skeletonTokens: number;
    tokenReductionPercent: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => res.ok && setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleSkeletonize = async () => {
    if (!codeText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/skeletonizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeText, language }),
      });

      const data = await res.json();
      if (data.skeletonText) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to skeletonize content');
      }
    } catch (err) {
      console.error('Skeletonize error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleCode = () => {
    setCodeText(`import { useState, useEffect } from 'react';
import { db } from '@/lib/db';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export function processUserProfile(user: UserProfile): boolean {
  // Heavy computation and validation logic
  const isValid = user.email.includes('@') && user.name.length > 2;
  if (!isValid) {
    console.error('Validation failed for user:', user.id);
    return false;
  }
  
  db.prepare('UPDATE users SET status = "active" WHERE id = ?').run(user.id);
  return true;
}

export class AnalyticsTracker {
  private apiKey: string;
  
  constructor(key: string) {
    this.apiKey = key;
  }

  public trackEvent(eventName: string, payload: Record<string, any>): void {
    fetch('https://api.analytics.com/v1/event', {
      method: 'POST',
      headers: { Authorization: this.apiKey },
      body: JSON.stringify({ eventName, payload, timestamp: Date.now() }),
    });
  }
}`);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.skeletonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {isLoggedIn && <Sidebar />}

      <main className={`flex-1 p-8 min-h-screen ${isLoggedIn ? 'pl-80' : 'max-w-6xl mx-auto'}`}>
        {/* Top bar for public visitors with logo pointing to homepage */}
        {!isLoggedIn && (
          <nav className="flex justify-between items-center mb-8 border-b border-slate-900 pb-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-white text-lg group-hover:scale-105 transition">
                C
              </div>
              <div>
                <span className="font-bold text-white text-base block group-hover:text-violet-400 transition">ContextSkeleton</span>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block -mt-1">Free Developer Tool</span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/auth" className="text-xs text-slate-400 hover:text-white font-semibold">Sign In</Link>
              <Link href="/auth?mode=register" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs py-2 px-4 rounded-xl">Start Free Trial</Link>
            </div>
          </nav>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Layers className="h-3.5 w-3.5" /> LLM Token Skeletonizer Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white">AST Structural Code & Doc Skeletonizer</h1>
            <p className="text-slate-400 text-xs mt-1">Compress codebases and technical specifications by up to 92% before feeding to AI models.</p>
          </div>

          <button
            onClick={loadSampleCode}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
          >
            <FileCode className="h-4 w-4 text-cyan-400" />
            Load Sample Code
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Source Code Input */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="h-4 w-4 text-cyan-400" />
                Source Code or Document Text
              </h2>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="TypeScript">TypeScript / JavaScript</option>
                <option value="Python">Python</option>
                <option value="Go">Go</option>
                <option value="Rust">Rust</option>
                <option value="Document">Technical Document Outline</option>
              </select>
            </div>

            <textarea
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              placeholder="Paste full source code files or specifications here..."
              className="w-full h-[450px] bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
            />

            <button
              onClick={handleSkeletonize}
              disabled={loading || !codeText.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Folding AST Structural Skeleton...
                </>
              ) : (
                <>
                  <Layers className="h-4 w-4" />
                  Generate Token Skeleton
                </>
              )}
            </button>
          </div>

          {/* Right Panel - Skeleton Result */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  Compressed Structural Skeleton
                </h2>

                {result && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-1.5 px-3 rounded-lg transition cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-400" /> Copy Skeleton
                      </>
                    )}
                  </button>
                )}
              </div>

              {result ? (
                <>
                  {/* Token Metrics Bar */}
                  <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-900 text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Original</span>
                      <span className="text-base font-extrabold text-slate-300">{result.originalTokens} tokens</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Skeletonized</span>
                      <span className="text-base font-extrabold text-emerald-400">{result.skeletonTokens} tokens</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-cyan-400 uppercase font-bold block">Reduction</span>
                      <span className="text-base font-extrabold text-cyan-400">-{result.tokenReductionPercent}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 font-mono text-xs text-cyan-300/90 h-[360px] overflow-y-auto leading-relaxed whitespace-pre">
                    {result.skeletonText}
                  </div>
                </>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                  <Layers className="h-10 w-10 text-slate-700 mb-3" />
                  <p className="text-xs">Paste code on the left to see the folded AST structural skeleton and token reduction.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
