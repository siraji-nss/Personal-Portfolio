'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

export async function updateAboutConfig(formData: FormData) {
  await requireAdmin();

  const headline = (formData.get('headline') as string)?.trim() ?? '';
  const bio      = (formData.get('bio')      as string)?.trim() ?? '';
  const cvUrl    = (formData.get('cvUrl')    as string)?.trim() || null;
  const cardsRaw = (formData.get('cards')    as string)?.trim() ?? '[]';

  let cards: object[];
  try {
    const parsed = JSON.parse(cardsRaw);
    cards = Array.isArray(parsed) ? parsed : [];
  } catch {
    cards = [];
  }

  await prisma.aboutConfig.upsert({
    where:  { id: 'main' },
    update: { headline, bio, cvUrl, cards },
    create: { id: 'main', headline, bio, cvUrl, cards },
  });

  revalidatePath('/');
  revalidatePath('/admin/about');
}
