import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { createBlogCategory, updateBlogCategory, deleteBlogCategory, deleteBlogPost } from '@/app/actions/blog';
import { Plus, Trash2, Pencil, Star } from 'lucide-react';

const inputCls = 'px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all';

export default async function BlogAdminPage() {
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    prisma.blogCategory.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-white">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <Plus size={13} /> New Post
        </Link>
      </div>
      <p className="text-sm text-zinc-500 mb-8">Manage blog posts and categories.</p>

      {/* Posts list */}
      <div className="space-y-2 mb-12 max-w-3xl">
        {posts.length === 0 && (
          <p className="text-xs text-zinc-700 text-center py-6 border border-dashed border-white/[0.06] rounded-xl">
            No posts yet — create your first post.
          </p>
        )}
        {posts.map((post) => (
          <div key={post.id} className="flex items-center gap-3 p-4 bg-white/[0.025] border border-white/[0.07] rounded-xl">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-white truncate">{post.title}</span>
                {post.featured && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[10px]">
                    <Star size={9} /> Featured
                  </span>
                )}
                {!post.published && (
                  <span className="px-1.5 py-0.5 bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 rounded text-[10px]">Draft</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-600">
                {post.category && <span className="text-indigo-400">{post.category.name}</span>}
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>/blog/{post.slug}</span>
              </div>
            </div>
            <Link
              href={`/admin/blog/${post.id}`}
              className="p-2 text-zinc-600 hover:text-indigo-400 rounded-lg hover:bg-indigo-500/[0.06] transition-all"
            >
              <Pencil size={14} />
            </Link>
            <form action={deleteBlogPost} className="inline">
              <input type="hidden" name="id" value={post.id} />
              <button type="submit" className="p-2 text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/[0.06] transition-all">
                <Trash2 size={14} />
              </button>
            </form>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="max-w-2xl">
        <h2 className="text-sm font-semibold text-white mb-4">Categories</h2>

        <div className="space-y-2 mb-6">
          {categories.map((cat) => (
            <form key={cat.id} action={updateBlogCategory} className="flex items-center gap-3 p-3 bg-white/[0.025] border border-white/[0.07] rounded-xl">
              <input type="hidden" name="id" value={cat.id} />
              <input name="name" defaultValue={cat.name} placeholder="Category name" className={`${inputCls} flex-1`} />
              <input name="slug" defaultValue={cat.slug} placeholder="category-slug" className={`${inputCls} w-40`} />
              <button type="submit" className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shrink-0">
                Save
              </button>
              <form action={deleteBlogCategory} className="inline">
                <input type="hidden" name="id" value={cat.id} />
                <button type="submit" className="p-2 text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/[0.06] transition-all">
                  <Trash2 size={14} />
                </button>
              </form>
            </form>
          ))}
          {categories.length === 0 && (
            <p className="text-xs text-zinc-700 text-center py-4 border border-dashed border-white/[0.06] rounded-xl">
              No categories yet.
            </p>
          )}
        </div>

        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Add Category</p>
        <form action={createBlogCategory} className="flex items-center gap-3 p-3 bg-white/[0.025] border border-white/[0.07] rounded-xl">
          <Plus size={14} className="text-zinc-500 shrink-0" />
          <input name="name" required placeholder="Category name" className={`${inputCls} flex-1`} />
          <input name="slug" required placeholder="category-slug" className={`${inputCls} w-40`} />
          <button type="submit" className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shrink-0">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
