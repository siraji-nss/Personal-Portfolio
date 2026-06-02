import { prisma } from '@/lib/prisma';
import EducationManager from './EducationManager';

export default async function EducationAdminPage() {
  const education = await prisma.education.findMany({ orderBy: { order: 'asc' } });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Education</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Academic entries shown in the Resume section. Click <span className="text-indigo-400">Edit</span> on any entry to update it.
      </p>
      <EducationManager initialEducation={education} />
    </div>
  );
}
