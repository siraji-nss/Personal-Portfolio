'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { requestPasswordReset } from '@/app/actions/password';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await requestPasswordReset(fd);
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[4px] text-zinc-600 mb-3">Portfolio CMS</p>
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
        </div>

        {submitted ? (
          <div className="text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
              <Mail size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-300 mb-1">Check your inbox</p>
              <p className="text-xs text-zinc-500">
                If that email is registered, a reset link has been sent. It expires in 1 hour.
              </p>
            </div>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ArrowLeft size={12} /> Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-zinc-500 text-center mb-2">
              Enter your admin email and we&apos;ll send you a reset link.
            </p>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Send Reset Link
            </button>

            <Link
              href="/admin/login"
              className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
            >
              <ArrowLeft size={12} /> Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
