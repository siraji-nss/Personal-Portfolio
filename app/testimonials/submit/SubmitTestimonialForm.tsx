'use client';

import { useState, useTransition } from 'react';
import { CheckCircle2, Loader2, Star, MessageSquareQuote } from 'lucide-react';
import { submitTestimonial } from '@/app/actions/testimonials';
import ImageUploadField from '@/components/admin/ImageUploadField';

const cls = 'w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';

export default function SubmitTestimonialForm() {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set('avatarUrl', avatarUrl);
    startTransition(async () => {
      try {
        await submitTestimonial(fd);
        setSubmitted(true);
      } catch {
        setError('Something went wrong. Please try again.');
      }
    });
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Thank you!</h1>
            <p className="text-zinc-400 leading-relaxed">
              Your testimonial has been submitted and is under review. It will appear on the site once approved.
            </p>
          </div>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6 py-28">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
            <MessageSquareQuote size={24} className="text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Share Your Experience</h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Your feedback means a lot. Please take a moment to share your experience working together.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/[0.025] border border-white/[0.07] rounded-2xl p-6">

          {/* Full Name */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Full Name *</label>
            <input name="name" required placeholder="Jane Smith" className={cls} />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Designation / Role *</label>
            <input name="designation" required placeholder="Chief Technology Officer" className={cls} />
          </div>

          {/* Profile link */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
              Your Profile Link <span className="normal-case text-zinc-700">(optional)</span>
            </label>
            <input
              name="profileUrl"
              type="url"
              placeholder="https://linkedin.com/in/yourname"
              className={cls}
            />
            <p className="text-[11px] text-zinc-700 mt-1">LinkedIn, personal website, or any social media — makes your name clickable.</p>
          </div>

          {/* Company + Company Website */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Company *</label>
              <input name="company" required placeholder="Acme Corp" className={cls} />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                Company Website <span className="normal-case text-zinc-700">(optional)</span>
              </label>
              <input name="companyUrl" type="url" placeholder="https://acmecorp.com" className={cls} />
            </div>
          </div>

          {/* Testimonial */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Your Testimonial *</label>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Share how working together made an impact…"
              className={cls}
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
              Profile Photo <span className="normal-case text-zinc-700">(optional)</span>
            </label>
            <ImageUploadField
              fieldName="_avatar_hidden"
              label=""
              initialUrl={null}
              hint="JPG or PNG, max 5 MB."
              onChangeUrl={setAvatarUrl}
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/[0.08] border border-red-500/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
            {isPending ? 'Submitting…' : 'Submit Testimonial'}
          </button>

          <p className="text-center text-[11px] text-zinc-700">
            Submissions are reviewed before being made public.
          </p>
        </form>
      </div>
    </div>
  );
}
