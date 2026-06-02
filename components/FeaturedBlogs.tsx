'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import type { BlogPost, BlogCategory } from '@prisma/client';

type PostWithCategory = BlogPost & { category: BlogCategory | null };

type Props = { posts: PostWithCategory[] };

export default function FeaturedBlogs({ posts }: Props) {
  if (!posts.length) return null;

  return (
    <section id="blog" className="py-20 px-6 bg-[#09090b]">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-xs uppercase tracking-[4px] text-indigo-500 font-semibold">08</span>
          <span className="text-xs uppercase tracking-[4px] text-zinc-600">Blog</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
          <Link
            href="/blog"
            className="flex items-center gap-1 text-xs text-zinc-600 hover:text-indigo-400 transition-colors"
          >
            See All <ArrowRight size={11} />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col h-full bg-white/[0.025] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] transition-all duration-200"
              >
                {post.coverUrl ? (
                  <div className="relative h-44 shrink-0 overflow-hidden">
                    <Image
                      src={post.coverUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="h-44 shrink-0 bg-gradient-to-br from-indigo-500/10 to-violet-600/10 flex items-center justify-center">
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
                      <Calendar size={9} />
                      {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-white mb-2 leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-zinc-600 text-xs leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                  )}
                  <span className="mt-4 text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                    Read more <ArrowRight size={10} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
