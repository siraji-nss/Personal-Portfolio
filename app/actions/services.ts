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

export async function createService(formData: FormData) {
  await requireAdmin();
  await prisma.service.create({
    data: {
      number: (formData.get('number') as string).trim(),
      icon: (formData.get('icon') as string).trim(),
      title: (formData.get('title') as string).trim(),
      description: (formData.get('description') as string).trim(),
      tags: parseTags(formData.get('tags') as string),
      order: parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/services');
}

export async function updateService(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  await prisma.service.update({
    where: { id },
    data: {
      number: (formData.get('number') as string).trim(),
      icon: (formData.get('icon') as string).trim(),
      title: (formData.get('title') as string).trim(),
      description: (formData.get('description') as string).trim(),
      tags: parseTags(formData.get('tags') as string),
      order: parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/services');
}

export async function deleteService(formData: FormData) {
  await requireAdmin();
  await prisma.service.delete({ where: { id: formData.get('id') as string } });
  revalidatePath('/');
  revalidatePath('/admin/services');
}
