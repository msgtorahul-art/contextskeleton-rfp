'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Database, FileText, ShieldCheck, Layers, LogOut, Loader2, Sparkles, CreditCard, Globe, Lock } from 'lucide-react';

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
      router.refresh();
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
    { name: 'Vector Knowledge Base', href: '/knowledge', icon: Database },
    { name: 'Token Skeletonizer', href: '/skeletonizer', icon: Layers },
    { name: 'Public Site & Pricing', href: '/?preview=true', icon: Globe },
  ];

  return (
    <aside className="w-80 h-screen fixed top-0 left-0 bg-slate-950 border-r border-slate-900 flex flex-col justify-between p-6 z-30">
      <div className="space-y-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-violet-500/20">
            C
          </div>
          <div>
            <span className="font-bold text-white text-lg block tracking-tight">ContextSkeleton</span>
            <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block -mt-1">Unified AI Platform</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3.5 py-3 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-violet-600/10 text-violet-400 border-l-2 border-violet-500 pl-3'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Account & Billing */}
      <div className="space-y-4">
        {/* Paywall/Credit status card */}
        {user && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Account status</span>
              {user.subscription_status === 'active' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Sparkles className="h-2.5 w-2.5" /> PRO
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Free Trial
                </span>
              )}
            </div>
            
            <div className="mb-3">
              {user.subscription_status === 'active' ? (
                <span className="text-sm font-bold text-white block">Unlimited Platform Access</span>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white">{user.credits}</span>
                  <span className="text-xs text-slate-400 font-semibold">credits remaining</span>
                </div>
              )}
            </div>

            {user.subscription_status !== 'active' && (
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={loadingBilling}
                className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition cursor-pointer"
              >
                {loadingBilling ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="h-3.5 w-3.5" />
                    Upgrade to PRO ($499/mo)
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Profile details */}
        {user && (
          <div className="flex items-center justify-between px-2 pt-2 border-t border-slate-900">
            <div className="overflow-hidden mr-2">
              <span className="text-xs font-bold text-white block truncate">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition hover:bg-rose-500/5 cursor-pointer"
              title="Log Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
