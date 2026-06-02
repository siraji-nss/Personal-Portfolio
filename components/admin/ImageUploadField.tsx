'use client';

import { useRef, useState } from 'react';
import { Upload, Link2, Loader2, X } from 'lucide-react';

export default function ImageUploadField({
  initialUrl,
  fieldName,
  label,
  hint,
  onChangeUrl,
}: {
  initialUrl?: string | null;
  fieldName: string;
  label: string;
  hint?: string;
  onChangeUrl?: (url: string) => void;
}) {
  const [tab, setTab] = useState<'upload' | 'url'>(initialUrl ? 'url' : 'upload');
  const [url, setUrl] = useState(initialUrl ?? '');
  const [preview, setPreview] = useState(initialUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function applyUrl(newUrl: string) {
    setUrl(newUrl);
    setPreview(newUrl);
    onChangeUrl?.(newUrl);
  }

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
    applyUrl(json.url);
  }

  function clearImage() {
    applyUrl('');
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  }

  const inputCls =
    'w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all';

  return (
    <div className="space-y-3">
      <label className="block text-xs text-zinc-500 uppercase tracking-wider">{label}</label>

      {/* Hidden input carries the URL into the form */}
      <input type="hidden" name={fieldName} value={url} />

      {/* Tab toggle */}
      <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-lg w-fit">
        {(['upload', 'url'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              tab === t ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t === 'upload' ? <Upload size={11} /> : <Link2 size={11} />}
            {t === 'upload' ? 'Upload file' : 'Paste URL'}
          </button>
        ))}
      </div>

      {tab === 'upload' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) uploadFile(f);
          }}
          onClick={() => fileRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${
            dragging
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]'
          }`}
        >
          {uploading ? (
            <Loader2 size={22} className="text-indigo-400 animate-spin" />
          ) : (
            <Upload size={22} className="text-zinc-600" />
          )}
          <p className="text-xs text-zinc-500 text-center">
            {uploading ? 'Uploading…' : 'Click to browse or drag & drop'}
          </p>
          <p className="text-[11px] text-zinc-700">JPG, PNG, WebP, GIF — max 5 MB</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }}
          />
        </div>
      ) : (
        <input
          type="url"
          value={url}
          onChange={(e) => applyUrl(e.target.value)}
          placeholder="https://…"
          className={inputCls}
        />
      )}

      {error && (
        <p className="text-xs text-red-400 bg-red-500/[0.08] border border-red-500/20 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {preview && (
        <div className="relative rounded-xl overflow-hidden border border-white/[0.07] bg-white/[0.02] group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt={`${label} preview`} className="w-full h-36 object-cover" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 rounded-lg bg-black/70 text-zinc-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <X size={13} />
          </button>
          <p className="absolute bottom-0 inset-x-0 px-3 py-1.5 bg-gradient-to-t from-black/70 to-transparent text-[10px] text-zinc-400 truncate">
            {preview}
          </p>
        </div>
      )}

      {hint && <p className="text-[11px] text-zinc-700">{hint}</p>}
    </div>
  );
}
