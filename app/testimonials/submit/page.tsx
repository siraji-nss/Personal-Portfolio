import { prisma } from '@/lib/prisma';
import Navigation from '@/components/Navigation';
import SubmitTestimonialForm from './SubmitTestimonialForm';

export const metadata = {
  title: 'Submit a Testimonial — Nazmus Sakib Siraji',
};

export default async function SubmitTestimonialPage() {
  const heroConfig = await prisma.heroConfig.findUnique({
    where: { id: 'main' },
    select: { fullName: true, avatarUrl: true },
  });

  return (
    <>
      <Navigation
        fullName={heroConfig?.fullName ?? 'Nazmus Sakib Siraji'}
        avatarUrl={heroConfig?.avatarUrl}
      />
      <SubmitTestimonialForm />
    </>
  );
}
