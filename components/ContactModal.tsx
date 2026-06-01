'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Paperclip, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendContactMessage } from '@/app/actions/contact';

type Props = { open: boolean; onClose: () => void };

const inputCls =
  'w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all';

export default function ContactModal({ open, onClose }: Props) {
  const [loading, setLoading]           = useState(false);
  const [status, setStatus]             = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg]         = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [uploading, setUploading]       = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleClose() {
    if (loading || uploading) return;
    setStatus('idle');
    setErrorMsg('');
    setAttachedFile(null);
    onClose();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAttachedFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg('');

    const form = e.currentTarget;
    const fd = new FormData(form);

    const phone = (fd.get('phone') as string)?.trim();
    const email = (fd.get('email') as string)?.trim();
    if (!phone && !email) {
      setErrorMsg('Please provide at least a phone number or email address.');
      return;
    }

    setLoading(true);

    // Upload attachment first if one is selected
    if (attachedFile) {
      setUploading(true);
      const uploadFd = new FormData();
      uploadFd.append('file', attachedFile);
      try {
        const res  = await fetch('/api/upload', { method: 'POST', body: uploadFd });
        const json = await res.json();
        if (res.ok && json.url) {
          fd.set('attachmentUrl', `${window.location.origin}${json.url}`);
        }
      } catch {
        // non-fatal — send without attachment URL
      }
      setUploading(false);
    }

    const result = await sendContactMessage(fd);
    setLoading(false);

    if (result.error) {
      setErrorMsg(result.error);
    } else {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        handleClose();
      }, 3000);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="contact-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            key="contact-modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#111115] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
              <div>
                <h2 className="text-white font-semibold text-base">Get In Touch</h2>
                <p className="text-zinc-500 text-xs mt-0.5">I&apos;ll get back to you as soon as possible.</p>
              </div>
              <button
                onClick={handleClose}
                className="text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Success state */}
            {status === 'success' ? (
              <div className="px-6 py-12 flex flex-col items-center gap-3 text-center">
                <CheckCircle2 size={40} className="text-indigo-400" />
                <p className="text-white font-semibold">Message sent!</p>
                <p className="text-zinc-500 text-sm">Thank you for reaching out. I&apos;ll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                {/* Name */}
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                    Name <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="Your full name"
                    className={inputCls}
                  />
                </div>

                {/* Phone + Email side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                      Phone
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+880 1X XX XX XX XX"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className={inputCls}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-zinc-600 -mt-2">
                  At least one of phone or email is required.
                </p>

                {/* Subject */}
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                    Subject
                  </label>
                  <input
                    name="subject"
                    placeholder="What is this about?"
                    className={inputCls}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="What would you like to discuss?"
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Attachment */}
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                    Attachment <span className="text-zinc-700 normal-case tracking-normal">(optional)</span>
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] border-dashed rounded-xl text-sm text-zinc-500 hover:text-zinc-300 hover:border-white/20 transition-all w-full"
                  >
                    <Paperclip size={14} />
                    {attachedFile ? (
                      <span className="text-zinc-300 truncate">{attachedFile.name}</span>
                    ) : (
                      <span>Click to attach a file</span>
                    )}
                  </button>
                  {attachedFile && (
                    <button
                      type="button"
                      onClick={() => { setAttachedFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                      className="text-[11px] text-zinc-600 hover:text-zinc-400 mt-1 transition-colors"
                    >
                      Remove attachment
                    </button>
                  )}
                </div>

                {/* Error */}
                {errorMsg && (
                  <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/[0.08] border border-red-500/20 px-3 py-2.5 rounded-xl">
                    <AlertCircle size={13} className="shrink-0 mt-0.5" />
                    {errorMsg}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {(loading || uploading) && <Loader2 size={14} className="animate-spin" />}
                  {uploading ? 'Uploading…' : loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
