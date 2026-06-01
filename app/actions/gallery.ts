'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

function parseMediaUrls(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split('\n').map(u => u.trim()).filter(Boolean);
}

export async function createGalleryPost(formData: FormData) {
  await requireAdmin();

  await prisma.galleryPost.create({
    data: {
      type:      (formData.get('type')     as string)?.trim() || 'photo',
      caption:   (formData.get('caption')  as string)?.trim() || null,
      mediaUrls: parseMediaUrls(formData.get('mediaUrls') as string),
      videoUrl:  (formData.get('videoUrl') as string)?.trim() || null,
      featured:  formData.get('featured') === 'on',
      order:     parseInt((formData.get('order') as string) ?? '0', 10),
    },
  });

  revalidatePath('/gallery');
  revalidatePath('/');
}

export async function updateGalleryPost(formData: FormData) {
  await requireAdmin();

  const id = formData.get('id') as string;

  await prisma.galleryPost.update({
    where: { id },
    data: {
      type:      (formData.get('type')     as string)?.trim() || 'photo',
      caption:   (formData.get('caption')  as string)?.trim() || null,
      mediaUrls: parseMediaUrls(formData.get('mediaUrls') as string),
      videoUrl:  (formData.get('videoUrl') as string)?.trim() || null,
      featured:  formData.get('featured') === 'on',
      order:     parseInt((formData.get('order') as string) ?? '0', 10),
    },
  });

  revalidatePath('/gallery');
  revalidatePath('/');
}

export async function deleteGalleryPost(formData: FormData) {
  await requireAdmin();

  const id = formData.get('id') as string;
  await prisma.galleryPost.delete({ where: { id } });

  revalidatePath('/gallery');
  revalidatePath('/');
}
