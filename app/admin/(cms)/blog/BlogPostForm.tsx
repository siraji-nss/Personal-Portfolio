'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { BlogCategory, BlogPost } from '@prisma/client';
import { createBlogPost, updateBlogPost } from '@/app/actions/blog';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-48 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center justify-center">
      <Loader2 size={16} className="text-zinc-600 animate-spin" />
    </div>
  ),
});

const cls = 'w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';

type PostWithCategory = BlogPost & { category: BlogCategory | null };

type Props = {
  post?: PostWithCategory | null;
  categories: BlogCategory[];
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function BlogPostForm({ post, categories }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(!!post);
  const [coverUrl, setCoverUrl] = useState(post?.coverUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTitle(val);
    if (!slugEdited) setSlug(slugify(val));
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const json = await res.json();
    setUploading(false);
    if (res.ok && json.url) setCoverUrl(json.url);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    if (post?.id) {
      await updateBlogPost(fd);
    } else {
      await createBlogPost(fd);
    }
    setSaving(false);
    router.push('/admin/blog');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      {/* Title */}
      <div>
        <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Title</label>
        <input name="title" required value={title} onChange={handleTitleChange} className={cls} placeholder="Post title…" />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Slug</label>
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
          className={cls}
          placeholder="post-slug"
        />
        <p className="text-[11px] text-zinc-700 mt-1">URL: /blog/{slug || '…'}</p>
      </div>

      {/* Body */}
      <div>
        <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Body</label>
        <TiptapEditor name="body" defaultValue={post?.body ?? ''} />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Excerpt</label>
        <textarea name="excerpt" rows={3} defaultValue={post?.excerpt ?? ''} className={cls} placeholder="Short summary shown on blog list page…" />
      </div>

      {/* Cover image */}
      <div>
        <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Cover Image</label>
        <input type="hidden" name="coverUrl" value={coverUrl} />
        <div className="flex items-center gap-3">
          <input
            type="url"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            className={`${cls} flex-1`}
            placeholder="https://… or upload below"
          />
          <label className="flex items-center gap-1.5 px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs text-zinc-400 hover:text-white cursor-pointer transition-colors shrink-0">
            {uploading ? <Loader2 size={12} className="animate-spin" /> : 'Upload'}
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </label>
        </div>
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="Cover preview" className="mt-3 h-32 w-full object-cover rounded-lg" />
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Category</label>
        <select name="categoryId" defaultValue={post?.categoryId ?? ''} className={cls}>
          <option value="">— No category —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Image URLs */}
      <div>
        <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Additional Image URLs (one per line)</label>
        <textarea name="imageUrls" rows={3} defaultValue={post?.imageUrls.join('\n') ?? ''} className={cls} placeholder="https://…" />
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
          <input type="checkbox" name="featured" defaultChecked={post?.featured ?? false} className="accent-indigo-500 w-4 h-4" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
          <input type="checkbox" name="published" defaultChecked={post?.published ?? true} className="accent-indigo-500 w-4 h-4" />
          Published
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {saving && <Loader2 size={13} className="animate-spin" />}
          {post ? 'Update Post' : 'Create Post'}
        </button>
        <a href="/admin/blog" className="px-6 py-2.5 border border-white/[0.08] text-zinc-400 hover:text-white text-sm rounded-lg transition-colors">
          Cancel
        </a>
      </div>
    </form>
  );
}
