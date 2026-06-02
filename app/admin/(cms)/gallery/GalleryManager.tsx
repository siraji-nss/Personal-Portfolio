'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, Image, Video, Loader2 } from 'lucide-react';
import { createGalleryPost, updateGalleryPost, deleteGalleryPost } from '@/app/actions/gallery';
import MultiImageUpload from '@/components/admin/MultiImageUpload';
import SaveModal from '@/components/admin/SaveModal';

type GalleryPost = {
  id: string;
  type: string;
  caption: string | null;
  mediaUrls: string[];
  videoUrl: string | null;
  featured: boolean;
  order: number;
};

const inputCls =
  'px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';

function GalleryPostCard({ post }: { post: GalleryPost }) {
  const [isPending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateGalleryPost(fd);
        setModal({ success: true, message: 'Gallery post saved.' });
      } catch (err) {
        setModal({
          success: false,
          message: err instanceof Error ? err.message : 'Something went wrong.',
        });
      }
    });
  }

  function handleDelete() {
    setDeleting(true);
    const fd = new FormData();
    fd.append('id', post.id);
    startTransition(async () => {
      try {
        await deleteGalleryPost(fd);
      } catch {
        setDeleting(false);
      }
    });
  }

  return (
    <>
      <div className="p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl">
        <form onSubmit={handleSave} className="space-y-3">
          <input type="hidden" name="id" value={post.id} />
          <div className="flex items-center gap-3">
            {post.type === 'video' ? (
              <Video size={14} className="text-violet-400 shrink-0" />
            ) : (
              <Image size={14} className="text-indigo-400 shrink-0" />
            )}
            <select name="type" defaultValue={post.type} className={`${inputCls} w-28`}>
              <option value="photo">Photo</option>
              <option value="video">Video</option>
            </select>
            <input name="order" type="number" defaultValue={post.order}
              className={`${inputCls} w-16`} title="Order" />
            <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer shrink-0">
              <input type="checkbox" name="featured" defaultChecked={post.featured} className="accent-indigo-500" />
              Featured
            </label>
          </div>
          <input name="caption" defaultValue={post.caption ?? ''} placeholder="Caption…"
            className={`${inputCls} w-full`} />

          <MultiImageUpload
            fieldName="mediaUrls"
            label="Photos"
            initialUrls={post.mediaUrls}
            hint="Images shown in this gallery post."
          />

          <input name="videoUrl" defaultValue={post.videoUrl ?? ''} placeholder="Video URL (YouTube, Vimeo…)"
            className={`${inputCls} w-full`} />

          <div className="flex items-center gap-2">
            <button type="submit" disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors">
              {isPending && <Loader2 size={11} className="animate-spin" />}
              {isPending ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={handleDelete} disabled={deleting}
              className="p-2 text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/[0.06] transition-all flex items-center gap-1 text-xs disabled:opacity-40">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </form>
      </div>
      {modal && (
        <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />
      )}
    </>
  );
}

function AddGalleryForm({ count }: { count: number }) {
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      try {
        await createGalleryPost(fd);
        form.reset();
        setModal({ success: true, message: 'Gallery post added.' });
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
      <form onSubmit={handleSubmit} className="p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl space-y-3">
        <div className="flex items-center gap-3">
          <Plus size={15} className="text-zinc-500 shrink-0" />
          <select name="type" defaultValue="photo" className={`${inputCls} w-28`}>
            <option value="photo">Photo</option>
            <option value="video">Video</option>
          </select>
          <input name="order" type="number" defaultValue={count}
            className={`${inputCls} w-16`} title="Order" />
          <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer shrink-0">
            <input type="checkbox" name="featured" className="accent-indigo-500" />
            Featured
          </label>
        </div>
        <input name="caption" placeholder="Caption…" className={`${inputCls} w-full`} />

        <MultiImageUpload
          fieldName="mediaUrls"
          label="Photos"
          hint="Upload or paste image URLs for this gallery post."
        />

        <input name="videoUrl" placeholder="Video URL (YouTube, Vimeo…)" className={`${inputCls} w-full`} />

        <button type="submit" disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors">
          {isPending && <Loader2 size={11} className="animate-spin" />}
          {isPending ? 'Adding…' : 'Add Post'}
        </button>
      </form>
      {modal && (
        <SaveModal success={modal.success} message={modal.message} onClose={() => setModal(null)} />
      )}
    </>
  );
}

export default function GalleryManager({ initialPosts }: { initialPosts: GalleryPost[] }) {
  return (
    <>
      <div className="space-y-4 mb-10 max-w-2xl">
        {initialPosts.length === 0 && (
          <p className="text-xs text-zinc-700 text-center py-6 border border-dashed border-white/[0.06] rounded-xl">
            No gallery posts yet — add one below.
          </p>
        )}
        {initialPosts.map((post) => (
          <GalleryPostCard key={post.id} post={post} />
        ))}
      </div>
      <div className="max-w-2xl">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Add New Gallery Post</p>
        <AddGalleryForm count={initialPosts.length} />
      </div>
    </>
  );
}
