import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | ContextSkeleton',
  description: 'The requested page could not be found on ContextSkeleton.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 text-center font-sans">
      <div className="glass-panel p-10 max-w-md w-full rounded-3xl border-slate-900 space-y-6 shadow-2xl">
        <div className="h-16 w-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mx-auto text-violet-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div>
          <span className="text-4xl font-extrabold text-white block mb-1">404</span>
          <h1 className="text-xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The page or product workspace you are looking for does not exist, has been moved, or has a broken link.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition shadow-lg shadow-violet-500/10 cursor-pointer"
          >
            <Home className="h-4 w-4" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
