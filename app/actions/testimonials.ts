'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

// ─── Public submission (no auth required) ────────────────────────────────────

export async function submitTestimonial(formData: FormData) {
  await prisma.testimonial.create({
    data: {
      name:        (formData.get('name')        as string).trim(),
      designation: (formData.get('designation') as string).trim(),
      company:     (formData.get('company')     as string).trim(),
      companyUrl:  (formData.get('companyUrl')  as string)?.trim() || null,
      message:     (formData.get('message')     as string).trim(),
      avatarUrl:   (formData.get('avatarUrl')   as string)?.trim() || null,
      isPublic:    false,
    },
  });
}

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

export async function createTestimonial(formData: FormData) {
  await requireAdmin();
  await prisma.testimonial.create({
    data: {
      name:        (formData.get('name')        as string).trim(),
      designation: (formData.get('designation') as string).trim(),
      company:     (formData.get('company')     as string).trim(),
      companyUrl:  (formData.get('companyUrl')  as string)?.trim() || null,
      message:     (formData.get('message')     as string).trim(),
      avatarUrl:   (formData.get('avatarUrl')   as string)?.trim() || null,
      isPublic:    formData.get('isPublic') === 'true',
      order:       parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/testimonials');
}

export async function updateTestimonial(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  await prisma.testimonial.update({
    where: { id },
    data: {
      name:        (formData.get('name')        as string).trim(),
      designation: (formData.get('designation') as string).trim(),
      company:     (formData.get('company')     as string).trim(),
      companyUrl:  (formData.get('companyUrl')  as string)?.trim() || null,
      message:     (formData.get('message')     as string).trim(),
      avatarUrl:   (formData.get('avatarUrl')   as string)?.trim() || null,
      isPublic:    formData.get('isPublic') === 'true',
      order:       parseInt(formData.get('order') as string, 10) || 0,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/testimonials');
}

export async function toggleTestimonialPublic(formData: FormData) {
  await requireAdmin();
  const id       = formData.get('id')       as string;
  const isPublic = formData.get('isPublic') === 'true';
  await prisma.testimonial.update({ where: { id }, data: { isPublic } });
  revalidatePath('/');
  revalidatePath('/admin/testimonials');
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id: formData.get('id') as string } });
  revalidatePath('/');
  revalidatePath('/admin/testimonials');
}

export async function batchUpdateTestimonialOrder(formData: FormData) {
  await requireAdmin();
  const ids = JSON.parse(formData.get('ids') as string) as string[];
  await Promise.all(
    ids.map((id, order) => prisma.testimonial.update({ where: { id }, data: { order } })),
  );
  revalidatePath('/');
  revalidatePath('/admin/testimonials');
}
