'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

// ─────────────────────────────────────────────────────────────────────────────
// Skill Category actions
// ─────────────────────────────────────────────────────────────────────────────

export async function createSkillCategory(formData: FormData) {
  await requireAdmin();
  const name  = (formData.get('name')  as string).trim();
  const color = (formData.get('color') as string).trim() || 'indigo';
  const order = parseInt(formData.get('order') as string, 10) || 0;

  // Auto-generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 32);

  await prisma.skillCategory.create({ data: { name, slug, color, order } });
  revalidatePath('/');
  revalidatePath('/admin/skills');
}

export async function updateSkillCategory(formData: FormData) {
  await requireAdmin();
  const id    = formData.get('id')    as string;
  const name  = (formData.get('name')  as string).trim();
  const color = (formData.get('color') as string).trim() || 'indigo';
  const order = parseInt(formData.get('order') as string, 10) || 0;

  await prisma.skillCategory.update({ where: { id }, data: { name, color, order } });
  revalidatePath('/');
  revalidatePath('/admin/skills');
}

export async function deleteSkillCategory(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  // Move orphaned skills to a holding category
  const cat = await prisma.skillCategory.findUnique({ where: { id } });
  if (cat) {
    await prisma.skill.updateMany({
      where: { category: cat.slug },
      data: { category: '_uncategorized' },
    });
  }
  await prisma.skillCategory.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/skills');
}

// ─────────────────────────────────────────────────────────────────────────────
// Skill actions
// ─────────────────────────────────────────────────────────────────────────────

export async function createSkill(formData: FormData) {
  await requireAdmin();
  await prisma.skill.create({
    data: {
      name:        (formData.get('name')        as string).trim(),
      category:    (formData.get('category')    as string).trim(),
      subcategory: (formData.get('subcategory') as string).trim(),
      order:       parseInt(formData.get('order') as string, 10) || 0,
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
      name:        (formData.get('name')        as string).trim(),
      subcategory: (formData.get('subcategory') as string).trim(),
      order:       parseInt(formData.get('order') as string, 10) || 0,
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
