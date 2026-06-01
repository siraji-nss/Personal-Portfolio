import { prisma } from '@/lib/prisma';
import BlogPostForm from '../BlogPostForm';

export default async function NewBlogPostPage() {
  const categories = await prisma.blogCategory.findMany({ orderBy: { name: 'asc' } });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">New Blog Post</h1>
      <p className="text-sm text-zinc-500 mb-8">Create a new blog post.</p>
      <BlogPostForm categories={categories} />
    </div>
  );
}
