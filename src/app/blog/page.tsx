import React from 'react';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blogs';
import { BookOpen, ArrowRight, ArrowLeft, Sparkles, Clock, Calendar, User } from 'lucide-react';

export const metadata = {
  title: 'Blog & Articles | ContextSkeleton Enterprise AI',
  description: 'Technical articles, compliance guides, and AI product tutorials for ContextSkeleton.',
};

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Homepage
        </Link>

        <header className="mb-12 border-b border-slate-900 pb-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-semibold mb-4">
            <BookOpen className="h-4 w-4" /> Official Product Blog & Tech Guides
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            ContextSkeleton Blog
          </h1>
          <p className="text-slate-400 text-sm">
            Insights on B2B RFP Automation, NZBC Building Code Audits, SOC2 Compliance, and Vector RAG Infrastructure.
          </p>
        </header>

        {/* ARTICLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="glass-panel p-6 rounded-3xl flex flex-col justify-between border-slate-800 hover:border-violet-500/50 transition-all duration-300 group"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    {post.category}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white mb-3 group-hover:text-violet-400 transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="border-t border-slate-900/80 pt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                  <Calendar className="h-3 w-3" /> {post.publishDate}
                </span>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-violet-400 hover:text-violet-300 transition"
                >
                  Read Article <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
