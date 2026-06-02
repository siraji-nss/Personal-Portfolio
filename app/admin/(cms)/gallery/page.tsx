import { prisma } from '@/lib/prisma';
import GalleryManager from './GalleryManager';

export default async function GalleryAdminPage() {
  const posts = await prisma.galleryPost.findMany({ orderBy: { order: 'asc' } });

  const data = posts.map((p) => ({
    id: p.id,
    type: p.type,
    caption: p.caption,
    mediaUrls: p.mediaUrls,
    videoUrl: p.videoUrl,
    featured: p.featured,
    order: p.order,
  }));

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Gallery</h1>
      <p className="text-sm text-zinc-500 mb-8">Manage photo and video gallery posts.</p>
      <GalleryManager initialPosts={data} />
    </div>
  );
}
