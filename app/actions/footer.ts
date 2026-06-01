'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

export async function updateFooterConfig(formData: FormData) {
  await requireAdmin();

  const data = {
    tagline:       (formData.get('tagline')       as string)?.trim() || null,
    description:   (formData.get('description')   as string)?.trim() || null,
    copyrightName: (formData.get('copyrightName') as string)?.trim() || null,
  };

  await prisma.footerConfig.upsert({
    where: { id: 'main' },
    update: data,
    create: { id: 'main', ...data },
  });

  revalidatePath('/');
  revalidatePath('/admin/footer');
}
