import { prisma } from '@/lib/prisma';
import { createClient, deleteClient } from '@/app/actions/clients';
import { Trash2 } from 'lucide-react';

const COMPANIES = ['Arbree', 'Opus', 'HyperTag', 'Masleap', 'Koderden', 'Technonix'];

export default async function ClientsAdminPage() {
  const clients = await prisma.client.findMany({ orderBy: [{ company: 'asc' }, { order: 'asc' }] });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Clients</h1>
      <p className="text-sm text-zinc-500 mb-8">Client logos shown in the filterable Clients grid. The <code className="text-indigo-400">company</code> field determines which filter tab shows them.</p>

      <div className="space-y-2 mb-10">
        {clients.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3 bg-white/[0.025] border border-white/[0.07] rounded-xl">
            <div>
              <p className="text-sm font-medium text-white">{c.name}</p>
              <p className="text-xs text-zinc-600">{c.company}{c.website ? ` · ${c.website}` : ''}</p>
            </div>
            <form action={deleteClient}>
              <input type="hidden" name="id" value={c.id} />
              <button type="submit" className="text-zinc-700 hover:text-red-400 transition-colors p-1.5">
                <Trash2 size={14} />
              </button>
            </form>
          </div>
        ))}
        {clients.length === 0 && <p className="text-sm text-zinc-700">No clients yet.</p>}
      </div>

      <div className="border-t border-white/[0.06] pt-8">
        <h2 className="text-base font-semibold text-white mb-5">Add Client</h2>
        <form action={createClient} className="space-y-4 max-w-xl">
          <Field name="name" label="Client Name" placeholder="Planet Education Network" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Company (Filter Key)</label>
              <select name="company" className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/40">
                {COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Field name="order" label="Order" placeholder="0" type="number" />
          </div>
          <Field name="logoUrl" label="Logo URL" placeholder="https://..." />
          <Field name="website" label="Website (optional)" placeholder="https://..." />
          <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">
            Add Client
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ name, label, placeholder, type = 'text' }: { name: string; label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">{label}</label>
      <input name={name} placeholder={placeholder} type={type} className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all" />
    </div>
  );
}
