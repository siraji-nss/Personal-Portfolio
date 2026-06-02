'use client';

import { useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import type { BlogCategory, BlogPost } from '@prisma/client';
import { createBlogPost, updateBlogPost } from '@/app/actions/blog';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import ImageUploadField from '@/components/admin/ImageUploadField';
import MultiImageUpload from '@/components/admin/MultiImageUpload';
import SaveModal from '@/components/admin/SaveModal';

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
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTitle(val);
    if (!slugEdited) setSlug(slugify(val));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (post?.id) {
          await updateBlogPost(fd);
          setModal({ success: true, message: 'Post updated successfully.' });
        } else {
          await createBlogPost(fd);
          setModal({ success: true, message: 'Post created successfully.' });
          setTimeout(() => {
            router.push('/admin/blog');
            router.refresh();
          }, 1800);
        }
      } catch (err) {
        setModal({
          success: false,
          message: err instanceof Error ? err.message : 'Something went wrong.',
        });
      }
    });
  }

  return (
    <>
      {modal && (
        <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />
      )}
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
        <ImageUploadField
          fieldName="coverUrl"
          label="Cover Image"
          initialUrl={post?.coverUrl}
          hint="Main banner image shown on blog listing and the post header."
        />

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

        {/* Additional images */}
        <MultiImageUpload
          fieldName="imageUrls"
          label="Additional Images"
          initialUrls={post?.imageUrls ?? []}
          hint="Extra images embedded or referenced within the post body."
        />

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
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {isPending && <Loader2 size={13} className="animate-spin" />}
            {isPending ? 'Saving…' : post ? 'Update Post' : 'Create Post'}
          </button>
          <a href="/admin/blog" className="px-6 py-2.5 border border-white/[0.08] text-zinc-400 hover:text-white text-sm rounded-lg transition-colors">
            Cancel
          </a>
        </div>
      </form>
    </>
  );
}
