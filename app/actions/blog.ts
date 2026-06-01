'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function createBlogCategory(formData: FormData) {
  await requireAdmin();
  await prisma.blogCategory.create({
    data: {
      name: (formData.get('name') as string).trim(),
      slug: (formData.get('slug') as string).trim(),
    },
  });
  revalidatePath('/blog');
  revalidatePath('/admin/blog');
}

export async function updateBlogCategory(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  await prisma.blogCategory.update({
    where: { id },
    data: {
      name: (formData.get('name') as string).trim(),
      slug: (formData.get('slug') as string).trim(),
    },
  });
  revalidatePath('/blog');
  revalidatePath('/admin/blog');
}

export async function deleteBlogCategory(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  await prisma.blogCategory.delete({ where: { id } });
  revalidatePath('/blog');
  revalidatePath('/admin/blog');
}

// ── Posts ─────────────────────────────────────────────────────────────────────

function parseImageUrls(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split('\n').map(u => u.trim()).filter(Boolean);
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin();

  const categoryId = (formData.get('categoryId') as string)?.trim() || null;

  await prisma.blogPost.create({
    data: {
      title:      (formData.get('title')    as string).trim(),
      slug:       (formData.get('slug')     as string).trim(),
      body:       (formData.get('body')     as string) ?? '',
      excerpt:    (formData.get('excerpt')  as string)?.trim() || null,
      coverUrl:   (formData.get('coverUrl') as string)?.trim() || null,
      imageUrls:  parseImageUrls(formData.get('imageUrls') as string),
      featured:   formData.get('featured') === 'on',
      published:  formData.get('published') === 'on',
      categoryId,
    },
  });

  revalidatePath('/blog');
  revalidatePath('/');
}

export async function updateBlogPost(formData: FormData) {
  await requireAdmin();

  const id = formData.get('id') as string;
  const categoryId = (formData.get('categoryId') as string)?.trim() || null;

  await prisma.blogPost.update({
    where: { id },
    data: {
      title:      (formData.get('title')    as string).trim(),
      slug:       (formData.get('slug')     as string).trim(),
      body:       (formData.get('body')     as string) ?? '',
      excerpt:    (formData.get('excerpt')  as string)?.trim() || null,
      coverUrl:   (formData.get('coverUrl') as string)?.trim() || null,
      imageUrls:  parseImageUrls(formData.get('imageUrls') as string),
      featured:   formData.get('featured') === 'on',
      published:  formData.get('published') === 'on',
      categoryId,
    },
  });

  revalidatePath('/blog');
  revalidatePath('/');
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath('/blog');
  revalidatePath('/');
}
