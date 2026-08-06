'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialMode = searchParams.get('mode') || 'login';
  const queryEmail = searchParams.get('email') || '';
  const queryCode = searchParams.get('code') || '';
  const queryToken = searchParams.get('token') || '';

  const [mode, setMode] = useState<'login' | 'register' | 'verify' | 'forgot' | 'reset'>(initialMode as any);
  const [email, setEmail] = useState(queryEmail);
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState(queryCode);
  const [resetToken, setResetToken] = useState(queryToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (queryCode && queryEmail) {
      setMode('verify');
    } else if (queryToken) {
      setMode('reset');
    }
  }, [queryCode, queryEmail, queryToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Invalid email or password.');
          return;
        }

        setMessage('Login successful! Redirecting to workspace...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 300);

      } else if (mode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Registration failed.');
          return;
        }

        if (data.verificationRequired) {
          setMode('verify');
          setMessage('Account created! Please check your email for the 6-digit verification code and enter it below.');
        } else {
          setMessage('Account created successfully! Redirecting to workspace...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 300);
        }

      } else if (mode === 'verify') {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: verificationCode }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Invalid or expired verification code.');
          return;
        }

        setMessage('Email verified successfully! Entering workspace...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 300);

      } else if (mode === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to send password reset request.');
          return;
        }

        setMessage('Password reset instructions sent to your email address.');

      } else if (mode === 'reset') {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: resetToken, newPassword: password }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to reset password.');
          return;
        }

        setMessage('Password reset successful! Please sign in with your new password.');
        setMode('login');
      }
    } catch (err: any) {
      console.error('Form submit error:', err);
      setError('A temporary network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md z-10">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20 mb-4">
          <KeyRound className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">ContextSkeleton</h1>
        <p className="text-slate-400 mt-1 text-xs font-semibold uppercase tracking-wider">Enterprise AI Platform</p>
      </div>

      {/* Auth Card */}
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden border-slate-800 space-y-4">

        {/* Card header selector */}
        <div className="flex border-b border-slate-800 pb-3 pt-2">
          <button
            id="tab-login"
            type="button"
            onClick={() => { setMode('login'); setError(''); setMessage(''); }}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all ${mode === 'login' ? 'text-white border-b-2 border-violet-500' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Sign In
          </button>
          <button
            id="tab-register"
            type="button"
            onClick={() => { setMode('register'); setError(''); setMessage(''); }}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all ${mode === 'register' ? 'text-white border-b-2 border-violet-500' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Register
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}
        {message && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold leading-relaxed">
            {message}
          </div>
        )}

        {/* Dynamic Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode !== 'verify' && mode !== 'reset' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-xs"
                />
              </div>
            </div>
          )}

          {mode === 'verify' && (
            <div>
              <label className="block text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> 6-Digit Email Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-slate-900 border border-violet-500/40 rounded-xl py-3.5 px-4 text-center font-mono text-xl font-bold tracking-[8px] text-violet-300 focus:outline-none focus:border-violet-500"
              />
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'reset') && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {mode === 'reset' ? 'New Password' : 'Password'}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-violet-400 hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-xs"
                />
              </div>
            </div>
          )}

          <button
            id="submit-auth"
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition shadow-lg shadow-violet-500/10 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {mode === 'login' && 'Sign In'}
                {mode === 'register' && 'Send Verification Code'}
                {mode === 'verify' && 'Verify & Enter Platform'}
                {mode === 'forgot' && 'Send Password Reset Link'}
                {mode === 'reset' && 'Update Password'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {(mode === 'forgot' || mode === 'verify') && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-400 hover:text-white font-semibold"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      
      <Suspense fallback={
        <div className="text-slate-400 text-xs flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-violet-400" /> Loading authentication...
        </div>
      }>
        <AuthContent />
      </Suspense>
    </main>
  );
}
