import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BlogPostForm from '../BlogPostForm';

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { id: params.id },
      include: { category: true },
    }),
    prisma.blogCategory.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Edit Blog Post</h1>
      <p className="text-sm text-zinc-500 mb-8">Update &quot;{post.title}&quot;</p>
      <BlogPostForm post={post} categories={categories} />
    </div>
  );
}
