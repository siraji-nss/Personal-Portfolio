'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

export async function createClient(formData: FormData) {
  await requireAdmin();
  await prisma.client.create({
    data: {
      name: (formData.get('name') as string).trim(),
      logoUrl: (formData.get('logoUrl') as string)?.trim() || null,
      website: (formData.get('website') as string)?.trim() || null,
      company: formData.get('company') as string,
      order: parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/clients');
}

export async function updateClient(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  await prisma.client.update({
    where: { id },
    data: {
      name: (formData.get('name') as string).trim(),
      logoUrl: (formData.get('logoUrl') as string)?.trim() || null,
      website: (formData.get('website') as string)?.trim() || null,
      company: formData.get('company') as string,
      order: parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/clients');
}

export async function deleteClient(formData: FormData) {
  await requireAdmin();
  await prisma.client.delete({ where: { id: formData.get('id') as string } });
  revalidatePath('/');
  revalidatePath('/admin/clients');
}
