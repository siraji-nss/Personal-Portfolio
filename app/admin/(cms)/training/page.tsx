import { prisma } from '@/lib/prisma';
import TrainingManager from './TrainingManager';

export default async function TrainingAdminPage() {
  const trainings = await prisma.training.findMany({ orderBy: { order: 'asc' } });

  const data = trainings.map((t) => ({
    id: t.id,
    title: t.title,
    institution: t.institution,
    year: t.year,
    description: t.description,
    order: t.order,
  }));

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Training &amp; Certifications</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Training records shown in the Resume section under Education.
      </p>
      <TrainingManager initialTrainings={data} />
    </div>
  );
}
