import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';

export const metadata = {
  title: 'Gallery — Nazmus Sakib Siraji',
  description: 'Photo and video gallery of Nazmus Sakib Siraji.',
};

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;
  return null;
}

export default async function GalleryPage() {
  const [posts, heroConfig] = await Promise.all([
    prisma.galleryPost.findMany({ orderBy: { order: 'asc' } }),
    prisma.heroConfig.findUnique({ where: { id: 'main' }, select: { fullName: true, avatarUrl: true } }),
  ]);

  return (
    <>
      <Navigation
        fullName={heroConfig?.fullName ?? 'Nazmus Sakib Siraji'}
        avatarUrl={heroConfig?.avatarUrl}
      />
      <main className="min-h-screen bg-[#09090b] pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-indigo-400 transition-colors mb-6">
            <ArrowLeft size={12} /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs uppercase tracking-[4px] text-indigo-500 font-semibold">Gallery</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Photo &amp; Video Gallery</h1>
          <p className="text-zinc-500 text-sm">A visual collection of moments and milestones.</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-zinc-600 text-center py-20">No gallery content yet. Check back soon.</p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="break-inside-avoid mb-4">
                {post.type === 'video' && post.videoUrl ? (
                  <div className="rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.025]">
                    {(() => {
                      const yt = getYouTubeEmbedUrl(post.videoUrl);
                      const vm = getVimeoEmbedUrl(post.videoUrl);
                      const embedUrl = yt ?? vm;
                      return embedUrl ? (
                        <div className="relative aspect-video">
                          <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={post.caption ?? 'Video'}
                          />
                        </div>
                      ) : (
                        <a href={post.videoUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center h-40 text-indigo-400 hover:text-indigo-300 text-sm transition-colors p-4 text-center">
                          Watch Video →
                        </a>
                      );
                    })()}
                    {post.caption && (
                      <p className="text-xs text-zinc-500 px-4 py-3">{post.caption}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {post.mediaUrls.map((url, i) => (
                      <div key={i} className="relative rounded-2xl overflow-hidden border border-white/[0.07] group">
                        <Image
                          src={url}
                          alt={post.caption ?? `Gallery image ${i + 1}`}
                          width={600}
                          height={400}
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                        {i === 0 && post.caption && (
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs text-white">{post.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </main>
    </>
  );
}
