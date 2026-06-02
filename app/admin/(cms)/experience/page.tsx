import { prisma } from '@/lib/prisma';
import ExperienceManager from './ExperienceManager';

export default async function ExperienceAdminPage() {
  const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } });

  const data = experiences.map(e => ({
    id: e.id,
    role: e.role,
    company: e.company,
    period: e.period,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate?.toISOString() ?? null,
    description: e.description,
    projects: e.projects,
    note: e.note,
    isCurrent: e.isCurrent,
    order: e.order,
  }));

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Experience</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Work history shown in the Resume section. Click <span className="text-indigo-400">Edit</span> on any entry to update it.
      </p>
      <ExperienceManager initialExperiences={data} />
    </div>
  );
}
