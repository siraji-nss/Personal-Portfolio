'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

function parseProjects(raw: string) {
  return raw.split('\n').map((s) => s.trim()).filter(Boolean);
}

export async function createExperience(formData: FormData) {
  await requireAdmin();
  const endDateRaw = formData.get('endDate') as string;
  await prisma.experience.create({
    data: {
      period: (formData.get('period') as string).trim(),
      startDate: new Date(formData.get('startDate') as string),
      endDate: endDateRaw ? new Date(endDateRaw) : null,
      role: (formData.get('role') as string).trim(),
      company: (formData.get('company') as string).trim(),
      description: (formData.get('description') as string).trim(),
      projects: parseProjects(formData.get('projects') as string),
      note: (formData.get('note') as string)?.trim() || null,
      isCurrent: formData.get('isCurrent') === 'true',
      order: parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/experience');
}

export async function updateExperience(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  const endDateRaw = formData.get('endDate') as string;
  await prisma.experience.update({
    where: { id },
    data: {
      period: (formData.get('period') as string).trim(),
      startDate: new Date(formData.get('startDate') as string),
      endDate: endDateRaw ? new Date(endDateRaw) : null,
      role: (formData.get('role') as string).trim(),
      company: (formData.get('company') as string).trim(),
      description: (formData.get('description') as string).trim(),
      projects: parseProjects(formData.get('projects') as string),
      note: (formData.get('note') as string)?.trim() || null,
      isCurrent: formData.get('isCurrent') === 'true',
      order: parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/experience');
}

export async function deleteExperience(formData: FormData) {
  await requireAdmin();
  await prisma.experience.delete({ where: { id: formData.get('id') as string } });
  revalidatePath('/');
  revalidatePath('/admin/experience');
}

export async function batchUpdateExperienceOrder(formData: FormData) {
  await requireAdmin();
  const ids = JSON.parse(formData.get('ids') as string) as string[];
  await Promise.all(
    ids.map((id, order) => prisma.experience.update({ where: { id }, data: { order } })),
  );
  revalidatePath('/');
  revalidatePath('/admin/experience');
}
