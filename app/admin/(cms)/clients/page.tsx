import { prisma } from '@/lib/prisma';
import ClientsManager from './ClientsManager';

export default async function ClientsAdminPage() {
  const clients = await prisma.client.findMany({ orderBy: [{ company: 'asc' }, { order: 'asc' }] });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Clients</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Client logos shown in the filterable Clients grid. The <code className="text-indigo-400">company</code> field
        determines which filter tab shows them. Click <span className="text-indigo-400">Edit</span> on any client to update it.
      </p>
      <ClientsManager initialClients={clients} />
    </div>
  );
}
