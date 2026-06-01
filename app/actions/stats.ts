'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

export async function createStat(formData: FormData) {
  await requireAdmin();
  await prisma.stat.create({
    data: {
      value: (formData.get('value') as string).trim(),
      label: (formData.get('label') as string).trim(),
      order: parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
}

export async function updateStat(formData: FormData) {
  await requireAdmin();
  await prisma.stat.update({
    where: { id: formData.get('id') as string },
    data: {
      value: (formData.get('value') as string).trim(),
      label: (formData.get('label') as string).trim(),
      order: parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
}

export async function deleteStat(formData: FormData) {
  await requireAdmin();
  await prisma.stat.delete({ where: { id: formData.get('id') as string } });
  revalidatePath('/');
}
