import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Tag } from 'lucide-react';

export const metadata = {
  title: 'Blog — Nazmus Sakib Siraji',
  description: 'Articles and insights by Nazmus Sakib Siraji on software, project management, and more.',
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  return (
    <main className="min-h-screen bg-[#09090b] pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs uppercase tracking-[4px] text-indigo-500 font-semibold">Blog</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Thoughts &amp; Insights</h1>
          <p className="text-zinc-500 text-sm max-w-xl">Articles on software engineering, project management, and building technology with purpose.</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-zinc-600 text-center py-20">No posts published yet. Check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white/[0.025] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] transition-all duration-200"
              >
                {post.coverUrl ? (
                  <div className="relative h-48 shrink-0 overflow-hidden">
                    <Image
                      src={post.coverUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="h-48 shrink-0 bg-gradient-to-br from-indigo-500/10 to-violet-600/10 flex items-center justify-center">
                    <span className="text-indigo-500/30 text-4xl font-black">{post.title.slice(0, 2)}</span>
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3 text-[11px] text-zinc-600">
                    {post.category && (
                      <span className="flex items-center gap-1 text-indigo-400">
                        <Tag size={9} /> {post.category.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={9} /> {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-[15px] font-semibold text-white mb-2 leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-zinc-600 text-xs leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                  )}
                  <span className="mt-4 text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
