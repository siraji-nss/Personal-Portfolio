'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

export async function createEducation(formData: FormData) {
  await requireAdmin();
  await prisma.education.create({
    data: {
      type: (formData.get('type') as string).trim(),
      year: (formData.get('year') as string).trim(),
      degree: (formData.get('degree') as string).trim(),
      institution: (formData.get('institution') as string).trim(),
      highlight: formData.get('highlight') === 'true',
      order: parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/education');
}

export async function updateEducation(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  await prisma.education.update({
    where: { id },
    data: {
      type: (formData.get('type') as string).trim(),
      year: (formData.get('year') as string).trim(),
      degree: (formData.get('degree') as string).trim(),
      institution: (formData.get('institution') as string).trim(),
      highlight: formData.get('highlight') === 'true',
      order: parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/education');
}

export async function deleteEducation(formData: FormData) {
  await requireAdmin();
  await prisma.education.delete({ where: { id: formData.get('id') as string } });
  revalidatePath('/');
  revalidatePath('/admin/education');
}
