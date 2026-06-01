import { prisma } from '@/lib/prisma';
import { createService, deleteService } from '@/app/actions/services';
import { Trash2 } from 'lucide-react';

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Services</h1>
      <p className="text-sm text-zinc-500 mb-8">Manage the services you offer. Icon must be a Lucide icon name (e.g. <code className="text-indigo-400">Briefcase</code>).</p>

      <div className="space-y-2 mb-10">
        {services.map((svc) => (
          <div key={svc.id} className="flex items-center justify-between px-4 py-3 bg-white/[0.025] border border-white/[0.07] rounded-xl">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-zinc-600 w-5">{svc.number}</span>
              <div>
                <p className="text-sm font-medium text-white">{svc.title}</p>
                <p className="text-xs text-zinc-600">{svc.icon} · {svc.tags.join(', ')}</p>
              </div>
            </div>
            <form action={deleteService}>
              <input type="hidden" name="id" value={svc.id} />
              <button type="submit" className="text-zinc-700 hover:text-red-400 transition-colors p-1.5">
                <Trash2 size={14} />
              </button>
            </form>
          </div>
        ))}
        {services.length === 0 && <p className="text-sm text-zinc-700">No services yet.</p>}
      </div>

      <div className="border-t border-white/[0.06] pt-8">
        <h2 className="text-base font-semibold text-white mb-5">Add Service</h2>
        <form action={createService} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <Field name="number" label="Number" placeholder="01" />
            <Field name="icon" label="Lucide Icon Name" placeholder="Briefcase" />
          </div>
          <Field name="title" label="Title" placeholder="Business Consultation" />
          <Field name="description" label="Description" textarea placeholder="Strategic guidance for..." />
          <Field name="tags" label="Tags (comma-separated)" placeholder="Strategy, Advisory, Market Entry" />
          <Field name="order" label="Order" placeholder="0" type="number" />
          <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">
            Add Service
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ name, label, placeholder, textarea = false, type = 'text' }: {
  name: string; label: string; placeholder: string; textarea?: boolean; type?: string;
}) {
  const cls = 'w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">{label}</label>
      {textarea ? <textarea name={name} placeholder={placeholder} rows={3} className={cls} /> : <input name={name} placeholder={placeholder} type={type} className={cls} />}
    </div>
  );
}
