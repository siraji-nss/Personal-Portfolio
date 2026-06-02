'use client';

import { useRef, useState } from 'react';
import { Upload, Link2, Loader2, X, Plus, GripVertical } from 'lucide-react';

export default function MultiImageUpload({
  fieldName,
  label,
  initialUrls = [],
  hint,
}: {
  fieldName: string;
  label: string;
  initialUrls?: string[];
  hint?: string;
}) {
  const [urls, setUrls] = useState<string[]>(initialUrls.filter(Boolean));
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const json = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(json.error ?? 'Upload failed.');
      return;
    }
    setUrls((prev) => [...prev, json.url]);
    if (fileRef.current) fileRef.current.value = '';
  }

  function addUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setUrls((prev) => [...prev, trimmed]);
    setUrlInput('');
  }

  function remove(i: number) {
    setUrls((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs text-zinc-500 uppercase tracking-wider">{label}</label>

      {/* Hidden textarea serialises URLs for the form */}
      <textarea name={fieldName} className="hidden" readOnly value={urls.join('\n')} />

      {/* Action row */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs text-zinc-400 hover:text-white hover:border-white/[0.15] transition-all disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Upload size={12} />
          )}
          {uploading ? 'Uploading…' : 'Upload from device'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadFile(f);
          }}
        />
      </div>

      {/* URL paste row */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg focus-within:border-indigo-500/40 transition-all">
          <Link2 size={11} className="text-zinc-600 shrink-0" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
            placeholder="Paste image URL and press Add…"
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-700 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={addUrl}
          className="flex items-center gap-1 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs text-zinc-400 hover:text-white hover:border-white/[0.15] transition-all shrink-0"
        >
          <Plus size={13} /> Add
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-500/[0.08] border border-red-500/20 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Image grid */}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {urls.map((u, i) => (
            <div
              key={i}
              className="relative group rounded-lg overflow-hidden border border-white/[0.07] bg-white/[0.02] aspect-square"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 p-0.5 rounded-md bg-black/80 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={11} />
              </button>
              <span className="absolute bottom-1 left-1 text-[9px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #{i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {urls.length === 0 && (
        <p className="text-[11px] text-zinc-700 italic">No images yet — upload or paste URLs above.</p>
      )}

      {hint && <p className="text-[11px] text-zinc-700">{hint}</p>}
    </div>
  );
}
