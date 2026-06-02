import { prisma } from '@/lib/prisma';
import StatsManager from './StatsManager';

export default async function StatsAdminPage() {
  const stats = await prisma.stat.findMany({ orderBy: { order: 'asc' } });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">About Stats</h1>
      <p className="text-sm text-zinc-500 mb-8">
        The numbers displayed in the About section (e.g. &quot;7+ Years Experience&quot;).
      </p>
      <StatsManager initialStats={stats} />
    </div>
  );
}
