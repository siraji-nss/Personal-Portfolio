'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

export async function updateHeroConfig(formData: FormData) {
  await requireAdmin();

  const typingTextsRaw = formData.get('typingTexts') as string;
  const typingTexts = typingTextsRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const secondaryLinesRaw = formData.get('secondaryLines') as string;
  const secondaryLines = secondaryLinesRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const data = {
    fullName:       (formData.get('fullName')       as string).trim(),
    avatarUrl:      (formData.get('avatarUrl')      as string)?.trim() || null,
    heroImageUrl:   (formData.get('heroImageUrl')   as string)?.trim() || null,
    typingTexts,
    statusBadge:    (formData.get('statusBadge')    as string).trim(),
    introPara:      (formData.get('introPara')       as string).trim(),
    primaryTitle:   (formData.get('primaryTitle')    as string).trim(),
    primaryCompany: (formData.get('primaryCompany')  as string).trim(),
    secondaryLines,
    linkedinUrl:    (formData.get('linkedinUrl')     as string)?.trim() || null,
    whatsappNumber: (formData.get('whatsappNumber')  as string)?.trim() || null,
    officeAddress:  (formData.get('officeAddress')   as string)?.trim() || null,
    officeMapUrl:   (formData.get('officeMapUrl')    as string)?.trim() || null,
    primaryEmail: (formData.get('primaryEmail') as string)?.trim() || null,
    faviconUrl:   (formData.get('faviconUrl')   as string)?.trim() || null,
    orgEmails: (() => {
      const raw = (formData.get('orgEmails') as string)?.trim() ?? '';
      return raw.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
        const [email, name] = l.split('|').map(s => s.trim());
        return { email: email ?? '', name: name ?? '' };
      }).filter(o => o.email);
    })(),
  };

  await prisma.heroConfig.upsert({
    where: { id: 'main' },
    update: data,
    create: { id: 'main', ...data },
  });

  revalidatePath('/');
  revalidatePath('/admin/hero');
}
