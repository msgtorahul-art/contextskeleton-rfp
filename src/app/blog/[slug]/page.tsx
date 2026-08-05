import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/blogs';
import { ArrowLeft, Calendar, Clock, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} | ContextSkeleton Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://contextskeleton.com/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      url: `https://contextskeleton.com/blog/${post.slug}`,
      siteName: "ContextSkeleton",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishDate,
      authors: [post.author],
      images: [
        {
          url: "https://contextskeleton.com/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["https://contextskeleton.com/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Navbar with logo pointing to homepage */}
        <nav className="flex justify-between items-center mb-8 border-b border-slate-900 pb-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-white text-lg group-hover:scale-105 transition">
              C
            </div>
            <div>
              <span className="font-bold text-white text-base block group-hover:text-violet-400 transition">ContextSkeleton</span>
              <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block -mt-1">Unified AI Product Suite</span>
            </div>
          </Link>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to All Articles
          </Link>
        </nav>

        <header className="mb-10 border-b border-slate-900 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {post.category}
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-violet-400" /> {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-500" /> {post.publishDate}
            </span>
          </div>
        </header>

        {/* ARTICLE BODY */}
        <article
          className="glass-panel p-8 md:p-12 rounded-3xl border-slate-800 text-slate-300 text-sm leading-relaxed space-y-6 mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* PRODUCT CTA BOX */}
        <div className="glass-panel p-8 rounded-3xl border-violet-500/40 bg-gradient-to-r from-violet-950/40 to-indigo-950/40 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold">
            <Sparkles className="h-4 w-4" /> {post.product}
          </div>
          <h2 className="text-2xl font-bold text-white">Experience {post.product} Live</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Test our autonomous grounded AI engine in action. Get 10 free evaluation credits upon registration.
          </p>
          <Link
            href={post.ctaHref}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs py-3 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-violet-500/20"
          >
            {post.ctaText} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
