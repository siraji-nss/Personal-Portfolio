'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

type Props = {
  success: boolean;
  message: string;
  onClose: () => void;
};

const AUTO_CLOSE_MS = 3500;

export default function SaveModal({ success, message, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, AUTO_CLOSE_MS);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 24 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 flex flex-col items-center gap-5 px-10 py-8 rounded-2xl border shadow-2xl max-w-xs w-full ${
          success
            ? 'bg-[#0c1f17] border-emerald-500/30 shadow-emerald-900/30'
            : 'bg-[#1f0d0d] border-red-500/30 shadow-red-900/30'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-600 hover:text-zinc-400 transition-colors p-1 rounded-lg hover:bg-white/[0.05]"
        >
          <X size={14} />
        </button>

        {success ? (
          <CheckCircle2 size={44} className="text-emerald-400 shrink-0" />
        ) : (
          <XCircle size={44} className="text-red-400 shrink-0" />
        )}

        <div className="text-center">
          <p className={`text-base font-bold ${success ? 'text-emerald-300' : 'text-red-300'}`}>
            {success ? 'Saved successfully!' : 'Save failed'}
          </p>
          <p className="text-sm text-zinc-400 mt-1.5 leading-snug">{message}</p>
        </div>

        {/* Auto-close progress bar */}
        <div className="w-full h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: AUTO_CLOSE_MS / 1000, ease: 'linear' }}
            className={`h-full rounded-full ${success ? 'bg-emerald-500' : 'bg-red-500'}`}
          />
        </div>
      </motion.div>
    </div>
  );
}
