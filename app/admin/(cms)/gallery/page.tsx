import { prisma } from '@/lib/prisma';
import { createGalleryPost, updateGalleryPost, deleteGalleryPost } from '@/app/actions/gallery';
import { Plus, Trash2, Image, Video, Star } from 'lucide-react';

const inputCls = 'px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';

export default async function GalleryAdminPage() {
  const posts = await prisma.galleryPost.findMany({ orderBy: { order: 'asc' } });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Gallery</h1>
      <p className="text-sm text-zinc-500 mb-8">Manage photo and video gallery posts.</p>

      {/* Existing posts */}
      <div className="space-y-4 mb-10 max-w-2xl">
        {posts.length === 0 && (
          <p className="text-xs text-zinc-700 text-center py-6 border border-dashed border-white/[0.06] rounded-xl">
            No gallery posts yet — add one below.
          </p>
        )}
        {posts.map((post) => (
          <div key={post.id} className="p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl">
            <form action={updateGalleryPost} className="space-y-3">
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
              <textarea name="mediaUrls" defaultValue={post.mediaUrls.join('\n')} placeholder="Image URLs (one per line)…"
                rows={3} className={`${inputCls} w-full`} />
              <input name="videoUrl" defaultValue={post.videoUrl ?? ''} placeholder="Video URL (YouTube, Vimeo…)"
                className={`${inputCls} w-full`} />
              <div className="flex items-center gap-2">
                <button type="submit"
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors">
                  Save
                </button>
                <form action={deleteGalleryPost} className="inline">
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit"
                    className="p-2 text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/[0.06] transition-all flex items-center gap-1 text-xs">
                    <Trash2 size={14} /> Delete
                  </button>
                </form>
              </div>
              <div className="flex gap-2 flex-wrap">
                {post.type === 'photo' && post.mediaUrls.slice(0, 3).map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt="" className="h-16 w-24 object-cover rounded-lg" />
                ))}
              </div>
            </form>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div className="max-w-2xl">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Add New Gallery Post</p>
        <form action={createGalleryPost} className="p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl space-y-3">
          <div className="flex items-center gap-3">
            <Plus size={15} className="text-zinc-500 shrink-0" />
            <select name="type" defaultValue="photo" className={`${inputCls} w-28`}>
              <option value="photo">Photo</option>
              <option value="video">Video</option>
            </select>
            <input name="order" type="number" defaultValue={posts.length}
              className={`${inputCls} w-16`} title="Order" />
            <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer shrink-0">
              <input type="checkbox" name="featured" className="accent-indigo-500" />
              Featured
            </label>
          </div>
          <input name="caption" placeholder="Caption…" className={`${inputCls} w-full`} />
          <textarea name="mediaUrls" placeholder="Image URLs (one per line)…" rows={3} className={`${inputCls} w-full`} />
          <input name="videoUrl" placeholder="Video URL (YouTube, Vimeo…)" className={`${inputCls} w-full`} />
          <button type="submit"
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors">
            Add Post
          </button>
        </form>
      </div>
    </div>
  );
}
