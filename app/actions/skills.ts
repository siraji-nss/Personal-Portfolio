'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

export async function createSkill(formData: FormData) {
  await requireAdmin();
  await prisma.skill.create({
    data: {
      name: (formData.get('name') as string).trim(),
      category: formData.get('category') as string,
      subcategory: (formData.get('subcategory') as string).trim(),
      order: parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/skills');
}

export async function updateSkill(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  await prisma.skill.update({
    where: { id },
    data: {
      name: (formData.get('name') as string).trim(),
      category: formData.get('category') as string,
      subcategory: (formData.get('subcategory') as string).trim(),
      order: parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/skills');
}

export async function deleteSkill(formData: FormData) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id: formData.get('id') as string } });
  revalidatePath('/');
  revalidatePath('/admin/skills');
}
