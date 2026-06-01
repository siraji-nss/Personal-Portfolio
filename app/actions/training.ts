'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

export async function createTraining(formData: FormData) {
  await requireAdmin();

  await prisma.training.create({
    data: {
      title:       (formData.get('title')       as string).trim(),
      institution: (formData.get('institution') as string).trim(),
      year:        (formData.get('year')        as string).trim(),
      description: (formData.get('description') as string)?.trim() || null,
      order:       parseInt((formData.get('order') as string) ?? '0', 10),
    },
  });

  revalidatePath('/');
  revalidatePath('/admin/training');
}

export async function updateTraining(formData: FormData) {
  await requireAdmin();

  const id = formData.get('id') as string;

  await prisma.training.update({
    where: { id },
    data: {
      title:       (formData.get('title')       as string).trim(),
      institution: (formData.get('institution') as string).trim(),
      year:        (formData.get('year')        as string).trim(),
      description: (formData.get('description') as string)?.trim() || null,
      order:       parseInt((formData.get('order') as string) ?? '0', 10),
    },
  });

  revalidatePath('/');
  revalidatePath('/admin/training');
}

export async function deleteTraining(formData: FormData) {
  await requireAdmin();

  const id = formData.get('id') as string;
  await prisma.training.delete({ where: { id } });

  revalidatePath('/');
  revalidatePath('/admin/training');
}
