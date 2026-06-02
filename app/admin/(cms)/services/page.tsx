import { prisma } from '@/lib/prisma';
import ServicesManager from './ServicesManager';

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });

  const data = services.map(s => ({
    id: s.id,
    number: s.number,
    icon: s.icon,
    title: s.title,
    description: s.description,
    tags: s.tags,
    order: s.order,
  }));

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Services</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Manage the services you offer. Click <span className="text-indigo-400">Edit</span> on any row to expand and update it.
        Icon must be a Lucide icon name (e.g. <code className="text-indigo-400">Briefcase</code>).
      </p>
      <ServicesManager initialServices={data} />
    </div>
  );
}
