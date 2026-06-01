'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Link2, Loader2, X } from 'lucide-react';

export default function AvatarUpload({
  initialUrl,
  fieldName = 'avatarUrl',
  label = 'Avatar / Photo',
}: {
  initialUrl?: string | null;
  fieldName?: string;
  label?: string;
}) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState(initialUrl ?? '');
  const [preview, setPreview] = useState(initialUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
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
    setUrl(json.url);
    setPreview(json.url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUrl(e.target.value);
    setPreview(e.target.value);
  }

  function clearImage() {
    setUrl('');
    setPreview('');
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  }

  const inputCls = 'w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all';

  return (
    <div className="space-y-3">
      <label className="block text-xs text-zinc-500 uppercase tracking-wider">{label}</label>

      {/* hidden input carries the URL into the server action form */}
      <input type="hidden" name={fieldName} value={url} />

      {/* Tab toggle */}
      <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-lg w-fit">
        {(['upload', 'url'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              tab === t
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
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
          onDrop={handleDrop}
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
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <input
          type="url"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://…"
          className={inputCls}
        />
      )}

      {error && (
        <p className="text-xs text-red-400 bg-red-500/[0.08] border border-red-500/20 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Preview */}
      {preview && (
        <div className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/10 shrink-0">
            <Image src={preview} alt="Avatar preview" fill className="object-cover" unoptimized />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-400 truncate">{preview}</p>
            <p className="text-[11px] text-zinc-600 mt-0.5">{label} preview</p>
          </div>
          <button
            type="button"
            onClick={clearImage}
            className="text-zinc-600 hover:text-zinc-400 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
