'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

function parseTags(raw: string) {
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  await prisma.project.create({
    data: {
      title: (formData.get('title') as string).trim(),
      description: (formData.get('description') as string).trim(),
      imageUrl: (formData.get('imageUrl') as string)?.trim() || null,
      liveUrl: (formData.get('liveUrl') as string)?.trim() || null,
      githubUrl: (formData.get('githubUrl') as string)?.trim() || null,
      company: formData.get('company') as string,
      tags: parseTags(formData.get('tags') as string),
      featured: formData.get('featured') === 'true',
      order: parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/projects');
}

export async function updateProject(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  await prisma.project.update({
    where: { id },
    data: {
      title: (formData.get('title') as string).trim(),
      description: (formData.get('description') as string).trim(),
      imageUrl: (formData.get('imageUrl') as string)?.trim() || null,
      liveUrl: (formData.get('liveUrl') as string)?.trim() || null,
      githubUrl: (formData.get('githubUrl') as string)?.trim() || null,
      company: formData.get('company') as string,
      tags: parseTags(formData.get('tags') as string),
      featured: formData.get('featured') === 'true',
      order: parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/projects');
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  await prisma.project.delete({ where: { id: formData.get('id') as string } });
  revalidatePath('/');
  revalidatePath('/admin/projects');
}
