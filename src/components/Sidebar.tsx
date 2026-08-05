'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Database, FileText, ShieldCheck, Layers, LogOut, Loader2, Sparkles, CreditCard, Globe, Lock, Activity, Calculator, Leaf, Stethoscope } from 'lucide-react';

interface UserInfo {
  email: string;
  subscription_status: string;
  credits: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loadingBilling, setLoadingBilling] = useState(false);

  const fetchUserInfo = useCallback(() => {
    fetch('/api/user/me')
      .then((res) => {
        if (res.status === 401) {
          router.push('/auth');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error('Error fetching user info:', err));
  }, [router]);

  useEffect(() => {
    fetchUserInfo();
    window.addEventListener('billing-update', fetchUserInfo);
    return () => {
      window.removeEventListener('billing-update', fetchUserInfo);
    };
  }, [fetchUserInfo]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleUpgrade = async () => {
    setLoadingBilling(true);
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Upgrade billing failed:', err);
    } finally {
      setLoadingBilling(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'RFP & Tender Engine', href: '/projects', icon: FileText },
    { name: 'Building Consent Auditor', href: '/consent', icon: ShieldCheck },
    { name: 'Security Questionnaire', href: '/security-questionnaire', icon: Lock },
    { name: 'FDA 510(k) MedTech Resolver', href: '/fda-510k', icon: Activity },
    { name: 'R&D Tax Audit Analyzer', href: '/rd-tax', icon: Calculator },
    { name: 'ESG & CSRD Climate Auditor', href: '/esg', icon: Leaf },
    { name: 'Clinical Trial Resolver', href: '/clinical-trials', icon: Stethoscope },
    { name: 'Vector Knowledge Base', href: '/knowledge', icon: Database },
    { name: 'Token Skeletonizer', href: '/skeletonizer', icon: Layers },
    { name: 'Public Site & Pricing', href: '/?preview=true', icon: Globe },
  ];

  return (
    <aside className="w-80 h-screen fixed top-0 left-0 bg-slate-950 border-r border-slate-900 flex flex-col justify-between p-6 z-30">
      <div className="space-y-8">
        {/* Brand Link to Homepage */}
        <Link href="/?preview=true" className="flex items-center gap-3 group cursor-pointer">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-violet-500/20 group-hover:scale-105 transition">
            C
          </div>
          <div>
            <span className="font-bold text-white text-lg block tracking-tight group-hover:text-violet-400 transition">ContextSkeleton</span>
            <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block -mt-1">Unified AI Platform</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-violet-400' : 'text-slate-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Subscription */}
      <div className="space-y-4 pt-6 border-t border-slate-900">
        {user && (
          <div className="glass-panel p-4 rounded-2xl border-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Account Status</span>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                user.subscription_status === 'ACTIVE' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {user.subscription_status === 'ACTIVE' ? 'Pro Plan' : 'Free Trial'}
              </span>
            </div>

            <div className="text-xs font-bold text-white truncate">
              {user.email}
            </div>

            {user.subscription_status !== 'ACTIVE' && (
              <div className="pt-1">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
                  <span>Evaluation Generations</span>
                  <span className="font-bold text-white">{user.credits} remaining</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (user.credits / 10) * 100)}%` }}
                  />
                </div>

                <button
                  onClick={handleUpgrade}
                  disabled={loadingBilling}
                  className="w-full mt-3 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition cursor-pointer shadow-lg shadow-violet-500/10 disabled:opacity-50"
                >
                  {loadingBilling ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" /> Upgrade to Pro
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
