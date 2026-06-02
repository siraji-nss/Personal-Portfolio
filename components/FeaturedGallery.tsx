'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Video } from 'lucide-react';
import type { GalleryPost } from '@prisma/client';

type Props = { posts: GalleryPost[] };

export default function FeaturedGallery({ posts }: Props) {
  if (!posts.length) return null;

  return (
    <section id="gallery" className="py-20 px-6 bg-[#0d0d10]">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-xs uppercase tracking-[4px] text-indigo-500 font-semibold">09</span>
          <span className="text-xs uppercase tracking-[4px] text-zinc-600">Gallery</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
          <Link
            href="/gallery"
            className="flex items-center gap-1 text-xs text-zinc-600 hover:text-indigo-400 transition-colors"
          >
            See All <ArrowRight size={11} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {posts.slice(0, 6).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
            >
              <Link
                href="/gallery"
                className="group block relative aspect-square rounded-xl overflow-hidden border border-white/[0.07] hover:border-indigo-500/30 transition-all"
              >
                {post.type === 'video' ? (
                  <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-indigo-600/20 flex flex-col items-center justify-center gap-2">
                    <Video size={22} className="text-violet-400" />
                    {post.caption && (
                      <p className="text-[10px] text-zinc-500 text-center px-2 line-clamp-2">{post.caption}</p>
                    )}
                  </div>
                ) : post.mediaUrls[0] ? (
                  <>
                    <Image
                      src={post.mediaUrls[0]}
                      alt={post.caption ?? 'Gallery'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </>
                ) : (
                  <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
                    <span className="text-zinc-700 text-xs">No image</span>
                  </div>
                )}
                {post.caption && post.type !== 'video' && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white line-clamp-2">{post.caption}</p>
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
