import { prisma } from '@/lib/prisma';
import TestimonialsManager from './TestimonialsManager';
import { headers } from 'next/headers';

export default async function TestimonialsAdminPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } });

  const headersList = headers();
  const host   = headersList.get('host') ?? 'localhost:3000';
  const proto  = host.startsWith('localhost') ? 'http' : 'https';
  const submitUrl = `${proto}://${host}/testimonials/submit`;

  const data = testimonials.map(t => ({
    id: t.id,
    name: t.name,
    designation: t.designation,
    profileUrl: t.profileUrl,
    company: t.company,
    companyUrl: t.companyUrl,
    message: t.message,
    avatarUrl: t.avatarUrl,
    isPublic: t.isPublic,
    order: t.order,
    createdAt: t.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Testimonials</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Manage client &amp; collaborator testimonials. Toggle the eye icon to publish or hide.
        Share the form link so others can submit directly.
      </p>
      <TestimonialsManager initialTestimonials={data} submitUrl={submitUrl} />
    </div>
  );
}
