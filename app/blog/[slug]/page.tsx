import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    select: { title: true, excerpt: true, coverUrl: true },
  });
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} — Nazmus Sakib Siraji`,
    description: post.excerpt ?? undefined,
    openGraph: post.coverUrl ? { images: [post.coverUrl] } : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
    include: { category: true },
  });

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#09090b] pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-indigo-400 transition-colors mb-8">
          <ArrowLeft size={12} /> Back to Blog
        </Link>

        {post.coverUrl && (
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
            <Image src={post.coverUrl} alt={post.title} fill className="object-cover" unoptimized />
          </div>
        )}

        <div className="flex items-center gap-4 mb-4 text-[11px] text-zinc-600">
          {post.category && (
            <span className="flex items-center gap-1 text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              <Tag size={9} /> {post.category.name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={9} />
            {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>

        {post.excerpt && (
          <p className="text-zinc-400 text-base leading-relaxed mb-8 border-l-2 border-indigo-500/40 pl-4">{post.excerpt}</p>
        )}

        <article
          className="wysiwyg prose prose-invert prose-sm max-w-none text-zinc-400 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </div>
    </main>
  );
}
